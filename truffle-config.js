module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },

    confluxtest: {
      host: 'test.confluxrpc.org/v2',
      port: 80,
      network_id: '*',
      networkCheckTimeout: 100000,
      privateKeys: [],
    },
  }
};
