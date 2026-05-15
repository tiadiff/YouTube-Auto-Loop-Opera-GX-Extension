// content.js
function createLoopButton() {
    // Evita duplicati: se il pulsante esiste già, non crearlo di nuovo
    if (document.getElementById('gx-yt-loop-btn')) return;

    // Trova i controlli di destra del player (dove c'è l'ingranaggio, schermo intero, ecc.)
    const rightControls = document.querySelector('.ytp-right-controls');
    if (!rightControls) return;

    // Crea il pulsante
    const loopBtn = document.createElement('button');
    loopBtn.id = 'gx-yt-loop-btn';
    loopBtn.className = 'ytp-button';
    loopBtn.title = 'Attiva Loop (Opera GX)';

    // Forza le stesse dimensioni degli altri bottoni di YouTube (Settings, Miniplayer, ecc.)
    loopBtn.style.width = '40px';
    loopBtn.style.height = '100%';
    loopBtn.style.verticalAlign = 'top';
    loopBtn.style.transition = 'transform 0.2s ease';

    // SVG icona del loop, path ricalcolato per essere esattamente al centro (18,18) su una griglia 36x36
    loopBtn.innerHTML = `
        <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" style="margin-left:-30%; margin-top:-20%; pointer-events: none;">
            <path id="gx-loop-path" d="M 13 13 h 10 v 3 l 4 -4 l -4 -4 v 3 H 11 v 6 h 2 V 13 z M 23 23 H 13 v -3 l -4 4 l 4 4 v -3 h 12 v -6 h -2 v 4 z" fill="#eee"></path>
        </svg>
    `;

    // Inserisci prima dell'ultimo elemento (solitamente inserito all'inizio dei controlli di destra)
    rightControls.insertBefore(loopBtn, rightControls.firstChild);

    let isLooping = false;

    // Aggiungi la logica di click
    loopBtn.addEventListener('click', () => {
        const video = document.querySelector('video');
        if (video) {
            isLooping = !isLooping;
            video.loop = isLooping;

            const path = loopBtn.querySelector('#gx-loop-path');
            if (isLooping) {
                // Stile attivo: Colore tipico di Opera GX (rosso #fa1e4e)
                path.setAttribute('fill', '#fa1e4e');
                loopBtn.title = 'Loop: ATTIVO';
                // Piccola animazione
                loopBtn.style.transform = 'scale(1.15)';
                setTimeout(() => loopBtn.style.transform = 'scale(1)', 150);
            } else {
                // Stile inattivo
                path.setAttribute('fill', '#eee');
                loopBtn.title = 'Loop: DISATTIVATO';
            }
        }
    });
}

// YouTube è una SPA (Single Page Application), quindi i video cambiano senza ricaricare la pagina.
// Dobbiamo usare un MutationObserver per assicurarci che il pulsante sia sempre presente.
const observer = new MutationObserver((mutations) => {
    // Cerca il player ad ogni modifica del DOM
    const playerControls = document.querySelector('.ytp-right-controls');
    if (playerControls && !document.getElementById('gx-yt-loop-btn')) {
        createLoopButton();
    }

    // Assicura che lo stato del loop sul video sia consistente con il nostro pulsante
    // a volte YouTube resetta l'attributo "loop" quando si cambia video.
    const video = document.querySelector('video');
    const loopBtn = document.getElementById('gx-yt-loop-btn');
    if (video && loopBtn) {
        const isLooping = loopBtn.querySelector('#gx-loop-path').getAttribute('fill') === '#fa1e4e';
        if (video.loop !== isLooping) {
            video.loop = isLooping;
        }
    }
});

// Inizia a monitorare il body per cambiamenti
observer.observe(document.body, { childList: true, subtree: true });

// Prova ad aggiungere il pulsante subito nel caso la pagina sia già caricata
createLoopButton();
