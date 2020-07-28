import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

import loadscript from 'load-script'

function App() {
  
  // state

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
      
      // initialize player and store reference in state

      // TODO: replace this with React ref
      const playerIframe = document.getElementById('sound-cloud-player')
      const player = window.SC.Widget(playerIframe)
      setPlayer( player )
      

      // event handlers for SoundCloud events
      //  following logic here: https://github.com/CookPete/react-player/blob/master/src/players/SoundCloud.js
      
      // NOTE: closure created - cannot access react state or props from within callback function!!
      
      const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = window.SC.Widget.Events

      player.bind( PLAY, () => {

        // update backend with play event
        setIsPlaying(true)

        // check to see if song has changed - if so update state
        player.getCurrentSoundIndex( (playerPlaylistIndex) => {            
            setPlaylistIndex(playerPlaylistIndex)
        })
    
      })

      player.bind( PAUSE, () => {
        // update state if player has paused - event fires false positives so need to double check player is paused
        player.isPaused( (playerIsPaused) => {
          if (playerIsPaused) setIsPlaying(false)
        })
      })

    })

  }, [])


  // integration - update player based on new props/data from backend

  useEffect(() => {
    
    // TODO: better way to do this?
    if (!player) return

    // check if playing state changed
    player.isPaused( (playerIsPaused) => {
        
      if (isPlaying && playerIsPaused) {
        player.play()
      } else if (!isPlaying && !playerIsPaused) {
        player.pause()
      }
      
    })
    
  },[isPlaying])

  return (
    <div className="App">
      <div className="App-container">
      
        <h1>SoundCloud Integration with React</h1>
        
        <p className="limited">The SoundCloud Widget and React Section will be kept in sync using React Hooks.</p>
        
        <div className="soundcloud-section">

          <h3>SoundCloud Widget</h3>

          <iframe id="sound-cloud-player" style={{border: 'none', height: 314, width: 400}} scrolling="no" allow="autoplay" 
            src={ "https://w.soundcloud.com/player/?url=https://soundcloud.com/anjunadeep/sets/cubicolor-hardly-a-day-hardly" }>
          </iframe>

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
