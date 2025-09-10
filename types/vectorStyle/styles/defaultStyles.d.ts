export default defaultStyle;
declare namespace defaultStyle {
    namespace point {
        export let feature: any;
        export let isClustered: boolean;
        export let type: string;
        export let imagePath: string;
        export let imageName: string;
        export let imageWidth: number;
        export let imageHeight: number;
        export let imageScale: number;
        export let imageOffsetX: number;
        export let imageOffsetY: number;
        export let imageOffsetXUnit: string;
        export let imageOffsetYUnit: string;
        export let circleRadius: number;
        import circleFillColor = defaultColors.fill;
        export { circleFillColor };
        import circleStrokeColor = defaultColors.stroke;
        export { circleStrokeColor };
        export let circleStrokeWidth: number;
        export let clusterType: string;
        export let clusterCircleRadius: number;
        import clusterCircleFillColor = defaultColors.fill;
        export { clusterCircleFillColor };
        import clusterCircleStrokeColor = defaultColors.stroke;
        export { clusterCircleStrokeColor };
        export let clusterCircleStrokeWidth: number;
        export let clusterImageName: string;
        export let clusterImageWidth: number;
        export let clusterImageHeight: number;
        export let clusterImageScale: number;
        export let clusterImageOffsetX: number;
        export let clusterImageOffsetY: number;
        export let circleSegmentsRadius: number;
        export let circleSegmentsStrokeWidth: number;
        import circleSegmentsBackgroundColor = defaultColors.background;
        export { circleSegmentsBackgroundColor };
        import scalingValueDefaultColor = defaultColors.stroke;
        export { scalingValueDefaultColor };
        export let circleSegmentsGap: number;
        export let circleBarScalingFactor: number;
        export let circleBarRadius: number;
        export let circleBarLineStroke: number;
        import circleBarCircleFillColor = defaultColors.fill;
        export { circleBarCircleFillColor };
        import circleBarCircleStrokeColor = defaultColors.stroke;
        export { circleBarCircleStrokeColor };
        export let circleBarCircleStrokeWidth: number;
        import circleBarLineStrokeColor = defaultColors.stroke;
        export { circleBarLineStrokeColor };
        export let scalingAttribute: string;
        export let rotation: number;
        export let rsRadius: number;
        export let rsRadius2: any;
        export let rsPoints: number;
        export let rsFillColor: number[];
        export let rsStrokeColor: number[];
        export let rsStrokeWidth: number;
        export let rsAngle: number;
        export let rsScale: any;
    }
    namespace line {
        import lineStrokeColor = defaultColors.stroke;
        export { lineStrokeColor };
        export let lineStrokeWidth: number;
        export let lineStrokeCap: string;
        export let lineStrokeJoin: string;
        export let lineStrokeDash: any;
        export let lineStrokeDashOffset: number;
        export let lineStrokeMiterLimit: number;
    }
    namespace polygon {
        import polygonStrokeColor = defaultColors.stroke;
        export { polygonStrokeColor };
        export let polygonStrokeWidth: number;
        export let polygonStrokeCap: string;
        export let polygonStrokeJoin: string;
        export let polygonStrokeDash: any;
        export let polygonStrokeDashOffset: number;
        export let polygonStrokeMiterLimit: number;
        import polygonFillColor = defaultColors.fill;
        export { polygonFillColor };
        export let polygonFillHatch: any;
    }
    namespace text {
        export let textAlign: string;
        export let textFont: string;
        export let textScale: number;
        export let textOffsetX: number;
        export let textOffsetY: number;
        import textFillColor = defaultColors.textFill;
        export { textFillColor };
        import textStrokeColor = defaultColors.textStroke;
        export { textStrokeColor };
        export let textStrokeWidth: number;
        export let labelField: string;
        export let textSuffix: string;
        let rotation_1: number;
        export { rotation_1 as rotation };
        export let clusterTextType: string;
        export let clusterText: string;
        export let clusterTextAlign: string;
        export let clusterTextFont: string;
        export let clusterTextScale: number;
        export let clusterTextOffsetX: number;
        export let clusterTextOffsetY: number;
        import clusterTextFillColor = defaultColors.textFill;
        export { clusterTextFillColor };
        import clusterTextStrokeColor = defaultColors.textStroke;
        export { clusterTextStrokeColor };
        export let clusterTextStrokeWidth: number;
    }
    namespace defaultMapMarkerPoint {
        let styleId: string;
        let rules: {
            style: {
                type: string;
                imageName: string;
                imagePath: string;
                imageScale: number;
                imageOffsetY: number;
                imageOffsetYUnit: string;
            };
        }[];
    }
    namespace defaultMapMarkerPolygon {
        let styleId_1: string;
        export { styleId_1 as styleId };
        let rules_1: {
            style: {
                polygonStrokeColor: number[];
                polygonStrokeWidth: number;
                polygonFillColor: number[];
                polygonStrokeDash: number[];
            };
        }[];
        export { rules_1 as rules };
    }
    namespace defaultAdditionalMapMarkerPolygon {
        let styleId_2: string;
        export { styleId_2 as styleId };
        let rules_2: {
            style: {
                polygonStrokeColor: number[];
                polygonStrokeWidth: number;
                polygonFillColor: number[];
                polygonStrokeDash: number[];
            };
        }[];
        export { rules_2 as rules };
    }
    namespace defaultHighlightFeaturesPoint {
        let styleId_3: string;
        export { styleId_3 as styleId };
        let rules_3: {
            style: {
                type: string;
                circleFillColor: number[];
                circleRadius: number;
            };
        }[];
        export { rules_3 as rules };
    }
    namespace defaultHighlightFeaturesPolygon {
        let styleId_4: string;
        export { styleId_4 as styleId };
        let rules_4: {
            style: {
                polygonStrokeColor: number[];
                polygonStrokeWidth: number;
                polygonFillColor: number[];
                polygonStrokeDash: number[];
            };
        }[];
        export { rules_4 as rules };
    }
    namespace defaultHighlightFeaturesLine {
        let styleId_5: string;
        export { styleId_5 as styleId };
        let rules_5: {
            style: {
                polygonStrokeColor: number[];
                polygonStrokeWidth: number;
                polygonFillColor: number[];
                polygonStrokeDash: number[];
            };
        }[];
        export { rules_5 as rules };
    }
}
declare namespace defaultColors {
    let background: number[];
    let fill: number[];
    let stroke: number[];
    let textFill: number[];
    let textStroke: number[];
}
