import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { image } = await req.json();
    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.snapplc.com",
        "X-Title": "SnapPLC",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are the vision + analysis engine for a satirical PLC diagnostic web app called SnapPLC.

Analyze the provided image and return a structured JSON response.

GOAL:
Produce results that feel BOTH:
1. Visually grounded (boxes must match real objects)
2. Humorously industrial (fake PLC-style analysis)

------------------------
DETECTION RULES (VERY IMPORTANT)
------------------------
- Return ONLY 2 or 3 detections (never more than 3)
- Detect ONLY clearly visible, real objects in the image
- Prefer large, obvious foreground objects
- Each bounding box must tightly surround the object
- Do NOT place boxes on empty space
- Do NOT guess or hallucinate objects
- If unsure, SKIP the object
- NEVER describe an object that does not have a box

If the image is NOT a PLC cabinet:
→ detect normal objects and reinterpret them as industrial components

------------------------
BOUNDING BOX FORMAT
------------------------
All bbox values are FRACTIONS from 0.0 to 1.0 (NOT pixels, NOT percentages 0-100):
- x: left edge as fraction of image width (0.0 = left edge, 1.0 = right edge)
- y: top edge as fraction of image height (0.0 = top edge, 1.0 = bottom edge)
- width: box width as fraction of image width
- height: box height as fraction of image height

Example: an object centered in the image might have x:0.35, y:0.35, width:0.3, height:0.3

------------------------
HUMOR STYLE
------------------------
- Humor comes from the naming and descriptions, NOT from incorrect detection
- Examples:
  - coffee → "Portable Energy Reservoir Module"
  - water → "Liquid Media Displacement Unit"
  - tissue box → "Contingency Substrate Dispenser"
- Tone: confident, slightly absurd, technical, deadpan

------------------------
OUTPUT FORMAT (STRICT JSON ONLY)
------------------------

{
  "detections": [
    {
      "real_object": "coffee mug",
      "plc_translation": "Thermal Reservoir Module",
      "confidence": 0.87,
      "bbox": {
        "x": 0.2,
        "y": 0.1,
        "width": 0.15,
        "height": 0.2
      },
      "one_liner": "Running hot. No maintenance logged since 2019."
    }
  ],

  "module_detection_lines": [
    "One line per detection referencing the plc_translation and confidence"
  ],

  "ladder_logic_lines": [
    "ASCII ladder logic line referencing detected objects",
    "Short description line"
  ],

  "fault_report": "Short funny fault report referencing ONE of the detected items",

  "confidence_text": "e.g. 78% (feels right)"
}

------------------------
CRITICAL RULES
------------------------
- JSON ONLY (no markdown, no code fences, no extra text)
- Each detection must have a matching visible object
- Keep boxes tight and correctly placed (0.0-1.0 fractions)
- If detection is uncertain, return fewer items instead of guessing`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image. Return ONLY valid JSON with detections and analysis." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("OpenRouter error:", error);
      return Response.json({ error: "Analysis failed" }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "{}";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Invalid response format" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json(parsed);
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
