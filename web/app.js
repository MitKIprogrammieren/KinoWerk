/* Kinowerk – Oberfläche (übernommen aus Ernsthafte Mediathek 0.15) */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(e, i) { return _iterableToArrayLimit(e, i) || _unsupportedIterableToArray(e, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, t) { var e = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (Array.isArray(r) && (null == e || e === ("undefined" != typeof Symbol && [][Symbol.iterator]) || e === []["@@iterator"])) return r; if (null != e) { var l, n, i, a, u = [], o = !0, f = !1; try { if (i = (e = e.call(r)).next, 0 === t) { if (Object(e) !== e) return; o = !1; } else for (; !(o = (l = i.call(e)).done) && (u.push(l.value), u.length !== t); o = !0); } catch (r) { f = !0, n = r; } finally { try { if (!o && null != e.return && (a = e.return(), Object(a) !== a)) return; } finally { if (f) throw n; } } return u; } }
function _createForOfIteratorHelper(e, t) { var _n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"]; if (!_n) { if (Array.isArray(e) || (_n = _unsupportedIterableToArray(e)) || t && e && "number" == typeof e.length) { _n && (e = _n); var o = 0, F = function F() {}; return { s: F, n: function n() { return o >= e.length ? { done: !0 } : { done: !1, value: e[o++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var a, u, i = !0; return { s: function s() { _n = _n.call(e); }, n: function n() { i = !0; var r = _n.next(); return r.done ? { done: !0 } : { value: r.value, done: i = !1 }; }, e: function e(r) { a = !0, u = r; }, f: function f() { try { i || null == _n.return || _n.return(); } finally { if (a) throw u; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(r) { for (var t = 1; t < arguments.length; t++) { var o = null != arguments[t] ? arguments[t] : {}; t % 2 ? ownKeys(Object(o), !0).forEach(function (t) { _defineProperty(r, t, o[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o)) : ownKeys(Object(o)).forEach(function (e) { Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(o, e)); }); } return r; }
function _defineProperty(r, t, o) { return (t = _toPropertyKey(t)) in r ? Object.defineProperty(r, t, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : r[t] = o, r; }
function _toPropertyKey(r) { var o = _toPrimitive(r, "string"); return "symbol" == _typeof(o) ? o : o + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var r, e, o = "function" == typeof Symbol ? Symbol : {}, n = o.iterator || "@@iterator", a = o.toStringTag || "@@toStringTag"; function i(o, n, a, i) { var u = n && n.prototype instanceof Generator ? n : Generator, f = Object.create(u.prototype); return _regeneratorDefine2(f, "_invoke", function (t, o, n) { var a, i, u, f = 0, p = n || [], y = !1, G = { p: 0, n: 0, v: r, a: l, f: l.bind(r, 4), d: function d(t, e) { return a = t, i = 0, u = r, G.n = e, c; } }; function l(t, o) { for (i = t, u = o, e = 0; !y && f && !n && e < p.length; e++) { var n, a = p[e], l = G.p, F = a[2]; t > 3 ? (n = F === o) && (u = a[(i = a[4]) ? 5 : (i = 3, 3)], a[4] = a[5] = r) : a[0] <= l && ((n = t < 2 && l < a[1]) ? (i = 0, G.v = o, G.n = a[1]) : l < F && (n = t < 3 || a[0] > o || o > F) && (a[4] = t, a[5] = o, G.n = F, i = 0)); } if (n || t > 1) return c; throw y = !0, o; } return function (n, p, F) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && l(p, F), i = p, u = F; (e = i < 2 ? r : u) || !y;) { a || (i ? (i > 1 && (G.n = i < 3 ? -1 : u), l(i, u)) : G.v = u); try { if (f = 2, a) { if (i || (n = "next"), e = a[n]) { if (!(e = e.call(a, u))) throw TypeError("iterator result is not an object"); if (!e.done) return e; u = e.value, i < 2 && (i = 0); } else 1 === i && (e = a.return) && e.call(a), i < 2 && (u = TypeError("The iterator does not provide a '" + n + "' method"), i = 1); a = r; } else if ((e = (y = G.n < 0) ? u : t.call(o, G)) !== c) break; } catch (t) { a = r, i = 1, u = t; } finally { f = 1; } } return { value: e, done: y }; }; }(o, a, i), !0), f; } var c = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} e = Object.getPrototypeOf; var u = [][n] ? e(e([][n]())) : (_regeneratorDefine2(e = {}, n, function () { return this; }), e), f = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(u); function p(r) { return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(r, a, "GeneratorFunction")), r.prototype = Object.create(f), r; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(f, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, a, "GeneratorFunction"), _regeneratorDefine2(f), _regeneratorDefine2(f, a, "Generator"), _regeneratorDefine2(f, n, function () { return this; }), _regeneratorDefine2(f, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: p }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(a) { return _arrayWithoutHoles(a) || _iterableToArray(a) || _unsupportedIterableToArray(a) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(t, e) { if (t) { if ("string" == typeof t) return _arrayLikeToArray(t, e); var o = {}.toString.call(t).slice(8, -1); return "Object" === o && t.constructor && (o = t.constructor.name), "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? _arrayLikeToArray(t, e) : void 0; } }
function _iterableToArray(r) { var e = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (Array.isArray(r) && (null == e || e === ("undefined" != typeof Symbol && [][Symbol.iterator]) || e === []["@@iterator"])) return r; if (null != e) { for (var t, o = [], a = e.call(r); !(t = a.next()).done;) o.push(t.value); return o; } }
function _arrayWithoutHoles(a) { if (Array.isArray(a)) return _arrayLikeToArray(a); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var $ = function $(s) {
  var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return el.querySelector(s);
};
var $$ = function $$(s) {
  var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return _toConsumableArray(el.querySelectorAll(s));
};
var esc = function esc(s) {
  return String(s !== null && s !== void 0 ? s : "").replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c];
  });
};
var view = $("#view");
function safePlay(v) {
  try {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  } catch (_) {}
}
var IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
var IS_TV = /Web0S|webOS|SmartTV|Tizen|NetCast|AFT|BRAVIA|GoogleTV|Android TV/i.test(navigator.userAgent);
if (IS_TV) document.documentElement.classList.add("tv");
// Ältere Browser kennen "gap" bei Flexbox nicht – dann Abstände per Rand setzen
(function () {
  var d = document.createElement("div");
  d.style.cssText = "display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden";
  d.appendChild(document.createElement("div"));
  d.appendChild(document.createElement("div"));
  document.body.appendChild(d);
  var ok = d.scrollHeight === 1;
  d.parentNode.removeChild(d);
  if (!ok) document.documentElement.classList.add("nogap");
})();
var ME = null;
var REMOTE = false;
var LIBS = [];
var MLIBS = [];

/* ---------------------------------------------------------------- Hilfen */
function api(_x) {
  return _api.apply(this, arguments);
}
function _api() {
  _api = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(path) {
    var opts,
      o,
      r,
      data,
      _args17 = arguments,
      _t0;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          opts = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : {};
          o = _objectSpread({
            credentials: "same-origin",
            headers: {}
          }, opts);
          if (o.body && typeof o.body !== "string") {
            o.body = JSON.stringify(o.body);
            o.headers["Content-Type"] = "application/json";
          }
          _context17.n = 1;
          return fetch(path, o);
        case 1:
          r = _context17.v;
          if (!(r.status === 401 && !path.startsWith("/api/login"))) {
            _context17.n = 2;
            break;
          }
          showLogin();
          throw new Error("Nicht angemeldet");
        case 2:
          data = null;
          _context17.p = 3;
          _context17.n = 4;
          return r.json();
        case 4:
          data = _context17.v;
          _context17.n = 6;
          break;
        case 5:
          _context17.p = 5;
          _t0 = _context17.v;
        case 6:
          if (r.ok) {
            _context17.n = 7;
            break;
          }
          throw new Error(data && data.detail || "Fehler ".concat(r.status));
        case 7:
          return _context17.a(2, data);
      }
    }, _callee17, null, [[3, 5]]);
  }));
  return _api.apply(this, arguments);
}
function toast(msg) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
  var t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () {
    return t.hidden = true;
  }, ms);
}
function fmtTime(s) {
  s = Math.max(0, Math.floor(s || 0));
  var h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60),
    x = s % 60;
  return h ? "".concat(h, ":").concat(String(m).padStart(2, "0"), ":").concat(String(x).padStart(2, "0")) : "".concat(m, ":").concat(String(x).padStart(2, "0"));
}
function fmtDur(s) {
  if (!s) return "";
  var m = Math.round(s / 60);
  return m >= 60 ? "".concat(Math.floor(m / 60), " Std. ").concat(m % 60, " Min.") : "".concat(m, " Min.");
}
function fmtSize(b) {
  return b > 1e9 ? (b / 1e9).toFixed(1) + " GB" : Math.round(b / 1e6) + " MB";
}
var imgUrl = function imgUrl(name) {
  return "/api/image/".concat(encodeURIComponent(name));
};
var thumbUrl = function thumbUrl(id) {
  return "/api/thumb/".concat(id);
};
function modal(html, wide) {
  $("#modal-body").innerHTML = html;
  $("#modal").hidden = false;
  $("#modal .modal-box").classList.toggle("wide", !!wide);
  // zuerst ein Eingabefeld fokussieren – sonst landet z. B. die Rücktaste auf einem Knopf
  setTimeout(function () {
    var f = $("#modal input:not([type=file]):not([type=checkbox]), #modal textarea") || $("#modal .f, #modal button");
    f && f.focus();
  }, 50);
}
function closeModal() {
  $("#modal").hidden = true;
  $("#modal-body").innerHTML = "";
}
/* Nur schließen, wenn wirklich daneben geklickt wurde: Maus beim Drücken UND Loslassen auf dem dunklen Rand.
   (Text markieren und die Maus außerhalb loslassen schließt das Fenster nicht mehr.) */
var modalDownOutside = false;
$("#modal").addEventListener("mousedown", function (e) {
  modalDownOutside = e.target.id === "modal";
});
$("#modal").addEventListener("touchstart", function (e) {
  modalDownOutside = e.target.id === "modal";
}, {
  passive: true
});
$("#modal").addEventListener("click", function (e) {
  if (e.target.id === "modal" && modalDownOutside) closeModal();
  modalDownOutside = false;
});

/* ---------------------------------------------------------------- Start & Anmeldung */

var APP_NAME = "Kinowerk";

/* Jedes Gerät bekommt eine zufällige, dauerhaft gespeicherte Kennung (für die Gerätefreigabe) */
function deviceId() {
  var id = null;
  try {
    id = localStorage.getItem("mt_device");
  } catch (_) {}
  if (!id) {
    var m = document.cookie.match(/(?:^|; )mt_device=([^;]+)/);
    id = m ? m[1] : null;
  }
  if (!id) {
    id = "";
    for (var i = 0; i < 32; i++) id += Math.floor(Math.random() * 16).toString(16);
  }
  try {
    localStorage.setItem("mt_device", id);
  } catch (_) {}
  document.cookie = "mt_device=" + id + "; max-age=" + 10 * 365 * 86400 + "; path=/; samesite=lax";
  return id;
}
function boot() {
  return _boot.apply(this, arguments);
}
function _boot() {
  _boot = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
    var st;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          _context18.n = 1;
          return api("/api/status");
        case 1:
          st = _context18.v;
          if (!st.setup) {
            _context18.n = 2;
            break;
          }
          return _context18.a(2, showSetup());
        case 2:
          if (st.user) {
            _context18.n = 3;
            break;
          }
          return _context18.a(2, showLogin());
        case 3:
          ME = st.user;
          REMOTE = !!st.remote;
          if (st.version) $("#appver").textContent = "v" + st.version;
          _context18.n = 4;
          return loadNav();
        case 4:
          route();
          castResume();
        case 5:
          return _context18.a(2);
      }
    }, _callee18);
  }));
  return _boot.apply(this, arguments);
}
function showLogin() {
  $("#top").hidden = true;
  closePlayer(true);
  view.innerHTML = "<form class=\"login\" id=\"lf\">\n    <h1><span class=\"logo-mark\">\u25B6</span> ".concat(APP_NAME, "</h1>\n    <label>Name</label><input class=\"f\" name=\"name\" autocomplete=\"username\" autocapitalize=\"none\" required>\n    <label>Passwort</label><input class=\"f\" name=\"password\" type=\"password\" autocomplete=\"current-password\">\n    <button class=\"btn primary f\">Anmelden</button><div class=\"err\" id=\"lerr\"></div></form>");
  $("#lf").onsubmit = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
      var f, name, r, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            e.preventDefault();
            f = e.target;
            name = f.elements.name.value.trim();
            _context.p = 1;
            _context.n = 2;
            return api("/api/login", {
              method: "POST",
              body: {
                name: name,
                password: f.elements.password.value,
                device: deviceId()
              }
            });
          case 2:
            r = _context.v;
            if (!(r && r.need_password)) {
              _context.n = 3;
              break;
            }
            return _context.a(2, showFirstPassword(name));
          case 3:
            location.hash = "#/";
            boot();
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            $("#lerr").textContent = _t.message;
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[1, 4]]);
    }));
    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }();
  $("#lf input").focus();
}
function showFirstPassword(name) {
  view.innerHTML = "<form class=\"login\" id=\"pf\">\n    <h1>Hallo ".concat(esc(name), " \uD83D\uDC4B</h1>\n    <p class=\"muted\">Du meldest dich zum ersten Mal an. Lege jetzt dein eigenes Passwort fest \u2013 dieses Ger\xE4t wird dabei f\xFCr dich freigeschaltet.</p>\n    <label>Neues Passwort (mind. 6 Zeichen)</label><input class=\"f\" name=\"p1\" type=\"password\" autocomplete=\"new-password\" required>\n    <label>Passwort wiederholen</label><input class=\"f\" name=\"p2\" type=\"password\" autocomplete=\"new-password\" required>\n    <button class=\"btn primary f\">Passwort speichern</button><div class=\"err\" id=\"perr\"></div></form>");
  $("#pf").onsubmit = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
      var f, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            e.preventDefault();
            f = e.target;
            if (!(f.elements.p1.value !== f.elements.p2.value)) {
              _context2.n = 1;
              break;
            }
            $("#perr").textContent = "Die beiden Passwörter stimmen nicht überein.";
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return api("/api/first_password", {
              method: "POST",
              body: {
                name: name,
                password: f.elements.p1.value,
                device: deviceId()
              }
            });
          case 2:
            location.hash = "#/";
            boot();
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            $("#perr").textContent = _t2.message;
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }();
  $("#pf input").focus();
}
function showSetup() {
  $("#top").hidden = true;
  view.innerHTML = "<form class=\"login\" id=\"sf\">\n    <h1>Willkommen \uD83D\uDC4B</h1><p class=\"muted\">Lege zuerst deinen Administrator-Zugang an.</p>\n    <label>Name</label><input class=\"f\" name=\"name\" required autocapitalize=\"none\">\n    <label>Passwort (mind. 6 Zeichen)</label><input class=\"f\" name=\"password\" type=\"password\" minlength=\"6\" required>\n    <button class=\"btn primary f\">Einrichten</button><div class=\"err\" id=\"serr\"></div></form>";
  $("#sf").onsubmit = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
      var f, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            e.preventDefault();
            f = e.target;
            _context3.p = 1;
            _context3.n = 2;
            return api("/api/setup", {
              method: "POST",
              body: {
                name: f.elements.name.value,
                password: f.elements.password.value,
                device: deviceId()
              }
            });
          case 2:
            location.hash = "#/einstellungen";
            boot();
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            $("#serr").textContent = _t3.message;
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3]]);
    }));
    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }();
}
$("#logout").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
  return _regenerator().w(function (_context4) {
    while (1) switch (_context4.n) {
      case 0:
        if (!confirm("Abmelden?")) {
          _context4.n = 2;
          break;
        }
        _context4.n = 1;
        return api("/api/logout", {
          method: "POST"
        });
      case 1:
        showLogin();
      case 2:
        return _context4.a(2);
    }
  }, _callee4);
}));
function loadNav() {
  return _loadNav.apply(this, arguments);
}
function _loadNav() {
  _loadNav = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
    var navLib;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.n) {
        case 0:
          _context19.n = 1;
          return api("/api/libraries");
        case 1:
          LIBS = _context19.v;
          $("#top").hidden = false;
          $("#nav-settings").hidden = !ME.admin;
          $("#nav-settings").innerHTML = "⚙" + (ME.pending_devices ? "<span class=\"badge\">".concat(ME.pending_devices, "</span>") : "");
          if (ME.prefs) P.quality = REMOTE ? ME.prefs.quality_remote || "mittel" : ME.prefs.quality || "original";
          MLIBS = LIBS.filter(function (l) {
            return l.kind === "musik";
          });
          LIBS = LIBS.filter(function (l) {
            return l.kind !== "musik";
          });
          navLib = function navLib(l) {
            return "<a href=\"#/bib/".concat(l.id, "\" class=\"f\" tabindex=\"0\">").concat(esc(l.name), "</a>");
          };
          $("#nav").innerHTML = "<a href=\"#/\" class=\"f\" tabindex=\"0\">Start</a>" + LIBS.filter(function (l) {
            return !l.nav_end;
          }).map(navLib).join("") + "<a href=\"#/live\" class=\"f\" tabindex=\"0\">Live-TV</a>" + (MLIBS.length || ME.admin ? "<a href=\"#/musik\" class=\"f\" tabindex=\"0\">Musik</a>" : "") + "<a href=\"#/radio\" class=\"f\" tabindex=\"0\">Radio</a>" + LIBS.filter(function (l) {
            return l.nav_end;
          }).map(navLib).join("");
        case 2:
          return _context19.a(2);
      }
    }, _callee19);
  }));
  return _loadNav.apply(this, arguments);
}
/* ---------------------------------------------------------------- Router */
/* Scrollposition je Seite merken, damit "Zurück" wieder an derselben Stelle landet */
var NAV = {
  back: false,
  depth: 0
};
var hashOf = function hashOf(url) {
  var i = String(url || "").indexOf("#");
  return i >= 0 ? String(url).slice(i) : "#/";
};
function savedPos() {
  try {
    return JSON.parse(sessionStorage.getItem("scrollPos") || "{}");
  } catch (_) {
    return {};
  }
}
function savePos(hash, data) {
  var all = savedPos();
  all[hash] = Object.assign(all[hash] || {}, data);
  try {
    sessionStorage.setItem("scrollPos", JSON.stringify(all));
  } catch (_) {}
}
window.addEventListener("popstate", function () {
  if ($("#player").hidden) NAV.back = true;
});
window.addEventListener("hashchange", function (e) {
  savePos(hashOf(e.oldURL), {
    y: window.pageYOffset
  });
  if (NAV.replacing) NAV.replacing = false;else if (NAV.back) NAV.depth = Math.max(0, NAV.depth - 1);else NAV.depth++;
  route();
});
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a[href^='#/']");
  if (a && view.contains(a)) savePos(location.hash || "#/", {
    y: window.pageYOffset,
    href: a.getAttribute("href")
  });
}, true);
function goBack(fallback) {
  if (NAV.depth > 0) history.back();else location.hash = fallback || "#/";
}
function backBtn(fallback) {
  return "<button class=\"btn f backbtn\" data-fb=\"".concat(esc(fallback || "#/"), "\">\u2190 Zur\xFCck</button>");
}
function restoreScroll() {
  var pos = savedPos()[location.hash || "#/"];
  if (!NAV.back || !pos) return;
  var apply = function apply() {
    return window.scrollTo(0, pos.y || 0);
  };
  apply();
  setTimeout(apply, 80);
  setTimeout(apply, 300);
  if (pos.href) {
    var el = view.querySelector("a[href=\"".concat(pos.href, "\"]"));
    if (el && IS_TV) {
      try {
        el.focus({
          preventScroll: true
        });
      } catch (_) {
        el.focus();
      }
    }
  }
}
function route() {
  return _route.apply(this, arguments);
}
function _route() {
  _route = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
    var h, _h$split, _h$split2, page, id, goingBack, mark, _t1;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          if (ME) {
            _context20.n = 1;
            break;
          }
          return _context20.a(2);
        case 1:
          h = location.hash.replace(/^#\/?/, "");
          _h$split = h.split("/"), _h$split2 = _slicedToArray(_h$split, 2), page = _h$split2[0], id = _h$split2[1];
          $$("#nav a").forEach(function (a) {
            return a.classList.toggle("active", a.getAttribute("href") === "#/" + (page ? "".concat(page).concat(id && page === "bib" ? "/" + id : "") : ""));
          });
          goingBack = NAV.back;
          window.scrollTo(0, 0);
          view.innerHTML = '<p class="muted loading">Bitte warten, wird geladen …</p>';
          _context20.p = 2;
          if (page) {
            _context20.n = 4;
            break;
          }
          _context20.n = 3;
          return viewHome();
        case 3:
          _context20.n = 31;
          break;
        case 4:
          if (!(page === "bib")) {
            _context20.n = 6;
            break;
          }
          _context20.n = 5;
          return viewLibrary(+id);
        case 5:
          _context20.n = 31;
          break;
        case 6:
          if (!(page === "serie")) {
            _context20.n = 8;
            break;
          }
          _context20.n = 7;
          return viewSeries(+id);
        case 7:
          _context20.n = 31;
          break;
        case 8:
          if (!(page === "titel")) {
            _context20.n = 10;
            break;
          }
          _context20.n = 9;
          return viewItem(+id);
        case 9:
          _context20.n = 31;
          break;
        case 10:
          if (!(page === "live")) {
            _context20.n = 12;
            break;
          }
          _context20.n = 11;
          return viewLive();
        case 11:
          _context20.n = 31;
          break;
        case 12:
          if (!(page === "musik")) {
            _context20.n = 14;
            break;
          }
          _context20.n = 13;
          return viewMusic();
        case 13:
          _context20.n = 31;
          break;
        case 14:
          if (!(page === "album")) {
            _context20.n = 16;
            break;
          }
          _context20.n = 15;
          return viewAlbum(+id);
        case 15:
          _context20.n = 31;
          break;
        case 16:
          if (!(page === "playlist")) {
            _context20.n = 18;
            break;
          }
          _context20.n = 17;
          return viewPlaylist(+id);
        case 17:
          _context20.n = 31;
          break;
        case 18:
          if (!(page === "radio")) {
            _context20.n = 20;
            break;
          }
          _context20.n = 19;
          return viewRadio();
        case 19:
          _context20.n = 31;
          break;
        case 20:
          if (!(page === "suche")) {
            _context20.n = 22;
            break;
          }
          _context20.n = 21;
          return viewSearch();
        case 21:
          _context20.n = 31;
          break;
        case 22:
          if (!(page === "einstellungen")) {
            _context20.n = 24;
            break;
          }
          _context20.n = 23;
          return viewSettings();
        case 23:
          _context20.n = 31;
          break;
        case 24:
          if (!(page === "konto")) {
            _context20.n = 26;
            break;
          }
          _context20.n = 25;
          return viewAccount();
        case 25:
          _context20.n = 31;
          break;
        case 26:
          if (!(page === "person")) {
            _context20.n = 28;
            break;
          }
          _context20.n = 27;
          return viewPerson(+id);
        case 27:
          _context20.n = 31;
          break;
        case 28:
          if (!(page === "genre")) {
            _context20.n = 30;
            break;
          }
          _context20.n = 29;
          return viewGenre(decodeURIComponent(id || ""));
        case 29:
          _context20.n = 31;
          break;
        case 30:
          view.innerHTML = "<p>Seite nicht gefunden.</p>";
        case 31:
          mark = document.createElement("span");
          mark.setAttribute("data-loaded", "1");
          view.appendChild(mark);
          window.__errs = [];
          $$(".backbtn", view).forEach(function (b) {
            return b.onclick = function () {
              return goBack(b.dataset.fb);
            };
          });
          NAV.back = goingBack;
          restoreScroll();
          NAV.back = false;
          _context20.n = 33;
          break;
        case 32:
          _context20.p = 32;
          _t1 = _context20.v;
          NAV.back = false;
          if (_t1.message !== "Nicht angemeldet") view.innerHTML = "<p class=\"err\">".concat(esc(_t1.message), "</p>");
        case 33:
          if (!goingBack) focusFirst();
        case 34:
          return _context20.a(2);
      }
    }, _callee20, null, [[2, 32]]);
  }));
  return _route.apply(this, arguments);
}
function focusFirst() {
  if (!IS_TV) return;
  var el = $("main .f") || $("header .f");
  el && el.focus({
    preventScroll: true
  });
}

/* ---------------------------------------------------------------- Kacheln */

function card(it) {
  var _opts$sub, _it$season, _it$episode;
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var wide = opts.wide;
  var img = "";
  if (!wide && it.poster) img = imgUrl(it.poster);else if (wide && it.backdrop && it.type === "movie") img = imgUrl(it.backdrop);else if (it.type === "series") img = it.poster ? imgUrl(it.poster) : "";else img = thumbUrl(it.id);
  var href = opts.href || (it.type === "series" ? "#/serie/".concat(it.id) : "#/titel/".concat(it.id));
  var pct = it.position && it.duration ? Math.min(100, it.position / it.duration * 100) : 0;
  var sub = (_opts$sub = opts.sub) !== null && _opts$sub !== void 0 ? _opts$sub : it.type === "episode" && it.series_name ? "".concat(esc(it.series_name), " \xB7 S").concat((_it$season = it.season) !== null && _it$season !== void 0 ? _it$season : "?", "E").concat((_it$episode = it.episode) !== null && _it$episode !== void 0 ? _it$episode : "?") : it.year || (it.count ? "".concat(it.count, " Folgen") : "");
  var isThumb = img.startsWith("/api/thumb");
  var chkTip = it.chk === 1 ? " title=\"Passt evtl. nicht zur Datei: ".concat(esc(it.ftitle || it.tmdb_name || ""), "\"") : it.chk === 2 ? ' title="Keine Filminfos gefunden"' : "";
  return "<a class=\"card f ".concat(wide || isThumb && !opts.poster ? "wide" : "").concat(it.chk ? " chk" + it.chk : "", "\" href=\"").concat(href, "\" tabindex=\"0\" data-l=\"").concat(letterOf(it.sort || it.title), "\"").concat(chkTip, ">\n    <div class=\"img\">").concat(img ? "<img loading=\"lazy\" src=\"".concat(img, "\" alt=\"\" onerror=\"this.remove()\">") : "", "\n      ").concat(!img ? "<div class=\"ph\">".concat(esc(it.title), "</div>") : "", "\n      ").concat(pct > 1 && !it.watched ? "<div class=\"prog\"><i style=\"width:".concat(pct, "%\"></i></div>") : "", "\n      ").concat(it.watched ? "<div class=\"seen\">\u2713</div>" : "", "\n      ").concat(it.parts > 1 ? "<div class=\"vbadge parts\">".concat(it.parts, " Teile</div>") : "").concat(it.versions > 1 ? "<div class=\"vbadge\">".concat(it.versions, " Fassungen</div>") : it.src && opts.src !== false ? "<div class=\"vbadge src\">".concat(esc(it.src), "</div>") : "", "</div>\n    <div class=\"t\">").concat(it.chk === 1 ? "⚠ " : it.chk === 2 ? "? " : "").concat(esc(opts.title || it.title), "</div><div class=\"s\">").concat(it.chk === 1 && it.ftitle ? "Datei: " + esc(it.ftitle) : it.chk === 1 && it.tmdb_name ? "TMDB: " + esc(it.tmdb_name) : sub || "&nbsp;", "</div>").concat(opts.file ? "<div class=\"s file\">".concat(esc(opts.file), "</div>") : "", "</a>");
}
function letterOf(t) {
  var c = String(t || "").trim().charAt(0).toUpperCase();
  var map = {
    "Ä": "A",
    "Ö": "O",
    "Ü": "U",
    "É": "E",
    "È": "E"
  };
  var x = map[c] || c;
  if (x >= "A" && x <= "Z") return x;
  return "#";
}
var FSK_COLORS = {
  0: "#ffffff",
  6: "#f7d417",
  12: "#2fa84f",
  16: "#2a7fd4",
  18: "#e5302a"
};
function fskBadge(f) {
  if (f === null || f === undefined) return "";
  var fg = f === 0 || f === 6 ? "#111" : "#fff";
  return "<span class=\"fsk\" style=\"background:".concat(FSK_COLORS[f], ";color:").concat(fg, "\" title=\"FSK ").concat(f, "\">").concat(f, "</span>");
}

