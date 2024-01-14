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
import { Button } from "./ui/button";
import {
    getKindeServerSession,
    LoginLink,
    LogoutLink,
    RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";

const Profile = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // const dbUser = user
    //     ? await db.user.findFirst({
    //           where: {
    //               id: user?.id,
    //           },
    //       })
    //     : null;

    const handleProfile = () => {};

    const handleConnections = () => {};

    const handleHistory = () => {};

    const handleSettings = () => {};

    const handleLogOut = () => {
        alert("logged out!");
    };

    return (
        <div className="flex-center flex-row gap-x-2">
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CircleUserRound className="size-10 font-light" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Connections</DropdownMenuItem>
                        <DropdownMenuItem>History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogoutLink>
                                <Button>Logout</Button>
                            </LogoutLink>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <LoginLink>
                        <Button variant={"ghost"}>Login</Button>
                    </LoginLink>
                    <RegisterLink>
                        <Button>Register</Button>
                    </RegisterLink>
                </>
            )}
        </div>
    );
};

export default Profile;
