const Web3 = require('web3');
const protocol = "http";
const ip = "localhost";
const port = 9650;
module.exports = {
  networks: {
   development: {
     provider: function() {
      return new Web3.providers.HttpProvider(`${protocol}://${ip}:${port}/ext/bc/C/rpc`)
     },
     network_id: "*",
   },

   fuji: {
    provider: function() {
     return new Web3.providers.HttpProvider(`https://api.avax-test.network/ext/bc/C/rpc`)
    },
    network_id: "*",
    // gas: 3000000,
    // gasPrice: 470000000000,
    // from: "0x345935f424A5C231985C49F06e9FfDCE502955fc"
  }
  }
};