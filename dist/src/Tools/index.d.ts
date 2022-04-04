export declare function GetModuleRootDirectoryPath(): string;
export declare function DistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number;
export declare function GetRandomNumber(min: number, max: number): number;
export declare function GetRandomInteger(min: number, max: number): number;
export declare function GetRandomArrayElement<T>(arr: T[]): T | undefined;
export declare function GetRandomArrayElements<T>(arr: T[], count: number, canRepeat?: boolean): T[];
export declare function GetFolderListInDirectory(dirPath: string): string[];
export declare function RandomizeArrayElementByShares<A extends {
    share: number;
}>(array: A[]): A | null;
export declare function NormalizeAngle(angle: number): number;
export declare function AngleDiff(alpha: number, beta: number): number;
export declare function AngleToRadians(angle: number): number;
export declare function CalcPointOnCircle(x: number, y: number, radius: number, angle: number): number[];
