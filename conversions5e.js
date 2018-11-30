//-----CONVERT STATS TO 5e------

function convert5eAC(AC) {  //converts AC to 5e
    //The official conversion document 1.0 suggests either making Armor Class "20% lower" or averaging flat-footed and normal Armor Class
    //There's also the option of converting to 2e by my method, then converting to 5e.
    //I'm not sure which one is best. Currently, I'm going to convert it to 2e standards, then convert to 5e.
    if (AC > armorHalf) { //if AC is higher than the armorHalf constant, halve anything above it and round down; armorHalf is normally 17
      AC = Math.floor((AC-armorHalf)/2) + armorHalf;
    }
    AC = AC - 1;
    return AC;
}

//---MAIN CONVERSION FUNCTION-----

function convert5e(newArray) {
    //takes a string array, converts stats from Pathfinder to D&D 5e rules, returns the result
    //much of this is simple RegExp-based deletion of unnecessary stats, but there's some conversions as well

    //STEP ONE: Remove unnecessary text
    //currently repeating myself; will use functions later

    //DELETE CHALLENGE RATING (doesn't match 5e trait by the same name)
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

    //DELETE INITIATIVE (doesn't match 5e trait)
    if (ifExists("Init", newArray)) {
        let targetLine = getStats("Init",  newArray);
        let targetIndex = findLine("Init", newArray);
        targetLine = targetLine.replace(/ *Init *[+-]\d* *;* */g, "");  //deletes init, the following number, and any spaces nearby
        newArray[targetIndex] = targetLine;
    }

    //DELETE PERCEPTION (doesn't match 5e trait; might be converted somehow later)
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

    //DELETE FEAT LINE ENTIRELY (don't match 5e, most monsters don't have 5e feats)
    if (ifExists("Feats", newArray)) {
        let targetIndex = findLine("Feats", newArray);
        newArray.splice(targetIndex, 1);
    }

    //DELETE SKILL LINE ENTIRELY (don't match 5e skills, might have an optional suggested conversion later)
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
    //nothing here yet; ability scores shouldn't be deleted for 5e monsters

    
    //STEP THREE: CONVERSIONS 

    if (ifExists("AC", newArray)) {
        let targetIndex = findLine("AC", newArray);
        let targetLine = getStats("AC", newArray)
        
        let Armor = processAC(targetLine); //grabs hit dice as an integer

        targetLine = "Armor Class " + convert5eAC(Armor.AC);
        newArray[targetIndex] = targetLine;
    }

    //leaving hit points mostly alone right now
    if (ifExists("hp", newArray)) {
        let targetIndex = findLine("hp", newArray);
        let targetLine = getStats("hp", newArray);
        targetLine = targetLine.replace("hp", "Hit Points");
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
