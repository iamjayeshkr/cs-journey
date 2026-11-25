"use client";

import React, { useEffect, useState } from "react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { MapKingdom, WorldMapCanvas } from "@/components/WorldMapCanvas";

export default function WorldMapPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kingdoms, setKingdoms] = useState<MapKingdom[]>([]);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setKingdoms(d.kingdoms ?? []);
        setOverall(d.overall_progress ?? 0);
      });
  }, []);

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <WorldMapCanvas kingdoms={kingdoms} overallProgress={overall} />
      </div>
    </JournalShell>
  );
}
