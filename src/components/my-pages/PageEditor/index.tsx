import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATES } from "@/constant/template";
import { Plus, Trash2 } from "lucide-react";
import { PageData } from "@/types/page-data";

export default function PageEditor({ value, setValue, onGenerate }: { value: PageData; setValue: (value: PageData) => void; onGenerate: () => void; }) {
    const addFeature = () => {
        setValue({ ...value, features: [...value.features, ""] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...value.features];
        newFeatures.splice(index, 1);
        setValue({ ...value, features: newFeatures });
    };

    const updateFeature = (index: number, featureValue: string) => {
        const newFeatures = [...value.features];
        newFeatures[index] = featureValue;
        setValue({ ...value, features: newFeatures });
    };

    return (
        <div className="w-80 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-y-auto">



            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Layout</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Select a layout for your page.</p>

                <div className="grid grid-cols-2 gap-3">
                    {
                        TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setValue({ ...value, template: template.id })}
                                className={`flex flex-col gap-2 text-left group transition-opacity ${value.template === template.id ? '' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <div className={`aspect-[4/3] rounded-md border-2 overflow-hidden relative ${value.template === template.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'}`}>
                                    {template.node()}
                                </div>
                                <span className="text-xs font-medium text-zinc-900 dark:text-white">{template.name}</span>
                            </button>
                        ))
                    }
                </div>
            </div>

            {/* Section: Page Configuration */}
            <div className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Page Configuration</h2>

                <div className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel htmlFor="productName">Product/Service Name*</FieldLabel>
                        <Input
                            id="productName"
                            placeholder="Your product/service name"
                            value={value.product}
                            onChange={(e) => setValue({ ...value, product: e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                            id="description"
                            placeholder="A brief description of your product/service"
                            value={value.description}
                            onChange={(e) => setValue({ ...value, description: e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Key Features</FieldLabel>
                        <div className="flex flex-col gap-2">
                            {value.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder={`e.g. Real-time tracking`}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeFeature(index)}
                                        disabled={value.features.length === 1}
                                        className="shrink-0 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFeature}
                                className="w-full mt-1 border-dashed text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Another Feature
                            </Button>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="targetAudience">Target Audience</FieldLabel>
                        <Textarea
                            id="targetAudience"
                            placeholder="Who this product is for"
                            value={value.targetAudience}
                            onChange={(e) => setValue({ ...value, targetAudience: e.target.value })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="price">Price (Rp)</FieldLabel>
                        <Input id="price" placeholder="How much it cost"
                            type="number"
                            min={0}
                            value={value.price}
                            onChange={(e) => setValue({ ...value, price: Number(e.target.value) })}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="usp">Unique Selling Points</FieldLabel>
                        <Textarea id="usp" placeholder="Why choose this product?"
                            value={value.usp}
                            onChange={(e) => setValue({ ...value, usp: e.target.value })}
                        />
                    </Field>
                </div>
            </div>

        </div>
    )
}
