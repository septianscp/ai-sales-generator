import { PanelsTopLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyPages() {
    return (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-16 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-900 p-4 mb-4">
                <PanelsTopLeft className="h-10 w-10 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                No pages created yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-2 mb-6">
                You haven't built any AI landing pages yet. Start by creating your first conversion-optimized page.
            </p>
            <Link href="/my-pages/add">
                <Button>Create Your First Page</Button>
            </Link>
        </div>
    );
}