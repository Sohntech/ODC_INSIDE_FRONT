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

/***/ "(app-pages-browser)/./components/dashboard/Header.tsx":
/*!*****************************************!*\
  !*** ./components/dashboard/Header.tsx ***!
  \*****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Header; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _barrel_optimize_names_MenuIcon_User_lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! __barrel_optimize__?names=MenuIcon,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/menu.js\");\n/* harmony import */ var _barrel_optimize_names_MenuIcon_User_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! __barrel_optimize__?names=MenuIcon,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/user.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/image */ \"(app-pages-browser)/./node_modules/next/dist/api/image.js\");\n/* harmony import */ var _hooks_useUserPhoto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/hooks/useUserPhoto */ \"(app-pages-browser)/./hooks/useUserPhoto.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction Header(param) {\n    let { toggleSidebar, user: propUser } = param;\n    _s();\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(propUser || null);\n    const { photoUrl, loading } = (0,_hooks_useUserPhoto__WEBPACK_IMPORTED_MODULE_3__.useUserPhoto)(user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.role);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (propUser) {\n            setUser(propUser);\n            return;\n        }\n        if (true) {\n            const storedUser = localStorage.getItem(\"user\");\n            if (storedUser) {\n                try {\n                    setUser(JSON.parse(storedUser));\n                } catch (error) {\n                    console.error(\"Error parsing user from localStorage:\", error);\n                }\n            }\n        }\n    }, [\n        propUser\n    ]);\n    const getUserRoleDisplay = (role)=>{\n        const roleMap = {\n            \"ADMIN\": \"Administrateur\",\n            \"COACH\": \"Coach\",\n            \"APPRENANT\": \"Apprenant\",\n            \"VIGIL\": \"Vigil\",\n            \"RESTAURATEUR\": \"Restaurateur\"\n        };\n        return roleMap[role] || role;\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n        className: \"bg-white border-b px-4 py-2 flex items-center justify-between\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center space-x-4\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: toggleSidebar,\n                    className: \"p-2 hover:bg-gray-100 rounded-lg\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_MenuIcon_User_lucide_react__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                        className: \"h-6 w-6 text-gray-600\"\n                    }, void 0, false, {\n                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                        lineNumber: 54,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                    lineNumber: 50,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                lineNumber: 49,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center space-x-4\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"relative\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        className: \"flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"relative w-8 h-8 rounded-full overflow-hidden\",\n                                children: loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"w-full h-full bg-gray-200 animate-pulse\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 63,\n                                    columnNumber: 17\n                                }, this) : photoUrl ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_image__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                                    src: photoUrl,\n                                    alt: \"Profile\",\n                                    fill: true,\n                                    className: \"object-cover\",\n                                    sizes: \"32px\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 65,\n                                    columnNumber: 17\n                                }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"w-full h-full bg-yellow-500 flex items-center justify-center text-white\",\n                                    children: (user === null || user === void 0 ? void 0 : user.email) ? user.email.charAt(0).toUpperCase() : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_MenuIcon_User_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                        size: 20\n                                    }, void 0, false, {\n                                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                        lineNumber: 74,\n                                        columnNumber: 71\n                                    }, this)\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 73,\n                                    columnNumber: 17\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                lineNumber: 61,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"hidden md:block text-left\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-sm font-medium text-gray-700\",\n                                        children: (user === null || user === void 0 ? void 0 : user.email) || \"Utilisateur\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                        lineNumber: 79,\n                                        columnNumber: 15\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"text-xs text-gray-500\",\n                                        children: (user === null || user === void 0 ? void 0 : user.role) ? getUserRoleDisplay(user.role) : \"Aucun r\\xf4le\"\n                                    }, void 0, false, {\n                                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                        lineNumber: 82,\n                                        columnNumber: 15\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                lineNumber: 78,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                        lineNumber: 60,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                    lineNumber: 59,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                lineNumber: 58,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n        lineNumber: 48,\n        columnNumber: 5\n    }, this);\n}\n_s(Header, \"uhVj//PWk27rLUjsw3ILxQN5nsU=\", false, function() {\n    return [\n        _hooks_useUserPhoto__WEBPACK_IMPORTED_MODULE_3__.useUserPhoto\n    ];\n});\n_c = Header;\nvar _c;\n$RefreshReg$(_c, \"Header\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvZGFzaGJvYXJkL0hlYWRlci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUU0QztBQUNnQjtBQUU3QjtBQUNxQjtBQU9yQyxTQUFTTSxPQUFPLEtBQThDO1FBQTlDLEVBQUVDLGFBQWEsRUFBRUMsTUFBTUMsUUFBUSxFQUFlLEdBQTlDOztJQUM3QixNQUFNLENBQUNELE1BQU1FLFFBQVEsR0FBR1YsK0NBQVFBLENBQXlDUyxZQUFZO0lBQ3JGLE1BQU0sRUFBRUUsUUFBUSxFQUFFQyxPQUFPLEVBQUUsR0FBR1AsaUVBQVlBLENBQUNHLGlCQUFBQSwyQkFBQUEsS0FBTUssS0FBSyxFQUFFTCxpQkFBQUEsMkJBQUFBLEtBQU1NLElBQUk7SUFFbEViLGdEQUFTQSxDQUFDO1FBQ1IsSUFBSVEsVUFBVTtZQUNaQyxRQUFRRDtZQUNSO1FBQ0Y7UUFFQSxJQUFJLElBQWtCLEVBQWE7WUFDakMsTUFBTU0sYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1lBQ3hDLElBQUlGLFlBQVk7Z0JBQ2QsSUFBSTtvQkFDRkwsUUFBUVEsS0FBS0MsS0FBSyxDQUFDSjtnQkFDckIsRUFBRSxPQUFPSyxPQUFPO29CQUNkQyxRQUFRRCxLQUFLLENBQUMseUNBQXlDQTtnQkFDekQ7WUFDRjtRQUNGO0lBQ0YsR0FBRztRQUFDWDtLQUFTO0lBRWIsTUFBTWEscUJBQXFCLENBQUNSO1FBQzFCLE1BQU1TLFVBQWtDO1lBQ3RDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsYUFBYTtZQUNiLFNBQVM7WUFDVCxnQkFBZ0I7UUFDbEI7UUFDQSxPQUFPQSxPQUFPLENBQUNULEtBQUssSUFBSUE7SUFDMUI7SUFFQSxxQkFDRSw4REFBQ1U7UUFBT0MsV0FBVTs7MEJBQ2hCLDhEQUFDQztnQkFBSUQsV0FBVTswQkFDYiw0RUFBQ0U7b0JBQ0NDLFNBQVNyQjtvQkFDVGtCLFdBQVU7OEJBRVYsNEVBQUN2Qix5RkFBUUE7d0JBQUN1QixXQUFVOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUl4Qiw4REFBQ0M7Z0JBQUlELFdBQVU7MEJBQ2IsNEVBQUNDO29CQUFJRCxXQUFVOzhCQUNiLDRFQUFDRTt3QkFBT0YsV0FBVTs7MENBQ2hCLDhEQUFDQztnQ0FBSUQsV0FBVTswQ0FDWmIsd0JBQ0MsOERBQUNjO29DQUFJRCxXQUFVOzs7OzsyQ0FDYmQseUJBQ0YsOERBQUNQLGtEQUFLQTtvQ0FDSnlCLEtBQUtsQjtvQ0FDTG1CLEtBQUk7b0NBQ0pDLElBQUk7b0NBQ0pOLFdBQVU7b0NBQ1ZPLE9BQU07Ozs7O3lEQUdSLDhEQUFDTjtvQ0FBSUQsV0FBVTs4Q0FDWmpCLENBQUFBLGlCQUFBQSwyQkFBQUEsS0FBTUssS0FBSyxJQUFHTCxLQUFLSyxLQUFLLENBQUNvQixNQUFNLENBQUMsR0FBR0MsV0FBVyxtQkFBSyw4REFBQy9CLHlGQUFJQTt3Q0FBQ2dDLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7MENBSXRFLDhEQUFDVDtnQ0FBSUQsV0FBVTs7a0RBQ2IsOERBQUNDO3dDQUFJRCxXQUFVO2tEQUNaakIsQ0FBQUEsaUJBQUFBLDJCQUFBQSxLQUFNSyxLQUFLLEtBQUk7Ozs7OztrREFFbEIsOERBQUNhO3dDQUFJRCxXQUFVO2tEQUNaakIsQ0FBQUEsaUJBQUFBLDJCQUFBQSxLQUFNTSxJQUFJLElBQUdRLG1CQUFtQmQsS0FBS00sSUFBSSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUTlEO0dBN0V3QlI7O1FBRVFELDZEQUFZQTs7O0tBRnBCQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL2Rhc2hib2FyZC9IZWFkZXIudHN4P2JkOGMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xuXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVsbCwgTWVudUljb24sIFNlYXJjaCwgVXNlciB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnO1xuaW1wb3J0IEltYWdlIGZyb20gJ25leHQvaW1hZ2UnO1xuaW1wb3J0IHsgdXNlVXNlclBob3RvIH0gZnJvbSAnQC9ob29rcy91c2VVc2VyUGhvdG8nO1xuXG5pbnRlcmZhY2UgSGVhZGVyUHJvcHMge1xuICB0b2dnbGVTaWRlYmFyOiAoKSA9PiB2b2lkO1xuICB1c2VyPzogeyBlbWFpbDogc3RyaW5nOyByb2xlOiBzdHJpbmcgfSB8IG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhlYWRlcih7IHRvZ2dsZVNpZGViYXIsIHVzZXI6IHByb3BVc2VyIH06IEhlYWRlclByb3BzKSB7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPHsgZW1haWw6IHN0cmluZzsgcm9sZTogc3RyaW5nIH0gfCBudWxsPihwcm9wVXNlciB8fCBudWxsKTtcbiAgY29uc3QgeyBwaG90b1VybCwgbG9hZGluZyB9ID0gdXNlVXNlclBob3RvKHVzZXI/LmVtYWlsLCB1c2VyPy5yb2xlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChwcm9wVXNlcikge1xuICAgICAgc2V0VXNlcihwcm9wVXNlcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBzdG9yZWRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcbiAgICAgIGlmIChzdG9yZWRVc2VyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc2V0VXNlcihKU09OLnBhcnNlKHN0b3JlZFVzZXIpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwYXJzaW5nIHVzZXIgZnJvbSBsb2NhbFN0b3JhZ2U6JywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCBbcHJvcFVzZXJdKTtcblxuICBjb25zdCBnZXRVc2VyUm9sZURpc3BsYXkgPSAocm9sZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qgcm9sZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICdBRE1JTic6ICdBZG1pbmlzdHJhdGV1cicsXG4gICAgICAnQ09BQ0gnOiAnQ29hY2gnLFxuICAgICAgJ0FQUFJFTkFOVCc6ICdBcHByZW5hbnQnLFxuICAgICAgJ1ZJR0lMJzogJ1ZpZ2lsJyxcbiAgICAgICdSRVNUQVVSQVRFVVInOiAnUmVzdGF1cmF0ZXVyJ1xuICAgIH07XG4gICAgcmV0dXJuIHJvbGVNYXBbcm9sZV0gfHwgcm9sZTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiYmctd2hpdGUgYm9yZGVyLWIgcHgtNCBweS0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTRcIj5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVTaWRlYmFyfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInAtMiBob3ZlcjpiZy1ncmF5LTEwMCByb3VuZGVkLWxnXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxNZW51SWNvbiBjbGFzc05hbWU9XCJoLTYgdy02IHRleHQtZ3JheS02MDBcIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTMgcC0yIHJvdW5kZWQtZnVsbCBob3ZlcjpiZy1ncmF5LTEwMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB3LTggaC04IHJvdW5kZWQtZnVsbCBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgICAgICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIGJnLWdyYXktMjAwIGFuaW1hdGUtcHVsc2VcIiAvPlxuICAgICAgICAgICAgICApIDogcGhvdG9VcmwgPyAoXG4gICAgICAgICAgICAgICAgPEltYWdlXG4gICAgICAgICAgICAgICAgICBzcmM9e3Bob3RvVXJsfVxuICAgICAgICAgICAgICAgICAgYWx0PVwiUHJvZmlsZVwiXG4gICAgICAgICAgICAgICAgICBmaWxsXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJvYmplY3QtY292ZXJcIlxuICAgICAgICAgICAgICAgICAgc2l6ZXM9XCIzMnB4XCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBiZy15ZWxsb3ctNTAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgIHt1c2VyPy5lbWFpbCA/IHVzZXIuZW1haWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgOiA8VXNlciBzaXplPXsyMH0gLz59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmJsb2NrIHRleHQtbGVmdFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgICAgICAgIHt1c2VyPy5lbWFpbCB8fCAnVXRpbGlzYXRldXInfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICB7dXNlcj8ucm9sZSA/IGdldFVzZXJSb2xlRGlzcGxheSh1c2VyLnJvbGUpIDogJ0F1Y3VuIHLDtGxlJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2hlYWRlcj5cbiAgKTtcbn0iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJNZW51SWNvbiIsIlVzZXIiLCJJbWFnZSIsInVzZVVzZXJQaG90byIsIkhlYWRlciIsInRvZ2dsZVNpZGViYXIiLCJ1c2VyIiwicHJvcFVzZXIiLCJzZXRVc2VyIiwicGhvdG9VcmwiLCJsb2FkaW5nIiwiZW1haWwiLCJyb2xlIiwic3RvcmVkVXNlciIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJlcnJvciIsImNvbnNvbGUiLCJnZXRVc2VyUm9sZURpc3BsYXkiLCJyb2xlTWFwIiwiaGVhZGVyIiwiY2xhc3NOYW1lIiwiZGl2IiwiYnV0dG9uIiwib25DbGljayIsInNyYyIsImFsdCIsImZpbGwiLCJzaXplcyIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2l6ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/dashboard/Header.tsx\n"));

/***/ })

});