import * as stylePointCircle from "../../../../src/vectorStyle/styles/point/stylePointCircle";
import {Style, Circle} from "ol/style.js";

describe("stylePointCircle.js", () => {
    describe("createCircleStyle", () => {
        const attributes = {
                circleRadius: 15,
                circleFillColor: [10, 200, 100, 0.5],
                circleStrokeColor: [10, 200, 100, 0.5],
                circleStrokeWidth: 1,
                clusterCircleRadius: 20,
                clusterCircleFillColor: [10, 200, 100, 0.5],
                clusterCircleStrokeColor: [10, 200, 100, 0.5],
                clusterCircleStrokeWidth: 1
            },
            feature = {
                getProperties: () => {
                    return {
                        name: "singleFeature",
                        id: "123"
                    };
                },
                get: () => {
                    return [];
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

        it("should create circle style", () => {
            const style = stylePointCircle.createCircleStyle(attributes, feature, false);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Circle);
            expect(style.getImage().getRadius()).toEqual(15);
            expect(style.getImage().getFill().getColor()).toEqual(attributes.circleFillColor);
        });
        it("should create circle cluster style", () => {
            const style = stylePointCircle.createCircleStyle(attributes, clusteredFeature, true);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Circle);
            expect(style.getImage().getRadius()).toEqual(20);
            expect(style.getImage().getFill().getColor()).toEqual(attributes.clusterCircleFillColor);
        });
        it("should create circle not cluster style - respects feature.get('features')", () => {
            const style = stylePointCircle.createCircleStyle(attributes, feature, true);

            expect(style).toBeInstanceOf(Style);
            expect(style.getImage()).toBeInstanceOf(Circle);
            expect(style.getImage().getRadius()).toEqual(15);
            expect(style.getImage().getFill().getColor()).toEqual(attributes.circleFillColor);
        });
    });
});