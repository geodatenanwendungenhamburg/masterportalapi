/**
 * Draws a hatch pattern to the context element.
 * @param {CanvasRenderingContext2D} context draw context
 * @param {Number} size side length of context
 * @param {(("diagonal"|"zig-line"|"diagonal-right"|"zig-line-horizontal"|"rectangle"|"triangle"|"diamond"|"circle")|Object)} pattern Name of pattern library object, or draw instructions as described in style.json.md
 * @returns {void} side-effect on context
 */
export function drawHatch(context: CanvasRenderingContext2D, size: number, pattern: (("diagonal" | "zig-line" | "diagonal-right" | "zig-line-horizontal" | "rectangle" | "triangle" | "diamond" | "circle") | any)): void;
