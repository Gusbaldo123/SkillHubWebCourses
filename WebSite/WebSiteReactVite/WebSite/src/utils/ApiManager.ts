class ApiManager {
  BASE_URL: string;
  //#region Handlers
  constructor() {
    this.BASE_URL = 'http://127.0.0.1:5000/api';
  }
  async fetchAPI(URL:string,dataParam:object) :Promise<Response | null> {
    
    try {
      return await fetch(URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataParam)
      })
    } catch (error) {
      return null;
    }
  }
  //#endregion
}

//#region exports
const apiManager = new ApiManager();
export default apiManager;
//#endregion