import * as NodeFs from "fs";
import * as NodePath from "path";

import FindPkgJson from "find-package-json";

//

export function GetModuleRootDirectoryPath() {
    return NodePath.dirname(FindPkgJson(__dirname).next().filename as string);
}

export function DistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((Math.pow(x2-x1,2))+(Math.pow(y2-y1,2)));
}

export function GetRandomNumber(min: number, max: number): number {
    return (Math.random() * (max - min) + min);
}

export function GetRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function GetRandomArrayElement<T>(arr: T[]) {
    if ( arr.length )
        return arr[Math.floor(Math.random()*arr.length)];
}

export function GetRandomArrayElements<T>(arr: T[], count: number, canRepeat: boolean = true) {
    if ( !canRepeat || !arr.length )
        count = Math.min(count, arr.length);

    //

    const source = canRepeat ? arr : Array.from(arr);

    return new Array(count).fill(0).map(x => {
        const randIndex = Math.floor(Math.random()*source.length);
        
        return canRepeat ? source[randIndex] : source.splice(randIndex, 1)[0];
    });
}

export function GetFolderListInDirectory(dirPath: string) {
    const files = NodeFs.readdirSync(dirPath, {withFileTypes: true});
    
    return files
        .filter(file => file.isDirectory())
        .map(file => file.name);
}