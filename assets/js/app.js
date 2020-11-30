// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".scatter-plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv('assets/data/data.csv').then(function(data){
    // console.log(data)

    // parse data as numbers
    data.forEach(function(d){
        d.income = +d.income;
        d.obesity = +d.obesity;

    });

    // create scale function
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.income), d3.max(data, d=> d.income)])
        .range([0, chartWidth])
        .nice()

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity), d3.max(data, d => d.obesity)])
        .range([chartHeight, 0])
        .nice()
    
    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append('g')
        .call(leftAxis);
    
    // create circles
    var circlesGroup = chartGroup.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.income))
    .attr('cy', d => yLinearScale(d.obesity))
    .attr('r', '15')
    .attr('fill', 'pink')
    .attr('opacity', '.75');

    // append text to data
    var textGroup = chartGroup.selectAll('.stateText')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => xLinearScale(d.income))
    .attr('y', d => yLinearScale(d.obesity))
    .text(function(d){
        return d.abbr
        })
    .attr('text-anchor', 'middle')

    // initialize tooltip
    var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([90, 90])
    .html(function(d){
        return(`${d.abbr}:<br>Income: ${d.income} <br>Obesity: ${d.obesity} `);

    });

    // create tooltip in chart
    chartGroup.call(toolTip);

    // create event listeners to display and hide tooltip
    circlesGroup.on('click', function(data){
        toolTip.show(data, this);
    })
    // mouse out
        .on('mouseout', function(data, index){
            toolTip.hide(data)
        });
    
    textGroup.on('click', function(data){
        toolTip.show(data, this);
    })
        .on('mouseout', function(data, index){
            toolTip.hide(data)
        })

    
    // create axes labels
    chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0- margin.left + 40)
    .attr('x', 0-(chartHeight /2))
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Obesity (%)')

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median Income ($)");

}).catch(function(error){
    console.log(error)
})

// // make the page responsive by creating a function
// function makeResponsive(){
  
//     // declare svg area
//     var svgArea = d3.select('.scatter-plot').select('svg');

//     // if the SVG area isn't empty when the browser loads, remove it and replace with resized version 
//     if (!svgArea.empty()) {
//         svgArea.remove();
//     }

//     var svgWidth = 980;
//     var svgHeight = 600;

//     var margin = {
//         top: 20,
//         bottom: 40,
//         right: 90,
//         left: 100
//     };

//     var chartHeight = svgHeight - margin.top - margin.bottom;
//     var chartWidth = svgWidth - margin.left - margin.right ; 

//     // append SVG element
//     var svg = d3
//         .select('#scatter')
//         .append('svg')
//         .attr('height', svgHeight)
//         .attr('width', svgWidth);
    
//     // append chart group element
//     var chartGroup = svg.append('g')
//         .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
//     // Initial Params for x and y axis
//     var chosenXAxis = 'income';
//     var chosenYAxis = 'obesity'

//     // update xscale variable upon clicks on axis label
//     function xScale(data, chosenXAxis) {
//         var xLinearScale = d3.scaleLinear()
//             .domain([d3.min(data, d=>d[chosenXAxis]) *0.8,
//                 d3.max(data, x => x[chosenXAxis]) * 1.2
//             ])
//             .range([0, chartWidth]);
        
//         return xLinearScale
//     }

//     function yScale(data, chosenYAxis){
//         var yLinearScale = d3.scaleLinear()
//             .domain([d3.min(data, d => d[chosenYAxis]) * 0.8, 
//                 d3.max(data, d => d[chosenYAxis]) * 1.2,
//             ])
//             .range([chartHeight, 0])
        
//         return yLinearScale;
//     }

//     // update xaxis upon selecting new label
//     function renderXAxes (newXscale, xAxis) {
//         var bottomAxis = d3.axisBottom(newXscale);

//         xAxis.transition()
//             .duration(1000)
//             .call(bottomAxis);
        
//         return xAxis;
//     }

//     // update yaxis upon selecting new label
//     function renderYAxes (newYscale, yAxis) {
//         var leftAxis = d3.axisLeft(newYscale);

//         yAxis.transition()
//             .duration(1000)
//             .call(leftAxis);
        
//         return yAxis
//     }

//     // update circles when new labels are selection
//     function renderCircles(circlesGroup, newXscale, chosenXAxis, newYscale, chosenYAxis) {
//         circlesGroup.transition()
//             .duration(1000)
//             .attr('cx', d => newXscale(d[chosenXAxis]))
//             .attr('cy', d=> newYscale(d[chosenYAxis]));
        
//         return circlesGroup
//     }

//     // update labels when new axes are selected
//     function renderText(textGroup, newXscale, chosenXAxis, newYscale, chosenYAxis) {
//         textGroup.transition()
//             .duration(1000)
//             .attr('x', d => newXscale(d[chosenXAxis]))
//             .attr('y', d => newYscale(d[chosenYAxis]))
//         return textGroup;
//     }

