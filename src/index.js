document.addEventListener("DOMContentLoaded", function() {
   // Assuming `svg` is your SVG object and `width`, `height` are its dimensions
   let svg = d3.select("svg");
   svg.attr("overflow", "hidden");



   const instructionParagraph = document.querySelector('.instruction-box p');
   console.log("Selected Element:", instructionParagraph);
   const visualizationGroup = document.getElementById("visualization");


   const numberInputs = document.querySelectorAll('input[type="number"]');
   numberInputs.forEach(input => {
    input.addEventListener('input', function(event) {
        // Call clearLegend with the specific input's ID
        clearLegend(input.id);
        // Also update the visualization and legend as if it was a new drag-and-drop
        const newValue = event.target.value;
        // You may need additional logic here to determine the meta information
        // such as rowName and columnName, or decide to remove the legend entry entirely
        // if it doesn't apply for manual inputs
        updateVisualization(input.id, newValue, { rowName: 'Manual', columnName: 'Input' });
    });
});

   let width = svg.node().getBoundingClientRect().width;
   let height = svg.node().getBoundingClientRect().height;
   let designCounter = 2;
   let polygonSides = 3;
   let minSize = 10;
   let loops = 5;
   let loopWidth = 20;
   let joints = 6;
   let jointRadius = 5;
   let initialRadius = 50; 
   let currentShape = 'polygon';
   let jointWidth = 5; 
   //new
   let visualizationMappings = {};


   var currentData = [];

   const g_rulers = svg.append('g').attr('id', 'rulers');
   const g_shapes = svg.append('g').attr('id', 'shapes');
   const g = svg.append('g');


//Get the Bounding Box of the Pattern:


   const dpi = 96;  // Adjust this based on your display
   const pixelsPerCm = dpi / 2.54;  // How many pixels represent a centimeter
   
   updateRuler(1); 

// Modify the zoomed function to include ruler drawing:
function zoomed(event) {
    g.attr('transform', event.transform);
}


const legendDiv = document.querySelector('.legend');
const legendHeight = legendDiv.offsetHeight;




    // Adjust the SVG's dimensions based on the legend margins
let svgWidth = svg.node().getBoundingClientRect().width;
let svgHeight = svg.node().getBoundingClientRect().height - legendHeight;


    
    // Define the clipping path
    const clip = svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    // Apply the clipping path to your shapes group
    g_shapes.attr("clip-path", "url(#clip)");
    
// Apply the clipping path to your shapes group
g_shapes.attr("clip-path", "url(#clip)");

//Zoom 

    const zoom = d3.zoom()
    .scaleExtent([0.1, 10])  // This sets the minimum and maximum zoom levels. Adjust as needed.
    .on('zoom', zoomed);

svg.call(zoom);


// Place this function at the top level of your script so it's accessible throughout
function clearHeaderIndicator(inputElement) {
    let headerIndicator = inputElement.nextElementSibling;
    if (headerIndicator && headerIndicator.classList.contains('column-header-indicator')) {
        headerIndicator.remove(); // This removes the header indicator span element.
        inputElement.style.width = '100%'; // Reset the input width if necessary.
    }
}


// Attach the event listener to all number inputs
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', () => clearHeaderIndicator(input));
});


// Define the function to handle drag over event
function handleDragOver(event) {
    event.preventDefault(); // This is necessary to allow the drop
    // Additional functionality as needed for dragover
}


function updateRuler(scale) {
    // Clear the existing ruler elements
    g_rulers.selectAll("*").remove();

    // Pixels per cm adjusted for the zoom scale
    const scaledPixelsPerCm = pixelsPerCm * scale;

    // Calculate the maximum width and height in cm based on the SVG size
    const maxCmWidth = width / scaledPixelsPerCm;
    const maxCmHeight = height / scaledPixelsPerCm;

    // Horizontal Ruler
    for (let i = 0; i <= maxCmWidth; i++) {
        const xPos = i * scaledPixelsPerCm;
        g_rulers.append("line")
            .attr("x1", xPos)
            .attr("y1", 10)
            .attr("x2", xPos)
            .attr("y2", 0)
            .attr("stroke", "black");

        if (i % 1 === 0) {  // Only label whole centimeters
            g_rulers.append("text")
                .attr("x", xPos)
                .attr("y", 20)
                .text(i)
                .attr("font-size", "10px")
                .attr("text-anchor", "middle");
        }
    }

    // Vertical Ruler
    for (let j = 0; j <= maxCmHeight; j++) {
        const yPos = j * scaledPixelsPerCm;
        g_rulers.append("line")
            .attr("x1", 5)
            .attr("y1", yPos)
            .attr("x2", 15)
            .attr("y2", yPos)
            .attr("stroke", "black");

        if (j % 1 === 0) {  // Only label whole centimeters
            g_rulers.append("text")
                .attr("x", 20)
                .attr("y", yPos)
                .text(j)
                .attr("font-size", "10px")
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "middle");
        }
    }
}


function zoomed(event) {
    g.attr('transform', event.transform);
    updateRuler(event.transform.k);
}


//Reset Zoom button:


   
   console.log("Computed Width:", width);  
   console.log("Computed Height:", height);  
   
// Tooltip for table headers
tippy('th', {
    content: 'Click to divide the values in this column',
    placement: 'top', // you can choose: 'top', 'bottom', 'left', 'right'
    allowHTML: true, // if you want to allow HTML inside the tooltip
    animation: 'scale', // animation style, e.g., 'scale', 'shift-toward', 'perspective'
    arrow: true // if you want an arrow on the tooltip
  });
  
// Tooltip for shape, joint and loop pop up

  tippy('.info-icon', {
placement: 'right', // or whichever placement you prefer
allowHTML: true, // allows HTML in the tooltip content
animation: 'scale',
arrow: true
});
   
tippy('.info-icon2', {
    onShow(instance) {
        console.log(instance.content); // This should log the content of the tooltip
    },
    placement: 'top',
    allowHTML: true,
    animation: 'scale',
    arrow: true
});

// Function to initialize tooltips on table headers
function initializeTooltips() {
    tippy('th', {
      content: (reference) => reference.getAttribute('data-tippy-content'),
      placement: 'top',
      allowHTML: true,
      animation: 'scale',
      arrow: true
    });
  }
  


    const centerVisualization = () => {
        const svgWidth = svg.node().getBoundingClientRect().width;
        const svgHeight = svg.node().getBoundingClientRect().height;
        g.attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);
    };

    centerVisualization();


    

//for legend
document.getElementById('legendDesign1').innerText = "Legend";




let jointRotation = 0;  // Default rotation value




//draggable devider for rigth side
const divider = document.getElementById('divider');
let isDragging = false;

// Start dragging
divider.addEventListener('mousedown', function(e) {
  e.preventDefault();
  isDragging = true;
});

// Dragging
document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
  let minWidth = 200; // Minimum width of the right section
  let maxWidth = window.innerWidth - minWidth; // Maximum width of the left section
  if (offsetRight > minWidth && offsetRight < maxWidth) {
    document.querySelector('.right-section').style.width = `${offsetRight}px`;
    document.querySelector('.left-section').style.width = `calc(100% - ${offsetRight}px)`;
  }
});

// Stop dragging
document.addEventListener('mouseup', function(e) {
  isDragging = false;
});


//new 2
function getActiveSVG() {
    const activeDesign = document.querySelector('.design[style="display: block;"]');
    console.log("Active Design:", activeDesign.id);  // Add this line

    let svg = d3.select(activeDesign).select('svg');
    if (svg.select('g').empty()) { 
        const visualizationContainer = document.querySelector('.visualization');
        const centerX = visualizationContainer.clientWidth / 2;
        const centerY = visualizationContainer.clientHeight / 2;
        svg.append('g').attr('transform', `translate(${centerX},${centerY})`);
    }
    svg.select('g').selectAll('*').remove();  
    
    if (svg.select('text.legend').empty()) {
        svg.append('text')
            .attr('class', 'legend')
            .attr('x', 10)
            .attr('y', svg.node().getBoundingClientRect().height - 10)
            .attr('font-size', '12px');
    }
    
    return svg.select('g');  
}

