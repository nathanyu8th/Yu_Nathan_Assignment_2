class Triangle{
    constructor(){
        this.type='triangle';
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
        this.opacity = 1.0;
        this.buffer = null;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size / 100.00;


        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size
        //gl.uniform1f(u_Size, size);

        // let modelMatrix = new Matrix4(); // identity
        // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        // Draw
        drawTriangle([xy[0], xy[1] + size,  xy[0] - size,    xy[1] - size, xy[0] + size,    xy[1] - size  ]);
    }
}


function drawTriangle(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("Failed to create buffer");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0){
    //     console.log("Failed to get storage location oif a_Position");
    //     return -1;
    // }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices){
    var n = 3;
    if (this.buffer === null){
        this.buffer = gl.createBuffer();
        if(!this.buffer) {
            console.log("Failed to create buffer");
            return -1;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0){
    //     console.log("Failed to get storage location oif a_Position");
    //     return -1;
    // }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}