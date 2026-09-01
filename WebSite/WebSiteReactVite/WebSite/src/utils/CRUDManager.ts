//#region imports
import ApiManager from "./ApiManager";
import BaseManager from "./BaseManager";
//#endregion


class CRUDManager extends BaseManager {
    //#region CRUD
    getByList = async (data:object) => 
        await this.getDataFromJSON(await ApiManager.fetchAPI(`${this.baseURL}/idlist`, data))
    fetchCRUDData = async (action:number, dataParam:object) =>
        await this.getDataFromJSON(await ApiManager.fetchAPI(this.baseURL, { action: action, dataparam: dataParam }));
    getAll = async () => await this.fetchCRUDData(0, {});
    get = async (id:number) => await this.fetchCRUDData(1, { id:Number(id) });
    add = async (data:object) => await this.fetchCRUDData(2, data);
    update = async (data:object) => await this.fetchCRUDData(3, data);
    delete = async (id:number) => await this.fetchCRUDData(4, { id:Number(id) });
    //#endregion
}

//#region exports
export default CRUDManager;
//#endregion