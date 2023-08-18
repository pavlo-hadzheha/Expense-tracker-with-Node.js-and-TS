"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var RootModule_js_1 = require("./RootModule.js");
dotenv_1.default.config();
new RootModule_js_1.RootModule().start();
