import React, { useEffect, useRef } from 'react';
import './NavBar.scss';
import { NavLink } from 'react-router-dom';

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
        <i className='fas fa-dice-d6'></i>
      </NavLink>
      <NavLink to='/entrainement'>
        <i className='fas fa-gamepad'></i>
      </NavLink>
      <NavLink to='/competition'>
        <i className='fas fa-trophy'></i>
      </NavLink>
      <NavLink exact to='/classement'>
        <i className='fas fa-medal'></i>
      </NavLink>
      <NavLink to='/settings'>
        <i className='fas fa-tools'></i>
      </NavLink>
    </div>
  );
}

export default NavBar;
