pragma solidity ^0.4.15;
import "./Ownable.sol";
import "./KyberGenesisToken.sol";

contract KyberAirDrop is Ownable {
  uint public numDrops;
  uint public dropAmount;

  function KyberAirDrop( address dropper ) {
    transferOwnership(dropper);
  }

  event TokenDrop( address receiver, uint amount );
  function airDrop( ERC20Interface token,
                    address   tokenRepo,
                    address[] recipients,
                    uint amount,
                    bool kgt,
                    KyberGenesisToken kgtToken ) onlyOwner {
    require( amount == 0 || amount == (2*(10**18)) || amount == (5*(10**18)) );

    if( amount > 0 ) {
      for( uint i = 0 ; i < recipients.length ; i++ ) {
          assert( token.transferFrom( tokenRepo, recipients[i], amount ) );
          TokenDrop( recipients[i], amount );
      }
    }

    if( kgt ) {
      kgtToken.mint(recipients);
    }

    numDrops += recipients.length;
    dropAmount += recipients.length * amount;
  }

  function tranferMinterOwnership( KyberGenesisToken kgtToken, address newOwner ) onlyOwner {
    kgtToken.transferOwnership(newOwner);
  }

  function emergencyERC20Drain( ERC20Interface token, uint amount ) {
      // callable by anyone
      address kyberMultisig = 0x3EB01B3391EA15CE752d01Cf3D3F09deC596F650;
      token.transfer( kyberMultisig, amount );
  }
}
