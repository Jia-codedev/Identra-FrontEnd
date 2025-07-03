'use client';
import React from 'react';
import Link from 'next/link';
import { WorkingDaysIcon, TotalLeavesIcon, LeaveTakenIcon, AbsentIcon, PendingIcon, ApprovedIcon } from "@/lib/svg/icons";

function LeaveCard() {
    return(
        <div className='shadow-card rounded-[10px] bg-foreground p-2'>
            <div className='flex flex-row justify-between p-4'>
                <h5 className='text-lg text-text-primary font-bold'>Permission & Leaves</h5>
                <Link href="/self-services" className='text-primary text-sm font-medium flex items-center justify-center gap-1'>
                    Apply Leave
                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.93496 3.28394L13.1537 7.50269C13.2193 7.56801 13.2713 7.64563 13.3068 7.73109C13.3422 7.81656 13.3605 7.90819 13.3605 8.00073C13.3605 8.09327 13.3422 8.18491 13.3068 8.27037C13.2713 8.35584 13.2193 8.43346 13.1537 8.49878L8.93496 12.7175C8.80287 12.8496 8.62372 12.9238 8.43691 12.9238C8.25011 12.9238 8.07096 12.8496 7.93887 12.7175C7.80678 12.5854 7.73257 12.4063 7.73257 12.2195C7.73257 12.0327 7.80678 11.8535 7.93887 11.7214L10.957 8.70327H2.34375C2.15727 8.70327 1.97843 8.62919 1.84657 8.49733C1.7147 8.36547 1.64063 8.18663 1.64063 8.00015C1.64063 7.81367 1.7147 7.63482 1.84657 7.50296C1.97843 7.3711 2.15727 7.29702 2.34375 7.29702L10.957 7.29702L7.93828 4.27886C7.80619 4.14677 7.73198 3.96762 7.73198 3.78081C7.73198 3.59401 7.80619 3.41486 7.93828 3.28276C8.07037 3.15067 8.24952 3.07647 8.43633 3.07647C8.62313 3.07647 8.80228 3.15067 8.93437 3.28276L8.93496 3.28394Z" fill="#0078D4"/>
                    </svg>
                </Link>
            </div>
            <div className='flex p-4'>
                <div>
                    <div className='flex gap-10'>
                        <p className='text-text-secondary font-semibold text-sm w-[60px]'>Working Days</p>
                        <div className='icon-group bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(0,120,212,0.05)]'>
                            {WorkingDaysIcon()}
                        </div>
                    </div>
                    <p className='text-2xl text-primary font-bold'>212</p>
                </div>
                <div className='w-[1px] h-[60px] mx-4 bg-text-secondary flex self-center opacity-15'></div>
                <div>
                    <div className='flex gap-10'>
                        <p className='text-text-secondary font-semibold text-sm w-[60px]'>Total Leaves</p>
                        <div className='icon-group bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(103,65,202,0.05)]'>
                            {TotalLeavesIcon()}
                        </div>
                    </div>
                    <p className='text-2xl text-[#6741CA] font-bold'>09</p>
                </div>
                <div className='w-[1px] h-[60px] mx-4 bg-text-secondary flex self-center opacity-15'></div>
                <div>
                    <div className='flex gap-10'>
                        <p className='text-text-secondary font-semibold text-sm w-[60px]'>Leaves Taken</p>
                        <div className='icon-group bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(255,191,0,0.15)]'>
                            {LeaveTakenIcon()}
                        </div>
                    </div>
                    <p className='text-2xl text-[#FFBF00] font-bold'>06</p>
                </div>
            </div>
            <div className='flex justify-around py-2'>
                <div className='h-[1px] w-[60px] bg-text-secondary flex self-center opacity-10'></div>
                <div className='h-[1px] w-[60px] bg-text-secondary flex self-center opacity-10'></div>
                <div className='h-[1px] w-[60px] bg-text-secondary flex self-center opacity-10'></div>
            </div>
            <div className='flex p-4'>
                <div>
                    <div className='flex gap-10'>
                        <p className='text-text-secondary font-semibold text-sm w-[60px]'>Leaves Absent</p>
                        <div className='icon-group bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(218,21,62,0.05)]'>
                            {AbsentIcon()}
                        </div>
                    </div>
                    <p className='text-2xl text-[#DA153E] font-bold'>03</p>
                </div>
                <div className='w-[1px] h-[60px] mx-4 bg-text-secondary flex self-center opacity-15'></div>
                <div>
                    <div className='flex gap-10'>
                        <p className='text-text-secondary font-semibold text-sm w-[60px]'>Approved Leaves</p>
                        <div className='icon-group bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(29,170,97,0.05)]'>
                            {ApprovedIcon()}
                        </div>
                    </div>
                    <p className='text-2xl text-[#1DAA61] font-bold'>02</p>
                </div>
                <div className='w-[1px] h-[60px] mx-4 bg-text-secondary flex self-center opacity-15'></div>
                <div>
                    <div className='flex gap-10'>
                        <p className='text-text-secondary font-semibold text-sm w-[60px]'>Pending Leaves</p>
                        <div className='icon-group bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(255,99,71,0.1)]'>
                            {PendingIcon()}
                        </div>
                    </div>
                    <p className='text-2xl text-[#FF6347] font-bold'>01</p>
                </div>
            </div>
        </div>
    )
}

export default LeaveCard;