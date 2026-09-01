//#region imports

import CRUDManager from "./CRUDManager";

//#endregion

class CourseManager extends CRUDManager
{
    constructor()
    {
        super("/course");
    }
}

//#region exports

const courseManager = new CourseManager();

export default courseManager;

//#endregion