// الأصوات
const collectAudio = new Audio('sounds/love-sound.wav');
collectAudio.volume = 0.5;

const bgAudio = new Audio('sounds/background-sound.mp3');
bgAudio.volume = 0.5;
bgAudio.loop = true;
bgAudio.play().catch(()=>{}); // تشغيل الخلفية

// رسائل صغيرة وكبيرة
const LOVE_MESSAGES = [
    "أنتِ أجمل صدفة ❤️","ضحكتك تضيء عالمي ✨","أحبك أكثر من أمس 🌹",
    "معك أشعر بالأمان 🤗","أنتِ ملكة قلبي 👑","وجودك بجانبي يكفيني 💖"
];

const BIG_MILESTONE_LIST = [
    "إنجاز جديد في حبنا! أنتِ الأفضل دائماً ❤️",
    "50 نبضة حب لعيونك الجميلة ✨",
    "كلما زاد الرقم، زاد حبي لكِ أضعافاً 🌹",
    "أنتِ ملكة قلبي، وهذا السكور دليل بسيط 👑",
    "لا يوجد رقم يمكنه قياس مقدار معزتك عندي 🌍",
    "استمري يا أميرتي، فأنا أحب رؤية حماسك 💖",
    "خطوات أخرى نحو عالمنا السعيد معاً 🥰"
];

// العناصر
let score = 0;
const scoreValue = document.getElementById('score-value');
const gameArea = document.getElementById('game-area');
const playerAvatar = document.getElementById('player-avatar');
const milestoneOverlay = document.getElementById('milestone-overlay');
const milestoneText = document.getElementById('milestone-text');
const closeMilestone = document.getElementById('close-milestone');

// حركة سلسة
let targetX = window.innerWidth/2;
let currentX = window.innerWidth/2;

document.addEventListener('mousemove', (e)=>{ targetX = e.clientX; });
document.addEventListener('touchmove', (e)=>{ targetX = e.touches[0].clientX; });

function updateAvatar(){
    currentX += (targetX-currentX)*0.15;
    const xPercent = (currentX/window.innerWidth)*100;
    playerAvatar.style.left = `${Math.min(Math.max(xPercent,5),95)}%`;
    requestAnimationFrame(updateAvatar);
}
updateAvatar();

// تصادم
function checkCollision(heart, avatar){
    const r1 = heart.getBoundingClientRect();
    const r2 = avatar.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

// إنشاء قلب
function createHeart(){
    const heart = document.createElement('div');
    heart.className='heart-drop';
    heart.innerHTML='❤️';
    const xPos = Math.random()*90+5;
    heart.style.left=xPos+'%';
    let topPos=-50;
    gameArea.appendChild(heart);
    const fallSpeed = 3.5;

    function animateFall(){
        topPos+=fallSpeed;
        heart.style.top=topPos+'px';

        if(checkCollision(heart, playerAvatar)){
            collectHeart(heart);
            return;
        }
        if(topPos<window.innerHeight) requestAnimationFrame(animateFall);
        else heart.remove();
    }
    requestAnimationFrame(animateFall);
}

// جمع قلب
function collectHeart(heart){
    if(heart.getAttribute('data-hit')) return;
    heart.setAttribute('data-hit','true');
    heart.remove();

    score++;
    scoreValue.textContent = score;

    collectAudio.currentTime=0;
    collectAudio.play();

    // انفجار عند موقع الشخصية
    const avatarRect = playerAvatar.getBoundingClientRect();
    const originX = (avatarRect.left+avatarRect.width/2)/window.innerWidth;
    const originY = (avatarRect.top+avatarRect.height/2)/window.innerHeight;

    confetti({ particleCount:15, spread:40, origin:{x:originX, y:originY} });

    // رسالة عشوائية
    const msg = document.createElement('div');
    msg.className='floating-msg';
    msg.textContent = LOVE_MESSAGES[Math.floor(Math.random()*LOVE_MESSAGES.length)];
    msg.style.left=heart.style.left;
    msg.style.top='70%';
    gameArea.appendChild(msg);
    setTimeout(()=>msg.remove(),2000);

    if(score>0 && score%50===0){
        const randomBigMsg = BIG_MILESTONE_LIST[Math.floor(Math.random()*BIG_MILESTONE_LIST.length)];
        milestoneText.textContent=randomBigMsg;
        milestoneOverlay.classList.remove('hidden');
        confetti({ particleCount:150, spread:100, origin:{x:originX, y:originY} });
    }
}

// إغلاق المنبثق
if(closeMilestone){
    closeMilestone.onclick=()=> milestoneOverlay.classList.add('hidden');
}

// توليد قلب جديد كل ثانية
setInterval(createHeart,1100);
