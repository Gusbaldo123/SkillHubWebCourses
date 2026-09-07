//#region imports
import HttpMethod from "../model/HTTPMethods";
//#endregion

class RequestService {
  BASE_URL: string = 'http://127.0.0.1:5000/api';
  //#region Handlers
  async fetchAPI(endpoint: string, method: HttpMethod, data: object | null): Promise<Response | null> {
    if (!endpoint) throw new Error("Endpoint must be provided");
    const URL = `${this.BASE_URL}/${endpoint}`;
    if (!method) throw new Error("Method must be provided");
    if (method !== HttpMethod.GET && method !== HttpMethod.POST && method !== HttpMethod.PUT && method !== HttpMethod.DELETE) throw new Error("Method must be GET, POST, PUT or DELETE");
    if (!data) throw new Error("Data parameter must be provided");

    try {
      return await fetch(URL, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
      })
    } catch (error) {
      return null;
    }
  }
  //#endregion
}

//#region exports
const requestService = new RequestService();
export default requestService;
//#endregion