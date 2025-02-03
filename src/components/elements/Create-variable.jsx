import * as d3 from "d3";

const createVariable = (varName, varType, varValue, x, y) => {
  const group = d3.create("svg:g").attr("transform", `translate(${x},${y})`);
  const width = 65;
  const height = 45;
  const var_name_x = 5;
  const var_name_y = -5;
  const var_type_x = width - 7;
  const var_type_y = -5;
  const var_value_x = width / 2;
  const var_value_y = height / 2 + 5;
  const font_size = 12;
  const font_family = "Arial";
  // Box
  group
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("fill", "lightblue")
    .attr("class", "var-box");

  group
    .append("text")
    .attr("x", var_name_x)
    .attr("y", var_name_y)
    .attr("font-size", font_size)
    .attr("font-weight", "bold")
    .attr("class", "var-type")
    .style("font-family", font_family)    
    .text(varName);

  group
    .append("text")
    .attr("x", var_type_x)
    .attr("y", var_type_y)
    .attr("font-size", font_size-1)
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .style("font-family", font_family) 
    .attr("class", "var-name")
    .text(varType);

  // Variable Value (Center)
  group
    .append("text")
    .attr("x", var_value_x)
    .attr("y", var_value_y)
    .attr("font-size", font_size+2)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .style("font-family", font_family) 
    .attr("class", "var-value")
    .text(varValue);

  return group.node(); // Return the raw DOM node
};

export default createVariable;
