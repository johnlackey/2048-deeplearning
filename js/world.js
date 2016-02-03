function World() {
  this.agents = [];
  //this.W = canvas.width;
  //this.H = canvas.height;
  this.keyContainer   = document.querySelector(".key-container");
  
  this.clock = 0;
  
  // set up walls in the world
  //this.walls = []; 
  //var pad = 10;
  //util_add_box(this.walls, pad, pad, this.W-pad*2, this.H-pad*2);
  //util_add_box(this.walls, 100, 100, 200, 300); // inner walls
  //this.walls.pop();
  //util_add_box(this.walls, 400, 100, 200, 300);
  //this.walls.pop();
  
  // set up food and poison
  //this.items = []
  //for(var k=0;k<30;k++) {
  //  var x = convnetjs.randf(20, this.W-20);
  //  var y = convnetjs.randf(20, this.H-20);
  //  var t = convnetjs.randi(1, 3); // food or poison (1 and 2)
  //  var it = new Item(x, y, t);
  //  this.items.push(it);
  //}
}
    
World.prototype = {      
  // helper function to get closest colliding walls/items
  stuff_collide_: function(p1, p2, check_walls, check_items) {
    var minres = false;
    
    // collide with walls
    if(check_walls) {
      for(var i=0,n=this.walls.length;i<n;i++) {
        var wall = this.walls[i];
        var res = line_intersect(p1, p2, wall.p1, wall.p2);
        if(res) {
          res.type = 0; // 0 is wall
          if(!minres) { minres=res; }
          else {
            // check if its closer
            if(res.ua < minres.ua) {
              // if yes replace it
              minres = res;
            }
          }
        }
      }
    }
    
    // collide with items
    if(check_items) {
      for(var i=0,n=this.items.length;i<n;i++) {
        var it = this.items[i];
        var res = line_point_intersect(p1, p2, it.p, it.rad);
        if(res) {
          res.type = it.type; // store type of item
          if(!minres) { minres=res; }
          else { if(res.ua < minres.ua) { minres = res; }
          }
        }
      }
    }
    
    return minres;
  },
  tick: function() {
    // tick the environment
    this.clock++;
    
    // fix input to all agents based on environment
    // process eyes
    this.collpoints = [];
    for(var i=0,n=this.agents.length;i<n;i++) {
      var a = this.agents[i];
      //for(var ei=0,ne=a.eyes.length;ei<ne;ei++) {
      //  var e = a.eyes[ei];
      //  // we have a line from p to p->eyep
      //  var eyep = new Vec(a.p.x + e.max_range * Math.sin(a.angle + e.angle),
      //                     a.p.y + e.max_range * Math.cos(a.angle + e.angle));
      //  var res = this.stuff_collide_(a.p, eyep, true, true);
      //  if(res) {
      //    // eye collided with wall
      //    e.sensed_proximity = res.up.dist_from(a.p);
      //    e.sensed_type = res.type;
      //  } else {
      //    e.sensed_proximity = e.max_range;
      //    e.sensed_type = -1;
      //  }
      //}
    }
    
    // let the agents behave in the world based on their input
    for(var i=0,n=this.agents.length;i<n;i++) {
      this.agents[i].forward();
    }
    
    // apply outputs of agents on evironment
    for(var i=0,n=this.agents.length;i<n;i++) {
      var a = this.agents[i];
      var key = a.key;
      this.keyContainer.textContent = key;
      keyboardInputManager.emit('move', a.actionix);
      //var keyCode = key ? key.charCodeAt(0) : 0;
      //var keyEvent = new KeyboardEvent("keydown", {key: 'U+0041', char : 'a', shiftKey: false});
      //document.dispatchEvent(keyEvent);
      //var event = document.createEvent( 'KeyboardEvent' );
      //event.initKeyboardEvent( 'keydown', true, false, null, 0, false, 0, false, 65, 0 );
      //document.dispatchEvent( event );      //a.op = a.p; // back up old position
      //a.oangle = a.angle; // and angle
      
      // steer the agent according to outputs of wheel velocities
      //var v = new Vec(0, a.rad / 2.0);
      //v = v.rotate(a.angle + Math.PI/2);
      //var w1p = a.p.add(v); // positions of wheel 1 and 2
      //var w2p = a.p.sub(v);
      //var vv = a.p.sub(w2p);
      //vv = vv.rotate(-a.rot1);
      //var vv2 = a.p.sub(w1p);
      //vv2 = vv2.rotate(a.rot2);
      //var np = w2p.add(vv);
      //np.scale(0.5);
      //var np2 = w1p.add(vv2);
      //np2.scale(0.5);
      //a.p = np.add(np2);
      
      //a.angle -= a.rot1;
      //if(a.angle<0)a.angle+=2*Math.PI;
      //a.angle += a.rot2;
      //if(a.angle>2*Math.PI)a.angle-=2*Math.PI;
      
      // agent is trying to move from p to op. Check walls
      //var res = this.stuff_collide_(a.op, a.p, true, false);
      //if(res) {
        // wall collision! reset position
      //  a.p = a.op;
      //}
      
      // handle boundary conditions
      //if(a.p.x<0)a.p.x=0;
      //if(a.p.x>this.W)a.p.x=this.W;
      //if(a.p.y<0)a.p.y=0;
      //if(a.p.y>this.H)a.p.y=this.H;
    }
    
    // tick all items
    //var update_items = false;
    //for(var i=0,n=this.items.length;i<n;i++) {
    //  var it = this.items[i];
    //  it.age += 1;
    //  
    //  // see if some agent gets lunch
    //  for(var j=0,m=this.agents.length;j<m;j++) {
    //    var a = this.agents[j];
    //    var d = a.p.dist_from(it.p);
    //    if(d < it.rad + a.rad) {
    //      
    //      // wait lets just make sure that this isn't through a wall
    //      var rescheck = this.stuff_collide_(a.p, it.p, true, false);
    //      if(!rescheck) { 
    //        // ding! nom nom nom
    //        if(it.type === 1) a.digestion_signal += 5.0; // mmm delicious apple
    //        if(it.type === 2) a.digestion_signal += -6.0; // ewww poison
    //        it.cleanup_ = true;
    //        update_items = true;
    //        break; // break out of loop, item was consumed
    //      }
    //    }
    //  }
    //  
    //  if(it.age > 5000 && this.clock % 100 === 0 && convnetjs.randf(0,1)<0.1) {
    //    it.cleanup_ = true; // replace this one, has been around too long
    //    update_items = true;
    //  }
    //}
    //if(update_items) {
    //  var nt = [];
    //  for(var i=0,n=this.items.length;i<n;i++) {
    //    var it = this.items[i];
    //    if(!it.cleanup_) nt.push(it);
    //  }
    //  this.items = nt; // swap
    //}
    //if(this.items.length < 30 && this.clock % 10 === 0 && convnetjs.randf(0,1)<0.25) {
    //  var newitx = convnetjs.randf(20, this.W-20);
    //  var newity = convnetjs.randf(20, this.H-20);
    //  var newitt = convnetjs.randi(1, 3); // food or poison (1 and 2)
    //  var newit = new Item(newitx, newity, newitt);
    //  this.items.push(newit);
    //}
    //
    // agents are given the opportunity to learn based on feedback of their action on environment
    for(var i=0,n=this.agents.length;i<n;i++) {
      this.agents[i].backward();
    }
  }
}
