const expect = require('expect');

const {Blockchain} = require('./blockchain');

let blockchain;
beforeEach(() => {
   blockchain = new Blockchain();
});

describe('validChain()', () => {
   it('should create a long, valid chain', () => {
      let lastBlock;
      let proof;
      let i = 0;
      for(i; i < 100; i++) {
         lastBlock = blockchain.lastBlock();
         proof = Blockchain.proofOfWork(lastBlock.proof);
         blockchain.newBlock(proof, lastBlock.hash);
      }
      expect(blockchain.chain.length).toBe(101);
      expect(Blockchain.validChain(blockchain.chain)).toBe(true);
   }).timeout(20000);
});

describe('proofOfWork()', () => {
   it('should compute valid proofs', () => {
      let proof;
      let valid = true;
      for(let i = 0; i < 100; i++) {
         proof = Blockchain.proofOfWork(i);
         valid = valid && Blockchain.validProof(i, proof);
      }
      expect(valid).toBe(true);
   }).timeout(20000);
});
