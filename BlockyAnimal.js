// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main(){
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        }
    `
// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`

//Global var
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
}

function connectVariablesToGLSL(){
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // u_Size = gl.getUniformLocation(gl.program, "u_Size");
    // if(!u_Size){
    //     console.log("Failed to get the storage location of u_Size");
    //     return;
    // }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log("Failed to get storage location of u_ModelMatrix");
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log("Failed to get storage location of u_GlobalRotateMatrix");
        return;
    }
}
//Constant
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Global related UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0]
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;

let g_yellowAnimation = false;
let g_magentaAnimation = false;

let g_frontLeftAngle = 0;
let g_frontLeftAnimation = false;

let g_frontLeft2Angle = 0;
let g_frontLeft2Animation = false;

let g_backLeftAngle = 0;
let g_backLeftAnimation = false;

let g_backLeft2Angle = 0;
let g_backLeft2Animation = false;

let g_frontRightAngle = 0;
let g_frontRightAnimation = false;

let g_frontRight2Angle = 0;
let g_frontRight2Animation = false;

let g_backRightAngle = 0;
let g_backRightAnimation = false;

let g_backRight2Angle = 0;
let g_backRight2Animation = false;

let g_tail1Angle = 0;
let g_tail1Animation = false;

let g_tail2Angle = 0;
let g_tail2Animation = false;

let g_tail3Angle = 0;
let g_tail3Animation = false;

let g_allAnimation = false;

let g_mouth = 0;
let g_jaw = 0;
let g_body = 0;
let g_alternate = false;

