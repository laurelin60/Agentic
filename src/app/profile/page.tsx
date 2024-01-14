"use client";

import Profile from "@/components/Profile";
import SearchDisplay from "@/components/SearchQueryDisplay";

const Page = () => {
  return (
    <div>
      <div className="absolute top-0 right-0 px-2 py-2">
        <Profile />
      </div>
      <div className="flex justify-center">
        <SearchDisplay />
      </div>
    </div>
  );
};

export default Page;
