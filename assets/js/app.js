// @TODO: YOUR CODE HERE!

// make the page responsive by creating a function
function makeResponsive(){

    // declare svg area
    var svgArea = d3.select('.scatter-plot').select('svg');

    // if the SVG area isn't empty when the browser loads, remove it and replace with resized version 
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right ; 

    // append SVG element
    var svg = d3
        .select('#scatter')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);
    
    // append chart group element
    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // read CSV
    d3.csv('assets/data/data.csv').then(function(data){

        // print out data
        // console.log(data)

        // parse data for poverty rates and convert to string
        data.forEach(function(d){
            d.poverty = +d.poverty;
            d.age = +d.age;
            d.healthcare = +d.healthcare;
            d.income = +d.income;
            d.obesity = +d.obesity;
            d.smokes = +d.smokes
        })

        console.log(data)

        // INCOME VS OBESITY 

        // create scale functions 
        // find the minimum values for X: INCOME
        var incomeMin = d3.min(data, d => d.income)
        console.log(incomeMin)

        var incomeMax = d3.max(data, d => d.income)

        var xLinearScale = d3.scaleLinear()
            .domain([incomeMin, incomeMax])
            .range([0, chartWidth])
            .nice();

        // find the scale functions for Y Values OBESITY
        var obesityMin = d3.min(data, d => d.obesity)
        var obesityMax = d3.max(data, d => d.obesity)

        var yLinearScale = d3.scaleLinear()
            .domain([obesityMin, obesityMax])
            .range([chartHeight, 0])
            .nice()
        
        // create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append to chart
        chartGroup.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(bottomAxis)
        
        chartGroup.append('g')
            .call(leftAxis)
        
        // create circles
        var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=> xLinearScale(d.income))
        .attr('cy', d => yLinearScale(d.obesity))
        .attr('r', '8')
        .attr('fill', 'pink')
        .attr('opacity', '.75')
        .text(data, d => d.abbr)

        // append text to data
        circlesGroup
            .data(data)
            .enter()
            .append('text')
            .text(function(d){
                return d.abbr
            })
            .attr('x', function(d){
                return d.abbr
            })
            .attr('y', function(d){
                return d.abbr
            })
        
        // create axes labels
        chartGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obesity (%)");
        
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 3}, ${chartHeight + (margin.top / 1.2)})`)
            .attr("class", "axisText")
            .text("Median Income ($)");






    }).catch(function(error){
        console.log(error);
    })







}

makeResponsive();
d3.select(window).on('resize', makeResponsive)
