function ifExists(searchWord, targetArray) {  
    //searches an array for a line that contains the searchWord; returns true if it finds anything

    if (findLine(searchWord, targetArray) > -1) {
        return true;
    }
    else {
        return false;
    }
}

function splitText() {
    //gets the text from inputBox, fixes special characters like funky dashes and such, and splits it into an array
    let textchunk = document.getElementById(inputBox).value;
    textchunk = sanitize(textchunk);
    return textchunk.split("\n");
}

function mergeText(targetArray) {
    //merges the text from an array and puts it into outputBox
    let textchunk = targetArray.join("\n");
    document.getElementById(outputBox).value = textchunk
}

function wholeWord(word) { //placeholder
    let regWord = new RegExp("\\b" + word + "\\b");
    return regWord;
}

function findLine(word, targetArray) {
    //finds the first element in an array that has a certain word; returns that element index
    //if there's nothing that matches, returns -1

    let targetIndex = -1;

    for (let i = 0; i < targetArray.length; i += 1) {
        if ( wholeWord(word).test(targetArray[i]) ) { //if the word is in the particular line of the array
            targetIndex = i;
            break;
        }
        else {
        }
    }
    return targetIndex;
}

function findLineRegex(word, monster) {  
    //as findLine, but searches for a regex
    let targetIndex = -1;

    for (let i = 0; i < monster.length; i += 1) {
        if ( word.test(monster[i]) ) { //if the word is in the particular line of the array
            targetIndex = i;
            break;
        }
        else {
        }
    }
    return targetIndex;
}

function fixNaN(possibleNaN) {  //changes any Not A Number integers to 0
    if (isNaN(possibleNaN)) {  //if the argument tested is not a number
        possibleNaN = 0; //changes it to 0; otherwise, nothing happens
    }

    return possibleNaN;
}

function wordArrayCheck(textchunk, wordArray) { //goes through an array of strings, checks each against a bit of text until it finds a match

    /*This one is short, but requires a bit of explaining.
    This function takes a line of text from a monster array (textchunk), and an array of strings to search through (wordArray)
    It will search through the wordArray from index 0 to the end, and check to see if each string is in the textchunk
    It will return the last matching term in the array; for example,
    if textchunk = "apples and oranges and pineapples" and wordArray = ["oranges", "bananas", "apples", "milk"]
    then it'll return "apples"

    Use this one to find alignment, size category, or creature type.
    If there are several similar terms, where one could be found inside another, write the wordArray from shortest to longest string;
    For example, "Humanoid" should come before "Monstrous Humanoid" to prevent it from returning "Humanoid" for a monstrous humanoid

    If it doesn't find any of the words, then it returns the string "Unknown";

    This is case sensitive
    */

    let foundText = "Unknown"
    for (let i = 0; i < wordArray.length; i += 1) {
        if (wholeWord(wordArray[i]).test(textchunk) ) { //if the word exists in the textchunk as a complete word, not part of another
            foundText = wordArray[i];
        }
    }

    return foundText;
}

function sanitize(rawText) { //removes fancy formatting like longdashes and such
    rawText = rawText.replace(/–/g, "-");
    rawText = rawText.replace("×", "x");
    return rawText;
}

function clearModifiers(rawText) {  //deletes modifiers like +3, -5, or the like

    rawText = sanitize(rawText); //gets rid of fancy dashes to make this easier
    rawText = rawText.replace(/[+-]\d*/g, "");

    return rawText;
}

//----GET STATS
//----Functions to grab particular stat lines from the document; most can be done with getStats

function getStats(statName, monster) {  //searches a "monster" array for a line that contains the relevant statName; if none, returns ""
    let targetIndex = findLine(statName, monster);
    let monsterStat = "";
    if (targetIndex > -1) {
        monsterStat = monster[targetIndex];
    }
    return monsterStat;
}

function getStatsRegex(monster, statName) {  //as getStats, but takes a RegExp as a statName instead of a string
    let targetIndex = findLineRegex(statName, monster);
    let monsterStat = "";
    if (targetIndex > -1) {
        monsterStat = monster[targetIndex];
    }
    return monsterStat;
}