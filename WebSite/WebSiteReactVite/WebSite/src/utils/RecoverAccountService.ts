import RequestService from "./RequestService";
import HttpMethod from "../model/HTTPMethods";

class RecoverPasswordManager {
    async sendMail(mail: string): Promise<string | null> {
        if (!mail) return null;
        if (typeof (mail) !== "string") return null;
        const res:Response | null = await RequestService.fetchAPI(`/recover-password/${mail}`, HttpMethod.POST, { email: mail });
        if (!res)
        {
            alert("Failed to send recovery email: No response received");
            return null;
        }
        if(!res.ok) {
            alert("Failed to send recovery email: Invalid response");
            return null;
        }
        if (res.body) {
            const data = await res.json();
            return data.message || "Recovery email sent successfully";
        }
        return null;
    }
}

const recoverPasswordManager = new RecoverPasswordManager();
export default recoverPasswordManager;