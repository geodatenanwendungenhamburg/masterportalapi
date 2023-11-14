import * as stylePointIcon from "../../../../src/vectorStyle/styles/point/stylePointIcon";
import {Style, Icon} from "ol/style.js";

describe("stylePointIcon.js", () => {
    describe("getRotationValue", function () {
        it("should return correct rotation value", function () {
            expect(stylePointIcon.getRotationValue({isDegree: true, value: "90"})).toEqual(1.5707963267948966);
            expect(stylePointIcon.getRotationValue({isDegree: false, value: "10"})).toEqual(10);
            expect(stylePointIcon.getRotationValue()).toEqual(0);
        });
        it("should return correct rotation value from an object path", function () {
            const featureValues = {
                geometryName: "geom",
                id: "DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2",
                angle: 45
            };

            expect(stylePointIcon.getRotationValue({isDegree: false, value: "@angle"}, featureValues)).toEqual(45);
        });
    });
    describe("createIconStyle", () => {
        const attributes = {
                imagePath: "/imagePath",
                imageName: "bild.svg",
                imageWidth: 10,
                imageHeight: 20,
                imageScale: 1,
                imageOffsetX: 0,
                imageOffsetY: 0,
                imageOffsetXUnit: "px",
                imageOffsetYUnit: "px",
                rotation: 0
            },
            clusterAttributes = {
                clusterImageName: "bild.svg",
                clusterImageWidth: 10,
                imagePath: "/imagePath",
                clusterImageHeight: 20,
                clusterImageScale: 1
            },
            feature = {
                getProperties: () => {
                    return {
                        name: "singleFeature",
                        id: "123"
                    };
                }
            },
            clusteredFeature = {
                get: () => {
                    return [
                        {
                            name: "singleFeature1",
                            id: "123"
                        },
                        {
                            name: "singleFeature2",
                            id: "456"
                        }
                    ];
                }
            };

        it("should create icon point style with imageName without path", () => {
            expect(stylePointIcon.createIconStyle(attributes, feature, false)).toBeInstanceOf(Style);
            expect(stylePointIcon.createIconStyle(clusterAttributes, clusteredFeature, true)).toBeInstanceOf(Style);
            expect(stylePointIcon.createIconStyle(attributes, feature, false).getImage()).toBeInstanceOf(Icon);
            expect(stylePointIcon.createIconStyle(attributes, feature, false).getImage().getScale()).toEqual(1);
        });
        it("should create icon point style with pure imageName and wfsImgPath exists", () => {
            let style = null;

            attributes.imageName = "Rathaus.svg";
            attributes.imagePath = "./geodaten/icons/";
            style = stylePointIcon.createIconStyle(attributes, feature, false);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual(attributes.imagePath + attributes.imageName);
        });
        it("should create clustered icon point style with pure imageName and wfsImgPath exists", () => {
            let style = null;

            clusterAttributes.clusterImageName = "Rathaus.svg";
            clusterAttributes.imagePath = "./geodaten/icons/";
            style = stylePointIcon.createIconStyle(clusterAttributes, clusteredFeature, true);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual(clusterAttributes.imagePath + clusterAttributes.clusterImageName);
        });
        it("should create icon point style with path in imageName and wfsImgPath exists", () => {
            let style = null;

            attributes.imageName = "/svg/poi/Rathaus.svg";
            attributes.imagePath = "https://localhost:9001/portal/basic/geodaten/icons/";
            style = stylePointIcon.createIconStyle(attributes, feature, false);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual(attributes.imagePath + attributes.imageName);
        });
        it("should create clustered icon point style with path in imageName and wfsImgPath exists", () => {
            let style = null;

            clusterAttributes.clusterImageName = "/svg/poi/Rathaus.svg";
            clusterAttributes.imagePath = "https://localhost:9001/portal/basic/geodaten/icons/";
            style = stylePointIcon.createIconStyle(clusterAttributes, clusteredFeature, true);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual(clusterAttributes.imagePath + clusterAttributes.clusterImageName);
        });
        it("should create icon point style with whole path in imageName and wfsImgPath is empty", () => {
            let style = null;

            attributes.imageName = "https://localhost:9001/portal/basic/geodaten/icons/svg/poi/Rathaus.svg";
            style = stylePointIcon.createIconStyle(attributes, feature, false);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual(attributes.imageName);
        });
        it("should create clustered icon point style with whole path in imageName and wfsImgPath is empty", () => {
            let style = null;

            clusterAttributes.clusterImageName = "https://localhost:9001/portal/basic/geodaten/icons/svg/poi/Rathaus.svg";
            clusterAttributes.imagePath = "";
            style = stylePointIcon.createIconStyle(clusterAttributes, clusteredFeature, true);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual(clusterAttributes.clusterImageName);
        });
        it("should create icon point style with svg", () => {
            let style = null;

            attributes.imageName = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#E10019' class='bi bi-geo-fill' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z'/></svg>";
            style = stylePointIcon.createIconStyle(attributes, feature, false);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Icon);
            expect(style.getImage().getSrc()).toEqual("data:image/svg+xml;charset=utf-8," + encodeURIComponent(attributes.imageName));
        });
        it("should create cluster icon point style", () => {
            expect(stylePointIcon.createIconStyle(clusterAttributes, clusteredFeature, true)).toBeInstanceOf(Style);
            expect(stylePointIcon.createIconStyle(clusterAttributes, clusteredFeature, true).getImage()).toBeInstanceOf(Icon);
        });
    });

    describe("createSVGStyle", function () {
        it("should create icon point style", function () {
            expect(stylePointIcon.createSVGStyle("test")).toBeInstanceOf(Style);
            expect(stylePointIcon.createSVGStyle("test").getImage()).toBeInstanceOf(Icon);
            expect(stylePointIcon.createSVGStyle("test").getImage().getSrc()).toEqual("data:image/svg+xml;charset=utf-8,test");
        });
    });
});