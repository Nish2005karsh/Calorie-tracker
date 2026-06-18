// Mock meal-analysis data for demos when the live AI API is unavailable
// (e.g. quota exhausted). Enabled via VITE_USE_MOCK_ANALYSIS=true.
//
// It matches the uploaded image by FILENAME keyword — so naming a photo
// `apple.jpg`, `pizza.png`, `biryani.jpg`, etc. makes it return that food.
// Any unrecognized image returns a realistic fallback meal.

import { MealAnalysis } from "./gemini";

interface MockFood {
    keywords: string[];
    data: MealAnalysis;
}

const FOODS: MockFood[] = [
    { keywords: ["apple"], data: { mealName: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, sugar: 19, sodium: 2, confidenceScore: 0.96, healthScore: 9, rationale: "A fresh medium apple — naturally low in calories and rich in fiber." } },
    { keywords: ["banana"], data: { mealName: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1, confidenceScore: 0.95, healthScore: 8, rationale: "A ripe banana — a great source of potassium and quick energy." } },
    { keywords: ["orange"], data: { mealName: "Orange", calories: 62, protein: 1, carbs: 15, fat: 0, fiber: 3, sugar: 12, sodium: 0, confidenceScore: 0.95, healthScore: 9, rationale: "A whole orange — high in vitamin C and fiber, low in calories." } },
    { keywords: ["pizza"], data: { mealName: "2 Slices of Pizza", calories: 570, protein: 24, carbs: 68, fat: 22, fiber: 4, sugar: 8, sodium: 1200, confidenceScore: 0.90, healthScore: 3, rationale: "Cheese pizza — high in refined carbs and sodium. Assumed two regular slices." } },
    { keywords: ["burger", "hamburger", "cheeseburger"], data: { mealName: "Cheeseburger", calories: 480, protein: 25, carbs: 39, fat: 25, fiber: 2, sugar: 8, sodium: 920, confidenceScore: 0.90, healthScore: 3, rationale: "A cheeseburger — protein-rich but high in saturated fat and sodium." } },
    { keywords: ["fries", "fry"], data: { mealName: "French Fries", calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sugar: 0, sodium: 250, confidenceScore: 0.92, healthScore: 2, rationale: "Deep-fried potatoes — calorie-dense with little nutritional value." } },
    { keywords: ["salad"], data: { mealName: "Chicken Caesar Salad", calories: 360, protein: 30, carbs: 12, fat: 22, fiber: 4, sugar: 4, sodium: 680, confidenceScore: 0.90, healthScore: 7, rationale: "Grilled chicken over greens. Assumed a standard caesar dressing." } },
    { keywords: ["rice"], data: { mealName: "Bowl of Steamed Rice", calories: 240, protein: 4, carbs: 53, fat: 0, fiber: 1, sugar: 0, sodium: 2, confidenceScore: 0.90, healthScore: 6, rationale: "Plain steamed white rice — a clean carbohydrate source." } },
    { keywords: ["chicken"], data: { mealName: "Grilled Chicken Breast", calories: 280, protein: 53, carbs: 0, fat: 6, fiber: 0, sugar: 0, sodium: 130, confidenceScore: 0.92, healthScore: 8, rationale: "Lean grilled chicken — an excellent high-protein, low-fat option." } },
    { keywords: ["pasta", "spaghetti"], data: { mealName: "Pasta with Marinara", calories: 420, protein: 14, carbs: 72, fat: 8, fiber: 6, sugar: 10, sodium: 600, confidenceScore: 0.88, healthScore: 6, rationale: "Pasta in tomato sauce — balanced carbs with moderate sodium." } },
    { keywords: ["sandwich"], data: { mealName: "Sandwich", calories: 350, protein: 18, carbs: 40, fat: 13, fiber: 4, sugar: 6, sodium: 720, confidenceScore: 0.88, healthScore: 6, rationale: "A filled sandwich — reasonably balanced; sodium depends on fillings." } },
    { keywords: ["egg"], data: { mealName: "2 Boiled Eggs", calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0, sugar: 1, sodium: 124, confidenceScore: 0.95, healthScore: 8, rationale: "Boiled eggs — protein-dense with healthy fats." } },
    { keywords: ["oat", "oatmeal", "porridge"], data: { mealName: "Bowl of Oatmeal", calories: 220, protein: 8, carbs: 40, fat: 4, fiber: 6, sugar: 8, sodium: 140, confidenceScore: 0.92, healthScore: 9, rationale: "Wholegrain oats — high in fiber and great for sustained energy." } },
    { keywords: ["coffee", "latte", "cappuccino"], data: { mealName: "Latte", calories: 130, protein: 7, carbs: 13, fat: 5, fiber: 0, sugar: 12, sodium: 100, confidenceScore: 0.90, healthScore: 6, rationale: "A milk-based coffee. Assumed whole milk, no added syrup." } },
    { keywords: ["smoothie", "shake"], data: { mealName: "Fruit Smoothie", calories: 250, protein: 6, carbs: 50, fat: 3, fiber: 5, sugar: 38, sodium: 60, confidenceScore: 0.88, healthScore: 7, rationale: "A blended fruit smoothie — nutritious but naturally high in sugar." } },
    { keywords: ["biryani"], data: { mealName: "Chicken Biryani", calories: 600, protein: 28, carbs: 75, fat: 22, fiber: 4, sugar: 4, sodium: 980, confidenceScore: 0.85, healthScore: 5, rationale: "Rice cooked with chicken and spices — flavorful but calorie-dense." } },
    { keywords: ["dosa"], data: { mealName: "Masala Dosa", calories: 390, protein: 8, carbs: 60, fat: 12, fiber: 4, sugar: 4, sodium: 720, confidenceScore: 0.86, healthScore: 6, rationale: "A crispy dosa with potato filling. Assumed one large serving." } },
    { keywords: ["idli"], data: { mealName: "3 Idli", calories: 175, protein: 6, carbs: 36, fat: 1, fiber: 3, sugar: 1, sodium: 400, confidenceScore: 0.90, healthScore: 7, rationale: "Steamed rice cakes — light, low-fat and easy to digest." } },
    { keywords: ["samosa"], data: { mealName: "2 Samosas", calories: 520, protein: 9, carbs: 58, fat: 28, fiber: 5, sugar: 3, sodium: 800, confidenceScore: 0.88, healthScore: 3, rationale: "Deep-fried pastry with spiced filling — high in fat and refined carbs." } },
    { keywords: ["paneer"], data: { mealName: "Paneer Butter Masala", calories: 450, protein: 18, carbs: 18, fat: 34, fiber: 4, sugar: 9, sodium: 900, confidenceScore: 0.85, healthScore: 5, rationale: "Paneer in a rich, buttery gravy — protein-rich but high in fat." } },
    { keywords: ["roti", "chapati", "naan"], data: { mealName: "2 Rotis", calories: 220, protein: 7, carbs: 46, fat: 4, fiber: 6, sugar: 1, sodium: 300, confidenceScore: 0.90, healthScore: 7, rationale: "Wholewheat flatbread — a good source of fiber and complex carbs." } },
    { keywords: ["dal", "lentil"], data: { mealName: "Bowl of Dal", calories: 230, protein: 14, carbs: 32, fat: 5, fiber: 9, sugar: 3, sodium: 600, confidenceScore: 0.90, healthScore: 8, rationale: "Cooked lentils — an excellent plant-based protein and fiber source." } },
];

