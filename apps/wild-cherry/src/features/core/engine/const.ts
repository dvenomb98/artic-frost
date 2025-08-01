const DEFAULT_CAMERA = {
  x: 0,
  y: 0,
  scale: 1,
};

const GLOBAL_CONFIG = {
  /**
   * Min node points to be drawn before it is considered valid.
   */
  MIN_NODE_POINTS: 2,
  /**
   * Threshold for hit detection.
   */
  HIT_THRESHOLD: 10,
  /**
   * Offset for highlight.
   */
  HIGHLIGHT_OFFSET: 8,
  /**
   * Size of the grid.
   */
  GRID_SIZE: 50,
  /**
   * Border radius for the nodes.
   */
  BORDER_RADIUS: 8,
  /**
   * Text node properties.
   */
  TEXT_NODE: {
    /**
     * Default(fixed) height of the text node.
     */
    DEFAULT_HEIGHT: 32,
    /**
     * Padding X for the text node.
     */
    PADDING_X: 20,
    /**
     * Line offset for the text.
     */
    LINE_OFFSET: 1.2,
    /**
     * Minimum number of characters for the text node.
     */
    MIN_CHARS: 1,
  },
};

export {DEFAULT_CAMERA, GLOBAL_CONFIG};
