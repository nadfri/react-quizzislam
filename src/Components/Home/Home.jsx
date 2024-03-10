import React from 'react';
import BoutonLink from '../BoutonLink/BoutonLink';
import { NavLink } from 'react-router-dom';
import './Home.scss';
import { BiSolidBookHeart } from 'react-icons/bi';
import { FaHeartbeat } from 'react-icons/fa';

function Home() {
  return (
    <div className='Home'>
      <BoutonLink link='/entrainement' content='Entrainement' />
      <BoutonLink link='/competition' content='Compétition' />

      <NavLink to='/settings/proposition' className='link-proposition fadeIn'>
        Proposer une Question
      </NavLink>

      <a
        href='https://suivi-ramadan.netlify.app/'
        target='_blank'
        rel='noreferrer'
        className='fadeIn link-proposition white'>
        Suivre votre Ramadan 2024 <FaHeartbeat className='icon' />
      </a>

      <a
        href='https://masjidbox.com/donations/mosquee-de-savigny-le-temple/travaux-de-finition-dagrandissement-de-lecolecollege-de-la-mosquee-de-savigny-le-temple'
        target='_blank'
        rel='noreferrer'
        className='fadeIn link-proposition white'>
        Participer à la construction d'une école musulmane{' '}
        <BiSolidBookHeart className='icon' />
      </a>
    </div>
  );
}

export default Home;
