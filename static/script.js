let factCount = 0;

/* Load saved history from server */
async function loadHistory() {
    const res = await fetch('/history');
    const facts = await res.json();
    factCount = facts.length;
    const historyEl = document.getElementById('history');
    historyEl.innerHTML = '';
    facts.reverse().forEach(text => addToHistory(text, false));
}

function addToHistory(text, save=true) {
    factCount++;
    const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const li = document.createElement("li");

    li.innerHTML = `<strong style="opacity:.6;">${factCount}.</strong> ${text}
        <small>${time} <span class="copy-icon" onclick="copyOldFact('${text.replace(/'/g,"\\'")}')">📋</span></small>`;

    document.getElementById("history").prepend(li);
}

function copyOldFact(text) { navigator.clipboard.writeText(text); alert("Fact copied!"); }
function copyFact() { navigator.clipboard.writeText(document.getElementById("fact").textContent); }
function toggleTheme() { document.body.classList.toggle("dark"); localStorage.setItem("theme", document.body.classList.contains("dark")?"dark":"light"); }
async function clearHistory() { await fetch('/clear_history'); factCount=0; document.getElementById("history").innerHTML=''; }
async function getFact() {
    try {
        const res = await fetch('/get_fact');
        const data = await res.json();
        document.getElementById('fact').textContent = data.fact;
        addToHistory(data.fact);
    } catch(e) {
        alert("Failed to get fact!");
    }
}

/* Keyboard shortcuts */
document.addEventListener("keydown", e => { if(e.key==="Enter") getFact(); if(e.key.toLowerCase()==="d") toggleTheme(); });

/* Load theme from localStorage */
if(localStorage.getItem("theme")==="dark") document.body.classList.add("dark");

/* Load initial history from server */
loadHistory();
