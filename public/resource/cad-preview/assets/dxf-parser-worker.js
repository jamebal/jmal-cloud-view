var S, Oe, O, T, Te, P, g, Y, V, ce, ve, Ne, ie, le, Se, xe, ye, A, j, h, de, ge, l, _, _e, L, Le, X, z, B, De, ue, k, K, pe, je, Xe, Z, $, Ae, ke, J, Me, ze, Ke, x, q, y, M, Ze, $e, Je, qe, Q, R, me, Re, fe, F, ee, C, re;
(S = {})[S.None = 0] = "None", S[S.Anonymous = 1] = "Anonymous", S[S.NonConstant = 2] = "NonConstant", S[S.Xref = 4] = "Xref", S[S.XrefOverlay = 8] = "XrefOverlay", S[S.ExternallyDependent = 16] = "ExternallyDependent", S[S.ResolvedOrDependent = 32] = "ResolvedOrDependent", S[S.ReferencedXref = 64] = "ReferencedXref";
(Oe = {})[Oe.BYBLOCK = 0] = "BYBLOCK", Oe[Oe.BYLAYER = 256] = "BYLAYER";
(O = {})[O.Rotated = 0] = "Rotated", O[O.Aligned = 1] = "Aligned", O[O.Angular = 2] = "Angular", O[O.Diameter = 3] = "Diameter", O[O.Radius = 4] = "Radius", O[O.Angular3Point = 5] = "Angular3Point", O[O.Ordinate = 6] = "Ordinate", O[O.ReferenceIsExclusive = 32] = "ReferenceIsExclusive", O[O.IsOrdinateXTypeFlag = 64] = "IsOrdinateXTypeFlag", O[O.IsCustomTextPositionFlag = 128] = "IsCustomTextPositionFlag";
(T = {})[T.TopLeft = 1] = "TopLeft", T[T.TopCenter = 2] = "TopCenter", T[T.TopRight = 3] = "TopRight", T[T.MiddleLeft = 4] = "MiddleLeft", T[T.MiddleCenter = 5] = "MiddleCenter", T[T.MiddleRight = 6] = "MiddleRight", T[T.BottomLeft = 7] = "BottomLeft", T[T.BottomCenter = 8] = "BottomCenter", T[T.BottomRight = 9] = "BottomRight";
(Te = {})[Te.AtLeast = 1] = "AtLeast", Te[Te.Exact = 2] = "Exact";
var sr = ((P = {})[P.Center = 0] = "Center", P[P.Above = 1] = "Above", P[P.Outside = 2] = "Outside", P[P.JIS = 3] = "JIS", P[P.Below = 4] = "Below", P), Ee = ((g = {})[g.Feet = 0] = "Feet", g[g.None = 1] = "None", g[g.Inch = 2] = "Inch", g[g.FeetAndInch = 3] = "FeetAndInch", g[g.Leading = 4] = "Leading", g[g.Trailing = 8] = "Trailing", g[g.LeadingAndTrailing = 12] = "LeadingAndTrailing", g), Na = ((Y = {})[Y.None = 0] = "None", Y[Y.Leading = 1] = "Leading", Y[Y.Trailing = 2] = "Trailing", Y[Y.LeadingAndTrailing = 3] = "LeadingAndTrailing", Y), Sa = ((V = {})[V.Center = 0] = "Center", V[V.Left = 1] = "Left", V[V.Right = 2] = "Right", V[V.OverFirst = 3] = "OverFirst", V[V.OverSecond = 4] = "OverSecond", V), xa = ((ce = {})[ce.Bottom = 0] = "Bottom", ce[ce.Center = 1] = "Center", ce[ce.Top = 2] = "Top", ce);
(ve = {})[ve.PatternFill = 0] = "PatternFill", ve[ve.SolidFill = 1] = "SolidFill";
(Ne = {})[Ne.NonAssociative = 0] = "NonAssociative", Ne[Ne.Associative = 1] = "Associative";
(ie = {})[ie.Normal = 0] = "Normal", ie[ie.Outer = 1] = "Outer", ie[ie.Ignore = 2] = "Ignore";
(le = {})[le.UserDefined = 0] = "UserDefined", le[le.Predefined = 1] = "Predefined", le[le.Custom = 2] = "Custom";
(Se = {})[Se.NotAnnotated = 0] = "NotAnnotated", Se[Se.Annotated = 1] = "Annotated";
(xe = {})[xe.Solid = 0] = "Solid", xe[xe.Gradient = 1] = "Gradient";
(ye = {})[ye.TwoColor = 0] = "TwoColor", ye[ye.OneColor = 1] = "OneColor";
var ya = ((A = {})[A.Default = 0] = "Default", A[A.External = 1] = "External", A[A.Polyline = 2] = "Polyline", A[A.Derived = 4] = "Derived", A[A.Textbox = 8] = "Textbox", A[A.Outermost = 16] = "Outermost", A), Pe = ((j = {})[j.Line = 1] = "Line", j[j.Circular = 2] = "Circular", j[j.Elliptic = 3] = "Elliptic", j[j.Spline = 4] = "Spline", j), ga = ((h = {})[h.Off = 0] = "Off", h[h.Solid = 1] = "Solid", h[h.Dashed = 2] = "Dashed", h[h.Dotted = 3] = "Dotted", h[h.ShotDash = 4] = "ShotDash", h[h.MediumDash = 5] = "MediumDash", h[h.LongDash = 6] = "LongDash", h[h.DoubleShortDash = 7] = "DoubleShortDash", h[h.DoubleMediumDash = 8] = "DoubleMediumDash", h[h.DoubleLongDash = 9] = "DoubleLongDash", h[h.DoubleMediumLongDash = 10] = "DoubleMediumLongDash", h[h.SparseDot = 11] = "SparseDot", h);
ga.Off;
(de = {})[de.Standard = -3] = "Standard", de[de.ByLayer = -2] = "ByLayer", de[de.ByBlock = -1] = "ByBlock";
(ge = {})[ge.English = 0] = "English", ge[ge.Metric = 1] = "Metric";
(l = {})[l.PERSPECTIVE_MODE = 1] = "PERSPECTIVE_MODE", l[l.FRONT_CLIPPING = 2] = "FRONT_CLIPPING", l[l.BACK_CLIPPING = 4] = "BACK_CLIPPING", l[l.UCS_FOLLOW = 8] = "UCS_FOLLOW", l[l.FRONT_CLIP_NOT_AT_EYE = 16] = "FRONT_CLIP_NOT_AT_EYE", l[l.UCS_ICON_VISIBILITY = 32] = "UCS_ICON_VISIBILITY", l[l.UCS_ICON_AT_ORIGIN = 64] = "UCS_ICON_AT_ORIGIN", l[l.FAST_ZOOM = 128] = "FAST_ZOOM", l[l.SNAP_MODE = 256] = "SNAP_MODE", l[l.GRID_MODE = 512] = "GRID_MODE", l[l.ISOMETRIC_SNAP_STYLE = 1024] = "ISOMETRIC_SNAP_STYLE", l[l.HIDE_PLOT_MODE = 2048] = "HIDE_PLOT_MODE", l[l.K_ISO_PAIR_TOP = 4096] = "K_ISO_PAIR_TOP", l[l.K_ISO_PAIR_RIGHT = 8192] = "K_ISO_PAIR_RIGHT", l[l.VIEWPORT_ZOOM_LOCKING = 16384] = "VIEWPORT_ZOOM_LOCKING", l[l.UNUSED = 32768] = "UNUSED", l[l.NON_RECTANGULAR_CLIPPING = 65536] = "NON_RECTANGULAR_CLIPPING", l[l.VIEWPORT_OFF = 131072] = "VIEWPORT_OFF", l[l.GRID_BEYOND_DRAWING_LIMITS = 262144] = "GRID_BEYOND_DRAWING_LIMITS", l[l.ADAPTIVE_GRID_DISPLAY = 524288] = "ADAPTIVE_GRID_DISPLAY", l[l.SUBDIVISION_BELOW_SPACING = 1048576] = "SUBDIVISION_BELOW_SPACING", l[l.GRID_FOLLOWS_WORKPLANE = 2097152] = "GRID_FOLLOWS_WORKPLANE";
(_ = {})[_.OPTIMIZED_2D = 0] = "OPTIMIZED_2D", _[_.WIREFRAME = 1] = "WIREFRAME", _[_.HIDDEN_LINE = 2] = "HIDDEN_LINE", _[_.FLAT_SHADED = 3] = "FLAT_SHADED", _[_.GOURAUD_SHADED = 4] = "GOURAUD_SHADED", _[_.FLAT_SHADED_WITH_WIREFRAME = 5] = "FLAT_SHADED_WITH_WIREFRAME", _[_.GOURAUD_SHADED_WITH_WIREFRAME = 6] = "GOURAUD_SHADED_WITH_WIREFRAME";
(_e = {})[_e.UCS_UNCHANGED = 0] = "UCS_UNCHANGED", _e[_e.HAS_OWN_UCS = 1] = "HAS_OWN_UCS";
(L = {})[L.NON_ORTHOGRAPHIC = 0] = "NON_ORTHOGRAPHIC", L[L.TOP = 1] = "TOP", L[L.BOTTOM = 2] = "BOTTOM", L[L.FRONT = 3] = "FRONT", L[L.BACK = 4] = "BACK", L[L.LEFT = 5] = "LEFT", L[L.RIGHT = 6] = "RIGHT";
(Le = {})[Le.ONE_DISTANT_LIGHT = 0] = "ONE_DISTANT_LIGHT", Le[Le.TWO_DISTANT_LIGHTS = 1] = "TWO_DISTANT_LIGHTS";
(X = {})[X.ByLayer = 0] = "ByLayer", X[X.ByBlock = 1] = "ByBlock", X[X.ByDictionaryDefault = 2] = "ByDictionaryDefault", X[X.ByObject = 3] = "ByObject";
function p(e, r, n) {
  return e.code === r && (n == null || e.value === n);
}
function m(e) {
  let r = {};
  e.rewind();
  let n = e.next(), t = n.code;
  if (r.x = n.value, (n = e.next()).code !== t + 10) throw Error("Expected code for point value to be 20 but got " + n.code + ".");
  return r.y = n.value, (n = e.next()).code !== t + 20 ? e.rewind() : r.z = n.value, r;
}
let rr = Symbol();
function u(e, r) {
  return (n, t, s) => {
    let o = function(d, N = !1) {
      return d.reduce((v, E) => {
        E.pushContext && v.push({});
        let G = v[v.length - 1];
        for (let se of typeof E.code == "number" ? [E.code] : E.code) {
          let oe = G[se] ?? (G[se] = []);
          E.isMultiple && oe.length && N && console.warn(`Snippet ${oe[oe.length - 1].name} for code(${se}) is shadowed by ${E.name}`), oe.push(E);
        }
        return v;
      }, [{}]);
    }(e, t.debug), i = !1, b = o.length - 1;
    for (; !p(n, 0, "EOF"); ) {
      let d = function(D, w, H) {
        return D.find((he, ne) => {
          var W;
          return ne >= H && ((W = he[w]) == null ? void 0 : W.length);
        });
      }(o, n.code, b), N = d == null ? void 0 : d[n.code], v = N == null ? void 0 : N[N.length - 1];
      if (!d || !v) {
        t.rewind();
        break;
      }
      v.isMultiple || d[n.code].pop();
      let { name: E, parser: G, isMultiple: se, isReducible: oe } = v, U = G == null ? void 0 : G(n, t, s);
      if (U === rr) {
        t.rewind();
        break;
      }
      if (E) {
        let [D, w] = function(H, he) {
          let ne = he.split(".");
          if (!ne.length) throw Error("[parserGenerator::getObjectByPath] Invalid empty path");
          let W = H;
          for (let Ce = 0; Ce < ne.length - 1; ++Ce) {
            let we = Qe(ne[Ce]), va = Qe(ne[Ce + 1]);
            Object.prototype.hasOwnProperty.call(W, we) || (typeof va == "number" ? W[we] = [] : W[we] = {}), W = W[we];
          }
          return [W, Qe(ne[ne.length - 1])];
        }(s, E);
        se && !oe ? (Object.prototype.hasOwnProperty.call(D, w) || (D[w] = []), D[w].push(U)) : D[w] = U;
      }
      v.pushContext && (b -= 1), i = !0, n = t.next();
    }
    return r && Object.setPrototypeOf(s, r), i;
  };
}
function Qe(e) {
  let r = Number.parseInt(e);
  return Number.isNaN(r) ? e : r;
}
function a({ value: e }) {
  return e;
}
function c(e, r) {
  return m(r);
}
function f({ value: e }) {
  return !!e;
}
let _a = [{ code: 1001, name: "xdata", parser: ur }];
function ur(e, r) {
  var s;
  if (!p(e, 1001)) throw Error("XData must starts with code 1001");
  let n = { appName: e.value, value: [] };
  e = r.next();
  let t = [n.value];
  for (; !p(e, 0, "EOF") && e.code >= 1e3; ) {
    let o = t[t.length - 1];
    switch (e.code) {
      case 1002:
        e.value === "{" ? t.push([]) : (t.pop(), (s = t[t.length - 1]) == null || s.push(o));
        break;
      case 1e3:
      case 1004:
      case 1040:
      case 1070:
      case 1071:
        o.push({ type: ae(e.code), value: e.value });
        break;
      case 1003:
        o.push({ name: "layer", type: ae(e.code), value: e.value });
        break;
      case 1005:
        o.push({ name: "handle", type: ae(e.code), value: e.value });
        break;
      case 1010:
        o.push({ type: ae(e.code), value: m(r) });
        break;
      case 1011:
        o.push({ name: "worldSpacePosition", type: ae(e.code), value: m(r) });
        break;
      case 1012:
        o.push({ name: "worldSpaceDisplacement", type: ae(e.code), value: m(r) });
        break;
      case 1013:
        o.push({ name: "worldSpaceDirection", type: ae(e.code), value: m(r) });
        break;
      case 1041:
        o.push({ name: "distance", type: ae(e.code), value: e.value });
        break;
      case 1042:
        o.push({ name: "scale", type: ae(e.code), value: e.value });
    }
    e = r.next();
  }
  return r.rewind(), n;
}
function ae(e) {
  switch (e) {
    case 1e3:
    case 1003:
    case 1005:
      return "string";
    case 1004:
      return "hex";
    case 1040:
    case 1041:
    case 1042:
      return "real";
    case 1070:
      return "integer";
    case 1071:
      return "long";
    case 1010:
    case 1011:
    case 1012:
    case 1013:
      return "point";
    default:
      return "";
  }
}
function Ie(e, r, n) {
  for (; p(e, 102); ) {
    var t;
    let s = e.value;
    if (e = r.next(), !s.startsWith("{")) {
      r.debug && console.warn(`Invalid application group, expected to start with "{" but received: ${s}`), function(i, b) {
        for (; !p(i, 102) && !p(i, 0, "EOF"); ) i = b.next();
      }(e, r), e = r.next();
      continue;
    }
    let o = s.slice(1).trim();
    n.extensions ?? (n.extensions = {}), (t = n.extensions)[o] ?? (t[o] = []), function(i, b, d) {
      for (; !p(i, 102, "}") && !p(i, 0, "EOF"); ) d.push(i), i = b.next();
    }(e, r, n.extensions[o]), e = r.next();
  }
  r.rewind();
}
let La = 0;
function pr(e) {
  if (!e) throw TypeError("entity cannot be undefined or null");
  e.handle || (e.handle = La++);
}
var Da = [0, 16711680, 16776960, 65280, 65535, 255, 16711935, 16777215, 8421504, 12632256, 16711680, 16744319, 13369344, 13395558, 10027008, 10046540, 8323072, 8339263, 4980736, 4990502, 16727808, 16752511, 13382400, 13401958, 10036736, 10051404, 8331008, 8343359, 4985600, 4992806, 16744192, 16760703, 13395456, 13408614, 10046464, 10056268, 8339200, 8347455, 4990464, 4995366, 16760576, 16768895, 13408512, 13415014, 10056192, 10061132, 8347392, 8351551, 4995328, 4997670, 16776960, 16777087, 13421568, 13421670, 10000384, 10000460, 8355584, 8355647, 5000192, 5000230, 12582656, 14679935, 10079232, 11717734, 7510016, 8755276, 6258432, 7307071, 3755008, 4344870, 8388352, 12582783, 6736896, 10079334, 5019648, 7510092, 4161280, 6258495, 2509824, 3755046, 4194048, 10485631, 3394560, 8375398, 2529280, 6264908, 2064128, 5209919, 1264640, 3099686, 65280, 8388479, 52224, 6736998, 38912, 5019724, 32512, 4161343, 19456, 2509862, 65343, 8388511, 52275, 6737023, 38950, 5019743, 32543, 4161359, 19475, 2509871, 65407, 8388543, 52326, 6737049, 38988, 5019762, 32575, 4161375, 19494, 2509881, 65471, 8388575, 52377, 6737074, 39026, 5019781, 32607, 4161391, 19513, 2509890, 65535, 8388607, 52428, 6737100, 39064, 5019800, 32639, 4161407, 19532, 2509900, 49151, 8380415, 39372, 6730444, 29336, 5014936, 24447, 4157311, 14668, 2507340, 32767, 8372223, 26316, 6724044, 19608, 5010072, 16255, 4153215, 9804, 2505036, 16383, 8364031, 13260, 6717388, 9880, 5005208, 8063, 4149119, 4940, 2502476, 255, 8355839, 204, 6710988, 152, 5000344, 127, 4145023, 76, 2500172, 4129023, 10452991, 3342540, 8349388, 2490520, 6245528, 2031743, 5193599, 1245260, 3089996, 8323327, 12550143, 6684876, 10053324, 4980888, 7490712, 4128895, 6242175, 2490444, 3745356, 12517631, 14647295, 10027212, 11691724, 7471256, 8735896, 6226047, 7290751, 3735628, 4335180, 16711935, 16744447, 13369548, 13395660, 9961624, 9981080, 8323199, 8339327, 4980812, 4990540, 16711871, 16744415, 13369497, 13395634, 9961586, 9981061, 8323167, 8339311, 4980793, 4990530, 16711807, 16744383, 13369446, 13395609, 9961548, 9981042, 8323135, 8339295, 4980774, 4990521, 16711743, 16744351, 13369395, 13395583, 9961510, 9981023, 8323103, 8339279, 4980755, 4990511, 3355443, 5987163, 8684676, 11382189, 14079702, 16777215];
function mr(e) {
  return Da[e];
}
(z = {})[z.CAST_AND_RECEIVE = 0] = "CAST_AND_RECEIVE", z[z.CAST = 1] = "CAST", z[z.RECEIVE = 2] = "RECEIVE", z[z.IGNORE = 3] = "IGNORE";
let I = [..._a, { code: 284, name: "shadowMode", parser: a }, { code: 390, name: "plotStyleHardId", parser: a }, { code: 380, name: "plotStyleType", parser: a }, { code: 440, name: "transparency", parser: a }, { code: 430, name: "colorName", parser: a }, { code: 420, name: "color", parser: a }, { code: 310, name: "proxyEntity", isMultiple: !0, parser: a }, { code: 92, name: "proxyByte", parser: a }, { code: 60, name: "isVisible", parser: f }, { code: 48, name: "lineTypeScale", parser: a }, { code: 370, name: "lineweight", parser: a }, { code: 62, name: "colorIndex", parser(e, r, n) {
  let t = e.value;
  return t > 0 && t < 256 && (n.color = mr(Math.abs(t))), t;
} }, { code: 347, name: "materialObjectHardId", parser: a }, { code: 6, name: "lineType", parser: a }, { code: 8, name: "layer", parser: a }, { code: 410, name: "layoutTabName", parser: a }, { code: 67, name: "isInPaperSpace", parser: f }, { code: 100 }, { code: 160 }, { code: 330, name: "ownerBlockRecordSoftId", parser: a }, { code: 102, parser: Ie }, { code: 102, parser: Ie }, { code: 102, parser: Ie }, { code: 5, name: "handle", parser: a }];
function Ye(e) {
  return [{ code: 3, name: e, parser: (r, n, t) => (t._code3text = (t._code3text ?? "") + r.value, t._code3text + (t._code1text ?? "")), isMultiple: !0, isReducible: !0 }, { code: 1, name: e, parser: (r, n, t) => (t._code1text = r.value, (t._code3text ?? "") + t._code1text) }];
}
function fr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let Aa = { extrusionDirection: { x: 0, y: 0, z: 1 } }, ka = [{ code: 210, name: "extrusionDirection", parser: c }, { code: 51, name: "endAngle", parser: a }, { code: 50, name: "startAngle", parser: a }, { code: 100, name: "subclassMarker", parser: a }, { code: 40, name: "radius", parser: a }, { code: 10, name: "center", parser: c }, { code: 39, name: "thickness", parser: a }, { code: 100 }, ...I];
class Ir {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    fr(this, "parser", u(ka, Aa));
  }
}
fr(Ir, "ForEntityName", "ARC");
(B = {})[B.NONE = 0] = "NONE", B[B.INVISIBLE = 1] = "INVISIBLE", B[B.CONSTANT = 2] = "CONSTANT", B[B.VERIFICATION_REQUIRED = 4] = "VERIFICATION_REQUIRED", B[B.PRESET = 8] = "PRESET";
(De = {})[De.MULTILINE = 2] = "MULTILINE", De[De.CONSTANT_MULTILINE = 4] = "CONSTANT_MULTILINE";
(ue = {})[ue.NONE = 0] = "NONE", ue[ue.MIRRORED_X = 2] = "MIRRORED_X", ue[ue.MIRRORED_Y = 4] = "MIRRORED_Y";
var Ma = ((k = {})[k.LEFT = 0] = "LEFT", k[k.CENTER = 1] = "CENTER", k[k.RIGHT = 2] = "RIGHT", k[k.ALIGNED = 3] = "ALIGNED", k[k.MIDDLE = 4] = "MIDDLE", k[k.FIT = 5] = "FIT", k), Ra = ((K = {})[K.BASELINE = 0] = "BASELINE", K[K.BOTTOM = 1] = "BOTTOM", K[K.MIDDLE = 2] = "MIDDLE", K[K.TOP = 3] = "TOP", K);
function Er(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let br = { thickness: 0, rotation: 0, xScale: 1, obliqueAngle: 0, styleName: "STANDARD", generationFlag: 0, halign: Ma.LEFT, valign: Ra.BASELINE, extrusionDirection: { x: 0, y: 0, z: 1 } }, hr = [{ code: 73, name: "valign", parser: a }, { code: 100 }, { code: 210, name: "extrusionDirection", parser: c }, { code: 11, name: "endPoint", parser: c }, { code: 72, name: "valign", parser: a }, { code: 72, name: "halign", parser: a }, { code: 71, name: "generationFlag", parser: a }, { code: 7, name: "styleName", parser: a }, { code: 51, name: "obliqueAngle", parser: a }, { code: 41, name: "xScale", parser: a }, { code: 50, name: "rotation", parser: a }, { code: 1, name: "text", parser: a }, { code: 40, name: "textHeight", parser: a }, { code: 10, name: "startPoint", parser: c }, { code: 39, name: "thickness", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Or {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Er(this, "parser", u(hr, br));
  }
}
function Tr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Er(Or, "ForEntityName", "TEXT");
let Fa = { ...br }, Ca = [{ code: 2 }, { code: 40, name: "annotationScale", parser: a }, { code: 10, name: "alignmentPoint", parser: c }, { code: 340, name: "secondaryAttributesHardIds", isMultiple: !0, parser: a }, { code: 70, name: "numberOfSecondaryAttributes", parser: a }, { code: 70, name: "isReallyLocked", parser: f }, { code: 70, name: "mtextFlag", parser: a }, { code: 280, name: "isDuplicatedRecord", parser: f }, { code: 100 }, { code: 280, name: "isLocked", parser: f }, { code: 74, name: "valign", parser: a }, { code: 73 }, { code: 70, name: "attributeFlag", parser: a }, { code: 2, name: "tag", parser: a }, { code: 3, name: "prompt", parser: a }, { code: 280 }, { code: 100, name: "subclassMarker", parser: a }, ...hr.slice(2)];
class vr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Tr(this, "parser", u(Ca, Fa));
  }
}
Tr(vr, "ForEntityName", "ATTDEF");
(pe = {})[pe.LEFT_TO_RIGHT = 1] = "LEFT_TO_RIGHT", pe[pe.TOP_TO_BOTTOM = 3] = "TOP_TO_BOTTOM", pe[pe.BY_STYLE = 5] = "BY_STYLE";
function wa(e, r) {
  let n = {};
  for (let t of e) {
    let s = r(t);
    s != null && (n[s] ?? (n[s] = []), n[s].push(t));
  }
  return n;
}
function* We(e, r = 1 / 0, n = 1) {
  for (let t = e; t !== r; t += n) yield t;
}
function te(e) {
  return { x: e.x ?? 0, y: e.y ?? 0, z: e.z ?? 0 };
}
function ar(e, r, n) {
  if (p(r, 102)) return Ie(r, n, e), !0;
  switch (r.code) {
    case 0:
      e.type = r.value;
      break;
    case 5:
      e.handle = r.value;
      break;
    case 330:
      e.ownerBlockRecordSoftId = r.value;
      break;
    case 67:
      e.isInPaperSpace = !!r.value;
      break;
    case 8:
      e.layer = r.value;
      break;
    case 6:
      e.lineType = r.value;
      break;
    case 347:
      e.materialObjectHardId = r.value;
      break;
    case 62:
      e.colorIndex = r.value, e.color = mr(Math.abs(r.value));
      break;
    case 370:
      e.lineweight = r.value;
      break;
    case 48:
      e.lineTypeScale = r.value;
      break;
    case 60:
      e.isVisible = !!r.value;
      break;
    case 92:
      e.proxyByte = r.value;
      break;
    case 310:
      e.proxyEntity = r.value;
      break;
    case 100:
      break;
    case 420:
      e.color = r.value;
      break;
    case 430:
      e.transparency = r.value;
      break;
    case 390:
      e.plotStyleHardId = r.value;
      break;
    case 284:
      e.shadowMode = r.value;
      break;
    case 1001:
      e.xdata = ur(r, n);
      break;
    default:
      return !1;
  }
  return !0;
}
function Nr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let Pa = { textStyle: "STANDARD", extrusionDirection: { x: 0, y: 0, z: 1 }, rotation: 0 }, Ve = [{ code: 46, name: "annotationHeight", parser: a }, { code: 101, parser(e, r) {
  (function(n) {
    n.rewind();
    let t = n.next();
    if (t.code !== 101) throw Error("Bad call for skipEmbeddedObject()");
    do
      t = n.next();
    while (t.code !== 0);
    n.rewind();
  })(r);
} }, { code: 50, name: "columnHeight", parser: a }, { code: 49, name: "columnGutter", parser: a }, { code: 48, name: "columnWidth", parser: a }, { code: 79, name: "columnAutoHeight", parser: a }, { code: 78, name: "columnFlowReversed", parser: a }, { code: 76, name: "columnCount", parser: a }, { code: 75, name: "columnType", parser: a }, { code: 441, name: "backgroundFillTransparency", parser: a }, { code: 63, name: "backgroundFillColor", parser: a }, { code: 45, name: "fillBoxScale", parser: a }, { code: [...We(430, 440)], name: "backgroundColor", parser: a }, { code: [...We(420, 430)], name: "backgroundColor", parser: a }, { code: 90, name: "backgroundFill", parser: a }, { code: 44, name: "lineSpacing", parser: a }, { code: 73, name: "lineSpacingStyle", parser: a }, { code: 50, name: "rotation", parser: a }, { code: 43 }, { code: 42 }, { code: 11, name: "direction", parser: c }, { code: 210, name: "extrusionDirection", parser: c }, { code: 7, name: "styleName", parser: a }, ...Ye("text"), { code: 72, name: "drawingDirection", parser: a }, { code: 71, name: "attachmentPoint", parser: a }, { code: 41, name: "width", parser: a }, { code: 40, name: "height", parser: a }, { code: 10, name: "insertionPoint", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Sr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Nr(this, "parser", u(Ve, Pa));
  }
}
function xr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Nr(Sr, "ForEntityName", "MTEXT");
let Va = { thickness: 0, rotation: 0, scale: 1, obliqueAngle: 0, textStyle: "STANDARD", textGenerationFlag: 0, horizontalJustification: 0, verticalJustification: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, Ba = [...Ve.slice(Ve.findIndex(({ name: e }) => e === "columnType"), Ve.findIndex(({ name: e }) => e === "subclassMarker") + 1), { code: 100 }, { code: 0, parser(e) {
  if (!p(e, 0, "MTEXT")) return rr;
} }, { code: 2, name: "definitionTag", parser: a }, { code: 40, name: "annotationScale", parser: a }, { code: 10, name: "alignmentPoint", parser: c }, { code: 340, name: "secondaryAttributesHardId", parser: a }, { code: 70, name: "numberOfSecondaryAttributes", parser: a }, { code: 70, name: "isReallyLocked", parser: f }, { code: 70, name: "mtextFlag", parser: a }, { code: 280, name: "isDuplicatedEntriesKeep", parser: f }, { code: 100 }, { code: 280, name: "lockPositionFlag", parser: f }, { code: 210, name: "extrusionDirection", parser: c }, { code: 11, name: "alignmentPoint", parser: c }, { code: 74, name: "verticalJustification", parser: a }, { code: 72, name: "horizontalJustification", parser: a }, { code: 71, name: "textGenerationFlag", parser: a }, { code: 7, name: "textStyle", parser: a }, { code: 51, name: "obliqueAngle", parser: a }, { code: 41, name: "scale", parser: a }, { code: 50, name: "rotation", parser: a }, { code: 73 }, { code: 70, name: "attributeFlag", parser: a }, { code: 2, name: "tag", parser: a }, { code: 280 }, { code: 100, name: "subclassMarker", parser: a }, { code: 1, name: "text", parser: a }, { code: 40, name: "textHeight", parser: a }, { code: 10, name: "startPoint", parser: c }, { code: 39, name: "thickness", parser: a }, { code: 100 }, ...I];
class yr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    xr(this, "parser", u(Ba, Va));
  }
}
function gr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
xr(yr, "ForEntityName", "ATTRIB");
let Ua = [...Ye("data"), { code: 70, name: "version", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class _r {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    gr(this, "parser", u(Ua));
  }
}
function Lr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
gr(_r, "ForEntityName", "BODY");
let Ga = { thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, Ha = [{ code: 210, name: "extrusionDirection", parser: c }, { code: 40, name: "radius", parser: a }, { code: 10, name: "center", parser: c }, { code: 39, name: "thickness", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Dr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Lr(this, "parser", u(Ha, Ga));
  }
}
Lr(Dr, "ForEntityName", "CIRCLE");
class Be {
  parseEntity(r, n) {
    let t = {};
    for (; !p(n, 0, "EOF"); ) {
      if (n.code === 0) {
        r.rewind();
        break;
      }
      (function(s, o, i) {
        switch (o.code) {
          case 100:
            s.subclassMarker = o.value;
            break;
          case 280:
            s.version = o.value;
            break;
          case 2:
            s.name = o.value;
            break;
          case 10:
            s.definitionPoint = m(i);
            break;
          case 11:
            s.textPoint = m(i);
            break;
          case 12:
            s.insertionPoint = m(i);
            break;
          case 13:
            s.subDefinitionPoint1 = m(i);
            break;
          case 14:
            s.subDefinitionPoint2 = m(i);
            break;
          case 15:
            s.centerPoint = m(i);
            break;
          case 16:
            s.arcPoint = m(i);
            break;
          case 70:
            s.dimensionType = o.value;
            break;
          case 71:
            s.attachmentPoint = o.value;
            break;
          case 72:
            s.textLineSpacingStyle = o.value;
            break;
          case 40:
            s.leaderLength = o.value;
            break;
          case 41:
            s.textLineSpacingFactor = o.value;
            break;
          case 42:
            s.measurement = o.value;
            break;
          case 1:
            s.text = o.value;
            break;
          case 50:
            s.rotationAngle = o.value;
            break;
          case 52:
            s.obliqueAngle = o.value;
            break;
          case 53:
            s.textRotation = o.value;
            break;
          case 51:
            s.ocsRotation = o.value;
            break;
          case 210:
            s.extrusionDirection = m(i);
            break;
          case 3:
            s.styleName = o.value;
            break;
          default:
            ar(s, o, i);
        }
      })(t, n, r), n = r.next();
    }
    return t;
  }
}
function Ar(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Xe = "DIMENSION", (je = "ForEntityName") in Be ? Object.defineProperty(Be, je, { value: Xe, enumerable: !0, configurable: !0, writable: !0 }) : Be[je] = Xe;
let Wa = { extrusionDirection: { x: 0, y: 0, z: 1 } }, Ya = [{ code: 42, name: "endAngle", parser: a }, { code: 41, name: "startAngle", parser: a }, { code: 40, name: "axisRatio", parser: a }, { code: 210, name: "extrusionDirection", parser: c }, { code: 11, name: "majorAxisEndPoint", parser: c }, { code: 10, name: "center", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class kr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Ar(this, "parser", u(Ya, Wa));
  }
}
Ar(kr, "ForEntityName", "ELLIPSE");
(Z = {})[Z.First = 1] = "First", Z[Z.Second = 2] = "Second", Z[Z.Third = 4] = "Third", Z[Z.Fourth = 8] = "Fourth";
function Mr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let ja = [{ code: 13, name: "vertices.3", parser: c }, { code: 12, name: "vertices.2", parser: c }, { code: 11, name: "vertices.1", parser: c }, { code: 10, name: "vertices.0", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Rr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Mr(this, "parser", u(ja));
  }
}
Mr(Rr, "ForEntityName", "3DFACE");
let Fr = [{ code: 330, name: "sourceBoundaryObjects", parser: a, isMultiple: !0 }, { code: 97, name: "numberOfSourceBoundaryObjects", parser: a }], Xa = [{ code: 11, name: "end", parser: c }, { code: 10, name: "start", parser: c }], za = [{ code: 73, name: "isCCW", parser: f }, { code: 51, name: "endAngle", parser: a }, { code: 50, name: "startAngle", parser: a }, { code: 40, name: "radius", parser: a }, { code: 10, name: "center", parser: c }], Ka = [{ code: 73, name: "isCCW", parser: f }, { code: 51, name: "endAngle", parser: a }, { code: 50, name: "startAngle", parser: a }, { code: 40, name: "lengthOfMinorAxis", parser: a }, { code: 11, name: "end", parser: c }, { code: 10, name: "center", parser: c }], Za = [{ code: 13, name: "endTangent", parser: c }, { code: 12, name: "startTangent", parser: c }, { code: 11, name: "fitDatum", isMultiple: !0, parser: c }, { code: 97, name: "numberOfFitData", parser: a }, { code: 10, name: "controlPoints", isMultiple: !0, parser(e, r) {
  let n = { ...m(r), weight: 1 };
  return (e = r.next()).code === 42 ? n.weight = e.value : r.rewind(), n;
} }, { code: 40, name: "knots", isMultiple: !0, parser: a }, { code: 96, name: "numberOfControlPoints", parser: a }, { code: 95, name: "numberOfKnots", parser: a }, { code: 74, name: "isPeriodic", parser: f }, { code: 73, name: "splineFlag", parser: a }, { code: 94, name: "degree", parser: a }], $a = { [Pe.Line]: Xa, [Pe.Circular]: za, [Pe.Elliptic]: Ka, [Pe.Spline]: Za }, Ja = [...Fr, { code: 72, name: "edges", parser(e, r) {
  let n = { type: e.value }, t = u($a[n.type]);
  if (!t) throw Error(`Invalid edge type ${n.type}`);
  return t(e = r.next(), r, n), n;
}, isMultiple: !0 }, { code: 93, name: "numberOfEdges", parser: a }], qa = [...Fr, { code: 10, name: "vertices", parser(e, r) {
  let n = { ...m(r), bulge: 0 };
  return (e = r.next()).code === 42 ? n.bulge = e.value : r.rewind(), n;
}, isMultiple: !0 }, { code: 93, name: "numberOfVertices", parser: a }, { code: 73, name: "isClosed", parser: f }, { code: 72, name: "hasBulge", parser: f }], Qa = [{ code: 49, name: "dashLengths", parser: a, isMultiple: !0 }, { code: 79, name: "numberOfDashLengths", parser: a }, { code: 45, name: "offset", parser: or }, { code: 43, name: "base", parser: or }, { code: 53, name: "angle", parser: a }];
function or(e, r) {
  let n = e.code + 1, t = { x: e.value, y: 1 };
  return (e = r.next()).code === n ? t.y = e.value : r.rewind(), t;
}
function Cr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let en = { extrusionDirection: { x: 0, y: 0, z: 1 }, gradientRotation: 0, colorTint: 0 }, rn = [{ code: 470 }, { code: 463 }, { code: 462, name: "colorTint", parser: a }, { code: 461, name: "gradientDefinition", parser: a }, { code: 460, name: "gradientRotation", parser: a }, { code: 453, name: "numberOfColors", parser: a }, { code: 452, name: "gradientColorFlag", parser: a }, { code: 451 }, { code: 450, name: "gradientFlag", parser: a }, { code: 10, name: "seedPoints", parser: c, isMultiple: !0 }, { code: 99 }, { code: 11, name: "offsetVector", parser: c }, { code: 98, name: "numberOfSeedPoints", parser: a }, { code: 47, name: "pixelSize", parser: a }, { code: 53, name: "definitionLines", parser: function(e, r) {
  let n = {};
  return u(Qa)(e, r, n), n;
}, isMultiple: !0 }, { code: 78, name: "numberOfDefinitionLines", parser: a }, { code: 77, name: "isDouble", parser: f }, { code: 73, name: "isAnnotated", parser: f }, { code: 41, name: "patternScale", parser: a }, { code: 52, name: "patternAngle", parser: a }, { code: 76, name: "patternType", parser: a }, { code: 75, name: "hatchStyle", parser: a }, { code: 92, name: "boundaryPaths", parser: function(e, r) {
  let n = { boundaryPathTypeFlag: e.value }, t = n.boundaryPathTypeFlag & ya.Polyline;
  return e = r.next(), t ? u(qa)(e, r, n) : u(Ja)(e, r, n), n;
}, isMultiple: !0 }, { code: 91, name: "numberOfBoundaryPaths", parser: a }, { code: 71, name: "associativity", parser: a }, { code: 63, name: "patternFillColor", parser: a }, { code: 70, name: "solidFill", parser: a }, { code: 2, name: "patternName", parser: a }, { code: 210, name: "extrusionDirection", parser: c }, { code: 10, name: "elevationPoint", parser: c }, { code: 100, name: "subclassMarker", parser: a, pushContext: !0 }, ...I];
class wr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Cr(this, "parser", u(rn, en));
  }
}
Cr(wr, "ForEntityName", "HATCH");
($ = {})[$.ShowImage = 1] = "ShowImage", $[$.ShowImageWhenNotAlignedWithScreen = 2] = "ShowImageWhenNotAlignedWithScreen", $[$.UseClippingBoundary = 4] = "UseClippingBoundary", $[$.TransparencyIsOn = 8] = "TransparencyIsOn";
(Ae = {})[Ae.Rectangular = 1] = "Rectangular", Ae[Ae.Polygonal = 2] = "Polygonal";
(ke = {})[ke.Outside = 0] = "Outside", ke[ke.Inside = 1] = "Inside";
function Pr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let an = { brightness: 50, contrast: 50, fade: 0, clippingBoundaryPath: [] }, nn = [{ code: 290, name: "clipMode", parser: a }, { code: 14, name: "clippingBoundaryPath", isMultiple: !0, parser: c }, { code: 91, name: "countBoundaryPoints", parser: a }, { code: 71, name: "clippingBoundaryType", parser: a }, { code: 360, name: "imageDefReactorHandle", parser: a }, { code: 283, name: "fade", parser: a }, { code: 282, name: "contrast", parser: a }, { code: 281, name: "brightness", parser: a }, { code: 280, name: "isClipped", parser: f }, { code: 70, name: "flags", parser: a }, { code: 340, name: "imageDefHandle", parser: a }, { code: 13, name: "imageSize", parser: c }, { code: 12, name: "vPixel", parser: c }, { code: 11, name: "uPixel", parser: c }, { code: 10, name: "position", parser: c }, { code: 90, name: "version", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Vr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Pr(this, "parser", u(nn, an));
  }
}
function Br(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Pr(Vr, "ForEntityName", "IMAGE");
let tn = { xScale: 1, yScale: 1, zScale: 1, rotation: 0, columnCount: 0, rowCount: 0, columnSpacing: 0, rowSpacing: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, sn = [{ code: 210, name: "extrusionDirection", parser: c }, { code: 45, name: "rowSpacing", parser: a }, { code: 44, name: "columnSpacing", parser: a }, { code: 71, name: "rowCount", parser: a }, { code: 70, name: "columnCount", parser: a }, { code: 50, name: "rotation", parser: a }, { code: 43, name: "zScale", parser: a }, { code: 42, name: "yScale", parser: a }, { code: 41, name: "xScale", parser: a }, { code: 10, name: "insertionPoint", parser: c }, { code: 2, name: "name", parser: a }, { code: 66, name: "isVariableAttributes", parser: f }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Ur {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Br(this, "parser", u(sn, tn));
  }
}
function Gr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Br(Ur, "ForEntityName", "INSERT");
let on = { isArrowheadEnabled: !0 }, cn = [{ code: 213, name: "offsetFromAnnotation", parser: c }, { code: 212, name: "offsetFromBlock", parser: c }, { code: 211, name: "horizontalDirection", parser: c }, { code: 210, name: "normal", parser: c }, { code: 340, name: "associatedAnnotation", parser: a }, { code: 77, name: "byBlockColor", parser: a }, { code: 10, name: "vertices", parser: c, isMultiple: !0 }, { code: 76, name: "numberOfVertices", parser: a }, { code: 41, name: "textWidth", parser: a }, { code: 40, name: "textHeight", parser: a }, { code: 75, name: "isHooklineExists", parser: f }, { code: 74, name: "isHooklineSameDirection", parser: f }, { code: 73, name: "leaderCreationFlag", parser: a }, { code: 72, name: "isSpline", parser: f }, { code: 71, name: "isArrowheadEnabled", parser: f }, { code: 3, name: "styleName", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Hr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Gr(this, "parser", u(cn, on));
  }
}
Gr(Hr, "ForEntityName", "LEADER");
(J = {})[J.TextAnnotation = 0] = "TextAnnotation", J[J.ToleranceAnnotation = 1] = "ToleranceAnnotation", J[J.BlockReferenceAnnotation = 2] = "BlockReferenceAnnotation", J[J.NoAnnotation = 3] = "NoAnnotation";
function Wr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let ln = { thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, dn = [{ code: 210, name: "extrusionDirection", parser: c }, { code: 11, name: "endPoint", parser: c }, { code: 10, name: "startPoint", parser: c }, { code: 39, name: "thickness", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Yr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Wr(this, "parser", u(dn, ln));
  }
}
Wr(Yr, "ForEntityName", "LINE");
(Me = {})[Me.IS_CLOSED = 1] = "IS_CLOSED", Me[Me.PLINE_GEN = 128] = "PLINE_GEN";
let un = { flag: 0, elevation: 0, thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 }, vertices: [] }, pn = { bulge: 0 }, mn = [{ code: 42, name: "bulge", parser: a }, { code: 41, name: "endWidth", parser: a }, { code: 40, name: "startWidth", parser: a }, { code: 91, name: "id", parser: a }, { code: 20, name: "y", parser: a }, { code: 10, name: "x", parser: a }], fn = [{ code: 210, name: "extrusionDirection", parser: c }, { code: 10, name: "vertices", isMultiple: !0, parser(e, r) {
  let n = {};
  return u(mn, pn)(e, r, n), n;
} }, { code: 39, name: "thickness", parser: a }, { code: 38, name: "elevation", parser: a }, { code: 43, name: "constantWidth", parser: a }, { code: 70, name: "flag", parser: a }, { code: 90, name: "numberOfVertices", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Ue {
  parseEntity(r, n) {
    let t = {};
    return u(fn, un)(n, r, t), t;
  }
}
function jr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Ke = "LWPOLYLINE", (ze = "ForEntityName") in Ue ? Object.defineProperty(Ue, ze, { value: Ke, enumerable: !0, configurable: !0, writable: !0 }) : Ue[ze] = Ke;
let In = [{ code: 90, name: "overridenSubEntityCount", parser: a }, { code: 140, name: "edgeCreaseWeights", parser: a, isMultiple: !0 }, { code: 95, name: "edgeCreaseCount", parser: a }, { code: 94, parser(e, r, n) {
  n.edgeCount = e.value, n.edgeIndices = [];
  for (let t = 0; t < n.edgeCount; ++t) {
    let s = [];
    e = r.next(), s[0] = e.value, e = r.next(), s[1] = e.value, n.edgeIndices.push(s);
  }
} }, { code: 93, parser(e, r, n) {
  n.totalFaceIndices = e.value, n.faceIndices = [];
  let t = [];
  for (let o = 0; o < n.totalFaceIndices && !p(e, 0); ++o) e = r.next(), t.push(e.value);
  let s = 0;
  for (; s < t.length; ) {
    let o = t[s++], i = [];
    for (let b = 0; b < o; ++b) i.push(t[s++]);
    n.faceIndices.push(i);
  }
} }, { code: 10, name: "vertices", parser: c, isMultiple: !0 }, { code: 92, name: "verticesCount", parser: a }, { code: 91, name: "subdivisionLevel", parser: a }, { code: 40, name: "blendCrease", parser: a }, { code: 72, name: "isBlendCreased", parser: f }, { code: 71, name: "version", parser: a }, { code: 100, name: "subclassMarker", parser: function({ value: e }) {
  return e.trim();
}, pushContext: !0 }, ...I];
class Xr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    jr(this, "parser", u(In));
  }
}
function zr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
jr(Xr, "ForEntityName", "MESH");
let En = { thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 }, angle: 0 }, bn = [{ code: 50, name: "angle", parser: a }, { code: 210, name: "extrusionDirection", parser: c }, { code: 39, name: "thickness", parser: a }, { code: 10, name: "position", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Kr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    zr(this, "parser", u(bn, En));
  }
}
zr(Kr, "ForEntityName", "POINT");
(x = {})[x.CLOSED_POLYLINE = 1] = "CLOSED_POLYLINE", x[x.CURVE_FIT = 2] = "CURVE_FIT", x[x.SPLINE_FIT = 4] = "SPLINE_FIT", x[x.POLYLINE_3D = 8] = "POLYLINE_3D", x[x.POLYGON_3D = 16] = "POLYGON_3D", x[x.CLOSED_POLYGON = 32] = "CLOSED_POLYGON", x[x.POLYFACE = 64] = "POLYFACE", x[x.CONTINUOUS = 128] = "CONTINUOUS";
(q = {})[q.NONE = 0] = "NONE", q[q.QUADRATIC = 5] = "QUADRATIC", q[q.CUBIC = 6] = "CUBIC", q[q.BEZIER = 8] = "BEZIER";
(y = {})[y.CREATED_BY_CURVE_FIT = 1] = "CREATED_BY_CURVE_FIT", y[y.TANGENT_DEFINED = 2] = "TANGENT_DEFINED", y[y.NOT_USED = 4] = "NOT_USED", y[y.CREATED_BY_SPLINE_FIT = 8] = "CREATED_BY_SPLINE_FIT", y[y.SPLINE_CONTROL_POINT = 16] = "SPLINE_CONTROL_POINT", y[y.FOR_POLYLINE = 32] = "FOR_POLYLINE", y[y.FOR_POLYGON = 64] = "FOR_POLYGON", y[y.POLYFACE = 128] = "POLYFACE";
function Zr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let hn = { startWidth: 0, endWidth: 0, bulge: 0 }, On = [{ code: 91, name: "id", parser: a }, { code: [...We(71, 75)], name: "faces", isMultiple: !0, parser: a }, { code: 50, name: "tangentDirection", parser: a }, { code: 70, name: "flag", parser: a }, { code: 42, name: "bulge", parser: a }, { code: 41, name: "endWidth", parser: a }, { code: 40, name: "startWidth", parser: a }, { code: 30, name: "z", parser: a }, { code: 20, name: "y", parser: a }, { code: 10, name: "x", parser: a }, { code: 100, name: "subclassMarker", parser: a }, { code: 100 }, ...I];
class nr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Zr(this, "parser", u(On, hn));
  }
}
function $r(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
Zr(nr, "ForEntityName", "VERTEX");
let Tn = { thickness: 0, flag: 0, startWidth: 0, endWidth: 0, meshMVertexCount: 0, meshNVertexCount: 0, surfaceMDensity: 0, surfaceNDensity: 0, smoothType: 0, extrusionDirection: { x: 0, y: 0, z: 1 }, vertices: [] }, vn = [{ code: 0, name: "vertices", isMultiple: !0, parser: (e, r) => p(e, 0, "VERTEX") ? (e = r.next(), new nr().parseEntity(r, e)) : rr }, { code: 210, name: "extrusionDirection", parser: c }, { code: 75, name: "smoothType", parser: a }, { code: 74, name: "surfaceNDensity", parser: a }, { code: 73, name: "surfaceMDensity", parser: a }, { code: 72, name: "meshNVertexCount", parser: a }, { code: 71, name: "meshMVertexCount", parser: a }, { code: 41, name: "endWidth", parser: a }, { code: 40, name: "startWidth", parser: a }, { code: 70, name: "flag", parser: a }, { code: 39, name: "thickness", parser: a }, { code: 30, name: "elevation", parser: a }, { code: 20 }, { code: 10 }, { code: 66 }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Jr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    $r(this, "parser", u(vn, Tn));
  }
}
function qr(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
$r(Jr, "ForEntityName", "POLYLINE");
let Nn = [{ code: 11, name: "direction", parser: c }, { code: 10, name: "position", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Qr {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    qr(this, "parser", u(Nn));
  }
}
function ea(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
qr(Qr, "ForEntityName", "RAY");
let Sn = [...Ye("data"), { code: 70, name: "version", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class ra {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    ea(this, "parser", u(Sn));
  }
}
function aa(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
ea(ra, "ForEntityName", "REGION");
let xn = { vertices: [], backLineVertices: [] }, yn = [{ code: 360, name: "geometrySettingHardId", parser: a }, { code: 12, name: "backLineVertices", isMultiple: !0, parser: c }, { code: 93, name: "numberOfBackLineVertices", parser: a }, { code: 11, name: "vertices", isMultiple: !0, parser: c }, { code: 92, name: "verticesCount", parser: a }, { code: [63, 411], name: "indicatorColor", parser: a }, { code: 70, name: "indicatorTransparency", parser: a }, { code: 41, name: "bottomHeight", parser: a }, { code: 40, name: "topHeight", parser: a }, { code: 10, name: "verticalDirection", parser: c }, { code: 1, name: "name", parser: a }, { code: 91, name: "flag", parser: a }, { code: 90, name: "state", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class na {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    aa(this, "parser", u(yn, xn));
  }
}
function ta(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
aa(na, "ForEntityName", "SECTION");
let gn = { points: [], thickness: 0, extrusionDirection: { x: 0, y: 0, z: 1 } }, _n = [{ code: 210, name: "extrusionDirection", parser: c }, { code: 39, name: "thickness", parser: a }, { code: [...We(10, 14)], name: "points", isMultiple: !0, parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class sa {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    ta(this, "parser", u(_n, gn));
  }
}
function oa(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
ta(sa, "ForEntityName", "SOLID");
let Ln = [{ code: 350, name: "historyObjectSoftId", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...Ye("data"), { code: 70, name: "version", parser: a }, { code: 100 }, ...I];
class ca {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    oa(this, "parser", u(Ln));
  }
}
oa(ca, "ForEntityName", "3DSOLID");
(M = {})[M.NONE = 0] = "NONE", M[M.CLOSED = 1] = "CLOSED", M[M.PERIODIC = 2] = "PERIODIC", M[M.RATIONAL = 4] = "RATIONAL", M[M.PLANAR = 8] = "PLANAR", M[M.LINEAR = 16] = "LINEAR";
function ia(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let Dn = { knotTolerance: 1e-6, controlTolerance: 1e-6, fitTolerance: 1e-9, knotValues: [], controlPoints: [], fitPoints: [] }, An = [{ code: 11, name: "fitPoints", isMultiple: !0, parser: c }, { code: 10, name: "controlPoints", isMultiple: !0, parser: c }, { code: 41, name: "weights", isMultiple: !0, parser: a }, { code: 40, name: "knots", isMultiple: !0, parser: a }, { code: 13, name: "endTangent", parser: c }, { code: 12, name: "startTangent", parser: c }, { code: 44, name: "fitTolerance", parser: a }, { code: 43, name: "controlTolerance", parser: a }, { code: 42, name: "knotTolerance", parser: a }, { code: 74, name: "numberOfFitPoints", parser: a }, { code: 73, name: "numberOfControlPoints", parser: a }, { code: 72, name: "numberOfKnots", parser: a }, { code: 71, name: "degree", parser: a }, { code: 70, name: "flag", parser: a }, { code: 210, name: "normal", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class la {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    ia(this, "parser", u(An, Dn));
  }
}
ia(la, "ForEntityName", "SPLINE");
class Ge {
  parseEntity(r, n) {
    let t = {};
    for (; !r.isEOF(); ) {
      if (n.code === 0) {
        r.rewind();
        break;
      }
      switch (n.code) {
        case 100:
          t.subclassMarker = n.value, n = r.next();
          break;
        case 2:
          t.name = n.value, n = r.next();
          break;
        case 5:
          t.handle = n.value, n = r.next();
          break;
        case 10:
          t.startPoint = te(m(r)), n = r.lastReadGroup;
          break;
        case 11:
          t.directionVector = te(m(r)), n = r.lastReadGroup;
          break;
        case 90:
          t.tableValue = n.value, n = r.next();
          break;
        case 91:
          t.rowCount = n.value, n = r.next();
          break;
        case 92:
          t.columnCount = n.value, n = r.next();
          break;
        case 93:
          t.overrideFlag = n.value, n = r.next();
          break;
        case 94:
          t.borderColorOverrideFlag = n.value, n = r.next();
          break;
        case 95:
          t.borderLineWeightOverrideFlag = n.value, n = r.next();
          break;
        case 96:
          t.borderVisibilityOverrideFlag = n.value, n = r.next();
          break;
        case 141:
          t.rowHeightArr ?? (t.rowHeightArr = []), t.rowHeightArr.push(n.value), n = r.next();
          break;
        case 142:
          t.columnWidthArr ?? (t.columnWidthArr = []), t.columnWidthArr.push(n.value), n = r.next();
          break;
        case 280:
          t.version = n.value, n = r.next();
          break;
        case 310:
          t.bmpPreview ?? (t.bmpPreview = ""), t.bmpPreview += n.value, n = r.next();
          break;
        case 330:
          t.ownerDictionaryId = n.value, n = r.next();
          break;
        case 342:
          t.tableStyleId = n.value, n = r.next();
          break;
        case 343:
          t.blockRecordHandle = n.value, n = r.next();
          break;
        case 170:
          t.attachmentPoint = n.value, n = r.next();
          break;
        case 171:
          t.cells ?? (t.cells = []), t.cells.push(function(s, o) {
            let i = !1, b = !1, d = {};
            for (; !s.isEOF() && o.code !== 0 && !b; ) switch (o.code) {
              case 171:
                if (i) {
                  b = !0;
                  continue;
                }
                d.cellType = o.value, i = !0, o = s.next();
                break;
              case 172:
                d.flagValue = o.value, o = s.next();
                break;
              case 173:
                d.mergedValue = o.value, o = s.next();
                break;
              case 174:
                d.autoFit = o.value, o = s.next();
                break;
              case 175:
                d.borderWidth = o.value, o = s.next();
                break;
              case 176:
                d.borderHeight = o.value, o = s.next();
                break;
              case 91:
                d.overrideFlag = o.value, o = s.next();
                break;
              case 178:
                d.virtualEdgeFlag = o.value, o = s.next();
                break;
              case 145:
                d.rotation = o.value, o = s.next();
                break;
              case 345:
                d.fieldObjetId = o.value, o = s.next();
                break;
              case 340:
                d.blockTableRecordId = o.value, o = s.next();
                break;
              case 146:
                d.blockScale = o.value, o = s.next();
                break;
              case 177:
                d.blockAttrNum = o.value, o = s.next();
                break;
              case 7:
                d.textStyle = o.value, o = s.next();
                break;
              case 140:
                d.textHeight = o.value, o = s.next();
                break;
              case 170:
                d.attachmentPoint = o.value, o = s.next();
                break;
              case 92:
                d.extendedCellFlags = o.value, o = s.next();
                break;
              case 285:
                d.rightBorderVisibility = !!(o.value ?? !0), o = s.next();
                break;
              case 286:
                d.bottomBorderVisibility = !!(o.value ?? !0), o = s.next();
                break;
              case 288:
                d.leftBorderVisibility = !!(o.value ?? !0), o = s.next();
                break;
              case 289:
                d.topBorderVisibility = !!(o.value ?? !0), o = s.next();
                break;
              case 301:
                (function(N, v, E) {
                  for (; E.code !== 304; ) switch (E.code) {
                    case 301:
                    case 93:
                    case 90:
                    case 94:
                      E = v.next();
                      break;
                    case 1:
                      N.text = E.value, E = v.next();
                      break;
                    case 300:
                      N.attrText = E.value, E = v.next();
                      break;
                    case 302:
                      N.text = E.value ? E.value : N.text, E = v.next();
                      break;
                    default:
                      console.log(`Ignore code: ${E.code}, value: ${E.value}`), E = v.next();
                  }
                })(d, s, o), o = s.next();
                break;
              default:
                return d;
            }
            return i = !1, b = !1, d;
          }(r, n)), n = r.lastReadGroup;
          break;
        default:
          ar(t, n, r), n = r.next();
      }
    }
    return t;
  }
}
function da(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
$e = "ACAD_TABLE", (Ze = "ForEntityName") in Ge ? Object.defineProperty(Ge, Ze, { value: $e, enumerable: !0, configurable: !0, writable: !0 }) : Ge[Ze] = $e;
let kn = [{ code: 11, name: "xAxisDirection", parser: c }, { code: 210, name: "extrusionDirection", parser: c }, { code: 1, name: "text", parser: a }, { code: 10, name: "position", parser: c }, { code: 3, name: "styleName", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class ua {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    da(this, "parser", u(kn));
  }
}
da(ua, "ForEntityName", "TOLERANCE");
class He {
  parseEntity(r, n) {
    let t = {};
    for (; n !== "EOF"; ) {
      if (n.code === 0) {
        r.rewind();
        break;
      }
      !function(s, o, i) {
        if (i === "EOF") return !1;
        switch (i.code) {
          case 0:
            return !1;
          case 8:
            s.layer = i.value;
            break;
          case 100:
            s.subclassMarker = i.value;
            break;
          case 10:
            s.viewportCenter = te(m(o));
            break;
          case 40:
            s.width = i.value;
            break;
          case 41:
            s.height = i.value;
            break;
          case 68:
            s.status = i.value;
            break;
          case 69:
            s.viewportId = i.value;
            break;
          case 12:
            s.displayCenter = m(o);
            break;
          case 13:
            s.snapBase = m(o);
            break;
          case 14:
            s.snapSpacing = m(o);
            break;
          case 15:
            s.gridSpacing = m(o);
            break;
          case 16:
            s.viewDirection = te(m(o));
            break;
          case 17:
            s.targetPoint = te(m(o));
            break;
          case 42:
            s.perspectiveLensLength = i.value;
            break;
          case 43:
            s.frontClipZ = i.value;
            break;
          case 44:
            s.backClipZ = i.value;
            break;
          case 45:
            s.viewHeight = i.value;
            break;
          case 50:
            s.snapAngle = i.value;
            break;
          case 51:
            s.viewTwistAngle = i.value;
            break;
          case 72:
            s.circleZoomPercent = i.value;
            break;
          case 331:
            s.frozenLayerIds ?? (s.frozenLayerIds = []), s.frozenLayerIds.push(i.value);
            break;
          case 90:
            s.statusBitFlags = i.value;
            break;
          case 340:
            s.clippingBoundaryId = i.value;
            break;
          case 1:
            s.sheetName = i.value;
            break;
          case 281:
            s.renderMode = i.value;
            break;
          case 71:
            s.ucsPerViewport = i.value;
            break;
          case 110:
            s.ucsOrigin = te(m(o));
            break;
          case 111:
            s.ucsXAxis = te(m(o));
            break;
          case 112:
            s.ucsYAxis = te(m(o));
            break;
          case 345:
            s.ucsId = i.value;
            break;
          case 346:
            s.ucsBaseId = i.value;
            break;
          case 79:
            s.orthographicType = i.value;
            break;
          case 146:
            s.elevation = i.value;
            break;
          case 170:
            s.shadePlotMode = i.value;
            break;
          case 61:
            s.majorGridFrequency = i.value;
            break;
          case 332:
            s.backgroundId = i.value;
            break;
          case 333:
            s.shadePlotId = i.value;
            break;
          case 348:
            s.visualStyleId = i.value;
            break;
          case 292:
            s.isDefaultLighting = !!i.value;
            break;
          case 282:
            s.defaultLightingType = i.value;
            break;
          case 141:
            s.brightness = i.value;
            break;
          case 142:
            s.contrast = i.value;
            break;
          case 63:
          case 421:
          case 431:
            s.ambientLightColor = i.value;
            break;
          case 361:
            s.sunId = i.value;
            break;
          case 335:
          case 343:
          case 344:
          case 91:
            s.softPointer = i.value;
        }
        return !0;
      }(t, r, n) && ar(t, n, r), n = r.next();
    }
    return t;
  }
}
qe = "VIEWPORT", (Je = "ForEntityName") in He ? Object.defineProperty(He, Je, { value: qe, enumerable: !0, configurable: !0, writable: !0 }) : He[Je] = qe;
(Q = {})[Q.ShowImage = 1] = "ShowImage", Q[Q.ShowImageWhenNotAligned = 2] = "ShowImageWhenNotAligned", Q[Q.UseClippingBoundary = 4] = "UseClippingBoundary", Q[Q.Transparency = 8] = "Transparency";
function pa(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
let Mn = { brightness: 50, constrast: 50, fade: 0 }, Rn = [{ code: 14, name: "boundary", isMultiple: !0, parser: c }, { code: 91, name: "numberOfVertices", parser: a }, { code: 71, name: "boundaryType", parser: a }, { code: 360, name: "imageDefReactorHardId", parser: a }, { code: 283, name: "fade", parser: a }, { code: 282, name: "contrast", parser: a }, { code: 281, name: "brightness", parser: a }, { code: 280, name: "isClipping", parser: f }, { code: 70, name: "displayFlag", parser: a }, { code: 340, name: "imageDefHardId", parser: a }, { code: 13, name: "imageSize", parser: c }, { code: 12, name: "vDirection", parser: c }, { code: 11, name: "uDirection", parser: c }, { code: 10, name: "position", parser: c }, { code: 90, name: "classVersion", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class ma {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    pa(this, "parser", u(Rn, Mn));
  }
}
function fa(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
pa(ma, "ForEntityName", "WIPEOUT");
let Fn = [{ code: 11, name: "direction", parser: c }, { code: 10, name: "position", parser: c }, { code: 100, name: "subclassMarker", parser: a }, ...I];
class Ia {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    fa(this, "parser", u(Fn));
  }
}
function Ea(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
fa(Ia, "ForEntityName", "XLINE");
let Cn = {}, wn = [{ code: 170, name: "multileaderType", parser: a }, { code: 291, name: "doglegEnabled", parser: f }, { code: 40, name: "doglegLength", parser: a }, { code: 172, name: "contentType", parser: a }, { code: 3, name: "textContent", parser: a }, { code: 12, name: "textAnchor", parser: c }, { code: 344, name: "blockHandle", parser: a }, { code: 15, name: "blockPosition", parser: c }, { code: 302, name: "leaderSections", parser: function(e, r, n) {
  let t, s = { leaderLines: [] };
  for (; r.hasNext() && (t = r.next()).code !== 303; )
    switch (t.code) {
      case 10:
        s.landingPoint = (t.value, m(r));
        break;
      case 11:
        s.doglegVector = (t.value, m(r));
        break;
      case 40:
        s.doglegLength = t.value;
        break;
      case 304:
        s.leaderLines.push(function(o, i, b) {
          let d, N = { vertices: [] };
          for (; i.hasNext() && (d = i.next()).code !== 305; ) d.code === 10 && N.vertices.push((d.value, m(i)));
          return N;
        }(0, r));
    }
  return s;
}, isMultiple: !0 }, ...I];
class ba {
  parseEntity(r, n) {
    let t = {};
    return this.parser(n, r, t), t;
  }
  constructor() {
    Ea(this, "parser", u(wn, Cn));
  }
}
Ea(ba, "ForEntityName", "MULTILEADER");
let Pn = Object.fromEntries([Ir, vr, yr, _r, Dr, Be, kr, Rr, Vr, Ur, Hr, Yr, Ue, Xr, Sr, ba, Kr, Jr, Qr, ra, na, sa, ca, la, Ge, Or, ua, wr, nr, He, ma, Ia].map((e) => [e.ForEntityName, new e()]));
function ha(e, r) {
  let n = [];
  for (; !p(e, 0, "EOF"); ) {
    if (e.code === 0) {
      if (e.value === "ENDBLK" || e.value === "ENDSEC") {
        r.rewind();
        break;
      }
      let t = Pn[e.value];
      if (t) {
        let s = e.value;
        e = r.next();
        let o = t.parseEntity(r, e);
        o.type = s, pr(o), n.push(o);
      } else r.debug && console.warn(`Unsupported ENTITY type: ${e.value}`);
    }
    e = r.next();
  }
  return n;
}
function Vn(e, r) {
  let n = {};
  for (; !p(e, 0, "EOF") && !p(e, 0, "ENDSEC"); ) {
    if (p(e, 0, "BLOCK")) {
      let t = Bn(e = r.next(), r);
      pr(t), t.name && (n[t.name] = t);
    }
    e = r.next();
  }
  return n;
}
function Bn(e, r) {
  let n = {};
  for (; !p(e, 0, "EOF"); ) {
    if (p(e, 0, "ENDBLK")) {
      for (e = r.next(); !p(e, 0, "EOF"); ) {
        if (p(e, 100, "AcDbBlockEnd")) return n;
        e = r.next();
      }
      break;
    }
    switch (e.code) {
      case 1:
        n.xrefPath = e.value;
        break;
      case 2:
        n.name = e.value;
        break;
      case 3:
        n.name2 = e.value;
        break;
      case 5:
        n.handle = e.value;
        break;
      case 8:
        n.layer = e.value;
        break;
      case 10:
        n.position = m(r);
        break;
      case 67:
        n.paperSpace = !!e.value && e.value == 1;
        break;
      case 70:
        e.value !== 0 && (n.type = e.value);
        break;
      case 100:
        break;
      case 330:
        n.ownerHandle = e.value;
        break;
      case 0:
        n.entities = ha(e, r);
    }
    e = r.next();
  }
  return n;
}
function Un(e, r) {
  let n = null, t = {};
  for (; !p(e, 0, "EOF") && !p(e, 0, "ENDSEC"); ) e.code === 9 ? n = e.value : e.code === 10 ? t[n] = m(r) : t[n] = e.value, e = r.next();
  return t;
}
(R = {})[R.NOT_APPLICABLE = 0] = "NOT_APPLICABLE", R[R.KEEP_EXISTING = 1] = "KEEP_EXISTING", R[R.USE_CLONE = 2] = "USE_CLONE", R[R.XREF_VALUE_NAME = 3] = "XREF_VALUE_NAME", R[R.VALUE_NAME = 4] = "VALUE_NAME", R[R.UNMANGLE_NAME = 5] = "UNMANGLE_NAME";
let tr = [{ code: 330, name: "ownerObjectId", parser: a }, { code: 102, parser: Ie }, { code: 102, parser: Ie }, { code: 102, parser: Ie }, { code: 5, name: "handle", parser: a }], Gn = [{ code: 3, name: "entries", parser: (e, r) => {
  let n = { name: e.value };
  return (e = r.next()).code === 350 ? n.objectSoftId = e.value : e.code === 360 ? n.objectHardId = e.value : r.rewind(), n;
}, isMultiple: !0 }, { code: 281, name: "recordCloneFlag", parser: a }, { code: 280, name: "isHardOwned", parser: f }, { code: 100, name: "subclassMarker", parser: a }, ...tr], Hn = [{ code: 330, name: "imageDefReactorIdSoft", isMultiple: !0, parser: a }, { code: 90, name: "version", parser: a }, { code: 1, name: "fileName", parser: a }, { code: 10, name: "size", parser: c }, { code: 11, name: "sizeOfOnePixel", parser: c }, { code: 280, name: "isLoaded", parser: a }, { code: 281, name: "resolutionUnits", parser: a }, { code: 100, name: "subclassMarker", parser: a }];
(me = {})[me.NOUNIT = 0] = "NOUNIT", me[me.CENTIMETERS = 2] = "CENTIMETERS", me[me.INCH = 5] = "INCH";
(Re = {})[Re.PSLTSCALE = 1] = "PSLTSCALE", Re[Re.LIMCHECK = 2] = "LIMCHECK";
(fe = {})[fe.INCHES = 0] = "INCHES", fe[fe.MILLIMETERS = 1] = "MILLIMETERS", fe[fe.PIXELS = 2] = "PIXELS";
(F = {})[F.LAST_SCREEN_DISPLAY = 0] = "LAST_SCREEN_DISPLAY", F[F.DRAWING_EXTENTS = 1] = "DRAWING_EXTENTS", F[F.DRAWING_LIMITS = 2] = "DRAWING_LIMITS", F[F.VIEW_SPECIFIED = 3] = "VIEW_SPECIFIED", F[F.WINDOW_SPECIFIED = 4] = "WINDOW_SPECIFIED", F[F.LAYOUT_INFORMATION = 5] = "LAYOUT_INFORMATION";
(ee = {})[ee.AS_DISPLAYED = 0] = "AS_DISPLAYED", ee[ee.WIREFRAME = 1] = "WIREFRAME", ee[ee.HIDDEN = 2] = "HIDDEN", ee[ee.RENDERED = 3] = "RENDERED";
(C = {})[C.DRAFT = 0] = "DRAFT", C[C.PREVIEW = 1] = "PREVIEW", C[C.NORMAL = 2] = "NORMAL", C[C.PRESENTATION = 3] = "PRESENTATION", C[C.MAXIMUM = 4] = "MAXIMUM", C[C.CUSTOM = 5] = "CUSTOM";
let Oa = [{ code: 333, name: "shadePlotId", parser: a }, { code: 149, name: "imageOriginY", parser: a }, { code: 148, name: "imageOriginX", parser: a }, { code: 147, name: "scaleFactor", parser: a }, { code: 78, name: "shadePlotCustomDPI", parser: a }, { code: 77, name: "shadePlotResolution", parser: a }, { code: 76, name: "shadePlotMode", parser: a }, { code: 75, name: "standardScaleType", parser: a }, { code: 7, name: "currentStyleSheet", parser: a }, { code: 74, name: "plotType", parser: a }, { code: 73, name: "plotRotation", parser: a }, { code: 72, name: "plotPaperUnit", parser: a }, { code: 70, name: "layoutFlag", parser: a }, { code: 143, name: "printScaleDenominator", parser: a }, { code: 142, name: "printScaleNumerator", parser: a }, { code: 141, name: "windowAreaYMax", parser: a }, { code: 140, name: "windowAreaXMax", parser: a }, { code: 49, name: "windowAreaYMin", parser: a }, { code: 48, name: "windowAreaXMin", parser: a }, { code: 47, name: "plotOriginY", parser: a }, { code: 46, name: "plotOriginX", parser: a }, { code: 45, name: "paperHeight", parser: a }, { code: 44, name: "paperWidth", parser: a }, { code: 43, name: "marginTop", parser: a }, { code: 42, name: "marginRight", parser: a }, { code: 41, name: "marginBottom", parser: a }, { code: 40, name: "marginLeft", parser: a }, { code: 6, name: "plotViewName", parser: a }, { code: 4, name: "paperSize", parser: a }, { code: 2, name: "configName", parser: a }, { code: 1, name: "pageSetupName", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...tr], Wn = [{ code: 346, name: "orthographicUcsId", parser: a }, { code: 345, name: "namedUcsId", parser: a }, { code: 331, name: "viewportId", parser: a }, { code: 330, name: "paperSpaceTableId", parser: a }, { code: 76, name: "orthographicType", parser: a }, { code: 17, name: "ucsYAxis", parser: c }, { code: 16, name: "ucsXAxis", parser: c }, { code: 13, name: "ucsOrigin", parser: c }, { code: 146, name: "elevation", parser: a }, { code: 15, name: "maxExtent", parser: c }, { code: 14, name: "minExtent", parser: c }, { code: 12, name: "insertionPoint", parser: c }, { code: 11, name: "maxLimit", parser: c }, { code: 10, name: "minLimit", parser: c }, { code: 71, name: "tabOrder", parser: a }, { code: 70, name: "controlFlag", parser: a }, { code: 1, name: "layoutName", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...Oa], Yn = [{ code: 40, name: "wcsToOCSTransform", parser: cr }, { code: 40, name: "ocsToWCSTransform", parser: cr }, { code: 41, name: "backClippingDistance", parser: a }, { code: 73, name: "isBackClipping", parser: f, pushContext: !0 }, { code: 40, name: "frontClippingDistance", parser: a }, { code: 72, name: "isFrontClipping", parser: f, pushContext: !0 }, { code: 71, name: "isClipBoundaryDisplayed", parser: f }, { code: 11, name: "position", parser: c }, { code: 210, name: "normal", parser: c }, { code: 10, name: "boundaryVertices", parser: c, isMultiple: !0 }, { code: 70, name: "boundaryCount", parser: a }, { code: 100, name: "subclassMarker", parser: a }, { code: 100 }, ...tr];
function cr(e, r) {
  let n = [];
  for (let t = 0; t < 3 && p(e, 40); ++t) {
    let s = [];
    for (let o = 0; o < 4 && p(e, 40); ++o) s.push(e.value), e = r.next();
    n.push(s);
  }
  return r.rewind(), n;
}
let jn = { LAYOUT: Wn, PLOTSETTINGS: Oa, DICTIONARY: Gn, SPATIAL_FILTER: Yn, IMAGEDEF: Hn };
function Xn(e, r) {
  let n = [];
  for (; e.code !== 0 || !["EOF", "ENDSEC"].includes(e.value); ) {
    let t = e.value, s = jn[t];
    if (e.code === 0 && (s != null && s.length)) {
      let o = u(s), i = { name: t };
      o(e = r.next(), r, i) ? (n.push(i), e = r.peek()) : e = r.next();
    } else e = r.next();
  }
  return { byName: wa(n, ({ name: t }) => t) };
}
let be = [{ code: 100, name: "subclassMarker", parser: a }, { code: 330, name: "ownerObjectId", parser: a }, { code: 102, parser(e, r) {
  for (; !p(e, 0, "EOF") && !p(e, 102, "}"); ) e = r.next();
} }, { code: 5, name: "handle", parser: a }], zn = u([{ code: 310, name: "bmpPreview", parser: a }, { code: 281, name: "scalability", parser: a }, { code: 280, name: "explodability", parser: a }, { code: 70, name: "insertionUnits", parser: a }, { code: 340, name: "layoutObjects", parser: a }, { code: 2, name: "name", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...be]), Kn = [{ name: "DIMPOST", code: 3 }, { name: "DIMAPOST", code: 4 }, { name: "DIMBLK_OBSOLETE", code: 5 }, { name: "DIMBLK1_OBSOLETE", code: 6 }, { name: "DIMBLK2_OBSOLETE", code: 7 }, { name: "DIMSCALE", code: 40, defaultValue: 1 }, { name: "DIMASZ", code: 41, defaultValue: 0.25 }, { name: "DIMEXO", code: 42, defaultValue: 0.625, defaultValueImperial: 0.0625 }, { name: "DIMDLI", code: 43, defaultValue: 3.75, defaultValueImperial: 0.38 }, { name: "DIMEXE", code: 44, defaultValue: 2.25, defaultValueImperial: 0.28 }, { name: "DIMRND", code: 45, defaultValue: 0 }, { name: "DIMDLE", code: 46, defaultValue: 0 }, { name: "DIMTP", code: 47, defaultValue: 0 }, { name: "DIMTM", code: 48, defaultValue: 0 }, { name: "DIMTXT", code: 140, defaultValue: 2.5, defaultValueImperial: 0.28 }, { name: "DIMCEN", code: 141, defaultValue: 2.5, defaultValueImperial: 0.09 }, { name: "DIMTSZ", code: 142, defaultValue: 0 }, { name: "DIMALTF", code: 143, defaultValue: 25.4 }, { name: "DIMLFAC", code: 144, defaultValue: 1 }, { name: "DIMTVP", code: 145, defaultValue: 0 }, { name: "DIMTFAC", code: 146, defaultValue: 1 }, { name: "DIMGAP", code: 147, defaultValue: 0.625, defaultValueImperial: 0.09 }, { name: "DIMALTRND", code: 148, defaultValue: 0 }, { name: "DIMTOL", code: 71, defaultValue: 0, defaultValueImperial: 1 }, { name: "DIMLIM", code: 72, defaultValue: 0 }, { name: "DIMTIH", code: 73, defaultValue: 0, defaultValueImperial: 1 }, { name: "DIMTOH", code: 74, defaultValue: 0, defaultValueImperial: 1 }, { name: "DIMSE1", code: 75, defaultValue: 0 }, { name: "DIMSE2", code: 76, defaultValue: 0 }, { name: "DIMTAD", code: 77, defaultValue: sr.Above, defaultValueImperial: sr.Center }, { name: "DIMZIN", code: 78, defaultValue: Ee.Trailing, defaultValueImperial: Ee.Feet }, { name: "DIMAZIN", code: 79, defaultValue: Na.None }, { name: "DIMALT", code: 170, defaultValue: 0 }, { name: "DIMALTD", code: 171, defaultValue: 3, defaultValueImperial: 2 }, { name: "DIMTOFL", code: 172, defaultValue: 1, defaultValueImperial: 0 }, { name: "DIMSAH", code: 173, defaultValue: 0 }, { name: "DIMTIX", code: 174, defaultValue: 0 }, { name: "DIMSOXD", code: 175, defaultValue: 0 }, { name: "DIMCLRD", code: 176, defaultValue: 0 }, { name: "DIMCLRE", code: 177, defaultValue: 0 }, { name: "DIMCLRT", code: 178, defaultValue: 0 }, { name: "DIMADEC", code: 179 }, { name: "DIMUNIT", code: 270 }, { name: "DIMDEC", code: 271, defaultValue: 2, defaultValueImperial: 4 }, { name: "DIMTDEC", code: 272, defaultValue: 2, defaultValueImperial: 4 }, { name: "DIMALTU", code: 273, defaultValue: 2 }, { name: "DIMALTTD", code: 274, defaultValue: 2, defaultValueImperial: 4 }, { name: "DIMAUNIT", code: 275, defaultValue: 0 }, { name: "DIMFRAC", code: 276, defaultValue: 0 }, { name: "DIMLUNIT", code: 277, defaultValue: 2 }, { name: "DIMDSEP", code: 278, defaultValue: ",", defaultValueImperial: "." }, { name: "DIMJUST", code: 280, defaultValue: Sa.Center }, { name: "DIMSD1", code: 281, defaultValue: 0 }, { name: "DIMSD2", code: 282, defaultValue: 0 }, { name: "DIMTOLJ", code: 283, defaultValue: xa.Center }, { name: "DIMTZIN", code: 284, defaultValue: Ee.Trailing, defaultValueImperial: Ee.Feet }, { name: "DIMALTZ", code: 285, defaultValue: Ee.Trailing }, { name: "DIMALTTZ", code: 286, defaultValue: Ee.Trailing }, { name: "DIMFIT", code: 287 }, { name: "DIMUPT", code: 288, defaultValue: 0 }, { name: "DIMATFIT", code: 289, defaultValue: 3 }, { name: "DIMTXSTY", code: 340 }, { name: "DIMLDRBLK", code: 341 }, { name: "DIMBLK", code: 342 }, { name: "DIMBLK1", code: 343 }, { name: "DIMBLK2", code: 344 }, { name: "DIMLWD", code: 371, defaultValue: -2 }, { name: "DIMLWD", code: 372, defaultValue: -2 }], Zn = u([...Kn.map((e) => ({ ...e, parser: a })), { code: 70, name: "standardFlag", parser: a }, { code: 2, name: "name", parser: a }, { code: 100, name: "subclassMarker", parser: a }, { code: 105, name: "handle", parser: a }, ...be.filter((e) => e.code !== 5)]), $n = u([{ code: 347, name: "materialObjectId", parser: a }, { code: 390, name: "plotStyleNameObjectId", parser: a }, { code: 370, name: "lineweight", parser: a }, { code: 290, name: "isPlotting", parser: f }, { code: 6, name: "lineType", parser: a }, { code: 62, name: "colorIndex", parser: a }, { code: 70, name: "standardFlag", parser: a }, { code: 2, name: "name", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...be]);
(re = {})[re.NONE = 0] = "NONE", re[re.AbsoluteRotation = 1] = "AbsoluteRotation", re[re.TextEmbedded = 2] = "TextEmbedded", re[re.ShapeEmbedded = 4] = "ShapeEmbedded";
let Jn = u([{ code: 9, name: "text", parser: a }, { code: 45, name: "offsetY", parser: a }, { code: 44, name: "offsetX", parser: a }, { code: 50, name: "rotation", parser: a }, { code: 46, name: "scale", parser: a }, { code: 340, name: "styleObjectId", parser: a }, { code: 75, name: "shapeNumber", parser: a }, { code: 74, name: "elementTypeFlag", parser: a }, { code: 49, name: "elementLength", parser: a }], { elementTypeFlag: 0, elementLength: 0 }), qn = u([{ code: 49, name: "pattern", parser(e, r) {
  let n = {};
  return Jn(e, r, n), n;
}, isMultiple: !0 }, { code: 40, name: "totalPatternLength", parser: a }, { code: 73, name: "numberOfLineTypes", parser: a }, { code: 72, parser: a }, { code: 3, name: "description", parser: a }, { code: 70, name: "standardFlag", parser: a }, { code: 2, name: "name", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...be]), Qn = u([{ code: 1e3, name: "extendedFont", parser: a }, { code: 1001 }, { code: 4, name: "bigFont", parser: a }, { code: 3, name: "font", parser: a }, { code: 42, name: "lastHeight", parser: a }, { code: 71, name: "textGenerationFlag", parser: a }, { code: 50, name: "obliqueAngle", parser: a }, { code: 41, name: "widthFactor", parser: a }, { code: 40, name: "fixedTextHeight", parser: a }, { code: 70, name: "standardFlag", parser: a }, { code: 2, name: "name", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...be]), et = u([{ code: [63, 421, 431], name: "ambientColor", parser: a }, { code: 142, name: "contrast", parser: a }, { code: 141, name: "brightness", parser: a }, { code: 282, name: "defaultLightingType", parser: a }, { code: 292, name: "isDefaultLightingOn", parser: f }, { code: 348, name: "visualStyleObjectId", parser: a }, { code: 333, name: "shadePlotObjectId", parser: a }, { code: 332, name: "backgroundObjectId", parser: a }, { code: 61, name: "majorGridLines", parser: a }, { code: 170, name: "shadePlotSetting", parser: a }, { code: 146, name: "elevation", parser: a }, { code: 79, name: "orthographicType", parser: a }, { code: 112, name: "ucsYAxis", parser: c }, { code: 111, name: "ucsXAxis", parser: c }, { code: 110, name: "ucsOrigin", parser: c }, { code: 74, name: "ucsIconSetting", parser: a }, { code: 71, name: "viewMode", parser: a }, { code: 281, name: "renderMode", parser: a }, { code: 1, name: "styleSheet", parser: a }, { code: [331, 441], name: "frozenLayers", parser: a, isMultiple: !0 }, { code: 72, name: "circleSides", parser: a }, { code: 51, name: "viewTwistAngle", parser: a }, { code: 50, name: "snapRotationAngle", parser: a }, { code: 45, name: "viewHeight", parser: a }, { code: 44, name: "backClippingPlane", parser: a }, { code: 43, name: "frontClippingPlane", parser: a }, { code: 42, name: "lensLength", parser: a }, { code: 17, name: "viewTarget", parser: c }, { code: 16, name: "viewDirectionFromTarget", parser: c }, { code: 15, name: "gridSpacing", parser: c }, { code: 14, name: "snapSpacing", parser: c }, { code: 13, name: "snapBasePoint", parser: c }, { code: 12, name: "center", parser: c }, { code: 11, name: "upperRightCorner", parser: c }, { code: 10, name: "lowerLeftCorner", parser: c }, { code: 70, name: "standardFlag", parser: a }, { code: 2, name: "name", parser: a }, { code: 100, name: "subclassMarker", parser: a }, ...be]), rt = { BLOCK_RECORD: zn, DIMSTYLE: Zn, LAYER: $n, LTYPE: qn, STYLE: Qn, VPORT: et }, at = u([{ code: 70, name: "maxNumberOfEntries", parser: a }, { code: 100, name: "subclassMarker", parser: a }, { code: 330, name: "ownerObjectId", parser: a }, { code: 102 }, { code: 360, isMultiple: !0 }, { code: 102 }, { code: 5, name: "handle", parser: a }, { code: 2, name: "name", parser: a }]);
function nt(e, r) {
  var t;
  let n = {};
  for (; !p(e, 0, "EOF") && !p(e, 0, "ENDSEC"); ) {
    if (p(e, 0, "TABLE")) {
      e = r.next();
      let s = { entries: [] };
      at(e, r, s), n[s.name] = s;
    }
    if (p(e, 0) && !p(e, 0, "ENDTAB")) {
      let s = e.value;
      e = r.next();
      let o = rt[s];
      if (!o) {
        r.debug && console.warn(`parseTable: Invalid table name '${s}'`), e = r.next();
        continue;
      }
      let i = {};
      o(e, r, i), (t = n[s]) == null || t.entries.push(i);
    }
    e = r.next();
  }
  return n;
}
function Fe(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
class ir {
  next() {
    if (!this.hasNext()) return this._eof ? this.debug && console.warn("Cannot call 'next' after EOF group has been read") : this.debug && console.warn("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]), { code: 0, value: "EOF" };
    let r = parseInt(this._data[this._pointer++], 10), n = lr(r, this._data[this._pointer++], this.debug), t = { code: r, value: n };
    return p(t, 0, "EOF") && (this._eof = !0), this.lastReadGroup = t, t;
  }
  peek() {
    if (!this.hasNext())
      throw this._eof ? Error("Cannot call 'next' after EOF group has been read") : Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
    let r = { code: parseInt(this._data[this._pointer]), value: 0 };
    return r.value = lr(r.code, this._data[this._pointer + 1], this.debug), r;
  }
  rewind(r) {
    r = r || 1, this._pointer = this._pointer - 2 * r;
  }
  hasNext() {
    return !this._eof && !(this._pointer > this._data.length - 2);
  }
  isEOF() {
    return this._eof;
  }
  constructor(r, n = !1) {
    Fe(this, "_data", void 0), Fe(this, "debug", void 0), Fe(this, "_pointer", void 0), Fe(this, "_eof", void 0), Fe(this, "lastReadGroup", void 0), this._data = r, this.debug = n, this.lastReadGroup = { code: 0, value: 0 }, this._pointer = 0, this._eof = !1;
  }
}
function lr(e, r, n = !1) {
  return e <= 9 ? r : e >= 10 && e <= 59 ? parseFloat(r.trim()) : e >= 60 && e <= 99 ? parseInt(r.trim()) : e >= 100 && e <= 109 ? r : e >= 110 && e <= 149 ? parseFloat(r.trim()) : e >= 160 && e <= 179 ? parseInt(r.trim()) : e >= 210 && e <= 239 ? parseFloat(r.trim()) : e >= 270 && e <= 289 ? parseInt(r.trim()) : e >= 290 && e <= 299 ? function(t) {
    if (t === "0") return !1;
    if (t === "1") return !0;
    throw TypeError("String '" + t + "' cannot be cast to Boolean type");
  }(r.trim()) : e >= 300 && e <= 369 ? r : e >= 370 && e <= 389 ? parseInt(r.trim()) : e >= 390 && e <= 399 ? r : e >= 400 && e <= 409 ? parseInt(r.trim()) : e >= 410 && e <= 419 ? r : e >= 420 && e <= 429 ? parseInt(r.trim()) : e >= 430 && e <= 439 ? r : e >= 440 && e <= 459 ? parseInt(r.trim()) : e >= 460 && e <= 469 ? parseFloat(r.trim()) : e >= 470 && e <= 481 || e === 999 || e >= 1e3 && e <= 1009 ? r : e >= 1010 && e <= 1059 ? parseFloat(r.trim()) : e >= 1060 && e <= 1071 ? parseInt(r.trim()) : (n && console.warn("WARNING: Group code does not have a defined type: %j", { code: e, value: r }), r);
}
function er(e, r, n) {
  return r in e ? Object.defineProperty(e, r, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = n, e;
}
class tt {
  constructor() {
    er(this, "encoding", "utf-8"), er(this, "encodingFailureFatal", !1);
  }
}
class st extends EventTarget {
  parseSync(r, n = !1) {
    let t = new ir(r.split(/\r\n|\r|\n/g), n);
    if (!t.hasNext()) throw Error("Empty file");
    return this.parseAll(t);
  }
  parseStream(r) {
    let n = "", t = this;
    return new Promise((s, o) => {
      r.on("data", (i) => {
        n += i;
      }), r.on("end", () => {
        try {
          let i = n.split(/\r\n|\r|\n/g), b = new ir(i);
          if (!b.hasNext()) throw Error("Empty file");
          s(t.parseAll(b));
        } catch (i) {
          o(i);
        }
      }), r.on("error", (i) => {
        o(i);
      });
    });
  }
  async parseFromUrl(r, n) {
    let t = await fetch(r, n);
    if (!t.body) return null;
    let s = t.body.getReader(), o = "";
    for (; ; ) {
      let { done: i, value: b } = await s.read();
      if (i) {
        o += this._decoder.decode(new ArrayBuffer(0), { stream: !1 });
        break;
      }
      o += this._decoder.decode(b, { stream: !0 });
    }
    return this.parseSync(o);
  }
  parseAll(r) {
    let n = { header: {}, blocks: {}, entities: [], tables: {}, objects: { byName: {}, byTree: void 0 } }, t = r.next();
    for (; !p(t, 0, "EOF"); ) p(t, 0, "SECTION") && (p(t = r.next(), 2, "HEADER") ? (t = r.next(), n.header = Un(t, r)) : p(t, 2, "BLOCKS") ? (t = r.next(), n.blocks = Vn(t, r)) : p(t, 2, "ENTITIES") ? (t = r.next(), n.entities = ha(t, r)) : p(t, 2, "TABLES") ? (t = r.next(), n.tables = nt(t, r)) : p(t, 2, "OBJECTS") && (t = r.next(), n.objects = Xn(t, r))), t = r.next();
    return n;
  }
  constructor(r = new tt()) {
    super(), er(this, "_decoder", void 0), this._decoder = new TextDecoder(r.encoding, { fatal: r.encodingFailureFatal });
  }
}
const dr = [
  { name: "AC1.2", value: 1 },
  { name: "AC1.40", value: 2 },
  { name: "AC1.50", value: 3 },
  { name: "AC2.20", value: 4 },
  { name: "AC2.10", value: 5 },
  { name: "AC2.21", value: 6 },
  { name: "AC2.22", value: 7 },
  { name: "AC1001", value: 8 },
  /**
   * AutoCAD 2.5
   */
  { name: "AC1002", value: 9 },
  /**
   * AutoCAD 2.6
   */
  { name: "AC1003", value: 10 },
  /**
   * AutoCAD Release 9
   */
  { name: "AC1004", value: 11 },
  { name: "AC1005", value: 12 },
  /**
   * AutoCAD Release 10
   */
  { name: "AC1006", value: 13 },
  { name: "AC1007", value: 14 },
  { name: "AC1008", value: 15 },
  /**
   * AutoCAD R11 and R12
   */
  { name: "AC1009", value: 16 },
  { name: "AC1010", value: 17 },
  { name: "AC1011", value: 18 },
  /**
   * AutoCAD R13
   */
  { name: "AC1012", value: 19 },
  /**
   * AutoCAD R14 mid version.
   */
  { name: "AC1013", value: 20 },
  /**
   * AutoCAD R14 final version
   */
  { name: "AC1014", value: 21 },
  /**
   * AC1500 doesn’t actually correspond to any real DWG file version.
   * it’s just a legacy or internal placeholder in the enum sequence.
   */
  { name: "AC1500", value: 22 },
  /**
   * AutoCAD 2000 / 2000i / 2002
   */
  { name: "AC1015", value: 23 },
  { name: "AC1800a", value: 24 },
  /**
   * AutoCAD 2004 / 2005 / 2006
   */
  { name: "AC1018", value: 25 },
  { name: "AC2100a", value: 26 },
  /**
   * AutoCAD 2007 / 2008 / 2009
   */
  { name: "AC1021", value: 27 },
  { name: "AC2400a", value: 28 },
  /**
   * AutoCAD 2010 / 2011 / 2012
   */
  { name: "AC1024", value: 29 },
  /**
   * AutoCAD 2013 / 2014 / 2015 / 2016 / 2017
   */
  { name: "AC1027", value: 31 },
  { name: "AC3200a", value: 32 },
  /**
   * AutoCAD 2018 / 2019 / 2020 / 2021 / 2022 / 2023
   */
  { name: "AC1032", value: 33 }
];
class ot {
  /**
   * Create a DWG version from a version name or numeric value.
   *
   * If a string is provided, it is treated as the version name and must
   * match one of the known entries. If a number is provided, it is treated
   * as the numeric version value.
   *
   * @param nameOrValue The DWG version name (e.g. 'AC1032') or the DWG version numeric value.
   * @throws Error if the provided name or value is not recognized.
   */
  constructor(r) {
    if (typeof r == "string") {
      const n = dr.find((t) => t.name === r);
      if (!n)
        throw new Error(`Unknown DWG version name: ${r}`);
      this.name = n.name, this.value = n.value;
      return;
    }
    if (typeof r == "number") {
      const n = dr.find((t) => t.value === r);
      if (!n)
        throw new Error(`Unknown DWG version value: ${r}`);
      this.name = n.name, this.value = n.value;
      return;
    }
    throw new Error("Invalid constructor argument for AcDbDwgVersion");
  }
}
var Ta = /* @__PURE__ */ ((e) => (e[e.UTF8 = 0] = "UTF8", e[e.US_ASCII = 1] = "US_ASCII", e[e.ISO_8859_1 = 2] = "ISO_8859_1", e[e.ISO_8859_2 = 3] = "ISO_8859_2", e[e.ISO_8859_3 = 4] = "ISO_8859_3", e[e.ISO_8859_4 = 5] = "ISO_8859_4", e[e.ISO_8859_5 = 6] = "ISO_8859_5", e[e.ISO_8859_6 = 7] = "ISO_8859_6", e[e.ISO_8859_7 = 8] = "ISO_8859_7", e[e.ISO_8859_8 = 9] = "ISO_8859_8", e[e.ISO_8859_9 = 10] = "ISO_8859_9", e[e.CP437 = 11] = "CP437", e[e.CP850 = 12] = "CP850", e[e.CP852 = 13] = "CP852", e[e.CP855 = 14] = "CP855", e[e.CP857 = 15] = "CP857", e[e.CP860 = 16] = "CP860", e[e.CP861 = 17] = "CP861", e[e.CP863 = 18] = "CP863", e[e.CP864 = 19] = "CP864", e[e.CP865 = 20] = "CP865", e[e.CP869 = 21] = "CP869", e[e.CP932 = 22] = "CP932", e[e.MACINTOSH = 23] = "MACINTOSH", e[e.BIG5 = 24] = "BIG5", e[e.CP949 = 25] = "CP949", e[e.JOHAB = 26] = "JOHAB", e[e.CP866 = 27] = "CP866", e[e.ANSI_1250 = 28] = "ANSI_1250", e[e.ANSI_1251 = 29] = "ANSI_1251", e[e.ANSI_1252 = 30] = "ANSI_1252", e[e.GB2312 = 31] = "GB2312", e[e.ANSI_1253 = 32] = "ANSI_1253", e[e.ANSI_1254 = 33] = "ANSI_1254", e[e.ANSI_1255 = 34] = "ANSI_1255", e[e.ANSI_1256 = 35] = "ANSI_1256", e[e.ANSI_1257 = 36] = "ANSI_1257", e[e.ANSI_874 = 37] = "ANSI_874", e[e.ANSI_932 = 38] = "ANSI_932", e[e.ANSI_936 = 39] = "ANSI_936", e[e.ANSI_949 = 40] = "ANSI_949", e[e.ANSI_950 = 41] = "ANSI_950", e[e.ANSI_1361 = 42] = "ANSI_1361", e[e.UTF16 = 43] = "UTF16", e[e.ANSI_1258 = 44] = "ANSI_1258", e[e.UNDEFINED = 255] = "UNDEFINED", e))(Ta || {});
const ct = [
  "utf-8",
  // 0
  "utf-8",
  // US ASCII
  "iso-8859-1",
  "iso-8859-2",
  "iso-8859-3",
  "iso-8859-4",
  "iso-8859-5",
  "iso-8859-6",
  "iso-8859-7",
  "iso-8859-8",
  "iso-8859-9",
  // 10
  "utf-8",
  // DOS English
  "utf-8",
  // 12 DOS Latin-1
  "utf-8",
  // DOS Central European
  "utf-8",
  // DOS Cyrillic
  "utf-8",
  // DOS Turkish
  "utf-8",
  // DOS Portoguese
  "utf-8",
  // DOS Icelandic
  "utf-8",
  // DOS Hebrew
  "utf-8",
  // DOS Arabic (IBM)
  "utf-8",
  // DOS Nordic
  "utf-8",
  // DOS Greek
  "shift-jis",
  // DOS Japanese (shiftjis)
  "macintosh",
  // 23
  "big5",
  "utf-8",
  // Korean (Wansung + Johab)
  "utf-8",
  // Johab?
  "ibm866",
  // Russian
  "windows-1250",
  // Central + Eastern European
  "windows-1251",
  // Cyrillic
  "windows-1252",
  // Western European
  "gbk",
  // EUC-CN Chinese
  "windows-1253",
  // Greek
  "windows-1254",
  // Turkish
  "windows-1255",
  // Hebrew
  "windows-1256",
  // Arabic
  "windows-1257",
  // Baltic
  "windows-874",
  // Thai
  "shift-jis",
  // 38 Japanese (extended shiftjis, windows-31j)
  "gbk",
  // 39 Simplified Chinese
  "euc-kr",
  // 40 Korean Wansung
  "big5",
  // 41 Trad Chinese
  "utf-8",
  // 42 Korean Wansung
  "utf-16le",
  "windows-1258"
  // Vietnamese
], it = (e) => ct[e];
class lt {
  parse(r) {
    const n = new st(), t = this.getDxfInfoFromBuffer(r);
    let s = "";
    return t.version && t.version.value <= 23 && t.encoding ? s = new TextDecoder(t.encoding).decode(r) : s = new TextDecoder().decode(r), n.parseSync(s);
  }
  /**
   * Reads a DXF ArrayBuffer and returns its version and code page.
   * @param buffer The ArrayBuffer containing DXF file content.
   */
  getDxfInfoFromBuffer(r) {
    var N, v, E;
    const t = new TextDecoder("utf-8");
    let s = 0, o = "", i = null, b = null, d = !1;
    for (; s < r.byteLength; ) {
      const G = Math.min(s + 65536, r.byteLength), se = r.slice(s, G);
      s = G;
      const U = (o + t.decode(se, { stream: !0 })).split(/\r?\n/);
      o = U.pop() ?? "";
      for (let D = 0; D < U.length; D++) {
        const w = U[D].trim();
        if (w === "SECTION" && ((N = U[D + 2]) == null ? void 0 : N.trim()) === "HEADER")
          d = !0;
        else if (w === "ENDSEC" && d)
          return { version: i, encoding: b };
        if (d && w === "$ACADVER") {
          const H = (v = U[D + 2]) == null ? void 0 : v.trim();
          H && (i = new ot(H));
        } else if (d && w === "$DWGCODEPAGE") {
          const H = (E = U[D + 2]) == null ? void 0 : E.trim();
          if (H) {
            const he = Ta[H];
            b = it(he);
          }
        }
        if (i && b)
          return { version: i, encoding: b };
      }
    }
    return { version: i, encoding: b };
  }
}
class dt {
  constructor() {
    this.setupMessageHandler();
  }
  /**
   * Set up message handler - called automatically
   */
  setupMessageHandler() {
    self.onmessage = async (r) => {
      const { id: n, input: t } = r.data;
      try {
        const s = await this.executeTask(t);
        this.sendResponse(n, !0, s);
      } catch (s) {
        this.sendResponse(
          n,
          !1,
          void 0,
          s instanceof Error ? s.message : String(s)
        );
      }
    };
  }
  /**
   * Send response back to main thread
   */
  sendResponse(r, n, t, s) {
    const o = {
      id: r,
      success: n,
      data: t,
      error: s
    };
    self.postMessage(o);
  }
}
class ut extends dt {
  async executeTask(r) {
    return new lt().parse(r);
  }
}
const pt = new ut();
export {
  pt as dxfParser
};
