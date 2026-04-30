import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { landingPageSchema } from "@/lib/ai/schema";
import { PageData } from "@/types/page-data";

export const maxDuration = 30;

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({ error: "Google API Key is missing" }, { status: 500 });
  }

  try {
    const body: PageData = await req.json();

    const { product, description, features, targetAudience, usp, price } = body;

    const result = await generateObject({
      model: google("gemini-flash-latest"),
      schema: landingPageSchema,
      prompt: `
        You are a world-class conversion copywriter. Your goal is to generate high-converting landing page content for a product/service.

        PRODUCT DETAILS:
        - Name: ${product}
        - Description: ${description}
        - Key Features: ${features.join(", ")}
        - Target Audience: ${targetAudience}
        - Unique Selling Point (USP): ${usp}
        - Price Reference: ${price || "Not specified"}

        INSTRUCTIONS:
        1. Create a compelling headline using the "How to [achieve result] without [pain point]" or "The easiest way to [result]" framework.
        2. Write a sub-headline that builds desire.
        3. Break down the features into benefits that matter to the target audience.
        4. Suggest appropriate Lucide icons for each feature.
        5. Create a realistic social proof testimonial.
        6. Format the pricing clearly based on the provided reference.
        7. Ensure the tone is professional, persuasive, and tailored to the target audience.
        8. Pricing always in Rupiah.
      `,
    });

    return Response.json(result.object);

  } catch (error: any) {
    console.error("Full AI Generation Error:", {
      message: error.message,
      stack: error.stack,
      data: error.data,
      statusCode: error.statusCode,
      responseBody: error.responseBody,
    });
    return Response.json(
      { error: "Failed to generate content", details: error.message },
      { status: 500 }
    );
  }
}
