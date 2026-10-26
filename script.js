// ================= Particles & Sound =================
document.addEventListener("DOMContentLoaded", function() {
    const audio = new Audio("https://www.soundjay.com/button/sounds/button-6.mp3");
    audio.play();
    setTimeout(() => { document.querySelector('.particles').style.display = 'none'; }, 1000);
    createParticles(50);
});
function createParticles(num) {
    const particlesContainer = document.createElement("div");
    particlesContainer.classList.add("particles");
    for (let i = 0; i < num; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = Math.random() * 100 + "vh";
        particle.style.animationDelay = Math.random() * 2 + "s";
        particlesContainer.appendChild(particle);
    }
    document.body.appendChild(particlesContainer);
}

// ================= Classifica Normale =================
function updateStandingsNormale(activeInput) {
    const table = document.querySelector('#standings-normale table tbody');
    if (!table) return;
    
    // Salva i dettagli dell'input attivo prima di toccare la tabella
    let activeTeam = null;
    let activeClass = null;
    let selectionStart = null;
    let selectionEnd = null;
    
    if (activeInput) {
        activeTeam = activeInput.getAttribute('data-team');
        activeClass = activeInput.className;
        selectionStart = activeInput.selectionStart;
        selectionEnd = activeInput.selectionEnd;
    }
    
    let rows = Array.from(table.querySelectorAll('tr'));

    // 1. Esegui i calcoli automatici
    rows.forEach(row => {
        const puntiInput = row.querySelector('.punti-input');
        const wins = parseFloat(row.querySelector('.w-input').value) || 0;
        const draws = parseFloat(row.querySelector('.d-input').value) || 0;
        const goalsFor = parseFloat(row.querySelector('.gf-input').value) || 0;
        const goalsAgainst = parseFloat(row.querySelector('.gs-input').value) || 0;

        const diffGoals = goalsFor - goalsAgainst;
        const drCell = row.querySelector('.dr-cell');
        if (drCell) drCell.textContent = diffGoals;

        // Aggiorna i punti solo se l'utente sta modificando Vittorie (w-input) o Pareggi (d-input)
        if (activeInput && (activeInput.classList.contains('w-input') || activeInput.classList.contains('d-input'))) {
            if (puntiInput) {
                puntiInput.value = (wins * 3) + (draws * 1);
            }
        }
    });

    // 2. Ordina le righe
    rows.sort((a, b) => {
        const pointsA = parseFloat(a.querySelector('.punti-input').value) || 0;
        const pointsB = parseFloat(b.querySelector('.punti-input').value) || 0;

        if (pointsA !== pointsB) {
            return pointsB - pointsA; 
        }

        const diffGoalsA = parseFloat(a.querySelector('.dr-cell').textContent) || 0;
        const diffGoalsB = parseFloat(b.querySelector('.dr-cell').textContent) || 0;
        return diffGoalsB - diffGoalsA;
    });


   // 3. Aggiorna l'ordine visivo e i colori delle posizioni
    rows.forEach((row, index) => {
    table.appendChild(row);
    
    const positionSpan = row.querySelector('td span');
    if (positionSpan) {
        const pos = index + 1;
        
        // 1. Rimuovi le vecchie classi di colore per evitare conflitti sullo sfondo
        positionSpan.classList.remove('green', 'gold');
        
        // 2. Gestisci i colori e i bordi in base alla posizione reale (pos)
        if (pos === 1) {
            positionSpan.classList.add('green'); // Sfondo verde per il 1°
            positionSpan.setAttribute('style', 'border-left: 4px solid #ffcc00; padding-left: 6px;');
        } else if (pos === 2) {
            positionSpan.classList.add('gold');  // Sfondo oro per il 2°
            positionSpan.setAttribute('style', 'border-left: 4px solid #ffcc00; padding-left: 6px;');
        } else if (pos === 3) {
            positionSpan.classList.add('gold');  // Sfondo oro per il 3° (se previsto dal tuo HTML originario, altrimenti pos-eliminated)
            positionSpan.setAttribute('style', 'border-left: 4px solid #ff0000; padding-left: 6px;');
        } else {
            positionSpan.setAttribute('style', 'padding-left: 10px;'); 
        }
        
        positionSpan.textContent = pos;
    }
});


    // 4. RIPRISTINA IL FOCUS: Cerca la stessa casella nella nuova tabella ordinata e rimetti il cursore
    if (activeTeam && activeClass) {
        const inputToFocus = table.querySelector(`input[data-team="${activeTeam}"].${activeClass}`);
        if (inputToFocus) {
            inputToFocus.focus();
            // Mantiene l'eventuale selezione del testo o la posizione del cursore
            if (inputToFocus.setSelectionRange && selectionStart !== null) {
                inputToFocus.setSelectionRange(selectionStart, selectionEnd);
            }
        }
    }
}
// Calcolo iniziale a pagina vuota o caricata
document.addEventListener("DOMContentLoaded", () => {
    updateStandingsNormale(null);
});

