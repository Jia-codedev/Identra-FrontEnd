"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { usePathname } from "next/navigation";

function DashboardFadeInAnimation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="w-full flex"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default DashboardFadeInAnimation;
