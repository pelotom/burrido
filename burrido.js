(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.burrido = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.immutagen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// A simple immutable generator emulator that replays history in order to
// "clone" JavaScript's mutable generators

exports.default = function (genFun) {
  var nextFor = function nextFor(history) {
    return function (input) {
      var newHist = history.concat([input]);
      var gen = genFun(newHist[0]);
      var _newHist$map$history$ = newHist.map(function (x) {
        return gen.next(x);
      })[history.length];
      var value = _newHist$map$history$.value;
      var done = _newHist$map$history$.done;


      return {
        value: value,
        next: done ? undefined : nextFor(newHist),
        mutable: gen
      };
    };
  };
  return nextFor([]);
};

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutagen = require('immutagen');

var _immutagen2 = _interopRequireDefault(_immutagen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var pure = _ref.pure;
  var bind = _ref.bind;

  var doNext = function doNext(next) {
    return function (input) {
      var _next = next(input);

      var value = _next.value;
      var nextNext = _next.next;


      if (!nextNext) return pure(value);

      return bind(value, doNext(nextNext));
    };
  };

  return {
    Do: function Do(genFactory) {
      return doNext((0, _immutagen2.default)(genFactory))();
    }
  };
};

},{"immutagen":1}]},{},[2])(2)
});