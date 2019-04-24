import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Loader from './Loader';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe ('Loader', () => {
  it('can render when isLoading prop is true', () => {
    const isLoading = true;

    act(() => {
      ReactDOM.render(<Loader isLoading={isLoading} />, container);
    });

    const spinner = container.querySelector('.test-loader-spinner');

    expect(spinner).not.toBeNull();
  });

  it('should not render if isLoading prop is false', () => {
    const isLoading = false;

    act(() => {
      ReactDOM.render(<Loader isLoading={isLoading} />, container);
    });

    const spinner = container.querySelector('.test-loader-spinner');

    expect(spinner).toBeNull();
  });
});
