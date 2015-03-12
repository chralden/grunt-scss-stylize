/*
 * 
 * 
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';



module.exports = function(sassObject) {

    var sassString = "";

    function traverse(object) {
        for (var i in object) {
            
            if (object[i] !== null && typeof(object[i])=="object") {
                traverse(object[i]);
            }else{

                sassString += i + ": " + object[i] + ";";
            }
        }
    }

    traverse(sassObject);
    //console.log(sassString);
    
};
