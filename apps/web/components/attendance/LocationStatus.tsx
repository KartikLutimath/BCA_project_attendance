"use client";

import { MapPin, CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface LocationStatusProps {
  isLocating: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isVerified: boolean;
  distance: number | null;
  error: string | null;
  onRequestLocation: () => void;
}

export function LocationStatus({
  isLocating,
  latitude,
  longitude,
  accuracy,
  isVerified,
  distance,
  error,
  onRequestLocation,
}: LocationStatusProps) {
  const hasLocation = latitude !== null && longitude !== null;

  return (
    <div className="rounded-xl border bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Location Verification</h3>
      </div>

      {/* Status display */}
      <div className={cn(
        "flex items-center gap-3 rounded-lg p-4 border",
        isVerified ? "bg-green-50 border-green-200" :
        error ? "bg-red-50 border-red-200" :
        hasLocation ? "bg-blue-50 border-blue-200" :
        "bg-muted/50 border-border"
      )}>
        {isLocating ? (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
        ) : isVerified ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        ) : error ? (
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
        ) : hasLocation ? (
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
        ) : (
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          {isLocating ? (
            <p className="text-sm font-medium text-blue-700">Acquiring GPS signal...</p>
          ) : isVerified ? (
            <>
              <p className="text-sm font-medium text-green-700">Location verified</p>
              {distance !== null && (
                <p className="text-xs text-green-600">{distance}m from classroom center</p>
              )}
            </>
          ) : error ? (
            <>
              <p className="text-sm font-medium text-red-700">Location error</p>
              <p className="text-xs text-red-600 truncate">{error}</p>
            </>
          ) : hasLocation ? (
            <>
              <p className="text-sm font-medium text-blue-700">Location acquired</p>
              <p className="text-xs text-muted-foreground">
                {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                {accuracy && ` · ±${Math.round(accuracy)}m accuracy`}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">GPS location not yet acquired</p>
          )}
        </div>
      </div>

      {/* Action button */}
      {!hasLocation && !isLocating && (
        <Button
          onClick={onRequestLocation}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          <MapPin className="h-4 w-4" />
          Get My Location
        </Button>
      )}

      {error && (
        <Button
          onClick={onRequestLocation}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          <MapPin className="h-4 w-4" />
          Retry Location
        </Button>
      )}
    </div>
  );
}
