const svgToDataUri = require("mini-svg-data-uri");
 
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");


function BackgroundGridPlugin({ matchUtilities, theme }) {
  matchUtilities(
    {
      "bg-grid": value =>  {
        console.log(value)
        return ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
        })},
      "bg-grid-small": value => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-dot": value => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
        )}")`,
      }),
    },
    { values: flattenColorPalette(theme("colors")), type: "color" }
  );
}

module.exports = BackgroundGridPlugin;