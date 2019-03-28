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
    act(() => {
      ReactDOM.render(<Confirm title="Are You Sure?" subtext="subtext text" cancelText="cancelText" confirmText="confirmText"/>, container);
    });
    const title = container.querySelector('.test-title');
    const subtext = container.querySelector('p');
    const confirmBtn = container.querySelector('.test-confirm-button');
    const cancelBtn = container.querySelector('.test-cancel-button');

    expect(title.textContent).toBe('Are You Sure?');
    expect(subtext.textContent).toBe('subtext text');
    expect(confirmBtn.textContent).toBe('confirmText');
    expect(cancelBtn.textContent).toBe('cancelText');
  });

  it('calls the onAccept function', () => {
    const mock = jest.fn()
    act(() => {
      ReactDOM.render(<Confirm title="Are You Sure?" subtext="subtext text" cancelText="cancelText" confirmText="confirmText" onAccept={mock}/>, container);
    });
    const confirmBtn = container.querySelector('.test-confirm-button');
    act(() => {
      confirmBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    expect(mock.mock.calls.length).toBe(1);
  });

  it('calls the onCancel function', () => {
    const mock = jest.fn()
    act(() => {
      ReactDOM.render(<Confirm title="Are You Sure?" subtext="subtext text" cancelText="cancelText" confirmText="confirmText" onCancel={mock}/>, container);
    });
    const cancelBtn = container.querySelector('.test-cancel-button');
    act(() => {
      cancelBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    expect(mock.mock.calls.length).toBe(1);
  });
});
