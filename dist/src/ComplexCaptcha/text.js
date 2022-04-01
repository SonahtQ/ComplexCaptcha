"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __importStar(require("../Tools"));
const config_1 = __importDefault(require("./config"));
class ComplexCaptchaText {
    static GenerateText(characters, length) {
        return Tools.GetRandomArrayElements(Array.from(characters), config_1.default.DetermineIntegerFromParameter(length), true).join("");
    }
    static GenerateTextUnits(cfg, text) {
        const textUnits = Array.from(text)
            .map(char => this.CreateTextUnit(false, false, char));
        if (cfg.impostors) {
            let impostorsToPlant = (() => {
                if (Math.random() < cfg.impostors.chance)
                    return config_1.default.DetermineIntegerFromParameter(cfg.impostors.count);
                return 0;
            })();
            if (cfg.impostors.convert) {
                impostorsToPlant = Math.min(impostorsToPlant, textUnits.length - 1);
                while (impostorsToPlant > 0) {
                    const arr = textUnits.filter(textUnit => !textUnit.pair && !textUnit.impostor);
                    const randTextUnit = Tools.GetRandomArrayElement(arr);
                    if (randTextUnit)
                        randTextUnit.impostor = true;
                    impostorsToPlant--;
                }
            }
            else {
                Tools.GetRandomArrayElements(Array.from(cfg.characters), impostorsToPlant, true)
                    .forEach(char => {
                    const index = Tools.GetRandomInteger(0, textUnits.length - 1);
                    textUnits.splice(index, 0, this.CreateTextUnit(true, false, char));
                });
            }
        }
        if (cfg.pairing) {
            const textUnitsToRemove = new Set();
            for (var i = 0; i < textUnits.length; i++) {
                const textUnit0 = textUnits[i];
                const textUnit1 = textUnits[i + 1];
                if (!textUnit1 || textUnit0.impostor || textUnit1.impostor)
                    continue;
                const joinedText = textUnit0.content + textUnit1.content;
                if (cfg.pairing.disallowed == false || !cfg.pairing.disallowed.includes(joinedText)) {
                    if (Math.random() < cfg.pairing.chance) {
                        textUnit0.pair = true;
                        textUnit0.content = joinedText;
                        textUnit0.mods = Math.random() <= 0.5 ? textUnit0.mods : textUnit1.mods;
                        textUnitsToRemove.add(textUnit1);
                        i++;
                    }
                }
            }
            textUnitsToRemove.forEach(textUnit => textUnits.splice(textUnits.indexOf(textUnit), 1));
        }
        textUnits.forEach((textUnit, index) => {
            textUnit.mods = this.GenTextUnitModifications(cfg, textUnit, index, textUnits);
        });
        return textUnits;
    }
    static CreateTextUnit(impostor, pair, content) {
        return {
            impostor,
            pair,
            content,
            mods: null
        };
    }
    static GenTextUnitModifications(cfg, textUnit, index, textUnits) {
        return {
            fontInfo: (() => {
                var _a, _b;
                if (cfg.fontInfo == null)
                    return null;
                if (!Array.isArray(cfg.fontInfo)) {
                    if (textUnit.pair && !((_a = cfg.fontInfo.allowForPairs) !== null && _a !== void 0 ? _a : true))
                        return null;
                    return cfg.fontInfo;
                }
                const arr = cfg.fontInfo.filter(fontInfo => {
                    var _a, _b, _c, _d;
                    if (textUnit.pair) {
                        return (((_a = fontInfo.allowForPairs) !== null && _a !== void 0 ? _a : true)
                            &&
                                !((_b = fontInfo.disallowCharacters) === null || _b === void 0 ? void 0 : _b.includes(textUnit.content[0]))
                            &&
                                !((_c = fontInfo.disallowCharacters) === null || _c === void 0 ? void 0 : _c.includes(textUnit.content[1])));
                    }
                    else {
                        return !((_d = fontInfo.disallowCharacters) === null || _d === void 0 ? void 0 : _d.includes(textUnit.content));
                    }
                });
                return (_b = Tools.GetRandomArrayElement(arr)) !== null && _b !== void 0 ? _b : null;
            })(),
            spacing: -(() => {
                if (textUnit.pair && cfg.pairing) {
                    if (cfg.pairing.squeezingPairs != null && typeof cfg.pairing.squeezingPairs[textUnit.content] != undefined)
                        return cfg.pairing.squeezingPairs[textUnit.content];
                    return cfg.pairing.defaultSqueezing;
                }
                return 0;
            })(),
            displacementV: (() => {
                if (!cfg.charDisplacementV)
                    return 0;
                if (Math.random() < cfg.charDisplacementV.chance) {
                    const direction = 1;
                    return (direction
                        *
                            Tools.GetRandomInteger(cfg.charDisplacementV.range[0], cfg.charDisplacementV.range[1]));
                }
                return 0;
            })(),
            rotation: (() => {
                if (cfg.charRotation && Math.random() < cfg.charRotation.chance) {
                    if (cfg.charRotation.excludeChars == false
                        ||
                            ((!textUnit.pair
                                &&
                                    !cfg.charRotation.excludeChars.includes(textUnit.content))
                                ||
                                    (textUnit.pair
                                        &&
                                            !cfg.charRotation.excludeChars.includes(textUnit.content[0])
                                        &&
                                            !cfg.charRotation.excludeChars.includes(textUnit.content[1])))) {
                        return Tools.GetRandomInteger(cfg.charRotation.range[0], cfg.charRotation.range[1]);
                    }
                }
                return 0;
            })(),
            deformation: (() => {
                if (!cfg.charDeformation) {
                    return { scx: 0, scy: 0, skx: 0, sky: 0 };
                }
                const mode = Math.random() < cfg.charDeformation.chance
                    ?
                        Tools.GetRandomInteger(1, 4)
                    :
                        0;
                return {
                    scx: mode != 1 ? 1 : Tools.GetRandomNumber(cfg.charDeformation.scxRange[0], cfg.charDeformation.scxRange[1]),
                    scy: mode != 2 ? 1 : Tools.GetRandomNumber(cfg.charDeformation.scyRange[0], cfg.charDeformation.scyRange[1]),
                    skx: mode != 3 ? 0 : Tools.GetRandomNumber(cfg.charDeformation.skxRange[0], cfg.charDeformation.skxRange[1]),
                    sky: mode != 4 ? 0 : Tools.GetRandomNumber(cfg.charDeformation.skyRange[0], cfg.charDeformation.skyRange[1]),
                };
            })()
        };
    }
}
exports.default = ComplexCaptchaText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Db21wbGV4Q2FwdGNoYS90ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBaUM7QUFJakMsc0RBQTRDO0FBSTVDLE1BQXFCLGtCQUFrQjtJQUNuQyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQWtCLEVBQUUsTUFBaUM7UUFDckUsT0FBTyxLQUFLLENBQUMsc0JBQXNCLENBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3RCLGdCQUFvQixDQUFDLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxFQUMxRCxJQUFJLENBQ1AsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZixDQUFDO0lBSUQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQWlCLEVBQUUsSUFBWTtRQUNwRCxNQUFNLFNBQVMsR0FBcUIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFJMUQsSUFBSyxHQUFHLENBQUMsU0FBUyxFQUFHO1lBQ2pCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLElBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTTtvQkFDckMsT0FBTyxnQkFBb0IsQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVuRixPQUFPLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFJTCxJQUFLLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFHO2dCQUN6QixnQkFBZ0IsR0FBRyxJQUFJLENB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