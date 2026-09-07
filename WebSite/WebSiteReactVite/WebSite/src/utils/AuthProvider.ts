//#region imports
import RequestService from "./RequestService";
import HttpMethod from "../model/HTTPMethods";
import { ToUser, type User } from "../model/User.js";
//#endregion

export interface Credentials {
    email: string;
    password: string;
}

class AuthService {
    localUser: User | null = null;

    async authenticate(credentials: Credentials) {
        if (!credentials) return null;

        const res: Response | null = await RequestService.fetchAPI("/auth", HttpMethod.POST, credentials);

        if (!res) return;

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Authentication failed");
            return;
        }

        const userData = await res.json();
        const user: User | null = ToUser(userData);

        if (!user) {
            alert("Failed to convert user data");
            return;
        }

        this.localUser = user;
        localStorage.setItem("user", JSON.stringify(user));

        return user;
    }

    getUser(): User | null {
        if (this.localUser) return this.localUser;

        const userData = localStorage.getItem("user");
        if (!userData) return null;

        const user: User | null = ToUser(JSON.parse(userData));
        this.localUser = user;
        return user;
    }

    logout() {
        this.localUser = null;
        localStorage.removeItem("user");
    }
}

//#region exports
const authService = new AuthService();
export default authService;
//#endregion