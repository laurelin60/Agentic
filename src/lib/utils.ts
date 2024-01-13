import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
    if (typeof window !== "undefined") return path;
    if (process.env.PUBLIC_NEXT_VERCEL_URL)
        return `https://${process.env.PUBLIC_NEXT_VERCEL_URL}${path}`;
    return `http://localhost:${process.env.PUBLIC_NEXT_PORT ?? 3002}${path}`;
}
