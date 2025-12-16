/* =========================
   LÁBLÉC ÁLLAPOT
========================= */
const lablecAllapot = document.querySelector('footer p'); // A lábléc szövegének kijelölése

// Frissíti a lábléc állapotát attól függően, hogy van-e aktív időzítő
const frissitLablecAllapot = () => lablecAllapot.textContent = (visszaszamlaloIdozito || edzesIdozito || szinIdozito) ? "Van aktív időzítő" : "Nincs aktív időzítő";

/* =========================
   VISSZASZÁMLÁLÓ IDŐZÍTŐ
========================= */
let visszaszamlaloIdozito = null; // Interval ID
let osszesMasodperc = 0; // Összes visszaszámlálandó másodperc

// Visszaszámláló elemek kijelölése
const visszaszamlaloKartya = document.querySelector('.cards .card:nth-of-type(1)'),
      visszaszamlaloKijelzo = visszaszamlaloKartya.querySelector('.timer'),
      [percInput, masodpercInput] = visszaszamlaloKartya.querySelectorAll('.inputs input'),
      [inditGomb, szunetGomb, resetGomb] = visszaszamlaloKartya.querySelectorAll('.buttons button'),
      visszaszamlaloStatusz = visszaszamlaloKartya.querySelector('small');

const audioKontextus = new (window.AudioContext || window.webkitAudioContext)(); // Hang lejátszásához

inditGomb.addEventListener('click', inditVisszaszamlalo);
szunetGomb.addEventListener('click', szunetVisszaszamlalo);
resetGomb.addEventListener('click', resetVisszaszamlalo);

function inditVisszaszamlalo() {
    if (visszaszamlaloIdozito) return; // Ha már fut az időzítő, ne csináljon semmit

    osszesMasodperc = (parseInt(percInput.value) || 0) * 60 + (parseInt(masodpercInput.value) || 0); // Beállítja a teljes másodpercet
    if (osszesMasodperc <= 0) return;

    visszaszamlaloStatusz.textContent = "Visszaszámlálás folyamatban...";

    visszaszamlaloIdozito = setInterval(() => {
        const p = Math.floor(osszesMasodperc / 60); // Percek számítása
        const m = osszesMasodperc % 60; // Másodpercek számítása
        visszaszamlaloKijelzo.textContent = `${String(p).padStart(2,'0')}:${String(m).padStart(2,'0')}`; // Kijelző frissítése

        if (--osszesMasodperc < 0) { // Ha lejárt
            clearInterval(visszaszamlaloIdozito);
            visszaszamlaloIdozito = null;
            visszaszamlaloStatusz.textContent = "Idő lejárt!";
            lejartHang(); // Hangjelzés
        }
        frissitLablecAllapot();
    }, 1000);

    frissitLablecAllapot();
}

function szunetVisszaszamlalo() {
    if (!visszaszamlaloIdozito) return;
    clearInterval(visszaszamlaloIdozito); // Interval leállítása
    visszaszamlaloIdozito = null;
    visszaszamlaloStatusz.textContent = "Visszaszámlálás szüneteltetve";
    frissitLablecAllapot();
}

function resetVisszaszamlalo() {
    clearInterval(visszaszamlaloIdozito);
    visszaszamlaloIdozito = null;
    inditVisszaszamlalo(); // Újrakezdi a visszaszámlálót az aktuális input értékekkel
    visszaszamlaloStatusz.textContent = "Készen áll a visszaszámlálásra";
}

function lejartHang() {
    // Többször megszólaltatja a hangot rövid időközönként
    for (let i = 0; i < 5; i++) setTimeout(() => {
        const o = audioKontextus.createOscillator(); // Hanghullám generátor
        const g = audioKontextus.createGain(); // Hang erősítő
        o.type = 'sine';
        o.frequency.setValueAtTime(1000, audioKontextus.currentTime);
        g.gain.setValueAtTime(0.2, audioKontextus.currentTime);
        o.connect(g);
        g.connect(audioKontextus.destination);
        o.start();
        o.stop(audioKontextus.currentTime + 0.2);
    }, i * 300);
}

/* =========================
   EDZÉS IDŐZÍTŐ
========================= */
let edzesIdozito = null, aktualisLepesIndex = 0, hatralevoIdo;
const edzesKartya = document.querySelector('.cards .card:nth-of-type(2)'),
      edzesKijelzo = edzesKartya.querySelector('.timer'),
      edzesStatusz = edzesKartya.querySelector('.status'),
      edzesGombok = edzesKartya.querySelectorAll('.buttons button'),
      edzesKisSzoveg = edzesKartya.querySelector('small');

