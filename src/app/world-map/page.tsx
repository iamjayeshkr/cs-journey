"use client";

import React, { useEffect, useState } from "react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { MapKingdom, WorldMapCanvas } from "@/components/WorldMapCanvas";

export default function WorldMapPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kingdoms, setKingdoms] = useState<MapKingdom[]>([]);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setKingdoms(d.kingdoms ?? []);
      });
  }, []);

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <WorldMapCanvas kingdoms={kingdoms} />
      </div>
    </JournalShell>
  );
}
