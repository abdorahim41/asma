// 🔐 القيم المشفرة للاسم وكلمة السر
const correctUserHash =
"eae2f7c172752927c739e062a62c612ce7e3761cd046f4872b05bcd805105f75";

const correctPassHash =
"eae2f7c172752927c739e062a62c612ce7e3761cd046f4872b05bcd805105f75";


// 🔒 دالة تحويل النص إلى SHA-256
async function sha256(text) {

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashBuffer =
        await crypto.subtle.digest("SHA-256", data);

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


// 🚀 دالة تسجيل الدخول
async function login() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const userHash = await sha256(username);
    const passHash = await sha256(password);

    if (userHash === correctUserHash &&
        passHash === correctPassHash) {

        // ✅ نجاح الدخول
        window.location.href = "asmaa/inde.html";

    } else {

        document.getElementById("error").innerText =
            "اسم أو كلمة السر خاطئة";

    }
}
