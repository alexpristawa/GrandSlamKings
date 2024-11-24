class Logic {

    static exclamationMessage = "";

    constructor() {
        
    }

    static updateMessage(ms = 3000, serve = true) {
        let div = document.getElementById('exclamation');
        div.fadeIn(250, 'flex');

        let bigDiv = document.querySelector('#exclamation > div:nth-child(1');
        bigDiv.innerHTML = this.exclamationMessage;

        if(this.exclamationMessage == 'Out!' || this.exclamationMessage == 'You Lost!') {
            bigDiv.style.color = 'red';
        } else if(this.exclamationMessage == 'You Won!') {
            bigDiv.style.color = 'green';
        } else {
            bigDiv.style.color = 'white';
        }

        let smallDiv = document.querySelector('#exclamation > div:nth-child(2)');
        let coins = this.exclamationMessage == "You Won!" ? Match.winReward:Math.floor(Match.winReward/5);

        if(['You Won!', 'You Lost!'].includes(this.exclamationMessage)) {
            smallDiv.innerHTML = `<img src="Images/coin.png"><span>${coins}</span>`;
            setTimeout(() => {
                HomeScreen.goToHomeScreen(coins);
            }, 2000);
            return;
        }
        if(Match.game instanceof Tiebreaker) {
            smallDiv.innerHTML = `${Match.match.score[0].points}-${Match.match.score[1].points}`;
        } else if(Match.match.score[0].points == 4) {
            smallDiv.innerHTML = 'Advantage in';
        } else if(Match.match.score[1].points == 4) {
            smallDiv.innerHTML = 'Advantage out';
        } else if(Match.match.score[0].points == 3 && Match.match.score[1].points == 3) {
            smallDiv.innerHTML = 'Deuce';
        } else {
            smallDiv.innerHTML = `${Game.scoreArr[Match.match.score[Match.game.serving].points]}-${Game.scoreArr[Match.match.score[Math.abs(Match.game.serving-1)].points]}`;
        }

        ms -= 500;
        setTimeout(() => {
            div.fadeOut(250, false);
            if(serve) {
                Player.players[Match.game.serving].serve();
            }
        }, ms);
    }

    static updateScoreboard() {
        scoreboard.sets[0].innerHTML = Match.match.score[0].sets;
        scoreboard.sets[1].innerHTML = Match.match.score[1].sets;

        scoreboard.games[0].innerHTML = Match.match.score[0].games;
        scoreboard.games[1].innerHTML = Match.match.score[1].games;

        if(Match.game instanceof Tiebreaker) {
            scoreboard.points[0].innerHTML = Match.match.score[0].points;
            scoreboard.points[1].innerHTML = Match.match.score[1].points;
        } else {
            scoreboard.points[0].innerHTML = Game.scoreArr[Match.match.score[0].points];
            scoreboard.points[1].innerHTML = Game.scoreArr[Match.match.score[1].points];

            if(scoreboard.points[0].innerHTML == '45') {
                scoreboard.points[0].innerHTML = 'Ad';
                scoreboard.points[1].innerHTML = '';
            } else if(scoreboard.points[1].innerHTML == '45') {
                scoreboard.points[1].innerHTML = 'Ad';
                scoreboard.points[0].innerHTML = '';
            }
        }

        scoreboard.serving[Match.game.serving].style.opacity = '1';
        scoreboard.serving[Math.abs(Match.game.serving-1)].style.opacity = '0';
    }
}