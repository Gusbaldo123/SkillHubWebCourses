//#region imports
import ApiManager from "./ApiManager.js";
//#endregion

class BaseManager {
    baseURL: string;
    constructor(baseURL:string) {
        if (!baseURL) throw new Error("Base URL must be provided");
        this.baseURL = `${ApiManager.BASE_URL}${baseURL}`;
    }
    async getDataFromJSON(response:Response | null) {
        if(!response) return null;
        if (!response.ok) return null;
        const resJSON = await response.json();
        return resJSON;
    }
    fetchData = async (dataParam:object) =>
        await this.getDataFromJSON(await ApiManager.fetchAPI(this.baseURL, dataParam));
}

//#region exports
export default BaseManager;
//#endregion
