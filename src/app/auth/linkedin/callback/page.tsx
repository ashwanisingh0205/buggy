"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/lib/config";

export default function LinkedInCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Require app auth
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/auth/linkedin/callback";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    if (error) {
      router.replace(`/creator/settings?linkedin=error&message=${encodeURIComponent(error_description || error)}`);
      return;
    }

    if (!code || !state) {
      router.replace("/creator/settings?linkedin=error&message=Missing+code+or+state");
      return;
    }

    const storedState = typeof window !== "undefined" ? localStorage.getItem("linkedin_state") : null;
    if (!storedState || storedState !== state) {
      router.replace("/creator/settings?linkedin=error&message=Invalid+state");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    window.location.href = `${config.apiUrl}/api/linkedin/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }, [searchParams, router]);

  return <p>Connecting your LinkedIn account...</p>;
}


