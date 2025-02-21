window.addEventListener("DOMContentLoaded", function () {
    // Creazione della scena Babylon.js
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        // Variabile per controllare la distanza iniziale
        const initialDistance = 10; // Modifica questo valore per regolare la distanza

        // Creazione della camera ArcRotateCamera
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            Math.PI / 2, // Angolo iniziale in orizzontale
            Math.PI / 4, // Angolo iniziale in verticale
            initialDistance, // Distanza iniziale dalla mesh
            BABYLON.Vector3.Zero(), // Punto di destinazione della camera
            scene
        );

        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 3; // Distanza minima consentita
        camera.upperRadiusLimit = 20; // Distanza massima consentita

        // Creazione della luce
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
        light.intensity = 0.7;

        // Caricamento del modello 3D
        BABYLON.SceneLoader.ImportMesh("", "3DModels/", "ufo.glb", scene, function (meshes) {
            let modello = meshes[0]; 
            modello.position = BABYLON.Vector3.Zero(); // Mantiene il modello centrato
            camera.target = modello; // La camera punta direttamente alla mesh
        });

        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Adatta la scena alla finestra
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