/* ---------------------------------------------------------------- Startseite */
function viewHome() {
  return _viewHome.apply(this, arguments);
}
function _viewHome() {
  _viewHome = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
    var d, html, _iterator2, _step2, r, _t10;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.p = _context21.n) {
        case 0:
          _context21.n = 1;
          return api("/api/home");
        case 1:
          d = _context21.v;
          html = "";
          if (!LIBS.length) {
            html = ME.admin ? "<div class=\"panel\"><h2>Noch keine Bibliothek</h2><p>Lege in den <a href=\"#/einstellungen\" class=\"f\" style=\"color:var(--acc)\">Einstellungen</a> deine Video-Ordner an.</p></div>" : "<p class=\"muted\">Dir ist noch keine Bibliothek freigegeben.</p>";
          }
          if (d.continue.length) html += "<h2>Weiterschauen</h2><div class=\"strip\">".concat(d.continue.map(function (i) {
            return card(i, {
              wide: true
            });
          }).join(""), "</div>");
          _iterator2 = _createForOfIteratorHelper(d.rows);
          _context21.p = 2;
          _iterator2.s();
        case 3:
          if ((_step2 = _iterator2.n()).done) {
            _context21.n = 6;
            break;
          }
          r = _step2.value;
          if (r.items.length) {
            _context21.n = 4;
            break;
          }
          return _context21.a(3, 5);
        case 4:
          html += "<h2>Neu in ".concat(esc(r.library.name), " <a href=\"#/bib/").concat(r.library.id, "\" class=\"f\" tabindex=\"0\">Alle anzeigen \u203A</a></h2>\n      <div class=\"strip\">").concat(r.items.map(function (i) {
            return card(i);
          }).join(""), "</div>");
        case 5:
          _context21.n = 3;
          break;
        case 6:
          _context21.n = 8;
          break;
        case 7:
          _context21.p = 7;
          _t10 = _context21.v;
          _iterator2.e(_t10);
        case 8:
          _context21.p = 8;
          _iterator2.f();
          return _context21.f(8);
        case 9:
          view.innerHTML = html || "<p class=\"muted\">Noch nichts da \u2013 der erste Suchlauf l\xE4uft vielleicht noch.</p>";
        case 10:
          return _context21.a(2);
      }
    }, _callee21, null, [[2, 7, 8, 9]]);
  }));
  return _viewHome.apply(this, arguments);
}
/* ---------------------------------------------------------------- Bibliothek */
function viewLibrary(_x5) {
  return _viewLibrary.apply(this, arguments);
}
function _viewLibrary() {
  _viewLibrary = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(id) {
    var _st$folder, _st$fsk;
    var key, st, sort, q, folder, fsk, params, d, list, folders, save, t, i;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.n) {
        case 0:
          key = "lib".concat(id);
          st = JSON.parse(sessionStorage.getItem(key) || "{}");
          sort = st.sort || "title", q = st.q || "", folder = (_st$folder = st.folder) !== null && _st$folder !== void 0 ? _st$folder : "";
          fsk = (_st$fsk = st.fsk) !== null && _st$fsk !== void 0 ? _st$fsk : sessionStorage.getItem("fsk") || "";
          params = new URLSearchParams({
            sort: sort,
            q: q
          });
          if (folder !== "") params.set("folder", folder === "__root" ? "" : folder);
          if (fsk !== "") params.set("fsk", fsk);
          _context22.n = 1;
          return api("/api/library/".concat(id, "?").concat(params));
        case 1:
          d = _context22.v;
          list = d.series || d.items;
          folders = d.folders || [];
          view.innerHTML = "<h1>".concat(esc(d.library.name), " <span class=\"muted small\">").concat(list.length, "</span></h1>\n    <div class=\"toolbar\">\n      <input type=\"search\" id=\"lq\" class=\"f\" placeholder=\"Titel suchen\u2026\" value=\"").concat(esc(q), "\">\n      <select id=\"ls\" class=\"f\">\n        <option value=\"title\">A\u2013Z</option><option value=\"added\">Zuletzt hinzugef\xFCgt</option><option value=\"seen\">Zuletzt gesehen</option><option value=\"year\">Jahr</option>").concat(ME.admin && d.library.kind !== "sonstiges" ? '<option value="check">⚠ Zu prüfen</option>' : "", "</select>\n      ").concat(folders.length ? "<select id=\"lf\" class=\"f\"><option value=\"\">Alle Ordner</option>".concat(d.series ? "" : '<option value="__root">(Hauptordner)</option>', "\n        ").concat(folders.map(function (f) {
            return "<option value=\"".concat(esc(f), "\">").concat(esc(f), "</option>");
          }).join(""), "</select>") : "", "\n      ").concat(d.library.kind !== "sonstiges" ? "<select id=\"lfsk\" class=\"f\" title=\"Altersfreigabe\">\n        <option value=\"\">FSK: alle</option><option value=\"0\">bis FSK 0</option><option value=\"6\">bis FSK 6</option>\n        <option value=\"12\">bis FSK 12</option><option value=\"16\">bis FSK 16</option><option value=\"18\">bis FSK 18</option></select>" : "", "\n      ").concat(ME.max_fsk !== null && ME.max_fsk !== undefined ? "<span class=\"muted small\">Freigegeben bis FSK ".concat(ME.max_fsk, "</span>") : "", "\n    </div>\n    ").concat(sort === "seen" ? "<p class=\"muted small\">Nur bereits angesehene Titel \u2013 zuletzt gesehen oben.</p>" : "", "\n    ").concat(sort === "check" ? "<p class=\"muted small\"><b style=\"color:#f05a5a\">\u26A0 rot</b> = gefundene Filminfos passen wahrscheinlich nicht zum Datei-/Ordnernamen \xB7 <b style=\"color:#f0a030\">? orange</b> = nichts gefunden. \xD6ffnen und mit \u201EFilminfo \xE4ndern\u201C korrigieren oder mit \u201EPasst so\u201C best\xE4tigen.</p>" : "", "\n    ").concat(fsk !== "" ? "<p class=\"muted small\">Gefiltert: nur Titel bis FSK ".concat(esc(fsk), " \u2013 Titel ohne Altersangabe werden dabei ausgeblendet.</p>") : "", "\n    <div class=\"libwrap\"><div class=\"grid ").concat(d.library.kind === "sonstiges" ? "wide" : "", "\" id=\"lgrid\">").concat(list.map(function (i) {
            return card(d.series ? _objectSpread(_objectSpread({}, i), {}, {
              type: "series"
            }) : i, {
              poster: d.library.kind !== "sonstiges"
            });
          }).join("") || "<p class=\"muted\">".concat(sort === "seen" ? "Hier noch nichts angesehen." : sort === "check" ? "Alles in Ordnung – nichts zu prüfen. 👍" : "Keine Einträge.", "</p>"), "</div>\n    ").concat(sort === "title" && list.length > 30 ? azBar(list) : "", "</div>");
          $("#ls").value = sort;
          if ($("#lf")) $("#lf").value = folder;
          if ($("#lfsk")) $("#lfsk").value = fsk;
          save = function save(patch) {
            sessionStorage.setItem(key, JSON.stringify(_objectSpread({
              sort: sort,
              q: q,
              folder: folder,
              fsk: fsk
            }, patch)));
            viewLibrary(id);
          };
          $("#ls").onchange = function (e) {
            return save({
              sort: e.target.value
            });
          };
          if ($("#lf")) $("#lf").onchange = function (e) {
            return save({
              folder: e.target.value
            });
          };
          if ($("#lfsk")) $("#lfsk").onchange = function (e) {
            sessionStorage.setItem("fsk", e.target.value);
            save({
              fsk: e.target.value
            });
          };
          $$(".az .f").forEach(function (b) {
            return b.onclick = function () {
              return jumpTo(b.dataset.l);
            };
          });
          $("#lq").oninput = function (e) {
            clearTimeout(t);
            t = setTimeout(function () {
              return save({
                q: e.target.value
              });
            }, 400);
          };
          if (q) {
            i = $("#lq");
            i.focus();
            i.setSelectionRange(q.length, q.length);
          }
        case 2:
          return _context22.a(2);
      }
    }, _callee22);
  }));
  return _viewLibrary.apply(this, arguments);
}
function azBar(list) {
  var have = {};
  list.forEach(function (i) {
    return have[letterOf(i.sort || i.title)] = true;
  });
  var letters = ["#"].concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
  return "<div class=\"az\">".concat(letters.map(function (l) {
    return have[l] ? "<button class=\"f\" data-l=\"".concat(l, "\" title=\"").concat(l === "#" ? "0–9" : l, "\">").concat(l === "#" ? "0–9" : l, "</button>") : "<span>".concat(l === "#" ? "0–9" : l, "</span>");
  }).join(""), "</div>");
}
function jumpTo(l) {
  var el = $("#lgrid .card[data-l=\"".concat(l, "\"]"));
  if (!el) return;
  var top = el.getBoundingClientRect().top + window.pageYOffset - 90;
  window.scrollTo(0, top);
  if (IS_TV || document.activeElement && document.activeElement.closest(".az")) {
    try {
      el.focus({
        preventScroll: true
      });
    } catch (_) {
      el.focus();
    }
  }
}

/* ---------------------------------------------------------------- Serie */
function viewSeries(_x6) {
  return _viewSeries.apply(this, arguments);
}
function _viewSeries() {
  _viewSeries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(id) {
    var _ref12, _sessionStorage$getIt, _d$seasons$, _d$seasons$2;
    var d, s, lastSeason, showSeason, all, next, _next$episode;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.n) {
        case 0:
          _context24.n = 1;
          return api("/api/series/".concat(id));
        case 1:
          d = _context24.v;
          s = d.series;
          lastSeason = +((_ref12 = (_sessionStorage$getIt = sessionStorage.getItem("season".concat(id))) !== null && _sessionStorage$getIt !== void 0 ? _sessionStorage$getIt : (_d$seasons$ = d.seasons[0]) === null || _d$seasons$ === void 0 ? void 0 : _d$seasons$.season) !== null && _ref12 !== void 0 ? _ref12 : 1);
          view.innerHTML = "".concat(backBtn("#/bib/" + s.library_id), "<div class=\"hero\" style=\"").concat(s.backdrop ? "background-image:url('".concat(imgUrl(s.backdrop), "')") : "", "\">\n    <div class=\"detail\"><div class=\"poster\" style=\"").concat(s.poster ? "background-image:url('".concat(imgUrl(s.poster), "')") : "", "\"></div>\n    <div><h1>").concat(esc(s.name), "</h1><div class=\"meta\">").concat(fskBadge(s.fsk)).concat(s.year ? "<span>".concat(s.year, "</span>") : "", "<span>").concat(d.seasons.length, " Staffel(n)</span></div>\n    ").concat(genreChips(s.genres), "\n    <div class=\"overview\">").concat(esc(s.overview || ""), "</div>\n    ").concat(castHtml(s.cast), "\n    ").concat(s.chk ? "<div class=\"chkbox ".concat(s.chk === 2 ? "c2" : "", "\">").concat(s.chk === 1 ? "\u26A0 <b>Passt das?</b> Der Ordner hei\xDFt \u201E".concat(esc(s.name), "\u201C, gefunden wurde aber \u201E").concat(esc(s.tmdb_name || ""), "\u201C").concat(s.orig_name && s.orig_name !== s.tmdb_name ? " (".concat(esc(s.orig_name), ")") : "", ".") : "? <b>Keine Serieninfos gefunden</b> f\xFCr \u201E".concat(esc(s.name), "\u201C."), "\n      <div class=\"row\" style=\"margin-top:8px\"><button class=\"btn sm primary f\" id=\"schkfix\">Serieninfo \xE4ndern</button>").concat(s.chk === 1 ? "<button class=\"btn sm f\" id=\"schkok\">\u2713 Passt so</button>" : "", "</div></div>") : "", "\n    <div class=\"actions\" id=\"sact\"></div></div></div></div>\n    <div class=\"tabs\" id=\"stabs\">").concat(d.seasons.map(function (x) {
            return "<button class=\"f\" data-s=\"".concat(x.season, "\">").concat(x.season ? "Staffel " + x.season : "Sonstige", "</button>");
          }).join(""), "</div>\n    <div class=\"grid wide eps\" id=\"eps\"></div>\n    ").concat(castStrip(s.cast), "\n    <div id=\"similar\"></div>");
          loadSimilar("series", id);
          showSeason = function showSeason(n) {
            sessionStorage.setItem("season".concat(id), n);
            $$("#stabs button").forEach(function (b) {
              return b.classList.toggle("active", +b.dataset.s === n);
            });
            var se = d.seasons.find(function (x) {
              return x.season === n;
            }) || d.seasons[0];
            $("#eps").innerHTML = ((se === null || se === void 0 ? void 0 : se.episodes) || []).map(function (e) {
              return card(Object.assign({}, e, {
                poster: null,
                backdrop: null,
                type: "episode_tile"
              }), {
                wide: true,
                href: "#/titel/".concat(e.id),
                title: (e.episode && !/^Folge\s*\d+$/i.test(e.title) ? e.episode + ". " : "") + e.title,
                sub: [fmtDur(e.duration), e.versions > 1 ? null : e.src].filter(Boolean).join(" · ") || "&nbsp;",
                file: (e.folder ? e.folder + "/" : "") + e.file
              });
            }).join("");
          };
          $$("#stabs button").forEach(function (b) {
            return b.onclick = function () {
              return showSeason(+b.dataset.s);
            };
          });
          showSeason(d.seasons.some(function (x) {
            return x.season === lastSeason;
          }) ? lastSeason : (_d$seasons$2 = d.seasons[0]) === null || _d$seasons$2 === void 0 ? void 0 : _d$seasons$2.season);
          // "Weiter mit"-Knopf: erste nicht gesehene Folge
          all = d.seasons.flatMap(function (x) {
            return x.episodes;
          });
          next = all.find(function (e) {
            return e.position > 30 && !e.watched;
          }) || all.find(function (e) {
            return !e.watched;
          }) || all[0];
          if (next) {
            $("#sact").innerHTML = "<button class=\"btn primary f\" id=\"splay\">\u25B6 ".concat(next.position > 30 ? "Fortsetzen" : "Abspielen", ": S").concat(next.season, "E").concat((_next$episode = next.episode) !== null && _next$episode !== void 0 ? _next$episode : "?", "</button>");
            $("#splay").onclick = function () {
              return openPlayer(next.id, next.position > 30 && !next.watched ? next.position : 0);
            };
          }
          if (ME.admin) {
            $("#sact").insertAdjacentHTML("beforeend", "<button class=\"btn f\" id=\"smatch\">Bearbeiten / Zuordnen</button><button class=\"btn f\" id=\"srescan\">Serie neu einlesen</button>");
            $("#smatch").onclick = function () {
              return editDialog("series", s.id, "serie", s.name);
            };
            $("#srescan").onclick = function () {
              return rescanSeries(s.id);
            };
            if ($("#schkfix")) $("#schkfix").onclick = function () {
              return editDialog("series", s.id, "serie", s.name);
            };
            if ($("#schkok")) $("#schkok").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
              return _regenerator().w(function (_context23) {
                while (1) switch (_context23.n) {
                  case 0:
                    _context23.n = 1;
                    return api("/api/admin/check_ok/series/".concat(s.id), {
                      method: "POST"
                    });
                  case 1:
                    toast("Gemerkt");
                    viewSeries(s.id);
                  case 2:
                    return _context23.a(2);
                }
              }, _callee23);
            }));
          }
        case 2:
          return _context24.a(2);
      }
    }, _callee24);
  }));
  return _viewSeries.apply(this, arguments);
}
/* ---------------------------------------------------------------- Titel */
function viewItem(_x7) {
  return _viewItem.apply(this, arguments);
}
function _viewItem() {
  _viewItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(id) {
    var _it$season2, _it$episode2;
    var it, isVid, pos, bg, poster, wide, res, pref, want, langs, di, sel, pi, aud;
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.n) {
        case 0:
          _context28.n = 1;
          return api("/api/item/".concat(id));
        case 1:
          it = _context28.v;
          isVid = it.type === "video";
          pos = it.position && !it.watched && it.position > 30 ? it.position : 0;
          bg = it.backdrop ? imgUrl(it.backdrop) : "";
          poster = it.poster && it.type !== "episode" ? imgUrl(it.poster) : thumbUrl(it.id);
          wide = !(it.poster && it.type !== "episode");
          res = it.height ? it.height >= 2000 ? "4K" : it.height >= 1000 ? "1080p" : it.height >= 700 ? "720p" : it.height + "p" : "";
          view.innerHTML = "".concat(backBtn(it.series ? "#/serie/" + it.series.id : "#/bib/" + it.library_id), "<div class=\"hero\" style=\"").concat(bg ? "background-image:url('".concat(bg, "')") : "", "\">\n    <div class=\"detail\"><div class=\"poster ").concat(wide ? "wide" : "", "\" style=\"background-image:url('").concat(poster, "')\"></div>\n    <div style=\"flex:1\">\n      ").concat(it.series ? "<a href=\"#/serie/".concat(it.series.id, "\" class=\"f muted\" tabindex=\"0\">").concat(esc(it.series.name), " \xB7 Staffel ").concat((_it$season2 = it.season) !== null && _it$season2 !== void 0 ? _it$season2 : "?", ", Folge ").concat((_it$episode2 = it.episode) !== null && _it$episode2 !== void 0 ? _it$episode2 : "?", "</a>") : "", "\n      <h1>").concat(esc(it.title), "</h1>\n      <div class=\"meta\">").concat(fskBadge(it.fsk)).concat(it.src ? "<span class=\"srcbadge\">".concat(esc(it.src), "</span>") : "").concat(it.year ? "<span>".concat(it.year, "</span>") : "").concat(it.duration ? "<span>".concat(fmtDur(it.duration), "</span>") : "").concat(res ? "<span>".concat(res, "</span>") : "").concat(it.chapters && it.chapters.length ? "<span>".concat(it.chapters.length, " Kapitel</span>") : "").concat(it.watched ? "<span style=\"color:var(--ok)\">\u2713 gesehen</span>" : "", "</div>\n      ").concat(it.parts && it.parts.length > 1 ? "<div class=\"partsel\"><span class=\"muted small\">Film in ".concat(it.parts.length, " Teilen").concat(it.parts.every(function (x) {
            return x.duration;
          }) ? " (zusammen ".concat(fmtDur(it.parts.reduce(function (a, x) {
            return a + x.duration;
          }, 0)), ")") : "", ":</span>\n        ").concat(it.parts.map(function (x) {
            return "<a class=\"chip f".concat(x.id === it.id ? " on" : "", "\" href=\"#/titel/").concat(x.id, "\" tabindex=\"0\">Teil ").concat(x.part).concat(x.duration ? " · " + fmtDur(x.duration) : "", "</a>");
          }).join(""), "\n        <span class=\"muted small\">\u2013 nach dem Ende geht es automatisch mit dem n\xE4chsten Teil weiter.</span></div>") : "", "\n      ").concat(it.versions && it.versions.length > 1 ? "<div class=\"versel\"><label>Fassung</label><select id=\"iver\" class=\"f\">".concat(it.versions.map(function (v) {
            return "<option value=\"".concat(v.id, "\">").concat(esc(versionLabel(v)), "</option>");
          }).join(""), "</select></div>") : "", "\n      <div class=\"actions\">\n        <button class=\"btn primary f\" id=\"iplay\">\u25B6 ").concat(pos ? "Fortsetzen ab " + fmtTime(pos) : "Abspielen", "</button>\n        ").concat(pos ? "<button class=\"btn f\" id=\"istart\">Von vorn</button>" : "", "\n        ").concat(!REMOTE ? "<button class=\"btn f\" id=\"icast\">\uD83D\uDCFA Auf Fernseher</button>" : "", "\n        <button class=\"btn f\" id=\"iwatch\">").concat(it.watched ? "Als ungesehen markieren" : "Als gesehen markieren", "</button>\n        ").concat(ME.admin ? "<button class=\"btn f\" id=\"imatch\">".concat(it.type === "episode" ? "Folge bearbeiten" : "Bearbeiten / Zuordnen", "</button>") : "", "\n        ").concat(ME.admin ? "<button class=\"btn danger f\" id=\"itrash\" title=\"Datei in den Ordner _Papierkorb auf der NAS verschieben\">\uD83D\uDDD1 In den Papierkorb</button>" : "", "\n      </div>\n      ").concat(it.chk ? "<div class=\"chkbox ".concat(it.chk === 2 ? "c2" : "", "\">").concat(it.chk === 1 ? "\u26A0 <b>Passt das?</b> Gefunden wurde \u201E".concat(esc(it.title), "\u201C").concat(it.orig_title && it.orig_title !== it.title ? " (".concat(esc(it.orig_title), ")") : "", ", die Datei hei\xDFt aber \u201E").concat(esc(it.file), "\u201C.") : "? <b>Keine Filminfos gefunden</b> f\xFCr \u201E".concat(esc(it.file), "\u201C."), "\n        <div class=\"row\" style=\"margin-top:8px\"><button class=\"btn sm primary f\" id=\"ichkfix\">Filminfo \xE4ndern</button>").concat(it.chk === 1 ? "<button class=\"btn sm f\" id=\"ichkok\">\u2713 Passt so</button>" : "", "</div></div>") : "", "\n      ").concat(it.audio.length > 1 ? "<label>Tonspur</label><select id=\"iaudio\" class=\"f\">".concat(it.audio.map(function (a, i) {
            return "<option value=\"".concat(i, "\">").concat(esc(audioLabel(a, i)), "</option>");
          }).join(""), "</select>") : "", "\n      ").concat(genreChips(it.genres), "\n      <div class=\"overview\">").concat(esc(it.overview || ""), "</div>\n      ").concat(castHtml(it.cast), "\n      <div class=\"tech\">").concat(esc(it.file)).concat(it.folder ? " · " + esc(it.folder) : "", " \xB7 ").concat(fmtSize(it.size), " \xB7 ").concat(esc(it.vcodec || "?")).concat(it.audio[0] ? " / " + esc(it.audio.map(function (a) {
            return a.codec;
          }).join(", ")) : "", "</div>\n    </div></div></div>\n    ").concat(castStrip(it.cast), "\n    <div id=\"similar\"></div>\n    ").concat(mediaHtml(it), "\n    ").concat(it.next && !it.next.auto ? "<h2>N\xE4chste Folge</h2><div class=\"eplist\"><a class=\"ep f\" href=\"#/titel/".concat(it.next.id, "\" tabindex=\"0\"><div class=\"img\" style=\"background-image:url('").concat(thumbUrl(it.next.id), "')\"></div><div><div class=\"num\">S").concat(it.next.season, "E").concat(it.next.episode, "</div>").concat(esc(it.next.title), "</div></a></div>") : "");
          pref = localStorage.getItem("audioLang");
          if ($("#iaudio")) {
            want = ME.prefs && ME.prefs.audio_lang || "de";
            langs = want === "en" ? ["eng", "en"] : ["ger", "deu", "de"];
            di = want === "original" ? 0 : it.audio.findIndex(function (a) {
              return langs.includes(a.lang);
            });
            sel = di >= 0 ? di : 0;
            if (pref) {
              pi = it.audio.findIndex(function (a) {
                return a.lang === pref;
              });
              if (pi >= 0) sel = pi;
            }
            $("#iaudio").value = sel;
            $("#iaudio").onchange = function (e) {
              return localStorage.setItem("audioLang", it.audio[+e.target.value].lang || "");
            };
          }
          aud = function aud() {
            return $("#iaudio") ? +$("#iaudio").value : null;
          };
          $("#iplay").onclick = function () {
            return openPlayer(id, pos, aud());
          };
          if ($("#istart")) $("#istart").onclick = function () {
            return openPlayer(id, 0, aud());
          };
          if ($("#icast")) $("#icast").onclick = function () {
            return castPicker(id, pos, aud());
          };
          $("#iwatch").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
            return _regenerator().w(function (_context25) {
              while (1) switch (_context25.n) {
                case 0:
                  _context25.n = 1;
                  return api("/api/watched/".concat(id), {
                    method: "POST",
                    body: {
                      watched: !it.watched
                    }
                  });
                case 1:
                  viewItem(id);
                case 2:
                  return _context25.a(2);
              }
            }, _callee25);
          }));
          if ($("#imatch")) $("#imatch").onclick = function () {
            return editDialog("item", id, "film", it.title);
          };
          if ($("#ichkfix")) $("#ichkfix").onclick = function () {
            return editDialog("item", id, "film", (it.file || it.title).replace(/\.[^.]+$/, ""));
          };
          if ($("#ichkok")) $("#ichkok").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
            return _regenerator().w(function (_context26) {
              while (1) switch (_context26.n) {
                case 0:
                  _context26.n = 1;
                  return api("/api/admin/check_ok/item/".concat(id), {
                    method: "POST"
                  });
                case 1:
                  toast("Gemerkt – wird nicht mehr als fraglich angezeigt");
                  viewItem(id);
                case 2:
                  return _context26.a(2);
              }
            }, _callee26);
          }));
          if ($("#itrash")) $("#itrash").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
            var what, ver, r, back, _t11;
            return _regenerator().w(function (_context27) {
              while (1) switch (_context27.p = _context27.n) {
                case 0:
                  what = it.type === "episode" ? "die Folge" : "den Film";
                  ver = it.versions && it.versions.length > 1 ? "\n\nNur diese Fassung – die anderen Fassungen bleiben." : "";
                  if (confirm("M\xF6chtest du ".concat(what, " \u201E").concat(it.title, "\u201C wirklich in den Papierkorb verschieben?\n\nDatei: ").concat(it.file).concat(ver, "\n\nDie Datei landet im Ordner \u201E_Papierkorb\u201C auf der NAS. Endg\xFCltig l\xF6schen musst du sie dort selbst."))) {
                    _context27.n = 1;
                    break;
                  }
                  return _context27.a(2);
                case 1:
                  $("#itrash").disabled = true;
                  _context27.p = 2;
                  _context27.n = 3;
                  return api("/api/admin/trash/".concat(id), {
                    method: "POST"
                  });
                case 3:
                  r = _context27.v;
                  toast("In den Papierkorb verschoben", 3000);
                  back = it.series && r.series_left ? "#/serie/" + it.series.id : "#/bib/" + it.library_id;
                  NAV.back = false;
                  NAV.replacing = true;
                  location.replace(back);
                  _context27.n = 5;
                  break;
                case 4:
                  _context27.p = 4;
                  _t11 = _context27.v;
                  $("#itrash").disabled = false;
                  toast("Ging nicht: " + _t11.message, 7000);
                case 5:
                  return _context27.a(2);
              }
            }, _callee27, null, [[2, 4]]);
          }));
          if (it.type === "movie") loadSimilar("item", id);
          if ($("#iver")) {
            $("#iver").value = String(id);
            $("#iver").onchange = function (e) {
              NAV.back = false;
              NAV.replacing = true;
              location.replace("#/titel/" + e.target.value);
            };
          }
        case 2:
          return _context28.a(2);
      }
    }, _callee28);
  }));
  return _viewItem.apply(this, arguments);
}
function versionLabel(v) {
  var res = v.height ? v.height >= 2000 ? "4K" : v.height >= 1000 ? "1080p" : v.height >= 700 ? "720p" : v.height + "p" : "";
  return [v.src || (v.folder || "").split("/")[0] || "Datei", res, v.size ? fmtSize(v.size) : "", (v.vcodec || "").toUpperCase(), v.duration ? fmtDur(v.duration) : ""].filter(Boolean).join(" · ");
}
function castHtml(c) {
  if (!c || !c.director || !c.director.length) return "";
  return "<div class=\"cast\"><div class=\"castline\"><span class=\"muted\">Regie:</span> ".concat(esc(c.director.join(", ")), "</div></div>");
}
function castStrip(c) {
  if (!c || !c.cast || !c.cast.length) return "";
  return "<h2>Besetzung</h2><div class=\"strip\">".concat(c.cast.map(function (p) {
    var img = p.img ? "<img loading=\"lazy\" src=\"/api/person_img?p=".concat(encodeURIComponent(p.img), "\" alt=\"\" onerror=\"this.remove()\">") : "";
    var tag = p.id ? "a href=\"#/person/".concat(p.id, "\"") : "div";
    return "<".concat(tag, " class=\"card person f\" tabindex=\"0\"><div class=\"img\">").concat(img, "<div class=\"ph pic\">\uD83D\uDC64</div></div>\n      <div class=\"t\">").concat(esc(p.name), "</div><div class=\"s\">").concat(p.role ? "als " + esc(p.role) : "&nbsp;", "</div></").concat(p.id ? "a" : "div", ">");
  }).join(""), "</div>");
}
function genreChips(g) {
  if (!g || !g.length) return "";
  return "<div class=\"chips\">".concat(g.map(function (x) {
    return "<a class=\"chip f\" tabindex=\"0\" href=\"#/genre/".concat(encodeURIComponent(x), "\">").concat(esc(x), "</a>");
  }).join(""), "</div>");
}
function fmtRate(b) {
  return b ? b >= 1e6 ? (b / 1e6).toFixed(1).replace(".", ",") + " Mbit/s" : Math.round(b / 1000) + " kbit/s" : "";
}
var LANG = {
  ger: "Deutsch",
  deu: "Deutsch",
  de: "Deutsch",
  eng: "Englisch",
  en: "Englisch",
  fre: "Französisch",
  fra: "Französisch",
  spa: "Spanisch",
  ita: "Italienisch",
  jpn: "Japanisch",
  und: "unbekannt"
};
function mediaHtml(it) {
  var m = it.media || {};
  var kv = function kv(rows) {
    return "<table class=\"kv\">".concat(rows.filter(function (r) {
      return r[1] !== null && r[1] !== undefined && r[1] !== "";
    }).map(function (r) {
      return "<tr><th>".concat(r[0], "</th><td>").concat(esc(r[1]), "</td></tr>");
    }).join(""), "</table>");
  };
  var box = function box(icon, title, rows) {
    return "<div class=\"mbox\"><h3>".concat(icon, " ").concat(title, "</h3>").concat(kv(rows), "</div>");
  };
  var boxes = "";
  (m.video || []).forEach(function (v) {
    return boxes += box("🎬", "Video", [["Titel", v.title], ["Codec", v.codec], ["Codec-Tag", v.tag], ["Profil", v.profile], ["Level", v.level], ["Auflösung", v.width ? v.width + "×" + v.height : ""], ["Seitenverhältnis", v.aspect], ["Interlaced", v.interlaced ? "Ja" : "Nein"], ["Bildrate", v.fps ? String(v.fps).replace(".", ",") + " fps" : ""], ["Bitrate", fmtRate(v.bitrate)], ["Primärfarben", v.primaries], ["Farbraum", v.space], ["Farbtransfer", v.transfer], ["Bit-Tiefe", v.bits ? v.bits + " bit" : ""], ["Pixelformat", v.pix_fmt], ["Referenz-Frames", v.refs]]);
  });
  (m.audio || []).forEach(function (a, i) {
    return boxes += box("🔊", "Ton " + (i + 1), [["Titel", a.title], ["Sprache", LANG[a.lang] || a.lang], ["Codec", a.codec], ["Codec-Tag", a.tag], ["Profil", a.profile], ["Kanäle", a.channels ? a.channels + " (" + (a.layout || "") + ")" : ""], ["Bitrate", fmtRate(a.bitrate)], ["Abtastrate", a.rate ? a.rate.toLocaleString("de-DE") + " Hz" : ""], ["Standard", a.default ? "Ja" : "Nein"]]);
  });
  (m.subs || []).forEach(function (t, i) {
    return boxes += box("💬", "Untertitel " + (i + 1), [["Titel", t.title], ["Sprache", LANG[t.lang] || t.lang], ["Format", t.codec], ["Erzwungen", t.forced ? "Ja" : "Nein"], ["Standard", t.default ? "Ja" : "Nein"]]);
  });
  (m.images || []).forEach(function (b) {
    return boxes += box("🖼", "Bild", [["Codec", b.codec], ["Auflösung", b.width ? b.width + "×" + b.height : ""]]);
  });
  var date = new Date((it.mtime || it.added || 0) * 1000);
  return "<details class=\"media\"><summary class=\"f\" tabindex=\"0\">Medieninformationen</summary>\n    <div class=\"mhead\"><div>".concat(esc(it.path || it.file), "</div>\n    <div class=\"muted\">").concat(esc((m.container || "").split(",")[0]), " \xB7 ").concat(fmtSize(it.size)).concat(m.bitrate ? " · " + fmtRate(m.bitrate) : "", " \xB7 Dateidatum ").concat(date.toLocaleString("de-DE"), "</div></div>\n    <div class=\"mboxes\">").concat(boxes || '<p class="muted">Keine Angaben.</p>', "</div></details>");
}
function loadSimilar(_x8, _x9) {
  return _loadSimilar.apply(this, arguments);
}
function _loadSimilar() {
  _loadSimilar = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(kind, id) {
    var list, el, _t12;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.p = _context29.n) {
        case 0:
          _context29.p = 0;
          _context29.n = 1;
          return api("/api/similar/".concat(kind, "/").concat(id));
        case 1:
          list = _context29.v;
          el = $("#similar");
          if (el && list.length) el.innerHTML = "<h2>\xC4hnliche Titel in deiner Sammlung</h2><div class=\"strip\">".concat(list.map(function (i) {
            return card(i);
          }).join(""), "</div>");
          _context29.n = 3;
          break;
        case 2:
          _context29.p = 2;
          _t12 = _context29.v;
        case 3:
          return _context29.a(2);
      }
    }, _callee29, null, [[0, 2]]);
  }));
  return _loadSimilar.apply(this, arguments);
}
function audioLabel(a, i) {
  var langs = {
    ger: "Deutsch",
    deu: "Deutsch",
    de: "Deutsch",
    eng: "Englisch",
    en: "Englisch",
    fre: "Französisch",
    fra: "Französisch",
    spa: "Spanisch",
    ita: "Italienisch",
    jpn: "Japanisch"
  };
  var ch = a.ch >= 6 ? "5.1" : a.ch === 8 ? "7.1" : a.ch === 1 ? "Mono" : "Stereo";
  return "".concat(langs[a.lang] || a.lang || "Spur " + (i + 1)).concat(a.title ? " – " + a.title : "", " (").concat((a.codec || "").toUpperCase(), " ").concat(ch, ")");
}
function matchDialog(kind, title, target) {
  modal("<h2>Richtigen ".concat(kind === "serie" ? "Serieneintrag" : "Film", " w\xE4hlen</h2>\n    <div class=\"row\"><input id=\"mq\" type=\"search\" class=\"f\" style=\"flex:1\" value=\"").concat(esc(title), "\"><button class=\"btn f\" id=\"mgo\">Suchen</button></div>\n    <div id=\"mres\" style=\"margin-top:14px\"></div><div class=\"row\" style=\"margin-top:14px\"><button class=\"btn f\" onclick=\"closeModal()\">Schlie\xDFen</button></div>"));
  var go = /*#__PURE__*/function () {
    var _go = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var r, _t4;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            $("#mres").innerHTML = '<p class="muted">Suche…</p>';
            _context6.p = 1;
            _context6.n = 2;
            return api("/api/admin/tmdb?kind=".concat(kind, "&q=").concat(encodeURIComponent($("#mq").value)));
          case 2:
            r = _context6.v;
            $("#mres").innerHTML = r.map(function (x) {
              return "<div class=\"ep f\" tabindex=\"0\" data-id=\"".concat(x.id, "\">\n        <div class=\"img\" style=\"width:60px;flex-basis:60px;aspect-ratio:2/3;").concat(x.poster ? "background-image:url('".concat(x.poster, "')") : "", "\"></div>\n        <div>").concat(esc(x.title), " <span class=\"muted\">").concat(x.year, "</span></div></div>");
            }).join("") || '<p class="muted">Nichts gefunden.</p>';
            $$("#mres .ep").forEach(function (el) {
              return el.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
                return _regenerator().w(function (_context5) {
                  while (1) switch (_context5.n) {
                    case 0:
                      _context5.n = 1;
                      return api("/api/admin/match", {
                        method: "POST",
                        body: _objectSpread(_objectSpread({}, target), {}, {
                          tmdb_id: +el.dataset.id
                        })
                      });
                    case 1:
                      closeModal();
                      toast("Zuordnung gespeichert");
                      route();
                    case 2:
                      return _context5.a(2);
                  }
                }, _callee5);
              }));
            });
            _context6.n = 4;
            break;
          case 3:
            _context6.p = 3;
            _t4 = _context6.v;
            $("#mres").innerHTML = "<p class=\"err\">".concat(esc(_t4.message), "</p>");
          case 4:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 3]]);
    }));
    function go() {
      return _go.apply(this, arguments);
    }
    return go;
  }();
  $("#mgo").onclick = go;
  $("#mq").onkeydown = function (e) {
    if (e.key === "Enter") go();
  };
}

