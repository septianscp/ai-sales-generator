"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateUserSchema } from "@/lib/validations/auth";

export default function SettingsPage() {
    const { update } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ companyName?: string; email?: string }>({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) throw new Error("Failed to load profile");
                const data = await res.json();
                setCompanyName(data.user.companyName || "");
                setEmail(data.user.email || "");
            } catch (err: any) {
                toast.error(err.message || "Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = updateUserSchema.safeParse({ companyName, email });
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                companyName: fieldErrors.companyName?.[0],
                email: fieldErrors.email?.[0],
            });
            toast.error("Please fix the errors below.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyName, email }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update profile");
            }

            toast.success("Profile updated successfully!");
            await update({
                name: companyName,
                email: email,
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                        Profile Settings
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Update your account details and preferences.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Personal Information</h2>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="companyName">Company / User Name</FieldLabel>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Acme Inc."
                                    />
                                    {errors.companyName && (
                                        <p className="text-sm text-red-500">{errors.companyName}</p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </Field>
                            </FieldGroup>

                            <div className="pt-4 flex justify-end border-t border-zinc-100 dark:border-zinc-800">
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                                >
                                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
