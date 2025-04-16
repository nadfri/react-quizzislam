import React from 'react';
import BoutonLink from '../BoutonLink/BoutonLink';
import { NavLink } from 'react-router-dom';
import { BiSolidBookHeart } from 'react-icons/bi';
import { FaHeartbeat } from 'react-icons/fa';
import './Home.scss';

function Home() {
  return (
    <div className='Home'>
      <BoutonLink link='/entrainement' content='Entrainement' />
      <BoutonLink link='/competition' content='Compétition' />

      <NavLink to='/settings/proposition' className='link-proposition fadeIn'>
        Proposer une Question
      </NavLink>

      {/* <a
        href='https://suivi-ramadan.netlify.app/'
        target='_blank'
        rel='noreferrer'
        className='fadeIn link-proposition white'>
        Suivre votre Ramadan 2025 <FaHeartbeat className='icon' />
      </a> */}

      <a
        href='https://masjidbox.com/donations/mosquee-de-savigny-le-temple/faites-un-don-pour-votre-mosquee'
        target='_blank'
        rel='noreferrer'
        className='fadeIn link-proposition white'>
        Participer à la construction d'un collège musulman{' '}
        <BiSolidBookHeart className='icon' />
      </a>
    </div>
  );
}

export default Home;
