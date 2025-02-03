import * as d3 from "d3";

export const Variable_to_array = (var1, array1, array1Index) => {
  if (!array1 || !var1) {
    console.error("Invalid array references.");
    return;
  }

  const array1Ref = d3.select(array1.array_ref.current);
  const var1Ref = d3.select(var1.ref.current);
  const {x: array1X, y: array1Y} = array1;
  const {x: var1X, y: var1Y} = var1;
  const array1_cellpos=45*array1Index+5*array1Index;
  const width=45;
  const array1_length=array1.array_length*45;
  const msec=1000;


  const sourceCellGroup = var1Ref;
  const DestCellGroup = array1Ref.select(`.cell-${array1Index}`);
  const var1Textref= sourceCellGroup.select(".var-value");
  const Array1Textref= DestCellGroup.select(".array-value");
  //console.log(Array1Textref.text());
  sourceCellGroup
    .transition()
    .duration(msec/2+msec/4)
    .attr("transform", `translate(${array1_length+width*3+20},${array1Y})`)
  DestCellGroup
    .transition()
    .duration(msec/2+msec/4)
    .attr("transform", `translate(${array1_length+width*2},0)`)
    .on("end", () => {
      var1Textref
        .transition()
        .duration(msec/2)
        .style("opacity",0)
        .attr("transform", `translate(-${width+27},0)`)
        .on("end", () => {
          Array1Textref.text(var1Textref.text());//txt change
          DestCellGroup
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
              var1Textref
                .transition()
                .duration(msec/2-msec/4)
                .style("opacity",1)
                .attr("transform", `translate(0,0)`)
                .on("end", () => {
                  sourceCellGroup
                    .transition()
                    .duration(msec/2-msec/4)
                    .attr("transform", `translate(${var1X},${var1Y})`);
                  DestCellGroup
                    .transition()
                    .duration(msec/2-msec/4)
                    .attr("transform", `translate(${array1_cellpos},0)`);
                })
            })

        });
    });



};