/* ---------------------------------------------------------------- Bearbeiten */
function editDialog(_x0, _x1, _x10, _x11) {
  return _editDialog.apply(this, arguments);
}
function _editDialog() {
  _editDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(kind, ref, searchKind, title) {
    var d, isEp, provs, prov, picked, file, setv, fill, hints, setProv, go, pick, bindSave;
    return _regenerator().w(function (_context36) {
      while (1) switch (_context36.n) {
        case 0:
          bindSave = function _bindSave() {
            $("#esave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
              var g, r, _t17;
              return _regenerator().w(function (_context35) {
                while (1) switch (_context35.p = _context35.n) {
                  case 0:
                    g = function g(id) {
                      return $("#" + id) ? $("#" + id).value : "";
                    };
                    _context35.p = 1;
                    _context35.n = 2;
                    return api("/api/admin/edit", {
                      method: "POST",
                      body: {
                        kind: kind,
                        id: ref,
                        title: g("ef_title"),
                        year: g("ef_year"),
                        fsk: g("ef_fsk"),
                        genres: g("ef_genres"),
                        director: g("ef_dir"),
                        cast: g("ef_cast"),
                        overview: g("ef_over"),
                        poster_url: file ? null : picked.poster_url,
                        tvmaze_id: picked.tvmaze_id
                      }
                    });
                  case 2:
                    if (!file) {
                      _context35.n = 4;
                      break;
                    }
                    _context35.n = 3;
                    return fetch("/api/admin/poster/".concat(kind, "/").concat(ref), {
                      method: "POST",
                      credentials: "same-origin",
                      headers: {
                        "Content-Type": file.type || "image/jpeg"
                      },
                      body: file
                    });
                  case 3:
                    r = _context35.v;
                    if (r.ok) {
                      _context35.n = 4;
                      break;
                    }
                    throw new Error("Cover konnte nicht hochgeladen werden");
                  case 4:
                    closeModal();
                    toast("Gespeichert");
                    route();
                    _context35.n = 6;
                    break;
                  case 5:
                    _context35.p = 5;
                    _t17 = _context35.v;
                    $("#eerr").textContent = _t17.message;
                  case 6:
                    return _context35.a(2);
                }
              }, _callee35, null, [[1, 5]]);
            }));
          };
          _context36.n = 1;
          return api("/api/admin/editdata/".concat(kind, "/").concat(ref));
        case 1:
          d = _context36.v;
          isEp = d.type === "episode";
          provs = [["tmdb", "TheMovieDB"], ["wiki", "Wikipedia"], ["kfw", "KinoFilmWelt"], ["omdb", "OMDb / IMDb"]].concat(searchKind === "serie" ? [["tvmaze", "TVmaze"]] : []).concat(d.has_vsmeta ? [["vsmeta", "Video Station"]] : []);
          prov = "tmdb", picked = {
            poster_url: null,
            tvmaze_id: null
          }, file = null;
          modal("<h2>".concat(isEp ? "Folge bearbeiten" : "Bearbeiten").concat(d.locked ? ' <span class="muted small">(selbst bearbeitet – wird nicht automatisch überschrieben)</span>' : "", "</h2>\n    ").concat(isEp ? "" : "<div class=\"lookup\">\n      <div class=\"tabs\" id=\"eprov\">".concat(provs.map(function (p) {
            return "<button class=\"f\" data-p=\"".concat(p[0], "\">").concat(p[1], "</button>");
          }).join(""), "</div>\n      <div class=\"row\"><input id=\"eq\" class=\"f\" style=\"flex:1\" value=\"").concat(esc(title), "\"><button class=\"btn f\" id=\"ego\">Suchen</button></div>\n      ").concat(d.type === "series" || d.type === "movie" || d.type === "video" ? "<div class=\"eids\">\n        ".concat([["imdb", "IMDb", "tt0120737 oder Link"], ["tmdb", "TheMovieDB", "Nummer"], ["tvdb", "TheTVDB", "Nummer"]].map(function (_ref17) {
            var _ref18 = _slicedToArray(_ref17, 3),
              k = _ref18[0],
              n = _ref18[1],
              ph = _ref18[2];
            return "<div class=\"eid\"><label>".concat(n, "-ID</label><div class=\"row\"><input id=\"eid_").concat(k, "\" class=\"f\" placeholder=\"").concat(ph, "\" value=\"").concat(esc((d.ids || {})[k] || ""), "\"><button class=\"btn sm f\" data-src=\"").concat(k, "\" title=\"Mit dieser ID suchen\">\u2192</button></div></div>");
          }).join(""), "\n      </div>") : "", "\n      ").concat((d.files || []).length ? "<div class=\"efiles\">".concat(d.type === "series" ? "Ordner" : "Datei", ": ").concat(d.files.map(function (f) {
            return "<a class=\"efile f\" tabindex=\"0\" title=\"Anklicken = ins Suchfeld \xFCbernehmen (ohne Endung)\">".concat(esc(f), "</a>");
          }).join(""), "</div>") : "", "\n      <p class=\"muted small\" id=\"ehint\"></p>\n      <div id=\"eres\" class=\"eres\"></div></div>"), "\n    <div class=\"eform\">\n      <div class=\"row\"><div style=\"flex:3;min-width:200px\"><label>Titel</label><input id=\"ef_title\" class=\"f\" style=\"width:100%\"></div>\n        ").concat(isEp ? "" : "<div style=\"flex:1;min-width:80px\"><label>Jahr</label><input id=\"ef_year\" class=\"f\" style=\"width:100%\" inputmode=\"numeric\"></div>\n        <div style=\"flex:1;min-width:90px\"><label>FSK</label><select id=\"ef_fsk\" class=\"f\" style=\"width:100%\"><option value=\"\">\u2013</option><option>0</option><option>6</option><option>12</option><option>16</option><option>18</option></select></div>", "</div>\n      ").concat(isEp ? "" : "<label>Genres (mit Komma getrennt)</label><input id=\"ef_genres\" class=\"f\" style=\"width:100%\">\n      <label>Regie</label><input id=\"ef_dir\" class=\"f\" style=\"width:100%\">\n      <label>Darsteller \u2013 alles auf einmal einf\xFCgen, z. B. \u201EKiefer Sutherland (Jack Bauer), Robert Carlyle (Carl Benton)\u201C</label>\n      <textarea id=\"ef_cast\" class=\"f\" rows=\"3\" style=\"width:100%\"></textarea>", "\n      <div class=\"lblrow\"><label>Inhalt</label><button type=\"button\" class=\"btn small f\" id=\"ef_tr\" title=\"Inhalt (und Genres) ins Deutsche \xFCbersetzen\">\uD83C\uDF10 \xDCbersetzen</button></div>\n      <textarea id=\"ef_over\" class=\"f\" rows=\"6\" style=\"width:100%\"></textarea>\n      ").concat(isEp ? "" : "<label>Cover</label>\n      <div class=\"row coverrow\"><div class=\"cprev\" id=\"ef_prev\"></div>\n        <div style=\"flex:1;min-width:220px\"><input type=\"file\" id=\"ef_file\" accept=\"image/*\" class=\"f\">\n        <input id=\"ef_purl\" class=\"f\" style=\"width:100%;margin-top:8px\" placeholder=\"\u2026 oder Bild-Adresse (https://\u2026) einf\xFCgen\"></div></div>", "\n    </div>\n    <div class=\"err\" id=\"eerr\"></div>\n    <div class=\"row\" style=\"margin-top:16px\"><button class=\"btn primary f\" id=\"esave\">Speichern</button><button class=\"btn f\" onclick=\"closeModal()\">Abbrechen</button></div>"), true);
          setv = function setv(id, v) {
            var el = $("#" + id);
            if (el) el.value = v === null || v === undefined ? "" : v;
          };
          fill = function fill(x) {
            setv("ef_title", x.title);
            setv("ef_year", x.year);
            if (x.fsk !== undefined) setv("ef_fsk", x.fsk);
            setv("ef_genres", Array.isArray(x.genres) ? x.genres.join(", ") : x.genres);
            setv("ef_dir", Array.isArray(x.director) ? x.director.join(", ") : x.director);
            setv("ef_cast", Array.isArray(x.cast) ? x.cast.map(function (p) {
              return p.name + (p.role ? " (".concat(p.role, ")") : "");
            }).join(", ") : x.cast);
            setv("ef_over", x.overview);
            var img = x.poster_url || (x.poster ? imgUrl(x.poster) : null);
            if ($("#ef_prev")) $("#ef_prev").style.backgroundImage = img ? "url('".concat(img, "')") : "";
          };
          fill(d);
          $("#ef_tr").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30() {
            var b, txt, gen, r, _t13;
            return _regenerator().w(function (_context30) {
              while (1) switch (_context30.p = _context30.n) {
                case 0:
                  b = $("#ef_tr"), txt = $("#ef_over").value.trim(), gen = $("#ef_genres") ? $("#ef_genres").value : "";
                  if (!(!txt && !gen)) {
                    _context30.n = 1;
                    break;
                  }
                  return _context30.a(2);
                case 1:
                  b.disabled = true;
                  b.textContent = "Übersetze …";
                  _context30.p = 2;
                  _context30.n = 3;
                  return api("/api/admin/translate", {
                    method: "POST",
                    body: {
                      text: txt,
                      genres: gen
                    }
                  });
                case 3:
                  r = _context30.v;
                  if (r.text) $("#ef_over").value = r.text;
                  if (r.genres && $("#ef_genres")) $("#ef_genres").value = r.genres;
                  if (r.error) toast("Inhalt konnte nicht übersetzt werden: " + r.error, 5000);else toast("Übersetzt" + (r.provider ? " (" + r.provider + ")" : "") + " – bitte kurz prüfen", 3000);
                  _context30.n = 5;
                  break;
                case 4:
                  _context30.p = 4;
                  _t13 = _context30.v;
                  toast("Übersetzen ging nicht: " + _t13.message, 5000);
                case 5:
                  b.disabled = false;
                  b.textContent = "🌐 Übersetzen";
                case 6:
                  return _context30.a(2);
              }
            }, _callee30, null, [[2, 4]]);
          }));
          if (!isEp) {
            _context36.n = 2;
            break;
          }
          return _context36.a(2, bindSave());
        case 2:
          hints = {
            tmdb: "Treffer anklicken = automatisch zuordnen (Cover, FSK, Darsteller, Inhalt kommen von TheMovieDB).",
            wiki: "Deutsche Wikipedia: Inhalt und Besetzung werden ins Formular übernommen – vor dem Speichern prüfen.",
            vsmeta: "Infos aus der alten Video Station (.vsmeta-Datei bzw. gleichnamiges Bild neben dem Film) – Treffer anklicken, prüfen, speichern.",
            kfw: "KinoFilmWelt (Kinder- und Jugendfilmzentrum): gut für ältere deutsche DVD-/Video-Veröffentlichungen. Inhalt, FSK, Regie, Darsteller, Genres und Cover werden ins Formular übernommen – vor dem Speichern prüfen.",
            omdb: "IMDb-Daten (englisch): Genres, Regie, Darsteller, Inhalt und Cover ins Formular übernehmen. Tipp: Auch die IMDb-Nummer (z. B. tt0813980) oder Titel mit Jahr in Klammern geht.",
            tvmaze: "Serien-Datenbank (englisch): Daten ins Formular, fehlende Folgentitel werden beim Speichern ergänzt."
          };
          setProv = function setProv(p) {
            prov = p;
            $$("#eprov button").forEach(function (b) {
              return b.classList.toggle("active", b.dataset.p === p);
            });
            $("#ehint").textContent = hints[p];
            $("#eres").innerHTML = "";
          };
          $$("#eprov button").forEach(function (b) {
            return b.onclick = function () {
              setProv(b.dataset.p);
              b.dataset.p === "vsmeta" ? pick(String(ref)) : go();
            };
          });
          setProv("tmdb");
          $$(".efile").forEach(function (a) {
            return a.onclick = function () {
              $("#eq").value = a.textContent.replace(/\.(mkv|mp4|m4v|avi|mov|wmv|mpg|mpeg|ts|m2ts|mts|webm|flv|divx|3gp|ogv|iso)$/i, "");
              $("#eq").focus();
              go();
            };
          });
          go = /*#__PURE__*/function () {
            var _go2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
              var r, _t14;
              return _regenerator().w(function (_context31) {
                while (1) switch (_context31.p = _context31.n) {
                  case 0:
                    $("#eres").innerHTML = '<p class="muted">Suche …</p>';
                    _context31.p = 1;
                    _context31.n = 2;
                    return api("/api/admin/lookup?provider=".concat(prov, "&kind=").concat(searchKind, "&q=").concat(encodeURIComponent($("#eq").value)));
                  case 2:
                    r = _context31.v;
                    $("#eres").innerHTML = r.map(function (x) {
                      return "<div class=\"ep f\" tabindex=\"0\" data-id=\"".concat(esc(x.id), "\">\n        <div class=\"img\" style=\"width:46px;flex-basis:46px;height:69px;").concat(x.poster ? "background-image:url('".concat(esc(x.poster), "')") : "", "\"></div>\n        <div><div>").concat(esc(x.title), " <span class=\"muted\">").concat(esc(x.year || ""), "</span></div><div class=\"muted small\">").concat(esc(x.info || ""), "</div></div></div>");
                    }).join("") || '<p class="muted">Nichts gefunden.</p>';
                    $$("#eres .ep").forEach(function (el) {
                      return el.onclick = function () {
                        return pick(el.dataset.id);
                      };
                    });
                    _context31.n = 4;
                    break;
                  case 3:
                    _context31.p = 3;
                    _t14 = _context31.v;
                    $("#eres").innerHTML = "<p class=\"err\">".concat(esc(_t14.message), "</p>");
                  case 4:
                    return _context31.a(2);
                }
              }, _callee31, null, [[1, 3]]);
            }));
            function go() {
              return _go2.apply(this, arguments);
            }
            return go;
          }();
          pick = /*#__PURE__*/function () {
            var _pick = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(id) {
              var _x$fsk, x, _t15;
              return _regenerator().w(function (_context32) {
                while (1) switch (_context32.p = _context32.n) {
                  case 0:
                    if (!(prov === "tmdb")) {
                      _context32.n = 2;
                      break;
                    }
                    _context32.n = 1;
                    return api("/api/admin/match", {
                      method: "POST",
                      body: kind === "series" ? {
                        series_id: ref,
                        tmdb_id: +id
                      } : {
                        item_id: ref,
                        tmdb_id: +id
                      }
                    });
                  case 1:
                    closeModal();
                    toast("Zuordnung gespeichert");
                    route();
                    return _context32.a(2);
                  case 2:
                    $("#eres").innerHTML = '<p class="muted">Lade Angaben …</p>';
                    _context32.p = 3;
                    _context32.n = 4;
                    return api("/api/admin/lookup_detail?provider=".concat(prov, "&kind=").concat(searchKind, "&id=").concat(encodeURIComponent(id)));
                  case 4:
                    x = _context32.v;
                    picked = {
                      poster_url: x.poster_url || null,
                      tvmaze_id: x.tvmaze_id || null
                    };
                    fill(Object.assign({}, x, {
                      fsk: (_x$fsk = x.fsk) !== null && _x$fsk !== void 0 ? _x$fsk : $("#ef_fsk").value
                    }));
                    $("#eres").innerHTML = "<p class=\"ok\">Angaben von ".concat(esc(x.source), " \xFCbernommen \u2013 bitte pr\xFCfen und speichern.</p>");
                    _context32.n = 6;
                    break;
                  case 5:
                    _context32.p = 5;
                    _t15 = _context32.v;
                    $("#eres").innerHTML = "<p class=\"err\">".concat(esc(_t15.message), "</p>");
                  case 6:
                    return _context32.a(2);
                }
              }, _callee32, null, [[3, 5]]);
            }));
            function pick(_x31) {
              return _pick.apply(this, arguments);
            }
            return pick;
          }();
          $$(".eid button").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
              var src, v, x, _t16;
              return _regenerator().w(function (_context34) {
                while (1) switch (_context34.p = _context34.n) {
                  case 0:
                    src = b.dataset.src, v = $("#eid_" + src).value.trim();
                    if (v) {
                      _context34.n = 1;
                      break;
                    }
                    return _context34.a(2);
                  case 1:
                    $("#eres").innerHTML = '<p class="muted">Suche …</p>';
                    _context34.p = 2;
                    _context34.n = 3;
                    return api("/api/admin/find_id?kind=".concat(searchKind, "&src=").concat(src, "&id=").concat(encodeURIComponent(v)));
                  case 3:
                    x = _context34.v;
                    if (!(x.tv && searchKind !== "serie")) {
                      _context34.n = 4;
                      break;
                    }
                    // Miniserie oder Serienfolge als Film abgelegt: Angaben ins Formular übernehmen (dann speichern)
                    $("#eres").innerHTML = "<div class=\"ep f\" tabindex=\"0\"><div class=\"img\" style=\"width:46px;flex-basis:46px;height:69px;".concat(x.poster ? "background-image:url('".concat(esc(x.poster), "')") : "", "\"></div>\n          <div><b>").concat(esc(x.title), "</b> ").concat(x.year ? "(".concat(esc(x.year), ")") : "", "<div class=\"muted small\">").concat(x.type === "episode" ? "Serienfolge" + (x.info ? " · " + esc(x.info) : "") : "Serie", " \u2013 anklicken = Angaben ins Formular \xFCbernehmen, danach \u201ESpeichern\u201C</div></div></div>");
                    $("#eres .ep").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
                      return _regenerator().w(function (_context33) {
                        while (1) switch (_context33.n) {
                          case 0:
                            prov = "tmdbtv";
                            _context33.n = 1;
                            return pick(x.id);
                          case 1:
                            prov = "tmdb";
                          case 2:
                            return _context33.a(2);
                        }
                      }, _callee33);
                    }));
                    return _context34.a(2);
                  case 4:
                    if (!(x.tv !== (searchKind === "serie"))) {
                      _context34.n = 5;
                      break;
                    }
                    $("#eres").innerHTML = "<p class=\"err\">Gefunden: \u201E".concat(esc(x.title), "\u201C \u2013 das ist ein Film, hier wird aber eine Serie bearbeitet.</p>");
                    return _context34.a(2);
                  case 5:
                    setProv("tmdb");
                    $("#eres").innerHTML = "<div class=\"ep f\" tabindex=\"0\" data-id=\"".concat(x.id, "\"><div class=\"img\" style=\"width:46px;flex-basis:46px;height:69px;").concat(x.poster ? "background-image:url('".concat(esc(x.poster), "')") : "", "\"></div>\n        <div><b>").concat(esc(x.title), "</b> ").concat(x.year ? "(".concat(esc(x.year), ")") : "", "<div class=\"muted small\">Anklicken = zuordnen</div></div></div>");
                    $("#eres .ep").onclick = function () {
                      return pick(x.id);
                    };
                    _context34.n = 7;
                    break;
                  case 6:
                    _context34.p = 6;
                    _t16 = _context34.v;
                    $("#eres").innerHTML = "<p class=\"err\">".concat(esc(_t16.message), "</p>");
                  case 7:
                    return _context34.a(2);
                }
              }, _callee34, null, [[2, 6]]);
            }));
          });
          $$(".eid input").forEach(function (i) {
            return i.onkeydown = function (e) {
              if (e.key === "Enter") i.parentNode.querySelector("button").click();
            };
          });
          $("#ego").onclick = go;
          $("#eq").onkeydown = function (e) {
            if (e.key === "Enter") go();
          };
          $("#ef_file").onchange = function (e) {
            file = e.target.files[0] || null;
            if (file && window.URL) $("#ef_prev").style.backgroundImage = "url('".concat(URL.createObjectURL(file), "')");
          };
          $("#ef_purl").oninput = function (e) {
            picked.poster_url = e.target.value.trim() || null;
            if (picked.poster_url) $("#ef_prev").style.backgroundImage = "url('".concat(picked.poster_url, "')");
          };
          bindSave();
        case 3:
          return _context36.a(2);
      }
    }, _callee36);
  }));
  return _editDialog.apply(this, arguments);
}
function rescanSeries(_x12) {
  return _rescanSeries.apply(this, arguments);
}
function _rescanSeries() {
  _rescanSeries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(sid) {
    var _poll;
    return _regenerator().w(function (_context38) {
      while (1) switch (_context38.n) {
        case 0:
          _context38.n = 1;
          return api("/api/admin/scan", {
            method: "POST",
            body: {
              series_id: sid
            }
          });
        case 1:
          toast("Serienordner wird geprüft …", 2500);
          _poll = /*#__PURE__*/function () {
            var _poll2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37() {
              var st;
              return _regenerator().w(function (_context37) {
                while (1) switch (_context37.n) {
                  case 0:
                    _context37.n = 1;
                    return api("/api/admin/scan");
                  case 1:
                    st = _context37.v;
                    if (!st.running) {
                      _context37.n = 2;
                      break;
                    }
                    return _context37.a(2, setTimeout(_poll, 1500));
                  case 2:
                    toast(st.last_result || "Fertig", 4000);
                    route();
                  case 3:
                    return _context37.a(2);
                }
              }, _callee37);
            }));
            function poll() {
              return _poll2.apply(this, arguments);
            }
            return poll;
          }();
          setTimeout(_poll, 1200);
        case 2:
          return _context38.a(2);
      }
    }, _callee38);
  }));
  return _rescanSeries.apply(this, arguments);
}
/* ---------------------------------------------------------------- Person & Genre */
function viewPerson(_x13) {
  return _viewPerson.apply(this, arguments);
}
function _viewPerson() {
  _viewPerson = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(pid) {
    var d, n;
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.n) {
        case 0:
          _context39.n = 1;
          return api("/api/person/".concat(pid));
        case 1:
          d = _context39.v;
          n = d.items.length + d.series.length;
          view.innerHTML = "".concat(backBtn(), "<div class=\"personhead\">\n      <div class=\"pphoto\">").concat(d.img ? "<img src=\"/api/person_img?p=".concat(encodeURIComponent(d.img), "\" alt=\"\">") : "👤", "</div>\n      <div><h1>").concat(esc(d.name), "</h1><p class=\"muted\">").concat(n, " Titel in deiner Sammlung</p></div></div>\n    ").concat(d.items.length ? "<h2>Filme</h2><div class=\"grid\">".concat(d.items.map(function (i) {
            return card(i, {
              sub: (i.year || "") + (i.role ? " · " + esc(i.role) : "")
            });
          }).join(""), "</div>") : "", "\n    ").concat(d.series.length ? "<h2>Serien</h2><div class=\"grid\">".concat(d.series.map(function (i) {
            return card(i, {
              sub: i.role ? "als " + esc(i.role) : i.year || ""
            });
          }).join(""), "</div>") : "", "\n    ").concat(!n ? '<p class="muted">Keine weiteren Titel mit dieser Person gefunden.</p>' : "");
        case 2:
          return _context39.a(2);
      }
    }, _callee39);
  }));
  return _viewPerson.apply(this, arguments);
}
function viewGenre(_x14) {
  return _viewGenre.apply(this, arguments);
}
function _viewGenre() {
  _viewGenre = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(name) {
    var d;
    return _regenerator().w(function (_context40) {
      while (1) switch (_context40.n) {
        case 0:
          _context40.n = 1;
          return api("/api/genre?name=".concat(encodeURIComponent(name)));
        case 1:
          d = _context40.v;
          view.innerHTML = "".concat(backBtn(), "<h1>").concat(esc(d.name), " <span class=\"muted small\">").concat(d.items.length + d.series.length, "</span></h1>\n    ").concat(d.items.length ? "<h2>Filme</h2><div class=\"grid\">".concat(d.items.map(function (i) {
            return card(i);
          }).join(""), "</div>") : "", "\n    ").concat(d.series.length ? "<h2>Serien</h2><div class=\"grid\">".concat(d.series.map(function (i) {
            return card(i);
          }).join(""), "</div>") : "", "\n    ").concat(!d.items.length && !d.series.length ? '<p class="muted">Nichts gefunden.</p>' : "");
        case 2:
          return _context40.a(2);
      }
    }, _callee40);
  }));
  return _viewGenre.apply(this, arguments);
}
/* ---------------------------------------------------------------- Suche */
function viewSearch() {
  return _viewSearch.apply(this, arguments);
}
function _viewSearch() {
  _viewSearch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42() {
    var t;
    return _regenerator().w(function (_context42) {
      while (1) switch (_context42.n) {
        case 0:
          view.innerHTML = "<h1>Suche</h1><div class=\"toolbar\"><input type=\"search\" id=\"sq\" class=\"f\" placeholder=\"Film, Serie oder Video\u2026\" style=\"max-width:600px\"></div><div id=\"sres\"></div>";
          $("#sq").oninput = function (e) {
            clearTimeout(t);
            t = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41() {
              var q, d;
              return _regenerator().w(function (_context41) {
                while (1) switch (_context41.n) {
                  case 0:
                    q = e.target.value.trim();
                    if (!(q.length < 2)) {
                      _context41.n = 1;
                      break;
                    }
                    $("#sres").innerHTML = "";
                    return _context41.a(2);
                  case 1:
                    _context41.n = 2;
                    return api("/api/search?q=".concat(encodeURIComponent(q)));
                  case 2:
                    d = _context41.v;
                    $("#sres").innerHTML = (d.series.length ? "<h2>Serien</h2><div class=\"grid\">".concat(d.series.map(function (s) {
                      return card(_objectSpread(_objectSpread({}, s), {}, {
                        type: "series"
                      }));
                    }).join(""), "</div>") : "") + (d.items.length ? "<h2>Filme & Videos</h2><div class=\"grid\">".concat(d.items.map(function (i) {
                      return card(i);
                    }).join(""), "</div>") : "") || '<p class="muted">Nichts gefunden.</p>';
                  case 3:
                    return _context41.a(2);
                }
              }, _callee41);
            })), 350);
          };
          $("#sq").focus();
        case 1:
          return _context42.a(2);
      }
    }, _callee42);
  }));
  return _viewSearch.apply(this, arguments);
}
/* ---------------------------------------------------------------- Live-TV */
var CHANNELS = [];
function viewLive() {
  return _viewLive.apply(this, arguments);
}
function _viewLive() {
  _viewLive = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43() {
    var section, net, sat, sl, sleepRow;
    return _regenerator().w(function (_context43) {
      while (1) switch (_context43.n) {
        case 0:
          _context43.n = 1;
          return api("/api/live/channels");
        case 1:
          CHANNELS = _context43.v;
          section = function section(list, sat) {
            var groups = _toConsumableArray(new Set(list.map(function (c) {
              return c.group || "Sender";
            })));
            return groups.map(function (g) {
              return "<h2>".concat(esc(g), "</h2><div class=\"channels\">\n      ").concat(list.filter(function (c) {
                return (c.group || "Sender") === g;
              }).map(function (c) {
                return "<div class=\"chan f ".concat(esc(c.group)).concat(sat ? " sat" : "", "\" tabindex=\"0\" data-i=\"").concat(c.idx, "\">").concat(sat ? '<span class="satmark">📡</span>' : "").concat(esc(c.name), "</div>");
              }).join(""), "</div>");
            }).join("");
          };
          net = CHANNELS.filter(function (c) {
            return !c.sat;
          }), sat = CHANNELS.filter(function (c) {
            return c.sat;
          });
          sl = +(localStorage.getItem("sleepMin") || 0);
          sleepRow = "<div class=\"sleeprow\"><span class=\"muted\">\u23FE Ausschalten nach:</span>".concat([0, 30, 60, 120].map(function (m) {
            return "<button class=\"btn sm f sleepopt".concat(m === sl ? " on" : "", "\" data-m=\"").concat(m, "\">").concat(m ? m + " Min" : "Aus", "</button>");
          }).join(""), "</div>");
          view.innerHTML = "<h1>Live-TV</h1>" + sleepRow + (sat.length ? "<div class=\"livehead\">\uD83C\uDF10 \xDCber Internet <span class=\"muted small\">\u2013 unbegrenzt</span></div>" : "") + section(net, false) + (sat.length ? "<div class=\"livehead sat\">\uD83D\uDCE1 \xDCber Satellit <span class=\"muted small\">\u2013 begrenzte Empf\xE4nger, gleichzeitig nur so viele Sender wie Empf\xE4nger frei sind</span></div>" + section(sat, true) : "");
          $$(".chan").forEach(function (el) {
            return el.onclick = function () {
              return openLive(+el.dataset.i);
            };
          });
          $$(".sleepopt").forEach(function (b) {
            return b.onclick = function () {
              try {
                localStorage.setItem("sleepMin", b.dataset.m);
              } catch (_) {}
              $$(".sleepopt").forEach(function (x) {
                return x.classList.toggle("on", x === b);
              });
            };
          });
        case 2:
          return _context43.a(2);
      }
    }, _callee43);
  }));
  return _viewLive.apply(this, arguments);
}
/* Sleeptimer für Live-TV: 5 Minuten vor Ablauf Hinweis mit Verlängern, ohne Antwort wird beendet */
var SLEEP = {
  end: 0,
  timer: null
};
function sleepStart(min) {
  sleepStop();
  if (!min) return;
  SLEEP.end = Date.now() + min * 60000;
  SLEEP.timer = setInterval(sleepTick, 1000);
  sleepTick();
}
function sleepStop() {
  clearInterval(SLEEP.timer);
  SLEEP.timer = null;
  SLEEP.end = 0;
  $("#p-sleepbox").hidden = true;
}
function sleepExtend(min) {
  SLEEP.end = Math.max(SLEEP.end, Date.now()) + min * 60000;
  $("#p-sleepbox").hidden = true;
  sleepTick();
  toast("Live-TV l\xE4uft noch ".concat(Math.round((SLEEP.end - Date.now()) / 60000), " Minuten"), 2500);
}
function sleepTick() {
  if (!SLEEP.end || !P.live) return;
  var left = SLEEP.end - Date.now();
  $("#p-sub").textContent = "Live · ⏾ noch " + Math.max(1, Math.ceil(left / 60000)) + " Min";
  if (left <= 0) {
    sleepStop();
    toast("Sleeptimer: Live-TV beendet", 4000);
    closePlayer();
    return;
  }
  if (left <= 5 * 60000) {
    var box = $("#p-sleepbox");
    $("#p-sleepcount").textContent = fmtTime(Math.ceil(left / 1000));
    if (box.hidden) {
      box.hidden = false;
      $("#player").classList.remove("idle");
      wake();
      $("#p-sleep30").focus();
    }
  }
}
$("#p-sleep30").onclick = function () {
  return sleepExtend(30);
};
$("#p-sleep60").onclick = function () {
  return sleepExtend(60);
};
$("#p-sleepoff").onclick = function () {
  sleepStop();
  closePlayer();
};

/* ---------------------------------------------------------------- Player */

