import hashlib
import json
import requests

from urllib.parse import urlparse
from time import time


class Blockchain(object):

   def __init__(self):
      self.chain = []
      self.current_transactions = []

      #create new block
      self.new_block(previous_hash = 1, proof = 100)

      self.nodes = set()

   def new_block(self, proof, previous_hash = None):
      '''
      Creates a new block and adds it to the blockchain
   
      :param proof: <int> The proof given by the proof of work algorithm
      :param previous_hash: (Optional) <str> Hash of previous block
      :return: <dict> New block
      '''
      block = {
         'index': len(self.chain) + 1,
         'timestamp': time(),
         'transactions': self.current_transactions,
         'proof': proof,
         'previous_hash': previous_hash or self.hash(self.chain[-1])
      }

      self.current_transactions = []

      self.chain.append(block)
      return block

   def register_node(self, address):
      '''
      Add a node to the list of nodes

      :param address: <str> Address of node.
      :return: none
      '''

      parsed_url = urlparse(address)
      self.nodes.add(parsed_url.netloc)

   def valid_chain(self, chain):
      '''
      Determine if a given blockchain is valid.

      :param chain: <list> A blockchain
      :return: <bool> True if valid, false if invalid
      '''

      current_block = chain[0]
      previous_block = chain[0]
      index = 1

      #Iterate over entire chain
      while index < len(chain):

         current_block = chain[index]

         logger.info(f'Validating block {index} of {len(chain)}')

         #Check if current block's stored hash matches actual value

         if current_block['previous_hash'] != self.hash(previous_block):
            return False

         temp1 = previous_block['proof']
         temp2 = current_block['proof']

         #Check if proof of work is correct
         if not self.valid_proof(previous_block['proof'], current_block['proof']):
            return False

         #Set the current block for the next iteration, increment index
         previous_block = chain[index]
         index += 1

      #All blocks were valid.
      return True


   def resolve_conflicts(self):
      '''
      Consensus algorithm, resolves conflicts by replacing our chain with
      the longest chain on the network.

      :return: <bool> True if our chain was replaced, false if not.
      '''

      neighbors = self.nodes
      new_chain = None

      #Check if any chain is longer than this one
      max_length = len(self.chain)

      #Verify and check length of each chain in network
      for node in neighbors:
         response = requests.get(f'http://{node}/chain')
         logger.info(f'received response from http://{node}/chain with code {response.status_code}')
         if response.status_code == 200:
            responseObj = response.json()
            length = responseObj['length']
            chain = responseObj['chain']

            logger.info(f'discovered chain with length {length}')

            #Check if chain is longer than this one, and is valid
            if length > max_length and self.valid_chain(chain):
               max_length = length
               new_chain = chain

      #If a new, longer chain was found, update and return true
      if new_chain:
         self.chain = new_chain
         return True

      return False

   def new_transaction(self, sender, recipient, amount):
      '''
      Creates a new transaction to go into the next mined block

      :param sender: <str> Address of the sender
      :param recipient: <str> Address of the recipient
      :param amount: <str> Amount
      :return: <int> The index of the block that will hold this transaction
      '''
      
      self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount
         })

      return self.last_block['index'] + 1

   @staticmethod
   def hash(block):
      '''
      Hashes a block using SHA-256

      :param block: <dict> Block
      :return: <str>
      '''
      
      #make sure dictionary is ordered to ensure consistent hashes
      block_string = json.dumps(block, sort_keys=True).encode()
      return hashlib.sha256(block_string).hexdigest()

   @property
   def last_block(self):
      '''returns the last block in the chain'''
      return self.chain[-1]

   def proof_of_work(self, last_proof):
      '''
      Simple proof of work algorithm:
      -find p' such that hash(pp') contains 4 leading zeroes where p is the
      previous p'.
      -p is the previous proof, and p' is the new proof.

      :param last_proof: <int> The previous proof
      :return: <int>
      '''

      proof = 0

      while self.valid_proof(last_proof, proof) is False:
         proof += 1

      return proof

   @staticmethod
   def valid_proof(last_proof, proof):
      '''
      Validates the proof: does hash(last_proof, proof) have 4 leading zeroes?

      :param last_proof: <int> Previous proof
      :param proof: <int> Current proof
      :return: <bool> True if valid proof.
      '''

      guess = f'{last_proof}{proof}'.encode()
      guess_hash = hashlib.sha256(guess).hexdigest()
      return guess_hash[0:4] == '0000'