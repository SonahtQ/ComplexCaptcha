import * as NodeFs from "fs";
import * as NodePath from "path";

import FindPkgJson from "find-package-json";

import ComplexCaptcha from "../";

//

const rootPath = NodePath.dirname(FindPkgJson(__dirname).next().filename as string);
const outputPath = NodePath.resolve(rootPath, "./output/example1/");

const count = 10;

//

if ( NodeFs.existsSync(outputPath) )
    NodeFs.rmSync(outputPath, {recursive: true});

NodeFs.mkdirSync(outputPath, {recursive: true});

//

var generatingTime = 0;

for ( var i=0; i<count; i++ ) {
    const generatingStartedAt = performance.now();

    const data = ComplexCaptcha.Generate({
        mimeType: "image/jpeg",
        quality: 0.5,

        palette: [
            {
                background:     [0,42,87],
                foreground:     [242,233,0],
                details:        [255,51,36,0.3],
            },
            {
                background:     [27,61,34],
                foreground:     [255,255,255],
                details:        [238,138,248,0.3],
            },
            {
                background:     [64,64,64],
                foreground:     [255,255,255],
                details:        [128,128,0,0.3],
            },
            {
                background:     [255,255,255],
                foreground:     [0,0,0],
                details:        [255,0,0,0.3],
            },
            {
                background:     [0,0,0],
                foreground:     [255,255,255],
                details:        [255,0,0,0.3],
            }
        ],

        fontInfo: [
            {
                family: "MomsTypewriter",

                disallowCharacters: "01ghloOqQ"
            },
            {
                family: "Alphasmoke",

                disallowCharacters: "017gGoOqQ"
            },
            {
                family: "Dusk",

                disallowCharacters: "0123456789iIoO"
            },
            {
                family: "Spongeboy",
                
                disallowCharacters: "0127hnoO"
            },
            {
                family: "QuentinCaps",

                disallowCharacters: "01oO"
            }
        ],

        length: 6,

        impostors: {
            convert:        true,
        },

        dummies: {
            fontInfo: [
                {
                    family: "MomsTypewriter",
                },
                {
                    family: "Dusk"
                },
                {
                    family: "QuentinCaps"
                }
            ]
        }
    });

    generatingTime += (performance.now() - generatingStartedAt);

    NodeFs.writeFileSync(NodePath.resolve(outputPath, `./test_${i}__${data.solution}.jpeg`), data.buffer);
}

console.log(`Total generating time of ${count} captcha images is ${generatingTime.toFixed(2)} ms`);
console.log(`Average time is ${(generatingTime / count).toFixed(2)} ms`);