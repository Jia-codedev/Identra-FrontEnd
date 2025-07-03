'use client';
import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/Carousel";
import { MissedInIcon, MissedOutIcon, EarlyOutIcon, LateInIcon, TrendingUpIcon , TrendingDownIcon } from '@/lib/svg/icons';

function ViolationsCard() {
    return(
        <div className='relative shadow-card rounded-[10px] bg-foreground px-2 pt-3 pb-10 flex flex-col items-center'>
            <div className='w-44 h-44 rounded-full bg-[#0078D426] blur-[50px] absolute left-[50px] top-[50px]'></div>
            <div className='w-44 h-44 rounded-full bg-[#0078D426] blur-[50px] absolute right-[50px] bottom-[50px]'></div>
            <div className='flex flex-row justify-between py-4'>
                <h5 className='text-lg text-text-primary font-bold'>Violations</h5>
            </div>
            <Carousel className="w-full max-w-xs px-5">
                <CarouselContent>
                    <CarouselItem className='pl-0'>
                        <div className='aspect-square flex flex-col items-center justify-center gap-4 px-6'>
                            <div className="h-auto w-full rounded-[10px] bg-gradient-to-r from-[#0078D450] to-[#DAEDFF] p-[2px]">
                                <div className="flex flex-col h-full w-full items-center justify-center bg-foreground rounded-[8px] px-3 py-6">
                                    <div className='flex justify-between w-full'>
                                        <div className='icon-group text-primary bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(0,120,212,0.05)]'>
                                            {MissedInIcon()}
                                        </div>
                                        <div className='text-success text-xs font-extrabold flex gap-1 items-center'>
                                            <span>8.5%</span>
                                            <span>{TrendingUpIcon()}</span>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-3xl text-text-primary font-bold'>0</p>
                                        <p className='text-text-secondary font-semibold text-sm'>Missed in</p>
                                    </div>  
                                </div>
                            </div>
                            <div className='h-[1px] w-[60px] bg-foreground flex self-center'></div>
                            <div className="h-auto w-full rounded-[10px] bg-gradient-to-l from-[#0078D450] to-[#DAEDFF] p-[2px]">
                                <div className="flex flex-col h-full w-full items-center justify-center bg-foreground rounded-[8px] px-3 py-6">
                                    <div className='flex justify-between w-full'>
                                        <div className='icon-group text-[#1E9090] bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(30,144,144,0.15)]'>
                                            {MissedOutIcon()}
                                        </div>
                                        <div className='text-danger text-xs font-extrabold flex gap-1 items-center'>
                                            <span>4.5%</span>
                                            <span>{TrendingDownIcon()}</span>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-3xl text-text-primary font-bold'>3</p>
                                        <p className='text-text-secondary font-semibold text-sm'>Missed out</p>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem className='pl-0'>
                        <div className='aspect-square flex flex-col items-center justify-center gap-4 px-6'>
                            <div className="h-auto w-full rounded-[10px] bg-gradient-to-r from-[#0078D450] to-[#DAEDFF] p-[2px]">
                                <div className="flex flex-col h-full w-full items-center justify-center bg-foreground rounded-[8px] px-3 py-6">
                                    <div className='flex justify-between w-full'>
                                        <div className='icon-group text-[#4318FF] bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(67,24,255,0.15)]'>
                                            {LateInIcon()}
                                        </div>
                                        <div className='text-danger text-xs font-extrabold flex gap-1 items-center'>
                                            <span>3.0%</span>
                                            <span>{TrendingDownIcon()}</span>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-3xl text-text-primary font-bold'>2</p>
                                        <p className='text-text-secondary font-semibold text-sm'>Late in</p>
                                    </div>  
                                </div>
                            </div>
                            <div className='h-[1px] w-[60px] bg-foreground flex self-center'></div>
                            <div className="h-auto w-full rounded-[10px] bg-gradient-to-l from-[#0078D450] to-[#DAEDFF] p-[2px]">
                                <div className="flex flex-col h-full w-full items-center justify-center bg-foreground rounded-[8px] px-3 py-6">
                                    <div className='flex justify-between w-full'>
                                        <div className='icon-group text-[#D2691E] bg-foreground w-[35px] h-[35px] flex justify-center items-center rounded-[10px] shadow-[0_0_20px_15px_rgba(210,105,30,0.15)]'>
                                            {EarlyOutIcon()}
                                        </div>
                                        <div className='text-success text-xs font-extrabold flex gap-1 items-center'>
                                            <span>1.5%</span>
                                            <span>{TrendingUpIcon()}</span>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-3xl text-text-primary font-bold'>1</p>
                                        <p className='text-text-secondary font-semibold text-sm'>Early out</p>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default ViolationsCard;