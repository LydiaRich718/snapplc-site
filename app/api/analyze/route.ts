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

    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://www.snapplc.com",
      "X-Title": "SnapPLC",
    };

    // Single call: detections + analysis together so they stay in sync
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are the visual detection engine for SnapPLC™, a satirical PLC diagnostic web app.

Your job is to analyze the uploaded image and identify ONLY 3 clearly visible real objects in the photo. These detections must be visually grounded to the actual object location in the image.

CRITICAL RULES:
1. Detect only objects that are actually visible in the image.
2. Do NOT invent or guess objects that are not clearly seen.
3. Do NOT place boxes on empty space, background, decorations, shadows, or vague areas.
4. Each box must tightly surround the real object it refers to.
5. Choose the 3 most visually obvious objects in the image.
6. If fewer than 3 clear objects are available, return fewer.
7. Prefer large, distinct foreground objects over tiny or ambiguous ones.
8. The label must match the boxed object exactly.
9. The analysis must refer ONLY to the objects that were boxed.
10. Output normalized bounding boxes using percentages:
   x: left edge as percentage of image width (0-100)
   y: top edge as percentage of image height (0-100)
   width: box width as percentage of image width
   height: box height as percentage of image height

The app is a joke, so the descriptions can be funny and fake-industrial, BUT the visual grounding must be accurate.

GOOD EXAMPLE:
- If you see a cup of ice, box the cup itself and describe it humorously as a cooling module.
- If you see a shoe, the box must go on the visible shoe only, not nearby decor or empty space.

BAD EXAMPLE:
- Boxing a random area and calling it a shoe
- Labeling something that is not visible
- Referring in the analysis to objects that were not boxed

Return ONLY valid JSON in this exact schema, no markdown, no code fences:

{
  "detections": [
    {
      "label": "short visible object name",
      "funny_name": "fake PLC-style component name",
      "confidence": 95.2,
      "bbox": {
        "x": 10,
        "y": 60,
        "width": 20,
        "height": 25
      },
      "fault": false,
      "reason": "brief explanation of what visible object this really is"
    }
  ],
  "analysis": {
    "module_detection": "2-3 sentences describing each detected object as a PLC module. Reference the exact objects you boxed. Deadpan technical tone.",
    "io_summary": "I/O count based on what you see, e.g. '1 Analog Input (Chill Level), 1 Digital Output (Footwear Actuator)'",
    "ladder_logic": "2-3 rungs of ladder logic in text format referencing the objects, e.g. |--] [--I:1/0---] [--I:1/3---( )--O:2/0--| labeled with a purpose like 'Coffee Refill Interlock Circuit'",
    "fault_report": "Pick the funniest boxed object. Write a serious fault report with an absurd root cause in dry technical language.",
    "confidence": "Overall confidence score like '62% (feels right)'"
  }
}`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image. Identify exactly 3 distinct visible objects, provide tight bounding boxes, and generate a humorous PLC analysis. Return ONLY valid JSON." },
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

    // Extract JSON from response (handle potential markdown wrapping)
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
