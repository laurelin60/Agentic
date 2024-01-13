"use client"

import React, { useState} from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const Profile: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Call the provided onSearch callback with the current searchTerm
    // onSearch(searchTerm);
    console.log(searchTerm);
    setSearchTerm('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="enter an action..."
        value={searchTerm}
        onChange={handleInputChange}
        className=''
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Profile;
