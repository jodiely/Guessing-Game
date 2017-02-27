function generateWinningNumber(){
    return Math.floor(Math.random()*100)+1;
}

function shuffle(arr){
    var m = arr.length,
        t,
        i;

    while(m){
        i = Math.floor(Math.random()*m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t; 
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function (){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function (){
    if(this.playersGuess < this.winningNumber){
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function(num){
    if (typeof num !== 'number' || num < 1 || num > 100 ){
        throw 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function (){
    if(this.playersGuess === this.winningNumber){
        $('#submit, #hint').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'You Win!';

    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1){
            $('h1').text("Guess again!");
            return "You have already guessed that number.";

        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
        }

        if(this.pastGuesses.length === 5){
            $('#submit, #hint').prop("disabled",true);
            $('#subtitle').text("Press the Reset button to play again!")
            return 'You Lose.';
        } else {
            var diff = this.difference();
            if(this.isLower()) {
                $('#subtitle').text("Guess Higher!")
            } else {
                $('#subtitle').text("Guess Lower!")
            }

             if(this.difference() < 10){
                return 'You\'re burning up!';
            } else if (this.difference() < 25){
                return 'You\'re lukewarm.';
            } else if (this.difference() < 50){
                return 'You\'re a bit chilly.';
            } else if (this.difference() < 100){
                return 'You\'re ice cold!';
            }
        }
    }
   
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function (){
    var hint = [this.winningNumber];
    hint.push(generateWinningNumber());
    hint.push(generateWinningNumber());
    return shuffle(hint);
}

function makeAGuess(game){
    var submitted = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(submitted,10));
    $('#title').text(output);
}


$(document).ready(function(){
    var game = new Game();

    $("#submit").click(function(event){
        makeAGuess(game);
    });

    $("#player-input").keypress(function(event){
        if(event.which === 13){
            makeAGuess(game);
        }
    })

     $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
})