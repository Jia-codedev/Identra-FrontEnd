import React from "react";
import { motion, type Variants } from "framer-motion";

interface SVGLoaderProps {
  SVGComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  src?: string | null;
  size?: number;
  loop?: boolean;
  speed?: number;
  className?: string;
}

export default function SVGLoader({
  SVGComponent = null,
  src = null,
  size = 120,
  loop = true,
  speed = 1,
  className = "",
}: SVGLoaderProps) {
  const container: Variants = {
    animate: {
      rotate: [0, 6, -6, 0],
      scale: [1, 1.06, 0.98, 1],
      transition: {
        duration: 1.6 / speed,
        ease: "easeInOut",
        repeat: loop ? Infinity : 0,
        repeatType: "mirror",
      },
    },
  };

  const float: Variants = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 1.8 / speed,
        repeat: loop ? Infinity : 0,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {SVGComponent ? (
        <motion.div
          style={{ width: "100%", height: "100%", display: "inline-block" }}
          variants={container}
          animate="animate"
        >
          <motion.div variants={float} animate="animate">
            <SVGComponent
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </motion.div>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.2 / speed,
              repeat: loop ? Infinity : 0,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "140%",
                transform: "skewX(-20deg)",
                opacity: 0.12,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </motion.div>
        </motion.div>
      ) : src ? (
        <motion.div
          variants={container}
          animate="animate"
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <motion.img
            src={src}
            alt="loader"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            variants={float}
            animate="animate"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.2 / speed,
              repeat: loop ? Infinity : 0,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "36%",
                height: "140%",
                transform: "skewX(-20deg)",
                opacity: 0.12,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </motion.div>
        </motion.div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.6"
              initial={{ strokeDashoffset: 50 }}
              animate={{ strokeDashoffset: [50, 0, -50] }}
              transition={{
                duration: 1.2 / speed,
                repeat: loop ? Infinity : 0,
              }}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
