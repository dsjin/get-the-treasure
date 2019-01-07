// Create a new scene
let gameScene = new Phaser.Scene('Game')

gameScene.init = function(){
    this.playerSpeed = 3
    this.enemyProperties = {
        minSpeed : 3,
        maxSpeed : 6
    }
    this.isTerminating = false
}

// Load Assets
gameScene.preload = function() {
    this.load.image('background', '../assets/background.png')
    this.load.image('player', '../assets/player.png')
    this.load.image('enemy', '../assets/dragon.png')
    this.load.image('goal', '../assets/treasure.png')
}
gameScene.create = function() {
    this.cursorKeys = this.input.keyboard.createCursorKeys()
    var map = this.add.tilemap()

    this.gameW = this.sys.game.config.width // get game screen widht
    this.gameH = this.sys.game.config.height // get game screen height

    this.player = this.add.sprite(40, this.gameH/2, 'player')
    this.player.depth = 1
    this.player.setScale(0.5)

    let bg = this.add.sprite(0, 0, 'background')
    // Now Origin is Center 
    // Change to top-left by change origin
    //bg.setOrigin(0, 0)
    // Another way is change position 

    bg.setPosition(640/2,360/2) // half of 640, 360 is center of canvas and origin of background is center too

    //player.setScale(0.5, 2) // scale is multiple the original width or height

    //create enemy

    //this.enemy = this.add.sprite(250, 180, 'enemy')
    //this.enemy.setScale(0.6)

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: {
          x: 100,
          y: 100,
          stepX: 100,
          stepY: 20
        }
    })
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4) // Set Scale 1-0.4 = 0.6
    Phaser.Actions.Call(this.enemies.getChildren(), (enemy)=>{
        // flip enemy
        enemy.flipX = true;
    
        // set speed
        enemy.direction = Math.random() < Math.random() > 0.5 ? 1 : -1
        enemy.speed = Math.random() * (this.enemyProperties.maxSpeed-this.enemyProperties.minSpeed) + this.enemyProperties.minSpeed
    
    })

    this.goal = this.add.sprite(this.gameW-80, this.gameH/2, 'goal')
    this.goal.setScale(0.6)

    this.bound1 = new Phaser.Geom.Rectangle(0, 0, this.gameW, 55)
    this.bound2 = new Phaser.Geom.Rectangle(this.gameW-105, 55, this.gameW, 60)
    this.bound3 = new Phaser.Geom.Rectangle(this.gameW-45, 55+60, this.gameW, this.gameH)
    this.bound4 = new Phaser.Geom.Rectangle(this.gameW-225, 55, 60, 60)
    this.bound5 = new Phaser.Geom.Rectangle(170, this.gameH-65, 370, this.gameH)
    this.bound6 = new Phaser.Geom.Rectangle(55, this.gameH-65, 50, this.gameH)
    /*
    let graphics = this.add.graphics(0, 0)
    graphics.fillStyle(0xFF33ff, 0.5)
    graphics.fillRectShape(this.bound1)
    graphics.fillRectShape(this.bound2)
    graphics.fillRectShape(this.bound3)
    graphics.fillRectShape(this.bound4)
    graphics.fillRectShape(this.bound5)
    graphics.fillRectShape(this.bound6)*/
}

// this is called up to 60 times/sec

