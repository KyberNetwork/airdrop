var BigNumber = require('bignumber.js');

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = i;
    m_z = 987654321;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random()
{
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
}

module.exports.setSeed  = function(i) { seed(i);};

module.exports.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

////////////////////////////////////////////////////////////////////////////////

module.exports.getRandomBigInt = function() {
    var string = "0x";
    for( var i = 0 ; i < 28 ; i++ ) {
        var rand = module.exports.getRandomInt(0,256);        
        string += Number(rand).toString(16);
    }
    
    return (new BigNumber(string)).absoluteValue();
};

////////////////////////////////////////////////////////////////////////////////

module.exports.getRandomBigIntCapped = function( cap ) {
    var num = module.exports.getRandomBigInt();
    if( num.greaterThanOrEqualTo( cap ) ) {
        if( cap.eq( new BigNumber(0) ) ) return cap;
        return num.modulo(cap);
    }
    else return num.absoluteValue();
};



////////////////////////////////////////////////////////////////////////////////

module.exports.getRandomAccount = function(accounts) {
    var numAccounts = accounts.length;
    return accounts[module.exports.getRandomInt(0,numAccounts)];
};

////////////////////////////////////////////////////////////////////////////////

module.exports.getRandomDifferentAccount = function(accounts, currentAccount ) {
    if( accounts.length <= 1 ) return null;
    var result;
    do {
        result = module.exports.getRandomAccount(accounts);
    } while( result == currentAccount );
    
    return result;
};

////////////////////////////////////////////////////////////////////////////////

module.exports.sendPromise = function(method, params) {
    return new Promise(function(fulfill, reject){
        web3.currentProvider.sendAsync({
          jsonrpc: '2.0',
          method,
          params: params || [],
          id: new Date().getTime()
        }, function(err,result) {
          if (err) {
            reject(err);
          }
          else {
            fulfill(result);
          }
        });
    });
};

////////////////////////////////////////////////////////////////////////////////

module.exports.throwErrorMessage = function( error ) {
    if( error.message.search('invalid opcode') >= 0 ) return true;
    if( error.message.search('out of gas') >= 0 ) return true;    
    return false;    
};
