"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Loader2, CheckCircle2, XCircle, Clock, Upload, FileSpreadsheet, Download } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { savePageAction } from "@/app/actions/page-actions";
import * as XLSX from "xlsx";
import { HEADERS, TABLE_EXAMPLES, TABLE_HEADERS } from "@/constant/bulk-upload";

type BulkItem = {
    id: string;
    product: string;
    description: string;
    features: string[];
    targetAudience: string;
    usp: string;
    price: number;
    template: number;
    status: "pending" | "generating" | "done" | "error";
    error?: string;
};

const StatusBadge = ({ status, error }: { status: BulkItem["status"]; error?: string }) => {
    const map = {
        pending: <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Clock className="h-3.5 w-3.5" />Pending</span>,
        generating: <span className="flex items-center gap-1.5 text-xs text-indigo-500"><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating...</span>,
        done: <span className="flex items-center gap-1.5 text-xs text-emerald-500"><CheckCircle2 className="h-3.5 w-3.5" />Done</span>,
        error: <span className="flex items-center gap-1.5 text-xs text-red-500" title={error}><XCircle className="h-3.5 w-3.5" />Failed</span>,
    };
    return map[status];
};

function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, TABLE_EXAMPLES]);
    ws["!cols"] = HEADERS.map(() => ({ wch: 30 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pages");
    XLSX.writeFile(wb, "bulk-pages-template.xlsx");
}

export default function BulkCreatePage() {
    const [items, setItems] = useState<BulkItem[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { header: 1 }) as any[][];

                // Skip header row (row 0)
                const parsed: BulkItem[] = rows
                    .slice(1)
                    .filter(row => row[0] && String(row[0]).trim() !== "")
                    .map(row => ({
                        id: crypto.randomUUID(),
                        product: String(row[0] || "").trim(),
                        description: String(row[1] || "").trim(),
                        features: String(row[2] || "")
                            .split(",")
                            .map(f => f.trim())
                            .filter(Boolean),
                        targetAudience: String(row[3] || "").trim(),
                        usp: String(row[4] || "").trim(),
                        price: Number(row[5]) || 0,
                        template: Number(row[6]) || 1,
                        status: "pending",
                    }));

                if (parsed.length === 0) {
                    toast.error("No valid rows found in the file. Make sure to fill the 'product' column.");
                    return;
                }

                setItems(parsed);
                toast.success(`Loaded ${parsed.length} product(s) from ${file.name}`);
            } catch {
                toast.error("Failed to parse the Excel file. Make sure it matches the template format.");
            }
        };
        reader.readAsArrayBuffer(file);
        // Reset input so the same file can be re-uploaded
        e.target.value = "";
    };

    const updateItemStatus = (id: string, updates: Partial<BulkItem>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const generateOne = async (item: BulkItem): Promise<void> => {
        updateItemStatus(item.id, { status: "generating" });
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product: item.product,
                    description: item.description,
                    features: item.features.length > 0 ? item.features : [""],
                    targetAudience: item.targetAudience,
                    usp: item.usp,
                    price: item.price,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Generation failed");
            }

            const data = await response.json();
            await savePageAction({
                productName: item.product,
                config: {
                    product: item.product,
                    description: item.description,
                    features: item.features,
                    targetAudience: item.targetAudience,
                    usp: item.usp,
                    price: item.price,
                    template: item.template as any,
                },
                generatedContent: data,
                templateId: item.template,
            });

            updateItemStatus(item.id, { status: "done" });
        } catch (err: any) {
            updateItemStatus(item.id, { status: "error", error: err.message });
        }
    };

    const handleBulkGenerate = async () => {
        if (items.length === 0) {
            toast.error("Upload an Excel file first.");
            return;
        }

        setIsRunning(true);
        setItems(prev => prev.map(i => ({ ...i, status: "pending" as const })));

        for (const item of items) {
            await generateOne(item);
        }

        setIsRunning(false);
        const failed = items.filter(i => i.status === "error").length;
        if (failed === 0) {
            toast.success(`All ${items.length} pages generated and saved!`);
            setTimeout(() => router.push("/my-pages"), 1500);
        } else {
            toast.warning(`Completed with ${failed} error(s). Check items marked as failed.`);
        }
    };

    const doneCount = items.filter(i => i.status === "done").length;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6">
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Link href="/my-pages" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="font-medium text-zinc-900 dark:text-white">Bulk Generate from Excel</span>
                    {isRunning && (
                        <span className="text-indigo-500 text-xs font-mono">{doneCount} / {items.length} done</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                        <Download className="h-4 w-4 mr-1.5" /> Download Template
                    </Button>
                    <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={handleBulkGenerate}
                        disabled={isRunning || items.length === 0}
                    >
                        {isRunning ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating {doneCount}/{items.length}...</>
                        ) : (
                            `Generate All (${items.length})`
                        )}
                    </Button>
                </div>
            </header>

            {isRunning && (
                <div className="h-1 bg-zinc-100 dark:bg-zinc-900">
                    <div
                        className="h-1 bg-indigo-600 transition-all duration-500"
                        style={{ width: items.length > 0 ? `${(doneCount / items.length) * 100}%` : "0%" }}
                    />
                </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
                {/* Upload area */}
                <div
                    className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group"
                    onClick={() => !isRunning && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isRunning}
                    />
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                        {fileName ? (
                            <FileSpreadsheet className="h-8 w-8 text-indigo-500" />
                        ) : (
                            <Upload className="h-8 w-8 text-indigo-400" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {fileName ? fileName : "Upload Excel File"}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">
                            {fileName
                                ? `${items.length} product(s) loaded — click to re-upload`
                                : "Click to upload your .xlsx or .xls file"
                            }
                        </p>
                    </div>
                    {!fileName && (
                        <Button variant="outline" size="sm" className="pointer-events-none">
                            Browse File
                        </Button>
                    )}
                </div>

                {/* Instructions */}
                {items.length === 0 && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
                            How to use
                        </h3>
                        <ol className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
                            <li>Click <strong className="text-zinc-800 dark:text-zinc-200">Download Template</strong> to get the Excel file with correct columns.</li>
                            <li>Fill in your product data — one row per product.</li>
                            <li>Upload the filled file using the area above.</li>
                            <li>Click <strong className="text-zinc-800 dark:text-zinc-200">Generate All</strong> to start bulk generation.</li>
                        </ol>
                        <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs text-zinc-500 font-mono">
                            <div className="grid grid-cols-7 gap-1 border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-2 font-bold text-zinc-600 dark:text-zinc-300">
                                {
                                    TABLE_HEADERS.map((header: string) => (
                                        <span key={header}>{header}</span>
                                    ))
                                }
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-zinc-400">
                                {TABLE_EXAMPLES.map((item, idx) => (
                                    <span key={idx}>{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Item list */}
                {items.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">
                                {items.length} Products to Generate
                            </h3>
                            {!isRunning && (
                                <Button variant="ghost" size="sm" className="text-xs text-zinc-500" onClick={() => { setItems([]); setFileName(null); }}>
                                    Clear all
                                </Button>
                            )}
                        </div>
                        {items.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`bg-white dark:bg-zinc-900 rounded-xl border px-5 py-4 flex items-center gap-4 transition-colors ${item.status === "done" ? "border-emerald-200 dark:border-emerald-900/60" :
                                    item.status === "error" ? "border-red-200 dark:border-red-900/60" :
                                        item.status === "generating" ? "border-indigo-300 dark:border-indigo-800" :
                                            "border-zinc-200 dark:border-zinc-800"
                                    }`}
                            >
                                <span className="text-xs font-mono text-zinc-400 w-6 text-right shrink-0">{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-zinc-900 dark:text-white text-sm truncate">{item.product}</p>
                                    <p className="text-xs text-zinc-500 truncate">{item.description || "No description"}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="text-xs text-zinc-400 hidden md:block">
                                        {item.features.filter(Boolean).length} feature(s)
                                    </span>
                                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                                        {item.template === 1 ? "SaaS" : "Minimalist"}
                                    </span>
                                    <StatusBadge status={item.status} error={item.error} />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-zinc-400 hover:text-red-500"
                                        disabled={isRunning}
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