// NEW
function drawShape(shapeType) {
    switch(shapeType) {
        case 'circle':
            const baseRadius = +document.getElementById('radius').value || 50;
            drawCircle(baseRadius);
            break;
        case 'polygon':
            const sides = parseInt(document.getElementById('polygon-sides').value, 10);
            const radius = parseFloat(document.getElementById('polygon-radius').value);
            drawPolygon(sides, radius);
            break;
        case 'ellipse':
            const rx = +document.getElementById('ellipse-width').value || 50;
            const ry = +document.getElementById('ellipse-height').value || 50;
            drawEllipse(rx, ry);
            break;
        case 'line':
            drawLine(); // No parameters are passed because it fetches them internally
            break;   
    }
    updateInstructionWithSize();
}


function clearLegend(inputId = null) {
    const activeLegend = document.querySelector(`#legend${getActiveDesign()}`);
    if (inputId) {
        // Remove only the legend entry related to the provided inputId
        let entry = activeLegend.querySelector(`div[data-input="${inputId}"]`);
        if (entry) {
            entry.remove();
        }
    } else {
        // Remove all entries if no inputId is provided
        activeLegend.querySelectorAll('div[data-input]').forEach(entry => {
            entry.remove();
        });
    }
}


//START over

 function resetPolygonInputs() {
    document.querySelector('#poly-sides').value = 3;
    document.querySelector('#size').value = 10;
    document.querySelector('#loop-number').value = 5;
    document.querySelector('#loop-width').value = 20;
    document.querySelector('#joint-number').value = 6;
    document.querySelector('#joint-width').value = 5;
 }

function resetCircleInputs() {
    document.querySelector('#radius').value = 50;
    document.querySelector('#loop-number').value = 5;
    document.querySelector('#loop-width').value = 20;
    document.querySelector('#joint-number').value = 6;
    document.querySelector('#joint-width').value = 5;
}

function resetEllipseInputs() {
    document.querySelector('#ellipse-width').value = 30;
    document.querySelector('#ellipse-height').value = 50;
    document.querySelector('#loop-number').value = 5;
    document.querySelector('#loop-width').value = 20;
    document.querySelector('#joint-number').value = 6;
    document.querySelector('#joint-width').value = 5;
}

function resetLineInputs() {
    document.querySelector('#line-height').value = 300;
    document.querySelector('#loop-number').value = 5;
    document.querySelector('#loop-width').value = 20;
    document.querySelector('#joint-number').value = 6;
    document.querySelector('#joint-width').value = 5;
}


function resetInputStyles() {
    const dataInputs = document.querySelectorAll('.data-input');
    dataInputs.forEach(input => {
        input.style.borderColor = "";
        input.style.backgroundColor = "";
        input.classList.remove('data-input');
        input.classList.add('manual-input');
    });
    console.log("Styles should be reset!");
}




document.querySelector('#shape-selector').addEventListener('change', function(e) {
    console.log("Shape changed to:", e.target.value); 
    currentShape = e.target.value;
    
    // Reset the inputs based on the selected shape
    switch (currentShape) {
        case 'polygon':
            resetPolygonInputs();
            drawPolygon(polygonSides, minSize); // Directly call the drawing function
            break;
        case 'circle':
            resetCircleInputs();
            drawCircle(); // Directly call the drawing function
            break;
        case 'ellipse':
            resetEllipseInputs();
            drawEllipse(); // Directly call the drawing function
            break;
        case 'line':
            resetLineInputs();
            drawLine(); // Directly call the drawing function
            break;
        default:
            console.error(`Unhandled shape type: ${currentShape}`);
            break;
    }

    resetInputStyles();

});

//start over 

document.getElementById('startOverBtn').addEventListener('click', function() {
        // Resetting inputs for all shapes
        resetPolygonInputs();
        resetCircleInputs();
        resetEllipseInputs();
        resetLineInputs();

    // Resetting inputs
    document.getElementById('ellipse-width').value = 50;
    document.getElementById('ellipse-height').value = 50;
    // ... reset other inputs ...

    // Clearing the SVG
    g.selectAll('*').remove();
    clearLegend(); 


        // Reset the styles for all elements with the class 'data-input'
        const dataInputs = document.querySelectorAll('.data-input');
        dataInputs.forEach(input => {
            input.style.borderColor = "";
            input.style.backgroundColor = "";
            input.classList.remove('data-input');
            input.classList.add('manual-input');
        });
        console.log("Styles should be reset!");  
    });      



//legend

function updateVisualization(inputId, newValue, meta = {}) {
    console.log("Updating visualization:", inputId, "New Value:", newValue, "Meta:", meta);


    switch(inputId) {
        // ... existing code ...
    }
    drawVisualization();  // Redraw the visualization with the new values
    if (isDragDrop) {
        // If the update is from a drag-and-drop, update the legend with meta data
        updateLegend(inputId, `${meta.rowName}'s ${meta.columnName}: ${newValue}`, true);
    } else {
        // If the update is from a manual input, handle accordingly
        // This could mean updating with different text or clearing the entry
        updateLegend(inputId, `Manual Input: ${newValue}`, false);
    }
}


function updateLegend(inputId, datasetValue, isDragDrop, sizeInfo = null) {
    const legendId = "legend" + getActiveDesign();
    const legendDiv = document.querySelector(`#${legendId}`);

    // Fetch the input's description from the data-label attribute
    const inputElement = document.getElementById(inputId);
    const inputDescription = inputElement.getAttribute('data-label');
    

    // Remove existing legend entry for this input
    const existingEntry = legendDiv.querySelector(`div[data-input="${inputId}"]`);
    if (existingEntry) {
        legendDiv.removeChild(existingEntry);
    }

    // If this update was due to a drag and drop, add the legend entry
    if (isDragDrop) {
        const legendText = `${inputDescription} represents ${datasetValue}`;
        
        const entry = document.createElement('div');
        entry.setAttribute('data-input', inputId);
        entry.textContent = legendText;
        legendDiv.appendChild(entry);
    }

    // Add the size info if provided
    if (sizeInfo) {
        const sizeEntry = document.createElement('div');
        sizeEntry.textContent = sizeInfo;
        legendDiv.appendChild(sizeEntry);
    }
}



function drawPolygon(sides, radius, shift) {
    // Round the sides to the nearest whole number
    sides = Math.round(sides);

    const angle = 2 * Math.PI / sides;
    const perimeter = 2 * Math.PI * radius;
    const gapLength = perimeter / joints; // Ensure 'joints' is defined elsewhere in your code
    const anglePerJoint = 2 * Math.PI / joints; // Ensure 'joints' is defined elsewhere in your code

    const coordinates = Array.from({ length: sides }, (_, i) => {
        return [Math.cos(i * angle) * radius, Math.sin(i * angle) * radius];
    });

    g.append('path')
        .attr('d', d3.line()(coordinates) + "Z")
        .attr('stroke', 'black')
        .attr('fill', 'none');

    for (let i = 0; i < joints; i++) { // Ensure 'joints' is defined elsewhere in your code
        const distance = i * gapLength + shift * perimeter;
        let coveredDistance = 0;
        for (let j = 0; j < sides; j++) {
            const start = coordinates[j];
            const end = coordinates[(j + 1) % sides];
            const segmentLength = Math.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2);
            if (coveredDistance + segmentLength > distance) {
                const ratio = (distance - coveredDistance) / segmentLength;
                const jointX = start[0] + (end[0] - start[0]) * ratio;
                const jointY = start[1] + (end[1] - start[1]) * ratio;
                g.append('circle')
                    .attr('cx', jointX)
                    .attr('cy', jointY)
                    .attr('r', jointRadius) // Ensure 'jointRadius' is defined elsewhere in your code
                    .attr('fill', 'white');
                break;
            }
            coveredDistance += segmentLength;
        }
    }
    
    // Ensure 'updateInstructionWithSize' function is defined elsewhere in your code and called appropriately
    updateInstructionWithSize();
}




