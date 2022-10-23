let game;
var sprite1;
var score = 0;
var scoreText;
var time = 0;
var timeText;
let gameOptions = {

	// min and max radius from crank centre where dragging is allowrd
	dragRadius: [50, 250],

	// ratio between crank rotation, in degrees, and rope movement, in pixels
	crankRatio: 0.3
}


//title
class Title extends Phaser.Scene {

	constructor (){
			super({ key: 'Title' });
	 }
	preload() {
		this.load.image("bird", "./assets/bird.png");
		this.load.image('background', './assets/background.png');
		this.load.image("clouds-white-small", "./assets/clouds-white-small.png");
	}
	create(){
		// this.physics.startSystem(Phaser.Physics.ARCADE);
		this.back = this.add.tileSprite(0,0,game.config.width, game.config.height, 'background');
		this.back.setOrigin(0, 0);
		this.back.setScrollFactor(0);
		this.cloud = this.add.tileSprite(0,0,game.config.width, game.config.height, 'clouds-white-small');
		this.cloud.setOrigin(0, 0);
		this.cloud.setScrollFactor(0);
	  
	  let sceneName = this.add.text(game.config.width / 2, game.config.height / 3, 'のトロの冒険');
	  sceneName.setFill("#d5802b").setLineSpacing(100).setStroke("#d5802b",3).setFontSize(80).setFontFamily("Roboto").setOrigin(0.5).setInteractive();
	  let change = this.add.text(game.config.width / 2, game.config.height / 3 + 200, 'START');
	  change.setFill("#d5802b").setPadding(20).setBackgroundColor("#ffffff").setFontSize(50).setFontFamily("Roboto").setOrigin(0.5).setInteractive();
	  change.on('pointerdown', function (pointer) {
	  this.scene.start('PlayGame');
	   }, this);
	   let text = this.add.text(game.config.width / 2, game.config.height / 3 + 300, '100点めざすにゃ');
	   text.setFill("#d5802b").setPadding(20).setFontSize(40).setFontFamily("Roboto").setOrigin(0.5).setInteractive();
 
		sprite1 = this.add.sprite(game.config.width / 2, game.config.height / 3 + 500, 'bird');
		this.tweens.add({
		targets: sprite1,
		y: '+= 40',
		duration: 1000,
		repeat: -1,
		yoyo: true
		});
		
	}
	update() {
		this.back.tilePositionX += 3;
		this.cloud.tilePositionX += 2;
	}
};
// main game
class PlayGame extends Phaser.Scene {
    constructor() {
		super({ key: 'PlayGame' });
    }
	preload() {

		// load plugin responsible of drag rotate, see the official page at
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/dragrotate/
		this.load.plugin("rexdragrotateplugin", "dragrotate-plugin.js", true);
		this.load.image("crank", "./assets/crank.png");
		this.load.image("rope", "./assets/rope.png");
		this.load.image("bird", "./assets/bird.png");
		this.load.image('background', './assets/background.png');
		this.load.image("clouds-white-small", "./assets/clouds-white-small.png");
		this.load.image("coin", "./assets/coin.png",);
		this.load.image("coin02", "./assets/coin02.png",);
		this.load.image("souziki", "./assets/souziki.png",);
	}
    create() {

		// this.physics.startSystem(Phaser.Physics.ARCADE);
		this.back = this.add.tileSprite(0,0,game.config.width, game.config.height, 'background');
		this.back.setOrigin(0, 0);
		this.back.setScrollFactor(0);
		

		this.cloud = this.add.tileSprite(0,0,game.config.width, game.config.height, 'clouds-white-small');
		this.cloud.setOrigin(0, 0);
		this.cloud.setScrollFactor(0);

		sprite1 = this.add.sprite(game.config.width / 2, game.config.height / 3, 'bird');
		this.physics.world.enable([ sprite1 ]);

		let coinGroup = this.physics.add.group();// 動く物体をまとめる
		coinGroup.create(game.config.width+10, 200, "coin");// コイン1
		coinGroup.create(game.config.width+1000, 400, "coin");// コイン2
		coinGroup.create(game.config.width+1200, 600, "coin");// コイン3
		coinGroup.create(game.config.width+600, 800, "coin");// コイン3
		coinGroup.create(game.config.width+800, 100, "coin");// コイン3
		coinGroup.create(game.config.width+1400, 800, "coin");// コイン3
		this.tweens.add({
			targets: coinGroup.getChildren(),
			x: '+= -2000',
			duration: 9000,
			repeat: -1,
			width: 20,
            height: 12,
		});
		timeText = this.add.text(30, 100,'TIME: 0',{ fontSize: '50px', fill: '#d5802b',fontfamily: 'Roboto'});
		this.time.addEvent({
			delay: 1000,
			callback: () => {
			  time += 1;
			  timeText.setText('TIME: ' + time)
			},
			loop: true,
		});
		scoreText = this.add.text(30, 30, 'SCORE: 0', { fontSize: '60px', fill: '#d5802b', fontfamily: 'Roboto'});
		this.physics.add.collider(sprite1, coinGroup);// 衝突処理を設定する
		this.physics.add.overlap(sprite1, coinGroup, (p, c)=>{
			c.destroy();// コインを消す
			score += 10;
			scoreText.setText('SCORE: ' + score);
			if (score >= 100) {
				this.scene.start('End');
			}
		}, null, this);

		let coinGroups = this.physics.add.group();// 動く物体をまとめる
		coinGroups.create(game.config.width+100, 200, "coin02");
		coinGroups.create(game.config.width+1500, 400, "coin02");
		coinGroups.create(game.config.width+600, 600, "coin02");
		coinGroups.create(game.config.width+1000, 900, "coin02");
		this.tweens.add({
			targets: coinGroups.getChildren(),
			x: '+= -2000',
			duration: 4000,
			repeat: -1,
		});
		this.physics.add.collider(sprite1, coinGroups);// 衝突処理を設定する
		this.physics.add.overlap(sprite1, coinGroups, (p, c)=>{
			c.destroy();// コインを消す
			score += 20;
			scoreText.setText('SCORE: ' + score);
			if (score >= 100) {
				this.scene.start('End');
			}
		}, null, this);

		let souziki = this.physics.add.group();// 動く物体をまとめる
		souziki.create(game.config.width+500, 300, "souziki");
		souziki.create(game.config.width+1000, 600, "souziki");
		this.tweens.add({
			targets: souziki.getChildren(),
			x: '+= -2000',
			duration: 3000,
			repeat: -1,
		});
		this.physics.add.collider(sprite1, souziki);// 衝突処理を設定する
		this.physics.add.overlap(sprite1, souziki, (p, c)=>{
			c.destroy();// コインを消す
			score -= 20;
			scoreText.setText('SCORE: ' + score);
		}, null, this);


		// crank sprite
		this.crank = this.add.sprite(game.config.width / 2, game.config.height / 4 * 3.2, "crank");

		// here I just draw two circles to show drag area
		let graphics = this.add.graphics();
		// graphics.lineStyle(4, 0xff0000, 1);
		graphics.strokeCircle(this.crank.x, this.crank.y, gameOptions.dragRadius[0]);
		graphics.strokeCircle(this.crank.x, this.crank.y, gameOptions.dragRadius[1]);

		// drag rotate plugin instance
		let dragRotate = this.plugins.get("rexdragrotateplugin").add(this, {

			// horizontal coordinate of origin point
    		x: this.crank.x,

			// vertical coordinate of origin point
    		y: this.crank.y,

			// dragging is valid when distance between touch pointer and
			// origin position is larger then minRadius and less then maxRadius.
    		minRadius: gameOptions.dragRadius[0],
    		maxRadius: gameOptions.dragRadius[1]
		});

		// the core of the script, "drag" listener
		dragRotate.on("drag", function(e) {

			// deltaAngle is the dragging angle around origin position, in degrees
			// we determine new rope position according to dragging angle
			let newPosition = sprite1.y + e.deltaAngle * gameOptions.crankRatio;

			// // we are going to limit rope position to prevent bird to fly off the screen
			if(newPosition > 50 && newPosition < game.config.height / 4 * 3) {

				// adjust bird position
				sprite1.y += e.deltaAngle * gameOptions.crankRatio;

				// adjust crank angle
				this.crank.angle += e.deltaAngle
			}
		}, this);

	}
	update(time) {
		this.back.tilePositionX += 3;
		this.cloud.tilePositionX += 2;
	}
}

