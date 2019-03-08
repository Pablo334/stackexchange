var MetaCoin = artifacts.require("./MetaCoin.sol");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(callback) {

    var MetaCoinContract = new web3.eth.Contract(MetaCoin._json.abi,'0xe392a007cdD9c5E82449061B0fEd28f40456f8D4');
    
    const Http = new XMLHttpRequest();
    const url = "https://ethgasstation.info/json/ethgasAPI.json";

    Http.responseType = 'json';
    Http.onreadystatechange = (e) => {
      if(Http.readyState == 4 && Http.status == 200){
        var gasStationResponse = JSON.parse(Http.responseText);
        var fastestGasPrice = web3.utils.toWei((gasStationResponse.fastest/10).toString(), "gwei");
        var fastGasPrice = web3.utils.toWei((gasStationResponse.fast/10).toString(), "gwei");
        var averageGasPrice = web3.utils.toWei((gasStationResponse.average/10).toString(), "gwei");
        var safeLowGasPrice = web3.utils.toWei((gasStationResponse.safeLow/10).toString(), "gwei");

        (async() =>{
          var totalOpEstimatedGas = 0;
          var deploymentGasEstimate = await MetaCoinContract.deploy({data:MetaCoin._json.bytecode}).estimateGas({from:"0xf20c7efc0a5c21a7eec768473e6420bcb7b30fa5"});

          for(i=0; i<1000; i++){
            totalOpEstimatedGas += await  MetaCoinContract.methods.sendCoin("0x109559a70a36c7ae128649bb2abb9e095f4122e1", 1).estimateGas({from:"0xf20c7efc0a5c21a7eec768473e6420bcb7b30fa5"});
          }

          console.log("Deployment Gas Estimation: " + deploymentGasEstimate + " units");
          console.log("Operations Gas Estimation: " + totalOpEstimatedGas + " units");
          console.log("Total Gas Estimation:" + (deploymentGasEstimate + totalOpEstimatedGas) + " units");
          console.log("Total Gas Cost Estimation (Fastest transaction Processing): " + ((totalOpEstimatedGas*fastestGasPrice) + (deploymentGasEstimate * fastestGasPrice)) + " wei");
          console.log("Total Gas Cost Estimation (Fast transaction Processing): " + ((totalOpEstimatedGas*fastGasPrice) + (deploymentGasEstimate * fastGasPrice)) + " wei");
          console.log("Total Gas Cost Estimation (Average transaction Processing): " + ((totalOpEstimatedGas*averageGasPrice) + (deploymentGasEstimate * averageGasPrice)) + " wei");
          console.log("Total Gas Cost Estimation (SafeLow transaction Processing): " + ((totalOpEstimatedGas*safeLowGasPrice) + (deploymentGasEstimate * safeLowGasPrice)) + " wei");
          console.log("Total Gas Cost Estimation (Fastest transaction Processing): " + web3.utils.fromWei(web3.utils.toBN(((totalOpEstimatedGas*fastestGasPrice) + (deploymentGasEstimate * fastestGasPrice)), 'ether')) + " ether");
          console.log("Total Gas Cost Estimation (Fast transaction Processing): " + web3.utils.fromWei(web3.utils.toBN(((totalOpEstimatedGas*fastGasPrice) + (deploymentGasEstimate * fastGasPrice)), 'ether')) + " ether");
          console.log("Total Gas Cost Estimation (Average transaction Processing): " + web3.utils.fromWei(web3.utils.toBN(((totalOpEstimatedGas*averageGasPrice) + (deploymentGasEstimate * averageGasPrice)), 'ether')) + " ether");
          console.log("Total Gas Cost Estimation (SafeLow transaction Processing): " + web3.utils.fromWei(web3.utils.toBN(((totalOpEstimatedGas*safeLowGasPrice) + (deploymentGasEstimate * safeLowGasPrice)), 'ether')) + " ether");

        })();
      }
    }
    Http.open("GET", url);
    Http.send();



};
