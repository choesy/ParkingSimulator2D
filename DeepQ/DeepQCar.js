class DeepQCar extends CollidableSprite {

    constructor(gameObject, position, angle, drivable,){
        super(position, 'rect', new Vector2D(40, 20), angle);
        this.gameObject=gameObject
        this.objName="car"

        this.drivable = drivable;
        this.collided=false;
        this.angle_power = 0;
        this.angle_max_power = 5;
        this.velocity = Vector2D.zeros();
        this.car_direction = Vector2D.zeros();
        this.rotating=0 // -1 left, 1 right
        this.gear = 0;  // -1=reverse, 0=neutral, 1=forward
        this.acceleration = 0.5
        this.friction = 0.05
        this.brakeFriction=1;
        this.speed = 0;
        this.maxspeed = 6;
        // for testing ->
        this.color = 'blue';

        this.prevPosition=new Vector2D(this.position.X,this.position.Y)
        
        this.pressedKey;
        this.senzors = new Senzors(gameObject, this, position, 100, angle)
        this.timeToCheck = 30*30//  sekund
        this.prevDistance=Vector2D.distance(this.position, this.gameObject.parkingspot.position)/canvasMaxPossibileDistance;;
        this.gameFrameCounter=0;
        this.brainsTimestapmArray=[];
        this.action=0;
        this.observation=this.getObservation();
        this.newObservation;
        this.done=false;
        this.currentReward=0;
        this.brains = new DeepQBrains(this,19,6);
        /*
        inputs: objekt na levo,desno,spredaj,zadaj in razdalja do najblizjega prostega parking spota.
        outputs: naprej nazaj levo desno stop
*/
this.totalScore=0;
    }

 
    getObservation(){
   	var Xdistance=(this.gameObject.parkingspot.position.X-this.position.X)/canvasWidth;
    var Ydistance=(this.gameObject.parkingspot.position.Y-this.position.Y)/canvasHeight; 
    var sendArr=[
            this.angle/360,
            Xdistance,
            Ydistance,
            this.senzors.inter_array[0][0],
            this.senzors.inter_array[1][0],
            this.senzors.inter_array[2][0],
            this.senzors.inter_array[3][0],
            this.senzors.inter_array[4][0],
            this.senzors.inter_array[5][0],
            this.senzors.inter_array[6][0],
            this.senzors.inter_array[7][0],
            this.senzors.inter_array[0][1],
            this.senzors.inter_array[1][1],
            this.senzors.inter_array[2][1],
            this.senzors.inter_array[3][1],
            this.senzors.inter_array[4][1],
            this.senzors.inter_array[5][1],
            this.senzors.inter_array[6][1],
            this.senzors.inter_array[7][1],]

           // console.log(sendArr)
    return sendArr


    }

    think(keyss){
     

        var output = this.brains.getAction(this.observation);
  
        this.action=output;
        if(keyss["ArrowDown"]>0)this.action=0;
         if(keyss["ArrowLeft"]>0)this.action=2;
          if(keyss["ArrowRight"]>0)this.action=3;
           if(keyss["ArrowUp"]>0)this.action=1;

        var keys = {}
        switch (this.action){
        	case 0: keys['ArrowDown']=true;break;
       		case 1: keys['ArrowUp'] = true;break;
       		case 2: keys['ArrowUp'] = true;keys['ArrowLeft']=true;;break;
       		case 3: keys['ArrowUp'] = true;keys['ArrowRight']=true; break;
       		case 4: keys['ArrowDown'] = true;keys['ArrowLeft']=true;break;
       		case 5: keys['ArrowDown'] = true;keys['ArrowRight']=true;break;
           
    	}

    this.pressedKey=keys;
    this.newObservation=this.getObservation();
    }


    draw() {
        if(!this.drivable)return;

        push();
        fill(this.color);
        stroke('black');   
        translate(this.position.X, this.position.Y);
        rotate(this.angle)
        rect(0,0, this.size.X, this.size.Y);
        noFill();
        pop();
        this.senzors.draw();
    }

    update(keys){
    
        if(!this.drivable)return;
        if(!(this.gameFrameCounter%10))this.think(keys);
        
        this.carUpdate(this.pressedKey); //določi se reward
        if(!(this.gameFrameCounter%10)||this.done){this.brainUpdate();}//reward se samodejno notri vkljucu
        this.gameFrameCounter++;

       
       
    }

    carUpdate(keys){

  
        this.updateScore();
        this.adjustSteerPower();
        this.move(keys);
        this.setCarDirection(); 
        this.velocity = new Vector2D(this.car_direction.X, this.car_direction.Y);
        this.position.add(this.velocity);
        this.color = 'blue';
        this.checkCollision();   
        this.drivable=!this.done
        //console.log(this.currentReward)
        this.totalScore+=this.currentReward;
 

    }

    brainUpdate(){
    
    if (this.observation)this.brains.addToMemory(this.observation,this.action,this.newObservation,this.currentReward,this.done);
    this.brains.train(this.done); 
    if(this.done){this.gameObject.scoreArray.push(this.totalScore);this.totalScore=0;}
    this.observation=this.newObservation.slice();


    }

    move(keys){   
        if(keys['Spacebar']){
            this.brake();
            return;
        }
            
        if(keys['ArrowDown'])
            this.moveBack();
        else if(keys['ArrowUp'])
            this.moveOn();
        else 
            this.decelerate();

        if(this.collided) return;
        if(keys['ArrowLeft'])
            this.moveLeft();
        else if(keys['ArrowRight'])
            this.moveRight();
        else
            this.rotating = 0;
    }
    moveLeft(){
        if(math.abs(this.speed) > 0){
        	this.rotating=-1
            switch(this.gear){
            	
                case 1: this.angle-=this.angle_power; break;
                case -1: this.angle+=this.angle_power; break;
            }
        }
    }
    moveRight(){
        if(math.abs(this.speed) > 0){
        	this.rotating=1
            switch(this.gear){

                case 1: this.angle+=this.angle_power; break;
                case -1: this.angle-=this.angle_power; break;
            }
        }
    }
    moveOn(){
        this.speed += this.acceleration;
        if (this.speed >= this.maxspeed) this.speed = this.maxspeed;
        this.gear = 1;
    }
    moveBack(){
        this.speed -= this.acceleration;
        if (this.speed <= -this.maxspeed) this.speed = -this.maxspeed;
        this.gear = -1;
    }
    
    setCarDirection(){
        var a = math.cos(math.unit(this.angle, 'deg')) * Math.sign(this.speed) * this.speed;
        var b = math.sin(math.unit(this.angle, 'deg')) * this.speed;
        if(Math.sign(this.speed) < 0)  a *= -1;

        this.car_direction = new Vector2D(a, b);
    }

    decelerate(){
        if (this.speed > 0)
            this.speed -= this.friction;
        else if(this.speed<0)
            this.speed += this.friction;

        if(math.abs(this.speed) <= this.friction)
            this.speed = 0;
    }

    brake(){
        if (this.speed > 0){
            this.speed -= this.brakeFriction;
                 }
         else if(this.speed<0){
            this.speed += this.brakeFriction;
         }
        if(math.abs(this.speed) <= this.friction)
            this.speed = 0;
    }

    adjustSteerPower(){
        this.angle_power = this.angle_max_power * (1-math.exp(-2*math.abs(this.speed) / this.maxspeed));
    }


    checkCollision(){
        this.collided=false
        super.setCollider()
        this.senzors.update(this.position, this.angle);
        this.senzors.checkCollision();

        // malo optimizacije dokler ne nardim quadThree-ja 
        if(this.senzors.getSum()> 0){
            this.checkCollisionWithOne(this.gameObject.WallManager.wallsArray); //za zide
        
        }
           this.checkCollisionWithOne(this.gameObject.ParkingspotManager.parkingspotsArray); //za parking spote
    }



    checkCollisionWithOne(colliders){
        var len=colliders.length;
        for(var i=0; i<len;i++){
        	colliders[i].collision(this)

        }
    }

    collisionEvent(withObj){
      
    	this.collided=true;
        this.color="white"

        if(withObj.objName=="wall"){
  		this.stop();
        this.done=true;
        this.currentReward-=5000;
        }


        if(withObj.objName=="parkingspot"){
        this.done=true;
        this.currentReward+=50000;
        }
    }

    stop(){
        this.drivable = false;
    	this.speed = 0;
        this.velocity = Vector2D.zeros();
    }

    updateScore(){
    
  	var distance = Vector2D.distance(this.position, this.gameObject.parkingspot.position)/canvasMaxPossibileDistance;
   
    //if((this.prevDistance-distance)==0)this.currentReward=-1000;
    //this.currentReward+=(1-distance)*0.001
    this.currentReward += (this.prevDistance-distance)*0.5;
   this.prevDistance=Vector2D.distance(this.position, this.gameObject.parkingspot.position)/canvasMaxPossibileDistance;
   // this.drivenDistance+=math.abs(this.speed);

    if(!((this.gameFrameCounter+1)%this.timeToCheck)){
        //this.done=true

		//if((this.drivenDistance-this.prevDrivenDistance)<math.abs(this.maxspeed*this.timeToCheck/8)){this.drivable=false;}
		//this.prevDrivenDistance=this.drivenDistance;   	

		//if(Vector2D.distance(this.position,this.prevPosition)<math.abs(this.maxspeed*this.timeToCheck/8)){this.done=true;} 	
		//this.prevPosition= new Vector2D(this.position.X,this.position.Y);


    }
  
    }
}