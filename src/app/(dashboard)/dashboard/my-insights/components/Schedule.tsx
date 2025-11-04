import React from "react";
import { Link } from "lucide-react";

interface ScheduleProps {
    expectedHours?: number;
    worked?: number;
    overtime?: number;
    pending?: number;
    onShowAll?: () => void;
}

function Schedule({
    expectedHours = 0.0,
    worked = 0.0,
    overtime = 0.0,
    pending = 0.0,
    onShowAll,
}: ScheduleProps) {
    const totalHours = worked + overtime + pending;
    const workedPercent = expectedHours > 0 ? (worked / expectedHours) * 100 : 0;
    const overtimePercent =
        expectedHours > 0 ? (overtime / expectedHours) * 100 : 0;
    const pendingPercent =
        expectedHours > 0 ? (pending / expectedHours) * 100 : 0;

    return (
        <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Schedule</h3>
                <button
                    onClick={onShowAll}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                >
                    Show all
                </button>
            </div>
            <div className="mb-4">
                <div className="text-4xl font-bold text-foreground mb-1">
                    {expectedHours.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Expected Working Hours</p>
            </div>
            <div className="mb-6">
                <div className="flex h-12 gap-0.5 rounded-lg overflow-hidden bg-muted/30">
                    {Array.from({ length: 30 }).map((_, index) => {
                        const position = ((index + 1) / 30) * 100;
                        let barColor = "bg-muted";

                        if (position <= workedPercent) {
                            barColor = "bg-blue-500";
                        } else if (position <= workedPercent + overtimePercent) {
                            barColor = "bg-purple-500";
                        } else if (position <= workedPercent + overtimePercent + pendingPercent) {
                            barColor = "bg-orange-500";
                        }

                        return (
                            <div
                                key={index}
                                className={`flex-1 ${barColor} transition-colors`}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Worked</p>
                    <div className="flex items-baseline gap-1">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-foreground">
                            {worked.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Overtime</p>
                    <div className="flex items-baseline gap-1">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-foreground">
                            {overtime.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Pending</p>
                    <div className="flex items-baseline gap-1">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-foreground">
                            {pending.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
