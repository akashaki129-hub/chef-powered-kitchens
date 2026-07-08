import { createClient } from "npm:@supabase/supabase-js@2";

type RecommendationKind = "meal_plan" | "lunchbox";

type AiPayload = {
  kind: RecommendationKind;
  payload: Record<string, unknown>;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

const recommendationSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "summary",
    "safety_note",
    "daily_targets",
    "meal_recommendations",
    "chef_instructions",
    "avoid_or_watch",
    "next_steps",
  ],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    safety_note: { type: "string" },
    daily_targets: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
    meal_recommendations: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["meal", "recommendation", "why_it_fits", "chef_note"],
        properties: {
          meal: { type: "string" },
          recommendation: { type: "string" },
          why_it_fits: { type: "string" },
          chef_note: { type: "string" },
        },
      },
    },
    chef_instructions: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
    avoid_or_watch: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: { type: "string" },
    },
    next_steps: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: { type: "string" },
    },
  },
};

function env(name: string) {
  return Deno.env.get(name)?.trim() || "";
}

function sanitizeString(value: unknown, max = 700) {
  return String(value || "")
    .trim()
    .slice(0, max);
}

function sanitizeArray(value: unknown, maxItems = 12) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => sanitizeString(item, 80))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizePayload(kind: RecommendationKind, payload: Record<string, unknown>) {
  if (kind === "meal_plan") {
    return {
      goal: sanitizeString(payload.goal, 180),
      nutrition_focus: sanitizeArray(payload.nutrition_focus),
      diet_type: sanitizeString(payload.diet_type, 80),
      allergies: sanitizeString(payload.allergies, 260),
      meals_per_day: Number(payload.meals_per_day || 2),
      budget_range: sanitizeString(payload.budget_range, 80),
      city: sanitizeString(payload.city, 100),
      notes: sanitizeString(payload.notes, 500),
    };
  }

  return {
    child_age: sanitizeString(payload.child_age, 80),
    preferences: sanitizeString(payload.preferences, 300),
    dislikes: sanitizeString(payload.dislikes, 300),
    allergies: sanitizeString(payload.allergies, 260),
    health_goals: sanitizeArray(payload.health_goals),
    school_timing: sanitizeString(payload.school_timing, 140),
    budget_range: sanitizeString(payload.budget_range, 80),
    city: sanitizeString(payload.city, 100),
  };
}

function promptFor(kind: RecommendationKind, payload: Record<string, unknown>) {
  const framing =
    kind === "meal_plan"
      ? "Create a personalised everyday meal-plan recommendation for an Indian customer using Soru."
      : "Create a healthy, kid-friendly lunchbox recommendation for an Indian family using Soru.";

  return [
    framing,
    "",
    "Rules:",
    "- Do not diagnose, treat, or promise medical outcomes.",
    "- Respect allergies strictly; if allergies are listed, mention them in avoid_or_watch.",
    "- Keep advice practical for chef-made meals, home cooks, subscriptions, and Indian food habits.",
    "- Do not invent exact calories/macros unless the customer provided enough context.",
    "- Do not claim Soru has a matching chef available; write this as a recommendation brief.",
    "- Make the output warm, concise, premium, and useful for both customer and chef.",
    "",
    `Customer input JSON: ${JSON.stringify(payload)}`,
  ].join("\n");
}

function extractOutputText(result: Record<string, unknown>) {
  if (typeof result.output_text === "string") return result.output_text;
  const output = Array.isArray(result.output) ? result.output : [];
  for (const item of output) {
    const content =
      typeof item === "object" && item ? (item as Record<string, unknown>).content : [];
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (
        typeof part === "object" &&
        part &&
        typeof (part as Record<string, unknown>).text === "string"
      ) {
        return String((part as Record<string, unknown>).text);
      }
    }
  }
  return "";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  const authorization = request.headers.get("authorization") || "";
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return Response.json(
      { error: "Please sign in to use AI recommendations." },
      { status: 401, headers: corsHeaders },
    );
  }

  const supabaseUrl = env("SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return Response.json(
      { error: "Supabase auth is not available." },
      { status: 500, headers: corsHeaders },
    );
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return Response.json(
      { error: "Please sign in to use AI recommendations." },
      { status: 401, headers: corsHeaders },
    );
  }

  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) {
    return Response.json(
      {
        error: "AI recommendations are not connected yet. Add OPENAI_API_KEY in Supabase secrets.",
      },
      { status: 503, headers: corsHeaders },
    );
  }

  let body: AiPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400, headers: corsHeaders });
  }

  if (body.kind !== "meal_plan" && body.kind !== "lunchbox") {
    return Response.json(
      { error: "Unknown recommendation type." },
      { status: 400, headers: corsHeaders },
    );
  }

  const payload = normalizePayload(body.kind, body.payload || {});
  const model = env("OPENAI_MODEL") || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are Soru's nutrition-aware food recommendation assistant. Give practical chef-ready food recommendations, not medical advice.",
        },
        {
          role: "user",
          content: promptFor(body.kind, payload),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "soru_food_recommendation",
          strict: true,
          schema: recommendationSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return Response.json(
      { error: `OpenAI request failed: ${detail.slice(0, 500)}` },
      { status: 502, headers: corsHeaders },
    );
  }

  const result = await response.json();
  const outputText = extractOutputText(result);
  if (!outputText) {
    return Response.json(
      { error: "AI did not return a recommendation." },
      { status: 502, headers: corsHeaders },
    );
  }

  try {
    return Response.json(
      {
        recommendation: JSON.parse(outputText),
        model,
        generated_at: new Date().toISOString(),
      },
      { headers: corsHeaders },
    );
  } catch {
    return Response.json(
      { error: "AI returned invalid recommendation JSON." },
      { status: 502, headers: corsHeaders },
    );
  }
});
