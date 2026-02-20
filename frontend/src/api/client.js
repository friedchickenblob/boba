export async function analyzeFood(file, portion) {
    console.log("Analyzing file:", file);

    let multiplier = 1;

    if (portion === "small") multiplier = 0.75;
    if (portion === "medium") multiplier = 1;
    if (portion === "large") multiplier = 1.5;

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        food: "Grilled Chicken Breast",
        calories: Math.round(165 * multiplier),
        protein: Math.round(31 * multiplier),
        carbs: Math.round(0 * multiplier),
        fat: Math.round(3.6 * multiplier)
    };
}