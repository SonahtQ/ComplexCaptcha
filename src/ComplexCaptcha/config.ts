import * as Tools from "../Tools"

import * as Types from "./types"
import * as Default from "./defaults";

//

export default class ComplexCaptchaConfig {
    static DetermineValueFromParameter<A>(param: A | A[]): A {
        if ( Array.isArray(param) ) {
            if ( !param.length )
                throw new Error("Value of param.length can't be zero.");

            return Tools.GetRandomArrayElement(param) as A;
        }

        return param;
    }

    static DetermineIntegerFromParameter(param: number | [number, number]): number {
        if ( Array.isArray(param) ) {
            return Tools.GetRandomInteger(param[0], param[1]);
        }
    
        return param;
    }

    //

    static PickPalette(cfg: Types.Config): Types.InnerPalette {
        const palette = ComplexCaptchaConfig.DetermineValueFromParameter(cfg.palette);

        const extPalette: Types.ExtendedPalette = Object.assign({
            semiTransparentBackground:  [...palette.background.slice(0, 3), 0.5] as [number, number, number, number],
            semiTransparentDetails:     [...palette.details.slice(0, 3), 0.5] as [number, number, number, number],
        }, palette);

        const innerPalette: Types.InnerPalette = {} as any;

        for ( const key in extPalette ) {
            (innerPalette as any)[key] = ComplexCaptchaConfig.ConvertColorToCssLikeColor((extPalette as any)[key]);
        }
        
        return innerPalette;
    }

    static ConvertColorToCssLikeColor(c: Types.Color) {
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3] ?? 1})`;
    }
    
    //

    static DetermineSubOptionsForConfig<A,B>(subOptions: A, defaultSubOptions: B) {
        return (
            typeof subOptions == "boolean"
                ?
                    (
                        subOptions
                            ?
                                JSON.parse(JSON.stringify(defaultSubOptions))
                            :
                                false
                    )
                :
                    Object.assign({}, defaultSubOptions, JSON.parse(JSON.stringify(subOptions)))
        )
    }
    
    static GetConfigFromOptions(options: Types.Options): Types.Config {
        if ( typeof options.characters == "string" && options.characters.length == 0 )
            throw new Error("options.characters.length cannot be zero");
        
        //
    
        const requiredOpts: Required<Types.Options> = Object.assign({}, Default.Options, JSON.parse(JSON.stringify(options)));
    
        //
    
        requiredOpts.characters = Array.from(new Set(requiredOpts.characters)).join(""); //remove duplicates
    
        //
    
        if ( !requiredOpts.palette || (Array.isArray(requiredOpts.palette) && !requiredOpts.palette.length) ) {
            requiredOpts.palette = Default.Options.palette;
        }
    
        //
    
        return Object.assign(requiredOpts, {
            charDisplacementV:      this.DetermineSubOptionsForConfig(requiredOpts.charDisplacementV, Default.CharDisplacementVOptions),
            charRotation:           this.DetermineSubOptionsForConfig(requiredOpts.charRotation, Default.CharRotationOptions),
            charDeformation:        this.DetermineSubOptionsForConfig(requiredOpts.charDeformation, Default.CharDeformation),
            
            pairing:                this.DetermineSubOptionsForConfig(requiredOpts.pairing, Default.PairingOptions),
            impostors:              this.DetermineSubOptionsForConfig(requiredOpts.impostors, Default.ImpostorsOptions),
            dirt:                   this.DetermineSubOptionsForConfig(requiredOpts.dirt, Default.DirtOptions),
            dummies:                this.DetermineSubOptionsForConfig(requiredOpts.dummies, Default.DummiesOptions),
        });
    }
}