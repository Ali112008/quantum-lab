#!/usr/bin/env python3
"""
Generate the Arabic (RTL) one-page proposal HTML for the Quantum Research Lab.

Mirrors download/proposal/quantum-lab-one-pager.html (EN, LTR) with:
  - dir="rtl" + mirrored layout (decor circuit top-left, ask block flipped)
  - Cairo variable font (arabic + latin subsets) embedded base64 — the same
    face the landing site loads via next/font, keeping brand typography 1:1
  - Western digits + dir=ltr spans for $ amounts / tech tokens (bidi safety)

Output: download/proposal/quantum-lab-one-pager-ar.html
Then render with skills/pdf/scripts/html2poster.js → public/proposal/.
NOTE: after ANY regeneration of the HTML, re-run stamp-qr.py to (re)inject
the footer QR tile, then re-render the PDFs (see stamp-qr.py header).
"""
import base64
from pathlib import Path

ROOT = Path("/home/z/my-project")
FONTS = Path("/tmp/ar-pdf")
OUT = ROOT / "download/proposal/quantum-lab-one-pager-ar.html"

arabic_b64 = base64.b64encode((FONTS / "cairo-arabic.woff2").read_bytes()).decode()
latin_b64 = base64.b64encode((FONTS / "cairo-latin.woff2").read_bytes()).decode()

