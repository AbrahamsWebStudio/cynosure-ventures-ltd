import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export const supabaseBrowser = createPagesBrowserClient();
export const supabase = supabaseBrowser;
