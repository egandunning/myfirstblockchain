import hashlib
import json

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