//     // function used for updating circles group with new tooltip
//     function updateToolTip (chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
//         if (chosenXAxis === 'income'){
//             var label = 'Household Income (Median):';
//         }
//         else if (chosenXAxis === 'age'){
//             var label ='Age (Median):'
//         }
//         else {
//             var label = 'Poverty (%)'
//         }

//         if (chosenYAxis === 'obesity'){
//             var label = 'Obesity (%)'
//         }
//         else if (chosenYAxis === 'healthcare'){
//             var label = 'Healthcare (%)'
//         }
//         else {
//             var label = 'Smokes (%)'
//         }
    

//         var toolTip = d3.tip()
//             .attr('class', 'tooltip')
//             .offset([90, 90])
//             .html(function(d){
//                 return (`${d[chosenXAxis]} <br> ${label} ${d[chosenYAxis]}`)
//             })
    
//         circlesGroup.call(toolTip);

//         circlesGroup.on('mouseover', function(data){
//             toolTip.show(data, this)
//         })
//             .on('mouseout', function(data){
//             toolTip.hide(data);
//             });
        
//         textGroup.call(toolTip);

//         textGroup.on('mouseover', function(data){
//             toolTip.show(data, this)
//             })
//             .on('mouseout', function(data){
//                 toolTip.hide(data)
            
//         });
    
//         return circlesGroup;
//     }    

//     // read CSV
//     d3.csv('assets/data/data.csv').then(function(data){

//         // print out data
//         // console.log(data)

//         // parse data for poverty rates and convert to string
//         data.forEach(function(d){
//             d.poverty = +d.poverty;
//             d.age = +d.age;
//             d.healthcare = +d.healthcare;
//             d.income = +d.income;
//             d.obesity = +d.obesity;
//             d.smokes = +d.smokes
//         })

//         // console.log(data)

//         // INCOME VS OBESITY 

//         // create scale functions 
//         // find the minimum values for X: INCOME
//         var incomeMin = d3.min(data, d => d.income)
//         console.log(incomeMin)

//         var incomeMax = d3.max(data, d => d.income)

//         var xLinearScale = //d3.scaleLinear()
//             //.domain([incomeMin, incomeMax])
//             //.range([0, chartWidth])
//             xScale(data, chosenXAxis)
//             .nice();

//         // find the scale functions for Y Values OBESITY
//         var obesityMin = d3.min(data, d => d.obesity)
//         var obesityMax = d3.max(data, d => d.obesity)

//         var yLinearScale = //d3.scaleLinear()
//             //.domain([obesityMin, obesityMax])
//             //.range([chartHeight, 0])
//             yScale(data, chosenYAxis)
//             .nice();
        
//         // create axis functions
//         var bottomAxis = d3.axisBottom(xLinearScale);
//         var leftAxis = d3.axisLeft(yLinearScale);

//         // append to chart
//         var xAxis = chartGroup.append('g')
//             .classed('x-axis', true)
//             .attr('transform', `translate(0, ${chartHeight})`)
//             .call(bottomAxis)
        
//         var yAxis = chartGroup.append('g')
//             .classed('y-axis', true)
//             .call(leftAxis)
        
//         // create circles
//         var circlesGroup = chartGroup.selectAll('circle')
//         .data(data)
//         .enter()
//         .append('circle')
//         // .attr('cx', d=> xLinearScale(d.income))
//         // .attr('cy', d => yLinearScale(d.obesity))
//         .attr('cx', d=> xLinearScale(d[chosenXAxis]))
//         .attr('cy', d => yLinearScale(d[chosenYAxis]))
//         .attr('r', '15')
//         .attr('fill', 'pink')
//         .attr('opacity', '.75')
//         // .text(data, d => d.abbr)

//         // append text to data
//         var textGroup = chartGroup.selectAll('.stateText')
//             .data(data)
//             .enter()
//             .append('text')
//             .attr('x', d => xLinearScale(d[chosenXAxis]))
//             .attr('y', d => yLinearScale(d[chosenYAxis]))
//             .text(function(d){
//                 return d.abbr
//             })
//             .attr('text-anchor', 'middle')

            

//         // create labels for the (3) x labels
//         var xlabelsGroup = chartGroup.append("g")
//             .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
        
//         var medianIncomeLabel = xlabelsGroup.append('text')
//             .attr("x", 0)
//             .attr("y", 20)
//             .attr('value', 'income')
//             .classed('active', true)
//             .text('Median Income ($)')

//         var ageLabel = xlabelsGroup.append('text')
//             .attr("x", 0)
//             .attr("y", 40)
//             .attr('value', 'age')
//             .classed('inactive', true)
//             .text('Age (Median)')
        
