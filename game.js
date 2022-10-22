let game;
var sprite1;
var score = 0;
var scoreText;
let gameOptions = {

	// min and max radius from crank centre where dragging is allowrd
	dragRadius: [50, 250],

	// ratio between crank rotation, in degrees, and rope movement, in pixels
	crankRatio: 0.3
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
		backgroundColor: 0xeaf4ff,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				debug: true
			}
		},
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 750,
            height: 1334
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
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
	}
    create() {

		// this.physics.startSystem(Phaser.Physics.ARCADE);
		this.back = this.add.tileSprite(0,0,game.config.width, game.config.height, 'background');
		this.back.setOrigin(0, 0);
		this.back.setScrollFactor(0);

		this.cloud = this.add.tileSprite(0,0,game.config.width, game.config.height, 'clouds-white-small');
		this.cloud.setOrigin(0, 0);
		this.cloud.setScrollFactor(0);

		// var marker = this.add.image(game.config.width+100, 300, 'coin');
		// let coin = this.add.sprite(game.config.width+100, 300, 'coin');
	
		// this.tweens.add({
		// 	targets: coin,
		// 	x: -700,
		// 	duration: 3000,
		// 	ease: 'Power2',
		// 	repeat: -1,
		// 	delay: 1000
		// });
				// bird sprite
				// this.bird = this.add.sprite(game.config.width / 2, game.config.height / 3, "bird");


		sprite1 = this.add.sprite(game.config.width / 2, game.config.height / 3, 'bird');
		this.physics.world.enable([ sprite1 ]);
		// sprite1.body.setVelocity(0,0).setBounce(1, 1).setCollideWorldBounds(false);

		// sprite2 = this.add.sprite(800, 300, 'coin');
		// this.tweens.add({
		// 	targets: sprite2,
		// 	x: -500,
		// 	duration: 5000,
		// 	ease: 'Power2',
		// 	repeat: -1,
		// 	delay: 1000
		// });
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
		scoreText = this.add.text(30, 30, 'SCORE: 0', { fontSize: '50px', fill: '#000', fontfamily: 'Roboto'});
		this.physics.add.collider(sprite1, coinGroup);// 衝突処理を設定する
		this.physics.add.overlap(sprite1, coinGroup, (p, c)=>{
			c.destroy();// コインを消す
			score += 10;
			scoreText.setText('SCORE: ' + score);
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
	update() {
		this.back.tilePositionX += 3;
		this.cloud.tilePositionX += 2;
	}
}
