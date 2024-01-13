"use client"

import React, { useState, ChangeEvent, KeyboardEvent} from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key == "Enter"){
        handleSearch();
    }
  }

  const handleSearch = () => {
    if(searchTerm.trim() == ''){
        return;
    }

    setSearchTerm(searchTerm);
    setSearchTerm('');
  };

  return (
    <div>
      <Input 
      placeholder='enter an action...' 
      value={searchTerm} 
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      className='rounded-full'
      />

    <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
