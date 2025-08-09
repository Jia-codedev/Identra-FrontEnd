"use client";
import React from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/common/svg/icons";

export const NavbarLogo = () => {
  return (
    <div className="flex items-center space-x-2 font-semibold text-lg text-primary">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <LogoIcon />
        <p>Chronexa</p>
      </Link>
    </div>
  );
};
