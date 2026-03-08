import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Agent 1: Planner Agent ---
function plannerAgent(tone: string): string {
  const styles: Record<string, string> = {
    aesthetic: "short aesthetic caption with emojis and a dreamy vibe",
    funny: "funny playful caption with humor and wit",
    professional: "formal professional caption suitable for a brand",
    motivational: "inspiring motivational caption that uplifts the reader",
    casual: "relaxed casual caption like talking to a friend",
  };
  return styles[tone.toLowerCase()] || styles.casual;
}

// --- Agent 2: Caption Generator Agent ---
async function captionAgent(
  topic: string,
  style: string,
  apiKey: string,
  captionLength: string
): Promise<string> {
  const lengthInstruction =
    captionLength === "short"
      ? "Keep it under 20 words."
      : captionLength === "long"
      ? "Write 2-3 sentences."
      : "Write 1-2 sentences.";

  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a creative social media caption writer. Return ONLY the caption text, nothing else. No quotes around it.",
          },
          {
            role: "user",
            content: `Write a short engaging Instagram caption about "${topic}". Tone: ${style}. ${lengthInstruction}`,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Caption agent error:", response.status, text);
    if (response.status === 429) throw new Error("RATE_LIMITED");
    if (response.status === 402) throw new Error("PAYMENT_REQUIRED");
    throw new Error("Caption generation failed");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Could not generate caption.";
}

// --- Agent 3: Hashtag Generator Agent ---
async function hashtagAgent(topic: string, apiKey: string): Promise<string[]> {
  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a hashtag generator. Return ONLY hashtags separated by spaces. No other text. Each hashtag must start with #.",
          },
          {
            role: "user",
            content: `Generate 5 Instagram hashtags related to "${topic}". Only return hashtags.`,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Hashtag agent error:", response.status, text);
    if (response.status === 429) throw new Error("RATE_LIMITED");
    if (response.status === 402) throw new Error("PAYMENT_REQUIRED");
    throw new Error("Hashtag generation failed");
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || "";
  const hashtags = raw
    .split(/\s+/)
    .filter((t: string) => t.startsWith("#"))
    .slice(0, 7);
  return hashtags.length > 0 ? hashtags : ["#instagram", "#socialmedia", "#trending"];
}

// --- Orchestrator ---
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { topic, tone, captionLength } = await req.json();

    if (!topic || !tone) {
      return new Response(
        JSON.stringify({ error: "Topic and tone are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Planner Agent decides style
    const style = plannerAgent(tone);
    console.log(`Planner: tone="${tone}" → style="${style}"`);

    // Step 2 & 3: Caption Agent + Hashtag Agent (run in parallel)
    const [caption, hashtags] = await Promise.all([
      captionAgent(topic, style, LOVABLE_API_KEY, captionLength || "medium"),
      hashtagAgent(topic, LOVABLE_API_KEY),
    ]);

    console.log("Orchestrator: generation complete");

    // Step 4: Return combined result
    return new Response(
      JSON.stringify({ caption, hashtags }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Orchestrator error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";

    if (msg === "RATE_LIMITED") {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (msg === "PAYMENT_REQUIRED") {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits in your Lovable workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
