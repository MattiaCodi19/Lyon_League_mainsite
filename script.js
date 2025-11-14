// ================= Dark Mode =================
function toggleDarkMode() {
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (document.body.classList.contains('dark-mode')) {
        darkModeIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/sun--v1.png';
        darkModeIcon.alt = 'Icona Modalità Giorno';
    } else {
        darkModeIcon.src = 'https://img.icons8.com/ios-filled/50/ffffff/moon-symbol.png';
        darkModeIcon.alt = 'Icona Modalità Notte';
    }
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('nav').classList.toggle('dark-mode');
    document.querySelector('.hero').classList.toggle('dark-mode');
    document.querySelectorAll('.rules-section, .teams-section, .standings-section').forEach(section => {
        section.classList.toggle('dark-mode');
    });
    document.querySelectorAll('.team').forEach(team => {
        team.classList.toggle('dark-mode');
    });
    document.querySelector('.standings-table').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');
    document.querySelectorAll('.social-media a').forEach(link => {
        link.classList.toggle('dark-mode');
    });
}

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

// ================= Classifica =================
function updateStandings() {
    const rows = document.querySelectorAll('.standings-table tbody tr');

    rows.forEach(row => {
        const goalsFor = parseInt(row.cells[7].querySelector('input').value);
        const goalsAgainst = parseInt(row.cells[8].querySelector('input').value);
        row.cells[9].querySelector('input').value = goalsFor - goalsAgainst;
    });

    const sortedRows = Array.from(rows).sort((a, b) => {
        const pointsA = parseInt(a.cells[2].querySelector('input').value);
        const pointsB = parseInt(b.cells[2].querySelector('input').value);
        const diffA = parseInt(a.cells[9].querySelector('input').value);
        const diffB = parseInt(b.cells[9].querySelector('input').value);
        const goalsA = parseInt(a.cells[7].querySelector('input').value);
        const goalsB = parseInt(b.cells[7].querySelector('input').value);

        if (pointsA !== pointsB) return pointsB - pointsA;
        if (diffA !== diffB) return diffB - diffA;
        return goalsB - goalsA;
    });

    const tbody = document.querySelector('.standings-table tbody');
    tbody.innerHTML = '';
    sortedRows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
        row.style.transform = 'translateY(50px)';
        tbody.appendChild(row);
    });
    setTimeout(() => sortedRows.forEach(row => row.style.transform = 'translateY(0px)'), 50);
}
