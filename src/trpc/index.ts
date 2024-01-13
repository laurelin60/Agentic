import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "../db";
import { privateProcedure, publicProcedure, router } from "./trpc";

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user?.id || !user?.email) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const dbUser = await db.user.findFirst({
            where: {
                id: user.id,
            },
        });

        if (!dbUser) {
            console.log("no user");
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                },
            });
        }

        return { success: true };
    }),
    getUser: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx;

        return await db.user.findFirst({
            where: {
                id: userId,
            },
        });
    }),
    updateUser: privateProcedure.input({}).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        // const {} = input;

        const existingUser = await db.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: {},
        });

        return updatedUser;
    }),
});

export type AppRouter = typeof appRouter;
