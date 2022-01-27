// Import stylesheets
import './style.css';
import { compareArray, compareObject } from './compare';
import { demoLeft, demoMetadata, demoRight } from './demo';
// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Compare Objects and Arrays</h1>`;

let keySet = compareObject(demoLeft, demoRight, demoMetadata);
const keyDiv: HTMLElement = document.getElementById('keySet');
keyDiv.innerHTML = `<h1>${JSON.stringify(keySet, undefined, 2)}</h1>`;

// const _equal: HTMLElement = document.getElementById('_equal');
// _equal.innerHTML = `<h1>${JSON.stringify(_.isEqual(left1, right1))}</h1>`;
