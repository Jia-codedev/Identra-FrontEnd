"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    LogIn,
    LogOut,
    Timer,
    MapPin,
    Wifi,
    WifiOff
} from "lucide-react";

interface PunchInOutWidgetProps {
    className?: string;
    currentStatus?: "checked_in" | "checked_out";
    lastPunchTime?: string;
    workingHours?: string;
    location?: string;
}

const PunchInOutWidget: React.FC<PunchInOutWidgetProps> = ({
    className,
    currentStatus = "checked_out",
    lastPunchTime = "9:00 AM",
    workingHours = "0h 0m",
    location = "Office Floor 3"
}) => {
    const [status, setStatus] = useState(currentStatus);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Simulate network status
        const networkTimer = setInterval(() => {
            setIsOnline(navigator.onLine);
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(networkTimer);
        };
    }, []);

    const handlePunch = async () => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStatus(status === "checked_in" ? "checked_out" : "checked_in");
        setIsLoading(false);
    };

    const isCheckedIn = status === "checked_in";

    const statusColors = {
        checked_in: {
            bg: "bg-gradient-to-br from-green-500 to-emerald-600",
            icon: "text-green-600",
            badge: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
            button: "bg-gradient-to-r from-destructive to-red-600 hover:from-red-600 hover:to-red-700",
            pulse: "bg-green-500/20"
        },
        checked_out: {
            bg: "bg-gradient-to-br from-muted to-muted-foreground",
            icon: "text-muted-foreground",
            badge: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
            button: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
            pulse: "bg-primary/20"
        }
    };

    const colors = statusColors[status];

    return (
        <motion.div
            className={className}
        >
            <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/5 transition-all duration-300">
                <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", colors.bg)}>
                                <motion.div
                                    animate={isCheckedIn ? { rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Clock className="w-6 h-6 text-primary-foreground" />
                                </motion.div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-card-foreground">Time Tracker</h3>
                                <p className="text-sm text-muted-foreground">Attendance Management</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-xs", colors.badge)}>
                                {isOnline ? (
                                    <><Wifi className="w-3 h-3 mr-1" /> Online</>
                                ) : (
                                    <><WifiOff className="w-3 h-3 mr-1" /> Offline</>
                                )}
                            </Badge>
                        </div>
                    </div>

                    {/* Current Status Display */}
                    <div className="text-center mb-6">
                        <motion.div
                            key={status}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="mb-4"
                        >
                            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium border", colors.badge)}>
                                {isCheckedIn ? (
                                    <><CheckCircle2 className="w-4 h-4" /> CHECKED IN</>
                                ) : (
                                    <><Timer className="w-4 h-4" /> CHECKED OUT</>
                                )}
                            </div>
                        </motion.div>

                        <div className="text-3xl font-bold text-card-foreground mb-2">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {currentTime.toLocaleDateString([], {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-muted/50 rounded-lg border border-border/50">
                            <div className="text-xs text-muted-foreground mb-1">Last Punch</div>
                            <div className="font-semibold text-card-foreground">{lastPunchTime}</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg border border-border/50">
                            <div className="text-xs text-muted-foreground mb-1">Working Hours</div>
                            <div className="font-semibold text-card-foreground">{workingHours}</div>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>

                    {/* Punch Button */}
                    <div
                        className="w-full cursor-pointer"
                    >
                        <Button
                            onClick={handlePunch}
                            disabled={isLoading || !isOnline}
                            size="lg"
                            className={cn(
                                "w-full h-14 text-lg font-bold text-primary-foreground shadow-lg transition-all duration-300",
                                colors.button,
                                isLoading && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Timer className="w-5 h-5" />
                                        </motion.div>
                                        Processing...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="action"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        {isCheckedIn ? (
                                            <><LogOut className="w-5 h-5" /> PUNCH OUT</>
                                        ) : (
                                            <><LogIn className="w-5 h-5" /> PUNCH IN</>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-4 text-center">
                        <div className="text-xs text-muted-foreground">
                            {isCheckedIn ? "🟢 You're actively working" : "⚪ Ready to start your day"}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default PunchInOutWidget;
