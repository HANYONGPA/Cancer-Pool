let Shader;
let sourceGraphics, shaderGrapgics;
let span = 650;
function preload() {
  Shader = loadShader("shader.vert", "shader.frag");
}

let cell = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  sourceGraphics = createGraphics(canvasWidth, canvasHeight);
  shaderGrapgics = createGraphics(canvasWidth, canvasHeight, WEBGL);
  sourceGraphics.background(255);
  sourceGraphics.textStyle(BOLD);
  sourceGraphics.textSize(10);
  sourceGraphics.textAlign(CENTER, CENTER);
  sourceGraphics.rectMode(CENTER);
  sourceGraphics.noStroke();
  sourceGraphics.strokeCap(ROUND);
  sourceGraphics.pixelDensity(2);
  rectMode(CENTER);
  sourceGraphics.frameRate(60);
  sourceGraphics.strokeWeight(10);
  cell.push(new Cell(canvasWidth / 2, canvasHeight / 2, frameCount));
}

function draw() {
  sourceGraphics.background(255);
  sourceGraphics.noStroke();
  sourceGraphics.textSize(18);
  // for (let i = 0; i < width / 30; i++) {
  //   for (let j = 0; j < height / 30; j++) {
  //     sourceGraphics.fill(random(10,30),random(10,200),0, 80);
  //     let c = String.fromCharCode(random(33, 126));
  //     sourceGraphics.text(c, i * 30 + 10, j * 30 + 10);
  //   }
  // }
  sourceGraphics.drawingContext.shadowOffsetX = 0;
  sourceGraphics.drawingContext.shadowOffsetY = 30;
  sourceGraphics.drawingContext.shadowBlur = 80;
  sourceGraphics.drawingContext.shadowColor = "#888888";
  sourceGraphics.stroke(160);
  sourceGraphics.strokeWeight(1.0);
  sourceGraphics.fill(220);
  sourceGraphics.rect(canvasWidth / 2, 460, 545, 548, 10);
  sourceGraphics.drawingContext.shadowOffsetX = 0;
  sourceGraphics.drawingContext.shadowOffsetY = -0;
  sourceGraphics.drawingContext.shadowBlur = 0;
  sourceGraphics.drawingContext.shadowColor = "0";
  sourceGraphics.strokeWeight(0.3);
  //sourceGraphics.noStroke();
  sourceGraphics.fill(0);
  sourceGraphics.text("Cancer Pool.js", canvasWidth / 2, 202);
  sourceGraphics.fill(255, 40, 40, 200);
  sourceGraphics.ellipse(canvasWidth / 2 - 250, 201, 10, 10);
  sourceGraphics.fill(255, 205, 40, 200);
  sourceGraphics.ellipse(canvasWidth / 2 - 233, 201, 10, 10);
  sourceGraphics.fill(20, 200, 20, 220);
  sourceGraphics.ellipse(canvasWidth / 2 - 216, 201, 10, 10);
  sourceGraphics.stroke(160);
  sourceGraphics.strokeWeight(0.3);
  sourceGraphics.fill(255);
  sourceGraphics.textSize(60);
  sourceGraphics.rect(
    canvasWidth / 2,
    canvasHeight / 2,
    545,
    520,
    5,
    5,
    10,
    10
  );
  for (let i = 0; i < cell.length; i++) {
    if (
      frameCount % 1 === 0 &&
      cell[i].p.length < 25 &&
      cell[i].deathCount < 25
    ) {
      cell[i].generateParticle();
    }
    cell[i].display();
    cell[i].applyRepulsion();
    cell[i].deleteParticle();

    if (cell[i].divide || cell[i].cancerDivide) {
      let newCell = cell[i].divideCell();
      if (newCell) {
        cell.push(newCell);
      }
    }
  }
  shaderGrapgics.shader(Shader);
  Shader.setUniform("u_resolution", [
    canvasWidth / canvasWidth,
    canvasHeight / canvasWidth,
  ]);
  Shader.setUniform("u_time", millis() / 1000.0);
  Shader.setUniform("u_mouse", [mouseX / canvasWidth, mouseY / canvasHeight]);
  Shader.setUniform("u_tex", sourceGraphics);
  Shader.setUniform("u_span", span);

  shaderGrapgics.rect(0, 0, canvasWidth, canvasHeight);
  image(sourceGraphics, 0, 0);
  image(shaderGrapgics, 0, 0, canvasWidth + 10, canvasHeight * 1.62);
  deleteCell();
}
function deleteCell() {
  for (let i = 0; i < cell.length; i++) {
    if (cell[i].p.length === 0) {
      cell.splice(i, 1);
      i--;
    }
  }
}

