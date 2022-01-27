export const metadata = {
  id: { type: 'number' },
  name: { type: 'string' },
  missboth: { type: 'boolean' },
  leftonly: { type: 'boolean' },
  rightonly: { type: 'boolean' },
  flag: { type: 'boolean', ignoreCompare: true },
  obj: {
    type: 'object',
    attributes: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  },
  arr: {
    type: 'array',
    item: 'object',
    key: 'key',
    ignoreMissing: {
      left: true,
      right: false,
    },
    attributes: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  },
  carr: {
    type: 'array',
    item: 'object',
    combinedkey: 'key|value',
    attributes: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  },
  sarr: {
    type: 'array',
    item: 'string',
  },
};
