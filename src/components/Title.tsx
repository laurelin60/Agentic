"use client";

import React, { useEffect } from "react";

export const Hints = () => {
    const hintList = ['Start by asking Agentic to do something'];

    useEffect(() => {
        const updateHints = () => {
            console.log("update hints");
        };

        const intervalId = setInterval(updateHints, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="text-1m opacity-60">{hintList[0]}</div>
        </>
    );
};

export const SearchTitle = () => {
    return (
        <div className="my-auto flex-center flex-col gap-y-2">
            <img src="/alfred_logo.png" alt="yo" className="w-16 h-16" />

            <div className="text-2xl font-semibold">
                How can I help you today?
            </div>
            {/* <Hints /> */}
        </div>
    );
};
