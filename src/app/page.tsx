"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowRight, BarChart, Users } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";
import { Stats } from "@/types/page-data";
import { Button } from "@/components/ui/button";

const StatSkeleton = () => (
  <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
);

export default function Home() {

  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setIsError(true);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Welcome back, {userName}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Ready to generate AI Sales Page?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {
            isError ?
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Error fetching stats</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
                </div>
              </div>
              :
              <>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Generated Pages</h3>
                    <Users className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div className="mt-4 flex items-baseline gap-x-2">
                    {isLoading ? <StatSkeleton /> : (
                      <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {stats?.total ?? 0}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">all time</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Generated Today</h3>
                    <BarChart className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div className="mt-4 flex items-baseline gap-x-2">
                    {isLoading ? <StatSkeleton /> : (
                      <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {stats?.today ?? 0}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">since midnight</p>
                </div>
              </>
          }


        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Activity</h2>
            <Link
              href="/my-pages"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="p-4 sm:px-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-40 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : stats?.recentPages.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No pages generated yet.{" "}
                  <Link href="/my-pages/add" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Create your first one!
                  </Link>
                </div>
              ) : (
                stats?.recentPages.map(page => (
                  <Link
                    key={page.id}
                    href={`/my-pages/edit/${page.id}`}
                    className="block p-4 sm:px-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                            {page.productName}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {page.templateId === 1 ? "SaaS Template" : "Minimalist Template"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400 whitespace-nowrap ml-4">
                        {timeAgo(page.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
