"use client";

import React, { useState } from "react";
import { Switch } from "../ui/switch";

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const ToggleViewer = (props: { searchingQuery: any }) => {
    const [toggled, setToggled] = useState(false);

    const handleClick = () => {
        if (toggled) {
            setToggled(false);
        } else {
            setToggled(true);
        }
    };

    return (
        <>
            {props.searchingQuery && (
                <div className="flex">
                    <div className="pr-2">viewer</div>
                    <Switch id="toggle viewer" onClick={handleClick} />
                </div>
            )}
        </>
    );
};

export default ToggleViewer;
