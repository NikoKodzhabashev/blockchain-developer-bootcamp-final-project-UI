# Final project - Charity platform(POC)

## Deployed version url:

https://happy-faces-ui.vercel.app/

## Youtube url:

https://www.youtube.com/watch?v=cpDSj56TXVc

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Yarn

### How to run

- `yarn install`
- make a .env file with
  VITE_CONTRACT_ADDRESS=0x919bDa798A52204eFa00232D0dbBCFc2780DCF93
- `yarn dev`
- Open `http://localhost:3000`

### Project description

A simple platform(POC) where everyone can get in an start applying for charity of different types. For the future version ideas:

- tracking whether the charity has been successful or not and if not than the money are given back to the donators
- charity discussions
- ranking and filters
- process of verification for the charities - might use multisig.

### Workflow

- Enter the platform
- Login with MetaMask
- Press Add Campaign
- Fill out the form and submit
- Wait till the transaction is minted and see your charity on the platform
- Come back after the expire date and check whether you have accumulated the needed amount
- To be able to withdraw you need to go in My Campaigns and click Withdraw
- To donate just pick the charity that you like and press Donate