function drawCircle() {
    console.log("Inside drawCircle function");
    g.selectAll('*').remove(); 

    const baseRadius = +document.getElementById('radius').value || 50;
    let arcExtent = +document.getElementById('arc-extent').value || 360;

    // Adjust arcExtent near 0 or 360 degrees
    if (arcExtent <= 0) {
        arcExtent = 0.1; // Slight offset from 0
    } else if (arcExtent >= 360) {
        arcExtent = 359.9; // Slight offset from 360
    }

    const anglePerJointOuter = (arcExtent * Math.PI / 180) / (joints - 1);
    const halfShiftAngle = anglePerJointOuter / 2; 

    const orientation = +document.getElementById('arc-orientation').value || 0;
    const orientationRadians = orientation * (Math.PI / 180);

    for (let i = 0; i < loops; i++) {
        const currentRadius = baseRadius + (loopWidth * i);
        const shiftForCurrentLoop = (i % 2) * halfShiftAngle;

        // Use SVG paths to create the arcs
        const startX = Math.cos(orientationRadians) * currentRadius;
        const startY = Math.sin(orientationRadians) * currentRadius;
        const endX = Math.cos((arcExtent * Math.PI / 180) + orientationRadians) * currentRadius;
        const endY = Math.sin((arcExtent * Math.PI / 180) + orientationRadians) * currentRadius;
        const largeArcFlag = arcExtent <= 180 ? 0 : 1;

        const pathData = `M ${startX} ${startY} A ${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
        console.log("startX:", startX, "startY:", startY, "currentRadius:", currentRadius, "largeArcFlag:", largeArcFlag, "endX:", endX, "endY:", endY);

        g.append('path')
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke', 'black');
        console.log("Path Data:", pathData);

        for (let j = 0; j < joints; j++) {
            const angle = j * anglePerJointOuter + shiftForCurrentLoop + orientationRadians;
            const jointX = Math.cos(angle) * currentRadius;
            const jointY = Math.sin(angle) * currentRadius;

            g.append('circle')
                .attr('cx', jointX)
                .attr('cy', jointY)
                .attr('r', jointRadius)
                .attr('fill', 'white');
        }
        updateInstructionWithSize();
    }
}




document.querySelector('#radius').addEventListener('input', function(e) {
    const newRadius = e.target.value;
    updateVisualization('radius', newRadius); // Call with the 'radius' inputId
});



document.querySelector('#arc-extent').addEventListener('input', function(e) {
    const display = document.getElementById('arc-extent-display');
    display.textContent = e.target.value;
    drawCircle();
});

document.querySelector('#arc-orientation').addEventListener('input', function(e) {
    const display = document.getElementById('arc-orientation-display');
    display.textContent = e.target.value;
    drawCircle();  // Redraw the circle with the new orientation.
});

document.querySelector('#loop-width').addEventListener('input', function(e) {
    loopWidth = +e.target.value;
    drawCircle(); // Redraw the circle when loop width changes
});

document.querySelector('#joint-width').addEventListener('input', function(e) {
    jointWidth = +e.target.value; // Note: jointWidth might need to be adjusted based on your design (e.g., jointRadius = jointWidth / 2)
    drawCircle(); // Redraw the circle when joint width changes
});

document.querySelector('#joint-number').addEventListener('input', function(e) {
    joints = +e.target.value;
    drawCircle(); // Redraw the circle when the number of joints changes
});

document.querySelector('#loop-number').addEventListener('input', function(e) {
    loops = +e.target.value;
    drawCircle(); // Redraw the circle when the number of loops changes
});



function drawEllipse() {
    console.log("Inside drawEllipse function");
    g.selectAll('*').remove(); // Clear previous shapes

    // Fetch values
    const orientation = +document.getElementById('ellipse-orientation').value || 0;
    let extent = +document.getElementById('ellipse-extent').value || 360;
    const rx = +document.getElementById('ellipse-width').value || 50;
    const ry = +document.getElementById('ellipse-height').value || 50;

    // Adjust extent near 0 or 360 degrees
    if (extent <= 0) {
        extent = 0.1; // Slight offset from 0
    } else if (extent >= 360) {
        extent = 359.9; // Slight offset from 360
    }

    // Convert orientation to radians
    const orientationRadians = orientation * (Math.PI / 180);

    // Draw each loop of the ellipse
    for (let i = 0; i < loops; i++) {
        const currentRx = rx + (loopWidth * i);
        const currentRy = ry + (loopWidth * i);
        const shiftAngle = (i % 2 === 0) ? 0 : (Math.PI / joints);

        // Calculate path for the ellipse
        const startX = currentRx * Math.cos(orientationRadians);
        const startY = currentRy * Math.sin(orientationRadians);
        const endX = currentRx * Math.cos(orientationRadians + extent * Math.PI / 180);
        const endY = currentRy * Math.sin(orientationRadians + extent * Math.PI / 180);
        const largeArcFlag = extent <= 180 ? 0 : 1;

        const pathData = `M ${startX} ${startY} A ${currentRx} ${currentRy} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
        g.append('path')
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke', 'black');
        console.log("Path Data:", pathData);

        // Draw joints if needed
        if (joints > 0) {
            const anglePerJoint = (extent * Math.PI / 180) / (joints - 1);
            for (let j = 0; j < joints; j++) {
                const angle = j * anglePerJoint + shiftAngle + orientationRadians;
                const jointX = currentRx * Math.cos(angle);
                const jointY = currentRy * Math.sin(angle);

                g.append('circle')
                    .attr('cx', jointX)
                    .attr('cy', jointY)
                    .attr('r', jointRadius)
                    .attr('fill', 'white');
            }
        }
    }
    updateInstructionWithSize();
}




document.querySelector('#ellipse-width').addEventListener('input', function(e) {
    drawEllipse();
});

document.querySelector('#ellipse-height').addEventListener('input', function(e) {
    drawEllipse();
});

document.querySelector('#loop-width ').addEventListener('input', function(e) {
    if (currentShape === 'ellipse') {
        loops = +e.target.value; 
        drawEllipse();
    }
});

document.querySelector('#joint-width').addEventListener('input', function(e) {
    if (currentShape === 'ellipse') {
        jointWidth = +e.target.value; 
        drawEllipse();
    }
});

document.querySelector('#joint-number').addEventListener('input', function(e) {
    if (currentShape === 'ellipse') {
        jointWidth = +e.target.value; // Update jointWidth
        drawEllipse();
    }
});


document.querySelector('#loop-number').addEventListener('input', function(e) {
    if (currentShape === 'ellipse') {
        loops = +e.target.value;  // Update the variable
        drawEllipse();
    }
});


document.querySelector('#ellipse-orientation').addEventListener('input', function(e) {
    const display = document.getElementById('ellipse-orientation-display');
    display.textContent = e.target.value;
    drawEllipse();  // Redraw the ellipse with the new orientation.
});

document.querySelector('#ellipse-extent').addEventListener('input', function(e) {
    const display = document.getElementById('ellipse-extent-display');
    display.textContent = e.target.value;
    drawEllipse();  // Redraw the ellipse with the new extent.
});



// Listener for the 'size' input (already provided)

// Fetches values from the DOM and draws the line and its associated features.
function drawLine() {
    const activeSVG = getActiveSVG();

    // Clear any previous drawings
    g_shapes.selectAll('*').remove();

    // Define starting point
    const startX = -50;  // You can adjust this if needed
    const startY = -70;  // You can adjust this if needed

    // Fetch values from the DOM
    const height = +document.getElementById('line-height').value;
    console.log("Height fetched from DOM:", height); // Logging the fetched height

    const loops = +document.getElementById('loop-number').value;
    const loopWidth = +document.getElementById('loop-width').value;
    const joints = +document.getElementById('joint-number').value;
    const jointWidth = +document.getElementById('joint-width').value;
    console.log("Loop Width fetched from DOM:", loopWidth);
    console.log("Joints fetched from DOM:", joints);
    console.log("Joint Width fetched from DOM:", jointWidth);

    // Draw base line
    g.append("line")
    .attr("x1", startX)
        .attr("y1", startY)
        .attr("x2", startX)
        .attr("y2", startY + height)
        .attr("stroke", "black");

    // Draw parallel lines
    drawParallelLines(startX, startY, height, loops, loopWidth);
    
    // Draw joints
    drawJoints(startX, startY, height, loops, loopWidth, joints, jointWidth);
}

