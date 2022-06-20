// //import
// import { encrypt } from "eth-sig-util";
import { MetaMaskOnboarding } from "./MetaMaskOnBoarding.js";

//ENVIRONMENT
//Check Metamask
const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

//URL
// const currenURL = new URL(window.location.href);
// const forwarderOrigin =
//   currentUrl.hostname === "localhost" ? "http://localhost:9010" : undefined; //need additional understanding

const { ethereum } = window;

const forwarderOrigin = "http://localhost:9011";

// On connection
const connectButton = document.getElementById("connectButton");
const displayAddress = document.getElementById("displayEthAddress");
const displayChainId = document.getElementById("network-id");

function initialize() {
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  const isMetamaskInstalled = () => {
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  if (isMetamaskInstalled()) {
    console.log("Metamask Detected!");
    connectButton.onclick = connectMetamask;
    connectButton.disabled = false;
  } else {
    console.log("Metamask not detected");
    connectButton.innerHTML = "Please install Metamask!";
    connectButton.disabled = true;
  }

  //Sub functions
  async function connectMetamask() {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Wallet Connected!!";

      const ethAddressesArray = await ethereum.request({
        method: "eth_accounts",
      });
      const ethAddress = ethAddressesArray[0];

      displayAddress.innerHTML = "Account: " + ethAddress;

      const chainIdHex = await ethereum.request({ method: "eth_chainId" }); //Get Hexa Value String
      const chainId = chainIdHex.slice(2); //Slice it to remove 0x

      displayChainId.innerHTML = "ChainID: " + parseInt(chainIdHex, 16); //No need specify 16 and remove 0x aas 0x already indicates that it's hexa
    } catch (error) {
      console.error(error);
    }
  }
}

window.addEventListener("DOMContentLoaded", initialize);

// Manual Imports
/***
 ***
 ***
 ***
 ***/
