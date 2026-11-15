"""Gera o relatório do Trabalho N3 (Qualidade de Software) em .docx e em PDF.

Cada função auxiliar escreve ao mesmo tempo no .docx (editável no Word) e em um HTML
que o Microsoft Edge imprime em PDF (o Word trava ao exportar PDF por automação nesta
máquina). O sumário do PDF sai em duas passadas: imprime, lê a página de cada título e
imprime de novo. Os números vêm de dados/stats.json (analisar_dados.py).
Para trocar os nomes da equipe, edite INTEGRANTES e rode de novo.
"""
import html as _html
import json
import re
import subprocess
from pathlib import Path

INTEGRANTES = ["GABRIEL MASSAIA DE OLIVEIRA", "GEISON CARLOS MELO", "LEONARDO MATEUS ANDERS", "THIAGO LUIS LOMBARDI MAES"]
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
HT = []      # corpo do HTML
SUM = []     # (nível, id, texto) para o sumário do PDF


def md2html(texto):
    t = _html.escape(texto, quote=False)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*([^*]+)\*", r"<i>\1</i>", t)

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

BASE = Path(__file__).parent
OUT = BASE.parent / "Relatório N3 - Ferramentas da Qualidade.docx"
S = json.load(open(BASE / "dados/stats.json", encoding="utf-8"))
L, D, PA = S["lead"], S["dispersao"], S["pareto"]
EB = S["estado_bugs"]

TEAL = RGBColor(0x0F, 0x4C, 0x5C)
FONTE = "Arial"


def br(v, casas=1):
    """Número com vírgula decimal."""
    return f"{v:.{casas}f}".replace(".", ",")


doc = Document()
sec = doc.sections[0]
sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
sec.left_margin, sec.top_margin, sec.right_margin, sec.bottom_margin = Cm(3), Cm(3), Cm(2), Cm(2)

st = doc.styles["Normal"]
st.font.name = FONTE
st.font.size = Pt(12)
st.element.rPr.rFonts.set(qn("w:eastAsia"), FONTE)
pf = st.paragraph_format
pf.line_spacing = 1.5
pf.space_after = Pt(0)
pf.space_before = Pt(0)

for nome, tam, antes, depois in [("Heading 1", 12, 0, 12), ("Heading 2", 12, 12, 6), ("Heading 3", 12, 6, 6)]:
    h = doc.styles[nome]
    h.font.name = FONTE
    h.font.size = Pt(tam)
    h.font.bold = True
    h.font.italic = False
    h.font.color.rgb = RGBColor(0, 0, 0)
    h.element.rPr.rFonts.set(qn("w:eastAsia"), FONTE)
    rf = h.element.rPr.rFonts
    for a in ("w:ascii", "w:hAnsi", "w:cs"):
        rf.set(qn(a), FONTE)
    h.paragraph_format.space_before = Pt(antes)
    h.paragraph_format.space_after = Pt(depois)
    h.paragraph_format.keep_with_next = True
    h.paragraph_format.line_spacing = 1.5

cont = {"fig": 0, "tab": 0, "quadro": 0}


def runs(par, texto, tam=None, cor=None):
    """Escreve texto com **negrito** e *itálico* simples."""
    for parte in re.split(r"(\*\*[^*]+\*\*|\*[^*]+\*)", texto):
        if not parte:
            continue
        if parte.startswith("**"):
            r = par.add_run(parte[2:-2])
            r.bold = True
        elif parte.startswith("*"):
            r = par.add_run(parte[1:-1])
            r.italic = True
        else:
            r = par.add_run(parte)
        if tam:
            r.font.size = Pt(tam)
        if cor:
            r.font.color.rgb = cor
    return par


def P(texto, recuo=True, alin=WD_ALIGN_PARAGRAPH.JUSTIFY, depois=6):
    par = doc.add_paragraph()
    par.alignment = alin
    if recuo:
        par.paragraph_format.first_line_indent = Cm(1.25)
    par.paragraph_format.space_after = Pt(depois)
    HT.append(f'<p class="{"ind" if recuo else ""}">{md2html(texto)}</p>')
    return runs(par, texto)


def BUL(itens):
    for t in itens:
        par = doc.add_paragraph(style="List Bullet")
        par.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        par.paragraph_format.space_after = Pt(3)
        runs(par, t)
    doc.paragraphs[-1].paragraph_format.space_after = Pt(8)
    HT.append("<ul>" + "".join(f"<li>{md2html(t)}</li>" for t in itens) + "</ul>")


def _titulo(t, nivel):
    hid = f"s{len(SUM) + 1}"
    SUM.append((nivel, hid, t))
    HT.append(f'<h{nivel} id="{hid}">{_html.escape(t)}</h{nivel}>')
    return doc.add_heading(t, level=nivel)


def H1(t, nova_pagina=True):
    if nova_pagina:
        quebra()
    return _titulo(t.upper(), 1)


def H2(t):
    return _titulo(t, 2)


def quebra():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    HT.append('<div class="pb"></div>')


def legenda(tipo, texto):
    cont[tipo] += 1
    rot = {"fig": "Figura", "tab": "Tabela", "quadro": "Quadro"}[tipo]
    par = doc.add_paragraph()
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER
    par.paragraph_format.space_before = Pt(6)
    par.paragraph_format.keep_with_next = True
    par.paragraph_format.line_spacing = 1.0
    r = par.add_run(f"{rot} {cont[tipo]} – ")
    r.bold = True
    r.font.size = Pt(10)
    r2 = par.add_run(texto)
    r2.font.size = Pt(10)
    HT.append(f'<p class="leg"><b>{rot} {cont[tipo]} – </b>{md2html(texto)}</p>')
    return cont[tipo]


def fonte(texto):
    par = doc.add_paragraph()
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER
    par.paragraph_format.space_after = Pt(10)
    par.paragraph_format.line_spacing = 1.0
    runs(par, "Fonte: " + texto, tam=10)
    HT.append(f'<p class="fonte">Fonte: {md2html(texto)}</p>')


def FIG(arq, texto, fonte_txt, largura=15.5):
    HT.append('<div class="bloco">')
    n = legenda("fig", texto)
    par = doc.add_paragraph()
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER
    par.paragraph_format.keep_with_next = True
    par.paragraph_format.line_spacing = 1.0
    par.add_run().add_picture(str(BASE / "figuras" / arq), width=Cm(largura))
    HT.append(f'<p class="img"><img src="figuras/{arq}" style="width:{largura}cm"></p>')
    fonte(fonte_txt)
    HT.append("</div>")
    return n


def sombrear(cell, hexcor):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hexcor)
    tcPr.append(shd)


def TAB(tipo, titulo, linhas, larguras, fonte_txt, tam=9.5, alinhar_num=False):
    HT.append('<div class="bloco">')
    n = legenda(tipo, titulo)
    h = [f'<table style="font-size:{tam}pt">', "<colgroup>"]
    h += [f'<col style="width:{w}cm">' for w in larguras]
    h.append("</colgroup>")
    for i, lin in enumerate(linhas):
        tag = "th" if i == 0 else "td"
        cel = "".join(f'<{tag} class="{"num" if alinhar_num and j > 0 else ""}">{md2html(str(v))}</{tag}>'
                      for j, v in enumerate(lin))
        h.append(("<thead>" if i == 0 else "") + f"<tr>{cel}</tr>" + ("</thead>" if i == 0 else ""))
    h.append("</table>")
    HT.append("".join(h))
    t = doc.add_table(rows=len(linhas), cols=len(linhas[0]))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, lin in enumerate(linhas):
        for j, val in enumerate(lin):
            c = t.cell(i, j)
            c.width = Cm(larguras[j])
            c.text = ""
            par = c.paragraphs[0]
            par.paragraph_format.line_spacing = 1.0
            par.paragraph_format.space_after = Pt(1)
            par.paragraph_format.space_before = Pt(1)
            if alinhar_num and j > 0:
                par.alignment = WD_ALIGN_PARAGRAPH.CENTER
            runs(par, str(val), tam=tam)
            if i == 0:
                for r in par.runs:
                    r.bold = True
                    r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                sombrear(c, "0F4C5C")
            elif i % 2 == 0:
                sombrear(c, "EEF4F5")
    # repete o cabeçalho se a tabela quebrar de página
    trPr = t.rows[0]._tr.get_or_add_trPr()
    th = OxmlElement("w:tblHeader")
    th.set(qn("w:val"), "true")
    trPr.append(th)
    fonte(fonte_txt)
    HT.append("</div>")
    return n


def campo(par, instr):
    r = par.add_run()
    f1 = OxmlElement("w:fldChar")
    f1.set(qn("w:fldCharType"), "begin")
    it = OxmlElement("w:instrText")
    it.set(qn("xml:space"), "preserve")
    it.text = instr
    f2 = OxmlElement("w:fldChar")
    f2.set(qn("w:fldCharType"), "separate")
    t = OxmlElement("w:t")
    t.text = "Atualize o sumário (F9)."
    f3 = OxmlElement("w:fldChar")
    f3.set(qn("w:fldCharType"), "end")
    for el in (f1, it, f2, t, f3):
        r._r.append(el)
    HT.append("%%SUMARIO%%")


