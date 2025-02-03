import * as d3 from "d3";

export const moveConstant_to_array = (array, constant, arrayIndex) => {
  if (!array || !constant) {
    console.error("Invalid array references.");
    return;
  }

  const arrayRef = d3.select(array.array_ref.current);
  const {x: array1X, y: array1Y} = array;
  const array_cellpos=45*arrayIndex+5*arrayIndex;
  const width=45;
  const array_length=array.array_length*45;
  const msec = 1000;



  const sourceCellGroup = arrayRef.select(`.cell-${arrayIndex}`);
  const ArrayTextref= sourceCellGroup.select(".array-value");
  //console.log(Array1Textref.text());

  const textGroup = arrayRef.append("g").attr("class", "text-group");

  // Add background rectangle (box)
  const textBox = textGroup.append("rect")
    .attr("x", array_length+width*3.5) // Slightly to the right of the cell
    .attr("y", 0) // Adjust vertical alignment
    .attr("width", 45)
    .attr("height", 45)
    .attr("fill", "none") // No solid fill, only border
    .attr("stroke", "black") // Border color
    .attr("stroke-width", 2) // Border thickness
    .attr("rx", 5) 
    .attr("rx", 5) // Rounded corners
    .style("opacity", 0); // Start invisible

  // Add text inside the box
  const sideText = textGroup.append("text")
    .attr("x", array_length+width*3.5+width/2) // Center text in box
    .attr("y", width/2+5) // Adjust text position
    .attr("fontfamily", "Arial")
    .attr("fill", "black")
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .style("opacity", 0) // Start invisible
    .text(constant);

  // Fade-in effect for box and text
  textBox.transition()
    .duration(500)
    .style("opacity", 1);

  sideText.transition()
    .duration(500)
    .style("opacity", 1);

  sourceCellGroup
    .transition()
    .duration(msec-msec/2+300)
    .attr("transform", `translate(${array_length+width*2},0)`)
    .on("end", () => {
        sideText
            .transition()
            .duration(msec/2)
            .style("opacity",0)
            .attr("transform", `translate(-${width+21},0)`)
            .on("end", () => {
                ArrayTextref.text(constant);
                sourceCellGroup
                    .select(".array-cell")
                    .transition()
                    .duration(200)
                    .attr("width", width+5)  // Increase width
                    .attr("height", width+5)  // Increase height
                    .attr("rx", 12)      // Increase corner radius
                    .attr("ry", 12)
                    .delay(100) // delay before reducing size
                    .transition()
                    .duration(200)
                    .attr("width", width)  // Return to original width
                    .attr("height", width)  // Return to original height
                    .attr("rx", 5)      // Return to original corner radius
                    .attr("ry", 5)
                    .on("end", () => {
                        sideText
                            .transition()
                            .duration(msec/2-200)
                            .style("opacity",1)
                            .attr("transform", `translate(0,0)`)
                            .style("opacity", 0)
                            .remove()
                        textBox
                            .transition()
                            .duration(msec/2-200)
                            .style("opacity", 0)
                            .remove()
                        sourceCellGroup
                            .transition()
                            .duration(msec/2-200)
                            .attr("transform", `translate(${array_cellpos},0)`);
                    });
            });
    });



};
