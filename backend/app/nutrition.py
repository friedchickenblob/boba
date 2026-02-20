import requests
from app.config import USDA_API_KEY

BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

def search_food(query):
    params = {
        "query": query,
        "api_key": USDA_API_KEY,
        "pageSize": 1
    }

    res = requests.get(BASE_URL, params=params)
    if res.status_code != 200:
        return None

    try:
        data = res.json()
    except Exception:
        return None

    if not data.get("foods"):
        return None

    return data["foods"][0]

PORTION_MULTIPLIER = {
    "small": 1.5,
    "medium": 2,
    "large": 2.5
}

def get_nutrition(main, components, portions):
    total = {
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbs": 0
    }

    # ---- Main dish ----
    main_result = search_food(main)
    if main_result:
        nutrients = main_result.get("foodNutrients", [])

        def find(name):
            for n in nutrients:
                if name.lower() in n["nutrientName"].lower():
                    return n.get("value", 0)
            return 0

        total["calories"] += find("Energy")
        total["protein"] += find("Protein")
        total["fat"] += find("Total lipid")
        total["carbs"] += find("Carbohydrate")

    # ---- Component refinement (15% boost) ----
    for food in components:
        result = search_food(food)
        if not result:
            continue

        size = portions.get(food, "medium")
        multiplier = PORTION_MULTIPLIER.get(size, 1.0)

        nutrients = result.get("foodNutrients", [])

        def find(name):
            for n in nutrients:
                if name.lower() in n["nutrientName"].lower():
                    return n.get("value", 0)
            return 0

        total["calories"] += find("Energy") * multiplier * 0.15
        total["protein"] += find("Protein") * multiplier * 0.15
        total["fat"] += find("Total lipid") * multiplier * 0.15
        total["carbs"] += find("Carbohydrate") * multiplier * 0.15

    return {
        "main": main,
        "total": {k: round(v, 2) for k, v in total.items()},
        "confidence": "medium-high"
    }