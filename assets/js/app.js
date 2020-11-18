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
    
    // Initial Params for x and y axis
    var chosenXAxis = 'income';
    var chosenYAxis = 'obesity'

    // update xscale variable upon clicks on axis label
    function xScale(data, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d=>d[chosenXAxis]) *0.8,
                d3.max(data, x => x[chosenXAxis]) * 1.2
            ])
            .range([0, chartWidth]);
        
        return xLinearScale
    }

    function yScale(data, chosenYAxis){
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenYAxis]), 
                d3.max(data, d => d[chosenYAxis]),
            ])
            .range([chartHeight, 0])
    }

    // update xaxis upon selecting new label
    function renderXAxes (newXscale, xAxis) {
        var bottomAxis = d3.axisBottom(newXscale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        
        return xAxis;
    }

    // update yaxis upon selecting new label
    function renderYAxes (newYscale, yAxis) {
        var leftAxis = d3.axisLeft(newYscale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);
        
        return yAxis
    }

    // update circles when new labels are selection
    function renderCircles(circlesGroup, newXscale, chosenXAxis, newYscale, chosenYAxis) {
        circlesGroup.transition()
            .duration(1000)
            .attr('cx', d => newXscale(d[chosenXAxis]))
            .attr('cy', d=> newYscale(d[chosenYAxis]));
        
        return circlesGroup
    }

    // function used for updating circles group with new tooltip
    function updateToolTip (chosenXAxis, chosenYAxis, circlesGroup) {
        if (chosenXAxis === 'income'){
            var label = 'Household Income (Median):';
        }
        else if (chosenXAxis === 'age'){
            var label ='Age (Median):'
        }
        else {
            var label = 'Poverty (%)'
        }

        if (chosenYAxis === 'obesity'){
            var label = 'Obesity (%)'
        }
        else if (chosenYAxis === 'healthcare'){
            var label = 'Healthcare (%)'
        }
        else {
            var label = 'Smokes (%)'
        }
    

        var toolTip = d3.tip()
            .attr('class', 'tooltip')
            .offset([80, -60])
            .html(function(d){
            return (`${d[chosenXAxis]} <br> ${label} ${d[chosenYAxis]}`)
            })
    
        circlesGroup.call(toolTip);

        circlesGroup.on('mouseover', function(data){
            toolTip.show(data)
        })
            .on('mouseout', function(data,index){
            toolTip.hide(data)
            })
    
        return circlesGroup;
    }    

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

        var xLinearScale = //d3.scaleLinear()
            //.domain([incomeMin, incomeMax])
            //.range([0, chartWidth])
            xScale(data, chosenXAxis)
            .nice();

        // find the scale functions for Y Values OBESITY
        var obesityMin = d3.min(data, d => d.obesity)
        var obesityMax = d3.max(data, d => d.obesity)

        var yLinearScale = //d3.scaleLinear()
            //.domain([obesityMin, obesityMax])
            //.range([chartHeight, 0])
            yScale(data, chosenYAxis)
            
        
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
        // .attr('cx', d=> xLinearScale(d.income))
        // .attr('cy', d => yLinearScale(d.obesity))
        .attr('cx', d=> xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', '8')
        .attr('fill', 'pink')
        .attr('opacity', '.75')
        .text(data, d => d.abbr)

        // append text to data
        // circlesGroup
        //     .data(data)
        //     .enter()
        //     .append('text')
        //     .text(function(d){
        //         return d.abbr
        //     })
        //     .attr('x', function(d){
        //         return d.abbr
        //     })
        //     .attr('y', function(d){
        //         return d.abbr
        //     })

        // create labels for the (3) x labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 3}, ${chartHeight + (margin.top / 1.2)})`)
        
        var medianIncomeLabel = xlabelsGroup.append('text')
            .attr("x", 0)
            .attr("y", 20)
            .attr('value', 'income')
            .classed('active', true)
            .text('Median Income ($)')

        var ageLabel = xlabelsGroup.append('text')
            .attr("x", 0)
            .attr("y", 40)
            .attr('value', 'age')
            .classed('active', true)
            .text('Age (Median)')
        
        var povertyLabel = xlabelsGroup.append('text')
            .attr("x", 0)
            .attr("y", 60)
            .attr('value', 'poverty')
            .classed('active', true)
            .text('Poverty (%)')

        // create axes labels for (3) y axis labels
        var  ylabelsgroup = chartGroup.append('g')
            .attr('transform', 'rotate(-90)')
        
        var obesityLabel = ylabelsgroup.append('text')
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obesity (%)");
        
        var healthcareLabel = ylabelsgroup.append('text')
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 2.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Healthcare (%)");
        
        var smokeLabel = ylabelsgroup.append('text')
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obesity (%)");
        
            // .attr("y", 0 - margin.left)
            // .attr("x", 0 - (chartHeight / 1.5))
            // .attr("dy", "1em")
            // .attr("class", "axisText")
            // .text("Obesity (%)");
        
        // chartGroup.append("text")
        //     .attr("transform", `translate(${chartWidth / 3}, ${chartHeight + (margin.top / 1.2)})`)
        //     .attr("class", "axisText")
        //     .text("Median Income ($)");
        
        // update tooltip function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup)

        // create event listener for both x and y
        xlabelsGroup.select('text')
        .on('click', function() {

            var value = d3.select(this).attr('value');
            if (value !== chosenXAxis) {
                chosenXAxis = values;

            // updates x scale for new data
            xLinearScale = xScale(hairData, chosenXAxis);
            


            }






        })






    }).catch(function(error){
        console.log(error);
    })







}

makeResponsive();
d3.select(window).on('resize', makeResponsive)
