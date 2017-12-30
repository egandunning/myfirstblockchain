import json

from blockchain import Blockchain
from textwrap import dedent
from uuid import uuid4
from flask import Flask, jsonify, request

#Instantiate node
app = Flask(__name__)

#Generate unique address for node
node_identifier = str(uuid4()).replace('-', '')

blockchain = Blockchain()

@app.route('/mine', methods=['GET'])
def mine():
    '''
    Mine a new block using proof of work algorithm.
    '''

    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)

    #Receive reward for finding proof (1 coin)
    #Sender = 0 signifies new coin has been mined by sender.
    blockchain.new_transaction(sender='0', recipient=node_identifier, amount=1)

    #add new block to the chain.
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)

    response = {
        'message': "New block forged!",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash']
    }

    return jsonify(response), 200


@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    '''
    Create a new transaction.
    '''
    values = request.get_json()

    #Check required fields are in POST request
    required = ['sender', 'recipient', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 400

    #Create new transaction
    index = blockchain.new_transaction(values['sender'], values['recipient'],
        values['amount'])

    response = {'message': f'Transaction will be added to block{index}'}
    return jsonify(response), 201

@app.route('/chain', methods=['GET'])
def full_chain():
    '''
    returns the entire blockchain.
    '''
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    }

    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)