import { environment } from "src/environments/environment"

export const APIRoutes = {
    SignIn: environment.videoApiBaseUrl + "/login",
    Logout: environment.videoApiBaseUrl + "/logout",
    UploadRawVideo: environment.videoApiBaseUrl + "/upload",
    // StreamVideo: environment.videoApiBaseUrl + "/download",
    UploadVideoEdits: environment.videoApiBaseUrl + "/download"
}