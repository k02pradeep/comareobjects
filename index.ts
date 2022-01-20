// Import stylesheets
import './style.css';
import * as _ from 'lodash';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Compare Objects and Arrays</h1>`;

function compareArray(left, right) {
  let arrayLeft = {};
  let arrayRight = {};
  let leftArrayMiss = [];
  let rightArrayMiss = [];
  let hasMismatch = false;

  _.forEach(left, (value, index) => {
    arrayLeft[index] = 0;
  });

  _.forEach(right, (value, index) => {
    arrayRight[index] = 0;
  });

  _.forIn(arrayLeft, (value, key, object) => {
    _.forEach(right, (value, index) => {
      if (arrayRight[index] === 0) {
        if (_.isObject(left[key])) {
          let compareObj = compareObject(left[key], right[index]);
          if (!compareObj.hasMismatch) {
            arrayLeft[key]++;
            arrayRight[index]++;
          }
        } else {
          if (_.isEqual(left[key], right[index])) {
            arrayLeft[key]++;
            arrayRight[index]++;
          }
        }
      }
    });
  });

  _.forIn(arrayLeft, (value, key, object) => {
    if (!arrayLeft[key]) {
      leftArrayMiss.push(left[key]);
    }
  });

  _.forIn(arrayRight, (value, key, object) => {
    if (!arrayLeft[key]) {
      rightArrayMiss.push(right[key]);
    }
  });

  return {
    arrayLeft,
    arrayRight,
    leftArrayMiss,
    rightArrayMiss,
    hasMismatch: leftArrayMiss.length > 0 || rightArrayMiss.length > 0,
  };
}

function compareObject(left, right) {
  let keySet = {};
  let keyDiff = {
    left: {},
    right: {},
    match: {},
  };
  let valueDiff = {
    left: {},
    right: {},
    match: {},
  };
  let hasKeyMismatch = false;
  let hasValueMismatch = false;
  let hasMismatch = false;
  Object.keys(left).forEach((key) => {
    if (!keySet[key]) {
      keySet[key] = 0;
    }
    keySet[key]--;
  });

  Object.keys(right).forEach((key) => {
    if (!keySet[key]) {
      keySet[key] = 0;
    }
    keySet[key]++;
  });
  _.forIn(keySet, (value, key, object) => {
    switch (value) {
      case -1:
        keyDiff.left[key] = left[key];
        valueDiff.left[key] = left[key];
        hasKeyMismatch = true;
      case 1:
        keyDiff.right[key] = right[key];
        valueDiff.right[key] = right[key];
        hasKeyMismatch = true;
      case 0:
        if (
          (_.isArray(left[key]) && !_.isArray(right[key])) ||
          (!_.isArray(left[key]) && _.isArray(right[key]))
        ) {
          hasValueMismatch = true;
          valueDiff.left[key] = left[key];
          valueDiff.right[key] = right[key];
        } else if (_.isArray(left[key]) && _.isArray(right[key])) {
          let compareData = compareArray(left[key], right[key]);
          if (compareData.hasMismatch) {
            hasValueMismatch = compareData.hasMismatch;
            valueDiff.match[key] = compareData;
          }
        } else if (
          (_.isObject(left[key]) && !_.isObject(right[key])) ||
          (!_.isObject(left[key]) && _.isObject(right[key]))
        ) {
          hasValueMismatch = true;
          valueDiff.left[key] = left[key];
          valueDiff.right[key] = right[key];
        } else if (_.isObject(left[key]) && _.isObject(right[key])) {
          let compareData = compareObject(left[key], right[key]);
          if (compareData.hasMismatch) {
            keyDiff.match[key] = compareData;
            hasValueMismatch = true;
          }
        } else {
          if (!_.isEqual(left[key], right[key])) {
            valueDiff.left[key] = left[key];
            valueDiff.right[key] = right[key];
            hasValueMismatch = true;
          }
          // keyDiff.match[key] = left[key];
        }
    }
  });
  return {
    keySet,
    keyDiff,
    hasKeyMismatch,
    valueDiff,
    hasValueMismatch,
    hasMismatch: hasKeyMismatch || hasValueMismatch,
  };
}

let left = {
  a: 1,
  b: 2,
  c: { c1: 1 },
  d: [6],
  e: [
    { a: 1, b: 2, c: { c1: 1 } },
    { a: 3, b: 2 },
  ],
};
let right = {
  a: 1,
  b: 2,
  c: { c1: 1 },
  d: [6],
  e: [
    { a: 1, b: 2, c: { c1: 2 } },
    { a: 3, b: 2 },
  ],
};

let left1 = { a: 1, b: 2, c: [1, 2] };
let right1 = { a: 1, b: 2, c: [2, 1] };

let keySet = compareObject(left, right);
let keySetArrary = compareArray(left.e, right.e);
const keyDiv: HTMLElement = document.getElementById('keySet');
keyDiv.innerHTML = `<h1>${JSON.stringify(keySet, undefined, 2)}</h1>`;

// const _equal: HTMLElement = document.getElementById('_equal');
// _equal.innerHTML = `<h1>${JSON.stringify(_.isEqual(left1, right1))}</h1>`;
