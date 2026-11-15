"""Análise dos dados do LocalSend e geração das figuras do trabalho.

Lê dados/*.csv (gerados por coletar_dados.py) e grava:
  figuras/*.png      - histograma, dispersão, Pareto, fluxograma e Ishikawa
  dados/stats.json   - números citados no relatório e nos slides
"""
import csv
import json
import math
import os
import statistics as st
from collections import Counter
from datetime import datetime
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Polygon

BASE = Path(__file__).parent
# TEMA=slides gera as figuras no estilo da apresentação (pasta figuras_slides); o padrão é o do relatório
TEMA = os.environ.get("TEMA", "relatorio")
FIG = BASE / ("figuras_slides" if TEMA == "slides" else "figuras")
FIG.mkdir(exist_ok=True)

# Paleta do trabalho
TEAL, TEAL_L, AMBER, INK, GRID, MUTED = "#0F4C5C", "#5F9EA0", "#E36414", "#1F2933", "#D9E2E5", "#5B6770"
FILL_BOX, FILL_DIAM, BAR_SOFT, FONTE_FIG = "#E6F0F2", "#FDF0E7", "#A7C4C9", "Calibri"
if TEMA == "slides":   # grafite + vermelho de carimbo
    TEAL, TEAL_L, AMBER, INK, GRID, MUTED = "#1B1F23", "#8A949D", "#D9411E", "#1B1F23", "#E3E8EC", "#5C6670"
    FILL_BOX, FILL_DIAM, BAR_SOFT, FONTE_FIG = "#FFF3B8", "#FBE4DC", "#C4CBD1", "Segoe UI"
plt.rcParams.update({
    "font.family": FONTE_FIG, "axes.unicode_minus": False, "font.size": 11, "axes.edgecolor": MUTED, "axes.labelcolor": INK,
    "xtick.color": MUTED, "ytick.color": MUTED, "axes.spines.top": False, "axes.spines.right": False,
    "axes.titleweight": "bold", "axes.titlesize": 13, "axes.titlecolor": INK,
})


def p(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")) if s else None


prs = list(csv.DictReader(open(BASE / "dados/prs_merged.csv", encoding="utf-8")))
bugs = list(csv.DictReader(open(BASE / "dados/bugs.csv", encoding="utf-8")))
stats = {"coleta": "2026-11-15", "n_prs": len(prs), "n_bugs": len(bugs)}

# ---------------------------------------------------------------- histograma
horas = [(p(x["mergedAt"]) - p(x["createdAt"])).total_seconds() / 3600 for x in prs]
q = st.quantiles(horas, n=100)
stats["lead"] = {
    "mediana_h": round(st.median(horas), 1), "media_h": round(st.mean(horas), 1),
    "p25_h": round(q[24], 1), "p75_h": round(q[74], 1), "p85_h": round(q[84], 1), "p90_h": round(q[89], 1),
    "ate_24h_pct": round(100 * sum(h <= 24 for h in horas) / len(horas), 1),
    "acima_72h_pct": round(100 * sum(h > 72 for h in horas) / len(horas), 1),
    "acima_30d_pct": round(100 * sum(h > 720 for h in horas) / len(horas), 1),
}
largura, limite = 6, 72
classes = list(range(0, limite, largura))
cont = [sum(a <= h < a + largura for h in horas) for a in classes]
cont_over = sum(h >= limite for h in horas)
stats["hist_classes"] = {f"{a}-{a + largura}h": c for a, c in zip(classes, cont)} | {">=72h": cont_over}

fig, ax = plt.subplots(figsize=(9, 4.6), dpi=200)
ax.bar([a + largura / 2 for a in classes], cont, width=largura * 0.92, color=TEAL)
ax.bar(limite + largura / 2 + 2, cont_over, width=largura * 0.92, color=AMBER)
for a, c in zip(classes, cont):
    ax.text(a + largura / 2, c + 4, str(c), ha="center", fontsize=9, color=INK)
ax.text(limite + largura / 2 + 2, cont_over + 4, str(cont_over), ha="center", fontsize=9, color=INK)
ax.set_xticks(list(range(0, limite + 1, 12)) + [limite + largura / 2 + 2])
ax.set_xticklabels([str(t) for t in range(0, limite + 1, 12)] + ["≥72"])
ax.axvline(stats["lead"]["mediana_h"], color=INK, ls="--", lw=1)
ax.text(stats["lead"]["mediana_h"] + 1, max(cont) * 0.92, f"mediana = {stats['lead']['mediana_h']:.1f} h".replace(".", ","), fontsize=10)
ax.set_xlabel("Lead time do pull request (horas da abertura ao merge) — classes de 6 h")
ax.set_ylabel("Quantidade de PRs")
ax.set_title(f"Histograma do lead time dos PRs mesclados — LocalSend (n = {len(prs)})", loc="left")
ax.grid(axis="y", color=GRID, lw=0.8)
ax.set_axisbelow(True)
fig.tight_layout()
fig.savefig(FIG / "histograma.png")
plt.close(fig)

# ---------------------------------------------------------------- dispersão
tam = [int(x["additions"]) + int(x["deletions"]) for x in prs]


def ranks(v):
    ordem = sorted(range(len(v)), key=lambda i: v[i])
    r = [0.0] * len(v)
    i = 0
    while i < len(v):
        j = i
        while j + 1 < len(v) and v[ordem[j + 1]] == v[ordem[i]]:
            j += 1
        for k in range(i, j + 1):
            r[ordem[k]] = (i + j) / 2 + 1
        i = j + 1
    return r


def pearson(a, b):
    ma, mb = st.mean(a), st.mean(b)
    num = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    return num / math.sqrt(sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b))


