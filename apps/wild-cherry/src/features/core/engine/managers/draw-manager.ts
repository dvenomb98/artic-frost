import {CoreFrame, CoreStoreInstance} from "@core/store/store";
import {CoreNode} from "@core/store/store";
import {CameraManager} from "./camera-manager";
import {
  setCtxProperties,
  setHighlightProperties,
  setTextProperties,
  startEndPointsFromPoints,
} from "../utils";
import {getMinMaxPoints} from "../collisions/utils";
import {generateGridProperties, GRID_SIZE, HIGHLIGHT_OFFSET} from "../theme";
import {TEXT_PADDING, wrapText} from "../text";

class DrawManager {
  private readonly storeInstance: CoreStoreInstance;
  private readonly cameraManager: CameraManager;

  constructor(storeInstance: CoreStoreInstance, cameraManager: CameraManager) {
    this.storeInstance = storeInstance;
    this.cameraManager = cameraManager;
  }

  public drawStore(ctx: CanvasRenderingContext2D) {
    const store = this.storeInstance.getState();
    this.draw(ctx, store.nodes, store.frame, store.isGridVisible);
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    nodes: CoreNode[],
    frame: CoreFrame | null,
    grid: boolean = false
  ) {
    if (grid) {
      this.drawGrid(ctx);
    }

    if (frame) {
      this.drawFrame(ctx, frame);
    }

    for (const node of nodes) {
      this.drawNode(ctx, node);
    }
  }

  public drawNode(
    ctx: CanvasRenderingContext2D,
    node: CoreNode,
    rewriteProperties: boolean = true
  ) {
    if (!node.points.length) {
      throw new Error("drawNode: node has no points");
    }
    if (rewriteProperties) {
      ctx.save();
      setCtxProperties(ctx, node.properties);
    }

    switch (node.type) {
      case "line": {
        this.drawLine(ctx, node);
        break;
      }

      case "rectangle": {
        this.drawRectangle(ctx, node);
        break;
      }
    }

    if (rewriteProperties) {
      ctx.restore();
    }
  }

  public drawFrame(
    ctx: CanvasRenderingContext2D,
    frame: CoreFrame,
    rewriteProperties: boolean = true
  ) {
    const {minX, maxX, minY, maxY} = getMinMaxPoints(frame.points);

    if (rewriteProperties) {
      ctx.save();
      setCtxProperties(ctx, frame.properties);
    }

    ctx.beginPath();
    ctx.roundRect(
      minX,
      minY,
      maxX - minX,
      maxY - minY,
      frame.properties.borderRadius
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (rewriteProperties) {
      ctx.restore();
    }
  }

  public drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const camera = this.cameraManager.getCamera();
    setCtxProperties(ctx, generateGridProperties(camera));

    const startX =
      Math.floor((camera.x - ctx.canvas.width / 2 / camera.scale) / GRID_SIZE) *
      GRID_SIZE;
    const endX =
      Math.ceil((camera.x + ctx.canvas.width / 2 / camera.scale) / GRID_SIZE) *
      GRID_SIZE;
    const startY =
      Math.floor(
        (camera.y - ctx.canvas.height / 2 / camera.scale) / GRID_SIZE
      ) * GRID_SIZE;
    const endY =
      Math.ceil((camera.y + ctx.canvas.height / 2 / camera.scale) / GRID_SIZE) *
      GRID_SIZE;

    for (let x = startX; x <= endX; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, startY - GRID_SIZE);
      ctx.lineTo(x, endY + GRID_SIZE);
      ctx.stroke();
      ctx.closePath();
    }

    for (let y = startY; y <= endY; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(startX - GRID_SIZE, y);
      ctx.lineTo(endX + GRID_SIZE, y);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  }

  private drawLine(ctx: CanvasRenderingContext2D, node: CoreNode) {
    const {startX, startY, endX, endY} = startEndPointsFromPoints(node.points);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();

    if (node.highlight) {
      setHighlightProperties(ctx);
      const offset = HIGHLIGHT_OFFSET + 2;
      const {minX, maxX, minY, maxY} = getMinMaxPoints(node.points);

      ctx.beginPath();
      ctx.roundRect(
        minX - offset,
        minY - offset,
        maxX - minX + offset * 2,
        maxY - minY + offset * 2,
        node.properties.borderRadius
      );
      ctx.stroke();
      ctx.closePath();
    }
  }

  private drawRectangle(ctx: CanvasRenderingContext2D, node: CoreNode) {
    if (node.type !== "rectangle") {
      throw new Error("drawRectangle: node is not a rectangle");
    }
    const {minX, maxX, minY, maxY} = getMinMaxPoints(node.points);
    const width = maxX - minX;
    const height = maxY - minY;

    ctx.beginPath();
    ctx.roundRect(minX, minY, width, height, node.properties.borderRadius);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (node.rawText) {
      ctx.save();
      setTextProperties(ctx, node.textProperties);
      const lines = wrapText(ctx, node.rawText, width);

      let paddingY = TEXT_PADDING;

      for (const line of lines) {
        ctx.fillText(line, minX + TEXT_PADDING, minY + paddingY, width);
        paddingY += 10;
      }

      ctx.restore();
    }

    if (node.highlight) {
      setHighlightProperties(ctx);
      ctx.beginPath();
      ctx.roundRect(
        minX - HIGHLIGHT_OFFSET,
        minY - HIGHLIGHT_OFFSET,
        width + HIGHLIGHT_OFFSET * 2,
        height + HIGHLIGHT_OFFSET * 2,
        node.properties.borderRadius
      );
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export {DrawManager};
