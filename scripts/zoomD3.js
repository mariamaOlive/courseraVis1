   // // Pan and zoom
    // const zoom = d3.zoom()
    //     .scaleExtent([0.5, 100000])
    //     .on("zoom", zoomed);

    // const gx = svg.append("g");
    // const gy = svg.append("g");
    // const gGrid = svg.append("g");

    // svg.call(zoom).call(zoom.transform, d3.zoomIdentity);


    // function zoomed({ transform }) {
    //     // create new scale ojects based on event
    //     const zx = transform.rescaleX(xScale).interpolate(d3.interpolateRound);
    //     const zy = transform.rescaleY(yScale).interpolate(d3.interpolateRound);
    //     // update axes

    //     // gX.call(xAxis, zx);
    //     // gY.call(yAxis, zy);
    //     gx.call(xAxis, zx);
    //     gy.call(yAxis, zy);
    //     // gGrid.call(grid, zx, zy);

    //     countryGroup.attr("transform", d => `translate(${zx(d.destination)},${zy(d.gdp)})`)

    // }