"""Build Perko_Local_Business_Prospects_Jerusalem.xlsx from research/prospects.json."""
import json
from collections import Counter
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo

LIME, INK, PAPER, LIME2, MUTED = 'D7FF35', '11130F', 'F8F8F4', 'BCE82D', '303626'
OUT = 'Perko_Local_Business_Prospects_Jerusalem.xlsx'

COLS = [
    ('name_he', 'Business Name (Hebrew)', 22),
    ('name_en', 'English Name', 22),
    ('category', 'Business Category', 18),
    ('street', 'Street', 16),
    ('address', 'Full Address', 26),
    ('phone', 'Public Business Phone', 17),
    ('email', 'Public Business Email', 26),
    ('website', 'Official Website', 28),
    ('instagram', 'Instagram Profile', 28),
    ('other_social', 'Other Relevant Social Profile', 28),
    ('contact_person', 'Contact Person', 18),
    ('contact_role', "Contact Person's Role", 16),
    ('description', 'Business Description', 42),
    ('why_fit', 'Why This Business Fits Perko', 48),
    ('repeat', 'Repeat-Customer Potential', 13),
    ('fit', 'Perko Fit Score (1-10)', 11),
    ('independence', 'Independence Status', 17),
    ('best_contact', 'Best Public Contact Method', 24),
    ('source_details', 'Source URL - Business Details', 30),
    ('source_contact', 'Source URL - Contact Information', 30),
    ('date_verified', 'Date Verified', 12),
    ('outreach', 'Outreach Status', 14),
    ('notes', 'Additional Notes', 44),
]
LINK_KEYS = {'website', 'instagram', 'other_social', 'source_details', 'source_contact'}

rows = json.load(open('research/prospects.json', encoding='utf-8'))
rows.sort(key=lambda r: (-int(r['fit']), r['name_en']))

wb = Workbook()
ws = wb.active
ws.title = 'Prospects'
ws.sheet_view.showGridLines = False

thin = Side(style='thin', color='D8DACE')
border = Border(left=thin, right=thin, top=thin, bottom=thin)
head_font = Font(name='Arial', bold=True, color=LIME, size=11)
body_font = Font(name='Arial', color=INK, size=10)
link_font = Font(name='Arial', color='1F4E00', size=10, underline='single')

# Title band
ws.append(['Perko - Local Business Prospects, Jerusalem (Emek Refaim & Derech Beit Lehem)'])
ws.append([f'Research list for the Perko early-access pilot. {len(rows)} businesses. Prospects only: none has agreed to participate. Contact details are public business details as published; blanks mean not verified.'])
for r, size, color, fill in ((1, 15, INK, LIME), (2, 10, MUTED, LIME)):
    for c in range(1, len(COLS) + 1):
        cell = ws.cell(row=r, column=c)
        cell.fill = PatternFill('solid', fgColor=fill)
    ws.cell(row=r, column=1).font = Font(name='Arial', bold=(r == 1), size=size, color=color)
ws.row_dimensions[1].height = 28
ws.row_dimensions[2].height = 20

HEADER_ROW = 3
for i, (_, title, width) in enumerate(COLS, start=1):
    c = ws.cell(row=HEADER_ROW, column=i, value=title)
    c.font = head_font
    c.fill = PatternFill('solid', fgColor=INK)
    c.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
    c.border = border
    ws.column_dimensions[get_column_letter(i)].width = width
ws.row_dimensions[HEADER_ROW].height = 36

for ri, r in enumerate(rows, start=HEADER_ROW + 1):
    for ci, (key, _, _) in enumerate(COLS, start=1):
        v = r.get(key, '')
        if key == 'fit':
            v = int(v)
        if key == 'outreach' and not v:
            v = 'Not Contacted'
        c = ws.cell(row=ri, column=ci, value=v if v != '' else None)
        c.font = body_font
        c.border = border
        c.alignment = Alignment(wrap_text=True, vertical='top', horizontal='center' if key in ('repeat', 'fit', 'date_verified', 'outreach', 'street') else 'left')
        if ri % 2 == 0:
            c.fill = PatternFill('solid', fgColor=PAPER)
        if key in LINK_KEYS and isinstance(v, str) and v.startswith('http'):
            c.hyperlink = v
            c.font = link_font
        if key == 'email' and v:
            c.hyperlink = f'mailto:{v}'
            c.font = link_font
        if key == 'name_he':
            c.alignment = Alignment(wrap_text=True, vertical='top', horizontal='right', readingOrder=2)
    ws.row_dimensions[ri].height = 96

last = HEADER_ROW + len(rows)
ref = f'A{HEADER_ROW}:{get_column_letter(len(COLS))}{last}'
ws.auto_filter.ref = ref
ws.freeze_panes = ws.cell(row=HEADER_ROW + 1, column=3)

