import { App } from './app';
import 'babylonjs-materials';
import 'babylonjs-loaders';
import CANNON = require('cannon');

window.addEventListener('DOMContentLoaded', () => {
  // Set global variable for cannonjs physics engine
  window.CANNON = CANNON;
  let game = new App('renderCanvas');
  game.createScene();
  game.animate();
});
