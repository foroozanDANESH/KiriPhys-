/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var svg = d3.select('svg');

svg.attr('width', window.innerWidth).attr('height', window.innerHeight);

var g = svg.append('g').attr('transform', 'translate(' + window.innerWidth / 2 + ', ' + window.innerHeight / 2 + ')');

var polygonSides = 3,
    minSize = 100,
    maxSize = 100000;

var loops = 20,
    loopWidth = 20;
var jointWidth = 2,
    joints = 0;

function draw() {
    for (var i = 0; i < loops; i++) {
        console.log(i, minSize + loopWidth * i);
        createPolygon(polygonSides, minSize + loopWidth * i, joints, jointWidth, !(i % 2));
    }
}

function createPolygon(sides, radius) {
    var joints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var jointWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var jointOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;


    var theta = 360 / sides / 2;
    var data = d3.range(0, 365, 1);

    var maxRadius = radius;
    var minRadius = maxRadius * Math.cos(rad(theta));
    var angleScale = d3.scaleLinear().domain([0, 360]).range([0, 2 * Math.PI]);

    var calRadiusScale = function calRadiusScale(angle) {
        return minRadius / Math.cos(rad(angle));
    };

    var radial = d3.lineRadial().radius(function (d) {
        var angle = theta - d % (theta * 2);
        var val = calRadiusScale(angle);
        return val;
    }).angle(function (d) {
        return angleScale(d);
    }).curve(d3.curveCardinalOpen);
    if (joints > 0) {
        radial.defined(function (d) {
            var x = d;
            var baseAngle = 360;
            if (jointOffset) x = d + theta;
            if (x % (baseAngle / joints) <= jointWidth) {
                return false;
            }
            return true;
        });
    }

    var pathD = radial(data);

    g.append('path').style('fill', 'none').style('stroke', 'red').attr('d', pathD);
}

function rad(deg) {
    return deg * Math.PI / 180;
}

function eventListener(selector, event, fn) {
    var element = document.querySelector(selector);
    if (element) {
        element.addEventListener(event, fn);
    } else {
        console.warn('Element with selector "' + selector + '" not found.');
    }
}

eventListener('input#poly-sides', 'input', function () {
    console.log("Polygon sides input changed");
    if (2 < this.value && this.value < 366) {
        polygonSides = this.value;
    }
    g.selectAll('path').remove();
    draw();
});
eventListener('input#size', 'keyup', function () {
    console.log("side input changed");if (2 < this.value && this.value < 100000) {
        minSize = +this.value;
    }
    g.selectAll('path').remove();
    draw();
});
eventListener('input#loop-number', 'keyup', function () {
    console.log("loop-number input changed");
    if (0 < this.value && this.value < 1000) {
        loops = this.value;
    }
    g.selectAll('path').remove();
    draw();
});

eventListener('input#loop-width', 'keyup', function () {
    console.log("loop-width input changed");

    if (1 < this.value && this.value < 200) {
        loopWidth = this.value;
    }
    g.selectAll('path').remove();
    draw();
});

eventListener('input#joint-number', 'keyup', function () {
    console.log("joint-number input changed");
    if (0 <= this.value && this.value < 100) {
        joints = this.value;
    }
    g.selectAll('path').remove();
    draw();
});
eventListener('input#joint-width', 'keyup', function () {
    console.log("joint-s input changed");

    if (1 < this.value && this.value < 30) {
        jointWidth = this.value;
    }
    g.selectAll('path').remove();
    draw();
});

// Call draw initially to display the visualization
draw();

/***/ })
/******/ ]);
//# sourceMappingURL=index.bundle.js.map