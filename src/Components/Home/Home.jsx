import React from 'react';
import BoutonLink from '../BoutonLink/BoutonLink';
import { NavLink } from 'react-router-dom';
import './Home.scss';

function Home() {
  return (
    <div className='Home'>
      <BoutonLink link='/entrainement' content='Entrainement' />
      <BoutonLink link='/competition' content='Compétition' />

      <NavLink to='/settings/proposition' className='link-proposition fadeIn'>
        Proposer une Question
      </NavLink>
    </div>
  );
}

export default Home;