//end
class End extends Phaser.Scene {

	constructor (){
			super({ key: 'End' });
	 }
	preload() {
		this.load.image("bird", "./assets/bird.png");
		this.load.image('background', './assets/background.png');
		this.load.image("clouds-white-small", "./assets/clouds-white-small.png");
	}
	create(){
		// this.physics.startSystem(Phaser.Physics.ARCADE);
		this.back = this.add.tileSprite(0,0,game.config.width, game.config.height, 'background');
		this.back.setOrigin(0, 0);
		this.back.setScrollFactor(0);
		this.cloud = this.add.tileSprite(0,0,game.config.width, game.config.height, 'clouds-white-small');
		this.cloud.setOrigin(0, 0);
		this.cloud.setScrollFactor(0);
		let SCORE = this.add.text(game.config.width / 2, 200, 'SCORETIME');
		SCORE.setFill("#d5802b").setLineSpacing(100).setStroke("#fff",5).setFontSize(80).setFontFamily("Roboto").setOrigin(0.5).setInteractive();
		let SCORETIME = this.add.text(game.config.width / 2, 350, time + '秒');
		SCORETIME.setFill("#d5802b").setLineSpacing(100).setStroke("#fff",5).setFontSize(100).setFontFamily("Roboto").setOrigin(0.5).setInteractive();

		let sceneName = this.add.text(game.config.width / 2, game.config.height / 3 + 100, 'Congrats!!');
	  this.tweens.add({
		targets: sceneName,
		y: '+= 40',
		duration: 1000,
		repeat: -1,
		yoyo: true
		}); 
	  sceneName.setFill("#d5802b").setLineSpacing(100).setStroke("#fff",5).setFontSize(120).setFontFamily("Roboto").setOrigin(0.5).setInteractive();
	  let change = this.add.text(game.config.width / 2, game.config.height / 3 + 300, 'STARTにもどる');
	  this.tweens.add({
		targets: change,
		y: '+= 40',
		duration: 1000,
		repeat: -1,
		yoyo: true
		});  
	  change.setFill("#d5802b").setPadding(20).setBackgroundColor("#ffffff").setFontSize(50).setFontFamily("Roboto").setOrigin(0.5).setInteractive();
	  change.on('pointerdown', function (pointer) {
		score = 0;
		time = 0;
	  this.scene.start('Title');
	   }, this);

		sprite1 = this.add.sprite(game.config.width / 2, game.config.height / 3 + 600, 'bird');
		this.tweens.add({
		targets: sprite1,
		y: '+= 40',
		duration: 1000,
		repeat: -1,
		yoyo: true
		});
		
	}
	update() {
		this.back.tilePositionX += 3;
		this.cloud.tilePositionX += 2;
	}
};

let Config = {
	type: Phaser.AUTO,
	backgroundColor: 0xeaf4ff,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: "thegame",
		width: 750,
		height: 1334
	},
	parent: 'canvas',
	scene: [ Title, PlayGame, End]
}
game = new Phaser.Game(Config);
