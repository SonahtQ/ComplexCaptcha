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
const NodeFs = __importStar(require("fs"));
const NodePath = __importStar(require("path"));
const find_package_json_1 = __importDefault(require("find-package-json"));
const index_1 = __importDefault(require("../src/index"));
const rootPath = NodePath.dirname((0, find_package_json_1.default)(__dirname).next().filename);
const outputPath = NodePath.resolve(rootPath, "./output/example1/");
const count = 10;
if (NodeFs.existsSync(outputPath))
    NodeFs.rmSync(outputPath, { recursive: true });
NodeFs.mkdirSync(outputPath, { recursive: true });
var generatingTime = 0;
for (var i = 0; i < count; i++) {
    const generatingStartedAt = performance.now();
    const data = index_1.default.Generate({
        mimeType: "image/jpeg",
        quality: 0.5,
        palette: [
            {
                background: [0, 42, 87],
                foreground: [242, 233, 0],
                details: [255, 51, 36, 0.3],
            },
            {
                background: [27, 61, 34],
                foreground: [255, 255, 255],
                details: [238, 138, 248, 0.3],
            },
            {
                background: [64, 64, 64],
                foreground: [255, 255, 255],
                details: [128, 128, 0, 0.3],
            },
            {
                background: [255, 255, 255],
                foreground: [0, 0, 0],
                details: [255, 0, 0, 0.3],
            },
            {
                background: [0, 0, 0],
                foreground: [255, 255, 255],
                details: [255, 0, 0, 0.3],
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
            convert: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZXhhbXBsZXMvaW5kZXgxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsK0NBQWlDO0FBRWpDLDBFQUE0QztBQUU1Qyx5REFBMEM7QUFJMUMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFBLDJCQUFXLEVBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBa0IsQ0FBQyxDQUFDO0FBQ3BGLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFFcEUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBSWpCLElBQUssTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7SUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUVqRCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBSWhELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV2QixLQUFNLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFHO0lBQzFCLE1BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRTlDLE1BQU0sSUFBSSxHQUFHLGVBQWMsQ0FBQyxRQUFRLENBQUM7UUFDakMsUUFBUSxFQUFFLFlBQVk7UUFDdEIsT0FBTyxFQUFFLEdBQUc7UUFFWixPQUFPLEVBQUU7WUFDTDtnQkFDSSxVQUFVLEVBQU0sQ0FBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztnQkFDekIsVUFBVSxFQUFNLENBQUMs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