import Whisper from "@/components/whisper/Whisper";
import { SearchTitle } from "@/components/Title";
import ToggleViewer from "@/components/whisper/ViewerToggle";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Loader2, Search, Square } from "lucide-react";
import Link from "next/link";
import { Profiler } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import AudioPlayer from "@/components/ConvertEleven";

export default async function Home() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const dbUser = user
        ? await db.user.findFirst({
              where: {
                  id: user?.id,
              },
          })
        : null;

    return (
        <>
            <span className="py-100" />
            <div className="wrapper flex-center flex-col font-semibold min-h-[calc(100vh-6rem)]">
                <SearchTitle />

                <Whisper />

                {/* <div className="py-100">
                    <ToggleViewer searchingQuery={true} />
                </div> */}
            </div>
        </>
    );
}
