/* buyrundavet · tanıtım sayfası */
(function () {
  /* Tür kartları ortak.js'deki listeden üretilir */
  var kutu = document.getElementById('turKartlari');
  Object.keys(BD.TURLER).forEach(function (k) {
    var T = BD.TURLER[k];
    var renk = BD.TEMALAR[T.tema].renk;
    var a = document.createElement('a');
    a.className = 'tur-kart';
    a.href = 'olustur.html?tur=' + k;
    a.innerHTML = '<span class="renkler">' + renk.map(function (r) { return '<i style="background:' + r + '"></i>'; }).join('') + '</span>' +
      '<h3></h3><p></p><span class="ok">Oluştur →</span>';
    a.querySelector('h3').textContent = T.ad;
    a.querySelector('p').textContent = T.kisa;
    kutu.appendChild(a);
  });

  /* Kaydırınca üst bara çizgi */
  var ust = document.getElementById('ust');
  window.addEventListener('scroll', function () { ust.classList.toggle('golgeli', window.scrollY > 8); }, { passive: true });

  document.getElementById('yil').textContent = new Date().getFullYear();

  /* Salon bul formu (DEMO: hiçbir yere gönderilmez)
     Canlıda: Cloudflare Worker'a gönderilecek, sana e-posta/WhatsApp bildirimi düşecek. */
  var f = document.getElementById('salonForm');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var tel = f.tel.value.replace(/\D/g, '');
    var tamam = f.ad.value.trim().length > 1 && tel.length >= 10 && f.riza.checked;
    document.getElementById('salonHata').hidden = tamam;
    document.getElementById('salonTamam').hidden = !tamam;
    if (tamam) f.querySelector('button[type=submit]').disabled = true;
  });
})();
