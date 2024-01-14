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
        <div className="flex flex-col justify-center items-center bg-gray-100">
          <div className="text-lg w-[700px] bg-gray-100 rounded-md p-3" />
          <SearchQuery />
          <SearchAction />
          <Button className="mb-6" onClick={handleStop}>
            stop
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchDisplay;
