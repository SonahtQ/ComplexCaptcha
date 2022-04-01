/// <reference types="node" />
import Konva from "konva/cmj";
export declare type KonvaTextWithTextUnit = Konva.Text & {
    textUnit: TextUnit;
};
export interface GenerateOptions extends Options {
    mimeType: "image/png" | "image/jpeg";
    quality?: number;
}
export interface Options {
    padding?: number;
    characters?: string;
    palette?: Palette | Palette[];
    fontSize?: number;
    fontInfo?: null | FrontFontInfo | FrontFontInfo[];
    length?: number | [number, number];
    charDisplacementV?: boolean | CharDisplacementVOptions;
    charRotation?: boolean | CharRotationOptions;
    charDeformation?: boolean | CharDeformationOptions;
    pairing?: boolean | PairingOptions;
    impostors?: boolean | ImpostorsOptions;
    dirt?: boolean | DirtOptions;
    dummies?: boolean | DummiesOptions;
}
export declare type Color = [number, number, number] | [number, number, number, number];
export interface Palette {
    background: Color;
    foreground: Color;
    details: Color;
}
export interface ExtendedPalette extends Palette {
    semiTransparentBackground: Color;
    semiTransparentDetails: Color;
}
export declare type InnerPalette = {
    [P in keyof ExtendedPalette]: string;
};
export interface FontInfo {
    family: string;
}
export interface FrontFontInfo extends FontInfo {
    allowRotation?: boolean;
    allowDeformation?: boolean;
    allowForPairs?: boolean;
    disallowCharacters?: string;
}
export interface CharDisplacementVOptions {
    chance?: number;
    range?: [number, number];
}
export interface CharRotationOptions {
    chance?: number;
    excludeChars?: false | string;
    range?: [number, number];
}
export interface CharDeformationOptions {
    chance?: number;
    scxRange?: [number, number];
    scyRange?: [number, number];
    skxRange?: [number, number];
    skyRange?: [number, number];
}
export interface PairingOptions {
    chance?: number;
    disallowed?: false | string[];
    defaultSqueezing?: number;
    squeezingPairs?: null | Record<string, number>;
}
export interface ImpostorsOptions {
    chance?: number;
    count?: number | [number, number];
    convert?: boolean;
    hintRadius?: number;
}
export interface DirtOptions {
    chance?: number;
    count?: number | [number, number];
    lineOpacity?: number;
    lineWidth?: number;
    lineTension?: number;
    lineBezier?: boolean;
}
export interface DummiesOptions {
    chance?: number;
    count?: number | [number, number];
    length?: number | [number, number];
    fontPercentageSize?: number;
    fontInfo?: null | FontInfo | FontInfo[];
    opacity?: number;
    rotation?: false | [number, number];
}
export interface Config extends Required<Options> {
    charDisplacementV: false | Required<CharDisplacementVOptions>;
    charRotation: false | Required<CharRotationOptions>;
    charDeformation: false | Required<CharDeformationOptions>;
    pairing: false | Required<PairingOptions>;
    impostors: false | Required<ImpostorsOptions>;
    dirt: false | Required<DirtOptions>;
    dummies: false | Required<DummiesOptions>;
}
export interface TextUnit {
    impostor: boolean;
    pair: boolean;
    content: string;
    mods: TextUnitMod;
}
export interface TextUnitMod {
    fontInfo: null | FrontFontInfo;
    spacing: number;
    displacementV: number;
    rotation: number;
    deformation: TextUnitModDeformation;
}
export interface TextUnitModDeformation {
    scx: number;
    scy: number;
    skx: number;
    sky: number;
}
export interface GeneratedCaptcha {
    text: string;
    solution: string;
    buffer: Buffer;
    instructions: Instructions;
}
export interface Instructions {
    maxLength: number;
    omitMarked: boolean;
    omitBackgroundText: boolean;
}
