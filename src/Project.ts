import './style.scss';
import Point from './Point';
import Coor from './Coor';

class Project {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    points: Point[] = [];
    bgColor: string;

    constructor(canvas: HTMLCanvasElement, bgColor: string = `rgba(247, 250, 252, 1)`) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.bgColor = bgColor;

        this.canvas.width = this.width = window.innerWidth - 4;
        this.canvas.height = this.height = window.innerHeight - 4;

        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.save();

        this.autoReSize()
            .pointDraggable();
    }

    pointDraggable():Project {
        let {canvas, points} = this;
        let point: Point;

        canvas.addEventListener('mousedown', (ev) => {
            let coor: Coor = this.getCoorFromEvent(ev);

            point = points.filter(p => {
                return ((p.x + p.radius) >= coor.x) &&
                    ((p.x - p.radius) <= coor.x) &&
                    ((p.y + p.radius) >= coor.y) &&
                    ((p.y - p.radius) <= coor.y);
            })[0];
            if (point) {
                point.pressed = true;
                point.toggleMove(false);
            }
        });

        canvas.addEventListener('mousemove', (ev) => {
            if (point) {
                let coor: Coor = this.getCoorFromEvent(ev);

                // point.moveAngle = Math.atan((coor.x - point.x) / (coor.y - point.y));
                point.x = coor.x;
                point.y = coor.y;
                point.render();
            }
        });

        canvas.addEventListener('mouseup', (ev) => {
            if (point) {
                point.pressed = false;
                point.toggleMove(true);
                point = null;
            }
        });

        return this;
    }

    private getCoorFromEvent(event: MouseEvent): Coor {
        let coor: Coor;

        if (event.pageX || event.pageY) {
            coor = {
                x: event.pageX,
                y: event.pageY
            };
        } else {
            let x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y = event.clientY + document.body.scrollTop+ document.documentElement.scrollTop;

            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;

            coor = { x, y };
        }

        return coor;
    }

    get randomCoor(): {x: number, y: number} {
        const {width, height} = this;
        let x: number, y: number;

        x = Math.random() * width;
        y = Math.random() * height;

        return { x, y };
    }

    autoReSize(): Project {
        window.addEventListener('resize', () => {
            this.canvas.width = this.width = window.innerWidth - 4;
            this.canvas.height = this.height = window.innerHeight - 4;
            this.rePaint();
            this.reRenderPoints();
        });

        return this;
    }

    rePaint(): Project {
        let {width, height, ctx, bgColor} = this;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        return this;
    }

    renderPoints(num: number = 100): Project {
        const {width, height, ctx} = this;

        while(num--) {
            let coor = this.randomCoor;
            let point = new Point(coor.x, coor.y, ctx, {width, height});

            this.points.push(point);

            point.render();
        }

        return this;
    }

    reRenderPoints(): Project {
        const {width, height, ctx, points} = this;

        points.forEach(p => {
            p.border = {width, height};
            p.render();
        });

        return this;
    }

    connectPoints(): Project {
        let {points} = this;

        for (let i = 0; i < points.length; i++) {
            for (let j = 1; j < points.length; j++) {
                if (points[i].target !== points[j]) {
                    points[i].connect(points[j]);
                }
            }
        }

        return this;
    }

    movePoints(): Project {
        let {points, ctx} = this;

        this.rePaint();
        points.forEach(p => p.move());

        return this;
    }
}

const canvas = <HTMLCanvasElement>document.querySelector('#project');
let project = new Project(canvas);
project.renderPoints(50).connectPoints();

let move$: number;
let move = (): number => {
    move$ = setTimeout(() => {
        project.movePoints().connectPoints();
        move();
    }, 50);
    return move$;
};
move();

export default Project;
