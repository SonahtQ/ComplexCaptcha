import * as Canvas from "canvas";
import Konva from "konva/cmj";

import * as Tools from "../Tools"

import * as Types from "./types";

import ComplexCaptchaLoader from "./loader";
import ComplexCaptchaConfig from "./config";
import ComplexCaptchaText from "./text";

//

export {Types};

//

export default class ComplexCaptcha {
    static get Loader() {
        return ComplexCaptchaLoader;
    }

    //

    static Generate(options: Types.GenerateOptions): Types.GeneratedCaptcha {
        const captcha = new ComplexCaptcha(options);

        //

        const dataURL = captcha.$stage.toDataURL({ pixelRatio: 1, mimeType: options.mimeType, quality: options.quality ?? 0.75 });
        const data = dataURL.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, "base64");

        //

        return {
            text:           captcha.text,
            solution:       captcha.solution,

            buffer,

            instructions:   captcha.instructions
        };
    }

    //

    private readonly            cfg:                Types.Config;

    private readonly            palette:            Types.InnerPalette;

    private                     text:               string;
    private                     solution:           string;
    private                     instructions:       Types.Instructions;

    private readonly            canvas:             Canvas.Canvas;

    private readonly            $stage:             Konva.Stage;

    private readonly            $layerBackground1:  Konva.Layer;
    private readonly            $layerBackground2:  Konva.Layer;
    private readonly            $layerMain1:        Konva.Layer;
    private readonly            $layerDetails1:     Konva.Layer;

    private                     $dummiesShape:      Konva.Group;
    private                     $textShape:         Konva.Group;
    private                     $dirtShape:         Konva.Group;

    //

    private constructor(options: Types.Options = {}) {
        this.cfg = ComplexCaptchaConfig.GetConfigFromOptions(options);

        //

        this.text = ComplexCaptchaText.GenerateText(this.cfg.characters, this.cfg.length);

        //

        this.palette = ComplexCaptchaConfig.PickPalette(this.cfg);

        //

        this.canvas = Canvas.createCanvas(1, 1);

        //

        this.$stage = new Konva.Stage({
            listening:  false,

            //

            container:  this.canvas as any,
            
            width:      0,
            height:     0,
        });

        this.$layerBackground1 = new Konva.Layer({listening: false, perfectDrawEnabled: false});
        this.$layerBackground2 = new Konva.Layer({listening: false, perfectDrawEnabled: false});
        this.$layerMain1 = new Konva.Layer({listening: false});
        this.$layerDetails1 = new Konva.Layer({listening: false, perfectDrawEnabled: false});

        //

        this.$stage.add(this.$layerBackground1);
        this.$stage.add(this.$layerBackground2);
        this.$stage.add(this.$layerMain1);
        this.$stage.add(this.$layerDetails1);

        //

        this.$dummiesShape = new Konva.Group({
            listening:          false,
            perfectDrawEnabled: false,

            //

            x: 0, y: 0
        })

        this.$layerBackground2.add(this.$dummiesShape);

        //

        this.$textShape = new Konva.Group({
            listening:  false,

            //

            x:          this.cfg.padding,
            y:          this.cfg.padding
        });

        this.$layerMain1.add(this.$textShape);

        //

        this.$dirtShape = new Konva.Group({
            listening:              false,
            perfectDrawEnabled:     false,

            //

            x: 0, y: 0
        });

        this.$layerMain1.add(this.$dirtShape);

        //

        this.render();

        //

        const textUnits = this.$textShape.getChildren()
            .map($textUnitShape => ($textUnitShape as Types.KonvaTextWithTextUnit).textUnit);

        this.text = textUnits
            .map(textUnit => textUnit.content)
            .join("");

        this.solution = textUnits
            .filter(textUnit => !textUnit.impostor)
            .map(textUnit => textUnit.content)
            .join("");

        //

        this.instructions = {
            maxLength:          this.text.length,

            omitBackgroundText: this.$dummiesShape.getChildren().length > 0,
            omitMarked:         textUnits.some(textUnit => textUnit.impostor),
        };
    }

    //

    private render() {
        this.renderText();
        this.renderAdjustStageSize();

        this.renderBackground();
        this.renderDirt();
        this.renderDummies();
    }

    private renderBackground() {
        const stageSize = this.$stage.size();

        //

        this.$layerBackground1.clear();

        //

        const $rect = new Konva.Rect({
            perfectDrawEnabled:     false,
            listening:              false,

            //

            x:          0,
            y:          0,
            
            width:      stageSize.width,
            height:     stageSize.height,

            fill:       this.palette.background
        });

        //

        this.$layerBackground1.add($rect);
    }

    private renderAdjustStageSize() {
        const bbox = this.$textShape.getClientRect();

        const newSize = {
            width:  bbox.width + (this.cfg.padding * 2),
            height: bbox.height + (this.cfg.padding * 2)
        };

        //

        this.$stage.size(newSize);
    }

    private renderText() {
        this.$textShape.removeChildren();

        const textUnits = ComplexCaptchaText.GenerateTextUnits(this.cfg, this.text);
        
        //

        this.renderTextUnitsToTextShape(textUnits);
        this.renderTextSetPositions();
        this.renderImpostorsMarks();
    }

    private renderTextUnitsToTextShape(textUnits: Types.TextUnit[]) {
        this.$textShape.add(
            ...textUnits.map((textUnit) => this.renderTextUnitToShape(textUnit))
        );
    }

    private renderTextUnitToShape(textUnit: Types.TextUnit) {     
        const $textUnitShape = new Konva.Text({
            listening:                  false,

            //

            text:                       textUnit.content,
            letterSpacing:              typeof textUnit.mods.spacing == "number" ? textUnit.mods.spacing : 0,

            fill:                       this.palette.foreground,

            fontSize:                   this.cfg.fontSize,
            fontFamily:                 textUnit.mods.fontInfo?.family ?? undefined,

            stroke:                     this.palette.semiTransparentBackground,
            strokeWidth:                5,
            fillAfterStrokeEnabled:     true
        });

        ($textUnitShape as Types.KonvaTextWithTextUnit).textUnit = textUnit;

        //

        const textUnitShapeBBox = $textUnitShape.getClientRect();

        $textUnitShape.offsetX(textUnitShapeBBox.width/2);
        $textUnitShape.offsetY(textUnitShapeBBox.height/2);

        //

        $textUnitShape.y(typeof textUnit.mods.displacementV == "number" ? textUnit.mods.displacementV : 0);

        if ( textUnit.mods.fontInfo?.allowRotation ?? true ) {
            $textUnitShape.rotation(typeof textUnit.mods.rotation == "number" ? textUnit.mods.rotation : 0);
        }

        if ( textUnit.mods.fontInfo?.allowDeformation ?? true ) {
            $textUnitShape.scaleX(textUnit.mods.deformation.scx);
            $textUnitShape.scaleY(textUnit.mods.deformation.scy);
            $textUnitShape.skewX(textUnit.mods.deformation.skx);
            $textUnitShape.skewY(textUnit.mods.deformation.sky);
        }

        //

        return $textUnitShape;
    }

    //

    private renderTextSetPositions() {
        const shapes = this.$textShape.getChildren();

        //

        for ( var i=1; i<shapes.length; i++ ) {
            const a = shapes[i-1];
            const b = shapes[i];

            const aBox = a.getClientRect();
            const bBox = b.getClientRect();

            const diff = (aBox.x + aBox.width) - bBox.x;

            b.position({
                x: b.position().x + diff,
                y: b.position().y
            });
        }

        //

        const textShapeAbsPos = this.$textShape.absolutePosition();
        const textShapeBBox = this.$textShape.getClientRect();

        const diff = {
            x:      textShapeAbsPos.x - textShapeBBox.x,
            y:      textShapeAbsPos.y - textShapeBBox.y,
        };

        this.$textShape.offsetX(this.$textShape.offsetX() - diff.x);
        this.$textShape.offsetY(this.$textShape.offsetY() - diff.y);
    }

    private renderImpostorsMarks() {
        if ( !this.cfg.impostors )
            return;

        //

        for ( const $textUnitShape of this.$textShape.getChildren() ) {
            const textUnit = ($textUnitShape as Types.KonvaTextWithTextUnit).textUnit;

            if ( textUnit.impostor )
                this.renderImpostorMark($textUnitShape as Types.KonvaTextWithTextUnit);
        }
    }

    private renderImpostorMark($textUnitShape: Types.KonvaTextWithTextUnit) {
        if ( !this.cfg.impostors )
            return;

        //

        const $textUnitShapeBBox = $textUnitShape.getClientRect();

        //

        const $textUnitShapeFalseDot = new Konva.Circle({
            listening:          false,
            perfectDrawEnabled: false,

            //

            x:                  $textUnitShapeBBox.x + $textUnitShapeBBox.width/2,
            y:                  $textUnitShapeBBox.y + $textUnitShapeBBox.height/2,

            radius:             this.cfg.impostors.hintRadius,

            offsetX:            0,
            offsetY:            0,

            fill:               this.palette.semiTransparentDetails,
        });

        //

        this.$layerDetails1.add($textUnitShapeFalseDot);
    }

    //

    private renderDirt() {
        if ( !this.cfg.dirt )
            return;

        //

        this.$dirtShape.removeChildren();

        //

        if ( !(Math.random() < this.cfg.dirt.chance) )
            return;

        //

        const count = ComplexCaptchaConfig.DetermineIntegerFromParameter(this.cfg.dirt.count);

        //

        for ( var i=0; i<count; i++ ) {
            const type = Math.random() < 0.5;

            if ( type )
                this.renderDirtLine();
            else
                this.renderDirtXorBox();
        }
    }

    private renderDirtXorBox() {
        if ( !this.cfg.dirt )
            return;

        //

        const points = new Array(2).fill(0).map(_ => {
            return {
                x:      Tools.GetRandomNumber(0, this.$stage.width()),
                y:      Tools.GetRandomNumber(0, this.$stage.height()),
            }
        });

        const lowerX = Math.min(points[0].x, points[1].x);
        const higherX = Math.max(points[0].x, points[1].x);

        const lowerY = Math.min(points[0].y, points[1].y);
        const higherY = Math.max(points[0].y, points[1].y);

        const x = lowerX;
        const y = lowerY;
        const width = higherX - lowerX;
        const height = higherY - lowerY;

        //

        this.$dirtShape.add(new Konva.Rect({
            listening:                      false,
            perfectDrawEnabled:             false,

            //

            x, y,
            width, height,

            fill:                           this.palette.foreground,

            globalCompositeOperation:       "xor"
        }));
    }

    private renderDirtLine() {
        if ( !this.cfg.dirt )
            return;

        //

        const textUnitShapesArr = this.$textShape.getChildren();

        let pointCount = Math.round(textUnitShapesArr.length * 0.65);

        //

        const selectedShapesArr = Tools.GetRandomArrayElements(
            textUnitShapesArr,
            pointCount,
            false
        );

        const targetsBBoxes = selectedShapesArr
            .map(shape => shape.getClientRect())
            .sort((a,b) => a.x - b.x);

        const randPositions = targetsBBoxes
            .map(bbox => {
                return new Array(2).fill(0)
                    .map(x => {
                        return [
                            Tools.GetRandomNumber(bbox.x, bbox.x + bbox.width),
                            Tools.GetRandomNumber(bbox.y, bbox.y + bbox.height)
                        ];
                    })
                    .sort((a,b) => {
                        if ( a[0] - b[0] == 0 ) {
                            return a[1] - b[1];
                        }
                        
                        return a[0] - b[0];
                    });
            });

        const points = randPositions.flat(2);

        //

        points.unshift(
            Tools.GetRandomNumber(-500, -200),
            Tools.GetRandomNumber(-50, this.$stage.height() + 50),

            Tools.GetRandomNumber(-50, -10),
            Tools.GetRandomNumber(-50, this.$stage.height() + 50),
        );

        points.push(
            Tools.GetRandomNumber(this.$stage.width() + 10, this.$stage.width() + 50),
            Tools.GetRandomNumber(-50, this.$stage.height() + 50),

            Tools.GetRandomNumber(this.$stage.width() + 200, this.$stage.width() + 500),
            Tools.GetRandomNumber(-50, this.$stage.height() + 50),
        );

        //

        const $line = new Konva.Line({
            listening:                  false,
            perfectDrawEnabled:         false,

            //

            points,

            shadowColor:                this.palette.semiTransparentBackground,
            shadowBlur:                 2,
            shadowOpacity:              1,
            shadowOffset:               {x: 3, y: 3},

            stroke:                     this.palette.foreground,
            strokeWidth:                this.cfg.dirt.lineWidth,
        
            opacity:                    this.cfg.dirt.lineOpacity,

            lineCap:                    'round',
            lineJoin:                   'round',

            tension:                    this.cfg.dirt.lineTension ?? undefined,
            bezier:                     this.cfg.dirt.lineBezier,
        });

        this.$dirtShape.add($line);
    }

    //

    private renderDummies() {
        if ( !this.cfg.dummies ) 
            return;

        //

        if ( !(Math.random() < this.cfg.dummies.chance) )
            return;

        //

        const cfg = this.cfg.dummies;

        //

        const count = ComplexCaptchaConfig.DetermineIntegerFromParameter(cfg.count);
        
        const shapes = new Array(count).fill(0).map(_ => {
            const text = ComplexCaptchaText.GenerateText(this.cfg.characters, cfg.length);

            const fontInfo: Partial<Types.FontInfo> = (() => {
                const fi = cfg.fontInfo ?? this.cfg.fontInfo;

                if ( !fi )
                    return {};
                
                if ( Array.isArray(fi) )
                    return Tools.GetRandomArrayElement(fi) as Partial<Types.FontInfo>;

                return fi;
            })();

            const shape = new Konva.Text({
                listening:          false,
                perfectDrawEnabled: false,

                //

                x:              0,
                y:              0,

                text,

                fontSize:       this.cfg.fontSize * cfg.fontPercentageSize,
                fontFamily:     fontInfo.family ?? undefined,

                fill:           this.palette.foreground,

                stroke:         this.palette.semiTransparentBackground,
                strokeWidth:    1,

                opacity:        cfg.opacity
            });

            //

            const bbox = shape.getClientRect();

            shape.offsetX(bbox.width / 2);
            shape.offsetY(bbox.height / 2);

            if ( cfg.rotation )
                shape.rotation(Tools.GetRandomNumber(cfg.rotation[0], cfg.rotation[1]));

            //

            return shape;
        });

        //

        const displacedShapes: Konva.Text[] = [];

        while ( shapes.length ) {
            const shape = shapes.pop() as Konva.Text;

            //

            var tries = 25;
            var x = 0, y = 0;

            do {
                x = Tools.GetRandomNumber(this.cfg.padding, this.$stage.width() - (this.cfg.padding*2));
                y = Tools.GetRandomNumber(this.cfg.padding, this.$stage.height() - (this.cfg.padding*2));

                tries--;
            }
            while(
                tries > 0
                &&
                displacedShapes.some((displacedShape) => {
                    const distance = Tools.DistanceBetweenPoints(x, y, displacedShape.x(), displacedShape.y());

                    return distance < 40;
                })
            );

            //

            shape.x(x);
            shape.y(y);

            //

            displacedShapes.push(shape);
        }

        //

        this.$dummiesShape.add(...displacedShapes);
    }
}