import { getBlockTime, getLogs } from '@colony/colony-js';
import { EventFilter, utils } from 'ethers';
import { LogDescription } from 'ethers/utils';

import { getColonyClientInstance, provider } from './client';

export interface EventLog extends LogDescription {
  logTime: number;
  blockHash?: string;
  userAddress?: string;
}

const getParsedLogs = async (filter: EventFilter): Promise<EventLog[]> => {
  const colonyClient = await getColonyClientInstance();

  const eventLogs = await getLogs(colonyClient, filter);

  const parsedLogs = await Promise.all(
    eventLogs.map(async (log) => ({
      ...colonyClient.interface.parseLog(log),
      logTime: log.blockHash ? await getBlockTime(provider, log.blockHash) : 0,
      blockHash: log.blockHash,
    }))
  );

  return parsedLogs;
};

const extractUserAddressFromPayoutClaimedLog = async (
  log: EventLog
): Promise<string> => {
  const colonyClient = await getColonyClientInstance();

  const humanReadableFundingPotId = new utils.BigNumber(
    log.values.fundingPotId
  ).toString();

  const { associatedTypeId } = await colonyClient.getFundingPot(
    humanReadableFundingPotId
  );

  const { recipient: userAddress } = await colonyClient.getPayment(
    associatedTypeId
  );

  return userAddress;
};

export const getEvents = async (): Promise<EventLog[]> => {
  const colonyClient = await getColonyClientInstance();

  const colonyInitialisedLogs = await getParsedLogs(
    colonyClient.filters.ColonyInitialised(null, null)
  );

  const colonyRoleSetLogs = await getParsedLogs(
    colonyClient.filters.ColonyRoleSet(null, null, null, null)
  );

  const domainAddedLogs = await getParsedLogs(
    colonyClient.filters.DomainAdded(null)
  );

  const payoutClaimedLogs = await Promise.all(
    await getParsedLogs(
      colonyClient.filters.PayoutClaimed(null, null, null)
    ).then((logs) =>
      logs.map(async (log) => ({
        ...log,
        userAddress: await extractUserAddressFromPayoutClaimedLog(log),
      }))
    )
  );

  return [
    ...colonyInitialisedLogs,
    ...colonyRoleSetLogs,
    ...domainAddedLogs,
    ...payoutClaimedLogs,
  ].sort((a, b) => b.logTime - a.logTime);
};
