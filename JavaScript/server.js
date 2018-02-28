const express = require('express');

const {Blockchain} = require('./blockchain');

const app = express();
const port = 3000;

//unique address for this node
//todo: generate random address
const nodeIdentifier = 'temporary';

let blockchain = new Blockchain();

app.get('/mine', async (req, res) => {
   const lastBlock = blockchain.lastBlock();
   const proof = blockchain.proofOfWork(lastBlock.lastProof);

   //reward miner with 1 coin, sent from address '0'
   blockchain.newTransaction('0', nodeIdentifier, 1);

   const hash = await Blockchain.hash(lastBlock);
   console.log(`hash(${lastBlock}) = ${hash}`);
   const block = blockchain.newBlock(proof, await Blockchain.hash(lastBlock));

   const responseData = {
      message: 'new block created',
      index: block.index,
      transactions: block.transactions,
      proof: block.proof,
      previousHash: block.previousHash
   }

   console.log('response from server:', responseData);

   res.status(200).send(responseData);
});

app.listen(port, () => {
   console.log(`listening on port ${port}`);
});
