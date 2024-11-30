class CharacterSlider {

    static defaultCharacter = {
        name: "Default",
        lastName: "Player",
        cost: 0,
        stats: {
            speed: {
                min: 0.5,
                current: 0.5,
                max: 1.75,
                inc: 0.05,
                cost: 50,
                multiplier: 1.3,
                level: 0
            },
            power: {
                min: 0.5,
                current: 0.5,
                max: 1.75,
                inc: 0.05,
                cost: 50,
                multiplier: 1.3,
                level: 0
            },
            accuracy: {
                min: 0.5,
                current: 0.5,
                max: 1.75,
                inc: 0.05,
                cost: 50,
                multiplier: 1.3,
                level: 0
            },
            ability: "None"
        },
        unlocked: true,
        imgsrc: "Default"
    }

    static characters = [
        {
            name: "Stan",
            lastName: "Wawrinka",
            cost: 500,
            stats: {
                speed: {
                    min: 0.75,
                    current: 0.75,
                    max: 1,
                    inc: 0.05,
                    cost: 250,
                    multiplier: 1.25,
                    level: 0
                },
                power: {
                    min: 1.25,
                    current: 1.25,
                    max: 1.5,
                    inc: 0.05,
                    cost: 250,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1,
                    current: 1,
                    max: 1.25,
                    inc: 0.05,
                    cost: 250,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Stefanos",
            lastName: "Tsitsipas",
            cost: 750,
            stats: {
                speed: {
                    min: 1,
                    current: 1,
                    max: 1.25,
                    inc: 0.05,
                    cost: 300,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1,
                    current: 1,
                    max: 1.25,
                    inc: 0.05,
                    cost: 300,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1,
                    current: 1,
                    max: 1.25,
                    inc: 0.05,
                    cost: 300,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Nick",
            lastName: "Kyrgios",
            cost: 1000,
            stats: {
                speed: {
                    min: 1,
                    current: 1,
                    max: 1.25,
                    inc: 0.05,
                    cost: 500,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1,
                    current: 1,
                    max: 2,
                    inc: 0.05,
                    cost: 250,
                    multiplier: 1.3,
                    level: 0
                },
                accuracy: {
                    min: 0.75,
                    current: 0.75,
                    max: 1,
                    inc: 0.05,
                    cost: 500,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Alexander",
            lastName: "Zverev",
            cost: 2000,
            stats: {
                speed: {
                    min: 1.25,
                    current: 1.25,
                    max: 1.5,
                    inc: 0.05,
                    cost: 1000,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.25,
                    current: 1.25,
                    max: 1.5,
                    inc: 0.05,
                    cost: 1000,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1.25,
                    current: 1.25,
                    max: 1.5,
                    inc: 0.05,
                    cost: 1000,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Daniil",
            lastName: "Medvedev",
            cost: 5000,
            stats: {
                speed: {
                    min: 1.25,
                    current: 1.25,
                    max: 1.5,
                    inc: 0.05,
                    cost: 2500,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.25,
                    current: 1.25,
                    max: 1.5,
                    inc: 0.05,
                    cost: 2500,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1.5,
                    current: 1.5,
                    max: 1.75,
                    inc: 0.05,
                    cost: 2500,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Novak",
            lastName: "Djokovic",
            cost: 10000,
            stats: {
                speed: {
                    min: 1.6,
                    current: 1.6,
                    max: 1.6,
                    inc: 0.05,
                    cost: 5000,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.6,
                    current: 1.6,
                    max: 1.6,
                    inc: 0.05,
                    cost: 5000,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1.6,
                    current: 1.6,
                    max: 1.75,
                    inc: 0.05,
                    cost: 5000,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Jannik",
            lastName: "Sinner",
            cost: 15000,
            stats: {
                speed: {
                    min: 1.5,
                    current: 1.5,
                    max: 1.75,
                    inc: 0.05,
                    cost: 10000,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.5,
                    current: 1.5,
                    max: 1.75,
                    inc: 0.05,
                    cost: 10000,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1.5,
                    current: 1.5,
                    max: 1.75,
                    inc: 0.05,
                    cost: 10000,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Carlos",
            lastName: "Alcaraz",
            cost: 25000,
            stats: {
                speed: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 12500,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.5,
                    current: 1.5,
                    max: 1.75,
                    inc: 0.05,
                    cost: 12500,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 12500,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Rafael",
            lastName: "Nadal",
            cost: 50000,
            stats: {
                speed: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 15000,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.5,
                    current: 1.5,
                    max: 2,
                    inc: 0.05,
                    cost: 15000,
                    multiplier: 1.25,
                    level: 0
                },
                accuracy: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 15000,
                    multiplier: 1.5,
                    level: 0
                },
                technique: 2,
                ability: "None"
            },
            unlocked: false
        },
        {
            name: "Roger",
            lastName: "Federer",
            cost: 100000,
            stats: {
                speed: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 20000,
                    multiplier: 1.5,
                    level: 0
                },
                power: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 20000,
                    multiplier: 1.5,
                    level: 0
                },
                accuracy: {
                    min: 1.75,
                    current: 1.75,
                    max: 2,
                    inc: 0.05,
                    cost: 20000,
                    multiplier: 1.5,
                    level: 0
                },
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
                speed: {current: 0.5},
                power: {current: 0.5},
                accuracy: {current: 0.5},
                technique: {current: 0.5},
                ability: "None"
            },
            imgsrc: "Default"
        },
        {
            name: "Medium",
            lastName: "",
            stats: {
                speed: {current: 1},
                power: {current: 0.75},
                accuracy: {current: 0.5},
                technique: {current: 1},
                ability: "None"
            },
            imgsrc: "Default"
        },
        {
            name: "Hard",
            lastName: "",
            stats: {
                speed: {current: 1.5},
                power: {current: 1},
                accuracy: {current: 1.5},
                technique: {current: 1.5},
                ability: "None"
            },
            imgsrc: "Default"
        },
        {
            name: "Extreme",
            lastName: "",
            stats: {
                speed: {current: 2},
                power: {current: 2},
                accuracy: {current: 2},
                technique: {current: 2},
                ability: "None"
            },
            imgsrc: "Default"
        }
    ]

    static abilityDescriptions = {
        Slice: "1 in 5 chance of a slice with extreme backspin"
    }

    static getCharacters() {
        let newArr = [];
        [this.defaultCharacter, ...this.characters].forEach(character => {
            let obj = storageObj.characters.find(obj => obj.name == character.name);
            if(obj) {
                Object.keys(obj.stats).forEach(key => {
                    if(key == 'technique') {
                        obj.stats.technique = character.stats.technique;
                    } else if(key != 'ability') {
                        if(obj.stats[key].min != undefined) {
                            obj.stats[key].min = character.stats[key].min;
                            obj.stats[key].max = character.stats[key].max;
                            obj.stats[key].current = character.stats[key].min + obj.stats[key].level * obj.stats[key].inc;
                            obj.stats[key].inc = character.stats[key].inc;
                            obj.stats[key].cost = character.stats[key].cost;
                            obj.stats[key].multiplier = character.stats[key].multiplier;
                        } else {
                            obj.stats[key] = {current: character.stats[key].current};
                        }
                    }
                });
                obj.stats.ability = character.stats.ability;
                obj.cost = character.cost;
            } else {
                obj = JSON.parse(JSON.stringify(character));
            }
            newArr.push(obj);
        });
        this.defaultCharacter = newArr.splice(0, 1)[0];
        this.characters = [...newArr];
        StorageManager.updateCharacters();
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
            div.classList.add('character');
            div.style.display = 'flex';
            if(this.type == 'opponents') div.querySelector('i.fas.fa-circle-info').remove();
            div.querySelector('img').src = `Images/Characters/${character.name}${character.lastName}.png`;
            character.img = new Image();
            character.img.src = `Images/Characters/${character.name}${character.lastName}${character.imgsrc=="Default" ? "":"Headshot"}.png`;
            if(character.imgsrc == 'Default') {
                div.querySelector('img').style.height = '40%';
                div.querySelector('img').style.marginTop = '30%';
                div.querySelector('img').classList.add('default');
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
                    let bar = new StatBar(stat.current*50, undefined, stat.max*50, character, key);
                    div.querySelector(`.stats > .${key}`).appendChild(bar.statBar);
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
            div.addEventListener('click', (event) => {
                if(event.target.tagName == 'I') {
                    HomeScreen.expandCharacter(character, div);
                    return;
                }
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
                        StorageManager.updateCharacters();
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