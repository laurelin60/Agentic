import ChatInput from "@/components/ChatInput";
import { SearchTitle } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import WebSocket from "@/components/WebSocket";

export default async function Home() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // const dbUser = user
    //     ? await db.user.findFirst({
    //           where: {
    //               id: user?.id,
    //           },
    //       })
    //     : null;

    return (
        <>
            <div className="wrapper flex-center flex-col font-semibold min-h-[calc(100vh-6rem)]">
                <ChatInput />

                {/* <div className="py-100">
                    <ToggleViewer searchingQuery={true} />
                </div> */}

                <WebSocket />
            </div>
        </>
    );
}