function drawParallelLines(startX, startY, height, loops, loopWidth) {
    for(let i = 1; i <= loops; i++) {
        g.append("line")
            .attr("x1", startX + i * loopWidth)
            .attr("y1", startY)
            .attr("x2", startX + i * loopWidth)
            .attr("y2", startY + height)
            .attr("stroke", "black");

            console.log("Base line start:", startX, startY);
            console.log("Base line end:", startX, startY + height);

            // Inside drawParallelLines function
            console.log(`Parallel line ${i} start: ${startX + i * loopWidth}, ${startY}`);
            console.log(`Parallel line ${i} end: ${startX + i * loopWidth}, ${startY + height}`);

    }
    updateInstructionWithSize ();
}

function drawJoints(startX, startY, height, loops, loopWidth, joints, jointWidth) {
    const spacing = height / (joints + 1);
    const lineStrokeWidth = loopWidth;  // Assuming the line's stroke width is the same as loopWidth

    for(let j = 0; j <= loops; j++) {
        const isOddLine = j % 2 !== 0;
        const maxJoints = isOddLine ? joints + 1 : joints;  // Odd lines get an extra joint
        
        for(let i = 1; i <= maxJoints; i++) {
            let yPosition;
            if (!isOddLine) {
                // Even lines
                yPosition = startY + i * spacing;
            } else {
                // Odd lines
                yPosition = startY + (i - 0.5) * spacing;  // Adjust for half-spacing
            }
            
            g.append("rect")
                .attr("x", startX + j * loopWidth - lineStrokeWidth / 2)
                .attr("y", yPosition - jointWidth / 2) // Adjust y to center the rectangle on the joint position
                .attr("width", lineStrokeWidth)
                .attr("height", jointWidth)
                .attr("fill", "white")
                .attr("stroke", "none"); // No stroke to ensure the rectangle looks like a gap


            // Inside drawJoints function
            console.log(`Joint ${i} on line ${j}: x = ${startX + j * loopWidth}, y = ${yPosition}`);

        }
    }
}




// Listener for the 'size' input (already provided)

document.querySelector('#line-height').addEventListener('input', function(e) {
    
    if (currentShape === 'line') {
        drawLine();
        }
});

// Listener for the 'loop-number' input
document.querySelector('#loop-number').addEventListener('input', function(e) {
    console.log('Loop number changed');  
    if (currentShape === 'line') {
        drawLine();

    }
});



// Listener for the 'loop-width' input
document.querySelector('#loop-width').addEventListener('input', function(e) {
    console.log('Loop width changed');  
    if (currentShape === 'line') {
       drawLine();
        console.log('Loop Width:', loopWidth);
        updateInstructionWithSize(loopWidth); 
    }
});

// Listener for the 'joint-number' input
document.querySelector('#joint-number').addEventListener('input', function(e) {
    console.log('joint number changed');  
    if (currentShape === 'line') {
        drawLine();
    }
});

// Listener for the 'joint-width' input
document.querySelector('#joint-width').addEventListener('input', function(e) {
    console.log('joint width changed');  
     if (currentShape === 'line') {
        drawLine();
        console.log('Joint Width:', jointWidth);

    }
});

// If there are any other inputs that affect the line, add similar event listeners for them as well.

function getActiveDesign() {
    const activeDesign = document.querySelector('.design[style="display: block;"]');
    return activeDesign.id;
}


function handleDragStart(event) {
    const cell = event.target; // Get the cell that started the drag
    const row = cell.closest('tr');
    console.log('Drag Start on row:', row);

    document.querySelectorAll('#dataset-table tr:not(:first-child)').forEach(r => {
        if (r !== row) {
            r.classList.add('inactive-row');
            console.log('Adding inactive-row to:', r);
        }
    });

    row.classList.add('active-row');
    console.log('Adding active-row to:', row);
    cell.classList.add('highlighted-cell'); // Highlight the cell being dragged

    // Set the drag data
    event.dataTransfer.setData('text/plain', event.target.textContent);
    event.dataTransfer.setData('text/rowHeader', row.getAttribute('data-row-header'));
    event.dataTransfer.setData('text/columnHeader', event.target.getAttribute('data-column-header'));
}
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('mousedown', function(event) {
        if (input.classList.contains('data-input')) {
            // Ask for confirmation to override the data-driven value
            const isConfirmed = confirm('Do you want to override the data-driven value with your custom input?');
            
            if (!isConfirmed) {
                // Prevent the mousedown event if the user cancels
                event.preventDefault();
                return false;
            }
        }
    });
});




// Make sure the 'columnToInputMappings' object is defined globally

//Global Storage for Column-to-Input Mappings
let columnToInputMappings = {};



function handleDrop(event) {
    event.preventDefault();

    const newValue = event.dataTransfer.getData('text/plain');
    const columnHeader = event.dataTransfer.getData('text/columnHeader');
    const inputElement = event.target.closest('input');

    if (inputElement) {
        inputElement.value = newValue;
        inputElement.classList.add('data-input');

        // Check if the next sibling is a column indicator, if not create one
        let columnIndicator = inputElement.nextElementSibling;
        if (!columnIndicator || !columnIndicator.classList.contains('column-header-indicator')) {
            columnIndicator = document.createElement('span');
            columnIndicator.className = 'column-header-indicator';
            inputElement.parentNode.insertBefore(columnIndicator, inputElement.nextSibling);
        }
        
        columnIndicator.textContent = columnHeader;
        inputElement.style.width = `calc(100% - ${columnIndicator.offsetWidth}px)`;

        // Attach click listener to the column indicator
        attachHeaderClickListener(columnIndicator, inputElement);

        columnToInputMappings[columnHeader] = { id: inputElement.id, operation: null, factor: null };
        updateVisualization(inputElement.id, newValue, { columnName: columnHeader });
   
   
        console.log("Input value set to:", inputElement.value);

        // Call to update sliders
        updateSliderPosition();
        updateCountabilitySliderPosition();

        // Debugging after calling update functions
        console.log("Slider update functions called");
    }
}




// Call this function once to set up the click listeners for existing headers
document.querySelectorAll('.column-header-indicator').forEach(header => {
    const inputElement = header.previousElementSibling;
    attachHeaderClickListener(header, inputElement);
});


function handleDragEnd(event) {
    console.log("Drag End called");
    event.target.classList.remove('highlighted-cell'); // Remove highlight from the cell
   
}
attachDragEventListeners();


function attachDragEventListeners() {
    const cells = document.querySelectorAll('#dataset-table td');
    cells.forEach(cell => {
        cell.setAttribute('draggable', true);
        cell.addEventListener('dragstart', handleDragStart);
        cell.addEventListener('dragend', handleDragEnd);
    });
}



document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        console.log(`Input ${input.id} changed to ${input.value}`);

        input.classList.remove('data-input');
        input.classList.add('manual-input');
    });
});
    


// 2. Function to attach click listener to column header

function attachHeaderClickListener(headerElement, inputElement) {
    headerElement.addEventListener('click', function(event) {
        // Check if the clicked element is the factor input to prevent re-triggering the initial setup
        if (event.target.className !== 'factor-input') {
            performValueAdjustment(inputElement, headerElement.textContent);
        }
    });
}
function performValueAdjustment(inputElement, columnHeader) {
    console.log(`performValueAdjustment called for ${columnHeader}`);
    if (!columnToInputMappings[columnHeader]?.operation) {
        // Initial setup with a prompt
        const userInput = prompt(`Enter operation (multiply/divide) and factor for "${columnHeader}":`, 'multiply 2');
        if (userInput) {
            const [operation, factor] = userInput.split(' ');
            setupInitialOperation(inputElement, columnHeader, operation, parseFloat(factor));
        }
    } else {
        console.log(`Attempting to focus on .factor-input for ${columnHeader}`);
        const parent = inputElement.parentNode;
        console.log(`Parent node:`, parent);
        console.log(`Children of parent node:`, parent.children);
        const factorInput = parent.querySelector('.factor-input');
        if (factorInput) {
            console.log(`.factor-input found for ${columnHeader}, focusing now.`);
            factorInput.focus();
        } else {
            console.log(`.factor-input not found for ${columnHeader}, unable to focus.`);
        }
    }
}


