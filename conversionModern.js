//simple d20 Modern converter using some of the previous tools
//no reason to split this off right now since this is a personal project anyway

function convertModern(newString, edition) {
    //newString should be the modern text as raw

    newString = sanitize(newString);
    //newString = eraseRegex(newString, /CR *\d*;* */);
    //newString = eraseRegex(newString, /Mas *\d*-*;* */);
    newString = eraseRegex(newString, /CR [^;]*; */);
    newString = eraseRegex(newString, /Mas [^;]*; */);
    newString = eraseRegex(newString, /Init [^;]*; */);
    newString = eraseRegex(newString, /, *touch [^;]*/);
    newString = eraseRegex(newString, /BAB [^;]*; */);
    newString = eraseRegex(newString, /Grap [^;]*; */);
    newString = eraseRegex(newString, /; *Atk[^;]*/);
    newString = eraseRegex(newString, /FS[^;]*; */);
    newString = eraseRegex(newString, /Reach \d*[^;]*; */);
    newString = eraseRegex(newString, /AL [^;]*; */);
    newString = eraseRegex(newString, /SV [^;]*; */);
    newString = eraseRegex(newString, /AP 0; */); //only deletes AP if zero
    newString = eraseRegex(newString, /Rep [^;]*; */);
    newString = eraseRegex(newString, /Skills:[^.]*./);
    newString = eraseRegex(newString, /Feats:[^.]*./);
    newString = eraseRegex(newString, /Advancement:[^.]*./);
    newString = changeRegex(newString, /ft\./, "ft");
    newString = changeRegex(newString, /Full Atk/, "Attack");
    newString = changeRegex(newString, /HD/, "Hit Dice");
    
    //newString = changeRegex(newString, /hp/, "Hit Points");
    if (/hp/.test(newString)) {
        let hitPointString = newString.slice(newString.indexOf("hp"));
        hitPointString = hitPointString.slice(0, hitPointString.indexOf(";"));
        console.log(hitPointString);
        newString = changeRegex(newString, /; hp[^;]*; */, " (" + hitPointString + "); ");
    }

    newString = changeRegex(newString, /Spd/, "Speed");
    newString = changeRegex(newString, /Defense/, "Armor Class");
    newString = eraseRegex(newString, /\./);
    newString = changeRegex(newString, /; /, "\n");
    newString = changeRegex(newString, /\n\n/, "\n");



    return newString;

}

function eraseRegex(rawText, targetRegex) { //erases all instances of a particular Regex in a text sample
    let numberLoops = 0;
    while (numberLoops < 1001 & targetRegex.test(rawText)) {
        rawText = rawText.replace(targetRegex, "")
        numberLoops += 1;
        
        if (numberLoops === 1000){
            alert("Looped 1000 times without finishing. Moving to next step to prevent infinite loop. Conversion may be incomplete.")
        }

    }

    return rawText;

}

function changeRegex(rawText, targetRegex, newText) { //replaces all instances of a particular Regex in a text sample

    let numberLoops = 0;
    while (numberLoops < 1001 & targetRegex.test(rawText)) {
        rawText = rawText.replace(targetRegex, newText)
        numberLoops += 1;

        if (numberLoops === 1000){
            alert("Looped 1000 times without finishing. Moving to next step to prevent infinite loop. Conversion may be incomplete.")
        }
    }

    return rawText;
}