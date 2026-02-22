const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 1. تحميل الصور
const playerImg = new Image();
playerImg.src = 'nnamed1.png'; 
const myImg = new Image();
myImg.src = 'nnamed.png'; 

const startGroundImg = new Image();
startGroundImg.src = 'nnamed4.png'; 

const platformImg1 = new Image();
platformImg1.src = 'nnamed2.png'; 
const platformImg2 = new Image();
platformImg2.src = 'nnamed3.png'; 

// 2. الأصوات
const jumpSound = new Audio('sounds/jump-sound.wav');
const hurtSound = new Audio('sounds/oh-sound.wav');

// 3. الإعدادات
const gravity = 0.6;
let cameraY = 0;
let currentCount = 100; 
let hurtText = { show: false, timer: 0 };

const player = {
    x: 100, y: 0,
    width: 50,  
    height: 100, 
    dx: 0, dy: 0,
    speed: 5, jumpPower: -15, grounded: false
};

// 4. السحب
let clouds = [];
for(let i=0; i<12; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 3 - canvas.height,
        speed: 0.1 + Math.random() * 0.3,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.5 + Math.random() * 0.5
    });
}

let platforms = [];

function init() {
    platforms = [];
    platforms.push({ 
        x: -canvas.width, 
        y: canvas.height - 80, 
        w: canvas.width * 2, 
        h: 200, 
        type: 'start', 
        id: 0 
    });
    
    let lastY = canvas.height - 80;
    let lastX = canvas.width / 2;

    for (let i = 0; i < 100; i++) {
        lastY -= 150;
        let width = 140;
        let minX = Math.max(50, lastX - 200);
        let maxX = Math.min(canvas.width - width - 50, lastX + 200);
        lastX = minX + Math.random() * (maxX - minX);

        let type = 'normal';
        if (i > 5) {
            let r = Math.random();
            if (r < 0.2) type = 'spikes';
            else if (r < 0.3) type = 'moving';
        }

        let randomImg = Math.random() > 0.5 ? 1 : 2;

        platforms.push({ 
            x: lastX, y: lastY, w: width, h: 40, 
            type: type, startX: lastX, range: 80, 
            dir: 1, speed: 1.5, id: i+1,
            imgType: randomImg 
        });
    }
    resetPlayerToStart();
}

function resetPlayerToStart() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 180;
    player.dy = 0;
    player.dx = 0;
    cameraY = 0;
    currentCount = 100; 
}

