pragma solidity ^0.4.15;
import "./Ownable.sol";

contract KyberGenesisToken is Ownable {
  string  public  constant name     = "Kyber Genesis Token";
  string  public  constant symbol   = "KGT";
  uint    public  constant decimals = 0;

  uint                   public totalSupply = 0;
  mapping(address=>uint) public balanceOf;

  function KyberGenesisToken( address minter ) {
    transferOwnership(minter);
  }

  event Transfer(address indexed _from, address indexed _to, uint _value);
  event EndMinting( uint timestamp );

  function mint( address[] recipients ) onlyOwner {
    uint newRecipients = 0;
    for( uint i = 0 ; i < recipients.length ; i++ ){
      address recipient = recipients[i];
      if( balanceOf[recipient] == 0 ){
        Transfer( address(0x0), recipient, 1 );
        balanceOf[recipient] = 1;
        newRecipients++;
      }
    }

    totalSupply += newRecipients;
  }

  function endMinting() onlyOwner {
    transferOwnership(address(0xdead));
    EndMinting(block.timestamp);
  }

  function burn() {
    require(balanceOf[msg.sender] == 1 );
    Transfer( msg.sender, address(0x0), 1 );
    balanceOf[msg.sender] = 0;
    totalSupply--;
  }

  // ERC20 stubs
  function transfer(address _to, uint _value) returns (bool){ revert(); }
  function transferFrom(address _from, address _to, uint _value) returns (bool){ revert(); }
  function approve(address _spender, uint _value) returns (bool){ revert(); }
  function allowance(address _owner, address _spender) constant returns (uint){ return 0; }
  event Approval(address indexed _owner, address indexed _spender, uint _value);
}
