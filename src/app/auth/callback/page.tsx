"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/configs/api/Axios";
import { CookieUtils } from "@/utils/cookieUtils";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const err = params.get("error");
    const errDesc = params.get("error_description");

    if (err) {
      setError(errDesc || err);
      setStatus("error");
      return;
    }

    if (!code) {
      setError("No authorization code received");
      setStatus("error");
      return;
    }

    (async () => {
      try {
        const resp = await apiClient.get(`/auth/azure/callback?code=${encodeURIComponent(code)}`);
        if (resp.status === 200 && resp.data.token) {
          const { token } = resp.data;
          localStorage.setItem("token", token);
          CookieUtils.setAuthToken(token, true);
          setStatus("success");
          // navigate to dashboard
          setTimeout(() => router.replace("/dashboard"), 400);
        } else {
          setError("Authentication failed");
          setStatus("error");
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Callback error");
        setStatus("error");
      }
    })();
  }, [router]);

  if (status === "loading") return <div style={{ padding: 40 }}>Processing login...</div>;
  if (status === "success") return <div style={{ padding: 40 }}>Login successful. Redirecting...</div>;
  return (
    <div style={{ padding: 40 }}>
      <h2>Authentication Error</h2>
      <p>{error}</p>
      <p>
        <a href="/">Back to login</a>
      </p>
    </div>
  );
}
