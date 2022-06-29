import { useEffect, useState } from 'react';

import EventsListItem from '../EventsListItem';
import styles from './EventsList.module.css';
import { EventLog, getEvents } from '../../lib/events';
import LoadingSpinner from '../LoadingSpinner';

const EventsList = () => {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getEvents().then((events) => {
      setEvents(events);
      setIsLoading(false);
    });
  }, []);

  const handleShowMoreClick = () => {
    setDisplayCount(displayCount + 20);
  };

  const paginatedEvents = events.slice(0, displayCount);

  if (isLoading) {
    return (
      <div className={styles.Loading}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className={styles.List}>
        {paginatedEvents.map((event, index) => (
          <EventsListItem key={index} event={event} />
        ))}
      </div>

      {displayCount < events.length && (
        <button className={styles.Button} onClick={handleShowMoreClick}>
          Show more
        </button>
      )}
    </>
  );
};

export default EventsList;
