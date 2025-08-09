"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    className?: string;
    variant?: "default" | "primary" | "success" | "warning" | "error";
    isAnimated?: boolean;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    className,
    variant = "default",
    isAnimated = true,
    prefix = "",
    suffix = "",
    icon,
}) => {
    const variants = {
        default: "bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500",
        primary: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/15 hover:shadow-xl hover:shadow-primary/20 backdrop-blur-sm transition-all duration-500",
        success: "bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-500/20 hover:from-green-500/10 hover:to-emerald-500/15 hover:shadow-xl hover:shadow-green-500/20 backdrop-blur-sm transition-all duration-500",
        warning: "bg-gradient-to-br from-yellow-500/5 to-orange-500/10 border-yellow-500/20 hover:from-yellow-500/10 hover:to-orange-500/15 hover:shadow-xl hover:shadow-yellow-500/20 backdrop-blur-sm transition-all duration-500",
        error: "bg-gradient-to-br from-destructive/5 to-red-500/10 border-destructive/20 hover:from-destructive/10 hover:to-red-500/15 hover:shadow-xl hover:shadow-destructive/20 backdrop-blur-sm transition-all duration-500",
    };

    const iconColors = {
        default: "text-muted-foreground",
        primary: "text-primary",
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-destructive",
    };

    const isNumeric = typeof value === "number";

    return (
        <motion.div
        >
            <Card className={cn(variants[variant], "p-4 sm:p-5 relative overflow-hidden group", className)}>
                {/* Enhanced Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-muted/30 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500" />

                {/* Animated border glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex-1 min-w-0">
                        <motion.h3
                            className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 truncate"
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                        >
                            {title}
                        </motion.h3>
                        <motion.div
                            className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground mb-1"
                            initial={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {prefix}
                            {isAnimated && isNumeric ? (
                                <CountUp end={value as number} duration={2} preserveValue />
                            ) : (
                                value
                            )}
                            {suffix}
                        </motion.div>
                        <motion.p
                            className="text-xs sm:text-sm text-muted-foreground truncate"
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                        >
                            {subtitle}
                            {
                                !subtitle && <div className="py-2 w-full"></div>
                            }
                        </motion.p>
                    </div>
                    {icon && (
                        <motion.div
                            className={cn("flex-shrink-0 ml-3 p-2 rounded-lg bg-muted/50", iconColors[variant])}
                            whileHover={{ rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {icon}
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

export default StatCard;
