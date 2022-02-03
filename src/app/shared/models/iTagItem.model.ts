export interface ITagItem{
    text: string;
    price?: number;
    currency?: Currency
}

export enum Currency{
    None = "",
    Sterling = "£",
    Euro = "€"
}