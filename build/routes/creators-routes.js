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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const creatorsControllers = __importStar(require("../controllers/creators-controllers"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
const { signup, signin, getCreators, getCreator, switchFollow } = creatorsControllers;
router.post("/signup", [
    (0, express_validator_1.check)("name").not().isEmpty(),
    (0, express_validator_1.check)("email").normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    (0, express_validator_1.check)("password").isLength({ min: 8 }),
], signup);
router.post("/signin", [(0, express_validator_1.check)("email").normalizeEmail({ gmail_remove_dots: false })], signin);
router.get("/:creatorId", auth_1.verifyToken, getCreators);
router.get("/creator/:creatorId", auth_1.verifyToken, getCreator);
router.put("/follow/:creatorId", auth_1.verifyToken, switchFollow);
exports.default = router;