def centro(texto, negrito=False, tam=12, antes=0, depois=0, maiusc=True):
    par = doc.add_paragraph()
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER
    par.paragraph_format.space_before = Pt(antes)
    par.paragraph_format.space_after = Pt(depois)
    r = par.add_run(texto.upper() if maiusc else texto)
    r.bold = negrito
    r.font.size = Pt(tam)
    HT.append(f'<p class="c" style="font-size:{tam}pt;margin-top:{antes}pt;margin-bottom:{depois}pt;'
              f'font-weight:{"bold" if negrito else "normal"}">'
              f"{_html.escape(texto.upper() if maiusc else texto)}</p>")
    return par


# ============================================================ CAPA
centro("Centro Universitário Católica de Santa Catarina", True)
centro("Curso de Engenharia de Software", True)
centro("Qualidade de Software – Prof. Martim Dietterle", False, depois=0)
centro("Turma: Engenharia de Software – 5º semestre (2026/2)", False, depois=60, maiusc=False)
centro("Ferramentas da qualidade aplicadas à engenharia de software", True, 14, antes=40)
centro("da teoria aos dados reais: LocalSend, CrowdStrike e Knight Capital", False, 12, depois=60,
       maiusc=False)
for nome in INTEGRANTES:
    centro(nome, False, 12, maiusc=False)
centro("Trabalho em equipe (30% da N3) – apresentação em seminário", False, 11, antes=60, maiusc=False)
centro("Jaraguá do Sul – SC", False, 12, antes=80, maiusc=False)
centro("18 de novembro de 2026", False, 12, maiusc=False)

# ============================================================ RESUMO
H1("Resumo")
P("Este trabalho aplica as ferramentas clássicas da qualidade (fluxograma, histograma, diagrama de "
  "dispersão, folha de verificação, gráfico de Pareto e diagrama de causa e efeito) a problemas reais da "
  "engenharia de software e discute como a qualidade é garantida em metodologias ágeis (Scrum, Kanban e XP). "
  f"Para que a análise não ficasse só na teoria, a equipe coletou, em 15/11/2026, os dados públicos do "
  f"repositório do LocalSend no GitHub ({S['n_prs']} pull requests mesclados e {S['n_bugs']} issues "
  "rotuladas como bug, de 2023 a 2026) e construiu as ferramentas sobre esses números. Dois estudos de caso "
  "da indústria completam a análise: a falha global causada pela atualização Channel File 291 da CrowdStrike "
  "(2024) e a perda de mais de US$ 460 milhões da Knight Capital em 45 minutos (2012). Os resultados mostram "
  f"um lead time mediano de {br(L['mediana_h'])} horas para os PRs, com distribuição fortemente assimétrica "
  f"(média de {br(L['media_h'])} h); correlação praticamente nula entre o tamanho do PR e o tempo até o merge "
  f"(ρ de Spearman = {br(D['spearman'], 2)}); concentração de {br(PA['acumulado'][3])}% dos bugs "
  "classificados em quatro plataformas; e um backlog de bugs que cresce todos os anos porque entram mais "
  "defeitos do que saem. Nos casos da indústria, as causas-raiz se concentram em processo de implantação e "
  "em testes, e não em uma falha individual. O trabalho termina com um plano de melhoria contínua no ciclo "
  "PDCA, com ação, indicador e meta para cada problema encontrado.")
par = P("**Palavras-chave:** qualidade de software; ferramentas da qualidade; metodologias ágeis; "
        "métricas de processo; análise de causa-raiz.", recuo=False)

# ============================================================ SUMÁRIO
quebra()
centro("Sumário", True, depois=12)
campo(doc.add_paragraph(), 'TOC \\o "1-2" \\h \\z \\u')

# ============================================================ 1 INTRODUÇÃO
H1("1 Introdução")
P("Qualidade de software não é uma etapa que acontece no fim do projeto: é o resultado de decisões tomadas "
  "ao longo de todo o processo. Bartié (2002) define garantia da qualidade como um conjunto de atividades "
  "planejadas e sistemáticas que dão confiança de que o processo produz o que se espera dele, e Pfleeger "
  "(2003) lembra que a qualidade do produto depende diretamente da qualidade do processo que o produz. "
  "Guerra e Colombo (2010) mostram que a qualidade do produto pode ser descrita por características "
  "mensuráveis, como confiabilidade, usabilidade e eficiência. Para "
  "melhorar um processo, porém, é preciso enxergá-lo, medi-lo e entender por que ele falha. É para isso que "
  "servem as ferramentas da qualidade, sistematizadas por Kaoru Ishikawa na indústria japonesa e hoje "
  "presentes, com outros nomes, no dia a dia dos times de software: o quadro Kanban é um fluxograma vivo, o "
  "gráfico de tempo de ciclo é um histograma, a triagem de bugs é um Pareto e o post-mortem de um incidente "
  "é uma análise de causa e efeito.")
P("O objetivo deste trabalho é utilizar essas ferramentas para analisar processos e produtos de software "
  "reais, interpretar os resultados e propor ações de melhoria contínua. Para cada ferramenta, o texto traz "
  "a base teórica, a construção sobre dados reais, a interpretação, um exemplo de uso na indústria, uma "
  "análise crítica (o que funcionou, o que falhou e o que poderia melhorar) e a justificativa da escolha.")
H2("1.1 Método e fontes de dados")
P("A base empírica principal é o **LocalSend**, aplicativo de código aberto para transferência de arquivos "
  "pela rede local, escrito em Flutter e distribuído para Android, iOS, Windows, macOS e Linux. O projeto foi "
  "escolhido por três motivos: tem histórico público e completo de defeitos e de mudanças, é um produto "
  "real usado por milhões de pessoas (o repositório passa de 99 mil estrelas no GitHub) e já foi avaliado "
  "pela equipe no Trabalho N2, sob a ótica da qualidade do produto. Agora o foco é o processo.")
P(f"Os dados foram extraídos em 15/11/2026 pela API GraphQL do GitHub (LOCALSEND, 2026): {S['n_prs']} pull requests (PRs) "
  "mesclados entre janeiro de 2023 e novembro de 2026, com datas de abertura e de merge e o número de linhas "
  f"alteradas, e {S['n_bugs']} issues com o rótulo *bug*, com estado, motivo de fechamento e rótulos de "
  "plataforma. Os scripts de coleta e de análise acompanham a entrega (pasta _apoio), o que permite "
  "reproduzir todos os números citados. Os estudos de caso da indústria usam os relatórios oficiais das "
  "empresas e dos órgãos reguladores, citados nas referências.")

# ============================================================ 2 ÁGIL
H1("2 Qualidade em metodologias ágeis")
P("Nos métodos tradicionais, a qualidade costumava ser verificada por uma equipe separada, depois que o "
  "código estava pronto. Os métodos ágeis invertem essa lógica: a qualidade é **construída dentro** do "
  "processo, em ciclos curtos, por quem desenvolve. Teles (2004) resume a ideia ao descrever o XP como um "
  "processo em que o feedback rápido (de testes, do cliente e dos colegas) permite corrigir o rumo antes que "
  "o erro fique caro. A seguir estão os três métodos pedidos e as práticas que sustentam a qualidade em cada "
  "um.")
