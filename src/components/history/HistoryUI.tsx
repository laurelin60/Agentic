"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClearHistory from "./ClearHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const HistoryCard = () => {
  const router = useRouter();
  return (
    <div>
      <Card className="outline">
        <ClearHistory />
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HistoryCard;