var video = $("#video");
var P = {
  item: null,
  offset: 0,
  duration: 0,
  mode: null,
  session: null,
  hls: null,
  audio: null,
  quality: localStorage.getItem("quality") || "original",
  live: null,
  saveTimer: null,
  pingTimer: null,
  nextTimer: null
};
function showSpinner(on) {
  $("#p-spinner").hidden = !on;
}
function openPlayer(_x15) {
  return _openPlayer.apply(this, arguments);
}
function _openPlayer() {
  _openPlayer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44(id) {
    var start,
      audio,
      it,
      _args44 = arguments;
    return _regenerator().w(function (_context44) {
      while (1) switch (_context44.n) {
        case 0:
          start = _args44.length > 1 && _args44[1] !== undefined ? _args44[1] : 0;
          audio = _args44.length > 2 && _args44[2] !== undefined ? _args44[2] : null;
          musicPause();
          _context44.n = 1;
          return api("/api/item/".concat(id));
        case 1:
          it = _context44.v;
          P.item = it;
          P.live = null;
          P.duration = it.duration || 0;
          P.audio = audio;
          $("#player").classList.remove("live");
          $("#player").hidden = false;
          $("#p-title").textContent = it.title;
          $("#p-sub").textContent = it.series ? "".concat(it.series.name, " \xB7 S").concat(it.season, "E").concat(it.episode) : it.year || "";
          $("#p-audio").innerHTML = it.audio.map(function (a, i) {
            return "<option value=\"".concat(i, "\">").concat(esc(audioLabel(a, i)), "</option>");
          }).join("");
          $("#p-audio").hidden = it.audio.length < 2;
          $("#p-quality").value = P.quality;
          $("#p-next").hidden = !it.next;
          $("#p-nextbox").hidden = true;
          drawChapterMarks();
          history.pushState({
            player: true
          }, "");
          document.body.style.overflow = "hidden";
          _context44.n = 2;
          return startStream(start);
        case 2:
          P.saveTimer = setInterval(saveProgress, 10000);
          P.pingTimer = setInterval(function () {
            return P.session && api("/api/hls/".concat(P.session, "/ping"), {
              method: "POST"
            }).catch(function () {});
          }, 30000);
          wake();
          $("#p-play").focus();
          requestFs();
        case 3:
          return _context44.a(2);
      }
    }, _callee44);
  }));
  return _openPlayer.apply(this, arguments);
}
function startStream(_x16) {
  return _startStream.apply(this, arguments);
}
function _startStream() {
  _startStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45(pos) {
    var params, r;
    return _regenerator().w(function (_context45) {
      while (1) switch (_context45.n) {
        case 0:
          showSpinner(true);
          params = new URLSearchParams({
            start: Math.floor(pos || 0),
            quality: P.quality,
            replace: P.session || "",
            hevc: canHevc() ? 1 : 0,
            safari: isSafari() ? 1 : 0
          });
          if (P.audio !== null && P.audio !== undefined) params.set("audio", P.audio);
          _context45.n = 1;
          return api("/api/play/".concat(P.item.id, "?").concat(params));
        case 1:
          r = _context45.v;
          P.mode = r.mode;
          P.session = r.session || null;
          P.offset = r.offset || 0;
          P.audio = r.audio;
          $("#p-audio").value = r.audio;
          $("#p-info").textContent = r.mode === "direct" ? "Direktwiedergabe" : r.transcode === "kopie" ? "Bild direkt, Ton umgewandelt" : r.transcode === "vaapi" ? "Umwandlung: Intel-Grafik" : "Umwandlung: Prozessor";
          attach(r.url, r.mode === "direct" ? pos : 0);
        case 2:
          return _context45.a(2);
      }
    }, _callee45);
  }));
  return _startStream.apply(this, arguments);
}
function isSafari() {
  return IS_IOS || /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Android/.test(navigator.userAgent);
}

/* Falls der Browser mehrere Tonspuren gleichzeitig aktiviert (Safari), nur die gewählte anlassen */
function onlyOneAudio() {
  try {
    var at = video.audioTracks;
    if (!at || at.length < 2 || P.mode !== "direct") return;
    for (var i = 0; i < at.length; i++) at[i].enabled = i === (P.audio || 0);
  } catch (_) {}
}
video.addEventListener("loadedmetadata", onlyOneAudio);
function canHevc() {
  try {
    return IS_IOS || window.MediaSource && MediaSource.isTypeSupported('video/mp4; codecs="hvc1.1.6.L120.90"') && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  } catch (_) {
    return false;
  }
}
function destroyHls() {
  if (P.hls) {
    P.hls.destroy();
    P.hls = null;
  }
}
function attach(url) {
  var seekTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isLive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var onFatal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  destroyHls();
  video.removeAttribute("src");
  video.load();
  var isHls = url.includes(".m3u8") || url.includes("/live/proxy");
  var useNative = !window.Hls || !Hls.isSupported() || IS_IOS;
  if (isHls && !useNative) {
    var hls = new Hls(isLive ? {
      liveSyncDurationCount: 3
    } : {
      startPosition: 0,
      maxBufferLength: 60,
      liveDurationInfinity: true,
      manifestLoadingMaxRetry: 6,
      levelLoadingMaxRetry: 10
    });
    P.hls = hls;
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      return safePlay(video);
    });
    hls.on(Hls.Events.ERROR, function (_, d) {
      if (!d.fatal) return;
      if (onFatal) {
        onFatal();
        return;
      }
      if (d.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();else {
        toast("Wiedergabefehler: " + d.details);
        showSpinner(false);
      }
    });
  } else {
    video.src = url;
    video.onerror = function () {
      if (onFatal) onFatal();else {
        toast("Datei kann nicht abgespielt werden");
        showSpinner(false);
      }
    };
    video.addEventListener("loadedmetadata", function once() {
      video.removeEventListener("loadedmetadata", once);
      if (seekTo) video.currentTime = seekTo;else if (isHls && !isLive && video.currentTime > 5) video.currentTime = 0;
    });
    safePlay(video);
  }
}
var absTime = function absTime() {
  return P.live ? 0 : P.offset + (video.currentTime || 0);
};
function seekTo(t) {
  if (P.live) return;
  t = Math.max(0, Math.min(t, (P.duration || 1e9) - 3));
  if (P.mode === "direct") {
    video.currentTime = t;
    return;
  }
  var rel = t - P.offset;
  var end = 0;
  if (video.seekable.length) end = video.seekable.end(video.seekable.length - 1);
  if (rel >= 0 && rel < end - 2) video.currentTime = rel;else startStream(t);
  updateBar(t);
}
function saveProgress() {
  if (!P.item || P.live) return;
  var pos = absTime();
  if (pos < 5) return;
  api("/api/progress", {
    method: "POST",
    body: {
      item_id: P.item.id,
      position: pos,
      duration: P.duration
    }
  }).catch(function () {});
}
function closePlayer() {
  return _closePlayer.apply(this, arguments);
}
function _closePlayer() {
  _closePlayer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46() {
    var silent,
      _args46 = arguments;
    return _regenerator().w(function (_context46) {
      while (1) switch (_context46.n) {
        case 0:
          silent = _args46.length > 0 && _args46[0] !== undefined ? _args46[0] : false;
          if (!$("#player").hidden) {
            _context46.n = 1;
            break;
          }
          return _context46.a(2);
        case 1:
          exitPip();
          if (!silent) saveProgress();
          clearInterval(P.saveTimer);
          clearInterval(P.pingTimer);
          clearInterval(P.nextTimer);
          sleepStop();
          destroyHls();
          video.pause();
          video.removeAttribute("src");
          video.load();
          if (P.session) api("/api/hls/".concat(P.session), {
            method: "DELETE"
          }).catch(function () {});
          P.session = null;
          P.item = null;
          P.live = null;
          $("#player").hidden = true;
          document.body.style.overflow = "";
          if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
          if (!silent && history.state && history.state.player) history.back();else if (!silent) route();
        case 2:
          return _context46.a(2);
      }
    }, _callee46);
  }));
  return _closePlayer.apply(this, arguments);
}
window.addEventListener("popstate", function () {
  if (!$("#player").hidden) {
    closePlayer(true);
    saveProgress();
    NAV.back = true;
    savePos(location.hash || "#/", {
      y: window.pageYOffset
    });
    route();
  }
});
function requestFs() {
  if (IS_IOS || IS_TV) return;
  if (matchMedia("(max-width: 900px)").matches && document.documentElement.requestFullscreen) $("#player").requestFullscreen().catch(function () {});
}

/* Kapitel: Marken in der Leiste, Sprung vor/zurück; ohne Kapitel in 5-Minuten-Schritten */
function chapterList() {
  return P.item && P.item.chapters || [];
}
function drawChapterMarks() {
  var ch = chapterList(),
    dur = P.duration || 0;
  $("#p-marks").innerHTML = dur ? ch.filter(function (c) {
    return c.start > 1;
  }).map(function (c) {
    return "<i style=\"left:".concat(c.start / dur * 100, "%\"></i>");
  }).join("") : "";
  $("#p-chprev").title = ch.length ? "Kapitel zurück" : "5 Minuten zurück";
  $("#p-chnext").title = ch.length ? "Kapitel vor" : "5 Minuten vor";
}
function currentChapter(t) {
  var ch = chapterList();
  var idx = -1;
  for (var i = 0; i < ch.length; i++) if (ch[i].start <= t + 0.5) idx = i;
  return idx;
}
function chapterJump(dir) {
  if (P.live) return;
  var t = absTime(),
    ch = chapterList();
  if (!ch.length) {
    seekTo(t + dir * 300);
    toast(dir > 0 ? "+5 Minuten" : "−5 Minuten", 1200);
    return;
  }
  var i = currentChapter(t);
  var target;
  if (dir > 0) target = ch[i + 1];else target = i >= 0 && t - ch[i].start > 3 ? ch[i] : ch[Math.max(0, i - 1)];
  if (!target) return;
  seekTo(target.start);
  var n = ch.indexOf(target) + 1;
  toast("Kapitel ".concat(n).concat(target.title && !/^chapter\s*\d+$/i.test(target.title) ? ": " + target.title : ""), 1800);
}
$("#p-chprev").onclick = function () {
  chapterJump(-1);
  wake();
};
$("#p-chnext").onclick = function () {
  chapterJump(1);
  wake();
};

/* AirPlay (Safari auf iPhone/iPad/Mac) */
if (window.WebKitPlaybackTargetAvailabilityEvent) {
  video.addEventListener("webkitplaybacktargetavailabilitychanged", function (e) {
    $("#p-airplay").hidden = e.availability !== "available";
  });
  $("#p-airplay").onclick = function () {
    try {
      video.webkitShowPlaybackTargetPicker();
    } catch (_) {}
  };
}

/* Live */
function openLive(i) {
  musicPause();
  var c = CHANNELS[i];
  P.live = c;
  P.item = null;
  P.session = null;
  $("#player").classList.add("live");
  $("#player").hidden = false;
  $("#p-title").textContent = c.name;
  $("#p-sub").textContent = "Live";
  $("#p-next").hidden = true;
  $("#p-info").textContent = "";
  history.pushState({
    player: true
  }, "");
  document.body.style.overflow = "hidden";
  showSpinner(true);
  var viaProxy = function viaProxy() {
    $("#p-info").textContent = "über Server";
    attach(c.proxy, 0, true, function () {
      toast("Sender gerade nicht erreichbar");
      showSpinner(false);
    });
  };
  attach(c.url, 0, true, viaProxy);
  wake();
  $("#p-play").focus();
  sleepStart(+(localStorage.getItem("sleepMin") || 0));
}

/* Bedienelemente */
function updateBar(forced) {
  var cur = forced !== null && forced !== void 0 ? forced : absTime(),
    dur = P.duration || 0;
  var ci = currentChapter(cur),
    ch = chapterList();
  $("#p-chapter").textContent = ci >= 0 && ch.length ? "Kapitel ".concat(ci + 1, "/").concat(ch.length) : "";
  $("#p-cur").textContent = fmtTime(cur);
  $("#p-dur").textContent = fmtTime(dur);
  var pct = dur ? cur / dur * 100 : 0;
  $("#p-fill").style.width = pct + "%";
  $("#p-knob").style.left = pct + "%";
  var bufEnd = 0;
  if (video.buffered.length) bufEnd = P.offset + video.buffered.end(video.buffered.length - 1);
  $("#p-buf").style.left = (P.mode === "direct" ? 0 : P.offset / dur * 100) + "%";
  $("#p-buf").style.width = dur ? Math.max(0, (bufEnd - (P.mode === "direct" ? 0 : P.offset)) / dur * 100) + "%" : "0";
}
video.addEventListener("timeupdate", function () {
  if (!P.scrubbing) updateBar();
});
video.addEventListener("waiting", function () {
  return showSpinner(true);
});
video.addEventListener("playing", function () {
  showSpinner(false);
  $("#p-play").textContent = "❚❚";
  $("#p-nextbox").hidden = true;
});
video.addEventListener("canplay", function () {
  return showSpinner(false);
});
video.addEventListener("pause", function () {
  $("#p-play").textContent = "▶";
  wake();
});
video.addEventListener("ended", function () {
  if (P.live) return;
  // Bei Umwandlung kann "ended" auch das Ende des bisher Umgewandelten sein
  if (P.mode === "hls" && absTime() < P.duration - 30) return;
  saveProgress();
  wake();
  if (P.item && P.item.next) startNextCountdown();
});
function togglePlay() {
  video.paused ? safePlay(video) : video.pause();
  wake();
}
$("#p-play").onclick = togglePlay;
$("#p-back").onclick = function () {
  seekTo(absTime() - 10);
  wake();
};
$("#p-fwd").onclick = function () {
  seekTo(absTime() + 30);
  wake();
};
$("#p-close").onclick = function () {
  return closePlayer();
};
$("#p-fs").onclick = function () {
  return document.fullscreenElement ? document.exitFullscreen() : $("#player").requestFullscreen ? $("#player").requestFullscreen() : video.webkitEnterFullscreen && video.webkitEnterFullscreen();
};
$("#p-audio").onchange = function (e) {
  P.audio = +e.target.value;
  localStorage.setItem("audioLang", P.item.audio[P.audio].lang || "");
  startStream(absTime());
};
$("#p-quality").onchange = function (e) {
  P.quality = e.target.value;
  localStorage.setItem("quality", P.quality);
  startStream(absTime());
};
/* Bild-in-Bild: Film läuft im kleinen Fenster weiter, während man andere Apps nutzt */
var pipStd = function pipStd() {
  return !!(document.pictureInPictureEnabled && video.requestPictureInPicture);
};
var pipWebkit = function pipWebkit() {
  return !!(video.webkitSupportsPresentationMode && video.webkitSupportsPresentationMode("picture-in-picture"));
};
var pipActive = function pipActive() {
  return !!(document.pictureInPictureElement || video.webkitPresentationMode === "picture-in-picture");
};
try {
  video.autoPictureInPicture = true;
} catch (_) {}
$("#p-pip").hidden = !(pipStd() || pipWebkit());
$("#p-pip").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
  var _t5;
  return _regenerator().w(function (_context7) {
    while (1) switch (_context7.p = _context7.n) {
      case 0:
        _context7.p = 0;
        if (!pipActive()) {
          _context7.n = 4;
          break;
        }
        if (!(document.exitPictureInPicture && document.pictureInPictureElement)) {
          _context7.n = 2;
          break;
        }
        _context7.n = 1;
        return document.exitPictureInPicture();
      case 1:
        _context7.n = 3;
        break;
      case 2:
        video.webkitSetPresentationMode("inline");
      case 3:
        _context7.n = 6;
        break;
      case 4:
        if (!pipWebkit()) {
          _context7.n = 5;
          break;
        }
        video.webkitSetPresentationMode("picture-in-picture");
        _context7.n = 6;
        break;
      case 5:
        _context7.n = 6;
        return video.requestPictureInPicture();
      case 6:
        _context7.n = 8;
        break;
      case 7:
        _context7.p = 7;
        _t5 = _context7.v;
        toast("Bild-in-Bild geht hier nicht: " + _t5.message, 4000);
      case 8:
        return _context7.a(2);
    }
  }, _callee7, null, [[0, 7]]);
}));
function exitPip() {
  try {
    if (document.pictureInPictureElement && document.exitPictureInPicture) document.exitPictureInPicture();else if (video.webkitPresentationMode === "picture-in-picture") video.webkitSetPresentationMode("inline");
  } catch (_) {}
}
$("#p-next").onclick = function () {
  return playNext();
};
$("#p-cast").onclick = function () {
  if (!P.item) return;
  var id = P.item.id,
    t = absTime(),
    a = P.audio;
  closePlayer();
  setTimeout(function () {
    return castPicker(id, t, a);
  }, 300);
};
$("#p-nextnow").onclick = function () {
  return playNext();
};
$("#p-nextcancel").onclick = function () {
  clearInterval(P.nextTimer);
  $("#p-nextbox").hidden = true;
};

/* Kein automatisches Weiterspielen mehr: Am Folgenende wird nur gefragt. Der Player bleibt offen,
   damit man nach dem Einschlafen zurückspulen und weiterschauen kann. */
function startNextCountdown() {
  clearInterval(P.nextTimer);
  var n = P.item.next;
  $("#p-nexthead").innerHTML = n.auto ? "<b>Teil zu Ende.</b> Weiter mit:" : "<b>Folge zu Ende.</b> Als Nächstes:";
  $("#p-nexttitle").textContent = n.title;
  $("#p-nextbox").hidden = false;
  $("#p-nextnow").focus();
  $("#player").classList.remove("idle");
  if (n.auto) {
    // nächster Teil desselben Films: nach 10 Sekunden von allein weiter
    var left = 10;
    $("#p-nexttitle").textContent = "".concat(n.title, " \u2013 startet in ").concat(left, " s");
    P.nextTimer = setInterval(function () {
      left--;
      if (left <= 0) {
        clearInterval(P.nextTimer);
        playNext();
        return;
      }
      $("#p-nexttitle").textContent = "".concat(n.title, " \u2013 startet in ").concat(left, " s");
    }, 1000);
  }
}
function playNext() {
  return _playNext.apply(this, arguments);
}
function _playNext() {
  _playNext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47() {
    var next;
    return _regenerator().w(function (_context47) {
      while (1) switch (_context47.n) {
        case 0:
          clearInterval(P.nextTimer);
          next = P.item && P.item.next;
          if (next) {
            _context47.n = 1;
            break;
          }
          return _context47.a(2);
        case 1:
          saveProgress();
          clearInterval(P.saveTimer);
          clearInterval(P.pingTimer);
          if (P.session) {
            api("/api/hls/".concat(P.session), {
              method: "DELETE"
            }).catch(function () {});
            P.session = null;
          }
          history.replaceState({
            player: true
          }, "");
          history.back();
          setTimeout(function () {
            return openPlayer(next.id, 0, null);
          }, 50);
        case 2:
          return _context47.a(2);
      }
    }, _callee47);
  }));
  return _playNext.apply(this, arguments);
}
/* Suchleiste per Maus/Touch */
(function () {
  var bar = $("#p-seek");
  var tAt = function tAt(x) {
    var r = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (x - r.left) / r.width)) * (P.duration || 0);
  };
  var px = function px(e) {
    return e.touches && e.touches[0] ? e.touches[0].clientX : e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : e.clientX;
  };
  var drag = false,
    lastX = 0;
  var down = function down(e) {
    drag = true;
    lastX = px(e);
    if (e.pointerId !== undefined && bar.setPointerCapture) bar.setPointerCapture(e.pointerId);
    updateBar(tAt(lastX));
    wake();
  };
  var move = function move(e) {
    var x = px(e);
    var h = $("#p-hover");
    var r = bar.getBoundingClientRect();
    h.style.display = "block";
    h.style.left = Math.max(90, Math.min(r.width - 90, x - r.left)) + "px";
    var tt = tAt(x);
    if (!h.firstChild || h.firstChild.tagName !== "IMG") h.innerHTML = '<img alt=""><span></span>';
    h.lastChild.textContent = fmtTime(tt);
    if (P.item && !P.live) framePreview(P.item.id, tt, function (url) {
      if (h.style.display === "block") h.firstChild.src = url;
    });
    if (drag) {
      lastX = x;
      updateBar(tAt(x));
    }
  };
  var up = function up(e) {
    if (drag) {
      drag = false;
      var x = px(e);
      seekTo(tAt(x === undefined ? lastX : x));
    }
  };
  if (window.PointerEvent) {
    bar.addEventListener("pointerdown", down);
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  } else {
    bar.addEventListener("mousedown", down);
    document.addEventListener("mousemove", function (e) {
      if (drag) move(e);
    });
    document.addEventListener("mouseup", up);
    bar.addEventListener("touchstart", down);
    bar.addEventListener("touchmove", move);
    bar.addEventListener("touchend", up);
  }
  bar.addEventListener("mouseleave", function () {
    return $("#p-hover").style.display = "none";
  });
})();

/* Wischen im Player: wie bei der Fernbedienung – waagerecht wischen spult, Standbild und Balken laufen mit,
   beim Loslassen wird gesprungen. Kurz = Sekunden, weit = Minuten. Senkrecht wird ignoriert. */
(function () {
  var ui = $("#p-ui"),
    box = $("#p-scrub"),
    img = box.querySelector("img"),
    flash = $("#p-flash");
  var sx = null,
    sy = null,
    start = 0,
    target = 0,
    moved = false,
    scrubbing = false;
  var dur = function dur() {
    return P.duration || 0;
  };
  var delta = function delta(dx) {
    var u = Math.max(-1, Math.min(1, dx / ((ui.clientWidth || 400) * 0.8)));
    var a = Math.abs(u);
    return Math.sign(u) * (a * 60 + Math.pow(a, 3) * Math.max(0, dur() * 0.5));
  };
  var skip = function skip(el) {
    return el && el.closest && el.closest(".p-top, .p-bottom, #p-nextbox");
  };
  var show = function show() {
    var d = target - start,
      sign = d >= 0 ? "+" : "−";
    flash.innerHTML = "".concat(fmtTime(target), "<small>").concat(sign).concat(fmtTime(Math.abs(d)), "</small>");
    box.classList.add("on");
    updateBar(target);
    if (P.item) framePreview(P.item.id, target, function (url) {
      if (scrubbing) {
        img.src = url;
        img.style.visibility = "visible";
      }
    });
  };
  var begin = function begin(x, y, el) {
    if (P.live || !P.item || skip(el)) {
      sx = null;
      return;
    }
    sx = x;
    sy = y;
    moved = false;
    start = target = absTime();
  };
  var move = function move(x, y) {
    if (sx === null) return false;
    var dx = x - sx,
      dy = y - sy;
    if (!moved && Math.abs(dx) < 15) return false;
    if (!moved && Math.abs(dy) > Math.abs(dx)) {
      sx = null;
      return false;
    }
    if (!moved) {
      moved = scrubbing = P.scrubbing = true;
      img.style.visibility = "hidden";
    }
    target = Math.max(0, Math.min(dur() - 5 || 1e9, start + delta(dx)));
    show();
    wake();
    return true;
  };
  var end = function end() {
    if (sx === null) return;
    sx = null;
    if (!moved) return;
    scrubbing = P.scrubbing = false;
    clearTimeout(framePreview._t);
    setTimeout(function () {
      return box.classList.remove("on");
    }, 500);
    if (Math.abs(target - start) >= 3) seekTo(target);else updateBar();
  };
  ui.addEventListener("touchstart", function (e) {
    return begin(e.touches[0].clientX, e.touches[0].clientY, e.target);
  }, {
    passive: true
  });
  ui.addEventListener("touchmove", function (e) {
    if (move(e.touches[0].clientX, e.touches[0].clientY) && e.cancelable) e.preventDefault();
  }, {
    passive: false
  });
  ui.addEventListener("touchend", end);
  ui.addEventListener("touchcancel", end);
  var lastTouch = 0;
  ui.addEventListener("touchstart", function () {
    lastTouch = Date.now();
  }, {
    passive: true,
    capture: true
  });
  ui.addEventListener("mousedown", function (e) {
    if (e.button === 0 && Date.now() - lastTouch > 1000) begin(e.clientX, e.clientY, e.target);
  });
  document.addEventListener("mousemove", function (e) {
    if (sx !== null) move(e.clientX, e.clientY);
  });
  document.addEventListener("mouseup", function () {
    if (sx !== null) end();
  });
})();

/* Bedienleiste ausblenden */
var idleT;
function wake() {
  $("#player").classList.remove("idle");
  clearTimeout(idleT);
  idleT = setTimeout(function () {
    if (!video.paused && $("#p-nextbox").hidden) $("#player").classList.add("idle");
  }, 4000);
}
["mousemove", "touchstart", "click"].forEach(function (ev) {
  return $("#player").addEventListener(ev, wake, {
    passive: true
  });
});
video.addEventListener("click", togglePlay);
video.addEventListener("dblclick", function () {
  return $("#p-fs").click();
});

/* ---------------------------------------------------------------- Auf Fernseher abspielen (Handy als Fernbedienung) */

var CAST = {
  device: null,
  deviceName: "",
  item: null,
  timer: null,
  saveTick: 0,
  st: null,
  seeking: false
};
try {
  var c = JSON.parse(localStorage.getItem("cast") || "null");
  if (c) Object.assign(CAST, c);
} catch (_) {}
function castSave() {
  try {
    localStorage.setItem("cast", JSON.stringify({
      device: CAST.device,
      deviceName: CAST.deviceName,
      item: CAST.item
    }));
  } catch (_) {}
}
function castPicker(_x17, _x18, _x19) {
  return _castPicker.apply(this, arguments);
}
function _castPicker() {
  _castPicker = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49(itemId, startPos, audio) {
    var load;
    return _regenerator().w(function (_context49) {
      while (1) switch (_context49.n) {
        case 0:
          modal("<h2>\uD83D\uDCFA Auf Fernseher abspielen</h2><p class=\"muted\" id=\"cpst\">Suche Fernseher im Heimnetz \u2026</p><div id=\"cpl\"></div>\n    <p class=\"muted small\">Der Fernseher muss eingeschaltet und im selben Netz sein.</p>\n    <div class=\"row\" style=\"margin-top:12px\"><button class=\"btn f\" id=\"cpre\">Erneut suchen</button><button class=\"btn f\" onclick=\"closeModal()\">Abbrechen</button></div>");
          load = /*#__PURE__*/function () {
            var _load = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48() {
              var list, last, _t18;
              return _regenerator().w(function (_context48) {
                while (1) switch (_context48.p = _context48.n) {
                  case 0:
                    $("#cpst").textContent = "Suche Fernseher im Heimnetz …";
                    $("#cpl").innerHTML = "";
                    _context48.p = 1;
                    _context48.n = 2;
                    return api("/api/cast/devices");
                  case 2:
                    list = _context48.v;
                    $("#cpst").textContent = list.length ? "Gerät auswählen:" : "Kein Fernseher gefunden. Ist er eingeschaltet?";
                    last = localStorage.getItem("castLast");
                    list.sort(function (a, b) {
                      return (b.id === last) - (a.id === last);
                    });
                    $("#cpl").innerHTML = list.map(function (d) {
                      return "<div class=\"ep f\" tabindex=\"0\" data-id=\"".concat(esc(d.id), "\" data-name=\"").concat(esc(d.name), "\">\n        <div style=\"font-size:30px;padding:0 6px\">\uD83D\uDCFA</div><div><div>").concat(esc(d.name)).concat(d.id === last ? ' <span class="muted small">(zuletzt)</span>' : "", "</div>\n        <div class=\"muted small\">").concat(esc(d.model || ""), " \xB7 ").concat(esc(d.ip), "</div></div></div>");
                    }).join("");
                    $$("#cpl .ep").forEach(function (el) {
                      return el.onclick = function () {
                        return castStart(el.dataset.id, el.dataset.name, itemId, startPos, audio);
                      };
                    });
                    _context48.n = 4;
                    break;
                  case 3:
                    _context48.p = 3;
                    _t18 = _context48.v;
                    $("#cpst").textContent = _t18.message;
                  case 4:
                    return _context48.a(2);
                }
              }, _callee48, null, [[1, 3]]);
            }));
            function load() {
              return _load.apply(this, arguments);
            }
            return load;
          }();
          $("#cpre").onclick = load;
          load();
        case 1:
          return _context49.a(2);
      }
    }, _callee49);
  }));
  return _castPicker.apply(this, arguments);
}
function castStart(_x20, _x21, _x22, _x23, _x24) {
  return _castStart.apply(this, arguments);
}
function _castStart() {
  _castStart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50(device, name, itemId, startPos, audio) {
    var body, r, _t19;
    return _regenerator().w(function (_context50) {
      while (1) switch (_context50.p = _context50.n) {
        case 0:
          $("#cpst").textContent = "Starte auf ".concat(name, " \u2026");
          $("#cpl").innerHTML = '<div class="spinner" style="position:relative;left:auto;top:auto;margin:20px auto"></div>';
          _context50.p = 1;
          body = {
            device: device,
            item_id: itemId,
            start: Math.floor(startPos || 0)
          };
          if (audio !== null && audio !== undefined) body.audio = audio;
          _context50.n = 2;
          return api("/api/cast/start", {
            method: "POST",
            body: body
          });
        case 2:
          r = _context50.v;
          localStorage.setItem("castLast", device);
          CAST.device = device;
          CAST.deviceName = name;
          _context50.n = 3;
          return api("/api/item/".concat(itemId));
        case 3:
          CAST.item = _context50.v;
          castSave();
          closeModal();
          if (r.mode === "transcode") toast("Wird für den Fernseher umgewandelt – der Start dauert ein paar Sekunden", 4000);
          openRemote();
          _context50.n = 5;
          break;
        case 4:
          _context50.p = 4;
          _t19 = _context50.v;
          $("#cpst").textContent = "Fehler: " + _t19.message;
          $("#cpl").innerHTML = "";
        case 5:
          return _context50.a(2);
      }
    }, _callee50, null, [[1, 4]]);
  }));
  return _castStart.apply(this, arguments);
}
function openRemote() {
  if (!CAST.device || !CAST.item) return;
  var it = CAST.item;
  $("#remote").hidden = false;
  $("#castbar").hidden = true;
  document.body.style.overflow = "hidden";
  var cover = it.poster ? imgUrl(it.poster) : thumbUrl(it.id);
  $("#r-cover").style.backgroundImage = "url('".concat(cover, "')");
  $("#r-bg").style.backgroundImage = "url('".concat(it.backdrop ? imgUrl(it.backdrop) : cover, "')");
  $("#r-title").textContent = it.title;
  $("#r-sub").textContent = it.series ? "".concat(it.series.name, " \xB7 S").concat(it.season, "E").concat(it.episode) : it.year || "";
  $("#r-dev").textContent = "📺 " + CAST.deviceName;
  var ch = it.chapters || [],
    dur = it.duration || 0;
  $("#r-marks").innerHTML = dur ? ch.filter(function (c) {
    return c.start > 1;
  }).map(function (c) {
    return "<i style=\"left:".concat(c.start / dur * 100, "%\"></i>");
  }).join("") : "";
  $("#r-next").hidden = true;
  castPollStart();
}
function closeRemote() {
  $("#remote").hidden = true;
  document.body.style.overflow = "";
  castBar();
}
function castBar() {
  var on = CAST.device && CAST.item && CAST.st && ["PLAYING", "PAUSED_PLAYBACK", "TRANSITIONING"].indexOf(CAST.st.state) >= 0;
  $("#castbar").hidden = !on || !$("#remote").hidden;
  if (on) {
    $("#cb-text").textContent = "\uD83D\uDCFA ".concat(CAST.deviceName, ": ").concat(CAST.item.title);
    $("#cb-play").textContent = CAST.st.state === "PLAYING" ? "❚❚" : "▶";
  }
}
function castPollStart() {
  clearInterval(CAST.timer);
  var tick = /*#__PURE__*/function () {
    var _tick = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var st, _t6;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            if (CAST.device) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2);
          case 1:
            _context8.p = 1;
            _context8.n = 2;
            return api("/api/cast/status?device=".concat(encodeURIComponent(CAST.device)));
          case 2:
            st = _context8.v;
            CAST.st = st;
            if (!(st.foreign || !st.item_id && st.state !== "PLAYING")) {
              _context8.n = 3;
              break;
            }
            if (!st.foreign) {
              _context8.n = 3;
              break;
            }
            castEnd();
            return _context8.a(2);
          case 3:
            castUpdate(st);
            CAST.idle = st.state === "STOPPED" || st.state === "NO_MEDIA_PRESENT" ? (CAST.idle || 0) + 1 : 0;
            if (!(CAST.idle > 15 && $("#remote").hidden)) {
              _context8.n = 4;
              break;
            }
            castEnd();
            return _context8.a(2);
          case 4:
            if (st.state === "PLAYING" && ++CAST.saveTick % 5 === 0 && CAST.item) {
              api("/api/progress", {
                method: "POST",
                body: {
                  item_id: CAST.item.id,
                  position: st.position,
                  duration: st.duration || CAST.item.duration
                }
              }).catch(function () {});
            }
            _context8.n = 6;
            break;
          case 5:
            _context8.p = 5;
            _t6 = _context8.v;
            $("#r-state").textContent = "Fernseher antwortet nicht …";
          case 6:
            castBar();
          case 7:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 5]]);
    }));
    function tick() {
      return _tick.apply(this, arguments);
    }
    return tick;
  }();
  tick();
  CAST.timer = setInterval(tick, 2000);
}
function castUpdate(st) {
  var dur = st.duration || CAST.item && CAST.item.duration || 0;
  if (!CAST.seeking) {
    $("#r-cur").textContent = fmtTime(st.position);
    $("#r-dur").textContent = fmtTime(dur);
    var pct = dur ? Math.min(100, st.position / dur * 100) : 0;
    $("#r-fill").style.width = pct + "%";
    $("#r-knob").style.left = pct + "%";
  }
  $("#r-play").textContent = st.state === "PLAYING" ? "❚❚" : "▶";
  var names = {
    PLAYING: "läuft",
    PAUSED_PLAYBACK: "pausiert",
    STOPPED: "gestoppt",
    TRANSITIONING: "lädt …",
    NO_MEDIA_PRESENT: "kein Film"
  };
  $("#r-state").textContent = "Fernseher: " + (names[st.state] || st.state) + (st.mode === "transcode" ? " · wird umgewandelt" : " · direkt");
  if (st.volume !== null && st.volume !== undefined) {
    $("#r-volv").textContent = st.volume;
    CAST.volume = st.volume;
  }
  var it = CAST.item;
  $("#r-next").hidden = !(it && it.next && st.state === "STOPPED" && dur && st.position === 0 && CAST.lastPos > dur - 90);
  if (st.state === "PLAYING") CAST.lastPos = st.position;
}
function castCmd(_x25, _x26) {
  return _castCmd.apply(this, arguments);
}
function _castCmd() {
  _castCmd = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51(action, value) {
    var _t20;
    return _regenerator().w(function (_context51) {
      while (1) switch (_context51.p = _context51.n) {
        case 0:
          _context51.p = 0;
          _context51.n = 1;
          return api("/api/cast/control", {
            method: "POST",
            body: {
              device: CAST.device,
              action: action,
              value: value
            }
          });
        case 1:
          _context51.n = 3;
          break;
        case 2:
          _context51.p = 2;
          _t20 = _context51.v;
          toast(_t20.message, 4000);
        case 3:
          setTimeout(function () {
            return castPollStart();
          }, 400);
        case 4:
          return _context51.a(2);
      }
    }, _callee51, null, [[0, 2]]);
  }));
  return _castCmd.apply(this, arguments);
}
function castSeekBy(d) {
  var pos = (CAST.st ? CAST.st.position : 0) + d;
  castFlash(d > 0 ? "+".concat(d, " s") : "\u2212".concat(-d, " s"));
  castCmd("seek", Math.max(0, pos));
}
function castChapter(dir) {
  var it = CAST.item,
    ch = it && it.chapters || [],
    t = CAST.st ? CAST.st.position : 0;
  if (!ch.length) return castSeekBy(dir * 300);
  var i = -1;
  ch.forEach(function (c, k) {
    if (c.start <= t + 0.5) i = k;
  });
  var target = dir > 0 ? ch[i + 1] : i >= 0 && t - ch[i].start > 3 ? ch[i] : ch[Math.max(0, i - 1)];
  if (!target) return;
  castFlash("Kapitel " + (ch.indexOf(target) + 1));
  castCmd("seek", target.start);
}
function castFlash(txt) {
  var f = $("#r-flash");
  f.textContent = txt;
  f.classList.add("on");
  clearTimeout(castFlash._t);
  castFlash._t = setTimeout(function () {
    return f.classList.remove("on");
  }, 900);
}
function castEnd() {
  clearInterval(CAST.timer);
  CAST.device = null;
  CAST.item = null;
  CAST.st = null;
  castSave();
  $("#castbar").hidden = true;
  if (!$("#remote").hidden) closeRemote();
}
$("#r-close").onclick = closeRemote;
$("#r-stop").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
  var it, st;
  return _regenerator().w(function (_context9) {
    while (1) switch (_context9.n) {
      case 0:
        if (confirm("Wiedergabe auf dem Fernseher beenden?")) {
          _context9.n = 1;
          break;
        }
        return _context9.a(2);
      case 1:
        it = CAST.item, st = CAST.st;
        if (!(it && st)) {
          _context9.n = 2;
          break;
        }
        _context9.n = 2;
        return api("/api/progress", {
          method: "POST",
          body: {
            item_id: it.id,
            position: st.position,
            duration: st.duration || it.duration
          }
        }).catch(function () {});
      case 2:
        _context9.n = 3;
        return castCmd("stop");
      case 3:
        castEnd();
      case 4:
        return _context9.a(2);
    }
  }, _callee9);
}));
$("#r-play").onclick = function () {
  return castCmd(CAST.st && CAST.st.state === "PLAYING" ? "pause" : "play");
};
$("#cb-play").onclick = function () {
  return castCmd(CAST.st && CAST.st.state === "PLAYING" ? "pause" : "play");
};
$("#cb-open").onclick = openRemote;
$("#r-back").onclick = function () {
  return castSeekBy(-10);
};
$("#r-fwd").onclick = function () {
  return castSeekBy(30);
};
$("#r-chprev").onclick = function () {
  return castChapter(-1);
};
$("#r-chnext").onclick = function () {
  return castChapter(1);
};
$("#r-volup").onclick = function () {
  return castCmd("volume", Math.min(100, (CAST.volume || 0) + 2));
};
$("#r-voldn").onclick = function () {
  return castCmd("volume", Math.max(0, (CAST.volume || 0) - 2));
};
$("#r-here").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
  var it, pos;
  return _regenerator().w(function (_context0) {
    while (1) switch (_context0.n) {
      case 0:
        it = CAST.item, pos = CAST.st ? CAST.st.position : 0;
        _context0.n = 1;
        return castCmd("stop");
      case 1:
        castEnd();
        openPlayer(it.id, pos);
      case 2:
        return _context0.a(2);
    }
  }, _callee0);
}));
$("#r-next").onclick = function () {
  var n = CAST.item && CAST.item.next;
  if (n) castStart(CAST.device, CAST.deviceName, n.id, 0, null).catch(function () {});
};