function mousePressed() {
  if (keyCode == 48) {
    cell.push(
      new Cell(
        cell[cell.length - 1].pos.x,
        cell[cell.length - 1].pos.y,
        frameCount
      )
    );
  } else if (keyCode == 49) cell[0].p.push(new Particle(mouseX, mouseY, 0));
  cell.splice(i, 1);
}

class Cell {
  constructor(x, y, id) {
    this.pos = createVector(x, y);
    this.p = [];
    this.id = id;
    this.deathCount = 0;
    this.divide = false;
    this.divideCheck = 2;
    this.divideCooldown = 0;
    this.cancerPercentage = floor(random(0, 10000));
    this.colors = [
      [45, 123, 182],
      [255, 87, 51],
      [238, 90, 36],
      [255, 195, 0],
      [0, 150, 199],
      [65, 66, 66],
      [255, 255, 255],
    ];
  }

  generateParticle() {
    for (let i = 0; i < 1; i++) {
      this.p.push(
        new Particle(
          this.pos.x + random(-0.00001, 0.00001),
          this.pos.y + random(-0.00001, 0.00001),
          this.id,
          color(this.colors[floor(random(5))])
        )
      );
    }
  }

  divideCell() {
    if (
      cell.length < 20 &&
      this.divideCheck > 0 &&
      this.divide &&
      this.divideCooldown <= 0
    ) {
      this.divide = false;
      this.divideCooldown = 180;
      let newCell;
      if (this.cancerPercentage > 100) {
        newCell = new Cell(
          this.pos.x + random(-0.01, 0.01),
          this.pos.y + random(-0.01, 0.01),
          frameCount
        );
      } else {
        newCell = new Cancer(
          this.pos.x + random(-0.01, 0.01),
          this.pos.y + random(-0.01, 0.01),
          frameCount
        );
      }
      this.divideCheck--;
      return newCell;
    }

    this.divideCooldown--;
    return null;
  }

  generateCell() {
    if (this.divide) {
      cell.push(new Cell(this.pos.x, this.pos.y, 0));
    }
  }

  display() {
    fill(255);
    for (let i = 0; i < this.p.length; i++) {
      this.p[i].display();
      this.p[i].update();
      this.p[i].spring();
    }
    this.pos.set(this.averagePosition());
    if (this.deathCount > 1) {
      this.divide = true;
    }
  }

  deleteParticle() {
    for (let i = 0; i < this.p.length; i++) {
      if (this.p[i].deathCheck) {
        this.p.splice(i, 1);
        this.deathCount++;
      }
    }
  }

  applyRepulsion() {
    for (let i = 0; i < cell.length; i++) {
      if (this.id !== i) {
        let other = cell[i];
        let direction = p5.Vector.sub(this.pos, other.pos);
        let distance = direction.mag();

        if (distance < 100) {
          let force = direction
            .normalize()
            .mult(100 - distance)
            .mult(0.2);
          this.pos.add(force);
          other.pos.sub(force);
        }
      }
    }
  }

  averagePosition() {
    let sum = createVector(0, 0);
    let count = this.p.length;
    for (let i = 0; i < count; i++) {
      sum.add(this.p[i].pos);
    }
    if (count > 0) {
      sum.div(count);
    }
    return sum;
  }
}

class Cancer extends Cell {
  constructor(x, y, id) {
    super(x, y, id);
    this.cancerPercentage = floor(random(0, 10000));
    this.cancerDivide = false;
    this.colors = [
      [45, 0, 20],
      [80, 20, 10],
      [30, 0, 30],
    ];
  }

  generateParticle() {
    for (let i = 0; i < 1; i++) {
      this.p.push(
        new Particle(
          this.pos.x + random(-0.00001, 0.00001),
          this.pos.y + random(-0.00001, 0.00001),
          this.id,
          color(this.colors[floor(random(2))])
        )
      );
    }
  }

  divideCell() {
    if (
      cell.length < 200 &&
      this.divideCheck > 0 &&
      this.divide &&
      this.divideCooldown <= 0
    ) {
      this.divide = false;
      this.divideCooldown = 180;
      let newCell;
      if (this.cancerPercentage > 9990) {
        newCell = new Cell(
          this.pos.x + random(-0.01, 0.01),
          this.pos.y + random(-0.01, 0.01),
          frameCount
        );
      } else {
        newCell = new Cancer(
          this.pos.x + random(-0.01, 0.01),
          this.pos.y + random(-0.01, 0.01),
          frameCount
        );
      }
      this.divideCheck--;
      return newCell;
    }

    this.divideCooldown--;
    return null;
  }

  display() {
    fill(255);
    for (let i = 0; i < this.p.length; i++) {
      this.p[i].cancerP = true;
      this.p[i].display();
      this.p[i].update();
      this.p[i].spring();
    }
    this.pos.set(this.averagePosition());
    if (this.deathCount > 3) {
      this.divide = true;
    }
  }
}

