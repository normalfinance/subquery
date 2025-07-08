export enum NETWORK {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

// TODO: replace with @normalfinance/utils
const poolRouter = {
  mainnet: {
    address: "...",
    startBlock: 0,
  },
  testnet: {
    address: "CCXBQN3K64UDQZL7YCAS7CFCJP3UQH6BJNNRH26PX5WI5JKKHFF5UBSZ",
    startBlock: 249450,
  },
};

export function getPoolRouter(network: NETWORK): {
  address: string;
  startBlock: number;
} {
  return poolRouter[network];
}

const insuranceFund = {
  mainnet: {
    address: "...",
    startBlock: 0,
  },
  testnet: {
    address: "CBERZDY7CRA224JTDHMOUK4DAVL4JAWJSVZN7VZAQTTIZEKF3TEG3UHA",
    startBlock: 249450,
  },
};

export function getInsuranceFund(network: NETWORK): {
  address: string;
  startBlock: number;
} {
  return insuranceFund[network];
}

const buffer = {
  mainnet: {
    address: "...",
    startBlock: 0,
  },
  testnet: {
    address: "CC4DYENCBXR3VY4I65CLTBIKIF34PZRQOHB4UAK75MIXLCGQSJH2XVRQ",
    startBlock: 249450,
  },
};

export function getBuffer(network: NETWORK): {
  address: string;
  startBlock: number;
} {
  return buffer[network];
}
