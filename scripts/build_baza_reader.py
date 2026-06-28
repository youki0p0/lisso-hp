#!/usr/bin/env python3
"""Build a self-contained static web reader for the БАЗА Japanese translation.

Output: apps/lisso-home/public/baza/  (served live at /baza/ on Vercel)
No runtime deps, no JS frameworks — pre-rendered HTML + one CSS file + figures.
"""
import os, re, shutil, html
import markdown

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'baza-hookah-book-ja')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'apps', 'lisso-home', 'public', 'baza')

# (md filename, output html, short label, full title)
CHAPTERS = [
    ('00-introduction.md',        '00-introduction.html',        '序章',   'はじめに'),
    ('01-history-and-etiquette.md','01-history-and-etiquette.html','第1章', 'シーシャの歴史とエチケット'),
    ('02-tobacco-raw-materials.md','02-tobacco-raw-materials.html','第2章', 'シーシャ用タバコの原料と成分'),
    ('03-modern-hookahs.md',       '03-modern-hookahs.html',       '第3章', '現代のシーシャ。その進化。'),
    ('04-bowls.md',                '04-bowls.html',                '第4章', 'シーシャ用ボウル'),
    ('05-charcoal.md',             '05-charcoal.html',             '第5章', 'シーシャ用の炭'),
    ('06-mixology.md',             '06-mixology.html',             '第6章', 'ミクソロジーとは何か'),
    ('07-service-and-sales.md',    '07-service-and-sales.html',    '第7章', 'サービス・接客・販売'),
    ('08-masters-and-owners.md',   '08-masters-and-owners.html',   '第8章', 'シーシャマスターとオーナー'),
    ('09-marketing-research.md',   '09-marketing-research.html',   '第9章', 'マーケティング調査「私たちは何者か」'),
]

BOOK_TITLE = 'БАЗА'
BOOK_SUB   = 'シーシャについての本 — 日本語版'
BOOK_AUTHOR= 'パーヴェル・サヴィノフ 著'

os.makedirs(OUT, exist_ok=True)

# ---- copy figures ----
figsrc = os.path.join(SRC, 'figures')
figdst = os.path.join(OUT, 'figures')
if os.path.isdir(figdst):
    shutil.rmtree(figdst)
shutil.copytree(figsrc, figdst)
nfigs = len([f for f in os.listdir(figdst) if f.endswith('.jpg')])

def md_to_html(md_text):
    md = markdown.Markdown(extensions=['extra', 'sane_lists', 'nl2br'])
    body = md.convert(md_text)
    # Merge <p><img><br><em>caption</em></p> (nl2br adds <br>) into <figure>
    def figrepl(m):
        img = m.group('img')
        cap = m.group('cap')
        caphtml = f'<figcaption>{cap}</figcaption>' if cap else ''
        return f'<figure>{img}{caphtml}</figure>'
    # image possibly followed by <br> then <em>caption</em>, all inside one <p>
    body = re.sub(
        r'<p>\s*(?P<img><img[^>]*>)\s*(?:<br\s*/?>)?\s*(?:<em>(?P<cap>.*?)</em>)?\s*</p>',
        figrepl, body, flags=re.S)
    # any remaining standalone caption paragraphs (em starting with 図, ending with （原書 p…）) -> caption class
    body = re.sub(r'<p>\s*<em>(図.*?原書\s*p\..*?)</em>\s*</p>',
                  r'<p class="caption">\1</p>', body, flags=re.S)
    # pull a caption paragraph that immediately follows a figure into a <figcaption>
    body = re.sub(r'<figure>(<img[^>]*>)</figure>\s*<p class="caption">(.*?)</p>',
                  r'<figure>\1<figcaption>\2</figcaption></figure>', body, flags=re.S)
    return body

def page(title, body, *, css='style.css', cls='', sidebar='', topnav='', botnav=''):
    return f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<link rel="stylesheet" href="{css}">
</head>
<body class="{cls}">
<input type="checkbox" id="navtoggle" hidden>
<header class="topbar">
  <label for="navtoggle" class="menubtn" aria-label="目次">☰</label>
  <a class="brand" href="index.html">{BOOK_TITLE}<span>｜{BOOK_SUB}</span></a>
  {topnav}
