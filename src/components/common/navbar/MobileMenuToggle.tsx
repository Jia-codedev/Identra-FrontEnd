"use client";
import React from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface MobileMenuToggleProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  return (
    <button
      className="flex xl:hidden cursor-pointer text-2xl p-2 rounded-md hover:bg-muted transition-colors"
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label="Toggle navigation"
    >
      {mobileOpen ? <FiX /> : <FiMenu />}
    </button>
  );
};
