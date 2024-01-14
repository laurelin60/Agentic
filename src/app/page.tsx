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

const Graphics = () => {
    return (
        <div>
            <div className="relative isolate">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-[44px] sm:-top-48"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[26.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-500 to-white opacity-30 sm:left-[calc(50%-30rem)] sm:w-[42.1875rem]"
                    />
                </div>
            </div>
            <div className="relative isolate hidden md:flex">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-[44px] sm:-top-72"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="relative aspect-[1155/678] w-[16.125rem] rotate-[30deg] bg-gradient-to-tr from-orange-500 to-white opacity-30 sm:w-[22.1875rem] md:-right-[0vw] lg:-right-[12vw] xl:-right-[20vw]"
                    />
                </div>
            </div>
        </div>
    );
};

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
            <div className="wrapper flex-center flex-col font-semibold min-h-[calc(100vh-6rem)]">
                <SearchTitle />
                <Graphics />

                <Whisper />

                {/* <div className="py-100">
                    <ToggleViewer searchingQuery={true} />
                </div> */}
            </div>
        </>
    );
}