function addActionsForHtmlUI(){


    // document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false};
    // document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true};

    // document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false};
    // document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true};

    // document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
    // document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

    document.getElementById('frontLeftSlide').addEventListener('mousemove', function() { g_frontLeftAngle = this.value; renderAllShapes(); });

    document.getElementById('animationFrontLeftOffButton').onclick = function() {g_frontLeftAnimation = false};
    document.getElementById('animationFrontLeftOnButton').onclick = function() {g_frontLeftAnimation = true};

    document.getElementById('frontLeft2Slide').addEventListener('mousemove', function() { g_frontLeft2Angle = this.value; renderAllShapes(); });

    document.getElementById('animationFrontLeft2OffButton').onclick = function() {g_frontLeft2Animation = false};
    document.getElementById('animationFrontLeft2OnButton').onclick = function() {g_frontLeft2Animation = true};



    document.getElementById('backLeftSlide').addEventListener('mousemove', function() { g_backLeftAngle = this.value; renderAllShapes(); });

    document.getElementById('animationBackLeftOffButton').onclick = function() {g_backLeftAnimation = false};
    document.getElementById('animationBackLeftOnButton').onclick = function() {g_backLeftAnimation = true};

    document.getElementById('backLeft2Slide').addEventListener('mousemove', function() { g_backLeft2Angle = this.value; renderAllShapes(); });

    document.getElementById('animationBackLeft2OffButton').onclick = function() {g_backLeft2Animation = false};
    document.getElementById('animationBackLeft2OnButton').onclick = function() {g_backLeft2Animation = true};



    document.getElementById('frontRightSlide').addEventListener('mousemove', function() { g_frontRightAngle = this.value; renderAllShapes(); });

    document.getElementById('animationFrontRightOffButton').onclick = function() {g_frontRightAnimation = false};
    document.getElementById('animationFrontRightOnButton').onclick = function() {g_frontRightAnimation = true};

    document.getElementById('frontRight2Slide').addEventListener('mousemove', function() { g_frontRight2Angle = this.value; renderAllShapes(); });

    document.getElementById('animationFrontRight2OffButton').onclick = function() {g_frontRight2Animation = false};
    document.getElementById('animationFrontRight2OnButton').onclick = function() {g_frontRight2Animation = true};


    document.getElementById('backRightSlide').addEventListener('mousemove', function() { g_backRightAngle = this.value; renderAllShapes(); });

    document.getElementById('animationBackRightOffButton').onclick = function() {g_backRightAnimation = false};
    document.getElementById('animationBackRightOnButton').onclick = function() {g_backRightAnimation = true};

    document.getElementById('backRight2Slide').addEventListener('mousemove', function() { g_backRight2Angle = this.value; renderAllShapes(); });

    document.getElementById('animationBackRight2OffButton').onclick = function() {g_backRight2Animation = false};
    document.getElementById('animationBackRight2OnButton').onclick = function() {g_backRight2Animation = true};

    document.getElementById('tail1Slide').addEventListener('mousemove', function() { g_tail1Angle = this.value; renderAllShapes(); });

    document.getElementById('animationTail1OffButton').onclick = function() {g_tail1Animation = false};
    document.getElementById('animationTail1OnButton').onclick = function() {g_tail1Animation = true};

    document.getElementById('tail2Slide').addEventListener('mousemove', function() { g_tail2Angle = this.value; renderAllShapes(); });

    document.getElementById('animationTail2OffButton').onclick = function() {g_tail2Animation = false};
    document.getElementById('animationTail2OnButton').onclick = function() {g_tail2Animation = true};

    document.getElementById('tail3Slide').addEventListener('mousemove', function() { g_tail3Angle = this.value; renderAllShapes(); });

    document.getElementById('animationTail3OffButton').onclick = function() {g_tail3Animation = false};
    document.getElementById('animationTail3OnButton').onclick = function() {g_tail3Animation = true};

    document.getElementById('animationAllToggleButton').onclick = function () {
        g_allAnimation = !g_allAnimation;

        g_frontLeftAnimation  = g_allAnimation;
        g_frontLeft2Animation = g_allAnimation;

        g_backLeftAnimation   = g_allAnimation;
        g_backLeft2Animation  = g_allAnimation;

        g_frontRightAnimation  = g_allAnimation;
        g_frontRight2Animation = g_allAnimation;

        g_backRightAnimation   = g_allAnimation;
        g_backRight2Animation  = g_allAnimation;

        g_tail1Animation = g_allAnimation;
        g_tail2Animation = g_allAnimation;
        g_tail3Animation = g_allAnimation;

        // Update button text (optional but nice)
        this.innerHTML = `${g_allAnimation ? "ON" : "OFF"}`;
    };

}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

   gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//   // Register function (event handler) to be called on a mouse press
//   canvas.onmousedown = click;

//   canvas.onmousemove = function(ev) {if (ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  canvas.addEventListener("mouseup", function (ev) {
    if (ev.shiftKey) {
        g_alternate = true;
    }
    });



  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){

    g_seconds = performance.now() / 1000.0 - g_startTime;
    updateAnimationAngles();

    renderAllShapes();

    requestAnimationFrame(tick);
}

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function updateAnimationAngles() {


    if (g_frontLeftAnimation) {
        g_frontLeftAngle = (45*Math.sin(3 * g_seconds));
    }
    if (g_frontLeft2Animation) {
        g_frontLeft2Angle = (45*Math.sin(3 * g_seconds));
    }
    if (g_backLeftAnimation) {
        g_backLeftAngle = (45*Math.cos(3 * g_seconds));
    }
    if (g_backLeft2Animation) {
        g_backLeft2Angle = (45*Math.cos(3 * g_seconds));
    }
    if (g_frontRightAnimation) {
        g_frontRightAngle = (45*Math.cos(3 * g_seconds));
    }
    if (g_frontRight2Animation) {
        g_frontRight2Angle = (45*Math.cos(3 * g_seconds));
    }
    if (g_backRightAnimation) {
        g_backRightAngle = (45*Math.sin(3 * g_seconds));
    }
    if (g_backRight2Animation) {
        g_backRight2Angle = (45*Math.sin(3 * g_seconds));
    }
    if (g_tail1Animation) {
        g_tail1Angle = (45*Math.sin(3 * g_seconds));
    }
    if (g_tail2Animation) {
        g_tail2Angle = (45*Math.sin(3 * g_seconds));
    }
    if (g_tail3Animation) {
        g_tail3Angle = (45*Math.sin(3 * g_seconds));
    }
    if (g_alternate) {
        g_body = g_seconds * 30;
    }
}


