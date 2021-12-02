import React, { useEffect } from 'react';
import { getRatings } from '../../store/actions/climateWarehouseActions';

import { Card, DataTable } from '../../../components';
import { useSelector, useDispatch } from 'react-redux';

const Ratings = () => {
  const dispatch = useDispatch();
  const climateWarehouseStore = useSelector(store => store.climateWarehouse);

  useEffect(() => dispatch(getRatings({ useMockedResponse: true })), []);

  return (
    <>
      <Card>
        {climateWarehouseStore.ratings && (
          <DataTable
            headings={['type', 'rating', 'link', 'scale']}
            data={climateWarehouseStore.ratings}
          />
        )}
      </Card>
    </>
  );
};

export { Ratings };
