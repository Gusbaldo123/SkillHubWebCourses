
//#region imports

import type { User } from "../model/User";

import CRUDManager from "./CRUDManager";

//#endregion

class UserManager extends CRUDManager
{
    static instance: UserManager | null = null;

    localUser: User | null = null;

    //#region Handlers

    constructor()
    {
        super("/user");

        if (UserManager.instance)
            return UserManager.instance;

        UserManager.instance = this;

        this.loadLocalUser();
    }

    loadLocalUser(): void
    {
        try
        {
            const localUserString = localStorage.getItem("localUser");

            if (!localUserString)
            {
                this.localUser = null;
                return;
            }

            this.localUser = JSON.parse(localUserString) as User;
        }
        catch
        {
            this.localUser = null;
        }
    }

    getLocalUser(): User | null
    {
        this.loadLocalUser();
        return this.localUser;
    }

    setLocalUser(newUser: User | null): void
    {
        this.localUser = newUser;

        if (newUser)
            localStorage.setItem("localUser", JSON.stringify(newUser));
        else
            localStorage.removeItem("localUser");
    }

    //#endregion
}

//#region exports

const userManager = new UserManager();

export default userManager;

//#endregion