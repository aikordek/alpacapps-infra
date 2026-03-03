import { supabase } from "./supabase";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const { data, error } = await supabase.functions.invoke("send-email", {
    body: options,
  });
  if (error) throw error;
  return data;
}
