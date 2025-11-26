"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/modules/shared/lib/supabase/browser";

export default function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();
  const didInit = useRef(false);
  const didNav = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const supabase = supabaseBrowser();

    const post = async (payload: any) => {
      try {
        await fetch("/auth/set", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          keepalive: true,
          body: JSON.stringify(payload),
        });
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[AuthListener] Failed to send auth event:", err);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      post({ event: "INITIAL_SESSION", session });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await post({ event, session });

        if (event === "SIGNED_IN") {
          if (didNav.current) return;
          didNav.current = true;

          if (pathname?.startsWith("/auth")) {
            router.replace("/dashboard");
          } else {
            router.refresh();
          }
        }

        if (event === "SIGNED_OUT") {
          if (didNav.current) return;
          didNav.current = true;
          router.replace("/auth/sign-in");
        }

        if (event === "TOKEN_REFRESHED") {
          router.refresh();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  return null;
}
