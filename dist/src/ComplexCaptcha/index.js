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
exports.Types = void 0;
const Canvas = __importStar(require("canvas"));
const cmj_1 = __importDefault(require("konva/cmj"));
const Tools = __importStar(require("../Tools"));
const Types = __importStar(require("./types"));
exports.Types = Types;
const loader_1 = __importDefault(require("./loader"));
const config_1 = __importDefault(require("./config"));
const text_1 = __importDefault(require("./text"));
class ComplexCaptcha {
    constructor(options = {}) {
        this.cfg = config_1.default.GetConfigFromOptions(options);
        this.text = text_1.default.GenerateText(this.cfg.characters, this.cfg.length);
        this.palette = config_1.default.PickPalette(this.cfg);
        this.canvas = Canvas.createCanvas(1, 1);
        this.$stage = new cmj_1.default.Stage({
            listening: false,
            container: this.canvas,
            width: 0,
            height: 0,
        });
        this.$layerBackground1 = new cmj_1.default.Layer({ listening: false, perfectDrawEnabled: false });
        this.$layerBackground2 = new cmj_1.default.Layer({ listening: false, perfectDrawEnabled: false });
        this.$layerMain1 = new cmj_1.default.Layer({ listening: false });
        this.$layerDetails1 = new cmj_1.default.Layer({ listening: false, perfectDrawEnabled: false });
        this.$stage.add(this.$layerBackground1);
        this.$stage.add(this.$layerBackground2);
        this.$stage.add(this.$layerMain1);
        this.$stage.add(this.$layerDetails1);
        this.$dummiesShape = new cmj_1.default.Group({
            listening: false,
            perfectDrawEnabled: false,
            x: 0, y: 0
        });
        this.$layerBackground2.add(this.$dummiesShape);
        this.$textShape = new cmj_1.default.Group({
            listening: false,
            x: this.cfg.padding,
            y: this.cfg.padding
        });
        this.$layerMain1.add(this.$textShape);
        this.$dirtShape = new cmj_1.default.Group({
            listening: false,
            perfectDrawEnabled: false,
            x: 0, y: 0
        });
        this.$layerMain1.add(this.$dirtShape);
        this.render();
        const textUnits = this.$textShape.getChildren()
            .map($textUnitShape => $textUnitShape.textUnit);
        this.text = textUnits
            .map(textUnit => textUnit.content)
            .join("");
        this.solution = textUnits
            .filter(textUnit => !textUnit.impostor)
            .map(textUnit => textUnit.content)
            .join("");
        this.instructions = {
            maxLength: this.text.length,
            omitBackgroundText: this.$dummiesShape.getChildren().length > 0,
            omitMarked: textUnits.some(textUnit => textUnit.impostor),
        };
    }
    static get Loader() {
        return loader_1.default;
    }
    static Generate(options) {
        var _a;
        const captcha = new ComplexCaptcha(options);
        const dataURL = captcha.$stage.toDataURL({ pixelRatio: 1, mimeType: options.mimeType, quality: (_a = options.quality) !== null && _a !== void 0 ? _a : 0.75 });
        const data = dataURL.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, "base64");
        return {
            text: captcha.text,
            solution: captcha.solution,
            buffer,
            instructions: captcha.instructions
        };
    }
    render() {
        this.renderText();
        this.renderAdjustStageSize();
        this.renderBackground();
        this.renderDirt();
        this.renderDummies();
    }
    renderBackground() {
        const stageSize = this.$stage.size();
        this.$layerBackground1.clear();
        const $rect = new cmj_1.default.Rect({
            perfectDrawEnabled: false,
            listening: false,
            x: 0,
            y: 0,
            width: stageSize.width,
            height: stageSize.height,
            fill: this.palette.background
        });
        this.$layerBackground1.add($rect);
    }
    renderAdjustStageSize() {
        const bbox = this.$textShape.getClientRect();
        const newSize = {
            width: bbox.width + (this.cfg.padding * 2),
            height: bbox.height + (this.cfg.padding * 2)
        };
        this.$stage.size(newSize);
    }
    renderText() {
        this.$textShape.removeChildren();
        const textUnits = text_1.default.GenerateTextUnits(this.cfg, this.text);
        this.renderTextUnitsToTextShape(textUnits);
        this.renderTextSetPositions();
        this.renderImpostorsMarks();
    }
    renderTextUnitsToTextShape(textUnits) {
        this.$textShape.add(...textUnits.map((textUnit) => this.renderTextUnitToShape(textUnit)));
    }
    renderTextUnitToShape(textUnit) {
        var _a, _b, _c, _d, _e, _f;
        const $textUnitShape = new cmj_1.default.Text({
            listening: false,
            text: textUnit.content,
            letterSpacing: typeof textUnit.mods.spacing == "number" ? textUnit.mods.spacing : 0,
            fill: this.palette.foreground,
            fontSize: this.cfg.fontSize,
            fontFamily: (_b = (_a = textUnit.mods.fontInfo) === null || _a === void 0 ? void 0 : _a.family) !== null && _b !== void 0 ? _b : undefined,
            stroke: this.palette.semiTransparentBackground,
            strokeWidth: 5,
            fillAfterStrokeEnabled: true
        });
        $textUnitShape.textUnit = textUnit;
        const textUnitShapeBBox = $textUnitShape.getClientRect();
        $textUnitShape.offsetX(textUnitShapeBBox.width / 2);
        $textUnitShape.offsetY(textUnitShapeBBox.height / 2);
        $textUnitShape.y(typeof textUnit.mods.displacementV == "number" ? textUnit.mods.displacementV : 0);
        if ((_d = (_c = textUnit.mods.fontInfo) === null || _c === void 0 ? void 0 : _c.allowRotation) !== null && _d !== void 0 ? _d : true) {
            $textUnitShape.rotation(typeof textUnit.mods.rotation == "number" ? textUnit.mods.rotation : 0);
        }
        if ((_f = (_e = textUnit.mods.fontInfo) === null || _e === void 0 ? void 0 : _e.allowDeformation) !== null && _f !== void 0 ? _f : true) {
            $textUnitShape.scaleX(textUnit.mods.deformation.scx);
            $textUnitShape.scaleY(textUnit.mods.deformation.scy);
            $textUnitShape.skewX(textUnit.mods.deformation.skx);
            $textUnitShape.skewY(textUnit.mods.deformation.sky);
        }
        return $textUnitShape;
    }
    renderTextSetPositions() {
        const shapes = this.$textShape.getChildren();
        for (var i = 1; i < shapes.length; i++) {
            const a = shapes[i - 1];
            const b = shapes[i];
            const aBox = a.getClientRect();
            const bBox = b.getClientRect();
            const diff = (aBox.x + aBox.width) - bBox.x;
            b.position({
                x: b.position().x + diff,
                y: b.position().y
            });
        }
        const textShapeAbsPos = this.$textShape.absolutePosition();
        const textShapeBBox = this.$textShape.getClientRect();
        const diff = {
            x: textShapeAbsPos.x - textShapeBBox.x,
            y: textShapeAbsPos.y - textShapeBBox.y,
        };
        this.$textShape.offsetX(this.$textShape.offsetX() - diff.x);
        this.$textShape.offsetY(this.$textShape.offsetY() - diff.y);
    }
    renderImpostorsMarks() {
        if (!this.cfg.impostors)
            return;
        for (const $textUnitShape of this.$textShape.getChildren()) {
            const textUnit = $textUnitShape.textUnit;
            if (textUnit.impostor)
                this.renderImpostorMark($textUnitShape);
        }
    }
    renderImpostorMark($textUnitShape) {
        if (!this.cfg.impostors)
            return;
        const $textUnitShapeBBox = $textUnitShape.getClientRect();
        const $textUnitShapeFalseDot = new cmj_1.default.Circle({
            listening: false,
            perfectDrawEnabled: false,
            x: $textUnitShapeBBox.x + $textUnitShapeBBox.width / 2,
            y: $textUnitShapeBBox.y + $textUnitShapeBBox.height / 2,
            radius: this.cfg.impostors.hintRadius,
            offsetX: 0,
            offsetY: 0,
            fill: this.palette.semiTransparentDetails,
        });
        this.$layerDetails1.add($textUnitShapeFalseDot);
    }
    renderDirt() {
        if (!this.cfg.dirt)
            return;
        this.$dirtShape.removeChildren();
        if (!(Math.random() < this.cfg.dirt.chance))
            return;
        const count = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.count);
        for (var i = 0; i < count; i++) {
            const type = Math.random() < 0.5;
            if (type)
                this.renderDirtLine();
            else
                this.renderDirtXorBox();
        }
    }
    renderDirtXorBox() {
        if (!this.cfg.dirt)
            return;
        const points = new Array(2).fill(0).map(_ => {
            return {
                x: Tools.GetRandomNumber(0, this.$stage.width()),
                y: Tools.GetRandomNumber(0, this.$stage.height()),
            };
        });
        const lowerX = Math.min(points[0].x, points[1].x);
        const higherX = Math.max(points[0].x, points[1].x);
        const lowerY = Math.min(points[0].y, points[1].y);
        const higherY = Math.max(points[0].y, points[1].y);
        const x = lowerX;
        const y = lowerY;
        const width = higherX - lowerX;
        const height = higherY - lowerY;
        this.$dirtShape.add(new cmj_1.default.Rect({
            listening: false,
            perfectDrawEnabled: false,
            x, y,
            width, height,
            fill: this.palette.foreground,
            globalCompositeOperation: "xor"
        }));
    }
    renderDirtLine() {
        var _a;
        if (!this.cfg.dirt)
            return;
        const textUnitShapesArr = this.$textShape.getChildren();
        let pointCount = Math.round(textUnitShapesArr.length * 0.65);
        const selectedShapesArr = Tools.GetRandomArrayElements(textUnitShapesArr, pointCount, false);
        const targetsBBoxes = selectedShapesArr
            .map(shape => shape.getClientRect())
            .sort((a, b) => a.x - b.x);
        const randPositions = targetsBBoxes
            .map(bbox => {
            return new Array(2).fill(0)
                .map(x => {
                return [
                    Tools.GetRandomNumber(bbox.x, bbox.x + bbox.width),
                    Tools.GetRandomNumber(bbox.y, bbox.y + bbox.height)
                ];
            })
                .sort((a, b) => {
                if (a[0] - b[0] == 0) {
                    return a[1] - b[1];
                }
                return a[0] - b[0];
            });
        });
        const points = randPositions.flat(2);
        points.unshift(Tools.GetRandomNumber(-500, -200), Tools.GetRandomNumber(-50, this.$stage.height() + 50), Tools.GetRandomNumber(-50, -10), Tools.GetRandomNumber(-50, this.$stage.height() + 50));
        points.push(Tools.GetRandomNumber(this.$stage.width() + 10, this.$stage.width() + 50), Tools.GetRandomNumber(-50, this.$stage.height() + 50), Tools.GetRandomNumber(this.$stage.width() + 200, this.$stage.width() + 500), Tools.GetRandomNumber(-50, this.$stage.height() + 50));
        const $line = new cmj_1.default.Line({
            listening: false,
            perfectDrawEnabled: false,
            points,
            shadowColor: this.palette.semiTransparentBackground,
            shadowBlur: 2,
            shadowOpacity: 1,
            shadowOffset: { x: 3, y: 3 },
            stroke: this.palette.foreground,
            strokeWidth: this.cfg.dirt.lineWidth,
            opacity: this.cfg.dirt.lineOpacity,
            lineCap: 'round',
            lineJoin: 'round',
            tension: (_a = this.cfg.dirt.lineTension) !== null && _a !== void 0 ? _a : undefined,
            bezier: this.cfg.dirt.lineBezier,
        });
        this.$dirtShape.add($line);
    }
    renderDummies() {
        if (!this.cfg.dummies)
            return;
        if (!(Math.random() < this.cfg.dummies.chance))
            return;
        const cfg = this.cfg.dummies;
        const count = config_1.default.DetermineIntegerFromParameter(cfg.count);
        const shapes = new Array(count).fill(0).map(_ => {
            var _a;
            const text = text_1.default.GenerateText(this.cfg.characters, cfg.length);
            const fontInfo = (() => {
                var _a;
                const fi = (_a = cfg.fontInfo) !== null && _a !== void 0 ? _a : this.cfg.fontInfo;
                if (!fi)
                    return {};
                if (Array.isArray(fi))
                    return Tools.GetRandomArrayElement(fi);
                return fi;
            })();
            const shape = new cmj_1.default.Text({
                listening: false,
                perfectDrawEnabled: false,
                x: 0,
                y: 0,
                text,
                fontSize: this.cfg.fontSize * cfg.fontPercentageSize,
                fontFamily: (_a = fontInfo.family) !== null && _a !== void 0 ? _a : undefined,
                fill: this.palette.foreground,
                stroke: this.palette.semiTransparentBackground,
                strokeWidth: 1,
                opacity: cfg.opacity
            });
            const bbox = shape.getClientRect();
            shape.offsetX(bbox.width / 2);
            shape.offsetY(bbox.height / 2);
            if (cfg.rotation)
                shape.rotation(Tools.GetRandomNumber(cfg.rotation[0], cfg.rotation[1]));
            return shape;
        });
        const displacedShapes = [];
        while (shapes.length) {
            const shape = shapes.pop();
            var tries = 25;
            var x = 0, y = 0;
            do {
                x = Tools.GetRandomNumber(this.cfg.padding, this.$stage.width() - (this.cfg.padding * 2));
                y = Tools.GetRandomNumber(this.cfg.padding, this.$stage.height() - (this.cfg.padding * 2));
                tries--;
            } while (tries > 0
                &&
                    displacedShapes.some((displacedShape) => {
                        const distance = Tools.DistanceBetweenPoints(x, y, displacedShape.x(), displacedShape.y());
                        return distance < 40;
                    }));
            shape.x(x);
            shape.y(y);
            displacedShapes.push(shape);
        }
        this.$dummiesShape.add(...displacedShapes);
    }
}
exports.default = ComplexCaptcha;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvQ29tcGxleENhcHRjaGEvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFDakMsb0RBQThCO0FBRTlCLGdEQUFpQztBQUVqQywrQ0FBaUM7QUFRekIsc0JBQUs7QUFOYixzREFBNEM7QUFDNUMsc0RBQTRDO0FBQzVDLGtEQUF3QztBQVF4QyxNQUFxQixjQUFjO0lBcUQvQixZQUFvQixVQUF5QixFQUFFO1FBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsZ0JBQW9CLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFJOUQsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFrQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBSWxGLElBQUksQ0FBQyxPQUFPLEdBQUcsZ0JBQW9CLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUkxRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBSXhDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFLLENBQUMsS0FBSyxDQUFDO1lBQzFCLFNBQVMsRUFBRyxLQUFLO1lBSWpCLFNBQVMsRUFBRyxJQUFJLENBQUMsTUFBYTtZQUU5QixLQUFLLEVBQU8sQ0FBQztZQUNiLE1BQU0sRUFBTSxDQUFDO1NBQ2hCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGFBQUssQ0FBQyxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGlC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