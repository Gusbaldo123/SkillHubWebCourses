import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

import UserManager from '../../utils/UserManager.js';

// Mock UserManager
jest.mock('../../utils/UserManager.js', () => ({
    getLocalUser: jest.fn(),
    setLocalUser: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useNavigate: () => mockNavigate,
        Link: ({ to, children, ...rest }) => (
            <a href={typeof to === 'string' ? to : to.pathname} {...rest}>
                {children}
            </a>
        ),
    };
});

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mocks before each test
    });

    test('renders signin and signup when user is not logged', () => {
        UserManager.getLocalUser.mockReturnValue(null);

        render(<Header />, { wrapper: MemoryRouter });

        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    });

    test('renders name and logoff when user is logged', () => {
        const testName = "test";
        UserManager.getLocalUser.mockReturnValue({ firstName: testName });

        render(<Header />, { wrapper: MemoryRouter });

        expect(screen.getByText(testName)).toBeInTheDocument();
        expect(screen.getByText(/LogOff/i)).toBeInTheDocument();
    });

    test('when clicking logoff, clears user cache and redirects to /Home', () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        UserManager.getLocalUser.mockReturnValue({ firstName: 'test' });

        render(<Header />, { wrapper: MemoryRouter });

        const logoffBtn = screen.getByText(/LogOff/i);
        fireEvent.click(logoffBtn);

        expect(UserManager.setLocalUser).toHaveBeenCalledWith(null);
        expect(mockNavigate).toHaveBeenCalledWith('/Home');

        alertSpy.mockRestore();
    });

    test('clicking the icon redirects to /Home', () => {
        UserManager.getLocalUser.mockReturnValue(null);

        render(<Header />, { wrapper: MemoryRouter });

        const logoLink = screen.getByRole('link', { name: /iconWebsite/i });
        expect(logoLink.getAttribute('href')).toContain('/Home');
    });
});