H2("2.1 Scrum, Kanban e XP")
BUL([
    "**Scrum** organiza o trabalho em sprints de até um mês. A qualidade aparece na *Definition of Done* "
    "(DoD), o compromisso formal que diz quando um incremento está realmente pronto, e nos eventos de "
    "inspeção e adaptação: a revisão da sprint inspeciona o produto e a retrospectiva inspeciona o processo "
    "(SCHWABER; SUTHERLAND, 2020). Se um item não atende à DoD, ele não é apresentado como concluído.",
    "**Kanban** visualiza o fluxo de trabalho, limita o trabalho em progresso (WIP) e mede o tempo de ciclo. "
    "Limitar o WIP reduz a troca de contexto e expõe gargalos; as políticas explícitas de cada coluna (por "
    "exemplo, \"só sai de Revisão com aprovação de outra pessoa\") funcionam como critérios de qualidade "
    "(ANDERSON, 2010). As métricas de fluxo são analisadas com histogramas e diagramas de dispersão do tempo "
    "de ciclo (VACANTI, 2015).",
    "**XP (Extreme Programming)** é o método mais explícito sobre práticas técnicas: desenvolvimento "
    "guiado por testes (TDD), integração contínua, programação em par, refatoração, design simples, "
    "propriedade coletiva do código e releases pequenas (BECK; ANDRES, 2004; TELES, 2004).",
])
H2("2.2 Práticas que garantem a qualidade")
TAB("quadro", "Práticas ágeis de qualidade, o que garantem e evidência real", [
    ["Prática", "O que garante", "Evidência real (empresa/projeto)"],
    ["Testes automatizados e TDD", "Regressões detectadas em minutos; o teste vira especificação executável",
     "Microsoft e IBM: densidade de defeitos pré-release 40% a 90% menor nos times com TDD, ao custo de 15% a "
     "35% mais tempo inicial de desenvolvimento (NAGAPPAN et al., 2008)"],
    ["Integração contínua (CI)", "Todo commit é compilado e testado; quebras aparecem cedo e com dono claro",
     "LocalSend: cada PR passa pelo GitHub Actions antes do merge (rótulo github_actions no repositório)"],
    ["Revisão de código", "Segundo olhar sobre defeitos, legibilidade e conhecimento compartilhado",
     "Google: mudanças com mediana de cerca de 24 linhas e tempo mediano de revisão inferior a 4 horas "
     "(SADOWSKI et al., 2018)"],
    ["Definition of Done", "Critério único e verificável de \"pronto\"; evita dívida técnica escondida",
     "Exigida pelo Scrum Guide; a seção 7 propõe uma DoD em forma de checklist para o LocalSend"],
    ["Métricas de entrega (DORA)", "Medem velocidade e estabilidade juntas, sem trocar uma pela outra",
     "Relatório DORA 2024: o grupo de elite implanta sob demanda, com lead time inferior a um dia, taxa de "
     "falha de mudanças em torno de 5% e recuperação em menos de uma hora (DORA, 2024)"],
], [3.2, 5.0, 7.8], "elaborado pela equipe com base nas fontes citadas.")
H2("2.3 Exemplos da vida real e análise crítica")
P("**Microsoft e IBM (TDD).** O estudo de Nagappan et al. (2008) comparou, em quatro produtos reais (três da "
  "Microsoft e um da IBM), times que usavam TDD com times equivalentes que não usavam, sob o mesmo gerente e "
  "com a mesma tecnologia. A redução de 40% a 90% na densidade de defeitos antes da entrega mostra que testar "
  "primeiro melhora a qualidade de forma mensurável, o que reforça a visão de Félix (2016) de que o "
  "teste deve acompanhar todo o ciclo de desenvolvimento, e não ficar só no final. **O que falhou:** o custo inicial maior (15% a 35%) e a "
  "falta de controle rigoroso sobre o quanto cada time de fato seguiu o TDD, já que são estudos de caso e não "
  "experimentos controlados. **O que poderia melhorar:** medir também a cobertura e a qualidade dos testes, e "
  "não só a adoção da prática.")
P("**Google (revisão de código).** No estudo de Sadowski et al. (2018), a revisão é obrigatória para toda "
  "mudança, mas é leve: mudanças pequenas, geralmente um único revisor e resposta em poucas horas. A escolha se "
  "justifica porque a revisão, ali, serve tanto para achar defeitos quanto para difundir conhecimento e manter "
  "o padrão do código. O risco é a revisão virar carimbo se o revisor estiver sobrecarregado, por isso o "
  "tamanho pequeno das mudanças é tratado como regra e não como sugestão.")
P(f"**LocalSend (CI + revisão por PR).** No projeto analisado, {br(L['ate_24h_pct'])}% dos PRs foram "
  f"mesclados em até 24 horas e o lead time mediano foi de {br(L['mediana_h'])} horas, com mudanças de "
  f"mediana de {int(D['mediana_linhas'])} linhas, curiosamente o mesmo valor reportado pelo Google. Isso "
  "indica um fluxo de integração enxuto. **O que falhou:** como mostram as seções 7 e 10, o fluxo de *bugs* "
  "não acompanha o fluxo de PRs: o número de defeitos abertos cresce a cada ano. **Justificativa da análise:** "
  "o LocalSend usa um processo ágil leve, típico de código aberto (PR + CI + revisão do mantenedor), sem "
  "sprints formais; por isso o Kanban e suas métricas de fluxo são a lente mais adequada para ele.")

# ============================================================ 3 FERRAMENTAS
H1("3 Ferramentas da qualidade")
P("As chamadas **sete ferramentas básicas da qualidade** foram reunidas por Kaoru Ishikawa nos anos 1960, "
  "no Japão, com a ideia de que qualquer pessoa da organização, e não só especialistas, pudesse resolver a "
  "maior parte dos problemas de qualidade com técnicas simples (ISHIKAWA, 1986). A lista clássica traz folha de "
  "verificação, histograma, diagrama de Pareto, diagrama de causa e efeito, diagrama de dispersão, "
  "estratificação e gráfico de controle; em muitas versões o fluxograma substitui a estratificação. "
  "Gallotti (2015) e Bartié (2002) mostram que essas ferramentas se aplicam diretamente ao software, onde "
  "os \"produtos com defeito\" são bugs, falhas de build, incidentes e retrabalho.")
H2("3.1 Classificação por finalidade")
P("Uma forma útil de classificar as ferramentas é pela pergunta que cada uma responde dentro de um ciclo de "
  "melhoria (PDCA). O Quadro 2 organiza as ferramentas pedidas neste trabalho e as complementares.")
TAB("quadro", "Classificação das ferramentas da qualidade", [
    ["Ferramenta", "Categoria", "Pergunta que responde", "Uso típico em software"],
    ["Fluxograma", "Entendimento do processo", "Como o trabalho realmente acontece?",
     "Fluxo de PR, triagem de bugs, pipeline de deploy"],
    ["Folha de verificação", "Coleta de dados", "Quantas vezes e onde o problema ocorre?",
     "Checklist de revisão, contagem de defeitos por tipo"],
    ["Histograma", "Análise da variação", "Como os valores se distribuem?",
     "Tempo de ciclo, lead time, tempo de resposta"],
    ["Diagrama de dispersão", "Análise de relação", "Duas variáveis andam juntas?",
     "Tamanho do PR × tempo, churn × defeitos"],
    ["Gráfico de Pareto", "Priorização", "Quais poucas causas geram a maioria dos efeitos?",
     "Bugs por módulo, crashes por assinatura"],
    ["Causa e efeito (Ishikawa)", "Análise de causa-raiz", "Por que o problema acontece?",
     "Post-mortem de incidentes, defeitos recorrentes"],
    ["Gráfico de controle", "Monitoramento", "O processo está estável ou mudou?",
     "Taxa de falha de build, latência ao longo do tempo"],
    ["Estratificação", "Análise da variação", "O resultado muda por grupo?",
     "Defeitos por plataforma, por time, por versão"],
    ["Complementares: 5 porquês, 5W2H, matriz GUT, PDCA", "Causa, planejamento e priorização",
     "Qual a causa última? Quem faz o quê, até quando?", "Post-mortem, plano de ação, backlog de melhoria"],
], [3.4, 3.0, 4.6, 5.0], "elaborado pela equipe com base em Ishikawa (1986), Gallotti (2015) e Bartié (2002).")
H2("3.2 Exemplo real, análise crítica e justificativa")
P("**Exemplo real.** Ishikawa (1985) afirmava que até 95% dos problemas de qualidade de uma empresa podem ser "
  "resolvidos com as ferramentas básicas, sem estatística avançada; foi com elas que a indústria japonesa "
  "montou os círculos de controle da qualidade, nos quais os próprios trabalhadores analisavam os problemas. "
  "No software, a Microsoft aplicou o Pareto aos relatórios automáticos de erro do Windows e do Office para "
  "decidir o que corrigir primeiro (BALLMER, 2002), e a CrowdStrike publicou uma análise de causa-raiz "
  "estruturada depois do incidente de 2024 (CROWDSTRIKE, 2024). Neste trabalho, seis das sete ferramentas "
  f"foram aplicadas aos mesmos dados reais do LocalSend ({S['n_prs']} PRs e {S['n_bugs']} bugs) e a dois "
  "incidentes documentados da indústria.")
P("**Análise crítica.** O que funciona é a simplicidade: qualquer pessoa do time entende um Pareto ou um "
  "histograma, sem precisar de um especialista. O que falha é a dependência da qualidade dos dados: no "
  "LocalSend, cerca de 60% das issues de bug não têm plataforma registrada, o que limita o Pareto e a folha "
  "de verificação. Além disso, as ferramentas descrevem e sugerem, mas não provam causa: uma tendência no "
  "diagrama de dispersão ou uma espinha do Ishikawa são hipóteses a confirmar. O que poderia melhorar é "
  "completar a análise com o gráfico de controle, que separa a variação natural de uma mudança real no "
  "processo, e com testes estatísticos quando a decisão tiver custo alto.")
P("**Justificativa.** A classificação por finalidade foi escolhida, em vez da lista histórica, porque mostra "
  "em que momento do ciclo PDCA cada ferramenta entra, e é essa a ordem que o trabalho segue: o fluxograma "
  "mostra onde medir; a folha de verificação organiza a coleta; histograma e dispersão analisam a variação e "
  "as relações; o Pareto escolhe o que atacar primeiro; e o diagrama de causa e efeito busca a causa-raiz do "
  "problema escolhido.")

# ============================================================ 4 FLUXOGRAMA
H1("4 Fluxograma")
H2("4.1 Conceito")
P("O fluxograma representa graficamente a sequência de atividades de um processo, com símbolos padronizados: "
  "elipse ou retângulo arredondado para início e fim, retângulo para atividade, losango para decisão e setas "
  "para o fluxo. Em qualidade, ele serve para tornar visível o processo **real** (e não o que está no "
  "manual), identificar decisões, laços de retrabalho, filas e pontos de controle, e decidir onde medir.")
