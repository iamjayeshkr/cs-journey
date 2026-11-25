import { NextResponse } from "next/server";
import { computeCurriculumCoverage } from "@/lib/coverage-manifest";

export async function GET() {
  const coverage = computeCurriculumCoverage();
  return NextResponse.json(coverage);
}
