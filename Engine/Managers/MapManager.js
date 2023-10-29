class MapManager{

    constructor(gameObject){
        this.gameObject = gameObject;
        this.createMap()
       
    }

    createMap(){
    
        //3- x zid
        //4-Big zid
        //5- y zid
   var mapArray=[         
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
           
    ]
    var mapSize = [mapArray[0].length,mapArray.length] //resolucija naše mape
    var XDivide = canvasWidth / mapSize[0];
    var YDivide = canvasHeight / mapSize[1];
    this.spawnborders(XDivide,YDivide);

        for(var x = 0; x < mapSize[0]; x++){
            for(var y = 0; y < mapSize[1]; y++){

               var position = new Vector2D(x * XDivide + XDivide / 2, y * YDivide + YDivide / 2);
               
                switch(mapArray[y][x]){
                    case 1: 
                        this.gameObject.CarManager.createCar(position, 0,false);
                    break;

                    case 2:
                        this.gameObject.ParkingspotManager.createParkingspot(position, 1, false);
                    break;

                    case 3:
                        //this.gameObject.WallManager.createWall(position, new Vector2D(XDivide, YDivide), 0);
                        this.gameObject.WallManager.createWall(position, new Vector2D(3*XDivide, YDivide), 0);
                        
                    break;

                    case 4:
                        //this.gameObject.WallManager.createWall(position, new Vector2D(XDivide, YDivide), 0);
                        this.gameObject.WallManager.createWall(position, new Vector2D(3*XDivide, 3*YDivide), 0);
                        
                    break;

                    case 5:
                        //this.gameObject.WallManager.createWall(position, new Vector2D(XDivide, YDivide), 0);
                        this.gameObject.WallManager.createWall(position, new Vector2D(XDivide, 3*YDivide), 0);
                        
                    break;

                }
            }
        }
   
    }

spawnborders(XDivide,YDivide){
    this.gameObject.WallManager.createWall(new Vector2D(XDivide/2,canvasHeight/2), new Vector2D(XDivide, canvasHeight), 0);
    this.gameObject.WallManager.createWall(new Vector2D(canvasWidth-XDivide/2,canvasHeight/2), new Vector2D(XDivide, canvasHeight), 0);
    this.gameObject.WallManager.createWall(new Vector2D(canvasWidth/2,YDivide/2), new Vector2D(canvasWidth, YDivide), 0);
    this.gameObject.WallManager.createWall(new Vector2D(canvasWidth/2,canvasHeight-YDivide/2), new Vector2D(canvasWidth, YDivide), 0);
}

}