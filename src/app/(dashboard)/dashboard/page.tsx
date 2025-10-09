"use client";
import Dashboard from "@/modules/dashboard/statistics/view/page";
import { useUserStore } from "@/store/userStore";
import React from "react";

function page() {
  const { user } = useUserStore();
  console.log("User in Dashboard:", user?.role);
  return <Dashboard />;
}

export default page;