gameScene.update = function(){
    if(this.isTerminating){
        return
    } 
    if(this.input.activePointer.isDown){
        this.player.x += this.playerSpeed
    }
    var isUpDown = this.cursorKeys.up.isDown;
    var isDownDown = this.cursorKeys.down.isDown;
    var isLeftDown = this.cursorKeys.left.isDown;
    var isRightDown = this.cursorKeys.right.isDown;
    let characterCheckWorldBoundLeft = (this.player.x > 0+(this.player.displayWidth/2))
    let characterCheckWorldBoundฺBottom = (this.player.y < this.gameH - (this.player.displayHeight/2))
    let characterCheckBound1 = (this.player.y > (this.bound1.getLineC().y1+(this.player.displayHeight/2)))
    let characterCheckBound3 = (this.player.x < (this.bound3.getLineD().x1-(this.player.displayWidth/2)))
    let characterCheckBound24 = (this.player.y > (this.bound4.getLineC().y1+(this.player.displayHeight/2)))
    let characterCheckBound2Left = (this.player.y > this.bound2.getLineD().y1)
    let characterCheckBound4Left = (this.player.y > this.bound4.getLineD().y1)
    let characterCheckBound4Right = (this.player.y > this.bound4.getLineB().y2)
    let characterCheckBound56 = (this.player.y < (this.bound5.getLineA().y1-(this.player.displayHeight/2)))
    let characterCheckBound5Left = (this.player.y < this.bound5.getLineD().y2)
    let characterCheckBound5Right = (this.player.y < this.bound5.getLineB().y1)
    let characterCheckBound6Left = (this.player.y < this.bound6.getLineD().y2)
    let characterCheckBound6Right = (this.player.y < this.bound6.getLineB().y1)
    if(isLeftDown && !this.player.flipX){
        this.player.flipX = true
    }else if(isRightDown && this.player.flipX){
        this.player.flipX = false
    }
    if(((this.player.x >= this.bound4.getLineC().x2 && this.player.x <= this.bound4.getLineC().x1) || this.player.x >= this.bound2.getLineC().x2) && (this.player.y <= (this.bound2.getLineC().y1) + this.player.displayHeight/2)){
        if(characterCheckBound24 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(characterCheckWorldBoundฺBottom && isDownDown){
            this.player.y += this.playerSpeed
        }else if(isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(characterCheckBound3 && isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if (this.player.x >= (this.bound2.getLineD().x1 - (this.player.displayWidth/2)) && (this.player.y <= (this.bound2.getLineC().y1) + this.player.displayHeight/2)){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(isDownDown){
            this.player.y += this.playerSpeed
        }else if(isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(characterCheckBound2Left && isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if(this.player.x >= (this.bound4.getLineD().x1 - (this.player.displayWidth/2)) && this.player.x < this.bound4.getLineB().x1 && (this.player.y <= (this.bound4.getLineC().y1) + this.player.displayHeight/2)){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(isDownDown){
            this.player.y += this.playerSpeed
        }else if(isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(characterCheckBound4Left && isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if (this.player.x <= (this.bound4.getLineB().x1 + (this.player.displayWidth/2)) && this.player.x > this.bound4.getLineD().x1 && (this.player.y <= (this.bound4.getLineC().y1) + this.player.displayHeight/2)){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(isDownDown){
            this.player.y += this.playerSpeed
        }else if(characterCheckBound4Right && isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if((this.player.x >= this.bound5.getLineC().x2 && this.player.x <= this.bound5.getLineC().x1) || (this.player.x >= this.bound6.getLineC().x2 && this.player.x <= this.bound6.getLineC().x1) ){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(characterCheckBound56 && isDownDown){
            this.player.y += this.playerSpeed
        }else if(isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if(this.player.x >= (this.bound6.getLineD().x1 - (this.player.displayWidth/2)) && this.player.x < this.bound6.getLineB().x1){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(characterCheckWorldBoundฺBottom && isDownDown){
            this.player.y += this.playerSpeed
        }else if(isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(characterCheckBound6Left && isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if (this.player.x <= (this.bound6.getLineB().x1 + (this.player.displayWidth/2)) && this.player.x > this.bound6.getLineD().x1){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(isDownDown){
            this.player.y += this.playerSpeed
        }else if(characterCheckBound6Right && isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if(this.player.x >= (this.bound5.getLineD().x1 - (this.player.displayWidth/2)) && this.player.x < this.bound5.getLineB().x1){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(characterCheckWorldBoundฺBottom && isDownDown){
            this.player.y += this.playerSpeed
        }else if(isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(characterCheckBound5Left && isRightDown){
            this.player.x += this.playerSpeed
        }
    }else if (this.player.x <= (this.bound5.getLineB().x1 + (this.player.displayWidth/2)) && this.player.x > this.bound5.getLineD().x1){
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(isDownDown){
            this.player.y += this.playerSpeed
        }else if(characterCheckBound5Right && isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(isRightDown){
            this.player.x += this.playerSpeed
        }
    }else{
        if(characterCheckBound1 && isUpDown){
            this.player.y -= this.playerSpeed
        }else if(characterCheckWorldBoundฺBottom && isDownDown){
            this.player.y += this.playerSpeed
        }else if(characterCheckWorldBoundLeft && isLeftDown){
            this.player.x -= this.playerSpeed
        }else if(characterCheckBound3 && isRightDown){
            this.player.x += this.playerSpeed
        }
    }

    //treasure overlap check 
    let playerRect = this.player.getBounds()
    let treasureRect = this.goal.getBounds()

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
        return this.gameOver()
    }
    
    this.enemies.getChildren().forEach(enemy => {
        enemy.y += enemy.speed * enemy.direction
        const enemyConditionDown = enemy.direction > 0 && enemy.y > (this.gameH - 80)
        const enemyConditionUp = enemy.direction < 0 && enemy.y < 80
        if(enemyConditionUp || enemyConditionDown){
            enemy.direction *= -1
        }
        if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemy.getBounds())){
            return this.gameOver()
        }
    })
}

gameScene.gameOver = function(){
    this.isTerminating = true
    this.cameras.main.shake(500)
    this.cameras.main.on('camerashakecomplete', (camera, effect)=>{
        this.cameras.main.fade(500)
    })
    this.cameras.main.on('camerafadeoutcomplete', (camera, effect)=>{
        this.scene.restart()
        return
    })
}
// Set the configuration
let config = {
    type : Phaser.AUTO,
    width : 640,
    height : 360,
    scene : gameScene
}

// Create a new game
let game = new Phaser.Game(config)

game.events.on('ready', _ => {
    let dom = document
    let p = dom.createElement(`p`)
    p.append(`Use Arrow keys (up,down,left,right) to move character and avoid enemies to the treasure`)
    document.body.appendChild(p)
})