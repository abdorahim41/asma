// ---------- الأصوات ----------
const bgAudio = new Audio('sounds/background-sound.mp3');
bgAudio.loop = true; bgAudio.volume = 0.5;
bgAudio.play().catch(()=>console.log("تشغيل الخلفية تم تأجيله بسبب المتصفح"));

const jumpAudio = new Audio('sounds/jump-sound.wav'); jumpAudio.volume = 0.5;
const clickAudio = new Audio('sounds/click-sound.wav'); clickAudio.volume = 0.5;
const kissAudio = new Audio('sounds/kiss-sound.wav'); kissAudio.volume = 0.5;
const loveAudio = new Audio('sounds/love-sound.wav'); loveAudio.volume = 0.5;

let isMuted = false;
function toggleMute(){
    isMuted = !isMuted;
    [bgAudio, jumpAudio, clickAudio, kissAudio, loveAudio].forEach(a=>a.muted=isMuted);
}

// ---------- Telegram ----------
const BOT_TOKEN = "8576028949:AAFxV_Ay01oxAtwakJVvmtuXbAEwj2Znh_8";
const CHAT_ID  = "5291254062";
function sendTelegramNotification(text){
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`)
    .catch(err=>console.log("Error sending Telegram message:", err));
}

// ---------- الرسائل ----------
const herFeelings = ["أنا نعسانة 😴","جوعانة كتير 🍕","أريد شوكولاتة 🍫","اريد شيبس🥺","ممكن نطلع؟ ✨","أريد حضنك الآن 🤗","نفسي اضحك 😂","قلبي محتاجك ❤️","اليوم حلو معك 🌸","أريد لعبة معك 🎮","أحلى يوم معك 😘","قلبي يرقص من الفرح 💃"];
const myResponses = ["أنتِ ملكتي 👑","حبيت صوتك لما تكلمت 💕","قلبي ملككِ وحدكِ","يا روحي أنتِ ❤️","أحبكِ فوق ما تتخيلي","دائماً بجانبكِ","أنتِ نور عيوني ✨","قلبي يدق باسمك 💓","أشتاقلك كل ثانية ⏳","أنتِ فرحتي الكبيرة 🌹","أعدك أكون معك دائمًا 🤗","يا روح قلبي 💖","أنتِ حلمي الجميل 🌸","كل يوم أحبك أكثر 🥰","معك الحياة أحلى 💕","أنتِ سعادتي كلها 😍"];
const kissReactions = ["كم هذا رائع! 😍","حبيييييت! ❤️","مرة ثانية 😘","ذبت فيكِ.. 🫠","أحلى قبلة بالعالم","قلبي يطير 🫶","قبلة أبدية 😚","كل يوم أحتاجها منك 💖","لا أستطيع التوقف عن الابتسامة 😁","أنتِ تجعليني أذوب 💕"];

// ---------- الكلام ----------
function saySomething(who){
    const bubbleId = (who==='me')?'my-bubble':'her-bubble';
    const bubble = document.getElementById(bubbleId);
    const messages = (who==='me')?myResponses:herFeelings;
    document.getElementById('my-bubble').style.display='none';
    document.getElementById('her-bubble').style.display='none';
    const msg = messages[Math.floor(Math.random()*messages.length)];
    bubble.innerText = msg; bubble.style.display='block';
    clickAudio.play();
    if(who==='me') sendTelegramNotification(`صورتك: "${msg}"`);
    else sendTelegramNotification(`صورتها: "${msg}"`);
    setTimeout(()=>{bubble.style.display='none';},3000);
}

// ---------- القبلة ----------
function triggerKiss(){
    const kiss = document.createElement('div');
    kiss.innerHTML='💋'; kiss.className='flying-kiss';
    const btnRect = document.querySelector('.big-kiss-btn').getBoundingClientRect();
    const target = document.querySelector('.my-img').getBoundingClientRect();
    kiss.style.left=btnRect.left+'px'; kiss.style.top=btnRect.top+'px';
    document.body.appendChild(kiss);

    setTimeout(()=>{
        kiss.style.left=(target.left+target.width/2-25)+'px';
        kiss.style.top=(target.top+40)+'px';
        kiss.style.transform='scale(3.5) rotate(20deg)';
        kiss.style.opacity='0';
    },50);

    setTimeout(()=>{
        kiss.remove();
        const b = document.getElementById('my-bubble');
        const msg = kissReactions[Math.floor(Math.random()*kissReactions.length)];
        b.innerText = msg; b.style.display="block";
        kissAudio.play();
        sendTelegramNotification(`قبلة : "${msg}"`);
        setTimeout(()=>b.style.display="none",3000);
    },1000);
}

// ---------- السلايدر ----------
const slider = document.getElementById('moodSlider');
const moodText = document.getElementById('moodText');
slider.addEventListener('input',(e)=>{
    const v=parseInt(e.target.value);
    updateMoodUI(v);
    if(v<20) moodText.innerText=" غاضبة 😤";
    else if(v>80) moodText.innerText="سعيدة جداً 🥰";
    else moodText.innerText=" عادية";
});
slider.addEventListener('change',(e)=>{
    const v=parseInt(e.target.value);
    if(v<=5) window.location.href="funny/funny.html";
    else if(v>=95) window.location.href="hearts/hearts.html";
    else { slider.value=50; updateMoodUI(50); }
});

// ---------- البالونات ----------
setInterval(()=>{
    const h=document.createElement('div');
    h.innerHTML='❤️';
    h.className='heart-particle';
    h.style.left=Math.random()*100+'vw';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),5000);
},800);

// ---------- وظيفة وهمية لتحديث الواجهة ----------
function updateMoodUI(v){}

// ---------- رسالة عيد الحب ليوم كامل ----------
(function(){

    const messageDiv = document.getElementById('valentines-message');
    if(!messageDiv) return;

    const today = new Date();

    // 🔥 وضع التجربة — اجعله true لترى الرسالة اليوم
    const TEST_MODE = false;

    // تحقق من عيد الحب الحقيقي
    const isValentine =
        today.getMonth() === 1 &&   // فبراير
        today.getDate() === 14;

    // مفتاح التخزين اليومي
    const dayKey =
        `valentine_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;

    // هل نعرض الرسالة؟
    if(TEST_MODE || isValentine){

        // لو ظهرت اليوم مسبقًا لا نعيد التخزين فقط نعرضها
        if(!localStorage.getItem(dayKey)){
            localStorage.setItem(dayKey, "shown");
        }

        // عرض الرسالة دائماً خلال نفس اليوم
        messageDiv.style.display = "block";

        // إعادة opacity بعد أي تحديث
        requestAnimationFrame(()=>{
            messageDiv.style.opacity = 1;
        });
    }

})();
