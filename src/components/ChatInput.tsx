"use client";

import React, { useState } from "react";
import { AudioManager } from "./whisper/AudioManager";
import { useTranscriber } from "../hooks/useTranscriber";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Graphics } from "./Graphics";
import { SearchTitle } from "./Title";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Transcript from "./whisper/Transcript";
import chalk from "chalk";

type ServerMessage = {
    type: string;
    message: string;
};

const wsClient = new WebSocket("ws://localhost:6969");

wsClient.addEventListener("open", async function open() {
    console.log("Connected to server");
});

wsClient.addEventListener(
    "message",
    function incoming(message: { toString: () => any }) {
        let raw = message.toString();
        let parsed = JSON.parse(raw);
        if (parsed.type === "msg") {
            console.log(chalk.yellow("SERVER SENT:"), parsed.msg);
            process.stdout.write(">");
        } else if (parsed.type === "info") {
            console.log(chalk.blue("INFO:"), parsed.msg);
        } else if (parsed.type === "action") {
            console.log(chalk.gray("ACTION:"), parsed.msg);
        }
    }
);

const ChatInput = () => {
    const transcriber = useTranscriber();
    const [message, setMessage] = useState("");
    const [serverMessage, setServerMessage] = useState<ServerMessage>({
        type: "action",
        message: "haha",
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key == "Enter" && !event.shiftKey) {
            event.preventDefault();
            setMessage("");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    return (
        <>
            {!(message.length > 0) ? (
                <>
                    <SearchTitle />
                    <Graphics />
                </>
            ) : (
                <>
                    <div className="w-[400px] flex flex-col justify-between">
                        <img
                            src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?cs=srgb&dl=pexels-chevanon-photography-1108099.jpg&fm=jpg"
                            alt="Image"
                            className="rounded-md object-cover w-[700px]"
                        />

                        <div className="bg-red-500">
                            {serverMessage && (
                                <p>
                                    {serverMessage.type}:{" "}
                                    {serverMessage.message}
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="w-full mt-auto flex-center mx-36 gap-2 flex flex-col">
                <div className="flex justify-center flex-col items-center">
                    <div className="container flex flex-col text-base justify-center items-center">
                        <Transcript transcribedData={transcriber.output} />
                    </div>
                </div>

                <Tabs
                    defaultValue="speech"
                    className="w-[300px] xs:w-[350px] sm:w-[600px] lg:w-[900px] mb-20"
                >
                    <TabsContent value="text">
                        <Textarea
                            value={message}
                            className="border-2 min-h-0 h-[52px] rounded-xl text-lg text-wrap resize-none"
                            placeholder="Ask Agentic to do anything..."
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </TabsContent>

                    <TabsContent value="speech">
                        <AudioManager
                            transcriber={transcriber}
                            wsClient={wsClient}
                        />
                    </TabsContent>

                    <TabsList className="mt-2">
                        <TabsTrigger value="speech">Speech</TabsTrigger>
                        <TabsTrigger value="text">Text</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </>
    );
};

export default ChatInput;
