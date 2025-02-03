import * as d3 from "d3";

export const moveArrayElement = (array1, array2, array1Index, array2Index) => {
  if (!array1 || !array2 || !array1.array_ref.current || !array2.array_ref.current) {
    console.error("Invalid array references.");
    return;
  }

  const array1Ref = d3.select(array1.array_ref.current);
  const array2Ref = d3.select(array2.array_ref.current);
  const {x: array1X, y: array1Y} = array1;
  const {x: array2X, y: array2Y} = array2;
  const array2_cellpos=45*array2Index+5*array2Index;
  const array1_cellpos=45*array1Index+5*array1Index;
  const width=45;
  const msec = 1000;
  const array2_length=array2.array_length*45;
  let array2_cell_y;
  let array1_cell_y=0;
  if(array1Y>array2Y){
    array2_cell_y = -(array1Y-array2Y);
    array1_cell_y = Math.abs(array2_cell_y);
  }else{
    array2_cell_y = array2Y-array1Y;
    array1_cell_y = -(array2_cell_y);
  }



  const sourceCellGroup = array1Ref.select(`.cell-${array1Index}`);
  const DestCellGroup = array2Ref.select(`.cell-${array2Index}`);
  const Array1Textref= sourceCellGroup.select(".array-value");
  const Array2Textref= DestCellGroup.select(".array-value");
  //console.log(Array1Textref.text());
  console.log(array2Y);
  sourceCellGroup
    .transition()
    .duration(msec-msec/2+300)
    .attr("transform", `translate(${array2_length+width*3+20},${array2_cell_y})`)
  DestCellGroup
    .transition()
    .duration(msec-msec/2+300)
    .attr("transform", `translate(${array2_length+width*2},0)`)
    .on("end", () => {
      Array1Textref
        .transition()
        .duration(msec-msec/2+200)
        .attr("transform", `translate(-${width+19},0)`)
        .style("opacity", 0)
        .on("end", () => {
          Array2Textref.text(Array1Textref.text());
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
              Array1Textref
                .transition()
                .duration(msec-msec/2+300)
                .style("opacity", 1)
                .attr("transform", `translate(0,0)`)
                .on("end", () => {
                  sourceCellGroup
                    .transition()
                    .duration(msec-msec/2+300)
                    .attr("transform", `translate(${array1_cellpos},0)`);
                  DestCellGroup
                    .transition()
                    .duration(msec-msec/2+300)
                    .attr("transform", `translate(${array2_cellpos},0)`);
                })
            })

        });
    });



};