HTML = r"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>مختبر أبحاث الكموم — عرض تمويل 50 ألف دولار (صفحة واحدة)</title>
<style>
  /* ---- self-hosted Cairo (variable 400–900, arabic + latin subsets) ---- */
  @font-face {
    font-family: 'Cairo';
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url(data:font/woff2;base64,__ARABIC__) format('woff2');
    unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC;
  }
  @font-face {
    font-family: 'Cairo';
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url(data:font/woff2;base64,__LATIN__) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+20AC, U+2122, U+2212;
  }

  /* ============ Quantum brand system — mirrors the landing site (RTL) ============ */
  :root {
    --c-bg: #0A192F;
    --c-panel: #112240;
    --c-accent: #00D9FF;
    --c-accent-2: #6C5CE7;
    --c-good: #00B894;
    --c-text: #FFFFFF;
    --c-subtle: #8892B0;
  }

  @page { size: 794px 1123px; margin: 0; }

  html, body {
    margin: 0;
    padding: 0;
    width: 794px;
    background: var(--c-bg);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .poster {
    position: relative;
    width: 794px;
    height: 1123px;
    background:
      radial-gradient(ellipse 90% 55% at 15% -5%, rgba(108,92,231,0.16), transparent 60%),
      radial-gradient(ellipse 80% 50% at 100% 105%, rgba(0,217,255,0.10), transparent 55%),
      var(--c-bg);
    color: var(--c-text);
    font-family: 'Cairo', 'Helvetica Neue', Arial, sans-serif;
    box-sizing: border-box;
    padding: 26px 46px 24px;
    display: flex;
    flex-direction: column;
    direction: rtl;
  }

  /* ---- decorative layer (mirrored: circuit now top-left) ---- */
  .deco-circuit {
    position: absolute;
    top: 0; left: 0;
    width: 70%;
    height: 38%;
    opacity: 0.35;
    pointer-events: none;
  }
  .ghost-ket {
    position: absolute;
    left: 26px;
    bottom: 96px;
    font-weight: 700;
    font-size: 150px;
    line-height: 1;
    color: rgba(0, 217, 255, 0.05);
    pointer-events: none;
  }

  .mono {
    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
    letter-spacing: 0.14em;
    direction: ltr;
    unicode-bidi: isolate;
  }

  /* Latin tech tokens (Qiskit, IBM Quantum, ASRT…) keep clean LTR flow */
  .ltr { direction: ltr; unicode-bidi: isolate; display: inline-block; }
  .num { direction: ltr; unicode-bidi: isolate; }

  /* ---- header ---- */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-name { font-weight: 800; font-size: 19px; letter-spacing: 0; }
  .brand-name .dot { color: var(--c-accent); }
  .brand-sub { font-size: 10.5px; color: var(--c-subtle); margin-top: 2px; font-weight: 600; }
  .head-meta { text-align: left; font-size: 11px; color: var(--c-accent); line-height: 1.85; font-weight: 600; }

  .rule {
    height: 1px;
    border: 0;
    margin: 14px 0 0;
    background: linear-gradient(270deg, var(--c-accent) 0%, rgba(0,217,255,0.25) 38%, rgba(136,146,176,0.18) 100%);
  }

  /* ---- hero ---- */
  .hero { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-top: 14px; }
  .kicker { font-size: 11.5px; color: var(--c-accent); margin-bottom: 6px; font-weight: 700; }
  h1 {
    font-weight: 900;
    font-size: 33px;
    line-height: 1.18;
    margin: 0;
  }
  h1 .glow { color: var(--c-accent); }
  .lead {
    margin-top: 8px;
    max-width: 500px;
    font-size: 11.5px;
    line-height: 1.7;
    color: var(--c-subtle);
    font-weight: 500;
  }
  .lead strong { color: var(--c-text); font-weight: 700; }
  .ask {
    flex-shrink: 0;
    text-align: left;
    padding-top: 4px;
  }
  .ask .amount {
    font-weight: 900;
    font-size: 46px;
    line-height: 1;
    color: var(--c-accent);
    text-shadow: 0 0 32px rgba(0, 217, 255, 0.45);
  }
  .ask .label { margin-top: 8px; font-size: 11px; color: var(--c-subtle); line-height: 1.9; font-weight: 600; }

  /* ---- stat strip (problem) ---- */
  .strip {
    margin-top: 14px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border: 1px solid rgba(136,146,176,0.16);
    border-radius: 12px;
    background: rgba(17,36,64,0.55);
  }
  .strip .cell { padding: 10px 14px 9px; }
  .strip .cell + .cell { border-right: 1px solid rgba(136,146,176,0.16); }
  .strip .num {
    font-weight: 800;
    font-size: 21px;
    color: var(--c-text);
  }
  .strip .num em { font-style: normal; color: var(--c-accent); }
  .strip .cap { margin-top: 3px; font-size: 10.5px; line-height: 1.55; color: var(--c-subtle); font-weight: 500; }

  /* ---- section titles ---- */
  .sec {
    margin-top: 13px;
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .sec .t { font-weight: 800; font-size: 15px; }
  .sec .t em { font-style: normal; color: var(--c-accent); }
  .sec .line { flex: 1; height: 1px; background: rgba(136,146,176,0.18); }
  .sec .tag { font-size: 10px; color: var(--c-subtle); font-weight: 600; }

  /* ---- plan: 3 phases ---- */
  .phases { margin-top: 9px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .phase {
    border: 1px solid rgba(136,146,176,0.16);
    border-top: 2px solid var(--c-accent);
    border-radius: 10px;
    background: rgba(17,36,64,0.55);
    padding: 9px 12px 8px;
  }
  .phase .ph-no { font-size: 11px; color: var(--c-accent); font-weight: 700; }
  .phase h3 { margin: 6px 0 2px; font-size: 14.5px; font-weight: 800; }
  .phase .ph-sub { font-size: 10px; color: var(--c-subtle); font-weight: 600; }
  .phase ul { margin: 7px 0 0; padding: 0; list-style: none; }
  .phase li {
    position: relative;
    padding-right: 12px;
    font-size: 10.5px;
    line-height: 1.6;
    color: var(--c-subtle);
    margin-top: 3px;
    font-weight: 500;
  }
  .phase li::before {
    content: "";
    position: absolute;
    right: 0; top: 8px;
    width: 5px; height: 5px;
    border-radius: 1.5px;
    background: var(--c-accent);
    opacity: 0.75;
  }
  .phase.p2 { border-top-color: var(--c-accent-2); }
  .phase.p2 li::before { background: var(--c-accent-2); }
  .phase.p2 .ph-no { color: #9C8CFF; }
  .phase.p3 { border-top-color: var(--c-good); }
  .phase.p3 li::before { background: var(--c-good); }
  .phase.p3 .ph-no { color: var(--c-good); }

  /* ---- budget bar (segments flow right→left automatically in RTL) ---- */
  .budget { margin-top: 9px; }
  .bar { display: flex; height: 34px; border-radius: 9px; overflow: hidden; border: 1px solid rgba(136,146,176,0.16); }
  .seg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 10.5px;
    font-weight: 700;
    color: var(--c-bg);
    line-height: 1.3;
  }
  .seg small { font-weight: 600; font-size: 9px; opacity: 0.8; }
  .s1 { width: 24%; background: #00D9FF; }
  .s2 { width: 20%; background: #33C3E8; }
  .s3 { width: 20%; background: #56A8D4; color: #06152B; }
  .s4 { width: 16%; background: #7E8CC0; }
  .s5 { width: 12%; background: #6C5CE7; color: #FFFFFF; }
  .s6 { width: 8%;  background: #8892B0; }
  .bar-legend {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    color: var(--c-subtle);
    font-weight: 600;
  }
  .bar-note { margin-top: 6px; font-size: 10.5px; color: var(--c-subtle); font-weight: 500; }
  .bar-note b { color: var(--c-text); font-weight: 700; }

  /* ---- ROI row ---- */
  .roi { margin-top: 9px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 9px; }
  .kpi {
    border: 1px solid rgba(136,146,176,0.16);
    border-radius: 10px;
    background: rgba(17,36,64,0.55);
    padding: 8px 6px 7px;
    text-align: center;
  }
  .kpi .v {
    font-weight: 900;
    font-size: 22px;
    color: var(--c-accent);
  }
  .kpi .k { margin-top: 3px; font-size: 9.5px; line-height: 1.4; color: var(--c-subtle); font-weight: 600; }

  /* ---- accountability + footer ---- */
  .account {
    margin-top: 12px;
    border: 1px dashed rgba(0,217,255,0.35);
    border-radius: 10px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    background: rgba(0,217,255,0.05);
  }
  .account .a-title { font-size: 12px; font-weight: 800; color: var(--c-text); }
  .account .a-items { display: flex; gap: 16px; font-size: 10.5px; color: var(--c-subtle); font-weight: 600; }
  .account .a-items span b { color: var(--c-accent); font-weight: 700; }

  footer {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid rgba(136,146,176,0.18);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
  }
  .quote {
    max-width: 460px;
    font-weight: 800;
    font-size: 12.5px;
    line-height: 1.65;
    color: var(--c-text);
  }
  .quote em { font-style: normal; color: var(--c-accent); }
  .contact { text-align: left; font-size: 10.5px; color: var(--c-subtle); line-height: 1.85; font-weight: 600; }
  .contact .mail { color: var(--c-accent); font-weight: 700; font-size: 11.5px; direction: ltr; unicode-bidi: isolate; display: inline-block; }

  /* ---- browser preview auto-scale (print unaffected) ---- */
  @media screen {
    html {
      height: auto;
      display: flex;
      justify-content: center;
      background: #0A192F;
    }
    body {
      transform-origin: top center;
      scale: min(1, calc(100vw / 794), calc(100vh / 1123));
      margin: 0 auto;
      box-shadow: 0 0 60px rgba(0,0,0,0.45);
    }
  }
</style>
</head>
<body>
<div class="poster" role="main" aria-label="عرض تمويل مختبر أبحاث الكموم — صفحة واحدة">

  <!-- decorative: entanglement circuit (mirrored, top-left) -->
  <svg class="deco-circuit" viewBox="0 0 560 430" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g stroke="#00D9FF" stroke-width="0.7" opacity="0.5">
      <path d="M60 380 C 160 300, 200 340, 280 240 S 430 140, 520 90"/>
      <path d="M20 300 C 130 270, 220 180, 330 150 S 480 60, 560 40"/>
      <path d="M140 420 C 220 360, 320 300, 420 210"/>
    </g>
    <g stroke="#6C5CE7" stroke-width="0.6" opacity="0.45">
      <path d="M100 360 C 200 330, 260 250, 350 220 S 500 150, 545 130"/>
    </g>
    <g fill="#00D9FF">
      <circle cx="280" cy="240" r="3.5"/>
      <circle cx="330" cy="150" r="2.5"/>
      <circle cx="420" cy="210" r="3"/>
      <circle cx="520" cy="90" r="2.5"/>
      <circle cx="60" cy="380" r="2.5"/>
    </g>
    <g fill="#6C5CE7">
      <circle cx="350" cy="220" r="3"/>
      <circle cx="150" cy="415" r="2.5"/>
      <circle cx="545" cy="130" r="2.5"/>
    </g>
  </svg>
  <div class="ghost-ket" aria-hidden="true">ψ</div>

  <!-- ============ HEADER ============ -->
  <header>
    <div class="brand">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="20" cy="20" r="4.5" fill="#00D9FF"/>
        <ellipse cx="20" cy="20" rx="16" ry="6.5" stroke="#6C5CE7" stroke-width="1.4" transform="rotate(30 20 20)"/>
        <ellipse cx="20" cy="20" rx="16" ry="6.5" stroke="#00D9FF" stroke-width="1.4" transform="rotate(-30 20 20)"/>
      </svg>
      <div>
        <div class="brand-name">مختبر أبحاث الكموم<span class="dot"> · </span><span class="ltr">QRL·Lab</span></div>
        <div class="brand-sub">مختبر جامعي لأبحاث الكموم · الفيزياء وعلوم الحاسب</div>
      </div>
    </div>
    <div class="head-meta">
      عرض التمويل التأسيسي · 2026<br>
      بقيادة الطلاب · بإشراف أكاديمي<br>
      نسخة المستثمر — 15 دقيقة
    </div>
  </header>

  <hr class="rule">

  <!-- ============ HERO ============ -->
  <div class="hero">
    <div>
      <p class="kicker">حيث يحاكي الطلاب الواقع — على عتاد كمومي حقيقي</p>
      <h1>نبني مستقبل مصر<br><span class="glow">الكمومي</span><br>اليوم.</h1>
      <p class="lead">
        مختبر بقيادة طلابية يشغّل فيه طلاب المرحلة الجامعية معالجات كمومية حقيقية عبر السحابة.
        <strong>لا غرفة نظيفة، ولا 10 ملايين دولار للبنية التحتية.</strong> بذرة واحدة بقيمة 50,000 دولار
        تشعل محركًا لثلاث سنوات — 200 خريج طلاقًا كموميًا، وبحثًا قابلًا للنشر، وأول مركز طلابي كمومي في المنطقة.
      </p>
    </div>
    <div class="ask">
      <div class="amount num">$50,000</div>
      <div class="label">إجمالي التمويل المطلوب<br>خطة 36 شهرًا<br>15 طالبًا مؤسِّسًا</div>
    </div>
  </div>

  <!-- ============ PROBLEM STRIP ============ -->
  <div class="strip">
    <div class="cell">
      <div class="num num-wrap">300<em class="num">%</em></div>
      <div class="cap">نمو الوظائف الكمومية عالميًا، بمنحنى طلب شاقولي</div>
    </div>
    <div class="cell">
      <div class="num num">0</div>
      <div class="cap">لا يوجد مختبر كمومي عملي في جامعاتنا، ومقعد الرائد ما يزال شاغرًا</div>
    </div>
    <div class="cell">
      <div class="num">2<em class="num">^300</em></div>
      <div class="cap">حالة تستكشفها آلة بـ300 كيوبيت دفعة واحدة، وسيشغّلها طلابنا سحابيًا</div>
    </div>
  </div>

  <!-- ============ PLAN ============ -->
  <div class="sec">
    <span class="t">دائرة الثلاث <em>سنوات</em></span>
    <span class="line"></span>
    <span class="tag">مخرَج كل مرحلة هو مدخَل التي تليها</span>
  </div>
  <div class="phases">
    <div class="phase">
      <div class="ph-no"><span class="ltr">|PHASE 1⟩</span> · الشهر 1–6</div>
      <h3>التأسيس</h3>
      <div class="ph-sub">الإنشاء والتدريب</div>
      <ul>
        <li>تفعيل حسابات <span class="ltr">IBM Quantum</span> و<span class="ltr">AWS Braket</span></li>
        <li>استقطاب 25 عضوًا مؤسِّسًا على أساس الجدارة</li>
        <li>تخريج أول دفعة معتمدين في <span class="ltr">Qiskit</span></li>
      </ul>
    </div>
    <div class="phase p2">
      <div class="ph-no"><span class="ltr">|PHASE 2⟩</span> · الشهر 7–18</div>
      <h3>التشغيل</h3>
      <div class="ph-sub">البحث والورش</div>
      <ul>
        <li>مشاريع بحثية على عتاد حقيقي</li>
        <li>ورش وهاكاثونات على مستوى الجامعة</li>
        <li>توقيع تجارب صناعية أولى</li>
      </ul>
    </div>
    <div class="phase p3">
      <div class="ph-no"><span class="ltr">|PHASE 3⟩</span> · الشهر 19–36</div>
      <h3>الاستدامة</h3>
      <div class="ph-sub">التوسع والشراكة</div>
      <ul>
        <li>منح لاحقة (<span class="ltr">ASRT · ITIDA · Erasmus+</span>)</li>
        <li>إيراد من خط توظيف الخريجين</li>
        <li>إعلان المركز الإقليمي الكمومي</li>
      </ul>
    </div>
  </div>

  <!-- ============ BUDGET ============ -->
  <div class="sec">
    <span class="t">إلى أين يذهب كل <em>دولار</em></span>
    <span class="line"></span>
    <span class="tag">مثبَّت وفق الخطة المدقَّقة</span>
  </div>
  <div class="budget">
    <div class="bar" role="img" aria-label="توزيع الميزانية: العتاد والوصول السحابي 24%، البنية الحاسوبية 20%، مكافآت طلابية 20%، التدريب والشهادات 16%، الفعاليات 12%، التشغيل والطوارئ 8%">
      <div class="seg s1">24%<small>العتاد والسحابة</small></div>
      <div class="seg s2">20%<small>البنية الحاسوبية</small></div>
      <div class="seg s3">20%<small>المكافآت</small></div>
      <div class="seg s4">16%<small>التدريب</small></div>
      <div class="seg s5">12%<small>الفعاليات</small></div>
      <div class="seg s6">8%<small>الطوارئ</small></div>
    </div>
    <div class="bar-legend">
      <span><span class="ltr">IBM QUANTUM $7,200</span> · <span class="ltr">BRAKET $4,800</span></span>
      <span>محطتا <span class="ltr">GPU</span> — <span class="ltr">$10,000</span></span>
      <span>مكافآت 10 × <span class="ltr">$1,000</span></span>
      <span>40 مقعد شهادات — <span class="ltr">$8,000</span></span>
      <span>هاكاثونات — <span class="ltr">$6,000</span></span>
    </div>
    <p class="bar-note">
      <b>جاهزة للتدقيق:</b> كل بند مسعَّر مسبقًا ومنشور. تقارير مطابقة فصلية مقابل هذا الجدول بالضبط —
      مالية مفتوحة، وموقّعون بالاسم، ودعوة دائمة للزيارة.
    </p>
  </div>

  <!-- ============ ROI ============ -->
  <div class="sec">
    <span class="t">العائد بحلول <em>السنة الثالثة</em></span>
    <span class="line"></span>
    <span class="tag"><span class="ltr">$1 → ~$100</span> قيمة مُنشأة بحلول 2036</span>
  </div>
  <div class="roi">
    <div class="kpi"><div class="v num">200</div><div class="k">مسيرة مهنية</div></div>
    <div class="kpi"><div class="v num">15</div><div class="k">مشروعًا بحثيًا</div></div>
    <div class="kpi"><div class="v num">5</div><div class="k">أوراق محكَّمة</div></div>
    <div class="kpi"><div class="v num">3</div><div class="k">شركاء صناعة</div></div>
    <div class="kpi"><div class="v num">2</div><div class="k">فوزًا بمنافسات</div></div>
    <div class="kpi"><div class="v num">1</div><div class="k">مركز إقليمي</div></div>
  </div>

  <!-- ============ ACCOUNTABILITY ============ -->
  <div class="account">
    <div class="a-title">المساءلة مُهندَسة داخل المنظومة — وليست إضافة لاحقة.</div>
    <div class="a-items">
      <span><b>◆</b> تقارير فصلية</span>
      <span><b>◆</b> مالية مفتوحة</span>
      <span><b>◆</b> متوافقون مع <span class="ltr">ASRT · ITIDA</span></span>
    </div>
  </div>

  <!-- ============ FOOTER ============ -->
  <footer>
    <div class="quote">
      «تمويلك ليس نموذج أعمالنا؛ <em>إنه شرارتنا</em> — والشرارات تشتعل مرة واحدة فقط.»
    </div>
    <div class="contact">
      <span class="mail">quantum.lab@university.edu.eg</span><br>
      قسم الفيزياء وعلوم الحاسب · القاهرة، مصر<br>
      العرض التفاعلي الكامل: موقع مختبر أبحاث الكموم
    </div>
  </footer>

</div>
</body>
</html>
"""

OUT.write_text(HTML.replace("__ARABIC__", arabic_b64).replace("__LATIN__", latin_b64), encoding="utf-8")
print(f"WROTE {OUT} ({OUT.stat().st_size/1024:.0f} KB)")