function toggleCriteria(event) {
    // Impedisce eventuali comportamenti di refresh o salti della pagina
    event.preventDefault(); 
    
    const button = event.currentTarget;
    const box = document.getElementById('criteria-box');
    
    // Attiva o disattiva la classe 'active' sia sul bottone che sul box
    button.classList.toggle('active');
    box.classList.toggle('active');
}



// ================= Classifica Holidays =================
function updateStandingsHE() {
    // Cerca specificatamente la tabella dentro la sezione #standings
    // Nota: Se la prima classifica ha un ID diverso (es. #standings-he), cambialo qui sotto
    const tableHE = document.querySelector('#standings .standings-table tbody');
    if (!tableHE) return;
    
    let rowsHE = Array.from(tableHE.querySelectorAll('tr'));

    rowsHE.forEach(rowHE => {
        const inputsHE = rowHE.querySelectorAll('input');
        const cellsHE = rowHE.querySelectorAll('td');
        
        // Ordine prima tabella: 0=Giocate, 1=Vittorie, 2=Sconfitte, 3=Gol Fatti, 4=Gol Subiti
        const goalsForHE = parseFloat(inputsHE[3].value) || 0;
        const goalsAgainstHE = parseFloat(inputsHE[4].value) || 0;
        const diffGoalsHE = goalsForHE - goalsAgainstHE;

        // Scrive la differenza reti nell'ultima cella (indice 7)
        if (cellsHE[7]) {
            cellsHE[7].textContent = diffGoalsHE;
            cellsHE[7].style.fontWeight = "bold";
            cellsHE[7].style.textAlign = "center";
        }
    });

    rowsHE.sort((aHE, bHE) => {
        const inputsA_HE = aHE.querySelectorAll('input');
        const inputsB_HE = bHE.querySelectorAll('input');

        const winsA_HE = parseFloat(inputsA_HE[1].value) || 0;
        const lossesA_HE = parseFloat(inputsA_HE[2].value) || 0;
        const winsB_HE = parseFloat(inputsB_HE[1].value) || 0;
        const lossesB_HE = parseFloat(inputsB_HE[2].value) || 0;

        const diffWinsLossesA = winsA_HE - lossesA_HE;
        const diffWinsLossesB = winsB_HE - lossesB_HE;

        if (diffWinsLossesA !== diffWinsLossesB) {
            return diffWinsLossesB - diffWinsLossesA; 
        }

        const diffGoalsA_HE = parseFloat(aHE.querySelectorAll('td')[7].textContent) || 0;
        const diffGoalsB_HE = parseFloat(bHE.querySelectorAll('td')[7].textContent) || 0;
        return diffGoalsB_HE - diffGoalsA_HE;
    });

    rowsHE.forEach((rowHE, indexHE) => {
        tableHE.appendChild(rowHE);
        const positionSpanHE = rowHE.querySelector('td span');
        if (positionSpanHE) {
            const posHE = indexHE + 1;
            if (posHE === 1) {
                positionSpanHE.setAttribute('style', 'border-left: 4px solid #90ee90; padding-left: 6px;');
                positionSpanHE.textContent = "1";
            } else if (posHE === 2) {
                positionSpanHE.setAttribute('style', 'border-left: 4px solid #ffd700; padding-left: 6px;');
                positionSpanHE.textContent = "2";
            } else if (posHE === 3) {
                positionSpanHE.setAttribute('style', 'border-left: 4px solid #ffd700; padding-left: 6px;');
                positionSpanHE.textContent = "3*";
            } else {
                positionSpanHE.setAttribute('style', 'padding-left: 10px;'); 
                positionSpanHE.textContent = posHE;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. LOGICA DELLO SLIDER GALLERIA (FRECCE)
    // ==========================================
    const wrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        if (totalSlides > 0) {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    if (nextBtn && prevBtn && totalSlides > 0) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Impedisce l'apertura del fullscreen quando si clicca la freccia
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Impedisce l'apertura del fullscreen quando si clicca la freccia
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    // ==========================================
    // 2. LOGICA IMMAGINE INTERA (LIGHTBOX)
    // ==========================================
    // Crea dinamicamente il contenitore per lo schermo intero
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox-overlay';
    lightbox.style.cssText = `
        position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(255,255,255,0.2);
    `;
    
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    // Mostra l'immagine intera quando si clicca su una slide
    slides.forEach(slide => {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', () => {
            const img = slide.querySelector('img');
            if (img && img.src && !img.src.includes('link_immagine_')) {
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina sotto
            }
        });
    });

    // Chiudi la modalitÃ  schermo intero quando si clicca sullo sfondo nero
    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Ripristina lo scroll della pagina
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    // 1. Apri/Chiudi il menu al click su "Edizioni"
    dropbtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active');
    });

    // 2. Chiudi automaticamente il menu quando clicchi su una sottofinestra (Edizione)
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    });

    // 3. Chiudi il menu se clicchi in un punto qualsiasi fuori dalla navbar
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});


