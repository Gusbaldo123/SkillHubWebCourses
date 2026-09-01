import { screen, fireEvent, render, act } from '@testing-library/react';
import RecoverPasswordPage from './RecoverPasswordPage';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const original = jest.requireActual("react-router-dom");
    return {
        ...original,
        useNavigate: () => mockNavigate,
        Link: ({ to, children, ...rest }) => (<a href={typeof to === 'string' ? to : to.pathname} {...rest}>{children}</a>),
    }
});

const mockSendEmail = jest.fn();
jest.mock('../../utils/RecoverPasswordManager', () => {
    const original = jest.requireActual("../../utils/RecoverPasswordManager");
    return {
        ...original,
        sendMail: async (mail) => { mockSendEmail(mail); return true; }
    }
});

describe('RecoverPasswordPage', () => {
    test('should render', () => {
        render(
            <MemoryRouter initialEntries={['/Recover']}>
                <RecoverPasswordPage />
            </MemoryRouter>
        );
        expect(screen.getByLabelText("Email:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
        expect(screen.getByText("New account")).toBeInTheDocument();
        expect(screen.getByText("Log in")).toBeInTheDocument();
    });

    test('should be able to send email recover', async () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });
        render(
            <MemoryRouter initialEntries={['/Recover']}>
                <RecoverPasswordPage />
            </MemoryRouter>
        );

        const testEmail = 'email@email.com';
        const email = screen.getByLabelText("Email:");
        fireEvent.change(email, { target: { value: testEmail } });
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
        });
        expect(mockSendEmail).toHaveBeenCalledWith(testEmail);
        alertSpy.mockRestore();
    });

    test('Should go register page', async () => {
        render(
            <MemoryRouter initialEntries={['/Recover']}>
                <RecoverPasswordPage />
            </MemoryRouter>
        );

        const btNew = screen.getByText("New account");
        expect(btNew).toBeInTheDocument();
        expect(btNew).toHaveAttribute("href", "/login");
    });
    test('Should go login page', async () => {
        render(
            <MemoryRouter initialEntries={['/Recover']}>
                <RecoverPasswordPage />
            </MemoryRouter>
        );

        const btNew = screen.getByText("Log in");
        expect(btNew).toBeInTheDocument();
        expect(btNew).toHaveAttribute("href", "/login");
    });
});
