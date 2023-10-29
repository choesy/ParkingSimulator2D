class ParkingspotManager{
    constructor(gameObject){
        this.parkingspotsArray = [];
        this.parkingspotIndex = 0;
        this.gameObject=gameObject
    }


    createParkingspot(position, qadrant, occupied){
        var createdObj=new Parkingspot(this.gameObject,position, qadrant, occupied);
        this.parkingspotsArray[this.parkingspotIndex] =  createdObj
        this.parkingspotIndex++;
        return createdObj;
    }

    draw() {
        for(var spot of this.parkingspotsArray){
            spot.draw()
        }
    }

    update(){
        for(var spot of this.parkingspotsArray){
            spot.update()
        }
    }
}