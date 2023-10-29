class Vector2D{
    
    constructor(X, Y){
        this.X = X;
        this.Y = Y;
    }

    /* GETERS */
    get Array(){
        return [this.X, this.Y];
    }

    /* STATIC METHODS */
    static zeros(){
        return new Vector2D(0, 0);
    }

    static ones(){
        return new Vector2D(1, 1);
    }

    static normalize(vector){
        return Math.sqrt(Math.pow(vector.X, 2) + Math.pow(vector.Y ));
    }

    static add(a, b){
        return new Vector2D(a.X + b.X, a.Y + b.Y);
    }

    static subtract(a, b){
        return new Vector2D(a.X - b.X, a.Y - b.Y);
    }

    static transpose(vector){
        return [[vector.X], [vector.Y]];
    }
    static distance(v1,v2){
        return math.distance(v1.Array, v2.Array);
    }

    /* OBJECT METHODS */
    add(vector){
        this.X += vector.X;
        this.Y += vector.Y;
    }

    subtract(vector){
        this.X -= vector.X;
        this.Y -= vector.Y;
    }

    devide(n){
        this.X /= n;
        this.Y /= n;
    }

    multiply(n){
        this.X *= n;
        this.Y *= n;
    }

    normalize(){
        var m = Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2))
        if(m > 0)
            this.devide(m);
    }

}