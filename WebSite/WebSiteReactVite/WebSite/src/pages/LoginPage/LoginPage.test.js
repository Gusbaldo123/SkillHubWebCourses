import { fireEvent, render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LoginPage from "./LoginPage";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useNavigate: () => mockNavigate,
        Link: ({ to, children, ...rest }) => (<a href={typeof to === 'string' ? to : to.pathname} {...rest}>{children}</a>),
    };
});

const mockAuth = jest.fn();
jest.mock("../../utils/AuthManager", () => {
    const original = jest.requireActual("../../utils/AuthManager");
    return {
        original,
        authenticate: async (credentials) => mockAuth(credentials)
    }
});

const mockAdd = jest.fn();
jest.mock('../../utils/UserManager.js', () => ({
    getLocalUser: jest.fn(),
    setLocalUser: jest.fn(),
    add: async (data) => { mockAdd(data); return { data: true } }
}));

describe('LoginPage', () => {
    test('Should render signIn page', async () => {
        render(
            <MemoryRouter initialEntries={['/login?form=signIn']}>
                <LoginPage />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("email@email.com")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'LogIn' })).toBeInTheDocument();
        expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    test('Should render signUp page', async () => {
        render(
            <MemoryRouter initialEntries={['/login?form=signUp']}>
                <LoginPage />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("email@email.com")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
        expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
        expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    });

    test('Should be able to login', async () => {
        render(
            <MemoryRouter initialEntries={['/login?form=signIn']}>
                <LoginPage />
            </MemoryRouter>
        );

        const testValues = {
            email: 'email@email.com',
            password: '123'
        }

        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");
        fireEvent.change(email, { target: { value: testValues.email } });
        fireEvent.change(pass, { target: { value: testValues.password } });
        const btLogin = screen.getByRole('button', { name: 'LogIn' });
        fireEvent.click(btLogin);
        expect(mockAuth).toHaveBeenCalledWith({ ...testValues });
    });

    test("Should be able to register", async () => {
        const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => true);

        render(
            <MemoryRouter initialEntries={["/login?form=signUp"]}>
                <LoginPage />
            </MemoryRouter>
        );

        const testValues = {
            email: "email@email.com",
            password: "123",
            isStudent: true,
            firstName: "test",
            surname: "test",
            phone: "+123 456 789",
            courseList: [],
        };

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: testValues.email },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: testValues.password },
        });
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: testValues.firstName },
        });
        fireEvent.change(screen.getByLabelText("Surname"), {
            target: { value: testValues.surname },
        });
        fireEvent.change(screen.getByLabelText("Phone"), {
            target: { value: testValues.phone },
        });

        // 👇 envolve o click em act
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Register" }));
        });

        expect(mockAdd).toHaveBeenCalledWith({ ...testValues });

        confirmSpy.mockRestore();
    });

    test('Should switch pages', async () => {
        render(
            <MemoryRouter initialEntries={['/login?form=signIn']}>
                <LoginPage />
            </MemoryRouter>
        );
        const btRegister = screen.getByText("Don't have an account?");
        fireEvent.click(btRegister);
        const btLogin = screen.getByText("Already have an account?");
        expect(btLogin).toBeInTheDocument();
        expect(btRegister).not.toBeInTheDocument();

        fireEvent.click(btLogin);
        expect(btLogin).not.toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument(); // new button should appear
    });

    test('Should go to password recover page on register', async () => {
        render(
            <MemoryRouter initialEntries={['/login?form=signIn']}>
                <LoginPage />
            </MemoryRouter>
        );

        const btRecover = screen.getByText("Forgot your password?");
        expect(btRecover).toBeInTheDocument();
        expect(btRecover).toHaveAttribute("href", "/Recover");
    });

    test('Should go to password recover page on login', async () => {
        render(
            <MemoryRouter initialEntries={['/login?form=signUp']}>
                <LoginPage />
            </MemoryRouter>
        );

        const btRecover = screen.getByText("Forgot your password?");
        expect(btRecover).toBeInTheDocument();
        expect(btRecover).toHaveAttribute("href", "/Recover");
    });
});