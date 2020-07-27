import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  
  const isPlaying = false
  const playlistIndex = 0
  
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
