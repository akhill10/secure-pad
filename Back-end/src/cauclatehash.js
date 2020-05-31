var CryptoJS = require('crypto-js')

var calculatehash = function (index , previous_hash , data , timestamp ){
    return CryptoJS.SHA256(index + previous_hash + data + timestamp).toString(); 
}

var calculatehash_block = (block) =>{
    return  calculatehash(block.index , block.previous_hash , block.data , block.timestamp); 
}

module.exports  = { 'calc_#'  : calculatehash ,  'calc_#_block' : calculatehash_block }