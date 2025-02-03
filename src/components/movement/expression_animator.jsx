import * as d3 from "d3";
export const expression_animator = (type, left_side, left_index, right_side, operators)=> {
    // Select the SVG container
    const svg = d3.select("#animation-container");

    // Create a group for the expression
    const group = svg.append("g").attr("class", "expression-group");

    // Display left side elements
    const leftText = group.selectAll(".left")
        .data(left_side)
        .enter()
        .append("text")
        .attr("x", (d, i) => 50 + i * 30)
        .attr("y", 50)
        .attr("class", "left")
        .text(d => d)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);
    
    // Display operator
    const operatorText = group.append("text")
        .attr("x", 50 + left_side.length * 30)
        .attr("y", 50)
        .attr("class", "operator")
        .text(operators)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);
    
    // Display right side elements
    const rightText = group.selectAll(".right")
        .data(right_side)
        .enter()
        .append("text")
        .attr("x", (d, i) => 80 + (left_side.length + i) * 30)
        .attr("y", 50)
        .attr("class", "right")
        .text(d => d)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);

    // Highlight left index if applicable
    if (left_index !== null) {
        group.selectAll(".left").filter((d, i) => i === left_index)
            .transition()
            .duration(500)
            .attr("fill", "red");
    }

    // Move elements to simulate computation
    setTimeout(() => {
        group.transition()
            .duration(1000)
            .attr("transform", "translate(0, 50)");
    }, 1000);

    // Final result fade-in effect
    setTimeout(() => {
        svg.append("text")
            .attr("x", 100)
            .attr("y", 150)
            .attr("class", "result")
            .text(`Result: ${eval(left_side.join('') + operators + right_side.join(''))}`)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1);
    }, 2000);
}
