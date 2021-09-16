export interface IVideo{
    base64String: string;
    orientation: VideoOrientation;
}

export enum VideoOrientation{
    Landscape="landscape",
    Potrait="potrait"
}