H2("4.2 Construção: ciclo de vida de um bug no LocalSend")
P("O fluxograma da Figura 1 foi construído a partir dos rótulos e dos estados públicos do repositório "
  "(needs-more-info, duplicate, wontfix, bug, rótulos de plataforma e os motivos de fechamento registrados "
  "pelo GitHub) e do fluxo de contribuição por pull request. Cada saída traz a quantidade real de issues "
  "que terminou ali.")
FIG("fluxograma.png", "Fluxograma do ciclo de vida de um bug no LocalSend",
    f"elaborado pela equipe com dados do repositório localsend/localsend (GitHub), coletados em 15/11/2026.")
H2("4.3 Interpretação")
BUL([
    f"**Saídas do processo:** das {S['n_bugs']} issues de bug, {EB['corrigidos']} foram fechadas como "
    f"corrigidas, {EB['nao_planejados']} como não planejadas, {EB['duplicados']} como duplicadas e "
    f"{EB['abertos']} continuavam abertas, ou seja, {br(100 * EB['abertos'] / S['n_bugs'])}% do total "
    "ainda está dentro do fluxo.",
    "**Laços de retrabalho:** há dois laços na correção (CI reprovada e revisão pedindo mudanças) e um na "
    "triagem (falta de informação). São os pontos em que o tempo se perde e onde vale a pena medir.",
    "**Ponto de controle mais forte:** a CI e a revisão funcionam como portões de qualidade antes do merge. "
    "Já a triagem depende de ação manual dos mantenedores, e é nela que o fluxo acumula fila.",
    f"**Tempo de ponta a ponta:** a mediana entre abrir e fechar como corrigido é de "
    f"{br(S['bug_fechamento_mediana_dias'])} dias, muito maior que o lead time mediano do PR "
    f"({br(L['mediana_h'])} h). O gargalo, portanto, está antes do PR (triagem e espera por alguém que "
    "assuma a correção), e não na integração.",
])
H2("4.4 Exemplo na indústria, análise crítica e justificativa")
P("O ciclo de vida de bugs do **Bugzilla**, usado pela Mozilla, é um dos fluxogramas de processo de software "
  "mais conhecidos: estados como UNCONFIRMED, NEW, ASSIGNED, RESOLVED e VERIFIED, com transições "
  "explícitas, deixam claro quem precisa agir em cada momento. O mesmo raciocínio está por trás dos quadros "
  "Kanban de times que mapeiam o fluxo de valor antes de definir limites de WIP. **O que funcionou** no "
  "LocalSend é a parte automatizada do fluxo (CI e PR). **O que falha** é que o processo não está "
  "documentado como fluxograma: os estados são implícitos nos rótulos, e cerca de 60% das issues de bug não "
  "recebem rótulo de plataforma (seção 7). **Melhoria:** publicar o fluxo no CONTRIBUTING do projeto e "
  "transformar cada decisão em um rótulo obrigatório. **Justificativa:** o fluxograma foi a primeira "
  "ferramenta escolhida porque, sem ele, não seria possível saber onde coletar os dados usados nas demais.")

# ============================================================ 5 HISTOGRAMA
H1("5 Histograma")
H2("5.1 Conceito")
P("O histograma mostra a distribuição de frequência de uma variável contínua: o eixo horizontal é dividido em "
  "classes de mesma largura e a altura de cada barra indica quantas observações caem na classe. Ele revela o "
  "que a média esconde: centro, dispersão, assimetria, valores extremos e a existência de mais de um "
  "comportamento no mesmo processo. Em times ágeis, é a ferramenta padrão para analisar tempo de ciclo e "
  "lead time (VACANTI, 2015).")
H2("5.2 Construção: lead time dos PRs do LocalSend")
P(f"A variável é o lead time de cada PR mesclado, isto é, as horas entre a abertura e o merge, para os "
  f"{S['n_prs']} PRs do período. Foram usadas classes de 6 horas de 0 a 72 horas; os PRs que levaram 72 "
  "horas ou mais aparecem agrupados em uma última barra, destacada em laranja, para não achatar o gráfico.")
FIG("histograma.png", "Histograma do lead time dos pull requests mesclados do LocalSend",
    "elaborado pela equipe com dados do GitHub (localsend/localsend), coletados em 15/11/2026.")
TAB("tab", "Estatísticas descritivas do lead time dos PRs (horas)", [
    ["Medida", "Valor", "Leitura"],
    ["Mediana", f"{br(L['mediana_h'])} h", "metade dos PRs entra em menos de 7 horas"],
    ["Média", f"{br(L['media_h'])} h", "puxada para cima pela cauda longa: não representa o PR típico"],
    ["1º e 3º quartis", f"{br(L['p25_h'])} h e {br(L['p75_h'])} h", "50% centrais dos PRs"],
    ["Percentil 85", f"{br(L['p85_h'])} h", "base para uma expectativa de nível de serviço (SLE)"],
    ["Mesclados em até 24 h", f"{br(L['ate_24h_pct'])}%", "fluxo de integração rápido"],
    ["Acima de 72 h / de 30 dias", f"{br(L['acima_72h_pct'])}% / {br(L['acima_30d_pct'])}%",
     "PRs que ficaram parados"],
], [4.2, 3.6, 8.2], "elaborado pela equipe.", alinhar_num=False)
H2("5.3 Interpretação")
P(f"A distribuição é fortemente **assimétrica à direita**: a maior barra é a primeira (até 6 horas, "
  f"{S['hist_classes']['0-6h']} PRs) e a frequência cai rapidamente, mas há uma cauda longa de "
  f"{S['hist_classes']['>=72h']} PRs acima de 72 horas. Por isso a média ({br(L['media_h'])} h) é quase 16 "
  f"vezes maior que a mediana ({br(L['mediana_h'])} h) e não deve ser usada como meta. O dado útil para "
  f"planejamento é o percentil: 85% dos PRs são mesclados em até {br(L['p85_h'])} horas (cerca de três "
  "dias), uma previsão honesta que um time Kanban poderia publicar como nível de serviço esperado. A barra "
  "laranja indica um segundo comportamento: PRs que esperam dias ou semanas, geralmente por falta de revisão "
  "ou por estarem bloqueados, e que merecem uma política própria (por exemplo, revisão ou fechamento após 14 "
  "dias sem atividade).")
H2("5.4 Exemplo na indústria, análise crítica e justificativa")
P("Times que adotam o Kanban usam o histograma de tempo de ciclo exatamente dessa forma: em vez de "
  "estimar cada tarefa, publicam previsões do tipo \"85% dos itens ficam prontos em até N dias\", tiradas do "
  "percentil do histograma (VACANTI, 2015). O relatório DORA (2024) também trata o lead time de mudanças como "
  "uma das quatro métricas centrais de desempenho de entrega. **O que funcionou:** o histograma mostrou que "
  "o processo de merge do LocalSend é rápido para a maioria dos casos. **Limitações:** só entram PRs "
  "mesclados, então PRs abandonados (que talvez tenham esperado ainda mais) ficam de fora, um viés de "
  "sobrevivência; e o lead time do PR mede só a fase de integração, não o tempo total do bug. **Justificativa:** "
  "o histograma foi escolhido porque a pergunta era sobre variação (\"quanto tempo um PR costuma levar e "
  "quanto isso varia?\"), algo que uma média isolada esconderia.")

# ============================================================ 6 DISPERSÃO
H1("6 Diagrama de dispersão")
H2("6.1 Conceito")
P("O diagrama de dispersão coloca cada observação como um ponto em dois eixos para verificar se duas "
  "variáveis variam juntas. A relação pode ser positiva, negativa ou inexistente, e sua força é medida por "
  "um coeficiente de correlação: o de Pearson mede relação linear e é sensível a valores extremos; o de "
  "Spearman usa a ordem (postos) dos valores e mede relação monotônica, sendo mais robusto para dados "
  "assimétricos. Dois cuidados são indispensáveis: correlação não prova causa, e uma correlação forte pode "
  "vir de uma terceira variável.")
H2("6.2 Construção: tamanho do PR × lead time no LocalSend")
P("A hipótese testada é comum no mercado: **PRs maiores demoram mais para serem mesclados**. Para cada um "
  "dos PRs, o eixo horizontal mostra o tamanho (linhas adicionadas + removidas) e o vertical, o lead time. "
  "Os dois eixos estão em escala logarítmica, porque as duas variáveis vão de 1 a dezenas de milhares.")
FIG("dispersao.png", "Diagrama de dispersão entre tamanho do PR e lead time no LocalSend",
    "elaborado pela equipe com dados do GitHub (localsend/localsend), coletados em 15/11/2026.")
