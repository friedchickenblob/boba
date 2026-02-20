import base64
import json
from openai import OpenAI
from app.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

async def detect_food(file):
    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    prompt = """
You are a professional nutrition analysis AI.

Analyze the image and identify the main food item and its components.
Estimate portion size for each component.

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

Rules:
- Choose ONE main dish.
- Components should NOT include the main dish.
- Keep ingredients realistic.
- No explanations, only JSON.
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

    text = response.choices[0].message.content.strip()

    try:
        return json.loads(text)
    except Exception:
        return {
            "main": "unknown",
            "components": [],
            "portions": {}
        }