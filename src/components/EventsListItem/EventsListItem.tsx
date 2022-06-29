import { format } from 'date-fns';
import Blockies from 'react-blockies';

import { MAINNET_BETACOLONY_ADDRESS } from '../../lib/client';
import { EventLog } from '../../lib/events';
import EventMessage from '../EventMessage';
import styles from './EventsListItem.module.css';

interface Props {
  event: EventLog;
}

const EventsListItem = ({ event }: Props) => {
  return (
    <div className={styles.Wrapper}>
      <Blockies
        seed={
          event.values.user ?? event.userAddress ?? MAINNET_BETACOLONY_ADDRESS
        }
        className={styles.Avatar}
      />

      <div className={styles.Details}>
        <div className={styles.Message}>
          <EventMessage event={event} />
        </div>

        <div className={styles.Date}>
          {format(event.logTime, 'dd MMM yyyy')}
        </div>
      </div>
    </div>
  );
};

export default EventsListItem;
