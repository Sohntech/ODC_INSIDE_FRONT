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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Header; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! __barrel_optimize__?names=Bell,MenuIcon,Search,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/menu.js\");\n/* harmony import */ var _barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! __barrel_optimize__?names=Bell,MenuIcon,Search,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/search.js\");\n/* harmony import */ var _barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=Bell,MenuIcon,Search,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/bell.js\");\n/* harmony import */ var _barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! __barrel_optimize__?names=Bell,MenuIcon,Search,User!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/user.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/image */ \"(app-pages-browser)/./node_modules/next/dist/api/image.js\");\n/* harmony import */ var _hooks_useUserPhoto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/hooks/useUserPhoto */ \"(app-pages-browser)/./hooks/useUserPhoto.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction Header(param) {\n    let { toggleSidebar, user: propUser } = param;\n    _s();\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(propUser || null);\n    const { photoUrl, loading } = (0,_hooks_useUserPhoto__WEBPACK_IMPORTED_MODULE_3__.useUserPhoto)((user === null || user === void 0 ? void 0 : user.photoUrl) || \"\", user === null || user === void 0 ? void 0 : user.role);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // If user is passed as prop, use it\n        if (propUser) {\n            setUser(propUser);\n            return;\n        }\n        // Otherwise check if user info is in localStorage and set it\n        if (true) {\n            const storedUser = localStorage.getItem(\"user\");\n            if (storedUser) {\n                try {\n                    setUser(JSON.parse(storedUser));\n                } catch (error) {\n                    console.error(\"Error parsing user from localStorage:\", error);\n                }\n            }\n        }\n    }, [\n        propUser\n    ]);\n    const getUserRoleDisplay = (role)=>{\n        const roleMap = {\n            \"ADMIN\": \"Administrateur\",\n            \"COACH\": \"Coach\",\n            \"APPRENANT\": \"Apprenant\",\n            \"VIGIL\": \"Vigil\",\n            \"RESTAURATEUR\": \"Restaurateur\"\n        };\n        return roleMap[role] || role.toLowerCase();\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n        className: \"bg-white border-b\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"flex items-center justify-between h-16 px-4\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex items-center space-x-4\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: toggleSidebar,\n                            className: \"text-gray-600 hover:text-gray-900 lg:hidden\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                                size: 24\n                            }, void 0, false, {\n                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                lineNumber: 61,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                            lineNumber: 57,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                    size: 20,\n                                    className: \"text-gray-500\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 65,\n                                    columnNumber: 13\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                                    type: \"text\",\n                                    placeholder: \"Rechercher...\",\n                                    className: \"bg-transparent border-none focus:outline-none text-sm w-48 xl:w-64\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 66,\n                                    columnNumber: 13\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                            lineNumber: 64,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                    lineNumber: 56,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"flex items-center space-x-4\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            className: \"relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                                    size: 20\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 77,\n                                    columnNumber: 13\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: \"absolute top-1 right-1 h-2 w-2 bg-yellow-500 rounded-full\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                    lineNumber: 78,\n                                    columnNumber: 13\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                            lineNumber: 76,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"relative\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                className: \"flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"relative w-8 h-8 rounded-full overflow-hidden\",\n                                        children: loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"w-full h-full bg-gray-200 animate-pulse\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                            lineNumber: 85,\n                                            columnNumber: 19\n                                        }, this) : photoUrl ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_image__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                                            src: photoUrl,\n                                            alt: \"Profile\",\n                                            fill: true,\n                                            className: \"object-cover\",\n                                            sizes: \"32px\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                            lineNumber: 87,\n                                            columnNumber: 19\n                                        }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"w-full h-full bg-yellow-500 flex items-center justify-center text-white\",\n                                            children: (user === null || user === void 0 ? void 0 : user.email) ? user.email.charAt(0).toUpperCase() : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bell_MenuIcon_Search_User_lucide_react__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n                                                size: 20\n                                            }, void 0, false, {\n                                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                                lineNumber: 96,\n                                                columnNumber: 73\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                            lineNumber: 95,\n                                            columnNumber: 19\n                                        }, this)\n                                    }, void 0, false, {\n                                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                        lineNumber: 83,\n                                        columnNumber: 15\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"hidden md:block text-left\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                className: \"text-sm font-medium text-gray-700\",\n                                                children: (user === null || user === void 0 ? void 0 : user.email) || \"Utilisateur\"\n                                            }, void 0, false, {\n                                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                                lineNumber: 101,\n                                                columnNumber: 17\n                                            }, this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                className: \"text-xs text-gray-500\",\n                                                children: (user === null || user === void 0 ? void 0 : user.role) ? getUserRoleDisplay(user.role) : \"Aucun r\\xf4le\"\n                                            }, void 0, false, {\n                                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                                lineNumber: 104,\n                                                columnNumber: 17\n                                            }, this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                        lineNumber: 100,\n                                        columnNumber: 15\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                                lineNumber: 82,\n                                columnNumber: 13\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                            lineNumber: 81,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n                    lineNumber: 75,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n            lineNumber: 54,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/macbookpro/Downloads/project 2/components/dashboard/Header.tsx\",\n        lineNumber: 53,\n        columnNumber: 5\n    }, this);\n}\n_s(Header, \"uhVj//PWk27rLUjsw3ILxQN5nsU=\", false, function() {\n    return [\n        _hooks_useUserPhoto__WEBPACK_IMPORTED_MODULE_3__.useUserPhoto\n    ];\n});\n_c = Header;\nvar _c;\n$RefreshReg$(_c, \"Header\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvZGFzaGJvYXJkL0hlYWRlci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRTRDO0FBQ2dCO0FBRTdCO0FBQ3FCO0FBT3JDLFNBQVNRLE9BQU8sS0FBOEM7UUFBOUMsRUFBRUMsYUFBYSxFQUFFQyxNQUFNQyxRQUFRLEVBQWUsR0FBOUM7O0lBQzdCLE1BQU0sQ0FBQ0QsTUFBTUUsUUFBUSxHQUFHWiwrQ0FBUUEsQ0FFeEJXLFlBQVk7SUFDcEIsTUFBTSxFQUFFRSxRQUFRLEVBQUVDLE9BQU8sRUFBRSxHQUFHUCxpRUFBWUEsQ0FBQ0csQ0FBQUEsaUJBQUFBLDJCQUFBQSxLQUFNRyxRQUFRLEtBQUksSUFBSUgsaUJBQUFBLDJCQUFBQSxLQUFNSyxJQUFJO0lBRTNFZCxnREFBU0EsQ0FBQztRQUNSLG9DQUFvQztRQUNwQyxJQUFJVSxVQUFVO1lBQ1pDLFFBQVFEO1lBQ1I7UUFDRjtRQUVBLDZEQUE2RDtRQUM3RCxJQUFJLElBQWtCLEVBQWE7WUFDakMsTUFBTUssYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1lBQ3hDLElBQUlGLFlBQVk7Z0JBQ2QsSUFBSTtvQkFDRkosUUFBUU8sS0FBS0MsS0FBSyxDQUFDSjtnQkFDckIsRUFBRSxPQUFPSyxPQUFPO29CQUNkQyxRQUFRRCxLQUFLLENBQUMseUNBQXlDQTtnQkFDekQ7WUFDRjtRQUNGO0lBQ0YsR0FBRztRQUFDVjtLQUFTO0lBRWIsTUFBTVkscUJBQXFCLENBQUNSO1FBQzFCLE1BQU1TLFVBQWtDO1lBQ3RDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsYUFBYTtZQUNiLFNBQVM7WUFDVCxnQkFBZ0I7UUFDbEI7UUFFQSxPQUFPQSxPQUFPLENBQUNULEtBQUssSUFBSUEsS0FBS1UsV0FBVztJQUMxQztJQUVBLHFCQUNFLDhEQUFDQztRQUFPQyxXQUFVO2tCQUNoQiw0RUFBQ0M7WUFBSUQsV0FBVTs7OEJBRWIsOERBQUNDO29CQUFJRCxXQUFVOztzQ0FDYiw4REFBQ0U7NEJBQ0NDLFNBQVNyQjs0QkFDVGtCLFdBQVU7c0NBRVYsNEVBQUN4QixxR0FBUUE7Z0NBQUM0QixNQUFNOzs7Ozs7Ozs7OztzQ0FHbEIsOERBQUNIOzRCQUFJRCxXQUFVOzs4Q0FDYiw4REFBQ3ZCLHFHQUFNQTtvQ0FBQzJCLE1BQU07b0NBQUlKLFdBQVU7Ozs7Ozs4Q0FDNUIsOERBQUNLO29DQUNDQyxNQUFLO29DQUNMQyxhQUFZO29DQUNaUCxXQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBTWhCLDhEQUFDQztvQkFBSUQsV0FBVTs7c0NBQ2IsOERBQUNFOzRCQUFPRixXQUFVOzs4Q0FDaEIsOERBQUN6QixxR0FBSUE7b0NBQUM2QixNQUFNOzs7Ozs7OENBQ1osOERBQUNJO29DQUFLUixXQUFVOzs7Ozs7Ozs7Ozs7c0NBR2xCLDhEQUFDQzs0QkFBSUQsV0FBVTtzQ0FDYiw0RUFBQ0U7Z0NBQU9GLFdBQVU7O2tEQUNoQiw4REFBQ0M7d0NBQUlELFdBQVU7a0RBQ1piLHdCQUNDLDhEQUFDYzs0Q0FBSUQsV0FBVTs7Ozs7bURBQ2JkLHlCQUNGLDhEQUFDUCxrREFBS0E7NENBQ0o4QixLQUFLdkI7NENBQ0x3QixLQUFJOzRDQUNKQyxJQUFJOzRDQUNKWCxXQUFVOzRDQUNWWSxPQUFNOzs7OztpRUFHUiw4REFBQ1g7NENBQUlELFdBQVU7c0RBQ1pqQixDQUFBQSxpQkFBQUEsMkJBQUFBLEtBQU04QixLQUFLLElBQUc5QixLQUFLOEIsS0FBSyxDQUFDQyxNQUFNLENBQUMsR0FBR0MsV0FBVyxtQkFBSyw4REFBQ3JDLHFHQUFJQTtnREFBQzBCLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7a0RBSXRFLDhEQUFDSDt3Q0FBSUQsV0FBVTs7MERBQ2IsOERBQUNDO2dEQUFJRCxXQUFVOzBEQUNaakIsQ0FBQUEsaUJBQUFBLDJCQUFBQSxLQUFNOEIsS0FBSyxLQUFJOzs7Ozs7MERBRWxCLDhEQUFDWjtnREFBSUQsV0FBVTswREFDWmpCLENBQUFBLGlCQUFBQSwyQkFBQUEsS0FBTUssSUFBSSxJQUFHUSxtQkFBbUJiLEtBQUtLLElBQUksSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNoRTtHQXBHd0JQOztRQUlRRCw2REFBWUE7OztLQUpwQkMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9kYXNoYm9hcmQvSGVhZGVyLnRzeD9iZDhjIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlbGwsIE1lbnVJY29uLCBTZWFyY2gsIFVzZXIgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcbmltcG9ydCBJbWFnZSBmcm9tICduZXh0L2ltYWdlJztcbmltcG9ydCB7IHVzZVVzZXJQaG90byB9IGZyb20gJ0AvaG9va3MvdXNlVXNlclBob3RvJztcblxuaW50ZXJmYWNlIEhlYWRlclByb3BzIHtcbiAgdG9nZ2xlU2lkZWJhcjogKCkgPT4gdm9pZDtcbiAgdXNlcj86IHsgZW1haWw6IHN0cmluZzsgcm9sZTogc3RyaW5nOyBwaG90b1VybD86IHN0cmluZyB9IHwgbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSGVhZGVyKHsgdG9nZ2xlU2lkZWJhciwgdXNlcjogcHJvcFVzZXIgfTogSGVhZGVyUHJvcHMpIHtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8e1xuICAgIHBob3RvVXJsPzogc3RyaW5nOyBlbWFpbDogc3RyaW5nOyByb2xlOiBzdHJpbmcgXG59IHwgbnVsbD4ocHJvcFVzZXIgfHwgbnVsbCk7XG4gIGNvbnN0IHsgcGhvdG9VcmwsIGxvYWRpbmcgfSA9IHVzZVVzZXJQaG90byh1c2VyPy5waG90b1VybCB8fCAnJywgdXNlcj8ucm9sZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBJZiB1c2VyIGlzIHBhc3NlZCBhcyBwcm9wLCB1c2UgaXRcbiAgICBpZiAocHJvcFVzZXIpIHtcbiAgICAgIHNldFVzZXIocHJvcFVzZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSBjaGVjayBpZiB1c2VyIGluZm8gaXMgaW4gbG9jYWxTdG9yYWdlIGFuZCBzZXQgaXRcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHN0b3JlZFVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xuICAgICAgaWYgKHN0b3JlZFVzZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXRVc2VyKEpTT04ucGFyc2Uoc3RvcmVkVXNlcikpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBhcnNpbmcgdXNlciBmcm9tIGxvY2FsU3RvcmFnZTonLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtwcm9wVXNlcl0pO1xuXG4gIGNvbnN0IGdldFVzZXJSb2xlRGlzcGxheSA9IChyb2xlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCByb2xlTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgJ0FETUlOJzogJ0FkbWluaXN0cmF0ZXVyJyxcbiAgICAgICdDT0FDSCc6ICdDb2FjaCcsXG4gICAgICAnQVBQUkVOQU5UJzogJ0FwcHJlbmFudCcsXG4gICAgICAnVklHSUwnOiAnVmlnaWwnLFxuICAgICAgJ1JFU1RBVVJBVEVVUic6ICdSZXN0YXVyYXRldXInXG4gICAgfTtcblxuICAgIHJldHVybiByb2xlTWFwW3JvbGVdIHx8IHJvbGUudG9Mb3dlckNhc2UoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiYmctd2hpdGUgYm9yZGVyLWJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGgtMTYgcHgtNFwiPlxuICAgICAgICB7LyogTGVmdDogTWVudSBidXR0b24gYW5kIHNlYXJjaCAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTRcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVTaWRlYmFyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTYwMCBob3Zlcjp0ZXh0LWdyYXktOTAwIGxnOmhpZGRlblwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPE1lbnVJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoaWRkZW4gbWQ6ZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yIGJnLWdyYXktMTAwIHB4LTQgcHktMiByb3VuZGVkLWxnXCI+XG4gICAgICAgICAgICA8U2VhcmNoIHNpemU9ezIwfSBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNTAwXCIgLz5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUmVjaGVyY2hlci4uLlwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnLXRyYW5zcGFyZW50IGJvcmRlci1ub25lIGZvY3VzOm91dGxpbmUtbm9uZSB0ZXh0LXNtIHctNDggeGw6dy02NFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogUmlnaHQ6IE5vdGlmaWNhdGlvbnMgYW5kIHByb2ZpbGUgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC00XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBwLTIgdGV4dC1ncmF5LTYwMCBob3Zlcjp0ZXh0LWdyYXktOTAwIGhvdmVyOmJnLWdyYXktMTAwIHJvdW5kZWQtZnVsbCB0cmFuc2l0aW9uLWNvbG9yc1wiPlxuICAgICAgICAgICAgPEJlbGwgc2l6ZT17MjB9IC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMSByaWdodC0xIGgtMiB3LTIgYmcteWVsbG93LTUwMCByb3VuZGVkLWZ1bGxcIj48L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMyBwLTEgcm91bmRlZC1mdWxsIGhvdmVyOmJnLWdyYXktMTAwXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgdy04IGgtOCByb3VuZGVkLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgYmctZ3JheS0yMDAgYW5pbWF0ZS1wdWxzZVwiIC8+XG4gICAgICAgICAgICAgICAgKSA6IHBob3RvVXJsID8gKFxuICAgICAgICAgICAgICAgICAgPEltYWdlXG4gICAgICAgICAgICAgICAgICAgIHNyYz17cGhvdG9Vcmx9XG4gICAgICAgICAgICAgICAgICAgIGFsdD1cIlByb2ZpbGVcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgIHNpemVzPVwiMzJweFwiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgYmcteWVsbG93LTUwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIHt1c2VyPy5lbWFpbCA/IHVzZXIuZW1haWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgOiA8VXNlciBzaXplPXsyMH0gLz59XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoaWRkZW4gbWQ6YmxvY2sgdGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICAgICAgICAgIHt1c2VyPy5lbWFpbCB8fCAnVXRpbGlzYXRldXInfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICAgICAgICB7dXNlcj8ucm9sZSA/IGdldFVzZXJSb2xlRGlzcGxheSh1c2VyLnJvbGUpIDogJ0F1Y3VuIHLDtGxlJ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2hlYWRlcj5cbiAgKTtcbn0iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJCZWxsIiwiTWVudUljb24iLCJTZWFyY2giLCJVc2VyIiwiSW1hZ2UiLCJ1c2VVc2VyUGhvdG8iLCJIZWFkZXIiLCJ0b2dnbGVTaWRlYmFyIiwidXNlciIsInByb3BVc2VyIiwic2V0VXNlciIsInBob3RvVXJsIiwibG9hZGluZyIsInJvbGUiLCJzdG9yZWRVc2VyIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwiY29uc29sZSIsImdldFVzZXJSb2xlRGlzcGxheSIsInJvbGVNYXAiLCJ0b0xvd2VyQ2FzZSIsImhlYWRlciIsImNsYXNzTmFtZSIsImRpdiIsImJ1dHRvbiIsIm9uQ2xpY2siLCJzaXplIiwiaW5wdXQiLCJ0eXBlIiwicGxhY2Vob2xkZXIiLCJzcGFuIiwic3JjIiwiYWx0IiwiZmlsbCIsInNpemVzIiwiZW1haWwiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/dashboard/Header.tsx\n"));

/***/ })

});