rho = pearson(ranks(tam), ranks(horas))
r_bruto = pearson(tam, horas)
faixas = [(0, 10), (10, 100), (100, 1000), (1000, 10 ** 9)]
med_faixa = {}
for lo, hi in faixas:
    sel = [h for t, h in zip(tam, horas) if lo <= t < hi]
    med_faixa[f"{lo}-{hi if hi < 10**9 else 'inf'}"] = {"n": len(sel), "mediana_h": round(st.median(sel), 1)}
stats["dispersao"] = {"spearman": round(rho, 2), "pearson_bruto": round(r_bruto, 2),
                      "mediana_linhas": st.median(tam), "por_faixa": med_faixa}

fig, ax = plt.subplots(figsize=(9, 4.8), dpi=200)
ax.scatter([max(t, 1) for t in tam], [max(h, 0.01) for h in horas], s=12, alpha=0.45, color=TEAL, edgecolors="none")
ax.set_xscale("log")
ax.set_yscale("log")
xs = [10 ** (i / 10) for i in range(0, 51)]
# reta de tendência no espaço log-log (mínimos quadrados)
lx = [math.log10(max(t, 1)) for t in tam]
ly = [math.log10(max(h, 0.01)) for h in horas]
mx, my = st.mean(lx), st.mean(ly)
b1 = sum((a - mx) * (b - my) for a, b in zip(lx, ly)) / sum((a - mx) ** 2 for a in lx)
b0 = my - b1 * mx
ax.plot(xs, [10 ** (b0 + b1 * math.log10(x)) for x in xs], color=AMBER, lw=2, label="tendência (log-log)")
stats["dispersao"]["inclinacao_loglog"] = round(b1, 2)
ax.set_xlabel("Tamanho do PR (linhas adicionadas + removidas, escala log)")
ax.set_ylabel("Lead time até o merge (horas, escala log)")
ax.set_title(f"Tamanho do PR × lead time — LocalSend (n = {len(prs)}, ρ de Spearman = {rho:.2f})".replace("0.", "0,"), loc="left")
ax.grid(color=GRID, lw=0.6, which="major")
ax.set_axisbelow(True)
ax.legend(frameon=False, loc="lower right")
fig.tight_layout()
fig.savefig(FIG / "dispersao.png")
plt.close(fig)

# ---------------------------------------------------------------- Pareto
COMP = ["android", "linux", "windows", "macos", "ios", "networking", "tv", "packaging", "cli", "ux", "web"]
NOMES = {"android": "Android", "linux": "Linux", "windows": "Windows", "macos": "macOS", "ios": "iOS",
         "networking": "Rede", "tv": "TV", "packaging": "Empacotamento", "cli": "CLI", "ux": "UX", "web": "Web"}
cnt = Counter()
for b in bugs:
    for l in b["labels"].split(";"):
        if l in COMP:
            cnt[l] += 1
itens = cnt.most_common()
total = sum(c for _, c in itens)
acum, s = [], 0
for _, c in itens:
    s += c
    acum.append(100 * s / total)
stats["pareto"] = {"total_rotulos": total, "itens": [[NOMES[k], c] for k, c in itens],
                   "acumulado": [round(a, 1) for a in acum],
                   "bugs_com_componente": sum(any(l in COMP for l in b["labels"].split(";")) for b in bugs)}

