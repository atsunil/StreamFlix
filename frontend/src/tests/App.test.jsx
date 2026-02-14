import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the homepage', () => {
  render(<App />);
  const linkElement = screen.getByText(/browse movies/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders the login page', () => {
  render(<App />);
  const loginLink = screen.getByText(/login/i);
  expect(loginLink).toBeInTheDocument();
});

test('renders the register page', () => {
  render(<App />);
  const registerLink = screen.getByText(/register/i);
  expect(registerLink).toBeInTheDocument();
});