const googleUrl = "https://script.google.com/macros/s/AKfycbyX8xb68npYAfoDo6aK25lSCo2r6fB_oaGQyCaVJGfrmyVBkh-ko923P02TwYPPONFyzg/exec";

window.handleResponse = function(data) {
    const chat = document.getElementById('chat');
    const btn = document.getElementById('btn');
    
    try {
        let parsed = (typeof data === 'string') ? JSON.parse(data) : data;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);

        let resText = Array.isArray(parsed) ? parsed[0].generated_text : (parsed.generated_text || "Ошибка данных");
        const lastQuery = sessionStorage.getItem('lastQuery') || "";
        
        chat.innerHTML += `<div class="ai-msg">${resText.replace(lastQuery, "").trim()}</div>`;
    } catch (e) {
        chat.innerHTML += `<div style="color:red">Ошибка обработки: ${e.message}</div>`;
    }

    btn.disabled = false;
    btn.innerText = "ПУСК";
    chat.scrollTop = chat.scrollHeight;
    
    const oldScript = document.getElementById('api-request');
    if(oldScript) oldScript.remove();
};

function send() {
    const inp = document.getElementById('inp');
    const chat = document.getElementById('chat');
    const btn = document.getElementById('btn');
    const val = inp.value.trim();

    if(!val) return;
    
    sessionStorage.setItem('lastQuery', val);
    chat.innerHTML += `<div class="user-msg">> ${val}</div>`;
    inp.value = "";
    btn.disabled = true;
    btn.innerText = "...";

    const script = document.createElement('script');
    script.id = 'api-request';
    script.src = `${googleUrl}?inputs=${encodeURIComponent(val)}&callback=handleResponse&ts=${Date.now()}`;
    
    script.onerror = function() {
        chat.innerHTML += `<div style="color:red">! Ошибка шлюза. Проверьте Deploy.</div>`;
        btn.disabled = false;
        btn.innerText = "ПУСК";
    };

    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inp').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') send();
    });
});
