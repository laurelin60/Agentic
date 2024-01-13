import Profile from "@/components/Profile";
import SearchBar from "@/components/SearchBar";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Loader2, Search, Square } from "lucide-react";
import Link from "next/link";
import { Profiler } from "react";


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
            
            <div className="absolute top-0 right-0 px-2 py-2">
                <Profile/>
            </div>
            <SearchBar/> 
        </>
    );
};
