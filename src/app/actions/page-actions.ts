"use server";

import { prisma } from "@/lib/prisma";
import { PageData } from "@/types/page-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function savePageAction(data: {
  id?: string;
  productName: string;
  config: PageData;
  generatedContent?: any;
  templateId: number;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You must be logged in to save a page.");
  }

  const { id, productName, config, generatedContent, templateId } = data;

  if (id) {
    // Update existing page
    const updatedPage = await prisma.page.update({
      where: { id, userId: session.user.id },
      data: {
        productName,
        config: config as any,
        generatedContent: generatedContent || undefined,
        templateId,
      },
    });
    revalidatePath("/my-pages");
    return updatedPage;
  } else {
    // Create new page
    const newPage = await prisma.page.create({
      data: {
        userId: session.user.id,
        productName,
        config: config as any,
        generatedContent: generatedContent || undefined,
        templateId,
      },
    });
    revalidatePath("/my-pages");
    return newPage;
  }
}
