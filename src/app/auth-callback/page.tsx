"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { trpc } from "../_trpc/client";

const Page = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const origin = searchParams.get("origin");

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                // User is synced to db
                router.push(origin ? `/${origin}` : "/");
            }
        },
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
                router.push("/sign-in");
            }
        },
        retry: true,
        retryDelay: 500,
    });

    return (
        <div className="mt-24 flex w-full justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
                <h3 className="text-xl font-semibold">
                    Setting up your account...
                </h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    );
};

export default Page;
