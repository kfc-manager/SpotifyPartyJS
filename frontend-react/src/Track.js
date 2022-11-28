import './Track.css';

function toMinutes(duration_ms) {
  var minutes = Math.floor(duration_ms/60000);
  var seconds = (duration_ms%60000) + '';

  return minutes + ':' + seconds.slice(0,2);
}

function mySlice(string) {
  if (string.length > 25) {
    return string.slice(0,24) + "...";
  }
  return string;
}

export default function Track({ track }) {
  return (
    <div className='track'>
      <div className='grid-one'>
        <img className='icon' src={track.icon} alt='test'/>
      </div>
      <div className='grid-two'>
        <label className='title'> {mySlice(track.title)} </label>
        <label className='artist'> {mySlice(track.artist)} </label>
      </div>
      <div className='grid-three'>
        <label className='duration'> {toMinutes(track.duration)} </label>
      </div>
    </div>
  )
}
