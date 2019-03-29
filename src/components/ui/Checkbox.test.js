import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Checkbox from './Checkbox';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe ('Checkbox Dialog', () => {
  it('can render', () => {
    const mock = jest.fn()
    act(() => {
      ReactDOM.render(<Checkbox id="test" defaultChecked={true} label={"test label"} labelId="1" disabled={true} callback={mock}/>, container);
    });
    const label = container.querySelector('.test-checkbox-label');

    expect(label.textContent).toBe('test label');
  });

  it('should render a disabled input', () => {
    const mock = jest.fn()
    act(() => {
      ReactDOM.render(<Checkbox id="test" label={"test label"} labelId="1" disabled={true} checked={true} callback={mock}/>, container);
    });
    const enabledCheckbox = container.querySelector('.test-checkbox-enabled');
    const disabledCheckbox = container.querySelector('.test-checkbox-disabled');

    expect(enabledCheckbox).toBeNull();
    expect(disabledCheckbox).not.toBeNull();
  });

  it('should render an input that is not disabled', () => {
    const mock = jest.fn()
    act(() => {
      ReactDOM.render(<Checkbox id="test" label={"test label"} labelId="1" disabled={true} defaultChecked={true} callback={mock}/>, container);
    });
    const enabledCheckbox = container.querySelector('.test-checkbox-enabled');
    const disabledCheckbox = container.querySelector('.test-checkbox-disabled');

    expect(enabledCheckbox).not.toBeNull();
    expect(disabledCheckbox).toBeNull();
  });

  it('calls the callback function', () => {
    const mock = jest.fn()
    act(() => {
        ReactDOM.render(<Checkbox id="test" defaultChecked={true} label="test label" labelId="1" disabled={true} callback={mock}/>, container);
    });
    const checkbox = container.querySelector('.test-checkbox');
    act(() => {
      checkbox.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    expect(mock.mock.calls.length).toBe(1);
  });
});
