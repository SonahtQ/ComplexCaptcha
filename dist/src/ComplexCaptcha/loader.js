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
const NodePath = __importStar(require("path"));
const NodeFs = __importStar(require("fs"));
const Canvas = __importStar(require("canvas"));
const Tools = __importStar(require("../Tools"));
class ComplexCaptchaLoader {
    static LoadAssets() {
        if (this.___assetsLoaded)
            return;
        const rootDirectory = Tools.GetModuleRootDirectoryPath();
        const assetsDirectory = NodePath.resolve(rootDirectory, "./assets");
        this.LoadAssetsFonts(assetsDirectory);
        this.___assetsLoaded = true;
    }
    static LoadAssetsFonts(assetsDirectory) {
        const fontsDirectory = NodePath.resolve(assetsDirectory, "./fonts");
        const fontsFolders = Tools.GetFolderListInDirectory(fontsDirectory);
        for (const name of fontsFolders) {
            const fontFolderPath = NodePath.resolve(fontsDirectory, `./${name}`);
            const fontPath_otf = NodePath.resolve(fontFolderPath, "./font.otf");
            const fontPath_ttf = NodePath.resolve(fontFolderPath, "./font.ttf");
            const fontPath = (NodeFs.existsSync(fontPath_otf)
                ?
                    fontPath_otf
                :
                    (NodeFs.existsSync(fontPath_ttf)
                        ?
                            fontPath_ttf
                        :
                            null));
            if (fontPath) {
                this.CanvasRegisterFont(fontPath, { family: name });
            }
            else {
                console.error(`Couldn't load font "${fontFolderPath}"`);
            }
        }
    }
    static CanvasRegisterFont(path, fontFace) {
        Canvas.registerFont(path, fontFace);
    }
}
exports.default = ComplexCaptchaLoader;
ComplexCaptchaLoader.___assetsLoaded = false;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0NvbXBsZXhDYXB0Y2hhL2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQWlDO0FBQ2pDLDJDQUE2QjtBQUU3QiwrQ0FBaUM7QUFFakMsZ0RBQWlDO0FBSWpDLE1BQXFCLG9CQUFvQjtJQUtyQyxNQUFNLENBQUMsVUFBVTtRQUNiLElBQUssSUFBSSxDQUFDLGVBQWU7WUFDckIsT0FBTztRQUVYLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ3pELE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBSXBFLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7UUFJdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUVPLE1BQU0sQ0FBQyxlQUFlLENBQUMsZUFBdUI7UUFDbEQsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFcEUsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBFLEtBQU0sTUFBTSxJQUFJLElBQUksWUFBWSxFQUFHO1lBQy9CLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztZQUVyRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNwRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUVwRSxNQUFNLFFBQVEsR0FBRyxDQUNiLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO2dCQUMzQixDQUFDO29CQUNHLFlBQVk7Z0JBQ2hCLENBQUM7b0JBQ0csQ0FDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt3QkFDM0IsQ0FBQzs0QkFDRyxZQUFZO3dCQUNoQixDQUFDOzRCQUNHLElBQUksQ0FDZixDQUNaLENBQUM7WUFJRixJQUFLLFFBQVEsRUFBRztnQkFDWixJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7YUFDckQ7aUJBQ0k7Z0JBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsY0FBYyxHQUFHLENBQUMsQ0FBQzthQUMzRDtTQUNKO0lBQ0wsQ0FBQztJQUlELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFZLEVBQUUsUUFBbUQ7UUFDdkYsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7QUE3REwsdUNBOERDO0FBN0RrQixvQ0FBZSxHQUFlLEtBQUssQ0FBQyJ9