var Token = artifacts.require("./StandardToken.sol");
var BigNumber = require('bignumber.js');
var Helpers = require('./helpers.js');
var GenToken = artifacts.require("./KyberGenesisToken.sol");
var AirDrop = artifacts.require("./KyberAirDrop.sol");

var owner;
var airDropOwner;
var nonOwner;
var genToken;
var token;
var airDrop;
////////////////////////////////////////////////////////////////////////////////

contract('gen token', function(accounts) {

  beforeEach(function(done){
    done();
  });
  afterEach(function(done){
    done();
  });

  it("init token", function() {
    owner = accounts[1];
    nonOwner = accounts[2];
    return GenToken.new(accounts[1]).then(function(instance){
      genToken = instance;
    });
  });

  it("mint 3 addresses from owner", function() {
    var value = new BigNumber(1);
    return genToken.mint([accounts[0], accounts[1], accounts[2]],{from:owner}).then(function(){
      return genToken.balanceOf(accounts[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), value.valueOf(), "unexpected balance" );
      return genToken.balanceOf(accounts[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), value.valueOf(), "unexpected balance" );
      return genToken.balanceOf(accounts[2]);
    }).then(function(result){
      assert.equal(result.valueOf(), value.valueOf(), "unexpected balance" );
      return genToken.balanceOf(accounts[3]);
    }).then(function(result){
      assert.equal(result.valueOf(), (new BigNumber(0)).valueOf(), "unexpected balance" );
    });
  });

  it("mint 3 addresses from non owner", function() {
    return genToken.mint([accounts[4], accounts[5], accounts[6]],{from:nonOwner}).then(function(){
      assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });

  it("burn from holder", function() {
    return genToken.burn({from:accounts[0]}).then(function(){
      return genToken.balanceOf(accounts[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), (new BigNumber(0)).valueOf(), "unexpected balance" );
      return genToken.balanceOf(accounts[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), (new BigNumber(1)).valueOf(), "unexpected balance" );
    })
  });

  it("burn from non holder", function() {
    return genToken.burn({from:accounts[3]}).then(function(){
      assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });

  it("end minting from non owner", function() {
    return genToken.endMinting({from:nonOwner}).then(function(){
      assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });

  it("end minting from owner", function() {
    return genToken.endMinting({from:owner}).then(function(){
      return genToken.owner();
    }).then(function(result){
      assert.equal(result.valueOf(), "0x000000000000000000000000000000000000dead", "unexpected owner");
    });
  });

  it("mint 3 addresses from old owner after end of minting", function() {
    return genToken.mint([accounts[4], accounts[5], accounts[6]],{from:owner}).then(function(){
      assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });
});
