"use client";

import React from "react";
import { Button } from "./ui/button";
import { StartWebsocket } from "./Socket";

const WebSocket = () => {
    return (
        <div>
            <Button onClick={StartWebsocket}>Start WS</Button>
        </div>
    );
};

export default WebSocket;
