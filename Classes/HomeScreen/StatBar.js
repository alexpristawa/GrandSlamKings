class StatBar {

    static statBars = [];

    constructor(currentDiv, upgradeDiv, capDiv, character, key) {
        this.character = character;
        this.key = key;
        this.statBar = document.createElement('statBar');
        this.currentBar = document.createElement('div');
        this.currentBar.classList.add('currentBar');
        this.currentBar.style.width = `${currentDiv}%`;
        this.statBar.appendChild(this.currentBar);

        if(upgradeDiv) {
            this.upgradeBar = document.createElement('div');
            this.upgradeBar.classList.add('upgradeBar');
            this.upgradeBar.style.width = `${upgradeDiv}%`;
            this.statBar.appendChild(this.upgradeBar);
        }
        if(capDiv) {
            this.capBar = document.createElement('div');
            this.capBar.classList.add('capBar');
            this.capBar.style.width = `${capDiv}%`;
            this.statBar.appendChild(this.capBar);
        }
        StatBar.statBars.push(this);
    }

    static updateStatBars() {
        StatBar.statBars.forEach(statBar => {
            if(!statBar.statBar.matches('body *')) {
                StatBar.statBars.splice(StatBar.statBars.indexOf(statBar), 1);
            } else {
                statBar.update(statBar.character.stats[statBar.key].current*50, 
                    statBar.upgradeBar ? Math.min(statBar.character.stats[statBar.key].current + statBar.character.stats[statBar.key].inc, statBar.character.stats[statBar.key].max)*50 : undefined, 
                    statBar.capBar ? statBar.character.stats[statBar.key].max*50 : undefined);
            }
        });
    }

    update(currentDiv, upgradeDiv, capDiv, transition) {
        if(transition) {
            this.currentBar.style.transition = 'width 0.5s ease';
            if(this.upgradeBar) this.upgradeBar.style.transition = 'width 1s ease-in-out';
        } else {
            this.currentBar.style.transition = '';
            if(this.upgradeBar) this.upgradeBar.style.transition = '';
        }
        this.setCurrentBar(currentDiv);
        if(upgradeDiv) this.setUpgradeBar(upgradeDiv);
        if(capDiv) this.setCapBar(capDiv);
    }

    setCurrentBar(percentage) {
        this.currentBar.style.width = percentage + '%';
    }

    setUpgradeBar(percentage) {
        this.upgradeBar.style.width = percentage + '%';
    }

    setCapBar(percentage) {
        this.capBar.style.width = percentage + '%';
    }
}