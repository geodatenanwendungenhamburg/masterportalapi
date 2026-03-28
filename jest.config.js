/* eslint-env node */
module.exports = {
    "transform": {
        "^.+\\.(t|j)sx?$": "@swc/jest"
    },
    /** ol prints errors without HTMLCanvasElement being available in test environment */
    "setupFiles": ["jest-canvas-mock"],
    /** node_modules are usually ignored by babel-jest, but ol is published in ES6 */
    "transformIgnorePatterns": ["/node_modules/(?!(ol|olcs|ol-mapbox-style|mapbox-to-css-font|geotiff|quick-lru|color-space|color-rgba|color-parse|color-name|rbush|quickselect|earcut|pbf)/).*/"],
    /** only consider files in src/ for coverage */
    "collectCoverageFrom": ["src/**/*.js"],
    /** coverage reporters */
    "coverageReporters": ["json", "lcov", "text", "clover", "cobertura"],
    /** mapping svg to string representation since jest can't handle svg and mapping olcs paths*/
    "moduleNameMapper": {
        "marker.svg": "<rootDir>/public/stringMarker.js",
        "^olcs/(.*)$": "<rootDir>/node_modules/olcs/lib/olcs/$1",
        "ol-mapbox-style$": "<rootDir>/node_modules/ol-mapbox-style/src/$1"
    },
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["./jest.setup.js"],
    "verbose": true
};
