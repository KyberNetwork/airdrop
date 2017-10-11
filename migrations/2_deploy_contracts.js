var BigNumber = require('bignumber.js');
var GenToken = artifacts.require("./KyberGenesisToken.sol");
var AirDrop = artifacts.require("./KyberAirDrop.sol");

var dropper = "0xcBAC9e86E0B7160F1a8E4835ad01Dd51c514afce";


module.exports = function(deployer) {
  return AirDrop.new(dropper,{gas:500*1000,gasPrice:41*1000*1000*1000}).then(function(instance){
    console.log(instance.address);
    return GenToken.new(instance.address,{gas:4000000,gasPrice:61*1000*1000*1000});
  });
};

//00000000000000000000cBAC9e86E0B7160F1a8E4835ad01Dd51c514afce
