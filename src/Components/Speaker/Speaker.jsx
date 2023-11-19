import React from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './Speaker.scss';

function Speaker(props) {
  return (
    <div className='Speaker' onClick={props.toggleMute}>
      {props.mute ? <FaVolumeMute /> : <FaVolumeUp />}
    </div>
  );
}

export default Speaker;
