"use client";

import { Topbar } from "@/components/shared/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, Calendar } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Reports" subtitle="Generate and export attendance reports" />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Semester Report", desc: "Full attendance report for the semester", icon: FileText, format: "Excel" },
            { label: "Monthly Report", desc: "Month-wise attendance breakdown", icon: Calendar, format: "PDF" },
          ].map((r, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <r.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  {r.format}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Institutional Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <BarChart3 className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">Analytics coming in Phase 7</p>
              <p className="text-xs text-center max-w-xs">
                Institutional attendance trends, heatmaps, and predictions will be available here.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
