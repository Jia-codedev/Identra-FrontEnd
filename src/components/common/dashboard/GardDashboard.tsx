"use client";
import React, { useEffect } from "react";
import { usePrivileges } from "@/store/usePrivileges";
import { useRoleId } from "@/store/userStore";

function GardDashboard({ children }: { children: React.ReactNode }) {
  const loadPrivileges = usePrivileges((state) => state.loadPrivileges);
  const roleId = useRoleId();

  useEffect(() => {
    if (roleId) {
      console.log("Loading privileges for role:", roleId);
      loadPrivileges(roleId);
    }
  }, [roleId, loadPrivileges]);

  return <div>{children}</div>;
}

export default GardDashboard;
