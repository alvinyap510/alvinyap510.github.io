// //import
// import { encrypt } from "eth-sig-util";
import { MetaMaskOnboarding } from "./MetaMaskOnBoarding.js";
import { USDCPriceFeedABI } from "./USDCPriceFeedAbi.js";
import { ETHPriceFeedABI } from "./ETHPriceFeedAbi.js";

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

// const provider = new ethers.providers.Web3Provider(window.ethereum);

// On connection
const connectButton = document.getElementById("connectButton");
const displayAddress = document.getElementById("displayEthAddress");
const displayChainId = document.getElementById("network-id");

//Call Oracle For Prices
const displayUSDCPrice = document.getElementById("USDCFork-Price");

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

      if (chainId !== "4") {
        displayChainId.innerHTML +=
          "  Chain not supported. Please connect to Rinkeby";
      }
    } catch (error) {
      console.error(error);
    }
  }

  //Get Token Price From ChainLink Oracle
  //USDC Oracle
  const USDCPriceFeedContractAddress =
    "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB";

  async function updateUSDCPrice() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const USDCPriceFeedContract = new ethers.Contract(
      USDCPriceFeedContractAddress,
      USDCPriceFeedABI,
      provider
    );
    const USDCPrice = await USDCPriceFeedContract.latestAnswer();
    document.getElementById("USDC-Price-Update").innerHTML =
      "Oracle Price: " + USDCPrice / 100000000 + " USD";
  }
  //Get first time when initialize
  updateUSDCPrice();
  //Refresh Price Button
  document.getElementById("USDCPriceUpdate").onclick = updateUSDCPrice;

  //ETH Oracle

  const ETHPriceFeedContractAddress =
    "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";

  async function updateETHPrice() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const ETHPriceFeedContract = new ethers.Contract(
      ETHPriceFeedContractAddress,
      ETHPriceFeedABI,
      provider
    );
    const ETHPrice = await ETHPriceFeedContract.latestAnswer();
    document.getElementById("ETH-Price-Update").innerHTML =
      "Oracle Price: " + ETHPrice / 100000000 + " USD";
  }
  //Get first time when initialize
  updateETHPrice();
  //Refresh Price Button
  document.getElementById("ETHPriceUpdate").onclick = updateETHPrice;
}
window.addEventListener("DOMContentLoaded", initialize);
