import BaseManager from "./BaseManager";

class RecoverPasswordManager extends BaseManager {

    static instance: RecoverPasswordManager | null = null;
    constructor() {
        super("/mail")

        if (RecoverPasswordManager.instance)
            return RecoverPasswordManager.instance;
        else RecoverPasswordManager.instance = this;
    }
    async sendMail(mail:string):Promise<string | null> {
        if (!mail) return null;
        if (typeof (mail) !== "string") return null;
        const res = await this.fetchData({ email: mail });
        if (!res) return null;
        if (res.success && res.data)
            return res.data;
        return null;
    }
}

const recoverPasswordManager = new RecoverPasswordManager();
export default recoverPasswordManager;