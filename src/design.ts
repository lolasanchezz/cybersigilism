import { number } from 'mathjs';
import p5, {
  Renderer,
} from 'p5';
import init, { p5SVG } from 'p5-svg';
import { off } from 'process';
import {sqrt, pi, cos, sin, randomInt} from 'mathjs'

const renderSvg = false;
type point = [number, number]
renderSvg && init(p5);

const mousePos = new p5.Vector(0, 0);

export const design = (p5: p5SVG) => {
  p5.setup = () => {
    const cnv = p5.createCanvas(1600, 1200, p5.SVG) as unknown as Renderer;
    p5.noLoop();
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
    /*
    const points = bezierCurve(
      [600, 100],[1200,1100],
      [430,430],[1100,700]
    )
    points.forEach(([x, y]) => {
      p5.point(x, y);
    });
    */
    const pts = funkyCurve([600,100], [1000,1000]).forEach(([x,y]) => {
      p5.point(x,y)
    }
    )
    
    
    p5.stroke(255);
    
  };
};


function bezierCurve(
  start: point,
  end: point,
  mid1: point,
  mid2: point,
  numberOfPoints: number = 100,
  
): point[] {

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
return points as point[];


}


function halfCircleWithPoints(
  start: point,
  width: number,
  height: number,
  numberOfPoints: number,
  tilt: number = 0,
): point[] {


  let points: point[] = []
  
  const step = width/numberOfPoints
  const a = width / 2
  const b = height
  const center = [start[0] + a, start[1]]
  const cosT = cos(tilt)
  const sinT = sin(tilt)
  console.log(a,b,step)
  for (let i = 0; i <= (numberOfPoints); i++ ) {
    const angle = pi * (1 - i/numberOfPoints)
  
    

   const moveX = a + a * cos(angle);
const moveY = -b * sin(angle);
const x = start[0] + moveX * cosT - moveY * sinT;
const y = start[1] + moveX * sinT + moveY * cosT;
      
    points.push([x,y as number]) 
  }




  return points
 


}

function minBetweenPts(pt1: point, pt2: point, thing: point) {
const dt1 = sqrt((thing[0]-pt1[0])**2 + (thing[1]-pt1[1])**2)
const dt2 = sqrt((thing[0]-pt2[0])**2 + (thing[1]-pt2[1])**2)
if (dt1 > dt2) return pt2
else return pt1
}



function getDerivative(pts: point[]): number{

  let i = 1;
  let sum = 0;

  while (i < pts.length) {
    let slope = (pts[i][1] - pts[i-1][1])/((pts[i][0]) - pts[i-1][0])
    sum += slope
    console.log(slope)
    i++;
  }
  const derivative = sum/i;
  return derivative
}


function funkyCurve(start: point, end: point) {
  const mid1 = [randomInt(start[0], end[0]),randomInt(start[1], end[1])] as point
  const mid2 = [randomInt(start[0], end[0]),randomInt(start[1], end[1])] as point
  const numOfPts = 50
  const pts = bezierCurve(start,end,minBetweenPts(mid1, mid2, start),minBetweenPts(mid1, mid2, end), numOfPts)
  const lastFewPoints = pts.slice(numOfPts/2,numOfPts)

  const derivative = getDerivative(lastFewPoints)

  
  let angle = 90;
  console.log(derivative)
  const numOfPtsForCircle = 10;
  let circlePts = halfCircleWithPoints(end, 150, 50, numOfPtsForCircle, angle);
  const range = 0.2
  let newDerivative = 0
  let iterations = 0
  while (true) {
    if (iterations > 1000) break
    iterations+=1
    const lastFewPoints = circlePts.slice(0, numOfPts)
    newDerivative = getDerivative(lastFewPoints)
    console.log(lastFewPoints)
    const dif = newDerivative-derivative
    console.log(dif)
    if ((dif > -0.2) && (dif < 0.2)) {
      break
    } else if (dif > 0.2) {
      angle = angle - 5
   
    } else {
      angle = angle + 5

    }
    circlePts = halfCircleWithPoints(end, 150, 50, numOfPtsForCircle, angle);
  }

  console.log(iterations)


  return [...bezierCurve(start, end, minBetweenPts(mid1, mid2, start), minBetweenPts(mid1, mid2, end), 50), 
    ...circlePts
  ] 



}