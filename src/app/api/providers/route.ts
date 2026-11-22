import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      include: {
        models: {
          include: {
            model: {
              include: {
                company: true,
                benchmarks: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    console.error("Providers API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch providers",
      },
      { status: 500 }
    );
  }
}
