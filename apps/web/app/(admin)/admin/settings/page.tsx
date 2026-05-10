"use client";

import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Building2, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" subtitle="System configuration and geofence management" />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Geofence settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Classroom Geofence Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure GPS coordinates and allowed radius for each classroom. Students must be within the radius to mark attendance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Latitude", placeholder: "e.g. 15.4589" },
                { label: "Longitude", placeholder: "e.g. 75.0078" },
                { label: "Radius (metres)", placeholder: "e.g. 200" },
              ].map((f, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>

            <Button className="gap-2" size="sm">
              <Save className="h-4 w-4" />
              Save Geofence
            </Button>
          </CardContent>
        </Card>

        {/* System info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Platform", value: "SmartAttendance AI v1.0" },
                { label: "Backend", value: "Node.js + Express + Prisma" },
                { label: "Database", value: "MySQL" },
                { label: "Auth", value: "JWT (15m access / 7d refresh)" },
                { label: "Geofence", value: "Haversine formula, 150–250m radius" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
