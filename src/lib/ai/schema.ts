import { z } from "zod";

export const landingPageSchema = z.object({
  headline: z.string().describe("A catchy, high-converting headline for the hero section."),
  subHeadline: z.string().describe("A supporting sub-headline that expands on the value proposition."),
  heroDescription: z.string().describe("A short, persuasive paragraph for the hero section."),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().describe("A Lucide icon name that fits the feature (e.g., 'Zap', 'Shield', 'BarChart').")
  })).min(3).max(6),
  benefits: z.array(z.string()).describe("A list of key benefits for the user."),
  socialProof: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string()
  }),
  pricing: z.object({
    planName: z.string(),
    price: z.string(),
    features: z.array(z.string())
  }),
  cta: z.string().describe("A clear, compelling call-to-action text (e.g., 'Get Started for Free').")
});

export type GeneratedLandingPage = z.infer<typeof landingPageSchema>;
