import _ from 'lodash';
import dayjs from 'dayjs';

export const formatDate = date =>
  dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

export const formatAPIData = unformattedData => {
  const result = {};
  const unformattedDataKeys = Object.keys(unformattedData);
  unformattedDataKeys.forEach(key => {
    // format arrays
    if (Array.isArray(unformattedData[key])) {
      // take out fields invalidated by the API
      let cleanArray = unformattedData[key].map(item =>
        _.omit(item, ['warehouseProjectId', 'orgUid']),
      );
      // reformat fields data type
      cleanArray = cleanArray.map(subObject => {
        const transformedToString = [
          'ratingRangeHighest',
          'ratingRangeLowest',
          'rating',
        ];
        transformedToString.forEach(item => {
          if (subObject[item]) {
            subObject[item] = subObject[item].toString();
          }
        });
        return subObject;
      });
      result[key] = cleanArray;
    }

    // format null values
    else if (unformattedData[key] === null || unformattedData[key] === 'null') {
      result[key] = '';
    }

    // format objects
    else if (typeof unformattedData[key] === 'object') {
      let obj = _.cloneDeep(unformattedData[key]);
      const keysToBeRemoved = ['orgUid', 'warehouseProjectId'];
      keysToBeRemoved.forEach(invalidKey => {
        if (obj[invalidKey] || obj[invalidKey] === null) {
          delete obj[invalidKey];
        }
      });
      result[key] = obj;
    }

    // if none of the above and key name is valid for API requests
    else if (
      ![
        'orgUid',
        'unitBlockStart',
        'unitBlockEnd',
        'unitCount',
        'issuanceId',
      ].includes(key)
    ) {
      result[key] = unformattedData[key];
    }
  });

  return result;
};

export const cleanObjectFromEmptyFieldsOrArrays = dataToSend => {
  Object.keys(dataToSend).forEach(el => {
    // clean empty fields
    if (!dataToSend[el]) {
      delete dataToSend[el];
    }

    // clean empty arrays
    if (typeof dataToSend[el] === 'object' && dataToSend[el].length === 0) {
      delete dataToSend[el];
    }

    // clean empty strings within arrays
    if (Array.isArray(dataToSend[el])) {
      dataToSend[el].forEach(individualArrayItem =>
        Object.keys(individualArrayItem).forEach(key => {
          if (
            individualArrayItem[key] === '' ||
            individualArrayItem[key] === null
          ) {
            delete individualArrayItem[key];
          }
        }),
      );
    }
  });
};