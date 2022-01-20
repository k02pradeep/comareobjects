// Import stylesheets
import './style.css';
import * as _ from 'lodash';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

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

function isPipelineEqual(oldPipeline, newPipeline) {}

let left = { a: 1, b: 2, c: { c1: 1 }, d: 5 };
let right = { a: 2, b: 2, c: { c1: 2 }, d: [5] };

let left1 = { a: 1, b: 2, c: [1, 2] };
let right1 = { a: 1, b: 2, c: [2, 1] };

let keySet = compareObject(left, right);

const keyDiv: HTMLElement = document.getElementById('keySet');
keyDiv.innerHTML = `<h1>${JSON.stringify(keySet)}</h1>`;

// const _equal: HTMLElement = document.getElementById('_equal');
// _equal.innerHTML = `<h1>${JSON.stringify(_.isEqual(left1, right1))}</h1>`;
