class DeepQBrains{
 /**
     * @param {instance, DeepQAgent} carObject instance of car. 
     * @param {int} carINputs number of sensors/inputs.
     * @param {int} carActions array of car actions.
     */    

constructor(carObject,carInputs,carActions){

this.learningRate=0.1; 
this.exploration=1;
this.minExploration=0.01;
this.decay=0.01
this.discount=0.999
////////////////////////
this.currentStep=0;
this.actionslength=carActions;

//////////////////////
this.policyNetwork= new NeuralNetwork_FF(carInputs,50,carActions,this.learningRate);
this.targetNetwork= this.policyNetwork.copy();
this.updateTargetCount=0;
this.updateTargetAt=3;
/////////////////////
this.replayMemoryCapacity=50000;
this.replayMemoryCapacityBorder=10;
this.replayMmemory=[]
this.miniBatchSize=32;
this.replayMmemoryCount=0;

this.carObject=carObject;

}


getAction(state){
var action;
if(Math.random() <= this.exploration){
//console.log(this.exploration)
var actionNumber=Math.random()*this.actionslength
if (actionNumber==this.actionslength) actionNumber=this.actionslength-1;
action= Math.floor(actionNumber);
}
else{
var qStates=Matrix.transpose(this.policyNetwork.predict(state));
qStates=qStates.data
var indexOfMaxVal=indexOfMax(...qStates)
action=indexOfMaxVal;
//console.log(...qStates)
//console.log(this.exploration*100+" action "+action)

}
this.currentStep++;
return action;
}

// CURRENT Q VALUES  FUTURE Q VALUES MORAS PREUREDIT DA BO ARRAY

train(lastState){

var miniBatch =this.getMemorySample()

if(!miniBatch){return};//če ni dovolj velik batch, ne treniraj.
var currentStates=miniBatch.map(function(value,i){return value.state}) //dobimo vse predhodne state iz batch memory
var currentQValues=this.policyNetwork.predictArray(currentStates); //dobimo predvidevane q valute glede na te state
var newStates=miniBatch.map(function(value,i){return value.next_state}) //dobimo trenutne state iz batch memory
var futureQValues=this.targetNetwork.predictArray(newStates);  //dobimo predvidene values iz target networka

var X=[]
var Y=[]

var len=miniBatch.length;
for (var i=0;i<len;i++){
	var newQ;
	if(!miniBatch[i].done){
		var max_future_q=Math.max(...futureQValues[i])
		newQ=miniBatch[i].reward+this.discount*max_future_q
	}	
	else{
	newQ=miniBatch[i].reward;
	}

	var currentQs=currentQValues[i]; //preveri ali je to list ali kaj, da lahko vstavim pod določen action, določeno value
	currentQs[miniBatch[i].action]=newQ;
	X.push(miniBatch[i].state)
	Y.push(currentQs)
}
this.policyNetwork.trainBatch(X,Y)

if(lastState){
	this.updateTargetCount++;
	if(this.exploration>this.minExploration)this.exploration*=(1-this.decay);

	
}
if (this.updateTargetCount>=this.updateTargetAt){

this.targetNetwork=this.policyNetwork.copy()
this.updateTargetCount=0;

}


}

/////////////////////////////////////////////////


addToMemory(...expiriences){
var expirience=new Expirience(...expiriences)
this.replayMmemory[this.replayMmemoryCount]=expirience
this.replayMmemoryCount++;
if (this.replayMmemoryCount>=this.replayMemoryCapacity)this.replayMmemoryCount=this.replayMemoryCapacityBorder;
}


getMemorySample(){
if(this.replayMmemory.length>=this.miniBatchSize){
var miniBatch=[]
for(var i=0;i<this.miniBatchSize;i++){
miniBatch.push(this.replayMmemory[Math.floor(Math.random()*this.replayMmemory.length)])
}
return miniBatch
}
else return false;  
}

copy(){
var arr=[this.policyNetwork.copy(),this.targetNetwork.copy(),JSON.parse(JSON.stringify(this.replayMmemory)),this.updateTargetCount,this.exploration,this.replayMmemoryCount,this.memoryCapacity]
return arr
}

paste(policyNetwork,targetNetwork,memory,updateTargetCount,exploration,replayMmemoryCount,memoryCapacity){

this.policyNetwork=policyNetwork.copy()
this.targetNetwork=targetNetwork.copy()

this.replayMmemory=memory
this.updateTargetCount=updateTargetCount;
this.exploration=exploration;
this.replayMmemoryCount=replayMmemoryCount
this.replayMemoryCapacity=memoryCapacity

}

}







function Expirience(state,action,next_state,reward,done){
this.state=state;
this.action=action;
this.next_state=next_state;
this.reward=reward;
this.done=done;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
