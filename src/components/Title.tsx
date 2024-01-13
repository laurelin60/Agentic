"use client"

import React from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchTitle = () => {
  return (
    <div>
        How can I help you today?
    </div>
  );
};

export default SearchTitle;
