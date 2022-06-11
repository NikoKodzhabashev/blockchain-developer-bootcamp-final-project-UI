import { ethers } from "ethers";
import contract from "./contract.json";

const smartContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signedContract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    contract.abi,
    provider
  );

  const signer = provider.getSigner();

  return signedContract.connect(signer);
};

export default smartContract;
