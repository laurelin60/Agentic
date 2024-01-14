"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

export const SearchQuery = () => {
    const query = "Finding a wheelchair under 100 dollars";

    return <div className="text-3xl font-bold">{query}</div>;
};

export const SearchAction = () => {
    const [searchAction, setSearchAction] = useState("searching ebay");
    return <div className="text-2xl">{searchAction}</div>;
};

const SearchDisplay = () => {
    const [searchingQuery, setSearching] = useState(true);
    const [showSearching, setShowSearchingState] = useState(true);

    const handleStop = () => {
        setSearching(false);
        setShowSearchingState(false);
    };

    return (
        <>
            {searchingQuery && showSearching && (
                <div className="flex flex-col justify-center items-center bg-gray-100 drop-shadow-md">
                    <div className="text-lg w-[700px] bg-gray-100 rounded-md p-3" />

                    <SearchQuery />
                    <span className="py-3">
                        <SearchAction />
                    </span>

                    <img
                        src="loading.gif"
                        alt="loading gif"
                        className="flex h-16 w-16 justify-center opacity-60 mb-6"
                    />

                    <Button className="mb-6 text-2xl" onClick={handleStop}>
                        stop
                    </Button>
                </div>
            )}
        </>
    );
};

export default SearchDisplay;
