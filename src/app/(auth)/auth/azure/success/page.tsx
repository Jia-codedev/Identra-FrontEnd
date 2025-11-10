"use client";
import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import React, { useEffect } from "react";

function Page() {
  useEffect(() => {
    let profile = async (token: string) => {
      console.log("Received token:", token);
      localStorage.setItem("token", token);
      document.cookie = `auth_token=${token}; path=/; max-age=${
        15 * 24 * 60 * 60
      }`;
      const res = await apiClient.get(`/auth/me`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200 && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        useUserStore.getState().setUser(res.data.user);
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 100);
      }
    };
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        profile(token);
      }
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="bg-card z-20 rounded-xl shadow-lg p-8 flex flex-col items-center border border-border">
        <svg
          className="animate-spin h-8 w-8 text-primary mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <h1 className="text-2xl font-bold text-primary mb-2">
          Azure Authentication Success
        </h1>
        <p className="text-muted-foreground mb-2">
          You are being redirected to your dashboard...
        </p>
        <p className="text-xs text-muted-foreground">
          If you are not redirected automatically,{" "}
          <Link href="/dashboard" className="text-primary underline">
            click here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Page;
