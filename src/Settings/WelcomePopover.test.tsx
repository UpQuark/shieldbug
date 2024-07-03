import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../Testing/chromeApiMock';
import WelcomePopover from './WelcomePopover';
import mockChromeStorage from "../Testing/chromeApiMock";

beforeAll(() => {
  // Mock chrome.storage.sync.get
  mockChromeStorage();
});

test('renders YourComponent correctly', () => {
  render(<WelcomePopover/>);
  expect(screen.getByText("Here's some information to get you started...")).toBeInTheDocument();
});