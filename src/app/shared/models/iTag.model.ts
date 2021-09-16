import { ITagItem } from "./iTagItem.model";

export interface ITag {
    name: string;
    topItem: ITagItem;
    bottomItem?: ITagItem;
}