function renderAllShapes(){

    var startTime = performance.now()

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);


    //draw cube
    var body = new Cube();
    body.color = [0,1,0,1];
    body.matrix.translate(-0.25, -0.25, -0.3);
    body.matrix.rotate(-5,1,0,0);
    body.matrix.rotate(g_body, 0, 1, 0);
    body.matrix.scale(0.5, 0.3, .75)
    var bodyCoordinates = new Matrix4(body.matrix);
    body.render();

    //draw head
    var head = new Cube();
    head.color = [0,1,0,1];
    head.matrix = bodyCoordinates;
    head.matrix.translate(0, 0.1, -0.4);
    //head.matrix.rotate(0,0,0,0);
    head.matrix.scale(1, 1, .4)
    var headCoordinates = new Matrix4(head.matrix);
    head.render();

    //draw nose
    var nose = new Cube();
    nose.color = [0,0.5,0,1];
    nose.matrix = new Matrix4(headCoordinates);
    nose.matrix.translate(0.25, 0.4, -0.6);
    //nose.matrix.rotate(-5,1,0,0);
    nose.matrix.scale(0.5, 0.3, 0.6)
    nose.render();

    //draw leftEye
    var leftEye = new Cube();
    leftEye.color = [1,1,1,1];
    leftEye.matrix = new Matrix4(headCoordinates);
    leftEye.matrix.translate(0.1, 0.6, -0.1);
    //leftEye.matrix.rotate(-5,1,0,0);
    leftEye.matrix.scale(0.1, 0.2, 0.1)
    leftEye.render();

    //draw rightEye
    var rightEye = new Cube();
    rightEye.color = [1,1,1,1];
    rightEye.matrix = new Matrix4(headCoordinates);
    rightEye.matrix.translate(0.8, 0.6, -0.1);
    //rightEye.matrix.rotate(-5,1,0,0);
    rightEye.matrix.scale(0.1, 0.2, 0.1)
    rightEye.render();

    //draw mouth
    var mouth = new Cube();
    mouth.color = [0,0.5,0,1];
    mouth.matrix = headCoordinates;
    mouth.matrix.translate(0, 0.2, -1.2);
    mouth.matrix.rotate(g_mouth,1,0,0);
    mouth.matrix.scale(1, 0.3, 1.2)
    mouth.render();

    //draw jaw
    var jaw = new Cube();
    jaw.color = [0,0.6,0,1];
    jaw.matrix = headCoordinates;
    jaw.matrix.translate(0.001, -0.7, 0.001);
    jaw.matrix.rotate(g_jaw,1,0,0);
    //jaw.matrix.scale(1, 0.3, 1.2)
    jaw.render();

    // left leg
    var leftLeg = new Cube();
    leftLeg.color = [0, 1, 0, 1];
    leftLeg.matrix = new Matrix4(bodyCoordinates);

    leftLeg.matrix.translate(-0.3, 0, 0.8);          
    leftLeg.matrix.rotate(g_frontLeftAngle, 1, 0, 0);   
    leftLeg.matrix.translate(0, -0.5, 0);               
    leftLeg.matrix.scale(0.3, 0.7, 0.4);

    var leftLegCoordinates = new Matrix4(leftLeg.matrix);
    leftLeg.render();


    //left leg2
    var leftLeg2 = new Cube();
    leftLeg2.color = [0,0.8,0,1];
    leftLeg2.matrix = new Matrix4(leftLegCoordinates);

    leftLeg2.matrix.translate(-0.25, -0.5, -0.5);
    leftLeg2.matrix.translate(0, 0, 0.5);     
    leftLeg2.matrix.rotate(-g_frontLeft2Angle, 1, 0, 0);
    leftLeg2.matrix.translate(0, 0, -0.5);
    leftLeg2.matrix.scale(1.5, 0.5, 1.5);
    

    var leftLeg2Coordinates = new Matrix4(leftLeg2.matrix);
    leftLeg2.render();

    //left foot
    var leftFoot = new Cube();
    leftFoot.color = [0,0.8,0,1];
    leftFoot.matrix = new Matrix4(leftLeg2Coordinates);
    leftFoot.matrix.translate(0, 0, -0.2);
    //leftFoot.matrix.rotate(0,0,0,0);
    leftFoot.matrix.scale(1, 0.5, 0.2)
    var leftFootCoordinates = new Matrix4(leftFoot.matrix);
    leftFoot.render();

    //leftBack leg
    var leftBackLeg = new Cube();
    leftBackLeg.color = [0,1,0,1];
    leftBackLeg.matrix = new Matrix4(bodyCoordinates);
    leftBackLeg.matrix.translate(-0.3, 0, 3);          
    leftBackLeg.matrix.rotate(g_backLeftAngle, 1, 0, 0);   
    leftBackLeg.matrix.translate(0, -0.5, 0);               
    leftBackLeg.matrix.scale(0.3, 0.7, 0.4);
    var leftBackLegCoordinates = new Matrix4(leftBackLeg.matrix);
    leftBackLeg.render();

    //leftBack leg2
    var leftBackLeg2 = new Cube();
    leftBackLeg2.color = [0,0.8,0,1];
    leftBackLeg2.matrix = new Matrix4(leftBackLegCoordinates);
    leftBackLeg2.matrix.translate(-0.25, -0.5, -0.5);
    leftBackLeg2.matrix.translate(0, 0, 0.5);     
    leftBackLeg2.matrix.rotate(-g_backLeft2Angle, 1, 0, 0);
    leftBackLeg2.matrix.translate(0, 0, -0.5);
    leftBackLeg2.matrix.scale(1.5, 0.5, 1.5);
    var leftBackLeg2Coordinates = new Matrix4(leftBackLeg2.matrix);
    leftBackLeg2.render();

    //leftBack foot
    var leftBackFoot = new Cube();
    leftBackFoot.color = [0,0.8,0,1];
    leftBackFoot.matrix = new Matrix4(leftBackLeg2Coordinates);
    leftBackFoot.matrix.translate(0, 0, -0.2);
    //leftBackFoot.matrix.rotate(0,0,0,0);
    leftBackFoot.matrix.scale(1, 0.5, 0.2)
    var leftBackFootCoordinates = new Matrix4(leftBackFoot.matrix);
    leftBackFoot.render();

    //right leg
    var rightLeg = new Cube();
    rightLeg.color = [0,1,0,1];
    rightLeg.matrix = new Matrix4(bodyCoordinates);
    rightLeg.matrix.translate(1, 0, 0.8);
    rightLeg.matrix.rotate(g_frontRightAngle,1,0,0);
    rightLeg.matrix.translate(0, -0.5, 0);
    rightLeg.matrix.scale(0.3, 0.7, 0.4)
    var rightLegCoordinates = new Matrix4(rightLeg.matrix);
    rightLeg.render();

    //right leg2
    var rightLeg2 = new Cube();
    rightLeg2.color = [0,0.8,0,1];
    rightLeg2.matrix = new Matrix4(rightLegCoordinates);
    rightLeg2.matrix.translate(-0.25, -0.5, -0.5);
    rightLeg2.matrix.translate(0, 0, 0.5);     
    rightLeg2.matrix.rotate(-g_frontRight2Angle, 1, 0, 0);
    rightLeg2.matrix.translate(0, 0, -0.5);
    rightLeg2.matrix.scale(1.5, 0.5, 1.5);
    var rightLeg2Coordinates = new Matrix4(rightLeg2.matrix);
    rightLeg2.render();

    //right foot
    var rightFoot = new Cube();
    rightFoot.color = [0,0.8,0,1];
    rightFoot.matrix = new Matrix4(rightLeg2Coordinates);
    rightFoot.matrix.translate(0, 0, -0.2);
    //rightFoot.matrix.rotate(0,0,0,0);
    rightFoot.matrix.scale(1, 0.5, 0.2)
    var rightFootCoordinates = new Matrix4(rightFoot.matrix);
    rightFoot.render();

    //rightBack leg
    var rightBackLeg = new Cube();
    rightBackLeg.color = [0,1,0,1];
    rightBackLeg.matrix = new Matrix4(bodyCoordinates);
    rightBackLeg.matrix.translate(1, 0, 3);          
    rightBackLeg.matrix.rotate(g_backRightAngle, 1, 0, 0);   
    rightBackLeg.matrix.translate(0, -0.5, 0);               
    rightBackLeg.matrix.scale(0.3, 0.7, 0.4);
    var rightBackLegCoordinates = new Matrix4(rightBackLeg.matrix);
    rightBackLeg.render();

    //rightBack leg2
    var rightBackLeg2 = new Cube();
    rightBackLeg2.color = [0,0.8,0,1];
    rightBackLeg2.matrix = new Matrix4(rightBackLegCoordinates);
    rightBackLeg2.matrix.translate(-0.25, -0.5, -0.5);
    rightBackLeg2.matrix.translate(0, 0, 0.5);     
    rightBackLeg2.matrix.rotate(-g_backRight2Angle, 1, 0, 0);
    rightBackLeg2.matrix.translate(0, 0, -0.5);
    rightBackLeg2.matrix.scale(1.5, 0.5, 1.5);
    var rightBackLeg2Coordinates = new Matrix4(rightBackLeg2.matrix);
    rightBackLeg2.render();

    //rightBack foot
    var rightBackFoot = new Cube();
    rightBackFoot.color = [0,0.8,0,1];
    rightBackFoot.matrix = new Matrix4(rightBackLeg2Coordinates);
    rightBackFoot.matrix.translate(0, 0, -0.2);
    //rightBackFoot.matrix.rotate(0,0,0,0);
    rightBackFoot.matrix.scale(1, 0.5, 0.2)
    var rightBackFootCoordinates = new Matrix4(rightBackFoot.matrix);
    rightBackFoot.render();

    //tail 
    var tail = new Cube();
    tail.color = [0,0.8,0,1];
    tail.matrix = new Matrix4(bodyCoordinates);
    tail.matrix.translate(0.05, -0.05, 3.5);
    tail.matrix.rotate(-g_tail1Angle,1,0,0);
    tail.matrix.scale(0.9, 0.9, 1)
    var tailCoordinates = new Matrix4(tail.matrix);
    tail.render();

    //tail2 
    var tail2 = new Cube();
    tail2.color = [0,0.7,0,1];
    tail2.matrix = new Matrix4(tailCoordinates);
    tail2.matrix.translate(0.15, 0.15, 0.5);
    tail2.matrix.rotate(-g_tail2Angle,1,0,0);
    tail2.matrix.scale(0.7, 0.7, 1)
    var tail2Coordinates = new Matrix4(tail2.matrix);
    tail2.render();

    //tail3 
    var tail3 = new Cube();
    tail3.color = [0,0.7,0,1];
    tail3.matrix = new Matrix4(tail2Coordinates);
    tail3.matrix.translate(0.15, 0.15, 0.5);
    tail3.matrix.rotate(-g_tail3Angle,1,0,0);
    tail3.matrix.scale(0.7, 0.7, 1.5)
    var tail3Coordinates = new Matrix4(tail3.matrix);
    tail3.render();

    


    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}