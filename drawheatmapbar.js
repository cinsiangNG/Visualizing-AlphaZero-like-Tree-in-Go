
//Draw heatmap bar
function drawHeatmapBar(container, colorScale, width = 150, height = 5) {
    // Create or select the SVG container for the heatmap bar
    let svg = container.select('svg.heatmap-bar');
    if (svg.empty()) {
        svg = container.append('svg')
            .attr('class', 'heatmap-bar')
            .attr('width', width + 50) 
            .attr('height', height + 30)
            .style('margin', '10px 0')
            .style('position', 'relative')
            .style('left', '1.5%') 
            .style('top', '-155px')
    } else {
        svg.selectAll('*').remove(); 
    }

    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
        .attr('id', 'heatmap-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

    const domain = colorScale.domain();
    const range = colorScale.range();

    // Add gradient stops
    for (let i = 0; i < domain.length; i++) {
    linearGradient.append('stop')
        .attr('offset', `${(i / (domain.length - 1)) * 100}%`) // 根据索引计算偏移量
        .attr('stop-color', range[i]); // 使用 range 中的颜色
}
    const bar_width = width -50
    const bar_height = height -5
    // Draw the gradient rectangle
    svg.append('rect')
        .attr('x', 25)
        .attr('y', 10)
        .attr('width', bar_width)
        .attr('height', bar_height)
        .style('fill', 'url(#heatmap-gradient)');

    const x = generateRange(domain, 25, bar_width+25);
    // Add labels for the domain values
    const scale = d3.scaleLinear()
    .domain(domain) 
    .range(x); 

    // 创建刻度轴
    const axis = d3.axisBottom(scale)
        .tickValues(domain) 
        .tickFormat(d3.format('.3f')); 

    // 绘制刻度轴
    svg.append('g')
        .attr('transform', `translate(0, ${height + 10})`) 
        .call(axis);
}

function generateRange(domain, minRange, maxRange) {
    // Calculate the range based on domain length and desired min/max values
    const rangeLength = maxRange - minRange;
    const scaleLength = domain.length - 1;
    
    // Calculate step size
    const step = rangeLength / scaleLength;

    // Generate the range array
    let range = [];
    for (let i = 0; i <= scaleLength; i++) {
        range.push(minRange + step * i);
    }

    return range;
}

