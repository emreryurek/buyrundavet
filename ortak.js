/* buyrundavet · ortak ayarlar
   Etkinlik türleri, tasarımlar ve davetiye bilgisini linke kodlama.
   Yeni tür ya da tasarım eklemek için sadece bu dosyayı düzenle. */
window.BD = (function () {
  var TURLER = {
    dugun: {
      ad: 'Düğün', baslik: 'Düğün Davetiyesi', ust: 'Birlikte bir ömre başlıyoruz',
      etkinlik: 'Düğünü', cift: true, tema: 'zeytin',
      isimA: 'Gelinin adı', isimB: 'Damadın adı', aileA: 'Gelinin ailesi', aileB: 'Damadın ailesi',
      kisa: 'Zarf açılışlı, geri sayımlı düğün davetiyesi',
      mesaj: 'Hayatımızın en güzel gününde, sevdiklerimizle aynı sofrada olmak istiyoruz. Bu mutluluğu bizimle paylaşmanızdan onur duyarız.',
      program: '19:00 Nikah Töreni\n20:00 Akşam Yemeği\n21:30 Eğlence ve Dans'
    },
    nikah: {
      ad: 'Nikah', baslik: 'Nikah Davetiyesi', ust: 'Evet demeye hazırız',
      etkinlik: 'Nikahı', cift: true, tema: 'gul',
      isimA: 'Gelinin adı', isimB: 'Damadın adı', aileA: 'Gelinin ailesi', aileB: 'Damadın ailesi',
      kisa: 'Sade ve zarif nikah davetiyesi',
      mesaj: 'Hayatlarımızı birleştirdiğimiz bu özel günde, nikahımızda yanımızda olmanızı diliyoruz.',
      program: '18:30 Karşılama\n19:00 Nikah Töreni\n19:30 Kokteyl'
    },
    nisan: {
      ad: 'Nişan', baslik: 'Nişan Davetiyesi', ust: 'Söz verdik, sıra yüzüklerde',
      etkinlik: 'Nişanı', cift: true, tema: 'gul',
      isimA: 'Kızın adı', isimB: 'Erkeğin adı', aileA: 'Kız tarafı', aileB: 'Erkek tarafı',
      kisa: 'Yüzüklerin takıldığı gün için',
      mesaj: 'Yüzüklerimizi taktığımız bu güzel günde sizleri de aramızda görmekten mutluluk duyarız.',
      program: '19:00 Karşılama\n19:30 Yüzük Takma\n20:00 Yemek ve Eğlence'
    },
    kina: {
      ad: 'Kına', baslik: 'Kına Gecesi Davetiyesi', ust: 'Kına gecemize davetlisiniz',
      etkinlik: 'Kına Gecesi', cift: false, tema: 'kina',
      isimA: 'Gelinin adı', aileA: 'Gelinin ailesi',
      kisa: 'Geleneksel kına gecesi daveti',
      mesaj: 'Baba evinden uğurlanmadan önceki bu anlamlı gecede, kınamızı sizinle birlikte yakmak istiyoruz.',
      program: '20:00 Karşılama\n21:00 Kına Yakma\n21:30 Eğlence'
    },
    sunnet: {
      ad: 'Sünnet', baslik: 'Sünnet Düğünü Davetiyesi', ust: 'Sünnet düğünümüze davetlisiniz',
      etkinlik: 'Sünnet Düğünü', cift: false, tema: 'mavi',
      isimA: 'Çocuğun adı', aileA: 'Annesi ve babası',
      kisa: 'Oğlunuzun büyük günü için',
      mesaj: 'Oğlumuzun bu mutlu gününde sevincimizi sizinle paylaşmak istiyoruz.',
      program: '19:00 Karşılama\n20:00 Yemek\n21:00 Eğlence'
    }
  };

  // renk: [kağıt, ana renk, vurgu] — seçim kartlarındaki küçük daireler
  var TEMALAR = {
    zeytin: { ad: 'Zeytin Dalı', premium: false, renk: ['#fbf8f2', '#6f7d5c', '#b08d57'] },
    gul:    { ad: 'Pudra Gül', premium: false, renk: ['#fdf7f5', '#9c6b73', '#c08a7d'] },
    mavi:   { ad: 'Gökyüzü', premium: false, renk: ['#f7fafc', '#5b8ea6', '#25374a'] },
    gece:   { ad: 'Gece Mavisi', premium: true, renk: ['#1b2438', '#c9a96a', '#f1e9d8'] },
    kina:   { ad: 'Kına Kırmızısı', premium: true, renk: ['#36111a', '#d9a65a', '#f6e3d3'] }
  };

  function ornek(tur) {
    var T = TURLER[tur] || TURLER.dugun;
    var tek = !T.cift;
    return {
      t: TURLER[tur] ? tur : 'dugun',
      th: T.tema,
      a: tur === 'sunnet' ? 'Ahmet Efe' : 'Elif',
      b: tek ? '' : 'Can',
      fa: tur === 'sunnet' ? 'Zeynep & Murat Kaya' : 'Ayşe & Mehmet Yılmaz',
      fb: tek ? '' : 'Fatma & Ali Demir',
      d: '2027-06-12',
      h: T.program.slice(0, 5),
      s: 'Begonvil Davet Bahçesi',
      ad: 'Örnek Mah. Çiçek Sok. No: 1, Beykoz / İstanbul',
      m: T.mesaj,
      p: T.program,
      l: '2027-05-15'
    };
  }

  // Türkçe karakterleri bozmadan, linke uygun base64
  function kodla(o) {
    var s = btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function coz(s) {
    try {
      s = s.replace(/-/g, '+').replace(/_/g, '/');
      while (s.length % 4) s += '=';
      var o = JSON.parse(decodeURIComponent(escape(atob(s))));
      return (o && typeof o === 'object') ? o : null;
    } catch (e) { return null; }
  }

  return { TURLER: TURLER, TEMALAR: TEMALAR, ornek: ornek, kodla: kodla, coz: coz };
})();
