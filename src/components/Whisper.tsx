"use client";

import { AudioManager } from "../components/AudioManager";
import Transcript from "../components/Transcript";
import { useTranscriber } from "../hooks/useTranscriber";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Whisper = () => {
    const transcriber = useTranscriber();

    return (
        <>
            <div className="w-full mt-auto mb-8 flex-center mx-36 gap-2 flex flex-col">
                <div className="flex justify-center flex-col items-center">
                    <div className="container flex flex-col text-base justify-center items-center">
                        <Transcript transcribedData={transcriber.output} />
                    </div>
                </div>

                <Tabs defaultValue="text" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="speech">Speech</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text">
                        <Textarea
                            className="border-2 min-h-0 h-[52px] rounded-xl text-lg text-wrap resize-none"
                            placeholder="Chat with Alfred..."
                        />
                    </TabsContent>

                    <TabsContent value="speech">
                        <AudioManager transcriber={transcriber} />
                    </TabsContent>
                </Tabs>

                {/* <div>
                    <Textarea
                        className="border-2 min-h-0 h-[52px] rounded-xl text-lg text-wrap resize-none"
                        placeholder="Chat with Alfred..."
                    />
                    <AudioManager transcriber={transcriber} />
                </div> */}
            </div>
        </>
    );
};

export default Whisper;
