import * as d3 from "d3";

export const moveConstant_to_variable = (var1, constant) => {
    const var1Ref = d3.select(var1.ref.current);
    const { x: var1X, y: var1Y } = var1;
    const var1TeaxtRef = var1Ref.select(".var-value");
    const height=45;
    const width=65;
    const rx = 5;
    const ry = 5;
    const msec=1000;

    const textGroup = var1Ref.append("g").attr("class", "text-group");

  // Add background rectangle (box)
    const textBox = textGroup.append("rect")
        .attr("x", width*1.5) // Slightly to the right of the cell
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
        .attr("x", width*1.5+45/2) // Center text in box
        .attr("y", width/2-5) // Adjust text position
        .attr("fontfamily", "Arial")
        .attr("fill", "black")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .style("opacity", 0) // Start invisible
        .text(constant);

    textBox.transition()
        .duration(500)
        .style("opacity", 1);
    
    sideText.transition()
        .duration(500)
        .style("opacity", 1);
    
    var1Ref
      .transition()
      .duration(300)
      .attr("fill", "orange")
      .on("end", () => {
        sideText
            .transition()
            .duration(msec/2)
            .style("opacity", 0)
            .attr("transform", `translate(-${width+21},0)`)
            .on("end", () => {
                var1TeaxtRef.text(constant);
                var1Ref
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
                            .style("opacity", 1)
                            .attr("transform", `translate(0,0)`)
                            .style("opacity", 0)
                            .remove()
                        textBox
                            .transition()
                            .duration(msec/2-200)
                            .style("opacity", 0)
                            .remove()
                        var1Ref
                            .transition()
                            .duration(300)
                            .attr("fill", "black");
                    });
            });
      });
    
  
};