function drawRealisticPlatform(p) {
    if (p.type === 'start') {
        if (startGroundImg.complete) {
            ctx.drawImage(startGroundImg, p.x, p.y, p.w, p.h);
        } else {
            ctx.fillStyle = "#3e2723"; 
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
    } else {
        let currentImg = (p.imgType === 1) ? platformImg1 : platformImg2;
        if (currentImg.complete) {
            ctx.drawImage(currentImg, p.x, p.y, p.w, p.h);
        } else {
            ctx.fillStyle = (p.imgType === 1) ? "#27ae60" : "#2980b9";
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
    }
    
    if (p.type === 'spikes') {
        ctx.fillStyle = "#333";
        let startSpike = p.x + (p.w/2) - 25;
        for(let j=0; j<50; j+=10) {
            ctx.beginPath();
            ctx.moveTo(startSpike + j, p.y);
            ctx.lineTo(startSpike + j + 5, p.y - 15);
            ctx.lineTo(startSpike + j + 10, p.y);
            ctx.fill();
        }
    }
}

function drawCloud(c) {
    ctx.globalAlpha = c.opacity;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 20 * c.size, 0, Math.PI*2);
    ctx.arc(c.x + 20 * c.size, c.y - 10 * c.size, 25 * c.size, 0, Math.PI*2);
    ctx.arc(c.x + 45 * c.size, c.y, 20 * c.size, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    c.x += c.speed;
    if(c.x > canvas.width + 100) c.x = -150;
}

function update() {
    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;
    player.grounded = false;

    platforms.forEach(p => {
        if (p.type === 'moving') {
            p.x += p.speed * p.dir;
            if (Math.abs(p.x - p.startX) > p.range) p.dir *= -1;
        }

        if (player.x < p.x + p.w && player.x + player.width > p.x &&
            player.y + player.height > p.y && player.y + player.height < p.y + p.h + 10) {
            
            if (player.dy > 0) {
                if (p.type === 'spikes') {
                    let startSpike = p.x + (p.w/2) - 25;
                    if (player.x + player.width > startSpike && player.x < startSpike + 50) {
                        hurtText.show = true; 
                        hurtText.timer = 50; 
                        player.dy = -7;
                        hurtSound.currentTime = 0; hurtSound.play(); // صوت الألم
                    }
                }
                player.dy = 0; player.y = p.y - player.height; player.grounded = true;
                if (p.type === 'moving') player.x += p.speed * p.dir;
                currentCount = 100 - p.id; 
            }
        }
    });

    if (player.y > cameraY + canvas.height + 150) {
        resetPlayerToStart();
    }

    cameraY += (player.y - canvas.height / 2 - cameraY) * 0.1;
}

function render() {
    let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, "#2980b9");
    skyGradient.addColorStop(1, "#6dd5fa");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.forEach(c => drawCloud(c));

    ctx.save();
    ctx.translate(0, -cameraY);

    platforms.forEach(p => drawRealisticPlatform(p));

    // صورة الهدف (أسما)
    let lastP = platforms[platforms.length-1];
    try { 
        ctx.drawImage(myImg, lastP.x + 20, lastP.y - 90, 50, 90); 
    } catch(e) {}

    try { ctx.drawImage(playerImg, player.x, player.y, player.width, player.height); } catch(e) {}

    if (hurtText.show && hurtText.timer > 0) {
        ctx.fillStyle = "white"; ctx.font = "bold 18px Cairo"; ctx.textAlign = "center";
        ctx.fillText("تحمل باش تلحق لأسما", player.x + (player.width/2), player.y - 25);
        hurtText.timer--;
    }
    ctx.restore();

    const rectWidth = 180;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(canvas.width - rectWidth - 20, 20, rectWidth, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`باقي: ${currentCount}`, canvas.width - (rectWidth/2) - 20, 52);
    ctx.textAlign = "start"; 

    if (currentCount <= 0) {
        alert("يا عمري لقد وصلت لك أخيراً ❤️ !");
        resetPlayerToStart();
    }

    update();
    requestAnimationFrame(render);
}

// تحكمات اللعبة مع صوت القفز
const setupControls = () => {
    const l = document.getElementById('leftBtn'), r = document.getElementById('rightBtn'), j = document.getElementById('jumpBtn');
    if(l) {
        l.onmousedown = l.ontouchstart = (e) => { e.preventDefault(); player.dx = -player.speed; };
        r.onmousedown = r.ontouchstart = (e) => { e.preventDefault(); player.dx = player.speed; };
        j.onmousedown = j.ontouchstart = (e) => { 
            e.preventDefault(); 
            if(player.grounded) {
                player.dy = player.jumpPower; 
                jumpSound.currentTime = 0; jumpSound.play(); // صوت القفز
            }
        };
        window.onmouseup = window.ontouchend = () => { player.dx = 0; };
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
        if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
        if ((e.key === ' ' || e.key === 'ArrowUp') && player.grounded) {
            player.dy = player.jumpPower;
            jumpSound.currentTime = 0; jumpSound.play(); // صوت القفز
        }
    });
    window.addEventListener('keyup', (e) => { if (['ArrowRight', 'ArrowLeft', 'd', 'a'].includes(e.key)) player.dx = 0; });
};

init();
setupControls();
render();
const jumpAudio = document.getElementById('jumpSound');
const hurtAudio = document.getElementById('hurtSound');

// السماح بتشغيل الأصوات بعد أول تفاعل
let soundAllowed = false;
const allowSound = () => { soundAllowed = true; window.removeEventListener('keydown', allowSound); window.removeEventListener('mousedown', allowSound); window.removeEventListener('touchstart', allowSound); };

window.addEventListener('keydown', allowSound);
window.addEventListener('mousedown', allowSound);
window.addEventListener('touchstart', allowSound);

// تعديل وظيفة القفز لتشغيل الصوت
const setupControlse = () => {
    const l = document.getElementById('leftBtn'),
          r = document.getElementById('rightBtn'),
          j = document.getElementById('jumpBtn');

    if(l){
        l.onmousedown = l.ontouchstart = (e) => { e.preventDefault(); player.dx = -player.speed; };
        r.onmousedown = r.ontouchstart = (e) => { e.preventDefault(); player.dx = player.speed; };
        j.onmousedown = j.ontouchstart = (e) => { 
            e.preventDefault(); 
            if(player.grounded){
                player.dy = player.jumpPower; 
                if(soundAllowed) jumpAudio.currentTime = 0, jumpAudio.play();
            }
        };
        window.onmouseup = window.ontouchend = () => { player.dx = 0; };
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
        if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
        if ((e.key === ' ' || e.key === 'ArrowUp') && player.grounded) { 
            player.dy = player.jumpPower;
            if(soundAllowed) jumpAudio.currentTime = 0, jumpAudio.play();
        }
    });

    window.addEventListener('keyup', (e) => { 
        if (['ArrowRight', 'ArrowLeft', 'd', 'a'].includes(e.key)) player.dx = 0; 
    });
};

// تعديل عند لمس الأشواك
if (player.dy > 0 && p.type === 'spikes') {
    let startSpike = p.x + (p.w/2) - 25;
    if (player.x + player.width > startSpike && player.x < startSpike + 50) {
        hurtText.show = true;
        hurtText.timer = 50;
        player.dy = -7;
        if(soundAllowed) hurtAudio.currentTime = 0, hurtAudio.play(); // تشغيل صوت الألم
    }
}
