const SORRY_MESSAGES = ["أنا آسف.. 😔", "سامحيني.. 💔", "حقك علي.. 🙇‍♂️", "لم أكن أقصد.. 😞"];
const APOLOGY_LIST = [
    "أعتذر عن كل لحظة ضيق سببتها لكِ.. أنتِ غالية جداً ❤️",
    "الحياة بدون رضاكِ باهتة، أنا آسف حقاً 🌹",
    "أتمنى أن تقبلي اعتذاري، قلبي لا يتحمل زعلك ✨",
    "50 حجر اعتذار.. هل تكفي لتعبري عن مسامحتك؟ 🥺",
    "أعدك أن أكون أفضل، سامحيني هذه المرة 🌍"
];

let score = 0;
const scoreValue = document.getElementById('score-value');
const gameArea = document.getElementById('game-area');
const playerAvatar = document.getElementById('player-avatar');
const fog = document.getElementById('fog-overlay');
const milestoneOverlay = document.getElementById('milestone-overlay');
const milestoneText = document.getElementById('milestone-text');
const closeMilestone = document.getElementById('close-milestone');

// --------- صوت الألم عند ارتطام الحجر ----------
const painAudio = new Audio('../sounds/oh-sound.wav'); // ضع المسار الصحيح لمجلد sounds حسب مكان الملف
painAudio.volume = 0.6;

// نظام حركة الشخصية
let targetX = window.innerWidth / 2;
let currentX = window.innerWidth / 2;
document.addEventListener('mousemove', (e) => { targetX = e.clientX; });
document.addEventListener('touchmove', (e) => { targetX = e.touches[0].clientX; });

function updateAvatar() {
    currentX += (targetX - currentX) * 0.15;
    const xPercent = (currentX / window.innerWidth) * 100;
    playerAvatar.style.left = `${Math.min(Math.max(xPercent, 5), 95)}%`;
    requestAnimationFrame(updateAvatar);
}
updateAvatar();

function createObject() {
    const isBomb = Math.random() < 0.01; // نسبة القنبلة 1%
    const obj = document.createElement('div');
    obj.className = isBomb ? 'bomb' : 'stone';
    obj.innerHTML = isBomb ? '💣' : ''; // الصخرة مصممة بـ CSS
    
    const xPos = Math.random() * 90 + 5;
    obj.style.left = xPos + '%';
    let topPos = -50;
    gameArea.appendChild(obj);

    function animate() {
        topPos += isBomb ? 6 : 4; 
        obj.style.top = topPos + 'px';

        const rect1 = obj.getBoundingClientRect();
        const rect2 = playerAvatar.getBoundingClientRect();

        // فحص التصادم
        if (!(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
            if (isBomb) {
                triggerExplosion(rect1.left, rect1.top);
            } else {
                collectStone(obj, xPos);
            }
            obj.remove();
            return;
        }

        if (topPos < window.innerHeight) requestAnimationFrame(animate); else obj.remove();
    }
    requestAnimationFrame(animate);
}

function collectStone(obj, xPos) {
    score++;
    scoreValue.textContent = score;

    // تشغيل صوت الألم عند التصادم
    try {
        painAudio.currentTime = 0;
        painAudio.play().catch(()=>{ /* قد يرفض المتصفح التشغيل التلقائي حتى تفاعل المستخدم */ });
    } catch (e) { console.log('خطأ بتشغيل صوت الألم:', e); }

    // تأثير الضباب
    fog.style.opacity = "0.4";
    setTimeout(() => { fog.style.opacity = "0"; }, 300);

    // رسالة طائرة
    const msg = document.createElement('div');
    msg.className = 'floating-msg';
    msg.textContent = SORRY_MESSAGES[Math.floor(Math.random() * SORRY_MESSAGES.length)];
    msg.style.left = `${xPos}%`;
    msg.style.top = '70%';
    gameArea.appendChild(msg);
    setTimeout(() => msg.remove(), 1500);

    // كل 50 حجر
    if (score > 0 && score % 50 === 0) {
        milestoneText.textContent = APOLOGY_LIST[Math.floor(Math.random() * APOLOGY_LIST.length)];
        milestoneOverlay.classList.remove('hidden');
    }
}

function triggerExplosion(x, y) {
    const exp = document.createElement('div');
    exp.className = 'explosion';
    exp.style.left = x + 'px';
    exp.style.top = y + 'px';
    document.body.appendChild(exp);
    setTimeout(() => exp.remove(), 500);

    milestoneText.innerHTML = "لا إله إلا الله 💥<br><small>وقع انفجار بسبب الزعل!</small>";
    milestoneOverlay.classList.remove('hidden');
}

closeMilestone.onclick = () => milestoneOverlay.classList.add('hidden');
setInterval(createObject, 1000);
