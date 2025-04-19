
    class Engine {

        static load(...args) {
            window.onload = () => new Engine(...args);
        }

        constructor(firstSceneClass, storyDataUrl) {

            this.firstSceneClass = firstSceneClass;
            this.storyDataUrl = storyDataUrl;

            this.header = document.body.appendChild(document.createElement("h1"));
            this.output = document.body.appendChild(document.createElement("div"));
            this.actionsContainer = document.body.appendChild(document.createElement("div"));
            this.state = {
                inventory: [],
                ghostRoom: null,
                ghostType: null
            };
            const rooms = ["Hallway", "Bedroom", "Bathroom", "Kitchen", "LivingRoom", "Basement"];
            const ghostTypes = ["Obake", "Hantu", "Mimic"];
            this.state.ghostRoom = rooms[Math.floor(Math.random()*rooms.length)];
            this.state.ghostType = ghostTypes[Math.floor(Math.random()*ghostTypes.length)];
            fetch(storyDataUrl).then(
                (response) => response.json()
            ).then(
                (json) => {
                    this.storyData = json;
                    this.gotoScene(firstSceneClass)
                }
            );
        }

        gotoScene(sceneClass, data) {
            const resolvedScene =
            typeof sceneClass === "string" ? Engine.sceneIndex[sceneClass] || Location: sceneClass;
            this.scene = new resolvedScene(this);
            this.scene.create(data);
        }

        addChoice(action, data) {
            let button = this.actionsContainer.appendChild(document.createElement("button"));
            button.innerText = action;
            button.onclick = () => {
                while(this.actionsContainer.firstChild) {
                    this.actionsContainer.removeChild(this.actionsContainer.firstChild)
                }
                this.scene.handleChoice(data);
            }
        }

        setTitle(title) {
            document.title = title;
            this.header.innerText = title;
        }

        show(msg) {
            let div = document.createElement("div");
            div.innerHTML = msg;
            this.output.appendChild(div);
        }
    }

    class Scene {
        constructor(engine) {
            this.engine = engine;
        }

        create() { }

        update() { }

        handleChoice(action) {
            console.warn('no choice handler on scene ', this);
        }
    }
    Engine.sceneIndex = { Location: Location }; 

    function registerScene(name, cls) {
        Engine.sceneIndex[name] = cls;
    }