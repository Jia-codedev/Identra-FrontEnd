'use client';
import React from 'react';
import Image from "next/legacy/image";
import { PunchInIcon, PunchOutIcon } from '@/lib/svg/icons';

function TimerCard() {
    return(
        <div className='shadow-card relative rounded-[10px] bg-gradient-to-bl from-[#0078D4] to-[#003E6E] text-white p-4 flex flex-col items-center'>
            <Image
                src="/clock-bg.svg"
                alt="Clock Your Hours"
                objectFit="cover"
                layout="fill"
                style={{position: 'absolute'}}
                className='blur-[2px]'
            />
            <h5 className='text-base font-bold'>Clock your hours</h5>
            <p className='text-[35px] font-bold align-center py-4'>07 : 30 : 24</p>
            <div className='flex gap-8'>
                <div className='flex text-center items-center flex-col rounded-[10px] bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.23)] text-xs px-4 py-2'>
                    <p className='font-semibold pb-1'>Remaining</p>
                    <p className='text-[13px] font-bold'>04:26</p>
                </div>
                <div className='flex text-center items-center flex-col rounded-[10px] bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.23)] text-xs px-4 py-2'>
                    <p className='font-semibold pb-1'>Overtime</p>
                    <p className='text-[13px] font-bold'>00:00</p>
                </div>
                <div className='flex text-center items-center flex-col rounded-[10px] bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.23)] text-xs px-4 py-2'>
                    <p className='font-semibold pb-1'>Break Time</p>
                    <p className='text-[13px] font-bold'>00:30</p>
                </div>
            </div>
            <div className='w-full pt-5 flex justify-between'>
                <div className='flex items-center gap-2 font-bold text-xs'>
                    {PunchInIcon()}
                    <p>07:30AM</p>
                </div>
                <div className='flex items-center gap-2 font-bold text-xs'>
                    {PunchOutIcon()}
                    <p>_ _ : _ _</p>
                </div>
            </div>
        </div>
    )
}

export default TimerCard;