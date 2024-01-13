"use client"

import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { CircleUserRound } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const Profile = () => {
  const handleProfile = () => {
    alert('profile');
  }

  const handleConnections = () => {
    alert('connections')
  }

  const handleHistory = () => {
    alert('history')
  }

  const handleSettings = () => {
    alert('settings')
  }

  const handleLogOut = () => {
    alert('Log Out')
  }

  return (
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <CircleUserRound className="size-10"/>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleConnections}>Connections</DropdownMenuItem>
                <DropdownMenuItem onClick={handleHistory}>History</DropdownMenuItem>
                <DropdownMenuSeparator /> 
                <DropdownMenuItem onClick={handleLogOut}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};

export default Profile;
