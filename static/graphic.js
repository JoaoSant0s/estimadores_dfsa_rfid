class Graphic {
    constructor(estimador) {
        this.estimador = estimador;
        this.margin = { top: 50, right: 50, bottom: 50, left: 50 };
        this.width = 400 - this.margin.left - this.margin.right // Use the window's width 
        this.height = 300 - this.margin.top - this.margin.bottom; // Use the window's height    
    }

    init() {
        this.create();
    }    

    create(){
        var grapchisType = [{
            id: "slotsTotal", 
            max:{x: 1000, y: 4000},
            min: { x: 100, y: 0 },
            ticks:{x: 10, y: 10},
            yName: "Número de Slots"
        }, 
        {
            id: "slotsEmpty",
            max: { x: 1000, y: 3500 },
            min: { x: 100, y: 0 },
            ticks: { x: 10, y: 10 },
            yName: "Número de Slots Vazios"
        }, 
        {
            id: "slotsCollisions",
            max: { x: 1000, y: 1800},
            min: { x: 100, y: 0},
            ticks: { x: 10, y: 10 },
            yName: "Número de Slots em Colisão"
        },
        {
            id: "slotsEficiencia",
            max: { x: 1000, y: 100 },
            min: { x: 100, y: 0 },
            ticks: { x: 10, y: 10 },
            yName: "Eficiência %"
        },
        {
            id: "slotsTime",
            max: { x: 1000, y: 0.35 },
            min: { x: 100, y: 0.0 },
            ticks: { x: 10, y: 15 },
            yName: "Tempo milissegundos"
        }]

        /* , "slotsCollided", "slotsEmpties" */

        for (let i = 0; i < grapchisType.length; i++) {
            var svg = d3.select("#"+grapchisType[i].id).remove();            
        }    
        
        for (let i = 0; i < grapchisType.length; i++) {  
            var graphic = grapchisType[i];
            var dataset = this.estimador.estimadorObject[graphic.id];             

            var xScale = d3.scaleLinear()
                .domain([graphic.min.x, graphic.max.x]) // input
                .range([0, this.width]); // output

            // 6. Y scale will use the randomly generate number 
            var yScale = d3.scaleLinear()
                .domain([graphic.min.y, graphic.max.y]) // input 
                .range([this.height, 0]); // output 

            // 7. d3's line generator
            var line = d3.line()
                .x(function (d, i) { return xScale(d.x); }) // set the x values for the line generator
                .y(function (d) { return yScale(d.y); }) // set the y values for the line generator                 

            //var dataset = d3.range(n).map(function (d) { return { "y": d3.randomUniform(1100)() } })
            var svg = d3.select("body").append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .attr("id", graphic.id)
                .append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

            var legend = svg.append("g");
            legend.append("ellipse") // Uses the enter().append() method
                .attr("class", "dot_lowerBound") // Assign a class for styling
                .attr("cx", 0)
                .attr("cy", -35)
                .attr("rx", 4)
                .attr("ry", 1);

            legend.append("text")
                .attr("x", 10)
                .attr("y", -30)   
                .style("font-size", "15px")                                      
                .text("Lower Bound");
                
            legend.append("ellipse") // Uses the enter().append() method
                .attr("class", "dot_eomLee") // Assign a class for styling
                .attr("cx", 0)
                .attr("cy", -20)
                .attr("rx", 4)
                .attr("ry", 1);

            legend.append("text")
                .attr("x", 10)
                .attr("y", -15)  
                .style("font-size", "15px")                                            
                .text("Eom Lee");

            legend.append("ellipse") // Uses the enter().append() method
                .attr("class", "dot_chen") // Assign a class for styling
                .attr("cx", 125)
                .attr("cy", -35)
                .attr("rx", 4)
                .attr("ry", 1);

            legend.append("text")
                .attr("x", 135)
                .attr("y", -30)
                .style("font-size", "15px")
                .text("Chen");

            // 3. Call the x axis in a group tag
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(xScale).ticks(graphic.ticks.x).tickSize(-this.height))
                .append("text")
                .attr("x", this.width / 2)
                .attr("y", 20)                
                .attr("fill", "#000")
                .attr("text-anchor", "center")
                .text("Número de Etiquetas");

            // 4. Call the y axis in a group tag
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale).ticks(graphic.ticks.y).tickSize(-this.width))
                .append("text")
                .attr("transform", "translate(-40,50) rotate(-90)")
                .attr("x", 0)
                .attr("y", 0)                
                .attr("fill", "#000")
                .attr("text-anchor", "center")
                .text(graphic.yName);
            
            for (var key in dataset){
                var set = dataset[key];   

                var group = svg.append("g");            
                                
                group.append("path")
                    .datum(set) // 10. Binds data to the line 
                    .attr("class", "line_" + key) // Assign a class for styling 
                    .attr("data-legend", function (d) { return key })
                    .attr("d", line); // 11. Calls the line generator 

                // 12. Appends a circle for each datapoint 
                group.selectAll(".dot")
                    .data(set)
                    .enter().append("ellipse") // Uses the enter().append() method
                    .attr("class", "dot_" + key) // Assign a class for styling
                    .attr("cx", function (d, i) {
                        var x = xScale(d.x);
                        return x;
                    })
                    .attr("cy", function (d) {
                        var y = yScale(d.y);
                        return y;
                    })
                    .attr("rx", 4)
                    .attr("ry", 1)                            
            }                    
        }        
    }   
}
