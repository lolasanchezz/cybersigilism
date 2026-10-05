import { number } from 'mathjs';
import p5, {
  Renderer,
} from 'p5';
import init, { p5SVG } from 'p5-svg';
import { off } from 'process';

const renderSvg = false;

renderSvg && init(p5);

const mousePos = new p5.Vector(0, 0);

export const design = (p5: p5SVG) => {
  p5.setup = () => {
    const cnv = p5.createCanvas(1600, 1200, p5.SVG) as unknown as Renderer;

    p5.noFill();

    renderSvg && p5.noLoop();

    cnv.mouseMoved(
      () => {
        mousePos.x = Math.round(p5.mouseX);
        mousePos.y = Math.round(p5.mouseY);
      }
    );
  };

  p5.draw = () => {
    p5.background(30);

    p5.stroke('#ed225d');
    p5.strokeWeight(4)
    const points = bezierCurve(
      400,500,430,475
    )
    points.forEach(([x, y]) => {
      p5.point(x, y);
    });
    console.log(points)
    
    p5.stroke(255);
    
  };
};


function bezierCurve(
  start: number,
  end: number,
  mid1: number,
  mid2: number,
  numberOfPoints: number = 100,
  xStart:number = 300,
  width: number = 900,
  offset: number = 50
): number[][]  {

  let points = []

  for (let i = 0; i < numberOfPoints; i++) {
    const t = i / numberOfPoints
    const p = 1 - t
    const point = 
    (p**3 * start) + 
    (3 * p**2 * t * mid1) +
    (3 * p * t**2 * mid2) +
    p**3 * end

    points.push([xStart + t * width, point + offset])

  }
return points;


}

