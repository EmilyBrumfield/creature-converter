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
        rawTextFrontChunk = rawTextFrontChunk.replace(/\/+/g, "(iterative)");  //turns interative attack slashes into the word "iterative"
        rawText = rawTextFrontChunk + rawTextBackChunk;

        //grab everything up to the first ), add it to the processed string, delete it from the rawText
        cutOffPoint = rawText.indexOf(")");
        processedChunk += rawText.slice(0, cutOffPoint+1);
        rawText = rawText.slice(cutOffPoint+1);

    } while ( conjunctions.test(rawText) ) //keeps running as long as there's "and" or "or" in the string, indicating remaining unprocessed attacks

    processedChunk = processedChunk.replace(/, *\d*-\d*\/x\d*/g, ""); //get rid of critical hit ranges with multipliers
    processedChunk = processedChunk.replace(/\/\d*-\d*/g, ""); //get rid of critical hit ranges without multipliers
    processedChunk = processedChunk.replace(/\/x\d*/g, ""); //get rid of critical hit multipliers without ranges
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