// TAG CORONA COLLEGAMENTO
// Usiamo una funzione sicura che si avvia subito senza subire i blocchi degli altri errori
(function() {
    class CoronaElement extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `<img src="./img/crown.png" height="30px" style="pointer-events: auto; vertical-align: middle;">`;
        }
    }

    try {
        // trattino obbligatorio
        if (!customElements.get('corona-ll')) {
            customElements.define('corona-ll', CoronaElement);
        }
    } catch (e) {
        console.error("Errore nella registrazione del tag corona:", e);
    }
})();

// CAMBIO COMPETIZIONE MEMBRI SQUADRA
function toggleComp(selectElement) {
    const card = selectElement.closest('.player-card');
    const champStats = card.querySelector('.championship-stats');
    const cupStats = card.querySelector('.cup-stats');
    
    if (selectElement.value === 'cup') {
        champStats.style.display = 'none';
        cupStats.style.display = 'flex';
    } else {
        champStats.style.display = 'flex';
        cupStats.style.display = 'none';
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const openWheelBtn = document.getElementById("openWheelBtn");
    const cancelWheelBtn = document.getElementById("cancelWheelBtn");
    const wheelModal = document.getElementById("wheelModal");
    const wheelContainer = document.getElementById("wheelContainer");
    const wheelCenterBtn = document.getElementById("wheelCenterBtn");
    const wheelItems = Array.from(document.querySelectorAll(".wheel-item"));

    if (!wheelContainer || !openWheelBtn) return;

    let currentAngle = 0;
    let isDragging = false;
    let dragMoved = false;
    let startAngle = 0;
    let selectedIndex = 0;
    let radius = 110; 

    if (window.innerWidth <= 480) {
        radius = 85;
    }

    // Apri / Chiudi
    openWheelBtn.addEventListener("click", () => wheelModal.classList.add("active"));
    const closeModal = () => wheelModal.classList.remove("active");
    cancelWheelBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && wheelModal.classList.contains("active")) {
            closeModal();
        }
    });

    // Seleziona la squadra e aggiorna il tasto "APRI"
    function selectTeam(index) {
        selectedIndex = index;
        wheelItems.forEach((item, idx) => {
            if (idx === index) {
                item.classList.add("selected");
                wheelCenterBtn.href = item.getAttribute("href");
            } else {
                item.classList.remove("selected");
            }
        });
    }

    // Posiziona gli elementi in cerchio
    function updateWheelPosition() {
        const totalItems = wheelItems.length;
        const angleStep = 360 / totalItems;

        wheelItems.forEach((item, index) => {
            const itemAngle = currentAngle + (index * angleStep);
            const rad = (itemAngle - 90) * (Math.PI / 180);

            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            item.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Ruota fino a portare l'elemento selezionato in alto
    function rotateToItem(index) {
        const totalItems = wheelItems.length;
        const angleStep = 360 / totalItems;
        currentAngle = - (index * angleStep);
        updateWheelPosition();
        selectTeam(index);
    }

    // Click Diretto sulle Squadre
    wheelItems.forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.preventDefault(); 
            if (!dragMoved) {
                rotateToItem(index);
            }
        });
    });

    // Gestione Gestures & Mouse
    function getPointerAngle(e) {
        const rect = wheelContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }

    function startDrag(e) {
        isDragging = true;
        dragMoved = false;
        startAngle = getPointerAngle(e) - currentAngle;
    }

    function moveDrag(e) {
        if (!isDragging) return;
        dragMoved = true;
        e.preventDefault();
        currentAngle = getPointerAngle(e) - startAngle;
        updateWheelPosition();

        // Calcola la squadra più vicina alla cima in base alla rotazione
        const totalItems = wheelItems.length;
        const angleStep = 360 / totalItems;
        let normalizedAngle = (-currentAngle) % 360;
        if (normalizedAngle < 0) normalizedAngle += 360;
        
        const closestIndex = Math.round(normalizedAngle / angleStep) % totalItems;
        selectTeam(closestIndex);
    }

    function stopDrag() {
        isDragging = false;
    }

    // Eventi Pointer / Touch
    wheelContainer.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", stopDrag);

    wheelContainer.addEventListener("touchstart", startDrag, { passive: false });
    window.addEventListener("touchmove", moveDrag, { passive: false });
    window.addEventListener("touchend", stopDrag);

    // Inizializzazione: seleziona la prima squadra
    updateWheelPosition();
    selectTeam(0);
});

// BALOON
document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = document.body.innerHTML.replace(/\^\((.*?)\)/g, '<span class="balloon-tip" tabindex="0" data-text="$1">^</span>');
});