function setupInitialOperation(inputElement, columnHeader, operation, factor) {
    // Store the initial value and operation details
    columnToInputMappings[columnHeader] = {
        id: inputElement.id,
        operation: operation,
        factor: factor,
        originalValue: parseFloat(inputElement.value)
  
    };

    // Calculate and update value
    const newValue = (operation === 'multiply') ? columnToInputMappings[columnHeader].originalValue * factor : columnToInputMappings[columnHeader].originalValue / factor;
    inputElement.value = newValue;

    // Update visualization
    updateVisualization(inputElement.id, newValue, { columnName: columnHeader });
    updateOperationText(inputElement, columnHeader, operation, factor);
    updateSliderPosition();  // Assuming this function updates a slider related to the operation
    updateCountabilitySliderPosition();  // Assuming this function updates another slider
}

function updateOperationText(inputElement, columnHeader, operation, factor) {
    console.log('updateOperationText called', { columnHeader, operation, factor });

    // Check if the column indicator already exists
    let columnIndicator = inputElement.nextElementSibling;
    console.log('Existing columnIndicator:', columnIndicator);

    if (!columnIndicator || !columnIndicator.classList.contains('column-header-indicator')) {
        console.log('Creating new columnIndicator');
        columnIndicator = document.createElement('div');
        columnIndicator.className = 'column-header-indicator';
        inputElement.parentNode.insertBefore(columnIndicator, inputElement.nextSibling);
    }

    // Check if the factor input already exists
    let factorInput = columnIndicator.querySelector('.factor-input');
    console.log('factorInput before update:', factorInput);

    if (!factorInput) {
        console.log('Creating new factorInput');
        factorInput = document.createElement('input');
        factorInput.className = 'factor-input';
        factorInput.type = 'text';
        factorInput.value = factor;
        factorInput.addEventListener('change', (event) => {
            console.log('Factor input changed:', event.target.value);
            const newFactor = parseFloat(event.target.value);
            if (!isNaN(newFactor)) {
                console.log('Updating operation with new factor:', newFactor);
                updateOperation(inputElement, columnHeader, operation, newFactor);
            } else {
                console.log('New factor is NaN. No update performed.');
            }
        });
        columnIndicator.appendChild(factorInput);
    } else {
        console.log('Updating existing factorInput value');
        factorInput.value = factor;
    }

    // Update operation text
    let operationText = columnIndicator.firstChild;
    if (!operationText || operationText.nodeType !== Node.TEXT_NODE) {
        console.log('Creating new operationText node');
        operationText = document.createTextNode('');
        columnIndicator.insertBefore(operationText, factorInput);
    }
    console.log('Updating operation text node value');
    operationText.nodeValue = `${columnHeader} ${operation === 'multiply' ? '*' : '/'}`;
}