pf_ = D["por_faixa"]
TAB("tab", "Lead time mediano por faixa de tamanho do PR", [
    ["Tamanho do PR", "Quantidade de PRs", "Lead time mediano"],
    ["Até 9 linhas", pf_["0-10"]["n"], f"{br(pf_['0-10']['mediana_h'])} h"],
    ["10 a 99 linhas", pf_["10-100"]["n"], f"{br(pf_['10-100']['mediana_h'])} h"],
    ["100 a 999 linhas", pf_["100-1000"]["n"], f"{br(pf_['100-1000']['mediana_h'])} h"],
    ["1.000 linhas ou mais", pf_["1000-inf"]["n"], f"{br(pf_['1000-inf']['mediana_h'])} h"],
], [5.5, 4.0, 4.0], "elaborado pela equipe.", alinhar_num=True)
H2("6.3 Interpretação")
P(f"A nuvem de pontos não tem direção definida e a reta de tendência é quase horizontal (inclinação de "
  f"{br(D['inclinacao_loglog'], 2)} no espaço log-log). O coeficiente de Spearman é {br(D['spearman'], 2)}, "
  f"ou seja, **praticamente não há correlação** entre o tamanho do PR e o tempo até o merge. O Pearson "
  f"calculado sobre os valores brutos ({br(D['pearson_bruto'], 2)}) parece indicar uma relação fraca, mas "
  "ele é inflado por poucos PRs gigantes e demorados, um exemplo prático de por que o Pearson engana em "
  "dados assimétricos. A Tabela 2 confirma a leitura: só os PRs muito grandes (1.000 linhas ou mais, "
  f"apenas {pf_['1000-inf']['n']} casos) têm lead time mediano claramente maior. Conclusão: no LocalSend, o "
  "tempo de espera é dominado por outros fatores, como a disponibilidade de quem revisa, o tipo de mudança "
  "(tradução, dependência, correção) e o momento em que o PR foi aberto, e não pelo tamanho.")
H2("6.4 Exemplo na indústria, análise crítica e justificativa")
P("Na Microsoft, Nagappan e Ball (2005) usaram a relação entre **churn** (volume de código alterado) e "
  "densidade de defeitos no Windows Server 2003 e conseguiram separar binários propensos a falhas dos demais "
  "com 89% de acerto, um caso clássico em que a dispersão revelou uma relação forte e acionável. No Google, a "
  "política de mudanças pequenas parte da relação entre tamanho e facilidade de revisão (SADOWSKI et al., "
  "2018). **O que funcionou** aqui foi refutar com dados uma crença comum: \"dividir PRs\" não reduziria o "
  "tempo de merge do LocalSend. **O que poderia melhorar:** cruzar o lead time com outras variáveis "
  "candidatas (número de revisores, comentários, horário de abertura, autor recorrente ou novo), que o "
  "diagrama não testou. **Justificativa:** a dispersão é a ferramenta certa para testar a relação entre duas "
  "variáveis numéricas antes de investir em uma ação baseada em suposição.")

# ============================================================ 7 FOLHA DE VERIFICAÇÃO
H1("7 Folha de verificação")
H2("7.1 Conceito")
P("A folha de verificação é um formulário estruturado para registrar dados de forma padronizada no momento "
  "em que eles acontecem. Ela tem três formatos principais: a **folha de contagem**, que registra quantas "
  "vezes cada tipo de ocorrência aparece; a **folha de localização**, que marca onde o defeito ocorre; e a "
  "**lista de verificação (checklist)**, que confere se cada item obrigatório de uma inspeção foi atendido. "
  "É a base das demais ferramentas: um Pareto ou um histograma só são tão bons quanto os dados coletados.")
H2("7.2 Construção 1: folha de contagem de bugs por plataforma e ano (LocalSend)")
anos = ["2023", "2024", "2025", "2026"]
lin = [["Plataforma / componente"] + anos + ["Total"]]
for nome, por_ano in S["folha"].items():
    lin.append([nome] + [por_ano[a] for a in anos] + [sum(por_ano.values())])
lin.append(["**Total**"] + [f"**{sum(v[a] for v in S['folha'].values())}**" for a in anos]
           + [f"**{PA['total_rotulos']}**"])
TAB("tab", "Folha de verificação (contagem): issues de bug por plataforma e ano de abertura", lin,
    [4.6, 2.2, 2.2, 2.2, 2.2, 2.2], "elaborado pela equipe com dados do GitHub (localsend/localsend), "
    "15/11/2026. Uma issue pode ter mais de um rótulo; 2026 vai até 15/11.", alinhar_num=True)
P(f"A folha mostra tendências que o total esconde: os bugs de **Linux** crescem (de 13 em 2024 para 19 em "
  "2026) e os de **macOS** também (de 6 em 2023 para 11 em 2026), enquanto os de **Windows** e **iOS** caem. "
  f"Ela também revela um problema na própria coleta: apenas {PA['bugs_com_componente']} das {S['n_bugs']} "
  f"issues de bug ({br(100 * PA['bugs_com_componente'] / S['n_bugs'])}%) têm rótulo de plataforma. Em uma "
  "folha de verificação de papel, isso equivaleria a 60% das linhas sem a coluna principal preenchida.")
H2("7.3 Construção 2: checklist de revisão de PR (Definition of Done)")
TAB("quadro", "Lista de verificação proposta para revisão de PR e DoD no LocalSend", [
    ["Nº", "Item a verificar", "Sim", "Não", "N/A"],
    ["1", "A issue de origem está vinculada ao PR e tem rótulo de plataforma", "☐", "☐", "☐"],
    ["2", "A CI (build, análise estática e testes) passou em todas as plataformas afetadas", "☐", "☐", "☐"],
    ["3", "Há teste automatizado que falha sem a correção e passa com ela", "☐", "☐", "☐"],
    ["4", "A mudança foi testada manualmente na(s) plataforma(s) do bug", "☐", "☐", "☐"],
    ["5", "O PR tem escopo único (não mistura correção, refatoração e tradução)", "☐", "☐", "☐"],
    ["6", "Não há segredos, chaves ou dados pessoais no código ou nos logs", "☐", "☐", "☐"],
    ["7", "Textos novos estão no arquivo de tradução, e não fixos no código", "☐", "☐", "☐"],
    ["8", "O changelog foi atualizado quando a mudança afeta o usuário", "☐", "☐", "☐"],
    ["9", "Pelo menos um mantenedor revisou e aprovou", "☐", "☐", "☐"],
], [1.0, 11.0, 1.3, 1.3, 1.3], "elaborado pela equipe com base nas práticas de revisão do Google (GOOGLE, "
    "2024) e na Definition of Done do Scrum (SCHWABER; SUTHERLAND, 2020).")
H2("7.4 Exemplo na indústria, análise crítica e justificativa")
P("As **inspeções formais de Fagan**, criadas na IBM nos anos 1970, usam listas de verificação por tipo de "
  "artefato e folhas de registro de defeitos por categoria, e se tornaram referência por encontrar defeitos "
  "antes dos testes (FAGAN, 1976). O guia público de revisão de código do Google funciona como um checklist "
  "do que o revisor deve olhar: design, funcionalidade, complexidade, testes, nomes e documentação (GOOGLE, "
  "2024). Na aviação, o checklist virou regra exatamente porque a memória falha sob pressão, e o caso Knight "
  "Capital (seção 10.3) mostra o custo de não ter um checklist de implantação. **O que funcionou:** a folha "
  "de contagem expôs tendências por plataforma e a falta de rótulos. **O que falhou:** o LocalSend registra "
  "os dados, mas sem campo obrigatório, então a folha fica incompleta. **Melhoria:** tornar a plataforma um "
  "campo obrigatório no formulário de issue do GitHub (issue forms), o que transforma o formulário na própria "
  "folha de verificação. **Justificativa:** a folha foi escolhida por ser a ferramenta de coleta; sem ela, o "
  "Pareto da próxima seção não existiria.")

# ============================================================ 8 PARETO
H1("8 Gráfico de Pareto")
H2("8.1 Conceito")
P("O gráfico de Pareto ordena as categorias de um problema da mais frequente para a menos frequente, em "
  "barras, e traz uma linha com o percentual acumulado. Ele se apoia no princípio de Pareto, popularizado por "
  "Joseph Juran como a separação entre os \"poucos vitais\" e os \"muitos triviais\": em geral, poucas causas "
  "respondem pela maior parte dos efeitos, na proporção aproximada de 80/20 (JURAN; GODFREY, 1999). O "
  "objetivo é priorizar: atacar primeiro as categorias à esquerda do ponto em que a curva cruza 80%.")
H2("8.2 Construção: bugs do LocalSend por plataforma")
FIG("pareto.png", "Gráfico de Pareto das issues de bug do LocalSend por plataforma/componente",
    "elaborado pela equipe com dados do GitHub (localsend/localsend), coletados em 15/11/2026.")
H2("8.3 Interpretação")
P(f"Android ({PA['itens'][0][1]}) e Linux ({PA['itens'][1][1]}) somam {br(PA['acumulado'][1])}% dos rótulos; "
  f"com Windows chega-se a {br(PA['acumulado'][2])}% e, com macOS, a {br(PA['acumulado'][3])}%. Ou seja, "
  f"**4 das 10 categorias (40%) concentram cerca de 80% dos bugs classificados**, e as cinco plataformas de "
  f"sistema operacional juntas chegam a {br(PA['acumulado'][4])}%. A distribuição não é um 80/20 "
  "perfeito, e isso é esperado em um aplicativo multiplataforma: cada sistema tem particularidades de rede, "
  "permissões e empacotamento. A decisão prática é concentrar o esforço de triagem e de testes automatizados "
  "em **Android e Linux**, que respondem por quase metade dos casos, e investigar por que Linux cresce (a "
  "folha de verificação mostrou alta em 2026), possivelmente pela variedade de distribuições e formatos de "
  "pacote.")
