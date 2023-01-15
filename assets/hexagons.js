document.addEventListener('DOMContentLoaded', () => {

  // setting this smaller improves performance a bit
  const grid_size = 30;
  const blob_strength = 1; // scale for how much blobs affect colors
  const blob_speed = 0.0002; // scale for how fast blobs move
  const blob_repulsion = 0.05; // how strongly blobs repulse each other
  const simulation_fps = 15;
  const colors = [
    [255, 127, 0],
    [0, 255, 255],
    [255, 0, 255]
  ];

  // some math/svg setup
  const svg = document.getElementById('hexagon-background');
  svg.classList.add('activated');
  const angle = (2 * Math.PI) / 6;
  const sin = Math.sin(angle);
  const slope = sin / Math.cos(angle);

  // paramaters for while it's running
  var grid_width = grid_size;
  var grid_height;
  var radius;
  var height_step;
  var mouse_x;
  var mouse_y;
  var grid = [];

  // generate the list of color blobs, and their points' weights and positions relative to their origin
  const blobs = colors.map((color) => {
    const points = [[0, 0, 1]];
    const distance = 10;
    const spread = 3;
    for (var r = 1; r <= distance; r++) {
      var count = spread + r;
      for (var n = 0; n < count; n++) {
        var angle = ((2 * Math.PI) / count) * n;
        points.push([Math.cos(angle), Math.sin(angle), distance / distance / r]);
      }
    }
    return {
      color: color,
      position: [Math.random(), Math.random()],
      momentum: [
        (Math.random() * 0.9 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
        (Math.random() * 0.9 + 0.1) * (Math.random() < 0.5 ? -1 : 1)
      ],
      points: points
    };
  });

  buildGrid();
  setInterval(animateBlobs, 1000 / simulation_fps);
  window.requestAnimationFrame(animateGrid);
  window.addEventListener("resize", debounce(buildGrid));

  function applyBlobColors() {
    blobs.forEach((blob) => {
      // convert position to pixel coordinates
      const position = [
        blob.position[0] * svg.clientWidth,
        blob.position[1] * svg.clientHeight
      ];
      // convert abstract point coordinates to actual current pixel coordinates
      const points = blob.points.map((point) => {
        return [
          (point[0] * radius * (grid_size / 5) + position[0]) % svg.clientWidth,
          (point[1] * radius * (grid_size / 5) + position[1]) % svg.clientHeight,
          point[2] * blob_strength
        ];
      });
      // loop through points and apply their color to the hexagon they are under
      points.forEach((point) => {
        const hexagon = hexagonAtPixels(point[0], point[1]);
        if (!hexagon) return;
        if (hexagon.color) {
          // if this hexagon already has a color, blend it with the blob's color
          color = [
            (hexagon.color[0] + blob.color[0] * point[2]) / (point[2] + 1),
            (hexagon.color[1] + blob.color[1] * point[2]) / (point[2] + 1),
            (hexagon.color[2] + blob.color[2] * point[2]) / (point[2] + 1)
          ];
          setHexagonColor(hexagon, color);
          // otherwise just set it to the blob's color
        } else setHexagonColor(hexagon, blob.color);
      });
    });
  }

  function animateBlobs() {
    blobs.forEach((blob, blob_i) => {
      // convert position to pixel coordinates
      const position = [
        blob.position[0] * svg.clientWidth,
        blob.position[1] * svg.clientHeight
      ];
      // move blob according to rules
      blob.position[0] += blob.momentum[0] * blob_speed;
      blob.position[1] +=
        blob.momentum[1] * blob_speed * (svg.clientWidth / svg.clientHeight);
      // normalize position back into 0 <= c < 1
      blob.position = blob.position.map((c) => {
        if (c < 0) return 1 - c;
        else return c - Math.floor(c);
      });
      // repulse other blobs
      blobs.forEach((other_blob, other_i) => {
        if (other_i == blob_i) return; // skip self
        other_blob.momentum = other_blob.momentum.map((c, i) => {
          if (other_blob.position[i] < blob.position[i])
            return (
              c - blob_repulsion * (blob.position[i] - other_blob.position[i])
            );
          if (other_blob.position[i] > blob.position[i])
            return (
              c + blob_repulsion * (other_blob.position[i] - blob.position[i])
            );
          return c;
        });
      });
    }); //end blobs foreach
  }

  window.addEventListener("mousemove", (e) => {
    mouse_x = e.pageX - svg.getBoundingClientRect().left - window.scrollX;
    mouse_y = e.pageY - svg.getBoundingClientRect().top - window.scrollY;
  });

  function animateGrid() {
    // apply blob colors
    applyBlobColors();
    // force color of hexagon under mouse
    if (mouse_x && mouse_y) {
      var hexagon_under_mouse = hexagonAtPixels(mouse_x, mouse_y);
      if (hexagon_under_mouse) setHexagonColor(hexagon_under_mouse, [255, 255, 127]);
    }
    // copy state of colors
    const colors = grid.map((column) => column.map((hexagon) => hexagon.color));
    // get colors of neighbors
    for (var x = 0; x < grid_width; x++) {
      for (var y = 0; y < grid_height; y++) {
        neighbors = neighborCoordinates(x, y)
          .map((c) => colors[c[0]][c[1]])
          .filter((c) => c !== null);
        if (neighbors.length > 0) {
          color = neighbors
            .reduce((c, a) => [c[0] + a[0], c[1] + a[1], c[2] + a[2]])
            .map((c) => c / neighbors.length);
          var existing = colors[x][y];
          if (existing) {
            color = [
              (existing[0] + color[0]) / 2,
              (existing[1] + color[1]) / 2,
              (existing[2] + color[2]) / 2
            ];
          }
          setHexagonColor(hexagonAtCoordinates(x, y), color);
        }
      }
    }
    // request another frame
    window.requestAnimationFrame(animateGrid);
  }

  function neighborCoordinates(x, y, no_filter = false) {
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
    neighbors = neighbors.map((e) => [x + e[0], y + e[1]]);
    if (!no_filter) {
      neighbors = neighbors.filter((c) => {
        return c[0] >= 0 && c[0] < grid_width && c[1] >= 0 && c[1] < grid_height;
      });
    }
    return neighbors;
  }

  function setHexagonColor(hexagon, color) {
    hexagon.color = color;
    setHexagonScale(hexagon, 1);
  }

  function hexagonAtPixels(x, y) {
    if (x < 0 || y < 0 || x > svg.clientWidth || x > svg.clientWidth) return;
    // try for the trivial case
    if ((x + radius / 2) % (radius * 1.5) < radius) {
      const column = Math.floor((x + radius / 2) / (radius * 1.5));
      if (!(column % 2)) y += height_step;
      const row = Math.floor(y / (height_step * 2));
      return hexagonAtCoordinates(column, row);
    }
    // we are in the space where it could be one of two columns
    else {
      var box_pos_x = Math.floor((x - radius / 2) / (radius * 1.5));
      var box_pos_y = Math.floor(y / height_step);
      var column_left = box_pos_x;
      box_x = (x % (radius * 1.5)) - radius / 2;
      box_y = y % height_step;
      if ((box_pos_x + box_pos_y) % 2) {
        // division slopes down (which is up in the algebra)
        if (box_y > slope * box_x) {
          return hexagonAtCoordinates(
            box_pos_x,
            box_pos_x % 2 ? Math.floor(box_pos_y / 2) : Math.ceil(box_pos_y / 2)
          );
        } else {
          return hexagonAtCoordinates(
            box_pos_x + 1,
            box_pos_x % 2 ? Math.ceil(box_pos_y / 2) : Math.floor(box_pos_y / 2)
          );
        }
      } else {
        // division slopes up (which is down in the algebra, inverted by subtracting from height_step)
        if (height_step - box_y < slope * box_x) {
          return hexagonAtCoordinates(box_pos_x + 1, Math.ceil(box_pos_y / 2));
        } else {
          return hexagonAtCoordinates(
            box_pos_x,
            box_pos_x % 2
              ? Math.ceil(box_pos_y / 2) - 1
              : Math.floor(box_pos_y / 2)
          );
        }
      }
    }
  }

  function hexagonAtCoordinates(x, y) {
    if (grid[x]) {
      if (grid[x][y]) return grid[x][y];
    }
  }

  function buildGrid() {
    // empty and rebuild svg to match display size
    svg.innerHTML = "";
    svg.viewBox.baseVal.width = svg.clientWidth;
    svg.viewBox.baseVal.height = svg.clientHeight;
    // dynamically set grid width
    if (svg.clientHeight > svg.clientWidth) {
      grid_width = Math.floor((svg.clientWidth / svg.clientHeight) * grid_size);
    } else grid_width = grid_size;
    // construct grid of hexagons
    var newGrid = [];
    const view_width = Math.ceil(svg.viewBox.baseVal.width);
    const view_height = Math.ceil(svg.viewBox.baseVal.height);
    radius = view_width / (grid_width - 1) / 1.5;
    height_step = sin * radius;
    grid_height = view_height / (2 * height_step) + 1;
    for (var x = 0; x < grid_width; x++) {
      var column = [];
      for (var y = 0; y < grid_height; y++) {
        var center_x = x * radius * 1.5;
        var center_y = y * height_step * 2;
        if (x % 2) center_y += height_step;
        const hexagon = buildHexagon(center_x, center_y);
        hexagon.center = [center_x, center_y];
        setHexagonScale(hexagon, 0);
        column.push(hexagon);
        svg.appendChild(hexagon);
      }
      newGrid.push(column);
    }
    grid = newGrid;
    // immediately run one step
    animateGrid();
  }

  function setHexagonScale(hexagon, scale) {
    hexagon.setAttribute(
      "points",
      buildHexagonPoints(hexagon.center[0], hexagon.center[1], scale)
        .map((e) => e.join(" "))
        .join(",")
    );
    if (hexagon.color) {
      hexagon.setAttribute(
        "fill",
        "rgba(" +
        hexagon.color.join(",") +
        "," +
        Math.round(scale * 100) / 100 +
        ")"
      );
    } else hexagon.setAttribute("fill", "rgba(0,0,0,0)");
  }

  function buildHexagonPoints(center_x, center_y, scale = 1) {
    return Array.from(Array(6).keys()).map((i) => {
      return [
        center_x + (radius + 0.5) * Math.cos(angle * i) * scale,
        center_y + (radius + 0.5) * Math.sin(angle * i) * scale
      ];
    });
  }

  function buildHexagon(center_x, center_y) {
    const hexagon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    hexagon.setAttribute(
      "points",
      buildHexagonPoints(center_x, center_y)
        .map((e) => e.join(" "))
        .join(",")
    );
    hexagon.classList.add("colored-hexagon");
    hexagon.color = null;
    hexagon.center = [center_x, center_y];
    return hexagon;
  }

  function debounce(func, timeout) {
    var timer = null;
    return (...args) => {
      const next = () => func(...args); if (timer) {
        clearTimeout(timer);
      } timer = setTimeout(next, timeout > 0 ? timeout : 300);
    };
  }

});