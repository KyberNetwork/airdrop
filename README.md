# airdrop of KNC and KGT tokens
This repository consists of Kyber Genesis Token (KGT) smart contract and a smart contract to speed the airdropping process.
In the airdrop every user get 2 KNC, and in addition user may also get 1 KGT.

In addition, the repository consists of web3 javascript files that were used to initiate the airdrop transactions and monitor the progress.
The scripts makes the transaction via infura public node, and the monitoring via local parity node that is run with `--no-wrap` flag.
As otherwise it is not possible to fetch old events.


The airdrop sequence is as follows:
1. Deploy KGT and airdrop contract.
2. Approve enough KNC tokens (other tokens are also supported) to the airdrop contract.
3. Compile a list of reciepient addresses and store them in `upload.txt` file.
4. Run `upload.js` script.
5. When airdrop ends, call `endMiniting` function in KGT contract.


When used for future airdrop one should:
1. Code valid private key string in `upload.js`.
2. Change `emergencyERC20Drain` to send stuck tokens to a predefined address. Currently it sends it to kyber wallet.
3. Set desiriable gas fees.
