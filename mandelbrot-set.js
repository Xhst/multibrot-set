(()=>{"use strict";var e={680:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});const r="// Define the maximum number of iterations for the Mandelbrot set calculation\r\n// the value between the @ is replaced with the actual value during compilation,\r\n// which can be set by the user in the application, that's because OpenGL doesn't support dynamic loops\r\nconst int MAX_ITERATIONS = @MAX_ITERATIONS@;\r\n\r\n// Set the precision for floating-point operations\r\nprecision mediump float;\r\n\r\n// Uniform variables representing the resolution of the screen,\r\n// scaling factor, and center position of the Mandelbrot set\r\nuniform vec2 resolution;\r\nuniform float scale;\r\nuniform vec2 center;\r\n\r\nvoid main() {\r\n    // Calculate the position of the current pixel in the complex plane\r\n    vec2 position = (gl_FragCoord.xy - resolution / 2.0) / scale + center;\r\n    \r\n    // Initialize the complex number z to (0, 0)\r\n    vec2 z = vec2(0.0, 0.0);\r\n    \r\n    // Initialize the iteration count to 0\r\n    int iterations = 0;\r\n    \r\n    // Iterate to determine whether the current pixel is in the Mandelbrot set\r\n    for (int i = 0; i < MAX_ITERATIONS; i++) {\r\n        // Check if the magnitude of z exceeds 2, indicating it's not in the set\r\n        if (length(z) > 2.0) {\r\n            // Exit the loop if the escape condition is met\r\n            break;\r\n        }\r\n            \r\n        // Calculate the next iteration of z using the Mandelbrot formula\r\n        vec2 newZ = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + position;\r\n        \r\n        // Update the value of z for the next iteration\r\n        z = newZ;\r\n        \r\n        // Increment the iteration count\r\n        iterations++;\r\n    }\r\n    \r\n    // Calculate the color based on the number of iterations\r\n    float color = float(iterations) / float(MAX_ITERATIONS);\r\n    \r\n    // Output the final color for the current pixel\r\n    gl_FragColor = vec4(color, color, color, 1.0);\r\n}\r\n"},450:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});const r="// Define the attribute for the position of the vertex\r\nattribute vec2 position;\r\n\r\nvoid main() {\r\n    // Set the position of the vertex in clip space\r\n    gl_Position = vec4(position, 0, 1);\r\n}"},253:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(450)),i=r(n(680)),a=2,c=.01;let d=null;function s(e,t,n=100){let r=function(e,t){let n=l(e,e.VERTEX_SHADER,o.default),r=l(e,e.FRAGMENT_SHADER,i.default.replace("@MAX_ITERATIONS@",String(t)));const a=e.createProgram();return e.attachShader(a,n),e.attachShader(a,r),e.linkProgram(a),e.useProgram(a),a}(t,n);!function(e,t){const n=e.getAttribLocation(t,"position"),r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(n),e.vertexAttribPointer(n,2,e.FLOAT,!1,0,0)}(t,r);let{scaleUniformLocation:m,centerUniformLocation:f,params:h}=function(e,t,n){const r={x:-.5,y:0,z:1},o=e.getUniformLocation(t,"resolution");e.uniform2f(o,n.width,n.height);const i=e.getUniformLocation(t,"scale");e.uniform1f(i,n.width/(a*Math.exp(r.z)));const c=e.getUniformLocation(t,"center");return e.uniform2f(c,r.x,r.y),{scaleUniformLocation:i,centerUniformLocation:c,params:r}}(t,r,e);!function(e,t,n,r,o){document.addEventListener("mouseup",(()=>{d&&clearInterval(d)})),document.addEventListener("touchend",(()=>{d&&clearInterval(d)})),document.getElementById("max-iterations-btn").addEventListener("click",(()=>{const n=parseInt(document.getElementById("max-iterations").value);console.log("Drawing Mandelbrot set with max iterations:",n),s(t,e,n)})),document.getElementById("move-down").addEventListener("touchstart",(()=>{d=setInterval((()=>{o.y-=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-up").addEventListener("touchstart",(()=>{d=setInterval((()=>{o.y+=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-left").addEventListener("touchstart",(()=>{d=setInterval((()=>{o.x-=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-right").addEventListener("touchstart",(()=>{d=setInterval((()=>{o.x+=c,u(e,t,n,r,o)}),100)})),document.getElementById("zoom-out").addEventListener("touchstart",(()=>{d=setInterval((()=>{o.z+=c,u(e,t,n,r,o)}),100)})),document.getElementById("zoom-in").addEventListener("touchstart",(()=>{d=setInterval((()=>{o.z-=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-down").addEventListener("mousedown",(()=>{d=setInterval((()=>{o.y-=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-up").addEventListener("mousedown",(()=>{d=setInterval((()=>{o.y+=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-left").addEventListener("mousedown",(()=>{d=setInterval((()=>{o.x-=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-right").addEventListener("mousedown",(()=>{d=setInterval((()=>{o.x+=c,u(e,t,n,r,o)}),100)})),document.getElementById("zoom-out").addEventListener("mousedown",(()=>{d=setInterval((()=>{o.z+=c,u(e,t,n,r,o)}),100)})),document.getElementById("zoom-in").addEventListener("mousedown",(()=>{d=setInterval((()=>{o.z-=c,u(e,t,n,r,o)}),100)})),document.getElementById("move-down").addEventListener("click",(()=>{o.y-=c,u(e,t,n,r,o)})),document.getElementById("move-up").addEventListener("click",(()=>{o.y+=c,u(e,t,n,r,o)})),document.getElementById("move-left").addEventListener("click",(()=>{o.x-=c,u(e,t,n,r,o)})),document.getElementById("move-right").addEventListener("click",(()=>{o.x+=c,u(e,t,n,r,o)})),document.getElementById("zoom-out").addEventListener("click",(()=>{o.z+=c,u(e,t,n,r,o)})),document.getElementById("zoom-in").addEventListener("click",(()=>{o.z-=c,u(e,t,n,r,o)})),window.addEventListener("keydown",(i=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.key)||["w","a","s","d"].includes(i.key)||["z","x"].includes(i.key)){switch(i.preventDefault(),i.key){case"ArrowUp":case"w":o.y+=c;break;case"ArrowDown":case"s":o.y-=c;break;case"ArrowLeft":case"a":o.x-=c;break;case"ArrowRight":case"d":o.x+=c;break;case"z":o.z+=c;break;case"x":o.z-=c}u(e,t,n,r,o)}}))}(t,e,m,f,h),t.drawArrays(t.TRIANGLE_STRIP,0,4)}function l(e,t,n){const r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}function u(e,t,n,r,o){e.uniform1f(n,t.width/(a*Math.exp(o.z))),e.uniform2f(r,o.x,o.y),e.drawArrays(e.TRIANGLE_STRIP,0,4)}!function(){const e=function(){const e=document.createElement("canvas");return document.body.appendChild(e),e.width=window.innerWidth,e.height=window.innerHeight,e}(),t=e.getContext("webgl");if(!t)throw new Error("WebGL not supported");s(e,t)}()}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(253)})();