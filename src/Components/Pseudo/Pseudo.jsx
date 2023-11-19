import React, { useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { TOP } from '../../utils/top';
import './Pseudo.scss';

export default function Pseudo(props) {
  const [pseudo, setPseudo] = useState(() => localStorage.getItem('pseudo') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('pseudo', pseudo.trim());
    props.startGame(pseudo.trim());
  };

  return (
    <div className='Pseudo'>
      <h1>Mode Compétition</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Choisis ton Pseudo...'
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          minLength={3}
          required
        />

        <button>
          <FaSignInAlt className='icon'/>
        </button>

      </form>
      <fieldset>
        <legend>REGLES</legend>
        <p>Répondre à un maximum de questions dans le temps imparti.</p>

        <p>
          Une bonne réponse vaut entre <span className='green'>{props.min}</span> et{' '}
          <span className='green'>{props.bonus}</span> points, selon votre rapidité.
        </p>

        <p>
          Attention! Une mauvaise réponse fait perdre{' '}
          <span className='red'>{props.malus}</span> points.
        </p>

        <p>
          Certaines questions non présentes dans le mode <i>Entrainement</i>, rapporte le{' '}
          <span className='green'>double</span> de points.
        </p>

        <p>
          Essayez d'être classé dans le <strong>TOP {TOP}</strong>.
        </p>
      </fieldset>
    </div>
  );
}
