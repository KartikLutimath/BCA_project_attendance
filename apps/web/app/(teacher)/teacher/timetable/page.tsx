"use client";

import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { formatTime, getDayLabel } from "@/lib/utils/format";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function TeacherTimetablePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="My Timetable" subtitle="Weekly class schedule" />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center py-2 px-1 rounded-lg bg-muted text-xs font-semibold text-muted-foreground"
                >
                  {getDayLabel(day)}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Calendar className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">Timetable data will appear here</p>
              <p className="text-xs text-center max-w-xs">
                Your weekly schedule is loaded from the backend. Make sure your teacher profile is linked to timetable slots.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Active class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
            <span>Inactive</span>
          </div>
        </div>
      </main>
    </div>
  );
}
