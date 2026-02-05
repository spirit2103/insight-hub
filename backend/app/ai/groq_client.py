import requests, os, logging

logger = logging.getLogger("uvicorn.error")

def ask_groq(prompt):
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GROQ_API-KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set")

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}"
        },
        json={
            "model": "openai/gpt-oss-120b",
            "messages": [{"role": "user", "content": prompt}]
        },
        timeout=30
    )
    if response.status_code != 200:
        logger.error("Groq error %s: %s", response.status_code, response.text)
        raise RuntimeError(f"Groq API error: {response.status_code}")
    data = response.json()
    return data["choices"][0]["message"]["content"]
