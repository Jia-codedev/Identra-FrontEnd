import { useState, useEffect, useCallback } from "react";
import employeeEventTransactionApi from "@/services/punches/punches";
import { toast } from "sonner";
import { useUserId } from "@/store/userStore";

export const useEventTransaction = () => {
  const employeeId = useUserId();
  const [currentTime, setCurrentTime] = useState<string>("00:00:00");
  const [workingDuration, setWorkingDuration] = useState<string>("00:00:00");
  const [renderKey, setRenderKey] = useState<number>(0); // Force re-render counter
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string>("--:--");
  const [checkOutTime, setCheckOutTime] = useState<string>("--:--");
  const [checkInTimestamp, setCheckInTimestamp] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("08:00");
  const [overtimeTime, setOvertimeTime] = useState<string>("00:00");
  const [loading, setLoading] = useState<boolean>(false);
  const [scheduleInfo, setScheduleInfo] = useState<any>(null);

  // Update current time and working duration every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      // Calculate working duration based on check-in/check-out status
      if (checkInTimestamp && isCheckedIn) {
        // User is currently checked in - count up from check-in time to now
        const elapsedMs = Math.max(0, now.getTime() - checkInTimestamp.getTime());
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const duration = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        
        console.log("⏱️ Timer Update:", {
          now: now.toLocaleTimeString(),
          checkInTime: checkInTimestamp.toLocaleTimeString(),
          elapsedMs,
          totalSeconds,
          duration,
          isCheckedIn,
          renderKey
        });
        
        setWorkingDuration(duration);
        setRenderKey(prev => prev + 1); // Force re-render
      } else if (!checkInTimestamp) {
        setWorkingDuration("00:00:00");
      }
      // If checked out, timer stays frozen (don't update)
    }, 1000);

    return () => clearInterval(timer);
  }, [isCheckedIn, checkInTimestamp, renderKey]);

  // Fetch punch status and schedule info
  const fetchPunchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const [punchStatusRes, scheduleRes] = await Promise.all([
        employeeEventTransactionApi.getPunchStatus(employeeId ?? undefined),
        employeeEventTransactionApi.getTodaySchedule(),
      ]);

      console.log("🔍 Raw API Response:", {
        punchStatusRes,
        actual_in_time: punchStatusRes.data.actual_in_time,
        actual_out_time: punchStatusRes.data.actual_out_time,
        current_status: punchStatusRes.data.current_status
      });

      if (punchStatusRes.success) {
        const { actual_in_time, actual_out_time, current_status } =
          punchStatusRes.data;

        const isCurrentlyCheckedIn = current_status === "IN";
        setIsCheckedIn(isCurrentlyCheckedIn);

        if (actual_in_time) {
          // Parse the time from backend - it should be in ISO format
          const inTime = new Date(actual_in_time);
          
          console.log("📍 Setting Check-in:", {
            rawInTime: actual_in_time,
            parsedInTime: inTime,
            inTimeString: inTime.toLocaleTimeString(),
            inTimeISO: inTime.toISOString(),
            currentTime: new Date().toLocaleTimeString(),
            isCheckedIn: isCurrentlyCheckedIn
          });
          
          setCheckInTimestamp(inTime);
          setCheckInTime(
            inTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })
          );

          // If checked IN, calculate initial duration to trigger the timer
          if (isCurrentlyCheckedIn) {
            const now = new Date();
            const elapsedMs = Math.max(0, now.getTime() - inTime.getTime());
            const totalSeconds = Math.floor(elapsedMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            const initialDuration = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            console.log("⏰ Initial Duration:", initialDuration, "Elapsed seconds:", totalSeconds);
            
            setWorkingDuration(initialDuration);
            setRenderKey(prev => prev + 1); // Force re-render
          }
          // If checked out, calculate the frozen duration
          else if (actual_out_time) {
            const outTime = new Date(actual_out_time);
            const elapsedMs = Math.max(0, outTime.getTime() - inTime.getTime());
            const totalSeconds = Math.floor(elapsedMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            setWorkingDuration(
              `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
            setRenderKey(prev => prev + 1); // Force re-render
          }
        } else {
          setCheckInTimestamp(null);
          setCheckInTime("--:--");
          setWorkingDuration("00:00:00");
          setRenderKey(prev => prev + 1); // Force re-render
        }

        if (actual_out_time) {
          const outTime = new Date(actual_out_time);
          console.log("📤 Setting Check-out:", {
            rawOutTime: actual_out_time,
            parsedOutTime: outTime,
            outTimeString: outTime.toLocaleTimeString(),
          });
          setCheckOutTime(
            outTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        } else {
          setCheckOutTime("--:--");
        }
      }

      if (scheduleRes.success && scheduleRes.data) {
        setScheduleInfo(scheduleRes.data);
        calculateWorkHours(
          scheduleRes.data,
          punchStatusRes.data.actual_in_time,
          punchStatusRes.data.actual_out_time
        );
      }
    } catch (error: any) {
      console.error("Error fetching punch status:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate remaining and overtime hours
  const calculateWorkHours = (
    schedule: any,
    actualInTime: Date | null,
    actualOutTime: Date | null
  ) => {
    if (!schedule?.schedule_info || !actualInTime) {
      setRemainingTime("--:--");
      setOvertimeTime("00:00");
      return;
    }

    const now = new Date();
    const inTime = new Date(actualInTime);
    const scheduledWorkMinutes =
      schedule.schedule_info.expected_work_duration?.total_minutes || 480; // Default 8 hours

    // Calculate worked minutes
    const endTime = actualOutTime ? new Date(actualOutTime) : now;
    const workedMinutes = Math.floor(
      (endTime.getTime() - inTime.getTime()) / (1000 * 60)
    );

    // Calculate remaining time
    const remainingMinutes = Math.max(0, scheduledWorkMinutes - workedMinutes);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;
    setRemainingTime(
      `${String(remainingHours).padStart(2, "0")}:${String(remainingMins).padStart(2, "0")}`
    );

    // Calculate overtime
    const overtimeMinutes = Math.max(0, workedMinutes - scheduledWorkMinutes);
    const overtimeHours = Math.floor(overtimeMinutes / 60);
    const overtimeMins = overtimeMinutes % 60;
    setOvertimeTime(
      `${String(overtimeHours).padStart(2, "0")}:${String(overtimeMins).padStart(2, "0")}`
    );
  };

  // Refresh data periodically
  useEffect(() => {
    fetchPunchStatus();
    const interval = setInterval(fetchPunchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchPunchStatus]);

  const handleCheckIn = async () => {
    if (!employeeId) {
      toast.error("Employee ID not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      let geolocation: string | undefined;

      // Get geolocation if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            }
          );
          geolocation = `${position.coords.latitude},${position.coords.longitude}`;
        } catch (geoError) {
          console.warn("Geolocation not available:", geoError);
        }
      }

      const checkInResponse = await employeeEventTransactionApi.checkIn(employeeId, geolocation);
      console.log("✅ Check-in Response:", checkInResponse);

      // Optimistic UI update using local time
      const now = new Date();
      setIsCheckedIn(true);
      setCheckInTimestamp(now);
      setCheckInTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setWorkingDuration("00:00:00");
      setRenderKey((k) => k + 1);

      toast.success("Checked in successfully!");

      // Wait a bit for backend to process, then refresh
      setTimeout(async () => {
        await fetchPunchStatus();
      }, 500);
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast.error(error?.response?.data?.message || "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) {
      toast.error("Employee ID not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      let geolocation: string | undefined;

      // Get geolocation if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            }
          );
          geolocation = `${position.coords.latitude},${position.coords.longitude}`;
        } catch (geoError) {
          console.warn("Geolocation not available:", geoError);
        }
      }

      const checkOutResponse = await employeeEventTransactionApi.checkOut(employeeId, geolocation);
      console.log("✅ Check-out Response:", checkOutResponse);

      // Optimistic UI update using local time
      const now = new Date();
      setIsCheckedIn(false);
      setCheckOutTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      if (checkInTimestamp) {
        const elapsedMs = Math.max(0, now.getTime() - checkInTimestamp.getTime());
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setWorkingDuration(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }
      setRenderKey((k) => k + 1);

      toast.success("Checked out successfully!");

      // Wait a bit for backend to process, then refresh
      setTimeout(async () => {
        await fetchPunchStatus();
      }, 500);
    } catch (error: any) {
      console.error("Check-out error:", error);
      toast.error(error?.response?.data?.message || "Failed to check out");
    } finally {
      setLoading(false);
    }
  };

  return {
    currentTime,
    workingDuration,
    renderKey,
    isCheckedIn,
    checkInTime,
    checkOutTime,
    remainingTime,
    overtimeTime,
    loading,
    scheduleInfo,
    handleCheckIn,
    handleCheckOut,
    refreshStatus: fetchPunchStatus,
  };
};
