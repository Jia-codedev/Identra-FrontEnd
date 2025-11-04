import React from "react";
import { LogIn, LogOut, Clock, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViolationData {
    missedIn?: number;
    missedOut?: number;
    late?: number;
    early?: number;
}

interface ViolationProps {
    isLoading?: boolean;
    data?: ViolationData;
}

function Violation({
    isLoading,
    data = { missedIn: 0, missedOut: 0, late: 0, early: 0 },
}: ViolationProps) {
    return (
        <div className={
            cn("bg-card border rounded-xl p-6 w-full h-full",
                isLoading ? "animate-pulse" : ""
            )
        }>
            <h3 className="text-xl font-semibold text-foreground text-center mb-6">
                Violations
            </h3>
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-muted/50 border-2 border-blue-500/30 rounded-xl p-4 relative">
                    <div className="absolute top-3 left-3">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                            <LogIn className="w-4 h-4 text-blue-500" />
                        </div>
                    </div>
                    <div className="text-center pt-8">
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {data.missedIn ? data.missedIn : 0}
                        </div>
                        <p className="text-muted-foreground text-xs">Missed In</p>
                    </div>
                </div>
                <div className="bg-muted/50 border-2 border-teal-500/30 rounded-xl p-4 relative">
                    <div className="absolute top-3 left-3">
                        <div className="bg-teal-500/20 p-2 rounded-lg">
                            <LogOut className="w-4 h-4 text-teal-500" />
                        </div>
                    </div>
                    <div className="text-center pt-8">
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {data.missedOut ? data.missedOut : 0}
                        </div>
                        <p className="text-muted-foreground text-xs">Missed Out</p>
                    </div>
                </div>
                <div className="bg-muted/50 border-2 border-purple-500/30 rounded-xl p-4 relative">
                    <div className="absolute top-3 left-3">
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-500" />
                        </div>
                    </div>
                    <div className="text-center pt-8">
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {data.late ? data.late : 0}
                        </div>
                        <p className="text-muted-foreground text-xs">Late</p>
                    </div>
                </div>
                <div className="bg-muted/50 border-2 border-orange-500/30 rounded-xl p-4 relative">
                    <div className="absolute top-3 left-3">
                        <div className="bg-orange-500/20 p-2 rounded-lg">
                            <Sun className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>
                    <div className="text-center pt-8">
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {data.early ? data.early : 0}
                        </div>
                        <p className="text-muted-foreground text-xs">Early</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Violation;
