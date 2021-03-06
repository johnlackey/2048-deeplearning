// A single agent
function Agent() {

  // positional information
  //this.p = new Vec(50, 50);
  //this.op = this.p; // old position
  //this.angle = 0; // direction facing
  
  this.actions = [];
  this.actions.push('w');
  this.actions.push('d');
  this.actions.push('s');
  this.actions.push('a');
  
  // properties
  //this.rad = 10;
  //this.eyes = [];
  //for(var k=0;k<9;k++) { this.eyes.push(new Eye((k-3)*0.25)); }
  
  // braaain
  //this.brain = new deepqlearn.Brain(this.eyes.length * 3, this.actions.length);
  var spec = document.getElementById('qspec').value;
  eval(spec);
  this.brain = brain;
  
  this.reward_bonus = 0.0;
  this.digestion_signal = 0.0;
  
  // outputs on world
  this.key = ' '; // keypressed
  
  this.prevactionix = -1;
}
Agent.prototype = {
  forward: function() {
    // in forward pass the agent simply behaves in the environment
    // create input to brain
    //var num_eyes = this.eyes.length;
    //var input_array = new Array(num_eyes * 3);
    //for(var i=0;i<num_eyes;i++) {
    //  var e = this.eyes[i];
    //  input_array[i*3] = 1.0;
    //  input_array[i*3+1] = 1.0;
    //  input_array[i*3+2] = 1.0;
    //  if(e.sensed_type !== -1) {
    //    // sensed_type is 0 for wall, 1 for food and 2 for poison.
    //    // lets do a 1-of-k encoding into the input array
    //    input_array[i*3 + e.sensed_type] = e.sensed_proximity/e.max_range; // normalize to [0,1]
    //  }
    //}
    var input_array   = new Array(4 * 4);
    var tileContainer = document.querySelector(".tile-container");
    var tiles         = tileContainer.getElementsByClassName("tile");
    var num_tiles = tiles.length;
    for (var i=0;i<num_tiles;i++) {
      var x = tiles[i].getAttribute("px");
      var y = tiles[i].getAttribute("py");
      var value = tiles[i].textContent;
      input_array[x * 4 + y] = value;
    }
    // get action from brain
    var actionix = this.brain.forward(input_array);
    var action = this.actions[actionix];
    this.actionix = actionix; //back this up
    
    // demultiplex into behavior variables
    this.key = action;
    
    //this.rot1 = 0;
    //this.rot2 = 0;
  },
  backward: function() {
    // in backward pass agent learns.
    // compute reward 
    var proximity_reward = 0.0;
    var num_eyes = this.eyes.length;
    for(var i=0;i<num_eyes;i++) {
      var e = this.eyes[i];
      // agents dont like to see walls, especially up close
      proximity_reward += e.sensed_type === 0 ? e.sensed_proximity/e.max_range : 1.0;
    }
    proximity_reward = proximity_reward/num_eyes;
    proximity_reward = Math.min(1.0, proximity_reward * 2);
    
    // agents like to go straight forward
    var forward_reward = 0.0;
    if(this.actionix === 0 && proximity_reward > 0.75) forward_reward = 0.1 * proximity_reward;
    
    // agents like to eat good things
    var digestion_reward = this.digestion_signal;
    this.digestion_signal = 0.0;
    
    var reward = proximity_reward + forward_reward + digestion_reward;
    
    // pass to brain for learning
    this.brain.backward(reward);
  }
}
