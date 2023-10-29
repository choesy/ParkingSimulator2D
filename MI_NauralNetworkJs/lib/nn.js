function sigmoid (x) {
    return 1 / (1 + Math.exp(-x));
}
function linear(x) {
    return x
}
function derivative_sigmoid (y) {
    //return sigmoid(x) * (1 - sigmoid(x));
    return y * (1 - y);
}

function calculateGradients(matrix, func, errors, learning_rate){
    var gradients = Matrix.map(matrix, func);
    gradients.multiply(errors);
    gradients.multiply(learning_rate);
    return gradients;
}

function calculateDeltas(gradients, weights){
    return Matrix.multiply(gradients, Matrix.transpose(weights));
}


/**
 * Class for creating and using neural network (feedforward)
 */
class NeuralNetwork_FF {

    /**
     * @param {int, NeuralNetwork_FF} input_nodes number of input nodes or neural network. 
     * @param {int} hidden_nodes number of hiddent nodes.
     * @param {int} output_nodes number of output nodes.
     */    
    constructor (input_nodes, hidden_nodes, output_nodes, learning_rate) {
        if (input_nodes instanceof NeuralNetwork_FF) {
            var network = input_nodes;
            this.input_nodes = network.input_nodes;
            this.hidden_nodes = network.hidden_nodes;
            this.output_nodes = network.output_nodes;
            this.learning_rate=network.learning_rate;
      
            this.weights_ih = network.weights_ih.copy();
            this.weights_ho = network.weights_ho.copy();
      
            this.bias_hidden = network.bias_hidden.copy();
            this.bias_output = network.bias_output.copy();

               

        }
        else{
            this.input_nodes = input_nodes;
            this.hidden_nodes = hidden_nodes;
            this.output_nodes = output_nodes; 
     
            this.learning_rate = learning_rate;
     
            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();
     
            this.bias_hidden = new Matrix(this.hidden_nodes, 1);
            this.bias_output = new Matrix(this.output_nodes, 1);
            this.bias_hidden.randomize();
            this.bias_output.randomize();


        }
     
    }

    predict(input_raw){
        return this.feedforward(input_raw).output;
    }
    predictArray(inputArray){
        var outArray=[]
        var len =inputArray.length
        for(var i=0;i<len;i++){
        var tmp=Matrix.transpose(this.feedforward(inputArray[i]).output)
        outArray[i]=tmp.data[0];
        }
        return outArray
    }



    feedforward (input_raw) {
        // make matrix from input
        var inputs = Matrix.fromArray(input_raw); 

        // Generate the hidden outputs
        var hidden = Matrix.multiply(this.weights_ih, inputs); // matrix multiplication    
        hidden.add(this.bias_hidden);                          // add bias of hidden nodes        
        hidden.map(sigmoid);                                   // activation function (sigmoid)

        // Generate output
        var outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_output);
        //outputs.map(sigmoid);
        

        return {hidden: hidden, output: outputs};
    }

  trainArray(X,Y){
    var len =X.length;

    for(var i=0;i<len;i++){

        this.train(X[i],Y[i])
    }
  }

    train (inputs, targets_raw) {
        // predict
        var output = this.feedforward(inputs);
        var hidden = output.hidden;
        var outputs = output.output;
        var targets = Matrix.fromArray(targets_raw);
        targets.map(sigmoid);
        outputs.map(sigmoid);

        // calculate output gradients
        var output_errors = Matrix.subtract(targets, outputs);
        var output_gradients = calculateGradients(outputs, derivative_sigmoid, output_errors, this.learning_rate);

        // adjust the weights by deltas
        var ho_deltas = calculateDeltas(output_gradients, hidden);

        this.weights_ho.add(ho_deltas);
           
        // calculate hidden layer gradients
        var weight_hoT = Matrix.transpose(this.weights_ho);
        var hidden_errors = Matrix.multiply(weight_hoT, output_errors);
        var hidden_gradients = calculateGradients(hidden, derivative_sigmoid, hidden_errors, this.learning_rate);
       
        // adjust the weights by deltas
        var ih_deltas = calculateDeltas(hidden_gradients, Matrix.fromArray(inputs));
        this.weights_ih.add(ih_deltas);

        // adjust the biases by gradients

        this.bias_output.add(output_gradients);
        this.bias_hidden.add(hidden_gradients);
    }


    trainBatch (X, Y) {
        var updateto_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        var updateto_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        var updateto_bh = new Matrix(this.hidden_nodes, 1);
        var updateto_bo = new Matrix(this.output_nodes, 1);
        var len =X.length;
        for(var idx=0;idx<len;idx++)
        {
        var inputs=X[idx];
        var targets_raw=Y[idx]
        // predict
        var output = this.feedforward(inputs);
        var hidden = output.hidden;
        var outputs = output.output;
        var targets = Matrix.fromArray(targets_raw);
        targets.map(sigmoid);
        outputs.map(sigmoid);

        // calculate output gradients
        var output_errors = Matrix.subtract(targets, outputs);
        var output_gradients = calculateGradients(outputs, derivative_sigmoid, output_errors, this.learning_rate);

        // adjust the weights by deltas
        var ho_deltas = calculateDeltas(output_gradients, hidden);
        
        
        
       
        updateto_ho.add(ho_deltas);   
        // calculate hidden layer gradients
        var weight_hoT = Matrix.transpose(Matrix.adding(this.weights_ho,ho_deltas));
        var hidden_errors = Matrix.multiply(weight_hoT, output_errors);
        var hidden_gradients = calculateGradients(hidden, derivative_sigmoid, hidden_errors, this.learning_rate);
       
        // adjust the weights by deltas
        var ih_deltas = calculateDeltas(hidden_gradients, Matrix.fromArray(inputs));
    
        updateto_ih.add(ih_deltas);
        // adjust the biases by gradients

      
        updateto_bo.add(output_gradients);
        updateto_bh.add(hidden_gradients);
        }
        this.weights_ih.add(updateto_ih);
        this.bias_output.add(updateto_bo);
        this.bias_hidden.add(updateto_bh);
        this.weights_ho.add(ho_deltas)
    }















    copy() {
        return new NeuralNetwork_FF(this);
    }
    
    // Accept an arbitrary function for mutation
    mutate(rate,deviation) {
        function mutate(val){
            if(Math.random() <= rate) return val + randomGaussian(0,deviation);
            else return val;
        }
        this.weights_ih.map(mutate);
        this.weights_ho.map(mutate);
        this.bias_hidden.map(mutate);
        this.bias_output.map(mutate);
    }

    serialize(){
        return JSON.stringify(this);
    }

    static deserialize(data){
        if(typeof data =='string')data = JSON.parse(data);
   var nn= new NeuralNetwork_FF(data.input_nodes,data.hidden_nodes,data.output_nodes,data.learning_rate)
   nn.weights_ih=Matrix.deserialize(data.weights_ih)
    nn.weights_ho=Matrix.deserialize(data.weights_ho)
     nn.bias_hidden=Matrix.deserialize(data.bias_hidden)
      nn.bias_output=Matrix.deserialize(data.bias_output)
      nn.learning_rate=data.learning_rate;
      return nn;

}}