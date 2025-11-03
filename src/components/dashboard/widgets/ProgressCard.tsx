"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressCardProps {
  title: string;
  percentage: number;
  value?: string | number;
  total?: string | number;
  subtitle?: string;
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  percentage,
  value,
  total,
  subtitle,
  className,
  color = "#3b82f6",
  size = "md",
  showText = true,
}) => {
  const sizes = {
    sm: "w-12 h-12 sm:w-16 sm:h-16",
    md: "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24",
    lg: "w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32",
  };

  return (
    <motion.div
    >
      <Card className={cn("p-4 sm:p-5 flex flex-col items-center bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden group", className)}>
        {/* Enhanced Background decoration */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-muted/30 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-500" />
        
        <motion.h3 
          className="text-xs sm:text-sm font-medium text-muted-foreground mb-4 text-center relative z-10"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
        >
          {title}
        </motion.h3>
        
        <motion.div 
          className={cn("mb-4 relative z-10", sizes[size])}
          transition={{ duration: 0.3 }}
        >
          <CircularProgressbar
            value={percentage}
            text={showText ? `${percentage}%` : ""}
            styles={buildStyles({
              textColor: color,
              pathColor: color,
              trailColor: "hsl(var(--border))",
              backgroundColor: "hsl(var(--muted))",
              textSize: size === "sm" ? "18px" : size === "md" ? "16px" : "14px",
              pathTransitionDuration: 2,
              pathTransition: "stroke-dashoffset 2s ease-in-out",
            })}
          />
        </motion.div>
        
        {(value !== undefined || total !== undefined || subtitle) && (
          <motion.div 
            className="text-center relative z-10"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {(value !== undefined || total !== undefined) && (
              <motion.div 
                className="text-base sm:text-lg font-bold text-card-foreground"
                transition={{ duration: 0.2 }}
              >
                {value}
                {total && (
                  <span className="text-xs text-muted-foreground">
                    {" "}/ {total}
                  </span>
                )}
              </motion.div>
            )}
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProgressCard;
