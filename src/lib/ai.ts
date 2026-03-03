import { supabase } from "./supabase";

interface GenerateOptions {
  prompt: string;
  /** Default: "gemini-2.0-flash" */
  model?: string;
  /** System instruction */
  system?: string;
  /** Multi-turn chat history: [{role:"user"|"model", parts:[{text}]}] */
  history?: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>;
  maxTokens?: number;
}

interface GenerateResult {
  text: string | null;
  raw: unknown;
}

export async function aiGenerate(options: GenerateOptions): Promise<GenerateResult> {
  const { data, error } = await supabase.functions.invoke("ai-generate", {
    body: options,
  });
  if (error) throw error;
  return data as GenerateResult;
}
