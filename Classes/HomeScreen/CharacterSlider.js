class CharacterSlider {

    static defaultCharacter = {
        name: "Default",
        lastName: "Player",
        cost: 0,
        stats: {
            speed: 1,
            power: 1,
            accuracy: 1,
            ability: "None"
        },
        unlocked: true,
        imgsrc: "Default"
    }

    static characters = [
        {
            name: "Novak",
            lastName: "Djokovic",
            cost: 1000,
            stats: {
                speed: 1.5,
                power: 1.5,
                accuracy: 1.5,
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Rafael",
            lastName: "Nadal",
            cost: 2000,
            stats: {
                speed: 2,
                power: 2,
                accuracy: 1,
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Roger",
            lastName: "Federer",
            cost: 10000,
            stats: {
                speed: 2,
                power: 2,
                accuracy: 2,
                technique: 2,
                ability: "Slice"
            },
            unlocked: false
        }
    ];

    static opponents = [
        {
            name: "Easy",
            lastName: "",
            stats: {
                speed: 0.5,
                power: 0.5,
                accuracy: 0.5,
                technique: 0.5,
                ability: "None"
            },
            imgsrc: "Default"
        },
        {
            name: "Medium",
            lastName: "",
            stats: {
                speed: 1,
                power: 0.75,
                accuracy: 0.5,
                technique: 1,
                ability: "None"
            },
            imgsrc: "Default"
        },
        {
            name: "Hard",
            lastName: "",
            stats: {
                speed: 1.5,
                power: 1,
                accuracy: 1.5,
                technique: 1.5,
                ability: "None"
            },
            imgsrc: "Default"
        },
        {
            name: "Extreme",
            lastName: "",
            stats: {
                speed: 2,
                power: 2,
                accuracy: 2,
                technique: 2,
                ability: "None"
            },
            imgsrc: "Default"
        }
    ]

    static abilityDescriptions = {
        Slice: "1 in 5 chance of a slice with extreme backspin"
    }

    constructor(div, arr, type) {
        this.div = div;
        this.arr = arr;
        this.type = type;
        this.objs = [];

        arr.forEach(character => {
            let div = document.createElement('div');
            let obj = {
                div: div,
                character: character
            }
            if(type == 'characters' && storageObj.characters.includes(character.name)) {
                character.unlocked = true;
            }
            this.objs.push(obj);
            div.innerHTML = document.querySelector('template#characterTemplate').innerHTML;
            div.style.display = 'flex';
            div.querySelector('img').src = `Images/Characters/${character.name}${character.lastName}.png`;
            character.img = new Image();
            character.img.src = `Images/Characters/${character.name}${character.lastName}${character.imgsrc=="Default" ? "":"Headshot"}.png`;
            if(character.imgsrc == 'Default') {
                div.querySelector('img').style.height = '40%';
                div.querySelector('img').style.marginTop = '30%';
                div.style.backgroundImage = 'radial-gradient(circle at 25% top, rgb(224, 220, 180) 0%, rgb(227, 205, 93) 100%)';
            }
            div.querySelector('.name').innerHTML = `${character.name} ${character.lastName}`;
            this.div.appendChild(div);

            let costDiv = div.querySelector('.cost');
            if(character.unlocked || this.type == 'opponents') {
                costDiv.classList.add('inactive');
            } else {
                costDiv.querySelector('span').innerHTML = character.cost;
            }


            Object.keys(character.stats).forEach(key => {
                if(key != 'ability') {
                    let stat = character.stats[key];
                    let bar = document.createElement('statBar');
                    bar.innerHTML = '<div></div>';
                    bar.querySelector('div').style.width = `${stat*50}%`;
                    div.querySelector(`.stats > .${key}`).appendChild(bar);
                } else if(character.stats[key] != 'None') {
                    div.querySelector('.stats > .ability > h5').innerHTML = character.stats[key];
                    div.querySelector('.stats > .ability > span').innerHTML = CharacterSlider.abilityDescriptions[character.stats[key]];
                }
            });

            div.addEventListener('mouseenter', () => {
                if(character.unlocked || this.type == 'opponents') {
                    div.querySelector('.stats').classList.remove('inactive');
                    div.querySelector('.stats').fadeIn(100, 'flex');
                }
            });
            div.addEventListener('mouseleave', () => {
                div.querySelector('.stats').fadeOut(100, false);
            });
            div.addEventListener('click', () => {
                if(character.unlocked || this.type == 'opponents') {
                    div.classList.toggle('selected');
                    if(div.classList.contains('selected')) {
                        this.selected = character;
                        storageObj[this.type == 'characters' ? 'character' : 'opponent'] = character.name;
                        localStorage.grandSlamKings = JSON.stringify(storageObj);
                        this.objs.forEach(object => {
                            if(object != obj) {
                                object.div.classList.remove('selected');
                            }
                        });
                    }
                    HomeScreen.updateRewards(Match.setsToWin);
                } else {
                    if(character.cost <= storageObj.coins) {
                        character.unlocked = true;
                        storageObj.characters.push(character.name);
                        StorageManager.incrementCoins(-character.cost);
                        div.querySelector('.cost').fadeOut(100, true);
                    }
                }
            });
            if(this.type == 'characters') {
                if(character.name == storageObj.character) {
                    div.classList.add('selected');
                    this.selected = character;
                }
            } else if(this.type == 'opponents') {
                if(character.name == storageObj.opponent) {
                    div.classList.add('selected');
                    this.selected = character;
                }
            }
        });
    }
}