"use client"

import React, { useState } from 'react';
import { Switch } from './ui/switch';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const ToggleViewer = () => {
  const [toggled, setToggled] = useState(false)
  
  const handleClick = () => {
    if(toggled){
        setToggled(false);
    } else {
        setToggled(true);
    }
  }

  return (
    <div>
        <Switch id="toggle viewer" onClick={handleClick}/> 
        toggle viewer
    </div>
  );
};

export default ToggleViewer;
