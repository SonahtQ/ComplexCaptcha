import * as Types from "./types";

//

export const Options: Required<Types.Options> = {
    padding:                10,

    characters:             "abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456790",

    palette:                {
        background:     [255,255,255],
        foreground:     [0,0,0],
        details:        [255,0,0],
    },

    fontSize:               60,
    fontInfo:               null,

    length:                 6,

    charDisplacementV:      true,
    charRotation:           true,
    charDeformation:        true,

    pairing:                true,
    impostors:              true,
    dirt:                   true,
    dummies:                true
};

//

export const CharDisplacementVOptions: Required<Types.CharDisplacementVOptions> = {
    chance:     0.5,
    range:      [20, 30]
};

export const CharRotationOptions: Required<Types.CharRotationOptions> = {
    chance:         0.5,

    excludeChars:   false,

    range:          [-35, 35]
}

export const CharDeformation: Required<Types.CharDeformationOptions> = {
    chance:         0.5,

    scxRange:       [0.75, 3],
    scyRange:       [0.75, 2],
    skxRange:       [0.1, 0.5],
    skyRange:       [0.1, 0.5],
}

//

export const PairingOptions: Required<Types.PairingOptions> = {
    chance:             0.5,

    disallowed:         false,

    defaultSqueezing:   3,

    squeezingPairs:     null
}

export const ImpostorsOptions: Required<Types.ImpostorsOptions> = {
    chance:         0.5,

    count:          [1,2],

    convert:        true,

    hintRadius:     20
}

export const DirtOptions: Required<Types.DirtOptions> = {
    chance:                         1,

    chanceForLine:                  0.5,
    chanceForXorLine:               0.5,
    chanceForXorBox:                0.5,
    chanceForXorIsland:             0.5,

    count:                          [1, 3],

    lineOpacity:                    1,
    lineWidth:                      3,
    lineTension:                    0,
    lineBezier:                     true,

    xorLineWidth:                   20,

    xorIslandArmCount:              30,
    xorIslandArmRadius:             40,
    xorIslandAccentCount:           [1, 2],
    xorIslandAccentStrength:        1.5,
    xorIslandAccentSensitivity:     35
};

export const DummiesOptions: Required<Types.DummiesOptions> = {
    chance:                 0.75,

    count:                  [4, 8],
    length:                 [2, 4],

    fontPercentageSize:     0.4,
    fontInfo:               null,

    opacity:                0.65,

    rotation:               [-15, 15],
};