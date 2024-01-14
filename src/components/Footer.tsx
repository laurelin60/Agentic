"use client"

import React from 'react';
import { useRouter } from "next/navigation";

export const FooterWarning = () => {
    return(
        <>
            <p className='text-gray'>
                Alfred can make mistakes. Please be patient if it messes up.
            </p>
        </>
    )
}

export const FooterLink = (props: {linkName: string, linkPath: string}) => {
    const router = useRouter();
    const { linkName, linkPath } = props;

    const handleLink = () => {
        router.push(linkPath);
    }

    return(
        <>
            <p onClick={handleLink}> {linkName} </p>
        </>
    )
}

export const Footer = () => {
  return (
    <>
      <div className="flex flex-row gap-x-10 justify-center">
        <FooterLink linkName='About' linkPath='/about'/>
        <FooterWarning />
      </div>
    </>
    
  );
};


