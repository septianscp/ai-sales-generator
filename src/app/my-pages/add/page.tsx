"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SassTemplate from "@/components/my-pages/template/Sass";
import MinimalistTemplate from "@/components/my-pages/template/Minimalist";
import PageEditor from "@/components/my-pages/PageEditor";
import { useState, useRef } from "react";
import { PageData } from "@/types/page-data";
import { savePageAction } from "@/app/actions/page-actions";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/constant/template";
import { toast } from "sonner";

export default function AddPage() {
    const [value, setValue] = useState<PageData>({
        product: "",
        description: "",
        features: [""],
        targetAudience: "",
        usp: "",
        template: 1
    });
    const componentRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);

    const handleGenerate = async () => {
        if (!value.product) {
            toast.error("Please enter a product name first.");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to generate content");
            }

            const data = await response.json();
            setGeneratedContent(data);

            toast.success("Page generated successfully!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to generate content.");
        } finally {
            setIsGenerating(false);
            setIsSaving(false);
        }
    }

    const handleSave = async () => {
        if (generatedContent == null) {
            toast.warning("Please generate page before saving.");
            return;
        }

        setIsSaving(true);
        try {
            await savePageAction({
                productName: value.product,
                config: value,
                generatedContent: generatedContent,
                templateId: value.template,
            });
            toast.success("Page saved successfully!");
            router.push("/my-pages");
        } catch (error: any) {
            toast.error(error.message || "Failed to save page.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleExportToHTML = async () => {
        if (generatedContent === null || !componentRef.current) {
            toast.warning("Please generate page before exporting.");
            return;
        }

        const title = value.product || "Sales Page";

        const inlinedStyles = Array.from(document.styleSheets)
            .flatMap(sheet => {
                try {
                    return Array.from(sheet.cssRules).map(rule => rule.cssText);
                } catch {
                    return [];
                }
            })
            .join("\n");

        const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <style>${inlinedStyles}
    body, * { font-family: 'Inter', sans-serif !important; }
    </style>
  </head>
  <body>
    ${componentRef.current.innerHTML}
  </body>
</html>`;

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${value.product.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-950 font-sans overflow-hidden">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6">
                <div className="flex items-center gap-3">
                    <Link href="/my-pages" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    Back to Dashboard
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportToHTML}
                        disabled={isSaving || isGenerating || generatedContent == null}
                    >
                        Export to HTML
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={isSaving || isGenerating}
                    >
                        {isGenerating ? "Generating..." : "Generate Page"}
                    </Button>
                    <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={handleSave}
                        disabled={isSaving || isGenerating}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <PageEditor value={value} setValue={setValue} onGenerate={handleGenerate} />
                <main className="flex-1 bg-[#F5F5F7] dark:bg-zinc-900/50 p-8 overflow-y-auto relative flex justify-center">
                    <div className="w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden h-fit min-h-[800px]">

                        <div className="h-12 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 relative shrink-0">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 w-64 h-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] text-zinc-400 flex items-center justify-center">
                                {value.product ? value.product.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() + ".com" : "sales-generator.com"}
                            </div>
                        </div>

                        {isGenerating && (
                            <div className="absolute inset-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-lg font-medium text-zinc-900 dark:text-white">Crafting your page...</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">This may take a few seconds</p>
                            </div>
                        )}
                        {generatedContent === null ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[600px]">
                                <p className="text-lg font-medium text-zinc-900 dark:text-white">Click the button above to generate your page</p>
                            </div>
                        ) : (
                            <>
                                {
                                    !isGenerating && (
                                        TEMPLATES.map((template, index) => {
                                            if (template.id === value.template) {
                                                switch (template.id) {
                                                    case 1:
                                                        return <SassTemplate ref={componentRef} key={index} config={value} generatedContent={generatedContent} />;

                                                    default:
                                                        return <MinimalistTemplate ref={componentRef} key={index} config={value} generatedContent={generatedContent} />;

                                                }
                                            }
                                        })
                                    )
                                }
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}