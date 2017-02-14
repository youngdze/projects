import './style.scss';
import Point from './Point';

class Galaxy {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    points: Point[] = [];
    bgColor: string;

    constructor(canvas: HTMLCanvasElement, bgColor: string = `#fff`) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.bgColor = bgColor;

        this.canvas.width = this.width = window.innerWidth;
        this.canvas.height = this.height = window.innerHeight;

        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.save();
    }

    renderPoints(num: number = 100): Galaxy {
        const {ctx} = this;

        while(num--) {
            let coor = this.randomCoor;
            let point = new Point(coor.x, coor.y, ctx);

            this.points.push(point);

            point.render();

            setTimeout(point.move.bind(point), 1000);
        }

        return this;
    }

    connectPoints() {
        let {points} = this;

        points.forEach(p => {
            console.log(p);
        });
    }

    get randomCoor(): {x: number, y: number} {
        const {width, height} = this;
        let x: number, y: number;

        x = Math.random() * width;
        y = Math.random() * height;

        return { x, y };
    }
}

const canvas = <HTMLCanvasElement>document.querySelector('#galaxy');
let galaxy = new Galaxy(canvas);
galaxy.renderPoints(300);
// galxy.connectPoints();

export default {
};
