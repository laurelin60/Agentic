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

type Message = {
    type: string;
    message: string;
    fromUser: boolean;
};

const wsClient = new WebSocket("ws://localhost:6969");

let idk = false;

const ChatInput = () => {
    const transcriber = useTranscriber();
    const [message, setMessage] = useState("");
    const [serverMessages, setServerMessages] = useState<Message[]>([{
        type: "info",
        message: "Hey there! I'm Agentic, your personal assistant.",
        fromUser: false,
    }]);

    if (!idk) {
        wsClient.addEventListener("open", async function open() {
            console.log("Connected to server");
        });

        wsClient.addEventListener(
            "message",
            function incoming(message: MessageEvent) {
                console.log(chalk.cyan("Server raw response:"), message.data);
                let parsed = JSON.parse(message.data);
                if (parsed.type === "msg") {
                    console.log(chalk.yellow("MESSAGE TO USER:"), parsed.msg);
                    setServerMessages([...serverMessages, {
                        type: "msg",
                        message: parsed.msg,
                        fromUser: false
                    }]);
                } else if (parsed.type === "info") {
                    console.log(chalk.blue("INFO:"), parsed.msg);
                    setServerMessages([...serverMessages, {
                        type: "info",
                        message: parsed.msg,
                        fromUser: false
                    }]);
                } else if (parsed.type === "action") {
                    console.log(chalk.gray(parsed.msg));
                    setServerMessages([...serverMessages, {
                        type: "action",
                        message: parsed.msg,
                        fromUser: false
                    }]);
                }
            }
        );
        idk = true;
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key == "Enter" && !event.shiftKey) {
            console.log("Sending message:", message);
            serverMessages.push({
                type: "msg",
                message: message,
                fromUser: true
            });
            wsClient.send(JSON.stringify({ type: "msg", msg: message }));
            event.preventDefault();
            setMessage("");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    return (
        <>
            {false ? (
                <>
                    <SearchTitle />
                    <Graphics />
                </>
            ) : (
                <>
                    <div className="w-[600px] flex flex-col justify-between">
                        {/* <img
                            src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?cs=srgb&dl=pexels-chevanon-photography-1108099.jpg&fm=jpg"
                            alt="Image"
                            className="rounded-md object-cover w-[700px]"
                        /> */}

                        <div>
                            {serverMessages && 
                                serverMessages.map((message, index) => (
                                <div
                                    key={message.message + index}
                                    className={`flex flex-row ${
                                        message.fromUser ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`${
                                            message.fromUser
                                                ? "bg-blue-200"
                                                : "bg-gray-200"
                                        } rounded-xl p-2 m-2`}
                                        style={{
                                            maxWidth: "80%",
                                            color: message.type === "action" ? "gray" : message.type === "info" ? "#8091ba" : "black",
                                        }}
                                    >
                                        {message.message}
                                    </div>
                                </div>
                                ))
                            }
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
                            setServerMessages={setServerMessages}
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
