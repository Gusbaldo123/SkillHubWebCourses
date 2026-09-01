//#region imports
import CRUDManager from "./CRUDManager.js";
//#endregion

class VideoManager extends CRUDManager {
    //#region Handlers
    constructor() {
        super("/video");
    }
    //#endregion
}

//#region exports
const videoManager = new VideoManager();
export default videoManager;
//#endregion
