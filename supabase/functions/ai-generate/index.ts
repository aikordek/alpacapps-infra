import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.0-flash";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { prompt, model, system, history, maxTokens } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required field: prompt" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const selectedModel = model ?? DEFAULT_MODEL;

    // Build contents array (supports multi-turn history)
    const contents = [
      ...(history ?? []),
      { role: "user", parts: [{ text: prompt }] },
    ];

    const body: Record<string, unknown> = { contents };
    if (system) {
      body.systemInstruction = { parts: [{ text: system }] };
    }
    if (maxTokens) {
      body.generationConfig = { maxOutputTokens: maxTokens };
    }

    const res = await fetch(
      `${GEMINI_BASE}/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Return structured response with text extracted for convenience
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    return new Response(
      JSON.stringify({ text, raw: data }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
