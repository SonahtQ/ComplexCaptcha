import * as Tools from "../Tools"

import * as Types from "./types";

import ComplexCaptchaConfig from "./config";

//

export default class ComplexCaptchaText {
    static GenerateText(characters: string, length: number | [number, number]) {
        return Tools.GetRandomArrayElements(
            Array.from(characters),
            ComplexCaptchaConfig.DetermineIntegerFromParameter(length),
            true
        ).join("");
    }

    //

    static GenerateTextUnits(cfg: Types.Config, text: string) {
        const textUnits: Types.TextUnit[] = Array.from(text)
            .map(char => this.CreateTextUnit(false, false, char));

        //

        if ( cfg.impostors ) {
            let impostorsToPlant = (() => {
                if ( Math.random() < cfg.impostors.chance )
                    return ComplexCaptchaConfig.DetermineIntegerFromParameter(cfg.impostors.count);

                return 0;
            })();

            //

            if ( cfg.impostors.convert ) {
                impostorsToPlant = Math.min(impostorsToPlant, textUnits.length-1);

                while ( impostorsToPlant > 0 ) {
                    const arr = textUnits.filter(textUnit => !textUnit.pair && !textUnit.impostor);
                    const randTextUnit = Tools.GetRandomArrayElement(arr);

                    if ( randTextUnit )
                        randTextUnit.impostor = true;

                    impostorsToPlant--;
                }
            }
            else {
                Tools.GetRandomArrayElements(Array.from(cfg.characters), impostorsToPlant, true)
                    .forEach(char => {
                        const index = Tools.GetRandomInteger(0, textUnits.length-1);
                        textUnits.splice(index, 0, this.CreateTextUnit(true, false, char));
                    });
            }
        }

        //

        if ( cfg.pairing ) {
            const textUnitsToRemove = new Set<Types.TextUnit>();

            //

            for ( var i=0; i<textUnits.length; i++ ) {
                const textUnit0 = textUnits[i];
                const textUnit1 = textUnits[i + 1];

                if ( !textUnit1 || textUnit0.impostor || textUnit1.impostor )
                    continue;

                //

                const joinedText = textUnit0.content + textUnit1.content;

                if ( cfg.pairing.disallowed == false || !cfg.pairing.disallowed.includes(joinedText) ) {
                    if ( Math.random() < cfg.pairing.chance ) {
                        textUnit0.pair = true;
                        textUnit0.content = joinedText;
                        textUnit0.mods = Math.random() <= 0.5 ? textUnit0.mods : textUnit1.mods;

                        textUnitsToRemove.add(textUnit1);
                        i++;
                    }
                }
            }

            //

            textUnitsToRemove.forEach(textUnit => textUnits.splice(textUnits.indexOf(textUnit), 1));
        }

        //

        textUnits.forEach((textUnit, index) => {
            textUnit.mods = this.GenTextUnitModifications(cfg, textUnit, index, textUnits);
        });

        //

        return textUnits;
    }

    private static CreateTextUnit(impostor: boolean, pair: boolean, content: string): Types.TextUnit {
        return {
            impostor,
            pair,
            
            content,

            mods:       null as any
        };
    }

    private static GenTextUnitModifications(cfg: Types.Config, textUnit: Types.TextUnit, index: number, textUnits: Types.TextUnit[]): Types.TextUnitMod {
        return {
            fontInfo: (() => {
                if ( cfg.fontInfo == null )
                    return null;
                
                if ( !Array.isArray(cfg.fontInfo) ) {
                    if ( textUnit.pair && !(cfg.fontInfo.allowForPairs ?? true) )
                        return null;

                    return cfg.fontInfo;
                }
                    
                const arr = cfg.fontInfo.filter(fontInfo => {
                    if ( textUnit.pair ) {
                        return (
                            (fontInfo.allowForPairs ?? true)
                            &&
                            !fontInfo.disallowCharacters?.includes(textUnit.content[0])
                            &&
                            !fontInfo.disallowCharacters?.includes(textUnit.content[1])
                        );
                    }
                    else {
                        return !fontInfo.disallowCharacters?.includes(textUnit.content);
                    }
                });

                return Tools.GetRandomArrayElement(arr) ?? null;
            })(),

            //

            spacing: -(() => {
                if ( textUnit.pair && cfg.pairing ) {
                    if ( cfg.pairing.squeezingPairs != null && typeof cfg.pairing.squeezingPairs[textUnit.content] != undefined )
                        return cfg.pairing.squeezingPairs[textUnit.content];

                    return cfg.pairing.defaultSqueezing;
                }

                return 0;
            })(),

            //
            
            displacementV: (() => {
                if ( !cfg.charDisplacementV )
                    return 0;

                if ( Math.random() < cfg.charDisplacementV.chance ) {
                    const direction = 1; //((Math.random() < 0.5) ? -1 : 1);

                    return (
                        direction
                        *
                        Tools.GetRandomInteger(cfg.charDisplacementV.range[0], cfg.charDisplacementV.range[1])
                    );
                }

                return 0;
            })(),

            //

            rotation: (() => {
                if ( cfg.charRotation && Math.random() < cfg.charRotation.chance ) {
                    if ( 
                        cfg.charRotation.excludeChars == false
                        ||
                        (
                            (
                                !textUnit.pair
                                &&
                                !cfg.charRotation.excludeChars.includes(textUnit.content)
                            )
                            ||
                            (
                                textUnit.pair
                                &&
                                !cfg.charRotation.excludeChars.includes(textUnit.content[0])
                                &&
                                !cfg.charRotation.excludeChars.includes(textUnit.content[1])
                            )
                        )
                    ) {
                        return Tools.GetRandomInteger(cfg.charRotation.range[0], cfg.charRotation.range[1]);
                    }
                }

                return 0;
            })(),

            //

            deformation: (() => {
                if ( !cfg.charDeformation ) {
                    return {scx: 0, scy: 0, skx: 0, sky: 0};
                }

                //

                const mode = Math.random() < cfg.charDeformation.chance
                    ?
                        Tools.GetRandomInteger(1, 4)
                    :
                        0;

                //

                return {
                    scx:  mode != 1 ? 1 : Tools.GetRandomNumber(cfg.charDeformation.scxRange[0], cfg.charDeformation.scxRange[1]),
                    scy:  mode != 2 ? 1 : Tools.GetRandomNumber(cfg.charDeformation.scyRange[0], cfg.charDeformation.scyRange[1]),
                    skx:  mode != 3 ? 0 : Tools.GetRandomNumber(cfg.charDeformation.skxRange[0], cfg.charDeformation.skxRange[1]),
                    sky:  mode != 4 ? 0 : Tools.GetRandomNumber(cfg.charDeformation.skyRange[0], cfg.charDeformation.skyRange[1]),
                };
            })()
        }
    }
}