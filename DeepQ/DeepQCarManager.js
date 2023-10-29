class DeepQCarManager{
    constructor(gameObject){
        this.carsArray=[];
        this.bestBrainsArray=[];
        this.carIndex=0;
        this.gameObject=gameObject
        this.numberOfCars=0;
        this.carLoaded=false;
        this.loadedCarBrains;
        this.positionX
        this.positionY
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
       if (disabedCars>=this.numberOfCars) this.newEpisodeOneDQ();
       
    }

    createCar(position,angle,drivable){
        var tmpPos=new Vector2D(position.X,position.Y)
        var createdObj=new DeepQCar(this.gameObject,tmpPos, angle, drivable);
        if(this.bestBrainsArray.length>0){createdObj.brains.paste(...this.bestBrainsArray[this.carIndex]);}
        this.carsArray[this.carIndex] = createdObj
        this.carIndex++;
        return createdObj;
    }

    spawnCars(position){ //spawnamo število avtov
        for(var i=0;i<this.numberOfCars;i++){
        this.createCar(position, 0, true)
        }
    }


    firstEpisode(position,carnumber){
    this.carsArray=[];
        this.numberOfCars=carnumber
        this.positionX=position.X;
        this.positionY=position.Y;
        this.spawnCars(new Vector2D(this.positionX,this.positionY))
    }

    newEpisode(){
        this.bestBrainsArray=[]
        for(var i =0;i<this.numberOfCars;i++){
            this.bestBrainsArray[i]=this.carsArray[i].brains.copy()
        }

        if(this.carLoaded){

            this.bestBrainsArray[0]=this.loadedCarBrains;
            this.carLoaded=false;
        }

        this.carsArray=[]
        this.carIndex=0;
        this.spawnCars(new Vector2D(this.positionX,this.positionY))
        if (this.numberOfCars)this.gameObject.numberOfEpisodes++;

    }

    newEpisodeOneDQ(){

 
        if(this.carLoaded){

            this.bestBrainsArray[0]=this.loadedCarBrains;
            this.carLoaded=false;
        }
        for(var i=0;i<this.carsArray.length;i++){
        this.carsArray[i].position=new Vector2D(this.positionX,this.positionY)
        this.carsArray[i].collided=false;
        this.carsArray[i].done=false;
        this.carsArray[i].drivable = true;
        this.carsArray[i].currentReward=0;
        this.carsArray[i].brains.currentStep=0;
        }
        
        if (this.numberOfCars)this.gameObject.numberOfEpisodes++;

    }
    saveBestQCar(){
   return this.bestBrainsArray[0];
    }

    loadBestQCar(filedata){
        this.loadedCarBrains=JSON.parse(filedata)
        this.loadedCarBrains[0]=NeuralNetwork_FF.deserialize(this.loadedCarBrains[0])
        this.loadedCarBrains[1]=NeuralNetwork_FF.deserialize(this.loadedCarBrains[1])
        this.carLoaded=true;
    }


}