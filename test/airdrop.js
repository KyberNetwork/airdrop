var Token = artifacts.require("./StandardToken.sol");
var BigNumber = require('bignumber.js');
var Helpers = require('./helpers.js');
var GenToken = artifacts.require("./KyberGenesisToken.sol");
var AirDrop = artifacts.require("./KyberAirDrop.sol");

var tokenOwner;
var airDropOwner;
var nonOwner;
var genToken;
var token;
var airDrop;

var expectedBalance;
////////////////////////////////////////////////////////////////////////////////

contract('gen token', function(accounts) {

  beforeEach(function(done){
    done();
  });
  afterEach(function(done){
    done();
  });

  it("init token", function() {
    tokenOwner = accounts[0];
    return Token.new({from:tokenOwner}).then(function(instance){
      token = instance;
      return token.balanceOf(tokenOwner);
    }).then(function(result){
      expectedBalance = new BigNumber(result);
    });
  });

  it("init airdrop", function() {
    airDropOwner = accounts[1];
    nonOwner = accounts[2];
    return AirDrop.new({from:airDropOwner}).then(function(instance){
      airDrop = instance;
      return token.approve(airDrop.address, new BigNumber(10).pow(50));
    });
  });

  it("init gen token", function() {
    return GenToken.new(airDrop.address).then(function(instance){
      genToken = instance;
    });
  });

  it("drop gen and 2 knc", function() {
    var recipients = [accounts[3], accounts[4]];
    var amount = new BigNumber(10**18 * 2);
    expectedBalance = expectedBalance.minus(amount*2);
    return airDrop.airDrop(token.address,
                           tokenOwner,
                           recipients,
                           amount,
                           true,
                           genToken.address,
                           {from:airDropOwner}).then(function(){
       // check balance of original token
       return token.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return token.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(1).valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(1).valueOf(), "unexpected result");
      return token.balanceOf(tokenOwner);
    }).then(function(result){
      assert.equal(result.valueOf(), expectedBalance.valueOf(), "unexpected balance");
    });
  });

  it("drop gen and 5 knc", function() {
    var recipients = [accounts[5], accounts[6]];
    var amount = new BigNumber(10**18 * 5);
    expectedBalance = expectedBalance.minus(amount*2);
    return airDrop.airDrop(token.address,
                           tokenOwner,
                           recipients,
                           amount,
                           true,
                           genToken.address,
                           {from:airDropOwner}).then(function(){
       // check balance of original token
       return token.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return token.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(1).valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(1).valueOf(), "unexpected result");
      return token.balanceOf(tokenOwner);
    }).then(function(result){
      assert.equal(result.valueOf(), expectedBalance.valueOf(), "unexpected balance");
    });
  });

  it("drop 0 gen and 5 knc", function() {
    var recipients = [accounts[7], accounts[8]];
    var amount = new BigNumber(10**18 * 5);
    expectedBalance = expectedBalance.minus(amount*2);
    return airDrop.airDrop(token.address,
                           tokenOwner,
                           recipients,
                           amount,
                           false,
                           genToken.address,
                           {from:airDropOwner}).then(function(){
       // check balance of original token
       return token.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return token.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(0).valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(0).valueOf(), "unexpected result");
      return token.balanceOf(tokenOwner);
    }).then(function(result){
      assert.equal(result.valueOf(), expectedBalance.valueOf(), "unexpected balance");
    });
  });

  it("drop 1 gen and 0 knc", function() {
    var recipients = [accounts[1], accounts[2]];
    var amount = new BigNumber(0);
    expectedBalance = expectedBalance.minus(amount*2);
    return airDrop.airDrop(token.address,
                           tokenOwner,
                           recipients,
                           amount,
                           false,
                           genToken.address,
                           {from:airDropOwner}).then(function(){
       // check balance of original token
       return token.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return token.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), amount.valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[0]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(0).valueOf(), "unexpected result");
      return genToken.balanceOf(recipients[1]);
    }).then(function(result){
      assert.equal(result.valueOf(), new BigNumber(0).valueOf(), "unexpected result");
      return token.balanceOf(tokenOwner);
    }).then(function(result){
      assert.equal(result.valueOf(), expectedBalance.valueOf(), "unexpected balance");
    });
  });

  it("drop 0 gen and 7 knc", function() {
    var recipients = [accounts[9], accounts[0]];
    var amount = new BigNumber(10**18 * 7);
    return airDrop.airDrop(token.address,
                           tokenOwner,
                           recipients,
                           amount,
                           false,
                           genToken.address,
                           {from:airDropOwner}).then(function(){
       // check balance of original token
       assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });

  it("drop 0 gen and 5 knc from non owner", function() {
    var recipients = [accounts[9], accounts[0]];
    var amount = new BigNumber(10**18 * 5);
    return airDrop.airDrop(token.address,
                           tokenOwner,
                           recipients,
                           amount,
                           false,
                           genToken.address,
                           {from:nonOwner}).then(function(){
       // check balance of original token
       assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });

  it("change kgt owner from non owner", function() {
    return airDrop.tranferMinterOwnership(genToken.address,
                                          accounts[9],
                                          {from:nonOwner} ).then(function(){
       // check balance of original token
       assert.fail("expected to throw");
    }).catch(function(error){
      assert( Helpers.throwErrorMessage(error), "expected throw got " + error);
    });
  });

  it("change kgt owner from owner", function() {
    var newOwner = accounts[5];
    return airDrop.tranferMinterOwnership(genToken.address,
                                          newOwner,
                                          {from:airDropOwner} ).then(function(){
       // end minting in gen token
       return genToken.endMinting({from:newOwner});
    }).then(function(result){
      assert.equal("EndMinting", result.logs[0].event,"unexpected event");
    });
  });


});
