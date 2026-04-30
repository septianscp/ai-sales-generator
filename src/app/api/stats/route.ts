import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Start of today in UTC
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, today, recentPages] = await Promise.all([
        prisma.page.count({ where: { userId } }),
        prisma.page.count({
            where: {
                userId,
                createdAt: { gte: startOfToday },
            },
        }),
        prisma.page.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
                id: true,
                productName: true,
                templateId: true,
                createdAt: true,
            },
        }),
    ]);

    return NextResponse.json({ total, today, recentPages });
}
