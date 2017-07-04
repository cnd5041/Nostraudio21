export interface IDictionary {
    $key?: string;
    $value?: any;
    $exists?: () => boolean;
}
