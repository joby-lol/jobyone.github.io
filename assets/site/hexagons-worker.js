var width;
var height;
var grid = [];
var all_sites = [];
var changed = [];
var running_step = false;
var color_resolution = 1;
var mouse = null;

const blob_radius = 10;
const blob_weight = 1 / 10;
const mouse_color = [255, 255, 0];
const blob_points = [[0, 0, 1]];
for (var x = 1; x < blob_radius; x++) {
  for (var y = 1; y < blob_radius; y++) {
    if (x + y < blob_radius) {
      blob_points.push([x, y, 1 / (x + y)]);
      blob_points.push([-x, y, 1 / (x + y)]);
      blob_points.push([x, -y, 1 / (x + y)]);
      blob_points.push([-x, -y, 1 / (x + y)]);
    }
  }
}

const colors = [
  [255, 127, 0],
  [0, 255, 255],
  [255, 0, 255]
];

const blobs = colors.map(color => {
  return {
    color: color,
    position: {
      x: Math.random(),
      y: Math.random(),
    },
    momentum: {
      x: Math.random() - 0.5,
      y: Math.random() - 0.5
    },
    points: blob_points
  };
});

var blob_colors = [];

onmessage = function (e) {
  switch (e.data.action) {
    case 'rebuild':
      postMessage({ action: 'rebuild', grid: rebuild(e.data.width, e.data.height) });
      break;
    case 'mouse':
      mouse = e.data.position;
      break;
  }
}

setInterval(runStep, 1000 / 60);
function runStep() {
  if (running_step) return;
  running_step = true;
  all_sites.sort(Math.random).forEach((site) => {
    var color = site.color;
    // average neighbor colors
    const neighbor_colors = site.neighbors.sort(Math.random)
      .map(n => getSite(n[0], n[1]))
      .map(n => n.color).filter(c => c);
    neighbor_colors.forEach(c => color = mergeColors(c, color, 1 / neighbor_colors.length))
    // apply blob colors
    if (blob_colors[site.x] && blob_colors[site.x][site.y]) {
      blob_colors[site.x][site.y].forEach(c => {
        color = mergeColors(color, c.color, 1, c.weight * blob_weight);
      });
    }
    // apply color under mouse
    if (mouse && mouse[0] == site.x && mouse[1] == site.y) {
      color = mergeColors(color, mouse_color, 1, 2);
    }
    // send updated color
    if (color) setColor(
      site.x,
      site.y,
      color
    );
  });
  running_step = false;
}

// move blobs around and update the index of where they are on the grid
setInterval(simulateBlobs, 1000 / 30);
function simulateBlobs() {
  var new_blob_colors = [];
  blobs.forEach((blob) => {
    blob.position.x = zeroMod(blob.position.x + (blob.momentum.x / 300), 1);
    blob.position.y = zeroMod(blob.position.y + (blob.momentum.y / 300), 1);
    const grid_x = zeroMod(Math.floor(width * blob.position.x), width);
    const grid_y = zeroMod(Math.floor(width * blob.position.y), height);
    blob.points.forEach(point => {
      const x = grid_x + point[0];
      const y = grid_y + point[1];
      const weight = point[2];
      if (!new_blob_colors[x]) new_blob_colors[x] = [];
      if (!new_blob_colors[x][y]) new_blob_colors[x][y] = [];
      new_blob_colors[x][y].push({
        color: blob.color,
        weight: weight
      });
    });
  });
  // save new blob positions
  blob_colors = new_blob_colors;
}

function zeroMod(n, mod) {
  n = n % mod;
  if (n < 0) n += mod;
  return n;
}

function mergeColors(a, b, share_a = 1, share_b = 1) {
  a = a ?? b;
  b = b ?? a;
  return [
    (a[0] * share_a + b[0] * share_b) / (share_a + share_b),
    (a[1] * share_a + b[1] * share_b) / (share_a + share_b),
    (a[2] * share_a + b[2] * share_b) / (share_a + share_b)
  ];
}

function sendUpdate(site) {
  site.changed = true;
  postMessage({ action: 'update', site: site });
  site.changed = false;
}

function setColor(x, y, color) {
  site = getSite(x, y);
  color = color.map(c => Math.round(c / color_resolution) * color_resolution);
  if (site.color && site.color.join(',') == color.join(',')) return;
  site.color = color;
  sendUpdate(site);
}

function getSite(x, y) {
  x = zeroMod(x, width);
  y = zeroMod(y, height);
  return grid[x][y];
}

// build a new grid of the given dimensions, migrating site state when possible
function rebuild(new_width, new_height) {
  width = new_width;
  height = new_height;
  const new_grid = [];
  all_sites = [];
  for (var x = 0; x < width; x++) {
    const row = [];
    for (var y = 0; y < height; y++) {
      const site = getSite(x, y) ?? newSite(x, y);
      row.push(site);
      all_sites.push(site);
    }
    new_grid.push(row);
  }
  grid = new_grid;
  return grid;
}

function getSite(x, y) {
  if (!grid[x]) return null;
  if (!grid[x][y]) return null;
  return grid[x][y];
}

function newSite(x, y) {
  return {
    x: x,
    y: y,
    color: null,
    neighbors: neighborCoordinates(x, y)
  };
}

function neighborCoordinates(x, y) {
  if (x % 2) {
    var neighbors = [
      [0, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0]
    ];
  } else {
    var neighbors = [
      [0, -1],
      [1, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
      [-1, -1]
    ];
  }
  return neighbors.map((e) => [zeroMod((x + e[0]), width), zeroMod((y + e[1]), height)]);
}
