import base64
import json
from openai import OpenAI
from app.config import OPENAI_API_KEY
import re

def extract_json(text):
    text = text.strip()

    # Remove markdown fences if present
    if text.startswith("```"):
        parts = text.split("```")
        if len(parts) >= 2:
            text = parts[1]

    text = text.strip()

    # Attempt direct JSON parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # Fallback: extract JSON substring
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass

    return None

client = OpenAI(api_key=OPENAI_API_KEY)

async def detect_food(file):
    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    prompt = """
You are a professional food recognition and nutrition analysis AI.

Carefully analyze the image and identify ALL visible foods.

Even if uncertain, make your best guess.

Always identify:
- The main food item
- Supporting ingredients
- Portion sizes

NEVER respond with "unknown" unless the image truly does not contain food.

Return ONLY valid JSON in this exact format:

{
  "main": "main dish name",
  "components": ["ingredient1","ingredient2","ingredient3"],
  "portions": {
    "ingredient1": "small|medium|large",
    "ingredient2": "small|medium|large",
    "ingredient3": "small|medium|large"
  }
}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=300
    )

    raw = response.choices[0].message.content.strip()
    print("RAW MODEL OUTPUT:\n", raw)

    parsed = extract_json(raw)

    if not parsed:
        print("⚠️ JSON extraction failed.")
        return {
            "main": "unknown",
            "components": [],
            "portions": {}
        }

    return parsed