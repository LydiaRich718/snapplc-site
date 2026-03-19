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

    // Step 1: Get detection box positions (fast, non-streaming)
    const boxResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: `You analyze images and identify 4-6 distinct visual regions of interest. For each region, provide a bounding box as percentage coordinates and a humorous PLC-themed label.

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no explanation. The format must be exactly:
[{"label":"CPU: 1756-L85E","confidence":97.2,"top":10,"left":5,"w":20,"h":25,"fault":false},...]

Rules:
- top, left, w, h are percentages (0-100) representing position and size within the image
- Place boxes precisely on distinct objects/regions you can see (faces, screens, devices, buttons, wires, panels, etc.)
- Labels should be real PLC part numbers (Allen-Bradley 1756 series, Siemens S7-1500, etc.)
- One item should have "fault":true
- confidence should be 85-99
- Boxes should NOT overlap
- If it's a person, box their face, hands, glasses, phone, etc. with PLC labels
- If it's a real PLC cabinet, box actual modules you see
- Keep boxes reasonably sized (w: 10-30, h: 10-35)`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Identify 4-6 regions in this image and return bounding boxes as JSON." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 500,
      }),
    });

    let boxes = "[]";
    if (boxResponse.ok) {
      const boxData = await boxResponse.json();
      const raw = boxData.choices?.[0]?.message?.content || "[]";
      // Extract JSON array from response (in case it wraps in markdown)
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          JSON.parse(match[0]); // validate
          boxes = match[0];
        } catch {
          // keep default empty array
        }
      }
    }

    // Step 2: Stream the full analysis
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", error);
      return Response.json({ error: "Analysis failed" }, { status: 500 });
    }

    // Stream: first line is JSON boxes, then analysis text
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send boxes as first line
        controller.enqueue(encoder.encode("BOXES:" + boxes + "\n"));

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