fit_col = get_column_letter([k for k, _, _ in COLS].index('fit') + 1)
rep_col = get_column_letter([k for k, _, _ in COLS].index('repeat') + 1)
fit_rng = f'{fit_col}{HEADER_ROW + 1}:{fit_col}{last}'
ws.conditional_formatting.add(fit_rng, CellIsRule(operator='greaterThanOrEqual', formula=['8'], fill=PatternFill('solid', fgColor=LIME), font=Font(bold=True, color=INK)))
ws.conditional_formatting.add(fit_rng, CellIsRule(operator='between', formula=['6', '7'], fill=PatternFill('solid', fgColor='EEFFB0'), font=Font(color=INK)))
# whole-row highlight for the strongest prospects (name columns)
ws.conditional_formatting.add(f'A{HEADER_ROW + 1}:B{last}', FormulaRule(formula=[f'${fit_col}{HEADER_ROW + 1}>=8'], fill=PatternFill('solid', fgColor=LIME), font=Font(bold=True, color=INK)))
rep_rng = f'{rep_col}{HEADER_ROW + 1}:{rep_col}{last}'
ws.conditional_formatting.add(rep_rng, CellIsRule(operator='equal', formula=['"High"'], font=Font(bold=True, color=INK), fill=PatternFill('solid', fgColor=LIME2)))

# ---------- Summary ----------
sm = wb.create_sheet('Summary')
sm.sheet_view.showGridLines = False
sm.column_dimensions['A'].width = 38
sm.column_dimensions['B'].width = 14
sm.column_dimensions['C'].width = 14
row = 1


def band(title):
    global row
    for col in 'ABC':
        sm[f'{col}{row}'].fill = PatternFill('solid', fgColor=INK)
    sm[f'A{row}'] = title
    sm[f'A{row}'].font = Font(name='Arial', bold=True, color=LIME, size=12)
    row += 1


def line(label, value, share=None, bold=False):
    global row
    sm[f'A{row}'] = label
    sm[f'B{row}'] = value
    if share is not None:
        sm[f'C{row}'] = share
        sm[f'C{row}'].number_format = '0%'
    for col in 'ABC':
        c = sm[f'{col}{row}']
        c.font = Font(name='Arial', size=10, color=INK, bold=bold)
        c.border = border
        if row % 2 == 0:
            c.fill = PatternFill('solid', fgColor=PAPER)
    row += 1


sm['A1'] = 'Perko - Prospect Summary'
sm['A1'].font = Font(name='Arial', bold=True, size=15, color=INK)
for col in 'ABC':
    sm[f'{col}1'].fill = PatternFill('solid', fgColor=LIME)
sm['A2'] = 'Counts are formulas over the Prospects sheet, so they update when rows are edited.'
sm['A2'].font = Font(name='Arial', size=9, color=MUTED, italic=True)
row = 4
P = 'Prospects'
rng = lambda key: f"{P}!${get_column_letter([k for k, _, _ in COLS].index(key) + 1)}${HEADER_ROW + 1}:${get_column_letter([k for k, _, _ in COLS].index(key) + 1)}${last}"
total = len(rows)

band('Totals')
line('Businesses in the list', f'=COUNTA({rng("name_en")})', bold=True)
row += 1

band('By street')
for s in sorted(Counter(r['street'] for r in rows)):
    line(s, f'=COUNTIF({rng("street")},"{s}")', f'=B{row}/{total}')
row += 1

band('By business category')
for cat, _ in Counter(r['category'] for r in rows).most_common():
    line(cat, f'=COUNTIF({rng("category")},"{cat}")', f'=B{row}/{total}')
row += 1

band('By Perko fit score')
for lo, hi, label in ((8, 10, 'High fit (8-10)'), (6, 7, 'Medium fit (6-7)'), (1, 5, 'Lower fit (1-5)')):
    line(label, f'=COUNTIFS({rng("fit")},">={lo}",{rng("fit")},"<={hi}")', f'=B{row}/{total}')
line('Average fit score', f'=ROUND(AVERAGE({rng("fit")}),1)')
row += 1

band('By repeat-customer potential')
for lv in ('High', 'Medium', 'Low'):
    line(lv, f'=COUNTIF({rng("repeat")},"{lv}")', f'=B{row}/{total}')
row += 1

band('Contact-information completeness')
for key, label in (('phone', 'Verified public phone'), ('email', 'Verified public email'), ('website', 'Official website'), ('instagram', 'Instagram profile'), ('other_social', 'Other social profile'), ('contact_person', 'Named contact person')):
    line(label, f'=COUNTA({rng(key)})', f'=B{row}/{total}')
row += 1

band('Independence status')
for st in ('verified independent', 'appears independent', 'uncertain'):
    line(st, f'=COUNTIF({rng("independence")},"{st}")', f'=B{row}/{total}')

wb.active = 0
wb.save(OUT)
print('saved', OUT, len(rows), 'rows')
