//TODO:
// Make the code less messy
// Fix processHitDice so it handles the urdefhan and other misformatted stats
// Fix processAttack so that it can do actual mathematic conversions

//This is a cleaner, more elegant, and less powerful alternate to my other stat block processor.
//It replaces parts of the text input rather than completely rewriting it.
//It has more tolerance for irregularities in stat blocks, but fewer options for formatting.

//Currently split into multiple scripts for ease of use; will eventually combine them with webpack or some other method


const inputBox = "input-box";  //the name of the input textarea; paste a monster here from a compatible source
const outputBox = "output-box";  //the name of the output textarea
const deleteAbilities = true; //determines whether convert2e will delete ability scores
const armorHalf = 17; //any Armor Class points over this amount are halved and rounded down; used for converting AC from PF/3e to 2e

//----STRING FUNCTIONS
//----Various functions to get text from the input, split it up into arrays, search it for particular information

function test2e() {
    //creates newArray by grabbing text from the input textarea and splitting it
    //splitting the text into an array makes it much easier to work with

    let newArray = splitText(inputBox);
    newArray = convert2e(newArray);

    mergeText(newArray); //joins the array back into a string and sends the results to the output textarea
}

function test5e() {
    //creates newArray by grabbing text from the input textarea and splitting it
    //splitting the text into an array makes it much easier to work with

    let newArray = splitText(inputBox);
    newArray = convert5e(newArray);

    mergeText(newArray); //joins the array back into a string and sends the results to the output textarea
}