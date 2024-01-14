"use client";

import React, { useState } from "react";
import { AudioManager } from "./AudioManager";
import { useTranscriber } from "../../hooks/useTranscriber";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Whisper = () => {
    const transcriber = useTranscriber();
    const [message, setMessage] = useState("");

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
            <div className="w-full mt-auto flex-center mx-36 gap-2 flex flex-col">
                <Tabs defaultValue="speech" className="w-[700px] mb-20">
                    <TabsContent value="text">
                        <Textarea
                            value={message}
                            className="border-2 min-h-0 h-[52px] rounded-xl text-lg text-wrap resize-none"
                            placeholder="Ask Alfred to do anything..."
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </TabsContent>

                    <TabsContent value="speech">
                        <AudioManager transcriber={transcriber} />
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

export default Whisper;
