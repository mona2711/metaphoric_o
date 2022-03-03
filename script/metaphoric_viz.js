/******************************* setting the required constant*******************************************/

// set the dimensions and margins of the svg
var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
},

width = 940;
height = 500;

// append the svg object to the body of the page, appends a 'group' element to 'svg', moves the 'group' element to the top left margin
var metaphoric_svg = d3.select("#metaphoric_viz").append("svg")
.classed("main_svg",true)
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(35,-50)");

var V_story_svg = d3.select("#victim_story").append("svg")
.attr("width", 0)
.attr("height", 0)
.attr("transform", "translate(" + 40 + "," + margin.top + ")")

// Tooltip
const tip = d3.tip()
.attr('id', 'd3-tip')
.style('font-size', '11px')
.style('font-weight', 'bold')
.html(d => {
    let text = `<span style='color:black;'>${d.event}</span><br>`
    return text
})

V_story_svg.call(tip)

// Moving/adjusting tooltips
var fragment = document.createDocumentFragment();
fragment.appendChild(document.getElementById('d3-tip'));
document.getElementById('victim_story').appendChild(fragment);

//coordinates of the different shapes of flower - represents the descipline
var petalPaths = [
[
    'M 0,0 C -4.16,-4.16 -4.16,-16.6 0,-20.83 C 4.16,-16.6 4.16,-4.16 0,0'
],
[
    'M 0,0 C -8.3,-8.3 -8.3,-16.6 0,-20.83 C 8.3,-16.6 8.3,-8.3 0,0'
],
[
    'M 0,0 C 5, 5 5,20 0,20 C -5,20 -5,5 0,0'
],
[
    'M 0,0 C 10, 10 10,20 0,20 C -10,20 -10,10 0,0'
],
[
    'M 0,0 C 5,8 5,14 4,20 L0,16 L-10,20 C-5, 14 -5,8 0,0'
],
[
    'M0,0 C10,8 10,14 4,20 L0,17 L-4,20 C-10,14 -10,8 0,0'
],
['M0,0 C5,8 5,14 4,20 L0,17 L-4,20 C-5,14 -5,8 0,0'
],
[
    'M-7,0 C-5,5 5,5 7,0 C10,5 5,14 0,20 C-5,14 -10,5 -7,0'
],
[
    'M-7,0 C-10,10 10,10 7,0 C10,10 10,14 0,20 C-10,14 -10,10 -7,0'
]
];

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


//different scales 
var colors_scale = d3.scaleOrdinal()
.domain(['Undergraduate Student', 'Graduate Student', 'Staff', 'Faculty', 'Chair/Dean/Head'])
.range(['#A2D2FF', '#CAB8FF', '#FCFFA6', '#FFA0A0', '#F94892', ]);


    d3.csv("https://raw.githubusercontent.com/mona2711/Data/master/sample_main_14feb.csv").then(data => {

 

data.forEach(function(d, i) {
    if(d.itype == "Multiple"){
        d.itype = "More Than One Institution"
    }
    if(d.cleandiscipline_new == "Applied science"){
        d.cleandiscipline_new = "Applied sciences"
    }
    
    d.id = i;
    d.radius = 26;
})
main(data)
})

function main(data) {

//sorting data as per the given customize list
// var status_list = ['Undergraduate Student', 'Graduate Student', 'Staff', 'Faculty', 'Chair/Dean/Head', ]
// data.sort(function(a, b) {
//     return status_list.indexOf(a.perpetrator_new) - status_list.indexOf(b.perpetrator_new)
// })

// Define the div for the tooltip



var linearScale = d3.scaleLinear()
    .domain([
        d3.min(data, d => d.story_word_count),
        d3.max(data, d => d.story_word_count),
    ]).range([.625, .615]);


var flowers = metaphoric_svg.selectAll('g.flower')
    .data(data).enter().append('g')
    .classed('flower', true)
    .on("click", function(d) {
        var selected_flower = this;
        animate(d, selected_flower);
    })
    .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div.html("<strong>" + "Harasser Rank:"+ "</strong>" + d.perpetrator_new +"</br>" 
        + "<strong>" + "Harraser Gender:" + "</strong>" +d.gendersquash + "</br>" 
        + "<strong>" + "Victim Rank:" + "</strong>" + d.cleantarget_new + "</br>" 
        + "<strong>" + "Victim's Field of study:" + "</strong>" + d.cleandiscipline + "</br>" 
        + "<strong>" + "Victim's Institute Type: " + "</strong>" + d.itype )	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })					
    .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });

