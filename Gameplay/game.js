class Game{

    constructor(level){
        this.WallManager = new WallManager(this);
        this.ParkingspotManager = new ParkingspotManager(this);
        this.CarManager = new CarManager(this);

        this.MapManager = new MapManager(this)
        /*Map Managerju moramo dat objekt od Game, da lahko pol spawna objecte v tem Game classu,
        ker MapManager samo creata map, drawa pa ga Game class*/
       this.MapManager.createMap(0);

       this.car = new Car(this,new Vector2D(300, 100), 0, true)
    }

    draw(){
        background(174, 171, 171);
        this.ParkingspotManager.draw();
        this.WallManager.draw();
        this.CarManager.draw();

        this.car.draw();
    }

    update(keys){
        this.ParkingspotManager.update()
        this.CarManager.update(keys);
        this.WallManager.update();

        this.car.update(keys)
        //this.car.checkCollision([this.WallManager.WallsArray[0]]);
        //console.log(this.WallManager.WallsArray[0])
    }



}