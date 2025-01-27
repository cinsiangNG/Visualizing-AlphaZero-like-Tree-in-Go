function scaleToWinRate(value) {
  // Ensure the input is clamped between -1 and 1
  const clampedValue = Math.max(-1, Math.min(value, 1));
  // Scale the value to 0-100%
  return (clampedValue + 1) * 50; // Shift by +1 and scale by 50
}

// Function to create a Go board
function createGoBoard(parentNode, width, height, gridSize, backgroundColor, position, stones) {
  // Create the SVG container for the Go board
  const svg = parentNode.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("x", position.x)  // Position the board
    .attr("y", position.y);

  // Add background color by appending a rect that fills the entire SVG
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", backgroundColor);  // Set background color

  // Calculate the spacing between grid lines
  const cellSize = width / gridSize;

  // Draw the grid (horizontal and vertical lines)
  for (let i = 0; i < gridSize; i++) {
    // Draw horizontal lines
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", i * cellSize)
      .attr("x2", width)
      .attr("y2", i * cellSize)
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Draw vertical lines
    svg.append("line")
      .attr("x1", i * cellSize)
      .attr("y1", 0)
      .attr("x2", i * cellSize)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }

  // Add the stones to the board
  svg.selectAll(".stone")
    .data(stones)
    .enter()
    .append("circle")
    .attr("class", "stone")
    .attr("cx", d => (d.x - 1) * cellSize + cellSize / 2)  // Center the stone in the grid cell
    .attr("cy", d => (d.y - 1) * cellSize + cellSize / 2)
    .attr("r", cellSize / 2.5)  // Stone size relative to the cell
    .attr("fill", d => d.color);  // Set color of the stone
}

// Define the initial state of the Go board and actions
const treeData = {
  name: "Initial Board",
  position: { x: 50, y: 50 },
  size: { width: 600, height: 600 },
  gridSize: 19,
  backgroundColor: "#f0e68c",  // Background color
  stones: [],
  children: [
    {
      name: "Action 1: Place Black Stone at (3, 3)",
      position: { x: 700, y: 50 },
      size: { width: 600, height: 600 },
      gridSize: 19,
      backgroundColor: "#f0e68c",
      stones: [{ x: 3, y: 3, color: "black" }],
      children: [
        {
          name: "Action 2: Place White Stone at (4, 4)",
          position: { x: 50, y: 350 },
          size: { width: 600, height: 600 },
          gridSize: 19,
          backgroundColor: "#f0e68c",
          stones: [
            { x: 3, y: 3, color: "black" },
            { x: 4, y: 4, color: "white" }
          ],
          children: [
            {
              name: "Action 3: Place Black Stone at (5, 5)",
              position: { x: 700, y: 350 },
              size: { width: 600, height: 600 },
              gridSize: 19,
              backgroundColor: "#f0e68c",
              stones: [
                { x: 3, y: 3, color: "black" },
                { x: 4, y: 4, color: "white" },
                { x: 5, y: 5, color: "black" }
              ],
              children: []
            }
          ]
        }
      ]
    }
  ]
};

// // Create tree layout
// const treeLayout = d3.tree().size([1200, 600]);

// // Create root node for the tree
// const root = d3.hierarchy(treeData);

// // Apply the tree layout
// const treeDataLayout = treeLayout(root);

// // Create an SVG container for the tree structure
// const svgTree = d3.select("body")
//   .append("svg")
//   .attr("width", 1200)
//   .attr("height", 600);

// // Add links (lines) between tree nodes
// svgTree.selectAll(".link")
//   .data(treeDataLayout.links())
//   .enter()
//   .append("line")
//   .attr("class", "link")
//   .attr("x1", d => d.source.x)
//   .attr("y1", d => d.source.y)
//   .attr("x2", d => d.target.x)
//   .attr("y2", d => d.target.y)
//   .attr("stroke", "black")
//   .attr("stroke-width", 2);

// // Add nodes (tree nodes) and call createGoBoard for each node
// const nodes = svgTree.selectAll(".node")
//   .data(treeDataLayout.descendants())
//   .enter()
//   .append("g")
//   .attr("class", "node")
//   .attr("transform", d => `translate(${d.x}, ${d.y})`);

// // For each node, create the Go board
// nodes.each(function(d) {
//   createGoBoard(d3.select(this), d.data.size.width, d.data.size.height, d.data.gridSize, d.data.backgroundColor, d.data.position, d.data.stones);
// });
