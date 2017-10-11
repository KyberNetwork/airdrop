var BigNumber = require('bignumber.js');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
const ethjsaccount = require('ethjs-account');
const signer = require('ethjs-signer')

var gasLimit = new BigNumber( 100000 );
var airdropAddress = "0x9148AB505Fd9eaB5141b2b36Ce815E2786b7f7cd";


url = "http://localhost:8545/jsonrpc";

var web3 = new Web3(new Web3.providers.HttpProvider(url));


var airdropABI =[
  {
    "constant": true,
    "inputs": [],
    "name": "dropAmount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "tokenRepo",
        "type": "address"
      },
      {
        "name": "recipients",
        "type": "address[]"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "kgt",
        "type": "bool"
      },
      {
        "name": "kgtToken",
        "type": "address"
      }
    ],
    "name": "airDrop",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numDrops",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "kgtToken",
        "type": "address"
      },
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "tranferMinterOwnership",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "dropper",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TokenDrop",
    "type": "event"
  }
];



var airdrop = new web3.eth.Contract(airdropABI,airdropAddress);
airdrop.getPastEvents('TokenDrop', {
    fromBlock: 0,
    toBlock: 'latest'
}, function(error, events){
  for ( var i = 0 ; i < events.length ; i++ ) {
      console.log(events[i].returnValues.receiver);
  }
});