class Particle {
  constructor(x, y, id, c) {
    this.pos = createVector(x, y);
    this.velo = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.rad = 0.1;
    this.dir = 0;
    this.dist = 0;
    this.v1 = 0;
    this.v2 = 0;
    this.correction = 0;
    this.id = id;
    this.deathTime = 0;
    this.deathCheck = false;
    this.organelles = [];
    this.cancerP = false;
    this.colors = [
      [255, 20, 10],
      [36, 200, 30],
      [255, 195, 0],
      [0, 150, 220],
    ];
    this.c = color(this.colors[floor(random(4))]);
  }

  update() {
    this.velo.add(this.acc);
    this.pos.add(this.velo);
    this.acc.mult(0);

    this.springSet(0, 0, 60, 0.8, 0.8);
    this.collide();
    if (!this.cancerP) {
      this.boundary();
    }
  }

  collide() {
    for (let cellIndex = 0; cellIndex < cell.length; cellIndex++) {
      if (this.id !== cellIndex) {
        let otherCellParticles = cell[cellIndex].p;

        for (let i2 = 0; i2 < otherCellParticles.length; i2++) {
          let otherParticle = otherCellParticles[i2];
          let direction = p5.Vector.sub(otherParticle.pos, this.pos);
          let distance = direction.mag();

          if (distance <= this.rad) {
            let correction = this.rad - distance;

            direction.normalize();
            this.pos.sub(p5.Vector.mult(direction, correction / 2));
            otherParticle.pos.add(p5.Vector.mult(direction, correction / 2));

            let v1 = p5.Vector.dot(direction, this.velo);
            let v2 = p5.Vector.dot(direction, otherParticle.velo);
            let deltaV = v1 - v2;

            direction.mult(deltaV);
            this.velo.sub(direction.mult(0.01));
            otherParticle.velo.add(direction.mult(0.01));
          }
        }
      }
    }
  }

  spring() {
    sourceGraphics.strokeWeight(6);
    if (this.cancerP) {
      sourceGraphics.stroke(0);
    } else {
      sourceGraphics.stroke(this.c);
    }
    for (let i = 0; i < cell.length; i++) {
      if (cell[i].id == this.id) {
        for (let i2 = 0; i2 < cell[i].p.length; i2++) {
          var diff = p5.Vector.sub(cell[i].p[i2].pos, this.pos);
          diff.normalize();
          diff.mult(this.length);
          var target = p5.Vector.add(this.pos, diff);

          var force = p5.Vector.sub(target, cell[i].p[i2].pos);
          force.mult(0.1);
          force.mult(this.stiffness);
          force.mult(1 - this.damping);

          cell[i].p[i2].pos.add(force);
          this.pos.add(p5.Vector.mult(force, -1));

          let ld = p5.Vector.dist(this.pos, cell[i].p[i2].pos);
          if (ld < 25) {
            if (this.rad > 1) {
              sourceGraphics.strokeWeight((10 * this.rad) / 15);
              sourceGraphics.line(
                cell[i].p[i2].pos.x,
                cell[i].p[i2].pos.y,
                this.pos.x,
                this.pos.y
              );
            }
            sourceGraphics.line(
              cell[i].p[i2].pos.x,
              cell[i].p[i2].pos.y,
              this.pos.x,
              this.pos.y
            );
            this.deathTime += 0.01;
            if (this.deathTime > 10) {
              this.rad -= (20 - this.rad) * 0.2;
              if (this.rad < 0) {
                this.deathCheck = true;
              }
            }
          }
        }
      }
    }
  }

  springSet(fromNode, toNode, length, stiffness, damping) {
    this.fromNode = fromNode;
    this.toNode = toNode;

    this.length = length || 100;
    this.stiffness = stiffness || 0.6;
    this.damping = damping || 0.9;
  }

  boundary() {
    let w = 0.3;
    let h = 0.3;
    if (this.pos.x > canvasWidth - 500) {
      this.pos.x = canvasWidth - 500;
    }
    if (this.pos.x < 500) {
      this.pos.x = 500;
    }
    if (this.pos.y > canvasHeight - 230) {
      this.pos.y = canvasHeight - 230;
    }
    if (this.pos.y < 230) {
      this.pos.y = 230;
    }
  }

  display() {
    this.rad += (20 - this.rad) * 0.05;
    sourceGraphics.strokeWeight(3);
    if (this.cancerP) {
      sourceGraphics.fill(80, 0, 0);
      sourceGraphics.stroke(0, 0, 0);
    } else {
      sourceGraphics.fill(120, 0, 0);
      sourceGraphics.stroke(120, 0, 0);
    }
    sourceGraphics.ellipse(this.pos.x, this.pos.y, this.rad);
  }
}
