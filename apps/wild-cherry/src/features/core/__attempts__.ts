// This file show how i approach a certain situation and challenges at the first till i found a "better solution"

// 1. Flood fill algo with recursion
// Its not good idea trust me
// Worked on very small images like 10x10 due to call stack.
// Changed it to queue based later, but still need lot of improvements for pattern-filling.

// function floodFill(
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number,
//   fillColor: string
// ) {
//   const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
//   const uint32array = new Uint32Array(imageData.data.buffer);
//   const color = getFillColorAsUint32(fillColor);
//   const origin = uint32array[y * ctx.canvas.width + x];

//   if (!origin) throw new Error("Origin not found. Probably outside of canvas.");

//   if (color === origin) return;

//   function fill(x: number, y: number) {
//     if (0 > x || 0 > y || x >= ctx.canvas.width || y >= ctx.canvas.height) {
//       return;
//     }

//     const index = y * ctx.canvas.width + x;
//     if (uint32array[index] === origin && uint32array[index] !== color) {
//       uint32array[index] = color;
//       fill(x - 1, y);
//       fill(x + 1, y);
//       fill(x, y - 1);
//       fill(x, y + 1);
//     }
//   }
//   fill(x, y);
//   const uint8ClampedArray = new Uint8ClampedArray(uint32array.buffer);
//   const newImage = new ImageData(uint8ClampedArray, ctx.canvas.width);
//   ctx.putImageData(newImage, 0, 0);
// }
