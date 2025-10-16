<template>
    <div class="music-player">
      <div class="playerButtons">
        <button title="Previous Song">
          <i class="mdi mdi-skip-previous"></i>
        </button>
        <button class="play" title="Play/Pause Song">
          <transition name="slide-fade" mode="out-in">
            <i class="mdi mdi-pause"></i>
          </transition>
        </button>
        <button title="Next Song">
          <i class="zmdi zmdi-skip-next"></i>
        </button>
      </div>
  
      <div class="currentProgressBar">
        <div class="currentProgress" :style="{ width: 50 + '%' }"></div>
        <div class="currentTimeContainer">
          <span class="currentTime"> 5:00 </span>
          /
          <span class="totalTime"> 10:00 </span>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .music-player {
    text-align: center;
    max-width: 300px;
    margin: auto;
    color: white;
    background: #222;
    padding: 20px;
    border-radius: 10px;
  }
  .playerButtons button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    margin: 5px;
    color: white;
  }
  .currentTimeContainer {
    color: white;
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 12px;
    top: -20px;
  }
  .currentProgressBar {
    width: 100%;
    height: 5px;
    background: #444;
    position: relative;
    cursor: pointer;
    border-radius: 3px;
    margin-top: 20px;
  }
  .currentProgress {
    height: 5px;
    background: #1db954;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 3px;
  }
  </style>
  