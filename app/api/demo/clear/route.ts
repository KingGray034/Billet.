import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function DELETE() {
  try {
    // Find all demo applications
    const demoApps = await prisma.application.findMany({
      where: { isDemo: true },
      select: { id: true },
    });

    const demoAppIds = demoApps.map((a) => a.id);

    if (demoAppIds.length > 0) {
      // Delete child records first to respect foreign keys
      await prisma.aiSuggestion.deleteMany({ where: { applicationId: { in: demoAppIds } } });
      await prisma.interview.deleteMany({ where: { applicationId: { in: demoAppIds } } });
      await prisma.document.deleteMany({ where: { applicationId: { in: demoAppIds } } });
      await prisma.application.deleteMany({ where: { isDemo: true } });
    }

    // Delete demo companies that have no applications left
    await prisma.company.deleteMany({
      where: {
        isDemo: true,
        applications: { none: {} },
      },
    });

    return NextResponse.json({ success: true, deleted: demoAppIds.length });
  } catch (error) {
    console.error("Clear demo data failed:", error);
    return NextResponse.json({ error: "Failed to clear demo data" }, { status: 500 });
  }
}