"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import InsightsCard from "./InsightsCard";
import { Button } from "@/components/ui/button";
import employeeEventTransactionApi from "@/services/punches/punches";
import { useUserId } from "@/store/userStore";

interface Punch {
  type: "IN" | "OUT";
  at: string; // ISO datetime
}

interface PunchCardProps {
  punches?: Punch[];
  onPunch?: () => Promise<any> | (() => void);
}

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

export default function PunchCard({ punches = [] }: PunchCardProps) {
  const onPunch = (arguments[0] as any)?.onPunch ?? undefined;
  const userId = useUserId();
  const [punching, setPunching] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  // Determine last IN and OUT
  const lastIn = useMemo(
    () => [...punches].reverse().find((p) => p.type === "IN") ?? null,
    [punches]
  );
  const lastOut = useMemo(
    () => [...punches].reverse().find((p) => p.type === "OUT") ?? null,
    [punches]
  );

  const isClockedIn = Boolean(
    lastIn && (!lastOut || new Date(lastIn.at) > new Date(lastOut.at))
  );

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isClockedIn) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isClockedIn]);

  // Compute today's work duration: sum of IN->OUT intervals for today, plus running if clocked in
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const totalMs = useMemo(() => {
    let ms = 0;
    // sort ascending
    const sorted = [...punches].sort(
      (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()
    );
    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      if (p.type === "IN") {
        // find next OUT
        const nextOut = sorted.slice(i + 1).find((x) => x.type === "OUT");
        const inTime = new Date(p.at).getTime();
        const outTime = nextOut
          ? new Date(nextOut.at).getTime()
          : isClockedIn
          ? now
          : null;
        if (outTime && inTime >= todayStart.getTime()) {
          ms += Math.max(0, outTime - inTime);
        } else if (outTime && inTime < todayStart.getTime()) {
          // partially overlapping from midnight
          ms += Math.max(0, outTime - todayStart.getTime());
        }
      }
    }
    return ms;
  }, [punches, now, isClockedIn, todayStart]);

  const runningSince = isClockedIn ? new Date(lastIn!.at) : null;

  return (
    <InsightsCard
      title="Punches"
      description="In/out times and today work hours"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-medium">
              {isClockedIn ? "Clocked In" : "Clocked Out"}
            </div>
          </div>
          <div>
            <Button
              variant={isClockedIn ? "destructive" : "default"}
              size="sm"
              disabled={punching}
              onClick={async () => {
                setActionError(null);
                if (!userId) {
                  setActionError("Unable to determine user id");
                  return;
                }

                setPunching(true);
                try {
                  await employeeEventTransactionApi.punch({
                    transaction_time: new Date(),
                    reason: isClockedIn ? "OUT" : "IN",
                    remarks: null,
                    device_id: null,
                    user_entry_flag: true,
                    created_id: userId as any,
                  } as any);

                  // call parent refresh if provided
                  if (typeof onPunch === "function") {
                    await onPunch();
                  }
                } catch (err: any) {
                  setActionError(err?.message || "Failed to punch");
                } finally {
                  setPunching(false);
                }
              }}
            >
              {punching ? "…" : isClockedIn ? "Punch Out" : "Punch In"}
            </Button>
            {actionError ? (
              <div className="text-xs text-red-600">{actionError}</div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Last In</div>
            <div className="font-medium">
              {lastIn ? new Date(lastIn.at).toLocaleTimeString() : "—"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Last Out</div>
            <div className="font-medium">
              {lastOut ? new Date(lastOut.at).toLocaleTimeString() : "—"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">
            Work hours (today)
          </div>
          <div className="text-2xl font-semibold">
            {formatDuration(totalMs)}
          </div>
          {isClockedIn && runningSince ? (
            <div className="text-xs text-muted-foreground">
              Running since {runningSince.toLocaleTimeString()}
            </div>
          ) : null}
        </div>
      </div>
    </InsightsCard>
  );
}
