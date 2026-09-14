import "regenerator-runtime/runtime";
import {TextEncoder, TextDecoder} from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

class Worker {
    constructor (stringUrl) {
        this.url = stringUrl;
        this.onmessage = () => {
            // empty
        };
    }

    postMessage (msg) {
        this.onmessage(msg);
    }
}
// a mock for web worker
window.Worker = Worker;

window.URL.createObjectURL = function () {
    // empty
};

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn()
    }));