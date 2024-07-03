/**
 * Override Chrome storage API with a mock implementation.
 */
function mockChromeStorage() {
  const storageData: any = {};

  const storage = {
    sync: {
      get: jest.fn((keys, callback) => {
        // Create a result object that extracts the values for the keys
        const result = Array.isArray(keys) ? keys.reduce((acc, key) => {
          acc[key] = storageData[key];
          return acc;
        }, {}) : { [keys]: storageData[keys] };

        // Call the callback immediately with the result
        callback(result);
      }),
      set: jest.fn((items, callback) => {
        // Update the storage data
        Object.assign(storageData, items);
        if (callback) {
          callback();
        }
      }),
    },
  };

  global.chrome = {
    storage: storage
  } as any;

  return storage;
}

export default mockChromeStorage;
