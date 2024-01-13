import Link from "next/link";
import React from "react";

const Header = () => {
    return (
        <>
            <nav className="wrapper flex-between inset-x-0 z-30 h-24">
                <div className="text-4xl font-bold text-primary sm:text-5xl">
                    <Link href="/">Alfred</Link>
                </div>
            </nav>
        </>
    );
};

export default Header;
