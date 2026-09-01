import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

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

describe('Footer', () => {
    test('renders footer buttons and contact info', () => {
        render(<Footer />, { wrapper: MemoryRouter });

        const iconBt = screen.getByRole('link', { name: /socialMediaLogo/i });
        expect(iconBt).toBeInTheDocument();
        expect(iconBt.getAttribute('href')).toContain('/Home');

        const socialButtons = screen.getAllByRole('button');
        expect(socialButtons.length).toBe(3);

        const contact = screen.getByText("Contact");
        expect(contact).toBeInTheDocument();

        const contactSection = contact.closest('.footerContact');
        const paragraphs = contactSection.querySelectorAll('p');
        expect(paragraphs.length).toBe(2);

        const phone = paragraphs[0];
        expect(phone).toBeInTheDocument();
        expect(phone.textContent).toMatch(/^\+?\d/);

        const mail = paragraphs[1].querySelector('a');
        expect(mail).toBeInTheDocument();
        expect(mail).toHaveAttribute('href', expect.stringContaining('mailto:'));
        expect(mail).toHaveAttribute('href', expect.stringContaining('?subject='));
        expect(mail).toHaveAttribute('href', expect.stringContaining('&body='));
    });
    test('icon button must redirect to /home', () => {
        render(<Footer />);
        const iconBt = screen.getByRole('link', { name: /socialMediaLogo/i });
        expect(iconBt.getAttribute('href')).toContain('/Home');
    })
    test.each([
        ['website', 0, 'https://www.gusbaldo.com'],
        ['linkedin', 1, 'https://www.linkedin.com/in/gustavorbpereira'],
        ['github', 2, 'https://www.github.com/Gusbaldo123'],
    ])('%s button must redirect correctly', (_, index, expectedUrl) => {
        const replaceMock = jest.fn();
        delete window.location;
        window.location = { replace: replaceMock };

        render(<Footer />);
        const socialButtons = screen.getAllByRole('button');

        fireEvent.click(socialButtons[index]);

        expect(replaceMock).toHaveBeenCalledWith(expectedUrl);
    });
});