fig, ax = plt.subplots(figsize=(9, 4.8), dpi=200)
cores = [TEAL if a <= 80.5 or i == 0 else TEAL_L for i, a in enumerate(acum)]
# destaca as categorias até cruzar 80 %
corte = next(i for i, a in enumerate(acum) if a >= 80)
cores = [TEAL if i <= corte else BAR_SOFT for i in range(len(itens))]
x = range(len(itens))
ax.bar(x, [c for _, c in itens], color=cores)
for i, (_, c) in enumerate(itens):
    ax.text(i, c + 1, str(c), ha="center", fontsize=9, color=INK)
ax.set_xticks(list(x))
ax.set_xticklabels([NOMES[k] for k, _ in itens], rotation=0, fontsize=9)
ax.set_ylabel("Issues de bug com o rótulo")
ax2 = ax.twinx()
ax2.plot(list(x), acum, color=AMBER, marker="o", lw=2)
for i, a in enumerate(acum):
    if i <= corte + 1:
        ax2.text(i, a + 3, f"{a:.0f}%", ha="center", fontsize=9, color=AMBER)
ax2.axhline(80, color=MUTED, ls=":", lw=1)
ax2.set_ylim(0, 110)
ax2.set_ylabel("% acumulado")
ax2.spines["top"].set_visible(False)
ax.set_title(f"Pareto dos bugs por plataforma/componente — LocalSend ({total} rótulos)", loc="left")
ax.grid(axis="y", color=GRID, lw=0.8)
ax.set_axisbelow(True)
fig.tight_layout()
fig.savefig(FIG / "pareto.png")
plt.close(fig)

# ---------------------------------------------------------------- folha de verificação (contagem)
anos = ["2023", "2024", "2025", "2026"]
folha = {NOMES[k]: {a: 0 for a in anos} for k, _ in itens}
for b in bugs:
    for l in b["labels"].split(";"):
        if l in COMP:
            folha[NOMES[l]][b["createdAt"][:4]] += 1
stats["folha"] = folha
estado = Counter((b["state"], b["stateReason"] or "") for b in bugs)
stats["estado_bugs"] = {"abertos": estado[("OPEN", "")] + estado[("OPEN", "REOPENED")],
                        "corrigidos": estado[("CLOSED", "COMPLETED")],
                        "nao_planejados": estado[("CLOSED", "NOT_PLANNED")],
                        "duplicados": estado[("CLOSED", "DUPLICATE")]}
fech = [(p(b["closedAt"]) - p(b["createdAt"])).total_seconds() / 86400 for b in bugs
        if b["state"] == "CLOSED" and b["stateReason"] == "COMPLETED"]
stats["bug_fechamento_mediana_dias"] = round(st.median(fech), 1)
stats["bugs_por_ano"] = dict(Counter(b["createdAt"][:4] for b in bugs))
stats["prs_por_ano"] = dict(Counter(x["createdAt"][:4] for x in prs))


# ---------------------------------------------------------------- fluxograma
def caixa(ax, x, y, txt, w=2.2, h=0.62, cor=TEAL, fc="white", bold=False):
    ax.add_patch(FancyBboxPatch((x - w / 2, y - h / 2), w, h, boxstyle="round,pad=0.02,rounding_size=0.12",
                                fc=fc, ec=cor, lw=1.6))
    ax.text(x, y, txt, ha="center", va="center", fontsize=9.5, color=INK, fontweight="bold" if bold else "normal")


def losango(ax, x, y, txt, w=2.3, h=0.95):
    ax.add_patch(Polygon([(x, y + h / 2), (x + w / 2, y), (x, y - h / 2), (x - w / 2, y)], closed=True,
                         fc=FILL_DIAM, ec=AMBER, lw=1.6))
    ax.text(x, y, txt, ha="center", va="center", fontsize=9, color=INK)


def seta(ax, a, b, txt=None, off=(0.08, 0.05)):
    ax.annotate("", xy=b, xytext=a, arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.3))
    if txt:
        ax.text((a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1], txt, fontsize=8.5, color=AMBER,
                fontweight="bold")


e = stats["estado_bugs"]


