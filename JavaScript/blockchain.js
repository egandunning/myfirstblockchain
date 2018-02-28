'use strict';
const requests = require('requests');
const crypto = require('crypto');

class Blockchain {

   constructor() {
      this.chain = [];
      this.currentTransactions = [];

      this.newBlock(1, 100);
      this.nodes = [];
   }

   newBlock(proof, previousHash) {
      
      let hash;
      try {
         hash = Blockchain.hash(this.lastBlock());
      } catch (e) {
         console.log('Error hashing block:', e);
         return;
      }

      const block = {
         index: this.chain.length,
         timestamp: new Date(),
         transactions: this.currentTransactions,
         proof,
         previousHash: previousHash || hash
      }

      // clear pending transactions
      this.currentTransactions = [];

      this.chain.push(block);
      return block;
   }

   /**
    * Add a node to the list of nodes (other computers running this program).
    * Nodes must be unique.
    */
   registerNode(address) {
      if(this.nodes.indexOf(address) === -1) {
         this.nodes.push(address);
      }
   }

   /**
    * Hashes a block using SHA512.
    * @param{Object} block - A block on the chain.
    * @returns{string} Return the value of the hashed block.
    */
   static hash(block) {
      
      const hash = crypto.createHash('sha512');
      hash.update(JSON.stringify(block || {}));
      return hash.digest('hex');
   }

   /**
    * Checks if a chain is valid: each block must have a valid hash and a
    * valid proof of work.
    * @param{Array} chain - The chain to validate.
    */
   static validChain(chain) {
      let currentBlock = chain[0];
      let previousBlock = chain[0];
      let index = 1;

      while(index < chain.length) {
         currentBlock = chain[index];

         if(currentBlock.previousHash != Blockchain.hash(previousBlock)) {
            return false;
         }

         let temp1 = previousBlock.proof;
         let temp2 = currentBlock.proof;

         if(!this.validProof(previousBlock.proof, currentBlock.proof)) {
            return false;
         }

         previousBlock = chain[index];
         index++;
      }

      return true;
   }

   resolveConflicts() {
      const neighbors = this.nodes;
      let newChain;

      let maxLength = this.chain.length;
      
      neighbors.foreach(node => {
         //todo: send request
         //let response = requests.get(`${node}/chain`);
         //todo: process response
      });

      if(newChain) {
         this.chain = newChain;
         return true;
      }

      return false;
   }

   /**
    * Add a new transaction to the next block.
    * @param{string} sender - The node that is sending coins in the current
    * transaction.
    * @param{string} recipient - The node that is receiving coins in the
    * current transaction.
    * @param{number} amount - The amount of coins being transferred.
    * @param data{Object} - The data added on to the transaction.
    * @returns{number} The index of the block that this transaction will be
    * added to.
    */
   newTransaction(sender, recipient, amount, data) {
      this.currentTransactions.push({
         sender,
         recipient,
         amount,
         data
      });

      return this.lastBlock.index + 1;
   }

   /**
    * Returns the last block in the chain.
    * @returns{Object | undefined} The last block in the chain, or undefined,
    * if the chain has no blocks yet.
    */
   lastBlock() {
      return this.chain[this.chain.length - 1];
   }

   /**
    * Computes the proof-of-work, given the previous proof. Counts up from zero
    * looking for a number that satisfies: hash(lastProof|proof).substring(0,4)
    * =='0000's
    * @param{number} lastProof - The proof of work for the previous block.
    * @returns{number} The proof of work to be used in the next block. Proves
    * that the block was mined.
    */
   static proofOfWork(lastProof) {
      let proof = 0;
      while(!Blockchain.validProof(lastProof, proof)) {
         proof++;
      }
      return proof;
   }

   /**
    * Checks if a proof-of-work is valid (hash has four leading zeroes).
    * @param{number} lastProof - The last proof-of-work.
    * @param{number} proof - The current proof-of-work.
    * @returns{boolean} Return true if the first four characters of the hash
    * of concatenate(lastProof, proof) is "0000".
    */
   static validProof(lastProof, proof) {
      let guess = `${lastProof}${proof}`;

      //compute hash of guess
      const hash = crypto.createHash('sha512');
      hash.update(guess);
      const digest = hash.digest('hex');

      return digest.substring(0,4) === '0000';
   }
}

module.exports = {Blockchain};
