"use client";

import { useState, useCallback } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { LocationStatus } from "@/components/attendance/LocationStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttendanceStore } from "@/store/attendanceStore";
import { useMarkAttendance } from "@/hooks/useAttendance";
import { getCurrentLocation } from "@/lib/geolocation";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Wifi,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export default function AttendancePage() {
  const {
    location,
    isMarkingAttendance,
    lastResult,
    setLocation,
    setLocating,
    setLocationError,
    setLastResult,
    resetLocation,
  } = useAttendanceStore();

  const { mutate: markAttendance } = useMarkAttendance();
  const [step, setStep] = useState<"idle" | "locating" | "ready" | "submitting" | "done">("idle");

  const requestLocation = useCallback(async () => {
    setLocating(true);
    setStep("locating");
    try {
      const loc = await getCurrentLocation(10000);
      setLocation(loc.latitude, loc.longitude, loc.accuracy);
      setStep("ready");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get location";
      setLocationError(msg);
      setStep("idle");
    }
  }, [setLocating, setLocation, setLocationError]);

  const handleMarkAttendance = () => {
    if (!location.latitude || !location.longitude) return;

    setStep("submitting");
    markAttendance(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy ?? undefined,
      },
      {
        onSuccess: () => setStep("done"),
        onError: () => setStep("ready"),
      }
    );
  };

  const handleReset = () => {
    resetLocation();
    setLastResult(null);
    setStep("idle");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Mark Attendance" subtitle="GPS verification required" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto space-y-5">

          {/* Result card */}
          {lastResult && step === "done" && (
            <div className={cn(
              "rounded-xl border p-5 flex items-start gap-4 animate-fade-in",
              lastResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              {lastResult.success ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={cn("font-semibold", lastResult.success ? "text-green-800" : "text-red-800")}>
                  {lastResult.success ? "Attendance Marked!" : "Failed"}
                </p>
                <p className="text-sm mt-0.5 text-muted-foreground">{lastResult.message}</p>
                {lastResult.geofenceVerified && lastResult.distance !== undefined && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs text-green-700">{lastResult.distance}m from classroom</span>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} className="shrink-0">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* How it works */}
          {step === "idle" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How Attendance Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Clock, label: "Active session", desc: "Must be within 20 min of class start" },
                  { icon: MapPin, label: "GPS verification", desc: "Must be within classroom radius" },
                  { icon: Wifi, label: "Submit", desc: "Attendance saved with verification metadata" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Location status */}
          <LocationStatus
            isLocating={location.isLocating}
            latitude={location.latitude}
            longitude={location.longitude}
            accuracy={location.accuracy}
            isVerified={location.isVerified}
            distance={location.distance}
            error={location.locationError}
            onRequestLocation={requestLocation}
          />

          {/* GPS accuracy warning */}
          {location.accuracy !== null && location.accuracy > 100 && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low GPS accuracy</p>
                <p className="text-xs text-yellow-700">
                  Your GPS accuracy is ±{Math.round(location.accuracy)}m. Move to an open area for better signal.
                </p>
              </div>
            </div>
          )}

          {/* Submit button */}
          {step !== "done" && (
            <Button
              onClick={handleMarkAttendance}
              disabled={!location.latitude || !location.longitude || isMarkingAttendance || step === "locating"}
              loading={isMarkingAttendance}
              className="w-full h-12 text-base gap-2"
              size="lg"
            >
              <ClipboardCheck className="h-5 w-5" />
              {isMarkingAttendance ? "Marking attendance..." : "Mark Attendance"}
            </Button>
          )}

          {/* Info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Clock className="h-3.5 w-3.5" />
            <span>Attendance window: 20 minutes from class start</span>
          </div>
        </div>
      </main>
    </div>
  );
}
