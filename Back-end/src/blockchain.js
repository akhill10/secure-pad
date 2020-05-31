var Block = require('./block').Block; 
var calchash = require('./cauclatehash');


class Blockchain{

    constructor(id ){
        this.id = id 
        this.chain = []; 
    }

    getGenesisBlock() {
        return new Block(0, 737510400, 'Genesis block', '0', '9397591240bc3a17c0f737e72837953459df4ee23ff0ccd089af18ecaa05b991');
    }
    getlatestblock(){
        return this.chain[this.chain.length -1]; 
    }

    generate_new_block(bdata){
        this.block = this.getlatestblock(); 
        this.index = this.block.index + 1 ; 
        this.previous_hash = this.block.hash ; 
        this.timestamp = new Date().getTime(); 
        this.data = bdata ; 
        this.hash = calchash["calc_#"](this.index , this.previous_hash , this.data , this.timestamp) ; 

        return new Block(this.index , this.previous_hash , this.timestamp , this.data , this.hash); 
    }

    addBlock(block){
        if(this.isValidNewBlock(block , this.getlatestblock()))
        this.chain.push(block); 
    }

    isValidNewBlock(newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('Invalid index');
            return false;
        } else if (previousBlock.hash !== newBlock.previous_hash) {
            console.log('Invalid previous hash');
            return false;
        } else if (calchash["calc_#_block"](newBlock) !== newBlock.hash) {
            console.log('Invalid hash: ' + calchash["calc_#_block"](newBlock) + ' ' + newBlock.hash);
            return false;
        }
        return true;
    }
     replaceChain(newBlocks) {
        if (this.isValidChain(newBlocks) && newBlocks.length > this.chain.length) {
            console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
            this.chain = newBlocks;
        } else {
            console.log('Received blockchain invalid');
        }
    }

    isValidChain(targetChain){
        if (!Array.isArray(targetChain) || targetChain.length === 0) return false; 

        let prevBlock = targetChain[0];
        if (JSON.stringify(prevBlock) !== JSON.stringify(this.getGenesisBlock())) {
            return false;
        }

        for(let i = 1 ;  i < targetChain.length ; i++){
            if(this.isValidNewBlock(prevBlock , targetChain[i])) 
                return true ;

            else 
                return false ; 
        }
        return true; 
    }

}

exports.Blockchain = Blockchain;