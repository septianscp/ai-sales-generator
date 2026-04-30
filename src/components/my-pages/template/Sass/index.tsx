import { Button } from "@/components/ui/button";
import { PageData } from "@/types/page-data";
import { GeneratedLandingPage } from "@/lib/ai/schema";
import * as Icons from "lucide-react";

interface SassTemplateProps {
    config?: PageData;
    generatedContent?: GeneratedLandingPage | null;
    ref?: React.RefObject<HTMLDivElement | null>;
}

export default function SassTemplate({ config, generatedContent, ref }: SassTemplateProps) {
    const productName = config?.product || "";
    const headline = generatedContent?.headline || "";
    const subHeadline = generatedContent?.subHeadline || "";
    const heroDescription = generatedContent?.heroDescription || "";
    const ctaText = generatedContent?.cta || "";

    return (
        <div ref={ref} className="flex-1 flex flex-col relative">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-12 py-6 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{productName}</div>

                <Button className="bg-black hover:bg-zinc-800 text-white rounded-md px-6 shadow-sm">
                    {ctaText}
                </Button>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 pb-32">

                <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight max-w-4xl leading-[1.1]">
                    {headline}
                </h1>

                <p className="mt-4 text-xl font-medium text-indigo-600 dark:text-indigo-400">
                    {subHeadline}
                </p>

                <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                    {heroDescription}
                </p>

                <div className="flex items-center gap-4 mt-10">
                    <Button size="lg" className="bg-black hover:bg-zinc-800 text-white px-8 h-12 text-base shadow-sm">
                        {ctaText}
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 h-12 text-base border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
                        View Documentation
                    </Button>
                </div>
            </div>

            {/* Features Section (Simplified for now, but using generated data) */}
            {generatedContent?.features && (
                <div className="px-12 py-16 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {generatedContent.features.map((feature, index) => {
                            const IconComponent = (Icons as any)[feature.icon] || Icons.Zap;
                            return (
                                <div key={index} className="flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Pricing Section */}
            {generatedContent?.pricing && (
                <div className="px-12 py-24 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex flex-col items-center gap-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Simple, Transparent Pricing</h2>
                            <p className="mt-4 text-zinc-500 dark:text-zinc-400">Everything you need to grow your business.</p>
                        </div>

                        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800/50">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{generatedContent.pricing.planName}</h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">{generatedContent.pricing.price}</span>
                                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">/month</span>
                                </div>
                                <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-12 shadow-md shadow-indigo-500/20">
                                    Get Started Now
                                </Button>
                            </div>
                            <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <ul className="flex flex-col gap-4">
                                    {generatedContent.pricing.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <Icons.Check className="h-3.5 w-3.5" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
