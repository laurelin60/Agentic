"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Profile = () => {
  const router = useRouter();
  const handleProfile = () => {
    router.push("/profile");
  };

  const handleConnections = () => {
    router.push("/connections");
  };

  const handleHistory = () => {
    router.push("/history");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleLogOut = () => {
    alert("logged out!");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CircleUserRound className="size-10" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={handleConnections}>
            Connections
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleHistory}>History</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogOut}>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
