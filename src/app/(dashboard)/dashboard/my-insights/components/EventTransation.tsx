"use client";
import React from "react";
import { LogIn, LogOut, Clock, Loader2 } from "lucide-react";
import { useEventTransaction } from "../hooks/useEventTransaction";
import { useTranslations } from "@/hooks/use-translations";

function EventTransation() {
    const {
        currentTime,
        workingDuration,
        renderKey,
        isCheckedIn,
        checkInTime,
        checkOutTime,
        remainingTime,
        overtimeTime,
        loading,
        handleCheckIn,
        handleCheckOut,
    } = useEventTransaction();
    
    const { t } = useTranslations();

    const handlePrimaryAction = () => {
        if (isCheckedIn) {
            handleCheckOut();
        } else {
            handleCheckIn();
        }
    };

    const primaryLabel = isCheckedIn ? t("dashboard.checkOut") : t("dashboard.checkIn");
    const PrimaryIcon = isCheckedIn ? LogOut : LogIn;

    return (
        <div className="bg-primary rounded-xl p-4 relative overflow-hidden h-full w-full" key={renderKey}>
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="absolute bottom-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                <div className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-250"></div>
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-1.5 text-white/80 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}</span>
                    </div>
                </div>
                <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-white tracking-wider font-mono">
                        {workingDuration}
                    </div>
                    {isCheckedIn && (
                        <div className="text-white/80 text-sm mt-2 flex items-center justify-center gap-1">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span>Live Tracking</span>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="flex items-center gap-1.5 mb-1">
                            <LogIn className="w-3.5 h-3.5 text-white/80" />
                            <span className="text-white/80 text-xs">{t("dashboard.lastPunchIn")}</span>
                        </div>
                        <div className="text-white text-lg font-bold font-mono">
                            {checkInTime}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="flex items-center gap-1.5 mb-1">
                            <LogOut className="w-3.5 h-3.5 text-white/80" />
                            <span className="text-white/80 text-xs">{t("dashboard.lastPunchOut")}</span>
                        </div>
                        <div className="text-white text-lg font-bold font-mono">
                            {checkOutTime}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="text-white/80 text-xs mb-0.5">{t("dashboard.remaining")}</div>
                        <div className="text-white text-base font-semibold font-mono">
                            {remainingTime}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="text-white/80 text-xs mb-0.5">{t("dashboard.overtime")}</div>
                        <div className="text-white text-base font-semibold font-mono">
                            {overtimeTime}
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <button
                        onClick={handlePrimaryAction}
                        disabled={loading}
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2.5 px-3 rounded-lg border border-white/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={primaryLabel}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <PrimaryIcon className="w-4 h-4" />
                        )}
                        <span className="text-sm">{loading ? "Processing..." : primaryLabel}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventTransation;
