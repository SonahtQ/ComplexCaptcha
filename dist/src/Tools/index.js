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
exports.CalcPointOnCircle = exports.AngleToRadians = exports.AngleDiff = exports.NormalizeAngle = exports.RandomizeArrayElementByShares = exports.GetFolderListInDirectory = exports.GetRandomArrayElements = exports.GetRandomArrayElement = exports.GetRandomInteger = exports.GetRandomNumber = exports.DistanceBetweenPoints = exports.GetModuleRootDirectoryPath = void 0;
const NodeFs = __importStar(require("fs"));
const NodePath = __importStar(require("path"));
const find_package_json_1 = __importDefault(require("find-package-json"));
function GetModuleRootDirectoryPath() {
    return NodePath.dirname((0, find_package_json_1.default)(__dirname).next().filename);
}
exports.GetModuleRootDirectoryPath = GetModuleRootDirectoryPath;
function DistanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));
}
exports.DistanceBetweenPoints = DistanceBetweenPoints;
function GetRandomNumber(min, max) {
    return (Math.random() * (max - min) + min);
}
exports.GetRandomNumber = GetRandomNumber;
function GetRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.GetRandomInteger = GetRandomInteger;
function GetRandomArrayElement(arr) {
    if (arr.length)
        return arr[Math.floor(Math.random() * arr.length)];
}
exports.GetRandomArrayElement = GetRandomArrayElement;
function GetRandomArrayElements(arr, count, canRepeat = true) {
    if (!canRepeat || !arr.length)
        count = Math.min(count, arr.length);
    const source = canRepeat ? arr : Array.from(arr);
    return new Array(count).fill(0).map(x => {
        const randIndex = Math.floor(Math.random() * source.length);
        return canRepeat ? source[randIndex] : source.splice(randIndex, 1)[0];
    });
}
exports.GetRandomArrayElements = GetRandomArrayElements;
function GetFolderListInDirectory(dirPath) {
    const files = NodeFs.readdirSync(dirPath, { withFileTypes: true });
    return files
        .filter(file => file.isDirectory())
        .map(file => file.name);
}
exports.GetFolderListInDirectory = GetFolderListInDirectory;
function RandomizeArrayElementByShares(array) {
    const total = array.reduce((curr, x) => curr + x.share, 0);
    if (total) {
        const relativeToTotal = array.map(x => x.share / total);
        const cumulative = relativeToTotal.map((share, i, arr) => {
            return share + arr.slice(0, i).reduce((curr, x) => curr + x, 0);
        });
        const randVal = Math.random();
        for (var i = 0; i < cumulative.length; i++) {
            const val = cumulative[i];
            if (randVal <= val)
                return array[i];
        }
    }
    return null;
}
exports.RandomizeArrayElementByShares = RandomizeArrayElementByShares;
function NormalizeAngle(angle) {
    let result = angle % 360;
    return result < 0 ? result + 360 : result;
}
exports.NormalizeAngle = NormalizeAngle;
function AngleDiff(alpha, beta) {
    const phi = Math.abs(beta - alpha) % 360;
    const distance = phi > 180 ? 360 - phi : phi;
    return distance;
}
exports.AngleDiff = AngleDiff;
function AngleToRadians(angle) {
    return (Math.PI / 180) * angle;
}
exports.AngleToRadians = AngleToRadians;
function CalcPointOnCircle(x, y, radius, angle) {
    const px = x + radius * Math.cos(AngleToRadians(angle - 90));
    const py = y + radius * Math.sin(AngleToRadians(angle - 90));
    return [px, py];
}
exports.CalcPointOnCircle = CalcPointOnCircle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvVG9vbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsK0NBQWlDO0FBRWpDLDBFQUE0QztBQUk1QyxTQUFnQiwwQkFBMEI7SUFDdEMsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUEsMkJBQVcsRUFBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFrQixDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUZELGdFQUVDO0FBRUQsU0FBZ0IscUJBQXFCLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtJQUNoRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUZELHNEQUVDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLEdBQVcsRUFBRSxHQUFXO0lBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELDBDQUVDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsR0FBVyxFQUFFLEdBQVc7SUFDckQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDN0QsQ0FBQztBQUZELDRDQUVDO0FBRUQsU0FBZ0IscUJBQXFCLENBQUksR0FB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