var perp = flowers.append("circle")
    .attr("class", "harasser")
    .attr("cx", 2) // position the x-centre
    .attr("cy", 2) // position the y-centre
    .attr("r", function(d) {
        return d.radius
    })
    .attr("fill", function(d) {
        return colors_scale(d.perpetrator_new)
    }).attr('opacity', '1')
    .attr('stroke-width', function(d) {
        if (d.id == "22") {
            d3.select(this).classed('story_highlighted',true);
        } else {
            return 2;
        }
    })

    .attr("stroke-dasharray", function(d) {
        if (d.gendersquash == "Male") {
            return "0,0"
        }
        if (d.gendersquash == "Female") {
            return "0,0"
        }
        if (d.gendersquash == "Other") {
            return "7,2"
        }
    })

    .attr("stroke", function(d) {
        if (d.gendersquash == "Female") {
            return '#000'
        }
        if (d.gendersquash == "Male") {
            return colors_scale(d.perpetrator_new)
        }
        if (d.gendersquash == "Other") {
            return '#000'
        }
    })

  

flowers.selectAll('path')
    .data(function(d) {
        var numPetals = Math.floor(Math.random() * (8 - 5) + 5);

        if (d.cleandiscipline_new == 'Humanities') {
            var path = petalPaths[0]
        } else if (d.cleandiscipline_new == 'Social sciences') {
            var path = petalPaths[7]

        } else if (d.cleandiscipline_new == 'Natural sciences') {
            var path = petalPaths[6]

        } else if (d.cleandiscipline_new == 'Formal sciences') {
            var path = petalPaths[8] //8

        } else if (d.cleandiscipline_new == 'Applied sciences') {
            var path = petalPaths[3] //1

        }
        var Tcolor = colors_scale(d.cleantarget_new)
        return _.times(numPetals, function(i) {
            return {
                angle: (360 / numPetals) * i,
                path: path,
                color: Tcolor,
                id: d.id,
                event: d.event,
                victim:d.cleantarget_new
            }
        });
    }).enter().append('path')

    .attr('stroke', '#000')
    .attr('fill', function(d) {
        return d.color
    })
    .attr('opacity', 1)
    .attr('d', function(d) {
        return d.path
    })
    .attr('transform', function(d) {
        var cx = 2;
        var cy = 2;
        return 'translate(' + [cx, cy] +
            ')rotate(' + [d.angle] + ')';
    })
 

    
   
var stories_clicked = [];
var stories_clicked_pre = [];

// function to select and deselect story
function animate(d, selected_flower) {
        tip.show(d);
        if ($('#story_clicked_ids').val() == " ") {
            stories_clicked.length = 0;
        }
        if ($('#story_clicked_ids_pre').val() == " ") {
            stories_clicked_pre.length = 0;
        }
        stories_clicked.push(d.id)
        $('#story_clicked_ids').val(stories_clicked);
        $('#no_story_clicked').val((Number($('#no_story_clicked').val()) + 1))

        stories_clicked_pre.push(d.id)
        $('#story_clicked_ids_pre').val(stories_clicked_pre);
        $('#no_story_clicked_pre').val((Number($('#no_story_clicked_pre').val()) + 1))
        


        d3.selectAll('.selected').classed('selected', false)
        d3.select(selected_flower).classed("selected", true)
        d3.selectAll('.flower').style('opacity', .2)
    
}


flowers.append("circle") // attach a circle
    .classed("flower-center", true)
    .attr("cx", 2) // position the x-centre
    .attr("cy", 2) // position the y-centre
    .attr("r", 3) // set the radius
    .attr("fill", "#000")
    .attr('stroke-width', '1px')
    .attr("stroke", function(d) {
        return colors_scale(d.cleantargetrole)
    })


var centerScale = d3.scalePoint().padding(1.5).range([0, width]);
var textScale = d3.scalePoint().padding(.5).range([0, width]);

// constants used in the simulation
var center = {
    x: width / 2,
    y: height / 2
};
var forceStrength = 0.05;

