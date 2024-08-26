let rkt, rktshields, rktpod, rktextra;
let scr, scrpod, scrdest;
// let missile;
let gun;
let gunposY;
let bullets = [];
let enemies = [];
let enemycount = 5;
let crashed = [];
let pods = [];
let podcount = 2;
let margin;
let epdist, ecdist, podpdist, podcdist, spdist, scdist;
let shields;
let toggle = false;
let pscore = 0;
let score = 0;
let highscore = 0;
let lifemax = 20;
let life = 20;
let shipmax = 10;
let shipload = 0;
let shipwait = true;
let shipfull = false;
let ships = [];
let shipsfull = [];
let clouds0 = [];
let clouds1 = [];
let cldamt = 7;

let joystickX, joystickY;
let rocketX, rocketY;
let spdX = 0;
let spdY = 0;
let acc = 0.09;

function preload() {
	rkt = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbf78999636f0fc5f53_rocket.png');
	rktpod = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbf0e212fdc464549a4_rocketpod.png');
	rktshields = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbf5ba0348cfcd284a2_shields.png');
	rktextra = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbfb45f87422d70d11c_rocketbig.png');
	scr = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbf0338cf8e73f61350_saucer.png');
	scrpod = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbfa6c34d5e72ade57c_saucerpod.png');
	scrdest = loadImage('https://uploads-ssl.webflow.com/5e87169261e13552159fb540/653bbbbf7fc49bd75a9a2f8c_scrdestroyed.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	//noCursor();
	angleMode(DEGREES);
	colorMode(HSB);
	rectMode(CENTER);
	storeScore();
	highscore = getItem('highscore');
	for (let cld = 0; cld < cldamt; cld++) {
		clouds0[cld] = new Cloud(random(width), random(height), random(1, 2));
		clouds1[cld] = new Cloud(random(width), random(height), random(2, 3));
		clouds0[cld].build();
		clouds1[cld].build();
	}
	margin = width * 0.075;
	shields = width * 0.125;
	// gunposY = height * 0.75;
	gun = new Gun();
	for (let e = 0; e < enemycount; e++) {
		enemies.push(new Enemy(width + 50, random(margin, height - margin), random(1, 3)));
	}
	for (let t = 0; t < podcount; t++) {
		pods.push(new Pod(width + 50, random(margin, height - margin), random(1, 3)));
	}
	for (let s = 0; s < 1; s++) {
		let newship = new RktDrift(width + margin, random(margin, height - margin), 1);
		ships.push(newship);
	}

	joystickX = width * 0.5;
	joystickY = height * 0.75;
	rocketX = width * 0.5;
	rocketY = height * 0.5;
}

function draw() {
	background(260, 50, 75, 0.5);

	rocketX = rocketX - spdX;
	rocketY = rocketY - spdY;

	//left
	if (rocketX > width) {
		rocketX = width;
	}
	//right
	if (rocketX < 0) {
		rocketX = 0;
	}
	//top
	if (rocketY > height) {
		rocketY = height;
	}
	//bottom
	if (rocketY < 0) {
		rocketY = 0;
	}

	for (let p = 0; p < podcount; p++) {
		pods[p].drift();
		pods[p].show();
		podpdist = dist(pods[p].px, pods[p].py, gun.px, gun.py);
		podcdist = dist(pods[p].x, pods[p].y, gun.x, gun.y);
		if (shipfull === true) {
			score = score;
			shipload = shipload;
		}
		if (shipfull === false) {
			if (podpdist > shields && podcdist < shields) {
				pods.splice([p], 1);
				scoreone();
				if (shipload < shipmax) {
					shipload++;
				} else {
					shipfull = true;
					rocketlaunch();
				}
				pods.push(new Pod(width + 50, random(margin, height - margin), random(1, 3)));
			} else {
				score = score;
			}
		} else {
			score = score;
			shipload = shipload;
		}
	}

	for (let s = 0; s < shipsfull.length; s++) {
		shipsfull[s].takeoff();
		shipsfull[s].show();
	}

	if (shipfull === true) {
		for (let s = 0; s < 1; s++) {
			ships[s].drift();
			ships[s].show();
			spdist = dist(ships[s].px, ships[s].py, gun.px, gun.py);
			scdist = dist(ships[s].x, ships[s].y, gun.x, gun.y);
			if (spdist > shields && scdist < shields) {
				ships.splice([s], 1);
				shipfull = false;
				shipload = 0;
				rocketrise();
				life += 5;
				// loselife();
				// scoreone();
				// ships.push(new Enemy(width + 50, random(margin, height - margin), random(1, 3)));
			} else {
				// life = life;
			}
		}
	}

	for (let cld = 0; cld < cldamt; cld++) {
		clouds0[cld].drift();
	}
	for (let cld = 0; cld < cldamt; cld++) {
		clouds1[cld].drift();
	}
	fill(0);
	textSize(height * 0.025);
	textAlign(LEFT);
	text("SCORE: " + score, width * 0.05, height * 0.05);
	textAlign(CENTER);
	text("LOAD: " + shipload, width * 0.5, height * 0.05);
	text("HIGH: " + highscore, width * 0.5, height * 0.95);
	textAlign(RIGHT);
	text("LIFE: " + life, width * 0.95, height * 0.05);



	for (let i = 0; i < bullets.length; i++) {
		bullets[i].fire();
	}
	for (let c = 0; c < crashed.length; c++) {
		crashed[c].dive();
		crashed[c].bail();
	}
	for (let e = 0; e < enemycount; e++) {
		enemies[e].attack();
		enemies[e].show();
		for (let i = 0; i < bullets.length; i++) {
			if (dist(bullets[i].x, bullets[i].y, enemies[e].x, enemies[e].y) < width * 0.05) {
				enemies.splice([e], 1);
				bullets.splice([i], 1);
				scoreone();
				enemies.push(new Enemy(width + 50, random(margin, height - margin), random(1, 3)));
			}
			// if(bullets[i].y <= 0){
			// 	life--;
			// }
		}

		epdist = dist(enemies[e].px, enemies[e].py, gun.px, gun.py);
		ecdist = dist(enemies[e].x, enemies[e].y, gun.x, gun.y);
		if (epdist > shields && ecdist < shields) {
			enemies.splice([e], 1);
			collision();
			loselife();
			scoreone();
			enemies.push(new Enemy(width + 50, random(margin, height - margin), random(1, 3)));
		} else {
			life = life;
		}
	}

	if (score > 0 && score % 10 === 0) {
		lifebonus();
		scoreone();
	}

	if (life <= -1) {
		gameover();
	}
	gun.aim(rocketX, rocketY);

	if (mouseIsPressed) {
		noFill();
		ellipse(joystickX, joystickY, width * 0.1, width * 0.1);
		line(joystickX, joystickY, mouseX, mouseY);
		ellipse(mouseX, mouseY, width * 0.05, width * 0.05);
	}
}

function scoreone() {
	score++;
}

function lifebonus() {
	life += 1;
}

function loselife() {
	life--;
}

function rocketlaunch() {
	let newship = new RktDrift(width + margin, random(margin, height - margin), 1);
	ships.push(newship);
	// shipload = 0;
}

function rocketrise() {
	let fullship = new RktFly(gun.x, gun.y, 2);
	shipsfull.push(fullship);
}

function gameover() {
	highscore = score;
	storeScore();
	fill(0, 0, 100, 0.25);
	stroke(90);
	strokeWeight(5);
	rect(width * 0.5, height * 0.5, width, height);
	textAlign(CENTER);
	fill(0, 0, 0);
	// textSize(width * 0.05);
	// text("HIGH SCORE", width * 0.5, height * 0.4);
	textSize(height * 0.25);
	text(score, width * 0.5, height * 0.5);
	// saveCanvas('RvsS', 'png');
	noLoop();
}

function storeScore() {
	let prevhigh = getItem('highscore');
	if (!prevhigh || score > prevhigh) {
		storeItem('highscore', score);
	}
}

function collision() {
	let deadenemy = new DeadEnemy(gun.x, gun.y, 5);
	crashed.push(deadenemy);
}
// function mousePressed() {
// 	let bullet = new Bullet(gun.x, gunposY, 5);
// 	bullets.push(bullet);
// }

class Enemy {
	constructor(x, y, spd) {
		this.x = x;
		this.y = y;
		this.d = width * 0.2;
		this.px = this.x;
		this.py = this.y;
		this.spd = spd;
	}
	attack() {
		this.px = this.x;
		this.py = this.y;
		if (this.x < 0 - this.d) {
			this.x = width + this.d;
			this.y = random(margin, height + margin);
			if (this.spd <= 7) {
				this.spd += 1;
			}
			// life--;
		}
		this.x = this.x - this.spd;
		this.y = this.y;
	}
	show() {
		push();
		translate(this.x, this.y);
		imageMode(CENTER);
		image(scr, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
		push();
		translate(this.px, this.py);
		noFill();
		// ellipse(0, 0, shields, shields);
		pop();
		// line(this.px, this.py, this.x, this.y);
	}
}

class DeadEnemy {
	constructor(x, y, spd) {
		this.shipx = x;
		this.shipy = y;
		this.pilotx = x;
		this.piloty = y;
		this.d = width * 0.2;
		this.spd = spd;
		this.r = random(-2, 2);
		this.sa = 0;
		this.pa = 0;
	}
	dive() {
		this.shipy = this.shipy + this.spd;
		this.shipx = this.shipx - this.spd;
		this.sa += this.r;
		push();
		translate(this.shipx, this.shipy);
		rotate(this.sa);
		imageMode(CENTER);
		image(scrdest, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
	}
	bail() {
		this.piloty = this.piloty + this.spd * 0.5;
		this.pilotx = this.pilotx - this.spd * 0.5;
		this.pa -= this.r * 0.5;
		push();
		translate(this.pilotx, this.piloty);
		rotate(this.pa);
		imageMode(CENTER);
		image(scrpod, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
	}
}

class RktDrift {
	constructor(x, y, spd) {
		this.x = x;
		this.y = y;
		this.d = width * 0.35;
		this.px = this.x;
		this.py = this.y;
		this.spd = spd;
		this.r = 0.5;
		this.a = 0;
	}
	drift() {
		this.a = this.a;
		this.px = this.x;
		this.py = this.y;
		if (this.x < 0 - this.d) {
			this.x = width + this.d;
			this.y = random(margin, height + margin);
			if (this.spd <= 7) {
				this.spd += 1;
			}
			// life--;
		}
		this.x = this.x - this.spd;
		this.y = this.y;
	}
	show() {
		push();
		translate(this.x, this.y);
		rotate(this.a);
		imageMode(CENTER);
		image(rktextra, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
	}
}
class RktFly {
	constructor(x, y, spd) {
		this.x = x;
		this.y = y;
		this.d = width * 0.35;
		this.px = this.x;
		this.py = this.y;
		this.spd = spd;
		this.r = 0.1;
		this.a = 0;
	}
	takeoff() {
		this.px = this.x;
		this.py = this.y;
		this.y = this.y - this.spd;
		this.x = this.x + this.spd;
		this.a -= this.r;
	}
	show() {
		push();
		translate(this.x, this.y);
		rotate(this.a);
		imageMode(CENTER);
		image(rktextra, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
	}
}

class Gun {
	constructor() {
		this.x = width / 2;
		this.y = height * 0.75;
		this.px = width / 2;
		this.py = height * 0.75;
		this.d = width * 0.2;
		this.ease = 0.25;
		this.bulletX = this.x;
		this.bulletY = this.y;
		this.fire = false;
		this.shieldstr = 1.0;
	}
	aim(x, y) {
		this.px = this.x;
		this.py = this.y;
		let tx = x;
		let ty = y;
		this.x += (tx - this.x) * this.ease;
		this.y += (ty - this.y) * this.ease;
		this.shieldstr = map(life, 0, lifemax, 0.0, 1.0);
		push();
		translate(this.x, this.y);
		// fill(0);
		// ellipse(0, 0, shields, shields);
		imageMode(CENTER);
		tint(100, this.shieldstr);
		image(rktshields, 0, 0, this.d, this.d);
		noTint();
		image(rkt, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
		// ellipse(this.px, this.py, this.d, this.d);
	}
}

class Bullet {
	constructor(x, y, spd) {
		this.x = x;
		this.y = y;
		this.d = width * 0.1;
		this.spd = spd;
	}
	fire() {
		this.y = this.y - this.spd;
		imageMode(CENTER);
		image(missile, this.x, this.y, this.d, this.d);
		imageMode(CORNER);
	}
}

class Pod {
	constructor(x, y, spd) {
		this.x = x;
		this.y = y;
		this.a = 15;
		this.r = random(-2, 2);
		this.d = width * 0.2;
		this.px = this.x;
		this.py = this.y;
		this.spd = spd;
	}
	drift() {
		this.a = this.a + this.r;
		this.px = this.x;
		this.py = this.y;
		if (this.x < 0 - this.d) {
			this.x = width + this.d;
			this.y = random(margin, height + margin);
			if (this.spd <= 7) {
				this.spd += 1;
			}
			// life--;
		}
		this.x = this.x - this.spd;
		this.y = this.y;
	}
	show() {
		push();
		translate(this.x, this.y);
		rotate(this.a);
		imageMode(CENTER);
		image(rktpod, 0, 0, this.d, this.d);
		imageMode(CORNER);
		pop();
		push();
		translate(this.px, this.py);
		noFill();
		// ellipse(0, 0, shields, shields);
		pop();
		// line(this.px, this.py, this.x, this.y);
	}
}



class Cloud {
	constructor(x, y, ws) {
		this.x = x;
		this.y = y;
		this.relsize = width * 0.1;
		this.ws = ws; //wind speed
		this.puffs = [];
		this.puffcount = random(3, 7);
	}
	build() {
		// push();
		for (let p = 0; p < this.puffcount; p++) {
			let x = random(-this.relsize, this.relsize);
			let y = random(-this.relsize, this.relsize);
			let z = random(this.relsize, this.relsize * 2);
			this.puffs[p] = createVector(x, y, z);
		}
		// pop();
	}
	drift() {
		if (this.x < 0 - this.relsize * 1.5) {
			this.x = width + this.relsize * 1.5;
			this.y = random(height);
		}
		this.x -= this.ws;
		push();
		translate(this.x, this.y);
		for (let p = 0; p < this.puffcount; p++) {
			stroke(0, 0, 80);
			strokeWeight(2);
			fill(0, 0, 100, 0.85);
			ellipse(this.puffs[p].x, this.puffs[p].y, this.puffs[p].z, this.puffs[p].z);
		}
		pop();
	}
}

function touchStarted() {
	joystickX = mouseX;
	joystickY = mouseY;
	return false;
}

function touchMoved() {
	spdX = (joystickX - mouseX) * acc;
	spdY = (joystickY - mouseY) * acc;
	return false;
}

function touchEnded() {
	spdX = 0;
	spdY = 0;
	return false;
}