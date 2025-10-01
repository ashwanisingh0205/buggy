"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/lib/config";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/auth/google/callback`";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (error) {
      router.replace(`/login?google=error&message=${encodeURIComponent(error_description || error)}`);
      return;
    }

    if (!code || !state) {
      router.replace(`/login?google=error&message=Missing+code+or+state`);
      return;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    window.location.href = `${config.apiUrl}/api/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }, [searchParams, router]);

  return <p>Signing you in with Google...</p>;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}


