import {
  StellarDatasourceKind,
  StellarHandlerKind,
  StellarProject,
  SubqlRuntimeHandler,
} from "@subql/types-stellar";
import { Horizon, Networks } from "@stellar/stellar-sdk";
import {
  getBuffer,
  getInsuranceFund,
  getPoolRouter,
  NETWORK,
} from "./src/constants";

import * as dotenv from "dotenv";
import path from "path";

const mode = process.env.NODE_ENV || "production";

// Load the appropriate .env file
const dotenvPath = path.resolve(
  __dirname,
  `.env${mode !== "production" ? `.${mode}` : ""}`
);
dotenv.config({ path: dotenvPath });

// Setup
const poolRouter = getPoolRouter(process.env.NETWORK as NETWORK);
const insuranceFund = getInsuranceFund(process.env.NETWORK as NETWORK);
const buffer = getBuffer(process.env.NETWORK as NETWORK);

const normalHandlers: SubqlRuntimeHandler[] = [
  {
    handler: "handleEventAddPool",
    kind: StellarHandlerKind.Event,
    filter: {
      contractId: poolRouter.address,
      topics: ["add_pool"],
    },
  },
  // Pool
  {
    handler: "handleEvent", // deposit liquidity
    kind: StellarHandlerKind.Event,
    filter: {
      topics: ["deposit_liquidity"],
    },
  },
  {
    handler: "handleEvent", // withdraw liquidity
    kind: StellarHandlerKind.Event,
    filter: {
      topics: ["withdraw_liquidity"],
    },
  },
  {
    handler: "handleEvent", // swap liquidity
    kind: StellarHandlerKind.Event,
    filter: {
      topics: ["trade"],
    },
  },
  {
    handler: "handleEvent", // rebalance pool
    kind: StellarHandlerKind.Event,
    filter: {
      topics: ["rebalance"],
    },
  },
  // Insurance Fund
  {
    handler: "handleEvent", // deposit liquidity
    kind: StellarHandlerKind.Event,
    filter: {
      contractId: insuranceFund.address,
      topics: ["if_stake_record"],
    },
  },
  // Buffer
  {
    handler: "handleEvent", // buffer deposit
    kind: StellarHandlerKind.Event,
    filter: {
      contractId: buffer.address,
      topics: ["deposit"],
    },
  },
  {
    handler: "handleEvent", // buffer sync
    kind: StellarHandlerKind.Event,
    filter: {
      contractId: buffer.address,
      topics: ["sync"],
    },
  },
  {
    handler: "handleEvent", // buffer skim
    kind: StellarHandlerKind.Event,
    filter: {
      contractId: buffer.address,
      topics: ["skim"],
    },
  },
];

/* This is your project configuration */
const project: StellarProject = {
  specVersion: "1.0.0",
  name: "normal-indexer",
  version: "0.0.1",
  runner: {
    node: {
      name: "@subql/node-stellar",
      version: "*",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  description: "Normal Indexer",
  repository: "https://github.com/normalfinance/subquery",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /* Stellar and Soroban uses the network passphrase as the chainId
      'Test SDF Network ; September 2015' for testnet
      'Public Global Stellar Network ; September 2015' for mainnet
      'Test SDF Future Network ; October 2022' for Future Network */
    chainId:
      (process.env.NETWORK as NETWORK) === NETWORK.MAINNET
        ? Networks.PUBLIC
        : Networks.TESTNET,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.HORIZON_ENDPOINT!?.split(",") as string[] | string,
    /* This is a specific Soroban endpoint
      It is only required when you are using a soroban/EventHandler */
    sorobanEndpoint: process.env.SOROBAN_ENDPOINT!, //
  },
  dataSources: [
    {
      kind: StellarDatasourceKind.Runtime,
      /* Set this as a logical start block, it might be block 1 (genesis) or when your contract was deployed */
      startBlock: poolRouter.startBlock,
      mapping: {
        file: "./dist/index.js",
        handlers: [...normalHandlers],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
