import {LOGGER} from "@/lib/logger";

type RenderReason =
  | "zoom"
  | "pan"
  | "pointer-start"
  | "pointer-move"
  | "pointer-end"
  | "frame-start"
  | "frame-move"
  | "frame-end"
  | "drawing-start"
  | "drawing-move"
  | "drawing-end"
  | "text-editing"
  | "wheel"
  | "interaction-start"
  | "manual"
  | "unknown";

interface Renderable {
  render(): void;
}

class Renderer {
  private pendingRender = false;
  private renderReasons: Set<RenderReason> = new Set();
  private renderable: Renderable;
  private frameId: number | null = null;

  // Performance tracking
  private renderCount = 0;
  private lastFpsCheck = 0;
  private frameStartTime = 0;

  constructor(renderable: Renderable) {
    this.renderable = renderable;
  }

  /**
   * Schedule a render for the next animation frame.
   * Multiple calls within the same frame are automatically batched.
   *
   * @param reason - The reason for the render (for debugging)
   */
  public scheduleRender(reason: RenderReason = "unknown"): void {
    this.renderReasons.add(reason);

    if (!this.pendingRender) {
      this.pendingRender = true;
      this.frameId = requestAnimationFrame(() => {
        this.executeRender();
      });
    }
  }

  /**
   * Force an immediate render, bypassing the RAF batching.
   * Use sparingly - typically only for initial render or testing.
   */
  public renderImmediately(reason: RenderReason = "manual"): void {
    if (this.pendingRender) {
      this.cancelScheduledRender();
    }

    this.renderReasons.add(reason);
    this.executeRender();
  }

  /**
   * Cancel any pending render request.
   * Useful when the component is unmounting or engine is being destroyed.
   */
  public cancelScheduledRender(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.pendingRender = false;
    this.renderReasons.clear();
  }

  /**
   * Get current render statistics for debugging.
   */
  public getStats() {
    return {
      isPending: this.pendingRender,
      pendingReasons: Array.from(this.renderReasons),
      renderCount: this.renderCount,
    };
  }

  private executeRender(): void {
    this.frameStartTime = performance.now();

    const reasons = Array.from(this.renderReasons);

    try {
      this.verifyPerformance(
        () => {
          this.renderable.render();
        },
        `render(${reasons.join(", ")})`
      );

      this.trackFrameRate();
    } catch (error) {
      LOGGER.error(
        "Render failed:",
        error instanceof Error ? error : new Error(String(error))
      );
      LOGGER.log("Render reasons:", reasons.join(", "));
    } finally {
      this.cleanup();
    }
  }

  private cleanup(): void {
    this.pendingRender = false;
    this.renderReasons.clear();
    this.frameId = null;
    this.renderCount++;
  }

  private verifyPerformance(callback: () => void, name: string): void {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;

    if (duration > 16) {
      LOGGER.warn(`Slow render: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  private trackFrameRate(): void {
    const now = performance.now();

    // Log FPS every 5 seconds in debug mode
    if (now - this.lastFpsCheck > 5000) {
      const fps = (this.renderCount * 1000) / (now - this.lastFpsCheck);
      LOGGER.log(`Render FPS: ${fps.toFixed(1)} (${this.renderCount} frames)`);

      this.lastFpsCheck = now;
      this.renderCount = 0;
    }
  }
}

export {Renderer, type Renderable, type RenderReason};
