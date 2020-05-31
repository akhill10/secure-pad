class Block {
    constructor(index , previous_hash , timestamp , data , hash){
        this.index = index ;
        this.previous_hash = previous_hash ; 
        this.timestamp = timestamp ; 
        this.data = data ; 
        this.hash = hash ;  
    }
} 

exports.Block = Block ;