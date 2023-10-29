class Game{

    constructor(level, updateCycles){
        /*V vse Managerje moramo dat objekt od Game, da lahko pol ve na kateri game naj se nanša,
        ker Managerji samo managajo , game class je glavni*/
        this.WallManager = new WallManager(this);
        this.ParkingspotManager = new ParkingspotManager(this);
        this.CarManager = new CarManager(this);
        this.deepQCarManager = new DeepQCarManager(this);
        this.MapManager = new MapManager(this)
        this.parkingspot=this.ParkingspotManager.createParkingspot(new Vector2D(900, 700), 0, true);
      //  this.CarManager.firstGeneration(new Vector2D(300, 150), 50,20,0.2);
        this.deepQCarManager.firstEpisode(new Vector2D(300, 150),1);
        this.updateCycles = updateCycles;
        this.scoreArray=[];
        this.numberOfEpisodes=0;
        this.numberOfGenerations=0;
         
    }

    draw(){
        background(174, 171, 171);
        this.ParkingspotManager.draw();
        this.WallManager.draw();
        this.CarManager.draw();
        this.deepQCarManager.draw();
        text(this.numberOfEpisodes,100,100)
        text(this.numberOfGenerations,100,150)

       
    }

    update(keys){
        for(var i = 0; i < this.updateCycles; i++){
            this.ParkingspotManager.update()
            this.WallManager.update();
            this.CarManager.update(keys);
            this.deepQCarManager.update(keys);
            
        }
    }

    setUpdateCycles(n){
        this.updateCycles = n;
    }

  

}