/* Vorschaubild an einer Stelle (verzögert laden, damit beim Wischen nicht jedes Bild angefordert wird) */
function framePreview(itemId, t, apply) {
  clearTimeout(framePreview._t);
  framePreview._t = setTimeout(function () {
    var url = "/api/frame/".concat(itemId, "?t=").concat(Math.floor(t / 5) * 5);
    var img = new Image();
    img.onload = function () {
      return apply(url);
    };
    img.src = url;
  }, 180);
}

/* Wischen auf dem Cover: wie Spulen – Balken und Standbild laufen mit, beim Loslassen springt der Fernseher.
   Kurz = Sekunden, weit = Minuten. Antippen = Pause/Weiter. */
(function () {
  var el = $("#r-cover");
  var sx = null,
    sy = null,
    start = 0,
    target = 0,
    moved = false,
    coverUrl = "";
  var dur = function dur() {
    return CAST.st && CAST.st.duration || CAST.item && CAST.item.duration || 0;
  };
  var delta = function delta(dx) {
    var u = Math.max(-1, Math.min(1, dx / (el.clientWidth || 300)));
    var a = Math.abs(u);
    // fein am Anfang, grob am Ende: bis 1 Minute linear, darüber stark wachsend (bis ca. halbe Laufzeit)
    return Math.sign(u) * (a * 60 + Math.pow(a, 3) * Math.max(0, dur() * 0.5));
  };
  var showScrub = function showScrub() {
    var d = target - start,
      D = dur() || 1;
    var sign = d >= 0 ? "+" : "−";
    $("#r-flash").innerHTML = "".concat(fmtTime(target), "<small>").concat(sign).concat(fmtTime(Math.abs(d)), "</small>");
    $("#r-flash").classList.add("on");
    var pct = target / D * 100;
    $("#r-fill").style.width = pct + "%";
    $("#r-knob").style.left = pct + "%";
    $("#r-cur").textContent = fmtTime(target);
    if (CAST.item) framePreview(CAST.item.id, target, function (url) {
      if (CAST.seeking) el.style.backgroundImage = "url('".concat(url, "')");
    });
  };
  var begin = function begin(x, y) {
    sx = x;
    sy = y;
    moved = false;
    start = target = CAST.st ? CAST.st.position : 0;
    coverUrl = el.style.backgroundImage;
  };
  var move = function move(x, y) {
    if (sx === null) return;
    var dx = x - sx,
      dy = y - sy;
    if (!moved && Math.abs(dx) < 12) return;
    if (!moved && Math.abs(dy) > Math.abs(dx)) {
      sx = null;
      return;
    } // senkrecht = Seite scrollen
    moved = true;
    CAST.seeking = true;
    target = Math.max(0, Math.min(dur() - 5 || 1e9, start + delta(dx)));
    showScrub();
  };
  var end = function end() {
    if (sx === null) return;
    sx = null;
    if (!moved) {
      castCmd(CAST.st && CAST.st.state === "PLAYING" ? "pause" : "play");
      return;
    }
    CAST.seeking = false;
    clearTimeout(framePreview._t);
    setTimeout(function () {
      return $("#r-flash").classList.remove("on");
    }, 700);
    setTimeout(function () {
      el.style.backgroundImage = coverUrl;
    }, 2500);
    if (Math.abs(target - start) >= 3) castCmd("seek", target);
  };
  var lastTouch = 0; // nach einer Berührung schickt iOS zusätzlich Maus-Ereignisse hinterher – die ignorieren
  el.addEventListener("touchstart", function (e) {
    lastTouch = Date.now();
    begin(e.touches[0].clientX, e.touches[0].clientY);
  }, {
    passive: true
  });
  el.addEventListener("touchmove", function (e) {
    move(e.touches[0].clientX, e.touches[0].clientY);
    if (moved && e.cancelable) e.preventDefault();
  }, {
    passive: false
  });
  el.addEventListener("touchend", function (e) {
    lastTouch = Date.now();
    end();
  });
  el.addEventListener("mousedown", function (e) {
    if (Date.now() - lastTouch < 1000) return;
    begin(e.clientX, e.clientY);
    e.preventDefault();
  });
  document.addEventListener("mousemove", function (e) {
    if (sx !== null) move(e.clientX, e.clientY);
  });
  document.addEventListener("mouseup", function () {
    if (sx !== null) end();
  });
})();

/* Leiste ziehen */
(function () {
  var bar = $("#r-seek");
  var tAt = function tAt(x) {
    var r = bar.getBoundingClientRect();
    var dur = CAST.st && CAST.st.duration || CAST.item && CAST.item.duration || 0;
    return Math.max(0, Math.min(1, (x - r.left) / r.width)) * dur;
  };
  var px = function px(e) {
    return e.touches && e.touches[0] ? e.touches[0].clientX : e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : e.clientX;
  };
  var coverUrl = "";
  var show = function show(t) {
    var dur = CAST.st && CAST.st.duration || CAST.item && CAST.item.duration || 1;
    var pct = t / dur * 100;
    $("#r-fill").style.width = pct + "%";
    $("#r-knob").style.left = pct + "%";
    $("#r-cur").textContent = fmtTime(t);
    if (CAST.item) framePreview(CAST.item.id, t, function (url) {
      if (CAST.seeking) $("#r-cover").style.backgroundImage = "url('".concat(url, "')");
    });
  };
  var last = 0;
  var down = function down(e) {
    CAST.seeking = true;
    coverUrl = $("#r-cover").style.backgroundImage;
    last = tAt(px(e));
    show(last);
  };
  var move = function move(e) {
    if (CAST.seeking) {
      last = tAt(px(e));
      show(last);
    }
  };
  var up = function up() {
    if (CAST.seeking) {
      CAST.seeking = false;
      castFlash(fmtTime(last));
      castCmd("seek", last);
      setTimeout(function () {
        $("#r-cover").style.backgroundImage = coverUrl;
      }, 2500);
    }
  };
  bar.addEventListener("touchstart", down, {
    passive: true
  });
  bar.addEventListener("touchmove", move, {
    passive: true
  });
  bar.addEventListener("touchend", up);
  bar.addEventListener("mousedown", down);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
})();

/* Nach dem Neuladen: läuft noch etwas auf dem Fernseher? */
function castResume() {
  if (CAST.device && CAST.item && !REMOTE) castPollStart();
}

/* ---------------------------------------------------------------- Fernbedienung / Tastatur */