</header>
<div class="layout">
  <nav class="sidebar">{sidebar}</nav>
  <label for="navtoggle" class="scrim"></label>
  <main class="content">
    {body}
    {botnav}
  </main>
</div>
</body>
</html>'''

def sidebar_html(active_idx):
    items = ['<a class="navtitle" href="index.html">📖 目次（表紙へ）</a>']
    for i,(md_f, out_f, label, title) in enumerate(CHAPTERS):
        a = 'active' if i==active_idx else ''
        items.append(f'<a class="{a}" href="{out_f}"><span class="lab">{label}</span>{html.escape(title)}</a>')
    return '\n'.join(items)

# ---- chapter pages ----
for i,(md_f, out_f, label, title) in enumerate(CHAPTERS):
    raw = open(os.path.join(SRC, md_f), encoding='utf-8').read()
    # Drop the redundant leading "# 第N章" label (our chapter header already shows it),
    # then demote any remaining top-level H1 to H2 so the page has a single H1.
    raw = re.sub(r'^#{1,3}\s+第\d+章\s*$\n?', '', raw, count=1, flags=re.M)
    raw = re.sub(r'^#\s+', '## ', raw, flags=re.M)
    body_html = md_to_html(raw)
    # prev/next
    prev_link = f'<a class="pn prev" href="{CHAPTERS[i-1][1]}">‹ {CHAPTERS[i-1][2]} {html.escape(CHAPTERS[i-1][3])}</a>' if i>0 else '<a class="pn prev" href="index.html">‹ 表紙</a>'
    nxt_link  = f'<a class="pn next" href="{CHAPTERS[i+1][1]}">{CHAPTERS[i+1][2]} {html.escape(CHAPTERS[i+1][3])} ›</a>' if i<len(CHAPTERS)-1 else ''
    botnav = f'<nav class="pagenav">{prev_link}{nxt_link}</nav>'
    chap_header = f'<div class="chaphead"><div class="lab">{label}</div><h1>{html.escape(title)}</h1></div>'
    full_body = chap_header + '<article class="prose">' + body_html + '</article>'
    out = page(f'{label} {title}｜{BOOK_TITLE}', full_body,
               cls='reader', sidebar=sidebar_html(i), botnav=botnav)
    open(os.path.join(OUT, out_f), 'w', encoding='utf-8').write(out)

# ---- cover / index ----
toc_cards = []
for i,(md_f, out_f, label, title) in enumerate(CHAPTERS):
    toc_cards.append(
        f'<a class="tocrow" href="{out_f}"><span class="num">{label}</span>'
        f'<span class="ttl">{html.escape(title)}</span><span class="arr">›</span></a>')
cover_body = f'''
<section class="cover">
  <div class="cover-card">
    <div class="cover-title">{BOOK_TITLE}</div>
    <div class="cover-sub">{BOOK_SUB}</div>
    <div class="cover-author">{BOOK_AUTHOR}</div>
  </div>
  <p class="cover-lead">
    ロシアのシーシャ業界のオープンな知識ベースとして編まれた専門書『БАЗА（КНИГА ПРО КАЛЬЯНЫ）』の
    日本語全訳です。歴史・たばこ原料・シーシャ本体・ボウル・炭・ミクソロジー・サービス・経営・統計までを収録し、
    原書の図版{nfigs}枚を本文の該当位置に掲載しています。
  </p>
  <div class="toc">
    <div class="toc-head">目次</div>
    {''.join(toc_cards)}
  </div>
  <p class="startline"><a class="startbtn" href="{CHAPTERS[0][1]}">最初から読む →</a></p>
  <p class="note">本書はシーシャという嗜好品を扱う業界専門書です。内容は原著の忠実な翻訳であり、喫煙を推奨するものではありません。</p>
</section>'''
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(
    page(f'{BOOK_TITLE}｜{BOOK_SUB}', cover_body, cls='home', sidebar=sidebar_html(-1)))

# ---- stylesheet (source: scripts/baza_reader_style.css) ----
_style_src = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'baza_reader_style.css')
with open(_style_src, encoding='utf-8') as _f:
    open(os.path.join(OUT, 'style.css'), 'w', encoding='utf-8').write(_f.read())

print(f'built reader: {len(CHAPTERS)} chapters + cover, {nfigs} figures, style.css -> {OUT}')
