import { BsEnvelopeAtFill } from 'react-icons/bs';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaGift } from 'react-icons/fa6';
import { IoLogoYoutube } from 'react-icons/io';
import './Apropos.scss';

function Apropos() {
  return (
    <div className='Apropos'>
      <h1>À propos</h1>
      <fieldset>
        <p>QuizzIslam est une application pour apprendre l'Islam de manière ludique.</p>

        <p>
          <b>Abdelhakim Richi</b>{' '}
          <a href='https://twitter.com/ImamRichi' target='_blank' rel='noreferrer'>
            <BsTwitterX />
          </a>{' '}
          <a
            href='https://www.facebook.com/abdelhakim.richi/'
            target='_blank'
            rel='noreferrer'>
            <FaFacebook />
          </a>{' '}
          <a
            href='https://www.instagram.com/tv/CYNgjxjI2gi/'
            target='_blank'
            rel='noreferrer'>
            <FaInstagram />
          </a>
          , ancien imam de la mosquée de Savigny Le temple{' '}
          <a href='https://acmslt.fr/' target='_blank' rel='noreferrer'>
            <FaExternalLinkAlt />
          </a>{' '}
          est à l'initiative de ce projet.
        </p>

        <p>
          Si vous avez aimé cette application, vous pouvez faire un don pour la
          construction d'un {' '}
          <a
            href='https://masjidbox.com/donations/mosquee-de-savigny-le-temple/faites-un-don-pour-votre-mosquee'
            target='_blank'
            rel='noreferrer'>
            collège musulman <FaGift />
          </a>
        </p>

        <p>
          Développé par{' '}
          <a href='mailto:nadfri@gmail.com'>
            NadfriJS <BsEnvelopeAtFill className='icon' />
          </a>{' '}
          <a
            href='https://www.linkedin.com/in/nader-frigui-23509025/'
            target='_blank'
            rel='noreferrer'>
            <FaLinkedin />
          </a>{' '}
          <a href='https://github.com/nadfri' target='_blank' rel='noreferrer'>
            <FaGithub />
          </a>{' '}
          <a href='https://www.youtube.com/c/nadfrijs' target='_blank' rel='noreferrer'>
            <IoLogoYoutube />
          </a>
        </p>

        <p>Version 1.2.0</p>

        <p>2021-2025</p>
      </fieldset>
    </div>
  );
}

export default Apropos;
