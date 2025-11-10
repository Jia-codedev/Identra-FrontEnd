"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { UserLocation } from "../types";
import employeeEventTransactionApi from "@/services/punches/punches";
import { useUserId } from "@/store/userStore";
import { toast } from "sonner";

interface PunchControlProps {
  isWithinRadius: boolean;
  userLocation: UserLocation | null;
  disabled?: boolean;
}

type PunchType = "IN" | "OUT";

const PunchControl: React.FC<PunchControlProps> = React.memo(
  ({ isWithinRadius, userLocation, disabled = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastPunchType, setLastPunchType] = useState<PunchType | null>(null);
    const employeeId = useUserId();

    const handlePunch = async (type: PunchType) => {
      if (!employeeId) {
        toast.error("Employee ID not found", {
          description: "Please login again",
        });
        return;
      }

      if (!isWithinRadius) {
        toast.error(`Cannot punch ${type.toLowerCase()}`, {
          description: "You are outside the allowed area",
        });
        return;
      }

      if (!userLocation) {
        toast.error("Location unavailable", {
          description: "Unable to get your current location",
        });
        return;
      }

      try {
        setIsLoading(true);

        const geolocation = `${userLocation.latitude},${userLocation.longitude}`;

        // Call the appropriate API method
        const response =
          type === "IN"
            ? await employeeEventTransactionApi.checkIn(employeeId, geolocation)
            : await employeeEventTransactionApi.checkOut(
                employeeId,
                geolocation
              );

        console.log(`✅ Punch ${type} Response:`, response);

        setLastPunchType(type);
        toast.success(`Punch ${type} successful`, {
          description: `Recorded at ${new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        });
      } catch (error: any) {
        console.error(`Punch ${type} error:`, error);
        toast.error(`Punch ${type} failed`, {
          description:
            error?.response?.data?.message ||
            error.message ||
            "An error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const isDisabled =
      disabled || !isWithinRadius || !userLocation || isLoading;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isWithinRadius && userLocation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ You must be within the allowed area to punch in/out
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Punch In Button */}
              <Button
                onClick={() => handlePunch("IN")}
                disabled={isDisabled || lastPunchType === "IN"}
                className="w-full h-20 text-lg font-semibold"
                variant={lastPunchType === "IN" ? "outline" : "default"}
              >
                {isLoading && lastPunchType !== "OUT" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Punching...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Punch In
                  </>
                )}
              </Button>

              {/* Punch Out Button */}
              <Button
                onClick={() => handlePunch("OUT")}
                disabled={isDisabled || lastPunchType === "OUT"}
                className="w-full h-20 text-lg font-semibold"
                variant={lastPunchType === "OUT" ? "outline" : "destructive"}
              >
                {isLoading && lastPunchType === "OUT" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Punching...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-5 w-5" />
                    Punch Out
                  </>
                )}
              </Button>
            </div>

            {lastPunchType && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  Last punch:{" "}
                  <span className="font-semibold">{lastPunchType}</span> at{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <p>• You must be within the schedule location radius to punch</p>
              <p>• Your location will be recorded with each punch</p>
              <p>• Ensure location services are enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PunchControl.displayName = "PunchControl";

export default PunchControl;
