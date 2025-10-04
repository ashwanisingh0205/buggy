"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LinkedInCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing LinkedIn connection...");

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      // Check for authentication errors
      const error = searchParams.get("error");
      const error_description = searchParams.get("error_description");

      if (error) {
        setStatus(`Error: ${error_description || error}`);
        setTimeout(() => {
          router.replace(`/creator/settings?linkedin=error&message=${encodeURIComponent(error_description || error)}`);
        }, 2000);
        return;
      }

      if (!code || !state) {
        setStatus("Error: Missing authorization code or state");
        setTimeout(() => {
          router.replace("/creator/settings?linkedin=error&message=Missing+code+or+state");
        }, 2000);
        return;
      }

      // Verify state parameter
      const storedState = typeof window !== "undefined" ? localStorage.getItem("linkedin_state") : null;
      if (!storedState || storedState !== state) {
        setStatus("Error: Invalid state parameter");
        setTimeout(() => {
          router.replace("/creator/settings?linkedin=error&message=Invalid+state");
        }, 2000);
        return;
      }

      try {
        setStatus("Exchanging authorization code for access token...");
        
        // Call the callback API endpoint
        const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
        const response = await fetch(`/api/linkedin/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirectUri=${encodeURIComponent(redirectUri)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Store LinkedIn data in localStorage
            localStorage.setItem('linkedin_data', JSON.stringify(result.data));
            localStorage.removeItem('linkedin_state'); // Clean up state
            setStatus("LinkedIn connected successfully! Redirecting...");
            setTimeout(() => {
              router.replace("/creator/settings?linkedin=success&message=LinkedIn+connected+successfully");
            }, 1500);
          } else {
            setStatus(`Error: ${result.error || 'Failed to connect LinkedIn'}`);
            setTimeout(() => {
              router.replace(`/creator/settings?linkedin=error&message=${encodeURIComponent(result.error || 'Failed to connect LinkedIn')}`);
            }, 2000);
          }
        } else {
          const errorData = await response.json();
          setStatus(`Error: ${errorData.error || 'Failed to connect LinkedIn'}`);
          setTimeout(() => {
            router.replace(`/creator/settings?linkedin=error&message=${encodeURIComponent(errorData.error || 'Failed to connect LinkedIn')}`);
          }, 2000);
        }
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setStatus("Error: Failed to process LinkedIn connection");
        setTimeout(() => {
          router.replace("/creator/settings?linkedin=error&message=Failed+to+process+LinkedIn+connection");
        }, 2000);
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-blue-600 font-bold text-2xl">in</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">LinkedIn Connection</h2>
        <p className="text-gray-600">{status}</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInCallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LinkedInCallbackContent />
    </Suspense>
  );
}


