//TODO:
// Make the code do something when there's no stat block
// Make the code less messy
// Fix processHitDice so it handles the urdefhan and other misformatted stats
// Fix processAttack so that it can do actual mathematic conversions

//This is a cleaner, more elegant, and less powerful alternate to my other stat block processor.
//It replaces parts of the text input rather than completely rewriting it.
//It has more tolerance for irregularities in stat blocks, but fewer options for formatting.

//Currently split into multiple scripts for ease of use; will eventually combine them with webpack or some other method


const INPUTBOX = "input-box";  //the name of the input textarea; paste a monster here from a compatible source
const OUTPUTBOX = "output-box";  //the name of the output textarea
const DELETEABILITIES = true; //determines whether convert2e will delete ability scores
const DELETEHEADINGS = false; //determines whether convert2e will delete blank lines and section headings
const ARMORHALF = 17; //any Armor Class points over this amount are halved and rounded down; used for converting AC from PF/3e to 2e
const ATTACKMAX5E = 12;
const ARMORMAX5E = 22;
const CONVERSIONDIESIZE = 10; //the default die size when converting an average result to dice notation

//----STRING FUNCTIONS
//----Various functions to get text from the input, split it up into arrays, search it for particular information

function test2e() {
    //creates newArray by grabbing text from the input textarea and splitting it
    //splitting the text into an array makes it much easier to work with

    let newArray = splitText(INPUTBOX);
    newArray = convert2e(newArray, "2e");

    mergeText(newArray); //joins the array back into a string and sends the results to the output textarea
}

function test5e() {
    //creates newArray by grabbing text from the input textarea and splitting it
    //splitting the text into an array makes it much easier to work with

    let newArray = splitText(INPUTBOX);
    newArray = convert2e(newArray, "5e");
    makeDice(0.5);
    makeDice(1);
    makeDice(4.5);
    makeDice(1.7);
    makeDice(2.5);
    makeDice(2.0);
    makeDice(3.5);
    makeDice(5);
    makeDice(10.5);
    makeDice(14);
    makeDice(18);
    mergeText(newArray); //joins the array back into a string and sends the results to the output textarea
}

function testModern() {
    //creates newArray by grabbing text from the input textarea and splitting it
    //splitting the text into an array makes it much easier to work with

    let newString = document.getElementById(INPUTBOX).value;
    newString = convertModern(newString, "2e");

    document.getElementById(OUTPUTBOX).value = newString;
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

    document.getElementById(INPUTBOX).value = fireGiantString;
}

function addAshWraith() {

let ashWraithString = "Ash Wraith: CR 6; Medium undead; HD 6d12; hp 39; Mas —; Init +7 (+3 Dex, +4 Improved Initiative); Spd 30 ft., fly 60 ft. (good); Defense 15, touch 15, flat-footed 12 (+3 Dex, +2 deflection); BAB +3; Grap +3; Atk +6 melee (3d6 fire, burning touch); Full Atk +6 melee (3d6 fire, burning touch); FS 5 ft. by 5 ft.; Reach 5 ft.; SQ undead, incorporeal, burning touch, spawn, unnatural aura, fear of daylight; AL evil; SV Fort +2, Ref +5, Will +7; AP 0; Rep +0; Str —, Dex 16, Con —, Int 14, Wis 14, Cha 15.\n\
Skills: Hide +12, Intimidate +11, Listen +13, Read/Write\n\
Language (up to any three), Search +9, Sense Motive +11,\n\
Speak Language (up to any three), Spot +13.\n\
Feats: Alertness, Blind-Fight, Combat Reflexes, Improved\n\
Initiative.\n\
Possessions: None.\n\
Advancement: 7–12 HD (Medium).\n\
"

    document.getElementById(INPUTBOX).value = ashWraithString;
}