var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
  BACK: 461,
  ESC: 27,
  BACKSPACE: 8,
  PLAY: 415,
  PAUSE: 19,
  PLAYPAUSE: 179,
  STOP: 413,
  FF: 417,
  RW: 412,
  SPACE: 32
};
document.addEventListener("keydown", function (e) {
  var _document$activeEleme;
  var k = e.keyCode;
  var inInput = /INPUT|TEXTAREA|SELECT/.test(((_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 ? void 0 : _document$activeEleme.tagName) || "") && ![KEY.UP, KEY.DOWN, KEY.BACK, KEY.ESC].includes(k);
  var playerOpen = !$("#player").hidden;
  if (k === KEY.BACK || k === KEY.ESC || k === KEY.BACKSPACE && !inInput) {
    e.preventDefault();
    if (!$("#modal").hidden) {
      if (k !== KEY.BACKSPACE) closeModal();
      return;
    } // Rücktaste schließt nie ein Fenster
    if (!$("#remote").hidden) return closeRemote();
    if (playerOpen) return closePlayer();
    if (location.hash && location.hash !== "#/") history.back();
    return;
  }
  if (playerOpen) {
    var ae = document.activeElement;
    var onSeek = ae && ae.id === "p-seek";
    var idle = $("#player").classList.contains("idle");
    if ([KEY.PLAY, KEY.PAUSE, KEY.PLAYPAUSE].includes(k) || k === KEY.SPACE && !inInput) {
      e.preventDefault();
      return togglePlay();
    }
    if (k === KEY.STOP) return closePlayer();
    if (k === 33 || k === 34) {
      e.preventDefault();
      chapterJump(k === 33 ? 1 : -1);
      return wake();
    }
    if (k === KEY.FF) {
      seekTo(absTime() + 30);
      return wake();
    }
    if (k === KEY.RW) {
      seekTo(absTime() - 10);
      return wake();
    }
    if (idle && [KEY.LEFT, KEY.RIGHT].includes(k) && !P.live) {
      e.preventDefault();
      seekTo(absTime() + (k === KEY.LEFT ? -10 : 30));
      return wake();
    }
    if (idle && [KEY.UP, KEY.DOWN, KEY.ENTER].includes(k)) {
      e.preventDefault();
      wake();
      if (k === KEY.ENTER) togglePlay();
      return;
    }
    if (onSeek && [KEY.LEFT, KEY.RIGHT].includes(k)) {
      e.preventDefault();
      seekTo(absTime() + (k === KEY.LEFT ? -10 : 30));
      return wake();
    }
    wake();
  }
  if (inInput) return;
  if ([KEY.LEFT, KEY.UP, KEY.RIGHT, KEY.DOWN].includes(k)) {
    if (moveFocus(k)) e.preventDefault();
  } else if (k === KEY.ENTER) {
    var _ae = document.activeElement;
    if (_ae && _ae.classList.contains("f") && _ae.tagName !== "BUTTON" && _ae.tagName !== "A" && _ae.tagName !== "SELECT") {
      e.preventDefault();
      _ae.click();
    }
  }
});
function scrollNear(el) {
  if ("scrollBehavior" in document.documentElement.style) {
    el.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth"
    });
    return;
  }
  // Ältere Browser: waagerecht in der Reihe und senkrecht im Fenster selbst nachführen
  var strip = el.parentElement && el.parentElement.classList.contains("strip") ? el.parentElement : null;
  if (strip) {
    var _r = el.getBoundingClientRect(),
      sr = strip.getBoundingClientRect();
    if (_r.right > sr.right) strip.scrollLeft += _r.right - sr.right + 20;else if (_r.left < sr.left) strip.scrollLeft -= sr.left - _r.left + 20;
  }
  var r = el.getBoundingClientRect();
  if (r.bottom > window.innerHeight) window.scrollBy(0, r.bottom - window.innerHeight + 30);else if (r.top < 70) window.scrollBy(0, r.top - 90);
}
function moveFocus(k) {
  var root = !$("#modal").hidden ? $("#modal") : !$("#player").hidden ? $("#player") : document;
  var els = $$(".f, #modal input, #modal button", root).filter(function (el) {
    return el.offsetParent !== null && !el.disabled;
  });
  if (!els.length) return false;
  var cur = document.activeElement;
  if (!cur || !els.includes(cur)) {
    els[0].focus();
    return true;
  }
  var a = cur.getBoundingClientRect();
  var ax = a.left + a.width / 2,
    ay = a.top + a.height / 2;
  var best = null,
    bestScore = Infinity;
  var _iterator = _createForOfIteratorHelper(els),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var el = _step.value;
      if (el === cur) continue;
      var b = el.getBoundingClientRect();
      var bx = b.left + b.width / 2,
        by = b.top + b.height / 2;
      var dx = bx - ax,
        dy = by - ay;
      var main = void 0,
        cross = void 0;
      if (k === KEY.RIGHT) {
        if (b.left < a.right - 4 && dx <= 0) continue;
        main = dx;
        cross = Math.abs(dy);
      } else if (k === KEY.LEFT) {
        if (b.right > a.left + 4 && dx >= 0) continue;
        main = -dx;
        cross = Math.abs(dy);
      } else if (k === KEY.DOWN) {
        if (b.top < a.bottom - 4 && dy <= 0) continue;
        main = dy;
        cross = Math.abs(dx);
      } else {
        if (b.bottom > a.top + 4 && dy >= 0) continue;
        main = -dy;
        cross = Math.abs(dx);
      }
      if (main <= 0) continue;
      var score = main + cross * (k === KEY.LEFT || k === KEY.RIGHT ? 3 : 0.6);
      if (score < bestScore) {
        bestScore = score;
        best = el;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (best) {
    best.focus({
      preventScroll: true
    });
    scrollNear(best);
    if (best.closest("main") && (k === KEY.UP || k === KEY.DOWN)) {
      var r = best.getBoundingClientRect();
      if (r.top < 90) window.scrollBy(0, r.top - 120);
    }
    return true;
  }
  return false;
}

/* ---------------------------------------------------------------- Einstellungen */
function viewSettings() {
  return _viewSettings.apply(this, arguments);
}
function _viewSettings() {
  _viewSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee73() {
    var _yield$Promise$all, _yield$Promise$all2, st, libs, users, chans, kinds, pending, bkShow, _netShow, moveLib, chRow, bindDel, dirty, tab, dragTr, _t24, _t25, _t26;
    return _regenerator().w(function (_context73) {
      while (1) switch (_context73.n) {
        case 0:
          if (ME.admin) {
            _context73.n = 1;
            break;
          }
          view.innerHTML = "<p>Nur für Administratoren.</p>";
          return _context73.a(2);
        case 1:
          _context73.n = 2;
          return Promise.all([api("/api/admin/settings"), api("/api/admin/libraries"), api("/api/admin/users"), api("/api/admin/channels")]);
        case 2:
          _yield$Promise$all = _context73.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 4);
          st = _yield$Promise$all2[0];
          libs = _yield$Promise$all2[1];
          users = _yield$Promise$all2[2];
          chans = _yield$Promise$all2[3];
          kinds = {
            filme: "Filme",
            serien: "Serien",
            sonstiges: "Sonstiges (ohne Filminfos)",
            musik: "Musik"
          };
          pending = [];
          users.forEach(function (u) {
            return u.devices.forEach(function (d) {
              if (!d.approved) pending.push(_objectSpread(_objectSpread({}, d), {}, {
                user: u.name
              }));
            });
          });
          _t24 = "<h1>Einstellungen</h1>\n  ".concat(pending.length ? "<div class=\"panel warn\"><h2>Ger\xE4te warten auf Freigabe</h2>\n    <table>".concat(pending.map(function (d) {
            return "<tr><td><b>".concat(esc(d.user), "</b></td><td>").concat(esc(d.name), "</td><td class=\"small muted\">").concat(new Date(d.created * 1000).toLocaleString("de-DE")).concat(d.ip ? " · " + esc(d.ip) : "", "</td>\n      <td class=\"acts\"><div class=\"row\"><button class=\"btn sm primary f\" data-dok=\"").concat(d.id, "\">Freigeben</button><button class=\"btn sm danger f\" data-ddel=\"").concat(d.id, "\">Ablehnen</button></div></td></tr>");
          }).join(""), "</table></div>") : "", "\n  <div class=\"panel\"><h2>Bibliotheken</h2>\n    <table><tr><th>Name</th><th>Ordner</th><th>Art</th><th>Eintr\xE4ge</th><th></th></tr>\n    ").concat(libs.map(function (l) {
            return "<tr><td>".concat(esc(l.name), "</td><td class=\"small\">").concat(l.paths.map(esc).join("<br>"), "</td><td>").concat(kinds[l.kind]).concat(l.admin_only ? '<br><span class="small muted">🔒 nur Admins</span>' : "").concat(l.nav_end ? '<br><span class="small muted">↘ im Menü ganz hinten</span>' : "").concat(l.kind === "musik" ? '<br><span class="small muted">erscheint unter „Musik“</span>' : "", "</td><td>").concat(l.n, "</td>\n      <td class=\"acts\"><div class=\"row\"><button class=\"btn sm f\" data-lup=\"").concat(l.id, "\" title=\"Im Men\xFC weiter nach vorn\">\u25B2</button><button class=\"btn sm f\" data-ldn=\"").concat(l.id, "\" title=\"Im Men\xFC weiter nach hinten\">\u25BC</button><button class=\"btn sm f\" data-lscan=\"").concat(l.id, "\">Suchen</button><button class=\"btn sm f\" data-edit=\"").concat(l.id, "\">\xC4ndern</button><button class=\"btn sm danger f\" data-del=\"").concat(l.id, "\">L\xF6schen</button></div></td></tr>");
          }).join(""), "\n    </table>\n    <div class=\"row\" style=\"margin-top:14px\"><button class=\"btn primary f\" id=\"libadd\">+ Bibliothek</button>\n      <button class=\"btn f\" id=\"scan\">Alle Bibliotheken durchsuchen</button>\n      <button class=\"btn f\" id=\"rescanmeta\">Fehlende Filminfos neu holen</button></div>\n    <div id=\"scanstat\" class=\"small muted\" style=\"margin-top:10px\"></div>\n  </div>\n\n  <div class=\"panel\"><h2>Sicherung</h2>\n    <p class=\"small muted\">Jede Nacht (ab 3:30 Uhr) werden Datenbank (Filminfos, Gesehen-Markierungen, Playlisten, Benutzer, Einstellungen) und Bilder auf die NAS gesichert. Es entsteht ein Unterordner \u201E_Mediathek-Sicherung\u201C; die Mediathek zeigt ihn nicht an. Darin steht auch, wie man zur\xFCckholt.</p>\n    <div class=\"row\"><input id=\"bkdir\" class=\"f\" style=\"flex:1\" placeholder=\"z. B. /media/Filme\"><button class=\"btn f\" id=\"bkbrowse\">Durchsuchen</button></div>\n    <div id=\"bkbr\"></div>\n    <div class=\"row\" style=\"margin-top:8px\"><label class=\"small\">St\xE4nde aufheben: <input id=\"bkkeep\" class=\"f\" style=\"width:70px\" inputmode=\"numeric\"></label>\n      <button class=\"btn primary f\" id=\"bksave\">Speichern</button><button class=\"btn f\" id=\"bknow\">Jetzt sichern</button></div>\n    <div class=\"small muted\" id=\"bkstat\" style=\"margin-top:8px\"></div></div>\n\n  <div class=\"panel\"><h2>Musik-Bilder</h2>\n    <p class=\"small muted\">Fehlende Albumcover und Fotos der Interpreten werden automatisch bei Deezer gesucht (nach jedem Einlesen der Musik nur f\xFCr Neues). Falsche Bilder kannst du am Album bzw. in \u201EInterpreten\u201C mit \u2715 entfernen.</p>\n    <div class=\"row\"><button class=\"btn f\" id=\"netfetch\">Jetzt suchen</button><span class=\"small muted\" id=\"netstat\"></span></div></div>\n\n  <div class=\"panel\"><h2>Filminfos (TheMovieDB)</h2>\n    <p class=\"small muted\">Cover, Beschreibungen und Erscheinungsjahr. Kostenloser Schl\xFCssel: themoviedb.org \u2192 Einstellungen \u2192 API. Sowohl \u201EAPI-Schl\xFCssel\u201C als auch \u201ELesezugriffs-Token\u201C funktionieren.</p>\n    <div class=\"row\"><input id=\"tmdb\" class=\"f\" style=\"flex:1\" placeholder=\"").concat(st.tmdb_key_set ? "Gespeichert (" + esc(st.tmdb_key_hint) + ") – zum Ändern neu eingeben" : "Schlüssel einfügen", "\">\n    <button class=\"btn primary f\" id=\"tmdbsave\">Speichern & testen</button></div>\n    <label>OMDb-Schl\xFCssel (f\xFCr die Handsuche in IMDb-Daten, kostenlos auf omdbapi.com)</label>\n    <div class=\"row\"><input id=\"omdb\" class=\"f\" style=\"flex:1\" placeholder=\"").concat(st.omdb_key_set ? "Gespeichert (" + esc(st.omdb_key_hint) + ") – zum Ändern neu eingeben" : "optional", "\">\n    <button class=\"btn f\" id=\"omdbsave\">Speichern & testen</button></div>\n    <label>DeepL-Schl\xFCssel (optional, f\xFCr bessere \xDCbersetzungen \u2013 kostenlos auf deepl.com/pro-api, \u201EDeepL API Free\u201C). Ohne Schl\xFCssel wird kostenlos \xFCber MyMemory \xFCbersetzt.</label>\n    <div class=\"row\"><input id=\"deepl\" class=\"f\" style=\"flex:1\" placeholder=\"").concat(st.deepl_key_set ? "Gespeichert (" + esc(st.deepl_key_hint) + ") – zum Ändern neu eingeben" : "optional", "\">\n    <button class=\"btn f\" id=\"deeplsave\">Speichern & testen</button></div>\n    <p class=\"small muted\">Wikipedia und TVmaze brauchen keinen Schl\xFCssel.</p></div>\n\n  <div class=\"panel\"><h2>Umwandlung</h2>\n    <div class=\"row\"><select id=\"hw\" class=\"f\"><option value=\"auto\">Automatisch</option><option value=\"vaapi\">Intel-Grafik (VAAPI)</option><option value=\"cpu\">Nur Prozessor</option></select>\n    <span class=\"muted small\">Aktiv: ").concat(st.hw_active === "vaapi" ? "Intel-Grafik" : "Prozessor", "</span></div>\n    <div id=\"sess\" class=\"small muted\" style=\"margin-top:10px\"></div></div>\n\n  <div class=\"panel\"><h2>Fernseher (Auf Fernseher abspielen)</h2>\n    <p class=\"small muted\">Fernseher werden im Heimnetz automatisch gefunden. Falls deiner nicht auftaucht, trag hier seine IP-Adresse ein (mehrere mit Komma).</p>\n    <div class=\"row\"><input id=\"tvips\" class=\"f\" style=\"flex:1\" placeholder=\"z. B. 192.168.7.30\" value=\"").concat(esc(st.tv_ips || ""), "\">\n    <button class=\"btn f\" id=\"tvsave\">Speichern</button></div></div>\n\n  <div class=\"panel\"><h2>Benutzer</h2>\n    <table><tr><th>Name</th><th>Rolle</th><th>Bibliotheken</th><th>Alter</th><th>Ger\xE4te</th><th></th></tr>\n    ").concat(users.map(function (u) {
            return "<tr><td>".concat(esc(u.name)).concat(!u.pw_set ? ' <span class="muted small">(Passwort noch nicht vergeben)</span>' : "", "</td><td>").concat(u.is_admin ? "Administrator" : "Zuschauer", "</td>\n      <td class=\"small\">").concat(u.libraries ? libs.filter(function (l) {
              return u.libraries.includes(l.id);
            }).map(function (l) {
              return esc(l.name);
            }).join(", ") || "keine" : "alle", "</td>\n      <td>").concat(u.max_fsk !== null ? "bis FSK " + u.max_fsk : "–").concat(!u.is_admin && !u.allow_sat ? '<br><span class="muted small">kein 📡</span>' : "", "</td>\n      <td class=\"small\">").concat(u.devices.filter(function (d) {
              return d.approved;
            }).length).concat(u.devices.some(function (d) {
              return !d.approved;
            }) ? ' <b style="color:var(--acc)">+ wartend</b>' : "").concat(u.need_device ? "" : ' <span class="muted">(ohne Freigabe)</span>', "</td>\n      <td class=\"acts\"><div class=\"row\"><button class=\"btn sm f\" data-uedit=\"").concat(u.id, "\">\xC4ndern</button>").concat(u.name !== ME.name ? "<button class=\"btn sm danger f\" data-udel=\"".concat(u.id, "\">L\xF6schen</button>") : "", "</div></td></tr>");
          }).join(""), "\n    </table><div class=\"row\" style=\"margin-top:14px\"><button class=\"btn primary f\" id=\"uadd\">+ Benutzer</button></div></div>\n\n  <div class=\"panel\"><h2>Live-TV-Sender</h2>\n    <p class=\"small muted\">Name, Gruppe und Stream-Adresse (.m3u8). Reihenfolge = Anzeige \u2013 mit \u25B2 \u25BC verschieben oder am \u2630 ziehen, danach \u201ESender speichern\u201C.</p>\n    <table class=\"chan-edit\" id=\"chtab\"><tr><th></th><th>Name</th><th>Gruppe</th><th>Adresse</th><th title=\"\xDCber Satellit (begrenzte Empf\xE4nger)\">\uD83D\uDCE1</th><th></th></tr></table>\n    <div class=\"row\" style=\"margin-top:14px\"><button class=\"btn f\" id=\"chadd\">+ Sender</button><button class=\"btn primary f\" id=\"chsave\">Sender speichern</button></div></div>\n  <p class=\"muted small\">").concat(APP_NAME, " ");
          _t25 = _t24.concat;
          _t26 = esc;
          _context73.n = 3;
          return api("/api/status");
        case 3:
          view.innerHTML = _t25.call(_t24, _t26(_context73.v.version), "</p>");
          bkShow = /*#__PURE__*/function () {
            var _bkShow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52(d) {
              var _t21;
              return _regenerator().w(function (_context52) {
                while (1) switch (_context52.n) {
                  case 0:
                    _t21 = d;
                    if (_t21) {
                      _context52.n = 2;
                      break;
                    }
                    _context52.n = 1;
                    return api("/api/admin/backup");
                  case 1:
                    _t21 = _context52.v;
                  case 2:
                    d = _t21;
                    $("#bkdir").value = d.dir || "";
                    $("#bkkeep").value = d.keep;
                    $("#bkstat").textContent = d.running ? "Sicherung läuft …" : d.result || (d.dir ? "Noch keine Sicherung" : "Noch kein Sicherungsordner eingestellt – Sicherung ist aus.");
                  case 3:
                    return _context52.a(2);
                }
              }, _callee52);
            }));
            function bkShow(_x32) {
              return _bkShow.apply(this, arguments);
            }
            return bkShow;
          }();
          bkShow();
          $("#bkbrowse").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54() {
            var _show;
            return _regenerator().w(function (_context54) {
              while (1) switch (_context54.n) {
                case 0:
                  _show = /*#__PURE__*/function () {
                    var _show2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53(p) {
                      var d;
                      return _regenerator().w(function (_context53) {
                        while (1) switch (_context53.n) {
                          case 0:
                            _context53.n = 1;
                            return api("/api/admin/browse?path=".concat(encodeURIComponent(p)));
                          case 1:
                            d = _context53.v;
                            $("#bkdir").value = d.path;
                            $("#bkbr").innerHTML = "<div class=\"browse\">".concat(d.parent && d.path !== "/" ? "<div class=\"f\" tabindex=\"0\" data-p=\"".concat(esc(d.parent), "\">\u2B06 eine Ebene h\xF6her</div>") : "", "\n        ").concat(d.dirs.map(function (x) {
                              return "<div class=\"f\" tabindex=\"0\" data-p=\"".concat(esc(d.path.replace(/\/$/, "") + "/" + x), "\">\uD83D\uDCC1 ").concat(esc(x), "</div>");
                            }).join("") || '<div class="muted">keine Unterordner</div>', "</div>");
                            $$("#bkbr [data-p]").forEach(function (el) {
                              return el.onclick = function () {
                                return _show(el.dataset.p);
                              };
                            });
                          case 2:
                            return _context53.a(2);
                        }
                      }, _callee53);
                    }));
                    function show(_x33) {
                      return _show2.apply(this, arguments);
                    }
                    return show;
                  }();
                  _show($("#bkdir").value || "/media");
                case 1:
                  return _context54.a(2);
              }
            }, _callee54);
          }));
          $("#bksave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55() {
            var _d, _t22;
            return _regenerator().w(function (_context55) {
              while (1) switch (_context55.p = _context55.n) {
                case 0:
                  _context55.p = 0;
                  _context55.n = 1;
                  return api("/api/admin/backup", {
                    method: "POST",
                    body: {
                      dir: $("#bkdir").value,
                      keep: +$("#bkkeep").value || 14
                    }
                  });
                case 1:
                  _d = _context55.v;
                  $("#bkbr").innerHTML = "";
                  bkShow(_d);
                  toast(_d.dir ? "Gespeichert – Sicherung ist an" : "Sicherung ausgeschaltet");
                  _context55.n = 3;
                  break;
                case 2:
                  _context55.p = 2;
                  _t22 = _context55.v;
                  toast(_t22.message, 5000);
                case 3:
                  return _context55.a(2);
              }
            }, _callee55, null, [[0, 2]]);
          }));
          $("#bknow").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee56() {
            var _d2, _t23;
            return _regenerator().w(function (_context56) {
              while (1) switch (_context56.p = _context56.n) {
                case 0:
                  $("#bkstat").textContent = "Sicherung läuft …";
                  _context56.p = 1;
                  _context56.n = 2;
                  return api("/api/admin/backup", {
                    method: "POST",
                    body: {
                      now: 1
                    }
                  });
                case 2:
                  _d2 = _context56.v;
                  bkShow(_d2);
                  toast(_d2.message, 4000);
                  _context56.n = 4;
                  break;
                case 3:
                  _context56.p = 3;
                  _t23 = _context56.v;
                  toast(_t23.message, 5000);
                  bkShow();
                case 4:
                  return _context56.a(2);
              }
            }, _callee56, null, [[1, 3]]);
          }));
          _netShow = /*#__PURE__*/function () {
            var _netShow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee57() {
              var n;
              return _regenerator().w(function (_context57) {
                while (1) switch (_context57.n) {
                  case 0:
                    if ($("#netstat")) {
                      _context57.n = 1;
                      break;
                    }
                    return _context57.a(2);
                  case 1:
                    _context57.n = 2;
                    return api("/api/admin/music/images");
                  case 2:
                    n = _context57.v;
                    $("#netstat").textContent = n.running ? "l\xE4uft \u2026 ".concat(n.done, " von ").concat(n.total, " gepr\xFCft \xB7 ").concat(n.covers, " Cover, ").concat(n.artists, " Interpretenbilder gefunden") : n.total ? "Zuletzt: ".concat(n.covers, " Cover und ").concat(n.artists, " Interpretenbilder gefunden") : "";
                    if (n.running) setTimeout(_netShow, 3000);
                  case 3:
                    return _context57.a(2);
                }
              }, _callee57);
            }));
            function netShow() {
              return _netShow2.apply(this, arguments);
            }
            return netShow;
          }();
          _netShow();
          $("#netfetch").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee58() {
            return _regenerator().w(function (_context58) {
              while (1) switch (_context58.n) {
                case 0:
                  _context58.n = 1;
                  return api("/api/admin/music/images", {
                    method: "POST",
                    body: {
                      action: "fetch"
                    }
                  });
                case 1:
                  toast("Suche gestartet");
                  setTimeout(_netShow, 800);
                case 2:
                  return _context58.a(2);
              }
            }, _callee58);
          }));
          $("#hw").value = st.hw;
          $("#hw").onchange = /*#__PURE__*/function () {
            var _ref28 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee59(e) {
              return _regenerator().w(function (_context59) {
                while (1) switch (_context59.n) {
                  case 0:
                    _context59.n = 1;
                    return api("/api/admin/settings", {
                      method: "POST",
                      body: {
                        hw: e.target.value
                      }
                    });
                  case 1:
                    toast("Gespeichert");
                    viewSettings();
                  case 2:
                    return _context59.a(2);
                }
              }, _callee59);
            }));
            return function (_x34) {
              return _ref28.apply(this, arguments);
            };
          }();
          $("#tvsave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee60() {
            return _regenerator().w(function (_context60) {
              while (1) switch (_context60.n) {
                case 0:
                  _context60.n = 1;
                  return api("/api/admin/settings", {
                    method: "POST",
                    body: {
                      tv_ips: $("#tvips").value
                    }
                  });
                case 1:
                  toast("Gespeichert");
                case 2:
                  return _context60.a(2);
              }
            }, _callee60);
          }));
          $("#deeplsave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee61() {
            var v, r;
            return _regenerator().w(function (_context61) {
              while (1) switch (_context61.n) {
                case 0:
                  v = $("#deepl").value.trim();
                  if (v) {
                    _context61.n = 1;
                    break;
                  }
                  return _context61.a(2);
                case 1:
                  _context61.n = 2;
                  return api("/api/admin/settings", {
                    method: "POST",
                    body: {
                      deepl_key: v
                    }
                  });
                case 2:
                  r = _context61.v;
                  toast(r.deepl_ok ? "DeepL-Schlüssel funktioniert ✓" : "DeepL-Schlüssel funktioniert nicht ✗ " + (r.deepl_err || ""), 5000);
                  $("#deepl").value = "";
                case 3:
                  return _context61.a(2);
              }
            }, _callee61);
          }));
          $("#omdbsave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee62() {
            var v, r;
            return _regenerator().w(function (_context62) {
              while (1) switch (_context62.n) {
                case 0:
                  v = $("#omdb").value.trim();
                  if (v) {
                    _context62.n = 1;
                    break;
                  }
                  return _context62.a(2);
                case 1:
                  _context62.n = 2;
                  return api("/api/admin/settings", {
                    method: "POST",
                    body: {
                      omdb_key: v
                    }
                  });
                case 2:
                  r = _context62.v;
                  toast(r.omdb_ok ? "OMDb-Schlüssel funktioniert ✓" : "OMDb-Schlüssel funktioniert nicht ✗ (Bestätigungs-Mail schon angeklickt?)", 5000);
                  viewSettings();
                case 3:
                  return _context62.a(2);
              }
            }, _callee62);
          }));
          $("#tmdbsave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee63() {
            var v, r;
            return _regenerator().w(function (_context63) {
              while (1) switch (_context63.n) {
                case 0:
                  v = $("#tmdb").value.trim();
                  if (v) {
                    _context63.n = 1;
                    break;
                  }
                  return _context63.a(2);
                case 1:
                  _context63.n = 2;
                  return api("/api/admin/settings", {
                    method: "POST",
                    body: {
                      tmdb_key: v
                    }
                  });
                case 2:
                  r = _context63.v;
                  toast(r.tmdb_ok ? "Schlüssel funktioniert ✓ – Filminfos werden geladen" : "Schlüssel funktioniert nicht ✗", 5000);
                  if (!r.tmdb_ok) {
                    _context63.n = 3;
                    break;
                  }
                  _context63.n = 3;
                  return api("/api/admin/scan", {
                    method: "POST",
                    body: {
                      refresh_meta: true
                    }
                  });
                case 3:
                  viewSettings();
                case 4:
                  return _context63.a(2);
              }
            }, _callee63);
          }));
          $("#libadd").onclick = function () {
            return libDialog(null);
          };
          $$("[data-edit]").forEach(function (b) {
            return b.onclick = function () {
              return libDialog(libs.find(function (l) {
                return l.id === +b.dataset.edit;
              }));
            };
          });
          moveLib = /*#__PURE__*/function () {
            var _moveLib = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee64(id, dir) {
              var ids, i, j, _ref33;
              return _regenerator().w(function (_context64) {
                while (1) switch (_context64.n) {
                  case 0:
                    ids = libs.map(function (l) {
                      return l.id;
                    }), i = ids.indexOf(id), j = i + dir;
                    if (!(j < 0 || j >= ids.length)) {
                      _context64.n = 1;
                      break;
                    }
                    return _context64.a(2);
                  case 1:
                    _ref33 = [ids[j], ids[i]];
                    ids[i] = _ref33[0];
                    ids[j] = _ref33[1];
                    _context64.n = 2;
                    return api("/api/admin/libraries/order", {
                      method: "POST",
                      body: {
                        ids: ids
                      }
                    });
                  case 2:
                    _context64.n = 3;
                    return loadNav();
                  case 3:
                    viewSettings();
                  case 4:
                    return _context64.a(2);
                }
              }, _callee64);
            }));
            function moveLib(_x35, _x36) {
              return _moveLib.apply(this, arguments);
            }
            return moveLib;
          }();
          $$("[data-lup]").forEach(function (b) {
            return b.onclick = function () {
              return moveLib(+b.dataset.lup, -1);
            };
          });
          $$("[data-ldn]").forEach(function (b) {
            return b.onclick = function () {
              return moveLib(+b.dataset.ldn, 1);
            };
          });
          $$("[data-del]").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee65() {
              return _regenerator().w(function (_context65) {
                while (1) switch (_context65.n) {
                  case 0:
                    if (confirm("Bibliothek entfernen? Die Videos selbst bleiben unberührt.")) {
                      _context65.n = 1;
                      break;
                    }
                    return _context65.a(2);
                  case 1:
                    _context65.n = 2;
                    return api("/api/admin/libraries/".concat(b.dataset.del), {
                      method: "DELETE"
                    });
                  case 2:
                    _context65.n = 3;
                    return loadNav();
                  case 3:
                    viewSettings();
                  case 4:
                    return _context65.a(2);
                }
              }, _callee65);
            }));
          });
          $("#scan").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee66() {
            return _regenerator().w(function (_context66) {
              while (1) switch (_context66.n) {
                case 0:
                  _context66.n = 1;
                  return api("/api/admin/scan", {
                    method: "POST",
                    body: {}
                  });
                case 1:
                  pollScan();
                case 2:
                  return _context66.a(2);
              }
            }, _callee66);
          }));
          $$("[data-lscan]").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee67() {
              return _regenerator().w(function (_context67) {
                while (1) switch (_context67.n) {
                  case 0:
                    _context67.n = 1;
                    return api("/api/admin/scan", {
                      method: "POST",
                      body: {
                        library_id: +b.dataset.lscan
                      }
                    });
                  case 1:
                    pollScan();
                  case 2:
                    return _context67.a(2);
                }
              }, _callee67);
            }));
          });
          $("#rescanmeta").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee68() {
            return _regenerator().w(function (_context68) {
              while (1) switch (_context68.n) {
                case 0:
                  _context68.n = 1;
                  return api("/api/admin/scan", {
                    method: "POST",
                    body: {
                      refresh_meta: true
                    }
                  });
                case 1:
                  pollScan();
                case 2:
                  return _context68.a(2);
              }
            }, _callee68);
          }));
          $("#uadd").onclick = function () {
            return userDialog(null, libs);
          };
          $$("[data-dok]").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee69() {
              return _regenerator().w(function (_context69) {
                while (1) switch (_context69.n) {
                  case 0:
                    _context69.n = 1;
                    return api("/api/admin/devices/".concat(b.dataset.dok), {
                      method: "POST",
                      body: {
                        approved: true
                      }
                    });
                  case 1:
                    toast("Gerät freigegeben");
                    refreshMe();
                    viewSettings();
                  case 2:
                    return _context69.a(2);
                }
              }, _callee69);
            }));
          });
          $$("[data-ddel]").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee70() {
              return _regenerator().w(function (_context70) {
                while (1) switch (_context70.n) {
                  case 0:
                    _context70.n = 1;
                    return api("/api/admin/devices/".concat(b.dataset.ddel), {
                      method: "DELETE"
                    });
                  case 1:
                    toast("Gerät abgelehnt");
                    refreshMe();
                    viewSettings();
                  case 2:
                    return _context70.a(2);
                }
              }, _callee70);
            }));
          });
          $$("[data-uedit]").forEach(function (b) {
            return b.onclick = function () {
              return userDialog(users.find(function (u) {
                return u.id === +b.dataset.uedit;
              }), libs);
            };
          });
          $$("[data-udel]").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee71() {
              return _regenerator().w(function (_context71) {
                while (1) switch (_context71.n) {
                  case 0:
                    if (!confirm("Benutzer löschen?")) {
                      _context71.n = 2;
                      break;
                    }
                    _context71.n = 1;
                    return api("/api/admin/users/".concat(b.dataset.udel), {
                      method: "DELETE"
                    });
                  case 1:
                    viewSettings();
                  case 2:
                    return _context71.a(2);
                }
              }, _callee71);
            }));
          });
          chRow = function chRow(c) {
            return "<tr><td class=\"chmove\"><span class=\"chdrag\" draggable=\"true\" title=\"Ziehen zum Verschieben\">\u2630</span><button class=\"btn sm f chup\" title=\"Nach oben\">\u25B2</button><button class=\"btn sm f chdn\" title=\"Nach unten\">\u25BC</button></td><td><input class=\"f\" value=\"".concat(esc(c.name), "\"></td><td><input class=\"f\" value=\"").concat(esc(c.group), "\"></td><td><input class=\"f\" value=\"").concat(esc(c.url), "\"></td>\n    <td><input type=\"checkbox\" class=\"chsat\" ").concat(c.sat ? "checked" : "", "></td>\n    <td><button class=\"btn sm danger f\">\u2715</button></td></tr>");
          };
          $("#chtab").insertAdjacentHTML("beforeend", chans.map(chRow).join(""));
          bindDel = function bindDel() {
            return $$("#chtab .danger").forEach(function (b) {
              return b.onclick = function () {
                b.closest("tr").remove();
                dirty();
              };
            });
          };
          bindDel();
          dirty = function dirty() {
            return $("#chsave").classList.add("pulse");
          };
          tab = $("#chtab");
          tab.addEventListener("click", function (e) {
            var b = e.target.closest(".chup, .chdn");
            if (!b) return;
            var tr = b.closest("tr");
            if (b.classList.contains("chup")) {
              var p = tr.previousElementSibling;
              if (p && p.querySelector("td")) tr.parentNode.insertBefore(tr, p);
            } else {
              var n = tr.nextElementSibling;
              if (n) tr.parentNode.insertBefore(n, tr);
            }
            tr.classList.add("moved");
            setTimeout(function () {
              return tr.classList.remove("moved");
            }, 600);
            b.focus();
            dirty();
          });
          dragTr = null;
          tab.addEventListener("dragstart", function (e) {
            var h = e.target.closest && e.target.closest(".chdrag");
            if (!h) return;
            dragTr = h.closest("tr");
            dragTr.classList.add("dragging");
            try {
              e.dataTransfer.setData("text/plain", "");
              e.dataTransfer.effectAllowed = "move";
            } catch (_) {}
          });
          tab.addEventListener("dragover", function (e) {
            if (!dragTr) return;
            e.preventDefault();
            var tr = e.target.closest("tr");
            if (!tr || tr === dragTr || !tr.querySelector("td")) return;
            var r = tr.getBoundingClientRect();
            tr.parentNode.insertBefore(dragTr, e.clientY < r.top + r.height / 2 ? tr : tr.nextSibling);
          });
          tab.addEventListener("dragend", function () {
            if (dragTr) {
              dragTr.classList.remove("dragging");
              dragTr = null;
              dirty();
            }
          });
          $("#chadd").onclick = function () {
            $("#chtab").insertAdjacentHTML("beforeend", chRow({
              name: "",
              group: "",
              url: ""
            }));
            bindDel();
          };
          $("#chsave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee72() {
            var rows;
            return _regenerator().w(function (_context72) {
              while (1) switch (_context72.n) {
                case 0:
                  rows = $$("#chtab tr").filter(function (tr) {
                    return tr.querySelector("td");
                  }).map(function (tr) {
                    var i = $$("input", tr);
                    return {
                      name: i[0].value,
                      group: i[1].value,
                      url: i[2].value,
                      sat: i[3].checked
                    };
                  });
                  _context72.n = 1;
                  return api("/api/admin/channels", {
                    method: "PUT",
                    body: rows
                  });
                case 1:
                  toast("Sender gespeichert");
                  $("#chsave").classList.remove("pulse");
                case 2:
                  return _context72.a(2);
              }
            }, _callee72);
          }));
          pollScan(true);
          api("/api/admin/sessions").then(function (s) {
            $("#sess").textContent = s.length ? "Laufend: " + s.map(function (x) {
              return "".concat(x.title, " (").concat(x.quality, ", ").concat(x.mode, ")");
            }).join("; ") : "Keine laufende Umwandlung.";
          });
        case 4:
          return _context73.a(2);
      }
    }, _callee73);
  }));
  return _viewSettings.apply(this, arguments);
}
function pollScan() {
  return _pollScan.apply(this, arguments);
}
function _pollScan() {
  _pollScan = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee74() {
    var once,
      el,
      s,
      pct,
      walk,
      _args74 = arguments;
    return _regenerator().w(function (_context74) {
      while (1) switch (_context74.n) {
        case 0:
          once = _args74.length > 0 && _args74[0] !== undefined ? _args74[0] : false;
          el = $("#scanstat");
          if (el) {
            _context74.n = 1;
            break;
          }
          return _context74.a(2);
        case 1:
          _context74.n = 2;
          return api("/api/admin/scan");
        case 2:
          s = _context74.v;
          if (s.running) {
            pct = s.total ? Math.round(s.done / s.total * 100) : null;
            walk = s.phase === "Ordner durchgehen";
            el.innerHTML = "<b>".concat(esc(s.target || ""), "</b> \u2013 ").concat(esc(s.phase), " \u2026 ").concat(walk ? "".concat(s.checked.toLocaleString("de-DE"), " Dateien gepr\xFCft, ").concat(s.new, " neu oder ge\xE4ndert") : s.total ? "".concat(s.done, " von ").concat(s.total) : "").concat(pct !== null && !walk ? "<div class=\"bar\"><i style=\"width:".concat(pct, "%\"></i></div>") : "");
            setTimeout(function () {
              return pollScan();
            }, 1500);
          } else {
            el.textContent = s.last ? "Letzter Suchlauf: " + new Date(s.last * 1000).toLocaleString("de-DE") + (s.last_result ? " – " + s.last_result : "") : "";
            if (!once) {
              loadNav();
            }
          }
        case 3:
          return _context74.a(2);
      }
    }, _callee74);
  }));
  return _pollScan.apply(this, arguments);
}
function libDialog(lib) {
  var paths = lib ? lib.paths.slice() : [];
  modal("<h2>".concat(lib ? "Bibliothek ändern" : "Neue Bibliothek", "</h2>\n    <label>Name (so erscheint sie oben im Men\xFC)</label><input id=\"ln\" class=\"f\" style=\"width:100%\" value=\"").concat(esc((lib === null || lib === void 0 ? void 0 : lib.name) || ""), "\">\n    <label>Art</label><select id=\"lk\" class=\"f\" style=\"width:100%\">\n      <option value=\"filme\">Filme \u2013 mit Cover, FSK & Infos von TheMovieDB</option>\n      <option value=\"serien\">Serien \u2013 Ordner = Serie, darin Staffeln und Folgen</option>\n      <option value=\"sonstiges\">Sonstiges \u2013 Konzerte, Privatvideos usw., mit Vorschaubild</option>\n      <option value=\"musik\">Musik \u2013 MP3-Ordner (Cover aus den Dateien), erscheint unter \u201EMusik\u201C</option></select>\n    <label class=\"chk\"><input type=\"checkbox\" id=\"ladm\" ").concat(lib !== null && lib !== void 0 && lib.admin_only ? "checked" : "", "> Nur f\xFCr Administratoren sichtbar</label>\n    <label class=\"chk\"><input type=\"checkbox\" id=\"lend\" ").concat(lib !== null && lib !== void 0 && lib.nav_end ? "checked" : "", "> Im Men\xFC ganz hinten (nach \u201ERadio\u201C)</label>\n    <label>Ordner dieser Bibliothek</label><div id=\"lpaths\"></div>\n    <div class=\"row\" style=\"margin-top:8px\"><input id=\"lp\" class=\"f\" style=\"flex:1\" value=\"/media\"><button class=\"btn f\" id=\"lbrowse\">Durchsuchen</button><button class=\"btn f\" id=\"laddp\">+ Ordner hinzuf\xFCgen</button></div>\n    <div id=\"lbr\"></div>\n    <div class=\"err\" id=\"lerr\"></div>\n    <div class=\"row\" style=\"margin-top:16px\"><button class=\"btn primary f\" id=\"lsave\">Speichern</button><button class=\"btn f\" onclick=\"closeModal()\">Abbrechen</button></div>"));
  $("#lk").value = (lib === null || lib === void 0 ? void 0 : lib.kind) || "filme";
  var _drawPaths = function drawPaths() {
    $("#lpaths").innerHTML = paths.length ? paths.map(function (p, i) {
      return "<div class=\"pathrow\"><span>\uD83D\uDCC1 ".concat(esc(p), "</span><button class=\"btn sm danger f\" data-rm=\"").concat(i, "\">entfernen</button></div>");
    }).join("") : '<p class="muted small">Noch kein Ordner – unten auswählen und „+ Ordner hinzufügen“.</p>';
    $$("#lpaths [data-rm]").forEach(function (b) {
      return b.onclick = function () {
        paths.splice(+b.dataset.rm, 1);
        _drawPaths();
      };
    });
  };
  _drawPaths();
  var _browse = /*#__PURE__*/function () {
    var _browse2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(p) {
      var d, _t7;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            _context1.p = 0;
            _context1.n = 1;
            return api("/api/admin/browse?path=".concat(encodeURIComponent(p)));
          case 1:
            d = _context1.v;
            $("#lp").value = d.path;
            $("#lbr").innerHTML = "<div class=\"browse\">".concat(d.parent && d.path !== "/" ? "<div class=\"f\" tabindex=\"0\" data-p=\"".concat(esc(d.parent), "\">\u2B06 eine Ebene h\xF6her</div>") : "", "\n        ").concat(d.dirs.map(function (x) {
              return "<div class=\"f\" tabindex=\"0\" data-p=\"".concat(esc(d.path.replace(/\/$/, "") + "/" + x), "\">\uD83D\uDCC1 ").concat(esc(x), "</div>");
            }).join("") || '<div class="muted">keine Unterordner</div>', "</div>");
            $$("#lbr [data-p]").forEach(function (el) {
              return el.onclick = function () {
                return _browse(el.dataset.p);
              };
            });
            _context1.n = 3;
            break;
          case 2:
            _context1.p = 2;
            _t7 = _context1.v;
            $("#lerr").textContent = _t7.message;
          case 3:
            return _context1.a(2);
        }
      }, _callee1, null, [[0, 2]]);
    }));
    function browse(_x27) {
      return _browse2.apply(this, arguments);
    }
    return browse;
  }();
  $("#lbrowse").onclick = function () {
    return _browse($("#lp").value);
  };
  $("#laddp").onclick = function () {
    var p = $("#lp").value.trim().replace(/\/$/, "");
    if (p && paths.indexOf(p) < 0) paths.push(p);
    $("#lbr").innerHTML = "";
    _drawPaths();
  };
  $("#lsave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
    var pend, _t8;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          pend = $("#lp").value.trim().replace(/\/$/, "");
          if (!paths.length && pend && pend !== "/media") paths.push(pend);
          _context10.p = 1;
          _context10.n = 2;
          return api("/api/admin/libraries", {
            method: "POST",
            body: {
              id: lib === null || lib === void 0 ? void 0 : lib.id,
              name: $("#ln").value,
              kind: $("#lk").value,
              paths: paths,
              admin_only: $("#ladm").checked,
              nav_end: $("#lend").checked
            }
          });
        case 2:
          closeModal();
          toast("Gespeichert – Suchlauf gestartet");
          _context10.n = 3;
          return loadNav();
        case 3:
          viewSettings();
          _context10.n = 5;
          break;
        case 4:
          _context10.p = 4;
          _t8 = _context10.v;
          $("#lerr").textContent = _t8.message;
        case 5:
          return _context10.a(2);
      }
    }, _callee10, null, [[1, 4]]);
  }));
}
function userDialog(u, libs) {
  var isNew = !u;
  modal("<h2>".concat(u ? "Benutzer ändern" : "Neuer Benutzer", "</h2>\n    <label>Name</label><input id=\"un\" class=\"f\" style=\"width:100%\" value=\"").concat(esc((u === null || u === void 0 ? void 0 : u.name) || ""), "\" autocapitalize=\"none\">\n    <label>").concat(u ? "Neues Passwort (leer lassen = unverändert)" : "Passwort – leer lassen, dann legt der Benutzer es bei der ersten Anmeldung selbst fest", "</label>\n    <input id=\"up\" class=\"f\" type=\"password\" style=\"width:100%\" autocomplete=\"new-password\">\n    ").concat(u && u.pw_set ? "<div class=\"row\" style=\"margin-top:6px\"><button class=\"btn sm f\" id=\"ureset\">Passwort zur\xFCcksetzen (Benutzer legt neues fest)</button></div>" : "", "\n    <label>Rolle</label><select id=\"ua\" class=\"f\"><option value=\"0\">Zuschauer</option><option value=\"1\">Administrator (darf Einstellungen \xE4ndern)</option></select>\n    <label>Altersfreigabe</label><select id=\"ufsk\" class=\"f\">\n      <option value=\"\">keine Beschr\xE4nkung</option><option value=\"0\">bis FSK 0</option><option value=\"6\">bis FSK 6</option>\n      <option value=\"12\">bis FSK 12</option><option value=\"16\">bis FSK 16</option></select>\n    <p class=\"muted small\">Mit Beschr\xE4nkung sieht der Benutzer nur Titel mit passender FSK-Angabe \u2013 Titel ohne Angabe (z. B. \u201ESonstiges\u201C) bleiben verborgen.</p>\n    <label><input type=\"checkbox\" id=\"usat\" ").concat(!u || u.allow_sat ? "checked" : "", "> Darf Satellitenfernsehen sehen (Sender mit \uD83D\uDCE1 \u2013 begrenzte Empf\xE4nger)</label>\n    <label id=\"udevl\"><input type=\"checkbox\" id=\"udev\" ").concat(isNew || u.need_device ? "checked" : "", "> Ger\xE4tefreigabe: neue Ger\xE4te muss ein Administrator freigeben (das erste Ger\xE4t wird automatisch freigeschaltet)</label>\n    <label>Bibliotheken</label>\n    <label><input type=\"checkbox\" id=\"uall\" ").concat(!u || !u.libraries ? "checked" : "", "> alle (auch k\xFCnftige)</label>\n    <div id=\"ulibs\">").concat(libs.map(function (l) {
    var _u$libraries;
    return "<label><input type=\"checkbox\" value=\"".concat(l.id, "\" ").concat(u !== null && u !== void 0 && (_u$libraries = u.libraries) !== null && _u$libraries !== void 0 && _u$libraries.includes(l.id) ? "checked" : "", "> ").concat(esc(l.name), "</label>");
  }).join(""), "</div>\n    ").concat(u && u.devices.length ? "<label>Ger\xE4te</label><table class=\"small\">".concat(u.devices.map(function (d) {
    return "<tr><td>".concat(esc(d.name), "</td>\n      <td class=\"muted\">").concat(d.last_seen ? "zuletzt " + new Date(d.last_seen * 1000).toLocaleDateString("de-DE") : "", "</td>\n      <td>").concat(d.approved ? '<span style="color:var(--ok)">freigegeben</span>' : '<b style="color:var(--acc)">wartet</b>', "</td>\n      <td class=\"acts\"><div class=\"row\">").concat(d.approved ? "<button class=\"btn sm f\" data-dlock=\"".concat(d.id, "\">Sperren</button>") : "<button class=\"btn sm primary f\" data-dok2=\"".concat(d.id, "\">Freigeben</button>"), "<button class=\"btn sm danger f\" data-drm=\"").concat(d.id, "\">Entfernen</button></div></td></tr>");
  }).join(""), "</table>") : "", "\n    <div class=\"err\" id=\"uerr\"></div>\n    <div class=\"row\" style=\"margin-top:16px\"><button class=\"btn primary f\" id=\"usave\">Speichern</button><button class=\"btn f\" onclick=\"closeModal()\">Abbrechen</button></div>"));
  $("#ua").value = u !== null && u !== void 0 && u.is_admin ? "1" : "0";
  $("#ufsk").value = u && u.max_fsk !== null && u.max_fsk !== undefined ? String(u.max_fsk) : "";
  var sync = function sync() {
    $("#ulibs").style.opacity = $("#uall").checked ? 0.4 : 1;
    $("#udevl").style.display = $("#ua").value === "1" ? "none" : "";
  };
  $("#uall").onchange = sync;
  $("#ua").onchange = sync;
  sync();
  var reopen = /*#__PURE__*/function () {
    var _reopen = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      var all;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            _context11.n = 1;
            return api("/api/admin/users");
          case 1:
            all = _context11.v;
            userDialog(all.find(function (x) {
              return x.id === u.id;
            }), libs);
            refreshMe();
          case 2:
            return _context11.a(2);
        }
      }, _callee11);
    }));
    function reopen() {
      return _reopen.apply(this, arguments);
    }
    return reopen;
  }();
  $$("[data-dok2]").forEach(function (b) {
    return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            _context12.n = 1;
            return api("/api/admin/devices/".concat(b.dataset.dok2), {
              method: "POST",
              body: {
                approved: true
              }
            });
          case 1:
            reopen();
          case 2:
            return _context12.a(2);
        }
      }, _callee12);
    }));
  });
  $$("[data-dlock]").forEach(function (b) {
    return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            _context13.n = 1;
            return api("/api/admin/devices/".concat(b.dataset.dlock), {
              method: "POST",
              body: {
                approved: false
              }
            });
          case 1:
            reopen();
          case 2:
            return _context13.a(2);
        }
      }, _callee13);
    }));
  });
  $$("[data-drm]").forEach(function (b) {
    return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            if (!confirm("Gerät entfernen?")) {
              _context14.n = 2;
              break;
            }
            _context14.n = 1;
            return api("/api/admin/devices/".concat(b.dataset.drm), {
              method: "DELETE"
            });
          case 1:
            reopen();
          case 2:
            return _context14.a(2);
        }
      }, _callee14);
    }));
  });
  if ($("#ureset")) $("#ureset").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          if (confirm("Passwort von ".concat(u.name, " zur\xFCcksetzen? Bei der n\xE4chsten Anmeldung legt ").concat(u.name, " ein neues fest."))) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2);
        case 1:
          _context15.n = 2;
          return save({
            reset_password: true
          });
        case 2:
          return _context15.a(2);
      }
    }, _callee15);
  }));
  var save = /*#__PURE__*/function () {
    var _save = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
      var extra,
        libsSel,
        _args16 = arguments,
        _t9;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.p = _context16.n) {
          case 0:
            extra = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : {};
            libsSel = $("#uall").checked ? null : $$("#ulibs input:checked").map(function (i) {
              return +i.value;
            });
            _context16.p = 1;
            _context16.n = 2;
            return api("/api/admin/users", {
              method: "POST",
              body: _objectSpread({
                id: u === null || u === void 0 ? void 0 : u.id,
                name: $("#un").value,
                password: $("#up").value,
                is_admin: $("#ua").value === "1",
                libraries: libsSel,
                max_fsk: $("#ufsk").value === "" ? null : +$("#ufsk").value,
                need_device: $("#udev").checked,
                allow_sat: $("#usat").checked
              }, extra)
            });
          case 2:
            closeModal();
            toast("Gespeichert");
            viewSettings();
            _context16.n = 4;
            break;
          case 3:
            _context16.p = 3;
            _t9 = _context16.v;
            $("#uerr").textContent = _t9.message;
          case 4:
            return _context16.a(2);
        }
      }, _callee16, null, [[1, 3]]);
    }));
    function save() {
      return _save.apply(this, arguments);
    }
    return save;
  }();
  $("#usave").onclick = function () {
    return save();
  };
}
function refreshMe() {
  return _refreshMe.apply(this, arguments);
}
function _refreshMe() {
  _refreshMe = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee75() {
    var st, _t27;
    return _regenerator().w(function (_context75) {
      while (1) switch (_context75.p = _context75.n) {
        case 0:
          _context75.p = 0;
          _context75.n = 1;
          return api("/api/status");
        case 1:
          st = _context75.v;
          if (st.user) {
            ME = st.user;
            $("#nav-settings").innerHTML = "⚙" + (ME.pending_devices ? "<span class=\"badge\">".concat(ME.pending_devices, "</span>") : "");
          }
          _context75.n = 3;
          break;
        case 2:
          _context75.p = 2;
          _t27 = _context75.v;
        case 3:
          return _context75.a(2);
      }
    }, _callee75, null, [[0, 2]]);
  }));
  return _refreshMe.apply(this, arguments);
}
/* ---------------------------------------------------------------- Mein Konto */
function viewAccount() {
  return _viewAccount.apply(this, arguments);
}
function _viewAccount() {
  _viewAccount = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee78() {
    var devs, pr, savePrefs;
    return _regenerator().w(function (_context78) {
      while (1) switch (_context78.n) {
        case 0:
          _context78.n = 1;
          return api("/api/me/devices");
        case 1:
          devs = _context78.v;
          pr = ME.prefs || {};
          view.innerHTML = "<h1>Mein Konto</h1>\n  <div class=\"panel\"><h2>".concat(esc(ME.name), "</h2>\n    <p class=\"muted\">").concat(ME.admin ? "Administrator" : "Zuschauer").concat(ME.max_fsk !== null && ME.max_fsk !== undefined ? " \xB7 freigegeben bis FSK ".concat(ME.max_fsk) : "", "</p></div>\n  <div class=\"panel\"><h2>Wiedergabe</h2>\n    <label>Bevorzugte Tonspur</label><select id=\"pa\" class=\"f\"><option value=\"de\">Deutsch</option><option value=\"en\">Englisch</option><option value=\"original\">Originalton (erste Spur)</option></select>\n    <label>Qualit\xE4t</label><select id=\"pq\" class=\"f\">\n      <option value=\"original\">Original \u2013 zu Hause im Heimnetz</option><option value=\"hoch\">Hoch (1080p)</option>\n      <option value=\"mittel\">Mittel (720p) \u2013 gut f\xFCr unterwegs</option><option value=\"niedrig\">Niedrig (480p) \u2013 schwaches Netz</option></select>\n    <label>Qualit\xE4t unterwegs (au\xDFerhalb des Heimnetzes)</label><select id=\"pqr\" class=\"f\">\n      <option value=\"mittel\">Mittel (720p) \u2013 empfohlen</option><option value=\"niedrig\">Niedrig (480p) \u2013 schwaches Netz</option>\n      <option value=\"hoch\">Hoch (1080p)</option><option value=\"original\">Original</option></select>\n    <p class=\"muted small\">Gilt f\xFCr alle deine Ger\xE4te. Im Player kannst du jederzeit f\xFCr den aktuellen Film umstellen.").concat(REMOTE ? " Du bist gerade <b>unterwegs</b> verbunden." : "", "</p></div>\n  <div class=\"panel\"><h2>Passwort \xE4ndern</h2>\n    <label>Bisheriges Passwort</label><input id=\"po\" class=\"f\" type=\"password\" autocomplete=\"current-password\">\n    <label>Neues Passwort (mind. 6 Zeichen)</label><input id=\"pn\" class=\"f\" type=\"password\" autocomplete=\"new-password\">\n    <label>Neues Passwort wiederholen</label><input id=\"pn2\" class=\"f\" type=\"password\" autocomplete=\"new-password\">\n    <div class=\"row\" style=\"margin-top:12px\"><button class=\"btn primary f\" id=\"psave\">Passwort \xE4ndern</button></div>\n    <div class=\"err\" id=\"perr\"></div></div>\n  <div class=\"panel\"><h2>Meine Ger\xE4te</h2>\n    <table>").concat(devs.map(function (d) {
            return "<tr><td>".concat(esc(d.name)).concat(d.current ? ' <span style="color:var(--acc)">(dieses Gerät)</span>' : "", "</td>\n      <td class=\"small muted\">").concat(d.last_seen ? "zuletzt " + new Date(d.last_seen * 1000).toLocaleString("de-DE") : "", "</td>\n      <td>").concat(d.approved ? '<span style="color:var(--ok)">freigegeben</span>' : '<b style="color:var(--acc)">wartet auf Freigabe</b>', "</td></tr>");
          }).join("") || '<tr><td class="muted">Keine Geräte gespeichert.</td></tr>', "</table></div>");
          $("#pa").value = pr.audio_lang || "de";
          $("#pq").value = pr.quality || "original";
          $("#pqr").value = pr.quality_remote || "mittel";
          savePrefs = /*#__PURE__*/function () {
            var _savePrefs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee76() {
              return _regenerator().w(function (_context76) {
                while (1) switch (_context76.n) {
                  case 0:
                    _context76.n = 1;
                    return api("/api/me/prefs", {
                      method: "POST",
                      body: {
                        audio_lang: $("#pa").value,
                        quality: $("#pq").value,
                        quality_remote: $("#pqr").value
                      }
                    });
                  case 1:
                    ME.prefs = _context76.v;
                    P.quality = REMOTE ? ME.prefs.quality_remote || "mittel" : ME.prefs.quality || "original";
                    try {
                      localStorage.setItem("quality", P.quality);
                      localStorage.removeItem("audioLang");
                    } catch (_) {}
                    toast("Gespeichert");
                  case 2:
                    return _context76.a(2);
                }
              }, _callee76);
            }));
            function savePrefs() {
              return _savePrefs.apply(this, arguments);
            }
            return savePrefs;
          }();
          $("#pa").onchange = savePrefs;
          $("#pq").onchange = savePrefs;
          $("#pqr").onchange = savePrefs;
          $("#psave").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee77() {
            var _t28;
            return _regenerator().w(function (_context77) {
              while (1) switch (_context77.p = _context77.n) {
                case 0:
                  if (!($("#pn").value !== $("#pn2").value)) {
                    _context77.n = 1;
                    break;
                  }
                  $("#perr").textContent = "Die neuen Passwörter stimmen nicht überein.";
                  return _context77.a(2);
                case 1:
                  _context77.p = 1;
                  _context77.n = 2;
                  return api("/api/me/password", {
                    method: "POST",
                    body: {
                      old: $("#po").value,
                      new: $("#pn").value
                    }
                  });
                case 2:
                  $("#perr").textContent = "";
                  $("#po").value = $("#pn").value = $("#pn2").value = "";
                  toast("Passwort geändert – andere Geräte müssen sich neu anmelden", 4000);
                  _context77.n = 4;
                  break;
                case 3:
                  _context77.p = 3;
                  _t28 = _context77.v;
                  $("#perr").textContent = _t28.message;
                case 4:
                  return _context77.a(2);
              }
            }, _callee77, null, [[1, 3]]);
          }));
        case 2:
          return _context78.a(2);
      }
    }, _callee78);
  }));
  return _viewAccount.apply(this, arguments);
}
boot().catch(function (e) {
  view.innerHTML = "<p class=\"err\">Server nicht erreichbar: ".concat(esc(e.message), "</p>");
});

