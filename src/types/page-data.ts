export const enum Template {
    SASS = 1,
    MINIMALIST = 2,
}

export interface PageData {
    product: string;
    description: string;
    features: string[];
    targetAudience: string;
    price?: number;
    usp?: string;
    template: Template;
}

export type Stats = {
  total: number;
  today: number;
  recentPages: {
    id: string;
    productName: string;
    templateId: number;
    createdAt: string;
  }[];
};

export interface CardPageProps {
    page: {
        id: string;
        productName: string;
        config: any;
        createdAt: Date | string;
    };
}
