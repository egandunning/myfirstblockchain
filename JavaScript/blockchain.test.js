const expect = require('expect');

const {Blockchain} = require('./blockchain');

let blockchain;
beforeEach(() => {
   blockchain = new Blockchain();
});

describe('constructor()', () => {

   it('should create blockchain from constructor', () => {
      expect(blockchain.chain.length).toBe(1);
   });
});

describe('hash()', () => {
   it('should return a string', () => {
      const hash = Blockchain.hash({hello:'world'});
      expect(typeof hash).toBe('string');
   });

   it('should compute the same digest for the same input objects', () => {
      const hash1 = Blockchain.hash({hello:'world', count:1});
      const hash2 = Blockchain.hash({hello:'world', count:1});
      expect(hash1).toBe(hash2);
   });

   it('should compute different digests for different input objects', () => {
      const hash1 = Blockchain.hash({hello:'world'});
      const hash2 = Blockchain.hash({goodbye:'world'});
      expect(hash1).not.toBe(hash2);
   });
});

describe('validChain()', () => {
   it('should return false when given an invalid chain', () => {
      blockchain.newBlock(2, blockchain.lastBlock().hash);
      expect(blockchain.chain.length).toBe(2);
      expect(Blockchain.validChain(blockchain.chain)).toBe(false);
   });
});

describe('registerNode()', () => {
   it('should add a node to the list of registered nodes', () => {
      blockchain.registerNode('node1');
      blockchain.registerNode('node2');
      blockchain.registerNode('node3');
      expect(blockchain.nodes).toEqual(['node1', 'node2', 'node3']);
   });

   it('should not add duplicate nodes', () => {
      blockchain.registerNode('node');
      blockchain.registerNode('node');
      expect(blockchain.nodes).toEqual(['node']);
   });
});

describe('newTransaction()', () => {
   it('should add a transaction to the list of transactions', () => {
      blockchain.newTransaction('me', 'you', 1, {some:'data'});
      expect(blockchain.currentTransactions.length).toBe(1);
   });

   it('should add the new transactions to the newly mined block', () => {
      blockchain.newTransaction('you', 'me', 100);
      blockchain.newTransaction('me', 'you', 3, {name:'fred', volume:11});
      const lastBlock = blockchain.lastBlock();
      const proof = Blockchain.proofOfWork(lastBlock.proof);
      blockchain.newBlock(proof, lastBlock.hash);
      const txs = blockchain.lastBlock().transactions;
      expect(txs.length).toBe(2);
      expect(txs[0]).toEqual({
         sender: 'you',
         recipient: 'me',
         amount: 100,
         data: undefined
      });
      expect(txs[1]).toEqual({
         sender: 'me',
         recipient: 'you',
         amount: 3,
         data: {name:'fred', volume:11} 
      });
   });
});
