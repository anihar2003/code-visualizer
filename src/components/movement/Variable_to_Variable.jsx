import * as d3 from "d3";

export const moveVariableToVariable = (var1, var2) => {
  const var1Ref = d3.select(var1.ref.current);
  const var2Ref = d3.select(var2.ref.current);
  const { x: var2X, y: var2Y } = var2;
  const { x: var1X, y: var1Y } = var1;
  const Var2textRef = var2Ref.select(".var-value");
  const var1TeaxtRef = var1Ref.select(".var-value");
  const height=45;
  const width=65;
  const rx = 5;
  const ry = 5;
  const msec = 1000;


  console.log(var1.y, var2.y);
  // Highlight var1 before moving
  var1Ref
    .transition()
    .duration(300)
    .attr("fill", "orange");

  // Animate the movement to var2
  var1Ref
    .transition()
    .duration(msec)
    .attr("transform", `translate(${var2X+90}, ${var2Y})`)
  var2Ref
    .transition()
    .duration(300)
    .attr("fill", "orange")

  var1TeaxtRef
    .transition()
    .delay(msec)
    .duration(300)
    .style("opacity",0)
    .attr("transform", `translate(-90, 0)`)
    .on("end", () => {
      // Set the value of var2's text to var1's value
      Var2textRef.text(var1.varValue);

      // Increase the size of var2's box
      var2Ref
        .select(".var-box")
        .transition()
        .duration(250)
        .attr("width", width+10)  // Increase width
        .attr("height", height+10)  // Increase height
        .attr("rx", rx+2)      // Increase corner radius
        .attr("ry", ry+2)
        .delay(100) // delay before reducing size
        .transition()
        .duration(250)
        .attr("width", width)  // Return to original width
        .attr("height", height)  // Return to original height
        .attr("rx", rx)      // Return to original corner radius
        .attr("ry", ry)

      var1TeaxtRef //var 1 text back to its position
        .transition()
        .delay(msec)
        .duration(300)
        .style("opacity",1)
        .attr("transform", `translate(0, 0)`)
      // Reset var1's position and color after animation
      var1Ref
        .transition()
        .delay(300)
        .attr("fill", "black")
        .attr("stroke", "none")
        .delay(msec+200)
        .duration(msec)
        .attr("transform", `translate(${var1X}, ${var1Y})`);
      var2Ref
        .transition()
        .delay(msec+200)
        .attr("fill", "black")
        .attr("stroke", "none");
    });

};
