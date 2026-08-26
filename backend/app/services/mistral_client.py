"""
Thin client for Mistral AI's chat completions API.
Every call is best-effort: on any failure (missing key, network error, timeout,
malformed JSON) it returns None so callers can fall back to deterministic logic
instead of breaking the request.
"""
import json
import re
import httpx
from typing import Optional
from app.core.config import settings

MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"


def is_configured() -> bool:
    return bool(settings.MISTRAL_API_KEY)


def _strip_code_fence(text: str) -> str:
    """Defensive cleanup in case the model wraps JSON in a markdown fence."""
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    return match.group(1) if match else text


def chat_json(system_prompt: str, user_prompt: str, temperature: float = 0.4) -> Optional[dict]:
    """Call Mistral chat completions requesting a strict JSON object response.
    Returns the parsed dict, or None if unavailable/failed for any reason."""
    if not is_configured():
        return None

    try:
        with httpx.Client(timeout=30.0) as client:
            res = client.post(
                MISTRAL_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.MISTRAL_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": temperature,
                    "response_format": {"type": "json_object"},
                },
            )
            res.raise_for_status()
            content = res.json()["choices"][0]["message"]["content"]
            return json.loads(_strip_code_fence(content))
    except Exception as err:
        print(f"[Mistral AI] Falling back to heuristic engine: {err}")
        return None
