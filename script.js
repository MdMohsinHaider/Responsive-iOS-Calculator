let memory = 0;
let expression = '';
const HISTORY_KEY = 'calc_history';

const inputEl = document.getElementById('calc-input');
const expressionEl = document.getElementById('calc-expression');
const historyEl = document.getElementById('calc-history');

// Update status bar clock from device, format 12h AM/PM
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minuteStr = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('current-time').textContent = hours + ':' + minuteStr + ' ' + ampm;
}
setInterval(updateClock, 1000);
updateClock();

function appendValue(val) {
    if (inputEl.value === 'Error') inputEl.value = '';
    inputEl.value += val;
    expression += val;
    expressionEl.textContent = expression;
}

function clearInput() {
    inputEl.value = '';
    expression = '';
    expressionEl.textContent = '';
}

function calculateResult() {
    try {
        let result = eval(inputEl.value);
        saveToHistory(`${inputEl.value} = ${result}`);
        inputEl.value = result;
        expression = '';
        expressionEl.textContent = '';
    } catch (err) {
        inputEl.value = 'Error';
    }
    refreshHistory();
}

function memoryAdd() {
    memory += parseFloat(inputEl.value || 0);
}
function memorySubtract() {
    memory -= parseFloat(inputEl.value || 0);
}
function memoryClear() {
    memory = 0;
}
function memoryRecall() {
    inputEl.value = memory;
}

function saveToHistory(calc) {
    let hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    hist.push(calc);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
}

function refreshHistory() {
    let hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (hist.length === 0) {
        historyEl.innerHTML = "<span style='color:#889'>No history yet.</span>";
    } else {
        historyEl.innerHTML = hist.slice(-5).map(h => `<div>${h}</div>`).reverse().join('');
    }
}

function deleteHistory() {
    localStorage.removeItem(HISTORY_KEY);
    refreshHistory();
}

// SHARE POPUP LOGIC
function openSharePopup() {
    document.getElementById('share-popup').style.display = 'flex';
}
function closeSharePopup() {
    document.getElementById('share-popup').style.display = 'none';
}
function shareHistory(method) {
    let hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    let text = hist.slice(-5).reverse().join('\n');
    if (text.length === 0) {
        alert('No history to share.');
        closeSharePopup();
        return;
    }
    if (method === 'whatsapp') {
        let shareUrl = "https://wa.me/?text=" + encodeURIComponent(text);
        window.open(shareUrl, '_blank');
    } else if (method === 'email') {
        let mailUrl = "mailto:?subject=Calculator History&body=" + encodeURIComponent(text);
        window.open(mailUrl, '_blank');
    } else if (method === 'sms') {
        let smsUrl = "sms:?body=" + encodeURIComponent(text);
        window.open(smsUrl, '_blank');
    }
    closeSharePopup();
}

window.onload = refreshHistory;
