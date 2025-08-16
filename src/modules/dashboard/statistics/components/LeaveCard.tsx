'use client';
import React from 'react';
import Link from 'next/link';
import { WorkingDaysIcon, TotalLeavesIcon, LeaveTakenIcon, AbsentIcon, PendingIcon, ApprovedIcon } from "@/components/common/svg/icons";
import { ArrowRight } from 'lucide-react';

function LeaveCard() {
    return(
        <div className="shadow-card rounded-xl bg-background p-2 border border-border/60">
            <div className="flex flex-row justify-between p-4">
                <h5 className="text-lg text-text-primary font-bold">Permission & Leaves</h5>
                <Link href="/self-services" className="text-primary text-sm font-medium flex items-center justify-center gap-1">
                    Apply Leave
                    <ArrowRight size={16} className="text-primary" />
                </Link>
            </div>
            {/* Grid for leave stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                {/* Top Row */}
                <div className="grid grid-cols-3 gap-6 col-span-1 md:col-span-3 relative">
                    {/* Working Days */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-group bg-background w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(0,120,212,0.05)]">
                                {WorkingDaysIcon()}
                            </div>
                            <p className="text-text-secondary font-semibold text-sm">Working Days</p>
                        </div>
                        <p className="text-2xl text-primary font-bold">212</p>
                    </div>
                    {/* Vertical Divider */}
                    <div className="hidden md:block absolute top-4 -bottom-16  left-2/3 w-0.5 -translate-x-1/2 pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-b from-transparent via-primary/10 to-transparent rounded-full" />
                    </div>
                    {/* Total Leaves */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-group bg-background w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(103,65,202,0.05)]">
                                {TotalLeavesIcon()}
                            </div>
                            <p className="text-text-secondary font-semibold text-sm">Total Leaves</p>
                        </div>
                        <p className="text-2xl text-[#6741CA] font-bold">09</p>
                    </div>
                    {/* Vertical Divider */}
                    <div className="hidden md:block absolute top-5 -bottom-16 left-1/3 w-0.5 pointer-events-none z-10">
                        <div className="h-full w-full bg-gradient-to-b from-transparent via-primary/10 to-transparent rounded-full" />
                    </div>
                    {/* Leaves Taken */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-group bg-background w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(255,191,0,0.15)]">
                                {LeaveTakenIcon()}
                            </div>
                            <p className="text-text-secondary font-semibold text-sm">Leaves Taken</p>
                        </div>
                        <p className="text-2xl text-[#FFBF00] font-bold">06</p>
                    </div>
                    {/* Horizontal Divider */}
                    <div className="hidden md:block absolute left-4 right-4 -bottom-3 h-0.5 -translate-y-1/2 w-auto pointer-events-none z-10">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-full" />
                    </div>
                </div>
                {/* Bottom Row */}
                <div className="grid grid-cols-3 gap-6 col-span-1 md:col-span-3">
                    {/* Leaves Absent */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-group bg-background w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(218,21,62,0.05)]">
                                {AbsentIcon()}
                            </div>
                            <p className="text-text-secondary font-semibold text-sm">Leaves Absent</p>
                        </div>
                        <p className="text-2xl text-[#DA153E] font-bold">03</p>
                    </div>
                    {/* Approved Leaves */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-group bg-background w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(29,170,97,0.05)]">
                                {ApprovedIcon()}
                            </div>
                            <p className="text-text-secondary font-semibold text-sm">Approved Leaves</p>
                        </div>
                        <p className="text-2xl text-[#1DAA61] font-bold">02</p>
                    </div>
                    {/* Pending Leaves */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="icon-group bg-background w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(255,99,71,0.1)]">
                                {PendingIcon()}
                            </div>
                            <p className="text-text-secondary font-semibold text-sm">Pending Leaves</p>
                        </div>
                        <p className="text-2xl text-[#FF6347] font-bold">01</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaveCard;