import * as _ from 'lodash';

export function compareObject(left, right, metadata) {
  const keySet = {};
  const nKeySet = {};
  const keyDiff = {
    left: {},
    right: {},
    match: {},
  };
  const valueDiff = {
    left: {},
    right: {},
    match: {},
  };
  const objDiff = {};
  let hasKeyMismatch = false;
  let hasValueMismatch = false;

  Object.keys(left).forEach((key) => {
    if (!nKeySet[key]) {
      nKeySet[key] = 0;
    }
    nKeySet[key]--;
  });

  Object.keys(right).forEach((key) => {
    if (!nKeySet[key]) {
      nKeySet[key] = 0;
    }
    nKeySet[key]++;
  });

  _.forIn(metadata, (value, key, object) => {
    keySet[key] = 0;
    if (!_.isUndefined(left[key])) {
      keySet[key]--;
    }
    if (!_.isUndefined(right[key])) {
      keySet[key]++;
    }
    if (!_.isUndefined(nKeySet[key])) {
      delete nKeySet[key];
    }

    if (!value.ignoreCompare) {
      switch (keySet[key]) {
        case -1:
          keyDiff.left[key] = left[key];
          valueDiff.left[key] = left[key];
          objDiff[key] = {
            left: left[key],
          };
          hasKeyMismatch = true;
          break;
        case 1:
          keyDiff.right[key] = right[key];
          valueDiff.right[key] = right[key];
          objDiff[key] = {
            right: right[key],
          };
          hasKeyMismatch = true;
          break;
        case 0:
          if (value.type === 'array') {
            if (_.isUndefined(left[key]) && _.isUndefined(right[key])) {
              objDiff[key] = {
                miss: 'both',
              };
            } else {
              const compareData = compareArray(left[key], right[key], value);
              if (compareData.hasMismatch) {
                hasValueMismatch = compareData.hasMismatch;
                valueDiff.match[key] = compareData;
              }
              if (
                !_.isEmpty(compareData.objDiff) &&
                (!_.isEmpty(compareData.objDiff.left) ||
                  !_.isEmpty(compareData.objDiff.right) ||
                  !_.isEmpty(compareData.objDiff.mismatch))
              ) {
                objDiff[key] = compareData.objDiff;
              }
            }
          } else if (value.type === 'object') {
            if (_.isUndefined(left[key]) && _.isUndefined(right[key])) {
              objDiff[key] = {
                miss: 'both',
              };
            } else {
              const compareData = compareObject(
                left[key],
                right[key],
                value.attributes
              );
              if (compareData.hasMismatch) {
                keyDiff.match[key] = compareData;
                hasValueMismatch = true;
              }
              if (!_.isEmpty(compareData.objDiff)) {
                objDiff[key] = compareData.objDiff;
              }
            }
          } else if (value.type === 'objectArray') {
            if (_.isUndefined(left[key]) && _.isUndefined(right[key])) {
              objDiff[key] = {
                miss: 'both',
              };
            } else {
              const leftArr = [];
              const rightArr = [];

              _.forIn(left[key], (v, k, o) => {
                leftArr.push({ [value.metakey]: k, [value.metavalue]: v });
              });
              _.forIn(right[key], (v, k, o) => {
                rightArr.push({ [value.metakey]: k, [value.metavalue]: v });
              });

              const compareData = compareArray(leftArr, rightArr, value);
              if (compareData.hasMismatch) {
                hasValueMismatch = compareData.hasMismatch;
                valueDiff.match[key] = compareData;
              }
              if (
                !_.isEmpty(compareData.objDiff) &&
                (!_.isEmpty(compareData.objDiff.left) ||
                  !_.isEmpty(compareData.objDiff.right) ||
                  !_.isEmpty(compareData.objDiff.mismatch))
              ) {
                objDiff[key] = compareData.objDiff;
              }
            }
          } else {
            if (_.isUndefined(left[key]) && _.isUndefined(right[key])) {
              objDiff[key] = {
                miss: 'both',
              };
            } else if (!_.isEqual(left[key], right[key])) {
              valueDiff.left[key] = left[key];
              valueDiff.right[key] = right[key];
              objDiff[key] = {
                left: left[key],
                right: right[key],
              };
              hasValueMismatch = true;
            }
          }
          break;
        default:
          break;
      }
    }
  });
  if (!_.isEmpty(nKeySet)) {
    _.forIn(nKeySet, (value, key, object) => {
      objDiff[key] = {
        miss: 'metatada',
      };
      if (value < 0) {
        objDiff[key].left = left[key];
      } else if (value > 0) {
        objDiff[key].right = right[key];
      } else if (value === 0) {
        objDiff[key].left = left[key];
        objDiff[key].right = right[key];
      }
    });
  }
  return {
    hasMismatch: hasKeyMismatch || hasValueMismatch,
    hasKeyMismatch,
    hasValueMismatch,
    // keySet,
    // keyDiff,
    // valueDiff,
    objDiff,
  };
}

export function compareArray(left, right, metadata) {
  const keySet = {};
  const arrayLeft = {};
  const arrayRight = {};
  let hasKeyMismatch = false;
  let hasValueMismatch = false;
  const keyDiff = {
    left: {},
    right: {},
    match: {},
  };
  const valueDiff = {
    left: {},
    right: {},
    match: {},
  };
  const objDiff = {
    left: [],
    right: [],
    mismatch: {},
  };
  // TODO support for combined key
  if (metadata.item === 'object') {
    let uKey: string;
    _.forEach(left, (value, index) => {
      if (_.isUndefined(metadata.key) && !_.isUndefined(metadata.combinedkey)) {
        uKey = metadata.combinedkey
          .split('|')
          .map((v) => {
            return value[v];
          })
          .join('|');
      } else {
        uKey = value[metadata.key];
      }
      arrayLeft[uKey] = value;
      if (_.isUndefined(keySet[uKey])) {
        keySet[uKey] = 0;
      }
      keySet[uKey]--;
    });

    _.forEach(right, (value, index) => {
      if (_.isUndefined(metadata.key) && !_.isUndefined(metadata.combinedkey)) {
        uKey = metadata.combinedkey
          .split('|')
          .map((v) => {
            return value[v];
          })
          .join('|');
      } else {
        uKey = value[metadata.key];
      }
      arrayRight[uKey] = value;
      if (_.isUndefined(keySet[uKey])) {
        keySet[uKey] = 0;
      }
      keySet[uKey]++;
    });

    _.forIn(keySet, (value, key, object) => {
      switch (keySet[key]) {
        case -1:
          if (
            !(
              metadata.ignoreMissing &&
              !metadata.ignoreMissing.left &&
              metadata.ignoreMissing.right
            )
          ) {
            keyDiff.left[key] = arrayLeft[key];
            valueDiff.left[key] = arrayLeft[key];
            hasKeyMismatch = true;
            objDiff.left.push(arrayLeft[key]);
          }

          break;
        case 1:
          if (
            !(
              metadata.ignoreMissing &&
              metadata.ignoreMissing.left &&
              !metadata.ignoreMissing.right
            )
          ) {
            keyDiff.right[key] = arrayRight[key];
            valueDiff.right[key] = arrayRight[key];
            hasKeyMismatch = true;
            objDiff.right.push(arrayRight[key]);
          }

          break;
        case 0:
          const compareData = compareObject(
            arrayLeft[key],
            arrayRight[key],
            metadata.attributes
          );
          if (compareData.hasMismatch) {
            keyDiff.match[key] = compareData;
            hasValueMismatch = true;
          }
          if (!_.isEmpty(compareData.objDiff)) {
            objDiff.mismatch[key] = compareData.objDiff;
          }
          break;
        default:
          break;
      }
    });
  } else {
    _.forEach(left, (value, index) => {
      if (_.isUndefined(keySet[value])) {
        keySet[value] = 0;
      }
      keySet[value]--;
    });

    _.forEach(right, (value, index) => {
      if (_.isUndefined(keySet[value])) {
        keySet[value] = 0;
      }
      keySet[value]++;
    });

    _.forIn(keySet, (value, key, object) => {
      if (keySet[key] < 0) {
        valueDiff.left[key] = value * -1;
        hasValueMismatch = true;
        objDiff.left.push(...Array(value * -1).fill(key));
      } else if (keySet[key] > 0) {
        valueDiff.right[key] = value;
        hasValueMismatch = true;
        objDiff.right.push(...Array(value).fill(key));
      }
    });
  }
  return {
    hasMismatch: hasKeyMismatch || hasValueMismatch,
    hasKeyMismatch,
    hasValueMismatch,
    // keySet,
    // keyDiff,
    // valueDiff,
    objDiff,
  };
}
