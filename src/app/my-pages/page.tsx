import DashboardLayout from "@/components/layout/DashboardLayout";
import CardPage from "@/components/my-pages/Card";
import EmptyPages from "@/components/my-pages/Empty";
import { Button } from "@/components/ui/button";
import { CopyPlusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/client";

export default async function myPages() {
    const session = await getServerSession(authOptions);
    const pages = await prisma.page.findMany({
        where: {
            userId: session?.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center" >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                            My Pages
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Manage your landing pages and campaigns.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/my-pages/bulk" passHref>
                            <Button variant="outline" className="cursor-pointer"><CopyPlusIcon /> Bulk Create</Button>
                        </Link>
                        <Link href="/my-pages/add" passHref>
                            <Button className="cursor-pointer"><PlusIcon /> Create Page</Button>
                        </Link>
                    </div>
                </div>

                {pages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pages.map((page: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            productName: string;
                            config: JsonValue;
                            generatedContent: JsonValue | null;
                            templateId: number;
                        }) => (
                            <CardPage key={page.id} page={page} />
                        ))}
                    </div>
                ) : (
                    <EmptyPages />
                )}
            </div>
        </DashboardLayout>
    );
}
