class DeepQBrains{
 /**
     * @param {instance, DeepQAgent} carObject instance of car. 
     * @param {int} carINputs number of sensors/inputs.
     * @param {int} carActions array of car actions.
     */    

constructor(carObject,carInputs,carActions){

this.learningRate=0.3; //še za implementirat
this.exploration=1;
this.minExploration=0.02;
this.decay=0.003
this.discount=0.85
////////////////////////
this.currentStep=0;
this.actionslength=carActions

//////////////////////
this.policyNetwork= new NeuralNetwork_FF(carInputs,100,carActions,this.learningRate);
this.targetNetwork= this.policyNetwork.copy();
this.updateTargetCount=0;
this.updateTargetAt=4;
/////////////////////
this.replayMemoryCapacity=30000;
this.replayMmemory=[]
this.miniBatchSize=64;
this.replayMmemoryCount=0;

this.carObject=carObject;

}


getAction(state){
var action;
if((Math.random() <= this.exploration)||state==null){

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

this.targetNetwork=this.policyNetwork.copy();
this.updateTargetCount=0;

}


}

/////////////////////////////////////////////////


addToMemory(...expiriences){
var expirience=new Expirience(...expiriences)
this.replayMmemory[this.replayMmemoryCount]=expirience
this.replayMmemoryCount++;
if (this.replayMmemoryCount>=this.replayMemoryCapacity)this.replayMmemoryCount=0;
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

class SumTree{
constructor(capacity){
this.capacity=capacity
this.tree=new Array(2*capacity-1).fill(0)
this.data=new Array(capacity).fill(0)
this.dataPointer=0;
}

add(priority,data){
var treeIndex=this.dataPointer+this.capacity-1
this.data[this.dataPointer]=data;
this.update(treeIndex,priority);
this.dataPointer++;
if (this.dataPointer>=this.capacity)this.dataPointer=0;
}

update(treeIndex,priority){
var change= priority-this.tree[treeIndex];
this.tree[treeIndex]=priority;
while (treeIndex !=0){
	treeIndex=Math.floor((treeIndex-1)/2)
	this.tree[treeIndex]+=change;
	}
}

get_leaf(v){
var parentIndex=0

while(true){
var left_child_index=2*parentIndex+1
var right_child_index=left_child_index+1
if(left_child_index>=this.tree.length) parentIndex=left_child_index;
else {v-=this.tree[left_child_index];parentIndex=right_child_index;}
	}

var dataIndex=leafIndex-this.capacity+1;

return {index:leafIndex,priority:this.tree[leafIndex],data:this.data[dataIndex]}

}

totalPriority(){
return this.tree[0];
}
}

class Memory{
constructor(capacity){


this.PER_e=0.01;
this.PER_a=0.6;
this.PER_b=0.4;
this.PER_b_inc=0.001;
this.absErrorUpper=1;

this.tree=SumTree(capacity)

}

store(...expiriences){
var expirience=new Expirience(...expiriences)
var maxPriority=Math.max(...this.tree.tree)
var b_idx=new Array(n).fill(0);
var b_ISWeights=new Array(n).fill(0);

if(maxPriority==0) maxPriority=this.errorUpper;
this.tree.add(maxPriority,expirience)
}

sample(n){
var miniBatch=[];
var prioritySegment=this.tree.totalPriority()/n;

this.PER_b=Math.min(1,this.PER_b+this.PER_b_inc)
var p_min=Math.min(...this.tree.tree)
var max_weight = Math.pow((p_min*n),-self.PER_b)
for(i=0;i<n;i++){
	var a=prioritySegment*i;
	var b=prioritySegment*(i+1);
	var tmpMax=Math.min(a,b)
	var tmpMin=Math.min(a,b)
	var value=tmpMin+Math.random()*tmpMax;
	var leaf=this.tree.get_leaf(value)
	var index=leaf.index;
	var priority=leaf.priority;
	var data =leaf.data;

	var sample_probability=priority/this.tree.totalPriority();
	b_ISWeights[i]=Math.pow(n*sample_probability,-this.PER_b)/max_weight;
	b_idx[i]=index;
	miniBatch.push(data)
	}
return {id:b_idx,data:miniBatch,weights:b_ISWeights}
}

batchUpdate(treeIdx,abs_errors){
abs_errors+=this.PER_e
var clippedErrors=Math.min(abs_errors,this.absErrorUpper);
var ps= Math.pow(clippedErrors,this.PER_a)
for(var i=0;;i++){
	this.tree.update(treeIndex,priority)
	}

}

}