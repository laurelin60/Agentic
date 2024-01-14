"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { SearchQuery, SearchAction } from "./SearchQuery";

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
