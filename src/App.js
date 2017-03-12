import React, { Component } from 'react';
import MathJax from 'react-mathjax';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props)
    this.canvas = null;
    this.context = null;

    this.outputCanvas = null;
    this.outputContext = null;

    this.width = 500;
    this.height = 500;

    this.scaleFactor = 2;

    this.state = {
      x: 0,
      i: 0
    }
  }

  initCanvas = (ref) => {
    this.canvas = ref;
    this.context = this.canvas.getContext('2d');
    this.drawGrid(this.context);
    this.context.fillStyle = '#FF0000';
  }

  initOutputCanvas = (ref) => {
    this.outputCanvas = ref;
    this.outputContext = this.outputCanvas.getContext('2d');
    this.drawGrid(this.outputContext);
    this.outputContext.fillStyle = '#FF0000';
  }

  drawGrid = (context) => {
    context.fillRect(this.width / 2, 0, 1, this.height);
    context.fillRect(0, this.height / 2, this.width, 1);
  }

  canvasToPlot(x, y) {
    return [
      (x / (this.width / this.scaleFactor) - 0.5 * this.scaleFactor),
      (y / (this.height / this.scaleFactor) - 0.5 * this.scaleFactor)
    ];
  }

  plotToCanvas(x, y) {
    return [
      (this.width / this.scaleFactor) * (x + 0.5 * this.scaleFactor), 
      (this.height / this.scaleFactor) * (y + 0.5 * this.scaleFactor)
    ];
  }

  complexSquare(x, i) {
    let angle = Math.atan2(i, x) * 2;
    let magnitude = Math.pow(Math.sqrt(x*x + i*i), 2);
    return [Math.cos(angle) * magnitude, Math.sin(angle) * magnitude]
  }

  inverseComplexSquare(x, i) {
    let angle = Math.atan2(i, x) / 2;
    let magnitude = Math.sqrt(Math.sqrt(x*x + i*i), 2);
    let [fx, fi] = [Math.cos(angle) * magnitude, Math.sin(angle) * magnitude];
    return [fx, fi, -fx, -fi];
  }

  computeMouseCoords = (event, canvas) => {
    const {top, left} = canvas.getBoundingClientRect();
    let [xIn, y] = [event.clientX - left, event.clientY - top];
    let [x, i] = this.canvasToPlot(xIn, y);
    this.setState({x, i});
    return [x, i]
  }

  handleMouseMove = (event) => {
    let [x, i] = this.computeMouseCoords(event, this.canvas);
    if (event.buttons > 0) this.draw(x, i);
  }

  handleOutputMouseMove = (event) => {
    let [x, i] = this.computeMouseCoords(event, this.outputCanvas);
    if (event.buttons > 0) this.drawInverse(x, i);
  }

  draw = (x, i) => {
    if (this.context && this.outputContext) {
      let [fx, fi] = this.complexSquare(x, i);
      [x, i] = this.plotToCanvas(x, i);
      [fx, fi] = this.plotToCanvas(fx, fi);

      this.context.fillRect(x, i, 2, 2);
      this.outputContext.fillRect(fx, fi, 2, 2);
    }
  }

  drawInverse = (x, i) => {
    if (this.context && this.outputContext) {
      let [fx, fi, f1x, f1i] = this.inverseComplexSquare(x, i);
      [x, i] = this.plotToCanvas(x, i);
      [fx, fi] = this.plotToCanvas(fx, fi);
      [f1x, f1i] = this.plotToCanvas(f1x, f1i);

      this.outputContext.fillRect(x, i, 2, 2);
      this.context.fillRect(fx, fi, 2, 2);
      this.context.fillRect(f1x, f1i, 2, 2);
    }
  }

  render() {
    return (
      <MathJax.Context>       
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'absolute'}}>
            {_.round(this.state.x, 3)} + {_.round(this.state.i, 3)}<i>i</i>
          </div>  
          <div>
            <div style={{height: '3em', userSelect: 'none'}}>
              <MathJax.Node>{`f(x)=z^2`}</MathJax.Node>
            </div>
            <canvas 
              onMouseMove={this.handleMouseMove} 
              width={this.width} 
              height={this.height} 
              ref={this.initCanvas}
              style={{outlineStyle: 'solid', margin: '5px'}}/>
          </div>
          <div>
            <div style={{height: '3em', userSelect: 'none'}}>
              <MathJax.Node>{`f^{-1}(x)=\\sqrt{z^2}=\\pm{z}`}</MathJax.Node>
            </div>
            <canvas 
              onMouseMove={this.handleOutputMouseMove} 
              width={this.width} 
              height={this.height} 
              ref={this.initOutputCanvas}
              style={{outlineStyle: 'solid', margin: '5px'}}/>
          </div>
        </div>
      </MathJax.Context>
    );
  }
}

export default App;
