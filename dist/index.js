"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _db = _interopRequireDefault(require("./src/db"));

var _validator = _interopRequireDefault(require("./src/validator"));

require('@babel/register');

var APP_PORT = 8081;
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.get('/', function (request, response) {
  response.json({
    message: 'Welcome to the rates API'
  });
});
app.get('/rates', _validator["default"].get, _db["default"].getAllRates);
app.get('/rates_null', _validator["default"].get, _db["default"].getAllNullRates);
app.post('/upload_price', _validator["default"].post, _db["default"].createPrice); // API DOES NOT WORKS SINCE THE FREE API DOES NOT PERFOM THE SINGLE CONVERSION FOR FREE

app.post('/upload_price_with_currency', _validator["default"].postWithCurrency, _db["default"].createConvertedPrice);
app.listen(APP_PORT, function () {
  return console.log("Server is running on port ".concat(APP_PORT));
});
var _default = app;
exports["default"] = _default;