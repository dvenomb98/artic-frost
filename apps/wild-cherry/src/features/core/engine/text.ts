import {TCanvasKeyDownEvent} from "../lib/types";

const TEXT_PADDING = 20;

function getLineHeight(fontSize: number) {
  return fontSize * 1.2;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testLineWidth = ctx.measureText(testLine).width;

    if (testLineWidth <= maxWidth) {
      currentLine = testLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function getCharFromEvent(e: TCanvasKeyDownEvent) {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    return e.key;
  }

  return null;
}

export {TEXT_PADDING, getLineHeight, getCharFromEvent, wrapText};
