// Look up a scanned barcode against the free Open Food Facts database.
// Returns nutrition values PER 100g (the user can scale them in the form).

export interface BarcodeProduct {
    mealName: string;
    calories: number; // per 100g
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number; // mg per 100g
}

export const lookupBarcode = async (barcode: string): Promise<BarcodeProduct> => {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
        barcode
    )}.json?fields=product_name,brands,nutriments`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Lookup failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 1 || !data.product) {
        throw new Error("Product not found in Open Food Facts.");
    }

    const p = data.product;
    const n = p.nutriments || {};
    const num = (v: unknown) => (typeof v === "number" ? v : parseFloat(String(v)) || 0);

    const name = [p.brands, p.product_name].filter(Boolean).join(" ") || `Product ${barcode}`;

    return {
        mealName: name,
        calories: Math.round(num(n["energy-kcal_100g"])),
        protein: Math.round(num(n["proteins_100g"])),
        carbs: Math.round(num(n["carbohydrates_100g"])),
        fat: Math.round(num(n["fat_100g"])),
        fiber: Math.round(num(n["fiber_100g"])),
        sugar: Math.round(num(n["sugars_100g"])),
        sodium: Math.round(num(n["sodium_100g"]) * 1000), // grams -> mg
    };
};
