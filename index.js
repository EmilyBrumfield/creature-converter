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

function addFireGiant() {

let fireGiantString = "This lumbering giant has short stumpy legs and powerful, muscular arms. Its hair and beard seem to be made of fire.\n\
\n\
Fire Giant CR 10\n\
\n\
XP 9,600\n\
LE Large humanoid (fire, giant)\n\
Init –1; Senses low-light vision; Perception +14\n\
\n\
DEFENSE\n\
\n\
AC 24, touch 8, flat-footed 24 (+8 armor, –1 Dex, +8 natural, –1 size)\n\
hp 142 (15d8+75)\n\
Fort +14, Ref +4, Will +9\n\
Defensive Abilities rock catching; Immune fire\n\
Weaknesses vulnerability to cold\n\
\n\
OFFENSE\n\
\n\
Speed 40 ft. (30 ft. in armor)\n\
Melee greatsword +21/+16/+11 (3d6+15) or 2 slams +20 (1d8+10)\n\
Ranged rock +10 (1d8+15 plus 1d6 fire)\n\
Space 10 ft.; Reach 10 ft.\n\
Special Attacks heated rock, rock throwing (120 ft.)\n\
\n\
STATISTICS\n\
\n\
Str 31, Dex 9, Con 21, Int 10, Wis 14, Cha 10\n\
Base Atk +11; CMB +22; CMD 31\n\
Feats Cleave, Great Cleave, Improved Overrun, Improved Sunder, Iron Will, Martial Weapon Proficiency (greatsword), Power Attack, Weapon Focus (greatsword)\n\
Skills Climb +14, Craft (any one) +8, Intimidate +11, Perception +14\n\
Languages Common, Giant\n\
\n\
SPECIAL ABILITIES\n\
Heated Rock (Su)\n\
\n\
Fire giants transfer the heat of their bodies to rocks as part of an attack action when they throw rocks. A heated rock deals 1d6 points of additional fire damage on a hit.\n\
"

    document.getElementById(inputBox).value = fireGiantString;
}