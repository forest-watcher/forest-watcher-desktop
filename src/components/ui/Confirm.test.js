import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Confirm from './Confirm';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe ('Confirm Dialog', () => {
  it('can render', () => {
    // Test first render and componentDidMount
    act(() => {
      ReactDOM.render(<Confirm title="Are You Sure?"/>, container);
    });
    const title = container.querySelector('h2');
    expect(title.textContent).toBe('Are You Sure?');
  });
});
