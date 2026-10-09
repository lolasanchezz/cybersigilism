import { number } from 'mathjs';
import p5, {
  Renderer,
  
} from 'p5';
import init, { p5SVG } from 'p5-svg';
import {sqrt, pi, cos, sin, randomInt} from 'mathjs'

type params = {
startX: number
startY: number
endX: number
endY: number
startPercentage: number
endPercentage: number
lengthXlowerBound: number
lengthXhighBound: number
lengthYlowerBound: number
lengthYhighBound: number
outerLoop: number
innerLoop: number
}



const renderSvg = false;
type point = [number, number]
renderSvg && init(p5);
 let startX = 600
    let startY = 100
    let endX = 1000
    let endY = 1000
const mousePos = new p5.Vector(0, 0);

export const design = (p5: p5SVG) => {
  const params: params = {
    startX: 600, startY: 600, endX: 1000, endY: 1000,
    startPercentage: 0.125, endPercentage: 0.75, 
    lengthXlowerBound:100,
    lengthXhighBound:700,
    lengthYlowerBound:100,
    lengthYhighBound:300,
    outerLoop: 75,
    innerLoop: 50
  }

  function slider(label: string, key: keyof params, min: number, max: number, step: number = 1) {
    const wrapper = p5.createDiv().style('display', 'inline-block')
      const slider = p5.createSlider(min, max, params[key], step).parent(wrapper) as p5.Element & {
        changed(callback: () => void): void
      }
    const caption = p5.createDiv(`${label} = ${params[key]}`).parent(wrapper)
    slider.changed(() => {
      params[key] = Number(slider.value())
      caption.html(`${label} = ${params[key]}`)
      p5.redraw()
    })
  }


  p5.setup = () => {
    const cnv = p5.createCanvas(1600, 1200, p5.SVG) as unknown as Renderer;
    p5.noFill();
    p5.noLoop()
    renderSvg && p5.noLoop();

    slider('start x', 'startX', 0, 1000)
    slider('start y', 'startY', 0, 1000)
    slider('end x', 'endX',  0, 1600)
    slider('end x', 'endY', 0, 1600)
    slider('start %', 'startPercentage', 0, 1, 0.01)
    slider('end %', 'endPercentage', 0, 1, 0.01)
    slider('length x low', 'lengthXlowerBound', 0, 1000)
    slider('length x high', 'lengthXhighBound', 0, 1000)
    slider('length y low', 'lengthYlowerBound',  0, 1000)
    slider('length y high', 'lengthYhighBound',  0, 1000)
    slider('outer loop', 'outerLoop', 1, 125)
    slider('inner loop', 'innerLoop', 1, 150)

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
   
    p5.stroke('#fff1f5');
    p5.strokeWeight(1)
   
    let pts = funkyCurve([startX,startY], [endX,endY]);
    pts.forEach(([x,y]) => {p5.point(x,y)})
    let randomStartPoint = pts[
      randomInt(pts.length * params.startPercentage, (pts.length*params.endPercentage))
    ]
    
    for (let i = 0; i < 75; i++) {
      console.log("E")
     randomStartPoint = pts[
      randomInt(pts.length/8, (pts.length*3/4))
    ]
    
      for (let j = 0; j < params.outerLoop; j++) {
        let lengthX = randomInt(params.lengthXlowerBound,params.lengthXhighBound)
        if (randomInt(0,10) > 5) {lengthX = lengthX*-1}
        let lengthY = randomInt(params.lengthYlowerBound,params.lengthYhighBound)
        if (randomInt(0,10) > 5) {lengthY = lengthY*-1}

        let end = [randomStartPoint[0] + lengthX, randomStartPoint[1] + lengthY] as point
        let pts = funkyCurve(randomStartPoint, end, false);
        pts.forEach(([x,y]) => {p5.point(x,y)})
      }
    }
    

    startX += 1
    endX +=1
    
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


function funkyCurve(start: point, end: point, topCircle: boolean = false) {
  const mid1 = [randomInt(start[0], end[0]),randomInt(start[1], end[1])] as point
  const mid2 = [randomInt(start[0], end[0]),randomInt(start[1], end[1])] as point
  const numOfPts = 50
  const pts = bezierCurve(start,end,minBetweenPts(mid1, mid2, start),minBetweenPts(mid1, mid2, end), numOfPts)
  const phi = Math.atan2(end[1] - mid2[1], end[0] - mid2[0])
  const lastFewPoints = pts.slice(numOfPts/2,numOfPts)
    const psi = Math.atan2(start[1] - mid1[1], start[0] - mid1[0])

    const numOfPtsForCircle=10
  let circlePts = halfCircleWithPoints(end, 200, 100, numOfPtsForCircle, phi + Math.PI / 2);
  
  if (topCircle) {
    
    const top = halfCircleWithPoints(start, 200, 200, 10, psi + Math.PI / 2).reverse()
    return [...top, ...bezierCurve(start, end, minBetweenPts(mid1, mid2, start), minBetweenPts(mid1, mid2, end), 50), 
    ...circlePts
  ] 
  } else {
    return [...bezierCurve(start, end, minBetweenPts(mid1, mid2, start), minBetweenPts(mid1, mid2, end), numOfPts), 
    ...circlePts
  ] 
  }

 




  



}

