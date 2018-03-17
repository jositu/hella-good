// define the dimensions of the graph display wrt window
let marginMap = { top: 10, right: 10, bottom: 50, left: 120 };
let fullWidthMap = 900;
let fullHeightMap = 500;
let widthMap = fullWidthMap - marginMap.right - marginMap.left;
let heightMap = fullHeightMap - marginMap.top - marginMap.bottom;

let marginSankey = { top: 0, right: 0, bottom: 0, left: 0 };
let fullWidthSankey = 1200;
let fullHeightSankey = 500;
let widthSankey = fullWidthSankey - marginSankey.right - marginSankey.left;
let heightSankey = fullHeightSankey - marginSankey.top - marginSankey.bottom;

let marginPcoords = { top: 100, right: 100, bottom: 100, left: 100 };
let fullWidthPcoords = 1300;
let fullHeightPcoords = 1000;
let widthPcoords = fullWidthPcoords - marginPcoords.right - marginPcoords.left;
let heightPcoords = fullHeightPcoords - marginPcoords.top - marginPcoords.bottom;



d3.csv('', (data) => {

});