H2("8.4 Exemplo na indústria, análise crítica e justificativa")
P("O exemplo mais citado é o da **Microsoft**. Em 2002, analisando os relatórios automáticos de erro "
  "enviados pelo Windows e pelo Office (Windows Error Reporting), a empresa constatou que cerca de 20% dos "
  "bugs causavam 80% de todos os erros, e que 1% dos bugs causava metade deles (BALLMER, 2002). Com isso, a "
  "correção passou a ser priorizada pela frequência real de falhas nos clientes, e não pela ordem de chegada. "
  "**O que funcionou** no LocalSend foi identificar onde concentrar o esforço. **Limitações:** o Pareto "
  "conta rótulos, não impacto: um bug de rede que impede qualquer transferência pesa o mesmo que um "
  "detalhe visual. **Melhoria:** fazer um Pareto ponderado (por número de usuários afetados, reações na issue "
  "ou severidade) e repetir a análise por trimestre para ver se as ações mudaram a distribuição. "
  "**Justificativa:** o Pareto é a ferramenta indicada quando há mais problemas do que capacidade para "
  "resolvê-los, exatamente a situação de um backlog com centenas de bugs abertos.")

# ============================================================ 9 ISHIKAWA
H1("9 Diagrama de causa e efeito")
H2("9.1 Conceito")
P("O diagrama de causa e efeito, também chamado de espinha de peixe ou diagrama de Ishikawa, organiza as "
  "possíveis causas de um problema (o efeito, na \"cabeça\" do peixe) em categorias. A versão industrial "
  "usa os 6M: método, máquina, medição, material, mão de obra e meio ambiente (ISHIKAWA, 1986). Em software, "
  "as categorias costumam ser adaptadas para processo, ferramentas e infraestrutura, testes, dados e "
  "requisitos, pessoas e ambiente. O diagrama é construído em grupo e depois aprofundado com a técnica dos "
  "**5 porquês** para chegar à causa-raiz.")
H2("9.2 Construção: incidente CrowdStrike Channel File 291 (2024)")
P("Em 19 de julho de 2024, uma atualização de conteúdo do sensor Falcon, da CrowdStrike, fez computadores "
  "Windows travarem com a tela azul. A Microsoft estimou cerca de 8,5 milhões de dispositivos afetados, "
  "menos de 1% das máquinas Windows, mas concentrados em empresas críticas, como companhias aéreas, bancos e "
  "hospitais (WESTON, 2024). O relatório de causa-raiz publicado pela CrowdStrike em 6 de agosto de 2024 "
  "descreve as falhas técnicas e de processo usadas na Figura 5 (CROWDSTRIKE, 2024).")
FIG("ishikawa.png", "Diagrama de causa e efeito do incidente CrowdStrike Channel File 291",
    "elaborado pela equipe com base em CrowdStrike (2024) e Weston (2024).", largura=14.5)
H2("9.3 Interpretação e 5 porquês")
P("O diagrama mostra que não houve uma causa única. Os ramos mais carregados são **Medição/Testes** e "
  "**Método/Processo**, e é neles que estão as causas-raiz. Aplicando os 5 porquês ao efeito:")
BUL([
    "**Por que as máquinas travaram?** Porque o interpretador de conteúdo do sensor leu uma posição de "
    "memória fora do array, dentro do kernel do Windows.",
    "**Por que leu fora do array?** Porque o template de detecção definia 21 campos de entrada e o código "
    "que o alimentava fornecia apenas 20, e não havia checagem de limites.",
    "**Por que o arquivo com problema foi aprovado?** Porque o validador de conteúdo tinha um erro de lógica e "
    "os testes do template nunca tinham usado um critério diferente de curinga no 21º campo.",
    "**Por que a falha atingiu todos os clientes de uma vez?** Porque esse tipo de conteúdo era entregue a "
    "toda a base ao mesmo tempo, sem implantação gradual (canário).",
    "**Por que não havia implantação gradual?** Porque o conteúdo de resposta rápida era tratado como "
    "configuração e não como código, com um processo de liberação mais leve que o do próprio sensor.",
])
P("A causa-raiz, portanto, é de **processo**: um artefato que se comportava como código não passava pelo "
  "mesmo rigor de testes e de implantação que o código. As ações anunciadas pela empresa atacam exatamente "
  "esses ramos: checagem de limites no interpretador, correção e novos testes no validador, implantação em "
  "anéis com canário e controle do cliente sobre quando receber as atualizações (CROWDSTRIKE, 2024).")
H2("9.4 Análise crítica e justificativa")
P("**O que funcionou:** a empresa reverteu a atualização em cerca de 78 minutos e publicou uma análise de "
  "causa-raiz pública e detalhada, boa prática de cultura sem culpados. **O que falhou:** a recuperação "
  "exigiu intervenção manual em cada máquina, porque o defeito impedia o sistema de subir. **O que poderia "
  "ser melhorado:** tratar configuração como código, com testes de fronteira (como o caso de 20 contra 21 "
  "campos), fuzzing e implantação progressiva; validar toda entrada, mesmo a de arquivos internos, é princípio "
  "básico de desenvolvimento seguro (ALBUQUERQUE; RIBEIRO, 2002). **Justificativa:** o Ishikawa foi escolhido "
  "porque o problema tinha causas de naturezas diferentes (técnicas, de processo e organizacionais), e a "
  "ferramenta obriga a olhar todas as categorias antes de culpar uma pessoa ou uma linha de código.")

# ============================================================ 10 ESTUDOS DE CASO
H1("10 Estudos de caso")
H2("10.1 Caso 1: LocalSend, um backlog de bugs que só cresce")
P("**Contexto.** O LocalSend é mantido por uma comunidade de código aberto, com processo leve: issues no "
  "GitHub, PRs com CI e revisão dos mantenedores, sem sprints. As ferramentas das seções 4 a 8 foram "
  "aplicadas ao mesmo conjunto de dados, o que permite uma leitura integrada.")
fe = {"2023": (157, 93), "2024": (103, 59), "2025": (128, 34), "2026": (234, 150)}
TAB("tab", "Entrada e saída de issues de bug por ano no LocalSend", [
    ["Ano", "Bugs abertos no ano", "Bugs fechados no ano", "Saldo (cresc. do backlog)", "PRs mesclados"],
    *[[a, e, f, f"+{e - f}", S["prs_por_ano"][a]] for a, (e, f) in fe.items()],
], [2.0, 3.4, 3.4, 3.8, 3.0], "elaborado pela equipe com dados do GitHub, 15/11/2026 (2026 até 15/11).",
    alinhar_num=True)
P("**Diagnóstico.** Em todos os anos entraram mais bugs do que saíram, e o backlog cresceu sem parar. Em "
  "2025 e 2026 o número de PRs mesclados caiu para menos de um terço do de 2023–2024, enquanto os relatos de "
  "bug de 2026 bateram recorde. O histograma mostra que, quando há um PR, ele é integrado rápido (mediana de "
  f"{br(L['mediana_h'])} h); o fluxograma mostra que o tempo se perde antes do PR, na triagem e na espera por "
  f"alguém que assuma a correção (mediana de {br(S['bug_fechamento_mediana_dias'])} dias até o fechamento); "
  "a dispersão mostra que reduzir o tamanho dos PRs não aceleraria o fluxo; e o Pareto e a folha de "
  "verificação mostram onde os defeitos se concentram (Android e Linux) e que a classificação é incompleta.")
P("**O que funcionou:** CI e revisão garantem que o que entra está aprovado, e o tempo de integração é "
  "bom. **O que falhou:** a capacidade de correção não acompanha a demanda, e a triagem não registra dados "
  "suficientes para priorizar. **O que poderia ser melhorado:** formulário de issue com plataforma e versão "
  "obrigatórias; rótulo *good first issue* nos bugs simples das categorias do Pareto, para atrair "
  "contribuidores; um limite de WIP para a triagem (por exemplo, nenhuma issue nova sem rótulo por mais de 7 "
  "dias); e acompanhar mensalmente o saldo de entrada e saída como indicador principal.")
H2("10.2 Caso 2: CrowdStrike, quando a configuração derruba o mundo (2024)")
P("**Contexto.** A CrowdStrike é uma das maiores empresas de segurança de endpoints. Seu sensor roda no "
  "kernel do sistema operacional e recebe dois tipos de atualização: o próprio sensor (código, com testes "
  "e implantação controlada) e o \"conteúdo de resposta rápida\" (arquivos de configuração com novos padrões "
  "de detecção, entregues várias vezes ao dia). Em 19/07/2024, às 04h09 UTC, foi publicado o Channel File "
  "291, revertido às 05h27 UTC. Nesse intervalo, as máquinas que o receberam entraram em ciclo de tela azul.")
