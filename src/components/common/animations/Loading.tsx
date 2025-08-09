import React from "react";
import { motion } from "framer-motion";

// Usage notes:
// 1) Recommended: Import the SVG as a React component using SVGR (create-react-app, Vite + svgr, Next.js with @svgr/webpack).
//    Example: `import { ReactComponent as LoaderSVG } from "./Group 829.svg";`
//    Make sure paths you want to animate use `stroke` (not `fill`) and set `stroke="currentColor"` or `fill="currentColor"` where appropriate.
// 2) Fallback: If you cannot import SVG as ReactComponent, pass the SVG URL to the `src` prop — the component will animate the outer container and a subtle shimmer.

export default function SVGLoader({
  // either pass a React component (recommended) or an image URL
  SVGComponent = null, // e.g. LoaderSVG when using `import { ReactComponent as LoaderSVG } from './Group 829.svg'`
  src = null, // fallback image URL (string)
  size = 120, // px
  loop = true,
  speed = 1, // multiplier for animation durations
  className = "",
}) {
  // animation variants
  const container = {
    animate: {
      rotate: [0, 6, -6, 0],
      scale: [1, 1.06, 0.98, 1],
      transition: {
        duration: 1.6 / speed,
        ease: "easeInOut",
        repeat: loop ? Infinity : 0,
        repeatType: "mirror" as const,
      },
    },
  };

  const float = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 1.8 / speed,
        repeat: loop ? Infinity : 0,
        ease: "easeInOut",
      },
    },
  };

  const shimmer = {
    initial: { x: "-100%" },
    animate: {
      x: ["-100%", "100%"],
      transition: {
        duration: 1.2 / speed,
        repeat: loop ? Infinity : 0,
        ease: "linear",
      },
    },
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* If user can import the SVG as a React component, this gives the most control */}
      {SVGComponent ? (
        <motion.div
          style={{ width: "100%", height: "100%", display: "inline-block" }}
          variants={container}
          animate="animate"
        >
          {/* Float wrapper for a subtle up/down motion */}
          <motion.div variants={float} animate="animate">
            {/* Render the supplied SVG component. Make sure the SVG uses currentColor so color can be controlled via CSS */}
            <SVGComponent style={{ width: "100%", height: "100%", display: "block" }} />
          </motion.div>

          {/* subtle shimmer overlay using absolute positioned gradient */}
          <motion.div
            initial={shimmer.initial}
            animate={shimmer.animate}
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
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </motion.div>
        </motion.div>
      ) : src ? (
        // fallback: animate the <img> container (scale/rotate/float) with a shimmer overlay
        <motion.div variants={container} animate="animate" style={{ width: "100%", height: "100%", position: "relative" }}>
          <motion.img
            src={src}
            alt="loader"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            variants={float}
            animate="animate"
          />

          <motion.div
            initial={shimmer.initial}
            animate={shimmer.animate}
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
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </motion.div>
        </motion.div>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.6"
              initial={{ strokeDashoffset: 50 }}
              animate={{ strokeDashoffset: [50, 0, -50] }}
              transition={{ duration: 1.2 / speed, repeat: loop ? Infinity : 0 }}
            />
          </svg>
        </div>
      )}

      {/* Optional minimal controls (size/color) via tailwind classes on the parent. Example: text-indigo-600 for color */}
    </div>
  );
}