class WallManager{

    constructor(gameObject){
        this.wallsArray=[];
        this.wallIndex=0;
        this.gameObject=gameObject
    }

    createWall(position, size, angle){
        this.wallsArray[this.wallIndex] = new Wall(this.gameObject,position, size, angle);
        this.wallIndex++;
    }

    draw() {
        for(var wall of this.wallsArray){
            wall.draw()
        }
    }

    update(){
    
        for(var wall of this.wallsArray){
            wall.update()
        }
    }
}