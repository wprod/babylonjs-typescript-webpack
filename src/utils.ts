import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import {Observable} from 'rxjs';

export class Utils {

    /**
     * Creates a basic ground
     */
    public static createGround(scene: BABYLON.Scene): BABYLON.Mesh {

        //groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;
        let ground = BABYLON.Mesh.CreateGroundFromHeightMap(
            "ground",
            "assets/texture/height-map/D2.png",
            2000,
            2000,
            20,
            0,
            100,
            scene,
            false,
            () => {
                let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
                groundMaterial.diffuseTexture = new BABYLON.Texture("assets/texture/height-map/C2W.png", scene);
                ground.material = groundMaterial;
            });
        ground.position.y = -1;

        return ground;
    }

    /**
     * Creates a second ground and adds a watermaterial to it
     */
    public static createWater(scene: BABYLON.Scene): BABYLON.WaterMaterial {
        // Water
        let waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, scene, false);
        let waterMaterial = Utils.createWaterMaterial("water", "./assets/texture/waterbump.png", scene);
        waterMesh.material = waterMaterial;
        waterMesh.position.y = 4;

        return waterMaterial;
    }

    /**
     * Creates a BABYLONJS GUI with a single Button
     */
    public static createGui(btnText: string, btnClicked: (button: GUI.Button) => void) {

        let guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let btnTest = GUI.Button.CreateSimpleButton("but1", btnText);
        btnTest.width = "150px";
        btnTest.height = "40px";
        btnTest.color = "white";
        btnTest.background = "grey";
        btnTest.onPointerUpObservable.add(() => {
            if (btnClicked) {
                btnClicked(btnTest);
            }
        });
        btnTest.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        btnTest.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        btnTest.left = 12;
        btnTest.top = 12;

        guiTexture.addControl(btnTest);
    }

    /**
     * Returns Observable of mesh array, which are loaded from a file.
     * After mesh importing all meshes become given scaling, position and rotation.
     */
    public static createMeshFromObjFile(folderName: string, fileName: string, scene: BABYLON.Scene,
                                        scaling?: BABYLON.Vector3, position?: BABYLON.Vector3, rotationQuaternion?: BABYLON.Quaternion): Observable<BABYLON.AbstractMesh[]> {

        if (!fileName) {
            return Observable.throw("Utils.createMeshFromObjFile: parameter fileName is empty");
        }
        if (!scene) {
            return Observable.throw("Utils.createMeshFromObjFile: parameter fileName is empty");
        }

        if (!folderName) folderName = "";
        if (!scaling) scaling = BABYLON.Vector3.One();
        if (!position) position = BABYLON.Vector3.Zero();
        if (!rotationQuaternion) rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);

        let assetsFolder = './assets/' + folderName;

        return new Observable(observer => {
            BABYLON.SceneLoader.ImportMesh(null, assetsFolder, fileName, scene,
                (meshes: BABYLON.AbstractMesh[],
                 particleSystems: BABYLON.ParticleSystem[],
                 skeletons: BABYLON.Skeleton[]) => {
                    meshes.forEach((mesh) => {
                        mesh.position = position;
                        mesh.rotationQuaternion = rotationQuaternion;
                        mesh.scaling = scaling;
                    });
                    console.log("Imported Mesh: " + fileName);
                    observer.next(meshes);
                });
        });
    }

    /**
     * Creates a new skybox with the picttures under fileName.
     */
    public static createSkybox(name: string, fileName: string, scene: BABYLON.Scene): BABYLON.Mesh {
        if (!name) {
            console.error("Utils.createSkyBox: name is not defined");
            return;
        }
        if (!fileName) {
            console.error("Utils.createSkyBox: fileName is not defined");
            return;
        }
        if (!scene) {
            console.error("Utils.createSkyBox: scene is not defined");
            return;
        }

        // Skybox
        let skybox = BABYLON.Mesh.CreateBox(name, 1000.0, scene);
        let skyboxMaterial = new BABYLON.StandardMaterial(name, scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/texture/skybox/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    /**
     * Creates a new WaterMaterial Object with a given name. The noiseFile descrips the noise in the water,
     */
    public static createWaterMaterial(name: string, noiseFile: string, scene: BABYLON.Scene): BABYLON.WaterMaterial {
        if (!name) {
            console.error("Utils.createWaterMaterial: name is not defined");
            return;
        }
        if (!noiseFile) {
            console.error("Utils.createWaterMaterial: noiseFile is not defined");
            return;
        }
        if (!scene) {
            console.error("Utils.createWaterMaterial: scene is not defined");
            return;
        }
        // Water material
        let water = new BABYLON.WaterMaterial(name, scene);
        water.bumpTexture = new BABYLON.Texture(noiseFile, scene);
        // Water properties
        water.windForce = -15;
        water.waveHeight = 1;
        water.windDirection = new BABYLON.Vector2(1, 1);
        water.waterColor = new BABYLON.Color3(0.25, 0.88, 0.82);
        water.colorBlendFactor = 0.3;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;

        return water;
    }

    /**
     * Loads a shark model from .obj file and adds it scene.
     */
    public static createShark(scene: BABYLON.Scene): Observable<BABYLON.AbstractMesh> {
        // create a mesh object with loaded from file
        let rootMesh = BABYLON.MeshBuilder.CreateBox("rootMesh", {size: 1}, scene);
        rootMesh.isVisible = false;
        rootMesh.position.y = 0.4;
        rootMesh.rotation.y = -3 * Math.PI / 4;

        return new Observable(observer => {
            Utils.createMeshFromObjFile("mesh/", "mesh.obj", scene, new BABYLON.Vector3(1, 1, 1))
                .subscribe(meshes => {
                    meshes.forEach((mesh) => {
                        mesh.parent = rootMesh;
                    });

                    observer.next(rootMesh);
                });
        });
    }

}
