"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <>
            <div className="flex flex-row gap-x-10 justify-center">
                <Link href="/about">About</Link>

                <p className="text-gray">
                    Alfred can make mistakes. Please be patient if it messes up.
                </p>
            </div>
        </>
    );
};

export default Footer;
