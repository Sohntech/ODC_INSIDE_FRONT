"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/dashboard/layout",{

/***/ "(app-pages-browser)/./hooks/useUserPhoto.ts":
/*!*******************************!*\
  !*** ./hooks/useUserPhoto.ts ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useUserPhoto: function() { return /* binding */ useUserPhoto; }\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/api */ \"(app-pages-browser)/./lib/api.ts\");\n\n\nfunction useUserPhoto(userEmail, userRole) {\n    const [photoUrl, setPhotoUrl] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        async function fetchUserPhoto() {\n            if (!userEmail) {\n                setLoading(false);\n                return;\n            }\n            try {\n                const userDetails = await _lib_api__WEBPACK_IMPORTED_MODULE_1__.usersAPI.getUserDetailsWithPhoto(userEmail);\n                setPhotoUrl((userDetails === null || userDetails === void 0 ? void 0 : userDetails.photoUrl) || null);\n            } catch (error) {\n                console.error(\"Error fetching user photo:\", error);\n                setPhotoUrl(null);\n            } finally{\n                setLoading(false);\n            }\n        }\n        fetchUserPhoto();\n    }, [\n        userEmail\n    ]);\n    return {\n        photoUrl,\n        loading\n    };\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2hvb2tzL3VzZVVzZXJQaG90by50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTRDO0FBQ1A7QUFFOUIsU0FBU0csYUFBYUMsU0FBa0IsRUFBRUMsUUFBaUI7SUFDaEUsTUFBTSxDQUFDQyxVQUFVQyxZQUFZLEdBQUdQLCtDQUFRQSxDQUFnQjtJQUN4RCxNQUFNLENBQUNRLFNBQVNDLFdBQVcsR0FBR1QsK0NBQVFBLENBQUM7SUFFdkNDLGdEQUFTQSxDQUFDO1FBQ1IsZUFBZVM7WUFDYixJQUFJLENBQUNOLFdBQVc7Z0JBQ2RLLFdBQVc7Z0JBQ1g7WUFDRjtZQUVBLElBQUk7Z0JBQ0YsTUFBTUUsY0FBYyxNQUFNVCw4Q0FBUUEsQ0FBQ1UsdUJBQXVCLENBQUNSO2dCQUMzREcsWUFBWUksQ0FBQUEsd0JBQUFBLGtDQUFBQSxZQUFhTCxRQUFRLEtBQUk7WUFDdkMsRUFBRSxPQUFPTyxPQUFPO2dCQUNkQyxRQUFRRCxLQUFLLENBQUMsOEJBQThCQTtnQkFDNUNOLFlBQVk7WUFDZCxTQUFVO2dCQUNSRSxXQUFXO1lBQ2I7UUFDRjtRQUVBQztJQUNGLEdBQUc7UUFBQ047S0FBVTtJQUVkLE9BQU87UUFBRUU7UUFBVUU7SUFBUTtBQUM3QiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9ob29rcy91c2VVc2VyUGhvdG8udHM/MTYxOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlcnNBUEkgfSBmcm9tICdAL2xpYi9hcGknO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlVXNlclBob3RvKHVzZXJFbWFpbD86IHN0cmluZywgdXNlclJvbGU/OiBzdHJpbmcpIHtcbiAgY29uc3QgW3Bob3RvVXJsLCBzZXRQaG90b1VybF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhc3luYyBmdW5jdGlvbiBmZXRjaFVzZXJQaG90bygpIHtcbiAgICAgIGlmICghdXNlckVtYWlsKSB7XG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVzZXJEZXRhaWxzID0gYXdhaXQgdXNlcnNBUEkuZ2V0VXNlckRldGFpbHNXaXRoUGhvdG8odXNlckVtYWlsKTtcbiAgICAgICAgc2V0UGhvdG9VcmwodXNlckRldGFpbHM/LnBob3RvVXJsIHx8IG51bGwpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdXNlciBwaG90bzonLCBlcnJvcik7XG4gICAgICAgIHNldFBob3RvVXJsKG51bGwpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmV0Y2hVc2VyUGhvdG8oKTtcbiAgfSwgW3VzZXJFbWFpbF0pO1xuXG4gIHJldHVybiB7IHBob3RvVXJsLCBsb2FkaW5nIH07XG59Il0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlcnNBUEkiLCJ1c2VVc2VyUGhvdG8iLCJ1c2VyRW1haWwiLCJ1c2VyUm9sZSIsInBob3RvVXJsIiwic2V0UGhvdG9VcmwiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImZldGNoVXNlclBob3RvIiwidXNlckRldGFpbHMiLCJnZXRVc2VyRGV0YWlsc1dpdGhQaG90byIsImVycm9yIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./hooks/useUserPhoto.ts\n"));

/***/ })

});