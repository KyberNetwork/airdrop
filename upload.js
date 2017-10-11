var BigNumber = require('bignumber.js');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
const ethjsaccount = require('ethjs-account');
const signer = require('ethjs-signer')

var gasLimit = new BigNumber( 100000 );



var kyberCrystalAddress = "0xdd974d5c2e2928dea5f71b9825b8b646686bd200";
var kyberMultisigWalletAddress = "0x8180a5CA4E3B94045e05A9313777955f7518D757";
var kgtAddress = "0xfCe10CBf5171dc12c215BbCCa5DD75cbAEa72506";
var airdropAddress = "0x9148AB505Fd9eaB5141b2b36Ce815E2786b7f7cd";

var request = require('request');
var sendRawTx = function( tx, nonce, callback ) {
    // Set the headers
    var headers = {
        //'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'Content-Type: application/json',
    };

    // Configure the request
    var options = {
        url: 'https://mainnet.infura.io',
        method: 'POST',
        headers: headers,
        json:true,
        body: {"jsonrpc": "2.0",'method': 'eth_sendRawTransaction', 'params': [tx], "id" : parseInt(nonce.toString(10))}
    };


    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            callback(null,body);
        }
        else {
          callback(error,null);
        }
    });
};



url = "https://mainnet.infura.io";

var web3 = new Web3(new Web3.providers.HttpProvider(url));


//var whitelistAddress = "0x9A98Fd382CC9cC54afb3352bf52A4a7427016e10";
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

function User( address, cap ) {
    this.address = address;
    this.cap = cap;
}

var addresses = [ ];
var caps = [ ];

var list = [];

////////////////////////////////////////////////////////////////////////////////

var signAndSend = function ( userPrivateKey,
                             txData,
                             destenationAddress,
                             value,
                             nonce,
                             gasLimit ) {
    return new Promise(function (fulfill, reject){
        var userAccount = privateKeyToAddress(userPrivateKey);
        console.log(nonce);
        var txParams = {
            nonce: "0x" + new BigNumber(nonce).toString(16),
            gasPrice: new BigNumber(6 * 1000 * 1000 * 1000 + 101),
            gasLimit: gasLimit,
            to: destenationAddress,
            value: "0x" + value.toString(16),
            data: txData,
            //chainId: 3
        };

        if( destenationAddress === null ) {
            delete txParams.to;
        }

        var raw = signer.sign(txParams, userPrivateKey);
        sendRawTx(raw, new BigNumber(nonce), function(err,result){
            if( err ) reject(err);
            else fulfill(result);
        });
    });
};

////////////////////////////////////////////////////////////////////////////////

var getNoncePromise = function( address ) {
    return new Promise(function(fulfill, reject){
        return web3.eth.getTransactionCount(address, function(err,result){
            if( err ) return reject(err);
            return fulfill(result);
        });
    });
};

////////////////////////////////////////////////////////////////////////////////

var uploadListBulk = function( addresses, amount, userPrivateKey, numTxs ) {
    var dropContract = airdrop;
    return new Promise(function (fulfill, reject){
       var numAddressesInTx = parseInt(addresses.length / numTxs);
       var firstIndices = [];
       for (var i = 0 ; i < numTxs ; i++ ) {
           firstIndices.push( numAddressesInTx * i );
       }


       return getNoncePromise(privateKeyToAddress(userPrivateKey)).then(function(nonce){
           return firstIndices.reduce(function (promise, item) {
            var addressInput = [];
            for( var i = 0 ; i < numAddressesInTx ; i++ ) {
                var index = i + item;
                addressInput.push(addresses[index]);
            }

            return promise.then(function () {
                var data = dropContract.methods.airDrop(kyberCrystalAddress,
                                                        kyberMultisigWalletAddress,
                                                        addressInput,
                                                        amount,
                                                        true,
                                                        kgtAddress ).encodeABI();
                return signAndSend( userPrivateKey, data, dropContract.options.address,0,nonce,/*new BigNumber(27000 * 3).mul(addressInput.length+1)*/ new BigNumber(4*550 * 1000) );
            }).then(function(result){
                nonce = nonce + 1;
                console.log(result);
            });
            }, Promise.resolve()).then(function(){fulfill(true);}).catch(function(error){console.log(error);});
        });
    }).catch(function(error){
        console.log(error);
        reject(error);
    });
};


////////////////////////////////////////////////////////////////////////////////

var privateKeyToAddress = function( privateKey ) {
    return ethjsaccount.privateToAccount(privateKey).address;
};

////////////////////////////////////////////////////////////////////////////////

var getPrivateKey = function( password, salt ) {
    var key = web3.utils.sha3(password + salt);
    return key;
};

////////////////////////////////////////////////////////////////////////////////


var key = getPrivateKey( "put your key",
                         "here" );

var amount = new BigNumber(2).mul(10**18);

var addresses = [];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('upload.txt')
});

lineReader.on('line', function (line) {
  var re = /0x([a-f]|[A-F]|[0-9])*/
  var input = line.match(re)[0];
  var address = web3.utils.toChecksumAddress( input );
  addresses.push( address );
});

lineReader.on('close', function () {
  return uploadListBulk( addresses, amount, key, addresses.length / 8 );
});
