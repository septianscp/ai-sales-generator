"use client";

import React, { useState } from "react";
import {
    Menu,
    X,
    LogOut,
    User,
    PanelTop
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MENUS } from "@/constant/menu";



interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-zinc-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    const userInitials = session?.user?.name
        ? session.user.name.substring(0, 2).toUpperCase()
        : "??";
    const userName = session?.user?.name || "Guest";
    const userEmail = session?.user?.email || "";

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-72 lg:flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
                    <PanelTop className="h-6 w-6 text-indigo-500 mr-2" />
                    <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                        AI Sales Generator
                    </span>
                    <button
                        className="ml-auto lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                    <nav className="flex-1 space-y-1">
                        {MENUS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        isActive
                                            ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white",
                                        "group flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            isActive ? "text-indigo-500" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
                                            "mr-3 h-5 w-5 shrink-0 transition-colors"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>


                </div>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-zinc-700 dark:text-zinc-300 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex flex-1 gap-x-4 align-center justify-end self-stretch lg:gap-x-6">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-x-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer">
                                    <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm ring-2 ring-white dark:ring-zinc-900">
                                        {userInitials}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{userName}</span>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{userEmail}</span>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/settings">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600 dark:text-red-400"
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
