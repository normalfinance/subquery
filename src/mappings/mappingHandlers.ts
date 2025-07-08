import {
  Swap,
  SwapStrict,
  Claim,
  BufferDeposit,
  LiquidityDeposit,
} from "../types";
import {
  StellarOperation,
  StellarEffect,
  SorobanEvent,
  StellarTransaction,
} from "@subql/types-stellar";
import { Horizon, Address, xdr } from "@stellar/stellar-sdk";
// import { extractEventValues } from "../helpers/events";

export async function handleEvent(event: SorobanEvent): Promise<void> {
  logger.info(
    `${String(event.topic[0]?.value()).toUpperCase()} Event received`
  );

  const eventType = String(event.topic[0]?.value()).toUpperCase();

  try {
    // const eventData = await extractEventValues(event);

    switch (eventType) {
      case "DEPOSIT": {
        const deposit = LiquidityDeposit.create({
          id: event.id,
          user: event.transaction?.account.toString() || "",
          asset: "",
          amount: BigInt(0),
          shareAmount: BigInt(0),
          pool: "",
          timestamp: BigInt(event.transaction?.created_at || 0),
          txHash: event.transaction?.hash || "",
        });

        await deposit.save();
        break;
      }

      // Buffer
      case "BUFFER_DEPOSIT": {
        const buffer_deposit = BufferDeposit.create({
          id: event.id,
          user: event.transaction?.account.toString() || "",
          token: "",
          amount: BigInt(0),
          timestamp: BigInt(event.transaction?.created_at || 0),
          txHash: event.transaction?.hash || "",
        });

        await buffer_deposit.save();
        break;
      }
    }
  } catch (error) {
    logger.error(`❌ Error processing ${eventType} event: ${error}`);
    throw error;
  }
}
