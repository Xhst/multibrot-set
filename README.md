
<h1><table border="0px"><tr><td valign="center"><img src="./assets/favicon.png" height="48px" width="48px"></td><td valign="center">Mandelbrot Set Visualization</td></tr></table></h1>

This project is a visualizer for the Mandelbrot set, a particular two-dimensional set defined in the complex plane that exhibits internal homotety; it is therefore a fractal.

Try the web [demo](https://xhst.github.io/mandelbrot-set/).

## 🔎 About Mandelbrot Set

The **Mandelbrot Set** $\mathcal{M}$ is defined from a family of complex quadratic polynomials: 

$$f_c : \mathbb{C} \longrightarrow \mathbb{C}$$

in the form:

$$f_c(z) = z^2 + c$$

For each complex parameter $c$ we consider the behavior of the succession $(0, f_c(0), f_c(f_c(0)), \dots )$ obtained by iterating $f_c(z)$ from the point $z = 0$ this can either diverge to infinity or be limited.
The Mandelbrot set is defined as the set of points $c$ such that the corresponding subsequence is limited. 
The previous succession can also be written as:

$$\begin{cases}z_0 = 0 \\
z_{n+1} = z^2 + c\end{cases}$$

if we indicate with $f^n_c(z)$ the $n$-th iteration of $f_c(z)$, $(f_c \circ f_c \circ \dots \circ f_c)(z)$ self composed $n$ times, the Mandelbrot Set is:

$$\mathcal{M} =  \\\{\ c \in \mathbb{C} : \sup_{n \in \mathbb{N}}\ |f^n_c(z)| < \infty \\}\ $$

## 🟢 Getting started
### ✔️ Prerequisites
You need to have Node.js and npm installed on your machine. You can download Node.js [here](https://nodejs.org/en/download/) and npm is included in the installation.
### 🛠 Installation
First, clone the repository to your local machine:
```
git clone https://github.com/xhst/mandelbrot-set.git
```
then, navigate to the project directory and install the dependencies with:
```
npm install
```
### ▶️ Build
To build the application, run:
```
npm run build
```
