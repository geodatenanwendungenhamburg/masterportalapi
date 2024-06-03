# Changelog masterportalAPI
 All important changes in this project are stored in this file.

 The [Semantic Versioning](https://semver.org/spec/v2.0.0.html) is used.

## Unreleased - in development

### Added
- Added support for Node LTS version ^20.12.2 and npm Version ^10.5.0.

### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 9.1.0 to 9.2.4
        - olcs: 2.19.3 to 2.20.0

### Deprecated

### Removed

### Fixed
- The mitigation for issue 666 in ol-cesium since version 2.37.0 is removed
- Webgl: vectorTiles were not displayed.
- WMS-Layer: special loadFunction is only used if layer's attribute `isSecured` is true.

---

## 2.37.0 - 2024-04-23

### Fixed
- Issue Masterportal #1114: `isSecured` parameter is considered for WMS load function
- Issue Masterportal #1114: custom loading function for WMS is now applied on non-tiled WMS, too.
  However, because of issue 666 in ol-cesium it does not work for 3D and is enabled for `isSecured: true` layers only
- Image layers that cannot be converted by olcs are now properly handled

---

## 2.36.0 - 2024-04-11

### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 8.2.0 to 9.1.0
        - ol-mapbox-style: 12.0.0 to 12.2.1
        - olcs: 2.16.0 to 2.19.3
        - proj4: 2.9.1 to 2.10.0

---

## 2.35.0 - 2024-04-02

### Added
- WMS: Support for using CQL filters by attribute added.

### Fixed
- Issue Masterportal #1127: fixed styling of clustered and not clustered circles.
- WFST parsing featureType wfs.js with attribute required true by default.

---
## 2.34.0 - 2024-03-04

### Changed
- stylePointCircle.js now has a zIndex of -1 to put unclustered Labels above clustered ones.

---

## 2.33.0 - 2024-02-07

### Changed
- createStyle: setting style to feature is limited to Point and MultiPoint geometries.

### Fixed
- 3D: the options are set correctly again for terrain.

---


## 2.32.0 - 2024-01-17
### Added

### Changed
- The following package has been updated:
    - dependencies:
        - ol: 8.1.0 to 8.2.0
    - peerDependencies:
        - @cesium/engine 2.4.1 to 6.2.0

---

## 2.31.0 - 2023-12-13
### Added
- Added support for Node LTS version ^20.9.0 and npm Version ^10.1.0.

### Changed
- WMS-Layer: the attribute extent of rawlayer is set at ol-layer.

### Fixed
- OAF-Layer: fix oaf layer in examples

---

## 2.30.0 - 2023-11-28
### Changed
- WMS-Layer and WMTS-Layer: create Layer no longer evaluates the minScale and maxScale attributes, but instead minResolution and maxResolution can be transferred.

### Fixed
- Issue Masterportal #1052 VectorStyle: fixed blinking of initial loaded features on great amount of features with a lot of conditional styles.
- Issue Masterportal #1088: gfiAttibutes with type=html are not displayed if there is no value in the data.
- Issue Masterportal #1091: VectorStyle: read geometry type from geoserver featureTypeRequest

---

## 2.29.0 - 2023-10-27
### Added
- The following packages from parcel automatic were installed for node builtin:
    - dependencies:
        - assert": 2.1.0,
        - browserify-zlib: 0.2.0,
        - https-browserify: 1.0.0
        - stream-http: 3.2.0
        - url: 0.11.3
        - util: 0.12.5
- The following packages have been added:
    - dependencies:
        - ol-mapbox-style: 12.0.0

### Changed
- The following packages have been updated:
    - dependencies:
        - core-js: 3.32.0 to 3.33.1
        - dayjs: 1.11.9 to 1.11.10
        - ol: 7.5.2 to 8.1.0 (includes the change of the symbol style format in ol/layer/WebGLPointsLayer)
        - olcs: 2.15.0 to 2.16.0
        - proj4: 2.9.0 to 2.9.1
    - devDependencies:
        - @babel/core: 7.22.9 to 7.23.2
        - @babel/plugin-transform-modules-commonjs: 7.22.5 to 7.23.2
        - @parcel/transformer-sass: 2.9.3 to 2.10.0
        - @swc/jest: 0.2.27 to 0.2.29
        - eslint: 8.46.0 to 8.52.0
        - jest: 29.6.2 to 29.7.0
        - jest-environment-jsdom: 29.6.2 to 29.7.0
        - parcel: 2.9.3 to 2.10.0
        - sass: 1.64.2 to 1.69.4
- Revert Cesium.Cesium3DTileset.fromUrl(url, options) adaptions in tileset.js for Cesium v1.107 deprecated warnings

### Fixed
- styleList: styles of type oaf are now also added to the stylelist
- Issue Masterportal #1052 VectorStyle: path to an icon in the map or in the legend in style.json may be an icon name, a relative path to icon, a complete url or an svg.

---

## 2.28.0 - 2023-09-27
### Added
- GfiAttributes: GFI Attributes can now be configured as HTML tags, e.g <a>, <img> or <iframe>

### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 7.5.1 to 7.5.2 (This version fix a bug for vectorTiles with declutter: true)
### Fixed
- Issue Masterportal #1067 VectorStyle: if there is a ? in the services URL, no further one is added
- Cesium tileset: set visibility and set opacity was fixed.
- Webgl: set default style for feature and fix the opacity problem

---

## 2.27.0 - 2023-08-31
### Changed
- VectorStyle: 'initializeStyleList' is asynchron, waits for loading finished and returns the loaded styles.

---

## 2.26.0 - 2023-08-23
### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 7.4.0 to 7.5.1

---

## 2.25.0 - 2023-08-21
### Changed
- WebGL: method "afterLoading" catches MultiPoint geometries and parses them to a single point feature for proper rendering
- WebGL Render-Pipeline for VectorLayer of type VectorTile can be called using {"renderer": "webgl"} in config.json.
- The styleList is now loading asynchronus

---

## 2.24.0 - 2023-08-03
### Added
- The following packages have been installed:
    - @swc/jest: 0.2.27
- Add a function to convertUnits in drawInteractions.
- Remove VectorBase layer and add it to masterportal.

### Changed
- The following packages have been updated:
    - dependencies:
        - core-js: 3.30.2 to 3.32.0
        - dayjs: 1.11.7 to 1.11.9
        - olcs: 2.14.0 to 2.15.0
        - xml2js: 0.5.0 to 0.6.2
    - devDependencies:
        - @babel/core: 7.21.8 to 7.22.9
        - @babel/plugin-transform-modules-commonjs: 7.21.5 to 7.21.5
        - @parcel/transformer-sass: 2.8.3 to 2.9.3
        - buffer: 5.7.1 to 6.0.3
        - eslint: 8.40.0 to 8.46.0
        - jest: 29.5.0 to 29.6.2
        - jest-canvas-mock: 2.5.0 to 2.5.2
        - jest-environment-jsdom: 29.5.0 to 29.6.2
        - parcel: 2.8.3 to 2.9.3
        - sass: 1.62.1 to 1.64.2

### Fixed
- Changed peerDependency from cesium 1.106.0 to @cesium/engine 2.4.1.

---

## 2.23.0 - 2023-08-02
### Added
- Add select and modify interactions for editing ol features.

### Fixed
- The legend for wfs is now created again via the Describefeaturetype.

---

## 2.22.0 - 2023-07-25
### Changed
- Replace derprecated cesium tileset and terrain loading functions.
- WFST Refactoring

---

## 2.21.0 - 2023-07-21
### Added
- VectorStyle: Add Styling rules for Geometries of type `Circle`.
- Add Styling and zIndex to draw interactions and improve the draw behavior.

### Changed
- Changed peerDependency from cesium 1.106.0 to @cesium/engine 2.4.1.
- WFS:
    - Migrated writeTransaction and sendTransaction from masterportal the masterportalAPI.
    - Exports in src/layer/wfs.js changed to export default {} to provide  ES-Syntax.

### Fixed
- WFS: fixed a bug that prevented parsing GeoServer responses.

---

## 2.20.0 - 2023-06-30
### Added
- Add draw interaction for interactive and static geometry types.
- WFS: Added function to load wfs features manually.

### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 7.3.0 to 7.4.0
        - cesium: 1.95.0 to 1.106.0
- The examples in example/index.js are updated.

### Fixed
- VectorStyle: fixed several bugs of multiple geometries with styling rules.

---

## 2.19.2 - 2023-06-12
### Fixed
- VectorStyle of multiple geometries with styling rules does not fail on not existing style.

---

## 2.19.1 - 2023-06-02
### Changed
- Exports in src/layer/wmts.js changed to export default {} to provide  ES-Syntax.

---

## 2.19.0 - 2023-05-26
### Added
- The following package has been added:
    - dependencies:
        - dayjs: "^1.11.7"

### Changed
- AttributeMapper: Object keys are supported with dot notation.
- WFS: hardcoded URL changed to dynamic url creation.
- Issue Masterportal #1021: extend vectorStyle in order to handle geometryCollections.
- Issue Masterportal #1022: attributeMapper supports additional time formats.

### Fixed
- Issue Masterportal # 1028: set cesium scene parameter recursively.

---

## 2.18.0 - 2023-05-10
### Changed
- The following packages have been updated:
    - dependencies:
        - core-js: 3.29.1 to 3.30.2
        - olcs: 2.13.1 to 2.14.0
    - devDependencies:
        - @babel/core: 7.21.3 to 7.21.8
        - @babel/plugin-transform-modules-commonjs: 7.21.2 to 7.21.5
        - @parcel/transformer-sass: 2.6.0 to 2.8.3
        - canvas: 2.11.0 to 2.11.2
        - eslint: 8.36.0 to 8.40.0
        - jest-canvas-mock: 2.4.0 to 2.5.0
        - parcel: 2.6.0 to 2.8.3
        - sass: 1.59.3 to 1.62.1
- The devDependency `buffer` ist downgrade from 6.0.3 to 5.7.1 because parcel requires a version 5.

---

## 2.17.0 - 2023-04-27
### Added
- Added functionality for mapbox style raster sources for vector tile layer.
- Added possibility to use zoomToFeatureId in vectorStyle.

### Changed
- ol map default interactions and keyboardEventTarget can now be set by config parameters.
- The following packages have been updated:
    - dependencies:
        - xml2js: 0.4.23 to 0.5.0

### Fix
- Fix vectorStyle for circlesegments.

---

## 2.16.0 - 2023-03-28
### Added
- Added support for `npm` version ^9.1.3.

### Changed
- The following packages have been updated:
    - dependencies:
        - core-js: 3.27.1 to 3.29.1
        - ol: 7.2.2 to 7.3.0
        - proj4: 2.8.1 to 2.9.0
    - devDependencies:
        - @babel/core: 7.20.12 to 7.21.3
        - @babel/plugin-transform-modules-commonjs: 7.20.11 to 7.21.2
        - eslint: 8.31.0 to 8.36.0
        - jest: 29.3.1 to 29.5.0
        - jest-environment-jsdom: 29.3.1 to 29.5.0
        - jsdoc: 4.0.0 to 4.0.2
        - sass: 1.57.1 to 1.59.3

### Fixed
- Issue Masterportal.#870: Features with `null` style were shown with default style. However, the default style is only supposed to be used for fallbacks; `null` style features must explicitly be invisible. This has been resolved.
- Style of legend is now always not clustered.

---

## 2.15.2 - 2023-03-14
### Changed
- Update parameters for getGeometryTypeFromService.getGeometryTypeFromWFS and getGeometryTypeFromService.getGeometryTypeFromOAF to pass wfsImgPath.

### Fixed
- Fix imports in createLegendInfo.js

---

## 2.15.1 - 2023-03-09
### Fixed
- The `labelField` attribute is now evaluated correctly for a text style.
- The styling for clustered features works now.

---

## 2.15.0 - 2023-02-28
### Added
- WebGL Render-Pipeline for all VectorLayer types can be called using {"renderer": "webgl"} in config.json

---

## 2.14.0 - 2023-02-22
### Added
- VectorStyle is now part of the masterportalAPI.
- The following packages have been installed:
    - use-resize-observer: 9.1.0

### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 7.1.0 to 7.2.2

---

## 2.13.0 - 2023-02-16
### Changed
- GeoJSON now also register a featuresloadend function if the source is a cluster.

---

## 2.12.0 - 2023-01-24
### Added
- Added support for Node LTS version 18.
- Add possibility to specify additional layerparams for a wmts layer, like opacity for example.
- Add possibility to make a 3DTilset layer transparent/opaque.
- In the gazetteer search the prefix `*` can now be switched off with the attribute `searchStreetBeforeWord`

### Changed
- The following packages have been updated:
    - dependencies:
        - core-js: 3.24.0 to 3.27.1
        - proj4: 2.8.0 to 2.8.1
    - devDependencies:
        - @babel/core: 7.18.9 to 7.20.12
        - @babel/plugin-transform-modules-commonjs: 7.18.6 to 7.20.11
        - canvas: 2.9.3 to 2.11.0
        - eslint: 8.20.0 to 8.31.0
        - husky: 8.0.1 to 8.0.3
        - jest: 28.1.3 to 29.3.1
        - jest-environment-jsdom: 28.1.3 to 29.3.1
        - jsdoc: 3.6.11 to 4.0.0
        - sass: 1.54.0 to 1.57.1

---

## 2.11.0 - 2022-11-24
### Added
- crossOrigin settings can now be passed to WMSSources (TileWMS, ImageWMS) via config.json or services.json

### Fixed
- Issue #847(Masterportal): searchAddress now keeps searching for house numbers if a digit was entered at the end of the search string

---

## 2.10.0 - 2022-11-03
### Added
- DPS-1313: Added custom DragPan interaction to add ability to use 2-Finger-Pan instead of 1-Finger-Pan on mobile devices

### Changed
- Exports in src/rawLayerList, src/crs.js and src/lib/load3DScript.js changed to export default {} to provide  ES-Syntax.

---

## 2.9.0 - 2022-10-25
### Changed
- Exports in src/rawLayerList and src/crs.js changed to module.exports to provide the possibility to stub the functions with sinon in masterportal.

---

## 2.8.0 - 2022-10-04
### Added
- Issue #814: Adding optional error callbacks and availability detection to layers.
- Added possibility to set initial features for layer vectorBase.

---

## 2.7.0 - 2022-09-14
### Changed
- The following packages have been updated:
    - dependencies:
        - ol: 6.15.1 to 7.1.0
        - olcs: 2.13.0 to 2.13.1

---

## 2.6.0 - 2022-09-06
### Added
- Added possibility to set initial features for layer vectorBase.

### Changed
- OAF: Fixed oaf recursion and a possibility to disable the CRS parameter is added.

---

## 2.5.1 - 2022-08-05
### Fixed
- Remove import of `defaultResolutions` for the vectorStyle layer

---

## 2.5.0 - 2022-08-05
### Added
- The following packages have been installed:
    - jest-environment-jsdom: 28.1.3

### Changed
- The following packages have been updated:
    - dependencies:
        - core-js: 3.16.1 to 3.24.0
        - ol: 6.14.1 to 6.15.1 (This also raised ol-mapbox-style from 7 to version 8)
        - proj4: 2.7.5 to 2.8.0
    - devDependencies:
        - @babel/core: 7.16.7 to 7.18.9
        - @babel/plugin-transform-modules-commonjs: 7.16.8 to 7.18.6
        - @parcel/transformer-sass: 2.2.0 to 2.6.2
        - canvas: 2.8.0 to 2.9.3
        - eslint: 7.32.0 to 8.20.0
        - husky: 7.0.1 to 8.0.1
        - jest: 27.4.0 to 28.1.3
        - jest-canvas-mock: 2.3.1 to 2.4.0
        - jsdoc: 3.6.7 to 3.6.11
        - parcel: 2.2.0 to 2.6.2
        - sass: 1.37.5 to 1.54.0
    - peerDependencies:
        - cesium: 1.88.0 to 1.95.0

---

## 2.4.0 - 2022-07-06
### Added
- Issue 776: Add 3D mode for WMTS layers.

### Fixed
- 3D: Handling of camera parameters at olcsmap are adapted.

---

## 2.3.0 - 2022-05-27
### Added
- Add a new layer type WMTS.
- A new layer typ Entities3D (e.g. layer with glb-files) is implemented and integrated into MaterportalAPI.

### Changed
- The following packages have been updated
    - ol: from 6.13.0 to version 6.14.1
- 3D Mode:
    - Default values are now set for the 3D Scene when creating the 3D Map.
    - Default values for the 3D Scene can be overwritten with the attribute `sceneOptions` any.
    - Default values of the 3D Scene are always set first. After that, attributes configured by the user are set.

### Fixed
- 3D Mode:
    - Vector layers like WFS, GeoJSON or OAF (OGC API - Features) are now displayed in 3D mode.
    - WMS layers of type `TileWMS` are now also displayed in 3D.
    - In 3D mode a pick position is now provided for clicked billboards.

---

## 2.2.0 - 2022-04-25
### Added
- Add a new layer type Vector tile layer.

---

## 2.1.1 - 2022-04-20
### Fixed
- Allow searchAddress to find street names with a prefix.

---

## 2.1.0 - 2022-04-04
### Added
- Add a new layer type OAf (Open API Features).

### Changed
- The WMS layer respects crs code at rawlayer. The WMS request now contains the attribute CRS. If not available, projection of the map is used.
- OAF
    - Changing the OAF attribute "featureType" into "collection"
    - Setting OAF output format only in GeoJSON
    - Removing unnecessary parameters

### Fixed
- Fix a vulnerability of third party libraries.

---

## 2.0.0 - 2022-03-18
### Added
- 3D functions are added to olcsMap.js.
- Gazetteer search:
    - Previous gazetteer searches can now be aborted by means of an `AbortController`.
    - Added the possibility to use the `geographicIdentifier` to display the search result.
- A new layer typ OAF (OGC API - Features) is implemented and integrated into MaterportalAPI
    - Features as parameter can be parsed as filter
- A new parameter "doNotLoadInitially" for WFS layer so that for the external filter, the filtering of feature will be first loaded

### Changed
- Gazetteer search:
    - The search now always returns points as coordinates, since the extent is used for polygons, which is not desired in the rule.
    - For `STREETS`, the point coordinate of the `STREET-AXIS` is now returned.
    - In the `"gazetteerUrl"` attribute the `service`, `request` and `version` URL parameters must now be specified. The default value has been changed from `"https://geodienste.hamburg.de/HH_WFS_GAGES"` to `"https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0"`.
- The following packages have been updated
    - ol: from 6.11.0 to version 6.13.0
- Changed required node version to `^16.13.2`.
- Changed required npm version to `^8.1.2`.

### Fixed
- The createVectorSource function now allows passing features as an argument.
- Gazetteer search: `strassenname`, `hausnummer` and `hausnummernzusatz ` are now also processed if they are returned by the gazetteer as strings.

---

## 1.10.0 - 2022-02-17
### Changed
- Folder abstraction renamed to maps and moved into src.
- WFS layer can now be loaded in the versions allowed by `ol`: 1.0.0, 1.1.0 and 2.0.0.

---

## 1.9.0 - 2022-02-10
### Added
- Added 3D tileset-Layer to layers and adapted example.
- Added 3D terrain-Layer to layers and adapted example.

### Changed
- The options.beforeLoading function is now only executed once in wfs before loading the features.

---

## 1.8.0 - 2022-01-14
### Added
- An alias is added to the coordinate system. This is required by GeoServer services.
- Added possibility to add any rawLayer attribute to wms layer request.
- Added VectorBaseLayer to layers
- The follow package were added
    - @parcel/transformer-sass version 2.2.0
    - parcel version 2.2.0
    - regenerator-runtime 0.13.9

### Changed
- The following packages have been updated
    - ol: from 6.9.0 to version 6.11.0
    - @babel/core: from 7.15.0 to version 7.16.7
    - @babel/plugin-transform-modules-commonjs: from 7.15.0 to version 7.16.8
    - jest: from 27.0.6 to version 27.4.0
- babel.config.js was replaced by babel.config.json. Now it can be watched for changes, and Babel transformations can be cached.
- The overall script tag needs the attribute type="module" to enable module usage. Look at the index.html in example-folder.

### Removed
- The follow package were removed
    - @babel/preset-env: because Parcel includes transpilation by default
    - babel-jest
    - babel-polyfill
    - parcel-bundler: replaced by parcel

---

## 1.7.1 - 2022-01-11
### Fixed
- WFS-Layer: the WFS version is taken into account when generating the WFS format.

---

## 1.7.0 - 2021-12-27
### Added
- An alias is added to the coordinate system. This is required by GeoServer services.
- Added WFS Layer that creates a VectorLayer and a VectorSource. Layer-params and loading-params can be passed as function parameters, options may contain functions to filter and style features. Clustering and WFS-filter are supported.
- Added possibility to add the parameter TIME to the wms layer request.
- Examples were extended by WFS-Layer.

### Changed
- The constructor of createMap in the abstraction layer changed. The order of the parameters (config, settings = {}, mapMode = "2D") changes to (config, mapMode = "2D", settings = {}).
- abstraction\ol\map.js was renamed to abstraction\ol\olMap.js and abstraction\olcs\map.js was renamed to abstraction\olcs\olcsMap.js

---

## 1.6.1 - 2021-12-07
### Changed
- SessionID from the WMS layer was removed and replaced by the CacheID in order to deal with deegree services.

---

## 1.6.0 - 2021-11-10
### Added
- The library Cesium is loaded on demand to generate a 3D map. Cesium must be provided by the user of this library.
- A 3D map can be generated. The generation of 2D and 3D maps is controlled by an abstraction layer.
- The example allows to switch between 2d and 3d map.
### Changed
- OpenLayers package updated from 6.6.1 to 6.9.0
- The WMS layer has been extended with layerParams and options. The LayerSource now contains a TileGrid if there are resolutions in the options. The source can also contain attributions.

---

## 1.5.0 - 2021-08-16
### Added
- The engine for npm version ">= 6.13.4" was added in the package.json
- The package "@babel/preset-env" version 7.15.0 was added.
- The package "core-js" version 3.16.1 was added.
- The package "husky" version 7.0.1 was added. In this case a pre-push hook to run unit tests and eslint before every git push.

### Changed
- The engine for node was updated to ">= 10.18.0" in the package.json
- The follow package were updated and in this case the eslint rules and the babel.config were adjusted
    - ol: from 6.5.0 to version 6.6.1
    - proj4: from 2.5.0 to version 2.7.5
    - xml2js: from 0.4.19 to version 0.4.23
    - @babel/core: from 7.1.6 to version 7.15.0
    - @babel/plugin-transform-modules-commonjs: from 7.1.0 to version 7.15.0
    - babel-jest: from 23.6.0 to version 27.0.6
    - canvas: from 2.1.0 to version 2.8.0
    - eslint: from 5.12.0 to version 7.32.0
    - jest-canvas-mock: from 1.1.0 to version 2.3.1
    - jsdoc: from 3.5.5 to version 3.6.7
    - parcel-bundler: from 1.10.3 to version 1.12.5
    - sass: from 1.14.3 to version 1.37.5

### Removed
- The package "babel-core" was removed.
- The package "babel-preset-es2015" was removed.

---

## 1.4.0 - 2021-05-27
### Changed
- OpenLayers package from 6.3.1 to 6.5.0
- Default backgroundImage is changed to ""

---

## 1.3.0 - 2020-05-25
### Added
- New parameters constrainResolution and constrainOnlyCenter to create the map view

---

## 1.2.0 - 2020-05-14
### Changed
- The dependency on the OL package has been updated to version 6:
    - The function getGetFeatureInfoUrl is changed into getFeatureInfoUrl
    - The function ol/source/Vector#clear() is changed into ol/source/Vector#refresh() to re-render a vector layer

### Fixed
- Loading layer form separat Layer file in unit test

---

## 1.1.0 - 2020-04-14
### Added
- New function to set the start resolution by resolution or zoom level
- An error handling during initial loading of the LayerList was added

### Changed
- The function getMapProjection is now available globally

### Fixed
- Fixes a timeout problem that occurred when initializing the layerList
- The projections have delivered duplicates, these are now filtered out

---

## 1.0.0 - 2019-07-29
- Initial implementation.
