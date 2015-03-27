//Check if is numeric, + so that '' is considered 0, and parseInt to capture leading numbers e.g. '12px'
var isNumeric = function(string) {
    return (!isNaN(+string) || !isNaN(parseInt(string, 10)));
};

//Clean leading and trailing zeros on decimals
var normalizeDecimals = function(valstring) {
    var decimal = valstring, 
        parts; 

    if(valstring.indexOf('.') !== -1){
        
        parts = valstring.split('.');

        if(isNumeric(parts[0]) && isNumeric(parts[1])){
           if(parts[0] === ''){

               if(parseInt(parts[1], 10) > 0){
                   decimal = "0."+parts[1];
               }else{
                   decimal = "0";
               }

           }else if(parseInt(parts[1], 10) === 0){
              decimal = parseInt(parts[0]) + parts[1].replace(new RegExp(parseInt(parts[1]), 'g'), "");
           } else {
              decimal = parseInt(parts[0]) + "." + parts[1];
           } 
        }
    }

    return decimal;
};

//Normalize style values based on options
module.exports = function normalize(value, options) {

    if(options.cleanDecimals) value = normalizeDecimals(value);

    return value;
};