P("**Dados.** Cerca de 8,5 milhões de dispositivos Windows afetados (WESTON, 2024); cerca de 78 minutos de "
  "exposição; recuperação manual, máquina a máquina, em modo de segurança; voos cancelados e serviços "
  "hospitalares e bancários interrompidos em vários países.")
P("**Ferramentas aplicadas.** O diagrama de causa e efeito e os 5 porquês da seção 9 mostram que a causa-raiz "
  "foi de processo. Um fluxograma do processo de liberação de conteúdo evidenciaria o ponto em que faltava a "
  "decisão \"implantar primeiro em um anel pequeno e observar?\". Uma folha de verificação de liberação com o "
  "item \"o arquivo foi carregado pelo sensor real em uma máquina de teste antes do envio?\" teria barrado o "
  "problema, já que o defeito aparecia logo na carga.")
P("**Análise crítica.** A lição para times ágeis é direta: integração e entrega contínuas aceleram tanto a "
  "entrega de valor quanto a de defeitos. A velocidade só é segura quando acompanhada de testes de "
  "fronteira, validação no ambiente real e implantação progressiva com reversão automática, as mesmas "
  "práticas que o DORA associa às equipes de elite. O que funcionou foi a transparência da análise pós-incidente "
  "e a reversão rápida; o que falhou foi tratar configuração como algo de menor risco que código.")
H2("10.3 Caso 3: Knight Capital, US$ 460 milhões em 45 minutos (2012)")
P("**Contexto.** A Knight Capital era uma das maiores operadoras do mercado de ações dos Estados Unidos. Para "
  "um novo programa da bolsa, a empresa atualizou o software de roteamento de ordens em seus oito servidores, "
  "manualmente. Um técnico não copiou o código novo para um dos servidores. O novo código reaproveitava uma "
  "flag que, no código antigo, ativava a função \"Power Peg\", desativada havia anos, mas nunca removida.")
P("**Dados.** Em 1º de agosto de 2012, nos primeiros 45 minutos do pregão, o servidor desatualizado enviou "
  "mais de 4 milhões de ordens ao mercado tentando executar apenas 212 ordens de clientes, gerando prejuízo "
  "de mais de US$ 460 milhões. Antes da abertura, sistemas internos enviaram dezenas de e-mails automáticos "
  "de alerta que ninguém tratou. A SEC multou a empresa em US$ 12 milhões por violar a regra de controle de "
  "acesso ao mercado (SEC, 2013), e a Knight foi adquirida meses depois.")
P("**Ferramentas aplicadas.** No Ishikawa, as causas se distribuem por **Método** (implantação manual, sem "
  "revisão por segunda pessoa e sem procedimento escrito), **Material** (código morto mantido por anos e flag "
  "reaproveitada), **Medição** (nenhuma verificação automática de que os oito servidores tinham a mesma "
  "versão) e **Pessoas** (alertas ignorados, sem plano de resposta a incidentes). Uma simples **folha de "
  "verificação** de implantação, com uma linha por servidor e a conferência da versão instalada, teria "
  "detectado o servidor desatualizado.")
P("**Análise crítica.** O caso é o argumento clássico a favor da automação de implantação e da remoção de "
  "código morto, duas práticas hoje associadas ao DevOps e à refatoração contínua do XP. A falha não foi de "
  "programação, mas da ausência de um processo de qualidade em volta do código.")
H2("10.4 Comparação entre os casos")
TAB("quadro", "Comparação dos estudos de caso", [
    ["Aspecto", "LocalSend", "CrowdStrike (2024)", "Knight Capital (2012)"],
    ["Tipo de problema", "Crônico: backlog crescente", "Agudo: falha global", "Agudo: falha financeira"],
    ["Ferramenta-chave", "Folha, histograma, Pareto", "Ishikawa + 5 porquês", "Ishikawa + folha de verificação"],
    ["Causa-raiz", "Capacidade de correção < demanda; triagem sem dados",
     "Conteúdo tratado como configuração, sem teste real nem canário",
     "Implantação manual sem checklist; código morto"],
    ["Prática ágil/DevOps que previne", "WIP limitado, issue forms, métricas de fluxo",
     "Testes de fronteira, entrega progressiva", "Deploy automatizado, refatoração, DoD"],
], [3.3, 4.2, 4.3, 4.2], "elaborado pela equipe.")

# ============================================================ 11 CONCLUSÃO
H1("11 Conclusão e ações de melhoria contínua")
P("As ferramentas da qualidade continuam atuais porque respondem a perguntas que todo time de software faz: "
  "como o trabalho flui, quanto ele varia, o que se relaciona com o quê, onde estão os problemas e por que "
  "eles acontecem. O trabalho mostrou que elas rendem mais quando usadas em conjunto e sobre dados reais. No "
  "LocalSend, o histograma e a dispersão derrubaram a hipótese de que PRs grandes eram o gargalo, e o "
  "fluxograma, a folha de verificação e o Pareto apontaram o problema verdadeiro: um backlog de bugs que "
  "cresce porque a triagem e a capacidade de correção não acompanham a demanda. Nos casos CrowdStrike e "
  "Knight Capital, o diagrama de causa e efeito mostrou que grandes falhas raramente têm uma causa única e "
  "quase sempre envolvem processo, e não apenas uma pessoa ou uma linha de código.")
P("Também ficou claro que as práticas ágeis (TDD, integração contínua, revisão de código e Definition of "
  "Done) são a forma moderna de aplicar o controle de qualidade de Ishikawa: elas colocam a verificação "
  "dentro do fluxo, em ciclos curtos. Mas elas só funcionam se forem medidas, e é aí que as ferramentas "
  "clássicas entram. Como lembram Fernandes e Abreu (2014), a melhoria de processos é contínua e depende de "
  "indicadores acompanhados ao longo do tempo. O Quadro 5 propõe o plano de melhoria no ciclo PDCA.")
TAB("quadro", "Plano de melhoria contínua (PDCA)", [
    ["Problema (evidência)", "Ação proposta (Do)", "Indicador e meta (Check)", "Padronização (Act)"],
    ["Backlog de bugs cresce todo ano (Tabela 4)",
     "Rodízio semanal de triagem; good first issue nos bugs simples",
     "Saldo mensal entrada − saída ≤ 0 em 6 meses", "Incluir a triagem no CONTRIBUTING"],
    ["60% dos bugs sem plataforma (Tabela 3)", "Issue form com plataforma e versão obrigatórias",
     "≥ 95% das issues novas classificadas", "Formulário como folha de verificação oficial"],
    ["Android e Linux = 48% dos bugs (Figura 4)", "Testes automatizados de rede e de permissões nessas plataformas",
     "Queda de 30% nos bugs dessas plataformas em 2 trimestres", "Repetir o Pareto a cada trimestre"],
    [f"15% dos PRs > 72 h (Figura 2)", "Política: PR sem atividade há 14 dias é revisado ou fechado",
     "P85 do lead time ≤ 48 h", "Publicar o SLE no repositório"],
    ["Incidentes por configuração (caso CrowdStrike)", "Tratar configuração como código: testes de fronteira e canário",
     "100% das liberações com anel de canário", "Item obrigatório na DoD"],
    ["Implantação manual (caso Knight)", "Deploy automatizado e checklist de verificação de versão",
     "0 servidores com versão divergente", "Pipeline como única via de deploy"],
], [3.9, 4.3, 4.0, 3.8], "elaborado pela equipe.", tam=9)
P("Como trabalho futuro, a equipe sugere acompanhar esses indicadores com um **gráfico de controle**, a "
  "sétima ferramenta básica, para distinguir uma melhora real de uma variação aleatória do processo.")

