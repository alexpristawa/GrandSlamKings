class HomeScreen {

    static characterSlider;
    static exhibitionSlider;

    static instantiate() {
        this.characterSlider = new CharacterSlider(document.querySelector('#homeScreen > .m1> .characters > .characterSlider'), [CharacterSlider.defaultCharacter, ...CharacterSlider.characters], 'characters');

        this.exhibitionSlider = new CharacterSlider(document.querySelector('#homeScreen > .m1 > .exhibition > .opponents'), [...CharacterSlider.opponents, ...CharacterSlider.characters], 'opponents');

        let i = 0;
        let buttons = document.querySelectorAll('#homeScreen > .m1 > div.exhibition > div.bottomDiv > .setDiv > div > div:nth-child(2) > button')
        buttons.forEach(button => {
            i++;
            const index = i;
            button.addEventListener('click', () => {
                buttons.forEach(b => {
                    if(b != button) b.classList.remove('selected');
                });
                button.classList.add('selected');
                this.updateRewards(index);
            });
        });

        this.updateRewards(1);
    }

    static newExhibition() {
        let player = this.characterSlider.selected;
        let opponent = this.exhibitionSlider.selected;
        Match.color = undefined;
        new Match(1, [player, opponent]);
    }

    static goToHomeScreen(coins = 0) {
        document.querySelector('screen#gameScreen').fadeOut(1000, false);
        document.querySelector('screen#homeScreen').fadeIn(1000, 'flex');
        setTimeout(() => {
            StorageManager.incrementCoins(coins);
        }, 1000);
    }

    static updateRewards(i) {
        let opponent = this.exhibitionSlider.selected;
        let sumOfStats = 0;
        Object.keys(opponent.stats).forEach(key => {
            if(!isNaN(opponent.stats[key].max)) sumOfStats += opponent.stats[key].max;
        });
        Match.winReward = Math.round(i * 100 * (sumOfStats/4));
        Match.setsToWin = i;
        let spans = document.querySelectorAll('.rewardDiv span');
        spans[0].innerHTML = Match.winReward;
        spans[1].innerHTML = Math.round(Match.winReward/5);
    }

    static expandCharacter(character, div) {
        let duplicate = div.cloneNode(true);
        div.classList.add('characterExpanded');
        duplicate.style.width = div.offsetWidth + 'px';
        duplicate.style.height = div.offsetHeight + 'px';
        duplicate.style.position = 'absolute';
        duplicate.style.top = div.getBoundingClientRect().top + 'px';
        duplicate.style.left = div.getBoundingClientRect().left + 'px';
        duplicate.style.zIndex = 100;
        duplicate.style.transition = 'all 1.2s ease';
        duplicate.style.transformStyle = 'preserve-3d'; // Preserve 3D for this element
        
        // Add a perspective wrapper
        let perspectiveWrapper = document.createElement('div');
        perspectiveWrapper.classList.add('perspectiveWrapper');
        perspectiveWrapper.appendChild(duplicate);
        document.querySelector('screen#homeScreen').appendChild(perspectiveWrapper);
    
        let characterInfo = document.querySelector('.characterInfo');
        characterInfo.fadeIn(1000, 'flex');
        let imageHolder = characterInfo.querySelector('.imageHolder');
        let ref = div.cloneNode(true);
        ref.style.opacity = 0;
        ref.querySelector('.name').remove();
        if(ref.querySelector('.cost') != null) {
            ref.querySelector('.cost').remove();
            duplicate.querySelector('.cost').fadeOut(500, true);
        }
        ref.querySelector('.stats').remove();
        duplicate.querySelector('.name').fadeOut(500, true);
        duplicate.querySelector('.stats').fadeOut(500, true);
        duplicate.querySelector('i.fas.fa-circle-info').remove();
        ref.querySelector('i.fas.fa-circle-info').remove();

        characterInfo.querySelector('.name').innerHTML = `${character.name} ${character.lastName}`;
        imageHolder.appendChild(ref);

        setTimeout(() => {
        
            // Transition to target position and apply 3D rotation
            duplicate.style.top = `${ref.getBoundingClientRect().top}px`;
            duplicate.style.left = `${ref.getBoundingClientRect().left}px`;
            duplicate.style.width = `${ref.offsetWidth}px`;
            duplicate.style.height = `${ref.offsetHeight}px`;
            duplicate.style.transform = 'rotateY(360deg)';

            setTimeout(() => {
                duplicate.remove();
                ref.style.opacity = 1;
                let statsHolder = characterInfo.querySelector('.statsHolder');
                statsHolder.innerHTML = '';
                characterInfo.style.transition = 'width 500ms ease';
                characterInfo.style.width = '44%';
                statsHolder.style.transition = 'flex-grow 500ms ease';
                statsHolder.style.flexGrow = 1;

                setTimeout(() => {
                    let i = 0;
                    Object.keys(character.stats).forEach(key => {
                        if(!['ability', 'technique'].includes(key)) {
                            let stat = character.stats[key];
                            let div = document.createElement('div');
                            let cost = Math.round(stat.cost*stat.multiplier**stat.level);
                            div.innerHTML = `<div>${key.charAt(0).toUpperCase()}${key.substring(1)}</div><div></div><div><button><img src='Images/coin.png'><span>${cost}</span></button></div>`;
                            let statBar = new StatBar((stat.current)/2*100, Math.min(stat.current + stat.inc, stat.max)/2*100, stat.max/2*100, character, key);
                            div.querySelector('div:nth-child(2)').appendChild(statBar.statBar);
                            statsHolder.appendChild(div);

                            let button = div.querySelector('button');
                            if(stat.current >= stat.max) {
                                stat.current = stat.max;
                                button.style.opacity = 0;
                                button.style.pointerEvents = 'none';
                            }
                            button.addEventListener('click', () => {
                                if(character.unlocked) {
                                    if(storageObj.coins >= cost) {
                                        StorageManager.incrementCoins(-cost);
                                        stat.level++;
                                        stat.current += stat.inc;
                                        if(stat.current >= stat.max) {
                                            stat.current = stat.max;
                                            button.style.opacity = 0;
                                            button.style.pointerEvents = 'none';
                                        } else {
                                            cost = Math.round(stat.cost*stat.multiplier**stat.level);
                                            div.querySelector('button span').innerHTML = cost;
                                        }
                                        statBar.update(stat.current*50, Math.min(stat.current + stat.inc, stat.max)*50, stat.max*50, true);
                                        setTimeout(() => {
                                            StatBar.updateStatBars();
                                        }, 1000);
                                        StorageManager.updateCharacters();
                                    }
                                }
                            });

                            setTimeout(() => {
                                div.fadeIn(200, 'flex');
                            }, i*100);
                            i++;
                        } else if(key == 'ability') {

                        }
                    });
                }, 500);
            }, 1200);
        }, 1);
    }

    static collapseCharacter() {
        let characterInfo = document.querySelector('.characterInfo');
        characterInfo.fadeOut(500, false);
        document.querySelectorAll('.characterExpanded').forEach(div => div.classList.remove('characterExpanded'));
        setTimeout(() => {
            characterInfo.querySelector('.imageHolder').innerHTML = '';
            characterInfo.querySelector('.statsHolder').style.flexGrow = 0;
            characterInfo.querySelector('.statsHolder').innerHTML = '';
            characterInfo.querySelector('.imageHolder').innerHTML = '';
            characterInfo.style.width = '22%';
        }, 500);
    }
    
}