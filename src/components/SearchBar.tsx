"use client"

import React, { useState, ChangeEvent, KeyboardEvent} from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
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
    // Call the provided onSearch callback with the current searchTerm
    // onSearch(searchTerm);
    console.log(searchTerm);
    setSearchTerm('');
  };

  return (
    <div>
      {/* <input
        type="text"
        placeholder="enter an action..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='rounded-full px-[25%] py-[1%] border'
      /> */}

      <Input 
      placeholder='enter an action...' 
      value={searchTerm} 
      onChange={handleInputChange}
      className=''
      />

    <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