function updateOperation(inputElement, columnHeader, operation, newFactor) {
    const originalValue = columnToInputMappings[columnHeader]?.originalValue || parseFloat(inputElement.value);
    const newValue = (operation === 'multiply') ? originalValue * newFactor : originalValue / newFactor;
    inputElement.value = newValue;
    columnToInputMappings[columnHeader] = { id: inputElement.id, operation, factor: newFactor, originalValue };
    updateVisualization(inputElement.id, newValue, { columnName: columnHeader });

    // Update the operation text to show the new factor
    const columnIndicator = inputElement.nextElementSibling;
    if (columnIndicator && columnIndicator.classList.contains('column-header-indicator')) {
        columnIndicator.textContent = `${columnHeader} ${operation === 'multiply' ? '*' : '/'}${newFactor}`;
    }
}



    
function updateVisualization(inputId, newValue, meta = {}) {
    switch(inputId) {
        case 'poly-sides':
            polygonSides = +newValue;
            break;
        case 'size':
            minSize = +newValue;
            break;
        case 'loop-number':
            loops = +newValue;
            break;
        case 'loop-width':
            loopWidth = +newValue;
            break;
        case 'joint-number':
            joints = +newValue;
            break;
        case 'joint-width':
            jointRadius = +newValue / 2;
            break;
                case 'ellipse-width':
            // Update ellipse width
            // Assuming you have a global variable or a setter method for ellipse width
            ellipseWidth = +newValue;
            if (currentShape === 'ellipse') {
                drawEllipse();
            }
            break;

        case 'ellipse-height':
            // Update ellipse height
            // Assuming you have a global variable or a setter method for ellipse height
            ellipseHeight = +newValue;
            if (currentShape === 'ellipse') {
                drawEllipse();
            }
            break;

            case 'ellipse-width':
                // Update ellipse width
                // Assuming you have a global variable or a setter method for ellipse width
                ellipseWidth = +newValue;
                if (currentShape === 'ellipse') {
                    drawEllipse();
                }
                break;
    
            case 'ellipse-height':
                // Update ellipse height
                // Assuming you have a global variable or a setter method for ellipse height
                ellipseHeight = +newValue;
                if (currentShape === 'ellipse') {
                    drawEllipse();
                }
                break;
                case 'line-height':
                    // Update line height
                    // Assuming you have a global variable or a setter method for line height
                    lineHeight = +newValue;
                    if (currentShape === 'line') {
                        drawLine();
                    }
                    break;
        case 'radius':
            // Assuming drawCircle uses the radius directly from the input field
            drawCircle();
            break;
        default:
            console.error(`Unhandled input id: ${inputId}`);
            return;  // Exit the function if the inputId is not handled
    }
    drawVisualization();  // Redraw the visualization with the new values
    updateLegend(inputId, `${meta.rowName}'s ${meta.columnName}: ${newValue}`, true); // Update the legend
}

    
    

    function handleDragOver(e) {
        e.preventDefault();
    }


    
    // function handleHeaderClick(header, index, data, headers) {
    //     let divisor = prompt(`Enter the divisor for the column '${header}':`, 1);
    //     divisor = parseFloat(divisor);
    //     if (!isNaN(divisor) && divisor !== 0) {
    //         let newHeader = `${header} / ${divisor}`;
    //         if (!headers.includes(newHeader)) {
    //             headers.push(newHeader); // Adding new header
    //             data.forEach(row => {
    //                 row[newHeader] = (parseFloat(row[header]) / divisor).toFixed(2);
    //             });
    //         } else {
    //             data.forEach(row => {
    //                 row[newHeader] = (parseFloat(row[header]) / divisor).toFixed(2);
    //             });
    //         }
    //         drawTable(data); // Redrawing the table with the updated data
    //     } else {
    //         alert("Invalid divisor entered.");
    //     }
    // }
    
    function updateHeadersAndRedrawTable(newHeaders, newData) {
        // Assuming you have a global headers variable
        globalHeaders = newHeaders;
    
        // Redraw the table with new headers and data
        drawTable(newData);
    }

    var headers = [];
    
    function drawTable(data) {
        const table = document.querySelector('#dataset-table');
        table.innerHTML = ""; // Clear existing table content
    
        let headers = Object.keys(data[0]);
        let headerRow = document.createElement('tr');
        headers.forEach((header, index) => {
            let th = document.createElement('th');
            th.textContent = header;
            if (index !== 0) { // Assuming first column is not for division
                th.addEventListener('click', () => handleHeaderClick(header, index, data, headers));
            }
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    
        // Create rows with data
        data.forEach((rowData, rowIndex) => {
            let row = document.createElement('tr');
    
            headers.forEach((header, cellIndex) => {
                let cell;
                if (cellIndex === 0) {
                    cell = document.createElement('th'); // Using 'th' for the first cell as a row header
                    cell.textContent = rowData[header]; // Populate row header with data
                    cell.addEventListener('click', () => {
                        console.log(`Row header ${rowData[header]} clicked`);
                    });
                } else {
                    cell = document.createElement('td'); // Regular cells
                    cell.setAttribute('data-column-header', header); // Ensure this is correctly set
                    cell.setAttribute('draggable', true);
                    cell.addEventListener('dragstart', handleDragStart);
                    cell.addEventListener('dragend', handleDragEnd);
                }
                cell.textContent = rowData[header];
                row.appendChild(cell);
            });
    
            table.appendChild(row);
        });
        attachRowHeaderClickListeners();

    }
    
//     function changeColumnDivision(header, newDivisor, data) {
//         // Calculate new values and update the data
//         const newHeader = header + ' / ' + newDivisor;
//         data.forEach(row => {
//             if (row[header] !== undefined) {
//                 row[newHeader] = (parseFloat(row[header]) / newDivisor).toFixed(2);
//             }
//         });
    
//         // Remove the old divided column if it exists
//         headers = headers.filter(h => !h.startsWith(header + ' / ') || h === newHeader);
    
//         // Redraw the table with the updated data
//         drawTable(data);
//     }

// // Assuming currentData is your global variable holding the current dataset

// function deleteColumn(headerToDelete, index, data) {
//     // Remove the column from headers
//     headers.splice(index, 1);

//     // Update each row in the currentData
//     data.forEach(row => {
//         delete row[headerToDelete];
//     });

//     // Redraw the table with the updated data
//     drawTable(data);
// }

    
    function attachDragEventListeners() {
        const draggableItems = document.querySelectorAll('#dataset-table td');
        draggableItems.forEach(td => {
            td.setAttribute('draggable', 'true');
            td.addEventListener('dragstart', handleDragStart);
        });
    }
    

    function openDesign(designName) {
        // Get all elements with class="design" and hide them
        var i, designContent;
        designContent = document.getElementsByClassName("design");
        for (i = 0; i < designContent.length; i++) {
            designContent[i].style.display = "none";
        }
        // Show the current tab
        document.getElementById(designName).style.display = "block";
    
        // Ensure that the SVG is being drawn for the active design
        drawVisualization();
        centerVisualization();
    }
    

document.querySelector('#shape-selector').addEventListener('change', function(e) {
    clearLegend();  // Clear the legend
    console.log("Shape changed to:", e.target.value); 
    currentShape = e.target.value;
    
    // References to the containers
    const polygonContainer = document.getElementById('polygon-container');
    const circleContainer = document.getElementById('circle-container');
    const ellipseContainer = document.getElementById('ellipse-container');
    const lineContainer = document.getElementById('line-container');

    // Hide all shape-specific containers first
    polygonContainer.style.display = 'none';
    circleContainer.style.display = 'none';
    ellipseContainer.style.display = 'none';
    lineContainer.style.display = 'none';
    // Display the container corresponding to the selected shape
    switch (currentShape) {
        case 'polygon':
            polygonContainer.style.display = 'block';
            break;
        case 'circle':
            circleContainer.style.display = 'block';
            break;
        case 'ellipse':
            ellipseContainer.style.display = 'block';
            break;
        case 'line':
            lineContainer.style.display = 'block';
            break;
        default:
            console.error(`Unhandled shape type: ${currentShape}`);
            break;
    }

    // Clear the SVG content and draw the new shape
    g.selectAll('*').remove();
    drawShape(currentShape);
});

    
    

document.querySelector('#datasets').addEventListener('change', function(e) {
    if (e.target.value !== "default") {
        // Reference the files from the root of the dist directory
        const filePath = `${e.target.value}.json`; // No '../' needed
        console.log("Attempting to load:", filePath);

        d3.json(filePath).then(data => {
            // Your logic to handle the loaded data
            drawTable(data);
        }).catch(error => {
            console.error("Failed to load the dataset:", error);
            // Handle error, maybe show a message to the user
        });
    } else {
        // Handle the "Manual Input" case
        document.querySelector('#dataset-table').style.display = "none"; // Hide table for manual input
    }
});




    
    const inputFields = document.querySelectorAll('.controls input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('dragover', handleDragOver);
        input.addEventListener('drop', handleDrop);
    });


    function drawVisualization() {
        
        g.selectAll('*').remove();
        console.log("Drawing visualization for:", currentShape);


        if (currentShape === 'polygon') {
            for (let i = 0; i < loops; i++) {
                drawPolygon(polygonSides, minSize + (loopWidth * i), (i % 2) * (1 / (2 * joints)));
            }
        } else if (currentShape === 'circle') {
            drawCircle();
        } 

        if (currentShape === 'ellipse') {
            drawEllipse(); // Assuming you have a function like this
        } else if (currentShape === 'line') {
            drawLine(); // Assuming you have a function like this
        }
        
        updateInstructionWithSize();
    }

    //new
    

   
    //Calculate the Bounding Box of the SVG Content

    function computeSVGBoundsInCM() {
        const content = d3.select('svg').node();
        const bbox = content.getBBox();
        console.log("Bounding Box in Pixels:", bbox);  // Log the pixel dimensions
    
        const cmDimensions = {
            width: bbox.width / pixelsPerCm,
            height: bbox.height / pixelsPerCm
        };
        
        console.log("Bounding Box in CM:", cmDimensions);  // Log the CM dimensions
    
        return cmDimensions;
    }


    function updateInstructionWithSize() {
       
        console.log("Function updateInstructionWithSize called");
        
        const bbox = g.node().getBBox();
        
        // Log the bounding box details to console
        console.log("Bounding Box:", bbox);
    
        const widthInCm = (bbox.width / pixelsPerCm).toFixed(2);
        const heightInCm = (bbox.height / pixelsPerCm).toFixed(2);
            // Determine the maximum dimension
        const maxSize = Math.max(widthInCm, heightInCm);

    // Update the size indicator slider
    updateSizeIndicator(maxSize);

        let sizeInfo = `Size: Width: ${widthInCm} cm, Height: ${heightInCm} cm`;
        console.log("Size Info:", sizeInfo);
    
        // Set the primary size information
        instructionParagraph.textContent = sizeInfo;  // Add this line
    
        const instructionBox = instructionParagraph.parentElement;

        
        instructionBox.querySelectorAll('.warning').forEach(warning => warning.remove());

   // Zoom out warning
   if (widthInCm > 50 || heightInCm > 30) {
    addWarning(instructionBox, "Zoom out to see the whole pattern. To adjust pattern size, consider remapping by dividing the values in variable section!");
}

// Narrow loop warning
if (loopWidth < 10) {
    addWarning(instructionBox, "The loops are too narrow and they may burn in laser cutting. Consider increasing their size.");
}

// Wide joint warning
if (jointWidth > 20) {
    addWarning(instructionBox, "The joints are too wide and leave minimal space for expansion.");
}




// Too many joints warning
if (joints > 20 && jointWidth > 10) {
    addWarning(instructionBox, "There are too many joints and they leave minimal cut area.");
}

    

    
    function updateSizeIndicator(maxSize) {
            const slider = document.getElementById('sizeIndicatorRange');
            const label = document.getElementById('sizeIndicatorValue'); // Ensure this is the correct ID for the label
        
            if (slider) {
                const sliderMax = parseFloat(slider.getAttribute('max'));
                const value = (maxSize / sliderMax) * 100; // Normalize the value to the slider's range
                slider.value = value;
        
                // Round the value to the nearest integer
                const roundedValue = Math.round(value);
        
                // Update the label with the rounded value
                label.textContent = roundedValue;
            } else {
                console.error('Size indicator slider not found');
            }
            
            
            updateWarnings();
    }
        
  


        function updateWarnings() {
            const instructionBox = document.querySelector('.instruction-box'); // Replace with your actual selector
        
            // Clear existing warnings
            instructionBox.querySelectorAll('.warning').forEach(warning => warning.remove());
        
            // Add warnings based on current input values
            if (loopWidth < 10) {
                console.log("Adding narrow loop warning"); // Log when this condition is met

                addWarning(instructionBox, "The loops are too narrow and they may burn in laser cutting. Consider increasing their size.");
            }
        
        
            if (jointWidth > 20) {
                addWarning(instructionBox, "The joints are too wide and leave minimal space for expansion.");
            }
        
            if (joints > 30) {
                addWarning(instructionBox, "There are too many joints and they leave minimal cut area.");
            }
        
        }


    // Draw the bounding box (red rectangle) around the g group's content
        g.append('rect')
           .attr('x', bbox.x)
           .attr('y', bbox.y)
           .attr('width', bbox.width)
           .attr('height', bbox.height)
           .attr('stroke', 'none')
           .attr('stroke-width', '3')  // make it a bit thicker for visibility
           .attr('fill', 'none');
    }
    
    function addWarning(parentElement, warningText) {
        // Use the warning text as a unique identifier
        const warningId = warningText.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
        // Check if the warning already exists
        let warningElement = parentElement.querySelector(`[data-warning="${warningId}"]`);
    
        if (!warningElement) {
            warningElement = document.createElement("span");
            warningElement.textContent = warningText;
            warningElement.style.color = "red";
            warningElement.setAttribute('data-warning', warningId);
            warningElement.classList.add("warning");
    
            parentElement.appendChild(warningElement);
        }
    }
    


    
    // function triggerChangeEvent(elementId) {
    //     let event = new Event('change', {
    //         'bubbles': true,
    //         'cancelable': true
    //     });
    //     document.getElementById(elementId).dispatchEvent(event);
    // }

    

    // function remapSize() {
    //     console.log("Inside remap function");
    
    //     // Fetch user's desired width
    //     const desiredWidth = parseFloat(document.getElementById('desiredWidth').value);
    //     console.log("Desired Width:", desiredWidth);

    //     // Compute the current pattern width in CM
    //     const currentSize = computeSVGBoundsInCM();
    //     console.log("Current Size:", currentSize);

    //     const currentWidth = currentSize.width;
    //     console.log("Current Width:", currentWidth);

    //     // If current width is more than desired width, we need to remap
    //     if (currentWidth > desiredWidth) {
    //         const scalingFactor = desiredWidth / currentWidth;
    
    //         // Adjust parameters based on scaling factor
    //         // Adjusting loop width
    //         const loopWidthInput = document.getElementById('loop-width');
    //         const newLoopWidth = parseFloat(loopWidthInput.value) * scalingFactor;
    //         loopWidthInput.value = newLoopWidth.toFixed(2);  // Limiting to 2 decimal places for cleanliness
    //         triggerChangeEvent('loop-width');
    
    //         // Adjusting number of loops
    //         const loopNumberInput = document.getElementById('loop-number');
    //         const newLoopNumber = Math.max(1, Math.round(parseFloat(loopNumberInput.value) * scalingFactor));
    //         loopNumberInput.value = newLoopNumber;
    //         triggerChangeEvent('loop-number');
    
    //         // Adjusting Min Size (for polygons)
    //         const sizeInput = document.getElementById('size');
    //         const newSize = parseFloat(sizeInput.value) * scalingFactor;
    //         sizeInput.value = newSize.toFixed(2);
    //         triggerChangeEvent('size');
    
    //         // Redraw based on the current shape after updating values
    //         switch (currentShape) {
    //             case 'polygon':
    //                 drawPolygon(/* appropriate parameters */);
    //                 break;
    //             case 'circle':
    //                 drawCircle();
    //                 break;
    //             case 'ellipse':
    //                 drawEllipse();
    //                 break;
    //         }
    //          // Force redraw of the SVG element
              
    //     }
    // } // Closing bracket for remapSize
    

//Hover for Row Headers
    function addRowHeaderTooltips() {
        const rowHeaders = document.querySelectorAll('#dataset-table tr:not(:first-child) th:first-child');
        rowHeaders.forEach(header => {
            header.title = 'Hover to see options'; // Default tooltip message
            header.addEventListener('mouseenter', function() {
                const rowHeader = header.textContent; // e.g., 'Week 1'
                header.title = `Apply same mapping to ${rowHeader}`; // Update tooltip message
            });
        });
    }
    addRowHeaderTooltips();


    function getRowData(rowElement) {
        const rowData = {};
        const headers = document.querySelectorAll('#dataset-table th');
        rowElement.querySelectorAll('td').forEach((cell, index) => {
            // If the first column is not a data column (e.g., row header), adjust the index
            const columnHeader = headers[index + 1].textContent; // +1 if the first column is not a data column
            rowData[columnHeader] = cell.textContent;
        });
        return rowData;
    }
    
    
    
    
    function applySameMapping(newHeader) {
        console.log("Applying mapping to new header: ", newHeader.textContent);

        if (lastMappedColumnIndex !== null) {
            const cells = newHeader.parentElement.querySelectorAll('td');
            if (cells[lastMappedColumnIndex]) {
                const valueToMap = cells[lastMappedColumnIndex].textContent;
                const inputId = resolveInputIdFromIndex(lastMappedColumnIndex);
                if (inputId) {
                    updateInputAndVisualization(inputId, valueToMap);
                }
            }
        }
    }

    function handleRowHeaderClick(header) {
        // Highlight the clicked row and unhighlight others
        const allRows = document.querySelectorAll('#dataset-table tr:not(:first-child)');
        allRows.forEach(row => {
            row.classList.remove('active-row');
            row.classList.add('inactive-row');
        });
    
        const clickedRow = header.parentElement;
        clickedRow.classList.add('active-row');
        clickedRow.classList.remove('inactive-row');
        
        // Get the data from the clicked row
        const rowData = getRowData(clickedRow);
        Object.entries(rowData).forEach(([columnHeader, value]) => {
            const mappingInfo = columnToInputMappings[columnHeader];
            if (mappingInfo) {
                const inputElement = document.getElementById(mappingInfo.id || mappingInfo);
                if (inputElement) {
                    let finalValue = parseFloat(value);
        
                    // Check and apply stored operation if any
                    if (mappingInfo.operation) {
                        const opType = mappingInfo.operation;
                        const factor = mappingInfo.factor;
                        finalValue = (opType === 'multiply') ? finalValue * factor : finalValue / factor;
                    }
        
                    inputElement.value = finalValue;
        
                    // Update the visualization
                    updateVisualization(inputElement.id, finalValue, { rowName: header.textContent, columnName: columnHeader });
                    // Call to update sliders
                    updateSliderPosition();
                    updateCountabilitySliderPosition();
                }
            }
        });
    }
    
    
    
    function applyOperation(value, operation, factor) {
        if (operation === 'multiply') {
            return value * factor;
        } else if (operation === 'divide') {
            return value / factor;
        }
        return value;
    }
    

    


    function updateInputAndVisualization(inputId, value) {
        console.log(`Updating input ${inputId} with value: ${value}`);
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.value = value;
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
        }
    }
    
    function attachRowHeaderClickListeners() {
        const rowHeaders = document.querySelectorAll('#dataset-table tr th:first-child');
        if(rowHeaders.length === 0) {
            console.log("No row headers found to attach listeners to.");
            return;
        }
    
        rowHeaders.forEach(header => {
            header.addEventListener('click', () => {
                console.log(`Row header clicked: ${header.textContent}`);
                // Code to handle the row header click
                handleRowHeaderClick(header);
            });
        });
    }
    
    
    
    // Call this function again if the table is redrawn
    attachRowHeaderClickListeners();
    

    


