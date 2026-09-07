//#region imports
import RequestService from "./RequestService";
import HttpMethod from "../model/HTTPMethods";
import { ToUser, type User, type Credentials } from "../model/User.js";
//#endregion

class AuthService {
    localUser: User | null = null;

    async authenticate(credentials: Credentials): Promise<User | null> {
        if (!credentials) return null;

        const res: Response | null = await RequestService.fetchAPI("/auth", HttpMethod.POST, credentials);

        if (!res)
            throw new Error("No response received");

        if (!res.ok) {
            let message = "Authentication failed";

            try {
                const errorData = await res.json();
                message = errorData.message || message;
            } catch {
            }

            throw new Error(message);
        }

        const userData = await res.json();
        const user: User | null = ToUser(userData);

        if (!user)
            throw new Error("Failed to convert user data");

        this.localUser = user;
        localStorage.setItem("user", JSON.stringify(user));

        return user;
    }

    getUser(): User | null {
        if (this.localUser) return this.localUser;

        const userData = localStorage.getItem("user");

        if (!userData) return null;

        try {
            const user: User | null = ToUser(JSON.parse(userData));

            this.localUser = user;

            return user;
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    }

    logout(): void {
        this.localUser = null;
        localStorage.removeItem("user");
    }
}

//#region exports
const authService = new AuthService();
export default authService;
//#endregion