/* 常用变量定义 */
let config = {
    /* 游戏状态 
    0：游戏未开始
    1：游戏进行中
    2：游戏结束
    */
    status:0,
    /*病毒生成时间间隔800ms*/
    interval:800,
    /* 病毒下落动画速度 */
    speed:1,
    /* 关卡数 */
    level:1
}
/* 分数 */
let score = 0;
/* 开始页面 */
let startAlert = document.getElementById("start-alert");
let gameDesc = document.querySelector(".game-desc");
let footer = document.querySelector("#start-alert footer");

startAlert.onclick = function(){

    console.log("游戏开始")
    /* 添加ui层图片移动样式 */
    gameDesc.classList.add('slide-up');
    footer.classList.add('slide-down');
    /* 游戏开始后开始界面不显示 */
    setTimeout(function(){
        startAlert.style.display = 'none';
    },500);

    startGame();
    /* 更新游戏状态属性 */
    config.status = 1;
}

/* 开始游戏函数 */
let timer,updater;

function startGame(){
    /* config.interval控制病毒生成时间 */
    timer = setInterval(function(){
        makeVirus();
    },config.interval);

    /* 更新病毒元素位置的定时器*/
    updater = setInterval(function(){
        /* 调用下落动画 */
        update();
    },16)
    
}

/* 获取游戏层 */
let game  = document.getElementById("game");
let stage = document.getElementById("stage");

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]
/* 生成病毒元素 */
let virues = []
function makeVirus(){
    let virus = document.createElement('div');
    virus.setAttribute('class','virus');
    let p = document.createElement('p');
    p.classList.add('letter');
    virus.appendChild(p);

    /* 随机生成字母 */
    let letter = letters[Math.floor(Math.random()*26)];
    p.innerHTML = letter
    /* 随机病毒水平位置 */
    virus.style.left = Math.random() * (stage.offsetWidth -100) + 'px';
    /* 记录字母值异步后续监听 */
    virus.letter =  letter;

    // 设置病毒的颜色
    switch(Math.floor(Math.random() * 6)){
        case 0:
            p.style.backgroundImage = 'radial-gradient(rgba(255,150,150,0),rgba(255,0,0,1))';
            p.style.boxShadow = '0 0 15px #f00';
            break;
        case 1:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 255, 0, 0),rgba(0,255,0,1))';
            p.style.boxShadow = '0 0 15px #f00'; 
            break;
        case 2:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 0, 255, 0),rgba(0,0,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; 
            break;
        case 3:
            p.style.backgroundImage = 'radial-gradient(rgba(255, 255, 0, 0),rgba(255,255,0,1))';
            p.style.boxShadow = '0 0 15px #f00'; 
            break;
        case 4:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 255, 255, 0),rgba(0,255,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; 
            break;
        case 5:
            p.style.backgroundImage = 'radial-gradient(rgba(255, 0, 255, 0),rgba(255,0,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; 
            break;
    }
   
    /* 病毒插入页面 */
    game.appendChild(virus);
    virues.push(virus)
}

// update 动画，刷新病毒元素的位置
let winH =stage.offsetHeight;

/* 获得ui层 */
let uiLayer = document.getElementById("ui");

function update(){

    for(let i = 0;i < virues.length;i++){
        let virus = virues[i];
        /* 病毒下落速度，击中分数越多，病毒下落速度越来越快 */
        virus.style.top = virus.offsetTop + config.speed + (score *0.3) + 'px'

        /* 病毒位置大于屏幕就消失 */
        if(virus.offsetTop > (winH - 200) && !uiLayer.warning ){
            showWarning()
            uiLayer.warning = true;
        }else if(virus.offsetTop >= winH){

            gameOverAlert.querySelector('h1').innerText = '任务失败';
            restartBtn.innerText = "重试本关";
            // game over
            gameOver()
        }else if(score > 14){
            /* 分数大于14进入下一关，关卡数自加 */
            nextLevel();
          
        }
    }
}

/* 警告功能函数 */

function showWarning(){
    let warningLayer = document.createElement('div')
    warningLayer.setAttribute('class','warning')
    uiLayer.appendChild(warningLayer)
}

/* 游戏结束 */
let gameOverAlert = document.getElementById('game-over-alert')
function gameOver(){
    clearInterval(timer)
    clearInterval(updater)
    config.status = 2;
    gameOverAlert.style.display = 'block'
}


/* 分数标签获取 */
let scoreLabel = document.getElementById('score-label')
/* 获取消灭音效标签 */
let xmEffect = document.getElementById('xm')

/* 监听键盘事件消灭病毒 */
window.addEventListener('keyup',function(e){
    let key = e.key;

    for(let i = 0;i < virues.length;i++){
        let virus = virues[i]

        if(virus.letter.toLowerCase() === key.toLocaleLowerCase() && config.status === 1){

            // 键盘输入与病毒virus.lette匹配切换病毒图片
            let dieImg = document.createElement('img')
            game.appendChild(dieImg)
            dieImg.src = './imgs/virus-die.png'
            dieImg.style.position = 'absolute'
            dieImg.style.left = virus.offsetLeft + 'px'
            dieImg.style.top = virus.offsetTop + 'px'
            /* 病毒1s内变透明 */
            dieImg.classList.add('fade-out')
            /* 透明的病毒消失 */
            setTimeout(function(){
                game.removeChild(dieImg)
            },1000)
            game.removeChild(virus)
            virues.splice(i,1)

            // 播放消灭音效
            xmEffect.currentTime = 0;
            xmEffect.play()

            /* 增加分数，并修改分数显示 */
            score++;
            scoreLabel.innerHTML = score

        }
    }
})

// 重玩
let restartBtn = document.getElementById('restart-btn');
restartBtn.onclick = function(){
    gameOverAlert.style.display = 'none'
    resetGame()
}

function resetGame(){
    config.status = 1;
    scoreLabel.innerHTML = score;
    game.innerHTML = ''
    virues = []
    /* 警告页面删除时，需要删除警告页面 */
    if(uiLayer.warning){
        uiLayer.removeChild(document.querySelector('.warning'))
        uiLayer.warning = false;
    }
    /* 关卡数自加 */
    if(score>14){
        config.level++;
    }
    /* 重新渲染关卡数 */
    levelLabel.innerText = `第${config.level}关`;
    score = 0;
    startGame()
}
/* 获取关卡标签 */
let levelLabel = document.getElementById('level-label');
/* 下一关卡 */
function nextLevel(){
    gameOverAlert.querySelector('h1').innerText = '恭喜过关';
    restartBtn.innerText = "下一关";
    gameOver();
    /* 修改下一关速度初始值 */
    config.speed *= 1.25;
}