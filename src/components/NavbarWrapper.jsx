import React, { useState } from 'react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

const NavbarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <MobileMenu isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
    </>
  );
};

export default NavbarWrapper;
