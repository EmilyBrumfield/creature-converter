
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

//---MAIN CONVERSION FUNCTION---

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

    //DELETE DIFFICULTY CLASS
    //deletes anything referencing DCs
    while (ifExists("DC", newArray)) {
        let targetLine = getStats("DC",  newArray);
        let targetIndex = findLine("DC", newArray);
        targetLine = targetLine.replace(/ *The save DC is *[\w|-]*\.* */g, " ") ////completely replaces save DC sentences with a space
        targetLine = targetLine.replace(/ *\, *DC *\d* */g, ""); //completely deletes anything with format: ,DC 17
        targetLine = targetLine.replace(/ *\(* *DC *\d* *\)* */g, ""); //completely deletes anything with format: (DC 17)
        targetLine = targetLine.replace(/ *DC *\d* */g, " "); //completely replaces anything with format: DC 17; replaces with a single space
        newArray[targetIndex] = targetLine;
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

