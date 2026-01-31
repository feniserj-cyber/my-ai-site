const googleUrl = "ВСТАВЬ_СВОЮ_ССЫЛКУ_ЗДЕСЬ";

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
        chat.innerHTML += `<div style="color:red">Ошибка: ${e.message}</div>`;
    }

    btn.disabled = false;
    btn.innerText = "ПУСК";
    chat.scrollTop = chat.scrollHeight;
    if(document.getElementById('api-request')) document.getElementById('api-request').remove();
};

function send() {
    const val = document.getElementById('inp').value.trim();
    if(!val) return;
    
    sessionStorage.setItem('lastQuery', val);
    document.getElementById('chat').innerHTML += `<div class="user-msg">> ${val}</div>`;
    document.getElementById('inp').value = "";
    document.getElementById('btn').disabled = true;

    const script = document.createElement('script');
    script.id = 'api-request';
    script.src = `${googleUrl}?inputs=${encodeURIComponent(val)}&callback=handleResponse&ts=${Date.now()}`;
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inp').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') send();
    });
});