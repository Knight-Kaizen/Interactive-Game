let config = {
    type : Phaser.AUTO,
    
    scale : {
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 600,
    },
    
    backgroundColor: 0xff0000,
    
    
    
    scene : {
        preload: preload, 
        create: create,
        update: update,
    },
    
    physics : {
        default : 'arcade',
        arcade : {
            gravity : {
                y:1000,
            },
//            debug : true,
        }
    },
    
}

let game = new Phaser.Game(config);

let game_config = {
    player_speed : 150,
    player_jump : -700,
}
function preload(){
    this.load.image("sky", "Assets/background_sky.png");
    this.load.image("ground", "Assets/ground_base.png");
//    this.load.image("player", "Assets/character.png");
    this.load.image("fruit", "Assets/food.png");
    this.load.spritesheet("player", "Assets/player_spritesheet.png", {frameWidth:208,frameHeight:219});
}

function create(){
    W = game.config.width;
    H = game.config.height;
    console.log(W);
    let background = this.add.sprite(0, 0, 'sky');
    background.setOrigin(0, 0);
    let ground = this.add.tileSprite(0, H-40, 2*W, 77, 'ground');
//    background.setOrigin(0, 0);
    this.player = this.physics.add.sprite(0, 0, 'player');
    this.player.setOrigin(0, 0);
    this.player.setScale(.20);
//    this.physics.add.existing(ground, true);
    //Animations
    this.anims.create({
        key:"left",
        frames : this.anims.generateFrameNumbers("player", {start:4, end:7 }),
        frameRate: 10,
        repeat: -1,
    });
    
    this.anims.create({
        key:"centre",
        frames : this.anims.generateFrameNumbers("player", {start:0, end:0 }),
        frameRate: 10,
    });
    
    this.anims.create({
        key:"right",
        frames : this.anims.generateFrameNumbers("player", {start:8, end:11 }),
        frameRate: 10,
        repeat: -1,
    });
    
    this.physics.add.collider(ground, this.player);
    
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);
    
    //Adding food objects
    let food = this.physics.add.group({
        key : "fruit",
        repeat : 8,
        setScale : 0.2,
        setXY : {x:10, y:0, stepX: 100},
    });
    
    this.physics.add.collider(food, ground);
    
    
    //Adding bouncing effects to apples
    food.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
    });
    
    //Adding more platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(600, 400, 'ground').setScale(2.0, 0.5).refreshBody();
    platforms.create(700, 200, 'ground').setScale(2.0, 0.5).refreshBody();
    platforms.create(400, 200, 'ground').setScale(2.0, 0.5).refreshBody();
    platforms.add(ground);
    
    this.physics.add.collider(food, platforms);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, platforms);
    
    this.physics.add.overlap(this.player, food, eatfood, null, this);
    
    //playing with camera
    this.cameras.main.setBounds(0, 0, W, H);
    this.physics.world.setBounds(0, 0, W, H);
    
    this.cameras.main.startFollow(this.player, true, true);
    
    //zoom camera
    this.cameras.main.setZoom(1.5);
    
}

function update(){
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-game_config.player_speed);
        this.player.anims.play("left", true);
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(game_config.player_speed);
        this.player.anims.play("right", true);
    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.play("centre", true);
    }
    //Adding jump
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(game_config.player_jump);
    }
}

function eatfood(player, food){
    food.disableBody(true, true);
}