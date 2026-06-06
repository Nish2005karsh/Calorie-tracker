// Calorie & macro goal calculation using the Mifflin-St Jeor equation.
// All math is done in metric (kg / cm); use the converters for imperial input.

export type UnitSystem = "metric" | "imperial";

export interface GoalInputs {
    gender?: string;            // "male" | "female" | "other"
    weightKg: number;           // current weight
    heightCm: number;
    age: number;
    goalWeightKg: number;       // desired weight
    workoutFrequency?: string;  // "0-2" | "3-5" | "6+" | "sedentary"
    weightSpeedLbs?: number;    // lbs per week (0.2 | 1.0 | 3.0)
}

export interface ComputedGoals {
    calorieGoal: number;
    proteinGoal: number;
    carbsGoal: number;
    fatsGoal: number;
    healthScore: number;        // 1-10
    weightToChangeLbs: number;  // absolute lbs to lose/gain
    direction: "lose" | "gain" | "maintain";
    targetDate: Date;
}

// --- Unit conversions ---
const LB_PER_KG = 2.2046226218;
export const lbsToKg = (lbs: number) => lbs / LB_PER_KG;
export const kgToLbs = (kg: number) => kg * LB_PER_KG;
export const ftInToCm = (feet: number, inches: number) => (feet * 12 + inches) * 2.54;
export const cmToFtIn = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    return { feet, inches };
};

// Activity multiplier from the onboarding workout-frequency answer.
const activityMultiplier = (frequency?: string): number => {
    switch (frequency) {
        case "sedentary": return 1.2;
        case "0-2": return 1.375;
        case "3-5": return 1.55;
        case "6+": return 1.725;
        default: return 1.375;
    }
};

// ~3500 kcal per pound of body weight => daily calorie delta for a given
// weekly rate (lbs/week).
const dailyDeltaForSpeed = (speedLbs: number) => Math.round((speedLbs * 3500) / 7);

const healthScoreFromBmi = (weightKg: number, heightCm: number): number => {
    const heightM = heightCm / 100;
    if (heightM <= 0) return 7;
    const bmi = weightKg / (heightM * heightM);
    if (bmi >= 18.5 && bmi < 25) return 9;
    if (bmi >= 25 && bmi < 30) return 6;
    if (bmi >= 30) return 4;
    return 6; // underweight
};

export const computeGoals = (inputs: GoalInputs): ComputedGoals => {
    const { gender, weightKg, heightCm, age, goalWeightKg } = inputs;
    const speedLbs = inputs.weightSpeedLbs ?? 1.0;

    // 1. Basal Metabolic Rate (Mifflin-St Jeor)
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === "male") bmr += 5;
    else if (gender === "female") bmr -= 161;
    else bmr -= 78; // average of the two constants for "other"/unknown

    // 2. Total Daily Energy Expenditure
    const tdee = bmr * activityMultiplier(inputs.workoutFrequency);

    // 3. Apply goal direction
    let direction: ComputedGoals["direction"] = "maintain";
    if (goalWeightKg < weightKg) direction = "lose";
    else if (goalWeightKg > weightKg) direction = "gain";

    const delta = dailyDeltaForSpeed(speedLbs);
    let calorieGoal = tdee;
    if (direction === "lose") calorieGoal = tdee - delta;
    else if (direction === "gain") calorieGoal = tdee + delta;

    // Safety floor so we never recommend a dangerously low intake.
    const floor = gender === "female" ? 1200 : 1500;
    calorieGoal = Math.max(calorieGoal, floor);
    calorieGoal = Math.round(calorieGoal / 10) * 10; // round to nearest 10

    // 4. Macros: 2 g/kg protein, 25% of calories from fat, the rest carbs.
    const proteinGoal = Math.round(weightKg * 2.0);
    const fatsGoal = Math.round((calorieGoal * 0.25) / 9);
    const carbsCalories = calorieGoal - (proteinGoal * 4 + fatsGoal * 9);
    const carbsGoal = Math.round(Math.max(carbsCalories, 0) / 4);

    // 5. Projected target date
    const weightToChangeLbs = Math.abs(kgToLbs(weightKg) - kgToLbs(goalWeightKg));
    const weeks = speedLbs > 0 && direction !== "maintain" ? weightToChangeLbs / speedLbs : 0;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.round(weeks * 7));

    return {
        calorieGoal,
        proteinGoal,
        carbsGoal,
        fatsGoal,
        healthScore: healthScoreFromBmi(weightKg, heightCm),
        weightToChangeLbs: Math.round(weightToChangeLbs),
        direction,
        targetDate,
    };
};