# ============================================================ REFERÊNCIAS
H1("Referências")
refs = [
    "ALBUQUERQUE, Ricardo; RIBEIRO, Bruno. **Segurança no desenvolvimento de software**: como garantir "
    "a segurança do sistema para seu cliente usando a ISO/IEC 15408. Rio de Janeiro: Campus, 2002.",
    "ANDERSON, David J. **Kanban**: successful evolutionary change for your technology business. Sequim: "
    "Blue Hole Press, 2010.",
    "BALLMER, Steve. **Memo from Steve Ballmer to Microsoft customers**: trustworthy computing. Redmond: "
    "Microsoft, out. 2002. Reproduzido em eWeek. Disponível em: https://www.eweek.com/enterprise-apps/"
    "full-text-of-10-02-ballmer-memo/. Acesso em: 15 nov. 2026.",
    "BARTIÉ, Alexandre. **Garantia da qualidade de software**. Rio de Janeiro: Elsevier, 2002.",
    "BECK, Kent; ANDRES, Cynthia. **Extreme programming explained**: embrace change. 2. ed. Boston: "
    "Addison-Wesley, 2004.",
    "CROWDSTRIKE. **Channel File 291 incident**: root cause analysis. Austin: CrowdStrike, 6 ago. 2024. "
    "Disponível em: https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-"
    "Cause-Analysis-08.06.2024.pdf. Acesso em: 15 nov. 2026.",
    "DORA. **Accelerate State of DevOps Report 2024**. Mountain View: Google Cloud, 2024. Disponível em: "
    "https://dora.dev/research/2024/dora-report/. Acesso em: 15 nov. 2026.",
    "FAGAN, Michael E. Design and code inspections to reduce errors in program development. **IBM Systems "
    "Journal**, v. 15, n. 3, p. 182-211, 1976.",
    "FÉLIX, Rafael (org.). **Teste de software**. São Paulo: Pearson Education do Brasil, 2016.",
    "FERNANDES, Aguinaldo Aragon; ABREU, Vladimir Ferraz de. **Implantando a governança de TI**: da "
    "estratégia à gestão dos processos e serviços. 4. ed. Rio de Janeiro: Brasport, 2014.",
    "GALLOTTI, Giocondo Marino Antonio (org.). **Qualidade de software**. São Paulo: Pearson Education do "
    "Brasil, 2015.",
    "GOOGLE. **Google engineering practices documentation**: how to do a code review. 2024. Disponível em: "
    "https://google.github.io/eng-practices/review/. Acesso em: 15 nov. 2026.",
    "GUERRA, Ana Cervigni; COLOMBO, Regina Maria Thienne. **Qualidade de produto de software**. 2010.",
    "ISHIKAWA, Kaoru. **What is total quality control?** The Japanese way. Englewood Cliffs: "
    "Prentice-Hall, 1985.",
    "ISHIKAWA, Kaoru. **Guide to quality control**. 2. ed. Tokyo: Asian Productivity Organization, 1986.",
    "JURAN, Joseph M.; GODFREY, A. Blanton. **Juran's quality handbook**. 5. ed. New York: McGraw-Hill, 1999.",
    "LOCALSEND. **localsend/localsend**: an open-source cross-platform alternative to AirDrop. GitHub, 2026. "
    "Disponível em: https://github.com/localsend/localsend. Acesso em: 15 nov. 2026.",
    "NAGAPPAN, Nachiappan; BALL, Thomas. Use of relative code churn measures to predict system defect "
    "density. In: INTERNATIONAL CONFERENCE ON SOFTWARE ENGINEERING, 27., 2005, St. Louis. **Proceedings** "
    "[...]. New York: ACM, 2005. p. 284-292.",
    "NAGAPPAN, Nachiappan et al. Realizing quality improvement through test driven development: results and "
    "experiences of four industrial teams. **Empirical Software Engineering**, v. 13, n. 3, p. 289-302, 2008.",
    "PFLEEGER, Shari Lawrence. **Engenharia de software**: teoria e prática. 2. ed. São Paulo: Pearson, 2003.",
    "SADOWSKI, Caitlin et al. Modern code review: a case study at Google. In: INTERNATIONAL CONFERENCE ON "
    "SOFTWARE ENGINEERING: SOFTWARE ENGINEERING IN PRACTICE, 40., 2018, Gothenburg. **Proceedings** [...]. "
    "New York: ACM, 2018. p. 181-190.",
    "SCHWABER, Ken; SUTHERLAND, Jeff. **The Scrum Guide**: the definitive guide to Scrum. 2020. Disponível "
    "em: https://scrumguides.org. Acesso em: 15 nov. 2026.",
    "SEC – U.S. SECURITIES AND EXCHANGE COMMISSION. **In the matter of Knight Capital Americas LLC**. "
    "Release n. 70694. Washington, 16 out. 2013. Disponível em: https://www.sec.gov/litigation/admin/2013/"
    "34-70694.pdf. Acesso em: 15 nov. 2026.",
    "TELES, Vinícius Manhães. **Extreme programming**: aprenda como encantar seus usuários desenvolvendo "
    "software com agilidade e alta qualidade. São Paulo: Novatec, 2004.",
    "VACANTI, Daniel S. **Actionable agile metrics for predictability**: an introduction. Victoria: "
    "Leanpub, 2015.",
    "WESTON, David. Helping our customers through the CrowdStrike outage. **Official Microsoft Blog**, "
    "20 jul. 2024. Disponível em: https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-"
    "the-crowdstrike-outage/. Acesso em: 15 nov. 2026.",
]
for r in refs:
    par = doc.add_paragraph()
    par.alignment = WD_ALIGN_PARAGRAPH.LEFT
    par.paragraph_format.line_spacing = 1.0
    par.paragraph_format.space_after = Pt(12)
    runs(par, r)
    HT.append(f'<p class="ref">{md2html(r)}</p>')

# ============================================================ numeração de página (canto superior direito)
sec.different_first_page_header_footer = True
hp = sec.header.paragraphs[0]
hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = hp.add_run()
for tipo, txt in (("begin", None), (None, "PAGE"), ("separate", None), ("end", None)):
    if tipo:
        el = OxmlElement("w:fldChar")
        el.set(qn("w:fldCharType"), tipo)
    else:
        el = OxmlElement("w:instrText")
        el.set(qn("xml:space"), "preserve")
        el.text = txt
    r._r.append(el)
r.font.size = Pt(10)

doc.core_properties.title = "Ferramentas da qualidade aplicadas à engenharia de software"
doc.core_properties.subject = "Qualidade de Software – Trabalho N3"
doc.save(OUT)
print("gerado:", OUT)

# ============================================================ PDF via HTML + Edge
CSS = """
@page { size: A4; margin: 3cm 2cm 2cm 3cm; @top-right { content: counter(page); font: 10pt Arial; } }
@page :first { @top-right { content: none; } }
body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 0; }
p { margin: 0 0 6pt; text-align: justify; orphans: 3; widows: 3; }
p.ind { text-indent: 1.25cm; }
p.c { text-align: center; text-indent: 0; margin: 0; }
h1 { font-size: 12pt; font-weight: bold; margin: 0 0 12pt; break-after: avoid; }
h2 { font-size: 12pt; font-weight: bold; margin: 12pt 0 6pt; break-after: avoid; }
ul { margin: 0 0 8pt 0.6cm; padding-left: 0.6cm; text-align: justify; }
li { margin-bottom: 3pt; }
.pb { break-before: page; height: 0; }
.bloco { break-inside: avoid; margin: 6pt 0 4pt; }
p.leg { text-align: center; font-size: 10pt; line-height: 1.2; margin: 6pt 0 4pt; }
p.fonte { text-align: center; font-size: 10pt; line-height: 1.2; margin: 3pt 0 10pt; }
p.img { text-align: center; margin: 0; line-height: 1; }
table { border-collapse: collapse; margin: 0 auto; line-height: 1.2; table-layout: fixed; }
th, td { border: 0.5pt solid #7A8A90; padding: 2pt 4pt; vertical-align: top; text-align: left; }
th { background: #0F4C5C; color: #fff; }
tr:nth-child(even) td { background: #EEF4F5; }
td.num, th.num { text-align: center; }
p.ref { text-align: left; line-height: 1.0; margin-bottom: 12pt; }
.sum { width: 100%; border: none; font-size: 12pt; line-height: 1.5; }
.sum td { border: none; background: none !important; padding: 0; }
.sum td.n { text-align: right; width: 1.2cm; }
.sum .l2 td.t { padding-left: 0.8cm; }
.sum .l1 td { font-weight: bold; }
"""


def montar_html(paginas, marcar=False):
    linhas = []
    for nivel, hid, txt in SUM:
        if txt in ("RESUMO",):
            continue
        pg = paginas.get(hid, "")
        if marcar:   # 1ª passada: separador invisível impede achar o título dentro do próprio sumário
            txt = txt[0] + "⁣" + txt[1:]
        linhas.append(f'<tr class="l{nivel}"><td class="t"><a href="#{hid}" style="color:#000;'
                      f'text-decoration:none">{_html.escape(txt)}</a></td><td class="n">{pg}</td></tr>')
    sumario = '<table class="sum">' + "".join(linhas) + "</table>"
    corpo = "\n".join(sumario if x == "%%SUMARIO%%" else x for x in HT)
    return (f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório N3</title>'
            f"<style>{CSS}</style></head><body>{corpo}</body></html>")


def imprimir(html_txt):
    arq_html = BASE / "relatorio.html"
    arq_html.write_text(html_txt, encoding="utf-8")
    pdf = BASE.parent / "Relatório N3 - Ferramentas da Qualidade.pdf"
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    f"--user-data-dir={BASE / '.edge'}", f"--print-to-pdf={pdf}", arq_html.as_uri()],
                   check=True, capture_output=True, timeout=120)
    return pdf


import pymupdf  # noqa: E402

pdf = imprimir(montar_html({}, marcar=True))
d = pymupdf.open(pdf)
textos = [" ".join(pg.get_text().split()) for pg in d]
d.close()
pag, ultima = {}, 1
for nivel, hid, txt in SUM:
    for i in range(ultima - 1, len(textos)):   # títulos aparecem em ordem
        if " ".join(txt.split()) in textos[i]:
            pag[hid] = ultima = i + 1
            break
pdf = imprimir(montar_html(pag))
n_pag = len(pymupdf.open(pdf))
faltando = [t for _, h, t in SUM if h not in pag]
print("PDF:", pdf, "| páginas:", n_pag, "| títulos sem página:", faltando)