/* ================================================================ Musik & Radio */

var MA = $("#maudio");
var MQ = {
  list: [],
  i: -1,
  radio: null
};
var MUS = {
  q: "",
  sort: "album",
  lib: 0,
  mode: "albums",
  artist: "",
  genre: "",
  cat: "",
  facets: null
};
var CATNAMES = {
  Musik: "🎵 Musik",
  "Hörbuch": "📖 Hörbücher",
  "Hörspiel": "🎭 Hörspiele",
  Comedy: "😄 Comedy",
  Kinder: "🧸 Kinder",
  Podcast: "🎙 Podcasts"
};
function musicCard(a) {
  return "<a class=\"card sq f\" href=\"#/album/".concat(a.id, "\" tabindex=\"0\" data-l=\"").concat(letterOf(a.album), "\">\n    <div class=\"img\">").concat(a.cover ? "<img loading=\"lazy\" src=\"".concat(imgUrl(a.cover), "\" alt=\"\" onerror=\"this.remove()\">") : "<div class=\"ph\">\u266A ".concat(esc(a.album || ""), "</div>"), "</div>\n    <div class=\"t\">").concat(esc(a.album || "Ohne Album"), "</div><div class=\"s\">").concat(esc(a.album_artist || "")).concat(a.year ? " · " + a.year : "", "</div></a>");
}
function trackRows(list, showAlbum, edit, del) {
  return "<div class=\"tracks\">".concat(list.map(function (t, i) {
    return "<div class=\"trk f\" tabindex=\"0\" data-i=\"".concat(i, "\" data-id=\"").concat(t.id, "\">\n    <span class=\"tn\">").concat(edit || !t.track ? i + 1 : t.track, "</span><span class=\"tt\">").concat(esc(t.title)).concat(showAlbum || t.artist && t.album_artist && t.artist !== t.album_artist ? "<small>".concat(esc(t.artist || "")).concat(showAlbum && t.album ? " · " + esc(t.album) : "", "</small>") : "", "</span>\n    <span class=\"td\">").concat(t.duration ? fmtTime(t.duration) : "", "</span>\n    ").concat(edit ? "<button class=\"tbtn tup\" title=\"Nach oben\">\u25B2</button><button class=\"tbtn tdn\" title=\"Nach unten\">\u25BC</button><button class=\"tbtn tdel\" title=\"Aus der Playlist entfernen\">\u2715</button>" : "<button class=\"tbtn tadd\" title=\"Zur Playlist hinzuf\xFCgen\">\uFF0B</button>".concat(del ? "<button class=\"tbtn ttrash\" title=\"Titel in den Papierkorb auf der NAS\">\uD83D\uDDD1</button>" : ""), "</div>");
  }).join(""), "</div>");
}
function bindTracks(list) {
  $$(".trk").forEach(function (el) {
    var add = el.querySelector(".tadd");
    if (add) add.onclick = function (e) {
      e.stopPropagation();
      plPicker([list[+el.dataset.i].id]);
    };
    el.onclick = function (e) {
      if (e.target.closest(".tbtn")) return;
      musicPlay(list, +el.dataset.i, "order");
    };
    el.onkeydown = function (e) {
      if (e.key === "Enter") musicPlay(list, +el.dataset.i);
    };
  });
  musicMark();
}
function viewMusic() {
  return _viewMusic.apply(this, arguments);
}
function _viewMusic() {
  _viewMusic = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee82() {
    var qs, fkey, GW, F, body, count, tracks, mq, list, pls, _d3, opt, cats, live, t;
    return _regenerator().w(function (_context82) {
      while (1) switch (_context82.n) {
        case 0:
          if (MLIBS.length) {
            _context82.n = 1;
            break;
          }
          view.innerHTML = "<h1>Musik</h1><p class=\"muted\">Noch keine Musik-Bibliothek. ".concat(ME.admin ? 'Unter <a href="#/einstellungen">Einstellungen</a> eine Bibliothek mit der Art „Musik“ anlegen und den Ordner mit den MP3s auswählen.' : "Ein Admin muss erst eine Musik-Bibliothek anlegen.", "</p>");
          return _context82.a(2);
        case 1:
          qs = function qs() {
            return "q=".concat(encodeURIComponent(MUS.q), "&lib=").concat(MUS.lib, "&artist=").concat(encodeURIComponent(MUS.artist), "&genre=").concat(encodeURIComponent(MUS.genre), "&cat=").concat(encodeURIComponent(MUS.cat));
          };
          fkey = MUS.lib + "|" + MUS.cat;
          if (!(!MUS.facets || MUS.facetsKey !== fkey)) {
            _context82.n = 3;
            break;
          }
          _context82.n = 2;
          return api("/api/music/facets?lib=".concat(MUS.lib, "&cat=").concat(encodeURIComponent(MUS.cat)));
        case 2:
          MUS.facets = _context82.v;
          MUS.facetsKey = fkey;
        case 3:
          GW = MUS.cat && MUS.cat !== "Musik" ? "Genres" : "Musikrichtungen";
          F = MUS.facets;
          body = "", count = "", tracks = null;
          if (!(MUS.mode === "artists")) {
            _context82.n = 4;
            break;
          }
          mq = MUS.q.trim().toLowerCase();
          list = F.artists.filter(function (a) {
            return !mq || a.name.toLowerCase().indexOf(mq) >= 0;
          });
          count = list.length + " Interpreten";
          body = "<div class=\"grid\">".concat(list.map(function (a, i) {
            return "<a class=\"card sq f artist\" tabindex=\"0\" data-i=\"".concat(i, "\" data-l=\"").concat(letterOf(a.name), "\">\n      <div class=\"img round\">").concat(a.cover ? "<img loading=\"lazy\" src=\"".concat(imgUrl(a.cover), "\" alt=\"\" onerror=\"this.remove()\">") : "<div class=\"ph\">".concat(esc(a.name), "</div>"), "</div>\n      ").concat(ME.admin && a.photo ? "<button class=\"ardel\" data-n=\"".concat(esc(a.name), "\" title=\"Falsches Bild? Entfernen\">\u2715</button>") : "", "\n      <div class=\"t\">").concat(esc(a.name), "</div><div class=\"s\">").concat(a.albums, " ").concat(a.albums === 1 ? "Album" : "Alben", " \xB7 ").concat(a.n, " Titel</div></a>");
          }).join("") || '<p class="muted">Nichts gefunden.</p>', "</div>");
          MUS._artists = list;
          _context82.n = 11;
          break;
        case 4:
          if (!(MUS.mode === "genres")) {
            _context82.n = 5;
            break;
          }
          count = F.genres.length + " " + GW;
          body = F.genres.length ? "<div class=\"chips big\">".concat(F.genres.map(function (g, i) {
            return "<a class=\"chip f genre\" tabindex=\"0\" data-i=\"".concat(i, "\">").concat(esc(g.name), " <small>").concat(g.n, "</small></a>");
          }).join(""), "</div>") : '<p class="muted">In den MP3s sind keine Musikrichtungen (Genre) eingetragen.</p>';
          _context82.n = 11;
          break;
        case 5:
          if (!(MUS.mode === "tracks")) {
            _context82.n = 7;
            break;
          }
          _context82.n = 6;
          return api("/api/music/tracks?".concat(qs(), "&sort=").concat(MUS.sort === "album" ? "title" : MUS.sort));
        case 6:
          tracks = _context82.v;
          count = tracks.length + " Titel";
          body = trackRows(tracks, true);
          _context82.n = 11;
          break;
        case 7:
          if (!(MUS.mode === "playlists")) {
            _context82.n = 9;
            break;
          }
          _context82.n = 8;
          return api("/api/music/playlists");
        case 8:
          pls = _context82.v;
          count = pls.length + " Playlisten";
          body = "<div class=\"grid\">".concat(pls.map(function (p) {
            return "<a class=\"card sq f\" href=\"#/playlist/".concat(p.id, "\" tabindex=\"0\">\n      <div class=\"img plimg\">").concat(p.covers.length ? p.covers.slice(0, 4).map(function (c) {
              return "<img src=\"".concat(imgUrl(c), "\" alt=\"\" onerror=\"this.remove()\">");
            }).join("") : '<div class="ph">♫</div>', "</div>\n      <div class=\"t\">").concat(esc(p.name), "</div><div class=\"s\">").concat(p.n, " Titel \xB7 ").concat(fmtDur(p.dur), "</div></a>");
          }).join(""), "\n      <a class=\"card sq f\" id=\"plnew\" tabindex=\"0\"><div class=\"img\"><div class=\"ph\" style=\"font-size:42px\">\uFF0B</div></div><div class=\"t\">Neue Playlist</div><div class=\"s\">&nbsp;</div></a></div>\n      <p class=\"muted small\">Titel f\xFCgst du mit \uFF0B hinzu \u2013 in der Titelliste, auf der Albumseite oder in der Suche.</p>");
          _context82.n = 11;
          break;
        case 9:
          _context82.n = 10;
          return api("/api/music/albums?".concat(qs(), "&sort=").concat(MUS.sort));
        case 10:
          _d3 = _context82.v;
          count = _d3.albums.length + " Alben";
          body = "<div class=\"grid\" id=\"mgrid\">".concat(_d3.albums.map(musicCard).join("") || '<p class="muted">Nichts gefunden.</p>', "</div>");
        case 11:
          opt = function opt(v, t, cur) {
            return "<option value=\"".concat(esc(v), "\"").concat(v === cur ? " selected" : "", ">").concat(esc(t), "</option>");
          };
          cats = F.cats || [];
          live = $("#mq");
          if (live && document.activeElement === live) MUS.q = live.value; // während des Ladens weitergetippt
          view.innerHTML = "<h1>Musik <small class=\"muted\">".concat(count, "</small></h1>\n    ").concat(cats.length > 1 ? "<div class=\"chips mcats\"><a class=\"chip f mcat".concat(!MUS.cat ? " on" : "", "\" data-c=\"\" tabindex=\"0\">Alles</a>").concat(cats.map(function (c) {
            return "<a class=\"chip f mcat".concat(MUS.cat === c.name ? " on" : "", "\" data-c=\"").concat(esc(c.name), "\" tabindex=\"0\">").concat(CATNAMES[c.name] || esc(c.name), " <small>").concat(c.albums, "</small></a>");
          }).join(""), "</div>") : "", "\n    <div class=\"mtabs\">").concat([["albums", "Alben"], ["artists", "Interpreten"], ["genres", GW], ["tracks", "Titel"], ["playlists", "Playlisten"]].map(function (_ref43) {
            var _ref44 = _slicedToArray(_ref43, 2),
              m = _ref44[0],
              t = _ref44[1];
            return "<button class=\"btn f mtab".concat(MUS.mode === m ? " on" : "", "\" data-m=\"").concat(m, "\">").concat(t, "</button>");
          }).join(""), "\n      <button class=\"btn primary f\" id=\"mshuf\" title=\"Alle Titel der aktuellen Auswahl zuf\xE4llig abspielen\">\uD83D\uDD00 Zufallswiedergabe</button>\n      <button class=\"btn f rcbtn").concat(RC.armed ? " on" : "", "\" title=\"Fernsteuerung, z. B. aus Home Assistant\">\uD83D\uDE97 Fernsteuerung").concat(RC.armed ? " an" : "", "</button></div>\n    <div class=\"toolbar\"><input id=\"mq\" type=\"search\" class=\"f\" placeholder=\"Album, Interpret oder Titel suchen\u2026\" value=\"").concat(esc(MUS.q), "\">\n      <select id=\"ma\" class=\"f\" title=\"Interpret\"><option value=\"\">Alle Interpreten</option>").concat(F.artists.map(function (a) {
            return opt(a.name, a.name, MUS.artist);
          }).join(""), "</select>\n      <select id=\"mg\" class=\"f\" title=\"Musikrichtung\"><option value=\"\">Alle ").concat(GW, "</option>").concat(F.genres.map(function (g) {
            return opt(g.name, g.name, MUS.genre);
          }).join(""), "</select>\n      ").concat(MUS.mode === "albums" || MUS.mode === "tracks" ? "<select id=\"ms\" class=\"f\">".concat(opt("album", MUS.mode === "tracks" ? "Titel A–Z" : "Album A–Z", MUS.sort)).concat(opt("artist", "Interpret", MUS.sort)).concat(opt("added", "Zuletzt hinzugefügt", MUS.sort)).concat(opt("year", "Jahr", MUS.sort), "</select>") : "", "\n      ").concat(MLIBS.length > 1 ? "<select id=\"ml\" class=\"f\"><option value=\"0\">Alle Bibliotheken</option>".concat(MLIBS.map(function (l) {
            return opt(String(l.id), l.name, String(MUS.lib));
          }).join(""), "</select>") : "", "</div>\n    ").concat(MUS.artist || MUS.genre ? "<div class=\"chips\">".concat(MUS.artist ? "<a class=\"chip f on\" id=\"fxa\" tabindex=\"0\">\uD83D\uDC64 ".concat(esc(MUS.artist), " \u2715</a>") : "").concat(MUS.genre ? "<a class=\"chip f on\" id=\"fxg\" tabindex=\"0\">\uD83C\uDFBC ".concat(esc(MUS.genre), " \u2715</a>") : "", "</div>") : "", "\n    ").concat(body);
          $$(".mtab").forEach(function (b) {
            return b.onclick = function () {
              MUS.mode = b.dataset.m;
              viewMusic();
            };
          });
          $$(".mcat").forEach(function (b) {
            return b.onclick = function () {
              MUS.cat = b.dataset.c;
              MUS.genre = MUS.artist = "";
              if (MUS.mode === "playlists") MUS.mode = "albums";
              viewMusic();
            };
          });
          $("#mq").oninput = function (e) {
            clearTimeout(t);
            t = setTimeout(function () {
              MUS.q = e.target.value;
              viewMusic().then(function () {
                var i = $("#mq");
                i.focus();
                try {
                  i.setSelectionRange(i.value.length, i.value.length);
                } catch (_) {}
              });
            }, 400);
          };
          $("#ma").onchange = function (e) {
            MUS.artist = e.target.value;
            if (MUS.mode === "artists") MUS.mode = "albums";
            viewMusic();
          };
          $("#mg").onchange = function (e) {
            MUS.genre = e.target.value;
            if (MUS.mode === "genres") MUS.mode = "albums";
            viewMusic();
          };
          if ($("#ms")) $("#ms").onchange = function (e) {
            MUS.sort = e.target.value;
            viewMusic();
          };
          if ($("#ml")) $("#ml").onchange = function (e) {
            MUS.lib = +e.target.value;
            MUS.artist = MUS.genre = "";
            viewMusic();
          };
          if ($("#fxa")) $("#fxa").onclick = function () {
            MUS.artist = "";
            viewMusic();
          };
          if ($("#fxg")) $("#fxg").onclick = function () {
            MUS.genre = "";
            viewMusic();
          };
          $$(".ardel").forEach(function (b) {
            return b.onclick = /*#__PURE__*/function () {
              var _ref45 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee79(e) {
                return _regenerator().w(function (_context79) {
                  while (1) switch (_context79.n) {
                    case 0:
                      e.preventDefault();
                      e.stopPropagation();
                      if (confirm("Bild von \u201E".concat(b.dataset.n, "\u201C entfernen? Es wird dann nicht mehr gesucht."))) {
                        _context79.n = 1;
                        break;
                      }
                      return _context79.a(2);
                    case 1:
                      _context79.n = 2;
                      return api("/api/admin/music/images", {
                        method: "POST",
                        body: {
                          action: "remove_artist",
                          name: b.dataset.n
                        }
                      });
                    case 2:
                      MUS.facets = null;
                      viewMusic();
                    case 3:
                      return _context79.a(2);
                  }
                }, _callee79);
              }));
              return function (_x37) {
                return _ref45.apply(this, arguments);
              };
            }();
          });
          $$(".card.artist").forEach(function (el) {
            return el.onclick = function (e) {
              if (e.target.closest(".ardel")) return;
              MUS.artist = MUS._artists[+el.dataset.i].name;
              MUS.mode = "albums";
              MUS.q = "";
              viewMusic();
            };
          });
          $$(".chip.genre").forEach(function (el) {
            return el.onclick = function () {
              MUS.genre = F.genres[+el.dataset.i].name;
              MUS.mode = "albums";
              viewMusic();
            };
          });
          $("#mshuf").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee80() {
            var l;
            return _regenerator().w(function (_context80) {
              while (1) switch (_context80.n) {
                case 0:
                  _context80.n = 1;
                  return api("/api/music/tracks?".concat(qs(), "&shuffle=1&limit=500"));
                case 1:
                  l = _context80.v;
                  if (l.length) {
                    _context80.n = 2;
                    break;
                  }
                  return _context80.a(2, toast("Keine Titel in dieser Auswahl"));
                case 2:
                  musicPlay(l, 0);
                  toast("".concat(l.length, " Titel zuf\xE4llig").concat(MUS.artist ? " von " + MUS.artist : "").concat(MUS.genre ? " · " + MUS.genre : ""), 2500);
                case 3:
                  return _context80.a(2);
              }
            }, _callee80);
          }));
          if (tracks) bindTracks(tracks);
          if ($("#plnew")) $("#plnew").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee81() {
            var n;
            return _regenerator().w(function (_context81) {
              while (1) switch (_context81.n) {
                case 0:
                  n = prompt("Name der neuen Playlist:");
                  if (!(n && n.trim())) {
                    _context81.n = 2;
                    break;
                  }
                  _context81.n = 1;
                  return api("/api/music/playlists", {
                    method: "POST",
                    body: {
                      name: n.trim()
                    }
                  });
                case 1:
                  viewMusic();
                case 2:
                  return _context81.a(2);
              }
            }, _callee81);
          }));
          bindRc();
        case 12:
          return _context82.a(2);
      }
    }, _callee82);
  }));
  return _viewMusic.apply(this, arguments);
}
function viewAlbum(_x28) {
  return _viewAlbum.apply(this, arguments);
}
function _viewAlbum() {
  _viewAlbum = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee85(tid) {
    var a, total, list, trash;
    return _regenerator().w(function (_context85) {
      while (1) switch (_context85.n) {
        case 0:
          _context85.n = 1;
          return api("/api/music/album/".concat(tid));
        case 1:
          a = _context85.v;
          total = a.tracks.reduce(function (s, t) {
            return s + (t.duration || 0);
          }, 0);
          view.innerHTML = "".concat(backBtn("#/musik"), "<div class=\"albumhead\">\n    <div class=\"acover\">").concat(a.cover ? "<img src=\"".concat(imgUrl(a.cover), "\" alt=\"\">") : "<div class=\"ph\">\u266A</div>", "</div>\n    <div><h1>").concat(esc(a.album || "Ohne Album"), "</h1><div class=\"meta\"><span>").concat(esc(a.artist || ""), "</span>").concat(a.year ? "<span>".concat(a.year, "</span>") : "", "<span>").concat(a.tracks.length, " Titel</span><span>").concat(fmtDur(total), "</span></div>\n    <div class=\"actions\"><button class=\"btn primary f\" id=\"aplay\">\u25B6 Abspielen</button><button class=\"btn f\" id=\"ashuf\">\uD83D\uDD00 Zuf\xE4llig</button><button class=\"btn f\" id=\"aadd\">\uFF0B Zur Playlist</button>").concat(ME.admin && a.cover ? "<button class=\"btn f\" id=\"acovdel\" title=\"Falsches Cover entfernen\">\uD83D\uDDBC Cover entfernen</button>" : "").concat(ME.admin ? "<button class=\"btn danger f\" id=\"atrash\" title=\"Ganzes Album in den Ordner _Papierkorb auf der NAS\">\uD83D\uDDD1 Album in den Papierkorb</button>" : "", "</div></div></div>\n    ").concat(trackRows(a.tracks, false, false, ME.admin));
          list = a.tracks.map(function (t) {
            return Object.assign({}, t, {
              cover: t.cover || a.cover
            });
          });
          $("#aplay").onclick = function () {
            return musicPlay(list, 0, "order");
          };
          $("#ashuf").onclick = function () {
            return musicPlay(list, -1, "shuffle");
          };
          $("#aadd").onclick = function () {
            return plPicker(list.map(function (t) {
              return t.id;
            }));
          };
          bindTracks(list);
          trash = /*#__PURE__*/function () {
            var _trash = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee83(ids, album, what) {
              var r, _t29;
              return _regenerator().w(function (_context83) {
                while (1) switch (_context83.p = _context83.n) {
                  case 0:
                    if (confirm("".concat(what, " in den Papierkorb verschieben?\n\nDie Dateien landen im Ordner \u201E_Papierkorb\u201C auf der NAS \u2013 endg\xFCltig l\xF6schen musst du sie dort selbst."))) {
                      _context83.n = 1;
                      break;
                    }
                    return _context83.a(2);
                  case 1:
                    _context83.p = 1;
                    _context83.n = 2;
                    return api("/api/admin/music/trash", {
                      method: "POST",
                      body: {
                        ids: ids,
                        album: album
                      }
                    });
                  case 2:
                    r = _context83.v;
                    toast("".concat(r.moved, " Titel in den Papierkorb verschoben"), 3000);
                    MUS.facets = null;
                    if (album || r.moved >= a.tracks.length) location.hash = "#/musik";else viewAlbum(a.tracks.find(function (t) {
                      return !ids.includes(t.id);
                    }).id);
                    _context83.n = 4;
                    break;
                  case 3:
                    _context83.p = 3;
                    _t29 = _context83.v;
                    toast(_t29.message, 5000);
                  case 4:
                    return _context83.a(2);
                }
              }, _callee83, null, [[1, 3]]);
            }));
            function trash(_x38, _x39, _x40) {
              return _trash.apply(this, arguments);
            }
            return trash;
          }();
          if ($("#acovdel")) $("#acovdel").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee84() {
            return _regenerator().w(function (_context84) {
              while (1) switch (_context84.n) {
                case 0:
                  if (confirm("Cover entfernen? Es wird dann nicht neu gesucht.")) {
                    _context84.n = 1;
                    break;
                  }
                  return _context84.a(2);
                case 1:
                  _context84.n = 2;
                  return api("/api/admin/music/images", {
                    method: "POST",
                    body: {
                      action: "remove_cover",
                      id: a.tracks[0].id
                    }
                  });
                case 2:
                  viewAlbum(a.tracks[0].id);
                case 3:
                  return _context84.a(2);
              }
            }, _callee84);
          }));
          if ($("#atrash")) $("#atrash").onclick = function () {
            return trash([a.tracks[0].id], true, "Das ganze Album \u201E".concat(a.album, "\u201C (").concat(a.tracks.length, " Titel)"));
          };
          $$(".ttrash").forEach(function (b) {
            return b.onclick = function (e) {
              e.stopPropagation();
              var t = list[+b.closest(".trk").dataset.i];
              trash([t.id], false, "\u201E".concat(t.title, "\u201C"));
            };
          });
        case 2:
          return _context85.a(2);
      }
    }, _callee85);
  }));
  return _viewAlbum.apply(this, arguments);
}
/* ---- Radio ---- */
var STATIONS = [];
function viewRadio() {
  return _viewRadio.apply(this, arguments);
}
function _viewRadio() {
  _viewRadio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee89() {
    var search;
    return _regenerator().w(function (_context89) {
      while (1) switch (_context89.n) {
        case 0:
          view.innerHTML = '<h1>Radio</h1><p class="muted loading">Senderliste wird geladen …</p>';
          _context89.n = 1;
          return api("/api/radio/stations");
        case 1:
          STATIONS = _context89.v;
          view.innerHTML = "<h1>Radio</h1>\n    <div class=\"mtabs\"><button class=\"btn f rcbtn".concat(RC.armed ? " on" : "", "\" title=\"Fernsteuerung, z. B. aus Home Assistant\">\uD83D\uDE97 Fernsteuerung").concat(RC.armed ? " an" : "", "</button></div>\n    <div class=\"channels radio\">").concat(STATIONS.map(function (st, i) {
            return "<div class=\"chan rad f\" tabindex=\"0\" data-i=\"".concat(i, "\">\n      ").concat(st.favicon ? "<img src=\"".concat(esc(st.favicon), "\" alt=\"\" referrerpolicy=\"no-referrer\" onerror=\"this.remove()\">") : "", "<span>").concat(esc(st.name), "</span>\n      ").concat(ME.admin ? "<button class=\"rdel\" data-i=\"".concat(i, "\" title=\"Sender entfernen\">\u2715</button>") : "", "</div>");
          }).join("") || '<p class="muted">Noch keine Sender.</p>', "</div>\n    ").concat(ME.admin ? "<div class=\"panel\"><h2>Sender hinzuf\xFCgen</h2>\n      <div class=\"row\" style=\"flex-wrap:wrap\"><input id=\"rq\" class=\"f\" style=\"flex:1 1 220px\" placeholder=\"Sendername, z. B. NDR 2, Antenne, Klassik \u2026\"><label class=\"small\"><input type=\"checkbox\" id=\"rde\" checked> nur Deutschland</label><button class=\"btn f\" id=\"rsearch\">Suchen</button></div>\n      <div id=\"rres\"></div><p class=\"small muted\">Senderliste von radio-browser.info</p></div>" : "");
          $$(".chan.rad").forEach(function (el) {
            el.onclick = function (e) {
              if (e.target.closest(".rdel")) return;
              radioPlay(+el.dataset.i);
            };
            el.onkeydown = function (e) {
              if (e.key === "Enter") radioPlay(+el.dataset.i);
            };
          });
          musicMark();
          bindRc();
          if (ME.admin) {
            _context89.n = 2;
            break;
          }
          return _context89.a(2);
        case 2:
          $$(".rdel").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee86() {
              var st;
              return _regenerator().w(function (_context86) {
                while (1) switch (_context86.n) {
                  case 0:
                    st = STATIONS[+b.dataset.i];
                    if (confirm("\u201E".concat(st.name, "\u201C aus der Senderliste entfernen?"))) {
                      _context86.n = 1;
                      break;
                    }
                    return _context86.a(2);
                  case 1:
                    _context86.n = 2;
                    return api("/api/admin/radio", {
                      method: "PUT",
                      body: STATIONS.filter(function (_, i) {
                        return i !== +b.dataset.i;
                      })
                    });
                  case 2:
                    viewRadio();
                  case 3:
                    return _context86.a(2);
                }
              }, _callee86);
            }));
          });
          search = /*#__PURE__*/function () {
            var _search = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee88() {
              var q, res, _t30;
              return _regenerator().w(function (_context88) {
                while (1) switch (_context88.p = _context88.n) {
                  case 0:
                    q = $("#rq").value.trim();
                    if (q) {
                      _context88.n = 1;
                      break;
                    }
                    return _context88.a(2);
                  case 1:
                    $("#rres").innerHTML = '<p class="muted">Suche …</p>';
                    _context88.p = 2;
                    _context88.n = 3;
                    return api("/api/radio/search?q=".concat(encodeURIComponent(q), "&country=").concat($("#rde").checked ? "DE" : ""));
                  case 3:
                    res = _context88.v;
                    $("#rres").innerHTML = res.length ? "<div class=\"rlist\">".concat(res.map(function (r, i) {
                      return "<div class=\"rrow\">\n        ".concat(r.favicon ? "<img src=\"".concat(esc(r.favicon), "\" alt=\"\" referrerpolicy=\"no-referrer\" onerror=\"this.remove()\">") : '<span class="rph">📻</span>', "\n        <div class=\"rinfo\"><b>").concat(esc(r.name), "</b><small>").concat(esc([r.country, r.codec, r.bitrate ? r.bitrate + " kbit/s" : "", (r.tags || "").split(",").slice(0, 3).join(", ")].filter(Boolean).join(" · ")), "</small></div>\n        <button class=\"btn sm f rtest\" data-i=\"").concat(i, "\" title=\"Probeh\xF6ren\">\u25B6</button><button class=\"btn sm primary f radd\" data-i=\"").concat(i, "\">+ Hinzuf\xFCgen</button></div>");
                    }).join(""), "</div>") : '<p class="muted">Nichts gefunden.</p>';
                    $$(".radd").forEach(function (b) {
                      return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee87() {
                        var r;
                        return _regenerator().w(function (_context87) {
                          while (1) switch (_context87.n) {
                            case 0:
                              r = res[+b.dataset.i];
                              _context87.n = 1;
                              return api("/api/admin/radio", {
                                method: "PUT",
                                body: STATIONS.concat([r])
                              });
                            case 1:
                              toast("\u201E".concat(r.name, "\u201C hinzugef\xFCgt"));
                              viewRadio();
                            case 2:
                              return _context87.a(2);
                          }
                        }, _callee87);
                      }));
                    });
                    $$(".rtest").forEach(function (b) {
                      return b.onclick = function () {
                        var r = res[+b.dataset.i];
                        radioStart(r, r.url);
                      };
                    });
                    _context88.n = 5;
                    break;
                  case 4:
                    _context88.p = 4;
                    _t30 = _context88.v;
                    $("#rres").innerHTML = "<p class=\"err\">".concat(esc(_t30.message), "</p>");
                  case 5:
                    return _context88.a(2);
                }
              }, _callee88, null, [[2, 4]]);
            }));
            function search() {
              return _search.apply(this, arguments);
            }
            return search;
          }();
          $("#rsearch").onclick = search;
          $("#rq").onkeydown = function (e) {
            if (e.key === "Enter") search();
          };
        case 3:
          return _context89.a(2);
      }
    }, _callee89);
  }));
  return _viewRadio.apply(this, arguments);
}
/* ---- Wiedergabe (Mini-Player unten) ---- */
var CAN = {};
function canPlay(codec) {
  var mime = {
    mp3: "audio/mpeg",
    aac: "audio/mp4",
    alac: "audio/mp4",
    flac: "audio/flac",
    vorbis: "audio/ogg; codecs=vorbis",
    opus: "audio/ogg; codecs=opus",
    pcm_s16le: "audio/wav",
    pcm_s24le: "audio/wav"
  }[codec || "mp3"];
  if (!mime) return false;
  if (CAN[mime] === undefined) CAN[mime] = !!MA.canPlayType && MA.canPlayType(mime) !== "";
  return CAN[mime];
}
function musicPlay(list, i, mode) {
  MQ.list = list;
  MQ.radio = null;
  MQ.played = {};
  if (mode) {
    MQ.shuffle = mode === "shuffle";
    try {
      localStorage.setItem("mShuffle", MQ.shuffle ? "1" : "0");
    } catch (_) {}
    $("#m-shuf").classList.toggle("on", MQ.shuffle);
    if (MQ.shuffle && i < 0) i = Math.floor(Math.random() * list.length);
  }
  musicLoad(Math.max(0, i));
}
function musicNext(auto) {
  if (MQ.shuffle && MQ.list.length > 1) {
    var left = MQ.list.map(function (_, k) {
      return k;
    }).filter(function (k) {
      return !MQ.played[k] && k !== MQ.i;
    });
    if (!left.length) {
      if (auto) return;
      MQ.played = {};
      return musicNext(false);
    }
    return musicLoad(left[Math.floor(Math.random() * left.length)]);
  }
  if (MQ.i + 1 < MQ.list.length) musicLoad(MQ.i + 1);
}
function musicLoad(i) {
  if (i < 0 || i >= MQ.list.length) return;
  MQ.i = i;
  MQ.played = MQ.played || {};
  MQ.played[i] = true;
  var t = MQ.list[i];
  MA.loop = false;
  RC.silent = false;
  MA.src = "/api/music/stream/".concat(t.id).concat(canPlay(t.codec) ? "" : "?mp3=1");
  safePlay(MA);
  miniShow(t.title, [t.artist, t.album].filter(Boolean).join(" · "), t.cover ? imgUrl(t.cover) : "", false);
  mediaSession(t.title, t.artist || "", t.album || "", t.cover ? imgUrl(t.cover) : "");
  musicMark();
}
function radioPlay(i) {
  var st = STATIONS[i];
  if (!st) return;
  radioStart(st, "/api/radio/play/".concat(i));
}
function radioStart(st, url) {
  MQ.list = [];
  MQ.i = -1;
  MQ.radio = st;
  MA.loop = false;
  RC.silent = false;
  if (/\.m3u8(\?|$)/i.test(st.url || "") && /^https:/.test(st.url) && window.Hls && Hls.isSupported() && !IS_IOS) {
    if (MQ.hls) MQ.hls.destroy();
    MQ.hls = new Hls();
    MQ.hls.loadSource(st.url);
    MQ.hls.attachMedia(MA);
  } else {
    if (MQ.hls) {
      MQ.hls.destroy();
      MQ.hls = null;
    }
    MA.src = /\.m3u8(\?|$)/i.test(st.url || "") && IS_IOS ? st.url : url;
  }
  safePlay(MA);
  miniShow(st.name, "Radio · live", st.favicon || "", true);
  mediaSession(st.name, "Radio", "", st.favicon || "");
  musicMark();
}
function miniShow(title, sub, cover, live) {
  $("#mini").hidden = false;
  document.body.classList.add("has-mini");
  $("#m-title").textContent = title;
  $("#m-sub").textContent = sub;
  $("#m-cover").style.backgroundImage = cover ? "url('".concat(cover, "')") : "";
  $("#m-cover").textContent = cover ? "" : live ? "📻" : "♪";
  $("#mini").classList.toggle("live", !!live);
  $("#m-prev").hidden = $("#m-next").hidden = $("#m-shuf").hidden = !!live;
}
function musicMark() {
  var cur = MQ.list[MQ.i];
  $$(".trk").forEach(function (el) {
    return el.classList.toggle("playing", !!cur && +el.dataset.id === cur.id);
  });
  $$(".chan.rad").forEach(function (el) {
    return el.classList.toggle("playing", !!MQ.radio && STATIONS[+el.dataset.i] === MQ.radio);
  });
}
function musicPause() {
  if (!MA.paused) MA.pause();
}
function musicStop() {
  MA.pause();
  if (MQ.hls) {
    MQ.hls.destroy();
    MQ.hls = null;
  }
  MA.removeAttribute("src");
  try {
    MA.load();
  } catch (_) {}
  MQ.list = [];
  MQ.i = -1;
  MQ.radio = null;
  $("#mini").hidden = true;
  document.body.classList.remove("has-mini");
  musicMark();
}
function mediaSession(title, artist, album, art) {
  if (!("mediaSession" in navigator)) return;
  try {
    var abs = art ? new URL(art, location.href).href : "";
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: album,
      artwork: abs ? [{
        src: abs,
        sizes: "512x512"
      }] : []
    });
    navigator.mediaSession.setActionHandler("play", function () {
      return safePlay(MA);
    });
    navigator.mediaSession.setActionHandler("pause", function () {
      return MA.pause();
    });
    navigator.mediaSession.setActionHandler("previoustrack", MQ.radio ? null : function () {
      return musicPrev();
    });
    navigator.mediaSession.setActionHandler("nexttrack", MQ.radio ? null : function () {
      return musicNext(false);
    });
  } catch (_) {}
}
function musicPrev() {
  if (MA.currentTime > 4) MA.currentTime = 0;else musicLoad(Math.max(0, MQ.i - 1));
}
$("#m-play").onclick = function () {
  if (MA.paused) safePlay(MA);else MA.pause();
};
$("#m-prev").onclick = musicPrev;
$("#m-next").onclick = function () {
  return musicNext(false);
};
$("#m-close").onclick = function () {
  if (RC.armed) rcOff();
  musicStop();
};
MQ.shuffle = localStorage.getItem("mShuffle") === "1";
$("#m-shuf").classList.toggle("on", MQ.shuffle);
$("#m-shuf").onclick = function () {
  MQ.shuffle = !MQ.shuffle;
  try {
    localStorage.setItem("mShuffle", MQ.shuffle ? "1" : "0");
  } catch (_) {}
  $("#m-shuf").classList.toggle("on", MQ.shuffle);
  toast(MQ.shuffle ? "Zufallswiedergabe an" : "Zufallswiedergabe aus", 1500);
};