const edzesLepesek = [{nev:"Gyakorlat",ido:30},{nev:"Pihenő",ido:10}];
hatralevoIdo = edzesLepesek[0].ido; // Kezdő lépés ideje

edzesGombok[0].addEventListener('click', inditEdzes);
edzesGombok[1].addEventListener('click', szunetEdzes);
edzesGombok[2].addEventListener('click', resetEdzes);

function inditEdzes() {
    if (edzesIdozito) return; // Ha fut már az edzés, ne indítsa újra

    edzesStatusz.textContent = edzesLepesek[aktualisLepesIndex].nev; // Jelenlegi lépés
    edzesKisSzoveg.textContent = `Következő: ${edzesLepesek[(aktualisLepesIndex+1)%edzesLepesek.length].ido} másodperc ${edzesLepesek[(aktualisLepesIndex+1)%edzesLepesek.length].nev.toLowerCase()}`; // Következő lépés

    edzesIdozito = setInterval(() => {
        if (--hatralevoIdo <= 0) { // Ha lejárt az aktuális lépés
            aktualisLepesIndex = (aktualisLepesIndex + 1) % edzesLepesek.length;
            hatralevoIdo = edzesLepesek[aktualisLepesIndex].ido;
            edzesStatusz.textContent = edzesLepesek[aktualisLepesIndex].nev;
        }
        edzesKijelzo.textContent = String(hatralevoIdo).padStart(2,'0'); // Kijelző frissítése
        frissitLablecAllapot();
    },1000);

    frissitLablecAllapot();
}

function szunetEdzes() {
    if (!edzesIdozito) return;
    clearInterval(edzesIdozito);
    edzesIdozito = null;
    edzesStatusz.textContent = `${edzesLepesek[aktualisLepesIndex].nev} (szünet)`;
    frissitLablecAllapot();
}

function resetEdzes() {
    clearInterval(edzesIdozito);
    edzesIdozito = null;
    aktualisLepesIndex = 0;
    hatralevoIdo = edzesLepesek[0].ido;
    edzesKijelzo.textContent = String(hatralevoIdo).padStart(2,'0');
    edzesStatusz.textContent = "Felkészülés...";
    edzesKisSzoveg.textContent = `Következő: ${edzesLepesek[1].ido} másodperc pihenő`;
    frissitLablecAllapot();
}

/* =========================
   SZÍNVÁLTÓ HÁTTÉR
========================= */
let szinIdozito = null, aktualisSzinIndex = 0;
const szinKartya = document.querySelector('.cards .card:nth-of-type(3)'),
      szinSpank = szinKartya.querySelectorAll('.colors span'),
      szinSelect = szinKartya.querySelector('select'),
      szinGombok = szinKartya.querySelectorAll('.buttons button'),
      szinKisSzoveg = szinKartya.querySelector('small');

let szinLista = Array.from(szinSpank).map(span => getComputedStyle(span).backgroundColor); // Színek listája

szinSpank.forEach((span, index) => {
    span.addEventListener('click', () => {
        leallitSzinValtas(); // Megállítja az automatikus színváltást
        aktualisSzinIndex = index;
        document.body.style.backgroundColor = szinLista[aktualisSzinIndex];
        szinKisSzoveg.textContent = `Kiválasztott szín: ${szinLista[aktualisSzinIndex]}`;
        frissitLablecAllapot();
    });
});

szinGombok[0].addEventListener('click', inditSzinValtas);
szinGombok[1].addEventListener('click', leallitSzinValtas);

function inditSzinValtas() {
    if (szinIdozito || szinLista.length === 0) return; // Ha már fut, ne indítsa újra

    let idokoz = [1000,2000,5000][szinSelect.selectedIndex] || 1000; // Interval idő beállítása
    szinKisSzoveg.textContent = "Színváltás folyamatban...";

    szinIdozito = setInterval(() => {
        document.body.style.backgroundColor = szinLista[aktualisSzinIndex];
        aktualisSzinIndex = (aktualisSzinIndex + 1) % szinLista.length;
        frissitLablecAllapot();
    }, idokoz);

    frissitLablecAllapot();
}

function leallitSzinValtas() {
    clearInterval(szinIdozito);
    szinIdozito = null;
    szinKisSzoveg.textContent = "Színváltás megállítva";
    frissitLablecAllapot();
}
