class Start extends Scene {
    create() {
        
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; 
        this.engine.show(locationData.Body); 
        this.currentKey = key
        if (key === "Closet") this.engine.state.basementUnlocked = true;
        //this.engine.show(`[DEBUG] Ghost Room: ${this.engine.state.ghostRoom} | Ghost Type: ${this.engine.state.ghostType}`);
        if(key !== "Van" && key !== "Leave") { 
            let bag = this.engine.state.inventory;
            for(let item of bag){
                if(item != "Basement")
                this.engine.addChoice(`Use ${item}`, { UseItem: item});
            }
        }   
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (choice.Text === "Basement" && !this.engine.state.basementUnlocked) {
                this.engine.addChoice(choice.Text, { NeedsKey: "Basement Key", Text: choice.Text });
            } else {
                this.engine.addChoice(choice.Text, choice);
            }
        }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice && choice.UnlockBasement === true) {
            this.engine.state.basementUnlocked = true;
            this.engine.show("You unlocked the Basement.");
            this.engine.gotoScene(Location, this.currentKey);
            return;
        }
        if (choice && choice.NeedsKey !== undefined) {
            this.engine.show(`You need the ${choice.NeedsKey} first.`);
            this.engine.gotoScene(Location, this.currentKey);
            return;
        }
        if(choice && choice.Item != undefined){
            let bag = this.engine.state.inventory;
            if(bag.includes(choice.Item)){
                bag.splice(bag.indexOf(choice.Item),1);
                this.engine.show(`Removed ${choice.Item}`);
            } else if (bag.length < 2){
                bag.push(choice.Item);
                this.engine.show(`Added ${choice.Item}.`);
            } else {
                this.engine.show("Inventory Full");
            }
            this.engine.gotoScene(Location, this.currentKey);
            return;
        }
        if (choice && choice.UseItem !== undefined) {
            const revealMap = {
                "UV Light": "Obake",
                "Thermometer": "Hantu",
                "Video Camera": "Mimic"
            };
            const ghostRoom = this.engine.state.ghostRoom;
            const ghostType = this.engine.state.ghostType;

            if (this.currentKey === ghostRoom) {
                if (revealMap[choice.UseItem] === ghostType) {
                    this.engine.show(
                        `You use ${choice.UseItem} and find that the ghost is a ${ghostType}. You win!`
                    );
                    this.engine.gotoScene(End);
                    return;
                } else {
                    this.engine.show(
                        `You use the ${choice.UseItem}, but nothing happens.`
                    );
                }
            } else {
                this.engine.show(
                    `You use the ${choice.UseItem}, but this isn't the right room.`
                );
            }

            this.engine.gotoScene(Location, this.currentKey);
            return;
        }
        if(choice) {
            this.engine.show(choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}
class RadioRoom extends Location {
    create(key) {
        super.create(key);    
        if (this.engine.state.radioOn === undefined) {
            this.engine.state.radioOn = false;
        }
        const status = this.engine.state.radioOn ? "on" : "off";
        this.engine.show(`<em>The radio is currently ${status}.</em>`);

        this.engine.addChoice(
            this.engine.state.radioOn ? "Turn radio off" : "Turn radio on",
            { ToggleRadio: true }
        );
    }

    handleChoice(choice) {
        if (choice?.ToggleRadio) {
            this.engine.state.radioOn = !this.engine.state.radioOn;

            this.engine.show("You have angered the ghost and it has killed you.");
            this.engine.gotoScene(End);
            return;
        }
        super.handleChoice(choice);
        
    }
}
class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}
registerScene("RadioRoom", RadioRoom);  
Engine.load(Start, 'myStory.json');