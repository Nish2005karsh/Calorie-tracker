// Local replacement for the old n8n "Lovable Calorie App Backend" workflow.
//
// The n8n flow was: webhook -> OpenAI Vision (analyze_image) -> LLM + structured
// parser (extract_results) -> respond. We now do the whole thing client-side with
// a single Google Gemini call: Gemini's `responseSchema` enforces the exact JSON
// shape, so the vision analysis AND the JSON-cleanup step happen in one request.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
// Override the model via VITE_GEMINI_MODEL if you like; this default is fast,
// vision-capable, and available on the free tier.
const GEMINI_MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || "gemini-2.0-flash";

// Shape returned to the app. Matches the field names the old n8n webhook returned
// so the rest of the app (AddMeal, etc.) keeps working unchanged.
export interface MealAnalysis {
    mealName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    confidenceScore: number;
    healthScore: number;
    rationale: string;
}

// Ported verbatim from the n8n `analyze_image` node so behavior stays identical.
const NUTRITION_PROMPT = `<identity>
You are a world-class AI Nutrition Analyst.
</identity>

<mission>
Your mission is to perform a detailed nutritional analysis of a meal from a single image. You will identify the food, estimate portion sizes, calculate nutritional values, and provide a holistic health assessment.
</mission>

### Analysis Protocol
1.  **Identify:** Scrutinize the image to identify the meal and all its distinct components. Use visual cues and any visible text or branding for accurate identification.
2.  **Estimate:** For each component, estimate the portion size in grams or standard units (e.g., 1 cup, 1 filet). This is critical for accuracy.
3.  **Calculate:** Based on the identification and portion estimates, calculate the total nutritional information for the entire meal.
4.  **Assess & Justify:** Evaluate the meal's overall healthiness and your confidence in the analysis. Justify your assessments based on the provided rubrics.

#### Error Handling
If the image does not contain food or is too ambiguous to analyze, return a result where confidenceScore is 0.0, mealName is "Unidentifiable", and all other numeric fields are 0.

#### Field Definitions
*   mealName: A concise name for the meal (e.g., "Chicken Caesar Salad", "Starbucks Grande Latte with Whole Milk"). If multiple items of food are present in the image, include that in the name like "2 Big Macs".
*   calories: Total estimated kilocalories.
*   protein: Total estimated grams of protein.
*   carbs: Total estimated grams of carbohydrates.
*   fat: Total estimated grams of fat.
*   fiber: Total estimated grams of fiber.
*   sugar: Total estimated grams of sugar (a subset of carbohydrates).
*   sodium: Total estimated milligrams (mg) of sodium.
*   confidenceScore: A float from 0.0 to 1.0 indicating your certainty. Base this on image clarity, how easily the food is identified, and ambiguity in portion size or hidden ingredients (e.g., sauces, oils).
*   healthScore: An integer from 0 (extremely unhealthy) to 10 (highly nutritious and balanced). Base this on level of processing, macronutrient balance, sugar and sodium content, and estimated micronutrient density.
*   rationale: A brief (1-2 sentence) explanation justifying the healthScore and confidenceScore. State key assumptions made (e.g., "Assumed dressing was a standard caesar" or "Portion size for rice was difficult to estimate").`;

// Gemini structured-output schema (OpenAPI subset) — guarantees valid JSON back,
// replacing the n8n structured/auto-fixing output parser nodes.
const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        mealName: { type: "string" },
        calories: { type: "integer" },
        protein: { type: "integer" },
        carbs: { type: "integer" },
        fat: { type: "integer" },
        fiber: { type: "integer" },
        sugar: { type: "integer" },
        sodium: { type: "integer" },
        confidenceScore: { type: "number" },
        healthScore: { type: "integer" },
        rationale: { type: "string" },
    },
    required: [
        "mealName", "calories", "protein", "carbs", "fat",
        "fiber", "sugar", "sodium", "confidenceScore", "healthScore", "rationale",
    ],
    propertyOrdering: [
        "mealName", "calories", "protein", "carbs", "fat",
        "fiber", "sugar", "sodium", "confidenceScore", "healthScore", "rationale",
    ],
};

// Read a File as a data URL and split off the base64 payload + mime type, which is
// what Gemini's inline_data part expects.
const fileToInlineData = (file: File) =>
    new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string; // e.g. "data:image/jpeg;base64,XXXX"
            const [meta, base64] = dataUrl.split(",");
            const mimeMatch = meta.match(/data:(.*?);base64/);
            resolve({
                data: base64,
                mimeType: mimeMatch?.[1] || file.type || "image/jpeg",
            });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

// Analyze a meal image and return structured nutrition data.
export const analyzeMeal = async (imageFile: File): Promise<MealAnalysis> => {
    if (!GEMINI_API_KEY) {
        throw new Error(
            "Missing VITE_GEMINI_API_KEY. Add it to your .env.local and restart the dev server."
        );
    }

    const { data: base64Image, mimeType } = await fileToInlineData(imageFile);

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: NUTRITION_PROMPT },
                        { inline_data: { mime_type: mimeType, data: base64Image } },
                    ],
                },
            ],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.2,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini error response:", errorText);

        // 429 = quota / rate limit exceeded. Surface a clear message so it's
        // obvious the AI API limit is exhausted (not some other failure).
        if (response.status === 429) {
            throw new Error("API Exhausted — the Gemini API quota/rate limit has been reached. Please try again later or upgrade the API plan.");
        }
        // 400/403 usually means a missing or invalid API key.
        if (response.status === 400 || response.status === 403) {
            throw new Error("AI request rejected — check that VITE_GEMINI_API_KEY is set and valid.");
        }
        throw new Error(`Failed to analyze meal (error ${response.status}).`);
    }

    const result = await response.json();

    // Gemini returns the JSON string in candidates[0].content.parts[0].text
    const text: string | undefined = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        console.error("Unexpected Gemini response:", result);
        throw new Error("No analysis returned from Gemini");
    }

    const analysis = JSON.parse(text) as MealAnalysis;

    console.log("=== AI ANALYSIS (Gemini) ===");
    console.log("Meal:", analysis.mealName);
    console.log("Calories:", analysis.calories);
    console.log(`Protein: ${analysis.protein}g  Carbs: ${analysis.carbs}g  Fat: ${analysis.fat}g`);
    console.log("Full data:", analysis);

    return analysis;
};
