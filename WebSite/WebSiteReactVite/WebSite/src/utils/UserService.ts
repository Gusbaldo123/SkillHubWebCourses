//#region imports

import HttpMethod from "../model/HTTPMethods.js";
import RequestService from "./RequestService.js";
import { ToUser, type User } from "../model/User.js";

//#endregion

class UserService {
    endpoint: string = "/user";

    //#region Handlers

    //#region Requests
    getById = async (userId: number): Promise<User | null> => {
        const response = await RequestService.parseResponse<User>(await RequestService.fetchAPI(`${this.endpoint}/${userId}`, HttpMethod.GET, null));
        if (!response)
            throw new Error("Failed to fetch user data: No response received");

        if (!response.success)
            throw new Error(`Failed to get user by ID: ${response.status}`);

        return ToUser(response.data);
    }

    getByEmail = async (email: string): Promise<User | null> => {
        const response = await RequestService.parseResponse<User>(await RequestService.fetchAPI(`${this.endpoint}/email/${email}`, HttpMethod.GET, null));
        if (!response)
            throw new Error("Failed to fetch user data: No response received");

        if (!response.success)
            throw new Error(`Failed to get user by email: ${response.status}`);

        return ToUser(response.data);
    }

    addUser = async (user: User): Promise<User | null> => {
        const response = await RequestService.parseResponse<User>(await RequestService.fetchAPI(`${this.endpoint}`, HttpMethod.POST, user));
        if (!response)
            throw new Error("Failed to create user: No response received");

        if (!response.success)
            throw new Error(`Failed to create user: ${response.status}`);

        if (!response.data)
            throw new Error("Failed to create user: No data received");

        return ToUser(response.data);
    }

    updateUser = async (user: User): Promise<User | null> => {
        const response = await RequestService.parseResponse<User>(await RequestService.fetchAPI(`${this.endpoint}/${user.id}`, HttpMethod.PUT, user));
        if (!response)
            throw new Error("Failed to update user: No response received");

        if (!response.success)
            throw new Error(`Failed to update user: ${response.status}`);

        if (!response.data)
            throw new Error("Failed to update user: No data received");

        return ToUser(response.data);
    }

    deleteById = async (userId: number): Promise<void> => {
        const response = await RequestService.parseResponse<User>(await RequestService.fetchAPI(`${this.endpoint}/${userId}`, HttpMethod.DELETE, null));
        if (!response)
            throw new Error("Failed to delete user: No response received");

        if (!response.success)
            throw new Error(`Failed to delete user: ${response.status}`);
    }
    //#endregion

    //#endregion
}

//#region exports

const userService = new UserService();

export default userService;

//#endregion