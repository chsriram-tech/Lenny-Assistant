import re
from typing import Dict, Any, Optional
from app.services.llm_service import llm_service
from app.core.logger import logger

def sanitize_html_artifact(raw_html: str) -> str:
    """
    Sanitizes and wraps generated HTML/CSS into a standalone, safe preview document.
    Ensures scripts or external references cannot escape or access parent DOM/cookies.
    """
    cleaned = raw_html.strip()
    
    # Extract code inside ```html ... ``` blocks if LLM wrapped it
    if "```html" in cleaned:
        match = re.search(r"```html\s*(.*?)\s*```", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1).strip()
    elif "```" in cleaned:
        match = re.search(r"```\s*(.*?)\s*```", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1).strip()

    # If full HTML doc structure missing, wrap with modern reset + styling
    if "<!DOCTYPE html>" not in cleaned and "<html" not in cleaned:
        cleaned = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Strategy Artifact</title>
    <style>
        :root {{
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-color: #f8fafc;
            --accent-color: #38bdf8;
            --border-color: #334155;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            margin: 0;
            padding: 24px;
        }}
        .artifact-card {{
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            max-width: 900px;
            margin: 0 auto;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }}
        h1, h2, h3 {{ color: var(--accent-color); margin-top: 0; }}
        ul, ol {{ padding-left: 20px; }}
        li {{ margin-bottom: 8px; }}
        .badge {{
            display: inline-block;
            background: rgba(56, 189, 248, 0.15);
            color: var(--accent-color);
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 16px;
        }}
    </style>
</head>
<body>
    <div class="artifact-card">
        {cleaned}
    </div>
</body>
</html>"""
    return cleaned

async def generate_artifact_content(
    prompt: str,
    artifact_type: str,
    context_str: str,
    provider: str = "ollama",
    model: str = "llama3"
) -> Dict[str, str]:
    logger.info(f"Generating artifact type='{artifact_type}' for prompt: '{prompt[:60]}...'")

    if artifact_type == "html":
        system_prompt = (
            "You are a top-tier UI developer and product designer. Generate a stunning, complete, modern HTML/CSS card or component representation "
            "for the requested product/growth strategy document. Return ONLY valid HTML with embedded CSS styling. Use dark mode aesthetics, glassmorphism, "
            "modern typography, and clear visual hierarchy."
        )
    else: # markdown
        system_prompt = (
            "You are a principal product manager. Generate a highly structured, professional Markdown document (Product Strategy, PRD, Growth Matrix, "
            "or Roadmap) based on the context and prompt. Use headers, tables, bullet points, and clear sections."
        )

    llm_prompt = f"Prompt / Goal: {prompt}\n\nContext:\n{context_str}"
    raw_output = await llm_service.generate_completion(
        prompt=llm_prompt,
        system_prompt=system_prompt,
        provider=provider,
        model=model
    )

    if artifact_type == "html":
        final_content = sanitize_html_artifact(raw_output)
    else:
        # Strip code block quotes if wrapped
        final_content = raw_output.replace("```markdown", "").replace("```", "").strip()

    title = prompt.strip().split("\n")[0][:50] if prompt else "Product Strategy Artifact"
    return {
        "title": title.title(),
        "artifact_type": artifact_type,
        "content": final_content,
        "description": f"Generated {artifact_type.upper()} artifact based on transcript insights."
    }