def linha(ax, pts, txt=None, pos=None):
    """Seta em polilinha: pts = [(x,y), ...]; a ponta fica no último ponto."""
    for a, b in zip(pts[:-2], pts[1:-1]):
        ax.plot([a[0], b[0]], [a[1], b[1]], color=MUTED, lw=1.3, solid_capstyle="round")
    ax.annotate("", xy=pts[-1], xytext=pts[-2], arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.3))
    if txt:
        ax.text(pos[0], pos[1], txt, fontsize=8.8, color=AMBER, fontweight="bold")


fig, ax = plt.subplots(figsize=(11, 7.2), dpi=200)
ax.set_xlim(0, 15.5)
ax.set_ylim(0.4, 9.6)
ax.axis("off")
A, S1, B, S2 = 2.4, 5.9, 9.9, 13.4          # colunas: triagem, saídas, correção, retrabalho
Y = [8.7, 7.3, 5.8, 4.3, 2.85, 1.45]
ax.text(A, 9.4, "TRIAGEM", ha="center", fontsize=10, color=MUTED, fontweight="bold")
ax.text(B, 9.4, "CORREÇÃO E ENTREGA", ha="center", fontsize=10, color=MUTED, fontweight="bold")
caixa(ax, A, Y[0], "Usuário abre issue\n(template de bug)", fc=FILL_BOX, bold=True)
losango(ax, A, Y[1], "Informações\nsuficientes?")
losango(ax, A, Y[2], "Já existe\nissue igual?")
losango(ax, A, Y[3], "Será\ncorrigido?")
caixa(ax, A, Y[4], "Rótulos: bug +\nplataforma (Pareto)")
caixa(ax, S1, Y[1], "needs-more-info\n(aguarda o autor)", w=2.3, cor=MUTED)
caixa(ax, S1, Y[2], f"Fecha como duplicada\n({e['duplicados']} issues)", w=2.4, cor=MUTED)
caixa(ax, S1, Y[3], f"Fecha: não planejado\n({e['nao_planejados']} issues)", w=2.4, cor=MUTED)
caixa(ax, B, Y[0], "Contribuidor abre PR\ncom a correção", w=2.3)
losango(ax, B, Y[1], "CI (GitHub\nActions) passa?")
losango(ax, B, Y[2], "Revisão do\nmantenedor ok?")
caixa(ax, B, Y[3], "Merge na main\n(lead time → histograma)", w=2.6)
caixa(ax, B, Y[4], "Release publicada")
caixa(ax, B, Y[5], f"Issue fechada: corrigida\n({e['corrigidos']} issues)", w=2.6, fc=FILL_BOX, bold=True)
caixa(ax, S2, Y[1], "Ajusta o código e\nenvia novo commit", w=2.3, cor=MUTED)
hw, hd = 1.15, 0.475   # meia largura / meia altura do losango
# coluna de triagem
linha(ax, [(A, Y[0] - 0.31), (A, Y[1] + hd)])
linha(ax, [(A, Y[1] - hd), (A, Y[2] + hd)], "sim", (A + 0.12, (Y[1] + Y[2]) / 2))
linha(ax, [(A, Y[2] - hd), (A, Y[3] + hd)], "não", (A + 0.12, (Y[2] + Y[3]) / 2))
linha(ax, [(A, Y[3] - hd), (A, Y[4] + 0.31)], "sim", (A + 0.12, (Y[3] + Y[4]) / 2 - 0.1))
linha(ax, [(A + hw, Y[1]), (S1 - 1.15, Y[1])], "não", (A + hw + 0.15, Y[1] + 0.1))
linha(ax, [(A + hw, Y[2]), (S1 - 1.2, Y[2])], "sim", (A + hw + 0.15, Y[2] + 0.1))
linha(ax, [(A + hw, Y[3]), (S1 - 1.2, Y[3])], "não", (A + hw + 0.15, Y[3] + 0.1))
linha(ax, [(S1, Y[1] + 0.31), (S1, Y[0]), (A + 1.1, Y[0])], "autor complementa", (S1 - 2.1, Y[0] + 0.12))
# passagem da triagem para a correção
linha(ax, [(A + 1.1, Y[4]), (7.75, Y[4]), (7.75, Y[0]), (B - 1.15, Y[0])])
# coluna de correção
linha(ax, [(B, Y[0] - 0.31), (B, Y[1] + hd)])
linha(ax, [(B, Y[1] - hd), (B, Y[2] + hd)], "sim", (B + 0.12, (Y[1] + Y[2]) / 2))
linha(ax, [(B, Y[2] - hd), (B, Y[3] + 0.31)], "sim", (B + 0.12, (Y[2] + Y[3]) / 2 - 0.1))
linha(ax, [(B, Y[3] - 0.31), (B, Y[4] + 0.31)])
linha(ax, [(B, Y[4] - 0.31), (B, Y[5] + 0.31)])
linha(ax, [(B + hw, Y[1]), (S2 - 1.15, Y[1])], "não", (B + hw + 0.15, Y[1] + 0.1))
linha(ax, [(B + hw, Y[2]), (S2, Y[2]), (S2, Y[1] - 0.31)], "não (pede mudanças)", (B + hw + 0.15, Y[2] + 0.1))
linha(ax, [(S2, Y[1] + 0.31), (S2, Y[0]), (B + 1.15, Y[0])])
ax.text(0.2, 0.55, f"Situação em 15/11/2026: {e['abertos']} das {len(bugs)} issues de bug seguiam abertas "
                   f"(fila de triagem e correção). Processo inferido dos rótulos e estados públicos do repositório.",
        fontsize=8.8, color=MUTED, style="italic")
