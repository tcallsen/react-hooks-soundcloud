import React, { useState, useEffect, createRef } from 'react'
import './App.css';

import loadscript from 'load-script'

// SoundCloud widget API
//  https://developers.soundcloud.com/docs/api/html5-widget

function App() {
  
  // state

  // used to communicate between SC widget and React
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlistIndex, setPlaylistIndex] = useState(0)
  
  // populated once SoundCloud Widget API is loaded and initialized
  const [player, setPlayer] = useState(false)

  const iframeRef = createRef();
 
  // initialization - load soundcloud widget API and set SC event listeners

  useEffect(() => {

    // use load-script module to load SC Widget API
    loadscript('https://w.soundcloud.com/player/api.js', () => {
      
      // initialize player and store reference in state

      // retrieve iframe element via React Ref - https://reactjs.org/docs/refs-and-the-dom.html
      const player = window.SC.Widget(iframeRef.current)
      setPlayer( player )
      
      // NOTE: closures created - cannot access react state or props from within and SC callback functions!!
      
      const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = window.SC.Widget.Events

      player.bind( PLAY, () => {

        // update state to playing
        setIsPlaying(true)

        // check to see if song has changed - if so update state with next index
        player.getCurrentSoundIndex( (playerPlaylistIndex) => {            
          if (playerPlaylistIndex !== playlistIndex) setPlaylistIndex(playerPlaylistIndex)
        })
    
      })

      player.bind( PAUSE, () => {
        // update state if player has paused - must double check isPaused since false positives
        player.isPaused( (playerIsPaused) => {
          if (playerIsPaused) setIsPlaying(false)
        })
      })

    })

  }, [])


  // integration - update SC player based on new state (e.g. play button in react section was click)

  // adjust playback in SC player to match isPlaying state
  useEffect(() => {
    
    if (!player) return // player loaded async - make sure available

    player.isPaused( (playerIsPaused) => {
      if (isPlaying && playerIsPaused) {
        player.play()
      } else if (!isPlaying && !playerIsPaused) {
        player.pause()
      }
    })
    
  },[isPlaying])

  // adjust seleted song in SC player playlist if playlistIndex state has changed
  useEffect(() => {
    
    if (!player) return // player loaded async - make sure available

    player.getCurrentSoundIndex( (playerPlaylistIndex) => {            
      if (playerPlaylistIndex !== playlistIndex) player.skip(playlistIndex)
    })
    
  },[playlistIndex])


  // react section button click event handlers (play/next/previous)
  //  - adjust react component state based on click events

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const changePlaylistIndex = (skipForward = true) => {

    // get list of songs from SC widget
    player.getSounds( (playerSongList) => {      

      let nextIndex = (skipForward) ? playlistIndex + 1 : playlistIndex - 1

      // ensure index is not set to less than 0 or greater than playlist
      if (nextIndex < 0) nextIndex = 0
      else if (nextIndex >= playerSongList.length) nextIndex = playerSongList.length - 1

      setPlaylistIndex(nextIndex)

    })

  }

  return (
    <div className="App">
      <div className="App-container">
      
        <h1>SoundCloud Integration with React</h1>
        
        <p className="limited">The SoundCloud Widget and React Section are kept in sync using React Hooks.</p>
        
        <div className="soundcloud-section">

          <h3>SoundCloud Widget</h3>

          <iframe ref={iframeRef} id="sound-cloud-player" style={{border: 'none', height: 314, width: 400}} scrolling="no" allow="autoplay" 
            src={ "https://w.soundcloud.com/player/?url=https://soundcloud.com/aboveandbeyond/sets/we-are-all-we-need-1" }>
          </iframe>

        </div>
      
        <div className="react-section">

          <h3>React Section</h3>

          <p>isPlaying: { (isPlaying) ? 'true' : 'false'}</p>
          <p>Playlist Index: {playlistIndex}</p>

          <p>Control via React:</p>
          <button onClick={ () => changePlaylistIndex(false) }>{'<'}</button>
          <button onClick={ togglePlayback }>{ (isPlaying) ? 'Pause' : 'Play' }</button>
          <button onClick={ () => changePlaylistIndex(true) }>{'>'}</button>

        </div>

      </div>
    </div>
  );
}

export default App;
