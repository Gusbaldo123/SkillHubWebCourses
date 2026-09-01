//#region imports
import BaseManager from "./BaseManager";
import UserManager from "./UserManager";
//#endregion

class AuthManager extends BaseManager {
    static instance: AuthManager | null = null;
    constructor() {
        super("/auth");
        if (AuthManager.instance)
            return AuthManager.instance;
        AuthManager.instance = this;
    }
    async authenticate(credentials:object) {
        if (!credentials) return null;
        const res = await this.fetchData(credentials);
        if(!res) return;
        if (res.success && res.data)
            UserManager.setLocalUser(res.data);
        else alert(res.data);
    }
}

//#region exports
const authManager = new AuthManager();
export default authManager;
//#endregion