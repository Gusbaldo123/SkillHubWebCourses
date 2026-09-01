import { render, screen } from '@testing-library/react';
import Banner from './Banner';

test('renderiza o título "SkillHub"', () => {
  render(<Banner />);
  const title = screen.getByText(/SkillHub/i);
  expect(title).toBeInTheDocument();
});
