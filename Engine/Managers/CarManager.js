class CarManager{
    constructor(gameObject){
        this.carsArray=[];
        this.bestBrainsArray=[];
        this.carIndex=0;
        this.gameObject=gameObject
        this.numberOfCars=0;
        this.carLoaded=false;
        this.loadedCarBrains;
        this.positionX;
        this.positionY;
        this.deviation;
        this.pctSelection;
    }



    draw() {
        for(var i=0;i<this.numberOfCars;i++){
            this.carsArray[i].draw()
        }
    }

    update(keys){ //update nam returna FALSE, kadar se vsi avti zabijejo ali izteče čas avtu.(ko postane drivable=false)
        var disabedCars=0;
        for(var i=0;i<this.numberOfCars;i++){
            this.carsArray[i].update(keys)
            if (this.carsArray[i].drivable==false)disabedCars++;
       }
       if (disabedCars>=this.numberOfCars) this.nextGeneration(this.pctSelection,this.deviation);

    }

    createCar(position,angle,drivable){
        var tmpPos=new Vector2D(position.X,position.Y)
        var createdObj=new Car(this.gameObject,tmpPos, angle, drivable,this.bestBrainsArray[this.carIndex]);
        this.carsArray[this.carIndex] = createdObj
        this.carIndex++;
        return createdObj;
    }

    spawnCars(position){ //spawnamo število avtov
        for(var i=0;i<this.numberOfCars;i++){
        this.createCar(position, 0, true)
        }
    }

    firstGeneration(position, numberOfCars,pctSelection,deviation){ //inicializiramo prvo generacijo
        this.numberOfCars = numberOfCars
        this.positionX=position.X
        this.pctSelection=pctSelection
        this.deviation=deviation
        this.positionY=position.Y
        this.spawnCars(position, numberOfCars);
    }

    nextGeneration( pctSelection, deviation){

        //dobimo braine o prvih SELECTION najboljsih  avtov. 
    var selection = Math.ceil(this.numberOfCars*pctSelection/100)
    var bestCarBrains=[]
    var currentBestCar;
    for (var i=0;i<selection;i++){
         var bestCarScore=-Infinity;
        for(var car of this.carsArray){
            if (car.score> bestCarScore){
                bestCarScore=car.score;
                bestCarBrains[i]=car.brains.copy();
                currentBestCar=car;
            }
        }
        for(var car of this.carsArray){
          if((Vector2D.distance(car.position, currentBestCar.position) < currentBestCar.size.Y)) car.score = -Infinity; //izvzemi ven tiste ki so nagručeni
        }
    if((typeof bestCarBrains[i]!=='object')){bestCarBrains[i]=bestCarBrains[0].copy();}//če zmanjka unkiatnih avtov, se zapolnejo z taprvimi najboljšimi
 //s izkljucimo prvega najboljsega vn. in tako dalje da bo naslednji v arrayu bil drugi najboljši.
    }
  

    this.bestBrainsArray=[];
    for(var i=selection;i<this.numberOfCars;i++){
    var tmpBestCarBrains=bestCarBrains[i%selection].copy(); // tukaj izmed selekcije izberemo in jih zmutiramo (narejeno da se ekvivalentno reproducirajo)
    tmpBestCarBrains.mutate(1, deviation);
    this.bestBrainsArray[i]=tmpBestCarBrains;
    }

   for(var i=0;i<selection;i++){
     this.bestBrainsArray[i]=bestCarBrains[i].copy(); //da ševedno ohranimo ta prvih SELECTION  najbočših ce so drugi slabsi.
        }    
   
    if(this.carLoaded){
    this.bestBrainsArray[0]=this.loadedCarBrains;
    this.carLoaded=false;

    }
    this.carsArray=[];
    this.carIndex=0;
    this.spawnCars(new Vector2D(this.positionX,this.positionY),this.numberOfCars);

     if (this.numberOfCars)this.gameObject.numberOfGenerations++;
     if(this.gameObject.numberOfGenerations%50==0 && this.numberOfCars)this.gameObject.parkingspot.position= new Vector2D(Math.ceil(Math.random()*canvasWidth),Math.ceil(Math.random()*canvasHeight))

    }
    
    saveBestCar(){
    return this.bestBrainsArray[0].copy();


    }

    loadBestCar(filedata){
        this.loadedCarBrains=filedata
        this.carLoaded=true;
    }


}