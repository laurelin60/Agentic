import Whisper from "@/components/Whisper";
import Profile from "@/components/Profile";
import SearchTitle from "@/components/Title";
import ToggleViewer from "@/components/ViewerToggle";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Loader2, Search, Square } from "lucide-react";
import Link from "next/link";
import { Profiler } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import AudioPlayer from "@/components/ConvertEleven";
import { Footer } from "@/components/Footer";

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
            <div className="wrapper flex-center flex-col font-semibold min-h-[calc(10vh-6rem)]">
                <SearchTitle/>
                <Whisper />
                <div className="py-100">
                    <ToggleViewer />
                </div>
            </div>

            <div className="flex">
                <div className="absolute top-0 right-0 px-2 py-2">
                    <Profile />
                </div>
            </div>

            <div className="">
                <Footer />
            </div>
        </>
    );
}
