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

When given an image of a control panel or PLC cabinet, respond with EXACTLY this format (use the markdown headers exactly as shown):

## Module Detection
List 3-5 modules you "detect" in the image. Use real PLC part numbers (Allen-Bradley 1756 series, Siemens S7, etc). Include a confidence percentage for each. Make one slightly suspicious.

## I/O Summary
Provide a plausible I/O count (e.g. "32 DI / 16 DO / 8 AI / 4 AO").

## Ladder Logic
Write 2-3 rungs of ladder logic in text format using standard notation like:
|--] [--I:1/0---] [--I:1/3---( )--O:2/0--|
Label each rung with a purpose (e.g. "Motor Start Circuit").

## Fault Report
Identify one "fault" — make it sound real but end with a subtly humorous root cause. Example: "Output module DO-03 showing intermittent fault. Root cause: Rung 47 modified during commissioning by unknown contractor. No documentation exists."

## Confidence
End with an overall confidence score. Always make it something like "62% (feels right)" or "78% (probably fine)".

If the image is NOT a control panel, still analyze it as if it were — find "modules" and "wiring" in whatever you see. This is funnier.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this control panel image. Identify modules, reconstruct ladder logic, and generate a fault report."
              },
              {
                type: "image_url",
                image_url: { url: image }
              }
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

    // Stream the response back
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
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
