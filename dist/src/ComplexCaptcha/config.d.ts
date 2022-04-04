import * as Types from "./types";
export default class ComplexCaptchaConfig {
    static DetermineValueFromParameter<A>(param: A | A[]): A;
    static DetermineIntegerFromParameter(param: number | [number, number]): number;
    static DetermineNumberFromParameter(param: number | [number, number]): number;
    static PickPalette(cfg: Types.Config): Types.InnerPalette;
    static ConvertColorToCssLikeColor(c: Types.Color): string;
    static DetermineSubOptionsForConfig<A, B>(subOptions: A, defaultSubOptions: B): any;
    static GetConfigFromOptions(options: Types.Options): Types.Config;
}
