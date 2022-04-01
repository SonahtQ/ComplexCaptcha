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
        if (Array.isArray(param)) {
            return Tools.GetRandomInteger(param[0], param[1]);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0NvbXBsZXhDYXB0Y2hhL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWlDO0FBR2pDLG9EQUFzQztBQUl0QyxNQUFxQixvQkFBb0I7SUFDckMsTUFBTSxDQUFDLDJCQUEyQixDQUFJLEtBQWM7UUFDaEQsSUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFHO1lBQ3hCLElBQUssQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFFNUQsT0FBTyxLQUFLLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFNLENBQUM7U0FDbEQ7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsTUFBTSxDQUFDLDZCQUE2QixDQUFDLEtBQWdDO1FBQ2pFLElBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRztZQUN4QixPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBSUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFpQjtRQUNoQyxNQUFNLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUUsTUFBTSxVQUFVLEdBQTBCLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDcEQseUJBQXlCLEVBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQXFDO1lBQ3hHLHNCQUFzQixFQUFNLENBQUMsR0FBRyxP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