import * as d3 from "d3";

export const Array_to_variable = (array1, var1, array1Index) => {
  if (!array1 || !var1) {
    console.error("Invalid array references.");
    return;
  }

  const array1Ref = d3.select(array1.array_ref.current);
  const var1Ref = d3.select(var1.ref.current);

  const {x: array1X, y: array1Y} = array1;
  const {x: var1X, y: var1Y} = var1;
  const array1_cellpos=45*array1Index+5*array1Index;
  const width=65;
  const height=45;
  const msec=1000;

  let array2_cell_y;
  if(array1Y>var1Y){
    array2_cell_y = -(array1Y-var1Y);
  }else{
    array2_cell_y = var1Y-array1Y;
  }

  const sourceCellGroup = array1Ref.select(`.cell-${array1Index}`);
  const DestCellGroup = var1Ref;
  const Array1Textref= sourceCellGroup.select(".array-value");
  //console.log(Array1Textref.text());
  sourceCellGroup
    .transition()
    .duration(msec-msec/2+200)
    .attr("transform", `translate(${width*1.2},${array2_cell_y})`)
    .on("end", () => {
      Array1Textref
        .transition()
        .duration(msec/2)
        .attr("transform", `translate(-${width-1},0)`)
        .style("opacity",0)
        .on("end", () => {
          DestCellGroup
            .select(".var-value").text(Array1Textref.text());
          DestCellGroup
            .select(".var-box")
            .transition()
            .duration(200)
            .attr("width", width+5)  // Increase width
            .attr("height", height+5)  // Increase height
            .attr("rx", 12)      // Increase corner radius
            .attr("ry", 12)
            .delay(100) // delay before reducing size
            .transition()
            .duration(200)
            .attr("width", width)  // Return to original width
            .attr("height", height)  // Return to original height
            .attr("rx", 5)      // Return to original corner radius
            .attr("ry", 5)
            .on("end", () => {
              Array1Textref
                .transition()
                .duration(msec/2-200)
                .style("opacity",1)
                .attr("transform", `translate(0,0)`)
                .on("end", () => {
                  sourceCellGroup
                    .transition()
                    .duration(msec/2-200)
                    .attr("transform", `translate(${array1_cellpos},0)`);
                })
            })

        });
    });

};
