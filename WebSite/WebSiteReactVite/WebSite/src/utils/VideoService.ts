//#region imports
import RequestService from "./RequestService";
import HttpMethod from "../model/HTTPMethods";
import type { CourseVideo } from "../model/Video";
//#endregion

class VideoService {
    endpoint: string = "/video";

    toCourseVideo = (data: any): CourseVideo | null => {
        if (!data) return null;
        const video: CourseVideo = {
            id: data.id ?? null,
            idCourse: data.fkCourseId ?? null,
            videoUrl: data.videoUrl ?? "",
            videoTitle: data.videoTitle ?? ""
        };
        return video;
    }

    //#region Requests

    async getAllByCourseId(idCourse: number): Promise<CourseVideo[] | null> {
        let response = await RequestService.parseResponse<CourseVideo[]>(await RequestService.fetchAPI(`${this.endpoint}/course/${idCourse}`, HttpMethod.GET, null));
        if (!response) return null;
        if (!response.success) throw new Error(`Failed to get videos: ${response.status}`);
        if (!Array.isArray(response.data)) return null;
        let videos: CourseVideo[] = [];
        videos = response.data.map((videoData: CourseVideo) =>
            this.toCourseVideo(videoData)).filter((video: CourseVideo | null): video is CourseVideo => video !== null);
        return videos;
    }

    async getById(id: number): Promise<CourseVideo | null> {
        let response = await RequestService.parseResponse<CourseVideo>(await RequestService.fetchAPI(`${this.endpoint}/${id}`, HttpMethod.GET, null));
        if (!response) return null;
        if (!response.success) throw new Error(`Failed to get video: ${response.status}`);
        if(!response.data) return null;
        return this.toCourseVideo(response.data);
    }

    async addVideo(data: CourseVideo): Promise<CourseVideo | null> {
        let response = await RequestService.parseResponse<CourseVideo>(await RequestService.fetchAPI(this.endpoint, HttpMethod.POST, data));
        if (!response) return null;
        if (!response.success) throw new Error(`Failed to add video: ${response.status}`);
        if (!response.data)
            throw new Error("Failed to add video: No data received");
        return this.toCourseVideo(response.data);
    }

    async updateVideo(data: CourseVideo): Promise<CourseVideo | null> {
        let response = await RequestService.parseResponse<CourseVideo>(await RequestService.fetchAPI(this.endpoint, HttpMethod.PUT, data));
        if (!response) return null;
        if (!response.success) throw new Error(`Failed to update video: ${response.status}`);
        if (!response.data)
            throw new Error("Failed to update video: No data received");
        return this.toCourseVideo(response.data);
    }

    async deleteById(id: number): Promise<void> {
        let response = await RequestService.parseResponse(await RequestService.fetchAPI(`${this.endpoint}/${id}`, HttpMethod.DELETE, null));
        if (!response) return;
        if (response.success !== true) throw new Error(`Failed to delete video: ${response.status}`);
    }
    //#endregion
}

//#region exports
const videoService = new VideoService();
export default videoService;
//#endregion