ax.set_title("Fluxograma do ciclo de vida de um bug no LocalSend", loc="left", fontsize=12)
fig.tight_layout()
fig.savefig(FIG / "fluxograma.png")
plt.close(fig)

# ---------------------------------------------------------------- Ishikawa (CrowdStrike 2024)
fig, ax = plt.subplots(figsize=(12, 6.2), dpi=200)
ax.set_xlim(0, 16)
ax.set_ylim(0, 9)
ax.axis("off")
ax.annotate("", xy=(12.6, 4.5), xytext=(0.6, 4.5), arrowprops=dict(arrowstyle="-|>", color=INK, lw=2.4))
ax.add_patch(FancyBboxPatch((12.7, 3.55), 3.1, 1.9, boxstyle="round,pad=0.03,rounding_size=0.15",
                            fc=AMBER, ec=AMBER))
ax.text(14.25, 4.5, "Falha global:\n~8,5 milhões de PCs\nWindows em tela azul\n(19/07/2024)",
        ha="center", va="center", color="white", fontsize=10.5, fontweight="bold")
espinhas = {
    ("Método / Processo", True, 2.3): ["Conteúdo \"Rapid Response\" sem\nimplantação gradual (canário)",
                                       "Mesma versão para todos os\nclientes ao mesmo tempo"],
    ("Medição / Testes", True, 6.3): ["Validador de conteúdo com\nerro de lógica (aceitou o arquivo)",
                                      "Teste do template não cobriu\nvalor não-curinga no 21º campo"],
    ("Máquina / Software", True, 10.3): ["Interpretador sem checagem\nde limites do array",
                                         "Código roda no kernel:\nerro derruba o SO"],
    ("Material / Dados", False, 2.3): ["Template definia 21 campos,\nintegração enviava só 20",
                                       "Channel File 291 com\nnovo critério de detecção"],
    ("Mão de obra / Pessoas", False, 6.3): ["Confiança no histórico de\nentregas anteriores sem falha",
                                            "Revisão não questionou o\ndescasamento 21 × 20"],
    ("Meio / Ambiente", False, 10.3): ["Base instalada enorme e\ncrítica (aeroportos, bancos)",
                                       "Recuperação manual, máquina\na máquina (modo seguro)"],
}
for (nome, cima, x), causas in espinhas.items():
    y0 = 8.3 if cima else 0.7
    ax.annotate("", xy=(x + 1.7, 4.5), xytext=(x, y0), arrowprops=dict(arrowstyle="-", color=TEAL, lw=1.8))
    ax.text(x, y0 + (0.3 if cima else -0.35), nome, ha="center", fontsize=10.5, fontweight="bold", color=TEAL)
    for k, c in enumerate(causas):
        t = 0.3 + 0.38 * k
        yy = y0 + (4.5 - y0) * t
        xx = x + 1.7 * t
        ax.annotate("", xy=(xx, yy), xytext=(xx - 1.2, yy), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1))
        ax.text(xx - 1.25, yy, c, ha="right", va="center", fontsize=8.3, color=INK)
ax.set_title("Diagrama de causa e efeito (Ishikawa, 6M adaptado) — incidente CrowdStrike Channel File 291",
             loc="left", fontsize=12)
fig.tight_layout()
fig.savefig(FIG / "ishikawa.png")
plt.close(fig)

if TEMA != "slides":
    json.dump(stats, open(BASE / "dados/stats.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(json.dumps(stats, ensure_ascii=False, indent=1))
