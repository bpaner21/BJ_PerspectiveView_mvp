// PerspectiveView_mvp.js

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    '   v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL.');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Get the storage location of the u_ModelMatrix, u_ViewMatrix, and u_ProjMatrix
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage locations of u_ModelMatrix');
        return;
    }
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage locations of u_ViewMatrix');
        return;
    }
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (!u_ProjMatrix) {
        console.log('Failed to get the storage locations of u_ProjMatrix');
        return;
    }

    // Set the matrix to be used for to set the camera view
	var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();
	
	// calculate the view matrix and projection matrix
	viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
	projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
	
	// Pass the view and projection matrix to u_ModelMatrix, u_ViewMatrix, u_ProjMatrix
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);	

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);
	
	// Prepare the model matrix for another pair of triangles
	modelMatrix.setTranslate(-0.75, 0, 0); // Translate -0.75
	
	// Modify only the model matrix
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	
	gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
         0.0,  1.0, -4.0,		0.4,  1.0,  0.4,
        -0.5, -1.0, -4.0,		0.4,  1.0,  0.4,
		 0.5, -1.0, -4.0,		1.0,  0.4,  0.4, 
		
		 0.0,  1.0, -2.0,		1.0,  1.0,  0.4,
		-0.5, -1.0, -2.0,		1.0,  1.0,  0.4,
		 0.5, -1.0, -2.0,		1.0,  0.4,  0.4,
		
		 0.0,  1.0,  0.0,		0.4,  0.4,  1.0,
		-0.5, -1.0,  0.0,		0.4,  0.4,  1.0,
		 0.5, -1.0,  0.0,		1.0,  0.4,  0.4
    ]);
    var n = 9;

    // Create a buffer object
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // Get the storage location of a_Position, assign, and enable buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // Get the storage location of a_Color, assign, and enable buffer
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    //gl.bindBuffer(gl.ARRAY_BUFFER, null);   // What does this do?

    return n;
}