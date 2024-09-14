function splitByFirstWhitespace(str: string): string[] {
    const index = str.indexOf(" ");
    const firstPart = str.substring(0, index);
    const secondPart = str.substring(index + 1);
    return [firstPart, secondPart];
  }

export {
  splitByFirstWhitespace,
}; 