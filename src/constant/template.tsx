
export const TEMPLATES: Array<{ id: number, name: string, node: () => React.ReactNode }> = [
    {
        id: 1,
        name: "SaaS",
        node: () => <>
            <div className="absolute inset-x-2 top-2 h-2 rounded-sm w-1/2 bg-indigo-200 dark:bg-indigo-700/50"></div>
            <div className="absolute inset-x-2 top-6 bottom-2 rounded-sm bg-indigo-100 dark:bg-indigo-800/30"></div></>
    },
    {
        id: 2,
        name: "Minimalist",
        node: () => <>
            <div className="absolute inset-x-2 top-2 h-2 rounded-sm w-3/4 bg-zinc-100 dark:bg-zinc-700">
            </div>
            <div className="absolute inset-x-2 top-6 h-2 rounded-sm w-5/6 bg-zinc-100 dark:bg-zinc-700">
            </div>
            <div className="absolute inset-x-2 top-10 h-2 rounded-sm w-5/6 bg-zinc-100 dark:bg-zinc-700">
            </div>
            <div className="absolute inset-x-2 top-14 h-2 rounded-sm w-5/6 bg-zinc-100 dark:bg-zinc-700">
            </div><div className="absolute inset-x-2 top-10 h-2 rounded-sm w-5/6 bg-zinc-100 dark:bg-zinc-700">
            </div>
        </>
    }
]   