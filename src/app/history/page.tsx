"use client";

import Profile from "@/components/Profile";
import HistoryCard from "@/components/history/HistoryUI";

const Page = () => {

    return (
        <div>
            <div className="text-2m font-bold text-primary sm:text-2xl">
                History 
            </div>
            <HistoryCard />
            
            <div className="absolute top-0 right-0 px-2 py-2">
                <Profile/>
            </div>
        </div>
    );
};

export default Page;
