//import spaceship from "../3DModels/Spaceship_Yellow.glb";
window.addEventListener('DOMContentLoaded', function () {
    // Ottieni il canvas HTML
    var canvas = document.getElementById('renderCanvas');

    // Crea l'engine Babylon.js
    var engine = new BABYLON.Engine(canvas, true);

    
    // Funzione per creare la scena
    var createScene = function () {
        // Crea una nuova scena
        var scene = new BABYLON.Scene(engine);
        
        const forest = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/forest.env", scene);
        const shootSound = new Audio("assets/shoot.mpeg");
        forest.level = 2;

        // Aggiungi una telecamera alla scena (First Person Controller)
        //var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -10), scene);
        // Aggiungi una arc rotate camera
        const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 6, -24), scene);
        camera.attachControl(canvas, true);

        // bottone che ruota l'astronave
        const rotateButton = document.createElement("button");
        rotateButton.id = "rotateButton";
        rotateButton.innerText = "Attiva Rotazione";
        rotateButton.style.position = "fixed";
        rotateButton.style.bottom = "20px";
        rotateButton.style.left = "20px";
        rotateButton.style.padding = "10px 20px";
        rotateButton.style.backgroundColor = "#007bff";
        rotateButton.style.color = "white";
        rotateButton.style.border = "none";
        rotateButton.style.borderRadius = "5px";
        rotateButton.style.cursor = "pointer";
        rotateButton.style.fontSize = "16px";
        // Aggiungi il bottone al corpo del documento
        document.body.appendChild(rotateButton);

        // bottone che attiva/disattiva il particle
        const particleButton = document.createElement("button");
        particleButton.id = "particleButton";
        particleButton.innerText = "Attiva Particle";
        particleButton.style.position = "fixed";
        particleButton.style.bottom = "80px";
        particleButton.style.left = "20px";
        particleButton.style.padding = "10px 20px";
        particleButton.style.backgroundColor = "#009cff";
        particleButton.style.color = "white";
        particleButton.style.border = "none";
        particleButton.style.borderRadius = "5px";
        particleButton.style.cursor = "pointer";
        particleButton.style.fontSize = "16px";
        // Aggiungi il bottone al corpo del documento
        document.body.appendChild(particleButton);

        // Crea una variabile per attivare/disattivare la rotazione
        let rotateModel = false;
        // Funzione per caricare il modello
        let modello;
        let transformNode; // Nodo di trasformazione per gestire la rotazione
        // const environment = scene.createDefaultEnvironment({
        //     environmentTexture: forest,
        //     skyboxTexture: forest
        //   });

        //   if (environment.skybox) {
        //     environment.skybox.scaling = new BABYLON.Vector3(100, 100, 100); // Cambia la dimensione
        //   }  

        // Imposta i controlli della telecamera per il movimento
        //camera.keysUp.push(87); // W
        //camera.keysDown.push(83); // S
        //camera.keysLeft.push(65); // A
        //camera.keysRight.push(68); // D

        // Aggiungi una luce alla scena
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        // Crea il pavimento
        //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);

        // Aggiungi una sfera alla scena
        //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        //sphere.position.y = 1; // Solleva la sfera sopra il pavimento

        // Crea un particle system di un campo magnetico
        let particleCheck = false; // Parte disattivato
        let particles = []; // Array per memorizzare i particle system

    // Crea un vettore di posizione per i particle system
    var particlePosition = new BABYLON.Vector3(0, 6, 4 );

    function createParticles() {
        if (particles.length > 0) return; // Evita di creare più volte i sistemi di particelle
    
        
    
        // 1st Particle System - Circles
        BABYLON.ParticleHelper.CreateFromSnippetAsync("2JRD1A#2", scene, false).then(system => {
            system.emitter = particlePosition;
            particles.push(system);
        });
    
        // 2nd Particle System - Core
        BABYLON.ParticleHelper.CreateFromSnippetAsync("EXUQ7M#5", scene, false).then(system => {
            system.emitter = particlePosition;
            particles.push(system);
        });
    
        // 3rd Particle System - Sparks
        let sphereSpark = BABYLON.MeshBuilder.CreateSphere("sphereSpark", { diameter: 0.4, segments: 32 }, scene);
        sphereSpark.position = particlePosition;
        sphereSpark.isVisible = false;
    
        BABYLON.ParticleHelper.CreateFromSnippetAsync("UY098C#3", scene, false).then(system => {
            system.emitter = sphereSpark;
            particles.push(system);
        });
    
        // 4th Particle System - Smoke
        let sphereSmoke = BABYLON.MeshBuilder.CreateSphere("sphereSmoke", { diameter: 1.4, segments: 32 }, scene);
        sphereSmoke.position = particlePosition;
        sphereSmoke.isVisible = false;
    
        BABYLON.ParticleHelper.CreateFromSnippetAsync("UY098C#6", scene, false).then(system => {
            system.emitter = sphereSmoke;
            particles.push(system);
        });
    }

    // Funzione per rimuovere i particle system
    function removeParticles() {
        particles.forEach(system => {
            system.dispose(); // Elimina il sistema di particelle
        });
        particles = []; // Svuota l'array
    }

        // *** Caricamento del modello 3D ***
        // BABYLON.SceneLoader.ImportMesh("", "3DModels/", "Spaceship_Yellow.glb", scene, function (meshes) {
        //     let modello = meshes[0]; // Primo elemento della mesh
        //     modello.position = new BABYLON.Vector3(0, 0, 0); // Posizionato sopra il terreno
        //     modello.scaling = new BABYLON.Vector3(1, 1, 1); // Regola la scala se necessario
            
        //    camera.setTarget(modello.meshes[0]);

        BABYLON.SceneLoader.ImportMesh("", "3DModels/", "Spaceship_Yellow.glb", scene, function (meshes) {

            if (meshes.length > 0) {
                modello = meshes[0]; // Aggiungi la prima mesh come modello principale
                modello.position = BABYLON.Vector3.Zero(); // Posiziona il modello nella scena
                console.log("Modello caricato con successo.");
            } else {
                console.error("Errore nel caricamento del modello.");
            }
            // Assicurati che ci siano mesh nel modello
            if (meshes && meshes.length > 0) {
                // Estrai i materiali da tutte le mesh
                let materials = [];
                // Crea un nodo di trasformazione genitore per il modello
                transformNode = new BABYLON.TransformNode("modelTransformNode", scene);
                meshes.forEach(mesh => {
                    // Imposta il nodo di trasformazione come genitore delle mesh
                    mesh.parent = transformNode;
                    // Aggiungi il materiale di ciascuna mesh (se non è già stato aggiunto)
                    if (mesh.material && !materials.includes(mesh.material)) {
                        materials.push(mesh.material);
                    }
                });
        
                // Modifica il livello della texture emissiva per ciascun materiale
                materials.forEach(material => {
                    // Assicurati che il materiale abbia una texture emissiva
                    if (material.emissiveTexture) {
                        // Aggiungi il controllo per evitare errori in caso di texture non definita
                        material.emissiveTexture.level = 2; // Modifica il livello della texture emissiva (ad esempio, a 0.5)
                        console.log("Emissive texture level changed to 2 for material: ", material);
                    }
                });
            } else {
                console.error("Le mesh non sono state caricate correttamente.");
            }

            // Imposta la telecamera per puntare al modello
            camera.setTarget(transformNode.position);
            
            //cambia texture dal modello
            // modello.PBRMaterial.emissiveTexture.level = 2;

            //cambia i level delle texture
            // const metalMaterial = scene.getMaterialByID(16);
            // metalMaterial.emissiveTexture.level = 2;
            // metalMaterial.albedoTexture.level = 0;
            // metalMaterial.emissiveTexture.name = "metalEmissiveTexture";
            // const metalEmissiveTexture = scene.getTextureByName("metalEmissiveTexture");
            // metalEmissiveTexture.level = 2;
            
            //ruota la mesh
            // scene.onBeforeRenderObservable.add(() => {
            //    modello.meshes[0].rotate(new Vector3(0, 1, 0), 0.001);
            //  });

            // scene.registerBeforeRender(function () {
            //     // Ruota la mesh lungo l'asse Y
            //     modello.rotation.y += 0.09;  // Incrementa l'angolo di rotazione in ogni frame
            // });  
        });

        /*BABYLON.SceneLoader.Append("3DModels/", "Spaceship.babylon", scene, function() {
            console.log("Modello caricato con successo!");
        }, null, function (scene, message, exception) {
            console.error("Errore nel caricamento:", message, exception);
        });*/
        
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // RGBA: nero opaco

        // Funzione per attivare/disattivare la rotazione al clic del bottone
        rotateButton.addEventListener("click", function() {
        rotateModel = !rotateModel;  // Cambia lo stato di rotazione (attiva/disattiva)
        this.innerText = rotateModel ? "Ferma Rotazione" : "Attiva Rotazione";  // Cambia il testo del bottone
        });

        // Funzione per attivare/disattivare il particle
        particleButton.addEventListener("click", function () {
            particleCheck = !particleCheck; // Inverti il valore della variabile
            if (particleCheck) {
                createParticles();
                this.innerText = "Ferma Particle";
            } else {
                removeParticles();
                this.innerText = "Attiva Particle";
            }
        });

        // Funzione per gestire la pressione della Spacebar
        document.addEventListener("keydown", function (event) {
            if (event.code === "Space") {
                shootSound.currentTime = 0; // Resetta l'audio per riprodurlo più volte di seguito
                shootSound.play().catch(error => console.error("Errore nella riproduzione dell'audio:", error));
             }
        });

        // Funzione per la rotazione continua del nodo
        scene.onBeforeRenderObservable.add(() => {
        if (rotateModel && transformNode) {
            // Ruota il nodo del modello lungo l'asse Y
            transformNode.rotation.y -= 0.01;  // Incremento della rotazione sull'asse Y
        }
        });

        //attiva il glow nella scena
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 2;

        return scene;
    };
    
    // Crea la scena
    var scene = createScene();

    // Crea un bottone per il scene explorer
    const explorerButton = document.createElement("button");
    explorerButton.id = "explorerButton";
    explorerButton.innerText = "Apri Explorer";
    explorerButton.style.position = "fixed";
    explorerButton.style.bottom = "20px"; 
    explorerButton.style.right = "20px";
    explorerButton.style.padding = "10px 20px";
    explorerButton.style.backgroundColor = "#dc3545"; // Rosso
    explorerButton.style.color = "white";
    explorerButton.style.border = "none";
    explorerButton.style.borderRadius = "5px";
    explorerButton.style.cursor = "pointer";
    explorerButton.style.fontSize = "16px";
    // Aggiungi evento per aprire il Scene Explorer
    explorerButton.onclick = () => scene.debugLayer.show();
    // Aggiungi il bottone al corpo del documento
    document.body.appendChild(explorerButton);

    // Crea il testo dei comandi
    const infoText = document.createElement("div");
    infoText.innerHTML = 'Premi "Spacebar" per sparare <br> Premi "Shift" per accendere i motori';
    infoText.style.position = "fixed";
    infoText.style.top = "10px";
    infoText.style.right = "20px";
    infoText.style.color = "white";
    infoText.style.fontStyle = "italic";
    infoText.style.fontSize = "16px";
    infoText.style.textAlign = "right";
    // Aggiungi il testo al corpo del documento
    document.body.appendChild(infoText);

    
    // Avvia il rendering della scena
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Ridimensiona il canvas quando la finestra viene ridimensionata
    window.addEventListener('resize', function () {
        engine.resize();
    });
});