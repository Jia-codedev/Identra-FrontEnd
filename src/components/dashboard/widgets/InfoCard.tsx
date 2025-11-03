"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InfoCardProps {
  title: string;
  content: string | React.ReactNode;
  className?: string;
  variant?: "default" | "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  className,
  variant = "default",
  icon,
  badge,
}) => {
  const variants = {
    default: "bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500",
    info: "bg-gradient-to-br from-blue-50/90 to-cyan-50/90 border-blue-200/30 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm transition-all duration-500 dark:from-blue-950/90 dark:to-cyan-950/90 dark:border-blue-800/30",
    success: "bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-200/30 hover:shadow-xl hover:shadow-green-500/20 backdrop-blur-sm transition-all duration-500 dark:from-green-950/90 dark:to-emerald-950/90 dark:border-green-800/30",
    warning: "bg-gradient-to-br from-yellow-50/90 to-orange-50/90 border-yellow-200/30 hover:shadow-xl hover:shadow-yellow-500/20 backdrop-blur-sm transition-all duration-500 dark:from-yellow-950/90 dark:to-orange-950/90 dark:border-yellow-800/30",
    error: "bg-gradient-to-br from-red-50/90 to-rose-50/90 border-red-200/30 hover:shadow-xl hover:shadow-red-500/20 backdrop-blur-sm transition-all duration-500 dark:from-red-950/90 dark:to-rose-950/90 dark:border-red-800/30",
  };

  return (
    <motion.div
    >
      <Card className={cn(variants[variant], "p-4 sm:p-5 relative overflow-hidden group", className)}>
        {/* Enhanced background decoration */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-muted/30 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div 
                className="flex-shrink-0 text-muted-foreground p-2 rounded-lg bg-muted/50"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                {title}
              </h3>
              <div className="text-card-foreground">
                {typeof content === "string" ? (
                  <p className="text-sm">{content}</p>
                ) : (
                  content
                )}
              </div>
            </div>
          </div>
          {badge && (
            <Badge variant={badge.variant}>
              {badge.text}
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default InfoCard;
