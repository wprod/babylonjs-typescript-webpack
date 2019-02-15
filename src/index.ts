import 'babylonjs-loaders';
import 'babylonjs-materials';
import CANNON = require('cannon');
import { App } from './app';

window.addEventListener('DOMContentLoaded', () => {
  // Set global variable for cannonjs physics engine
  window.CANNON = CANNON;
  const game = new App('renderCanvas');
  game.createScene();
  game.modifySettings();
  game.createCamera();
  game.animate();
});
