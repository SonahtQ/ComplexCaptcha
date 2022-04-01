import * as Types from "./types";
export default class ComplexCaptchaText {
    static GenerateText(characters: string, length: number | [number, number]): string;
    static GenerateTextUnits(cfg: Types.Config, text: string): Types.TextUnit[];
    private static CreateTextUnit;
    private static GenTextUnitModifications;
}
