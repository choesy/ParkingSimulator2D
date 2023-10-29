class CollidableSprite{

    constructor(position, poligon, size, angle, offset){
        this.position = position;
        this.poligon = poligon;
        this.size = size;
        this.angle = angle;

        this.offset = offset;

        this.setPoints();
        this.setEdges();
    }

    setCollider(){
        this.setPoints();
        this.setEdges();

    }

    setPoints(){
        let size = new Vector2D(this.size.X, this.size.Y);
        size.devide(2);
        let position = new Vector2D(this.position.X, this.position.Y);
        position.subtract(size);
        size.multiply(2);

        this.points = [
            new Vector2D(position.X, position.Y),
            new Vector2D(position.X + size.X, position.Y),
            new Vector2D(position.X + size.X, position.Y + size.Y),     
            new Vector2D(position.X, position.Y + size.Y),
        ];

        let matrix = Matrix.getRotationMatrix(this.angle - 360);
        let center = new Vector2D(position.X + size.X / 2, position.Y + size.Y / 2);
        var pointsLen=this.points.length;
        for(let i = 0; i < pointsLen; i++){
            this.points[i].subtract(center);
            let vector = Vector2D.transpose(this.points[i]);
            let vector_d = math.multiply(matrix, vector);
            this.points[i] = new Vector2D(vector_d[0][0], vector_d[1][0]);
            this.points[i].add(center);
        }
    }

    setEdges(){
        this.edges = [];
        var pointsLen=this.points.length;
        for(let i = 0; i < pointsLen-1; i++){
            this.edges[i]= Vector2D.subtract(this.points[i+1], this.points[i]);
        }
        this.edges[this.points.length-1] = Vector2D.subtract(this.points[0], this.points[this.points.length-1]);
    }

    draw(){

    }

    update(){

    }

    collision(collider){
        if (collider==this)return;
        let type = this.poligon + '-' + collider.poligon;
        // switch(type){
        //     case 'circle-rect' :    return Collider.Collision_Circle_vs_Rect(this, collider);
        //     case 'rect-circle' :    return Collider.Collision_Circle_vs_Rect(this, collider);
        //     case 'rect-rect' :      return Collider.Collision_Rect_vs_Rect(this, collider);
        //     default :               return true;
        // }
        return Collider.Collision_Projection(this, collider);
    }

}