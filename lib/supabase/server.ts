import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookies = await cookieStore;
          return cookies.get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          const cookies = await cookieStore;
          cookies.set({ name, value, ...options });
        },
        async remove(name: string, options: any) {
          const cookies = await cookieStore;
          cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
}
