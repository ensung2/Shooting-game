let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
document.body.appendChild(canvas)
canvas.width = 500;
canvas.height = 500;

let backgroundImg, gunImg, bulletImg, villainImg ,gameOverImg;
let gameOver=false // true면 게임오버, false는 게임중
let score=0;
let grade=0;

// 총 좌표
let gunX = canvas.width/2 - 32;
let gunY = canvas.height-70;

// 총알 저장 리스트(탄창)
let bulletList =[];

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

// 빌런 좌표
let villainList=[];

function Villain(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.y=0;
        this.x=generateRandomValue(0,canvas.width-48);

        villainList.push(this);
    }
    this.update=function(){
        this.y+=2;

        if(this.y >= canvas.height-64){
            gameOver=true;
        }
    }
}


// 총알 좌표
function Bullet(){
    this.x=0;
    this.y=0;
    // 총알 초기화
    this.init=function(){
        this.x=gunX+40;
        this.y=gunY;
        this.alive=true // 총알의 생사확인
        bulletList.push(this)
    }

    this.update = function(){
        this.y-=4;
    }

    this.checkHit=function(){
        for(let i=0; i<villainList.length;i++){
            if(this.y<=villainList[i].y && this.x>=villainList[i].x && this.x<=villainList[i].x+40)
            {score++;
            this.alive=false;
            villainList.splice(i,1) // 잘라냄
            }
        }
        
    }
}

// 사용될 이미지
function loadImage(){

    backgroundImg = new Image();
    backgroundImg.src="img/game_01_bg.jpg";

    gunImg = new Image();
    gunImg.src="img/game_01_gun.png";

    bulletImg = new Image();
    bulletImg.src="img/game_01_bullet.png";

    villainImg = new Image();
    villainImg.src="img/game_01_villain.png";

    gameOverImg = new Image();
    gameOverImg.src="img/gameOver.png";

}
let keysDown={}
function setupKeyboardListener() {
    document.addEventListener("keydown",function(event){
        // console.log("?",event.keycode)
        keysDown[event.keyCode] = true;
    });

    document.addEventListener("keyup",function(){
        delete keysDown[event.keyCode]
        if(event.keyCode==32) {
            createBullet();  // 총알 생성
        }
    });
}

function createBullet(){
    let b = new Bullet();
    b.init();
}


function createVillain(){
    const interval = setInterval(function(){
        let v = new Villain();
        v.init();
    },1000)
}

function update(){
    if(39 in keysDown) {
        gunX+=3;
    }   // right
    if(37 in keysDown) {
        gunX-=3;
    }   // left

    if(gunX <=0) {
        gunX=0;
    }
    if(gunX>=canvas.width-64) {
        gunX=canvas.width-64;
    }

    for(let i=0; i<bulletList.length; i++) {
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
    }
    }

    for(let i=0; i<villainList.length; i++) {
        villainList[i].update()
    }
}


function render() {
    // 이미지 그릴 좌표
    ctx.drawImage(backgroundImg, 0,0, canvas.width, canvas.height);
    ctx.drawImage(gunImg, gunX, gunY);
    ctx.fillText(`Score : ${score} (학점 ${grade})`, 15, 25);
    ctx.font = "20px KyoboHand"
    ctx.fillStyle="#23a4ff";
    if (score >= 55) {
        grade = 'A';
    } else if (score >= 40) {
        grade = 'B';
    } else if (score >= 15) {
        grade = 'C';
    } else if (score >= 5) {
        grade = 'D';        
    } else {
        grade = 'F';
    }
    
    for(let i=0; i<bulletList.length; i++) {
        if(bulletList[i].alive){
            ctx.drawImage(bulletImg, bulletList[i].x, bulletList[i].y)
        }
    };

    for(let i=0; i<villainList.length; i++) {
        ctx.drawImage(villainImg, villainList[i].x, villainList[i].y)
    };
}

function main(){
    if(!gameOver) {

    update();   // 좌표값 업데이트
    render();   // 후에 그려줌
    requestAnimationFrame(main);    // 메인반복
    }else {
        ctx.drawImage(gameOverImg, 130, 200, 250, 100)
    }
}


loadImage();
setupKeyboardListener();
createVillain();
main();