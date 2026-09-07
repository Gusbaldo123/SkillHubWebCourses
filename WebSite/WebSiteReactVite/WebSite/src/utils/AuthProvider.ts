//#region imports
import RequestService from "./RequestService";
import HttpMethod from "../model/HTTPMethods";
import { ToUser, type User } from "../model/User.js";
//#endregion

export interface Credentials {
    email: string;
    password: string;
}

class AuthenticationService {
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
}

//#region exports
const authService = new AuthenticationService();
export default authService;
//#endregion