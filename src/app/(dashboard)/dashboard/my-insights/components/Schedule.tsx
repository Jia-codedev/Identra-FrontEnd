import React from "react";
import { Link } from "lucide-react";

// Backend API shape for schedule
export interface ApiScheduleItem {
    TimeIn?: string | null;
    TimeOut?: string | null;
    SchCode?: string | null;
    Flexible?: string | null;
    GraceIn?: string | null;
    GraceOut?: string | null;
    InTime?: string | null;
    OutTime?: string | null;
    DayReqdHrs?: number | string | null;
    TotalWorkedHrs?: string | null;
    PendingWorkHrs?: string | null;
    TotalMonthlyExpectedWrkHrs?: number | string | null;
}

interface ScheduleProps {
    expectedHours?: number;
    worked?: number;
    overtime?: number;
    pending?: number;
    onShowAll?: () => void;
    apiData?: ApiScheduleItem | null;
}

function Schedule({
    expectedHours = 0.0,
    worked = 0.0,
    overtime = 0.0,
    pending = 0.0,
    onShowAll,
    apiData,
}: ScheduleProps) {
    // If apiData is provided, normalize values
    let normExpected = expectedHours;
    let normWorked = worked;
    let normPending = pending;
    let normOvertime = overtime;
    if (apiData) {
        // DayReqdHrs and TotalMonthlyExpectedWrkHrs can be number or string (hours)
        normExpected = Number(apiData.DayReqdHrs ?? apiData.TotalMonthlyExpectedWrkHrs ?? 0);
        // TotalWorkedHrs and PendingWorkHrs are strings like "00:00"
        const parseHrs = (val: string | null | undefined) => {
            if (!val) return 0;
            const [h, m] = val.split(":").map(Number);
            return (Number.isFinite(h) ? h : 0) + (Number.isFinite(m) ? m / 60 : 0);
        };
        normWorked = parseHrs(apiData.TotalWorkedHrs);
        normPending = parseHrs(apiData.PendingWorkHrs);
        // Overtime: worked - expected, if positive
        normOvertime = Math.max(0, normWorked - normExpected);
    }
    const totalHours = normWorked + normOvertime + normPending;
    const workedPercent = normExpected > 0 ? (normWorked / normExpected) * 100 : 0;
    const overtimePercent = normExpected > 0 ? (normOvertime / normExpected) * 100 : 0;
    const pendingPercent = normExpected > 0 ? (normPending / normExpected) * 100 : 0;

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
                    {normExpected.toFixed(2)}
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
                            {normWorked.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Overtime</p>
                    <div className="flex items-baseline gap-1">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-foreground">
                            {normOvertime.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Pending</p>
                    <div className="flex items-baseline gap-1">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-foreground">
                            {normPending.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
