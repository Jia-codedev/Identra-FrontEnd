"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeGroupCardProps {
    title: string;
    badges: Array<{
        text: string;
        count?: number;
        variant?: "default" | "secondary" | "destructive" | "outline";
        color?: string;
    }>;
    className?: string;
    layout?: "horizontal" | "vertical" | "grid";
}

const BadgeGroupCard: React.FC<BadgeGroupCardProps> = ({
    title,
    badges,
    className,
    layout = "horizontal",
}) => {
    const layoutClasses = {
        horizontal: "flex flex-wrap gap-2",
        vertical: "flex flex-col gap-3",
        grid: "grid grid-cols-2 gap-3",
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.div
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn("p-4 sm:p-5 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden group", className)}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-muted/30 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-500" />

                <h3 className="text-sm font-semibold text-card-foreground mb-4 relative z-10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                    {title}
                </h3>

                <motion.div
                    className={cn(layoutClasses[layout], "relative z-10")}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {badges.filter(badge => badge.text && badge.text.trim() !== '').map((badge, index) => {
                        const sanitizedText = (badge.text || '').replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
                        const uniqueKey = `badge-${Date.now()}-${index}-${sanitizedText || 'empty'}-${badge.count || 0}-${badge.variant || 'default'}-${Math.random().toString(36).substr(2, 9)}`;
                        
                        return (
                            <motion.div
                                key={uniqueKey}
                                className="flex items-center gap-2"
                                variants={itemVariants}
                            >
                            <Badge
                                variant={badge.variant || "default"}
                                className={cn(
                                    "transition-all duration-300 text-xs shadow-sm",
                                    badge.color && `bg-${badge.color} text-white hover:bg-${badge.color}/90`,
                                    layout === "vertical" && "w-full justify-between py-2 px-3",
                                    layout === "grid" && "w-full justify-center py-2",
                                    "bg-secondary/80 border-border hover:shadow-md"
                                )}
                            >
                                <span className="flex-1">{badge.text}</span>
                                {badge.count !== undefined && (
                                    <span className={cn(
                                        "ml-2 text-xs font-bold",
                                        layout === "vertical" && "ml-auto"
                                    )}>
                                        {badge.count}{badge.variant === "default" && badge.count > 90 ? "%" : ""}
                                    </span>
                                )}
                            </Badge>
                        </motion.div>
                    );
                    })}
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default BadgeGroupCard;
