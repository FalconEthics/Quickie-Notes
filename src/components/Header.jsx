import React from "react";
import { CgNotes } from 'react-icons/cg';

function Header() {
  return (
    <header>
      <h1 className="flex text-2xl">
        <CgNotes className="mr-2"/> Keeper-App
      </h1>
    </header>
  );
}

export default Header;
