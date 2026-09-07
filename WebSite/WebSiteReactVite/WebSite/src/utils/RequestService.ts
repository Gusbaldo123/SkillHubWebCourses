//#region imports
import HttpMethod from "../model/HTTPMethods";
//#endregion

class RequestService {
  BASE_URL = import.meta.env.VITE_API;
  //#region Handlers
  async fetchAPI(endpoint: string, method: HttpMethod, data: object | null): Promise<Response | null> {
    if (!endpoint) throw new Error("Endpoint must be provided");
    const URL = `${this.BASE_URL}${endpoint}`;
    if (!method) throw new Error("Method must be provided");
    if (method !== HttpMethod.GET && method !== HttpMethod.POST && method !== HttpMethod.PUT && method !== HttpMethod.DELETE) throw new Error("Method must be GET, POST, PUT or DELETE");

    return await fetch(URL, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });
  }

  async parseResponse<T>(response: Response | null) {
        if (!response) return null;

        const status = response.status;
        let data: T | null = null;

        if (response.status !== 204) {
            try {
                data = await response.json() as T;
            }
            catch {
                data = null;
            }
        }

        return {
            status: status,
            success: response.ok,
            data: data
        };
    }
  //#endregion
}

//#region exports
const requestService = new RequestService();
export default requestService;
//#endregion