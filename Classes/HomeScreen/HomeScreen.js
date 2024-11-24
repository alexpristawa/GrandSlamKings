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
        document.querySelector('#homeScreen').fadeOut(200, false);
        document.querySelector('#gameScreen').fadeIn(200, 'flex');
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
            if(!isNaN(opponent.stats[key])) sumOfStats += opponent.stats[key];
        });
        Match.winReward = Math.round(i * 100 * (sumOfStats/4));
        Match.setsToWin = i;
        let spans = document.querySelectorAll('.rewardDiv span');
        spans[0].innerHTML = Match.winReward;
        spans[1].innerHTML = Math.round(Match.winReward/5);
    }
}