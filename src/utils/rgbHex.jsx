
let brightness = -50;

export const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const mergeColor = (color1,color2) => {
  let rgb1 = hexToRgb(color1);
  let rgb2 = hexToRgb(color2);
  return rgbToHex(Math.round((rgb1.r+rgb2.r)/2) , Math.round((rgb1.g+rgb2.g)/2), Math.round((rgb1.b+rgb2.b)/2) );
};

export const changeBrightness = (color) => {
  let rgb = hexToRgb(color);
  let r = (rgb.r + brightness >= 0)?rgb.r + brightness:0;
  let g = (rgb.g + brightness >= 0)?rgb.g + brightness:0;
  let b = (rgb.b + brightness >= 0)?rgb.b + brightness:0;
  return rgbToHex(r,g,b);
};