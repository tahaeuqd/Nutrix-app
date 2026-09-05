// Supabase Edge Function: proxies calls to the Claude API so your API key stays
// on the server and is never exposed in the browser (as it currently is in the artifact).
//
// SETUP:
// 1. Install the Supabase CLI, then: supabase functions new claude-proxy
// 2. Replace the generated file with this content
// 3. Set your key as a secret (never commit it): supabase secrets set ANTHROPIC_API_KEY=sk-...
// 4. Deploy: supabase functions deploy claude-proxy
// 5. In NutriX.jsx, change callClaude()'s fetch URL from
//      "https://api.anthropic.com/v1/messages"
//    to your function's URL, e.g.
//      "https://YOUR-PROJECT.supabase.co/functions/v1/claude-proxy"
//    and drop the "x-api-key" header entirely — the function adds it server-side.

import "https://deno.land/x/xhr@0.1.0/mod.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json(); // { system, messages, max_tokens }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: body.max_tokens || 1000,
        system: body.system,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
