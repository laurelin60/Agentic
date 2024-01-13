"use client";

import { AudioManager } from "../components/AudioManager";
import Transcript from "../components/Transcript";
import { useTranscriber } from "../hooks/useTranscriber";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

const Whisper = () => {
    const transcriber = useTranscriber();

    return (
        <>
            <div className="w-full mt-auto mb-8 flex-center mx-36 gap-2">
                <Textarea
                    className="border-2 min-h-0 h-[52px] rounded-xl text-lg text-wrap resize-none"
                    placeholder="Chat with Alfred..."
                />
                <AudioManager transcriber={transcriber} />
            </div>

            {/* <div className="flex justify-center items-center min-h-screen">
                <div className="container flex flex-col justify-center items-center">
                    <Transcript transcribedData={transcriber.output} />
                </div>
            </div> */}
        </>
    );
};

export default Whisper;
