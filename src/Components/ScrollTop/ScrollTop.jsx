import React, { useEffect } from 'react';
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
      <i
        className='fas fa-arrow-circle-up'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}></i>
      <i
        className='fas fa-arrow-circle-down'
        onClick={() =>
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }></i>
    </div>
  );
}

export default ScrollTop;
