from __future__ import annotations

import argparse
import hashlib
import html
import re
from pathlib import Path

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


def slugify(value: str) -> str:
    value = value.lower().replace("'", "").replace("’", "")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "onderdeel"


def iter_blocks(document: DocumentType):
    for child in document.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def rich_text(text: str) -> str:
    escaped = html.escape(text.strip())
    for prefix in ("Wat doet het?", "Hoe lees je het?", "Rollen.", "Modules.", "Testomgeving en productie."):
        if escaped.startswith(prefix):
            return f"<strong>{html.escape(prefix)}</strong>{escaped[len(prefix):]}"
    return escaped


def paragraph_images(paragraph: Paragraph, media_dir: Path, output_path: Path) -> list[str]:
    sources = []
    for blip in paragraph._p.xpath(".//a:blip"):
        rel_id = blip.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed")
        if not rel_id or rel_id not in paragraph.part.related_parts:
            continue
        part = paragraph.part.related_parts[rel_id]
        digest = hashlib.sha1(part.blob).hexdigest()[:10]
        suffix = Path(str(part.partname)).suffix or ".png"
        filename = f"handleiding-{digest}{suffix}"
        target = media_dir / filename
        if not target.exists():
            target.write_bytes(part.blob)
        sources.append(Path("images/kennisbank", filename).as_posix())
    return sources


def table_html(table: Table) -> str:
    rows = []
    for index, row in enumerate(table.rows):
        tag = "th" if index == 0 else "td"
        cells = "".join(f"<{tag}>{html.escape(cell.text.strip())}</{tag}>" for cell in row.cells)
        rows.append(f"<tr>{cells}</tr>")
    if not rows:
        return ""
    return '<div class="kb-table-wrap"><table class="kb-table"><thead>' + rows[0] + "</thead><tbody>" + "".join(rows[1:]) + "</tbody></table></div>"


