var rt;
(function(n) {
  n[n.NONE = 0] = "NONE", n[n.WORD = 1] = "WORD", n[n.STACK = 2] = "STACK", n[n.SPACE = 3] = "SPACE", n[n.NBSP = 4] = "NBSP", n[n.TABULATOR = 5] = "TABULATOR", n[n.NEW_PARAGRAPH = 6] = "NEW_PARAGRAPH", n[n.NEW_COLUMN = 7] = "NEW_COLUMN", n[n.WRAP_AT_DIMLINE = 8] = "WRAP_AT_DIMLINE", n[n.PROPERTIES_CHANGED = 9] = "PROPERTIES_CHANGED";
})(rt || (rt = {}));
var Ve;
(function(n) {
  n[n.BOTTOM = 0] = "BOTTOM", n[n.MIDDLE = 1] = "MIDDLE", n[n.TOP = 2] = "TOP";
})(Ve || (Ve = {}));
var ot;
(function(n) {
  n[n.DEFAULT = 0] = "DEFAULT", n[n.LEFT = 1] = "LEFT", n[n.RIGHT = 2] = "RIGHT", n[n.CENTER = 3] = "CENTER", n[n.JUSTIFIED = 4] = "JUSTIFIED", n[n.DISTRIBUTED = 5] = "DISTRIBUTED";
})(ot || (ot = {}));
var He;
(function(n) {
  n[n.NONE = 0] = "NONE", n[n.UNDERLINE = 1] = "UNDERLINE", n[n.OVERLINE = 2] = "OVERLINE", n[n.STRIKE_THROUGH = 4] = "STRIKE_THROUGH";
})(He || (He = {}));
const bl = {
  c: "Ø",
  d: "°",
  p: "±",
  "%": "%"
}, vl = {
  l: ot.LEFT,
  r: ot.RIGHT,
  c: ot.CENTER,
  j: ot.JUSTIFIED,
  d: ot.DISTRIBUTED
};
function Sl(n) {
  const [t, e, s] = n;
  return t << 16 | e << 8 | s;
}
function Oa(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function zc(n) {
  return Math.max(0, Math.min(16777215, Math.round(n)));
}
function wl(n) {
  return n === null ? null : `#${zc(n).toString(16).padStart(6, "0")}`;
}
function Cl(n) {
  if (!n)
    return null;
  const t = n.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(t))
    return t;
  if (/^[0-9a-f]{6}$/.test(t))
    return `#${t}`;
  if (/^#[0-9a-f]{3}$/.test(t)) {
    const e = t[1], s = t[2], i = t[3];
    return `#${e}${e}${s}${s}${i}${i}`;
  }
  if (/^[0-9a-f]{3}$/.test(t)) {
    const e = t[0], s = t[1], i = t[2];
    return `#${e}${e}${s}${s}${i}${i}`;
  }
  return null;
}
function Tl(n) {
  if (!n)
    return null;
  const t = n.trim().toLowerCase();
  if (t === "transparent")
    return null;
  const e = Cl(t);
  if (e)
    return zc(Number.parseInt(e.slice(1), 16));
  const s = t.match(/^rgba?\((.*)\)$/);
  if (!s)
    return null;
  const i = s[1].replace(/\s*\/\s*/g, " ").split(/[,\s]+/).map((h) => h.trim()).filter(Boolean);
  if (i.length < 3)
    return null;
  const r = (h) => {
    if (h.endsWith("%")) {
      const u = Number.parseFloat(h.slice(0, -1));
      return Oa(u / 100 * 255);
    }
    const l = Number.parseFloat(h);
    return Oa(l);
  }, a = r(i[0]), o = r(i[1]), c = r(i[2]);
  return Sl([a, o, c]);
}
function kl(n, t = !1) {
  const e = /* @__PURE__ */ new Set(), s = /\\[fF](.*?)[;|]/g;
  return [...n.matchAll(s)].forEach((i) => {
    let r = i[1].toLowerCase();
    t && (r = r.replace(/\.(ttf|otf|woff|shx)$/, "")), e.add(r);
  }), e;
}
class Al {
  /**
   * Creates a new ContextStack with an initial context.
   * @param initial The initial MTextContext to use as the base of the stack.
   */
  constructor(t) {
    this.stack = [], this.stack.push(t);
  }
  /**
   * Pushes a copy of the given context onto the stack.
   * @param ctx The MTextContext to push (copied).
   */
  push(t) {
    this.stack.push(t);
  }
  /**
   * Pops the top context from the stack and merges its paragraph properties into the new top context.
   * If only one context remains, nothing is popped.
   * @returns The popped MTextContext, or undefined if the stack has only one context.
   */
  pop() {
    if (this.stack.length <= 1)
      return;
    const t = this.stack.pop(), e = this.stack[this.stack.length - 1];
    return JSON.stringify(e.paragraph) !== JSON.stringify(t.paragraph) && (e.paragraph = { ...t.paragraph }), t;
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
  setCurrent(t) {
    this.stack[this.stack.length - 1] = t;
  }
}
class Fl {
  /**
   * Creates a new MTextParser instance
   * @param content - The MText content to parse
   * @param ctx - Optional initial MText context
   * @param options - Parser options
   */
  constructor(t, e, s = {}) {
    this.continueStroke = !1, this.inStackContext = !1, this.scanner = new zi(t);
    const i = e ?? new ms();
    this.ctxStack = new Al(i), this.yieldPropertyCommands = s.yieldPropertyCommands ?? !1, this.resetParagraphParameters = s.resetParagraphParameters ?? !1, this.mifDecoder = s.mifDecoder ?? this.decodeMultiByteChar.bind(this), this.mifCodeLength = s.mifCodeLength ?? "auto";
  }
  /**
   * Decode multi-byte character from hex code
   * @param hex - Hex code string (e.g. "C4E3" or "1A2B3")
   * @returns Decoded character or empty square if invalid
   */
  decodeMultiByteChar(t) {
    try {
      if (t.length === 5) {
        const e = t[0];
        let s = "gbk";
        e === "1" ? s = "shift-jis" : e === "2" && (s = "big5");
        const i = new Uint8Array([
          parseInt(t.substr(1, 2), 16),
          parseInt(t.substr(3, 2), 16)
        ]);
        return new TextDecoder(s).decode(i);
      } else if (t.length === 4) {
        const e = new Uint8Array([
          parseInt(t.substr(0, 2), 16),
          parseInt(t.substr(2, 2), 16)
        ]), i = new TextDecoder("gbk").decode(e);
        if (i !== "▯")
          return i;
        const a = new TextDecoder("big5").decode(e);
        if (a !== "▯")
          return a;
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
  extractMifCode(t) {
    var e, s, i;
    if (t === "auto") {
      const r = (e = this.scanner.tail.match(/^[0-9A-Fa-f]{5}/)) == null ? void 0 : e[0];
      if (r)
        return r;
      const a = (s = this.scanner.tail.match(/^[0-9A-Fa-f]{4}/)) == null ? void 0 : s[0];
      return a || null;
    } else
      return ((i = this.scanner.tail.match(new RegExp(`^[0-9A-Fa-f]{${t}}`))) == null ? void 0 : i[0]) ?? null;
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
    const t = new zi(this.extractExpression(!0));
    let e = "", s = "", i = "";
    const r = () => {
      let c = t.peek(), h = !1;
      return c.charCodeAt(0) < 32 && (c = " "), c === "\\" && (h = !0, t.consume(1), c = t.peek()), t.consume(1), [c, h];
    }, a = () => {
      let c = "";
      for (; t.hasData; ) {
        const [h, l] = r();
        if (!l && (h === "/" || h === "#" || h === "^"))
          return [c, h];
        c += h;
      }
      return [c, ""];
    }, o = (c) => {
      let h = "", l = c;
      for (; t.hasData; ) {
        const [u, f] = r();
        if (!(l && u === " ")) {
          if (l = !1, !f && u === ";")
            break;
          h += u;
        }
      }
      return h;
    };
    return [e, i] = a(), i && (s = o(i === "^")), e === "" && s.includes("I/") ? [rt.STACK, [" ", " ", "/"]] : i === "^" ? [rt.STACK, [e, s, "^"]] : [rt.STACK, [e, s, i]];
  }
  /**
   * Parse MText properties
   * @param cmd - The property command to parse
   * @returns Property changes if yieldPropertyCommands is true and changes occurred
   */
  parseProperties(t) {
    const e = this.ctxStack.current.copy(), s = this.ctxStack.current.copy();
    switch (t) {
      case "L":
        s.underline = !0, this.continueStroke = !0;
        break;
      case "l":
        s.underline = !1, s.hasAnyStroke || (this.continueStroke = !1);
        break;
      case "O":
        s.overline = !0, this.continueStroke = !0;
        break;
      case "o":
        s.overline = !1, s.hasAnyStroke || (this.continueStroke = !1);
        break;
      case "K":
        s.strikeThrough = !0, this.continueStroke = !0;
        break;
      case "k":
        s.strikeThrough = !1, s.hasAnyStroke || (this.continueStroke = !1);
        break;
      case "A":
        this.parseAlign(s);
        break;
      case "C":
        this.parseAciColor(s);
        break;
      case "c":
        this.parseRgbColor(s);
        break;
      case "H":
        this.parseHeight(s);
        break;
      case "W":
        this.parseWidth(s);
        break;
      case "Q":
        this.parseOblique(s);
        break;
      case "T":
        this.parseCharTracking(s);
        break;
      case "p":
        this.parseParagraphProperties(s);
        break;
      case "f":
      case "F":
        this.parseFontProperties(s);
        break;
      default:
        throw new Error(`Unknown command: ${t}`);
    }
    if (this.continueStroke = s.hasAnyStroke, s.continueStroke = this.continueStroke, this.ctxStack.setCurrent(s), this.yieldPropertyCommands) {
      const i = this.getPropertyChanges(e, s);
      if (Object.keys(i).length > 0)
        return {
          command: t,
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
  getPropertyChanges(t, e) {
    const s = {};
    if (t.underline !== e.underline && (s.underline = e.underline), t.overline !== e.overline && (s.overline = e.overline), t.strikeThrough !== e.strikeThrough && (s.strikeThrough = e.strikeThrough), t.color.aci !== e.color.aci && (s.aci = e.color.aci), t.color.rgbValue !== e.color.rgbValue && (s.rgb = e.color.rgb), t.align !== e.align && (s.align = e.align), JSON.stringify(t.fontFace) !== JSON.stringify(e.fontFace) && (s.fontFace = e.fontFace), (t.capHeight.value !== e.capHeight.value || t.capHeight.isRelative !== e.capHeight.isRelative) && (s.capHeight = e.capHeight), (t.widthFactor.value !== e.widthFactor.value || t.widthFactor.isRelative !== e.widthFactor.isRelative) && (s.widthFactor = e.widthFactor), (t.charTrackingFactor.value !== e.charTrackingFactor.value || t.charTrackingFactor.isRelative !== e.charTrackingFactor.isRelative) && (s.charTrackingFactor = e.charTrackingFactor), t.oblique !== e.oblique && (s.oblique = e.oblique), JSON.stringify(t.paragraph) !== JSON.stringify(e.paragraph)) {
      const i = {};
      t.paragraph.indent !== e.paragraph.indent && (i.indent = e.paragraph.indent), t.paragraph.align !== e.paragraph.align && (i.align = e.paragraph.align), t.paragraph.left !== e.paragraph.left && (i.left = e.paragraph.left), t.paragraph.right !== e.paragraph.right && (i.right = e.paragraph.right), JSON.stringify(t.paragraph.tabs) !== JSON.stringify(e.paragraph.tabs) && (i.tabs = e.paragraph.tabs), Object.keys(i).length > 0 && (s.paragraph = i);
    }
    return s;
  }
  /**
   * Parse alignment property
   * @param ctx - The context to update
   */
  parseAlign(t) {
    const e = this.scanner.get();
    "012".includes(e) ? t.align = parseInt(e) : t.align = Ve.BOTTOM, this.consumeOptionalTerminator();
  }
  /**
   * Parse height property
   * @param ctx - The context to update
   */
  parseHeight(t) {
    const e = this.extractFloatExpression(!0);
    if (e)
      try {
        e.endsWith("x") ? t.capHeight = {
          value: parseFloat(e.slice(0, -1)),
          isRelative: !0
        } : t.capHeight = {
          value: parseFloat(e),
          isRelative: !1
        };
      } catch {
        this.scanner.consume(-e.length);
        return;
      }
    this.consumeOptionalTerminator();
  }
  /**
   * Parse width property
   * @param ctx - The context to update
   */
  parseWidth(t) {
    const e = this.extractFloatExpression(!0);
    if (e)
      try {
        e.endsWith("x") ? t.widthFactor = {
          value: parseFloat(e.slice(0, -1)),
          isRelative: !0
        } : t.widthFactor = {
          value: parseFloat(e),
          isRelative: !1
        };
      } catch {
        this.scanner.consume(-e.length);
        return;
      }
    this.consumeOptionalTerminator();
  }
  /**
   * Parse character tracking property
   * @param ctx - The context to update
   */
  parseCharTracking(t) {
    const e = this.extractFloatExpression(!0);
    if (e)
      try {
        e.endsWith("x") ? t.charTrackingFactor = {
          value: Math.abs(parseFloat(e.slice(0, -1))),
          isRelative: !0
        } : t.charTrackingFactor = {
          value: Math.abs(parseFloat(e)),
          isRelative: !1
        };
      } catch {
        this.scanner.consume(-e.length);
        return;
      }
    this.consumeOptionalTerminator();
  }
  /**
   * Parse float value or factor
   * @param value - Current value to apply factor to
   * @returns New value
   */
  parseFloatValueOrFactor(t) {
    const e = this.extractFloatExpression(!0);
    if (e)
      if (e.endsWith("x")) {
        const s = parseFloat(e.slice(0, -1));
        t *= s;
      } else
        t = parseFloat(e);
    return t;
  }
  /**
   * Parse oblique angle property
   * @param ctx - The context to update
   */
  parseOblique(t) {
    const e = this.extractFloatExpression(!1);
    e && (t.oblique = parseFloat(e)), this.consumeOptionalTerminator();
  }
  /**
   * Parse ACI color property
   * @param ctx - The context to update
   */
  parseAciColor(t) {
    const e = this.extractIntExpression();
    if (e) {
      const s = parseInt(e);
      s < 257 && (t.color.aci = s);
    }
    this.consumeOptionalTerminator();
  }
  /**
   * Parse RGB color property
   * @param ctx - The context to update
   */
  parseRgbColor(t) {
    const e = this.extractIntExpression();
    if (e) {
      const s = parseInt(e) & 16777215;
      t.color.rgbValue = s;
    }
    this.consumeOptionalTerminator();
  }
  /**
   * Extract float expression from scanner
   * @param relative - Whether to allow relative values (ending in 'x')
   * @returns Extracted expression
   */
  extractFloatExpression(t = !1) {
    const e = t ? /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?x?/ : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/, s = this.scanner.tail.match(e);
    if (s) {
      const i = s[0];
      return this.scanner.consume(i.length), i;
    }
    return "";
  }
  /**
   * Extract integer expression from scanner
   * @returns Extracted expression
   */
  extractIntExpression() {
    const t = this.scanner.tail.match(/^\d+/);
    if (t) {
      const e = t[0];
      return this.scanner.consume(e.length), e;
    }
    return "";
  }
  /**
   * Extract expression until semicolon or end
   * @param escape - Whether to handle escaped semicolons
   * @returns Extracted expression
   */
  extractExpression(t = !1) {
    const e = this.scanner.find(";", t);
    if (e < 0) {
      const a = this.scanner.tail;
      return this.scanner.consume(a.length), a;
    }
    const i = this.scanner.peek(e - this.scanner.currentIndex - 1) === "\\", r = this.scanner.tail.slice(0, e - this.scanner.currentIndex + (i ? 1 : 0));
    return this.scanner.consume(r.length + 1), r;
  }
  /**
   * Parse font properties
   * @param ctx - The context to update
   */
  parseFontProperties(t) {
    const e = this.extractExpression().split("|");
    if (e.length > 0 && e[0]) {
      const s = e[0];
      let i = "Regular", r = 400;
      for (const a of e.slice(1))
        a.startsWith("b1") ? r = 700 : a === "i" || a.startsWith("i1") ? i = "Italic" : (a === "i0" || a.startsWith("i0")) && (i = "Regular");
      t.fontFace = {
        family: s,
        style: i,
        weight: r
      };
    }
  }
  /**
   * Parse paragraph properties from the MText content
   * Handles properties like indentation, alignment, and tab stops
   * @param ctx - The context to update
   */
  parseParagraphProperties(t) {
    const e = new zi(this.extractExpression());
    let s = t.paragraph.indent, i = t.paragraph.left, r = t.paragraph.right, a = t.paragraph.align, o = [];
    const c = () => {
      const h = e.tail.match(/^[+-]?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/);
      if (h) {
        const l = parseFloat(h[0]);
        for (e.consume(h[0].length); e.peek() === ","; )
          e.consume(1);
        return l;
      }
      return 0;
    };
    for (; e.hasData; )
      switch (e.get()) {
        case "i":
          s = c();
          break;
        case "l":
          i = c();
          break;
        case "r":
          r = c();
          break;
        case "x":
          break;
        case "q": {
          const l = e.get();
          for (a = vl[l] || ot.DEFAULT; e.peek() === ","; )
            e.consume(1);
          break;
        }
        case "t":
          for (o = []; e.hasData; ) {
            const l = e.peek();
            if (l === "r" || l === "c") {
              e.consume(1);
              const u = c();
              o.push(l + u.toString());
            } else {
              const u = c();
              isNaN(u) ? e.consume(1) : o.push(u);
            }
          }
          break;
      }
    t.paragraph = {
      indent: s,
      left: i,
      right: r,
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
    const t = rt.WORD, e = rt.SPACE;
    let s = null;
    function i(a) {
      const o = { ...a.paragraph };
      a.paragraph = {
        indent: 0,
        left: 0,
        right: 0,
        align: ot.DEFAULT,
        tabs: []
      };
      const c = {};
      return o.indent !== 0 && (c.indent = 0), o.left !== 0 && (c.left = 0), o.right !== 0 && (c.right = 0), o.align !== ot.DEFAULT && (c.align = ot.DEFAULT), JSON.stringify(o.tabs) !== JSON.stringify([]) && (c.tabs = []), c;
    }
    const r = () => {
      let a = "";
      for (; this.scanner.hasData; ) {
        let o = !1, c = this.scanner.peek();
        const h = this.scanner.currentIndex;
        if (c.charCodeAt(0) < 32) {
          if (this.scanner.consume(1), c === "	")
            return [rt.TABULATOR, null];
          if (c === `
`)
            return [rt.NEW_PARAGRAPH, null];
          c = " ";
        }
        if (c === "\\")
          if ("\\{}".includes(this.scanner.peek(1)))
            o = !0, this.scanner.consume(1), c = this.scanner.peek();
          else {
            if (a)
              return [t, a];
            this.scanner.consume(1);
            const l = this.scanner.get();
            switch (l) {
              case "~":
                return [rt.NBSP, null];
              case "P":
                return [rt.NEW_PARAGRAPH, null];
              case "N":
                return [rt.NEW_COLUMN, null];
              case "X":
                return [rt.WRAP_AT_DIMLINE, null];
              case "S": {
                this.inStackContext = !0;
                const u = this.parseStacking();
                return this.inStackContext = !1, u;
              }
              case "m":
              case "M":
                if (this.scanner.peek() === "+") {
                  this.scanner.consume(1);
                  const u = this.extractMifCode(this.mifCodeLength);
                  if (u) {
                    this.scanner.consume(u.length);
                    const f = this.mifDecoder(u);
                    return a ? [t, a] : [t, f];
                  }
                  this.scanner.consume(-1);
                }
                a += "\\M";
                continue;
              case "U":
                if (this.scanner.peek() === "+") {
                  this.scanner.consume(1);
                  const u = this.scanner.tail.match(/^[0-9A-Fa-f]{4,8}/);
                  if (u) {
                    const f = u[0];
                    this.scanner.consume(f.length);
                    const p = parseInt(f, 16);
                    let d = "";
                    try {
                      d = String.fromCodePoint(p);
                    } catch {
                      d = "▯";
                    }
                    return a ? [t, a] : [t, d];
                  }
                  this.scanner.consume(-1);
                }
                a += "\\U";
                continue;
              default:
                if (l)
                  try {
                    const u = this.parseProperties(l);
                    if (this.yieldPropertyCommands && u)
                      return [rt.PROPERTIES_CHANGED, u];
                    continue;
                  } catch {
                    const u = this.scanner.tail.slice(h, this.scanner.currentIndex);
                    a += u;
                  }
            }
            continue;
          }
        if (c === "%" && this.scanner.peek(1) === "%") {
          const l = this.scanner.peek(2).toLowerCase(), u = bl[l];
          if (u) {
            this.scanner.consume(3), a += u;
            continue;
          } else {
            const f = [l, this.scanner.peek(3), this.scanner.peek(4)];
            if (f.every((p) => p >= "0" && p <= "9")) {
              const p = Number.parseInt(f.join(""), 10);
              this.scanner.consume(5), a += String.fromCharCode(p);
            } else
              this.scanner.consume(3);
            continue;
          }
        }
        if (c === " ")
          return a ? (this.scanner.consume(1), s = e, [t, a]) : (this.scanner.consume(1), [e, null]);
        if (!o) {
          if (c === "{") {
            if (a)
              return [t, a];
            this.scanner.consume(1), this.pushCtx();
            continue;
          } else if (c === "}") {
            if (a)
              return [t, a];
            if (this.scanner.consume(1), this.yieldPropertyCommands) {
              const l = this.ctxStack.current;
              this.popCtx();
              const u = this.getPropertyChanges(l, this.ctxStack.current);
              if (Object.keys(u).length > 0)
                return [
                  rt.PROPERTIES_CHANGED,
                  { command: void 0, changes: u, depth: this.ctxStack.depth }
                ];
            } else
              this.popCtx();
            continue;
          }
        }
        if (!this.inStackContext && c === "^") {
          const l = this.scanner.peek(1);
          if (l) {
            const u = l.charCodeAt(0);
            if (this.scanner.consume(2), u === 32)
              a += "^";
            else {
              if (u === 73)
                return a ? [t, a] : [rt.TABULATOR, null];
              if (u === 74)
                return a ? [t, a] : [rt.NEW_PARAGRAPH, null];
              if (u === 77)
                continue;
              a += "▯";
            }
            continue;
          }
        }
        this.scanner.consume(1), c.charCodeAt(0) >= 32 && (a += c);
      }
      return a ? [t, a] : [rt.NONE, null];
    };
    for (; ; ) {
      const [a, o] = r.call(this);
      if (a) {
        if (yield new Ni(a, this.ctxStack.current.copy(), o), a === rt.NEW_PARAGRAPH && this.resetParagraphParameters) {
          const c = this.ctxStack.current, h = i(c);
          this.yieldPropertyCommands && Object.keys(h).length > 0 && (yield new Ni(rt.PROPERTIES_CHANGED, c.copy(), {
            command: void 0,
            changes: { paragraph: h },
            depth: this.ctxStack.depth
          }));
        }
        s && (yield new Ni(s, this.ctxStack.current.copy(), null), s = null);
      } else
        break;
    }
  }
}
class zi {
  /**
   * Create a new text scanner
   * @param text - The text to scan
   */
  constructor(t) {
    this.text = t, this.textLen = t.length, this._index = 0;
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
    const t = this.text[this._index];
    return this._index++, t;
  }
  /**
   * Advance the index by the specified count
   * @param count - Number of characters to advance
   */
  consume(t = 1) {
    this._index = Math.max(0, Math.min(this._index + t, this.textLen));
  }
  /**
   * Look at a character without advancing the index
   * @param offset - Offset from current position
   * @returns The character at the offset position, or empty string if out of bounds
   */
  peek(t = 0) {
    const e = this._index + t;
    return e >= this.textLen || e < 0 ? "" : this.text[e];
  }
  /**
   * Find the next occurrence of a character
   * @param char - The character to find
   * @param escape - Whether to handle escaped characters
   * @returns Index of the character, or -1 if not found
   */
  find(t, e = !1) {
    let s = this._index;
    for (; s < this.textLen; ) {
      if (e && this.text[s] === "\\") {
        if (s + 1 < this.textLen) {
          if (this.text[s + 1] === t)
            return s + 1;
          s += 2;
          continue;
        }
        s++;
        continue;
      }
      if (this.text[s] === t)
        return s;
      s++;
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
    let t = 0;
    for (; this.isNextSpace(); )
      this.consume(), t++;
    return t;
  }
}
class je {
  /**
   * Create a new MTextColor instance.
   * @param color The initial color: number for ACI, [r,g,b] for RGB, or null/undefined for default (ACI=256).
   */
  constructor(t) {
    this._aci = 256, this._rgbValue = null, Array.isArray(t) ? this.rgb = t : typeof t == "number" ? this.aci = t : this.aci = 256;
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
  set aci(t) {
    if (t === null)
      this._aci = null;
    else if (t >= 0 && t <= 256)
      this._aci = t, this._rgbValue = null;
    else
      throw new Error("ACI not in range [0, 256]");
  }
  /**
   * Get the current RGB color as a tuple [r, g, b], or null if not set.
   * @returns The RGB color tuple, or null if using ACI.
   */
  get rgb() {
    if (this._rgbValue === null)
      return null;
    const t = this._rgbValue >> 16 & 255, e = this._rgbValue >> 8 & 255, s = this._rgbValue & 255;
    return [t, e, s];
  }
  /**
   * Set the RGB color. Setting this disables ACI color.
   * @param value The RGB color tuple [r, g, b], or null to use ACI.
   */
  set rgb(t) {
    if (t) {
      const [e, s, i] = t;
      this._rgbValue = (e & 255) << 16 | (s & 255) << 8 | i & 255, this._aci = null;
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
  set rgbValue(t) {
    t === null ? this._rgbValue = null : (this._rgbValue = t & 16777215, this._aci = null);
  }
  /**
   * Returns a deep copy of this color.
   * @returns A new MTextColor instance with the same color state.
   */
  copy() {
    const t = new je();
    return t._aci = this._aci, t._rgbValue = this._rgbValue, t;
  }
  /**
   * Returns a plain object for serialization.
   * @returns An object with aci, rgb (tuple), and rgbValue (number or null).
   */
  toObject() {
    return { aci: this._aci, rgb: this.rgb, rgbValue: this._rgbValue };
  }
  /**
   * Convert the current color to a CSS hex color string (#rrggbb).
   * Returns null if the color is ACI-based and has no RGB value.
   */
  toCssColor() {
    return this._rgbValue !== null ? wl(this._rgbValue) : null;
  }
  /**
   * Create an MTextColor from a CSS color string.
   * Supports #rgb, #rrggbb, rgb(...), rgba(...). Returns null if invalid or transparent.
   */
  static fromCssColor(t) {
    const e = Tl(t);
    if (e === null)
      return null;
    const s = new je();
    return s.rgbValue = e, s;
  }
  /**
   * Equality check for color.
   * @param other The other MTextColor to compare.
   * @returns True if both ACI and RGB values are equal.
   */
  equals(t) {
    return this._aci === t._aci && this._rgbValue === t._rgbValue;
  }
}
class ms {
  constructor() {
    this._stroke = 0, this.continueStroke = !1, this.color = new je(), this.align = Ve.BOTTOM, this.fontFace = { family: "", style: "Regular", weight: 400 }, this._capHeight = { value: 1, isRelative: !1 }, this._widthFactor = { value: 1, isRelative: !1 }, this._charTrackingFactor = { value: 1, isRelative: !1 }, this.oblique = 0, this.paragraph = {
      indent: 0,
      left: 0,
      right: 0,
      align: ot.DEFAULT,
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
  set capHeight(t) {
    this._capHeight = {
      value: Math.abs(t.value),
      isRelative: t.isRelative
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
  set widthFactor(t) {
    this._widthFactor = {
      value: Math.abs(t.value),
      isRelative: t.isRelative
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
  set charTrackingFactor(t) {
    this._charTrackingFactor = {
      value: Math.abs(t.value),
      isRelative: t.isRelative
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
  set aci(t) {
    this.color.aci = t;
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
  set rgb(t) {
    this.color.rgb = t;
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
  set italic(t) {
    this.fontFace.style = t ? "Italic" : "Regular";
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
  set bold(t) {
    this.fontFace.weight = t ? 700 : 400;
  }
  /**
   * Get whether text is underlined
   */
  get underline() {
    return !!(this._stroke & He.UNDERLINE);
  }
  /**
   * Set whether text is underlined
   * @param value - Whether to underline
   */
  set underline(t) {
    this._setStrokeState(He.UNDERLINE, t);
  }
  /**
   * Get whether text has strike-through
   */
  get strikeThrough() {
    return !!(this._stroke & He.STRIKE_THROUGH);
  }
  /**
   * Set whether text has strike-through
   * @param value - Whether to strike through
   */
  set strikeThrough(t) {
    this._setStrokeState(He.STRIKE_THROUGH, t);
  }
  /**
   * Get whether text has overline
   */
  get overline() {
    return !!(this._stroke & He.OVERLINE);
  }
  /**
   * Set whether text has overline
   * @param value - Whether to overline
   */
  set overline(t) {
    this._setStrokeState(He.OVERLINE, t);
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
  _setStrokeState(t, e = !0) {
    e ? this._stroke |= t : this._stroke &= ~t;
  }
  /**
   * Create a copy of this context
   * @returns A new context with the same properties
   */
  copy() {
    const t = new ms();
    return t._stroke = this._stroke, t.continueStroke = this.continueStroke, t.color = this.color.copy(), t.align = this.align, t.fontFace = { ...this.fontFace }, t._capHeight = { ...this._capHeight }, t._widthFactor = { ...this._widthFactor }, t._charTrackingFactor = { ...this._charTrackingFactor }, t.oblique = this.oblique, t.paragraph = { ...this.paragraph }, t;
  }
}
class Ni {
  /**
   * Create a new MText token
   * @param type - The token type
   * @param ctx - The text context at this token
   * @param data - Optional token data
   */
  constructor(t, e, s) {
    this.type = t, this.ctx = e, this.data = s;
  }
}
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const Nc = "172", Ur = 0, El = 1, _a = 1, La = 100, Ia = 204, Ra = 205, Ba = 3, Ml = 0, Hc = 300, Da = 1e3, As = 1001, Ua = 1002, Ol = 1006, _l = 1008, Ll = 1009, Il = 1015, Rl = 1023, Gc = "", re = "srgb", Pa = "srgb-linear", za = "linear", Hi = "srgb", yn = 7680, Na = 519, Ha = 35044, Fs = 2e3, Ga = 2001;
class _i {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const s = this._listeners;
    s[t] === void 0 && (s[t] = []), s[t].indexOf(e) === -1 && s[t].push(e);
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return !1;
    const s = this._listeners;
    return s[t] !== void 0 && s[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const i = this._listeners[t];
    if (i !== void 0) {
      const r = i.indexOf(e);
      r !== -1 && i.splice(r, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const s = this._listeners[t.type];
    if (s !== void 0) {
      t.target = this;
      const i = s.slice(0);
      for (let r = 0, a = i.length; r < a; r++)
        i[r].call(this, t);
      t.target = null;
    }
  }
}
const Et = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
function Vn() {
  const n = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, s = Math.random() * 4294967295 | 0;
  return (Et[n & 255] + Et[n >> 8 & 255] + Et[n >> 16 & 255] + Et[n >> 24 & 255] + "-" + Et[t & 255] + Et[t >> 8 & 255] + "-" + Et[t >> 16 & 15 | 64] + Et[t >> 24 & 255] + "-" + Et[e & 63 | 128] + Et[e >> 8 & 255] + "-" + Et[e >> 16 & 255] + Et[e >> 24 & 255] + Et[s & 255] + Et[s >> 8 & 255] + Et[s >> 16 & 255] + Et[s >> 24 & 255]).toLowerCase();
}
function Z(n, t, e) {
  return Math.max(t, Math.min(e, n));
}
function Bl(n, t) {
  return (n % t + t) % t;
}
function Gi(n, t, e) {
  return (1 - e) * n + e * t;
}
function jn(n, t) {
  switch (t.constructor) {
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
function Nt(n, t) {
  switch (t.constructor) {
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
class $ {
  constructor(t = 0, e = 0) {
    $.prototype.isVector2 = !0, this.x = t, this.y = e;
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x, s = this.y, i = t.elements;
    return this.x = i[0] * e + i[3] * s + i[6], this.y = i[1] * e + i[4] * s + i[7], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
  }
  clamp(t, e) {
    return this.x = Z(this.x, t.x, e.x), this.y = Z(this.y, t.y, e.y), this;
  }
  clampScalar(t, e) {
    return this.x = Z(this.x, t, e), this.y = Z(this.y, t, e), this;
  }
  clampLength(t, e) {
    const s = this.length();
    return this.divideScalar(s || 1).multiplyScalar(Z(s, t, e));
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
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
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
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const s = this.dot(t) / e;
    return Math.acos(Z(s, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, s = this.y - t.y;
    return e * e + s * s;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
  }
  lerpVectors(t, e, s) {
    return this.x = t.x + (e.x - t.x) * s, this.y = t.y + (e.y - t.y) * s, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this;
  }
  rotateAround(t, e) {
    const s = Math.cos(e), i = Math.sin(e), r = this.x - t.x, a = this.y - t.y;
    return this.x = r * s - a * i + t.x, this.y = r * i + a * s + t.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Je {
  constructor(t, e, s, i, r, a, o, c, h) {
    Je.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, s, i, r, a, o, c, h);
  }
  set(t, e, s, i, r, a, o, c, h) {
    const l = this.elements;
    return l[0] = t, l[1] = i, l[2] = o, l[3] = e, l[4] = r, l[5] = c, l[6] = s, l[7] = a, l[8] = h, this;
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
  copy(t) {
    const e = this.elements, s = t.elements;
    return e[0] = s[0], e[1] = s[1], e[2] = s[2], e[3] = s[3], e[4] = s[4], e[5] = s[5], e[6] = s[6], e[7] = s[7], e[8] = s[8], this;
  }
  extractBasis(t, e, s) {
    return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), s.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[4],
      e[8],
      e[1],
      e[5],
      e[9],
      e[2],
      e[6],
      e[10]
    ), this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const s = t.elements, i = e.elements, r = this.elements, a = s[0], o = s[3], c = s[6], h = s[1], l = s[4], u = s[7], f = s[2], p = s[5], d = s[8], g = i[0], x = i[3], b = i[6], v = i[1], S = i[4], w = i[7], k = i[2], M = i[5], O = i[8];
    return r[0] = a * g + o * v + c * k, r[3] = a * x + o * S + c * M, r[6] = a * b + o * w + c * O, r[1] = h * g + l * v + u * k, r[4] = h * x + l * S + u * M, r[7] = h * b + l * w + u * O, r[2] = f * g + p * v + d * k, r[5] = f * x + p * S + d * M, r[8] = f * b + p * w + d * O, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], s = t[1], i = t[2], r = t[3], a = t[4], o = t[5], c = t[6], h = t[7], l = t[8];
    return e * a * l - e * o * h - s * r * l + s * o * c + i * r * h - i * a * c;
  }
  invert() {
    const t = this.elements, e = t[0], s = t[1], i = t[2], r = t[3], a = t[4], o = t[5], c = t[6], h = t[7], l = t[8], u = l * a - o * h, f = o * c - l * r, p = h * r - a * c, d = e * u + s * f + i * p;
    if (d === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const g = 1 / d;
    return t[0] = u * g, t[1] = (i * h - l * s) * g, t[2] = (o * s - i * a) * g, t[3] = f * g, t[4] = (l * e - i * c) * g, t[5] = (i * r - o * e) * g, t[6] = p * g, t[7] = (s * c - h * e) * g, t[8] = (a * e - s * r) * g, this;
  }
  transpose() {
    let t;
    const e = this.elements;
    return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
  }
  setUvTransform(t, e, s, i, r, a, o) {
    const c = Math.cos(r), h = Math.sin(r);
    return this.set(
      s * c,
      s * h,
      -s * (c * a + h * o) + a + t,
      -i * h,
      i * c,
      -i * (-h * a + c * o) + o + e,
      0,
      0,
      1
    ), this;
  }
  //
  scale(t, e) {
    return this.premultiply(Vi.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(Vi.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(Vi.makeTranslation(t, e)), this;
  }
  // for 2D Transforms
  makeTranslation(t, e) {
    return t.isVector2 ? this.set(
      1,
      0,
      t.x,
      0,
      1,
      t.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      t,
      0,
      1,
      e,
      0,
      0,
      1
    ), this;
  }
  makeRotation(t) {
    const e = Math.cos(t), s = Math.sin(t);
    return this.set(
      e,
      -s,
      0,
      s,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e) {
    return this.set(
      t,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(t) {
    const e = this.elements, s = t.elements;
    for (let i = 0; i < 9; i++)
      if (e[i] !== s[i]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let s = 0; s < 9; s++)
      this.elements[s] = t[s + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const s = this.elements;
    return t[e] = s[0], t[e + 1] = s[1], t[e + 2] = s[2], t[e + 3] = s[3], t[e + 4] = s[4], t[e + 5] = s[5], t[e + 6] = s[6], t[e + 7] = s[7], t[e + 8] = s[8], t;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Vi = /* @__PURE__ */ new Je();
function Dl(n) {
  for (let t = n.length - 1; t >= 0; --t)
    if (n[t] >= 65535) return !0;
  return !1;
}
function Va(n) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", n);
}
const Wa = /* @__PURE__ */ new Je().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), qa = /* @__PURE__ */ new Je().set(
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
function Ul() {
  const n = {
    enabled: !0,
    workingColorSpace: Pa,
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
    convert: function(i, r, a) {
      return this.enabled === !1 || r === a || !r || !a || (this.spaces[r].transfer === Hi && (i.r = Le(i.r), i.g = Le(i.g), i.b = Le(i.b)), this.spaces[r].primaries !== this.spaces[a].primaries && (i.applyMatrix3(this.spaces[r].toXYZ), i.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === Hi && (i.r = In(i.r), i.g = In(i.g), i.b = In(i.b))), i;
    },
    fromWorkingColorSpace: function(i, r) {
      return this.convert(i, this.workingColorSpace, r);
    },
    toWorkingColorSpace: function(i, r) {
      return this.convert(i, r, this.workingColorSpace);
    },
    getPrimaries: function(i) {
      return this.spaces[i].primaries;
    },
    getTransfer: function(i) {
      return i === Gc ? za : this.spaces[i].transfer;
    },
    getLuminanceCoefficients: function(i, r = this.workingColorSpace) {
      return i.fromArray(this.spaces[r].luminanceCoefficients);
    },
    define: function(i) {
      Object.assign(this.spaces, i);
    },
    // Internal APIs
    _getMatrix: function(i, r, a) {
      return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(i) {
      return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(i = this.workingColorSpace) {
      return this.spaces[i].workingColorSpaceConfig.unpackColorSpace;
    }
  }, t = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], e = [0.2126, 0.7152, 0.0722], s = [0.3127, 0.329];
  return n.define({
    [Pa]: {
      primaries: t,
      whitePoint: s,
      transfer: za,
      toXYZ: Wa,
      fromXYZ: qa,
      luminanceCoefficients: e,
      workingColorSpaceConfig: { unpackColorSpace: re },
      outputColorSpaceConfig: { drawingBufferColorSpace: re }
    },
    [re]: {
      primaries: t,
      whitePoint: s,
      transfer: Hi,
      toXYZ: Wa,
      fromXYZ: qa,
      luminanceCoefficients: e,
      outputColorSpaceConfig: { drawingBufferColorSpace: re }
    }
  }), n;
}
const ee = /* @__PURE__ */ Ul();
function Le(n) {
  return n < 0.04045 ? n * 0.0773993808 : Math.pow(n * 0.9478672986 + 0.0521327014, 2.4);
}
function In(n) {
  return n < 31308e-7 ? n * 12.92 : 1.055 * Math.pow(n, 0.41666) - 0.055;
}
let xn;
class Pl {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
      return t.src;
    let e;
    if (t instanceof HTMLCanvasElement)
      e = t;
    else {
      xn === void 0 && (xn = Va("canvas")), xn.width = t.width, xn.height = t.height;
      const s = xn.getContext("2d");
      t instanceof ImageData ? s.putImageData(t, 0, 0) : s.drawImage(t, 0, 0, t.width, t.height), e = xn;
    }
    return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = Va("canvas");
      e.width = t.width, e.height = t.height;
      const s = e.getContext("2d");
      s.drawImage(t, 0, 0, t.width, t.height);
      const i = s.getImageData(0, 0, t.width, t.height), r = i.data;
      for (let a = 0; a < r.length; a++)
        r[a] = Le(r[a] / 255) * 255;
      return s.putImageData(i, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let s = 0; s < e.length; s++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[s] = Math.floor(Le(e[s] / 255) * 255) : e[s] = Le(e[s]);
      return {
        data: e,
        width: t.width,
        height: t.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let zl = 0;
class Nl {
  constructor(t = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: zl++ }), this.uuid = Vn(), this.data = t, this.dataReady = !0, this.version = 0;
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0)
      return t.images[this.uuid];
    const s = {
      uuid: this.uuid,
      url: ""
    }, i = this.data;
    if (i !== null) {
      let r;
      if (Array.isArray(i)) {
        r = [];
        for (let a = 0, o = i.length; a < o; a++)
          i[a].isDataTexture ? r.push(Wi(i[a].image)) : r.push(Wi(i[a]));
      } else
        r = Wi(i);
      s.url = r;
    }
    return e || (t.images[this.uuid] = s), s;
  }
}
function Wi(n) {
  return typeof HTMLImageElement < "u" && n instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && n instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && n instanceof ImageBitmap ? Pl.getDataURL(n) : n.data ? {
    data: Array.from(n.data),
    width: n.width,
    height: n.height,
    type: n.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Hl = 0;
class cn extends _i {
  constructor(t = cn.DEFAULT_IMAGE, e = cn.DEFAULT_MAPPING, s = As, i = As, r = Ol, a = _l, o = Rl, c = Ll, h = cn.DEFAULT_ANISOTROPY, l = Gc) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Hl++ }), this.uuid = Vn(), this.name = "", this.source = new Nl(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = s, this.wrapT = i, this.magFilter = r, this.minFilter = a, this.anisotropy = h, this.format = o, this.internalFormat = null, this.type = c, this.offset = new $(0, 0), this.repeat = new $(1, 1), this.center = new $(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Je(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = l, this.userData = {}, this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.renderTarget = t.renderTarget, this.isRenderTargetTexture = t.isRenderTargetTexture, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0)
      return t.textures[this.uuid];
    const s = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
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
    return Object.keys(this.userData).length > 0 && (s.userData = this.userData), e || (t.textures[this.uuid] = s), s;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== Hc) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
      switch (this.wrapS) {
        case Da:
          t.x = t.x - Math.floor(t.x);
          break;
        case As:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case Ua:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case Da:
          t.y = t.y - Math.floor(t.y);
          break;
        case As:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case Ua:
          Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
          break;
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
}
cn.DEFAULT_IMAGE = null;
cn.DEFAULT_MAPPING = Hc;
cn.DEFAULT_ANISOTROPY = 1;
class ys {
  constructor(t = 0, e = 0, s = 0, i = 1) {
    ys.prototype.isVector4 = !0, this.x = t, this.y = e, this.z = s, this.w = i;
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, s, i) {
    return this.x = t, this.y = e, this.z = s, this.w = i, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this.w = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setW(t) {
    return this.w = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this.w += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
  }
  applyMatrix4(t) {
    const e = this.x, s = this.y, i = this.z, r = this.w, a = t.elements;
    return this.x = a[0] * e + a[4] * s + a[8] * i + a[12] * r, this.y = a[1] * e + a[5] * s + a[9] * i + a[13] * r, this.z = a[2] * e + a[6] * s + a[10] * i + a[14] * r, this.w = a[3] * e + a[7] * s + a[11] * i + a[15] * r, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, s, i, r;
    const c = t.elements, h = c[0], l = c[4], u = c[8], f = c[1], p = c[5], d = c[9], g = c[2], x = c[6], b = c[10];
    if (Math.abs(l - f) < 0.01 && Math.abs(u - g) < 0.01 && Math.abs(d - x) < 0.01) {
      if (Math.abs(l + f) < 0.1 && Math.abs(u + g) < 0.1 && Math.abs(d + x) < 0.1 && Math.abs(h + p + b - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const S = (h + 1) / 2, w = (p + 1) / 2, k = (b + 1) / 2, M = (l + f) / 4, O = (u + g) / 4, I = (d + x) / 4;
      return S > w && S > k ? S < 0.01 ? (s = 0, i = 0.707106781, r = 0.707106781) : (s = Math.sqrt(S), i = M / s, r = O / s) : w > k ? w < 0.01 ? (s = 0.707106781, i = 0, r = 0.707106781) : (i = Math.sqrt(w), s = M / i, r = I / i) : k < 0.01 ? (s = 0.707106781, i = 0.707106781, r = 0) : (r = Math.sqrt(k), s = O / r, i = I / r), this.set(s, i, r, e), this;
    }
    let v = Math.sqrt((x - d) * (x - d) + (u - g) * (u - g) + (f - l) * (f - l));
    return Math.abs(v) < 1e-3 && (v = 1), this.x = (x - d) / v, this.y = (u - g) / v, this.z = (f - l) / v, this.w = Math.acos((h + p + b - 1) / 2), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this.w = e[15], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
  }
  clamp(t, e) {
    return this.x = Z(this.x, t.x, e.x), this.y = Z(this.y, t.y, e.y), this.z = Z(this.z, t.z, e.z), this.w = Z(this.w, t.w, e.w), this;
  }
  clampScalar(t, e) {
    return this.x = Z(this.x, t, e), this.y = Z(this.y, t, e), this.z = Z(this.z, t, e), this.w = Z(this.w, t, e), this;
  }
  clampLength(t, e) {
    const s = this.length();
    return this.divideScalar(s || 1).multiplyScalar(Z(s, t, e));
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
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
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
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
  }
  lerpVectors(t, e, s) {
    return this.x = t.x + (e.x - t.x) * s, this.y = t.y + (e.y - t.y) * s, this.z = t.z + (e.z - t.z) * s, this.w = t.w + (e.w - t.w) * s, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class pn {
  constructor(t = 0, e = 0, s = 0, i = 1) {
    this.isQuaternion = !0, this._x = t, this._y = e, this._z = s, this._w = i;
  }
  static slerpFlat(t, e, s, i, r, a, o) {
    let c = s[i + 0], h = s[i + 1], l = s[i + 2], u = s[i + 3];
    const f = r[a + 0], p = r[a + 1], d = r[a + 2], g = r[a + 3];
    if (o === 0) {
      t[e + 0] = c, t[e + 1] = h, t[e + 2] = l, t[e + 3] = u;
      return;
    }
    if (o === 1) {
      t[e + 0] = f, t[e + 1] = p, t[e + 2] = d, t[e + 3] = g;
      return;
    }
    if (u !== g || c !== f || h !== p || l !== d) {
      let x = 1 - o;
      const b = c * f + h * p + l * d + u * g, v = b >= 0 ? 1 : -1, S = 1 - b * b;
      if (S > Number.EPSILON) {
        const k = Math.sqrt(S), M = Math.atan2(k, b * v);
        x = Math.sin(x * M) / k, o = Math.sin(o * M) / k;
      }
      const w = o * v;
      if (c = c * x + f * w, h = h * x + p * w, l = l * x + d * w, u = u * x + g * w, x === 1 - o) {
        const k = 1 / Math.sqrt(c * c + h * h + l * l + u * u);
        c *= k, h *= k, l *= k, u *= k;
      }
    }
    t[e] = c, t[e + 1] = h, t[e + 2] = l, t[e + 3] = u;
  }
  static multiplyQuaternionsFlat(t, e, s, i, r, a) {
    const o = s[i], c = s[i + 1], h = s[i + 2], l = s[i + 3], u = r[a], f = r[a + 1], p = r[a + 2], d = r[a + 3];
    return t[e] = o * d + l * u + c * p - h * f, t[e + 1] = c * d + l * f + h * u - o * p, t[e + 2] = h * d + l * p + o * f - c * u, t[e + 3] = l * d - o * u - c * f - h * p, t;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    this._w = t, this._onChangeCallback();
  }
  set(t, e, s, i) {
    return this._x = t, this._y = e, this._z = s, this._w = i, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
  }
  setFromEuler(t, e = !0) {
    const s = t._x, i = t._y, r = t._z, a = t._order, o = Math.cos, c = Math.sin, h = o(s / 2), l = o(i / 2), u = o(r / 2), f = c(s / 2), p = c(i / 2), d = c(r / 2);
    switch (a) {
      case "XYZ":
        this._x = f * l * u + h * p * d, this._y = h * p * u - f * l * d, this._z = h * l * d + f * p * u, this._w = h * l * u - f * p * d;
        break;
      case "YXZ":
        this._x = f * l * u + h * p * d, this._y = h * p * u - f * l * d, this._z = h * l * d - f * p * u, this._w = h * l * u + f * p * d;
        break;
      case "ZXY":
        this._x = f * l * u - h * p * d, this._y = h * p * u + f * l * d, this._z = h * l * d + f * p * u, this._w = h * l * u - f * p * d;
        break;
      case "ZYX":
        this._x = f * l * u - h * p * d, this._y = h * p * u + f * l * d, this._z = h * l * d - f * p * u, this._w = h * l * u + f * p * d;
        break;
      case "YZX":
        this._x = f * l * u + h * p * d, this._y = h * p * u + f * l * d, this._z = h * l * d - f * p * u, this._w = h * l * u - f * p * d;
        break;
      case "XZY":
        this._x = f * l * u - h * p * d, this._y = h * p * u - f * l * d, this._z = h * l * d + f * p * u, this._w = h * l * u + f * p * d;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return e === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const s = e / 2, i = Math.sin(s);
    return this._x = t.x * i, this._y = t.y * i, this._z = t.z * i, this._w = Math.cos(s), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t) {
    const e = t.elements, s = e[0], i = e[4], r = e[8], a = e[1], o = e[5], c = e[9], h = e[2], l = e[6], u = e[10], f = s + o + u;
    if (f > 0) {
      const p = 0.5 / Math.sqrt(f + 1);
      this._w = 0.25 / p, this._x = (l - c) * p, this._y = (r - h) * p, this._z = (a - i) * p;
    } else if (s > o && s > u) {
      const p = 2 * Math.sqrt(1 + s - o - u);
      this._w = (l - c) / p, this._x = 0.25 * p, this._y = (i + a) / p, this._z = (r + h) / p;
    } else if (o > u) {
      const p = 2 * Math.sqrt(1 + o - s - u);
      this._w = (r - h) / p, this._x = (i + a) / p, this._y = 0.25 * p, this._z = (c + l) / p;
    } else {
      const p = 2 * Math.sqrt(1 + u - s - o);
      this._w = (a - i) / p, this._x = (r + h) / p, this._y = (c + l) / p, this._z = 0.25 * p;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let s = t.dot(e) + 1;
    return s < Number.EPSILON ? (s = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = s) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = s)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = s), this.normalize();
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(Z(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const s = this.angleTo(t);
    if (s === 0) return this;
    const i = Math.min(1, e / s);
    return this.slerp(t, i), this;
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
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let t = this.length();
    return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const s = t._x, i = t._y, r = t._z, a = t._w, o = e._x, c = e._y, h = e._z, l = e._w;
    return this._x = s * l + a * o + i * h - r * c, this._y = i * l + a * c + r * o - s * h, this._z = r * l + a * h + s * c - i * o, this._w = a * l - s * o - i * c - r * h, this._onChangeCallback(), this;
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const s = this._x, i = this._y, r = this._z, a = this._w;
    let o = a * t._w + s * t._x + i * t._y + r * t._z;
    if (o < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, o = -o) : this.copy(t), o >= 1)
      return this._w = a, this._x = s, this._y = i, this._z = r, this;
    const c = 1 - o * o;
    if (c <= Number.EPSILON) {
      const p = 1 - e;
      return this._w = p * a + e * this._w, this._x = p * s + e * this._x, this._y = p * i + e * this._y, this._z = p * r + e * this._z, this.normalize(), this;
    }
    const h = Math.sqrt(c), l = Math.atan2(h, o), u = Math.sin((1 - e) * l) / h, f = Math.sin(e * l) / h;
    return this._w = a * u + this._w * f, this._x = s * u + this._x * f, this._y = i * u + this._y * f, this._z = r * u + this._z * f, this._onChangeCallback(), this;
  }
  slerpQuaternions(t, e, s) {
    return this.copy(t).slerp(e, s);
  }
  random() {
    const t = 2 * Math.PI * Math.random(), e = 2 * Math.PI * Math.random(), s = Math.random(), i = Math.sqrt(1 - s), r = Math.sqrt(s);
    return this.set(
      i * Math.sin(t),
      i * Math.cos(t),
      r * Math.sin(e),
      r * Math.cos(e)
    );
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
  }
  fromArray(t, e = 0) {
    return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
  }
  fromBufferAttribute(t, e) {
    return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class E {
  constructor(t = 0, e = 0, s = 0) {
    E.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = s;
  }
  set(t, e, s) {
    return s === void 0 && (s = this.z), this.x = t, this.y = e, this.z = s, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  multiplyVectors(t, e) {
    return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
  }
  applyEuler(t) {
    return this.applyQuaternion(ja.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(ja.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x, s = this.y, i = this.z, r = t.elements;
    return this.x = r[0] * e + r[3] * s + r[6] * i, this.y = r[1] * e + r[4] * s + r[7] * i, this.z = r[2] * e + r[5] * s + r[8] * i, this;
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x, s = this.y, i = this.z, r = t.elements, a = 1 / (r[3] * e + r[7] * s + r[11] * i + r[15]);
    return this.x = (r[0] * e + r[4] * s + r[8] * i + r[12]) * a, this.y = (r[1] * e + r[5] * s + r[9] * i + r[13]) * a, this.z = (r[2] * e + r[6] * s + r[10] * i + r[14]) * a, this;
  }
  applyQuaternion(t) {
    const e = this.x, s = this.y, i = this.z, r = t.x, a = t.y, o = t.z, c = t.w, h = 2 * (a * i - o * s), l = 2 * (o * e - r * i), u = 2 * (r * s - a * e);
    return this.x = e + c * h + a * u - o * l, this.y = s + c * l + o * h - r * u, this.z = i + c * u + r * l - a * h, this;
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
  }
  transformDirection(t) {
    const e = this.x, s = this.y, i = this.z, r = t.elements;
    return this.x = r[0] * e + r[4] * s + r[8] * i, this.y = r[1] * e + r[5] * s + r[9] * i, this.z = r[2] * e + r[6] * s + r[10] * i, this.normalize();
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
  }
  clamp(t, e) {
    return this.x = Z(this.x, t.x, e.x), this.y = Z(this.y, t.y, e.y), this.z = Z(this.z, t.z, e.z), this;
  }
  clampScalar(t, e) {
    return this.x = Z(this.x, t, e), this.y = Z(this.y, t, e), this.z = Z(this.z, t, e), this;
  }
  clampLength(t, e) {
    const s = this.length();
    return this.divideScalar(s || 1).multiplyScalar(Z(s, t, e));
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
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
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
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
  }
  lerpVectors(t, e, s) {
    return this.x = t.x + (e.x - t.x) * s, this.y = t.y + (e.y - t.y) * s, this.z = t.z + (e.z - t.z) * s, this;
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const s = t.x, i = t.y, r = t.z, a = e.x, o = e.y, c = e.z;
    return this.x = i * c - r * o, this.y = r * a - s * c, this.z = s * o - i * a, this;
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const s = t.dot(this) / e;
    return this.copy(t).multiplyScalar(s);
  }
  projectOnPlane(t) {
    return qi.copy(this).projectOnVector(t), this.sub(qi);
  }
  reflect(t) {
    return this.sub(qi.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const s = this.dot(t) / e;
    return Math.acos(Z(s, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, s = this.y - t.y, i = this.z - t.z;
    return e * e + s * s + i * i;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, s) {
    const i = Math.sin(e) * t;
    return this.x = i * Math.sin(s), this.y = Math.cos(e) * t, this.z = i * Math.cos(s), this;
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, s) {
    return this.x = t * Math.sin(e), this.y = s, this.z = t * Math.cos(e), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(), s = this.setFromMatrixColumn(t, 1).length(), i = this.setFromMatrixColumn(t, 2).length();
    return this.x = e, this.y = s, this.z = i, this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return this.x = t._x, this.y = t._y, this.z = t._z, this;
  }
  setFromColor(t) {
    return this.x = t.r, this.y = t.g, this.z = t.b, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2, e = Math.random() * 2 - 1, s = Math.sqrt(1 - e * e);
    return this.x = s * Math.cos(t), this.y = e, this.z = s * Math.sin(t), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const qi = /* @__PURE__ */ new E(), ja = /* @__PURE__ */ new pn();
class Ot {
  constructor(t = new E(1 / 0, 1 / 0, 1 / 0), e = new E(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, s = t.length; e < s; e += 3)
      this.expandByPoint(ne.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, s = t.count; e < s; e++)
      this.expandByPoint(ne.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, s = t.length; e < s; e++)
      this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const s = ne.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(s), this.max.copy(t).add(s), this;
  }
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const s = t.geometry;
    if (s !== void 0) {
      const r = s.getAttribute("position");
      if (e === !0 && r !== void 0 && t.isInstancedMesh !== !0)
        for (let a = 0, o = r.count; a < o; a++)
          t.isMesh === !0 ? t.getVertexPosition(a, ne) : ne.fromBufferAttribute(r, a), ne.applyMatrix4(t.matrixWorld), this.expandByPoint(ne);
      else
        t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), Es.copy(t.boundingBox)) : (s.boundingBox === null && s.computeBoundingBox(), Es.copy(s.boundingBox)), Es.applyMatrix4(t.matrixWorld), this.union(Es);
    }
    const i = t.children;
    for (let r = 0, a = i.length; r < a; r++)
      this.expandByObject(i[r], e);
    return this;
  }
  containsPoint(t) {
    return t.x >= this.min.x && t.x <= this.max.x && t.y >= this.min.y && t.y <= this.max.y && t.z >= this.min.z && t.z <= this.max.z;
  }
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(t) {
    return t.max.x >= this.min.x && t.min.x <= this.max.x && t.max.y >= this.min.y && t.min.y <= this.max.y && t.max.z >= this.min.z && t.min.z <= this.max.z;
  }
  intersectsSphere(t) {
    return this.clampPoint(t.center, ne), ne.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsPlane(t) {
    let e, s;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, s = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, s = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, s += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, s += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, s += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, s += t.normal.z * this.min.z), e <= -t.constant && s >= -t.constant;
  }
  intersectsTriangle(t) {
    if (this.isEmpty())
      return !1;
    this.getCenter($n), Ms.subVectors(this.max, $n), bn.subVectors(t.a, $n), vn.subVectors(t.b, $n), Sn.subVectors(t.c, $n), Re.subVectors(vn, bn), Be.subVectors(Sn, vn), Qe.subVectors(bn, Sn);
    let e = [
      0,
      -Re.z,
      Re.y,
      0,
      -Be.z,
      Be.y,
      0,
      -Qe.z,
      Qe.y,
      Re.z,
      0,
      -Re.x,
      Be.z,
      0,
      -Be.x,
      Qe.z,
      0,
      -Qe.x,
      -Re.y,
      Re.x,
      0,
      -Be.y,
      Be.x,
      0,
      -Qe.y,
      Qe.x,
      0
    ];
    return !ji(e, bn, vn, Sn, Ms) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !ji(e, bn, vn, Sn, Ms)) ? !1 : (Os.crossVectors(Re, Be), e = [Os.x, Os.y, Os.z], ji(e, bn, vn, Sn, Ms));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, ne).distanceTo(t);
  }
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(ne).length() * 0.5), t;
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty() ? this : (we[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), we[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), we[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), we[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), we[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), we[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), we[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), we[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(we), this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const we = [
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E(),
  /* @__PURE__ */ new E()
], ne = /* @__PURE__ */ new E(), Es = /* @__PURE__ */ new Ot(), bn = /* @__PURE__ */ new E(), vn = /* @__PURE__ */ new E(), Sn = /* @__PURE__ */ new E(), Re = /* @__PURE__ */ new E(), Be = /* @__PURE__ */ new E(), Qe = /* @__PURE__ */ new E(), $n = /* @__PURE__ */ new E(), Ms = /* @__PURE__ */ new E(), Os = /* @__PURE__ */ new E(), tn = /* @__PURE__ */ new E();
function ji(n, t, e, s, i) {
  for (let r = 0, a = n.length - 3; r <= a; r += 3) {
    tn.fromArray(n, r);
    const o = i.x * Math.abs(tn.x) + i.y * Math.abs(tn.y) + i.z * Math.abs(tn.z), c = t.dot(tn), h = e.dot(tn), l = s.dot(tn);
    if (Math.max(-Math.max(c, h, l), Math.min(c, h, l)) > o)
      return !1;
  }
  return !0;
}
const Gl = /* @__PURE__ */ new Ot(), Xn = /* @__PURE__ */ new E(), $i = /* @__PURE__ */ new E();
class ra {
  constructor(t = new E(), e = -1) {
    this.isSphere = !0, this.center = t, this.radius = e;
  }
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  setFromPoints(t, e) {
    const s = this.center;
    e !== void 0 ? s.copy(e) : Gl.setFromPoints(t).getCenter(s);
    let i = 0;
    for (let r = 0, a = t.length; r < a; r++)
      i = Math.max(i, s.distanceToSquared(t[r]));
    return this.radius = Math.sqrt(i), this;
  }
  copy(t) {
    return this.center.copy(t.center), this.radius = t.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const s = this.center.distanceToSquared(t);
    return e.copy(t), s > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
  }
  getBoundingBox(t) {
    return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty())
      return this.center.copy(t), this.radius = 0, this;
    Xn.subVectors(t, this.center);
    const e = Xn.lengthSq();
    if (e > this.radius * this.radius) {
      const s = Math.sqrt(e), i = (s - this.radius) * 0.5;
      this.center.addScaledVector(Xn, i / s), this.radius += i;
    }
    return this;
  }
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === !0 ? this.radius = Math.max(this.radius, t.radius) : ($i.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(Xn.copy(t.center).add($i)), this.expandByPoint(Xn.copy(t.center).sub($i))), this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Ce = /* @__PURE__ */ new E(), Xi = /* @__PURE__ */ new E(), _s = /* @__PURE__ */ new E(), De = /* @__PURE__ */ new E(), Yi = /* @__PURE__ */ new E(), Ls = /* @__PURE__ */ new E(), Zi = /* @__PURE__ */ new E();
class Vc {
  constructor(t = new E(), e = new E(0, 0, -1)) {
    this.origin = t, this.direction = e;
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, Ce)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const s = e.dot(this.direction);
    return s < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, s);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = Ce.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (Ce.copy(this.origin).addScaledVector(this.direction, e), Ce.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, s, i) {
    Xi.copy(t).add(e).multiplyScalar(0.5), _s.copy(e).sub(t).normalize(), De.copy(this.origin).sub(Xi);
    const r = t.distanceTo(e) * 0.5, a = -this.direction.dot(_s), o = De.dot(this.direction), c = -De.dot(_s), h = De.lengthSq(), l = Math.abs(1 - a * a);
    let u, f, p, d;
    if (l > 0)
      if (u = a * c - o, f = a * o - c, d = r * l, u >= 0)
        if (f >= -d)
          if (f <= d) {
            const g = 1 / l;
            u *= g, f *= g, p = u * (u + a * f + 2 * o) + f * (a * u + f + 2 * c) + h;
          } else
            f = r, u = Math.max(0, -(a * f + o)), p = -u * u + f * (f + 2 * c) + h;
        else
          f = -r, u = Math.max(0, -(a * f + o)), p = -u * u + f * (f + 2 * c) + h;
      else
        f <= -d ? (u = Math.max(0, -(-a * r + o)), f = u > 0 ? -r : Math.min(Math.max(-r, -c), r), p = -u * u + f * (f + 2 * c) + h) : f <= d ? (u = 0, f = Math.min(Math.max(-r, -c), r), p = f * (f + 2 * c) + h) : (u = Math.max(0, -(a * r + o)), f = u > 0 ? r : Math.min(Math.max(-r, -c), r), p = -u * u + f * (f + 2 * c) + h);
    else
      f = a > 0 ? -r : r, u = Math.max(0, -(a * f + o)), p = -u * u + f * (f + 2 * c) + h;
    return s && s.copy(this.origin).addScaledVector(this.direction, u), i && i.copy(Xi).addScaledVector(_s, f), p;
  }
  intersectSphere(t, e) {
    Ce.subVectors(t.center, this.origin);
    const s = Ce.dot(this.direction), i = Ce.dot(Ce) - s * s, r = t.radius * t.radius;
    if (i > r) return null;
    const a = Math.sqrt(r - i), o = s - a, c = s + a;
    return c < 0 ? null : o < 0 ? this.at(c, e) : this.at(o, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0)
      return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const s = -(this.origin.dot(t.normal) + t.constant) / e;
    return s >= 0 ? s : null;
  }
  intersectPlane(t, e) {
    const s = this.distanceToPlane(t);
    return s === null ? null : this.at(s, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let s, i, r, a, o, c;
    const h = 1 / this.direction.x, l = 1 / this.direction.y, u = 1 / this.direction.z, f = this.origin;
    return h >= 0 ? (s = (t.min.x - f.x) * h, i = (t.max.x - f.x) * h) : (s = (t.max.x - f.x) * h, i = (t.min.x - f.x) * h), l >= 0 ? (r = (t.min.y - f.y) * l, a = (t.max.y - f.y) * l) : (r = (t.max.y - f.y) * l, a = (t.min.y - f.y) * l), s > a || r > i || ((r > s || isNaN(s)) && (s = r), (a < i || isNaN(i)) && (i = a), u >= 0 ? (o = (t.min.z - f.z) * u, c = (t.max.z - f.z) * u) : (o = (t.max.z - f.z) * u, c = (t.min.z - f.z) * u), s > c || o > i) || ((o > s || s !== s) && (s = o), (c < i || i !== i) && (i = c), i < 0) ? null : this.at(s >= 0 ? s : i, e);
  }
  intersectsBox(t) {
    return this.intersectBox(t, Ce) !== null;
  }
  intersectTriangle(t, e, s, i, r) {
    Yi.subVectors(e, t), Ls.subVectors(s, t), Zi.crossVectors(Yi, Ls);
    let a = this.direction.dot(Zi), o;
    if (a > 0) {
      if (i) return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    De.subVectors(this.origin, t);
    const c = o * this.direction.dot(Ls.crossVectors(De, Ls));
    if (c < 0)
      return null;
    const h = o * this.direction.dot(Yi.cross(De));
    if (h < 0 || c + h > a)
      return null;
    const l = -o * De.dot(Zi);
    return l < 0 ? null : this.at(l / a, r);
  }
  applyMatrix4(t) {
    return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Rt {
  constructor(t, e, s, i, r, a, o, c, h, l, u, f, p, d, g, x) {
    Rt.prototype.isMatrix4 = !0, this.elements = [
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
    ], t !== void 0 && this.set(t, e, s, i, r, a, o, c, h, l, u, f, p, d, g, x);
  }
  set(t, e, s, i, r, a, o, c, h, l, u, f, p, d, g, x) {
    const b = this.elements;
    return b[0] = t, b[4] = e, b[8] = s, b[12] = i, b[1] = r, b[5] = a, b[9] = o, b[13] = c, b[2] = h, b[6] = l, b[10] = u, b[14] = f, b[3] = p, b[7] = d, b[11] = g, b[15] = x, this;
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
    return new Rt().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements, s = t.elements;
    return e[0] = s[0], e[1] = s[1], e[2] = s[2], e[3] = s[3], e[4] = s[4], e[5] = s[5], e[6] = s[6], e[7] = s[7], e[8] = s[8], e[9] = s[9], e[10] = s[10], e[11] = s[11], e[12] = s[12], e[13] = s[13], e[14] = s[14], e[15] = s[15], this;
  }
  copyPosition(t) {
    const e = this.elements, s = t.elements;
    return e[12] = s[12], e[13] = s[13], e[14] = s[14], this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[3],
      e[6],
      0,
      e[1],
      e[4],
      e[7],
      0,
      e[2],
      e[5],
      e[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(t, e, s) {
    return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), s.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(t, e, s) {
    return this.set(
      t.x,
      e.x,
      s.x,
      0,
      t.y,
      e.y,
      s.y,
      0,
      t.z,
      e.z,
      s.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(t) {
    const e = this.elements, s = t.elements, i = 1 / wn.setFromMatrixColumn(t, 0).length(), r = 1 / wn.setFromMatrixColumn(t, 1).length(), a = 1 / wn.setFromMatrixColumn(t, 2).length();
    return e[0] = s[0] * i, e[1] = s[1] * i, e[2] = s[2] * i, e[3] = 0, e[4] = s[4] * r, e[5] = s[5] * r, e[6] = s[6] * r, e[7] = 0, e[8] = s[8] * a, e[9] = s[9] * a, e[10] = s[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const e = this.elements, s = t.x, i = t.y, r = t.z, a = Math.cos(s), o = Math.sin(s), c = Math.cos(i), h = Math.sin(i), l = Math.cos(r), u = Math.sin(r);
    if (t.order === "XYZ") {
      const f = a * l, p = a * u, d = o * l, g = o * u;
      e[0] = c * l, e[4] = -c * u, e[8] = h, e[1] = p + d * h, e[5] = f - g * h, e[9] = -o * c, e[2] = g - f * h, e[6] = d + p * h, e[10] = a * c;
    } else if (t.order === "YXZ") {
      const f = c * l, p = c * u, d = h * l, g = h * u;
      e[0] = f + g * o, e[4] = d * o - p, e[8] = a * h, e[1] = a * u, e[5] = a * l, e[9] = -o, e[2] = p * o - d, e[6] = g + f * o, e[10] = a * c;
    } else if (t.order === "ZXY") {
      const f = c * l, p = c * u, d = h * l, g = h * u;
      e[0] = f - g * o, e[4] = -a * u, e[8] = d + p * o, e[1] = p + d * o, e[5] = a * l, e[9] = g - f * o, e[2] = -a * h, e[6] = o, e[10] = a * c;
    } else if (t.order === "ZYX") {
      const f = a * l, p = a * u, d = o * l, g = o * u;
      e[0] = c * l, e[4] = d * h - p, e[8] = f * h + g, e[1] = c * u, e[5] = g * h + f, e[9] = p * h - d, e[2] = -h, e[6] = o * c, e[10] = a * c;
    } else if (t.order === "YZX") {
      const f = a * c, p = a * h, d = o * c, g = o * h;
      e[0] = c * l, e[4] = g - f * u, e[8] = d * u + p, e[1] = u, e[5] = a * l, e[9] = -o * l, e[2] = -h * l, e[6] = p * u + d, e[10] = f - g * u;
    } else if (t.order === "XZY") {
      const f = a * c, p = a * h, d = o * c, g = o * h;
      e[0] = c * l, e[4] = -u, e[8] = h * l, e[1] = f * u + g, e[5] = a * l, e[9] = p * u - d, e[2] = d * u - p, e[6] = o * l, e[10] = g * u + f;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(Vl, t, Wl);
  }
  lookAt(t, e, s) {
    const i = this.elements;
    return Vt.subVectors(t, e), Vt.lengthSq() === 0 && (Vt.z = 1), Vt.normalize(), Ue.crossVectors(s, Vt), Ue.lengthSq() === 0 && (Math.abs(s.z) === 1 ? Vt.x += 1e-4 : Vt.z += 1e-4, Vt.normalize(), Ue.crossVectors(s, Vt)), Ue.normalize(), Is.crossVectors(Vt, Ue), i[0] = Ue.x, i[4] = Is.x, i[8] = Vt.x, i[1] = Ue.y, i[5] = Is.y, i[9] = Vt.y, i[2] = Ue.z, i[6] = Is.z, i[10] = Vt.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const s = t.elements, i = e.elements, r = this.elements, a = s[0], o = s[4], c = s[8], h = s[12], l = s[1], u = s[5], f = s[9], p = s[13], d = s[2], g = s[6], x = s[10], b = s[14], v = s[3], S = s[7], w = s[11], k = s[15], M = i[0], O = i[4], I = i[8], V = i[12], D = i[1], W = i[5], J = i[9], B = i[13], U = i[2], P = i[6], Q = i[10], gt = i[14], Dt = i[3], St = i[7], it = i[11], j = i[15];
    return r[0] = a * M + o * D + c * U + h * Dt, r[4] = a * O + o * W + c * P + h * St, r[8] = a * I + o * J + c * Q + h * it, r[12] = a * V + o * B + c * gt + h * j, r[1] = l * M + u * D + f * U + p * Dt, r[5] = l * O + u * W + f * P + p * St, r[9] = l * I + u * J + f * Q + p * it, r[13] = l * V + u * B + f * gt + p * j, r[2] = d * M + g * D + x * U + b * Dt, r[6] = d * O + g * W + x * P + b * St, r[10] = d * I + g * J + x * Q + b * it, r[14] = d * V + g * B + x * gt + b * j, r[3] = v * M + S * D + w * U + k * Dt, r[7] = v * O + S * W + w * P + k * St, r[11] = v * I + S * J + w * Q + k * it, r[15] = v * V + S * B + w * gt + k * j, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], s = t[4], i = t[8], r = t[12], a = t[1], o = t[5], c = t[9], h = t[13], l = t[2], u = t[6], f = t[10], p = t[14], d = t[3], g = t[7], x = t[11], b = t[15];
    return d * (+r * c * u - i * h * u - r * o * f + s * h * f + i * o * p - s * c * p) + g * (+e * c * p - e * h * f + r * a * f - i * a * p + i * h * l - r * c * l) + x * (+e * h * u - e * o * p - r * a * u + s * a * p + r * o * l - s * h * l) + b * (-i * o * l - e * c * u + e * o * f + i * a * u - s * a * f + s * c * l);
  }
  transpose() {
    const t = this.elements;
    let e;
    return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
  }
  setPosition(t, e, s) {
    const i = this.elements;
    return t.isVector3 ? (i[12] = t.x, i[13] = t.y, i[14] = t.z) : (i[12] = t, i[13] = e, i[14] = s), this;
  }
  invert() {
    const t = this.elements, e = t[0], s = t[1], i = t[2], r = t[3], a = t[4], o = t[5], c = t[6], h = t[7], l = t[8], u = t[9], f = t[10], p = t[11], d = t[12], g = t[13], x = t[14], b = t[15], v = u * x * h - g * f * h + g * c * p - o * x * p - u * c * b + o * f * b, S = d * f * h - l * x * h - d * c * p + a * x * p + l * c * b - a * f * b, w = l * g * h - d * u * h + d * o * p - a * g * p - l * o * b + a * u * b, k = d * u * c - l * g * c - d * o * f + a * g * f + l * o * x - a * u * x, M = e * v + s * S + i * w + r * k;
    if (M === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const O = 1 / M;
    return t[0] = v * O, t[1] = (g * f * r - u * x * r - g * i * p + s * x * p + u * i * b - s * f * b) * O, t[2] = (o * x * r - g * c * r + g * i * h - s * x * h - o * i * b + s * c * b) * O, t[3] = (u * c * r - o * f * r - u * i * h + s * f * h + o * i * p - s * c * p) * O, t[4] = S * O, t[5] = (l * x * r - d * f * r + d * i * p - e * x * p - l * i * b + e * f * b) * O, t[6] = (d * c * r - a * x * r - d * i * h + e * x * h + a * i * b - e * c * b) * O, t[7] = (a * f * r - l * c * r + l * i * h - e * f * h - a * i * p + e * c * p) * O, t[8] = w * O, t[9] = (d * u * r - l * g * r - d * s * p + e * g * p + l * s * b - e * u * b) * O, t[10] = (a * g * r - d * o * r + d * s * h - e * g * h - a * s * b + e * o * b) * O, t[11] = (l * o * r - a * u * r - l * s * h + e * u * h + a * s * p - e * o * p) * O, t[12] = k * O, t[13] = (l * g * i - d * u * i + d * s * f - e * g * f - l * s * x + e * u * x) * O, t[14] = (d * o * i - a * g * i - d * s * c + e * g * c + a * s * x - e * o * x) * O, t[15] = (a * u * i - l * o * i + l * s * c - e * u * c - a * s * f + e * o * f) * O, this;
  }
  scale(t) {
    const e = this.elements, s = t.x, i = t.y, r = t.z;
    return e[0] *= s, e[4] *= i, e[8] *= r, e[1] *= s, e[5] *= i, e[9] *= r, e[2] *= s, e[6] *= i, e[10] *= r, e[3] *= s, e[7] *= i, e[11] *= r, this;
  }
  getMaxScaleOnAxis() {
    const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], s = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], i = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, s, i));
  }
  makeTranslation(t, e, s) {
    return t.isVector3 ? this.set(
      1,
      0,
      0,
      t.x,
      0,
      1,
      0,
      t.y,
      0,
      0,
      1,
      t.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      t,
      0,
      1,
      0,
      e,
      0,
      0,
      1,
      s,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(t) {
    const e = Math.cos(t), s = Math.sin(t);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      e,
      -s,
      0,
      0,
      s,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t), s = Math.sin(t);
    return this.set(
      e,
      0,
      s,
      0,
      0,
      1,
      0,
      0,
      -s,
      0,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t), s = Math.sin(t);
    return this.set(
      e,
      -s,
      0,
      0,
      s,
      e,
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
  makeRotationAxis(t, e) {
    const s = Math.cos(e), i = Math.sin(e), r = 1 - s, a = t.x, o = t.y, c = t.z, h = r * a, l = r * o;
    return this.set(
      h * a + s,
      h * o - i * c,
      h * c + i * o,
      0,
      h * o + i * c,
      l * o + s,
      l * c - i * a,
      0,
      h * c - i * o,
      l * c + i * a,
      r * c * c + s,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e, s) {
    return this.set(
      t,
      0,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(t, e, s, i, r, a) {
    return this.set(
      1,
      s,
      r,
      0,
      t,
      1,
      a,
      0,
      e,
      i,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(t, e, s) {
    const i = this.elements, r = e._x, a = e._y, o = e._z, c = e._w, h = r + r, l = a + a, u = o + o, f = r * h, p = r * l, d = r * u, g = a * l, x = a * u, b = o * u, v = c * h, S = c * l, w = c * u, k = s.x, M = s.y, O = s.z;
    return i[0] = (1 - (g + b)) * k, i[1] = (p + w) * k, i[2] = (d - S) * k, i[3] = 0, i[4] = (p - w) * M, i[5] = (1 - (f + b)) * M, i[6] = (x + v) * M, i[7] = 0, i[8] = (d + S) * O, i[9] = (x - v) * O, i[10] = (1 - (f + g)) * O, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, this;
  }
  decompose(t, e, s) {
    const i = this.elements;
    let r = wn.set(i[0], i[1], i[2]).length();
    const a = wn.set(i[4], i[5], i[6]).length(), o = wn.set(i[8], i[9], i[10]).length();
    this.determinant() < 0 && (r = -r), t.x = i[12], t.y = i[13], t.z = i[14], se.copy(this);
    const h = 1 / r, l = 1 / a, u = 1 / o;
    return se.elements[0] *= h, se.elements[1] *= h, se.elements[2] *= h, se.elements[4] *= l, se.elements[5] *= l, se.elements[6] *= l, se.elements[8] *= u, se.elements[9] *= u, se.elements[10] *= u, e.setFromRotationMatrix(se), s.x = r, s.y = a, s.z = o, this;
  }
  makePerspective(t, e, s, i, r, a, o = Fs) {
    const c = this.elements, h = 2 * r / (e - t), l = 2 * r / (s - i), u = (e + t) / (e - t), f = (s + i) / (s - i);
    let p, d;
    if (o === Fs)
      p = -(a + r) / (a - r), d = -2 * a * r / (a - r);
    else if (o === Ga)
      p = -a / (a - r), d = -a * r / (a - r);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return c[0] = h, c[4] = 0, c[8] = u, c[12] = 0, c[1] = 0, c[5] = l, c[9] = f, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = p, c[14] = d, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
  }
  makeOrthographic(t, e, s, i, r, a, o = Fs) {
    const c = this.elements, h = 1 / (e - t), l = 1 / (s - i), u = 1 / (a - r), f = (e + t) * h, p = (s + i) * l;
    let d, g;
    if (o === Fs)
      d = (a + r) * u, g = -2 * u;
    else if (o === Ga)
      d = r * u, g = -1 * u;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return c[0] = 2 * h, c[4] = 0, c[8] = 0, c[12] = -f, c[1] = 0, c[5] = 2 * l, c[9] = 0, c[13] = -p, c[2] = 0, c[6] = 0, c[10] = g, c[14] = -d, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
  }
  equals(t) {
    const e = this.elements, s = t.elements;
    for (let i = 0; i < 16; i++)
      if (e[i] !== s[i]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let s = 0; s < 16; s++)
      this.elements[s] = t[s + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const s = this.elements;
    return t[e] = s[0], t[e + 1] = s[1], t[e + 2] = s[2], t[e + 3] = s[3], t[e + 4] = s[4], t[e + 5] = s[5], t[e + 6] = s[6], t[e + 7] = s[7], t[e + 8] = s[8], t[e + 9] = s[9], t[e + 10] = s[10], t[e + 11] = s[11], t[e + 12] = s[12], t[e + 13] = s[13], t[e + 14] = s[14], t[e + 15] = s[15], t;
  }
}
const wn = /* @__PURE__ */ new E(), se = /* @__PURE__ */ new Rt(), Vl = /* @__PURE__ */ new E(0, 0, 0), Wl = /* @__PURE__ */ new E(1, 1, 1), Ue = /* @__PURE__ */ new E(), Is = /* @__PURE__ */ new E(), Vt = /* @__PURE__ */ new E(), $a = /* @__PURE__ */ new Rt(), Xa = /* @__PURE__ */ new pn();
class xs {
  constructor(t = 0, e = 0, s = 0, i = xs.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = t, this._y = e, this._z = s, this._order = i;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  set(t, e, s, i = this._order) {
    return this._x = t, this._y = e, this._z = s, this._order = i, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t, e = this._order, s = !0) {
    const i = t.elements, r = i[0], a = i[4], o = i[8], c = i[1], h = i[5], l = i[9], u = i[2], f = i[6], p = i[10];
    switch (e) {
      case "XYZ":
        this._y = Math.asin(Z(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-l, p), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(f, h), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Z(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(c, h)) : (this._y = Math.atan2(-u, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Z(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._y = Math.atan2(-u, p), this._z = Math.atan2(-a, h)) : (this._y = 0, this._z = Math.atan2(c, r));
        break;
      case "ZYX":
        this._y = Math.asin(-Z(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(f, p), this._z = Math.atan2(c, r)) : (this._x = 0, this._z = Math.atan2(-a, h));
        break;
      case "YZX":
        this._z = Math.asin(Z(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(-l, h), this._y = Math.atan2(-u, r)) : (this._x = 0, this._y = Math.atan2(o, p));
        break;
      case "XZY":
        this._z = Math.asin(-Z(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(f, h), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-l, p), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, s === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, s) {
    return $a.makeRotationFromQuaternion(t), this.setFromRotationMatrix($a, e, s);
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return Xa.setFromEuler(this), this.setFromQuaternion(Xa, t);
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
xs.DEFAULT_ORDER = "XYZ";
class ql {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = (1 << t | 0) >>> 0;
  }
  enable(t) {
    this.mask |= 1 << t | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= 1 << t | 0;
  }
  disable(t) {
    this.mask &= ~(1 << t | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & (1 << t | 0)) !== 0;
  }
}
let jl = 0;
const Ya = /* @__PURE__ */ new E(), Cn = /* @__PURE__ */ new pn(), Te = /* @__PURE__ */ new Rt(), Rs = /* @__PURE__ */ new E(), Yn = /* @__PURE__ */ new E(), $l = /* @__PURE__ */ new E(), Xl = /* @__PURE__ */ new pn(), Za = /* @__PURE__ */ new E(1, 0, 0), Ja = /* @__PURE__ */ new E(0, 1, 0), Ka = /* @__PURE__ */ new E(0, 0, 1), Qa = { type: "added" }, Yl = { type: "removed" }, Tn = { type: "childadded", child: null }, Ji = { type: "childremoved", child: null };
class jt extends _i {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: jl++ }), this.uuid = Vn(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = jt.DEFAULT_UP.clone();
    const t = new E(), e = new xs(), s = new pn(), i = new E(1, 1, 1);
    function r() {
      s.setFromEuler(e, !1);
    }
    function a() {
      e.setFromQuaternion(s, void 0, !1);
    }
    e._onChange(r), s._onChange(a), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: s
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: i
      },
      modelViewMatrix: {
        value: new Rt()
      },
      normalMatrix: {
        value: new Je()
      }
    }), this.matrix = new Rt(), this.matrixWorld = new Rt(), this.matrixAutoUpdate = jt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new ql(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return Cn.setFromAxisAngle(t, e), this.quaternion.multiply(Cn), this;
  }
  rotateOnWorldAxis(t, e) {
    return Cn.setFromAxisAngle(t, e), this.quaternion.premultiply(Cn), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(Za, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(Ja, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(Ka, t);
  }
  translateOnAxis(t, e) {
    return Ya.copy(t).applyQuaternion(this.quaternion), this.position.add(Ya.multiplyScalar(e)), this;
  }
  translateX(t) {
    return this.translateOnAxis(Za, t);
  }
  translateY(t) {
    return this.translateOnAxis(Ja, t);
  }
  translateZ(t) {
    return this.translateOnAxis(Ka, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(Te.copy(this.matrixWorld).invert());
  }
  lookAt(t, e, s) {
    t.isVector3 ? Rs.copy(t) : Rs.set(t, e, s);
    const i = this.parent;
    this.updateWorldMatrix(!0, !1), Yn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Te.lookAt(Yn, Rs, this.up) : Te.lookAt(Rs, Yn, this.up), this.quaternion.setFromRotationMatrix(Te), i && (Te.extractRotation(i.matrixWorld), Cn.setFromRotationMatrix(Te), this.quaternion.premultiply(Cn.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++)
        this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(Qa), Tn.child = t, this.dispatchEvent(Tn), Tn.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let s = 0; s < arguments.length; s++)
        this.remove(arguments[s]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(Yl), Ji.child = t, this.dispatchEvent(Ji), Ji.child = null), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(!0, !1), Te.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), Te.multiply(t.parent.matrixWorld)), t.applyMatrix4(Te), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(!1, !0), t.dispatchEvent(Qa), Tn.child = t, this.dispatchEvent(Tn), Tn.child = null, this;
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let s = 0, i = this.children.length; s < i; s++) {
      const a = this.children[s].getObjectByProperty(t, e);
      if (a !== void 0)
        return a;
    }
  }
  getObjectsByProperty(t, e, s = []) {
    this[t] === e && s.push(this);
    const i = this.children;
    for (let r = 0, a = i.length; r < a; r++)
      i[r].getObjectsByProperty(t, e, s);
    return s;
  }
  getWorldPosition(t) {
    return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Yn, t, $l), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Yn, Xl, t), t;
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {
  }
  traverse(t) {
    t(this);
    const e = this.children;
    for (let s = 0, i = e.length; s < i; s++)
      e[s].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let s = 0, i = e.length; s < i; s++)
      e[s].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, t = !0);
    const e = this.children;
    for (let s = 0, i = e.length; s < i; s++)
      e[s].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, e) {
    const s = this.parent;
    if (t === !0 && s !== null && s.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), e === !0) {
      const i = this.children;
      for (let r = 0, a = i.length; r < a; r++)
        i[r].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string", s = {};
    e && (t = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, s.metadata = {
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
    })), i.maxInstanceCount = this._maxInstanceCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.geometryCount = this._geometryCount, i.matricesTexture = this._matricesTexture.toJSON(t), this._colorsTexture !== null && (i.colorsTexture = this._colorsTexture.toJSON(t)), this.boundingSphere !== null && (i.boundingSphere = {
      center: i.boundingSphere.center.toArray(),
      radius: i.boundingSphere.radius
    }), this.boundingBox !== null && (i.boundingBox = {
      min: i.boundingBox.min.toArray(),
      max: i.boundingBox.max.toArray()
    }));
    function r(o, c) {
      return o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(t)), c.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (i.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      i.geometry = r(t.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const c = o.shapes;
        if (Array.isArray(c))
          for (let h = 0, l = c.length; h < l; h++) {
            const u = c[h];
            r(t.shapes, u);
          }
        else
          r(t.shapes, c);
      }
    }
    if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(t.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let c = 0, h = this.material.length; c < h; c++)
          o.push(r(t.materials, this.material[c]));
        i.material = o;
      } else
        i.material = r(t.materials, this.material);
    if (this.children.length > 0) {
      i.children = [];
      for (let o = 0; o < this.children.length; o++)
        i.children.push(this.children[o].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      i.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const c = this.animations[o];
        i.animations.push(r(t.animations, c));
      }
    }
    if (e) {
      const o = a(t.geometries), c = a(t.materials), h = a(t.textures), l = a(t.images), u = a(t.shapes), f = a(t.skeletons), p = a(t.animations), d = a(t.nodes);
      o.length > 0 && (s.geometries = o), c.length > 0 && (s.materials = c), h.length > 0 && (s.textures = h), l.length > 0 && (s.images = l), u.length > 0 && (s.shapes = u), f.length > 0 && (s.skeletons = f), p.length > 0 && (s.animations = p), d.length > 0 && (s.nodes = d);
    }
    return s.object = i, s;
    function a(o) {
      const c = [];
      for (const h in o) {
        const l = o[h];
        delete l.metadata, c.push(l);
      }
      return c;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === !0)
      for (let s = 0; s < t.children.length; s++) {
        const i = t.children[s];
        this.add(i.clone());
      }
    return this;
  }
}
jt.DEFAULT_UP = /* @__PURE__ */ new E(0, 1, 0);
jt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const ie = /* @__PURE__ */ new E(), ke = /* @__PURE__ */ new E(), Ki = /* @__PURE__ */ new E(), Ae = /* @__PURE__ */ new E(), kn = /* @__PURE__ */ new E(), An = /* @__PURE__ */ new E(), to = /* @__PURE__ */ new E(), Qi = /* @__PURE__ */ new E(), tr = /* @__PURE__ */ new E(), er = /* @__PURE__ */ new E(), nr = /* @__PURE__ */ new ys(), sr = /* @__PURE__ */ new ys(), ir = /* @__PURE__ */ new ys();
class ce {
  constructor(t = new E(), e = new E(), s = new E()) {
    this.a = t, this.b = e, this.c = s;
  }
  static getNormal(t, e, s, i) {
    i.subVectors(s, e), ie.subVectors(t, e), i.cross(ie);
    const r = i.lengthSq();
    return r > 0 ? i.multiplyScalar(1 / Math.sqrt(r)) : i.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(t, e, s, i, r) {
    ie.subVectors(i, e), ke.subVectors(s, e), Ki.subVectors(t, e);
    const a = ie.dot(ie), o = ie.dot(ke), c = ie.dot(Ki), h = ke.dot(ke), l = ke.dot(Ki), u = a * h - o * o;
    if (u === 0)
      return r.set(0, 0, 0), null;
    const f = 1 / u, p = (h * c - o * l) * f, d = (a * l - o * c) * f;
    return r.set(1 - p - d, d, p);
  }
  static containsPoint(t, e, s, i) {
    return this.getBarycoord(t, e, s, i, Ae) === null ? !1 : Ae.x >= 0 && Ae.y >= 0 && Ae.x + Ae.y <= 1;
  }
  static getInterpolation(t, e, s, i, r, a, o, c) {
    return this.getBarycoord(t, e, s, i, Ae) === null ? (c.x = 0, c.y = 0, "z" in c && (c.z = 0), "w" in c && (c.w = 0), null) : (c.setScalar(0), c.addScaledVector(r, Ae.x), c.addScaledVector(a, Ae.y), c.addScaledVector(o, Ae.z), c);
  }
  static getInterpolatedAttribute(t, e, s, i, r, a) {
    return nr.setScalar(0), sr.setScalar(0), ir.setScalar(0), nr.fromBufferAttribute(t, e), sr.fromBufferAttribute(t, s), ir.fromBufferAttribute(t, i), a.setScalar(0), a.addScaledVector(nr, r.x), a.addScaledVector(sr, r.y), a.addScaledVector(ir, r.z), a;
  }
  static isFrontFacing(t, e, s, i) {
    return ie.subVectors(s, e), ke.subVectors(t, e), ie.cross(ke).dot(i) < 0;
  }
  set(t, e, s) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(s), this;
  }
  setFromPointsAndIndices(t, e, s, i) {
    return this.a.copy(t[e]), this.b.copy(t[s]), this.c.copy(t[i]), this;
  }
  setFromAttributeAndIndices(t, e, s, i) {
    return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, s), this.c.fromBufferAttribute(t, i), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return ie.subVectors(this.c, this.b), ke.subVectors(this.a, this.b), ie.cross(ke).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return ce.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return ce.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, s, i, r) {
    return ce.getInterpolation(t, this.a, this.b, this.c, e, s, i, r);
  }
  containsPoint(t) {
    return ce.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return ce.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const s = this.a, i = this.b, r = this.c;
    let a, o;
    kn.subVectors(i, s), An.subVectors(r, s), Qi.subVectors(t, s);
    const c = kn.dot(Qi), h = An.dot(Qi);
    if (c <= 0 && h <= 0)
      return e.copy(s);
    tr.subVectors(t, i);
    const l = kn.dot(tr), u = An.dot(tr);
    if (l >= 0 && u <= l)
      return e.copy(i);
    const f = c * u - l * h;
    if (f <= 0 && c >= 0 && l <= 0)
      return a = c / (c - l), e.copy(s).addScaledVector(kn, a);
    er.subVectors(t, r);
    const p = kn.dot(er), d = An.dot(er);
    if (d >= 0 && p <= d)
      return e.copy(r);
    const g = p * h - c * d;
    if (g <= 0 && h >= 0 && d <= 0)
      return o = h / (h - d), e.copy(s).addScaledVector(An, o);
    const x = l * d - p * u;
    if (x <= 0 && u - l >= 0 && p - d >= 0)
      return to.subVectors(r, i), o = (u - l) / (u - l + (p - d)), e.copy(i).addScaledVector(to, o);
    const b = 1 / (x + g + f);
    return a = g * b, o = f * b, e.copy(s).addScaledVector(kn, a).addScaledVector(An, o);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Wc = {
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
}, Pe = { h: 0, s: 0, l: 0 }, Bs = { h: 0, s: 0, l: 0 };
function rr(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * 6 * (2 / 3 - e) : n;
}
class Wn {
  constructor(t, e, s) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, s);
  }
  set(t, e, s) {
    if (e === void 0 && s === void 0) {
      const i = t;
      i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
    } else
      this.setRGB(t, e, s);
    return this;
  }
  setScalar(t) {
    return this.r = t, this.g = t, this.b = t, this;
  }
  setHex(t, e = re) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, ee.toWorkingColorSpace(this, e), this;
  }
  setRGB(t, e, s, i = ee.workingColorSpace) {
    return this.r = t, this.g = e, this.b = s, ee.toWorkingColorSpace(this, i), this;
  }
  setHSL(t, e, s, i = ee.workingColorSpace) {
    if (t = Bl(t, 1), e = Z(e, 0, 1), s = Z(s, 0, 1), e === 0)
      this.r = this.g = this.b = s;
    else {
      const r = s <= 0.5 ? s * (1 + e) : s + e - s * e, a = 2 * s - r;
      this.r = rr(a, r, t + 1 / 3), this.g = rr(a, r, t), this.b = rr(a, r, t - 1 / 3);
    }
    return ee.toWorkingColorSpace(this, i), this;
  }
  setStyle(t, e = re) {
    function s(r) {
      r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
    }
    let i;
    if (i = /^(\w+)\(([^\)]*)\)/.exec(t)) {
      let r;
      const a = i[1], o = i[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return s(r[4]), this.setRGB(
              Math.min(255, parseInt(r[1], 10)) / 255,
              Math.min(255, parseInt(r[2], 10)) / 255,
              Math.min(255, parseInt(r[3], 10)) / 255,
              e
            );
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return s(r[4]), this.setRGB(
              Math.min(100, parseInt(r[1], 10)) / 100,
              Math.min(100, parseInt(r[2], 10)) / 100,
              Math.min(100, parseInt(r[3], 10)) / 100,
              e
            );
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return s(r[4]), this.setHSL(
              parseFloat(r[1]) / 360,
              parseFloat(r[2]) / 100,
              parseFloat(r[3]) / 100,
              e
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if (i = /^\#([A-Fa-f\d]+)$/.exec(t)) {
      const r = i[1], a = r.length;
      if (a === 3)
        return this.setRGB(
          parseInt(r.charAt(0), 16) / 15,
          parseInt(r.charAt(1), 16) / 15,
          parseInt(r.charAt(2), 16) / 15,
          e
        );
      if (a === 6)
        return this.setHex(parseInt(r, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0)
      return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = re) {
    const s = Wc[t.toLowerCase()];
    return s !== void 0 ? this.setHex(s, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  copySRGBToLinear(t) {
    return this.r = Le(t.r), this.g = Le(t.g), this.b = Le(t.b), this;
  }
  copyLinearToSRGB(t) {
    return this.r = In(t.r), this.g = In(t.g), this.b = In(t.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = re) {
    return ee.fromWorkingColorSpace(Mt.copy(this), t), Math.round(Z(Mt.r * 255, 0, 255)) * 65536 + Math.round(Z(Mt.g * 255, 0, 255)) * 256 + Math.round(Z(Mt.b * 255, 0, 255));
  }
  getHexString(t = re) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = ee.workingColorSpace) {
    ee.fromWorkingColorSpace(Mt.copy(this), e);
    const s = Mt.r, i = Mt.g, r = Mt.b, a = Math.max(s, i, r), o = Math.min(s, i, r);
    let c, h;
    const l = (o + a) / 2;
    if (o === a)
      c = 0, h = 0;
    else {
      const u = a - o;
      switch (h = l <= 0.5 ? u / (a + o) : u / (2 - a - o), a) {
        case s:
          c = (i - r) / u + (i < r ? 6 : 0);
          break;
        case i:
          c = (r - s) / u + 2;
          break;
        case r:
          c = (s - i) / u + 4;
          break;
      }
      c /= 6;
    }
    return t.h = c, t.s = h, t.l = l, t;
  }
  getRGB(t, e = ee.workingColorSpace) {
    return ee.fromWorkingColorSpace(Mt.copy(this), e), t.r = Mt.r, t.g = Mt.g, t.b = Mt.b, t;
  }
  getStyle(t = re) {
    ee.fromWorkingColorSpace(Mt.copy(this), t);
    const e = Mt.r, s = Mt.g, i = Mt.b;
    return t !== re ? `color(${t} ${e.toFixed(3)} ${s.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(s * 255)},${Math.round(i * 255)})`;
  }
  offsetHSL(t, e, s) {
    return this.getHSL(Pe), this.setHSL(Pe.h + t, Pe.s + e, Pe.l + s);
  }
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  addColors(t, e) {
    return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
  }
  addScalar(t) {
    return this.r += t, this.g += t, this.b += t, this;
  }
  sub(t) {
    return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
  }
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  lerp(t, e) {
    return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
  }
  lerpColors(t, e, s) {
    return this.r = t.r + (e.r - t.r) * s, this.g = t.g + (e.g - t.g) * s, this.b = t.b + (e.b - t.b) * s, this;
  }
  lerpHSL(t, e) {
    this.getHSL(Pe), t.getHSL(Bs);
    const s = Gi(Pe.h, Bs.h, e), i = Gi(Pe.s, Bs.s, e), r = Gi(Pe.l, Bs.l, e);
    return this.setHSL(s, i, r), this;
  }
  setFromVector3(t) {
    return this.r = t.x, this.g = t.y, this.b = t.z, this;
  }
  applyMatrix3(t) {
    const e = this.r, s = this.g, i = this.b, r = t.elements;
    return this.r = r[0] * e + r[3] * s + r[6] * i, this.g = r[1] * e + r[4] * s + r[7] * i, this.b = r[2] * e + r[5] * s + r[8] * i, this;
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
  }
  fromBufferAttribute(t, e) {
    return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Mt = /* @__PURE__ */ new Wn();
Wn.NAMES = Wc;
let Zl = 0;
class qc extends _i {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Zl++ }), this.uuid = Vn(), this.name = "", this.type = "Material", this.blending = _a, this.side = Ur, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = Ia, this.blendDst = Ra, this.blendEquation = La, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Wn(0, 0, 0), this.blendAlpha = 0, this.depthFunc = Ba, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = Na, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = yn, this.stencilZFail = yn, this.stencilZPass = yn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
  }
  // onBeforeRender and onBeforeCompile only supported in WebGLRenderer
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const s = t[e];
        if (s === void 0) {
          console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
          continue;
        }
        const i = this[e];
        if (i === void 0) {
          console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
          continue;
        }
        i && i.isColor ? i.set(s) : i && i.isVector3 && s && s.isVector3 ? i.copy(s) : this[e] = s;
      }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = {
      textures: {},
      images: {}
    });
    const s = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    s.uuid = this.uuid, s.type = this.type, this.name !== "" && (s.name = this.name), this.color && this.color.isColor && (s.color = this.color.getHex()), this.roughness !== void 0 && (s.roughness = this.roughness), this.metalness !== void 0 && (s.metalness = this.metalness), this.sheen !== void 0 && (s.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (s.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (s.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (s.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (s.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (s.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (s.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (s.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (s.shininess = this.shininess), this.clearcoat !== void 0 && (s.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (s.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (s.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (s.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (s.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, s.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (s.dispersion = this.dispersion), this.iridescence !== void 0 && (s.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (s.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (s.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (s.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (s.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (s.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (s.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (s.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (s.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (s.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (s.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (s.lightMap = this.lightMap.toJSON(t).uuid, s.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (s.aoMap = this.aoMap.toJSON(t).uuid, s.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (s.bumpMap = this.bumpMap.toJSON(t).uuid, s.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (s.normalMap = this.normalMap.toJSON(t).uuid, s.normalMapType = this.normalMapType, s.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (s.displacementMap = this.displacementMap.toJSON(t).uuid, s.displacementScale = this.displacementScale, s.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (s.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (s.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (s.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (s.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (s.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (s.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (s.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (s.combine = this.combine)), this.envMapRotation !== void 0 && (s.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (s.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (s.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (s.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (s.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (s.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (s.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (s.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (s.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (s.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (s.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (s.size = this.size), this.shadowSide !== null && (s.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (s.sizeAttenuation = this.sizeAttenuation), this.blending !== _a && (s.blending = this.blending), this.side !== Ur && (s.side = this.side), this.vertexColors === !0 && (s.vertexColors = !0), this.opacity < 1 && (s.opacity = this.opacity), this.transparent === !0 && (s.transparent = !0), this.blendSrc !== Ia && (s.blendSrc = this.blendSrc), this.blendDst !== Ra && (s.blendDst = this.blendDst), this.blendEquation !== La && (s.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (s.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (s.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (s.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (s.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (s.blendAlpha = this.blendAlpha), this.depthFunc !== Ba && (s.depthFunc = this.depthFunc), this.depthTest === !1 && (s.depthTest = this.depthTest), this.depthWrite === !1 && (s.depthWrite = this.depthWrite), this.colorWrite === !1 && (s.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (s.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== Na && (s.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (s.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (s.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== yn && (s.stencilFail = this.stencilFail), this.stencilZFail !== yn && (s.stencilZFail = this.stencilZFail), this.stencilZPass !== yn && (s.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (s.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (s.rotation = this.rotation), this.polygonOffset === !0 && (s.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (s.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (s.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (s.linewidth = this.linewidth), this.dashSize !== void 0 && (s.dashSize = this.dashSize), this.gapSize !== void 0 && (s.gapSize = this.gapSize), this.scale !== void 0 && (s.scale = this.scale), this.dithering === !0 && (s.dithering = !0), this.alphaTest > 0 && (s.alphaTest = this.alphaTest), this.alphaHash === !0 && (s.alphaHash = !0), this.alphaToCoverage === !0 && (s.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (s.premultipliedAlpha = !0), this.forceSinglePass === !0 && (s.forceSinglePass = !0), this.wireframe === !0 && (s.wireframe = !0), this.wireframeLinewidth > 1 && (s.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (s.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (s.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (s.flatShading = !0), this.visible === !1 && (s.visible = !1), this.toneMapped === !1 && (s.toneMapped = !1), this.fog === !1 && (s.fog = !1), Object.keys(this.userData).length > 0 && (s.userData = this.userData);
    function i(r) {
      const a = [];
      for (const o in r) {
        const c = r[o];
        delete c.metadata, a.push(c);
      }
      return a;
    }
    if (e) {
      const r = i(t.textures), a = i(t.images);
      r.length > 0 && (s.textures = r), a.length > 0 && (s.images = a);
    }
    return s;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
    const e = t.clippingPlanes;
    let s = null;
    if (e !== null) {
      const i = e.length;
      s = new Array(i);
      for (let r = 0; r !== i; ++r)
        s[r] = e[r].clone();
    }
    return this.clippingPlanes = s, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class jc extends qc {
  constructor(t) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Wn(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new xs(), this.combine = Ml, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const mt = /* @__PURE__ */ new E(), Ds = /* @__PURE__ */ new $();
class he {
  constructor(t, e, s = !1) {
    if (Array.isArray(t))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = s, this.usage = Ha, this.updateRanges = [], this.gpuType = Il, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
  }
  copyAt(t, e, s) {
    t *= this.itemSize, s *= e.itemSize;
    for (let i = 0, r = this.itemSize; i < r; i++)
      this.array[t + i] = e.array[s + i];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, s = this.count; e < s; e++)
        Ds.fromBufferAttribute(this, e), Ds.applyMatrix3(t), this.setXY(e, Ds.x, Ds.y);
    else if (this.itemSize === 3)
      for (let e = 0, s = this.count; e < s; e++)
        mt.fromBufferAttribute(this, e), mt.applyMatrix3(t), this.setXYZ(e, mt.x, mt.y, mt.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, s = this.count; e < s; e++)
      mt.fromBufferAttribute(this, e), mt.applyMatrix4(t), this.setXYZ(e, mt.x, mt.y, mt.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, s = this.count; e < s; e++)
      mt.fromBufferAttribute(this, e), mt.applyNormalMatrix(t), this.setXYZ(e, mt.x, mt.y, mt.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, s = this.count; e < s; e++)
      mt.fromBufferAttribute(this, e), mt.transformDirection(t), this.setXYZ(e, mt.x, mt.y, mt.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let s = this.array[t * this.itemSize + e];
    return this.normalized && (s = jn(s, this.array)), s;
  }
  setComponent(t, e, s) {
    return this.normalized && (s = Nt(s, this.array)), this.array[t * this.itemSize + e] = s, this;
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = jn(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = Nt(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = jn(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = Nt(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = jn(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = Nt(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = jn(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = Nt(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  setXY(t, e, s) {
    return t *= this.itemSize, this.normalized && (e = Nt(e, this.array), s = Nt(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = s, this;
  }
  setXYZ(t, e, s, i) {
    return t *= this.itemSize, this.normalized && (e = Nt(e, this.array), s = Nt(s, this.array), i = Nt(i, this.array)), this.array[t + 0] = e, this.array[t + 1] = s, this.array[t + 2] = i, this;
  }
  setXYZW(t, e, s, i, r) {
    return t *= this.itemSize, this.normalized && (e = Nt(e, this.array), s = Nt(s, this.array), i = Nt(i, this.array), r = Nt(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = s, this.array[t + 2] = i, this.array[t + 3] = r, this;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (t.name = this.name), this.usage !== Ha && (t.usage = this.usage), t;
  }
}
class Jl extends he {
  constructor(t, e, s) {
    super(new Uint16Array(t), e, s);
  }
}
class Kl extends he {
  constructor(t, e, s) {
    super(new Uint32Array(t), e, s);
  }
}
class hn extends he {
  constructor(t, e, s) {
    super(new Float32Array(t), e, s);
  }
}
let Ql = 0;
const Yt = /* @__PURE__ */ new Rt(), ar = /* @__PURE__ */ new jt(), Fn = /* @__PURE__ */ new E(), Wt = /* @__PURE__ */ new Ot(), Zn = /* @__PURE__ */ new Ot(), vt = /* @__PURE__ */ new E();
class Ht extends _i {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Ql++ }), this.uuid = Vn(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (Dl(t) ? Kl : Jl)(t, 1) : this.index = t, this;
  }
  setIndirect(t) {
    return this.indirect = t, this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return this.attributes[t] = e, this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, s = 0) {
    this.groups.push({
      start: t,
      count: e,
      materialIndex: s
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    this.drawRange.start = t, this.drawRange.count = e;
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = !0);
    const s = this.attributes.normal;
    if (s !== void 0) {
      const r = new Je().getNormalMatrix(t);
      s.applyNormalMatrix(r), s.needsUpdate = !0;
    }
    const i = this.attributes.tangent;
    return i !== void 0 && (i.transformDirection(t), i.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(t) {
    return Yt.makeRotationFromQuaternion(t), this.applyMatrix4(Yt), this;
  }
  rotateX(t) {
    return Yt.makeRotationX(t), this.applyMatrix4(Yt), this;
  }
  rotateY(t) {
    return Yt.makeRotationY(t), this.applyMatrix4(Yt), this;
  }
  rotateZ(t) {
    return Yt.makeRotationZ(t), this.applyMatrix4(Yt), this;
  }
  translate(t, e, s) {
    return Yt.makeTranslation(t, e, s), this.applyMatrix4(Yt), this;
  }
  scale(t, e, s) {
    return Yt.makeScale(t, e, s), this.applyMatrix4(Yt), this;
  }
  lookAt(t) {
    return ar.lookAt(t), ar.updateMatrix(), this.applyMatrix4(ar.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(Fn).negate(), this.translate(Fn.x, Fn.y, Fn.z), this;
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const s = [];
      for (let i = 0, r = t.length; i < r; i++) {
        const a = t[i];
        s.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new hn(s, 3));
    } else {
      const s = Math.min(t.length, e.count);
      for (let i = 0; i < s; i++) {
        const r = t[i];
        e.setXYZ(i, r.x, r.y, r.z || 0);
      }
      t.length > e.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), e.needsUpdate = !0;
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Ot());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new E(-1 / 0, -1 / 0, -1 / 0),
        new E(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e)
        for (let s = 0, i = e.length; s < i; s++) {
          const r = e[s];
          Wt.setFromBufferAttribute(r), this.morphTargetsRelative ? (vt.addVectors(this.boundingBox.min, Wt.min), this.boundingBox.expandByPoint(vt), vt.addVectors(this.boundingBox.max, Wt.max), this.boundingBox.expandByPoint(vt)) : (this.boundingBox.expandByPoint(Wt.min), this.boundingBox.expandByPoint(Wt.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new ra());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new E(), 1 / 0);
      return;
    }
    if (t) {
      const s = this.boundingSphere.center;
      if (Wt.setFromBufferAttribute(t), e)
        for (let r = 0, a = e.length; r < a; r++) {
          const o = e[r];
          Zn.setFromBufferAttribute(o), this.morphTargetsRelative ? (vt.addVectors(Wt.min, Zn.min), Wt.expandByPoint(vt), vt.addVectors(Wt.max, Zn.max), Wt.expandByPoint(vt)) : (Wt.expandByPoint(Zn.min), Wt.expandByPoint(Zn.max));
        }
      Wt.getCenter(s);
      let i = 0;
      for (let r = 0, a = t.count; r < a; r++)
        vt.fromBufferAttribute(t, r), i = Math.max(i, s.distanceToSquared(vt));
      if (e)
        for (let r = 0, a = e.length; r < a; r++) {
          const o = e[r], c = this.morphTargetsRelative;
          for (let h = 0, l = o.count; h < l; h++)
            vt.fromBufferAttribute(o, h), c && (Fn.fromBufferAttribute(t, h), vt.add(Fn)), i = Math.max(i, s.distanceToSquared(vt));
        }
      this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const t = this.index, e = this.attributes;
    if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const s = e.position, i = e.normal, r = e.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new he(new Float32Array(4 * s.count), 4));
    const a = this.getAttribute("tangent"), o = [], c = [];
    for (let I = 0; I < s.count; I++)
      o[I] = new E(), c[I] = new E();
    const h = new E(), l = new E(), u = new E(), f = new $(), p = new $(), d = new $(), g = new E(), x = new E();
    function b(I, V, D) {
      h.fromBufferAttribute(s, I), l.fromBufferAttribute(s, V), u.fromBufferAttribute(s, D), f.fromBufferAttribute(r, I), p.fromBufferAttribute(r, V), d.fromBufferAttribute(r, D), l.sub(h), u.sub(h), p.sub(f), d.sub(f);
      const W = 1 / (p.x * d.y - d.x * p.y);
      isFinite(W) && (g.copy(l).multiplyScalar(d.y).addScaledVector(u, -p.y).multiplyScalar(W), x.copy(u).multiplyScalar(p.x).addScaledVector(l, -d.x).multiplyScalar(W), o[I].add(g), o[V].add(g), o[D].add(g), c[I].add(x), c[V].add(x), c[D].add(x));
    }
    let v = this.groups;
    v.length === 0 && (v = [{
      start: 0,
      count: t.count
    }]);
    for (let I = 0, V = v.length; I < V; ++I) {
      const D = v[I], W = D.start, J = D.count;
      for (let B = W, U = W + J; B < U; B += 3)
        b(
          t.getX(B + 0),
          t.getX(B + 1),
          t.getX(B + 2)
        );
    }
    const S = new E(), w = new E(), k = new E(), M = new E();
    function O(I) {
      k.fromBufferAttribute(i, I), M.copy(k);
      const V = o[I];
      S.copy(V), S.sub(k.multiplyScalar(k.dot(V))).normalize(), w.crossVectors(M, V);
      const W = w.dot(c[I]) < 0 ? -1 : 1;
      a.setXYZW(I, S.x, S.y, S.z, W);
    }
    for (let I = 0, V = v.length; I < V; ++I) {
      const D = v[I], W = D.start, J = D.count;
      for (let B = W, U = W + J; B < U; B += 3)
        O(t.getX(B + 0)), O(t.getX(B + 1)), O(t.getX(B + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let s = this.getAttribute("normal");
      if (s === void 0)
        s = new he(new Float32Array(e.count * 3), 3), this.setAttribute("normal", s);
      else
        for (let f = 0, p = s.count; f < p; f++)
          s.setXYZ(f, 0, 0, 0);
      const i = new E(), r = new E(), a = new E(), o = new E(), c = new E(), h = new E(), l = new E(), u = new E();
      if (t)
        for (let f = 0, p = t.count; f < p; f += 3) {
          const d = t.getX(f + 0), g = t.getX(f + 1), x = t.getX(f + 2);
          i.fromBufferAttribute(e, d), r.fromBufferAttribute(e, g), a.fromBufferAttribute(e, x), l.subVectors(a, r), u.subVectors(i, r), l.cross(u), o.fromBufferAttribute(s, d), c.fromBufferAttribute(s, g), h.fromBufferAttribute(s, x), o.add(l), c.add(l), h.add(l), s.setXYZ(d, o.x, o.y, o.z), s.setXYZ(g, c.x, c.y, c.z), s.setXYZ(x, h.x, h.y, h.z);
        }
      else
        for (let f = 0, p = e.count; f < p; f += 3)
          i.fromBufferAttribute(e, f + 0), r.fromBufferAttribute(e, f + 1), a.fromBufferAttribute(e, f + 2), l.subVectors(a, r), u.subVectors(i, r), l.cross(u), s.setXYZ(f + 0, l.x, l.y, l.z), s.setXYZ(f + 1, l.x, l.y, l.z), s.setXYZ(f + 2, l.x, l.y, l.z);
      this.normalizeNormals(), s.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, s = t.count; e < s; e++)
      vt.fromBufferAttribute(t, e), vt.normalize(), t.setXYZ(e, vt.x, vt.y, vt.z);
  }
  toNonIndexed() {
    function t(o, c) {
      const h = o.array, l = o.itemSize, u = o.normalized, f = new h.constructor(c.length * l);
      let p = 0, d = 0;
      for (let g = 0, x = c.length; g < x; g++) {
        o.isInterleavedBufferAttribute ? p = c[g] * o.data.stride + o.offset : p = c[g] * l;
        for (let b = 0; b < l; b++)
          f[d++] = h[p++];
      }
      return new he(f, l, u);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new Ht(), s = this.index.array, i = this.attributes;
    for (const o in i) {
      const c = i[o], h = t(c, s);
      e.setAttribute(o, h);
    }
    const r = this.morphAttributes;
    for (const o in r) {
      const c = [], h = r[o];
      for (let l = 0, u = h.length; l < u; l++) {
        const f = h[l], p = t(f, s);
        c.push(p);
      }
      e.morphAttributes[o] = c;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, c = a.length; o < c; o++) {
      const h = a[o];
      e.addGroup(h.start, h.count, h.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
      const c = this.parameters;
      for (const h in c)
        c[h] !== void 0 && (t[h] = c[h]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null && (t.data.index = {
      type: e.array.constructor.name,
      array: Array.prototype.slice.call(e.array)
    });
    const s = this.attributes;
    for (const c in s) {
      const h = s[c];
      t.data.attributes[c] = h.toJSON(t.data);
    }
    const i = {};
    let r = !1;
    for (const c in this.morphAttributes) {
      const h = this.morphAttributes[c], l = [];
      for (let u = 0, f = h.length; u < f; u++) {
        const p = h[u];
        l.push(p.toJSON(t.data));
      }
      l.length > 0 && (i[c] = l, r = !0);
    }
    r && (t.data.morphAttributes = i, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (t.data.boundingSphere = {
      center: o.center.toArray(),
      radius: o.radius
    }), t;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const e = {};
    this.name = t.name;
    const s = t.index;
    s !== null && this.setIndex(s.clone(e));
    const i = t.attributes;
    for (const h in i) {
      const l = i[h];
      this.setAttribute(h, l.clone(e));
    }
    const r = t.morphAttributes;
    for (const h in r) {
      const l = [], u = r[h];
      for (let f = 0, p = u.length; f < p; f++)
        l.push(u[f].clone(e));
      this.morphAttributes[h] = l;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let h = 0, l = a.length; h < l; h++) {
      const u = a[h];
      this.addGroup(u.start, u.count, u.materialIndex);
    }
    const o = t.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const c = t.boundingSphere;
    return c !== null && (this.boundingSphere = c.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const eo = /* @__PURE__ */ new Rt(), en = /* @__PURE__ */ new Vc(), Us = /* @__PURE__ */ new ra(), no = /* @__PURE__ */ new E(), Ps = /* @__PURE__ */ new E(), zs = /* @__PURE__ */ new E(), Ns = /* @__PURE__ */ new E(), or = /* @__PURE__ */ new E(), Hs = /* @__PURE__ */ new E(), so = /* @__PURE__ */ new E(), Gs = /* @__PURE__ */ new E();
class os extends jt {
  constructor(t = new Ht(), e = new jc()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, s = Object.keys(e);
    if (s.length > 0) {
      const i = e[s[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const s = this.geometry, i = s.attributes.position, r = s.morphAttributes.position, a = s.morphTargetsRelative;
    e.fromBufferAttribute(i, t);
    const o = this.morphTargetInfluences;
    if (r && o) {
      Hs.set(0, 0, 0);
      for (let c = 0, h = r.length; c < h; c++) {
        const l = o[c], u = r[c];
        l !== 0 && (or.fromBufferAttribute(u, t), a ? Hs.addScaledVector(or, l) : Hs.addScaledVector(or.sub(e), l));
      }
      e.add(Hs);
    }
    return e;
  }
  raycast(t, e) {
    const s = this.geometry, i = this.material, r = this.matrixWorld;
    i !== void 0 && (s.boundingSphere === null && s.computeBoundingSphere(), Us.copy(s.boundingSphere), Us.applyMatrix4(r), en.copy(t.ray).recast(t.near), !(Us.containsPoint(en.origin) === !1 && (en.intersectSphere(Us, no) === null || en.origin.distanceToSquared(no) > (t.far - t.near) ** 2)) && (eo.copy(r).invert(), en.copy(t.ray).applyMatrix4(eo), !(s.boundingBox !== null && en.intersectsBox(s.boundingBox) === !1) && this._computeIntersections(t, e, en)));
  }
  _computeIntersections(t, e, s) {
    let i;
    const r = this.geometry, a = this.material, o = r.index, c = r.attributes.position, h = r.attributes.uv, l = r.attributes.uv1, u = r.attributes.normal, f = r.groups, p = r.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let d = 0, g = f.length; d < g; d++) {
          const x = f[d], b = a[x.materialIndex], v = Math.max(x.start, p.start), S = Math.min(o.count, Math.min(x.start + x.count, p.start + p.count));
          for (let w = v, k = S; w < k; w += 3) {
            const M = o.getX(w), O = o.getX(w + 1), I = o.getX(w + 2);
            i = Vs(this, b, t, s, h, l, u, M, O, I), i && (i.faceIndex = Math.floor(w / 3), i.face.materialIndex = x.materialIndex, e.push(i));
          }
        }
      else {
        const d = Math.max(0, p.start), g = Math.min(o.count, p.start + p.count);
        for (let x = d, b = g; x < b; x += 3) {
          const v = o.getX(x), S = o.getX(x + 1), w = o.getX(x + 2);
          i = Vs(this, a, t, s, h, l, u, v, S, w), i && (i.faceIndex = Math.floor(x / 3), e.push(i));
        }
      }
    else if (c !== void 0)
      if (Array.isArray(a))
        for (let d = 0, g = f.length; d < g; d++) {
          const x = f[d], b = a[x.materialIndex], v = Math.max(x.start, p.start), S = Math.min(c.count, Math.min(x.start + x.count, p.start + p.count));
          for (let w = v, k = S; w < k; w += 3) {
            const M = w, O = w + 1, I = w + 2;
            i = Vs(this, b, t, s, h, l, u, M, O, I), i && (i.faceIndex = Math.floor(w / 3), i.face.materialIndex = x.materialIndex, e.push(i));
          }
        }
      else {
        const d = Math.max(0, p.start), g = Math.min(c.count, p.start + p.count);
        for (let x = d, b = g; x < b; x += 3) {
          const v = x, S = x + 1, w = x + 2;
          i = Vs(this, a, t, s, h, l, u, v, S, w), i && (i.faceIndex = Math.floor(x / 3), e.push(i));
        }
      }
  }
}
function tu(n, t, e, s, i, r, a, o) {
  let c;
  if (t.side === El ? c = s.intersectTriangle(a, r, i, !0, o) : c = s.intersectTriangle(i, r, a, t.side === Ur, o), c === null) return null;
  Gs.copy(o), Gs.applyMatrix4(n.matrixWorld);
  const h = e.ray.origin.distanceTo(Gs);
  return h < e.near || h > e.far ? null : {
    distance: h,
    point: Gs.clone(),
    object: n
  };
}
function Vs(n, t, e, s, i, r, a, o, c, h) {
  n.getVertexPosition(o, Ps), n.getVertexPosition(c, zs), n.getVertexPosition(h, Ns);
  const l = tu(n, t, e, s, Ps, zs, Ns, so);
  if (l) {
    const u = new E();
    ce.getBarycoord(so, Ps, zs, Ns, u), i && (l.uv = ce.getInterpolatedAttribute(i, o, c, h, u, new $())), r && (l.uv1 = ce.getInterpolatedAttribute(r, o, c, h, u, new $())), a && (l.normal = ce.getInterpolatedAttribute(a, o, c, h, u, new E()), l.normal.dot(s.direction) > 0 && l.normal.multiplyScalar(-1));
    const f = {
      a: o,
      b: c,
      c: h,
      normal: new E(),
      materialIndex: 0
    };
    ce.getNormal(Ps, zs, Ns, f.normal), l.face = f, l.barycoord = u;
  }
  return l;
}
class $c extends qc {
  constructor(t) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Wn(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.linewidth = t.linewidth, this.linecap = t.linecap, this.linejoin = t.linejoin, this.fog = t.fog, this;
  }
}
const ui = /* @__PURE__ */ new E(), fi = /* @__PURE__ */ new E(), io = /* @__PURE__ */ new Rt(), Jn = /* @__PURE__ */ new Vc(), Ws = /* @__PURE__ */ new ra(), cr = /* @__PURE__ */ new E(), ro = /* @__PURE__ */ new E();
class pi extends jt {
  constructor(t = new Ht(), e = new $c()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, s = [0];
      for (let i = 1, r = e.count; i < r; i++)
        ui.fromBufferAttribute(e, i - 1), fi.fromBufferAttribute(e, i), s[i] = s[i - 1], s[i] += ui.distanceTo(fi);
      t.setAttribute("lineDistance", new hn(s, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(t, e) {
    const s = this.geometry, i = this.matrixWorld, r = t.params.Line.threshold, a = s.drawRange;
    if (s.boundingSphere === null && s.computeBoundingSphere(), Ws.copy(s.boundingSphere), Ws.applyMatrix4(i), Ws.radius += r, t.ray.intersectsSphere(Ws) === !1) return;
    io.copy(i).invert(), Jn.copy(t.ray).applyMatrix4(io);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, h = this.isLineSegments ? 2 : 1, l = s.index, f = s.attributes.position;
    if (l !== null) {
      const p = Math.max(0, a.start), d = Math.min(l.count, a.start + a.count);
      for (let g = p, x = d - 1; g < x; g += h) {
        const b = l.getX(g), v = l.getX(g + 1), S = qs(this, t, Jn, c, b, v);
        S && e.push(S);
      }
      if (this.isLineLoop) {
        const g = l.getX(d - 1), x = l.getX(p), b = qs(this, t, Jn, c, g, x);
        b && e.push(b);
      }
    } else {
      const p = Math.max(0, a.start), d = Math.min(f.count, a.start + a.count);
      for (let g = p, x = d - 1; g < x; g += h) {
        const b = qs(this, t, Jn, c, g, g + 1);
        b && e.push(b);
      }
      if (this.isLineLoop) {
        const g = qs(this, t, Jn, c, d - 1, p);
        g && e.push(g);
      }
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, s = Object.keys(e);
    if (s.length > 0) {
      const i = e[s[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function qs(n, t, e, s, i, r) {
  const a = n.geometry.attributes.position;
  if (ui.fromBufferAttribute(a, i), fi.fromBufferAttribute(a, r), e.distanceSqToSegment(ui, fi, cr, ro) > s) return;
  cr.applyMatrix4(n.matrixWorld);
  const c = t.ray.origin.distanceTo(cr);
  if (!(c < t.near || c > t.far))
    return {
      distance: c,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: ro.clone().applyMatrix4(n.matrixWorld),
      index: i,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: n
    };
}
const ao = /* @__PURE__ */ new E(), oo = /* @__PURE__ */ new E();
class eu extends pi {
  constructor(t, e) {
    super(t, e), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, s = [];
      for (let i = 0, r = e.count; i < r; i += 2)
        ao.fromBufferAttribute(e, i), oo.fromBufferAttribute(e, i + 1), s[i] = i === 0 ? 0 : s[i - 1], s[i + 1] = s[i] + ao.distanceTo(oo);
      t.setAttribute("lineDistance", new hn(s, 1));
    } else
      console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class co extends jt {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
class ve {
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
  getPointAt(t, e) {
    const s = this.getUtoTmapping(t);
    return this.getPoint(s, e);
  }
  // Get sequence of points using getPoint( t )
  getPoints(t = 5) {
    const e = [];
    for (let s = 0; s <= t; s++)
      e.push(this.getPoint(s / t));
    return e;
  }
  // Get sequence of points using getPointAt( u )
  getSpacedPoints(t = 5) {
    const e = [];
    for (let s = 0; s <= t; s++)
      e.push(this.getPointAt(s / t));
    return e;
  }
  // Get total curve arc length
  getLength() {
    const t = this.getLengths();
    return t[t.length - 1];
  }
  // Get list of cumulative segment lengths
  getLengths(t = this.arcLengthDivisions) {
    if (this.cacheArcLengths && this.cacheArcLengths.length === t + 1 && !this.needsUpdate)
      return this.cacheArcLengths;
    this.needsUpdate = !1;
    const e = [];
    let s, i = this.getPoint(0), r = 0;
    e.push(0);
    for (let a = 1; a <= t; a++)
      s = this.getPoint(a / t), r += s.distanceTo(i), e.push(r), i = s;
    return this.cacheArcLengths = e, e;
  }
  updateArcLengths() {
    this.needsUpdate = !0, this.getLengths();
  }
  // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant
  getUtoTmapping(t, e) {
    const s = this.getLengths();
    let i = 0;
    const r = s.length;
    let a;
    e ? a = e : a = t * s[r - 1];
    let o = 0, c = r - 1, h;
    for (; o <= c; )
      if (i = Math.floor(o + (c - o) / 2), h = s[i] - a, h < 0)
        o = i + 1;
      else if (h > 0)
        c = i - 1;
      else {
        c = i;
        break;
      }
    if (i = c, s[i] === a)
      return i / (r - 1);
    const l = s[i], f = s[i + 1] - l, p = (a - l) / f;
    return (i + p) / (r - 1);
  }
  // Returns a unit vector tangent at t
  // In case any sub curve does not implement its tangent derivation,
  // 2 points a small delta apart will be used to find its gradient
  // which seems to give a reasonable approximation
  getTangent(t, e) {
    let i = t - 1e-4, r = t + 1e-4;
    i < 0 && (i = 0), r > 1 && (r = 1);
    const a = this.getPoint(i), o = this.getPoint(r), c = e || (a.isVector2 ? new $() : new E());
    return c.copy(o).sub(a).normalize(), c;
  }
  getTangentAt(t, e) {
    const s = this.getUtoTmapping(t);
    return this.getTangent(s, e);
  }
  computeFrenetFrames(t, e) {
    const s = new E(), i = [], r = [], a = [], o = new E(), c = new Rt();
    for (let p = 0; p <= t; p++) {
      const d = p / t;
      i[p] = this.getTangentAt(d, new E());
    }
    r[0] = new E(), a[0] = new E();
    let h = Number.MAX_VALUE;
    const l = Math.abs(i[0].x), u = Math.abs(i[0].y), f = Math.abs(i[0].z);
    l <= h && (h = l, s.set(1, 0, 0)), u <= h && (h = u, s.set(0, 1, 0)), f <= h && s.set(0, 0, 1), o.crossVectors(i[0], s).normalize(), r[0].crossVectors(i[0], o), a[0].crossVectors(i[0], r[0]);
    for (let p = 1; p <= t; p++) {
      if (r[p] = r[p - 1].clone(), a[p] = a[p - 1].clone(), o.crossVectors(i[p - 1], i[p]), o.length() > Number.EPSILON) {
        o.normalize();
        const d = Math.acos(Z(i[p - 1].dot(i[p]), -1, 1));
        r[p].applyMatrix4(c.makeRotationAxis(o, d));
      }
      a[p].crossVectors(i[p], r[p]);
    }
    if (e === !0) {
      let p = Math.acos(Z(r[0].dot(r[t]), -1, 1));
      p /= t, i[0].dot(o.crossVectors(r[0], r[t])) > 0 && (p = -p);
      for (let d = 1; d <= t; d++)
        r[d].applyMatrix4(c.makeRotationAxis(i[d], p * d)), a[d].crossVectors(i[d], r[d]);
    }
    return {
      tangents: i,
      normals: r,
      binormals: a
    };
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "Curve",
        generator: "Curve.toJSON"
      }
    };
    return t.arcLengthDivisions = this.arcLengthDivisions, t.type = this.type, t;
  }
  fromJSON(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
}
class cs extends ve {
  constructor(t = 0, e = 0, s = 1, i = 1, r = 0, a = Math.PI * 2, o = !1, c = 0) {
    super(), this.isEllipseCurve = !0, this.type = "EllipseCurve", this.aX = t, this.aY = e, this.xRadius = s, this.yRadius = i, this.aStartAngle = r, this.aEndAngle = a, this.aClockwise = o, this.aRotation = c;
  }
  getPoint(t, e = new $()) {
    const s = e, i = Math.PI * 2;
    let r = this.aEndAngle - this.aStartAngle;
    const a = Math.abs(r) < Number.EPSILON;
    for (; r < 0; ) r += i;
    for (; r > i; ) r -= i;
    r < Number.EPSILON && (a ? r = 0 : r = i), this.aClockwise === !0 && !a && (r === i ? r = -i : r = r - i);
    const o = this.aStartAngle + t * r;
    let c = this.aX + this.xRadius * Math.cos(o), h = this.aY + this.yRadius * Math.sin(o);
    if (this.aRotation !== 0) {
      const l = Math.cos(this.aRotation), u = Math.sin(this.aRotation), f = c - this.aX, p = h - this.aY;
      c = f * l - p * u + this.aX, h = f * u + p * l + this.aY;
    }
    return s.set(c, h);
  }
  copy(t) {
    return super.copy(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.aX = this.aX, t.aY = this.aY, t.xRadius = this.xRadius, t.yRadius = this.yRadius, t.aStartAngle = this.aStartAngle, t.aEndAngle = this.aEndAngle, t.aClockwise = this.aClockwise, t.aRotation = this.aRotation, t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
}
class nu extends cs {
  constructor(t, e, s, i, r, a) {
    super(t, e, s, s, i, r, a), this.isArcCurve = !0, this.type = "ArcCurve";
  }
}
function aa() {
  let n = 0, t = 0, e = 0, s = 0;
  function i(r, a, o, c) {
    n = r, t = o, e = -3 * r + 3 * a - 2 * o - c, s = 2 * r - 2 * a + o + c;
  }
  return {
    initCatmullRom: function(r, a, o, c, h) {
      i(a, o, h * (o - r), h * (c - a));
    },
    initNonuniformCatmullRom: function(r, a, o, c, h, l, u) {
      let f = (a - r) / h - (o - r) / (h + l) + (o - a) / l, p = (o - a) / l - (c - a) / (l + u) + (c - o) / u;
      f *= l, p *= l, i(a, o, f, p);
    },
    calc: function(r) {
      const a = r * r, o = a * r;
      return n + t * r + e * a + s * o;
    }
  };
}
const js = /* @__PURE__ */ new E(), hr = /* @__PURE__ */ new aa(), lr = /* @__PURE__ */ new aa(), ur = /* @__PURE__ */ new aa();
class su extends ve {
  constructor(t = [], e = !1, s = "centripetal", i = 0.5) {
    super(), this.isCatmullRomCurve3 = !0, this.type = "CatmullRomCurve3", this.points = t, this.closed = e, this.curveType = s, this.tension = i;
  }
  getPoint(t, e = new E()) {
    const s = e, i = this.points, r = i.length, a = (r - (this.closed ? 0 : 1)) * t;
    let o = Math.floor(a), c = a - o;
    this.closed ? o += o > 0 ? 0 : (Math.floor(Math.abs(o) / r) + 1) * r : c === 0 && o === r - 1 && (o = r - 2, c = 1);
    let h, l;
    this.closed || o > 0 ? h = i[(o - 1) % r] : (js.subVectors(i[0], i[1]).add(i[0]), h = js);
    const u = i[o % r], f = i[(o + 1) % r];
    if (this.closed || o + 2 < r ? l = i[(o + 2) % r] : (js.subVectors(i[r - 1], i[r - 2]).add(i[r - 1]), l = js), this.curveType === "centripetal" || this.curveType === "chordal") {
      const p = this.curveType === "chordal" ? 0.5 : 0.25;
      let d = Math.pow(h.distanceToSquared(u), p), g = Math.pow(u.distanceToSquared(f), p), x = Math.pow(f.distanceToSquared(l), p);
      g < 1e-4 && (g = 1), d < 1e-4 && (d = g), x < 1e-4 && (x = g), hr.initNonuniformCatmullRom(h.x, u.x, f.x, l.x, d, g, x), lr.initNonuniformCatmullRom(h.y, u.y, f.y, l.y, d, g, x), ur.initNonuniformCatmullRom(h.z, u.z, f.z, l.z, d, g, x);
    } else this.curveType === "catmullrom" && (hr.initCatmullRom(h.x, u.x, f.x, l.x, this.tension), lr.initCatmullRom(h.y, u.y, f.y, l.y, this.tension), ur.initCatmullRom(h.z, u.z, f.z, l.z, this.tension));
    return s.set(
      hr.calc(c),
      lr.calc(c),
      ur.calc(c)
    ), s;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, s = t.points.length; e < s; e++) {
      const i = t.points[e];
      this.points.push(i.clone());
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, s = this.points.length; e < s; e++) {
      const i = this.points[e];
      t.points.push(i.toArray());
    }
    return t.closed = this.closed, t.curveType = this.curveType, t.tension = this.tension, t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, s = t.points.length; e < s; e++) {
      const i = t.points[e];
      this.points.push(new E().fromArray(i));
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
}
function ho(n, t, e, s, i) {
  const r = (s - t) * 0.5, a = (i - e) * 0.5, o = n * n, c = n * o;
  return (2 * e - 2 * s + r + a) * c + (-3 * e + 3 * s - 2 * r - a) * o + r * n + e;
}
function iu(n, t) {
  const e = 1 - n;
  return e * e * t;
}
function ru(n, t) {
  return 2 * (1 - n) * n * t;
}
function au(n, t) {
  return n * n * t;
}
function es(n, t, e, s) {
  return iu(n, t) + ru(n, e) + au(n, s);
}
function ou(n, t) {
  const e = 1 - n;
  return e * e * e * t;
}
function cu(n, t) {
  const e = 1 - n;
  return 3 * e * e * n * t;
}
function hu(n, t) {
  return 3 * (1 - n) * n * n * t;
}
function lu(n, t) {
  return n * n * n * t;
}
function ns(n, t, e, s, i) {
  return ou(n, t) + cu(n, e) + hu(n, s) + lu(n, i);
}
class di extends ve {
  constructor(t = new $(), e = new $(), s = new $(), i = new $()) {
    super(), this.isCubicBezierCurve = !0, this.type = "CubicBezierCurve", this.v0 = t, this.v1 = e, this.v2 = s, this.v3 = i;
  }
  getPoint(t, e = new $()) {
    const s = e, i = this.v0, r = this.v1, a = this.v2, o = this.v3;
    return s.set(
      ns(t, i.x, r.x, a.x, o.x),
      ns(t, i.y, r.y, a.y, o.y)
    ), s;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class uu extends ve {
  constructor(t = new E(), e = new E(), s = new E(), i = new E()) {
    super(), this.isCubicBezierCurve3 = !0, this.type = "CubicBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = s, this.v3 = i;
  }
  getPoint(t, e = new E()) {
    const s = e, i = this.v0, r = this.v1, a = this.v2, o = this.v3;
    return s.set(
      ns(t, i.x, r.x, a.x, o.x),
      ns(t, i.y, r.y, a.y, o.y),
      ns(t, i.z, r.z, a.z, o.z)
    ), s;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class ss extends ve {
  constructor(t = new $(), e = new $()) {
    super(), this.isLineCurve = !0, this.type = "LineCurve", this.v1 = t, this.v2 = e;
  }
  getPoint(t, e = new $()) {
    const s = e;
    return t === 1 ? s.copy(this.v2) : (s.copy(this.v2).sub(this.v1), s.multiplyScalar(t).add(this.v1)), s;
  }
  // Line curve is linear, so we can overwrite default getPointAt
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new $()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class fu extends ve {
  constructor(t = new E(), e = new E()) {
    super(), this.isLineCurve3 = !0, this.type = "LineCurve3", this.v1 = t, this.v2 = e;
  }
  getPoint(t, e = new E()) {
    const s = e;
    return t === 1 ? s.copy(this.v2) : (s.copy(this.v2).sub(this.v1), s.multiplyScalar(t).add(this.v1)), s;
  }
  // Line curve is linear, so we can overwrite default getPointAt
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new E()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class gi extends ve {
  constructor(t = new $(), e = new $(), s = new $()) {
    super(), this.isQuadraticBezierCurve = !0, this.type = "QuadraticBezierCurve", this.v0 = t, this.v1 = e, this.v2 = s;
  }
  getPoint(t, e = new $()) {
    const s = e, i = this.v0, r = this.v1, a = this.v2;
    return s.set(
      es(t, i.x, r.x, a.x),
      es(t, i.y, r.y, a.y)
    ), s;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class pu extends ve {
  constructor(t = new E(), e = new E(), s = new E()) {
    super(), this.isQuadraticBezierCurve3 = !0, this.type = "QuadraticBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = s;
  }
  getPoint(t, e = new E()) {
    const s = e, i = this.v0, r = this.v1, a = this.v2;
    return s.set(
      es(t, i.x, r.x, a.x),
      es(t, i.y, r.y, a.y),
      es(t, i.z, r.z, a.z)
    ), s;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Xc extends ve {
  constructor(t = []) {
    super(), this.isSplineCurve = !0, this.type = "SplineCurve", this.points = t;
  }
  getPoint(t, e = new $()) {
    const s = e, i = this.points, r = (i.length - 1) * t, a = Math.floor(r), o = r - a, c = i[a === 0 ? a : a - 1], h = i[a], l = i[a > i.length - 2 ? i.length - 1 : a + 1], u = i[a > i.length - 3 ? i.length - 1 : a + 2];
    return s.set(
      ho(o, c.x, h.x, l.x, u.x),
      ho(o, c.y, h.y, l.y, u.y)
    ), s;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, s = t.points.length; e < s; e++) {
      const i = t.points[e];
      this.points.push(i.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, s = this.points.length; e < s; e++) {
      const i = this.points[e];
      t.points.push(i.toArray());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, s = t.points.length; e < s; e++) {
      const i = t.points[e];
      this.points.push(new $().fromArray(i));
    }
    return this;
  }
}
var lo = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ArcCurve: nu,
  CatmullRomCurve3: su,
  CubicBezierCurve: di,
  CubicBezierCurve3: uu,
  EllipseCurve: cs,
  LineCurve: ss,
  LineCurve3: fu,
  QuadraticBezierCurve: gi,
  QuadraticBezierCurve3: pu,
  SplineCurve: Xc
});
class du extends ve {
  constructor() {
    super(), this.type = "CurvePath", this.curves = [], this.autoClose = !1;
  }
  add(t) {
    this.curves.push(t);
  }
  closePath() {
    const t = this.curves[0].getPoint(0), e = this.curves[this.curves.length - 1].getPoint(1);
    if (!t.equals(e)) {
      const s = t.isVector2 === !0 ? "LineCurve" : "LineCurve3";
      this.curves.push(new lo[s](e, t));
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
  getPoint(t, e) {
    const s = t * this.getLength(), i = this.getCurveLengths();
    let r = 0;
    for (; r < i.length; ) {
      if (i[r] >= s) {
        const a = i[r] - s, o = this.curves[r], c = o.getLength(), h = c === 0 ? 0 : 1 - a / c;
        return o.getPointAt(h, e);
      }
      r++;
    }
    return null;
  }
  // We cannot use the default THREE.Curve getPoint() with getLength() because in
  // THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
  // getPoint() depends on getLength
  getLength() {
    const t = this.getCurveLengths();
    return t[t.length - 1];
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
    const t = [];
    let e = 0;
    for (let s = 0, i = this.curves.length; s < i; s++)
      e += this.curves[s].getLength(), t.push(e);
    return this.cacheLengths = t, t;
  }
  getSpacedPoints(t = 40) {
    const e = [];
    for (let s = 0; s <= t; s++)
      e.push(this.getPoint(s / t));
    return this.autoClose && e.push(e[0]), e;
  }
  getPoints(t = 12) {
    const e = [];
    let s;
    for (let i = 0, r = this.curves; i < r.length; i++) {
      const a = r[i], o = a.isEllipseCurve ? t * 2 : a.isLineCurve || a.isLineCurve3 ? 1 : a.isSplineCurve ? t * a.points.length : t, c = a.getPoints(o);
      for (let h = 0; h < c.length; h++) {
        const l = c[h];
        s && s.equals(l) || (e.push(l), s = l);
      }
    }
    return this.autoClose && e.length > 1 && !e[e.length - 1].equals(e[0]) && e.push(e[0]), e;
  }
  copy(t) {
    super.copy(t), this.curves = [];
    for (let e = 0, s = t.curves.length; e < s; e++) {
      const i = t.curves[e];
      this.curves.push(i.clone());
    }
    return this.autoClose = t.autoClose, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.autoClose = this.autoClose, t.curves = [];
    for (let e = 0, s = this.curves.length; e < s; e++) {
      const i = this.curves[e];
      t.curves.push(i.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.autoClose = t.autoClose, this.curves = [];
    for (let e = 0, s = t.curves.length; e < s; e++) {
      const i = t.curves[e];
      this.curves.push(new lo[i.type]().fromJSON(i));
    }
    return this;
  }
}
let Pr = class extends du {
  constructor(t) {
    super(), this.type = "Path", this.currentPoint = new $(), t && this.setFromPoints(t);
  }
  setFromPoints(t) {
    this.moveTo(t[0].x, t[0].y);
    for (let e = 1, s = t.length; e < s; e++)
      this.lineTo(t[e].x, t[e].y);
    return this;
  }
  moveTo(t, e) {
    return this.currentPoint.set(t, e), this;
  }
  lineTo(t, e) {
    const s = new ss(this.currentPoint.clone(), new $(t, e));
    return this.curves.push(s), this.currentPoint.set(t, e), this;
  }
  quadraticCurveTo(t, e, s, i) {
    const r = new gi(
      this.currentPoint.clone(),
      new $(t, e),
      new $(s, i)
    );
    return this.curves.push(r), this.currentPoint.set(s, i), this;
  }
  bezierCurveTo(t, e, s, i, r, a) {
    const o = new di(
      this.currentPoint.clone(),
      new $(t, e),
      new $(s, i),
      new $(r, a)
    );
    return this.curves.push(o), this.currentPoint.set(r, a), this;
  }
  splineThru(t) {
    const e = [this.currentPoint.clone()].concat(t), s = new Xc(e);
    return this.curves.push(s), this.currentPoint.copy(t[t.length - 1]), this;
  }
  arc(t, e, s, i, r, a) {
    const o = this.currentPoint.x, c = this.currentPoint.y;
    return this.absarc(
      t + o,
      e + c,
      s,
      i,
      r,
      a
    ), this;
  }
  absarc(t, e, s, i, r, a) {
    return this.absellipse(t, e, s, s, i, r, a), this;
  }
  ellipse(t, e, s, i, r, a, o, c) {
    const h = this.currentPoint.x, l = this.currentPoint.y;
    return this.absellipse(t + h, e + l, s, i, r, a, o, c), this;
  }
  absellipse(t, e, s, i, r, a, o, c) {
    const h = new cs(t, e, s, i, r, a, o, c);
    if (this.curves.length > 0) {
      const u = h.getPoint(0);
      u.equals(this.currentPoint) || this.lineTo(u.x, u.y);
    }
    this.curves.push(h);
    const l = h.getPoint(1);
    return this.currentPoint.copy(l), this;
  }
  copy(t) {
    return super.copy(t), this.currentPoint.copy(t.currentPoint), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.currentPoint = this.currentPoint.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.currentPoint.fromArray(t.currentPoint), this;
  }
};
class Rn extends Pr {
  constructor(t) {
    super(t), this.uuid = Vn(), this.type = "Shape", this.holes = [];
  }
  getPointsHoles(t) {
    const e = [];
    for (let s = 0, i = this.holes.length; s < i; s++)
      e[s] = this.holes[s].getPoints(t);
    return e;
  }
  // get points of shape and holes (keypoints based on segments parameter)
  extractPoints(t) {
    return {
      shape: this.getPoints(t),
      holes: this.getPointsHoles(t)
    };
  }
  copy(t) {
    super.copy(t), this.holes = [];
    for (let e = 0, s = t.holes.length; e < s; e++) {
      const i = t.holes[e];
      this.holes.push(i.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.uuid = this.uuid, t.holes = [];
    for (let e = 0, s = this.holes.length; e < s; e++) {
      const i = this.holes[e];
      t.holes.push(i.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.uuid = t.uuid, this.holes = [];
    for (let e = 0, s = t.holes.length; e < s; e++) {
      const i = t.holes[e];
      this.holes.push(new Pr().fromJSON(i));
    }
    return this;
  }
}
const gu = {
  triangulate: function(n, t, e = 2) {
    const s = t && t.length, i = s ? t[0] * e : n.length;
    let r = Yc(n, 0, i, e, !0);
    const a = [];
    if (!r || r.next === r.prev) return a;
    let o, c, h, l, u, f, p;
    if (s && (r = vu(n, t, r, e)), n.length > 80 * e) {
      o = h = n[0], c = l = n[1];
      for (let d = e; d < i; d += e)
        u = n[d], f = n[d + 1], u < o && (o = u), f < c && (c = f), u > h && (h = u), f > l && (l = f);
      p = Math.max(h - o, l - c), p = p !== 0 ? 32767 / p : 0;
    }
    return hs(r, a, e, o, c, p, 0), a;
  }
};
function Yc(n, t, e, s, i) {
  let r, a;
  if (i === _u(n, t, e, s) > 0)
    for (r = t; r < e; r += s) a = uo(r, n[r], n[r + 1], a);
  else
    for (r = e - s; r >= t; r -= s) a = uo(r, n[r], n[r + 1], a);
  return a && Li(a, a.next) && (us(a), a = a.next), a;
}
function un(n, t) {
  if (!n) return n;
  t || (t = n);
  let e = n, s;
  do
    if (s = !1, !e.steiner && (Li(e, e.next) || lt(e.prev, e, e.next) === 0)) {
      if (us(e), e = t = e.prev, e === e.next) break;
      s = !0;
    } else
      e = e.next;
  while (s || e !== t);
  return t;
}
function hs(n, t, e, s, i, r, a) {
  if (!n) return;
  !a && r && ku(n, s, i, r);
  let o = n, c, h;
  for (; n.prev !== n.next; ) {
    if (c = n.prev, h = n.next, r ? yu(n, s, i, r) : mu(n)) {
      t.push(c.i / e | 0), t.push(n.i / e | 0), t.push(h.i / e | 0), us(n), n = h.next, o = h.next;
      continue;
    }
    if (n = h, n === o) {
      a ? a === 1 ? (n = xu(un(n), t, e), hs(n, t, e, s, i, r, 2)) : a === 2 && bu(n, t, e, s, i, r) : hs(un(n), t, e, s, i, r, 1);
      break;
    }
  }
}
function mu(n) {
  const t = n.prev, e = n, s = n.next;
  if (lt(t, e, s) >= 0) return !1;
  const i = t.x, r = e.x, a = s.x, o = t.y, c = e.y, h = s.y, l = i < r ? i < a ? i : a : r < a ? r : a, u = o < c ? o < h ? o : h : c < h ? c : h, f = i > r ? i > a ? i : a : r > a ? r : a, p = o > c ? o > h ? o : h : c > h ? c : h;
  let d = s.next;
  for (; d !== t; ) {
    if (d.x >= l && d.x <= f && d.y >= u && d.y <= p && Ln(i, o, r, c, a, h, d.x, d.y) && lt(d.prev, d, d.next) >= 0) return !1;
    d = d.next;
  }
  return !0;
}
function yu(n, t, e, s) {
  const i = n.prev, r = n, a = n.next;
  if (lt(i, r, a) >= 0) return !1;
  const o = i.x, c = r.x, h = a.x, l = i.y, u = r.y, f = a.y, p = o < c ? o < h ? o : h : c < h ? c : h, d = l < u ? l < f ? l : f : u < f ? u : f, g = o > c ? o > h ? o : h : c > h ? c : h, x = l > u ? l > f ? l : f : u > f ? u : f, b = zr(p, d, t, e, s), v = zr(g, x, t, e, s);
  let S = n.prevZ, w = n.nextZ;
  for (; S && S.z >= b && w && w.z <= v; ) {
    if (S.x >= p && S.x <= g && S.y >= d && S.y <= x && S !== i && S !== a && Ln(o, l, c, u, h, f, S.x, S.y) && lt(S.prev, S, S.next) >= 0 || (S = S.prevZ, w.x >= p && w.x <= g && w.y >= d && w.y <= x && w !== i && w !== a && Ln(o, l, c, u, h, f, w.x, w.y) && lt(w.prev, w, w.next) >= 0)) return !1;
    w = w.nextZ;
  }
  for (; S && S.z >= b; ) {
    if (S.x >= p && S.x <= g && S.y >= d && S.y <= x && S !== i && S !== a && Ln(o, l, c, u, h, f, S.x, S.y) && lt(S.prev, S, S.next) >= 0) return !1;
    S = S.prevZ;
  }
  for (; w && w.z <= v; ) {
    if (w.x >= p && w.x <= g && w.y >= d && w.y <= x && w !== i && w !== a && Ln(o, l, c, u, h, f, w.x, w.y) && lt(w.prev, w, w.next) >= 0) return !1;
    w = w.nextZ;
  }
  return !0;
}
function xu(n, t, e) {
  let s = n;
  do {
    const i = s.prev, r = s.next.next;
    !Li(i, r) && Zc(i, s, s.next, r) && ls(i, r) && ls(r, i) && (t.push(i.i / e | 0), t.push(s.i / e | 0), t.push(r.i / e | 0), us(s), us(s.next), s = n = r), s = s.next;
  } while (s !== n);
  return un(s);
}
function bu(n, t, e, s, i, r) {
  let a = n;
  do {
    let o = a.next.next;
    for (; o !== a.prev; ) {
      if (a.i !== o.i && Eu(a, o)) {
        let c = Jc(a, o);
        a = un(a, a.next), c = un(c, c.next), hs(a, t, e, s, i, r, 0), hs(c, t, e, s, i, r, 0);
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== n);
}
function vu(n, t, e, s) {
  const i = [];
  let r, a, o, c, h;
  for (r = 0, a = t.length; r < a; r++)
    o = t[r] * s, c = r < a - 1 ? t[r + 1] * s : n.length, h = Yc(n, o, c, s, !1), h === h.next && (h.steiner = !0), i.push(Fu(h));
  for (i.sort(Su), r = 0; r < i.length; r++)
    e = wu(i[r], e);
  return e;
}
function Su(n, t) {
  return n.x - t.x;
}
function wu(n, t) {
  const e = Cu(n, t);
  if (!e)
    return t;
  const s = Jc(e, n);
  return un(s, s.next), un(e, e.next);
}
function Cu(n, t) {
  let e = t, s = -1 / 0, i;
  const r = n.x, a = n.y;
  do {
    if (a <= e.y && a >= e.next.y && e.next.y !== e.y) {
      const f = e.x + (a - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (f <= r && f > s && (s = f, i = e.x < e.next.x ? e : e.next, f === r))
        return i;
    }
    e = e.next;
  } while (e !== t);
  if (!i) return null;
  const o = i, c = i.x, h = i.y;
  let l = 1 / 0, u;
  e = i;
  do
    r >= e.x && e.x >= c && r !== e.x && Ln(a < h ? r : s, a, c, h, a < h ? s : r, a, e.x, e.y) && (u = Math.abs(a - e.y) / (r - e.x), ls(e, n) && (u < l || u === l && (e.x > i.x || e.x === i.x && Tu(i, e))) && (i = e, l = u)), e = e.next;
  while (e !== o);
  return i;
}
function Tu(n, t) {
  return lt(n.prev, n, t.prev) < 0 && lt(t.next, n, n.next) < 0;
}
function ku(n, t, e, s) {
  let i = n;
  do
    i.z === 0 && (i.z = zr(i.x, i.y, t, e, s)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
  while (i !== n);
  i.prevZ.nextZ = null, i.prevZ = null, Au(i);
}
function Au(n) {
  let t, e, s, i, r, a, o, c, h = 1;
  do {
    for (e = n, n = null, r = null, a = 0; e; ) {
      for (a++, s = e, o = 0, t = 0; t < h && (o++, s = s.nextZ, !!s); t++)
        ;
      for (c = h; o > 0 || c > 0 && s; )
        o !== 0 && (c === 0 || !s || e.z <= s.z) ? (i = e, e = e.nextZ, o--) : (i = s, s = s.nextZ, c--), r ? r.nextZ = i : n = i, i.prevZ = r, r = i;
      e = s;
    }
    r.nextZ = null, h *= 2;
  } while (a > 1);
  return n;
}
function zr(n, t, e, s, i) {
  return n = (n - e) * i | 0, t = (t - s) * i | 0, n = (n | n << 8) & 16711935, n = (n | n << 4) & 252645135, n = (n | n << 2) & 858993459, n = (n | n << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, n | t << 1;
}
function Fu(n) {
  let t = n, e = n;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== n);
  return e;
}
function Ln(n, t, e, s, i, r, a, o) {
  return (i - a) * (t - o) >= (n - a) * (r - o) && (n - a) * (s - o) >= (e - a) * (t - o) && (e - a) * (r - o) >= (i - a) * (s - o);
}
function Eu(n, t) {
  return n.next.i !== t.i && n.prev.i !== t.i && !Mu(n, t) && // doesn't intersect other edges
  (ls(n, t) && ls(t, n) && Ou(n, t) && // locally visible
  (lt(n.prev, n, t.prev) || lt(n, t.prev, t)) || // does not create opposite-facing sectors
  Li(n, t) && lt(n.prev, n, n.next) > 0 && lt(t.prev, t, t.next) > 0);
}
function lt(n, t, e) {
  return (t.y - n.y) * (e.x - t.x) - (t.x - n.x) * (e.y - t.y);
}
function Li(n, t) {
  return n.x === t.x && n.y === t.y;
}
function Zc(n, t, e, s) {
  const i = Xs(lt(n, t, e)), r = Xs(lt(n, t, s)), a = Xs(lt(e, s, n)), o = Xs(lt(e, s, t));
  return !!(i !== r && a !== o || i === 0 && $s(n, e, t) || r === 0 && $s(n, s, t) || a === 0 && $s(e, n, s) || o === 0 && $s(e, t, s));
}
function $s(n, t, e) {
  return t.x <= Math.max(n.x, e.x) && t.x >= Math.min(n.x, e.x) && t.y <= Math.max(n.y, e.y) && t.y >= Math.min(n.y, e.y);
}
function Xs(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
function Mu(n, t) {
  let e = n;
  do {
    if (e.i !== n.i && e.next.i !== n.i && e.i !== t.i && e.next.i !== t.i && Zc(e, e.next, n, t)) return !0;
    e = e.next;
  } while (e !== n);
  return !1;
}
function ls(n, t) {
  return lt(n.prev, n, n.next) < 0 ? lt(n, t, n.next) >= 0 && lt(n, n.prev, t) >= 0 : lt(n, t, n.prev) < 0 || lt(n, n.next, t) < 0;
}
function Ou(n, t) {
  let e = n, s = !1;
  const i = (n.x + t.x) / 2, r = (n.y + t.y) / 2;
  do
    e.y > r != e.next.y > r && e.next.y !== e.y && i < (e.next.x - e.x) * (r - e.y) / (e.next.y - e.y) + e.x && (s = !s), e = e.next;
  while (e !== n);
  return s;
}
function Jc(n, t) {
  const e = new Nr(n.i, n.x, n.y), s = new Nr(t.i, t.x, t.y), i = n.next, r = t.prev;
  return n.next = t, t.prev = n, e.next = i, i.prev = e, s.next = e, e.prev = s, r.next = s, s.prev = r, s;
}
function uo(n, t, e, s) {
  const i = new Nr(n, t, e);
  return s ? (i.next = s.next, i.prev = s, s.next.prev = i, s.next = i) : (i.prev = i, i.next = i), i;
}
function us(n) {
  n.next.prev = n.prev, n.prev.next = n.next, n.prevZ && (n.prevZ.nextZ = n.nextZ), n.nextZ && (n.nextZ.prevZ = n.prevZ);
}
function Nr(n, t, e) {
  this.i = n, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
function _u(n, t, e, s) {
  let i = 0;
  for (let r = t, a = e - s; r < e; r += s)
    i += (n[a] - n[r]) * (n[r + 1] + n[a + 1]), a = r;
  return i;
}
class $e {
  // calculate area of the contour polygon
  static area(t) {
    const e = t.length;
    let s = 0;
    for (let i = e - 1, r = 0; r < e; i = r++)
      s += t[i].x * t[r].y - t[r].x * t[i].y;
    return s * 0.5;
  }
  static isClockWise(t) {
    return $e.area(t) < 0;
  }
  static triangulateShape(t, e) {
    const s = [], i = [], r = [];
    fo(t), po(s, t);
    let a = t.length;
    e.forEach(fo);
    for (let c = 0; c < e.length; c++)
      i.push(a), a += e[c].length, po(s, e[c]);
    const o = gu.triangulate(s, i);
    for (let c = 0; c < o.length; c += 3)
      r.push(o.slice(c, c + 3));
    return r;
  }
}
function fo(n) {
  const t = n.length;
  t > 2 && n[t - 1].equals(n[0]) && n.pop();
}
function po(n, t) {
  for (let e = 0; e < t.length; e++)
    n.push(t[e].x), n.push(t[e].y);
}
class on extends Ht {
  constructor(t = new Rn([new $(0, 0.5), new $(-0.5, -0.5), new $(0.5, -0.5)]), e = 12) {
    super(), this.type = "ShapeGeometry", this.parameters = {
      shapes: t,
      curveSegments: e
    };
    const s = [], i = [], r = [], a = [];
    let o = 0, c = 0;
    if (Array.isArray(t) === !1)
      h(t);
    else
      for (let l = 0; l < t.length; l++)
        h(t[l]), this.addGroup(o, c, l), o += c, c = 0;
    this.setIndex(s), this.setAttribute("position", new hn(i, 3)), this.setAttribute("normal", new hn(r, 3)), this.setAttribute("uv", new hn(a, 2));
    function h(l) {
      const u = i.length / 3, f = l.extractPoints(e);
      let p = f.shape;
      const d = f.holes;
      $e.isClockWise(p) === !1 && (p = p.reverse());
      for (let x = 0, b = d.length; x < b; x++) {
        const v = d[x];
        $e.isClockWise(v) === !0 && (d[x] = v.reverse());
      }
      const g = $e.triangulateShape(p, d);
      for (let x = 0, b = d.length; x < b; x++) {
        const v = d[x];
        p = p.concat(v);
      }
      for (let x = 0, b = p.length; x < b; x++) {
        const v = p[x];
        i.push(v.x, v.y, 0), r.push(0, 0, 1), a.push(v.x, v.y);
      }
      for (let x = 0, b = g.length; x < b; x++) {
        const v = g[x], S = v[0] + u, w = v[1] + u, k = v[2] + u;
        s.push(S, w, k), c += 3;
      }
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  toJSON() {
    const t = super.toJSON(), e = this.parameters.shapes;
    return Lu(e, t);
  }
  static fromJSON(t, e) {
    const s = [];
    for (let i = 0, r = t.shapes.length; i < r; i++) {
      const a = e[t.shapes[i]];
      s.push(a);
    }
    return new on(s, t.curveSegments);
  }
}
function Lu(n, t) {
  if (t.shapes = [], Array.isArray(n))
    for (let e = 0, s = n.length; e < s; e++) {
      const i = n[e];
      t.shapes.push(i.uuid);
    }
  else
    t.shapes.push(n.uuid);
  return t;
}
const go = {
  enabled: !1,
  files: {},
  add: function(n, t) {
    this.enabled !== !1 && (this.files[n] = t);
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
class Iu {
  constructor(t, e, s) {
    const i = this;
    let r = !1, a = 0, o = 0, c;
    const h = [];
    this.onStart = void 0, this.onLoad = t, this.onProgress = e, this.onError = s, this.itemStart = function(l) {
      o++, r === !1 && i.onStart !== void 0 && i.onStart(l, a, o), r = !0;
    }, this.itemEnd = function(l) {
      a++, i.onProgress !== void 0 && i.onProgress(l, a, o), a === o && (r = !1, i.onLoad !== void 0 && i.onLoad());
    }, this.itemError = function(l) {
      i.onError !== void 0 && i.onError(l);
    }, this.resolveURL = function(l) {
      return c ? c(l) : l;
    }, this.setURLModifier = function(l) {
      return c = l, this;
    }, this.addHandler = function(l, u) {
      return h.push(l, u), this;
    }, this.removeHandler = function(l) {
      const u = h.indexOf(l);
      return u !== -1 && h.splice(u, 2), this;
    }, this.getHandler = function(l) {
      for (let u = 0, f = h.length; u < f; u += 2) {
        const p = h[u], d = h[u + 1];
        if (p.global && (p.lastIndex = 0), p.test(l))
          return d;
      }
      return null;
    };
  }
}
const Ru = /* @__PURE__ */ new Iu();
class Kc {
  constructor(t) {
    this.manager = t !== void 0 ? t : Ru, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  load() {
  }
  loadAsync(t, e) {
    const s = this;
    return new Promise(function(i, r) {
      s.load(t, i, e, r);
    });
  }
  parse() {
  }
  setCrossOrigin(t) {
    return this.crossOrigin = t, this;
  }
  setWithCredentials(t) {
    return this.withCredentials = t, this;
  }
  setPath(t) {
    return this.path = t, this;
  }
  setResourcePath(t) {
    return this.resourcePath = t, this;
  }
  setRequestHeader(t) {
    return this.requestHeader = t, this;
  }
}
Kc.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const Fe = {};
class Bu extends Error {
  constructor(t, e) {
    super(t), this.response = e;
  }
}
class Du extends Kc {
  constructor(t) {
    super(t);
  }
  load(t, e, s, i) {
    t === void 0 && (t = ""), this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
    const r = go.get(t);
    if (r !== void 0)
      return this.manager.itemStart(t), setTimeout(() => {
        e && e(r), this.manager.itemEnd(t);
      }, 0), r;
    if (Fe[t] !== void 0) {
      Fe[t].push({
        onLoad: e,
        onProgress: s,
        onError: i
      });
      return;
    }
    Fe[t] = [], Fe[t].push({
      onLoad: e,
      onProgress: s,
      onError: i
    });
    const a = new Request(t, {
      headers: new Headers(this.requestHeader),
      credentials: this.withCredentials ? "include" : "same-origin"
      // An abort controller could be added within a future PR
    }), o = this.mimeType, c = this.responseType;
    fetch(a).then((h) => {
      if (h.status === 200 || h.status === 0) {
        if (h.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || h.body === void 0 || h.body.getReader === void 0)
          return h;
        const l = Fe[t], u = h.body.getReader(), f = h.headers.get("X-File-Size") || h.headers.get("Content-Length"), p = f ? parseInt(f) : 0, d = p !== 0;
        let g = 0;
        const x = new ReadableStream({
          start(b) {
            v();
            function v() {
              u.read().then(({ done: S, value: w }) => {
                if (S)
                  b.close();
                else {
                  g += w.byteLength;
                  const k = new ProgressEvent("progress", { lengthComputable: d, loaded: g, total: p });
                  for (let M = 0, O = l.length; M < O; M++) {
                    const I = l[M];
                    I.onProgress && I.onProgress(k);
                  }
                  b.enqueue(w), v();
                }
              }, (S) => {
                b.error(S);
              });
            }
          }
        });
        return new Response(x);
      } else
        throw new Bu(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`, h);
    }).then((h) => {
      switch (c) {
        case "arraybuffer":
          return h.arrayBuffer();
        case "blob":
          return h.blob();
        case "document":
          return h.text().then((l) => new DOMParser().parseFromString(l, o));
        case "json":
          return h.json();
        default:
          if (o === void 0)
            return h.text();
          {
            const u = /charset="?([^;"\s]*)"?/i.exec(o), f = u && u[1] ? u[1].toLowerCase() : void 0, p = new TextDecoder(f);
            return h.arrayBuffer().then((d) => p.decode(d));
          }
      }
    }).then((h) => {
      go.add(t, h);
      const l = Fe[t];
      delete Fe[t];
      for (let u = 0, f = l.length; u < f; u++) {
        const p = l[u];
        p.onLoad && p.onLoad(h);
      }
    }).catch((h) => {
      const l = Fe[t];
      if (l === void 0)
        throw this.manager.itemError(t), h;
      delete Fe[t];
      for (let u = 0, f = l.length; u < f; u++) {
        const p = l[u];
        p.onError && p.onError(h);
      }
      this.manager.itemError(t);
    }).finally(() => {
      this.manager.itemEnd(t);
    }), this.manager.itemStart(t);
  }
  setResponseType(t) {
    return this.responseType = t, this;
  }
  setMimeType(t) {
    return this.mimeType = t, this;
  }
}
class Qc {
  constructor() {
    this.type = "ShapePath", this.color = new Wn(), this.subPaths = [], this.currentPath = null;
  }
  moveTo(t, e) {
    return this.currentPath = new Pr(), this.subPaths.push(this.currentPath), this.currentPath.moveTo(t, e), this;
  }
  lineTo(t, e) {
    return this.currentPath.lineTo(t, e), this;
  }
  quadraticCurveTo(t, e, s, i) {
    return this.currentPath.quadraticCurveTo(t, e, s, i), this;
  }
  bezierCurveTo(t, e, s, i, r, a) {
    return this.currentPath.bezierCurveTo(t, e, s, i, r, a), this;
  }
  splineThru(t) {
    return this.currentPath.splineThru(t), this;
  }
  toShapes(t) {
    function e(b) {
      const v = [];
      for (let S = 0, w = b.length; S < w; S++) {
        const k = b[S], M = new Rn();
        M.curves = k.curves, v.push(M);
      }
      return v;
    }
    function s(b, v) {
      const S = v.length;
      let w = !1;
      for (let k = S - 1, M = 0; M < S; k = M++) {
        let O = v[k], I = v[M], V = I.x - O.x, D = I.y - O.y;
        if (Math.abs(D) > Number.EPSILON) {
          if (D < 0 && (O = v[M], V = -V, I = v[k], D = -D), b.y < O.y || b.y > I.y) continue;
          if (b.y === O.y) {
            if (b.x === O.x) return !0;
          } else {
            const W = D * (b.x - O.x) - V * (b.y - O.y);
            if (W === 0) return !0;
            if (W < 0) continue;
            w = !w;
          }
        } else {
          if (b.y !== O.y) continue;
          if (I.x <= b.x && b.x <= O.x || O.x <= b.x && b.x <= I.x) return !0;
        }
      }
      return w;
    }
    const i = $e.isClockWise, r = this.subPaths;
    if (r.length === 0) return [];
    let a, o, c;
    const h = [];
    if (r.length === 1)
      return o = r[0], c = new Rn(), c.curves = o.curves, h.push(c), h;
    let l = !i(r[0].getPoints());
    l = t ? !l : l;
    const u = [], f = [];
    let p = [], d = 0, g;
    f[d] = void 0, p[d] = [];
    for (let b = 0, v = r.length; b < v; b++)
      o = r[b], g = o.getPoints(), a = i(g), a = t ? !a : a, a ? (!l && f[d] && d++, f[d] = { s: new Rn(), p: g }, f[d].s.curves = o.curves, l && d++, p[d] = []) : p[d].push({ h: o, p: g[0] });
    if (!f[0]) return e(r);
    if (f.length > 1) {
      let b = !1, v = 0;
      for (let S = 0, w = f.length; S < w; S++)
        u[S] = [];
      for (let S = 0, w = f.length; S < w; S++) {
        const k = p[S];
        for (let M = 0; M < k.length; M++) {
          const O = k[M];
          let I = !0;
          for (let V = 0; V < f.length; V++)
            s(O.p, f[V].p) && (S !== V && v++, I ? (I = !1, u[V].push(O)) : b = !0);
          I && u[S].push(O);
        }
      }
      v > 0 && b === !1 && (p = u);
    }
    let x;
    for (let b = 0, v = f.length; b < v; b++) {
      c = f[b].s, h.push(c), x = p[b];
      for (let S = 0, w = x.length; S < w; S++)
        c.holes.push(x[S].h);
    }
    return h;
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: Nc
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Nc);
class Uu {
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
  hasGeometry(t, e) {
    const s = this.generateKey(t, e);
    return this.cache.has(s);
  }
  /**
   * Get the geometry for a single character from cache if available.
   * The cache key includes both character codeand size.
   * @param code The character code to get geometry from cache.
   * @param size The font size.
   * @returns The geometry for a single character from cache if avaiable.
   * Return undefined if the character not found in cache.
   */
  getGeometry(t, e) {
    const s = this.generateKey(t, e);
    if (this.cache.has(s))
      return this.cache.get(s);
  }
  /**
   * Set the geometry to cache for a single character.
   * @param char The character to set geometry for.
   * @param size The font size.
   * @param geometry The geometry to set.
   */
  setGeometry(t, e, s) {
    const i = this.generateKey(t, e);
    this.cache.set(i, s);
  }
  /**
   * Dispose all cached geometries.
   */
  dispose() {
    for (const t of this.cache.values())
      t.dispose();
    this.cache.clear();
  }
  /**
   * Generates cache key by character and font size.
   * @param char One character code.
   * @param size The font size.
   */
  generateKey(t, e) {
    return `${t}_${e}`;
  }
}
class th {
  constructor(t) {
    this.names = /* @__PURE__ */ new Set(), this.unsupportedChars = {}, this.encoding = t.encoding, t.alias.forEach((e) => this.names.add(e)), this.cache = new Uu();
  }
  /**
   * Gets a named SHX shape glyph when supported by the font implementation.
   */
  getShapeByName(t, e) {
  }
  /**
   * Records an unsupported character in the font.
   * Increments the count for the given character in unsupportedChars.
   * @param char - The unsupported character to record
   */
  addUnsupportedChar(t) {
    this.unsupportedChars[t] || (this.unsupportedChars[t] = 0), this.unsupportedChars[t]++;
  }
}
class eh extends Rn {
  constructor() {
    super(...arguments), this.width = 0;
  }
}
class mo {
  constructor() {
    this.listeners = [];
  }
  /**
   * Add the event listener
   * @param listener Input listener to be added
   */
  addEventListener(t) {
    this.listeners.push(t);
  }
  /**
   * Remove the listener
   * @param listener Input listener to be removed
   */
  removeEventListener(t) {
    this.listeners = this.listeners.filter((e) => e !== t);
  }
  /**
   * Remove all listeners bound to the target and add one new listener
   * @param listener Input listener to be added
   */
  replaceEventListener(t) {
    this.removeEventListener(t), this.addEventListener(t);
  }
  /**
   * Notify all listeners
   * @param payload Input payload passed to listener
   */
  dispatch(t, ...e) {
    for (const s of this.listeners)
      s.call(null, t, ...e);
  }
}
const nh = (n) => n.split("/").pop(), Hr = (n) => {
  const t = nh(n);
  if (t) {
    const e = t.lastIndexOf(".");
    return e === -1 ? t : t.substring(0, e);
  }
  return n;
}, Pu = [
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
], sh = (n) => Pu[n], Gr = (n, t) => t.some((e) => n instanceof e);
let yo, xo;
function zu() {
  return yo || (yo = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Nu() {
  return xo || (xo = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Vr = /* @__PURE__ */ new WeakMap(), fr = /* @__PURE__ */ new WeakMap(), Ii = /* @__PURE__ */ new WeakMap();
function Hu(n) {
  const t = new Promise((e, s) => {
    const i = () => {
      n.removeEventListener("success", r), n.removeEventListener("error", a);
    }, r = () => {
      e(ln(n.result)), i();
    }, a = () => {
      s(n.error), i();
    };
    n.addEventListener("success", r), n.addEventListener("error", a);
  });
  return Ii.set(t, n), t;
}
function Gu(n) {
  if (Vr.has(n))
    return;
  const t = new Promise((e, s) => {
    const i = () => {
      n.removeEventListener("complete", r), n.removeEventListener("error", a), n.removeEventListener("abort", a);
    }, r = () => {
      e(), i();
    }, a = () => {
      s(n.error || new DOMException("AbortError", "AbortError")), i();
    };
    n.addEventListener("complete", r), n.addEventListener("error", a), n.addEventListener("abort", a);
  });
  Vr.set(n, t);
}
let Wr = {
  get(n, t, e) {
    if (n instanceof IDBTransaction) {
      if (t === "done")
        return Vr.get(n);
      if (t === "store")
        return e.objectStoreNames[1] ? void 0 : e.objectStore(e.objectStoreNames[0]);
    }
    return ln(n[t]);
  },
  set(n, t, e) {
    return n[t] = e, !0;
  },
  has(n, t) {
    return n instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in n;
  }
};
function ih(n) {
  Wr = n(Wr);
}
function Vu(n) {
  return Nu().includes(n) ? function(...t) {
    return n.apply(qr(this), t), ln(this.request);
  } : function(...t) {
    return ln(n.apply(qr(this), t));
  };
}
function Wu(n) {
  return typeof n == "function" ? Vu(n) : (n instanceof IDBTransaction && Gu(n), Gr(n, zu()) ? new Proxy(n, Wr) : n);
}
function ln(n) {
  if (n instanceof IDBRequest)
    return Hu(n);
  if (fr.has(n))
    return fr.get(n);
  const t = Wu(n);
  return t !== n && (fr.set(n, t), Ii.set(t, n)), t;
}
const qr = (n) => Ii.get(n);
function qu(n, t, { blocked: e, upgrade: s, blocking: i, terminated: r } = {}) {
  const a = indexedDB.open(n, t), o = ln(a);
  return s && a.addEventListener("upgradeneeded", (c) => {
    s(ln(a.result), c.oldVersion, c.newVersion, ln(a.transaction), c);
  }), e && a.addEventListener("blocked", (c) => e(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    c.oldVersion,
    c.newVersion,
    c
  )), o.then((c) => {
    r && c.addEventListener("close", () => r()), i && c.addEventListener("versionchange", (h) => i(h.oldVersion, h.newVersion, h));
  }).catch(() => {
  }), o;
}
const ju = ["get", "getKey", "getAll", "getAllKeys", "count"], $u = ["put", "add", "delete", "clear"], pr = /* @__PURE__ */ new Map();
function bo(n, t) {
  if (!(n instanceof IDBDatabase && !(t in n) && typeof t == "string"))
    return;
  if (pr.get(t))
    return pr.get(t);
  const e = t.replace(/FromIndex$/, ""), s = t !== e, i = $u.includes(e);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(e in (s ? IDBIndex : IDBObjectStore).prototype) || !(i || ju.includes(e))
  )
    return;
  const r = async function(a, ...o) {
    const c = this.transaction(a, i ? "readwrite" : "readonly");
    let h = c.store;
    return s && (h = h.index(o.shift())), (await Promise.all([
      h[e](...o),
      i && c.done
    ]))[0];
  };
  return pr.set(t, r), r;
}
ih((n) => ({
  ...n,
  get: (t, e, s) => bo(t, e) || n.get(t, e, s),
  has: (t, e) => !!bo(t, e) || n.has(t, e)
}));
const Xu = ["continue", "continuePrimaryKey", "advance"], vo = {}, jr = /* @__PURE__ */ new WeakMap(), rh = /* @__PURE__ */ new WeakMap(), Yu = {
  get(n, t) {
    if (!Xu.includes(t))
      return n[t];
    let e = vo[t];
    return e || (e = vo[t] = function(...s) {
      jr.set(this, rh.get(this)[t](...s));
    }), e;
  }
};
async function* Zu(...n) {
  let t = this;
  if (t instanceof IDBCursor || (t = await t.openCursor(...n)), !t)
    return;
  t = t;
  const e = new Proxy(t, Yu);
  for (rh.set(e, t), Ii.set(e, qr(t)); t; )
    yield e, t = await (jr.get(e) || t.continue()), jr.delete(e);
}
function So(n, t) {
  return t === Symbol.asyncIterator && Gr(n, [IDBIndex, IDBObjectStore, IDBCursor]) || t === "iterate" && Gr(n, [IDBIndex, IDBObjectStore]);
}
ih((n) => ({
  ...n,
  get(t, e, s) {
    return So(t, e) ? Zu : n.get(t, e, s);
  },
  has(t, e) {
    return So(t, e) || n.has(t, e);
  }
}));
const rn = {
  fonts: "fonts"
}, dr = [
  {
    version: 1,
    stores: [
      {
        name: rn.fonts,
        keyPath: "name"
      }
    ]
  },
  {
    version: 2,
    stores: [
      {
        name: rn.fonts,
        keyPath: "name"
      }
    ]
  }
], qt = class qt {
  constructor() {
    this.isClosing = !1, typeof window < "u" && window.addEventListener("unload", () => {
      this.close();
    });
  }
  /**
   * Returns the singleton instance of the FontCacheManager
   */
  static get instance() {
    return qt._instance || (qt._instance = new qt()), qt._instance;
  }
  /**
   * Sets a font in the cache
   * @param fileName The font file name (key)
   * @param fontData The font data to store
   */
  async set(t, e) {
    await (await this.getDatabase()).put(rn.fonts, { ...e, name: t });
  }
  /**
   * Gets a font from the cache
   * @param fileName The font file name (key)
   * @returns The font data if found, undefined otherwise
   */
  async get(t) {
    return await (await this.getDatabase()).get(rn.fonts, t);
  }
  /**
   * Deletes a font from the cache
   * @param fileName The font file name (key)
   */
  async delete(t) {
    await (await this.getDatabase()).delete(rn.fonts, t);
  }
  /**
   * Gets all fonts from the cache
   * @returns An array of all font data in the cache
   */
  async getAll() {
    return await (await this.getDatabase()).getAll(rn.fonts);
  }
  /**
   * Clears all fonts from the cache
   */
  async clear() {
    await (await this.getDatabase()).clear(rn.fonts);
  }
  /**
   * Checks if a font exists in the cache
   * @param fileName The font file name (key)
   */
  async has(t) {
    return await this.get(t) !== void 0;
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
    this.close(), await indexedDB.deleteDatabase(qt.DATABASE_NAME), qt._instance = void 0;
  }
  // Private methods for database management
  async getDatabase() {
    if (this.isClosing)
      throw new Error("Cannot perform operation while database is closing");
    return this.db ? this.db : (this.db = await qu(
      qt.DATABASE_NAME,
      qt.DATABASE_VERSION,
      {
        upgrade: (t, e, s) => this.handleUpgrade(t, e, s),
        blocked() {
          console.warn(
            "Database upgrade blocked - please close other tabs using the application"
          );
        },
        blocking() {
          console.warn("Database blocking newer version - closing connection"), qt.instance.close();
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
  handleUpgrade(t, e, s) {
    const i = dr.filter(
      (r) => r.version > e && (!s || r.version <= s)
    );
    for (const r of i)
      this.applySchemaVersion(t, r);
  }
  /**
   * Applies a single schema version's changes to the database
   * @param db The database instance
   * @param schema The schema version to apply
   */
  applySchemaVersion(t, e) {
    for (const s of e.stores)
      t.objectStoreNames.contains(s.name) || t.createObjectStore(s.name, { keyPath: s.keyPath });
  }
};
qt.DATABASE_NAME = "mlightcad", qt.DATABASE_VERSION = dr[dr.length - 1].version;
let is = qt;
const $r = {
  minimal: ["txt", "simkai"],
  r12r14: ["txt", "simplex", "romans", "gbcbig", "simsun"],
  modern: ["hztxt", "simsun"],
  international: ["txt", "simplex", "romans", "simsun"],
  cjk: ["gbcbig", "hztxt", "simsun", "simkai"]
}, gr = {
  minimal: ["amgdt"],
  r12r14: ["amgdt"],
  modern: ["amgdt"],
  international: ["amgdt"],
  cjk: ["amgdt"]
};
function wo(n) {
  return Object.prototype.hasOwnProperty.call($r, n);
}
var oa = 0, ah = -3;
function fs() {
  this.table = new Uint16Array(16), this.trans = new Uint16Array(288);
}
function Ju(n, t) {
  this.source = n, this.sourceIndex = 0, this.tag = 0, this.bitcount = 0, this.dest = t, this.destLen = 0, this.ltree = new fs(), this.dtree = new fs();
}
var oh = new fs(), ch = new fs(), ca = new Uint8Array(30), ha = new Uint16Array(30), hh = new Uint8Array(30), lh = new Uint16Array(30), Ku = new Uint8Array([
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
]), Co = new fs(), pe = new Uint8Array(320);
function uh(n, t, e, s) {
  var i, r;
  for (i = 0; i < e; ++i) n[i] = 0;
  for (i = 0; i < 30 - e; ++i) n[i + e] = i / e | 0;
  for (r = s, i = 0; i < 30; ++i)
    t[i] = r, r += 1 << n[i];
}
function Qu(n, t) {
  var e;
  for (e = 0; e < 7; ++e) n.table[e] = 0;
  for (n.table[7] = 24, n.table[8] = 152, n.table[9] = 112, e = 0; e < 24; ++e) n.trans[e] = 256 + e;
  for (e = 0; e < 144; ++e) n.trans[24 + e] = e;
  for (e = 0; e < 8; ++e) n.trans[168 + e] = 280 + e;
  for (e = 0; e < 112; ++e) n.trans[176 + e] = 144 + e;
  for (e = 0; e < 5; ++e) t.table[e] = 0;
  for (t.table[5] = 32, e = 0; e < 32; ++e) t.trans[e] = e;
}
var To = new Uint16Array(16);
function mr(n, t, e, s) {
  var i, r;
  for (i = 0; i < 16; ++i) n.table[i] = 0;
  for (i = 0; i < s; ++i) n.table[t[e + i]]++;
  for (n.table[0] = 0, r = 0, i = 0; i < 16; ++i)
    To[i] = r, r += n.table[i];
  for (i = 0; i < s; ++i)
    t[e + i] && (n.trans[To[t[e + i]]++] = i);
}
function tf(n) {
  n.bitcount-- || (n.tag = n.source[n.sourceIndex++], n.bitcount = 7);
  var t = n.tag & 1;
  return n.tag >>>= 1, t;
}
function ge(n, t, e) {
  if (!t)
    return e;
  for (; n.bitcount < 24; )
    n.tag |= n.source[n.sourceIndex++] << n.bitcount, n.bitcount += 8;
  var s = n.tag & 65535 >>> 16 - t;
  return n.tag >>>= t, n.bitcount -= t, s + e;
}
function Xr(n, t) {
  for (; n.bitcount < 24; )
    n.tag |= n.source[n.sourceIndex++] << n.bitcount, n.bitcount += 8;
  var e = 0, s = 0, i = 0, r = n.tag;
  do
    s = 2 * s + (r & 1), r >>>= 1, ++i, e += t.table[i], s -= t.table[i];
  while (s >= 0);
  return n.tag = r, n.bitcount -= i, t.trans[e + s];
}
function ef(n, t, e) {
  var s, i, r, a, o, c;
  for (s = ge(n, 5, 257), i = ge(n, 5, 1), r = ge(n, 4, 4), a = 0; a < 19; ++a) pe[a] = 0;
  for (a = 0; a < r; ++a) {
    var h = ge(n, 3, 0);
    pe[Ku[a]] = h;
  }
  for (mr(Co, pe, 0, 19), o = 0; o < s + i; ) {
    var l = Xr(n, Co);
    switch (l) {
      case 16:
        var u = pe[o - 1];
        for (c = ge(n, 2, 3); c; --c)
          pe[o++] = u;
        break;
      case 17:
        for (c = ge(n, 3, 3); c; --c)
          pe[o++] = 0;
        break;
      case 18:
        for (c = ge(n, 7, 11); c; --c)
          pe[o++] = 0;
        break;
      default:
        pe[o++] = l;
        break;
    }
  }
  mr(t, pe, 0, s), mr(e, pe, s, i);
}
function ko(n, t, e) {
  for (; ; ) {
    var s = Xr(n, t);
    if (s === 256)
      return oa;
    if (s < 256)
      n.dest[n.destLen++] = s;
    else {
      var i, r, a, o;
      for (s -= 257, i = ge(n, ca[s], ha[s]), r = Xr(n, e), a = n.destLen - ge(n, hh[r], lh[r]), o = a; o < a + i; ++o)
        n.dest[n.destLen++] = n.dest[o];
    }
  }
}
function nf(n) {
  for (var t, e, s; n.bitcount > 8; )
    n.sourceIndex--, n.bitcount -= 8;
  if (t = n.source[n.sourceIndex + 1], t = 256 * t + n.source[n.sourceIndex], e = n.source[n.sourceIndex + 3], e = 256 * e + n.source[n.sourceIndex + 2], t !== (~e & 65535))
    return ah;
  for (n.sourceIndex += 4, s = t; s; --s)
    n.dest[n.destLen++] = n.source[n.sourceIndex++];
  return n.bitcount = 0, oa;
}
function fh(n, t) {
  var e = new Ju(n, t), s, i, r;
  do {
    switch (s = tf(e), i = ge(e, 2, 0), i) {
      case 0:
        r = nf(e);
        break;
      case 1:
        r = ko(e, oh, ch);
        break;
      case 2:
        ef(e, e.ltree, e.dtree), r = ko(e, e.ltree, e.dtree);
        break;
      default:
        r = ah;
    }
    if (r !== oa)
      throw new Error("Data error");
  } while (!s);
  return e.destLen < e.dest.length ? typeof e.dest.slice == "function" ? e.dest.slice(0, e.destLen) : e.dest.subarray(0, e.destLen) : e.dest;
}
Qu(oh, ch);
uh(ca, ha, 4, 3);
uh(hh, lh, 2, 1);
ca[28] = 0;
ha[28] = 258;
function En(n, t, e, s, i) {
  return Math.pow(1 - i, 3) * n + 3 * Math.pow(1 - i, 2) * i * t + 3 * (1 - i) * Math.pow(i, 2) * e + Math.pow(i, 3) * s;
}
function dn() {
  this.x1 = Number.NaN, this.y1 = Number.NaN, this.x2 = Number.NaN, this.y2 = Number.NaN;
}
dn.prototype.isEmpty = function() {
  return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};
dn.prototype.addPoint = function(n, t) {
  typeof n == "number" && ((isNaN(this.x1) || isNaN(this.x2)) && (this.x1 = n, this.x2 = n), n < this.x1 && (this.x1 = n), n > this.x2 && (this.x2 = n)), typeof t == "number" && ((isNaN(this.y1) || isNaN(this.y2)) && (this.y1 = t, this.y2 = t), t < this.y1 && (this.y1 = t), t > this.y2 && (this.y2 = t));
};
dn.prototype.addX = function(n) {
  this.addPoint(n, null);
};
dn.prototype.addY = function(n) {
  this.addPoint(null, n);
};
dn.prototype.addBezier = function(n, t, e, s, i, r, a, o) {
  const c = [n, t], h = [e, s], l = [i, r], u = [a, o];
  this.addPoint(n, t), this.addPoint(a, o);
  for (let f = 0; f <= 1; f++) {
    const p = 6 * c[f] - 12 * h[f] + 6 * l[f], d = -3 * c[f] + 9 * h[f] - 9 * l[f] + 3 * u[f], g = 3 * h[f] - 3 * c[f];
    if (d === 0) {
      if (p === 0) continue;
      const S = -g / p;
      0 < S && S < 1 && (f === 0 && this.addX(En(c[f], h[f], l[f], u[f], S)), f === 1 && this.addY(En(c[f], h[f], l[f], u[f], S)));
      continue;
    }
    const x = Math.pow(p, 2) - 4 * g * d;
    if (x < 0) continue;
    const b = (-p + Math.sqrt(x)) / (2 * d);
    0 < b && b < 1 && (f === 0 && this.addX(En(c[f], h[f], l[f], u[f], b)), f === 1 && this.addY(En(c[f], h[f], l[f], u[f], b)));
    const v = (-p - Math.sqrt(x)) / (2 * d);
    0 < v && v < 1 && (f === 0 && this.addX(En(c[f], h[f], l[f], u[f], v)), f === 1 && this.addY(En(c[f], h[f], l[f], u[f], v)));
  }
};
dn.prototype.addQuad = function(n, t, e, s, i, r) {
  const a = n + 0.6666666666666666 * (e - n), o = t + 2 / 3 * (s - t), c = a + 1 / 3 * (i - n), h = o + 1 / 3 * (r - t);
  this.addBezier(n, t, a, o, c, h, i, r);
};
var ph = dn;
function xt() {
  this.commands = [], this.fill = "black", this.stroke = null, this.strokeWidth = 1;
}
var Kn = {};
function dh(n, t) {
  const e = Math.floor(n), s = n - e;
  if (Kn[t] || (Kn[t] = {}), Kn[t][s] !== void 0) {
    const r = Kn[t][s];
    return e + r;
  }
  const i = +(Math.round(s + "e+" + t) + "e-" + t);
  return Kn[t][s] = i, e + i;
}
function gh(n) {
  let t = [[]], e = 0, s = 0;
  for (let i = 0; i < n.length; i += 1) {
    const r = t[t.length - 1], a = n[i], o = r[0], c = r[1], h = r[r.length - 1], l = n[i + 1];
    r.push(a), a.type === "M" ? (e = a.x, s = a.y) : a.type === "L" && (!l || l.type === "Z") ? Math.abs(a.x - e) > 1 || Math.abs(a.y - s) > 1 || r.pop() : a.type === "L" && h && h.x === a.x && h.y === a.y ? r.pop() : a.type === "Z" && (o && c && h && o.type === "M" && c.type === "L" && h.type === "L" && h.x === o.x && h.y === o.y && (r.shift(), r[0].type = "M"), i + 1 < n.length && t.push([]));
  }
  return n = [].concat.apply([], t), n;
}
function sf(n) {
  return Object.assign({}, {
    decimalPlaces: 2,
    optimize: !0,
    flipY: !0,
    flipYBase: void 0,
    scale: 1,
    x: 0,
    y: 0
  }, n);
}
function rf(n) {
  return parseInt(n) === n && (n = { decimalPlaces: n, flipY: !1 }), Object.assign({}, {
    decimalPlaces: 2,
    optimize: !0,
    flipY: !0,
    flipYBase: void 0
  }, n);
}
xt.prototype.fromSVG = function(n, t = {}) {
  typeof SVGPathElement < "u" && n instanceof SVGPathElement && (n = n.getAttribute("d")), t = sf(t), this.commands = [];
  const e = "0123456789", s = "MmLlQqCcZzHhVv", i = "SsTtAa", r = "-+";
  let a = {}, o = [""], c = !1;
  function h(d) {
    return d.filter((g) => g.length).map((g) => {
      let x = parseFloat(g);
      return (t.decimalPlaces || t.decimalPlaces === 0) && (x = dh(x, t.decimalPlaces)), x;
    });
  }
  function l(d) {
    if (!this.commands.length)
      return d;
    const g = this.commands[this.commands.length - 1];
    for (let x = 0; x < d.length; x++)
      d[x] += g[x & 1 ? "y" : "x"];
    return d;
  }
  function u() {
    if (a.type === void 0)
      return;
    const d = a.type.toUpperCase(), g = d !== "Z" && a.type.toUpperCase() !== a.type;
    let x = h(o);
    if (o = [""], !x.length && d !== "Z")
      return;
    g && d !== "H" && d !== "V" && (x = l.apply(this, [x]));
    const b = this.commands.length && this.commands[this.commands.length - 1].x || 0, v = this.commands.length && this.commands[this.commands.length - 1].y || 0;
    switch (d) {
      case "M":
        this.moveTo(...x);
        break;
      case "L":
        this.lineTo(...x);
        break;
      case "V":
        for (let S = 0; S < x.length; S++) {
          let w = 0;
          g && (w = this.commands.length && this.commands[this.commands.length - 1].y || 0), this.lineTo(b, x[S] + w);
        }
        break;
      case "H":
        for (let S = 0; S < x.length; S++) {
          let w = 0;
          g && (w = this.commands.length && this.commands[this.commands.length - 1].x || 0), this.lineTo(x[S] + w, v);
        }
        break;
      case "C":
        this.bezierCurveTo(...x);
        break;
      case "Q":
        this.quadraticCurveTo(...x);
        break;
      case "Z":
        (this.commands.length < 1 || this.commands[this.commands.length - 1].type !== "Z") && this.close();
        break;
    }
    if (this.commands.length)
      for (const S in this.commands[this.commands.length - 1])
        this.commands[this.commands.length - 1][S] === void 0 && (this.commands[this.commands.length - 1][S] = 0);
  }
  for (let d = 0; d < n.length; d++) {
    const g = n.charAt(d), x = o[o.length - 1];
    if (e.indexOf(g) > -1)
      o[o.length - 1] += g;
    else if (r.indexOf(g) > -1)
      if (!a.type && !this.commands.length && (a.type = "L"), g === "-")
        !a.type || x.indexOf("-") > 0 ? c = !0 : x.length ? o.push("-") : o[o.length - 1] = g;
      else if (!a.type || x.length > 0)
        c = !0;
      else
        continue;
    else if (s.indexOf(g) > -1)
      a.type ? (u.apply(this), a = { type: g }) : a.type = g;
    else {
      if (i.indexOf(g) > -1)
        throw new Error("Unsupported path command: " + g + ". Currently supported commands are " + s.split("").join(", ") + ".");
      ` ,	
\r\f\v`.indexOf(g) > -1 ? o.push("") : g === "." ? !a.type || x.indexOf(g) > -1 ? c = !0 : o[o.length - 1] += g : c = !0;
    }
    if (c)
      throw new Error("Unexpected character: " + g + " at offset " + d);
  }
  u.apply(this), t.optimize && (this.commands = gh(this.commands));
  const f = t.flipY;
  let p = t.flipYBase;
  if (f === !0 && t.flipYBase === void 0) {
    const d = this.getBoundingBox();
    p = d.y1 + d.y2;
  }
  for (const d in this.commands) {
    const g = this.commands[d];
    for (const x in g)
      ["x", "x1", "x2"].includes(x) ? this.commands[d][x] = t.x + g[x] * t.scale : ["y", "y1", "y2"].includes(x) && (this.commands[d][x] = t.y + (f ? p - g[x] : g[x]) * t.scale);
  }
  return this;
};
xt.fromSVG = function(n, t) {
  return new xt().fromSVG(n, t);
};
xt.prototype.moveTo = function(n, t) {
  this.commands.push({
    type: "M",
    x: n,
    y: t
  });
};
xt.prototype.lineTo = function(n, t) {
  this.commands.push({
    type: "L",
    x: n,
    y: t
  });
};
xt.prototype.curveTo = xt.prototype.bezierCurveTo = function(n, t, e, s, i, r) {
  this.commands.push({
    type: "C",
    x1: n,
    y1: t,
    x2: e,
    y2: s,
    x: i,
    y: r
  });
};
xt.prototype.quadTo = xt.prototype.quadraticCurveTo = function(n, t, e, s) {
  this.commands.push({
    type: "Q",
    x1: n,
    y1: t,
    x: e,
    y: s
  });
};
xt.prototype.close = xt.prototype.closePath = function() {
  this.commands.push({
    type: "Z"
  });
};
xt.prototype.extend = function(n) {
  if (n.commands)
    n = n.commands;
  else if (n instanceof ph) {
    const t = n;
    this.moveTo(t.x1, t.y1), this.lineTo(t.x2, t.y1), this.lineTo(t.x2, t.y2), this.lineTo(t.x1, t.y2), this.close();
    return;
  }
  Array.prototype.push.apply(this.commands, n);
};
xt.prototype.getBoundingBox = function() {
  const n = new ph();
  let t = 0, e = 0, s = 0, i = 0;
  for (let r = 0; r < this.commands.length; r++) {
    const a = this.commands[r];
    switch (a.type) {
      case "M":
        n.addPoint(a.x, a.y), t = s = a.x, e = i = a.y;
        break;
      case "L":
        n.addPoint(a.x, a.y), s = a.x, i = a.y;
        break;
      case "Q":
        n.addQuad(s, i, a.x1, a.y1, a.x, a.y), s = a.x, i = a.y;
        break;
      case "C":
        n.addBezier(s, i, a.x1, a.y1, a.x2, a.y2, a.x, a.y), s = a.x, i = a.y;
        break;
      case "Z":
        s = t, i = e;
        break;
      default:
        throw new Error("Unexpected path command " + a.type);
    }
  }
  return n.isEmpty() && n.addPoint(0, 0), n;
};
xt.prototype.draw = function(n) {
  const t = this._layers;
  if (t && t.length) {
    for (let s = 0; s < t.length; s++)
      this.draw.call(t[s], n);
    return;
  }
  const e = this._image;
  if (e) {
    n.drawImage(e.image, e.x, e.y, e.width, e.height);
    return;
  }
  n.beginPath();
  for (let s = 0; s < this.commands.length; s += 1) {
    const i = this.commands[s];
    i.type === "M" ? n.moveTo(i.x, i.y) : i.type === "L" ? n.lineTo(i.x, i.y) : i.type === "C" ? n.bezierCurveTo(i.x1, i.y1, i.x2, i.y2, i.x, i.y) : i.type === "Q" ? n.quadraticCurveTo(i.x1, i.y1, i.x, i.y) : i.type === "Z" && this.stroke && this.strokeWidth && n.closePath();
  }
  this.fill && (n.fillStyle = this.fill, n.fill()), this.stroke && (n.strokeStyle = this.stroke, n.lineWidth = this.strokeWidth, n.stroke());
};
xt.prototype.toPathData = function(n) {
  n = rf(n);
  function t(o) {
    const c = dh(o, n.decimalPlaces);
    return Math.round(o) === c ? "" + c : c.toFixed(n.decimalPlaces);
  }
  function e() {
    let o = "";
    for (let c = 0; c < arguments.length; c += 1) {
      const h = arguments[c];
      h >= 0 && c > 0 && (o += " "), o += t(h);
    }
    return o;
  }
  let s = this.commands;
  n.optimize && (s = JSON.parse(JSON.stringify(this.commands)), s = gh(s));
  const i = n.flipY;
  let r = n.flipYBase;
  if (i === !0 && r === void 0) {
    const o = new xt();
    o.extend(s);
    const c = o.getBoundingBox();
    r = c.y1 + c.y2;
  }
  let a = "";
  for (let o = 0; o < s.length; o += 1) {
    const c = s[o];
    c.type === "M" ? a += "M" + e(
      c.x,
      i ? r - c.y : c.y
    ) : c.type === "L" ? a += "L" + e(
      c.x,
      i ? r - c.y : c.y
    ) : c.type === "C" ? a += "C" + e(
      c.x1,
      i ? r - c.y1 : c.y1,
      c.x2,
      i ? r - c.y2 : c.y2,
      c.x,
      i ? r - c.y : c.y
    ) : c.type === "Q" ? a += "Q" + e(
      c.x1,
      i ? r - c.y1 : c.y1,
      c.x,
      i ? r - c.y : c.y
    ) : c.type === "Z" && (a += "Z");
  }
  return a;
};
xt.prototype.toSVG = function(n, t) {
  this._layers && this._layers.length && console.warn("toSVG() does not support colr font layers yet"), this._image && console.warn("toSVG() does not support SVG glyphs yet"), t || (t = this.toPathData(n));
  let e = '<path d="';
  return e += t, e += '"', this.fill !== void 0 && this.fill !== "black" && (this.fill === null ? e += ' fill="none"' : e += ' fill="' + this.fill + '"'), this.stroke && (e += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"'), e += "/>", e;
};
xt.prototype.toDOMElement = function(n, t) {
  this._layers && this._layers.length && console.warn("toDOMElement() does not support colr font layers yet"), t || (t = this.toPathData(n));
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", t), this.fill !== void 0 && this.fill !== "black" && (this.fill === null ? e.setAttribute("fill", "none") : e.setAttribute("fill", this.fill)), this.stroke && (e.setAttribute("stroke", this.stroke), e.setAttribute("stroke-width", this.strokeWidth)), e;
};
var Pn = xt;
function mh(n) {
  throw new Error(n);
}
function Ao(n, t) {
  n || mh(t);
}
var G = { fail: mh, argument: Ao, assert: Ao }, Fo = 32768, Eo = 2147483648, af = -32768, of = 32767 + 1 / 65536, zn = {}, z = {}, q = {};
function fe(n) {
  return function() {
    return n;
  };
}
z.BYTE = function(n) {
  return G.argument(n >= 0 && n <= 255, "Byte value should be between 0 and 255."), [n];
};
q.BYTE = fe(1);
z.CHAR = function(n) {
  return [n.charCodeAt(0)];
};
q.CHAR = fe(1);
z.CHARARRAY = function(n) {
  (n === null || typeof n > "u") && (n = "", console.warn("CHARARRAY with undefined or null value encountered and treated as an empty string. This is probably caused by a missing glyph name."));
  const t = [];
  for (let e = 0; e < n.length; e += 1)
    t[e] = n.charCodeAt(e);
  return t;
};
q.CHARARRAY = function(n) {
  return typeof n > "u" ? 0 : n.length;
};
z.USHORT = function(n) {
  return [n >> 8 & 255, n & 255];
};
q.USHORT = fe(2);
z.SHORT = function(n) {
  return n >= Fo && (n = -(2 * Fo - n)), [n >> 8 & 255, n & 255];
};
q.SHORT = fe(2);
z.UINT24 = function(n) {
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
};
q.UINT24 = fe(3);
z.ULONG = function(n) {
  return [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
};
q.ULONG = fe(4);
z.LONG = function(n) {
  return n >= Eo && (n = -(2 * Eo - n)), [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
};
q.LONG = fe(4);
z.FLOAT = function(n) {
  if (n > of || n < af)
    throw new Error(`Value ${n} is outside the range of representable values in 16.16 format`);
  const t = Math.round(n * 65536) << 0;
  return z.ULONG(t);
};
q.FLOAT = q.ULONG;
z.FIXED = z.ULONG;
q.FIXED = q.ULONG;
z.FWORD = z.SHORT;
q.FWORD = q.SHORT;
z.UFWORD = z.USHORT;
q.UFWORD = q.USHORT;
z.F2DOT14 = function(n) {
  return z.USHORT(n * 16384);
};
q.F2DOT14 = q.USHORT;
z.LONGDATETIME = function(n) {
  return [0, 0, 0, 0, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
};
q.LONGDATETIME = fe(8);
z.TAG = function(n) {
  return G.argument(n.length === 4, "Tag should be exactly 4 ASCII characters."), [
    n.charCodeAt(0),
    n.charCodeAt(1),
    n.charCodeAt(2),
    n.charCodeAt(3)
  ];
};
q.TAG = fe(4);
z.Card8 = z.BYTE;
q.Card8 = q.BYTE;
z.Card16 = z.USHORT;
q.Card16 = q.USHORT;
z.OffSize = z.BYTE;
q.OffSize = q.BYTE;
z.SID = z.USHORT;
q.SID = q.USHORT;
z.NUMBER = function(n) {
  return n >= -107 && n <= 107 ? [n + 139] : n >= 108 && n <= 1131 ? (n = n - 108, [(n >> 8) + 247, n & 255]) : n >= -1131 && n <= -108 ? (n = -n - 108, [(n >> 8) + 251, n & 255]) : n >= -32768 && n <= 32767 ? z.NUMBER16(n) : z.NUMBER32(n);
};
q.NUMBER = function(n) {
  return z.NUMBER(n).length;
};
z.NUMBER16 = function(n) {
  return [28, n >> 8 & 255, n & 255];
};
q.NUMBER16 = fe(3);
z.NUMBER32 = function(n) {
  return [29, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
};
q.NUMBER32 = fe(5);
z.REAL = function(n) {
  let t = n.toString();
  const e = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(t);
  if (e) {
    const r = parseFloat("1e" + ((e[2] ? +e[2] : 0) + e[1].length));
    t = (Math.round(n * r) / r).toString();
  }
  let s = "";
  for (let r = 0, a = t.length; r < a; r += 1) {
    const o = t[r];
    o === "e" ? s += t[++r] === "-" ? "c" : "b" : o === "." ? s += "a" : o === "-" ? s += "e" : s += o;
  }
  s += s.length & 1 ? "f" : "ff";
  const i = [30];
  for (let r = 0, a = s.length; r < a; r += 2)
    i.push(parseInt(s.substr(r, 2), 16));
  return i;
};
q.REAL = function(n) {
  return z.REAL(n).length;
};
z.NAME = z.CHARARRAY;
q.NAME = q.CHARARRAY;
z.STRING = z.CHARARRAY;
q.STRING = q.CHARARRAY;
zn.UTF8 = function(n, t, e) {
  const s = [], i = e;
  for (let r = 0; r < i; r++, t += 1)
    s[r] = n.getUint8(t);
  return String.fromCharCode.apply(null, s);
};
zn.UTF16 = function(n, t, e) {
  const s = [], i = e / 2;
  for (let r = 0; r < i; r++, t += 2)
    s[r] = n.getUint16(t);
  return String.fromCharCode.apply(null, s);
};
z.UTF16 = function(n) {
  const t = [];
  for (let e = 0; e < n.length; e += 1) {
    const s = n.charCodeAt(e);
    t[t.length] = s >> 8 & 255, t[t.length] = s & 255;
  }
  return t;
};
q.UTF16 = function(n) {
  return n.length * 2;
};
var mi = {
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
zn.MACSTRING = function(n, t, e, s) {
  const i = mi[s];
  if (i === void 0)
    return;
  let r = "";
  for (let a = 0; a < e; a++) {
    const o = n.getUint8(t + a);
    o <= 127 ? r += String.fromCharCode(o) : r += i[o & 127];
  }
  return r;
};
var Ys = typeof WeakMap == "function" && /* @__PURE__ */ new WeakMap(), Zs, cf = function(n) {
  if (!Zs) {
    Zs = {};
    for (let i in mi)
      Zs[i] = new String(i);
  }
  const t = Zs[n];
  if (t === void 0)
    return;
  if (Ys) {
    const i = Ys.get(t);
    if (i !== void 0)
      return i;
  }
  const e = mi[n];
  if (e === void 0)
    return;
  const s = {};
  for (let i = 0; i < e.length; i++)
    s[e.charCodeAt(i)] = i + 128;
  return Ys && Ys.set(t, s), s;
};
z.MACSTRING = function(n, t) {
  const e = cf(t);
  if (e === void 0)
    return;
  const s = [];
  for (let i = 0; i < n.length; i++) {
    let r = n.charCodeAt(i);
    if (r >= 128 && (r = e[r], r === void 0))
      return;
    s[i] = r;
  }
  return s;
};
q.MACSTRING = function(n, t) {
  const e = z.MACSTRING(n, t);
  return e !== void 0 ? e.length : 0;
};
function Yr(n) {
  return n >= -128 && n <= 127;
}
function hf(n, t, e) {
  let s = 0;
  const i = n.length;
  for (; t < i && s < 64 && n[t] === 0; )
    ++t, ++s;
  return e.push(128 | s - 1), t;
}
function lf(n, t, e) {
  let s = 0;
  const i = n.length;
  let r = t;
  for (; r < i && s < 64; ) {
    const a = n[r];
    if (!Yr(a) || a === 0 && r + 1 < i && n[r + 1] === 0)
      break;
    ++r, ++s;
  }
  e.push(s - 1);
  for (let a = t; a < r; ++a)
    e.push(n[a] + 256 & 255);
  return r;
}
function uf(n, t, e) {
  let s = 0;
  const i = n.length;
  let r = t;
  for (; r < i && s < 64; ) {
    const a = n[r];
    if (a === 0 || Yr(a) && r + 1 < i && Yr(n[r + 1]))
      break;
    ++r, ++s;
  }
  e.push(64 | s - 1);
  for (let a = t; a < r; ++a) {
    const o = n[a];
    e.push(o + 65536 >> 8 & 255, o + 256 & 255);
  }
  return r;
}
z.VARDELTAS = function(n) {
  let t = 0;
  const e = [];
  for (; t < n.length; ) {
    const s = n[t];
    s === 0 ? t = hf(n, t, e) : s >= -128 && s <= 127 ? t = lf(n, t, e) : t = uf(n, t, e);
  }
  return e;
};
z.INDEX = function(n) {
  let t = 1;
  const e = [t], s = [];
  for (let o = 0; o < n.length; o += 1) {
    const c = z.OBJECT(n[o]);
    Array.prototype.push.apply(s, c), t += c.length, e.push(t);
  }
  if (s.length === 0)
    return [0, 0];
  const i = [], r = 1 + Math.floor(Math.log(t) / Math.log(2)) / 8 | 0, a = [void 0, z.BYTE, z.USHORT, z.UINT24, z.ULONG][r];
  for (let o = 0; o < e.length; o += 1) {
    const c = a(e[o]);
    Array.prototype.push.apply(i, c);
  }
  return Array.prototype.concat(
    z.Card16(n.length),
    z.OffSize(r),
    i,
    s
  );
};
q.INDEX = function(n) {
  return z.INDEX(n).length;
};
z.DICT = function(n) {
  let t = [];
  const e = Object.keys(n), s = e.length;
  for (let i = 0; i < s; i += 1) {
    const r = parseInt(e[i], 0), a = n[r], o = z.OPERAND(a.value, a.type), c = z.OPERATOR(r);
    for (let h = 0; h < o.length; h++)
      t.push(o[h]);
    for (let h = 0; h < c.length; h++)
      t.push(c[h]);
  }
  return t;
};
q.DICT = function(n) {
  return z.DICT(n).length;
};
z.OPERATOR = function(n) {
  return n < 1200 ? [n] : [12, n - 1200];
};
z.OPERAND = function(n, t) {
  let e = [];
  if (Array.isArray(t))
    for (let s = 0; s < t.length; s += 1) {
      G.argument(n.length === t.length, "Not enough arguments given for type" + t);
      const i = z.OPERAND(n[s], t[s]);
      for (let r = 0; r < i.length; r++)
        e.push(i[r]);
    }
  else if (t === "SID") {
    const s = z.NUMBER(n);
    for (let i = 0; i < s.length; i++)
      e.push(s[i]);
  } else if (t === "offset") {
    const s = z.NUMBER32(n);
    for (let i = 0; i < s.length; i++)
      e.push(s[i]);
  } else if (t === "number") {
    const s = z.NUMBER(n);
    for (let i = 0; i < s.length; i++)
      e.push(s[i]);
  } else if (t === "real") {
    const s = z.REAL(n);
    for (let i = 0; i < s.length; i++)
      e.push(s[i]);
  } else
    throw new Error("Unknown operand type " + t);
  return e;
};
z.OP = z.BYTE;
q.OP = q.BYTE;
var Js = typeof WeakMap == "function" && /* @__PURE__ */ new WeakMap();
z.CHARSTRING = function(n) {
  if (Js) {
    const s = Js.get(n);
    if (s !== void 0)
      return s;
  }
  let t = [];
  const e = n.length;
  for (let s = 0; s < e; s += 1) {
    const i = n[s], r = z[i.type](i.value);
    for (let a = 0; a < r.length; a++)
      t.push(r[a]);
  }
  return Js && Js.set(n, t), t;
};
q.CHARSTRING = function(n) {
  return z.CHARSTRING(n).length;
};
z.OBJECT = function(n) {
  const t = z[n.type];
  return G.argument(t !== void 0, "No encoding function for type " + n.type), t(n.value);
};
q.OBJECT = function(n) {
  const t = q[n.type];
  return G.argument(t !== void 0, "No sizeOf function for type " + n.type), t(n.value);
};
z.TABLE = function(n) {
  let t = [];
  const e = (n.fields || []).length, s = [], i = [];
  for (let r = 0; r < e; r += 1) {
    const a = n.fields[r], o = z[a.type];
    G.argument(o !== void 0, "No encoding function for field type " + a.type + " (" + a.name + ")");
    let c = n[a.name];
    c === void 0 && (c = a.value);
    const h = o(c);
    if (a.type === "TABLE")
      c.fields !== null && (i.push(t.length), s.push(h)), t.push(0, 0);
    else
      for (let l = 0; l < h.length; l++)
        t.push(h[l]);
  }
  for (let r = 0; r < s.length; r += 1) {
    const a = i[r], o = t.length;
    G.argument(o < 65536, "Table " + n.tableName + " too big."), t[a] = o >> 8, t[a + 1] = o & 255;
    for (let c = 0; c < s[r].length; c++)
      t.push(s[r][c]);
  }
  return t;
};
q.TABLE = function(n) {
  let t = 0;
  const e = (n.fields || []).length;
  for (let s = 0; s < e; s += 1) {
    const i = n.fields[s], r = q[i.type];
    G.argument(r !== void 0, "No sizeOf function for field type " + i.type + " (" + i.name + ")");
    let a = n[i.name];
    a === void 0 && (a = i.value), t += r(a), i.type === "TABLE" && (t += 2);
  }
  return t;
};
z.RECORD = z.TABLE;
q.RECORD = q.TABLE;
z.LITERAL = function(n) {
  return n;
};
q.LITERAL = function(n) {
  return n.length;
};
function dt(n, t, e) {
  if (t && t.length)
    for (let s = 0; s < t.length; s += 1) {
      const i = t[s];
      this[i.name] = i.value;
    }
  if (this.tableName = n, this.fields = t, e) {
    const s = Object.keys(e);
    for (let i = 0; i < s.length; i += 1) {
      const r = s[i], a = e[r];
      this[r] !== void 0 && (this[r] = a);
    }
  }
}
dt.prototype.encode = function() {
  return z.TABLE(this);
};
dt.prototype.sizeOf = function() {
  return q.TABLE(this);
};
function Nn(n, t, e) {
  e === void 0 && (e = t.length);
  const s = new Array(t.length + 1);
  s[0] = { name: n + "Count", type: "USHORT", value: e };
  for (let i = 0; i < t.length; i++)
    s[i + 1] = { name: n + i, type: "USHORT", value: t[i] };
  return s;
}
function Zr(n, t, e) {
  const s = t.length, i = new Array(s + 1);
  i[0] = { name: n + "Count", type: "USHORT", value: s };
  for (let r = 0; r < s; r++)
    i[r + 1] = { name: n + r, type: "TABLE", value: e(t[r], r) };
  return i;
}
function Hn(n, t, e) {
  const s = t.length;
  let i = [];
  i[0] = { name: n + "Count", type: "USHORT", value: s };
  for (let r = 0; r < s; r++)
    i = i.concat(e(t[r], r));
  return i;
}
function yi(n) {
  n.format === 1 ? dt.call(
    this,
    "coverageTable",
    [{ name: "coverageFormat", type: "USHORT", value: 1 }].concat(Nn("glyph", n.glyphs))
  ) : n.format === 2 ? dt.call(
    this,
    "coverageTable",
    [{ name: "coverageFormat", type: "USHORT", value: 2 }].concat(Hn("rangeRecord", n.ranges, function(t, e) {
      return [
        { name: "startGlyphID" + e, type: "USHORT", value: t.start },
        { name: "endGlyphID" + e, type: "USHORT", value: t.end },
        { name: "startCoverageIndex" + e, type: "USHORT", value: t.index }
      ];
    }))
  ) : G.assert(!1, "Coverage format must be 1 or 2.");
}
yi.prototype = Object.create(dt.prototype);
yi.prototype.constructor = yi;
function xi(n) {
  dt.call(
    this,
    "scriptListTable",
    Hn("scriptRecord", n, function(t, e) {
      const s = t.script;
      let i = s.defaultLangSys;
      return G.assert(!!i, "Unable to write GSUB: script " + t.tag + " has no default language system."), [
        { name: "scriptTag" + e, type: "TAG", value: t.tag },
        { name: "script" + e, type: "TABLE", value: new dt("scriptTable", [
          { name: "defaultLangSys", type: "TABLE", value: new dt("defaultLangSys", [
            { name: "lookupOrder", type: "USHORT", value: 0 },
            { name: "reqFeatureIndex", type: "USHORT", value: i.reqFeatureIndex }
          ].concat(Nn("featureIndex", i.featureIndexes))) }
        ].concat(Hn("langSys", s.langSysRecords, function(r, a) {
          const o = r.langSys;
          return [
            { name: "langSysTag" + a, type: "TAG", value: r.tag },
            { name: "langSys" + a, type: "TABLE", value: new dt("langSys", [
              { name: "lookupOrder", type: "USHORT", value: 0 },
              { name: "reqFeatureIndex", type: "USHORT", value: o.reqFeatureIndex }
            ].concat(Nn("featureIndex", o.featureIndexes))) }
          ];
        }))) }
      ];
    })
  );
}
xi.prototype = Object.create(dt.prototype);
xi.prototype.constructor = xi;
function bi(n) {
  dt.call(
    this,
    "featureListTable",
    Hn("featureRecord", n, function(t, e) {
      const s = t.feature;
      return [
        { name: "featureTag" + e, type: "TAG", value: t.tag },
        { name: "feature" + e, type: "TABLE", value: new dt("featureTable", [
          { name: "featureParams", type: "USHORT", value: s.featureParams }
        ].concat(Nn("lookupListIndex", s.lookupListIndexes))) }
      ];
    })
  );
}
bi.prototype = Object.create(dt.prototype);
bi.prototype.constructor = bi;
function vi(n, t) {
  dt.call(this, "lookupListTable", Zr("lookup", n, function(e) {
    let s = t[e.lookupType];
    return G.assert(!!s, "Unable to write GSUB lookup type " + e.lookupType + " tables."), new dt("lookupTable", [
      { name: "lookupType", type: "USHORT", value: e.lookupType },
      { name: "lookupFlag", type: "USHORT", value: e.lookupFlag }
    ].concat(Zr("subtable", e.subtables, s)));
  }));
}
vi.prototype = Object.create(dt.prototype);
vi.prototype.constructor = vi;
function Si(n) {
  n.format === 1 ? dt.call(
    this,
    "classDefTable",
    [
      { name: "classFormat", type: "USHORT", value: 1 },
      { name: "startGlyphID", type: "USHORT", value: n.startGlyph }
    ].concat(Nn("glyph", n.classes))
  ) : n.format === 2 ? dt.call(
    this,
    "classDefTable",
    [{ name: "classFormat", type: "USHORT", value: 2 }].concat(Hn("rangeRecord", n.ranges, function(t, e) {
      return [
        { name: "startGlyphID" + e, type: "USHORT", value: t.start },
        { name: "endGlyphID" + e, type: "USHORT", value: t.end },
        { name: "class" + e, type: "USHORT", value: t.classId }
      ];
    }))
  ) : G.assert(!1, "Class format must be 1 or 2.");
}
Si.prototype = Object.create(dt.prototype);
Si.prototype.constructor = Si;
var L = {
  Table: dt,
  Record: dt,
  Coverage: yi,
  ClassDef: Si,
  ScriptList: xi,
  FeatureList: bi,
  LookupList: vi,
  ushortList: Nn,
  tableList: Zr,
  recordList: Hn
};
function Mo(n, t) {
  return n.getUint8(t);
}
function wi(n, t) {
  return n.getUint16(t, !1);
}
function ff(n, t) {
  return n.getInt16(t, !1);
}
function yh(n, t) {
  return (n.getUint16(t) << 8) + n.getUint8(t + 2);
}
function la(n, t) {
  return n.getUint32(t, !1);
}
function pf(n, t) {
  return n.getInt32(t, !1);
}
function xh(n, t) {
  const e = n.getInt16(t, !1), s = n.getUint16(t + 2, !1);
  return e + s / 65535;
}
function df(n, t) {
  let e = "";
  for (let s = t; s < t + 4; s += 1)
    e += String.fromCharCode(n.getInt8(s));
  return e;
}
function gf(n, t, e) {
  let s = 0;
  for (let i = 0; i < e; i += 1)
    s <<= 8, s += n.getUint8(t + i);
  return s;
}
function mf(n, t, e) {
  const s = [];
  for (let i = t; i < e; i += 1)
    s.push(n.getUint8(i));
  return s;
}
function yf(n) {
  let t = "";
  for (let e = 0; e < n.length; e += 1)
    t += String.fromCharCode(n[e]);
  return t;
}
var xf = {
  byte: 1,
  uShort: 2,
  f2dot14: 2,
  short: 2,
  uInt24: 3,
  uLong: 4,
  fixed: 4,
  longDateTime: 8,
  tag: 4
}, _t = {
  LONG_WORDS: 32768,
  WORD_DELTA_COUNT_MASK: 32767,
  SHARED_POINT_NUMBERS: 32768,
  COUNT_MASK: 4095,
  EMBEDDED_PEAK_TUPLE: 32768,
  INTERMEDIATE_REGION: 16384,
  PRIVATE_POINT_NUMBERS: 8192,
  TUPLE_INDEX_MASK: 4095,
  POINTS_ARE_WORDS: 128,
  POINT_RUN_COUNT_MASK: 127,
  DELTAS_ARE_ZERO: 128,
  DELTAS_ARE_WORDS: 64,
  DELTA_RUN_COUNT_MASK: 63,
  INNER_INDEX_BIT_COUNT_MASK: 15,
  MAP_ENTRY_SIZE_MASK: 48
};
function A(n, t) {
  this.data = n, this.offset = t, this.relativeOffset = 0;
}
A.prototype.parseByte = function() {
  const n = this.data.getUint8(this.offset + this.relativeOffset);
  return this.relativeOffset += 1, n;
};
A.prototype.parseChar = function() {
  const n = this.data.getInt8(this.offset + this.relativeOffset);
  return this.relativeOffset += 1, n;
};
A.prototype.parseCard8 = A.prototype.parseByte;
A.prototype.parseUShort = function() {
  const n = this.data.getUint16(this.offset + this.relativeOffset);
  return this.relativeOffset += 2, n;
};
A.prototype.parseCard16 = A.prototype.parseUShort;
A.prototype.parseSID = A.prototype.parseUShort;
A.prototype.parseOffset16 = A.prototype.parseUShort;
A.prototype.parseShort = function() {
  const n = this.data.getInt16(this.offset + this.relativeOffset);
  return this.relativeOffset += 2, n;
};
A.prototype.parseF2Dot14 = function() {
  const n = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
  return this.relativeOffset += 2, n;
};
A.prototype.parseUInt24 = function() {
  const n = yh(this.data, this.offset + this.relativeOffset);
  return this.relativeOffset += 3, n;
};
A.prototype.parseULong = function() {
  const n = la(this.data, this.offset + this.relativeOffset);
  return this.relativeOffset += 4, n;
};
A.prototype.parseLong = function() {
  const n = pf(this.data, this.offset + this.relativeOffset);
  return this.relativeOffset += 4, n;
};
A.prototype.parseOffset32 = A.prototype.parseULong;
A.prototype.parseFixed = function() {
  const n = xh(this.data, this.offset + this.relativeOffset);
  return this.relativeOffset += 4, n;
};
A.prototype.parseString = function(n) {
  const t = this.data, e = this.offset + this.relativeOffset;
  let s = "";
  this.relativeOffset += n;
  for (let i = 0; i < n; i++)
    s += String.fromCharCode(t.getUint8(e + i));
  return s;
};
A.prototype.parseTag = function() {
  return this.parseString(4);
};
A.prototype.parseLongDateTime = function() {
  let n = la(this.data, this.offset + this.relativeOffset + 4);
  return n -= 2082844800, this.relativeOffset += 8, n;
};
A.prototype.parseVersion = function(n) {
  const t = wi(this.data, this.offset + this.relativeOffset), e = wi(this.data, this.offset + this.relativeOffset + 2);
  return this.relativeOffset += 4, n === void 0 && (n = 4096), t + e / n / 10;
};
A.prototype.skip = function(n, t) {
  t === void 0 && (t = 1), this.relativeOffset += xf[n] * t;
};
A.prototype.parseULongList = function(n) {
  n === void 0 && (n = this.parseULong());
  const t = new Array(n), e = this.data;
  let s = this.offset + this.relativeOffset;
  for (let i = 0; i < n; i++)
    t[i] = e.getUint32(s), s += 4;
  return this.relativeOffset += n * 4, t;
};
A.prototype.parseOffset16List = A.prototype.parseUShortList = function(n) {
  n === void 0 && (n = this.parseUShort());
  const t = new Array(n), e = this.data;
  let s = this.offset + this.relativeOffset;
  for (let i = 0; i < n; i++)
    t[i] = e.getUint16(s), s += 2;
  return this.relativeOffset += n * 2, t;
};
A.prototype.parseShortList = function(n) {
  const t = new Array(n), e = this.data;
  let s = this.offset + this.relativeOffset;
  for (let i = 0; i < n; i++)
    t[i] = e.getInt16(s), s += 2;
  return this.relativeOffset += n * 2, t;
};
A.prototype.parseByteList = function(n) {
  const t = new Array(n), e = this.data;
  let s = this.offset + this.relativeOffset;
  for (let i = 0; i < n; i++)
    t[i] = e.getUint8(s++);
  return this.relativeOffset += n, t;
};
A.prototype.parseList = function(n, t) {
  t || (t = n, n = this.parseUShort());
  const e = new Array(n);
  for (let s = 0; s < n; s++)
    e[s] = t.call(this);
  return e;
};
A.prototype.parseList32 = function(n, t) {
  t || (t = n, n = this.parseULong());
  const e = new Array(n);
  for (let s = 0; s < n; s++)
    e[s] = t.call(this);
  return e;
};
A.prototype.parseRecordList = function(n, t) {
  t || (t = n, n = this.parseUShort());
  const e = new Array(n), s = Object.keys(t);
  for (let i = 0; i < n; i++) {
    const r = {};
    for (let a = 0; a < s.length; a++) {
      const o = s[a], c = t[o];
      r[o] = c.call(this);
    }
    e[i] = r;
  }
  return e;
};
A.prototype.parseRecordList32 = function(n, t) {
  t || (t = n, n = this.parseULong());
  const e = new Array(n), s = Object.keys(t);
  for (let i = 0; i < n; i++) {
    const r = {};
    for (let a = 0; a < s.length; a++) {
      const o = s[a], c = t[o];
      r[o] = c.call(this);
    }
    e[i] = r;
  }
  return e;
};
A.prototype.parseTupleRecords = function(n, t) {
  let e = [];
  for (let s = 0; s < n; s++) {
    let i = [];
    for (let r = 0; r < t; r++)
      i.push(this.parseF2Dot14());
    e.push(i);
  }
  return e;
};
A.prototype.parseStruct = function(n) {
  if (typeof n == "function")
    return n.call(this);
  {
    const t = Object.keys(n), e = {};
    for (let s = 0; s < t.length; s++) {
      const i = t[s], r = n[i];
      e[i] = r.call(this);
    }
    return e;
  }
};
A.prototype.parseValueRecord = function(n) {
  if (n === void 0 && (n = this.parseUShort()), n === 0)
    return;
  const t = {};
  return n & 1 && (t.xPlacement = this.parseShort()), n & 2 && (t.yPlacement = this.parseShort()), n & 4 && (t.xAdvance = this.parseShort()), n & 8 && (t.yAdvance = this.parseShort()), n & 16 && (t.xPlaDevice = void 0, this.parseShort()), n & 32 && (t.yPlaDevice = void 0, this.parseShort()), n & 64 && (t.xAdvDevice = void 0, this.parseShort()), n & 128 && (t.yAdvDevice = void 0, this.parseShort()), t;
};
A.prototype.parseValueRecordList = function() {
  const n = this.parseUShort(), t = this.parseUShort(), e = new Array(t);
  for (let s = 0; s < t; s++)
    e[s] = this.parseValueRecord(n);
  return e;
};
A.prototype.parsePointer = function(n) {
  const t = this.parseOffset16();
  if (t > 0)
    return new A(this.data, this.offset + t).parseStruct(n);
};
A.prototype.parsePointer32 = function(n) {
  const t = this.parseOffset32();
  if (t > 0)
    return new A(this.data, this.offset + t).parseStruct(n);
};
A.prototype.parseListOfLists = function(n) {
  const t = this.parseOffset16List(), e = t.length, s = this.relativeOffset, i = new Array(e);
  for (let r = 0; r < e; r++) {
    const a = t[r];
    if (a === 0) {
      i[r] = void 0;
      continue;
    }
    if (this.relativeOffset = a, n) {
      const o = this.parseOffset16List(), c = new Array(o.length);
      for (let h = 0; h < o.length; h++)
        this.relativeOffset = a + o[h], c[h] = n.call(this);
      i[r] = c;
    } else
      i[r] = this.parseUShortList();
  }
  return this.relativeOffset = s, i;
};
A.prototype.parseCoverage = function() {
  const n = this.offset + this.relativeOffset, t = this.parseUShort(), e = this.parseUShort();
  if (t === 1)
    return {
      format: 1,
      glyphs: this.parseUShortList(e)
    };
  if (t === 2) {
    const s = new Array(e);
    for (let i = 0; i < e; i++)
      s[i] = {
        start: this.parseUShort(),
        end: this.parseUShort(),
        index: this.parseUShort()
      };
    return {
      format: 2,
      ranges: s
    };
  }
  throw new Error("0x" + n.toString(16) + ": Coverage format must be 1 or 2.");
};
A.prototype.parseClassDef = function() {
  const n = this.offset + this.relativeOffset, t = this.parseUShort();
  return t === 1 ? {
    format: 1,
    startGlyph: this.parseUShort(),
    classes: this.parseUShortList()
  } : t === 2 ? {
    format: 2,
    ranges: this.parseRecordList({
      start: A.uShort,
      end: A.uShort,
      classId: A.uShort
    })
  } : (console.warn(`0x${n.toString(16)}: This font file uses an invalid ClassDef format of ${t}. It might be corrupted and should be reacquired if it doesn't display as intended.`), {
    format: t
  });
};
A.list = function(n, t) {
  return function() {
    return this.parseList(n, t);
  };
};
A.list32 = function(n, t) {
  return function() {
    return this.parseList32(n, t);
  };
};
A.recordList = function(n, t) {
  return function() {
    return this.parseRecordList(n, t);
  };
};
A.recordList32 = function(n, t) {
  return function() {
    return this.parseRecordList32(n, t);
  };
};
A.pointer = function(n) {
  return function() {
    return this.parsePointer(n);
  };
};
A.pointer32 = function(n) {
  return function() {
    return this.parsePointer32(n);
  };
};
A.tag = A.prototype.parseTag;
A.byte = A.prototype.parseByte;
A.uShort = A.offset16 = A.prototype.parseUShort;
A.uShortList = A.prototype.parseUShortList;
A.uInt24 = A.prototype.parseUInt24;
A.uLong = A.offset32 = A.prototype.parseULong;
A.uLongList = A.prototype.parseULongList;
A.fixed = A.prototype.parseFixed;
A.f2Dot14 = A.prototype.parseF2Dot14;
A.struct = A.prototype.parseStruct;
A.coverage = A.prototype.parseCoverage;
A.classDef = A.prototype.parseClassDef;
var Oo = {
  reserved: A.uShort,
  reqFeatureIndex: A.uShort,
  featureIndexes: A.uShortList
};
A.prototype.parseScriptList = function() {
  return this.parsePointer(A.recordList({
    tag: A.tag,
    script: A.pointer({
      defaultLangSys: A.pointer(Oo),
      langSysRecords: A.recordList({
        tag: A.tag,
        langSys: A.pointer(Oo)
      })
    })
  })) || [];
};
A.prototype.parseFeatureList = function() {
  return this.parsePointer(A.recordList({
    tag: A.tag,
    feature: A.pointer({
      featureParams: A.offset16,
      lookupListIndexes: A.uShortList
    })
  })) || [];
};
A.prototype.parseLookupList = function(n) {
  return this.parsePointer(A.list(A.pointer(function() {
    const t = this.parseUShort();
    G.argument(1 <= t && t <= 9, "GPOS/GSUB lookup type " + t + " unknown.");
    const e = this.parseUShort(), s = e & 16;
    return {
      lookupType: t,
      lookupFlag: e,
      subtables: this.parseList(A.pointer(n[t])),
      markFilteringSet: s ? this.parseUShort() : void 0
    };
  }))) || [];
};
A.prototype.parseFeatureVariationsList = function() {
  return this.parsePointer32(function() {
    const n = this.parseUShort(), t = this.parseUShort();
    return G.argument(n === 1 && t < 1, "GPOS/GSUB feature variations table unknown."), this.parseRecordList32({
      conditionSetOffset: A.offset32,
      featureTableSubstitutionOffset: A.offset32
    });
  }) || [];
};
A.prototype.parseVariationStore = function() {
  const n = this.relativeOffset, t = this.parseUShort(), e = {
    itemVariationStore: this.parseItemVariationStore()
  };
  return this.relativeOffset = n + t + 2, e;
};
A.prototype.parseItemVariationStore = function() {
  const n = this.relativeOffset, t = {
    format: this.parseUShort(),
    variationRegions: [],
    itemVariationSubtables: []
  }, e = this.parseOffset32(), s = this.parseUShort(), i = this.parseULongList(s);
  this.relativeOffset = n + e, t.variationRegions = this.parseVariationRegionList();
  for (let r = 0; r < s; r++) {
    const a = i[r];
    this.relativeOffset = n + a, t.itemVariationSubtables.push(this.parseItemVariationSubtable());
  }
  return t;
};
A.prototype.parseVariationRegionList = function() {
  const n = this.parseUShort(), t = this.parseUShort();
  return this.parseRecordList(t, {
    regionAxes: A.recordList(n, {
      startCoord: A.f2Dot14,
      peakCoord: A.f2Dot14,
      endCoord: A.f2Dot14
    })
  });
};
A.prototype.parseItemVariationSubtable = function() {
  const n = this.parseUShort(), t = this.parseUShort(), e = this.parseUShortList(), s = e.length;
  return {
    regionIndexes: e,
    deltaSets: n && s ? this.parseDeltaSets(n, t, s) : []
  };
};
A.prototype.parseDeltaSetIndexMap = function() {
  const n = this.parseByte(), t = this.parseByte(), e = [];
  let s = 0;
  switch (n) {
    case 0:
      s = this.parseUShort();
      break;
    case 1:
      s = this.parseULong();
      break;
    default:
      console.error(`unsupported DeltaSetIndexMap format ${n}`);
  }
  if (!s) return {
    format: n,
    entryFormat: t
  };
  const i = (t & _t.INNER_INDEX_BIT_COUNT_MASK) + 1, r = ((t & _t.MAP_ENTRY_SIZE_MASK) >> 4) + 1;
  for (let a = 0; a < s; a++) {
    let o;
    if (r === 1)
      o = this.parseByte();
    else if (r === 2)
      o = this.parseUShort();
    else if (r === 3)
      o = this.parseUInt24();
    else if (r === 4)
      o = this.parseULong();
    else
      throw new Error(`Invalid entry size of ${r}`);
    const c = o >> i, h = o & (1 << i) - 1;
    e.push({ outerIndex: c, innerIndex: h });
  }
  return {
    format: n,
    entryFormat: t,
    map: e
  };
};
A.prototype.parseDeltaSets = function(n, t, e) {
  const s = Array.from({ length: n }, () => []), i = t & _t.LONG_WORDS, r = t & _t.WORD_DELTA_COUNT_MASK;
  if (r > e)
    throw Error("wordCount must be less than or equal to regionIndexCount");
  const a = (i ? this.parseLong : this.parseShort).bind(this), o = (i ? this.parseShort : this.parseChar).bind(this);
  for (let c = 0; c < n; c++)
    for (let h = 0; h < e; h++)
      h < r ? s[c].push(a()) : s[c].push(o());
  return s;
};
A.prototype.parseTupleVariationStoreList = function(n, t, e) {
  const s = this.parseUShort(), r = this.parseUShort() & 1, a = this.parseOffset32(), o = (r ? this.parseULong : this.parseUShort).bind(this), c = {};
  let h = o();
  r || (h *= 2);
  let l;
  for (let u = 0; u < s; u++) {
    l = o(), r || (l *= 2);
    const f = l - h;
    c[u] = f ? this.parseTupleVariationStore(
      a + h,
      n,
      t,
      e,
      u
    ) : void 0, h = l;
  }
  return c;
};
A.prototype.parseTupleVariationStore = function(n, t, e, s, i) {
  const r = this.relativeOffset;
  this.relativeOffset = n, e === "cvar" && (this.relativeOffset += 4);
  const a = this.parseUShort(), o = !!(a & _t.SHARED_POINT_NUMBERS), c = a & _t.COUNT_MASK;
  let h = this.parseOffset16();
  const l = [];
  let u = [];
  for (let d = 0; d < c; d++) {
    const g = this.parseTupleVariationHeader(t, e);
    l.push(g);
  }
  this.relativeOffset !== n + h && (console.warn(`Unexpected offset after parsing tuple variation headers! Expected ${n + h}, actually ${this.relativeOffset}`), this.relativeOffset = n + h), o && (u = this.parsePackedPointNumbers());
  let f = this.relativeOffset;
  for (let d = 0; d < c; d++) {
    const g = l[d];
    g.privatePoints = [], this.relativeOffset = f, e === "cvar" && !g.peakTuple && console.warn("An embedded peak tuple is required in TupleVariationHeaders for the cvar table."), g.flags.privatePointNumbers && (g.privatePoints = this.parsePackedPointNumbers()), delete g.flags;
    const x = this.offset, b = this.relativeOffset, v = (S) => {
      let w, k;
      const M = () => {
        let O = 0;
        if (e === "gvar") {
          if (O = g.privatePoints.length || u.length, !O) {
            const I = s.get(i);
            I.path, O = I.points.length, O += 4;
          }
        } else e === "cvar" && (O = s.length);
        this.offset = x, this.relativeOffset = b, w = this.parsePackedDeltas(O), e === "gvar" && (k = this.parsePackedDeltas(O));
      };
      return {
        configurable: !0,
        get: function() {
          return w === void 0 && M(), S === "deltasY" ? k : w;
        },
        set: function(O) {
          w === void 0 && M(), S === "deltasY" ? k = O : w = O;
        }
      };
    };
    Object.defineProperty(g, "deltas", v.call(this, "deltas")), e === "gvar" && Object.defineProperty(g, "deltasY", v.call(this, "deltasY")), f += g.variationDataSize, delete g.variationDataSize;
  }
  this.relativeOffset = r;
  const p = {
    headers: l
  };
  return p.sharedPoints = u, p;
};
A.prototype.parseTupleVariationHeader = function(n, t) {
  const e = this.parseUShort(), s = this.parseUShort(), i = !!(s & _t.EMBEDDED_PEAK_TUPLE), r = !!(s & _t.INTERMEDIATE_REGION), a = !!(s & _t.PRIVATE_POINT_NUMBERS), o = i ? void 0 : s & _t.TUPLE_INDEX_MASK, c = i ? this.parseTupleRecords(1, n)[0] : void 0, h = r ? this.parseTupleRecords(1, n)[0] : void 0, l = r ? this.parseTupleRecords(1, n)[0] : void 0, u = {
    variationDataSize: e,
    peakTuple: c,
    intermediateStartTuple: h,
    intermediateEndTuple: l,
    flags: {
      embeddedPeakTuple: i,
      intermediateRegion: r,
      privatePointNumbers: a
    }
  };
  return t === "gvar" && (u.sharedTupleRecordsIndex = o), u;
};
A.prototype.parsePackedPointNumbers = function() {
  const n = this.parseByte(), t = [];
  let e = n;
  if (n >= 128) {
    const i = this.parseByte();
    e = (n & _t.POINT_RUN_COUNT_MASK) << 8 | i;
  }
  let s = 0;
  for (; t.length < e; ) {
    const i = this.parseByte(), r = !!(i & _t.POINTS_ARE_WORDS);
    let a = (i & _t.POINT_RUN_COUNT_MASK) + 1;
    for (let o = 0; o < a && t.length < e; o++) {
      let c;
      r ? c = this.parseUShort() : c = this.parseByte(), s = s + c, t.push(s);
    }
  }
  return t;
};
A.prototype.parsePackedDeltas = function(n) {
  const t = [];
  for (; t.length < n; ) {
    const e = this.parseByte(), s = !!(e & _t.DELTAS_ARE_ZERO), i = !!(e & _t.DELTAS_ARE_WORDS), r = (e & _t.DELTA_RUN_COUNT_MASK) + 1;
    for (let a = 0; a < r && t.length < n; a++)
      s ? t.push(0) : i ? t.push(this.parseShort()) : t.push(this.parseChar());
  }
  return t;
};
var N = {
  getByte: Mo,
  getCard8: Mo,
  getUShort: wi,
  getCard16: wi,
  getShort: ff,
  getUInt24: yh,
  getULong: la,
  getFixed: xh,
  getTag: df,
  getOffset: gf,
  getBytes: mf,
  bytesToString: yf,
  Parser: A
}, Ci = [
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
], bh = {
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
}, bf = {
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
}, vh = {
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
function vf(n, t, e) {
  switch (n) {
    case 0:
      if (t === 65535)
        return "und";
      if (e)
        return e[t];
      break;
    case 1:
      return bh[t];
    case 3:
      return vh[t];
  }
}
var Jr = "utf-16", Sf = {
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
}, wf = {
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
function ua(n, t, e) {
  switch (n) {
    case 0:
      return Jr;
    case 1:
      return wf[e] || Sf[t];
    case 3:
      if (t === 1 || t === 10)
        return Jr;
      break;
  }
}
var Sh = {
  0: "unicode",
  1: "macintosh",
  2: "reserved",
  3: "windows"
};
function Cf(n) {
  return Sh[n];
}
function Tf(n, t, e) {
  const s = {}, i = new N.Parser(n, t), r = i.parseUShort(), a = i.parseUShort(), o = i.offset + i.parseUShort();
  for (let c = 0; c < a; c++) {
    const h = i.parseUShort(), l = i.parseUShort(), u = i.parseUShort(), f = i.parseUShort(), p = Ci[f] || f, d = i.parseUShort(), g = i.parseUShort(), x = vf(h, u, e), b = ua(h, l, u), v = Cf(h);
    if (b !== void 0 && x !== void 0 && v !== void 0) {
      let S;
      if (b === Jr ? S = zn.UTF16(n, o + g, d) : S = zn.MACSTRING(n, o + g, d, b), S) {
        let w = s[v];
        w === void 0 && (w = s[v] = {});
        let k = w[p];
        k === void 0 && (k = w[p] = {}), k[x] = S;
      }
    }
  }
  return r === 1 && i.parseUShort(), s;
}
function Ks(n) {
  const t = {};
  for (let e in n)
    t[n[e]] = parseInt(e);
  return t;
}
function _o(n, t, e, s, i, r) {
  return new L.Record("NameRecord", [
    { name: "platformID", type: "USHORT", value: n },
    { name: "encodingID", type: "USHORT", value: t },
    { name: "languageID", type: "USHORT", value: e },
    { name: "nameID", type: "USHORT", value: s },
    { name: "length", type: "USHORT", value: i },
    { name: "offset", type: "USHORT", value: r }
  ]);
}
function kf(n, t) {
  const e = n.length, s = t.length - e + 1;
  t:
    for (let i = 0; i < s; i++)
      for (; i < s; i++) {
        for (let r = 0; r < e; r++)
          if (t[i + r] !== n[r])
            continue t;
        return i;
      }
  return -1;
}
function Lo(n, t) {
  let e = kf(n, t);
  if (e < 0) {
    e = t.length;
    let s = 0;
    const i = n.length;
    for (; s < i; ++s)
      t.push(n[s]);
  }
  return e;
}
function Af(n, t) {
  const e = Ks(Sh), s = Ks(bh), i = Ks(vh), r = [], a = [];
  for (let c in n) {
    let h;
    const l = [], u = {}, f = Ks(Ci), p = e[c];
    for (let d in n[c]) {
      let g = f[d];
      if (g === void 0 && (g = d), h = parseInt(g), isNaN(h))
        throw new Error('Name table entry "' + d + '" does not exist, see nameTableNames for complete list.');
      u[h] = n[c][d], l.push(h);
    }
    for (let d = 0; d < l.length; d++) {
      h = l[d];
      const g = u[h];
      for (let x in g) {
        const b = g[x];
        if (p === 1 || p === 0) {
          let v = s[x], S = bf[v];
          const w = ua(p, S, v);
          let k = z.MACSTRING(b, w);
          if (p === 0 && (v = t.indexOf(x), v < 0 && (v = t.length, t.push(x)), S = 4, k = z.UTF16(b)), k !== void 0) {
            const M = Lo(k, a);
            r.push(_o(
              p,
              S,
              v,
              h,
              k.length,
              M
            ));
          }
        }
        if (p === 3) {
          const v = i[x];
          if (v !== void 0) {
            const S = z.UTF16(b), w = Lo(S, a);
            r.push(_o(
              3,
              1,
              v,
              h,
              S.length,
              w
            ));
          }
        }
      }
    }
  }
  r.sort(function(c, h) {
    return c.platformID - h.platformID || c.encodingID - h.encodingID || c.languageID - h.languageID || c.nameID - h.nameID;
  });
  const o = new L.Table("name", [
    { name: "format", type: "USHORT", value: 0 },
    { name: "count", type: "USHORT", value: r.length },
    { name: "stringOffset", type: "USHORT", value: 6 + r.length * 12 }
  ]);
  for (let c = 0; c < r.length; c++)
    o.fields.push({ name: "record_" + c, type: "RECORD", value: r[c] });
  return o.fields.push({ name: "strings", type: "LITERAL", value: a }), o;
}
function Ti(n, t, e = []) {
  if (t < 256 && t in Ci) {
    if (e.length && !e.includes(parseInt(t)))
      return;
    t = Ci[t];
  }
  for (let s in n)
    for (let i in n[s])
      if (i === t || parseInt(i) === t)
        return n[s][i];
}
var wh = { parse: Tf, make: Af, getNameByID: Ti };
function Ff(n, t, e, s) {
  n.length = t.parseUShort(), n.language = t.parseUShort() - 1;
  const i = t.parseByteList(n.length), r = Object.assign({}, i), a = ua(e, s, n.language), o = mi[a];
  for (let c = 0; c < o.length; c++)
    r[o.charCodeAt(c)] = i[128 + c];
  n.glyphIndexMap = r;
}
function Ef(n, t, e) {
  t.parseUShort(), n.length = t.parseULong(), n.language = t.parseULong();
  let s;
  n.groupCount = s = t.parseULong(), n.glyphIndexMap = {};
  for (let i = 0; i < s; i += 1) {
    const r = t.parseULong(), a = t.parseULong();
    let o = t.parseULong();
    for (let c = r; c <= a; c += 1)
      n.glyphIndexMap[c] = o, e === 12 && o++;
  }
}
function Mf(n, t, e, s, i) {
  n.length = t.parseUShort(), n.language = t.parseUShort();
  let r;
  n.segCount = r = t.parseUShort() >> 1, t.skip("uShort", 3), n.glyphIndexMap = {};
  const a = new N.Parser(e, s + i + 14), o = new N.Parser(e, s + i + 16 + r * 2), c = new N.Parser(e, s + i + 16 + r * 4), h = new N.Parser(e, s + i + 16 + r * 6);
  let l = s + i + 16 + r * 8;
  for (let u = 0; u < r - 1; u += 1) {
    let f;
    const p = a.parseUShort(), d = o.parseUShort(), g = c.parseShort(), x = h.parseUShort();
    for (let b = d; b <= p; b += 1)
      x !== 0 ? (l = h.offset + h.relativeOffset - 2, l += x, l += (b - d) * 2, f = N.getUShort(e, l), f !== 0 && (f = f + g & 65535)) : f = b + g & 65535, n.glyphIndexMap[b] = f;
  }
}
function Of(n, t) {
  const e = {};
  t.skip("uLong");
  const s = t.parseULong();
  for (let i = 0; i < s; i += 1) {
    const r = t.parseUInt24(), a = {
      varSelector: r
    }, o = t.parseOffset32(), c = t.parseOffset32(), h = t.relativeOffset;
    o && (t.relativeOffset = o, a.defaultUVS = t.parseStruct({
      ranges: function() {
        return t.parseRecordList32({
          startUnicodeValue: t.parseUInt24,
          additionalCount: t.parseByte
        });
      }
    })), c && (t.relativeOffset = c, a.nonDefaultUVS = t.parseStruct({
      uvsMappings: function() {
        const l = {}, u = t.parseRecordList32({
          unicodeValue: t.parseUInt24,
          glyphID: t.parseUShort
        });
        for (let f = 0; f < u.length; f += 1)
          l[u[f].unicodeValue] = u[f];
        return l;
      }
    })), e[r] = a, t.relativeOffset = h;
  }
  n.varSelectorList = e;
}
function _f(n, t) {
  const e = {};
  e.version = N.getUShort(n, t), G.argument(e.version === 0, "cmap table version should be 0."), e.numTables = N.getUShort(n, t + 2);
  let s = null, i = -1, r = -1, a = null, o = null;
  const c = [0, 1, 2, 3, 4, 6], h = [0, 1, 10];
  for (let u = e.numTables - 1; u >= 0; u -= 1)
    if (a = N.getUShort(n, t + 4 + u * 8), o = N.getUShort(n, t + 4 + u * 8 + 2), a === 3 && h.includes(o) || a === 0 && c.includes(o) || a === 1 && o === 0) {
      if (r > 0) continue;
      if (r = N.getULong(n, t + 4 + u * 8 + 4), s)
        break;
    } else if (a === 0 && o === 5) {
      if (i = N.getULong(n, t + 4 + u * 8 + 4), s = new N.Parser(n, t + i), s.parseUShort() !== 14)
        i = -1, s = null;
      else if (r > 0)
        break;
    }
  if (r === -1)
    throw new Error("No valid cmap sub-tables found.");
  const l = new N.Parser(n, t + r);
  if (e.format = l.parseUShort(), e.format === 0)
    Ff(e, l, a, o);
  else if (e.format === 12 || e.format === 13)
    Ef(e, l, e.format);
  else if (e.format === 4)
    Mf(e, l, n, t, r);
  else
    throw new Error(
      "Only format 0 (platformId 1, encodingId 0), 4, 12 and 14 cmap tables are supported (found format " + e.format + ", platformId " + a + ", encodingId " + o + ")."
    );
  return s && Of(e, s), e;
}
function Lf(n, t, e) {
  n.segments.push({
    end: t,
    start: t,
    delta: -(t - e),
    offset: 0,
    glyphIndex: e
  });
}
function If(n) {
  n.segments.push({
    end: 65535,
    start: 65535,
    delta: 1,
    offset: 0
  });
}
function Rf(n) {
  if (n.length === 0) return n;
  const t = [n[0]];
  for (let e = 1; e < n.length; e++) {
    const s = t[t.length - 1], i = n[e];
    s.end + 1 === i.start && s.delta === i.delta && i.end !== 65535 ? s.end = i.end : t.push(i);
  }
  return t;
}
function Bf(n) {
  let t = !0, e;
  for (e = n.length - 1; e > 0; e -= 1)
    if (n.get(e).unicode > 65535) {
      t = !1;
      break;
    }
  let s = [
    { name: "version", type: "USHORT", value: 0 },
    { name: "numTables", type: "USHORT", value: t ? 1 : 2 },
    // CMAP 4 header
    { name: "platformID", type: "USHORT", value: 3 },
    { name: "encodingID", type: "USHORT", value: 1 },
    { name: "offset", type: "ULONG", value: t ? 12 : 20 }
  ];
  t || s.push(
    // CMAP 12 header
    { name: "cmap12PlatformID", type: "USHORT", value: 3 },
    // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
    { name: "cmap12EncodingID", type: "USHORT", value: 10 },
    { name: "cmap12Offset", type: "ULONG", value: 0 }
  ), s.push(
    // CMAP 4 Subtable
    { name: "format", type: "USHORT", value: 4 },
    { name: "cmap4Length", type: "USHORT", value: 0 },
    { name: "language", type: "USHORT", value: 0 },
    { name: "segCountX2", type: "USHORT", value: 0 },
    { name: "searchRange", type: "USHORT", value: 0 },
    { name: "entrySelector", type: "USHORT", value: 0 },
    { name: "rangeShift", type: "USHORT", value: 0 }
  );
  const i = new L.Table("cmap", s);
  for (i.segments = [], e = 0; e < n.length; e += 1) {
    const p = n.get(e);
    for (let d = 0; d < p.unicodes.length; d += 1)
      Lf(i, p.unicodes[d], e);
  }
  i.segments.sort(function(p, d) {
    return p.start - d.start;
  }), i.segments = Rf(i.segments), If(i);
  const r = i.segments.length;
  let a = 0, o = [], c = [], h = [], l = [], u = [], f = [];
  for (e = 0; e < r; e += 1) {
    const p = i.segments[e];
    p.end <= 65535 && p.start <= 65535 ? (o.push({ name: "end_" + e, type: "USHORT", value: p.end }), c.push({ name: "start_" + e, type: "USHORT", value: p.start }), h.push({ name: "idDelta_" + e, type: "SHORT", value: p.delta }), l.push({ name: "idRangeOffset_" + e, type: "USHORT", value: p.offset }), p.glyphId !== void 0 && u.push({ name: "glyph_" + e, type: "USHORT", value: p.glyphId })) : a += 1, !t && p.glyphIndex !== void 0 && (f.push({ name: "cmap12Start_" + e, type: "ULONG", value: p.start }), f.push({ name: "cmap12End_" + e, type: "ULONG", value: p.end }), f.push({ name: "cmap12Glyph_" + e, type: "ULONG", value: p.glyphIndex }));
  }
  i.segCountX2 = (r - a) * 2, i.searchRange = Math.pow(2, Math.floor(Math.log(r - a) / Math.log(2))) * 2, i.entrySelector = Math.log(i.searchRange / 2) / Math.log(2), i.rangeShift = i.segCountX2 - i.searchRange;
  for (let p = 0; p < o.length; p++)
    i.fields.push(o[p]);
  i.fields.push({ name: "reservedPad", type: "USHORT", value: 0 });
  for (let p = 0; p < c.length; p++)
    i.fields.push(c[p]);
  for (let p = 0; p < h.length; p++)
    i.fields.push(h[p]);
  for (let p = 0; p < l.length; p++)
    i.fields.push(l[p]);
  for (let p = 0; p < u.length; p++)
    i.fields.push(u[p]);
  if (i.cmap4Length = 14 + // Subtable header
  o.length * 2 + 2 + // reservedPad
  c.length * 2 + h.length * 2 + l.length * 2 + u.length * 2, !t) {
    const p = 16 + // Subtable header
    f.length * 4;
    i.cmap12Offset = 12 + 2 * 2 + 4 + i.cmap4Length, i.fields.push({ name: "cmap12Format", type: "USHORT", value: 12 }, { name: "cmap12Reserved", type: "USHORT", value: 0 }, { name: "cmap12Length", type: "ULONG", value: p }, { name: "cmap12Language", type: "ULONG", value: 0 }, { name: "cmap12nGroups", type: "ULONG", value: f.length / 3 });
    for (let d = 0; d < f.length; d++)
      i.fields.push(f[d]);
  }
  return i;
}
var Ch = { parse: _f, make: Bf }, ii = [
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
], Df = [
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
  "zcaron"
], Uf = [
  ".notdef",
  "space",
  "exclamsmall",
  "Hungarumlautsmall",
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
  "fi",
  "fl",
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
], Pf = [
  ".notdef",
  "space",
  "dollaroldstyle",
  "dollarsuperior",
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
  "fi",
  "fl",
  "ffi",
  "ffl",
  "parenleftinferior",
  "parenrightinferior",
  "hyphensuperior",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "centoldstyle",
  "figuredash",
  "hypheninferior",
  "onequarter",
  "onehalf",
  "threequarters",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
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
  "commainferior"
], Kr = [
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
], zf = [
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
], an = [
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
function Th(n) {
  this.font = n;
}
Th.prototype.charToGlyphIndex = function(n) {
  const t = n.codePointAt(0), e = this.font.glyphs;
  if (e)
    for (let s = 0; s < e.length; s += 1) {
      const i = e.get(s);
      for (let r = 0; r < i.unicodes.length; r += 1)
        if (i.unicodes[r] === t)
          return s;
    }
  return null;
};
function kh(n) {
  this.cmap = n;
}
kh.prototype.charToGlyphIndex = function(n) {
  return this.cmap.glyphIndexMap[n.codePointAt(0)] || 0;
};
function Ah(n, t) {
  this.encoding = n, this.charset = t;
}
Ah.prototype.charToGlyphIndex = function(n) {
  const t = n.codePointAt(0), e = this.encoding[t];
  return this.charset.indexOf(e);
};
function fa(n) {
  switch (n.version) {
    case 1:
      this.names = an.slice();
      break;
    case 2:
      this.names = new Array(n.numberOfGlyphs);
      for (let t = 0; t < n.numberOfGlyphs; t++)
        n.glyphNameIndex[t] < an.length ? this.names[t] = an[n.glyphNameIndex[t]] : this.names[t] = n.names[n.glyphNameIndex[t] - an.length];
      break;
    case 2.5:
      this.names = new Array(n.numberOfGlyphs);
      for (let t = 0; t < n.numberOfGlyphs; t++)
        this.names[t] = an[t + n.glyphNameIndex[t]];
      break;
    case 3:
      this.names = [];
      break;
    default:
      this.names = [];
      break;
  }
}
fa.prototype.nameToGlyphIndex = function(n) {
  return this.names.indexOf(n);
};
fa.prototype.glyphIndexToName = function(n) {
  return this.names[n];
};
function Nf(n) {
  let t;
  const e = n.tables.cmap.glyphIndexMap, s = Object.keys(e);
  for (let i = 0; i < s.length; i += 1) {
    const r = s[i], a = e[r];
    t = n.glyphs.get(a), t.addUnicode(parseInt(r));
  }
  for (let i = 0; i < n.glyphs.length; i += 1)
    t = n.glyphs.get(i), n.cffEncoding ? t.name = n.cffEncoding.charset[i] : n.glyphNames.names && (t.name = n.glyphNames.glyphIndexToName(i));
}
function Hf(n) {
  n._IndexToUnicodeMap = {};
  const t = n.tables.cmap.glyphIndexMap, e = Object.keys(t);
  for (let s = 0; s < e.length; s += 1) {
    const i = e[s];
    let r = t[i];
    n._IndexToUnicodeMap[r] === void 0 ? n._IndexToUnicodeMap[r] = {
      unicodes: [parseInt(i)]
    } : n._IndexToUnicodeMap[r].unicodes.push(parseInt(i));
  }
}
function Gf(n, t) {
  t.lowMemory ? Hf(n) : Nf(n);
}
function Vf(n, t, e, s, i) {
  n.beginPath(), n.moveTo(t, e), n.lineTo(s, i), n.stroke();
}
var nn = { line: Vf };
function Wf(n, t) {
  const e = new A(n, t), s = e.parseShort();
  s !== 0 && console.warn("Only CPALv0 is currently fully supported.");
  const i = e.parseShort(), r = e.parseShort(), a = e.parseShort(), o = e.parseOffset32(), c = e.parseUShortList(r);
  e.relativeOffset = o;
  const h = e.parseULongList(a);
  return e.relativeOffset = o, {
    version: s,
    numPaletteEntries: i,
    colorRecords: h,
    colorRecordIndices: c
  };
}
function qf({ version: n = 0, numPaletteEntries: t = 0, colorRecords: e = [], colorRecordIndices: s = [0] }) {
  return G.argument(n === 0, "Only CPALv0 are supported."), G.argument(e.length, "No colorRecords given."), G.argument(s.length, "No colorRecordIndices given."), s.length > 1 && G.argument(t, "Can't infer numPaletteEntries on multiple colorRecordIndices"), new L.Table("CPAL", [
    { name: "version", type: "USHORT", value: n },
    { name: "numPaletteEntries", type: "USHORT", value: t || e.length },
    { name: "numPalettes", type: "USHORT", value: s.length },
    { name: "numColorRecords", type: "USHORT", value: e.length },
    { name: "colorRecordsArrayOffset", type: "ULONG", value: 12 + 2 * s.length },
    ...s.map((i, r) => ({ name: "colorRecordIndices_" + r, type: "USHORT", value: i })),
    ...e.map((i, r) => ({ name: "colorRecords_" + r, type: "ULONG", value: i }))
  ]);
}
function Fh(n) {
  var t = (n & 4278190080) >> 24, e = (n & 16711680) >> 16, s = (n & 65280) >> 8, i = n & 255;
  return t = t + 256 & 255, e = e + 256 & 255, s = s + 256 & 255, i = (i + 256 & 255) / 255, { b: t, g: e, r: s, a: i };
}
function pa(n, t, e = 0, s = "hexa") {
  if (t == 65535)
    return "currentColor";
  const i = n && n.tables && n.tables.cpal;
  if (!i) return "currentColor";
  if (e > i.colorRecordIndices.length - 1)
    throw new Error(`Palette index out of range (colorRecordIndices.length: ${i.colorRecordIndices.length}, index: ${t})`);
  if (t > i.numPaletteEntries)
    throw new Error(`Color index out of range (numPaletteEntries: ${i.numPaletteEntries}, index: ${t})`);
  const r = i.colorRecordIndices[e] + t;
  if (r > i.colorRecords)
    throw new Error(`Color index out of range (colorRecords.length: ${i.colorRecords.length}, lookupIndex: ${r})`);
  const a = Fh(i.colorRecords[r]);
  return s === "bgra" ? a : Gn(a, s);
}
function ae(n) {
  return ("0" + parseInt(n).toString(16)).slice(-2);
}
function jf(n) {
  const t = n.r / 255, e = n.g / 255, s = n.b / 255, i = Math.max(t, e, s), r = Math.min(t, e, s);
  let a, o, c = (i + r) / 2;
  if (i === r)
    a = o = 0;
  else {
    const h = i - r;
    switch (o = c > 0.5 ? h / (2 - i - r) : h / (i + r), i) {
      case t:
        a = (e - s) / h + (e < s ? 6 : 0);
        break;
      case e:
        a = (s - t) / h + 2;
        break;
      case s:
        a = (t - e) / h + 4;
        break;
    }
    a /= 6;
  }
  return {
    h: a * 360,
    s: o * 100,
    l: c * 100
  };
}
function $f(n) {
  let { h: t, s: e, l: s, a: i } = n;
  t = t % 360, e /= 100, s /= 100;
  const r = (1 - Math.abs(2 * s - 1)) * e, a = r * (1 - Math.abs(t / 60 % 2 - 1)), o = s - r / 2;
  let c = 0, h = 0, l = 0;
  return 0 <= t && t < 60 ? (c = r, h = a, l = 0) : 60 <= t && t < 120 ? (c = a, h = r, l = 0) : 120 <= t && t < 180 ? (c = 0, h = r, l = a) : 180 <= t && t < 240 ? (c = 0, h = a, l = r) : 240 <= t && t < 300 ? (c = a, h = 0, l = r) : 300 <= t && t <= 360 && (c = r, h = 0, l = a), {
    r: Math.round((c + o) * 255),
    g: Math.round((h + o) * 255),
    b: Math.round((l + o) * 255),
    a: i
  };
}
function Eh(n) {
  return parseInt(`0x${ae(n.b)}${ae(n.g)}${ae(n.r)}${ae(n.a * 255)}`, 16);
}
function ki(n, t = "hexa") {
  const e = t == "raw" || t == "cpal", s = Number.isInteger(n);
  let i = !0;
  if (s && e || n === "currentColor")
    return n;
  if (typeof n == "object") {
    if (t == "bgra")
      return n;
    if (e)
      return Eh(n);
  } else if (!s && /^#([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(n.trim())) {
    switch (n = n.trim().substring(1), n.length) {
      case 3:
        n = {
          r: parseInt(n[0].repeat(2), 16),
          g: parseInt(n[1].repeat(2), 16),
          b: parseInt(n[2].repeat(2), 16),
          a: 1
        };
        break;
      case 4:
        n = {
          r: parseInt(n[0].repeat(2), 16),
          g: parseInt(n[1].repeat(2), 16),
          b: parseInt(n[2].repeat(2), 16),
          a: parseInt(n[3].repeat(2), 16) / 255
        };
        break;
      case 6:
        n = {
          r: parseInt(n[0] + n[1], 16),
          g: parseInt(n[2] + n[3], 16),
          b: parseInt(n[4] + n[5], 16),
          a: 1
        };
        break;
      case 8:
        n = {
          r: parseInt(n[0] + n[1], 16),
          g: parseInt(n[2] + n[3], 16),
          b: parseInt(n[4] + n[5], 16),
          a: parseInt(n[6] + n[7], 16) / 255
        };
        break;
    }
    if (t == "bgra")
      return n;
  } else if (typeof document < "u" && /^[a-z]+$/i.test(n)) {
    const r = document.createElement("canvas").getContext("2d");
    r.fillStyle = n;
    const a = Gn(r.fillStyle, "hexa");
    a === "#000000ff" && n.toLowerCase() !== "black" ? i = !1 : n = a;
  } else {
    n = n.trim();
    const r = /rgba?\(\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:,|\s*)\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:,|\s*)\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:(?:,|\s|\/)\s*(?:(0*(?:\.\d+)?()|0*1(?:\.0+)?())|(?:\.\d+)|(\d+)(%)|(\d*\.\d+)(%)))?\s*\)/;
    if (r.test(n)) {
      const a = n.match(r).filter((o) => typeof o < "u");
      n = {
        r: Math.round(parseFloat(a[1]) / (a[2] ? 100 / 255 : 1)),
        g: Math.round(parseFloat(a[3]) / (a[4] ? 100 / 255 : 1)),
        b: Math.round(parseFloat(a[5]) / (a[6] ? 100 / 255 : 1)),
        a: a[7] ? parseFloat(a[7]) / (a[8] ? 100 : 1) : 1
      };
    } else {
      const a = /hsla?\(\s*(?:(\d*\.\d+|\d+)(deg|turn|))\s*(?:,|\s*)\s*(?:(\d*\.\d+)%?|(\d+)%?)\s*(?:,|\s*)\s*(?:(\d*\.\d+)%?|(\d+)%?)\s*(?:(?:,|\s|\/)\s*(?:(0*(?:\.\d+)?()|0*1(?:\.0+)?())|(?:\.\d+)|(\d+)(%)|(\d*\.\d+)(%)))?\s*\)/;
      if (a.test(n)) {
        const o = n.match(a).filter((c) => typeof c < "u");
        n = $f({
          h: parseFloat(o[1]) * (o[2] === "turn" ? 360 : 1),
          s: parseFloat(o[3]),
          l: parseFloat(o[4]),
          a: o[5] ? parseFloat(o[5]) / (o[6] ? 100 : 1) : 1
        });
      } else
        i = !1;
    }
  }
  if (!i)
    throw new Error(`Invalid color format: ${n}`);
  return Gn(n, t);
}
function Gn(n, t = "hexa") {
  if (n === "currentColor") return n;
  if (Number.isInteger(n)) {
    if (t == "raw" || t == "cpal")
      return n;
    n = Fh(n);
  } else typeof n != "object" && (n = ki(n, "bgra"));
  let e = ["hsl", "hsla"].includes(t) ? jf(n) : null;
  switch (t) {
    case "rgba":
      return `rgba(${n.r}, ${n.g}, ${n.b}, ${parseFloat(n.a.toFixed(3))})`;
    case "rgb":
      return `rgb(${n.r}, ${n.g}, ${n.b})`;
    case "hex":
    case "hex6":
    case "hex-6":
      return `#${ae(n.r)}${ae(n.g)}${ae(n.b)}`;
    case "hexa":
    case "hex8":
    case "hex-8":
      return `#${ae(n.r)}${ae(n.g)}${ae(n.b)}${ae(n.a * 255)}`;
    case "hsl":
      return `hsl(${e.h.toFixed(2)}, ${e.s.toFixed(2)}%, ${e.l.toFixed(2)}%)`;
    case "hsla":
      return `hsla(${e.h.toFixed(2)}, ${e.s.toFixed(2)}%, ${e.l.toFixed(2)}%, ${parseFloat(n.a.toFixed(3))})`;
    case "bgra":
      return n;
    case "raw":
    case "cpal":
      return Eh(n);
    default:
      throw new Error("Unknown color format: " + t);
  }
}
var Mh = { parse: Wf, make: qf, getPaletteColor: pa, parseColor: ki, formatColor: Gn };
function Xf(n, t) {
  let e = t || new Pn();
  return {
    configurable: !0,
    get: function() {
      return typeof e == "function" && (e = e()), e;
    },
    set: function(s) {
      e = s;
    }
  };
}
function Lt(n) {
  this.bindConstructorValues(n);
}
Lt.prototype.bindConstructorValues = function(n) {
  if (this.index = n.index || 0, n.name === ".notdef" ? n.unicode = void 0 : n.name === ".null" && (n.unicode = 0), n.unicode === 0 && n.name !== ".null")
    throw new Error('The unicode value "0" is reserved for the glyph name ".null" and cannot be used by any other glyph.');
  this.name = n.name || null, this.unicode = n.unicode, this.unicodes = n.unicodes || (n.unicode !== void 0 ? [n.unicode] : []), "xMin" in n && (this.xMin = n.xMin), "yMin" in n && (this.yMin = n.yMin), "xMax" in n && (this.xMax = n.xMax), "yMax" in n && (this.yMax = n.yMax), "advanceWidth" in n && (this.advanceWidth = n.advanceWidth), "leftSideBearing" in n && (this.leftSideBearing = n.leftSideBearing), "points" in n && (this.points = n.points), Object.defineProperty(this, "path", Xf(this, n.path));
};
Lt.prototype.addUnicode = function(n) {
  this.unicodes.length === 0 && (this.unicode = n), this.unicodes.push(n);
};
Lt.prototype.getBoundingBox = function() {
  return this.path.getBoundingBox();
};
Lt.prototype.getPath = function(n, t, e, s, i) {
  n = n !== void 0 ? n : 0, t = t !== void 0 ? t : 0, e = e !== void 0 ? e : 72, s = Object.assign({}, i && i.defaultRenderOptions, s);
  let r, a, o = s.xScale, c = s.yScale;
  const h = 1 / (this.path.unitsPerEm || 1e3) * e;
  let l = this;
  i && i.variation && (l = i.variation.getTransform(this, s.variation), r = l.path.commands), s.hinting && i && i.hinting && (a = l.path && i.hinting.exec(l, e, s)), a ? (r = i.hinting.getCommands(a), n = Math.round(n), t = Math.round(t), o = c = 1) : (r = l.path.commands, o === void 0 && (o = h), c === void 0 && (c = h));
  const u = new Pn();
  if (s.drawSVG) {
    const f = this.getSvgImage(i);
    if (f) {
      const p = new Pn();
      return p._image = {
        image: f.image,
        x: n + f.leftSideBearing * h,
        y: t - f.baseline * h,
        width: f.image.width * h,
        height: f.image.height * h
      }, u._layers = [p], u;
    }
  }
  if (s.drawLayers) {
    const f = this.getLayers(i);
    if (f && f.length) {
      u._layers = [];
      for (let p = 0; p < f.length; p += 1) {
        const d = f[p];
        let g = pa(i, d.paletteIndex, s.usePalette);
        g === "currentColor" ? g = s.fill || "black" : g = Gn(g, s.colorFormat || "rgba"), s = Object.assign({}, s, { fill: g }), u._layers.push(this.getPath.call(d.glyph, n, t, e, s, i));
      }
      return u;
    }
  }
  u.fill = s.fill || this.path.fill, u.stroke = this.path.stroke, u.strokeWidth = this.path.strokeWidth * h;
  for (let f = 0; f < r.length; f += 1) {
    const p = r[f];
    p.type === "M" ? u.moveTo(n + p.x * o, t + -p.y * c) : p.type === "L" ? u.lineTo(n + p.x * o, t + -p.y * c) : p.type === "Q" ? u.quadraticCurveTo(
      n + p.x1 * o,
      t + -p.y1 * c,
      n + p.x * o,
      t + -p.y * c
    ) : p.type === "C" ? u.curveTo(
      n + p.x1 * o,
      t + -p.y1 * c,
      n + p.x2 * o,
      t + -p.y2 * c,
      n + p.x * o,
      t + -p.y * c
    ) : p.type === "Z" && u.stroke && u.strokeWidth && u.closePath();
  }
  return u;
};
Lt.prototype.getLayers = function(n) {
  if (!n)
    throw new Error("The font object is required to read the colr/cpal tables in order to get the layers.");
  return n.layers.get(this.index);
};
Lt.prototype.getSvgImage = function(n) {
  if (!n)
    throw new Error("The font object is required to read the svg table in order to get the image.");
  return n.svgImages.get(this.index);
};
Lt.prototype.getContours = function(n = null) {
  if (this.points === void 0 && !n)
    return [];
  const t = [];
  let e = [], s = n || this.points;
  for (let i = 0; i < s.length; i += 1) {
    const r = s[i];
    e.push(r), r.lastPointOfContour && (t.push(e), e = []);
  }
  return G.argument(e.length === 0, "There are still points left in the current contour."), t;
};
Lt.prototype.getMetrics = function() {
  const n = this.path.commands, t = [], e = [];
  for (let i = 0; i < n.length; i += 1) {
    const r = n[i];
    r.type !== "Z" && (t.push(r.x), e.push(r.y)), (r.type === "Q" || r.type === "C") && (t.push(r.x1), e.push(r.y1)), r.type === "C" && (t.push(r.x2), e.push(r.y2));
  }
  const s = {
    xMin: Math.min.apply(null, t),
    yMin: Math.min.apply(null, e),
    xMax: Math.max.apply(null, t),
    yMax: Math.max.apply(null, e),
    leftSideBearing: this.leftSideBearing
  };
  return isFinite(s.xMin) || (s.xMin = 0), isFinite(s.xMax) || (s.xMax = this.advanceWidth), isFinite(s.yMin) || (s.yMin = 0), isFinite(s.yMax) || (s.yMax = 0), s.rightSideBearing = this.advanceWidth - s.leftSideBearing - (s.xMax - s.xMin), s;
};
Lt.prototype.draw = function(n, t, e, s, i, r) {
  i = Object.assign({}, r && r.defaultRenderOptions, i), this.getPath(t, e, s, i, r).draw(n);
};
Lt.prototype.drawPoints = function(n, t, e, s, i, r) {
  if (i = Object.assign({}, r && r.defaultRenderOptions, i), i.drawLayers) {
    const f = this.getLayers(r);
    if (f && f.length) {
      for (let p = 0; p < f.length; p += 1)
        f[p].glyph.index !== this.index && this.drawPoints.call(f[p].glyph, n, t, e, s);
      return;
    }
  }
  function a(f, p, d, g) {
    n.beginPath();
    for (let x = 0; x < f.length; x += 1)
      n.moveTo(p + f[x].x * g, d + f[x].y * g), n.arc(p + f[x].x * g, d + f[x].y * g, 2, 0, Math.PI * 2, !1);
    n.fill();
  }
  t = t !== void 0 ? t : 0, e = e !== void 0 ? e : 0, s = s !== void 0 ? s : 24;
  const o = 1 / this.path.unitsPerEm * s, c = [], h = [];
  let u = this.path.commands;
  r && r.variation && (u = r.variation.getTransform(this, i.variation).path.commands);
  for (let f = 0; f < u.length; f += 1) {
    const p = u[f];
    p.x !== void 0 && c.push({ x: p.x, y: -p.y }), p.x1 !== void 0 && h.push({ x: p.x1, y: -p.y1 }), p.x2 !== void 0 && h.push({ x: p.x2, y: -p.y2 });
  }
  n.fillStyle = "blue", a(c, t, e, o), n.fillStyle = "red", a(h, t, e, o);
};
Lt.prototype.drawMetrics = function(n, t, e, s) {
  let i;
  t = t !== void 0 ? t : 0, e = e !== void 0 ? e : 0, s = s !== void 0 ? s : 24, i = 1 / this.path.unitsPerEm * s, n.lineWidth = 1, n.strokeStyle = "black", nn.line(n, t, -1e4, t, 1e4), nn.line(n, -1e4, e, 1e4, e);
  const r = this.xMin || 0;
  let a = this.yMin || 0;
  const o = this.xMax || 0;
  let c = this.yMax || 0;
  const h = this.advanceWidth || 0;
  n.strokeStyle = "blue", nn.line(n, t + r * i, -1e4, t + r * i, 1e4), nn.line(n, t + o * i, -1e4, t + o * i, 1e4), nn.line(n, -1e4, e + -a * i, 1e4, e + -a * i), nn.line(n, -1e4, e + -c * i, 1e4, e + -c * i), n.strokeStyle = "green", nn.line(n, t + h * i, -1e4, t + h * i, 1e4);
};
Lt.prototype.toPathData = function(n, t) {
  n = Object.assign({}, { variation: t && t.defaultRenderOptions.variation }, n);
  let e = this;
  t && t.variation && (e = t.variation.getTransform(this, n.variation));
  let s = e.points && n.pointsTransform ? n.pointsTransform(e.points) : e.path;
  return n.pathTransform && (s = n.pathTransform(s)), s.toPathData(n);
};
Lt.prototype.fromSVG = function(n, t = {}) {
  return this.path.fromSVG(n, t);
};
Lt.prototype.toSVG = function(n, t) {
  const e = this.toPathData.apply(this, [n, t]);
  return this.path.toSVG(n, e);
};
Lt.prototype.toDOMElement = function(n, t) {
  n = Object.assign({}, { variation: t && t.defaultRenderOptions.variation }, n);
  let e = this.path;
  return t && t.variation && (e = t.variation.getTransform(this, n.variation).path), e.toDOMElement(n);
};
var ps = Lt;
function Mn(n, t, e) {
  Object.defineProperty(n, t, {
    get: function() {
      return typeof n[e] > "u" && n.path, n[e];
    },
    set: function(s) {
      n[e] = s;
    },
    enumerable: !0,
    configurable: !0
  });
}
function Ri(n, t) {
  if (this.font = n, this.glyphs = {}, Array.isArray(t))
    for (let e = 0; e < t.length; e++) {
      const s = t[e];
      s.path.unitsPerEm = n.unitsPerEm, this.glyphs[e] = s;
    }
  this.length = t && t.length || 0;
}
typeof Symbol < "u" && Symbol.iterator && (Ri.prototype[Symbol.iterator] = function() {
  let n = -1;
  return {
    next: (function() {
      n++;
      const t = n >= this.length - 1;
      return { value: this.get(n), done: t };
    }).bind(this)
  };
});
Ri.prototype.get = function(n) {
  if (this.font._push && this.glyphs[n] === void 0) {
    this.font._push(n), typeof this.glyphs[n] == "function" && (this.glyphs[n] = this.glyphs[n]());
    let t = this.glyphs[n], e = this.font._IndexToUnicodeMap[n];
    if (e)
      for (let s = 0; s < e.unicodes.length; s++)
        t.addUnicode(e.unicodes[s]);
    this.font.cffEncoding ? t.name = this.font.cffEncoding.charset[n] : this.font.glyphNames.names && (t.name = this.font.glyphNames.glyphIndexToName(n)), this.glyphs[n].advanceWidth = this.font._hmtxTableData[n].advanceWidth, this.glyphs[n].leftSideBearing = this.font._hmtxTableData[n].leftSideBearing;
  } else
    typeof this.glyphs[n] == "function" && (this.glyphs[n] = this.glyphs[n]());
  return this.glyphs[n];
};
Ri.prototype.push = function(n, t) {
  this.glyphs[n] = t, this.length++;
};
function Yf(n, t) {
  return new ps({ index: t, font: n });
}
function Zf(n, t, e, s, i, r) {
  return function() {
    const a = new ps({ index: t, font: n });
    return a.path = function() {
      e(a, s, i);
      const o = r(n.glyphs, a);
      return o.unitsPerEm = n.unitsPerEm, o;
    }, Mn(a, "numberOfContours", "_numberOfContours"), Mn(a, "xMin", "_xMin"), Mn(a, "xMax", "_xMax"), Mn(a, "yMin", "_yMin"), Mn(a, "yMax", "_yMax"), Mn(a, "points", "_points"), a;
  };
}
function Jf(n, t, e, s, i) {
  return function() {
    const r = new ps({ index: t, font: n });
    return r.path = function() {
      const a = e(n, r, s, i);
      return a.unitsPerEm = n.unitsPerEm, a;
    }, r;
  };
}
var be = { GlyphSet: Ri, glyphLoader: Yf, ttfGlyphLoader: Zf, cffGlyphLoader: Jf };
function Oh(n, t) {
  if (n === t)
    return !0;
  if (Array.isArray(n) && Array.isArray(t)) {
    if (n.length !== t.length)
      return !1;
    for (let e = 0; e < n.length; e += 1)
      if (!Oh(n[e], t[e]))
        return !1;
    return !0;
  } else
    return !1;
}
var Io = 10;
function Ai(n) {
  let t;
  return n.length < 1240 ? t = 107 : n.length < 33900 ? t = 1131 : t = 32768, t;
}
function de(n, t, e, s) {
  const i = [], r = [], a = s > 1 ? N.getULong(n, t) : N.getCard16(n, t), o = s > 1 ? 4 : 2;
  let c, h;
  if (a !== 0) {
    const l = N.getByte(n, t + o);
    c = t + (a + 1) * l + o;
    let u = t + o + 1;
    for (let f = 0; f < a + 1; f += 1)
      i.push(N.getOffset(n, u, l)), u += l;
    h = c + i[a];
  } else
    h = t + o;
  for (let l = 0; l < i.length - 1; l += 1) {
    let u = N.getBytes(n, c + i[l], c + i[l + 1]);
    e && (u = e(u, n, t, s)), r.push(u);
  }
  return { objects: r, startOffset: t, endOffset: h };
}
function Kf(n, t, e) {
  const s = [], i = e > 1 ? N.getULong(n, t) : N.getCard16(n, t), r = e > 1 ? 4 : 2;
  let a, o;
  if (i !== 0) {
    const c = N.getByte(n, t + r);
    a = t + (i + 1) * c + r;
    let h = t + r + 1;
    for (let l = 0; l < i + 1; l += 1)
      s.push(N.getOffset(n, h, c)), h += c;
    o = a + s[i];
  } else
    o = t + r;
  return { offsets: s, startOffset: t, endOffset: o };
}
function Qf(n, t, e, s, i, r) {
  const a = r > 1 ? N.getULong(e, s) : N.getCard16(e, s), o = r > 1 ? 4 : 2;
  let c = 0;
  if (a !== 0) {
    const l = N.getByte(e, s + o);
    c = s + (a + 1) * l + o;
  }
  return N.getBytes(e, c + t[n], c + t[n + 1]);
}
function tp(n) {
  let t = "";
  const s = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"];
  for (; ; ) {
    const i = n.parseByte(), r = i >> 4, a = i & 15;
    if (r === 15 || (t += s[r], a === 15))
      break;
    t += s[a];
  }
  return parseFloat(t);
}
function ep(n, t) {
  let e, s, i, r;
  if (t === 28)
    return e = n.parseByte(), s = n.parseByte(), e << 8 | s;
  if (t === 29)
    return e = n.parseByte(), s = n.parseByte(), i = n.parseByte(), r = n.parseByte(), e << 24 | s << 16 | i << 8 | r;
  if (t === 30)
    return tp(n);
  if (t >= 32 && t <= 246)
    return t - 139;
  if (t >= 247 && t <= 250)
    return e = n.parseByte(), (t - 247) * 256 + e + 108;
  if (t >= 251 && t <= 254)
    return e = n.parseByte(), -(t - 251) * 256 - e - 108;
  throw new Error("Invalid b0 " + t);
}
function np(n) {
  const t = {};
  for (let e = 0; e < n.length; e += 1) {
    const s = n[e][0], i = n[e][1];
    let r;
    if (i.length === 1 ? r = i[0] : r = i, Object.prototype.hasOwnProperty.call(t, s) && !isNaN(t[s]))
      throw new Error("Object " + t + " already has key " + s);
    t[s] = r;
  }
  return t;
}
function da(n, t, e, s) {
  t = t !== void 0 ? t : 0;
  const i = new N.Parser(n, t), r = [];
  let a = [];
  e = e !== void 0 ? e : n.byteLength;
  let o = s < 2 ? 22 : 28;
  for (; i.relativeOffset < e; ) {
    let c = i.parseByte();
    if (c < o) {
      if (c === 12 && (c = 1200 + i.parseByte()), s > 1 && c === 23) {
        fp(a);
        continue;
      }
      r.push([c, a]), a = [];
    } else
      a.push(ep(i, c));
  }
  return np(r);
}
function rs(n, t) {
  return t <= 390 ? t = ii[t] : n ? t = n[t - 391] : t = void 0, t;
}
function ga(n, t, e) {
  const s = {};
  let i;
  for (let r = 0; r < t.length; r += 1) {
    const a = t[r];
    if (Array.isArray(a.type)) {
      const o = [];
      o.length = a.type.length;
      for (let c = 0; c < a.type.length; c++)
        i = n[a.op] !== void 0 ? n[a.op][c] : void 0, i === void 0 && (i = a.value !== void 0 && a.value[c] !== void 0 ? a.value[c] : null), a.type[c] === "SID" && (i = rs(e, i)), o[c] = i;
      s[a.name] = o;
    } else
      i = n[a.op], i === void 0 && (i = a.value !== void 0 ? a.value : null), a.type === "SID" && (i = rs(e, i)), s[a.name] = i;
  }
  return s;
}
function sp(n, t) {
  const e = {};
  if (e.formatMajor = N.getCard8(n, t), e.formatMinor = N.getCard8(n, t + 1), e.formatMajor > 2)
    throw new Error(`Unsupported CFF table version ${e.formatMajor}.${e.formatMinor}`);
  return e.size = N.getCard8(n, t + 2), e.formatMajor < 2 ? (e.offsetSize = N.getCard8(n, t + 3), e.startOffset = t, e.endOffset = t + 4) : (e.topDictLength = N.getCard16(n, t + 3), e.endOffset = t + 8), e;
}
var _h = [
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
], ip = [
  {
    name: "fontMatrix",
    op: 1207,
    type: ["real", "real", "real", "real", "real", "real"],
    value: [1e-3, 0, 0, 1e-3, 0, 0]
  },
  { name: "charStrings", op: 17, type: "offset" },
  { name: "fdArray", op: 1236, type: "offset" },
  { name: "fdSelect", op: 1237, type: "offset" },
  { name: "vstore", op: 24, type: "offset" }
], Lh = [
  { name: "subrs", op: 19, type: "offset", value: 0 },
  { name: "defaultWidthX", op: 20, type: "number", value: 0 },
  { name: "nominalWidthX", op: 21, type: "number", value: 0 }
], rp = [
  { name: "blueValues", op: 6, type: "delta" },
  { name: "otherBlues", op: 7, type: "delta" },
  { name: "familyBlues", op: 7, type: "delta" },
  { name: "familyBlues", op: 8, type: "delta" },
  { name: "familyOtherBlues", op: 9, type: "delta" },
  { name: "blueScale", op: 1209, type: "number", value: 0.039625 },
  { name: "blueShift", op: 1210, type: "number", value: 7 },
  { name: "blueFuzz", op: 1211, type: "number", value: 1 },
  { name: "stdHW", op: 10, type: "number" },
  { name: "stdVW", op: 11, type: "number" },
  { name: "stemSnapH", op: 1212, type: "number" },
  { name: "stemSnapV", op: 1213, type: "number" },
  { name: "languageGroup", op: 1217, type: "number", value: 0 },
  { name: "expansionFactor", op: 1218, type: "number", value: 0.06 },
  { name: "vsindex", op: 22, type: "number", value: 0 },
  { name: "subrs", op: 19, type: "offset" }
], ap = [
  { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] }
];
function op(n, t, e, s) {
  const i = da(n, t, n.byteLength, s);
  return ga(i, s > 1 ? ip : _h, e);
}
function ma(n, t, e, s, i) {
  const r = da(n, t, e, i);
  return ga(r, i > 1 ? rp : Lh, s);
}
function cp(n, t, e) {
  const s = da(n, t, void 0, e);
  return ga(s, ap);
}
function hp(n, t, e) {
  const s = [];
  for (let i = 0; i < e.length; i++) {
    const r = new DataView(new Uint8Array(e[i]).buffer), a = cp(r, 0, 2), o = a.private[0], c = a.private[1];
    if (o !== 0 && c !== 0) {
      const h = ma(n, c + t, o, [], 2);
      if (h.subrs) {
        const l = c + h.subrs, u = de(n, l + t, void 0, 2);
        a._subrs = u.objects, a._subrsBias = Ai(a._subrs);
      }
      a._privateDict = h;
    }
    s.push(a);
  }
  return s;
}
function yr(n, t, e, s, i) {
  const r = [];
  for (let a = 0; a < e.length; a += 1) {
    const o = new DataView(new Uint8Array(e[a]).buffer), c = op(o, 0, s, i);
    c._subrs = [], c._subrsBias = 0, c._defaultWidthX = 0, c._nominalWidthX = 0;
    const h = i < 2 ? c.private[0] : 0, l = i < 2 ? c.private[1] : 0;
    if (h !== 0 && l !== 0) {
      const u = ma(n, l + t, h, s, i);
      if (c._defaultWidthX = u.defaultWidthX, c._nominalWidthX = u.nominalWidthX, u.subrs !== 0) {
        const f = l + u.subrs, p = de(n, f + t, void 0, i);
        c._subrs = p.objects, c._subrsBias = Ai(c._subrs);
      }
      c._privateDict = u;
    }
    r.push(c);
  }
  return r;
}
function lp(n, t, e, s, i) {
  let r, a;
  const o = new N.Parser(n, t);
  e -= 1;
  const c = [".notdef"], h = o.parseCard8();
  if (h === 0)
    for (let l = 0; l < e; l += 1)
      r = o.parseSID(), i ? c.push(r) : c.push(rs(s, r) || r);
  else if (h === 1)
    for (; c.length <= e; ) {
      r = o.parseSID(), a = o.parseCard8();
      for (let l = 0; l <= a; l += 1)
        i ? c.push("cid" + ("00000" + r).slice(-5)) : c.push(rs(s, r) || r), r += 1;
    }
  else if (h === 2)
    for (; c.length <= e; ) {
      r = o.parseSID(), a = o.parseCard16();
      for (let l = 0; l <= a; l += 1)
        i ? c.push("cid" + ("00000" + r).slice(-5)) : c.push(rs(s, r) || r), r += 1;
    }
  else
    throw new Error("Unknown charset format " + h);
  return c;
}
function up(n, t) {
  let e;
  const s = {}, i = new N.Parser(n, t), r = i.parseCard8();
  if (r === 0) {
    const a = i.parseCard8();
    for (let o = 0; o < a; o += 1)
      e = i.parseCard8(), s[e] = o;
  } else if (r === 1) {
    const a = i.parseCard8();
    e = 1;
    for (let o = 0; o < a; o += 1) {
      const c = i.parseCard8(), h = i.parseCard8();
      for (let l = c; l <= c + h; l += 1)
        s[l] = e, e += 1;
    }
  } else
    throw new Error("Unknown encoding format " + r);
  return s;
}
function fp(n) {
  let t = n.pop();
  for (; n.length > t; )
    n.pop();
}
function Ih(n, t) {
  const e = n.tables.cff && n.tables.cff.topDict && n.tables.cff.topDict.paintType || 0;
  return e === 2 && (t.fill = null, t.stroke = "black", t.strokeWidth = n.tables.cff.topDict.strokeWidth || 0), e;
}
function Qr(n, t, e, s, i) {
  let r, a, o, c;
  const h = new Pn(), l = [];
  let u = 0, f = !1, p = !1, d = 0, g = 0, x, b, v, S, w = 0, k = [], M, O = 0;
  const I = n.tables.cff2 || n.tables.cff;
  if (v = I.topDict._defaultWidthX, S = I.topDict._nominalWidthX, i = i || n.variation && n.variation.get(), t.getBlendPath || (t.getBlendPath = function(U) {
    return Qr(n, t, e, s, U);
  }), n.isCIDFont || s > 1) {
    const U = I.topDict._fdSelect ? I.topDict._fdSelect[t.index] : 0, P = I.topDict._fdArray[U];
    x = P._subrs, b = P._subrsBias, s > 1 ? (k = I.topDict._vstore.itemVariationStore, w = P._privateDict.vsindex) : (v = P._defaultWidthX, S = P._nominalWidthX);
  } else
    x = I.topDict._subrs, b = I.topDict._subrsBias;
  const V = Ih(n, h);
  let D = v;
  function W(U, P) {
    p && V !== 2 && h.closePath(), h.moveTo(U, P), p = !0;
  }
  function J() {
    let U;
    U = (l.length & 1) !== 0, U && !f && (D = l.shift() + S), u += l.length >> 1, l.length = 0, f = !0;
  }
  function B(U) {
    let P, Q, gt, Dt, St, it, j, st, yt, Tt, bt, wt, ct = 0;
    for (; ct < U.length; ) {
      let At = U[ct];
      switch (ct += 1, At) {
        case 1:
          J();
          break;
        case 3:
          J();
          break;
        case 4:
          l.length > 1 && !f && (D = l.shift() + S, f = !0), g += l.pop(), W(d, g);
          break;
        case 5:
          for (; l.length > 0; )
            d += l.shift(), g += l.shift(), h.lineTo(d, g);
          break;
        case 6:
          for (; l.length > 0 && (d += l.shift(), h.lineTo(d, g), l.length !== 0); )
            g += l.shift(), h.lineTo(d, g);
          break;
        case 7:
          for (; l.length > 0 && (g += l.shift(), h.lineTo(d, g), l.length !== 0); )
            d += l.shift(), h.lineTo(d, g);
          break;
        case 8:
          for (; l.length > 0; )
            r = d + l.shift(), a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), d = o + l.shift(), g = c + l.shift(), h.curveTo(r, a, o, c, d, g);
          break;
        case 10:
          if (St = l.pop() + b, it = x[St], it) {
            if (O >= Io) {
              console.warn("CFF charstring subroutine call depth exceeded, skipping callsubr");
              break;
            }
            O++, B(it), O--;
          }
          break;
        case 11:
          if (s > 1) {
            console.error("CFF CharString operator return (11) is not supported in CFF2");
            break;
          }
          return;
        case 12:
          switch (At = U[ct], ct += 1, At) {
            case 35:
              r = d + l.shift(), a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), j = o + l.shift(), st = c + l.shift(), yt = j + l.shift(), Tt = st + l.shift(), bt = yt + l.shift(), wt = Tt + l.shift(), d = bt + l.shift(), g = wt + l.shift(), l.shift(), h.curveTo(r, a, o, c, j, st), h.curveTo(yt, Tt, bt, wt, d, g);
              break;
            case 34:
              r = d + l.shift(), a = g, o = r + l.shift(), c = a + l.shift(), j = o + l.shift(), st = c, yt = j + l.shift(), Tt = c, bt = yt + l.shift(), wt = g, d = bt + l.shift(), h.curveTo(r, a, o, c, j, st), h.curveTo(yt, Tt, bt, wt, d, g);
              break;
            case 36:
              r = d + l.shift(), a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), j = o + l.shift(), st = c, yt = j + l.shift(), Tt = c, bt = yt + l.shift(), wt = Tt + l.shift(), d = bt + l.shift(), h.curveTo(r, a, o, c, j, st), h.curveTo(yt, Tt, bt, wt, d, g);
              break;
            case 37:
              r = d + l.shift(), a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), j = o + l.shift(), st = c + l.shift(), yt = j + l.shift(), Tt = st + l.shift(), bt = yt + l.shift(), wt = Tt + l.shift(), Math.abs(bt - d) > Math.abs(wt - g) ? d = bt + l.shift() : g = wt + l.shift(), h.curveTo(r, a, o, c, j, st), h.curveTo(yt, Tt, bt, wt, d, g);
              break;
            default:
              console.log("Glyph " + t.index + ": unknown operator 1200" + At), l.length = 0;
          }
          break;
        case 14:
          if (s > 1) {
            console.error("CFF CharString operator endchar (14) is not supported in CFF2");
            break;
          }
          if (l.length >= 4) {
            const Se = Kr[l.pop()], C = Kr[l.pop()], m = l.pop(), y = l.pop();
            if (Se && C) {
              t.isComposite = !0, t.components = [];
              const T = n.cffEncoding.charset.indexOf(Se), F = n.cffEncoding.charset.indexOf(C);
              t.components.push({
                glyphIndex: F,
                dx: 0,
                dy: 0
              }), t.components.push({
                glyphIndex: T,
                dx: y,
                dy: m
              }), h.extend(n.glyphs.get(F).path);
              const _ = n.glyphs.get(T), R = JSON.parse(JSON.stringify(_.path.commands));
              for (let Y = 0; Y < R.length; Y += 1) {
                const X = R[Y];
                X.type !== "Z" && (X.x += y, X.y += m), (X.type === "Q" || X.type === "C") && (X.x1 += y, X.y1 += m), X.type === "C" && (X.x2 += y, X.y2 += m);
              }
              h.extend(R);
            }
          } else l.length > 0 && !f && (D = l.shift() + S, f = !0);
          p && V !== 2 && (h.closePath(), p = !1);
          break;
        case 15:
          if (s < 2) {
            console.error("CFF2 CharString operator vsindex (15) is not supported in CFF");
            break;
          }
          w = l.pop();
          break;
        case 16:
          if (s < 2) {
            console.error("CFF2 CharString operator blend (16) is not supported in CFF");
            break;
          }
          M || (M = n.variation && i && n.variation.process.getBlendVector(k, w, i));
          var tt = l.pop(), kt = M ? M.length : k.itemVariationSubtables[w].regionIndexes.length, Ut = tt * kt, Pt = l.length - Ut, zt = Pt - tt;
          if (M)
            for (let Se = 0; Se < tt; Se++) {
              var Gt = l[zt + Se];
              for (let C = 0; C < kt; C++)
                Gt += M[C] * l[Pt++];
              l[zt + Se] = Gt;
            }
          for (; Ut--; )
            l.pop();
          break;
        case 18:
          J();
          break;
        case 19:
        case 20:
          J(), ct += u + 7 >> 3;
          break;
        case 21:
          l.length > 2 && !f && (D = l.shift() + S, f = !0), g += l.pop(), d += l.pop(), W(d, g);
          break;
        case 22:
          l.length > 1 && !f && (D = l.shift() + S, f = !0), d += l.pop(), W(d, g);
          break;
        case 23:
          J();
          break;
        case 24:
          for (; l.length > 2; )
            r = d + l.shift(), a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), d = o + l.shift(), g = c + l.shift(), h.curveTo(r, a, o, c, d, g);
          d += l.shift(), g += l.shift(), h.lineTo(d, g);
          break;
        case 25:
          for (; l.length > 6; )
            d += l.shift(), g += l.shift(), h.lineTo(d, g);
          r = d + l.shift(), a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), d = o + l.shift(), g = c + l.shift(), h.curveTo(r, a, o, c, d, g);
          break;
        case 26:
          for (l.length & 1 && (d += l.shift()); l.length > 0; )
            r = d, a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), d = o, g = c + l.shift(), h.curveTo(r, a, o, c, d, g);
          break;
        case 27:
          for (l.length & 1 && (g += l.shift()); l.length > 0; )
            r = d + l.shift(), a = g, o = r + l.shift(), c = a + l.shift(), d = o + l.shift(), g = c, h.curveTo(r, a, o, c, d, g);
          break;
        case 28:
          P = U[ct], Q = U[ct + 1], l.push((P << 24 | Q << 16) >> 16), ct += 2;
          break;
        case 29:
          if (St = l.pop() + n.gsubrsBias, it = n.gsubrs[St], it) {
            if (O >= Io) {
              console.warn("CFF charstring subroutine call depth exceeded, skipping callgsubr");
              break;
            }
            O++, B(it), O--;
          }
          break;
        case 30:
          for (; l.length > 0 && (r = d, a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), d = o + l.shift(), g = c + (l.length === 1 ? l.shift() : 0), h.curveTo(r, a, o, c, d, g), l.length !== 0); )
            r = d + l.shift(), a = g, o = r + l.shift(), c = a + l.shift(), g = c + l.shift(), d = o + (l.length === 1 ? l.shift() : 0), h.curveTo(r, a, o, c, d, g);
          break;
        case 31:
          for (; l.length > 0 && (r = d + l.shift(), a = g, o = r + l.shift(), c = a + l.shift(), g = c + l.shift(), d = o + (l.length === 1 ? l.shift() : 0), h.curveTo(r, a, o, c, d, g), l.length !== 0); )
            r = d, a = g + l.shift(), o = r + l.shift(), c = a + l.shift(), d = o + l.shift(), g = c + (l.length === 1 ? l.shift() : 0), h.curveTo(r, a, o, c, d, g);
          break;
        default:
          At < 32 ? console.log("Glyph " + t.index + ": unknown operator " + At) : At < 247 ? l.push(At - 139) : At < 251 ? (P = U[ct], ct += 1, l.push((At - 247) * 256 + P + 108)) : At < 255 ? (P = U[ct], ct += 1, l.push(-(At - 251) * 256 - P - 108)) : (P = U[ct], Q = U[ct + 1], gt = U[ct + 2], Dt = U[ct + 3], ct += 4, l.push((P << 24 | Q << 16 | gt << 8 | Dt) / 65536));
      }
    }
  }
  return B(e), n.variation && i && (h.commands = h.commands.map((U) => {
    const P = Object.keys(U);
    for (let Q = 0; Q < P.length; Q++) {
      const gt = P[Q];
      gt !== "type" && (U[gt] = Math.round(U[gt]));
    }
    return U;
  })), f && (t.advanceWidth = D), h;
}
function Ro(n, t, e, s, i) {
  const r = [];
  let a;
  const o = new N.Parser(n, t), c = o.parseCard8();
  if (c === 0)
    for (let h = 0; h < e; h++) {
      if (a = o.parseCard8(), a >= s)
        throw new Error("CFF table CID Font FDSelect has bad FD index value " + a + " (FD count " + s + ")");
      r.push(a);
    }
  else if (c === 3 || i > 1 && c === 4) {
    const h = c === 4 ? o.parseULong() : o.parseCard16();
    let l = c === 4 ? o.parseULong() : o.parseCard16();
    if (l !== 0)
      throw new Error(`CFF Table CID Font FDSelect format ${c} range has bad initial GID ${l}`);
    let u;
    for (let f = 0; f < h; f++) {
      if (a = c === 4 ? o.parseUShort() : o.parseCard8(), u = c === 4 ? o.parseULong() : o.parseCard16(), a >= s)
        throw new Error("CFF table CID Font FDSelect has bad FD index value " + a + " (FD count " + s + ")");
      if (u > e)
        throw new Error(`CFF Table CID Font FDSelect format ${i} range has bad GID ${u}`);
      for (; l < u; l++)
        r.push(a);
      l = u;
    }
    if (u !== e)
      throw new Error("CFF Table CID Font FDSelect format 3 range has bad final (Sentinal) GID " + u);
  } else
    throw new Error("CFF Table CID Font FDSelect table has unsupported format " + c);
  return r;
}
function pp(n, t, e, s) {
  let i;
  const r = sp(n, t);
  r.formatMajor === 2 ? i = e.tables.cff2 = {} : i = e.tables.cff = {};
  const a = r.formatMajor > 1 ? null : de(n, r.endOffset, N.bytesToString), o = r.formatMajor > 1 ? null : de(n, a.endOffset), c = r.formatMajor > 1 ? null : de(n, o.endOffset, N.bytesToString), h = de(n, r.formatMajor > 1 ? t + r.size + r.topDictLength : c.endOffset, void 0, r.formatMajor);
  e.gsubrs = h.objects, e.gsubrsBias = Ai(e.gsubrs);
  let l;
  if (r.formatMajor > 1) {
    const f = t + r.size, p = N.getBytes(n, f, f + r.topDictLength);
    l = yr(n, 0, [p], void 0, r.formatMajor)[0];
  } else {
    const f = yr(n, t, o.objects, c.objects, r.formatMajor);
    if (f.length !== 1)
      throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + f.length);
    l = f[0];
  }
  if (i.topDict = l, l._privateDict && (e.defaultWidthX = l._privateDict.defaultWidthX, e.nominalWidthX = l._privateDict.nominalWidthX), r.formatMajor < 2 && l.ros[0] !== void 0 && l.ros[1] !== void 0 && (e.isCIDFont = !0), r.formatMajor > 1) {
    let f = l.fdArray, p = l.fdSelect;
    if (!f)
      throw new Error("This is a CFF2 font, but FDArray information is missing");
    const d = de(n, t + f, null, r.formatMajor), g = hp(n, t, d.objects);
    l._fdArray = g, p && (l._fdSelect = Ro(n, t + p, e.numGlyphs, g.length, r.formatMajor));
  } else if (e.isCIDFont) {
    let f = l.fdArray, p = l.fdSelect;
    if (f === 0 || p === 0)
      throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");
    f += t;
    const d = de(n, f), g = yr(n, t, d.objects, c.objects, r.formatMajor);
    l._fdArray = g, p += t, l._fdSelect = Ro(n, p, e.numGlyphs, g.length, r.formatMajor);
  }
  if (r.formatMajor < 2) {
    const f = t + l.private[1], p = ma(n, f, l.private[0], c.objects, r.formatMajor);
    if (e.defaultWidthX = p.defaultWidthX, e.nominalWidthX = p.nominalWidthX, p.subrs !== 0) {
      const d = f + p.subrs, g = de(n, d);
      e.subrs = g.objects, e.subrsBias = Ai(e.subrs);
    } else
      e.subrs = [], e.subrsBias = 0;
  }
  let u;
  if (s.lowMemory ? (u = Kf(n, t + l.charStrings, r.formatMajor), e.nGlyphs = u.offsets.length - (r.formatMajor > 1 ? 1 : 0)) : (u = de(n, t + l.charStrings, null, r.formatMajor), e.nGlyphs = u.objects.length), r.formatMajor > 1 && e.tables.maxp && e.nGlyphs !== e.tables.maxp.numGlyphs && console.error(`Glyph count in the CFF2 table (${e.nGlyphs}) must correspond to the glyph count in the maxp table (${e.tables.maxp.numGlyphs})`), r.formatMajor < 2) {
    let f = [], p = [];
    l.charset === 0 ? f = Df : l.charset === 1 ? f = Uf : l.charset === 2 ? f = Pf : f = lp(n, t + l.charset, e.nGlyphs, c.objects, e.isCIDFont), l.encoding === 0 ? p = Kr : l.encoding === 1 ? p = zf : p = up(n, t + l.encoding), e.cffEncoding = new Ah(p, f), e.encoding = e.encoding || e.cffEncoding;
  }
  if (e.glyphs = new be.GlyphSet(e), s.lowMemory)
    e._push = function(f) {
      const p = Qf(f, u.offsets, n, t + l.charStrings, void 0, r.formatMajor);
      e.glyphs.push(f, be.cffGlyphLoader(e, f, Qr, p, r.formatMajor));
    };
  else
    for (let f = 0; f < e.nGlyphs; f += 1) {
      const p = u.objects[f];
      e.glyphs.push(f, be.cffGlyphLoader(e, f, Qr, p, r.formatMajor));
    }
  if (l.vstore) {
    const f = new N.Parser(n, t + l.vstore);
    l._vstore = f.parseVariationStore();
  }
}
function Rh(n, t) {
  let e, s = ii.indexOf(n);
  return s >= 0 && (e = s), s = t.indexOf(n), s >= 0 ? e = s + ii.length : (e = ii.length + t.length, t.push(n)), e;
}
function dp() {
  return new L.Record("Header", [
    { name: "major", type: "Card8", value: 1 },
    { name: "minor", type: "Card8", value: 0 },
    { name: "hdrSize", type: "Card8", value: 4 },
    { name: "major", type: "Card8", value: 1 }
  ]);
}
function gp(n) {
  const t = new L.Record("Name INDEX", [
    { name: "names", type: "INDEX", value: [] }
  ]);
  t.names = [];
  for (let e = 0; e < n.length; e += 1)
    t.names.push({ name: "name_" + e, type: "NAME", value: n[e] });
  return t;
}
function Bh(n, t, e) {
  const s = {};
  for (let i = 0; i < n.length; i += 1) {
    const r = n[i];
    let a = t[r.name];
    a !== void 0 && !Oh(a, r.value) && (r.type === "SID" && (a = Rh(a, e)), s[r.op] = { name: r.name, type: r.type, value: a });
  }
  return s;
}
function Bo(n, t, e) {
  const s = new L.Record("Top DICT", [
    { name: "dict", type: "DICT", value: {} }
  ]);
  return s.dict = Bh(_h, n, t), s;
}
function Do(n) {
  const t = new L.Record("Top DICT INDEX", [
    { name: "topDicts", type: "INDEX", value: [] }
  ]);
  return t.topDicts = [{ name: "topDict_0", type: "TABLE", value: n }], t;
}
function mp(n) {
  const t = new L.Record("String INDEX", [
    { name: "strings", type: "INDEX", value: [] }
  ]);
  t.strings = [];
  for (let e = 0; e < n.length; e += 1)
    t.strings.push({ name: "string_" + e, type: "STRING", value: n[e] });
  return t;
}
function yp() {
  return new L.Record("Global Subr INDEX", [
    { name: "subrs", type: "INDEX", value: [] }
  ]);
}
function xp(n, t) {
  const e = new L.Record("Charsets", [
    { name: "format", type: "Card8", value: 0 }
  ]);
  for (let s = 0; s < n.length; s += 1) {
    const i = n[s], r = Rh(i, t);
    e.fields.push({ name: "glyph_" + s, type: "SID", value: r });
  }
  return e;
}
function bp(n, t) {
  const e = [], s = n.path;
  e.push({ name: "width", type: "NUMBER", value: n.advanceWidth });
  let i = 0, r = 0;
  for (let a = 0; a < s.commands.length; a += 1) {
    let o, c, h = s.commands[a];
    if (h.type === "Q") {
      const l = 0.3333333333333333, u = 2 / 3;
      h = {
        type: "C",
        x: h.x,
        y: h.y,
        x1: Math.round(l * i + u * h.x1),
        y1: Math.round(l * r + u * h.y1),
        x2: Math.round(l * h.x + u * h.x1),
        y2: Math.round(l * h.y + u * h.y1)
      };
    }
    if (h.type === "M")
      o = Math.round(h.x - i), c = Math.round(h.y - r), e.push({ name: "dx", type: "NUMBER", value: o }), e.push({ name: "dy", type: "NUMBER", value: c }), e.push({ name: "rmoveto", type: "OP", value: 21 }), i = Math.round(h.x), r = Math.round(h.y);
    else if (h.type === "L")
      o = Math.round(h.x - i), c = Math.round(h.y - r), e.push({ name: "dx", type: "NUMBER", value: o }), e.push({ name: "dy", type: "NUMBER", value: c }), e.push({ name: "rlineto", type: "OP", value: 5 }), i = Math.round(h.x), r = Math.round(h.y);
    else if (h.type === "C") {
      const l = Math.round(h.x1 - i), u = Math.round(h.y1 - r), f = Math.round(h.x2 - h.x1), p = Math.round(h.y2 - h.y1);
      o = Math.round(h.x - h.x2), c = Math.round(h.y - h.y2), e.push({ name: "dx1", type: "NUMBER", value: l }), e.push({ name: "dy1", type: "NUMBER", value: u }), e.push({ name: "dx2", type: "NUMBER", value: f }), e.push({ name: "dy2", type: "NUMBER", value: p }), e.push({ name: "dx", type: "NUMBER", value: o }), e.push({ name: "dy", type: "NUMBER", value: c }), e.push({ name: "rrcurveto", type: "OP", value: 8 }), i = Math.round(h.x), r = Math.round(h.y);
    }
  }
  return e.push({ name: "endchar", type: "OP", value: 14 }), e;
}
function vp(n, t) {
  const e = new L.Record("CharStrings INDEX", [
    { name: "charStrings", type: "INDEX", value: [] }
  ]);
  for (let s = 0; s < n.length; s += 1) {
    const i = n.get(s), r = bp(i);
    e.charStrings.push({ name: i.name, type: "CHARSTRING", value: r });
  }
  return e;
}
function Sp(n, t, e) {
  const s = new L.Record("Private DICT", [
    { name: "dict", type: "DICT", value: {} }
  ]);
  return s.dict = Bh(Lh, n, t), s;
}
function wp(n, t) {
  const e = new L.Table("CFF ", [
    { name: "header", type: "RECORD" },
    { name: "nameIndex", type: "RECORD" },
    { name: "topDictIndex", type: "RECORD" },
    { name: "stringIndex", type: "RECORD" },
    { name: "globalSubrIndex", type: "RECORD" },
    { name: "charsets", type: "RECORD" },
    { name: "charStringsIndex", type: "RECORD" },
    { name: "privateDict", type: "RECORD" }
  ]), s = 1 / t.unitsPerEm, i = {
    version: t.version,
    fullName: t.fullName,
    familyName: t.familyName,
    weight: t.weightName,
    fontBBox: t.fontBBox || [0, 0, 0, 0],
    fontMatrix: [s, 0, 0, s, 0, 0],
    charset: 999,
    encoding: 0,
    charStrings: 999,
    private: [0, 999]
  }, r = t && t.topDict || {};
  r.paintType && (i.paintType = r.paintType, i.strokeWidth = r.strokeWidth || 0);
  const a = {}, o = [];
  let c;
  for (let f = 1; f < n.length; f += 1)
    c = n.get(f), o.push(c.name);
  const h = [];
  e.header = dp(), e.nameIndex = gp([t.postScriptName]);
  let l = Bo(i, h);
  e.topDictIndex = Do(l), e.globalSubrIndex = yp(), e.charsets = xp(o, h), e.charStringsIndex = vp(n), e.privateDict = Sp(a, h), e.stringIndex = mp(h);
  const u = e.header.sizeOf() + e.nameIndex.sizeOf() + e.topDictIndex.sizeOf() + e.stringIndex.sizeOf() + e.globalSubrIndex.sizeOf();
  return i.charset = u, i.encoding = 0, i.charStrings = i.charset + e.charsets.sizeOf(), i.private[1] = i.charStrings + e.charStringsIndex.sizeOf(), l = Bo(i, h), e.topDictIndex = Do(l), e;
}
var ta = { parse: pp, make: wp };
function Cp(n, t) {
  const e = {}, s = new N.Parser(n, t);
  return e.version = s.parseVersion(), e.fontRevision = Math.round(s.parseFixed() * 1e3) / 1e3, e.checkSumAdjustment = s.parseULong(), e.magicNumber = s.parseULong(), G.argument(e.magicNumber === 1594834165, "Font header has wrong magic number."), e.flags = s.parseUShort(), e.unitsPerEm = s.parseUShort(), e.created = s.parseLongDateTime(), e.modified = s.parseLongDateTime(), e.xMin = s.parseShort(), e.yMin = s.parseShort(), e.xMax = s.parseShort(), e.yMax = s.parseShort(), e.macStyle = s.parseUShort(), e.lowestRecPPEM = s.parseUShort(), e.fontDirectionHint = s.parseShort(), e.indexToLocFormat = s.parseShort(), e.glyphDataFormat = s.parseShort(), e;
}
function Tp(n) {
  const t = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) + 2082844800;
  let e = t, s = n.macStyle || 0;
  return n.createdTimestamp && (e = n.createdTimestamp + 2082844800), new L.Table("head", [
    { name: "version", type: "FIXED", value: 65536 },
    { name: "fontRevision", type: "FIXED", value: 65536 },
    { name: "checkSumAdjustment", type: "ULONG", value: 0 },
    { name: "magicNumber", type: "ULONG", value: 1594834165 },
    { name: "flags", type: "USHORT", value: 0 },
    { name: "unitsPerEm", type: "USHORT", value: 1e3 },
    { name: "created", type: "LONGDATETIME", value: e },
    { name: "modified", type: "LONGDATETIME", value: t },
    { name: "xMin", type: "SHORT", value: 0 },
    { name: "yMin", type: "SHORT", value: 0 },
    { name: "xMax", type: "SHORT", value: 0 },
    { name: "yMax", type: "SHORT", value: 0 },
    { name: "macStyle", type: "USHORT", value: s },
    { name: "lowestRecPPEM", type: "USHORT", value: 0 },
    { name: "fontDirectionHint", type: "SHORT", value: 2 },
    { name: "indexToLocFormat", type: "SHORT", value: 0 },
    { name: "glyphDataFormat", type: "SHORT", value: 0 }
  ], n);
}
var Dh = { parse: Cp, make: Tp };
function kp(n, t) {
  const e = {}, s = new N.Parser(n, t);
  return e.version = s.parseVersion(), e.ascender = s.parseShort(), e.descender = s.parseShort(), e.lineGap = s.parseShort(), e.advanceWidthMax = s.parseUShort(), e.minLeftSideBearing = s.parseShort(), e.minRightSideBearing = s.parseShort(), e.xMaxExtent = s.parseShort(), e.caretSlopeRise = s.parseShort(), e.caretSlopeRun = s.parseShort(), e.caretOffset = s.parseShort(), s.relativeOffset += 8, e.metricDataFormat = s.parseShort(), e.numberOfHMetrics = s.parseUShort(), e;
}
function Ap(n) {
  return new L.Table("hhea", [
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
var Uh = { parse: kp, make: Ap };
function Fp(n, t, e, s, i) {
  let r, a;
  const o = new N.Parser(n, t);
  for (let c = 0; c < s; c += 1) {
    c < e && (r = o.parseUShort(), a = o.parseShort());
    const h = i.get(c);
    h.advanceWidth = r, h.leftSideBearing = a;
  }
}
function Ep(n, t, e, s, i) {
  n._hmtxTableData = {};
  let r, a;
  const o = new N.Parser(t, e);
  for (let c = 0; c < i; c += 1)
    c < s && (r = o.parseUShort(), a = o.parseShort()), n._hmtxTableData[c] = {
      advanceWidth: r,
      leftSideBearing: a
    };
}
function Mp(n, t, e, s, i, r, a) {
  a.lowMemory ? Ep(n, t, e, s, i) : Fp(t, e, s, i, r);
}
function Op(n) {
  const t = new L.Table("hmtx", []);
  for (let e = 0; e < n.length; e += 1) {
    const s = n.get(e), i = s.advanceWidth || 0, r = s.leftSideBearing || 0;
    t.fields.push({ name: "advanceWidth_" + e, type: "USHORT", value: i }), t.fields.push({ name: "leftSideBearing_" + e, type: "SHORT", value: r });
  }
  return t;
}
var Ph = { parse: Mp, make: Op };
function _p(n) {
  const t = new L.Table("ltag", [
    { name: "version", type: "ULONG", value: 1 },
    { name: "flags", type: "ULONG", value: 0 },
    { name: "numTags", type: "ULONG", value: n.length }
  ]);
  let e = "";
  const s = 12 + n.length * 4;
  for (let i = 0; i < n.length; ++i) {
    let r = e.indexOf(n[i]);
    r < 0 && (r = e.length, e += n[i]), t.fields.push({ name: "offset " + i, type: "USHORT", value: s + r }), t.fields.push({ name: "length " + i, type: "USHORT", value: n[i].length });
  }
  return t.fields.push({ name: "stringPool", type: "CHARARRAY", value: e }), t;
}
function Lp(n, t) {
  const e = new N.Parser(n, t), s = e.parseULong();
  G.argument(s === 1, "Unsupported ltag table version."), e.skip("uLong", 1);
  const i = e.parseULong(), r = [];
  for (let a = 0; a < i; a++) {
    let o = "";
    const c = t + e.parseUShort(), h = e.parseUShort();
    for (let l = c; l < c + h; ++l)
      o += String.fromCharCode(n.getInt8(l));
    r.push(o);
  }
  return r;
}
var zh = { make: _p, parse: Lp };
function Ip(n, t) {
  const e = {}, s = new N.Parser(n, t);
  return e.version = s.parseVersion(), e.numGlyphs = s.parseUShort(), e.version === 1 && (e.maxPoints = s.parseUShort(), e.maxContours = s.parseUShort(), e.maxCompositePoints = s.parseUShort(), e.maxCompositeContours = s.parseUShort(), e.maxZones = s.parseUShort(), e.maxTwilightPoints = s.parseUShort(), e.maxStorage = s.parseUShort(), e.maxFunctionDefs = s.parseUShort(), e.maxInstructionDefs = s.parseUShort(), e.maxStackElements = s.parseUShort(), e.maxSizeOfInstructions = s.parseUShort(), e.maxComponentElements = s.parseUShort(), e.maxComponentDepth = s.parseUShort()), e;
}
function Rp(n) {
  return new L.Table("maxp", [
    { name: "version", type: "FIXED", value: 20480 },
    { name: "numGlyphs", type: "USHORT", value: n }
  ]);
}
var Nh = { parse: Ip, make: Rp }, ea = [
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
function Bp(n) {
  for (let t = 0; t < ea.length; t += 1) {
    const e = ea[t];
    if (n >= e.begin && n < e.end)
      return t;
  }
  return -1;
}
function Dp(n, t) {
  const e = {}, s = new N.Parser(n, t);
  e.version = s.parseUShort(), e.xAvgCharWidth = s.parseShort(), e.usWeightClass = s.parseUShort(), e.usWidthClass = s.parseUShort(), e.fsType = s.parseUShort(), e.ySubscriptXSize = s.parseShort(), e.ySubscriptYSize = s.parseShort(), e.ySubscriptXOffset = s.parseShort(), e.ySubscriptYOffset = s.parseShort(), e.ySuperscriptXSize = s.parseShort(), e.ySuperscriptYSize = s.parseShort(), e.ySuperscriptXOffset = s.parseShort(), e.ySuperscriptYOffset = s.parseShort(), e.yStrikeoutSize = s.parseShort(), e.yStrikeoutPosition = s.parseShort(), e.sFamilyClass = s.parseShort(), e.panose = [];
  for (let i = 0; i < 10; i++)
    e.panose[i] = s.parseByte();
  return e.ulUnicodeRange1 = s.parseULong(), e.ulUnicodeRange2 = s.parseULong(), e.ulUnicodeRange3 = s.parseULong(), e.ulUnicodeRange4 = s.parseULong(), e.achVendID = String.fromCharCode(s.parseByte(), s.parseByte(), s.parseByte(), s.parseByte()), e.fsSelection = s.parseUShort(), e.usFirstCharIndex = s.parseUShort(), e.usLastCharIndex = s.parseUShort(), e.sTypoAscender = s.parseShort(), e.sTypoDescender = s.parseShort(), e.sTypoLineGap = s.parseShort(), e.usWinAscent = s.parseUShort(), e.usWinDescent = s.parseUShort(), e.version >= 1 && (e.ulCodePageRange1 = s.parseULong(), e.ulCodePageRange2 = s.parseULong()), e.version >= 2 && (e.sxHeight = s.parseShort(), e.sCapHeight = s.parseShort(), e.usDefaultChar = s.parseUShort(), e.usBreakChar = s.parseUShort(), e.usMaxContent = s.parseUShort()), e;
}
function Up(n) {
  return new L.Table("OS/2", [
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
var na = { parse: Dp, make: Up, unicodeRanges: ea, getUnicodeRange: Bp };
function Pp(n, t) {
  const e = {}, s = new N.Parser(n, t);
  switch (e.version = s.parseVersion(), e.italicAngle = s.parseFixed(), e.underlinePosition = s.parseShort(), e.underlineThickness = s.parseShort(), e.isFixedPitch = s.parseULong(), e.minMemType42 = s.parseULong(), e.maxMemType42 = s.parseULong(), e.minMemType1 = s.parseULong(), e.maxMemType1 = s.parseULong(), e.version) {
    case 1:
      e.names = an.slice();
      break;
    case 2:
      e.numberOfGlyphs = s.parseUShort(), e.glyphNameIndex = new Array(e.numberOfGlyphs);
      for (let i = 0; i < e.numberOfGlyphs; i++)
        e.glyphNameIndex[i] = s.parseUShort();
      e.names = [];
      for (let i = 0; i < e.numberOfGlyphs; i++)
        if (e.glyphNameIndex[i] >= an.length) {
          const r = s.parseChar();
          e.names.push(s.parseString(r));
        }
      break;
    case 2.5:
      e.numberOfGlyphs = s.parseUShort(), e.offset = new Array(e.numberOfGlyphs);
      for (let i = 0; i < e.numberOfGlyphs; i++)
        e.offset[i] = s.parseChar();
      break;
  }
  return e;
}
function zp(n) {
  const {
    italicAngle: t = Math.round((n.italicAngle || 0) * 65536),
    underlinePosition: e = 0,
    underlineThickness: s = 0,
    isFixedPitch: i = 0,
    minMemType42: r = 0,
    maxMemType42: a = 0,
    minMemType1: o = 0,
    maxMemType1: c = 0
  } = n.tables.post || {};
  return new L.Table("post", [
    { name: "version", type: "FIXED", value: 196608 },
    { name: "italicAngle", type: "FIXED", value: t },
    { name: "underlinePosition", type: "FWORD", value: e },
    { name: "underlineThickness", type: "FWORD", value: s },
    { name: "isFixedPitch", type: "ULONG", value: i },
    { name: "minMemType42", type: "ULONG", value: r },
    { name: "maxMemType42", type: "ULONG", value: a },
    { name: "minMemType1", type: "ULONG", value: o },
    { name: "maxMemType1", type: "ULONG", value: c }
  ]);
}
var Hh = { parse: Pp, make: zp }, le = new Array(9);
le[1] = function() {
  const t = this.offset + this.relativeOffset, e = this.parseUShort();
  if (e === 1)
    return {
      substFormat: 1,
      coverage: this.parsePointer(A.coverage),
      deltaGlyphId: this.parseShort()
    };
  if (e === 2)
    return {
      substFormat: 2,
      coverage: this.parsePointer(A.coverage),
      substitute: this.parseOffset16List()
    };
  G.assert(!1, "0x" + t.toString(16) + ": lookup type 1 format must be 1 or 2.");
};
le[2] = function() {
  const t = this.parseUShort();
  return G.argument(t === 1, "GSUB Multiple Substitution Subtable identifier-format must be 1"), {
    substFormat: t,
    coverage: this.parsePointer(A.coverage),
    sequences: this.parseListOfLists()
  };
};
le[3] = function() {
  const t = this.parseUShort();
  return G.argument(t === 1, "GSUB Alternate Substitution Subtable identifier-format must be 1"), {
    substFormat: t,
    coverage: this.parsePointer(A.coverage),
    alternateSets: this.parseListOfLists()
  };
};
le[4] = function() {
  const t = this.parseUShort();
  return G.argument(t === 1, "GSUB ligature table identifier-format must be 1"), {
    substFormat: t,
    coverage: this.parsePointer(A.coverage),
    ligatureSets: this.parseListOfLists(function() {
      return {
        ligGlyph: this.parseUShort(),
        components: this.parseUShortList(this.parseUShort() - 1)
      };
    })
  };
};
var Bn = {
  sequenceIndex: A.uShort,
  lookupListIndex: A.uShort
};
le[5] = function() {
  const t = this.offset + this.relativeOffset, e = this.parseUShort();
  if (e === 1)
    return {
      substFormat: e,
      coverage: this.parsePointer(A.coverage),
      ruleSets: this.parseListOfLists(function() {
        const s = this.parseUShort(), i = this.parseUShort();
        return {
          input: this.parseUShortList(s - 1),
          lookupRecords: this.parseRecordList(i, Bn)
        };
      })
    };
  if (e === 2)
    return {
      substFormat: e,
      coverage: this.parsePointer(A.coverage),
      classDef: this.parsePointer(A.classDef),
      classSets: this.parseListOfLists(function() {
        const s = this.parseUShort(), i = this.parseUShort();
        return {
          classes: this.parseUShortList(s - 1),
          lookupRecords: this.parseRecordList(i, Bn)
        };
      })
    };
  if (e === 3) {
    const s = this.parseUShort(), i = this.parseUShort();
    return {
      substFormat: e,
      coverages: this.parseList(s, A.pointer(A.coverage)),
      lookupRecords: this.parseRecordList(i, Bn)
    };
  }
  G.assert(!1, "0x" + t.toString(16) + ": lookup type 5 format must be 1, 2 or 3.");
};
le[6] = function() {
  const t = this.offset + this.relativeOffset, e = this.parseUShort();
  if (e === 1)
    return {
      substFormat: 1,
      coverage: this.parsePointer(A.coverage),
      chainRuleSets: this.parseListOfLists(function() {
        return {
          backtrack: this.parseUShortList(),
          input: this.parseUShortList(this.parseShort() - 1),
          lookahead: this.parseUShortList(),
          lookupRecords: this.parseRecordList(Bn)
        };
      })
    };
  if (e === 2)
    return {
      substFormat: 2,
      coverage: this.parsePointer(A.coverage),
      backtrackClassDef: this.parsePointer(A.classDef),
      inputClassDef: this.parsePointer(A.classDef),
      lookaheadClassDef: this.parsePointer(A.classDef),
      chainClassSet: this.parseListOfLists(function() {
        return {
          backtrack: this.parseUShortList(),
          input: this.parseUShortList(this.parseShort() - 1),
          lookahead: this.parseUShortList(),
          lookupRecords: this.parseRecordList(Bn)
        };
      })
    };
  if (e === 3)
    return {
      substFormat: 3,
      backtrackCoverage: this.parseList(A.pointer(A.coverage)),
      inputCoverage: this.parseList(A.pointer(A.coverage)),
      lookaheadCoverage: this.parseList(A.pointer(A.coverage)),
      lookupRecords: this.parseRecordList(Bn)
    };
  G.assert(!1, "0x" + t.toString(16) + ": lookup type 6 format must be 1, 2 or 3.");
};
le[7] = function() {
  const t = this.parseUShort();
  G.argument(t === 1, "GSUB Extension Substitution subtable identifier-format must be 1");
  const e = this.parseUShort(), s = new A(this.data, this.offset + this.parseULong());
  return {
    substFormat: 1,
    lookupType: e,
    extension: le[e].call(s)
  };
};
le[8] = function() {
  const t = this.parseUShort();
  return G.argument(t === 1, "GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"), {
    substFormat: t,
    coverage: this.parsePointer(A.coverage),
    backtrackCoverage: this.parseList(A.pointer(A.coverage)),
    lookaheadCoverage: this.parseList(A.pointer(A.coverage)),
    substitutes: this.parseUShortList()
  };
};
function Np(n, t) {
  t = t || 0;
  const e = new A(n, t), s = e.parseVersion(1);
  return G.argument(s === 1 || s === 1.1, "Unsupported GSUB table version."), s === 1 ? {
    version: s,
    scripts: e.parseScriptList(),
    features: e.parseFeatureList(),
    lookups: e.parseLookupList(le)
  } : {
    version: s,
    scripts: e.parseScriptList(),
    features: e.parseFeatureList(),
    lookups: e.parseLookupList(le),
    variations: e.parseFeatureVariationsList()
  };
}
var gn = new Array(9);
gn[1] = function(t) {
  if (t.substFormat === 1)
    return new L.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 1 },
      { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) },
      { name: "deltaGlyphID", type: "SHORT", value: t.deltaGlyphId }
    ]);
  if (t.substFormat === 2)
    return new L.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 2 },
      { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) }
    ].concat(L.ushortList("substitute", t.substitute)));
  G.fail("Lookup type 1 substFormat must be 1 or 2.");
};
gn[2] = function(t) {
  return G.assert(t.substFormat === 1, "Lookup type 2 substFormat must be 1."), new L.Table("substitutionTable", [
    { name: "substFormat", type: "USHORT", value: 1 },
    { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) }
  ].concat(L.tableList("seqSet", t.sequences, function(e) {
    return new L.Table("sequenceSetTable", L.ushortList("sequence", e));
  })));
};
gn[3] = function(t) {
  return G.assert(t.substFormat === 1, "Lookup type 3 substFormat must be 1."), new L.Table("substitutionTable", [
    { name: "substFormat", type: "USHORT", value: 1 },
    { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) }
  ].concat(L.tableList("altSet", t.alternateSets, function(e) {
    return new L.Table("alternateSetTable", L.ushortList("alternate", e));
  })));
};
gn[4] = function(t) {
  return G.assert(t.substFormat === 1, "Lookup type 4 substFormat must be 1."), new L.Table("substitutionTable", [
    { name: "substFormat", type: "USHORT", value: 1 },
    { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) }
  ].concat(L.tableList("ligSet", t.ligatureSets, function(e) {
    return new L.Table("ligatureSetTable", L.tableList("ligature", e, function(s) {
      return new L.Table(
        "ligatureTable",
        [{ name: "ligGlyph", type: "USHORT", value: s.ligGlyph }].concat(L.ushortList("component", s.components, s.components.length + 1))
      );
    }));
  })));
};
gn[5] = function(t) {
  if (t.substFormat === 1)
    return new L.Table("contextualSubstitutionTable", [
      { name: "substFormat", type: "USHORT", value: t.substFormat },
      { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) }
    ].concat(L.tableList("sequenceRuleSet", t.ruleSets, function(e) {
      return e ? new L.Table("sequenceRuleSetTable", L.tableList("sequenceRule", e, function(s) {
        let i = L.ushortList("seqLookup", [], s.lookupRecords.length).concat(L.ushortList("inputSequence", s.input, s.input.length + 1));
        [i[0], i[1]] = [i[1], i[0]];
        for (let r = 0; r < s.lookupRecords.length; r++) {
          const a = s.lookupRecords[r];
          i = i.concat({ name: "sequenceIndex" + r, type: "USHORT", value: a.sequenceIndex }).concat({ name: "lookupListIndex" + r, type: "USHORT", value: a.lookupListIndex });
        }
        return new L.Table("sequenceRuleTable", i);
      })) : new L.Table("NULL", null);
    })));
  if (t.substFormat === 2)
    return new L.Table("contextualSubstitutionTable", [
      { name: "substFormat", type: "USHORT", value: t.substFormat },
      { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) },
      { name: "classDef", type: "TABLE", value: new L.ClassDef(t.classDef) }
    ].concat(L.tableList("classSeqRuleSet", t.classSets, function(e) {
      return e ? new L.Table("classSeqRuleSetTable", L.tableList("classSeqRule", e, function(s) {
        let i = L.ushortList("classes", s.classes, s.classes.length + 1).concat(L.ushortList("seqLookupCount", [], s.lookupRecords.length));
        for (let r = 0; r < s.lookupRecords.length; r++) {
          const a = s.lookupRecords[r];
          i = i.concat({ name: "sequenceIndex" + r, type: "USHORT", value: a.sequenceIndex }).concat({ name: "lookupListIndex" + r, type: "USHORT", value: a.lookupListIndex });
        }
        return new L.Table("classSeqRuleTable", i);
      })) : new L.Table("NULL", null);
    })));
  if (t.substFormat === 3) {
    let e = [
      { name: "substFormat", type: "USHORT", value: t.substFormat }
    ];
    e.push({ name: "inputGlyphCount", type: "USHORT", value: t.coverages.length }), e.push({ name: "substitutionCount", type: "USHORT", value: t.lookupRecords.length });
    for (let i = 0; i < t.coverages.length; i++) {
      const r = t.coverages[i];
      e.push({ name: "inputCoverage" + i, type: "TABLE", value: new L.Coverage(r) });
    }
    for (let i = 0; i < t.lookupRecords.length; i++) {
      const r = t.lookupRecords[i];
      e = e.concat({ name: "sequenceIndex" + i, type: "USHORT", value: r.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: r.lookupListIndex });
    }
    return new L.Table("contextualSubstitutionTable", e);
  }
  G.assert(!1, "lookup type 5 format must be 1, 2 or 3.");
};
gn[6] = function(t) {
  if (t.substFormat === 1)
    return new L.Table("chainContextTable", [
      { name: "substFormat", type: "USHORT", value: t.substFormat },
      { name: "coverage", type: "TABLE", value: new L.Coverage(t.coverage) }
    ].concat(L.tableList("chainRuleSet", t.chainRuleSets, function(s) {
      return new L.Table("chainRuleSetTable", L.tableList("chainRule", s, function(i) {
        let r = L.ushortList("backtrackGlyph", i.backtrack, i.backtrack.length).concat(L.ushortList("inputGlyph", i.input, i.input.length + 1)).concat(L.ushortList("lookaheadGlyph", i.lookahead, i.lookahead.length)).concat(L.ushortList("substitution", [], i.lookupRecords.length));
        for (let a = 0; a < i.lookupRecords.length; a++) {
          const o = i.lookupRecords[a];
          r = r.concat({ name: "sequenceIndex" + a, type: "USHORT", value: o.sequenceIndex }).concat({ name: "lookupListIndex" + a, type: "USHORT", value: o.lookupListIndex });
        }
        return new L.Table("chainRuleTable", r);
      }));
    })));
  if (t.substFormat === 2)
    G.assert(!1, "lookup type 6 format 2 is not yet supported.");
  else if (t.substFormat === 3) {
    let e = [
      { name: "substFormat", type: "USHORT", value: t.substFormat }
    ];
    e.push({ name: "backtrackGlyphCount", type: "USHORT", value: t.backtrackCoverage.length });
    for (let i = 0; i < t.backtrackCoverage.length; i++) {
      const r = t.backtrackCoverage[i];
      e.push({ name: "backtrackCoverage" + i, type: "TABLE", value: new L.Coverage(r) });
    }
    e.push({ name: "inputGlyphCount", type: "USHORT", value: t.inputCoverage.length });
    for (let i = 0; i < t.inputCoverage.length; i++) {
      const r = t.inputCoverage[i];
      e.push({ name: "inputCoverage" + i, type: "TABLE", value: new L.Coverage(r) });
    }
    e.push({ name: "lookaheadGlyphCount", type: "USHORT", value: t.lookaheadCoverage.length });
    for (let i = 0; i < t.lookaheadCoverage.length; i++) {
      const r = t.lookaheadCoverage[i];
      e.push({ name: "lookaheadCoverage" + i, type: "TABLE", value: new L.Coverage(r) });
    }
    e.push({ name: "substitutionCount", type: "USHORT", value: t.lookupRecords.length });
    for (let i = 0; i < t.lookupRecords.length; i++) {
      const r = t.lookupRecords[i];
      e = e.concat({ name: "sequenceIndex" + i, type: "USHORT", value: r.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: r.lookupListIndex });
    }
    return new L.Table("chainContextTable", e);
  }
  G.assert(!1, "lookup type 6 format must be 1, 2 or 3.");
};
function Hp(n) {
  return new L.Table("GSUB", [
    { name: "version", type: "ULONG", value: 65536 },
    { name: "scripts", type: "TABLE", value: new L.ScriptList(n.scripts) },
    { name: "features", type: "TABLE", value: new L.FeatureList(n.features) },
    { name: "lookups", type: "TABLE", value: new L.LookupList(n.lookups, gn) }
  ]);
}
var Gh = { parse: Np, make: Hp };
function Gp(n, t) {
  const e = new N.Parser(n, t), s = e.parseULong();
  G.argument(s === 1, "Unsupported META table version."), e.parseULong(), e.parseULong();
  const i = e.parseULong(), r = {};
  for (let a = 0; a < i; a++) {
    const o = e.parseTag(), c = e.parseULong(), h = e.parseULong();
    if (o === "appl" || o === "bild")
      continue;
    const l = zn.UTF8(n, t + c, h);
    r[o] = l;
  }
  return r;
}
function Vp(n) {
  const t = Object.keys(n).length;
  let e = "";
  const s = 16 + t * 12, i = new L.Table("meta", [
    { name: "version", type: "ULONG", value: 1 },
    { name: "flags", type: "ULONG", value: 0 },
    { name: "offset", type: "ULONG", value: s },
    { name: "numTags", type: "ULONG", value: t }
  ]);
  for (let r in n) {
    const a = e.length;
    e += n[r], i.fields.push({ name: "tag " + r, type: "TAG", value: r }), i.fields.push({ name: "offset " + r, type: "ULONG", value: s + a }), i.fields.push({ name: "length " + r, type: "ULONG", value: n[r].length });
  }
  return i.fields.push({ name: "stringPool", type: "CHARARRAY", value: e }), i;
}
var Vh = { parse: Gp, make: Vp };
function Wp(n, t) {
  const e = new A(n, t), s = e.parseUShort();
  s !== 0 && console.warn("Only COLRv0 is currently fully supported. A subset of color glyphs might be available in this font if provided in the v0 format.");
  const i = e.parseUShort(), r = e.parseOffset32(), a = e.parseOffset32(), o = e.parseUShort();
  e.relativeOffset = r;
  const c = e.parseRecordList(i, {
    glyphID: A.uShort,
    firstLayerIndex: A.uShort,
    numLayers: A.uShort
  });
  e.relativeOffset = a;
  const h = e.parseRecordList(o, {
    glyphID: A.uShort,
    paletteIndex: A.uShort
  });
  return {
    version: s,
    baseGlyphRecords: c,
    layerRecords: h
  };
}
function qp({ version: n = 0, baseGlyphRecords: t = [], layerRecords: e = [] }) {
  G.argument(n === 0, "Only COLRv0 supported.");
  const s = 14, i = s + t.length * 6;
  return new L.Table("COLR", [
    { name: "version", type: "USHORT", value: n },
    { name: "numBaseGlyphRecords", type: "USHORT", value: t.length },
    { name: "baseGlyphRecordsOffset", type: "ULONG", value: s },
    { name: "layerRecordsOffset", type: "ULONG", value: i },
    { name: "numLayerRecords", type: "USHORT", value: e.length },
    ...t.map((r, a) => [
      { name: "glyphID_" + a, type: "USHORT", value: r.glyphID },
      { name: "firstLayerIndex_" + a, type: "USHORT", value: r.firstLayerIndex },
      { name: "numLayers_" + a, type: "USHORT", value: r.numLayers }
    ]).flat(),
    ...e.map((r, a) => [
      { name: "LayerGlyphID_" + a, type: "USHORT", value: r.glyphID },
      { name: "paletteIndex_" + a, type: "USHORT", value: r.paletteIndex }
    ]).flat()
  ]);
}
var Wh = { parse: Wp, make: qp };
function jp(n, t) {
  return [
    { name: "tag_" + n, type: "TAG", value: t.tag },
    { name: "minValue_" + n, type: "FIXED", value: t.minValue << 16 },
    { name: "defaultValue_" + n, type: "FIXED", value: t.defaultValue << 16 },
    { name: "maxValue_" + n, type: "FIXED", value: t.maxValue << 16 },
    { name: "flags_" + n, type: "USHORT", value: 0 },
    { name: "nameID_" + n, type: "USHORT", value: t.axisNameID }
  ];
}
function $p(n, t, e) {
  const s = {}, i = new N.Parser(n, t);
  s.tag = i.parseTag(), s.minValue = i.parseFixed(), s.defaultValue = i.parseFixed(), s.maxValue = i.parseFixed(), i.skip("uShort", 1);
  const r = i.parseUShort();
  return s.axisNameID = r, s.name = Ti(e, r), s;
}
function Xp(n, t, e, s = {}) {
  const i = [
    { name: "nameID_" + n, type: "USHORT", value: t.subfamilyNameID },
    { name: "flags_" + n, type: "USHORT", value: 0 }
  ];
  for (let r = 0; r < e.length; ++r) {
    const a = e[r].tag;
    i.push({
      name: "axis_" + n + " " + a,
      type: "FIXED",
      value: t.coordinates[a] << 16
    });
  }
  return s && s.postScriptNameID && i.push({
    name: "postScriptNameID_",
    type: "USHORT",
    value: t.postScriptNameID !== void 0 ? t.postScriptNameID : 65535
  }), i;
}
function Yp(n, t, e, s, i) {
  const r = {}, a = new N.Parser(n, t), o = a.parseUShort();
  r.subfamilyNameID = o, r.name = Ti(s, o, [2, 17]), a.skip("uShort", 1), r.coordinates = {};
  for (let h = 0; h < e.length; ++h)
    r.coordinates[e[h].tag] = a.parseFixed();
  if (a.relativeOffset === i)
    return r.postScriptNameID = void 0, r.postScriptName = void 0, r;
  const c = a.parseUShort();
  return r.postScriptNameID = c == 65535 ? void 0 : c, r.postScriptName = r.postScriptNameID !== void 0 ? Ti(s, c, [6]) : "", r;
}
function Zp(n, t) {
  const e = new L.Table("fvar", [
    { name: "version", type: "ULONG", value: 65536 },
    { name: "offsetToData", type: "USHORT", value: 0 },
    { name: "countSizePairs", type: "USHORT", value: 2 },
    { name: "axisCount", type: "USHORT", value: n.axes.length },
    { name: "axisSize", type: "USHORT", value: 20 },
    { name: "instanceCount", type: "USHORT", value: n.instances.length },
    { name: "instanceSize", type: "USHORT", value: 4 + n.axes.length * 4 }
  ]);
  e.offsetToData = e.sizeOf();
  for (let i = 0; i < n.axes.length; i++)
    e.fields = e.fields.concat(jp(i, n.axes[i]));
  const s = {};
  for (let i = 0; i < n.instances.length; i++)
    if (n.instances[i].postScriptNameID !== void 0) {
      e.instanceSize += 2, s.postScriptNameID = !0;
      break;
    }
  for (let i = 0; i < n.instances.length; i++)
    e.fields = e.fields.concat(Xp(
      i,
      n.instances[i],
      n.axes,
      s
    ));
  return e;
}
function Jp(n, t, e) {
  const s = new N.Parser(n, t), i = s.parseULong();
  G.argument(i === 65536, "Unsupported fvar table version.");
  const r = s.parseOffset16();
  s.skip("uShort", 1);
  const a = s.parseUShort(), o = s.parseUShort(), c = s.parseUShort(), h = s.parseUShort(), l = [];
  for (let p = 0; p < a; p++)
    l.push($p(n, t + r + p * o, e));
  const u = [], f = t + r + a * o;
  for (let p = 0; p < c; p++)
    u.push(Yp(n, f + p * h, l, e, h));
  return { axes: l, instances: u };
}
var qh = { make: Zp, parse: Jp }, Kp = {
  tag: A.tag,
  nameID: A.uShort,
  ordering: A.uShort
}, bs = new Array(5);
bs[1] = function() {
  return {
    axisIndex: this.parseUShort(),
    flags: this.parseUShort(),
    valueNameID: this.parseUShort(),
    value: this.parseFixed()
  };
};
bs[2] = function() {
  return {
    axisIndex: this.parseUShort(),
    flags: this.parseUShort(),
    valueNameID: this.parseUShort(),
    nominalValue: this.parseFixed(),
    rangeMinValue: this.parseFixed(),
    rangeMaxValue: this.parseFixed()
  };
};
bs[3] = function() {
  return {
    axisIndex: this.parseUShort(),
    flags: this.parseUShort(),
    valueNameID: this.parseUShort(),
    value: this.parseFixed(),
    linkedValue: this.parseFixed()
  };
};
bs[4] = function() {
  const t = this.parseUShort();
  return {
    flags: this.parseUShort(),
    valueNameID: this.parseUShort(),
    axisValues: this.parseList(t, function() {
      return {
        axisIndex: this.parseUShort(),
        value: this.parseFixed()
      };
    })
  };
};
function Qp() {
  const n = this.parseUShort(), t = bs[n], e = {
    format: n
  };
  return t === void 0 ? (console.warn(`Unknown axis value table format ${n}`), e) : Object.assign(e, this.parseStruct(t.bind(this)));
}
function td(n, t, e) {
  t || (t = 0);
  const s = new N.Parser(n, t), i = s.parseUShort(), r = s.parseUShort();
  i !== 1 && console.warn(`Unsupported STAT table version ${i}.${r}`);
  const a = [
    i,
    r
  ], o = s.parseUShort(), c = s.parseUShort(), h = s.parseOffset32(), l = s.parseUShort(), u = s.parseOffset32(), f = i > 1 || r > 0 ? s.parseUShort() : void 0;
  e !== void 0 && G.argument(c >= e.axes.length, "STAT axis count must be greater than or equal to fvar axis count"), l > 0 && G.argument(c >= 0, "STAT axis count must be greater than 0 if STAT axis value count is greater than 0");
  const p = [];
  for (let x = 0; x < c; x++)
    s.offset = t + h, s.relativeOffset = x * o, p.push(s.parseStruct(Kp));
  s.offset = t, s.relativeOffset = u;
  const d = s.parseUShortList(l), g = [];
  for (let x = 0; x < l; x++)
    s.offset = t + u, s.relativeOffset = d[x], g.push(Qp.apply(s));
  return {
    version: a,
    axes: p,
    values: g,
    elidedFallbackNameID: f
  };
}
var vs = new Array(5);
vs[1] = function(t, e) {
  return [
    { name: `format${t}`, type: "USHORT", value: 1 },
    { name: `axisIndex${t}`, type: "USHORT", value: e.axisIndex },
    { name: `flags${t}`, type: "USHORT", value: e.flags },
    { name: `valueNameID${t}`, type: "USHORT", value: e.valueNameID },
    { name: `value${t}`, type: "FLOAT", value: e.value }
  ];
};
vs[2] = function(t, e) {
  return [
    { name: `format${t}`, type: "USHORT", value: 2 },
    { name: `axisIndex${t}`, type: "USHORT", value: e.axisIndex },
    { name: `flags${t}`, type: "USHORT", value: e.flags },
    { name: `valueNameID${t}`, type: "USHORT", value: e.valueNameID },
    { name: `nominalValue${t}`, type: "FLOAT", value: e.nominalValue },
    { name: `rangeMinValue${t}`, type: "FLOAT", value: e.rangeMinValue },
    { name: `rangeMaxValue${t}`, type: "FLOAT", value: e.rangeMaxValue }
  ];
};
vs[3] = function(t, e) {
  return [
    { name: `format${t}`, type: "USHORT", value: 3 },
    { name: `axisIndex${t}`, type: "USHORT", value: e.axisIndex },
    { name: `flags${t}`, type: "USHORT", value: e.flags },
    { name: `valueNameID${t}`, type: "USHORT", value: e.valueNameID },
    { name: `value${t}`, type: "FLOAT", value: e.value },
    { name: `linkedValue${t}`, type: "FLOAT", value: e.linkedValue }
  ];
};
vs[4] = function(t, e) {
  let s = [
    { name: `format${t}`, type: "USHORT", value: 4 },
    { name: `axisCount${t}`, type: "USHORT", value: e.axisValues.length },
    { name: `flags${t}`, type: "USHORT", value: e.flags },
    { name: `valueNameID${t}`, type: "USHORT", value: e.valueNameID }
  ];
  for (let i = 0; i < e.axisValues.length; i++)
    s = s.concat([
      { name: `format${t}axisIndex${i}`, type: "USHORT", value: e.axisValues[i].axisIndex },
      { name: `format${t}value${i}`, type: "FLOAT", value: e.axisValues[i].value }
    ]);
  return s;
};
function ed(n, t) {
  return new L.Record("axisRecord_" + n, [
    { name: "axisTag_" + n, type: "TAG", value: t.tag },
    { name: "axisNameID_" + n, type: "USHORT", value: t.nameID },
    { name: "axisOrdering_" + n, type: "USHORT", value: t.ordering }
  ]);
}
function nd(n, t) {
  const e = t.format, s = vs[e];
  G.argument(s !== void 0, `Unknown axis value table format ${e}`);
  const i = s(n, t);
  return new L.Table("axisValueTable_" + n, i);
}
function sd(n) {
  const t = new L.Table("STAT", [
    { name: "majorVersion", type: "USHORT", value: 1 },
    { name: "minorVersion", type: "USHORT", value: 2 },
    { name: "designAxisSize", type: "USHORT", value: 8 },
    { name: "designAxisCount", type: "USHORT", value: n.axes.length },
    { name: "designAxesOffset", type: "ULONG", value: 0 },
    { name: "axisValueCount", type: "USHORT", value: n.values.length },
    { name: "offsetToAxisValueOffsets", type: "ULONG", value: 0 },
    { name: "elidedFallbackNameID", type: "USHORT", value: n.elidedFallbackNameID }
  ]);
  t.designAxesOffset = t.offsetToAxisValueOffsets = t.sizeOf();
  for (let r = 0; r < n.axes.length; r++) {
    const a = ed(r, n.axes[r]);
    t.offsetToAxisValueOffsets += a.sizeOf(), t.fields = t.fields.concat(a.fields);
  }
  const e = [];
  let s = [], i = n.values.length * 2;
  for (let r = 0; r < n.values.length; r++) {
    const a = nd(r, n.values[r]);
    e.push({
      name: "offset_" + r,
      type: "USHORT",
      value: i
    }), i += a.sizeOf(), s = s.concat(a.fields);
  }
  return t.fields = t.fields.concat(e), t.fields = t.fields.concat(s), t;
}
var jh = { make: sd, parse: td };
function id(n, t) {
  return new L.Record("axisValueMap_" + n, [
    { name: "fromCoordinate_" + n, type: "F2DOT14", value: t.fromCoordinate },
    { name: "toCoordinate_" + n, type: "F2DOT14", value: t.toCoordinate }
  ]);
}
function rd(n, t) {
  const e = new L.Record("segmentMap_" + n, [
    { name: "positionMapCount_" + n, type: "USHORT", value: t.axisValueMaps.length }
  ]);
  let s = [];
  for (let i = 0; i < t.axisValueMaps.length; i++) {
    const r = id(`${n}_${i}`, t.axisValueMaps[i]);
    s = s.concat(r.fields);
  }
  return e.fields = e.fields.concat(s), e;
}
function ad(n, t) {
  G.argument(n.axisSegmentMaps.length === t.axes.length, "avar axis count must correspond to fvar axis count");
  const e = new L.Table("avar", [
    { name: "majorVersion", type: "USHORT", value: 1 },
    { name: "minorVersion", type: "USHORT", value: 0 },
    { name: "reserved", type: "USHORT", value: 0 },
    { name: "axisCount", type: "USHORT", value: n.axisSegmentMaps.length }
  ]);
  for (let s = 0; s < n.axisSegmentMaps.length; s++) {
    const i = rd(s, n.axisSegmentMaps[s]);
    e.fields = e.fields.concat(i.fields);
  }
  return e;
}
function od(n, t, e) {
  t || (t = 0);
  const s = new A(n, t), i = s.parseUShort(), r = s.parseUShort();
  i !== 1 && console.warn(`Unsupported avar table version ${i}.${r}`), s.skip("uShort", 1);
  const a = s.parseUShort();
  G.argument(a === e.axes.length, "avar axis count must correspond to fvar axis count");
  const o = [];
  for (let c = 0; c < a; c++) {
    const h = [], l = s.parseUShort();
    for (let u = 0; u < l; u++) {
      const f = s.parseF2Dot14(), p = s.parseF2Dot14();
      h.push({
        fromCoordinate: f,
        toCoordinate: p
      });
    }
    o.push({
      axisValueMaps: h
    });
  }
  return {
    version: [i, r],
    axisSegmentMaps: o
  };
}
var $h = { make: ad, parse: od };
function cd(n, t, e, s) {
  const i = new N.Parser(n, t), r = i.parseTupleVariationStore(
    i.relativeOffset,
    e.axes.length,
    "cvar",
    s
  ), a = i.parseUShort(), o = i.parseUShort();
  return a !== 1 && console.warn(`Unsupported cvar table version ${a}.${o}`), {
    version: [a, o],
    ...r
  };
}
function hd() {
  console.warn("Writing of cvar tables is not yet supported.");
}
var Xh = { make: hd, parse: cd };
function ld(n, t, e, s) {
  const i = new N.Parser(n, t), r = i.parseUShort(), a = i.parseUShort();
  r !== 1 && console.warn(`Unsupported gvar table version ${r}.${a}`);
  const o = i.parseUShort();
  o !== e.axes.length && console.warn(`axisCount ${o} in gvar table does not match the number of axes ${e.axes.length} in the fvar table!`);
  const c = i.parseUShort(), h = i.parsePointer32(function() {
    return this.parseTupleRecords(c, o);
  }), l = i.parseTupleVariationStoreList(o, "gvar", s);
  return {
    version: [r, a],
    sharedTuples: h,
    glyphVariations: l
  };
}
function ud() {
  console.warn("Writing of gvar tables is not yet supported.");
}
var Yh = { make: ud, parse: ld };
function fd(n, t) {
  const e = {}, s = new N.Parser(n, t);
  e.version = s.parseUShort(), G.argument(e.version <= 1, "Unsupported gasp table version."), e.numRanges = s.parseUShort(), e.gaspRanges = [];
  for (let i = 0; i < e.numRanges; i++)
    e.gaspRanges[i] = {
      rangeMaxPPEM: s.parseUShort(),
      rangeGaspBehavior: s.parseUShort()
    };
  return e;
}
function pd(n) {
  const t = new L.Table("gasp", [
    { name: "version", type: "USHORT", value: 1 },
    { name: "numRanges", type: "USHORT", value: n.numRanges }
  ]);
  for (let e in n.gaspRanges)
    t.fields.push({ name: "rangeMaxPPEM", type: "USHORT", value: n.gaspRanges[e].rangeMaxPPEM }), t.fields.push({ name: "rangeGaspBehavior", type: "USHORT", value: n.gaspRanges[e].rangeGaspBehavior });
  return t;
}
var Zh = { parse: fd, make: pd };
function dd(n, t) {
  const e = /* @__PURE__ */ new Map(), s = n.buffer, i = new A(n, t);
  if (i.parseUShort() !== 0) return e;
  i.relativeOffset = i.parseOffset32();
  const a = n.byteOffset + t + i.relativeOffset, o = i.parseUShort(), c = /* @__PURE__ */ new Map();
  for (let h = 0; h < o; h++) {
    const l = i.parseUShort(), u = i.parseUShort(), f = a + i.parseOffset32(), p = i.parseULong();
    let d = c.get(f);
    d === void 0 && (d = new Uint8Array(s, f, p), c.set(f, d));
    for (let g = l; g <= u; g++)
      e.set(g, d);
  }
  return e;
}
function gd(n) {
  const t = Array.from(n.keys()).sort(), e = [], s = [], i = /* @__PURE__ */ new Map();
  let r = 0, a = { endGlyphID: null };
  for (let f = 0, p = t.length; f < p; f++) {
    const d = t[f], g = n.get(d);
    let x = i.get(g);
    x === void 0 && (x = r, s.push(g), i.set(g, x), r += g.byteLength), d - 1 === a.endGlyphID && x === a.svgDocOffset ? a.endGlyphID = d : (a = {
      startGlyphID: d,
      endGlyphID: d,
      svgDocOffset: x,
      svgDocLength: g.byteLength
    }, e.push(a));
  }
  const o = e.length, c = s.length, h = 2 + o * 12, l = new Array(4 + o * 4 + c);
  let u = 0;
  l[u++] = { name: "version", type: "USHORT", value: 0 }, l[u++] = { name: "svgDocumentListOffset", type: "ULONG", value: 10 }, l[u++] = { name: "reserved", type: "ULONG", value: 0 }, l[u++] = { name: "numEntries", type: "USHORT", value: o };
  for (let f = 0; f < o; f++) {
    const p = "documentRecord_" + f, { startGlyphID: d, endGlyphID: g, svgDocOffset: x, svgDocLength: b } = e[f];
    l[u++] = { name: p + "_startGlyphID", type: "USHORT", value: d }, l[u++] = { name: p + "_endGlyphID", type: "USHORT", value: g }, l[u++] = { name: p + "_svgDocOffset", type: "ULONG", value: h + x }, l[u++] = { name: p + "_svgDocLength", type: "ULONG", value: b };
  }
  for (let f = 0; f < c; f++)
    l[u++] = { name: "svgDoc_" + f, type: "LITERAL", value: s[f] };
  return new L.Table("SVG ", l);
}
var Jh = {
  make: gd,
  parse: dd
};
function Uo(n) {
  return Math.log(n) / Math.log(2) | 0;
}
function ya(n) {
  for (; n.length % 4 !== 0; )
    n.push(0);
  let t = 0;
  for (let e = 0; e < n.length; e += 4)
    t += (n[e] << 24) + (n[e + 1] << 16) + (n[e + 2] << 8) + n[e + 3];
  return t %= Math.pow(2, 32), t;
}
function Po(n, t, e, s) {
  return new L.Record("Table Record", [
    { name: "tag", type: "TAG", value: n !== void 0 ? n : "" },
    { name: "checkSum", type: "ULONG", value: t !== void 0 ? t : 0 },
    { name: "offset", type: "ULONG", value: e !== void 0 ? e : 0 },
    { name: "length", type: "ULONG", value: s !== void 0 ? s : 0 }
  ]);
}
function Kh(n) {
  const t = new L.Table("sfnt", [
    { name: "version", type: "TAG", value: "OTTO" },
    { name: "numTables", type: "USHORT", value: 0 },
    { name: "searchRange", type: "USHORT", value: 0 },
    { name: "entrySelector", type: "USHORT", value: 0 },
    { name: "rangeShift", type: "USHORT", value: 0 }
  ]);
  t.tables = n, t.numTables = n.length;
  const e = Math.pow(2, Uo(t.numTables));
  t.searchRange = 16 * e, t.entrySelector = Uo(e), t.rangeShift = t.numTables * 16 - t.searchRange;
  const s = [], i = [];
  let r = t.sizeOf() + Po().sizeOf() * t.numTables;
  for (; r % 4 !== 0; )
    r += 1, i.push({ name: "padding", type: "BYTE", value: 0 });
  for (let a = 0; a < n.length; a += 1) {
    const o = n[a];
    G.argument(o.tableName.length === 4, "Table name" + o.tableName + " is invalid.");
    const c = o.sizeOf(), h = Po(o.tableName, ya(o.encode()), r, c);
    for (s.push({ name: h.tag + " Table Record", type: "RECORD", value: h }), i.push({ name: o.tableName + " table", type: "RECORD", value: o }), r += c, G.argument(!isNaN(r), "Something went wrong calculating the offset."); r % 4 !== 0; )
      r += 1, i.push({ name: "padding", type: "BYTE", value: 0 });
  }
  return s.sort(function(a, o) {
    return a.value.tag > o.value.tag ? 1 : -1;
  }), t.fields = t.fields.concat(s), t.fields = t.fields.concat(i), t;
}
function zo(n, t, e) {
  for (let s = 0; s < t.length; s += 1) {
    const i = n.charToGlyphIndex(t[s]);
    if (i > 0)
      return n.glyphs.get(i).getMetrics();
  }
  return e;
}
function md(n) {
  let t = 0;
  for (let e = 0; e < n.length; e += 1)
    t += n[e];
  return t / n.length;
}
function yd(n) {
  const t = [], e = [], s = [], i = [], r = [], a = [], o = [];
  let c, h = 0, l = 0, u = 0, f = 0, p = 0;
  for (let tt = 0; tt < n.glyphs.length; tt += 1) {
    const kt = n.glyphs.get(tt), Ut = kt.unicode | 0;
    if (isNaN(kt.advanceWidth))
      throw new Error("Glyph " + kt.name + " (" + tt + "): advanceWidth is not a number.");
    (c > Ut || c === void 0) && Ut > 0 && (c = Ut), h < Ut && (h = Ut);
    const Pt = na.getUnicodeRange(Ut);
    if (Pt < 32)
      l |= 1 << Pt;
    else if (Pt < 64)
      u |= 1 << Pt - 32;
    else if (Pt < 96)
      f |= 1 << Pt - 64;
    else if (Pt < 123)
      p |= 1 << Pt - 96;
    else
      throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
    if (kt.name === ".notdef") continue;
    const zt = kt.getMetrics();
    t.push(zt.xMin), e.push(zt.yMin), s.push(zt.xMax), i.push(zt.yMax), a.push(zt.leftSideBearing), o.push(zt.rightSideBearing), r.push(kt.advanceWidth);
  }
  const d = {
    xMin: Math.min.apply(null, t),
    yMin: Math.min.apply(null, e),
    xMax: Math.max.apply(null, s),
    yMax: Math.max.apply(null, i),
    advanceWidthMax: Math.max.apply(null, r),
    advanceWidthAvg: md(r),
    minLeftSideBearing: Math.min.apply(null, a),
    maxLeftSideBearing: Math.max.apply(null, a),
    minRightSideBearing: Math.min.apply(null, o)
  };
  d.ascender = n.ascender, d.descender = n.descender;
  let g = 0;
  n.weightClass >= 600 && (g |= n.macStyleValues.BOLD), n.italicAngle < 0 && (g |= n.macStyleValues.ITALIC);
  const x = Dh.make({
    flags: 3,
    // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
    unitsPerEm: n.unitsPerEm,
    xMin: d.xMin,
    yMin: d.yMin,
    xMax: d.xMax,
    yMax: d.yMax,
    lowestRecPPEM: 3,
    macStyle: g,
    createdTimestamp: n.createdTimestamp
  }), b = Uh.make({
    ascender: d.ascender,
    descender: d.descender,
    advanceWidthMax: d.advanceWidthMax,
    minLeftSideBearing: d.minLeftSideBearing,
    minRightSideBearing: d.minRightSideBearing,
    xMaxExtent: d.maxLeftSideBearing + (d.xMax - d.xMin),
    numberOfHMetrics: n.glyphs.length
  }), v = Nh.make(n.glyphs.length), S = na.make(Object.assign({
    xAvgCharWidth: Math.round(d.advanceWidthAvg),
    usFirstCharIndex: c,
    usLastCharIndex: h,
    ulUnicodeRange1: l,
    ulUnicodeRange2: u,
    ulUnicodeRange3: f,
    ulUnicodeRange4: p,
    // See http://typophile.com/node/13081 for more info on vertical metrics.
    // We get metrics for typical characters (such as "x" for xHeight).
    // We provide some fallback characters if characters are unavailable: their
    // ordering was chosen experimentally.
    sTypoAscender: d.ascender,
    sTypoDescender: d.descender,
    sTypoLineGap: 0,
    usWinAscent: d.yMax,
    usWinDescent: Math.abs(d.yMin),
    ulCodePageRange1: 1,
    // FIXME: hard-code Latin 1 support for now
    sxHeight: zo(n, "xyvw", { yMax: Math.round(d.ascender / 2) }).yMax,
    sCapHeight: zo(n, "HIKLEFJMNTZBDPRAGOQSUVWXY", d).yMax,
    usDefaultChar: n.hasChar(" ") ? 32 : 0,
    // Use space as the default character, if available.
    usBreakChar: n.hasChar(" ") ? 32 : 0
    // Use space as the break character, if available.
  }, n.tables.os2)), w = Ph.make(n.glyphs), k = Ch.make(n.glyphs), M = n.getEnglishName("fontFamily"), O = n.getEnglishName("fontSubfamily"), I = M + " " + O;
  let V = n.getEnglishName("postScriptName");
  V || (V = M.replace(/\s/g, "") + "-" + O);
  const D = {};
  for (let tt in n.names)
    D[tt] = n.names[tt];
  D.unicode = D.unicode || {}, D.macintosh = D.macintosh || {}, D.windows = D.windows || {};
  const W = n.names.unicode || {}, J = n.names.macintosh || {}, B = n.names.windows || {};
  for (const tt in D) {
    if (D[tt] = D[tt] || {}, !D[tt].uniqueID) {
      const kt = n.getEnglishName("manufacturer") || "";
      D[tt].uniqueID = { en: `${kt}: ${I}` };
    }
    D[tt].postScriptName || (D[tt].postScriptName = { en: V });
  }
  D.unicode.preferredFamily || (D.unicode.preferredFamily = W.fontFamily || J.fontFamily || B.fontFamily), D.macintosh.preferredFamily || (D.macintosh.preferredFamily = J.fontFamily || W.fontFamily || B.fontFamily), D.windows.preferredFamily || (D.windows.preferredFamily = B.fontFamily || W.fontFamily || J.fontFamily), D.unicode.preferredSubfamily || (D.unicode.preferredSubfamily = W.fontSubfamily || J.fontSubfamily || B.fontSubfamily), D.macintosh.preferredSubfamily || (D.macintosh.preferredSubfamily = J.fontSubfamily || W.fontSubfamily || B.fontSubfamily), D.windows.preferredSubfamily || (D.windows.preferredSubfamily = B.fontSubfamily || W.fontSubfamily || J.fontSubfamily);
  const U = [], P = wh.make(D, U), Q = U.length > 0 ? zh.make(U) : void 0, gt = Hh.make(n), Dt = ta.make(n.glyphs, {
    version: n.getEnglishName("version"),
    fullName: I,
    familyName: M,
    weightName: O,
    postScriptName: V,
    unitsPerEm: n.unitsPerEm,
    fontBBox: [0, d.yMin, d.ascender, d.advanceWidthMax],
    topDict: n.tables.cff && n.tables.cff.topDict || {}
  }), St = n.metas && Object.keys(n.metas).length > 0 ? Vh.make(n.metas) : void 0, it = [x, b, v, S, P, k, gt, Dt, w];
  Q && it.push(Q);
  const j = {
    gsub: Gh,
    cpal: Mh,
    colr: Wh,
    stat: jh,
    avar: $h,
    cvar: Xh,
    fvar: qh,
    gvar: Yh,
    gasp: Zh,
    svg: Jh
  }, st = {
    avar: [n.tables.fvar],
    fvar: [n.names]
  };
  for (let tt in j) {
    const kt = n.tables[tt];
    if (kt) {
      const Ut = j[tt].make.call(n, kt, ...st[tt] || []);
      Ut && it.push(Ut);
    }
  }
  St && it.push(St);
  const yt = Kh(it), Tt = yt.encode(), bt = ya(Tt), wt = yt.fields;
  let ct = !1;
  for (let tt = 0; tt < wt.length; tt += 1)
    if (wt[tt].name === "head table") {
      wt[tt].value.checkSumAdjustment = 2981146554 - bt, ct = !0;
      break;
    }
  if (!ct)
    throw new Error("Could not find head table with checkSum to adjust.");
  return yt;
}
var xd = { make: Kh, fontToTable: yd, computeCheckSum: ya };
function xr(n, t) {
  let e = 0, s = n.length - 1;
  for (; e <= s; ) {
    const i = e + s >>> 1, r = n[i].tag;
    if (r === t)
      return i;
    r < t ? e = i + 1 : s = i - 1;
  }
  return -e - 1;
}
function No(n, t) {
  let e = 0, s = n.length - 1;
  for (; e <= s; ) {
    const i = e + s >>> 1, r = n[i];
    if (r === t)
      return i;
    r < t ? e = i + 1 : s = i - 1;
  }
  return -e - 1;
}
function Ho(n, t) {
  let e, s = 0, i = n.length - 1;
  for (; s <= i; ) {
    const r = s + i >>> 1;
    e = n[r];
    const a = e.start;
    if (a === t)
      return e;
    a < t ? s = r + 1 : i = r - 1;
  }
  if (s > 0)
    return e = n[s - 1], t > e.end ? 0 : e;
}
function Qh(n, t) {
  this.font = n, this.tableName = t;
}
Qh.prototype = {
  /**
   * Binary search an object by "tag" property
   * @instance
   * @function searchTag
   * @memberof opentype.Layout
   * @param  {Array} arr
   * @param  {string} tag
   * @return {number}
   */
  searchTag: xr,
  /**
   * Binary search in a list of numbers
   * @instance
   * @function binSearch
   * @memberof opentype.Layout
   * @param  {Array} arr
   * @param  {number} value
   * @return {number}
   */
  binSearch: No,
  /**
   * Get or create the Layout table (GSUB, GPOS etc).
   * @param  {boolean} create - Whether to create a new one.
   * @return {Object} The GSUB or GPOS table.
   */
  getTable: function(n) {
    let t = this.font.tables[this.tableName];
    return !t && n && (t = this.font.tables[this.tableName] = this.createDefaultTable()), t;
  },
  /**
   * Returns all scripts in the substitution table.
   * @instance
   * @return {Array}
   */
  getScriptNames: function() {
    let n = this.getTable();
    return n ? n.scripts.map(function(t) {
      return t.tag;
    }) : [];
  },
  /**
   * Returns the best bet for a script name.
   * Returns 'DFLT' if it exists.
   * If not, returns 'latn' if it exists.
   * If neither exist, returns undefined.
   */
  getDefaultScriptName: function() {
    let n = this.getTable();
    if (!n)
      return;
    let t = !1;
    for (let e = 0; e < n.scripts.length; e++) {
      const s = n.scripts[e].tag;
      if (s === "DFLT") return s;
      s === "latn" && (t = !0);
    }
    if (t) return "latn";
  },
  /**
   * Returns all LangSysRecords in the given script.
   * @instance
   * @param {string} [script='DFLT']
   * @param {boolean} create - forces the creation of this script table if it doesn't exist.
   * @return {Object} An object with tag and script properties.
   */
  getScriptTable: function(n, t) {
    const e = this.getTable(t);
    if (e) {
      n = n || "DFLT";
      const s = e.scripts, i = xr(e.scripts, n);
      if (i >= 0)
        return s[i].script;
      if (t) {
        const r = {
          tag: n,
          script: {
            defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
            langSysRecords: []
          }
        };
        return s.splice(-1 - i, 0, r), r.script;
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
  getLangSysTable: function(n, t, e) {
    const s = this.getScriptTable(n, e);
    if (s) {
      if (!t || t === "dflt" || t === "DFLT")
        return s.defaultLangSys;
      const i = xr(s.langSysRecords, t);
      if (i >= 0)
        return s.langSysRecords[i].langSys;
      if (e) {
        const r = {
          tag: t,
          langSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] }
        };
        return s.langSysRecords.splice(-1 - i, 0, r), r.langSys;
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
  getFeatureTable: function(n, t, e, s) {
    const i = this.getLangSysTable(n, t, s);
    if (i) {
      let r;
      const a = i.featureIndexes, o = this.font.tables[this.tableName].features;
      for (let c = 0; c < a.length; c++)
        if (r = o[a[c]], r.tag === e)
          return r.feature;
      if (s) {
        const c = o.length;
        return G.assert(c === 0 || e >= o[c - 1].tag, "Features must be added in alphabetical order."), r = {
          tag: e,
          feature: { params: 0, lookupListIndexes: [] }
        }, o.push(r), a.push(c), r.feature;
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
  getLookupTables: function(n, t, e, s, i) {
    const r = this.getFeatureTable(n, t, e, i), a = [];
    if (r) {
      let o;
      const c = r.lookupListIndexes, h = this.font.tables[this.tableName].lookups;
      for (let l = 0; l < c.length; l++)
        o = h[c[l]], o.lookupType === s && a.push(o);
      if (a.length === 0 && i) {
        o = {
          lookupType: s,
          lookupFlag: 0,
          subtables: [],
          markFilteringSet: void 0
        };
        const l = h.length;
        return h.push(o), c.push(l), [o];
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
  getGlyphClass: function(n, t) {
    switch (n.format) {
      case 1:
        return n.startGlyph <= t && t < n.startGlyph + n.classes.length ? n.classes[t - n.startGlyph] : 0;
      case 2: {
        const e = Ho(n.ranges, t);
        return e ? e.classId : 0;
      }
    }
  },
  /**
   * Find a glyph in a coverage table
   * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
   * @param {object} coverageTable - an OpenType Layout coverage table
   * @param {number} glyphIndex - the index of the glyph to find
   * @returns {number} -1 if not found
   */
  getCoverageIndex: function(n, t) {
    switch (n.format) {
      case 1: {
        const e = No(n.glyphs, t);
        return e >= 0 ? e : -1;
      }
      case 2: {
        const e = Ho(n.ranges, t);
        return e ? e.index + t - e.start : -1;
      }
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
    {
      const t = [], e = n.ranges;
      for (let s = 0; s < e.length; s++) {
        const i = e[s], r = i.start, a = i.end;
        for (let o = r; o <= a; o++)
          t.push(o);
      }
      return t;
    }
  }
};
var Bi = Qh;
function Ss(n) {
  Bi.call(this, n, "gpos");
}
Ss.prototype = Bi.prototype;
Ss.prototype.init = function() {
  const n = this.getDefaultScriptName();
  this.defaultKerningTables = this.getKerningTables(n);
};
Ss.prototype.getKerningValue = function(n, t, e) {
  for (let s = 0; s < n.length; s++) {
    const i = n[s].subtables;
    for (let r = 0; r < i.length; r++) {
      const a = i[r], o = this.getCoverageIndex(a.coverage, t);
      if (!(o < 0))
        switch (a.posFormat) {
          case 1: {
            let c = a.pairSets[o];
            for (let h = 0; h < c.length; h++) {
              let l = c[h];
              if (l.secondGlyph === e)
                return l.value1 && l.value1.xAdvance || 0;
            }
            break;
          }
          case 2: {
            const c = this.getGlyphClass(a.classDef1, t), h = this.getGlyphClass(a.classDef2, e), l = a.classRecords[c][h];
            return l.value1 && l.value1.xAdvance || 0;
          }
        }
    }
  }
  return 0;
};
Ss.prototype.getKerningTables = function(n, t) {
  if (this.font.tables.gpos)
    return this.getLookupTables(n, t, "kern", 2);
};
var bd = Ss;
function vd(n, t) {
  const e = n.length;
  if (e !== t.length)
    return !1;
  for (let s = 0; s < e; s++)
    if (n[s] !== t[s])
      return !1;
  return !0;
}
function Sd(n, t, e) {
  let s = 0, i = n.length - 1, r = null;
  for (; s <= i; ) {
    const a = Math.floor((s + i) / 2), o = n[a], c = o[t];
    if (c < e)
      s = a + 1;
    else if (c > e)
      i = a - 1;
    else {
      r = o;
      break;
    }
  }
  return r;
}
function wd(n, t, e) {
  let s = 0, i = n.length - 1;
  for (; s <= i; ) {
    const r = Math.floor((s + i) / 2), a = n[r];
    if (a[t] < e)
      s = r + 1;
    else if (a[t] > e)
      i = r - 1;
    else
      return r;
  }
  return -1;
}
function Cd(n, t, e) {
  let s = 0, i = n.length;
  const r = (a, o) => a[t] - o[t];
  for (; s < i; ) {
    const a = s + i >>> 1;
    r(n[a], e) < 0 ? s = a + 1 : i = a;
  }
  return n.splice(s, 0, e), s;
}
function tl(n) {
  return n[0] === 31 && n[1] === 139 && n[2] === 8;
}
function Td(n) {
  const t = new DataView(n.buffer, n.byteOffset, n.byteLength);
  let e = 10;
  const s = n.byteLength - 8, i = t.getInt8(3);
  if (i & 4 && (e += 2 + t.getUint16(e, !0)), i & 8)
    for (; e < s && n[e++] !== 0; ) ;
  if (i & 16)
    for (; e < s && n[e++] !== 0; ) ;
  if (i & 2 && (e += 2), e >= s) throw new Error("Can't find compressed blocks");
  const r = t.getUint32(t.byteLength - 4, !0);
  return fh(n.subarray(e, s), new Uint8Array(r));
}
function Go(n) {
  return {
    x: n.x,
    y: n.y,
    onCurve: n.onCurve,
    lastPointOfContour: n.lastPointOfContour
  };
}
function kd(n) {
  return {
    glyphIndex: n.glyphIndex,
    xScale: n.xScale,
    scale01: n.scale01,
    scale10: n.scale10,
    yScale: n.yScale,
    dx: n.dx,
    dy: n.dy
  };
}
function $t(n) {
  Bi.call(this, n, "gsub");
}
function xa(n, t, e) {
  const s = n.subtables;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (r.substFormat === t)
      return r;
  }
  if (e)
    return s.push(e), e;
}
$t.prototype = Bi.prototype;
$t.prototype.createDefaultTable = function() {
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
$t.prototype.getSingle = function(n, t, e) {
  const s = [], i = this.getLookupTables(t, e, n, 1);
  for (let r = 0; r < i.length; r++) {
    const a = i[r].subtables;
    for (let o = 0; o < a.length; o++) {
      const c = a[o], h = this.expandCoverage(c.coverage);
      let l;
      if (c.substFormat === 1) {
        const u = c.deltaGlyphId;
        for (l = 0; l < h.length; l++) {
          const f = h[l];
          s.push({ sub: f, by: f + u });
        }
      } else {
        const u = c.substitute;
        for (l = 0; l < h.length; l++)
          s.push({ sub: h[l], by: u[l] });
      }
    }
  }
  return s;
};
$t.prototype.getMultiple = function(n, t, e) {
  const s = [], i = this.getLookupTables(t, e, n, 2);
  for (let r = 0; r < i.length; r++) {
    const a = i[r].subtables;
    for (let o = 0; o < a.length; o++) {
      const c = a[o], h = this.expandCoverage(c.coverage);
      let l;
      for (l = 0; l < h.length; l++) {
        const u = h[l], f = c.sequences[l];
        s.push({ sub: u, by: f });
      }
    }
  }
  return s;
};
$t.prototype.getAlternates = function(n, t, e) {
  const s = [], i = this.getLookupTables(t, e, n, 3);
  for (let r = 0; r < i.length; r++) {
    const a = i[r].subtables;
    for (let o = 0; o < a.length; o++) {
      const c = a[o], h = this.expandCoverage(c.coverage), l = c.alternateSets;
      for (let u = 0; u < h.length; u++)
        s.push({ sub: h[u], by: l[u] });
    }
  }
  return s;
};
$t.prototype.getLigatures = function(n, t, e) {
  const s = [], i = this.getLookupTables(t, e, n, 4);
  for (let r = 0; r < i.length; r++) {
    const a = i[r].subtables;
    for (let o = 0; o < a.length; o++) {
      const c = a[o], h = this.expandCoverage(c.coverage), l = c.ligatureSets;
      for (let u = 0; u < h.length; u++) {
        const f = h[u], p = l[u];
        for (let d = 0; d < p.length; d++) {
          const g = p[d];
          s.push({
            sub: [f].concat(g.components),
            by: g.ligGlyph
          });
        }
      }
    }
  }
  return s;
};
$t.prototype.addSingle = function(n, t, e, s) {
  const i = this.getLookupTables(e, s, n, 1, !0)[0], r = xa(i, 2, {
    // lookup type 1 subtable, format 2, coverage format 1
    substFormat: 2,
    coverage: { format: 1, glyphs: [] },
    substitute: []
  });
  G.assert(r.coverage.format === 1, "Single: unable to modify coverage table format " + r.coverage.format);
  const a = t.sub;
  let o = this.binSearch(r.coverage.glyphs, a);
  o < 0 && (o = -1 - o, r.coverage.glyphs.splice(o, 0, a), r.substitute.splice(o, 0, 0)), r.substitute[o] = t.by;
};
$t.prototype.addMultiple = function(n, t, e, s) {
  G.assert(t.by instanceof Array && t.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
  const i = this.getLookupTables(e, s, n, 2, !0)[0], r = xa(i, 1, {
    // lookup type 2 subtable, format 1, coverage format 1
    substFormat: 1,
    coverage: { format: 1, glyphs: [] },
    sequences: []
  });
  G.assert(r.coverage.format === 1, "Multiple: unable to modify coverage table format " + r.coverage.format);
  const a = t.sub;
  let o = this.binSearch(r.coverage.glyphs, a);
  o < 0 && (o = -1 - o, r.coverage.glyphs.splice(o, 0, a), r.sequences.splice(o, 0, 0)), r.sequences[o] = t.by;
};
$t.prototype.addAlternate = function(n, t, e, s) {
  const i = this.getLookupTables(e, s, n, 3, !0)[0], r = xa(i, 1, {
    // lookup type 3 subtable, format 1, coverage format 1
    substFormat: 1,
    coverage: { format: 1, glyphs: [] },
    alternateSets: []
  });
  G.assert(r.coverage.format === 1, "Alternate: unable to modify coverage table format " + r.coverage.format);
  const a = t.sub;
  let o = this.binSearch(r.coverage.glyphs, a);
  o < 0 && (o = -1 - o, r.coverage.glyphs.splice(o, 0, a), r.alternateSets.splice(o, 0, 0)), r.alternateSets[o] = t.by;
};
$t.prototype.addLigature = function(n, t, e, s) {
  const i = this.getLookupTables(e, s, n, 4, !0)[0];
  let r = i.subtables[0];
  r || (r = {
    // lookup type 4 subtable, format 1, coverage format 1
    substFormat: 1,
    coverage: { format: 1, glyphs: [] },
    ligatureSets: []
  }, i.subtables[0] = r), G.assert(r.coverage.format === 1, "Ligature: unable to modify coverage table format " + r.coverage.format);
  const a = t.sub[0], o = t.sub.slice(1), c = {
    ligGlyph: t.by,
    components: o
  };
  let h = this.binSearch(r.coverage.glyphs, a);
  if (h >= 0) {
    const l = r.ligatureSets[h];
    for (let u = 0; u < l.length; u++)
      if (vd(l[u].components, o))
        return;
    l.push(c);
  } else
    h = -1 - h, r.coverage.glyphs.splice(h, 0, a), r.ligatureSets.splice(h, 0, [c]);
};
$t.prototype.getFeature = function(n, t, e) {
  if (/ss\d\d/.test(n))
    return this.getSingle(n, t, e);
  switch (n) {
    case "aalt":
    case "salt":
      return this.getSingle(n, t, e).concat(this.getAlternates(n, t, e));
    case "dlig":
    case "liga":
    case "rlig":
      return this.getLigatures(n, t, e);
    case "ccmp":
      return this.getMultiple(n, t, e).concat(this.getLigatures(n, t, e));
    case "stch":
      return this.getMultiple(n, t, e);
  }
};
$t.prototype.add = function(n, t, e, s) {
  if (/ss\d\d/.test(n))
    return this.addSingle(n, t, e, s);
  switch (n) {
    case "aalt":
    case "salt":
      return typeof t.by == "number" ? this.addSingle(n, t, e, s) : this.addAlternate(n, t, e, s);
    case "dlig":
    case "liga":
    case "rlig":
      return this.addLigature(n, t, e, s);
    case "ccmp":
      return t.by instanceof Array ? this.addMultiple(n, t, e, s) : this.addLigature(n, t, e, s);
  }
};
var Ad = $t, el = class {
  // private properties don't work with reify
  // @TODO: refactor once we migrated to ES6 modules, see https://github.com/opentypejs/opentype.js/pull/579
  // #font = null;
  /**
   * @type {integer} CPAL color used to (pre)fill unset colors in a palette.
   * Format 0xBBGGRRAA
   */
  // defaultValue = 0x000000FF;
  /**
   * 
   * @param {opentype.Font} font 
   */
  constructor(n) {
    this.defaultValue = 255, this.font = n;
  }
  /**
   * Returns the font's cpal table object if present
   * @returns {Object}
   */
  cpal() {
    return this.font.tables && this.font.tables.cpal ? this.font.tables.cpal : !1;
  }
  /**
   * Returns an array of arrays of color values for each palette, optionally in a specified color format
   * @param {string} colorFormat 
   * @returns {Array<Array>}
   */
  getAll(n) {
    const t = [], e = this.cpal();
    if (!e) return t;
    for (let s = 0; s < e.colorRecordIndices.length; s++) {
      const i = e.colorRecordIndices[s], r = [];
      for (let a = i; a < i + e.numPaletteEntries; a++)
        r.push(Gn(e.colorRecords[a], n || "hexa"));
      t.push(r);
    }
    return t;
  }
  /**
   * Converts a color value string or array of color value strings to CPAL integer color value(s)
   * @param {string|Array<string></string>} color 
   * @returns {integer}
   */
  toCPALcolor(n) {
    return Array.isArray(n) ? n.map((t) => ki(t, "raw")) : ki(n, "raw");
  }
  /**
   * Fills a set of palette colors (from palette index, or a provided array of CPAL color values) with a set of colors, falling back to the default color value, until a given count
   * @param {Array<string>|integer} palette Palette index integer or Array of colors to be filled
   * @param {Array<string|integer>} colors Colors to fill the palette with
   * @param {integer} _colorCount Number of colors to fill the palette with, defaults to the value of the numPaletteEntries field. Used internally by extend() and shouldn't be set manually
   * @returns 
   */
  fillPalette(n, t = [], e = this.cpal().numPaletteEntries) {
    return n = Number.isInteger(n) ? this.get(n, "raw") : n, Object.assign(Array(e).fill(this.defaultValue), this.toCPALcolor(n).concat(this.toCPALcolor(t)));
  }
  /**
   * Extend existing palettes and numPaletteEntries by a number of color slots
   * @param {integer} num number of additional color slots to add to all palettes
   */
  extend(n) {
    if (this.ensureCPAL(Array(n).fill(this.defaultValue)))
      return;
    const t = this.cpal(), e = t.numPaletteEntries + n, s = this.getAll().map((i) => this.fillPalette(i, [], e));
    t.numPaletteEntries = e, t.colorRecords = this.toCPALcolor(s.flat()), this.updateIndices();
  }
  /**
   * Get a specific palette by its zero-based index
   * @param {integer} paletteIndex 
   * @param {string} [colorFormat='hexa']
   * @returns {Array}
   */
  get(n, t = "hexa") {
    return this.getAll(t)[n] || null;
  }
  /**
   * Get a color from a specific palette by its zero-based index
   * @param {integer} index 
   * @param {integer} paletteIndex
   * @param {string} [colorFormat ='hexa']
   * @returns 
   */
  getColor(n, t = 0, e = "hexa") {
    return pa(this.font, n, t, e);
  }
  /**
   * Set one or more colors on a specific palette by its zero-based index
   * @param {integer} index zero-based color index to start filling from
   * @param {string|integer|Array<string|integer>} color color value or array of color values
   * @param {integer} paletteIndex
   * @returns 
   */
  setColor(n, t, e = 0) {
    n = parseInt(n), e = parseInt(e);
    let s = this.getAll("raw"), i = s[e];
    if (!i)
      throw Error(`paletteIndex ${e} out of range`);
    const r = this.cpal(), a = r.numPaletteEntries;
    Array.isArray(t) || (t = [t]), t.length + n > a && (this.extend(t.length + n - a), s = this.getAll("raw"), i = s[e]);
    for (let o = 0; o < t.length; o++)
      i[o + n] = this.toCPALcolor(t[o]);
    r.colorRecords = s.flat(), this.updateIndices();
  }
  /**
   * Add a new palette. 
   * @param {Array} colors (optional) colors to add to the palette, differences to existing palettes will be filled with the defaultValue.
   * @returns 
   */
  add(n) {
    if (this.ensureCPAL(n))
      return;
    const t = this.cpal(), e = t.numPaletteEntries;
    n && n.length ? (n = this.toCPALcolor(n), n.length > e ? this.extend(n.length - e) : n.length < e && (n = this.fillPalette(n)), t.colorRecordIndices.push(t.colorRecords.length), t.colorRecords.push(...n)) : (t.colorRecordIndices.push(t.colorRecords.length), t.colorRecords.push(...Array(e).fill(this.defaultValue)));
  }
  /**
   * deletes a palette by its zero-based index
   * @param {integer} paletteIndex 
   */
  delete(n) {
    const t = this.getAll("raw");
    delete t[n];
    const e = this.cpal();
    e.colorRecordIndices.pop(), e.colorRecords = t.flat();
  }
  /**
   * Deletes a specific color index in all palettes and updates all layers using that color with the replacement index
   * @param {integer} colorIndex index of the color that should be deleted
   * @param {integer} replacementIndex index (according to the palette before deletion) of the color to replace in layers using the color to be to deleted
   */
  deleteColor(n, t) {
    if (n === t)
      throw Error("replacementIndex cannot be the same as colorIndex");
    const e = this.cpal(), s = this.getAll("raw"), i = [];
    if (t > e.numPaletteEntries - 1)
      throw Error(`Replacement index out of range: numPaletteEntries after deletion: ${e.numPaletteEntries - 1}, replacementIndex: ${t})`);
    for (let o = 0; o < s.length; o++) {
      const h = s[o].filter((l, u) => u !== n);
      i.push(h);
    }
    const r = this.font.tables.colr;
    if (r) {
      const o = r.layerRecords;
      for (let c = 0; c < o.length; c++) {
        const h = o[c].paletteIndex;
        if (h > n)
          o[c].paletteIndex -= 1;
        else if (h === n) {
          let l = 0;
          for (let u = 0; u < s.length; u++)
            if (t > n && t <= n + s[u].length) {
              l++;
              break;
            }
          o[c].paletteIndex = t - l;
        }
      }
      this.font.tables.colr = {
        ...r,
        layerRecords: o
      };
    }
    const a = i.flat();
    for (let o = 0; o < s.length; o++)
      e.colorRecordIndices[o] -= o;
    e.numPaletteEntries = Math.max(0, e.numPaletteEntries - 1), e.colorRecords = this.toCPALcolor(a);
  }
  /**
   * Makes sure that the CPAL table exists and is populated with default values.
   * @param {Array} colors (optional) colors to populate on creation
   * @returns {Boolean} true if it was created, false if it already existed.
   */
  ensureCPAL(n) {
    return this.cpal() ? !1 : (!n || !n.length ? n = [this.defaultValue] : n = this.toCPALcolor(n), this.font.tables.cpal = {
      version: 0,
      numPaletteEntries: n.length,
      colorRecords: n,
      colorRecordIndices: [0]
    }, !0);
  }
  /**
   * Mainly used internally. Recalculates the colorRecordIndices array based on the numPaletteEntries and number of palettes
   */
  updateIndices() {
    const n = this.cpal(), t = Math.ceil(n.colorRecords.length / n.numPaletteEntries);
    n.colorRecordIndices = [];
    for (let e = 0; e < t; e++)
      n.colorRecordIndices.push(e * n.numPaletteEntries);
  }
}, Fd = class {
  // private properties don't work with reify
  // @TODO: refactor once we migrated to ES6 modules, see https://github.com/opentypejs/opentype.js/pull/579
  // #font = null;
  constructor(n) {
    this.font = n;
  }
  /**
   * Mainly used internally. Ensures that the COLR table exists and is populated with default values
   * @returns the LayerManager's font instance for chaining
   */
  ensureCOLR() {
    return this.font.tables.colr || (this.font.tables.colr = {
      version: 0,
      baseGlyphRecords: [],
      layerRecords: []
    }), this.font;
  }
  /**
   * Gets the layers for a specific glyph
   * @param {integer} glyphIndex
   * @returns {Array<Object>} array of layer objects {glyph, paletteIndex}
   */
  get(n) {
    const t = this.font, e = [], s = t.tables.colr, i = t.tables.cpal;
    if (!s || !i)
      return e;
    const r = Sd(s.baseGlyphRecords, "glyphID", n);
    if (!r)
      return e;
    const a = r.firstLayerIndex, o = r.numLayers;
    for (let c = 0; c < o; c++) {
      const h = s.layerRecords[a + c];
      e.push({
        glyph: t.glyphs.get(h.glyphID),
        paletteIndex: h.paletteIndex
      });
    }
    return e;
  }
  /**
   * Adds one or more layers to a glyph, at the end or at a specific position.
   * @param {integer} glyphIndex glyph index to add the layer(s) to.
   * @param {Array|Object} layers layer object {glyph, paletteIndex}/{glyphID, paletteIndex} or array of layer objects.
   * @param {integer?} position position to insert the layers at (will default to adding at the end).
   */
  add(n, t, e) {
    const s = this.get(n);
    t = Array.isArray(t) ? t : [t], e === void 0 || e === 1 / 0 || e > s.length ? e = s.length : e < 0 && (e = s.length + 1 + e % (s.length + 1), e >= s.length + 1 && (e -= s.length + 1));
    const i = [];
    for (let r = 0; r < e; r++) {
      const a = Number.isInteger(s[r].glyph) ? s[r].glyph : s[r].glyph.index;
      i.push({
        glyphID: a,
        paletteIndex: s[r].paletteIndex
      });
    }
    for (const r of t) {
      const a = Number.isInteger(r.glyph) ? r.glyph : r.glyph.index;
      i.push({
        glyphID: a,
        paletteIndex: r.paletteIndex
      });
    }
    for (let r = e; r < s.length; r++) {
      const a = Number.isInteger(s[r].glyph) ? s[r].glyph : s[r].glyph.index;
      i.push({
        glyphID: a,
        paletteIndex: s[r].paletteIndex
      });
    }
    this.updateColrTable(n, i);
  }
  /**
   * Sets a color glyph layer's paletteIndex property to a new index
   * @param {integer} glyphIndex glyph in the font by zero-based glyph index
   * @param {integer} layerIndex layer in the glyph by zero-based layer index
   * @param {integer} paletteIndex new color to set for the layer by zero-based index in any palette
   */
  setPaletteIndex(n, t, e) {
    let s = this.get(n);
    s[t] ? (s = s.map((i, r) => ({
      glyphID: i.glyph.index,
      paletteIndex: r === t ? e : i.paletteIndex
    })), this.updateColrTable(n, s)) : console.error("Invalid layer index");
  }
  /**
   * Removes one or more layers from a glyph.
   * @param {integer} glyphIndex glyph index to remove the layer(s) from
   * @param {integer} start index to remove the layer at
   * @param {integer?} end (optional) if provided, removes all layers from start index to (and including) end index
   */
  remove(n, t, e = t) {
    let s = this.get(n);
    s = s.map((i) => ({
      glyphID: i.glyph.index,
      paletteIndex: i.paletteIndex
    })), s.splice(t, e - t + 1), this.updateColrTable(n, s);
  }
  /**
   * Mainly used internally. Mainly used internally. Updates the colr table, adding a baseGlyphRecord if needed,
   * ensuring that it's inserted at the correct position, updating numLayers, and adjusting firstLayerIndex values
   * for all baseGlyphRecords according to any deletions or insertions.
   * @param {integer} glyphIndex 
   * @param {Array<Object>} layers array of layer objects {glyphID, paletteIndex}
   */
  updateColrTable(n, t) {
    this.ensureCOLR();
    const s = this.font.tables.colr;
    let i = wd(s.baseGlyphRecords, "glyphID", n);
    if (i === -1) {
      const l = { glyphID: n, firstLayerIndex: s.layerRecords.length, numLayers: 0 };
      i = Cd(s.baseGlyphRecords, "glyphID", l);
    }
    const a = s.baseGlyphRecords[i], o = a.numLayers, c = t.length, h = c - o;
    if (h > 0) {
      const l = t.slice(o).map((u) => ({
        glyphID: u.glyphID,
        paletteIndex: u.paletteIndex
      }));
      s.layerRecords.splice(a.firstLayerIndex + o, 0, ...l);
    } else h < 0 && s.layerRecords.splice(a.firstLayerIndex + c, -h);
    for (let l = 0; l < Math.min(o, c); l++)
      s.layerRecords[a.firstLayerIndex + l] = {
        glyphID: t[l].glyphID,
        paletteIndex: t[l].paletteIndex
      };
    if (a.numLayers = c, h !== 0)
      for (let l = 0; l < s.baseGlyphRecords.length; l++) {
        const u = s.baseGlyphRecords[l];
        l === i || u.firstLayerIndex < a.firstLayerIndex || (s.baseGlyphRecords[l].firstLayerIndex += h);
      }
  }
}, Ed = class {
  /**
   * @param {opentype.Font} font
   */
  constructor(n) {
    this.font = n, this.cache = /* @__PURE__ */ new WeakMap();
  }
  /**
   * @param {number} glyphIndex
   * @returns {SvgImage | undefined}
   */
  get(n) {
    const t = this.getOrCreateSvgImageCacheEntry(n);
    return t && t.image;
  }
  /**
   * @param {number} glyphIndex
   * @returns {Promise<SvgImage> | undefined}
   */
  getAsync(n) {
    const t = this.getOrCreateSvgImageCacheEntry(n);
    return t && t.promise;
  }
  /**
   * @param {number} glyphIndex
   * @returns {SVGImageCacheEntry | undefined}
   */
  getOrCreateSvgImageCacheEntry(n) {
    const t = this.font.tables.svg;
    if (t === void 0) return;
    const e = t.get(n);
    if (e === void 0) return;
    let s = this.cache.get(e);
    s === void 0 && (s = Md(e), this.cache.set(e, s));
    let i = s.images.get(n);
    return i === void 0 && (i = Od(this.font, s.template, n), i.promise.then((r) => {
      if (i.image = r, typeof this.font.onGlyphUpdated == "function")
        try {
          this.font.onGlyphUpdated(n);
        } catch (a) {
          console.error("font.onGlyphUpdated", n, a);
        }
    }), s.images.set(n, i)), i;
  }
};
function Md(n) {
  return {
    template: _d(n).then(Rd),
    images: /* @__PURE__ */ new Map()
  };
}
function Od(n, t, e) {
  return {
    promise: t.then((s) => {
      let i;
      typeof s == "string" ? i = s : (s[4] = e, i = s.join(""));
      const r = Bd(i, n.unitsPerEm);
      return r.image.decode().then(() => r);
    }),
    image: void 0
  };
}
var _d = typeof DecompressionStream == "function" ? Id : Ld;
function Ld(n) {
  try {
    return Promise.resolve(new TextDecoder().decode(tl(n) ? Td(n) : n));
  } catch (t) {
    return Promise.reject(t);
  }
}
function Id(n) {
  if (tl(n))
    return new Response(new Response(n).body.pipeThrough(new DecompressionStream("gzip"))).text();
  try {
    return Promise.resolve(new TextDecoder().decode(n));
  } catch (t) {
    return Promise.reject(t);
  }
}
function Rd(n) {
  const t = n.indexOf("<svg"), e = n.indexOf(">", t + 4) + 1;
  if (/ id=['"]glyph\d+['"]/.test(n.substring(t, e)))
    return n;
  const s = n.lastIndexOf("</svg>");
  return [
    n.substring(0, e),
    "<defs>",
    n.substring(e, s),
    '</defs><use href="#glyph',
    "",
    '"/>',
    n.substring(s)
  ];
}
function Bd(n, t) {
  const s = new DOMParser().parseFromString(n, "image/svg+xml").documentElement, i = s.viewBox.baseVal, r = s.width.baseVal, a = s.height.baseVal;
  let o = 1, c = 1;
  i.width > 0 && i.height > 0 && (r.unitType === 1 ? (o = r.valueInSpecifiedUnits / i.width, c = a.unitType === 1 ? a.valueInSpecifiedUnits / i.height : o) : a.unitType === 1 ? (c = a.valueInSpecifiedUnits / i.height, o = c) : t && (o = t / i.width, c = t / i.height));
  const h = document.createElement("div");
  h.style.position = "fixed", h.style.visibility = "hidden", h.appendChild(s), document.body.appendChild(h);
  const l = s.getBBox();
  document.body.removeChild(h);
  const u = (l.x - i.x) * o, f = (i.y - l.y) * c, p = l.width * o, d = l.height * c;
  s.setAttribute("viewBox", [l.x, l.y, l.width, l.height].join(" ")), o !== 1 && s.setAttribute("width", p), c !== 1 && s.setAttribute("height", d);
  const g = new Image(p, d);
  return g.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s.outerHTML), { leftSideBearing: u, baseline: f, image: g };
}
var br = /* @__PURE__ */ new WeakMap();
function Vo(n, t, e, s, i) {
  let r;
  return (t & s) > 0 ? (r = n.parseByte(), t & i || (r = -r), r = e + r) : (t & i) > 0 ? r = e : r = e + n.parseShort(), r;
}
function nl(n, t, e) {
  const s = new N.Parser(t, e);
  n._numberOfContours = s.parseShort(), n._xMin = s.parseShort(), n._yMin = s.parseShort(), n._xMax = s.parseShort(), n._yMax = s.parseShort();
  let i, r;
  if (n._numberOfContours > 0) {
    const a = n.endPointIndices = [];
    for (let c = 0; c < n._numberOfContours; c += 1)
      a.push(s.parseUShort());
    n.instructionLength = s.parseUShort(), n.instructions = [];
    for (let c = 0; c < n.instructionLength; c += 1)
      n.instructions.push(s.parseByte());
    const o = a[a.length - 1] + 1;
    i = [];
    for (let c = 0; c < o; c += 1)
      if (r = s.parseByte(), i.push(r), (r & 8) > 0) {
        const h = s.parseByte();
        for (let l = 0; l < h; l += 1)
          i.push(r), c += 1;
      }
    if (G.argument(i.length === o, "Bad flags."), a.length > 0) {
      const c = [];
      let h;
      if (o > 0) {
        for (let f = 0; f < o; f += 1)
          r = i[f], h = {}, h.onCurve = !!(r & 1), h.lastPointOfContour = a.indexOf(f) >= 0, c.push(h);
        let l = 0;
        for (let f = 0; f < o; f += 1)
          r = i[f], h = c[f], h.x = Vo(s, r, l, 2, 16), l = h.x;
        let u = 0;
        for (let f = 0; f < o; f += 1)
          r = i[f], h = c[f], h.y = Vo(s, r, u, 4, 32), u = h.y;
      }
      n.points = c;
    } else
      n.points = [];
  } else if (n._numberOfContours === 0)
    n.points = [];
  else {
    n.isComposite = !0, n.points = [], n.components = [];
    let a = !0;
    for (; a; ) {
      i = s.parseUShort();
      const o = {
        glyphIndex: s.parseUShort(),
        xScale: 1,
        scale01: 0,
        scale10: 0,
        yScale: 1,
        dx: 0,
        dy: 0
      };
      (i & 1) > 0 ? (i & 2) > 0 ? (o.dx = s.parseShort(), o.dy = s.parseShort()) : o.matchedPoints = [s.parseUShort(), s.parseUShort()] : (i & 2) > 0 ? (o.dx = s.parseChar(), o.dy = s.parseChar()) : o.matchedPoints = [s.parseByte(), s.parseByte()], (i & 8) > 0 ? o.xScale = o.yScale = s.parseF2Dot14() : (i & 64) > 0 ? (o.xScale = s.parseF2Dot14(), o.yScale = s.parseF2Dot14()) : (i & 128) > 0 && (o.xScale = s.parseF2Dot14(), o.scale01 = s.parseF2Dot14(), o.scale10 = s.parseF2Dot14(), o.yScale = s.parseF2Dot14()), n.components.push(o), a = !!(i & 32);
    }
    if (i & 256) {
      n.instructionLength = s.parseUShort(), n.instructions = [];
      for (let o = 0; o < n.instructionLength; o += 1)
        n.instructions.push(s.parseByte());
    }
  }
}
function ri(n, t) {
  const e = [];
  for (let s = 0; s < n.length; s += 1) {
    const i = n[s], r = {
      x: t.xScale * i.x + t.scale10 * i.y + t.dx,
      y: t.scale01 * i.x + t.yScale * i.y + t.dy,
      onCurve: i.onCurve,
      lastPointOfContour: i.lastPointOfContour
    };
    e.push(r);
  }
  return e;
}
function Dd(n) {
  const t = [];
  let e = [];
  for (let s = 0; s < n.length; s += 1) {
    const i = n[s];
    e.push(i), i.lastPointOfContour && (t.push(e), e = []);
  }
  return G.argument(e.length === 0, "There are still points left in the current contour."), t;
}
function ba(n) {
  const t = new Pn();
  if (!n)
    return t;
  const e = Dd(n);
  for (let s = 0; s < e.length; ++s) {
    const i = e[s];
    let r = i[i.length - 1], a = i[0];
    if (r.onCurve)
      t.moveTo(r.x, r.y);
    else if (a.onCurve)
      t.moveTo(a.x, a.y);
    else {
      const o = { x: (r.x + a.x) * 0.5, y: (r.y + a.y) * 0.5 };
      t.moveTo(o.x, o.y);
    }
    for (let o = 0; o < i.length; ++o)
      if (r = a, a = i[(o + 1) % i.length], r.onCurve)
        t.lineTo(r.x, r.y);
      else {
        let c = a;
        a.onCurve || (c = { x: (r.x + a.x) * 0.5, y: (r.y + a.y) * 0.5 }), t.quadraticCurveTo(r.x, r.y, c.x, c.y);
      }
    t.closePath();
  }
  return t;
}
function sl(n, t) {
  if (t.isComposite) {
    br.has(n) || br.set(n, /* @__PURE__ */ new Set());
    const e = br.get(n);
    e.add(t.index);
    try {
      for (let s = 0; s < t.components.length; s += 1) {
        const i = t.components[s];
        if (e.has(i.glyphIndex))
          continue;
        const r = n.get(i.glyphIndex);
        if (r.getPath(), r.points) {
          let a;
          if (i.matchedPoints === void 0)
            a = ri(r.points, i);
          else {
            if (i.matchedPoints[0] > t.points.length - 1 || i.matchedPoints[1] > r.points.length - 1)
              throw Error("Matched points out of range in " + t.name);
            const o = t.points[i.matchedPoints[0]];
            let c = r.points[i.matchedPoints[1]];
            const h = {
              xScale: i.xScale,
              scale01: i.scale01,
              scale10: i.scale10,
              yScale: i.yScale,
              dx: 0,
              dy: 0
            };
            c = ri([c], h)[0], h.dx = o.x - c.x, h.dy = o.y - c.y, a = ri(r.points, h);
          }
          t.points = t.points.concat(a);
        }
      }
    } finally {
      e.delete(t.index);
    }
  }
  return ba(t.points);
}
function Ud(n, t, e, s) {
  const i = new be.GlyphSet(s);
  for (let r = 0; r < e.length - 1; r += 1) {
    const a = e[r], o = e[r + 1];
    a !== o ? i.push(r, be.ttfGlyphLoader(s, r, nl, n, t + a, sl)) : i.push(r, be.glyphLoader(s, r));
  }
  return i;
}
function Pd(n, t, e, s) {
  const i = new be.GlyphSet(s);
  return s._push = function(r) {
    const a = e[r], o = e[r + 1];
    a !== o ? i.push(r, be.ttfGlyphLoader(s, r, nl, n, t + a, sl)) : i.push(r, be.glyphLoader(s, r));
  }, i;
}
function zd(n, t, e, s, i) {
  return i.lowMemory ? Pd(n, t, e, s) : Ud(n, t, e, s);
}
var il = { getPath: ba, parse: zd }, Nd = class {
  constructor(n) {
    this.font = n;
  }
  /**
   * Modifies a coords object to make sure that tags have a length of 4
   * @param {Object} coords - variation coordinates
   */
  normalizeCoordTags(n) {
    for (const t in n)
      if (t.length < 4) {
        const e = t.padEnd(4, " ");
        n[e] === void 0 && (n[e] = n[t]), delete n[t];
      }
  }
  /**
   * Normalizes the coordinates from the axis ranges to a range of -1 to 1.
   * @param {Object} coords - The coordinates object to normalize.
   * @returns {Array<number>} The normalized coordinates as an array
   */
  getNormalizedCoords(n) {
    n || (n = this.font.variation.get());
    let t = [];
    this.normalizeCoordTags(n);
    for (let e = 0; e < this.fvar().axes.length; e++) {
      const s = this.fvar().axes[e];
      let i = n[s.tag];
      i === void 0 && (i = s.defaultValue), i < s.defaultValue ? t.push((i - s.defaultValue + Number.EPSILON) / (s.defaultValue - s.minValue + Number.EPSILON)) : t.push((i - s.defaultValue + Number.EPSILON) / (s.maxValue - s.defaultValue + Number.EPSILON));
    }
    if (this.avar())
      for (let e = 0; e < this.avar().axisSegmentMaps.length; e++) {
        let s = this.avar().axisSegmentMaps[e];
        for (let i = 0; i < s.axisValueMaps.length; i++) {
          let r = s.axisValueMaps[i];
          if (i >= 1 && t[e] < r.fromCoordinate) {
            let a = s.axisValueMaps[i - 1];
            t[e] = ((t[e] - a.fromCoordinate) * (r.toCoordinate - a.toCoordinate) + Number.EPSILON) / (r.fromCoordinate - a.fromCoordinate + Number.EPSILON) + a.toCoordinate;
            break;
          }
        }
      }
    return t;
  }
  /**
   * Interpolates points within a glyph if deltas are not provided for all points.
   * @param {Array<Object>} points - The points to be interpolated.
   * @param {Array<Object>} glyphPoints - Reference points from the glyph.
   * @param {Object} deltaMap - A map indicating which points have deltas.
   */
  interpolatePoints(n, t, e) {
    if (n.length === 0)
      return;
    let s = 0;
    for (; s < n.length; ) {
      let i = s, r = s, a = n[r];
      for (; !a.lastPointOfContour; )
        a = n[++r];
      for (; s <= r && !e[s]; )
        s++;
      if (s > r)
        continue;
      let o = s, c = s;
      for (s++; s <= r; )
        e[s] && (this.deltaInterpolate(c + 1, s - 1, c, s, t, n), c = s), s++;
      c === o ? this.deltaShift(i, r, c, t, n) : (this.deltaInterpolate(c + 1, r, c, o, t, n), o > 0 && this.deltaInterpolate(i, o - 1, c, o, t, n)), s = r + 1;
    }
  }
  /**
   * Interpolates delta values between two points.
   * @param {number} p1 - Start point index for interpolation.
   * @param {number} p2 - End point index for interpolation.
   * @param {number} ref1 - Reference point index for the start delta.
   * @param {number} ref2 - Reference point index for the end delta.
   * @param {Array<Object>} glyphPoints - Reference points from the glyph.
   * @param {Array<Object>} points - The points to be adjusted.
   */
  deltaInterpolate(n, t, e, s, i, r) {
    if (n > t)
      return;
    let a = ["x", "y"];
    for (let c = 0; c < a.length; c++) {
      let h = a[c];
      if (i[e][h] > i[s][h]) {
        var o = e;
        e = s, s = o;
      }
      let l = i[e][h], u = i[s][h], f = r[e][h], p = r[s][h];
      if (l !== u || f === p) {
        let d = l === u ? 0 : (p - f) / (u - l);
        for (let g = n; g <= t; g++) {
          let x = i[g][h];
          x <= l ? x += f - l : x >= u ? x += p - u : x = f + (x - l) * d, r[g][h] = x;
        }
      }
    }
  }
  /**
   * Applies a delta shift to a range of points based on a reference point.
   * @param {number} p1 - Start point index for shifting.
   * @param {number} p2 - End point index for shifting.
   * @param {number} ref - Reference point index.
   * @param {Array<Object>} glyphPoints - Reference points from the glyph.
   * @param {Array<Object>} points - The points to be shifted.
   */
  deltaShift(n, t, e, s, i) {
    let r = i[e].x - s[e].x, a = i[e].y - s[e].y;
    if (!(r === 0 && a === 0))
      for (let o = n; o <= t; o++)
        o !== e && (i[o].x += r, i[o].y += a);
  }
  /**
   * Transforms glyph components based on variation data.
   * @param {Glyph} glyph - The composite glyph to transform.
   * @param {Array<Object>} transformedPoints - Points that are already transformed.
   * @param {Object} coords - Variation coordinates.
   * @param {Array<number>} tuplePoints - Points that are part of the tuple.
   * @param {Object} header - Header information from the variation data.
   * @param {number} factor - The scaling factor for the transformation.
   */
  transformComponents(n, t, e, s, i, r) {
    let a = 0;
    for (let o = 0; o < n.components.length; o++) {
      const c = n.components[o], h = this.font.glyphs.get(c.glyphIndex), l = kd(c), u = s.indexOf(o);
      u > -1 && (l.dx += Math.round(i.deltas[u] * r), l.dy += Math.round(i.deltasY[u] * r));
      const f = ri(this.getTransform(h, e).points, l);
      t.splice(a, f.length, ...f), a += h.points.length;
    }
  }
  applyTupleVariationStore(n, t, e, s = "gvar", i = {}) {
    e || (e = this.font.variation.get());
    const r = this.getNormalizedCoords(e), { headers: a, sharedPoints: o } = n, c = this.fvar().axes.length;
    let h;
    s === "gvar" ? h = t.map(Go) : s === "cvar" && (h = [...t]);
    for (let l = 0; l < a.length; l++) {
      const u = a[l];
      let f = 1;
      for (let d = 0; d < c; d++) {
        let g = [0];
        switch (s) {
          case "gvar":
            g = u.peakTuple ? u.peakTuple : this.gvar().sharedTuples[u.sharedTupleRecordsIndex];
            break;
          case "cvar":
            g = u.peakTuple;
            break;
        }
        if (g[d] !== 0) {
          if (r[d] === 0) {
            f = 0;
            break;
          }
          if (u.intermediateStartTuple)
            if (r[d] < u.intermediateStartTuple[d] || r[d] > u.intermediateEndTuple[d]) {
              f = 0;
              break;
            } else r[d] < g[d] ? f = f * (r[d] - u.intermediateStartTuple[d] + Number.EPSILON) / (g[d] - u.intermediateStartTuple[d] + Number.EPSILON) : f = f * (u.intermediateEndTuple[d] - r[d] + Number.EPSILON) / (u.intermediateEndTuple[d] - g[d] + Number.EPSILON);
          else {
            if (r[d] < Math.min(0, g[d]) || r[d] > Math.max(0, g[d])) {
              f = 0;
              break;
            }
            f = (f * r[d] + Number.EPSILON) / (g[d] + Number.EPSILON);
          }
        }
      }
      if (f === 0)
        continue;
      const p = u.privatePoints.length ? u.privatePoints : o;
      if (s === "gvar" && i.glyph && i.glyph.isComposite)
        this.transformComponents(i.glyph, h, e, p, u, f);
      else if (p.length === 0)
        for (let d = 0; d < h.length; d++) {
          const g = h[d];
          s === "gvar" ? h[d] = {
            x: Math.round(g.x + u.deltas[d] * f),
            y: Math.round(g.y + u.deltasY[d] * f),
            onCurve: g.onCurve,
            lastPointOfContour: g.lastPointOfContour
          } : s === "cvar" && (h[d] = Math.round(g + u.deltas[d] * f));
        }
      else {
        let d;
        s === "gvar" ? d = h.map(Go) : s === "cvar" && (d = h);
        const g = Array(t.length).fill(!1);
        for (let x = 0; x < p.length; x++) {
          let b = p[x];
          if (b < t.length) {
            let v = d[b];
            s === "gvar" ? (g[b] = !0, v.x += u.deltas[x] * f, v.y += u.deltasY[x] * f) : s === "cvar" && (h[b] = Math.round(v + u.deltas[x] * f));
          }
        }
        if (s === "gvar") {
          this.interpolatePoints(d, h, g);
          for (let x = 0; x < t.length; x++) {
            let b = d[x].x - h[x].x, v = d[x].y - h[x].y;
            h[x].x = Math.round(h[x].x + b), h[x].y = Math.round(h[x].y + v);
          }
        }
      }
    }
    return h;
  }
  /**
   * Retrieves a transformed copy of a glyph based on the provided variation coordinates, or the glyph itself if no variation was applied
   * @param {opentype.Glyph|number} glyph - Glyph or index of glyph to transform.
   * @param {Object} coords - Variation coords object (will fall back to variation coords in the defaultRenderOptions)
   * @returns {opentype.Glyph} - The transformed glyph.
   */
  getTransform(n, t) {
    Number.isInteger(n) && (n = this.font.glyphs.get(n));
    const e = n.getBlendPath, s = !!(n.points && n.points.length);
    let i = n;
    if (e || s) {
      if (t || (t = this.font.variation.get()), s) {
        const r = this.gvar() && this.gvar().glyphVariations[n.index];
        if (r) {
          const a = n.points;
          let o = this.applyTupleVariationStore(r, a, t, "gvar", { glyph: n });
          i = new ps(Object.assign({}, n, { points: o, path: ba(o) }));
        }
      } else if (e) {
        const r = n.getBlendPath(t);
        i = new ps(Object.assign({}, n, { path: r }));
      }
    }
    return this.font.tables.hvar && (n._advanceWidth = typeof n._advanceWidth < "u" ? n._advanceWidth : n.advanceWidth, n.advanceWidth = i.advanceWidth = Math.round(n._advanceWidth + this.getVariableAdjustment(i.index, "hvar", "advanceWidth", t)), n._leftSideBearing = typeof n._leftSideBearing < "u" ? n._leftSideBearing : n.leftSideBearing, n.leftSideBearing = i.leftSideBearing = Math.round(n._leftSideBearing + this.getVariableAdjustment(i.index, "hvar", "lsb", t))), i;
  }
  getCvarTransform(n) {
    const t = this.font.tables.cvt, e = this.cvar();
    return !t || !t.length || !e || !e.headers.length ? t : this.applyTupleVariationStore(e, t, n, "cvar");
  }
  /**
   * Calculates the variable adjustment for a glyph property from variation data.
   * @param {number} gid - Glyph ID.
   * @param {string} tableName - The name of the variation data table.
   * @param {string} parameter - The property to adjust.
   * @param {Object} coords - Variation coordinates.
   * @returns {number} - The calculated adjustment.
   */
  getVariableAdjustment(n, t, e, s) {
    s = s || this.font.variation.get();
    let i, r;
    const a = this.font.tables[t];
    if (!a)
      throw Error(`trying to get variation adjustment from non-existent table "${a}"`);
    if (!a.itemVariationStore)
      throw Error(`trying to get variation adjustment from table "${a}" which does not have an itemVariationStore`);
    const o = a[e] && a[e].map.length;
    if (o) {
      let c = n;
      c >= o && (c = o - 1), { outerIndex: i, innerIndex: r } = a[e].map[c];
    } else
      i = 0, r = n;
    return this.getDelta(a.itemVariationStore, i, r, s);
  }
  /**
   * Retrieves the delta value from a variation store.
   * @param {Object} itemStore - The item variation store.
   * @param {number} outerIndex - The outer index in the variation subtables.
   * @param {number} innerIndex - The inner index in the delta sets.
   * @param {Object} coords - Variation coordinates.
   * @returns {number} - The delta value.
   */
  getDelta(n, t, e, s) {
    if (t >= n.itemVariationSubtables.length)
      return 0;
    let i = n.itemVariationSubtables[t];
    if (e >= i.deltaSets.length)
      return 0;
    let r = i.deltaSets[e], a = this.getBlendVector(n, t, s), o = 0;
    for (let c = 0; c < i.regionIndexes.length; c++)
      o += r[c] * a[c];
    return o;
  }
  /**
   * Calculates the blend vector for a set of variation coordinates.
   * @param {Object} itemStore - The item variation store.
   * @param {number} itemIndex - Index of the current item in the variation subtables.
   * @param {Object} coords - Variation coordinates.
   * @returns {Array<number>} - The blend vector for the given coordinates.
   */
  getBlendVector(n, t, e) {
    e || (e = this.font.variation.get());
    let s = n.itemVariationSubtables[t];
    const i = this.getNormalizedCoords(e);
    let r = [];
    for (let a = 0; a < s.regionIndexes.length; a++) {
      let o = 1, c = s.regionIndexes[a], h = n.variationRegions[c].regionAxes;
      for (let l = 0; l < h.length; l++) {
        let u = h[l], f;
        u.startCoord > u.peakCoord || u.peakCoord > u.endCoord || u.startCoord < 0 && u.endCoord > 0 && u.peakCoord !== 0 || u.peakCoord === 0 ? f = 1 : i[l] < u.startCoord || i[l] > u.endCoord ? f = 0 : i[l] === u.peakCoord ? f = 1 : i[l] < u.peakCoord ? f = (i[l] - u.startCoord + Number.EPSILON) / (u.peakCoord - u.startCoord + Number.EPSILON) : f = (u.endCoord - i[l] + Number.EPSILON) / (u.endCoord - u.peakCoord + Number.EPSILON), o *= f;
      }
      r[a] = o;
    }
    return r;
  }
  /**
   * Helper method that returns the font's avar table if present
   * @returns {Object|undefined}
   */
  avar() {
    return this.font.tables.avar;
  }
  /**
   * Helper method that returns the font's cvar table if present
   * @returns {Object|undefined}
   */
  cvar() {
    return this.font.tables.cvar;
  }
  /**
   * Helper method that returns the font's fvar table if present
   * @returns {Object|undefined}
   */
  fvar() {
    return this.font.tables.fvar;
  }
  /**
   * Helper method that returns the font's gvar table if present
   * @returns {Object|undefined}
   */
  gvar() {
    return this.font.tables.gvar;
  }
  /**
   * Helper method that returns the font's hvar table if present
   * @returns {Object|undefined}
   */
  hvar() {
    return this.font.tables.hvar;
  }
}, Hd = class {
  constructor(n) {
    this.font = n, this.process = new Nd(this.font), this.activateDefaultVariation(), this.getTransform = this.process.getTransform.bind(this.process);
  }
  /**
   * Tries to determine the default instance and sets its variation data as the font.defaultRenderOptions.
   * If not defaultInstance can be determined, the default coordinates of all axes are used.
   */
  activateDefaultVariation() {
    const n = this.getDefaultInstanceIndex();
    n > -1 ? this.set(n) : this.set(this.getDefaultCoordinates());
  }
  /**
   * Retrieves the default coordinates for the font's variation axes.
   * @returns {Object} An object mapping axis tags to their default values.
   */
  getDefaultCoordinates() {
    return this.fvar().axes.reduce((n, t) => (n[t.tag] = t.defaultValue, n), {});
  }
  /**
   * Gets the index of the default variation instance or -1 if not able to determine
   * @returns {integer} default index or -1
   */
  getDefaultInstanceIndex() {
    const n = this.getDefaultCoordinates();
    let t = this.getInstanceIndex(n);
    return t < 0 && (t = this.fvar().instances.findIndex((e) => e.name && e.name.en === "Regular")), t;
  }
  /**
   * Retrieves the index of the variation instance matching the coordinates object or -1 if not able to determine
   * @param {integer|Object} coordinates An object where keys are axis tags and values are the corresponding variation values.
   * @returns {integer} The index of the matching instance or -1 if no match is found.
   */
  getInstanceIndex(n) {
    return this.fvar().instances.findIndex(
      (t) => Object.keys(n).every(
        (e) => t.coordinates[e] === n[e]
      )
    );
  }
  /**
   * Retrieves a variation instance by its zero-based index
   * @param {integer} index - zero-based index of the variation instance
   * @returns {Object} - variation instance or null if the index is invalid.
   */
  getInstance(n) {
    return this.fvar().instances && this.fvar().instances[n];
  }
  /**
   * Set the variation coordinates to use by default for rendering in the font.defaultRenderOptions
   * @param {integer|Object} instanceIdOrObject Either the zero-based index of a variation instance or an object with axis tags as keys and variation values as values
   */
  set(n) {
    let t;
    if (Number.isInteger(n)) {
      const e = this.getInstance(n);
      if (!e)
        throw Error(`Invalid instance index ${n}`);
      t = { ...e.coordinates };
    } else
      t = n, this.process.normalizeCoordTags(t);
    t = Object.assign(
      {},
      this.font.defaultRenderOptions.variation,
      t
    ), this.font.defaultRenderOptions = Object.assign(
      {},
      this.font.defaultRenderOptions,
      { variation: t }
    );
  }
  /**
   * Returns the variation coordinates currently set in the font.defaultRenderOptions
   * @returns {Object}
   */
  get() {
    return Object.assign({}, this.font.defaultRenderOptions.variation);
  }
  /**
   * Helper method that returns the font's avar table if present
   * @returns {Object|undefined}
   */
  avar() {
    return this.font.tables.avar;
  }
  /**
   * Helper method that returns the font's cvar table if present
   * @returns {Object|undefined}
   */
  cvar() {
    return this.font.tables.cvar;
  }
  /**
   * Helper method that returns the font's fvar table if present
   * @returns {Object|undefined}
   */
  fvar() {
    return this.font.tables.fvar;
  }
  /**
   * Helper method that returns the font's gvar table if present
   * @returns {Object|undefined}
   */
  gvar() {
    return this.font.tables.gvar;
  }
  /**
   * Helper method that returns the font's hvar table if present
   * @returns {Object|undefined}
   */
  hvar() {
    return this.font.tables.hvar;
  }
}, Wo = 1e6, Fi = 64, Ei = 1e4, rl, fn, al, sa;
function ol(n) {
  this.font = n, this.getCommands = function(t) {
    return il.getPath(t).commands;
  }, this._fpgmState = this._prepState = void 0, this._errorState = 0;
}
function Gd(n) {
  return n;
}
function cl(n) {
  return Math.sign(n) * Math.round(Math.abs(n));
}
function Vd(n) {
  return Math.sign(n) * Math.round(Math.abs(n * 2)) / 2;
}
function Wd(n) {
  return Math.sign(n) * (Math.round(Math.abs(n) + 0.5) - 0.5);
}
function qd(n) {
  return Math.sign(n) * Math.ceil(Math.abs(n));
}
function jd(n) {
  return Math.sign(n) * Math.floor(Math.abs(n));
}
var hl = function(n) {
  const t = this.srPeriod;
  let e = this.srPhase;
  const s = this.srThreshold;
  let i = 1;
  return n < 0 && (n = -n, i = -1), n += s - e, n = Math.trunc(n / t) * t, n += e, n < 0 ? e * i : n * i;
}, ye = {
  x: 1,
  y: 0,
  axis: "x",
  // Gets the projected distance between two points.
  // o1/o2 ... if true, respective original position is used.
  distance: function(n, t, e, s) {
    return (e ? n.xo : n.x) - (s ? t.xo : t.x);
  },
  // Moves point p so the moved position has the same relative
  // position to the moved positions of rp1 and rp2 than the
  // original positions had.
  //
  // See APPENDIX on INTERPOLATE at the bottom of this file.
  interpolate: function(n, t, e, s) {
    let i, r, a, o, c, h, l;
    if (!s || s === this) {
      if (i = n.xo - t.xo, r = n.xo - e.xo, c = t.x - t.xo, h = e.x - e.xo, a = Math.abs(i), o = Math.abs(r), l = a + o, l === 0) {
        n.x = n.xo + (c + h) / 2;
        return;
      }
      n.x = n.xo + (c * o + h * a) / l;
      return;
    }
    if (i = s.distance(n, t, !0, !0), r = s.distance(n, e, !0, !0), c = s.distance(t, t, !1, !0), h = s.distance(e, e, !1, !0), a = Math.abs(i), o = Math.abs(r), l = a + o, l === 0) {
      ye.setRelative(n, n, (c + h) / 2, s, !0);
      return;
    }
    ye.setRelative(n, n, (c * o + h * a) / l, s, !0);
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
  setRelative: function(n, t, e, s, i) {
    if (!s || s === this) {
      n.x = (i ? t.xo : t.x) + e;
      return;
    }
    const r = i ? t.xo : t.x, a = i ? t.yo : t.y, o = r + e * s.x, c = a + e * s.y;
    n.x = o + (n.y - c) / s.normalSlope;
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
}, _e = {
  x: 0,
  y: 1,
  axis: "y",
  // Gets the projected distance between two points.
  // o1/o2 ... if true, respective original position is used.
  distance: function(n, t, e, s) {
    return (e ? n.yo : n.y) - (s ? t.yo : t.y);
  },
  // Moves point p so the moved position has the same relative
  // position to the moved positions of rp1 and rp2 than the
  // original positions had.
  //
  // See APPENDIX on INTERPOLATE at the bottom of this file.
  interpolate: function(n, t, e, s) {
    let i, r, a, o, c, h, l;
    if (!s || s === this) {
      if (i = n.yo - t.yo, r = n.yo - e.yo, c = t.y - t.yo, h = e.y - e.yo, a = Math.abs(i), o = Math.abs(r), l = a + o, l === 0) {
        n.y = n.yo + (c + h) / 2;
        return;
      }
      n.y = n.yo + (c * o + h * a) / l;
      return;
    }
    if (i = s.distance(n, t, !0, !0), r = s.distance(n, e, !0, !0), c = s.distance(t, t, !1, !0), h = s.distance(e, e, !1, !0), a = Math.abs(i), o = Math.abs(r), l = a + o, l === 0) {
      _e.setRelative(n, n, (c + h) / 2, s, !0);
      return;
    }
    _e.setRelative(n, n, (c * o + h * a) / l, s, !0);
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
  setRelative: function(n, t, e, s, i) {
    if (!s || s === this) {
      n.y = (i ? t.yo : t.y) + e;
      return;
    }
    const r = i ? t.xo : t.x, a = i ? t.yo : t.y, o = r + e * s.x, c = a + e * s.y;
    n.y = c + s.normalSlope * (n.x - o);
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
Object.freeze(ye);
Object.freeze(_e);
function ws(n, t) {
  this.x = n, this.y = t, this.axis = void 0, this.slope = t / n, this.normalSlope = -n / t, Object.freeze(this);
}
ws.prototype.distance = function(n, t, e, s) {
  return this.x * ye.distance(n, t, e, s) + this.y * _e.distance(n, t, e, s);
};
ws.prototype.interpolate = function(n, t, e, s) {
  let i, r, a, o, c, h, l;
  if (a = s.distance(n, t, !0, !0), o = s.distance(n, e, !0, !0), i = s.distance(t, t, !1, !0), r = s.distance(e, e, !1, !0), c = Math.abs(a), h = Math.abs(o), l = c + h, l === 0) {
    this.setRelative(n, n, (i + r) / 2, s, !0);
    return;
  }
  this.setRelative(n, n, (i * h + r * c) / l, s, !0);
};
ws.prototype.setRelative = function(n, t, e, s, i) {
  s = s || this;
  const r = i ? t.xo : t.x, a = i ? t.yo : t.y, o = r + e * s.x, c = a + e * s.y, h = s.normalSlope, l = this.slope, u = n.x, f = n.y;
  n.x = (l * u - h * o + c - f) / (l - h), n.y = l * (n.x - u) + f;
};
ws.prototype.touch = function(n) {
  n.xTouched = !0, n.yTouched = !0;
};
function Cs(n, t) {
  const e = Math.sqrt(n * n + t * t);
  return n /= e, t /= e, n === 1 && t === 0 ? ye : n === 0 && t === 1 ? _e : new ws(n, t);
}
function Ie(n, t, e, s) {
  this.x = this.xo = Math.round(n * 64) / 64, this.y = this.yo = Math.round(t * 64) / 64, this.lastPointOfContour = e, this.onCurve = s, this.prevPointOnContour = void 0, this.nextPointOnContour = void 0, this.xTouched = !1, this.yTouched = !1, Object.preventExtensions(this);
}
Ie.prototype.nextTouched = function(n) {
  let t = this.nextPointOnContour;
  for (; !n.touched(t) && t !== this; ) t = t.nextPointOnContour;
  return t;
};
Ie.prototype.prevTouched = function(n) {
  let t = this.prevPointOnContour;
  for (; !n.touched(t) && t !== this; ) t = t.prevPointOnContour;
  return t;
};
var ds = Object.freeze(new Ie(0, 0)), $d = {
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
function We(n, t) {
  switch (this.env = n, this.stack = [], this.prog = t, n) {
    case "glyf":
      this.zp0 = this.zp1 = this.zp2 = 1, this.rp0 = this.rp1 = this.rp2 = 0;
    case "prep":
      this.fv = this.pv = this.dpv = ye, this.round = cl;
  }
}
ol.prototype.exec = function(n, t) {
  if (typeof t != "number")
    throw new Error("Point size is not a number!");
  if (this._errorState > 2) return;
  const e = this.font;
  let s = this._prepState;
  if (!s || s.ppem !== t) {
    let i = this._fpgmState;
    if (!i) {
      We.prototype = $d, i = this._fpgmState = new We("fpgm", e.tables.fpgm), i.funcs = [], i.font = e, i.instructionCount = 0, i.callDepth = 0;
      try {
        fn(i);
      } catch (a) {
        console.log("Hinting error in FPGM:" + a), this._errorState = 3;
        return;
      }
    }
    We.prototype = i, s = this._prepState = new We("prep", e.tables.prep), s.ppem = t, s.instructionCount = 0, s.callDepth = 0;
    const r = e.variation && e.variation.process.getCvarTransform() || e.tables.cvt;
    if (r) {
      const a = s.cvt = new Array(r.length), o = t / e.unitsPerEm;
      for (let c = 0; c < r.length; c++)
        a[c] = r[c] * o;
    } else
      s.cvt = [];
    try {
      fn(s);
    } catch (a) {
      this._errorState < 2 && console.log("Hinting error in PREP:" + a), this._errorState = 2;
    }
  }
  if (!(this._errorState > 1))
    try {
      return al(n, s);
    } catch (i) {
      this._errorState < 1 && (console.log("Hinting error:" + i), console.log("Note: further hinting errors are silenced")), this._errorState = 1;
      return;
    }
};
al = function(n, t) {
  const e = t.ppem / t.font.unitsPerEm, s = e;
  let i = n.components, r, a, o;
  if (We.prototype = t, !i)
    o = new We("glyf", n.instructions), o.instructionCount = 0, o.callDepth = 0, sa(n, o, e, s), a = o.gZone;
  else {
    const c = t.font;
    a = [], r = [];
    for (let h = 0; h < i.length; h++) {
      const l = i[h], u = c.glyphs.get(l.glyphIndex);
      o = new We("glyf", u.instructions), o.instructionCount = 0, o.callDepth = 0, sa(u, o, e, s);
      const f = Math.round(l.dx * e), p = Math.round(l.dy * s), d = o.gZone, g = o.contours;
      for (let b = 0; b < d.length; b++) {
        const v = d[b];
        v.xTouched = v.yTouched = !1, v.xo = v.x = v.x + f, v.yo = v.y = v.y + p;
      }
      const x = a.length;
      a.push.apply(a, d);
      for (let b = 0; b < g.length; b++)
        r.push(g[b] + x);
    }
    n.instructions && !o.inhibitGridFit && (o = new We("glyf", n.instructions), o.gZone = o.z0 = o.z1 = o.z2 = a, o.contours = r, a.push(
      new Ie(0, 0),
      new Ie(Math.round(n.advanceWidth * e), 0)
    ), fn(o), a.length -= 2);
  }
  return a;
};
sa = function(n, t, e, s) {
  const i = n.points || [], r = i.length, a = t.gZone = t.z0 = t.z1 = t.z2 = [], o = t.contours = [];
  let c;
  for (let u = 0; u < r; u++)
    c = i[u], a[u] = new Ie(
      c.x * e,
      c.y * s,
      c.lastPointOfContour,
      c.onCurve
    );
  let h, l;
  for (let u = 0; u < r; u++)
    c = a[u], h || (h = c, o.push(u)), c.lastPointOfContour ? (c.nextPointOnContour = h, h.prevPointOnContour = c, h = void 0) : (l = a[u + 1], c.nextPointOnContour = l, l.prevPointOnContour = c);
  t.inhibitGridFit || (a.push(
    new Ie(0, 0),
    new Ie(Math.round(n.advanceWidth * e), 0)
  ), fn(t), a.length -= 2);
};
fn = function(n) {
  let t = n.prog;
  if (!t) return;
  const e = t.length;
  let s;
  for (n.ip = 0; n.ip < e; n.ip++) {
    if (++n.instructionCount > Wo)
      throw new Error(
        "Hinting instructions exceeded maximum of " + Wo
      );
    if (s = rl[t[n.ip]], !s)
      throw new Error(
        "unknown instruction: 0x" + Number(t[n.ip]).toString(16)
      );
    s(n);
  }
};
function Di(n) {
  const t = n.tZone = new Array(n.gZone.length);
  for (let e = 0; e < t.length; e++)
    t[e] = new Ie(0, 0);
}
function ll(n, t) {
  const e = n.prog;
  let s = n.ip, i = 1, r;
  do
    if (r = e[++s], r === 88)
      i++;
    else if (r === 89)
      i--;
    else if (r === 64)
      s += e[s + 1] + 1;
    else if (r === 65)
      s += 2 * e[s + 1] + 1;
    else if (r >= 176 && r <= 183)
      s += r - 176 + 1;
    else if (r >= 184 && r <= 191)
      s += (r - 184 + 1) * 2;
    else if (t && i === 1 && r === 27)
      break;
  while (i > 0);
  n.ip = s;
}
function qo(n, t) {
  t.fv = t.pv = t.dpv = n;
}
function jo(n, t) {
  t.pv = t.dpv = n;
}
function $o(n, t) {
  t.fv = n;
}
function Xo(n, t) {
  const e = t.stack, s = e.pop(), i = e.pop(), r = t.z2[s], a = t.z1[i];
  let o, c;
  n ? (o = r.y - a.y, c = a.x - r.x) : (o = a.x - r.x, c = a.y - r.y), t.pv = t.dpv = Cs(o, c);
}
function Yo(n, t) {
  const e = t.stack, s = e.pop(), i = e.pop(), r = t.z2[s], a = t.z1[i];
  let o, c;
  n ? (o = r.y - a.y, c = a.x - r.x) : (o = a.x - r.x, c = a.y - r.y), t.fv = Cs(o, c);
}
function Xd(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  n.pv = n.dpv = Cs(s, e);
}
function Yd(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  n.fv = Cs(s, e);
}
function Zd(n) {
  const t = n.stack, e = n.pv;
  t.push(e.x * 16384), t.push(e.y * 16384);
}
function Jd(n) {
  const t = n.stack, e = n.fv;
  t.push(e.x * 16384), t.push(e.y * 16384);
}
function Kd(n) {
  n.fv = n.pv;
}
function Qd(n) {
  const t = n.stack, e = t.pop(), s = t.pop(), i = t.pop(), r = t.pop(), a = t.pop(), o = n.z0, c = n.z1, h = o[e], l = o[s], u = c[i], f = c[r], p = n.z2[a], d = h.x, g = h.y, x = l.x, b = l.y, v = u.x, S = u.y, w = f.x, k = f.y, M = (d - x) * (S - k) - (g - b) * (v - w), O = d * b - g * x, I = v * k - S * w;
  p.x = (O * (v - w) - I * (d - x)) / M, p.y = (O * (S - k) - I * (g - b)) / M;
}
function t0(n) {
  n.rp0 = n.stack.pop();
}
function e0(n) {
  n.rp1 = n.stack.pop();
}
function n0(n) {
  n.rp2 = n.stack.pop();
}
function s0(n) {
  const t = n.stack.pop();
  switch (n.zp0 = t, t) {
    case 0:
      n.tZone || Di(n), n.z0 = n.tZone;
      break;
    case 1:
      n.z0 = n.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function i0(n) {
  const t = n.stack.pop();
  switch (n.zp1 = t, t) {
    case 0:
      n.tZone || Di(n), n.z1 = n.tZone;
      break;
    case 1:
      n.z1 = n.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function r0(n) {
  const t = n.stack.pop();
  switch (n.zp2 = t, t) {
    case 0:
      n.tZone || Di(n), n.z2 = n.tZone;
      break;
    case 1:
      n.z2 = n.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function a0(n) {
  const t = n.stack.pop();
  switch (n.zp0 = n.zp1 = n.zp2 = t, t) {
    case 0:
      n.tZone || Di(n), n.z0 = n.z1 = n.z2 = n.tZone;
      break;
    case 1:
      n.z0 = n.z1 = n.z2 = n.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function o0(n) {
  n.loop = n.stack.pop(), n.loop > Ei && (n.loop = Ei);
}
function c0(n) {
  n.round = cl;
}
function h0(n) {
  n.round = Wd;
}
function l0(n) {
  const t = n.stack.pop();
  n.minDis = t / 64;
}
function u0(n) {
  ll(n, !1);
}
function f0(n) {
  const t = n.stack.pop();
  n.ip += t - 1;
}
function p0(n) {
  const t = n.stack.pop();
  n.cvCutIn = t / 64;
}
function d0(n) {
  const t = n.stack;
  t.push(t[t.length - 1]);
}
function vr(n) {
  n.stack.pop();
}
function g0(n) {
  n.stack.length = 0;
}
function m0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(e), t.push(s);
}
function y0(n) {
  const t = n.stack;
  t.push(t.length);
}
function x0(n) {
  const t = n.stack, e = t.pop();
  let s = t.pop();
  if (s > Ei && (s = Ei), ++n.callDepth > Fi)
    throw new Error("Hinting call depth exceeded maximum of " + Fi);
  const i = n.ip, r = n.prog;
  n.prog = n.funcs[e];
  for (let a = 0; a < s; a++)
    fn(n);
  n.ip = i, n.prog = r, n.callDepth--;
}
function b0(n) {
  const t = n.stack.pop();
  if (++n.callDepth > Fi)
    throw new Error("Hinting call depth exceeded maximum of " + Fi);
  const e = n.ip, s = n.prog;
  n.prog = n.funcs[t], fn(n), n.ip = e, n.prog = s, n.callDepth--;
}
function v0(n) {
  const t = n.stack, e = t.pop();
  t.push(t[t.length - e]);
}
function S0(n) {
  const t = n.stack, e = t.pop();
  t.push(t.splice(t.length - e, 1)[0]);
}
function w0(n) {
  if (n.env !== "fpgm") throw new Error("FDEF not allowed here");
  const t = n.stack, e = n.prog;
  let s = n.ip;
  const i = t.pop(), r = s;
  for (; e[++s] !== 45; ) ;
  n.ip = s, n.funcs[i] = e.slice(r + 1, s);
}
function Zo(n, t) {
  const e = t.stack.pop(), s = t.z0[e], i = t.fv, r = t.pv;
  let a = r.distance(s, ds);
  n && (a = t.round(a)), i.setRelative(s, ds, a, r), i.touch(s), t.rp0 = t.rp1 = e;
}
function Jo(n, t) {
  const e = t.z2, s = e.length - 2;
  let i, r, a;
  for (let o = 0; o < s; o++)
    i = e[o], !n.touched(i) && (r = i.prevTouched(n), r !== i && (a = i.nextTouched(n), r === a && n.setRelative(i, i, n.distance(r, r, !1, !0), n, !0), n.interpolate(i, r, a, n)));
}
function Ko(n, t) {
  const e = t.stack, s = n ? t.rp1 : t.rp2, i = (n ? t.z0 : t.z1)[s], r = t.fv, a = t.pv;
  let o = t.loop;
  const c = t.z2;
  for (; o--; ) {
    const h = e.pop(), l = c[h], u = a.distance(i, i, !1, !0);
    r.setRelative(l, l, u, a), r.touch(l);
  }
  t.loop = 1;
}
function Qo(n, t) {
  const e = t.stack, s = n ? t.rp1 : t.rp2, i = (n ? t.z0 : t.z1)[s], r = t.fv, a = t.pv, o = e.pop(), c = t.z2[t.contours[o]];
  let h = c;
  const l = a.distance(i, i, !1, !0);
  do
    h !== i && r.setRelative(h, h, l, a), h = h.nextPointOnContour;
  while (h !== c);
}
function tc(n, t) {
  const e = t.stack, s = n ? t.rp1 : t.rp2, i = (n ? t.z0 : t.z1)[s], r = t.fv, a = t.pv, o = e.pop();
  let c;
  switch (o) {
    case 0:
      c = t.tZone;
      break;
    case 1:
      c = t.gZone;
      break;
    default:
      throw new Error("Invalid zone");
  }
  let h;
  const l = a.distance(i, i, !1, !0), u = c.length - 2;
  for (let f = 0; f < u; f++)
    h = c[f], r.setRelative(h, h, l, a);
}
function C0(n) {
  const t = n.stack;
  let e = n.loop;
  const s = n.fv, i = t.pop() / 64, r = n.z2;
  for (; e--; ) {
    const a = t.pop(), o = r[a];
    s.setRelative(o, o, i), s.touch(o);
  }
  n.loop = 1;
}
function T0(n) {
  const t = n.stack, e = n.rp1, s = n.rp2;
  let i = n.loop;
  const r = n.z0[e], a = n.z1[s], o = n.fv, c = n.dpv, h = n.z2;
  for (; i--; ) {
    const l = t.pop(), u = h[l];
    o.interpolate(u, r, a, c), o.touch(u);
  }
  n.loop = 1;
}
function ec(n, t) {
  const e = t.stack, s = e.pop() / 64, i = e.pop(), r = t.z1[i], a = t.z0[t.rp0], o = t.fv, c = t.pv;
  o.setRelative(r, a, s, c), o.touch(r), t.rp1 = t.rp0, t.rp2 = i, n && (t.rp0 = i);
}
function k0(n) {
  const t = n.stack, e = n.rp0, s = n.z0[e];
  let i = n.loop;
  const r = n.fv, a = n.pv, o = n.z1;
  for (; i--; ) {
    const c = t.pop(), h = o[c];
    r.setRelative(h, s, 0, a), r.touch(h);
  }
  n.loop = 1;
}
function A0(n) {
  n.round = Vd;
}
function nc(n, t) {
  const e = t.stack, s = e.pop(), i = e.pop(), r = t.z0[i], a = t.fv, o = t.pv;
  let c = t.cvt[s], h = o.distance(r, ds);
  n && (Math.abs(h - c) < t.cvCutIn && (h = c), h = t.round(h)), a.setRelative(r, ds, h, o), t.zp0 === 0 && (r.xo = r.x, r.yo = r.y), a.touch(r), t.rp0 = t.rp1 = i;
}
function F0(n) {
  const t = n.prog;
  let e = n.ip;
  const s = n.stack, i = t[++e];
  for (let r = 0; r < i; r++) s.push(t[++e]);
  n.ip = e;
}
function E0(n) {
  let t = n.ip;
  const e = n.prog, s = n.stack, i = e[++t];
  for (let r = 0; r < i; r++) {
    let a = e[++t] << 8 | e[++t];
    a & 32768 && (a = -((a ^ 65535) + 1)), s.push(a);
  }
  n.ip = t;
}
function M0(n) {
  const t = n.stack;
  let e = n.store;
  e || (e = n.store = []);
  const s = t.pop(), i = t.pop();
  e[i] = s;
}
function O0(n) {
  const t = n.stack, e = n.store, s = t.pop(), i = e && e[s] || 0;
  t.push(i);
}
function _0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  n.cvt[s] = e / 64;
}
function L0(n) {
  const t = n.stack, e = t.pop();
  t.push(n.cvt[e] * 64);
}
function sc(n, t) {
  const e = t.stack, s = e.pop(), i = t.z2[s];
  e.push(t.dpv.distance(i, ds, n, !1) * 64);
}
function ic(n, t) {
  const e = t.stack, s = e.pop(), i = e.pop(), r = t.z1[s], a = t.z0[i], o = t.dpv.distance(a, r, n, n);
  t.stack.push(Math.round(o * 64));
}
function I0(n) {
  n.stack.push(n.ppem);
}
function R0(n) {
  n.autoFlip = !0;
}
function B0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s < e ? 1 : 0);
}
function D0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s <= e ? 1 : 0);
}
function U0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s > e ? 1 : 0);
}
function P0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s >= e ? 1 : 0);
}
function z0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(e === s ? 1 : 0);
}
function N0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(e !== s ? 1 : 0);
}
function H0(n) {
  const t = n.stack, e = t.pop();
  t.push(Math.trunc(e) & 1 ? 1 : 0);
}
function G0(n) {
  const t = n.stack, e = t.pop();
  t.push(Math.trunc(e) & 1 ? 0 : 1);
}
function V0(n) {
  n.stack.pop() || ll(n, !0);
}
function W0(n) {
}
function q0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(e && s ? 1 : 0);
}
function j0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(e || s ? 1 : 0);
}
function $0(n) {
  const t = n.stack, e = t.pop();
  t.push(e ? 0 : 1);
}
function Sr(n, t) {
  const e = t.stack, s = e.pop(), i = t.fv, r = t.pv, a = t.ppem, o = t.deltaBase + (n - 1) * 16, c = t.deltaShift, h = t.z0;
  for (let l = 0; l < s; l++) {
    const u = e.pop(), f = e.pop();
    if (o + ((f & 240) >> 4) !== a) continue;
    let d = (f & 15) - 8;
    d >= 0 && d++;
    const g = h[u];
    i.setRelative(g, g, d * c, r);
  }
}
function X0(n) {
  const e = n.stack.pop();
  n.deltaBase = e;
}
function Y0(n) {
  const e = n.stack.pop();
  n.deltaShift = Math.pow(0.5, e);
}
function Z0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s + e);
}
function J0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s - e);
}
function K0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s * 64 / e);
}
function Q0(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(s * e / 64);
}
function t1(n) {
  const t = n.stack, e = t.pop();
  t.push(Math.abs(e));
}
function e1(n) {
  const t = n.stack;
  let e = t.pop();
  t.push(-e);
}
function n1(n) {
  const t = n.stack, e = t.pop();
  t.push(Math.floor(e / 64) * 64);
}
function s1(n) {
  const t = n.stack, e = t.pop();
  t.push(Math.ceil(e / 64) * 64);
}
function Qs(n, t) {
  const e = t.stack, s = e.pop();
  e.push(t.round(s / 64) * 64);
}
function i1(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  n.cvt[s] = e * n.ppem / n.font.unitsPerEm;
}
function wr(n, t) {
  const e = t.stack, s = e.pop(), i = t.ppem, r = t.deltaBase + (n - 1) * 16, a = t.deltaShift;
  for (let o = 0; o < s; o++) {
    const c = e.pop(), h = e.pop();
    if (r + ((h & 240) >> 4) !== i) continue;
    let u = (h & 15) - 8;
    u >= 0 && u++;
    const f = u * a;
    t.cvt[c] += f;
  }
}
function r1(n) {
  let t = n.stack.pop();
  n.round = hl;
  let e;
  switch (t & 192) {
    case 0:
      e = 0.5;
      break;
    case 64:
      e = 1;
      break;
    case 128:
      e = 2;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  switch (n.srPeriod = e, t & 48) {
    case 0:
      n.srPhase = 0;
      break;
    case 16:
      n.srPhase = 0.25 * e;
      break;
    case 32:
      n.srPhase = 0.5 * e;
      break;
    case 48:
      n.srPhase = 0.75 * e;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  t &= 15, t === 0 ? n.srThreshold = 0 : n.srThreshold = (t / 8 - 0.5) * e;
}
function a1(n) {
  let t = n.stack.pop();
  n.round = hl;
  let e;
  switch (t & 192) {
    case 0:
      e = Math.sqrt(2) / 2;
      break;
    case 64:
      e = Math.sqrt(2);
      break;
    case 128:
      e = 2 * Math.sqrt(2);
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  switch (n.srPeriod = e, t & 48) {
    case 0:
      n.srPhase = 0;
      break;
    case 16:
      n.srPhase = 0.25 * e;
      break;
    case 32:
      n.srPhase = 0.5 * e;
      break;
    case 48:
      n.srPhase = 0.75 * e;
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  t &= 15, t === 0 ? n.srThreshold = 0 : n.srThreshold = (t / 8 - 0.5) * e;
}
function o1(n) {
  n.round = Gd;
}
function c1(n) {
  n.round = qd;
}
function h1(n) {
  n.round = jd;
}
function l1(n) {
  n.stack.pop();
}
function rc(n, t) {
  const e = t.stack, s = e.pop(), i = e.pop(), r = t.z2[s], a = t.z1[i];
  let o, c;
  n ? (o = r.y - a.y, c = a.x - r.x) : (o = a.x - r.x, c = a.y - r.y), t.dpv = Cs(o, c);
}
function u1(n) {
  const t = n.stack, e = t.pop();
  let s = 0;
  e & 1 && (s = 35), e & 32 && (s |= 4096), t.push(s);
}
function f1(n) {
  const t = n.stack, e = t.pop(), s = t.pop(), i = t.pop();
  t.push(s), t.push(e), t.push(i);
}
function p1(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(Math.max(s, e));
}
function d1(n) {
  const t = n.stack, e = t.pop(), s = t.pop();
  t.push(Math.min(s, e));
}
function g1(n) {
  n.stack.pop();
}
function m1(n) {
  const t = n.stack.pop();
  let e = n.stack.pop();
  switch (t) {
    case 1:
      n.inhibitGridFit = !!e;
      return;
    case 2:
      n.ignoreCvt = !!e;
      return;
    default:
      throw new Error("invalid INSTCTRL[] selector");
  }
}
function ze(n, t) {
  const e = t.stack, s = t.prog;
  let i = t.ip;
  for (let r = 0; r < n; r++) e.push(s[++i]);
  t.ip = i;
}
function Ne(n, t) {
  let e = t.ip;
  const s = t.prog, i = t.stack;
  for (let r = 0; r < n; r++) {
    let a = s[++e] << 8 | s[++e];
    a & 32768 && (a = -((a ^ 65535) + 1)), i.push(a);
  }
  t.ip = e;
}
function H(n, t, e, s, i, r) {
  const a = r.stack, o = n && a.pop(), c = a.pop(), h = r.rp0, l = r.z0[h], u = r.z1[c], f = r.minDis, p = r.fv, d = r.dpv;
  let g, x, b;
  g = d.distance(u, l, !0, !0), x = g >= 0 ? 1 : -1, g = Math.abs(g), n && (b = r.cvt[o], s && Math.abs(g - b) < r.cvCutIn && (g = b)), e && g < f && (g = f), s && (g = r.round(g)), p.setRelative(u, l, x * g, d), p.touch(u), r.rp1 = r.rp0, r.rp2 = c, t && (r.rp0 = c);
}
rl = [
  /* 0x00 */
  qo.bind(void 0, _e),
  /* 0x01 */
  qo.bind(void 0, ye),
  /* 0x02 */
  jo.bind(void 0, _e),
  /* 0x03 */
  jo.bind(void 0, ye),
  /* 0x04 */
  $o.bind(void 0, _e),
  /* 0x05 */
  $o.bind(void 0, ye),
  /* 0x06 */
  Xo.bind(void 0, 0),
  /* 0x07 */
  Xo.bind(void 0, 1),
  /* 0x08 */
  Yo.bind(void 0, 0),
  /* 0x09 */
  Yo.bind(void 0, 1),
  /* 0x0A */
  Xd,
  /* 0x0B */
  Yd,
  /* 0x0C */
  Zd,
  /* 0x0D */
  Jd,
  /* 0x0E */
  Kd,
  /* 0x0F */
  Qd,
  /* 0x10 */
  t0,
  /* 0x11 */
  e0,
  /* 0x12 */
  n0,
  /* 0x13 */
  s0,
  /* 0x14 */
  i0,
  /* 0x15 */
  r0,
  /* 0x16 */
  a0,
  /* 0x17 */
  o0,
  /* 0x18 */
  c0,
  /* 0x19 */
  h0,
  /* 0x1A */
  l0,
  /* 0x1B */
  u0,
  /* 0x1C */
  f0,
  /* 0x1D */
  p0,
  /* 0x1E */
  void 0,
  // TODO SSWCI
  /* 0x1F */
  void 0,
  // TODO SSW
  /* 0x20 */
  d0,
  /* 0x21 */
  vr,
  /* 0x22 */
  g0,
  /* 0x23 */
  m0,
  /* 0x24 */
  y0,
  /* 0x25 */
  v0,
  /* 0x26 */
  S0,
  /* 0x27 */
  void 0,
  // TODO ALIGNPTS
  /* 0x28 */
  void 0,
  /* 0x29 */
  void 0,
  // TODO UTP
  /* 0x2A */
  x0,
  /* 0x2B */
  b0,
  /* 0x2C */
  w0,
  /* 0x2D */
  void 0,
  // ENDF (eaten by FDEF)
  /* 0x2E */
  Zo.bind(void 0, 0),
  /* 0x2F */
  Zo.bind(void 0, 1),
  /* 0x30 */
  Jo.bind(void 0, _e),
  /* 0x31 */
  Jo.bind(void 0, ye),
  /* 0x32 */
  Ko.bind(void 0, 0),
  /* 0x33 */
  Ko.bind(void 0, 1),
  /* 0x34 */
  Qo.bind(void 0, 0),
  /* 0x35 */
  Qo.bind(void 0, 1),
  /* 0x36 */
  tc.bind(void 0, 0),
  /* 0x37 */
  tc.bind(void 0, 1),
  /* 0x38 */
  C0,
  /* 0x39 */
  T0,
  /* 0x3A */
  ec.bind(void 0, 0),
  /* 0x3B */
  ec.bind(void 0, 1),
  /* 0x3C */
  k0,
  /* 0x3D */
  A0,
  /* 0x3E */
  nc.bind(void 0, 0),
  /* 0x3F */
  nc.bind(void 0, 1),
  /* 0x40 */
  F0,
  /* 0x41 */
  E0,
  /* 0x42 */
  M0,
  /* 0x43 */
  O0,
  /* 0x44 */
  _0,
  /* 0x45 */
  L0,
  /* 0x46 */
  sc.bind(void 0, 0),
  /* 0x47 */
  sc.bind(void 0, 1),
  /* 0x48 */
  void 0,
  // TODO SCFS
  /* 0x49 */
  ic.bind(void 0, 0),
  /* 0x4A */
  ic.bind(void 0, 1),
  /* 0x4B */
  I0,
  /* 0x4C */
  void 0,
  // TODO MPS
  /* 0x4D */
  R0,
  /* 0x4E */
  void 0,
  // TODO FLIPOFF
  /* 0x4F */
  void 0,
  // TODO DEBUG
  /* 0x50 */
  B0,
  /* 0x51 */
  D0,
  /* 0x52 */
  U0,
  /* 0x53 */
  P0,
  /* 0x54 */
  z0,
  /* 0x55 */
  N0,
  /* 0x56 */
  H0,
  /* 0x57 */
  G0,
  /* 0x58 */
  V0,
  /* 0x59 */
  W0,
  /* 0x5A */
  q0,
  /* 0x5B */
  j0,
  /* 0x5C */
  $0,
  /* 0x5D */
  Sr.bind(void 0, 1),
  /* 0x5E */
  X0,
  /* 0x5F */
  Y0,
  /* 0x60 */
  Z0,
  /* 0x61 */
  J0,
  /* 0x62 */
  K0,
  /* 0x63 */
  Q0,
  /* 0x64 */
  t1,
  /* 0x65 */
  e1,
  /* 0x66 */
  n1,
  /* 0x67 */
  s1,
  /* 0x68 */
  Qs.bind(void 0, 0),
  /* 0x69 */
  Qs.bind(void 0, 1),
  /* 0x6A */
  Qs.bind(void 0, 2),
  /* 0x6B */
  Qs.bind(void 0, 3),
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
  i1,
  /* 0x71 */
  Sr.bind(void 0, 2),
  /* 0x72 */
  Sr.bind(void 0, 3),
  /* 0x73 */
  wr.bind(void 0, 1),
  /* 0x74 */
  wr.bind(void 0, 2),
  /* 0x75 */
  wr.bind(void 0, 3),
  /* 0x76 */
  r1,
  /* 0x77 */
  a1,
  /* 0x78 */
  void 0,
  // TODO JROT[]
  /* 0x79 */
  void 0,
  // TODO JROF[]
  /* 0x7A */
  o1,
  /* 0x7B */
  void 0,
  /* 0x7C */
  c1,
  /* 0x7D */
  h1,
  /* 0x7E */
  vr,
  // actually SANGW, supposed to do only a pop though
  /* 0x7F */
  vr,
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
  l1,
  /* 0x86 */
  rc.bind(void 0, 0),
  /* 0x87 */
  rc.bind(void 0, 1),
  /* 0x88 */
  u1,
  /* 0x89 */
  void 0,
  // TODO IDEF
  /* 0x8A */
  f1,
  /* 0x8B */
  p1,
  /* 0x8C */
  d1,
  /* 0x8D */
  g1,
  /* 0x8E */
  m1,
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
  ze.bind(void 0, 1),
  /* 0xB1 */
  ze.bind(void 0, 2),
  /* 0xB2 */
  ze.bind(void 0, 3),
  /* 0xB3 */
  ze.bind(void 0, 4),
  /* 0xB4 */
  ze.bind(void 0, 5),
  /* 0xB5 */
  ze.bind(void 0, 6),
  /* 0xB6 */
  ze.bind(void 0, 7),
  /* 0xB7 */
  ze.bind(void 0, 8),
  /* 0xB8 */
  Ne.bind(void 0, 1),
  /* 0xB9 */
  Ne.bind(void 0, 2),
  /* 0xBA */
  Ne.bind(void 0, 3),
  /* 0xBB */
  Ne.bind(void 0, 4),
  /* 0xBC */
  Ne.bind(void 0, 5),
  /* 0xBD */
  Ne.bind(void 0, 6),
  /* 0xBE */
  Ne.bind(void 0, 7),
  /* 0xBF */
  Ne.bind(void 0, 8),
  /* 0xC0 */
  H.bind(void 0, 0, 0, 0, 0, 0),
  /* 0xC1 */
  H.bind(void 0, 0, 0, 0, 0, 1),
  /* 0xC2 */
  H.bind(void 0, 0, 0, 0, 0, 2),
  /* 0xC3 */
  H.bind(void 0, 0, 0, 0, 0, 3),
  /* 0xC4 */
  H.bind(void 0, 0, 0, 0, 1, 0),
  /* 0xC5 */
  H.bind(void 0, 0, 0, 0, 1, 1),
  /* 0xC6 */
  H.bind(void 0, 0, 0, 0, 1, 2),
  /* 0xC7 */
  H.bind(void 0, 0, 0, 0, 1, 3),
  /* 0xC8 */
  H.bind(void 0, 0, 0, 1, 0, 0),
  /* 0xC9 */
  H.bind(void 0, 0, 0, 1, 0, 1),
  /* 0xCA */
  H.bind(void 0, 0, 0, 1, 0, 2),
  /* 0xCB */
  H.bind(void 0, 0, 0, 1, 0, 3),
  /* 0xCC */
  H.bind(void 0, 0, 0, 1, 1, 0),
  /* 0xCD */
  H.bind(void 0, 0, 0, 1, 1, 1),
  /* 0xCE */
  H.bind(void 0, 0, 0, 1, 1, 2),
  /* 0xCF */
  H.bind(void 0, 0, 0, 1, 1, 3),
  /* 0xD0 */
  H.bind(void 0, 0, 1, 0, 0, 0),
  /* 0xD1 */
  H.bind(void 0, 0, 1, 0, 0, 1),
  /* 0xD2 */
  H.bind(void 0, 0, 1, 0, 0, 2),
  /* 0xD3 */
  H.bind(void 0, 0, 1, 0, 0, 3),
  /* 0xD4 */
  H.bind(void 0, 0, 1, 0, 1, 0),
  /* 0xD5 */
  H.bind(void 0, 0, 1, 0, 1, 1),
  /* 0xD6 */
  H.bind(void 0, 0, 1, 0, 1, 2),
  /* 0xD7 */
  H.bind(void 0, 0, 1, 0, 1, 3),
  /* 0xD8 */
  H.bind(void 0, 0, 1, 1, 0, 0),
  /* 0xD9 */
  H.bind(void 0, 0, 1, 1, 0, 1),
  /* 0xDA */
  H.bind(void 0, 0, 1, 1, 0, 2),
  /* 0xDB */
  H.bind(void 0, 0, 1, 1, 0, 3),
  /* 0xDC */
  H.bind(void 0, 0, 1, 1, 1, 0),
  /* 0xDD */
  H.bind(void 0, 0, 1, 1, 1, 1),
  /* 0xDE */
  H.bind(void 0, 0, 1, 1, 1, 2),
  /* 0xDF */
  H.bind(void 0, 0, 1, 1, 1, 3),
  /* 0xE0 */
  H.bind(void 0, 1, 0, 0, 0, 0),
  /* 0xE1 */
  H.bind(void 0, 1, 0, 0, 0, 1),
  /* 0xE2 */
  H.bind(void 0, 1, 0, 0, 0, 2),
  /* 0xE3 */
  H.bind(void 0, 1, 0, 0, 0, 3),
  /* 0xE4 */
  H.bind(void 0, 1, 0, 0, 1, 0),
  /* 0xE5 */
  H.bind(void 0, 1, 0, 0, 1, 1),
  /* 0xE6 */
  H.bind(void 0, 1, 0, 0, 1, 2),
  /* 0xE7 */
  H.bind(void 0, 1, 0, 0, 1, 3),
  /* 0xE8 */
  H.bind(void 0, 1, 0, 1, 0, 0),
  /* 0xE9 */
  H.bind(void 0, 1, 0, 1, 0, 1),
  /* 0xEA */
  H.bind(void 0, 1, 0, 1, 0, 2),
  /* 0xEB */
  H.bind(void 0, 1, 0, 1, 0, 3),
  /* 0xEC */
  H.bind(void 0, 1, 0, 1, 1, 0),
  /* 0xED */
  H.bind(void 0, 1, 0, 1, 1, 1),
  /* 0xEE */
  H.bind(void 0, 1, 0, 1, 1, 2),
  /* 0xEF */
  H.bind(void 0, 1, 0, 1, 1, 3),
  /* 0xF0 */
  H.bind(void 0, 1, 1, 0, 0, 0),
  /* 0xF1 */
  H.bind(void 0, 1, 1, 0, 0, 1),
  /* 0xF2 */
  H.bind(void 0, 1, 1, 0, 0, 2),
  /* 0xF3 */
  H.bind(void 0, 1, 1, 0, 0, 3),
  /* 0xF4 */
  H.bind(void 0, 1, 1, 0, 1, 0),
  /* 0xF5 */
  H.bind(void 0, 1, 1, 0, 1, 1),
  /* 0xF6 */
  H.bind(void 0, 1, 1, 0, 1, 2),
  /* 0xF7 */
  H.bind(void 0, 1, 1, 0, 1, 3),
  /* 0xF8 */
  H.bind(void 0, 1, 1, 1, 0, 0),
  /* 0xF9 */
  H.bind(void 0, 1, 1, 1, 0, 1),
  /* 0xFA */
  H.bind(void 0, 1, 1, 1, 0, 2),
  /* 0xFB */
  H.bind(void 0, 1, 1, 1, 0, 3),
  /* 0xFC */
  H.bind(void 0, 1, 1, 1, 1, 0),
  /* 0xFD */
  H.bind(void 0, 1, 1, 1, 1, 1),
  /* 0xFE */
  H.bind(void 0, 1, 1, 1, 1, 2),
  /* 0xFF */
  H.bind(void 0, 1, 1, 1, 1, 3)
];
var y1 = ol;
function qn(n) {
  this.char = n, this.state = {}, this.activeState = null;
}
function va(n, t, e) {
  this.contextName = e, this.startIndex = n, this.endOffset = t;
}
function x1(n, t, e) {
  this.contextName = n, this.openRange = null, this.ranges = [], this.checkStart = t, this.checkEnd = e;
}
function Bt(n, t) {
  this.context = n, this.index = t, this.length = n.length, this.current = n[t], this.backtrack = n.slice(0, t), this.lookahead = n.slice(t + 1);
}
function Ui(n) {
  this.eventId = n, this.subscribers = [];
}
function b1(n) {
  const t = [
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
  for (let s = 0; s < t.length; s++) {
    const i = t[s];
    Object.defineProperty(this.events, i, {
      value: new Ui(i)
    });
  }
  if (n)
    for (let s = 0; s < t.length; s++) {
      const i = t[s], r = n[i];
      typeof r == "function" && this.events[i].subscribe(r);
    }
  const e = [
    "insertToken",
    "removeToken",
    "removeRange",
    "replaceToken",
    "replaceRange",
    "composeRUD"
  ];
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    this.events[i].subscribe(
      this.updateContextsRanges
    );
  }
}
function pt(n) {
  this.tokens = [], this.registeredContexts = {}, this.contextCheckers = [], this.events = {}, this.registeredModifiers = [], b1.call(this, n);
}
qn.prototype.setState = function(n, t) {
  return this.state[n] = t, this.activeState = { key: n, value: this.state[n] }, this.activeState;
};
qn.prototype.getState = function(n) {
  return this.state[n] || null;
};
pt.prototype.inboundIndex = function(n) {
  return n >= 0 && n < this.tokens.length;
};
pt.prototype.composeRUD = function(n) {
  const e = n.map((i) => this[i[0]].apply(this, i.slice(1).concat(!0))), s = (i) => typeof i == "object" && Object.prototype.hasOwnProperty.call(i, "FAIL");
  if (e.every(s))
    return {
      FAIL: "composeRUD: one or more operations hasn't completed successfully",
      report: e.filter(s)
    };
  this.dispatch("composeRUD", [e.filter((i) => !s(i))]);
};
pt.prototype.replaceRange = function(n, t, e, s) {
  t = t !== null ? t : this.tokens.length;
  const i = e.every((r) => r instanceof qn);
  if (!isNaN(n) && this.inboundIndex(n) && i) {
    const r = this.tokens.splice.apply(
      this.tokens,
      [n, t].concat(e)
    );
    return s || this.dispatch("replaceToken", [n, t, e]), [r, e];
  } else
    return { FAIL: "replaceRange: invalid tokens or startIndex." };
};
pt.prototype.replaceToken = function(n, t, e) {
  if (!isNaN(n) && this.inboundIndex(n) && t instanceof qn) {
    const s = this.tokens.splice(n, 1, t);
    return e || this.dispatch("replaceToken", [n, t]), [s[0], t];
  } else
    return { FAIL: "replaceToken: invalid token or index." };
};
pt.prototype.removeRange = function(n, t, e) {
  t = isNaN(t) ? this.tokens.length : t;
  const s = this.tokens.splice(n, t);
  return e || this.dispatch("removeRange", [s, n, t]), s;
};
pt.prototype.removeToken = function(n, t) {
  if (!isNaN(n) && this.inboundIndex(n)) {
    const e = this.tokens.splice(n, 1);
    return t || this.dispatch("removeToken", [e, n]), e;
  } else
    return { FAIL: "removeToken: invalid token index." };
};
pt.prototype.insertToken = function(n, t, e) {
  return n.every(
    (i) => i instanceof qn
  ) ? (this.tokens.splice.apply(
    this.tokens,
    [t, 0].concat(n)
  ), e || this.dispatch("insertToken", [n, t]), n) : { FAIL: "insertToken: invalid token(s)." };
};
pt.prototype.registerModifier = function(n, t, e) {
  this.events.newToken.subscribe(function(s, i) {
    const r = [s, i], a = t === null || t.apply(this, r) === !0, o = [s, i];
    if (a) {
      let c = e.apply(this, o);
      s.setState(n, c);
    }
  }), this.registeredModifiers.push(n);
};
Ui.prototype.subscribe = function(n) {
  return typeof n == "function" ? this.subscribers.push(n) - 1 : { FAIL: `invalid '${this.eventId}' event handler` };
};
Ui.prototype.unsubscribe = function(n) {
  this.subscribers.splice(n, 1);
};
Bt.prototype.setCurrentIndex = function(n) {
  this.index = n, this.current = this.context[n], this.backtrack = this.context.slice(0, n), this.lookahead = this.context.slice(n + 1);
};
Bt.prototype.get = function(n) {
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
pt.prototype.rangeToText = function(n) {
  if (n instanceof va)
    return this.getRangeTokens(n).map((t) => t.char).join("");
};
pt.prototype.getText = function() {
  return this.tokens.map((n) => n.char).join("");
};
pt.prototype.getContext = function(n) {
  let t = this.registeredContexts[n];
  return t || null;
};
pt.prototype.on = function(n, t) {
  const e = this.events[n];
  return e ? e.subscribe(t) : null;
};
pt.prototype.dispatch = function(n, t) {
  const e = this.events[n];
  if (e instanceof Ui)
    for (let s = 0; s < e.subscribers.length; s++)
      e.subscribers[s].apply(this, t || []);
};
pt.prototype.registerContextChecker = function(n, t, e) {
  if (this.getContext(n)) return {
    FAIL: `context name '${n}' is already registered.`
  };
  if (typeof t != "function") return {
    FAIL: "missing context start check."
  };
  if (typeof e != "function") return {
    FAIL: "missing context end check."
  };
  const s = new x1(
    n,
    t,
    e
  );
  return this.registeredContexts[n] = s, this.contextCheckers.push(s), s;
};
pt.prototype.getRangeTokens = function(n) {
  const t = n.startIndex + n.endOffset;
  return [].concat(
    this.tokens.slice(n.startIndex, t)
  );
};
pt.prototype.getContextRanges = function(n) {
  const t = this.getContext(n);
  return t ? t.ranges : { FAIL: `context checker '${n}' is not registered.` };
};
pt.prototype.resetContextsRanges = function() {
  const n = this.registeredContexts;
  for (const t in n)
    if (Object.prototype.hasOwnProperty.call(n, t)) {
      const e = n[t];
      e.ranges = [];
    }
};
pt.prototype.updateContextsRanges = function() {
  this.resetContextsRanges();
  const n = this.tokens.map((t) => t.char);
  for (let t = 0; t < n.length; t++) {
    const e = new Bt(n, t);
    this.runContextCheck(e);
  }
  this.dispatch("updateContextsRanges", [this.registeredContexts]);
};
pt.prototype.setEndOffset = function(n, t) {
  const e = this.getContext(t).openRange.startIndex;
  let s = new va(e, n, t);
  const i = this.getContext(t).ranges;
  return s.rangeId = `${t}.${i.length}`, i.push(s), this.getContext(t).openRange = null, s;
};
pt.prototype.runContextCheck = function(n) {
  const t = n.index;
  for (let e = 0; e < this.contextCheckers.length; e++) {
    const s = this.contextCheckers[e];
    let i = s.contextName, r = this.getContext(i).openRange;
    if (!r && s.checkStart(n) && (r = new va(t, null, i), this.getContext(i).openRange = r, this.dispatch("contextStart", [i, t])), r && s.checkEnd(n)) {
      const a = t - r.startIndex + 1, o = this.setEndOffset(a, i);
      this.dispatch("contextEnd", [i, o]);
    }
  }
};
pt.prototype.tokenize = function(n) {
  this.tokens = [], this.resetContextsRanges();
  let t = Array.from(n);
  this.dispatch("start");
  for (let e = 0; e < t.length; e++) {
    const s = t[e], i = new Bt(t, e);
    this.dispatch("next", [i]), this.runContextCheck(i);
    let r = new qn(s);
    this.tokens.push(r), this.dispatch("newToken", [r, i]);
  }
  return this.dispatch("end", [this.tokens]), this.tokens;
};
var v1 = pt;
function Xe(n) {
  return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(n);
}
function ul(n) {
  return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(n);
}
function Ye(n) {
  return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(n);
}
function ai(n) {
  return /[\u0E00-\u0E7F]/.test(n);
}
function oi(n) {
  return /[A-z]/.test(n);
}
function S1(n) {
  return /\s/.test(n);
}
function Xt(n) {
  this.font = n, this.features = {};
}
function Ge(n) {
  this.id = n.id, this.tag = n.tag, this.substitution = n.substitution;
}
function Ze(n, t) {
  if (!n) return -1;
  switch (t.format) {
    case 1:
      return t.glyphs.indexOf(n);
    case 2: {
      let e = t.ranges;
      for (let s = 0; s < e.length; s++) {
        const i = e[s];
        if (n >= i.start && n <= i.end) {
          let r = n - i.start;
          return i.index + r;
        }
      }
      break;
    }
    default:
      return -1;
  }
  return -1;
}
function w1(n, t) {
  return Ze(n, t.coverage) === -1 ? null : n + t.deltaGlyphId;
}
function C1(n, t) {
  let e = Ze(n, t.coverage);
  return e === -1 ? null : t.substitute[e];
}
function Cr(n, t) {
  let e = [];
  for (let s = 0; s < n.length; s++) {
    const i = n[s];
    let r = t.current;
    r = Array.isArray(r) ? r[0] : r;
    const a = Ze(r, i);
    a !== -1 && e.push(a);
  }
  return e.length !== n.length ? -1 : e;
}
function T1(n, t) {
  const e = t.inputCoverage.length + t.lookaheadCoverage.length + t.backtrackCoverage.length;
  if (n.context.length < e) return [];
  let s = Cr(
    t.inputCoverage,
    n
  );
  if (s === -1) return [];
  const i = t.inputCoverage.length - 1;
  if (n.lookahead.length < t.lookaheadCoverage.length) return [];
  let r = n.lookahead.slice(i);
  for (; r.length && Ye(r[0].char); )
    r.shift();
  const a = new Bt(r, 0);
  let o = Cr(
    t.lookaheadCoverage,
    a
  ), c = [].concat(n.backtrack);
  for (c.reverse(); c.length && Ye(c[0].char); )
    c.shift();
  if (c.length < t.backtrackCoverage.length) return [];
  const h = new Bt(c, 0);
  let l = Cr(
    t.backtrackCoverage,
    h
  );
  const u = s.length === t.inputCoverage.length && o.length === t.lookaheadCoverage.length && l.length === t.backtrackCoverage.length;
  let f = [];
  if (u)
    for (let p = 0; p < t.lookupRecords.length; p++) {
      const d = t.lookupRecords[p], g = d.lookupListIndex, x = this.getLookupByIndex(g);
      for (let b = 0; b < x.subtables.length; b++) {
        let v = x.subtables[b], S, w = this.getSubstitutionType(x, v);
        if (w === "71" ? (w = this.getSubstitutionType(v, v.extension), S = this.getLookupMethod(v, v.extension), v = v.extension) : S = this.getLookupMethod(x, v), w === "12") {
          const k = n.get(d.sequenceIndex), M = S(k);
          M && f.push(M);
        } else if (w === "21") {
          const k = n.get(d.sequenceIndex), M = S(k);
          M && f.push(M);
        } else
          throw new Error(`Substitution type ${w} is not supported in chaining substitution`);
      }
    }
  return f;
}
function k1(n, t) {
  let e = n.current, s = Ze(e, t.coverage);
  if (s === -1) return null;
  let i, r = t.ligatureSets[s];
  for (let a = 0; a < r.length; a++) {
    i = r[a];
    for (let o = 0; o < i.components.length; o++) {
      const c = n.lookahead[o], h = i.components[o];
      if (c !== h) break;
      if (o === i.components.length - 1) return i;
    }
  }
  return null;
}
function A1(n, t) {
  let e = n.current;
  if (Ze(e, t.coverage) === -1)
    return null;
  for (const i of t.ruleSets)
    for (const r of i) {
      let a = !0;
      for (let o = 0; o < r.input.length; o++)
        if (n.lookahead[o] !== r.input[o]) {
          a = !1;
          break;
        }
      if (a) {
        let o = [];
        o.push(e);
        for (let h = 0; h < r.input.length; h++)
          o.push(r.input[h]);
        const c = (h, l) => {
          const { lookupListIndex: u, sequenceIndex: f } = l, { subtables: p } = this.getLookupByIndex(u);
          for (const d of p)
            Ze(h[f], d.coverage) !== -1 && (h[f] = d.deltaGlyphId);
        };
        for (let h = 0; h < r.lookupRecords.length; h++) {
          const l = r.lookupRecords[h];
          c(o, l);
        }
        return o;
      }
    }
  return null;
}
function F1(n, t) {
  if (n.context.length < t.coverages.length)
    return [];
  for (let s = 0; s < t.coverages.length; s++) {
    let i = n.get(s);
    if (i = Array.isArray(i) ? i[0] : i, Ze(i, t.coverages[s]) === -1)
      return [];
  }
  let e = [];
  for (let s = 0; s < t.lookupRecords.length; s++) {
    const i = t.lookupRecords[s], r = i.lookupListIndex, a = this.getLookupByIndex(r);
    for (let o = 0; o < a.subtables.length; o++) {
      let c = a.subtables[o], h, l = this.getSubstitutionType(a, c);
      if (l === "71" ? (l = this.getSubstitutionType(c, c.extension), h = this.getLookupMethod(c, c.extension), c = c.extension) : h = this.getLookupMethod(a, c), l === "12") {
        const u = n.get(i.sequenceIndex), f = h(u);
        f && e.push(f);
      } else if (l === "21") {
        const u = n.get(i.sequenceIndex), f = h(u);
        f && e.push(f);
      }
    }
  }
  return e;
}
function E1(n, t) {
  let e = Ze(n, t.coverage);
  return e === -1 ? null : t.sequences[e];
}
Xt.prototype.getDefaultScriptFeaturesIndexes = function() {
  const n = this.font.tables.gsub.scripts;
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    if (e.tag === "DFLT") return e.script.defaultLangSys.featureIndexes;
  }
  return [];
};
Xt.prototype.getScriptFeaturesIndexes = function(n) {
  if (!this.font.tables.gsub) return [];
  if (!n) return this.getDefaultScriptFeaturesIndexes();
  const e = this.font.tables.gsub.scripts;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    if (i.tag === n && i.script.defaultLangSys)
      return i.script.defaultLangSys.featureIndexes;
    {
      let r = i.langSysRecords;
      if (r)
        for (let a = 0; a < r.length; a++) {
          const o = r[a];
          if (o.tag === n)
            return o.langSys.featureIndexes;
        }
    }
  }
  return this.getDefaultScriptFeaturesIndexes();
};
Xt.prototype.mapTagsToFeatures = function(n, t) {
  let e = {};
  for (let s = 0; s < n.length; s++) {
    const i = n[s].tag, r = n[s].feature;
    e[i] = r;
  }
  this.features[t].tags = e;
};
Xt.prototype.getScriptFeatures = function(n) {
  let t = this.features[n];
  if (Object.prototype.hasOwnProperty.call(this.features, n)) return t;
  const e = this.getScriptFeaturesIndexes(n);
  if (!e) return null;
  const s = this.font.tables.gsub;
  return t = e.map((i) => s.features[i]), this.features[n] = t, this.mapTagsToFeatures(t, n), t;
};
Xt.prototype.getSubstitutionType = function(n, t) {
  const e = n.lookupType.toString(), s = t.substFormat.toString();
  return e + s;
};
Xt.prototype.getLookupMethod = function(n, t) {
  let e = this.getSubstitutionType(n, t);
  switch (e) {
    case "11":
      return (s) => w1.apply(
        this,
        [s, t]
      );
    case "12":
      return (s) => C1.apply(
        this,
        [s, t]
      );
    case "63":
      return (s) => T1.apply(
        this,
        [s, t]
      );
    case "41":
      return (s) => k1.apply(
        this,
        [s, t]
      );
    case "21":
      return (s) => E1.apply(
        this,
        [s, t]
      );
    case "51":
      return (s) => A1.apply(
        this,
        [s, t]
      );
    case "53":
      return (s) => F1.apply(
        this,
        [s, t]
      );
    default:
      throw new Error(
        `substitutionType : ${e} lookupType: ${n.lookupType} - substFormat: ${t.substFormat} is not yet supported`
      );
  }
};
Xt.prototype.lookupFeature = function(n) {
  let t = n.contextParams, e = t.index;
  const s = this.getFeature({
    tag: n.tag,
    script: n.script
  });
  if (!s) return new Error(
    `font '${(this.font.names.unicode || this.font.names.windows || this.font.names.macintosh).fullName.en}' doesn't support feature '${n.tag}' for script '${n.script}'.`
  );
  const i = this.getFeatureLookups(s), r = [].concat(t.context);
  for (let a = 0; a < i.length; a++) {
    const o = i[a], c = this.getLookupSubtables(o);
    for (let h = 0; h < c.length; h++) {
      let l = c[h], u = this.getSubstitutionType(o, l), f;
      u === "71" ? (u = this.getSubstitutionType(l, l.extension), f = this.getLookupMethod(l, l.extension), l = l.extension) : f = this.getLookupMethod(o, l);
      let p;
      switch (u) {
        case "11":
          p = f(t.current), p && r.splice(e, 1, new Ge({
            id: 11,
            tag: n.tag,
            substitution: p
          }));
          break;
        case "12":
          p = f(t.current), p && r.splice(e, 1, new Ge({
            id: 12,
            tag: n.tag,
            substitution: p
          }));
          break;
        case "63":
          p = f(t), Array.isArray(p) && p.length && r.splice(e, 1, new Ge({
            id: 63,
            tag: n.tag,
            substitution: p
          }));
          break;
        case "41":
          p = f(t), p && r.splice(e, 1, new Ge({
            id: 41,
            tag: n.tag,
            substitution: p
          }));
          break;
        case "21":
          p = f(t.current), p && r.splice(e, 1, new Ge({
            id: 21,
            tag: n.tag,
            substitution: p
          }));
          break;
        case "51":
        case "53":
          p = f(t), Array.isArray(p) && p.length && r.splice(e, 1, new Ge({
            id: parseInt(u),
            tag: n.tag,
            substitution: p
          }));
          break;
      }
      t = new Bt(r, e), !(Array.isArray(p) && !p.length) && (p = null);
    }
  }
  return r.length ? r : null;
};
Xt.prototype.supports = function(n) {
  if (!n.script) return !1;
  this.getScriptFeatures(n.script);
  const t = Object.prototype.hasOwnProperty.call(this.features, n.script);
  if (!n.tag) return t;
  const e = this.features[n.script].some((s) => s.tag === n.tag);
  return t && e;
};
Xt.prototype.getLookupSubtables = function(n) {
  return n.subtables || null;
};
Xt.prototype.getLookupByIndex = function(n) {
  return this.font.tables.gsub.lookups[n] || null;
};
Xt.prototype.getFeatureLookups = function(n) {
  return n.lookupListIndexes.map(this.getLookupByIndex.bind(this));
};
Xt.prototype.getFeature = function(t) {
  if (!this.font) return { FAIL: "No font was found" };
  Object.prototype.hasOwnProperty.call(this.features, t.script) || this.getScriptFeatures(t.script);
  const e = this.features[t.script];
  return e ? e.tags[t.tag] ? this.features[t.script].tags[t.tag] : null : { FAIL: `No feature for script ${t.script}` };
};
var M1 = Xt;
function O1(n) {
  const t = n.current, e = n.get(-1);
  return (
    // ? arabic first char
    e === null && Xe(t) || // ? arabic char preceded with a non arabic char
    !Xe(e) && Xe(t)
  );
}
function _1(n) {
  const t = n.get(1);
  return (
    // ? last arabic char
    t === null || // ? next char is not arabic
    !Xe(t)
  );
}
var L1 = {
  startCheck: O1,
  endCheck: _1
};
function I1(n) {
  const t = n.current, e = n.get(-1);
  return (
    // ? an arabic char preceded with a non arabic char
    (Xe(t) || Ye(t)) && !Xe(e)
  );
}
function R1(n) {
  const t = n.get(1);
  switch (!0) {
    case t === null:
      return !0;
    case (!Xe(t) && !Ye(t)): {
      const e = S1(t);
      if (!e) return !0;
      if (e) {
        let s = !1;
        if (s = n.lookahead.some(
          (i) => Xe(i) || Ye(i)
        ), !s) return !0;
      }
      break;
    }
    default:
      return !1;
  }
}
var B1 = {
  startCheck: I1,
  endCheck: R1
};
function D1(n, t, e) {
  t[e].setState(n.tag, n.substitution);
}
function U1(n, t, e) {
  t[e].setState(n.tag, n.substitution);
}
function Tr(n, t, e) {
  for (let s = 0; s < n.substitution.length; s++) {
    const i = n.substitution[s], r = t[e + s];
    if (Array.isArray(i)) {
      i.length ? r.setState(n.tag, i[0]) : r.setState("deleted", !0);
      continue;
    }
    r.setState(n.tag, i);
  }
}
function P1(n, t, e) {
  let s = t[e];
  s.setState(n.tag, n.substitution.ligGlyph);
  const i = n.substitution.components.length;
  for (let r = 0; r < i; r++)
    s = t[e + r + 1], s.setState("deleted", !0);
}
var ac = {
  11: D1,
  12: U1,
  63: Tr,
  41: P1,
  51: Tr,
  53: Tr
};
function z1(n, t, e) {
  n instanceof Ge && ac[n.id] && ac[n.id](n, t, e);
}
var mn = z1;
function N1(n) {
  let t = [].concat(n.backtrack);
  for (let e = t.length - 1; e >= 0; e--) {
    const s = t[e], i = ul(s), r = Ye(s);
    if (!i && !r) return !0;
    if (i) return !1;
  }
  return !1;
}
function H1(n) {
  if (ul(n.current)) return !1;
  for (let t = 0; t < n.lookahead.length; t++) {
    const e = n.lookahead[t];
    if (!Ye(e)) return !0;
  }
  return !1;
}
function G1(n) {
  const t = "arab", e = this.featuresTags[t], s = this.tokenizer.getRangeTokens(n);
  if (s.length === 1) return;
  let i = new Bt(
    s.map(
      (a) => a.getState("glyphIndex")
    ),
    0
  );
  const r = new Bt(
    s.map(
      (a) => a.char
    ),
    0
  );
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (Ye(o.char)) continue;
    i.setCurrentIndex(a), r.setCurrentIndex(a);
    let c = 0;
    N1(r) && (c |= 1), H1(r) && (c |= 2);
    let h;
    switch (c) {
      case 1:
        h = "fina";
        break;
      case 2:
        h = "init";
        break;
      case 3:
        h = "medi";
        break;
    }
    if (e.indexOf(h) === -1) continue;
    let l = this.query.lookupFeature({
      tag: h,
      script: t,
      contextParams: i
    });
    if (l instanceof Error) {
      console.info(l.message);
      continue;
    }
    for (let u = 0; u < l.length; u++) {
      const f = l[u];
      f instanceof Ge && (mn(f, s, u), i.context[u] = f.substitution);
    }
  }
}
var V1 = G1;
function oc(n, t) {
  const e = n.map((s) => s.activeState.value);
  return new Bt(e, 0);
}
function W1(n) {
  const t = "arab";
  let e = this.tokenizer.getRangeTokens(n), s = oc(e);
  for (let i = 0; i < s.context.length; i++) {
    s.setCurrentIndex(i);
    let r = this.query.lookupFeature({
      tag: "rlig",
      script: t,
      contextParams: s
    });
    if (r.length) {
      for (let a = 0; a < r.length; a++) {
        const o = r[a];
        mn(o, e, i);
      }
      s = oc(e);
    }
  }
}
var q1 = W1;
function j1(n) {
  return n.index === 0 && n.context.length > 1;
}
function $1(n) {
  return n.index === n.context.length - 1;
}
var X1 = {
  startCheck: j1,
  endCheck: $1
};
function cc(n, t) {
  const e = n.map((s) => s.activeState.value);
  return new Bt(e, 0);
}
function Y1(n) {
  const t = "delf", e = "ccmp";
  let s = this.tokenizer.getRangeTokens(n), i = cc(s);
  for (let r = 0; r < i.context.length; r++) {
    if (!this.query.getFeature({ tag: e, script: t, contextParams: i }))
      continue;
    i.setCurrentIndex(r);
    let a = this.query.lookupFeature({
      tag: e,
      script: t,
      contextParams: i
    });
    if (a.length) {
      for (let o = 0; o < a.length; o++) {
        const c = a[o];
        mn(c, s, r);
      }
      i = cc(s);
    }
  }
}
var Z1 = Y1;
function J1(n) {
  const t = n.current, e = n.get(-1);
  return (
    // ? latin first char
    e === null && oi(t) || // ? latin char preceded with a non latin char
    !oi(e) && oi(t)
  );
}
function K1(n) {
  const t = n.get(1);
  return (
    // ? last latin char
    t === null || // ? next char is not latin
    !oi(t)
  );
}
var Q1 = {
  startCheck: J1,
  endCheck: K1
};
function hc(n, t) {
  const e = n.map((s) => s.activeState.value);
  return new Bt(e, 0);
}
function tg(n) {
  const t = "latn";
  let e = this.tokenizer.getRangeTokens(n), s = hc(e);
  for (let i = 0; i < s.context.length; i++) {
    s.setCurrentIndex(i);
    let r = this.query.lookupFeature({
      tag: "liga",
      script: t,
      contextParams: s
    });
    if (r.length) {
      for (let a = 0; a < r.length; a++) {
        const o = r[a];
        mn(o, e, i);
      }
      s = hc(e);
    }
  }
}
var eg = tg;
function ng(n) {
  const t = n.current, e = n.get(-1);
  return (
    // ? thai first char
    e === null && ai(t) || // ? thai char preceded with a non thai char
    !ai(e) && ai(t)
  );
}
function sg(n) {
  const t = n.get(1);
  return (
    // ? last thai char
    t === null || // ? next char is not thai
    !ai(t)
  );
}
var ig = {
  startCheck: ng,
  endCheck: sg
};
function lc(n, t) {
  const e = n.map((s) => s.activeState.value);
  return new Bt(e, t || 0);
}
function rg(n) {
  const t = "thai";
  let e = this.tokenizer.getRangeTokens(n), s = lc(e, 0);
  for (let i = 0; i < s.context.length; i++) {
    s.setCurrentIndex(i);
    let r = this.query.lookupFeature({
      tag: "ccmp",
      script: t,
      contextParams: s
    });
    if (r.length) {
      for (let a = 0; a < r.length; a++) {
        const o = r[a];
        mn(o, e, i);
      }
      s = lc(e, i);
    }
  }
}
var ag = rg;
function uc(n, t) {
  const e = n.map((s) => s.activeState.value);
  return new Bt(e, t || 0);
}
function og(n) {
  const t = "thai";
  let e = this.tokenizer.getRangeTokens(n), s = uc(e, 0);
  for (let i = 0; i < s.context.length; i++) {
    s.setCurrentIndex(i);
    let r = this.query.lookupFeature({
      tag: "liga",
      script: t,
      contextParams: s
    });
    if (r.length) {
      for (let a = 0; a < r.length; a++) {
        const o = r[a];
        mn(o, e, i);
      }
      s = uc(e, i);
    }
  }
}
var cg = og;
function fc(n, t) {
  const e = n.map((s) => s.activeState.value);
  return new Bt(e, t || 0);
}
function hg(n) {
  const t = "thai";
  let e = this.tokenizer.getRangeTokens(n), s = fc(e, 0);
  for (let i = 0; i < s.context.length; i++) {
    s.setCurrentIndex(i);
    let r = this.query.lookupFeature({
      tag: "rlig",
      script: t,
      contextParams: s
    });
    if (r.length) {
      for (let a = 0; a < r.length; a++) {
        const o = r[a];
        mn(o, e, i);
      }
      s = fc(e, i);
    }
  }
}
var lg = hg;
function ia(n) {
  if (n === null) return !1;
  const t = n.codePointAt(0);
  return (
    // Mongolian Variation Selectors
    t >= 6155 && t <= 6157 || // Generic Variation Selectors
    t >= 65024 && t <= 65039 || // Ideographic Variation Sequences
    t >= 917760 && t <= 917999
  );
}
function ug(n) {
  const t = n.current, e = n.get(1);
  return e === null && ia(t) || ia(e);
}
function fg(n) {
  const t = n.get(1);
  return t === null || !ia(t);
}
var pg = {
  startCheck: ug,
  endCheck: fg
};
function dg(n) {
  const t = this.query.font, e = this.tokenizer.getRangeTokens(n);
  if (e[1].setState("deleted", !0), t.tables.cmap && t.tables.cmap.varSelectorList) {
    const s = e[0].char.codePointAt(0), i = e[1].char.codePointAt(0), r = t.tables.cmap.varSelectorList[i];
    if (r !== void 0 && r.nonDefaultUVS) {
      const a = r.nonDefaultUVS.uvsMappings;
      if (a[s]) {
        const o = a[s].glyphID;
        t.glyphs.glyphs[o] !== void 0 && e[0].setState("glyphIndex", o);
      }
    }
  }
}
var gg = dg;
function te(n) {
  this.baseDir = n || "ltr", this.tokenizer = new v1(), this.featuresTags = {};
}
te.prototype.setText = function(n) {
  this.text = n;
};
te.prototype.contextChecks = {
  ccmpReplacementCheck: X1,
  latinWordCheck: Q1,
  arabicWordCheck: L1,
  arabicSentenceCheck: B1,
  thaiWordCheck: ig,
  unicodeVariationSequenceCheck: pg
};
function On(n) {
  const t = this.contextChecks[`${n}Check`];
  return this.tokenizer.registerContextChecker(
    n,
    t.startCheck,
    t.endCheck
  );
}
function mg() {
  return On.call(this, "ccmpReplacement"), On.call(this, "latinWord"), On.call(this, "arabicWord"), On.call(this, "arabicSentence"), On.call(this, "thaiWord"), On.call(this, "unicodeVariationSequence"), this.tokenizer.tokenize(this.text);
}
function yg() {
  const n = this.tokenizer.getContextRanges("arabicSentence");
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    let s = this.tokenizer.getRangeTokens(e);
    this.tokenizer.replaceRange(
      e.startIndex,
      e.endOffset,
      s.reverse()
    );
  }
}
te.prototype.registerFeatures = function(n, t) {
  const e = t.filter(
    (s) => this.query.supports({ script: n, tag: s })
  );
  Object.prototype.hasOwnProperty.call(this.featuresTags, n) ? this.featuresTags[n] = this.featuresTags[n].concat(e) : this.featuresTags[n] = e;
};
te.prototype.applyFeatures = function(n, t) {
  if (!n) throw new Error(
    "No valid font was provided to apply features"
  );
  this.query || (this.query = new M1(n));
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    this.query.supports({ script: s.script }) && this.registerFeatures(s.script, s.tags);
  }
};
te.prototype.registerModifier = function(n, t, e) {
  this.tokenizer.registerModifier(n, t, e);
};
function Ts() {
  if (this.tokenizer.registeredModifiers.indexOf("glyphIndex") === -1)
    throw new Error(
      "glyphIndex modifier is required to apply arabic presentation features."
    );
}
function xg() {
  if (!Object.prototype.hasOwnProperty.call(this.featuresTags, "arab")) return;
  Ts.call(this);
  const t = this.tokenizer.getContextRanges("arabicWord");
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    V1.call(this, s);
  }
}
function bg() {
  Ts.call(this);
  const n = this.tokenizer.getContextRanges("ccmpReplacement");
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    Z1.call(this, e);
  }
}
function vg() {
  if (!this.hasFeatureEnabled("arab", "rlig")) return;
  Ts.call(this);
  const n = this.tokenizer.getContextRanges("arabicWord");
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    q1.call(this, e);
  }
}
function Sg() {
  if (!this.hasFeatureEnabled("latn", "liga")) return;
  Ts.call(this);
  const n = this.tokenizer.getContextRanges("latinWord");
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    eg.call(this, e);
  }
}
function wg() {
  const n = this.tokenizer.getContextRanges("unicodeVariationSequence");
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    gg.call(this, e);
  }
}
function Cg() {
  Ts.call(this);
  const n = this.tokenizer.getContextRanges("thaiWord");
  for (let t = 0; t < n.length; t++) {
    const e = n[t];
    this.hasFeatureEnabled("thai", "liga") && cg.call(this, e), this.hasFeatureEnabled("thai", "rlig") && lg.call(this, e), this.hasFeatureEnabled("thai", "ccmp") && ag.call(this, e);
  }
}
te.prototype.checkContextReady = function(n) {
  return !!this.tokenizer.getContext(n);
};
te.prototype.applyFeaturesToContexts = function() {
  this.checkContextReady("ccmpReplacement") && bg.call(this), this.checkContextReady("arabicWord") && (xg.call(this), vg.call(this)), this.checkContextReady("latinWord") && Sg.call(this), this.checkContextReady("arabicSentence") && yg.call(this), this.checkContextReady("thaiWord") && Cg.call(this), this.checkContextReady("unicodeVariationSequence") && wg.call(this);
};
te.prototype.hasFeatureEnabled = function(n, t) {
  return (this.featuresTags[n] || []).indexOf(t) !== -1;
};
te.prototype.processText = function(n) {
  (!this.text || this.text !== n) && (this.setText(n), mg.call(this), this.applyFeaturesToContexts());
};
te.prototype.getBidiText = function(n) {
  return this.processText(n), this.tokenizer.getText();
};
te.prototype.getTextGlyphs = function(n) {
  this.processText(n);
  let t = [];
  for (let e = 0; e < this.tokenizer.tokens.length; e++) {
    const s = this.tokenizer.tokens[e];
    if (s.state.deleted) continue;
    const i = s.activeState.value;
    t.push(Array.isArray(i) ? i[0] : i);
  }
  return t;
};
var Tg = te;
function kr(n) {
  return {
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
  };
}
function nt(n) {
  if (n = n || {}, n.tables = n.tables || {}, !n.empty) {
    if (!n.familyName) throw new Error("When creating a new Font object, familyName is required.");
    if (!n.styleName) throw new Error("When creating a new Font object, styleName is required.");
    if (!n.unitsPerEm) throw new Error("When creating a new Font object, unitsPerEm is required.");
    if (!n.ascender) throw new Error("When creating a new Font object, ascender is required.");
    if (n.descender > 0) throw new Error("When creating a new Font object, negative descender value is required.");
    this.names = {}, this.names.unicode = kr(n), this.names.macintosh = kr(n), this.names.windows = kr(n), this.unitsPerEm = n.unitsPerEm || 1e3, this.ascender = n.ascender, this.descender = n.descender, this.createdTimestamp = n.createdTimestamp, this.italicAngle = n.italicAngle || 0, this.weightClass = n.weightClass || 0;
    let t = 0;
    n.fsSelection ? t = n.fsSelection : (this.italicAngle < 0 ? t |= this.fsSelectionValues.ITALIC : this.italicAngle > 0 && (t |= this.fsSelectionValues.OBLIQUE), this.weightClass >= 600 && (t |= this.fsSelectionValues.BOLD), t === 0 && (t = this.fsSelectionValues.REGULAR)), (!n.panose || !Array.isArray(n.panose)) && (n.panose = [0, 0, 0, 0, 0, 0, 0, 0, 0]), this.tables = Object.assign(n.tables, {
      os2: Object.assign({
        usWeightClass: n.weightClass || this.usWeightClasses.MEDIUM,
        usWidthClass: n.widthClass || this.usWidthClasses.MEDIUM,
        bFamilyType: n.panose[0] || 0,
        bSerifStyle: n.panose[1] || 0,
        bWeight: n.panose[2] || 0,
        bProportion: n.panose[3] || 0,
        bContrast: n.panose[4] || 0,
        bStrokeVariation: n.panose[5] || 0,
        bArmStyle: n.panose[6] || 0,
        bLetterform: n.panose[7] || 0,
        bMidline: n.panose[8] || 0,
        bXHeight: n.panose[9] || 0,
        fsSelection: t
      }, n.tables.os2)
    });
  }
  this.supported = !0, this.glyphs = new be.GlyphSet(this, n.glyphs || []), this.encoding = new Th(this), this.position = new bd(this), this.substitution = new Ad(this), this.tables = this.tables || {}, this.tables = new Proxy(this.tables, {
    set: (t, e, s) => (t[e] = s, t.fvar && (t.gvar || t.cff2) && !this.variation && (this.variation = new Hd(this)), !0)
  }), this.palettes = new el(this), this.layers = new Fd(this), this.svgImages = new Ed(this), this._push = null, this._hmtxTableData = {}, Object.defineProperty(this, "hinting", {
    get: function() {
      return this._hinting ? this._hinting : this.outlinesFormat === "truetype" ? this._hinting = new y1(this) : null;
    }
  });
}
nt.prototype.hasChar = function(n) {
  return this.encoding.charToGlyphIndex(n) > 0;
};
nt.prototype.charToGlyphIndex = function(n) {
  return this.encoding.charToGlyphIndex(n);
};
nt.prototype.charToGlyph = function(n) {
  const t = this.charToGlyphIndex(n);
  let e = this.glyphs.get(t);
  return e || (e = this.glyphs.get(0)), e;
};
nt.prototype.updateFeatures = function(n) {
  return this.defaultRenderOptions.features.map((t) => t.script === "latn" ? {
    script: "latn",
    tags: t.tags.filter((e) => n[e])
  } : t);
};
nt.prototype.stringToGlyphIndexes = function(n, t) {
  const e = new Tg(), s = (r) => this.charToGlyphIndex(r.char);
  e.registerModifier("glyphIndex", null, s);
  let i = t ? this.updateFeatures(t.features) : this.defaultRenderOptions.features;
  return e.applyFeatures(this, i), e.getTextGlyphs(n);
};
nt.prototype.stringToGlyphs = function(n, t) {
  const e = this.stringToGlyphIndexes(n, t);
  let s = e.length;
  const i = new Array(s), r = this.glyphs.get(0);
  for (let a = 0; a < s; a += 1)
    i[a] = this.glyphs.get(e[a]) || r;
  return i;
};
nt.prototype.nameToGlyphIndex = function(n) {
  return this.glyphNames.nameToGlyphIndex(n);
};
nt.prototype.nameToGlyph = function(n) {
  const t = this.nameToGlyphIndex(n);
  let e = this.glyphs.get(t);
  return e || (e = this.glyphs.get(0)), e;
};
nt.prototype.glyphIndexToName = function(n) {
  return this.glyphNames.glyphIndexToName ? this.glyphNames.glyphIndexToName(n) : "";
};
nt.prototype.getKerningValue = function(n, t) {
  n = n.index || n, t = t.index || t;
  const e = this.position.defaultKerningTables;
  return e ? this.position.getKerningValue(e, n, t) : this.kerningPairs[n + "," + t] || 0;
};
nt.prototype.defaultRenderOptions = {
  kerning: !0,
  features: [
    /**
     * these 4 features are required to render Arabic text properly
     * and shouldn't be turned off when rendering arabic text.
     */
    { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
    { script: "latn", tags: ["liga", "rlig"] },
    { script: "thai", tags: ["liga", "rlig", "ccmp"] }
  ],
  hinting: !1,
  usePalette: 0,
  drawLayers: !0,
  drawSVG: !0
};
nt.prototype.forEachGlyph = function(n, t, e, s, i, r) {
  t = t !== void 0 ? t : 0, e = e !== void 0 ? e : 0, s = s !== void 0 ? s : 72, i = Object.assign({}, this.defaultRenderOptions, i);
  const a = 1 / this.unitsPerEm * s, o = this.stringToGlyphs(n, i);
  let c;
  if (i.kerning) {
    const h = i.script || this.position.getDefaultScriptName();
    c = this.position.getKerningTables(h, i.language);
  }
  for (let h = 0; h < o.length; h += 1) {
    const l = o[h];
    if (r.call(this, l, t, e, s, i), l.advanceWidth && (t += l.advanceWidth * a), i.kerning && h < o.length - 1) {
      const u = c ? this.position.getKerningValue(c, l.index, o[h + 1].index) : this.getKerningValue(l, o[h + 1]);
      t += u * a;
    }
    i.letterSpacing ? t += i.letterSpacing * s : i.tracking && (t += i.tracking / 1e3 * s);
  }
  return t;
};
nt.prototype.getPath = function(n, t, e, s, i) {
  i = Object.assign({}, this.defaultRenderOptions, i);
  const r = new Pn();
  if (r._layers = [], Ih(this, r), r.stroke) {
    const a = 1 / (r.unitsPerEm || 1e3) * s;
    r.strokeWidth *= a;
  }
  return this.forEachGlyph(n, t, e, s, i, (a, o, c, h) => {
    const l = a.getPath(o, c, h, i, this);
    if (i.drawSVG || i.drawLayers) {
      const u = l._layers;
      if (u && u.length) {
        for (let f = 0; f < u.length; f++) {
          const p = u[f];
          r._layers.push(p);
        }
        return;
      }
    }
    r.extend(l);
  }), r;
};
nt.prototype.getPaths = function(n, t, e, s, i) {
  i = Object.assign({}, this.defaultRenderOptions, i);
  const r = [];
  return this.forEachGlyph(n, t, e, s, i, function(a, o, c, h) {
    const l = a.getPath(o, c, h, i, this);
    r.push(l);
  }), r;
};
nt.prototype.getAdvanceWidth = function(n, t, e) {
  return e = Object.assign({}, this.defaultRenderOptions, e), this.forEachGlyph(n, 0, 0, t, e, function() {
  });
};
nt.prototype.draw = function(n, t, e, s, i, r) {
  this.getPath(t, e, s, i, r).draw(n);
};
nt.prototype.drawPoints = function(n, t, e, s, i, r) {
  r = Object.assign({}, this.defaultRenderOptions, r), this.forEachGlyph(t, e, s, i, r, function(a, o, c, h) {
    a.drawPoints(n, o, c, h, r, this);
  });
};
nt.prototype.drawMetrics = function(n, t, e, s, i, r) {
  r = Object.assign({}, this.defaultRenderOptions, r), this.forEachGlyph(t, e, s, i, r, function(a, o, c, h) {
    a.drawMetrics(n, o, c, h);
  });
};
nt.prototype.getEnglishName = function(n) {
  const t = (this.names.unicode || this.names.macintosh || this.names.windows)[n];
  if (t)
    return t.en;
};
nt.prototype.validate = function() {
  const n = [], t = this;
  function e(i, r) {
    i || (console.warn(`[opentype.js] ${r}`), n.push(r));
  }
  function s(i) {
    const r = t.getEnglishName(i);
    e(
      r && r.trim().length > 0,
      "No English " + i + " specified."
    );
  }
  if (s("fontFamily"), s("weightName"), s("manufacturer"), s("copyright"), s("version"), e(this.unitsPerEm > 0, "No unitsPerEm specified."), this.tables.colr) {
    const i = this.tables.colr.baseGlyphRecords;
    let r = -1;
    for (let a = 0; a < i.length; a++) {
      const o = i[a].glyphID;
      if (e(r < i[a].glyphID, `baseGlyphs must be sorted by GlyphID in ascending order, but glyphID ${o} comes after ${r}`), r > i[a].glyphID)
        break;
      r = o;
    }
  }
  return n;
};
nt.prototype.toTables = function() {
  return xd.fontToTable(this);
};
nt.prototype.toBuffer = function() {
  return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."), this.toArrayBuffer();
};
nt.prototype.toArrayBuffer = function() {
  const t = this.toTables().encode(), e = new ArrayBuffer(t.length), s = new Uint8Array(e);
  for (let i = 0; i < t.length; i++)
    s[i] = t[i];
  return e;
};
nt.prototype.download = function() {
  console.error("DEPRECATED: platform-specific actions are to be implemented on user-side");
};
nt.prototype.fsSelectionValues = {
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
nt.prototype.macStyleValues = {
  BOLD: 1,
  //1
  ITALIC: 2,
  //2
  UNDERLINE: 4,
  //4
  OUTLINED: 8,
  //8
  SHADOW: 16,
  //16
  CONDENSED: 32,
  //32
  EXTENDED: 64
  //64
};
nt.prototype.usWidthClasses = {
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
nt.prototype.usWeightClasses = {
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
var kg = nt;
function Ag(n, t) {
  const e = new N.Parser(n, t), s = e.parseUShort(), i = e.parseUShort();
  s !== 1 && console.warn(`Unsupported hvar table version ${s}.${i}`);
  const r = [
    s,
    i
  ], a = e.parsePointer32(function() {
    return this.parseItemVariationStore();
  }), o = e.parsePointer32(function() {
    return this.parseDeltaSetIndexMap();
  }), c = e.parsePointer32(function() {
    return this.parseDeltaSetIndexMap();
  }), h = e.parsePointer32(function() {
    return this.parseDeltaSetIndexMap();
  });
  return {
    version: r,
    itemVariationStore: a,
    advanceWidth: o,
    lsb: c,
    rsb: h
  };
}
function Fg() {
  console.warn("Writing of hvar tables is not yet supported.");
}
var Eg = { make: Fg, parse: Ag }, Mg = function() {
  return {
    coverage: this.parsePointer(A.coverage),
    attachPoints: this.parseList(A.pointer(A.uShortList))
  };
}, Og = function() {
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
}, _g = function() {
  return this.parseList(A.pointer(Og));
}, Lg = function() {
  return {
    coverage: this.parsePointer(A.coverage),
    ligGlyphs: this.parseList(A.pointer(_g))
  };
}, Ig = function() {
  return this.parseUShort(), this.parseList(A.pointer(A.coverage));
};
function Rg(n, t) {
  t = t || 0;
  const e = new A(n, t), s = e.parseVersion(1);
  G.argument(
    s === 1 || s === 1.2 || s === 1.3,
    "Unsupported GDEF table version."
  );
  var i = {
    version: s,
    classDef: e.parsePointer(A.classDef),
    attachList: e.parsePointer(Mg),
    ligCaretList: e.parsePointer(Lg),
    markAttachClassDef: e.parsePointer(A.classDef)
  };
  return s >= 1.2 && (i.markGlyphSets = e.parsePointer(Ig)), i;
}
var Bg = { parse: Rg }, ue = new Array(10);
ue[1] = function() {
  const t = this.offset + this.relativeOffset, e = this.parseUShort();
  if (e === 1)
    return {
      posFormat: 1,
      coverage: this.parsePointer(A.coverage),
      value: this.parseValueRecord()
    };
  if (e === 2)
    return {
      posFormat: 2,
      coverage: this.parsePointer(A.coverage),
      values: this.parseValueRecordList()
    };
  G.assert(!1, "0x" + t.toString(16) + ": GPOS lookup type 1 format must be 1 or 2.");
};
ue[2] = function() {
  const t = this.offset + this.relativeOffset, e = this.parseUShort();
  G.assert(e === 1 || e === 2, "0x" + t.toString(16) + ": GPOS lookup type 2 format must be 1 or 2.");
  const s = this.parsePointer(A.coverage), i = this.parseUShort(), r = this.parseUShort();
  if (e === 1)
    return {
      posFormat: e,
      coverage: s,
      valueFormat1: i,
      valueFormat2: r,
      pairSets: this.parseList(A.pointer(A.list(function() {
        return {
          // pairValueRecord
          secondGlyph: this.parseUShort(),
          value1: this.parseValueRecord(i),
          value2: this.parseValueRecord(r)
        };
      })))
    };
  if (e === 2) {
    const a = this.parsePointer(A.classDef), o = this.parsePointer(A.classDef), c = this.parseUShort(), h = this.parseUShort();
    return {
      // Class Pair Adjustment
      posFormat: e,
      coverage: s,
      valueFormat1: i,
      valueFormat2: r,
      classDef1: a,
      classDef2: o,
      class1Count: c,
      class2Count: h,
      classRecords: this.parseList(c, A.list(h, function() {
        return {
          value1: this.parseValueRecord(i),
          value2: this.parseValueRecord(r)
        };
      }))
    };
  }
};
ue[3] = function() {
  return { error: "GPOS Lookup 3 not supported" };
};
ue[4] = function() {
  return { error: "GPOS Lookup 4 not supported" };
};
ue[5] = function() {
  return { error: "GPOS Lookup 5 not supported" };
};
ue[6] = function() {
  return { error: "GPOS Lookup 6 not supported" };
};
ue[7] = function() {
  return { error: "GPOS Lookup 7 not supported" };
};
ue[8] = function() {
  return { error: "GPOS Lookup 8 not supported" };
};
ue[9] = function() {
  return { error: "GPOS Lookup 9 not supported" };
};
function Dg(n, t) {
  t = t || 0;
  const e = new A(n, t), s = e.parseVersion(1);
  return G.argument(s === 1 || s === 1.1, "Unsupported GPOS table version " + s), s === 1 ? {
    version: s,
    scripts: e.parseScriptList(),
    features: e.parseFeatureList(),
    lookups: e.parseLookupList(ue)
  } : {
    version: s,
    scripts: e.parseScriptList(),
    features: e.parseFeatureList(),
    lookups: e.parseLookupList(ue),
    variations: e.parseFeatureVariationsList()
  };
}
var Ug = new Array(10);
function Pg(n) {
  return new L.Table("GPOS", [
    { name: "version", type: "ULONG", value: 65536 },
    { name: "scripts", type: "TABLE", value: new L.ScriptList(n.scripts) },
    { name: "features", type: "TABLE", value: new L.FeatureList(n.features) },
    { name: "lookups", type: "TABLE", value: new L.LookupList(n.lookups, Ug) }
  ]);
}
var zg = { parse: Dg, make: Pg };
function Ng(n) {
  const t = {};
  n.skip("uShort");
  const e = n.parseUShort();
  G.argument(e === 0, "Unsupported kern sub-table version."), n.skip("uShort", 2);
  const s = n.parseUShort();
  n.skip("uShort", 3);
  for (let i = 0; i < s; i += 1) {
    const r = n.parseUShort(), a = n.parseUShort(), o = n.parseShort();
    t[r + "," + a] = o;
  }
  return t;
}
function Hg(n) {
  const t = {};
  n.skip("uShort"), n.parseULong() > 1 && console.warn("Only the first kern subtable is supported."), n.skip("uLong");
  const i = n.parseUShort() & 255;
  if (n.skip("uShort"), i === 0) {
    const r = n.parseUShort();
    n.skip("uShort", 3);
    for (let a = 0; a < r; a += 1) {
      const o = n.parseUShort(), c = n.parseUShort(), h = n.parseShort();
      t[o + "," + c] = h;
    }
  }
  return t;
}
function Gg(n, t) {
  const e = new N.Parser(n, t), s = e.parseUShort();
  if (s === 0)
    return Ng(e);
  if (s === 1)
    return Hg(e);
  throw new Error("Unsupported kern table version (" + s + ").");
}
var Vg = { parse: Gg };
function Wg(n, t, e, s) {
  const i = new N.Parser(n, t), r = s ? i.parseUShort : i.parseULong, a = [];
  for (let o = 0; o < e + 1; o += 1) {
    let c = r.call(i);
    s && (c *= 2), a.push(c);
  }
  return a;
}
var qg = { parse: Wg };
function pc(n, t) {
  const e = [];
  let s = 12;
  for (let i = 0; i < t; i += 1) {
    const r = N.getTag(n, s), a = N.getULong(n, s + 4), o = N.getULong(n, s + 8), c = N.getULong(n, s + 12);
    e.push({ tag: r, checksum: a, offset: o, length: c, compression: !1 }), s += 16;
  }
  return e;
}
function jg(n, t) {
  const e = [];
  let s = 44;
  for (let i = 0; i < t; i += 1) {
    const r = N.getTag(n, s), a = N.getULong(n, s + 4), o = N.getULong(n, s + 8), c = N.getULong(n, s + 12);
    let h;
    o < c ? h = "WOFF" : h = !1, e.push({
      tag: r,
      offset: a,
      compression: h,
      compressedLength: o,
      length: c
    }), s += 20;
  }
  return e;
}
function et(n, t) {
  if (t.compression === "WOFF") {
    const e = new Uint8Array(n.buffer, t.offset + 2, t.compressedLength - 2), s = new Uint8Array(t.length);
    if (fh(e, s), s.byteLength !== t.length)
      throw new Error("Decompression error: " + t.tag + " decompressed length doesn't match recorded length");
    return { data: new DataView(s.buffer, 0), offset: 0 };
  } else
    return { data: n, offset: t.offset };
}
function $g(n, t = {}) {
  let e, s;
  const i = new kg({ empty: !0 });
  n.constructor !== ArrayBuffer && (n = new Uint8Array(n).buffer);
  const r = new DataView(n, 0);
  let a, o = [];
  const c = N.getTag(r, 0);
  if (c === "\0\0\0" || c === "true" || c === "typ1")
    i.outlinesFormat = "truetype", a = N.getUShort(r, 4), o = pc(r, a);
  else if (c === "OTTO")
    i.outlinesFormat = "cff", a = N.getUShort(r, 4), o = pc(r, a);
  else if (c === "wOFF") {
    const B = N.getTag(r, 4);
    if (B === "\0\0\0")
      i.outlinesFormat = "truetype";
    else if (B === "OTTO")
      i.outlinesFormat = "cff";
    else
      throw new Error("Unsupported OpenType flavor " + c);
    a = N.getUShort(r, 12), o = jg(r, a);
  } else if (c === "wOF2") {
    const B = "https://github.com/opentypejs/opentype.js/issues/183#issuecomment-1147228025";
    throw new Error("WOFF2 require an external decompressor library, see examples at: " + B);
  } else
    throw new Error("Unsupported OpenType signature " + c);
  let h, l, u, f, p, d, g, x, b, v, S, w, k, M, O, I, V, D;
  for (let B = 0; B < a; B += 1) {
    const U = o[B];
    let P;
    switch (U.tag) {
      case "avar":
        g = U;
        break;
      case "cmap":
        P = et(r, U), i.tables.cmap = Ch.parse(P.data, P.offset), i.encoding = new kh(i.tables.cmap);
        break;
      case "cvt ":
        P = et(r, U), D = new N.Parser(P.data, P.offset), i.tables.cvt = D.parseShortList(U.length / 2);
        break;
      case "fvar":
        u = U;
        break;
      case "STAT":
        f = U;
        break;
      case "gvar":
        p = U;
        break;
      case "cvar":
        d = U;
        break;
      case "fpgm":
        P = et(r, U), D = new N.Parser(P.data, P.offset), i.tables.fpgm = D.parseByteList(U.length);
        break;
      case "head":
        P = et(r, U), i.tables.head = Dh.parse(P.data, P.offset), i.unitsPerEm = i.tables.head.unitsPerEm, e = i.tables.head.indexToLocFormat;
        break;
      case "hhea":
        P = et(r, U), i.tables.hhea = Uh.parse(P.data, P.offset), i.ascender = i.tables.hhea.ascender, i.descender = i.tables.hhea.descender, i.numberOfHMetrics = i.tables.hhea.numberOfHMetrics;
        break;
      case "HVAR":
        k = U;
        break;
      case "hmtx":
        w = U;
        break;
      case "ltag":
        P = et(r, U), s = zh.parse(P.data, P.offset);
        break;
      case "COLR":
        P = et(r, U), i.tables.colr = Wh.parse(P.data, P.offset);
        break;
      case "CPAL":
        P = et(r, U), i.tables.cpal = Mh.parse(P.data, P.offset);
        break;
      case "maxp":
        P = et(r, U), i.tables.maxp = Nh.parse(P.data, P.offset), i.numGlyphs = i.tables.maxp.numGlyphs;
        break;
      case "name":
        I = U;
        break;
      case "OS/2":
        P = et(r, U), i.tables.os2 = na.parse(P.data, P.offset);
        break;
      case "post":
        P = et(r, U), i.tables.post = Hh.parse(P.data, P.offset), i.glyphNames = new fa(i.tables.post);
        break;
      case "prep":
        P = et(r, U), D = new N.Parser(P.data, P.offset), i.tables.prep = D.parseByteList(U.length);
        break;
      case "glyf":
        x = U;
        break;
      case "loca":
        O = U;
        break;
      case "CFF ":
        h = U;
        break;
      case "CFF2":
        l = U;
        break;
      case "kern":
        M = U;
        break;
      case "GDEF":
        b = U;
        break;
      case "GPOS":
        v = U;
        break;
      case "GSUB":
        S = U;
        break;
      case "meta":
        V = U;
        break;
      case "gasp":
        try {
          P = et(r, U), i.tables.gasp = Zh.parse(P.data, P.offset);
        } catch (Q) {
          console.warn("Failed to parse gasp table, skipping."), console.warn(Q);
        }
        break;
      case "SVG ":
        P = et(r, U), i.tables.svg = Jh.parse(P.data, P.offset);
        break;
    }
  }
  const W = et(r, I);
  if (i.tables.name = wh.parse(W.data, W.offset, s), i.names = i.tables.name, x && O) {
    const B = e === 0, U = et(r, O), P = qg.parse(U.data, U.offset, i.numGlyphs, B), Q = et(r, x);
    i.glyphs = il.parse(Q.data, Q.offset, P, i, t);
  } else if (h) {
    const B = et(r, h);
    ta.parse(B.data, B.offset, i, t);
  } else if (l) {
    const B = et(r, l);
    ta.parse(B.data, B.offset, i, t);
  } else
    throw new Error("Font doesn't contain TrueType, CFF or CFF2 outlines.");
  const J = et(r, w);
  if (Ph.parse(i, J.data, J.offset, i.numberOfHMetrics, i.numGlyphs, i.glyphs, t), Gf(i, t), M) {
    const B = et(r, M);
    i.kerningPairs = Vg.parse(B.data, B.offset);
  } else
    i.kerningPairs = {};
  if (b) {
    const B = et(r, b);
    i.tables.gdef = Bg.parse(B.data, B.offset);
  }
  if (v) {
    const B = et(r, v);
    i.tables.gpos = zg.parse(B.data, B.offset), i.position.init();
  }
  if (S) {
    const B = et(r, S);
    i.tables.gsub = Gh.parse(B.data, B.offset);
  }
  if (u) {
    const B = et(r, u);
    i.tables.fvar = qh.parse(B.data, B.offset, i.names);
  }
  if (f) {
    const B = et(r, f);
    i.tables.stat = jh.parse(B.data, B.offset, i.tables.fvar);
  }
  if (p) {
    u || console.warn("This font provides a gvar table, but no fvar table, which is required for variable fonts."), x || console.warn("This font provides a gvar table, but no glyf table. Glyph variation only works with TrueType outlines.");
    const B = et(r, p);
    i.tables.gvar = Yh.parse(B.data, B.offset, i.tables.fvar, i.glyphs);
  }
  if (d) {
    u || console.warn("This font provides a cvar table, but no fvar table, which is required for variable fonts."), i.tables.cvt || console.warn("This font provides a cvar table, but no cvt table which could be made variable."), x || console.warn("This font provides a gvar table, but no glyf table. Glyph variation only works with TrueType outlines.");
    const B = et(r, d);
    i.tables.cvar = Xh.parse(B.data, B.offset, i.tables.fvar, i.tables.cvt || []);
  }
  if (g) {
    u || console.warn("This font provides an avar table, but no fvar table, which is required for variable fonts.");
    const B = et(r, g);
    i.tables.avar = $h.parse(B.data, B.offset, i.tables.fvar);
  }
  if (k) {
    u || console.warn("This font provides an HVAR table, but no fvar table, which is required for variable fonts."), w || console.warn("This font provides an HVAR table, but no hmtx table to vary.");
    const B = et(r, k);
    i.tables.hvar = Eg.parse(B.data, B.offset, i.tables.fvar);
  }
  if (V) {
    const B = et(r, V);
    i.tables.meta = Vh.parse(B.data, B.offset), i.metas = i.tables.meta;
  }
  return i.palettes = new el(i), i;
}
function dc(n, t = !1) {
  const e = n[0].index !== null, s = new Set(Object.keys(n[0].attributes)), i = new Set(Object.keys(n[0].morphAttributes)), r = {}, a = {}, o = n[0].morphTargetsRelative, c = new Ht();
  let h = 0;
  for (let l = 0; l < n.length; ++l) {
    const u = n[l];
    let f = 0;
    if (e !== (u.index !== null))
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + l + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."), null;
    for (const p in u.attributes) {
      if (!s.has(p))
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + l + '. All geometries must have compatible attributes; make sure "' + p + '" attribute exists among all geometries, or in none of them.'), null;
      r[p] === void 0 && (r[p] = []), r[p].push(u.attributes[p]), f++;
    }
    if (f !== s.size)
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + l + ". Make sure all geometries have the same number of attributes."), null;
    if (o !== u.morphTargetsRelative)
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + l + ". .morphTargetsRelative must be consistent throughout all geometries."), null;
    for (const p in u.morphAttributes) {
      if (!i.has(p))
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + l + ".  .morphAttributes must be consistent throughout all geometries."), null;
      a[p] === void 0 && (a[p] = []), a[p].push(u.morphAttributes[p]);
    }
    if (t) {
      let p;
      if (e)
        p = u.index.count;
      else if (u.attributes.position !== void 0)
        p = u.attributes.position.count;
      else
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + l + ". The geometry must have either an index or a position attribute"), null;
      c.addGroup(h, p, l), h += p;
    }
  }
  if (e) {
    let l = 0;
    const u = [];
    for (let f = 0; f < n.length; ++f) {
      const p = n[f].index;
      for (let d = 0; d < p.count; ++d)
        u.push(p.getX(d) + l);
      l += n[f].attributes.position.count;
    }
    c.setIndex(u);
  }
  for (const l in r) {
    const u = gc(r[l]);
    if (!u)
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + l + " attribute."), null;
    c.setAttribute(l, u);
  }
  for (const l in a) {
    const u = a[l][0].length;
    if (u === 0) break;
    c.morphAttributes = c.morphAttributes || {}, c.morphAttributes[l] = [];
    for (let f = 0; f < u; ++f) {
      const p = [];
      for (let g = 0; g < a[l].length; ++g)
        p.push(a[l][g][f]);
      const d = gc(p);
      if (!d)
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + l + " morphAttribute."), null;
      c.morphAttributes[l].push(d);
    }
  }
  return c;
}
function gc(n) {
  let t, e, s, i = -1, r = 0;
  for (let h = 0; h < n.length; ++h) {
    const l = n[h];
    if (t === void 0 && (t = l.array.constructor), t !== l.array.constructor)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."), null;
    if (e === void 0 && (e = l.itemSize), e !== l.itemSize)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."), null;
    if (s === void 0 && (s = l.normalized), s !== l.normalized)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."), null;
    if (i === -1 && (i = l.gpuType), i !== l.gpuType)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."), null;
    r += l.count * e;
  }
  const a = new t(r), o = new he(a, e, s);
  let c = 0;
  for (let h = 0; h < n.length; ++h) {
    const l = n[h];
    if (l.isInterleavedBufferAttribute) {
      const u = c / e;
      for (let f = 0, p = l.count; f < p; f++)
        for (let d = 0; d < e; d++) {
          const g = l.getComponent(f, d);
          o.setComponent(f + u, d, g);
        }
    } else
      a.set(l.array, c);
    c += l.count * e;
  }
  return i !== void 0 && (o.gpuType = i), o;
}
function Xg(n, t = 1e-4) {
  t = Math.max(t, Number.EPSILON);
  const e = {}, s = n.getIndex(), i = n.getAttribute("position"), r = s ? s.count : i.count;
  let a = 0;
  const o = Object.keys(n.attributes), c = {}, h = {}, l = [], u = ["getX", "getY", "getZ", "getW"], f = ["setX", "setY", "setZ", "setW"];
  for (let v = 0, S = o.length; v < S; v++) {
    const w = o[v], k = n.attributes[w];
    c[w] = new k.constructor(
      new k.array.constructor(k.count * k.itemSize),
      k.itemSize,
      k.normalized
    );
    const M = n.morphAttributes[w];
    M && (h[w] || (h[w] = []), M.forEach((O, I) => {
      const V = new O.array.constructor(O.count * O.itemSize);
      h[w][I] = new O.constructor(V, O.itemSize, O.normalized);
    }));
  }
  const p = t * 0.5, d = Math.log10(1 / t), g = Math.pow(10, d), x = p * g;
  for (let v = 0; v < r; v++) {
    const S = s ? s.getX(v) : v;
    let w = "";
    for (let k = 0, M = o.length; k < M; k++) {
      const O = o[k], I = n.getAttribute(O), V = I.itemSize;
      for (let D = 0; D < V; D++)
        w += `${~~(I[u[D]](S) * g + x)},`;
    }
    if (w in e)
      l.push(e[w]);
    else {
      for (let k = 0, M = o.length; k < M; k++) {
        const O = o[k], I = n.getAttribute(O), V = n.morphAttributes[O], D = I.itemSize, W = c[O], J = h[O];
        for (let B = 0; B < D; B++) {
          const U = u[B], P = f[B];
          if (W[P](a, I[U](S)), V)
            for (let Q = 0, gt = V.length; Q < gt; Q++)
              J[Q][P](a, V[Q][U](S));
        }
      }
      e[w] = a, l.push(a), a++;
    }
  }
  const b = n.clone();
  for (const v in n.attributes) {
    const S = c[v];
    if (b.setAttribute(v, new S.constructor(
      S.array.slice(0, a * S.itemSize),
      S.itemSize,
      S.normalized
    )), v in h)
      for (let w = 0; w < h[v].length; w++) {
        const k = h[v][w];
        b.morphAttributes[v][w] = new k.constructor(
          k.array.slice(0, a * k.itemSize),
          k.itemSize,
          k.normalized
        );
      }
  }
  return b.setIndex(l), b;
}
new $();
function mc(n) {
  const t = n.getAttribute("position");
  if (!t || t.count === 0)
    return !0;
  const e = t.array;
  for (let s = 0; s < e.length; s++)
    if (!Number.isFinite(e[s]))
      return !1;
  return !0;
}
class yc extends eh {
  constructor(t, e, s) {
    super(), this.isFound = !1, this.char = t, this.fontSize = e, this.font = s, this.width = this.getCharWidth(t, e, s);
  }
  /**
   * Converts the text shape to a THREE.js geometry.
   * This is used for 3D rendering of the text.
   * @returns A THREE.js BufferGeometry representing the text shape
   */
  toGeometry() {
    let t = this.font.cache.getGeometry(
      this.char.charCodeAt(0),
      this.fontSize
    );
    if (t == null) {
      const e = this.font.generateShapes(this.char, this.fontSize);
      return t = new on(e, 4), mc(t) ? (t.hasAttribute("uv") && t.deleteAttribute("uv"), t.hasAttribute("normal") && t.deleteAttribute("normal"), Xg(t, 1e-6)) : (t.dispose(), new Ht());
    }
    return mc(t) ? t : new Ht();
  }
  /**
   * Calculates the width of a character in the font.
   * @param char - The character to calculate width for
   * @param fontSize - The size of the font in pixels
   * @param font - The mesh font to use
   * @returns The width of the character in pixels
   */
  getCharWidth(t, e, s) {
    const i = s.data.glyphs[t];
    return i ? (this.isFound = !0, i.ha * e / s.data.resolution) : (this.isFound = !1, 0);
  }
}
class Yg {
  constructor(t) {
    this.isFont = !0, this.type = "Font", this.data = t;
  }
  generateShapes(t, e = 100) {
    const s = [], i = Zg(t, e, this.data);
    for (let r = 0, a = i.length; r < a; r++)
      s.push(...i[r].toShapes());
    return s;
  }
}
function Zg(n, t, e) {
  const s = Array.from(n), i = t / e.resolution, r = (e.boundingBox.yMax - e.boundingBox.yMin + e.underlineThickness) * i, a = [];
  let o = 0, c = 0;
  for (let h = 0; h < s.length; h++) {
    const l = s[h];
    if (l === `
`)
      o = 0, c -= r;
    else {
      const u = Jg(l, i, o, c, e);
      o += u.offsetX, a.push(u.path);
    }
  }
  return a;
}
function Jg(n, t, e, s, i) {
  const r = i.glyphs[n] || i.glyphs["?"];
  if (!r) {
    console.error('THREE.Font: character "' + n + '" does not exists in font family ' + i.familyName + ".");
    return;
  }
  const a = new Qc();
  let o, c, h, l, u, f, p, d;
  if (r.o) {
    const g = r._cachedOutline || (r._cachedOutline = r.o.split(" "));
    for (let x = 0, b = g.length; x < b; )
      switch (g[x++]) {
        case "m":
          o = g[x++] * t + e, c = g[x++] * t + s, a.moveTo(o, c);
          break;
        case "l":
          o = g[x++] * t + e, c = g[x++] * t + s, a.lineTo(o, c);
          break;
        case "q":
          h = g[x++] * t + e, l = g[x++] * t + s, u = g[x++] * t + e, f = g[x++] * t + s, a.quadraticCurveTo(u, f, h, l);
          break;
        case "b":
          h = g[x++] * t + e, l = g[x++] * t + s, u = g[x++] * t + e, f = g[x++] * t + s, p = g[x++] * t + e, d = g[x++] * t + s, a.bezierCurveTo(u, f, p, d, h, l);
          break;
      }
  }
  return { offsetX: r.ha * t, path: a };
}
class Kg extends Yg {
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
  generateShapes(t, e = 100, s = "ltr") {
    const i = [];
    return Qg(t, e, this.data, s).forEach((a) => {
      i.push(...am(a));
    }), i;
  }
}
function Qg(n, t, e, s = "ltr") {
  const i = Array.from(n), r = t / e.resolution, a = (e.boundingBox.yMax - e.boundingBox.yMin + e.underlineThickness) * r, o = [];
  let c = 0, h = 0;
  (s === "rtl" || s === "tb") && i.reverse();
  for (const l of i)
    if (l === `
`)
      c = 0, h -= a;
    else {
      const u = tm(l, r, c, h, e);
      if (!u) continue;
      s === "tb" ? (c = 0, h += e.ascender * r) : c += u.offsetX, o.push(u.path);
    }
  return o;
}
function tm(n, t, e, s, i) {
  const r = i.glyphs[n] || i.glyphs["?"];
  if (!r) {
    console.error(
      `THREE.Font: character "${n}" does not exist in font family ${i.familyName}.`
    );
    return;
  }
  const a = new Qc();
  if (r.o) {
    const o = r.o.split(" ");
    let c = 0;
    for (; c < o.length; ) {
      const h = o[c++];
      let l, u, f, p, d, g, x, b;
      switch (h) {
        case "m":
          l = parseFloat(o[c++]) * t + e, u = parseFloat(o[c++]) * t + s, a.moveTo(l, u);
          break;
        case "l":
          l = parseFloat(o[c++]) * t + e, u = parseFloat(o[c++]) * t + s, a.lineTo(l, u);
          break;
        case "q":
          f = parseFloat(o[c++]) * t + e, p = parseFloat(o[c++]) * t + s, d = parseFloat(o[c++]) * t + e, g = parseFloat(o[c++]) * t + s, a.quadraticCurveTo(d, g, f, p);
          break;
        case "b":
          f = parseFloat(o[c++]) * t + e, p = parseFloat(o[c++]) * t + s, d = parseFloat(o[c++]) * t + e, g = parseFloat(o[c++]) * t + s, x = parseFloat(o[c++]) * t + e, b = parseFloat(o[c++]) * t + s, a.bezierCurveTo(d, g, x, b, f, p);
          break;
      }
    }
  }
  return { offsetX: r.ha * t, path: a };
}
function em(n, t) {
  let e = !1;
  const { x: s, y: i } = n, r = t.length;
  for (let a = 0, o = r - 1; a < r; o = a++) {
    const c = t[a].x, h = t[a].y, l = t[o].x, u = t[o].y;
    h > i != u > i && s < (l - c) * (i - h) / (u - h) + c && (e = !e);
  }
  return e;
}
function nm(n) {
  const t = n.length, e = Array(t).fill(null);
  for (let s = 0; s < t; s++) {
    let i = null, r = 1 / 0;
    for (let a = 0; a < t; a++)
      if (s !== a && n[s].every((o) => em(o, n[a]))) {
        const o = Math.abs($e.area(n[a]));
        o < r && (r = o, i = a);
      }
    e[s] = i;
  }
  return e;
}
function sm(n) {
  const t = n.length, e = Array.from({ length: t }, () => []);
  for (let s = 0; s < t; s++) {
    const i = n[s];
    i !== null && e[i].push(s);
  }
  return e;
}
function im(n) {
  return n.map((t, e) => t === null ? e : -1).filter((t) => t >= 0);
}
function rm(n) {
  const t = [];
  for (let e = n.length - 1; e >= 0; e--) {
    const s = n[e];
    if (s instanceof ss)
      t.push(new ss(s.v2.clone(), s.v1.clone()));
    else if (s instanceof gi)
      t.push(
        new gi(s.v2.clone(), s.v1.clone(), s.v0.clone())
      );
    else if (s instanceof di)
      t.push(
        new di(
          s.v3.clone(),
          s.v2.clone(),
          s.v1.clone(),
          s.v0.clone()
        )
      );
    else if (s instanceof cs)
      t.push(
        new cs(
          s.aX,
          s.aY,
          s.xRadius,
          s.yRadius,
          s.aEndAngle,
          s.aStartAngle,
          !s.aClockwise,
          s.aRotation
        )
      );
    else if (typeof s.getPoints == "function") {
      const i = s.getPoints(8);
      for (let r = i.length - 1; r > 0; r--)
        t.push(new ss(i[r].clone(), i[r - 1].clone()));
    }
  }
  return t;
}
function xc(n, t) {
  const e = $e.area(n.getPoints(32)) > 0, s = t === e ? n.curves.slice() : rm(n.curves), i = new Rn();
  return i.curves.push(...s), i;
}
function am(n, t = 32) {
  const e = n.subPaths;
  if (!e || e.length === 0) return [];
  const s = e.map((p) => p.getPoints(t)), i = nm(s), r = sm(i), a = im(i), o = e.length, c = Array(o).fill(-1), h = Array(o).fill(-1);
  for (const p of a) {
    const d = [{ idx: p, d: 0 }];
    for (; d.length; ) {
      const g = d.pop();
      c[g.idx] = g.d, h[g.idx] = p;
      for (const x of r[g.idx]) d.push({ idx: x, d: g.d + 1 });
    }
  }
  const l = [], u = /* @__PURE__ */ new Set();
  function f(p) {
    const d = xc(e[p], !0);
    u.add(p);
    for (const g of r[p])
      if (!u.has(g) && c[g] === c[p] + 1) {
        const x = xc(e[g], !1);
        d.holes.push(x), u.add(g);
      }
    l.push(d);
  }
  for (const p of a) f(p);
  for (let p = 0; p < o; p++)
    u.has(p) || f(p);
  return l;
}
class om {
  constructor(t = 512) {
    this.maxSize = t, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const e = this.map.get(t);
    return e && (this.map.delete(t), this.map.set(t, e)), e;
  }
  set(t, e) {
    if (this.map.has(t))
      this.map.delete(t);
    else if (this.map.size >= this.maxSize) {
      const s = this.map.keys().next().value;
      s !== void 0 && this.map.delete(s);
    }
    this.map.set(t, e);
  }
  has(t) {
    return this.map.has(t);
  }
  clear() {
    this.map.clear();
  }
}
class cm extends th {
  /**
   * Creates a new instance of MeshFont.
   * @param fontData - Either a MeshFontData object containing font information or an ArrayBuffer containing raw font data
   */
  constructor(t) {
    super(t), this.type = "mesh", this.glyphCache = new om(512);
    const e = t.data;
    if (e instanceof ArrayBuffer) {
      const s = this.parseMeshFont(e);
      this.data = s.data, this.opentypeFont = s.font;
    } else
      throw new Error(
        "Invalid font cache data. Please remove font cache database named 'mlightcad' in IndexedDB and try again!"
      );
    this.font = new Kg(this.data);
  }
  /**
   * Parses a mesh font from raw binary data.
   * This function converts raw font data (e.g., TTF, OTF, WOFF) into a MeshFontData object
   * that can be used by the MeshFont class.
   *
   * @param data - The raw font data as an ArrayBuffer
   * @returns An object containing the opentype font and parsed metadata
   */
  parseMeshFont(t) {
    const e = $g(t), s = Math.round, i = e.charToGlyph("A"), r = i ? e.unitsPerEm / (i.yMax || e.unitsPerEm) : 1, a = {
      glyphs: {},
      // Lazy loaded later
      familyName: e.getEnglishName("fullName"),
      ascender: s(e.ascender),
      descender: s(e.descender),
      underlinePosition: e.tables.post.underlinePosition,
      underlineThickness: e.tables.post.underlineThickness,
      boundingBox: {
        xMin: e.tables.head.xMin,
        xMax: e.tables.head.xMax,
        yMin: e.tables.head.yMin,
        yMax: e.tables.head.yMax
      },
      resolution: e.unitsPerEm || 1e3,
      scaleFactor: r,
      original_font_information: e.tables.name
    };
    return { font: e, data: a };
  }
  /**
   * Whether opentype maps the character to a real glyph (not .notdef at index 0).
   *
   * opentype.js ≤1.3.4: {@link OpenTypeFont.hasChar} used `charToGlyphIndex(c) !== null`,
   * but CmapEncoding returns 0 for missing code points — see
   * https://github.com/opentypejs/opentype.js/issues/330 (fixed in 2.0.0).
   * We keep `index > 0` here so hasChar stays aligned with {@link _loadGlyphIfNeeded}.
   */
  opentypeHasGlyph(t) {
    if (!this.opentypeFont) return !1;
    const e = this.opentypeFont.charToGlyphIndex(t);
    return e != null && e > 0;
  }
  /**
   * Return true if this font contains glyph of the specified character. Otherwise, return false.
   * @param char - The character to check
   * @returns True if this font contains glyph of the specified character. Otherwise, return false.
   */
  hasChar(t) {
    return this.opentypeHasGlyph(t);
  }
  /**
   * Return true if this font contains glyph of the specified character code. Otherwise, return false.
   * @param code - The character code to check
   * @returns True if this font contains glyph of the specified character code. Otherwise, return false.
   */
  hasCode(t) {
    return this.hasChar(String.fromCodePoint(t));
  }
  /**
   * Loads glyph data lazily when requested.
   * Parsed glyphs are cached in an LRU cache to limit memory usage.
   * @param char - The character whose glyph should be loaded
   */
  _loadGlyphIfNeeded(t) {
    if (this.data.glyphs[t] || !this.opentypeFont) return;
    const e = this.glyphCache.get(t);
    if (e) {
      this.data.glyphs[t] = e;
      return;
    }
    if (this.opentypeHasGlyph(t)) {
      const s = this.opentypeFont.charToGlyph(t);
      if (!s || !s.path) return;
      const i = Math.round, r = {
        ha: i(s.advanceWidth ?? 0),
        x_min: i(s.xMin ?? 0),
        x_max: i(s.xMax ?? 0),
        o: ""
      };
      s.path.commands.forEach((a) => {
        let o = a.type.toLowerCase();
        o === "c" && (o = "b"), r.o += o + " ", a.x !== void 0 && a.y !== void 0 && (r.o += i(a.x) + " " + i(a.y) + " "), a.x1 !== void 0 && a.y1 !== void 0 && (r.o += i(a.x1) + " " + i(a.y1) + " "), a.x2 !== void 0 && a.y2 !== void 0 && (r.o += i(a.x2) + " " + i(a.y2) + " ");
      }), this.data.glyphs[t] = r, this.glyphCache.set(t, r);
    }
  }
  /**
   * Generates shapes for a text string
   * @param text - The text to generate shapes for
   * @param size - The size of the text
   * @returns Array of shapes representing the text
   */
  generateShapes(t, e) {
    for (const s of t)
      this._loadGlyphIfNeeded(s);
    return this.font.generateShapes(t, e);
  }
  /**
   * Gets the shape data for a specific character at a given size.
   * @param char - The character to get the shape for
   * @param size - The desired size of the character
   * @returns The shape data for the character, or undefined if not found
   */
  getCharShape(t, e) {
    if (this._loadGlyphIfNeeded(t), !this.data.glyphs[t]) {
      this.addUnsupportedChar(t);
      return;
    }
    return new yc(t, e, this);
  }
  /**
   * Gets the shape data for a specific character unicode at a given size.
   * @param code - The character unicode to get the shape for
   * @param size - The desired size of the character
   * @returns The shape data for the character unicode, or undefined if not found
   */
  getCodeShape(t, e) {
    return this.getCharShape(String.fromCodePoint(t), e);
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
  getNotFoundTextShape(t) {
    return new yc("?", t, this);
  }
}
class It {
  /**
   * Converts an unsigned byte to a signed byte as used in SHX format.
   * Values > 127 are converted to their signed equivalent (-128 to -1).
   * @param value - The unsigned byte value to convert
   * @returns The signed byte value
   */
  static byteToSByte(t) {
    return (t & 127) - (t & 128 ? 128 : 0);
  }
  /**
   * Creates a new ShxFileReader instance.
   * @param arraybuffer - The ArrayBuffer to read from
   */
  constructor(t) {
    this.position = 0, this.data = new DataView(t);
  }
  /**
   * Reads a specified number of bytes from the current position.
   * @param length - Number of bytes to read (optional)
   * @returns A Uint8Array containing the read bytes
   * @throws Error if reading beyond buffer bounds
   */
  readBytes(t = 1) {
    this.data.byteLength < this.position + t && this.throwOutOfRangeError(this.position + t);
    const e = new Uint8Array(this.data.buffer, this.position, t);
    return this.position += t, e;
  }
  /**
   * Skips a specified number of bytes from the current position.
   * @param length - Number of bytes to skip
   * @throws Error if skipping beyond buffer bounds
   */
  skip(t) {
    this.data.byteLength < this.position + t && this.throwOutOfRangeError(this.position + t), this.position += t;
  }
  /**
   * Reads an unsigned 8-bit integer.
   * @returns The read uint8 value
   * @throws Error if reading beyond buffer bounds
   */
  readUint8() {
    this.data.byteLength < this.position + 1 && this.throwOutOfRangeError(this.position + 1);
    const t = this.data.getUint8(this.position);
    return this.position += 1, t;
  }
  /**
   * Reads a signed 8-bit integer.
   * @returns The read int8 value
   * @throws Error if reading beyond buffer bounds
   */
  readInt8() {
    this.data.byteLength < this.position + 1 && this.throwOutOfRangeError(this.position + 1);
    const t = this.data.getInt8(this.position);
    return this.position += 1, t;
  }
  /**
   * Reads an unsigned 16-bit integer.
   * @param littleEndian If false, a big-endian value should be read.
   * @returns The read uint16 value
   * @throws Error if reading beyond buffer bounds
   */
  readUint16(t = !0) {
    this.data.byteLength < this.position + 2 && this.throwOutOfRangeError(this.position + 2);
    const e = this.data.getUint16(this.position, t);
    return this.position += 2, e;
  }
  /**
   * Reads a signed 16-bit integer.
   * @returns The read int16 value
   * @throws Error if reading beyond buffer bounds
   */
  readInt16() {
    this.data.byteLength < this.position + 2 && this.throwOutOfRangeError(this.position + 2);
    const t = this.data.getInt16(this.position, !0);
    return this.position += 2, t;
  }
  /**
   * Reads an unsigned 32-bit integer.
   * @returns The read uint32 value
   * @throws Error if reading beyond buffer bounds
   */
  readUint32() {
    this.data.byteLength < this.position + 4 && this.throwOutOfRangeError(this.position + 4);
    const t = this.data.getUint32(this.position, !0);
    return this.position += 4, t;
  }
  /**
   * Reads a signed 32-bit integer.
   * @returns The read int32 value
   * @throws Error if reading beyond buffer bounds
   */
  readInt32() {
    this.data.byteLength < this.position + 4 && this.throwOutOfRangeError(this.position + 4);
    const t = this.data.getInt32(this.position, !0);
    return this.position += 4, t;
  }
  /**
   * Reads a 32-bit floating point number.
   * @returns The read float32 value
   * @throws Error if reading beyond buffer bounds
   */
  readFloat32() {
    this.data.byteLength < this.position + 4 && this.throwOutOfRangeError(this.position + 4);
    const t = this.data.getFloat32(this.position, !0);
    return this.position += 4, t;
  }
  /**
   * Reads a 64-bit floating point number.
   * @returns The read float64 value
   * @throws Error if reading beyond buffer bounds
   */
  readFloat64() {
    this.data.byteLength < this.position + 8 && this.throwOutOfRangeError(this.position + 8);
    const t = this.data.getFloat64(this.position, !0);
    return this.position += 8, t;
  }
  /**
   * Sets the current read position in the buffer.
   * @param position - The new position to set
   */
  setPosition(t) {
    this.data.byteLength < t && this.throwOutOfRangeError(t), this.position = t;
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
  throwOutOfRangeError(t) {
    throw new Error(
      `Position ${t} is out of range for the data length ${this.data.byteLength}!`
    );
  }
}
var Ct = /* @__PURE__ */ ((n) => (n.SHAPES = "shapes", n.BIGFONT = "bigfont", n.UNIFONT = "unifont", n))(Ct || {});
class hm {
  parse(t) {
    const e = this.parseHeader(t).split(" "), s = e[1].toLocaleLowerCase();
    if (!Object.values(Ct).includes(s))
      throw new Error(`Invalid font type: ${s}`);
    return {
      fileHeader: e[0],
      fontType: s,
      fileVersion: e[2]
    };
  }
  parseHeader(t) {
    let e = "", s = 0;
    for (; t.currentPosition < t.length - 2 && s < 1024; ) {
      const i = t.readUint8();
      if (i === 13) {
        const r = t.currentPosition, a = t.readUint8(), o = t.readUint8();
        if (a === 10 && o === 26)
          break;
        t.setPosition(r), e += String.fromCharCode(i);
      } else
        e += String.fromCharCode(i);
      s++;
    }
    return e.trim();
  }
}
const Qt = 10, lm = [13, 10, 0];
function fl(n) {
  const t = n.indexOf(0);
  return t < 0 ? { name: null, bytecode: n } : { name: t > 0 ? new TextDecoder("ascii").decode(n.subarray(0, t)) : null, bytecode: n.subarray(t + 1) };
}
class um {
  parse(t) {
    try {
      t.readBytes(4);
      const e = t.readInt16();
      if (e <= 0)
        throw new Error("Invalid shape count in font file");
      const s = [];
      for (let c = 0; c < e; c++) {
        const h = t.readUint16(), l = t.readUint16();
        l > 0 && s.push({ code: h, length: l });
      }
      const i = {};
      for (const c of s)
        try {
          const h = t.readBytes(c.length);
          h.length === c.length && (i[c.code] = h);
        } catch {
          console.warn(`Failed to read shape data for code ${c.code}`);
        }
      const r = {}, a = {};
      for (const [c, h] of Object.entries(i)) {
        const l = Number(c);
        if (l === 0) {
          r[l] = h;
          continue;
        }
        const { name: u, bytecode: f } = fl(h);
        r[l] = f, u && (a[u] = l);
      }
      const o = {
        data: r,
        names: Object.keys(a).length > 0 ? a : void 0,
        info: "",
        baseUp: 8,
        baseDown: 2,
        height: Qt,
        width: Qt,
        orientation: "horizontal",
        isExtended: !1
      };
      if (0 in r) {
        const c = r[0];
        try {
          const h = new TextDecoder().decode(c);
          let l = c.findIndex((u) => lm.includes(u));
          l >= 0 && (o.info = h.substring(0, l), l + 3 < c.length && (o.baseUp = c[l + 1], o.baseDown = c[l + 2], o.height = o.baseDown + o.baseUp, o.width = o.height, o.orientation = c[l + 3] === 0 ? "horizontal" : "vertical"));
        } catch {
          console.warn("Failed to parse font info block");
        }
      }
      return o;
    } catch (e) {
      return console.error("Error parsing shape font:", e), {
        data: {},
        info: "Failed to parse font file",
        baseUp: 8,
        baseDown: 2,
        height: Qt,
        width: Qt,
        orientation: "horizontal",
        isExtended: !1
      };
    }
  }
}
class fm {
  parse(t) {
    try {
      t.readInt16();
      const e = t.readInt16(), s = t.readInt16();
      if (e <= 0)
        throw new Error("Invalid character count in font file");
      t.skip(s * 4);
      const i = [];
      for (let o = 0; o < e; o++) {
        const c = t.readUint16(), h = t.readUint16(), l = t.readUint32();
        (c !== 0 || h !== 0 || l !== 0) && i.push({ code: c, length: h, offset: l });
      }
      const r = {};
      for (const o of i)
        try {
          t.setPosition(o.offset);
          const c = t.readBytes(o.length);
          c.length === o.length && (r[o.code] = c);
        } catch {
          console.warn(`Failed to read bigfont data for code ${o.code}`);
        }
      const a = {
        data: r,
        info: "",
        baseUp: 8,
        baseDown: 2,
        height: Qt,
        width: Qt,
        orientation: "horizontal",
        isExtended: !1
      };
      if (0 in r) {
        const o = r[0];
        try {
          const c = this.utf8ArrayToStr(o);
          let h = c.pos;
          h >= 0 && (a.info = c.text, h++, h + 3 < o.length && (o.length - h > 4 ? (a.height = o[h++], h++, a.orientation = o[h++] === 0 ? "horizontal" : "vertical", a.width = o[h++], a.baseUp = a.height, a.baseDown = 0, a.isExtended = !0) : (a.baseUp = o[h++], a.baseDown = o[h++], a.height = a.baseDown + a.baseUp, a.width = a.height, a.orientation = o[h] === 0 ? "horizontal" : "vertical")));
        } catch {
          console.warn("Failed to parse bigfont info block");
        }
      }
      return a;
    } catch (e) {
      return console.error("Error parsing big font:", e), {
        data: {},
        info: "Failed to parse font file",
        baseUp: 8,
        baseDown: 2,
        height: Qt,
        width: Qt,
        orientation: "horizontal",
        isExtended: !1
      };
    }
  }
  utf8ArrayToStr(t) {
    let e = "", s = 0;
    for (; s < t.length; ) {
      const i = t[s];
      switch (i >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          e += String.fromCharCode(i);
          break;
        case 12:
        case 13: {
          const r = t[s++];
          e += String.fromCharCode((i & 31) << 6 | r & 63);
          break;
        }
        case 14: {
          const r = t[s++], a = t[s++];
          e += String.fromCharCode(
            (i & 15) << 12 | (r & 63) << 6 | (a & 63) << 0
          );
          break;
        }
      }
      if (e.charCodeAt(e.length - 1) === 0) break;
      s++;
    }
    return { text: e, pos: s };
  }
}
class pm {
  parse(t) {
    try {
      const e = t.readInt32();
      if (e <= 0)
        throw new Error("Invalid character count in font file");
      const s = t.readInt16(), i = t.readBytes(s), r = {
        data: {},
        info: "",
        baseUp: 8,
        baseDown: 2,
        height: Qt,
        width: Qt,
        orientation: "horizontal",
        isExtended: !1
      };
      try {
        const c = new TextDecoder().decode(i);
        let h = c.indexOf("\0");
        h >= 0 && (r.info = c.substring(0, h), h + 3 < i.length && (r.baseUp = i[h + 1], r.baseDown = i[h + 2], r.height = r.baseUp + r.baseDown, r.width = r.height, r.orientation = i[h + 3] === 0 ? "horizontal" : "vertical"));
      } catch {
        console.warn("Failed to parse unifont info block");
      }
      const a = {}, o = {};
      for (let c = 0; c < e - 1; c++)
        try {
          const h = t.readUint16(), l = t.readUint16();
          if (l > 0) {
            const u = t.readBytes(l);
            if (u.length === l) {
              const { name: f, bytecode: p } = fl(u);
              p.length > 0 && (a[h] = p, f && (o[f] = h));
            }
          }
        } catch {
          console.warn("Failed to read unifont character data");
          break;
        }
      return r.data = a, r.names = Object.keys(o).length > 0 ? o : void 0, r;
    } catch (e) {
      return console.error("Error parsing unifont:", e), {
        data: {},
        info: "Failed to parse font file",
        baseUp: 8,
        baseDown: 2,
        height: Qt,
        width: Qt,
        orientation: "horizontal",
        isExtended: !1
      };
    }
  }
}
class dm {
  static createParser(t) {
    switch (t) {
      case Ct.SHAPES:
        return new um();
      case Ct.BIGFONT:
        return new fm();
      case Ct.UNIFONT:
        return new pm();
      default:
        throw new Error(`Unsupported font type: ${t}`);
    }
  }
}
class ft {
  /**
   * Creates a new Point instance.
   * @param x - The x-coordinate (defaults to 0)
   * @param y - The y-coordinate (defaults to 0)
   */
  constructor(t = 0, e = 0) {
    this.x = t, this.y = e;
  }
  /**
   * Sets the coordinates of the point.
   * @param x - The new x-coordinate
   * @param y - The new y-coordinate
   * @returns The point instance for method chaining
   */
  set(t, e) {
    return this.x = t, this.y = e, this;
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
    const t = this.length();
    return t !== 0 && (this.x /= t, this.y /= t), this;
  }
  /**
   * Creates a new Point instance with the same coordinates.
   * @returns A new Point instance with the same x and y values
   */
  clone() {
    return new ft(this.x, this.y);
  }
  /**
   * Adds another point's coordinates to this point.
   * @param point - The point to add
   * @returns The point instance for method chaining
   */
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  /**
   * Subtracts another point's coordinates from this point.
   * @param point - The point to subtract
   * @returns The point instance for method chaining
   */
  subtract(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  /**
   * Multiplies both coordinates by a scalar value.
   * @param scalar - The scalar value to multiply by
   * @returns The point instance for method chaining
   */
  multiply(t) {
    return this.x *= t, this.y *= t, this;
  }
  /**
   * Divides both coordinates by a scalar value.
   * @param scalar - The scalar value to divide by
   * @returns The point instance for method chaining
   */
  divide(t) {
    return t !== 0 && (this.x /= t, this.y /= t), this;
  }
  /**
   * Multiplies x and y coordinates by different scalar values.
   * @param xScalar - The scalar value to multiply x-coordinate by
   * @param yScalar - The scalar value to multiply y-coordinate by
   * @returns The point instance for method chaining
   */
  multiplyScalars(t, e) {
    return this.x *= t, this.y *= e, this;
  }
  /**
   * Divides x and y coordinates by different scalar values.
   * @param xScalar - The scalar value to divide x-coordinate by
   * @param yScalar - The scalar value to divide y-coordinate by
   * @returns The point instance for method chaining
   */
  divideScalars(t, e) {
    return t !== 0 && (this.x /= t), e !== 0 && (this.y /= e), this;
  }
  /**
   * Calculates the Euclidean distance to another point.
   * @param point - The point to calculate distance to
   * @returns The distance between the two points
   */
  distanceTo(t) {
    const e = this.x - t.x, s = this.y - t.y;
    return Math.sqrt(e * e + s * s);
  }
}
const bc = Math.PI / 4;
class gs {
  /**
   * Creates a bulge-defined arc
   * @param start Start point
   * @param end End point
   * @param bulge Bulge factor (-1 to 1, where 1 is a semicircle)
   */
  static fromBulge(t, e, s) {
    const i = Math.max(-1, Math.min(1, s));
    return new gs({
      start: t,
      end: e,
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
  static fromOctant(t, e, s, i, r) {
    return new gs({
      center: t,
      radius: e,
      startOctant: s,
      octantCount: i,
      isClockwise: r
    });
  }
  constructor(t) {
    if (t.start && t.end && t.bulge !== void 0) {
      this.start = t.start.clone(), this.end = t.end.clone(), this.bulge = t.bulge, this.isClockwise = t.bulge < 0;
      const e = this.end.clone().subtract(this.start), s = e.length();
      if (Math.abs(this.bulge) * s / 2 === 0) {
        this.radius = 0, this.center = this.start.clone(), this.startAngle = Math.atan2(e.y, e.x), this.endAngle = this.startAngle;
        return;
      }
      const i = 4 * Math.atan(Math.abs(this.bulge));
      this.radius = s / (2 * Math.sin(i / 2));
      const r = this.start.clone().add(e.clone().divide(2)), a = new ft(-e.y, e.x);
      a.normalize(), a.multiply(Math.abs(this.radius * Math.cos(i / 2))), this.center = r.clone(), this.isClockwise ? this.center.subtract(a) : this.center.add(a), this.startAngle = Math.atan2(this.start.y - this.center.y, this.start.x - this.center.x), this.endAngle = Math.atan2(this.end.y - this.center.y, this.end.x - this.center.x), this.isClockwise ? this.endAngle >= this.startAngle && (this.endAngle -= 2 * Math.PI) : this.endAngle <= this.startAngle && (this.endAngle += 2 * Math.PI);
    } else if (t.center && t.radius !== void 0 && t.startOctant !== void 0 && t.octantCount !== void 0 && t.isClockwise !== void 0) {
      this.center = t.center.clone(), this.radius = t.radius, this.isClockwise = t.isClockwise, this.startAngle = t.startOctant * bc;
      const e = (t.octantCount === 0 ? 8 : t.octantCount) * bc;
      this.endAngle = this.startAngle + (this.isClockwise ? -e : e), this.start = this.center.clone().add(
        new ft(
          this.radius * Math.cos(this.startAngle),
          this.radius * Math.sin(this.startAngle)
        )
      ), this.end = this.center.clone().add(
        new ft(this.radius * Math.cos(this.endAngle), this.radius * Math.sin(this.endAngle))
      );
    } else
      throw new Error("Invalid arc parameters");
  }
  /**
   * Tessellates the arc into a series of points that approximate the arc.
   * @param circleSpan The angle span between tessellated points (default Math.PI / 18)
   * @returns Array of points representing the tessellated arc
   */
  tessellate(t = Math.PI / 18) {
    if (this.radius === 0)
      return [this.start.clone(), this.end.clone()];
    const e = [this.start.clone()], s = Math.abs(this.endAngle - this.startAngle), i = Math.max(1, Math.floor(s / t));
    for (let r = 1; r < i; r++) {
      const a = r / i, o = this.isClockwise ? this.startAngle - a * s : this.startAngle + a * s;
      e.push(
        this.center.clone().add(new ft(this.radius * Math.cos(o), this.radius * Math.sin(o)))
      );
    }
    return e.push(
      this.end ? this.end.clone() : this.center.clone().add(
        new ft(
          this.radius * Math.cos(this.endAngle),
          this.radius * Math.sin(this.endAngle)
        )
      )
    ), e;
  }
}
class as {
  constructor(t, e = []) {
    this.lastPoint = t, this.polylines = e;
  }
  /**
   * Get the bounding box of the shape
   * @returns Bounding box of the shape
   */
  get bbox() {
    if (this._bbox)
      return this._bbox;
    let t = 1 / 0, e = -1 / 0, s = 1 / 0, i = -1 / 0;
    return this.polylines.forEach((r) => {
      r.forEach((a) => {
        t = Math.min(t, a.x), e = Math.max(e, a.x), s = Math.min(s, a.y), i = Math.max(i, a.y);
      });
    }), this._bbox = { minX: t, minY: s, maxX: e, maxY: i }, this._bbox;
  }
  /**
   * Offset the shape by a point
   * @param p The point to offset the shape by
   * @param isNewInstance Whether to return a new instance of the shape or modify the current instance
   * @returns The offset shape
   */
  offset(t, e = !0) {
    var s, i;
    return e ? new as(
      (s = this.lastPoint) == null ? void 0 : s.clone().add(t),
      this.polylines.map((r) => r.map((a) => a.clone().add(t)))
    ) : ((i = this.lastPoint) == null || i.add(t), this.polylines.forEach((r) => r.forEach((a) => a.add(t))), this._bbox && (this._bbox.maxX += t.x, this._bbox.minX += t.x, this._bbox.maxY += t.y, this._bbox.minY += t.y), this);
  }
  /**
   * Normalizes a shape so that its bounding box’s bottom-left corner moves to the origin (0,0).
   * It doesn’t change the size or orientation, only repositions the shape.
   * @param isNewInstance Whether to return a new instance of the shape or modify the current instance
   * @returns The offset shape
   */
  normalizeToOrigin(t = !1) {
    const e = this.bbox;
    return this.offset(new ft(-e.minX, -e.minY), t);
  }
  /**
   * Converts the shape to an SVG string
   * @param options SVG rendering options
   * @returns SVG string
   */
  toSVG(t = {}) {
    const { strokeWidth: e = "0.5%", strokeColor: s = "black", isAutoFit: i = !1 } = t;
    let r, a;
    if (i) {
      const o = this.bbox, c = 0.2, h = o.maxX - o.minX, l = o.maxY - o.minY, u = h === 0 ? l : h, f = l === 0 ? h : l, p = o.minX - u * c, d = o.maxX + u * c, g = o.minY - f * c, x = o.maxY + f * c;
      a = this.polylines.map((b) => {
        let v = "";
        return b.forEach((S, w) => {
          const k = S.x, M = -S.y;
          v += w === 0 ? `M ${k} ${M} ` : `L ${k} ${M} `;
        }), `<path d="${v}" stroke="${s}" stroke-width="${e}" fill="none"/>`;
      }).join(""), r = `${p} ${-x} ${d - p} ${x - g}`;
    } else
      r = "0 0 20 20", a = this.polylines.map((o) => {
        let c = "";
        return o.forEach((h, l) => {
          const u = h.x + 5, f = -h.y + 15;
          c += l === 0 ? `M ${u} ${f} ` : `L ${u} ${f} `;
        }), `<path d="${c}" stroke="${s}" stroke-width="${e}" fill="none"/>`;
      }).join("");
    return `<svg width="100%" height="100%" viewBox="${r}" preserveAspectRatio="xMidYMid meet">${a}</svg>`;
  }
}
const gm = Math.PI / 18;
class mm {
  constructor(t) {
    this.shapeCache = /* @__PURE__ */ new Map(), this.shapeData = /* @__PURE__ */ new Map(), this.fontData = t;
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
  getCharShape(t, e) {
    const s = e / this.fontData.content.height;
    return this.parseAndScale(t, { factor: s });
  }
  /**
   * Parses a character's shape with scaling options
   * @param code - The character code
   * @param options - Scaling options (factor or height/width)
   * @returns The parsed shape or undefined if the character is not found
   */
  parseAndScale(t, e) {
    if (t === 0)
      return;
    let s;
    if (this.shapeCache.has(t))
      s = this.shapeCache.get(t);
    else {
      const i = this.fontData.content.data;
      if (i[t]) {
        const r = i[t];
        s = this.parseShape(r), this.shapeData.set(t, s), this.shapeCache.set(t, s);
      }
    }
    if (s) {
      if (e.factor !== void 0)
        return this.scaleShapeByFactor(s, e.factor);
      if (e.height !== void 0) {
        const i = e.width ?? e.height;
        return this.scaleShapeByHeightAndWidth(s, e.height, i);
      } else
        return s;
    }
  }
  /**
   * Scales a shape according to the given scale factor
   * @param shape - The shape to scale
   * @param factor - The scale factor
   * @returns The scaled shape
   */
  scaleShapeByFactor(t, e) {
    var s;
    return new as(
      (s = t.lastPoint) == null ? void 0 : s.clone().multiply(e),
      t.polylines.map((i) => i.map((r) => r.clone().multiply(e)))
    );
  }
  /**
   * Scales a shape according to the given height and width
   * @param shape - The shape to scale
   * @param height - The target height
   * @param width - The target width
   * @returns The scaled shape
   */
  scaleShapeByHeightAndWidth(t, e, s) {
    var i;
    const r = t.bbox, a = r.maxY - r.minY, o = r.maxX - r.minX, c = a > 0 ? e / a : 1, h = o > 0 ? s / o : 1, l = (i = t.lastPoint) == null ? void 0 : i.clone();
    l && (l.x *= h, l.y *= c);
    const u = t.polylines.map(
      (f) => f.map((p) => {
        const d = p.clone();
        return d.x *= h, d.y *= c, d;
      })
    );
    return new as(l, u);
  }
  /**
   * Parses the shape of a character.
   * @param data - The data of the character
   * @param options - Optional parse settings
   * @returns The parsed shape
   */
  parseShape(t, e = {}) {
    let s = new ft();
    const i = [];
    let r = [];
    const a = [];
    let o = e.initialPenDown ?? !1;
    o && r.push(s.clone());
    const c = {
      currentPoint: s,
      polylines: i,
      currentPolyline: r,
      sp: a,
      isPenDown: o,
      scale: 1,
      // Only flush a pen-down polyline on shape end when parsing a unifont
      // subshape with inherited pen (amgdt %%132). Global flush regresses bigfont
      // subshape caches (e.g. gbcbig.shx CJK glyphs).
      flushEndPolyline: e.initialPenDown ?? !1
    };
    for (let h = 0; h < t.length; h++) {
      const l = t[h];
      l <= 15 ? h = this.handleSpecialCommand(l, t, h, c) : this.handleVectorCommand(l, c);
    }
    return new as(c.currentPoint, c.polylines);
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
  handleSpecialCommand(t, e, s, i) {
    let r = s;
    switch (t) {
      case 0:
        i.flushEndPolyline && i.currentPolyline.length > 1 && i.polylines.push(i.currentPolyline.slice()), i.currentPolyline = [], i.isPenDown = !1;
        break;
      case 1:
        i.isPenDown = !0, i.currentPolyline.push(i.currentPoint.clone());
        break;
      case 2:
        i.isPenDown = !1, i.currentPolyline.length > 1 && i.polylines.push(i.currentPolyline.slice()), i.currentPolyline = [];
        break;
      case 3:
        r++, i.scale /= e[r];
        break;
      case 4:
        r++, i.scale *= e[r];
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
        r = this.handleSubshapeCommand(e, r, i);
        break;
      case 8:
        r = this.handleXYDisplacement(e, r, i);
        break;
      case 9:
        r = this.handleMultipleXYDisplacements(e, r, i);
        break;
      case 10:
        r = this.handleOctantArc(e, r, i);
        break;
      case 11:
        r = this.handleFractionalArc(e, r, i);
        break;
      case 12:
        r = this.handleBulgeArc(e, r, i);
        break;
      case 13:
        r = this.handleMultipleBulgeArcs(e, r, i);
        break;
      case 14:
        r = this.skipCode(e, ++r);
        break;
    }
    return r;
  }
  handleVectorCommand(t, e) {
    const s = (t & 240) >> 4, i = t & 15, r = this.getVectorForDirection(i);
    e.currentPoint.add(r.multiply(s * e.scale)), e.isPenDown && e.currentPolyline.push(e.currentPoint.clone());
  }
  /**
   * Get the vector for the given direction code. Please refer to the following link for more information.
   * https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-0A8E12A1-F4AB-44AD-8A9B-2140E0D5FD23
   * @param dir - The direction code of the vector
   * @returns Returns the vector for the given direction code
   */
  getVectorForDirection(t) {
    const e = new ft();
    switch (t) {
      case 0:
        e.x = 1;
        break;
      case 1:
        e.x = 1, e.y = 0.5;
        break;
      case 2:
        e.x = 1, e.y = 1;
        break;
      case 3:
        e.x = 0.5, e.y = 1;
        break;
      case 4:
        e.y = 1;
        break;
      case 5:
        e.x = -0.5, e.y = 1;
        break;
      case 6:
        e.x = -1, e.y = 1;
        break;
      case 7:
        e.x = -1, e.y = 0.5;
        break;
      case 8:
        e.x = -1;
        break;
      case 9:
        e.x = -1, e.y = -0.5;
        break;
      case 10:
        e.x = -1, e.y = -1;
        break;
      case 11:
        e.x = -0.5, e.y = -1;
        break;
      case 12:
        e.y = -1;
        break;
      case 13:
        e.x = 0.5, e.y = -1;
        break;
      case 14:
        e.x = 1, e.y = -1;
        break;
      case 15:
        e.x = 1, e.y = -0.5;
        break;
    }
    return e;
  }
  handleSubshapeCommand(t, e, s) {
    let i = e, r = 0, a, o = s.scale * this.fontData.content.height, c = o;
    const h = s.currentPoint.clone();
    switch (s.currentPolyline.length > 1 && (s.polylines.push(s.currentPolyline.slice()), s.currentPolyline = []), this.fontData.header.fontType) {
      case Ct.SHAPES:
        i++, r = t[i];
        break;
      case Ct.BIGFONT:
        i++, r = t[i], r === 0 && (i++, r = t[i++] << 8 | t[i++], h.x = It.byteToSByte(t[i++]) * s.scale, h.y = It.byteToSByte(t[i++]) * s.scale, this.fontData.content.isExtended && (c = t[i++] * s.scale), o = t[i] * s.scale);
        break;
      case Ct.UNIFONT:
        i++, r = t[i++] << 8 | t[i++];
        break;
    }
    if (r !== 0)
      if (this.fontData.header.fontType === Ct.UNIFONT) {
        const l = s.isPenDown;
        a = this.getScaledSubshapeAtInsertPoint(
          r,
          c,
          o,
          h,
          l
        ), a != null && a.polylines.some((u) => u.length >= 2) && (s.polylines.push(...a.polylines.slice()), a.lastPoint && (s.currentPoint = a.lastPoint.clone()), s.currentPolyline = [], s.isPenDown && s.currentPolyline.push(s.currentPoint.clone()));
      } else
        a = this.getScaledSubshapeAtInsertPoint(
          r,
          c,
          o,
          h
        ), a && s.polylines.push(...a.polylines.slice()), s.currentPolyline = [];
    return i;
  }
  handleXYDisplacement(t, e, s) {
    let i = e;
    const r = new ft();
    return r.x = It.byteToSByte(t[++i]), r.y = It.byteToSByte(t[++i]), s.currentPoint.add(r.multiply(s.scale)), s.isPenDown && s.currentPolyline.push(s.currentPoint.clone()), i;
  }
  handleMultipleXYDisplacements(t, e, s) {
    let i = e;
    for (; ; ) {
      const r = new ft();
      if (r.x = It.byteToSByte(t[++i]), r.y = It.byteToSByte(t[++i]), r.x === 0 && r.y === 0)
        break;
      s.currentPoint.add(r.multiply(s.scale)), s.isPenDown && s.currentPolyline.push(s.currentPoint.clone());
    }
    return i;
  }
  handleOctantArc(t, e, s) {
    var i;
    let r = e;
    const a = t[++r] * s.scale, o = It.byteToSByte(t[++r]), c = (o & 112) >> 4;
    let h = o & 7;
    const l = o < 0, u = Math.PI / 4 * c, f = s.currentPoint.clone().subtract(new ft(Math.cos(u) * a, Math.sin(u) * a)), p = gs.fromOctant(f, a, c, h, l);
    if (s.isPenDown) {
      const d = p.tessellate();
      s.currentPolyline.pop(), s.currentPolyline.push(...d.slice());
    }
    return s.currentPoint = (i = p.tessellate().pop()) == null ? void 0 : i.clone(), r;
  }
  handleFractionalArc(t, e, s) {
    let i = e;
    const r = t[++i], a = t[++i], o = t[++i], c = t[++i], h = (o * 255 + c) * s.scale, l = It.byteToSByte(t[++i]), u = (l & 112) >> 4;
    let f = l & 7;
    f === 0 && (f = 8), a !== 0 && f--;
    const p = Math.PI / 4;
    let d = p * f, g = gm, x = 1;
    l < 0 && (g = -g, d = -d, x = -1);
    let b = p * u, v = b + d;
    b += p * r / 256 * x, v += p * a / 256 * x;
    const S = s.currentPoint.clone().subtract(new ft(h * Math.cos(b), h * Math.sin(b)));
    if (s.currentPoint = S.clone().add(new ft(h * Math.cos(v), h * Math.sin(v))), s.isPenDown) {
      let w = b;
      const k = [];
      if (k.push(
        S.clone().add(new ft(h * Math.cos(w), h * Math.sin(w)))
      ), g > 0)
        for (; w + g < v; )
          w += g, k.push(
            S.clone().add(new ft(h * Math.cos(w), h * Math.sin(w)))
          );
      else
        for (; w + g > v; )
          w += g, k.push(
            S.clone().add(new ft(h * Math.cos(w), h * Math.sin(w)))
          );
      k.push(S.clone().add(new ft(h * Math.cos(v), h * Math.sin(v)))), s.currentPolyline.push(...k);
    }
    return i;
  }
  handleBulgeArc(t, e, s) {
    let i = e;
    const r = new ft();
    r.x = It.byteToSByte(t[++i]), r.y = It.byteToSByte(t[++i]);
    const a = It.byteToSByte(t[++i]);
    return s.currentPoint = this.handleArcSegment(
      s.currentPoint,
      r,
      a,
      s.scale,
      s.isPenDown,
      s.currentPolyline
    ), i;
  }
  handleMultipleBulgeArcs(t, e, s) {
    let i = e;
    for (; ; ) {
      const r = new ft();
      if (r.x = It.byteToSByte(t[++i]), r.y = It.byteToSByte(t[++i]), r.x === 0 && r.y === 0)
        break;
      const a = It.byteToSByte(t[++i]);
      s.currentPoint = this.handleArcSegment(
        s.currentPoint,
        r,
        a,
        s.scale,
        s.isPenDown,
        s.currentPolyline
      );
    }
    return i;
  }
  skipCode(t, e) {
    switch (t[e]) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
      case 4:
        e++;
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        switch (this.fontData.header.fontType) {
          case Ct.SHAPES:
            e++;
            break;
          case Ct.BIGFONT:
            e++, t[e] === 0 && (e += this.fontData.content.isExtended ? 6 : 5);
            break;
          case Ct.UNIFONT:
            e += 2;
            break;
        }
        break;
      case 8:
        e += 2;
        break;
      case 9:
        for (; ; ) {
          const s = t[++e], i = t[++e];
          if (s === 0 && i === 0)
            break;
        }
        break;
      case 10:
        e += 2;
        break;
      case 11:
        e += 5;
        break;
      case 12:
        e += 3;
        break;
      case 13:
        for (; ; ) {
          const s = t[++e], i = t[++e];
          if (s === 0 && i === 0)
            break;
          e++;
        }
        break;
    }
    return e;
  }
  getScaledSubshapeAtInsertPoint(t, e, s, i, r = !1) {
    let a;
    if (r) {
      const c = this.fontData.content.data[t];
      if (!c)
        return;
      a = this.parseShape(c, { initialPenDown: !0 });
    } else if (a = this.shapeCache.get(t), !a) {
      const c = this.fontData.content.data[t];
      if (!c)
        return;
      a = this.parseShape(c), this.shapeData.set(t, a), this.shapeCache.set(t, a);
    }
    const o = a.normalizeToOrigin(!0);
    return this.scaleShapeByHeightAndWidth(o, s, e).offset(i, !1);
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
  handleArcSegment(t, e, s, i, r, a) {
    e.x *= i, e.y *= i, s < -127 && (s = -127);
    const o = t.clone();
    if (r)
      if (s === 0)
        a.push(o.clone().add(e));
      else {
        const c = o.clone().add(e), h = gs.fromBulge(o, c, s / 127).tessellate();
        a.push(...h.slice(1));
      }
    return o.add(e), o;
  }
}
class ym {
  /**
   * Creates a new ShxFont instance.
   * @param data - Either raw binary data of the SHX font file (ArrayBuffer) or pre-parsed font data (ShxFontData)
   * @throws {Error} If the font data is invalid or cannot be parsed
   */
  constructor(t) {
    if (t instanceof ArrayBuffer) {
      const e = new It(t), s = new hm().parse(e), i = dm.createParser(s.fontType).parse(e);
      this.fontData = {
        header: s,
        content: i
      };
    } else
      this.fontData = t;
    this.shapeParser = new mm(this.fontData);
  }
  /**
   * Return true if this font contains glyph of the specified character. Otherwise, return false.
   * @param char - The character to check
   * @returns True if this font contains glyph of the specified character. Otherwise, return false.
   */
  hasChar(t) {
    return this.fontData.content.data[t] !== void 0;
  }
  /**
   * Return true if this font contains a shape with the specified name. Otherwise, return false.
   * Shape names are matched case-insensitively.
   * @param name - The shape name to check (for example, "GRS")
   * @returns True if this font contains the named shape. Otherwise, return false.
   */
  hasShape(t) {
    return this.getShapeCode(t) !== void 0;
  }
  /**
   * Gets the character code for a named shape.
   * @param name - The shape name to look up
   * @returns The character code, or undefined if the shape is not found
   */
  getShapeCode(t) {
    const e = this.fontData.content.names;
    if (e)
      return e[t.toUpperCase()];
  }
  /**
   * Gets the shape name for a character code, if one is defined.
   * @param code - The character code to look up
   * @returns The shape name, or undefined if the code has no name
   */
  getShapeName(t) {
    const e = this.fontData.content.names;
    if (e) {
      for (const [s, i] of Object.entries(e))
        if (i === t)
          return s;
    }
  }
  /**
   * Gets the shape data for a named shape at a given font size.
   * Shape names are matched case-insensitively.
   * @param name - The shape name to get the shape for
   * @param size - The desired font size
   * @returns The shape data for the named shape, or undefined if it is not found in the font
   */
  getShapeByName(t, e) {
    const s = this.getShapeCode(t);
    if (s !== void 0)
      return this.getCharShape(s, e);
  }
  /**
   * Gets the shape data for a specific character at a given font size.
   * @param code - The character code to get the shape for
   * @param size - The desired font size
   * @returns The shape data for the character, or undefined if the character is not found in the font
   */
  getCharShape(t, e) {
    let s = this.shapeParser.getCharShape(t, e);
    return s && this.fontData.header.fontType === Ct.BIGFONT && s.bbox.minY <= e * 0.5 && (s = s.normalizeToOrigin()), s;
  }
  /**
   * Releases resources used by the font.
   * This should be called when the font is no longer needed to free up memory.
   */
  release() {
    this.shapeParser.release();
  }
}
function xm(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function bm(n) {
  if (n.__esModule) return n;
  var t = n.default;
  if (typeof t == "function") {
    var e = function s() {
      return this instanceof s ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(n).forEach(function(s) {
    var i = Object.getOwnPropertyDescriptor(n, s);
    Object.defineProperty(e, s, i.get ? i : {
      enumerable: !0,
      get: function() {
        return n[s];
      }
    });
  }), e;
}
var pl = { exports: {} }, Sa = {}, Pi = {};
Pi.byteLength = wm;
Pi.toByteArray = Tm;
Pi.fromByteArray = Fm;
var me = [], Zt = [], vm = typeof Uint8Array < "u" ? Uint8Array : Array, Ar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var _n = 0, Sm = Ar.length; _n < Sm; ++_n)
  me[_n] = Ar[_n], Zt[Ar.charCodeAt(_n)] = _n;
Zt[45] = 62;
Zt[95] = 63;
function dl(n) {
  var t = n.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var e = n.indexOf("=");
  e === -1 && (e = t);
  var s = e === t ? 0 : 4 - e % 4;
  return [e, s];
}
function wm(n) {
  var t = dl(n), e = t[0], s = t[1];
  return (e + s) * 3 / 4 - s;
}
function Cm(n, t, e) {
  return (t + e) * 3 / 4 - e;
}
function Tm(n) {
  var t, e = dl(n), s = e[0], i = e[1], r = new vm(Cm(n, s, i)), a = 0, o = i > 0 ? s - 4 : s, c;
  for (c = 0; c < o; c += 4)
    t = Zt[n.charCodeAt(c)] << 18 | Zt[n.charCodeAt(c + 1)] << 12 | Zt[n.charCodeAt(c + 2)] << 6 | Zt[n.charCodeAt(c + 3)], r[a++] = t >> 16 & 255, r[a++] = t >> 8 & 255, r[a++] = t & 255;
  return i === 2 && (t = Zt[n.charCodeAt(c)] << 2 | Zt[n.charCodeAt(c + 1)] >> 4, r[a++] = t & 255), i === 1 && (t = Zt[n.charCodeAt(c)] << 10 | Zt[n.charCodeAt(c + 1)] << 4 | Zt[n.charCodeAt(c + 2)] >> 2, r[a++] = t >> 8 & 255, r[a++] = t & 255), r;
}
function km(n) {
  return me[n >> 18 & 63] + me[n >> 12 & 63] + me[n >> 6 & 63] + me[n & 63];
}
function Am(n, t, e) {
  for (var s, i = [], r = t; r < e; r += 3)
    s = (n[r] << 16 & 16711680) + (n[r + 1] << 8 & 65280) + (n[r + 2] & 255), i.push(km(s));
  return i.join("");
}
function Fm(n) {
  for (var t, e = n.length, s = e % 3, i = [], r = 16383, a = 0, o = e - s; a < o; a += r)
    i.push(Am(n, a, a + r > o ? o : a + r));
  return s === 1 ? (t = n[e - 1], i.push(
    me[t >> 2] + me[t << 4 & 63] + "=="
  )) : s === 2 && (t = (n[e - 2] << 8) + n[e - 1], i.push(
    me[t >> 10] + me[t >> 4 & 63] + me[t << 2 & 63] + "="
  )), i.join("");
}
var wa = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
wa.read = function(n, t, e, s, i) {
  var r, a, o = i * 8 - s - 1, c = (1 << o) - 1, h = c >> 1, l = -7, u = e ? i - 1 : 0, f = e ? -1 : 1, p = n[t + u];
  for (u += f, r = p & (1 << -l) - 1, p >>= -l, l += o; l > 0; r = r * 256 + n[t + u], u += f, l -= 8)
    ;
  for (a = r & (1 << -l) - 1, r >>= -l, l += s; l > 0; a = a * 256 + n[t + u], u += f, l -= 8)
    ;
  if (r === 0)
    r = 1 - h;
  else {
    if (r === c)
      return a ? NaN : (p ? -1 : 1) * (1 / 0);
    a = a + Math.pow(2, s), r = r - h;
  }
  return (p ? -1 : 1) * a * Math.pow(2, r - s);
};
wa.write = function(n, t, e, s, i, r) {
  var a, o, c, h = r * 8 - i - 1, l = (1 << h) - 1, u = l >> 1, f = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = s ? 0 : r - 1, d = s ? 1 : -1, g = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, a = l) : (a = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -a)) < 1 && (a--, c *= 2), a + u >= 1 ? t += f / c : t += f * Math.pow(2, 1 - u), t * c >= 2 && (a++, c /= 2), a + u >= l ? (o = 0, a = l) : a + u >= 1 ? (o = (t * c - 1) * Math.pow(2, i), a = a + u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, i), a = 0)); i >= 8; n[e + p] = o & 255, p += d, o /= 256, i -= 8)
    ;
  for (a = a << i | o, h += i; h > 0; n[e + p] = a & 255, p += d, a /= 256, h -= 8)
    ;
  n[e + p - d] |= g * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(n) {
  var t = Pi, e = wa, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = o, n.SlowBuffer = v, n.INSPECT_MAX_BYTES = 50;
  var i = 2147483647;
  n.kMaxLength = i, o.TYPED_ARRAY_SUPPORT = r(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function r() {
    try {
      var C = new Uint8Array(1), m = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(m, Uint8Array.prototype), Object.setPrototypeOf(C, m), C.foo() === 42;
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
  function a(C) {
    if (C > i)
      throw new RangeError('The value "' + C + '" is invalid for option "size"');
    var m = new Uint8Array(C);
    return Object.setPrototypeOf(m, o.prototype), m;
  }
  function o(C, m, y) {
    if (typeof C == "number") {
      if (typeof m == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return u(C);
    }
    return c(C, m, y);
  }
  o.poolSize = 8192;
  function c(C, m, y) {
    if (typeof C == "string")
      return f(C, m);
    if (ArrayBuffer.isView(C))
      return d(C);
    if (C == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof C
      );
    if (Gt(C, ArrayBuffer) || C && Gt(C.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Gt(C, SharedArrayBuffer) || C && Gt(C.buffer, SharedArrayBuffer)))
      return g(C, m, y);
    if (typeof C == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    var T = C.valueOf && C.valueOf();
    if (T != null && T !== C)
      return o.from(T, m, y);
    var F = x(C);
    if (F) return F;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof C[Symbol.toPrimitive] == "function")
      return o.from(
        C[Symbol.toPrimitive]("string"),
        m,
        y
      );
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof C
    );
  }
  o.from = function(C, m, y) {
    return c(C, m, y);
  }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
  function h(C) {
    if (typeof C != "number")
      throw new TypeError('"size" argument must be of type number');
    if (C < 0)
      throw new RangeError('The value "' + C + '" is invalid for option "size"');
  }
  function l(C, m, y) {
    return h(C), C <= 0 ? a(C) : m !== void 0 ? typeof y == "string" ? a(C).fill(m, y) : a(C).fill(m) : a(C);
  }
  o.alloc = function(C, m, y) {
    return l(C, m, y);
  };
  function u(C) {
    return h(C), a(C < 0 ? 0 : b(C) | 0);
  }
  o.allocUnsafe = function(C) {
    return u(C);
  }, o.allocUnsafeSlow = function(C) {
    return u(C);
  };
  function f(C, m) {
    if ((typeof m != "string" || m === "") && (m = "utf8"), !o.isEncoding(m))
      throw new TypeError("Unknown encoding: " + m);
    var y = S(C, m) | 0, T = a(y), F = T.write(C, m);
    return F !== y && (T = T.slice(0, F)), T;
  }
  function p(C) {
    for (var m = C.length < 0 ? 0 : b(C.length) | 0, y = a(m), T = 0; T < m; T += 1)
      y[T] = C[T] & 255;
    return y;
  }
  function d(C) {
    if (Gt(C, Uint8Array)) {
      var m = new Uint8Array(C);
      return g(m.buffer, m.byteOffset, m.byteLength);
    }
    return p(C);
  }
  function g(C, m, y) {
    if (m < 0 || C.byteLength < m)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (C.byteLength < m + (y || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    var T;
    return m === void 0 && y === void 0 ? T = new Uint8Array(C) : y === void 0 ? T = new Uint8Array(C, m) : T = new Uint8Array(C, m, y), Object.setPrototypeOf(T, o.prototype), T;
  }
  function x(C) {
    if (o.isBuffer(C)) {
      var m = b(C.length) | 0, y = a(m);
      return y.length === 0 || C.copy(y, 0, 0, m), y;
    }
    if (C.length !== void 0)
      return typeof C.length != "number" || At(C.length) ? a(0) : p(C);
    if (C.type === "Buffer" && Array.isArray(C.data))
      return p(C.data);
  }
  function b(C) {
    if (C >= i)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return C | 0;
  }
  function v(C) {
    return +C != C && (C = 0), o.alloc(+C);
  }
  o.isBuffer = function(m) {
    return m != null && m._isBuffer === !0 && m !== o.prototype;
  }, o.compare = function(m, y) {
    if (Gt(m, Uint8Array) && (m = o.from(m, m.offset, m.byteLength)), Gt(y, Uint8Array) && (y = o.from(y, y.offset, y.byteLength)), !o.isBuffer(m) || !o.isBuffer(y))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (m === y) return 0;
    for (var T = m.length, F = y.length, _ = 0, R = Math.min(T, F); _ < R; ++_)
      if (m[_] !== y[_]) {
        T = m[_], F = y[_];
        break;
      }
    return T < F ? -1 : F < T ? 1 : 0;
  }, o.isEncoding = function(m) {
    switch (String(m).toLowerCase()) {
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
  }, o.concat = function(m, y) {
    if (!Array.isArray(m))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (m.length === 0)
      return o.alloc(0);
    var T;
    if (y === void 0)
      for (y = 0, T = 0; T < m.length; ++T)
        y += m[T].length;
    var F = o.allocUnsafe(y), _ = 0;
    for (T = 0; T < m.length; ++T) {
      var R = m[T];
      if (Gt(R, Uint8Array))
        _ + R.length > F.length ? o.from(R).copy(F, _) : Uint8Array.prototype.set.call(
          F,
          R,
          _
        );
      else if (o.isBuffer(R))
        R.copy(F, _);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      _ += R.length;
    }
    return F;
  };
  function S(C, m) {
    if (o.isBuffer(C))
      return C.length;
    if (ArrayBuffer.isView(C) || Gt(C, ArrayBuffer))
      return C.byteLength;
    if (typeof C != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof C
      );
    var y = C.length, T = arguments.length > 2 && arguments[2] === !0;
    if (!T && y === 0) return 0;
    for (var F = !1; ; )
      switch (m) {
        case "ascii":
        case "latin1":
        case "binary":
          return y;
        case "utf8":
        case "utf-8":
          return tt(C).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return y * 2;
        case "hex":
          return y >>> 1;
        case "base64":
          return Pt(C).length;
        default:
          if (F)
            return T ? -1 : tt(C).length;
          m = ("" + m).toLowerCase(), F = !0;
      }
  }
  o.byteLength = S;
  function w(C, m, y) {
    var T = !1;
    if ((m === void 0 || m < 0) && (m = 0), m > this.length || ((y === void 0 || y > this.length) && (y = this.length), y <= 0) || (y >>>= 0, m >>>= 0, y <= m))
      return "";
    for (C || (C = "utf8"); ; )
      switch (C) {
        case "hex":
          return St(this, m, y);
        case "utf8":
        case "utf-8":
          return U(this, m, y);
        case "ascii":
          return gt(this, m, y);
        case "latin1":
        case "binary":
          return Dt(this, m, y);
        case "base64":
          return B(this, m, y);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return it(this, m, y);
        default:
          if (T) throw new TypeError("Unknown encoding: " + C);
          C = (C + "").toLowerCase(), T = !0;
      }
  }
  o.prototype._isBuffer = !0;
  function k(C, m, y) {
    var T = C[m];
    C[m] = C[y], C[y] = T;
  }
  o.prototype.swap16 = function() {
    var m = this.length;
    if (m % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var y = 0; y < m; y += 2)
      k(this, y, y + 1);
    return this;
  }, o.prototype.swap32 = function() {
    var m = this.length;
    if (m % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var y = 0; y < m; y += 4)
      k(this, y, y + 3), k(this, y + 1, y + 2);
    return this;
  }, o.prototype.swap64 = function() {
    var m = this.length;
    if (m % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var y = 0; y < m; y += 8)
      k(this, y, y + 7), k(this, y + 1, y + 6), k(this, y + 2, y + 5), k(this, y + 3, y + 4);
    return this;
  }, o.prototype.toString = function() {
    var m = this.length;
    return m === 0 ? "" : arguments.length === 0 ? U(this, 0, m) : w.apply(this, arguments);
  }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(m) {
    if (!o.isBuffer(m)) throw new TypeError("Argument must be a Buffer");
    return this === m ? !0 : o.compare(this, m) === 0;
  }, o.prototype.inspect = function() {
    var m = "", y = n.INSPECT_MAX_BYTES;
    return m = this.toString("hex", 0, y).replace(/(.{2})/g, "$1 ").trim(), this.length > y && (m += " ... "), "<Buffer " + m + ">";
  }, s && (o.prototype[s] = o.prototype.inspect), o.prototype.compare = function(m, y, T, F, _) {
    if (Gt(m, Uint8Array) && (m = o.from(m, m.offset, m.byteLength)), !o.isBuffer(m))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof m
      );
    if (y === void 0 && (y = 0), T === void 0 && (T = m ? m.length : 0), F === void 0 && (F = 0), _ === void 0 && (_ = this.length), y < 0 || T > m.length || F < 0 || _ > this.length)
      throw new RangeError("out of range index");
    if (F >= _ && y >= T)
      return 0;
    if (F >= _)
      return -1;
    if (y >= T)
      return 1;
    if (y >>>= 0, T >>>= 0, F >>>= 0, _ >>>= 0, this === m) return 0;
    for (var R = _ - F, Y = T - y, X = Math.min(R, Y), at = this.slice(F, _), Ft = m.slice(y, T), ut = 0; ut < X; ++ut)
      if (at[ut] !== Ft[ut]) {
        R = at[ut], Y = Ft[ut];
        break;
      }
    return R < Y ? -1 : Y < R ? 1 : 0;
  };
  function M(C, m, y, T, F) {
    if (C.length === 0) return -1;
    if (typeof y == "string" ? (T = y, y = 0) : y > 2147483647 ? y = 2147483647 : y < -2147483648 && (y = -2147483648), y = +y, At(y) && (y = F ? 0 : C.length - 1), y < 0 && (y = C.length + y), y >= C.length) {
      if (F) return -1;
      y = C.length - 1;
    } else if (y < 0)
      if (F) y = 0;
      else return -1;
    if (typeof m == "string" && (m = o.from(m, T)), o.isBuffer(m))
      return m.length === 0 ? -1 : O(C, m, y, T, F);
    if (typeof m == "number")
      return m = m & 255, typeof Uint8Array.prototype.indexOf == "function" ? F ? Uint8Array.prototype.indexOf.call(C, m, y) : Uint8Array.prototype.lastIndexOf.call(C, m, y) : O(C, [m], y, T, F);
    throw new TypeError("val must be string, number or Buffer");
  }
  function O(C, m, y, T, F) {
    var _ = 1, R = C.length, Y = m.length;
    if (T !== void 0 && (T = String(T).toLowerCase(), T === "ucs2" || T === "ucs-2" || T === "utf16le" || T === "utf-16le")) {
      if (C.length < 2 || m.length < 2)
        return -1;
      _ = 2, R /= 2, Y /= 2, y /= 2;
    }
    function X(Ea, Ma) {
      return _ === 1 ? Ea[Ma] : Ea.readUInt16BE(Ma * _);
    }
    var at;
    if (F) {
      var Ft = -1;
      for (at = y; at < R; at++)
        if (X(C, at) === X(m, Ft === -1 ? 0 : at - Ft)) {
          if (Ft === -1 && (Ft = at), at - Ft + 1 === Y) return Ft * _;
        } else
          Ft !== -1 && (at -= at - Ft), Ft = -1;
    } else
      for (y + Y > R && (y = R - Y), at = y; at >= 0; at--) {
        for (var ut = !0, ks = 0; ks < Y; ks++)
          if (X(C, at + ks) !== X(m, ks)) {
            ut = !1;
            break;
          }
        if (ut) return at;
      }
    return -1;
  }
  o.prototype.includes = function(m, y, T) {
    return this.indexOf(m, y, T) !== -1;
  }, o.prototype.indexOf = function(m, y, T) {
    return M(this, m, y, T, !0);
  }, o.prototype.lastIndexOf = function(m, y, T) {
    return M(this, m, y, T, !1);
  };
  function I(C, m, y, T) {
    y = Number(y) || 0;
    var F = C.length - y;
    T ? (T = Number(T), T > F && (T = F)) : T = F;
    var _ = m.length;
    T > _ / 2 && (T = _ / 2);
    for (var R = 0; R < T; ++R) {
      var Y = parseInt(m.substr(R * 2, 2), 16);
      if (At(Y)) return R;
      C[y + R] = Y;
    }
    return R;
  }
  function V(C, m, y, T) {
    return zt(tt(m, C.length - y), C, y, T);
  }
  function D(C, m, y, T) {
    return zt(kt(m), C, y, T);
  }
  function W(C, m, y, T) {
    return zt(Pt(m), C, y, T);
  }
  function J(C, m, y, T) {
    return zt(Ut(m, C.length - y), C, y, T);
  }
  o.prototype.write = function(m, y, T, F) {
    if (y === void 0)
      F = "utf8", T = this.length, y = 0;
    else if (T === void 0 && typeof y == "string")
      F = y, T = this.length, y = 0;
    else if (isFinite(y))
      y = y >>> 0, isFinite(T) ? (T = T >>> 0, F === void 0 && (F = "utf8")) : (F = T, T = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    var _ = this.length - y;
    if ((T === void 0 || T > _) && (T = _), m.length > 0 && (T < 0 || y < 0) || y > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    F || (F = "utf8");
    for (var R = !1; ; )
      switch (F) {
        case "hex":
          return I(this, m, y, T);
        case "utf8":
        case "utf-8":
          return V(this, m, y, T);
        case "ascii":
        case "latin1":
        case "binary":
          return D(this, m, y, T);
        case "base64":
          return W(this, m, y, T);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return J(this, m, y, T);
        default:
          if (R) throw new TypeError("Unknown encoding: " + F);
          F = ("" + F).toLowerCase(), R = !0;
      }
  }, o.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function B(C, m, y) {
    return m === 0 && y === C.length ? t.fromByteArray(C) : t.fromByteArray(C.slice(m, y));
  }
  function U(C, m, y) {
    y = Math.min(C.length, y);
    for (var T = [], F = m; F < y; ) {
      var _ = C[F], R = null, Y = _ > 239 ? 4 : _ > 223 ? 3 : _ > 191 ? 2 : 1;
      if (F + Y <= y) {
        var X, at, Ft, ut;
        switch (Y) {
          case 1:
            _ < 128 && (R = _);
            break;
          case 2:
            X = C[F + 1], (X & 192) === 128 && (ut = (_ & 31) << 6 | X & 63, ut > 127 && (R = ut));
            break;
          case 3:
            X = C[F + 1], at = C[F + 2], (X & 192) === 128 && (at & 192) === 128 && (ut = (_ & 15) << 12 | (X & 63) << 6 | at & 63, ut > 2047 && (ut < 55296 || ut > 57343) && (R = ut));
            break;
          case 4:
            X = C[F + 1], at = C[F + 2], Ft = C[F + 3], (X & 192) === 128 && (at & 192) === 128 && (Ft & 192) === 128 && (ut = (_ & 15) << 18 | (X & 63) << 12 | (at & 63) << 6 | Ft & 63, ut > 65535 && ut < 1114112 && (R = ut));
        }
      }
      R === null ? (R = 65533, Y = 1) : R > 65535 && (R -= 65536, T.push(R >>> 10 & 1023 | 55296), R = 56320 | R & 1023), T.push(R), F += Y;
    }
    return Q(T);
  }
  var P = 4096;
  function Q(C) {
    var m = C.length;
    if (m <= P)
      return String.fromCharCode.apply(String, C);
    for (var y = "", T = 0; T < m; )
      y += String.fromCharCode.apply(
        String,
        C.slice(T, T += P)
      );
    return y;
  }
  function gt(C, m, y) {
    var T = "";
    y = Math.min(C.length, y);
    for (var F = m; F < y; ++F)
      T += String.fromCharCode(C[F] & 127);
    return T;
  }
  function Dt(C, m, y) {
    var T = "";
    y = Math.min(C.length, y);
    for (var F = m; F < y; ++F)
      T += String.fromCharCode(C[F]);
    return T;
  }
  function St(C, m, y) {
    var T = C.length;
    (!m || m < 0) && (m = 0), (!y || y < 0 || y > T) && (y = T);
    for (var F = "", _ = m; _ < y; ++_)
      F += Se[C[_]];
    return F;
  }
  function it(C, m, y) {
    for (var T = C.slice(m, y), F = "", _ = 0; _ < T.length - 1; _ += 2)
      F += String.fromCharCode(T[_] + T[_ + 1] * 256);
    return F;
  }
  o.prototype.slice = function(m, y) {
    var T = this.length;
    m = ~~m, y = y === void 0 ? T : ~~y, m < 0 ? (m += T, m < 0 && (m = 0)) : m > T && (m = T), y < 0 ? (y += T, y < 0 && (y = 0)) : y > T && (y = T), y < m && (y = m);
    var F = this.subarray(m, y);
    return Object.setPrototypeOf(F, o.prototype), F;
  };
  function j(C, m, y) {
    if (C % 1 !== 0 || C < 0) throw new RangeError("offset is not uint");
    if (C + m > y) throw new RangeError("Trying to access beyond buffer length");
  }
  o.prototype.readUintLE = o.prototype.readUIntLE = function(m, y, T) {
    m = m >>> 0, y = y >>> 0, T || j(m, y, this.length);
    for (var F = this[m], _ = 1, R = 0; ++R < y && (_ *= 256); )
      F += this[m + R] * _;
    return F;
  }, o.prototype.readUintBE = o.prototype.readUIntBE = function(m, y, T) {
    m = m >>> 0, y = y >>> 0, T || j(m, y, this.length);
    for (var F = this[m + --y], _ = 1; y > 0 && (_ *= 256); )
      F += this[m + --y] * _;
    return F;
  }, o.prototype.readUint8 = o.prototype.readUInt8 = function(m, y) {
    return m = m >>> 0, y || j(m, 1, this.length), this[m];
  }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(m, y) {
    return m = m >>> 0, y || j(m, 2, this.length), this[m] | this[m + 1] << 8;
  }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(m, y) {
    return m = m >>> 0, y || j(m, 2, this.length), this[m] << 8 | this[m + 1];
  }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(m, y) {
    return m = m >>> 0, y || j(m, 4, this.length), (this[m] | this[m + 1] << 8 | this[m + 2] << 16) + this[m + 3] * 16777216;
  }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(m, y) {
    return m = m >>> 0, y || j(m, 4, this.length), this[m] * 16777216 + (this[m + 1] << 16 | this[m + 2] << 8 | this[m + 3]);
  }, o.prototype.readIntLE = function(m, y, T) {
    m = m >>> 0, y = y >>> 0, T || j(m, y, this.length);
    for (var F = this[m], _ = 1, R = 0; ++R < y && (_ *= 256); )
      F += this[m + R] * _;
    return _ *= 128, F >= _ && (F -= Math.pow(2, 8 * y)), F;
  }, o.prototype.readIntBE = function(m, y, T) {
    m = m >>> 0, y = y >>> 0, T || j(m, y, this.length);
    for (var F = y, _ = 1, R = this[m + --F]; F > 0 && (_ *= 256); )
      R += this[m + --F] * _;
    return _ *= 128, R >= _ && (R -= Math.pow(2, 8 * y)), R;
  }, o.prototype.readInt8 = function(m, y) {
    return m = m >>> 0, y || j(m, 1, this.length), this[m] & 128 ? (255 - this[m] + 1) * -1 : this[m];
  }, o.prototype.readInt16LE = function(m, y) {
    m = m >>> 0, y || j(m, 2, this.length);
    var T = this[m] | this[m + 1] << 8;
    return T & 32768 ? T | 4294901760 : T;
  }, o.prototype.readInt16BE = function(m, y) {
    m = m >>> 0, y || j(m, 2, this.length);
    var T = this[m + 1] | this[m] << 8;
    return T & 32768 ? T | 4294901760 : T;
  }, o.prototype.readInt32LE = function(m, y) {
    return m = m >>> 0, y || j(m, 4, this.length), this[m] | this[m + 1] << 8 | this[m + 2] << 16 | this[m + 3] << 24;
  }, o.prototype.readInt32BE = function(m, y) {
    return m = m >>> 0, y || j(m, 4, this.length), this[m] << 24 | this[m + 1] << 16 | this[m + 2] << 8 | this[m + 3];
  }, o.prototype.readFloatLE = function(m, y) {
    return m = m >>> 0, y || j(m, 4, this.length), e.read(this, m, !0, 23, 4);
  }, o.prototype.readFloatBE = function(m, y) {
    return m = m >>> 0, y || j(m, 4, this.length), e.read(this, m, !1, 23, 4);
  }, o.prototype.readDoubleLE = function(m, y) {
    return m = m >>> 0, y || j(m, 8, this.length), e.read(this, m, !0, 52, 8);
  }, o.prototype.readDoubleBE = function(m, y) {
    return m = m >>> 0, y || j(m, 8, this.length), e.read(this, m, !1, 52, 8);
  };
  function st(C, m, y, T, F, _) {
    if (!o.isBuffer(C)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (m > F || m < _) throw new RangeError('"value" argument is out of bounds');
    if (y + T > C.length) throw new RangeError("Index out of range");
  }
  o.prototype.writeUintLE = o.prototype.writeUIntLE = function(m, y, T, F) {
    if (m = +m, y = y >>> 0, T = T >>> 0, !F) {
      var _ = Math.pow(2, 8 * T) - 1;
      st(this, m, y, T, _, 0);
    }
    var R = 1, Y = 0;
    for (this[y] = m & 255; ++Y < T && (R *= 256); )
      this[y + Y] = m / R & 255;
    return y + T;
  }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(m, y, T, F) {
    if (m = +m, y = y >>> 0, T = T >>> 0, !F) {
      var _ = Math.pow(2, 8 * T) - 1;
      st(this, m, y, T, _, 0);
    }
    var R = T - 1, Y = 1;
    for (this[y + R] = m & 255; --R >= 0 && (Y *= 256); )
      this[y + R] = m / Y & 255;
    return y + T;
  }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 1, 255, 0), this[y] = m & 255, y + 1;
  }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 2, 65535, 0), this[y] = m & 255, this[y + 1] = m >>> 8, y + 2;
  }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 2, 65535, 0), this[y] = m >>> 8, this[y + 1] = m & 255, y + 2;
  }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 4, 4294967295, 0), this[y + 3] = m >>> 24, this[y + 2] = m >>> 16, this[y + 1] = m >>> 8, this[y] = m & 255, y + 4;
  }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 4, 4294967295, 0), this[y] = m >>> 24, this[y + 1] = m >>> 16, this[y + 2] = m >>> 8, this[y + 3] = m & 255, y + 4;
  }, o.prototype.writeIntLE = function(m, y, T, F) {
    if (m = +m, y = y >>> 0, !F) {
      var _ = Math.pow(2, 8 * T - 1);
      st(this, m, y, T, _ - 1, -_);
    }
    var R = 0, Y = 1, X = 0;
    for (this[y] = m & 255; ++R < T && (Y *= 256); )
      m < 0 && X === 0 && this[y + R - 1] !== 0 && (X = 1), this[y + R] = (m / Y >> 0) - X & 255;
    return y + T;
  }, o.prototype.writeIntBE = function(m, y, T, F) {
    if (m = +m, y = y >>> 0, !F) {
      var _ = Math.pow(2, 8 * T - 1);
      st(this, m, y, T, _ - 1, -_);
    }
    var R = T - 1, Y = 1, X = 0;
    for (this[y + R] = m & 255; --R >= 0 && (Y *= 256); )
      m < 0 && X === 0 && this[y + R + 1] !== 0 && (X = 1), this[y + R] = (m / Y >> 0) - X & 255;
    return y + T;
  }, o.prototype.writeInt8 = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 1, 127, -128), m < 0 && (m = 255 + m + 1), this[y] = m & 255, y + 1;
  }, o.prototype.writeInt16LE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 2, 32767, -32768), this[y] = m & 255, this[y + 1] = m >>> 8, y + 2;
  }, o.prototype.writeInt16BE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 2, 32767, -32768), this[y] = m >>> 8, this[y + 1] = m & 255, y + 2;
  }, o.prototype.writeInt32LE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 4, 2147483647, -2147483648), this[y] = m & 255, this[y + 1] = m >>> 8, this[y + 2] = m >>> 16, this[y + 3] = m >>> 24, y + 4;
  }, o.prototype.writeInt32BE = function(m, y, T) {
    return m = +m, y = y >>> 0, T || st(this, m, y, 4, 2147483647, -2147483648), m < 0 && (m = 4294967295 + m + 1), this[y] = m >>> 24, this[y + 1] = m >>> 16, this[y + 2] = m >>> 8, this[y + 3] = m & 255, y + 4;
  };
  function yt(C, m, y, T, F, _) {
    if (y + T > C.length) throw new RangeError("Index out of range");
    if (y < 0) throw new RangeError("Index out of range");
  }
  function Tt(C, m, y, T, F) {
    return m = +m, y = y >>> 0, F || yt(C, m, y, 4), e.write(C, m, y, T, 23, 4), y + 4;
  }
  o.prototype.writeFloatLE = function(m, y, T) {
    return Tt(this, m, y, !0, T);
  }, o.prototype.writeFloatBE = function(m, y, T) {
    return Tt(this, m, y, !1, T);
  };
  function bt(C, m, y, T, F) {
    return m = +m, y = y >>> 0, F || yt(C, m, y, 8), e.write(C, m, y, T, 52, 8), y + 8;
  }
  o.prototype.writeDoubleLE = function(m, y, T) {
    return bt(this, m, y, !0, T);
  }, o.prototype.writeDoubleBE = function(m, y, T) {
    return bt(this, m, y, !1, T);
  }, o.prototype.copy = function(m, y, T, F) {
    if (!o.isBuffer(m)) throw new TypeError("argument should be a Buffer");
    if (T || (T = 0), !F && F !== 0 && (F = this.length), y >= m.length && (y = m.length), y || (y = 0), F > 0 && F < T && (F = T), F === T || m.length === 0 || this.length === 0) return 0;
    if (y < 0)
      throw new RangeError("targetStart out of bounds");
    if (T < 0 || T >= this.length) throw new RangeError("Index out of range");
    if (F < 0) throw new RangeError("sourceEnd out of bounds");
    F > this.length && (F = this.length), m.length - y < F - T && (F = m.length - y + T);
    var _ = F - T;
    return this === m && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(y, T, F) : Uint8Array.prototype.set.call(
      m,
      this.subarray(T, F),
      y
    ), _;
  }, o.prototype.fill = function(m, y, T, F) {
    if (typeof m == "string") {
      if (typeof y == "string" ? (F = y, y = 0, T = this.length) : typeof T == "string" && (F = T, T = this.length), F !== void 0 && typeof F != "string")
        throw new TypeError("encoding must be a string");
      if (typeof F == "string" && !o.isEncoding(F))
        throw new TypeError("Unknown encoding: " + F);
      if (m.length === 1) {
        var _ = m.charCodeAt(0);
        (F === "utf8" && _ < 128 || F === "latin1") && (m = _);
      }
    } else typeof m == "number" ? m = m & 255 : typeof m == "boolean" && (m = Number(m));
    if (y < 0 || this.length < y || this.length < T)
      throw new RangeError("Out of range index");
    if (T <= y)
      return this;
    y = y >>> 0, T = T === void 0 ? this.length : T >>> 0, m || (m = 0);
    var R;
    if (typeof m == "number")
      for (R = y; R < T; ++R)
        this[R] = m;
    else {
      var Y = o.isBuffer(m) ? m : o.from(m, F), X = Y.length;
      if (X === 0)
        throw new TypeError('The value "' + m + '" is invalid for argument "value"');
      for (R = 0; R < T - y; ++R)
        this[R + y] = Y[R % X];
    }
    return this;
  };
  var wt = /[^+/0-9A-Za-z-_]/g;
  function ct(C) {
    if (C = C.split("=")[0], C = C.trim().replace(wt, ""), C.length < 2) return "";
    for (; C.length % 4 !== 0; )
      C = C + "=";
    return C;
  }
  function tt(C, m) {
    m = m || 1 / 0;
    for (var y, T = C.length, F = null, _ = [], R = 0; R < T; ++R) {
      if (y = C.charCodeAt(R), y > 55295 && y < 57344) {
        if (!F) {
          if (y > 56319) {
            (m -= 3) > -1 && _.push(239, 191, 189);
            continue;
          } else if (R + 1 === T) {
            (m -= 3) > -1 && _.push(239, 191, 189);
            continue;
          }
          F = y;
          continue;
        }
        if (y < 56320) {
          (m -= 3) > -1 && _.push(239, 191, 189), F = y;
          continue;
        }
        y = (F - 55296 << 10 | y - 56320) + 65536;
      } else F && (m -= 3) > -1 && _.push(239, 191, 189);
      if (F = null, y < 128) {
        if ((m -= 1) < 0) break;
        _.push(y);
      } else if (y < 2048) {
        if ((m -= 2) < 0) break;
        _.push(
          y >> 6 | 192,
          y & 63 | 128
        );
      } else if (y < 65536) {
        if ((m -= 3) < 0) break;
        _.push(
          y >> 12 | 224,
          y >> 6 & 63 | 128,
          y & 63 | 128
        );
      } else if (y < 1114112) {
        if ((m -= 4) < 0) break;
        _.push(
          y >> 18 | 240,
          y >> 12 & 63 | 128,
          y >> 6 & 63 | 128,
          y & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return _;
  }
  function kt(C) {
    for (var m = [], y = 0; y < C.length; ++y)
      m.push(C.charCodeAt(y) & 255);
    return m;
  }
  function Ut(C, m) {
    for (var y, T, F, _ = [], R = 0; R < C.length && !((m -= 2) < 0); ++R)
      y = C.charCodeAt(R), T = y >> 8, F = y % 256, _.push(F), _.push(T);
    return _;
  }
  function Pt(C) {
    return t.toByteArray(ct(C));
  }
  function zt(C, m, y, T) {
    for (var F = 0; F < T && !(F + y >= m.length || F >= C.length); ++F)
      m[F + y] = C[F];
    return F;
  }
  function Gt(C, m) {
    return C instanceof m || C != null && C.constructor != null && C.constructor.name != null && C.constructor.name === m.name;
  }
  function At(C) {
    return C !== C;
  }
  var Se = function() {
    for (var C = "0123456789abcdef", m = new Array(256), y = 0; y < 16; ++y)
      for (var T = y * 16, F = 0; F < 16; ++F)
        m[T + F] = C[y] + C[F];
    return m;
  }();
})(Sa);
var ci = Sa, Dn = ci.Buffer, Jt = {}, Kt;
for (Kt in ci)
  ci.hasOwnProperty(Kt) && (Kt === "SlowBuffer" || Kt === "Buffer" || (Jt[Kt] = ci[Kt]));
var Un = Jt.Buffer = {};
for (Kt in Dn)
  Dn.hasOwnProperty(Kt) && (Kt === "allocUnsafe" || Kt === "allocUnsafeSlow" || (Un[Kt] = Dn[Kt]));
Jt.Buffer.prototype = Dn.prototype;
(!Un.from || Un.from === Uint8Array.from) && (Un.from = function(n, t, e) {
  if (typeof n == "number")
    throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof n);
  if (n && typeof n.length > "u")
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof n);
  return Dn(n, t, e);
});
Un.alloc || (Un.alloc = function(n, t, e) {
  if (typeof n != "number")
    throw new TypeError('The "size" argument must be of type number. Received type ' + typeof n);
  if (n < 0 || n >= 2 * (1 << 30))
    throw new RangeError('The value "' + n + '" is invalid for option "size"');
  var s = Dn(n);
  return !t || t.length === 0 ? s.fill(0) : typeof e == "string" ? s.fill(t, e) : s.fill(t), s;
});
if (!Jt.kStringMaxLength)
  try {
    Jt.kStringMaxLength = process.binding("buffer").kStringMaxLength;
  } catch {
  }
Jt.constants || (Jt.constants = {
  MAX_LENGTH: Jt.kMaxLength
}, Jt.kStringMaxLength && (Jt.constants.MAX_STRING_LENGTH = Jt.kStringMaxLength));
var Ke = Jt, Ca = {}, gl = "\uFEFF";
Ca.PrependBOM = Ta;
function Ta(n, t) {
  this.encoder = n, this.addBOM = !0;
}
Ta.prototype.write = function(n) {
  return this.addBOM && (n = gl + n, this.addBOM = !1), this.encoder.write(n);
};
Ta.prototype.end = function() {
  return this.encoder.end();
};
Ca.StripBOM = ka;
function ka(n, t) {
  this.decoder = n, this.pass = !1, this.options = t || {};
}
ka.prototype.write = function(n) {
  var t = this.decoder.write(n);
  return this.pass || !t || (t[0] === gl && (t = t.slice(1), typeof this.options.stripBOM == "function" && this.options.stripBOM()), this.pass = !0), t;
};
ka.prototype.end = function() {
  return this.decoder.end();
};
var Em = typeof Object.hasOwn > "u" ? Function.call.bind(Object.prototype.hasOwnProperty) : Object.hasOwn;
function Mm(n, t) {
  for (var e in t)
    Em(t, e) && (n[e] = t[e]);
}
var ml = Mm, Fr = {}, Er = {}, ti = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var vc;
function Om() {
  return vc || (vc = 1, function(n, t) {
    var e = Sa, s = e.Buffer;
    function i(a, o) {
      for (var c in a)
        o[c] = a[c];
    }
    s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? n.exports = e : (i(e, t), t.Buffer = r);
    function r(a, o, c) {
      return s(a, o, c);
    }
    r.prototype = Object.create(s.prototype), i(s, r), r.from = function(a, o, c) {
      if (typeof a == "number")
        throw new TypeError("Argument must not be a number");
      return s(a, o, c);
    }, r.alloc = function(a, o, c) {
      if (typeof a != "number")
        throw new TypeError("Argument must be a number");
      var h = s(a);
      return o !== void 0 ? typeof c == "string" ? h.fill(o, c) : h.fill(o) : h.fill(0), h;
    }, r.allocUnsafe = function(a) {
      if (typeof a != "number")
        throw new TypeError("Argument must be a number");
      return s(a);
    }, r.allocUnsafeSlow = function(a) {
      if (typeof a != "number")
        throw new TypeError("Argument must be a number");
      return e.SlowBuffer(a);
    };
  }(ti, ti.exports)), ti.exports;
}
var Sc;
function _m() {
  if (Sc) return Er;
  Sc = 1;
  var n = Om().Buffer, t = n.isEncoding || function(b) {
    switch (b = "" + b, b && b.toLowerCase()) {
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
  function e(b) {
    if (!b) return "utf8";
    for (var v; ; )
      switch (b) {
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
          return b;
        default:
          if (v) return;
          b = ("" + b).toLowerCase(), v = !0;
      }
  }
  function s(b) {
    var v = e(b);
    if (typeof v != "string" && (n.isEncoding === t || !t(b))) throw new Error("Unknown encoding: " + b);
    return v || b;
  }
  Er.StringDecoder = i;
  function i(b) {
    this.encoding = s(b);
    var v;
    switch (this.encoding) {
      case "utf16le":
        this.text = u, this.end = f, v = 4;
        break;
      case "utf8":
        this.fillLast = c, v = 4;
        break;
      case "base64":
        this.text = p, this.end = d, v = 3;
        break;
      default:
        this.write = g, this.end = x;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(v);
  }
  i.prototype.write = function(b) {
    if (b.length === 0) return "";
    var v, S;
    if (this.lastNeed) {
      if (v = this.fillLast(b), v === void 0) return "";
      S = this.lastNeed, this.lastNeed = 0;
    } else
      S = 0;
    return S < b.length ? v ? v + this.text(b, S) : this.text(b, S) : v || "";
  }, i.prototype.end = l, i.prototype.text = h, i.prototype.fillLast = function(b) {
    if (this.lastNeed <= b.length)
      return b.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    b.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, b.length), this.lastNeed -= b.length;
  };
  function r(b) {
    return b <= 127 ? 0 : b >> 5 === 6 ? 2 : b >> 4 === 14 ? 3 : b >> 3 === 30 ? 4 : b >> 6 === 2 ? -1 : -2;
  }
  function a(b, v, S) {
    var w = v.length - 1;
    if (w < S) return 0;
    var k = r(v[w]);
    return k >= 0 ? (k > 0 && (b.lastNeed = k - 1), k) : --w < S || k === -2 ? 0 : (k = r(v[w]), k >= 0 ? (k > 0 && (b.lastNeed = k - 2), k) : --w < S || k === -2 ? 0 : (k = r(v[w]), k >= 0 ? (k > 0 && (k === 2 ? k = 0 : b.lastNeed = k - 3), k) : 0));
  }
  function o(b, v, S) {
    if ((v[0] & 192) !== 128)
      return b.lastNeed = 0, "�";
    if (b.lastNeed > 1 && v.length > 1) {
      if ((v[1] & 192) !== 128)
        return b.lastNeed = 1, "�";
      if (b.lastNeed > 2 && v.length > 2 && (v[2] & 192) !== 128)
        return b.lastNeed = 2, "�";
    }
  }
  function c(b) {
    var v = this.lastTotal - this.lastNeed, S = o(this, b);
    if (S !== void 0) return S;
    if (this.lastNeed <= b.length)
      return b.copy(this.lastChar, v, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    b.copy(this.lastChar, v, 0, b.length), this.lastNeed -= b.length;
  }
  function h(b, v) {
    var S = a(this, b, v);
    if (!this.lastNeed) return b.toString("utf8", v);
    this.lastTotal = S;
    var w = b.length - (S - this.lastNeed);
    return b.copy(this.lastChar, 0, w), b.toString("utf8", v, w);
  }
  function l(b) {
    var v = b && b.length ? this.write(b) : "";
    return this.lastNeed ? v + "�" : v;
  }
  function u(b, v) {
    if ((b.length - v) % 2 === 0) {
      var S = b.toString("utf16le", v);
      if (S) {
        var w = S.charCodeAt(S.length - 1);
        if (w >= 55296 && w <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = b[b.length - 2], this.lastChar[1] = b[b.length - 1], S.slice(0, -1);
      }
      return S;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = b[b.length - 1], b.toString("utf16le", v, b.length - 1);
  }
  function f(b) {
    var v = b && b.length ? this.write(b) : "";
    if (this.lastNeed) {
      var S = this.lastTotal - this.lastNeed;
      return v + this.lastChar.toString("utf16le", 0, S);
    }
    return v;
  }
  function p(b, v) {
    var S = (b.length - v) % 3;
    return S === 0 ? b.toString("base64", v) : (this.lastNeed = 3 - S, this.lastTotal = 3, S === 1 ? this.lastChar[0] = b[b.length - 1] : (this.lastChar[0] = b[b.length - 2], this.lastChar[1] = b[b.length - 1]), b.toString("base64", v, b.length - S));
  }
  function d(b) {
    var v = b && b.length ? this.write(b) : "";
    return this.lastNeed ? v + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : v;
  }
  function g(b) {
    return b.toString(this.encoding);
  }
  function x(b) {
    return b && b.length ? this.write(b) : "";
  }
  return Er;
}
var Mr, wc;
function Lm() {
  if (wc) return Mr;
  wc = 1;
  var n = Ke.Buffer;
  Mr = {
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
    _internal: t
  };
  function t(h, l) {
    this.enc = h.encodingName, this.bomAware = h.bomAware, this.enc === "base64" ? this.encoder = r : this.enc === "utf8" ? this.encoder = c : this.enc === "cesu8" && (this.enc = "utf8", this.encoder = a, n.from("eda0bdedb2a9", "hex").toString() !== "💩" && (this.decoder = o, this.defaultCharUnicode = l.defaultCharUnicode));
  }
  t.prototype.encoder = i, t.prototype.decoder = s;
  var e = _m().StringDecoder;
  function s(h, l) {
    this.decoder = new e(l.enc);
  }
  s.prototype.write = function(h) {
    return n.isBuffer(h) || (h = n.from(h)), this.decoder.write(h);
  }, s.prototype.end = function() {
    return this.decoder.end();
  };
  function i(h, l) {
    this.enc = l.enc;
  }
  i.prototype.write = function(h) {
    return n.from(h, this.enc);
  }, i.prototype.end = function() {
  };
  function r(h, l) {
    this.prevStr = "";
  }
  r.prototype.write = function(h) {
    h = this.prevStr + h;
    var l = h.length - h.length % 4;
    return this.prevStr = h.slice(l), h = h.slice(0, l), n.from(h, "base64");
  }, r.prototype.end = function() {
    return n.from(this.prevStr, "base64");
  };
  function a(h, l) {
  }
  a.prototype.write = function(h) {
    for (var l = n.alloc(h.length * 3), u = 0, f = 0; f < h.length; f++) {
      var p = h.charCodeAt(f);
      p < 128 ? l[u++] = p : p < 2048 ? (l[u++] = 192 + (p >>> 6), l[u++] = 128 + (p & 63)) : (l[u++] = 224 + (p >>> 12), l[u++] = 128 + (p >>> 6 & 63), l[u++] = 128 + (p & 63));
    }
    return l.slice(0, u);
  }, a.prototype.end = function() {
  };
  function o(h, l) {
    this.acc = 0, this.contBytes = 0, this.accBytes = 0, this.defaultCharUnicode = l.defaultCharUnicode;
  }
  o.prototype.write = function(h) {
    for (var l = this.acc, u = this.contBytes, f = this.accBytes, p = "", d = 0; d < h.length; d++) {
      var g = h[d];
      (g & 192) !== 128 ? (u > 0 && (p += this.defaultCharUnicode, u = 0), g < 128 ? p += String.fromCharCode(g) : g < 224 ? (l = g & 31, u = 1, f = 1) : g < 240 ? (l = g & 15, u = 2, f = 1) : p += this.defaultCharUnicode) : u > 0 ? (l = l << 6 | g & 63, u--, f++, u === 0 && (f === 2 && l < 128 && l > 0 ? p += this.defaultCharUnicode : f === 3 && l < 2048 ? p += this.defaultCharUnicode : p += String.fromCharCode(l))) : p += this.defaultCharUnicode;
    }
    return this.acc = l, this.contBytes = u, this.accBytes = f, p;
  }, o.prototype.end = function() {
    var h = 0;
    return this.contBytes > 0 && (h += this.defaultCharUnicode), h;
  };
  function c(h, l) {
    this.highSurrogate = "";
  }
  return c.prototype.write = function(h) {
    if (this.highSurrogate && (h = this.highSurrogate + h, this.highSurrogate = ""), h.length > 0) {
      var l = h.charCodeAt(h.length - 1);
      l >= 55296 && l < 56320 && (this.highSurrogate = h[h.length - 1], h = h.slice(0, h.length - 1));
    }
    return n.from(h, this.enc);
  }, c.prototype.end = function() {
    if (this.highSurrogate) {
      var h = this.highSurrogate;
      return this.highSurrogate = "", n.from(h, this.enc);
    }
  }, Mr;
}
var Ee = {}, Cc;
function Im() {
  if (Cc) return Ee;
  Cc = 1;
  var n = Ke.Buffer;
  Ee._utf32 = t;
  function t(h, l) {
    this.iconv = l, this.bomAware = !0, this.isLE = h.isLE;
  }
  Ee.utf32le = { type: "_utf32", isLE: !0 }, Ee.utf32be = { type: "_utf32", isLE: !1 }, Ee.ucs4le = "utf32le", Ee.ucs4be = "utf32be", t.prototype.encoder = e, t.prototype.decoder = s;
  function e(h, l) {
    this.isLE = l.isLE, this.highSurrogate = 0;
  }
  e.prototype.write = function(h) {
    for (var l = n.from(h, "ucs2"), u = n.alloc(l.length * 2), f = this.isLE ? u.writeUInt32LE : u.writeUInt32BE, p = 0, d = 0; d < l.length; d += 2) {
      var g = l.readUInt16LE(d), x = g >= 55296 && g < 56320, b = g >= 56320 && g < 57344;
      if (this.highSurrogate)
        if (x || !b)
          f.call(u, this.highSurrogate, p), p += 4;
        else {
          var v = (this.highSurrogate - 55296 << 10 | g - 56320) + 65536;
          f.call(u, v, p), p += 4, this.highSurrogate = 0;
          continue;
        }
      x ? this.highSurrogate = g : (f.call(u, g, p), p += 4, this.highSurrogate = 0);
    }
    return p < u.length && (u = u.slice(0, p)), u;
  }, e.prototype.end = function() {
    if (this.highSurrogate) {
      var h = n.alloc(4);
      return this.isLE ? h.writeUInt32LE(this.highSurrogate, 0) : h.writeUInt32BE(this.highSurrogate, 0), this.highSurrogate = 0, h;
    }
  };
  function s(h, l) {
    this.isLE = l.isLE, this.badChar = l.iconv.defaultCharUnicode.charCodeAt(0), this.overflow = [];
  }
  s.prototype.write = function(h) {
    if (h.length === 0)
      return "";
    var l = 0, u = 0, f = n.alloc(h.length + 4), p = 0, d = this.isLE, g = this.overflow, x = this.badChar;
    if (g.length > 0) {
      for (; l < h.length && g.length < 4; l++)
        g.push(h[l]);
      g.length === 4 && (d ? u = g[l] | g[l + 1] << 8 | g[l + 2] << 16 | g[l + 3] << 24 : u = g[l + 3] | g[l + 2] << 8 | g[l + 1] << 16 | g[l] << 24, g.length = 0, p = i(f, p, u, x));
    }
    for (; l < h.length - 3; l += 4)
      d ? u = h[l] | h[l + 1] << 8 | h[l + 2] << 16 | h[l + 3] << 24 : u = h[l + 3] | h[l + 2] << 8 | h[l + 1] << 16 | h[l] << 24, p = i(f, p, u, x);
    for (; l < h.length; l++)
      g.push(h[l]);
    return f.slice(0, p).toString("ucs2");
  };
  function i(h, l, u, f) {
    if ((u < 0 || u > 1114111) && (u = f), u >= 65536) {
      u -= 65536;
      var p = 55296 | u >> 10;
      h[l++] = p & 255, h[l++] = p >> 8;
      var u = 56320 | u & 1023;
    }
    return h[l++] = u & 255, h[l++] = u >> 8, l;
  }
  s.prototype.end = function() {
    this.overflow.length = 0;
  }, Ee.utf32 = r, Ee.ucs4 = "utf32";
  function r(h, l) {
    this.iconv = l;
  }
  r.prototype.encoder = a, r.prototype.decoder = o;
  function a(h, l) {
    h = h || {}, h.addBOM === void 0 && (h.addBOM = !0), this.encoder = l.iconv.getEncoder(h.defaultEncoding || "utf-32le", h);
  }
  a.prototype.write = function(h) {
    return this.encoder.write(h);
  }, a.prototype.end = function() {
    return this.encoder.end();
  };
  function o(h, l) {
    this.decoder = null, this.initialBufs = [], this.initialBufsLen = 0, this.options = h || {}, this.iconv = l.iconv;
  }
  o.prototype.write = function(h) {
    if (!this.decoder) {
      if (this.initialBufs.push(h), this.initialBufsLen += h.length, this.initialBufsLen < 32)
        return "";
      var l = c(this.initialBufs, this.options.defaultEncoding);
      this.decoder = this.iconv.getDecoder(l, this.options);
      for (var u = "", f = 0; f < this.initialBufs.length; f++)
        u += this.decoder.write(this.initialBufs[f]);
      return this.initialBufs.length = this.initialBufsLen = 0, u;
    }
    return this.decoder.write(h);
  }, o.prototype.end = function() {
    if (!this.decoder) {
      var h = c(this.initialBufs, this.options.defaultEncoding);
      this.decoder = this.iconv.getDecoder(h, this.options);
      for (var l = "", u = 0; u < this.initialBufs.length; u++)
        l += this.decoder.write(this.initialBufs[u]);
      var f = this.decoder.end();
      return f && (l += f), this.initialBufs.length = this.initialBufsLen = 0, l;
    }
    return this.decoder.end();
  };
  function c(h, l) {
    var u = [], f = 0, p = 0, d = 0, g = 0, x = 0;
    t:
      for (var b = 0; b < h.length; b++)
        for (var v = h[b], S = 0; S < v.length; S++)
          if (u.push(v[S]), u.length === 4) {
            if (f === 0) {
              if (u[0] === 255 && u[1] === 254 && u[2] === 0 && u[3] === 0)
                return "utf-32le";
              if (u[0] === 0 && u[1] === 0 && u[2] === 254 && u[3] === 255)
                return "utf-32be";
            }
            if ((u[0] !== 0 || u[1] > 16) && d++, (u[3] !== 0 || u[2] > 16) && p++, u[0] === 0 && u[1] === 0 && (u[2] !== 0 || u[3] !== 0) && x++, (u[0] !== 0 || u[1] !== 0) && u[2] === 0 && u[3] === 0 && g++, u.length = 0, f++, f >= 100)
              break t;
          }
    return x - d > g - p ? "utf-32be" : x - d < g - p ? "utf-32le" : l || "utf-32le";
  }
  return Ee;
}
var ei = {}, Tc;
function Rm() {
  if (Tc) return ei;
  Tc = 1;
  var n = Ke.Buffer;
  ei.utf16be = t;
  function t() {
  }
  t.prototype.encoder = e, t.prototype.decoder = s, t.prototype.bomAware = !0;
  function e() {
  }
  e.prototype.write = function(c) {
    for (var h = n.from(c, "ucs2"), l = 0; l < h.length; l += 2) {
      var u = h[l];
      h[l] = h[l + 1], h[l + 1] = u;
    }
    return h;
  }, e.prototype.end = function() {
  };
  function s() {
    this.overflowByte = -1;
  }
  s.prototype.write = function(c) {
    if (c.length == 0)
      return "";
    var h = n.alloc(c.length + 1), l = 0, u = 0;
    for (this.overflowByte !== -1 && (h[0] = c[0], h[1] = this.overflowByte, l = 1, u = 2); l < c.length - 1; l += 2, u += 2)
      h[u] = c[l + 1], h[u + 1] = c[l];
    return this.overflowByte = l == c.length - 1 ? c[c.length - 1] : -1, h.slice(0, u).toString("ucs2");
  }, s.prototype.end = function() {
    this.overflowByte = -1;
  }, ei.utf16 = i;
  function i(c, h) {
    this.iconv = h;
  }
  i.prototype.encoder = r, i.prototype.decoder = a;
  function r(c, h) {
    c = c || {}, c.addBOM === void 0 && (c.addBOM = !0), this.encoder = h.iconv.getEncoder("utf-16le", c);
  }
  r.prototype.write = function(c) {
    return this.encoder.write(c);
  }, r.prototype.end = function() {
    return this.encoder.end();
  };
  function a(c, h) {
    this.decoder = null, this.initialBufs = [], this.initialBufsLen = 0, this.options = c || {}, this.iconv = h.iconv;
  }
  a.prototype.write = function(c) {
    if (!this.decoder) {
      if (this.initialBufs.push(c), this.initialBufsLen += c.length, this.initialBufsLen < 16)
        return "";
      var h = o(this.initialBufs, this.options.defaultEncoding);
      this.decoder = this.iconv.getDecoder(h, this.options);
      for (var l = "", u = 0; u < this.initialBufs.length; u++)
        l += this.decoder.write(this.initialBufs[u]);
      return this.initialBufs.length = this.initialBufsLen = 0, l;
    }
    return this.decoder.write(c);
  }, a.prototype.end = function() {
    if (!this.decoder) {
      var c = o(this.initialBufs, this.options.defaultEncoding);
      this.decoder = this.iconv.getDecoder(c, this.options);
      for (var h = "", l = 0; l < this.initialBufs.length; l++)
        h += this.decoder.write(this.initialBufs[l]);
      var u = this.decoder.end();
      return u && (h += u), this.initialBufs.length = this.initialBufsLen = 0, h;
    }
    return this.decoder.end();
  };
  function o(c, h) {
    var l = [], u = 0, f = 0, p = 0;
    t:
      for (var d = 0; d < c.length; d++)
        for (var g = c[d], x = 0; x < g.length; x++)
          if (l.push(g[x]), l.length === 2) {
            if (u === 0) {
              if (l[0] === 255 && l[1] === 254) return "utf-16le";
              if (l[0] === 254 && l[1] === 255) return "utf-16be";
            }
            if (l[0] === 0 && l[1] !== 0 && p++, l[0] !== 0 && l[1] === 0 && f++, l.length = 0, u++, u >= 100)
              break t;
          }
    return p > f ? "utf-16be" : p < f ? "utf-16le" : h || "utf-16le";
  }
  return ei;
}
var Qn = {}, kc;
function Bm() {
  if (kc) return Qn;
  kc = 1;
  var n = Ke.Buffer;
  Qn.utf7 = t, Qn.unicode11utf7 = "utf7";
  function t(g, x) {
    this.iconv = x;
  }
  t.prototype.encoder = s, t.prototype.decoder = i, t.prototype.bomAware = !0;
  var e = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;
  function s(g, x) {
    this.iconv = x.iconv;
  }
  s.prototype.write = function(g) {
    return n.from(g.replace(e, (function(x) {
      return "+" + (x === "+" ? "" : this.iconv.encode(x, "utf16-be").toString("base64").replace(/=+$/, "")) + "-";
    }).bind(this)));
  }, s.prototype.end = function() {
  };
  function i(g, x) {
    this.iconv = x.iconv, this.inBase64 = !1, this.base64Accum = "";
  }
  for (var r = /[A-Za-z0-9\/+]/, a = [], o = 0; o < 256; o++)
    a[o] = r.test(String.fromCharCode(o));
  var c = 43, h = 45, l = 38;
  i.prototype.write = function(g) {
    for (var x = "", b = 0, v = this.inBase64, S = this.base64Accum, w = 0; w < g.length; w++)
      if (!v)
        g[w] == c && (x += this.iconv.decode(g.slice(b, w), "ascii"), b = w + 1, v = !0);
      else if (!a[g[w]]) {
        if (w == b && g[w] == h)
          x += "+";
        else {
          var k = S + this.iconv.decode(g.slice(b, w), "ascii");
          x += this.iconv.decode(n.from(k, "base64"), "utf16-be");
        }
        g[w] != h && w--, b = w + 1, v = !1, S = "";
      }
    if (!v)
      x += this.iconv.decode(g.slice(b), "ascii");
    else {
      var k = S + this.iconv.decode(g.slice(b), "ascii"), M = k.length - k.length % 8;
      S = k.slice(M), k = k.slice(0, M), x += this.iconv.decode(n.from(k, "base64"), "utf16-be");
    }
    return this.inBase64 = v, this.base64Accum = S, x;
  }, i.prototype.end = function() {
    var g = "";
    return this.inBase64 && this.base64Accum.length > 0 && (g = this.iconv.decode(n.from(this.base64Accum, "base64"), "utf16-be")), this.inBase64 = !1, this.base64Accum = "", g;
  }, Qn.utf7imap = u;
  function u(g, x) {
    this.iconv = x;
  }
  u.prototype.encoder = f, u.prototype.decoder = p, u.prototype.bomAware = !0;
  function f(g, x) {
    this.iconv = x.iconv, this.inBase64 = !1, this.base64Accum = n.alloc(6), this.base64AccumIdx = 0;
  }
  f.prototype.write = function(g) {
    for (var x = this.inBase64, b = this.base64Accum, v = this.base64AccumIdx, S = n.alloc(g.length * 5 + 10), w = 0, k = 0; k < g.length; k++) {
      var M = g.charCodeAt(k);
      M >= 32 && M <= 126 ? (x && (v > 0 && (w += S.write(b.slice(0, v).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), w), v = 0), S[w++] = h, x = !1), x || (S[w++] = M, M === l && (S[w++] = h))) : (x || (S[w++] = l, x = !0), x && (b[v++] = M >> 8, b[v++] = M & 255, v == b.length && (w += S.write(b.toString("base64").replace(/\//g, ","), w), v = 0)));
    }
    return this.inBase64 = x, this.base64AccumIdx = v, S.slice(0, w);
  }, f.prototype.end = function() {
    var g = n.alloc(10), x = 0;
    return this.inBase64 && (this.base64AccumIdx > 0 && (x += g.write(this.base64Accum.slice(0, this.base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), x), this.base64AccumIdx = 0), g[x++] = h, this.inBase64 = !1), g.slice(0, x);
  };
  function p(g, x) {
    this.iconv = x.iconv, this.inBase64 = !1, this.base64Accum = "";
  }
  var d = a.slice();
  return d[44] = !0, p.prototype.write = function(g) {
    for (var x = "", b = 0, v = this.inBase64, S = this.base64Accum, w = 0; w < g.length; w++)
      if (!v)
        g[w] == l && (x += this.iconv.decode(g.slice(b, w), "ascii"), b = w + 1, v = !0);
      else if (!d[g[w]]) {
        if (w == b && g[w] == h)
          x += "&";
        else {
          var k = S + this.iconv.decode(g.slice(b, w), "ascii").replace(/,/g, "/");
          x += this.iconv.decode(n.from(k, "base64"), "utf16-be");
        }
        g[w] != h && w--, b = w + 1, v = !1, S = "";
      }
    if (!v)
      x += this.iconv.decode(g.slice(b), "ascii");
    else {
      var k = S + this.iconv.decode(g.slice(b), "ascii").replace(/,/g, "/"), M = k.length - k.length % 8;
      S = k.slice(M), k = k.slice(0, M), x += this.iconv.decode(n.from(k, "base64"), "utf16-be");
    }
    return this.inBase64 = v, this.base64Accum = S, x;
  }, p.prototype.end = function() {
    var g = "";
    return this.inBase64 && this.base64Accum.length > 0 && (g = this.iconv.decode(n.from(this.base64Accum, "base64"), "utf16-be")), this.inBase64 = !1, this.base64Accum = "", g;
  }, Qn;
}
var Or = {}, Ac;
function Dm() {
  if (Ac) return Or;
  Ac = 1;
  var n = Ke.Buffer;
  Or._sbcs = t;
  function t(i, r) {
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
    for (var c = n.alloc(65536, r.defaultCharSingleByte.charCodeAt(0)), o = 0; o < i.chars.length; o++)
      c[i.chars.charCodeAt(o)] = o;
    this.encodeBuf = c;
  }
  t.prototype.encoder = e, t.prototype.decoder = s;
  function e(i, r) {
    this.encodeBuf = r.encodeBuf;
  }
  e.prototype.write = function(i) {
    for (var r = n.alloc(i.length), a = 0; a < i.length; a++)
      r[a] = this.encodeBuf[i.charCodeAt(a)];
    return r;
  }, e.prototype.end = function() {
  };
  function s(i, r) {
    this.decodeBuf = r.decodeBuf;
  }
  return s.prototype.write = function(i) {
    for (var r = this.decodeBuf, a = n.alloc(i.length * 2), o = 0, c = 0, h = 0; h < i.length; h++)
      o = i[h] * 2, c = h * 2, a[c] = r[o], a[c + 1] = r[o + 1];
    return a.toString("ucs2");
  }, s.prototype.end = function() {
  }, Or;
}
var _r, Fc;
function Um() {
  return Fc || (Fc = 1, _r = {
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
  }), _r;
}
var Lr, Ec;
function Pm() {
  return Ec || (Ec = 1, Lr = {
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
  }), Lr;
}
var Ir = {}, Mc;
function zm() {
  if (Mc) return Ir;
  Mc = 1;
  var n = Ke.Buffer;
  Ir._dbcs = c;
  for (var t = -1, e = -2, s = -10, i = -1e3, r = new Array(256), a = -1, o = 0; o < 256; o++)
    r[o] = t;
  function c(f, p) {
    if (this.encodingName = f.encodingName, !f)
      throw new Error("DBCS codec is called without the data.");
    if (!f.table)
      throw new Error("Encoding '" + this.encodingName + "' has no data.");
    var d = f.table();
    this.decodeTables = [], this.decodeTables[0] = r.slice(0), this.decodeTableSeq = [];
    for (var g = 0; g < d.length; g++)
      this._addDecodeChunk(d[g]);
    if (typeof f.gb18030 == "function") {
      this.gb18030 = f.gb18030();
      var x = this.decodeTables.length;
      this.decodeTables.push(r.slice(0));
      var b = this.decodeTables.length;
      this.decodeTables.push(r.slice(0));
      for (var v = this.decodeTables[0], g = 129; g <= 254; g++)
        for (var S = this.decodeTables[i - v[g]], w = 48; w <= 57; w++) {
          if (S[w] === t)
            S[w] = i - x;
          else if (S[w] > i)
            throw new Error("gb18030 decode tables conflict at byte 2");
          for (var k = this.decodeTables[i - S[w]], M = 129; M <= 254; M++) {
            if (k[M] === t)
              k[M] = i - b;
            else {
              if (k[M] === i - b)
                continue;
              if (k[M] > i)
                throw new Error("gb18030 decode tables conflict at byte 3");
            }
            for (var O = this.decodeTables[i - k[M]], I = 48; I <= 57; I++)
              O[I] === t && (O[I] = e);
          }
        }
    }
    this.defaultCharUnicode = p.defaultCharUnicode, this.encodeTable = [], this.encodeTableSeq = [];
    var V = {};
    if (f.encodeSkipVals)
      for (var g = 0; g < f.encodeSkipVals.length; g++) {
        var D = f.encodeSkipVals[g];
        if (typeof D == "number")
          V[D] = !0;
        else
          for (var w = D.from; w <= D.to; w++)
            V[w] = !0;
      }
    if (this._fillEncodeTable(0, 0, V), f.encodeAdd)
      for (var W in f.encodeAdd)
        Object.prototype.hasOwnProperty.call(f.encodeAdd, W) && this._setEncodeChar(W.charCodeAt(0), f.encodeAdd[W]);
    this.defCharSB = this.encodeTable[0][p.defaultCharSingleByte.charCodeAt(0)], this.defCharSB === t && (this.defCharSB = this.encodeTable[0]["?"]), this.defCharSB === t && (this.defCharSB = 63);
  }
  c.prototype.encoder = h, c.prototype.decoder = l, c.prototype._getDecodeTrieNode = function(f) {
    for (var p = []; f > 0; f >>>= 8)
      p.push(f & 255);
    p.length == 0 && p.push(0);
    for (var d = this.decodeTables[0], g = p.length - 1; g > 0; g--) {
      var x = d[p[g]];
      if (x == t)
        d[p[g]] = i - this.decodeTables.length, this.decodeTables.push(d = r.slice(0));
      else if (x <= i)
        d = this.decodeTables[i - x];
      else
        throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + f.toString(16));
    }
    return d;
  }, c.prototype._addDecodeChunk = function(f) {
    var p = parseInt(f[0], 16), d = this._getDecodeTrieNode(p);
    p = p & 255;
    for (var g = 1; g < f.length; g++) {
      var x = f[g];
      if (typeof x == "string")
        for (var b = 0; b < x.length; ) {
          var v = x.charCodeAt(b++);
          if (v >= 55296 && v < 56320) {
            var S = x.charCodeAt(b++);
            if (S >= 56320 && S < 57344)
              d[p++] = 65536 + (v - 55296) * 1024 + (S - 56320);
            else
              throw new Error("Incorrect surrogate pair in " + this.encodingName + " at chunk " + f[0]);
          } else if (v > 4080 && v <= 4095) {
            for (var w = 4095 - v + 2, k = [], M = 0; M < w; M++)
              k.push(x.charCodeAt(b++));
            d[p++] = s - this.decodeTableSeq.length, this.decodeTableSeq.push(k);
          } else
            d[p++] = v;
        }
      else if (typeof x == "number")
        for (var O = d[p - 1] + 1, b = 0; b < x; b++)
          d[p++] = O++;
      else
        throw new Error("Incorrect type '" + typeof x + "' given in " + this.encodingName + " at chunk " + f[0]);
    }
    if (p > 255)
      throw new Error("Incorrect chunk in " + this.encodingName + " at addr " + f[0] + ": too long" + p);
  }, c.prototype._getEncodeBucket = function(f) {
    var p = f >> 8;
    return this.encodeTable[p] === void 0 && (this.encodeTable[p] = r.slice(0)), this.encodeTable[p];
  }, c.prototype._setEncodeChar = function(f, p) {
    var d = this._getEncodeBucket(f), g = f & 255;
    d[g] <= s ? this.encodeTableSeq[s - d[g]][a] = p : d[g] == t && (d[g] = p);
  }, c.prototype._setEncodeSequence = function(f, p) {
    var d = f[0], g = this._getEncodeBucket(d), x = d & 255, b;
    g[x] <= s ? b = this.encodeTableSeq[s - g[x]] : (b = {}, g[x] !== t && (b[a] = g[x]), g[x] = s - this.encodeTableSeq.length, this.encodeTableSeq.push(b));
    for (var v = 1; v < f.length - 1; v++) {
      var S = b[d];
      typeof S == "object" ? b = S : (b = b[d] = {}, S !== void 0 && (b[a] = S));
    }
    d = f[f.length - 1], b[d] = p;
  }, c.prototype._fillEncodeTable = function(f, p, d) {
    for (var g = this.decodeTables[f], x = !1, b = {}, v = 0; v < 256; v++) {
      var S = g[v], w = p + v;
      if (!d[w])
        if (S >= 0)
          this._setEncodeChar(S, w), x = !0;
        else if (S <= i) {
          var k = i - S;
          if (!b[k]) {
            var M = w << 8 >>> 0;
            this._fillEncodeTable(k, M, d) ? x = !0 : b[k] = !0;
          }
        } else S <= s && (this._setEncodeSequence(this.decodeTableSeq[s - S], w), x = !0);
    }
    return x;
  };
  function h(f, p) {
    this.leadSurrogate = -1, this.seqObj = void 0, this.encodeTable = p.encodeTable, this.encodeTableSeq = p.encodeTableSeq, this.defaultCharSingleByte = p.defCharSB, this.gb18030 = p.gb18030;
  }
  h.prototype.write = function(f) {
    for (var p = n.alloc(f.length * (this.gb18030 ? 4 : 3)), d = this.leadSurrogate, g = this.seqObj, x = -1, b = 0, v = 0; ; ) {
      if (x === -1) {
        if (b == f.length) break;
        var S = f.charCodeAt(b++);
      } else {
        var S = x;
        x = -1;
      }
      if (S >= 55296 && S < 57344)
        if (S < 56320)
          if (d === -1) {
            d = S;
            continue;
          } else
            d = S, S = t;
        else
          d !== -1 ? (S = 65536 + (d - 55296) * 1024 + (S - 56320), d = -1) : S = t;
      else d !== -1 && (x = S, S = t, d = -1);
      var w = t;
      if (g !== void 0 && S != t) {
        var k = g[S];
        if (typeof k == "object") {
          g = k;
          continue;
        } else typeof k == "number" ? w = k : k == null && (k = g[a], k !== void 0 && (w = k, x = S));
        g = void 0;
      } else if (S >= 0) {
        var M = this.encodeTable[S >> 8];
        if (M !== void 0 && (w = M[S & 255]), w <= s) {
          g = this.encodeTableSeq[s - w];
          continue;
        }
        if (w == t && this.gb18030) {
          var O = u(this.gb18030.uChars, S);
          if (O != -1) {
            var w = this.gb18030.gbChars[O] + (S - this.gb18030.uChars[O]);
            p[v++] = 129 + Math.floor(w / 12600), w = w % 12600, p[v++] = 48 + Math.floor(w / 1260), w = w % 1260, p[v++] = 129 + Math.floor(w / 10), w = w % 10, p[v++] = 48 + w;
            continue;
          }
        }
      }
      w === t && (w = this.defaultCharSingleByte), w < 256 ? p[v++] = w : w < 65536 ? (p[v++] = w >> 8, p[v++] = w & 255) : w < 16777216 ? (p[v++] = w >> 16, p[v++] = w >> 8 & 255, p[v++] = w & 255) : (p[v++] = w >>> 24, p[v++] = w >>> 16 & 255, p[v++] = w >>> 8 & 255, p[v++] = w & 255);
    }
    return this.seqObj = g, this.leadSurrogate = d, p.slice(0, v);
  }, h.prototype.end = function() {
    if (!(this.leadSurrogate === -1 && this.seqObj === void 0)) {
      var f = n.alloc(10), p = 0;
      if (this.seqObj) {
        var d = this.seqObj[a];
        d !== void 0 && (d < 256 ? f[p++] = d : (f[p++] = d >> 8, f[p++] = d & 255)), this.seqObj = void 0;
      }
      return this.leadSurrogate !== -1 && (f[p++] = this.defaultCharSingleByte, this.leadSurrogate = -1), f.slice(0, p);
    }
  }, h.prototype.findIdx = u;
  function l(f, p) {
    this.nodeIdx = 0, this.prevBytes = [], this.decodeTables = p.decodeTables, this.decodeTableSeq = p.decodeTableSeq, this.defaultCharUnicode = p.defaultCharUnicode, this.gb18030 = p.gb18030;
  }
  l.prototype.write = function(f) {
    for (var p = n.alloc(f.length * 2), d = this.nodeIdx, g = this.prevBytes, x = this.prevBytes.length, b = -this.prevBytes.length, v, S = 0, w = 0; S < f.length; S++) {
      var k = S >= 0 ? f[S] : g[S + x], v = this.decodeTables[d][k];
      if (!(v >= 0)) if (v === t)
        v = this.defaultCharUnicode.charCodeAt(0), S = b;
      else if (v === e) {
        if (S >= 3)
          var M = (f[S - 3] - 129) * 12600 + (f[S - 2] - 48) * 1260 + (f[S - 1] - 129) * 10 + (k - 48);
        else
          var M = (g[S - 3 + x] - 129) * 12600 + ((S - 2 >= 0 ? f[S - 2] : g[S - 2 + x]) - 48) * 1260 + ((S - 1 >= 0 ? f[S - 1] : g[S - 1 + x]) - 129) * 10 + (k - 48);
        var O = u(this.gb18030.gbChars, M);
        v = this.gb18030.uChars[O] + M - this.gb18030.gbChars[O];
      } else if (v <= i) {
        d = i - v;
        continue;
      } else if (v <= s) {
        for (var I = this.decodeTableSeq[s - v], V = 0; V < I.length - 1; V++)
          v = I[V], p[w++] = v & 255, p[w++] = v >> 8;
        v = I[I.length - 1];
      } else
        throw new Error("iconv-lite internal error: invalid decoding table value " + v + " at " + d + "/" + k);
      if (v >= 65536) {
        v -= 65536;
        var D = 55296 | v >> 10;
        p[w++] = D & 255, p[w++] = D >> 8, v = 56320 | v & 1023;
      }
      p[w++] = v & 255, p[w++] = v >> 8, d = 0, b = S + 1;
    }
    return this.nodeIdx = d, this.prevBytes = b >= 0 ? Array.prototype.slice.call(f, b) : g.slice(b + x).concat(Array.prototype.slice.call(f)), p.slice(0, w).toString("ucs2");
  }, l.prototype.end = function() {
    for (var f = ""; this.prevBytes.length > 0; ) {
      f += this.defaultCharUnicode;
      var p = this.prevBytes.slice(1);
      this.prevBytes = [], this.nodeIdx = 0, p.length > 0 && (f += this.write(p));
    }
    return this.prevBytes = [], this.nodeIdx = 0, f;
  };
  function u(f, p) {
    if (f[0] > p)
      return -1;
    for (var d = 0, g = f.length; d < g - 1; ) {
      var x = d + (g - d + 1 >> 1);
      f[x] <= p ? d = x : g = x;
    }
    return d;
  }
  return Ir;
}
const Nm = [
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
], Hm = [
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
], Rr = [
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
], Oc = [
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
], Gm = [
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
], Vm = [
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
], Wm = {
  uChars: Gm,
  gbChars: Vm
}, qm = [
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
], _c = [
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
], jm = [
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
var Br, Lc;
function $m() {
  return Lc || (Lc = 1, Br = {
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
        return Nm;
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
        return Hm;
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
        return Rr;
      }
    },
    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
    gbk: {
      type: "_dbcs",
      table: function() {
        return Rr.concat(Oc);
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
        return Rr.concat(Oc);
      },
      gb18030: function() {
        return Wm;
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
        return qm;
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
        return _c;
      }
    },
    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
    big5: "big5hkscs",
    big5hkscs: {
      type: "_dbcs",
      table: function() {
        return _c.concat(jm);
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
  }), Br;
}
var Ic;
function Xm() {
  return Ic || (Ic = 1, function(n) {
    for (var t = ml, e = [
      Lm(),
      Im(),
      Rm(),
      Bm(),
      Dm(),
      Um(),
      Pm(),
      zm(),
      $m()
    ], s = 0; s < e.length; s++) {
      var i = e[s];
      t(n, i);
    }
  }(Fr)), Fr;
}
var Dr, Rc;
function Ym() {
  if (Rc) return Dr;
  Rc = 1;
  var n = Ke.Buffer;
  return Dr = function(t) {
    var e = t.Transform;
    function s(r, a) {
      this.conv = r, a = a || {}, a.decodeStrings = !1, e.call(this, a);
    }
    s.prototype = Object.create(e.prototype, {
      constructor: { value: s }
    }), s.prototype._transform = function(r, a, o) {
      if (typeof r != "string")
        return o(new Error("Iconv encoding stream needs strings as its input."));
      try {
        var c = this.conv.write(r);
        c && c.length && this.push(c), o();
      } catch (h) {
        o(h);
      }
    }, s.prototype._flush = function(r) {
      try {
        var a = this.conv.end();
        a && a.length && this.push(a), r();
      } catch (o) {
        r(o);
      }
    }, s.prototype.collect = function(r) {
      var a = [];
      return this.on("error", r), this.on("data", function(o) {
        a.push(o);
      }), this.on("end", function() {
        r(null, n.concat(a));
      }), this;
    };
    function i(r, a) {
      this.conv = r, a = a || {}, a.encoding = this.encoding = "utf8", e.call(this, a);
    }
    return i.prototype = Object.create(e.prototype, {
      constructor: { value: i }
    }), i.prototype._transform = function(r, a, o) {
      if (!n.isBuffer(r) && !(r instanceof Uint8Array))
        return o(new Error("Iconv decoding stream needs buffers as its input."));
      try {
        var c = this.conv.write(r);
        c && c.length && this.push(c, this.encoding), o();
      } catch (h) {
        o(h);
      }
    }, i.prototype._flush = function(r) {
      try {
        var a = this.conv.end();
        a && a.length && this.push(a, this.encoding), r();
      } catch (o) {
        r(o);
      }
    }, i.prototype.collect = function(r) {
      var a = "";
      return this.on("error", r), this.on("data", function(o) {
        a += o;
      }), this.on("end", function() {
        r(null, a);
      }), this;
    }, {
      IconvLiteEncoderStream: s,
      IconvLiteDecoderStream: i
    };
  }, Dr;
}
const Zm = {}, Jm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zm
}, Symbol.toStringTag, { value: "Module" })), Km = /* @__PURE__ */ bm(Jm);
(function(n) {
  var t = Ke.Buffer, e = Ca, s = ml, i = n.exports;
  i.encodings = null, i.defaultCharUnicode = "�", i.defaultCharSingleByte = "?", i.encode = function(o, c, h) {
    o = "" + (o || "");
    var l = i.getEncoder(c, h), u = l.write(o), f = l.end();
    return f && f.length > 0 ? t.concat([u, f]) : u;
  }, i.decode = function(o, c, h) {
    typeof o == "string" && (i.skipDecodeWarning || (console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"), i.skipDecodeWarning = !0), o = t.from("" + (o || ""), "binary"));
    var l = i.getDecoder(c, h), u = l.write(o), f = l.end();
    return f ? u + f : u;
  }, i.encodingExists = function(o) {
    try {
      return i.getCodec(o), !0;
    } catch {
      return !1;
    }
  }, i.toEncoding = i.encode, i.fromEncoding = i.decode, i._codecDataCache = { __proto__: null }, i.getCodec = function(o) {
    if (!i.encodings) {
      var c = Xm();
      i.encodings = { __proto__: null }, s(i.encodings, c);
    }
    for (var h = i._canonicalizeEncoding(o), l = {}; ; ) {
      var u = i._codecDataCache[h];
      if (u)
        return u;
      var f = i.encodings[h];
      switch (typeof f) {
        case "string":
          h = f;
          break;
        case "object":
          for (var p in f)
            l[p] = f[p];
          l.encodingName || (l.encodingName = h), h = f.type;
          break;
        case "function":
          return l.encodingName || (l.encodingName = h), u = new f(l, i), i._codecDataCache[l.encodingName] = u, u;
        default:
          throw new Error("Encoding not recognized: '" + o + "' (searched as: '" + h + "')");
      }
    }
  }, i._canonicalizeEncoding = function(a) {
    return ("" + a).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
  }, i.getEncoder = function(o, c) {
    var h = i.getCodec(o), l = new h.encoder(c, h);
    return h.bomAware && c && c.addBOM && (l = new e.PrependBOM(l, c)), l;
  }, i.getDecoder = function(o, c) {
    var h = i.getCodec(o), l = new h.decoder(c, h);
    return h.bomAware && !(c && c.stripBOM === !1) && (l = new e.StripBOM(l, c)), l;
  }, i.enableStreamingAPI = function(o) {
    if (!i.supportsStreams) {
      var c = Ym()(o);
      i.IconvLiteEncoderStream = c.IconvLiteEncoderStream, i.IconvLiteDecoderStream = c.IconvLiteDecoderStream, i.encodeStream = function(l, u) {
        return new i.IconvLiteEncoderStream(i.getEncoder(l, u), u);
      }, i.decodeStream = function(l, u) {
        return new i.IconvLiteDecoderStream(i.getDecoder(l, u), u);
      }, i.supportsStreams = !0;
    }
  };
  var r;
  try {
    r = Km;
  } catch {
  }
  r && r.Transform ? i.enableStreamingAPI(r) : i.encodeStream = i.decodeStream = function() {
    throw new Error("iconv-lite Streaming API is not enabled. Use iconv.enableStreamingAPI(require('stream')); to enable it.");
  };
})(pl);
var Qm = pl.exports;
const ty = /* @__PURE__ */ xm(Qm);
class Mi extends eh {
  /**
   * Creates a new instance of ShxTextShape
   * @param code - The character code this shape represents
   * @param shape - The shape data for this character
   */
  constructor(t, e, s, i) {
    super(), this.fontSize = e, this.shape = s, this.font = i, this.code = t, this.width = this.resolveAdvanceWidth(s);
  }
  /**
   * Resolves horizontal advance for SHX glyphs.
   *
   * - Unicode / shapes fonts: prefer the pen-down end X (lastPoint), which matches
   *   AutoCAD's advance for single-byte SHX.
   * - Big fonts (CJK): advance is the scaled font cell width (content.width /
   *   content.height * fontSize). Glyph bbox or lastPoint can be narrower than the
   *   cell; using only bbox caused successive Han characters to overlap visually.
   */
  resolveAdvanceWidth(t) {
    var h;
    const e = this.calcWidth(), s = ((h = t.lastPoint) == null ? void 0 : h.x) ?? 0, i = t.bbox.maxX, r = this.font.data.header.fontType, { width: a, height: o } = this.font.data.content, c = o > 0 ? a / o * this.fontSize : 0;
    if (r === Ct.BIGFONT)
      return Math.max(e, s, c);
    if (r === Ct.UNIFONT) {
      const l = Math.max(e, i);
      let u = Math.max(s, l);
      return l > s + 1e-6 && (u = Math.max(u, c)), u;
    }
    return s > 0 ? s : e;
  }
  calcWidth() {
    const t = this.shape.bbox;
    return t.maxX - t.minX;
  }
  offset(t) {
    return new Mi(
      this.code,
      this.fontSize,
      this.shape.offset(t),
      this.font
    );
  }
  /**
   * Converts the text shape to a THREE.js geometry
   * @returns A THREE.js BufferGeometry representing the text shape
   */
  toGeometry() {
    let t = this.font.cache.getGeometry(this.code, this.fontSize);
    if (t == null) {
      const e = this.shape.polylines, s = [], i = [];
      let r = 0;
      t = new Ht();
      for (let a = 0; a < e.length; a++) {
        const o = e[a];
        for (let c = 0; c < o.length; c++) {
          const h = o[c];
          s.push(h.x, h.y, 0), c === o.length - 1 || i.push(r, r + 1), r++;
        }
      }
      t.setAttribute(
        "position",
        new hn(s, 3)
      ), t.setIndex(i);
    }
    return t;
  }
}
class Oi extends th {
  constructor(t) {
    super(t), this.type = "shx", this.font = new ym(t.data), this.data = this.font.fontData;
  }
  /**
   * Return true if this font contains glyph of the specified character. Otherwise, return false.
   * @param char - The character to check
   * @returns True if this font contains glyph of the specified character. Otherwise, return false.
   */
  hasChar(t) {
    const e = this.getCode(t);
    return this.font.hasChar(e);
  }
  /**
   * Return true if this font contains glyph of the specified character code. Otherwise, return false.
   * @param code - The character code to check
   * @returns True if this font contains glyph of the specified character code. Otherwise, return false.
   */
  hasCode(t) {
    return this.font.hasChar(t);
  }
  /**
   * Horizontal advance for the space character (ASCII 32) at the given size.
   * Uses the SHX glyph pen advance when defined; otherwise falls back to half the
   * text height (common for AutoCAD SHX fonts).
   */
  getSpaceAdvance(t) {
    const e = this.getCharShape(" ", t);
    return e ? e.width : t * 0.5;
  }
  generateShapes(t, e) {
    const s = [];
    let i = 0;
    for (let r = 0; r < t.length; r++) {
      const a = t[r];
      if (a === " ") {
        i += this.getSpaceAdvance(e);
        continue;
      }
      const o = this.getCharShape(a, e);
      if (!o) {
        i += this.getSpaceAdvance(e), this.addUnsupportedChar(a);
        continue;
      }
      s.push(o.offset(new ft(i, 0))), i += o.width;
    }
    return s;
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
  getCharShape(t, e) {
    return this.getCodeShape(this.getCode(t), e);
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
  getCodeShape(t, e) {
    const s = this.font.getCharShape(t, e);
    if (!(!s || !Oi.hasRenderableStrokes(s)))
      return new Mi(t, e, s, this);
  }
  /**
   * Gets the shape data for a named SHX shape at a given size.
   *
   * Shape names are matched case-insensitively via the underlying SHX parser.
   */
  getShapeByName(t, e) {
    const s = this.font.getShapeByName(t, e);
    if (!s || !Oi.hasRenderableStrokes(s))
      return;
    const i = this.font.getShapeCode(t);
    return new Mi(i ?? 0, e, s, this);
  }
  /** True when the SHX glyph has drawable strokes or a non-zero pen advance. */
  static hasRenderableStrokes(t) {
    var e;
    return t.polylines.some((s) => s.length >= 2) ? !0 : (((e = t.lastPoint) == null ? void 0 : e.x) ?? 0) > 0;
  }
  /**
   * For an unsupported char, use "？" as a replacement.
   */
  getNotFoundTextShape(t) {
    const e = this.font.fontData.header.fontType === Ct.BIGFONT ? "？" : "?";
    return this.getCharShape(e, t);
  }
  /**
   * Gets encoded code of the specified character according to font character encoding
   * @param char - The character to get its code
   * @returns Returns encoded code of the specified character
   */
  getCode(t) {
    if (this.font.fontData.header.fontType === Ct.BIGFONT && this.encoding) {
      const s = ty.encode(t[0], this.encoding);
      return s.length === 1 ? s[0] : s[0] << 8 | s[1];
    } else
      return t.charCodeAt(0);
  }
}
class qe {
  constructor() {
  }
  /**
   * Gets the singleton instance of the FontFactory
   * @returns The FontFactory instance
   */
  static get instance() {
    return qe._instance || (qe._instance = new qe()), qe._instance;
  }
  /**
   * Creates a font instance based on the provided font data.
   * The type of font created (ShxFont or MeshFont) is determined by the font type.
   *
   * @param data - The font data to create the font instance from
   * @returns A new instance of either ShxFont or MeshFont
   * @throws {Error} If the font data type is not supported
   */
  createFont(t) {
    if (t.type === "shx")
      return new Oi(t);
    if (t.type === "mesh")
      return new cm(t);
    throw new Error("Unsupported font data type");
  }
}
class xe {
  constructor() {
    this.fontMapping = {}, this.loadedFontMap = /* @__PURE__ */ new Map(), this.unsupportedChars = {}, this.missedFonts = {}, this.enableFontCache = !0, this.defaultFonts = /* @__PURE__ */ new Set(["simkai"]), this.symbolFonts = /* @__PURE__ */ new Set(["amgdt"]), this.events = {
      /** Event triggered when a font cannot be found */
      fontNotFound: new mo(),
      /** Event triggered when a font is successfully loaded */
      fontLoaded: new mo()
    }, this.loader = new Du(), this.loader.setResponseType("arraybuffer"), this.fileNames = [], this.fontLoader = new ey();
  }
  /**
   * Gets the singleton instance of the FontManager
   * @returns The FontManager instance
   */
  static get instance() {
    return xe._instance || (xe._instance = new xe()), xe._instance;
  }
  /**
   * Base URL to load fonts
   */
  get baseUrl() {
    return this.fontLoader.baseUrl;
  }
  set baseUrl(t) {
    this.fontLoader.baseUrl = t;
  }
  /**
   * Sets the font mapping configuration
   * @param mapping - The font mapping to set
   */
  setFontMapping(t) {
    this.fontMapping = t;
  }
  setDefaultFonts(t) {
    if (typeof t == "string" && wo(t)) {
      this.defaultFonts = new Set($r[t]), this.symbolFonts = new Set(gr[t]);
      return;
    }
    const e = typeof t == "string" ? [t] : [...t];
    this.defaultFonts = new Set(e);
  }
  setSymbolFonts(t) {
    if (typeof t == "string" && wo(t)) {
      this.symbolFonts = new Set(gr[t]);
      return;
    }
    const e = typeof t == "string" ? [t] : [...t];
    this.symbolFonts = new Set(e);
  }
  /**
   * Returns the font names for a predefined default-font preset.
   * @param preset - The preset to look up
   */
  getDefaultFontsPreset(t) {
    return $r[t];
  }
  /**
   * Returns the symbol-font names for a predefined preset.
   * @param preset - The preset to look up
   */
  getSymbolFontsPreset(t) {
    return gr[t];
  }
  /**
   * Font names that should be loaded for the active default and symbol chains.
   */
  getFontsToLoad() {
    return [.../* @__PURE__ */ new Set([...this.defaultFonts, ...this.symbolFonts])];
  }
  /**
   * Sets the font loader
   * @param fontLoader - The font loader to set
   */
  setFontLoader(t) {
    this.fontLoader = t;
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
   * Return true if all default fonts were loaded.
   * @returns True if every font in `defaultFonts` is loaded. False otherwise.
   */
  isDefaultFontLoaded() {
    for (const t of this.getFontsToLoad())
      if (this.loadedFontMap.get(t.toLowerCase()) == null)
        return !1;
    return this.defaultFonts.size > 0 || this.symbolFonts.size > 0;
  }
  /**
   * Loads all default and symbol fonts
   * @returns Promise that resolves to the font load statuses
   */
  async loadDefaultFont() {
    return await this.loadFontsByNames(this.getFontsToLoad());
  }
  /**
   * Loads the specified fonts from font names
   * @param names - Font names to load.
   * @returns Promise that resolves to an array of font load statuses
   */
  async loadFontsByNames(t) {
    const e = typeof t == "string" ? [t] : [...t];
    return await this.fontLoader.load(e);
  }
  /**
   * Loads the specified fonts from URLs
   * @param urls - URLs of font files to load.
   * @returns Promise that resolves to an array of font load statuses
   */
  async loadFonts(t) {
    t = Array.isArray(t) ? t : [t];
    const e = [];
    for (let i = 0; i < t.length; i++)
      e.push(this.loadFont(t[i]));
    const s = [];
    return await Promise.allSettled(e).then((i) => {
      i.forEach((r, a) => {
        const o = r.status === "fulfilled", c = t[a].url, h = Hr(c.toLowerCase());
        s.push({
          fontName: h,
          url: c,
          status: o ? "Success" : "FailedToLoad"
        }), o && this.fileNames.push(h);
      });
    }), s;
  }
  /**
   * Tries to find the specified font. If not found, uses a replacement font and returns its name.
   * @param fontName - The font name to find
   * @returns The original font name if found, or the replacement font name if not found
   */
  findAndReplaceFont(t) {
    let e = this.loadedFontMap.get(t.toLowerCase());
    if (e == null) {
      const s = this.fontMapping[t];
      if (s)
        return e = this.loadedFontMap.get(s.toLowerCase()), s;
    }
    if (e)
      return t;
    for (const s of this.defaultFonts)
      if (this.loadedFontMap.has(s.toLowerCase()))
        return s;
    return [...this.defaultFonts][0] ?? "";
  }
  /**
   * Gets font by font name. Return undefined if not found.
   * @param fontName - The font name to find
   * @param recordMissedFonts - Record the font name to property `missedFonts` in this class
   * if the specified font name not found.
   * @returns The font with the specified font name, or undefined if not found
   */
  getFontByName(t, e = !0) {
    if (this.loadedFontMap.size === 0)
      return;
    t == null && (t = "");
    const s = t.lastIndexOf(".");
    (s > 0 && s == t.length - 4 || s == t.length - 5) && (t = t.substring(0, s));
    const i = this.loadedFontMap.get(t.toLowerCase());
    if (!i) {
      e && this.recordMissedFonts(t);
      return;
    }
    return i;
  }
  /**
   * Gets the first font which contains the specified character.
   * @param char - The character to get the shape for
   * @returns The text shape for the character, or undefined if not found
   */
  getFontByChar(t) {
    for (const [, e] of this.loadedFontMap)
      if (e.hasChar(t))
        return e;
  }
  /**
   * Gets the text shape for a specific character in the named font only.
   * Does not fall back to bigFont, default fonts, or other loaded fonts.
   * @param char - The character to get the shape for
   * @param fontName - The name of the font to use
   * @param size - The size of the character
   * @returns The text shape for the character, or undefined if not found
   */
  getCharShape(t, e, s) {
    const i = this.getFontByName(e);
    return i == null ? void 0 : i.getCharShape(t, s);
  }
  /**
   * Resolves a named SHX shape glyph from the specified font.
   */
  getShapeByName(t, e, s) {
    const i = this.getFontByName(e);
    return i == null ? void 0 : i.getShapeByName(t, s);
  }
  /**
   * Resolves an SHX shape glyph by numeric character code from the specified font.
   */
  getShapeByCode(t, e, s) {
    const i = this.getFontByName(e);
    return i == null ? void 0 : i.getCodeShape(t, s);
  }
  /**
   * Gets the text shape from the first loaded default font that contains the character.
   * Used after primary and optional bigFont lookups per AutoCAD text-style semantics.
   */
  getCharShapeFromDefaults(t, e) {
    for (const s of this.defaultFonts) {
      const i = this.loadedFontMap.get(s.toLowerCase()), r = i == null ? void 0 : i.getCharShape(t, e);
      if (r)
        return r;
    }
  }
  /**
   * Gets the text shape from configured GDT / symbol fonts (e.g. `amgdt.shx`).
   * Used for AutoCAD percent codes and other symbol-font code points.
   */
  getCharShapeFromSymbolFonts(t, e) {
    for (const s of this.symbolFonts) {
      const i = this.loadedFontMap.get(s.toLowerCase()), r = i == null ? void 0 : i.getCharShape(t, e);
      if (r)
        return r;
    }
  }
  /**
   * Gets the scale factor for a specific font
   * @param fontName - The name of the font
   * @returns The scale factor for the font, or 1 if the font is not found
   */
  getFontScaleFactor(t) {
    const e = this.loadedFontMap.get(t.toLowerCase());
    return e ? e.getScaleFactor() : 1;
  }
  /**
   * Gets type of the specific font
   * @param fontName - The name of the font
   * @returns The type of the font. If the specified font can't be found, `undefined` is returned
   */
  getFontType(t) {
    const e = this.loadedFontMap.get(t.toLowerCase());
    return e == null ? void 0 : e.type;
  }
  /**
   * Gets the shape to display when a character is not found
   * @param size - The size of the shape
   * @returns The shape for the not found indicator, or undefined if not available
   */
  getNotFoundTextShape(t) {
    for (const [, e] of this.loadedFontMap) {
      const s = e.getNotFoundTextShape(t);
      if (s) return s;
    }
  }
  /**
   * Checks if a font is already loaded in the system
   * @param fontName - The name of the font to check
   * @returns True if the font is loaded, false otherwise
   */
  isFontLoaded(t) {
    return this.loadedFontMap.has(t.toLowerCase());
  }
  /**
   * Records a font that was requested but not found
   * @param fontName - The name of the font that was not found
   */
  recordMissedFonts(t) {
    t && (this.missedFonts[t] || (this.missedFonts[t] = 0), this.missedFonts[t]++, this.events.fontNotFound.dispatch({
      fontName: t,
      count: this.missedFonts[t]
    }));
  }
  /**
   * Loads a single font
   * @param fontInfo - The matadata of the font to be loaded
   */
  async loadFont(t) {
    if (!nh(t.file))
      throw new Error(`Invalid font file name: ${t.file}`);
    const s = this.fontInfoToFontData(t), i = s.name;
    if (this.isFontLoaded(s.name))
      return;
    const r = await is.instance.get(i);
    if (r) {
      const a = qe.instance.createFont(r);
      this.registerFontInMap(i, a);
    } else {
      const a = await this.loader.loadAsync(t.url);
      s.data = a;
      const o = qe.instance.createFont(s);
      o && (t.name.forEach((c) => o.names.add(c)), this.registerFontInMap(i, o), this.enableFontCache && await is.instance.set(i, s));
    }
    this.events.fontLoaded.dispatch({
      fontName: i
    });
  }
  fontInfoToFontData(t) {
    const e = Hr(t.file).toLowerCase(), s = ["ttf", "otf", "woff"].includes(t.type) ? "mesh" : t.type;
    return {
      name: e,
      alias: t.name,
      type: s,
      encoding: t.encoding
    };
  }
  /**
   * Loads all fonts from the cache
   */
  async getAllFontsFromCache() {
    if (this.loadedFontMap.size !== 0)
      return;
    const t = await is.instance.getAll();
    for (const e of t) {
      const { name: s } = e;
      if (this.fileNames && !this.fileNames.includes(s))
        continue;
      const i = qe.instance.createFont(e);
      this.registerFontInMap(s, i);
    }
  }
  /**
   * Registers a loaded font under its primary name and all aliases.
   */
  registerFontInMap(t, e) {
    this.loadedFontMap.set(t.toLowerCase(), e), e.names.forEach((s) => {
      this.loadedFontMap.set(s.toLowerCase(), e);
    });
  }
  /**
   * Gets a record of all unsupported characters across all loaded fonts
   * @returns A record mapping unsupported characters to their occurrence count
   */
  getUnsupportedChar() {
    for (const [, t] of this.loadedFontMap)
      Object.assign(this.unsupportedChars, t.unsupportedChars);
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
  release(t) {
    if (t == null)
      return this.loadedFontMap.clear(), !0;
    const e = this.loadedFontMap.get(t.toLowerCase());
    if (!e)
      return !1;
    for (const [s, i] of this.loadedFontMap)
      i === e && this.loadedFontMap.delete(s);
    return !0;
  }
}
class ey {
  /**
   * Creates a new instance of DefaultFontLoader
   */
  constructor() {
    this._avaiableFonts = [], this._avaiableFontMap = /* @__PURE__ */ new Map(), this._baseUrl = "https://cdn.jsdelivr.net/gh/mlightcad/cad-data/fonts/";
  }
  /**
   * Base URL to load fonts
   */
  get baseUrl() {
    return this._baseUrl;
  }
  set baseUrl(t) {
    this._baseUrl !== t && (this._baseUrl = t, this._avaiableFonts = [], this._avaiableFontMap.clear(), this.onFontUrlChanged(t));
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
  onFontUrlChanged(t) {
  }
  /**
   * Retrieves information about all available fonts in the system.
   * Loads font metadata from a CDN if not already loaded.
   * @returns Promise that resolves to an array of FontInfo objects
   * @throws {Error} If font metadata cannot be loaded from the CDN
   */
  async getAvailableFonts() {
    if (this._avaiableFonts.length == 0) {
      const t = this._baseUrl + "fonts.json";
      try {
        const e = await fetch(t);
        this._avaiableFonts = await e.json();
      } catch (e) {
        throw new Error(
          `Filed to get avaiable font from '${t}' due to ${e}!`
        );
      }
      this._avaiableFonts.forEach((e) => {
        e.url = this._baseUrl + e.file;
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
  async load(t) {
    if (t == null || t.length === 0)
      return [];
    await this.getAvailableFonts();
    const e = [], s = [], i = /* @__PURE__ */ new Map();
    t.forEach((o) => {
      const c = o.toLowerCase(), h = this._avaiableFontMap.get(c);
      h && (i.set(c, h), xe.instance.isFontLoaded(c) && e.push({
        fontName: c,
        url: h.url,
        status: "Success"
      }), s.push(h));
    });
    const r = await xe.instance.loadFonts(s), a = {};
    return [...e, ...r].forEach((o) => {
      a[o.fontName] = o;
    }), t.map((o) => {
      const c = o.toLowerCase(), h = a[c];
      if (h)
        return h;
      const l = i.get(c);
      if (l) {
        if (xe.instance.isFontLoaded(c))
          return {
            fontName: c,
            url: l.url,
            status: "Success"
          };
        const u = Hr(
          l.file
        ).toLowerCase(), f = a[u];
        if (f)
          return {
            fontName: c,
            url: l.url,
            status: f.status
          };
      }
      return {
        fontName: c,
        url: "",
        status: "NotFound"
      };
    });
  }
  /**
   * Build one font map. The key is font name. The value is font info.
   */
  buildFontMap() {
    const t = this._avaiableFontMap;
    this._avaiableFonts.forEach((e) => {
      e.name.forEach((s) => {
        t.set(s.toLowerCase(), e);
      });
    });
  }
}
function ni(n) {
  return Math.max(0, Math.min(16777215, Math.round(n)));
}
function hi(n) {
  const t = n.color, e = t.aci;
  return e === 0 ? ni(n.byBlockColor) : e === 256 ? ni(n.byLayerColor) : e != null ? sh(e) : t.rgbValue !== null ? ni(t.rgbValue) : ni(n.byLayerColor);
}
class ny {
  constructor() {
    this.lineBasicMaterials = {}, this.meshBasicMaterials = {}, this.unsupportedTextStyles = {};
  }
  getMeshBasicMaterial(t) {
    const e = this.buildKey(t);
    if (!this.meshBasicMaterials[e]) {
      const s = hi(t);
      this.meshBasicMaterials[e] = new jc({
        color: s
      });
    }
    return this.meshBasicMaterials[e];
  }
  getLineBasicMaterial(t) {
    const e = this.buildKey(t);
    if (!this.lineBasicMaterials[e]) {
      const s = hi(t);
      this.lineBasicMaterials[e] = new $c({
        color: s
      });
    }
    return this.lineBasicMaterials[e];
  }
  /**
   * Builds a stable material key from traits.
   * Key differs for shader vs basic, ByLayer vs ByEntity.
   */
  buildKey(t) {
    const e = t.color.aci === 256, s = hi(t);
    return e && t.layer ? `layer_${t.layer}_${s}` : `entity_${s}`;
  }
}
var oe = /* @__PURE__ */ ((n) => (n[n.LEFT_TO_RIGHT = 1] = "LEFT_TO_RIGHT", n[n.RIGHT_TO_LEFT = 2] = "RIGHT_TO_LEFT", n[n.TOP_TO_BOTTOM = 3] = "TOP_TO_BOTTOM", n[n.BOTTOM_TO_TOP = 4] = "BOTTOM_TO_TOP", n[n.BY_STYLE = 5] = "BY_STYLE", n))(oe || {}), K = /* @__PURE__ */ ((n) => (n[n.TopLeft = 1] = "TopLeft", n[n.TopCenter = 2] = "TopCenter", n[n.TopRight = 3] = "TopRight", n[n.MiddleLeft = 4] = "MiddleLeft", n[n.MiddleCenter = 5] = "MiddleCenter", n[n.MiddleRight = 6] = "MiddleRight", n[n.BottomLeft = 7] = "BottomLeft", n[n.BottomCenter = 8] = "BottomCenter", n[n.BottomRight = 9] = "BottomRight", n[n.BaselineLeft = 10] = "BaselineLeft", n[n.BaselineCenter = 11] = "BaselineCenter", n[n.BaselineRight = 12] = "BaselineRight", n))(K || {}), ht = /* @__PURE__ */ ((n) => (n.CHAR = "CHAR", n.STACK = "STACK", n))(ht || {});
const li = "", sy = () => ({
  byLayerColor: 16777215,
  byBlockColor: 16777215,
  layer: "0",
  color: new je()
});
function iy(n) {
  if (!(!n || [
    n.min.x,
    n.min.y,
    n.min.z,
    n.max.x,
    n.max.y,
    n.max.z
  ].some((e) => !Number.isFinite(e))))
    return n;
}
function Bc(n, t, e) {
  const s = [];
  if (n.filter((f) => f.char !== li).forEach((f) => {
    const p = iy(
      new Ot().copy(f.box).applyMatrix4(t)
    );
    p && s.push({
      type: ht.CHAR,
      box: p,
      char: f.char,
      children: []
    });
  }), e !== ht.STACK)
    return s;
  const i = (f) => f.type === ht.CHAR && f.char.trim().length === 0, r = (f) => f.type === ht.CHAR && f.char.trim().length > 0, a = s.findIndex(r);
  if (a < 0) return s;
  let o = -1;
  for (let f = s.length - 1; f >= 0; f--)
    if (r(s[f])) {
      o = f;
      break;
    }
  const c = s.slice(0, a).filter(i), h = s.slice(o + 1).filter(i), l = s.slice(a, o + 1).filter(r);
  if (l.length === 0) return [...c, ...h];
  const u = new Ot().copy(l[0].box);
  return l.slice(1).forEach((f) => u.union(f.box)), [
    ...c,
    {
      type: ht.STACK,
      char: "",
      box: u,
      children: l
    },
    ...h
  ];
}
const ry = 1.5, ay = 0.8;
function oy(n, t) {
  return Math.max(
    1,
    ...String(n ?? "").replace(/\\P/g, `
`).replace(/[{}]/g, "").split(/\r?\n/).map((s) => s.length)
  ) * t * ay;
}
function Dc(n) {
  const t = n.width, e = n.height;
  return !Number.isFinite(t) || !Number.isFinite(e) || t <= 0 || e <= 0 || t >= e * ry ? t : oy(n.text, e);
}
const cy = 1.666666, si = 0.3, hy = {
  /** %%c — circle diameter dimensioning symbol (legacy SHX position) */
  c: [129],
  /** %%d — degree symbol (126/176 in amgdt.shx; avoid legacy 127) */
  d: [126, 176],
  /** %%p — plus/minus tolerance symbol (177 in amgdt.shx; avoid legacy 128) */
  p: [177]
}, ly = {
  c: ["∅"],
  // ∅ — AutoCAD .NET diameter; present in amgdt.shx
  d: [],
  p: []
}, yl = {
  Ø: "c",
  // Ø — used by mtext-parser for %%c
  "∅": "c",
  // ∅ — documented in AutoCAD .NET API for diameter
  "°": "d",
  // ° — %%d
  "±": "p"
  // ± — %%p
};
function uy(n) {
  return yl[n] != null;
}
function fy(n) {
  if (n.length !== 1 || uy(n))
    return !1;
  const t = n.charCodeAt(0);
  return t >= 126 && t <= 255;
}
function py(n) {
  const t = yl[n];
  return t == null ? [] : [...hy[t].map(
    (s) => String.fromCharCode(s)
  ), ...ly[t]];
}
const dy = /* @__PURE__ */ new E();
class Aa extends ms {
  /**
   * Creates a new RenderContext instance with optional initial values.
   * @param init - Partial object containing initial values for context properties
   */
  constructor(t) {
    super(), this.fontScaleFactor = 1, this.fontSize = 1, this.fontSizeScaleFactor = 1, this.blankWidth = 0, t && Object.assign(this, t);
  }
  /**
   * Creates a deep copy of the current context.
   * This is useful for saving state before applying formatting changes.
   * @returns A new RenderContext instance with identical property values
   */
  clone() {
    const t = new Aa();
    return t.continueStroke = this.continueStroke, t.color = this.color.copy(), t.align = this.align, t.fontFace = { ...this.fontFace }, t.capHeight = { ...this.capHeight }, t.widthFactor = { ...this.widthFactor }, t.charTrackingFactor = { ...this.charTrackingFactor }, t.oblique = this.oblique, t.paragraph = { ...this.paragraph }, t.fontScaleFactor = this.fontScaleFactor, t.fontSize = this.fontSize, t.fontSizeScaleFactor = this.fontSizeScaleFactor, t.blankWidth = this.blankWidth, t;
  }
  /**
   * Get the current text color as a hexadecimal value for rendering.
   * @returns The color as a hex number (0xRRGGBB)
   */
  getColorAsHex() {
    return this.color.isRgb && this.color.rgbValue !== null ? this.color.rgbValue : this.color.isAci && this.color.aci !== null ? sh(this.color.aci) : 16777215;
  }
  /**
   * Set the color using a hex value for rendering purposes.
   * @param hexColor - The color as a hex number (0xRRGGBB)
   */
  setColorFromHex(t) {
    const e = t >> 16 & 255, s = t >> 8 & 255, i = t & 255;
    this.color.rgb = [e, s, i];
  }
}
class Uc {
  /**
   * Construct one instance of this class and initialize some properties with default values.
   * @param style Input text style
   * @param styleManager Input text style manager instance
   * @param fontManager Input font manager instance
   * @param options Input formating options
   */
  constructor(t, e, s, i, r) {
    this._contextStack = [], this._maxFontSize = 0, this._currentIndent = 0, this._currentLeftMargin = 0, this._currentRightMargin = 0, this._style = t, this._colorSettings = e, this._styleManager = s, this._fontManager = i, this._options = r, this._totalHeight = 0, this._hOffset = 0, this._maxLineAdvance = 0, this._vOffset = 0, this._lineCount = 1, this._currentLineObjects = [], this._currentContext = new Aa({
      fontScaleFactor: this.fontManager.getFontScaleFactor(
        this.textStyle.font.toLowerCase()
      ),
      fontSize: r.fontSize,
      fontSizeScaleFactor: 1,
      italic: !1,
      bold: !1,
      blankWidth: this.calculateBlankWidthForFont(
        this.textStyle.font.toLowerCase(),
        r.fontSize
      )
    }), this._currentContext.setColorFromHex(this.resolveBaseColor()), this._currentContext.fontFace.family = this.textStyle.font.toLowerCase(), this._currentContext.widthFactor = {
      value: r.widthFactor,
      isRelative: !0
    }, this._currentContext.oblique = t.obliqueAngle || 0, this._maxFontSize = 0, this._currentHorizontalAlignment = r.horizontalAlignment, this._lastCharBoxTarget = void 0, this._lineHasRenderableChar = !1, this._pendingEmptyLineFontSizeAdjust = void 0, this._lineLayouts = [], this._lineBreakIndices = [], this._processedCharCount = 0, this._currentIndent = 0, this._currentLeftMargin = 0, this._currentRightMargin = 0, this.initLineParams();
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
   * Maximum logical pen advance across processed visual lines.
   *
   * Unlike visible geometry bounds, this keeps the text insertion origin tied to
   * the layout pen position even when glyphs have side bearings or overhangs.
   */
  get maxLineAdvance() {
    return this._maxLineAdvance;
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
   * The drawing-space text height used for layout calculations.
   *
   * `currentFontSize` includes a font-specific scale factor so glyph outlines
   * from different font formats render at comparable visual sizes.  That scale
   * must not leak into CAD layout metrics such as line height and attachment
   * offsets, otherwise middle/bottom aligned text shifts vertically depending
   * on the active font.
   */
  get currentLayoutFontSize() {
    const t = this._currentContext.fontScaleFactor || 1;
    return this._currentContext.fontSize / t;
  }
  /**
   * The height of current line of texts
   */
  get currentLineHeight() {
    const t = this.defaultLineSpaceFactor * this.currentFontSize * cy, e = this.currentMaxFontSize > 0 ? this.currentMaxFontSize : this.currentFontSize;
    return t + e;
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
  /** Horizontal advance for one space, including tracking and width factor. */
  get currentBlankAdvance() {
    return this._currentContext.blankWidth * this.currentWordSpace * this.currentWidthFactor;
  }
  /**
   * All of THREE.js objects in current line. It contains objects in all of sections of this line.
   */
  get currentLineObjects() {
    return this._currentLineObjects;
  }
  get lineLayouts() {
    return this._lineLayouts;
  }
  /**
   * The horizental offset of current character in this line
   */
  get hOffset() {
    return this._hOffset;
  }
  set hOffset(t) {
    this._hOffset = t;
  }
  /**
   * The vertical offset of current character in this line
   */
  get vOffset() {
    return this._vOffset;
  }
  set vOffset(t) {
    this._vOffset = t;
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
  processFormat(t) {
    if (t.command === void 0) {
      this.applyPropertyChanges(t.changes);
      return;
    }
    switch (t.command) {
      case "f":
      case "F":
        this.applyFontFaceChange(t.changes.fontFace);
        break;
      case "c":
      case "C":
        this.applyColorCommandChanges(t.changes);
        break;
      case "W":
        this.applyWidthFactorChange(t.changes.widthFactor);
        break;
      case "H":
        this.applyCapHeightChange(t.changes.capHeight);
        break;
      case "T":
        this.applyCharTrackingChange(t.changes.charTrackingFactor);
        break;
      case "p":
        this.applyParagraphChange(t.changes.paragraph);
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
        t.changes.oblique !== void 0 && (this._currentContext.oblique = t.changes.oblique);
        break;
    }
  }
  /**
   * Applies a full property snapshot from the parser to the current render context.
   *
   * This is used when the parser emits a restore token (`command === undefined`)
   * after exiting a formatting group `{}`. The `changes` object in that case is
   * not a delta for a specific command; it is the complete property state that
   * should be active after the restore.
   *
   * The method updates:
   * - font face + derived bold/italic/oblique settings
   * - ACI/RGB color and ByLayer/ByBlock resolution
   * - width/height/tracking factors
   * - paragraph alignment and margins
   * - underline/overline/strike-through flags
   */
  applyPropertyChanges(t) {
    this.applyFontFaceChange(t.fontFace), this.applyColorCommandChanges(t), this.applyWidthFactorChange(t.widthFactor), this.applyCapHeightChange(t.capHeight), this.applyCharTrackingChange(t.charTrackingFactor), this.applyParagraphMarginsOnly(t.paragraph), typeof t.underline == "boolean" && (this._currentContext.underline = t.underline), typeof t.overline == "boolean" && (this._currentContext.overline = t.overline), typeof t.strikeThrough == "boolean" && (this._currentContext.strikeThrough = t.strikeThrough), t.oblique !== void 0 && (this._currentContext.oblique = t.oblique);
  }
  /**
   * Apply a font face change to the current render context, including
   * derived bold/italic/oblique settings based on font type.
   * @param fontFace The font face change data from the parser.
   */
  applyFontFaceChange(t) {
    if (!t) return;
    this.changeFont(t.family), this.fontManager.getFontType(
      this._currentContext.fontFace.family
    ) === "mesh" ? (this._currentContext.italic = t.style === "Italic", this._currentContext.bold = (t.weight || 400) >= 700, this._currentContext.oblique = this.textStyle.obliqueAngle || 0) : (this._currentContext.italic = !1, this._currentContext.bold = !1, t.style === "Italic" ? this._currentContext.oblique = 15 : this._currentContext.oblique = this.textStyle.obliqueAngle || 0);
  }
  /**
   * Apply color changes for the inline color command (\c).
   * This variant ignores null ACI and only applies explicit RGB when provided.
   * @param changes The full change object for the current command.
   */
  applyColorCommandChanges(t) {
    t.aci !== void 0 && t.aci !== null ? t.aci === 0 ? this._currentContext.setColorFromHex(this._options.byBlockColor) : t.aci === 256 ? this._currentContext.setColorFromHex(this._options.byLayerColor) : this._currentContext.color.aci = t.aci : t.rgb && (this._currentContext.color.rgb = t.rgb);
  }
  /**
   * Apply color changes from a full snapshot restore.
   * This variant accepts null to switch back to ACI-based color.
   * @param changes The full snapshot of properties to restore.
   */
  applyColorSnapshotChanges(t) {
    t.aci !== void 0 && (t.aci === null ? this._currentContext.color.aci = null : t.aci === 0 ? this._currentContext.setColorFromHex(this._options.byBlockColor) : t.aci === 256 ? this._currentContext.setColorFromHex(this._options.byLayerColor) : this._currentContext.color.aci = t.aci), t.rgb !== void 0 && (this._currentContext.color.rgb = t.rgb);
  }
  /**
   * Apply width factor changes, resolving relative factors to absolute values.
   * @param widthFactor Width factor change data.
   */
  applyWidthFactorChange(t) {
    t && (t.isRelative ? this._currentContext.widthFactor = {
      value: t.value * this.maxWidth,
      isRelative: !1
    } : this._currentContext.widthFactor = {
      value: t.value * 0.85,
      isRelative: !1
    });
  }
  /**
   * Apply cap height changes, either as a relative scale or absolute font height.
   * @param capHeight Cap height change data.
   */
  applyCapHeightChange(t) {
    t && (t.isRelative ? this.changeFontSizeScaleFactor(t.value) : this.changeFontHeight(t.value));
  }
  /**
   * Apply character tracking (spacing) changes.
   * @param charTrackingFactor Character tracking change data.
   */
  applyCharTrackingChange(t) {
    t && (t.isRelative ? this._currentContext.charTrackingFactor = {
      value: t.value + 1,
      isRelative: !1
    } : this._currentContext.charTrackingFactor = {
      value: t.value,
      isRelative: !1
    });
  }
  /**
   * Applies indent and margins from a paragraph snapshot only.
   *
   * Used when exiting `{}` formatting groups: the parser restores full context
   * including `paragraph.align`, but paragraph alignment is not scoped to `{}`
   * (see class comment on `_currentHorizontalAlignment`). Restoring align here
   * would undo an active `\\p...` alignment before the line is finalized.
   */
  applyParagraphMarginsOnly(t) {
    t && (typeof t.indent == "number" && (this._currentIndent = t.indent * this.defaultFontSize, this._hOffset += this._currentIndent), typeof t.left == "number" && (this._currentLeftMargin = t.left * this.defaultFontSize), typeof t.right == "number" && (this._currentRightMargin = t.right * this.defaultFontSize));
  }
  /**
   * Apply paragraph-level changes such as alignment and margins.
   * @param paragraph Paragraph change data.
   */
  applyParagraphChange(t) {
    t && ("align" in t && (this._currentHorizontalAlignment = t.align), typeof t.indent == "number" && (this._currentIndent = t.indent * this.defaultFontSize, this._hOffset += this._currentIndent), typeof t.left == "number" && (this._currentLeftMargin = t.left * this.defaultFontSize), typeof t.right == "number" && (this._currentRightMargin = t.right * this.defaultFontSize));
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
  startNewParagraph(t, e, s, i, r) {
    this.recordVisualLineBreak(s, i), this.processGeometries(
      t,
      e,
      s,
      i,
      r
    ), this.advanceToNextLine(!1), this.resetParagraphProperties();
  }
  /**
   * Renders one SHX shape glyph for AutoCAD SHAPE entities.
   *
   * The glyph is resolved by {@link shapeName} first, then by {@link shapeNumber}.
   */
  processShapeGlyph(t, e) {
    const s = this.resolveShapeGlyph(t, e);
    if (!s)
      return;
    const i = [], r = [], a = [], o = [], c = this.flowDirection === oe.BOTTOM_TO_TOP ? 0 : -this.currentLayoutFontSize, h = this.buildShapeGeometry(
      s.shape,
      s.label,
      0,
      c,
      i,
      r,
      a,
      o
    );
    this._totalHeight = this.currentLayoutFontSize, this._maxFontSize = this.currentLayoutFontSize, this._maxLineAdvance = h;
    const l = this.toThreeObject(
      i,
      r,
      a,
      o,
      ht.CHAR
    );
    return l && (l.userData.logicalAdvanceWidth = h), l;
  }
  resolveShapeGlyph(t, e) {
    const s = this.currentLayoutFontSize, i = this.textStyle.font.toLowerCase(), r = t == null ? void 0 : t.trim(), a = e != null && e !== 0;
    if (r) {
      const o = this.fontManager.getShapeByName(r, i, s);
      if (o)
        return { shape: o, label: r };
    }
    if (a) {
      const o = this.fontManager.getShapeByCode(e, i, s);
      if (o)
        return { shape: o, label: String.fromCharCode(e) };
    }
  }
  /**
   * Builds geometry for one glyph and appends it to the output buffers.
   *
   * @returns Horizontal advance width after width factor and oblique skew.
   */
  buildShapeGeometry(t, e, s, i, r, a, o, c) {
    const h = t.toGeometry();
    h.scale(this.currentWidthFactor, 1, 1);
    const l = this.currentLayoutFontSize;
    let u = this._currentContext.oblique;
    this._currentContext.italic && (u += 15);
    let f = 0;
    if (u) {
      const d = u * Math.PI / 180, g = new Rt();
      g.set(
        1,
        Math.tan(d),
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
      ), h.applyMatrix4(g), f = Math.tan(d) * l;
    }
    const p = this.fontManager.getFontType(this.currentFont);
    if (this._currentContext.bold && p === "mesh" && h.scale(1.06, 1.06, 1), h.translate(s, i, 0), r.push(h), this._options.collectCharBoxes !== !1) {
      h.userData.char = e, h.boundingBox || h.computeBoundingBox();
      const d = new Ot().copy(h.boundingBox);
      h instanceof on ? o.push({
        type: ht.CHAR,
        box: d,
        char: e,
        children: []
      }) : c.push({
        type: ht.CHAR,
        box: d,
        char: e,
        children: []
      });
    }
    return t.width * this.currentWidthFactor + f * this.currentWidthFactor;
  }
  /**
   * Render the specified texts
   * @param item Input texts to render
   */
  processText(t) {
    this._lastCharBoxTarget = void 0;
    const e = [], s = [], i = [], r = [], a = new co();
    for (const o of t)
      if (o.type === rt.NEW_PARAGRAPH)
        this.startNewParagraph(
          e,
          s,
          i,
          r,
          a
        );
      else if (o.type === rt.WORD) {
        const c = o.data;
        Array.isArray(c) ? c.forEach(
          (h) => this.processWord(
            h,
            e,
            s,
            i,
            r
          )
        ) : typeof c == "string" && c.length > 0 && this.processWord(
          c,
          e,
          s,
          i,
          r
        );
      } else if (o.type === rt.SPACE)
        this.processBlank(i, r);
      else if (o.type === rt.PROPERTIES_CHANGED) {
        this.processGeometries(
          e,
          s,
          i,
          r,
          a
        );
        const c = o.data;
        if (c.command === void 0) {
          for (; this._contextStack.length > c.depth; )
            this._currentContext = this._contextStack.pop();
          this.processFormat(c);
        } else {
          for (; this._contextStack.length < c.depth; )
            this._contextStack.push(this._currentContext.clone());
          this.processFormat(c);
        }
      } else if (o.type === rt.STACK) {
        this.processGeometries(
          e,
          s,
          i,
          r,
          a
        );
        const c = o.data;
        this.processStack(
          c,
          e,
          s,
          i,
          r
        );
        const h = c[2] === "^" ? ht.CHAR : ht.STACK;
        this.processGeometries(
          e,
          s,
          i,
          r,
          a,
          h
        );
      }
    return e.length > 0 || s.length > 0 ? this.processGeometries(
      e,
      s,
      i,
      r,
      a
    ) : (i.length > 0 || r.length > 0) && this.processGeometries(
      e,
      s,
      i,
      r,
      a
    ), this.processLastLine(), this.captureCurrentLineAdvance(), this.recordCurrentLineLayout(), a.userData.lineLayouts = this._lineLayouts.map((o, c) => ({
      ...o,
      breakIndex: c < this._lineLayouts.length - 1 ? this._lineBreakIndices[c] : void 0
    })), a.userData.logicalAdvanceWidth = this._maxLineAdvance, a;
  }
  processGeometries(t, e, s, i, r, a = ht.CHAR) {
    const o = this.countFinalCharBoxes(
      s,
      i,
      a
    );
    if (t.length > 0 || e.length > 0) {
      const c = this.toThreeObject(
        t,
        e,
        s,
        i,
        a
      );
      r.add(c), this._currentLineObjects.push(c), t.length = 0, e.length = 0, s.length = 0, i.length = 0, this._processedCharCount += o;
    } else if (s.length > 0 || i.length > 0) {
      const c = new jt();
      c.userData.bboxIntersectionCheck = !0, c.userData.charBoxType = a, c.userData.layout = {
        chars: [...s, ...i]
      }, r.add(c), this._currentLineObjects.push(c), s.length = 0, i.length = 0, this._processedCharCount += o;
    }
  }
  processWord(t, e, s, i, r) {
    let a = 0;
    for (let o = 0; o < t.length; o++) {
      const c = this.getCharShape(t[o]);
      c ? this.currentHorizontalAlignment == ot.DISTRIBUTED ? a += c.width * this.currentWidthFactor : a += c.width * this.currentWordSpace * this.currentWidthFactor : a += this.currentBlankAdvance;
    }
    this.hOffset + a > (this.maxLineWidth || 1 / 0) && (this._vOffset <= 0 && this._currentLineObjects.length <= 0 || (this.recordVisualLineBreak(i, r), this.advanceToNextLine(!1)));
    for (let o = 0; o < t.length; o++)
      this.processChar(
        t[o],
        e,
        s,
        i,
        r
      );
  }
  processStack(t, e, s, i, r) {
    const [a, o, c] = t, h = this._hOffset, l = this._vOffset, u = this._currentContext.charTrackingFactor.value, f = this.currentFontSize, p = this._currentContext.fontSizeScaleFactor;
    this._hOffset = h, this._currentContext.charTrackingFactor = { value: 1, isRelative: !1 };
    let d = 0;
    for (let S = 0; S < a.length; S++) {
      const w = this.getCharShape(a[S]);
      w && (d += w.width * this.currentWidthFactor);
    }
    this._hOffset = h;
    let g = 0;
    for (let S = 0; S < o.length; S++) {
      const w = this.getCharShape(o[S]);
      w && (g += w.width * this.currentWidthFactor);
    }
    const x = Math.max(d, g), b = (x - d) / 2, v = (x - g) / 2;
    if (c === "^") {
      if (a && !o) {
        this._currentContext.fontSizeScaleFactor = p * 0.7, this.calcuateLineParams();
        const S = [], w = [], k = [], M = [];
        this._hOffset = h, this._vOffset = this.convertTopAlignedVOffset(
          l + f * 0.1,
          this.currentFontSize
        );
        for (let O = 0; O < a.length; O++)
          this.processChar(
            a[O],
            S,
            w,
            k,
            M
          );
        e.push(...S), s.push(...w), i.push(...k), r.push(...M), this._hOffset = h + d, this._currentContext.fontSizeScaleFactor = p, this.calcuateLineParams();
      } else if (!a && o) {
        this._currentContext.fontSizeScaleFactor = p * 0.7, this.calcuateLineParams();
        const S = [], w = [], k = [], M = [];
        this._hOffset = h, this._vOffset = this.convertTopAlignedVOffset(
          l - f * 0.6,
          this.currentFontSize
        );
        for (let O = 0; O < o.length; O++)
          this.processChar(
            o[O],
            S,
            w,
            k,
            M
          );
        e.push(...S), s.push(...w), i.push(...k), r.push(...M), this._hOffset = h + g, this._currentContext.fontSizeScaleFactor = p, this.calcuateLineParams();
      } else if (a && o) {
        const S = this._currentContext.fontScaleFactor || 1, w = (this._maxFontSize || this.currentFontSize) / S, k = Math.abs(this.currentLayoutFontSize - w) < 1e-6;
        k && (this._currentContext.fontSizeScaleFactor = p * 0.7, this.calcuateLineParams());
        const M = Math.max(d, g), O = 0, I = 0, V = this.currentLayoutFontSize, D = l - w + V, W = D + this.currentFontSize, J = [], B = [], U = [], P = [];
        this._hOffset = h + O, this._vOffset = W;
        for (let it = 0; it < a.length; it++)
          this.processChar(
            a[it],
            J,
            B,
            U,
            P
          );
        e.push(...J), s.push(...B), i.push(...U), r.push(...P);
        const Q = [], gt = [], Dt = [], St = [];
        this._hOffset = h + I, this._vOffset = D;
        for (let it = 0; it < o.length; it++)
          this.processChar(
            o[it],
            Q,
            gt,
            Dt,
            St
          );
        e.push(...Q), s.push(...gt), i.push(...Dt), r.push(...St), this._hOffset = h + M, k && (this._currentContext.fontSizeScaleFactor = p, this.calcuateLineParams());
      }
    } else {
      const S = [], w = [], k = [], M = [];
      this._hOffset = h + b, this._vOffset = this.convertTopAlignedVOffset(
        l + this.currentFontSize * 0.3,
        this.currentFontSize
      );
      for (let W = 0; W < a.length; W++)
        this.processChar(
          a[W],
          S,
          w,
          k,
          M
        );
      e.push(...S), s.push(...w), i.push(...k), r.push(...M), (c === "/" || c === "#") && this.recordStackDivider(
        h,
        l,
        x,
        i,
        r
      );
      const O = [], I = [], V = [], D = [];
      this._hOffset = h + v, this._vOffset = this.convertTopAlignedVOffset(
        l - this.currentFontSize * 0.6,
        this.currentFontSize
      );
      for (let W = 0; W < o.length; W++)
        this.processChar(
          o[W],
          O,
          I,
          V,
          D
        );
      if (e.push(...O), s.push(...I), i.push(...V), r.push(...D), c === "/" || c === "#") {
        const W = new Ht(), J = new Float32Array([
          h,
          l - this.currentFontSize * 0.8 + this.defaultFontSize * si,
          0,
          h + x,
          l - this.currentFontSize * 0.8 + this.defaultFontSize * si,
          0
        ]);
        W.setAttribute(
          "position",
          new he(J, 3)
        ), W.setIndex(null), W.userData = { isDecoration: !0 }, s.push(W);
      }
      this._hOffset = h + x;
    }
    this._vOffset = l, this._currentContext.charTrackingFactor = {
      value: u,
      isRelative: !1
    };
  }
  recordStackDivider(t, e, s, i, r) {
    if (this._options.collectCharBoxes === !1) return;
    const a = e - this.currentFontSize * 0.8 + this.defaultFontSize * si, o = new Ot(
      new E(t, a, 0),
      new E(t + s, a, 0)
    );
    this.resolveCharBoxTarget(i, r) === "mesh" ? i.push({
      type: ht.CHAR,
      box: o,
      char: li,
      children: []
    }) : r.push({
      type: ht.CHAR,
      box: o,
      char: li,
      children: []
    });
  }
  /**
   * Convert a legacy top-anchored vOffset (used by stack/sub/sup logic) into
   * the current baseline-anchored coordinate system.
   */
  convertTopAlignedVOffset(t, e) {
    return t - e + this.defaultFontSize + this.defaultFontSize * si;
  }
  processBlank(t, e) {
    if (this._options.collectCharBoxes !== !1) {
      const s = this._hOffset, i = this.flowDirection == oe.BOTTOM_TO_TOP ? this._vOffset : this._vOffset - this.currentLayoutFontSize, r = new Ot(
        new E(s, i, 0),
        new E(
          s + this.currentBlankAdvance,
          i + this.currentLayoutFontSize,
          0
        )
      );
      this.resolveCharBoxTarget(t, e) === "mesh" ? t.push({
        type: ht.CHAR,
        box: r,
        char: " ",
        children: []
      }) : e.push({
        type: ht.CHAR,
        box: r,
        char: " ",
        children: []
      });
    }
    this._hOffset += this.currentBlankAdvance;
  }
  recordVisualLineBreak(t, e) {
    const s = this._processedCharCount + this.countFinalCharBoxes(
      t ?? [],
      e ?? [],
      ht.CHAR
    );
    this._lineBreakIndices.push(s);
  }
  recordCurrentLineLayout() {
    const t = this.flowDirection == oe.BOTTOM_TO_TOP ? this._vOffset : this._vOffset - this.defaultFontSize, e = this.currentLineHeight;
    this._lineLayouts.push({
      y: t + e / 2,
      height: e
    });
  }
  processChar(t, e, s, i, r) {
    const a = this.getCharShape(t);
    if (!a) {
      this.processBlank(i, r);
      return;
    }
    this._lineHasRenderableChar || this.applyPendingEmptyLineYAdjust();
    const o = a.toGeometry();
    o.scale(this.currentWidthFactor, 1, 1);
    const c = this.currentLayoutFontSize;
    let h = this._currentContext.oblique;
    this._currentContext.italic && (h += 15);
    let l = 0;
    if (h) {
      const v = h * Math.PI / 180, S = new Rt();
      S.set(
        1,
        Math.tan(v),
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
      ), o.applyMatrix4(S), l = Math.tan(v) * c;
    }
    const u = this.fontManager.getFontType(this.currentFont);
    this._currentContext.bold && u === "mesh" && o.scale(1.06, 1.06, 1), this.hOffset > (this.maxLineWidth || 1 / 0) && (this.recordVisualLineBreak(i, r), this.advanceToNextLine(!1));
    const f = this.hOffset, p = this.flowDirection == oe.BOTTOM_TO_TOP ? this.vOffset : this.vOffset - this.currentLayoutFontSize, d = a.width * this.currentWidthFactor;
    o.translate(f, p, 0);
    const g = a.width * this.currentWidthFactor + l * this.currentWidthFactor;
    if (this.currentHorizontalAlignment == ot.DISTRIBUTED ? this._hOffset += g : this._hOffset += a.width * this.currentWordSpace * this.currentWidthFactor + l * this.currentWidthFactor, e.push(o), this._lineHasRenderableChar = !0, this._options.collectCharBoxes !== !1) {
      o.userData.char = t, o.boundingBox || o.computeBoundingBox();
      const v = new Ot().copy(o.boundingBox);
      o instanceof on ? (this._lastCharBoxTarget = "mesh", i.push({
        type: ht.CHAR,
        box: v,
        char: t,
        children: []
      })) : (this._lastCharBoxTarget = "line", r.push({
        type: ht.CHAR,
        box: v,
        char: t,
        children: []
      }));
    }
    const x = c * 0.05, b = 1e-3;
    if (this._currentContext.underline) {
      const v = new Ht(), S = p - x;
      v.setAttribute(
        "position",
        new he(
          new Float32Array([
            f,
            S,
            b,
            f + d,
            S,
            b
          ]),
          3
        )
      ), v.setIndex(null), v.userData = { isDecoration: !0 }, s.push(v);
    }
    if (this._currentContext.overline) {
      const v = new Ht(), S = p + c + x;
      v.setAttribute(
        "position",
        new he(
          new Float32Array([
            f,
            S,
            b,
            f + d,
            S,
            b
          ]),
          3
        )
      ), v.setIndex(null), v.userData = { isDecoration: !0 }, s.push(v);
    }
    if (this._currentContext.strikeThrough) {
      const v = new Ht(), S = p + c / 2 - c * 0.2;
      v.setAttribute(
        "position",
        new he(
          new Float32Array([
            f,
            S,
            b,
            f + d,
            S,
            b
          ]),
          3
        )
      ), v.setIndex(null), v.userData = { isDecoration: !0 }, s.push(v);
    }
  }
  processLastLine() {
    this.processAlignment();
  }
  initLineParams() {
    this.calcuateLineParams();
  }
  changeFont(t) {
    let e = t;
    this._options.removeFontExtension && (e = t.replace(/\.(ttf|otf|woff|shx)$/, "")), this._currentContext.fontFace.family = this.fontManager.findAndReplaceFont(e), this.calcuateLineParams(), this._currentContext.blankWidth = this.calculateBlankWidthForFont(
      this._currentContext.fontFace.family,
      this.currentLayoutFontSize
    );
  }
  /**
   * Calcuate font size, line space, line height and other parameters.
   */
  calcuateLineParams(t) {
    this._currentContext.fontScaleFactor = this.fontManager.getFontScaleFactor(
      this.currentFont
    );
    const e = t || this.defaultFontSize || this.textStyle.fixedTextHeight;
    this._currentContext.fontSize = e * this._currentContext.fontScaleFactor * this._currentContext.fontSizeScaleFactor;
  }
  /**
   * Get text shape of the specified character
   * @param char Input one character
   * @returns Return the text shape of the specified character
   */
  shapeHasStrokeGeometry(t, e) {
    var r;
    return typeof t.toGeometry != "function" ? t.width > 0 : (((r = t.toGeometry().getAttribute("position")) == null ? void 0 : r.count) ?? 0) > 0 ? !0 : e === " " && t.width > 0;
  }
  getCharShape(t) {
    var i;
    for (const r of py(t)) {
      const a = this.fontManager.getCharShapeFromSymbolFonts(
        r,
        this.currentFontSize
      );
      if (a && this.shapeHasStrokeGeometry(a, t))
        return this.currentFontSize > this._maxFontSize && (this._maxFontSize = this.currentFontSize), a;
    }
    if (fy(t)) {
      const r = this.fontManager.getCharShapeFromSymbolFonts(
        t,
        this.currentFontSize
      );
      if (r && this.shapeHasStrokeGeometry(r, t))
        return this.currentFontSize > this._maxFontSize && (this._maxFontSize = this.currentFontSize), r;
    }
    let e = this.fontManager.getCharShape(
      t,
      this.currentFont,
      this.currentFontSize
    );
    const s = (i = this.textStyle.bigFont) == null ? void 0 : i.trim();
    return s && !e && (e = this.fontManager.getCharShape(
      t,
      s,
      this.currentFontSize
    )), e || (e = this.fontManager.getCharShapeFromDefaults(
      t,
      this.currentFontSize
    )), e || (e = this.fontManager.getCharShapeFromSymbolFonts(
      t,
      this.currentFontSize
    )), (!e || !this.shapeHasStrokeGeometry(e, t)) && (e = this.fontManager.getNotFoundTextShape(this.currentFontSize)), this.currentFontSize > this._maxFontSize && (this._maxFontSize = this.currentFontSize), e;
  }
  advanceToNextLine(t = !0) {
    t && this.recordVisualLineBreak(), this.captureCurrentLineAdvance(), this.recordCurrentLineLayout(), this._hOffset = 0, this._lineHasRenderableChar ? this._pendingEmptyLineFontSizeAdjust = void 0 : this._pendingEmptyLineFontSizeAdjust = this.currentFontSize, this.flowDirection == oe.BOTTOM_TO_TOP ? this._vOffset += this.currentLineHeight : this._vOffset -= this.currentLineHeight, this._lineCount++, this.processAlignment(), this._currentLineObjects = [], this._lineCount == 2 ? this._totalHeight = this.currentMaxFontSize : this._totalHeight = this._totalHeight + this.currentLineHeight, this._maxFontSize = 0, this._lineHasRenderableChar = !1;
  }
  captureCurrentLineAdvance() {
    Number.isFinite(this._hOffset) && (this._maxLineAdvance = Math.max(this._maxLineAdvance, this._hOffset));
  }
  countFinalCharBoxes(t, e, s) {
    const i = [...t, ...e].filter(
      (u) => u.char !== li
    );
    if (s !== ht.STACK)
      return i.length;
    const r = (u) => u.type === ht.CHAR && u.char.trim().length === 0, a = (u) => u.type === ht.CHAR && u.char.trim().length > 0, o = i.findIndex(a);
    if (o < 0) return i.filter(r).length;
    let c = -1;
    for (let u = i.length - 1; u >= 0; u--)
      if (a(i[u])) {
        c = u;
        break;
      }
    const h = i.slice(0, o).filter(r), l = i.slice(c + 1).filter(r);
    return h.length + 1 + l.length;
  }
  applyPendingEmptyLineYAdjust() {
    if (this._pendingEmptyLineFontSizeAdjust === void 0) return;
    const t = this.currentFontSize - this._pendingEmptyLineFontSizeAdjust;
    t !== 0 && (this.flowDirection == oe.BOTTOM_TO_TOP ? this._vOffset += t : this._vOffset -= t), this._pendingEmptyLineFontSizeAdjust = void 0;
  }
  resolveCharBoxTarget(t, e) {
    return this._lastCharBoxTarget ? this._lastCharBoxTarget : t.length > 0 && e.length === 0 ? "mesh" : e.length > 0 && t.length === 0 ? "line" : this.fontManager.getFontType(this.currentFont) === "mesh" ? "mesh" : "line";
  }
  /**
   * Apply translation on the specified buffer geometries according to text alignment setting
   */
  processAlignment() {
    const t = [];
    if (this.currentLineObjects.forEach(
      (o) => o.traverse((c) => {
        "geometry" in c && t.push({
          geometry: c.geometry,
          owner: c
        });
      })
    ), t.length == 0) return;
    let e;
    if (t.forEach((o, c) => {
      o.geometry.boundingBox || o.geometry.computeBoundingBox(), c === 0 ? e = o.geometry.boundingBox : e.union(o.geometry.boundingBox);
    }), !e) return;
    const s = e, i = s.getSize(dy), r = (o, c) => {
      var l, u;
      const h = (u = (l = o.userData) == null ? void 0 : l.layout) == null ? void 0 : u.chars;
      if (h && h.length > 0) {
        const f = new E(c, 0, 0);
        h.forEach((p) => {
          var d;
          return (d = p.box) == null ? void 0 : d.translate(f);
        });
      }
    }, a = () => {
      const o = Number.isFinite(this.maxLineWidth) ? this._currentLeftMargin - s.min.x : this._currentLeftMargin, c = /* @__PURE__ */ new Set();
      t.forEach((h) => {
        h.geometry.translate(o, 0, 0), c.has(h.owner) || (r(h.owner, o), c.add(h.owner));
      });
    };
    switch (this.currentHorizontalAlignment) {
      case ot.LEFT:
      case ot.JUSTIFIED: {
        a();
        break;
      }
      case ot.CENTER: {
        if (!Number.isFinite(this.maxLineWidth)) {
          a();
          break;
        }
        const o = this._currentLeftMargin + (this.maxLineWidth - i.x) / 2 - s.min.x, c = /* @__PURE__ */ new Set();
        t.forEach((h) => {
          h.geometry.translate(o, 0, 0), c.has(h.owner) || (r(h.owner, o), c.add(h.owner));
        });
        break;
      }
      case ot.RIGHT: {
        if (!Number.isFinite(this.maxLineWidth)) {
          a();
          break;
        }
        const o = this._currentLeftMargin + this.maxLineWidth - i.x - s.min.x, c = /* @__PURE__ */ new Set();
        t.forEach((h) => {
          h.geometry.translate(o, 0, 0), c.has(h.owner) || (r(h.owner, o), c.add(h.owner));
        });
        break;
      }
      case ot.DISTRIBUTED: {
        if (!Number.isFinite(this.maxLineWidth)) {
          a();
          break;
        }
        const o = t.length > 1 ? (this.maxLineWidth - i.x) / (t.length - 1) : 0, c = /* @__PURE__ */ new Set();
        t.forEach((h, l) => {
          const u = o * l + (this._currentLeftMargin - s.min.x);
          h.geometry.translate(u, 0, 0), c.has(h.owner) || (r(h.owner, u), c.add(h.owner));
        });
        break;
      }
    }
  }
  /**
   * Resolves horizontal advance for an ASCII space in the active font.
   *
   * AutoCAD uses each font's own space glyph metrics (SHX pen advance or TrueType
   * horizontal advance). A fixed fraction of text height (e.g. 50% for SHX) is only
   * a rough fallback when the font has no space definition.
   */
  calculateBlankWidthForFont(t, e) {
    const s = this.fontManager.getCharShape(" ", t, e);
    return s && s.width > 0 ? s.width : this.fontManager.getFontType(t) === "shx" ? e * 0.5 : e * 0.3;
  }
  /**
   * Merges line-based geometries for LineSegments. SHX glyphs use indexed
   * BufferGeometry while fraction/divider decorations omit an index; normalize
   * to non-indexed form so mergeGeometries accepts the batch.
   */
  mergeLineGeometries(t) {
    const e = t.map(
      (s) => s.index != null ? s.toNonIndexed() : s
    );
    return e.length > 1 ? dc(e) ?? e[0] : e[0];
  }
  /**
   * Convert the text shape geometries to three.js object
   * @param geometries Input text shape geometries
   * @returns Return three.js object created from the specified text shape geometries
   */
  toThreeObject(t, e, s, i, r) {
    const a = new co(), o = this.getMaterialColorSettings(), c = this.styleManager.getMeshBasicMaterial(
      o
    ), h = this.styleManager.getLineBasicMaterial(
      o
    ), l = this._options.collectCharBoxes !== !1, u = t.filter((p) => p instanceof on);
    if (u.length > 0) {
      const p = u.length > 1 ? dc(u) : u[0], d = new os(p, c);
      d.userData.bboxIntersectionCheck = !0, d.userData.charBoxType = r, l && s.length > 0 && (d.userData.layout = { chars: s.slice() }), a.add(d);
    }
    const f = [
      ...e,
      ...t.filter((p) => !(p instanceof on))
    ];
    if (f.length > 0) {
      const p = this.mergeLineGeometries(f), d = new eu(p, h);
      d.userData.bboxIntersectionCheck = !0, d.userData.charBoxType = r, l && i.length > 0 && (d.userData.layout = { chars: i.slice() }), a.add(d);
    }
    return a.children.length === 1 ? a.children[0] : a;
  }
  changeFontSizeScaleFactor(t) {
    this._currentContext.fontSizeScaleFactor *= t, this.calcuateLineParams();
  }
  changeFontHeight(t) {
    this.calcuateLineParams(t);
  }
  resolveBaseColor() {
    return hi(this._colorSettings);
  }
  getMaterialColorSettings() {
    return {
      byLayerColor: this._colorSettings.byLayerColor,
      byBlockColor: this._colorSettings.byBlockColor,
      layer: this._colorSettings.layer,
      color: this._currentContext.color.copy()
    };
  }
}
const gy = [
  [/%%koff/gi, "\\k"],
  [/%%kon/gi, "\\K"],
  [/%%ooff/gi, "\\o"],
  [/%%oon/gi, "\\O"],
  [/%%uoff/gi, "\\l"],
  [/%%uon/gi, "\\L"]
], my = /%%([kou])/gi;
function yy(n) {
  let t = n;
  for (const [r, a] of gy)
    t = t.replace(r, a);
  let e = !1, s = !1, i = !1;
  return t.replace(my, (r, a) => {
    switch (a.toLowerCase()) {
      case "k":
        return e = !e, e ? "\\K" : "\\k";
      case "o":
        return s = !s, s ? "\\O" : "\\o";
      case "u":
        return i = !i, i ? "\\L" : "\\l";
      default:
        return `%%${a}`;
    }
  });
}
const ts = /* @__PURE__ */ new E(), Me = /* @__PURE__ */ new E(), Oe = /* @__PURE__ */ new E(), Pc = /* @__PURE__ */ new E(1, 0, 0);
class Fa extends jt {
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
  static getFonts(t, e = !1) {
    return kl(t, e);
  }
  /**
   * Creates a new instance of MText.
   * @param text - The MText data containing text content and properties
   * @param style - The text style configuration
   * @param styleManager - The style manager instance
   * @param fontManager - The font manager instance
   * @param colorSettings - Color settings used to decided font color
   */
  constructor(t, e, s, i, r = sy()) {
    super(), this._style = e, this._styleManager = s, this._fontManager = i, this._colorSettings = {
      byLayerColor: r.byLayerColor,
      byBlockColor: r.byBlockColor,
      layer: r.layer,
      color: r.color.copy()
    }, this._box = new Ot(), this._layoutData = void 0, this._mtextData = t, this._fontsInStyleLoaded = !1;
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
    const t = Array.from(Fa.getFonts(this._mtextData.text || "", !0));
    if (!this._fontsInStyleLoaded) {
      if (this._style.font) {
        const e = this.getFontName(this._style.font);
        e && t.push(e);
      }
      if (this._style.bigFont) {
        const e = this.getFontName(this._style.bigFont);
        e && t.push(e);
      }
      if (this._style.extendedFont) {
        const e = this.getFontName(this._style.extendedFont);
        e && t.push(e);
      }
    }
    t.length > 0 && (await this._fontManager.loadFontsByNames(t), this._fontsInStyleLoaded = !0), this.syncDraw();
  }
  /**
   * Draw the MText object. This method assumes that fonts needed are loaded. If font needed
   * not found, the default font will be used.
   */
  syncDraw() {
    const t = this.loadMText(this._mtextData, this._style);
    if (t) {
      this._layoutData = void 0, this._box.makeEmpty();
      const e = {
        hasLine: !1,
        minX: 1 / 0,
        maxX: -1 / 0,
        minY: 1 / 0,
        maxY: -1 / 0,
        minZ: 1 / 0,
        maxZ: -1 / 0,
        hasLogicalBounds: !1
      };
      this.updateBoxFromObject(t, e), e.hasLine && !e.hasLogicalBounds && (this.box.isEmpty() ? (this.box.min.set(e.minX, e.minY, e.minZ), this.box.max.set(e.maxX, e.maxY, e.maxZ)) : (this.box.min.y = Math.min(this.box.min.y, e.minY), this.box.max.y = Math.max(this.box.max.y, e.maxY))), this.add(t);
    }
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
  set box(t) {
    this._box.copy(t);
  }
  /** Creates text layout data for cursor/picking/debug usage on demand. */
  createLayoutData() {
    if (this._layoutData)
      return this._layoutData;
    const t = { lines: [], chars: [] };
    return this.updateWorldMatrix(!0, !0), this.getLayout(this, t.chars, t.lines), this._layoutData = t, t;
  }
  /**
   * Calculates intersections between a ray and this MText object.
   * Overrides the base THREE.Object3D raycast method to use the text's bounding boxes.
   * @param raycaster - The raycaster to use for intersection testing
   * @param intersects - Array to store intersection results
   */
  raycast(t, e) {
    this.createLayoutData().chars.forEach((i) => {
      if (i.box && t.ray.intersectBox(i.box, ts)) {
        const r = t.ray.origin.distanceTo(ts);
        e.push({
          distance: r,
          point: ts.clone(),
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
  loadMText(t, e) {
    const { object: s, height: i } = this.createMTextGroup(
      t,
      e
    );
    if (s)
      return this.finalizePlacement(s, t, i);
  }
  /**
   * Builds and places one SHX shape glyph.
   */
  loadShape(t, e) {
    const { object: s, height: i } = this.createShapeGroup(
      t,
      e
    );
    if (!s)
      return;
    const r = {
      text: "",
      height: t.size,
      width: 1 / 0,
      widthFactor: t.widthFactor ?? e.widthFactor ?? 1,
      position: t.position,
      rotation: t.rotation,
      directionVector: t.directionVector,
      attachmentPoint: K.BaselineLeft,
      drawingDirection: oe.BOTTOM_TO_TOP,
      collectCharBoxes: !1
    };
    return this.finalizePlacement(s, r, i);
  }
  finalizePlacement(t, e, s) {
    var f;
    let i = Dc(e);
    t.updateWorldMatrix(!0, !0);
    const r = new Ot().setFromObject(t);
    if (!Number.isFinite(i)) {
      const p = (f = t.userData) == null ? void 0 : f.logicalAdvanceWidth, d = typeof p == "number" && p > 0 ? p : r.max.x - r.min.x;
      i = Number.isFinite(d) && d > 0 ? d : 0;
    }
    const a = this.measureAnchorMetrics(
      t,
      i,
      s,
      r,
      e.drawingDirection
    ), o = this.calculateAnchorPoint(
      a,
      e.attachmentPoint
    );
    t.userData.logicalBounds = {
      minX: a.minX + o.x,
      maxX: a.maxX + o.x,
      minY: a.minY + o.y,
      maxY: a.maxY + o.y
    };
    const c = (p) => {
      if (!p || p.length === 0) return;
      const d = new E(o.x, o.y, 0), g = (x) => {
        var b;
        (b = x.box) == null || b.translate(d), x.children && x.children.length > 0 && x.children.forEach(g);
      };
      p.forEach(g);
    }, h = (p) => {
      !p || p.length === 0 || p.forEach((d) => {
        d.y += o.y;
      });
    };
    t.traverse((p) => {
      var d, g, x;
      if ("geometry" in p) {
        const b = p.geometry;
        Number.isFinite(o.x) && Number.isFinite(o.y) && b.translate(o.x, o.y, 0);
      }
      c(
        (g = (d = p.userData) == null ? void 0 : d.layout) == null ? void 0 : g.chars
      ), h(
        (x = p.userData) == null ? void 0 : x.lineLayouts
      ), p.layers.enableAll();
    });
    let l = e.rotation || 0;
    if (e.directionVector) {
      const p = e.directionVector, d = new E(p.x, p.y, p.z), g = d.clone().cross(Pc), x = Pc.angleTo(d);
      l = g.z > 0 ? -x : x;
    }
    const u = e.position;
    return t.position.set((u == null ? void 0 : u.x) ?? 0, (u == null ? void 0 : u.y) ?? 0, (u == null ? void 0 : u.z) ?? 0), t.quaternion.setFromAxisAngle(new E(0, 0, 1), l), t.scale.set(1, 1, 1), t.updateMatrix(), t.updateMatrixWorld(!0), t;
  }
  createShapeGroup(t, e) {
    const s = t.size || e.fixedTextHeight || 0, i = t.widthFactor ?? e.widthFactor ?? 1, r = {
      fontSize: s,
      widthFactor: i,
      lineSpaceFactor: 0.3,
      horizontalAlignment: ot.LEFT,
      maxWidth: 0,
      flowDirection: oe.BOTTOM_TO_TOP,
      byBlockColor: this._colorSettings.byBlockColor,
      byLayerColor: this._colorSettings.byLayerColor,
      removeFontExtension: !0,
      collectCharBoxes: !1
    }, a = new Uc(
      e,
      this._colorSettings,
      this._styleManager,
      this._fontManager,
      r
    );
    return {
      object: a.processShapeGlyph(
        t.name,
        t.shapeNumber
      ),
      height: a.totalHeight
    };
  }
  /**
   * Creates a group of text elements from MText data.
   * @param mtextData - The MText data to process
   * @param style - The text style configuration
   * @returns An object containing the created Three.js object and its height
   */
  createMTextGroup(t, e) {
    if (e && e.font && e.font.endsWith(".shx")) {
      const b = `${e.font}_${e.name}`;
      this.styleManager.unsupportedTextStyles[b] || (this.styleManager.unsupportedTextStyles[b] = 0), this.styleManager.unsupportedTextStyles[b]++;
    }
    const s = Dc(t) || 0, i = Number.isFinite(s) && s > 0;
    let r = ot.LEFT;
    i && t.attachmentPoint && ([
      K.TopLeft,
      K.MiddleLeft,
      K.BottomLeft,
      K.BaselineLeft
    ].includes(t.attachmentPoint) ? r = ot.LEFT : [
      K.TopCenter,
      K.MiddleCenter,
      K.BottomCenter,
      K.BaselineCenter
    ].includes(t.attachmentPoint) ? r = ot.CENTER : [
      K.TopRight,
      K.MiddleRight,
      K.BottomRight,
      K.BaselineRight
    ].includes(t.attachmentPoint) && (r = ot.RIGHT));
    let a = Ve.BOTTOM;
    t.attachmentPoint && ([
      K.TopLeft,
      K.TopCenter,
      K.TopRight
    ].includes(t.attachmentPoint) ? a = Ve.TOP : [
      K.MiddleLeft,
      K.MiddleCenter,
      K.MiddleRight
    ].includes(t.attachmentPoint) ? a = Ve.MIDDLE : a = Ve.BOTTOM);
    const o = t.height || e.fixedTextHeight || 0, c = t.widthFactor || e.widthFactor || 1, h = t.lineSpaceFactor || 0.3, l = t.drawingDirection ?? oe.LEFT_TO_RIGHT, u = {
      fontSize: o,
      widthFactor: c,
      lineSpaceFactor: h,
      horizontalAlignment: r,
      maxWidth: s,
      flowDirection: l,
      byBlockColor: this._colorSettings.byBlockColor,
      byLayerColor: this._colorSettings.byLayerColor,
      removeFontExtension: !0,
      collectCharBoxes: t.collectCharBoxes ?? !0
    }, f = new ms();
    f.fontFace.family = e.font, f.capHeight = {
      value: o,
      isRelative: !1
    }, f.widthFactor = {
      value: c,
      isRelative: !1
    }, f.align = a, f.paragraph.align = r;
    const p = new Uc(
      e,
      this._colorSettings,
      this.styleManager,
      this.fontManager,
      u
    ), g = new Fl(yy(t.text), f, {
      resetParagraphParameters: !0,
      yieldPropertyCommands: !0
    }).parse();
    return {
      object: p.processText(g),
      height: p.totalHeight
    };
  }
  /**
   * Measures the logical text frame used by attachment-point anchoring.
   *
   * @remarks
   * Line-layout boxes include inter-line leading that is useful for hit testing, but
   * that leading must not become extra padding above the first rendered line when
   * aligning to top/middle/bottom attachment points. This method therefore prefers the
   * visible geometry height from `geometryBox` when it is non-empty, and only falls
   * back to `layoutHeight` when there are no measurable glyphs (e.g. empty or
   * whitespace-only runs).
   *
   * @param object - Root group produced by layout; traversed for {@link LineLayout}
   *   metadata to locate the first line baseline.
   * @param width - Column width used for horizontal anchoring when finite and
   *   positive; if not, horizontal extents are taken from `geometryBox`.
   * @param layoutHeight - Total laid-out height from {@link MTextProcessor} when
   *   geometry height is unavailable or zero.
   * @param geometryBox - Axis-aligned bounds of rendered primitives under `object`,
   *   typically from {@link THREE.Box3.setFromObject}.
   * @param flowDirection - Optional flow; when {@link MTextFlowDirection.BOTTOM_TO_TOP},
   *   the vertical frame is anchored from the geometry minimum upward.
   * @returns Metrics consumed by {@link MText.calculateAnchorPoint}.
   */
  measureAnchorMetrics(t, e, s, i, r) {
    const a = {
      hasLine: !1,
      minY: 1 / 0,
      maxY: -1 / 0,
      baselineY: 0
    };
    let o = !1;
    t.traverse((g) => {
      var b;
      const x = (b = g.userData) == null ? void 0 : b.lineLayouts;
      !x || x.length === 0 || x.forEach((v) => {
        const S = v.y - v.height / 2, w = v.y + v.height / 2;
        a.hasLine = !0, a.minY = Math.min(a.minY, S), a.maxY = Math.max(a.maxY, w), o || (a.baselineY = S, o = !0);
      });
    });
    const c = i.isEmpty() ? 0 : i.max.y - i.min.y, h = Number.isFinite(c) && c > 0 ? c : Number.isFinite(s) && s > 0 ? s : 0;
    let l = 0, u = Number.isFinite(e) && e > 0 ? e : 0;
    u <= l && !i.isEmpty() && (l = i.min.x, u = i.max.x);
    let f = 0, p = 0;
    r == oe.BOTTOM_TO_TOP ? (f = i.isEmpty() ? 0 : i.min.y, p = f + h) : (p = i.isEmpty() ? 0 : i.max.y, f = p - h);
    const d = a.hasLine ? a.baselineY : f;
    return { minX: l, maxX: u, minY: f, maxY: p, baselineY: d };
  }
  /**
   * Computes the 2D translation that maps the logical frame described by `metrics`
   * so that the chosen AutoCAD-style attachment point coincides with the insertion
   * origin (before rotation/insertion-point transforms applied later in
   * {@link MText.loadMText}).
   *
   * @remarks
   * The returned vector is **added** to vertex positions and char-box metadata via
   * `geometry.translate` / `CharBox.box.translate` / line `y` offsets. For `undefined`
   * attachment, behavior matches {@link MTextAttachmentPoint.TopLeft}.
   *
   * @param metrics - Pre-anchoring frame from {@link MText.measureAnchorMetrics}.
   * @param attachmentPoint - DWG attachment constant; determines which corner, edge
   *   center, or baseline of the frame is pinned to `(0,0)` in anchored space.
   * @returns Translation `(x, y)` in drawing units applied uniformly to the laid-out
   *   group and its layout sidecars.
   */
  calculateAnchorPoint(t, e) {
    const s = (t.minX + t.maxX) / 2, i = (t.minY + t.maxY) / 2;
    let r = 0, a = 0;
    switch (e) {
      case void 0:
      case K.TopLeft:
        r = -t.minX, a = -t.maxY;
        break;
      case K.TopCenter:
        r = -s, a = -t.maxY;
        break;
      case K.TopRight:
        r = -t.maxX, a = -t.maxY;
        break;
      case K.MiddleLeft:
        r = -t.minX, a = -i;
        break;
      case K.MiddleCenter:
        r = -s, a = -i;
        break;
      case K.MiddleRight:
        r = -t.maxX, a = -i;
        break;
      case K.BottomLeft:
        r = -t.minX, a = -t.minY;
        break;
      case K.BottomCenter:
        r = -s, a = -t.minY;
        break;
      case K.BottomRight:
        r = -t.maxX, a = -t.minY;
        break;
      case K.BaselineLeft:
        r = -t.minX, a = -t.baselineY;
        break;
      case K.BaselineCenter:
        r = -s, a = -t.baselineY;
        break;
      case K.BaselineRight:
        r = -t.maxX, a = -t.baselineY;
        break;
    }
    return { x: r, y: a };
  }
  /**
   * Walks a laid-out MText subgraph and accumulates world-space character hit boxes and
   * soft line rectangles for {@link MText.createLayoutData} (raycasting, cursors, debug).
   *
   * @remarks
   * - When `userData.layout.chars` is present, entries are transformed with
   *   {@link buildCharBoxesFromObject} and appended to `chars`, then recursion stops
   *   for that branch (char metadata is authoritative).
   * - When only mesh/line geometry exists, a single synthetic {@link CharBox} wrapping
   *   the geometry AABB may be emitted.
   * - `userData.lineLayouts` rows are converted to world-space center `y` and height.
   *
   * @param object - Node to traverse (typically the root group from {@link MText.loadMText}).
   * @param chars - Output collection; receives merged {@link CharBox} entries in world space.
   * @param lines - Output collection; receives {@link LineLayout} summaries per line break.
   */
  getLayout(t, e, s) {
    var o, c, h, l, u;
    t.updateWorldMatrix(!1, !1);
    const i = (c = (o = t.userData) == null ? void 0 : o.layout) == null ? void 0 : c.chars, r = (h = t.userData) == null ? void 0 : h.lineLayouts;
    if (r && r.length > 0 && r.forEach((f) => {
      ts.set(0, f.y, 0).applyMatrix4(t.matrixWorld), Me.set(0, f.y - f.height / 2, 0).applyMatrix4(t.matrixWorld), Oe.set(0, f.y + f.height / 2, 0).applyMatrix4(t.matrixWorld), s.push({
        y: ts.y,
        height: Math.abs(Oe.y - Me.y),
        breakIndex: f.breakIndex
      });
    }), i && i.length > 0) {
      const f = (l = t.userData) == null ? void 0 : l.charBoxType, p = Bc(
        i,
        t.matrixWorld,
        f
      );
      e.push(...p);
      return;
    }
    if (t instanceof pi || t instanceof os) {
      const f = t.geometry;
      if (!((u = f.userData) != null && u.isDecoration)) {
        f.boundingBox === null && f.computeBoundingBox();
        const p = new Ot().copy(f.boundingBox);
        p.applyMatrix4(t.matrixWorld), e.push({
          type: ht.CHAR,
          box: p,
          char: "",
          children: []
        });
      }
    }
    const a = t.children;
    for (let f = 0, p = a.length; f < p; f++)
      this.getLayout(a[f], e, s);
  }
  /**
   * Depth-first union of this MText’s {@link MText.box} from layout metadata and mesh
   * geometry, while optionally tracking coarse line AABB in `lineBounds`.
   *
   * @remarks
   * Priority order per node:
   * 1. If `userData.logicalBounds` exists (set in {@link MText.loadMText}), union that
   *    axis-aligned rectangle transformed by `matrixWorld` — this reflects anchored
   *    logical extents even when individual glyphs are expensive to union.
   * 2. Else if `userData.lineLayouts` exists, expand `lineBounds` from the world-space
   *    top/bottom of each line strip (used as a fallback when no logical bounds were
   *    written, e.g. legacy paths).
   * 3. Else if `userData.layout.chars` exists, union each transformed char AABB.
   * 4. Else for mesh/line primitives, union non-decoration geometry bounds.
   * 5. Always recurse into children.
   *
   * @param object - Current scene graph node.
   * @param lineBounds - Mutable accumulator: `hasLine`/`min*`/`max*` track the union of
   *   line-layout strips in world space; `hasLogicalBounds` flips true when any child
   *   contributed `logicalBounds` so {@link MText.syncDraw} can avoid double-counting
   *   vertical extent from line strips alone.
   */
  updateBoxFromObject(t, e) {
    var o, c, h, l, u, f;
    t.updateWorldMatrix(!1, !1);
    const s = (o = t.userData) == null ? void 0 : o.logicalBounds;
    if (s) {
      e.hasLogicalBounds = !0;
      const p = new Ot(
        new E(s.minX, s.minY, 0),
        new E(s.maxX, s.maxY, 0)
      );
      p.applyMatrix4(t.matrixWorld), this.box.union(p);
    }
    const i = (c = t.userData) == null ? void 0 : c.lineLayouts;
    i && i.length > 0 && i.forEach((p) => {
      Me.set(0, p.y - p.height / 2, 0).applyMatrix4(t.matrixWorld), Oe.set(0, p.y + p.height / 2, 0).applyMatrix4(t.matrixWorld), e.hasLine = !0, e.minX = Math.min(e.minX, Me.x, Oe.x), e.maxX = Math.max(e.maxX, Me.x, Oe.x), e.minY = Math.min(e.minY, Me.y, Oe.y), e.maxY = Math.max(e.maxY, Me.y, Oe.y), e.minZ = Math.min(e.minZ, Me.z, Oe.z), e.maxZ = Math.max(e.maxZ, Me.z, Oe.z);
    });
    const r = (l = (h = t.userData) == null ? void 0 : h.layout) == null ? void 0 : l.chars;
    if (r && r.length > 0) {
      const p = (u = t.userData) == null ? void 0 : u.charBoxType;
      Bc(
        r,
        t.matrixWorld,
        p
      ).forEach((g) => {
        g.box && this.box.union(g.box);
      });
      return;
    }
    if (t instanceof pi || t instanceof os) {
      const p = t.geometry;
      if (!((f = p.userData) != null && f.isDecoration)) {
        p.boundingBox === null && p.computeBoundingBox();
        const d = new Ot().copy(p.boundingBox);
        d.applyMatrix4(t.matrixWorld), this.box.union(d);
      }
    }
    const a = t.children;
    for (let p = 0, d = a.length; p < d; p++)
      this.updateBoxFromObject(a[p], e);
  }
  /**
   * Remove the specified object from its parent and release geometry and material resource used
   * by the object.
   * @param obj - Input object to dispose
   */
  disposeThreeObject(t) {
    t.traverse((e) => {
      if (e.geometry && typeof e.geometry.dispose == "function")
        try {
          e.geometry.dispose();
        } catch {
        }
      if (e.material) {
        const s = (i) => {
          if (i && typeof i.dispose == "function")
            try {
              i.dispose();
            } catch {
            }
        };
        Array.isArray(e.material) ? e.material.forEach(s) : s(e.material);
      }
    });
  }
  /**
   * Normalizes a font file reference to the lowercase stem used by
   * {@link FontManager.loadFontsByNames} (strip extension).
   *
   * @param fontFileName - Style font path such as `arial.ttf` or extension-less name.
   * @returns Lowercase name without the last extension segment, or `undefined` if empty.
   */
  getFontName(t) {
    if (t) {
      const e = t.lastIndexOf(".");
      return e >= 0 ? t.substring(0, e).toLowerCase() : t.toLowerCase();
    }
  }
}
const sn = xe.instance, xy = new ny();
self.addEventListener("message", async (n) => {
  const { type: t, id: e, data: s } = n.data;
  try {
    switch (t) {
      case "render": {
        if (!s) throw new Error("Missing data for render message");
        const { mtextContent: i, textStyle: r, colorSettings: a } = s, o = by(a);
        let c = new Fa(
          i,
          r,
          xy,
          sn,
          o
        );
        await c.asyncDraw(), c.updateMatrixWorld(!0);
        const { data: h, transferableObjects: l } = vy(c);
        self.postMessage(
          {
            type: "render",
            id: e,
            success: !0,
            data: h
          },
          { transfer: l }
        ), c.dispose(), c = void 0;
        break;
      }
      case "loadFonts": {
        if (!s) throw new Error("Missing data for loadFonts message");
        const { fonts: i } = s;
        await sn.loadFontsByNames(i), self.postMessage({
          type: "loadFonts",
          id: e,
          success: !0,
          data: { loaded: i }
        });
        break;
      }
      case "setDefaultFonts": {
        if (!s) throw new Error("Missing data for setDefaultFonts message");
        const { fonts: i, symbolFonts: r } = s;
        sn.setDefaultFonts(i), sn.setSymbolFonts(r), self.postMessage({
          type: "setDefaultFonts",
          id: e,
          success: !0,
          data: {
            fonts: [...sn.defaultFonts],
            symbolFonts: [...sn.symbolFonts]
          }
        });
        break;
      }
      case "setFontUrl": {
        if (!s) throw new Error("Missing data for setFontUrl message");
        const { url: i } = s;
        sn.baseUrl = i, self.postMessage({
          type: "setFontUrl",
          id: e,
          success: !0,
          data: {}
        });
        break;
      }
      case "getAvailableFonts": {
        const i = await xe.instance.getAvailableFonts();
        self.postMessage({
          type: "getAvailableFonts",
          id: e,
          success: !0,
          data: { fonts: i }
        });
        break;
      }
      default:
        throw new Error(`Unknown message type: ${t}`);
    }
  } catch (i) {
    self.postMessage({
      type: t,
      id: e,
      success: !1,
      error: i instanceof Error ? i.message : String(i)
    });
  }
});
function by(n) {
  const t = {
    byLayerColor: 16777215,
    byBlockColor: 16777215,
    layer: "0",
    color: new je()
  }, e = n ?? t, s = e.color;
  if (s instanceof je)
    return e;
  const i = new je();
  if (s && typeof s == "object") {
    const r = s;
    typeof r._aci == "number" && (i.aci = r._aci), typeof r._rgbValue == "number" && (i.rgbValue = r._rgbValue);
  }
  return {
    byLayerColor: e.byLayerColor,
    byBlockColor: e.byBlockColor,
    layer: e.layer,
    color: i
  };
}
function vy(n) {
  const t = n.matrixWorld.clone(), e = new E(), s = new pn(), i = new E();
  t.decompose(e, s, i);
  const r = n.box.clone();
  r.applyMatrix4(t);
  const { children: a, transferableObjects: o } = Sy(n);
  return { data: {
    // Basic properties
    type: "MText",
    position: {
      x: e.x,
      y: e.y,
      z: e.z
    },
    rotation: {
      x: s.x,
      y: s.y,
      z: s.z,
      w: s.w
    },
    scale: {
      x: i.x,
      y: i.y,
      z: i.z
    },
    box: {
      min: {
        x: r.min.x,
        y: r.min.y,
        z: r.min.z
      },
      max: {
        x: r.max.x,
        y: r.max.y,
        z: r.max.z
      }
    },
    // Serialize all child objects as JSON
    children: a
  }, transferableObjects: o };
}
function Sy(n) {
  const t = [], e = [];
  return n.traverse((s) => {
    var i, r, a, o;
    if (s instanceof os || s instanceof pi) {
      const c = s.geometry, h = s.material;
      if (c instanceof Ht) {
        const l = s.matrixWorld.clone(), u = new E(), f = new pn(), p = new E();
        l.decompose(u, f, p);
        const d = {};
        c.attributes && Object.keys(c.attributes).forEach((v) => {
          const S = c.attributes[v], M = new Uint8Array(
            S.array.buffer,
            S.array.byteOffset,
            S.array.byteLength
          ).slice().buffer;
          e.push(M), d[v] = {
            arrayBuffer: M,
            byteOffset: 0,
            // Since we copied, offset is 0
            length: S.array.length,
            itemSize: S.itemSize,
            normalized: S.normalized
          };
        });
        let g = null;
        if (c.index) {
          const v = c.index.array, k = new Uint8Array(
            v.buffer,
            v.byteOffset,
            v.byteLength
          ).slice().buffer;
          e.push(k), g = {
            arrayBuffer: k,
            byteOffset: 0,
            length: v.length,
            componentType: v instanceof Uint32Array ? "uint32" : "uint16"
          };
        }
        const x = {
          type: h.type,
          color: h.color ? h.color.getHex() : 16777215,
          transparent: h.transparent,
          opacity: h.opacity
        };
        "side" in h && typeof h.side == "number" && (x.side = h.side), "linewidth" in h && typeof h.linewidth == "number" && (x.linewidth = h.linewidth);
        const b = {
          type: s instanceof os ? "mesh" : "line",
          position: {
            x: u.x,
            y: u.y,
            z: u.z
          },
          rotation: {
            x: f.x,
            y: f.y,
            z: f.z,
            w: f.w
          },
          scale: {
            x: p.x,
            y: p.y,
            z: p.z
          },
          geometry: {
            attributes: d,
            index: g
          },
          material: x,
          charBoxType: (i = s.userData) == null ? void 0 : i.charBoxType,
          lineLayouts: Array.isArray((r = s.userData) == null ? void 0 : r.lineLayouts) ? wy(s.userData.lineLayouts) : void 0,
          charBoxes: Array.isArray((o = (a = s.userData) == null ? void 0 : a.layout) == null ? void 0 : o.chars) ? xl(s.userData.layout.chars) : void 0
        };
        t.push(b);
      }
    }
  }), { children: t, transferableObjects: e };
}
function xl(n) {
  return n.map((t) => ({
    type: t.type,
    char: t.char,
    box: {
      min: {
        x: t.box.min.x,
        y: t.box.min.y,
        z: t.box.min.z
      },
      max: {
        x: t.box.max.x,
        y: t.box.max.y,
        z: t.box.max.z
      }
    },
    children: xl(t.children ?? [])
  }));
}
function wy(n) {
  return n.map((t) => ({
    y: t.y,
    height: t.height,
    breakIndex: t.breakIndex
  }));
}
