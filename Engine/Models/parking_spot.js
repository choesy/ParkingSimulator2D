class Parkingspot extends CollidableSprite {

    constructor(gameObject,position, qadrant, occupied){
        var size=new Vector2D(100, 50)
        super(position, 'rect', size, (qadrant* 90));
        this.occupied = occupied;
        this.objName="parkingspot"
        this.line_width = 10;

        this.car_color = color(random(255), random(255), random(255));
        this.gameObject=gameObject

    }

    update(){

    }

    draw(){
        push();

        translate(this.position.X, this.position.Y);
        rotate(this.angle);

        noStroke(); 
        fill(255, 255, 255);
        rect(-this.size.X/2,0,this.line_width,this.size.Y);
        rect(0,this.size.Y/2,this.size.X,this.line_width);
        rect(0,-this.size.Y/2,this.size.X,this.line_width);
        noFill();

        if(this.occupied){
            fill(this.car_color);
            rect(0, 0, this.size.X, this.size.Y);
        }

        pop();
    }

}