def build(input_path: Path, output_path: Path, media_dir: Path) -> None:
    document = Document(input_path)
    media_dir.mkdir(parents=True, exist_ok=True)

    body: list[str] = []
    chapters: list[tuple[str, str]] = []
    section_open = False
    list_open = False
    used_slugs: set[str] = set()

    def close_list() -> None:
        nonlocal list_open
        if list_open:
            body.append("</ul>")
            list_open = False

    for block in iter_blocks(document):
        if isinstance(block, Paragraph):
            text = block.text.strip()
            style = block.style.name if block.style else ""
            images = paragraph_images(block, media_dir, output_path)

            if style == "Heading 1":
                continue
            if style == "Heading 2" and text:
                close_list()
                if section_open:
                    body.append("</section>")
                base = slugify(re.sub(r"^\d+\.\s*", "", text))
                slug = base
                counter = 2
                while slug in used_slugs:
                    slug = f"{base}-{counter}"
                    counter += 1
                used_slugs.add(slug)
                chapters.append((slug, text))
                body.append(f'<section class="kb-section" id="{slug}" data-search-section>')
                body.append(f'<h2>{html.escape(text)}</h2>')
                section_open = True
            elif style == "Heading 3" and text:
                close_list()
                body.append(f'<h3>{html.escape(text)}</h3>')
            elif style.startswith("List") and text:
                if not list_open:
                    body.append('<ul class="kb-steps">')
                    list_open = True
                body.append(f"<li>{rich_text(text)}</li>")
            elif text and not (not section_open and "@Tender Insight" in text):
                close_list()
                body.append(f"<p>{rich_text(text)}</p>")

            for source in images:
                close_list()
                body.append(f'<figure class="kb-figure"><img src="{source}" loading="lazy" alt="Schermbeeld uit de Tender Insights beheerdershandleiding"></figure>')
        else:
            close_list()
            body.append(table_html(block))

    close_list()
    if section_open:
        body.append("</section>")

    nav = "".join(f'<a href="#{slug}">{html.escape(title)}</a>' for slug, title in chapters)
    numbered_chapters = [(slug, title) for slug, title in chapters if title != "Inleiding"]
    quick = "".join(
        f'<a href="#{slug}"><span>{index:02d}</span><strong>{html.escape(re.sub(r"^\d+\.\s*", "", title))}</strong></a>'
        for index, (slug, title) in enumerate(numbered_chapters, 1)
    )

    page = f'''<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Beheerderskennisbank voor Tender Insights met procedures, veldbeschrijvingen, stappenplannen en veelgestelde vragen.">
  <link rel="canonical" href="https://www.tenderinsight.be/kennisbank.html">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/kennisbank.css">
  <title>Beheerderskennisbank | Tender Insights</title>
</head>
<body class="knowledge-base-page">
  <a class="skip-link" href="#main-content">Ga naar de inhoud</a>
  <header class="site-header" id="top"><div class="container nav-wrap">
    <a class="brand" href="index.html"><img class="brand-logo" src="images/tender-insight-logo-transparent.png" alt="Tender Insight"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"><span class="sr-only">Menu openen</span><span></span><span></span><span></span></button>
    <nav class="primary-nav" id="primary-navigation" aria-label="Hoofdnavigatie"><a href="producten.html">Producten</a><a href="consultancy-advisory.html">Consultancy &amp; Advisory</a><a href="academy.html">Academy</a><a href="insights.html">Insights</a><a href="over-ons.html">Over ons</a><a class="nav-app" href="https://app.tenderinsight.be/" target="_blank" rel="noopener">Naar de app</a></nav>
  </div></header>

  <main id="main-content">
    <section class="kb-hero"><div class="container kb-hero-grid"><div><p class="eyebrow light">Tender Insights ondersteuning</p><h1>Kennisbank voor beheerders</h1><p>Vind procedures, veldbeschrijvingen en praktische uitleg voor het dagelijks beheer van Tender Insights.</p></div><div class="kb-hero-actions"><a class="button button-primary" href="https://app.tenderinsight.be/" target="_blank" rel="noopener">Open Tender Insights <span aria-hidden="true">↗</span></a><span>Gebaseerd op de beheerdershandleiding van 3 november 2026</span></div></div></section>

    <section class="kb-tools"><div class="container"><label for="kb-search">Zoeken in de kennisbank</label><div class="kb-search-row"><input id="kb-search" type="search" placeholder="Zoek bijvoorbeeld op MFA, contract, SLA, import of back-up…" autocomplete="off"><button id="kb-clear" type="button">Wissen</button></div><p id="kb-results" aria-live="polite"></p></div></section>

    <section class="kb-overview"><div class="container"><p class="eyebrow">Alle onderwerpen</p><h2>Van eerste aanmelding tot herstel</h2><div class="kb-quick-grid">{quick}</div></div></section>

    <div class="container kb-layout"><aside class="kb-sidebar" aria-label="Hoofdstukken"><strong>In deze kennisbank</strong><nav>{nav}</nav></aside><article class="kb-content">{''.join(body)}<div class="kb-empty" hidden><h2>Geen resultaat gevonden</h2><p>Probeer een andere zoekterm of wis de zoekopdracht om alle hoofdstukken opnieuw te tonen.</p></div></article></div>
  </main>

  <footer class="site-footer"><div class="container footer-main"><a class="brand footer-brand" href="index.html"><img class="brand-logo" src="images/tender-insight-logo-transparent.png" alt="Tender Insight"></a><div><h2>Ondersteuning</h2><a href="kennisbank.html">Beheerderskennisbank</a><a href="https://app.tenderinsight.be/" target="_blank" rel="noopener">Tender Insights openen</a></div><div><h2>Contact</h2><a href="mailto:info@tenderinsight.be">info@tenderinsight.be</a><a href="tel:+32484833707">0484 83 37 07</a></div></div><div class="container footer-bottom"><span>© <span id="current-year">2026</span> Tender Insight BV</span><a href="privacy.html">Privacy</a></div></footer>
  <script src="js/script.js"></script>
  <script src="js/kennisbank.js"></script>
</body>
</html>'''
    output_path.write_text(page, encoding="utf-8")
    print(f"Created {output_path} with {len(chapters)} chapters and {len(list(media_dir.iterdir()))} media files")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("media", type=Path)
    args = parser.parse_args()
    build(args.input, args.output, args.media)
