//TODO:
// Fix processHitDice so it handles the urdefhan and other misformatted stats
// Fix processAttack so that it can do actual mathematic conversions

//This is a cleaner, more elegant, and less powerful alternate to my other stat block processor.
//It replaces parts of the text input rather than completely rewriting it.
//It has more tolerance for irregularities in stat blocks, but fewer options for formatting.


/* OLD CODE FROM THE OTHER PROCESSOR BELOW */

const inputBox = "input-box";  //the name of the input textarea; paste a monster here from a compatible source
const outputBox = "output-box";  //the name of the output textarea
const deleteAbilities = true; //determines whether convert2e will delete ability scores
const armorHalf = 17; //any Armor Class points over this amount are halved and rounded down; used for converting AC from PF/3e to 2e

//----STRING FUNCTIONS
//----Various functions to get text from the input, split it up into arrays, search it for particular information

function test() {
    //creates newArray by grabbing text from the input textarea and splitting it
    //splitting the text into an array makes it much easier to work with

    let newArray = splitText(inputBox);
    newArray = convert2e(newArray);

    mergeText(newArray); //joins the array back into a string and sends the results to the output textarea
}

function convert2e(newArray) {
    //takes a string array, converts stats from Pathfinder to AD&D 2e rules, returns the result
    //most of this is simple RegExp-based deletion of unnecessary stats, but there's some conversions as well

    //STEP ONE: Remove unnecessary text
    //currently repeating myself; will use functions later

    //DELETE CHALLENGE RATING
    if (ifExists("CR", newArray)) {
        let targetLine = getStats("CR",  newArray);
        let targetIndex = findLine("CR", newArray);
        targetLine = targetLine.replace(/ *CR \d*/g, "");  //deletes CR, the following number, and any spaces nearby
        newArray[targetIndex] = targetLine;
    }

    //DELETE EXPERIENCE LINE ENTIRELY
    if (ifExists("XP", newArray)) {
        let targetIndex = findLine("XP", newArray);
        newArray.splice(targetIndex, 1);
    }

    //DELETE INITIATIVE
    if (ifExists("Init", newArray)) {
        let targetLine = getStats("Init",  newArray);
        let targetIndex = findLine("Init", newArray);
        targetLine = targetLine.replace(/ *Init *[+-]\d* *;* */g, "");  //deletes init, the following number, and any spaces nearby
        newArray[targetIndex] = targetLine;
    }

    //DELETE PERCEPTION
    if (ifExists("Perception", newArray)) {
        let targetLine = getStats("Perception",  newArray);
        let targetIndex = findLine("Perception", newArray);
        targetLine = targetLine.replace(/ *;* *Perception *[+-]\d* *;* */g, "");
        newArray[targetIndex] = targetLine;
    }

    //DELETE SAVES LINE ENTIRELY
    if (ifExists("Ref", newArray)) {
        let targetIndex = findLine("Ref", newArray);
        newArray.splice(targetIndex, 1);
    }

    //DELETE SPACE/REACH LINE ENTIRELY
    if (ifExists("Reach", newArray)) {
        let targetIndex = findLine("Reach", newArray);
        newArray.splice(targetIndex, 1);
    }

    //DELETE BASE ATTACK BONUS, CMB, CMD LINE ENTIRELY
    if (ifExists("CMB", newArray)) {
        let targetIndex = findLine("CMB", newArray);
        newArray.splice(targetIndex, 1);
    }

    //DELETE CONCENTRATION MODIFIER
    if (ifExists("concentration", newArray)) {
        let targetLine = getStats("concentration",  newArray);
        let targetIndex = findLine("concentration", newArray);
        targetLine = targetLine.replace(/ *;* *concentration *[+-]\d* *;* */g, "");
        newArray[targetIndex] = targetLine;
    }

    //DELETE FEAT LINE ENTIRELY
    if (ifExists("Feats", newArray)) {
        let targetIndex = findLine("Feats", newArray);
        newArray.splice(targetIndex, 1);
    }

    //DELETE SKILL LINE ENTIRELY
    if (ifExists("Skills", newArray)) {
        let targetIndex = findLine("Skills", newArray);
        newArray.splice(targetIndex, 1);
    }


//STEP TWO: OPTIONAL DELETIONS

    if (ifExists("Wis", newArray) && deleteAbilities === true) {
        let targetIndex = findLine("Wis", newArray);
        newArray.splice(targetIndex, 1);
    }

 
//STEP THREE: CONVERSIONS 

if (ifExists("AC", newArray)) {
    let targetIndex = findLine("AC", newArray);
    let targetLine = getStats("AC", newArray)
    
    let Armor = processAC(targetLine); //grabs hit dice as an integer

    targetLine = "AC " + convert2eAC(Armor.AC);
    newArray[targetIndex] = targetLine;
}

if (ifExists("hp", newArray)) {
    let targetIndex = findLine("hp", newArray);
    let targetLine = getStats("hp", newArray)
    
    let hitDice = processHitDice(targetLine); //grabs hit dice as an integer
    let hitPoints = Math.floor(hitDice * 4.5); //figures out average hit points in 2e rules, rounds down

    let newText = "HD " + hitDice + " (" + hitPoints + " hp)";

    let backText = targetLine.slice(targetLine.indexOf(")") + 1);
    targetLine = newText + backText;

    newArray[targetIndex] = targetLine;
}

if (ifExists("Melee", newArray)) {
    let targetIndex = findLine("Melee", newArray);
    let targetLine = getStats("Melee", newArray)
    
    targetLine = processAttack(targetLine); //changes the line to fit a different standard

    newArray[targetIndex] = targetLine;
}

if (ifExists("Ranged", newArray)) {
    let targetIndex = findLine("Ranged", newArray);
    let targetLine = getStats("Ranged", newArray)
    
    targetLine = processAttack(targetLine); //changes the line to fit a different standard

    newArray[targetIndex] = targetLine;
}


 
 
 
 
 
 
    return newArray;
}

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

