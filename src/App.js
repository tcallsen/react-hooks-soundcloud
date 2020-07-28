import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

import loadscript from 'load-script'

function App() {
  
  // define state

  // used to communicate between SC widget and React
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlistIndex, setPlaylistIndex] = useState(0)
  
  // populated once SoundCloud Widget API is loaded and initialized
  const [scLibary, setScLibary] = useState(false)
  const [player, setPlayer] = useState(false)

 
  // initialization - load soundcloud widget API and set event listeners

  useEffect(() => {

    console.log('initial load')

    // use load-script module to load SC Widget API
    loadscript('https://w.soundcloud.com/player/api.js', () => {

      console.log('script loaded - ', window.SC)

    })

  }, []);

  return (
    <div className="App">
      <div className="App-container">
      
        <h1>SoundCloud Integration with React</h1>
        
        <p className="limited">The SoundCloud Widget and React Section will be kept in sync using React Hooks.</p>
        
        <div className="soundcloud-section">

          <h3>SoundCloud Widget</h3>

          <img src={logo} className="App-logo" alt="logo" />

        </div>
      
        <div className="react-section">

          <h3>React Section</h3>

          <p>isPlaying: {isPlaying ? 'true' : 'false'}</p>
          <p>Playlist Index: {playlistIndex}</p>

          <p>Control via React:</p>
          <button>{'<'}</button>
          <button>{ isPlaying ? 'Pause' : 'Play' }</button>
          <button>{'>'}</button>

        </div>

      </div>
    </div>
  );
}

export default App;
