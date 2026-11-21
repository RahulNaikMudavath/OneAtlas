import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
        company: true,
        providers: {
          include: {
            provider: true,
          },
        },
        benchmarks: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: models.length,
      data: models,
    });
  } catch (error) {
    console.error("Models API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch AI models",
      },
      { status: 500 }
    );
  }
}
