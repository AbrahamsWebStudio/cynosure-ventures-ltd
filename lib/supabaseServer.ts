"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// For App Router Server Components only
export const createSupabaseServerClient = () =>
  createServerComponentClient({ cookies });
