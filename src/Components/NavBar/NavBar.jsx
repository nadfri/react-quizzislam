import './NavBar.scss';
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { MdMosque } from 'react-icons/md';
import { FaGamepad } from 'react-icons/fa';
import { FaTrophy } from 'react-icons/fa';
import { FaRankingStar } from 'react-icons/fa6';
import { FaTools } from 'react-icons/fa';

function NavBar() {
  const refNav = useRef(null);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const isScrollingDown = window.scrollY > scrollPosRef.current;
      const shouldHideNav = isScrollingDown && window.scrollY > 10;

      refNav.current.classList.toggle('hidden', shouldHideNav);
      scrollPosRef.current = window.scrollY;
    };

    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='NavBar' ref={refNav}>
      <NavLink exact to='/'>
        <MdMosque className='icon' />
      </NavLink>

      <NavLink to='/entrainement'>
        <FaGamepad className='icon' />
      </NavLink>

      <NavLink to='/competition'>
        <FaTrophy className='icon' />
      </NavLink>

      <NavLink exact to='/classement'>
        <FaRankingStar className='icon' />
      </NavLink>

      <NavLink to='/settings'>
        <FaTools className='icon' />
      </NavLink>
    </div>
  );
}

export default NavBar;
