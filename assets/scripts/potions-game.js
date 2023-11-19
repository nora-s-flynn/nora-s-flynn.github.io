// initialise variables at 0/starting point
var colorSequence = ["firebrick", "yellow", "midnightblue", "green", "purple", "dodgerblue", "orange", "fuchsia", "greenyellow"];
var levelLength = [3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
var level = 0;
var gamePattern = [];
var userPattern = [];

// keypress listener to start the game 
$(document).keypress(function(event) {
    if (level === 0) { // first keystroke -- make heading text read level 0 and visually show first N positions according to levelLength
        $("#title-text").text("Level 0");
        for (i=0; i<levelLength[level]; i++) {
            var nextColour = colorSequence[i];
            $("#available-colours>div.row>." + nextColour).removeClass("visually-hidden");
            $("#guess-current>div.row>._"+(i+1)).removeClass("visually-hidden");
        }
        levelUp();
    }
});

// click event listener for available colours
$("#available-colours>div.row>.btn").click(function() {

    // use $(this) to force jQuery context, otherwise get undefined exception
    var userChosenColour = $(this).attr("id");

    // get number of choices user has made so far
    itemsSoFar = userPattern.length;

    // use that number to add a colour class to next item
    $("#guess-current>div.row>._" + (itemsSoFar+1) + ">svg").attr("fill", userChosenColour);
    setTimeout(userPattern.push(userChosenColour), 600);
    // add colour to user's pattern after 600ms delay    


    if (userPattern.length === levelLength[level]) {
        checkAnswer(userPattern);
        // then reset for next guess
        userPattern = [];      
    };
});

function levelUp () {
    if (level === 9) {
        $("#modalComplete").modal("show");
        startOver();
    } else {
        level++; // increment value of level
        userPattern = []; // reset user pattern
        gamePattern = []; // reset game pattern
        // clear guess history colours and current guess colours - also hide guess history as part of the reset
        $("#guess-current svg").attr("fill", "currentColor");
        $("#guess-history>div.row>div.btn>svg").attr("fill", "currentColor");
        $("#guess-history>div.row>div.btn").addClass("visually-hidden");
        $("#guess-history div.btn").removeClass("correct");

        $("#title-text").text("Level " + level); // change text

        // if the length has changed, toggle the visibility of the next colour
        if (levelLength[level] !== levelLength[level-1] ) {
            $("#available-colours>div.row>." + colorSequence[levelLength[level]-1]).removeClass("visually-hidden");
            $("#guess-current>div.row>._"+(levelLength[level])).removeClass("visually-hidden");
        };
        
        // this is where the gamePattern will be generated and stored
        var copyOfColours = colorSequence.slice(0, levelLength[level]);

        // generate random array from available colours going from 0 to however many positions for that level
        for (i=levelLength[level]; i>0; i--) {
                var randomNumber = Math.random();
                randomNumber = Math.floor(randomNumber * i);
                
                // take the colour with that randomly generated index and add it to the game pattern
                gamePattern.push(copyOfColours[randomNumber]);

                // modify a copy of the colour sequence to no longer include what's just been selected
                copyOfColours = copyOfColours.slice(0, randomNumber).concat(copyOfColours.slice(randomNumber+1));
            };
    };
    
};

function checkAnswer(userPattern) {
    if (userPattern.every((val, index) => val === gamePattern[index])) {
        // if sequence is guessed correctly - javascript can't handle comparing arrays, hence the long expression
        if (level < 9) {
            $("#modalCorrect").modal("show");
        };
        levelUp();
    } else {
        // first check if user is allowed any more guesses
        var keepGoing = anyGuessesRemaining();
        if ( keepGoing === true) {
            // user is allowed another guess, check current guess against pattern and record in next available slot
            for (i=1; i<=9; i++) {
                // do this by checking if the first svg on the row has fill === 'currentColor', which means it's not been used yet
                var firstItemFill = $("#prev-guess-" + i + ">div.btn._1>svg").attr("fill");
                if (firstItemFill === 'currentColor') {
                    // using i-th row of guess-history
                    for (j=0; j<userPattern.length; j++) {
                        // iterate through the buttons on that guess row and match fill - check if corresponding index in game pattern is the same; if so, add .correct
                        if (userPattern[j] === gamePattern[j]) {
                            // add .correct to "#prev-guess-i > .btn._j"
                            $("#prev-guess-" + i + ">div.btn._" + (j+1)).addClass("correct");
                        }
                        // copy the fill colour of the j-th userPattern element onto the j-th element of the i-th guess history row
                        $("#prev-guess-" + i + ">div.btn._" + (j+1) + ">svg").attr("fill", userPattern[j]);
                        // then make the element visible
                        $("#prev-guess-" + i + ">div.btn._" + (j+1)).removeClass("visually-hidden");
                    };
                    // this is when the colours have finished copying from current guess to guess history - so time to move on to next guess
                    // reset the current guess colours and the userPattern?
                    $("#guess-current svg").attr("fill", "currentColor");
                    $("#modalTryAgain").modal("show");
                    userPattern = [];
                    break;
                };
                // break out of loop checking which guess row slot is the next available (i loop)
                // when break is outside of if (firstItemFill === 'currentColor'), I get stuck on second guess
            };
        } else {
            // user is not allowed more guesses, display alert
            $("#modalIncorrect").modal("show");
            startOver();
        };
    };
};

function anyGuessesRemaining () {
    // checks how many guesses have been used so far and returns bool describing whether more guesses are allowed
    var nextGuessNumber = 0;
    for (i=1; i<9; i++) {
        // do this by checking if the first svg on the row has fill === 'currentColor', which means it's not been used so far
        var firstItemFill = $("#prev-guess-" + i + ">div.btn._1>svg").attr("fill");
        if (firstItemFill === 'currentColor') {
            nextGuessNumber = i;
            break;
        }; 
    };
    if (nextGuessNumber >= levelLength[level]) {
        return false;
    } else { return true;}
};

function startOver() {
    level = 0;
    userPattern = [];
    gamePattern = [];
    // remove .correct from all btns
    $("#guess-history div.btn").removeClass("correct");
    // reset visibility of available + current guess
    $("#title-text").text("Level 0");
    for (i=0; i<=9; i++) {
        var nextColour = colorSequence[i];
        $("#available-colours>div.row>." + nextColour).addClass("visually-hidden");
        $("#guess-current>div.row>.btn").addClass("visually-hidden");
    };
    $("#guess-history .btn").attr("fill", "currentColor");
};