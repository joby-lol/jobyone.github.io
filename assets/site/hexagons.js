document.addEventListener('DOMContentLoaded', () => {

  if (!window.Worker) return;
  const worker = new Worker('/assets/site/hexagons-worker.js');

  // receive messages from worker
  worker.onmessage = function (e) {
    switch (e.data.action) {
      case 'rebuild':
        rebuild(e.data.grid);
        break;
      case 'update':
        update(e.data.site);
        break;
    }
  }

  // some math/svg setup
  const grid_size = 25;
  const svg = document.getElementById('hexagon-background');
  const angle = (2 * Math.PI) / 6;
  const sin = Math.sin(angle);
  const slope = sin / Math.cos(angle);

  // paramaters for while it's running
  var grid_width = grid_size;
  var grid_height;
  var radius;
  var height_step;
  var grid = [];

  // pass updated mouse position to worker
  document.addEventListener('mousemove', (e) => {
    worker.postMessage({
      action: 'mouse',
      position: pixelsToGrid(
        e.pageX - svg.getBoundingClientRect().left - window.scrollX,
        e.pageY - svg.getBoundingClientRect().top - window.scrollY
      )
    });
  });
  window.addEventListener('mouseout', (e) => {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
      worker.postMessage({ action: 'mouse', position: null });
    }
  })


  // only update hexagon fill colors during animation frames
  window.requestAnimationFrame(render);
  function render() {
    grid.forEach(column => {
      column.forEach(site => {
        if (!site.changed) return;
        if (site.color) site.hexagon.setAttribute('fill', 'rgb(' + site.color.join(',') + ')');
        else site.hexagon.setAttribute('fill', 'transparent');
      });
    });
    window.requestAnimationFrame(render);
  }

  // function to receive updates to grid site colors
  function update(updated_site) {
    const site = getSite(updated_site.x, updated_site.y);
    if (!site) return;
    site.changed = true;
    site.color = updated_site.color;
  }

  // get a single site
  function getSite(x, y) {
    if (!grid_height || !grid_width) return;
    x = x % grid_width;
    y = y % grid_height;
    if (x < 0) x += grid_width;
    if (y < 0) y += grid_height;
    return grid[x][y];
  }

  // function to initiate rebuilding grid
  const callRebuild = debounce(function () {
    svg.viewBox.baseVal.width = svg.clientWidth;
    svg.viewBox.baseVal.height = svg.clientHeight;
    const pixel_width = Math.ceil(svg.viewBox.baseVal.width);
    const pixel_height = Math.ceil(svg.viewBox.baseVal.height);
    // determine grid width, so that it is grid_size on the long dimension
    if (pixel_height > pixel_width) {
      grid_width = Math.floor((pixel_width / pixel_height) * grid_size);
    } else grid_width = grid_size;
    // calculate number of hexagons that will fit
    radius = pixel_width / (grid_width - 1) / 1.5;
    height_step = sin * radius;
    grid_height = Math.ceil(pixel_height / (2 * height_step) + 1);
    // pass grid size to worker so it can build a new grid
    worker.postMessage({ action: 'rebuild', 'width': grid_width, 'height': grid_height });
  });
  callRebuild();
  window.addEventListener("resize", callRebuild);

  // function to actually rebuild svg content of grid
  function rebuild(new_grid) {
    // clear svg
    svg.innerHTML = '';
    // build out front-end data for new grid
    new_grid.map(column => column.map(site => {
      site.changed = true;
      site.center = {
        x: site.x * radius * 1.5,
        y: (site.y * height_step * 2) + ((site.x % 2) ? height_step : 0)
      };
      site.hexagon = buildHexagon(site.center.x, site.center.y);
      svg.appendChild(site.hexagon);
      return site;
    }));
    // copy new grid over old grid
    grid = new_grid;
  }

  // build an SVG hexagon polygon tag
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
    hexagon.setAttribute('fill', 'transparent');
    return hexagon;
  }

  // calculate points for a hexagon polygon
  function buildHexagonPoints(center_x, center_y) {
    return Array.from(Array(6).keys()).map((i) => {
      return [
        center_x + (radius + 0.5) * Math.cos(angle * i),
        center_y + (radius + 0.5) * Math.sin(angle * i)
      ];
    });
  }

  function pixelsToGrid(x, y) {
    if (x < 0 || y < 0 || x > svg.clientWidth || x > svg.clientWidth) return;
    // try for the trivial case
    if ((x + radius / 2) % (radius * 1.5) < radius) {
      const column = Math.floor((x + radius / 2) / (radius * 1.5));
      if (!(column % 2)) y += height_step;
      const row = Math.floor(y / (height_step * 2));
      return [column, row];
    }
    // we are in the space where it could be one of two columns
    else {
      var box_pos_x = Math.floor((x - radius / 2) / (radius * 1.5));
      var box_pos_y = Math.floor(y / height_step);
      box_x = (x % (radius * 1.5)) - radius / 2;
      box_y = y % height_step;
      if ((box_pos_x + box_pos_y) % 2) {
        // division slopes down (which is up in the algebra)
        if (box_y > slope * box_x) {
          return [
            box_pos_x,
            box_pos_x % 2 ? Math.floor(box_pos_y / 2) : Math.ceil(box_pos_y / 2)
          ];
        } else {
          return [
            box_pos_x + 1,
            box_pos_x % 2 ? Math.ceil(box_pos_y / 2) : Math.floor(box_pos_y / 2)
          ];
        }
      } else {
        // division slopes up (which is down in the algebra, inverted by subtracting from height_step)
        if (height_step - box_y < slope * box_x) {
          return [box_pos_x + 1, Math.ceil(box_pos_y / 2)];
        } else {
          return [
            box_pos_x,
            box_pos_x % 2
              ? Math.ceil(box_pos_y / 2) - 1
              : Math.floor(box_pos_y / 2)
          ];
        }
      }
    }
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