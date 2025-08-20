"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SecondaryNavProps {
  activeMenuObj: any;
}

const subLinkVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export const SecondaryNav: React.FC<SecondaryNavProps> = ({ activeMenuObj }) => {
  const pathname = usePathname();

  if (!activeMenuObj?.secondary || activeMenuObj.secondary.length === 0) {
    return null;
  }

  return (
    <div className="w-full items-start justify-between mt-4 shadow-[inset_0_0_8px_rgba(2,56,0,0.09)] rounded-lg p-1 xl:flex hidden">
      <motion.div
        className="flex space-x-4 overflow-x-scroll overflow-y-hidden scrollbar-hide"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: -1,
            transition: {
              type: "spring" as const,
              stiffness: 220,
              damping: 18,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {activeMenuObj.secondary.map((item: any) => (
          <motion.div key={item.href} variants={subLinkVariant}>
            <Link
              href={item.href}
              className={cn(
                "p-1 rounded-lg font-medium text-xs transition-all text-nowrap hover:text-primary text-muted-foreground",
                pathname === item.href
                  ? "bg-primary text-primary-foreground hover:text-muted font-bold"
                  : "hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