//Flimsy and stiffness
function calculateExpandability() {
    // Define the weights for each parameter
    const weightSize = 1; // Positive impact
    const weightNumLoops = 2; // Positive impact
    const weightWidthLoops = -.5; // Negative impact
    const weightNumJoints = -1; // Negative impact
    const weightWidthJoints = -1; // Negative impact

    // Get the parameter values
    let size = parseFloat(document.querySelector('#size').value || document.querySelector('#radius').value);
    let numLoops = parseFloat(document.querySelector('#loop-number').value);
    let widthLoops = parseFloat(document.querySelector('#loop-width').value);
    let numJoints = parseFloat(document.querySelector('#joint-number').value);
    let widthJoints = parseFloat(document.querySelector('#joint-width').value);

    // Calculate the impacts
    let impactSize = size * weightSize;
    let impactNumLoops = numLoops * weightNumLoops;
    let impactWidthLoops = widthLoops * weightWidthLoops;
    let impactNumJoints = numJoints * weightNumJoints;
    let impactWidthJoints = widthJoints * weightWidthJoints;

    // Calculate the total score
    let score = impactSize + impactNumLoops + impactWidthLoops + impactNumJoints + impactWidthJoints;

    // Normalize the score between 0 and 100
    let expandability = Math.max(0, Math.min(score, 100));

    // Debugging logs
    console.log("Expandability score:", expandability);

    return expandability;
}



function clampValue(value) {
    return Math.max(0, Math.min(value, 100));
}


