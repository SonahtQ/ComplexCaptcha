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
        this.$dirtXorShape = new cmj_1.default.Group({
            listening: false,
            x: 0,
            y: 0,
            globalCompositeOperation: "xor",
        });
        this.$layerMain1.add(this.$dirtXorShape);
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
        var _a;
        if (!this.cfg.dirt)
            return;
        this.$dirtShape.removeChildren();
        if (!(Math.random() < this.cfg.dirt.chance))
            return;
        const count = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.count);
        const chances = [
            {
                share: this.cfg.dirt.chanceForLine,
                callback: () => this.renderDirtLine(false),
            },
            {
                share: this.cfg.dirt.chanceForXorLine,
                callback: () => this.renderDirtLine(true),
            },
            {
                share: this.cfg.dirt.chanceForXorBox,
                callback: () => this.renderDirtXorBox(),
            },
            {
                share: this.cfg.dirt.chanceForXorIsland,
                callback: () => this.renderDirtXorIsland(),
            },
        ].filter(x => x.share > 0);
        for (var i = 0; i < count; i++)
            (_a = Tools.RandomizeArrayElementByShares(chances)) === null || _a === void 0 ? void 0 : _a.callback();
        if (this.$dirtXorShape.getChildren().length)
            this.$dirtXorShape.cache();
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
        this.$dirtXorShape.add(new cmj_1.default.Rect({
            listening: false,
            perfectDrawEnabled: false,
            x, y,
            width, height,
            fill: this.palette.foreground,
        }));
    }
    renderDirtXorIsland() {
        if (!this.cfg.dirt)
            return;
        const armCount = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.xorIslandArmCount);
        const armRadius = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.xorIslandArmRadius);
        const accentCount = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.xorIslandAccentCount);
        const accentStrength = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.xorIslandAccentStrength);
        const accentSensitivity = config_1.default.DetermineIntegerFromParameter(this.cfg.dirt.xorIslandAccentSensitivity);
        const center = [
            Tools.GetRandomNumber(this.cfg.padding, this.$stage.width() - (2 * this.cfg.padding)),
            Tools.GetRandomNumber(this.cfg.padding, this.$stage.height() - (2 * this.cfg.padding)),
        ];
        const angles = new Array(armCount).fill(0)
            .map((x, index, arr) => 360 * (index / arr.length))
            .map(x => Tools.NormalizeAngle(x + Tools.GetRandomNumber(-10, 10)))
            .sort((a, b) => a - b);
        const accents = new Array(accentCount).fill(0)
            .map(x => Tools.GetRandomNumber(0, 360));
        const points = angles.map(angle => {
            var _a, _b;
            const accentDistances = accents
                .map(accent => Tools.AngleDiff(angle, accent))
                .filter(dist => dist <= accentSensitivity);
            const closestAccentDistance = (_b = (_a = accentDistances.sort((a, b) => a - b)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : accentSensitivity;
            const accentMagnitude = 1 - (closestAccentDistance / accentSensitivity);
            const radius = armRadius + (armRadius * accentStrength) * accentMagnitude;
            return Tools.CalcPointOnCircle(center[0], center[1], radius, angle);
        });
        this.$dirtXorShape.add(new cmj_1.default.Line({
            listening: false,
            perfectDrawEnabled: false,
            points: points.flat(),
            fill: this.palette.foreground,
            lineCap: 'round',
            lineJoin: 'round',
            tension: 0,
            bezier: true,
            closed: true,
        }));
    }
    renderDirtLine(xor) {
        if (!this.cfg.dirt)
            return;
        const lineWidth = config_1.default.DetermineNumberFromParameter(!xor
            ?
                this.cfg.dirt.lineWidth
            :
                this.cfg.dirt.xorLineWidth);
        const lineOpacity = !xor ? this.cfg.dirt.lineOpacity : 1;
        const lineTension = !xor ? this.cfg.dirt.lineTension : 0;
        const lineBezier = !xor ? this.cfg.dirt.lineBezier : true;
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
        const konvaLineOpts = {
            listening: false,
            perfectDrawEnabled: false,
            points,
            stroke: this.palette.foreground,
            strokeWidth: lineWidth,
            opacity: lineOpacity,
            lineCap: 'round',
            lineJoin: 'round',
            tension: lineTension,
            bezier: lineBezier,
        };
        const konvaRegularLineOpts = {
            shadowColor: this.palette.semiTransparentBackground,
            shadowBlur: 2,
            shadowOpacity: 1,
            shadowOffset: { x: 3, y: 3 },
        };
        const konvaXorLineOpts = {};
        const $line = new cmj_1.default.Line(Object.assign(konvaLineOpts, !xor ? konvaRegularLineOpts : konvaXorLineOpts));
        if (!xor)
            this.$dirtShape.add($line);
        else
            this.$dirtXorShape.add($line);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvQ29tcGxleENhcHRjaGEvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFDakMsb0RBQThCO0FBRTlCLGdEQUFpQztBQUVqQywrQ0FBaUM7QUFRekIsc0JBQUs7QUFOYixzREFBNEM7QUFDNUMsc0RBQTRDO0FBQzVDLGtEQUF3QztBQVF4QyxNQUFxQixjQUFjO0lBc0QvQixZQUFvQixVQUF5QixFQUFFO1FBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsZ0JBQW9CLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFJOUQsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFrQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBSWxGLElBQUksQ0FBQyxPQUFPLEdBQUcsZ0JBQW9CLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUkxRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBSXhDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFLLENBQUMsS0FBSyxDQUFDO1lBQzFCLFNBQVMsRUFBRyxLQUFLO1lBSWpCLFNBQVMsRUFBRyxJQUFJLENBQUMsTUFBYTtZQUU5QixLQUFLLEVBQU8sQ0FBQztZQUNiLE1BQU0sRUFBTSxDQUFDO1NBQ2hCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGFBQUssQ0FBQyxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGlC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