import { Button } from "@/components/ui/button";
import { PageData } from "@/types/page-data";
import { GeneratedLandingPage } from "@/lib/ai/schema";
import * as Icons from "lucide-react";

interface MinimalistTemplateProps {
    config?: PageData;
    generatedContent?: GeneratedLandingPage | null;
    ref?: React.RefObject<HTMLDivElement | null>;
}

export default function MinimalistTemplate({ config, generatedContent, ref }: MinimalistTemplateProps) {
    const productName = config?.product || "";
    const headline = generatedContent?.headline || "";
    const subHeadline = generatedContent?.subHeadline || "";
    const heroDescription = generatedContent?.heroDescription || "";
    const ctaText = generatedContent?.cta || "";

    return (
        <div ref={ref} className="flex-1 flex flex-col bg-white dark:bg-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-8 md:px-16">
                <div className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                    {productName.toUpperCase()}
                </div>
                <Button variant="link" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline decoration-zinc-200 underline-offset-4">
                    {ctaText}
                </Button>
            </header>

            {/* Hero */}
            <main className="flex-1 px-8 md:px-16 py-20 md:py-32 flex flex-col gap-12 max-w-7xl">
                <div className="flex flex-col gap-6">
                    <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-zinc-900 dark:text-white leading-[0.95]">
                        {headline}
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        {heroDescription}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <Button size="lg" className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none px-12 h-16 text-lg font-medium transition-all">
                        {ctaText}
                    </Button>
                    <span className="text-zinc-400 font-mono text-sm tracking-widest uppercase">
                        {subHeadline}
                    </span>
                </div>

                {/* Features Grid */}
                {generatedContent?.features && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 mt-32 border-t border-zinc-100 dark:border-zinc-900 pt-24">
                        {generatedContent.features.map((feature, index) => {
                            const IconComponent = (Icons as any)[feature.icon] || Icons.ArrowUpRight;
                            return (
                                <div key={index} className="flex flex-col gap-6 group">
                                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                                        <h3 className="text-2xl font-medium text-zinc-900 dark:text-white italic tracking-tight">
                                            {feature.title}
                                        </h3>
                                        <IconComponent className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pricing Card (Minimalist Style) */}
                {generatedContent?.pricing && (
                    <div className="mt-40 mb-20 p-12 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col md:flex-row justify-between items-end gap-12">
                        <div className="flex flex-col gap-4">
                            <span className="text-zinc-400 font-mono text-xs tracking-[0.3em] uppercase">Pricing Plan</span>
                            <h2 className="text-4xl font-medium text-zinc-900 dark:text-white">{generatedContent.pricing.planName}</h2>
                            <ul className="flex flex-wrap gap-x-8 gap-y-2 mt-4">
                                {generatedContent.pricing.features.map((f, i) => (
                                    <li key={i} className="text-sm text-zinc-500 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-6xl font-light text-zinc-900 dark:text-white tracking-tighter">
                                {generatedContent.pricing.price}
                            </span>
                            <span className="text-zinc-400 text-sm font-mono tracking-widest uppercase">Per Month</span>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="px-8 md:px-16 py-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center mt-auto">
                <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
                    © {new Date().getFullYear()} {productName}
                </span>
                <div className="flex gap-8">
                    <span className="text-xs font-mono text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors uppercase">Privacy</span>
                    <span className="text-xs font-mono text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors uppercase">Terms</span>
                </div>
            </footer>
        </div>
    );
}
