"use client";
import MyInsights from "./my-insights/view/page";
import { useUserStore } from "@/store/userStore";
import React from "react";

function page() {
  const { user } = useUserStore();
  return <MyInsights />;
}

export default page;
