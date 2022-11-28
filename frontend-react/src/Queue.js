import React from 'react';
import Track from './Track';
import './Queue.css';

export default function Queue({ tracks }) {
  return (
    <div className='queue'>
      {tracks.map(track => {
        return <div className='queueElement'>
            <Track key={track.index} track={track} />
          </div>
      })}
    </div>
  )
}
