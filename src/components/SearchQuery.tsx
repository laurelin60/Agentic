"use client";

import React, { useState } from "react";

export const SearchQuery = () => {
  const query = "Finding a wheelchair under 100 dollars";

  return <div className="text-3xl font-bold">{query}</div>;
};

export const SearchAction = () => {
  const searchAction = "searching ebay";

  return <div className="text-2xl">{searchAction}</div>;
};
