class Boat {
  constructor(x, y, width, height, boatPos, boatimages) {
    this.body = Bodies.rectangle(x, y, width, height);
    this.width = width;
    this.height = height;

    
    this.boatPosition = boatPos;
    this.boatimages = boatimages;
    World.add(world, this.body);
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    
  
    var index = random([0,1,2,3]);
   
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.boatimages[index], 0, this.boatPosition, this.width, this.height);
    pop();
  }
  remove(index) {
    //this.boatimages = brokenboatimages;
    setTimeout(() => {
      Matter.World.remove(world, boats[index].body);
      delete boats[index];
    }, 1000);
  }
}
