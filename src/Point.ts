class Point {
    x: number;
    y: number;
    context: CanvasRenderingContext2D;
    uid: string;
    radius: number;
    moveAngle: number;
    movePerSec: number = 10;

    constructor(x: number, y: number, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.uid = Math.random().toString(16).substr(2, 8);
        this.radius = Math.random() * (5 - 1) + 1;
        this.moveAngle = Math.random() * (Math.PI * 2);
    }

    move(): Point {
        let {radius, moveAngle, movePerSec} = this;
        this.x += movePerSec * Math.sin(moveAngle);
        this.y -= movePerSec * Math.cos(moveAngle);

        this.render();

        return this;
    }

    render(): Point {
        const {x, y, context} = this;

        context.save();
        context.beginPath();
        context.fillStyle = `#000`;
        context.arc(x, y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        return this;
    }
}

export default Point;