//setting the variable
var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .velocityDecay(0.05)
    // .force('center', d3.forceCenter(width / 2, height / 2)) //this force make element attracts towards a point
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(-30)) //this force make element repel each other
    .force('collision', d3.forceCollide().radius(function(d) {
        var storylength = d.story_word_count
        var scale_size = linearScale(storylength)
        return d.radius * scale_size + 1
    }))

simulation.nodes(data).on("tick", ticked);
// Set initial layout to single group.
groupBubbles();

function ticked() {
    metaphoric_svg.selectAll('g.flower')
        .attr("transform", function(d) {
            // var storylength = d.event.length
            var storylength = d.story_word_count
            var scale_size = linearScale(storylength)
            return "translate(" + (d.x ) + "," + (d.y*1.2) + ")scale(" + scale_size + ")";
            // return "translate(" + (d.x) + "," + d.y + ")";
        })
}

function groupBubbles() {
    //  hideTitles();
    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(width / 2));
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
}

function splitBubbles(byVar) {
    centerScale.domain(data.map(function(d) {
        return d[byVar];
    }));

    textScale.domain(data.map(function(d) {
        return d[byVar];
    }));

    if (byVar == "all") {
        hideTitles()
    } else {
        showTitles(byVar, textScale);
    }

    // @v4 Reset the 'x' force to draw the bubbles to their  centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(function(d) {
        return centerScale(d[byVar]);
    }));
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(2).restart();
}

function hideTitles() {
    metaphoric_svg.selectAll('.title').remove();
}

function showTitles(byVar, scale) {

    var titles = metaphoric_svg.selectAll('.title')
        .data(scale.domain());

    if(byVar == "cleantarget_new"){
        titles.enter().append('text')
        .attr('class', 'title')
        .merge(titles)
        .attr('x', function(d) {
            if(d=="Graduate Student"){
                return "180px";
            }
            else if (d == "Undergraduate Student"){
                return '390px'
            }
            else if(d=="Faculty"){
                return '550px'
            }
            else if(d=="Chair/Dean/Head"){
                return '710px'
            }
            else if (d == "Staff")
            {
                return '825px'
            }
        
            else{
            return scale(d);
            }
        })
        .attr('y', 550)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(function(d) {
            return d;
        });
    titles.exit().remove()
    }

    else if(byVar == "perpetrator_new"){
        titles.enter().append('text')
        .attr('class', 'title')
        .merge(titles)
        .attr('x', function(d) {
            if(d=="Graduate Student"){
                return "555px";
            }
            else if (d == "Undergraduate Student"){
                return '700px'
            }
            else if(d=="Faculty"){
                return '180px'
            }
            else if(d=="Chair/Dean/Head"){
                return '390px'
            }
            else if (d == "Staff")
            {
                return '815px'
            }
        
            else{
            return scale(d);
            }
        })
        .attr('y', 550)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(function(d) {
            return d;
        });
    titles.exit().remove()
    }

 

else{
    titles.enter().append('text')
        .attr('class', 'title')
        .merge(titles)
        .attr('x', function(d) {
            if(d=="Male"){
                return "280px";
            }
            else if (d == "Female"){
                return '580px'
            }
            else if (d == "Other")
            {
                return '760px'
            }
            else if (d == "Research Institute"){
                return '130px'
            }
            else if (d == "Elite Institution"){
                return '356px'
            }
            else if (d == "Regional College"){
                return '550px'
            }
         
            else if (d == "More Than One Institution"){
                return '710px'
            }
            else{
            return scale(d);
            }
        })
        .attr('y', 550)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(function(d) {
            return d;
        });
    titles.exit().remove()
}
}
function setupButtons() {
    d3.selectAll('.button')
        .on('click', function() {
            // Remove active class from all buttons
            d3.selectAll('.button').classed('active', false);
            // Find the button just clicked
            var button = d3.select(this);
            // Set it as the active button
            button.classed('active', true);
            // Get the id of the button
            var buttonId = button.attr('id');
            // Toggle the bubble chart based on the currently clicked button
            splitBubbles(buttonId);
        });
}

setupButtons()

document.addEventListener("click", function(event) {
    const svg = document.querySelector('svg.main_svg');
            if (event.target === svg) {
            $(".flower").removeClass("selected");
            $('.flower').attr('style','opacity: 1');
            $('#d3-tip span').remove();
               }
            
});

 
}



