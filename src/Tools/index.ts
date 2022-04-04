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

export function RandomizeArrayElementByShares<A extends {share: number}>(array: A[]) {
    const total = array.reduce((curr, x) => curr + x.share, 0);

    //

    if ( total ) {
        const relativeToTotal = array.map(x => x.share / total);

        const cumulative = relativeToTotal.map((share, i, arr) => {
            return share + arr.slice(0, i).reduce((curr, x) => curr + x, 0);
        });

        const randVal = Math.random();

        //

        for ( var i=0; i<cumulative.length; i++ ) {
            const val = cumulative[i];

            if ( randVal <= val )
                return array[i];
        }
    }

    //

    return null;
}

export function NormalizeAngle(angle: number) {
    let result = angle % 360;
    return result < 0 ? result + 360 : result;
}

export function AngleDiff(alpha: number, beta: number) {
    const phi = Math.abs(beta - alpha) % 360;
    const distance = phi > 180 ? 360 - phi : phi;

    return distance;
}

export function AngleToRadians(angle: number) {
    return (Math.PI / 180) * angle;
}

export function CalcPointOnCircle(x: number, y: number, radius: number, angle: number) {
    const px = x + radius * Math.cos(AngleToRadians(angle-90));
    const py = y + radius * Math.sin(AngleToRadians(angle-90));

    //

    return [px, py];
}