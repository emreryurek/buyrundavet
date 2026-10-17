/* buyrundavet · davetiye sayfası
   Bilgiler linkin sonundaki #d=... kısmından okunur.
   Link yoksa örnek düğün davetiyesi gösterilir.
   #...&o=1 : önizleme modu (zarf atlanır, oluşturma ekranında kullanılır) */
(function () {
  var TZ = 'Europe/Istanbul';
  document.documentElement.classList.add('js');

  var hp = new URLSearchParams(location.hash.slice(1));
  var D = (hp.get('d') && BD.coz(hp.get('d'))) || BD.ornek('dugun');
  var onizleme = hp.get('o') === '1';
  var T, tarih, isimKisa, zaman;

  function $(id) { return document.getElementById(id); }
  function fmt(d, opt) { return new Intl.DateTimeFormat('tr-TR', Object.assign({ timeZone: TZ }, opt)).format(d); }
  function iki(n) { return String(n).padStart(2, '0'); }
  function tarihYap(gun, saat) {
    var t = new Date((gun || '') + 'T' + (/^\d{2}:\d{2}$/.test(saat || '') ? saat : '19:00') + ':00+03:00');
    return isNaN(t) ? new Date('2027-06-12T19:00:00+03:00') : t;
  }

  /* ---- Sayfayı bilgilere göre çiz (önizlemede tekrar tekrar çağrılır) ---- */
  function ciz() {
    T = BD.TURLER[D.t] || BD.TURLER.dugun;
    var tema = BD.TEMALAR[D.th] ? D.th : T.tema;
    Array.prototype.slice.call(document.body.classList).forEach(function (c) {
      if (c.indexOf('tema-') === 0) document.body.classList.remove(c);
    });
    document.body.classList.add('tema-' + tema);

    tarih = tarihYap(D.d, D.h);
    var cift = T.cift && !!D.b;
    isimKisa = cift ? D.a + ' & ' + D.b : (D.a || '');

    var deger = {
      baslik: T.baslik,
      ust: T.ust,
      isimA: D.a,
      isimB: cift ? D.b : '',
      isimKisa: isimKisa,
      basHarf: cift ? D.a.charAt(0) + '&' + D.b.charAt(0) : (D.a || '').charAt(0),
      aileA: D.fa, aileB: D.fb,
      aileAEtiket: T.aileA, aileBEtiket: T.aileB || '',
      tarihNokta: fmt(tarih, { day: '2-digit', month: '2-digit', year: 'numeric' }),
      gunAdi: fmt(tarih, { weekday: 'long' }),
      tarihUzun: fmt(tarih, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }) + ' · ' + fmt(tarih, { hour: '2-digit', minute: '2-digit' }),
      salon: D.s, adres: D.ad, mesaj: D.m,
      lcvSonYazi: D.l ? fmt(tarihYap(D.l, '12:00'), { day: 'numeric', month: 'long' }) : ''
    };
    document.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k');
      if (k in deger) el.textContent = deger[k] || '';
    });
    document.title = (isimKisa ? isimKisa + ' · ' : '') + T.baslik;

    $('ve').hidden = !cift;
    $('isimB').hidden = !cift;
    var ikiAile = cift && !!D.fb;
    $('aileBKutu').hidden = !ikiAile;
    $('aileler').classList.toggle('tek', !ikiAile);
    $('aileler').hidden = !D.fa && !ikiAile;
    $('lcvSatir').hidden = !D.l;
    $('takvim').hidden = false;

    /* Program: her satır "19:00 Nikah Töreni" */
    var ul = $('program'); ul.innerHTML = '';
    String(D.p || '').split('\n').forEach(function (satir) {
      satir = satir.trim(); if (!satir) return;
      var m = satir.match(/^(\d{1,2}[:.]\d{2})\s+(.+)$/);
      var li = document.createElement('li');
      var t = document.createElement('time'); t.textContent = m ? m[1].replace('.', ':') : '';
      var s = document.createElement('strong'); s.textContent = m ? m[2] : satir;
      var d = document.createElement('div'); d.appendChild(s);
      li.appendChild(t); li.appendChild(d); ul.appendChild(li);
    });
    $('programBolum').hidden = !ul.children.length;

    $('harita').href = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent([D.s, D.ad].filter(Boolean).join(' '));

    clearInterval(zaman);
    zaman = setInterval(guncelle, 1000); guncelle();
  }

  /* ---- Geri sayım ---- */
  var alan = {};
  $('sayac').querySelectorAll('[data-s]').forEach(function (b) { alan[b.getAttribute('data-s')] = b; });
  function guncelle() {
    var fark = tarih - new Date();
    var bitti = fark <= 0;
    $('sayac').hidden = bitti;
    $('sayacBitti').hidden = !bitti;
    if (bitti) {
      var bugun = fark > -24 * 3600 * 1000;
      $('sayacBaslik').textContent = bugun ? 'Bugün o gün!' : 'Mutluluğumuza ortak olduğunuz için';
      $('sayacBitti').textContent = bugun ? 'Sizi bekliyoruz.' : 'teşekkür ederiz.';
      clearInterval(zaman); return;
    }
    $('sayacBaslik').textContent = 'Büyük güne kalan';
    var sn = Math.floor(fark / 1000);
    alan.gun.textContent = Math.floor(sn / 86400);
    alan.saat.textContent = iki(Math.floor(sn % 86400 / 3600));
    alan.dk.textContent = iki(Math.floor(sn % 3600 / 60));
    alan.sn.textContent = iki(sn % 60);
  }

  /* ---- Zarf ---- */
  var acildi = false;
  function hepsiniGoster() { document.querySelectorAll('.r').forEach(function (o) { o.classList.add('gor'); }); }
  function ac() {
    if (acildi) return; acildi = true;
    $('zarf').classList.add('acik');
    var hizli = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      $('zarfEkran').classList.add('bitti');
      document.body.classList.remove('kapali');
      gozle();
    }, hizli ? 50 : 1700);
  }
  $('zarf').addEventListener('click', ac);

  function gozle() {
    var ogeler = document.querySelectorAll('.r');
    if (!('IntersectionObserver' in window)) { hepsiniGoster(); return; }
    var io = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) { g.target.classList.add('gor'); io.unobserve(g.target); }
      });
    }, { threshold: 0.15 });
    ogeler.forEach(function (o, i) {
      if (o.closest('.hero')) o.style.transitionDelay = (i * 0.12) + 's';
      io.observe(o);
    });
  }

  /* ---- Takvime ekle (.ics) ---- */
  function icsTarih(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function icsMetin(s) { return String(s || '').replace(/([,;\\])/g, '\\$1'); }
  $('takvim').addEventListener('click', function () {
    var bitis = new Date(tarih.getTime() + 5 * 3600 * 1000);
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//buyrundavet//TR', 'BEGIN:VEVENT',
      'UID:' + tarih.getTime() + '-' + encodeURIComponent(isimKisa) + '@buyrundavet.com',
      'DTSTAMP:' + icsTarih(new Date()),
      'DTSTART:' + icsTarih(tarih), 'DTEND:' + icsTarih(bitis),
      'SUMMARY:' + icsMetin(isimKisa + ' ' + T.etkinlik),
      'LOCATION:' + icsMetin([D.s, D.ad].filter(Boolean).join(', ')),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url; a.download = 'davetiye.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  /* ---- LCV formu ----
     Demo: yanıt yalnızca bu tarayıcıda saklanır.
     Canlıda Cloudflare Worker'a gönderip çiftin paneline düşüreceğiz. */
  var form = $('lcvForm');
  form.addEventListener('change', function () {
    $('kisiAlan').hidden = form.katilim.value !== 'evet';
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ad = form.ad.value.trim();
    if (ad.length < 2) { $('hata').hidden = false; form.ad.focus(); return; }
    $('hata').hidden = true;
    var yanit = {
      ad: ad, katilim: form.katilim.value,
      kisi: form.katilim.value === 'evet' ? Number(form.kisi.value) : 0,
      not: form.not.value.trim(), zaman: new Date().toISOString()
    };
    try {
      var liste = JSON.parse(localStorage.getItem('lcv') || '[]');
      liste.push(yanit); localStorage.setItem('lcv', JSON.stringify(liste));
    } catch (err) { /* depolama kapalı olabilir, sorun değil */ }
    var ilkAd = ad.split(' ')[0];
    $('tesekkurMetin').textContent = yanit.katilim === 'evet'
      ? 'Sevgili ' + ilkAd + ', ' + yanit.kisi + ' kişilik yeriniz ayrıldı. O gün görüşmek üzere!'
      : 'Sevgili ' + ilkAd + ', bildirdiğiniz için teşekkürler. Gönlünüz bizimle olsun.';
    form.hidden = true;
    $('tesekkur').hidden = false;
  });

  /* ---- Oluşturma ekranından canlı güncelleme ---- */
  window.addEventListener('message', function (e) {
    if (e.source !== window.parent || !e.data || e.data.tip !== 'bd-guncelle') return;
    if (e.data.veri && typeof e.data.veri === 'object') { D = e.data.veri; ciz(); }
  });

  ciz();
  if (onizleme) {
    acildi = true;
    $('zarfEkran').classList.add('bitti', 'aninda');
    document.body.classList.remove('kapali');
    hepsiniGoster();
  }
})();