//         var povertyLabel = xlabelsGroup.append('text')
//             .attr("x", 0)
//             .attr("y", 60)
//             .attr('value', 'poverty')
//             .classed('inactive', true)
//             .text('Poverty (%)')

//         // create axes labels for (3) y axis labels
//         var  ylabelsgroup = chartGroup.append('g')
//             .attr('transform', `translate(-25, ${chartHeight/2})`)
        
//         var obesityLabel = ylabelsgroup.append('text')
//             .attr('transform', 'rotate(-90)')
//             .attr("y", -30)
//             .attr("x", 0)
//             .attr('value', 'obesity')
//             .attr("dy", "1em")
//             .classed('axis-test', true)
//             .classed('active', true)
//             .text("Obesity (%)");
        
//         var healthcareLabel = ylabelsgroup.append('text')
//             .attr('transform', 'rotate(-90)')
//             .attr("y", -50)
//             .attr("x", 0)
//             .attr('value', 'healthcare')
//             .attr("dy", "1em")
//             .classed('axis-test', true)
//             .classed('inactive', true)
//             .text("Healthcare (%)");
        
//         var smokeLabel = ylabelsgroup.append('text')
//             .attr('transform', 'rotate(-90)')
//             .attr("y", -70)
//             .attr("x", 0)
//             .attr("dy", "1em")
//             .classed('axis-test', true)
//             .classed('inactive', true)
//             .text("Smokes (%)");
        
//             // .attr("y", 0 - margin.left)
//             // .attr("x", 0 - (chartHeight / 1.5))
//             // .attr("dy", "1em")
//             // .attr("class", "axisText")
//             // .text("Obesity (%)");
        
//         // chartGroup.append("text")
//         //     .attr("transform", `translate(${chartWidth / 3}, ${chartHeight + (margin.top / 1.2)})`)
//         //     .attr("class", "axisText")
//         //     .text("Median Income ($)");
        
//         // update tooltip function
//         var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup)

//         // create event listener for both x and y
//         xlabelsGroup.selectAll('text')
//         .on('click', function() {

//             var value = d3.select(this).attr('value');
//             if (value !== chosenXAxis) {
//                 chosenXAxis = values;

//             // updates x scale for new data
//             xLinearScale = xScale(data, chosenXAxis);

//             // update x axis 
//             xAxis = renderXAxes(xLinearScale, xAxis);

//             // update circles with new x selections
//             circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//             // update text with new values
//             textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//             // update tooltips with new values
//             circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

//             // changes classes to change bold text
//             if (chosenXAxis === 'income') {
//                 medianIncomeLabel
//                 .classed('active', true)
//                 .classed('inactive', false);
//                 ageLabel
//                 .classed('active', false)
//                 .classed('inactive', true);
//                 povertyLabel
//                 .classed('active', false)
//                 .classed('inactive', true);
//             }
//             else if (chosenXAxis === ' age'){
//                 ageLabel
//                 .classed('active', true)
//                 .classed('inactive', false);
//                 medianIncomeLabel
//                 .classed('active', false)
//                 .classed('inactive', true);
//                 povertyLabel
//                 .classed('active', false)
//                 .classed('inactive', true);
//             }
//             else {
//                 povertyLabel
//                 .classed('active', true)
//                 .classed('inactive', false);
//                 ageLabel
//                 .classed('active', false)
//                 .classed('inactive', true);
//                 medianIncomeLabel
//                 .classed('active', false)
//                 .classed('inactive', true);

//             }


//             }






//         })
//         // y axis labels event listener
//         ylabelsgroup.selectAll('text')
//         .on('click', function(){
//             // get value of selection
//             var value = d3.select(this).attr('value');
//             if (value !== chosenYAxis) {
                
//                 // replace y axis with value 
//                 chosenYAxis = value

//                 // updates x scale for new data
//                 yLinearScale = yScale(data, chosenYAxis);

//                 // updates y axis with transition
//                 yAxis = renderYAxes(yLinearScale, yAxis);

//                 // update circles with new y values
//                 circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);

//                 // update text with new y values
//                 textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

//                 // update tooltips with new stuff 
//                 circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

//                 // change classes to change bold text
//                 if (chosenYAxis === 'obesity'){
//                     obesityLabel
//                     .classed("active", true)
//                     .classed("inactive", false);
//                     healthcareLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                     smokeLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 }
//                 else if (chosenYAxis === 'smokes'){
//                     obesityLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                     healthcareLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                     smokeLabel
//                     .classed("active", true)
//                     .classed("inactive", false);

//                 }
//                 else {
//                     obesityLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                     healthcareLabel
//                     .classed("active", true)
//                     .classed("inactive", false);
//                     smokeLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 }

//             }



//         })






//     }).catch(function(error){
//         console.log(error);
//     })







// }

// makeResponsive();
// d3.select(window).on('resize', makeResponsive)
