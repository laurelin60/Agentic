"use client";

import React, { useEffect } from "react";

export const Hints = () => {
    const hintList = ['Start by saying "Hey Alfred..."'];

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
        <>
            <img src="/alfred_logo.png" alt="yo" className="w-32 h-32 opacity-80" />
            <div className="text-5xl mb-4 opacity-80">How can I help you today?</div>
            <Hints />
        </>
    );
};
