/* buyrundavet · davetiye oluşturma ekranı
   Form → canlı önizleme (iframe'e postMessage) → paylaşılabilir link (#d=...) */
(function () {
  var f = document.getElementById('form');
  var cerceve = document.getElementById('cerceve');
  var q = new URLSearchParams(location.search);
  var tur = BD.TURLER[q.get('tur')] ? q.get('tur') : 'dugun';
  var tema = BD.TURLER[tur].tema;
  var ALANLAR = ['a', 'b', 'fa', 'fb', 'd', 'h', 's', 'ad', 'm', 'p', 'l'];

  function $(id) { return document.getElementById(id); }

  /* ---- Tür ve tasarım seçenekleri ---- */
  function secenek(ad, deger, ic, secili) {
    var d = document.createElement('div'); d.className = 'secenek';
    var id = ad + '-' + deger;
    d.innerHTML = '<input type="radio" name="' + ad + '" id="' + id + '" value="' + deger + '"' + (secili ? ' checked' : '') + '><label for="' + id + '">' + ic + '</label>';
    return d;
  }
  function yaziGuvenli(s) { var x = document.createElement('span'); x.textContent = s; return x.innerHTML; }

  Object.keys(BD.TURLER).forEach(function (k) {
    var T = BD.TURLER[k];
    $('turlar').appendChild(secenek('tur', k, '<strong>' + yaziGuvenli(T.ad) + '</strong><small>' + yaziGuvenli(T.kisa) + '</small>', k === tur));
  });
  Object.keys(BD.TEMALAR).forEach(function (k) {
    var M = BD.TEMALAR[k];
    var renk = '<span class="renkler">' + M.renk.map(function (r) { return '<i style="background:' + r + '"></i>'; }).join('') + '</span>';
    var rozet = M.premium ? '<span class="prem">Premium</span>' : '<span class="ucretsiz">Ücretsiz</span>';
    $('temalar').appendChild(secenek('tema', k, renk + '<strong>' + yaziGuvenli(M.ad) + '</strong>' + rozet, k === tema));
  });

  /* ---- Türe göre etiketler ve hazır metinler ---- */
  function etiketler() {
    var T = BD.TURLER[tur];
    $('aEtiket').textContent = T.isimA;
    $('faEtiket').textContent = T.aileA;
    $('bAlan').hidden = !T.cift;
    $('fbAlan').hidden = !T.cift;
    if (T.cift) { $('bEtiket').textContent = T.isimB; $('fbEtiket').textContent = T.aileB; }
    var o = BD.ornek(tur);
    $('a').placeholder = 'Örn. ' + o.a;
    $('b').placeholder = 'Örn. ' + (o.b || 'Can');
    $('s').placeholder = 'Örn. ' + o.s;
  }
  function hazirMetinler(eskiTur) {
    var E = eskiTur ? BD.TURLER[eskiTur] : null, T = BD.TURLER[tur];
    // Kişi metni kendisi değiştirmediyse yeni türün hazır metnini koy
    if (!f.m.value.trim() || (E && f.m.value === E.mesaj)) f.m.value = T.mesaj;
    if (!f.p.value.trim() || (E && f.p.value === E.program)) f.p.value = T.program;
    if (!f.h.value || (E && f.h.value === E.program.slice(0, 5))) f.h.value = T.program.slice(0, 5);
  }

  /* ---- Formdan veri ---- */
  function formVerisi() {
    var v = { t: tur, th: f.tema.value };
    ALANLAR.forEach(function (k) { v[k] = (f[k].value || '').trim(); });
    if (!BD.TURLER[tur].cift) { v.b = ''; v.fb = ''; }
    return v;
  }
  // Önizleme: boş alanlar örnek bilgiyle dolar
  function onizlemeVerisi() {
    var v = formVerisi(), o = BD.ornek(tur);
    ALANLAR.forEach(function (k) {
      if (!v[k] && k !== 'l') v[k] = o[k];
      if (!BD.TURLER[tur].cift && (k === 'b' || k === 'fb')) v[k] = '';
    });
    return v;
  }

  /* ---- Canlı önizleme ---- */
  var hazir = false, bekleyen;
  cerceve.addEventListener('load', function () { hazir = true; gonder(); });
  cerceve.src = 'davetiye.html#o=1&d=' + BD.kodla(onizlemeVerisi());
  function gonder() {
    if (!hazir) return;
    cerceve.contentWindow.postMessage({ tip: 'bd-guncelle', veri: onizlemeVerisi() }, '*');
  }
  function guncelle() {
    clearTimeout(bekleyen); bekleyen = setTimeout(gonder, 120);
    $('premiumNot').hidden = !BD.TEMALAR[f.tema.value].premium;
    $('sonuc').hidden = true;
  }

  f.addEventListener('input', guncelle);
  f.addEventListener('change', function (e) {
    if (e.target.name === 'tur') {
      var eski = tur;
      var eskiTema = BD.TURLER[eski].tema;
      tur = e.target.value;
      if (f.tema.value === eskiTema) { var r = $('tema-' + BD.TURLER[tur].tema); if (r) r.checked = true; }
      etiketler(); hazirMetinler(eski);
      history.replaceState(null, '', '?tur=' + tur);
    }
    guncelle();
  });

  /* ---- Oluştur ---- */
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = formVerisi();
    var T = BD.TURLER[tur];
    var eksik = [];
    ['aAlan', 'bAlan', 'dAlan', 'sAlan'].forEach(function (id) { $(id).classList.remove('hatali'); });
    if (!v.a) { eksik.push(T.isimA.toLowerCase()); $('aAlan').classList.add('hatali'); }
    if (T.cift && !v.b) { eksik.push(T.isimB.toLowerCase()); $('bAlan').classList.add('hatali'); }
    if (!v.d) { eksik.push('tarih'); $('dAlan').classList.add('hatali'); }
    if (!v.s) { eksik.push('salon adı'); $('sAlan').classList.add('hatali'); }
    if (eksik.length) {
      $('hataNot').textContent = 'Lütfen şunları doldurun: ' + eksik.join(', ') + '.';
      $('hataNot').hidden = false; $('sonuc').hidden = true;
      var ilk = f.querySelector('.hatali input'); if (ilk) ilk.focus();
      return;
    }
    $('hataNot').hidden = true;
    if (!v.m) v.m = T.mesaj;

    var link = new URL('davetiye.html', location.href).href + '#d=' + BD.kodla(v);
    var isim = T.cift ? v.a + ' & ' + v.b : v.a;
    $('link').value = link;
    $('ac').href = link;
    $('wp').href = 'https://wa.me/?text=' + encodeURIComponent(isim + ' · ' + T.baslik + '\nDavetiyeyi açmak için dokunun:\n' + link);
    $('sonuc').hidden = false;
    $('sonuc').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('kopyala').addEventListener('click', function () {
    var b = this, l = $('link');
    function oldu() { b.textContent = 'Kopyalandı'; setTimeout(function () { b.textContent = 'Kopyala'; }, 1800); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(l.value).then(oldu, function () { l.select(); document.execCommand('copy'); oldu(); });
    } else { l.select(); document.execCommand('copy'); oldu(); }
  });

  /* ---- Mobilde önizleme penceresi ---- */
  $('onizleDugme').addEventListener('click', function () { $('onizleme').classList.add('acik'); document.body.style.overflow = 'hidden'; });
  $('onizlemeKapat').addEventListener('click', function () { $('onizleme').classList.remove('acik'); document.body.style.overflow = ''; });

  /* ---- Başlangıç ---- */
  var bugun = new Date(); bugun.setMinutes(bugun.getMinutes() - bugun.getTimezoneOffset());
  f.d.min = bugun.toISOString().slice(0, 10);
  etiketler(); hazirMetinler(null); guncelle();
})();
