import * as d3 from "d3";

const createArray = (arrayName, arrayType, x, y, length, actualArray) => {
  const font_size = 14;
  const font_family = "Arial";
  const width_type = length*45+length*5;
  const width = 45;

  const group = d3.create("svg:g")
    .attr("class", "array-group")
    .attr("transform", `translate(${x},${y})`);

  // Array Name (Top)
  group
    .append("text")
    .attr("class", "array-name")
    .attr("x", 20) // Center text
    .attr("y", -10)
    .attr("font-size", font_size+2)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text(`${arrayName}`);

  group
    .append("text")
    .attr("class", "array-type")
    .attr("x", width_type-10)
    .attr("y", -10)
    .attr("font-size", font_size)
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .text(`${arrayType}`);


  // Create Array Elements (Each inside a "cell-group")
  actualArray.forEach((value, i) => {
    const cellX = i *50; // Distance between elements

    const cellGroup = group
      .append("g")
      .attr("class", `cell-group cell-${i}`)
      .attr("transform", `translate(${cellX}, 0)`);

    // Cell Box
    cellGroup
      .append("rect")
      .attr("class", "array-cell")
      .attr("width", width)
      .attr("height", width)
      .attr("fill", "lightgreen")
      .attr("rx", 5)
      .attr("ry", 5);

    // Index of Cell
    cellGroup
      .append("text")
      .attr("class", "array-index")
      .attr("font-family", font_family)
      .attr("x", width / 2)
      .attr("y", width + 17)
      .attr("font-size", font_size-1)
      .attr("text-anchor", "middle")
      .text(i);

    // Value inside Cell
    cellGroup
      .append("text")
      .attr("font-family", font_family)
      .attr("class", "array-value")
      .attr("x", width / 2)
      .attr("y", width / 2 + 5)
      .attr("font-size", font_size)
      .attr("text-anchor", "middle")
      .text(value);
  });

  return group.node(); // Return the group node
};

export default createArray;
