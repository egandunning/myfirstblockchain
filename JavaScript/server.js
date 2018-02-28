const express = require('express');
const bodyParser = require('body-parser');

const {Blockchain} = require('./blockchain');

const app = express();
const port = 3000;

//unique address for this node
//todo: generate random address
const nodeIdentifier = 'temporary';

const jsonParser = bodyParser.json();

let blockchain = new Blockchain();

app.get('/mine', (req, res) => {
   const lastBlock = blockchain.lastBlock();
   const proof = Blockchain.proofOfWork(lastBlock.lastProof);

   //reward miner with 1 coin, sent from address '0'
   blockchain.newTransaction('0', nodeIdentifier, 1);

   const hash = Blockchain.hash(lastBlock);
   const block = blockchain.newBlock(proof, Blockchain.hash(lastBlock));

   const responseData = {
      message: 'new block created',
      index: block.index,
      transactions: block.transactions,
      proof: block.proof,
      previousHash: block.previousHash
   }

   res.status(200).send(responseData);
});

app.get('/chain', (req, res) => {
   const chain = blockchain.chain;
   if(chain) {
      return res.status(200).send({chain});
   }
   res.status(400).send('chain not found');
});

app.post('/transactions', jsonParser, (req, res) => {
   console.log(req.body);
   res.status(200).send();
});

app.get('/nodes', (req, res) => {
   const nodes = blockchain.nodes;
   return res.status(200).send({nodes});
});

app.post('/nodes', jsonParser, (req, res) => {
   const nodes = req.body.nodes;
   
   if(!nodes || typeof nodes != 'Array') {
      return res.status(400).send('must send list of nodes to register');
   }

   nodes.forEach(node => {
      if(typeof node === 'string' && node.length > 0) {
         blockchain.addNode(node);
      }
   }

   const responseData = {
      message: 'new nodes added',
      nodeList: blockchain.nodes
   }

   res.status(200).send(responseData);
});

app.listen(port, () => {
   console.log(`listening on port ${port}`);
});
