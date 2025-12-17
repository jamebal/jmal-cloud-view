var Zh = (n, e) => () => (e || n((e = { exports: {} }).exports, e), e.exports);
var Jd = Zh((O) => {
  /**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   */
  const _o = "172", Oo = "", Ne = "srgb", Hs = "srgb-linear", Ws = "linear", Qn = "srgb";
  class Vn {
    addEventListener(e, t) {
      this._listeners === void 0 && (this._listeners = {});
      const r = this._listeners;
      r[e] === void 0 && (r[e] = []), r[e].indexOf(t) === -1 && r[e].push(t);
    }
    hasEventListener(e, t) {
      if (this._listeners === void 0) return !1;
      const r = this._listeners;
      return r[e] !== void 0 && r[e].indexOf(t) !== -1;
    }
    removeEventListener(e, t) {
      if (this._listeners === void 0) return;
      const i = this._listeners[e];
      if (i !== void 0) {
        const s = i.indexOf(t);
        s !== -1 && i.splice(s, 1);
      }
    }
    dispatchEvent(e) {
      if (this._listeners === void 0) return;
      const r = this._listeners[e.type];
      if (r !== void 0) {
        e.target = this;
        const i = r.slice(0);
        for (let s = 0, a = i.length; s < a; s++)
          i[s].call(this, e);
        e.target = null;
      }
    }
  }
  const me = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
  function fr() {
    const n = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, r = Math.random() * 4294967295 | 0;
    return (me[n & 255] + me[n >> 8 & 255] + me[n >> 16 & 255] + me[n >> 24 & 255] + "-" + me[e & 255] + me[e >> 8 & 255] + "-" + me[e >> 16 & 15 | 64] + me[e >> 24 & 255] + "-" + me[t & 63 | 128] + me[t >> 8 & 255] + "-" + me[t >> 16 & 255] + me[t >> 24 & 255] + me[r & 255] + me[r >> 8 & 255] + me[r >> 16 & 255] + me[r >> 24 & 255]).toLowerCase();
  }
  function X(n, e, t) {
    return Math.max(e, Math.min(t, n));
  }
  function Jh(n, e) {
    return (n % e + e) % e;
  }
  function Kn(n, e, t) {
    return (1 - t) * n + t * e;
  }
  function mr(n, e) {
    switch (e.constructor) {
      case Float32Array:
        return n;
      case Uint32Array:
        return n / 4294967295;
      case Uint16Array:
        return n / 65535;
      case Uint8Array:
        return n / 255;
      case Int32Array:
        return Math.max(n / 2147483647, -1);
      case Int16Array:
        return Math.max(n / 32767, -1);
      case Int8Array:
        return Math.max(n / 127, -1);
      default:
        throw new Error("Invalid component type.");
    }
  }
  function we(n, e) {
    switch (e.constructor) {
      case Float32Array:
        return n;
      case Uint32Array:
        return Math.round(n * 4294967295);
      case Uint16Array:
        return Math.round(n * 65535);
      case Uint8Array:
        return Math.round(n * 255);
      case Int32Array:
        return Math.round(n * 2147483647);
      case Int16Array:
        return Math.round(n * 32767);
      case Int8Array:
        return Math.round(n * 127);
      default:
        throw new Error("Invalid component type.");
    }
  }
  class V {
    constructor(e = 0, t = 0) {
      V.prototype.isVector2 = !0, this.x = e, this.y = t;
    }
    get width() {
      return this.x;
    }
    set width(e) {
      this.x = e;
    }
    get height() {
      return this.y;
    }
    set height(e) {
      this.y = e;
    }
    set(e, t) {
      return this.x = e, this.y = t, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this;
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    applyMatrix3(e) {
      const t = this.x, r = this.y, i = e.elements;
      return this.x = i[0] * t + i[3] * r + i[6], this.y = i[1] * t + i[4] * r + i[7], this;
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
    }
    clamp(e, t) {
      return this.x = X(this.x, e.x, t.x), this.y = X(this.y, e.y, t.y), this;
    }
    clampScalar(e, t) {
      return this.x = X(this.x, e, t), this.y = X(this.y, e, t), this;
    }
    clampLength(e, t) {
      const r = this.length();
      return this.divideScalar(r || 1).multiplyScalar(X(r, e, t));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y;
    }
    cross(e) {
      return this.x * e.y - this.y * e.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      const r = this.dot(e) / t;
      return Math.acos(X(r, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x, r = this.y - e.y;
      return t * t + r * r;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
    }
    lerpVectors(e, t, r) {
      return this.x = e.x + (t.x - e.x) * r, this.y = e.y + (t.y - e.y) * r, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this;
    }
    rotateAround(e, t) {
      const r = Math.cos(t), i = Math.sin(t), s = this.x - e.x, a = this.y - e.y;
      return this.x = s * r - a * i + e.x, this.y = s * i + a * r + e.y, this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  }
  class Mt {
    constructor(e, t, r, i, s, a, o, h, c) {
      Mt.prototype.isMatrix3 = !0, this.elements = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ], e !== void 0 && this.set(e, t, r, i, s, a, o, h, c);
    }
    set(e, t, r, i, s, a, o, h, c) {
      const u = this.elements;
      return u[0] = e, u[1] = i, u[2] = o, u[3] = t, u[4] = s, u[5] = h, u[6] = r, u[7] = a, u[8] = c, this;
    }
    identity() {
      return this.set(
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ), this;
    }
    copy(e) {
      const t = this.elements, r = e.elements;
      return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], this;
    }
    extractBasis(e, t, r) {
      return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), r.setFromMatrix3Column(this, 2), this;
    }
    setFromMatrix4(e) {
      const t = e.elements;
      return this.set(
        t[0],
        t[4],
        t[8],
        t[1],
        t[5],
        t[9],
        t[2],
        t[6],
        t[10]
      ), this;
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const r = e.elements, i = t.elements, s = this.elements, a = r[0], o = r[3], h = r[6], c = r[1], u = r[4], f = r[7], l = r[2], p = r[5], g = r[8], m = i[0], x = i[3], v = i[6], w = i[1], b = i[4], F = i[7], C = i[2], _ = i[5], E = i[8];
      return s[0] = a * m + o * w + h * C, s[3] = a * x + o * b + h * _, s[6] = a * v + o * F + h * E, s[1] = c * m + u * w + f * C, s[4] = c * x + u * b + f * _, s[7] = c * v + u * F + f * E, s[2] = l * m + p * w + g * C, s[5] = l * x + p * b + g * _, s[8] = l * v + p * F + g * E, this;
    }
    multiplyScalar(e) {
      const t = this.elements;
      return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
    }
    determinant() {
      const e = this.elements, t = e[0], r = e[1], i = e[2], s = e[3], a = e[4], o = e[5], h = e[6], c = e[7], u = e[8];
      return t * a * u - t * o * c - r * s * u + r * o * h + i * s * c - i * a * h;
    }
    invert() {
      const e = this.elements, t = e[0], r = e[1], i = e[2], s = e[3], a = e[4], o = e[5], h = e[6], c = e[7], u = e[8], f = u * a - o * c, l = o * h - u * s, p = c * s - a * h, g = t * f + r * l + i * p;
      if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const m = 1 / g;
      return e[0] = f * m, e[1] = (i * c - u * r) * m, e[2] = (o * r - i * a) * m, e[3] = l * m, e[4] = (u * t - i * h) * m, e[5] = (i * s - o * t) * m, e[6] = p * m, e[7] = (r * h - c * t) * m, e[8] = (a * t - r * s) * m, this;
    }
    transpose() {
      let e;
      const t = this.elements;
      return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
    }
    getNormalMatrix(e) {
      return this.setFromMatrix4(e).invert().transpose();
    }
    transposeIntoArray(e) {
      const t = this.elements;
      return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
    }
    setUvTransform(e, t, r, i, s, a, o) {
      const h = Math.cos(s), c = Math.sin(s);
      return this.set(
        r * h,
        r * c,
        -r * (h * a + c * o) + a + e,
        -i * c,
        i * h,
        -i * (-c * a + h * o) + o + t,
        0,
        0,
        1
      ), this;
    }
    //
    scale(e, t) {
      return this.premultiply(ei.makeScale(e, t)), this;
    }
    rotate(e) {
      return this.premultiply(ei.makeRotation(-e)), this;
    }
    translate(e, t) {
      return this.premultiply(ei.makeTranslation(e, t)), this;
    }
    // for 2D Transforms
    makeTranslation(e, t) {
      return e.isVector2 ? this.set(
        1,
        0,
        e.x,
        0,
        1,
        e.y,
        0,
        0,
        1
      ) : this.set(
        1,
        0,
        e,
        0,
        1,
        t,
        0,
        0,
        1
      ), this;
    }
    makeRotation(e) {
      const t = Math.cos(e), r = Math.sin(e);
      return this.set(
        t,
        -r,
        0,
        r,
        t,
        0,
        0,
        0,
        1
      ), this;
    }
    makeScale(e, t) {
      return this.set(
        e,
        0,
        0,
        0,
        t,
        0,
        0,
        0,
        1
      ), this;
    }
    //
    equals(e) {
      const t = this.elements, r = e.elements;
      for (let i = 0; i < 9; i++)
        if (t[i] !== r[i]) return !1;
      return !0;
    }
    fromArray(e, t = 0) {
      for (let r = 0; r < 9; r++)
        this.elements[r] = e[r + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const r = this.elements;
      return e[t] = r[0], e[t + 1] = r[1], e[t + 2] = r[2], e[t + 3] = r[3], e[t + 4] = r[4], e[t + 5] = r[5], e[t + 6] = r[6], e[t + 7] = r[7], e[t + 8] = r[8], e;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  }
  const ei = /* @__PURE__ */ new Mt();
  function $h(n) {
    for (let e = n.length - 1; e >= 0; --e)
      if (n[e] >= 65535) return !0;
    return !1;
  }
  function qs(n) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", n);
  }
  const Vs = /* @__PURE__ */ new Mt().set(
    0.4123908,
    0.3575843,
    0.1804808,
    0.212639,
    0.7151687,
    0.0721923,
    0.0193308,
    0.1191948,
    0.9505322
  ), Xs = /* @__PURE__ */ new Mt().set(
    3.2409699,
    -1.5373832,
    -0.4986108,
    -0.9692436,
    1.8759675,
    0.0415551,
    0.0556301,
    -0.203977,
    1.0569715
  );
  function jh() {
    const n = {
      enabled: !0,
      workingColorSpace: Hs,
      /**
       * Implementations of supported color spaces.
       *
       * Required:
       *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
       *	- whitePoint: reference white [ x y ]
       *	- transfer: transfer function (pre-defined)
       *	- toXYZ: Matrix3 RGB to XYZ transform
       *	- fromXYZ: Matrix3 XYZ to RGB transform
       *	- luminanceCoefficients: RGB luminance coefficients
       *
       * Optional:
       *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace }
       *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
       *
       * Reference:
       * - https://www.russellcottrell.com/photo/matrixCalculator.htm
       */
      spaces: {},
      convert: function(i, s, a) {
        return this.enabled === !1 || s === a || !s || !a || (this.spaces[s].transfer === Qn && (i.r = lt(i.r), i.g = lt(i.g), i.b = lt(i.b)), this.spaces[s].primaries !== this.spaces[a].primaries && (i.applyMatrix3(this.spaces[s].toXYZ), i.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === Qn && (i.r = ar(i.r), i.g = ar(i.g), i.b = ar(i.b))), i;
      },
      fromWorkingColorSpace: function(i, s) {
        return this.convert(i, this.workingColorSpace, s);
      },
      toWorkingColorSpace: function(i, s) {
        return this.convert(i, s, this.workingColorSpace);
      },
      getPrimaries: function(i) {
        return this.spaces[i].primaries;
      },
      getTransfer: function(i) {
        return i === Oo ? Ws : this.spaces[i].transfer;
      },
      getLuminanceCoefficients: function(i, s = this.workingColorSpace) {
        return i.fromArray(this.spaces[s].luminanceCoefficients);
      },
      define: function(i) {
        Object.assign(this.spaces, i);
      },
      // Internal APIs
      _getMatrix: function(i, s, a) {
        return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ);
      },
      _getDrawingBufferColorSpace: function(i) {
        return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace;
      },
      _getUnpackColorSpace: function(i = this.workingColorSpace) {
        return this.spaces[i].workingColorSpaceConfig.unpackColorSpace;
      }
    }, e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], t = [0.2126, 0.7152, 0.0722], r = [0.3127, 0.329];
    return n.define({
      [Hs]: {
        primaries: e,
        whitePoint: r,
        transfer: Ws,
        toXYZ: Vs,
        fromXYZ: Xs,
        luminanceCoefficients: t,
        workingColorSpaceConfig: { unpackColorSpace: Ne },
        outputColorSpaceConfig: { drawingBufferColorSpace: Ne }
      },
      [Ne]: {
        primaries: e,
        whitePoint: r,
        transfer: Qn,
        toXYZ: Vs,
        fromXYZ: Xs,
        luminanceCoefficients: t,
        outputColorSpaceConfig: { drawingBufferColorSpace: Ne }
      }
    }), n;
  }
  const De = /* @__PURE__ */ jh();
  function lt(n) {
    return n < 0.04045 ? n * 0.0773993808 : Math.pow(n * 0.9478672986 + 0.0521327014, 2.4);
  }
  function ar(n) {
    return n < 31308e-7 ? n * 12.92 : 1.055 * Math.pow(n, 0.41666) - 0.055;
  }
  let Xt;
  class Qh {
    static getDataURL(e) {
      if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
        return e.src;
      let t;
      if (e instanceof HTMLCanvasElement)
        t = e;
      else {
        Xt === void 0 && (Xt = qs("canvas")), Xt.width = e.width, Xt.height = e.height;
        const r = Xt.getContext("2d");
        e instanceof ImageData ? r.putImageData(e, 0, 0) : r.drawImage(e, 0, 0, e.width, e.height), t = Xt;
      }
      return t.width > 2048 || t.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), t.toDataURL("image/jpeg", 0.6)) : t.toDataURL("image/png");
    }
    static sRGBToLinear(e) {
      if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
        const t = qs("canvas");
        t.width = e.width, t.height = e.height;
        const r = t.getContext("2d");
        r.drawImage(e, 0, 0, e.width, e.height);
        const i = r.getImageData(0, 0, e.width, e.height), s = i.data;
        for (let a = 0; a < s.length; a++)
          s[a] = lt(s[a] / 255) * 255;
        return r.putImageData(i, 0, 0), t;
      } else if (e.data) {
        const t = e.data.slice(0);
        for (let r = 0; r < t.length; r++)
          t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[r] = Math.floor(lt(t[r] / 255) * 255) : t[r] = lt(t[r]);
        return {
          data: t,
          width: e.width,
          height: e.height
        };
      } else
        return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
    }
  }
  let Kh = 0;
  class ec {
    constructor(e = null) {
      this.isSource = !0, Object.defineProperty(this, "id", { value: Kh++ }), this.uuid = fr(), this.data = e, this.dataReady = !0, this.version = 0;
    }
    set needsUpdate(e) {
      e === !0 && this.version++;
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string";
      if (!t && e.images[this.uuid] !== void 0)
        return e.images[this.uuid];
      const r = {
        uuid: this.uuid,
        url: ""
      }, i = this.data;
      if (i !== null) {
        let s;
        if (Array.isArray(i)) {
          s = [];
          for (let a = 0, o = i.length; a < o; a++)
            i[a].isDataTexture ? s.push(ti(i[a].image)) : s.push(ti(i[a]));
        } else
          s = ti(i);
        r.url = s;
      }
      return t || (e.images[this.uuid] = r), r;
    }
  }
  function ti(n) {
    return typeof HTMLImageElement < "u" && n instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && n instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && n instanceof ImageBitmap ? Qh.getDataURL(n) : n.data ? {
      data: Array.from(n.data),
      width: n.width,
      height: n.height,
      type: n.data.constructor.name
    } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
  }
  let tc = 0;
  class zt extends Vn {
    constructor(e = zt.DEFAULT_IMAGE, t = zt.DEFAULT_MAPPING, r = 1001, i = 1001, s = 1006, a = 1008, o = 1023, h = 1009, c = zt.DEFAULT_ANISOTROPY, u = Oo) {
      super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: tc++ }), this.uuid = fr(), this.name = "", this.source = new ec(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = r, this.wrapT = i, this.magFilter = s, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = h, this.offset = new V(0, 0), this.repeat = new V(1, 1), this.center = new V(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Mt(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = u, this.userData = {}, this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
    }
    get image() {
      return this.source.data;
    }
    set image(e = null) {
      this.source.data = e;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string";
      if (!t && e.textures[this.uuid] !== void 0)
        return e.textures[this.uuid];
      const r = {
        metadata: {
          version: 4.6,
          type: "Texture",
          generator: "Texture.toJSON"
        },
        uuid: this.uuid,
        name: this.name,
        image: this.source.toJSON(e).uuid,
        mapping: this.mapping,
        channel: this.channel,
        repeat: [this.repeat.x, this.repeat.y],
        offset: [this.offset.x, this.offset.y],
        center: [this.center.x, this.center.y],
        rotation: this.rotation,
        wrap: [this.wrapS, this.wrapT],
        format: this.format,
        internalFormat: this.internalFormat,
        type: this.type,
        colorSpace: this.colorSpace,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        generateMipmaps: this.generateMipmaps,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment
      };
      return Object.keys(this.userData).length > 0 && (r.userData = this.userData), t || (e.textures[this.uuid] = r), r;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    transformUv(e) {
      if (this.mapping !== 300) return e;
      if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
        switch (this.wrapS) {
          case 1e3:
            e.x = e.x - Math.floor(e.x);
            break;
          case 1001:
            e.x = e.x < 0 ? 0 : 1;
            break;
          case 1002:
            Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
            break;
        }
      if (e.y < 0 || e.y > 1)
        switch (this.wrapT) {
          case 1e3:
            e.y = e.y - Math.floor(e.y);
            break;
          case 1001:
            e.y = e.y < 0 ? 0 : 1;
            break;
          case 1002:
            Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
            break;
        }
      return this.flipY && (e.y = 1 - e.y), e;
    }
    set needsUpdate(e) {
      e === !0 && (this.version++, this.source.needsUpdate = !0);
    }
    set needsPMREMUpdate(e) {
      e === !0 && this.pmremVersion++;
    }
  }
  zt.DEFAULT_IMAGE = null;
  zt.DEFAULT_MAPPING = 300;
  zt.DEFAULT_ANISOTROPY = 1;
  class Wr {
    constructor(e = 0, t = 0, r = 0, i = 1) {
      Wr.prototype.isVector4 = !0, this.x = e, this.y = t, this.z = r, this.w = i;
    }
    get width() {
      return this.z;
    }
    set width(e) {
      this.z = e;
    }
    get height() {
      return this.w;
    }
    set height(e) {
      this.w = e;
    }
    set(e, t, r, i) {
      return this.x = e, this.y = t, this.z = r, this.w = i, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this.z = e, this.w = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setZ(e) {
      return this.z = e, this;
    }
    setW(e) {
      return this.w = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        case 3:
          this.w = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this.z += e, this.w += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
    }
    applyMatrix4(e) {
      const t = this.x, r = this.y, i = this.z, s = this.w, a = e.elements;
      return this.x = a[0] * t + a[4] * r + a[8] * i + a[12] * s, this.y = a[1] * t + a[5] * r + a[9] * i + a[13] * s, this.z = a[2] * t + a[6] * r + a[10] * i + a[14] * s, this.w = a[3] * t + a[7] * r + a[11] * i + a[15] * s, this;
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    setAxisAngleFromQuaternion(e) {
      this.w = 2 * Math.acos(e.w);
      const t = Math.sqrt(1 - e.w * e.w);
      return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
    }
    setAxisAngleFromRotationMatrix(e) {
      let t, r, i, s;
      const h = e.elements, c = h[0], u = h[4], f = h[8], l = h[1], p = h[5], g = h[9], m = h[2], x = h[6], v = h[10];
      if (Math.abs(u - l) < 0.01 && Math.abs(f - m) < 0.01 && Math.abs(g - x) < 0.01) {
        if (Math.abs(u + l) < 0.1 && Math.abs(f + m) < 0.1 && Math.abs(g + x) < 0.1 && Math.abs(c + p + v - 3) < 0.1)
          return this.set(1, 0, 0, 0), this;
        t = Math.PI;
        const b = (c + 1) / 2, F = (p + 1) / 2, C = (v + 1) / 2, _ = (u + l) / 4, E = (f + m) / 4, B = (g + x) / 4;
        return b > F && b > C ? b < 0.01 ? (r = 0, i = 0.707106781, s = 0.707106781) : (r = Math.sqrt(b), i = _ / r, s = E / r) : F > C ? F < 0.01 ? (r = 0.707106781, i = 0, s = 0.707106781) : (i = Math.sqrt(F), r = _ / i, s = B / i) : C < 0.01 ? (r = 0.707106781, i = 0.707106781, s = 0) : (s = Math.sqrt(C), r = E / s, i = B / s), this.set(r, i, s, t), this;
      }
      let w = Math.sqrt((x - g) * (x - g) + (f - m) * (f - m) + (l - u) * (l - u));
      return Math.abs(w) < 1e-3 && (w = 1), this.x = (x - g) / w, this.y = (f - m) / w, this.z = (l - u) / w, this.w = Math.acos((c + p + v - 1) / 2), this;
    }
    setFromMatrixPosition(e) {
      const t = e.elements;
      return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
    }
    clamp(e, t) {
      return this.x = X(this.x, e.x, t.x), this.y = X(this.y, e.y, t.y), this.z = X(this.z, e.z, t.z), this.w = X(this.w, e.w, t.w), this;
    }
    clampScalar(e, t) {
      return this.x = X(this.x, e, t), this.y = X(this.y, e, t), this.z = X(this.z, e, t), this.w = X(this.w, e, t), this;
    }
    clampLength(e, t) {
      const r = this.length();
      return this.divideScalar(r || 1).multiplyScalar(X(r, e, t));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
    }
    lerpVectors(e, t, r) {
      return this.x = e.x + (t.x - e.x) * r, this.y = e.y + (t.y - e.y) * r, this.z = e.z + (t.z - e.z) * r, this.w = e.w + (t.w - e.w) * r, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  }
  class At {
    constructor(e = 0, t = 0, r = 0, i = 1) {
      this.isQuaternion = !0, this._x = e, this._y = t, this._z = r, this._w = i;
    }
    static slerpFlat(e, t, r, i, s, a, o) {
      let h = r[i + 0], c = r[i + 1], u = r[i + 2], f = r[i + 3];
      const l = s[a + 0], p = s[a + 1], g = s[a + 2], m = s[a + 3];
      if (o === 0) {
        e[t + 0] = h, e[t + 1] = c, e[t + 2] = u, e[t + 3] = f;
        return;
      }
      if (o === 1) {
        e[t + 0] = l, e[t + 1] = p, e[t + 2] = g, e[t + 3] = m;
        return;
      }
      if (f !== m || h !== l || c !== p || u !== g) {
        let x = 1 - o;
        const v = h * l + c * p + u * g + f * m, w = v >= 0 ? 1 : -1, b = 1 - v * v;
        if (b > Number.EPSILON) {
          const C = Math.sqrt(b), _ = Math.atan2(C, v * w);
          x = Math.sin(x * _) / C, o = Math.sin(o * _) / C;
        }
        const F = o * w;
        if (h = h * x + l * F, c = c * x + p * F, u = u * x + g * F, f = f * x + m * F, x === 1 - o) {
          const C = 1 / Math.sqrt(h * h + c * c + u * u + f * f);
          h *= C, c *= C, u *= C, f *= C;
        }
      }
      e[t] = h, e[t + 1] = c, e[t + 2] = u, e[t + 3] = f;
    }
    static multiplyQuaternionsFlat(e, t, r, i, s, a) {
      const o = r[i], h = r[i + 1], c = r[i + 2], u = r[i + 3], f = s[a], l = s[a + 1], p = s[a + 2], g = s[a + 3];
      return e[t] = o * g + u * f + h * p - c * l, e[t + 1] = h * g + u * l + c * f - o * p, e[t + 2] = c * g + u * p + o * l - h * f, e[t + 3] = u * g - o * f - h * l - c * p, e;
    }
    get x() {
      return this._x;
    }
    set x(e) {
      this._x = e, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e) {
      this._y = e, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e) {
      this._z = e, this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(e) {
      this._w = e, this._onChangeCallback();
    }
    set(e, t, r, i) {
      return this._x = e, this._y = t, this._z = r, this._w = i, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(e) {
      return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
    }
    setFromEuler(e, t = !0) {
      const r = e._x, i = e._y, s = e._z, a = e._order, o = Math.cos, h = Math.sin, c = o(r / 2), u = o(i / 2), f = o(s / 2), l = h(r / 2), p = h(i / 2), g = h(s / 2);
      switch (a) {
        case "XYZ":
          this._x = l * u * f + c * p * g, this._y = c * p * f - l * u * g, this._z = c * u * g + l * p * f, this._w = c * u * f - l * p * g;
          break;
        case "YXZ":
          this._x = l * u * f + c * p * g, this._y = c * p * f - l * u * g, this._z = c * u * g - l * p * f, this._w = c * u * f + l * p * g;
          break;
        case "ZXY":
          this._x = l * u * f - c * p * g, this._y = c * p * f + l * u * g, this._z = c * u * g + l * p * f, this._w = c * u * f - l * p * g;
          break;
        case "ZYX":
          this._x = l * u * f - c * p * g, this._y = c * p * f + l * u * g, this._z = c * u * g - l * p * f, this._w = c * u * f + l * p * g;
          break;
        case "YZX":
          this._x = l * u * f + c * p * g, this._y = c * p * f + l * u * g, this._z = c * u * g - l * p * f, this._w = c * u * f - l * p * g;
          break;
        case "XZY":
          this._x = l * u * f - c * p * g, this._y = c * p * f - l * u * g, this._z = c * u * g + l * p * f, this._w = c * u * f + l * p * g;
          break;
        default:
          console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
      }
      return t === !0 && this._onChangeCallback(), this;
    }
    setFromAxisAngle(e, t) {
      const r = t / 2, i = Math.sin(r);
      return this._x = e.x * i, this._y = e.y * i, this._z = e.z * i, this._w = Math.cos(r), this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e) {
      const t = e.elements, r = t[0], i = t[4], s = t[8], a = t[1], o = t[5], h = t[9], c = t[2], u = t[6], f = t[10], l = r + o + f;
      if (l > 0) {
        const p = 0.5 / Math.sqrt(l + 1);
        this._w = 0.25 / p, this._x = (u - h) * p, this._y = (s - c) * p, this._z = (a - i) * p;
      } else if (r > o && r > f) {
        const p = 2 * Math.sqrt(1 + r - o - f);
        this._w = (u - h) / p, this._x = 0.25 * p, this._y = (i + a) / p, this._z = (s + c) / p;
      } else if (o > f) {
        const p = 2 * Math.sqrt(1 + o - r - f);
        this._w = (s - c) / p, this._x = (i + a) / p, this._y = 0.25 * p, this._z = (h + u) / p;
      } else {
        const p = 2 * Math.sqrt(1 + f - r - o);
        this._w = (a - i) / p, this._x = (s + c) / p, this._y = (h + u) / p, this._z = 0.25 * p;
      }
      return this._onChangeCallback(), this;
    }
    setFromUnitVectors(e, t) {
      let r = e.dot(t) + 1;
      return r < Number.EPSILON ? (r = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = r) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = r)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = r), this.normalize();
    }
    angleTo(e) {
      return 2 * Math.acos(Math.abs(X(this.dot(e), -1, 1)));
    }
    rotateTowards(e, t) {
      const r = this.angleTo(e);
      if (r === 0) return this;
      const i = Math.min(1, t / r);
      return this.slerp(e, i), this;
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
    }
    dot(e) {
      return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let e = this.length();
      return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
    }
    multiply(e) {
      return this.multiplyQuaternions(this, e);
    }
    premultiply(e) {
      return this.multiplyQuaternions(e, this);
    }
    multiplyQuaternions(e, t) {
      const r = e._x, i = e._y, s = e._z, a = e._w, o = t._x, h = t._y, c = t._z, u = t._w;
      return this._x = r * u + a * o + i * c - s * h, this._y = i * u + a * h + s * o - r * c, this._z = s * u + a * c + r * h - i * o, this._w = a * u - r * o - i * h - s * c, this._onChangeCallback(), this;
    }
    slerp(e, t) {
      if (t === 0) return this;
      if (t === 1) return this.copy(e);
      const r = this._x, i = this._y, s = this._z, a = this._w;
      let o = a * e._w + r * e._x + i * e._y + s * e._z;
      if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1)
        return this._w = a, this._x = r, this._y = i, this._z = s, this;
      const h = 1 - o * o;
      if (h <= Number.EPSILON) {
        const p = 1 - t;
        return this._w = p * a + t * this._w, this._x = p * r + t * this._x, this._y = p * i + t * this._y, this._z = p * s + t * this._z, this.normalize(), this;
      }
      const c = Math.sqrt(h), u = Math.atan2(c, o), f = Math.sin((1 - t) * u) / c, l = Math.sin(t * u) / c;
      return this._w = a * f + this._w * l, this._x = r * f + this._x * l, this._y = i * f + this._y * l, this._z = s * f + this._z * l, this._onChangeCallback(), this;
    }
    slerpQuaternions(e, t, r) {
      return this.copy(e).slerp(t, r);
    }
    random() {
      const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), r = Math.random(), i = Math.sqrt(1 - r), s = Math.sqrt(r);
      return this.set(
        i * Math.sin(e),
        i * Math.cos(e),
        s * Math.sin(t),
        s * Math.cos(t)
      );
    }
    equals(e) {
      return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
    }
    fromArray(e, t = 0) {
      return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
    }
    fromBufferAttribute(e, t) {
      return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(e) {
      return this._onChangeCallback = e, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._w;
    }
  }
  class A {
    constructor(e = 0, t = 0, r = 0) {
      A.prototype.isVector3 = !0, this.x = e, this.y = t, this.z = r;
    }
    set(e, t, r) {
      return r === void 0 && (r = this.z), this.x = e, this.y = t, this.z = r, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this.z = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setZ(e) {
      return this.z = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this.z = e.z, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this.z += e.z, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this.z += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this.z -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this.z *= e, this;
    }
    multiplyVectors(e, t) {
      return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
    }
    applyEuler(e) {
      return this.applyQuaternion(Ys.setFromEuler(e));
    }
    applyAxisAngle(e, t) {
      return this.applyQuaternion(Ys.setFromAxisAngle(e, t));
    }
    applyMatrix3(e) {
      const t = this.x, r = this.y, i = this.z, s = e.elements;
      return this.x = s[0] * t + s[3] * r + s[6] * i, this.y = s[1] * t + s[4] * r + s[7] * i, this.z = s[2] * t + s[5] * r + s[8] * i, this;
    }
    applyNormalMatrix(e) {
      return this.applyMatrix3(e).normalize();
    }
    applyMatrix4(e) {
      const t = this.x, r = this.y, i = this.z, s = e.elements, a = 1 / (s[3] * t + s[7] * r + s[11] * i + s[15]);
      return this.x = (s[0] * t + s[4] * r + s[8] * i + s[12]) * a, this.y = (s[1] * t + s[5] * r + s[9] * i + s[13]) * a, this.z = (s[2] * t + s[6] * r + s[10] * i + s[14]) * a, this;
    }
    applyQuaternion(e) {
      const t = this.x, r = this.y, i = this.z, s = e.x, a = e.y, o = e.z, h = e.w, c = 2 * (a * i - o * r), u = 2 * (o * t - s * i), f = 2 * (s * r - a * t);
      return this.x = t + h * c + a * f - o * u, this.y = r + h * u + o * c - s * f, this.z = i + h * f + s * u - a * c, this;
    }
    project(e) {
      return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
    }
    unproject(e) {
      return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
    }
    transformDirection(e) {
      const t = this.x, r = this.y, i = this.z, s = e.elements;
      return this.x = s[0] * t + s[4] * r + s[8] * i, this.y = s[1] * t + s[5] * r + s[9] * i, this.z = s[2] * t + s[6] * r + s[10] * i, this.normalize();
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
    }
    clamp(e, t) {
      return this.x = X(this.x, e.x, t.x), this.y = X(this.y, e.y, t.y), this.z = X(this.z, e.z, t.z), this;
    }
    clampScalar(e, t) {
      return this.x = X(this.x, e, t), this.y = X(this.y, e, t), this.z = X(this.z, e, t), this;
    }
    clampLength(e, t) {
      const r = this.length();
      return this.divideScalar(r || 1).multiplyScalar(X(r, e, t));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z;
    }
    // TODO lengthSquared?
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
    }
    lerpVectors(e, t, r) {
      return this.x = e.x + (t.x - e.x) * r, this.y = e.y + (t.y - e.y) * r, this.z = e.z + (t.z - e.z) * r, this;
    }
    cross(e) {
      return this.crossVectors(this, e);
    }
    crossVectors(e, t) {
      const r = e.x, i = e.y, s = e.z, a = t.x, o = t.y, h = t.z;
      return this.x = i * h - s * o, this.y = s * a - r * h, this.z = r * o - i * a, this;
    }
    projectOnVector(e) {
      const t = e.lengthSq();
      if (t === 0) return this.set(0, 0, 0);
      const r = e.dot(this) / t;
      return this.copy(e).multiplyScalar(r);
    }
    projectOnPlane(e) {
      return ri.copy(this).projectOnVector(e), this.sub(ri);
    }
    reflect(e) {
      return this.sub(ri.copy(e).multiplyScalar(2 * this.dot(e)));
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      const r = this.dot(e) / t;
      return Math.acos(X(r, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x, r = this.y - e.y, i = this.z - e.z;
      return t * t + r * r + i * i;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
    }
    setFromSpherical(e) {
      return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
    }
    setFromSphericalCoords(e, t, r) {
      const i = Math.sin(t) * e;
      return this.x = i * Math.sin(r), this.y = Math.cos(t) * e, this.z = i * Math.cos(r), this;
    }
    setFromCylindrical(e) {
      return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
    }
    setFromCylindricalCoords(e, t, r) {
      return this.x = e * Math.sin(t), this.y = r, this.z = e * Math.cos(t), this;
    }
    setFromMatrixPosition(e) {
      const t = e.elements;
      return this.x = t[12], this.y = t[13], this.z = t[14], this;
    }
    setFromMatrixScale(e) {
      const t = this.setFromMatrixColumn(e, 0).length(), r = this.setFromMatrixColumn(e, 1).length(), i = this.setFromMatrixColumn(e, 2).length();
      return this.x = t, this.y = r, this.z = i, this;
    }
    setFromMatrixColumn(e, t) {
      return this.fromArray(e.elements, t * 4);
    }
    setFromMatrix3Column(e, t) {
      return this.fromArray(e.elements, t * 3);
    }
    setFromEuler(e) {
      return this.x = e._x, this.y = e._y, this.z = e._z, this;
    }
    setFromColor(e) {
      return this.x = e.r, this.y = e.g, this.z = e.b, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
    }
    randomDirection() {
      const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, r = Math.sqrt(1 - t * t);
      return this.x = r * Math.cos(e), this.y = t, this.z = r * Math.sin(e), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z;
    }
  }
  const ri = /* @__PURE__ */ new A(), Ys = /* @__PURE__ */ new At();
  class Ht {
    constructor(e = new A(1 / 0, 1 / 0, 1 / 0), t = new A(-1 / 0, -1 / 0, -1 / 0)) {
      this.isBox3 = !0, this.min = e, this.max = t;
    }
    set(e, t) {
      return this.min.copy(e), this.max.copy(t), this;
    }
    setFromArray(e) {
      this.makeEmpty();
      for (let t = 0, r = e.length; t < r; t += 3)
        this.expandByPoint(Ie.fromArray(e, t));
      return this;
    }
    setFromBufferAttribute(e) {
      this.makeEmpty();
      for (let t = 0, r = e.count; t < r; t++)
        this.expandByPoint(Ie.fromBufferAttribute(e, t));
      return this;
    }
    setFromPoints(e) {
      this.makeEmpty();
      for (let t = 0, r = e.length; t < r; t++)
        this.expandByPoint(e[t]);
      return this;
    }
    setFromCenterAndSize(e, t) {
      const r = Ie.copy(t).multiplyScalar(0.5);
      return this.min.copy(e).sub(r), this.max.copy(e).add(r), this;
    }
    setFromObject(e, t = !1) {
      return this.makeEmpty(), this.expandByObject(e, t);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.min.copy(e.min), this.max.copy(e.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
    }
    expandByPoint(e) {
      return this.min.min(e), this.max.max(e), this;
    }
    expandByVector(e) {
      return this.min.sub(e), this.max.add(e), this;
    }
    expandByScalar(e) {
      return this.min.addScalar(-e), this.max.addScalar(e), this;
    }
    expandByObject(e, t = !1) {
      e.updateWorldMatrix(!1, !1);
      const r = e.geometry;
      if (r !== void 0) {
        const s = r.getAttribute("position");
        if (t === !0 && s !== void 0 && e.isInstancedMesh !== !0)
          for (let a = 0, o = s.count; a < o; a++)
            e.isMesh === !0 ? e.getVertexPosition(a, Ie) : Ie.fromBufferAttribute(s, a), Ie.applyMatrix4(e.matrixWorld), this.expandByPoint(Ie);
        else
          e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), rn.copy(e.boundingBox)) : (r.boundingBox === null && r.computeBoundingBox(), rn.copy(r.boundingBox)), rn.applyMatrix4(e.matrixWorld), this.union(rn);
      }
      const i = e.children;
      for (let s = 0, a = i.length; s < a; s++)
        this.expandByObject(i[s], t);
      return this;
    }
    containsPoint(e) {
      return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
    }
    containsBox(e) {
      return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
    }
    getParameter(e, t) {
      return t.set(
        (e.x - this.min.x) / (this.max.x - this.min.x),
        (e.y - this.min.y) / (this.max.y - this.min.y),
        (e.z - this.min.z) / (this.max.z - this.min.z)
      );
    }
    intersectsBox(e) {
      return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
    }
    intersectsSphere(e) {
      return this.clampPoint(e.center, Ie), Ie.distanceToSquared(e.center) <= e.radius * e.radius;
    }
    intersectsPlane(e) {
      let t, r;
      return e.normal.x > 0 ? (t = e.normal.x * this.min.x, r = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, r = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, r += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, r += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, r += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, r += e.normal.z * this.min.z), t <= -e.constant && r >= -e.constant;
    }
    intersectsTriangle(e) {
      if (this.isEmpty())
        return !1;
      this.getCenter(vr), nn.subVectors(this.max, vr), Yt.subVectors(e.a, vr), Zt.subVectors(e.b, vr), Jt.subVectors(e.c, vr), dt.subVectors(Zt, Yt), gt.subVectors(Jt, Zt), _t.subVectors(Yt, Jt);
      let t = [
        0,
        -dt.z,
        dt.y,
        0,
        -gt.z,
        gt.y,
        0,
        -_t.z,
        _t.y,
        dt.z,
        0,
        -dt.x,
        gt.z,
        0,
        -gt.x,
        _t.z,
        0,
        -_t.x,
        -dt.y,
        dt.x,
        0,
        -gt.y,
        gt.x,
        0,
        -_t.y,
        _t.x,
        0
      ];
      return !ni(t, Yt, Zt, Jt, nn) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !ni(t, Yt, Zt, Jt, nn)) ? !1 : (sn.crossVectors(dt, gt), t = [sn.x, sn.y, sn.z], ni(t, Yt, Zt, Jt, nn));
    }
    clampPoint(e, t) {
      return t.copy(e).clamp(this.min, this.max);
    }
    distanceToPoint(e) {
      return this.clampPoint(e, Ie).distanceTo(e);
    }
    getBoundingSphere(e) {
      return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(Ie).length() * 0.5), e;
    }
    intersect(e) {
      return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(e) {
      return this.min.min(e.min), this.max.max(e.max), this;
    }
    applyMatrix4(e) {
      return this.isEmpty() ? this : (rt[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), rt[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), rt[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), rt[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), rt[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), rt[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), rt[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), rt[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(rt), this);
    }
    translate(e) {
      return this.min.add(e), this.max.add(e), this;
    }
    equals(e) {
      return e.min.equals(this.min) && e.max.equals(this.max);
    }
  }
  const rt = [
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A(),
    /* @__PURE__ */ new A()
  ], Ie = /* @__PURE__ */ new A(), rn = /* @__PURE__ */ new Ht(), Yt = /* @__PURE__ */ new A(), Zt = /* @__PURE__ */ new A(), Jt = /* @__PURE__ */ new A(), dt = /* @__PURE__ */ new A(), gt = /* @__PURE__ */ new A(), _t = /* @__PURE__ */ new A(), vr = /* @__PURE__ */ new A(), nn = /* @__PURE__ */ new A(), sn = /* @__PURE__ */ new A(), Ot = /* @__PURE__ */ new A();
  function ni(n, e, t, r, i) {
    for (let s = 0, a = n.length - 3; s <= a; s += 3) {
      Ot.fromArray(n, s);
      const o = i.x * Math.abs(Ot.x) + i.y * Math.abs(Ot.y) + i.z * Math.abs(Ot.z), h = e.dot(Ot), c = t.dot(Ot), u = r.dot(Ot);
      if (Math.max(-Math.max(h, c, u), Math.min(h, c, u)) > o)
        return !1;
    }
    return !0;
  }
  const rc = /* @__PURE__ */ new Ht(), xr = /* @__PURE__ */ new A(), ii = /* @__PURE__ */ new A();
  class ys {
    constructor(e = new A(), t = -1) {
      this.isSphere = !0, this.center = e, this.radius = t;
    }
    set(e, t) {
      return this.center.copy(e), this.radius = t, this;
    }
    setFromPoints(e, t) {
      const r = this.center;
      t !== void 0 ? r.copy(t) : rc.setFromPoints(e).getCenter(r);
      let i = 0;
      for (let s = 0, a = e.length; s < a; s++)
        i = Math.max(i, r.distanceToSquared(e[s]));
      return this.radius = Math.sqrt(i), this;
    }
    copy(e) {
      return this.center.copy(e.center), this.radius = e.radius, this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return this.center.set(0, 0, 0), this.radius = -1, this;
    }
    containsPoint(e) {
      return e.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(e) {
      return e.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(e) {
      const t = this.radius + e.radius;
      return e.center.distanceToSquared(this.center) <= t * t;
    }
    intersectsBox(e) {
      return e.intersectsSphere(this);
    }
    intersectsPlane(e) {
      return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(e, t) {
      const r = this.center.distanceToSquared(e);
      return t.copy(e), r > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
    }
    getBoundingBox(e) {
      return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
    }
    applyMatrix4(e) {
      return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
    }
    translate(e) {
      return this.center.add(e), this;
    }
    expandByPoint(e) {
      if (this.isEmpty())
        return this.center.copy(e), this.radius = 0, this;
      xr.subVectors(e, this.center);
      const t = xr.lengthSq();
      if (t > this.radius * this.radius) {
        const r = Math.sqrt(t), i = (r - this.radius) * 0.5;
        this.center.addScaledVector(xr, i / r), this.radius += i;
      }
      return this;
    }
    union(e) {
      return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (ii.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(xr.copy(e.center).add(ii)), this.expandByPoint(xr.copy(e.center).sub(ii))), this);
    }
    equals(e) {
      return e.center.equals(this.center) && e.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const nt = /* @__PURE__ */ new A(), si = /* @__PURE__ */ new A(), an = /* @__PURE__ */ new A(), yt = /* @__PURE__ */ new A(), ai = /* @__PURE__ */ new A(), on = /* @__PURE__ */ new A(), oi = /* @__PURE__ */ new A();
  class Lo {
    constructor(e = new A(), t = new A(0, 0, -1)) {
      this.origin = e, this.direction = t;
    }
    set(e, t) {
      return this.origin.copy(e), this.direction.copy(t), this;
    }
    copy(e) {
      return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
    }
    at(e, t) {
      return t.copy(this.origin).addScaledVector(this.direction, e);
    }
    lookAt(e) {
      return this.direction.copy(e).sub(this.origin).normalize(), this;
    }
    recast(e) {
      return this.origin.copy(this.at(e, nt)), this;
    }
    closestPointToPoint(e, t) {
      t.subVectors(e, this.origin);
      const r = t.dot(this.direction);
      return r < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, r);
    }
    distanceToPoint(e) {
      return Math.sqrt(this.distanceSqToPoint(e));
    }
    distanceSqToPoint(e) {
      const t = nt.subVectors(e, this.origin).dot(this.direction);
      return t < 0 ? this.origin.distanceToSquared(e) : (nt.copy(this.origin).addScaledVector(this.direction, t), nt.distanceToSquared(e));
    }
    distanceSqToSegment(e, t, r, i) {
      si.copy(e).add(t).multiplyScalar(0.5), an.copy(t).sub(e).normalize(), yt.copy(this.origin).sub(si);
      const s = e.distanceTo(t) * 0.5, a = -this.direction.dot(an), o = yt.dot(this.direction), h = -yt.dot(an), c = yt.lengthSq(), u = Math.abs(1 - a * a);
      let f, l, p, g;
      if (u > 0)
        if (f = a * h - o, l = a * o - h, g = s * u, f >= 0)
          if (l >= -g)
            if (l <= g) {
              const m = 1 / u;
              f *= m, l *= m, p = f * (f + a * l + 2 * o) + l * (a * f + l + 2 * h) + c;
            } else
              l = s, f = Math.max(0, -(a * l + o)), p = -f * f + l * (l + 2 * h) + c;
          else
            l = -s, f = Math.max(0, -(a * l + o)), p = -f * f + l * (l + 2 * h) + c;
        else
          l <= -g ? (f = Math.max(0, -(-a * s + o)), l = f > 0 ? -s : Math.min(Math.max(-s, -h), s), p = -f * f + l * (l + 2 * h) + c) : l <= g ? (f = 0, l = Math.min(Math.max(-s, -h), s), p = l * (l + 2 * h) + c) : (f = Math.max(0, -(a * s + o)), l = f > 0 ? s : Math.min(Math.max(-s, -h), s), p = -f * f + l * (l + 2 * h) + c);
      else
        l = a > 0 ? -s : s, f = Math.max(0, -(a * l + o)), p = -f * f + l * (l + 2 * h) + c;
      return r && r.copy(this.origin).addScaledVector(this.direction, f), i && i.copy(si).addScaledVector(an, l), p;
    }
    intersectSphere(e, t) {
      nt.subVectors(e.center, this.origin);
      const r = nt.dot(this.direction), i = nt.dot(nt) - r * r, s = e.radius * e.radius;
      if (i > s) return null;
      const a = Math.sqrt(s - i), o = r - a, h = r + a;
      return h < 0 ? null : o < 0 ? this.at(h, t) : this.at(o, t);
    }
    intersectsSphere(e) {
      return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
    }
    distanceToPlane(e) {
      const t = e.normal.dot(this.direction);
      if (t === 0)
        return e.distanceToPoint(this.origin) === 0 ? 0 : null;
      const r = -(this.origin.dot(e.normal) + e.constant) / t;
      return r >= 0 ? r : null;
    }
    intersectPlane(e, t) {
      const r = this.distanceToPlane(e);
      return r === null ? null : this.at(r, t);
    }
    intersectsPlane(e) {
      const t = e.distanceToPoint(this.origin);
      return t === 0 || e.normal.dot(this.direction) * t < 0;
    }
    intersectBox(e, t) {
      let r, i, s, a, o, h;
      const c = 1 / this.direction.x, u = 1 / this.direction.y, f = 1 / this.direction.z, l = this.origin;
      return c >= 0 ? (r = (e.min.x - l.x) * c, i = (e.max.x - l.x) * c) : (r = (e.max.x - l.x) * c, i = (e.min.x - l.x) * c), u >= 0 ? (s = (e.min.y - l.y) * u, a = (e.max.y - l.y) * u) : (s = (e.max.y - l.y) * u, a = (e.min.y - l.y) * u), r > a || s > i || ((s > r || isNaN(r)) && (r = s), (a < i || isNaN(i)) && (i = a), f >= 0 ? (o = (e.min.z - l.z) * f, h = (e.max.z - l.z) * f) : (o = (e.max.z - l.z) * f, h = (e.min.z - l.z) * f), r > h || o > i) || ((o > r || r !== r) && (r = o), (h < i || i !== i) && (i = h), i < 0) ? null : this.at(r >= 0 ? r : i, t);
    }
    intersectsBox(e) {
      return this.intersectBox(e, nt) !== null;
    }
    intersectTriangle(e, t, r, i, s) {
      ai.subVectors(t, e), on.subVectors(r, e), oi.crossVectors(ai, on);
      let a = this.direction.dot(oi), o;
      if (a > 0) {
        if (i) return null;
        o = 1;
      } else if (a < 0)
        o = -1, a = -a;
      else
        return null;
      yt.subVectors(this.origin, e);
      const h = o * this.direction.dot(on.crossVectors(yt, on));
      if (h < 0)
        return null;
      const c = o * this.direction.dot(ai.cross(yt));
      if (c < 0 || h + c > a)
        return null;
      const u = -o * yt.dot(oi);
      return u < 0 ? null : this.at(u / a, s);
    }
    applyMatrix4(e) {
      return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
    }
    equals(e) {
      return e.origin.equals(this.origin) && e.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  class xe {
    constructor(e, t, r, i, s, a, o, h, c, u, f, l, p, g, m, x) {
      xe.prototype.isMatrix4 = !0, this.elements = [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ], e !== void 0 && this.set(e, t, r, i, s, a, o, h, c, u, f, l, p, g, m, x);
    }
    set(e, t, r, i, s, a, o, h, c, u, f, l, p, g, m, x) {
      const v = this.elements;
      return v[0] = e, v[4] = t, v[8] = r, v[12] = i, v[1] = s, v[5] = a, v[9] = o, v[13] = h, v[2] = c, v[6] = u, v[10] = f, v[14] = l, v[3] = p, v[7] = g, v[11] = m, v[15] = x, this;
    }
    identity() {
      return this.set(
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    clone() {
      return new xe().fromArray(this.elements);
    }
    copy(e) {
      const t = this.elements, r = e.elements;
      return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], t[9] = r[9], t[10] = r[10], t[11] = r[11], t[12] = r[12], t[13] = r[13], t[14] = r[14], t[15] = r[15], this;
    }
    copyPosition(e) {
      const t = this.elements, r = e.elements;
      return t[12] = r[12], t[13] = r[13], t[14] = r[14], this;
    }
    setFromMatrix3(e) {
      const t = e.elements;
      return this.set(
        t[0],
        t[3],
        t[6],
        0,
        t[1],
        t[4],
        t[7],
        0,
        t[2],
        t[5],
        t[8],
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    extractBasis(e, t, r) {
      return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), r.setFromMatrixColumn(this, 2), this;
    }
    makeBasis(e, t, r) {
      return this.set(
        e.x,
        t.x,
        r.x,
        0,
        e.y,
        t.y,
        r.y,
        0,
        e.z,
        t.z,
        r.z,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    extractRotation(e) {
      const t = this.elements, r = e.elements, i = 1 / $t.setFromMatrixColumn(e, 0).length(), s = 1 / $t.setFromMatrixColumn(e, 1).length(), a = 1 / $t.setFromMatrixColumn(e, 2).length();
      return t[0] = r[0] * i, t[1] = r[1] * i, t[2] = r[2] * i, t[3] = 0, t[4] = r[4] * s, t[5] = r[5] * s, t[6] = r[6] * s, t[7] = 0, t[8] = r[8] * a, t[9] = r[9] * a, t[10] = r[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
    }
    makeRotationFromEuler(e) {
      const t = this.elements, r = e.x, i = e.y, s = e.z, a = Math.cos(r), o = Math.sin(r), h = Math.cos(i), c = Math.sin(i), u = Math.cos(s), f = Math.sin(s);
      if (e.order === "XYZ") {
        const l = a * u, p = a * f, g = o * u, m = o * f;
        t[0] = h * u, t[4] = -h * f, t[8] = c, t[1] = p + g * c, t[5] = l - m * c, t[9] = -o * h, t[2] = m - l * c, t[6] = g + p * c, t[10] = a * h;
      } else if (e.order === "YXZ") {
        const l = h * u, p = h * f, g = c * u, m = c * f;
        t[0] = l + m * o, t[4] = g * o - p, t[8] = a * c, t[1] = a * f, t[5] = a * u, t[9] = -o, t[2] = p * o - g, t[6] = m + l * o, t[10] = a * h;
      } else if (e.order === "ZXY") {
        const l = h * u, p = h * f, g = c * u, m = c * f;
        t[0] = l - m * o, t[4] = -a * f, t[8] = g + p * o, t[1] = p + g * o, t[5] = a * u, t[9] = m - l * o, t[2] = -a * c, t[6] = o, t[10] = a * h;
      } else if (e.order === "ZYX") {
        const l = a * u, p = a * f, g = o * u, m = o * f;
        t[0] = h * u, t[4] = g * c - p, t[8] = l * c + m, t[1] = h * f, t[5] = m * c + l, t[9] = p * c - g, t[2] = -c, t[6] = o * h, t[10] = a * h;
      } else if (e.order === "YZX") {
        const l = a * h, p = a * c, g = o * h, m = o * c;
        t[0] = h * u, t[4] = m - l * f, t[8] = g * f + p, t[1] = f, t[5] = a * u, t[9] = -o * u, t[2] = -c * u, t[6] = p * f + g, t[10] = l - m * f;
      } else if (e.order === "XZY") {
        const l = a * h, p = a * c, g = o * h, m = o * c;
        t[0] = h * u, t[4] = -f, t[8] = c * u, t[1] = l * f + m, t[5] = a * u, t[9] = p * f - g, t[2] = g * f - p, t[6] = o * u, t[10] = m * f + l;
      }
      return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
    }
    makeRotationFromQuaternion(e) {
      return this.compose(nc, e, ic);
    }
    lookAt(e, t, r) {
      const i = this.elements;
      return Fe.subVectors(e, t), Fe.lengthSq() === 0 && (Fe.z = 1), Fe.normalize(), mt.crossVectors(r, Fe), mt.lengthSq() === 0 && (Math.abs(r.z) === 1 ? Fe.x += 1e-4 : Fe.z += 1e-4, Fe.normalize(), mt.crossVectors(r, Fe)), mt.normalize(), hn.crossVectors(Fe, mt), i[0] = mt.x, i[4] = hn.x, i[8] = Fe.x, i[1] = mt.y, i[5] = hn.y, i[9] = Fe.y, i[2] = mt.z, i[6] = hn.z, i[10] = Fe.z, this;
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const r = e.elements, i = t.elements, s = this.elements, a = r[0], o = r[4], h = r[8], c = r[12], u = r[1], f = r[5], l = r[9], p = r[13], g = r[2], m = r[6], x = r[10], v = r[14], w = r[3], b = r[7], F = r[11], C = r[15], _ = i[0], E = i[4], B = i[8], I = i[12], N = i[1], q = i[5], re = i[9], Y = i[13], Z = i[2], j = i[6], Q = i[10], te = i[14], ie = i[3], ne = i[7], ae = i[11], H = i[15];
      return s[0] = a * _ + o * N + h * Z + c * ie, s[4] = a * E + o * q + h * j + c * ne, s[8] = a * B + o * re + h * Q + c * ae, s[12] = a * I + o * Y + h * te + c * H, s[1] = u * _ + f * N + l * Z + p * ie, s[5] = u * E + f * q + l * j + p * ne, s[9] = u * B + f * re + l * Q + p * ae, s[13] = u * I + f * Y + l * te + p * H, s[2] = g * _ + m * N + x * Z + v * ie, s[6] = g * E + m * q + x * j + v * ne, s[10] = g * B + m * re + x * Q + v * ae, s[14] = g * I + m * Y + x * te + v * H, s[3] = w * _ + b * N + F * Z + C * ie, s[7] = w * E + b * q + F * j + C * ne, s[11] = w * B + b * re + F * Q + C * ae, s[15] = w * I + b * Y + F * te + C * H, this;
    }
    multiplyScalar(e) {
      const t = this.elements;
      return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
    }
    determinant() {
      const e = this.elements, t = e[0], r = e[4], i = e[8], s = e[12], a = e[1], o = e[5], h = e[9], c = e[13], u = e[2], f = e[6], l = e[10], p = e[14], g = e[3], m = e[7], x = e[11], v = e[15];
      return g * (+s * h * f - i * c * f - s * o * l + r * c * l + i * o * p - r * h * p) + m * (+t * h * p - t * c * l + s * a * l - i * a * p + i * c * u - s * h * u) + x * (+t * c * f - t * o * p - s * a * f + r * a * p + s * o * u - r * c * u) + v * (-i * o * u - t * h * f + t * o * l + i * a * f - r * a * l + r * h * u);
    }
    transpose() {
      const e = this.elements;
      let t;
      return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
    }
    setPosition(e, t, r) {
      const i = this.elements;
      return e.isVector3 ? (i[12] = e.x, i[13] = e.y, i[14] = e.z) : (i[12] = e, i[13] = t, i[14] = r), this;
    }
    invert() {
      const e = this.elements, t = e[0], r = e[1], i = e[2], s = e[3], a = e[4], o = e[5], h = e[6], c = e[7], u = e[8], f = e[9], l = e[10], p = e[11], g = e[12], m = e[13], x = e[14], v = e[15], w = f * x * c - m * l * c + m * h * p - o * x * p - f * h * v + o * l * v, b = g * l * c - u * x * c - g * h * p + a * x * p + u * h * v - a * l * v, F = u * m * c - g * f * c + g * o * p - a * m * p - u * o * v + a * f * v, C = g * f * h - u * m * h - g * o * l + a * m * l + u * o * x - a * f * x, _ = t * w + r * b + i * F + s * C;
      if (_ === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const E = 1 / _;
      return e[0] = w * E, e[1] = (m * l * s - f * x * s - m * i * p + r * x * p + f * i * v - r * l * v) * E, e[2] = (o * x * s - m * h * s + m * i * c - r * x * c - o * i * v + r * h * v) * E, e[3] = (f * h * s - o * l * s - f * i * c + r * l * c + o * i * p - r * h * p) * E, e[4] = b * E, e[5] = (u * x * s - g * l * s + g * i * p - t * x * p - u * i * v + t * l * v) * E, e[6] = (g * h * s - a * x * s - g * i * c + t * x * c + a * i * v - t * h * v) * E, e[7] = (a * l * s - u * h * s + u * i * c - t * l * c - a * i * p + t * h * p) * E, e[8] = F * E, e[9] = (g * f * s - u * m * s - g * r * p + t * m * p + u * r * v - t * f * v) * E, e[10] = (a * m * s - g * o * s + g * r * c - t * m * c - a * r * v + t * o * v) * E, e[11] = (u * o * s - a * f * s - u * r * c + t * f * c + a * r * p - t * o * p) * E, e[12] = C * E, e[13] = (u * m * i - g * f * i + g * r * l - t * m * l - u * r * x + t * f * x) * E, e[14] = (g * o * i - a * m * i - g * r * h + t * m * h + a * r * x - t * o * x) * E, e[15] = (a * f * i - u * o * i + u * r * h - t * f * h - a * r * l + t * o * l) * E, this;
    }
    scale(e) {
      const t = this.elements, r = e.x, i = e.y, s = e.z;
      return t[0] *= r, t[4] *= i, t[8] *= s, t[1] *= r, t[5] *= i, t[9] *= s, t[2] *= r, t[6] *= i, t[10] *= s, t[3] *= r, t[7] *= i, t[11] *= s, this;
    }
    getMaxScaleOnAxis() {
      const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], r = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], i = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
      return Math.sqrt(Math.max(t, r, i));
    }
    makeTranslation(e, t, r) {
      return e.isVector3 ? this.set(
        1,
        0,
        0,
        e.x,
        0,
        1,
        0,
        e.y,
        0,
        0,
        1,
        e.z,
        0,
        0,
        0,
        1
      ) : this.set(
        1,
        0,
        0,
        e,
        0,
        1,
        0,
        t,
        0,
        0,
        1,
        r,
        0,
        0,
        0,
        1
      ), this;
    }
    makeRotationX(e) {
      const t = Math.cos(e), r = Math.sin(e);
      return this.set(
        1,
        0,
        0,
        0,
        0,
        t,
        -r,
        0,
        0,
        r,
        t,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    makeRotationY(e) {
      const t = Math.cos(e), r = Math.sin(e);
      return this.set(
        t,
        0,
        r,
        0,
        0,
        1,
        0,
        0,
        -r,
        0,
        t,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    makeRotationZ(e) {
      const t = Math.cos(e), r = Math.sin(e);
      return this.set(
        t,
        -r,
        0,
        0,
        r,
        t,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    makeRotationAxis(e, t) {
      const r = Math.cos(t), i = Math.sin(t), s = 1 - r, a = e.x, o = e.y, h = e.z, c = s * a, u = s * o;
      return this.set(
        c * a + r,
        c * o - i * h,
        c * h + i * o,
        0,
        c * o + i * h,
        u * o + r,
        u * h - i * a,
        0,
        c * h - i * o,
        u * h + i * a,
        s * h * h + r,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    makeScale(e, t, r) {
      return this.set(
        e,
        0,
        0,
        0,
        0,
        t,
        0,
        0,
        0,
        0,
        r,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    makeShear(e, t, r, i, s, a) {
      return this.set(
        1,
        r,
        s,
        0,
        e,
        1,
        a,
        0,
        t,
        i,
        1,
        0,
        0,
        0,
        0,
        1
      ), this;
    }
    compose(e, t, r) {
      const i = this.elements, s = t._x, a = t._y, o = t._z, h = t._w, c = s + s, u = a + a, f = o + o, l = s * c, p = s * u, g = s * f, m = a * u, x = a * f, v = o * f, w = h * c, b = h * u, F = h * f, C = r.x, _ = r.y, E = r.z;
      return i[0] = (1 - (m + v)) * C, i[1] = (p + F) * C, i[2] = (g - b) * C, i[3] = 0, i[4] = (p - F) * _, i[5] = (1 - (l + v)) * _, i[6] = (x + w) * _, i[7] = 0, i[8] = (g + b) * E, i[9] = (x - w) * E, i[10] = (1 - (l + m)) * E, i[11] = 0, i[12] = e.x, i[13] = e.y, i[14] = e.z, i[15] = 1, this;
    }
    decompose(e, t, r) {
      const i = this.elements;
      let s = $t.set(i[0], i[1], i[2]).length();
      const a = $t.set(i[4], i[5], i[6]).length(), o = $t.set(i[8], i[9], i[10]).length();
      this.determinant() < 0 && (s = -s), e.x = i[12], e.y = i[13], e.z = i[14], Pe.copy(this);
      const c = 1 / s, u = 1 / a, f = 1 / o;
      return Pe.elements[0] *= c, Pe.elements[1] *= c, Pe.elements[2] *= c, Pe.elements[4] *= u, Pe.elements[5] *= u, Pe.elements[6] *= u, Pe.elements[8] *= f, Pe.elements[9] *= f, Pe.elements[10] *= f, t.setFromRotationMatrix(Pe), r.x = s, r.y = a, r.z = o, this;
    }
    makePerspective(e, t, r, i, s, a, o = 2e3) {
      const h = this.elements, c = 2 * s / (t - e), u = 2 * s / (r - i), f = (t + e) / (t - e), l = (r + i) / (r - i);
      let p, g;
      if (o === 2e3)
        p = -(a + s) / (a - s), g = -2 * a * s / (a - s);
      else if (o === 2001)
        p = -a / (a - s), g = -a * s / (a - s);
      else
        throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
      return h[0] = c, h[4] = 0, h[8] = f, h[12] = 0, h[1] = 0, h[5] = u, h[9] = l, h[13] = 0, h[2] = 0, h[6] = 0, h[10] = p, h[14] = g, h[3] = 0, h[7] = 0, h[11] = -1, h[15] = 0, this;
    }
    makeOrthographic(e, t, r, i, s, a, o = 2e3) {
      const h = this.elements, c = 1 / (t - e), u = 1 / (r - i), f = 1 / (a - s), l = (t + e) * c, p = (r + i) * u;
      let g, m;
      if (o === 2e3)
        g = (a + s) * f, m = -2 * f;
      else if (o === 2001)
        g = s * f, m = -1 * f;
      else
        throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
      return h[0] = 2 * c, h[4] = 0, h[8] = 0, h[12] = -l, h[1] = 0, h[5] = 2 * u, h[9] = 0, h[13] = -p, h[2] = 0, h[6] = 0, h[10] = m, h[14] = -g, h[3] = 0, h[7] = 0, h[11] = 0, h[15] = 1, this;
    }
    equals(e) {
      const t = this.elements, r = e.elements;
      for (let i = 0; i < 16; i++)
        if (t[i] !== r[i]) return !1;
      return !0;
    }
    fromArray(e, t = 0) {
      for (let r = 0; r < 16; r++)
        this.elements[r] = e[r + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const r = this.elements;
      return e[t] = r[0], e[t + 1] = r[1], e[t + 2] = r[2], e[t + 3] = r[3], e[t + 4] = r[4], e[t + 5] = r[5], e[t + 6] = r[6], e[t + 7] = r[7], e[t + 8] = r[8], e[t + 9] = r[9], e[t + 10] = r[10], e[t + 11] = r[11], e[t + 12] = r[12], e[t + 13] = r[13], e[t + 14] = r[14], e[t + 15] = r[15], e;
    }
  }
  const $t = /* @__PURE__ */ new A(), Pe = /* @__PURE__ */ new xe(), nc = /* @__PURE__ */ new A(0, 0, 0), ic = /* @__PURE__ */ new A(1, 1, 1), mt = /* @__PURE__ */ new A(), hn = /* @__PURE__ */ new A(), Fe = /* @__PURE__ */ new A(), Zs = /* @__PURE__ */ new xe(), Js = /* @__PURE__ */ new At();
  class qr {
    constructor(e = 0, t = 0, r = 0, i = qr.DEFAULT_ORDER) {
      this.isEuler = !0, this._x = e, this._y = t, this._z = r, this._order = i;
    }
    get x() {
      return this._x;
    }
    set x(e) {
      this._x = e, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e) {
      this._y = e, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e) {
      this._z = e, this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(e) {
      this._order = e, this._onChangeCallback();
    }
    set(e, t, r, i = this._order) {
      return this._x = e, this._y = t, this._z = r, this._order = i, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(e) {
      return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e, t = this._order, r = !0) {
      const i = e.elements, s = i[0], a = i[4], o = i[8], h = i[1], c = i[5], u = i[9], f = i[2], l = i[6], p = i[10];
      switch (t) {
        case "XYZ":
          this._y = Math.asin(X(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-u, p), this._z = Math.atan2(-a, s)) : (this._x = Math.atan2(l, c), this._z = 0);
          break;
        case "YXZ":
          this._x = Math.asin(-X(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(h, c)) : (this._y = Math.atan2(-f, s), this._z = 0);
          break;
        case "ZXY":
          this._x = Math.asin(X(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._y = Math.atan2(-f, p), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(h, s));
          break;
        case "ZYX":
          this._y = Math.asin(-X(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._x = Math.atan2(l, p), this._z = Math.atan2(h, s)) : (this._x = 0, this._z = Math.atan2(-a, c));
          break;
        case "YZX":
          this._z = Math.asin(X(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._x = Math.atan2(-u, c), this._y = Math.atan2(-f, s)) : (this._x = 0, this._y = Math.atan2(o, p));
          break;
        case "XZY":
          this._z = Math.asin(-X(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(l, c), this._y = Math.atan2(o, s)) : (this._x = Math.atan2(-u, p), this._y = 0);
          break;
        default:
          console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
      }
      return this._order = t, r === !0 && this._onChangeCallback(), this;
    }
    setFromQuaternion(e, t, r) {
      return Zs.makeRotationFromQuaternion(e), this.setFromRotationMatrix(Zs, t, r);
    }
    setFromVector3(e, t = this._order) {
      return this.set(e.x, e.y, e.z, t);
    }
    reorder(e) {
      return Js.setFromEuler(this), this.setFromQuaternion(Js, e);
    }
    equals(e) {
      return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
    }
    fromArray(e) {
      return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
    }
    _onChange(e) {
      return this._onChangeCallback = e, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._order;
    }
  }
  qr.DEFAULT_ORDER = "XYZ";
  class sc {
    constructor() {
      this.mask = 1;
    }
    set(e) {
      this.mask = (1 << e | 0) >>> 0;
    }
    enable(e) {
      this.mask |= 1 << e | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(e) {
      this.mask ^= 1 << e | 0;
    }
    disable(e) {
      this.mask &= ~(1 << e | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(e) {
      return (this.mask & e.mask) !== 0;
    }
    isEnabled(e) {
      return (this.mask & (1 << e | 0)) !== 0;
    }
  }
  let ac = 0;
  const $s = /* @__PURE__ */ new A(), jt = /* @__PURE__ */ new At(), it = /* @__PURE__ */ new xe(), cn = /* @__PURE__ */ new A(), br = /* @__PURE__ */ new A(), oc = /* @__PURE__ */ new A(), hc = /* @__PURE__ */ new At(), js = /* @__PURE__ */ new A(1, 0, 0), Qs = /* @__PURE__ */ new A(0, 1, 0), Ks = /* @__PURE__ */ new A(0, 0, 1), ea = { type: "added" }, cc = { type: "removed" }, Qt = { type: "childadded", child: null }, hi = { type: "childremoved", child: null };
  class Ue extends Vn {
    constructor() {
      super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: ac++ }), this.uuid = fr(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = Ue.DEFAULT_UP.clone();
      const e = new A(), t = new qr(), r = new At(), i = new A(1, 1, 1);
      function s() {
        r.setFromEuler(t, !1);
      }
      function a() {
        t.setFromQuaternion(r, void 0, !1);
      }
      t._onChange(s), r._onChange(a), Object.defineProperties(this, {
        position: {
          configurable: !0,
          enumerable: !0,
          value: e
        },
        rotation: {
          configurable: !0,
          enumerable: !0,
          value: t
        },
        quaternion: {
          configurable: !0,
          enumerable: !0,
          value: r
        },
        scale: {
          configurable: !0,
          enumerable: !0,
          value: i
        },
        modelViewMatrix: {
          value: new xe()
        },
        normalMatrix: {
          value: new Mt()
        }
      }), this.matrix = new xe(), this.matrixWorld = new xe(), this.matrixAutoUpdate = Ue.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new sc(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(e) {
      this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(e) {
      return this.quaternion.premultiply(e), this;
    }
    setRotationFromAxisAngle(e, t) {
      this.quaternion.setFromAxisAngle(e, t);
    }
    setRotationFromEuler(e) {
      this.quaternion.setFromEuler(e, !0);
    }
    setRotationFromMatrix(e) {
      this.quaternion.setFromRotationMatrix(e);
    }
    setRotationFromQuaternion(e) {
      this.quaternion.copy(e);
    }
    rotateOnAxis(e, t) {
      return jt.setFromAxisAngle(e, t), this.quaternion.multiply(jt), this;
    }
    rotateOnWorldAxis(e, t) {
      return jt.setFromAxisAngle(e, t), this.quaternion.premultiply(jt), this;
    }
    rotateX(e) {
      return this.rotateOnAxis(js, e);
    }
    rotateY(e) {
      return this.rotateOnAxis(Qs, e);
    }
    rotateZ(e) {
      return this.rotateOnAxis(Ks, e);
    }
    translateOnAxis(e, t) {
      return $s.copy(e).applyQuaternion(this.quaternion), this.position.add($s.multiplyScalar(t)), this;
    }
    translateX(e) {
      return this.translateOnAxis(js, e);
    }
    translateY(e) {
      return this.translateOnAxis(Qs, e);
    }
    translateZ(e) {
      return this.translateOnAxis(Ks, e);
    }
    localToWorld(e) {
      return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(e) {
      return this.updateWorldMatrix(!0, !1), e.applyMatrix4(it.copy(this.matrixWorld).invert());
    }
    lookAt(e, t, r) {
      e.isVector3 ? cn.copy(e) : cn.set(e, t, r);
      const i = this.parent;
      this.updateWorldMatrix(!0, !1), br.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? it.lookAt(br, cn, this.up) : it.lookAt(cn, br, this.up), this.quaternion.setFromRotationMatrix(it), i && (it.extractRotation(i.matrixWorld), jt.setFromRotationMatrix(it), this.quaternion.premultiply(jt.invert()));
    }
    add(e) {
      if (arguments.length > 1) {
        for (let t = 0; t < arguments.length; t++)
          this.add(arguments[t]);
        return this;
      }
      return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(ea), Qt.child = e, this.dispatchEvent(Qt), Qt.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
    }
    remove(e) {
      if (arguments.length > 1) {
        for (let r = 0; r < arguments.length; r++)
          this.remove(arguments[r]);
        return this;
      }
      const t = this.children.indexOf(e);
      return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(cc), hi.child = e, this.dispatchEvent(hi), hi.child = null), this;
    }
    removeFromParent() {
      const e = this.parent;
      return e !== null && e.remove(this), this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(e) {
      return this.updateWorldMatrix(!0, !1), it.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), it.multiply(e.parent.matrixWorld)), e.applyMatrix4(it), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(ea), Qt.child = e, this.dispatchEvent(Qt), Qt.child = null, this;
    }
    getObjectById(e) {
      return this.getObjectByProperty("id", e);
    }
    getObjectByName(e) {
      return this.getObjectByProperty("name", e);
    }
    getObjectByProperty(e, t) {
      if (this[e] === t) return this;
      for (let r = 0, i = this.children.length; r < i; r++) {
        const a = this.children[r].getObjectByProperty(e, t);
        if (a !== void 0)
          return a;
      }
    }
    getObjectsByProperty(e, t, r = []) {
      this[e] === t && r.push(this);
      const i = this.children;
      for (let s = 0, a = i.length; s < a; s++)
        i[s].getObjectsByProperty(e, t, r);
      return r;
    }
    getWorldPosition(e) {
      return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(e) {
      return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(br, e, oc), e;
    }
    getWorldScale(e) {
      return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(br, hc, e), e;
    }
    getWorldDirection(e) {
      this.updateWorldMatrix(!0, !1);
      const t = this.matrixWorld.elements;
      return e.set(t[8], t[9], t[10]).normalize();
    }
    raycast() {
    }
    traverse(e) {
      e(this);
      const t = this.children;
      for (let r = 0, i = t.length; r < i; r++)
        t[r].traverse(e);
    }
    traverseVisible(e) {
      if (this.visible === !1) return;
      e(this);
      const t = this.children;
      for (let r = 0, i = t.length; r < i; r++)
        t[r].traverseVisible(e);
    }
    traverseAncestors(e) {
      const t = this.parent;
      t !== null && (e(t), t.traverseAncestors(e));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
    }
    updateMatrixWorld(e) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
      const t = this.children;
      for (let r = 0, i = t.length; r < i; r++)
        t[r].updateMatrixWorld(e);
    }
    updateWorldMatrix(e, t) {
      const r = this.parent;
      if (e === !0 && r !== null && r.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === !0) {
        const i = this.children;
        for (let s = 0, a = i.length; s < a; s++)
          i[s].updateWorldMatrix(!1, !0);
      }
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string", r = {};
      t && (e = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {}
      }, r.metadata = {
        version: 4.6,
        type: "Object",
        generator: "Object3D.toJSON"
      });
      const i = {};
      i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.castShadow === !0 && (i.castShadow = !0), this.receiveShadow === !0 && (i.receiveShadow = !0), this.visible === !1 && (i.visible = !1), this.frustumCulled === !1 && (i.frustumCulled = !1), this.renderOrder !== 0 && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (i.matrixAutoUpdate = !1), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (i.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (i.type = "BatchedMesh", i.perObjectFrustumCulled = this.perObjectFrustumCulled, i.sortObjects = this.sortObjects, i.drawRanges = this._drawRanges, i.reservedRanges = this._reservedRanges, i.visibility = this._visibility, i.active = this._active, i.bounds = this._bounds.map((o) => ({
        boxInitialized: o.boxInitialized,
        boxMin: o.box.min.toArray(),
        boxMax: o.box.max.toArray(),
        sphereInitialized: o.sphereInitialized,
        sphereRadius: o.sphere.radius,
        sphereCenter: o.sphere.center.toArray()
      })), i.maxInstanceCount = this._maxInstanceCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.geometryCount = this._geometryCount, i.matricesTexture = this._matricesTexture.toJSON(e), this._colorsTexture !== null && (i.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (i.boundingSphere = {
        center: i.boundingSphere.center.toArray(),
        radius: i.boundingSphere.radius
      }), this.boundingBox !== null && (i.boundingBox = {
        min: i.boundingBox.min.toArray(),
        max: i.boundingBox.max.toArray()
      }));
      function s(o, h) {
        return o[h.uuid] === void 0 && (o[h.uuid] = h.toJSON(e)), h.uuid;
      }
      if (this.isScene)
        this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (i.environment = this.environment.toJSON(e).uuid);
      else if (this.isMesh || this.isLine || this.isPoints) {
        i.geometry = s(e.geometries, this.geometry);
        const o = this.geometry.parameters;
        if (o !== void 0 && o.shapes !== void 0) {
          const h = o.shapes;
          if (Array.isArray(h))
            for (let c = 0, u = h.length; c < u; c++) {
              const f = h[c];
              s(e.shapes, f);
            }
          else
            s(e.shapes, h);
        }
      }
      if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(e.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0)
        if (Array.isArray(this.material)) {
          const o = [];
          for (let h = 0, c = this.material.length; h < c; h++)
            o.push(s(e.materials, this.material[h]));
          i.material = o;
        } else
          i.material = s(e.materials, this.material);
      if (this.children.length > 0) {
        i.children = [];
        for (let o = 0; o < this.children.length; o++)
          i.children.push(this.children[o].toJSON(e).object);
      }
      if (this.animations.length > 0) {
        i.animations = [];
        for (let o = 0; o < this.animations.length; o++) {
          const h = this.animations[o];
          i.animations.push(s(e.animations, h));
        }
      }
      if (t) {
        const o = a(e.geometries), h = a(e.materials), c = a(e.textures), u = a(e.images), f = a(e.shapes), l = a(e.skeletons), p = a(e.animations), g = a(e.nodes);
        o.length > 0 && (r.geometries = o), h.length > 0 && (r.materials = h), c.length > 0 && (r.textures = c), u.length > 0 && (r.images = u), f.length > 0 && (r.shapes = f), l.length > 0 && (r.skeletons = l), p.length > 0 && (r.animations = p), g.length > 0 && (r.nodes = g);
      }
      return r.object = i, r;
      function a(o) {
        const h = [];
        for (const c in o) {
          const u = o[c];
          delete u.metadata, h.push(u);
        }
        return h;
      }
    }
    clone(e) {
      return new this.constructor().copy(this, e);
    }
    copy(e, t = !0) {
      if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0)
        for (let r = 0; r < e.children.length; r++) {
          const i = e.children[r];
          this.add(i.clone());
        }
      return this;
    }
  }
  Ue.DEFAULT_UP = /* @__PURE__ */ new A(0, 1, 0);
  Ue.DEFAULT_MATRIX_AUTO_UPDATE = !0;
  Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
  const ze = /* @__PURE__ */ new A(), st = /* @__PURE__ */ new A(), ci = /* @__PURE__ */ new A(), at = /* @__PURE__ */ new A(), Kt = /* @__PURE__ */ new A(), er = /* @__PURE__ */ new A(), ta = /* @__PURE__ */ new A(), ui = /* @__PURE__ */ new A(), li = /* @__PURE__ */ new A(), fi = /* @__PURE__ */ new A(), pi = /* @__PURE__ */ new Wr(), di = /* @__PURE__ */ new Wr(), gi = /* @__PURE__ */ new Wr();
  class He {
    constructor(e = new A(), t = new A(), r = new A()) {
      this.a = e, this.b = t, this.c = r;
    }
    static getNormal(e, t, r, i) {
      i.subVectors(r, t), ze.subVectors(e, t), i.cross(ze);
      const s = i.lengthSq();
      return s > 0 ? i.multiplyScalar(1 / Math.sqrt(s)) : i.set(0, 0, 0);
    }
    // static/instance method to calculate barycentric coordinates
    // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
    static getBarycoord(e, t, r, i, s) {
      ze.subVectors(i, t), st.subVectors(r, t), ci.subVectors(e, t);
      const a = ze.dot(ze), o = ze.dot(st), h = ze.dot(ci), c = st.dot(st), u = st.dot(ci), f = a * c - o * o;
      if (f === 0)
        return s.set(0, 0, 0), null;
      const l = 1 / f, p = (c * h - o * u) * l, g = (a * u - o * h) * l;
      return s.set(1 - p - g, g, p);
    }
    static containsPoint(e, t, r, i) {
      return this.getBarycoord(e, t, r, i, at) === null ? !1 : at.x >= 0 && at.y >= 0 && at.x + at.y <= 1;
    }
    static getInterpolation(e, t, r, i, s, a, o, h) {
      return this.getBarycoord(e, t, r, i, at) === null ? (h.x = 0, h.y = 0, "z" in h && (h.z = 0), "w" in h && (h.w = 0), null) : (h.setScalar(0), h.addScaledVector(s, at.x), h.addScaledVector(a, at.y), h.addScaledVector(o, at.z), h);
    }
    static getInterpolatedAttribute(e, t, r, i, s, a) {
      return pi.setScalar(0), di.setScalar(0), gi.setScalar(0), pi.fromBufferAttribute(e, t), di.fromBufferAttribute(e, r), gi.fromBufferAttribute(e, i), a.setScalar(0), a.addScaledVector(pi, s.x), a.addScaledVector(di, s.y), a.addScaledVector(gi, s.z), a;
    }
    static isFrontFacing(e, t, r, i) {
      return ze.subVectors(r, t), st.subVectors(e, t), ze.cross(st).dot(i) < 0;
    }
    set(e, t, r) {
      return this.a.copy(e), this.b.copy(t), this.c.copy(r), this;
    }
    setFromPointsAndIndices(e, t, r, i) {
      return this.a.copy(e[t]), this.b.copy(e[r]), this.c.copy(e[i]), this;
    }
    setFromAttributeAndIndices(e, t, r, i) {
      return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, r), this.c.fromBufferAttribute(e, i), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
    }
    getArea() {
      return ze.subVectors(this.c, this.b), st.subVectors(this.a, this.b), ze.cross(st).length() * 0.5;
    }
    getMidpoint(e) {
      return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(e) {
      return He.getNormal(this.a, this.b, this.c, e);
    }
    getPlane(e) {
      return e.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(e, t) {
      return He.getBarycoord(e, this.a, this.b, this.c, t);
    }
    getInterpolation(e, t, r, i, s) {
      return He.getInterpolation(e, this.a, this.b, this.c, t, r, i, s);
    }
    containsPoint(e) {
      return He.containsPoint(e, this.a, this.b, this.c);
    }
    isFrontFacing(e) {
      return He.isFrontFacing(this.a, this.b, this.c, e);
    }
    intersectsBox(e) {
      return e.intersectsTriangle(this);
    }
    closestPointToPoint(e, t) {
      const r = this.a, i = this.b, s = this.c;
      let a, o;
      Kt.subVectors(i, r), er.subVectors(s, r), ui.subVectors(e, r);
      const h = Kt.dot(ui), c = er.dot(ui);
      if (h <= 0 && c <= 0)
        return t.copy(r);
      li.subVectors(e, i);
      const u = Kt.dot(li), f = er.dot(li);
      if (u >= 0 && f <= u)
        return t.copy(i);
      const l = h * f - u * c;
      if (l <= 0 && h >= 0 && u <= 0)
        return a = h / (h - u), t.copy(r).addScaledVector(Kt, a);
      fi.subVectors(e, s);
      const p = Kt.dot(fi), g = er.dot(fi);
      if (g >= 0 && p <= g)
        return t.copy(s);
      const m = p * c - h * g;
      if (m <= 0 && c >= 0 && g <= 0)
        return o = c / (c - g), t.copy(r).addScaledVector(er, o);
      const x = u * g - p * f;
      if (x <= 0 && f - u >= 0 && p - g >= 0)
        return ta.subVectors(s, i), o = (f - u) / (f - u + (p - g)), t.copy(i).addScaledVector(ta, o);
      const v = 1 / (x + m + l);
      return a = m * v, o = l * v, t.copy(r).addScaledVector(Kt, a).addScaledVector(er, o);
    }
    equals(e) {
      return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
    }
  }
  const Uo = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  }, vt = { h: 0, s: 0, l: 0 }, un = { h: 0, s: 0, l: 0 };
  function yi(n, e, t) {
    return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? n + (e - n) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? n + (e - n) * 6 * (2 / 3 - t) : n;
  }
  class pr {
    constructor(e, t, r) {
      return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, r);
    }
    set(e, t, r) {
      if (t === void 0 && r === void 0) {
        const i = e;
        i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
      } else
        this.setRGB(e, t, r);
      return this;
    }
    setScalar(e) {
      return this.r = e, this.g = e, this.b = e, this;
    }
    setHex(e, t = Ne) {
      return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, De.toWorkingColorSpace(this, t), this;
    }
    setRGB(e, t, r, i = De.workingColorSpace) {
      return this.r = e, this.g = t, this.b = r, De.toWorkingColorSpace(this, i), this;
    }
    setHSL(e, t, r, i = De.workingColorSpace) {
      if (e = Jh(e, 1), t = X(t, 0, 1), r = X(r, 0, 1), t === 0)
        this.r = this.g = this.b = r;
      else {
        const s = r <= 0.5 ? r * (1 + t) : r + t - r * t, a = 2 * r - s;
        this.r = yi(a, s, e + 1 / 3), this.g = yi(a, s, e), this.b = yi(a, s, e - 1 / 3);
      }
      return De.toWorkingColorSpace(this, i), this;
    }
    setStyle(e, t = Ne) {
      function r(s) {
        s !== void 0 && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
      }
      let i;
      if (i = /^(\w+)\(([^\)]*)\)/.exec(e)) {
        let s;
        const a = i[1], o = i[2];
        switch (a) {
          case "rgb":
          case "rgba":
            if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
              return r(s[4]), this.setRGB(
                Math.min(255, parseInt(s[1], 10)) / 255,
                Math.min(255, parseInt(s[2], 10)) / 255,
                Math.min(255, parseInt(s[3], 10)) / 255,
                t
              );
            if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
              return r(s[4]), this.setRGB(
                Math.min(100, parseInt(s[1], 10)) / 100,
                Math.min(100, parseInt(s[2], 10)) / 100,
                Math.min(100, parseInt(s[3], 10)) / 100,
                t
              );
            break;
          case "hsl":
          case "hsla":
            if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
              return r(s[4]), this.setHSL(
                parseFloat(s[1]) / 360,
                parseFloat(s[2]) / 100,
                parseFloat(s[3]) / 100,
                t
              );
            break;
          default:
            console.warn("THREE.Color: Unknown color model " + e);
        }
      } else if (i = /^\#([A-Fa-f\d]+)$/.exec(e)) {
        const s = i[1], a = s.length;
        if (a === 3)
          return this.setRGB(
            parseInt(s.charAt(0), 16) / 15,
            parseInt(s.charAt(1), 16) / 15,
            parseInt(s.charAt(2), 16) / 15,
            t
          );
        if (a === 6)
          return this.setHex(parseInt(s, 16), t);
        console.warn("THREE.Color: Invalid hex color " + e);
      } else if (e && e.length > 0)
        return this.setColorName(e, t);
      return this;
    }
    setColorName(e, t = Ne) {
      const r = Uo[e.toLowerCase()];
      return r !== void 0 ? this.setHex(r, t) : console.warn("THREE.Color: Unknown color " + e), this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(e) {
      return this.r = e.r, this.g = e.g, this.b = e.b, this;
    }
    copySRGBToLinear(e) {
      return this.r = lt(e.r), this.g = lt(e.g), this.b = lt(e.b), this;
    }
    copyLinearToSRGB(e) {
      return this.r = ar(e.r), this.g = ar(e.g), this.b = ar(e.b), this;
    }
    convertSRGBToLinear() {
      return this.copySRGBToLinear(this), this;
    }
    convertLinearToSRGB() {
      return this.copyLinearToSRGB(this), this;
    }
    getHex(e = Ne) {
      return De.fromWorkingColorSpace(ve.copy(this), e), Math.round(X(ve.r * 255, 0, 255)) * 65536 + Math.round(X(ve.g * 255, 0, 255)) * 256 + Math.round(X(ve.b * 255, 0, 255));
    }
    getHexString(e = Ne) {
      return ("000000" + this.getHex(e).toString(16)).slice(-6);
    }
    getHSL(e, t = De.workingColorSpace) {
      De.fromWorkingColorSpace(ve.copy(this), t);
      const r = ve.r, i = ve.g, s = ve.b, a = Math.max(r, i, s), o = Math.min(r, i, s);
      let h, c;
      const u = (o + a) / 2;
      if (o === a)
        h = 0, c = 0;
      else {
        const f = a - o;
        switch (c = u <= 0.5 ? f / (a + o) : f / (2 - a - o), a) {
          case r:
            h = (i - s) / f + (i < s ? 6 : 0);
            break;
          case i:
            h = (s - r) / f + 2;
            break;
          case s:
            h = (r - i) / f + 4;
            break;
        }
        h /= 6;
      }
      return e.h = h, e.s = c, e.l = u, e;
    }
    getRGB(e, t = De.workingColorSpace) {
      return De.fromWorkingColorSpace(ve.copy(this), t), e.r = ve.r, e.g = ve.g, e.b = ve.b, e;
    }
    getStyle(e = Ne) {
      De.fromWorkingColorSpace(ve.copy(this), e);
      const t = ve.r, r = ve.g, i = ve.b;
      return e !== Ne ? `color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(r * 255)},${Math.round(i * 255)})`;
    }
    offsetHSL(e, t, r) {
      return this.getHSL(vt), this.setHSL(vt.h + e, vt.s + t, vt.l + r);
    }
    add(e) {
      return this.r += e.r, this.g += e.g, this.b += e.b, this;
    }
    addColors(e, t) {
      return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
    }
    addScalar(e) {
      return this.r += e, this.g += e, this.b += e, this;
    }
    sub(e) {
      return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
    }
    multiply(e) {
      return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
    }
    multiplyScalar(e) {
      return this.r *= e, this.g *= e, this.b *= e, this;
    }
    lerp(e, t) {
      return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
    }
    lerpColors(e, t, r) {
      return this.r = e.r + (t.r - e.r) * r, this.g = e.g + (t.g - e.g) * r, this.b = e.b + (t.b - e.b) * r, this;
    }
    lerpHSL(e, t) {
      this.getHSL(vt), e.getHSL(un);
      const r = Kn(vt.h, un.h, t), i = Kn(vt.s, un.s, t), s = Kn(vt.l, un.l, t);
      return this.setHSL(r, i, s), this;
    }
    setFromVector3(e) {
      return this.r = e.x, this.g = e.y, this.b = e.z, this;
    }
    applyMatrix3(e) {
      const t = this.r, r = this.g, i = this.b, s = e.elements;
      return this.r = s[0] * t + s[3] * r + s[6] * i, this.g = s[1] * t + s[4] * r + s[7] * i, this.b = s[2] * t + s[5] * r + s[8] * i, this;
    }
    equals(e) {
      return e.r === this.r && e.g === this.g && e.b === this.b;
    }
    fromArray(e, t = 0) {
      return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
    }
    fromBufferAttribute(e, t) {
      return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      yield this.r, yield this.g, yield this.b;
    }
  }
  const ve = /* @__PURE__ */ new pr();
  pr.NAMES = Uo;
  let uc = 0;
  class Ro extends Vn {
    constructor() {
      super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: uc++ }), this.uuid = fr(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new pr(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = 7680, this.stencilZFail = 7680, this.stencilZPass = 7680, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(e) {
      this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
    }
    // onBeforeRender and onBeforeCompile only supported in WebGLRenderer
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(e) {
      if (e !== void 0)
        for (const t in e) {
          const r = e[t];
          if (r === void 0) {
            console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
            continue;
          }
          const i = this[t];
          if (i === void 0) {
            console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
            continue;
          }
          i && i.isColor ? i.set(r) : i && i.isVector3 && r && r.isVector3 ? i.copy(r) : this[t] = r;
        }
    }
    toJSON(e) {
      const t = e === void 0 || typeof e == "string";
      t && (e = {
        textures: {},
        images: {}
      });
      const r = {
        metadata: {
          version: 4.6,
          type: "Material",
          generator: "Material.toJSON"
        }
      };
      r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.color && this.color.isColor && (r.color = this.color.getHex()), this.roughness !== void 0 && (r.roughness = this.roughness), this.metalness !== void 0 && (r.metalness = this.metalness), this.sheen !== void 0 && (r.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (r.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (r.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (r.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (r.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (r.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (r.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (r.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (r.shininess = this.shininess), this.clearcoat !== void 0 && (r.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (r.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (r.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (r.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (r.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, r.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (r.dispersion = this.dispersion), this.iridescence !== void 0 && (r.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (r.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (r.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (r.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (r.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (r.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (r.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (r.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (r.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (r.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (r.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (r.lightMap = this.lightMap.toJSON(e).uuid, r.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (r.aoMap = this.aoMap.toJSON(e).uuid, r.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (r.bumpMap = this.bumpMap.toJSON(e).uuid, r.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (r.normalMap = this.normalMap.toJSON(e).uuid, r.normalMapType = this.normalMapType, r.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (r.displacementMap = this.displacementMap.toJSON(e).uuid, r.displacementScale = this.displacementScale, r.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (r.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (r.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (r.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (r.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (r.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (r.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (r.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (r.combine = this.combine)), this.envMapRotation !== void 0 && (r.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (r.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (r.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (r.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (r.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (r.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (r.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (r.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (r.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (r.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (r.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (r.size = this.size), this.shadowSide !== null && (r.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (r.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (r.blending = this.blending), this.side !== 0 && (r.side = this.side), this.vertexColors === !0 && (r.vertexColors = !0), this.opacity < 1 && (r.opacity = this.opacity), this.transparent === !0 && (r.transparent = !0), this.blendSrc !== 204 && (r.blendSrc = this.blendSrc), this.blendDst !== 205 && (r.blendDst = this.blendDst), this.blendEquation !== 100 && (r.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (r.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (r.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (r.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (r.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (r.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (r.depthFunc = this.depthFunc), this.depthTest === !1 && (r.depthTest = this.depthTest), this.depthWrite === !1 && (r.depthWrite = this.depthWrite), this.colorWrite === !1 && (r.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (r.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (r.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (r.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (r.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (r.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (r.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (r.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (r.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (r.rotation = this.rotation), this.polygonOffset === !0 && (r.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (r.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (r.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (r.linewidth = this.linewidth), this.dashSize !== void 0 && (r.dashSize = this.dashSize), this.gapSize !== void 0 && (r.gapSize = this.gapSize), this.scale !== void 0 && (r.scale = this.scale), this.dithering === !0 && (r.dithering = !0), this.alphaTest > 0 && (r.alphaTest = this.alphaTest), this.alphaHash === !0 && (r.alphaHash = !0), this.alphaToCoverage === !0 && (r.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (r.premultipliedAlpha = !0), this.forceSinglePass === !0 && (r.forceSinglePass = !0), this.wireframe === !0 && (r.wireframe = !0), this.wireframeLinewidth > 1 && (r.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (r.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (r.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (r.flatShading = !0), this.visible === !1 && (r.visible = !1), this.toneMapped === !1 && (r.toneMapped = !1), this.fog === !1 && (r.fog = !1), Object.keys(this.userData).length > 0 && (r.userData = this.userData);
      function i(s) {
        const a = [];
        for (const o in s) {
          const h = s[o];
          delete h.metadata, a.push(h);
        }
        return a;
      }
      if (t) {
        const s = i(e.textures), a = i(e.images);
        s.length > 0 && (r.textures = s), a.length > 0 && (r.images = a);
      }
      return r;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
      const t = e.clippingPlanes;
      let r = null;
      if (t !== null) {
        const i = t.length;
        r = new Array(i);
        for (let s = 0; s !== i; ++s)
          r[s] = t[s].clone();
      }
      return this.clippingPlanes = r, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    set needsUpdate(e) {
      e === !0 && this.version++;
    }
    onBuild() {
      console.warn("Material: onBuild() has been removed.");
    }
  }
  class Do extends Ro {
    constructor(e) {
      super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new pr(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new qr(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
    }
  }
  const fe = /* @__PURE__ */ new A(), ln = /* @__PURE__ */ new V();
  class We {
    constructor(e, t, r = !1) {
      if (Array.isArray(e))
        throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
      this.isBufferAttribute = !0, this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = r, this.usage = 35044, this.updateRanges = [], this.gpuType = 1015, this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(e) {
      e === !0 && this.version++;
    }
    setUsage(e) {
      return this.usage = e, this;
    }
    addUpdateRange(e, t) {
      this.updateRanges.push({ start: e, count: t });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e) {
      return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
    }
    copyAt(e, t, r) {
      e *= this.itemSize, r *= t.itemSize;
      for (let i = 0, s = this.itemSize; i < s; i++)
        this.array[e + i] = t.array[r + i];
      return this;
    }
    copyArray(e) {
      return this.array.set(e), this;
    }
    applyMatrix3(e) {
      if (this.itemSize === 2)
        for (let t = 0, r = this.count; t < r; t++)
          ln.fromBufferAttribute(this, t), ln.applyMatrix3(e), this.setXY(t, ln.x, ln.y);
      else if (this.itemSize === 3)
        for (let t = 0, r = this.count; t < r; t++)
          fe.fromBufferAttribute(this, t), fe.applyMatrix3(e), this.setXYZ(t, fe.x, fe.y, fe.z);
      return this;
    }
    applyMatrix4(e) {
      for (let t = 0, r = this.count; t < r; t++)
        fe.fromBufferAttribute(this, t), fe.applyMatrix4(e), this.setXYZ(t, fe.x, fe.y, fe.z);
      return this;
    }
    applyNormalMatrix(e) {
      for (let t = 0, r = this.count; t < r; t++)
        fe.fromBufferAttribute(this, t), fe.applyNormalMatrix(e), this.setXYZ(t, fe.x, fe.y, fe.z);
      return this;
    }
    transformDirection(e) {
      for (let t = 0, r = this.count; t < r; t++)
        fe.fromBufferAttribute(this, t), fe.transformDirection(e), this.setXYZ(t, fe.x, fe.y, fe.z);
      return this;
    }
    set(e, t = 0) {
      return this.array.set(e, t), this;
    }
    getComponent(e, t) {
      let r = this.array[e * this.itemSize + t];
      return this.normalized && (r = mr(r, this.array)), r;
    }
    setComponent(e, t, r) {
      return this.normalized && (r = we(r, this.array)), this.array[e * this.itemSize + t] = r, this;
    }
    getX(e) {
      let t = this.array[e * this.itemSize];
      return this.normalized && (t = mr(t, this.array)), t;
    }
    setX(e, t) {
      return this.normalized && (t = we(t, this.array)), this.array[e * this.itemSize] = t, this;
    }
    getY(e) {
      let t = this.array[e * this.itemSize + 1];
      return this.normalized && (t = mr(t, this.array)), t;
    }
    setY(e, t) {
      return this.normalized && (t = we(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
    }
    getZ(e) {
      let t = this.array[e * this.itemSize + 2];
      return this.normalized && (t = mr(t, this.array)), t;
    }
    setZ(e, t) {
      return this.normalized && (t = we(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
    }
    getW(e) {
      let t = this.array[e * this.itemSize + 3];
      return this.normalized && (t = mr(t, this.array)), t;
    }
    setW(e, t) {
      return this.normalized && (t = we(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
    }
    setXY(e, t, r) {
      return e *= this.itemSize, this.normalized && (t = we(t, this.array), r = we(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = r, this;
    }
    setXYZ(e, t, r, i) {
      return e *= this.itemSize, this.normalized && (t = we(t, this.array), r = we(r, this.array), i = we(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = r, this.array[e + 2] = i, this;
    }
    setXYZW(e, t, r, i, s) {
      return e *= this.itemSize, this.normalized && (t = we(t, this.array), r = we(r, this.array), i = we(i, this.array), s = we(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = r, this.array[e + 2] = i, this.array[e + 3] = s, this;
    }
    onUpload(e) {
      return this.onUploadCallback = e, this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      const e = {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array),
        normalized: this.normalized
      };
      return this.name !== "" && (e.name = this.name), this.usage !== 35044 && (e.usage = this.usage), e;
    }
  }
  class lc extends We {
    constructor(e, t, r) {
      super(new Uint16Array(e), t, r);
    }
  }
  class fc extends We {
    constructor(e, t, r) {
      super(new Uint32Array(e), t, r);
    }
  }
  class Nt extends We {
    constructor(e, t, r) {
      super(new Float32Array(e), t, r);
    }
  }
  let pc = 0;
  const Ae = /* @__PURE__ */ new xe(), mi = /* @__PURE__ */ new Ue(), tr = /* @__PURE__ */ new A(), Te = /* @__PURE__ */ new Ht(), wr = /* @__PURE__ */ new Ht(), de = /* @__PURE__ */ new A();
  class Oe extends Vn {
    constructor() {
      super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: pc++ }), this.uuid = fr(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
    }
    getIndex() {
      return this.index;
    }
    setIndex(e) {
      return Array.isArray(e) ? this.index = new ($h(e) ? fc : lc)(e, 1) : this.index = e, this;
    }
    setIndirect(e) {
      return this.indirect = e, this;
    }
    getIndirect() {
      return this.indirect;
    }
    getAttribute(e) {
      return this.attributes[e];
    }
    setAttribute(e, t) {
      return this.attributes[e] = t, this;
    }
    deleteAttribute(e) {
      return delete this.attributes[e], this;
    }
    hasAttribute(e) {
      return this.attributes[e] !== void 0;
    }
    addGroup(e, t, r = 0) {
      this.groups.push({
        start: e,
        count: t,
        materialIndex: r
      });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(e, t) {
      this.drawRange.start = e, this.drawRange.count = t;
    }
    applyMatrix4(e) {
      const t = this.attributes.position;
      t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
      const r = this.attributes.normal;
      if (r !== void 0) {
        const s = new Mt().getNormalMatrix(e);
        r.applyNormalMatrix(s), r.needsUpdate = !0;
      }
      const i = this.attributes.tangent;
      return i !== void 0 && (i.transformDirection(e), i.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
    }
    applyQuaternion(e) {
      return Ae.makeRotationFromQuaternion(e), this.applyMatrix4(Ae), this;
    }
    rotateX(e) {
      return Ae.makeRotationX(e), this.applyMatrix4(Ae), this;
    }
    rotateY(e) {
      return Ae.makeRotationY(e), this.applyMatrix4(Ae), this;
    }
    rotateZ(e) {
      return Ae.makeRotationZ(e), this.applyMatrix4(Ae), this;
    }
    translate(e, t, r) {
      return Ae.makeTranslation(e, t, r), this.applyMatrix4(Ae), this;
    }
    scale(e, t, r) {
      return Ae.makeScale(e, t, r), this.applyMatrix4(Ae), this;
    }
    lookAt(e) {
      return mi.lookAt(e), mi.updateMatrix(), this.applyMatrix4(mi.matrix), this;
    }
    center() {
      return this.computeBoundingBox(), this.boundingBox.getCenter(tr).negate(), this.translate(tr.x, tr.y, tr.z), this;
    }
    setFromPoints(e) {
      const t = this.getAttribute("position");
      if (t === void 0) {
        const r = [];
        for (let i = 0, s = e.length; i < s; i++) {
          const a = e[i];
          r.push(a.x, a.y, a.z || 0);
        }
        this.setAttribute("position", new Nt(r, 3));
      } else {
        const r = Math.min(e.length, t.count);
        for (let i = 0; i < r; i++) {
          const s = e[i];
          t.setXYZ(i, s.x, s.y, s.z || 0);
        }
        e.length > t.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = !0;
      }
      return this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new Ht());
      const e = this.attributes.position, t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
          new A(-1 / 0, -1 / 0, -1 / 0),
          new A(1 / 0, 1 / 0, 1 / 0)
        );
        return;
      }
      if (e !== void 0) {
        if (this.boundingBox.setFromBufferAttribute(e), t)
          for (let r = 0, i = t.length; r < i; r++) {
            const s = t[r];
            Te.setFromBufferAttribute(s), this.morphTargetsRelative ? (de.addVectors(this.boundingBox.min, Te.min), this.boundingBox.expandByPoint(de), de.addVectors(this.boundingBox.max, Te.max), this.boundingBox.expandByPoint(de)) : (this.boundingBox.expandByPoint(Te.min), this.boundingBox.expandByPoint(Te.max));
          }
      } else
        this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new ys());
      const e = this.attributes.position, t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new A(), 1 / 0);
        return;
      }
      if (e) {
        const r = this.boundingSphere.center;
        if (Te.setFromBufferAttribute(e), t)
          for (let s = 0, a = t.length; s < a; s++) {
            const o = t[s];
            wr.setFromBufferAttribute(o), this.morphTargetsRelative ? (de.addVectors(Te.min, wr.min), Te.expandByPoint(de), de.addVectors(Te.max, wr.max), Te.expandByPoint(de)) : (Te.expandByPoint(wr.min), Te.expandByPoint(wr.max));
          }
        Te.getCenter(r);
        let i = 0;
        for (let s = 0, a = e.count; s < a; s++)
          de.fromBufferAttribute(e, s), i = Math.max(i, r.distanceToSquared(de));
        if (t)
          for (let s = 0, a = t.length; s < a; s++) {
            const o = t[s], h = this.morphTargetsRelative;
            for (let c = 0, u = o.count; c < u; c++)
              de.fromBufferAttribute(o, c), h && (tr.fromBufferAttribute(e, c), de.add(tr)), i = Math.max(i, r.distanceToSquared(de));
          }
        this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
      }
    }
    computeTangents() {
      const e = this.index, t = this.attributes;
      if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
        console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
        return;
      }
      const r = t.position, i = t.normal, s = t.uv;
      this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new We(new Float32Array(4 * r.count), 4));
      const a = this.getAttribute("tangent"), o = [], h = [];
      for (let B = 0; B < r.count; B++)
        o[B] = new A(), h[B] = new A();
      const c = new A(), u = new A(), f = new A(), l = new V(), p = new V(), g = new V(), m = new A(), x = new A();
      function v(B, I, N) {
        c.fromBufferAttribute(r, B), u.fromBufferAttribute(r, I), f.fromBufferAttribute(r, N), l.fromBufferAttribute(s, B), p.fromBufferAttribute(s, I), g.fromBufferAttribute(s, N), u.sub(c), f.sub(c), p.sub(l), g.sub(l);
        const q = 1 / (p.x * g.y - g.x * p.y);
        isFinite(q) && (m.copy(u).multiplyScalar(g.y).addScaledVector(f, -p.y).multiplyScalar(q), x.copy(f).multiplyScalar(p.x).addScaledVector(u, -g.x).multiplyScalar(q), o[B].add(m), o[I].add(m), o[N].add(m), h[B].add(x), h[I].add(x), h[N].add(x));
      }
      let w = this.groups;
      w.length === 0 && (w = [{
        start: 0,
        count: e.count
      }]);
      for (let B = 0, I = w.length; B < I; ++B) {
        const N = w[B], q = N.start, re = N.count;
        for (let Y = q, Z = q + re; Y < Z; Y += 3)
          v(
            e.getX(Y + 0),
            e.getX(Y + 1),
            e.getX(Y + 2)
          );
      }
      const b = new A(), F = new A(), C = new A(), _ = new A();
      function E(B) {
        C.fromBufferAttribute(i, B), _.copy(C);
        const I = o[B];
        b.copy(I), b.sub(C.multiplyScalar(C.dot(I))).normalize(), F.crossVectors(_, I);
        const q = F.dot(h[B]) < 0 ? -1 : 1;
        a.setXYZW(B, b.x, b.y, b.z, q);
      }
      for (let B = 0, I = w.length; B < I; ++B) {
        const N = w[B], q = N.start, re = N.count;
        for (let Y = q, Z = q + re; Y < Z; Y += 3)
          E(e.getX(Y + 0)), E(e.getX(Y + 1)), E(e.getX(Y + 2));
      }
    }
    computeVertexNormals() {
      const e = this.index, t = this.getAttribute("position");
      if (t !== void 0) {
        let r = this.getAttribute("normal");
        if (r === void 0)
          r = new We(new Float32Array(t.count * 3), 3), this.setAttribute("normal", r);
        else
          for (let l = 0, p = r.count; l < p; l++)
            r.setXYZ(l, 0, 0, 0);
        const i = new A(), s = new A(), a = new A(), o = new A(), h = new A(), c = new A(), u = new A(), f = new A();
        if (e)
          for (let l = 0, p = e.count; l < p; l += 3) {
            const g = e.getX(l + 0), m = e.getX(l + 1), x = e.getX(l + 2);
            i.fromBufferAttribute(t, g), s.fromBufferAttribute(t, m), a.fromBufferAttribute(t, x), u.subVectors(a, s), f.subVectors(i, s), u.cross(f), o.fromBufferAttribute(r, g), h.fromBufferAttribute(r, m), c.fromBufferAttribute(r, x), o.add(u), h.add(u), c.add(u), r.setXYZ(g, o.x, o.y, o.z), r.setXYZ(m, h.x, h.y, h.z), r.setXYZ(x, c.x, c.y, c.z);
          }
        else
          for (let l = 0, p = t.count; l < p; l += 3)
            i.fromBufferAttribute(t, l + 0), s.fromBufferAttribute(t, l + 1), a.fromBufferAttribute(t, l + 2), u.subVectors(a, s), f.subVectors(i, s), u.cross(f), r.setXYZ(l + 0, u.x, u.y, u.z), r.setXYZ(l + 1, u.x, u.y, u.z), r.setXYZ(l + 2, u.x, u.y, u.z);
        this.normalizeNormals(), r.needsUpdate = !0;
      }
    }
    normalizeNormals() {
      const e = this.attributes.normal;
      for (let t = 0, r = e.count; t < r; t++)
        de.fromBufferAttribute(e, t), de.normalize(), e.setXYZ(t, de.x, de.y, de.z);
    }
    toNonIndexed() {
      function e(o, h) {
        const c = o.array, u = o.itemSize, f = o.normalized, l = new c.constructor(h.length * u);
        let p = 0, g = 0;
        for (let m = 0, x = h.length; m < x; m++) {
          o.isInterleavedBufferAttribute ? p = h[m] * o.data.stride + o.offset : p = h[m] * u;
          for (let v = 0; v < u; v++)
            l[g++] = c[p++];
        }
        return new We(l, u, f);
      }
      if (this.index === null)
        return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
      const t = new Oe(), r = this.index.array, i = this.attributes;
      for (const o in i) {
        const h = i[o], c = e(h, r);
        t.setAttribute(o, c);
      }
      const s = this.morphAttributes;
      for (const o in s) {
        const h = [], c = s[o];
        for (let u = 0, f = c.length; u < f; u++) {
          const l = c[u], p = e(l, r);
          h.push(p);
        }
        t.morphAttributes[o] = h;
      }
      t.morphTargetsRelative = this.morphTargetsRelative;
      const a = this.groups;
      for (let o = 0, h = a.length; o < h; o++) {
        const c = a[o];
        t.addGroup(c.start, c.count, c.materialIndex);
      }
      return t;
    }
    toJSON() {
      const e = {
        metadata: {
          version: 4.6,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON"
        }
      };
      if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
        const h = this.parameters;
        for (const c in h)
          h[c] !== void 0 && (e[c] = h[c]);
        return e;
      }
      e.data = { attributes: {} };
      const t = this.index;
      t !== null && (e.data.index = {
        type: t.array.constructor.name,
        array: Array.prototype.slice.call(t.array)
      });
      const r = this.attributes;
      for (const h in r) {
        const c = r[h];
        e.data.attributes[h] = c.toJSON(e.data);
      }
      const i = {};
      let s = !1;
      for (const h in this.morphAttributes) {
        const c = this.morphAttributes[h], u = [];
        for (let f = 0, l = c.length; f < l; f++) {
          const p = c[f];
          u.push(p.toJSON(e.data));
        }
        u.length > 0 && (i[h] = u, s = !0);
      }
      s && (e.data.morphAttributes = i, e.data.morphTargetsRelative = this.morphTargetsRelative);
      const a = this.groups;
      a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
      const o = this.boundingSphere;
      return o !== null && (e.data.boundingSphere = {
        center: o.center.toArray(),
        radius: o.radius
      }), e;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
      const t = {};
      this.name = e.name;
      const r = e.index;
      r !== null && this.setIndex(r.clone(t));
      const i = e.attributes;
      for (const c in i) {
        const u = i[c];
        this.setAttribute(c, u.clone(t));
      }
      const s = e.morphAttributes;
      for (const c in s) {
        const u = [], f = s[c];
        for (let l = 0, p = f.length; l < p; l++)
          u.push(f[l].clone(t));
        this.morphAttributes[c] = u;
      }
      this.morphTargetsRelative = e.morphTargetsRelative;
      const a = e.groups;
      for (let c = 0, u = a.length; c < u; c++) {
        const f = a[c];
        this.addGroup(f.start, f.count, f.materialIndex);
      }
      const o = e.boundingBox;
      o !== null && (this.boundingBox = o.clone());
      const h = e.boundingSphere;
      return h !== null && (this.boundingSphere = h.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  }
  const ra = /* @__PURE__ */ new xe(), Lt = /* @__PURE__ */ new Lo(), fn = /* @__PURE__ */ new ys(), na = /* @__PURE__ */ new A(), pn = /* @__PURE__ */ new A(), dn = /* @__PURE__ */ new A(), gn = /* @__PURE__ */ new A(), vi = /* @__PURE__ */ new A(), yn = /* @__PURE__ */ new A(), ia = /* @__PURE__ */ new A(), mn = /* @__PURE__ */ new A();
  class Un extends Ue {
    constructor(e = new Oe(), t = new Do()) {
      super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    updateMorphTargets() {
      const t = this.geometry.morphAttributes, r = Object.keys(t);
      if (r.length > 0) {
        const i = t[r[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let s = 0, a = i.length; s < a; s++) {
            const o = i[s].name || String(s);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
          }
        }
      }
    }
    getVertexPosition(e, t) {
      const r = this.geometry, i = r.attributes.position, s = r.morphAttributes.position, a = r.morphTargetsRelative;
      t.fromBufferAttribute(i, e);
      const o = this.morphTargetInfluences;
      if (s && o) {
        yn.set(0, 0, 0);
        for (let h = 0, c = s.length; h < c; h++) {
          const u = o[h], f = s[h];
          u !== 0 && (vi.fromBufferAttribute(f, e), a ? yn.addScaledVector(vi, u) : yn.addScaledVector(vi.sub(t), u));
        }
        t.add(yn);
      }
      return t;
    }
    raycast(e, t) {
      const r = this.geometry, i = this.material, s = this.matrixWorld;
      i !== void 0 && (r.boundingSphere === null && r.computeBoundingSphere(), fn.copy(r.boundingSphere), fn.applyMatrix4(s), Lt.copy(e.ray).recast(e.near), !(fn.containsPoint(Lt.origin) === !1 && (Lt.intersectSphere(fn, na) === null || Lt.origin.distanceToSquared(na) > (e.far - e.near) ** 2)) && (ra.copy(s).invert(), Lt.copy(e.ray).applyMatrix4(ra), !(r.boundingBox !== null && Lt.intersectsBox(r.boundingBox) === !1) && this._computeIntersections(e, t, Lt)));
    }
    _computeIntersections(e, t, r) {
      let i;
      const s = this.geometry, a = this.material, o = s.index, h = s.attributes.position, c = s.attributes.uv, u = s.attributes.uv1, f = s.attributes.normal, l = s.groups, p = s.drawRange;
      if (o !== null)
        if (Array.isArray(a))
          for (let g = 0, m = l.length; g < m; g++) {
            const x = l[g], v = a[x.materialIndex], w = Math.max(x.start, p.start), b = Math.min(o.count, Math.min(x.start + x.count, p.start + p.count));
            for (let F = w, C = b; F < C; F += 3) {
              const _ = o.getX(F), E = o.getX(F + 1), B = o.getX(F + 2);
              i = vn(this, v, e, r, c, u, f, _, E, B), i && (i.faceIndex = Math.floor(F / 3), i.face.materialIndex = x.materialIndex, t.push(i));
            }
          }
        else {
          const g = Math.max(0, p.start), m = Math.min(o.count, p.start + p.count);
          for (let x = g, v = m; x < v; x += 3) {
            const w = o.getX(x), b = o.getX(x + 1), F = o.getX(x + 2);
            i = vn(this, a, e, r, c, u, f, w, b, F), i && (i.faceIndex = Math.floor(x / 3), t.push(i));
          }
        }
      else if (h !== void 0)
        if (Array.isArray(a))
          for (let g = 0, m = l.length; g < m; g++) {
            const x = l[g], v = a[x.materialIndex], w = Math.max(x.start, p.start), b = Math.min(h.count, Math.min(x.start + x.count, p.start + p.count));
            for (let F = w, C = b; F < C; F += 3) {
              const _ = F, E = F + 1, B = F + 2;
              i = vn(this, v, e, r, c, u, f, _, E, B), i && (i.faceIndex = Math.floor(F / 3), i.face.materialIndex = x.materialIndex, t.push(i));
            }
          }
        else {
          const g = Math.max(0, p.start), m = Math.min(h.count, p.start + p.count);
          for (let x = g, v = m; x < v; x += 3) {
            const w = x, b = x + 1, F = x + 2;
            i = vn(this, a, e, r, c, u, f, w, b, F), i && (i.faceIndex = Math.floor(x / 3), t.push(i));
          }
        }
    }
  }
  function dc(n, e, t, r, i, s, a, o) {
    let h;
    if (e.side === 1 ? h = r.intersectTriangle(a, s, i, !0, o) : h = r.intersectTriangle(i, s, a, e.side === 0, o), h === null) return null;
    mn.copy(o), mn.applyMatrix4(n.matrixWorld);
    const c = t.ray.origin.distanceTo(mn);
    return c < t.near || c > t.far ? null : {
      distance: c,
      point: mn.clone(),
      object: n
    };
  }
  function vn(n, e, t, r, i, s, a, o, h, c) {
    n.getVertexPosition(o, pn), n.getVertexPosition(h, dn), n.getVertexPosition(c, gn);
    const u = dc(n, e, t, r, pn, dn, gn, ia);
    if (u) {
      const f = new A();
      He.getBarycoord(ia, pn, dn, gn, f), i && (u.uv = He.getInterpolatedAttribute(i, o, h, c, f, new V())), s && (u.uv1 = He.getInterpolatedAttribute(s, o, h, c, f, new V())), a && (u.normal = He.getInterpolatedAttribute(a, o, h, c, f, new A()), u.normal.dot(r.direction) > 0 && u.normal.multiplyScalar(-1));
      const l = {
        a: o,
        b: h,
        c,
        normal: new A(),
        materialIndex: 0
      };
      He.getNormal(pn, dn, gn, l.normal), u.face = l, u.barycoord = f;
    }
    return u;
  }
  class Io extends Ro {
    constructor(e) {
      super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new pr(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
    }
  }
  const Rn = /* @__PURE__ */ new A(), Dn = /* @__PURE__ */ new A(), sa = /* @__PURE__ */ new xe(), Sr = /* @__PURE__ */ new Lo(), xn = /* @__PURE__ */ new ys(), xi = /* @__PURE__ */ new A(), aa = /* @__PURE__ */ new A();
  class ms extends Ue {
    constructor(e = new Oe(), t = new Io()) {
      super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    computeLineDistances() {
      const e = this.geometry;
      if (e.index === null) {
        const t = e.attributes.position, r = [0];
        for (let i = 1, s = t.count; i < s; i++)
          Rn.fromBufferAttribute(t, i - 1), Dn.fromBufferAttribute(t, i), r[i] = r[i - 1], r[i] += Rn.distanceTo(Dn);
        e.setAttribute("lineDistance", new Nt(r, 1));
      } else
        console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
    raycast(e, t) {
      const r = this.geometry, i = this.matrixWorld, s = e.params.Line.threshold, a = r.drawRange;
      if (r.boundingSphere === null && r.computeBoundingSphere(), xn.copy(r.boundingSphere), xn.applyMatrix4(i), xn.radius += s, e.ray.intersectsSphere(xn) === !1) return;
      sa.copy(i).invert(), Sr.copy(e.ray).applyMatrix4(sa);
      const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), h = o * o, c = this.isLineSegments ? 2 : 1, u = r.index, l = r.attributes.position;
      if (u !== null) {
        const p = Math.max(0, a.start), g = Math.min(u.count, a.start + a.count);
        for (let m = p, x = g - 1; m < x; m += c) {
          const v = u.getX(m), w = u.getX(m + 1), b = bn(this, e, Sr, h, v, w);
          b && t.push(b);
        }
        if (this.isLineLoop) {
          const m = u.getX(g - 1), x = u.getX(p), v = bn(this, e, Sr, h, m, x);
          v && t.push(v);
        }
      } else {
        const p = Math.max(0, a.start), g = Math.min(l.count, a.start + a.count);
        for (let m = p, x = g - 1; m < x; m += c) {
          const v = bn(this, e, Sr, h, m, m + 1);
          v && t.push(v);
        }
        if (this.isLineLoop) {
          const m = bn(this, e, Sr, h, g - 1, p);
          m && t.push(m);
        }
      }
    }
    updateMorphTargets() {
      const t = this.geometry.morphAttributes, r = Object.keys(t);
      if (r.length > 0) {
        const i = t[r[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let s = 0, a = i.length; s < a; s++) {
            const o = i[s].name || String(s);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
          }
        }
      }
    }
  }
  function bn(n, e, t, r, i, s) {
    const a = n.geometry.attributes.position;
    if (Rn.fromBufferAttribute(a, i), Dn.fromBufferAttribute(a, s), t.distanceSqToSegment(Rn, Dn, xi, aa) > r) return;
    xi.applyMatrix4(n.matrixWorld);
    const h = e.ray.origin.distanceTo(xi);
    if (!(h < e.near || h > e.far))
      return {
        distance: h,
        // What do we want? intersection point on the ray or on the segment??
        // point: raycaster.ray.at( distance ),
        point: aa.clone().applyMatrix4(n.matrixWorld),
        index: i,
        face: null,
        faceIndex: null,
        barycoord: null,
        object: n
      };
  }
  const oa = /* @__PURE__ */ new A(), ha = /* @__PURE__ */ new A();
  class gc extends ms {
    constructor(e, t) {
      super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
    }
    computeLineDistances() {
      const e = this.geometry;
      if (e.index === null) {
        const t = e.attributes.position, r = [];
        for (let i = 0, s = t.count; i < s; i += 2)
          oa.fromBufferAttribute(t, i), ha.fromBufferAttribute(t, i + 1), r[i] = i === 0 ? 0 : r[i - 1], r[i + 1] = r[i] + oa.distanceTo(ha);
        e.setAttribute("lineDistance", new Nt(r, 1));
      } else
        console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
  }
  class ca extends Ue {
    constructor() {
      super(), this.isGroup = !0, this.type = "Group";
    }
  }
  class tt {
    constructor() {
      this.type = "Curve", this.arcLengthDivisions = 200;
    }
    // Virtual base class method to overwrite and implement in subclasses
    //	- t [0 .. 1]
    getPoint() {
      return console.warn("THREE.Curve: .getPoint() not implemented."), null;
    }
    // Get point at relative position in curve according to arc length
    // - u [0 .. 1]
    getPointAt(e, t) {
      const r = this.getUtoTmapping(e);
      return this.getPoint(r, t);
    }
    // Get sequence of points using getPoint( t )
    getPoints(e = 5) {
      const t = [];
      for (let r = 0; r <= e; r++)
        t.push(this.getPoint(r / e));
      return t;
    }
    // Get sequence of points using getPointAt( u )
    getSpacedPoints(e = 5) {
      const t = [];
      for (let r = 0; r <= e; r++)
        t.push(this.getPointAt(r / e));
      return t;
    }
    // Get total curve arc length
    getLength() {
      const e = this.getLengths();
      return e[e.length - 1];
    }
    // Get list of cumulative segment lengths
    getLengths(e = this.arcLengthDivisions) {
      if (this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate)
        return this.cacheArcLengths;
      this.needsUpdate = !1;
      const t = [];
      let r, i = this.getPoint(0), s = 0;
      t.push(0);
      for (let a = 1; a <= e; a++)
        r = this.getPoint(a / e), s += r.distanceTo(i), t.push(s), i = r;
      return this.cacheArcLengths = t, t;
    }
    updateArcLengths() {
      this.needsUpdate = !0, this.getLengths();
    }
    // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant
    getUtoTmapping(e, t) {
      const r = this.getLengths();
      let i = 0;
      const s = r.length;
      let a;
      t ? a = t : a = e * r[s - 1];
      let o = 0, h = s - 1, c;
      for (; o <= h; )
        if (i = Math.floor(o + (h - o) / 2), c = r[i] - a, c < 0)
          o = i + 1;
        else if (c > 0)
          h = i - 1;
        else {
          h = i;
          break;
        }
      if (i = h, r[i] === a)
        return i / (s - 1);
      const u = r[i], l = r[i + 1] - u, p = (a - u) / l;
      return (i + p) / (s - 1);
    }
    // Returns a unit vector tangent at t
    // In case any sub curve does not implement its tangent derivation,
    // 2 points a small delta apart will be used to find its gradient
    // which seems to give a reasonable approximation
    getTangent(e, t) {
      let i = e - 1e-4, s = e + 1e-4;
      i < 0 && (i = 0), s > 1 && (s = 1);
      const a = this.getPoint(i), o = this.getPoint(s), h = t || (a.isVector2 ? new V() : new A());
      return h.copy(o).sub(a).normalize(), h;
    }
    getTangentAt(e, t) {
      const r = this.getUtoTmapping(e);
      return this.getTangent(r, t);
    }
    computeFrenetFrames(e, t) {
      const r = new A(), i = [], s = [], a = [], o = new A(), h = new xe();
      for (let p = 0; p <= e; p++) {
        const g = p / e;
        i[p] = this.getTangentAt(g, new A());
      }
      s[0] = new A(), a[0] = new A();
      let c = Number.MAX_VALUE;
      const u = Math.abs(i[0].x), f = Math.abs(i[0].y), l = Math.abs(i[0].z);
      u <= c && (c = u, r.set(1, 0, 0)), f <= c && (c = f, r.set(0, 1, 0)), l <= c && r.set(0, 0, 1), o.crossVectors(i[0], r).normalize(), s[0].crossVectors(i[0], o), a[0].crossVectors(i[0], s[0]);
      for (let p = 1; p <= e; p++) {
        if (s[p] = s[p - 1].clone(), a[p] = a[p - 1].clone(), o.crossVectors(i[p - 1], i[p]), o.length() > Number.EPSILON) {
          o.normalize();
          const g = Math.acos(X(i[p - 1].dot(i[p]), -1, 1));
          s[p].applyMatrix4(h.makeRotationAxis(o, g));
        }
        a[p].crossVectors(i[p], s[p]);
      }
      if (t === !0) {
        let p = Math.acos(X(s[0].dot(s[e]), -1, 1));
        p /= e, i[0].dot(o.crossVectors(s[0], s[e])) > 0 && (p = -p);
        for (let g = 1; g <= e; g++)
          s[g].applyMatrix4(h.makeRotationAxis(i[g], p * g)), a[g].crossVectors(i[g], s[g]);
      }
      return {
        tangents: i,
        normals: s,
        binormals: a
      };
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.arcLengthDivisions = e.arcLengthDivisions, this;
    }
    toJSON() {
      const e = {
        metadata: {
          version: 4.6,
          type: "Curve",
          generator: "Curve.toJSON"
        }
      };
      return e.arcLengthDivisions = this.arcLengthDivisions, e.type = this.type, e;
    }
    fromJSON(e) {
      return this.arcLengthDivisions = e.arcLengthDivisions, this;
    }
  }
  class Or extends tt {
    constructor(e = 0, t = 0, r = 1, i = 1, s = 0, a = Math.PI * 2, o = !1, h = 0) {
      super(), this.isEllipseCurve = !0, this.type = "EllipseCurve", this.aX = e, this.aY = t, this.xRadius = r, this.yRadius = i, this.aStartAngle = s, this.aEndAngle = a, this.aClockwise = o, this.aRotation = h;
    }
    getPoint(e, t = new V()) {
      const r = t, i = Math.PI * 2;
      let s = this.aEndAngle - this.aStartAngle;
      const a = Math.abs(s) < Number.EPSILON;
      for (; s < 0; ) s += i;
      for (; s > i; ) s -= i;
      s < Number.EPSILON && (a ? s = 0 : s = i), this.aClockwise === !0 && !a && (s === i ? s = -i : s = s - i);
      const o = this.aStartAngle + e * s;
      let h = this.aX + this.xRadius * Math.cos(o), c = this.aY + this.yRadius * Math.sin(o);
      if (this.aRotation !== 0) {
        const u = Math.cos(this.aRotation), f = Math.sin(this.aRotation), l = h - this.aX, p = c - this.aY;
        h = l * u - p * f + this.aX, c = l * f + p * u + this.aY;
      }
      return r.set(h, c);
    }
    copy(e) {
      return super.copy(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.aX = this.aX, e.aY = this.aY, e.xRadius = this.xRadius, e.yRadius = this.yRadius, e.aStartAngle = this.aStartAngle, e.aEndAngle = this.aEndAngle, e.aClockwise = this.aClockwise, e.aRotation = this.aRotation, e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this;
    }
  }
  class yc extends Or {
    constructor(e, t, r, i, s, a) {
      super(e, t, r, r, i, s, a), this.isArcCurve = !0, this.type = "ArcCurve";
    }
  }
  function vs() {
    let n = 0, e = 0, t = 0, r = 0;
    function i(s, a, o, h) {
      n = s, e = o, t = -3 * s + 3 * a - 2 * o - h, r = 2 * s - 2 * a + o + h;
    }
    return {
      initCatmullRom: function(s, a, o, h, c) {
        i(a, o, c * (o - s), c * (h - a));
      },
      initNonuniformCatmullRom: function(s, a, o, h, c, u, f) {
        let l = (a - s) / c - (o - s) / (c + u) + (o - a) / u, p = (o - a) / u - (h - a) / (u + f) + (h - o) / f;
        l *= u, p *= u, i(a, o, l, p);
      },
      calc: function(s) {
        const a = s * s, o = a * s;
        return n + e * s + t * a + r * o;
      }
    };
  }
  const wn = /* @__PURE__ */ new A(), bi = /* @__PURE__ */ new vs(), wi = /* @__PURE__ */ new vs(), Si = /* @__PURE__ */ new vs();
  class mc extends tt {
    constructor(e = [], t = !1, r = "centripetal", i = 0.5) {
      super(), this.isCatmullRomCurve3 = !0, this.type = "CatmullRomCurve3", this.points = e, this.closed = t, this.curveType = r, this.tension = i;
    }
    getPoint(e, t = new A()) {
      const r = t, i = this.points, s = i.length, a = (s - (this.closed ? 0 : 1)) * e;
      let o = Math.floor(a), h = a - o;
      this.closed ? o += o > 0 ? 0 : (Math.floor(Math.abs(o) / s) + 1) * s : h === 0 && o === s - 1 && (o = s - 2, h = 1);
      let c, u;
      this.closed || o > 0 ? c = i[(o - 1) % s] : (wn.subVectors(i[0], i[1]).add(i[0]), c = wn);
      const f = i[o % s], l = i[(o + 1) % s];
      if (this.closed || o + 2 < s ? u = i[(o + 2) % s] : (wn.subVectors(i[s - 1], i[s - 2]).add(i[s - 1]), u = wn), this.curveType === "centripetal" || this.curveType === "chordal") {
        const p = this.curveType === "chordal" ? 0.5 : 0.25;
        let g = Math.pow(c.distanceToSquared(f), p), m = Math.pow(f.distanceToSquared(l), p), x = Math.pow(l.distanceToSquared(u), p);
        m < 1e-4 && (m = 1), g < 1e-4 && (g = m), x < 1e-4 && (x = m), bi.initNonuniformCatmullRom(c.x, f.x, l.x, u.x, g, m, x), wi.initNonuniformCatmullRom(c.y, f.y, l.y, u.y, g, m, x), Si.initNonuniformCatmullRom(c.z, f.z, l.z, u.z, g, m, x);
      } else this.curveType === "catmullrom" && (bi.initCatmullRom(c.x, f.x, l.x, u.x, this.tension), wi.initCatmullRom(c.y, f.y, l.y, u.y, this.tension), Si.initCatmullRom(c.z, f.z, l.z, u.z, this.tension));
      return r.set(
        bi.calc(h),
        wi.calc(h),
        Si.calc(h)
      ), r;
    }
    copy(e) {
      super.copy(e), this.points = [];
      for (let t = 0, r = e.points.length; t < r; t++) {
        const i = e.points[t];
        this.points.push(i.clone());
      }
      return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this;
    }
    toJSON() {
      const e = super.toJSON();
      e.points = [];
      for (let t = 0, r = this.points.length; t < r; t++) {
        const i = this.points[t];
        e.points.push(i.toArray());
      }
      return e.closed = this.closed, e.curveType = this.curveType, e.tension = this.tension, e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.points = [];
      for (let t = 0, r = e.points.length; t < r; t++) {
        const i = e.points[t];
        this.points.push(new A().fromArray(i));
      }
      return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this;
    }
  }
  function ua(n, e, t, r, i) {
    const s = (r - e) * 0.5, a = (i - t) * 0.5, o = n * n, h = n * o;
    return (2 * t - 2 * r + s + a) * h + (-3 * t + 3 * r - 2 * s - a) * o + s * n + t;
  }
  function vc(n, e) {
    const t = 1 - n;
    return t * t * e;
  }
  function xc(n, e) {
    return 2 * (1 - n) * n * e;
  }
  function bc(n, e) {
    return n * n * e;
  }
  function kr(n, e, t, r) {
    return vc(n, e) + xc(n, t) + bc(n, r);
  }
  function wc(n, e) {
    const t = 1 - n;
    return t * t * t * e;
  }
  function Sc(n, e) {
    const t = 1 - n;
    return 3 * t * t * n * e;
  }
  function Fc(n, e) {
    return 3 * (1 - n) * n * n * e;
  }
  function Tc(n, e) {
    return n * n * n * e;
  }
  function Mr(n, e, t, r, i) {
    return wc(n, e) + Sc(n, t) + Fc(n, r) + Tc(n, i);
  }
  class In extends tt {
    constructor(e = new V(), t = new V(), r = new V(), i = new V()) {
      super(), this.isCubicBezierCurve = !0, this.type = "CubicBezierCurve", this.v0 = e, this.v1 = t, this.v2 = r, this.v3 = i;
    }
    getPoint(e, t = new V()) {
      const r = t, i = this.v0, s = this.v1, a = this.v2, o = this.v3;
      return r.set(
        Mr(e, i.x, s.x, a.x, o.x),
        Mr(e, i.y, s.y, a.y, o.y)
      ), r;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this;
    }
  }
  class Cc extends tt {
    constructor(e = new A(), t = new A(), r = new A(), i = new A()) {
      super(), this.isCubicBezierCurve3 = !0, this.type = "CubicBezierCurve3", this.v0 = e, this.v1 = t, this.v2 = r, this.v3 = i;
    }
    getPoint(e, t = new A()) {
      const r = t, i = this.v0, s = this.v1, a = this.v2, o = this.v3;
      return r.set(
        Mr(e, i.x, s.x, a.x, o.x),
        Mr(e, i.y, s.y, a.y, o.y),
        Mr(e, i.z, s.z, a.z, o.z)
      ), r;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this;
    }
  }
  class Ar extends tt {
    constructor(e = new V(), t = new V()) {
      super(), this.isLineCurve = !0, this.type = "LineCurve", this.v1 = e, this.v2 = t;
    }
    getPoint(e, t = new V()) {
      const r = t;
      return e === 1 ? r.copy(this.v2) : (r.copy(this.v2).sub(this.v1), r.multiplyScalar(e).add(this.v1)), r;
    }
    // Line curve is linear, so we can overwrite default getPointAt
    getPointAt(e, t) {
      return this.getPoint(e, t);
    }
    getTangent(e, t = new V()) {
      return t.subVectors(this.v2, this.v1).normalize();
    }
    getTangentAt(e, t) {
      return this.getTangent(e, t);
    }
    copy(e) {
      return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  }
  class kc extends tt {
    constructor(e = new A(), t = new A()) {
      super(), this.isLineCurve3 = !0, this.type = "LineCurve3", this.v1 = e, this.v2 = t;
    }
    getPoint(e, t = new A()) {
      const r = t;
      return e === 1 ? r.copy(this.v2) : (r.copy(this.v2).sub(this.v1), r.multiplyScalar(e).add(this.v1)), r;
    }
    // Line curve is linear, so we can overwrite default getPointAt
    getPointAt(e, t) {
      return this.getPoint(e, t);
    }
    getTangent(e, t = new A()) {
      return t.subVectors(this.v2, this.v1).normalize();
    }
    getTangentAt(e, t) {
      return this.getTangent(e, t);
    }
    copy(e) {
      return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  }
  class Pn extends tt {
    constructor(e = new V(), t = new V(), r = new V()) {
      super(), this.isQuadraticBezierCurve = !0, this.type = "QuadraticBezierCurve", this.v0 = e, this.v1 = t, this.v2 = r;
    }
    getPoint(e, t = new V()) {
      const r = t, i = this.v0, s = this.v1, a = this.v2;
      return r.set(
        kr(e, i.x, s.x, a.x),
        kr(e, i.y, s.y, a.y)
      ), r;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  }
  class Mc extends tt {
    constructor(e = new A(), t = new A(), r = new A()) {
      super(), this.isQuadraticBezierCurve3 = !0, this.type = "QuadraticBezierCurve3", this.v0 = e, this.v1 = t, this.v2 = r;
    }
    getPoint(e, t = new A()) {
      const r = t, i = this.v0, s = this.v1, a = this.v2;
      return r.set(
        kr(e, i.x, s.x, a.x),
        kr(e, i.y, s.y, a.y),
        kr(e, i.z, s.z, a.z)
      ), r;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  }
  class Po extends tt {
    constructor(e = []) {
      super(), this.isSplineCurve = !0, this.type = "SplineCurve", this.points = e;
    }
    getPoint(e, t = new V()) {
      const r = t, i = this.points, s = (i.length - 1) * e, a = Math.floor(s), o = s - a, h = i[a === 0 ? a : a - 1], c = i[a], u = i[a > i.length - 2 ? i.length - 1 : a + 1], f = i[a > i.length - 3 ? i.length - 1 : a + 2];
      return r.set(
        ua(o, h.x, c.x, u.x, f.x),
        ua(o, h.y, c.y, u.y, f.y)
      ), r;
    }
    copy(e) {
      super.copy(e), this.points = [];
      for (let t = 0, r = e.points.length; t < r; t++) {
        const i = e.points[t];
        this.points.push(i.clone());
      }
      return this;
    }
    toJSON() {
      const e = super.toJSON();
      e.points = [];
      for (let t = 0, r = this.points.length; t < r; t++) {
        const i = this.points[t];
        e.points.push(i.toArray());
      }
      return e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.points = [];
      for (let t = 0, r = e.points.length; t < r; t++) {
        const i = e.points[t];
        this.points.push(new V().fromArray(i));
      }
      return this;
    }
  }
  var la = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    ArcCurve: yc,
    CatmullRomCurve3: mc,
    CubicBezierCurve: In,
    CubicBezierCurve3: Cc,
    EllipseCurve: Or,
    LineCurve: Ar,
    LineCurve3: kc,
    QuadraticBezierCurve: Pn,
    QuadraticBezierCurve3: Mc,
    SplineCurve: Po
  });
  class Ac extends tt {
    constructor() {
      super(), this.type = "CurvePath", this.curves = [], this.autoClose = !1;
    }
    add(e) {
      this.curves.push(e);
    }
    closePath() {
      const e = this.curves[0].getPoint(0), t = this.curves[this.curves.length - 1].getPoint(1);
      if (!e.equals(t)) {
        const r = e.isVector2 === !0 ? "LineCurve" : "LineCurve3";
        this.curves.push(new la[r](t, e));
      }
      return this;
    }
    // To get accurate point with reference to
    // entire path distance at time t,
    // following has to be done:
    // 1. Length of each sub path have to be known
    // 2. Locate and identify type of curve
    // 3. Get t for the curve
    // 4. Return curve.getPointAt(t')
    getPoint(e, t) {
      const r = e * this.getLength(), i = this.getCurveLengths();
      let s = 0;
      for (; s < i.length; ) {
        if (i[s] >= r) {
          const a = i[s] - r, o = this.curves[s], h = o.getLength(), c = h === 0 ? 0 : 1 - a / h;
          return o.getPointAt(c, t);
        }
        s++;
      }
      return null;
    }
    // We cannot use the default THREE.Curve getPoint() with getLength() because in
    // THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
    // getPoint() depends on getLength
    getLength() {
      const e = this.getCurveLengths();
      return e[e.length - 1];
    }
    // cacheLengths must be recalculated.
    updateArcLengths() {
      this.needsUpdate = !0, this.cacheLengths = null, this.getCurveLengths();
    }
    // Compute lengths and cache them
    // We cannot overwrite getLengths() because UtoT mapping uses it.
    getCurveLengths() {
      if (this.cacheLengths && this.cacheLengths.length === this.curves.length)
        return this.cacheLengths;
      const e = [];
      let t = 0;
      for (let r = 0, i = this.curves.length; r < i; r++)
        t += this.curves[r].getLength(), e.push(t);
      return this.cacheLengths = e, e;
    }
    getSpacedPoints(e = 40) {
      const t = [];
      for (let r = 0; r <= e; r++)
        t.push(this.getPoint(r / e));
      return this.autoClose && t.push(t[0]), t;
    }
    getPoints(e = 12) {
      const t = [];
      let r;
      for (let i = 0, s = this.curves; i < s.length; i++) {
        const a = s[i], o = a.isEllipseCurve ? e * 2 : a.isLineCurve || a.isLineCurve3 ? 1 : a.isSplineCurve ? e * a.points.length : e, h = a.getPoints(o);
        for (let c = 0; c < h.length; c++) {
          const u = h[c];
          r && r.equals(u) || (t.push(u), r = u);
        }
      }
      return this.autoClose && t.length > 1 && !t[t.length - 1].equals(t[0]) && t.push(t[0]), t;
    }
    copy(e) {
      super.copy(e), this.curves = [];
      for (let t = 0, r = e.curves.length; t < r; t++) {
        const i = e.curves[t];
        this.curves.push(i.clone());
      }
      return this.autoClose = e.autoClose, this;
    }
    toJSON() {
      const e = super.toJSON();
      e.autoClose = this.autoClose, e.curves = [];
      for (let t = 0, r = this.curves.length; t < r; t++) {
        const i = this.curves[t];
        e.curves.push(i.toJSON());
      }
      return e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.autoClose = e.autoClose, this.curves = [];
      for (let t = 0, r = e.curves.length; t < r; t++) {
        const i = e.curves[t];
        this.curves.push(new la[i.type]().fromJSON(i));
      }
      return this;
    }
  }
  let Ki = class extends Ac {
    constructor(e) {
      super(), this.type = "Path", this.currentPoint = new V(), e && this.setFromPoints(e);
    }
    setFromPoints(e) {
      this.moveTo(e[0].x, e[0].y);
      for (let t = 1, r = e.length; t < r; t++)
        this.lineTo(e[t].x, e[t].y);
      return this;
    }
    moveTo(e, t) {
      return this.currentPoint.set(e, t), this;
    }
    lineTo(e, t) {
      const r = new Ar(this.currentPoint.clone(), new V(e, t));
      return this.curves.push(r), this.currentPoint.set(e, t), this;
    }
    quadraticCurveTo(e, t, r, i) {
      const s = new Pn(
        this.currentPoint.clone(),
        new V(e, t),
        new V(r, i)
      );
      return this.curves.push(s), this.currentPoint.set(r, i), this;
    }
    bezierCurveTo(e, t, r, i, s, a) {
      const o = new In(
        this.currentPoint.clone(),
        new V(e, t),
        new V(r, i),
        new V(s, a)
      );
      return this.curves.push(o), this.currentPoint.set(s, a), this;
    }
    splineThru(e) {
      const t = [this.currentPoint.clone()].concat(e), r = new Po(t);
      return this.curves.push(r), this.currentPoint.copy(e[e.length - 1]), this;
    }
    arc(e, t, r, i, s, a) {
      const o = this.currentPoint.x, h = this.currentPoint.y;
      return this.absarc(
        e + o,
        t + h,
        r,
        i,
        s,
        a
      ), this;
    }
    absarc(e, t, r, i, s, a) {
      return this.absellipse(e, t, r, r, i, s, a), this;
    }
    ellipse(e, t, r, i, s, a, o, h) {
      const c = this.currentPoint.x, u = this.currentPoint.y;
      return this.absellipse(e + c, t + u, r, i, s, a, o, h), this;
    }
    absellipse(e, t, r, i, s, a, o, h) {
      const c = new Or(e, t, r, i, s, a, o, h);
      if (this.curves.length > 0) {
        const f = c.getPoint(0);
        f.equals(this.currentPoint) || this.lineTo(f.x, f.y);
      }
      this.curves.push(c);
      const u = c.getPoint(1);
      return this.currentPoint.copy(u), this;
    }
    copy(e) {
      return super.copy(e), this.currentPoint.copy(e.currentPoint), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.currentPoint = this.currentPoint.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.currentPoint.fromArray(e.currentPoint), this;
    }
  };
  class or extends Ki {
    constructor(e) {
      super(e), this.uuid = fr(), this.type = "Shape", this.holes = [];
    }
    getPointsHoles(e) {
      const t = [];
      for (let r = 0, i = this.holes.length; r < i; r++)
        t[r] = this.holes[r].getPoints(e);
      return t;
    }
    // get points of shape and holes (keypoints based on segments parameter)
    extractPoints(e) {
      return {
        shape: this.getPoints(e),
        holes: this.getPointsHoles(e)
      };
    }
    copy(e) {
      super.copy(e), this.holes = [];
      for (let t = 0, r = e.holes.length; t < r; t++) {
        const i = e.holes[t];
        this.holes.push(i.clone());
      }
      return this;
    }
    toJSON() {
      const e = super.toJSON();
      e.uuid = this.uuid, e.holes = [];
      for (let t = 0, r = this.holes.length; t < r; t++) {
        const i = this.holes[t];
        e.holes.push(i.toJSON());
      }
      return e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.uuid = e.uuid, this.holes = [];
      for (let t = 0, r = e.holes.length; t < r; t++) {
        const i = e.holes[t];
        this.holes.push(new Ki().fromJSON(i));
      }
      return this;
    }
  }
  const Ec = {
    triangulate: function(n, e, t = 2) {
      const r = e && e.length, i = r ? e[0] * t : n.length;
      let s = zo(n, 0, i, t, !0);
      const a = [];
      if (!s || s.next === s.prev) return a;
      let o, h, c, u, f, l, p;
      if (r && (s = Uc(n, e, s, t)), n.length > 80 * t) {
        o = c = n[0], h = u = n[1];
        for (let g = t; g < i; g += t)
          f = n[g], l = n[g + 1], f < o && (o = f), l < h && (h = l), f > c && (c = f), l > u && (u = l);
        p = Math.max(c - o, u - h), p = p !== 0 ? 32767 / p : 0;
      }
      return Lr(s, a, t, o, h, p, 0), a;
    }
  };
  function zo(n, e, t, r, i) {
    let s, a;
    if (i === Vc(n, e, t, r) > 0)
      for (s = e; s < t; s += r) a = fa(s, n[s], n[s + 1], a);
    else
      for (s = t - r; s >= e; s -= r) a = fa(s, n[s], n[s + 1], a);
    return a && Xn(a, a.next) && (Rr(a), a = a.next), a;
  }
  function Wt(n, e) {
    if (!n) return n;
    e || (e = n);
    let t = n, r;
    do
      if (r = !1, !t.steiner && (Xn(t, t.next) || oe(t.prev, t, t.next) === 0)) {
        if (Rr(t), t = e = t.prev, t === t.next) break;
        r = !0;
      } else
        t = t.next;
    while (r || t !== e);
    return e;
  }
  function Lr(n, e, t, r, i, s, a) {
    if (!n) return;
    !a && s && zc(n, r, i, s);
    let o = n, h, c;
    for (; n.prev !== n.next; ) {
      if (h = n.prev, c = n.next, s ? _c(n, r, i, s) : Bc(n)) {
        e.push(h.i / t | 0), e.push(n.i / t | 0), e.push(c.i / t | 0), Rr(n), n = c.next, o = c.next;
        continue;
      }
      if (n = c, n === o) {
        a ? a === 1 ? (n = Oc(Wt(n), e, t), Lr(n, e, t, r, i, s, 2)) : a === 2 && Lc(n, e, t, r, i, s) : Lr(Wt(n), e, t, r, i, s, 1);
        break;
      }
    }
  }
  function Bc(n) {
    const e = n.prev, t = n, r = n.next;
    if (oe(e, t, r) >= 0) return !1;
    const i = e.x, s = t.x, a = r.x, o = e.y, h = t.y, c = r.y, u = i < s ? i < a ? i : a : s < a ? s : a, f = o < h ? o < c ? o : c : h < c ? h : c, l = i > s ? i > a ? i : a : s > a ? s : a, p = o > h ? o > c ? o : c : h > c ? h : c;
    let g = r.next;
    for (; g !== e; ) {
      if (g.x >= u && g.x <= l && g.y >= f && g.y <= p && sr(i, o, s, h, a, c, g.x, g.y) && oe(g.prev, g, g.next) >= 0) return !1;
      g = g.next;
    }
    return !0;
  }
  function _c(n, e, t, r) {
    const i = n.prev, s = n, a = n.next;
    if (oe(i, s, a) >= 0) return !1;
    const o = i.x, h = s.x, c = a.x, u = i.y, f = s.y, l = a.y, p = o < h ? o < c ? o : c : h < c ? h : c, g = u < f ? u < l ? u : l : f < l ? f : l, m = o > h ? o > c ? o : c : h > c ? h : c, x = u > f ? u > l ? u : l : f > l ? f : l, v = es(p, g, e, t, r), w = es(m, x, e, t, r);
    let b = n.prevZ, F = n.nextZ;
    for (; b && b.z >= v && F && F.z <= w; ) {
      if (b.x >= p && b.x <= m && b.y >= g && b.y <= x && b !== i && b !== a && sr(o, u, h, f, c, l, b.x, b.y) && oe(b.prev, b, b.next) >= 0 || (b = b.prevZ, F.x >= p && F.x <= m && F.y >= g && F.y <= x && F !== i && F !== a && sr(o, u, h, f, c, l, F.x, F.y) && oe(F.prev, F, F.next) >= 0)) return !1;
      F = F.nextZ;
    }
    for (; b && b.z >= v; ) {
      if (b.x >= p && b.x <= m && b.y >= g && b.y <= x && b !== i && b !== a && sr(o, u, h, f, c, l, b.x, b.y) && oe(b.prev, b, b.next) >= 0) return !1;
      b = b.prevZ;
    }
    for (; F && F.z <= w; ) {
      if (F.x >= p && F.x <= m && F.y >= g && F.y <= x && F !== i && F !== a && sr(o, u, h, f, c, l, F.x, F.y) && oe(F.prev, F, F.next) >= 0) return !1;
      F = F.nextZ;
    }
    return !0;
  }
  function Oc(n, e, t) {
    let r = n;
    do {
      const i = r.prev, s = r.next.next;
      !Xn(i, s) && No(i, r, r.next, s) && Ur(i, s) && Ur(s, i) && (e.push(i.i / t | 0), e.push(r.i / t | 0), e.push(s.i / t | 0), Rr(r), Rr(r.next), r = n = s), r = r.next;
    } while (r !== n);
    return Wt(r);
  }
  function Lc(n, e, t, r, i, s) {
    let a = n;
    do {
      let o = a.next.next;
      for (; o !== a.prev; ) {
        if (a.i !== o.i && Hc(a, o)) {
          let h = Go(a, o);
          a = Wt(a, a.next), h = Wt(h, h.next), Lr(a, e, t, r, i, s, 0), Lr(h, e, t, r, i, s, 0);
          return;
        }
        o = o.next;
      }
      a = a.next;
    } while (a !== n);
  }
  function Uc(n, e, t, r) {
    const i = [];
    let s, a, o, h, c;
    for (s = 0, a = e.length; s < a; s++)
      o = e[s] * r, h = s < a - 1 ? e[s + 1] * r : n.length, c = zo(n, o, h, r, !1), c === c.next && (c.steiner = !0), i.push(Gc(c));
    for (i.sort(Rc), s = 0; s < i.length; s++)
      t = Dc(i[s], t);
    return t;
  }
  function Rc(n, e) {
    return n.x - e.x;
  }
  function Dc(n, e) {
    const t = Ic(n, e);
    if (!t)
      return e;
    const r = Go(t, n);
    return Wt(r, r.next), Wt(t, t.next);
  }
  function Ic(n, e) {
    let t = e, r = -1 / 0, i;
    const s = n.x, a = n.y;
    do {
      if (a <= t.y && a >= t.next.y && t.next.y !== t.y) {
        const l = t.x + (a - t.y) * (t.next.x - t.x) / (t.next.y - t.y);
        if (l <= s && l > r && (r = l, i = t.x < t.next.x ? t : t.next, l === s))
          return i;
      }
      t = t.next;
    } while (t !== e);
    if (!i) return null;
    const o = i, h = i.x, c = i.y;
    let u = 1 / 0, f;
    t = i;
    do
      s >= t.x && t.x >= h && s !== t.x && sr(a < c ? s : r, a, h, c, a < c ? r : s, a, t.x, t.y) && (f = Math.abs(a - t.y) / (s - t.x), Ur(t, n) && (f < u || f === u && (t.x > i.x || t.x === i.x && Pc(i, t))) && (i = t, u = f)), t = t.next;
    while (t !== o);
    return i;
  }
  function Pc(n, e) {
    return oe(n.prev, n, e.prev) < 0 && oe(e.next, n, n.next) < 0;
  }
  function zc(n, e, t, r) {
    let i = n;
    do
      i.z === 0 && (i.z = es(i.x, i.y, e, t, r)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
    while (i !== n);
    i.prevZ.nextZ = null, i.prevZ = null, Nc(i);
  }
  function Nc(n) {
    let e, t, r, i, s, a, o, h, c = 1;
    do {
      for (t = n, n = null, s = null, a = 0; t; ) {
        for (a++, r = t, o = 0, e = 0; e < c && (o++, r = r.nextZ, !!r); e++)
          ;
        for (h = c; o > 0 || h > 0 && r; )
          o !== 0 && (h === 0 || !r || t.z <= r.z) ? (i = t, t = t.nextZ, o--) : (i = r, r = r.nextZ, h--), s ? s.nextZ = i : n = i, i.prevZ = s, s = i;
        t = r;
      }
      s.nextZ = null, c *= 2;
    } while (a > 1);
    return n;
  }
  function es(n, e, t, r, i) {
    return n = (n - t) * i | 0, e = (e - r) * i | 0, n = (n | n << 8) & 16711935, n = (n | n << 4) & 252645135, n = (n | n << 2) & 858993459, n = (n | n << 1) & 1431655765, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, n | e << 1;
  }
  function Gc(n) {
    let e = n, t = n;
    do
      (e.x < t.x || e.x === t.x && e.y < t.y) && (t = e), e = e.next;
    while (e !== n);
    return t;
  }
  function sr(n, e, t, r, i, s, a, o) {
    return (i - a) * (e - o) >= (n - a) * (s - o) && (n - a) * (r - o) >= (t - a) * (e - o) && (t - a) * (s - o) >= (i - a) * (r - o);
  }
  function Hc(n, e) {
    return n.next.i !== e.i && n.prev.i !== e.i && !Wc(n, e) && // doesn't intersect other edges
    (Ur(n, e) && Ur(e, n) && qc(n, e) && // locally visible
    (oe(n.prev, n, e.prev) || oe(n, e.prev, e)) || // does not create opposite-facing sectors
    Xn(n, e) && oe(n.prev, n, n.next) > 0 && oe(e.prev, e, e.next) > 0);
  }
  function oe(n, e, t) {
    return (e.y - n.y) * (t.x - e.x) - (e.x - n.x) * (t.y - e.y);
  }
  function Xn(n, e) {
    return n.x === e.x && n.y === e.y;
  }
  function No(n, e, t, r) {
    const i = Fn(oe(n, e, t)), s = Fn(oe(n, e, r)), a = Fn(oe(t, r, n)), o = Fn(oe(t, r, e));
    return !!(i !== s && a !== o || i === 0 && Sn(n, t, e) || s === 0 && Sn(n, r, e) || a === 0 && Sn(t, n, r) || o === 0 && Sn(t, e, r));
  }
  function Sn(n, e, t) {
    return e.x <= Math.max(n.x, t.x) && e.x >= Math.min(n.x, t.x) && e.y <= Math.max(n.y, t.y) && e.y >= Math.min(n.y, t.y);
  }
  function Fn(n) {
    return n > 0 ? 1 : n < 0 ? -1 : 0;
  }
  function Wc(n, e) {
    let t = n;
    do {
      if (t.i !== n.i && t.next.i !== n.i && t.i !== e.i && t.next.i !== e.i && No(t, t.next, n, e)) return !0;
      t = t.next;
    } while (t !== n);
    return !1;
  }
  function Ur(n, e) {
    return oe(n.prev, n, n.next) < 0 ? oe(n, e, n.next) >= 0 && oe(n, n.prev, e) >= 0 : oe(n, e, n.prev) < 0 || oe(n, n.next, e) < 0;
  }
  function qc(n, e) {
    let t = n, r = !1;
    const i = (n.x + e.x) / 2, s = (n.y + e.y) / 2;
    do
      t.y > s != t.next.y > s && t.next.y !== t.y && i < (t.next.x - t.x) * (s - t.y) / (t.next.y - t.y) + t.x && (r = !r), t = t.next;
    while (t !== n);
    return r;
  }
  function Go(n, e) {
    const t = new ts(n.i, n.x, n.y), r = new ts(e.i, e.x, e.y), i = n.next, s = e.prev;
    return n.next = e, e.prev = n, t.next = i, i.prev = t, r.next = t, t.prev = r, s.next = r, r.prev = s, r;
  }
  function fa(n, e, t, r) {
    const i = new ts(n, e, t);
    return r ? (i.next = r.next, i.prev = r, r.next.prev = i, r.next = i) : (i.prev = i, i.next = i), i;
  }
  function Rr(n) {
    n.next.prev = n.prev, n.prev.next = n.next, n.prevZ && (n.prevZ.nextZ = n.nextZ), n.nextZ && (n.nextZ.prevZ = n.prevZ);
  }
  function ts(n, e, t) {
    this.i = n, this.x = e, this.y = t, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
  }
  function Vc(n, e, t, r) {
    let i = 0;
    for (let s = e, a = t - r; s < t; s += r)
      i += (n[a] - n[s]) * (n[s + 1] + n[a + 1]), a = s;
    return i;
  }
  class Tt {
    // calculate area of the contour polygon
    static area(e) {
      const t = e.length;
      let r = 0;
      for (let i = t - 1, s = 0; s < t; i = s++)
        r += e[i].x * e[s].y - e[s].x * e[i].y;
      return r * 0.5;
    }
    static isClockWise(e) {
      return Tt.area(e) < 0;
    }
    static triangulateShape(e, t) {
      const r = [], i = [], s = [];
      pa(e), da(r, e);
      let a = e.length;
      t.forEach(pa);
      for (let h = 0; h < t.length; h++)
        i.push(a), a += t[h].length, da(r, t[h]);
      const o = Ec.triangulate(r, i);
      for (let h = 0; h < o.length; h += 3)
        s.push(o.slice(h, h + 3));
      return s;
    }
  }
  function pa(n) {
    const e = n.length;
    e > 2 && n[e - 1].equals(n[0]) && n.pop();
  }
  function da(n, e) {
    for (let t = 0; t < e.length; t++)
      n.push(e[t].x), n.push(e[t].y);
  }
  class Dr extends Oe {
    constructor(e = new or([new V(0, 0.5), new V(-0.5, -0.5), new V(0.5, -0.5)]), t = 12) {
      super(), this.type = "ShapeGeometry", this.parameters = {
        shapes: e,
        curveSegments: t
      };
      const r = [], i = [], s = [], a = [];
      let o = 0, h = 0;
      if (Array.isArray(e) === !1)
        c(e);
      else
        for (let u = 0; u < e.length; u++)
          c(e[u]), this.addGroup(o, h, u), o += h, h = 0;
      this.setIndex(r), this.setAttribute("position", new Nt(i, 3)), this.setAttribute("normal", new Nt(s, 3)), this.setAttribute("uv", new Nt(a, 2));
      function c(u) {
        const f = i.length / 3, l = u.extractPoints(t);
        let p = l.shape;
        const g = l.holes;
        Tt.isClockWise(p) === !1 && (p = p.reverse());
        for (let x = 0, v = g.length; x < v; x++) {
          const w = g[x];
          Tt.isClockWise(w) === !0 && (g[x] = w.reverse());
        }
        const m = Tt.triangulateShape(p, g);
        for (let x = 0, v = g.length; x < v; x++) {
          const w = g[x];
          p = p.concat(w);
        }
        for (let x = 0, v = p.length; x < v; x++) {
          const w = p[x];
          i.push(w.x, w.y, 0), s.push(0, 0, 1), a.push(w.x, w.y);
        }
        for (let x = 0, v = m.length; x < v; x++) {
          const w = m[x], b = w[0] + f, F = w[1] + f, C = w[2] + f;
          r.push(b, F, C), h += 3;
        }
      }
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    toJSON() {
      const e = super.toJSON(), t = this.parameters.shapes;
      return Xc(t, e);
    }
    static fromJSON(e, t) {
      const r = [];
      for (let i = 0, s = e.shapes.length; i < s; i++) {
        const a = t[e.shapes[i]];
        r.push(a);
      }
      return new Dr(r, e.curveSegments);
    }
  }
  function Xc(n, e) {
    if (e.shapes = [], Array.isArray(n))
      for (let t = 0, r = n.length; t < r; t++) {
        const i = n[t];
        e.shapes.push(i.uuid);
      }
    else
      e.shapes.push(n.uuid);
    return e;
  }
  const ga = {
    enabled: !1,
    files: {},
    add: function(n, e) {
      this.enabled !== !1 && (this.files[n] = e);
    },
    get: function(n) {
      if (this.enabled !== !1)
        return this.files[n];
    },
    remove: function(n) {
      delete this.files[n];
    },
    clear: function() {
      this.files = {};
    }
  };
  class Yc {
    constructor(e, t, r) {
      const i = this;
      let s = !1, a = 0, o = 0, h;
      const c = [];
      this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = r, this.itemStart = function(u) {
        o++, s === !1 && i.onStart !== void 0 && i.onStart(u, a, o), s = !0;
      }, this.itemEnd = function(u) {
        a++, i.onProgress !== void 0 && i.onProgress(u, a, o), a === o && (s = !1, i.onLoad !== void 0 && i.onLoad());
      }, this.itemError = function(u) {
        i.onError !== void 0 && i.onError(u);
      }, this.resolveURL = function(u) {
        return h ? h(u) : u;
      }, this.setURLModifier = function(u) {
        return h = u, this;
      }, this.addHandler = function(u, f) {
        return c.push(u, f), this;
      }, this.removeHandler = function(u) {
        const f = c.indexOf(u);
        return f !== -1 && c.splice(f, 2), this;
      }, this.getHandler = function(u) {
        for (let f = 0, l = c.length; f < l; f += 2) {
          const p = c[f], g = c[f + 1];
          if (p.global && (p.lastIndex = 0), p.test(u))
            return g;
        }
        return null;
      };
    }
  }
  const Zc = /* @__PURE__ */ new Yc();
  class Ho {
    constructor(e) {
      this.manager = e !== void 0 ? e : Zc, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {};
    }
    load() {
    }
    loadAsync(e, t) {
      const r = this;
      return new Promise(function(i, s) {
        r.load(e, i, t, s);
      });
    }
    parse() {
    }
    setCrossOrigin(e) {
      return this.crossOrigin = e, this;
    }
    setWithCredentials(e) {
      return this.withCredentials = e, this;
    }
    setPath(e) {
      return this.path = e, this;
    }
    setResourcePath(e) {
      return this.resourcePath = e, this;
    }
    setRequestHeader(e) {
      return this.requestHeader = e, this;
    }
  }
  Ho.DEFAULT_MATERIAL_NAME = "__DEFAULT";
  const ot = {};
  class Jc extends Error {
    constructor(e, t) {
      super(e), this.response = t;
    }
  }
  class $c extends Ho {
    constructor(e) {
      super(e);
    }
    load(e, t, r, i) {
      e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
      const s = ga.get(e);
      if (s !== void 0)
        return this.manager.itemStart(e), setTimeout(() => {
          t && t(s), this.manager.itemEnd(e);
        }, 0), s;
      if (ot[e] !== void 0) {
        ot[e].push({
          onLoad: t,
          onProgress: r,
          onError: i
        });
        return;
      }
      ot[e] = [], ot[e].push({
        onLoad: t,
        onProgress: r,
        onError: i
      });
      const a = new Request(e, {
        headers: new Headers(this.requestHeader),
        credentials: this.withCredentials ? "include" : "same-origin"
        // An abort controller could be added within a future PR
      }), o = this.mimeType, h = this.responseType;
      fetch(a).then((c) => {
        if (c.status === 200 || c.status === 0) {
          if (c.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0)
            return c;
          const u = ot[e], f = c.body.getReader(), l = c.headers.get("X-File-Size") || c.headers.get("Content-Length"), p = l ? parseInt(l) : 0, g = p !== 0;
          let m = 0;
          const x = new ReadableStream({
            start(v) {
              w();
              function w() {
                f.read().then(({ done: b, value: F }) => {
                  if (b)
                    v.close();
                  else {
                    m += F.byteLength;
                    const C = new ProgressEvent("progress", { lengthComputable: g, loaded: m, total: p });
                    for (let _ = 0, E = u.length; _ < E; _++) {
                      const B = u[_];
                      B.onProgress && B.onProgress(C);
                    }
                    v.enqueue(F), w();
                  }
                }, (b) => {
                  v.error(b);
                });
              }
            }
          });
          return new Response(x);
        } else
          throw new Jc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c);
      }).then((c) => {
        switch (h) {
          case "arraybuffer":
            return c.arrayBuffer();
          case "blob":
            return c.blob();
          case "document":
            return c.text().then((u) => new DOMParser().parseFromString(u, o));
          case "json":
            return c.json();
          default:
            if (o === void 0)
              return c.text();
            {
              const f = /charset="?([^;"\s]*)"?/i.exec(o), l = f && f[1] ? f[1].toLowerCase() : void 0, p = new TextDecoder(l);
              return c.arrayBuffer().then((g) => p.decode(g));
            }
        }
      }).then((c) => {
        ga.add(e, c);
        const u = ot[e];
        delete ot[e];
        for (let f = 0, l = u.length; f < l; f++) {
          const p = u[f];
          p.onLoad && p.onLoad(c);
        }
      }).catch((c) => {
        const u = ot[e];
        if (u === void 0)
          throw this.manager.itemError(e), c;
        delete ot[e];
        for (let f = 0, l = u.length; f < l; f++) {
          const p = u[f];
          p.onError && p.onError(c);
        }
        this.manager.itemError(e);
      }).finally(() => {
        this.manager.itemEnd(e);
      }), this.manager.itemStart(e);
    }
    setResponseType(e) {
      return this.responseType = e, this;
    }
    setMimeType(e) {
      return this.mimeType = e, this;
    }
  }
  class Wo {
    constructor() {
      this.type = "ShapePath", this.color = new pr(), this.subPaths = [], this.currentPath = null;
    }
    moveTo(e, t) {
      return this.currentPath = new Ki(), this.subPaths.push(this.currentPath), this.currentPath.moveTo(e, t), this;
    }
    lineTo(e, t) {
      return this.currentPath.lineTo(e, t), this;
    }
    quadraticCurveTo(e, t, r, i) {
      return this.currentPath.quadraticCurveTo(e, t, r, i), this;
    }
    bezierCurveTo(e, t, r, i, s, a) {
      return this.currentPath.bezierCurveTo(e, t, r, i, s, a), this;
    }
    splineThru(e) {
      return this.currentPath.splineThru(e), this;
    }
    toShapes(e) {
      function t(v) {
        const w = [];
        for (let b = 0, F = v.length; b < F; b++) {
          const C = v[b], _ = new or();
          _.curves = C.curves, w.push(_);
        }
        return w;
      }
      function r(v, w) {
        const b = w.length;
        let F = !1;
        for (let C = b - 1, _ = 0; _ < b; C = _++) {
          let E = w[C], B = w[_], I = B.x - E.x, N = B.y - E.y;
          if (Math.abs(N) > Number.EPSILON) {
            if (N < 0 && (E = w[_], I = -I, B = w[C], N = -N), v.y < E.y || v.y > B.y) continue;
            if (v.y === E.y) {
              if (v.x === E.x) return !0;
            } else {
              const q = N * (v.x - E.x) - I * (v.y - E.y);
              if (q === 0) return !0;
              if (q < 0) continue;
              F = !F;
            }
          } else {
            if (v.y !== E.y) continue;
            if (B.x <= v.x && v.x <= E.x || E.x <= v.x && v.x <= B.x) return !0;
          }
        }
        return F;
      }
      const i = Tt.isClockWise, s = this.subPaths;
      if (s.length === 0) return [];
      let a, o, h;
      const c = [];
      if (s.length === 1)
        return o = s[0], h = new or(), h.curves = o.curves, c.push(h), c;
      let u = !i(s[0].getPoints());
      u = e ? !u : u;
      const f = [], l = [];
      let p = [], g = 0, m;
      l[g] = void 0, p[g] = [];
      for (let v = 0, w = s.length; v < w; v++)
        o = s[v], m = o.getPoints(), a = i(m), a = e ? !a : a, a ? (!u && l[g] && g++, l[g] = { s: new or(), p: m }, l[g].s.curves = o.curves, u && g++, p[g] = []) : p[g].push({ h: o, p: m[0] });
      if (!l[0]) return t(s);
      if (l.length > 1) {
        let v = !1, w = 0;
        for (let b = 0, F = l.length; b < F; b++)
          f[b] = [];
        for (let b = 0, F = l.length; b < F; b++) {
          const C = p[b];
          for (let _ = 0; _ < C.length; _++) {
            const E = C[_];
            let B = !0;
            for (let I = 0; I < l.length; I++)
              r(E.p, l[I].p) && (b !== I && w++, B ? (B = !1, f[I].push(E)) : v = !0);
            B && f[b].push(E);
          }
        }
        w > 0 && v === !1 && (p = f);
      }
      let x;
      for (let v = 0, w = l.length; v < w; v++) {
        h = l[v].s, c.push(h), x = p[v];
        for (let b = 0, F = x.length; b < F; b++)
          h.holes.push(x[b].h);
      }
      return c;
    }
  }
  typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
    revision: _o
  } }));
  typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = _o);
  class jc {
    constructor() {
      this.cache = /* @__PURE__ */ new Map();
    }
    /**
     * Returns true if the geometry of the specified character code exists in the cache.
     * Otherwise, returns false.
     * @param code One character code.
     * @param size The font size.
     * @returns True if the geometry of the specified character code exists in the cache.
     * Otherwise, returns false.
     */
    hasGeometry(e, t) {
      const r = this.generateKey(e, t);
      return this.cache.has(r);
    }
    /**
     * Get the geometry for a single character from cache if available.
     * The cache key includes both character codeand size.
     * @param code The character code to get geometry from cache.
     * @param size The font size.
     * @returns The geometry for a single character from cache if avaiable.
     * Return undefined if the character not found in cache.
     */
    getGeometry(e, t) {
      const r = this.generateKey(e, t);
      if (this.cache.has(r))
        return this.cache.get(r);
    }
    /**
     * Set the geometry to cache for a single character.
     * @param char The character to set geometry for.
     * @param size The font size.
     * @param geometry The geometry to set.
     */
    setGeometry(e, t, r) {
      const i = this.generateKey(e, t);
      this.cache.set(i, r);
    }
    /**
     * Dispose all cached geometries.
     */
    dispose() {
      for (const e of this.cache.values())
        e.dispose();
      this.cache.clear();
    }
    /**
     * Generates cache key by character and font size.
     * @param char One character code.
     * @param size The font size.
     */
    generateKey(e, t) {
      return `${e}_${t}`;
    }
  }
  class qo {
    constructor(e) {
      this.names = /* @__PURE__ */ new Set(), this.unsupportedChars = {}, this.encoding = e.encoding, e.alias.forEach((t) => this.names.add(t)), this.cache = new jc();
    }
    /**
     * Records an unsupported character in the font.
     * Increments the count for the given character in unsupportedChars.
     * @param char - The unsupported character to record
     */
    addUnsupportedChar(e) {
      this.unsupportedChars[e] || (this.unsupportedChars[e] = 0), this.unsupportedChars[e]++;
    }
  }
  class Vo extends or {
    constructor() {
      super(...arguments), this.width = 0;
    }
  }
  const rs = (n, e) => e.some((t) => n instanceof t);
  let ya, ma;
  function Qc() {
    return ya || (ya = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function Kc() {
    return ma || (ma = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  const ns = /* @__PURE__ */ new WeakMap(), Fi = /* @__PURE__ */ new WeakMap(), Yn = /* @__PURE__ */ new WeakMap();
  function eu(n) {
    const e = new Promise((t, r) => {
      const i = () => {
        n.removeEventListener("success", s), n.removeEventListener("error", a);
      }, s = () => {
        t(Gt(n.result)), i();
      }, a = () => {
        r(n.error), i();
      };
      n.addEventListener("success", s), n.addEventListener("error", a);
    });
    return Yn.set(e, n), e;
  }
  function tu(n) {
    if (ns.has(n))
      return;
    const e = new Promise((t, r) => {
      const i = () => {
        n.removeEventListener("complete", s), n.removeEventListener("error", a), n.removeEventListener("abort", a);
      }, s = () => {
        t(), i();
      }, a = () => {
        r(n.error || new DOMException("AbortError", "AbortError")), i();
      };
      n.addEventListener("complete", s), n.addEventListener("error", a), n.addEventListener("abort", a);
    });
    ns.set(n, e);
  }
  let is = {
    get(n, e, t) {
      if (n instanceof IDBTransaction) {
        if (e === "done")
          return ns.get(n);
        if (e === "store")
          return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0]);
      }
      return Gt(n[e]);
    },
    set(n, e, t) {
      return n[e] = t, !0;
    },
    has(n, e) {
      return n instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in n;
    }
  };
  function Xo(n) {
    is = n(is);
  }
  function ru(n) {
    return Kc().includes(n) ? function(...e) {
      return n.apply(ss(this), e), Gt(this.request);
    } : function(...e) {
      return Gt(n.apply(ss(this), e));
    };
  }
  function nu(n) {
    return typeof n == "function" ? ru(n) : (n instanceof IDBTransaction && tu(n), rs(n, Qc()) ? new Proxy(n, is) : n);
  }
  function Gt(n) {
    if (n instanceof IDBRequest)
      return eu(n);
    if (Fi.has(n))
      return Fi.get(n);
    const e = nu(n);
    return e !== n && (Fi.set(n, e), Yn.set(e, n)), e;
  }
  const ss = (n) => Yn.get(n);
  function iu(n, e, { blocked: t, upgrade: r, blocking: i, terminated: s } = {}) {
    const a = indexedDB.open(n, e), o = Gt(a);
    return r && a.addEventListener("upgradeneeded", (h) => {
      r(Gt(a.result), h.oldVersion, h.newVersion, Gt(a.transaction), h);
    }), t && a.addEventListener("blocked", (h) => t(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      h.oldVersion,
      h.newVersion,
      h
    )), o.then((h) => {
      s && h.addEventListener("close", () => s()), i && h.addEventListener("versionchange", (c) => i(c.oldVersion, c.newVersion, c));
    }).catch(() => {
    }), o;
  }
  const su = ["get", "getKey", "getAll", "getAllKeys", "count"], au = ["put", "add", "delete", "clear"], Ti = /* @__PURE__ */ new Map();
  function va(n, e) {
    if (!(n instanceof IDBDatabase && !(e in n) && typeof e == "string"))
      return;
    if (Ti.get(e))
      return Ti.get(e);
    const t = e.replace(/FromIndex$/, ""), r = e !== t, i = au.includes(t);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(t in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || su.includes(t))
    )
      return;
    const s = async function(a, ...o) {
      const h = this.transaction(a, i ? "readwrite" : "readonly");
      let c = h.store;
      return r && (c = c.index(o.shift())), (await Promise.all([
        c[t](...o),
        i && h.done
      ]))[0];
    };
    return Ti.set(e, s), s;
  }
  Xo((n) => ({
    ...n,
    get: (e, t, r) => va(e, t) || n.get(e, t, r),
    has: (e, t) => !!va(e, t) || n.has(e, t)
  }));
  const ou = ["continue", "continuePrimaryKey", "advance"], xa = {}, as = /* @__PURE__ */ new WeakMap(), Yo = /* @__PURE__ */ new WeakMap(), hu = {
    get(n, e) {
      if (!ou.includes(e))
        return n[e];
      let t = xa[e];
      return t || (t = xa[e] = function(...r) {
        as.set(this, Yo.get(this)[e](...r));
      }), t;
    }
  };
  async function* cu(...n) {
    let e = this;
    if (e instanceof IDBCursor || (e = await e.openCursor(...n)), !e)
      return;
    e = e;
    const t = new Proxy(e, hu);
    for (Yo.set(t, e), Yn.set(t, ss(e)); e; )
      yield t, e = await (as.get(t) || e.continue()), as.delete(t);
  }
  function ba(n, e) {
    return e === Symbol.asyncIterator && rs(n, [IDBIndex, IDBObjectStore, IDBCursor]) || e === "iterate" && rs(n, [IDBIndex, IDBObjectStore]);
  }
  Xo((n) => ({
    ...n,
    get(e, t, r) {
      return ba(e, t) ? cu : n.get(e, t, r);
    },
    has(e, t) {
      return ba(e, t) || n.has(e, t);
    }
  }));
  const Dt = {
    fonts: "fonts"
  }, Ci = [
    {
      version: 1,
      stores: [
        {
          name: Dt.fonts,
          keyPath: "name"
        }
      ]
    },
    {
      version: 2,
      stores: [
        {
          name: Dt.fonts,
          keyPath: "name"
        }
      ]
    }
  ], Ce = class Ce {
    constructor() {
      this.isClosing = !1, typeof window < "u" && window.addEventListener("unload", () => {
        this.close();
      });
    }
    /**
     * Returns the singleton instance of the FontCacheManager
     */
    static get instance() {
      return Ce._instance || (Ce._instance = new Ce()), Ce._instance;
    }
    /**
     * Sets a font in the cache
     * @param fileName The font file name (key)
     * @param fontData The font data to store
     */
    async set(e, t) {
      await (await this.getDatabase()).put(Dt.fonts, { ...t, name: e });
    }
    /**
     * Gets a font from the cache
     * @param fileName The font file name (key)
     * @returns The font data if found, undefined otherwise
     */
    async get(e) {
      return await (await this.getDatabase()).get(Dt.fonts, e);
    }
    /**
     * Deletes a font from the cache
     * @param fileName The font file name (key)
     */
    async delete(e) {
      await (await this.getDatabase()).delete(Dt.fonts, e);
    }
    /**
     * Gets all fonts from the cache
     * @returns An array of all font data in the cache
     */
    async getAll() {
      return await (await this.getDatabase()).getAll(Dt.fonts);
    }
    /**
     * Clears all fonts from the cache
     */
    async clear() {
      await (await this.getDatabase()).clear(Dt.fonts);
    }
    /**
     * Checks if a font exists in the cache
     * @param fileName The font file name (key)
     */
    async has(e) {
      return await this.get(e) !== void 0;
    }
    /**
     * Closes the database connection and cleans up resources.
     * After calling this, any further operations will require reopening the database.
     */
    close() {
      if (!this.isClosing) {
        this.isClosing = !0;
        try {
          this.db && (this.db.close(), this.db = void 0);
        } finally {
          this.isClosing = !1;
        }
      }
    }
    /**
     * Destroys the database instance and deletes all data.
     * Use with caution as this operation cannot be undone.
     */
    async destroy() {
      this.close(), await indexedDB.deleteDatabase(Ce.DATABASE_NAME), Ce._instance = void 0;
    }
    // Private methods for database management
    async getDatabase() {
      if (this.isClosing)
        throw new Error("Cannot perform operation while database is closing");
      return this.db ? this.db : (this.db = await iu(
        Ce.DATABASE_NAME,
        Ce.DATABASE_VERSION,
        {
          upgrade: (e, t, r) => this.handleUpgrade(e, t, r),
          blocked() {
            console.warn(
              "Database upgrade blocked - please close other tabs using the application"
            );
          },
          blocking() {
            console.warn("Database blocking newer version - closing connection"), Ce.instance.close();
          }
        }
      ), this.db);
    }
    /**
     * Applies all schema versions that are greater than the old version and less than or equal to the new version
     * @param db The database instance
     * @param oldVersion The old version of the database
     * @param newVersion The new version of the database
     */
    handleUpgrade(e, t, r) {
      const i = Ci.filter(
        (s) => s.version > t && (!r || s.version <= r)
      );
      for (const s of i)
        this.applySchemaVersion(e, s);
    }
    /**
     * Applies a single schema version's changes to the database
     * @param db The database instance
     * @param schema The schema version to apply
     */
    applySchemaVersion(e, t) {
      for (const r of t.stores)
        e.objectStoreNames.contains(r.name) || e.createObjectStore(r.name, { keyPath: r.keyPath });
    }
  };
  Ce.DATABASE_NAME = "mlightcad", Ce.DATABASE_VERSION = Ci[Ci.length - 1].version;
  let Er = Ce;
  class wa {
    constructor() {
      this.listeners = [];
    }
    /**
     * Add the event listener
     * @param listener Input listener to be added
     */
    addEventListener(e) {
      this.listeners.push(e);
    }
    /**
     * Remove the listener
     * @param listener Input listener to be removed
     */
    removeEventListener(e) {
      this.listeners = this.listeners.filter((t) => t !== e);
    }
    /**
     * Remove all listeners bound to the target and add one new listener
     * @param listener Input listener to be added
     */
    replaceEventListener(e) {
      this.removeEventListener(e), this.addEventListener(e);
    }
    /**
     * Notify all listeners
     * @param payload Input payload passed to listener
     */
    dispatch(e, ...t) {
      for (const r of this.listeners)
        r.call(null, e, ...t);
    }
  }
  const Zo = (n) => n.split("/").pop(), Sa = (n) => {
    const e = Zo(n);
    if (e) {
      const t = e.lastIndexOf(".");
      return t === -1 ? e : e.substring(0, t);
    }
    return n;
  }, uu = [
    0,
    16711680,
    16776960,
    65280,
    65535,
    255,
    16711935,
    16777215,
    8421504,
    12632256,
    16711680,
    16744319,
    13369344,
    13395558,
    10027008,
    10046540,
    8323072,
    8339263,
    4980736,
    4990502,
    16727808,
    16752511,
    13382400,
    13401958,
    10036736,
    10051404,
    8331008,
    8343359,
    4985600,
    4992806,
    16744192,
    16760703,
    13395456,
    13408614,
    10046464,
    10056268,
    8339200,
    8347455,
    4990464,
    4995366,
    16760576,
    16768895,
    13408512,
    13415014,
    10056192,
    10061132,
    8347392,
    8351551,
    4995328,
    4997670,
    16776960,
    16777087,
    13421568,
    13421670,
    10000384,
    10000460,
    8355584,
    8355647,
    5000192,
    5000230,
    12582656,
    14679935,
    10079232,
    11717734,
    7510016,
    8755276,
    6258432,
    7307071,
    3755008,
    4344870,
    8388352,
    12582783,
    6736896,
    10079334,
    5019648,
    7510092,
    4161280,
    6258495,
    2509824,
    3755046,
    4194048,
    10485631,
    3394560,
    8375398,
    2529280,
    6264908,
    2064128,
    5209919,
    1264640,
    3099686,
    65280,
    8388479,
    52224,
    6736998,
    38912,
    5019724,
    32512,
    4161343,
    19456,
    2509862,
    65343,
    8388511,
    52275,
    6737023,
    38950,
    5019743,
    32543,
    4161359,
    19475,
    2509871,
    65407,
    8388543,
    52326,
    6737049,
    38988,
    5019762,
    32575,
    4161375,
    19494,
    2509881,
    65471,
    8388575,
    52377,
    6737074,
    39026,
    5019781,
    32607,
    4161391,
    19513,
    2509890,
    65535,
    8388607,
    52428,
    6737100,
    39064,
    5019800,
    32639,
    4161407,
    19532,
    2509900,
    49151,
    8380415,
    39372,
    6730444,
    29336,
    5014936,
    24447,
    4157311,
    14668,
    2507340,
    32767,
    8372223,
    26316,
    6724044,
    19608,
    5010072,
    16255,
    4153215,
    9804,
    2505036,
    16383,
    8364031,
    13260,
    6717388,
    9880,
    5005208,
    8063,
    4149119,
    4940,
    2502476,
    255,
    8355839,
    204,
    6710988,
    152,
    5000344,
    127,
    4145023,
    76,
    2500172,
    4129023,
    10452991,
    3342540,
    8349388,
    2490520,
    6245528,
    2031743,
    5193599,
    1245260,
    3089996,
    8323327,
    12550143,
    6684876,
    10053324,
    4980888,
    7490712,
    4128895,
    6242175,
    2490444,
    3745356,
    12517631,
    14647295,
    10027212,
    11691724,
    7471256,
    8735896,
    6226047,
    7290751,
    3735628,
    4335180,
    16711935,
    16744447,
    13369548,
    13395660,
    9961624,
    9981080,
    8323199,
    8339327,
    4980812,
    4990540,
    16711871,
    16744415,
    13369497,
    13395634,
    9961586,
    9981061,
    8323167,
    8339311,
    4980793,
    4990530,
    16711807,
    16744383,
    13369446,
    13395609,
    9961548,
    9981042,
    8323135,
    8339295,
    4980774,
    4990521,
    16711743,
    16744351,
    13369395,
    13395583,
    9961510,
    9981023,
    8323103,
    8339279,
    4980755,
    4990511,
    3355443,
    5987163,
    8684676,
    11382189,
    14079702,
    16777215,
    0
  ], lu = (n) => uu[n];
  /*! https://mths.be/codepointat v0.2.0 by @mathias */
  String.prototype.codePointAt || function() {
    var n = function() {
      try {
        var t = {}, r = Object.defineProperty, i = r(t, t, t) && r;
      } catch {
      }
      return i;
    }(), e = function(t) {
      if (this == null)
        throw TypeError();
      var r = String(this), i = r.length, s = t ? Number(t) : 0;
      if (s != s && (s = 0), !(s < 0 || s >= i)) {
        var a = r.charCodeAt(s), o;
        return (
          // check if it’s the start of a surrogate pair
          a >= 55296 && a <= 56319 && // high surrogate
          i > s + 1 && (o = r.charCodeAt(s + 1), o >= 56320 && o <= 57343) ? (a - 55296) * 1024 + o - 56320 + 65536 : a
        );
      }
    };
    n ? n(String.prototype, "codePointAt", {
      value: e,
      configurable: !0,
      writable: !0
    }) : String.prototype.codePointAt = e;
  }();
  var xs = 0, Jo = -3;
  function Ir() {
    this.table = new Uint16Array(16), this.trans = new Uint16Array(288);
  }
  function fu(n, e) {
    this.source = n, this.sourceIndex = 0, this.tag = 0, this.bitcount = 0, this.dest = e, this.destLen = 0, this.ltree = new Ir(), this.dtree = new Ir();
  }
  var $o = new Ir(), jo = new Ir(), bs = new Uint8Array(30), ws = new Uint16Array(30), Qo = new Uint8Array(30), Ko = new Uint16Array(30), pu = new Uint8Array([
    16,
    17,
    18,
    0,
    8,
    7,
    9,
    6,
    10,
    5,
    11,
    4,
    12,
    3,
    13,
    2,
    14,
    1,
    15
  ]), Fa = new Ir(), $e = new Uint8Array(320);
  function eh(n, e, t, r) {
    var i, s;
    for (i = 0; i < t; ++i)
      n[i] = 0;
    for (i = 0; i < 30 - t; ++i)
      n[i + t] = i / t | 0;
    for (s = r, i = 0; i < 30; ++i)
      e[i] = s, s += 1 << n[i];
  }
  function du(n, e) {
    var t;
    for (t = 0; t < 7; ++t)
      n.table[t] = 0;
    for (n.table[7] = 24, n.table[8] = 152, n.table[9] = 112, t = 0; t < 24; ++t)
      n.trans[t] = 256 + t;
    for (t = 0; t < 144; ++t)
      n.trans[24 + t] = t;
    for (t = 0; t < 8; ++t)
      n.trans[168 + t] = 280 + t;
    for (t = 0; t < 112; ++t)
      n.trans[176 + t] = 144 + t;
    for (t = 0; t < 5; ++t)
      e.table[t] = 0;
    for (e.table[5] = 32, t = 0; t < 32; ++t)
      e.trans[t] = t;
  }
  var Ta = new Uint16Array(16);
  function ki(n, e, t, r) {
    var i, s;
    for (i = 0; i < 16; ++i)
      n.table[i] = 0;
    for (i = 0; i < r; ++i)
      n.table[e[t + i]]++;
    for (n.table[0] = 0, s = 0, i = 0; i < 16; ++i)
      Ta[i] = s, s += n.table[i];
    for (i = 0; i < r; ++i)
      e[t + i] && (n.trans[Ta[e[t + i]]++] = i);
  }
  function gu(n) {
    n.bitcount-- || (n.tag = n.source[n.sourceIndex++], n.bitcount = 7);
    var e = n.tag & 1;
    return n.tag >>>= 1, e;
  }
  function je(n, e, t) {
    if (!e)
      return t;
    for (; n.bitcount < 24; )
      n.tag |= n.source[n.sourceIndex++] << n.bitcount, n.bitcount += 8;
    var r = n.tag & 65535 >>> 16 - e;
    return n.tag >>>= e, n.bitcount -= e, r + t;
  }
  function os(n, e) {
    for (; n.bitcount < 24; )
      n.tag |= n.source[n.sourceIndex++] << n.bitcount, n.bitcount += 8;
    var t = 0, r = 0, i = 0, s = n.tag;
    do
      r = 2 * r + (s & 1), s >>>= 1, ++i, t += e.table[i], r -= e.table[i];
    while (r >= 0);
    return n.tag = s, n.bitcount -= i, e.trans[t + r];
  }
  function yu(n, e, t) {
    var r, i, s, a, o, h;
    for (r = je(n, 5, 257), i = je(n, 5, 1), s = je(n, 4, 4), a = 0; a < 19; ++a)
      $e[a] = 0;
    for (a = 0; a < s; ++a) {
      var c = je(n, 3, 0);
      $e[pu[a]] = c;
    }
    for (ki(Fa, $e, 0, 19), o = 0; o < r + i; ) {
      var u = os(n, Fa);
      switch (u) {
        case 16:
          var f = $e[o - 1];
          for (h = je(n, 2, 3); h; --h)
            $e[o++] = f;
          break;
        case 17:
          for (h = je(n, 3, 3); h; --h)
            $e[o++] = 0;
          break;
        case 18:
          for (h = je(n, 7, 11); h; --h)
            $e[o++] = 0;
          break;
        default:
          $e[o++] = u;
          break;
      }
    }
    ki(e, $e, 0, r), ki(t, $e, r, i);
  }
  function Ca(n, e, t) {
    for (; ; ) {
      var r = os(n, e);
      if (r === 256)
        return xs;
      if (r < 256)
        n.dest[n.destLen++] = r;
      else {
        var i, s, a, o;
        for (r -= 257, i = je(n, bs[r], ws[r]), s = os(n, t), a = n.destLen - je(n, Qo[s], Ko[s]), o = a; o < a + i; ++o)
          n.dest[n.destLen++] = n.dest[o];
      }
    }
  }
  function mu(n) {
    for (var e, t, r; n.bitcount > 8; )
      n.sourceIndex--, n.bitcount -= 8;
    if (e = n.source[n.sourceIndex + 1], e = 256 * e + n.source[n.sourceIndex], t = n.source[n.sourceIndex + 3], t = 256 * t + n.source[n.sourceIndex + 2], e !== (~t & 65535))
      return Jo;
    for (n.sourceIndex += 4, r = e; r; --r)
      n.dest[n.destLen++] = n.source[n.sourceIndex++];
    return n.bitcount = 0, xs;
  }
  function vu(n, e) {
    var t = new fu(n, e), r, i, s;
    do {
      switch (r = gu(t), i = je(t, 2, 0), i) {
        case 0:
          s = mu(t);
          break;
        case 1:
          s = Ca(t, $o, jo);
          break;
        case 2:
          yu(t, t.ltree, t.dtree), s = Ca(t, t.ltree, t.dtree);
          break;
        default:
          s = Jo;
      }
      if (s !== xs)
        throw new Error("Data error");
    } while (!r);
    return t.destLen < t.dest.length ? typeof t.dest.slice == "function" ? t.dest.slice(0, t.destLen) : t.dest.subarray(0, t.destLen) : t.dest;
  }
  du($o, jo);
  eh(bs, ws, 4, 3);
  eh(Qo, Ko, 2, 1);
  bs[28] = 0;
  ws[28] = 258;
  var xu = vu;
  function rr(n, e, t, r, i) {
    return Math.pow(1 - i, 3) * n + 3 * Math.pow(1 - i, 2) * i * e + 3 * (1 - i) * Math.pow(i, 2) * t + Math.pow(i, 3) * r;
  }
  function Et() {
    this.x1 = Number.NaN, this.y1 = Number.NaN, this.x2 = Number.NaN, this.y2 = Number.NaN;
  }
  Et.prototype.isEmpty = function() {
    return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
  };
  Et.prototype.addPoint = function(n, e) {
    typeof n == "number" && ((isNaN(this.x1) || isNaN(this.x2)) && (this.x1 = n, this.x2 = n), n < this.x1 && (this.x1 = n), n > this.x2 && (this.x2 = n)), typeof e == "number" && ((isNaN(this.y1) || isNaN(this.y2)) && (this.y1 = e, this.y2 = e), e < this.y1 && (this.y1 = e), e > this.y2 && (this.y2 = e));
  };
  Et.prototype.addX = function(n) {
    this.addPoint(n, null);
  };
  Et.prototype.addY = function(n) {
    this.addPoint(null, n);
  };
  Et.prototype.addBezier = function(n, e, t, r, i, s, a, o) {
    var h = [n, e], c = [t, r], u = [i, s], f = [a, o];
    this.addPoint(n, e), this.addPoint(a, o);
    for (var l = 0; l <= 1; l++) {
      var p = 6 * h[l] - 12 * c[l] + 6 * u[l], g = -3 * h[l] + 9 * c[l] - 9 * u[l] + 3 * f[l], m = 3 * c[l] - 3 * h[l];
      if (g === 0) {
        if (p === 0)
          continue;
        var x = -m / p;
        0 < x && x < 1 && (l === 0 && this.addX(rr(h[l], c[l], u[l], f[l], x)), l === 1 && this.addY(rr(h[l], c[l], u[l], f[l], x)));
        continue;
      }
      var v = Math.pow(p, 2) - 4 * m * g;
      if (!(v < 0)) {
        var w = (-p + Math.sqrt(v)) / (2 * g);
        0 < w && w < 1 && (l === 0 && this.addX(rr(h[l], c[l], u[l], f[l], w)), l === 1 && this.addY(rr(h[l], c[l], u[l], f[l], w)));
        var b = (-p - Math.sqrt(v)) / (2 * g);
        0 < b && b < 1 && (l === 0 && this.addX(rr(h[l], c[l], u[l], f[l], b)), l === 1 && this.addY(rr(h[l], c[l], u[l], f[l], b)));
      }
    }
  };
  Et.prototype.addQuad = function(n, e, t, r, i, s) {
    var a = n + 0.6666666666666666 * (t - n), o = e + 2 / 3 * (r - e), h = a + 1 / 3 * (i - n), c = o + 1 / 3 * (s - e);
    this.addBezier(n, e, a, o, h, c, i, s);
  };
  function pe() {
    this.commands = [], this.fill = "black", this.stroke = null, this.strokeWidth = 1;
  }
  pe.prototype.moveTo = function(n, e) {
    this.commands.push({
      type: "M",
      x: n,
      y: e
    });
  };
  pe.prototype.lineTo = function(n, e) {
    this.commands.push({
      type: "L",
      x: n,
      y: e
    });
  };
  pe.prototype.curveTo = pe.prototype.bezierCurveTo = function(n, e, t, r, i, s) {
    this.commands.push({
      type: "C",
      x1: n,
      y1: e,
      x2: t,
      y2: r,
      x: i,
      y: s
    });
  };
  pe.prototype.quadTo = pe.prototype.quadraticCurveTo = function(n, e, t, r) {
    this.commands.push({
      type: "Q",
      x1: n,
      y1: e,
      x: t,
      y: r
    });
  };
  pe.prototype.close = pe.prototype.closePath = function() {
    this.commands.push({
      type: "Z"
    });
  };
  pe.prototype.extend = function(n) {
    if (n.commands)
      n = n.commands;
    else if (n instanceof Et) {
      var e = n;
      this.moveTo(e.x1, e.y1), this.lineTo(e.x2, e.y1), this.lineTo(e.x2, e.y2), this.lineTo(e.x1, e.y2), this.close();
      return;
    }
    Array.prototype.push.apply(this.commands, n);
  };
  pe.prototype.getBoundingBox = function() {
    for (var n = new Et(), e = 0, t = 0, r = 0, i = 0, s = 0; s < this.commands.length; s++) {
      var a = this.commands[s];
      switch (a.type) {
        case "M":
          n.addPoint(a.x, a.y), e = r = a.x, t = i = a.y;
          break;
        case "L":
          n.addPoint(a.x, a.y), r = a.x, i = a.y;
          break;
        case "Q":
          n.addQuad(r, i, a.x1, a.y1, a.x, a.y), r = a.x, i = a.y;
          break;
        case "C":
          n.addBezier(r, i, a.x1, a.y1, a.x2, a.y2, a.x, a.y), r = a.x, i = a.y;
          break;
        case "Z":
          r = e, i = t;
          break;
        default:
          throw new Error("Unexpected path command " + a.type);
      }
    }
    return n.isEmpty() && n.addPoint(0, 0), n;
  };
  pe.prototype.draw = function(n) {
    n.beginPath();
    for (var e = 0; e < this.commands.length; e += 1) {
      var t = this.commands[e];
      t.type === "M" ? n.moveTo(t.x, t.y) : t.type === "L" ? n.lineTo(t.x, t.y) : t.type === "C" ? n.bezierCurveTo(t.x1, t.y1, t.x2, t.y2, t.x, t.y) : t.type === "Q" ? n.quadraticCurveTo(t.x1, t.y1, t.x, t.y) : t.type === "Z" && n.closePath();
    }
    this.fill && (n.fillStyle = this.fill, n.fill()), this.stroke && (n.strokeStyle = this.stroke, n.lineWidth = this.strokeWidth, n.stroke());
  };
  pe.prototype.toPathData = function(n) {
    n = n !== void 0 ? n : 2;
    function e(a) {
      return Math.round(a) === a ? "" + Math.round(a) : a.toFixed(n);
    }
    function t() {
      for (var a = arguments, o = "", h = 0; h < arguments.length; h += 1) {
        var c = a[h];
        c >= 0 && h > 0 && (o += " "), o += e(c);
      }
      return o;
    }
    for (var r = "", i = 0; i < this.commands.length; i += 1) {
      var s = this.commands[i];
      s.type === "M" ? r += "M" + t(s.x, s.y) : s.type === "L" ? r += "L" + t(s.x, s.y) : s.type === "C" ? r += "C" + t(s.x1, s.y1, s.x2, s.y2, s.x, s.y) : s.type === "Q" ? r += "Q" + t(s.x1, s.y1, s.x, s.y) : s.type === "Z" && (r += "Z");
    }
    return r;
  };
  pe.prototype.toSVG = function(n) {
    var e = '<path d="';
    return e += this.toPathData(n), e += '"', this.fill && this.fill !== "black" && (this.fill === null ? e += ' fill="none"' : e += ' fill="' + this.fill + '"'), this.stroke && (e += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"'), e += "/>", e;
  };
  pe.prototype.toDOMElement = function(n) {
    var e = this.toPathData(n), t = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return t.setAttribute("d", e), t;
  };
  function th(n) {
    throw new Error(n);
  }
  function ka(n, e) {
    n || th(e);
  }
  var G = { fail: th, argument: ka, assert: ka }, Ma = 32768, Aa = 2147483648, lr = {}, R = {}, W = {};
  function Ye(n) {
    return function() {
      return n;
    };
  }
  R.BYTE = function(n) {
    return G.argument(n >= 0 && n <= 255, "Byte value should be between 0 and 255."), [n];
  };
  W.BYTE = Ye(1);
  R.CHAR = function(n) {
    return [n.charCodeAt(0)];
  };
  W.CHAR = Ye(1);
  R.CHARARRAY = function(n) {
    typeof n > "u" && (n = "", console.warn("Undefined CHARARRAY encountered and treated as an empty string. This is probably caused by a missing glyph name."));
    for (var e = [], t = 0; t < n.length; t += 1)
      e[t] = n.charCodeAt(t);
    return e;
  };
  W.CHARARRAY = function(n) {
    return typeof n > "u" ? 0 : n.length;
  };
  R.USHORT = function(n) {
    return [n >> 8 & 255, n & 255];
  };
  W.USHORT = Ye(2);
  R.SHORT = function(n) {
    return n >= Ma && (n = -(2 * Ma - n)), [n >> 8 & 255, n & 255];
  };
  W.SHORT = Ye(2);
  R.UINT24 = function(n) {
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  W.UINT24 = Ye(3);
  R.ULONG = function(n) {
    return [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  W.ULONG = Ye(4);
  R.LONG = function(n) {
    return n >= Aa && (n = -(2 * Aa - n)), [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  W.LONG = Ye(4);
  R.FIXED = R.ULONG;
  W.FIXED = W.ULONG;
  R.FWORD = R.SHORT;
  W.FWORD = W.SHORT;
  R.UFWORD = R.USHORT;
  W.UFWORD = W.USHORT;
  R.LONGDATETIME = function(n) {
    return [0, 0, 0, 0, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  W.LONGDATETIME = Ye(8);
  R.TAG = function(n) {
    return G.argument(n.length === 4, "Tag should be exactly 4 ASCII characters."), [
      n.charCodeAt(0),
      n.charCodeAt(1),
      n.charCodeAt(2),
      n.charCodeAt(3)
    ];
  };
  W.TAG = Ye(4);
  R.Card8 = R.BYTE;
  W.Card8 = W.BYTE;
  R.Card16 = R.USHORT;
  W.Card16 = W.USHORT;
  R.OffSize = R.BYTE;
  W.OffSize = W.BYTE;
  R.SID = R.USHORT;
  W.SID = W.USHORT;
  R.NUMBER = function(n) {
    return n >= -107 && n <= 107 ? [n + 139] : n >= 108 && n <= 1131 ? (n = n - 108, [(n >> 8) + 247, n & 255]) : n >= -1131 && n <= -108 ? (n = -n - 108, [(n >> 8) + 251, n & 255]) : n >= -32768 && n <= 32767 ? R.NUMBER16(n) : R.NUMBER32(n);
  };
  W.NUMBER = function(n) {
    return R.NUMBER(n).length;
  };
  R.NUMBER16 = function(n) {
    return [28, n >> 8 & 255, n & 255];
  };
  W.NUMBER16 = Ye(3);
  R.NUMBER32 = function(n) {
    return [29, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  W.NUMBER32 = Ye(5);
  R.REAL = function(n) {
    var e = n.toString(), t = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(e);
    if (t) {
      var r = parseFloat("1e" + ((t[2] ? +t[2] : 0) + t[1].length));
      e = (Math.round(n * r) / r).toString();
    }
    for (var i = "", s = 0, a = e.length; s < a; s += 1) {
      var o = e[s];
      o === "e" ? i += e[++s] === "-" ? "c" : "b" : o === "." ? i += "a" : o === "-" ? i += "e" : i += o;
    }
    i += i.length & 1 ? "f" : "ff";
    for (var h = [30], c = 0, u = i.length; c < u; c += 2)
      h.push(parseInt(i.substr(c, 2), 16));
    return h;
  };
  W.REAL = function(n) {
    return R.REAL(n).length;
  };
  R.NAME = R.CHARARRAY;
  W.NAME = W.CHARARRAY;
  R.STRING = R.CHARARRAY;
  W.STRING = W.CHARARRAY;
  lr.UTF8 = function(n, e, t) {
    for (var r = [], i = t, s = 0; s < i; s++, e += 1)
      r[s] = n.getUint8(e);
    return String.fromCharCode.apply(null, r);
  };
  lr.UTF16 = function(n, e, t) {
    for (var r = [], i = t / 2, s = 0; s < i; s++, e += 2)
      r[s] = n.getUint16(e);
    return String.fromCharCode.apply(null, r);
  };
  R.UTF16 = function(n) {
    for (var e = [], t = 0; t < n.length; t += 1) {
      var r = n.charCodeAt(t);
      e[e.length] = r >> 8 & 255, e[e.length] = r & 255;
    }
    return e;
  };
  W.UTF16 = function(n) {
    return n.length * 2;
  };
  var hs = {
    "x-mac-croatian": (
      // Python: 'mac_croatian'
      "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
    ),
    "x-mac-cyrillic": (
      // Python: 'mac_cyrillic'
      "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю"
    ),
    "x-mac-gaelic": (
      // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
      "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ"
    ),
    "x-mac-greek": (
      // Python: 'mac_greek'
      "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­"
    ),
    "x-mac-icelandic": (
      // Python: 'mac_iceland'
      "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    ),
    "x-mac-inuit": (
      // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
      "ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł"
    ),
    "x-mac-ce": (
      // Python: 'mac_latin2'
      "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
    ),
    macintosh: (
      // Python: 'mac_roman'
      "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    ),
    "x-mac-romanian": (
      // Python: 'mac_romanian'
      "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    ),
    "x-mac-turkish": (
      // Python: 'mac_turkish'
      "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ"
    )
  };
  lr.MACSTRING = function(n, e, t, r) {
    var i = hs[r];
    if (i !== void 0) {
      for (var s = "", a = 0; a < t; a++) {
        var o = n.getUint8(e + a);
        o <= 127 ? s += String.fromCharCode(o) : s += i[o & 127];
      }
      return s;
    }
  };
  var Tn = typeof WeakMap == "function" && /* @__PURE__ */ new WeakMap(), Cn, bu = function(n) {
    if (!Cn) {
      Cn = {};
      for (var e in hs)
        Cn[e] = new String(e);
    }
    var t = Cn[n];
    if (t !== void 0) {
      if (Tn) {
        var r = Tn.get(t);
        if (r !== void 0)
          return r;
      }
      var i = hs[n];
      if (i !== void 0) {
        for (var s = {}, a = 0; a < i.length; a++)
          s[i.charCodeAt(a)] = a + 128;
        return Tn && Tn.set(t, s), s;
      }
    }
  };
  R.MACSTRING = function(n, e) {
    var t = bu(e);
    if (t !== void 0) {
      for (var r = [], i = 0; i < n.length; i++) {
        var s = n.charCodeAt(i);
        if (s >= 128 && (s = t[s], s === void 0))
          return;
        r[i] = s;
      }
      return r;
    }
  };
  W.MACSTRING = function(n, e) {
    var t = R.MACSTRING(n, e);
    return t !== void 0 ? t.length : 0;
  };
  function cs(n) {
    return n >= -128 && n <= 127;
  }
  function wu(n, e, t) {
    for (var r = 0, i = n.length; e < i && r < 64 && n[e] === 0; )
      ++e, ++r;
    return t.push(128 | r - 1), e;
  }
  function Su(n, e, t) {
    for (var r = 0, i = n.length, s = e; s < i && r < 64; ) {
      var a = n[s];
      if (!cs(a) || a === 0 && s + 1 < i && n[s + 1] === 0)
        break;
      ++s, ++r;
    }
    t.push(r - 1);
    for (var o = e; o < s; ++o)
      t.push(n[o] + 256 & 255);
    return s;
  }
  function Fu(n, e, t) {
    for (var r = 0, i = n.length, s = e; s < i && r < 64; ) {
      var a = n[s];
      if (a === 0 || cs(a) && s + 1 < i && cs(n[s + 1]))
        break;
      ++s, ++r;
    }
    t.push(64 | r - 1);
    for (var o = e; o < s; ++o) {
      var h = n[o];
      t.push(h + 65536 >> 8 & 255, h + 256 & 255);
    }
    return s;
  }
  R.VARDELTAS = function(n) {
    for (var e = 0, t = []; e < n.length; ) {
      var r = n[e];
      r === 0 ? e = wu(n, e, t) : r >= -128 && r <= 127 ? e = Su(n, e, t) : e = Fu(n, e, t);
    }
    return t;
  };
  R.INDEX = function(n) {
    for (var e = 1, t = [e], r = [], i = 0; i < n.length; i += 1) {
      var s = R.OBJECT(n[i]);
      Array.prototype.push.apply(r, s), e += s.length, t.push(e);
    }
    if (r.length === 0)
      return [0, 0];
    for (var a = [], o = 1 + Math.floor(Math.log(e) / Math.log(2)) / 8 | 0, h = [void 0, R.BYTE, R.USHORT, R.UINT24, R.ULONG][o], c = 0; c < t.length; c += 1) {
      var u = h(t[c]);
      Array.prototype.push.apply(a, u);
    }
    return Array.prototype.concat(
      R.Card16(n.length),
      R.OffSize(o),
      a,
      r
    );
  };
  W.INDEX = function(n) {
    return R.INDEX(n).length;
  };
  R.DICT = function(n) {
    for (var e = [], t = Object.keys(n), r = t.length, i = 0; i < r; i += 1) {
      var s = parseInt(t[i], 0), a = n[s];
      e = e.concat(R.OPERAND(a.value, a.type)), e = e.concat(R.OPERATOR(s));
    }
    return e;
  };
  W.DICT = function(n) {
    return R.DICT(n).length;
  };
  R.OPERATOR = function(n) {
    return n < 1200 ? [n] : [12, n - 1200];
  };
  R.OPERAND = function(n, e) {
    var t = [];
    if (Array.isArray(e))
      for (var r = 0; r < e.length; r += 1)
        G.argument(n.length === e.length, "Not enough arguments given for type" + e), t = t.concat(R.OPERAND(n[r], e[r]));
    else if (e === "SID")
      t = t.concat(R.NUMBER(n));
    else if (e === "offset")
      t = t.concat(R.NUMBER32(n));
    else if (e === "number")
      t = t.concat(R.NUMBER(n));
    else if (e === "real")
      t = t.concat(R.REAL(n));
    else
      throw new Error("Unknown operand type " + e);
    return t;
  };
  R.OP = R.BYTE;
  W.OP = W.BYTE;
  var kn = typeof WeakMap == "function" && /* @__PURE__ */ new WeakMap();
  R.CHARSTRING = function(n) {
    if (kn) {
      var e = kn.get(n);
      if (e !== void 0)
        return e;
    }
    for (var t = [], r = n.length, i = 0; i < r; i += 1) {
      var s = n[i];
      t = t.concat(R[s.type](s.value));
    }
    return kn && kn.set(n, t), t;
  };
  W.CHARSTRING = function(n) {
    return R.CHARSTRING(n).length;
  };
  R.OBJECT = function(n) {
    var e = R[n.type];
    return G.argument(e !== void 0, "No encoding function for type " + n.type), e(n.value);
  };
  W.OBJECT = function(n) {
    var e = W[n.type];
    return G.argument(e !== void 0, "No sizeOf function for type " + n.type), e(n.value);
  };
  R.TABLE = function(n) {
    for (var e = [], t = n.fields.length, r = [], i = [], s = 0; s < t; s += 1) {
      var a = n.fields[s], o = R[a.type];
      G.argument(o !== void 0, "No encoding function for field type " + a.type + " (" + a.name + ")");
      var h = n[a.name];
      h === void 0 && (h = a.value);
      var c = o(h);
      a.type === "TABLE" ? (i.push(e.length), e = e.concat([0, 0]), r.push(c)) : e = e.concat(c);
    }
    for (var u = 0; u < r.length; u += 1) {
      var f = i[u], l = e.length;
      G.argument(l < 65536, "Table " + n.tableName + " too big."), e[f] = l >> 8, e[f + 1] = l & 255, e = e.concat(r[u]);
    }
    return e;
  };
  W.TABLE = function(n) {
    for (var e = 0, t = n.fields.length, r = 0; r < t; r += 1) {
      var i = n.fields[r], s = W[i.type];
      G.argument(s !== void 0, "No sizeOf function for field type " + i.type + " (" + i.name + ")");
      var a = n[i.name];
      a === void 0 && (a = i.value), e += s(a), i.type === "TABLE" && (e += 2);
    }
    return e;
  };
  R.RECORD = R.TABLE;
  W.RECORD = W.TABLE;
  R.LITERAL = function(n) {
    return n;
  };
  W.LITERAL = function(n) {
    return n.length;
  };
  function ge(n, e, t) {
    if (e.length && (e[0].name !== "coverageFormat" || e[0].value === 1))
      for (var r = 0; r < e.length; r += 1) {
        var i = e[r];
        this[i.name] = i.value;
      }
    if (this.tableName = n, this.fields = e, t)
      for (var s = Object.keys(t), a = 0; a < s.length; a += 1) {
        var o = s[a], h = t[o];
        this[o] !== void 0 && (this[o] = h);
      }
  }
  ge.prototype.encode = function() {
    return R.TABLE(this);
  };
  ge.prototype.sizeOf = function() {
    return W.TABLE(this);
  };
  function Pr(n, e, t) {
    t === void 0 && (t = e.length);
    var r = new Array(e.length + 1);
    r[0] = { name: n + "Count", type: "USHORT", value: t };
    for (var i = 0; i < e.length; i++)
      r[i + 1] = { name: n + i, type: "USHORT", value: e[i] };
    return r;
  }
  function us(n, e, t) {
    var r = e.length, i = new Array(r + 1);
    i[0] = { name: n + "Count", type: "USHORT", value: r };
    for (var s = 0; s < r; s++)
      i[s + 1] = { name: n + s, type: "TABLE", value: t(e[s], s) };
    return i;
  }
  function zr(n, e, t) {
    var r = e.length, i = [];
    i[0] = { name: n + "Count", type: "USHORT", value: r };
    for (var s = 0; s < r; s++)
      i = i.concat(t(e[s], s));
    return i;
  }
  function zn(n) {
    n.format === 1 ? ge.call(
      this,
      "coverageTable",
      [{ name: "coverageFormat", type: "USHORT", value: 1 }].concat(Pr("glyph", n.glyphs))
    ) : n.format === 2 ? ge.call(
      this,
      "coverageTable",
      [{ name: "coverageFormat", type: "USHORT", value: 2 }].concat(zr("rangeRecord", n.ranges, function(e) {
        return [
          { name: "startGlyphID", type: "USHORT", value: e.start },
          { name: "endGlyphID", type: "USHORT", value: e.end },
          { name: "startCoverageIndex", type: "USHORT", value: e.index }
        ];
      }))
    ) : G.assert(!1, "Coverage format must be 1 or 2.");
  }
  zn.prototype = Object.create(ge.prototype);
  zn.prototype.constructor = zn;
  function Nn(n) {
    ge.call(
      this,
      "scriptListTable",
      zr("scriptRecord", n, function(e, t) {
        var r = e.script, i = r.defaultLangSys;
        return G.assert(!!i, "Unable to write GSUB: script " + e.tag + " has no default language system."), [
          { name: "scriptTag" + t, type: "TAG", value: e.tag },
          { name: "script" + t, type: "TABLE", value: new ge("scriptTable", [
            { name: "defaultLangSys", type: "TABLE", value: new ge("defaultLangSys", [
              { name: "lookupOrder", type: "USHORT", value: 0 },
              { name: "reqFeatureIndex", type: "USHORT", value: i.reqFeatureIndex }
            ].concat(Pr("featureIndex", i.featureIndexes))) }
          ].concat(zr("langSys", r.langSysRecords, function(s, a) {
            var o = s.langSys;
            return [
              { name: "langSysTag" + a, type: "TAG", value: s.tag },
              { name: "langSys" + a, type: "TABLE", value: new ge("langSys", [
                { name: "lookupOrder", type: "USHORT", value: 0 },
                { name: "reqFeatureIndex", type: "USHORT", value: o.reqFeatureIndex }
              ].concat(Pr("featureIndex", o.featureIndexes))) }
            ];
          }))) }
        ];
      })
    );
  }
  Nn.prototype = Object.create(ge.prototype);
  Nn.prototype.constructor = Nn;
  function Gn(n) {
    ge.call(
      this,
      "featureListTable",
      zr("featureRecord", n, function(e, t) {
        var r = e.feature;
        return [
          { name: "featureTag" + t, type: "TAG", value: e.tag },
          { name: "feature" + t, type: "TABLE", value: new ge("featureTable", [
            { name: "featureParams", type: "USHORT", value: r.featureParams }
          ].concat(Pr("lookupListIndex", r.lookupListIndexes))) }
        ];
      })
    );
  }
  Gn.prototype = Object.create(ge.prototype);
  Gn.prototype.constructor = Gn;
  function Hn(n, e) {
    ge.call(this, "lookupListTable", us("lookup", n, function(t) {
      var r = e[t.lookupType];
      return G.assert(!!r, "Unable to write GSUB lookup type " + t.lookupType + " tables."), new ge("lookupTable", [
        { name: "lookupType", type: "USHORT", value: t.lookupType },
        { name: "lookupFlag", type: "USHORT", value: t.lookupFlag }
      ].concat(us("subtable", t.subtables, r)));
    }));
  }
  Hn.prototype = Object.create(ge.prototype);
  Hn.prototype.constructor = Hn;
  var D = {
    Table: ge,
    Record: ge,
    Coverage: zn,
    ScriptList: Nn,
    FeatureList: Gn,
    LookupList: Hn,
    ushortList: Pr,
    tableList: us,
    recordList: zr
  };
  function Ea(n, e) {
    return n.getUint8(e);
  }
  function Wn(n, e) {
    return n.getUint16(e, !1);
  }
  function Tu(n, e) {
    return n.getInt16(e, !1);
  }
  function Ss(n, e) {
    return n.getUint32(e, !1);
  }
  function rh(n, e) {
    var t = n.getInt16(e, !1), r = n.getUint16(e + 2, !1);
    return t + r / 65535;
  }
  function Cu(n, e) {
    for (var t = "", r = e; r < e + 4; r += 1)
      t += String.fromCharCode(n.getInt8(r));
    return t;
  }
  function ku(n, e, t) {
    for (var r = 0, i = 0; i < t; i += 1)
      r <<= 8, r += n.getUint8(e + i);
    return r;
  }
  function Mu(n, e, t) {
    for (var r = [], i = e; i < t; i += 1)
      r.push(n.getUint8(i));
    return r;
  }
  function Au(n) {
    for (var e = "", t = 0; t < n.length; t += 1)
      e += String.fromCharCode(n[t]);
    return e;
  }
  var Eu = {
    byte: 1,
    uShort: 2,
    short: 2,
    uLong: 4,
    fixed: 4,
    longDateTime: 8,
    tag: 4
  };
  function M(n, e) {
    this.data = n, this.offset = e, this.relativeOffset = 0;
  }
  M.prototype.parseByte = function() {
    var n = this.data.getUint8(this.offset + this.relativeOffset);
    return this.relativeOffset += 1, n;
  };
  M.prototype.parseChar = function() {
    var n = this.data.getInt8(this.offset + this.relativeOffset);
    return this.relativeOffset += 1, n;
  };
  M.prototype.parseCard8 = M.prototype.parseByte;
  M.prototype.parseUShort = function() {
    var n = this.data.getUint16(this.offset + this.relativeOffset);
    return this.relativeOffset += 2, n;
  };
  M.prototype.parseCard16 = M.prototype.parseUShort;
  M.prototype.parseSID = M.prototype.parseUShort;
  M.prototype.parseOffset16 = M.prototype.parseUShort;
  M.prototype.parseShort = function() {
    var n = this.data.getInt16(this.offset + this.relativeOffset);
    return this.relativeOffset += 2, n;
  };
  M.prototype.parseF2Dot14 = function() {
    var n = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
    return this.relativeOffset += 2, n;
  };
  M.prototype.parseULong = function() {
    var n = Ss(this.data, this.offset + this.relativeOffset);
    return this.relativeOffset += 4, n;
  };
  M.prototype.parseOffset32 = M.prototype.parseULong;
  M.prototype.parseFixed = function() {
    var n = rh(this.data, this.offset + this.relativeOffset);
    return this.relativeOffset += 4, n;
  };
  M.prototype.parseString = function(n) {
    var e = this.data, t = this.offset + this.relativeOffset, r = "";
    this.relativeOffset += n;
    for (var i = 0; i < n; i++)
      r += String.fromCharCode(e.getUint8(t + i));
    return r;
  };
  M.prototype.parseTag = function() {
    return this.parseString(4);
  };
  M.prototype.parseLongDateTime = function() {
    var n = Ss(this.data, this.offset + this.relativeOffset + 4);
    return n -= 2082844800, this.relativeOffset += 8, n;
  };
  M.prototype.parseVersion = function(n) {
    var e = Wn(this.data, this.offset + this.relativeOffset), t = Wn(this.data, this.offset + this.relativeOffset + 2);
    return this.relativeOffset += 4, n === void 0 && (n = 4096), e + t / n / 10;
  };
  M.prototype.skip = function(n, e) {
    e === void 0 && (e = 1), this.relativeOffset += Eu[n] * e;
  };
  M.prototype.parseULongList = function(n) {
    n === void 0 && (n = this.parseULong());
    for (var e = new Array(n), t = this.data, r = this.offset + this.relativeOffset, i = 0; i < n; i++)
      e[i] = t.getUint32(r), r += 4;
    return this.relativeOffset += n * 4, e;
  };
  M.prototype.parseOffset16List = M.prototype.parseUShortList = function(n) {
    n === void 0 && (n = this.parseUShort());
    for (var e = new Array(n), t = this.data, r = this.offset + this.relativeOffset, i = 0; i < n; i++)
      e[i] = t.getUint16(r), r += 2;
    return this.relativeOffset += n * 2, e;
  };
  M.prototype.parseShortList = function(n) {
    for (var e = new Array(n), t = this.data, r = this.offset + this.relativeOffset, i = 0; i < n; i++)
      e[i] = t.getInt16(r), r += 2;
    return this.relativeOffset += n * 2, e;
  };
  M.prototype.parseByteList = function(n) {
    for (var e = new Array(n), t = this.data, r = this.offset + this.relativeOffset, i = 0; i < n; i++)
      e[i] = t.getUint8(r++);
    return this.relativeOffset += n, e;
  };
  M.prototype.parseList = function(n, e) {
    e || (e = n, n = this.parseUShort());
    for (var t = new Array(n), r = 0; r < n; r++)
      t[r] = e.call(this);
    return t;
  };
  M.prototype.parseList32 = function(n, e) {
    e || (e = n, n = this.parseULong());
    for (var t = new Array(n), r = 0; r < n; r++)
      t[r] = e.call(this);
    return t;
  };
  M.prototype.parseRecordList = function(n, e) {
    e || (e = n, n = this.parseUShort());
    for (var t = new Array(n), r = Object.keys(e), i = 0; i < n; i++) {
      for (var s = {}, a = 0; a < r.length; a++) {
        var o = r[a], h = e[o];
        s[o] = h.call(this);
      }
      t[i] = s;
    }
    return t;
  };
  M.prototype.parseRecordList32 = function(n, e) {
    e || (e = n, n = this.parseULong());
    for (var t = new Array(n), r = Object.keys(e), i = 0; i < n; i++) {
      for (var s = {}, a = 0; a < r.length; a++) {
        var o = r[a], h = e[o];
        s[o] = h.call(this);
      }
      t[i] = s;
    }
    return t;
  };
  M.prototype.parseStruct = function(n) {
    if (typeof n == "function")
      return n.call(this);
    for (var e = Object.keys(n), t = {}, r = 0; r < e.length; r++) {
      var i = e[r], s = n[i];
      t[i] = s.call(this);
    }
    return t;
  };
  M.prototype.parseValueRecord = function(n) {
    if (n === void 0 && (n = this.parseUShort()), n !== 0) {
      var e = {};
      return n & 1 && (e.xPlacement = this.parseShort()), n & 2 && (e.yPlacement = this.parseShort()), n & 4 && (e.xAdvance = this.parseShort()), n & 8 && (e.yAdvance = this.parseShort()), n & 16 && (e.xPlaDevice = void 0, this.parseShort()), n & 32 && (e.yPlaDevice = void 0, this.parseShort()), n & 64 && (e.xAdvDevice = void 0, this.parseShort()), n & 128 && (e.yAdvDevice = void 0, this.parseShort()), e;
    }
  };
  M.prototype.parseValueRecordList = function() {
    for (var n = this.parseUShort(), e = this.parseUShort(), t = new Array(e), r = 0; r < e; r++)
      t[r] = this.parseValueRecord(n);
    return t;
  };
  M.prototype.parsePointer = function(n) {
    var e = this.parseOffset16();
    if (e > 0)
      return new M(this.data, this.offset + e).parseStruct(n);
  };
  M.prototype.parsePointer32 = function(n) {
    var e = this.parseOffset32();
    if (e > 0)
      return new M(this.data, this.offset + e).parseStruct(n);
  };
  M.prototype.parseListOfLists = function(n) {
    for (var e = this.parseOffset16List(), t = e.length, r = this.relativeOffset, i = new Array(t), s = 0; s < t; s++) {
      var a = e[s];
      if (a === 0) {
        i[s] = void 0;
        continue;
      }
      if (this.relativeOffset = a, n) {
        for (var o = this.parseOffset16List(), h = new Array(o.length), c = 0; c < o.length; c++)
          this.relativeOffset = a + o[c], h[c] = n.call(this);
        i[s] = h;
      } else
        i[s] = this.parseUShortList();
    }
    return this.relativeOffset = r, i;
  };
  M.prototype.parseCoverage = function() {
    var n = this.offset + this.relativeOffset, e = this.parseUShort(), t = this.parseUShort();
    if (e === 1)
      return {
        format: 1,
        glyphs: this.parseUShortList(t)
      };
    if (e === 2) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = {
          start: this.parseUShort(),
          end: this.parseUShort(),
          index: this.parseUShort()
        };
      return {
        format: 2,
        ranges: r
      };
    }
    throw new Error("0x" + n.toString(16) + ": Coverage format must be 1 or 2.");
  };
  M.prototype.parseClassDef = function() {
    var n = this.offset + this.relativeOffset, e = this.parseUShort();
    if (e === 1)
      return {
        format: 1,
        startGlyph: this.parseUShort(),
        classes: this.parseUShortList()
      };
    if (e === 2)
      return {
        format: 2,
        ranges: this.parseRecordList({
          start: M.uShort,
          end: M.uShort,
          classId: M.uShort
        })
      };
    throw new Error("0x" + n.toString(16) + ": ClassDef format must be 1 or 2.");
  };
  M.list = function(n, e) {
    return function() {
      return this.parseList(n, e);
    };
  };
  M.list32 = function(n, e) {
    return function() {
      return this.parseList32(n, e);
    };
  };
  M.recordList = function(n, e) {
    return function() {
      return this.parseRecordList(n, e);
    };
  };
  M.recordList32 = function(n, e) {
    return function() {
      return this.parseRecordList32(n, e);
    };
  };
  M.pointer = function(n) {
    return function() {
      return this.parsePointer(n);
    };
  };
  M.pointer32 = function(n) {
    return function() {
      return this.parsePointer32(n);
    };
  };
  M.tag = M.prototype.parseTag;
  M.byte = M.prototype.parseByte;
  M.uShort = M.offset16 = M.prototype.parseUShort;
  M.uShortList = M.prototype.parseUShortList;
  M.uLong = M.offset32 = M.prototype.parseULong;
  M.uLongList = M.prototype.parseULongList;
  M.struct = M.prototype.parseStruct;
  M.coverage = M.prototype.parseCoverage;
  M.classDef = M.prototype.parseClassDef;
  var Ba = {
    reserved: M.uShort,
    reqFeatureIndex: M.uShort,
    featureIndexes: M.uShortList
  };
  M.prototype.parseScriptList = function() {
    return this.parsePointer(M.recordList({
      tag: M.tag,
      script: M.pointer({
        defaultLangSys: M.pointer(Ba),
        langSysRecords: M.recordList({
          tag: M.tag,
          langSys: M.pointer(Ba)
        })
      })
    })) || [];
  };
  M.prototype.parseFeatureList = function() {
    return this.parsePointer(M.recordList({
      tag: M.tag,
      feature: M.pointer({
        featureParams: M.offset16,
        lookupListIndexes: M.uShortList
      })
    })) || [];
  };
  M.prototype.parseLookupList = function(n) {
    return this.parsePointer(M.list(M.pointer(function() {
      var e = this.parseUShort();
      G.argument(1 <= e && e <= 9, "GPOS/GSUB lookup type " + e + " unknown.");
      var t = this.parseUShort(), r = t & 16;
      return {
        lookupType: e,
        lookupFlag: t,
        subtables: this.parseList(M.pointer(n[e])),
        markFilteringSet: r ? this.parseUShort() : void 0
      };
    }))) || [];
  };
  M.prototype.parseFeatureVariationsList = function() {
    return this.parsePointer32(function() {
      var n = this.parseUShort(), e = this.parseUShort();
      G.argument(n === 1 && e < 1, "GPOS/GSUB feature variations table unknown.");
      var t = this.parseRecordList32({
        conditionSetOffset: M.offset32,
        featureTableSubstitutionOffset: M.offset32
      });
      return t;
    }) || [];
  };
  var z = {
    getByte: Ea,
    getCard8: Ea,
    getUShort: Wn,
    getCard16: Wn,
    getShort: Tu,
    getULong: Ss,
    getFixed: rh,
    getTag: Cu,
    getOffset: ku,
    getBytes: Mu,
    bytesToString: Au,
    Parser: M
  };
  function Bu(n, e) {
    e.parseUShort(), n.length = e.parseULong(), n.language = e.parseULong();
    var t;
    n.groupCount = t = e.parseULong(), n.glyphIndexMap = {};
    for (var r = 0; r < t; r += 1)
      for (var i = e.parseULong(), s = e.parseULong(), a = e.parseULong(), o = i; o <= s; o += 1)
        n.glyphIndexMap[o] = a, a++;
  }
  function _u(n, e, t, r, i) {
    n.length = e.parseUShort(), n.language = e.parseUShort();
    var s;
    n.segCount = s = e.parseUShort() >> 1, e.skip("uShort", 3), n.glyphIndexMap = {};
    for (var a = new z.Parser(t, r + i + 14), o = new z.Parser(t, r + i + 16 + s * 2), h = new z.Parser(t, r + i + 16 + s * 4), c = new z.Parser(t, r + i + 16 + s * 6), u = r + i + 16 + s * 8, f = 0; f < s - 1; f += 1)
      for (var l = void 0, p = a.parseUShort(), g = o.parseUShort(), m = h.parseShort(), x = c.parseUShort(), v = g; v <= p; v += 1)
        x !== 0 ? (u = c.offset + c.relativeOffset - 2, u += x, u += (v - g) * 2, l = z.getUShort(t, u), l !== 0 && (l = l + m & 65535)) : l = v + m & 65535, n.glyphIndexMap[v] = l;
  }
  function Ou(n, e) {
    var t = {};
    t.version = z.getUShort(n, e), G.argument(t.version === 0, "cmap table version should be 0."), t.numTables = z.getUShort(n, e + 2);
    for (var r = -1, i = t.numTables - 1; i >= 0; i -= 1) {
      var s = z.getUShort(n, e + 4 + i * 8), a = z.getUShort(n, e + 4 + i * 8 + 2);
      if (s === 3 && (a === 0 || a === 1 || a === 10) || s === 0 && (a === 0 || a === 1 || a === 2 || a === 3 || a === 4)) {
        r = z.getULong(n, e + 4 + i * 8 + 4);
        break;
      }
    }
    if (r === -1)
      throw new Error("No valid cmap sub-tables found.");
    var o = new z.Parser(n, e + r);
    if (t.format = o.parseUShort(), t.format === 12)
      Bu(t, o);
    else if (t.format === 4)
      _u(t, o, n, e, r);
    else
      throw new Error("Only format 4 and 12 cmap tables are supported (found format " + t.format + ").");
    return t;
  }
  function Lu(n, e, t) {
    n.segments.push({
      end: e,
      start: e,
      delta: -(e - t),
      offset: 0,
      glyphIndex: t
    });
  }
  function Uu(n) {
    n.segments.push({
      end: 65535,
      start: 65535,
      delta: 1,
      offset: 0
    });
  }
  function Ru(n) {
    var e = !0, t;
    for (t = n.length - 1; t > 0; t -= 1) {
      var r = n.get(t);
      if (r.unicode > 65535) {
        console.log("Adding CMAP format 12 (needed!)"), e = !1;
        break;
      }
    }
    var i = [
      { name: "version", type: "USHORT", value: 0 },
      { name: "numTables", type: "USHORT", value: e ? 1 : 2 },
      // CMAP 4 header
      { name: "platformID", type: "USHORT", value: 3 },
      { name: "encodingID", type: "USHORT", value: 1 },
      { name: "offset", type: "ULONG", value: e ? 12 : 20 }
    ];
    e || (i = i.concat([
      // CMAP 12 header
      { name: "cmap12PlatformID", type: "USHORT", value: 3 },
      // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
      { name: "cmap12EncodingID", type: "USHORT", value: 10 },
      { name: "cmap12Offset", type: "ULONG", value: 0 }
    ])), i = i.concat([
      // CMAP 4 Subtable
      { name: "format", type: "USHORT", value: 4 },
      { name: "cmap4Length", type: "USHORT", value: 0 },
      { name: "language", type: "USHORT", value: 0 },
      { name: "segCountX2", type: "USHORT", value: 0 },
      { name: "searchRange", type: "USHORT", value: 0 },
      { name: "entrySelector", type: "USHORT", value: 0 },
      { name: "rangeShift", type: "USHORT", value: 0 }
    ]);
    var s = new D.Table("cmap", i);
    for (s.segments = [], t = 0; t < n.length; t += 1) {
      for (var a = n.get(t), o = 0; o < a.unicodes.length; o += 1)
        Lu(s, a.unicodes[o], t);
      s.segments = s.segments.sort(function(w, b) {
        return w.start - b.start;
      });
    }
    Uu(s);
    var h = s.segments.length, c = 0, u = [], f = [], l = [], p = [], g = [], m = [];
    for (t = 0; t < h; t += 1) {
      var x = s.segments[t];
      x.end <= 65535 && x.start <= 65535 ? (u = u.concat({ name: "end_" + t, type: "USHORT", value: x.end }), f = f.concat({ name: "start_" + t, type: "USHORT", value: x.start }), l = l.concat({ name: "idDelta_" + t, type: "SHORT", value: x.delta }), p = p.concat({ name: "idRangeOffset_" + t, type: "USHORT", value: x.offset }), x.glyphId !== void 0 && (g = g.concat({ name: "glyph_" + t, type: "USHORT", value: x.glyphId }))) : c += 1, !e && x.glyphIndex !== void 0 && (m = m.concat({ name: "cmap12Start_" + t, type: "ULONG", value: x.start }), m = m.concat({ name: "cmap12End_" + t, type: "ULONG", value: x.end }), m = m.concat({ name: "cmap12Glyph_" + t, type: "ULONG", value: x.glyphIndex }));
    }
    if (s.segCountX2 = (h - c) * 2, s.searchRange = Math.pow(2, Math.floor(Math.log(h - c) / Math.log(2))) * 2, s.entrySelector = Math.log(s.searchRange / 2) / Math.log(2), s.rangeShift = s.segCountX2 - s.searchRange, s.fields = s.fields.concat(u), s.fields.push({ name: "reservedPad", type: "USHORT", value: 0 }), s.fields = s.fields.concat(f), s.fields = s.fields.concat(l), s.fields = s.fields.concat(p), s.fields = s.fields.concat(g), s.cmap4Length = 14 + // Subtable header
    u.length * 2 + 2 + // reservedPad
    f.length * 2 + l.length * 2 + p.length * 2 + g.length * 2, !e) {
      var v = 16 + // Subtable header
      m.length * 4;
      s.cmap12Offset = 12 + 2 * 2 + 4 + s.cmap4Length, s.fields = s.fields.concat([
        { name: "cmap12Format", type: "USHORT", value: 12 },
        { name: "cmap12Reserved", type: "USHORT", value: 0 },
        { name: "cmap12Length", type: "ULONG", value: v },
        { name: "cmap12Language", type: "ULONG", value: 0 },
        { name: "cmap12nGroups", type: "ULONG", value: m.length / 3 }
      ]), s.fields = s.fields.concat(m);
    }
    return s;
  }
  var nh = { parse: Ou, make: Ru }, _n = [
    ".notdef",
    "space",
    "exclam",
    "quotedbl",
    "numbersign",
    "dollar",
    "percent",
    "ampersand",
    "quoteright",
    "parenleft",
    "parenright",
    "asterisk",
    "plus",
    "comma",
    "hyphen",
    "period",
    "slash",
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "colon",
    "semicolon",
    "less",
    "equal",
    "greater",
    "question",
    "at",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "bracketleft",
    "backslash",
    "bracketright",
    "asciicircum",
    "underscore",
    "quoteleft",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "braceleft",
    "bar",
    "braceright",
    "asciitilde",
    "exclamdown",
    "cent",
    "sterling",
    "fraction",
    "yen",
    "florin",
    "section",
    "currency",
    "quotesingle",
    "quotedblleft",
    "guillemotleft",
    "guilsinglleft",
    "guilsinglright",
    "fi",
    "fl",
    "endash",
    "dagger",
    "daggerdbl",
    "periodcentered",
    "paragraph",
    "bullet",
    "quotesinglbase",
    "quotedblbase",
    "quotedblright",
    "guillemotright",
    "ellipsis",
    "perthousand",
    "questiondown",
    "grave",
    "acute",
    "circumflex",
    "tilde",
    "macron",
    "breve",
    "dotaccent",
    "dieresis",
    "ring",
    "cedilla",
    "hungarumlaut",
    "ogonek",
    "caron",
    "emdash",
    "AE",
    "ordfeminine",
    "Lslash",
    "Oslash",
    "OE",
    "ordmasculine",
    "ae",
    "dotlessi",
    "lslash",
    "oslash",
    "oe",
    "germandbls",
    "onesuperior",
    "logicalnot",
    "mu",
    "trademark",
    "Eth",
    "onehalf",
    "plusminus",
    "Thorn",
    "onequarter",
    "divide",
    "brokenbar",
    "degree",
    "thorn",
    "threequarters",
    "twosuperior",
    "registered",
    "minus",
    "eth",
    "multiply",
    "threesuperior",
    "copyright",
    "Aacute",
    "Acircumflex",
    "Adieresis",
    "Agrave",
    "Aring",
    "Atilde",
    "Ccedilla",
    "Eacute",
    "Ecircumflex",
    "Edieresis",
    "Egrave",
    "Iacute",
    "Icircumflex",
    "Idieresis",
    "Igrave",
    "Ntilde",
    "Oacute",
    "Ocircumflex",
    "Odieresis",
    "Ograve",
    "Otilde",
    "Scaron",
    "Uacute",
    "Ucircumflex",
    "Udieresis",
    "Ugrave",
    "Yacute",
    "Ydieresis",
    "Zcaron",
    "aacute",
    "acircumflex",
    "adieresis",
    "agrave",
    "aring",
    "atilde",
    "ccedilla",
    "eacute",
    "ecircumflex",
    "edieresis",
    "egrave",
    "iacute",
    "icircumflex",
    "idieresis",
    "igrave",
    "ntilde",
    "oacute",
    "ocircumflex",
    "odieresis",
    "ograve",
    "otilde",
    "scaron",
    "uacute",
    "ucircumflex",
    "udieresis",
    "ugrave",
    "yacute",
    "ydieresis",
    "zcaron",
    "exclamsmall",
    "Hungarumlautsmall",
    "dollaroldstyle",
    "dollarsuperior",
    "ampersandsmall",
    "Acutesmall",
    "parenleftsuperior",
    "parenrightsuperior",
    "266 ff",
    "onedotenleader",
    "zerooldstyle",
    "oneoldstyle",
    "twooldstyle",
    "threeoldstyle",
    "fouroldstyle",
    "fiveoldstyle",
    "sixoldstyle",
    "sevenoldstyle",
    "eightoldstyle",
    "nineoldstyle",
    "commasuperior",
    "threequartersemdash",
    "periodsuperior",
    "questionsmall",
    "asuperior",
    "bsuperior",
    "centsuperior",
    "dsuperior",
    "esuperior",
    "isuperior",
    "lsuperior",
    "msuperior",
    "nsuperior",
    "osuperior",
    "rsuperior",
    "ssuperior",
    "tsuperior",
    "ff",
    "ffi",
    "ffl",
    "parenleftinferior",
    "parenrightinferior",
    "Circumflexsmall",
    "hyphensuperior",
    "Gravesmall",
    "Asmall",
    "Bsmall",
    "Csmall",
    "Dsmall",
    "Esmall",
    "Fsmall",
    "Gsmall",
    "Hsmall",
    "Ismall",
    "Jsmall",
    "Ksmall",
    "Lsmall",
    "Msmall",
    "Nsmall",
    "Osmall",
    "Psmall",
    "Qsmall",
    "Rsmall",
    "Ssmall",
    "Tsmall",
    "Usmall",
    "Vsmall",
    "Wsmall",
    "Xsmall",
    "Ysmall",
    "Zsmall",
    "colonmonetary",
    "onefitted",
    "rupiah",
    "Tildesmall",
    "exclamdownsmall",
    "centoldstyle",
    "Lslashsmall",
    "Scaronsmall",
    "Zcaronsmall",
    "Dieresissmall",
    "Brevesmall",
    "Caronsmall",
    "Dotaccentsmall",
    "Macronsmall",
    "figuredash",
    "hypheninferior",
    "Ogoneksmall",
    "Ringsmall",
    "Cedillasmall",
    "questiondownsmall",
    "oneeighth",
    "threeeighths",
    "fiveeighths",
    "seveneighths",
    "onethird",
    "twothirds",
    "zerosuperior",
    "foursuperior",
    "fivesuperior",
    "sixsuperior",
    "sevensuperior",
    "eightsuperior",
    "ninesuperior",
    "zeroinferior",
    "oneinferior",
    "twoinferior",
    "threeinferior",
    "fourinferior",
    "fiveinferior",
    "sixinferior",
    "seveninferior",
    "eightinferior",
    "nineinferior",
    "centinferior",
    "dollarinferior",
    "periodinferior",
    "commainferior",
    "Agravesmall",
    "Aacutesmall",
    "Acircumflexsmall",
    "Atildesmall",
    "Adieresissmall",
    "Aringsmall",
    "AEsmall",
    "Ccedillasmall",
    "Egravesmall",
    "Eacutesmall",
    "Ecircumflexsmall",
    "Edieresissmall",
    "Igravesmall",
    "Iacutesmall",
    "Icircumflexsmall",
    "Idieresissmall",
    "Ethsmall",
    "Ntildesmall",
    "Ogravesmall",
    "Oacutesmall",
    "Ocircumflexsmall",
    "Otildesmall",
    "Odieresissmall",
    "OEsmall",
    "Oslashsmall",
    "Ugravesmall",
    "Uacutesmall",
    "Ucircumflexsmall",
    "Udieresissmall",
    "Yacutesmall",
    "Thornsmall",
    "Ydieresissmall",
    "001.000",
    "001.001",
    "001.002",
    "001.003",
    "Black",
    "Bold",
    "Book",
    "Light",
    "Medium",
    "Regular",
    "Roman",
    "Semibold"
  ], Du = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "space",
    "exclam",
    "quotedbl",
    "numbersign",
    "dollar",
    "percent",
    "ampersand",
    "quoteright",
    "parenleft",
    "parenright",
    "asterisk",
    "plus",
    "comma",
    "hyphen",
    "period",
    "slash",
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "colon",
    "semicolon",
    "less",
    "equal",
    "greater",
    "question",
    "at",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "bracketleft",
    "backslash",
    "bracketright",
    "asciicircum",
    "underscore",
    "quoteleft",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "braceleft",
    "bar",
    "braceright",
    "asciitilde",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "exclamdown",
    "cent",
    "sterling",
    "fraction",
    "yen",
    "florin",
    "section",
    "currency",
    "quotesingle",
    "quotedblleft",
    "guillemotleft",
    "guilsinglleft",
    "guilsinglright",
    "fi",
    "fl",
    "",
    "endash",
    "dagger",
    "daggerdbl",
    "periodcentered",
    "",
    "paragraph",
    "bullet",
    "quotesinglbase",
    "quotedblbase",
    "quotedblright",
    "guillemotright",
    "ellipsis",
    "perthousand",
    "",
    "questiondown",
    "",
    "grave",
    "acute",
    "circumflex",
    "tilde",
    "macron",
    "breve",
    "dotaccent",
    "dieresis",
    "",
    "ring",
    "cedilla",
    "",
    "hungarumlaut",
    "ogonek",
    "caron",
    "emdash",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "AE",
    "",
    "ordfeminine",
    "",
    "",
    "",
    "",
    "Lslash",
    "Oslash",
    "OE",
    "ordmasculine",
    "",
    "",
    "",
    "",
    "",
    "ae",
    "",
    "",
    "",
    "dotlessi",
    "",
    "",
    "lslash",
    "oslash",
    "oe",
    "germandbls"
  ], Iu = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "space",
    "exclamsmall",
    "Hungarumlautsmall",
    "",
    "dollaroldstyle",
    "dollarsuperior",
    "ampersandsmall",
    "Acutesmall",
    "parenleftsuperior",
    "parenrightsuperior",
    "twodotenleader",
    "onedotenleader",
    "comma",
    "hyphen",
    "period",
    "fraction",
    "zerooldstyle",
    "oneoldstyle",
    "twooldstyle",
    "threeoldstyle",
    "fouroldstyle",
    "fiveoldstyle",
    "sixoldstyle",
    "sevenoldstyle",
    "eightoldstyle",
    "nineoldstyle",
    "colon",
    "semicolon",
    "commasuperior",
    "threequartersemdash",
    "periodsuperior",
    "questionsmall",
    "",
    "asuperior",
    "bsuperior",
    "centsuperior",
    "dsuperior",
    "esuperior",
    "",
    "",
    "isuperior",
    "",
    "",
    "lsuperior",
    "msuperior",
    "nsuperior",
    "osuperior",
    "",
    "",
    "rsuperior",
    "ssuperior",
    "tsuperior",
    "",
    "ff",
    "fi",
    "fl",
    "ffi",
    "ffl",
    "parenleftinferior",
    "",
    "parenrightinferior",
    "Circumflexsmall",
    "hyphensuperior",
    "Gravesmall",
    "Asmall",
    "Bsmall",
    "Csmall",
    "Dsmall",
    "Esmall",
    "Fsmall",
    "Gsmall",
    "Hsmall",
    "Ismall",
    "Jsmall",
    "Ksmall",
    "Lsmall",
    "Msmall",
    "Nsmall",
    "Osmall",
    "Psmall",
    "Qsmall",
    "Rsmall",
    "Ssmall",
    "Tsmall",
    "Usmall",
    "Vsmall",
    "Wsmall",
    "Xsmall",
    "Ysmall",
    "Zsmall",
    "colonmonetary",
    "onefitted",
    "rupiah",
    "Tildesmall",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "exclamdownsmall",
    "centoldstyle",
    "Lslashsmall",
    "",
    "",
    "Scaronsmall",
    "Zcaronsmall",
    "Dieresissmall",
    "Brevesmall",
    "Caronsmall",
    "",
    "Dotaccentsmall",
    "",
    "",
    "Macronsmall",
    "",
    "",
    "figuredash",
    "hypheninferior",
    "",
    "",
    "Ogoneksmall",
    "Ringsmall",
    "Cedillasmall",
    "",
    "",
    "",
    "onequarter",
    "onehalf",
    "threequarters",
    "questiondownsmall",
    "oneeighth",
    "threeeighths",
    "fiveeighths",
    "seveneighths",
    "onethird",
    "twothirds",
    "",
    "",
    "zerosuperior",
    "onesuperior",
    "twosuperior",
    "threesuperior",
    "foursuperior",
    "fivesuperior",
    "sixsuperior",
    "sevensuperior",
    "eightsuperior",
    "ninesuperior",
    "zeroinferior",
    "oneinferior",
    "twoinferior",
    "threeinferior",
    "fourinferior",
    "fiveinferior",
    "sixinferior",
    "seveninferior",
    "eightinferior",
    "nineinferior",
    "centinferior",
    "dollarinferior",
    "periodinferior",
    "commainferior",
    "Agravesmall",
    "Aacutesmall",
    "Acircumflexsmall",
    "Atildesmall",
    "Adieresissmall",
    "Aringsmall",
    "AEsmall",
    "Ccedillasmall",
    "Egravesmall",
    "Eacutesmall",
    "Ecircumflexsmall",
    "Edieresissmall",
    "Igravesmall",
    "Iacutesmall",
    "Icircumflexsmall",
    "Idieresissmall",
    "Ethsmall",
    "Ntildesmall",
    "Ogravesmall",
    "Oacutesmall",
    "Ocircumflexsmall",
    "Otildesmall",
    "Odieresissmall",
    "OEsmall",
    "Oslashsmall",
    "Ugravesmall",
    "Uacutesmall",
    "Ucircumflexsmall",
    "Udieresissmall",
    "Yacutesmall",
    "Thornsmall",
    "Ydieresissmall"
  ], It = [
    ".notdef",
    ".null",
    "nonmarkingreturn",
    "space",
    "exclam",
    "quotedbl",
    "numbersign",
    "dollar",
    "percent",
    "ampersand",
    "quotesingle",
    "parenleft",
    "parenright",
    "asterisk",
    "plus",
    "comma",
    "hyphen",
    "period",
    "slash",
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "colon",
    "semicolon",
    "less",
    "equal",
    "greater",
    "question",
    "at",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "bracketleft",
    "backslash",
    "bracketright",
    "asciicircum",
    "underscore",
    "grave",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "braceleft",
    "bar",
    "braceright",
    "asciitilde",
    "Adieresis",
    "Aring",
    "Ccedilla",
    "Eacute",
    "Ntilde",
    "Odieresis",
    "Udieresis",
    "aacute",
    "agrave",
    "acircumflex",
    "adieresis",
    "atilde",
    "aring",
    "ccedilla",
    "eacute",
    "egrave",
    "ecircumflex",
    "edieresis",
    "iacute",
    "igrave",
    "icircumflex",
    "idieresis",
    "ntilde",
    "oacute",
    "ograve",
    "ocircumflex",
    "odieresis",
    "otilde",
    "uacute",
    "ugrave",
    "ucircumflex",
    "udieresis",
    "dagger",
    "degree",
    "cent",
    "sterling",
    "section",
    "bullet",
    "paragraph",
    "germandbls",
    "registered",
    "copyright",
    "trademark",
    "acute",
    "dieresis",
    "notequal",
    "AE",
    "Oslash",
    "infinity",
    "plusminus",
    "lessequal",
    "greaterequal",
    "yen",
    "mu",
    "partialdiff",
    "summation",
    "product",
    "pi",
    "integral",
    "ordfeminine",
    "ordmasculine",
    "Omega",
    "ae",
    "oslash",
    "questiondown",
    "exclamdown",
    "logicalnot",
    "radical",
    "florin",
    "approxequal",
    "Delta",
    "guillemotleft",
    "guillemotright",
    "ellipsis",
    "nonbreakingspace",
    "Agrave",
    "Atilde",
    "Otilde",
    "OE",
    "oe",
    "endash",
    "emdash",
    "quotedblleft",
    "quotedblright",
    "quoteleft",
    "quoteright",
    "divide",
    "lozenge",
    "ydieresis",
    "Ydieresis",
    "fraction",
    "currency",
    "guilsinglleft",
    "guilsinglright",
    "fi",
    "fl",
    "daggerdbl",
    "periodcentered",
    "quotesinglbase",
    "quotedblbase",
    "perthousand",
    "Acircumflex",
    "Ecircumflex",
    "Aacute",
    "Edieresis",
    "Egrave",
    "Iacute",
    "Icircumflex",
    "Idieresis",
    "Igrave",
    "Oacute",
    "Ocircumflex",
    "apple",
    "Ograve",
    "Uacute",
    "Ucircumflex",
    "Ugrave",
    "dotlessi",
    "circumflex",
    "tilde",
    "macron",
    "breve",
    "dotaccent",
    "ring",
    "cedilla",
    "hungarumlaut",
    "ogonek",
    "caron",
    "Lslash",
    "lslash",
    "Scaron",
    "scaron",
    "Zcaron",
    "zcaron",
    "brokenbar",
    "Eth",
    "eth",
    "Yacute",
    "yacute",
    "Thorn",
    "thorn",
    "minus",
    "multiply",
    "onesuperior",
    "twosuperior",
    "threesuperior",
    "onehalf",
    "onequarter",
    "threequarters",
    "franc",
    "Gbreve",
    "gbreve",
    "Idotaccent",
    "Scedilla",
    "scedilla",
    "Cacute",
    "cacute",
    "Ccaron",
    "ccaron",
    "dcroat"
  ];
  function ih(n) {
    this.font = n;
  }
  ih.prototype.charToGlyphIndex = function(n) {
    var e = n.codePointAt(0), t = this.font.glyphs;
    if (t) {
      for (var r = 0; r < t.length; r += 1)
        for (var i = t.get(r), s = 0; s < i.unicodes.length; s += 1)
          if (i.unicodes[s] === e)
            return r;
    }
    return null;
  };
  function sh(n) {
    this.cmap = n;
  }
  sh.prototype.charToGlyphIndex = function(n) {
    return this.cmap.glyphIndexMap[n.codePointAt(0)] || 0;
  };
  function qn(n, e) {
    this.encoding = n, this.charset = e;
  }
  qn.prototype.charToGlyphIndex = function(n) {
    var e = n.codePointAt(0), t = this.encoding[e];
    return this.charset.indexOf(t);
  };
  function Fs(n) {
    switch (n.version) {
      case 1:
        this.names = It.slice();
        break;
      case 2:
        this.names = new Array(n.numberOfGlyphs);
        for (var e = 0; e < n.numberOfGlyphs; e++)
          n.glyphNameIndex[e] < It.length ? this.names[e] = It[n.glyphNameIndex[e]] : this.names[e] = n.names[n.glyphNameIndex[e] - It.length];
        break;
      case 2.5:
        this.names = new Array(n.numberOfGlyphs);
        for (var t = 0; t < n.numberOfGlyphs; t++)
          this.names[t] = It[t + n.glyphNameIndex[t]];
        break;
      case 3:
        this.names = [];
        break;
      default:
        this.names = [];
        break;
    }
  }
  Fs.prototype.nameToGlyphIndex = function(n) {
    return this.names.indexOf(n);
  };
  Fs.prototype.glyphIndexToName = function(n) {
    return this.names[n];
  };
  function Pu(n) {
    for (var e, t = n.tables.cmap.glyphIndexMap, r = Object.keys(t), i = 0; i < r.length; i += 1) {
      var s = r[i], a = t[s];
      e = n.glyphs.get(a), e.addUnicode(parseInt(s));
    }
    for (var o = 0; o < n.glyphs.length; o += 1)
      e = n.glyphs.get(o), n.cffEncoding ? n.isCIDFont ? e.name = "gid" + o : e.name = n.cffEncoding.charset[o] : n.glyphNames.names && (e.name = n.glyphNames.glyphIndexToName(o));
  }
  function zu(n) {
    n._IndexToUnicodeMap = {};
    for (var e = n.tables.cmap.glyphIndexMap, t = Object.keys(e), r = 0; r < t.length; r += 1) {
      var i = t[r], s = e[i];
      n._IndexToUnicodeMap[s] === void 0 ? n._IndexToUnicodeMap[s] = {
        unicodes: [parseInt(i)]
      } : n._IndexToUnicodeMap[s].unicodes.push(parseInt(i));
    }
  }
  function Nu(n, e) {
    e.lowMemory ? zu(n) : Pu(n);
  }
  function Gu(n, e, t, r, i) {
    n.beginPath(), n.moveTo(e, t), n.lineTo(r, i), n.stroke();
  }
  var Ut = { line: Gu };
  function Hu(n, e) {
    var t = e || new pe();
    return {
      configurable: !0,
      get: function() {
        return typeof t == "function" && (t = t()), t;
      },
      set: function(r) {
        t = r;
      }
    };
  }
  function Re(n) {
    this.bindConstructorValues(n);
  }
  Re.prototype.bindConstructorValues = function(n) {
    this.index = n.index || 0, this.name = n.name || null, this.unicode = n.unicode || void 0, this.unicodes = n.unicodes || n.unicode !== void 0 ? [n.unicode] : [], "xMin" in n && (this.xMin = n.xMin), "yMin" in n && (this.yMin = n.yMin), "xMax" in n && (this.xMax = n.xMax), "yMax" in n && (this.yMax = n.yMax), "advanceWidth" in n && (this.advanceWidth = n.advanceWidth), Object.defineProperty(this, "path", Hu(this, n.path));
  };
  Re.prototype.addUnicode = function(n) {
    this.unicodes.length === 0 && (this.unicode = n), this.unicodes.push(n);
  };
  Re.prototype.getBoundingBox = function() {
    return this.path.getBoundingBox();
  };
  Re.prototype.getPath = function(n, e, t, r, i) {
    n = n !== void 0 ? n : 0, e = e !== void 0 ? e : 0, t = t !== void 0 ? t : 72;
    var s, a;
    r || (r = {});
    var o = r.xScale, h = r.yScale;
    if (r.hinting && i && i.hinting && (a = this.path && i.hinting.exec(this, t)), a)
      s = i.hinting.getCommands(a), n = Math.round(n), e = Math.round(e), o = h = 1;
    else {
      s = this.path.commands;
      var c = 1 / (this.path.unitsPerEm || 1e3) * t;
      o === void 0 && (o = c), h === void 0 && (h = c);
    }
    for (var u = new pe(), f = 0; f < s.length; f += 1) {
      var l = s[f];
      l.type === "M" ? u.moveTo(n + l.x * o, e + -l.y * h) : l.type === "L" ? u.lineTo(n + l.x * o, e + -l.y * h) : l.type === "Q" ? u.quadraticCurveTo(
        n + l.x1 * o,
        e + -l.y1 * h,
        n + l.x * o,
        e + -l.y * h
      ) : l.type === "C" ? u.curveTo(
        n + l.x1 * o,
        e + -l.y1 * h,
        n + l.x2 * o,
        e + -l.y2 * h,
        n + l.x * o,
        e + -l.y * h
      ) : l.type === "Z" && u.closePath();
    }
    return u;
  };
  Re.prototype.getContours = function() {
    if (this.points === void 0)
      return [];
    for (var n = [], e = [], t = 0; t < this.points.length; t += 1) {
      var r = this.points[t];
      e.push(r), r.lastPointOfContour && (n.push(e), e = []);
    }
    return G.argument(e.length === 0, "There are still points left in the current contour."), n;
  };
  Re.prototype.getMetrics = function() {
    for (var n = this.path.commands, e = [], t = [], r = 0; r < n.length; r += 1) {
      var i = n[r];
      i.type !== "Z" && (e.push(i.x), t.push(i.y)), (i.type === "Q" || i.type === "C") && (e.push(i.x1), t.push(i.y1)), i.type === "C" && (e.push(i.x2), t.push(i.y2));
    }
    var s = {
      xMin: Math.min.apply(null, e),
      yMin: Math.min.apply(null, t),
      xMax: Math.max.apply(null, e),
      yMax: Math.max.apply(null, t),
      leftSideBearing: this.leftSideBearing
    };
    return isFinite(s.xMin) || (s.xMin = 0), isFinite(s.xMax) || (s.xMax = this.advanceWidth), isFinite(s.yMin) || (s.yMin = 0), isFinite(s.yMax) || (s.yMax = 0), s.rightSideBearing = this.advanceWidth - s.leftSideBearing - (s.xMax - s.xMin), s;
  };
  Re.prototype.draw = function(n, e, t, r, i) {
    this.getPath(e, t, r, i).draw(n);
  };
  Re.prototype.drawPoints = function(n, e, t, r) {
    function i(f, l, p, g) {
      n.beginPath();
      for (var m = 0; m < f.length; m += 1)
        n.moveTo(l + f[m].x * g, p + f[m].y * g), n.arc(l + f[m].x * g, p + f[m].y * g, 2, 0, Math.PI * 2, !1);
      n.closePath(), n.fill();
    }
    e = e !== void 0 ? e : 0, t = t !== void 0 ? t : 0, r = r !== void 0 ? r : 24;
    for (var s = 1 / this.path.unitsPerEm * r, a = [], o = [], h = this.path, c = 0; c < h.commands.length; c += 1) {
      var u = h.commands[c];
      u.x !== void 0 && a.push({ x: u.x, y: -u.y }), u.x1 !== void 0 && o.push({ x: u.x1, y: -u.y1 }), u.x2 !== void 0 && o.push({ x: u.x2, y: -u.y2 });
    }
    n.fillStyle = "blue", i(a, e, t, s), n.fillStyle = "red", i(o, e, t, s);
  };
  Re.prototype.drawMetrics = function(n, e, t, r) {
    var i;
    e = e !== void 0 ? e : 0, t = t !== void 0 ? t : 0, r = r !== void 0 ? r : 24, i = 1 / this.path.unitsPerEm * r, n.lineWidth = 1, n.strokeStyle = "black", Ut.line(n, e, -1e4, e, 1e4), Ut.line(n, -1e4, t, 1e4, t);
    var s = this.xMin || 0, a = this.yMin || 0, o = this.xMax || 0, h = this.yMax || 0, c = this.advanceWidth || 0;
    n.strokeStyle = "blue", Ut.line(n, e + s * i, -1e4, e + s * i, 1e4), Ut.line(n, e + o * i, -1e4, e + o * i, 1e4), Ut.line(n, -1e4, t + -a * i, 1e4, t + -a * i), Ut.line(n, -1e4, t + -h * i, 1e4, t + -h * i), n.strokeStyle = "green", Ut.line(n, e + c * i, -1e4, e + c * i, 1e4);
  };
  function Mn(n, e, t) {
    Object.defineProperty(n, e, {
      get: function() {
        return n.path, n[t];
      },
      set: function(r) {
        n[t] = r;
      },
      enumerable: !0,
      configurable: !0
    });
  }
  function Ts(n, e) {
    if (this.font = n, this.glyphs = {}, Array.isArray(e))
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        r.path.unitsPerEm = n.unitsPerEm, this.glyphs[t] = r;
      }
    this.length = e && e.length || 0;
  }
  Ts.prototype.get = function(n) {
    if (this.glyphs[n] === void 0) {
      this.font._push(n), typeof this.glyphs[n] == "function" && (this.glyphs[n] = this.glyphs[n]());
      var e = this.glyphs[n], t = this.font._IndexToUnicodeMap[n];
      if (t)
        for (var r = 0; r < t.unicodes.length; r++)
          e.addUnicode(t.unicodes[r]);
      this.font.cffEncoding ? this.font.isCIDFont ? e.name = "gid" + n : e.name = this.font.cffEncoding.charset[n] : this.font.glyphNames.names && (e.name = this.font.glyphNames.glyphIndexToName(n)), this.glyphs[n].advanceWidth = this.font._hmtxTableData[n].advanceWidth, this.glyphs[n].leftSideBearing = this.font._hmtxTableData[n].leftSideBearing;
    } else
      typeof this.glyphs[n] == "function" && (this.glyphs[n] = this.glyphs[n]());
    return this.glyphs[n];
  };
  Ts.prototype.push = function(n, e) {
    this.glyphs[n] = e, this.length++;
  };
  function Wu(n, e) {
    return new Re({ index: e, font: n });
  }
  function qu(n, e, t, r, i, s) {
    return function() {
      var a = new Re({ index: e, font: n });
      return a.path = function() {
        t(a, r, i);
        var o = s(n.glyphs, a);
        return o.unitsPerEm = n.unitsPerEm, o;
      }, Mn(a, "xMin", "_xMin"), Mn(a, "xMax", "_xMax"), Mn(a, "yMin", "_yMin"), Mn(a, "yMax", "_yMax"), a;
    };
  }
  function Vu(n, e, t, r) {
    return function() {
      var i = new Re({ index: e, font: n });
      return i.path = function() {
        var s = t(n, i, r);
        return s.unitsPerEm = n.unitsPerEm, s;
      }, i;
    };
  }
  var et = { GlyphSet: Ts, glyphLoader: Wu, ttfGlyphLoader: qu, cffGlyphLoader: Vu };
  function ah(n, e) {
    if (n === e)
      return !0;
    if (Array.isArray(n) && Array.isArray(e)) {
      if (n.length !== e.length)
        return !1;
      for (var t = 0; t < n.length; t += 1)
        if (!ah(n[t], e[t]))
          return !1;
      return !0;
    } else
      return !1;
  }
  function ls(n) {
    var e;
    return n.length < 1240 ? e = 107 : n.length < 33900 ? e = 1131 : e = 32768, e;
  }
  function wt(n, e, t) {
    var r = [], i = [], s = z.getCard16(n, e), a, o;
    if (s !== 0) {
      var h = z.getByte(n, e + 2);
      a = e + (s + 1) * h + 2;
      for (var c = e + 3, u = 0; u < s + 1; u += 1)
        r.push(z.getOffset(n, c, h)), c += h;
      o = a + r[s];
    } else
      o = e + 2;
    for (var f = 0; f < r.length - 1; f += 1) {
      var l = z.getBytes(n, a + r[f], a + r[f + 1]);
      t && (l = t(l)), i.push(l);
    }
    return { objects: i, startOffset: e, endOffset: o };
  }
  function Xu(n, e) {
    var t = [], r = z.getCard16(n, e), i, s;
    if (r !== 0) {
      var a = z.getByte(n, e + 2);
      i = e + (r + 1) * a + 2;
      for (var o = e + 3, h = 0; h < r + 1; h += 1)
        t.push(z.getOffset(n, o, a)), o += a;
      s = i + t[r];
    } else
      s = e + 2;
    return { offsets: t, startOffset: e, endOffset: s };
  }
  function Yu(n, e, t, r, i) {
    var s = z.getCard16(t, r), a = 0;
    if (s !== 0) {
      var o = z.getByte(t, r + 2);
      a = r + (s + 1) * o + 2;
    }
    var h = z.getBytes(t, a + e[n], a + e[n + 1]);
    return h;
  }
  function Zu(n) {
    for (var e = "", t = 15, r = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"]; ; ) {
      var i = n.parseByte(), s = i >> 4, a = i & 15;
      if (s === t || (e += r[s], a === t))
        break;
      e += r[a];
    }
    return parseFloat(e);
  }
  function Ju(n, e) {
    var t, r, i, s;
    if (e === 28)
      return t = n.parseByte(), r = n.parseByte(), t << 8 | r;
    if (e === 29)
      return t = n.parseByte(), r = n.parseByte(), i = n.parseByte(), s = n.parseByte(), t << 24 | r << 16 | i << 8 | s;
    if (e === 30)
      return Zu(n);
    if (e >= 32 && e <= 246)
      return e - 139;
    if (e >= 247 && e <= 250)
      return t = n.parseByte(), (e - 247) * 256 + t + 108;
    if (e >= 251 && e <= 254)
      return t = n.parseByte(), -(e - 251) * 256 - t - 108;
    throw new Error("Invalid b0 " + e);
  }
  function $u(n) {
    for (var e = {}, t = 0; t < n.length; t += 1) {
      var r = n[t][0], i = n[t][1], s = void 0;
      if (i.length === 1 ? s = i[0] : s = i, e.hasOwnProperty(r) && !isNaN(e[r]))
        throw new Error("Object " + e + " already has key " + r);
      e[r] = s;
    }
    return e;
  }
  function oh(n, e, t) {
    e = e !== void 0 ? e : 0;
    var r = new z.Parser(n, e), i = [], s = [];
    for (t = t !== void 0 ? t : n.length; r.relativeOffset < t; ) {
      var a = r.parseByte();
      a <= 21 ? (a === 12 && (a = 1200 + r.parseByte()), i.push([a, s]), s = []) : s.push(Ju(r, a));
    }
    return $u(i);
  }
  function Br(n, e) {
    return e <= 390 ? e = _n[e] : e = n[e - 391], e;
  }
  function hh(n, e, t) {
    for (var r = {}, i, s = 0; s < e.length; s += 1) {
      var a = e[s];
      if (Array.isArray(a.type)) {
        var o = [];
        o.length = a.type.length;
        for (var h = 0; h < a.type.length; h++)
          i = n[a.op] !== void 0 ? n[a.op][h] : void 0, i === void 0 && (i = a.value !== void 0 && a.value[h] !== void 0 ? a.value[h] : null), a.type[h] === "SID" && (i = Br(t, i)), o[h] = i;
        r[a.name] = o;
      } else
        i = n[a.op], i === void 0 && (i = a.value !== void 0 ? a.value : null), a.type === "SID" && (i = Br(t, i)), r[a.name] = i;
    }
    return r;
  }
  function ju(n, e) {
    var t = {};
    return t.formatMajor = z.getCard8(n, e), t.formatMinor = z.getCard8(n, e + 1), t.size = z.getCard8(n, e + 2), t.offsetSize = z.getCard8(n, e + 3), t.startOffset = e, t.endOffset = e + 4, t;
  }
  var ch = [
    { name: "version", op: 0, type: "SID" },
    { name: "notice", op: 1, type: "SID" },
    { name: "copyright", op: 1200, type: "SID" },
    { name: "fullName", op: 2, type: "SID" },
    { name: "familyName", op: 3, type: "SID" },
    { name: "weight", op: 4, type: "SID" },
    { name: "isFixedPitch", op: 1201, type: "number", value: 0 },
    { name: "italicAngle", op: 1202, type: "number", value: 0 },
    { name: "underlinePosition", op: 1203, type: "number", value: -100 },
    { name: "underlineThickness", op: 1204, type: "number", value: 50 },
    { name: "paintType", op: 1205, type: "number", value: 0 },
    { name: "charstringType", op: 1206, type: "number", value: 2 },
    {
      name: "fontMatrix",
      op: 1207,
      type: ["real", "real", "real", "real", "real", "real"],
      value: [1e-3, 0, 0, 1e-3, 0, 0]
    },
    { name: "uniqueId", op: 13, type: "number" },
    { name: "fontBBox", op: 5, type: ["number", "number", "number", "number"], value: [0, 0, 0, 0] },
    { name: "strokeWidth", op: 1208, type: "number", value: 0 },
    { name: "xuid", op: 14, type: [], value: null },
    { name: "charset", op: 15, type: "offset", value: 0 },
    { name: "encoding", op: 16, type: "offset", value: 0 },
    { name: "charStrings", op: 17, type: "offset", value: 0 },
    { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] },
    { name: "ros", op: 1230, type: ["SID", "SID", "number"] },
    { name: "cidFontVersion", op: 1231, type: "number", value: 0 },
    { name: "cidFontRevision", op: 1232, type: "number", value: 0 },
    { name: "cidFontType", op: 1233, type: "number", value: 0 },
    { name: "cidCount", op: 1234, type: "number", value: 8720 },
    { name: "uidBase", op: 1235, type: "number" },
    { name: "fdArray", op: 1236, type: "offset" },
    { name: "fdSelect", op: 1237, type: "offset" },
    { name: "fontName", op: 1238, type: "SID" }
  ], uh = [
    { name: "subrs", op: 19, type: "offset", value: 0 },
    { name: "defaultWidthX", op: 20, type: "number", value: 0 },
    { name: "nominalWidthX", op: 21, type: "number", value: 0 }
  ];
  function Qu(n, e) {
    var t = oh(n, 0, n.byteLength);
    return hh(t, ch, e);
  }
  function lh(n, e, t, r) {
    var i = oh(n, e, t);
    return hh(i, uh, r);
  }
  function _a(n, e, t, r) {
    for (var i = [], s = 0; s < t.length; s += 1) {
      var a = new DataView(new Uint8Array(t[s]).buffer), o = Qu(a, r);
      o._subrs = [], o._subrsBias = 0, o._defaultWidthX = 0, o._nominalWidthX = 0;
      var h = o.private[0], c = o.private[1];
      if (h !== 0 && c !== 0) {
        var u = lh(n, c + e, h, r);
        if (o._defaultWidthX = u.defaultWidthX, o._nominalWidthX = u.nominalWidthX, u.subrs !== 0) {
          var f = c + u.subrs, l = wt(n, f + e);
          o._subrs = l.objects, o._subrsBias = ls(o._subrs);
        }
        o._privateDict = u;
      }
      i.push(o);
    }
    return i;
  }
  function Ku(n, e, t, r) {
    var i, s, a = new z.Parser(n, e);
    t -= 1;
    var o = [".notdef"], h = a.parseCard8();
    if (h === 0)
      for (var c = 0; c < t; c += 1)
        i = a.parseSID(), o.push(Br(r, i));
    else if (h === 1)
      for (; o.length <= t; ) {
        i = a.parseSID(), s = a.parseCard8();
        for (var u = 0; u <= s; u += 1)
          o.push(Br(r, i)), i += 1;
      }
    else if (h === 2)
      for (; o.length <= t; ) {
        i = a.parseSID(), s = a.parseCard16();
        for (var f = 0; f <= s; f += 1)
          o.push(Br(r, i)), i += 1;
      }
    else
      throw new Error("Unknown charset format " + h);
    return o;
  }
  function el(n, e, t) {
    var r, i = {}, s = new z.Parser(n, e), a = s.parseCard8();
    if (a === 0)
      for (var o = s.parseCard8(), h = 0; h < o; h += 1)
        r = s.parseCard8(), i[r] = h;
    else if (a === 1) {
      var c = s.parseCard8();
      r = 1;
      for (var u = 0; u < c; u += 1)
        for (var f = s.parseCard8(), l = s.parseCard8(), p = f; p <= f + l; p += 1)
          i[p] = r, r += 1;
    } else
      throw new Error("Unknown encoding format " + a);
    return new qn(i, t);
  }
  function Oa(n, e, t) {
    var r, i, s, a, o = new pe(), h = [], c = 0, u = !1, f = !1, l = 0, p = 0, g, m, x, v;
    if (n.isCIDFont) {
      var w = n.tables.cff.topDict._fdSelect[e.index], b = n.tables.cff.topDict._fdArray[w];
      g = b._subrs, m = b._subrsBias, x = b._defaultWidthX, v = b._nominalWidthX;
    } else
      g = n.tables.cff.topDict._subrs, m = n.tables.cff.topDict._subrsBias, x = n.tables.cff.topDict._defaultWidthX, v = n.tables.cff.topDict._nominalWidthX;
    var F = x;
    function C(B, I) {
      f && o.closePath(), o.moveTo(B, I), f = !0;
    }
    function _() {
      var B;
      B = h.length % 2 !== 0, B && !u && (F = h.shift() + v), c += h.length >> 1, h.length = 0, u = !0;
    }
    function E(B) {
      for (var I, N, q, re, Y, Z, j, Q, te, ie, ne, ae, H = 0; H < B.length; ) {
        var $ = B[H];
        switch (H += 1, $) {
          case 1:
            _();
            break;
          case 3:
            _();
            break;
          case 4:
            h.length > 1 && !u && (F = h.shift() + v, u = !0), p += h.pop(), C(l, p);
            break;
          case 5:
            for (; h.length > 0; )
              l += h.shift(), p += h.shift(), o.lineTo(l, p);
            break;
          case 6:
            for (; h.length > 0 && (l += h.shift(), o.lineTo(l, p), h.length !== 0); )
              p += h.shift(), o.lineTo(l, p);
            break;
          case 7:
            for (; h.length > 0 && (p += h.shift(), o.lineTo(l, p), h.length !== 0); )
              l += h.shift(), o.lineTo(l, p);
            break;
          case 8:
            for (; h.length > 0; )
              r = l + h.shift(), i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), l = s + h.shift(), p = a + h.shift(), o.curveTo(r, i, s, a, l, p);
            break;
          case 10:
            Y = h.pop() + m, Z = g[Y], Z && E(Z);
            break;
          case 11:
            return;
          case 12:
            switch ($ = B[H], H += 1, $) {
              case 35:
                r = l + h.shift(), i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), j = s + h.shift(), Q = a + h.shift(), te = j + h.shift(), ie = Q + h.shift(), ne = te + h.shift(), ae = ie + h.shift(), l = ne + h.shift(), p = ae + h.shift(), h.shift(), o.curveTo(r, i, s, a, j, Q), o.curveTo(te, ie, ne, ae, l, p);
                break;
              case 34:
                r = l + h.shift(), i = p, s = r + h.shift(), a = i + h.shift(), j = s + h.shift(), Q = a, te = j + h.shift(), ie = a, ne = te + h.shift(), ae = p, l = ne + h.shift(), o.curveTo(r, i, s, a, j, Q), o.curveTo(te, ie, ne, ae, l, p);
                break;
              case 36:
                r = l + h.shift(), i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), j = s + h.shift(), Q = a, te = j + h.shift(), ie = a, ne = te + h.shift(), ae = ie + h.shift(), l = ne + h.shift(), o.curveTo(r, i, s, a, j, Q), o.curveTo(te, ie, ne, ae, l, p);
                break;
              case 37:
                r = l + h.shift(), i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), j = s + h.shift(), Q = a + h.shift(), te = j + h.shift(), ie = Q + h.shift(), ne = te + h.shift(), ae = ie + h.shift(), Math.abs(ne - l) > Math.abs(ae - p) ? l = ne + h.shift() : p = ae + h.shift(), o.curveTo(r, i, s, a, j, Q), o.curveTo(te, ie, ne, ae, l, p);
                break;
              default:
                console.log("Glyph " + e.index + ": unknown operator 1200" + $), h.length = 0;
            }
            break;
          case 14:
            h.length > 0 && !u && (F = h.shift() + v, u = !0), f && (o.closePath(), f = !1);
            break;
          case 18:
            _();
            break;
          case 19:
          case 20:
            _(), H += c + 7 >> 3;
            break;
          case 21:
            h.length > 2 && !u && (F = h.shift() + v, u = !0), p += h.pop(), l += h.pop(), C(l, p);
            break;
          case 22:
            h.length > 1 && !u && (F = h.shift() + v, u = !0), l += h.pop(), C(l, p);
            break;
          case 23:
            _();
            break;
          case 24:
            for (; h.length > 2; )
              r = l + h.shift(), i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), l = s + h.shift(), p = a + h.shift(), o.curveTo(r, i, s, a, l, p);
            l += h.shift(), p += h.shift(), o.lineTo(l, p);
            break;
          case 25:
            for (; h.length > 6; )
              l += h.shift(), p += h.shift(), o.lineTo(l, p);
            r = l + h.shift(), i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), l = s + h.shift(), p = a + h.shift(), o.curveTo(r, i, s, a, l, p);
            break;
          case 26:
            for (h.length % 2 && (l += h.shift()); h.length > 0; )
              r = l, i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), l = s, p = a + h.shift(), o.curveTo(r, i, s, a, l, p);
            break;
          case 27:
            for (h.length % 2 && (p += h.shift()); h.length > 0; )
              r = l + h.shift(), i = p, s = r + h.shift(), a = i + h.shift(), l = s + h.shift(), p = a, o.curveTo(r, i, s, a, l, p);
            break;
          case 28:
            I = B[H], N = B[H + 1], h.push((I << 24 | N << 16) >> 16), H += 2;
            break;
          case 29:
            Y = h.pop() + n.gsubrsBias, Z = n.gsubrs[Y], Z && E(Z);
            break;
          case 30:
            for (; h.length > 0 && (r = l, i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), l = s + h.shift(), p = a + (h.length === 1 ? h.shift() : 0), o.curveTo(r, i, s, a, l, p), h.length !== 0); )
              r = l + h.shift(), i = p, s = r + h.shift(), a = i + h.shift(), p = a + h.shift(), l = s + (h.length === 1 ? h.shift() : 0), o.curveTo(r, i, s, a, l, p);
            break;
          case 31:
            for (; h.length > 0 && (r = l + h.shift(), i = p, s = r + h.shift(), a = i + h.shift(), p = a + h.shift(), l = s + (h.length === 1 ? h.shift() : 0), o.curveTo(r, i, s, a, l, p), h.length !== 0); )
              r = l, i = p + h.shift(), s = r + h.shift(), a = i + h.shift(), l = s + h.shift(), p = a + (h.length === 1 ? h.shift() : 0), o.curveTo(r, i, s, a, l, p);
            break;
          default:
            $ < 32 ? console.log("Glyph " + e.index + ": unknown operator " + $) : $ < 247 ? h.push($ - 139) : $ < 251 ? (I = B[H], H += 1, h.push(($ - 247) * 256 + I + 108)) : $ < 255 ? (I = B[H], H += 1, h.push(-($ - 251) * 256 - I - 108)) : (I = B[H], N = B[H + 1], q = B[H + 2], re = B[H + 3], H += 4, h.push((I << 24 | N << 16 | q << 8 | re) / 65536));
        }
      }
    }
    return E(t), e.advanceWidth = F, o;
  }
  function tl(n, e, t, r) {
    var i = [], s, a = new z.Parser(n, e), o = a.parseCard8();
    if (o === 0)
      for (var h = 0; h < t; h++) {
        if (s = a.parseCard8(), s >= r)
          throw new Error("CFF table CID Font FDSelect has bad FD index value " + s + " (FD count " + r + ")");
        i.push(s);
      }
    else if (o === 3) {
      var c = a.parseCard16(), u = a.parseCard16();
      if (u !== 0)
        throw new Error("CFF Table CID Font FDSelect format 3 range has bad initial GID " + u);
      for (var f, l = 0; l < c; l++) {
        if (s = a.parseCard8(), f = a.parseCard16(), s >= r)
          throw new Error("CFF table CID Font FDSelect has bad FD index value " + s + " (FD count " + r + ")");
        if (f > t)
          throw new Error("CFF Table CID Font FDSelect format 3 range has bad GID " + f);
        for (; u < f; u++)
          i.push(s);
        u = f;
      }
      if (f !== t)
        throw new Error("CFF Table CID Font FDSelect format 3 range has bad final GID " + f);
    } else
      throw new Error("CFF Table CID Font FDSelect table has unsupported format " + o);
    return i;
  }
  function rl(n, e, t, r) {
    t.tables.cff = {};
    var i = ju(n, e), s = wt(n, i.endOffset, z.bytesToString), a = wt(n, s.endOffset), o = wt(n, a.endOffset, z.bytesToString), h = wt(n, o.endOffset);
    t.gsubrs = h.objects, t.gsubrsBias = ls(t.gsubrs);
    var c = _a(n, e, a.objects, o.objects);
    if (c.length !== 1)
      throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + c.length);
    var u = c[0];
    if (t.tables.cff.topDict = u, u._privateDict && (t.defaultWidthX = u._privateDict.defaultWidthX, t.nominalWidthX = u._privateDict.nominalWidthX), u.ros[0] !== void 0 && u.ros[1] !== void 0 && (t.isCIDFont = !0), t.isCIDFont) {
      var f = u.fdArray, l = u.fdSelect;
      if (f === 0 || l === 0)
        throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");
      f += e;
      var p = wt(n, f), g = _a(n, e, p.objects, o.objects);
      u._fdArray = g, l += e, u._fdSelect = tl(n, l, t.numGlyphs, g.length);
    }
    var m = e + u.private[1], x = lh(n, m, u.private[0], o.objects);
    if (t.defaultWidthX = x.defaultWidthX, t.nominalWidthX = x.nominalWidthX, x.subrs !== 0) {
      var v = m + x.subrs, w = wt(n, v);
      t.subrs = w.objects, t.subrsBias = ls(t.subrs);
    } else
      t.subrs = [], t.subrsBias = 0;
    var b;
    r.lowMemory ? (b = Xu(n, e + u.charStrings), t.nGlyphs = b.offsets.length) : (b = wt(n, e + u.charStrings), t.nGlyphs = b.objects.length);
    var F = Ku(n, e + u.charset, t.nGlyphs, o.objects);
    if (u.encoding === 0 ? t.cffEncoding = new qn(Du, F) : u.encoding === 1 ? t.cffEncoding = new qn(Iu, F) : t.cffEncoding = el(n, e + u.encoding, F), t.encoding = t.encoding || t.cffEncoding, t.glyphs = new et.GlyphSet(t), r.lowMemory)
      t._push = function(E) {
        var B = Yu(E, b.offsets, n, e + u.charStrings);
        t.glyphs.push(E, et.cffGlyphLoader(t, E, Oa, B));
      };
    else
      for (var C = 0; C < t.nGlyphs; C += 1) {
        var _ = b.objects[C];
        t.glyphs.push(C, et.cffGlyphLoader(t, C, Oa, _));
      }
  }
  function fh(n, e) {
    var t, r = _n.indexOf(n);
    return r >= 0 && (t = r), r = e.indexOf(n), r >= 0 ? t = r + _n.length : (t = _n.length + e.length, e.push(n)), t;
  }
  function nl() {
    return new D.Record("Header", [
      { name: "major", type: "Card8", value: 1 },
      { name: "minor", type: "Card8", value: 0 },
      { name: "hdrSize", type: "Card8", value: 4 },
      { name: "major", type: "Card8", value: 1 }
    ]);
  }
  function il(n) {
    var e = new D.Record("Name INDEX", [
      { name: "names", type: "INDEX", value: [] }
    ]);
    e.names = [];
    for (var t = 0; t < n.length; t += 1)
      e.names.push({ name: "name_" + t, type: "NAME", value: n[t] });
    return e;
  }
  function ph(n, e, t) {
    for (var r = {}, i = 0; i < n.length; i += 1) {
      var s = n[i], a = e[s.name];
      a !== void 0 && !ah(a, s.value) && (s.type === "SID" && (a = fh(a, t)), r[s.op] = { name: s.name, type: s.type, value: a });
    }
    return r;
  }
  function La(n, e) {
    var t = new D.Record("Top DICT", [
      { name: "dict", type: "DICT", value: {} }
    ]);
    return t.dict = ph(ch, n, e), t;
  }
  function Ua(n) {
    var e = new D.Record("Top DICT INDEX", [
      { name: "topDicts", type: "INDEX", value: [] }
    ]);
    return e.topDicts = [{ name: "topDict_0", type: "TABLE", value: n }], e;
  }
  function sl(n) {
    var e = new D.Record("String INDEX", [
      { name: "strings", type: "INDEX", value: [] }
    ]);
    e.strings = [];
    for (var t = 0; t < n.length; t += 1)
      e.strings.push({ name: "string_" + t, type: "STRING", value: n[t] });
    return e;
  }
  function al() {
    return new D.Record("Global Subr INDEX", [
      { name: "subrs", type: "INDEX", value: [] }
    ]);
  }
  function ol(n, e) {
    for (var t = new D.Record("Charsets", [
      { name: "format", type: "Card8", value: 0 }
    ]), r = 0; r < n.length; r += 1) {
      var i = n[r], s = fh(i, e);
      t.fields.push({ name: "glyph_" + r, type: "SID", value: s });
    }
    return t;
  }
  function hl(n) {
    var e = [], t = n.path;
    e.push({ name: "width", type: "NUMBER", value: n.advanceWidth });
    for (var r = 0, i = 0, s = 0; s < t.commands.length; s += 1) {
      var a = void 0, o = void 0, h = t.commands[s];
      if (h.type === "Q") {
        var c = 0.3333333333333333, u = 2 / 3;
        h = {
          type: "C",
          x: h.x,
          y: h.y,
          x1: Math.round(c * r + u * h.x1),
          y1: Math.round(c * i + u * h.y1),
          x2: Math.round(c * h.x + u * h.x1),
          y2: Math.round(c * h.y + u * h.y1)
        };
      }
      if (h.type === "M")
        a = Math.round(h.x - r), o = Math.round(h.y - i), e.push({ name: "dx", type: "NUMBER", value: a }), e.push({ name: "dy", type: "NUMBER", value: o }), e.push({ name: "rmoveto", type: "OP", value: 21 }), r = Math.round(h.x), i = Math.round(h.y);
      else if (h.type === "L")
        a = Math.round(h.x - r), o = Math.round(h.y - i), e.push({ name: "dx", type: "NUMBER", value: a }), e.push({ name: "dy", type: "NUMBER", value: o }), e.push({ name: "rlineto", type: "OP", value: 5 }), r = Math.round(h.x), i = Math.round(h.y);
      else if (h.type === "C") {
        var f = Math.round(h.x1 - r), l = Math.round(h.y1 - i), p = Math.round(h.x2 - h.x1), g = Math.round(h.y2 - h.y1);
        a = Math.round(h.x - h.x2), o = Math.round(h.y - h.y2), e.push({ name: "dx1", type: "NUMBER", value: f }), e.push({ name: "dy1", type: "NUMBER", value: l }), e.push({ name: "dx2", type: "NUMBER", value: p }), e.push({ name: "dy2", type: "NUMBER", value: g }), e.push({ name: "dx", type: "NUMBER", value: a }), e.push({ name: "dy", type: "NUMBER", value: o }), e.push({ name: "rrcurveto", type: "OP", value: 8 }), r = Math.round(h.x), i = Math.round(h.y);
      }
    }
    return e.push({ name: "endchar", type: "OP", value: 14 }), e;
  }
  function cl(n) {
    for (var e = new D.Record("CharStrings INDEX", [
      { name: "charStrings", type: "INDEX", value: [] }
    ]), t = 0; t < n.length; t += 1) {
      var r = n.get(t), i = hl(r);
      e.charStrings.push({ name: r.name, type: "CHARSTRING", value: i });
    }
    return e;
  }
  function ul(n, e) {
    var t = new D.Record("Private DICT", [
      { name: "dict", type: "DICT", value: {} }
    ]);
    return t.dict = ph(uh, n, e), t;
  }
  function ll(n, e) {
    for (var t = new D.Table("CFF ", [
      { name: "header", type: "RECORD" },
      { name: "nameIndex", type: "RECORD" },
      { name: "topDictIndex", type: "RECORD" },
      { name: "stringIndex", type: "RECORD" },
      { name: "globalSubrIndex", type: "RECORD" },
      { name: "charsets", type: "RECORD" },
      { name: "charStringsIndex", type: "RECORD" },
      { name: "privateDict", type: "RECORD" }
    ]), r = 1 / e.unitsPerEm, i = {
      version: e.version,
      fullName: e.fullName,
      familyName: e.familyName,
      weight: e.weightName,
      fontBBox: e.fontBBox || [0, 0, 0, 0],
      fontMatrix: [r, 0, 0, r, 0, 0],
      charset: 999,
      encoding: 0,
      charStrings: 999,
      private: [0, 999]
    }, s = {}, a = [], o, h = 1; h < n.length; h += 1)
      o = n.get(h), a.push(o.name);
    var c = [];
    t.header = nl(), t.nameIndex = il([e.postScriptName]);
    var u = La(i, c);
    t.topDictIndex = Ua(u), t.globalSubrIndex = al(), t.charsets = ol(a, c), t.charStringsIndex = cl(n), t.privateDict = ul(s, c), t.stringIndex = sl(c);
    var f = t.header.sizeOf() + t.nameIndex.sizeOf() + t.topDictIndex.sizeOf() + t.stringIndex.sizeOf() + t.globalSubrIndex.sizeOf();
    return i.charset = f, i.encoding = 0, i.charStrings = i.charset + t.charsets.sizeOf(), i.private[1] = i.charStrings + t.charStringsIndex.sizeOf(), u = La(i, c), t.topDictIndex = Ua(u), t;
  }
  var dh = { parse: rl, make: ll };
  function fl(n, e) {
    var t = {}, r = new z.Parser(n, e);
    return t.version = r.parseVersion(), t.fontRevision = Math.round(r.parseFixed() * 1e3) / 1e3, t.checkSumAdjustment = r.parseULong(), t.magicNumber = r.parseULong(), G.argument(t.magicNumber === 1594834165, "Font header has wrong magic number."), t.flags = r.parseUShort(), t.unitsPerEm = r.parseUShort(), t.created = r.parseLongDateTime(), t.modified = r.parseLongDateTime(), t.xMin = r.parseShort(), t.yMin = r.parseShort(), t.xMax = r.parseShort(), t.yMax = r.parseShort(), t.macStyle = r.parseUShort(), t.lowestRecPPEM = r.parseUShort(), t.fontDirectionHint = r.parseShort(), t.indexToLocFormat = r.parseShort(), t.glyphDataFormat = r.parseShort(), t;
  }
  function pl(n) {
    var e = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) + 2082844800, t = e;
    return n.createdTimestamp && (t = n.createdTimestamp + 2082844800), new D.Table("head", [
      { name: "version", type: "FIXED", value: 65536 },
      { name: "fontRevision", type: "FIXED", value: 65536 },
      { name: "checkSumAdjustment", type: "ULONG", value: 0 },
      { name: "magicNumber", type: "ULONG", value: 1594834165 },
      { name: "flags", type: "USHORT", value: 0 },
      { name: "unitsPerEm", type: "USHORT", value: 1e3 },
      { name: "created", type: "LONGDATETIME", value: t },
      { name: "modified", type: "LONGDATETIME", value: e },
      { name: "xMin", type: "SHORT", value: 0 },
      { name: "yMin", type: "SHORT", value: 0 },
      { name: "xMax", type: "SHORT", value: 0 },
      { name: "yMax", type: "SHORT", value: 0 },
      { name: "macStyle", type: "USHORT", value: 0 },
      { name: "lowestRecPPEM", type: "USHORT", value: 0 },
      { name: "fontDirectionHint", type: "SHORT", value: 2 },
      { name: "indexToLocFormat", type: "SHORT", value: 0 },
      { name: "glyphDataFormat", type: "SHORT", value: 0 }
    ], n);
  }
  var gh = { parse: fl, make: pl };
  function dl(n, e) {
    var t = {}, r = new z.Parser(n, e);
    return t.version = r.parseVersion(), t.ascender = r.parseShort(), t.descender = r.parseShort(), t.lineGap = r.parseShort(), t.advanceWidthMax = r.parseUShort(), t.minLeftSideBearing = r.parseShort(), t.minRightSideBearing = r.parseShort(), t.xMaxExtent = r.parseShort(), t.caretSlopeRise = r.parseShort(), t.caretSlopeRun = r.parseShort(), t.caretOffset = r.parseShort(), r.relativeOffset += 8, t.metricDataFormat = r.parseShort(), t.numberOfHMetrics = r.parseUShort(), t;
  }
  function gl(n) {
    return new D.Table("hhea", [
      { name: "version", type: "FIXED", value: 65536 },
      { name: "ascender", type: "FWORD", value: 0 },
      { name: "descender", type: "FWORD", value: 0 },
      { name: "lineGap", type: "FWORD", value: 0 },
      { name: "advanceWidthMax", type: "UFWORD", value: 0 },
      { name: "minLeftSideBearing", type: "FWORD", value: 0 },
      { name: "minRightSideBearing", type: "FWORD", value: 0 },
      { name: "xMaxExtent", type: "FWORD", value: 0 },
      { name: "caretSlopeRise", type: "SHORT", value: 1 },
      { name: "caretSlopeRun", type: "SHORT", value: 0 },
      { name: "caretOffset", type: "SHORT", value: 0 },
      { name: "reserved1", type: "SHORT", value: 0 },
      { name: "reserved2", type: "SHORT", value: 0 },
      { name: "reserved3", type: "SHORT", value: 0 },
      { name: "reserved4", type: "SHORT", value: 0 },
      { name: "metricDataFormat", type: "SHORT", value: 0 },
      { name: "numberOfHMetrics", type: "USHORT", value: 0 }
    ], n);
  }
  var yh = { parse: dl, make: gl };
  function yl(n, e, t, r, i) {
    for (var s, a, o = new z.Parser(n, e), h = 0; h < r; h += 1) {
      h < t && (s = o.parseUShort(), a = o.parseShort());
      var c = i.get(h);
      c.advanceWidth = s, c.leftSideBearing = a;
    }
  }
  function ml(n, e, t, r, i) {
    n._hmtxTableData = {};
    for (var s, a, o = new z.Parser(e, t), h = 0; h < i; h += 1)
      h < r && (s = o.parseUShort(), a = o.parseShort()), n._hmtxTableData[h] = {
        advanceWidth: s,
        leftSideBearing: a
      };
  }
  function vl(n, e, t, r, i, s, a) {
    a.lowMemory ? ml(n, e, t, r, i) : yl(e, t, r, i, s);
  }
  function xl(n) {
    for (var e = new D.Table("hmtx", []), t = 0; t < n.length; t += 1) {
      var r = n.get(t), i = r.advanceWidth || 0, s = r.leftSideBearing || 0;
      e.fields.push({ name: "advanceWidth_" + t, type: "USHORT", value: i }), e.fields.push({ name: "leftSideBearing_" + t, type: "SHORT", value: s });
    }
    return e;
  }
  var mh = { parse: vl, make: xl };
  function bl(n) {
    for (var e = new D.Table("ltag", [
      { name: "version", type: "ULONG", value: 1 },
      { name: "flags", type: "ULONG", value: 0 },
      { name: "numTags", type: "ULONG", value: n.length }
    ]), t = "", r = 12 + n.length * 4, i = 0; i < n.length; ++i) {
      var s = t.indexOf(n[i]);
      s < 0 && (s = t.length, t += n[i]), e.fields.push({ name: "offset " + i, type: "USHORT", value: r + s }), e.fields.push({ name: "length " + i, type: "USHORT", value: n[i].length });
    }
    return e.fields.push({ name: "stringPool", type: "CHARARRAY", value: t }), e;
  }
  function wl(n, e) {
    var t = new z.Parser(n, e), r = t.parseULong();
    G.argument(r === 1, "Unsupported ltag table version."), t.skip("uLong", 1);
    for (var i = t.parseULong(), s = [], a = 0; a < i; a++) {
      for (var o = "", h = e + t.parseUShort(), c = t.parseUShort(), u = h; u < h + c; ++u)
        o += String.fromCharCode(n.getInt8(u));
      s.push(o);
    }
    return s;
  }
  var vh = { make: bl, parse: wl };
  function Sl(n, e) {
    var t = {}, r = new z.Parser(n, e);
    return t.version = r.parseVersion(), t.numGlyphs = r.parseUShort(), t.version === 1 && (t.maxPoints = r.parseUShort(), t.maxContours = r.parseUShort(), t.maxCompositePoints = r.parseUShort(), t.maxCompositeContours = r.parseUShort(), t.maxZones = r.parseUShort(), t.maxTwilightPoints = r.parseUShort(), t.maxStorage = r.parseUShort(), t.maxFunctionDefs = r.parseUShort(), t.maxInstructionDefs = r.parseUShort(), t.maxStackElements = r.parseUShort(), t.maxSizeOfInstructions = r.parseUShort(), t.maxComponentElements = r.parseUShort(), t.maxComponentDepth = r.parseUShort()), t;
  }
  function Fl(n) {
    return new D.Table("maxp", [
      { name: "version", type: "FIXED", value: 20480 },
      { name: "numGlyphs", type: "USHORT", value: n }
    ]);
  }
  var xh = { parse: Sl, make: Fl }, bh = [
    "copyright",
    // 0
    "fontFamily",
    // 1
    "fontSubfamily",
    // 2
    "uniqueID",
    // 3
    "fullName",
    // 4
    "version",
    // 5
    "postScriptName",
    // 6
    "trademark",
    // 7
    "manufacturer",
    // 8
    "designer",
    // 9
    "description",
    // 10
    "manufacturerURL",
    // 11
    "designerURL",
    // 12
    "license",
    // 13
    "licenseURL",
    // 14
    "reserved",
    // 15
    "preferredFamily",
    // 16
    "preferredSubfamily",
    // 17
    "compatibleFullName",
    // 18
    "sampleText",
    // 19
    "postScriptFindFontName",
    // 20
    "wwsFamily",
    // 21
    "wwsSubfamily"
    // 22
  ], wh = {
    0: "en",
    1: "fr",
    2: "de",
    3: "it",
    4: "nl",
    5: "sv",
    6: "es",
    7: "da",
    8: "pt",
    9: "no",
    10: "he",
    11: "ja",
    12: "ar",
    13: "fi",
    14: "el",
    15: "is",
    16: "mt",
    17: "tr",
    18: "hr",
    19: "zh-Hant",
    20: "ur",
    21: "hi",
    22: "th",
    23: "ko",
    24: "lt",
    25: "pl",
    26: "hu",
    27: "es",
    28: "lv",
    29: "se",
    30: "fo",
    31: "fa",
    32: "ru",
    33: "zh",
    34: "nl-BE",
    35: "ga",
    36: "sq",
    37: "ro",
    38: "cz",
    39: "sk",
    40: "si",
    41: "yi",
    42: "sr",
    43: "mk",
    44: "bg",
    45: "uk",
    46: "be",
    47: "uz",
    48: "kk",
    49: "az-Cyrl",
    50: "az-Arab",
    51: "hy",
    52: "ka",
    53: "mo",
    54: "ky",
    55: "tg",
    56: "tk",
    57: "mn-CN",
    58: "mn",
    59: "ps",
    60: "ks",
    61: "ku",
    62: "sd",
    63: "bo",
    64: "ne",
    65: "sa",
    66: "mr",
    67: "bn",
    68: "as",
    69: "gu",
    70: "pa",
    71: "or",
    72: "ml",
    73: "kn",
    74: "ta",
    75: "te",
    76: "si",
    77: "my",
    78: "km",
    79: "lo",
    80: "vi",
    81: "id",
    82: "tl",
    83: "ms",
    84: "ms-Arab",
    85: "am",
    86: "ti",
    87: "om",
    88: "so",
    89: "sw",
    90: "rw",
    91: "rn",
    92: "ny",
    93: "mg",
    94: "eo",
    128: "cy",
    129: "eu",
    130: "ca",
    131: "la",
    132: "qu",
    133: "gn",
    134: "ay",
    135: "tt",
    136: "ug",
    137: "dz",
    138: "jv",
    139: "su",
    140: "gl",
    141: "af",
    142: "br",
    143: "iu",
    144: "gd",
    145: "gv",
    146: "ga",
    147: "to",
    148: "el-polyton",
    149: "kl",
    150: "az",
    151: "nn"
  }, Tl = {
    0: 0,
    // langEnglish → smRoman
    1: 0,
    // langFrench → smRoman
    2: 0,
    // langGerman → smRoman
    3: 0,
    // langItalian → smRoman
    4: 0,
    // langDutch → smRoman
    5: 0,
    // langSwedish → smRoman
    6: 0,
    // langSpanish → smRoman
    7: 0,
    // langDanish → smRoman
    8: 0,
    // langPortuguese → smRoman
    9: 0,
    // langNorwegian → smRoman
    10: 5,
    // langHebrew → smHebrew
    11: 1,
    // langJapanese → smJapanese
    12: 4,
    // langArabic → smArabic
    13: 0,
    // langFinnish → smRoman
    14: 6,
    // langGreek → smGreek
    15: 0,
    // langIcelandic → smRoman (modified)
    16: 0,
    // langMaltese → smRoman
    17: 0,
    // langTurkish → smRoman (modified)
    18: 0,
    // langCroatian → smRoman (modified)
    19: 2,
    // langTradChinese → smTradChinese
    20: 4,
    // langUrdu → smArabic
    21: 9,
    // langHindi → smDevanagari
    22: 21,
    // langThai → smThai
    23: 3,
    // langKorean → smKorean
    24: 29,
    // langLithuanian → smCentralEuroRoman
    25: 29,
    // langPolish → smCentralEuroRoman
    26: 29,
    // langHungarian → smCentralEuroRoman
    27: 29,
    // langEstonian → smCentralEuroRoman
    28: 29,
    // langLatvian → smCentralEuroRoman
    29: 0,
    // langSami → smRoman
    30: 0,
    // langFaroese → smRoman (modified)
    31: 4,
    // langFarsi → smArabic (modified)
    32: 7,
    // langRussian → smCyrillic
    33: 25,
    // langSimpChinese → smSimpChinese
    34: 0,
    // langFlemish → smRoman
    35: 0,
    // langIrishGaelic → smRoman (modified)
    36: 0,
    // langAlbanian → smRoman
    37: 0,
    // langRomanian → smRoman (modified)
    38: 29,
    // langCzech → smCentralEuroRoman
    39: 29,
    // langSlovak → smCentralEuroRoman
    40: 0,
    // langSlovenian → smRoman (modified)
    41: 5,
    // langYiddish → smHebrew
    42: 7,
    // langSerbian → smCyrillic
    43: 7,
    // langMacedonian → smCyrillic
    44: 7,
    // langBulgarian → smCyrillic
    45: 7,
    // langUkrainian → smCyrillic (modified)
    46: 7,
    // langByelorussian → smCyrillic
    47: 7,
    // langUzbek → smCyrillic
    48: 7,
    // langKazakh → smCyrillic
    49: 7,
    // langAzerbaijani → smCyrillic
    50: 4,
    // langAzerbaijanAr → smArabic
    51: 24,
    // langArmenian → smArmenian
    52: 23,
    // langGeorgian → smGeorgian
    53: 7,
    // langMoldavian → smCyrillic
    54: 7,
    // langKirghiz → smCyrillic
    55: 7,
    // langTajiki → smCyrillic
    56: 7,
    // langTurkmen → smCyrillic
    57: 27,
    // langMongolian → smMongolian
    58: 7,
    // langMongolianCyr → smCyrillic
    59: 4,
    // langPashto → smArabic
    60: 4,
    // langKurdish → smArabic
    61: 4,
    // langKashmiri → smArabic
    62: 4,
    // langSindhi → smArabic
    63: 26,
    // langTibetan → smTibetan
    64: 9,
    // langNepali → smDevanagari
    65: 9,
    // langSanskrit → smDevanagari
    66: 9,
    // langMarathi → smDevanagari
    67: 13,
    // langBengali → smBengali
    68: 13,
    // langAssamese → smBengali
    69: 11,
    // langGujarati → smGujarati
    70: 10,
    // langPunjabi → smGurmukhi
    71: 12,
    // langOriya → smOriya
    72: 17,
    // langMalayalam → smMalayalam
    73: 16,
    // langKannada → smKannada
    74: 14,
    // langTamil → smTamil
    75: 15,
    // langTelugu → smTelugu
    76: 18,
    // langSinhalese → smSinhalese
    77: 19,
    // langBurmese → smBurmese
    78: 20,
    // langKhmer → smKhmer
    79: 22,
    // langLao → smLao
    80: 30,
    // langVietnamese → smVietnamese
    81: 0,
    // langIndonesian → smRoman
    82: 0,
    // langTagalog → smRoman
    83: 0,
    // langMalayRoman → smRoman
    84: 4,
    // langMalayArabic → smArabic
    85: 28,
    // langAmharic → smEthiopic
    86: 28,
    // langTigrinya → smEthiopic
    87: 28,
    // langOromo → smEthiopic
    88: 0,
    // langSomali → smRoman
    89: 0,
    // langSwahili → smRoman
    90: 0,
    // langKinyarwanda → smRoman
    91: 0,
    // langRundi → smRoman
    92: 0,
    // langNyanja → smRoman
    93: 0,
    // langMalagasy → smRoman
    94: 0,
    // langEsperanto → smRoman
    128: 0,
    // langWelsh → smRoman (modified)
    129: 0,
    // langBasque → smRoman
    130: 0,
    // langCatalan → smRoman
    131: 0,
    // langLatin → smRoman
    132: 0,
    // langQuechua → smRoman
    133: 0,
    // langGuarani → smRoman
    134: 0,
    // langAymara → smRoman
    135: 7,
    // langTatar → smCyrillic
    136: 4,
    // langUighur → smArabic
    137: 26,
    // langDzongkha → smTibetan
    138: 0,
    // langJavaneseRom → smRoman
    139: 0,
    // langSundaneseRom → smRoman
    140: 0,
    // langGalician → smRoman
    141: 0,
    // langAfrikaans → smRoman
    142: 0,
    // langBreton → smRoman (modified)
    143: 28,
    // langInuktitut → smEthiopic (modified)
    144: 0,
    // langScottishGaelic → smRoman (modified)
    145: 0,
    // langManxGaelic → smRoman (modified)
    146: 0,
    // langIrishGaelicScript → smRoman (modified)
    147: 0,
    // langTongan → smRoman
    148: 6,
    // langGreekAncient → smRoman
    149: 0,
    // langGreenlandic → smRoman
    150: 0,
    // langAzerbaijanRoman → smRoman
    151: 0
    // langNynorsk → smRoman
  }, Sh = {
    1078: "af",
    1052: "sq",
    1156: "gsw",
    1118: "am",
    5121: "ar-DZ",
    15361: "ar-BH",
    3073: "ar",
    2049: "ar-IQ",
    11265: "ar-JO",
    13313: "ar-KW",
    12289: "ar-LB",
    4097: "ar-LY",
    6145: "ary",
    8193: "ar-OM",
    16385: "ar-QA",
    1025: "ar-SA",
    10241: "ar-SY",
    7169: "aeb",
    14337: "ar-AE",
    9217: "ar-YE",
    1067: "hy",
    1101: "as",
    2092: "az-Cyrl",
    1068: "az",
    1133: "ba",
    1069: "eu",
    1059: "be",
    2117: "bn",
    1093: "bn-IN",
    8218: "bs-Cyrl",
    5146: "bs",
    1150: "br",
    1026: "bg",
    1027: "ca",
    3076: "zh-HK",
    5124: "zh-MO",
    2052: "zh",
    4100: "zh-SG",
    1028: "zh-TW",
    1155: "co",
    1050: "hr",
    4122: "hr-BA",
    1029: "cs",
    1030: "da",
    1164: "prs",
    1125: "dv",
    2067: "nl-BE",
    1043: "nl",
    3081: "en-AU",
    10249: "en-BZ",
    4105: "en-CA",
    9225: "en-029",
    16393: "en-IN",
    6153: "en-IE",
    8201: "en-JM",
    17417: "en-MY",
    5129: "en-NZ",
    13321: "en-PH",
    18441: "en-SG",
    7177: "en-ZA",
    11273: "en-TT",
    2057: "en-GB",
    1033: "en",
    12297: "en-ZW",
    1061: "et",
    1080: "fo",
    1124: "fil",
    1035: "fi",
    2060: "fr-BE",
    3084: "fr-CA",
    1036: "fr",
    5132: "fr-LU",
    6156: "fr-MC",
    4108: "fr-CH",
    1122: "fy",
    1110: "gl",
    1079: "ka",
    3079: "de-AT",
    1031: "de",
    5127: "de-LI",
    4103: "de-LU",
    2055: "de-CH",
    1032: "el",
    1135: "kl",
    1095: "gu",
    1128: "ha",
    1037: "he",
    1081: "hi",
    1038: "hu",
    1039: "is",
    1136: "ig",
    1057: "id",
    1117: "iu",
    2141: "iu-Latn",
    2108: "ga",
    1076: "xh",
    1077: "zu",
    1040: "it",
    2064: "it-CH",
    1041: "ja",
    1099: "kn",
    1087: "kk",
    1107: "km",
    1158: "quc",
    1159: "rw",
    1089: "sw",
    1111: "kok",
    1042: "ko",
    1088: "ky",
    1108: "lo",
    1062: "lv",
    1063: "lt",
    2094: "dsb",
    1134: "lb",
    1071: "mk",
    2110: "ms-BN",
    1086: "ms",
    1100: "ml",
    1082: "mt",
    1153: "mi",
    1146: "arn",
    1102: "mr",
    1148: "moh",
    1104: "mn",
    2128: "mn-CN",
    1121: "ne",
    1044: "nb",
    2068: "nn",
    1154: "oc",
    1096: "or",
    1123: "ps",
    1045: "pl",
    1046: "pt",
    2070: "pt-PT",
    1094: "pa",
    1131: "qu-BO",
    2155: "qu-EC",
    3179: "qu",
    1048: "ro",
    1047: "rm",
    1049: "ru",
    9275: "smn",
    4155: "smj-NO",
    5179: "smj",
    3131: "se-FI",
    1083: "se",
    2107: "se-SE",
    8251: "sms",
    6203: "sma-NO",
    7227: "sms",
    1103: "sa",
    7194: "sr-Cyrl-BA",
    3098: "sr",
    6170: "sr-Latn-BA",
    2074: "sr-Latn",
    1132: "nso",
    1074: "tn",
    1115: "si",
    1051: "sk",
    1060: "sl",
    11274: "es-AR",
    16394: "es-BO",
    13322: "es-CL",
    9226: "es-CO",
    5130: "es-CR",
    7178: "es-DO",
    12298: "es-EC",
    17418: "es-SV",
    4106: "es-GT",
    18442: "es-HN",
    2058: "es-MX",
    19466: "es-NI",
    6154: "es-PA",
    15370: "es-PY",
    10250: "es-PE",
    20490: "es-PR",
    // Microsoft has defined two different language codes for
    // “Spanish with modern sorting” and “Spanish with traditional
    // sorting”. This makes sense for collation APIs, and it would be
    // possible to express this in BCP 47 language tags via Unicode
    // extensions (eg., es-u-co-trad is Spanish with traditional
    // sorting). However, for storing names in fonts, the distinction
    // does not make sense, so we give “es” in both cases.
    3082: "es",
    1034: "es",
    21514: "es-US",
    14346: "es-UY",
    8202: "es-VE",
    2077: "sv-FI",
    1053: "sv",
    1114: "syr",
    1064: "tg",
    2143: "tzm",
    1097: "ta",
    1092: "tt",
    1098: "te",
    1054: "th",
    1105: "bo",
    1055: "tr",
    1090: "tk",
    1152: "ug",
    1058: "uk",
    1070: "hsb",
    1056: "ur",
    2115: "uz-Cyrl",
    1091: "uz",
    1066: "vi",
    1106: "cy",
    1160: "wo",
    1157: "sah",
    1144: "ii",
    1130: "yo"
  };
  function Cl(n, e, t) {
    switch (n) {
      case 0:
        if (e === 65535)
          return "und";
        if (t)
          return t[e];
        break;
      case 1:
        return wh[e];
      case 3:
        return Sh[e];
    }
  }
  var fs = "utf-16", kl = {
    0: "macintosh",
    // smRoman
    1: "x-mac-japanese",
    // smJapanese
    2: "x-mac-chinesetrad",
    // smTradChinese
    3: "x-mac-korean",
    // smKorean
    6: "x-mac-greek",
    // smGreek
    7: "x-mac-cyrillic",
    // smCyrillic
    9: "x-mac-devanagai",
    // smDevanagari
    10: "x-mac-gurmukhi",
    // smGurmukhi
    11: "x-mac-gujarati",
    // smGujarati
    12: "x-mac-oriya",
    // smOriya
    13: "x-mac-bengali",
    // smBengali
    14: "x-mac-tamil",
    // smTamil
    15: "x-mac-telugu",
    // smTelugu
    16: "x-mac-kannada",
    // smKannada
    17: "x-mac-malayalam",
    // smMalayalam
    18: "x-mac-sinhalese",
    // smSinhalese
    19: "x-mac-burmese",
    // smBurmese
    20: "x-mac-khmer",
    // smKhmer
    21: "x-mac-thai",
    // smThai
    22: "x-mac-lao",
    // smLao
    23: "x-mac-georgian",
    // smGeorgian
    24: "x-mac-armenian",
    // smArmenian
    25: "x-mac-chinesesimp",
    // smSimpChinese
    26: "x-mac-tibetan",
    // smTibetan
    27: "x-mac-mongolian",
    // smMongolian
    28: "x-mac-ethiopic",
    // smEthiopic
    29: "x-mac-ce",
    // smCentralEuroRoman
    30: "x-mac-vietnamese",
    // smVietnamese
    31: "x-mac-extarabic"
    // smExtArabic
  }, Ml = {
    15: "x-mac-icelandic",
    // langIcelandic
    17: "x-mac-turkish",
    // langTurkish
    18: "x-mac-croatian",
    // langCroatian
    24: "x-mac-ce",
    // langLithuanian
    25: "x-mac-ce",
    // langPolish
    26: "x-mac-ce",
    // langHungarian
    27: "x-mac-ce",
    // langEstonian
    28: "x-mac-ce",
    // langLatvian
    30: "x-mac-icelandic",
    // langFaroese
    37: "x-mac-romanian",
    // langRomanian
    38: "x-mac-ce",
    // langCzech
    39: "x-mac-ce",
    // langSlovak
    40: "x-mac-ce",
    // langSlovenian
    143: "x-mac-inuit",
    // langInuktitut
    146: "x-mac-gaelic"
    // langIrishGaelicScript
  };
  function Fh(n, e, t) {
    switch (n) {
      case 0:
        return fs;
      case 1:
        return Ml[t] || kl[e];
      case 3:
        if (e === 1 || e === 10)
          return fs;
        break;
    }
  }
  function Al(n, e, t) {
    for (var r = {}, i = new z.Parser(n, e), s = i.parseUShort(), a = i.parseUShort(), o = i.offset + i.parseUShort(), h = 0; h < a; h++) {
      var c = i.parseUShort(), u = i.parseUShort(), f = i.parseUShort(), l = i.parseUShort(), p = bh[l] || l, g = i.parseUShort(), m = i.parseUShort(), x = Cl(c, f, t), v = Fh(c, u, f);
      if (v !== void 0 && x !== void 0) {
        var w = void 0;
        if (v === fs ? w = lr.UTF16(n, o + m, g) : w = lr.MACSTRING(n, o + m, g, v), w) {
          var b = r[p];
          b === void 0 && (b = r[p] = {}), b[x] = w;
        }
      }
    }
    return s === 1 && i.parseUShort(), r;
  }
  function Mi(n) {
    var e = {};
    for (var t in n)
      e[n[t]] = parseInt(t);
    return e;
  }
  function Ra(n, e, t, r, i, s) {
    return new D.Record("NameRecord", [
      { name: "platformID", type: "USHORT", value: n },
      { name: "encodingID", type: "USHORT", value: e },
      { name: "languageID", type: "USHORT", value: t },
      { name: "nameID", type: "USHORT", value: r },
      { name: "length", type: "USHORT", value: i },
      { name: "offset", type: "USHORT", value: s }
    ]);
  }
  function El(n, e) {
    var t = n.length, r = e.length - t + 1;
    e:
      for (var i = 0; i < r; i++)
        for (; i < r; i++) {
          for (var s = 0; s < t; s++)
            if (e[i + s] !== n[s])
              continue e;
          return i;
        }
    return -1;
  }
  function Da(n, e) {
    var t = El(n, e);
    if (t < 0) {
      t = e.length;
      for (var r = 0, i = n.length; r < i; ++r)
        e.push(n[r]);
    }
    return t;
  }
  function Bl(n, e) {
    var t, r = [], i = {}, s = Mi(bh);
    for (var a in n) {
      var o = s[a];
      if (o === void 0 && (o = a), t = parseInt(o), isNaN(t))
        throw new Error('Name table entry "' + a + '" does not exist, see nameTableNames for complete list.');
      i[t] = n[a], r.push(t);
    }
    for (var h = Mi(wh), c = Mi(Sh), u = [], f = [], l = 0; l < r.length; l++) {
      t = r[l];
      var p = i[t];
      for (var g in p) {
        var m = p[g], x = 1, v = h[g], w = Tl[v], b = Fh(x, w, v), F = R.MACSTRING(m, b);
        F === void 0 && (x = 0, v = e.indexOf(g), v < 0 && (v = e.length, e.push(g)), w = 4, F = R.UTF16(m));
        var C = Da(F, f);
        u.push(Ra(
          x,
          w,
          v,
          t,
          F.length,
          C
        ));
        var _ = c[g];
        if (_ !== void 0) {
          var E = R.UTF16(m), B = Da(E, f);
          u.push(Ra(
            3,
            1,
            _,
            t,
            E.length,
            B
          ));
        }
      }
    }
    u.sort(function(q, re) {
      return q.platformID - re.platformID || q.encodingID - re.encodingID || q.languageID - re.languageID || q.nameID - re.nameID;
    });
    for (var I = new D.Table("name", [
      { name: "format", type: "USHORT", value: 0 },
      { name: "count", type: "USHORT", value: u.length },
      { name: "stringOffset", type: "USHORT", value: 6 + u.length * 12 }
    ]), N = 0; N < u.length; N++)
      I.fields.push({ name: "record_" + N, type: "RECORD", value: u[N] });
    return I.fields.push({ name: "strings", type: "LITERAL", value: f }), I;
  }
  var Th = { parse: Al, make: Bl }, ps = [
    { begin: 0, end: 127 },
    // Basic Latin
    { begin: 128, end: 255 },
    // Latin-1 Supplement
    { begin: 256, end: 383 },
    // Latin Extended-A
    { begin: 384, end: 591 },
    // Latin Extended-B
    { begin: 592, end: 687 },
    // IPA Extensions
    { begin: 688, end: 767 },
    // Spacing Modifier Letters
    { begin: 768, end: 879 },
    // Combining Diacritical Marks
    { begin: 880, end: 1023 },
    // Greek and Coptic
    { begin: 11392, end: 11519 },
    // Coptic
    { begin: 1024, end: 1279 },
    // Cyrillic
    { begin: 1328, end: 1423 },
    // Armenian
    { begin: 1424, end: 1535 },
    // Hebrew
    { begin: 42240, end: 42559 },
    // Vai
    { begin: 1536, end: 1791 },
    // Arabic
    { begin: 1984, end: 2047 },
    // NKo
    { begin: 2304, end: 2431 },
    // Devanagari
    { begin: 2432, end: 2559 },
    // Bengali
    { begin: 2560, end: 2687 },
    // Gurmukhi
    { begin: 2688, end: 2815 },
    // Gujarati
    { begin: 2816, end: 2943 },
    // Oriya
    { begin: 2944, end: 3071 },
    // Tamil
    { begin: 3072, end: 3199 },
    // Telugu
    { begin: 3200, end: 3327 },
    // Kannada
    { begin: 3328, end: 3455 },
    // Malayalam
    { begin: 3584, end: 3711 },
    // Thai
    { begin: 3712, end: 3839 },
    // Lao
    { begin: 4256, end: 4351 },
    // Georgian
    { begin: 6912, end: 7039 },
    // Balinese
    { begin: 4352, end: 4607 },
    // Hangul Jamo
    { begin: 7680, end: 7935 },
    // Latin Extended Additional
    { begin: 7936, end: 8191 },
    // Greek Extended
    { begin: 8192, end: 8303 },
    // General Punctuation
    { begin: 8304, end: 8351 },
    // Superscripts And Subscripts
    { begin: 8352, end: 8399 },
    // Currency Symbol
    { begin: 8400, end: 8447 },
    // Combining Diacritical Marks For Symbols
    { begin: 8448, end: 8527 },
    // Letterlike Symbols
    { begin: 8528, end: 8591 },
    // Number Forms
    { begin: 8592, end: 8703 },
    // Arrows
    { begin: 8704, end: 8959 },
    // Mathematical Operators
    { begin: 8960, end: 9215 },
    // Miscellaneous Technical
    { begin: 9216, end: 9279 },
    // Control Pictures
    { begin: 9280, end: 9311 },
    // Optical Character Recognition
    { begin: 9312, end: 9471 },
    // Enclosed Alphanumerics
    { begin: 9472, end: 9599 },
    // Box Drawing
    { begin: 9600, end: 9631 },
    // Block Elements
    { begin: 9632, end: 9727 },
    // Geometric Shapes
    { begin: 9728, end: 9983 },
    // Miscellaneous Symbols
    { begin: 9984, end: 10175 },
    // Dingbats
    { begin: 12288, end: 12351 },
    // CJK Symbols And Punctuation
    { begin: 12352, end: 12447 },
    // Hiragana
    { begin: 12448, end: 12543 },
    // Katakana
    { begin: 12544, end: 12591 },
    // Bopomofo
    { begin: 12592, end: 12687 },
    // Hangul Compatibility Jamo
    { begin: 43072, end: 43135 },
    // Phags-pa
    { begin: 12800, end: 13055 },
    // Enclosed CJK Letters And Months
    { begin: 13056, end: 13311 },
    // CJK Compatibility
    { begin: 44032, end: 55215 },
    // Hangul Syllables
    { begin: 55296, end: 57343 },
    // Non-Plane 0 *
    { begin: 67840, end: 67871 },
    // Phoenicia
    { begin: 19968, end: 40959 },
    // CJK Unified Ideographs
    { begin: 57344, end: 63743 },
    // Private Use Area (plane 0)
    { begin: 12736, end: 12783 },
    // CJK Strokes
    { begin: 64256, end: 64335 },
    // Alphabetic Presentation Forms
    { begin: 64336, end: 65023 },
    // Arabic Presentation Forms-A
    { begin: 65056, end: 65071 },
    // Combining Half Marks
    { begin: 65040, end: 65055 },
    // Vertical Forms
    { begin: 65104, end: 65135 },
    // Small Form Variants
    { begin: 65136, end: 65279 },
    // Arabic Presentation Forms-B
    { begin: 65280, end: 65519 },
    // Halfwidth And Fullwidth Forms
    { begin: 65520, end: 65535 },
    // Specials
    { begin: 3840, end: 4095 },
    // Tibetan
    { begin: 1792, end: 1871 },
    // Syriac
    { begin: 1920, end: 1983 },
    // Thaana
    { begin: 3456, end: 3583 },
    // Sinhala
    { begin: 4096, end: 4255 },
    // Myanmar
    { begin: 4608, end: 4991 },
    // Ethiopic
    { begin: 5024, end: 5119 },
    // Cherokee
    { begin: 5120, end: 5759 },
    // Unified Canadian Aboriginal Syllabics
    { begin: 5760, end: 5791 },
    // Ogham
    { begin: 5792, end: 5887 },
    // Runic
    { begin: 6016, end: 6143 },
    // Khmer
    { begin: 6144, end: 6319 },
    // Mongolian
    { begin: 10240, end: 10495 },
    // Braille Patterns
    { begin: 40960, end: 42127 },
    // Yi Syllables
    { begin: 5888, end: 5919 },
    // Tagalog
    { begin: 66304, end: 66351 },
    // Old Italic
    { begin: 66352, end: 66383 },
    // Gothic
    { begin: 66560, end: 66639 },
    // Deseret
    { begin: 118784, end: 119039 },
    // Byzantine Musical Symbols
    { begin: 119808, end: 120831 },
    // Mathematical Alphanumeric Symbols
    { begin: 1044480, end: 1048573 },
    // Private Use (plane 15)
    { begin: 65024, end: 65039 },
    // Variation Selectors
    { begin: 917504, end: 917631 },
    // Tags
    { begin: 6400, end: 6479 },
    // Limbu
    { begin: 6480, end: 6527 },
    // Tai Le
    { begin: 6528, end: 6623 },
    // New Tai Lue
    { begin: 6656, end: 6687 },
    // Buginese
    { begin: 11264, end: 11359 },
    // Glagolitic
    { begin: 11568, end: 11647 },
    // Tifinagh
    { begin: 19904, end: 19967 },
    // Yijing Hexagram Symbols
    { begin: 43008, end: 43055 },
    // Syloti Nagri
    { begin: 65536, end: 65663 },
    // Linear B Syllabary
    { begin: 65856, end: 65935 },
    // Ancient Greek Numbers
    { begin: 66432, end: 66463 },
    // Ugaritic
    { begin: 66464, end: 66527 },
    // Old Persian
    { begin: 66640, end: 66687 },
    // Shavian
    { begin: 66688, end: 66735 },
    // Osmanya
    { begin: 67584, end: 67647 },
    // Cypriot Syllabary
    { begin: 68096, end: 68191 },
    // Kharoshthi
    { begin: 119552, end: 119647 },
    // Tai Xuan Jing Symbols
    { begin: 73728, end: 74751 },
    // Cuneiform
    { begin: 119648, end: 119679 },
    // Counting Rod Numerals
    { begin: 7040, end: 7103 },
    // Sundanese
    { begin: 7168, end: 7247 },
    // Lepcha
    { begin: 7248, end: 7295 },
    // Ol Chiki
    { begin: 43136, end: 43231 },
    // Saurashtra
    { begin: 43264, end: 43311 },
    // Kayah Li
    { begin: 43312, end: 43359 },
    // Rejang
    { begin: 43520, end: 43615 },
    // Cham
    { begin: 65936, end: 65999 },
    // Ancient Symbols
    { begin: 66e3, end: 66047 },
    // Phaistos Disc
    { begin: 66208, end: 66271 },
    // Carian
    { begin: 127024, end: 127135 }
    // Domino Tiles
  ];
  function _l(n) {
    for (var e = 0; e < ps.length; e += 1) {
      var t = ps[e];
      if (n >= t.begin && n < t.end)
        return e;
    }
    return -1;
  }
  function Ol(n, e) {
    var t = {}, r = new z.Parser(n, e);
    t.version = r.parseUShort(), t.xAvgCharWidth = r.parseShort(), t.usWeightClass = r.parseUShort(), t.usWidthClass = r.parseUShort(), t.fsType = r.parseUShort(), t.ySubscriptXSize = r.parseShort(), t.ySubscriptYSize = r.parseShort(), t.ySubscriptXOffset = r.parseShort(), t.ySubscriptYOffset = r.parseShort(), t.ySuperscriptXSize = r.parseShort(), t.ySuperscriptYSize = r.parseShort(), t.ySuperscriptXOffset = r.parseShort(), t.ySuperscriptYOffset = r.parseShort(), t.yStrikeoutSize = r.parseShort(), t.yStrikeoutPosition = r.parseShort(), t.sFamilyClass = r.parseShort(), t.panose = [];
    for (var i = 0; i < 10; i++)
      t.panose[i] = r.parseByte();
    return t.ulUnicodeRange1 = r.parseULong(), t.ulUnicodeRange2 = r.parseULong(), t.ulUnicodeRange3 = r.parseULong(), t.ulUnicodeRange4 = r.parseULong(), t.achVendID = String.fromCharCode(r.parseByte(), r.parseByte(), r.parseByte(), r.parseByte()), t.fsSelection = r.parseUShort(), t.usFirstCharIndex = r.parseUShort(), t.usLastCharIndex = r.parseUShort(), t.sTypoAscender = r.parseShort(), t.sTypoDescender = r.parseShort(), t.sTypoLineGap = r.parseShort(), t.usWinAscent = r.parseUShort(), t.usWinDescent = r.parseUShort(), t.version >= 1 && (t.ulCodePageRange1 = r.parseULong(), t.ulCodePageRange2 = r.parseULong()), t.version >= 2 && (t.sxHeight = r.parseShort(), t.sCapHeight = r.parseShort(), t.usDefaultChar = r.parseUShort(), t.usBreakChar = r.parseUShort(), t.usMaxContent = r.parseUShort()), t;
  }
  function Ll(n) {
    return new D.Table("OS/2", [
      { name: "version", type: "USHORT", value: 3 },
      { name: "xAvgCharWidth", type: "SHORT", value: 0 },
      { name: "usWeightClass", type: "USHORT", value: 0 },
      { name: "usWidthClass", type: "USHORT", value: 0 },
      { name: "fsType", type: "USHORT", value: 0 },
      { name: "ySubscriptXSize", type: "SHORT", value: 650 },
      { name: "ySubscriptYSize", type: "SHORT", value: 699 },
      { name: "ySubscriptXOffset", type: "SHORT", value: 0 },
      { name: "ySubscriptYOffset", type: "SHORT", value: 140 },
      { name: "ySuperscriptXSize", type: "SHORT", value: 650 },
      { name: "ySuperscriptYSize", type: "SHORT", value: 699 },
      { name: "ySuperscriptXOffset", type: "SHORT", value: 0 },
      { name: "ySuperscriptYOffset", type: "SHORT", value: 479 },
      { name: "yStrikeoutSize", type: "SHORT", value: 49 },
      { name: "yStrikeoutPosition", type: "SHORT", value: 258 },
      { name: "sFamilyClass", type: "SHORT", value: 0 },
      { name: "bFamilyType", type: "BYTE", value: 0 },
      { name: "bSerifStyle", type: "BYTE", value: 0 },
      { name: "bWeight", type: "BYTE", value: 0 },
      { name: "bProportion", type: "BYTE", value: 0 },
      { name: "bContrast", type: "BYTE", value: 0 },
      { name: "bStrokeVariation", type: "BYTE", value: 0 },
      { name: "bArmStyle", type: "BYTE", value: 0 },
      { name: "bLetterform", type: "BYTE", value: 0 },
      { name: "bMidline", type: "BYTE", value: 0 },
      { name: "bXHeight", type: "BYTE", value: 0 },
      { name: "ulUnicodeRange1", type: "ULONG", value: 0 },
      { name: "ulUnicodeRange2", type: "ULONG", value: 0 },
      { name: "ulUnicodeRange3", type: "ULONG", value: 0 },
      { name: "ulUnicodeRange4", type: "ULONG", value: 0 },
      { name: "achVendID", type: "CHARARRAY", value: "XXXX" },
      { name: "fsSelection", type: "USHORT", value: 0 },
      { name: "usFirstCharIndex", type: "USHORT", value: 0 },
      { name: "usLastCharIndex", type: "USHORT", value: 0 },
      { name: "sTypoAscender", type: "SHORT", value: 0 },
      { name: "sTypoDescender", type: "SHORT", value: 0 },
      { name: "sTypoLineGap", type: "SHORT", value: 0 },
      { name: "usWinAscent", type: "USHORT", value: 0 },
      { name: "usWinDescent", type: "USHORT", value: 0 },
      { name: "ulCodePageRange1", type: "ULONG", value: 0 },
      { name: "ulCodePageRange2", type: "ULONG", value: 0 },
      { name: "sxHeight", type: "SHORT", value: 0 },
      { name: "sCapHeight", type: "SHORT", value: 0 },
      { name: "usDefaultChar", type: "USHORT", value: 0 },
      { name: "usBreakChar", type: "USHORT", value: 0 },
      { name: "usMaxContext", type: "USHORT", value: 0 }
    ], n);
  }
  var ds = { parse: Ol, make: Ll, unicodeRanges: ps, getUnicodeRange: _l };
  function Ul(n, e) {
    var t = {}, r = new z.Parser(n, e);
    switch (t.version = r.parseVersion(), t.italicAngle = r.parseFixed(), t.underlinePosition = r.parseShort(), t.underlineThickness = r.parseShort(), t.isFixedPitch = r.parseULong(), t.minMemType42 = r.parseULong(), t.maxMemType42 = r.parseULong(), t.minMemType1 = r.parseULong(), t.maxMemType1 = r.parseULong(), t.version) {
      case 1:
        t.names = It.slice();
        break;
      case 2:
        t.numberOfGlyphs = r.parseUShort(), t.glyphNameIndex = new Array(t.numberOfGlyphs);
        for (var i = 0; i < t.numberOfGlyphs; i++)
          t.glyphNameIndex[i] = r.parseUShort();
        t.names = [];
        for (var s = 0; s < t.numberOfGlyphs; s++)
          if (t.glyphNameIndex[s] >= It.length) {
            var a = r.parseChar();
            t.names.push(r.parseString(a));
          }
        break;
      case 2.5:
        t.numberOfGlyphs = r.parseUShort(), t.offset = new Array(t.numberOfGlyphs);
        for (var o = 0; o < t.numberOfGlyphs; o++)
          t.offset[o] = r.parseChar();
        break;
    }
    return t;
  }
  function Rl() {
    return new D.Table("post", [
      { name: "version", type: "FIXED", value: 196608 },
      { name: "italicAngle", type: "FIXED", value: 0 },
      { name: "underlinePosition", type: "FWORD", value: 0 },
      { name: "underlineThickness", type: "FWORD", value: 0 },
      { name: "isFixedPitch", type: "ULONG", value: 0 },
      { name: "minMemType42", type: "ULONG", value: 0 },
      { name: "maxMemType42", type: "ULONG", value: 0 },
      { name: "minMemType1", type: "ULONG", value: 0 },
      { name: "maxMemType1", type: "ULONG", value: 0 }
    ]);
  }
  var Ch = { parse: Ul, make: Rl }, qe = new Array(9);
  qe[1] = function() {
    var e = this.offset + this.relativeOffset, t = this.parseUShort();
    if (t === 1)
      return {
        substFormat: 1,
        coverage: this.parsePointer(M.coverage),
        deltaGlyphId: this.parseUShort()
      };
    if (t === 2)
      return {
        substFormat: 2,
        coverage: this.parsePointer(M.coverage),
        substitute: this.parseOffset16List()
      };
    G.assert(!1, "0x" + e.toString(16) + ": lookup type 1 format must be 1 or 2.");
  };
  qe[2] = function() {
    var e = this.parseUShort();
    return G.argument(e === 1, "GSUB Multiple Substitution Subtable identifier-format must be 1"), {
      substFormat: e,
      coverage: this.parsePointer(M.coverage),
      sequences: this.parseListOfLists()
    };
  };
  qe[3] = function() {
    var e = this.parseUShort();
    return G.argument(e === 1, "GSUB Alternate Substitution Subtable identifier-format must be 1"), {
      substFormat: e,
      coverage: this.parsePointer(M.coverage),
      alternateSets: this.parseListOfLists()
    };
  };
  qe[4] = function() {
    var e = this.parseUShort();
    return G.argument(e === 1, "GSUB ligature table identifier-format must be 1"), {
      substFormat: e,
      coverage: this.parsePointer(M.coverage),
      ligatureSets: this.parseListOfLists(function() {
        return {
          ligGlyph: this.parseUShort(),
          components: this.parseUShortList(this.parseUShort() - 1)
        };
      })
    };
  };
  var hr = {
    sequenceIndex: M.uShort,
    lookupListIndex: M.uShort
  };
  qe[5] = function() {
    var e = this.offset + this.relativeOffset, t = this.parseUShort();
    if (t === 1)
      return {
        substFormat: t,
        coverage: this.parsePointer(M.coverage),
        ruleSets: this.parseListOfLists(function() {
          var s = this.parseUShort(), a = this.parseUShort();
          return {
            input: this.parseUShortList(s - 1),
            lookupRecords: this.parseRecordList(a, hr)
          };
        })
      };
    if (t === 2)
      return {
        substFormat: t,
        coverage: this.parsePointer(M.coverage),
        classDef: this.parsePointer(M.classDef),
        classSets: this.parseListOfLists(function() {
          var s = this.parseUShort(), a = this.parseUShort();
          return {
            classes: this.parseUShortList(s - 1),
            lookupRecords: this.parseRecordList(a, hr)
          };
        })
      };
    if (t === 3) {
      var r = this.parseUShort(), i = this.parseUShort();
      return {
        substFormat: t,
        coverages: this.parseList(r, M.pointer(M.coverage)),
        lookupRecords: this.parseRecordList(i, hr)
      };
    }
    G.assert(!1, "0x" + e.toString(16) + ": lookup type 5 format must be 1, 2 or 3.");
  };
  qe[6] = function() {
    var e = this.offset + this.relativeOffset, t = this.parseUShort();
    if (t === 1)
      return {
        substFormat: 1,
        coverage: this.parsePointer(M.coverage),
        chainRuleSets: this.parseListOfLists(function() {
          return {
            backtrack: this.parseUShortList(),
            input: this.parseUShortList(this.parseShort() - 1),
            lookahead: this.parseUShortList(),
            lookupRecords: this.parseRecordList(hr)
          };
        })
      };
    if (t === 2)
      return {
        substFormat: 2,
        coverage: this.parsePointer(M.coverage),
        backtrackClassDef: this.parsePointer(M.classDef),
        inputClassDef: this.parsePointer(M.classDef),
        lookaheadClassDef: this.parsePointer(M.classDef),
        chainClassSet: this.parseListOfLists(function() {
          return {
            backtrack: this.parseUShortList(),
            input: this.parseUShortList(this.parseShort() - 1),
            lookahead: this.parseUShortList(),
            lookupRecords: this.parseRecordList(hr)
          };
        })
      };
    if (t === 3)
      return {
        substFormat: 3,
        backtrackCoverage: this.parseList(M.pointer(M.coverage)),
        inputCoverage: this.parseList(M.pointer(M.coverage)),
        lookaheadCoverage: this.parseList(M.pointer(M.coverage)),
        lookupRecords: this.parseRecordList(hr)
      };
    G.assert(!1, "0x" + e.toString(16) + ": lookup type 6 format must be 1, 2 or 3.");
  };
  qe[7] = function() {
    var e = this.parseUShort();
    G.argument(e === 1, "GSUB Extension Substitution subtable identifier-format must be 1");
    var t = this.parseUShort(), r = new M(this.data, this.offset + this.parseULong());
    return {
      substFormat: 1,
      lookupType: t,
      extension: qe[t].call(r)
    };
  };
  qe[8] = function() {
    var e = this.parseUShort();
    return G.argument(e === 1, "GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"), {
      substFormat: e,
      coverage: this.parsePointer(M.coverage),
      backtrackCoverage: this.parseList(M.pointer(M.coverage)),
      lookaheadCoverage: this.parseList(M.pointer(M.coverage)),
      substitutes: this.parseUShortList()
    };
  };
  function Dl(n, e) {
    e = e || 0;
    var t = new M(n, e), r = t.parseVersion(1);
    return G.argument(r === 1 || r === 1.1, "Unsupported GSUB table version."), r === 1 ? {
      version: r,
      scripts: t.parseScriptList(),
      features: t.parseFeatureList(),
      lookups: t.parseLookupList(qe)
    } : {
      version: r,
      scripts: t.parseScriptList(),
      features: t.parseFeatureList(),
      lookups: t.parseLookupList(qe),
      variations: t.parseFeatureVariationsList()
    };
  }
  var dr = new Array(9);
  dr[1] = function(e) {
    return e.substFormat === 1 ? new D.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 1 },
      { name: "coverage", type: "TABLE", value: new D.Coverage(e.coverage) },
      { name: "deltaGlyphID", type: "USHORT", value: e.deltaGlyphId }
    ]) : new D.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 2 },
      { name: "coverage", type: "TABLE", value: new D.Coverage(e.coverage) }
    ].concat(D.ushortList("substitute", e.substitute)));
  };
  dr[2] = function(e) {
    return G.assert(e.substFormat === 1, "Lookup type 2 substFormat must be 1."), new D.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 1 },
      { name: "coverage", type: "TABLE", value: new D.Coverage(e.coverage) }
    ].concat(D.tableList("seqSet", e.sequences, function(t) {
      return new D.Table("sequenceSetTable", D.ushortList("sequence", t));
    })));
  };
  dr[3] = function(e) {
    return G.assert(e.substFormat === 1, "Lookup type 3 substFormat must be 1."), new D.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 1 },
      { name: "coverage", type: "TABLE", value: new D.Coverage(e.coverage) }
    ].concat(D.tableList("altSet", e.alternateSets, function(t) {
      return new D.Table("alternateSetTable", D.ushortList("alternate", t));
    })));
  };
  dr[4] = function(e) {
    return G.assert(e.substFormat === 1, "Lookup type 4 substFormat must be 1."), new D.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 1 },
      { name: "coverage", type: "TABLE", value: new D.Coverage(e.coverage) }
    ].concat(D.tableList("ligSet", e.ligatureSets, function(t) {
      return new D.Table("ligatureSetTable", D.tableList("ligature", t, function(r) {
        return new D.Table(
          "ligatureTable",
          [{ name: "ligGlyph", type: "USHORT", value: r.ligGlyph }].concat(D.ushortList("component", r.components, r.components.length + 1))
        );
      }));
    })));
  };
  dr[6] = function(e) {
    if (e.substFormat === 1) {
      var t = new D.Table("chainContextTable", [
        { name: "substFormat", type: "USHORT", value: e.substFormat },
        { name: "coverage", type: "TABLE", value: new D.Coverage(e.coverage) }
      ].concat(D.tableList("chainRuleSet", e.chainRuleSets, function(s) {
        return new D.Table("chainRuleSetTable", D.tableList("chainRule", s, function(a) {
          var o = D.ushortList("backtrackGlyph", a.backtrack, a.backtrack.length).concat(D.ushortList("inputGlyph", a.input, a.input.length + 1)).concat(D.ushortList("lookaheadGlyph", a.lookahead, a.lookahead.length)).concat(D.ushortList("substitution", [], a.lookupRecords.length));
          return a.lookupRecords.forEach(function(h, c) {
            o = o.concat({ name: "sequenceIndex" + c, type: "USHORT", value: h.sequenceIndex }).concat({ name: "lookupListIndex" + c, type: "USHORT", value: h.lookupListIndex });
          }), new D.Table("chainRuleTable", o);
        }));
      })));
      return t;
    } else if (e.substFormat === 2)
      G.assert(!1, "lookup type 6 format 2 is not yet supported.");
    else if (e.substFormat === 3) {
      var r = [
        { name: "substFormat", type: "USHORT", value: e.substFormat }
      ];
      r.push({ name: "backtrackGlyphCount", type: "USHORT", value: e.backtrackCoverage.length }), e.backtrackCoverage.forEach(function(s, a) {
        r.push({ name: "backtrackCoverage" + a, type: "TABLE", value: new D.Coverage(s) });
      }), r.push({ name: "inputGlyphCount", type: "USHORT", value: e.inputCoverage.length }), e.inputCoverage.forEach(function(s, a) {
        r.push({ name: "inputCoverage" + a, type: "TABLE", value: new D.Coverage(s) });
      }), r.push({ name: "lookaheadGlyphCount", type: "USHORT", value: e.lookaheadCoverage.length }), e.lookaheadCoverage.forEach(function(s, a) {
        r.push({ name: "lookaheadCoverage" + a, type: "TABLE", value: new D.Coverage(s) });
      }), r.push({ name: "substitutionCount", type: "USHORT", value: e.lookupRecords.length }), e.lookupRecords.forEach(function(s, a) {
        r = r.concat({ name: "sequenceIndex" + a, type: "USHORT", value: s.sequenceIndex }).concat({ name: "lookupListIndex" + a, type: "USHORT", value: s.lookupListIndex });
      });
      var i = new D.Table("chainContextTable", r);
      return i;
    }
    G.assert(!1, "lookup type 6 format must be 1, 2 or 3.");
  };
  function Il(n) {
    return new D.Table("GSUB", [
      { name: "version", type: "ULONG", value: 65536 },
      { name: "scripts", type: "TABLE", value: new D.ScriptList(n.scripts) },
      { name: "features", type: "TABLE", value: new D.FeatureList(n.features) },
      { name: "lookups", type: "TABLE", value: new D.LookupList(n.lookups, dr) }
    ]);
  }
  var kh = { parse: Dl, make: Il };
  function Pl(n, e) {
    var t = new z.Parser(n, e), r = t.parseULong();
    G.argument(r === 1, "Unsupported META table version."), t.parseULong(), t.parseULong();
    for (var i = t.parseULong(), s = {}, a = 0; a < i; a++) {
      var o = t.parseTag(), h = t.parseULong(), c = t.parseULong(), u = lr.UTF8(n, e + h, c);
      s[o] = u;
    }
    return s;
  }
  function zl(n) {
    var e = Object.keys(n).length, t = "", r = 16 + e * 12, i = new D.Table("meta", [
      { name: "version", type: "ULONG", value: 1 },
      { name: "flags", type: "ULONG", value: 0 },
      { name: "offset", type: "ULONG", value: r },
      { name: "numTags", type: "ULONG", value: e }
    ]);
    for (var s in n) {
      var a = t.length;
      t += n[s], i.fields.push({ name: "tag " + s, type: "TAG", value: s }), i.fields.push({ name: "offset " + s, type: "ULONG", value: r + a }), i.fields.push({ name: "length " + s, type: "ULONG", value: n[s].length });
    }
    return i.fields.push({ name: "stringPool", type: "CHARARRAY", value: t }), i;
  }
  var Mh = { parse: Pl, make: zl };
  function Ia(n) {
    return Math.log(n) / Math.log(2) | 0;
  }
  function Cs(n) {
    for (; n.length % 4 !== 0; )
      n.push(0);
    for (var e = 0, t = 0; t < n.length; t += 4)
      e += (n[t] << 24) + (n[t + 1] << 16) + (n[t + 2] << 8) + n[t + 3];
    return e %= Math.pow(2, 32), e;
  }
  function Pa(n, e, t, r) {
    return new D.Record("Table Record", [
      { name: "tag", type: "TAG", value: n !== void 0 ? n : "" },
      { name: "checkSum", type: "ULONG", value: e !== void 0 ? e : 0 },
      { name: "offset", type: "ULONG", value: t !== void 0 ? t : 0 },
      { name: "length", type: "ULONG", value: r !== void 0 ? r : 0 }
    ]);
  }
  function Ah(n) {
    var e = new D.Table("sfnt", [
      { name: "version", type: "TAG", value: "OTTO" },
      { name: "numTables", type: "USHORT", value: 0 },
      { name: "searchRange", type: "USHORT", value: 0 },
      { name: "entrySelector", type: "USHORT", value: 0 },
      { name: "rangeShift", type: "USHORT", value: 0 }
    ]);
    e.tables = n, e.numTables = n.length;
    var t = Math.pow(2, Ia(e.numTables));
    e.searchRange = 16 * t, e.entrySelector = Ia(t), e.rangeShift = e.numTables * 16 - e.searchRange;
    for (var r = [], i = [], s = e.sizeOf() + Pa().sizeOf() * e.numTables; s % 4 !== 0; )
      s += 1, i.push({ name: "padding", type: "BYTE", value: 0 });
    for (var a = 0; a < n.length; a += 1) {
      var o = n[a];
      G.argument(o.tableName.length === 4, "Table name" + o.tableName + " is invalid.");
      var h = o.sizeOf(), c = Pa(o.tableName, Cs(o.encode()), s, h);
      for (r.push({ name: c.tag + " Table Record", type: "RECORD", value: c }), i.push({ name: o.tableName + " table", type: "RECORD", value: o }), s += h, G.argument(!isNaN(s), "Something went wrong calculating the offset."); s % 4 !== 0; )
        s += 1, i.push({ name: "padding", type: "BYTE", value: 0 });
    }
    return r.sort(function(u, f) {
      return u.value.tag > f.value.tag ? 1 : -1;
    }), e.fields = e.fields.concat(r), e.fields = e.fields.concat(i), e;
  }
  function za(n, e, t) {
    for (var r = 0; r < e.length; r += 1) {
      var i = n.charToGlyphIndex(e[r]);
      if (i > 0) {
        var s = n.glyphs.get(i);
        return s.getMetrics();
      }
    }
    return t;
  }
  function Nl(n) {
    for (var e = 0, t = 0; t < n.length; t += 1)
      e += n[t];
    return e / n.length;
  }
  function Gl(n) {
    for (var e = [], t = [], r = [], i = [], s = [], a = [], o = [], h, c = 0, u = 0, f = 0, l = 0, p = 0, g = 0; g < n.glyphs.length; g += 1) {
      var m = n.glyphs.get(g), x = m.unicode | 0;
      if (isNaN(m.advanceWidth))
        throw new Error("Glyph " + m.name + " (" + g + "): advanceWidth is not a number.");
      (h > x || h === void 0) && x > 0 && (h = x), c < x && (c = x);
      var v = ds.getUnicodeRange(x);
      if (v < 32)
        u |= 1 << v;
      else if (v < 64)
        f |= 1 << v - 32;
      else if (v < 96)
        l |= 1 << v - 64;
      else if (v < 123)
        p |= 1 << v - 96;
      else
        throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
      if (m.name !== ".notdef") {
        var w = m.getMetrics();
        e.push(w.xMin), t.push(w.yMin), r.push(w.xMax), i.push(w.yMax), a.push(w.leftSideBearing), o.push(w.rightSideBearing), s.push(m.advanceWidth);
      }
    }
    var b = {
      xMin: Math.min.apply(null, e),
      yMin: Math.min.apply(null, t),
      xMax: Math.max.apply(null, r),
      yMax: Math.max.apply(null, i),
      advanceWidthMax: Math.max.apply(null, s),
      advanceWidthAvg: Nl(s),
      minLeftSideBearing: Math.min.apply(null, a),
      maxLeftSideBearing: Math.max.apply(null, a),
      minRightSideBearing: Math.min.apply(null, o)
    };
    b.ascender = n.ascender, b.descender = n.descender;
    var F = gh.make({
      flags: 3,
      // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
      unitsPerEm: n.unitsPerEm,
      xMin: b.xMin,
      yMin: b.yMin,
      xMax: b.xMax,
      yMax: b.yMax,
      lowestRecPPEM: 3,
      createdTimestamp: n.createdTimestamp
    }), C = yh.make({
      ascender: b.ascender,
      descender: b.descender,
      advanceWidthMax: b.advanceWidthMax,
      minLeftSideBearing: b.minLeftSideBearing,
      minRightSideBearing: b.minRightSideBearing,
      xMaxExtent: b.maxLeftSideBearing + (b.xMax - b.xMin),
      numberOfHMetrics: n.glyphs.length
    }), _ = xh.make(n.glyphs.length), E = ds.make(Object.assign({
      xAvgCharWidth: Math.round(b.advanceWidthAvg),
      usFirstCharIndex: h,
      usLastCharIndex: c,
      ulUnicodeRange1: u,
      ulUnicodeRange2: f,
      ulUnicodeRange3: l,
      ulUnicodeRange4: p,
      // See http://typophile.com/node/13081 for more info on vertical metrics.
      // We get metrics for typical characters (such as "x" for xHeight).
      // We provide some fallback characters if characters are unavailable: their
      // ordering was chosen experimentally.
      sTypoAscender: b.ascender,
      sTypoDescender: b.descender,
      sTypoLineGap: 0,
      usWinAscent: b.yMax,
      usWinDescent: Math.abs(b.yMin),
      ulCodePageRange1: 1,
      // FIXME: hard-code Latin 1 support for now
      sxHeight: za(n, "xyvw", { yMax: Math.round(b.ascender / 2) }).yMax,
      sCapHeight: za(n, "HIKLEFJMNTZBDPRAGOQSUVWXY", b).yMax,
      usDefaultChar: n.hasChar(" ") ? 32 : 0,
      // Use space as the default character, if available.
      usBreakChar: n.hasChar(" ") ? 32 : 0
      // Use space as the break character, if available.
    }, n.tables.os2)), B = mh.make(n.glyphs), I = nh.make(n.glyphs), N = n.getEnglishName("fontFamily"), q = n.getEnglishName("fontSubfamily"), re = N + " " + q, Y = n.getEnglishName("postScriptName");
    Y || (Y = N.replace(/\s/g, "") + "-" + q);
    var Z = {};
    for (var j in n.names)
      Z[j] = n.names[j];
    Z.uniqueID || (Z.uniqueID = { en: n.getEnglishName("manufacturer") + ":" + re }), Z.postScriptName || (Z.postScriptName = { en: Y }), Z.preferredFamily || (Z.preferredFamily = n.names.fontFamily), Z.preferredSubfamily || (Z.preferredSubfamily = n.names.fontSubfamily);
    var Q = [], te = Th.make(Z, Q), ie = Q.length > 0 ? vh.make(Q) : void 0, ne = Ch.make(), ae = dh.make(n.glyphs, {
      version: n.getEnglishName("version"),
      fullName: re,
      familyName: N,
      weightName: q,
      postScriptName: Y,
      unitsPerEm: n.unitsPerEm,
      fontBBox: [0, b.yMin, b.ascender, b.advanceWidthMax]
    }), H = n.metas && Object.keys(n.metas).length > 0 ? Mh.make(n.metas) : void 0, $ = [F, C, _, E, te, I, ne, ae, B];
    ie && $.push(ie), n.tables.gsub && $.push(kh.make(n.tables.gsub)), H && $.push(H);
    for (var Vt = Ah($), jr = Vt.encode(), Qr = Cs(jr), yr = Vt.fields, Kr = !1, pt = 0; pt < yr.length; pt += 1)
      if (yr[pt].name === "head table") {
        yr[pt].value.checkSumAdjustment = 2981146554 - Qr, Kr = !0;
        break;
      }
    if (!Kr)
      throw new Error("Could not find head table with checkSum to adjust.");
    return Vt;
  }
  var Hl = { make: Ah, fontToTable: Gl, computeCheckSum: Cs };
  function Ai(n, e) {
    for (var t = 0, r = n.length - 1; t <= r; ) {
      var i = t + r >>> 1, s = n[i].tag;
      if (s === e)
        return i;
      s < e ? t = i + 1 : r = i - 1;
    }
    return -t - 1;
  }
  function Na(n, e) {
    for (var t = 0, r = n.length - 1; t <= r; ) {
      var i = t + r >>> 1, s = n[i];
      if (s === e)
        return i;
      s < e ? t = i + 1 : r = i - 1;
    }
    return -t - 1;
  }
  function Ga(n, e) {
    for (var t, r = 0, i = n.length - 1; r <= i; ) {
      var s = r + i >>> 1;
      t = n[s];
      var a = t.start;
      if (a === e)
        return t;
      a < e ? r = s + 1 : i = s - 1;
    }
    if (r > 0)
      return t = n[r - 1], e > t.end ? 0 : t;
  }
  function Vr(n, e) {
    this.font = n, this.tableName = e;
  }
  Vr.prototype = {
    /**
     * Binary search an object by "tag" property
     * @instance
     * @function searchTag
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {string} tag
     * @return {number}
     */
    searchTag: Ai,
    /**
     * Binary search in a list of numbers
     * @instance
     * @function binSearch
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {number} value
     * @return {number}
     */
    binSearch: Na,
    /**
     * Get or create the Layout table (GSUB, GPOS etc).
     * @param  {boolean} create - Whether to create a new one.
     * @return {Object} The GSUB or GPOS table.
     */
    getTable: function(n) {
      var e = this.font.tables[this.tableName];
      return !e && n && (e = this.font.tables[this.tableName] = this.createDefaultTable()), e;
    },
    /**
     * Returns all scripts in the substitution table.
     * @instance
     * @return {Array}
     */
    getScriptNames: function() {
      var n = this.getTable();
      return n ? n.scripts.map(function(e) {
        return e.tag;
      }) : [];
    },
    /**
     * Returns the best bet for a script name.
     * Returns 'DFLT' if it exists.
     * If not, returns 'latn' if it exists.
     * If neither exist, returns undefined.
     */
    getDefaultScriptName: function() {
      var n = this.getTable();
      if (n) {
        for (var e = !1, t = 0; t < n.scripts.length; t++) {
          var r = n.scripts[t].tag;
          if (r === "DFLT")
            return r;
          r === "latn" && (e = !0);
        }
        if (e)
          return "latn";
      }
    },
    /**
     * Returns all LangSysRecords in the given script.
     * @instance
     * @param {string} [script='DFLT']
     * @param {boolean} create - forces the creation of this script table if it doesn't exist.
     * @return {Object} An object with tag and script properties.
     */
    getScriptTable: function(n, e) {
      var t = this.getTable(e);
      if (t) {
        n = n || "DFLT";
        var r = t.scripts, i = Ai(t.scripts, n);
        if (i >= 0)
          return r[i].script;
        if (e) {
          var s = {
            tag: n,
            script: {
              defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
              langSysRecords: []
            }
          };
          return r.splice(-1 - i, 0, s), s.script;
        }
      }
    },
    /**
     * Returns a language system table
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
     * @return {Object}
     */
    getLangSysTable: function(n, e, t) {
      var r = this.getScriptTable(n, t);
      if (r) {
        if (!e || e === "dflt" || e === "DFLT")
          return r.defaultLangSys;
        var i = Ai(r.langSysRecords, e);
        if (i >= 0)
          return r.langSysRecords[i].langSys;
        if (t) {
          var s = {
            tag: e,
            langSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] }
          };
          return r.langSysRecords.splice(-1 - i, 0, s), s.langSys;
        }
      }
    },
    /**
     * Get a specific feature table.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
     * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
     * @return {Object}
     */
    getFeatureTable: function(n, e, t, r) {
      var i = this.getLangSysTable(n, e, r);
      if (i) {
        for (var s, a = i.featureIndexes, o = this.font.tables[this.tableName].features, h = 0; h < a.length; h++)
          if (s = o[a[h]], s.tag === t)
            return s.feature;
        if (r) {
          var c = o.length;
          return G.assert(c === 0 || t >= o[c - 1].tag, "Features must be added in alphabetical order."), s = {
            tag: t,
            feature: { params: 0, lookupListIndexes: [] }
          }, o.push(s), a.push(c), s.feature;
        }
      }
    },
    /**
     * Get the lookup tables of a given type for a script/language/feature.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - 4-letter feature code
     * @param {number} lookupType - 1 to 9
     * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
     * @return {Object[]}
     */
    getLookupTables: function(n, e, t, r, i) {
      var s = this.getFeatureTable(n, e, t, i), a = [];
      if (s) {
        for (var o, h = s.lookupListIndexes, c = this.font.tables[this.tableName].lookups, u = 0; u < h.length; u++)
          o = c[h[u]], o.lookupType === r && a.push(o);
        if (a.length === 0 && i) {
          o = {
            lookupType: r,
            lookupFlag: 0,
            subtables: [],
            markFilteringSet: void 0
          };
          var f = c.length;
          return c.push(o), h.push(f), [o];
        }
      }
      return a;
    },
    /**
     * Find a glyph in a class definition table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
     * @param {object} classDefTable - an OpenType Layout class definition table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getGlyphClass: function(n, e) {
      switch (n.format) {
        case 1:
          return n.startGlyph <= e && e < n.startGlyph + n.classes.length ? n.classes[e - n.startGlyph] : 0;
        case 2:
          var t = Ga(n.ranges, e);
          return t ? t.classId : 0;
      }
    },
    /**
     * Find a glyph in a coverage table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
     * @param {object} coverageTable - an OpenType Layout coverage table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getCoverageIndex: function(n, e) {
      switch (n.format) {
        case 1:
          var t = Na(n.glyphs, e);
          return t >= 0 ? t : -1;
        case 2:
          var r = Ga(n.ranges, e);
          return r ? r.index + e - r.start : -1;
      }
    },
    /**
     * Returns the list of glyph indexes of a coverage table.
     * Format 1: the list is stored raw
     * Format 2: compact list as range records.
     * @instance
     * @param  {Object} coverageTable
     * @return {Array}
     */
    expandCoverage: function(n) {
      if (n.format === 1)
        return n.glyphs;
      for (var e = [], t = n.ranges, r = 0; r < t.length; r++)
        for (var i = t[r], s = i.start, a = i.end, o = s; o <= a; o++)
          e.push(o);
      return e;
    }
  };
  function Xr(n) {
    Vr.call(this, n, "gpos");
  }
  Xr.prototype = Vr.prototype;
  Xr.prototype.init = function() {
    var n = this.getDefaultScriptName();
    this.defaultKerningTables = this.getKerningTables(n);
  };
  Xr.prototype.getKerningValue = function(n, e, t) {
    for (var r = 0; r < n.length; r++)
      for (var i = n[r].subtables, s = 0; s < i.length; s++) {
        var a = i[s], o = this.getCoverageIndex(a.coverage, e);
        if (!(o < 0))
          switch (a.posFormat) {
            case 1:
              for (var h = a.pairSets[o], c = 0; c < h.length; c++) {
                var u = h[c];
                if (u.secondGlyph === t)
                  return u.value1 && u.value1.xAdvance || 0;
              }
              break;
            case 2:
              var f = this.getGlyphClass(a.classDef1, e), l = this.getGlyphClass(a.classDef2, t), p = a.classRecords[f][l];
              return p.value1 && p.value1.xAdvance || 0;
          }
      }
    return 0;
  };
  Xr.prototype.getKerningTables = function(n, e) {
    if (this.font.tables.gpos)
      return this.getLookupTables(n, e, "kern", 2);
  };
  function ke(n) {
    Vr.call(this, n, "gsub");
  }
  function Wl(n, e) {
    var t = n.length;
    if (t !== e.length)
      return !1;
    for (var r = 0; r < t; r++)
      if (n[r] !== e[r])
        return !1;
    return !0;
  }
  function ks(n, e, t) {
    for (var r = n.subtables, i = 0; i < r.length; i++) {
      var s = r[i];
      if (s.substFormat === e)
        return s;
    }
    if (t)
      return r.push(t), t;
  }
  ke.prototype = Vr.prototype;
  ke.prototype.createDefaultTable = function() {
    return {
      version: 1,
      scripts: [{
        tag: "DFLT",
        script: {
          defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
          langSysRecords: []
        }
      }],
      features: [],
      lookups: []
    };
  };
  ke.prototype.getSingle = function(n, e, t) {
    for (var r = [], i = this.getLookupTables(e, t, n, 1), s = 0; s < i.length; s++)
      for (var a = i[s].subtables, o = 0; o < a.length; o++) {
        var h = a[o], c = this.expandCoverage(h.coverage), u = void 0;
        if (h.substFormat === 1) {
          var f = h.deltaGlyphId;
          for (u = 0; u < c.length; u++) {
            var l = c[u];
            r.push({ sub: l, by: l + f });
          }
        } else {
          var p = h.substitute;
          for (u = 0; u < c.length; u++)
            r.push({ sub: c[u], by: p[u] });
        }
      }
    return r;
  };
  ke.prototype.getMultiple = function(n, e, t) {
    for (var r = [], i = this.getLookupTables(e, t, n, 2), s = 0; s < i.length; s++)
      for (var a = i[s].subtables, o = 0; o < a.length; o++) {
        var h = a[o], c = this.expandCoverage(h.coverage), u = void 0;
        for (u = 0; u < c.length; u++) {
          var f = c[u], l = h.sequences[u];
          r.push({ sub: f, by: l });
        }
      }
    return r;
  };
  ke.prototype.getAlternates = function(n, e, t) {
    for (var r = [], i = this.getLookupTables(e, t, n, 3), s = 0; s < i.length; s++)
      for (var a = i[s].subtables, o = 0; o < a.length; o++)
        for (var h = a[o], c = this.expandCoverage(h.coverage), u = h.alternateSets, f = 0; f < c.length; f++)
          r.push({ sub: c[f], by: u[f] });
    return r;
  };
  ke.prototype.getLigatures = function(n, e, t) {
    for (var r = [], i = this.getLookupTables(e, t, n, 4), s = 0; s < i.length; s++)
      for (var a = i[s].subtables, o = 0; o < a.length; o++)
        for (var h = a[o], c = this.expandCoverage(h.coverage), u = h.ligatureSets, f = 0; f < c.length; f++)
          for (var l = c[f], p = u[f], g = 0; g < p.length; g++) {
            var m = p[g];
            r.push({
              sub: [l].concat(m.components),
              by: m.ligGlyph
            });
          }
    return r;
  };
  ke.prototype.addSingle = function(n, e, t, r) {
    var i = this.getLookupTables(t, r, n, 1, !0)[0], s = ks(i, 2, {
      // lookup type 1 subtable, format 2, coverage format 1
      substFormat: 2,
      coverage: { format: 1, glyphs: [] },
      substitute: []
    });
    G.assert(s.coverage.format === 1, "Single: unable to modify coverage table format " + s.coverage.format);
    var a = e.sub, o = this.binSearch(s.coverage.glyphs, a);
    o < 0 && (o = -1 - o, s.coverage.glyphs.splice(o, 0, a), s.substitute.splice(o, 0, 0)), s.substitute[o] = e.by;
  };
  ke.prototype.addMultiple = function(n, e, t, r) {
    G.assert(e.by instanceof Array && e.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
    var i = this.getLookupTables(t, r, n, 2, !0)[0], s = ks(i, 1, {
      // lookup type 2 subtable, format 1, coverage format 1
      substFormat: 1,
      coverage: { format: 1, glyphs: [] },
      sequences: []
    });
    G.assert(s.coverage.format === 1, "Multiple: unable to modify coverage table format " + s.coverage.format);
    var a = e.sub, o = this.binSearch(s.coverage.glyphs, a);
    o < 0 && (o = -1 - o, s.coverage.glyphs.splice(o, 0, a), s.sequences.splice(o, 0, 0)), s.sequences[o] = e.by;
  };
  ke.prototype.addAlternate = function(n, e, t, r) {
    var i = this.getLookupTables(t, r, n, 3, !0)[0], s = ks(i, 1, {
      // lookup type 3 subtable, format 1, coverage format 1
      substFormat: 1,
      coverage: { format: 1, glyphs: [] },
      alternateSets: []
    });
    G.assert(s.coverage.format === 1, "Alternate: unable to modify coverage table format " + s.coverage.format);
    var a = e.sub, o = this.binSearch(s.coverage.glyphs, a);
    o < 0 && (o = -1 - o, s.coverage.glyphs.splice(o, 0, a), s.alternateSets.splice(o, 0, 0)), s.alternateSets[o] = e.by;
  };
  ke.prototype.addLigature = function(n, e, t, r) {
    var i = this.getLookupTables(t, r, n, 4, !0)[0], s = i.subtables[0];
    s || (s = {
      // lookup type 4 subtable, format 1, coverage format 1
      substFormat: 1,
      coverage: { format: 1, glyphs: [] },
      ligatureSets: []
    }, i.subtables[0] = s), G.assert(s.coverage.format === 1, "Ligature: unable to modify coverage table format " + s.coverage.format);
    var a = e.sub[0], o = e.sub.slice(1), h = {
      ligGlyph: e.by,
      components: o
    }, c = this.binSearch(s.coverage.glyphs, a);
    if (c >= 0) {
      for (var u = s.ligatureSets[c], f = 0; f < u.length; f++)
        if (Wl(u[f].components, o))
          return;
      u.push(h);
    } else
      c = -1 - c, s.coverage.glyphs.splice(c, 0, a), s.ligatureSets.splice(c, 0, [h]);
  };
  ke.prototype.getFeature = function(n, e, t) {
    if (/ss\d\d/.test(n))
      return this.getSingle(n, e, t);
    switch (n) {
      case "aalt":
      case "salt":
        return this.getSingle(n, e, t).concat(this.getAlternates(n, e, t));
      case "dlig":
      case "liga":
      case "rlig":
        return this.getLigatures(n, e, t);
      case "ccmp":
        return this.getMultiple(n, e, t).concat(this.getLigatures(n, e, t));
      case "stch":
        return this.getMultiple(n, e, t);
    }
  };
  ke.prototype.add = function(n, e, t, r) {
    if (/ss\d\d/.test(n))
      return this.addSingle(n, e, t, r);
    switch (n) {
      case "aalt":
      case "salt":
        return typeof e.by == "number" ? this.addSingle(n, e, t, r) : this.addAlternate(n, e, t, r);
      case "dlig":
      case "liga":
      case "rlig":
        return this.addLigature(n, e, t, r);
      case "ccmp":
        return e.by instanceof Array ? this.addMultiple(n, e, t, r) : this.addLigature(n, e, t, r);
    }
  };
  function ql() {
    return typeof window < "u";
  }
  function Vl(n) {
    for (var e = new Buffer(n.byteLength), t = new Uint8Array(n), r = 0; r < e.length; ++r)
      e[r] = t[r];
    return e;
  }
  function Fr(n, e) {
    if (!n)
      throw e;
  }
  function Ha(n, e, t, r, i) {
    var s;
    return (e & r) > 0 ? (s = n.parseByte(), e & i || (s = -s), s = t + s) : (e & i) > 0 ? s = t : s = t + n.parseShort(), s;
  }
  function Eh(n, e, t) {
    var r = new z.Parser(e, t);
    n.numberOfContours = r.parseShort(), n._xMin = r.parseShort(), n._yMin = r.parseShort(), n._xMax = r.parseShort(), n._yMax = r.parseShort();
    var i, s;
    if (n.numberOfContours > 0) {
      for (var a = n.endPointIndices = [], o = 0; o < n.numberOfContours; o += 1)
        a.push(r.parseUShort());
      n.instructionLength = r.parseUShort(), n.instructions = [];
      for (var h = 0; h < n.instructionLength; h += 1)
        n.instructions.push(r.parseByte());
      var c = a[a.length - 1] + 1;
      i = [];
      for (var u = 0; u < c; u += 1)
        if (s = r.parseByte(), i.push(s), (s & 8) > 0)
          for (var f = r.parseByte(), l = 0; l < f; l += 1)
            i.push(s), u += 1;
      if (G.argument(i.length === c, "Bad flags."), a.length > 0) {
        var p = [], g;
        if (c > 0) {
          for (var m = 0; m < c; m += 1)
            s = i[m], g = {}, g.onCurve = !!(s & 1), g.lastPointOfContour = a.indexOf(m) >= 0, p.push(g);
          for (var x = 0, v = 0; v < c; v += 1)
            s = i[v], g = p[v], g.x = Ha(r, s, x, 2, 16), x = g.x;
          for (var w = 0, b = 0; b < c; b += 1)
            s = i[b], g = p[b], g.y = Ha(r, s, w, 4, 32), w = g.y;
        }
        n.points = p;
      } else
        n.points = [];
    } else if (n.numberOfContours === 0)
      n.points = [];
    else {
      n.isComposite = !0, n.points = [], n.components = [];
      for (var F = !0; F; ) {
        i = r.parseUShort();
        var C = {
          glyphIndex: r.parseUShort(),
          xScale: 1,
          scale01: 0,
          scale10: 0,
          yScale: 1,
          dx: 0,
          dy: 0
        };
        (i & 1) > 0 ? (i & 2) > 0 ? (C.dx = r.parseShort(), C.dy = r.parseShort()) : C.matchedPoints = [r.parseUShort(), r.parseUShort()] : (i & 2) > 0 ? (C.dx = r.parseChar(), C.dy = r.parseChar()) : C.matchedPoints = [r.parseByte(), r.parseByte()], (i & 8) > 0 ? C.xScale = C.yScale = r.parseF2Dot14() : (i & 64) > 0 ? (C.xScale = r.parseF2Dot14(), C.yScale = r.parseF2Dot14()) : (i & 128) > 0 && (C.xScale = r.parseF2Dot14(), C.scale01 = r.parseF2Dot14(), C.scale10 = r.parseF2Dot14(), C.yScale = r.parseF2Dot14()), n.components.push(C), F = !!(i & 32);
      }
      if (i & 256) {
        n.instructionLength = r.parseUShort(), n.instructions = [];
        for (var _ = 0; _ < n.instructionLength; _ += 1)
          n.instructions.push(r.parseByte());
      }
    }
  }
  function Ei(n, e) {
    for (var t = [], r = 0; r < n.length; r += 1) {
      var i = n[r], s = {
        x: e.xScale * i.x + e.scale01 * i.y + e.dx,
        y: e.scale10 * i.x + e.yScale * i.y + e.dy,
        onCurve: i.onCurve,
        lastPointOfContour: i.lastPointOfContour
      };
      t.push(s);
    }
    return t;
  }
  function Xl(n) {
    for (var e = [], t = [], r = 0; r < n.length; r += 1) {
      var i = n[r];
      t.push(i), i.lastPointOfContour && (e.push(t), t = []);
    }
    return G.argument(t.length === 0, "There are still points left in the current contour."), e;
  }
  function Bh(n) {
    var e = new pe();
    if (!n)
      return e;
    for (var t = Xl(n), r = 0; r < t.length; ++r) {
      var i = t[r], s = null, a = i[i.length - 1], o = i[0];
      if (a.onCurve)
        e.moveTo(a.x, a.y);
      else if (o.onCurve)
        e.moveTo(o.x, o.y);
      else {
        var h = { x: (a.x + o.x) * 0.5, y: (a.y + o.y) * 0.5 };
        e.moveTo(h.x, h.y);
      }
      for (var c = 0; c < i.length; ++c)
        if (s = a, a = o, o = i[(c + 1) % i.length], a.onCurve)
          e.lineTo(a.x, a.y);
        else {
          var u = o;
          s.onCurve || ((a.x + s.x) * 0.5, (a.y + s.y) * 0.5), o.onCurve || (u = { x: (a.x + o.x) * 0.5, y: (a.y + o.y) * 0.5 }), e.quadraticCurveTo(a.x, a.y, u.x, u.y);
        }
      e.closePath();
    }
    return e;
  }
  function _h(n, e) {
    if (e.isComposite)
      for (var t = 0; t < e.components.length; t += 1) {
        var r = e.components[t], i = n.get(r.glyphIndex);
        if (i.getPath(), i.points) {
          var s = void 0;
          if (r.matchedPoints === void 0)
            s = Ei(i.points, r);
          else {
            if (r.matchedPoints[0] > e.points.length - 1 || r.matchedPoints[1] > i.points.length - 1)
              throw Error("Matched points out of range in " + e.name);
            var a = e.points[r.matchedPoints[0]], o = i.points[r.matchedPoints[1]], h = {
              xScale: r.xScale,
              scale01: r.scale01,
              scale10: r.scale10,
              yScale: r.yScale,
              dx: 0,
              dy: 0
            };
            o = Ei([o], h)[0], h.dx = a.x - o.x, h.dy = a.y - o.y, s = Ei(i.points, h);
          }
          e.points = e.points.concat(s);
        }
      }
    return Bh(e.points);
  }
  function Yl(n, e, t, r) {
    for (var i = new et.GlyphSet(r), s = 0; s < t.length - 1; s += 1) {
      var a = t[s], o = t[s + 1];
      a !== o ? i.push(s, et.ttfGlyphLoader(r, s, Eh, n, e + a, _h)) : i.push(s, et.glyphLoader(r, s));
    }
    return i;
  }
  function Zl(n, e, t, r) {
    var i = new et.GlyphSet(r);
    return r._push = function(s) {
      var a = t[s], o = t[s + 1];
      a !== o ? i.push(s, et.ttfGlyphLoader(r, s, Eh, n, e + a, _h)) : i.push(s, et.glyphLoader(r, s));
    }, i;
  }
  function Jl(n, e, t, r, i) {
    return i.lowMemory ? Zl(n, e, t, r) : Yl(n, e, t, r);
  }
  var Oh = { getPath: Bh, parse: Jl }, Lh, qt, Uh, gs;
  function Rh(n) {
    this.font = n, this.getCommands = function(e) {
      return Oh.getPath(e).commands;
    }, this._fpgmState = this._prepState = void 0, this._errorState = 0;
  }
  function $l(n) {
    return n;
  }
  function Dh(n) {
    return Math.sign(n) * Math.round(Math.abs(n));
  }
  function jl(n) {
    return Math.sign(n) * Math.round(Math.abs(n * 2)) / 2;
  }
  function Ql(n) {
    return Math.sign(n) * (Math.round(Math.abs(n) + 0.5) - 0.5);
  }
  function Kl(n) {
    return Math.sign(n) * Math.ceil(Math.abs(n));
  }
  function ef(n) {
    return Math.sign(n) * Math.floor(Math.abs(n));
  }
  var Ih = function(n) {
    var e = this.srPeriod, t = this.srPhase, r = this.srThreshold, i = 1;
    return n < 0 && (n = -n, i = -1), n += r - t, n = Math.trunc(n / e) * e, n += t, n < 0 ? t * i : n * i;
  }, Ke = {
    x: 1,
    y: 0,
    axis: "x",
    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function(n, e, t, r) {
      return (t ? n.xo : n.x) - (r ? e.xo : e.x);
    },
    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function(n, e, t, r) {
      var i, s, a, o, h, c, u;
      if (!r || r === this) {
        if (i = n.xo - e.xo, s = n.xo - t.xo, h = e.x - e.xo, c = t.x - t.xo, a = Math.abs(i), o = Math.abs(s), u = a + o, u === 0) {
          n.x = n.xo + (h + c) / 2;
          return;
        }
        n.x = n.xo + (h * o + c * a) / u;
        return;
      }
      if (i = r.distance(n, e, !0, !0), s = r.distance(n, t, !0, !0), h = r.distance(e, e, !1, !0), c = r.distance(t, t, !1, !0), a = Math.abs(i), o = Math.abs(s), u = a + o, u === 0) {
        Ke.setRelative(n, n, (h + c) / 2, r, !0);
        return;
      }
      Ke.setRelative(n, n, (h * o + c * a) / u, r, !0);
    },
    // Slope of line normal to this
    normalSlope: Number.NEGATIVE_INFINITY,
    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'.
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function(n, e, t, r, i) {
      if (!r || r === this) {
        n.x = (i ? e.xo : e.x) + t;
        return;
      }
      var s = i ? e.xo : e.x, a = i ? e.yo : e.y, o = s + t * r.x, h = a + t * r.y;
      n.x = o + (n.y - h) / r.normalSlope;
    },
    // Slope of vector line.
    slope: 0,
    // Touches the point p.
    touch: function(n) {
      n.xTouched = !0;
    },
    // Tests if a point p is touched.
    touched: function(n) {
      return n.xTouched;
    },
    // Untouches the point p.
    untouch: function(n) {
      n.xTouched = !1;
    }
  }, ct = {
    x: 0,
    y: 1,
    axis: "y",
    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function(n, e, t, r) {
      return (t ? n.yo : n.y) - (r ? e.yo : e.y);
    },
    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function(n, e, t, r) {
      var i, s, a, o, h, c, u;
      if (!r || r === this) {
        if (i = n.yo - e.yo, s = n.yo - t.yo, h = e.y - e.yo, c = t.y - t.yo, a = Math.abs(i), o = Math.abs(s), u = a + o, u === 0) {
          n.y = n.yo + (h + c) / 2;
          return;
        }
        n.y = n.yo + (h * o + c * a) / u;
        return;
      }
      if (i = r.distance(n, e, !0, !0), s = r.distance(n, t, !0, !0), h = r.distance(e, e, !1, !0), c = r.distance(t, t, !1, !0), a = Math.abs(i), o = Math.abs(s), u = a + o, u === 0) {
        ct.setRelative(n, n, (h + c) / 2, r, !0);
        return;
      }
      ct.setRelative(n, n, (h * o + c * a) / u, r, !0);
    },
    // Slope of line normal to this.
    normalSlope: 0,
    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function(n, e, t, r, i) {
      if (!r || r === this) {
        n.y = (i ? e.yo : e.y) + t;
        return;
      }
      var s = i ? e.xo : e.x, a = i ? e.yo : e.y, o = s + t * r.x, h = a + t * r.y;
      n.y = h + r.normalSlope * (n.x - o);
    },
    // Slope of vector line.
    slope: Number.POSITIVE_INFINITY,
    // Touches the point p.
    touch: function(n) {
      n.yTouched = !0;
    },
    // Tests if a point p is touched.
    touched: function(n) {
      return n.yTouched;
    },
    // Untouches the point p.
    untouch: function(n) {
      n.yTouched = !1;
    }
  };
  Object.freeze(Ke);
  Object.freeze(ct);
  function Yr(n, e) {
    this.x = n, this.y = e, this.axis = void 0, this.slope = e / n, this.normalSlope = -n / e, Object.freeze(this);
  }
  Yr.prototype.distance = function(n, e, t, r) {
    return this.x * Ke.distance(n, e, t, r) + this.y * ct.distance(n, e, t, r);
  };
  Yr.prototype.interpolate = function(n, e, t, r) {
    var i, s, a, o, h, c, u;
    if (a = r.distance(n, e, !0, !0), o = r.distance(n, t, !0, !0), i = r.distance(e, e, !1, !0), s = r.distance(t, t, !1, !0), h = Math.abs(a), c = Math.abs(o), u = h + c, u === 0) {
      this.setRelative(n, n, (i + s) / 2, r, !0);
      return;
    }
    this.setRelative(n, n, (i * c + s * h) / u, r, !0);
  };
  Yr.prototype.setRelative = function(n, e, t, r, i) {
    r = r || this;
    var s = i ? e.xo : e.x, a = i ? e.yo : e.y, o = s + t * r.x, h = a + t * r.y, c = r.normalSlope, u = this.slope, f = n.x, l = n.y;
    n.x = (u * f - c * o + h - l) / (u - c), n.y = u * (n.x - f) + l;
  };
  Yr.prototype.touch = function(n) {
    n.xTouched = !0, n.yTouched = !0;
  };
  function Zr(n, e) {
    var t = Math.sqrt(n * n + e * e);
    return n /= t, e /= t, n === 1 && e === 0 ? Ke : n === 0 && e === 1 ? ct : new Yr(n, e);
  }
  function ft(n, e, t, r) {
    this.x = this.xo = Math.round(n * 64) / 64, this.y = this.yo = Math.round(e * 64) / 64, this.lastPointOfContour = t, this.onCurve = r, this.prevPointOnContour = void 0, this.nextPointOnContour = void 0, this.xTouched = !1, this.yTouched = !1, Object.preventExtensions(this);
  }
  ft.prototype.nextTouched = function(n) {
    for (var e = this.nextPointOnContour; !n.touched(e) && e !== this; )
      e = e.nextPointOnContour;
    return e;
  };
  ft.prototype.prevTouched = function(n) {
    for (var e = this.prevPointOnContour; !n.touched(e) && e !== this; )
      e = e.prevPointOnContour;
    return e;
  };
  var Nr = Object.freeze(new ft(0, 0)), tf = {
    cvCutIn: 17 / 16,
    // control value cut in
    deltaBase: 9,
    deltaShift: 0.125,
    loop: 1,
    // loops some instructions
    minDis: 1,
    // minimum distance
    autoFlip: !0
  };
  function St(n, e) {
    switch (this.env = n, this.stack = [], this.prog = e, n) {
      case "glyf":
        this.zp0 = this.zp1 = this.zp2 = 1, this.rp0 = this.rp1 = this.rp2 = 0;
      case "prep":
        this.fv = this.pv = this.dpv = Ke, this.round = Dh;
    }
  }
  Rh.prototype.exec = function(n, e) {
    if (typeof e != "number")
      throw new Error("Point size is not a number!");
    if (!(this._errorState > 2)) {
      var t = this.font, r = this._prepState;
      if (!r || r.ppem !== e) {
        var i = this._fpgmState;
        if (!i) {
          St.prototype = tf, i = this._fpgmState = new St("fpgm", t.tables.fpgm), i.funcs = [], i.font = t, O.DEBUG && (console.log("---EXEC FPGM---"), i.step = -1);
          try {
            qt(i);
          } catch (c) {
            console.log("Hinting error in FPGM:" + c), this._errorState = 3;
            return;
          }
        }
        St.prototype = i, r = this._prepState = new St("prep", t.tables.prep), r.ppem = e;
        var s = t.tables.cvt;
        if (s)
          for (var a = r.cvt = new Array(s.length), o = e / t.unitsPerEm, h = 0; h < s.length; h++)
            a[h] = s[h] * o;
        else
          r.cvt = [];
        O.DEBUG && (console.log("---EXEC PREP---"), r.step = -1);
        try {
          qt(r);
        } catch (c) {
          this._errorState < 2 && console.log("Hinting error in PREP:" + c), this._errorState = 2;
        }
      }
      if (!(this._errorState > 1))
        try {
          return Uh(n, r);
        } catch (c) {
          this._errorState < 1 && (console.log("Hinting error:" + c), console.log("Note: further hinting errors are silenced")), this._errorState = 1;
          return;
        }
    }
  };
  Uh = function(n, e) {
    var t = e.ppem / e.font.unitsPerEm, r = t, i = n.components, s, a, o;
    if (St.prototype = e, !i)
      o = new St("glyf", n.instructions), O.DEBUG && (console.log("---EXEC GLYPH---"), o.step = -1), gs(n, o, t, r), a = o.gZone;
    else {
      var h = e.font;
      a = [], s = [];
      for (var c = 0; c < i.length; c++) {
        var u = i[c], f = h.glyphs.get(u.glyphIndex);
        o = new St("glyf", f.instructions), O.DEBUG && (console.log("---EXEC COMP " + c + "---"), o.step = -1), gs(f, o, t, r);
        for (var l = Math.round(u.dx * t), p = Math.round(u.dy * r), g = o.gZone, m = o.contours, x = 0; x < g.length; x++) {
          var v = g[x];
          v.xTouched = v.yTouched = !1, v.xo = v.x = v.x + l, v.yo = v.y = v.y + p;
        }
        var w = a.length;
        a.push.apply(a, g);
        for (var b = 0; b < m.length; b++)
          s.push(m[b] + w);
      }
      n.instructions && !o.inhibitGridFit && (o = new St("glyf", n.instructions), o.gZone = o.z0 = o.z1 = o.z2 = a, o.contours = s, a.push(
        new ft(0, 0),
        new ft(Math.round(n.advanceWidth * t), 0)
      ), O.DEBUG && (console.log("---EXEC COMPOSITE---"), o.step = -1), qt(o), a.length -= 2);
    }
    return a;
  };
  gs = function(n, e, t, r) {
    for (var i = n.points || [], s = i.length, a = e.gZone = e.z0 = e.z1 = e.z2 = [], o = e.contours = [], h, c = 0; c < s; c++)
      h = i[c], a[c] = new ft(
        h.x * t,
        h.y * r,
        h.lastPointOfContour,
        h.onCurve
      );
    for (var u, f, l = 0; l < s; l++)
      h = a[l], u || (u = h, o.push(l)), h.lastPointOfContour ? (h.nextPointOnContour = u, u.prevPointOnContour = h, u = void 0) : (f = a[l + 1], h.nextPointOnContour = f, f.prevPointOnContour = h);
    if (!e.inhibitGridFit) {
      if (O.DEBUG) {
        console.log("PROCESSING GLYPH", e.stack);
        for (var p = 0; p < s; p++)
          console.log(p, a[p].x, a[p].y);
      }
      if (a.push(
        new ft(0, 0),
        new ft(Math.round(n.advanceWidth * t), 0)
      ), qt(e), a.length -= 2, O.DEBUG) {
        console.log("FINISHED GLYPH", e.stack);
        for (var g = 0; g < s; g++)
          console.log(g, a[g].x, a[g].y);
      }
    }
  };
  qt = function(n) {
    var e = n.prog;
    if (e) {
      var t = e.length, r;
      for (n.ip = 0; n.ip < t; n.ip++) {
        if (O.DEBUG && n.step++, r = Lh[e[n.ip]], !r)
          throw new Error(
            "unknown instruction: 0x" + Number(e[n.ip]).toString(16)
          );
        r(n);
      }
    }
  };
  function Zn(n) {
    for (var e = n.tZone = new Array(n.gZone.length), t = 0; t < e.length; t++)
      e[t] = new ft(0, 0);
  }
  function Ph(n, e) {
    var t = n.prog, r = n.ip, i = 1, s;
    do
      if (s = t[++r], s === 88)
        i++;
      else if (s === 89)
        i--;
      else if (s === 64)
        r += t[r + 1] + 1;
      else if (s === 65)
        r += 2 * t[r + 1] + 1;
      else if (s >= 176 && s <= 183)
        r += s - 176 + 1;
      else if (s >= 184 && s <= 191)
        r += (s - 184 + 1) * 2;
      else if (e && i === 1 && s === 27)
        break;
    while (i > 0);
    n.ip = r;
  }
  function Wa(n, e) {
    O.DEBUG && console.log(e.step, "SVTCA[" + n.axis + "]"), e.fv = e.pv = e.dpv = n;
  }
  function qa(n, e) {
    O.DEBUG && console.log(e.step, "SPVTCA[" + n.axis + "]"), e.pv = e.dpv = n;
  }
  function Va(n, e) {
    O.DEBUG && console.log(e.step, "SFVTCA[" + n.axis + "]"), e.fv = n;
  }
  function Xa(n, e) {
    var t = e.stack, r = t.pop(), i = t.pop(), s = e.z2[r], a = e.z1[i];
    O.DEBUG && console.log("SPVTL[" + n + "]", r, i);
    var o, h;
    n ? (o = s.y - a.y, h = a.x - s.x) : (o = a.x - s.x, h = a.y - s.y), e.pv = e.dpv = Zr(o, h);
  }
  function Ya(n, e) {
    var t = e.stack, r = t.pop(), i = t.pop(), s = e.z2[r], a = e.z1[i];
    O.DEBUG && console.log("SFVTL[" + n + "]", r, i);
    var o, h;
    n ? (o = s.y - a.y, h = a.x - s.x) : (o = a.x - s.x, h = a.y - s.y), e.fv = Zr(o, h);
  }
  function rf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "SPVFS[]", t, r), n.pv = n.dpv = Zr(r, t);
  }
  function nf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "SPVFS[]", t, r), n.fv = Zr(r, t);
  }
  function sf(n) {
    var e = n.stack, t = n.pv;
    O.DEBUG && console.log(n.step, "GPV[]"), e.push(t.x * 16384), e.push(t.y * 16384);
  }
  function af(n) {
    var e = n.stack, t = n.fv;
    O.DEBUG && console.log(n.step, "GFV[]"), e.push(t.x * 16384), e.push(t.y * 16384);
  }
  function of(n) {
    n.fv = n.pv, O.DEBUG && console.log(n.step, "SFVTPV[]");
  }
  function hf(n) {
    var e = n.stack, t = e.pop(), r = e.pop(), i = e.pop(), s = e.pop(), a = e.pop(), o = n.z0, h = n.z1, c = o[t], u = o[r], f = h[i], l = h[s], p = n.z2[a];
    O.DEBUG && console.log("ISECT[], ", t, r, i, s, a);
    var g = c.x, m = c.y, x = u.x, v = u.y, w = f.x, b = f.y, F = l.x, C = l.y, _ = (g - x) * (b - C) - (m - v) * (w - F), E = g * v - m * x, B = w * C - b * F;
    p.x = (E * (w - F) - B * (g - x)) / _, p.y = (E * (b - C) - B * (m - v)) / _;
  }
  function cf(n) {
    n.rp0 = n.stack.pop(), O.DEBUG && console.log(n.step, "SRP0[]", n.rp0);
  }
  function uf(n) {
    n.rp1 = n.stack.pop(), O.DEBUG && console.log(n.step, "SRP1[]", n.rp1);
  }
  function lf(n) {
    n.rp2 = n.stack.pop(), O.DEBUG && console.log(n.step, "SRP2[]", n.rp2);
  }
  function ff(n) {
    var e = n.stack.pop();
    switch (O.DEBUG && console.log(n.step, "SZP0[]", e), n.zp0 = e, e) {
      case 0:
        n.tZone || Zn(n), n.z0 = n.tZone;
        break;
      case 1:
        n.z0 = n.gZone;
        break;
      default:
        throw new Error("Invalid zone pointer");
    }
  }
  function pf(n) {
    var e = n.stack.pop();
    switch (O.DEBUG && console.log(n.step, "SZP1[]", e), n.zp1 = e, e) {
      case 0:
        n.tZone || Zn(n), n.z1 = n.tZone;
        break;
      case 1:
        n.z1 = n.gZone;
        break;
      default:
        throw new Error("Invalid zone pointer");
    }
  }
  function df(n) {
    var e = n.stack.pop();
    switch (O.DEBUG && console.log(n.step, "SZP2[]", e), n.zp2 = e, e) {
      case 0:
        n.tZone || Zn(n), n.z2 = n.tZone;
        break;
      case 1:
        n.z2 = n.gZone;
        break;
      default:
        throw new Error("Invalid zone pointer");
    }
  }
  function gf(n) {
    var e = n.stack.pop();
    switch (O.DEBUG && console.log(n.step, "SZPS[]", e), n.zp0 = n.zp1 = n.zp2 = e, e) {
      case 0:
        n.tZone || Zn(n), n.z0 = n.z1 = n.z2 = n.tZone;
        break;
      case 1:
        n.z0 = n.z1 = n.z2 = n.gZone;
        break;
      default:
        throw new Error("Invalid zone pointer");
    }
  }
  function yf(n) {
    n.loop = n.stack.pop(), O.DEBUG && console.log(n.step, "SLOOP[]", n.loop);
  }
  function mf(n) {
    O.DEBUG && console.log(n.step, "RTG[]"), n.round = Dh;
  }
  function vf(n) {
    O.DEBUG && console.log(n.step, "RTHG[]"), n.round = Ql;
  }
  function xf(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "SMD[]", e), n.minDis = e / 64;
  }
  function bf(n) {
    O.DEBUG && console.log(n.step, "ELSE[]"), Ph(n, !1);
  }
  function wf(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "JMPR[]", e), n.ip += e - 1;
  }
  function Sf(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "SCVTCI[]", e), n.cvCutIn = e / 64;
  }
  function Ff(n) {
    var e = n.stack;
    O.DEBUG && console.log(n.step, "DUP[]"), e.push(e[e.length - 1]);
  }
  function Bi(n) {
    O.DEBUG && console.log(n.step, "POP[]"), n.stack.pop();
  }
  function Tf(n) {
    O.DEBUG && console.log(n.step, "CLEAR[]"), n.stack.length = 0;
  }
  function Cf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "SWAP[]"), e.push(t), e.push(r);
  }
  function kf(n) {
    var e = n.stack;
    O.DEBUG && console.log(n.step, "DEPTH[]"), e.push(e.length);
  }
  function Mf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "LOOPCALL[]", t, r);
    var i = n.ip, s = n.prog;
    n.prog = n.funcs[t];
    for (var a = 0; a < r; a++)
      qt(n), O.DEBUG && console.log(
        ++n.step,
        a + 1 < r ? "next loopcall" : "done loopcall",
        a
      );
    n.ip = i, n.prog = s;
  }
  function Af(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "CALL[]", e);
    var t = n.ip, r = n.prog;
    n.prog = n.funcs[e], qt(n), n.ip = t, n.prog = r, O.DEBUG && console.log(++n.step, "returning from", e);
  }
  function Ef(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "CINDEX[]", t), e.push(e[e.length - t]);
  }
  function Bf(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "MINDEX[]", t), e.push(e.splice(e.length - t, 1)[0]);
  }
  function _f(n) {
    if (n.env !== "fpgm")
      throw new Error("FDEF not allowed here");
    var e = n.stack, t = n.prog, r = n.ip, i = e.pop(), s = r;
    for (O.DEBUG && console.log(n.step, "FDEF[]", i); t[++r] !== 45; )
      ;
    n.ip = r, n.funcs[i] = t.slice(s + 1, r);
  }
  function Za(n, e) {
    var t = e.stack.pop(), r = e.z0[t], i = e.fv, s = e.pv;
    O.DEBUG && console.log(e.step, "MDAP[" + n + "]", t);
    var a = s.distance(r, Nr);
    n && (a = e.round(a)), i.setRelative(r, Nr, a, s), i.touch(r), e.rp0 = e.rp1 = t;
  }
  function Ja(n, e) {
    var t = e.z2, r = t.length - 2, i, s, a;
    O.DEBUG && console.log(e.step, "IUP[" + n.axis + "]");
    for (var o = 0; o < r; o++)
      i = t[o], !n.touched(i) && (s = i.prevTouched(n), s !== i && (a = i.nextTouched(n), s === a && n.setRelative(i, i, n.distance(s, s, !1, !0), n, !0), n.interpolate(i, s, a, n)));
  }
  function $a(n, e) {
    for (var t = e.stack, r = n ? e.rp1 : e.rp2, i = (n ? e.z0 : e.z1)[r], s = e.fv, a = e.pv, o = e.loop, h = e.z2; o--; ) {
      var c = t.pop(), u = h[c], f = a.distance(i, i, !1, !0);
      s.setRelative(u, u, f, a), s.touch(u), O.DEBUG && console.log(
        e.step,
        (e.loop > 1 ? "loop " + (e.loop - o) + ": " : "") + "SHP[" + (n ? "rp1" : "rp2") + "]",
        c
      );
    }
    e.loop = 1;
  }
  function ja(n, e) {
    var t = e.stack, r = n ? e.rp1 : e.rp2, i = (n ? e.z0 : e.z1)[r], s = e.fv, a = e.pv, o = t.pop(), h = e.z2[e.contours[o]], c = h;
    O.DEBUG && console.log(e.step, "SHC[" + n + "]", o);
    var u = a.distance(i, i, !1, !0);
    do
      c !== i && s.setRelative(c, c, u, a), c = c.nextPointOnContour;
    while (c !== h);
  }
  function Qa(n, e) {
    var t = e.stack, r = n ? e.rp1 : e.rp2, i = (n ? e.z0 : e.z1)[r], s = e.fv, a = e.pv, o = t.pop();
    O.DEBUG && console.log(e.step, "SHZ[" + n + "]", o);
    var h;
    switch (o) {
      case 0:
        h = e.tZone;
        break;
      case 1:
        h = e.gZone;
        break;
      default:
        throw new Error("Invalid zone");
    }
    for (var c, u = a.distance(i, i, !1, !0), f = h.length - 2, l = 0; l < f; l++)
      c = h[l], s.setRelative(c, c, u, a);
  }
  function Of(n) {
    for (var e = n.stack, t = n.loop, r = n.fv, i = e.pop() / 64, s = n.z2; t--; ) {
      var a = e.pop(), o = s[a];
      O.DEBUG && console.log(
        n.step,
        (n.loop > 1 ? "loop " + (n.loop - t) + ": " : "") + "SHPIX[]",
        a,
        i
      ), r.setRelative(o, o, i), r.touch(o);
    }
    n.loop = 1;
  }
  function Lf(n) {
    for (var e = n.stack, t = n.rp1, r = n.rp2, i = n.loop, s = n.z0[t], a = n.z1[r], o = n.fv, h = n.dpv, c = n.z2; i--; ) {
      var u = e.pop(), f = c[u];
      O.DEBUG && console.log(
        n.step,
        (n.loop > 1 ? "loop " + (n.loop - i) + ": " : "") + "IP[]",
        u,
        t,
        "<->",
        r
      ), o.interpolate(f, s, a, h), o.touch(f);
    }
    n.loop = 1;
  }
  function Ka(n, e) {
    var t = e.stack, r = t.pop() / 64, i = t.pop(), s = e.z1[i], a = e.z0[e.rp0], o = e.fv, h = e.pv;
    o.setRelative(s, a, r, h), o.touch(s), O.DEBUG && console.log(e.step, "MSIRP[" + n + "]", r, i), e.rp1 = e.rp0, e.rp2 = i, n && (e.rp0 = i);
  }
  function Uf(n) {
    for (var e = n.stack, t = n.rp0, r = n.z0[t], i = n.loop, s = n.fv, a = n.pv, o = n.z1; i--; ) {
      var h = e.pop(), c = o[h];
      O.DEBUG && console.log(
        n.step,
        (n.loop > 1 ? "loop " + (n.loop - i) + ": " : "") + "ALIGNRP[]",
        h
      ), s.setRelative(c, r, 0, a), s.touch(c);
    }
    n.loop = 1;
  }
  function Rf(n) {
    O.DEBUG && console.log(n.step, "RTDG[]"), n.round = jl;
  }
  function eo(n, e) {
    var t = e.stack, r = t.pop(), i = t.pop(), s = e.z0[i], a = e.fv, o = e.pv, h = e.cvt[r];
    O.DEBUG && console.log(
      e.step,
      "MIAP[" + n + "]",
      r,
      "(",
      h,
      ")",
      i
    );
    var c = o.distance(s, Nr);
    n && (Math.abs(c - h) < e.cvCutIn && (c = h), c = e.round(c)), a.setRelative(s, Nr, c, o), e.zp0 === 0 && (s.xo = s.x, s.yo = s.y), a.touch(s), e.rp0 = e.rp1 = i;
  }
  function Df(n) {
    var e = n.prog, t = n.ip, r = n.stack, i = e[++t];
    O.DEBUG && console.log(n.step, "NPUSHB[]", i);
    for (var s = 0; s < i; s++)
      r.push(e[++t]);
    n.ip = t;
  }
  function If(n) {
    var e = n.ip, t = n.prog, r = n.stack, i = t[++e];
    O.DEBUG && console.log(n.step, "NPUSHW[]", i);
    for (var s = 0; s < i; s++) {
      var a = t[++e] << 8 | t[++e];
      a & 32768 && (a = -((a ^ 65535) + 1)), r.push(a);
    }
    n.ip = e;
  }
  function Pf(n) {
    var e = n.stack, t = n.store;
    t || (t = n.store = []);
    var r = e.pop(), i = e.pop();
    O.DEBUG && console.log(n.step, "WS", r, i), t[i] = r;
  }
  function zf(n) {
    var e = n.stack, t = n.store, r = e.pop();
    O.DEBUG && console.log(n.step, "RS", r);
    var i = t && t[r] || 0;
    e.push(i);
  }
  function Nf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "WCVTP", t, r), n.cvt[r] = t / 64;
  }
  function Gf(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "RCVT", t), e.push(n.cvt[t] * 64);
  }
  function to(n, e) {
    var t = e.stack, r = t.pop(), i = e.z2[r];
    O.DEBUG && console.log(e.step, "GC[" + n + "]", r), t.push(e.dpv.distance(i, Nr, n, !1) * 64);
  }
  function ro(n, e) {
    var t = e.stack, r = t.pop(), i = t.pop(), s = e.z1[r], a = e.z0[i], o = e.dpv.distance(a, s, n, n);
    O.DEBUG && console.log(e.step, "MD[" + n + "]", r, i, "->", o), e.stack.push(Math.round(o * 64));
  }
  function Hf(n) {
    O.DEBUG && console.log(n.step, "MPPEM[]"), n.stack.push(n.ppem);
  }
  function Wf(n) {
    O.DEBUG && console.log(n.step, "FLIPON[]"), n.autoFlip = !0;
  }
  function qf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "LT[]", t, r), e.push(r < t ? 1 : 0);
  }
  function Vf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "LTEQ[]", t, r), e.push(r <= t ? 1 : 0);
  }
  function Xf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "GT[]", t, r), e.push(r > t ? 1 : 0);
  }
  function Yf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "GTEQ[]", t, r), e.push(r >= t ? 1 : 0);
  }
  function Zf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "EQ[]", t, r), e.push(t === r ? 1 : 0);
  }
  function Jf(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "NEQ[]", t, r), e.push(t !== r ? 1 : 0);
  }
  function $f(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "ODD[]", t), e.push(Math.trunc(t) % 2 ? 1 : 0);
  }
  function jf(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "EVEN[]", t), e.push(Math.trunc(t) % 2 ? 0 : 1);
  }
  function Qf(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "IF[]", e), e || (Ph(n, !0), O.DEBUG && console.log(n.step, "EIF[]"));
  }
  function Kf(n) {
    O.DEBUG && console.log(n.step, "EIF[]");
  }
  function e0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "AND[]", t, r), e.push(t && r ? 1 : 0);
  }
  function t0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "OR[]", t, r), e.push(t || r ? 1 : 0);
  }
  function r0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "NOT[]", t), e.push(t ? 0 : 1);
  }
  function _i(n, e) {
    var t = e.stack, r = t.pop(), i = e.fv, s = e.pv, a = e.ppem, o = e.deltaBase + (n - 1) * 16, h = e.deltaShift, c = e.z0;
    O.DEBUG && console.log(e.step, "DELTAP[" + n + "]", r, t);
    for (var u = 0; u < r; u++) {
      var f = t.pop(), l = t.pop(), p = o + ((l & 240) >> 4);
      if (p === a) {
        var g = (l & 15) - 8;
        g >= 0 && g++, O.DEBUG && console.log(e.step, "DELTAPFIX", f, "by", g * h);
        var m = c[f];
        i.setRelative(m, m, g * h, s);
      }
    }
  }
  function n0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "SDB[]", t), n.deltaBase = t;
  }
  function i0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "SDS[]", t), n.deltaShift = Math.pow(0.5, t);
  }
  function s0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "ADD[]", t, r), e.push(r + t);
  }
  function a0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "SUB[]", t, r), e.push(r - t);
  }
  function o0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "DIV[]", t, r), e.push(r * 64 / t);
  }
  function h0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "MUL[]", t, r), e.push(r * t / 64);
  }
  function c0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "ABS[]", t), e.push(Math.abs(t));
  }
  function u0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "NEG[]", t), e.push(-t);
  }
  function l0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "FLOOR[]", t), e.push(Math.floor(t / 64) * 64);
  }
  function f0(n) {
    var e = n.stack, t = e.pop();
    O.DEBUG && console.log(n.step, "CEILING[]", t), e.push(Math.ceil(t / 64) * 64);
  }
  function An(n, e) {
    var t = e.stack, r = t.pop();
    O.DEBUG && console.log(e.step, "ROUND[]"), t.push(e.round(r / 64) * 64);
  }
  function p0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "WCVTF[]", t, r), n.cvt[r] = t * n.ppem / n.font.unitsPerEm;
  }
  function Oi(n, e) {
    var t = e.stack, r = t.pop(), i = e.ppem, s = e.deltaBase + (n - 1) * 16, a = e.deltaShift;
    O.DEBUG && console.log(e.step, "DELTAC[" + n + "]", r, t);
    for (var o = 0; o < r; o++) {
      var h = t.pop(), c = t.pop(), u = s + ((c & 240) >> 4);
      if (u === i) {
        var f = (c & 15) - 8;
        f >= 0 && f++;
        var l = f * a;
        O.DEBUG && console.log(e.step, "DELTACFIX", h, "by", l), e.cvt[h] += l;
      }
    }
  }
  function d0(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "SROUND[]", e), n.round = Ih;
    var t;
    switch (e & 192) {
      case 0:
        t = 0.5;
        break;
      case 64:
        t = 1;
        break;
      case 128:
        t = 2;
        break;
      default:
        throw new Error("invalid SROUND value");
    }
    switch (n.srPeriod = t, e & 48) {
      case 0:
        n.srPhase = 0;
        break;
      case 16:
        n.srPhase = 0.25 * t;
        break;
      case 32:
        n.srPhase = 0.5 * t;
        break;
      case 48:
        n.srPhase = 0.75 * t;
        break;
      default:
        throw new Error("invalid SROUND value");
    }
    e &= 15, e === 0 ? n.srThreshold = 0 : n.srThreshold = (e / 8 - 0.5) * t;
  }
  function g0(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "S45ROUND[]", e), n.round = Ih;
    var t;
    switch (e & 192) {
      case 0:
        t = Math.sqrt(2) / 2;
        break;
      case 64:
        t = Math.sqrt(2);
        break;
      case 128:
        t = 2 * Math.sqrt(2);
        break;
      default:
        throw new Error("invalid S45ROUND value");
    }
    switch (n.srPeriod = t, e & 48) {
      case 0:
        n.srPhase = 0;
        break;
      case 16:
        n.srPhase = 0.25 * t;
        break;
      case 32:
        n.srPhase = 0.5 * t;
        break;
      case 48:
        n.srPhase = 0.75 * t;
        break;
      default:
        throw new Error("invalid S45ROUND value");
    }
    e &= 15, e === 0 ? n.srThreshold = 0 : n.srThreshold = (e / 8 - 0.5) * t;
  }
  function y0(n) {
    O.DEBUG && console.log(n.step, "ROFF[]"), n.round = $l;
  }
  function m0(n) {
    O.DEBUG && console.log(n.step, "RUTG[]"), n.round = Kl;
  }
  function v0(n) {
    O.DEBUG && console.log(n.step, "RDTG[]"), n.round = ef;
  }
  function x0(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "SCANCTRL[]", e);
  }
  function no(n, e) {
    var t = e.stack, r = t.pop(), i = t.pop(), s = e.z2[r], a = e.z1[i];
    O.DEBUG && console.log(e.step, "SDPVTL[" + n + "]", r, i);
    var o, h;
    n ? (o = s.y - a.y, h = a.x - s.x) : (o = a.x - s.x, h = a.y - s.y), e.dpv = Zr(o, h);
  }
  function b0(n) {
    var e = n.stack, t = e.pop(), r = 0;
    O.DEBUG && console.log(n.step, "GETINFO[]", t), t & 1 && (r = 35), t & 32 && (r |= 4096), e.push(r);
  }
  function w0(n) {
    var e = n.stack, t = e.pop(), r = e.pop(), i = e.pop();
    O.DEBUG && console.log(n.step, "ROLL[]"), e.push(r), e.push(t), e.push(i);
  }
  function S0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "MAX[]", t, r), e.push(Math.max(r, t));
  }
  function F0(n) {
    var e = n.stack, t = e.pop(), r = e.pop();
    O.DEBUG && console.log(n.step, "MIN[]", t, r), e.push(Math.min(r, t));
  }
  function T0(n) {
    var e = n.stack.pop();
    O.DEBUG && console.log(n.step, "SCANTYPE[]", e);
  }
  function C0(n) {
    var e = n.stack.pop(), t = n.stack.pop();
    switch (O.DEBUG && console.log(n.step, "INSTCTRL[]", e, t), e) {
      case 1:
        n.inhibitGridFit = !!t;
        return;
      case 2:
        n.ignoreCvt = !!t;
        return;
      default:
        throw new Error("invalid INSTCTRL[] selector");
    }
  }
  function xt(n, e) {
    var t = e.stack, r = e.prog, i = e.ip;
    O.DEBUG && console.log(e.step, "PUSHB[" + n + "]");
    for (var s = 0; s < n; s++)
      t.push(r[++i]);
    e.ip = i;
  }
  function bt(n, e) {
    var t = e.ip, r = e.prog, i = e.stack;
    O.DEBUG && console.log(e.ip, "PUSHW[" + n + "]");
    for (var s = 0; s < n; s++) {
      var a = r[++t] << 8 | r[++t];
      a & 32768 && (a = -((a ^ 65535) + 1)), i.push(a);
    }
    e.ip = t;
  }
  function P(n, e, t, r, i, s) {
    var a = s.stack, o = n && a.pop(), h = a.pop(), c = s.rp0, u = s.z0[c], f = s.z1[h], l = s.minDis, p = s.fv, g = s.dpv, m, x, v, w;
    x = m = g.distance(f, u, !0, !0), v = x >= 0 ? 1 : -1, x = Math.abs(x), n && (w = s.cvt[o], r && Math.abs(x - w) < s.cvCutIn && (x = w)), t && x < l && (x = l), r && (x = s.round(x)), p.setRelative(f, u, v * x, g), p.touch(f), O.DEBUG && console.log(
      s.step,
      (n ? "MIRP[" : "MDRP[") + (e ? "M" : "m") + (t ? ">" : "_") + (r ? "R" : "_") + (i === 0 ? "Gr" : i === 1 ? "Bl" : i === 2 ? "Wh" : "") + "]",
      n ? o + "(" + s.cvt[o] + "," + w + ")" : "",
      h,
      "(d =",
      m,
      "->",
      v * x,
      ")"
    ), s.rp1 = s.rp0, s.rp2 = h, e && (s.rp0 = h);
  }
  Lh = [
    /* 0x00 */
    Wa.bind(void 0, ct),
    /* 0x01 */
    Wa.bind(void 0, Ke),
    /* 0x02 */
    qa.bind(void 0, ct),
    /* 0x03 */
    qa.bind(void 0, Ke),
    /* 0x04 */
    Va.bind(void 0, ct),
    /* 0x05 */
    Va.bind(void 0, Ke),
    /* 0x06 */
    Xa.bind(void 0, 0),
    /* 0x07 */
    Xa.bind(void 0, 1),
    /* 0x08 */
    Ya.bind(void 0, 0),
    /* 0x09 */
    Ya.bind(void 0, 1),
    /* 0x0A */
    rf,
    /* 0x0B */
    nf,
    /* 0x0C */
    sf,
    /* 0x0D */
    af,
    /* 0x0E */
    of,
    /* 0x0F */
    hf,
    /* 0x10 */
    cf,
    /* 0x11 */
    uf,
    /* 0x12 */
    lf,
    /* 0x13 */
    ff,
    /* 0x14 */
    pf,
    /* 0x15 */
    df,
    /* 0x16 */
    gf,
    /* 0x17 */
    yf,
    /* 0x18 */
    mf,
    /* 0x19 */
    vf,
    /* 0x1A */
    xf,
    /* 0x1B */
    bf,
    /* 0x1C */
    wf,
    /* 0x1D */
    Sf,
    /* 0x1E */
    void 0,
    // TODO SSWCI
    /* 0x1F */
    void 0,
    // TODO SSW
    /* 0x20 */
    Ff,
    /* 0x21 */
    Bi,
    /* 0x22 */
    Tf,
    /* 0x23 */
    Cf,
    /* 0x24 */
    kf,
    /* 0x25 */
    Ef,
    /* 0x26 */
    Bf,
    /* 0x27 */
    void 0,
    // TODO ALIGNPTS
    /* 0x28 */
    void 0,
    /* 0x29 */
    void 0,
    // TODO UTP
    /* 0x2A */
    Mf,
    /* 0x2B */
    Af,
    /* 0x2C */
    _f,
    /* 0x2D */
    void 0,
    // ENDF (eaten by FDEF)
    /* 0x2E */
    Za.bind(void 0, 0),
    /* 0x2F */
    Za.bind(void 0, 1),
    /* 0x30 */
    Ja.bind(void 0, ct),
    /* 0x31 */
    Ja.bind(void 0, Ke),
    /* 0x32 */
    $a.bind(void 0, 0),
    /* 0x33 */
    $a.bind(void 0, 1),
    /* 0x34 */
    ja.bind(void 0, 0),
    /* 0x35 */
    ja.bind(void 0, 1),
    /* 0x36 */
    Qa.bind(void 0, 0),
    /* 0x37 */
    Qa.bind(void 0, 1),
    /* 0x38 */
    Of,
    /* 0x39 */
    Lf,
    /* 0x3A */
    Ka.bind(void 0, 0),
    /* 0x3B */
    Ka.bind(void 0, 1),
    /* 0x3C */
    Uf,
    /* 0x3D */
    Rf,
    /* 0x3E */
    eo.bind(void 0, 0),
    /* 0x3F */
    eo.bind(void 0, 1),
    /* 0x40 */
    Df,
    /* 0x41 */
    If,
    /* 0x42 */
    Pf,
    /* 0x43 */
    zf,
    /* 0x44 */
    Nf,
    /* 0x45 */
    Gf,
    /* 0x46 */
    to.bind(void 0, 0),
    /* 0x47 */
    to.bind(void 0, 1),
    /* 0x48 */
    void 0,
    // TODO SCFS
    /* 0x49 */
    ro.bind(void 0, 0),
    /* 0x4A */
    ro.bind(void 0, 1),
    /* 0x4B */
    Hf,
    /* 0x4C */
    void 0,
    // TODO MPS
    /* 0x4D */
    Wf,
    /* 0x4E */
    void 0,
    // TODO FLIPOFF
    /* 0x4F */
    void 0,
    // TODO DEBUG
    /* 0x50 */
    qf,
    /* 0x51 */
    Vf,
    /* 0x52 */
    Xf,
    /* 0x53 */
    Yf,
    /* 0x54 */
    Zf,
    /* 0x55 */
    Jf,
    /* 0x56 */
    $f,
    /* 0x57 */
    jf,
    /* 0x58 */
    Qf,
    /* 0x59 */
    Kf,
    /* 0x5A */
    e0,
    /* 0x5B */
    t0,
    /* 0x5C */
    r0,
    /* 0x5D */
    _i.bind(void 0, 1),
    /* 0x5E */
    n0,
    /* 0x5F */
    i0,
    /* 0x60 */
    s0,
    /* 0x61 */
    a0,
    /* 0x62 */
    o0,
    /* 0x63 */
    h0,
    /* 0x64 */
    c0,
    /* 0x65 */
    u0,
    /* 0x66 */
    l0,
    /* 0x67 */
    f0,
    /* 0x68 */
    An.bind(void 0, 0),
    /* 0x69 */
    An.bind(void 0, 1),
    /* 0x6A */
    An.bind(void 0, 2),
    /* 0x6B */
    An.bind(void 0, 3),
    /* 0x6C */
    void 0,
    // TODO NROUND[ab]
    /* 0x6D */
    void 0,
    // TODO NROUND[ab]
    /* 0x6E */
    void 0,
    // TODO NROUND[ab]
    /* 0x6F */
    void 0,
    // TODO NROUND[ab]
    /* 0x70 */
    p0,
    /* 0x71 */
    _i.bind(void 0, 2),
    /* 0x72 */
    _i.bind(void 0, 3),
    /* 0x73 */
    Oi.bind(void 0, 1),
    /* 0x74 */
    Oi.bind(void 0, 2),
    /* 0x75 */
    Oi.bind(void 0, 3),
    /* 0x76 */
    d0,
    /* 0x77 */
    g0,
    /* 0x78 */
    void 0,
    // TODO JROT[]
    /* 0x79 */
    void 0,
    // TODO JROF[]
    /* 0x7A */
    y0,
    /* 0x7B */
    void 0,
    /* 0x7C */
    m0,
    /* 0x7D */
    v0,
    /* 0x7E */
    Bi,
    // actually SANGW, supposed to do only a pop though
    /* 0x7F */
    Bi,
    // actually AA, supposed to do only a pop though
    /* 0x80 */
    void 0,
    // TODO FLIPPT
    /* 0x81 */
    void 0,
    // TODO FLIPRGON
    /* 0x82 */
    void 0,
    // TODO FLIPRGOFF
    /* 0x83 */
    void 0,
    /* 0x84 */
    void 0,
    /* 0x85 */
    x0,
    /* 0x86 */
    no.bind(void 0, 0),
    /* 0x87 */
    no.bind(void 0, 1),
    /* 0x88 */
    b0,
    /* 0x89 */
    void 0,
    // TODO IDEF
    /* 0x8A */
    w0,
    /* 0x8B */
    S0,
    /* 0x8C */
    F0,
    /* 0x8D */
    T0,
    /* 0x8E */
    C0,
    /* 0x8F */
    void 0,
    /* 0x90 */
    void 0,
    /* 0x91 */
    void 0,
    /* 0x92 */
    void 0,
    /* 0x93 */
    void 0,
    /* 0x94 */
    void 0,
    /* 0x95 */
    void 0,
    /* 0x96 */
    void 0,
    /* 0x97 */
    void 0,
    /* 0x98 */
    void 0,
    /* 0x99 */
    void 0,
    /* 0x9A */
    void 0,
    /* 0x9B */
    void 0,
    /* 0x9C */
    void 0,
    /* 0x9D */
    void 0,
    /* 0x9E */
    void 0,
    /* 0x9F */
    void 0,
    /* 0xA0 */
    void 0,
    /* 0xA1 */
    void 0,
    /* 0xA2 */
    void 0,
    /* 0xA3 */
    void 0,
    /* 0xA4 */
    void 0,
    /* 0xA5 */
    void 0,
    /* 0xA6 */
    void 0,
    /* 0xA7 */
    void 0,
    /* 0xA8 */
    void 0,
    /* 0xA9 */
    void 0,
    /* 0xAA */
    void 0,
    /* 0xAB */
    void 0,
    /* 0xAC */
    void 0,
    /* 0xAD */
    void 0,
    /* 0xAE */
    void 0,
    /* 0xAF */
    void 0,
    /* 0xB0 */
    xt.bind(void 0, 1),
    /* 0xB1 */
    xt.bind(void 0, 2),
    /* 0xB2 */
    xt.bind(void 0, 3),
    /* 0xB3 */
    xt.bind(void 0, 4),
    /* 0xB4 */
    xt.bind(void 0, 5),
    /* 0xB5 */
    xt.bind(void 0, 6),
    /* 0xB6 */
    xt.bind(void 0, 7),
    /* 0xB7 */
    xt.bind(void 0, 8),
    /* 0xB8 */
    bt.bind(void 0, 1),
    /* 0xB9 */
    bt.bind(void 0, 2),
    /* 0xBA */
    bt.bind(void 0, 3),
    /* 0xBB */
    bt.bind(void 0, 4),
    /* 0xBC */
    bt.bind(void 0, 5),
    /* 0xBD */
    bt.bind(void 0, 6),
    /* 0xBE */
    bt.bind(void 0, 7),
    /* 0xBF */
    bt.bind(void 0, 8),
    /* 0xC0 */
    P.bind(void 0, 0, 0, 0, 0, 0),
    /* 0xC1 */
    P.bind(void 0, 0, 0, 0, 0, 1),
    /* 0xC2 */
    P.bind(void 0, 0, 0, 0, 0, 2),
    /* 0xC3 */
    P.bind(void 0, 0, 0, 0, 0, 3),
    /* 0xC4 */
    P.bind(void 0, 0, 0, 0, 1, 0),
    /* 0xC5 */
    P.bind(void 0, 0, 0, 0, 1, 1),
    /* 0xC6 */
    P.bind(void 0, 0, 0, 0, 1, 2),
    /* 0xC7 */
    P.bind(void 0, 0, 0, 0, 1, 3),
    /* 0xC8 */
    P.bind(void 0, 0, 0, 1, 0, 0),
    /* 0xC9 */
    P.bind(void 0, 0, 0, 1, 0, 1),
    /* 0xCA */
    P.bind(void 0, 0, 0, 1, 0, 2),
    /* 0xCB */
    P.bind(void 0, 0, 0, 1, 0, 3),
    /* 0xCC */
    P.bind(void 0, 0, 0, 1, 1, 0),
    /* 0xCD */
    P.bind(void 0, 0, 0, 1, 1, 1),
    /* 0xCE */
    P.bind(void 0, 0, 0, 1, 1, 2),
    /* 0xCF */
    P.bind(void 0, 0, 0, 1, 1, 3),
    /* 0xD0 */
    P.bind(void 0, 0, 1, 0, 0, 0),
    /* 0xD1 */
    P.bind(void 0, 0, 1, 0, 0, 1),
    /* 0xD2 */
    P.bind(void 0, 0, 1, 0, 0, 2),
    /* 0xD3 */
    P.bind(void 0, 0, 1, 0, 0, 3),
    /* 0xD4 */
    P.bind(void 0, 0, 1, 0, 1, 0),
    /* 0xD5 */
    P.bind(void 0, 0, 1, 0, 1, 1),
    /* 0xD6 */
    P.bind(void 0, 0, 1, 0, 1, 2),
    /* 0xD7 */
    P.bind(void 0, 0, 1, 0, 1, 3),
    /* 0xD8 */
    P.bind(void 0, 0, 1, 1, 0, 0),
    /* 0xD9 */
    P.bind(void 0, 0, 1, 1, 0, 1),
    /* 0xDA */
    P.bind(void 0, 0, 1, 1, 0, 2),
    /* 0xDB */
    P.bind(void 0, 0, 1, 1, 0, 3),
    /* 0xDC */
    P.bind(void 0, 0, 1, 1, 1, 0),
    /* 0xDD */
    P.bind(void 0, 0, 1, 1, 1, 1),
    /* 0xDE */
    P.bind(void 0, 0, 1, 1, 1, 2),
    /* 0xDF */
    P.bind(void 0, 0, 1, 1, 1, 3),
    /* 0xE0 */
    P.bind(void 0, 1, 0, 0, 0, 0),
    /* 0xE1 */
    P.bind(void 0, 1, 0, 0, 0, 1),
    /* 0xE2 */
    P.bind(void 0, 1, 0, 0, 0, 2),
    /* 0xE3 */
    P.bind(void 0, 1, 0, 0, 0, 3),
    /* 0xE4 */
    P.bind(void 0, 1, 0, 0, 1, 0),
    /* 0xE5 */
    P.bind(void 0, 1, 0, 0, 1, 1),
    /* 0xE6 */
    P.bind(void 0, 1, 0, 0, 1, 2),
    /* 0xE7 */
    P.bind(void 0, 1, 0, 0, 1, 3),
    /* 0xE8 */
    P.bind(void 0, 1, 0, 1, 0, 0),
    /* 0xE9 */
    P.bind(void 0, 1, 0, 1, 0, 1),
    /* 0xEA */
    P.bind(void 0, 1, 0, 1, 0, 2),
    /* 0xEB */
    P.bind(void 0, 1, 0, 1, 0, 3),
    /* 0xEC */
    P.bind(void 0, 1, 0, 1, 1, 0),
    /* 0xED */
    P.bind(void 0, 1, 0, 1, 1, 1),
    /* 0xEE */
    P.bind(void 0, 1, 0, 1, 1, 2),
    /* 0xEF */
    P.bind(void 0, 1, 0, 1, 1, 3),
    /* 0xF0 */
    P.bind(void 0, 1, 1, 0, 0, 0),
    /* 0xF1 */
    P.bind(void 0, 1, 1, 0, 0, 1),
    /* 0xF2 */
    P.bind(void 0, 1, 1, 0, 0, 2),
    /* 0xF3 */
    P.bind(void 0, 1, 1, 0, 0, 3),
    /* 0xF4 */
    P.bind(void 0, 1, 1, 0, 1, 0),
    /* 0xF5 */
    P.bind(void 0, 1, 1, 0, 1, 1),
    /* 0xF6 */
    P.bind(void 0, 1, 1, 0, 1, 2),
    /* 0xF7 */
    P.bind(void 0, 1, 1, 0, 1, 3),
    /* 0xF8 */
    P.bind(void 0, 1, 1, 1, 0, 0),
    /* 0xF9 */
    P.bind(void 0, 1, 1, 1, 0, 1),
    /* 0xFA */
    P.bind(void 0, 1, 1, 1, 0, 2),
    /* 0xFB */
    P.bind(void 0, 1, 1, 1, 0, 3),
    /* 0xFC */
    P.bind(void 0, 1, 1, 1, 1, 0),
    /* 0xFD */
    P.bind(void 0, 1, 1, 1, 1, 1),
    /* 0xFE */
    P.bind(void 0, 1, 1, 1, 1, 2),
    /* 0xFF */
    P.bind(void 0, 1, 1, 1, 1, 3)
  ];
  function gr(n) {
    this.char = n, this.state = {}, this.activeState = null;
  }
  function Ms(n, e, t) {
    this.contextName = t, this.startIndex = n, this.endOffset = e;
  }
  function k0(n, e, t) {
    this.contextName = n, this.openRange = null, this.ranges = [], this.checkStart = e, this.checkEnd = t;
  }
  function Ve(n, e) {
    this.context = n, this.index = e, this.length = n.length, this.current = n[e], this.backtrack = n.slice(0, e), this.lookahead = n.slice(e + 1);
  }
  function Jn(n) {
    this.eventId = n, this.subscribers = [];
  }
  function M0(n) {
    var e = this, t = [
      "start",
      "end",
      "next",
      "newToken",
      "contextStart",
      "contextEnd",
      "insertToken",
      "removeToken",
      "removeRange",
      "replaceToken",
      "replaceRange",
      "composeRUD",
      "updateContextsRanges"
    ];
    t.forEach(function(i) {
      Object.defineProperty(e.events, i, {
        value: new Jn(i)
      });
    }), n && t.forEach(function(i) {
      var s = n[i];
      typeof s == "function" && e.events[i].subscribe(s);
    });
    var r = [
      "insertToken",
      "removeToken",
      "removeRange",
      "replaceToken",
      "replaceRange",
      "composeRUD"
    ];
    r.forEach(function(i) {
      e.events[i].subscribe(
        e.updateContextsRanges
      );
    });
  }
  function ue(n) {
    this.tokens = [], this.registeredContexts = {}, this.contextCheckers = [], this.events = {}, this.registeredModifiers = [], M0.call(this, n);
  }
  gr.prototype.setState = function(n, e) {
    return this.state[n] = e, this.activeState = { key: n, value: this.state[n] }, this.activeState;
  };
  gr.prototype.getState = function(n) {
    return this.state[n] || null;
  };
  ue.prototype.inboundIndex = function(n) {
    return n >= 0 && n < this.tokens.length;
  };
  ue.prototype.composeRUD = function(n) {
    var e = this, t = !0, r = n.map(function(s) {
      return e[s[0]].apply(e, s.slice(1).concat(t));
    }), i = function(s) {
      return typeof s == "object" && s.hasOwnProperty("FAIL");
    };
    if (r.every(i))
      return {
        FAIL: "composeRUD: one or more operations hasn't completed successfully",
        report: r.filter(i)
      };
    this.dispatch("composeRUD", [r.filter(function(s) {
      return !i(s);
    })]);
  };
  ue.prototype.replaceRange = function(n, e, t, r) {
    e = e !== null ? e : this.tokens.length;
    var i = t.every(function(a) {
      return a instanceof gr;
    });
    if (!isNaN(n) && this.inboundIndex(n) && i) {
      var s = this.tokens.splice.apply(
        this.tokens,
        [n, e].concat(t)
      );
      return r || this.dispatch("replaceToken", [n, e, t]), [s, t];
    } else
      return { FAIL: "replaceRange: invalid tokens or startIndex." };
  };
  ue.prototype.replaceToken = function(n, e, t) {
    if (!isNaN(n) && this.inboundIndex(n) && e instanceof gr) {
      var r = this.tokens.splice(n, 1, e);
      return t || this.dispatch("replaceToken", [n, e]), [r[0], e];
    } else
      return { FAIL: "replaceToken: invalid token or index." };
  };
  ue.prototype.removeRange = function(n, e, t) {
    e = isNaN(e) ? this.tokens.length : e;
    var r = this.tokens.splice(n, e);
    return t || this.dispatch("removeRange", [r, n, e]), r;
  };
  ue.prototype.removeToken = function(n, e) {
    if (!isNaN(n) && this.inboundIndex(n)) {
      var t = this.tokens.splice(n, 1);
      return e || this.dispatch("removeToken", [t, n]), t;
    } else
      return { FAIL: "removeToken: invalid token index." };
  };
  ue.prototype.insertToken = function(n, e, t) {
    var r = n.every(
      function(i) {
        return i instanceof gr;
      }
    );
    return r ? (this.tokens.splice.apply(
      this.tokens,
      [e, 0].concat(n)
    ), t || this.dispatch("insertToken", [n, e]), n) : { FAIL: "insertToken: invalid token(s)." };
  };
  ue.prototype.registerModifier = function(n, e, t) {
    this.events.newToken.subscribe(function(r, i) {
      var s = [r, i], a = e === null || e.apply(this, s) === !0, o = [r, i];
      if (a) {
        var h = t.apply(this, o);
        r.setState(n, h);
      }
    }), this.registeredModifiers.push(n);
  };
  Jn.prototype.subscribe = function(n) {
    return typeof n == "function" ? this.subscribers.push(n) - 1 : { FAIL: "invalid '" + this.eventId + "' event handler" };
  };
  Jn.prototype.unsubscribe = function(n) {
    this.subscribers.splice(n, 1);
  };
  Ve.prototype.setCurrentIndex = function(n) {
    this.index = n, this.current = this.context[n], this.backtrack = this.context.slice(0, n), this.lookahead = this.context.slice(n + 1);
  };
  Ve.prototype.get = function(n) {
    switch (!0) {
      case n === 0:
        return this.current;
      case (n < 0 && Math.abs(n) <= this.backtrack.length):
        return this.backtrack.slice(n)[0];
      case (n > 0 && n <= this.lookahead.length):
        return this.lookahead[n - 1];
      default:
        return null;
    }
  };
  ue.prototype.rangeToText = function(n) {
    if (n instanceof Ms)
      return this.getRangeTokens(n).map(function(e) {
        return e.char;
      }).join("");
  };
  ue.prototype.getText = function() {
    return this.tokens.map(function(n) {
      return n.char;
    }).join("");
  };
  ue.prototype.getContext = function(n) {
    var e = this.registeredContexts[n];
    return e || null;
  };
  ue.prototype.on = function(n, e) {
    var t = this.events[n];
    return t ? t.subscribe(e) : null;
  };
  ue.prototype.dispatch = function(n, e) {
    var t = this, r = this.events[n];
    r instanceof Jn && r.subscribers.forEach(function(i) {
      i.apply(t, e || []);
    });
  };
  ue.prototype.registerContextChecker = function(n, e, t) {
    if (this.getContext(n))
      return {
        FAIL: "context name '" + n + "' is already registered."
      };
    if (typeof e != "function")
      return {
        FAIL: "missing context start check."
      };
    if (typeof t != "function")
      return {
        FAIL: "missing context end check."
      };
    var r = new k0(
      n,
      e,
      t
    );
    return this.registeredContexts[n] = r, this.contextCheckers.push(r), r;
  };
  ue.prototype.getRangeTokens = function(n) {
    var e = n.startIndex + n.endOffset;
    return [].concat(
      this.tokens.slice(n.startIndex, e)
    );
  };
  ue.prototype.getContextRanges = function(n) {
    var e = this.getContext(n);
    return e ? e.ranges : { FAIL: "context checker '" + n + "' is not registered." };
  };
  ue.prototype.resetContextsRanges = function() {
    var n = this.registeredContexts;
    for (var e in n)
      if (n.hasOwnProperty(e)) {
        var t = n[e];
        t.ranges = [];
      }
  };
  ue.prototype.updateContextsRanges = function() {
    this.resetContextsRanges();
    for (var n = this.tokens.map(function(r) {
      return r.char;
    }), e = 0; e < n.length; e++) {
      var t = new Ve(n, e);
      this.runContextCheck(t);
    }
    this.dispatch("updateContextsRanges", [this.registeredContexts]);
  };
  ue.prototype.setEndOffset = function(n, e) {
    var t = this.getContext(e).openRange.startIndex, r = new Ms(t, n, e), i = this.getContext(e).ranges;
    return r.rangeId = e + "." + i.length, i.push(r), this.getContext(e).openRange = null, r;
  };
  ue.prototype.runContextCheck = function(n) {
    var e = this, t = n.index;
    this.contextCheckers.forEach(function(r) {
      var i = r.contextName, s = e.getContext(i).openRange;
      if (!s && r.checkStart(n) && (s = new Ms(t, null, i), e.getContext(i).openRange = s, e.dispatch("contextStart", [i, t])), s && r.checkEnd(n)) {
        var a = t - s.startIndex + 1, o = e.setEndOffset(a, i);
        e.dispatch("contextEnd", [i, o]);
      }
    });
  };
  ue.prototype.tokenize = function(n) {
    this.tokens = [], this.resetContextsRanges();
    var e = Array.from(n);
    this.dispatch("start");
    for (var t = 0; t < e.length; t++) {
      var r = e[t], i = new Ve(e, t);
      this.dispatch("next", [i]), this.runContextCheck(i);
      var s = new gr(r);
      this.tokens.push(s), this.dispatch("newToken", [s, i]);
    }
    return this.dispatch("end", [this.tokens]), this.tokens;
  };
  function Ct(n) {
    return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(n);
  }
  function zh(n) {
    return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(n);
  }
  function kt(n) {
    return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(n);
  }
  function On(n) {
    return /[A-z]/.test(n);
  }
  function A0(n) {
    return /\s/.test(n);
  }
  function Me(n) {
    this.font = n, this.features = {};
  }
  function Pt(n) {
    this.id = n.id, this.tag = n.tag, this.substitution = n.substitution;
  }
  function Jr(n, e) {
    if (!n)
      return -1;
    switch (e.format) {
      case 1:
        return e.glyphs.indexOf(n);
      case 2:
        for (var t = e.ranges, r = 0; r < t.length; r++) {
          var i = t[r];
          if (n >= i.start && n <= i.end) {
            var s = n - i.start;
            return i.index + s;
          }
        }
        break;
      default:
        return -1;
    }
    return -1;
  }
  function E0(n, e) {
    var t = Jr(n, e.coverage);
    return t === -1 ? null : n + e.deltaGlyphId;
  }
  function B0(n, e) {
    var t = Jr(n, e.coverage);
    return t === -1 ? null : e.substitute[t];
  }
  function Li(n, e) {
    for (var t = [], r = 0; r < n.length; r++) {
      var i = n[r], s = e.current;
      s = Array.isArray(s) ? s[0] : s;
      var a = Jr(s, i);
      a !== -1 && t.push(a);
    }
    return t.length !== n.length ? -1 : t;
  }
  function _0(n, e) {
    var t = e.inputCoverage.length + e.lookaheadCoverage.length + e.backtrackCoverage.length;
    if (n.context.length < t)
      return [];
    var r = Li(
      e.inputCoverage,
      n
    );
    if (r === -1)
      return [];
    var i = e.inputCoverage.length - 1;
    if (n.lookahead.length < e.lookaheadCoverage.length)
      return [];
    for (var s = n.lookahead.slice(i); s.length && kt(s[0].char); )
      s.shift();
    var a = new Ve(s, 0), o = Li(
      e.lookaheadCoverage,
      a
    ), h = [].concat(n.backtrack);
    for (h.reverse(); h.length && kt(h[0].char); )
      h.shift();
    if (h.length < e.backtrackCoverage.length)
      return [];
    var c = new Ve(h, 0), u = Li(
      e.backtrackCoverage,
      c
    ), f = r.length === e.inputCoverage.length && o.length === e.lookaheadCoverage.length && u.length === e.backtrackCoverage.length, l = [];
    if (f)
      for (var p = 0; p < e.lookupRecords.length; p++)
        for (var g = e.lookupRecords[p], m = g.lookupListIndex, x = this.getLookupByIndex(m), v = 0; v < x.subtables.length; v++) {
          var w = x.subtables[v], b = this.getLookupMethod(x, w), F = this.getSubstitutionType(x, w);
          if (F === "12")
            for (var C = 0; C < r.length; C++) {
              var _ = n.get(C), E = b(_);
              E && l.push(E);
            }
        }
    return l;
  }
  function O0(n, e) {
    var t = n.current, r = Jr(t, e.coverage);
    if (r === -1)
      return null;
    for (var i, s = e.ligatureSets[r], a = 0; a < s.length; a++) {
      i = s[a];
      for (var o = 0; o < i.components.length; o++) {
        var h = n.lookahead[o], c = i.components[o];
        if (h !== c)
          break;
        if (o === i.components.length - 1)
          return i;
      }
    }
    return null;
  }
  function L0(n, e) {
    var t = Jr(n, e.coverage);
    return t === -1 ? null : e.sequences[t];
  }
  Me.prototype.getDefaultScriptFeaturesIndexes = function() {
    for (var n = this.font.tables.gsub.scripts, e = 0; e < n.length; e++) {
      var t = n[e];
      if (t.tag === "DFLT")
        return t.script.defaultLangSys.featureIndexes;
    }
    return [];
  };
  Me.prototype.getScriptFeaturesIndexes = function(n) {
    var e = this.font.tables;
    if (!e.gsub)
      return [];
    if (!n)
      return this.getDefaultScriptFeaturesIndexes();
    for (var t = this.font.tables.gsub.scripts, r = 0; r < t.length; r++) {
      var i = t[r];
      if (i.tag === n && i.script.defaultLangSys)
        return i.script.defaultLangSys.featureIndexes;
      var s = i.langSysRecords;
      if (s)
        for (var a = 0; a < s.length; a++) {
          var o = s[a];
          if (o.tag === n) {
            var h = o.langSys;
            return h.featureIndexes;
          }
        }
    }
    return this.getDefaultScriptFeaturesIndexes();
  };
  Me.prototype.mapTagsToFeatures = function(n, e) {
    for (var t = {}, r = 0; r < n.length; r++) {
      var i = n[r].tag, s = n[r].feature;
      t[i] = s;
    }
    this.features[e].tags = t;
  };
  Me.prototype.getScriptFeatures = function(n) {
    var e = this.features[n];
    if (this.features.hasOwnProperty(n))
      return e;
    var t = this.getScriptFeaturesIndexes(n);
    if (!t)
      return null;
    var r = this.font.tables.gsub;
    return e = t.map(function(i) {
      return r.features[i];
    }), this.features[n] = e, this.mapTagsToFeatures(e, n), e;
  };
  Me.prototype.getSubstitutionType = function(n, e) {
    var t = n.lookupType.toString(), r = e.substFormat.toString();
    return t + r;
  };
  Me.prototype.getLookupMethod = function(n, e) {
    var t = this, r = this.getSubstitutionType(n, e);
    switch (r) {
      case "11":
        return function(i) {
          return E0.apply(
            t,
            [i, e]
          );
        };
      case "12":
        return function(i) {
          return B0.apply(
            t,
            [i, e]
          );
        };
      case "63":
        return function(i) {
          return _0.apply(
            t,
            [i, e]
          );
        };
      case "41":
        return function(i) {
          return O0.apply(
            t,
            [i, e]
          );
        };
      case "21":
        return function(i) {
          return L0.apply(
            t,
            [i, e]
          );
        };
      default:
        throw new Error(
          "lookupType: " + n.lookupType + " - substFormat: " + e.substFormat + " is not yet supported"
        );
    }
  };
  Me.prototype.lookupFeature = function(n) {
    var e = n.contextParams, t = e.index, r = this.getFeature({
      tag: n.tag,
      script: n.script
    });
    if (!r)
      return new Error(
        "font '" + this.font.names.fullName.en + "' doesn't support feature '" + n.tag + "' for script '" + n.script + "'."
      );
    for (var i = this.getFeatureLookups(r), s = [].concat(e.context), a = 0; a < i.length; a++)
      for (var o = i[a], h = this.getLookupSubtables(o), c = 0; c < h.length; c++) {
        var u = h[c], f = this.getSubstitutionType(o, u), l = this.getLookupMethod(o, u), p = void 0;
        switch (f) {
          case "11":
            p = l(e.current), p && s.splice(t, 1, new Pt({
              id: 11,
              tag: n.tag,
              substitution: p
            }));
            break;
          case "12":
            p = l(e.current), p && s.splice(t, 1, new Pt({
              id: 12,
              tag: n.tag,
              substitution: p
            }));
            break;
          case "63":
            p = l(e), Array.isArray(p) && p.length && s.splice(t, 1, new Pt({
              id: 63,
              tag: n.tag,
              substitution: p
            }));
            break;
          case "41":
            p = l(e), p && s.splice(t, 1, new Pt({
              id: 41,
              tag: n.tag,
              substitution: p
            }));
            break;
          case "21":
            p = l(e.current), p && s.splice(t, 1, new Pt({
              id: 21,
              tag: n.tag,
              substitution: p
            }));
            break;
        }
        e = new Ve(s, t), !(Array.isArray(p) && !p.length) && (p = null);
      }
    return s.length ? s : null;
  };
  Me.prototype.supports = function(n) {
    if (!n.script)
      return !1;
    this.getScriptFeatures(n.script);
    var e = this.features.hasOwnProperty(n.script);
    if (!n.tag)
      return e;
    var t = this.features[n.script].some(function(r) {
      return r.tag === n.tag;
    });
    return e && t;
  };
  Me.prototype.getLookupSubtables = function(n) {
    return n.subtables || null;
  };
  Me.prototype.getLookupByIndex = function(n) {
    var e = this.font.tables.gsub.lookups;
    return e[n] || null;
  };
  Me.prototype.getFeatureLookups = function(n) {
    return n.lookupListIndexes.map(this.getLookupByIndex.bind(this));
  };
  Me.prototype.getFeature = function(e) {
    if (!this.font)
      return { FAIL: "No font was found" };
    this.features.hasOwnProperty(e.script) || this.getScriptFeatures(e.script);
    var t = this.features[e.script];
    return t ? t.tags[e.tag] ? this.features[e.script].tags[e.tag] : null : { FAIL: "No feature for script " + e.script };
  };
  function U0(n) {
    var e = n.current, t = n.get(-1);
    return (
      // ? arabic first char
      t === null && Ct(e) || // ? arabic char preceded with a non arabic char
      !Ct(t) && Ct(e)
    );
  }
  function R0(n) {
    var e = n.get(1);
    return (
      // ? last arabic char
      e === null || // ? next char is not arabic
      !Ct(e)
    );
  }
  var D0 = {
    startCheck: U0,
    endCheck: R0
  };
  function I0(n) {
    var e = n.current, t = n.get(-1);
    return (
      // ? an arabic char preceded with a non arabic char
      (Ct(e) || kt(e)) && !Ct(t)
    );
  }
  function P0(n) {
    var e = n.get(1);
    switch (!0) {
      case e === null:
        return !0;
      case (!Ct(e) && !kt(e)):
        var t = A0(e);
        if (!t)
          return !0;
        if (t) {
          var r = !1;
          if (r = n.lookahead.some(
            function(i) {
              return Ct(i) || kt(i);
            }
          ), !r)
            return !0;
        }
        break;
      default:
        return !1;
    }
  }
  var z0 = {
    startCheck: I0,
    endCheck: P0
  };
  function N0(n, e, t) {
    e[t].setState(n.tag, n.substitution);
  }
  function G0(n, e, t) {
    e[t].setState(n.tag, n.substitution);
  }
  function H0(n, e, t) {
    n.substitution.forEach(function(r, i) {
      var s = e[t + i];
      s.setState(n.tag, r);
    });
  }
  function W0(n, e, t) {
    var r = e[t];
    r.setState(n.tag, n.substitution.ligGlyph);
    for (var i = n.substitution.components.length, s = 0; s < i; s++)
      r = e[t + s + 1], r.setState("deleted", !0);
  }
  var io = {
    11: N0,
    12: G0,
    63: H0,
    41: W0
  };
  function As(n, e, t) {
    n instanceof Pt && io[n.id] && io[n.id](n, e, t);
  }
  function q0(n) {
    for (var e = [].concat(n.backtrack), t = e.length - 1; t >= 0; t--) {
      var r = e[t], i = zh(r), s = kt(r);
      if (!i && !s)
        return !0;
      if (i)
        return !1;
    }
    return !1;
  }
  function V0(n) {
    if (zh(n.current))
      return !1;
    for (var e = 0; e < n.lookahead.length; e++) {
      var t = n.lookahead[e], r = kt(t);
      if (!r)
        return !0;
    }
    return !1;
  }
  function X0(n) {
    var e = this, t = "arab", r = this.featuresTags[t], i = this.tokenizer.getRangeTokens(n);
    if (i.length !== 1) {
      var s = new Ve(
        i.map(
          function(o) {
            return o.getState("glyphIndex");
          }
        ),
        0
      ), a = new Ve(
        i.map(
          function(o) {
            return o.char;
          }
        ),
        0
      );
      i.forEach(function(o, h) {
        if (!kt(o.char)) {
          s.setCurrentIndex(h), a.setCurrentIndex(h);
          var c = 0;
          q0(a) && (c |= 1), V0(a) && (c |= 2);
          var u;
          switch (c) {
            case 1:
              u = "fina";
              break;
            case 2:
              u = "init";
              break;
            case 3:
              u = "medi";
              break;
          }
          if (r.indexOf(u) !== -1) {
            var f = e.query.lookupFeature({
              tag: u,
              script: t,
              contextParams: s
            });
            if (f instanceof Error)
              return console.info(f.message);
            f.forEach(function(l, p) {
              l instanceof Pt && (As(l, i, p), s.context[p] = l.substitution);
            });
          }
        }
      });
    }
  }
  function so(n, e) {
    var t = n.map(function(r) {
      return r.activeState.value;
    });
    return new Ve(t, 0);
  }
  function Y0(n) {
    var e = this, t = "arab", r = this.tokenizer.getRangeTokens(n), i = so(r);
    i.context.forEach(function(s, a) {
      i.setCurrentIndex(a);
      var o = e.query.lookupFeature({
        tag: "rlig",
        script: t,
        contextParams: i
      });
      o.length && (o.forEach(
        function(h) {
          return As(h, r, a);
        }
      ), i = so(r));
    });
  }
  function Z0(n) {
    var e = n.current, t = n.get(-1);
    return (
      // ? latin first char
      t === null && On(e) || // ? latin char preceded with a non latin char
      !On(t) && On(e)
    );
  }
  function J0(n) {
    var e = n.get(1);
    return (
      // ? last latin char
      e === null || // ? next char is not latin
      !On(e)
    );
  }
  var $0 = {
    startCheck: Z0,
    endCheck: J0
  };
  function ao(n, e) {
    var t = n.map(function(r) {
      return r.activeState.value;
    });
    return new Ve(t, 0);
  }
  function j0(n) {
    var e = this, t = "latn", r = this.tokenizer.getRangeTokens(n), i = ao(r);
    i.context.forEach(function(s, a) {
      i.setCurrentIndex(a);
      var o = e.query.lookupFeature({
        tag: "liga",
        script: t,
        contextParams: i
      });
      o.length && (o.forEach(
        function(h) {
          return As(h, r, a);
        }
      ), i = ao(r));
    });
  }
  function Ze(n) {
    this.baseDir = n || "ltr", this.tokenizer = new ue(), this.featuresTags = {};
  }
  Ze.prototype.setText = function(n) {
    this.text = n;
  };
  Ze.prototype.contextChecks = {
    latinWordCheck: $0,
    arabicWordCheck: D0,
    arabicSentenceCheck: z0
  };
  function Ui(n) {
    var e = this.contextChecks[n + "Check"];
    return this.tokenizer.registerContextChecker(
      n,
      e.startCheck,
      e.endCheck
    );
  }
  function Q0() {
    return Ui.call(this, "latinWord"), Ui.call(this, "arabicWord"), Ui.call(this, "arabicSentence"), this.tokenizer.tokenize(this.text);
  }
  function K0() {
    var n = this, e = this.tokenizer.getContextRanges("arabicSentence");
    e.forEach(function(t) {
      var r = n.tokenizer.getRangeTokens(t);
      n.tokenizer.replaceRange(
        t.startIndex,
        t.endOffset,
        r.reverse()
      );
    });
  }
  Ze.prototype.registerFeatures = function(n, e) {
    var t = this, r = e.filter(
      function(i) {
        return t.query.supports({ script: n, tag: i });
      }
    );
    this.featuresTags.hasOwnProperty(n) ? this.featuresTags[n] = this.featuresTags[n].concat(r) : this.featuresTags[n] = r;
  };
  Ze.prototype.applyFeatures = function(n, e) {
    if (!n)
      throw new Error(
        "No valid font was provided to apply features"
      );
    this.query || (this.query = new Me(n));
    for (var t = 0; t < e.length; t++) {
      var r = e[t];
      this.query.supports({ script: r.script }) && this.registerFeatures(r.script, r.tags);
    }
  };
  Ze.prototype.registerModifier = function(n, e, t) {
    this.tokenizer.registerModifier(n, e, t);
  };
  function Es() {
    if (this.tokenizer.registeredModifiers.indexOf("glyphIndex") === -1)
      throw new Error(
        "glyphIndex modifier is required to apply arabic presentation features."
      );
  }
  function ep() {
    var n = this, e = "arab";
    if (this.featuresTags.hasOwnProperty(e)) {
      Es.call(this);
      var t = this.tokenizer.getContextRanges("arabicWord");
      t.forEach(function(r) {
        X0.call(n, r);
      });
    }
  }
  function tp() {
    var n = this, e = "arab";
    if (this.featuresTags.hasOwnProperty(e)) {
      var t = this.featuresTags[e];
      if (t.indexOf("rlig") !== -1) {
        Es.call(this);
        var r = this.tokenizer.getContextRanges("arabicWord");
        r.forEach(function(i) {
          Y0.call(n, i);
        });
      }
    }
  }
  function rp() {
    var n = this, e = "latn";
    if (this.featuresTags.hasOwnProperty(e)) {
      var t = this.featuresTags[e];
      if (t.indexOf("liga") !== -1) {
        Es.call(this);
        var r = this.tokenizer.getContextRanges("latinWord");
        r.forEach(function(i) {
          j0.call(n, i);
        });
      }
    }
  }
  Ze.prototype.checkContextReady = function(n) {
    return !!this.tokenizer.getContext(n);
  };
  Ze.prototype.applyFeaturesToContexts = function() {
    this.checkContextReady("arabicWord") && (ep.call(this), tp.call(this)), this.checkContextReady("latinWord") && rp.call(this), this.checkContextReady("arabicSentence") && K0.call(this);
  };
  Ze.prototype.processText = function(n) {
    (!this.text || this.text !== n) && (this.setText(n), Q0.call(this), this.applyFeaturesToContexts());
  };
  Ze.prototype.getBidiText = function(n) {
    return this.processText(n), this.tokenizer.getText();
  };
  Ze.prototype.getTextGlyphs = function(n) {
    this.processText(n);
    for (var e = [], t = 0; t < this.tokenizer.tokens.length; t++) {
      var r = this.tokenizer.tokens[t];
      if (!r.state.deleted) {
        var i = r.activeState.value;
        e.push(Array.isArray(i) ? i[0] : i);
      }
    }
    return e;
  };
  function ee(n) {
    n = n || {}, n.tables = n.tables || {}, n.empty || (Fr(n.familyName, "When creating a new Font object, familyName is required."), Fr(n.styleName, "When creating a new Font object, styleName is required."), Fr(n.unitsPerEm, "When creating a new Font object, unitsPerEm is required."), Fr(n.ascender, "When creating a new Font object, ascender is required."), Fr(n.descender <= 0, "When creating a new Font object, negative descender value is required."), this.names = {
      fontFamily: { en: n.familyName || " " },
      fontSubfamily: { en: n.styleName || " " },
      fullName: { en: n.fullName || n.familyName + " " + n.styleName },
      // postScriptName may not contain any whitespace
      postScriptName: { en: n.postScriptName || (n.familyName + n.styleName).replace(/\s/g, "") },
      designer: { en: n.designer || " " },
      designerURL: { en: n.designerURL || " " },
      manufacturer: { en: n.manufacturer || " " },
      manufacturerURL: { en: n.manufacturerURL || " " },
      license: { en: n.license || " " },
      licenseURL: { en: n.licenseURL || " " },
      version: { en: n.version || "Version 0.1" },
      description: { en: n.description || " " },
      copyright: { en: n.copyright || " " },
      trademark: { en: n.trademark || " " }
    }, this.unitsPerEm = n.unitsPerEm || 1e3, this.ascender = n.ascender, this.descender = n.descender, this.createdTimestamp = n.createdTimestamp, this.tables = Object.assign(n.tables, {
      os2: Object.assign({
        usWeightClass: n.weightClass || this.usWeightClasses.MEDIUM,
        usWidthClass: n.widthClass || this.usWidthClasses.MEDIUM,
        fsSelection: n.fsSelection || this.fsSelectionValues.REGULAR
      }, n.tables.os2)
    })), this.supported = !0, this.glyphs = new et.GlyphSet(this, n.glyphs || []), this.encoding = new ih(this), this.position = new Xr(this), this.substitution = new ke(this), this.tables = this.tables || {}, this._push = null, this._hmtxTableData = {}, Object.defineProperty(this, "hinting", {
      get: function() {
        if (this._hinting)
          return this._hinting;
        if (this.outlinesFormat === "truetype")
          return this._hinting = new Rh(this);
      }
    });
  }
  ee.prototype.hasChar = function(n) {
    return this.encoding.charToGlyphIndex(n) !== null;
  };
  ee.prototype.charToGlyphIndex = function(n) {
    return this.encoding.charToGlyphIndex(n);
  };
  ee.prototype.charToGlyph = function(n) {
    var e = this.charToGlyphIndex(n), t = this.glyphs.get(e);
    return t || (t = this.glyphs.get(0)), t;
  };
  ee.prototype.updateFeatures = function(n) {
    return this.defaultRenderOptions.features.map(function(e) {
      return e.script === "latn" ? {
        script: "latn",
        tags: e.tags.filter(function(t) {
          return n[t];
        })
      } : e;
    });
  };
  ee.prototype.stringToGlyphs = function(n, e) {
    var t = this, r = new Ze(), i = function(f) {
      return t.charToGlyphIndex(f.char);
    };
    r.registerModifier("glyphIndex", null, i);
    var s = e ? this.updateFeatures(e.features) : this.defaultRenderOptions.features;
    r.applyFeatures(this, s);
    for (var a = r.getTextGlyphs(n), o = a.length, h = new Array(o), c = this.glyphs.get(0), u = 0; u < o; u += 1)
      h[u] = this.glyphs.get(a[u]) || c;
    return h;
  };
  ee.prototype.nameToGlyphIndex = function(n) {
    return this.glyphNames.nameToGlyphIndex(n);
  };
  ee.prototype.nameToGlyph = function(n) {
    var e = this.nameToGlyphIndex(n), t = this.glyphs.get(e);
    return t || (t = this.glyphs.get(0)), t;
  };
  ee.prototype.glyphIndexToName = function(n) {
    return this.glyphNames.glyphIndexToName ? this.glyphNames.glyphIndexToName(n) : "";
  };
  ee.prototype.getKerningValue = function(n, e) {
    n = n.index || n, e = e.index || e;
    var t = this.position.defaultKerningTables;
    return t ? this.position.getKerningValue(t, n, e) : this.kerningPairs[n + "," + e] || 0;
  };
  ee.prototype.defaultRenderOptions = {
    kerning: !0,
    features: [
      /**
       * these 4 features are required to render Arabic text properly
       * and shouldn't be turned off when rendering arabic text.
       */
      { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
      { script: "latn", tags: ["liga", "rlig"] }
    ]
  };
  ee.prototype.forEachGlyph = function(n, e, t, r, i, s) {
    e = e !== void 0 ? e : 0, t = t !== void 0 ? t : 0, r = r !== void 0 ? r : 72, i = Object.assign({}, this.defaultRenderOptions, i);
    var a = 1 / this.unitsPerEm * r, o = this.stringToGlyphs(n, i), h;
    if (i.kerning) {
      var c = i.script || this.position.getDefaultScriptName();
      h = this.position.getKerningTables(c, i.language);
    }
    for (var u = 0; u < o.length; u += 1) {
      var f = o[u];
      if (s.call(this, f, e, t, r, i), f.advanceWidth && (e += f.advanceWidth * a), i.kerning && u < o.length - 1) {
        var l = h ? this.position.getKerningValue(h, f.index, o[u + 1].index) : this.getKerningValue(f, o[u + 1]);
        e += l * a;
      }
      i.letterSpacing ? e += i.letterSpacing * r : i.tracking && (e += i.tracking / 1e3 * r);
    }
    return e;
  };
  ee.prototype.getPath = function(n, e, t, r, i) {
    var s = new pe();
    return this.forEachGlyph(n, e, t, r, i, function(a, o, h, c) {
      var u = a.getPath(o, h, c, i, this);
      s.extend(u);
    }), s;
  };
  ee.prototype.getPaths = function(n, e, t, r, i) {
    var s = [];
    return this.forEachGlyph(n, e, t, r, i, function(a, o, h, c) {
      var u = a.getPath(o, h, c, i, this);
      s.push(u);
    }), s;
  };
  ee.prototype.getAdvanceWidth = function(n, e, t) {
    return this.forEachGlyph(n, 0, 0, e, t, function() {
    });
  };
  ee.prototype.draw = function(n, e, t, r, i, s) {
    this.getPath(e, t, r, i, s).draw(n);
  };
  ee.prototype.drawPoints = function(n, e, t, r, i, s) {
    this.forEachGlyph(e, t, r, i, s, function(a, o, h, c) {
      a.drawPoints(n, o, h, c);
    });
  };
  ee.prototype.drawMetrics = function(n, e, t, r, i, s) {
    this.forEachGlyph(e, t, r, i, s, function(a, o, h, c) {
      a.drawMetrics(n, o, h, c);
    });
  };
  ee.prototype.getEnglishName = function(n) {
    var e = this.names[n];
    if (e)
      return e.en;
  };
  ee.prototype.validate = function() {
    var n = this;
    function e(r, i) {
    }
    function t(r) {
      var i = n.getEnglishName(r);
      i && i.trim().length > 0;
    }
    t("fontFamily"), t("weightName"), t("manufacturer"), t("copyright"), t("version"), this.unitsPerEm > 0;
  };
  ee.prototype.toTables = function() {
    return Hl.fontToTable(this);
  };
  ee.prototype.toBuffer = function() {
    return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."), this.toArrayBuffer();
  };
  ee.prototype.toArrayBuffer = function() {
    for (var n = this.toTables(), e = n.encode(), t = new ArrayBuffer(e.length), r = new Uint8Array(t), i = 0; i < e.length; i++)
      r[i] = e[i];
    return t;
  };
  ee.prototype.download = function(n) {
    var e = this.getEnglishName("fontFamily"), t = this.getEnglishName("fontSubfamily");
    n = n || e.replace(/\s/g, "") + "-" + t + ".otf";
    var r = this.toArrayBuffer();
    if (ql())
      if (window.URL = window.URL || window.webkitURL, window.URL) {
        var i = new DataView(r), s = new Blob([i], { type: "font/opentype" }), a = document.createElement("a");
        a.href = window.URL.createObjectURL(s), a.download = n;
        var o = document.createEvent("MouseEvents");
        o.initEvent("click", !0, !1), a.dispatchEvent(o);
      } else
        console.warn("Font file could not be downloaded. Try using a different browser.");
    else {
      var h = require("fs"), c = Vl(r);
      h.writeFileSync(n, c);
    }
  };
  ee.prototype.fsSelectionValues = {
    ITALIC: 1,
    //1
    UNDERSCORE: 2,
    //2
    NEGATIVE: 4,
    //4
    OUTLINED: 8,
    //8
    STRIKEOUT: 16,
    //16
    BOLD: 32,
    //32
    REGULAR: 64,
    //64
    USER_TYPO_METRICS: 128,
    //128
    WWS: 256,
    //256
    OBLIQUE: 512
    //512
  };
  ee.prototype.usWidthClasses = {
    ULTRA_CONDENSED: 1,
    EXTRA_CONDENSED: 2,
    CONDENSED: 3,
    SEMI_CONDENSED: 4,
    MEDIUM: 5,
    SEMI_EXPANDED: 6,
    EXPANDED: 7,
    EXTRA_EXPANDED: 8,
    ULTRA_EXPANDED: 9
  };
  ee.prototype.usWeightClasses = {
    THIN: 100,
    EXTRA_LIGHT: 200,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,
    EXTRA_BOLD: 800,
    BLACK: 900
  };
  function Nh(n, e) {
    var t = JSON.stringify(n), r = 256;
    for (var i in e) {
      var s = parseInt(i);
      if (!(!s || s < 256)) {
        if (JSON.stringify(e[i]) === t)
          return s;
        r <= s && (r = s + 1);
      }
    }
    return e[r] = n, r;
  }
  function np(n, e, t) {
    var r = Nh(e.name, t);
    return [
      { name: "tag_" + n, type: "TAG", value: e.tag },
      { name: "minValue_" + n, type: "FIXED", value: e.minValue << 16 },
      { name: "defaultValue_" + n, type: "FIXED", value: e.defaultValue << 16 },
      { name: "maxValue_" + n, type: "FIXED", value: e.maxValue << 16 },
      { name: "flags_" + n, type: "USHORT", value: 0 },
      { name: "nameID_" + n, type: "USHORT", value: r }
    ];
  }
  function ip(n, e, t) {
    var r = {}, i = new z.Parser(n, e);
    return r.tag = i.parseTag(), r.minValue = i.parseFixed(), r.defaultValue = i.parseFixed(), r.maxValue = i.parseFixed(), i.skip("uShort", 1), r.name = t[i.parseUShort()] || {}, r;
  }
  function sp(n, e, t, r) {
    for (var i = Nh(e.name, r), s = [
      { name: "nameID_" + n, type: "USHORT", value: i },
      { name: "flags_" + n, type: "USHORT", value: 0 }
    ], a = 0; a < t.length; ++a) {
      var o = t[a].tag;
      s.push({
        name: "axis_" + n + " " + o,
        type: "FIXED",
        value: e.coordinates[o] << 16
      });
    }
    return s;
  }
  function ap(n, e, t, r) {
    var i = {}, s = new z.Parser(n, e);
    i.name = r[s.parseUShort()] || {}, s.skip("uShort", 1), i.coordinates = {};
    for (var a = 0; a < t.length; ++a)
      i.coordinates[t[a].tag] = s.parseFixed();
    return i;
  }
  function op(n, e) {
    var t = new D.Table("fvar", [
      { name: "version", type: "ULONG", value: 65536 },
      { name: "offsetToData", type: "USHORT", value: 0 },
      { name: "countSizePairs", type: "USHORT", value: 2 },
      { name: "axisCount", type: "USHORT", value: n.axes.length },
      { name: "axisSize", type: "USHORT", value: 20 },
      { name: "instanceCount", type: "USHORT", value: n.instances.length },
      { name: "instanceSize", type: "USHORT", value: 4 + n.axes.length * 4 }
    ]);
    t.offsetToData = t.sizeOf();
    for (var r = 0; r < n.axes.length; r++)
      t.fields = t.fields.concat(np(r, n.axes[r], e));
    for (var i = 0; i < n.instances.length; i++)
      t.fields = t.fields.concat(sp(i, n.instances[i], n.axes, e));
    return t;
  }
  function hp(n, e, t) {
    var r = new z.Parser(n, e), i = r.parseULong();
    G.argument(i === 65536, "Unsupported fvar table version.");
    var s = r.parseOffset16();
    r.skip("uShort", 1);
    for (var a = r.parseUShort(), o = r.parseUShort(), h = r.parseUShort(), c = r.parseUShort(), u = [], f = 0; f < a; f++)
      u.push(ip(n, e + s + f * o, t));
    for (var l = [], p = e + s + a * o, g = 0; g < h; g++)
      l.push(ap(n, p + g * c, u, t));
    return { axes: u, instances: l };
  }
  var cp = { make: op, parse: hp }, up = function() {
    return {
      coverage: this.parsePointer(M.coverage),
      attachPoints: this.parseList(M.pointer(M.uShortList))
    };
  }, lp = function() {
    var n = this.parseUShort();
    if (G.argument(
      n === 1 || n === 2 || n === 3,
      "Unsupported CaretValue table version."
    ), n === 1)
      return { coordinate: this.parseShort() };
    if (n === 2)
      return { pointindex: this.parseShort() };
    if (n === 3)
      return { coordinate: this.parseShort() };
  }, fp = function() {
    return this.parseList(M.pointer(lp));
  }, pp = function() {
    return {
      coverage: this.parsePointer(M.coverage),
      ligGlyphs: this.parseList(M.pointer(fp))
    };
  }, dp = function() {
    return this.parseUShort(), this.parseList(M.pointer(M.coverage));
  };
  function gp(n, e) {
    e = e || 0;
    var t = new M(n, e), r = t.parseVersion(1);
    G.argument(
      r === 1 || r === 1.2 || r === 1.3,
      "Unsupported GDEF table version."
    );
    var i = {
      version: r,
      classDef: t.parsePointer(M.classDef),
      attachList: t.parsePointer(up),
      ligCaretList: t.parsePointer(pp),
      markAttachClassDef: t.parsePointer(M.classDef)
    };
    return r >= 1.2 && (i.markGlyphSets = t.parsePointer(dp)), i;
  }
  var yp = { parse: gp }, Xe = new Array(10);
  Xe[1] = function() {
    var e = this.offset + this.relativeOffset, t = this.parseUShort();
    if (t === 1)
      return {
        posFormat: 1,
        coverage: this.parsePointer(M.coverage),
        value: this.parseValueRecord()
      };
    if (t === 2)
      return {
        posFormat: 2,
        coverage: this.parsePointer(M.coverage),
        values: this.parseValueRecordList()
      };
    G.assert(!1, "0x" + e.toString(16) + ": GPOS lookup type 1 format must be 1 or 2.");
  };
  Xe[2] = function() {
    var e = this.offset + this.relativeOffset, t = this.parseUShort();
    G.assert(t === 1 || t === 2, "0x" + e.toString(16) + ": GPOS lookup type 2 format must be 1 or 2.");
    var r = this.parsePointer(M.coverage), i = this.parseUShort(), s = this.parseUShort();
    if (t === 1)
      return {
        posFormat: t,
        coverage: r,
        valueFormat1: i,
        valueFormat2: s,
        pairSets: this.parseList(M.pointer(M.list(function() {
          return {
            // pairValueRecord
            secondGlyph: this.parseUShort(),
            value1: this.parseValueRecord(i),
            value2: this.parseValueRecord(s)
          };
        })))
      };
    if (t === 2) {
      var a = this.parsePointer(M.classDef), o = this.parsePointer(M.classDef), h = this.parseUShort(), c = this.parseUShort();
      return {
        // Class Pair Adjustment
        posFormat: t,
        coverage: r,
        valueFormat1: i,
        valueFormat2: s,
        classDef1: a,
        classDef2: o,
        class1Count: h,
        class2Count: c,
        classRecords: this.parseList(h, M.list(c, function() {
          return {
            value1: this.parseValueRecord(i),
            value2: this.parseValueRecord(s)
          };
        }))
      };
    }
  };
  Xe[3] = function() {
    return { error: "GPOS Lookup 3 not supported" };
  };
  Xe[4] = function() {
    return { error: "GPOS Lookup 4 not supported" };
  };
  Xe[5] = function() {
    return { error: "GPOS Lookup 5 not supported" };
  };
  Xe[6] = function() {
    return { error: "GPOS Lookup 6 not supported" };
  };
  Xe[7] = function() {
    return { error: "GPOS Lookup 7 not supported" };
  };
  Xe[8] = function() {
    return { error: "GPOS Lookup 8 not supported" };
  };
  Xe[9] = function() {
    return { error: "GPOS Lookup 9 not supported" };
  };
  function mp(n, e) {
    e = e || 0;
    var t = new M(n, e), r = t.parseVersion(1);
    return G.argument(r === 1 || r === 1.1, "Unsupported GPOS table version " + r), r === 1 ? {
      version: r,
      scripts: t.parseScriptList(),
      features: t.parseFeatureList(),
      lookups: t.parseLookupList(Xe)
    } : {
      version: r,
      scripts: t.parseScriptList(),
      features: t.parseFeatureList(),
      lookups: t.parseLookupList(Xe),
      variations: t.parseFeatureVariationsList()
    };
  }
  var vp = new Array(10);
  function xp(n) {
    return new D.Table("GPOS", [
      { name: "version", type: "ULONG", value: 65536 },
      { name: "scripts", type: "TABLE", value: new D.ScriptList(n.scripts) },
      { name: "features", type: "TABLE", value: new D.FeatureList(n.features) },
      { name: "lookups", type: "TABLE", value: new D.LookupList(n.lookups, vp) }
    ]);
  }
  var bp = { parse: mp, make: xp };
  function wp(n) {
    var e = {};
    n.skip("uShort");
    var t = n.parseUShort();
    G.argument(t === 0, "Unsupported kern sub-table version."), n.skip("uShort", 2);
    var r = n.parseUShort();
    n.skip("uShort", 3);
    for (var i = 0; i < r; i += 1) {
      var s = n.parseUShort(), a = n.parseUShort(), o = n.parseShort();
      e[s + "," + a] = o;
    }
    return e;
  }
  function Sp(n) {
    var e = {};
    n.skip("uShort");
    var t = n.parseULong();
    t > 1 && console.warn("Only the first kern subtable is supported."), n.skip("uLong");
    var r = n.parseUShort(), i = r & 255;
    if (n.skip("uShort"), i === 0) {
      var s = n.parseUShort();
      n.skip("uShort", 3);
      for (var a = 0; a < s; a += 1) {
        var o = n.parseUShort(), h = n.parseUShort(), c = n.parseShort();
        e[o + "," + h] = c;
      }
    }
    return e;
  }
  function Fp(n, e) {
    var t = new z.Parser(n, e), r = t.parseUShort();
    if (r === 0)
      return wp(t);
    if (r === 1)
      return Sp(t);
    throw new Error("Unsupported kern table version (" + r + ").");
  }
  var Tp = { parse: Fp };
  function Cp(n, e, t, r) {
    for (var i = new z.Parser(n, e), s = r ? i.parseUShort : i.parseULong, a = [], o = 0; o < t + 1; o += 1) {
      var h = s.call(i);
      r && (h *= 2), a.push(h);
    }
    return a;
  }
  var kp = { parse: Cp };
  function oo(n, e) {
    for (var t = [], r = 12, i = 0; i < e; i += 1) {
      var s = z.getTag(n, r), a = z.getULong(n, r + 4), o = z.getULong(n, r + 8), h = z.getULong(n, r + 12);
      t.push({ tag: s, checksum: a, offset: o, length: h, compression: !1 }), r += 16;
    }
    return t;
  }
  function Mp(n, e) {
    for (var t = [], r = 44, i = 0; i < e; i += 1) {
      var s = z.getTag(n, r), a = z.getULong(n, r + 4), o = z.getULong(n, r + 8), h = z.getULong(n, r + 12), c = void 0;
      o < h ? c = "WOFF" : c = !1, t.push({
        tag: s,
        offset: a,
        compression: c,
        compressedLength: o,
        length: h
      }), r += 20;
    }
    return t;
  }
  function le(n, e) {
    if (e.compression === "WOFF") {
      var t = new Uint8Array(n.buffer, e.offset + 2, e.compressedLength - 2), r = new Uint8Array(e.length);
      if (xu(t, r), r.byteLength !== e.length)
        throw new Error("Decompression error: " + e.tag + " decompressed length doesn't match recorded length");
      var i = new DataView(r.buffer, 0);
      return { data: i, offset: 0 };
    } else
      return { data: n, offset: e.offset };
  }
  function Ap(n, e) {
    e = e ?? {};
    var t, r, i = new ee({ empty: !0 }), s = new DataView(n, 0), a, o = [], h = z.getTag(s, 0);
    if (h === "\0\0\0" || h === "true" || h === "typ1")
      i.outlinesFormat = "truetype", a = z.getUShort(s, 4), o = oo(s, a);
    else if (h === "OTTO")
      i.outlinesFormat = "cff", a = z.getUShort(s, 4), o = oo(s, a);
    else if (h === "wOFF") {
      var c = z.getTag(s, 4);
      if (c === "\0\0\0")
        i.outlinesFormat = "truetype";
      else if (c === "OTTO")
        i.outlinesFormat = "cff";
      else
        throw new Error("Unsupported OpenType flavor " + h);
      a = z.getUShort(s, 12), o = Mp(s, a);
    } else
      throw new Error("Unsupported OpenType signature " + h);
    for (var u, f, l, p, g, m, x, v, w, b, F, C, _ = 0; _ < a; _ += 1) {
      var E = o[_], B = void 0;
      switch (E.tag) {
        case "cmap":
          B = le(s, E), i.tables.cmap = nh.parse(B.data, B.offset), i.encoding = new sh(i.tables.cmap);
          break;
        case "cvt ":
          B = le(s, E), C = new z.Parser(B.data, B.offset), i.tables.cvt = C.parseShortList(E.length / 2);
          break;
        case "fvar":
          f = E;
          break;
        case "fpgm":
          B = le(s, E), C = new z.Parser(B.data, B.offset), i.tables.fpgm = C.parseByteList(E.length);
          break;
        case "head":
          B = le(s, E), i.tables.head = gh.parse(B.data, B.offset), i.unitsPerEm = i.tables.head.unitsPerEm, t = i.tables.head.indexToLocFormat;
          break;
        case "hhea":
          B = le(s, E), i.tables.hhea = yh.parse(B.data, B.offset), i.ascender = i.tables.hhea.ascender, i.descender = i.tables.hhea.descender, i.numberOfHMetrics = i.tables.hhea.numberOfHMetrics;
          break;
        case "hmtx":
          x = E;
          break;
        case "ltag":
          B = le(s, E), r = vh.parse(B.data, B.offset);
          break;
        case "maxp":
          B = le(s, E), i.tables.maxp = xh.parse(B.data, B.offset), i.numGlyphs = i.tables.maxp.numGlyphs;
          break;
        case "name":
          b = E;
          break;
        case "OS/2":
          B = le(s, E), i.tables.os2 = ds.parse(B.data, B.offset);
          break;
        case "post":
          B = le(s, E), i.tables.post = Ch.parse(B.data, B.offset), i.glyphNames = new Fs(i.tables.post);
          break;
        case "prep":
          B = le(s, E), C = new z.Parser(B.data, B.offset), i.tables.prep = C.parseByteList(E.length);
          break;
        case "glyf":
          l = E;
          break;
        case "loca":
          w = E;
          break;
        case "CFF ":
          u = E;
          break;
        case "kern":
          v = E;
          break;
        case "GDEF":
          p = E;
          break;
        case "GPOS":
          g = E;
          break;
        case "GSUB":
          m = E;
          break;
        case "meta":
          F = E;
          break;
      }
    }
    var I = le(s, b);
    if (i.tables.name = Th.parse(I.data, I.offset, r), i.names = i.tables.name, l && w) {
      var N = t === 0, q = le(s, w), re = kp.parse(q.data, q.offset, i.numGlyphs, N), Y = le(s, l);
      i.glyphs = Oh.parse(Y.data, Y.offset, re, i, e);
    } else if (u) {
      var Z = le(s, u);
      dh.parse(Z.data, Z.offset, i, e);
    } else
      throw new Error("Font doesn't contain TrueType or CFF outlines.");
    var j = le(s, x);
    if (mh.parse(i, j.data, j.offset, i.numberOfHMetrics, i.numGlyphs, i.glyphs, e), Nu(i, e), v) {
      var Q = le(s, v);
      i.kerningPairs = Tp.parse(Q.data, Q.offset);
    } else
      i.kerningPairs = {};
    if (p) {
      var te = le(s, p);
      i.tables.gdef = yp.parse(te.data, te.offset);
    }
    if (g) {
      var ie = le(s, g);
      i.tables.gpos = bp.parse(ie.data, ie.offset), i.position.init();
    }
    if (m) {
      var ne = le(s, m);
      i.tables.gsub = kh.parse(ne.data, ne.offset);
    }
    if (f) {
      var ae = le(s, f);
      i.tables.fvar = cp.parse(ae.data, ae.offset, i.names);
    }
    if (F) {
      var H = le(s, F);
      i.tables.meta = Mh.parse(H.data, H.offset), i.metas = i.tables.meta;
    }
    return i;
  }
  function ho(n, e = !1) {
    const t = n[0].index !== null, r = new Set(Object.keys(n[0].attributes)), i = new Set(Object.keys(n[0].morphAttributes)), s = {}, a = {}, o = n[0].morphTargetsRelative, h = new Oe();
    let c = 0;
    for (let u = 0; u < n.length; ++u) {
      const f = n[u];
      let l = 0;
      if (t !== (f.index !== null))
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + u + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."), null;
      for (const p in f.attributes) {
        if (!r.has(p))
          return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + u + '. All geometries must have compatible attributes; make sure "' + p + '" attribute exists among all geometries, or in none of them.'), null;
        s[p] === void 0 && (s[p] = []), s[p].push(f.attributes[p]), l++;
      }
      if (l !== r.size)
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + u + ". Make sure all geometries have the same number of attributes."), null;
      if (o !== f.morphTargetsRelative)
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + u + ". .morphTargetsRelative must be consistent throughout all geometries."), null;
      for (const p in f.morphAttributes) {
        if (!i.has(p))
          return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + u + ".  .morphAttributes must be consistent throughout all geometries."), null;
        a[p] === void 0 && (a[p] = []), a[p].push(f.morphAttributes[p]);
      }
      if (e) {
        let p;
        if (t)
          p = f.index.count;
        else if (f.attributes.position !== void 0)
          p = f.attributes.position.count;
        else
          return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + u + ". The geometry must have either an index or a position attribute"), null;
        h.addGroup(c, p, u), c += p;
      }
    }
    if (t) {
      let u = 0;
      const f = [];
      for (let l = 0; l < n.length; ++l) {
        const p = n[l].index;
        for (let g = 0; g < p.count; ++g)
          f.push(p.getX(g) + u);
        u += n[l].attributes.position.count;
      }
      h.setIndex(f);
    }
    for (const u in s) {
      const f = co(s[u]);
      if (!f)
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + u + " attribute."), null;
      h.setAttribute(u, f);
    }
    for (const u in a) {
      const f = a[u][0].length;
      if (f === 0) break;
      h.morphAttributes = h.morphAttributes || {}, h.morphAttributes[u] = [];
      for (let l = 0; l < f; ++l) {
        const p = [];
        for (let m = 0; m < a[u].length; ++m)
          p.push(a[u][m][l]);
        const g = co(p);
        if (!g)
          return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + u + " morphAttribute."), null;
        h.morphAttributes[u].push(g);
      }
    }
    return h;
  }
  function co(n) {
    let e, t, r, i = -1, s = 0;
    for (let c = 0; c < n.length; ++c) {
      const u = n[c];
      if (e === void 0 && (e = u.array.constructor), e !== u.array.constructor)
        return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."), null;
      if (t === void 0 && (t = u.itemSize), t !== u.itemSize)
        return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."), null;
      if (r === void 0 && (r = u.normalized), r !== u.normalized)
        return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."), null;
      if (i === -1 && (i = u.gpuType), i !== u.gpuType)
        return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."), null;
      s += u.count * t;
    }
    const a = new e(s), o = new We(a, t, r);
    let h = 0;
    for (let c = 0; c < n.length; ++c) {
      const u = n[c];
      if (u.isInterleavedBufferAttribute) {
        const f = h / t;
        for (let l = 0, p = u.count; l < p; l++)
          for (let g = 0; g < t; g++) {
            const m = u.getComponent(l, g);
            o.setComponent(l + f, g, m);
          }
      } else
        a.set(u.array, h);
      h += u.count * t;
    }
    return i !== void 0 && (o.gpuType = i), o;
  }
  function Ep(n, e = 1e-4) {
    e = Math.max(e, Number.EPSILON);
    const t = {}, r = n.getIndex(), i = n.getAttribute("position"), s = r ? r.count : i.count;
    let a = 0;
    const o = Object.keys(n.attributes), h = {}, c = {}, u = [], f = ["getX", "getY", "getZ", "getW"], l = ["setX", "setY", "setZ", "setW"];
    for (let w = 0, b = o.length; w < b; w++) {
      const F = o[w], C = n.attributes[F];
      h[F] = new C.constructor(
        new C.array.constructor(C.count * C.itemSize),
        C.itemSize,
        C.normalized
      );
      const _ = n.morphAttributes[F];
      _ && (c[F] || (c[F] = []), _.forEach((E, B) => {
        const I = new E.array.constructor(E.count * E.itemSize);
        c[F][B] = new E.constructor(I, E.itemSize, E.normalized);
      }));
    }
    const p = e * 0.5, g = Math.log10(1 / e), m = Math.pow(10, g), x = p * m;
    for (let w = 0; w < s; w++) {
      const b = r ? r.getX(w) : w;
      let F = "";
      for (let C = 0, _ = o.length; C < _; C++) {
        const E = o[C], B = n.getAttribute(E), I = B.itemSize;
        for (let N = 0; N < I; N++)
          F += `${~~(B[f[N]](b) * m + x)},`;
      }
      if (F in t)
        u.push(t[F]);
      else {
        for (let C = 0, _ = o.length; C < _; C++) {
          const E = o[C], B = n.getAttribute(E), I = n.morphAttributes[E], N = B.itemSize, q = h[E], re = c[E];
          for (let Y = 0; Y < N; Y++) {
            const Z = f[Y], j = l[Y];
            if (q[j](a, B[Z](b)), I)
              for (let Q = 0, te = I.length; Q < te; Q++)
                re[Q][j](a, I[Q][Z](b));
          }
        }
        t[F] = a, u.push(a), a++;
      }
    }
    const v = n.clone();
    for (const w in n.attributes) {
      const b = h[w];
      if (v.setAttribute(w, new b.constructor(
        b.array.slice(0, a * b.itemSize),
        b.itemSize,
        b.normalized
      )), w in c)
        for (let F = 0; F < c[w].length; F++) {
          const C = c[w][F];
          v.morphAttributes[w][F] = new C.constructor(
            C.array.slice(0, a * C.itemSize),
            C.itemSize,
            C.normalized
          );
        }
    }
    return v.setIndex(u), v;
  }
  new V();
  class uo extends Vo {
    constructor(e, t, r) {
      super(), this.isFound = !1, this.char = e, this.fontSize = t, this.font = r, this.width = this.getCharWidth(e, t, r);
    }
    /**
     * Converts the text shape to a THREE.js geometry.
     * This is used for 3D rendering of the text.
     * @returns A THREE.js BufferGeometry representing the text shape
     */
    toGeometry() {
      let e = this.font.cache.getGeometry(
        this.char.charCodeAt(0),
        this.fontSize
      );
      if (e == null) {
        const t = this.font.generateShapes(this.char, this.fontSize);
        return e = new Dr(t, 4), e.hasAttribute("uv") && e.deleteAttribute("uv"), e.hasAttribute("normal") && e.deleteAttribute("normal"), Ep(e, 1e-6);
      }
      return e;
    }
    /**
     * Calculates the width of a character in the font.
     * @param char - The character to calculate width for
     * @param fontSize - The size of the font in pixels
     * @param font - The mesh font to use
     * @returns The width of the character in pixels
     */
    getCharWidth(e, t, r) {
      const i = r.data.glyphs[e];
      return i ? (this.isFound = !0, i.ha * t / r.data.resolution) : (this.isFound = !1, 0);
    }
  }
  class Bp {
    constructor(e) {
      this.isFont = !0, this.type = "Font", this.data = e;
    }
    generateShapes(e, t = 100) {
      const r = [], i = _p(e, t, this.data);
      for (let s = 0, a = i.length; s < a; s++)
        r.push(...i[s].toShapes());
      return r;
    }
  }
  function _p(n, e, t) {
    const r = Array.from(n), i = e / t.resolution, s = (t.boundingBox.yMax - t.boundingBox.yMin + t.underlineThickness) * i, a = [];
    let o = 0, h = 0;
    for (let c = 0; c < r.length; c++) {
      const u = r[c];
      if (u === `
`)
        o = 0, h -= s;
      else {
        const f = Op(u, i, o, h, t);
        o += f.offsetX, a.push(f.path);
      }
    }
    return a;
  }
  function Op(n, e, t, r, i) {
    const s = i.glyphs[n] || i.glyphs["?"];
    if (!s) {
      console.error('THREE.Font: character "' + n + '" does not exists in font family ' + i.familyName + ".");
      return;
    }
    const a = new Wo();
    let o, h, c, u, f, l, p, g;
    if (s.o) {
      const m = s._cachedOutline || (s._cachedOutline = s.o.split(" "));
      for (let x = 0, v = m.length; x < v; )
        switch (m[x++]) {
          case "m":
            o = m[x++] * e + t, h = m[x++] * e + r, a.moveTo(o, h);
            break;
          case "l":
            o = m[x++] * e + t, h = m[x++] * e + r, a.lineTo(o, h);
            break;
          case "q":
            c = m[x++] * e + t, u = m[x++] * e + r, f = m[x++] * e + t, l = m[x++] * e + r, a.quadraticCurveTo(f, l, c, u);
            break;
          case "b":
            c = m[x++] * e + t, u = m[x++] * e + r, f = m[x++] * e + t, l = m[x++] * e + r, p = m[x++] * e + t, g = m[x++] * e + r, a.bezierCurveTo(f, l, p, g, c, u);
            break;
        }
    }
    return { offsetX: s.ha * e, path: a };
  }
  class Lp extends Bp {
    /**
     * Generates geometry shapes from the given text and size.
     *
     * Algorithm overview:
     * 1. Split the input text into individual characters.
     * 2. For each character:
     *    a. Retrieve the glyph data from the font.
     *    b. Convert the glyph outline commands into a ShapePath.
     *       - 'm' → moveTo
     *       - 'l' → lineTo
     *       - 'q' → quadraticCurveTo
     *       - 'b' → cubic bezierCurveTo
     *    c. Apply scaling to match the requested font size.
     *    d. Apply offsets for proper placement (supports multiple lines and directions).
     * 3. Handle text direction:
     *    - 'ltr': left-to-right
     *    - 'rtl': right-to-left (characters reversed)
     *    - 'tb': top-to-bottom (vertical layout)
     * 4. Collect all ShapePaths for the text.
     * 5. Convert each ShapePath into one or more Shape objects:
     *    a. Sample points along each subPath to approximate geometry.
     *    b. Determine which subPaths are outer contours and which are holes:
     *       - For each subPath, check if it is fully contained inside another polygon.
     *       - Assign the smallest containing polygon as its parent.
     *    c. Compute the relative depth of each subPath to handle nested holes.
     *    d. Reverse curves if necessary to maintain correct clockwise/counterclockwise winding:
     *       - Outer contours: CCW
     *       - Holes: CW
     *    e. Build Shape objects with holes properly assigned.
     * 6. Return the final array of Shape objects ready for geometry creation.
     *
     * This algorithm ensures that complex characters with multiple independent contours
     * (including intersecting subpaths or holes) are rendered correctly.
     *
     * @param text - input string to convert to shapes
     * @param size - font size in units (default 100)
     * @param direction - text direction ('ltr', 'rtl', 'tb')
     * @returns array of Shape objects with proper holes and contours
     */
    generateShapes(e, t = 100, r = "ltr") {
      const i = [];
      return Up(e, t, this.data, r).forEach((a) => {
        i.push(...Gp(a));
      }), i;
    }
  }
  function Up(n, e, t, r = "ltr") {
    const i = Array.from(n), s = e / t.resolution, a = (t.boundingBox.yMax - t.boundingBox.yMin + t.underlineThickness) * s, o = [];
    let h = 0, c = 0;
    (r === "rtl" || r === "tb") && i.reverse();
    for (const u of i)
      if (u === `
`)
        h = 0, c -= a;
      else {
        const f = Rp(u, s, h, c, t);
        if (!f) continue;
        r === "tb" ? (h = 0, c += t.ascender * s) : h += f.offsetX, o.push(f.path);
      }
    return o;
  }
  function Rp(n, e, t, r, i) {
    const s = i.glyphs[n] || i.glyphs["?"];
    if (!s) {
      console.error(
        `THREE.Font: character "${n}" does not exist in font family ${i.familyName}.`
      );
      return;
    }
    const a = new Wo();
    if (s.o) {
      const o = s.o.split(" ");
      let h = 0;
      for (; h < o.length; ) {
        const c = o[h++];
        let u, f, l, p, g, m, x, v;
        switch (c) {
          case "m":
            u = parseFloat(o[h++]) * e + t, f = parseFloat(o[h++]) * e + r, a.moveTo(u, f);
            break;
          case "l":
            u = parseFloat(o[h++]) * e + t, f = parseFloat(o[h++]) * e + r, a.lineTo(u, f);
            break;
          case "q":
            l = parseFloat(o[h++]) * e + t, p = parseFloat(o[h++]) * e + r, g = parseFloat(o[h++]) * e + t, m = parseFloat(o[h++]) * e + r, a.quadraticCurveTo(g, m, l, p);
            break;
          case "b":
            l = parseFloat(o[h++]) * e + t, p = parseFloat(o[h++]) * e + r, g = parseFloat(o[h++]) * e + t, m = parseFloat(o[h++]) * e + r, x = parseFloat(o[h++]) * e + t, v = parseFloat(o[h++]) * e + r, a.bezierCurveTo(g, m, x, v, l, p);
            break;
        }
      }
    }
    return { offsetX: s.ha * e, path: a };
  }
  function Dp(n, e) {
    let t = !1;
    const { x: r, y: i } = n, s = e.length;
    for (let a = 0, o = s - 1; a < s; o = a++) {
      const h = e[a].x, c = e[a].y, u = e[o].x, f = e[o].y;
      c > i != f > i && r < (u - h) * (i - c) / (f - c) + h && (t = !t);
    }
    return t;
  }
  function Ip(n) {
    const e = n.length, t = Array(e).fill(null);
    for (let r = 0; r < e; r++) {
      let i = null, s = 1 / 0;
      for (let a = 0; a < e; a++)
        if (r !== a && n[r].every((o) => Dp(o, n[a]))) {
          const o = Math.abs(Tt.area(n[a]));
          o < s && (s = o, i = a);
        }
      t[r] = i;
    }
    return t;
  }
  function Pp(n) {
    const e = n.length, t = Array.from({ length: e }, () => []);
    for (let r = 0; r < e; r++) {
      const i = n[r];
      i !== null && t[i].push(r);
    }
    return t;
  }
  function zp(n) {
    return n.map((e, t) => e === null ? t : -1).filter((e) => e >= 0);
  }
  function Np(n) {
    const e = [];
    for (let t = n.length - 1; t >= 0; t--) {
      const r = n[t];
      if (r instanceof Ar)
        e.push(new Ar(r.v2.clone(), r.v1.clone()));
      else if (r instanceof Pn)
        e.push(
          new Pn(r.v2.clone(), r.v1.clone(), r.v0.clone())
        );
      else if (r instanceof In)
        e.push(
          new In(
            r.v3.clone(),
            r.v2.clone(),
            r.v1.clone(),
            r.v0.clone()
          )
        );
      else if (r instanceof Or)
        e.push(
          new Or(
            r.aX,
            r.aY,
            r.xRadius,
            r.yRadius,
            r.aEndAngle,
            r.aStartAngle,
            !r.aClockwise,
            r.aRotation
          )
        );
      else if (typeof r.getPoints == "function") {
        const i = r.getPoints(8);
        for (let s = i.length - 1; s > 0; s--)
          e.push(new Ar(i[s].clone(), i[s - 1].clone()));
      }
    }
    return e;
  }
  function lo(n, e) {
    const t = Tt.area(n.getPoints(32)) > 0, r = e === t ? n.curves.slice() : Np(n.curves), i = new or();
    return i.curves.push(...r), i;
  }
  function Gp(n, e = 32) {
    const t = n.subPaths;
    if (!t || t.length === 0) return [];
    const r = t.map((p) => p.getPoints(e)), i = Ip(r), s = Pp(i), a = zp(i), o = t.length, h = Array(o).fill(-1), c = Array(o).fill(-1);
    for (const p of a) {
      const g = [{ idx: p, d: 0 }];
      for (; g.length; ) {
        const m = g.pop();
        h[m.idx] = m.d, c[m.idx] = p;
        for (const x of s[m.idx]) g.push({ idx: x, d: m.d + 1 });
      }
    }
    const u = [], f = /* @__PURE__ */ new Set();
    function l(p) {
      const g = lo(t[p], !0);
      f.add(p);
      for (const m of s[p])
        if (!f.has(m) && h[m] === h[p] + 1) {
          const x = lo(t[m], !1);
          g.holes.push(x), f.add(m);
        }
      u.push(g);
    }
    for (const p of a) l(p);
    for (let p = 0; p < o; p++)
      f.has(p) || l(p);
    return u;
  }
  class Hp {
    constructor(e = 512) {
      this.maxSize = e, this.map = /* @__PURE__ */ new Map();
    }
    get(e) {
      const t = this.map.get(e);
      return t && (this.map.delete(e), this.map.set(e, t)), t;
    }
    set(e, t) {
      if (this.map.has(e))
        this.map.delete(e);
      else if (this.map.size >= this.maxSize) {
        const r = this.map.keys().next().value;
        r !== void 0 && this.map.delete(r);
      }
      this.map.set(e, t);
    }
    has(e) {
      return this.map.has(e);
    }
    clear() {
      this.map.clear();
    }
  }
  class Wp extends qo {
    /**
     * Creates a new instance of MeshFont.
     * @param fontData - Either a MeshFontData object containing font information or an ArrayBuffer containing raw font data
     */
    constructor(e) {
      super(e), this.type = "mesh", this.glyphCache = new Hp(512);
      const t = e.data;
      if (t instanceof ArrayBuffer) {
        const r = this.parseMeshFont(t);
        this.data = r.data, this.opentypeFont = r.font;
      } else
        throw new Error(
          "Invalid font cache data. Please remove font cache database named 'mlightcad' in IndexedDB and try again!"
        );
      this.font = new Lp(this.data);
    }
    /**
     * Parses a mesh font from raw binary data.
     * This function converts raw font data (e.g., TTF, OTF, WOFF) into a MeshFontData object
     * that can be used by the MeshFont class.
     *
     * @param data - The raw font data as an ArrayBuffer
     * @returns An object containing the opentype font and parsed metadata
     */
    parseMeshFont(e) {
      const t = Ap(e), r = Math.round, i = t.charToGlyph("A"), s = i ? t.unitsPerEm / (i.yMax || t.unitsPerEm) : 1, a = {
        glyphs: {},
        // Lazy loaded later
        familyName: t.getEnglishName("fullName"),
        ascender: r(t.ascender),
        descender: r(t.descender),
        underlinePosition: t.tables.post.underlinePosition,
        underlineThickness: t.tables.post.underlineThickness,
        boundingBox: {
          xMin: t.tables.head.xMin,
          xMax: t.tables.head.xMax,
          yMin: t.tables.head.yMin,
          yMax: t.tables.head.yMax
        },
        resolution: t.unitsPerEm || 1e3,
        scaleFactor: s,
        original_font_information: t.tables.name
      };
      return { font: t, data: a };
    }
    /**
     * Return true if this font contains glyph of the specified character. Otherwise, return false.
     * @param char - The character to check
     * @returns True if this font contains glyph of the specified character. Otherwise, return false.
     */
    hasChar(e) {
      return this.opentypeFont.hasChar(e);
    }
    /**
     * Return true if this font contains glyph of the specified character code. Otherwise, return false.
     * @param code - The character code to check
     * @returns True if this font contains glyph of the specified character code. Otherwise, return false.
     */
    hasCode(e) {
      return this.hasChar(String.fromCodePoint(e));
    }
    /**
     * Loads glyph data lazily when requested.
     * Parsed glyphs are cached in an LRU cache to limit memory usage.
     * @param char - The character whose glyph should be loaded
     */
    _loadGlyphIfNeeded(e) {
      if (this.data.glyphs[e] || !this.opentypeFont) return;
      const t = this.glyphCache.get(e);
      if (t) {
        this.data.glyphs[e] = t;
        return;
      }
      const r = this.opentypeFont.charToGlyph(e);
      if (!r || !r.path) return;
      const i = Math.round, s = {
        ha: i(r.advanceWidth ?? 0),
        x_min: i(r.xMin ?? 0),
        x_max: i(r.xMax ?? 0),
        o: ""
      };
      r.path.commands.forEach((a) => {
        let o = a.type.toLowerCase();
        o === "c" && (o = "b"), s.o += o + " ", a.x !== void 0 && a.y !== void 0 && (s.o += i(a.x) + " " + i(a.y) + " "), a.x1 !== void 0 && a.y1 !== void 0 && (s.o += i(a.x1) + " " + i(a.y1) + " "), a.x2 !== void 0 && a.y2 !== void 0 && (s.o += i(a.x2) + " " + i(a.y2) + " ");
      }), this.data.glyphs[e] = s, this.glyphCache.set(e, s);
    }
    /**
     * Generates shapes for a text string
     * @param text - The text to generate shapes for
     * @param size - The size of the text
     * @returns Array of shapes representing the text
     */
    generateShapes(e, t) {
      for (const r of e)
        this._loadGlyphIfNeeded(r);
      return this.font.generateShapes(e, t);
    }
    /**
     * Gets the shape data for a specific character at a given size.
     * @param char - The character to get the shape for
     * @param size - The desired size of the character
     * @returns The shape data for the character, or undefined if not found
     */
    getCharShape(e, t) {
      if (this._loadGlyphIfNeeded(e), !this.data.glyphs[e]) {
        this.addUnsupportedChar(e);
        return;
      }
      return new uo(e, t, this);
    }
    /**
     * Gets the shape data for a specific character unicode at a given size.
     * @param code - The character unicode to get the shape for
     * @param size - The desired size of the character
     * @returns The shape data for the character unicode, or undefined if not found
     */
    getCodeShape(e, t) {
      return this.getCharShape(String.fromCodePoint(e), t);
    }
    /**
     * Gets the scale factor for this font.
     * This is used to adjust the size of characters when rendering.
     * @returns The scale factor as a number
     */
    getScaleFactor() {
      return this.scaleFactor == null ? (this.scaleFactor = this.data.scaleFactor, this.scaleFactor) : this.scaleFactor;
    }
    /**
     * Gets the shape to display when a character is not found in the font.
     * Uses "?" as a replacement character.
     * @param size - The desired size of the not found shape
     * @returns The shape data for the not found indicator
     */
    getNotFoundTextShape(e) {
      return new uo("?", e, this);
    }
  }
  let be = class {
    /**
     * Converts an unsigned byte to a signed byte as used in SHX format.
     * Values > 127 are converted to their signed equivalent (-128 to -1).
     * @param value - The unsigned byte value to convert
     * @returns The signed byte value
     */
    static byteToSByte(e) {
      return (e & 127) - (e & 128 ? 128 : 0);
    }
    /**
     * Creates a new ShxFileReader instance.
     * @param arraybuffer - The ArrayBuffer to read from
     */
    constructor(e) {
      this.position = 0, this.data = new DataView(e);
    }
    /**
     * Reads a specified number of bytes from the current position.
     * @param length - Number of bytes to read (optional)
     * @returns A Uint8Array containing the read bytes
     * @throws Error if reading beyond buffer bounds
     */
    readBytes(e = 1) {
      this.data.byteLength < this.position + e && this.throwOutOfRangeError(this.position + e);
      const t = new Uint8Array(this.data.buffer, this.position, e);
      return this.position += e, t;
    }
    /**
     * Skips a specified number of bytes from the current position.
     * @param length - Number of bytes to skip
     * @throws Error if skipping beyond buffer bounds
     */
    skip(e) {
      this.data.byteLength < this.position + e && this.throwOutOfRangeError(this.position + e), this.position += e;
    }
    /**
     * Reads an unsigned 8-bit integer.
     * @returns The read uint8 value
     * @throws Error if reading beyond buffer bounds
     */
    readUint8() {
      this.data.byteLength < this.position + 1 && this.throwOutOfRangeError(this.position + 1);
      const e = this.data.getUint8(this.position);
      return this.position += 1, e;
    }
    /**
     * Reads a signed 8-bit integer.
     * @returns The read int8 value
     * @throws Error if reading beyond buffer bounds
     */
    readInt8() {
      this.data.byteLength < this.position + 1 && this.throwOutOfRangeError(this.position + 1);
      const e = this.data.getInt8(this.position);
      return this.position += 1, e;
    }
    /**
     * Reads an unsigned 16-bit integer.
     * @param littleEndian If false, a big-endian value should be read.
     * @returns The read uint16 value
     * @throws Error if reading beyond buffer bounds
     */
    readUint16(e = !0) {
      this.data.byteLength < this.position + 2 && this.throwOutOfRangeError(this.position + 2);
      const t = this.data.getUint16(this.position, e);
      return this.position += 2, t;
    }
    /**
     * Reads a signed 16-bit integer.
     * @returns The read int16 value
     * @throws Error if reading beyond buffer bounds
     */
    readInt16() {
      this.data.byteLength < this.position + 2 && this.throwOutOfRangeError(this.position + 2);
      const e = this.data.getInt16(this.position, !0);
      return this.position += 2, e;
    }
    /**
     * Reads an unsigned 32-bit integer.
     * @returns The read uint32 value
     * @throws Error if reading beyond buffer bounds
     */
    readUint32() {
      this.data.byteLength < this.position + 4 && this.throwOutOfRangeError(this.position + 4);
      const e = this.data.getUint32(this.position, !0);
      return this.position += 4, e;
    }
    /**
     * Reads a signed 32-bit integer.
     * @returns The read int32 value
     * @throws Error if reading beyond buffer bounds
     */
    readInt32() {
      this.data.byteLength < this.position + 4 && this.throwOutOfRangeError(this.position + 4);
      const e = this.data.getInt32(this.position, !0);
      return this.position += 4, e;
    }
    /**
     * Reads a 32-bit floating point number.
     * @returns The read float32 value
     * @throws Error if reading beyond buffer bounds
     */
    readFloat32() {
      this.data.byteLength < this.position + 4 && this.throwOutOfRangeError(this.position + 4);
      const e = this.data.getFloat32(this.position, !0);
      return this.position += 4, e;
    }
    /**
     * Reads a 64-bit floating point number.
     * @returns The read float64 value
     * @throws Error if reading beyond buffer bounds
     */
    readFloat64() {
      this.data.byteLength < this.position + 8 && this.throwOutOfRangeError(this.position + 8);
      const e = this.data.getFloat64(this.position, !0);
      return this.position += 8, e;
    }
    /**
     * Sets the current read position in the buffer.
     * @param position - The new position to set
     */
    setPosition(e) {
      this.data.byteLength < e && this.throwOutOfRangeError(e), this.position = e;
    }
    /**
     * Checks if the current position is at the end of the buffer.
     * @returns True if at the end of the buffer, false otherwise
     */
    isEnd() {
      return this.position === this.data.byteLength - 1;
    }
    /**
     * Gets the current position in the buffer.
     * @returns The current position
     */
    get currentPosition() {
      return this.position;
    }
    /**
     * Gets the total length of the buffer.
     * @returns The buffer length in bytes
     */
    get length() {
      return this.data.byteLength;
    }
    /**
     * Throws an error when attempting to read beyond buffer bounds.
     * @param position - The position that caused the error
     * @throws Error with details about the out of range access
     */
    throwOutOfRangeError(e) {
      throw new Error(
        `Position ${e} is out of range for the data length ${this.data.byteLength}!`
      );
    }
  };
  var Se = /* @__PURE__ */ ((n) => (n.SHAPES = "shapes", n.BIGFONT = "bigfont", n.UNIFONT = "unifont", n))(Se || {});
  class qp {
    parse(e) {
      const t = this.parseHeader(e).split(" "), r = t[1].toLocaleLowerCase();
      if (!Object.values(Se).includes(r))
        throw new Error(`Invalid font type: ${r}`);
      return {
        fileHeader: t[0],
        fontType: r,
        fileVersion: t[2]
      };
    }
    parseHeader(e) {
      let t = "", r = 0;
      for (; e.currentPosition < e.length - 2 && r < 1024; ) {
        const i = e.readUint8();
        if (i === 13) {
          const s = e.currentPosition, a = e.readUint8(), o = e.readUint8();
          if (a === 10 && o === 26)
            break;
          e.setPosition(s), t += String.fromCharCode(i);
        } else
          t += String.fromCharCode(i);
        r++;
      }
      return t.trim();
    }
  }
  const Le = 10;
  class Vp {
    parse(e) {
      try {
        e.readBytes(4);
        const t = e.readInt16();
        if (t <= 0)
          throw new Error("Invalid shape count in font file");
        const r = [];
        for (let a = 0; a < t; a++) {
          const o = e.readUint16(), h = e.readUint16();
          h > 0 && r.push({ code: o, length: h });
        }
        const i = {};
        for (const a of r)
          try {
            const o = e.readBytes(a.length);
            if (o.length === a.length) {
              const h = o.indexOf(0);
              let c = 0;
              h >= 0 && h < o.length && (c = h + 1), c < o.length && (i[a.code] = o.subarray(c));
            }
          } catch {
            console.warn(`Failed to read shape data for code ${a.code}`);
          }
        const s = {
          data: i,
          info: "",
          baseUp: 8,
          baseDown: 2,
          height: Le,
          width: Le,
          orientation: "horizontal",
          isExtended: !1
        };
        if (0 in i) {
          const a = i[0];
          try {
            const o = new TextDecoder().decode(a);
            let h = o.indexOf("\0");
            h >= 0 && (s.info = o.substring(0, h), h + 3 < a.length && (s.baseUp = a[h + 1], s.baseDown = a[h + 2], s.height = s.baseDown + s.baseUp, s.width = s.height, s.orientation = a[h + 3] === 0 ? "horizontal" : "vertical"));
          } catch {
            console.warn("Failed to parse font info block");
          }
        }
        return s;
      } catch (t) {
        return console.error("Error parsing shape font:", t), {
          data: {},
          info: "Failed to parse font file",
          baseUp: 8,
          baseDown: 2,
          height: Le,
          width: Le,
          orientation: "horizontal",
          isExtended: !1
        };
      }
    }
  }
  class Xp {
    parse(e) {
      try {
        e.readInt16();
        const t = e.readInt16(), r = e.readInt16();
        if (t <= 0)
          throw new Error("Invalid character count in font file");
        e.skip(r * 4);
        const i = [];
        for (let o = 0; o < t; o++) {
          const h = e.readUint16(), c = e.readUint16(), u = e.readUint32();
          (h !== 0 || c !== 0 || u !== 0) && i.push({ code: h, length: c, offset: u });
        }
        const s = {};
        for (const o of i)
          try {
            e.setPosition(o.offset);
            const h = e.readBytes(o.length);
            h.length === o.length && (s[o.code] = h);
          } catch {
            console.warn(`Failed to read bigfont data for code ${o.code}`);
          }
        const a = {
          data: s,
          info: "",
          baseUp: 8,
          baseDown: 2,
          height: Le,
          width: Le,
          orientation: "horizontal",
          isExtended: !1
        };
        if (0 in s) {
          const o = s[0];
          try {
            const h = this.utf8ArrayToStr(o);
            let c = h.pos;
            c >= 0 && (a.info = h.text, c++, c + 3 < o.length && (o.length - c > 4 ? (a.height = o[c++], c++, a.orientation = o[c++] === 0 ? "horizontal" : "vertical", a.width = o[c++], a.baseUp = a.height, a.baseDown = 0, a.isExtended = !0) : (a.baseUp = o[c++], a.baseDown = o[c++], a.height = a.baseDown + a.baseUp, a.width = a.height, a.orientation = o[c] === 0 ? "horizontal" : "vertical")));
          } catch {
            console.warn("Failed to parse bigfont info block");
          }
        }
        return a;
      } catch (t) {
        return console.error("Error parsing big font:", t), {
          data: {},
          info: "Failed to parse font file",
          baseUp: 8,
          baseDown: 2,
          height: Le,
          width: Le,
          orientation: "horizontal",
          isExtended: !1
        };
      }
    }
    utf8ArrayToStr(e) {
      let t = "", r = 0;
      for (; r < e.length; ) {
        const i = e[r];
        switch (i >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            t += String.fromCharCode(i);
            break;
          case 12:
          case 13: {
            const s = e[r++];
            t += String.fromCharCode((i & 31) << 6 | s & 63);
            break;
          }
          case 14: {
            const s = e[r++], a = e[r++];
            t += String.fromCharCode(
              (i & 15) << 12 | (s & 63) << 6 | (a & 63) << 0
            );
            break;
          }
        }
        if (t.charCodeAt(t.length - 1) === 0) break;
        r++;
      }
      return { text: t, pos: r };
    }
  }
  class Yp {
    parse(e) {
      try {
        const t = e.readInt32();
        if (t <= 0)
          throw new Error("Invalid character count in font file");
        const r = e.readInt16(), i = e.readBytes(r), s = {
          data: {},
          info: "",
          baseUp: 8,
          baseDown: 2,
          height: Le,
          width: Le,
          orientation: "horizontal",
          isExtended: !1
        };
        try {
          const o = new TextDecoder().decode(i);
          let h = o.indexOf("\0");
          h >= 0 && (s.info = o.substring(0, h), h + 3 < i.length && (s.baseUp = i[h + 1], s.baseDown = i[h + 2], s.height = s.baseUp + s.baseDown, s.width = s.height, s.orientation = i[h + 3] === 0 ? "horizontal" : "vertical"));
        } catch {
          console.warn("Failed to parse unifont info block");
        }
        const a = {};
        for (let o = 0; o < t - 1; o++)
          try {
            const h = e.readUint16(), c = e.readUint16();
            if (c > 0) {
              const u = e.readBytes(c);
              if (u.length === c) {
                const f = u.indexOf(0);
                let l = 0;
                f >= 0 && f < u.length && (l = f + 1), l < u.length && (a[h] = u.subarray(l));
              }
            }
          } catch {
            console.warn("Failed to read unifont character data");
            break;
          }
        return s.data = a, s;
      } catch (t) {
        return console.error("Error parsing unifont:", t), {
          data: {},
          info: "Failed to parse font file",
          baseUp: 8,
          baseDown: 2,
          height: Le,
          width: Le,
          orientation: "horizontal",
          isExtended: !1
        };
      }
    }
  }
  let Zp = class {
    static createParser(e) {
      switch (e) {
        case Se.SHAPES:
          return new Vp();
        case Se.BIGFONT:
          return new Xp();
        case Se.UNIFONT:
          return new Yp();
        default:
          throw new Error(`Unsupported font type: ${e}`);
      }
    }
  };
  class ce {
    /**
     * Creates a new Point instance.
     * @param x - The x-coordinate (defaults to 0)
     * @param y - The y-coordinate (defaults to 0)
     */
    constructor(e = 0, t = 0) {
      this.x = e, this.y = t;
    }
    /**
     * Sets the coordinates of the point.
     * @param x - The new x-coordinate
     * @param y - The new y-coordinate
     * @returns The point instance for method chaining
     */
    set(e, t) {
      return this.x = e, this.y = t, this;
    }
    /**
     * Calculates the length (magnitude) of the vector from origin to this point.
     * @returns The length of the vector
     */
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Normalizes the point vector to have a length of 1.
     * @returns The point instance for method chaining
     */
    normalize() {
      const e = this.length();
      return e !== 0 && (this.x /= e, this.y /= e), this;
    }
    /**
     * Creates a new Point instance with the same coordinates.
     * @returns A new Point instance with the same x and y values
     */
    clone() {
      return new ce(this.x, this.y);
    }
    /**
     * Adds another point's coordinates to this point.
     * @param point - The point to add
     * @returns The point instance for method chaining
     */
    add(e) {
      return this.x += e.x, this.y += e.y, this;
    }
    /**
     * Subtracts another point's coordinates from this point.
     * @param point - The point to subtract
     * @returns The point instance for method chaining
     */
    subtract(e) {
      return this.x -= e.x, this.y -= e.y, this;
    }
    /**
     * Multiplies both coordinates by a scalar value.
     * @param scalar - The scalar value to multiply by
     * @returns The point instance for method chaining
     */
    multiply(e) {
      return this.x *= e, this.y *= e, this;
    }
    /**
     * Divides both coordinates by a scalar value.
     * @param scalar - The scalar value to divide by
     * @returns The point instance for method chaining
     */
    divide(e) {
      return e !== 0 && (this.x /= e, this.y /= e), this;
    }
    /**
     * Multiplies x and y coordinates by different scalar values.
     * @param xScalar - The scalar value to multiply x-coordinate by
     * @param yScalar - The scalar value to multiply y-coordinate by
     * @returns The point instance for method chaining
     */
    multiplyScalars(e, t) {
      return this.x *= e, this.y *= t, this;
    }
    /**
     * Divides x and y coordinates by different scalar values.
     * @param xScalar - The scalar value to divide x-coordinate by
     * @param yScalar - The scalar value to divide y-coordinate by
     * @returns The point instance for method chaining
     */
    divideScalars(e, t) {
      return e !== 0 && (this.x /= e), t !== 0 && (this.y /= t), this;
    }
    /**
     * Calculates the Euclidean distance to another point.
     * @param point - The point to calculate distance to
     * @returns The distance between the two points
     */
    distanceTo(e) {
      const t = this.x - e.x, r = this.y - e.y;
      return Math.sqrt(t * t + r * r);
    }
  }
  const fo = Math.PI / 4;
  class Gr {
    /**
     * Creates a bulge-defined arc
     * @param start Start point
     * @param end End point
     * @param bulge Bulge factor (-1 to 1, where 1 is a semicircle)
     */
    static fromBulge(e, t, r) {
      const i = Math.max(-1, Math.min(1, r));
      return new Gr({
        start: e,
        end: t,
        bulge: i
      });
    }
    /**
     * Creates an octant-defined arc
     * @param center Center point of the arc
     * @param radius Radius of the arc
     * @param startOctant Starting octant (0-7)
     * @param octantCount Number of octants to span (0-8, where 0 means 8 octants)
     * @param isClockwise Whether the arc goes clockwise
     */
    static fromOctant(e, t, r, i, s) {
      return new Gr({
        center: e,
        radius: t,
        startOctant: r,
        octantCount: i,
        isClockwise: s
      });
    }
    constructor(e) {
      if (e.start && e.end && e.bulge !== void 0) {
        this.start = e.start.clone(), this.end = e.end.clone(), this.bulge = e.bulge, this.isClockwise = e.bulge < 0;
        const t = this.end.clone().subtract(this.start), r = t.length();
        if (Math.abs(this.bulge) * r / 2 === 0) {
          this.radius = 0, this.center = this.start.clone(), this.startAngle = Math.atan2(t.y, t.x), this.endAngle = this.startAngle;
          return;
        }
        const i = 4 * Math.atan(Math.abs(this.bulge));
        this.radius = r / (2 * Math.sin(i / 2));
        const s = this.start.clone().add(t.clone().divide(2)), a = new ce(-t.y, t.x);
        a.normalize(), a.multiply(Math.abs(this.radius * Math.cos(i / 2))), this.center = s.clone(), this.isClockwise ? this.center.subtract(a) : this.center.add(a), this.startAngle = Math.atan2(this.start.y - this.center.y, this.start.x - this.center.x), this.endAngle = Math.atan2(this.end.y - this.center.y, this.end.x - this.center.x), this.isClockwise ? this.endAngle >= this.startAngle && (this.endAngle -= 2 * Math.PI) : this.endAngle <= this.startAngle && (this.endAngle += 2 * Math.PI);
      } else if (e.center && e.radius !== void 0 && e.startOctant !== void 0 && e.octantCount !== void 0 && e.isClockwise !== void 0) {
        this.center = e.center.clone(), this.radius = e.radius, this.isClockwise = e.isClockwise, this.startAngle = e.startOctant * fo;
        const t = (e.octantCount === 0 ? 8 : e.octantCount) * fo;
        this.endAngle = this.startAngle + (this.isClockwise ? -t : t), this.start = this.center.clone().add(
          new ce(
            this.radius * Math.cos(this.startAngle),
            this.radius * Math.sin(this.startAngle)
          )
        ), this.end = this.center.clone().add(
          new ce(this.radius * Math.cos(this.endAngle), this.radius * Math.sin(this.endAngle))
        );
      } else
        throw new Error("Invalid arc parameters");
    }
    /**
     * Tessellates the arc into a series of points that approximate the arc.
     * @param circleSpan The angle span between tessellated points (default Math.PI / 18)
     * @returns Array of points representing the tessellated arc
     */
    tessellate(e = Math.PI / 18) {
      if (this.radius === 0)
        return [this.start.clone(), this.end.clone()];
      const t = [this.start.clone()], r = Math.abs(this.endAngle - this.startAngle), i = Math.max(1, Math.floor(r / e));
      for (let s = 1; s < i; s++) {
        const a = s / i, o = this.isClockwise ? this.startAngle - a * r : this.startAngle + a * r;
        t.push(
          this.center.clone().add(new ce(this.radius * Math.cos(o), this.radius * Math.sin(o)))
        );
      }
      return t.push(
        this.end ? this.end.clone() : this.center.clone().add(
          new ce(
            this.radius * Math.cos(this.endAngle),
            this.radius * Math.sin(this.endAngle)
          )
        )
      ), t;
    }
  }
  class _r {
    constructor(e, t = []) {
      this.lastPoint = e, this.polylines = t;
    }
    /**
     * Get the bounding box of the shape
     * @returns Bounding box of the shape
     */
    get bbox() {
      if (this._bbox)
        return this._bbox;
      let e = 1 / 0, t = -1 / 0, r = 1 / 0, i = -1 / 0;
      return this.polylines.forEach((s) => {
        s.forEach((a) => {
          e = Math.min(e, a.x), t = Math.max(t, a.x), r = Math.min(r, a.y), i = Math.max(i, a.y);
        });
      }), this._bbox = { minX: e, minY: r, maxX: t, maxY: i }, this._bbox;
    }
    /**
     * Offset the shape by a point
     * @param p The point to offset the shape by
     * @param isNewInstance Whether to return a new instance of the shape or modify the current instance
     * @returns The offset shape
     */
    offset(e, t = !0) {
      var r, i;
      return t ? new _r(
        (r = this.lastPoint) == null ? void 0 : r.clone().add(e),
        this.polylines.map((s) => s.map((a) => a.clone().add(e)))
      ) : ((i = this.lastPoint) == null || i.add(e), this.polylines.forEach((s) => s.forEach((a) => a.add(e))), this._bbox && (this._bbox.maxX += e.x, this._bbox.minX += e.x, this._bbox.maxY += e.y, this._bbox.minY += e.y), this);
    }
    /**
     * Normalizes a shape so that its bounding box’s bottom-left corner moves to the origin (0,0).
     * It doesn’t change the size or orientation, only repositions the shape.
     * @param isNewInstance Whether to return a new instance of the shape or modify the current instance
     * @returns The offset shape
     */
    normalizeToOrigin(e = !1) {
      const t = this.bbox;
      return this.offset(new ce(-t.minX, -t.minY), e);
    }
    /**
     * Converts the shape to an SVG string
     * @param options SVG rendering options
     * @returns SVG string
     */
    toSVG(e = {}) {
      const { strokeWidth: t = "0.5%", strokeColor: r = "black", isAutoFit: i = !1 } = e;
      let s, a;
      if (i) {
        const o = this.bbox, h = 0.2, c = o.maxX - o.minX, u = o.maxY - o.minY, f = c === 0 ? u : c, l = u === 0 ? c : u, p = o.minX - f * h, g = o.maxX + f * h, m = o.minY - l * h, x = o.maxY + l * h;
        a = this.polylines.map((v) => {
          let w = "";
          return v.forEach((b, F) => {
            const C = b.x, _ = -b.y;
            w += F === 0 ? `M ${C} ${_} ` : `L ${C} ${_} `;
          }), `<path d="${w}" stroke="${r}" stroke-width="${t}" fill="none"/>`;
        }).join(""), s = `${p} ${-x} ${g - p} ${x - m}`;
      } else
        s = "0 0 20 20", a = this.polylines.map((o) => {
          let h = "";
          return o.forEach((c, u) => {
            const f = c.x + 5, l = -c.y + 15;
            h += u === 0 ? `M ${f} ${l} ` : `L ${f} ${l} `;
          }), `<path d="${h}" stroke="${r}" stroke-width="${t}" fill="none"/>`;
        }).join("");
      return `<svg width="100%" height="100%" viewBox="${s}" preserveAspectRatio="xMidYMid meet">${a}</svg>`;
    }
  }
  const Jp = Math.PI / 18;
  class $p {
    constructor(e) {
      this.shapeCache = /* @__PURE__ */ new Map(), this.shapeData = /* @__PURE__ */ new Map(), this.fontData = e;
    }
    /**
     * Releases parsed shapes and cached shapes
     */
    release() {
      this.shapeCache.clear(), this.shapeData.clear();
    }
    /**
     * Parses a character's shape with the given font size.
     * @param code - The character code
     * @param size - The font size
     * @returns The parsed shape or undefined if the character is not found
     */
    getCharShape(e, t) {
      const r = t / this.fontData.content.height;
      return this.parseAndScale(e, { factor: r });
    }
    /**
     * Parses a character's shape with scaling options
     * @param code - The character code
     * @param options - Scaling options (factor or height/width)
     * @returns The parsed shape or undefined if the character is not found
     */
    parseAndScale(e, t) {
      if (e === 0)
        return;
      let r;
      if (this.shapeCache.has(e))
        r = this.shapeCache.get(e);
      else {
        const i = this.fontData.content.data;
        if (i[e]) {
          const s = i[e];
          r = this.parseShape(s), this.shapeData.set(e, r), this.shapeCache.set(e, r);
        }
      }
      if (r) {
        if (t.factor !== void 0)
          return this.scaleShapeByFactor(r, t.factor);
        if (t.height !== void 0) {
          const i = t.width ?? t.height;
          return this.scaleShapeByHeightAndWidth(r, t.height, i);
        } else
          return r;
      }
    }
    /**
     * Scales a shape according to the given scale factor
     * @param shape - The shape to scale
     * @param factor - The scale factor
     * @returns The scaled shape
     */
    scaleShapeByFactor(e, t) {
      var r;
      return new _r(
        (r = e.lastPoint) == null ? void 0 : r.clone().multiply(t),
        e.polylines.map((i) => i.map((s) => s.clone().multiply(t)))
      );
    }
    /**
     * Scales a shape according to the given height and width
     * @param shape - The shape to scale
     * @param height - The target height
     * @param width - The target width
     * @returns The scaled shape
     */
    scaleShapeByHeightAndWidth(e, t, r) {
      var i;
      const s = e.bbox, a = s.maxY - s.minY, o = s.maxX - s.minX, h = a > 0 ? t / a : 1, c = o > 0 ? r / o : 1, u = (i = e.lastPoint) == null ? void 0 : i.clone();
      u && (u.x *= c, u.y *= h);
      const f = e.polylines.map(
        (l) => l.map((p) => {
          const g = p.clone();
          return g.x *= c, g.y *= h, g;
        })
      );
      return new _r(u, f);
    }
    /**
     * Parses the shape of a character.
     * @param data - The data of the character
     * @returns The parsed shape
     */
    parseShape(e) {
      const t = {
        currentPoint: new ce(),
        polylines: [],
        currentPolyline: [],
        sp: [],
        isPenDown: !1,
        scale: 1
      };
      for (let r = 0; r < e.length; r++) {
        const i = e[r];
        i <= 15 ? r = this.handleSpecialCommand(i, e, r, t) : this.handleVectorCommand(i, t);
      }
      return new _r(t.currentPoint, t.polylines);
    }
    /**
     * Please refer to special codes reference in the following link for more information.
     * https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-06832147-16BE-4A66-A6D0-3ADF98DC8228
     * @param command - The command byte
     * @param data - The data of the character
     * @param index - The index of the command byte
     * @param state - The state of the parser
     * @returns The index of the next command byte
     */
    handleSpecialCommand(e, t, r, i) {
      let s = r;
      switch (e) {
        case 0:
          i.currentPolyline = [], i.isPenDown = !1;
          break;
        case 1:
          i.isPenDown = !0, i.currentPolyline.push(i.currentPoint.clone());
          break;
        case 2:
          i.isPenDown = !1, i.currentPolyline.length > 1 && i.polylines.push(i.currentPolyline.slice()), i.currentPolyline = [];
          break;
        case 3:
          s++, i.scale /= t[s];
          break;
        case 4:
          s++, i.scale *= t[s];
          break;
        case 5:
          if (i.sp.length === 4)
            throw new Error("The position stack is only four locations deep");
          i.sp.push(i.currentPoint.clone());
          break;
        case 6:
          i.currentPoint = i.sp.pop() ?? i.currentPoint;
          break;
        case 7:
          s = this.handleSubshapeCommand(t, s, i);
          break;
        case 8:
          s = this.handleXYDisplacement(t, s, i);
          break;
        case 9:
          s = this.handleMultipleXYDisplacements(t, s, i);
          break;
        case 10:
          s = this.handleOctantArc(t, s, i);
          break;
        case 11:
          s = this.handleFractionalArc(t, s, i);
          break;
        case 12:
          s = this.handleBulgeArc(t, s, i);
          break;
        case 13:
          s = this.handleMultipleBulgeArcs(t, s, i);
          break;
        case 14:
          s = this.skipCode(t, ++s);
          break;
      }
      return s;
    }
    handleVectorCommand(e, t) {
      const r = (e & 240) >> 4, i = e & 15, s = this.getVectorForDirection(i);
      t.currentPoint.add(s.multiply(r * t.scale)), t.isPenDown && t.currentPolyline.push(t.currentPoint.clone());
    }
    /**
     * Get the vector for the given direction code. Please refer to the following link for more information.
     * https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-0A8E12A1-F4AB-44AD-8A9B-2140E0D5FD23
     * @param dir - The direction code of the vector
     * @returns Returns the vector for the given direction code
     */
    getVectorForDirection(e) {
      const t = new ce();
      switch (e) {
        case 0:
          t.x = 1;
          break;
        case 1:
          t.x = 1, t.y = 0.5;
          break;
        case 2:
          t.x = 1, t.y = 1;
          break;
        case 3:
          t.x = 0.5, t.y = 1;
          break;
        case 4:
          t.y = 1;
          break;
        case 5:
          t.x = -0.5, t.y = 1;
          break;
        case 6:
          t.x = -1, t.y = 1;
          break;
        case 7:
          t.x = -1, t.y = 0.5;
          break;
        case 8:
          t.x = -1;
          break;
        case 9:
          t.x = -1, t.y = -0.5;
          break;
        case 10:
          t.x = -1, t.y = -1;
          break;
        case 11:
          t.x = -0.5, t.y = -1;
          break;
        case 12:
          t.y = -1;
          break;
        case 13:
          t.x = 0.5, t.y = -1;
          break;
        case 14:
          t.x = 1, t.y = -1;
          break;
        case 15:
          t.x = 1, t.y = -0.5;
          break;
      }
      return t;
    }
    handleSubshapeCommand(e, t, r) {
      let i = t, s = 0, a, o = r.scale * this.fontData.content.height, h = o;
      const c = r.currentPoint.clone();
      switch (r.currentPolyline.length > 1 && (r.polylines.push(r.currentPolyline.slice()), r.currentPolyline = []), this.fontData.header.fontType) {
        case Se.SHAPES:
          i++, s = e[i];
          break;
        case Se.BIGFONT:
          i++, s = e[i], s === 0 && (i++, s = e[i++] << 8 | e[i++], c.x = be.byteToSByte(e[i++]) * r.scale, c.y = be.byteToSByte(e[i++]) * r.scale, this.fontData.content.isExtended && (h = e[i++] * r.scale), o = e[i] * r.scale);
          break;
        case Se.UNIFONT:
          i++, s = e[i++] << 8 | e[i++];
          break;
      }
      return s !== 0 && (a = this.getScaledSubshapeAtInsertPoint(s, h, o, c), a && r.polylines.push(...a.polylines.slice())), r.currentPolyline = [], i;
    }
    handleXYDisplacement(e, t, r) {
      let i = t;
      const s = new ce();
      return s.x = be.byteToSByte(e[++i]), s.y = be.byteToSByte(e[++i]), r.currentPoint.add(s.multiply(r.scale)), r.isPenDown && r.currentPolyline.push(r.currentPoint.clone()), i;
    }
    handleMultipleXYDisplacements(e, t, r) {
      let i = t;
      for (; ; ) {
        const s = new ce();
        if (s.x = be.byteToSByte(e[++i]), s.y = be.byteToSByte(e[++i]), s.x === 0 && s.y === 0)
          break;
        r.currentPoint.add(s.multiply(r.scale)), r.isPenDown && r.currentPolyline.push(r.currentPoint.clone());
      }
      return i;
    }
    handleOctantArc(e, t, r) {
      var i;
      let s = t;
      const a = e[++s] * r.scale, o = be.byteToSByte(e[++s]), h = (o & 112) >> 4;
      let c = o & 7;
      const u = o < 0, f = Math.PI / 4 * h, l = r.currentPoint.clone().subtract(new ce(Math.cos(f) * a, Math.sin(f) * a)), p = Gr.fromOctant(l, a, h, c, u);
      if (r.isPenDown) {
        const g = p.tessellate();
        r.currentPolyline.pop(), r.currentPolyline.push(...g.slice());
      }
      return r.currentPoint = (i = p.tessellate().pop()) == null ? void 0 : i.clone(), s;
    }
    handleFractionalArc(e, t, r) {
      let i = t;
      const s = e[++i], a = e[++i], o = e[++i], h = e[++i], c = (o * 255 + h) * r.scale, u = be.byteToSByte(e[++i]), f = (u & 112) >> 4;
      let l = u & 7;
      l === 0 && (l = 8), a !== 0 && l--;
      const p = Math.PI / 4;
      let g = p * l, m = Jp, x = 1;
      u < 0 && (m = -m, g = -g, x = -1);
      let v = p * f, w = v + g;
      v += p * s / 256 * x, w += p * a / 256 * x;
      const b = r.currentPoint.clone().subtract(new ce(c * Math.cos(v), c * Math.sin(v)));
      if (r.currentPoint = b.clone().add(new ce(c * Math.cos(w), c * Math.sin(w))), r.isPenDown) {
        let F = v;
        const C = [];
        if (C.push(
          b.clone().add(new ce(c * Math.cos(F), c * Math.sin(F)))
        ), m > 0)
          for (; F + m < w; )
            F += m, C.push(
              b.clone().add(new ce(c * Math.cos(F), c * Math.sin(F)))
            );
        else
          for (; F + m > w; )
            F += m, C.push(
              b.clone().add(new ce(c * Math.cos(F), c * Math.sin(F)))
            );
        C.push(b.clone().add(new ce(c * Math.cos(w), c * Math.sin(w)))), r.currentPolyline.push(...C);
      }
      return i;
    }
    handleBulgeArc(e, t, r) {
      let i = t;
      const s = new ce();
      s.x = be.byteToSByte(e[++i]), s.y = be.byteToSByte(e[++i]);
      const a = be.byteToSByte(e[++i]);
      return r.currentPoint = this.handleArcSegment(
        r.currentPoint,
        s,
        a,
        r.scale,
        r.isPenDown,
        r.currentPolyline
      ), i;
    }
    handleMultipleBulgeArcs(e, t, r) {
      let i = t;
      for (; ; ) {
        const s = new ce();
        if (s.x = be.byteToSByte(e[++i]), s.y = be.byteToSByte(e[++i]), s.x === 0 && s.y === 0)
          break;
        const a = be.byteToSByte(e[++i]);
        r.currentPoint = this.handleArcSegment(
          r.currentPoint,
          s,
          a,
          r.scale,
          r.isPenDown,
          r.currentPolyline
        );
      }
      return i;
    }
    skipCode(e, t) {
      switch (e[t]) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
        case 4:
          t++;
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          switch (this.fontData.header.fontType) {
            case Se.SHAPES:
              t++;
              break;
            case Se.BIGFONT:
              t++, e[t] === 0 && (t += this.fontData.content.isExtended ? 6 : 5);
              break;
            case Se.UNIFONT:
              t += 2;
              break;
          }
          break;
        case 8:
          t += 2;
          break;
        case 9:
          for (; ; ) {
            const r = e[++t], i = e[++t];
            if (r === 0 && i === 0)
              break;
          }
          break;
        case 10:
          t += 2;
          break;
        case 11:
          t += 5;
          break;
        case 12:
          t += 3;
          break;
        case 13:
          for (; ; ) {
            const r = e[++t], i = e[++t];
            if (r === 0 && i === 0)
              break;
            t++;
          }
          break;
      }
      return t;
    }
    getScaledSubshapeAtInsertPoint(e, t, r, i) {
      let s = this.shapeCache.get(e);
      if (!s) {
        const o = this.fontData.content.data[e];
        if (!o)
          return;
        s = this.parseShape(o), this.shapeData.set(e, s), this.shapeCache.set(e, s);
      }
      const a = s.normalizeToOrigin(!0);
      return this.scaleShapeByHeightAndWidth(a, r, t).offset(i, !1);
    }
    /**
     * Handles drawing an arc segment with the given vector and bulge
     * @param currentPoint The starting point of the arc
     * @param vec The displacement vector
     * @param bulge The bulge value (will be normalized by 127.0)
     * @param scale The current scale factor
     * @param isPenDown Whether the pen is currently down (drawing)
     * @param currentPolyline The current polyline being built
     * @returns The new current point after the arc
     */
    handleArcSegment(e, t, r, i, s, a) {
      t.x *= i, t.y *= i, r < -127 && (r = -127);
      const o = e.clone();
      if (s)
        if (r === 0)
          a.push(o.clone().add(t));
        else {
          const h = o.clone().add(t), c = Gr.fromBulge(o, h, r / 127).tessellate();
          a.push(...c.slice(1));
        }
      return o.add(t), o;
    }
  }
  class jp {
    /**
     * Creates a new ShxFont instance.
     * @param data - Either raw binary data of the SHX font file (ArrayBuffer) or pre-parsed font data (ShxFontData)
     * @throws {Error} If the font data is invalid or cannot be parsed
     */
    constructor(e) {
      if (e instanceof ArrayBuffer) {
        const t = new be(e), r = new qp().parse(t), i = Zp.createParser(r.fontType).parse(t);
        this.fontData = {
          header: r,
          content: i
        };
      } else
        this.fontData = e;
      this.shapeParser = new $p(this.fontData);
    }
    /**
     * Return true if this font contains glyph of the specified character. Otherwise, return false.
     * @param char - The character to check
     * @returns True if this font contains glyph of the specified character. Otherwise, return false.
     */
    hasChar(e) {
      return this.fontData.content.data[e] !== void 0;
    }
    /**
     * Gets the shape data for a specific character at a given font size.
     * @param code - The character code to get the shape for
     * @param size - The desired font size
     * @returns The shape data for the character, or undefined if the character is not found in the font
     */
    getCharShape(e, t) {
      let r = this.shapeParser.getCharShape(e, t);
      return r && this.fontData.header.fontType === Se.BIGFONT && (r = r.normalizeToOrigin()), r;
    }
    /**
     * Releases resources used by the font.
     * This should be called when the font is no longer needed to free up memory.
     */
    release() {
      this.shapeParser.release();
    }
  }
  function Qp(n) {
    return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
  }
  function Kp(n) {
    if (n.__esModule) return n;
    var e = n.default;
    if (typeof e == "function") {
      var t = function r() {
        return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
      };
      t.prototype = e.prototype;
    } else t = {};
    return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(n).forEach(function(r) {
      var i = Object.getOwnPropertyDescriptor(n, r);
      Object.defineProperty(t, r, i.get ? i : {
        enumerable: !0,
        get: function() {
          return n[r];
        }
      });
    }), t;
  }
  var Gh = { exports: {} }, Bs = {}, $n = {};
  $n.byteLength = rd;
  $n.toByteArray = id;
  $n.fromByteArray = od;
  var Qe = [], Ee = [], ed = typeof Uint8Array < "u" ? Uint8Array : Array, Ri = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var nr = 0, td = Ri.length; nr < td; ++nr)
    Qe[nr] = Ri[nr], Ee[Ri.charCodeAt(nr)] = nr;
  Ee[45] = 62;
  Ee[95] = 63;
  function Hh(n) {
    var e = n.length;
    if (e % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var t = n.indexOf("=");
    t === -1 && (t = e);
    var r = t === e ? 0 : 4 - t % 4;
    return [t, r];
  }
  function rd(n) {
    var e = Hh(n), t = e[0], r = e[1];
    return (t + r) * 3 / 4 - r;
  }
  function nd(n, e, t) {
    return (e + t) * 3 / 4 - t;
  }
  function id(n) {
    var e, t = Hh(n), r = t[0], i = t[1], s = new ed(nd(n, r, i)), a = 0, o = i > 0 ? r - 4 : r, h;
    for (h = 0; h < o; h += 4)
      e = Ee[n.charCodeAt(h)] << 18 | Ee[n.charCodeAt(h + 1)] << 12 | Ee[n.charCodeAt(h + 2)] << 6 | Ee[n.charCodeAt(h + 3)], s[a++] = e >> 16 & 255, s[a++] = e >> 8 & 255, s[a++] = e & 255;
    return i === 2 && (e = Ee[n.charCodeAt(h)] << 2 | Ee[n.charCodeAt(h + 1)] >> 4, s[a++] = e & 255), i === 1 && (e = Ee[n.charCodeAt(h)] << 10 | Ee[n.charCodeAt(h + 1)] << 4 | Ee[n.charCodeAt(h + 2)] >> 2, s[a++] = e >> 8 & 255, s[a++] = e & 255), s;
  }
  function sd(n) {
    return Qe[n >> 18 & 63] + Qe[n >> 12 & 63] + Qe[n >> 6 & 63] + Qe[n & 63];
  }
  function ad(n, e, t) {
    for (var r, i = [], s = e; s < t; s += 3)
      r = (n[s] << 16 & 16711680) + (n[s + 1] << 8 & 65280) + (n[s + 2] & 255), i.push(sd(r));
    return i.join("");
  }
  function od(n) {
    for (var e, t = n.length, r = t % 3, i = [], s = 16383, a = 0, o = t - r; a < o; a += s)
      i.push(ad(n, a, a + s > o ? o : a + s));
    return r === 1 ? (e = n[t - 1], i.push(
      Qe[e >> 2] + Qe[e << 4 & 63] + "=="
    )) : r === 2 && (e = (n[t - 2] << 8) + n[t - 1], i.push(
      Qe[e >> 10] + Qe[e >> 4 & 63] + Qe[e << 2 & 63] + "="
    )), i.join("");
  }
  var _s = {};
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  _s.read = function(n, e, t, r, i) {
    var s, a, o = i * 8 - r - 1, h = (1 << o) - 1, c = h >> 1, u = -7, f = t ? i - 1 : 0, l = t ? -1 : 1, p = n[e + f];
    for (f += l, s = p & (1 << -u) - 1, p >>= -u, u += o; u > 0; s = s * 256 + n[e + f], f += l, u -= 8)
      ;
    for (a = s & (1 << -u) - 1, s >>= -u, u += r; u > 0; a = a * 256 + n[e + f], f += l, u -= 8)
      ;
    if (s === 0)
      s = 1 - c;
    else {
      if (s === h)
        return a ? NaN : (p ? -1 : 1) * (1 / 0);
      a = a + Math.pow(2, r), s = s - c;
    }
    return (p ? -1 : 1) * a * Math.pow(2, s - r);
  };
  _s.write = function(n, e, t, r, i, s) {
    var a, o, h, c = s * 8 - i - 1, u = (1 << c) - 1, f = u >> 1, l = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = r ? 0 : s - 1, g = r ? 1 : -1, m = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (o = isNaN(e) ? 1 : 0, a = u) : (a = Math.floor(Math.log(e) / Math.LN2), e * (h = Math.pow(2, -a)) < 1 && (a--, h *= 2), a + f >= 1 ? e += l / h : e += l * Math.pow(2, 1 - f), e * h >= 2 && (a++, h /= 2), a + f >= u ? (o = 0, a = u) : a + f >= 1 ? (o = (e * h - 1) * Math.pow(2, i), a = a + f) : (o = e * Math.pow(2, f - 1) * Math.pow(2, i), a = 0)); i >= 8; n[t + p] = o & 255, p += g, o /= 256, i -= 8)
      ;
    for (a = a << i | o, c += i; c > 0; n[t + p] = a & 255, p += g, a /= 256, c -= 8)
      ;
    n[t + p - g] |= m * 128;
  };
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  (function(n) {
    var e = $n, t = _s, r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    n.Buffer = o, n.SlowBuffer = w, n.INSPECT_MAX_BYTES = 50;
    var i = 2147483647;
    n.kMaxLength = i, o.TYPED_ARRAY_SUPPORT = s(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function s() {
      try {
        var S = new Uint8Array(1), d = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(d, Uint8Array.prototype), Object.setPrototypeOf(S, d), S.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(o.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (o.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(o.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (o.isBuffer(this))
          return this.byteOffset;
      }
    });
    function a(S) {
      if (S > i)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
      var d = new Uint8Array(S);
      return Object.setPrototypeOf(d, o.prototype), d;
    }
    function o(S, d, y) {
      if (typeof S == "number") {
        if (typeof d == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return f(S);
      }
      return h(S, d, y);
    }
    o.poolSize = 8192;
    function h(S, d, y) {
      if (typeof S == "string")
        return l(S, d);
      if (ArrayBuffer.isView(S))
        return g(S);
      if (S == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
        );
      if (Je(S, ArrayBuffer) || S && Je(S.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Je(S, SharedArrayBuffer) || S && Je(S.buffer, SharedArrayBuffer)))
        return m(S, d, y);
      if (typeof S == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      var T = S.valueOf && S.valueOf();
      if (T != null && T !== S)
        return o.from(T, d, y);
      var k = x(S);
      if (k) return k;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof S[Symbol.toPrimitive] == "function")
        return o.from(
          S[Symbol.toPrimitive]("string"),
          d,
          y
        );
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
      );
    }
    o.from = function(S, d, y) {
      return h(S, d, y);
    }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
    function c(S) {
      if (typeof S != "number")
        throw new TypeError('"size" argument must be of type number');
      if (S < 0)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
    }
    function u(S, d, y) {
      return c(S), S <= 0 ? a(S) : d !== void 0 ? typeof y == "string" ? a(S).fill(d, y) : a(S).fill(d) : a(S);
    }
    o.alloc = function(S, d, y) {
      return u(S, d, y);
    };
    function f(S) {
      return c(S), a(S < 0 ? 0 : v(S) | 0);
    }
    o.allocUnsafe = function(S) {
      return f(S);
    }, o.allocUnsafeSlow = function(S) {
      return f(S);
    };
    function l(S, d) {
      if ((typeof d != "string" || d === "") && (d = "utf8"), !o.isEncoding(d))
        throw new TypeError("Unknown encoding: " + d);
      var y = b(S, d) | 0, T = a(y), k = T.write(S, d);
      return k !== y && (T = T.slice(0, k)), T;
    }
    function p(S) {
      for (var d = S.length < 0 ? 0 : v(S.length) | 0, y = a(d), T = 0; T < d; T += 1)
        y[T] = S[T] & 255;
      return y;
    }
    function g(S) {
      if (Je(S, Uint8Array)) {
        var d = new Uint8Array(S);
        return m(d.buffer, d.byteOffset, d.byteLength);
      }
      return p(S);
    }
    function m(S, d, y) {
      if (d < 0 || S.byteLength < d)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (S.byteLength < d + (y || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      var T;
      return d === void 0 && y === void 0 ? T = new Uint8Array(S) : y === void 0 ? T = new Uint8Array(S, d) : T = new Uint8Array(S, d, y), Object.setPrototypeOf(T, o.prototype), T;
    }
    function x(S) {
      if (o.isBuffer(S)) {
        var d = v(S.length) | 0, y = a(d);
        return y.length === 0 || S.copy(y, 0, 0, d), y;
      }
      if (S.length !== void 0)
        return typeof S.length != "number" || jn(S.length) ? a(0) : p(S);
      if (S.type === "Buffer" && Array.isArray(S.data))
        return p(S.data);
    }
    function v(S) {
      if (S >= i)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
      return S | 0;
    }
    function w(S) {
      return +S != S && (S = 0), o.alloc(+S);
    }
    o.isBuffer = function(d) {
      return d != null && d._isBuffer === !0 && d !== o.prototype;
    }, o.compare = function(d, y) {
      if (Je(d, Uint8Array) && (d = o.from(d, d.offset, d.byteLength)), Je(y, Uint8Array) && (y = o.from(y, y.offset, y.byteLength)), !o.isBuffer(d) || !o.isBuffer(y))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (d === y) return 0;
      for (var T = d.length, k = y.length, L = 0, U = Math.min(T, k); L < U; ++L)
        if (d[L] !== y[L]) {
          T = d[L], k = y[L];
          break;
        }
      return T < k ? -1 : k < T ? 1 : 0;
    }, o.isEncoding = function(d) {
      switch (String(d).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, o.concat = function(d, y) {
      if (!Array.isArray(d))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (d.length === 0)
        return o.alloc(0);
      var T;
      if (y === void 0)
        for (y = 0, T = 0; T < d.length; ++T)
          y += d[T].length;
      var k = o.allocUnsafe(y), L = 0;
      for (T = 0; T < d.length; ++T) {
        var U = d[T];
        if (Je(U, Uint8Array))
          L + U.length > k.length ? o.from(U).copy(k, L) : Uint8Array.prototype.set.call(
            k,
            U,
            L
          );
        else if (o.isBuffer(U))
          U.copy(k, L);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        L += U.length;
      }
      return k;
    };
    function b(S, d) {
      if (o.isBuffer(S))
        return S.length;
      if (ArrayBuffer.isView(S) || Je(S, ArrayBuffer))
        return S.byteLength;
      if (typeof S != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof S
        );
      var y = S.length, T = arguments.length > 2 && arguments[2] === !0;
      if (!T && y === 0) return 0;
      for (var k = !1; ; )
        switch (d) {
          case "ascii":
          case "latin1":
          case "binary":
            return y;
          case "utf8":
          case "utf-8":
            return pt(S).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return y * 2;
          case "hex":
            return y >>> 1;
          case "base64":
            return zs(S).length;
          default:
            if (k)
              return T ? -1 : pt(S).length;
            d = ("" + d).toLowerCase(), k = !0;
        }
    }
    o.byteLength = b;
    function F(S, d, y) {
      var T = !1;
      if ((d === void 0 || d < 0) && (d = 0), d > this.length || ((y === void 0 || y > this.length) && (y = this.length), y <= 0) || (y >>>= 0, d >>>= 0, y <= d))
        return "";
      for (S || (S = "utf8"); ; )
        switch (S) {
          case "hex":
            return ne(this, d, y);
          case "utf8":
          case "utf-8":
            return Z(this, d, y);
          case "ascii":
            return te(this, d, y);
          case "latin1":
          case "binary":
            return ie(this, d, y);
          case "base64":
            return Y(this, d, y);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ae(this, d, y);
          default:
            if (T) throw new TypeError("Unknown encoding: " + S);
            S = (S + "").toLowerCase(), T = !0;
        }
    }
    o.prototype._isBuffer = !0;
    function C(S, d, y) {
      var T = S[d];
      S[d] = S[y], S[y] = T;
    }
    o.prototype.swap16 = function() {
      var d = this.length;
      if (d % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var y = 0; y < d; y += 2)
        C(this, y, y + 1);
      return this;
    }, o.prototype.swap32 = function() {
      var d = this.length;
      if (d % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var y = 0; y < d; y += 4)
        C(this, y, y + 3), C(this, y + 1, y + 2);
      return this;
    }, o.prototype.swap64 = function() {
      var d = this.length;
      if (d % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var y = 0; y < d; y += 8)
        C(this, y, y + 7), C(this, y + 1, y + 6), C(this, y + 2, y + 5), C(this, y + 3, y + 4);
      return this;
    }, o.prototype.toString = function() {
      var d = this.length;
      return d === 0 ? "" : arguments.length === 0 ? Z(this, 0, d) : F.apply(this, arguments);
    }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(d) {
      if (!o.isBuffer(d)) throw new TypeError("Argument must be a Buffer");
      return this === d ? !0 : o.compare(this, d) === 0;
    }, o.prototype.inspect = function() {
      var d = "", y = n.INSPECT_MAX_BYTES;
      return d = this.toString("hex", 0, y).replace(/(.{2})/g, "$1 ").trim(), this.length > y && (d += " ... "), "<Buffer " + d + ">";
    }, r && (o.prototype[r] = o.prototype.inspect), o.prototype.compare = function(d, y, T, k, L) {
      if (Je(d, Uint8Array) && (d = o.from(d, d.offset, d.byteLength)), !o.isBuffer(d))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
        );
      if (y === void 0 && (y = 0), T === void 0 && (T = d ? d.length : 0), k === void 0 && (k = 0), L === void 0 && (L = this.length), y < 0 || T > d.length || k < 0 || L > this.length)
        throw new RangeError("out of range index");
      if (k >= L && y >= T)
        return 0;
      if (k >= L)
        return -1;
      if (y >= T)
        return 1;
      if (y >>>= 0, T >>>= 0, k >>>= 0, L >>>= 0, this === d) return 0;
      for (var U = L - k, J = T - y, K = Math.min(U, J), se = this.slice(k, L), ye = d.slice(y, T), he = 0; he < K; ++he)
        if (se[he] !== ye[he]) {
          U = se[he], J = ye[he];
          break;
        }
      return U < J ? -1 : J < U ? 1 : 0;
    };
    function _(S, d, y, T, k) {
      if (S.length === 0) return -1;
      if (typeof y == "string" ? (T = y, y = 0) : y > 2147483647 ? y = 2147483647 : y < -2147483648 && (y = -2147483648), y = +y, jn(y) && (y = k ? 0 : S.length - 1), y < 0 && (y = S.length + y), y >= S.length) {
        if (k) return -1;
        y = S.length - 1;
      } else if (y < 0)
        if (k) y = 0;
        else return -1;
      if (typeof d == "string" && (d = o.from(d, T)), o.isBuffer(d))
        return d.length === 0 ? -1 : E(S, d, y, T, k);
      if (typeof d == "number")
        return d = d & 255, typeof Uint8Array.prototype.indexOf == "function" ? k ? Uint8Array.prototype.indexOf.call(S, d, y) : Uint8Array.prototype.lastIndexOf.call(S, d, y) : E(S, [d], y, T, k);
      throw new TypeError("val must be string, number or Buffer");
    }
    function E(S, d, y, T, k) {
      var L = 1, U = S.length, J = d.length;
      if (T !== void 0 && (T = String(T).toLowerCase(), T === "ucs2" || T === "ucs-2" || T === "utf16le" || T === "utf-16le")) {
        if (S.length < 2 || d.length < 2)
          return -1;
        L = 2, U /= 2, J /= 2, y /= 2;
      }
      function K(Ns, Gs) {
        return L === 1 ? Ns[Gs] : Ns.readUInt16BE(Gs * L);
      }
      var se;
      if (k) {
        var ye = -1;
        for (se = y; se < U; se++)
          if (K(S, se) === K(d, ye === -1 ? 0 : se - ye)) {
            if (ye === -1 && (ye = se), se - ye + 1 === J) return ye * L;
          } else
            ye !== -1 && (se -= se - ye), ye = -1;
      } else
        for (y + J > U && (y = U - J), se = y; se >= 0; se--) {
          for (var he = !0, tn = 0; tn < J; tn++)
            if (K(S, se + tn) !== K(d, tn)) {
              he = !1;
              break;
            }
          if (he) return se;
        }
      return -1;
    }
    o.prototype.includes = function(d, y, T) {
      return this.indexOf(d, y, T) !== -1;
    }, o.prototype.indexOf = function(d, y, T) {
      return _(this, d, y, T, !0);
    }, o.prototype.lastIndexOf = function(d, y, T) {
      return _(this, d, y, T, !1);
    };
    function B(S, d, y, T) {
      y = Number(y) || 0;
      var k = S.length - y;
      T ? (T = Number(T), T > k && (T = k)) : T = k;
      var L = d.length;
      T > L / 2 && (T = L / 2);
      for (var U = 0; U < T; ++U) {
        var J = parseInt(d.substr(U * 2, 2), 16);
        if (jn(J)) return U;
        S[y + U] = J;
      }
      return U;
    }
    function I(S, d, y, T) {
      return en(pt(d, S.length - y), S, y, T);
    }
    function N(S, d, y, T) {
      return en(Vh(d), S, y, T);
    }
    function q(S, d, y, T) {
      return en(zs(d), S, y, T);
    }
    function re(S, d, y, T) {
      return en(Xh(d, S.length - y), S, y, T);
    }
    o.prototype.write = function(d, y, T, k) {
      if (y === void 0)
        k = "utf8", T = this.length, y = 0;
      else if (T === void 0 && typeof y == "string")
        k = y, T = this.length, y = 0;
      else if (isFinite(y))
        y = y >>> 0, isFinite(T) ? (T = T >>> 0, k === void 0 && (k = "utf8")) : (k = T, T = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      var L = this.length - y;
      if ((T === void 0 || T > L) && (T = L), d.length > 0 && (T < 0 || y < 0) || y > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      k || (k = "utf8");
      for (var U = !1; ; )
        switch (k) {
          case "hex":
            return B(this, d, y, T);
          case "utf8":
          case "utf-8":
            return I(this, d, y, T);
          case "ascii":
          case "latin1":
          case "binary":
            return N(this, d, y, T);
          case "base64":
            return q(this, d, y, T);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return re(this, d, y, T);
          default:
            if (U) throw new TypeError("Unknown encoding: " + k);
            k = ("" + k).toLowerCase(), U = !0;
        }
    }, o.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function Y(S, d, y) {
      return d === 0 && y === S.length ? e.fromByteArray(S) : e.fromByteArray(S.slice(d, y));
    }
    function Z(S, d, y) {
      y = Math.min(S.length, y);
      for (var T = [], k = d; k < y; ) {
        var L = S[k], U = null, J = L > 239 ? 4 : L > 223 ? 3 : L > 191 ? 2 : 1;
        if (k + J <= y) {
          var K, se, ye, he;
          switch (J) {
            case 1:
              L < 128 && (U = L);
              break;
            case 2:
              K = S[k + 1], (K & 192) === 128 && (he = (L & 31) << 6 | K & 63, he > 127 && (U = he));
              break;
            case 3:
              K = S[k + 1], se = S[k + 2], (K & 192) === 128 && (se & 192) === 128 && (he = (L & 15) << 12 | (K & 63) << 6 | se & 63, he > 2047 && (he < 55296 || he > 57343) && (U = he));
              break;
            case 4:
              K = S[k + 1], se = S[k + 2], ye = S[k + 3], (K & 192) === 128 && (se & 192) === 128 && (ye & 192) === 128 && (he = (L & 15) << 18 | (K & 63) << 12 | (se & 63) << 6 | ye & 63, he > 65535 && he < 1114112 && (U = he));
          }
        }
        U === null ? (U = 65533, J = 1) : U > 65535 && (U -= 65536, T.push(U >>> 10 & 1023 | 55296), U = 56320 | U & 1023), T.push(U), k += J;
      }
      return Q(T);
    }
    var j = 4096;
    function Q(S) {
      var d = S.length;
      if (d <= j)
        return String.fromCharCode.apply(String, S);
      for (var y = "", T = 0; T < d; )
        y += String.fromCharCode.apply(
          String,
          S.slice(T, T += j)
        );
      return y;
    }
    function te(S, d, y) {
      var T = "";
      y = Math.min(S.length, y);
      for (var k = d; k < y; ++k)
        T += String.fromCharCode(S[k] & 127);
      return T;
    }
    function ie(S, d, y) {
      var T = "";
      y = Math.min(S.length, y);
      for (var k = d; k < y; ++k)
        T += String.fromCharCode(S[k]);
      return T;
    }
    function ne(S, d, y) {
      var T = S.length;
      (!d || d < 0) && (d = 0), (!y || y < 0 || y > T) && (y = T);
      for (var k = "", L = d; L < y; ++L)
        k += Yh[S[L]];
      return k;
    }
    function ae(S, d, y) {
      for (var T = S.slice(d, y), k = "", L = 0; L < T.length - 1; L += 2)
        k += String.fromCharCode(T[L] + T[L + 1] * 256);
      return k;
    }
    o.prototype.slice = function(d, y) {
      var T = this.length;
      d = ~~d, y = y === void 0 ? T : ~~y, d < 0 ? (d += T, d < 0 && (d = 0)) : d > T && (d = T), y < 0 ? (y += T, y < 0 && (y = 0)) : y > T && (y = T), y < d && (y = d);
      var k = this.subarray(d, y);
      return Object.setPrototypeOf(k, o.prototype), k;
    };
    function H(S, d, y) {
      if (S % 1 !== 0 || S < 0) throw new RangeError("offset is not uint");
      if (S + d > y) throw new RangeError("Trying to access beyond buffer length");
    }
    o.prototype.readUintLE = o.prototype.readUIntLE = function(d, y, T) {
      d = d >>> 0, y = y >>> 0, T || H(d, y, this.length);
      for (var k = this[d], L = 1, U = 0; ++U < y && (L *= 256); )
        k += this[d + U] * L;
      return k;
    }, o.prototype.readUintBE = o.prototype.readUIntBE = function(d, y, T) {
      d = d >>> 0, y = y >>> 0, T || H(d, y, this.length);
      for (var k = this[d + --y], L = 1; y > 0 && (L *= 256); )
        k += this[d + --y] * L;
      return k;
    }, o.prototype.readUint8 = o.prototype.readUInt8 = function(d, y) {
      return d = d >>> 0, y || H(d, 1, this.length), this[d];
    }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(d, y) {
      return d = d >>> 0, y || H(d, 2, this.length), this[d] | this[d + 1] << 8;
    }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(d, y) {
      return d = d >>> 0, y || H(d, 2, this.length), this[d] << 8 | this[d + 1];
    }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(d, y) {
      return d = d >>> 0, y || H(d, 4, this.length), (this[d] | this[d + 1] << 8 | this[d + 2] << 16) + this[d + 3] * 16777216;
    }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(d, y) {
      return d = d >>> 0, y || H(d, 4, this.length), this[d] * 16777216 + (this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3]);
    }, o.prototype.readIntLE = function(d, y, T) {
      d = d >>> 0, y = y >>> 0, T || H(d, y, this.length);
      for (var k = this[d], L = 1, U = 0; ++U < y && (L *= 256); )
        k += this[d + U] * L;
      return L *= 128, k >= L && (k -= Math.pow(2, 8 * y)), k;
    }, o.prototype.readIntBE = function(d, y, T) {
      d = d >>> 0, y = y >>> 0, T || H(d, y, this.length);
      for (var k = y, L = 1, U = this[d + --k]; k > 0 && (L *= 256); )
        U += this[d + --k] * L;
      return L *= 128, U >= L && (U -= Math.pow(2, 8 * y)), U;
    }, o.prototype.readInt8 = function(d, y) {
      return d = d >>> 0, y || H(d, 1, this.length), this[d] & 128 ? (255 - this[d] + 1) * -1 : this[d];
    }, o.prototype.readInt16LE = function(d, y) {
      d = d >>> 0, y || H(d, 2, this.length);
      var T = this[d] | this[d + 1] << 8;
      return T & 32768 ? T | 4294901760 : T;
    }, o.prototype.readInt16BE = function(d, y) {
      d = d >>> 0, y || H(d, 2, this.length);
      var T = this[d + 1] | this[d] << 8;
      return T & 32768 ? T | 4294901760 : T;
    }, o.prototype.readInt32LE = function(d, y) {
      return d = d >>> 0, y || H(d, 4, this.length), this[d] | this[d + 1] << 8 | this[d + 2] << 16 | this[d + 3] << 24;
    }, o.prototype.readInt32BE = function(d, y) {
      return d = d >>> 0, y || H(d, 4, this.length), this[d] << 24 | this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3];
    }, o.prototype.readFloatLE = function(d, y) {
      return d = d >>> 0, y || H(d, 4, this.length), t.read(this, d, !0, 23, 4);
    }, o.prototype.readFloatBE = function(d, y) {
      return d = d >>> 0, y || H(d, 4, this.length), t.read(this, d, !1, 23, 4);
    }, o.prototype.readDoubleLE = function(d, y) {
      return d = d >>> 0, y || H(d, 8, this.length), t.read(this, d, !0, 52, 8);
    }, o.prototype.readDoubleBE = function(d, y) {
      return d = d >>> 0, y || H(d, 8, this.length), t.read(this, d, !1, 52, 8);
    };
    function $(S, d, y, T, k, L) {
      if (!o.isBuffer(S)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (d > k || d < L) throw new RangeError('"value" argument is out of bounds');
      if (y + T > S.length) throw new RangeError("Index out of range");
    }
    o.prototype.writeUintLE = o.prototype.writeUIntLE = function(d, y, T, k) {
      if (d = +d, y = y >>> 0, T = T >>> 0, !k) {
        var L = Math.pow(2, 8 * T) - 1;
        $(this, d, y, T, L, 0);
      }
      var U = 1, J = 0;
      for (this[y] = d & 255; ++J < T && (U *= 256); )
        this[y + J] = d / U & 255;
      return y + T;
    }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(d, y, T, k) {
      if (d = +d, y = y >>> 0, T = T >>> 0, !k) {
        var L = Math.pow(2, 8 * T) - 1;
        $(this, d, y, T, L, 0);
      }
      var U = T - 1, J = 1;
      for (this[y + U] = d & 255; --U >= 0 && (J *= 256); )
        this[y + U] = d / J & 255;
      return y + T;
    }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 1, 255, 0), this[y] = d & 255, y + 1;
    }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 2, 65535, 0), this[y] = d & 255, this[y + 1] = d >>> 8, y + 2;
    }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 2, 65535, 0), this[y] = d >>> 8, this[y + 1] = d & 255, y + 2;
    }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 4, 4294967295, 0), this[y + 3] = d >>> 24, this[y + 2] = d >>> 16, this[y + 1] = d >>> 8, this[y] = d & 255, y + 4;
    }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 4, 4294967295, 0), this[y] = d >>> 24, this[y + 1] = d >>> 16, this[y + 2] = d >>> 8, this[y + 3] = d & 255, y + 4;
    }, o.prototype.writeIntLE = function(d, y, T, k) {
      if (d = +d, y = y >>> 0, !k) {
        var L = Math.pow(2, 8 * T - 1);
        $(this, d, y, T, L - 1, -L);
      }
      var U = 0, J = 1, K = 0;
      for (this[y] = d & 255; ++U < T && (J *= 256); )
        d < 0 && K === 0 && this[y + U - 1] !== 0 && (K = 1), this[y + U] = (d / J >> 0) - K & 255;
      return y + T;
    }, o.prototype.writeIntBE = function(d, y, T, k) {
      if (d = +d, y = y >>> 0, !k) {
        var L = Math.pow(2, 8 * T - 1);
        $(this, d, y, T, L - 1, -L);
      }
      var U = T - 1, J = 1, K = 0;
      for (this[y + U] = d & 255; --U >= 0 && (J *= 256); )
        d < 0 && K === 0 && this[y + U + 1] !== 0 && (K = 1), this[y + U] = (d / J >> 0) - K & 255;
      return y + T;
    }, o.prototype.writeInt8 = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 1, 127, -128), d < 0 && (d = 255 + d + 1), this[y] = d & 255, y + 1;
    }, o.prototype.writeInt16LE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 2, 32767, -32768), this[y] = d & 255, this[y + 1] = d >>> 8, y + 2;
    }, o.prototype.writeInt16BE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 2, 32767, -32768), this[y] = d >>> 8, this[y + 1] = d & 255, y + 2;
    }, o.prototype.writeInt32LE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 4, 2147483647, -2147483648), this[y] = d & 255, this[y + 1] = d >>> 8, this[y + 2] = d >>> 16, this[y + 3] = d >>> 24, y + 4;
    }, o.prototype.writeInt32BE = function(d, y, T) {
      return d = +d, y = y >>> 0, T || $(this, d, y, 4, 2147483647, -2147483648), d < 0 && (d = 4294967295 + d + 1), this[y] = d >>> 24, this[y + 1] = d >>> 16, this[y + 2] = d >>> 8, this[y + 3] = d & 255, y + 4;
    };
    function Vt(S, d, y, T, k, L) {
      if (y + T > S.length) throw new RangeError("Index out of range");
      if (y < 0) throw new RangeError("Index out of range");
    }
    function jr(S, d, y, T, k) {
      return d = +d, y = y >>> 0, k || Vt(S, d, y, 4), t.write(S, d, y, T, 23, 4), y + 4;
    }
    o.prototype.writeFloatLE = function(d, y, T) {
      return jr(this, d, y, !0, T);
    }, o.prototype.writeFloatBE = function(d, y, T) {
      return jr(this, d, y, !1, T);
    };
    function Qr(S, d, y, T, k) {
      return d = +d, y = y >>> 0, k || Vt(S, d, y, 8), t.write(S, d, y, T, 52, 8), y + 8;
    }
    o.prototype.writeDoubleLE = function(d, y, T) {
      return Qr(this, d, y, !0, T);
    }, o.prototype.writeDoubleBE = function(d, y, T) {
      return Qr(this, d, y, !1, T);
    }, o.prototype.copy = function(d, y, T, k) {
      if (!o.isBuffer(d)) throw new TypeError("argument should be a Buffer");
      if (T || (T = 0), !k && k !== 0 && (k = this.length), y >= d.length && (y = d.length), y || (y = 0), k > 0 && k < T && (k = T), k === T || d.length === 0 || this.length === 0) return 0;
      if (y < 0)
        throw new RangeError("targetStart out of bounds");
      if (T < 0 || T >= this.length) throw new RangeError("Index out of range");
      if (k < 0) throw new RangeError("sourceEnd out of bounds");
      k > this.length && (k = this.length), d.length - y < k - T && (k = d.length - y + T);
      var L = k - T;
      return this === d && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(y, T, k) : Uint8Array.prototype.set.call(
        d,
        this.subarray(T, k),
        y
      ), L;
    }, o.prototype.fill = function(d, y, T, k) {
      if (typeof d == "string") {
        if (typeof y == "string" ? (k = y, y = 0, T = this.length) : typeof T == "string" && (k = T, T = this.length), k !== void 0 && typeof k != "string")
          throw new TypeError("encoding must be a string");
        if (typeof k == "string" && !o.isEncoding(k))
          throw new TypeError("Unknown encoding: " + k);
        if (d.length === 1) {
          var L = d.charCodeAt(0);
          (k === "utf8" && L < 128 || k === "latin1") && (d = L);
        }
      } else typeof d == "number" ? d = d & 255 : typeof d == "boolean" && (d = Number(d));
      if (y < 0 || this.length < y || this.length < T)
        throw new RangeError("Out of range index");
      if (T <= y)
        return this;
      y = y >>> 0, T = T === void 0 ? this.length : T >>> 0, d || (d = 0);
      var U;
      if (typeof d == "number")
        for (U = y; U < T; ++U)
          this[U] = d;
      else {
        var J = o.isBuffer(d) ? d : o.from(d, k), K = J.length;
        if (K === 0)
          throw new TypeError('The value "' + d + '" is invalid for argument "value"');
        for (U = 0; U < T - y; ++U)
          this[U + y] = J[U % K];
      }
      return this;
    };
    var yr = /[^+/0-9A-Za-z-_]/g;
    function Kr(S) {
      if (S = S.split("=")[0], S = S.trim().replace(yr, ""), S.length < 2) return "";
      for (; S.length % 4 !== 0; )
        S = S + "=";
      return S;
    }
    function pt(S, d) {
      d = d || 1 / 0;
      for (var y, T = S.length, k = null, L = [], U = 0; U < T; ++U) {
        if (y = S.charCodeAt(U), y > 55295 && y < 57344) {
          if (!k) {
            if (y > 56319) {
              (d -= 3) > -1 && L.push(239, 191, 189);
              continue;
            } else if (U + 1 === T) {
              (d -= 3) > -1 && L.push(239, 191, 189);
              continue;
            }
            k = y;
            continue;
          }
          if (y < 56320) {
            (d -= 3) > -1 && L.push(239, 191, 189), k = y;
            continue;
          }
          y = (k - 55296 << 10 | y - 56320) + 65536;
        } else k && (d -= 3) > -1 && L.push(239, 191, 189);
        if (k = null, y < 128) {
          if ((d -= 1) < 0) break;
          L.push(y);
        } else if (y < 2048) {
          if ((d -= 2) < 0) break;
          L.push(
            y >> 6 | 192,
            y & 63 | 128
          );
        } else if (y < 65536) {
          if ((d -= 3) < 0) break;
          L.push(
            y >> 12 | 224,
            y >> 6 & 63 | 128,
            y & 63 | 128
          );
        } else if (y < 1114112) {
          if ((d -= 4) < 0) break;
          L.push(
            y >> 18 | 240,
            y >> 12 & 63 | 128,
            y >> 6 & 63 | 128,
            y & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return L;
    }
    function Vh(S) {
      for (var d = [], y = 0; y < S.length; ++y)
        d.push(S.charCodeAt(y) & 255);
      return d;
    }
    function Xh(S, d) {
      for (var y, T, k, L = [], U = 0; U < S.length && !((d -= 2) < 0); ++U)
        y = S.charCodeAt(U), T = y >> 8, k = y % 256, L.push(k), L.push(T);
      return L;
    }
    function zs(S) {
      return e.toByteArray(Kr(S));
    }
    function en(S, d, y, T) {
      for (var k = 0; k < T && !(k + y >= d.length || k >= S.length); ++k)
        d[k + y] = S[k];
      return k;
    }
    function Je(S, d) {
      return S instanceof d || S != null && S.constructor != null && S.constructor.name != null && S.constructor.name === d.name;
    }
    function jn(S) {
      return S !== S;
    }
    var Yh = function() {
      for (var S = "0123456789abcdef", d = new Array(256), y = 0; y < 16; ++y)
        for (var T = y * 16, k = 0; k < 16; ++k)
          d[T + k] = S[y] + S[k];
      return d;
    }();
  })(Bs);
  var Ln = Bs, cr = Ln.Buffer, Be = {}, _e;
  for (_e in Ln)
    Ln.hasOwnProperty(_e) && (_e === "SlowBuffer" || _e === "Buffer" || (Be[_e] = Ln[_e]));
  var ur = Be.Buffer = {};
  for (_e in cr)
    cr.hasOwnProperty(_e) && (_e === "allocUnsafe" || _e === "allocUnsafeSlow" || (ur[_e] = cr[_e]));
  Be.Buffer.prototype = cr.prototype;
  (!ur.from || ur.from === Uint8Array.from) && (ur.from = function(n, e, t) {
    if (typeof n == "number")
      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof n);
    if (n && typeof n.length > "u")
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof n);
    return cr(n, e, t);
  });
  ur.alloc || (ur.alloc = function(n, e, t) {
    if (typeof n != "number")
      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof n);
    if (n < 0 || n >= 2 * (1 << 30))
      throw new RangeError('The value "' + n + '" is invalid for option "size"');
    var r = cr(n);
    return !e || e.length === 0 ? r.fill(0) : typeof t == "string" ? r.fill(e, t) : r.fill(e), r;
  });
  if (!Be.kStringMaxLength)
    try {
      Be.kStringMaxLength = process.binding("buffer").kStringMaxLength;
    } catch {
    }
  Be.constants || (Be.constants = {
    MAX_LENGTH: Be.kMaxLength
  }, Be.kStringMaxLength && (Be.constants.MAX_STRING_LENGTH = Be.kStringMaxLength));
  var Bt = Be, Os = {}, Wh = "\uFEFF";
  Os.PrependBOM = Ls;
  function Ls(n, e) {
    this.encoder = n, this.addBOM = !0;
  }
  Ls.prototype.write = function(n) {
    return this.addBOM && (n = Wh + n, this.addBOM = !1), this.encoder.write(n);
  };
  Ls.prototype.end = function() {
    return this.encoder.end();
  };
  Os.StripBOM = Us;
  function Us(n, e) {
    this.decoder = n, this.pass = !1, this.options = e || {};
  }
  Us.prototype.write = function(n) {
    var e = this.decoder.write(n);
    return this.pass || !e || (e[0] === Wh && (e = e.slice(1), typeof this.options.stripBOM == "function" && this.options.stripBOM()), this.pass = !0), e;
  };
  Us.prototype.end = function() {
    return this.decoder.end();
  };
  var hd = typeof Object.hasOwn > "u" ? Function.call.bind(Object.prototype.hasOwnProperty) : Object.hasOwn;
  function cd(n, e) {
    for (var t in e)
      hd(e, t) && (n[t] = e[t]);
  }
  var qh = cd, Di = {}, Ii = {}, En = { exports: {} };
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var po;
  function ud() {
    return po || (po = 1, function(n, e) {
      var t = Bs, r = t.Buffer;
      function i(a, o) {
        for (var h in a)
          o[h] = a[h];
      }
      r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? n.exports = t : (i(t, e), e.Buffer = s);
      function s(a, o, h) {
        return r(a, o, h);
      }
      s.prototype = Object.create(r.prototype), i(r, s), s.from = function(a, o, h) {
        if (typeof a == "number")
          throw new TypeError("Argument must not be a number");
        return r(a, o, h);
      }, s.alloc = function(a, o, h) {
        if (typeof a != "number")
          throw new TypeError("Argument must be a number");
        var c = r(a);
        return o !== void 0 ? typeof h == "string" ? c.fill(o, h) : c.fill(o) : c.fill(0), c;
      }, s.allocUnsafe = function(a) {
        if (typeof a != "number")
          throw new TypeError("Argument must be a number");
        return r(a);
      }, s.allocUnsafeSlow = function(a) {
        if (typeof a != "number")
          throw new TypeError("Argument must be a number");
        return t.SlowBuffer(a);
      };
    }(En, En.exports)), En.exports;
  }
  var go;
  function ld() {
    if (go) return Ii;
    go = 1;
    var n = ud().Buffer, e = n.isEncoding || function(v) {
      switch (v = "" + v, v && v.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return !0;
        default:
          return !1;
      }
    };
    function t(v) {
      if (!v) return "utf8";
      for (var w; ; )
        switch (v) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return v;
          default:
            if (w) return;
            v = ("" + v).toLowerCase(), w = !0;
        }
    }
    function r(v) {
      var w = t(v);
      if (typeof w != "string" && (n.isEncoding === e || !e(v))) throw new Error("Unknown encoding: " + v);
      return w || v;
    }
    Ii.StringDecoder = i;
    function i(v) {
      this.encoding = r(v);
      var w;
      switch (this.encoding) {
        case "utf16le":
          this.text = f, this.end = l, w = 4;
          break;
        case "utf8":
          this.fillLast = h, w = 4;
          break;
        case "base64":
          this.text = p, this.end = g, w = 3;
          break;
        default:
          this.write = m, this.end = x;
          return;
      }
      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(w);
    }
    i.prototype.write = function(v) {
      if (v.length === 0) return "";
      var w, b;
      if (this.lastNeed) {
        if (w = this.fillLast(v), w === void 0) return "";
        b = this.lastNeed, this.lastNeed = 0;
      } else
        b = 0;
      return b < v.length ? w ? w + this.text(v, b) : this.text(v, b) : w || "";
    }, i.prototype.end = u, i.prototype.text = c, i.prototype.fillLast = function(v) {
      if (this.lastNeed <= v.length)
        return v.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      v.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, v.length), this.lastNeed -= v.length;
    };
    function s(v) {
      return v <= 127 ? 0 : v >> 5 === 6 ? 2 : v >> 4 === 14 ? 3 : v >> 3 === 30 ? 4 : v >> 6 === 2 ? -1 : -2;
    }
    function a(v, w, b) {
      var F = w.length - 1;
      if (F < b) return 0;
      var C = s(w[F]);
      return C >= 0 ? (C > 0 && (v.lastNeed = C - 1), C) : --F < b || C === -2 ? 0 : (C = s(w[F]), C >= 0 ? (C > 0 && (v.lastNeed = C - 2), C) : --F < b || C === -2 ? 0 : (C = s(w[F]), C >= 0 ? (C > 0 && (C === 2 ? C = 0 : v.lastNeed = C - 3), C) : 0));
    }
    function o(v, w, b) {
      if ((w[0] & 192) !== 128)
        return v.lastNeed = 0, "�";
      if (v.lastNeed > 1 && w.length > 1) {
        if ((w[1] & 192) !== 128)
          return v.lastNeed = 1, "�";
        if (v.lastNeed > 2 && w.length > 2 && (w[2] & 192) !== 128)
          return v.lastNeed = 2, "�";
      }
    }
    function h(v) {
      var w = this.lastTotal - this.lastNeed, b = o(this, v);
      if (b !== void 0) return b;
      if (this.lastNeed <= v.length)
        return v.copy(this.lastChar, w, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      v.copy(this.lastChar, w, 0, v.length), this.lastNeed -= v.length;
    }
    function c(v, w) {
      var b = a(this, v, w);
      if (!this.lastNeed) return v.toString("utf8", w);
      this.lastTotal = b;
      var F = v.length - (b - this.lastNeed);
      return v.copy(this.lastChar, 0, F), v.toString("utf8", w, F);
    }
    function u(v) {
      var w = v && v.length ? this.write(v) : "";
      return this.lastNeed ? w + "�" : w;
    }
    function f(v, w) {
      if ((v.length - w) % 2 === 0) {
        var b = v.toString("utf16le", w);
        if (b) {
          var F = b.charCodeAt(b.length - 1);
          if (F >= 55296 && F <= 56319)
            return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = v[v.length - 2], this.lastChar[1] = v[v.length - 1], b.slice(0, -1);
        }
        return b;
      }
      return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = v[v.length - 1], v.toString("utf16le", w, v.length - 1);
    }
    function l(v) {
      var w = v && v.length ? this.write(v) : "";
      if (this.lastNeed) {
        var b = this.lastTotal - this.lastNeed;
        return w + this.lastChar.toString("utf16le", 0, b);
      }
      return w;
    }
    function p(v, w) {
      var b = (v.length - w) % 3;
      return b === 0 ? v.toString("base64", w) : (this.lastNeed = 3 - b, this.lastTotal = 3, b === 1 ? this.lastChar[0] = v[v.length - 1] : (this.lastChar[0] = v[v.length - 2], this.lastChar[1] = v[v.length - 1]), v.toString("base64", w, v.length - b));
    }
    function g(v) {
      var w = v && v.length ? this.write(v) : "";
      return this.lastNeed ? w + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : w;
    }
    function m(v) {
      return v.toString(this.encoding);
    }
    function x(v) {
      return v && v.length ? this.write(v) : "";
    }
    return Ii;
  }
  var Pi, yo;
  function fd() {
    if (yo) return Pi;
    yo = 1;
    var n = Bt.Buffer;
    Pi = {
      // Encodings
      utf8: { type: "_internal", bomAware: !0 },
      cesu8: { type: "_internal", bomAware: !0 },
      unicode11utf8: "utf8",
      ucs2: { type: "_internal", bomAware: !0 },
      utf16le: "ucs2",
      binary: { type: "_internal" },
      base64: { type: "_internal" },
      hex: { type: "_internal" },
      // Codec.
      _internal: e
    };
    function e(c, u) {
      this.enc = c.encodingName, this.bomAware = c.bomAware, this.enc === "base64" ? this.encoder = s : this.enc === "utf8" ? this.encoder = h : this.enc === "cesu8" && (this.enc = "utf8", this.encoder = a, n.from("eda0bdedb2a9", "hex").toString() !== "💩" && (this.decoder = o, this.defaultCharUnicode = u.defaultCharUnicode));
    }
    e.prototype.encoder = i, e.prototype.decoder = r;
    var t = ld().StringDecoder;
    function r(c, u) {
      this.decoder = new t(u.enc);
    }
    r.prototype.write = function(c) {
      return n.isBuffer(c) || (c = n.from(c)), this.decoder.write(c);
    }, r.prototype.end = function() {
      return this.decoder.end();
    };
    function i(c, u) {
      this.enc = u.enc;
    }
    i.prototype.write = function(c) {
      return n.from(c, this.enc);
    }, i.prototype.end = function() {
    };
    function s(c, u) {
      this.prevStr = "";
    }
    s.prototype.write = function(c) {
      c = this.prevStr + c;
      var u = c.length - c.length % 4;
      return this.prevStr = c.slice(u), c = c.slice(0, u), n.from(c, "base64");
    }, s.prototype.end = function() {
      return n.from(this.prevStr, "base64");
    };
    function a(c, u) {
    }
    a.prototype.write = function(c) {
      for (var u = n.alloc(c.length * 3), f = 0, l = 0; l < c.length; l++) {
        var p = c.charCodeAt(l);
        p < 128 ? u[f++] = p : p < 2048 ? (u[f++] = 192 + (p >>> 6), u[f++] = 128 + (p & 63)) : (u[f++] = 224 + (p >>> 12), u[f++] = 128 + (p >>> 6 & 63), u[f++] = 128 + (p & 63));
      }
      return u.slice(0, f);
    }, a.prototype.end = function() {
    };
    function o(c, u) {
      this.acc = 0, this.contBytes = 0, this.accBytes = 0, this.defaultCharUnicode = u.defaultCharUnicode;
    }
    o.prototype.write = function(c) {
      for (var u = this.acc, f = this.contBytes, l = this.accBytes, p = "", g = 0; g < c.length; g++) {
        var m = c[g];
        (m & 192) !== 128 ? (f > 0 && (p += this.defaultCharUnicode, f = 0), m < 128 ? p += String.fromCharCode(m) : m < 224 ? (u = m & 31, f = 1, l = 1) : m < 240 ? (u = m & 15, f = 2, l = 1) : p += this.defaultCharUnicode) : f > 0 ? (u = u << 6 | m & 63, f--, l++, f === 0 && (l === 2 && u < 128 && u > 0 ? p += this.defaultCharUnicode : l === 3 && u < 2048 ? p += this.defaultCharUnicode : p += String.fromCharCode(u))) : p += this.defaultCharUnicode;
      }
      return this.acc = u, this.contBytes = f, this.accBytes = l, p;
    }, o.prototype.end = function() {
      var c = 0;
      return this.contBytes > 0 && (c += this.defaultCharUnicode), c;
    };
    function h(c, u) {
      this.highSurrogate = "";
    }
    return h.prototype.write = function(c) {
      if (this.highSurrogate && (c = this.highSurrogate + c, this.highSurrogate = ""), c.length > 0) {
        var u = c.charCodeAt(c.length - 1);
        u >= 55296 && u < 56320 && (this.highSurrogate = c[c.length - 1], c = c.slice(0, c.length - 1));
      }
      return n.from(c, this.enc);
    }, h.prototype.end = function() {
      if (this.highSurrogate) {
        var c = this.highSurrogate;
        return this.highSurrogate = "", n.from(c, this.enc);
      }
    }, Pi;
  }
  var ht = {}, mo;
  function pd() {
    if (mo) return ht;
    mo = 1;
    var n = Bt.Buffer;
    ht._utf32 = e;
    function e(c, u) {
      this.iconv = u, this.bomAware = !0, this.isLE = c.isLE;
    }
    ht.utf32le = { type: "_utf32", isLE: !0 }, ht.utf32be = { type: "_utf32", isLE: !1 }, ht.ucs4le = "utf32le", ht.ucs4be = "utf32be", e.prototype.encoder = t, e.prototype.decoder = r;
    function t(c, u) {
      this.isLE = u.isLE, this.highSurrogate = 0;
    }
    t.prototype.write = function(c) {
      for (var u = n.from(c, "ucs2"), f = n.alloc(u.length * 2), l = this.isLE ? f.writeUInt32LE : f.writeUInt32BE, p = 0, g = 0; g < u.length; g += 2) {
        var m = u.readUInt16LE(g), x = m >= 55296 && m < 56320, v = m >= 56320 && m < 57344;
        if (this.highSurrogate)
          if (x || !v)
            l.call(f, this.highSurrogate, p), p += 4;
          else {
            var w = (this.highSurrogate - 55296 << 10 | m - 56320) + 65536;
            l.call(f, w, p), p += 4, this.highSurrogate = 0;
            continue;
          }
        x ? this.highSurrogate = m : (l.call(f, m, p), p += 4, this.highSurrogate = 0);
      }
      return p < f.length && (f = f.slice(0, p)), f;
    }, t.prototype.end = function() {
      if (this.highSurrogate) {
        var c = n.alloc(4);
        return this.isLE ? c.writeUInt32LE(this.highSurrogate, 0) : c.writeUInt32BE(this.highSurrogate, 0), this.highSurrogate = 0, c;
      }
    };
    function r(c, u) {
      this.isLE = u.isLE, this.badChar = u.iconv.defaultCharUnicode.charCodeAt(0), this.overflow = [];
    }
    r.prototype.write = function(c) {
      if (c.length === 0)
        return "";
      var u = 0, f = 0, l = n.alloc(c.length + 4), p = 0, g = this.isLE, m = this.overflow, x = this.badChar;
      if (m.length > 0) {
        for (; u < c.length && m.length < 4; u++)
          m.push(c[u]);
        m.length === 4 && (g ? f = m[u] | m[u + 1] << 8 | m[u + 2] << 16 | m[u + 3] << 24 : f = m[u + 3] | m[u + 2] << 8 | m[u + 1] << 16 | m[u] << 24, m.length = 0, p = i(l, p, f, x));
      }
      for (; u < c.length - 3; u += 4)
        g ? f = c[u] | c[u + 1] << 8 | c[u + 2] << 16 | c[u + 3] << 24 : f = c[u + 3] | c[u + 2] << 8 | c[u + 1] << 16 | c[u] << 24, p = i(l, p, f, x);
      for (; u < c.length; u++)
        m.push(c[u]);
      return l.slice(0, p).toString("ucs2");
    };
    function i(c, u, f, l) {
      if ((f < 0 || f > 1114111) && (f = l), f >= 65536) {
        f -= 65536;
        var p = 55296 | f >> 10;
        c[u++] = p & 255, c[u++] = p >> 8;
        var f = 56320 | f & 1023;
      }
      return c[u++] = f & 255, c[u++] = f >> 8, u;
    }
    r.prototype.end = function() {
      this.overflow.length = 0;
    }, ht.utf32 = s, ht.ucs4 = "utf32";
    function s(c, u) {
      this.iconv = u;
    }
    s.prototype.encoder = a, s.prototype.decoder = o;
    function a(c, u) {
      c = c || {}, c.addBOM === void 0 && (c.addBOM = !0), this.encoder = u.iconv.getEncoder(c.defaultEncoding || "utf-32le", c);
    }
    a.prototype.write = function(c) {
      return this.encoder.write(c);
    }, a.prototype.end = function() {
      return this.encoder.end();
    };
    function o(c, u) {
      this.decoder = null, this.initialBufs = [], this.initialBufsLen = 0, this.options = c || {}, this.iconv = u.iconv;
    }
    o.prototype.write = function(c) {
      if (!this.decoder) {
        if (this.initialBufs.push(c), this.initialBufsLen += c.length, this.initialBufsLen < 32)
          return "";
        var u = h(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(u, this.options);
        for (var f = "", l = 0; l < this.initialBufs.length; l++)
          f += this.decoder.write(this.initialBufs[l]);
        return this.initialBufs.length = this.initialBufsLen = 0, f;
      }
      return this.decoder.write(c);
    }, o.prototype.end = function() {
      if (!this.decoder) {
        var c = h(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(c, this.options);
        for (var u = "", f = 0; f < this.initialBufs.length; f++)
          u += this.decoder.write(this.initialBufs[f]);
        var l = this.decoder.end();
        return l && (u += l), this.initialBufs.length = this.initialBufsLen = 0, u;
      }
      return this.decoder.end();
    };
    function h(c, u) {
      var f = [], l = 0, p = 0, g = 0, m = 0, x = 0;
      e:
        for (var v = 0; v < c.length; v++)
          for (var w = c[v], b = 0; b < w.length; b++)
            if (f.push(w[b]), f.length === 4) {
              if (l === 0) {
                if (f[0] === 255 && f[1] === 254 && f[2] === 0 && f[3] === 0)
                  return "utf-32le";
                if (f[0] === 0 && f[1] === 0 && f[2] === 254 && f[3] === 255)
                  return "utf-32be";
              }
              if ((f[0] !== 0 || f[1] > 16) && g++, (f[3] !== 0 || f[2] > 16) && p++, f[0] === 0 && f[1] === 0 && (f[2] !== 0 || f[3] !== 0) && x++, (f[0] !== 0 || f[1] !== 0) && f[2] === 0 && f[3] === 0 && m++, f.length = 0, l++, l >= 100)
                break e;
            }
      return x - g > m - p ? "utf-32be" : x - g < m - p ? "utf-32le" : u || "utf-32le";
    }
    return ht;
  }
  var Bn = {}, vo;
  function dd() {
    if (vo) return Bn;
    vo = 1;
    var n = Bt.Buffer;
    Bn.utf16be = e;
    function e() {
    }
    e.prototype.encoder = t, e.prototype.decoder = r, e.prototype.bomAware = !0;
    function t() {
    }
    t.prototype.write = function(h) {
      for (var c = n.from(h, "ucs2"), u = 0; u < c.length; u += 2) {
        var f = c[u];
        c[u] = c[u + 1], c[u + 1] = f;
      }
      return c;
    }, t.prototype.end = function() {
    };
    function r() {
      this.overflowByte = -1;
    }
    r.prototype.write = function(h) {
      if (h.length == 0)
        return "";
      var c = n.alloc(h.length + 1), u = 0, f = 0;
      for (this.overflowByte !== -1 && (c[0] = h[0], c[1] = this.overflowByte, u = 1, f = 2); u < h.length - 1; u += 2, f += 2)
        c[f] = h[u + 1], c[f + 1] = h[u];
      return this.overflowByte = u == h.length - 1 ? h[h.length - 1] : -1, c.slice(0, f).toString("ucs2");
    }, r.prototype.end = function() {
      this.overflowByte = -1;
    }, Bn.utf16 = i;
    function i(h, c) {
      this.iconv = c;
    }
    i.prototype.encoder = s, i.prototype.decoder = a;
    function s(h, c) {
      h = h || {}, h.addBOM === void 0 && (h.addBOM = !0), this.encoder = c.iconv.getEncoder("utf-16le", h);
    }
    s.prototype.write = function(h) {
      return this.encoder.write(h);
    }, s.prototype.end = function() {
      return this.encoder.end();
    };
    function a(h, c) {
      this.decoder = null, this.initialBufs = [], this.initialBufsLen = 0, this.options = h || {}, this.iconv = c.iconv;
    }
    a.prototype.write = function(h) {
      if (!this.decoder) {
        if (this.initialBufs.push(h), this.initialBufsLen += h.length, this.initialBufsLen < 16)
          return "";
        var c = o(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(c, this.options);
        for (var u = "", f = 0; f < this.initialBufs.length; f++)
          u += this.decoder.write(this.initialBufs[f]);
        return this.initialBufs.length = this.initialBufsLen = 0, u;
      }
      return this.decoder.write(h);
    }, a.prototype.end = function() {
      if (!this.decoder) {
        var h = o(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(h, this.options);
        for (var c = "", u = 0; u < this.initialBufs.length; u++)
          c += this.decoder.write(this.initialBufs[u]);
        var f = this.decoder.end();
        return f && (c += f), this.initialBufs.length = this.initialBufsLen = 0, c;
      }
      return this.decoder.end();
    };
    function o(h, c) {
      var u = [], f = 0, l = 0, p = 0;
      e:
        for (var g = 0; g < h.length; g++)
          for (var m = h[g], x = 0; x < m.length; x++)
            if (u.push(m[x]), u.length === 2) {
              if (f === 0) {
                if (u[0] === 255 && u[1] === 254) return "utf-16le";
                if (u[0] === 254 && u[1] === 255) return "utf-16be";
              }
              if (u[0] === 0 && u[1] !== 0 && p++, u[0] !== 0 && u[1] === 0 && l++, u.length = 0, f++, f >= 100)
                break e;
            }
      return p > l ? "utf-16be" : p < l ? "utf-16le" : c || "utf-16le";
    }
    return Bn;
  }
  var Tr = {}, xo;
  function gd() {
    if (xo) return Tr;
    xo = 1;
    var n = Bt.Buffer;
    Tr.utf7 = e, Tr.unicode11utf7 = "utf7";
    function e(m, x) {
      this.iconv = x;
    }
    e.prototype.encoder = r, e.prototype.decoder = i, e.prototype.bomAware = !0;
    var t = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;
    function r(m, x) {
      this.iconv = x.iconv;
    }
    r.prototype.write = function(m) {
      return n.from(m.replace(t, (function(x) {
        return "+" + (x === "+" ? "" : this.iconv.encode(x, "utf16-be").toString("base64").replace(/=+$/, "")) + "-";
      }).bind(this)));
    }, r.prototype.end = function() {
    };
    function i(m, x) {
      this.iconv = x.iconv, this.inBase64 = !1, this.base64Accum = "";
    }
    for (var s = /[A-Za-z0-9\/+]/, a = [], o = 0; o < 256; o++)
      a[o] = s.test(String.fromCharCode(o));
    var h = 43, c = 45, u = 38;
    i.prototype.write = function(m) {
      for (var x = "", v = 0, w = this.inBase64, b = this.base64Accum, F = 0; F < m.length; F++)
        if (!w)
          m[F] == h && (x += this.iconv.decode(m.slice(v, F), "ascii"), v = F + 1, w = !0);
        else if (!a[m[F]]) {
          if (F == v && m[F] == c)
            x += "+";
          else {
            var C = b + this.iconv.decode(m.slice(v, F), "ascii");
            x += this.iconv.decode(n.from(C, "base64"), "utf16-be");
          }
          m[F] != c && F--, v = F + 1, w = !1, b = "";
        }
      if (!w)
        x += this.iconv.decode(m.slice(v), "ascii");
      else {
        var C = b + this.iconv.decode(m.slice(v), "ascii"), _ = C.length - C.length % 8;
        b = C.slice(_), C = C.slice(0, _), x += this.iconv.decode(n.from(C, "base64"), "utf16-be");
      }
      return this.inBase64 = w, this.base64Accum = b, x;
    }, i.prototype.end = function() {
      var m = "";
      return this.inBase64 && this.base64Accum.length > 0 && (m = this.iconv.decode(n.from(this.base64Accum, "base64"), "utf16-be")), this.inBase64 = !1, this.base64Accum = "", m;
    }, Tr.utf7imap = f;
    function f(m, x) {
      this.iconv = x;
    }
    f.prototype.encoder = l, f.prototype.decoder = p, f.prototype.bomAware = !0;
    function l(m, x) {
      this.iconv = x.iconv, this.inBase64 = !1, this.base64Accum = n.alloc(6), this.base64AccumIdx = 0;
    }
    l.prototype.write = function(m) {
      for (var x = this.inBase64, v = this.base64Accum, w = this.base64AccumIdx, b = n.alloc(m.length * 5 + 10), F = 0, C = 0; C < m.length; C++) {
        var _ = m.charCodeAt(C);
        _ >= 32 && _ <= 126 ? (x && (w > 0 && (F += b.write(v.slice(0, w).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), F), w = 0), b[F++] = c, x = !1), x || (b[F++] = _, _ === u && (b[F++] = c))) : (x || (b[F++] = u, x = !0), x && (v[w++] = _ >> 8, v[w++] = _ & 255, w == v.length && (F += b.write(v.toString("base64").replace(/\//g, ","), F), w = 0)));
      }
      return this.inBase64 = x, this.base64AccumIdx = w, b.slice(0, F);
    }, l.prototype.end = function() {
      var m = n.alloc(10), x = 0;
      return this.inBase64 && (this.base64AccumIdx > 0 && (x += m.write(this.base64Accum.slice(0, this.base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), x), this.base64AccumIdx = 0), m[x++] = c, this.inBase64 = !1), m.slice(0, x);
    };
    function p(m, x) {
      this.iconv = x.iconv, this.inBase64 = !1, this.base64Accum = "";
    }
    var g = a.slice();
    return g[44] = !0, p.prototype.write = function(m) {
      for (var x = "", v = 0, w = this.inBase64, b = this.base64Accum, F = 0; F < m.length; F++)
        if (!w)
          m[F] == u && (x += this.iconv.decode(m.slice(v, F), "ascii"), v = F + 1, w = !0);
        else if (!g[m[F]]) {
          if (F == v && m[F] == c)
            x += "&";
          else {
            var C = b + this.iconv.decode(m.slice(v, F), "ascii").replace(/,/g, "/");
            x += this.iconv.decode(n.from(C, "base64"), "utf16-be");
          }
          m[F] != c && F--, v = F + 1, w = !1, b = "";
        }
      if (!w)
        x += this.iconv.decode(m.slice(v), "ascii");
      else {
        var C = b + this.iconv.decode(m.slice(v), "ascii").replace(/,/g, "/"), _ = C.length - C.length % 8;
        b = C.slice(_), C = C.slice(0, _), x += this.iconv.decode(n.from(C, "base64"), "utf16-be");
      }
      return this.inBase64 = w, this.base64Accum = b, x;
    }, p.prototype.end = function() {
      var m = "";
      return this.inBase64 && this.base64Accum.length > 0 && (m = this.iconv.decode(n.from(this.base64Accum, "base64"), "utf16-be")), this.inBase64 = !1, this.base64Accum = "", m;
    }, Tr;
  }
  var zi = {}, bo;
  function yd() {
    if (bo) return zi;
    bo = 1;
    var n = Bt.Buffer;
    zi._sbcs = e;
    function e(i, s) {
      if (!i)
        throw new Error("SBCS codec is called without the data.");
      if (!i.chars || i.chars.length !== 128 && i.chars.length !== 256)
        throw new Error("Encoding '" + i.type + "' has incorrect 'chars' (must be of len 128 or 256)");
      if (i.chars.length === 128) {
        for (var a = "", o = 0; o < 128; o++)
          a += String.fromCharCode(o);
        i.chars = a + i.chars;
      }
      this.decodeBuf = n.from(i.chars, "ucs2");
      for (var h = n.alloc(65536, s.defaultCharSingleByte.charCodeAt(0)), o = 0; o < i.chars.length; o++)
        h[i.chars.charCodeAt(o)] = o;
      this.encodeBuf = h;
    }
    e.prototype.encoder = t, e.prototype.decoder = r;
    function t(i, s) {
      this.encodeBuf = s.encodeBuf;
    }
    t.prototype.write = function(i) {
      for (var s = n.alloc(i.length), a = 0; a < i.length; a++)
        s[a] = this.encodeBuf[i.charCodeAt(a)];
      return s;
    }, t.prototype.end = function() {
    };
    function r(i, s) {
      this.decodeBuf = s.decodeBuf;
    }
    return r.prototype.write = function(i) {
      for (var s = this.decodeBuf, a = n.alloc(i.length * 2), o = 0, h = 0, c = 0; c < i.length; c++)
        o = i[c] * 2, h = c * 2, a[h] = s[o], a[h + 1] = s[o + 1];
      return a.toString("ucs2");
    }, r.prototype.end = function() {
    }, zi;
  }
  var Ni, wo;
  function md() {
    return wo || (wo = 1, Ni = {
      // Not supported by iconv, not sure why.
      10029: "maccenteuro",
      maccenteuro: {
        type: "_sbcs",
        chars: "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
      },
      808: "cp808",
      ibm808: "cp808",
      cp808: {
        type: "_sbcs",
        chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
      },
      mik: {
        type: "_sbcs",
        chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      cp720: {
        type: "_sbcs",
        chars: "éâàçêëèïîّْô¤ـûùءآأؤ£إئابةتثجحخدذرزسشص«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ضطظعغفµقكلمنهوىي≡ًٌٍَُِ≈°∙·√ⁿ²■ "
      },
      // Aliases of generated encodings.
      ascii8bit: "ascii",
      usascii: "ascii",
      ansix34: "ascii",
      ansix341968: "ascii",
      ansix341986: "ascii",
      csascii: "ascii",
      cp367: "ascii",
      ibm367: "ascii",
      isoir6: "ascii",
      iso646us: "ascii",
      iso646irv: "ascii",
      us: "ascii",
      latin1: "iso88591",
      latin2: "iso88592",
      latin3: "iso88593",
      latin4: "iso88594",
      latin5: "iso88599",
      latin6: "iso885910",
      latin7: "iso885913",
      latin8: "iso885914",
      latin9: "iso885915",
      latin10: "iso885916",
      csisolatin1: "iso88591",
      csisolatin2: "iso88592",
      csisolatin3: "iso88593",
      csisolatin4: "iso88594",
      csisolatincyrillic: "iso88595",
      csisolatinarabic: "iso88596",
      csisolatingreek: "iso88597",
      csisolatinhebrew: "iso88598",
      csisolatin5: "iso88599",
      csisolatin6: "iso885910",
      l1: "iso88591",
      l2: "iso88592",
      l3: "iso88593",
      l4: "iso88594",
      l5: "iso88599",
      l6: "iso885910",
      l7: "iso885913",
      l8: "iso885914",
      l9: "iso885915",
      l10: "iso885916",
      isoir14: "iso646jp",
      isoir57: "iso646cn",
      isoir100: "iso88591",
      isoir101: "iso88592",
      isoir109: "iso88593",
      isoir110: "iso88594",
      isoir144: "iso88595",
      isoir127: "iso88596",
      isoir126: "iso88597",
      isoir138: "iso88598",
      isoir148: "iso88599",
      isoir157: "iso885910",
      isoir166: "tis620",
      isoir179: "iso885913",
      isoir199: "iso885914",
      isoir203: "iso885915",
      isoir226: "iso885916",
      cp819: "iso88591",
      ibm819: "iso88591",
      cyrillic: "iso88595",
      arabic: "iso88596",
      arabic8: "iso88596",
      ecma114: "iso88596",
      asmo708: "iso88596",
      greek: "iso88597",
      greek8: "iso88597",
      ecma118: "iso88597",
      elot928: "iso88597",
      hebrew: "iso88598",
      hebrew8: "iso88598",
      turkish: "iso88599",
      turkish8: "iso88599",
      thai: "iso885911",
      thai8: "iso885911",
      celtic: "iso885914",
      celtic8: "iso885914",
      isoceltic: "iso885914",
      tis6200: "tis620",
      tis62025291: "tis620",
      tis62025330: "tis620",
      1e4: "macroman",
      10006: "macgreek",
      10007: "maccyrillic",
      10079: "maciceland",
      10081: "macturkish",
      cspc8codepage437: "cp437",
      cspc775baltic: "cp775",
      cspc850multilingual: "cp850",
      cspcp852: "cp852",
      cspc862latinhebrew: "cp862",
      cpgr: "cp869",
      msee: "cp1250",
      mscyrl: "cp1251",
      msansi: "cp1252",
      msgreek: "cp1253",
      msturk: "cp1254",
      mshebr: "cp1255",
      msarab: "cp1256",
      winbaltrim: "cp1257",
      cp20866: "koi8r",
      20866: "koi8r",
      ibm878: "koi8r",
      cskoi8r: "koi8r",
      cp21866: "koi8u",
      21866: "koi8u",
      ibm1168: "koi8u",
      strk10482002: "rk1048",
      tcvn5712: "tcvn",
      tcvn57121: "tcvn",
      gb198880: "iso646cn",
      cn: "iso646cn",
      csiso14jisc6220ro: "iso646jp",
      jisc62201969ro: "iso646jp",
      jp: "iso646jp",
      cshproman8: "hproman8",
      r8: "hproman8",
      roman8: "hproman8",
      xroman8: "hproman8",
      ibm1051: "hproman8",
      mac: "macintosh",
      csmacintosh: "macintosh"
    }), Ni;
  }
  var Gi, So;
  function vd() {
    return So || (So = 1, Gi = {
      437: "cp437",
      737: "cp737",
      775: "cp775",
      850: "cp850",
      852: "cp852",
      855: "cp855",
      856: "cp856",
      857: "cp857",
      858: "cp858",
      860: "cp860",
      861: "cp861",
      862: "cp862",
      863: "cp863",
      864: "cp864",
      865: "cp865",
      866: "cp866",
      869: "cp869",
      874: "windows874",
      922: "cp922",
      1046: "cp1046",
      1124: "cp1124",
      1125: "cp1125",
      1129: "cp1129",
      1133: "cp1133",
      1161: "cp1161",
      1162: "cp1162",
      1163: "cp1163",
      1250: "windows1250",
      1251: "windows1251",
      1252: "windows1252",
      1253: "windows1253",
      1254: "windows1254",
      1255: "windows1255",
      1256: "windows1256",
      1257: "windows1257",
      1258: "windows1258",
      28591: "iso88591",
      28592: "iso88592",
      28593: "iso88593",
      28594: "iso88594",
      28595: "iso88595",
      28596: "iso88596",
      28597: "iso88597",
      28598: "iso88598",
      28599: "iso88599",
      28600: "iso885910",
      28601: "iso885911",
      28603: "iso885913",
      28604: "iso885914",
      28605: "iso885915",
      28606: "iso885916",
      windows874: {
        type: "_sbcs",
        chars: "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
      },
      win874: "windows874",
      cp874: "windows874",
      windows1250: {
        type: "_sbcs",
        chars: "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
      },
      win1250: "windows1250",
      cp1250: "windows1250",
      windows1251: {
        type: "_sbcs",
        chars: "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
      },
      win1251: "windows1251",
      cp1251: "windows1251",
      windows1252: {
        type: "_sbcs",
        chars: "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
      },
      win1252: "windows1252",
      cp1252: "windows1252",
      windows1253: {
        type: "_sbcs",
        chars: "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
      },
      win1253: "windows1253",
      cp1253: "windows1253",
      windows1254: {
        type: "_sbcs",
        chars: "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
      },
      win1254: "windows1254",
      cp1254: "windows1254",
      windows1255: {
        type: "_sbcs",
        chars: "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
      },
      win1255: "windows1255",
      cp1255: "windows1255",
      windows1256: {
        type: "_sbcs",
        chars: "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
      },
      win1256: "windows1256",
      cp1256: "windows1256",
      windows1257: {
        type: "_sbcs",
        chars: "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
      },
      win1257: "windows1257",
      cp1257: "windows1257",
      windows1258: {
        type: "_sbcs",
        chars: "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
      },
      win1258: "windows1258",
      cp1258: "windows1258",
      iso88591: {
        type: "_sbcs",
        chars: " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
      },
      cp28591: "iso88591",
      iso88592: {
        type: "_sbcs",
        chars: " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
      },
      cp28592: "iso88592",
      iso88593: {
        type: "_sbcs",
        chars: " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
      },
      cp28593: "iso88593",
      iso88594: {
        type: "_sbcs",
        chars: " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
      },
      cp28594: "iso88594",
      iso88595: {
        type: "_sbcs",
        chars: " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
      },
      cp28595: "iso88595",
      iso88596: {
        type: "_sbcs",
        chars: " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
      },
      cp28596: "iso88596",
      iso88597: {
        type: "_sbcs",
        chars: " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
      },
      cp28597: "iso88597",
      iso88598: {
        type: "_sbcs",
        chars: " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
      },
      cp28598: "iso88598",
      iso88599: {
        type: "_sbcs",
        chars: " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
      },
      cp28599: "iso88599",
      iso885910: {
        type: "_sbcs",
        chars: " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
      },
      cp28600: "iso885910",
      iso885911: {
        type: "_sbcs",
        chars: " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
      },
      cp28601: "iso885911",
      iso885913: {
        type: "_sbcs",
        chars: " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
      },
      cp28603: "iso885913",
      iso885914: {
        type: "_sbcs",
        chars: " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
      },
      cp28604: "iso885914",
      iso885915: {
        type: "_sbcs",
        chars: " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
      },
      cp28605: "iso885915",
      iso885916: {
        type: "_sbcs",
        chars: " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
      },
      cp28606: "iso885916",
      cp437: {
        type: "_sbcs",
        chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      ibm437: "cp437",
      csibm437: "cp437",
      cp737: {
        type: "_sbcs",
        chars: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
      },
      ibm737: "cp737",
      csibm737: "cp737",
      cp775: {
        type: "_sbcs",
        chars: "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
      },
      ibm775: "cp775",
      csibm775: "cp775",
      cp850: {
        type: "_sbcs",
        chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
      },
      ibm850: "cp850",
      csibm850: "cp850",
      cp852: {
        type: "_sbcs",
        chars: "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
      },
      ibm852: "cp852",
      csibm852: "cp852",
      cp855: {
        type: "_sbcs",
        chars: "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
      },
      ibm855: "cp855",
      csibm855: "cp855",
      cp856: {
        type: "_sbcs",
        chars: "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
      },
      ibm856: "cp856",
      csibm856: "cp856",
      cp857: {
        type: "_sbcs",
        chars: "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
      },
      ibm857: "cp857",
      csibm857: "cp857",
      cp858: {
        type: "_sbcs",
        chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
      },
      ibm858: "cp858",
      csibm858: "cp858",
      cp860: {
        type: "_sbcs",
        chars: "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      ibm860: "cp860",
      csibm860: "cp860",
      cp861: {
        type: "_sbcs",
        chars: "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      ibm861: "cp861",
      csibm861: "cp861",
      cp862: {
        type: "_sbcs",
        chars: "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      ibm862: "cp862",
      csibm862: "cp862",
      cp863: {
        type: "_sbcs",
        chars: "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      ibm863: "cp863",
      csibm863: "cp863",
      cp864: {
        type: "_sbcs",
        chars: `\0\x07\b	
\v\f\r\x1B !"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�`
      },
      ibm864: "cp864",
      csibm864: "cp864",
      cp865: {
        type: "_sbcs",
        chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
      },
      ibm865: "cp865",
      csibm865: "cp865",
      cp866: {
        type: "_sbcs",
        chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "
      },
      ibm866: "cp866",
      csibm866: "cp866",
      cp869: {
        type: "_sbcs",
        chars: "������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "
      },
      ibm869: "cp869",
      csibm869: "cp869",
      cp922: {
        type: "_sbcs",
        chars: " ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"
      },
      ibm922: "cp922",
      csibm922: "cp922",
      cp1046: {
        type: "_sbcs",
        chars: "ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"
      },
      ibm1046: "cp1046",
      csibm1046: "cp1046",
      cp1124: {
        type: "_sbcs",
        chars: " ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"
      },
      ibm1124: "cp1124",
      csibm1124: "cp1124",
      cp1125: {
        type: "_sbcs",
        chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "
      },
      ibm1125: "cp1125",
      csibm1125: "cp1125",
      cp1129: {
        type: "_sbcs",
        chars: " ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
      },
      ibm1129: "cp1129",
      csibm1129: "cp1129",
      cp1133: {
        type: "_sbcs",
        chars: " ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"
      },
      ibm1133: "cp1133",
      csibm1133: "cp1133",
      cp1161: {
        type: "_sbcs",
        chars: "��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "
      },
      ibm1161: "cp1161",
      csibm1161: "cp1161",
      cp1162: {
        type: "_sbcs",
        chars: "€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
      },
      ibm1162: "cp1162",
      csibm1162: "cp1162",
      cp1163: {
        type: "_sbcs",
        chars: " ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
      },
      ibm1163: "cp1163",
      csibm1163: "cp1163",
      maccroatian: {
        type: "_sbcs",
        chars: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
      },
      maccyrillic: {
        type: "_sbcs",
        chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
      },
      macgreek: {
        type: "_sbcs",
        chars: "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"
      },
      maciceland: {
        type: "_sbcs",
        chars: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
      },
      macroman: {
        type: "_sbcs",
        chars: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
      },
      macromania: {
        type: "_sbcs",
        chars: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
      },
      macthai: {
        type: "_sbcs",
        chars: "«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFEFF​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"
      },
      macturkish: {
        type: "_sbcs",
        chars: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"
      },
      macukraine: {
        type: "_sbcs",
        chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
      },
      koi8r: {
        type: "_sbcs",
        chars: "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
      },
      koi8u: {
        type: "_sbcs",
        chars: "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
      },
      koi8ru: {
        type: "_sbcs",
        chars: "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
      },
      koi8t: {
        type: "_sbcs",
        chars: "қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
      },
      armscii8: {
        type: "_sbcs",
        chars: " �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"
      },
      rk1048: {
        type: "_sbcs",
        chars: "ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
      },
      tcvn: {
        type: "_sbcs",
        chars: `\0ÚỤỪỬỮ\x07\b	
\v\f\rỨỰỲỶỸÝỴ\x1B !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ`
      },
      georgianacademy: {
        type: "_sbcs",
        chars: "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
      },
      georgianps: {
        type: "_sbcs",
        chars: "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
      },
      pt154: {
        type: "_sbcs",
        chars: "ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
      },
      viscii: {
        type: "_sbcs",
        chars: `\0ẲẴẪ\x07\b	
\v\f\rỶỸ\x1BỴ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ`
      },
      iso646cn: {
        type: "_sbcs",
        chars: `\0\x07\b	
\v\f\r\x1B !"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������`
      },
      iso646jp: {
        type: "_sbcs",
        chars: `\0\x07\b	
\v\f\r\x1B !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_\`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������`
      },
      hproman8: {
        type: "_sbcs",
        chars: " ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"
      },
      macintosh: {
        type: "_sbcs",
        chars: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
      },
      ascii: {
        type: "_sbcs",
        chars: "��������������������������������������������������������������������������������������������������������������������������������"
      },
      tis620: {
        type: "_sbcs",
        chars: "���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
      }
    }), Gi;
  }
  var Hi = {}, Fo;
  function xd() {
    if (Fo) return Hi;
    Fo = 1;
    var n = Bt.Buffer;
    Hi._dbcs = h;
    for (var e = -1, t = -2, r = -10, i = -1e3, s = new Array(256), a = -1, o = 0; o < 256; o++)
      s[o] = e;
    function h(l, p) {
      if (this.encodingName = l.encodingName, !l)
        throw new Error("DBCS codec is called without the data.");
      if (!l.table)
        throw new Error("Encoding '" + this.encodingName + "' has no data.");
      var g = l.table();
      this.decodeTables = [], this.decodeTables[0] = s.slice(0), this.decodeTableSeq = [];
      for (var m = 0; m < g.length; m++)
        this._addDecodeChunk(g[m]);
      if (typeof l.gb18030 == "function") {
        this.gb18030 = l.gb18030();
        var x = this.decodeTables.length;
        this.decodeTables.push(s.slice(0));
        var v = this.decodeTables.length;
        this.decodeTables.push(s.slice(0));
        for (var w = this.decodeTables[0], m = 129; m <= 254; m++)
          for (var b = this.decodeTables[i - w[m]], F = 48; F <= 57; F++) {
            if (b[F] === e)
              b[F] = i - x;
            else if (b[F] > i)
              throw new Error("gb18030 decode tables conflict at byte 2");
            for (var C = this.decodeTables[i - b[F]], _ = 129; _ <= 254; _++) {
              if (C[_] === e)
                C[_] = i - v;
              else {
                if (C[_] === i - v)
                  continue;
                if (C[_] > i)
                  throw new Error("gb18030 decode tables conflict at byte 3");
              }
              for (var E = this.decodeTables[i - C[_]], B = 48; B <= 57; B++)
                E[B] === e && (E[B] = t);
            }
          }
      }
      this.defaultCharUnicode = p.defaultCharUnicode, this.encodeTable = [], this.encodeTableSeq = [];
      var I = {};
      if (l.encodeSkipVals)
        for (var m = 0; m < l.encodeSkipVals.length; m++) {
          var N = l.encodeSkipVals[m];
          if (typeof N == "number")
            I[N] = !0;
          else
            for (var F = N.from; F <= N.to; F++)
              I[F] = !0;
        }
      if (this._fillEncodeTable(0, 0, I), l.encodeAdd)
        for (var q in l.encodeAdd)
          Object.prototype.hasOwnProperty.call(l.encodeAdd, q) && this._setEncodeChar(q.charCodeAt(0), l.encodeAdd[q]);
      this.defCharSB = this.encodeTable[0][p.defaultCharSingleByte.charCodeAt(0)], this.defCharSB === e && (this.defCharSB = this.encodeTable[0]["?"]), this.defCharSB === e && (this.defCharSB = 63);
    }
    h.prototype.encoder = c, h.prototype.decoder = u, h.prototype._getDecodeTrieNode = function(l) {
      for (var p = []; l > 0; l >>>= 8)
        p.push(l & 255);
      p.length == 0 && p.push(0);
      for (var g = this.decodeTables[0], m = p.length - 1; m > 0; m--) {
        var x = g[p[m]];
        if (x == e)
          g[p[m]] = i - this.decodeTables.length, this.decodeTables.push(g = s.slice(0));
        else if (x <= i)
          g = this.decodeTables[i - x];
        else
          throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + l.toString(16));
      }
      return g;
    }, h.prototype._addDecodeChunk = function(l) {
      var p = parseInt(l[0], 16), g = this._getDecodeTrieNode(p);
      p = p & 255;
      for (var m = 1; m < l.length; m++) {
        var x = l[m];
        if (typeof x == "string")
          for (var v = 0; v < x.length; ) {
            var w = x.charCodeAt(v++);
            if (w >= 55296 && w < 56320) {
              var b = x.charCodeAt(v++);
              if (b >= 56320 && b < 57344)
                g[p++] = 65536 + (w - 55296) * 1024 + (b - 56320);
              else
                throw new Error("Incorrect surrogate pair in " + this.encodingName + " at chunk " + l[0]);
            } else if (w > 4080 && w <= 4095) {
              for (var F = 4095 - w + 2, C = [], _ = 0; _ < F; _++)
                C.push(x.charCodeAt(v++));
              g[p++] = r - this.decodeTableSeq.length, this.decodeTableSeq.push(C);
            } else
              g[p++] = w;
          }
        else if (typeof x == "number")
          for (var E = g[p - 1] + 1, v = 0; v < x; v++)
            g[p++] = E++;
        else
          throw new Error("Incorrect type '" + typeof x + "' given in " + this.encodingName + " at chunk " + l[0]);
      }
      if (p > 255)
        throw new Error("Incorrect chunk in " + this.encodingName + " at addr " + l[0] + ": too long" + p);
    }, h.prototype._getEncodeBucket = function(l) {
      var p = l >> 8;
      return this.encodeTable[p] === void 0 && (this.encodeTable[p] = s.slice(0)), this.encodeTable[p];
    }, h.prototype._setEncodeChar = function(l, p) {
      var g = this._getEncodeBucket(l), m = l & 255;
      g[m] <= r ? this.encodeTableSeq[r - g[m]][a] = p : g[m] == e && (g[m] = p);
    }, h.prototype._setEncodeSequence = function(l, p) {
      var g = l[0], m = this._getEncodeBucket(g), x = g & 255, v;
      m[x] <= r ? v = this.encodeTableSeq[r - m[x]] : (v = {}, m[x] !== e && (v[a] = m[x]), m[x] = r - this.encodeTableSeq.length, this.encodeTableSeq.push(v));
      for (var w = 1; w < l.length - 1; w++) {
        var b = v[g];
        typeof b == "object" ? v = b : (v = v[g] = {}, b !== void 0 && (v[a] = b));
      }
      g = l[l.length - 1], v[g] = p;
    }, h.prototype._fillEncodeTable = function(l, p, g) {
      for (var m = this.decodeTables[l], x = !1, v = {}, w = 0; w < 256; w++) {
        var b = m[w], F = p + w;
        if (!g[F])
          if (b >= 0)
            this._setEncodeChar(b, F), x = !0;
          else if (b <= i) {
            var C = i - b;
            if (!v[C]) {
              var _ = F << 8 >>> 0;
              this._fillEncodeTable(C, _, g) ? x = !0 : v[C] = !0;
            }
          } else b <= r && (this._setEncodeSequence(this.decodeTableSeq[r - b], F), x = !0);
      }
      return x;
    };
    function c(l, p) {
      this.leadSurrogate = -1, this.seqObj = void 0, this.encodeTable = p.encodeTable, this.encodeTableSeq = p.encodeTableSeq, this.defaultCharSingleByte = p.defCharSB, this.gb18030 = p.gb18030;
    }
    c.prototype.write = function(l) {
      for (var p = n.alloc(l.length * (this.gb18030 ? 4 : 3)), g = this.leadSurrogate, m = this.seqObj, x = -1, v = 0, w = 0; ; ) {
        if (x === -1) {
          if (v == l.length) break;
          var b = l.charCodeAt(v++);
        } else {
          var b = x;
          x = -1;
        }
        if (b >= 55296 && b < 57344)
          if (b < 56320)
            if (g === -1) {
              g = b;
              continue;
            } else
              g = b, b = e;
          else
            g !== -1 ? (b = 65536 + (g - 55296) * 1024 + (b - 56320), g = -1) : b = e;
        else g !== -1 && (x = b, b = e, g = -1);
        var F = e;
        if (m !== void 0 && b != e) {
          var C = m[b];
          if (typeof C == "object") {
            m = C;
            continue;
          } else typeof C == "number" ? F = C : C == null && (C = m[a], C !== void 0 && (F = C, x = b));
          m = void 0;
        } else if (b >= 0) {
          var _ = this.encodeTable[b >> 8];
          if (_ !== void 0 && (F = _[b & 255]), F <= r) {
            m = this.encodeTableSeq[r - F];
            continue;
          }
          if (F == e && this.gb18030) {
            var E = f(this.gb18030.uChars, b);
            if (E != -1) {
              var F = this.gb18030.gbChars[E] + (b - this.gb18030.uChars[E]);
              p[w++] = 129 + Math.floor(F / 12600), F = F % 12600, p[w++] = 48 + Math.floor(F / 1260), F = F % 1260, p[w++] = 129 + Math.floor(F / 10), F = F % 10, p[w++] = 48 + F;
              continue;
            }
          }
        }
        F === e && (F = this.defaultCharSingleByte), F < 256 ? p[w++] = F : F < 65536 ? (p[w++] = F >> 8, p[w++] = F & 255) : F < 16777216 ? (p[w++] = F >> 16, p[w++] = F >> 8 & 255, p[w++] = F & 255) : (p[w++] = F >>> 24, p[w++] = F >>> 16 & 255, p[w++] = F >>> 8 & 255, p[w++] = F & 255);
      }
      return this.seqObj = m, this.leadSurrogate = g, p.slice(0, w);
    }, c.prototype.end = function() {
      if (!(this.leadSurrogate === -1 && this.seqObj === void 0)) {
        var l = n.alloc(10), p = 0;
        if (this.seqObj) {
          var g = this.seqObj[a];
          g !== void 0 && (g < 256 ? l[p++] = g : (l[p++] = g >> 8, l[p++] = g & 255)), this.seqObj = void 0;
        }
        return this.leadSurrogate !== -1 && (l[p++] = this.defaultCharSingleByte, this.leadSurrogate = -1), l.slice(0, p);
      }
    }, c.prototype.findIdx = f;
    function u(l, p) {
      this.nodeIdx = 0, this.prevBytes = [], this.decodeTables = p.decodeTables, this.decodeTableSeq = p.decodeTableSeq, this.defaultCharUnicode = p.defaultCharUnicode, this.gb18030 = p.gb18030;
    }
    u.prototype.write = function(l) {
      for (var p = n.alloc(l.length * 2), g = this.nodeIdx, m = this.prevBytes, x = this.prevBytes.length, v = -this.prevBytes.length, w, b = 0, F = 0; b < l.length; b++) {
        var C = b >= 0 ? l[b] : m[b + x], w = this.decodeTables[g][C];
        if (!(w >= 0)) if (w === e)
          w = this.defaultCharUnicode.charCodeAt(0), b = v;
        else if (w === t) {
          if (b >= 3)
            var _ = (l[b - 3] - 129) * 12600 + (l[b - 2] - 48) * 1260 + (l[b - 1] - 129) * 10 + (C - 48);
          else
            var _ = (m[b - 3 + x] - 129) * 12600 + ((b - 2 >= 0 ? l[b - 2] : m[b - 2 + x]) - 48) * 1260 + ((b - 1 >= 0 ? l[b - 1] : m[b - 1 + x]) - 129) * 10 + (C - 48);
          var E = f(this.gb18030.gbChars, _);
          w = this.gb18030.uChars[E] + _ - this.gb18030.gbChars[E];
        } else if (w <= i) {
          g = i - w;
          continue;
        } else if (w <= r) {
          for (var B = this.decodeTableSeq[r - w], I = 0; I < B.length - 1; I++)
            w = B[I], p[F++] = w & 255, p[F++] = w >> 8;
          w = B[B.length - 1];
        } else
          throw new Error("iconv-lite internal error: invalid decoding table value " + w + " at " + g + "/" + C);
        if (w >= 65536) {
          w -= 65536;
          var N = 55296 | w >> 10;
          p[F++] = N & 255, p[F++] = N >> 8, w = 56320 | w & 1023;
        }
        p[F++] = w & 255, p[F++] = w >> 8, g = 0, v = b + 1;
      }
      return this.nodeIdx = g, this.prevBytes = v >= 0 ? Array.prototype.slice.call(l, v) : m.slice(v + x).concat(Array.prototype.slice.call(l)), p.slice(0, F).toString("ucs2");
    }, u.prototype.end = function() {
      for (var l = ""; this.prevBytes.length > 0; ) {
        l += this.defaultCharUnicode;
        var p = this.prevBytes.slice(1);
        this.prevBytes = [], this.nodeIdx = 0, p.length > 0 && (l += this.write(p));
      }
      return this.prevBytes = [], this.nodeIdx = 0, l;
    };
    function f(l, p) {
      if (l[0] > p)
        return -1;
      for (var g = 0, m = l.length; g < m - 1; ) {
        var x = g + (m - g + 1 >> 1);
        l[x] <= p ? g = x : m = x;
      }
      return g;
    }
    return Hi;
  }
  const bd = [
    [
      "0",
      "\0",
      128
    ],
    [
      "a1",
      "｡",
      62
    ],
    [
      "8140",
      "　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",
      9,
      "＋－±×"
    ],
    [
      "8180",
      "÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"
    ],
    [
      "81b8",
      "∈∋⊆⊇⊂⊃∪∩"
    ],
    [
      "81c8",
      "∧∨￢⇒⇔∀∃"
    ],
    [
      "81da",
      "∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"
    ],
    [
      "81f0",
      "Å‰♯♭♪†‡¶"
    ],
    [
      "81fc",
      "◯"
    ],
    [
      "824f",
      "０",
      9
    ],
    [
      "8260",
      "Ａ",
      25
    ],
    [
      "8281",
      "ａ",
      25
    ],
    [
      "829f",
      "ぁ",
      82
    ],
    [
      "8340",
      "ァ",
      62
    ],
    [
      "8380",
      "ム",
      22
    ],
    [
      "839f",
      "Α",
      16,
      "Σ",
      6
    ],
    [
      "83bf",
      "α",
      16,
      "σ",
      6
    ],
    [
      "8440",
      "А",
      5,
      "ЁЖ",
      25
    ],
    [
      "8470",
      "а",
      5,
      "ёж",
      7
    ],
    [
      "8480",
      "о",
      17
    ],
    [
      "849f",
      "─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"
    ],
    [
      "8740",
      "①",
      19,
      "Ⅰ",
      9
    ],
    [
      "875f",
      "㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"
    ],
    [
      "877e",
      "㍻"
    ],
    [
      "8780",
      "〝〟№㏍℡㊤",
      4,
      "㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"
    ],
    [
      "889f",
      "亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"
    ],
    [
      "8940",
      "院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"
    ],
    [
      "8980",
      "園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"
    ],
    [
      "8a40",
      "魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"
    ],
    [
      "8a80",
      "橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"
    ],
    [
      "8b40",
      "機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"
    ],
    [
      "8b80",
      "朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"
    ],
    [
      "8c40",
      "掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"
    ],
    [
      "8c80",
      "劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"
    ],
    [
      "8d40",
      "后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"
    ],
    [
      "8d80",
      "項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"
    ],
    [
      "8e40",
      "察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"
    ],
    [
      "8e80",
      "死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"
    ],
    [
      "8f40",
      "宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"
    ],
    [
      "8f80",
      "準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"
    ],
    [
      "9040",
      "拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"
    ],
    [
      "9080",
      "逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"
    ],
    [
      "9140",
      "繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"
    ],
    [
      "9180",
      "操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"
    ],
    [
      "9240",
      "叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"
    ],
    [
      "9280",
      "逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"
    ],
    [
      "9340",
      "邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"
    ],
    [
      "9380",
      "凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"
    ],
    [
      "9440",
      "如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"
    ],
    [
      "9480",
      "楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"
    ],
    [
      "9540",
      "鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"
    ],
    [
      "9580",
      "斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"
    ],
    [
      "9640",
      "法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"
    ],
    [
      "9680",
      "摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"
    ],
    [
      "9740",
      "諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"
    ],
    [
      "9780",
      "沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"
    ],
    [
      "9840",
      "蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"
    ],
    [
      "989f",
      "弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"
    ],
    [
      "9940",
      "僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"
    ],
    [
      "9980",
      "凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"
    ],
    [
      "9a40",
      "咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"
    ],
    [
      "9a80",
      "噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"
    ],
    [
      "9b40",
      "奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"
    ],
    [
      "9b80",
      "它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"
    ],
    [
      "9c40",
      "廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"
    ],
    [
      "9c80",
      "怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"
    ],
    [
      "9d40",
      "戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"
    ],
    [
      "9d80",
      "捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"
    ],
    [
      "9e40",
      "曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"
    ],
    [
      "9e80",
      "梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"
    ],
    [
      "9f40",
      "檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"
    ],
    [
      "9f80",
      "麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"
    ],
    [
      "e040",
      "漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"
    ],
    [
      "e080",
      "烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"
    ],
    [
      "e140",
      "瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"
    ],
    [
      "e180",
      "痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"
    ],
    [
      "e240",
      "磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"
    ],
    [
      "e280",
      "窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"
    ],
    [
      "e340",
      "紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"
    ],
    [
      "e380",
      "縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"
    ],
    [
      "e440",
      "隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"
    ],
    [
      "e480",
      "艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"
    ],
    [
      "e540",
      "蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"
    ],
    [
      "e580",
      "蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"
    ],
    [
      "e640",
      "襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"
    ],
    [
      "e680",
      "諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"
    ],
    [
      "e740",
      "蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"
    ],
    [
      "e780",
      "轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"
    ],
    [
      "e840",
      "錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"
    ],
    [
      "e880",
      "閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"
    ],
    [
      "e940",
      "顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"
    ],
    [
      "e980",
      "騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"
    ],
    [
      "ea40",
      "鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"
    ],
    [
      "ea80",
      "黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"
    ],
    [
      "ed40",
      "纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"
    ],
    [
      "ed80",
      "塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"
    ],
    [
      "ee40",
      "犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"
    ],
    [
      "ee80",
      "蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
    ],
    [
      "eeef",
      "ⅰ",
      9,
      "￢￤＇＂"
    ],
    [
      "f040",
      "",
      62
    ],
    [
      "f080",
      "",
      124
    ],
    [
      "f140",
      "",
      62
    ],
    [
      "f180",
      "",
      124
    ],
    [
      "f240",
      "",
      62
    ],
    [
      "f280",
      "",
      124
    ],
    [
      "f340",
      "",
      62
    ],
    [
      "f380",
      "",
      124
    ],
    [
      "f440",
      "",
      62
    ],
    [
      "f480",
      "",
      124
    ],
    [
      "f540",
      "",
      62
    ],
    [
      "f580",
      "",
      124
    ],
    [
      "f640",
      "",
      62
    ],
    [
      "f680",
      "",
      124
    ],
    [
      "f740",
      "",
      62
    ],
    [
      "f780",
      "",
      124
    ],
    [
      "f840",
      "",
      62
    ],
    [
      "f880",
      "",
      124
    ],
    [
      "f940",
      ""
    ],
    [
      "fa40",
      "ⅰ",
      9,
      "Ⅰ",
      9,
      "￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"
    ],
    [
      "fa80",
      "兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"
    ],
    [
      "fb40",
      "涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"
    ],
    [
      "fb80",
      "祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"
    ],
    [
      "fc40",
      "髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
    ]
  ], wd = [
    [
      "0",
      "\0",
      127
    ],
    [
      "8ea1",
      "｡",
      62
    ],
    [
      "a1a1",
      "　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",
      9,
      "＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"
    ],
    [
      "a2a1",
      "◆□■△▲▽▼※〒→←↑↓〓"
    ],
    [
      "a2ba",
      "∈∋⊆⊇⊂⊃∪∩"
    ],
    [
      "a2ca",
      "∧∨￢⇒⇔∀∃"
    ],
    [
      "a2dc",
      "∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"
    ],
    [
      "a2f2",
      "Å‰♯♭♪†‡¶"
    ],
    [
      "a2fe",
      "◯"
    ],
    [
      "a3b0",
      "０",
      9
    ],
    [
      "a3c1",
      "Ａ",
      25
    ],
    [
      "a3e1",
      "ａ",
      25
    ],
    [
      "a4a1",
      "ぁ",
      82
    ],
    [
      "a5a1",
      "ァ",
      85
    ],
    [
      "a6a1",
      "Α",
      16,
      "Σ",
      6
    ],
    [
      "a6c1",
      "α",
      16,
      "σ",
      6
    ],
    [
      "a7a1",
      "А",
      5,
      "ЁЖ",
      25
    ],
    [
      "a7d1",
      "а",
      5,
      "ёж",
      25
    ],
    [
      "a8a1",
      "─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"
    ],
    [
      "ada1",
      "①",
      19,
      "Ⅰ",
      9
    ],
    [
      "adc0",
      "㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"
    ],
    [
      "addf",
      "㍻〝〟№㏍℡㊤",
      4,
      "㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"
    ],
    [
      "b0a1",
      "亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"
    ],
    [
      "b1a1",
      "院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"
    ],
    [
      "b2a1",
      "押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"
    ],
    [
      "b3a1",
      "魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"
    ],
    [
      "b4a1",
      "粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"
    ],
    [
      "b5a1",
      "機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"
    ],
    [
      "b6a1",
      "供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"
    ],
    [
      "b7a1",
      "掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"
    ],
    [
      "b8a1",
      "検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"
    ],
    [
      "b9a1",
      "后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"
    ],
    [
      "baa1",
      "此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"
    ],
    [
      "bba1",
      "察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"
    ],
    [
      "bca1",
      "次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"
    ],
    [
      "bda1",
      "宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"
    ],
    [
      "bea1",
      "勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"
    ],
    [
      "bfa1",
      "拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"
    ],
    [
      "c0a1",
      "澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"
    ],
    [
      "c1a1",
      "繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"
    ],
    [
      "c2a1",
      "臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"
    ],
    [
      "c3a1",
      "叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"
    ],
    [
      "c4a1",
      "帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"
    ],
    [
      "c5a1",
      "邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"
    ],
    [
      "c6a1",
      "董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"
    ],
    [
      "c7a1",
      "如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"
    ],
    [
      "c8a1",
      "函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"
    ],
    [
      "c9a1",
      "鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"
    ],
    [
      "caa1",
      "福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"
    ],
    [
      "cba1",
      "法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"
    ],
    [
      "cca1",
      "漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"
    ],
    [
      "cda1",
      "諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"
    ],
    [
      "cea1",
      "痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"
    ],
    [
      "cfa1",
      "蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"
    ],
    [
      "d0a1",
      "弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"
    ],
    [
      "d1a1",
      "僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"
    ],
    [
      "d2a1",
      "辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"
    ],
    [
      "d3a1",
      "咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"
    ],
    [
      "d4a1",
      "圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"
    ],
    [
      "d5a1",
      "奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"
    ],
    [
      "d6a1",
      "屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"
    ],
    [
      "d7a1",
      "廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"
    ],
    [
      "d8a1",
      "悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"
    ],
    [
      "d9a1",
      "戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"
    ],
    [
      "daa1",
      "據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"
    ],
    [
      "dba1",
      "曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"
    ],
    [
      "dca1",
      "棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"
    ],
    [
      "dda1",
      "檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"
    ],
    [
      "dea1",
      "沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"
    ],
    [
      "dfa1",
      "漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"
    ],
    [
      "e0a1",
      "燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"
    ],
    [
      "e1a1",
      "瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"
    ],
    [
      "e2a1",
      "癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"
    ],
    [
      "e3a1",
      "磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"
    ],
    [
      "e4a1",
      "筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"
    ],
    [
      "e5a1",
      "紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"
    ],
    [
      "e6a1",
      "罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"
    ],
    [
      "e7a1",
      "隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"
    ],
    [
      "e8a1",
      "茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"
    ],
    [
      "e9a1",
      "蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"
    ],
    [
      "eaa1",
      "蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"
    ],
    [
      "eba1",
      "襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"
    ],
    [
      "eca1",
      "譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"
    ],
    [
      "eda1",
      "蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"
    ],
    [
      "eea1",
      "遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"
    ],
    [
      "efa1",
      "錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"
    ],
    [
      "f0a1",
      "陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"
    ],
    [
      "f1a1",
      "顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"
    ],
    [
      "f2a1",
      "髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"
    ],
    [
      "f3a1",
      "鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"
    ],
    [
      "f4a1",
      "堯槇遙瑤凜熙"
    ],
    [
      "f9a1",
      "纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"
    ],
    [
      "faa1",
      "忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"
    ],
    [
      "fba1",
      "犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"
    ],
    [
      "fca1",
      "釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
    ],
    [
      "fcf1",
      "ⅰ",
      9,
      "￢￤＇＂"
    ],
    [
      "8fa2af",
      "˘ˇ¸˙˝¯˛˚～΄΅"
    ],
    [
      "8fa2c2",
      "¡¦¿"
    ],
    [
      "8fa2eb",
      "ºª©®™¤№"
    ],
    [
      "8fa6e1",
      "ΆΈΉΊΪ"
    ],
    [
      "8fa6e7",
      "Ό"
    ],
    [
      "8fa6e9",
      "ΎΫ"
    ],
    [
      "8fa6ec",
      "Ώ"
    ],
    [
      "8fa6f1",
      "άέήίϊΐόςύϋΰώ"
    ],
    [
      "8fa7c2",
      "Ђ",
      10,
      "ЎЏ"
    ],
    [
      "8fa7f2",
      "ђ",
      10,
      "ўџ"
    ],
    [
      "8fa9a1",
      "ÆĐ"
    ],
    [
      "8fa9a4",
      "Ħ"
    ],
    [
      "8fa9a6",
      "Ĳ"
    ],
    [
      "8fa9a8",
      "ŁĿ"
    ],
    [
      "8fa9ab",
      "ŊØŒ"
    ],
    [
      "8fa9af",
      "ŦÞ"
    ],
    [
      "8fa9c1",
      "æđðħıĳĸłŀŉŋøœßŧþ"
    ],
    [
      "8faaa1",
      "ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"
    ],
    [
      "8faaba",
      "ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"
    ],
    [
      "8faba1",
      "áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"
    ],
    [
      "8fabbd",
      "ġĥíìïîǐ"
    ],
    [
      "8fabc5",
      "īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"
    ],
    [
      "8fb0a1",
      "丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"
    ],
    [
      "8fb1a1",
      "侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"
    ],
    [
      "8fb2a1",
      "傒傓傔傖傛傜傞",
      4,
      "傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"
    ],
    [
      "8fb3a1",
      "凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"
    ],
    [
      "8fb4a1",
      "匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"
    ],
    [
      "8fb5a1",
      "咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"
    ],
    [
      "8fb6a1",
      "嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",
      5,
      "嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",
      4,
      "囱囫园"
    ],
    [
      "8fb7a1",
      "囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",
      4,
      "坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"
    ],
    [
      "8fb8a1",
      "堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"
    ],
    [
      "8fb9a1",
      "奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"
    ],
    [
      "8fbaa1",
      "嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",
      4,
      "寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"
    ],
    [
      "8fbba1",
      "屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"
    ],
    [
      "8fbca1",
      "巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",
      4,
      "幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"
    ],
    [
      "8fbda1",
      "彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",
      4,
      "忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"
    ],
    [
      "8fbea1",
      "悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",
      4,
      "愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"
    ],
    [
      "8fbfa1",
      "懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"
    ],
    [
      "8fc0a1",
      "捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"
    ],
    [
      "8fc1a1",
      "擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"
    ],
    [
      "8fc2a1",
      "昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"
    ],
    [
      "8fc3a1",
      "杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",
      4,
      "桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"
    ],
    [
      "8fc4a1",
      "棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"
    ],
    [
      "8fc5a1",
      "樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"
    ],
    [
      "8fc6a1",
      "歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"
    ],
    [
      "8fc7a1",
      "泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"
    ],
    [
      "8fc8a1",
      "湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"
    ],
    [
      "8fc9a1",
      "濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",
      4,
      "炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",
      4,
      "焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"
    ],
    [
      "8fcaa1",
      "煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"
    ],
    [
      "8fcba1",
      "狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"
    ],
    [
      "8fcca1",
      "珿琀琁琄琇琊琑琚琛琤琦琨",
      9,
      "琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"
    ],
    [
      "8fcda1",
      "甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",
      5,
      "疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"
    ],
    [
      "8fcea1",
      "瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",
      6,
      "皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"
    ],
    [
      "8fcfa1",
      "睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"
    ],
    [
      "8fd0a1",
      "碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"
    ],
    [
      "8fd1a1",
      "秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"
    ],
    [
      "8fd2a1",
      "笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",
      5
    ],
    [
      "8fd3a1",
      "籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"
    ],
    [
      "8fd4a1",
      "綞綦綧綪綳綶綷綹緂",
      4,
      "緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"
    ],
    [
      "8fd5a1",
      "罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"
    ],
    [
      "8fd6a1",
      "胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"
    ],
    [
      "8fd7a1",
      "艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"
    ],
    [
      "8fd8a1",
      "荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"
    ],
    [
      "8fd9a1",
      "蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",
      4,
      "蕖蕙蕜",
      6,
      "蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"
    ],
    [
      "8fdaa1",
      "藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",
      4,
      "虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"
    ],
    [
      "8fdba1",
      "蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",
      6,
      "螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"
    ],
    [
      "8fdca1",
      "蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",
      4,
      "裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"
    ],
    [
      "8fdda1",
      "襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",
      4,
      "觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"
    ],
    [
      "8fdea1",
      "誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",
      4,
      "譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"
    ],
    [
      "8fdfa1",
      "貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"
    ],
    [
      "8fe0a1",
      "踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"
    ],
    [
      "8fe1a1",
      "轃轇轏轑",
      4,
      "轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"
    ],
    [
      "8fe2a1",
      "郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"
    ],
    [
      "8fe3a1",
      "釂釃釅釓釔釗釙釚釞釤釥釩釪釬",
      5,
      "釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",
      4,
      "鉻鉼鉽鉿銈銉銊銍銎銒銗"
    ],
    [
      "8fe4a1",
      "銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",
      4,
      "鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"
    ],
    [
      "8fe5a1",
      "鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",
      4,
      "鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"
    ],
    [
      "8fe6a1",
      "镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"
    ],
    [
      "8fe7a1",
      "霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"
    ],
    [
      "8fe8a1",
      "頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",
      4,
      "餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"
    ],
    [
      "8fe9a1",
      "馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",
      4
    ],
    [
      "8feaa1",
      "鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",
      4,
      "魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"
    ],
    [
      "8feba1",
      "鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",
      4,
      "鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"
    ],
    [
      "8feca1",
      "鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"
    ],
    [
      "8feda1",
      "黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",
      4,
      "齓齕齖齗齘齚齝齞齨齩齭",
      4,
      "齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"
    ]
  ], Wi = [
    [
      "0",
      "\0",
      127,
      "€"
    ],
    [
      "8140",
      "丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",
      5,
      "乲乴",
      9,
      "乿",
      6,
      "亇亊"
    ],
    [
      "8180",
      "亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",
      6,
      "伋伌伒",
      4,
      "伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",
      4,
      "佄佅佇",
      5,
      "佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"
    ],
    [
      "8240",
      "侤侫侭侰",
      4,
      "侶",
      8,
      "俀俁係俆俇俈俉俋俌俍俒",
      4,
      "俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",
      11
    ],
    [
      "8280",
      "個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",
      10,
      "倻倽倿偀偁偂偄偅偆偉偊偋偍偐",
      4,
      "偖偗偘偙偛偝",
      7,
      "偦",
      5,
      "偭",
      8,
      "偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",
      20,
      "傤傦傪傫傭",
      4,
      "傳",
      6,
      "傼"
    ],
    [
      "8340",
      "傽",
      17,
      "僐",
      5,
      "僗僘僙僛",
      10,
      "僨僩僪僫僯僰僱僲僴僶",
      4,
      "僼",
      9,
      "儈"
    ],
    [
      "8380",
      "儉儊儌",
      5,
      "儓",
      13,
      "儢",
      28,
      "兂兇兊兌兎兏児兒兓兗兘兙兛兝",
      4,
      "兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",
      4,
      "冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",
      5
    ],
    [
      "8440",
      "凘凙凚凜凞凟凢凣凥",
      5,
      "凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",
      5,
      "剋剎剏剒剓剕剗剘"
    ],
    [
      "8480",
      "剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",
      9,
      "剾劀劃",
      4,
      "劉",
      6,
      "劑劒劔",
      6,
      "劜劤劥劦劧劮劯劰労",
      9,
      "勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",
      5,
      "勠勡勢勣勥",
      10,
      "勱",
      7,
      "勻勼勽匁匂匃匄匇匉匊匋匌匎"
    ],
    [
      "8540",
      "匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",
      9,
      "匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"
    ],
    [
      "8580",
      "厐",
      4,
      "厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",
      6,
      "厷厸厹厺厼厽厾叀參",
      4,
      "収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",
      4,
      "呣呥呧呩",
      7,
      "呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"
    ],
    [
      "8640",
      "咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",
      4,
      "哫哬哯哰哱哴",
      5,
      "哻哾唀唂唃唄唅唈唊",
      4,
      "唒唓唕",
      5,
      "唜唝唞唟唡唥唦"
    ],
    [
      "8680",
      "唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",
      4,
      "啑啒啓啔啗",
      4,
      "啝啞啟啠啢啣啨啩啫啯",
      5,
      "啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",
      6,
      "喨",
      8,
      "喲喴営喸喺喼喿",
      4,
      "嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",
      4,
      "嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",
      4,
      "嗿嘂嘃嘄嘅"
    ],
    [
      "8740",
      "嘆嘇嘊嘋嘍嘐",
      7,
      "嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",
      11,
      "噏",
      4,
      "噕噖噚噛噝",
      4
    ],
    [
      "8780",
      "噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",
      7,
      "嚇",
      6,
      "嚐嚑嚒嚔",
      14,
      "嚤",
      10,
      "嚰",
      6,
      "嚸嚹嚺嚻嚽",
      12,
      "囋",
      8,
      "囕囖囘囙囜団囥",
      5,
      "囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",
      6
    ],
    [
      "8840",
      "園",
      9,
      "圝圞圠圡圢圤圥圦圧圫圱圲圴",
      4,
      "圼圽圿坁坃坄坅坆坈坉坋坒",
      4,
      "坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"
    ],
    [
      "8880",
      "垁垇垈垉垊垍",
      4,
      "垔",
      6,
      "垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",
      8,
      "埄",
      6,
      "埌埍埐埑埓埖埗埛埜埞埡埢埣埥",
      7,
      "埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",
      4,
      "堫",
      4,
      "報堲堳場堶",
      7
    ],
    [
      "8940",
      "堾",
      5,
      "塅",
      6,
      "塎塏塐塒塓塕塖塗塙",
      4,
      "塟",
      5,
      "塦",
      4,
      "塭",
      16,
      "塿墂墄墆墇墈墊墋墌"
    ],
    [
      "8980",
      "墍",
      4,
      "墔",
      4,
      "墛墜墝墠",
      7,
      "墪",
      17,
      "墽墾墿壀壂壃壄壆",
      10,
      "壒壓壔壖",
      13,
      "壥",
      5,
      "壭壯壱売壴壵壷壸壺",
      7,
      "夃夅夆夈",
      4,
      "夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"
    ],
    [
      "8a40",
      "夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",
      4,
      "奡奣奤奦",
      12,
      "奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"
    ],
    [
      "8a80",
      "妧妬妭妰妱妳",
      5,
      "妺妼妽妿",
      6,
      "姇姈姉姌姍姎姏姕姖姙姛姞",
      4,
      "姤姦姧姩姪姫姭",
      11,
      "姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",
      6,
      "娳娵娷",
      4,
      "娽娾娿婁",
      4,
      "婇婈婋",
      9,
      "婖婗婘婙婛",
      5
    ],
    [
      "8b40",
      "婡婣婤婥婦婨婩婫",
      8,
      "婸婹婻婼婽婾媀",
      17,
      "媓",
      6,
      "媜",
      13,
      "媫媬"
    ],
    [
      "8b80",
      "媭",
      4,
      "媴媶媷媹",
      4,
      "媿嫀嫃",
      5,
      "嫊嫋嫍",
      4,
      "嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",
      4,
      "嫲",
      22,
      "嬊",
      11,
      "嬘",
      25,
      "嬳嬵嬶嬸",
      7,
      "孁",
      6
    ],
    [
      "8c40",
      "孈",
      7,
      "孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"
    ],
    [
      "8c80",
      "寑寔",
      8,
      "寠寢寣實寧審",
      4,
      "寯寱",
      6,
      "寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",
      6,
      "屰屲",
      6,
      "屻屼屽屾岀岃",
      4,
      "岉岊岋岎岏岒岓岕岝",
      4,
      "岤",
      4
    ],
    [
      "8d40",
      "岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",
      5,
      "峌",
      5,
      "峓",
      5,
      "峚",
      6,
      "峢峣峧峩峫峬峮峯峱",
      9,
      "峼",
      4
    ],
    [
      "8d80",
      "崁崄崅崈",
      5,
      "崏",
      4,
      "崕崗崘崙崚崜崝崟",
      4,
      "崥崨崪崫崬崯",
      4,
      "崵",
      7,
      "崿",
      7,
      "嵈嵉嵍",
      10,
      "嵙嵚嵜嵞",
      10,
      "嵪嵭嵮嵰嵱嵲嵳嵵",
      12,
      "嶃",
      21,
      "嶚嶛嶜嶞嶟嶠"
    ],
    [
      "8e40",
      "嶡",
      21,
      "嶸",
      12,
      "巆",
      6,
      "巎",
      12,
      "巜巟巠巣巤巪巬巭"
    ],
    [
      "8e80",
      "巰巵巶巸",
      4,
      "巿帀帄帇帉帊帋帍帎帒帓帗帞",
      7,
      "帨",
      4,
      "帯帰帲",
      4,
      "帹帺帾帿幀幁幃幆",
      5,
      "幍",
      6,
      "幖",
      4,
      "幜幝幟幠幣",
      14,
      "幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",
      4,
      "庮",
      4,
      "庴庺庻庼庽庿",
      6
    ],
    [
      "8f40",
      "廆廇廈廋",
      5,
      "廔廕廗廘廙廚廜",
      11,
      "廩廫",
      8,
      "廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"
    ],
    [
      "8f80",
      "弨弫弬弮弰弲",
      6,
      "弻弽弾弿彁",
      14,
      "彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",
      5,
      "復徫徬徯",
      5,
      "徶徸徹徺徻徾",
      4,
      "忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"
    ],
    [
      "9040",
      "怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",
      4,
      "怶",
      4,
      "怽怾恀恄",
      6,
      "恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"
    ],
    [
      "9080",
      "悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",
      7,
      "惇惈惉惌",
      4,
      "惒惓惔惖惗惙惛惞惡",
      4,
      "惪惱惲惵惷惸惻",
      4,
      "愂愃愄愅愇愊愋愌愐",
      4,
      "愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",
      18,
      "慀",
      6
    ],
    [
      "9140",
      "慇慉態慍慏慐慒慓慔慖",
      6,
      "慞慟慠慡慣慤慥慦慩",
      6,
      "慱慲慳慴慶慸",
      18,
      "憌憍憏",
      4,
      "憕"
    ],
    [
      "9180",
      "憖",
      6,
      "憞",
      8,
      "憪憫憭",
      9,
      "憸",
      5,
      "憿懀懁懃",
      4,
      "應懌",
      4,
      "懓懕",
      16,
      "懧",
      13,
      "懶",
      8,
      "戀",
      5,
      "戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",
      4,
      "扂扄扅扆扊"
    ],
    [
      "9240",
      "扏扐払扖扗扙扚扜",
      6,
      "扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",
      5,
      "抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"
    ],
    [
      "9280",
      "拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",
      5,
      "挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",
      7,
      "捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",
      6,
      "採掤掦掫掯掱掲掵掶掹掻掽掿揀"
    ],
    [
      "9340",
      "揁揂揃揅揇揈揊揋揌揑揓揔揕揗",
      6,
      "揟揢揤",
      4,
      "揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",
      4,
      "損搎搑搒搕",
      5,
      "搝搟搢搣搤"
    ],
    [
      "9380",
      "搥搧搨搩搫搮",
      5,
      "搵",
      4,
      "搻搼搾摀摂摃摉摋",
      6,
      "摓摕摖摗摙",
      4,
      "摟",
      7,
      "摨摪摫摬摮",
      9,
      "摻",
      6,
      "撃撆撈",
      8,
      "撓撔撗撘撚撛撜撝撟",
      4,
      "撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",
      6,
      "擏擑擓擔擕擖擙據"
    ],
    [
      "9440",
      "擛擜擝擟擠擡擣擥擧",
      24,
      "攁",
      7,
      "攊",
      7,
      "攓",
      4,
      "攙",
      8
    ],
    [
      "9480",
      "攢攣攤攦",
      4,
      "攬攭攰攱攲攳攷攺攼攽敀",
      4,
      "敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",
      14,
      "斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",
      7,
      "斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",
      7,
      "旡旣旤旪旫"
    ],
    [
      "9540",
      "旲旳旴旵旸旹旻",
      4,
      "昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",
      4,
      "昽昿晀時晄",
      6,
      "晍晎晐晑晘"
    ],
    [
      "9580",
      "晙晛晜晝晞晠晢晣晥晧晩",
      4,
      "晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",
      4,
      "暞",
      8,
      "暩",
      4,
      "暯",
      4,
      "暵暶暷暸暺暻暼暽暿",
      25,
      "曚曞",
      7,
      "曧曨曪",
      5,
      "曱曵曶書曺曻曽朁朂會"
    ],
    [
      "9640",
      "朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",
      5,
      "朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",
      4,
      "杝杢杣杤杦杧杫杬杮東杴杶"
    ],
    [
      "9680",
      "杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",
      7,
      "柂柅",
      9,
      "柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",
      7,
      "柾栁栂栃栄栆栍栐栒栔栕栘",
      4,
      "栞栟栠栢",
      6,
      "栫",
      6,
      "栴栵栶栺栻栿桇桋桍桏桒桖",
      5
    ],
    [
      "9740",
      "桜桝桞桟桪桬",
      7,
      "桵桸",
      8,
      "梂梄梇",
      7,
      "梐梑梒梔梕梖梘",
      9,
      "梣梤梥梩梪梫梬梮梱梲梴梶梷梸"
    ],
    [
      "9780",
      "梹",
      6,
      "棁棃",
      5,
      "棊棌棎棏棐棑棓棔棖棗棙棛",
      4,
      "棡棢棤",
      9,
      "棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",
      4,
      "椌椏椑椓",
      11,
      "椡椢椣椥",
      7,
      "椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",
      16,
      "楕楖楘楙楛楜楟"
    ],
    [
      "9840",
      "楡楢楤楥楧楨楩楪楬業楯楰楲",
      4,
      "楺楻楽楾楿榁榃榅榊榋榌榎",
      5,
      "榖榗榙榚榝",
      9,
      "榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"
    ],
    [
      "9880",
      "榾榿槀槂",
      7,
      "構槍槏槑槒槓槕",
      5,
      "槜槝槞槡",
      11,
      "槮槯槰槱槳",
      9,
      "槾樀",
      9,
      "樋",
      11,
      "標",
      5,
      "樠樢",
      5,
      "権樫樬樭樮樰樲樳樴樶",
      6,
      "樿",
      4,
      "橅橆橈",
      7,
      "橑",
      6,
      "橚"
    ],
    [
      "9940",
      "橜",
      4,
      "橢橣橤橦",
      10,
      "橲",
      6,
      "橺橻橽橾橿檁檂檃檅",
      8,
      "檏檒",
      4,
      "檘",
      7,
      "檡",
      5
    ],
    [
      "9980",
      "檧檨檪檭",
      114,
      "欥欦欨",
      6
    ],
    [
      "9a40",
      "欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",
      11,
      "歚",
      7,
      "歨歩歫",
      13,
      "歺歽歾歿殀殅殈"
    ],
    [
      "9a80",
      "殌殎殏殐殑殔殕殗殘殙殜",
      4,
      "殢",
      7,
      "殫",
      7,
      "殶殸",
      6,
      "毀毃毄毆",
      4,
      "毌毎毐毑毘毚毜",
      4,
      "毢",
      7,
      "毬毭毮毰毱毲毴毶毷毸毺毻毼毾",
      6,
      "氈",
      4,
      "氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",
      4,
      "汑汒汓汖汘"
    ],
    [
      "9b40",
      "汙汚汢汣汥汦汧汫",
      4,
      "汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"
    ],
    [
      "9b80",
      "泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",
      5,
      "洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",
      4,
      "涃涄涆涇涊涋涍涏涐涒涖",
      4,
      "涜涢涥涬涭涰涱涳涴涶涷涹",
      5,
      "淁淂淃淈淉淊"
    ],
    [
      "9c40",
      "淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",
      7,
      "渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"
    ],
    [
      "9c80",
      "渶渷渹渻",
      7,
      "湅",
      7,
      "湏湐湑湒湕湗湙湚湜湝湞湠",
      10,
      "湬湭湯",
      14,
      "満溁溂溄溇溈溊",
      4,
      "溑",
      6,
      "溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",
      5
    ],
    [
      "9d40",
      "滰滱滲滳滵滶滷滸滺",
      7,
      "漃漄漅漇漈漊",
      4,
      "漐漑漒漖",
      9,
      "漡漢漣漥漦漧漨漬漮漰漲漴漵漷",
      6,
      "漿潀潁潂"
    ],
    [
      "9d80",
      "潃潄潅潈潉潊潌潎",
      9,
      "潙潚潛潝潟潠潡潣潤潥潧",
      5,
      "潯潰潱潳潵潶潷潹潻潽",
      6,
      "澅澆澇澊澋澏",
      12,
      "澝澞澟澠澢",
      4,
      "澨",
      10,
      "澴澵澷澸澺",
      5,
      "濁濃",
      5,
      "濊",
      6,
      "濓",
      10,
      "濟濢濣濤濥"
    ],
    [
      "9e40",
      "濦",
      7,
      "濰",
      32,
      "瀒",
      7,
      "瀜",
      6,
      "瀤",
      6
    ],
    [
      "9e80",
      "瀫",
      9,
      "瀶瀷瀸瀺",
      17,
      "灍灎灐",
      13,
      "灟",
      11,
      "灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",
      12,
      "炰炲炴炵炶為炾炿烄烅烆烇烉烋",
      12,
      "烚"
    ],
    [
      "9f40",
      "烜烝烞烠烡烢烣烥烪烮烰",
      6,
      "烸烺烻烼烾",
      10,
      "焋",
      4,
      "焑焒焔焗焛",
      10,
      "焧",
      7,
      "焲焳焴"
    ],
    [
      "9f80",
      "焵焷",
      13,
      "煆煇煈煉煋煍煏",
      12,
      "煝煟",
      4,
      "煥煩",
      4,
      "煯煰煱煴煵煶煷煹煻煼煾",
      5,
      "熅",
      4,
      "熋熌熍熎熐熑熒熓熕熖熗熚",
      4,
      "熡",
      6,
      "熩熪熫熭",
      5,
      "熴熶熷熸熺",
      8,
      "燄",
      9,
      "燏",
      4
    ],
    [
      "a040",
      "燖",
      9,
      "燡燢燣燤燦燨",
      5,
      "燯",
      9,
      "燺",
      11,
      "爇",
      19
    ],
    [
      "a080",
      "爛爜爞",
      9,
      "爩爫爭爮爯爲爳爴爺爼爾牀",
      6,
      "牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",
      4,
      "犌犎犐犑犓",
      11,
      "犠",
      11,
      "犮犱犲犳犵犺",
      6,
      "狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"
    ],
    [
      "a1a1",
      "　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",
      7,
      "〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"
    ],
    [
      "a2a1",
      "ⅰ",
      9
    ],
    [
      "a2b1",
      "⒈",
      19,
      "⑴",
      19,
      "①",
      9
    ],
    [
      "a2e5",
      "㈠",
      9
    ],
    [
      "a2f1",
      "Ⅰ",
      11
    ],
    [
      "a3a1",
      "！＂＃￥％",
      88,
      "￣"
    ],
    [
      "a4a1",
      "ぁ",
      82
    ],
    [
      "a5a1",
      "ァ",
      85
    ],
    [
      "a6a1",
      "Α",
      16,
      "Σ",
      6
    ],
    [
      "a6c1",
      "α",
      16,
      "σ",
      6
    ],
    [
      "a6e0",
      "︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"
    ],
    [
      "a6ee",
      "︻︼︷︸︱"
    ],
    [
      "a6f4",
      "︳︴"
    ],
    [
      "a7a1",
      "А",
      5,
      "ЁЖ",
      25
    ],
    [
      "a7d1",
      "а",
      5,
      "ёж",
      25
    ],
    [
      "a840",
      "ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",
      35,
      "▁",
      6
    ],
    [
      "a880",
      "█",
      7,
      "▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"
    ],
    [
      "a8a1",
      "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"
    ],
    [
      "a8bd",
      "ńň"
    ],
    [
      "a8c0",
      "ɡ"
    ],
    [
      "a8c5",
      "ㄅ",
      36
    ],
    [
      "a940",
      "〡",
      8,
      "㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"
    ],
    [
      "a959",
      "℡㈱"
    ],
    [
      "a95c",
      "‐"
    ],
    [
      "a960",
      "ー゛゜ヽヾ〆ゝゞ﹉",
      9,
      "﹔﹕﹖﹗﹙",
      8
    ],
    [
      "a980",
      "﹢",
      4,
      "﹨﹩﹪﹫"
    ],
    [
      "a996",
      "〇"
    ],
    [
      "a9a4",
      "─",
      75
    ],
    [
      "aa40",
      "狜狝狟狢",
      5,
      "狪狫狵狶狹狽狾狿猀猂猄",
      5,
      "猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",
      8
    ],
    [
      "aa80",
      "獉獊獋獌獎獏獑獓獔獕獖獘",
      7,
      "獡",
      10,
      "獮獰獱"
    ],
    [
      "ab40",
      "獲",
      11,
      "獿",
      4,
      "玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",
      5,
      "玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",
      4
    ],
    [
      "ab80",
      "珋珌珎珒",
      6,
      "珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",
      4
    ],
    [
      "ac40",
      "珸",
      10,
      "琄琇琈琋琌琍琎琑",
      8,
      "琜",
      5,
      "琣琤琧琩琫琭琯琱琲琷",
      4,
      "琽琾琿瑀瑂",
      11
    ],
    [
      "ac80",
      "瑎",
      6,
      "瑖瑘瑝瑠",
      12,
      "瑮瑯瑱",
      4,
      "瑸瑹瑺"
    ],
    [
      "ad40",
      "瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",
      10,
      "璝璟",
      7,
      "璪",
      15,
      "璻",
      12
    ],
    [
      "ad80",
      "瓈",
      9,
      "瓓",
      8,
      "瓝瓟瓡瓥瓧",
      6,
      "瓰瓱瓲"
    ],
    [
      "ae40",
      "瓳瓵瓸",
      6,
      "甀甁甂甃甅",
      7,
      "甎甐甒甔甕甖甗甛甝甞甠",
      4,
      "甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"
    ],
    [
      "ae80",
      "畝",
      7,
      "畧畨畩畫",
      6,
      "畳畵當畷畺",
      4,
      "疀疁疂疄疅疇"
    ],
    [
      "af40",
      "疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",
      4,
      "疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"
    ],
    [
      "af80",
      "瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"
    ],
    [
      "b040",
      "癅",
      6,
      "癎",
      5,
      "癕癗",
      4,
      "癝癟癠癡癢癤",
      6,
      "癬癭癮癰",
      7,
      "癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"
    ],
    [
      "b080",
      "皜",
      7,
      "皥",
      8,
      "皯皰皳皵",
      9,
      "盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"
    ],
    [
      "b140",
      "盄盇盉盋盌盓盕盙盚盜盝盞盠",
      4,
      "盦",
      7,
      "盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",
      10,
      "眛眜眝眞眡眣眤眥眧眪眫"
    ],
    [
      "b180",
      "眬眮眰",
      4,
      "眹眻眽眾眿睂睄睅睆睈",
      7,
      "睒",
      7,
      "睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"
    ],
    [
      "b240",
      "睝睞睟睠睤睧睩睪睭",
      11,
      "睺睻睼瞁瞂瞃瞆",
      5,
      "瞏瞐瞓",
      11,
      "瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",
      4
    ],
    [
      "b280",
      "瞼瞾矀",
      12,
      "矎",
      8,
      "矘矙矚矝",
      4,
      "矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"
    ],
    [
      "b340",
      "矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",
      5,
      "砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"
    ],
    [
      "b380",
      "硛硜硞",
      11,
      "硯",
      7,
      "硸硹硺硻硽",
      6,
      "场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"
    ],
    [
      "b440",
      "碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",
      7,
      "碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",
      9
    ],
    [
      "b480",
      "磤磥磦磧磩磪磫磭",
      4,
      "磳磵磶磸磹磻",
      5,
      "礂礃礄礆",
      6,
      "础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"
    ],
    [
      "b540",
      "礍",
      5,
      "礔",
      9,
      "礟",
      4,
      "礥",
      14,
      "礵",
      4,
      "礽礿祂祃祄祅祇祊",
      8,
      "祔祕祘祙祡祣"
    ],
    [
      "b580",
      "祤祦祩祪祫祬祮祰",
      6,
      "祹祻",
      4,
      "禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"
    ],
    [
      "b640",
      "禓",
      6,
      "禛",
      11,
      "禨",
      10,
      "禴",
      4,
      "禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",
      5,
      "秠秡秢秥秨秪"
    ],
    [
      "b680",
      "秬秮秱",
      6,
      "秹秺秼秾秿稁稄稅稇稈稉稊稌稏",
      4,
      "稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"
    ],
    [
      "b740",
      "稝稟稡稢稤",
      14,
      "稴稵稶稸稺稾穀",
      5,
      "穇",
      9,
      "穒",
      4,
      "穘",
      16
    ],
    [
      "b780",
      "穩",
      6,
      "穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"
    ],
    [
      "b840",
      "窣窤窧窩窪窫窮",
      4,
      "窴",
      10,
      "竀",
      10,
      "竌",
      9,
      "竗竘竚竛竜竝竡竢竤竧",
      5,
      "竮竰竱竲竳"
    ],
    [
      "b880",
      "竴",
      4,
      "竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"
    ],
    [
      "b940",
      "笯笰笲笴笵笶笷笹笻笽笿",
      5,
      "筆筈筊筍筎筓筕筗筙筜筞筟筡筣",
      10,
      "筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",
      6,
      "箎箏"
    ],
    [
      "b980",
      "箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",
      7,
      "篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"
    ],
    [
      "ba40",
      "篅篈築篊篋篍篎篏篐篒篔",
      4,
      "篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",
      4,
      "篸篹篺篻篽篿",
      7,
      "簈簉簊簍簎簐",
      5,
      "簗簘簙"
    ],
    [
      "ba80",
      "簚",
      4,
      "簠",
      5,
      "簨簩簫",
      12,
      "簹",
      5,
      "籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"
    ],
    [
      "bb40",
      "籃",
      9,
      "籎",
      36,
      "籵",
      5,
      "籾",
      9
    ],
    [
      "bb80",
      "粈粊",
      6,
      "粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",
      4,
      "粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"
    ],
    [
      "bc40",
      "粿糀糂糃糄糆糉糋糎",
      6,
      "糘糚糛糝糞糡",
      6,
      "糩",
      5,
      "糰",
      7,
      "糹糺糼",
      13,
      "紋",
      5
    ],
    [
      "bc80",
      "紑",
      14,
      "紡紣紤紥紦紨紩紪紬紭紮細",
      6,
      "肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"
    ],
    [
      "bd40",
      "紷",
      54,
      "絯",
      7
    ],
    [
      "bd80",
      "絸",
      32,
      "健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"
    ],
    [
      "be40",
      "継",
      12,
      "綧",
      6,
      "綯",
      42
    ],
    [
      "be80",
      "線",
      32,
      "尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"
    ],
    [
      "bf40",
      "緻",
      62
    ],
    [
      "bf80",
      "縺縼",
      4,
      "繂",
      4,
      "繈",
      21,
      "俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"
    ],
    [
      "c040",
      "繞",
      35,
      "纃",
      23,
      "纜纝纞"
    ],
    [
      "c080",
      "纮纴纻纼绖绤绬绹缊缐缞缷缹缻",
      6,
      "罃罆",
      9,
      "罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"
    ],
    [
      "c140",
      "罖罙罛罜罝罞罠罣",
      4,
      "罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",
      7,
      "羋羍羏",
      4,
      "羕",
      4,
      "羛羜羠羢羣羥羦羨",
      6,
      "羱"
    ],
    [
      "c180",
      "羳",
      4,
      "羺羻羾翀翂翃翄翆翇翈翉翋翍翏",
      4,
      "翖翗翙",
      5,
      "翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"
    ],
    [
      "c240",
      "翤翧翨翪翫翬翭翯翲翴",
      6,
      "翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",
      5,
      "耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"
    ],
    [
      "c280",
      "聙聛",
      13,
      "聫",
      5,
      "聲",
      11,
      "隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"
    ],
    [
      "c340",
      "聾肁肂肅肈肊肍",
      5,
      "肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",
      4,
      "胏",
      6,
      "胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"
    ],
    [
      "c380",
      "脌脕脗脙脛脜脝脟",
      12,
      "脭脮脰脳脴脵脷脹",
      4,
      "脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"
    ],
    [
      "c440",
      "腀",
      5,
      "腇腉腍腎腏腒腖腗腘腛",
      4,
      "腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",
      4,
      "膉膋膌膍膎膐膒",
      5,
      "膙膚膞",
      4,
      "膤膥"
    ],
    [
      "c480",
      "膧膩膫",
      7,
      "膴",
      5,
      "膼膽膾膿臄臅臇臈臉臋臍",
      6,
      "摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"
    ],
    [
      "c540",
      "臔",
      14,
      "臤臥臦臨臩臫臮",
      4,
      "臵",
      5,
      "臽臿舃與",
      4,
      "舎舏舑舓舕",
      5,
      "舝舠舤舥舦舧舩舮舲舺舼舽舿"
    ],
    [
      "c580",
      "艀艁艂艃艅艆艈艊艌艍艎艐",
      7,
      "艙艛艜艝艞艠",
      7,
      "艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"
    ],
    [
      "c640",
      "艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"
    ],
    [
      "c680",
      "苺苼",
      4,
      "茊茋茍茐茒茓茖茘茙茝",
      9,
      "茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"
    ],
    [
      "c740",
      "茾茿荁荂荄荅荈荊",
      4,
      "荓荕",
      4,
      "荝荢荰",
      6,
      "荹荺荾",
      6,
      "莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",
      6,
      "莬莭莮"
    ],
    [
      "c780",
      "莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"
    ],
    [
      "c840",
      "菮華菳",
      4,
      "菺菻菼菾菿萀萂萅萇萈萉萊萐萒",
      5,
      "萙萚萛萞",
      5,
      "萩",
      7,
      "萲",
      5,
      "萹萺萻萾",
      7,
      "葇葈葉"
    ],
    [
      "c880",
      "葊",
      6,
      "葒",
      4,
      "葘葝葞葟葠葢葤",
      4,
      "葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"
    ],
    [
      "c940",
      "葽",
      4,
      "蒃蒄蒅蒆蒊蒍蒏",
      7,
      "蒘蒚蒛蒝蒞蒟蒠蒢",
      12,
      "蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"
    ],
    [
      "c980",
      "蓘",
      4,
      "蓞蓡蓢蓤蓧",
      4,
      "蓭蓮蓯蓱",
      10,
      "蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"
    ],
    [
      "ca40",
      "蔃",
      8,
      "蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",
      8,
      "蔭",
      9,
      "蔾",
      4,
      "蕄蕅蕆蕇蕋",
      10
    ],
    [
      "ca80",
      "蕗蕘蕚蕛蕜蕝蕟",
      4,
      "蕥蕦蕧蕩",
      8,
      "蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"
    ],
    [
      "cb40",
      "薂薃薆薈",
      6,
      "薐",
      10,
      "薝",
      6,
      "薥薦薧薩薫薬薭薱",
      5,
      "薸薺",
      6,
      "藂",
      6,
      "藊",
      4,
      "藑藒"
    ],
    [
      "cb80",
      "藔藖",
      5,
      "藝",
      6,
      "藥藦藧藨藪",
      14,
      "恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"
    ],
    [
      "cc40",
      "藹藺藼藽藾蘀",
      4,
      "蘆",
      10,
      "蘒蘓蘔蘕蘗",
      15,
      "蘨蘪",
      13,
      "蘹蘺蘻蘽蘾蘿虀"
    ],
    [
      "cc80",
      "虁",
      11,
      "虒虓處",
      4,
      "虛虜虝號虠虡虣",
      7,
      "獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"
    ],
    [
      "cd40",
      "虭虯虰虲",
      6,
      "蚃",
      6,
      "蚎",
      4,
      "蚔蚖",
      5,
      "蚞",
      4,
      "蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",
      4,
      "蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"
    ],
    [
      "cd80",
      "蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"
    ],
    [
      "ce40",
      "蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",
      6,
      "蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",
      5,
      "蝡蝢蝦",
      7,
      "蝯蝱蝲蝳蝵"
    ],
    [
      "ce80",
      "蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",
      4,
      "螔螕螖螘",
      6,
      "螠",
      4,
      "巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"
    ],
    [
      "cf40",
      "螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",
      4,
      "蟇蟈蟉蟌",
      4,
      "蟔",
      6,
      "蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",
      9
    ],
    [
      "cf80",
      "蟺蟻蟼蟽蟿蠀蠁蠂蠄",
      5,
      "蠋",
      7,
      "蠔蠗蠘蠙蠚蠜",
      4,
      "蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"
    ],
    [
      "d040",
      "蠤",
      13,
      "蠳",
      5,
      "蠺蠻蠽蠾蠿衁衂衃衆",
      5,
      "衎",
      5,
      "衕衖衘衚",
      6,
      "衦衧衪衭衯衱衳衴衵衶衸衹衺"
    ],
    [
      "d080",
      "衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",
      4,
      "袝",
      4,
      "袣袥",
      5,
      "小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"
    ],
    [
      "d140",
      "袬袮袯袰袲",
      4,
      "袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",
      4,
      "裠裡裦裧裩",
      6,
      "裲裵裶裷裺裻製裿褀褁褃",
      5
    ],
    [
      "d180",
      "褉褋",
      4,
      "褑褔",
      4,
      "褜",
      4,
      "褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"
    ],
    [
      "d240",
      "褸",
      8,
      "襂襃襅",
      24,
      "襠",
      5,
      "襧",
      19,
      "襼"
    ],
    [
      "d280",
      "襽襾覀覂覄覅覇",
      26,
      "摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"
    ],
    [
      "d340",
      "覢",
      30,
      "觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",
      6
    ],
    [
      "d380",
      "觻",
      4,
      "訁",
      5,
      "計",
      21,
      "印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"
    ],
    [
      "d440",
      "訞",
      31,
      "訿",
      8,
      "詉",
      21
    ],
    [
      "d480",
      "詟",
      25,
      "詺",
      6,
      "浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"
    ],
    [
      "d540",
      "誁",
      7,
      "誋",
      7,
      "誔",
      46
    ],
    [
      "d580",
      "諃",
      32,
      "铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"
    ],
    [
      "d640",
      "諤",
      34,
      "謈",
      27
    ],
    [
      "d680",
      "謤謥謧",
      30,
      "帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"
    ],
    [
      "d740",
      "譆",
      31,
      "譧",
      4,
      "譭",
      25
    ],
    [
      "d780",
      "讇",
      24,
      "讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"
    ],
    [
      "d840",
      "谸",
      8,
      "豂豃豄豅豈豊豋豍",
      7,
      "豖豗豘豙豛",
      5,
      "豣",
      6,
      "豬",
      6,
      "豴豵豶豷豻",
      6,
      "貃貄貆貇"
    ],
    [
      "d880",
      "貈貋貍",
      6,
      "貕貖貗貙",
      20,
      "亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"
    ],
    [
      "d940",
      "貮",
      62
    ],
    [
      "d980",
      "賭",
      32,
      "佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"
    ],
    [
      "da40",
      "贎",
      14,
      "贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",
      8,
      "趂趃趆趇趈趉趌",
      4,
      "趒趓趕",
      9,
      "趠趡"
    ],
    [
      "da80",
      "趢趤",
      12,
      "趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"
    ],
    [
      "db40",
      "跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",
      6,
      "踆踇踈踋踍踎踐踑踒踓踕",
      7,
      "踠踡踤",
      4,
      "踫踭踰踲踳踴踶踷踸踻踼踾"
    ],
    [
      "db80",
      "踿蹃蹅蹆蹌",
      4,
      "蹓",
      5,
      "蹚",
      11,
      "蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"
    ],
    [
      "dc40",
      "蹳蹵蹷",
      4,
      "蹽蹾躀躂躃躄躆躈",
      6,
      "躑躒躓躕",
      6,
      "躝躟",
      11,
      "躭躮躰躱躳",
      6,
      "躻",
      7
    ],
    [
      "dc80",
      "軃",
      10,
      "軏",
      21,
      "堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"
    ],
    [
      "dd40",
      "軥",
      62
    ],
    [
      "dd80",
      "輤",
      32,
      "荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"
    ],
    [
      "de40",
      "轅",
      32,
      "轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"
    ],
    [
      "de80",
      "迉",
      4,
      "迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"
    ],
    [
      "df40",
      "這逜連逤逥逧",
      5,
      "逰",
      4,
      "逷逹逺逽逿遀遃遅遆遈",
      4,
      "過達違遖遙遚遜",
      5,
      "遤遦遧適遪遫遬遯",
      4,
      "遶",
      6,
      "遾邁"
    ],
    [
      "df80",
      "還邅邆邇邉邊邌",
      4,
      "邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"
    ],
    [
      "e040",
      "郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",
      19,
      "鄚鄛鄜"
    ],
    [
      "e080",
      "鄝鄟鄠鄡鄤",
      10,
      "鄰鄲",
      6,
      "鄺",
      8,
      "酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"
    ],
    [
      "e140",
      "酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",
      4,
      "醆醈醊醎醏醓",
      6,
      "醜",
      5,
      "醤",
      5,
      "醫醬醰醱醲醳醶醷醸醹醻"
    ],
    [
      "e180",
      "醼",
      10,
      "釈釋釐釒",
      9,
      "針",
      8,
      "帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"
    ],
    [
      "e240",
      "釦",
      62
    ],
    [
      "e280",
      "鈥",
      32,
      "狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",
      5,
      "饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"
    ],
    [
      "e340",
      "鉆",
      45,
      "鉵",
      16
    ],
    [
      "e380",
      "銆",
      7,
      "銏",
      24,
      "恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"
    ],
    [
      "e440",
      "銨",
      5,
      "銯",
      24,
      "鋉",
      31
    ],
    [
      "e480",
      "鋩",
      32,
      "洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"
    ],
    [
      "e540",
      "錊",
      51,
      "錿",
      10
    ],
    [
      "e580",
      "鍊",
      31,
      "鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"
    ],
    [
      "e640",
      "鍬",
      34,
      "鎐",
      27
    ],
    [
      "e680",
      "鎬",
      29,
      "鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"
    ],
    [
      "e740",
      "鏎",
      7,
      "鏗",
      54
    ],
    [
      "e780",
      "鐎",
      32,
      "纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",
      6,
      "缪缫缬缭缯",
      4,
      "缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"
    ],
    [
      "e840",
      "鐯",
      14,
      "鐿",
      43,
      "鑬鑭鑮鑯"
    ],
    [
      "e880",
      "鑰",
      20,
      "钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"
    ],
    [
      "e940",
      "锧锳锽镃镈镋镕镚镠镮镴镵長",
      7,
      "門",
      42
    ],
    [
      "e980",
      "閫",
      32,
      "椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"
    ],
    [
      "ea40",
      "闌",
      27,
      "闬闿阇阓阘阛阞阠阣",
      6,
      "阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"
    ],
    [
      "ea80",
      "陘陙陚陜陝陞陠陣陥陦陫陭",
      4,
      "陳陸",
      12,
      "隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"
    ],
    [
      "eb40",
      "隌階隑隒隓隕隖隚際隝",
      9,
      "隨",
      7,
      "隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",
      9,
      "雡",
      6,
      "雫"
    ],
    [
      "eb80",
      "雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",
      4,
      "霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"
    ],
    [
      "ec40",
      "霡",
      8,
      "霫霬霮霯霱霳",
      4,
      "霺霻霼霽霿",
      18,
      "靔靕靗靘靚靜靝靟靣靤靦靧靨靪",
      7
    ],
    [
      "ec80",
      "靲靵靷",
      4,
      "靽",
      7,
      "鞆",
      4,
      "鞌鞎鞏鞐鞓鞕鞖鞗鞙",
      4,
      "臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"
    ],
    [
      "ed40",
      "鞞鞟鞡鞢鞤",
      6,
      "鞬鞮鞰鞱鞳鞵",
      46
    ],
    [
      "ed80",
      "韤韥韨韮",
      4,
      "韴韷",
      23,
      "怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"
    ],
    [
      "ee40",
      "頏",
      62
    ],
    [
      "ee80",
      "顎",
      32,
      "睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",
      4,
      "钼钽钿铄铈",
      6,
      "铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"
    ],
    [
      "ef40",
      "顯",
      5,
      "颋颎颒颕颙颣風",
      37,
      "飏飐飔飖飗飛飜飝飠",
      4
    ],
    [
      "ef80",
      "飥飦飩",
      30,
      "铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",
      4,
      "锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",
      8,
      "镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"
    ],
    [
      "f040",
      "餈",
      4,
      "餎餏餑",
      28,
      "餯",
      26
    ],
    [
      "f080",
      "饊",
      9,
      "饖",
      12,
      "饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",
      4,
      "鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",
      6,
      "鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"
    ],
    [
      "f140",
      "馌馎馚",
      10,
      "馦馧馩",
      47
    ],
    [
      "f180",
      "駙",
      32,
      "瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"
    ],
    [
      "f240",
      "駺",
      62
    ],
    [
      "f280",
      "騹",
      32,
      "颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"
    ],
    [
      "f340",
      "驚",
      17,
      "驲骃骉骍骎骔骕骙骦骩",
      6,
      "骲骳骴骵骹骻骽骾骿髃髄髆",
      4,
      "髍髎髏髐髒體髕髖髗髙髚髛髜"
    ],
    [
      "f380",
      "髝髞髠髢髣髤髥髧髨髩髪髬髮髰",
      8,
      "髺髼",
      6,
      "鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"
    ],
    [
      "f440",
      "鬇鬉",
      5,
      "鬐鬑鬒鬔",
      10,
      "鬠鬡鬢鬤",
      10,
      "鬰鬱鬳",
      7,
      "鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",
      5
    ],
    [
      "f480",
      "魛",
      32,
      "簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"
    ],
    [
      "f540",
      "魼",
      62
    ],
    [
      "f580",
      "鮻",
      32,
      "酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"
    ],
    [
      "f640",
      "鯜",
      62
    ],
    [
      "f680",
      "鰛",
      32,
      "觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",
      5,
      "龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",
      5,
      "鲥",
      4,
      "鲫鲭鲮鲰",
      7,
      "鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"
    ],
    [
      "f740",
      "鰼",
      62
    ],
    [
      "f780",
      "鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",
      4,
      "鳈鳉鳑鳒鳚鳛鳠鳡鳌",
      4,
      "鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"
    ],
    [
      "f840",
      "鳣",
      62
    ],
    [
      "f880",
      "鴢",
      32
    ],
    [
      "f940",
      "鵃",
      62
    ],
    [
      "f980",
      "鶂",
      32
    ],
    [
      "fa40",
      "鶣",
      62
    ],
    [
      "fa80",
      "鷢",
      32
    ],
    [
      "fb40",
      "鸃",
      27,
      "鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",
      9,
      "麀"
    ],
    [
      "fb80",
      "麁麃麄麅麆麉麊麌",
      5,
      "麔",
      8,
      "麞麠",
      5,
      "麧麨麩麪"
    ],
    [
      "fc40",
      "麫",
      8,
      "麵麶麷麹麺麼麿",
      4,
      "黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",
      8,
      "黺黽黿",
      6
    ],
    [
      "fc80",
      "鼆",
      4,
      "鼌鼏鼑鼒鼔鼕鼖鼘鼚",
      5,
      "鼡鼣",
      8,
      "鼭鼮鼰鼱"
    ],
    [
      "fd40",
      "鼲",
      4,
      "鼸鼺鼼鼿",
      4,
      "齅",
      10,
      "齒",
      38
    ],
    [
      "fd80",
      "齹",
      5,
      "龁龂龍",
      11,
      "龜龝龞龡",
      4,
      "郎凉秊裏隣"
    ],
    [
      "fe40",
      "兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"
    ]
  ], To = [
    [
      "a140",
      "",
      62
    ],
    [
      "a180",
      "",
      32
    ],
    [
      "a240",
      "",
      62
    ],
    [
      "a280",
      "",
      32
    ],
    [
      "a2ab",
      "",
      5
    ],
    [
      "a2e3",
      "€"
    ],
    [
      "a2ef",
      ""
    ],
    [
      "a2fd",
      ""
    ],
    [
      "a340",
      "",
      62
    ],
    [
      "a380",
      "",
      31,
      "　"
    ],
    [
      "a440",
      "",
      62
    ],
    [
      "a480",
      "",
      32
    ],
    [
      "a4f4",
      "",
      10
    ],
    [
      "a540",
      "",
      62
    ],
    [
      "a580",
      "",
      32
    ],
    [
      "a5f7",
      "",
      7
    ],
    [
      "a640",
      "",
      62
    ],
    [
      "a680",
      "",
      32
    ],
    [
      "a6b9",
      "",
      7
    ],
    [
      "a6d9",
      "",
      6
    ],
    [
      "a6ec",
      ""
    ],
    [
      "a6f3",
      ""
    ],
    [
      "a6f6",
      "",
      8
    ],
    [
      "a740",
      "",
      62
    ],
    [
      "a780",
      "",
      32
    ],
    [
      "a7c2",
      "",
      14
    ],
    [
      "a7f2",
      "",
      12
    ],
    [
      "a896",
      "",
      10
    ],
    [
      "a8bc",
      "ḿ"
    ],
    [
      "a8bf",
      "ǹ"
    ],
    [
      "a8c1",
      ""
    ],
    [
      "a8ea",
      "",
      20
    ],
    [
      "a958",
      ""
    ],
    [
      "a95b",
      ""
    ],
    [
      "a95d",
      ""
    ],
    [
      "a989",
      "〾⿰",
      11
    ],
    [
      "a997",
      "",
      12
    ],
    [
      "a9f0",
      "",
      14
    ],
    [
      "aaa1",
      "",
      93
    ],
    [
      "aba1",
      "",
      93
    ],
    [
      "aca1",
      "",
      93
    ],
    [
      "ada1",
      "",
      93
    ],
    [
      "aea1",
      "",
      93
    ],
    [
      "afa1",
      "",
      93
    ],
    [
      "d7fa",
      "",
      4
    ],
    [
      "f8a1",
      "",
      93
    ],
    [
      "f9a1",
      "",
      93
    ],
    [
      "faa1",
      "",
      93
    ],
    [
      "fba1",
      "",
      93
    ],
    [
      "fca1",
      "",
      93
    ],
    [
      "fda1",
      "",
      93
    ],
    [
      "fe50",
      "⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"
    ],
    [
      "fe80",
      "䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",
      6,
      "䶮",
      93
    ],
    [
      "8135f437",
      ""
    ]
  ], Sd = [
    128,
    165,
    169,
    178,
    184,
    216,
    226,
    235,
    238,
    244,
    248,
    251,
    253,
    258,
    276,
    284,
    300,
    325,
    329,
    334,
    364,
    463,
    465,
    467,
    469,
    471,
    473,
    475,
    477,
    506,
    594,
    610,
    712,
    716,
    730,
    930,
    938,
    962,
    970,
    1026,
    1104,
    1106,
    8209,
    8215,
    8218,
    8222,
    8231,
    8241,
    8244,
    8246,
    8252,
    8365,
    8452,
    8454,
    8458,
    8471,
    8482,
    8556,
    8570,
    8596,
    8602,
    8713,
    8720,
    8722,
    8726,
    8731,
    8737,
    8740,
    8742,
    8748,
    8751,
    8760,
    8766,
    8777,
    8781,
    8787,
    8802,
    8808,
    8816,
    8854,
    8858,
    8870,
    8896,
    8979,
    9322,
    9372,
    9548,
    9588,
    9616,
    9622,
    9634,
    9652,
    9662,
    9672,
    9676,
    9680,
    9702,
    9735,
    9738,
    9793,
    9795,
    11906,
    11909,
    11913,
    11917,
    11928,
    11944,
    11947,
    11951,
    11956,
    11960,
    11964,
    11979,
    12284,
    12292,
    12312,
    12319,
    12330,
    12351,
    12436,
    12447,
    12535,
    12543,
    12586,
    12842,
    12850,
    12964,
    13200,
    13215,
    13218,
    13253,
    13263,
    13267,
    13270,
    13384,
    13428,
    13727,
    13839,
    13851,
    14617,
    14703,
    14801,
    14816,
    14964,
    15183,
    15471,
    15585,
    16471,
    16736,
    17208,
    17325,
    17330,
    17374,
    17623,
    17997,
    18018,
    18212,
    18218,
    18301,
    18318,
    18760,
    18811,
    18814,
    18820,
    18823,
    18844,
    18848,
    18872,
    19576,
    19620,
    19738,
    19887,
    40870,
    59244,
    59336,
    59367,
    59413,
    59417,
    59423,
    59431,
    59437,
    59443,
    59452,
    59460,
    59478,
    59493,
    63789,
    63866,
    63894,
    63976,
    63986,
    64016,
    64018,
    64021,
    64025,
    64034,
    64037,
    64042,
    65074,
    65093,
    65107,
    65112,
    65127,
    65132,
    65375,
    65510,
    65536
  ], Fd = [
    0,
    36,
    38,
    45,
    50,
    81,
    89,
    95,
    96,
    100,
    103,
    104,
    105,
    109,
    126,
    133,
    148,
    172,
    175,
    179,
    208,
    306,
    307,
    308,
    309,
    310,
    311,
    312,
    313,
    341,
    428,
    443,
    544,
    545,
    558,
    741,
    742,
    749,
    750,
    805,
    819,
    820,
    7922,
    7924,
    7925,
    7927,
    7934,
    7943,
    7944,
    7945,
    7950,
    8062,
    8148,
    8149,
    8152,
    8164,
    8174,
    8236,
    8240,
    8262,
    8264,
    8374,
    8380,
    8381,
    8384,
    8388,
    8390,
    8392,
    8393,
    8394,
    8396,
    8401,
    8406,
    8416,
    8419,
    8424,
    8437,
    8439,
    8445,
    8482,
    8485,
    8496,
    8521,
    8603,
    8936,
    8946,
    9046,
    9050,
    9063,
    9066,
    9076,
    9092,
    9100,
    9108,
    9111,
    9113,
    9131,
    9162,
    9164,
    9218,
    9219,
    11329,
    11331,
    11334,
    11336,
    11346,
    11361,
    11363,
    11366,
    11370,
    11372,
    11375,
    11389,
    11682,
    11686,
    11687,
    11692,
    11694,
    11714,
    11716,
    11723,
    11725,
    11730,
    11736,
    11982,
    11989,
    12102,
    12336,
    12348,
    12350,
    12384,
    12393,
    12395,
    12397,
    12510,
    12553,
    12851,
    12962,
    12973,
    13738,
    13823,
    13919,
    13933,
    14080,
    14298,
    14585,
    14698,
    15583,
    15847,
    16318,
    16434,
    16438,
    16481,
    16729,
    17102,
    17122,
    17315,
    17320,
    17402,
    17418,
    17859,
    17909,
    17911,
    17915,
    17916,
    17936,
    17939,
    17961,
    18664,
    18703,
    18814,
    18962,
    19043,
    33469,
    33470,
    33471,
    33484,
    33485,
    33490,
    33497,
    33501,
    33505,
    33513,
    33520,
    33536,
    33550,
    37845,
    37921,
    37948,
    38029,
    38038,
    38064,
    38065,
    38066,
    38069,
    38075,
    38076,
    38078,
    39108,
    39109,
    39113,
    39114,
    39115,
    39116,
    39265,
    39394,
    189e3
  ], Td = {
    uChars: Sd,
    gbChars: Fd
  }, Cd = [
    [
      "0",
      "\0",
      127
    ],
    [
      "8141",
      "갂갃갅갆갋",
      4,
      "갘갞갟갡갢갣갥",
      6,
      "갮갲갳갴"
    ],
    [
      "8161",
      "갵갶갷갺갻갽갾갿걁",
      9,
      "걌걎",
      5,
      "걕"
    ],
    [
      "8181",
      "걖걗걙걚걛걝",
      18,
      "걲걳걵걶걹걻",
      4,
      "겂겇겈겍겎겏겑겒겓겕",
      6,
      "겞겢",
      5,
      "겫겭겮겱",
      6,
      "겺겾겿곀곂곃곅곆곇곉곊곋곍",
      7,
      "곖곘",
      7,
      "곢곣곥곦곩곫곭곮곲곴곷",
      4,
      "곾곿괁괂괃괅괇",
      4,
      "괎괐괒괓"
    ],
    [
      "8241",
      "괔괕괖괗괙괚괛괝괞괟괡",
      7,
      "괪괫괮",
      5
    ],
    [
      "8261",
      "괶괷괹괺괻괽",
      6,
      "굆굈굊",
      5,
      "굑굒굓굕굖굗"
    ],
    [
      "8281",
      "굙",
      7,
      "굢굤",
      7,
      "굮굯굱굲굷굸굹굺굾궀궃",
      4,
      "궊궋궍궎궏궑",
      10,
      "궞",
      5,
      "궥",
      17,
      "궸",
      7,
      "귂귃귅귆귇귉",
      6,
      "귒귔",
      7,
      "귝귞귟귡귢귣귥",
      18
    ],
    [
      "8341",
      "귺귻귽귾긂",
      5,
      "긊긌긎",
      5,
      "긕",
      7
    ],
    [
      "8361",
      "긝",
      18,
      "긲긳긵긶긹긻긼"
    ],
    [
      "8381",
      "긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",
      4,
      "깞깢깣깤깦깧깪깫깭깮깯깱",
      6,
      "깺깾",
      5,
      "꺆",
      5,
      "꺍",
      46,
      "꺿껁껂껃껅",
      6,
      "껎껒",
      5,
      "껚껛껝",
      8
    ],
    [
      "8441",
      "껦껧껩껪껬껮",
      5,
      "껵껶껷껹껺껻껽",
      8
    ],
    [
      "8461",
      "꼆꼉꼊꼋꼌꼎꼏꼑",
      18
    ],
    [
      "8481",
      "꼤",
      7,
      "꼮꼯꼱꼳꼵",
      6,
      "꼾꽀꽄꽅꽆꽇꽊",
      5,
      "꽑",
      10,
      "꽞",
      5,
      "꽦",
      18,
      "꽺",
      5,
      "꾁꾂꾃꾅꾆꾇꾉",
      6,
      "꾒꾓꾔꾖",
      5,
      "꾝",
      26,
      "꾺꾻꾽꾾"
    ],
    [
      "8541",
      "꾿꿁",
      5,
      "꿊꿌꿏",
      4,
      "꿕",
      6,
      "꿝",
      4
    ],
    [
      "8561",
      "꿢",
      5,
      "꿪",
      5,
      "꿲꿳꿵꿶꿷꿹",
      6,
      "뀂뀃"
    ],
    [
      "8581",
      "뀅",
      6,
      "뀍뀎뀏뀑뀒뀓뀕",
      6,
      "뀞",
      9,
      "뀩",
      26,
      "끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",
      29,
      "끾끿낁낂낃낅",
      6,
      "낎낐낒",
      5,
      "낛낝낞낣낤"
    ],
    [
      "8641",
      "낥낦낧낪낰낲낶낷낹낺낻낽",
      6,
      "냆냊",
      5,
      "냒"
    ],
    [
      "8661",
      "냓냕냖냗냙",
      6,
      "냡냢냣냤냦",
      10
    ],
    [
      "8681",
      "냱",
      22,
      "넊넍넎넏넑넔넕넖넗넚넞",
      4,
      "넦넧넩넪넫넭",
      6,
      "넶넺",
      5,
      "녂녃녅녆녇녉",
      6,
      "녒녓녖녗녙녚녛녝녞녟녡",
      22,
      "녺녻녽녾녿놁놃",
      4,
      "놊놌놎놏놐놑놕놖놗놙놚놛놝"
    ],
    [
      "8741",
      "놞",
      9,
      "놩",
      15
    ],
    [
      "8761",
      "놹",
      18,
      "뇍뇎뇏뇑뇒뇓뇕"
    ],
    [
      "8781",
      "뇖",
      5,
      "뇞뇠",
      7,
      "뇪뇫뇭뇮뇯뇱",
      7,
      "뇺뇼뇾",
      5,
      "눆눇눉눊눍",
      6,
      "눖눘눚",
      5,
      "눡",
      18,
      "눵",
      6,
      "눽",
      26,
      "뉙뉚뉛뉝뉞뉟뉡",
      6,
      "뉪",
      4
    ],
    [
      "8841",
      "뉯",
      4,
      "뉶",
      5,
      "뉽",
      6,
      "늆늇늈늊",
      4
    ],
    [
      "8861",
      "늏늒늓늕늖늗늛",
      4,
      "늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"
    ],
    [
      "8881",
      "늸",
      15,
      "닊닋닍닎닏닑닓",
      4,
      "닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",
      6,
      "댒댖",
      5,
      "댝",
      54,
      "덗덙덚덝덠덡덢덣"
    ],
    [
      "8941",
      "덦덨덪덬덭덯덲덳덵덶덷덹",
      6,
      "뎂뎆",
      5,
      "뎍"
    ],
    [
      "8961",
      "뎎뎏뎑뎒뎓뎕",
      10,
      "뎢",
      5,
      "뎩뎪뎫뎭"
    ],
    [
      "8981",
      "뎮",
      21,
      "돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",
      18,
      "돽",
      18,
      "됑",
      6,
      "됙됚됛됝됞됟됡",
      6,
      "됪됬",
      7,
      "됵",
      15
    ],
    [
      "8a41",
      "둅",
      10,
      "둒둓둕둖둗둙",
      6,
      "둢둤둦"
    ],
    [
      "8a61",
      "둧",
      4,
      "둭",
      18,
      "뒁뒂"
    ],
    [
      "8a81",
      "뒃",
      4,
      "뒉",
      19,
      "뒞",
      5,
      "뒥뒦뒧뒩뒪뒫뒭",
      7,
      "뒶뒸뒺",
      5,
      "듁듂듃듅듆듇듉",
      6,
      "듑듒듓듔듖",
      5,
      "듞듟듡듢듥듧",
      4,
      "듮듰듲",
      5,
      "듹",
      26,
      "딖딗딙딚딝"
    ],
    [
      "8b41",
      "딞",
      5,
      "딦딫",
      4,
      "딲딳딵딶딷딹",
      6,
      "땂땆"
    ],
    [
      "8b61",
      "땇땈땉땊땎땏땑땒땓땕",
      6,
      "땞땢",
      8
    ],
    [
      "8b81",
      "땫",
      52,
      "떢떣떥떦떧떩떬떭떮떯떲떶",
      4,
      "떾떿뗁뗂뗃뗅",
      6,
      "뗎뗒",
      5,
      "뗙",
      18,
      "뗭",
      18
    ],
    [
      "8c41",
      "똀",
      15,
      "똒똓똕똖똗똙",
      4
    ],
    [
      "8c61",
      "똞",
      6,
      "똦",
      5,
      "똭",
      6,
      "똵",
      5
    ],
    [
      "8c81",
      "똻",
      12,
      "뙉",
      26,
      "뙥뙦뙧뙩",
      50,
      "뚞뚟뚡뚢뚣뚥",
      5,
      "뚭뚮뚯뚰뚲",
      16
    ],
    [
      "8d41",
      "뛃",
      16,
      "뛕",
      8
    ],
    [
      "8d61",
      "뛞",
      17,
      "뛱뛲뛳뛵뛶뛷뛹뛺"
    ],
    [
      "8d81",
      "뛻",
      4,
      "뜂뜃뜄뜆",
      33,
      "뜪뜫뜭뜮뜱",
      6,
      "뜺뜼",
      7,
      "띅띆띇띉띊띋띍",
      6,
      "띖",
      9,
      "띡띢띣띥띦띧띩",
      6,
      "띲띴띶",
      5,
      "띾띿랁랂랃랅",
      6,
      "랎랓랔랕랚랛랝랞"
    ],
    [
      "8e41",
      "랟랡",
      6,
      "랪랮",
      5,
      "랶랷랹",
      8
    ],
    [
      "8e61",
      "럂",
      4,
      "럈럊",
      19
    ],
    [
      "8e81",
      "럞",
      13,
      "럮럯럱럲럳럵",
      6,
      "럾렂",
      4,
      "렊렋렍렎렏렑",
      6,
      "렚렜렞",
      5,
      "렦렧렩렪렫렭",
      6,
      "렶렺",
      5,
      "롁롂롃롅",
      11,
      "롒롔",
      7,
      "롞롟롡롢롣롥",
      6,
      "롮롰롲",
      5,
      "롹롺롻롽",
      7
    ],
    [
      "8f41",
      "뢅",
      7,
      "뢎",
      17
    ],
    [
      "8f61",
      "뢠",
      7,
      "뢩",
      6,
      "뢱뢲뢳뢵뢶뢷뢹",
      4
    ],
    [
      "8f81",
      "뢾뢿룂룄룆",
      5,
      "룍룎룏룑룒룓룕",
      7,
      "룞룠룢",
      5,
      "룪룫룭룮룯룱",
      6,
      "룺룼룾",
      5,
      "뤅",
      18,
      "뤙",
      6,
      "뤡",
      26,
      "뤾뤿륁륂륃륅",
      6,
      "륍륎륐륒",
      5
    ],
    [
      "9041",
      "륚륛륝륞륟륡",
      6,
      "륪륬륮",
      5,
      "륶륷륹륺륻륽"
    ],
    [
      "9061",
      "륾",
      5,
      "릆릈릋릌릏",
      15
    ],
    [
      "9081",
      "릟",
      12,
      "릮릯릱릲릳릵",
      6,
      "릾맀맂",
      5,
      "맊맋맍맓",
      4,
      "맚맜맟맠맢맦맧맩맪맫맭",
      6,
      "맶맻",
      4,
      "먂",
      5,
      "먉",
      11,
      "먖",
      33,
      "먺먻먽먾먿멁멃멄멅멆"
    ],
    [
      "9141",
      "멇멊멌멏멐멑멒멖멗멙멚멛멝",
      6,
      "멦멪",
      5
    ],
    [
      "9161",
      "멲멳멵멶멷멹",
      9,
      "몆몈몉몊몋몍",
      5
    ],
    [
      "9181",
      "몓",
      20,
      "몪몭몮몯몱몳",
      4,
      "몺몼몾",
      5,
      "뫅뫆뫇뫉",
      14,
      "뫚",
      33,
      "뫽뫾뫿묁묂묃묅",
      7,
      "묎묐묒",
      5,
      "묙묚묛묝묞묟묡",
      6
    ],
    [
      "9241",
      "묨묪묬",
      7,
      "묷묹묺묿",
      4,
      "뭆뭈뭊뭋뭌뭎뭑뭒"
    ],
    [
      "9261",
      "뭓뭕뭖뭗뭙",
      7,
      "뭢뭤",
      7,
      "뭭",
      4
    ],
    [
      "9281",
      "뭲",
      21,
      "뮉뮊뮋뮍뮎뮏뮑",
      18,
      "뮥뮦뮧뮩뮪뮫뮭",
      6,
      "뮵뮶뮸",
      7,
      "믁믂믃믅믆믇믉",
      6,
      "믑믒믔",
      35,
      "믺믻믽믾밁"
    ],
    [
      "9341",
      "밃",
      4,
      "밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"
    ],
    [
      "9361",
      "밶밷밹",
      6,
      "뱂뱆뱇뱈뱊뱋뱎뱏뱑",
      8
    ],
    [
      "9381",
      "뱚뱛뱜뱞",
      37,
      "벆벇벉벊벍벏",
      4,
      "벖벘벛",
      4,
      "벢벣벥벦벩",
      6,
      "벲벶",
      5,
      "벾벿볁볂볃볅",
      7,
      "볎볒볓볔볖볗볙볚볛볝",
      22,
      "볷볹볺볻볽"
    ],
    [
      "9441",
      "볾",
      5,
      "봆봈봊",
      5,
      "봑봒봓봕",
      8
    ],
    [
      "9461",
      "봞",
      5,
      "봥",
      6,
      "봭",
      12
    ],
    [
      "9481",
      "봺",
      5,
      "뵁",
      6,
      "뵊뵋뵍뵎뵏뵑",
      6,
      "뵚",
      9,
      "뵥뵦뵧뵩",
      22,
      "붂붃붅붆붋",
      4,
      "붒붔붖붗붘붛붝",
      6,
      "붥",
      10,
      "붱",
      6,
      "붹",
      24
    ],
    [
      "9541",
      "뷒뷓뷖뷗뷙뷚뷛뷝",
      11,
      "뷪",
      5,
      "뷱"
    ],
    [
      "9561",
      "뷲뷳뷵뷶뷷뷹",
      6,
      "븁븂븄븆",
      5,
      "븎븏븑븒븓"
    ],
    [
      "9581",
      "븕",
      6,
      "븞븠",
      35,
      "빆빇빉빊빋빍빏",
      4,
      "빖빘빜빝빞빟빢빣빥빦빧빩빫",
      4,
      "빲빶",
      4,
      "빾빿뺁뺂뺃뺅",
      6,
      "뺎뺒",
      5,
      "뺚",
      13,
      "뺩",
      14
    ],
    [
      "9641",
      "뺸",
      23,
      "뻒뻓"
    ],
    [
      "9661",
      "뻕뻖뻙",
      6,
      "뻡뻢뻦",
      5,
      "뻭",
      8
    ],
    [
      "9681",
      "뻶",
      10,
      "뼂",
      5,
      "뼊",
      13,
      "뼚뼞",
      33,
      "뽂뽃뽅뽆뽇뽉",
      6,
      "뽒뽓뽔뽖",
      44
    ],
    [
      "9741",
      "뾃",
      16,
      "뾕",
      8
    ],
    [
      "9761",
      "뾞",
      17,
      "뾱",
      7
    ],
    [
      "9781",
      "뾹",
      11,
      "뿆",
      5,
      "뿎뿏뿑뿒뿓뿕",
      6,
      "뿝뿞뿠뿢",
      89,
      "쀽쀾쀿"
    ],
    [
      "9841",
      "쁀",
      16,
      "쁒",
      5,
      "쁙쁚쁛"
    ],
    [
      "9861",
      "쁝쁞쁟쁡",
      6,
      "쁪",
      15
    ],
    [
      "9881",
      "쁺",
      21,
      "삒삓삕삖삗삙",
      6,
      "삢삤삦",
      5,
      "삮삱삲삷",
      4,
      "삾샂샃샄샆샇샊샋샍샎샏샑",
      6,
      "샚샞",
      5,
      "샦샧샩샪샫샭",
      6,
      "샶샸샺",
      5,
      "섁섂섃섅섆섇섉",
      6,
      "섑섒섓섔섖",
      5,
      "섡섢섥섨섩섪섫섮"
    ],
    [
      "9941",
      "섲섳섴섵섷섺섻섽섾섿셁",
      6,
      "셊셎",
      5,
      "셖셗"
    ],
    [
      "9961",
      "셙셚셛셝",
      6,
      "셦셪",
      5,
      "셱셲셳셵셶셷셹셺셻"
    ],
    [
      "9981",
      "셼",
      8,
      "솆",
      5,
      "솏솑솒솓솕솗",
      4,
      "솞솠솢솣솤솦솧솪솫솭솮솯솱",
      11,
      "솾",
      5,
      "쇅쇆쇇쇉쇊쇋쇍",
      6,
      "쇕쇖쇙",
      6,
      "쇡쇢쇣쇥쇦쇧쇩",
      6,
      "쇲쇴",
      7,
      "쇾쇿숁숂숃숅",
      6,
      "숎숐숒",
      5,
      "숚숛숝숞숡숢숣"
    ],
    [
      "9a41",
      "숤숥숦숧숪숬숮숰숳숵",
      16
    ],
    [
      "9a61",
      "쉆쉇쉉",
      6,
      "쉒쉓쉕쉖쉗쉙",
      6,
      "쉡쉢쉣쉤쉦"
    ],
    [
      "9a81",
      "쉧",
      4,
      "쉮쉯쉱쉲쉳쉵",
      6,
      "쉾슀슂",
      5,
      "슊",
      5,
      "슑",
      6,
      "슙슚슜슞",
      5,
      "슦슧슩슪슫슮",
      5,
      "슶슸슺",
      33,
      "싞싟싡싢싥",
      5,
      "싮싰싲싳싴싵싷싺싽싾싿쌁",
      6,
      "쌊쌋쌎쌏"
    ],
    [
      "9b41",
      "쌐쌑쌒쌖쌗쌙쌚쌛쌝",
      6,
      "쌦쌧쌪",
      8
    ],
    [
      "9b61",
      "쌳",
      17,
      "썆",
      7
    ],
    [
      "9b81",
      "썎",
      25,
      "썪썫썭썮썯썱썳",
      4,
      "썺썻썾",
      5,
      "쎅쎆쎇쎉쎊쎋쎍",
      50,
      "쏁",
      22,
      "쏚"
    ],
    [
      "9c41",
      "쏛쏝쏞쏡쏣",
      4,
      "쏪쏫쏬쏮",
      5,
      "쏶쏷쏹",
      5
    ],
    [
      "9c61",
      "쏿",
      8,
      "쐉",
      6,
      "쐑",
      9
    ],
    [
      "9c81",
      "쐛",
      8,
      "쐥",
      6,
      "쐭쐮쐯쐱쐲쐳쐵",
      6,
      "쐾",
      9,
      "쑉",
      26,
      "쑦쑧쑩쑪쑫쑭",
      6,
      "쑶쑷쑸쑺",
      5,
      "쒁",
      18,
      "쒕",
      6,
      "쒝",
      12
    ],
    [
      "9d41",
      "쒪",
      13,
      "쒹쒺쒻쒽",
      8
    ],
    [
      "9d61",
      "쓆",
      25
    ],
    [
      "9d81",
      "쓠",
      8,
      "쓪",
      5,
      "쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",
      9,
      "씍씎씏씑씒씓씕",
      6,
      "씝",
      10,
      "씪씫씭씮씯씱",
      6,
      "씺씼씾",
      5,
      "앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",
      6,
      "앲앶",
      5,
      "앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"
    ],
    [
      "9e41",
      "얖얙얚얛얝얞얟얡",
      7,
      "얪",
      9,
      "얶"
    ],
    [
      "9e61",
      "얷얺얿",
      4,
      "엋엍엏엒엓엕엖엗엙",
      6,
      "엢엤엦엧"
    ],
    [
      "9e81",
      "엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",
      6,
      "옚옝",
      6,
      "옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",
      6,
      "왒왖",
      5,
      "왞왟왡",
      10,
      "왭왮왰왲",
      5,
      "왺왻왽왾왿욁",
      6,
      "욊욌욎",
      5,
      "욖욗욙욚욛욝",
      6,
      "욦"
    ],
    [
      "9f41",
      "욨욪",
      5,
      "욲욳욵욶욷욻",
      4,
      "웂웄웆",
      5,
      "웎"
    ],
    [
      "9f61",
      "웏웑웒웓웕",
      6,
      "웞웟웢",
      5,
      "웪웫웭웮웯웱웲"
    ],
    [
      "9f81",
      "웳",
      4,
      "웺웻웼웾",
      5,
      "윆윇윉윊윋윍",
      6,
      "윖윘윚",
      5,
      "윢윣윥윦윧윩",
      6,
      "윲윴윶윸윹윺윻윾윿읁읂읃읅",
      4,
      "읋읎읐읙읚읛읝읞읟읡",
      6,
      "읩읪읬",
      7,
      "읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",
      4,
      "잢잧",
      4,
      "잮잯잱잲잳잵잶잷"
    ],
    [
      "a041",
      "잸잹잺잻잾쟂",
      5,
      "쟊쟋쟍쟏쟑",
      6,
      "쟙쟚쟛쟜"
    ],
    [
      "a061",
      "쟞",
      5,
      "쟥쟦쟧쟩쟪쟫쟭",
      13
    ],
    [
      "a081",
      "쟻",
      4,
      "젂젃젅젆젇젉젋",
      4,
      "젒젔젗",
      4,
      "젞젟젡젢젣젥",
      6,
      "젮젰젲",
      5,
      "젹젺젻젽젾젿졁",
      6,
      "졊졋졎",
      5,
      "졕",
      26,
      "졲졳졵졶졷졹졻",
      4,
      "좂좄좈좉좊좎",
      5,
      "좕",
      7,
      "좞좠좢좣좤"
    ],
    [
      "a141",
      "좥좦좧좩",
      18,
      "좾좿죀죁"
    ],
    [
      "a161",
      "죂죃죅죆죇죉죊죋죍",
      6,
      "죖죘죚",
      5,
      "죢죣죥"
    ],
    [
      "a181",
      "죦",
      14,
      "죶",
      5,
      "죾죿줁줂줃줇",
      4,
      "줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",
      9,
      "±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"
    ],
    [
      "a241",
      "줐줒",
      5,
      "줙",
      18
    ],
    [
      "a261",
      "줭",
      6,
      "줵",
      18
    ],
    [
      "a281",
      "쥈",
      7,
      "쥒쥓쥕쥖쥗쥙",
      6,
      "쥢쥤",
      7,
      "쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"
    ],
    [
      "a341",
      "쥱쥲쥳쥵",
      6,
      "쥽",
      10,
      "즊즋즍즎즏"
    ],
    [
      "a361",
      "즑",
      6,
      "즚즜즞",
      16
    ],
    [
      "a381",
      "즯",
      16,
      "짂짃짅짆짉짋",
      4,
      "짒짔짗짘짛！",
      58,
      "￦］",
      32,
      "￣"
    ],
    [
      "a441",
      "짞짟짡짣짥짦짨짩짪짫짮짲",
      5,
      "짺짻짽짾짿쨁쨂쨃쨄"
    ],
    [
      "a461",
      "쨅쨆쨇쨊쨎",
      5,
      "쨕쨖쨗쨙",
      12
    ],
    [
      "a481",
      "쨦쨧쨨쨪",
      28,
      "ㄱ",
      93
    ],
    [
      "a541",
      "쩇",
      4,
      "쩎쩏쩑쩒쩓쩕",
      6,
      "쩞쩢",
      5,
      "쩩쩪"
    ],
    [
      "a561",
      "쩫",
      17,
      "쩾",
      5,
      "쪅쪆"
    ],
    [
      "a581",
      "쪇",
      16,
      "쪙",
      14,
      "ⅰ",
      9
    ],
    [
      "a5b0",
      "Ⅰ",
      9
    ],
    [
      "a5c1",
      "Α",
      16,
      "Σ",
      6
    ],
    [
      "a5e1",
      "α",
      16,
      "σ",
      6
    ],
    [
      "a641",
      "쪨",
      19,
      "쪾쪿쫁쫂쫃쫅"
    ],
    [
      "a661",
      "쫆",
      5,
      "쫎쫐쫒쫔쫕쫖쫗쫚",
      5,
      "쫡",
      6
    ],
    [
      "a681",
      "쫨쫩쫪쫫쫭",
      6,
      "쫵",
      18,
      "쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",
      7
    ],
    [
      "a741",
      "쬋",
      4,
      "쬑쬒쬓쬕쬖쬗쬙",
      6,
      "쬢",
      7
    ],
    [
      "a761",
      "쬪",
      22,
      "쭂쭃쭄"
    ],
    [
      "a781",
      "쭅쭆쭇쭊쭋쭍쭎쭏쭑",
      6,
      "쭚쭛쭜쭞",
      5,
      "쭥",
      7,
      "㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",
      9,
      "㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",
      9,
      "㎀",
      4,
      "㎺",
      5,
      "㎐",
      4,
      "Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"
    ],
    [
      "a841",
      "쭭",
      10,
      "쭺",
      14
    ],
    [
      "a861",
      "쮉",
      18,
      "쮝",
      6
    ],
    [
      "a881",
      "쮤",
      19,
      "쮹",
      11,
      "ÆÐªĦ"
    ],
    [
      "a8a6",
      "Ĳ"
    ],
    [
      "a8a8",
      "ĿŁØŒºÞŦŊ"
    ],
    [
      "a8b1",
      "㉠",
      27,
      "ⓐ",
      25,
      "①",
      14,
      "½⅓⅔¼¾⅛⅜⅝⅞"
    ],
    [
      "a941",
      "쯅",
      14,
      "쯕",
      10
    ],
    [
      "a961",
      "쯠쯡쯢쯣쯥쯦쯨쯪",
      18
    ],
    [
      "a981",
      "쯽",
      14,
      "찎찏찑찒찓찕",
      6,
      "찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",
      27,
      "⒜",
      25,
      "⑴",
      14,
      "¹²³⁴ⁿ₁₂₃₄"
    ],
    [
      "aa41",
      "찥찦찪찫찭찯찱",
      6,
      "찺찿",
      4,
      "챆챇챉챊챋챍챎"
    ],
    [
      "aa61",
      "챏",
      4,
      "챖챚",
      5,
      "챡챢챣챥챧챩",
      6,
      "챱챲"
    ],
    [
      "aa81",
      "챳챴챶",
      29,
      "ぁ",
      82
    ],
    [
      "ab41",
      "첔첕첖첗첚첛첝첞첟첡",
      6,
      "첪첮",
      5,
      "첶첷첹"
    ],
    [
      "ab61",
      "첺첻첽",
      6,
      "쳆쳈쳊",
      5,
      "쳑쳒쳓쳕",
      5
    ],
    [
      "ab81",
      "쳛",
      8,
      "쳥",
      6,
      "쳭쳮쳯쳱",
      12,
      "ァ",
      85
    ],
    [
      "ac41",
      "쳾쳿촀촂",
      5,
      "촊촋촍촎촏촑",
      6,
      "촚촜촞촟촠"
    ],
    [
      "ac61",
      "촡촢촣촥촦촧촩촪촫촭",
      11,
      "촺",
      4
    ],
    [
      "ac81",
      "촿",
      28,
      "쵝쵞쵟А",
      5,
      "ЁЖ",
      25
    ],
    [
      "acd1",
      "а",
      5,
      "ёж",
      25
    ],
    [
      "ad41",
      "쵡쵢쵣쵥",
      6,
      "쵮쵰쵲",
      5,
      "쵹",
      7
    ],
    [
      "ad61",
      "춁",
      6,
      "춉",
      10,
      "춖춗춙춚춛춝춞춟"
    ],
    [
      "ad81",
      "춠춡춢춣춦춨춪",
      5,
      "춱",
      18,
      "췅"
    ],
    [
      "ae41",
      "췆",
      5,
      "췍췎췏췑",
      16
    ],
    [
      "ae61",
      "췢",
      5,
      "췩췪췫췭췮췯췱",
      6,
      "췺췼췾",
      4
    ],
    [
      "ae81",
      "츃츅츆츇츉츊츋츍",
      6,
      "츕츖츗츘츚",
      5,
      "츢츣츥츦츧츩츪츫"
    ],
    [
      "af41",
      "츬츭츮츯츲츴츶",
      19
    ],
    [
      "af61",
      "칊",
      13,
      "칚칛칝칞칢",
      5,
      "칪칬"
    ],
    [
      "af81",
      "칮",
      5,
      "칶칷칹칺칻칽",
      6,
      "캆캈캊",
      5,
      "캒캓캕캖캗캙"
    ],
    [
      "b041",
      "캚",
      5,
      "캢캦",
      5,
      "캮",
      12
    ],
    [
      "b061",
      "캻",
      5,
      "컂",
      19
    ],
    [
      "b081",
      "컖",
      13,
      "컦컧컩컪컭",
      6,
      "컶컺",
      5,
      "가각간갇갈갉갊감",
      7,
      "같",
      4,
      "갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"
    ],
    [
      "b141",
      "켂켃켅켆켇켉",
      6,
      "켒켔켖",
      5,
      "켝켞켟켡켢켣"
    ],
    [
      "b161",
      "켥",
      6,
      "켮켲",
      5,
      "켹",
      11
    ],
    [
      "b181",
      "콅",
      14,
      "콖콗콙콚콛콝",
      6,
      "콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"
    ],
    [
      "b241",
      "콭콮콯콲콳콵콶콷콹",
      6,
      "쾁쾂쾃쾄쾆",
      5,
      "쾍"
    ],
    [
      "b261",
      "쾎",
      18,
      "쾢",
      5,
      "쾩"
    ],
    [
      "b281",
      "쾪",
      5,
      "쾱",
      18,
      "쿅",
      6,
      "깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"
    ],
    [
      "b341",
      "쿌",
      19,
      "쿢쿣쿥쿦쿧쿩"
    ],
    [
      "b361",
      "쿪",
      5,
      "쿲쿴쿶",
      5,
      "쿽쿾쿿퀁퀂퀃퀅",
      5
    ],
    [
      "b381",
      "퀋",
      5,
      "퀒",
      5,
      "퀙",
      19,
      "끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",
      4,
      "낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"
    ],
    [
      "b441",
      "퀮",
      5,
      "퀶퀷퀹퀺퀻퀽",
      6,
      "큆큈큊",
      5
    ],
    [
      "b461",
      "큑큒큓큕큖큗큙",
      6,
      "큡",
      10,
      "큮큯"
    ],
    [
      "b481",
      "큱큲큳큵",
      6,
      "큾큿킀킂",
      18,
      "뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",
      4,
      "닳담답닷",
      4,
      "닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"
    ],
    [
      "b541",
      "킕",
      14,
      "킦킧킩킪킫킭",
      5
    ],
    [
      "b561",
      "킳킶킸킺",
      5,
      "탂탃탅탆탇탊",
      5,
      "탒탖",
      4
    ],
    [
      "b581",
      "탛탞탟탡탢탣탥",
      6,
      "탮탲",
      5,
      "탹",
      11,
      "덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"
    ],
    [
      "b641",
      "턅",
      7,
      "턎",
      17
    ],
    [
      "b661",
      "턠",
      15,
      "턲턳턵턶턷턹턻턼턽턾"
    ],
    [
      "b681",
      "턿텂텆",
      5,
      "텎텏텑텒텓텕",
      6,
      "텞텠텢",
      5,
      "텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"
    ],
    [
      "b741",
      "텮",
      13,
      "텽",
      6,
      "톅톆톇톉톊"
    ],
    [
      "b761",
      "톋",
      20,
      "톢톣톥톦톧"
    ],
    [
      "b781",
      "톩",
      6,
      "톲톴톶톷톸톹톻톽톾톿퇁",
      14,
      "래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"
    ],
    [
      "b841",
      "퇐",
      7,
      "퇙",
      17
    ],
    [
      "b861",
      "퇫",
      8,
      "퇵퇶퇷퇹",
      13
    ],
    [
      "b881",
      "툈툊",
      5,
      "툑",
      24,
      "륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",
      4,
      "맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"
    ],
    [
      "b941",
      "툪툫툮툯툱툲툳툵",
      6,
      "툾퉀퉂",
      5,
      "퉉퉊퉋퉌"
    ],
    [
      "b961",
      "퉍",
      14,
      "퉝",
      6,
      "퉥퉦퉧퉨"
    ],
    [
      "b981",
      "퉩",
      22,
      "튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",
      4,
      "받",
      4,
      "밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"
    ],
    [
      "ba41",
      "튍튎튏튒튓튔튖",
      5,
      "튝튞튟튡튢튣튥",
      6,
      "튭"
    ],
    [
      "ba61",
      "튮튯튰튲",
      5,
      "튺튻튽튾틁틃",
      4,
      "틊틌",
      5
    ],
    [
      "ba81",
      "틒틓틕틖틗틙틚틛틝",
      6,
      "틦",
      9,
      "틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"
    ],
    [
      "bb41",
      "틻",
      4,
      "팂팄팆",
      5,
      "팏팑팒팓팕팗",
      4,
      "팞팢팣"
    ],
    [
      "bb61",
      "팤팦팧팪팫팭팮팯팱",
      6,
      "팺팾",
      5,
      "퍆퍇퍈퍉"
    ],
    [
      "bb81",
      "퍊",
      31,
      "빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"
    ],
    [
      "bc41",
      "퍪",
      17,
      "퍾퍿펁펂펃펅펆펇"
    ],
    [
      "bc61",
      "펈펉펊펋펎펒",
      5,
      "펚펛펝펞펟펡",
      6,
      "펪펬펮"
    ],
    [
      "bc81",
      "펯",
      4,
      "펵펶펷펹펺펻펽",
      6,
      "폆폇폊",
      5,
      "폑",
      5,
      "샥샨샬샴샵샷샹섀섄섈섐섕서",
      4,
      "섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"
    ],
    [
      "bd41",
      "폗폙",
      7,
      "폢폤",
      7,
      "폮폯폱폲폳폵폶폷"
    ],
    [
      "bd61",
      "폸폹폺폻폾퐀퐂",
      5,
      "퐉",
      13
    ],
    [
      "bd81",
      "퐗",
      5,
      "퐞",
      25,
      "숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"
    ],
    [
      "be41",
      "퐸",
      7,
      "푁푂푃푅",
      14
    ],
    [
      "be61",
      "푔",
      7,
      "푝푞푟푡푢푣푥",
      7,
      "푮푰푱푲"
    ],
    [
      "be81",
      "푳",
      4,
      "푺푻푽푾풁풃",
      4,
      "풊풌풎",
      5,
      "풕",
      8,
      "쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",
      6,
      "엌엎"
    ],
    [
      "bf41",
      "풞",
      10,
      "풪",
      14
    ],
    [
      "bf61",
      "풹",
      18,
      "퓍퓎퓏퓑퓒퓓퓕"
    ],
    [
      "bf81",
      "퓖",
      5,
      "퓝퓞퓠",
      7,
      "퓩퓪퓫퓭퓮퓯퓱",
      6,
      "퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",
      5,
      "옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"
    ],
    [
      "c041",
      "퓾",
      5,
      "픅픆픇픉픊픋픍",
      6,
      "픖픘",
      5
    ],
    [
      "c061",
      "픞",
      25
    ],
    [
      "c081",
      "픸픹픺픻픾픿핁핂핃핅",
      6,
      "핎핐핒",
      5,
      "핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",
      7,
      "읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"
    ],
    [
      "c141",
      "핤핦핧핪핬핮",
      5,
      "핶핷핹핺핻핽",
      6,
      "햆햊햋"
    ],
    [
      "c161",
      "햌햍햎햏햑",
      19,
      "햦햧"
    ],
    [
      "c181",
      "햨",
      31,
      "점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"
    ],
    [
      "c241",
      "헊헋헍헎헏헑헓",
      4,
      "헚헜헞",
      5,
      "헦헧헩헪헫헭헮"
    ],
    [
      "c261",
      "헯",
      4,
      "헶헸헺",
      5,
      "혂혃혅혆혇혉",
      6,
      "혒"
    ],
    [
      "c281",
      "혖",
      5,
      "혝혞혟혡혢혣혥",
      7,
      "혮",
      9,
      "혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"
    ],
    [
      "c341",
      "혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",
      4
    ],
    [
      "c361",
      "홢",
      4,
      "홨홪",
      5,
      "홲홳홵",
      11
    ],
    [
      "c381",
      "횁횂횄횆",
      5,
      "횎횏횑횒횓횕",
      7,
      "횞횠횢",
      5,
      "횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"
    ],
    [
      "c441",
      "횫횭횮횯횱",
      7,
      "횺횼",
      7,
      "훆훇훉훊훋"
    ],
    [
      "c461",
      "훍훎훏훐훒훓훕훖훘훚",
      5,
      "훡훢훣훥훦훧훩",
      4
    ],
    [
      "c481",
      "훮훯훱훲훳훴훶",
      5,
      "훾훿휁휂휃휅",
      11,
      "휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"
    ],
    [
      "c541",
      "휕휖휗휚휛휝휞휟휡",
      6,
      "휪휬휮",
      5,
      "휶휷휹"
    ],
    [
      "c561",
      "휺휻휽",
      6,
      "흅흆흈흊",
      5,
      "흒흓흕흚",
      4
    ],
    [
      "c581",
      "흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",
      6,
      "흾흿힀힂",
      5,
      "힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"
    ],
    [
      "c641",
      "힍힎힏힑",
      6,
      "힚힜힞",
      5
    ],
    [
      "c6a1",
      "퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"
    ],
    [
      "c7a1",
      "퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"
    ],
    [
      "c8a1",
      "혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"
    ],
    [
      "caa1",
      "伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"
    ],
    [
      "cba1",
      "匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"
    ],
    [
      "cca1",
      "瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"
    ],
    [
      "cda1",
      "棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"
    ],
    [
      "cea1",
      "科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"
    ],
    [
      "cfa1",
      "區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"
    ],
    [
      "d0a1",
      "鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"
    ],
    [
      "d1a1",
      "朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",
      5,
      "那樂",
      4,
      "諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"
    ],
    [
      "d2a1",
      "納臘蠟衲囊娘廊",
      4,
      "乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",
      5,
      "駑魯",
      10,
      "濃籠聾膿農惱牢磊腦賂雷尿壘",
      7,
      "嫩訥杻紐勒",
      5,
      "能菱陵尼泥匿溺多茶"
    ],
    [
      "d3a1",
      "丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"
    ],
    [
      "d4a1",
      "棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"
    ],
    [
      "d5a1",
      "蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"
    ],
    [
      "d6a1",
      "煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"
    ],
    [
      "d7a1",
      "遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"
    ],
    [
      "d8a1",
      "立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"
    ],
    [
      "d9a1",
      "蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"
    ],
    [
      "daa1",
      "汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"
    ],
    [
      "dba1",
      "發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"
    ],
    [
      "dca1",
      "碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"
    ],
    [
      "dda1",
      "孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"
    ],
    [
      "dea1",
      "脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"
    ],
    [
      "dfa1",
      "傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"
    ],
    [
      "e0a1",
      "胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"
    ],
    [
      "e1a1",
      "聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"
    ],
    [
      "e2a1",
      "戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"
    ],
    [
      "e3a1",
      "嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"
    ],
    [
      "e4a1",
      "沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"
    ],
    [
      "e5a1",
      "櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"
    ],
    [
      "e6a1",
      "旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"
    ],
    [
      "e7a1",
      "簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"
    ],
    [
      "e8a1",
      "烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"
    ],
    [
      "e9a1",
      "窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"
    ],
    [
      "eaa1",
      "運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"
    ],
    [
      "eba1",
      "濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"
    ],
    [
      "eca1",
      "議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"
    ],
    [
      "eda1",
      "立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"
    ],
    [
      "eea1",
      "障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"
    ],
    [
      "efa1",
      "煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"
    ],
    [
      "f0a1",
      "靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"
    ],
    [
      "f1a1",
      "踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"
    ],
    [
      "f2a1",
      "咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"
    ],
    [
      "f3a1",
      "鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"
    ],
    [
      "f4a1",
      "責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"
    ],
    [
      "f5a1",
      "椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"
    ],
    [
      "f6a1",
      "贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"
    ],
    [
      "f7a1",
      "鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"
    ],
    [
      "f8a1",
      "阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"
    ],
    [
      "f9a1",
      "品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"
    ],
    [
      "faa1",
      "行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"
    ],
    [
      "fba1",
      "形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"
    ],
    [
      "fca1",
      "禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"
    ],
    [
      "fda1",
      "爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"
    ]
  ], Co = [
    [
      "0",
      "\0",
      127
    ],
    [
      "a140",
      "　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"
    ],
    [
      "a1a1",
      "﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",
      4,
      "～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"
    ],
    [
      "a240",
      "＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",
      7,
      "▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"
    ],
    [
      "a2a1",
      "╮╰╯═╞╪╡◢◣◥◤╱╲╳０",
      9,
      "Ⅰ",
      9,
      "〡",
      8,
      "十卄卅Ａ",
      25,
      "ａ",
      21
    ],
    [
      "a340",
      "ｗｘｙｚΑ",
      16,
      "Σ",
      6,
      "α",
      16,
      "σ",
      6,
      "ㄅ",
      10
    ],
    [
      "a3a1",
      "ㄐ",
      25,
      "˙ˉˊˇˋ"
    ],
    [
      "a3e1",
      "€"
    ],
    [
      "a440",
      "一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"
    ],
    [
      "a4a1",
      "丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"
    ],
    [
      "a540",
      "世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"
    ],
    [
      "a5a1",
      "央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"
    ],
    [
      "a640",
      "共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"
    ],
    [
      "a6a1",
      "式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"
    ],
    [
      "a740",
      "作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"
    ],
    [
      "a7a1",
      "均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"
    ],
    [
      "a840",
      "杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"
    ],
    [
      "a8a1",
      "芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"
    ],
    [
      "a940",
      "咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"
    ],
    [
      "a9a1",
      "屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"
    ],
    [
      "aa40",
      "昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"
    ],
    [
      "aaa1",
      "炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"
    ],
    [
      "ab40",
      "陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"
    ],
    [
      "aba1",
      "哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"
    ],
    [
      "ac40",
      "拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"
    ],
    [
      "aca1",
      "活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"
    ],
    [
      "ad40",
      "耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"
    ],
    [
      "ada1",
      "迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"
    ],
    [
      "ae40",
      "哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"
    ],
    [
      "aea1",
      "恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"
    ],
    [
      "af40",
      "浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"
    ],
    [
      "afa1",
      "砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"
    ],
    [
      "b040",
      "虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"
    ],
    [
      "b0a1",
      "陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"
    ],
    [
      "b140",
      "娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"
    ],
    [
      "b1a1",
      "情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"
    ],
    [
      "b240",
      "毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"
    ],
    [
      "b2a1",
      "瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"
    ],
    [
      "b340",
      "莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"
    ],
    [
      "b3a1",
      "部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"
    ],
    [
      "b440",
      "婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"
    ],
    [
      "b4a1",
      "插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"
    ],
    [
      "b540",
      "溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"
    ],
    [
      "b5a1",
      "窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"
    ],
    [
      "b640",
      "詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"
    ],
    [
      "b6a1",
      "間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"
    ],
    [
      "b740",
      "媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"
    ],
    [
      "b7a1",
      "楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"
    ],
    [
      "b840",
      "睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"
    ],
    [
      "b8a1",
      "腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"
    ],
    [
      "b940",
      "辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"
    ],
    [
      "b9a1",
      "飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"
    ],
    [
      "ba40",
      "愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"
    ],
    [
      "baa1",
      "滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"
    ],
    [
      "bb40",
      "罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"
    ],
    [
      "bba1",
      "說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"
    ],
    [
      "bc40",
      "劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"
    ],
    [
      "bca1",
      "慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"
    ],
    [
      "bd40",
      "瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"
    ],
    [
      "bda1",
      "翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"
    ],
    [
      "be40",
      "輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"
    ],
    [
      "bea1",
      "鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"
    ],
    [
      "bf40",
      "濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"
    ],
    [
      "bfa1",
      "縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"
    ],
    [
      "c040",
      "錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"
    ],
    [
      "c0a1",
      "嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"
    ],
    [
      "c140",
      "瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"
    ],
    [
      "c1a1",
      "薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"
    ],
    [
      "c240",
      "駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"
    ],
    [
      "c2a1",
      "癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"
    ],
    [
      "c340",
      "鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"
    ],
    [
      "c3a1",
      "獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"
    ],
    [
      "c440",
      "願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"
    ],
    [
      "c4a1",
      "纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"
    ],
    [
      "c540",
      "護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"
    ],
    [
      "c5a1",
      "禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"
    ],
    [
      "c640",
      "讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"
    ],
    [
      "c940",
      "乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"
    ],
    [
      "c9a1",
      "氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"
    ],
    [
      "ca40",
      "汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"
    ],
    [
      "caa1",
      "吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"
    ],
    [
      "cb40",
      "杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"
    ],
    [
      "cba1",
      "芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"
    ],
    [
      "cc40",
      "坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"
    ],
    [
      "cca1",
      "怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"
    ],
    [
      "cd40",
      "泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"
    ],
    [
      "cda1",
      "矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"
    ],
    [
      "ce40",
      "哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"
    ],
    [
      "cea1",
      "峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"
    ],
    [
      "cf40",
      "柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"
    ],
    [
      "cfa1",
      "洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"
    ],
    [
      "d040",
      "穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"
    ],
    [
      "d0a1",
      "苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"
    ],
    [
      "d140",
      "唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"
    ],
    [
      "d1a1",
      "恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"
    ],
    [
      "d240",
      "毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"
    ],
    [
      "d2a1",
      "牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"
    ],
    [
      "d340",
      "笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"
    ],
    [
      "d3a1",
      "荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"
    ],
    [
      "d440",
      "酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"
    ],
    [
      "d4a1",
      "唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"
    ],
    [
      "d540",
      "崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"
    ],
    [
      "d5a1",
      "捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"
    ],
    [
      "d640",
      "淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"
    ],
    [
      "d6a1",
      "痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"
    ],
    [
      "d740",
      "耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"
    ],
    [
      "d7a1",
      "蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"
    ],
    [
      "d840",
      "釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"
    ],
    [
      "d8a1",
      "堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"
    ],
    [
      "d940",
      "惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"
    ],
    [
      "d9a1",
      "晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"
    ],
    [
      "da40",
      "湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"
    ],
    [
      "daa1",
      "琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"
    ],
    [
      "db40",
      "罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"
    ],
    [
      "dba1",
      "菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"
    ],
    [
      "dc40",
      "軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"
    ],
    [
      "dca1",
      "隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"
    ],
    [
      "dd40",
      "媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"
    ],
    [
      "dda1",
      "搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"
    ],
    [
      "de40",
      "毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"
    ],
    [
      "dea1",
      "煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"
    ],
    [
      "df40",
      "稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"
    ],
    [
      "dfa1",
      "腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"
    ],
    [
      "e040",
      "觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"
    ],
    [
      "e0a1",
      "遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"
    ],
    [
      "e140",
      "凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"
    ],
    [
      "e1a1",
      "寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"
    ],
    [
      "e240",
      "榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"
    ],
    [
      "e2a1",
      "漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"
    ],
    [
      "e340",
      "禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"
    ],
    [
      "e3a1",
      "耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"
    ],
    [
      "e440",
      "裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"
    ],
    [
      "e4a1",
      "銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"
    ],
    [
      "e540",
      "噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"
    ],
    [
      "e5a1",
      "憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"
    ],
    [
      "e640",
      "澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"
    ],
    [
      "e6a1",
      "獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"
    ],
    [
      "e740",
      "膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"
    ],
    [
      "e7a1",
      "蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"
    ],
    [
      "e840",
      "踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"
    ],
    [
      "e8a1",
      "銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"
    ],
    [
      "e940",
      "噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"
    ],
    [
      "e9a1",
      "憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"
    ],
    [
      "ea40",
      "澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"
    ],
    [
      "eaa1",
      "瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"
    ],
    [
      "eb40",
      "蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"
    ],
    [
      "eba1",
      "諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"
    ],
    [
      "ec40",
      "錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"
    ],
    [
      "eca1",
      "魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"
    ],
    [
      "ed40",
      "檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"
    ],
    [
      "eda1",
      "瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"
    ],
    [
      "ee40",
      "蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"
    ],
    [
      "eea1",
      "謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"
    ],
    [
      "ef40",
      "鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"
    ],
    [
      "efa1",
      "鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"
    ],
    [
      "f040",
      "璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"
    ],
    [
      "f0a1",
      "臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"
    ],
    [
      "f140",
      "蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"
    ],
    [
      "f1a1",
      "鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"
    ],
    [
      "f240",
      "徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"
    ],
    [
      "f2a1",
      "礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"
    ],
    [
      "f340",
      "譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"
    ],
    [
      "f3a1",
      "鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"
    ],
    [
      "f440",
      "嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"
    ],
    [
      "f4a1",
      "禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"
    ],
    [
      "f540",
      "鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"
    ],
    [
      "f5a1",
      "鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"
    ],
    [
      "f640",
      "蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"
    ],
    [
      "f6a1",
      "騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"
    ],
    [
      "f740",
      "糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"
    ],
    [
      "f7a1",
      "驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"
    ],
    [
      "f840",
      "讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"
    ],
    [
      "f8a1",
      "齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"
    ],
    [
      "f940",
      "纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"
    ],
    [
      "f9a1",
      "龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"
    ]
  ], kd = [
    [
      "8740",
      "䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"
    ],
    [
      "8767",
      "綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"
    ],
    [
      "87a1",
      "𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"
    ],
    [
      "8840",
      "㇀",
      4,
      "𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"
    ],
    [
      "88a1",
      "ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"
    ],
    [
      "8940",
      "𪎩𡅅"
    ],
    [
      "8943",
      "攊"
    ],
    [
      "8946",
      "丽滝鵎釟"
    ],
    [
      "894c",
      "𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"
    ],
    [
      "89a1",
      "琑糼緍楆竉刧"
    ],
    [
      "89ab",
      "醌碸酞肼"
    ],
    [
      "89b0",
      "贋胶𠧧"
    ],
    [
      "89b5",
      "肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"
    ],
    [
      "89c1",
      "溚舾甙"
    ],
    [
      "89c5",
      "䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"
    ],
    [
      "8a40",
      "𧶄唥"
    ],
    [
      "8a43",
      "𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"
    ],
    [
      "8a64",
      "𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"
    ],
    [
      "8a76",
      "䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"
    ],
    [
      "8aa1",
      "𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"
    ],
    [
      "8aac",
      "䠋𠆩㿺塳𢶍"
    ],
    [
      "8ab2",
      "𤗈𠓼𦂗𠽌𠶖啹䂻䎺"
    ],
    [
      "8abb",
      "䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"
    ],
    [
      "8ac9",
      "𪘁𠸉𢫏𢳉"
    ],
    [
      "8ace",
      "𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"
    ],
    [
      "8adf",
      "𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"
    ],
    [
      "8af6",
      "𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"
    ],
    [
      "8b40",
      "𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"
    ],
    [
      "8b55",
      "𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"
    ],
    [
      "8ba1",
      "𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"
    ],
    [
      "8bde",
      "𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"
    ],
    [
      "8c40",
      "倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"
    ],
    [
      "8ca1",
      "𣏹椙橃𣱣泿"
    ],
    [
      "8ca7",
      "爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"
    ],
    [
      "8cc9",
      "顨杫䉶圽"
    ],
    [
      "8cce",
      "藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"
    ],
    [
      "8ce6",
      "峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"
    ],
    [
      "8d40",
      "𠮟"
    ],
    [
      "8d42",
      "𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"
    ],
    [
      "8da1",
      "㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"
    ],
    [
      "8e40",
      "𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"
    ],
    [
      "8ea1",
      "繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"
    ],
    [
      "8f40",
      "蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"
    ],
    [
      "8fa1",
      "𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"
    ],
    [
      "9040",
      "趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"
    ],
    [
      "90a1",
      "𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"
    ],
    [
      "9140",
      "𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"
    ],
    [
      "91a1",
      "鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"
    ],
    [
      "9240",
      "𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"
    ],
    [
      "92a1",
      "働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"
    ],
    [
      "9340",
      "媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"
    ],
    [
      "93a1",
      "摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"
    ],
    [
      "9440",
      "銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"
    ],
    [
      "94a1",
      "㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"
    ],
    [
      "9540",
      "𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"
    ],
    [
      "95a1",
      "衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"
    ],
    [
      "9640",
      "桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"
    ],
    [
      "96a1",
      "𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"
    ],
    [
      "9740",
      "愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"
    ],
    [
      "97a1",
      "𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"
    ],
    [
      "9840",
      "𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"
    ],
    [
      "98a1",
      "咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"
    ],
    [
      "9940",
      "䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"
    ],
    [
      "99a1",
      "䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"
    ],
    [
      "9a40",
      "鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"
    ],
    [
      "9aa1",
      "黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"
    ],
    [
      "9b40",
      "𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"
    ],
    [
      "9b62",
      "𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"
    ],
    [
      "9ba1",
      "椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"
    ],
    [
      "9c40",
      "嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"
    ],
    [
      "9ca1",
      "㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"
    ],
    [
      "9d40",
      "𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"
    ],
    [
      "9da1",
      "辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"
    ],
    [
      "9e40",
      "𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"
    ],
    [
      "9ea1",
      "鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"
    ],
    [
      "9ead",
      "𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"
    ],
    [
      "9ec5",
      "㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"
    ],
    [
      "9ef5",
      "噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"
    ],
    [
      "9f40",
      "籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"
    ],
    [
      "9f4f",
      "凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"
    ],
    [
      "9fa1",
      "椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"
    ],
    [
      "9fae",
      "酙隁酜"
    ],
    [
      "9fb2",
      "酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"
    ],
    [
      "9fc1",
      "𤤙盖鮝个𠳔莾衂"
    ],
    [
      "9fc9",
      "届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"
    ],
    [
      "9fdb",
      "歒酼龥鮗頮颴骺麨麄煺笔"
    ],
    [
      "9fe7",
      "毺蠘罸"
    ],
    [
      "9feb",
      "嘠𪙊蹷齓"
    ],
    [
      "9ff0",
      "跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"
    ],
    [
      "a040",
      "𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"
    ],
    [
      "a055",
      "𡠻𦸅"
    ],
    [
      "a058",
      "詾𢔛"
    ],
    [
      "a05b",
      "惽癧髗鵄鍮鮏蟵"
    ],
    [
      "a063",
      "蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"
    ],
    [
      "a073",
      "坟慯抦戹拎㩜懢厪𣏵捤栂㗒"
    ],
    [
      "a0a1",
      "嵗𨯂迚𨸹"
    ],
    [
      "a0a6",
      "僙𡵆礆匲阸𠼻䁥"
    ],
    [
      "a0ae",
      "矾"
    ],
    [
      "a0b0",
      "糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"
    ],
    [
      "a0d4",
      "覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"
    ],
    [
      "a0e2",
      "罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"
    ],
    [
      "a3c0",
      "␀",
      31,
      "␡"
    ],
    [
      "c6a1",
      "①",
      9,
      "⑴",
      9,
      "ⅰ",
      9,
      "丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",
      23
    ],
    [
      "c740",
      "す",
      58,
      "ァアィイ"
    ],
    [
      "c7a1",
      "ゥ",
      81,
      "А",
      5,
      "ЁЖ",
      4
    ],
    [
      "c840",
      "Л",
      26,
      "ёж",
      25,
      "⇧↸↹㇏𠃌乚𠂊刂䒑"
    ],
    [
      "c8a1",
      "龰冈龱𧘇"
    ],
    [
      "c8cd",
      "￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"
    ],
    [
      "c8f5",
      "ʃɐɛɔɵœøŋʊɪ"
    ],
    [
      "f9fe",
      "￭"
    ],
    [
      "fa40",
      "𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"
    ],
    [
      "faa1",
      "鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"
    ],
    [
      "fb40",
      "𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"
    ],
    [
      "fba1",
      "𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"
    ],
    [
      "fc40",
      "廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"
    ],
    [
      "fca1",
      "𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"
    ],
    [
      "fd40",
      "𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"
    ],
    [
      "fda1",
      "𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"
    ],
    [
      "fe40",
      "鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"
    ],
    [
      "fea1",
      "𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"
    ]
  ];
  var qi, ko;
  function Md() {
    return ko || (ko = 1, qi = {
      // == Japanese/ShiftJIS ====================================================
      // All japanese encodings are based on JIS X set of standards:
      // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
      // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes.
      //              Has several variations in 1978, 1983, 1990 and 1997.
      // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
      // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
      //              2 planes, first is superset of 0208, second - revised 0212.
      //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)
      // Byte encodings are:
      //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
      //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
      //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
      //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
      //               0x00-0x7F       - lower part of 0201
      //               0x8E, 0xA1-0xDF - upper part of 0201
      //               (0xA1-0xFE)x2   - 0208 plane (94x94).
      //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
      //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
      //               Used as-is in ISO2022 family.
      //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII,
      //                0201-1976 Roman, 0208-1978, 0208-1983.
      //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
      //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
      //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
      //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
      //
      // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
      //
      // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html
      shiftjis: {
        type: "_dbcs",
        table: function() {
          return bd;
        },
        encodeAdd: { "¥": 92, "‾": 126 },
        encodeSkipVals: [{ from: 60736, to: 63808 }]
      },
      csshiftjis: "shiftjis",
      mskanji: "shiftjis",
      sjis: "shiftjis",
      windows31j: "shiftjis",
      ms31j: "shiftjis",
      xsjis: "shiftjis",
      windows932: "shiftjis",
      ms932: "shiftjis",
      932: "shiftjis",
      cp932: "shiftjis",
      eucjp: {
        type: "_dbcs",
        table: function() {
          return wd;
        },
        encodeAdd: { "¥": 92, "‾": 126 }
      },
      // TODO: KDDI extension to Shift_JIS
      // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
      // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.
      // == Chinese/GBK ==========================================================
      // http://en.wikipedia.org/wiki/GBK
      // We mostly implement W3C recommendation: https://www.w3.org/TR/encoding/#gbk-encoder
      // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
      gb2312: "cp936",
      gb231280: "cp936",
      gb23121980: "cp936",
      csgb2312: "cp936",
      csiso58gb231280: "cp936",
      euccn: "cp936",
      // Microsoft's CP936 is a subset and approximation of GBK.
      windows936: "cp936",
      ms936: "cp936",
      936: "cp936",
      cp936: {
        type: "_dbcs",
        table: function() {
          return Wi;
        }
      },
      // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
      gbk: {
        type: "_dbcs",
        table: function() {
          return Wi.concat(To);
        }
      },
      xgbk: "gbk",
      isoir58: "gbk",
      // GB18030 is an algorithmic extension of GBK.
      // Main source: https://www.w3.org/TR/encoding/#gbk-encoder
      // http://icu-project.org/docs/papers/gb18030.html
      // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
      // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
      gb18030: {
        type: "_dbcs",
        table: function() {
          return Wi.concat(To);
        },
        gb18030: function() {
          return Td;
        },
        encodeSkipVals: [128],
        encodeAdd: { "€": 41699 }
      },
      chinese: "gb18030",
      // == Korean ===============================================================
      // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
      windows949: "cp949",
      ms949: "cp949",
      949: "cp949",
      cp949: {
        type: "_dbcs",
        table: function() {
          return Cd;
        }
      },
      cseuckr: "cp949",
      csksc56011987: "cp949",
      euckr: "cp949",
      isoir149: "cp949",
      korean: "cp949",
      ksc56011987: "cp949",
      ksc56011989: "cp949",
      ksc5601: "cp949",
      // == Big5/Taiwan/Hong Kong ================================================
      // There are lots of tables for Big5 and cp950. Please see the following links for history:
      // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
      // Variations, in roughly number of defined chars:
      //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
      //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
      //  * Big5-2003 (Taiwan standard) almost superset of cp950.
      //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
      //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard.
      //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
      //    Plus, it has 4 combining sequences.
      //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
      //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
      //    Implementations are not consistent within browsers; sometimes labeled as just big5.
      //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
      //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
      //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
      //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
      //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
      //
      // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
      // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.
      windows950: "cp950",
      ms950: "cp950",
      950: "cp950",
      cp950: {
        type: "_dbcs",
        table: function() {
          return Co;
        }
      },
      // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
      big5: "big5hkscs",
      big5hkscs: {
        type: "_dbcs",
        table: function() {
          return Co.concat(kd);
        },
        encodeSkipVals: [
          // Although Encoding Standard says we should avoid encoding to HKSCS area (See Step 1 of
          // https://encoding.spec.whatwg.org/#index-big5-pointer), we still do it to increase compatibility with ICU.
          // But if a single unicode point can be encoded both as HKSCS and regular Big5, we prefer the latter.
          36457,
          36463,
          36478,
          36523,
          36532,
          36557,
          36560,
          36695,
          36713,
          36718,
          36811,
          36862,
          36973,
          36986,
          37060,
          37084,
          37105,
          37311,
          37551,
          37552,
          37553,
          37554,
          37585,
          37959,
          38090,
          38361,
          38652,
          39285,
          39798,
          39800,
          39803,
          39878,
          39902,
          39916,
          39926,
          40002,
          40019,
          40034,
          40040,
          40043,
          40055,
          40124,
          40125,
          40144,
          40279,
          40282,
          40388,
          40431,
          40443,
          40617,
          40687,
          40701,
          40800,
          40907,
          41079,
          41180,
          41183,
          36812,
          37576,
          38468,
          38637,
          // Step 2 of https://encoding.spec.whatwg.org/#index-big5-pointer: Use last pointer for U+2550, U+255E, U+2561, U+256A, U+5341, or U+5345
          41636,
          41637,
          41639,
          41638,
          41676,
          41678
        ]
      },
      cnbig5: "big5hkscs",
      csbig5: "big5hkscs",
      xxbig5: "big5hkscs"
    }), qi;
  }
  var Mo;
  function Ad() {
    return Mo || (Mo = 1, function(n) {
      for (var e = qh, t = [
        fd(),
        pd(),
        dd(),
        gd(),
        yd(),
        md(),
        vd(),
        xd(),
        Md()
      ], r = 0; r < t.length; r++) {
        var i = t[r];
        e(n, i);
      }
    }(Di)), Di;
  }
  var Vi, Ao;
  function Ed() {
    if (Ao) return Vi;
    Ao = 1;
    var n = Bt.Buffer;
    return Vi = function(e) {
      var t = e.Transform;
      function r(s, a) {
        this.conv = s, a = a || {}, a.decodeStrings = !1, t.call(this, a);
      }
      r.prototype = Object.create(t.prototype, {
        constructor: { value: r }
      }), r.prototype._transform = function(s, a, o) {
        if (typeof s != "string")
          return o(new Error("Iconv encoding stream needs strings as its input."));
        try {
          var h = this.conv.write(s);
          h && h.length && this.push(h), o();
        } catch (c) {
          o(c);
        }
      }, r.prototype._flush = function(s) {
        try {
          var a = this.conv.end();
          a && a.length && this.push(a), s();
        } catch (o) {
          s(o);
        }
      }, r.prototype.collect = function(s) {
        var a = [];
        return this.on("error", s), this.on("data", function(o) {
          a.push(o);
        }), this.on("end", function() {
          s(null, n.concat(a));
        }), this;
      };
      function i(s, a) {
        this.conv = s, a = a || {}, a.encoding = this.encoding = "utf8", t.call(this, a);
      }
      return i.prototype = Object.create(t.prototype, {
        constructor: { value: i }
      }), i.prototype._transform = function(s, a, o) {
        if (!n.isBuffer(s) && !(s instanceof Uint8Array))
          return o(new Error("Iconv decoding stream needs buffers as its input."));
        try {
          var h = this.conv.write(s);
          h && h.length && this.push(h, this.encoding), o();
        } catch (c) {
          o(c);
        }
      }, i.prototype._flush = function(s) {
        try {
          var a = this.conv.end();
          a && a.length && this.push(a, this.encoding), s();
        } catch (o) {
          s(o);
        }
      }, i.prototype.collect = function(s) {
        var a = "";
        return this.on("error", s), this.on("data", function(o) {
          a += o;
        }), this.on("end", function() {
          s(null, a);
        }), this;
      }, {
        IconvLiteEncoderStream: r,
        IconvLiteDecoderStream: i
      };
    }, Vi;
  }
  const Bd = {}, _d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Bd
  }, Symbol.toStringTag, { value: "Module" })), Od = /* @__PURE__ */ Kp(_d);
  (function(n) {
    var e = Bt.Buffer, t = Os, r = qh, i = n.exports;
    i.encodings = null, i.defaultCharUnicode = "�", i.defaultCharSingleByte = "?", i.encode = function(o, h, c) {
      o = "" + (o || "");
      var u = i.getEncoder(h, c), f = u.write(o), l = u.end();
      return l && l.length > 0 ? e.concat([f, l]) : f;
    }, i.decode = function(o, h, c) {
      typeof o == "string" && (i.skipDecodeWarning || (console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"), i.skipDecodeWarning = !0), o = e.from("" + (o || ""), "binary"));
      var u = i.getDecoder(h, c), f = u.write(o), l = u.end();
      return l ? f + l : f;
    }, i.encodingExists = function(o) {
      try {
        return i.getCodec(o), !0;
      } catch {
        return !1;
      }
    }, i.toEncoding = i.encode, i.fromEncoding = i.decode, i._codecDataCache = { __proto__: null }, i.getCodec = function(o) {
      if (!i.encodings) {
        var h = Ad();
        i.encodings = { __proto__: null }, r(i.encodings, h);
      }
      for (var c = i._canonicalizeEncoding(o), u = {}; ; ) {
        var f = i._codecDataCache[c];
        if (f)
          return f;
        var l = i.encodings[c];
        switch (typeof l) {
          case "string":
            c = l;
            break;
          case "object":
            for (var p in l)
              u[p] = l[p];
            u.encodingName || (u.encodingName = c), c = l.type;
            break;
          case "function":
            return u.encodingName || (u.encodingName = c), f = new l(u, i), i._codecDataCache[u.encodingName] = f, f;
          default:
            throw new Error("Encoding not recognized: '" + o + "' (searched as: '" + c + "')");
        }
      }
    }, i._canonicalizeEncoding = function(a) {
      return ("" + a).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
    }, i.getEncoder = function(o, h) {
      var c = i.getCodec(o), u = new c.encoder(h, c);
      return c.bomAware && h && h.addBOM && (u = new t.PrependBOM(u, h)), u;
    }, i.getDecoder = function(o, h) {
      var c = i.getCodec(o), u = new c.decoder(h, c);
      return c.bomAware && !(h && h.stripBOM === !1) && (u = new t.StripBOM(u, h)), u;
    }, i.enableStreamingAPI = function(o) {
      if (!i.supportsStreams) {
        var h = Ed()(o);
        i.IconvLiteEncoderStream = h.IconvLiteEncoderStream, i.IconvLiteDecoderStream = h.IconvLiteDecoderStream, i.encodeStream = function(u, f) {
          return new i.IconvLiteEncoderStream(i.getEncoder(u, f), f);
        }, i.decodeStream = function(u, f) {
          return new i.IconvLiteDecoderStream(i.getDecoder(u, f), f);
        }, i.supportsStreams = !0;
      }
    };
    var s;
    try {
      s = Od;
    } catch {
    }
    s && s.Transform ? i.enableStreamingAPI(s) : i.encodeStream = i.decodeStream = function() {
      throw new Error("iconv-lite Streaming API is not enabled. Use iconv.enableStreamingAPI(require('stream')); to enable it.");
    };
  })(Gh);
  var Ld = Gh.exports;
  const Ud = /* @__PURE__ */ Qp(Ld);
  class Rs extends Vo {
    /**
     * Creates a new instance of ShxTextShape
     * @param code - The character code this shape represents
     * @param shape - The shape data for this character
     */
    constructor(e, t, r, i) {
      super(), this.fontSize = t, this.shape = r, this.font = i, this.code = e, this.width = this.calcWidth();
    }
    calcWidth() {
      const e = this.shape.bbox;
      return e.maxX - e.minX;
    }
    offset(e) {
      return new Rs(
        this.code,
        this.fontSize,
        this.shape.offset(e),
        this.font
      );
    }
    /**
     * Converts the text shape to a THREE.js geometry
     * @returns A THREE.js BufferGeometry representing the text shape
     */
    toGeometry() {
      let e = this.font.cache.getGeometry(this.code, this.fontSize);
      if (e == null) {
        const t = this.shape.polylines, r = [], i = [];
        let s = 0;
        e = new Oe();
        for (let a = 0; a < t.length; a++) {
          const o = t[a];
          for (let h = 0; h < o.length; h++) {
            const c = o[h];
            r.push(c.x, c.y, 0), h === o.length - 1 || i.push(s, s + 1), s++;
          }
        }
        e.setAttribute(
          "position",
          new Nt(r, 3)
        ), e.setIndex(i);
      }
      return e;
    }
  }
  class Rd extends qo {
    constructor(e) {
      super(e), this.type = "shx", this.font = new jp(e.data), this.data = this.font.fontData;
    }
    /**
     * Return true if this font contains glyph of the specified character. Otherwise, return false.
     * @param char - The character to check
     * @returns True if this font contains glyph of the specified character. Otherwise, return false.
     */
    hasChar(e) {
      const t = this.getCode(e);
      return this.font.hasChar(t);
    }
    /**
     * Return true if this font contains glyph of the specified character code. Otherwise, return false.
     * @param code - The character code to check
     * @returns True if this font contains glyph of the specified character code. Otherwise, return false.
     */
    hasCode(e) {
      return this.font.hasChar(e);
    }
    generateShapes(e, t) {
      const r = [];
      let i = 0;
      for (let s = 0; s < e.length; s++) {
        const a = e[s];
        if (a === " ") {
          i += t;
          continue;
        }
        const o = this.getCharShape(a, t);
        if (!o) {
          i += t, this.addUnsupportedChar(a);
          continue;
        }
        r.push(o.offset(new ce(i, 0))), i += o.width;
      }
      return r;
    }
    /**
     * SHX font always has fixed scale factor 1.
     * @returns Always return value 1
     */
    getScaleFactor() {
      return 1;
    }
    /**
     * Gets the shape data for a specific character at a given size.
     * If the font type is BIGFONT, please use getCodeShape to get the shape data
     * because the character code for BIGFONT isn't unicode.
     * @param char - The character to get the shape for
     * @param size - The desired size of the character
     * @returns The shape data for the character, or undefined if not found
     */
    getCharShape(e, t) {
      return this.getCodeShape(this.getCode(e), t);
    }
    /**
     * Gets the shape data for a specific character code at a given size.
     * The passed code must the code stored in font instead of unicode.
     * - Unicode shx font uses unicode as character code.
     * - Bigfont uses a custom encoding for double-byte characters.
     * @param code - The character code to get the shape for
     * @param size - The desired size of the character
     * @returns The shape data for the character code, or undefined if not found
     */
    getCodeShape(e, t) {
      const r = this.font.getCharShape(e, t);
      return r ? new Rs(e, t, r, this) : void 0;
    }
    /**
     * For an unsupported char, use "？" as a replacement.
     */
    getNotFoundTextShape(e) {
      const t = this.font.fontData.header.fontType === Se.BIGFONT ? "？" : "?";
      return this.getCharShape(t, e);
    }
    /**
     * Gets encoded code of the specified character according to font character encoding
     * @param char - The character to get its code
     * @returns Returns encoded code of the specified character
     */
    getCode(e) {
      if (this.font.fontData.header.fontType === Se.BIGFONT && this.encoding) {
        const r = Ud.encode(e[0], this.encoding);
        return r.length === 1 ? r[0] : r[0] << 8 | r[1];
      } else
        return e.charCodeAt(0);
    }
  }
  class Ft {
    constructor() {
    }
    /**
     * Gets the singleton instance of the FontFactory
     * @returns The FontFactory instance
     */
    static get instance() {
      return Ft._instance || (Ft._instance = new Ft()), Ft._instance;
    }
    /**
     * Creates a font instance based on the provided font data.
     * The type of font created (ShxFont or MeshFont) is determined by the font type.
     *
     * @param data - The font data to create the font instance from
     * @returns A new instance of either ShxFont or MeshFont
     * @throws {Error} If the font data type is not supported
     */
    createFont(e) {
      if (e.type === "shx")
        return new Rd(e);
      if (e.type === "mesh")
        return new Wp(e);
      throw new Error("Unsupported font data type");
    }
  }
  class ut {
    constructor() {
      this.fontMapping = {}, this.loadedFontMap = /* @__PURE__ */ new Map(), this.unsupportedChars = {}, this.missedFonts = {}, this.enableFontCache = !0, this.defaultFont = "simkai", this.events = {
        /** Event triggered when a font cannot be found */
        fontNotFound: new wa(),
        /** Event triggered when a font is successfully loaded */
        fontLoaded: new wa()
      }, this.loader = new $c(), this.loader.setResponseType("arraybuffer"), this.fileNames = [], this.fontLoader = new Dd();
    }
    /**
     * Gets the singleton instance of the FontManager
     * @returns The FontManager instance
     */
    static get instance() {
      return ut._instance || (ut._instance = new ut()), ut._instance;
    }
    /**
     * Base URL to load fonts
     */
    get baseUrl() {
      return this.fontLoader.baseUrl;
    }
    set baseUrl(e) {
      this.fontLoader.baseUrl = e;
    }
    /**
     * Sets the font mapping configuration
     * @param mapping - The font mapping to set
     */
    setFontMapping(e) {
      this.fontMapping = e;
    }
    /**
     * Sets the font loader
     * @param fontLoader - The font loader to set
     */
    setFontLoader(e) {
      this.fontLoader = e;
    }
    /**
     * Retrieves information about all available fonts in the system.
     * Loads font metadata from a CDN if not already loaded.
     * @returns Promise that resolves to an array of FontInfo objects
     * @throws {Error} If font metadata cannot be loaded from the CDN
     */
    async getAvailableFonts() {
      return await this.fontLoader.getAvailableFonts();
    }
    /**
     * Return true if the default font was loaded.
     * @returns True if the default font was loaded. False otherwise.
     */
    isDefaultFontLoaded() {
      return this.loadedFontMap.get(this.defaultFont.toLowerCase()) != null;
    }
    /**
     * Loads the default font
     * @returns Promise that resolves to the font load statuses
     */
    async loadDefaultFont() {
      return await this.loadFontsByNames(this.defaultFont);
    }
    /**
     * Loads the specified fonts from font names
     * @param names - Font names to load.
     * @returns Promise that resolves to an array of font load statuses
     */
    async loadFontsByNames(e) {
      return e = Array.isArray(e) ? e : [e], await this.fontLoader.load(e);
    }
    /**
     * Loads the specified fonts from URLs
     * @param urls - URLs of font files to load.
     * @returns Promise that resolves to an array of font load statuses
     */
    async loadFonts(e) {
      e = Array.isArray(e) ? e : [e];
      const t = [];
      for (let i = 0; i < e.length; i++)
        t.push(this.loadFont(e[i]));
      const r = [];
      return await Promise.allSettled(t).then((i) => {
        i.forEach((s, a) => {
          const o = s.status === "fulfilled", h = e[a].url, c = Sa(h.toLowerCase());
          r.push({
            fontName: c,
            url: h,
            status: o ? "Success" : "FailedToLoad"
          }), o && this.fileNames.push(c);
        });
      }), r;
    }
    /**
     * Tries to find the specified font. If not found, uses a replacement font and returns its name.
     * @param fontName - The font name to find
     * @returns The original font name if found, or the replacement font name if not found
     */
    findAndReplaceFont(e) {
      let t = this.loadedFontMap.get(e.toLowerCase());
      if (t == null) {
        const r = this.fontMapping[e];
        if (r)
          return t = this.loadedFontMap.get(r.toLowerCase()), r;
      }
      return t ? e : this.defaultFont;
    }
    /**
     * Gets font by font name. Return undefined if not found.
     * @param fontName - The font name to find
     * @param recordMissedFonts - Record the font name to property `missedFonts` in this class
     * if the specified font name not found.
     * @returns The font with the specified font name, or undefined if not found
     */
    getFontByName(e, t = !0) {
      if (this.loadedFontMap.size === 0)
        return;
      e == null && (e = "");
      const r = e.lastIndexOf(".");
      (r > 0 && r == e.length - 4 || r == e.length - 5) && (e = e.substring(0, r));
      const i = this.loadedFontMap.get(e.toLowerCase());
      if (!i) {
        t && this.recordMissedFonts(e);
        return;
      }
      return i;
    }
    /**
     * Gets the first font which contains the specified character.
     * @param char - The character to get the shape for
     * @returns The text shape for the character, or undefined if not found
     */
    getFontByChar(e) {
      for (const [, t] of this.loadedFontMap)
        if (t.hasChar(e))
          return t;
    }
    /**
     * Gets the text shape for a specific character with the specified font and size
     * @param char - The character to get the shape for
     * @param fontName - The name of the font to use
     * @param size - The size of the character
     * @returns The text shape for the character, or undefined if not found
     */
    getCharShape(e, t, r) {
      let i = this.getFontByName(t);
      return i || (i = this.getFontByChar(e)), i == null ? void 0 : i.getCharShape(e, r);
    }
    /**
     * Gets the scale factor for a specific font
     * @param fontName - The name of the font
     * @returns The scale factor for the font, or 1 if the font is not found
     */
    getFontScaleFactor(e) {
      const t = this.loadedFontMap.get(e.toLowerCase());
      return t ? t.getScaleFactor() : 1;
    }
    /**
     * Gets type of the specific font
     * @param fontName - The name of the font
     * @returns The type of the font. If the specified font can't be found, `undefined` is returned
     */
    getFontType(e) {
      const t = this.loadedFontMap.get(e.toLowerCase());
      return t == null ? void 0 : t.type;
    }
    /**
     * Gets the shape to display when a character is not found
     * @param size - The size of the shape
     * @returns The shape for the not found indicator, or undefined if not available
     */
    getNotFoundTextShape(e) {
      for (const [, t] of this.loadedFontMap) {
        const r = t.getNotFoundTextShape(e);
        if (r) return r;
      }
    }
    /**
     * Checks if a font is already loaded in the system
     * @param fontName - The name of the font to check
     * @returns True if the font is loaded, false otherwise
     */
    isFontLoaded(e) {
      return this.loadedFontMap.has(e.toLowerCase());
    }
    /**
     * Records a font that was requested but not found
     * @param fontName - The name of the font that was not found
     */
    recordMissedFonts(e) {
      e && (this.missedFonts[e] || (this.missedFonts[e] = 0), this.missedFonts[e]++, this.events.fontNotFound.dispatch({
        fontName: e,
        count: this.missedFonts[e]
      }));
    }
    /**
     * Loads a single font
     * @param fontInfo - The matadata of the font to be loaded
     */
    async loadFont(e) {
      if (!Zo(e.file))
        throw new Error(`Invalid font file name: ${e.file}`);
      const r = this.fontInfoToFontData(e), i = r.name;
      if (this.isFontLoaded(r.name))
        return;
      const s = await Er.instance.get(i);
      if (s) {
        const a = Ft.instance.createFont(s);
        this.loadedFontMap.set(i, a);
      } else {
        const a = await this.loader.loadAsync(e.url);
        r.data = a;
        const o = Ft.instance.createFont(r);
        o && (e.name.forEach((h) => o.names.add(h)), this.loadedFontMap.set(i, o), this.enableFontCache && await Er.instance.set(i, r));
      }
      this.events.fontLoaded.dispatch({
        fontName: i
      });
    }
    fontInfoToFontData(e) {
      const t = Sa(e.file).toLowerCase(), r = ["ttf", "otf", "woff"].includes(e.type) ? "mesh" : e.type;
      return {
        name: t,
        alias: e.name,
        type: r,
        encoding: e.encoding
      };
    }
    /**
     * Loads all fonts from the cache
     */
    async getAllFontsFromCache() {
      if (this.loadedFontMap.size !== 0)
        return;
      const e = await Er.instance.getAll();
      for (const t of e) {
        const { name: r } = t;
        if (this.fileNames && !this.fileNames.includes(r))
          continue;
        const i = Ft.instance.createFont(t);
        this.loadedFontMap.set(r, i);
      }
    }
    /**
     * Gets a record of all unsupported characters across all loaded fonts
     * @returns A record mapping unsupported characters to their occurrence count
     */
    getUnsupportedChar() {
      for (const [, e] of this.loadedFontMap)
        Object.assign(this.unsupportedChars, e.unsupportedChars);
      return this.unsupportedChars;
    }
    /**
     * Releases loaded fonts from memory.
     *
     * - If no argument is provided, all loaded fonts are released and the font map is cleared.
     * - If a font name is provided, only that specific font is released from the font map.
     *
     * This is useful for freeing up memory, especially when working with large font files (e.g., Chinese mesh fonts).
     * Notes: Based on testing, one Chinese mesh font file may take 40M memory.
     *
     * @param fontToRelease - (Optional) The name of the font to release. If omitted, all fonts are released.
     * @returns `true` if the operation succeeded (all fonts released or the specified font was found and deleted), `false` if the specified font was not found.
     */
    release(e) {
      return e == null ? (this.loadedFontMap.clear(), !0) : this.loadedFontMap.delete(e);
    }
  }
  class Dd {
    /**
     * Creates a new instance of DefaultFontLoader
     */
    constructor() {
      this._avaiableFonts = [], this._avaiableFontMap = /* @__PURE__ */ new Map(), this._baseUrl = "https://mlightcad.gitlab.io/cad-data/fonts/";
    }
    /**
     * Base URL to load fonts
     */
    get baseUrl() {
      return this._baseUrl;
    }
    set baseUrl(e) {
      this._baseUrl = e, this.onFontUrlChanged(e);
    }
    /**
     * Gets the list of available fonts
     * @returns Array of FontInfo objects describing available fonts
     */
    get avaiableFonts() {
      return this._avaiableFonts;
    }
    /**
     * Triggered when font url changed
     * @param url - New font url value
     */
    onFontUrlChanged(e) {
    }
    /**
     * Retrieves information about all available fonts in the system.
     * Loads font metadata from a CDN if not already loaded.
     * @returns Promise that resolves to an array of FontInfo objects
     * @throws {Error} If font metadata cannot be loaded from the CDN
     */
    async getAvailableFonts() {
      if (this._avaiableFonts.length == 0) {
        const e = this._baseUrl + "fonts.json";
        try {
          const t = await fetch(e);
          this._avaiableFonts = await t.json();
        } catch (t) {
          throw new Error(
            `Filed to get avaiable font from '${e}' due to ${t}!`
          );
        }
        this._avaiableFonts.forEach((t) => {
          t.url = this._baseUrl + t.file;
        });
      }
      return this.buildFontMap(), this._avaiableFonts;
    }
    /**
     * Loads the specified fonts into the system. If one font is already loaded,
     * the font will not be loaded again. If no font names are provided, just loads
     * all available fonts information (not fonts).
     * @param fontNames - Array of font names to load
     * @returns Promise that resolves to an array of FontLoadStatus objects
     */
    async load(e) {
      if (e == null || e.length === 0)
        return [];
      await this.getAvailableFonts();
      const t = [], r = [];
      e.forEach((a) => {
        const o = a.toLowerCase(), h = this._avaiableFontMap.get(o);
        h && (ut.instance.isFontLoaded(o) && t.push({
          fontName: o,
          url: h.url,
          status: "Success"
        }), r.push(h));
      });
      const i = await ut.instance.loadFonts(r), s = {};
      return [...t, ...i].forEach((a) => {
        s[a.fontName] = a;
      }), e.map((a) => {
        const o = a.toLowerCase();
        return s[o] || {
          fontName: o,
          url: "",
          status: "NotFound"
        };
      });
    }
    /**
     * Build one font map. The key is font name. The value is font info.
     */
    buildFontMap() {
      const e = this._avaiableFontMap;
      this._avaiableFonts.forEach((t) => {
        t.name.forEach((r) => {
          e.set(r.toLocaleLowerCase(), t);
        });
      });
    }
  }
  var ir = /* @__PURE__ */ ((n) => (n[n.NONE = 0] = "NONE", n[n.WORD = 1] = "WORD", n[n.STACK = 2] = "STACK", n[n.SPACE = 3] = "SPACE", n[n.NBSP = 4] = "NBSP", n[n.TABULATOR = 5] = "TABULATOR", n[n.NEW_PARAGRAPH = 6] = "NEW_PARAGRAPH", n[n.NEW_COLUMN = 7] = "NEW_COLUMN", n[n.WRAP_AT_DIMLINE = 8] = "WRAP_AT_DIMLINE", n[n.PROPERTIES_CHANGED = 9] = "PROPERTIES_CHANGED", n))(ir || {}), Cr = /* @__PURE__ */ ((n) => (n[n.BOTTOM = 0] = "BOTTOM", n[n.MIDDLE = 1] = "MIDDLE", n[n.TOP = 2] = "TOP", n))(Cr || {}), Ge = /* @__PURE__ */ ((n) => (n[n.DEFAULT = 0] = "DEFAULT", n[n.LEFT = 1] = "LEFT", n[n.RIGHT = 2] = "RIGHT", n[n.CENTER = 3] = "CENTER", n[n.JUSTIFIED = 4] = "JUSTIFIED", n[n.DISTRIBUTED = 5] = "DISTRIBUTED", n))(Ge || {});
  const Id = {
    c: "Ø",
    d: "°",
    p: "±"
  }, Pd = {
    l: 1,
    r: 2,
    c: 3,
    j: 4,
    d: 5
    /* DISTRIBUTED */
  };
  function zd(n, e = !1) {
    const t = /* @__PURE__ */ new Set(), r = /\\[fF](.*?)[;|]/g;
    return [...n.matchAll(r)].forEach((i) => {
      let s = i[1].toLowerCase();
      e && (s = s.replace(/\.(ttf|otf|woff|shx)$/, "")), t.add(s);
    }), t;
  }
  class Nd {
    /**
     * Creates a new ContextStack with an initial context.
     * @param initial The initial MTextContext to use as the base of the stack.
     */
    constructor(e) {
      this.stack = [], this.stack.push(e);
    }
    /**
     * Pushes a copy of the given context onto the stack.
     * @param ctx The MTextContext to push (copied).
     */
    push(e) {
      this.stack.push(e);
    }
    /**
     * Pops the top context from the stack and merges its paragraph properties into the new top context.
     * If only one context remains, nothing is popped.
     * @returns The popped MTextContext, or undefined if the stack has only one context.
     */
    pop() {
      if (this.stack.length <= 1) return;
      const e = this.stack.pop(), t = this.stack[this.stack.length - 1];
      return JSON.stringify(t.paragraph) !== JSON.stringify(e.paragraph) && (t.paragraph = { ...e.paragraph }), e;
    }
    /**
     * Returns the current (top) context on the stack.
     */
    get current() {
      return this.stack[this.stack.length - 1];
    }
    /**
     * Returns the current stack depth (number of nested blocks), not counting the root context.
     */
    get depth() {
      return this.stack.length - 1;
    }
    /**
     * Returns the root (bottom) context, which represents the global formatting state.
     * Used for paragraph property application.
     */
    get root() {
      return this.stack[0];
    }
    /**
     * Replaces the current (top) context with the given context.
     * @param ctx The new context to set as the current context.
     */
    setCurrent(e) {
      this.stack[this.stack.length - 1] = e;
    }
  }
  class Gd {
    /**
     * Creates a new MTextParser instance
     * @param content - The MText content to parse
     * @param ctx - Optional initial MText context
     * @param options - Parser options
     */
    constructor(e, t, r = {}) {
      this.continueStroke = !1, this.inStackContext = !1, this.scanner = new Xi(e);
      const i = t ?? new $r();
      this.ctxStack = new Nd(i), this.yieldPropertyCommands = r.yieldPropertyCommands ?? !1, this.resetParagraphParameters = r.resetParagraphParameters ?? !1, this.mifDecoder = r.mifDecoder ?? this.decodeMultiByteChar.bind(this), this.mifCodeLength = r.mifCodeLength ?? "auto";
    }
    /**
     * Decode multi-byte character from hex code
     * @param hex - Hex code string (e.g. "C4E3" or "1A2B3")
     * @returns Decoded character or empty square if invalid
     */
    decodeMultiByteChar(e) {
      try {
        if (e.length === 5) {
          const t = e[0];
          let r = "gbk";
          t === "1" ? r = "shift-jis" : t === "2" && (r = "big5");
          const i = new Uint8Array([
            parseInt(e.substr(1, 2), 16),
            parseInt(e.substr(3, 2), 16)
          ]);
          return new TextDecoder(r).decode(i);
        } else if (e.length === 4) {
          const t = new Uint8Array([
            parseInt(e.substr(0, 2), 16),
            parseInt(e.substr(2, 2), 16)
          ]), r = new TextDecoder("gbk").decode(t);
          if (r !== "▯")
            return r;
          const i = new TextDecoder("big5").decode(t);
          if (i !== "▯")
            return i;
        }
        return "▯";
      } catch {
        return "▯";
      }
    }
    /**
     * Extract MIF hex code from scanner
     * @param length - The length of the hex code to extract (4 or 5), or 'auto' to detect
     * @returns The extracted hex code, or null if not found
     */
    extractMifCode(e) {
      var t, r, i;
      if (e === "auto") {
        const s = (t = this.scanner.tail.match(/^[0-9A-Fa-f]{5}/)) == null ? void 0 : t[0];
        return s || ((r = this.scanner.tail.match(/^[0-9A-Fa-f]{4}/)) == null ? void 0 : r[0]) || null;
      } else
        return ((i = this.scanner.tail.match(new RegExp(`^[0-9A-Fa-f]{${e}}`))) == null ? void 0 : i[0]) || null;
    }
    /**
     * Push current context onto the stack
     */
    pushCtx() {
      this.ctxStack.push(this.ctxStack.current);
    }
    /**
     * Pop context from the stack
     */
    popCtx() {
      this.ctxStack.pop();
    }
    /**
     * Parse stacking expression (numerator/denominator)
     * @returns Tuple of [TokenType.STACK, [numerator, denominator, type]]
     */
    parseStacking() {
      const e = new Xi(this.extractExpression(!0));
      let t = "", r = "", i = "";
      const s = () => {
        let h = e.peek(), c = !1;
        return h.charCodeAt(0) < 32 && (h = " "), h === "\\" && (c = !0, e.consume(1), h = e.peek()), e.consume(1), [h, c];
      }, a = () => {
        let h = "";
        for (; e.hasData; ) {
          const [c, u] = s();
          if (!u && (c === "/" || c === "#" || c === "^"))
            return [h, c];
          h += c;
        }
        return [h, ""];
      }, o = (h) => {
        let c = "", u = h;
        for (; e.hasData; ) {
          const [f, l] = s();
          if (!(u && f === " ")) {
            if (u = !1, !l && f === ";")
              break;
            c += f;
          }
        }
        return c;
      };
      return [t, i] = a(), i && (r = o(i === "^")), t === "" && r.includes("I/") ? [2, [" ", " ", "/"]] : i === "^" ? [2, [t, r, "^"]] : [2, [t, r, i]];
    }
    /**
     * Parse MText properties
     * @param cmd - The property command to parse
     * @returns Property changes if yieldPropertyCommands is true and changes occurred
     */
    parseProperties(e) {
      const t = this.ctxStack.current.copy(), r = this.ctxStack.current.copy();
      switch (e) {
        case "L":
          r.underline = !0, this.continueStroke = !0;
          break;
        case "l":
          r.underline = !1, r.hasAnyStroke || (this.continueStroke = !1);
          break;
        case "O":
          r.overline = !0, this.continueStroke = !0;
          break;
        case "o":
          r.overline = !1, r.hasAnyStroke || (this.continueStroke = !1);
          break;
        case "K":
          r.strikeThrough = !0, this.continueStroke = !0;
          break;
        case "k":
          r.strikeThrough = !1, r.hasAnyStroke || (this.continueStroke = !1);
          break;
        case "A":
          this.parseAlign(r);
          break;
        case "C":
          this.parseAciColor(r);
          break;
        case "c":
          this.parseRgbColor(r);
          break;
        case "H":
          this.parseHeight(r);
          break;
        case "W":
          this.parseWidth(r);
          break;
        case "Q":
          this.parseOblique(r);
          break;
        case "T":
          this.parseCharTracking(r);
          break;
        case "p":
          this.parseParagraphProperties(r);
          break;
        case "f":
        case "F":
          this.parseFontProperties(r);
          break;
        default:
          throw new Error(`Unknown command: ${e}`);
      }
      if (this.continueStroke = r.hasAnyStroke, r.continueStroke = this.continueStroke, this.ctxStack.setCurrent(r), this.yieldPropertyCommands) {
        const i = this.getPropertyChanges(t, r);
        if (Object.keys(i).length > 0)
          return {
            command: e,
            changes: i,
            depth: this.ctxStack.depth
          };
      }
    }
    /**
     * Get property changes between two contexts
     * @param oldCtx - The old context
     * @param newCtx - The new context
     * @returns Object containing changed properties
     */
    getPropertyChanges(e, t) {
      const r = {};
      if (e.underline !== t.underline && (r.underline = t.underline), e.overline !== t.overline && (r.overline = t.overline), e.strikeThrough !== t.strikeThrough && (r.strikeThrough = t.strikeThrough), e.color.aci !== t.color.aci && (r.aci = t.color.aci), e.color.rgbValue !== t.color.rgbValue && (r.rgb = t.color.rgb), e.align !== t.align && (r.align = t.align), JSON.stringify(e.fontFace) !== JSON.stringify(t.fontFace) && (r.fontFace = t.fontFace), (e.capHeight.value !== t.capHeight.value || e.capHeight.isRelative !== t.capHeight.isRelative) && (r.capHeight = t.capHeight), (e.widthFactor.value !== t.widthFactor.value || e.widthFactor.isRelative !== t.widthFactor.isRelative) && (r.widthFactor = t.widthFactor), (e.charTrackingFactor.value !== t.charTrackingFactor.value || e.charTrackingFactor.isRelative !== t.charTrackingFactor.isRelative) && (r.charTrackingFactor = t.charTrackingFactor), e.oblique !== t.oblique && (r.oblique = t.oblique), JSON.stringify(e.paragraph) !== JSON.stringify(t.paragraph)) {
        const i = {};
        e.paragraph.indent !== t.paragraph.indent && (i.indent = t.paragraph.indent), e.paragraph.align !== t.paragraph.align && (i.align = t.paragraph.align), e.paragraph.left !== t.paragraph.left && (i.left = t.paragraph.left), e.paragraph.right !== t.paragraph.right && (i.right = t.paragraph.right), JSON.stringify(e.paragraph.tabs) !== JSON.stringify(t.paragraph.tabs) && (i.tabs = t.paragraph.tabs), Object.keys(i).length > 0 && (r.paragraph = i);
      }
      return r;
    }
    /**
     * Parse alignment property
     * @param ctx - The context to update
     */
    parseAlign(e) {
      const t = this.scanner.get();
      "012".includes(t) ? e.align = parseInt(t) : e.align = 0, this.consumeOptionalTerminator();
    }
    /**
     * Parse height property
     * @param ctx - The context to update
     */
    parseHeight(e) {
      const t = this.extractFloatExpression(!0);
      if (t)
        try {
          t.endsWith("x") ? e.capHeight = {
            value: parseFloat(t.slice(0, -1)),
            isRelative: !0
          } : e.capHeight = {
            value: parseFloat(t),
            isRelative: !1
          };
        } catch {
          this.scanner.consume(-t.length);
          return;
        }
      this.consumeOptionalTerminator();
    }
    /**
     * Parse width property
     * @param ctx - The context to update
     */
    parseWidth(e) {
      const t = this.extractFloatExpression(!0);
      if (t)
        try {
          t.endsWith("x") ? e.widthFactor = {
            value: parseFloat(t.slice(0, -1)),
            isRelative: !0
          } : e.widthFactor = {
            value: parseFloat(t),
            isRelative: !1
          };
        } catch {
          this.scanner.consume(-t.length);
          return;
        }
      this.consumeOptionalTerminator();
    }
    /**
     * Parse character tracking property
     * @param ctx - The context to update
     */
    parseCharTracking(e) {
      const t = this.extractFloatExpression(!0);
      if (t)
        try {
          t.endsWith("x") ? e.charTrackingFactor = {
            value: Math.abs(parseFloat(t.slice(0, -1))),
            isRelative: !0
          } : e.charTrackingFactor = {
            value: Math.abs(parseFloat(t)),
            isRelative: !1
          };
        } catch {
          this.scanner.consume(-t.length);
          return;
        }
      this.consumeOptionalTerminator();
    }
    /**
     * Parse float value or factor
     * @param value - Current value to apply factor to
     * @returns New value
     */
    parseFloatValueOrFactor(e) {
      const t = this.extractFloatExpression(!0);
      if (t)
        if (t.endsWith("x")) {
          const r = parseFloat(t.slice(0, -1));
          e *= r;
        } else
          e = parseFloat(t);
      return e;
    }
    /**
     * Parse oblique angle property
     * @param ctx - The context to update
     */
    parseOblique(e) {
      const t = this.extractFloatExpression(!1);
      t && (e.oblique = parseFloat(t)), this.consumeOptionalTerminator();
    }
    /**
     * Parse ACI color property
     * @param ctx - The context to update
     */
    parseAciColor(e) {
      const t = this.extractIntExpression();
      if (t) {
        const r = parseInt(t);
        r < 257 && (e.color.aci = r);
      }
      this.consumeOptionalTerminator();
    }
    /**
     * Parse RGB color property
     * @param ctx - The context to update
     */
    parseRgbColor(e) {
      const t = this.extractIntExpression();
      if (t) {
        const r = parseInt(t) & 16777215;
        e.color.rgbValue = r;
      }
      this.consumeOptionalTerminator();
    }
    /**
     * Extract float expression from scanner
     * @param relative - Whether to allow relative values (ending in 'x')
     * @returns Extracted expression
     */
    extractFloatExpression(e = !1) {
      const t = e ? /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?x?/ : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/, r = this.scanner.tail.match(t);
      if (r) {
        const i = r[0];
        return this.scanner.consume(i.length), i;
      }
      return "";
    }
    /**
     * Extract integer expression from scanner
     * @returns Extracted expression
     */
    extractIntExpression() {
      const e = this.scanner.tail.match(/^\d+/);
      if (e) {
        const t = e[0];
        return this.scanner.consume(t.length), t;
      }
      return "";
    }
    /**
     * Extract expression until semicolon or end
     * @param escape - Whether to handle escaped semicolons
     * @returns Extracted expression
     */
    extractExpression(e = !1) {
      const t = this.scanner.find(";", e);
      if (t < 0) {
        const s = this.scanner.tail;
        return this.scanner.consume(s.length), s;
      }
      const r = this.scanner.peek(t - this.scanner.currentIndex - 1) === "\\", i = this.scanner.tail.slice(0, t - this.scanner.currentIndex + (r ? 1 : 0));
      return this.scanner.consume(i.length + 1), i;
    }
    /**
     * Parse font properties
     * @param ctx - The context to update
     */
    parseFontProperties(e) {
      const t = this.extractExpression().split("|");
      if (t.length > 0 && t[0]) {
        const r = t[0];
        let i = "Regular", s = 400;
        for (const a of t.slice(1))
          a.startsWith("b1") ? s = 700 : a === "i" || a.startsWith("i1") ? i = "Italic" : (a === "i0" || a.startsWith("i0")) && (i = "Regular");
        e.fontFace = {
          family: r,
          style: i,
          weight: s
        };
      }
    }
    /**
     * Parse paragraph properties from the MText content
     * Handles properties like indentation, alignment, and tab stops
     * @param ctx - The context to update
     */
    parseParagraphProperties(e) {
      const t = new Xi(this.extractExpression());
      let r = e.paragraph.indent, i = e.paragraph.left, s = e.paragraph.right, a = e.paragraph.align, o = [];
      const h = () => {
        const c = t.tail.match(/^[+-]?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/);
        if (c) {
          const u = parseFloat(c[0]);
          for (t.consume(c[0].length); t.peek() === ","; )
            t.consume(1);
          return u;
        }
        return 0;
      };
      for (; t.hasData; )
        switch (t.get()) {
          case "i":
            r = h();
            break;
          case "l":
            i = h();
            break;
          case "r":
            s = h();
            break;
          case "x":
            break;
          case "q": {
            const c = t.get();
            for (a = Pd[c] || 0; t.peek() === ","; )
              t.consume(1);
            break;
          }
          case "t":
            for (o = []; t.hasData; ) {
              const c = t.peek();
              if (c === "r" || c === "c") {
                t.consume(1);
                const u = h();
                o.push(c + u.toString());
              } else {
                const u = h();
                isNaN(u) ? t.consume(1) : o.push(u);
              }
            }
            break;
        }
      e.paragraph = {
        indent: r,
        left: i,
        right: s,
        align: a,
        tabs: o
      };
    }
    /**
     * Consume optional terminator (semicolon)
     */
    consumeOptionalTerminator() {
      this.scanner.peek() === ";" && this.scanner.consume(1);
    }
    /**
     * Parse MText content into tokens
     * @yields MTextToken objects
     */
    *parse() {
      let e = null;
      function t(i) {
        const s = { ...i.paragraph };
        i.paragraph = {
          indent: 0,
          left: 0,
          right: 0,
          align: 0,
          tabs: []
        };
        const a = {};
        return s.indent !== 0 && (a.indent = 0), s.left !== 0 && (a.left = 0), s.right !== 0 && (a.right = 0), s.align !== 0 && (a.align = 0), JSON.stringify(s.tabs) !== JSON.stringify([]) && (a.tabs = []), a;
      }
      const r = () => {
        let i = "";
        for (; this.scanner.hasData; ) {
          let s = !1, a = this.scanner.peek();
          const o = this.scanner.currentIndex;
          if (a.charCodeAt(0) < 32) {
            if (this.scanner.consume(1), a === "	")
              return [5, null];
            if (a === `
`)
              return [6, null];
            a = " ";
          }
          if (a === "\\")
            if ("\\{}".includes(this.scanner.peek(1)))
              s = !0, this.scanner.consume(1), a = this.scanner.peek();
            else {
              if (i)
                return [1, i];
              this.scanner.consume(1);
              const h = this.scanner.get();
              switch (h) {
                case "~":
                  return [4, null];
                case "P":
                  return [6, null];
                case "N":
                  return [7, null];
                case "X":
                  return [8, null];
                case "S": {
                  this.inStackContext = !0;
                  const c = this.parseStacking();
                  return this.inStackContext = !1, c;
                }
                case "m":
                case "M":
                  if (this.scanner.peek() === "+") {
                    this.scanner.consume(1);
                    const c = this.extractMifCode(this.mifCodeLength);
                    if (c) {
                      this.scanner.consume(c.length);
                      const u = this.mifDecoder(c);
                      return i ? [1, i] : [1, u];
                    }
                    this.scanner.consume(-1);
                  }
                  i += "\\M";
                  continue;
                case "U":
                  if (this.scanner.peek() === "+") {
                    this.scanner.consume(1);
                    const c = this.scanner.tail.match(/^[0-9A-Fa-f]{4,8}/);
                    if (c) {
                      const u = c[0];
                      this.scanner.consume(u.length);
                      const f = parseInt(u, 16);
                      let l = "";
                      try {
                        l = String.fromCodePoint(f);
                      } catch {
                        l = "▯";
                      }
                      return i ? [1, i] : [1, l];
                    }
                    this.scanner.consume(-1);
                  }
                  i += "\\U";
                  continue;
                default:
                  if (h)
                    try {
                      const c = this.parseProperties(h);
                      if (this.yieldPropertyCommands && c)
                        return [9, c];
                      continue;
                    } catch {
                      const c = this.scanner.tail.slice(
                        o,
                        this.scanner.currentIndex
                      );
                      i += c;
                    }
              }
              continue;
            }
          if (a === "%" && this.scanner.peek(1) === "%") {
            const h = this.scanner.peek(2).toLowerCase(), c = Id[h];
            if (c) {
              this.scanner.consume(3), i += c;
              continue;
            } else {
              this.scanner.consume(3);
              continue;
            }
          }
          if (a === " ")
            return i ? (this.scanner.consume(1), e = 3, [1, i]) : (this.scanner.consume(1), [3, null]);
          if (!s) {
            if (a === "{") {
              if (i)
                return [1, i];
              this.scanner.consume(1), this.pushCtx();
              continue;
            } else if (a === "}") {
              if (i)
                return [1, i];
              if (this.scanner.consume(1), this.yieldPropertyCommands) {
                const h = this.ctxStack.current;
                this.popCtx();
                const c = this.getPropertyChanges(h, this.ctxStack.current);
                if (Object.keys(c).length > 0)
                  return [
                    9,
                    { command: void 0, changes: c, depth: this.ctxStack.depth }
                  ];
              } else
                this.popCtx();
              continue;
            }
          }
          if (!this.inStackContext && a === "^") {
            const h = this.scanner.peek(1);
            if (h) {
              const c = h.charCodeAt(0);
              if (this.scanner.consume(2), c === 32)
                i += "^";
              else {
                if (c === 73)
                  return i ? [1, i] : [5, null];
                if (c === 74)
                  return i ? [1, i] : [6, null];
                if (c === 77)
                  continue;
                i += "▯";
              }
              continue;
            }
          }
          this.scanner.consume(1), a.charCodeAt(0) >= 32 && (i += a);
        }
        return i ? [1, i] : [0, null];
      };
      for (; ; ) {
        const [i, s] = r.call(this);
        if (i) {
          if (yield new Yi(i, this.ctxStack.current.copy(), s), i === 6 && this.resetParagraphParameters) {
            const a = this.ctxStack.current, o = t(a);
            this.yieldPropertyCommands && Object.keys(o).length > 0 && (yield new Yi(9, a.copy(), {
              command: void 0,
              changes: { paragraph: o },
              depth: this.ctxStack.depth
            }));
          }
          e && (yield new Yi(e, this.ctxStack.current.copy(), null), e = null);
        } else
          break;
      }
    }
  }
  class Xi {
    /**
     * Create a new text scanner
     * @param text - The text to scan
     */
    constructor(e) {
      this.text = e, this.textLen = e.length, this._index = 0;
    }
    /**
     * Get the current index in the text
     */
    get currentIndex() {
      return this._index;
    }
    /**
     * Check if the scanner has reached the end of the text
     */
    get isEmpty() {
      return this._index >= this.textLen;
    }
    /**
     * Check if there is more text to scan
     */
    get hasData() {
      return this._index < this.textLen;
    }
    /**
     * Get the next character and advance the index
     * @returns The next character, or empty string if at end
     */
    get() {
      if (this.isEmpty)
        return "";
      const e = this.text[this._index];
      return this._index++, e;
    }
    /**
     * Advance the index by the specified count
     * @param count - Number of characters to advance
     */
    consume(e = 1) {
      this._index = Math.max(0, Math.min(this._index + e, this.textLen));
    }
    /**
     * Look at a character without advancing the index
     * @param offset - Offset from current position
     * @returns The character at the offset position, or empty string if out of bounds
     */
    peek(e = 0) {
      const t = this._index + e;
      return t >= this.textLen || t < 0 ? "" : this.text[t];
    }
    /**
     * Find the next occurrence of a character
     * @param char - The character to find
     * @param escape - Whether to handle escaped characters
     * @returns Index of the character, or -1 if not found
     */
    find(e, t = !1) {
      let r = this._index;
      for (; r < this.textLen; ) {
        if (t && this.text[r] === "\\") {
          if (r + 1 < this.textLen) {
            if (this.text[r + 1] === e)
              return r + 1;
            r += 2;
            continue;
          }
          r++;
          continue;
        }
        if (this.text[r] === e)
          return r;
        r++;
      }
      return -1;
    }
    /**
     * Get the remaining text from the current position
     */
    get tail() {
      return this.text.slice(this._index);
    }
    /**
     * Check if the next character is a space
     */
    isNextSpace() {
      return this.peek() === " ";
    }
    /**
     * Consume spaces until a non-space character is found
     * @returns Number of spaces consumed
     */
    consumeSpaces() {
      let e = 0;
      for (; this.isNextSpace(); )
        this.consume(), e++;
      return e;
    }
  }
  class Ds {
    // Store as 0xRRGGBB or null
    /**
     * Create a new MTextColor instance.
     * @param color The initial color: number for ACI, [r,g,b] for RGB, or null/undefined for default (ACI=256).
     */
    constructor(e) {
      this._aci = 256, this._rgbValue = null, Array.isArray(e) ? this.rgb = e : typeof e == "number" ? this.aci = e : this.aci = 256;
    }
    /**
     * Get the current ACI color value.
     * @returns The ACI color (0-256), or null if using RGB.
     */
    get aci() {
      return this._aci;
    }
    /**
     * Set the ACI color value. Setting this disables any RGB color.
     * @param value The ACI color (0-256), or null to unset.
     * @throws Error if value is out of range.
     */
    set aci(e) {
      if (e === null)
        this._aci = null;
      else if (e >= 0 && e <= 256)
        this._aci = e, this._rgbValue = null;
      else
        throw new Error("ACI not in range [0, 256]");
    }
    /**
     * Get the current RGB color as a tuple [r, g, b], or null if not set.
     * @returns The RGB color tuple, or null if using ACI.
     */
    get rgb() {
      if (this._rgbValue === null) return null;
      const e = this._rgbValue >> 16 & 255, t = this._rgbValue >> 8 & 255, r = this._rgbValue & 255;
      return [e, t, r];
    }
    /**
     * Set the RGB color. Setting this disables ACI color.
     * @param value The RGB color tuple [r, g, b], or null to use ACI.
     */
    set rgb(e) {
      if (e) {
        const [t, r, i] = e;
        this._rgbValue = (t & 255) << 16 | (r & 255) << 8 | i & 255, this._aci = null;
      } else
        this._rgbValue = null;
    }
    /**
     * Returns true if the color is set by RGB, false if by ACI.
     */
    get isRgb() {
      return this._rgbValue !== null;
    }
    /**
     * Returns true if the color is set by ACI, false if by RGB.
     */
    get isAci() {
      return this._rgbValue === null && this._aci !== null;
    }
    /**
     * Get or set the internal RGB value as a number (0xRRGGBB), or null if not set.
     * Setting this will switch to RGB mode and set ACI to null.
     */
    get rgbValue() {
      return this._rgbValue;
    }
    set rgbValue(e) {
      e === null ? this._rgbValue = null : (this._rgbValue = e & 16777215, this._aci = null);
    }
    /**
     * Returns a deep copy of this color.
     * @returns A new MTextColor instance with the same color state.
     */
    copy() {
      const e = new Ds();
      return e._aci = this._aci, e._rgbValue = this._rgbValue, e;
    }
    /**
     * Returns a plain object for serialization.
     * @returns An object with aci, rgb (tuple), and rgbValue (number or null).
     */
    toObject() {
      return { aci: this._aci, rgb: this.rgb, rgbValue: this._rgbValue };
    }
    /**
     * Equality check for color.
     * @param other The other MTextColor to compare.
     * @returns True if both ACI and RGB values are equal.
     */
    equals(e) {
      return this._aci === e._aci && this._rgbValue === e._rgbValue;
    }
  }
  class $r {
    constructor() {
      this._stroke = 0, this.continueStroke = !1, this.color = new Ds(), this.align = 0, this.fontFace = { family: "", style: "Regular", weight: 400 }, this._capHeight = { value: 1, isRelative: !1 }, this._widthFactor = { value: 1, isRelative: !1 }, this._charTrackingFactor = { value: 1, isRelative: !1 }, this.oblique = 0, this.paragraph = {
        indent: 0,
        left: 0,
        right: 0,
        align: 0,
        tabs: []
      };
    }
    /**
     * Get the capital letter height
     */
    get capHeight() {
      return this._capHeight;
    }
    /**
     * Set the capital letter height
     * @param value - Height value
     */
    set capHeight(e) {
      this._capHeight = {
        value: Math.abs(e.value),
        isRelative: e.isRelative
      };
    }
    /**
     * Get the character width factor
     */
    get widthFactor() {
      return this._widthFactor;
    }
    /**
     * Set the character width factor
     * @param value - Width factor value
     */
    set widthFactor(e) {
      this._widthFactor = {
        value: Math.abs(e.value),
        isRelative: e.isRelative
      };
    }
    /**
     * Get the character tracking factor
     */
    get charTrackingFactor() {
      return this._charTrackingFactor;
    }
    /**
     * Set the character tracking factor
     * @param value - Tracking factor value
     */
    set charTrackingFactor(e) {
      this._charTrackingFactor = {
        value: Math.abs(e.value),
        isRelative: e.isRelative
      };
    }
    /**
     * Get the ACI color value
     */
    get aci() {
      return this.color.aci;
    }
    /**
     * Set the ACI color value
     * @param value - ACI color value (0-256)
     * @throws Error if value is out of range
     */
    set aci(e) {
      this.color.aci = e;
    }
    /**
     * Get the RGB color value
     */
    get rgb() {
      return this.color.rgb;
    }
    /**
     * Set the RGB color value
     */
    set rgb(e) {
      this.color.rgb = e;
    }
    /**
     * Gets whether the current text should be rendered in italic style.
     * @returns {boolean} True if the font style is 'Italic', otherwise false.
     */
    get italic() {
      return this.fontFace.style === "Italic";
    }
    /**
     * Sets whether the current text should be rendered in italic style.
     * @param value - If true, sets the font style to 'Italic'; if false, sets it to 'Regular'.
     */
    set italic(e) {
      this.fontFace.style = e ? "Italic" : "Regular";
    }
    /**
     * Gets whether the current text should be rendered in bold style.
     * This is primarily used for mesh fonts and affects font selection.
     * @returns {boolean} True if the font weight is 700 or higher, otherwise false.
     */
    get bold() {
      return (this.fontFace.weight || 400) >= 700;
    }
    /**
     * Sets whether the current text should be rendered in bold style.
     * This is primarily used for mesh fonts and affects font selection.
     * @param value - If true, sets the font weight to 700; if false, sets it to 400.
     */
    set bold(e) {
      this.fontFace.weight = e ? 700 : 400;
    }
    /**
     * Get whether text is underlined
     */
    get underline() {
      return !!(this._stroke & 1);
    }
    /**
     * Set whether text is underlined
     * @param value - Whether to underline
     */
    set underline(e) {
      this._setStrokeState(1, e);
    }
    /**
     * Get whether text has strike-through
     */
    get strikeThrough() {
      return !!(this._stroke & 4);
    }
    /**
     * Set whether text has strike-through
     * @param value - Whether to strike through
     */
    set strikeThrough(e) {
      this._setStrokeState(4, e);
    }
    /**
     * Get whether text has overline
     */
    get overline() {
      return !!(this._stroke & 2);
    }
    /**
     * Set whether text has overline
     * @param value - Whether to overline
     */
    set overline(e) {
      this._setStrokeState(2, e);
    }
    /**
     * Check if any stroke formatting is active
     */
    get hasAnyStroke() {
      return !!this._stroke;
    }
    /**
     * Set the state of a stroke type
     * @param stroke - The stroke type to set
     * @param state - Whether to enable or disable the stroke
     */
    _setStrokeState(e, t = !0) {
      t ? this._stroke |= e : this._stroke &= ~e;
    }
    /**
     * Create a copy of this context
     * @returns A new context with the same properties
     */
    copy() {
      const e = new $r();
      return e._stroke = this._stroke, e.continueStroke = this.continueStroke, e.color = this.color.copy(), e.align = this.align, e.fontFace = { ...this.fontFace }, e._capHeight = { ...this._capHeight }, e._widthFactor = { ...this._widthFactor }, e._charTrackingFactor = { ...this._charTrackingFactor }, e.oblique = this.oblique, e.paragraph = { ...this.paragraph }, e;
    }
  }
  class Yi {
    /**
     * Create a new MText token
     * @param type - The token type
     * @param ctx - The text context at this token
     * @param data - Optional token data
     */
    constructor(e, t, r) {
      this.type = e, this.ctx = t, this.data = r;
    }
  }
  var Hr = /* @__PURE__ */ ((n) => (n[n.LEFT_TO_RIGHT = 1] = "LEFT_TO_RIGHT", n[n.RIGHT_TO_LEFT = 2] = "RIGHT_TO_LEFT", n[n.TOP_TO_BOTTOM = 3] = "TOP_TO_BOTTOM", n[n.BOTTOM_TO_TOP = 4] = "BOTTOM_TO_TOP", n[n.BY_STYLE = 5] = "BY_STYLE", n))(Hr || {});
  const Hd = /* @__PURE__ */ new A(), Wd = 1.666666;
  class Is extends $r {
    /**
     * Creates a new RenderContext instance with optional initial values.
     * @param init - Partial object containing initial values for context properties
     */
    constructor(e) {
      super(), this.fontScaleFactor = 1, this.fontSize = 1, this.fontSizeScaleFactor = 1, this.blankWidth = 0, e && Object.assign(this, e);
    }
    /**
     * Creates a deep copy of the current context.
     * This is useful for saving state before applying formatting changes.
     * @returns A new RenderContext instance with identical property values
     */
    clone() {
      const e = new Is();
      return e.continueStroke = this.continueStroke, e.color = this.color.copy(), e.align = this.align, e.fontFace = { ...this.fontFace }, e.capHeight = { ...this.capHeight }, e.widthFactor = { ...this.widthFactor }, e.charTrackingFactor = { ...this.charTrackingFactor }, e.oblique = this.oblique, e.paragraph = { ...this.paragraph }, e.fontScaleFactor = this.fontScaleFactor, e.fontSize = this.fontSize, e.fontSizeScaleFactor = this.fontSizeScaleFactor, e.blankWidth = this.blankWidth, e;
    }
    /**
     * Get the current text color as a hexadecimal value for rendering.
     * @returns The color as a hex number (0xRRGGBB)
     */
    getColorAsHex() {
      return this.color.isRgb && this.color.rgbValue !== null ? this.color.rgbValue : this.color.isAci && this.color.aci !== null ? lu(this.color.aci) : 16777215;
    }
    /**
     * Set the color using a hex value for rendering purposes.
     * @param hexColor - The color as a hex number (0xRRGGBB)
     */
    setColorFromHex(e) {
      const t = e >> 16 & 255, r = e >> 8 & 255, i = e & 255;
      this.color.rgb = [t, r, i];
    }
  }
  class qd {
    /**
     * Construct one instance of this class and initialize some properties with default values.
     * @param style Input text style
     * @param styleManager Input text style manager instance
     * @param fontManager Input font manager instance
     * @param options Input formating options
     */
    constructor(e, t, r, i) {
      this._contextStack = [], this._maxFontSize = 0, this._currentIndent = 0, this._currentLeftMargin = 0, this._currentRightMargin = 0, this._style = e, this._styleManager = t, this._fontManager = r, this._options = i, this._totalHeight = 0, this._hOffset = 0, this._vOffset = 0, this._lineCount = 1, this._currentLineObjects = [], this._currentContext = new Is({
        fontScaleFactor: this.fontManager.getFontScaleFactor(
          this.textStyle.font.toLowerCase()
        ),
        fontSize: i.fontSize,
        fontSizeScaleFactor: 1,
        italic: !1,
        bold: !1,
        blankWidth: this.calculateBlankWidthForFont(
          this.textStyle.font.toLowerCase(),
          i.fontSize
        )
      }), this._currentContext.setColorFromHex(e.color), this._currentContext.fontFace.family = this.textStyle.font.toLowerCase(), this._currentContext.widthFactor = {
        value: i.widthFactor,
        isRelative: !0
      }, this._currentContext.oblique = e.obliqueAngle || 0, this._maxFontSize = 0, this._currentHorizontalAlignment = i.horizontalAlignment, this._currentIndent = 0, this._currentLeftMargin = 0, this._currentRightMargin = 0, this.initLineParams();
    }
    get fontManager() {
      return this._fontManager;
    }
    get styleManager() {
      return this._styleManager;
    }
    get textStyle() {
      return this._style;
    }
    /**
     * Total height of all lines of text
     */
    get totalHeight() {
      return this._lineCount == 1 ? this.currentMaxFontSize : this._totalHeight + this.currentLineHeight;
    }
    /**
     * The maximum width of one text line
     */
    get maxWidth() {
      return this._options.maxWidth;
    }
    /**
     * The direction that the text string follows from its start to its finish.
     */
    get flowDirection() {
      return this._options.flowDirection;
    }
    /**
     * The default horizontal alignment of one text line
     */
    get defaultHorizontalAlignment() {
      return this._options.horizontalAlignment;
    }
    /**
     * The default scale factor of character width
     */
    get defaultWidthFactor() {
      return this._options.widthFactor;
    }
    /**
     * The default font size of texts
     */
    get defaultFontSize() {
      return this._options.fontSize;
    }
    /**
     * The default line space factor
     */
    get defaultLineSpaceFactor() {
      return this._options.lineSpaceFactor;
    }
    /**
     * Font name of current character
     */
    get currentFont() {
      return this._currentContext.fontFace.family;
    }
    /**
     * The current horizontal alignment of one text line
     */
    get currentHorizontalAlignment() {
      return this._currentHorizontalAlignment;
    }
    /**
     * Font size of current character
     */
    get currentFontSize() {
      return this._currentContext.fontSize;
    }
    /**
     * The height of current line of texts
     */
    get currentLineHeight() {
      return this.defaultLineSpaceFactor * this.currentFontSize * Wd + this.currentMaxFontSize;
    }
    /**
     * The maximum font size in current line. Characters in one line may have different font and font
     * size. So we need to store the maximum font size in current line in order to calculate the height
     * of current line.
     */
    get currentMaxFontSize() {
      return this._maxFontSize;
    }
    /**
     * The current space setting between two characters. The meaning of this value is as follows.
     * - 1: no extra spacing (default tracking)
     * - 1.2: increases spacing by 20% of the text height
     * - 0.8: decreases spacing by 20% of the text height
     */
    get currentWordSpace() {
      return this._currentContext.charTrackingFactor.value;
    }
    /**
     * The current scale factor of character width
     */
    get currentWidthFactor() {
      return this._currentContext.widthFactor.value;
    }
    /**
     * All of THREE.js objects in current line. It contains objects in all of sections of this line.
     */
    get currentLineObjects() {
      return this._currentLineObjects;
    }
    /**
     * The horizental offset of current character in this line
     */
    get hOffset() {
      return this._hOffset;
    }
    set hOffset(e) {
      this._hOffset = e;
    }
    /**
     * The vertical offset of current character in this line
     */
    get vOffset() {
      return this._vOffset;
    }
    set vOffset(e) {
      this._vOffset = e;
    }
    get currentIndent() {
      return this._currentIndent;
    }
    get currentLeftMargin() {
      return this._currentLeftMargin;
    }
    get currentRightMargin() {
      return this._currentRightMargin;
    }
    get maxLineWidth() {
      return this.maxWidth - this._currentLeftMargin - this._currentRightMargin;
    }
    /**
     * Process text format information
     * @param item Input mtext inline codes
     */
    processFormat(e) {
      switch (e.command) {
        case "f":
        case "F":
          e.changes.fontFace && (this.changeFont(e.changes.fontFace.family), this.fontManager.getFontType(
            this._currentContext.fontFace.family
          ) === "mesh" ? (this._currentContext.italic = e.changes.fontFace.style === "Italic", this._currentContext.bold = (e.changes.fontFace.weight || 400) >= 700, this._currentContext.oblique = this.textStyle.obliqueAngle || 0) : (this._currentContext.italic = !1, this._currentContext.bold = !1, e.changes.fontFace.style === "Italic" ? this._currentContext.oblique = 15 : this._currentContext.oblique = this.textStyle.obliqueAngle || 0));
          break;
        case "c":
        case "C":
          e.changes.aci ? e.changes.aci === 0 ? this._currentContext.setColorFromHex(this._options.byBlockColor) : e.changes.aci === 256 ? this._currentContext.setColorFromHex(this._options.byLayerColor) : this._currentContext.color.aci = e.changes.aci : e.changes.rgb && (this._currentContext.color.rgb = e.changes.rgb);
          break;
        case "W":
          e.changes.widthFactor && (e.changes.widthFactor.isRelative ? this._currentContext.widthFactor = {
            value: e.changes.widthFactor.value * this.maxWidth,
            isRelative: !1
          } : this._currentContext.widthFactor = {
            value: e.changes.widthFactor.value * 0.93,
            isRelative: !1
          });
          break;
        case "H":
          e.changes.capHeight && (e.changes.capHeight.isRelative ? this.changeFontSizeScaleFactor(e.changes.capHeight.value) : this.changeFontHeight(e.changes.capHeight.value));
          break;
        case "T":
          e.changes.charTrackingFactor && (e.changes.charTrackingFactor.isRelative ? this._currentContext.charTrackingFactor = {
            value: e.changes.charTrackingFactor.value + 1,
            isRelative: !1
          } : this._currentContext.charTrackingFactor = {
            value: e.changes.charTrackingFactor.value,
            isRelative: !1
          });
          break;
        case "p":
          e.changes.paragraph && (e.changes.paragraph.align && (this._currentHorizontalAlignment = e.changes.paragraph.align), typeof e.changes.paragraph.indent == "number" && (this._currentIndent = e.changes.paragraph.indent * this.defaultFontSize, this._hOffset += this._currentIndent), typeof e.changes.paragraph.left == "number" && (this._currentLeftMargin = e.changes.paragraph.left * this.defaultFontSize), typeof e.changes.paragraph.right == "number" && (this._currentRightMargin = e.changes.paragraph.right * this.defaultFontSize));
          break;
        case "L":
          this._currentContext.underline = !0;
          break;
        case "l":
          this._currentContext.underline = !1;
          break;
        case "O":
          this._currentContext.overline = !0;
          break;
        case "o":
          this._currentContext.overline = !1;
          break;
        case "K":
          this._currentContext.strikeThrough = !0;
          break;
        case "k":
          this._currentContext.strikeThrough = !1;
          break;
        case "Q":
          e.changes.oblique !== void 0 && (this._currentContext.oblique = e.changes.oblique);
          break;
      }
    }
    /**
     * Reset paragraph properties to their default values from options.
     */
    resetParagraphProperties() {
      this._currentIndent = 0, this._currentLeftMargin = 0, this._currentRightMargin = 0, this._currentHorizontalAlignment = this._options.horizontalAlignment;
    }
    /**
     * Start a new paragraph by processing current geometries, resetting paragraph properties,
     * and starting a new line with indent applied.
     * @param geometries Current text geometries to process
     * @param lineGeometries Current line geometries to process
     * @param group The group to add processed geometries to
     */
    startNewParagraph(e, t, r) {
      this.processGeometries(e, t, r), this.startNewLine(), this.resetParagraphProperties();
    }
    /**
     * Render the specified texts
     * @param item Input texts to render
     */
    processText(e) {
      const t = [], r = [], i = new ca();
      for (const s of e)
        if (s.type === ir.NEW_PARAGRAPH)
          this.startNewParagraph(t, r, i);
        else if (s.type === ir.WORD) {
          const a = s.data;
          Array.isArray(a) ? a.forEach(
            (o) => this.processWord(o, t, r)
          ) : typeof a == "string" && a.length > 0 && this.processWord(a, t, r);
        } else if (s.type === ir.SPACE)
          this.processBlank();
        else if (s.type === ir.PROPERTIES_CHANGED) {
          this.processGeometries(t, r, i);
          const a = s.data;
          a.command === void 0 ? this._contextStack.length > 0 && (this._currentContext = this._contextStack.pop()) : (a.depth > 0 && this._contextStack.push(this._currentContext.clone()), this.processFormat(a));
        } else s.type === ir.STACK && (this.processStack(s.data, t, r), this.processGeometries(t, r, i));
      return (t.length > 0 || r.length > 0) && this.processGeometries(t, r, i), this.processLastLine(), i;
    }
    processGeometries(e, t, r) {
      if (e.length > 0 || t.length > 0) {
        const i = this.toThreeObject(e, t);
        r.add(i), this._currentLineObjects.push(i), e.length = 0, t.length = 0;
      }
    }
    processWord(e, t, r) {
      let i = 0;
      for (let s = 0; s < e.length; s++) {
        const a = this.getCharShape(e[s]);
        a ? this.currentHorizontalAlignment == Ge.DISTRIBUTED ? i += a.width * this.currentWidthFactor : i += a.width * this.currentWordSpace * this.currentWidthFactor : i += this._currentContext.blankWidth;
      }
      this.hOffset + i > (this.maxLineWidth || 1 / 0) && this.startNewLine();
      for (let s = 0; s < e.length; s++)
        this.processChar(e[s], t, r);
    }
    processStack(e, t, r) {
      const [i, s, a] = e, o = this._hOffset, h = this._vOffset, c = this._currentContext.charTrackingFactor.value, u = this._currentContext.fontSize, f = this._currentContext.fontSizeScaleFactor;
      this._hOffset = o, this._currentContext.charTrackingFactor = { value: 1, isRelative: !1 };
      let l = 0;
      for (let v = 0; v < i.length; v++) {
        const w = this.getCharShape(i[v]);
        w && (l += w.width * this.currentWidthFactor);
      }
      this._hOffset = o;
      let p = 0;
      for (let v = 0; v < s.length; v++) {
        const w = this.getCharShape(s[v]);
        w && (p += w.width * this.currentWidthFactor);
      }
      const g = Math.max(l, p), m = (g - l) / 2, x = (g - p) / 2;
      if (a === "^") {
        if (this._currentContext.fontSizeScaleFactor = f * 0.7, this.calcuateLineParams(), i && !s) {
          const v = [], w = [];
          this._hOffset = o, this._vOffset = h + u * 0.1;
          for (let b = 0; b < i.length; b++)
            this.processChar(
              i[b],
              v,
              w
            );
          t.push(...v), r.push(...w), this._hOffset = o + l;
        } else if (!i && s) {
          const v = [], w = [];
          this._hOffset = o, this._vOffset = h - u * 0.6;
          for (let b = 0; b < s.length; b++)
            this.processChar(
              s[b],
              v,
              w
            );
          t.push(...v), r.push(...w), this._hOffset = o + p;
        }
        this._currentContext.fontSizeScaleFactor = f, this.calcuateLineParams();
      } else {
        const v = [], w = [];
        this._hOffset = o + m, this._vOffset = h + this.currentFontSize * 0.3;
        for (let C = 0; C < i.length; C++)
          this.processChar(
            i[C],
            v,
            w
          );
        t.push(...v), r.push(...w);
        const b = [], F = [];
        this._hOffset = o + x, this._vOffset = h - this.currentFontSize * 0.6;
        for (let C = 0; C < s.length; C++)
          this.processChar(
            s[C],
            b,
            F
          );
        if (t.push(...b), r.push(...F), a === "/" || a === "#") {
          const C = new Oe(), _ = new Float32Array([
            o,
            h - this.currentFontSize * 0.8,
            0,
            o + g,
            h - this.currentFontSize * 0.8,
            0
          ]);
          C.setAttribute(
            "position",
            new We(_, 3)
          ), C.setIndex(null), r.push(C);
        }
        this._hOffset = o + g;
      }
      this._vOffset = h, this._currentContext.charTrackingFactor = {
        value: c,
        isRelative: !1
      };
    }
    processBlank() {
      this._hOffset += this._currentContext.blankWidth;
    }
    processChar(e, t, r) {
      const i = this.getCharShape(e);
      if (!i) {
        this.processBlank();
        return;
      }
      const s = i.toGeometry();
      s.scale(this.currentWidthFactor, 1, 1);
      let a = this._currentContext.oblique;
      if (this._currentContext.italic && (a += 15), a) {
        const g = a * Math.PI / 180, m = new xe();
        m.set(
          1,
          Math.tan(g),
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ), s.applyMatrix4(m);
      }
      const o = this.fontManager.getFontType(this.currentFont);
      this._currentContext.bold && o === "mesh" && s.scale(1.06, 1.06, 1), this.hOffset > (this.maxLineWidth || 1 / 0) && this.startNewLine();
      const h = this.hOffset, c = this.flowDirection == Hr.BOTTOM_TO_TOP ? this.vOffset : this.vOffset - this.currentFontSize, u = i.width * this.currentWidthFactor, f = this.currentFontSize;
      s.translate(h, c, 0), this.currentHorizontalAlignment == Ge.DISTRIBUTED ? this._hOffset += i.width * this.currentWidthFactor : this._hOffset += i.width * this.currentWordSpace * this.currentWidthFactor, t.push(s);
      const l = f * 0.05, p = 1e-3;
      if (this._currentContext.underline) {
        const g = new Oe(), m = c - l;
        g.setAttribute(
          "position",
          new We(
            new Float32Array([
              h,
              m,
              p,
              h + u,
              m,
              p
            ]),
            3
          )
        ), g.setIndex(null), r.push(g);
      }
      if (this._currentContext.overline) {
        const g = new Oe(), m = c + f + l;
        g.setAttribute(
          "position",
          new We(
            new Float32Array([
              h,
              m,
              p,
              h + u,
              m,
              p
            ]),
            3
          )
        ), g.setIndex(null), r.push(g);
      }
      if (this._currentContext.strikeThrough) {
        const g = new Oe(), m = c + f / 2 - f * 0.2;
        g.setAttribute(
          "position",
          new We(
            new Float32Array([
              h,
              m,
              p,
              h + u,
              m,
              p
            ]),
            3
          )
        ), g.setIndex(null), r.push(g);
      }
    }
    processLastLine() {
      this.processAlignment();
    }
    initLineParams() {
      this.calcuateLineParams();
    }
    changeFont(e) {
      let t = e;
      this._options.removeFontExtension && (t = e.replace(/\.(ttf|otf|woff|shx)$/, "")), this._currentContext.fontFace.family = this.fontManager.findAndReplaceFont(t), this._currentContext.blankWidth = this.calculateBlankWidthForFont(
        this._currentContext.fontFace.family,
        this._currentContext.fontSize
      ), this.calcuateLineParams();
    }
    /**
     * Calcuate font size, line space, line height and other parameters.
     */
    calcuateLineParams(e) {
      this._currentContext.fontScaleFactor = this.fontManager.getFontScaleFactor(
        this.currentFont
      );
      const t = e || this.defaultFontSize || this.textStyle.fixedTextHeight;
      this._currentContext.fontSize = t * this._currentContext.fontScaleFactor * this._currentContext.fontSizeScaleFactor;
    }
    /**
     * Get text shape of the specified character
     * @param char Input one character
     * @returns Return the text shape of the specified character
     */
    getCharShape(e) {
      let t = this.fontManager.getCharShape(
        e,
        this.currentFont,
        this.currentFontSize
      );
      return this.textStyle.bigFont && !t && (t = this.fontManager.getCharShape(
        e,
        this.textStyle.bigFont,
        this.currentFontSize
      )), t || (t = this.fontManager.getCharShape(e, "", this.currentFontSize)), t || (t = this.fontManager.getNotFoundTextShape(this.currentFontSize)), this.currentFontSize > this._maxFontSize && (this._maxFontSize = this.currentFontSize), t;
    }
    startNewLine() {
      this._hOffset = 0, this.flowDirection == Hr.BOTTOM_TO_TOP ? this._vOffset += this.currentLineHeight : this._vOffset -= this.currentLineHeight, this._lineCount++, this.processAlignment(), this._currentLineObjects = [], this._lineCount == 2 ? this._totalHeight = this.currentMaxFontSize : this._totalHeight = this._totalHeight + this.currentLineHeight, this._maxFontSize = 0;
    }
    /**
     * Apply translation on the specified buffer geometries according to text alignment setting
     */
    processAlignment() {
      const e = [];
      if (this.currentLineObjects.forEach(
        (r) => r.traverse((i) => {
          "geometry" in i && e.push(i.geometry);
        })
      ), e.length == 0) return;
      let t;
      if (e.forEach((r, i) => {
        r.boundingBox || r.computeBoundingBox(), i === 0 ? t = r.boundingBox : t.union(r.boundingBox);
      }), t) {
        const r = t.getSize(Hd);
        switch (this.currentHorizontalAlignment) {
          case Ge.LEFT:
            e.forEach(
              (i) => i.translate(this._currentLeftMargin - t.min.x, 0, 0)
            );
            break;
          case Ge.CENTER:
            e.forEach(
              (i) => i.translate(
                this._currentLeftMargin + (this.maxLineWidth - r.x) / 2 - t.min.x,
                0,
                0
              )
            );
            break;
          case Ge.RIGHT:
            e.forEach(
              (i) => i.translate(
                this._currentLeftMargin + this.maxLineWidth - r.x - t.min.x,
                0,
                0
              )
            );
            break;
          case Ge.DISTRIBUTED:
            if (e.length > 1) {
              const i = (this.maxLineWidth - r.x) / (e.length - 1);
              for (let s = 1; s < e.length; s++)
                e[s].translate(i * s, 0, 0);
            }
            e.forEach(
              (i) => i.translate(this._currentLeftMargin - t.min.x, 0, 0)
            );
            break;
        }
      }
    }
    /**
     * In AutoCAD, the width of a regular space character (ASCII 32, the space key on the keyboard) in MText
     * depends on the current font and text height, and is not a fixed value.
     * Specifically:
     * - Space width ≈ Text height × space width ratio defined by the font
     * - For common TrueType fonts (like Arial), the space width is typically about 1/4 to 1/3 of the text height.
     * For example, if the text height is 10 (units), the space width would be approximately 2.5 to 3.3 units.
     * - For SHX fonts (AutoCAD's built-in vector fonts, such as txt.shx), the space width is often half the text height.
     * So if the text height is 10, the space width is typically 5 units.
     */
    calculateBlankWidthForFont(e, t) {
      return this.fontManager.getFontType(e) === "shx" ? t * 0.5 : t * 0.3;
    }
    /**
     * Convert the text shape geometries to three.js object
     * @param geometries Input text shape geometries
     * @returns Return three.js object created from the specified text shape geometries
     */
    toThreeObject(e, t) {
      const r = new ca(), i = this._currentContext.getColorAsHex(), s = e.filter((o) => o instanceof Dr);
      if (s.length > 0) {
        const o = new Un();
        o.geometry = ho(s), o.material = this.styleManager.getMeshBasicMaterial(i), o.userData.bboxIntersectionCheck = !0, r.add(o);
      }
      const a = [
        ...t,
        ...e.filter((o) => !(o instanceof Dr))
      ];
      if (a.length > 0) {
        const o = new gc();
        o.geometry = ho(a), o.material = this.styleManager.getLineBasicMaterial(i), o.userData.bboxIntersectionCheck = !0, r.add(o);
      }
      return r.children.length === 1 ? r.children[0] : r;
    }
    changeFontSizeScaleFactor(e) {
      this._currentContext.fontSizeScaleFactor *= e, this.calcuateLineParams();
    }
    changeFontHeight(e) {
      this._currentContext.fontSize = e * this._currentContext.fontScaleFactor * this._currentContext.fontSizeScaleFactor, this.calcuateLineParams();
    }
  }
  const Zi = /* @__PURE__ */ new A(), Rt = /* @__PURE__ */ new A(), Ji = /* @__PURE__ */ new A(), $i = /* @__PURE__ */ new At(), ji = /* @__PURE__ */ new xe(), Eo = /* @__PURE__ */ new xe(), Bo = /* @__PURE__ */ new A(1, 0, 0);
  class Ps extends Ue {
    /**
     * Extracts all unique font names used in an MText string.
     * This function searches for font commands in the format \f{fontname}| or \f{fontname}; and returns a set of unique font names.
     * Font names are converted to lowercase to ensure case-insensitive uniqueness.
     *
     * @param mtext - The MText string to analyze for font names
     * @param removeExtension - Whether to remove font file extensions (e.g., .ttf, .shx) from font names. Defaults to false.
     * @returns A Set containing all unique font names found in the MText string, converted to lowercase
     * @example
     * ```ts
     * const mtext = "\\fArial.ttf|Hello\\fTimes New Roman.otf|World";
     * const fonts = getFonts(mtext, true);
     * // Returns: Set(2) { "arial", "times new roman" }
     * ```
     */
    static getFonts(e, t = !1) {
      return zd(e, t);
    }
    /**
     * Creates a new instance of MText.
     * @param text - The MText data containing text content and properties
     * @param style - The text style configuration
     * @param styleManager - The style manager instance
     * @param fontManager - The font manager instance
     * @param colorSettings - Color settings used to decided font color
     */
    constructor(e, t, r, i, s = {
      byLayerColor: 16777215,
      byBlockColor: 16777215
    }) {
      super(), this._style = t, this._styleManager = r, this._fontManager = i, this._colorSettings = {
        byLayerColor: s.byLayerColor,
        byBlockColor: s.byBlockColor
      }, this._box = new Ht(), this._boxes = [], this._mtextData = e, this._fontsInStyleLoaded = !1;
    }
    /**
     * Gets the font manager instance associated with this MText object.
     * @returns The FontManager instance
     */
    get fontManager() {
      return this._fontManager;
    }
    /**
     * Remove the current object from its parent and release geometry and material resource used
     * by the current object.
     */
    dispose() {
      this.disposeThreeObject(this);
    }
    /**
     * Draw the MText object. This method loads required fonts on demand and builds the object graph.
     */
    async asyncDraw() {
      const e = Array.from(Ps.getFonts(this._mtextData.text || "", !0));
      if (!this._fontsInStyleLoaded) {
        if (this._style.font) {
          const t = this.getFontName(this._style.font);
          t && e.push(t);
        }
        if (this._style.bigFont) {
          const t = this.getFontName(this._style.bigFont);
          t && e.push(t);
        }
        if (this._style.extendedFont) {
          const t = this.getFontName(this._style.extendedFont);
          t && e.push(t);
        }
      }
      e.length > 0 && (await this._fontManager.loadFontsByNames(e), this._fontsInStyleLoaded = !0), this.syncDraw();
    }
    /**
     * Draw the MText object. This method assumes that fonts needed are loaded. If font needed
     * not found, the default font will be used.
     */
    syncDraw() {
      const e = this.loadMText(this._mtextData, this._style);
      e && (this.getBoxes(e, this._boxes), this._boxes.forEach((t) => this.box.union(t)), this.add(e));
    }
    /**
     * Gets the style manager instance associated with this MText object.
     * @returns The StyleManager instance
     */
    get styleManager() {
      return this._styleManager;
    }
    /**
     * Gets the text style configuration for this MText object.
     * @returns The TextStyle configuration
     */
    get textStyle() {
      return this._style;
    }
    /**
     * Gets or sets the bounding box of this MText object.
     * The bounding box is calculated without considering the transformation matrix.
     * To get the bounding box with transformation, call `applyMatrix4` on this box.
     */
    get box() {
      return this._box;
    }
    set box(e) {
      this._box.copy(e);
    }
    /**
     * Calculates intersections between a ray and this MText object.
     * Overrides the base THREE.Object3D raycast method to use the text's bounding boxes.
     * @param raycaster - The raycaster to use for intersection testing
     * @param intersects - Array to store intersection results
     */
    raycast(e, t) {
      this._boxes.forEach((r) => {
        if (e.ray.intersectBox(r, Zi)) {
          const i = e.ray.origin.distanceTo(Zi);
          t.push({
            distance: i,
            point: Zi.clone(),
            object: this,
            face: null,
            faceIndex: void 0,
            uv: void 0
          });
        }
      });
    }
    /**
     * Loads and processes MText data to create a Three.js object.
     * @param mtextData - The MText data to process
     * @param style - The text style configuration
     * @returns The created Three.js object, or undefined if creation fails
     */
    loadMText(e, t) {
      const { object: r, height: i } = this.createMTextGroup(e, t);
      if (!r)
        return;
      r.matrix.decompose(Rt, $i, Ji), e.position && (Rt.x += e.position.x, Rt.y += e.position.y, r.matrix.compose(Rt, $i, Ji));
      const s = e.width, a = this.calculateAnchorPoint(
        s,
        i,
        e.attachmentPoint,
        e.drawingDirection
      );
      r.traverse((c) => {
        "geometry" in c && c.geometry.translate(a.x, a.y, 0), c.layers.enableAll();
      });
      let o = e.rotation || 0;
      if (e.directionVector) {
        const c = e.directionVector, u = new A(c.x, c.y, c.z), f = u.clone().cross(Bo), l = Bo.angleTo(u);
        o = f.z > 0 ? -l : l;
      }
      r.matrix.compose(Rt, $i, Ji);
      const h = e.position ? Rt.clone().sub(e.position) : Rt;
      return ji.makeTranslation(-h.x, -h.y, 0), Eo.makeRotationZ(o), r.matrix.multiply(ji), r.matrix.multiply(Eo), r.matrix.multiply(ji.invert()), r.matrix.decompose(r.position, r.quaternion, r.scale), r;
    }
    /**
     * Creates a group of text elements from MText data.
     * @param mtextData - The MText data to process
     * @param style - The text style configuration
     * @returns An object containing the created Three.js object and its height
     */
    createMTextGroup(e, t) {
      if (t && t.font && t.font.endsWith(".shx")) {
        const m = `${t.font}_${t.name}`;
        this.styleManager.unsupportedTextStyles[m] || (this.styleManager.unsupportedTextStyles[m] = 0), this.styleManager.unsupportedTextStyles[m]++;
      }
      const r = e.width || 0;
      let i = Ge.LEFT;
      e.width && e.attachmentPoint && ([1, 4, 7].includes(e.attachmentPoint) ? i = Ge.LEFT : [2, 5, 8].includes(e.attachmentPoint) ? i = Ge.CENTER : [3, 6, 9].includes(e.attachmentPoint) && (i = Ge.RIGHT));
      let s = Cr.BOTTOM;
      e.attachmentPoint && ([1, 2, 3].includes(e.attachmentPoint) ? s = Cr.TOP : [4, 5, 6].includes(e.attachmentPoint) ? s = Cr.MIDDLE : [7, 8, 9].includes(e.attachmentPoint) && (s = Cr.BOTTOM));
      const a = e.height || 0, o = e.lineSpaceFactor || 0.3, h = e.drawingDirection ?? Hr.LEFT_TO_RIGHT, c = {
        fontSize: a,
        widthFactor: e.widthFactor ?? 1,
        lineSpaceFactor: o,
        horizontalAlignment: i,
        maxWidth: r,
        flowDirection: h,
        byBlockColor: this._colorSettings.byBlockColor,
        byLayerColor: this._colorSettings.byLayerColor,
        removeFontExtension: !0
      }, u = new $r();
      u.fontFace.family = t.font, u.capHeight = { value: e.height || 1, isRelative: !0 }, u.widthFactor = {
        value: e.widthFactor ?? 1,
        isRelative: !0
      }, u.align = s, u.paragraph.align = i;
      const f = new qd(
        t,
        this.styleManager,
        this.fontManager,
        c
      ), p = new Gd(e.text, u, {
        resetParagraphParameters: !0,
        yieldPropertyCommands: !0
      }).parse();
      return {
        object: f.processText(p),
        height: f.totalHeight
      };
    }
    /**
     * Calculates the anchor point for text positioning based on alignment and flow direction.
     * @param width - The width of the text
     * @param height - The height of the text
     * @param attachmentPoint - The attachment point for text alignment
     * @param flowDirection - The text flow direction
     * @returns The calculated anchor point coordinates
     */
    calculateAnchorPoint(e, t, r, i) {
      let s = 0, a = 0;
      switch (r) {
        case void 0:
        case 1:
          s = 0, a = 0;
          break;
        case 2:
          s -= e / 2, a = 0;
          break;
        case 3:
          s -= e, a = 0;
          break;
        case 4:
          s = 0, a += t / 2;
          break;
        case 5:
          s -= e / 2, a += t / 2;
          break;
        case 6:
          s -= e, a += t / 2;
          break;
        case 7:
          s = 0, a += t;
          break;
        case 8:
          s -= e / 2, a += t;
          break;
        case 9:
          s -= e, a += t;
          break;
      }
      return i == Hr.BOTTOM_TO_TOP && (a -= t), { x: s, y: a };
    }
    /**
     * Recursively calculates bounding boxes for an object and its children.
     * @param object - The Three.js object to process
     * @param boxes - Array to store the calculated bounding boxes
     */
    getBoxes(e, t) {
      if (e.updateWorldMatrix(!1, !1), e instanceof ms || e instanceof Un) {
        const i = e.geometry;
        i.boundingBox === null && i.computeBoundingBox();
        const s = new Ht().copy(i.boundingBox);
        s.applyMatrix4(e.matrixWorld), t.push(s);
      }
      const r = e.children;
      for (let i = 0, s = r.length; i < s; i++)
        this.getBoxes(r[i], t);
    }
    /**
     * Remove the specified object from its parent and release geometry and material resource used
     * by the object.
     * @param obj - Input object to dispose
     */
    disposeThreeObject(e) {
      e.traverse((t) => {
        if (t.geometry && typeof t.geometry.dispose == "function")
          try {
            t.geometry.dispose();
          } catch {
          }
        if (t.material) {
          const r = (i) => {
            if (i && typeof i.dispose == "function")
              try {
                i.dispose();
              } catch {
              }
          };
          Array.isArray(t.material) ? t.material.forEach(r) : r(t.material);
        }
      });
    }
    getFontName(e) {
      if (e) {
        const t = e.lastIndexOf(".");
        return t >= 0 ? e.substring(0, t).toLowerCase() : e.toLowerCase();
      }
    }
  }
  class Vd {
    constructor() {
      this.lineBasicMaterials = {}, this.meshBasicMaterials = {}, this.unsupportedTextStyles = {};
    }
    getMeshBasicMaterial(e) {
      return this.meshBasicMaterials[e] || (this.meshBasicMaterials[e] = new Do({
        color: e
      })), this.meshBasicMaterials[e];
    }
    getLineBasicMaterial(e) {
      return this.lineBasicMaterials[e] || (this.lineBasicMaterials[e] = new Io({
        color: e
      })), this.lineBasicMaterials[e];
    }
  }
  const Qi = ut.instance, Xd = new Vd();
  self.addEventListener("message", async (n) => {
    const { type: e, id: t, data: r } = n.data;
    try {
      switch (e) {
        case "render": {
          if (!r) throw new Error("Missing data for render message");
          const { mtextContent: i, textStyle: s, colorSettings: a } = r;
          let o = new Ps(
            i,
            s,
            Xd,
            Qi,
            a
          );
          await o.asyncDraw(), o.updateMatrixWorld(!0);
          const { data: h, transferableObjects: c } = Yd(o);
          self.postMessage(
            {
              type: "render",
              id: t,
              success: !0,
              data: h
            },
            { transfer: c }
          ), o.dispose(), o = void 0;
          break;
        }
        case "loadFonts": {
          if (!r) throw new Error("Missing data for loadFonts message");
          const { fonts: i } = r;
          await Qi.loadFontsByNames(i), self.postMessage({
            type: "loadFonts",
            id: t,
            success: !0,
            data: { loaded: i }
          });
          break;
        }
        case "setFontUrl": {
          if (!r) throw new Error("Missing data for setFontUrl message");
          const { url: i } = r;
          Qi.baseUrl = i, self.postMessage({
            type: "setFontUrl",
            id: t,
            success: !0,
            data: {}
          });
          break;
        }
        case "getAvailableFonts": {
          const i = await ut.instance.getAvailableFonts();
          self.postMessage({
            type: "getAvailableFonts",
            id: t,
            success: !0,
            data: { fonts: i }
          });
          break;
        }
        default:
          throw new Error(`Unknown message type: ${e}`);
      }
    } catch (i) {
      self.postMessage({
        type: e,
        id: t,
        success: !1,
        error: i instanceof Error ? i.message : String(i)
      });
    }
  });
  function Yd(n) {
    const e = n.matrixWorld.clone(), t = new A(), r = new At(), i = new A();
    e.decompose(t, r, i);
    const s = n.box.clone();
    s.applyMatrix4(e);
    const { children: a, transferableObjects: o } = Zd(n);
    return { data: {
      // Basic properties
      type: "MText",
      position: {
        x: t.x,
        y: t.y,
        z: t.z
      },
      rotation: {
        x: r.x,
        y: r.y,
        z: r.z,
        w: r.w
      },
      scale: {
        x: i.x,
        y: i.y,
        z: i.z
      },
      box: {
        min: {
          x: s.min.x,
          y: s.min.y,
          z: s.min.z
        },
        max: {
          x: s.max.x,
          y: s.max.y,
          z: s.max.z
        }
      },
      // Serialize all child objects as JSON
      children: a
    }, transferableObjects: o };
  }
  function Zd(n) {
    const e = [], t = [];
    return n.traverse((r) => {
      if (r instanceof Un || r instanceof ms) {
        const i = r.geometry, s = r.material;
        if (i instanceof Oe) {
          const a = r.matrixWorld.clone(), o = new A(), h = new At(), c = new A();
          a.decompose(o, h, c);
          const u = {};
          i.attributes && Object.keys(i.attributes).forEach((g) => {
            const m = i.attributes[g], w = new Uint8Array(
              m.array.buffer,
              m.array.byteOffset,
              m.array.byteLength
            ).slice().buffer;
            t.push(w), u[g] = {
              arrayBuffer: w,
              byteOffset: 0,
              // Since we copied, offset is 0
              length: m.array.length,
              itemSize: m.itemSize,
              normalized: m.normalized
            };
          });
          let f = null;
          if (i.index) {
            const g = i.index.array, v = new Uint8Array(
              g.buffer,
              g.byteOffset,
              g.byteLength
            ).slice().buffer;
            t.push(v), f = {
              arrayBuffer: v,
              byteOffset: 0,
              length: g.length,
              componentType: g instanceof Uint32Array ? "uint32" : "uint16"
            };
          }
          const l = {
            type: s.type,
            color: s.color ? s.color.getHex() : 16777215,
            transparent: s.transparent,
            opacity: s.opacity
          };
          "side" in s && typeof s.side == "number" && (l.side = s.side), "linewidth" in s && typeof s.linewidth == "number" && (l.linewidth = s.linewidth);
          const p = {
            type: r instanceof Un ? "mesh" : "line",
            position: {
              x: o.x,
              y: o.y,
              z: o.z
            },
            rotation: {
              x: h.x,
              y: h.y,
              z: h.z,
              w: h.w
            },
            scale: {
              x: c.x,
              y: c.y,
              z: c.z
            },
            geometry: {
              attributes: u,
              index: f
            },
            material: l
          };
          e.push(p);
        }
      }
    }), { children: e, transferableObjects: t };
  }
});
export default Jd();
