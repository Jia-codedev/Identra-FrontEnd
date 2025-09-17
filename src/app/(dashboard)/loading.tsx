"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[80vh] rounded bg-muted">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 animate-spin border-4 border-transparent border-t-primary border-l-primary rounded-full"
      />
    </div>
  );
}
