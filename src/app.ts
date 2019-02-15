import * as BABYLON from 'babylonjs';
import { Utils } from './utils';

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;

    private pointerLocked: boolean;

    constructor(canvasElement: string) {
        // Create canvas and engine
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    /**
     * Creates the BABYLONJS Scene
     */
    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new BABYLON.Scene(this._engine);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        // create the skybox
        Utils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this._scene);
        // creates the sandy ground
        Utils.createGround(this._scene);

        // Physics engine also works
        const gravity = new BABYLON.Vector3(0, -0.9, 0);
        this._scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
    }

    modifySettings() {
        this._scene.onPointerDown = () => {
            if (!this.pointerLocked) {
                this._canvas.requestPointerLock();
            }
        };

        document.addEventListener('pointerlockchange', () => {
            const element = document.pointerLockElement || null;
            this.pointerLocked = !!element;
        })
    }

    /**
     * Creates the BABYLONJS Camera
     */
    createCamera() {
        this._camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 1), this._scene);
        this._camera.attachControl(this._canvas, true);
        this._camera.checkCollisions = true;
        // this._camera.applyGravity = true;

        this._camera.keysUp.push('z'.charCodeAt(0));
        this._camera.keysUp.push('Z'.charCodeAt(0));

        this._camera.keysDown.push('s'.charCodeAt(0));
        this._camera.keysDown.push('S'.charCodeAt(0));

        this._camera.keysLeft.push('q'.charCodeAt(0));
        this._camera.keysLeft.push('Q'.charCodeAt(0));

        this._camera.keysRight.push('d'.charCodeAt(0));
        this._camera.keysRight.push('D'.charCodeAt(0));
    }

    /**
     * Starts the animation loop.
     */
    animate(): void {
        // run the render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}