//----PROCESS STATS
//These functions extract useful information from stat strings, generally as integers that can be easily converted to another rules edition

function processAbilities(rawText) {  //extracts all six ability scores
    //simple function to code because the line format will always be the same

    let Abilities = {};

    //get Str, cut it out of the raw text
    cutOffPoint = rawText.indexOf(","); 
    Abilities.strength = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)

    //get Dex, cut it out of the raw text; repeat for Con, Int, Wis, Cha below; pretty straightforward
    cutOffPoint = rawText.indexOf(","); 
    Abilities.dexterity = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)

    cutOffPoint = rawText.indexOf(","); 
    Abilities.constitution = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)


    cutOffPoint = rawText.indexOf(","); 
    Abilities.intelligence = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)

    cutOffPoint = rawText.indexOf(","); 
    Abilities.wisdom = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)

    //the remainder will be Charisma
    Abilities.charisma = rawText;

    //strip non-numeric characters
    Abilities.strength = Abilities.strength.replace(/\D/g,'');
    Abilities.dexterity = Abilities.dexterity.replace(/\D/g,'');
    Abilities.constitution = Abilities.constitution.replace(/\D/g,'');
    Abilities.intelligence = Abilities.intelligence.replace(/\D/g,'');
    Abilities.wisdom = Abilities.wisdom.replace(/\D/g,'');
    Abilities.charisma = Abilities.charisma.replace(/\D/g,'');

    //convert to integers
    Abilities.strength = parseInt(Abilities.strength, 10);
    Abilities.dexterity = parseInt(Abilities.dexterity, 10);
    Abilities.constitution = parseInt(Abilities.constitution, 10);
    Abilities.intelligence = parseInt(Abilities.intelligence, 10);
    Abilities.wisdom = parseInt(Abilities.wisdom, 10);
    Abilities.charisma = parseInt(Abilities.charisma, 10);

    //convert non-stats to 0
    Abilities.strength = fixNaN(Abilities.strength);
    Abilities.dexterity = fixNaN(Abilities.dexterity);
    Abilities.constitution = fixNaN(Abilities.constitution);
    Abilities.intelligence = fixNaN(Abilities.intelligence);
    Abilities.wisdom = fixNaN(Abilities.wisdom);
    Abilities.charisma = fixNaN(Abilities.charisma);

    //return the processed ability scores as a single object
    return Abilities;
}

