import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db";

export async function DELETE(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const demoApps = await prisma.application.findMany({
      where: { isDemo: true },
      select: { id: true },
    });

    const demoAppIds = demoApps.map((a) => a.id);

    if (demoAppIds.length > 0) {
      await prisma.aiSuggestion.deleteMany({
        where: { applicationId: { in: demoAppIds } },
      });
      await prisma.interview.deleteMany({
        where: { applicationId: { in: demoAppIds } },
      });
      await prisma.document.deleteMany({
        where: { applicationId: { in: demoAppIds } },
      });
      await prisma.application.deleteMany({ where: { isDemo: true } });
    }

    await prisma.company.deleteMany({
      where: {
        isDemo: true,
        applications: { none: {} },
      },
    });

    return NextResponse.json({ success: true, deleted: demoAppIds.length });
  } catch (error) {
    console.error("Clear demo data failed:", error);
    return NextResponse.json(
      { error: "Failed to clear demo data" },
      { status: 500 }
    );
  }
}