// Realistic fallbacks for images we can't match by name.
const FALLBACKS: MealAnalysis[] = [
    { mealName: "Grilled Chicken with Rice & Veggies", calories: 520, protein: 42, carbs: 48, fat: 14, fiber: 6, sugar: 5, sodium: 540, confidenceScore: 0.87, healthScore: 8, rationale: "A balanced plate of lean protein, complex carbs and vegetables." },
    { mealName: "Mixed Vegetable Bowl", calories: 380, protein: 12, carbs: 55, fat: 12, fiber: 9, sugar: 9, sodium: 480, confidenceScore: 0.86, healthScore: 8, rationale: "A colorful vegetable bowl — high in fiber and micronutrients." },
    { mealName: "Pancakes with Syrup", calories: 520, protein: 10, carbs: 82, fat: 16, fiber: 3, sugar: 34, sodium: 560, confidenceScore: 0.85, healthScore: 4, rationale: "Pancakes with syrup — a sweet treat high in sugar and refined carbs." },
];

// Simple deterministic hash so the same image always maps to the same fallback.
const hashString = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
};

export const getMockAnalysis = (file: File): MealAnalysis => {
    const name = (file?.name || "").toLowerCase();

    for (const food of FOODS) {
        if (food.keywords.some((kw) => name.includes(kw))) {
            return { ...food.data };
        }
    }

    const fallback = FALLBACKS[hashString(name) % FALLBACKS.length];
    return { ...fallback };
};