function processAC(rawText) {  //extracts AC, touch AC, and flat-footed AC
    //This section will chop the armor sources in parentheses off the end of the AC; if there's no parenthetical, it doesn't do anything
    //simple function to code because the line format will always be the same

    let cutOffPoint = rawText.indexOf("(") - 1; 
    rawText = rawText.slice(0, cutOffPoint);

    let Armor = {};

    //get AC, cut it out of the raw text
    cutOffPoint = rawText.indexOf(","); 
    Armor.AC = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)

    //get touch, cut it out of the raw text
    cutOffPoint = rawText.indexOf(","); 
    Armor.touch = rawText.slice(0, cutOffPoint);
    rawText = rawText.slice(cutOffPoint+2)
    
    //the remainder is flat-footed; get it
    Armor.flatfooted = rawText;

    //strip non-numeric characters
    Armor.AC = Armor.AC.replace(/\D/g,'');
    Armor.touch = Armor.touch.replace(/\D/g,'');
    Armor.flatfooted = Armor.flatfooted.replace(/\D/g,'');

    //convert to integers
    Armor.AC = parseInt(Armor.AC, 10);
    Armor.touch = parseInt(Armor.touch, 10);
    Armor.flatfooted = parseInt(Armor.flatfooted, 10);
   
    //return the processed AC types as a single object
    return Armor;
}

function processAttack(rawText) {  //extracts attacks and damage
    //complex function to code because the line can vary a bit
   
    let Attack = {};
    let cutOffPoint = -1;
    let rawTextFrontChunk = "";
    let rawTextBackChunk = "";
    let processedChunk = "";
    let conjunctions = /and|or|,/; //covers the myriad ways some writer might use to separate attacks

     //do while means that this keeps running until all attacks have been processed
    do {

        //grab everything up to the first (, remove modifiers, note iterative attacks, put it back together
        cutOffPoint = rawText.indexOf("(");
        rawTextFrontChunk = rawText.slice(0, cutOffPoint);
        rawTextBackChunk = rawText.slice(cutOffPoint);
        rawTextFrontChunk = clearModifiers(rawTextFrontChunk);
        rawTextFrontChunk = rawTextFrontChunk.replace(/\/+/g, '(iterative)');  //turns interative attack slashes into the word "iterative"
        rawText = rawTextFrontChunk + rawTextBackChunk;

        //grab everything up to the first ), add it to the processed string, delete it from the rawText
        cutOffPoint = rawText.indexOf(")");
        processedChunk += rawText.slice(0, cutOffPoint+1);
        rawText = rawText.slice(cutOffPoint+1);

    } while ( conjunctions.test(rawText) ) //keeps running as long as there's "and" or "or" in the string, indicating remaining unprocessed attacks

    processedChunk = processedChunk.replace(/  +/g, ' ');  //get rid of extra whitespace
    
    return processedChunk;
}

function processHitDice(rawText) {  //extracts Hit Dice; nothing else is needed
    
    let cutOffPoint = rawText.indexOf("(") + 1; //cut off everything before the hit dice
    rawText = rawText.slice(cutOffPoint);
    cutOffPoint = rawText.indexOf("d");
    rawText = rawText.slice(0, cutOffPoint); //after this, the only thing is what's between the "("" and the "d", which is the number of hit dice

    rawText = parseInt(rawText, 10);
    
    return rawText; //returns a single integer because hit dice are simple
}

//-----CONVERT STATS TO 2E-------
//Most of these methods involve some game designer decisions on my part, like the exact point to reduce extremely high Armor Class  --Emily


function convert2eAC(AC) {  //reduces really high AC, converts to 2e descending AC
    if (AC > armorHalf) { //if AC is higher than the armorHalf constant, halve anything above it and round down; armorHalf is normally 17
      AC = Math.floor((AC-armorHalf)/2) + armorHalf;
    }
    AC = 20 - AC;
    return AC;
}

function convert2eTHAC0(HitDice) {  //calculates THAC0 according to standard rules
    //note that since there are no 3e creatures with less than one hit die, there aren't any THAC0 20 monsters to worry about
    let THAC0 = 20 - HitDice;

    if (THAC0 % 2 === 0) { //if THAC0 is even
        THAC0 = THAC0 + 1;  //rounds it up to an odd number; monsters only get odd THAC0 ratings
    };

    if (THAC0 < 5) {
        THAC0 = 5; 
        /*ensures that THAC0 can't drop below 5; the rules don't provide for lower THAC0 than that.
        Some unique monsters like the tarrasque have lower THAC0, but there's no clear rules for determining that.
        */
    };

    return THAC0;
}
