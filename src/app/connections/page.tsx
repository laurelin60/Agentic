"use client";

import Profile from "@/components/Profile";

const Page = () => {
  return (
    <div>
      <div className="text-2m font-bold text-primary sm:text-2xl">
        Connections
      </div>

      <div className="absolute top-0 right-0 px-2 py-2">
        <Profile />
      </div>
    </div>
  );
};

export default Page;
