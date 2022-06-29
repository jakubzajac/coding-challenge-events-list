import { ColonyRole } from '@colony/colony-js';
import { utils } from 'ethers';
import { EventLog } from '../../lib/events';

interface Props {
  event: EventLog;
}

// top 10 tokens by market cap and BLNY which seems frequent in the dataset
const tokenAddressToSymbolMap = new Map([
  ['0xB8c77482e45F1F44dE1745F52C74426C631bDD52', 'BNB'],
  ['0xdac17f958d2ee523a2206206994597c13d831ec7', 'USDT'],
  ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'USDC'],
  ['0x4Fabb145d64652a948d72533023f6E7A623C7C53', 'BUSD'],
  ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 'DAI'],
  ['0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', 'HEX'],
  ['0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', 'SHIB'],
  ['0x2AF5D2aD76741191D15Dfe7bF6aC92d4Bd912Ca3', 'LEO'],
  ['0x3883f5e181fccaF8410FA61e12b59BAd963fb645', 'THETA'],
  ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', 'stETH'],
  ['0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c', 'BLNY'],
]);

const EventMessage = ({ event }: Props) => {
  if (event.name === 'ColonyInitialised') {
    return <>Congratulations! It's a beautiful baby colony!</>;
  } else if (event.name === 'ColonyRoleSet') {
    const role = ColonyRole[event.values.role] ?? 'Unknown role';
    const domainId = new utils.BigNumber(event.values.domainId).toString();

    return (
      <>
        <strong>{role}</strong> role assigned to user{' '}
        <strong>{event.values.user}</strong> in domain{' '}
        <strong>{domainId}</strong>.
      </>
    );
  } else if (event.name === 'DomainAdded') {
    const domainId = new utils.BigNumber(event.values.domainId).toString();

    return (
      <>
        Domain <strong>{domainId}</strong> added.
      </>
    );
  } else if (event.name === 'PayoutClaimed') {
    const base10 = new utils.BigNumber(10);
    const humanReadableAmount = new utils.BigNumber(event.values.amount);
    const convertedAmount = humanReadableAmount.div(base10.pow(18)).toString();

    const tokenSymbol =
      tokenAddressToSymbolMap.get(event.values.token) ?? '(Unknown token)';

    const fundingPotId = new utils.BigNumber(
      event.values.fundingPotId
    ).toString();

    return (
      <>
        User <strong>{event.userAddress}</strong> claimed{' '}
        <strong>
          {convertedAmount}
          {tokenSymbol}
        </strong>{' '}
        payout from pot <strong>{fundingPotId}</strong>.
      </>
    );
  }

  return null;
};

export default EventMessage;
