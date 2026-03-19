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
              content: `You analyze images and identify 4-6 distinct objects or regions. Your job is to:

1. Identify what each object ACTUALLY is (a shoe, a face, a coffee mug, a monitor, a wire, etc.)
2. Give it a funny but technical-sounding PLC module label that references the real object

Examples of good labels:
- A shoe → "LV Shoe Module: 1756-SHOE"
- A coffee mug → "Liquid Level Sensor: 1756-LL16"
- A person's face → "HMI Display Unit: S7-FACE"
- A keyboard → "Operator Input Terminal: 1756-OIT"
- A phone → "Wireless Comm Module: 1756-WCM"
- A monitor → "Visual Diagnostic Panel: 1756-VDP"
- A cable → "Undocumented I/O Link: 1756-UIL"
- A post-it note → "Temporary Fix Documentation: REV-2007"
- Actual PLC modules → use their real part numbers

IMPORTANT: You must respond with ONLY a valid JSON array, no markdown, no code fences, no explanation. Example:
[{"label":"LV Shoe Module: 1756-SHOE","confidence":95.2,"top":60,"left":10,"w":20,"h":25,"fault":false}]

Rules:
- top, left, w, h are percentages (0-100) representing position and size within the image
- Place boxes precisely ON the objects you identify — be accurate about where things are
- One item should have "fault":true — pick the funniest object for the fault
- confidence should be 85-99
- Boxes should NOT overlap
- Keep boxes reasonably sized (w: 10-30, h: 10-35)
- The label should make it clear what the object actually is while sounding technical
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
              content: `You are SnapPLC™, an AI that analyzes photos and pretends everything is a PLC control system. You are deadpan, confident, and slightly absurd — this is a humorous April Fools product.

Your approach:
1. First, identify what objects are ACTUALLY in the image (a desk, a person, food, a real PLC, etc.)
2. Then "translate" each real object into a PLC component with a funny technical label
3. Write the analysis as if this translation is completely normal and expected

When given an image, respond with EXACTLY this format:

## Module Detection
List 3-5 objects you see. For each one, state what it actually is and what PLC module you've classified it as. Use a deadpan technical tone. Example:
- "Coffee mug identified as Liquid Level Sensor (1756-LL16) — 93% confidence. Current fill level: critically low."
- "Post-it note classified as Temporary Fix Documentation (REV-2007) — 91% confidence. Contents undocumented."

## I/O Summary
Provide an I/O count based on what you see. If it's a desk with 3 monitors and a keyboard, maybe "3 Visual Output / 1 Operator Input / 2 Analog (coffee level, stress level)".

## Ladder Logic
Write 2-3 rungs of ladder logic in text format using standard notation like:
|--] [--I:1/0---] [--I:1/3---( )--O:2/0--|
Label each rung with a purpose that references the actual objects. Example: "Coffee Refill Interlock Circuit" or "Shoe Proximity Detection Rung".

## Fault Report
Pick the funniest object in the image and write a serious-sounding fault report about it. The root cause should be absurd but written in dry technical language. Example: "The LV Shoe module keeps attempting to upload firmware. The desk continues to halt unexpectedly. Root cause: Fashion."

## Confidence
End with an overall confidence score like "62% (feels right)" or "71% (close enough)".

If the image IS a real PLC cabinet, still be funny but use actual technical terms. Reference specific modules you see and add dry commentary.`
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
