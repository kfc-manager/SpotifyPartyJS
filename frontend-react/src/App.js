import { useEffect, useState } from 'react';
import Queue from './Queue';
import axios from 'axios';

function App() {
  const [backendData, setBackendData] = useState([]);
  useEffect(() => { //gets called twice pls fix
    axios.get('/queue/get').then(res => {
      setBackendData(res.data);
    }).catch(error => {
      console.log(error);
    });
  }, []);
  const tracks = backendData;
  return (
    <Queue tracks={tracks}/>
  );
}

export default App;
