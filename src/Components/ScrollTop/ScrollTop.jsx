import React, { useEffect } from 'react';
import { FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa';
import './ScrollTop.scss';

function ScrollTop() {
  useEffect(() => {
    document.body.style.overflowY = 'scroll';

    return () => {
      document.body.style.overflowY = 'initial';
    };
  }, []);

  return (
    <div className='ScrollTop'>
      <FaArrowCircleUp
        className='icon'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <FaArrowCircleDown
        className='icon'
        onClick={() =>
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }
      />
    </div>
  );
}

export default ScrollTop;
