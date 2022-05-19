import { ethers } from "ethers";
import contract from "./contract.json";

const smartContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signedContract = new ethers.Contract(
    "0xeC3b03c548d542b6b49e279f52A9Ec5f2d42d7Da",
    contract.abi,
    provider
  );

  const signer = provider.getSigner();

  return signedContract.connect(signer);
};

export default smartContract;
