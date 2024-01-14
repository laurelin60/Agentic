import ChatInput from "@/components/ChatInput";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import WebSocket from "@/components/WebSocket";

export default async function Home() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const dbUser = user
        ? await db.user.findFirst({
              where: {
                  id: user.id,
              },
          })
        : null;

    if (!dbUser && user && user.email) {
        await db.user.create({
            data: {
                id: user.id,
                email: user.email,
            },
        });
    }

    return (
        <>
            <div className="wrapper flex-center flex-col font-semibold min-h-[calc(100vh-6rem)]">
                <ChatInput />
                <div className="pb-8">
                    <WebSocket />
                </div>
            </div>
        </>
    );
}