/* Sleeptimer für Musik & Radio */
var MSLEEP = {
  end: 0,
  timer: null,
  fading: false
};
$("#m-sleep").onclick = function (e) {
  e.stopPropagation();
  $("#m-sleepmenu").hidden = !$("#m-sleepmenu").hidden;
};
document.addEventListener("click", function (e) {
  if (!e.target.closest("#m-sleepmenu") && !e.target.closest("#m-sleep")) $("#m-sleepmenu").hidden = true;
});
$$("#m-sleepmenu button").forEach(function (b) {
  return b.onclick = function () {
    $("#m-sleepmenu").hidden = true;
    msleepSet(+b.dataset.m);
  };
});
function msleepSet(min) {
  clearInterval(MSLEEP.timer);
  MSLEEP.timer = null;
  MSLEEP.end = 0;
  $("#m-sleepbox").hidden = true;
  if (MSLEEP.fading) {
    MSLEEP.fading = false;
    MA.volume = 1;
  }
  $("#m-sleep").classList.toggle("on", !!min);
  if (!min) {
    $("#m-sleep").textContent = "⏾";
    toast("Sleeptimer aus", 1500);
    return;
  }
  MSLEEP.end = Date.now() + min * 60000;
  MSLEEP.timer = setInterval(msleepTick, 1000);
  msleepTick();
  toast("Sleeptimer: Wiedergabe endet in ".concat(min, " Minuten"), 2500);
}
function msleepExtend(min) {
  MSLEEP.end = Math.max(MSLEEP.end, Date.now()) + min * 60000;
  $("#m-sleepbox").hidden = true;
  if (MSLEEP.fading) {
    MSLEEP.fading = false;
    MA.volume = 1;
  }
  msleepTick();
}
function msleepTick() {
  if (!MSLEEP.end) return;
  var left = MSLEEP.end - Date.now();
  $("#m-sleep").textContent = "⏾ " + Math.max(1, Math.ceil(left / 60000));
  if (left <= 5 * 60000 && left > 0) {
    $("#m-sleepcount").textContent = fmtTime(Math.ceil(left / 1000));
    if ($("#m-sleepbox").hidden) {
      $("#m-sleepbox").hidden = false;
      $("#m-sl30").focus();
    }
  }
  if (left <= 10000 && left > 0 && !MA.paused) {
    MSLEEP.fading = true;
    MA.volume = Math.max(0, left / 10000);
  }
  if (left <= 0) {
    clearInterval(MSLEEP.timer);
    MSLEEP.timer = null;
    MSLEEP.end = 0;
    $("#m-sleepbox").hidden = true;
    $("#m-sleep").textContent = "⏾";
    $("#m-sleep").classList.remove("on");
    MA.pause();
    MSLEEP.fading = false;
    MA.volume = 1;
    toast("Sleeptimer: Wiedergabe beendet", 4000);
  }
}
$("#m-sl30").onclick = function () {
  return msleepExtend(30);
};
$("#m-sl60").onclick = function () {
  return msleepExtend(60);
};
$("#m-sloff").onclick = function () {
  msleepSet(0);
  MA.pause();
};
MA.addEventListener("play", function () {
  $("#m-play").textContent = "❚❚";
});
MA.addEventListener("pause", function () {
  $("#m-play").textContent = "▶";
});
MA.addEventListener("ended", function () {
  if (MQ.radio || RC.silent) return;
  var last = !MQ.shuffle ? MQ.i + 1 >= MQ.list.length : MQ.list.every(function (_, k) {
    return MQ.played[k];
  });
  if (last && RC.armed) return rcSilence("Liste zu Ende – 🚗 bereit für den nächsten Wunsch");
  musicNext(true);
});
MA.addEventListener("error", function () {
  if (RC.silent) return;
  if (MQ.radio || MQ.i >= 0) toast(MQ.radio ? "Sender gerade nicht erreichbar" : "Titel kann nicht abgespielt werden", 4000);
});
var mSeeking = false;
MA.addEventListener("timeupdate", function () {
  if (MQ.radio || mSeeking) return;
  var d = MA.duration || MQ.list[MQ.i] && MQ.list[MQ.i].duration || 0;
  $("#m-cur").textContent = fmtTime(MA.currentTime || 0);
  $("#m-dur").textContent = fmtTime(d);
  $("#m-seek").value = d ? Math.round(MA.currentTime / d * 1000) : 0;
});
$("#m-seek").oninput = function () {
  mSeeking = true;
  var d = MA.duration || 0;
  $("#m-cur").textContent = fmtTime(d * $("#m-seek").value / 1000);
};
$("#m-seek").onchange = function () {
  var d = MA.duration || 0;
  if (d) MA.currentTime = d * $("#m-seek").value / 1000;
  mSeeking = false;
};

/* ---- Fernsteuerung: Seite wartet auf Befehle (z. B. „spiele Queen“ aus Home Assistant) ---- */
var RC = {
  armed: false,
  silent: false,
  saved: null,
  url: null,
  busy: false
};
function silenceUrl() {
  if (RC.url) return RC.url;
  var n = 16000,
    b = new Uint8Array(44 + n),
    v = new DataView(b.buffer);
  var w = function w(o, t) {
    for (var i = 0; i < t.length; i++) b[o + i] = t.charCodeAt(i);
  };
  w(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  w(36, "data");
  v.setUint32(40, n, true);
  for (var i = 0; i < n; i++) b[44 + i] = 128; // 8 Bit: 128 = absolute Stille
  RC.url = URL.createObjectURL(new Blob([b], {
    type: "audio/wav"
  }));
  return RC.url;
}
function rcSilence(sub) {
  RC.silent = true;
  MA.loop = true;
  if (MQ.hls) {
    MQ.hls.destroy();
    MQ.hls = null;
  }
  MA.src = silenceUrl();
  safePlay(MA);
  miniShow("🚗 Fernsteuerung bereit", sub || "Sag Home Assistant, was du hören möchtest", "", true);
  mediaSession("Kinowerk – bereit", "Fernsteuerung", "", "");
}
function bindRc() {
  $$(".rcbtn").forEach(function (b) {
    return b.onclick = function () {
      return RC.armed ? rcOff() : rcOn();
    };
  });
}
function rcUpdateBtns() {
  $$(".rcbtn").forEach(function (b) {
    b.classList.toggle("on", RC.armed);
    b.textContent = "🚗 Fernsteuerung" + (RC.armed ? " an" : "");
  });
  $("#mini").classList.toggle("rc", RC.armed);
}
function rcOn() {
  return _rcOn.apply(this, arguments);
}
function _rcOn() {
  _rcOn = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee90() {
    var _t31;
    return _regenerator().w(function (_context90) {
      while (1) switch (_context90.p = _context90.n) {
        case 0:
          RC.armed = true;
          rcUpdateBtns();
          if (MA.paused || !MA.src) rcSilence(); // Antippen „entsperrt“ den Ton fürs iPhone
          _context90.p = 1;
          _context90.n = 2;
          return api("/api/remote/arm", {
            method: "POST",
            body: {
              client: deviceId()
            }
          });
        case 2:
          _context90.n = 4;
          break;
        case 3:
          _context90.p = 3;
          _t31 = _context90.v;
          RC.armed = false;
          rcUpdateBtns();
          return _context90.a(2, toast("Fernsteuerung ging nicht: " + _t31.message, 4000));
        case 4:
          toast("🚗 Fernsteuerung an – das Handy darf jetzt gesperrt werden", 3500);
          rcLoop();
        case 5:
          return _context90.a(2);
      }
    }, _callee90, null, [[1, 3]]);
  }));
  return _rcOn.apply(this, arguments);
}
function rcOff() {
  return _rcOff.apply(this, arguments);
}
function _rcOff() {
  _rcOff = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee91() {
    var _t32;
    return _regenerator().w(function (_context91) {
      while (1) switch (_context91.p = _context91.n) {
        case 0:
          RC.armed = false;
          rcUpdateBtns();
          _context91.p = 1;
          _context91.n = 2;
          return api("/api/remote/disarm", {
            method: "POST",
            body: {
              client: deviceId()
            }
          });
        case 2:
          _context91.n = 4;
          break;
        case 3:
          _context91.p = 3;
          _t32 = _context91.v;
        case 4:
          if (RC.silent) musicStop();
          toast("Fernsteuerung aus", 1500);
        case 5:
          return _context91.a(2);
      }
    }, _callee91, null, [[1, 3]]);
  }));
  return _rcOff.apply(this, arguments);
}
function rcLoop() {
  return _rcLoop.apply(this, arguments);
}
function _rcLoop() {
  _rcLoop = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee92() {
    var r, _t33;
    return _regenerator().w(function (_context92) {
      while (1) switch (_context92.p = _context92.n) {
        case 0:
          if (!RC.busy) {
            _context92.n = 1;
            break;
          }
          return _context92.a(2);
        case 1:
          RC.busy = true;
        case 2:
          if (!RC.armed) {
            _context92.n = 8;
            break;
          }
          _context92.p = 3;
          _context92.n = 4;
          return api("/api/remote/poll?client=".concat(encodeURIComponent(deviceId())));
        case 4:
          r = _context92.v;
          if (r.armed) {
            _context92.n = 5;
            break;
          }
          RC.armed = false;
          rcUpdateBtns();
          toast("Fernsteuerung wurde auf einem anderen Gerät eingeschaltet", 4000);
          return _context92.a(3, 8);
        case 5:
          r.commands.forEach(rcDo);
          _context92.n = 7;
          break;
        case 6:
          _context92.p = 6;
          _t33 = _context92.v;
          _context92.n = 7;
          return new Promise(function (res) {
            return setTimeout(res, 3000);
          });
        case 7:
          _context92.n = 2;
          break;
        case 8:
          RC.busy = false;
        case 9:
          return _context92.a(2);
      }
    }, _callee92, null, [[3, 6]]);
  }));
  return _rcLoop.apply(this, arguments);
}
function rcDo(c) {
  if (c.action === "play" && c.tracks && c.tracks.length) {
    musicPlay(c.tracks, 0);
    toast("▶ " + (c.label || ""), 2500);
  } else if (c.action === "radio" && c.station) {
    radioStart(c.station, "/api/radio/play/".concat(c.idx));
  } else if (c.action === "pause") {
    if (RC.silent) return;
    RC.saved = MQ.radio ? {
      radio: MQ.radio
    } : {
      list: MQ.list,
      i: MQ.i,
      t: MA.currentTime,
      played: MQ.played
    };
    rcSilence("Pause – „weiter“ setzt fort");
  } else if (c.action === "resume") {
    var sv = RC.saved;
    RC.saved = null;
    if (!sv) {
      if (MA.paused) safePlay(MA);
      return;
    }
    if (sv.radio) radioStart(sv.radio, "/api/radio/play/".concat(sv.radio.idx));else if (sv.list && sv.list.length) {
      MQ.list = sv.list;
      MQ.radio = null;
      MQ.played = sv.played || {};
      musicLoad(sv.i);
      var _seek = function seek() {
        try {
          MA.currentTime = sv.t || 0;
        } catch (_) {}
        MA.removeEventListener("loadedmetadata", _seek);
      };
      MA.addEventListener("loadedmetadata", _seek);
    }
  } else if (c.action === "next" && !MQ.radio && !RC.silent) musicNext(false);else if (c.action === "prev" && !MQ.radio && !RC.silent) musicPrev();else if (c.action === "stop") {
    RC.saved = null;
    MQ.list = [];
    MQ.i = -1;
    MQ.radio = null;
    rcSilence();
  } else if (c.action === "louder") MA.volume = Math.min(1, MA.volume + 0.2);else if (c.action === "quieter") MA.volume = Math.max(0.1, MA.volume - 0.2);
}

/* ---- Playlisten ---- */
function plPicker(_x29) {
  return _plPicker.apply(this, arguments);
}
function _plPicker() {
  _plPicker = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee95(ids) {
    var pls, mk;
    return _regenerator().w(function (_context95) {
      while (1) switch (_context95.n) {
        case 0:
          _context95.n = 1;
          return api("/api/music/playlists");
        case 1:
          pls = _context95.v;
          modal("<h2>Zur Playlist hinzuf\xFCgen</h2><p class=\"muted small\">".concat(ids.length === 1 ? "1 Titel" : ids.length + " Titel", "</p>\n    <div class=\"pllist\">").concat(pls.map(function (p) {
            return "<button class=\"btn f plpick\" data-id=\"".concat(p.id, "\">\u266B ").concat(esc(p.name), " <small class=\"muted\">").concat(p.n, " Titel</small></button>");
          }).join(""), "</div>\n    <div class=\"row\" style=\"margin-top:12px\"><input id=\"plname\" class=\"f\" style=\"flex:1\" placeholder=\"Neue Playlist, z. B. Autofahrt\"><button class=\"btn primary f\" id=\"plmk\">Anlegen</button></div>\n    <div class=\"row\" style=\"margin-top:12px\"><button class=\"btn f\" id=\"plx\">Abbrechen</button></div>"));
          $$(".plpick").forEach(function (b) {
            return b.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee93() {
              return _regenerator().w(function (_context93) {
                while (1) switch (_context93.n) {
                  case 0:
                    _context93.n = 1;
                    return api("/api/music/playlists/".concat(b.dataset.id, "/add"), {
                      method: "POST",
                      body: {
                        track_ids: ids
                      }
                    });
                  case 1:
                    closeModal();
                    toast("Zur Playlist hinzugefügt", 2000);
                  case 2:
                    return _context93.a(2);
                }
              }, _callee93);
            }));
          });
          mk = /*#__PURE__*/function () {
            var _mk = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee94() {
              var n;
              return _regenerator().w(function (_context94) {
                while (1) switch (_context94.n) {
                  case 0:
                    n = $("#plname").value.trim();
                    if (n) {
                      _context94.n = 1;
                      break;
                    }
                    return _context94.a(2, $("#plname").focus());
                  case 1:
                    _context94.n = 2;
                    return api("/api/music/playlists", {
                      method: "POST",
                      body: {
                        name: n,
                        track_ids: ids
                      }
                    });
                  case 2:
                    closeModal();
                    toast("Playlist \u201E".concat(n, "\u201C angelegt"), 2000);
                  case 3:
                    return _context94.a(2);
                }
              }, _callee94);
            }));
            function mk() {
              return _mk.apply(this, arguments);
            }
            return mk;
          }();
          $("#plmk").onclick = mk;
          $("#plname").onkeydown = function (e) {
            if (e.key === "Enter") mk();
          };
          $("#plx").onclick = closeModal;
        case 2:
          return _context95.a(2);
      }
    }, _callee95);
  }));
  return _plPicker.apply(this, arguments);
}
function viewPlaylist(_x30) {
  return _viewPlaylist.apply(this, arguments);
}
function _viewPlaylist() {
  _viewPlaylist = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee102(pid) {
    var p, total, covers, list, save;
    return _regenerator().w(function (_context102) {
      while (1) switch (_context102.n) {
        case 0:
          _context102.n = 1;
          return api("/api/music/playlists/".concat(pid));
        case 1:
          p = _context102.v;
          total = p.tracks.reduce(function (s, t) {
            return s + (t.duration || 0);
          }, 0);
          covers = _toConsumableArray(new Set(p.tracks.map(function (t) {
            return t.cover;
          }).filter(Boolean))).slice(0, 4);
          view.innerHTML = "".concat(backBtn("#/musik"), "<div class=\"albumhead\">\n    <div class=\"acover plimg\">").concat(covers.length ? covers.map(function (c) {
            return "<img src=\"".concat(imgUrl(c), "\" alt=\"\">");
          }).join("") : '<div class="ph">♫</div>', "</div>\n    <div><h1>").concat(esc(p.name), "</h1><div class=\"meta\"><span>Playlist</span><span>").concat(p.tracks.length, " Titel</span><span>").concat(fmtDur(total), "</span></div>\n    <div class=\"actions\"><button class=\"btn primary f\" id=\"pplay\">\u25B6 Abspielen</button><button class=\"btn f\" id=\"pshuf\">\uD83D\uDD00 Zuf\xE4llig</button>\n      <button class=\"btn f\" id=\"pren\">\u270E Umbenennen</button><button class=\"btn danger f\" id=\"pdel\">\uD83D\uDDD1 L\xF6schen</button></div></div></div>\n    ").concat(p.tracks.length ? trackRows(p.tracks, true, true) : '<p class="muted">Noch leer – Titel mit ＋ hinzufügen.</p>');
          list = p.tracks;
          save = /*#__PURE__*/function () {
            var _save2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee96() {
              return _regenerator().w(function (_context96) {
                while (1) switch (_context96.n) {
                  case 0:
                    _context96.n = 1;
                    return api("/api/music/playlists/".concat(pid), {
                      method: "PUT",
                      body: {
                        track_ids: list.map(function (t) {
                          return t.id;
                        })
                      }
                    });
                  case 1:
                    return _context96.a(2);
                }
              }, _callee96);
            }));
            function save() {
              return _save2.apply(this, arguments);
            }
            return save;
          }();
          $("#pplay").onclick = function () {
            return list.length && musicPlay(list, 0, "order");
          };
          $("#pshuf").onclick = function () {
            return list.length && musicPlay(list, -1, "shuffle");
          };
          $("#pren").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee97() {
            var n;
            return _regenerator().w(function (_context97) {
              while (1) switch (_context97.n) {
                case 0:
                  n = prompt("Neuer Name:", p.name);
                  if (!(n && n.trim())) {
                    _context97.n = 2;
                    break;
                  }
                  _context97.n = 1;
                  return api("/api/music/playlists/".concat(pid), {
                    method: "PUT",
                    body: {
                      name: n.trim()
                    }
                  });
                case 1:
                  viewPlaylist(pid);
                case 2:
                  return _context97.a(2);
              }
            }, _callee97);
          }));
          $("#pdel").onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee98() {
            return _regenerator().w(function (_context98) {
              while (1) switch (_context98.n) {
                case 0:
                  if (confirm("Playlist \u201E".concat(p.name, "\u201C l\xF6schen? Die Musikdateien bleiben nat\xFCrlich erhalten."))) {
                    _context98.n = 1;
                    break;
                  }
                  return _context98.a(2);
                case 1:
                  _context98.n = 2;
                  return api("/api/music/playlists/".concat(pid), {
                    method: "DELETE"
                  });
                case 2:
                  location.hash = "#/musik";
                case 3:
                  return _context98.a(2);
              }
            }, _callee98);
          }));
          bindTracks(list);
          $$(".trk").forEach(function (el) {
            var i = +el.dataset.i;
            el.querySelector(".tup").onclick = /*#__PURE__*/function () {
              var _ref54 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee99(e) {
                var x;
                return _regenerator().w(function (_context99) {
                  while (1) switch (_context99.n) {
                    case 0:
                      e.stopPropagation();
                      if (!(i > 0)) {
                        _context99.n = 2;
                        break;
                      }
                      x = list[i];
                      list[i] = list[i - 1];
                      list[i - 1] = x;
                      _context99.n = 1;
                      return save();
                    case 1:
                      viewPlaylist(pid);
                    case 2:
                      return _context99.a(2);
                  }
                }, _callee99);
              }));
              return function (_x41) {
                return _ref54.apply(this, arguments);
              };
            }();
            el.querySelector(".tdn").onclick = /*#__PURE__*/function () {
              var _ref55 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee100(e) {
                var x;
                return _regenerator().w(function (_context100) {
                  while (1) switch (_context100.n) {
                    case 0:
                      e.stopPropagation();
                      if (!(i < list.length - 1)) {
                        _context100.n = 2;
                        break;
                      }
                      x = list[i];
                      list[i] = list[i + 1];
                      list[i + 1] = x;
                      _context100.n = 1;
                      return save();
                    case 1:
                      viewPlaylist(pid);
                    case 2:
                      return _context100.a(2);
                  }
                }, _callee100);
              }));
              return function (_x42) {
                return _ref55.apply(this, arguments);
              };
            }();
            el.querySelector(".tdel").onclick = /*#__PURE__*/function () {
              var _ref56 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee101(e) {
                return _regenerator().w(function (_context101) {
                  while (1) switch (_context101.n) {
                    case 0:
                      e.stopPropagation();
                      list.splice(i, 1);
                      _context101.n = 1;
                      return save();
                    case 1:
                      viewPlaylist(pid);
                    case 2:
                      return _context101.a(2);
                  }
                }, _callee101);
              }));
              return function (_x43) {
                return _ref56.apply(this, arguments);
              };
            }();
          });
        case 2:
          return _context102.a(2);
      }
    }, _callee102);
  }));
  return _viewPlaylist.apply(this, arguments);
}
