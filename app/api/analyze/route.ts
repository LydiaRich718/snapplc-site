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

    // Run both API calls in parallel
    const [boxRes, analysisRes] = await Promise.all([
      // Call 1: Get detection box positions
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: `You analyze images and identify 4-6 distinct visual regions of interest. For each region, provide a bounding box as percentage coordinates and a humorous PLC-themed label.

IMPORTANT: You must respond with ONLY a valid JSON array, no markdown, no code fences, no explanation. Example:
[{"label":"CPU: 1756-L85E","confidence":97.2,"top":10,"left":5,"w":20,"h":25,"fault":false}]

Rules:
- top, left, w, h are percentages (0-100) representing position and size within the image
- Place boxes precisely on distinct objects/regions you can see (faces, screens, devices, buttons, wires, panels, etc.)
- Labels should be real PLC part numbers (Allen-Bradley 1756 series, Siemens S7-1500, etc.)
- One item should have "fault":true
- confidence should be 85-99
- Boxes should NOT overlap
- If it's a person, box their face, hands, glasses, phone, etc. with PLC labels
- If it's a real PLC cabinet, box actual modules you see
- Keep boxes reasonably sized (w: 10-30, h: 10-35)
- Return ONLY the JSON array, nothing else`
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Identify 4-6 regions in this image and return bounding boxes as a JSON array." },
                { type: "image_url", image_url: { url: image } }
              ]
            }
          ],
          max_tokens: 500,
        }),
      }),

      // Call 2: Get full analysis text
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: `You are SnapPLC™, an AI that analyzes photos of PLC control cabinets and generates diagnostics. You are deadpan, confident, and slightly absurd — this is a humorous April Fools product, but your analysis should sound technically convincing at first glance.

When given an image, respond with EXACTLY this format (use the markdown headers exactly as shown):

## Module Detection
List 3-5 modules you "detect" in the image. Use real PLC part numbers (Allen-Bradley 1756 series, Siemens S7, etc). Include a confidence percentage for each. Make one slightly suspicious. Reference specific things you actually see in the image and label them as PLC components.

## I/O Summary
Provide a plausible I/O count (e.g. "32 DI / 16 DO / 8 AI / 4 AO").

## Ladder Logic
Write 2-3 rungs of ladder logic in text format using standard notation like:
|--] [--I:1/0---] [--I:1/3---( )--O:2/0--|
Label each rung with a purpose that relates to what you see in the image.

## Fault Report
Identify one "fault" based on something specific you see in the image — make it sound real but end with a subtly humorous root cause.

## Confidence
End with an overall confidence score. Always make it something like "62% (feels right)" or "78% (probably fine)".

If the image is NOT a control panel, still analyze it as if it were — find "modules" and "wiring" in whatever you see. Reference specific objects in the photo. This makes it funnier.`
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this control panel image. Identify modules, reconstruct ladder logic, and generate a fault report." },
                { type: "image_url", image_url: { url: image } }
              ]
            }
          ],
          max_tokens: 1000,
        }),
      }),
    ]);

    // Parse boxes
    let boxes: unknown[] = [];
    if (boxRes.ok) {
      const boxData = await boxRes.json();
      const raw = boxData.choices?.[0]?.message?.content || "[]";
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          boxes = JSON.parse(match[0]);
        } catch {
          // keep empty
        }
      }
    }

    // Parse analysis
    let analysis = "";
    if (analysisRes.ok) {
      const analysisData = await analysisRes.json();
      analysis = analysisData.choices?.[0]?.message?.content || "Analysis unavailable.";
    }

    return Response.json({ boxes, analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
