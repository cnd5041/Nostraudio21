export interface IDictionary {
    $key?: string;
    $value?: any;
    $exists?: () => boolean;
}

export interface IReferenceDictionary {
    [key: string]: boolean;
}
