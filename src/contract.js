import { ethers } from "ethers";
import contract from "./contract.json";

const smartContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signedContract = new ethers.Contract(
    "0x2f1E2287291aA41AdBd1C87c35a6e2D4a8FC55C2",
    contract.abi,
    provider
  );

  const signer = provider.getSigner();

  return signedContract.connect(signer);
};

export default smartContract;
