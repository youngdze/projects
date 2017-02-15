import {Border} from './Border';

class Point {
    x: number;
    y: number;
    context: CanvasRenderingContext2D;
    uid: string;
    radius: number;
    moveAngle: number;
    movePerSec: number = 2;
    border: Border;
    source: Point;
    target: Point;
    movable: boolean = true;
    defaultStyle: string = 'rgba(0, 0, 0, .3)';
    fillStyle: string = this.defaultStyle;
    pressedStyle: string = 'rgba(0, 0, 0, .6)';

    constructor(x: number, y: number, context: CanvasRenderingContext2D, border?: Border) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.uid = Math.random().toString(16).substr(2, 8);
        this.radius = Math.random() * (10 - 5) + 5;
        this.moveAngle = Math.random() * (Math.PI * 2);

        this.border = border;
    }

    set pressed(pressed: boolean) {
        this.fillStyle = pressed ? this.pressedStyle : this.defaultStyle;
    }

    move(): Point {
        let {x, y, radius, moveAngle, movePerSec, border, movable} = this;

        if (movable) {
            if (border) {
                if (x - radius <= 0 || x + radius >= border.width) {
                    moveAngle = this.moveAngle = moveAngle - Math.PI / 2;
                } else if (y - radius <= 0 || y + radius >= border.height) {
                    moveAngle = this.moveAngle = Math.PI - moveAngle;
                }
            }

            this.x += movePerSec * Math.sin(moveAngle);
            this.y -= movePerSec * Math.cos(moveAngle);
        }

        this.render();

        return this;
    }

    toggleMove(toggle: boolean): Point {
        this.movable = toggle;

        return this;
    }

    connect(point?: Point): Point {
        const {x, y, context} = this;
        let distance = Math.sqrt(
            Math.pow(Math.abs((point.x - x)), 2) +
            Math.pow((Math.abs(point.y - y)), 2)
        );

        if (distance < 180) {
            context.beginPath();
            context.strokeStyle = `rgb(200, 200, 200)`;
            context.lineWidth = 0.2;
            context.moveTo(x, y);
            context.lineTo(point.x, point.y);
            context.stroke();
            context.closePath();
        }

        return this;
    }

    render(): Point {
        const {x, y, context, fillStyle} = this;

        context.save();
        context.beginPath();
        context.fillStyle = fillStyle;
        context.arc(x, y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        return this;
    }
}

export default Point;
