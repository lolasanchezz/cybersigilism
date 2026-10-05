import { number } from 'mathjs';
import p5, {
  Renderer,
} from 'p5';
import init, { p5SVG } from 'p5-svg';
import { off } from 'process';

const renderSvg = false;
type point = [number, number]
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
        p5.strokeWeight(1)
    p5.textSize(100)
    p5.text(`${mousePos.x}, ${mousePos.y}`,
        mousePos.x, mousePos.y)
    p5.stroke('#ed225d');
    p5.strokeWeight(4)
    const points = bezierCurve(
      [600, 100],[1200,1100],
      [430,430],[1100,700]
    )
    points.forEach(([x, y]) => {
      p5.point(x, y);
    });
    console.log(points)
    
    p5.stroke(255);
    
  };
};


function bezierCurve(
  start: point,
  end: point,
  mid1: point,
  mid2: point,
  numberOfPoints: number = 100,
  
): number[][]  {

  let points = []

  for (let i = 0; i < numberOfPoints; i++) {
    const t = i / numberOfPoints
    const p = 1 - t
    
    const x = 
    (p**3 * start[0]) + 
    (3 * p**2 * t * mid1[0]) +
    (3 * p * t**2 * mid2[0]) +
    t**3 * end[0]
    const y = 
    (p**3 * start[1]) + 
    (3 * p**2 * t * mid1[1]) +
    (3 * p * t**2 * mid2[1]) +
    t**3 * end[1]

    points.push([x,y])

  }
return points;


}