function updateSliderPosition() {
    let expandabilityScore = calculateExpandability();
    expandabilityScore = clampValue(expandabilityScore);

    let slider = document.getElementById('stiffnessFlimsinessRange');
    let label = document.getElementById('stiffnessFlimsinessValue');

    // Check if the slider is at the minimum and the new score is higher
    if (slider.value == slider.min && expandabilityScore > slider.min) {
        slider.value = expandabilityScore;
        label.textContent = expandabilityScore;
    } else if (slider.value != slider.min) {
        slider.value = expandabilityScore;
        label.textContent = expandabilityScore;
    }

    // Keep the slider disabled to prevent manual adjustments
    slider.disabled = true;
}


// Call this function on input changes and on window load
document.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('input', function() {
        updateSliderPosition();
    });
});

// Ensure updateSliderPosition is called on window load
window.onload = updateSliderPosition;

function calculateCountability() {
    // Example max values, adjust as needed
    const maxNumJoints = 40;
    const maxNumLoops = 50;
    const maxWidthJoints = 20;
    const maxWidthLoops = 50;

    // Fetch and normalize values
    let numJointsNormalized = 1 - parseFloat(document.querySelector('#joint-number').value) / maxNumJoints;
    let numLoopsNormalized = 1 - parseFloat(document.querySelector('#loop-number').value) / maxNumLoops;
    let widthJointsNormalized = parseFloat(document.querySelector('#joint-width').value) / maxWidthJoints;
    let widthLoopsNormalized = parseFloat(document.querySelector('#loop-width').value) / maxWidthLoops;

    // Calculate countability score
    let countabilityScore = (numJointsNormalized + numLoopsNormalized + widthJointsNormalized + widthLoopsNormalized) / 4 * 100;

    return countabilityScore;
}




function updateCountabilitySliderPosition() {
    let countabilityScore = calculateCountability();
    countabilityScore = clampValue(countabilityScore);

    let slider = document.getElementById('countabilityRange');
    let label = document.getElementById('countabilityValue');

    slider.value = countabilityScore;
    label.textContent = getCountabilityDescription(countabilityScore);

    // Disable the slider
    slider.disabled = true;

    // Remove any existing event listeners by replacing the slider with its clone
    let newSlider = slider.cloneNode(true);
    slider.parentNode.replaceChild(newSlider, slider);
}




// Update the label for stiffness-flimsiness slider
// Event listener for the stiffness-flimsiness slider
// document.getElementById('stiffnessFlimsinessRange').addEventListener('input', function() {
//     document.getElementById('stiffnessFlimsinessValue').textContent = this.value;
// });

// If you have more sliders, repeat the pattern:
// Event listener for the size indicator slider (if it's not disabled)
document.getElementById('sizeIndicatorRange').addEventListener('input', function() {
    document.getElementById('sizeIndicatorValue').textContent = this.value; // Make sure 'sizeIndicatorValue' is the correct ID for the span
});

// Event listener for the countability slider
// document.getElementById('countabilityRange').addEventListener('input', function() {
//     document.getElementById('countabilityValue').textContent = this.value;
// });

// Ensure this JavaScript runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the value labels
    document.getElementById('stiffnessFlimsinessValue').textContent = document.getElementById('stiffnessFlimsinessRange').value;
    // Repeat for other sliders
    document.getElementById('countabilityValue').textContent = document.getElementById('countabilityRange').value;
});


function getExpandabilityDescription(value) {
    if (value <= 10) return "Very Low";
    if (value <= 30) return "Low";
    if (value <= 60) return "Moderate";
    if (value <= 80) return "High";
    return "Very High";
}

function getCountabilityDescription(value) {
    if (value <= 20) return "Very Challenging";
    if (value <= 40) return "Challenging";
    if (value <= 60) return "Moderate";
    if (value <= 80) return "Easy";
    return "Very Easy";
}


// function getSizeDescription(value) {
//     if (value <= 10) return "Very Small";
//     if (value <= 30) return "Small";
//     if (value <= 60) return "Medium";
//     if (value <= 80) return "Large";
//     return "Very Large";
// }



// Call this function on input changes and on window load
document.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('input', function() {
        updateCountabilitySliderPosition();
    });
});

// Attach event listeners to the input fields and call update functions on window load
window.onload = function() {
        // Initialize the stiffness-flimsiness slider value label
        let stiffnessSlider = document.getElementById('stiffnessFlimsinessRange');
        document.getElementById('stiffnessFlimsinessValue').textContent = stiffnessSlider.value;
    
        // Initialize the countability slider value label
        let countabilitySlider = document.getElementById('countabilityRange');
        document.getElementById('countabilityValue').textContent = countabilitySlider.value;
    
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('input', function() {
            updateSliderPosition();
            updateCountabilitySliderPosition();
        });
    });
    updateSliderPosition();
    updateCountabilitySliderPosition();
};


function resolveInputIdFromIndex(index) {
    console.log(`Resolving input ID for index: ${index}`);
    // Array mapping the cell index to the input field IDs
    const idMapping = ['size', 'poly-sides', 'radius', 'arc-extent', 'arc-orientation', 'ellipse-width', 'ellipse-height', 'line-height', 'loop-number', 'loop-width', 'joint-number', 'joint-width'];
    return idMapping[index];
}




// Function to update visualization based on the row data
function updateVisualizationFromRow(rowData) {
    console.log(`Updating visualization: ${inputId} with value: ${newValue}`);
    Object.entries(rowData).forEach(([inputId, value]) => {
        console.log(`Updating inputId: ${inputId} with value: ${value}`);
        const inputElement = document.getElementById(inputId);
        if (inputElement && !inputElement.classList.contains('manual-input')) {
            inputElement.value = value;
            console.log(`Input ${inputId} updated to ${value}`);
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
        } else {
            console.log(`Input ${inputId} is manually entered or not found`);
        }
    });
}


//edit vak
// Call this function after generating/updating the table
attachRowHeaderClickListeners();

    
function downloadSVG(svgElement, filename) {
    // 1. Serialize SVG to string
    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgElement);

    // 2. Encode SVG string
    var encodedData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

    // 3. Create download link
    var link = document.createElement('a');
    link.setAttribute('href', encodedData);
    link.setAttribute('download', filename);

    // 4. Trigger download
    document.body.appendChild(link);  
    link.click();
    
    // 5. Clean up
    document.body.removeChild(link);
}


document.getElementById('downloadButton').addEventListener('click', function() {
    var svgElement = document.querySelector('.design svg');  // Adjust selector as needed
    downloadSVG(svgElement, 'downloaded_pattern.svg');
});

document.querySelector('#poly-sides').addEventListener('input', function(e) {
    const sides = +e.target.value;
    if (sides < 3) {
        displayError("Polygon must have at least 3 sides.");
    } else {
        clearError(); // Clear any existing error message
        polygonSides = sides;
        drawVisualization();
    }
});

    document.querySelector('#size').addEventListener('input', function(e) {
        const size = +e.target.value;
        if (size >= 2 && size <= 100000) {
            minSize = size;
            drawVisualization();
        }
    });

    document.querySelector('#loop-number').addEventListener('input', function(e) {
        const num = +e.target.value;
        if (num >= 0 && num < 1000) {
            loops = num;
            drawVisualization();
        }
    });

    document.querySelector('#loop-width').addEventListener('input', function(e) {
        const width = +e.target.value;
        if (width > 1 && width < 200) {
            loopWidth = width;
            drawVisualization();
            updateInstructionWithSize(loopWidth); 
        }
    });

    document.querySelector('#joint-number').addEventListener('input', function(e) {
        const num = +e.target.value;
        if (num >= 0 && num < 100) {
            joints = num;
            drawVisualization();
        }
    });

    document.querySelector('#joint-width').addEventListener('input', function(e) {
        const width = +e.target.value;
        if (width > 1 && width <= 50) {
            jointWidth = width;
            drawVisualization(); // Assuming this function uses jointWidth
            updateInstructionWithSize(jointWidth); // Call with the updated jointWidth
        } else if (width > 50) {
            // Show the warning for too wide joints
            const instructionBox = document.getElementById('instruction-box'); // Replace with your actual element ID
            const wideJointWarningText = "The joints are too wide and leave minimal space for expansion.";
            addWarning(instructionBox, wideJointWarningText);
        }
    });
    




    window.addEventListener('resize', function() {
        centerVisualization();
        drawVisualization();

    

        
    });
    // window.remapSize = remapSize;
  // Call this function after your table headers are generated/updated
  initializeTooltips();

});
