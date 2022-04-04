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
Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __importStar(require("../Tools"));
const Default = __importStar(require("./defaults"));
class ComplexCaptchaConfig {
    static DetermineValueFromParameter(param) {
        if (Array.isArray(param)) {
            if (!param.length)
                throw new Error("Value of param.length can't be zero.");
            return Tools.GetRandomArrayElement(param);
        }
        return param;
    }
    static DetermineIntegerFromParameter(param) {
        if (Array.isArray(param))
            return Tools.GetRandomInteger(param[0], param[1]);
        return param;
    }
    static DetermineNumberFromParameter(param) {
        if (Array.isArray(param))
            return Tools.GetRandomNumber(param[0], param[1]);
        return param;
    }
    static PickPalette(cfg) {
        const palette = ComplexCaptchaConfig.DetermineValueFromParameter(cfg.palette);
        const extPalette = Object.assign({
            semiTransparentBackground: [...palette.background.slice(0, 3), 0.5],
            semiTransparentDetails: [...palette.details.slice(0, 3), 0.5],
        }, palette);
        const innerPalette = {};
        for (const key in extPalette) {
            innerPalette[key] = ComplexCaptchaConfig.ConvertColorToCssLikeColor(extPalette[key]);
        }
        return innerPalette;
    }
    static ConvertColorToCssLikeColor(c) {
        var _a;
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${(_a = c[3]) !== null && _a !== void 0 ? _a : 1})`;
    }
    static DetermineSubOptionsForConfig(subOptions, defaultSubOptions) {
        return (typeof subOptions == "boolean"
            ?
                (subOptions
                    ?
                        JSON.parse(JSON.stringify(defaultSubOptions))
                    :
                        false)
            :
                Object.assign({}, defaultSubOptions, JSON.parse(JSON.stringify(subOptions))));
    }
    static GetConfigFromOptions(options) {
        if (typeof options.characters == "string" && options.characters.length == 0)
            throw new Error("options.characters.length cannot be zero");
        const requiredOpts = Object.assign({}, Default.Options, JSON.parse(JSON.stringify(options)));
        requiredOpts.characters = Array.from(new Set(requiredOpts.characters)).join("");
        if (!requiredOpts.palette || (Array.isArray(requiredOpts.palette) && !requiredOpts.palette.length)) {
            requiredOpts.palette = Default.Options.palette;
        }
        return Object.assign(requiredOpts, {
            charDisplacementV: this.DetermineSubOptionsForConfig(requiredOpts.charDisplacementV, Default.CharDisplacementVOptions),
            charRotation: this.DetermineSubOptionsForConfig(requiredOpts.charRotation, Default.CharRotationOptions),
            charDeformation: this.DetermineSubOptionsForConfig(requiredOpts.charDeformation, Default.CharDeformation),
            pairing: this.DetermineSubOptionsForConfig(requiredOpts.pairing, Default.PairingOptions),
            impostors: this.DetermineSubOptionsForConfig(requiredOpts.impostors, Default.ImpostorsOptions),
            dirt: this.DetermineSubOptionsForConfig(requiredOpts.dirt, Default.DirtOptions),
            dummies: this.DetermineSubOptionsForConfig(requiredOpts.dummies, Default.DummiesOptions),
        });
    }
}
exports.default = ComplexCaptchaConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0NvbXBsZXhDYXB0Y2hhL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWlDO0FBR2pDLG9EQUFzQztBQUl0QyxNQUFxQixvQkFBb0I7SUFDckMsTUFBTSxDQUFDLDJCQUEyQixDQUFJLEtBQWM7UUFDaEQsSUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFHO1lBQ3hCLElBQUssQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFFNUQsT0FBTyxLQUFLLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFNLENBQUM7U0FDbEQ7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsTUFBTSxDQUFDLDZCQUE2QixDQUFDLEtBQWdDO1FBQ2pFLElBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDckIsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxNQUFNLENBQUMsNEJBQTRCLENBQUMsS0FBZ0M7UUFDaEUsSUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUNyQixPQUFPLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFJRCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQWlCO1FBQ2hDLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FB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