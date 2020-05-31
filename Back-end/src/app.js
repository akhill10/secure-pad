
const app = require('express')
const http = require('http').Server(app)
const io = require('socket.io')(http)
var Block = require('./block').Block; 

const blockchain = require('./blockchain').Blockchain; 


const documents = {}
const clients =  {}
const client_details = {}

const list_of_blockchains =  {} ; 
 
const MessageTypes ={
    query_latest : 0 , 
    query_all : 1 , 
    response_blockchain : 2 
}

// var list_ = new blockchain();

// let genesis_block = block_chain.getGenesisBlock(); 
// block_chain.chain.push(genesis_block); 


console.log("Latest Block :" ,block_chain.getlatestblock()); 

console.log('Genesis Block Generated  : ', block_chain.chain); 

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
  };

io.on('connection', socket_of_user=>{ // socket for user. 
    let previousId ; 
    let userId = getUniqueID(); 
    console.log('New user Entered!' , userId);
    io.emit('new_user',userId); 
    client_details["active"] = []; 
    clients[userId] =  client_details ;  
    console.log(clients); 

    const safejoin = currentId =>{
        socket_of_user.leave(previousId)    
   
        const  index = clients[userId]['active'].indexOf(previousId);   // Removing the person from active Clients of the respective Document
        if (index > -1) {
            clients[userId]['active'].splice(index, 1);}
   
   
        socket_of_user.join(currentId)
        previousId = currentId
    }
    
socket_of_user.on("getDoc", docId =>{ 
    safejoin(docId); 
    socket_of_user.emit("document",documents[docId]);
}); 

socket_of_user.on("addDoc", doc =>{
    clients[userId]['active'].push(doc.id)
    console.log(clients);
    console.log("This is the document",doc); 
    documents[doc.id] = doc ; 
    safejoin(doc.id);
    list_of_blockchains[doc.id] = []; 

    list_of_blockchains[doc.id] = new blockchain(doc.id); 
    var genesis_block = list_of_blockchains[doc.id].getGenesisBlock(); 
    list_of_blockchains[doc.id].chain.push(genesis_block); 


    io.emit("documents", Object.keys(documents));
    socket_of_user.emit("document", doc); 
})

socket_of_user.on("editDoc", doc =>{
    documents[doc.id] = doc ; 
    // Generated Block 
    // const new_block = block_chain.generate_new_block(doc); 

    // console.log('New Block: ' , new_block); 

    const new_block = list_of_blockchains[doc.id].generate_new_block(doc) ; 

    console.log('New Block : ' , new_block); 


    if(list_of_blockchains[doc.id].isValidNewBlock(new_block , list_of_blockchains[doc.id].getlatestblock()))
        list_of_blockchains[doc.id].chain.push(new_block); 

    console.log(JSON.stringifyz(list_of_blockchains[doc.id].chain))

    // if(block_chain.isValidNewBlock(new_block , block_chain.getlatestblock() ))
    // block_chain.chain.push(new_block);

    // console.log(JSON.stringify(block_chain.chain))  ;
    socket_of_user.to(doc.id).emit("document", doc); 
     
})

io.emit("documents", Object.keys(documents)); // emiting for everyone
io.emit("clients", Object.keys(clients)); 

io.emit('blockchain' , JSON.stringify(list_of_blockchains));                                 

})
http.listen(4444);
console.log('Listing to port 4444');


