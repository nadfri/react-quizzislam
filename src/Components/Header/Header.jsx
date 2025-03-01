import React from 'react';
import './Header.scss';
import ToggleBtn from './ToggleBtn/ToggleBtn';

function Header() {
  return (
    <div className='Header'>
      <h1>QuizzIslam</h1>

      <img src='images/ramadan.webp' alt='' className='ramadan-img' />

      <ToggleBtn />
    </div>
  );
}

export default Header;
