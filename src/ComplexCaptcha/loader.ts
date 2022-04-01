import * as NodePath from "path";
import * as NodeFs from "fs";

import * as Canvas from "canvas";

import * as Tools from "../Tools"

//

export default class ComplexCaptchaLoader {
    private static ___assetsLoaded:    boolean = false;

    //

    static LoadAssets() {
        if ( this.___assetsLoaded )
            return;

        const rootDirectory = Tools.GetModuleRootDirectoryPath();
        const assetsDirectory = NodePath.resolve(rootDirectory, "./assets");

        //
        
        this.LoadAssetsFonts(assetsDirectory);

        //

        this.___assetsLoaded = true;
    }

    private static LoadAssetsFonts(assetsDirectory: string) {
        const fontsDirectory = NodePath.resolve(assetsDirectory, "./fonts");

        const fontsFolders = Tools.GetFolderListInDirectory(fontsDirectory);

        for ( const name of fontsFolders ) {
            const fontFolderPath = NodePath.resolve(fontsDirectory, `./${name}`);

            const fontPath_otf = NodePath.resolve(fontFolderPath, "./font.otf");
            const fontPath_ttf = NodePath.resolve(fontFolderPath, "./font.ttf");

            const fontPath = (
                NodeFs.existsSync(fontPath_otf)
                    ?
                        fontPath_otf
                    :
                        (
                            NodeFs.existsSync(fontPath_ttf)
                                ?
                                    fontPath_ttf
                                :
                                    null
                        )
            );

            //

            if ( fontPath ) {
                this.CanvasRegisterFont(fontPath, {family: name});
            }
            else {
                console.error(`Couldn't load font "${fontFolderPath}"`);
            }
        }
    }

    //

    static CanvasRegisterFont(path: string, fontFace: Parameters<typeof Canvas.registerFont>[1]) {
        Canvas.registerFont(path, fontFace);
    }
}