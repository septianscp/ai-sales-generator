"use client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ModalConfirm from "./ModalConfirm";
import { CardPageProps } from "@/types/page-data";
import { TEMPLATES } from "@/constant/template";

export default function CardPage({ page }: CardPageProps) {
    const config = page.config as any;
    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/pages/${page.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete page");

            toast.success("Page deleted successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setOpen(false);
            setIsDeleting(false);
        }
    };

    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 py-0 overflow-hidden">

            <CardHeader className="p-4">
                <CardTitle className="text-lg">{page.productName}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                    {config.description || "No description provided."}
                </CardDescription>

                <CardDescription className="line-clamp-2 text-xs">
                    Template : {
                        TEMPLATES.find((item) => item.id === config.template)?.name
                    }
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-2 p-4 pt-0 relative z-40">
                <Link href={`/my-pages/edit/${page.id}`} passHref className="w-full">
                    <Button size="sm" className="flex-1 gap-2 cursor-pointer w-full">
                        <ExternalLink className="h-3.5 w-3.5" /> View
                    </Button>
                </Link>

                <Button
                    variant='outline'
                    size="sm"
                    className="w-9 px-0 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    onClick={() => setOpen(true)}
                    disabled={isDeleting}
                >
                    <Trash className="h-4 w-4" />
                </Button>

                <ModalConfirm onDelete={handleDelete} isLoading={isDeleting} open={open} setOpen={setOpen} />
            </CardFooter>
        </Card>
    );
}
