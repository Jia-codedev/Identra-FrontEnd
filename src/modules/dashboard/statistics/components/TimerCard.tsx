"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { PunchInIcon, PunchOutIcon } from "@/components/common/svg/icons";
import { Card } from "@/components/ui/card";

function TimerCard() {
  const [dubaiTime, setDubaiTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setDubaiTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Dubai",
        })
      );
    };
    updateTime(); // Set immediately on mount
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-xl relative rounded bg-gradient-to-bl from-primary/50 to-primary/60 text-white px-6 py-7 flex flex-col items-center overflow-hidden">
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/clock-bg.svg"
          alt="Clock Your Hours"
          objectFit="cover"
          layout="fill"
          className="blur-[2px] opacity-60"
        />
      </div>
      {/* Foreground content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <h5 className="text-lg font-bold tracking-wide drop-shadow">
          Clock your hours
        </h5>
        <p className="text-[40px] font-extrabold tracking-widest text-center p-0.5 drop-shadow-lg select-none">
          {mounted ? dubaiTime : "--:--:--"}
        </p>
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md mb-2">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/20 text-xs px-5 py-1 shadow-sm backdrop-blur-md">
            <p className="font-semibold pb-1 text-white/90">Remaining</p>
            <p className="text-lg font-bold text-white">04:26</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/20 text-xs px-5 py-1 shadow-sm backdrop-blur-md">
            <p className="font-semibold pb-1 text-white/90">Overtime</p>
            <p className="text-lg font-bold text-white">00:00</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/20 text-xs px-5 py-1 shadow-sm backdrop-blur-md">
            <p className="font-semibold pb-1 text-white/90">Break Time</p>
            <p className="text-lg font-bold text-white">00:30</p>
          </div>
        </div>
        {/* Punch in/out */}
        <div className="w-full pt-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xs bg-white/10 px-3 py-2 rounded-lg shadow border border-white/20">
            {PunchInIcon()}
            <span className="tracking-wide">07:30AM</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-xs bg-white/10 px-3 py-2 rounded-lg shadow border border-white/20">
            {PunchOutIcon()}
            <span className="tracking-wide">_ _ : _ _</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TimerCard;
