// Gera a apresentação do seminário (Trabalho N3 - Qualidade de Software).
// Uso: node gerar_slides.js   (depois de python analisar_dados.py)
// Nomes da equipe e turma: edite INTEGRANTES e TURMA abaixo.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./apply_theme.js");

const INTEGRANTES = ["Geison Carlos Melo", "[Integrante 2]", "[Integrante 3]", "[Integrante 4]", "[Integrante 5]"];
const TURMA = "[preencher turma]";

const S = JSON.parse(fs.readFileSync(path.join(__dirname, "dados", "stats.json"), "utf8"));
const FIG = (f) => path.join(__dirname, "figuras", f);
const OUT = path.join(__dirname, "..", "Apresentacao - Ferramentas da Qualidade.pptx");
const br = (v, c = 1) => v.toFixed(c).replace(".", ",");

const THEME = {
  name: "Qualidade N3", headFontFace: "Calibri", bodyFontFace: "Calibri",
  colors: {
    dk1: "1F2933", lt1: "FFFFFF", dk2: "0F4C5C", lt2: "EEF4F5",
    accent1: "0F4C5C", accent2: "E36414", accent3: "5F9EA0", accent4: "A7C4C9",
    accent5: "9A3412", accent6: "5B6770", hlink: "0F4C5C", folHlink: "5B6770",
  },
};
const C = { teal: "0F4C5C", amber: "E36414", ink: "1F2933", muted: "5B6770", tint: "EEF4F5", soft: "A7C4C9", white: "FFFFFF", amberTint: "FDF0E7" };
const W = 13.333, MX = 0.6;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Ferramentas da qualidade na engenharia de software";
pres.subject = "Qualidade de Software - Trabalho N3";

// ------------------------------------------------------------------ layouts
pres.defineSlideMaster({
  title: "CONTEUDO",
  background: { color: C.white },
  objects: [
    { text: { text: "Qualidade de Software · Trabalho N3 · 2026/2", options: { x: MX, y: 7.05, w: 6, h: 0.3, fontSize: 10, color: C.muted, margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.35, w: W - 2 * MX, h: 0.85, fontSize: 30, bold: true, color: C.teal, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: W - MX - 0.6, y: 7.05, w: 0.6, h: 0.3, fontSize: 10, color: C.muted, align: "right" },
});
pres.defineSlideMaster({
  title: "ESCURO",
  background: { color: C.teal },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 1.2, w: W - 2 * MX, h: 1.6, fontSize: 40, bold: true, color: C.white, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
});

const notas = (s, t) => s.addNotes(t);
let secao = "";
function nova(layout, titulo, sec) {
  if (sec && sec !== secao) { pres.addSection({ title: sec }); secao = sec; }
  const s = pres.addSlide({ masterName: layout, sectionTitle: secao });
  if (titulo) s.addText(titulo, { placeholder: "title" });
  return s;
}
function card(s, x, y, w, h, head, body, opt = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: opt.fill || C.tint }, line: { color: opt.fill || C.tint }, objectName: "card" });
  if (opt.badge) {
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.5, h: 0.5, fill: { color: opt.badgeColor || C.teal }, line: { color: opt.badgeColor || C.teal } });
    s.addText(opt.badge, { x: x + 0.25, y: y + 0.25, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  const dx = opt.badge ? 0.95 : 0.25;
  s.addText(head, { x: x + dx, y: y + 0.2, w: w - dx - 0.2, h: 0.6, fontSize: opt.headSize || 18, bold: true, color: opt.headColor || C.teal, valign: "middle", margin: 0, isTextBox: true });
  s.addText(body, { x: x + 0.25, y: y + 0.9, w: w - 0.5, h: h - 1.05, fontSize: opt.bodySize || 14, color: C.ink, valign: "top", margin: 0, isTextBox: true, paraSpaceAfter: 4 });
}
function stat(s, x, y, w, grande, rotulo, cor = C.teal, fonteTxt, tam = 48) {
  s.addText(grande, { x, y, w, h: 1.0, fontSize: tam, bold: true, color: cor, margin: 0, valign: "bottom", isTextBox: true });
  s.addText(rotulo, { x, y: y + 1.05, w, h: 0.9, fontSize: 14, color: C.ink, margin: 0, valign: "top", isTextBox: true });
  if (fonteTxt) s.addText(fonteTxt, { x, y: y + 1.9, w, h: 0.35, fontSize: 10, color: C.muted, italic: true, margin: 0, isTextBox: true });
}
function bullets(s, itens, x, y, w, h, tam = 15) {
  s.addText(itens.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < itens.length - 1 } })),
    { x, y, w, h, fontSize: tam, color: C.ink, valign: "top", paraSpaceAfter: 8, margin: 0, isTextBox: true });
}
function rodapeFonte(s, t) {
  s.addText("Fonte: " + t, { x: MX, y: 6.62, w: W - 2 * MX, h: 0.3, fontSize: 10, color: C.muted, italic: true, margin: 0, isTextBox: true });
}
function img(s, arq, x, y, w) {
  const dims = { "fluxograma.png": [11, 7.2], "histograma.png": [9, 4.6], "dispersao.png": [9, 4.8], "pareto.png": [9, 4.8], "ishikawa.png": [12, 6.2] }[arq];
  s.addImage({ path: FIG(arq), x, y, w, h: w * dims[1] / dims[0], altText: arq.replace(".png", "") });
}
const eixo = { catAxisLabelColor: C.muted, valAxisLabelColor: C.muted, catAxisLabelFontSize: 11, valAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", valGridLine: { color: "D9E2E5", size: 0.75 }, catGridLine: { style: "none" }, dataLabelFontFace: "+mn-lt", dataLabelFontSize: 11, dataLabelColor: C.ink, titleFontFace: "+mn-lt", titleColor: C.ink, titleFontSize: 14 };

const L = S.lead, D = S.dispersao, PA = S.pareto, EB = S.estado_bugs;

// ------------------------------------------------------------------ 1 capa
{
  const s = nova("ESCURO", "Ferramentas da qualidade na engenharia de software", "Abertura");
  s.addText("QUALIDADE DE SOFTWARE · TRABALHO N3", { x: MX, y: 0.6, w: 8, h: 0.4, fontSize: 14, bold: true, color: C.soft, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText("Da teoria aos dados reais: LocalSend, CrowdStrike e Knight Capital", { x: MX, y: 2.95, w: 11, h: 0.6, fontSize: 22, color: C.white, italic: true, margin: 0, isTextBox: true });
  s.addText(INTEGRANTES.join("  ·  "), { x: MX, y: 4.9, w: W - 2 * MX, h: 0.5, fontSize: 16, color: C.white, margin: 0, isTextBox: true });
  s.addText(`Engenharia de Software · Prof. Martim Dietterle · Turma ${TURMA} · 18/11/2026`, { x: MX, y: 5.45, w: W - 2 * MX, h: 0.4, fontSize: 14, color: C.soft, margin: 0, isTextBox: true });
  s.addText("Católica de Santa Catarina · Jaraguá do Sul – SC", { x: MX, y: 6.6, w: 8, h: 0.35, fontSize: 12, color: C.soft, margin: 0, isTextBox: true });
  notas(s, "Abertura (quem apresenta: 1º integrante). Apresentar a equipe e a proposta: aplicar as ferramentas da qualidade a dados reais, e não só a exemplos inventados. O fio condutor é o LocalSend, o mesmo app avaliado no Trabalho N2, agora visto pelo lado do processo.");
}
// ------------------------------------------------------------------ 2 roteiro
{
  const s = nova("CONTEUDO", "Três fontes reais e uma pergunta: onde a qualidade se perde?");
  const y = 1.6, h = 3.0, w = 3.85, g = 0.3;
  card(s, MX, y, w, h, "LocalSend", `Dados públicos do GitHub coletados em 15/11/2026: ${S.n_prs} pull requests mesclados e ${S.n_bugs} issues de bug (2023–2026). Base do fluxograma, histograma, dispersão, folha de verificação e Pareto.`, { badge: "1" });
  card(s, MX + w + g, y, w, h, "CrowdStrike (2024)", "Atualização Channel File 291 derrubou cerca de 8,5 milhões de PCs Windows. Base do diagrama de causa e efeito e dos 5 porquês.", { badge: "2", badgeColor: C.amber });
  card(s, MX + 2 * (w + g), y, w, h, "Knight Capital (2012)", "Implantação manual esquecida em 1 de 8 servidores: mais de US$ 460 milhões perdidos em 45 minutos.", { badge: "3", badgeColor: C.amber });
  s.addText("Roteiro:  qualidade no ágil  →  as 7 ferramentas aplicadas  →  3 estudos de caso  →  plano de melhoria (PDCA)", { x: MX, y: 5.0, w: W - 2 * MX, h: 0.6, fontSize: 18, bold: true, color: C.teal, margin: 0, isTextBox: true });
  notas(s, "Explicar por que o LocalSend: projeto real, código aberto, histórico público completo, e a equipe já o conhece do N2. Os dados foram extraídos pela API do GitHub; os scripts estão na pasta _apoio e reproduzem todos os números. CrowdStrike e Knight são casos de falha muito documentados (relatório oficial da empresa e ordem da SEC).");
}
// ------------------------------------------------------------------ 3 ágil
{
  const s = nova("CONTEUDO", "No ágil, a qualidade é construída dentro do processo", "Qualidade no ágil");
  const y = 1.6, h = 3.6, w = 3.85, g = 0.3;
  card(s, MX, y, w, h, "Scrum", "Definition of Done: critério único de pronto\nRevisão da sprint inspeciona o produto\nRetrospectiva inspeciona o processo", { bodySize: 17, headSize: 22 });
  card(s, MX + w + g, y, w, h, "Kanban", "Fluxo visível e WIP limitado\nPolíticas explícitas por coluna (ex.: só sai de Revisão com aprovação)\nTempo de ciclo medido e analisado", { bodySize: 17, headSize: 22 });
  card(s, MX + 2 * (w + g), y, w, h, "XP", "TDD e testes automatizados\nIntegração contínua\nProgramação em par e refatoração\nReleases pequenas", { bodySize: 17, headSize: 22 });
  s.addText("Em comum: feedback rápido. O defeito é achado no mesmo ciclo em que nasce, quando ainda é barato corrigir (Teles, 2004).", { x: MX, y: 5.55, w: W - 2 * MX, h: 0.5, fontSize: 16, italic: true, color: C.muted, margin: 0, isTextBox: true });
  notas(s, "Scrum: a DoD é o contrato de qualidade do time; item fora da DoD não é apresentado como pronto (Scrum Guide 2020). Kanban: limitar o WIP reduz troca de contexto e expõe gargalos; as métricas de fluxo usam histograma e dispersão (Vacanti, 2015). XP: é o método com mais práticas técnicas de qualidade (Beck, 2004; Teles, 2004). Pergunta provável: 'qual método garante mais qualidade?' Resposta: nenhum sozinho; o que garante é a prática técnica + a medição.");
}
// ------------------------------------------------------------------ 4 evidências
{
  const s = nova("CONTEUDO", "As práticas funcionam, e há números para provar");
  const w = 2.85, g = 0.25, y = 1.55;
  stat(s, MX, y, w, "40–90%", "menos defeitos antes da entrega em times com TDD", C.teal, "Microsoft e IBM (Nagappan et al., 2008)");
  stat(s, MX + (w + g), y, w, "< 4 h", "mediana do tempo de revisão de código", C.teal, "Google (Sadowski et al., 2018)");
  stat(s, MX + 2 * (w + g), y, w, "~5%", "de falha de mudanças no grupo de elite, com lead time < 1 dia", C.teal, "DORA, 2024");
  stat(s, MX + 3 * (w + g), y, w, `${br(L.ate_24h_pct, 0)}%`, "dos PRs do LocalSend mesclados em até 24 h (CI + revisão)", C.amber, "dados do GitHub, 15/11/2026");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 4.55, w: W - 2 * MX, h: 1.65, rectRadius: 0.08, fill: { color: C.amberTint }, line: { color: C.amberTint } });
  s.addText([
    { text: "Análise crítica  ", options: { bold: true, color: C.amber } },
    { text: "O TDD custou de 15% a 35% mais tempo inicial, e os estudos são de caso, não experimentos controlados. No LocalSend, integrar é rápido, mas isso não garante que os bugs sejam corrigidos rápido: o backlog cresce todo ano (caso 1)." },
  ], { x: MX + 0.3, y: 4.7, w: W - 2 * MX - 0.6, h: 1.35, fontSize: 15, color: C.ink, valign: "middle", margin: 0, isTextBox: true });
  notas(s, "Microsoft/IBM: quatro produtos, times com e sem TDD sob o mesmo gerente; densidade de defeitos pré-release 40% a 90% menor. Google: mudanças pequenas (mediana ~24 linhas) e revisão leve. DORA 2024: elite implanta sob demanda, lead time < 1 dia, ~5% de falha de mudanças e recuperação < 1 h. LocalSend: mediana de 24 linhas por PR, igual ao Google, e 72% mesclados em 24 h.");
}
// ------------------------------------------------------------------ 5 ferramentas
{
  const s = nova("CONTEUDO", "Sete ferramentas, cada uma responde a uma pergunta", "Ferramentas da qualidade");
  const itens = [
    ["Fluxograma", "Entender o processo", "Como o trabalho realmente flui?"],
    ["Folha de verificação", "Coleta de dados", "Quantas vezes e onde ocorre?"],
    ["Histograma", "Variação", "Como os valores se distribuem?"],
    ["Dispersão", "Relação", "Duas variáveis andam juntas?"],
    ["Pareto", "Priorização", "Quais poucas causas pesam mais?"],
    ["Causa e efeito", "Causa-raiz", "Por que o problema acontece?"],
    ["Gráfico de controle", "Monitoramento", "O processo está estável?"],
    ["Complementares", "Causa e plano", "5 porquês, 5W2H, GUT, PDCA"],
  ];
  const w = 2.85, h = 2.4, g = 0.25;
  itens.forEach(([n, cat, q], i) => {
    const x = MX + (i % 4) * (w + g), y = 1.5 + Math.floor(i / 4) * (h + g);
    const destaque = i < 6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: destaque ? C.tint : "F7F7F7" }, line: { color: destaque ? C.tint : "E5E7EB" } });
    s.addText(cat.toUpperCase(), { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.35, fontSize: 11, bold: true, color: destaque ? C.amber : C.muted, charSpacing: 1, margin: 0, isTextBox: true });
    s.addText(n, { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 0.55, fontSize: 20, bold: true, color: destaque ? C.teal : C.muted, margin: 0, isTextBox: true });
    s.addText(q, { x: x + 0.25, y: y + 1.25, w: w - 0.5, h: 0.95, fontSize: 15, color: C.ink, margin: 0, valign: "top", isTextBox: true });
  });
  notas(s, "Origem: Kaoru Ishikawa reuniu as sete ferramentas básicas para que qualquer pessoa da empresa resolvesse a maior parte dos problemas de qualidade (Ishikawa, 1986). A classificação é por finalidade dentro do ciclo PDCA. Os seis cartões em destaque são os pedidos no trabalho e foram construídos com dados reais; o gráfico de controle fica como trabalho futuro para acompanhar o plano de ação.");
}
// ------------------------------------------------------------------ 6 fluxograma
{
  const s = nova("CONTEUDO", "Fluxograma: o gargalo está antes do pull request");
  img(s, "fluxograma.png", MX, 1.35, 7.9);
  const x = 8.85, w = W - x - MX;
  s.addText(`${br(100 * EB.abertos / S.n_bugs, 0)}%`, { x, y: 1.4, w, h: 0.9, fontSize: 48, bold: true, color: C.amber, margin: 0, isTextBox: true });
  s.addText(`das ${S.n_bugs} issues de bug ainda estão dentro do fluxo (${EB.abertos} abertas)`, { x, y: 2.3, w, h: 0.7, fontSize: 14, color: C.ink, margin: 0, isTextBox: true });
  bullets(s, [
    `Corrigir leva ${br(S.bug_fechamento_mediana_dias)} dias (mediana); mesclar o PR leva ${br(L.mediana_h)} h`,
    "Laços de retrabalho: falta de informação, CI reprovada e revisão",
    "Indústria: o ciclo de vida de bugs do Bugzilla (Mozilla) explicita quem age em cada estado",
  ], x, 3.2, w, 3.2, 14);
  rodapeFonte(s, "elaborado pela equipe com dados de localsend/localsend (GitHub), 15/11/2026");
  notas(s, "Como foi construído: a partir dos rótulos públicos (needs-more-info, duplicate, wontfix, bug, plataforma) e dos motivos de fechamento do GitHub. Interpretação: CI e revisão são portões fortes; a triagem é manual e acumula fila. Crítica: o processo não está documentado; os estados ficam implícitos nos rótulos. Melhoria: publicar o fluxo no CONTRIBUTING e tornar cada decisão um rótulo obrigatório. Justificativa: sem o fluxograma não saberíamos onde medir.");
}
// ------------------------------------------------------------------ 7 histograma
{
  const s = nova("CONTEUDO", "Histograma: a média esconde a cauda longa");
  const cls = Object.keys(S.hist_classes);
  const vals = Object.values(S.hist_classes);
  const rot = cls.map((c) => c === ">=72h" ? "≥72" : c.replace("h", ""));
  s.addChart(pres.charts.BAR, [
    { name: "até 72 h", labels: rot, values: vals.map((v, i) => i < vals.length - 1 ? v : 0) },
    { name: "72 h ou mais", labels: rot, values: vals.map((v, i) => i === vals.length - 1 ? v : 0) },
  ], {
    x: MX, y: 1.35, w: 8.1, h: 5.2, barDir: "col", barGrouping: "stacked", barGapWidthPct: 15,
    chartColors: [C.teal, C.amber], showLegend: false, showValue: true, dataLabelPosition: "inEnd", dataLabelFormatCode: "#,##0;;", dataLabelColor: C.white,
    showTitle: true, title: `Lead time dos PRs mesclados, em classes de 6 h (n = ${S.n_prs})`,
    showCatAxisTitle: true, catAxisTitle: "horas da abertura ao merge", catAxisTitleFontSize: 12, catAxisTitleColor: C.muted,
    showValAxisTitle: true, valAxisTitle: "PRs", valAxisTitleFontSize: 12, valAxisTitleColor: C.muted, ...eixo,
  });
  const x = 9.0, w = W - x - MX;
  stat(s, x, 1.35, w, `${br(L.mediana_h)} h`, "mediana: o PR típico", C.teal);
  stat(s, x, 3.0, w, `${br(L.media_h)} h`, "média: inflada pelos 15% que passam de 3 dias", C.amber);
  s.addText(`Previsão honesta (estilo Kanban): 85% dos PRs entram em até ${br(L.p85_h, 0)} h.`, { x, y: 4.75, w, h: 0.9, fontSize: 14, bold: true, color: C.teal, margin: 0, isTextBox: true });
  s.addText("Limite: só PRs mesclados entram (viés de sobrevivência).", { x, y: 5.7, w, h: 0.7, fontSize: 13, color: C.muted, italic: true, margin: 0, isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com dados de localsend/localsend (GitHub), 15/11/2026");
  notas(s, `Distribuição assimétrica à direita: ${S.hist_classes["0-6h"]} PRs nas primeiras 6 h e ${S.hist_classes[">=72h"]} acima de 72 h. Média (${br(L.media_h)} h) quase 16 vezes a mediana (${br(L.mediana_h)} h): não serve como meta. Percentis: P25 ${br(L.p25_h)} h, P75 ${br(L.p75_h)} h, P85 ${br(L.p85_h)} h. Uso na indústria: times Kanban publicam 'X% dos itens em até N dias' a partir do percentil do histograma (Vacanti, 2015); o DORA trata lead time como métrica central. Justificativa: a pergunta era sobre variação, não sobre um número médio.`);
}
// ------------------------------------------------------------------ 8 dispersão
{
  const s = nova("CONTEUDO", "Dispersão: PR maior não demora mais para entrar");
  img(s, "dispersao.png", MX, 1.35, 8.1);
  const x = 9.0, w = W - x - MX;
  s.addText(`ρ = ${br(D.spearman, 2)}`, { x, y: 1.35, w, h: 0.9, fontSize: 44, bold: true, color: C.amber, margin: 0, isTextBox: true });
  s.addText("correlação de Spearman entre tamanho e lead time: praticamente nula", { x, y: 2.25, w, h: 0.7, fontSize: 14, color: C.ink, margin: 0, isTextBox: true });
  const pf = D.por_faixa;
  s.addTable([
    [{ text: "Tamanho", options: { bold: true, color: C.white, fill: { color: C.teal } } }, { text: "PRs", options: { bold: true, color: C.white, fill: { color: C.teal }, align: "center" } }, { text: "Mediana", options: { bold: true, color: C.white, fill: { color: C.teal }, align: "center" } }],
    ["< 10 linhas", { text: String(pf["0-10"].n), options: { align: "center" } }, { text: `${br(pf["0-10"].mediana_h)} h`, options: { align: "center" } }],
    ["10–99", { text: String(pf["10-100"].n), options: { align: "center" } }, { text: `${br(pf["10-100"].mediana_h)} h`, options: { align: "center" } }],
    ["100–999", { text: String(pf["100-1000"].n), options: { align: "center" } }, { text: `${br(pf["100-1000"].mediana_h)} h`, options: { align: "center" } }],
    ["≥ 1.000", { text: String(pf["1000-inf"].n), options: { align: "center" } }, { text: `${br(pf["1000-inf"].mediana_h)} h`, options: { align: "center" } }],
  ], { x, y: 3.05, w, colW: [1.6, 0.9, w - 2.5], fontSize: 13, color: C.ink, border: { type: "solid", pt: 0.5, color: "D9E2E5" }, rowH: 0.36, margin: 0.05 });
  s.addText("Indústria: na Microsoft, churn × defeitos separou binários propensos a falha com 89% de acerto (Nagappan; Ball, 2005).", { x, y: 5.0, w, h: 1.4, fontSize: 13, color: C.muted, italic: true, margin: 0, isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com dados de localsend/localsend (GitHub), 15/11/2026");
  notas(s, `Hipótese testada: PRs maiores demoram mais. Resultado: Spearman ${br(D.spearman, 2)}, reta quase horizontal em escala log-log. O Pearson bruto (${br(D.pearson_bruto, 2)}) parece indicar relação fraca, mas é inflado por poucos PRs gigantes: exemplo de por que usar Spearman em dados assimétricos. Só os PRs de 1.000+ linhas (16 casos) demoram claramente mais. Conclusão: dividir PRs não aceleraria o merge; o tempo depende de quem revisa e quando. Correlação não é causa. Melhoria: testar outras variáveis (revisores, comentários, horário).`);
}
// ------------------------------------------------------------------ 9 folha de verificação
{
  const s = nova("CONTEUDO", "Folha de verificação: os dados mostram tendência e lacuna");
  const anos = ["2023", "2024", "2025", "2026"];
  const cab = ["Plataforma", ...anos, "Total"].map((t, i) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.teal }, align: i ? "center" : "left" } }));
  const linhas = Object.entries(S.folha).slice(0, 7).map(([n, v], r) => {
    const z = r % 2 ? { fill: { color: C.tint } } : {};
    return [{ text: n, options: z }, ...anos.map((a) => ({ text: String(v[a]), options: { align: "center", ...z } })), { text: String(anos.reduce((t, a) => t + v[a], 0)), options: { align: "center", bold: true, ...z } }];
  });
  s.addTable([cab, ...linhas], { x: MX, y: 1.45, w: 6.6, colW: [1.8, 0.96, 0.96, 0.96, 0.96, 0.96], fontSize: 14, color: C.ink, border: { type: "solid", pt: 0.5, color: "D9E2E5" }, rowH: 0.42, margin: 0.06 });
  s.addText(`Linux cresce (13 → 19) e Windows cai (19 → 5). Só ${PA.bugs_com_componente} de ${S.n_bugs} bugs (${br(100 * PA.bugs_com_componente / S.n_bugs, 0)}%) têm plataforma.`, { x: MX, y: 5.05, w: 6.6, h: 0.9, fontSize: 14, bold: true, color: C.amber, margin: 0, isTextBox: true });
  const x = 7.65, w = W - x - MX;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.45, w, h: 4.95, rectRadius: 0.08, fill: { color: C.tint }, line: { color: C.tint } });
  s.addText("Checklist de revisão de PR (DoD)", { x: x + 0.3, y: 1.6, w: w - 0.6, h: 0.5, fontSize: 18, bold: true, color: C.teal, margin: 0, isTextBox: true });
  const ck = ["Issue vinculada e com plataforma", "CI verde em todas as plataformas afetadas", "Teste que falha sem a correção", "Testado na plataforma do bug", "Escopo único (sem misturar mudanças)", "Sem segredos ou dados pessoais", "Aprovado por um mantenedor"];
  s.addText(ck.map((t, i) => ({ text: "☐  " + t, options: { breakLine: i < ck.length - 1 } })), { x: x + 0.3, y: 2.2, w: w - 0.6, h: 3.4, fontSize: 15, color: C.ink, paraSpaceAfter: 6, margin: 0, valign: "top", isTextBox: true });
  s.addText("Indústria: inspeções de Fagan (IBM) e guia de revisão do Google", { x: x + 0.3, y: 5.75, w: w - 0.6, h: 0.5, fontSize: 12, italic: true, color: C.muted, margin: 0, isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com dados de localsend/localsend (GitHub), 15/11/2026; 2026 até 15/11");
  notas(s, "Dois formatos de folha: a de contagem (tabela, dados reais) e o checklist (proposta de DoD para o LocalSend). A contagem por ano mostra tendências que o total esconde e revela um problema de coleta: 60% das issues de bug não têm rótulo de plataforma. Melhoria: tornar a plataforma obrigatória no formulário de issue do GitHub; o formulário vira a própria folha. Exemplo real: inspeções formais de Fagan na IBM (1976) usam checklists por tipo de artefato.");
}
// ------------------------------------------------------------------ 10 pareto
{
  const s = nova("CONTEUDO", "Pareto: quatro plataformas concentram ~80% dos bugs");
  const lab = PA.itens.map((i) => i[0]);
  s.addChart([
    { type: pres.charts.BAR, data: [{ name: "Bugs", labels: lab, values: PA.itens.map((i) => i[1]) }], options: { chartColors: [C.teal], barGapWidthPct: 25 } },
    { type: pres.charts.LINE, data: [{ name: "% acumulado", labels: lab, values: PA.acumulado }], options: { chartColors: [C.amber], lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 7, secondaryValAxis: true, secondaryCatAxis: true } },
  ], {
    x: MX, y: 1.35, w: 8.1, h: 5.2, showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: C.muted,
    showTitle: true, title: `Issues de bug por plataforma/componente (${PA.total_rotulos} rótulos)`,
    valAxes: [
      { showValAxisTitle: true, valAxisTitle: "bugs", valAxisTitleFontSize: 12, valAxisTitleColor: C.muted, valAxisMinVal: 0 },
      { showValAxisTitle: true, valAxisTitle: "% acumulado", valAxisTitleFontSize: 12, valAxisTitleColor: C.muted, valAxisMinVal: 0, valAxisMaxVal: 100, valGridLine: { style: "none" } },
    ],
    catAxes: [{ catAxisTitle: "" }, { catAxisHidden: true }],
    ...eixo,
  });
  const x = 9.0, w = W - x - MX;
  stat(s, x, 1.35, w, `${br(PA.acumulado[3], 0)}%`, "em 4 de 10 categorias: Android, Linux, Windows e macOS", C.teal);
  stat(s, x, 3.0, w, `${br(PA.acumulado[1], 0)}%`, "só em Android + Linux: foco de testes e triagem", C.amber);
  s.addText("Microsoft, 2002: 20% dos bugs causavam 80% dos erros, e 1% causava metade (Ballmer, 2002).", { x, y: 4.85, w, h: 1.0, fontSize: 13, italic: true, color: C.muted, margin: 0, isTextBox: true });
  s.addText("Limite: conta rótulos, não impacto.", { x, y: 5.9, w, h: 0.5, fontSize: 13, color: C.muted, margin: 0, isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com dados de localsend/localsend (GitHub), 15/11/2026");
  notas(s, `Acumulado: ${PA.acumulado.slice(0, 5).map((v) => br(v)).join("%, ")}%. Não é um 80/20 perfeito (40% das categorias somam ~80%), o que é esperado em app multiplataforma. Decisão: atacar Android e Linux primeiro e investigar a alta de Linux (distribuições e pacotes variados). Exemplo real: Windows Error Reporting da Microsoft, 2002. Melhoria: Pareto ponderado por impacto (usuários afetados, reações, severidade) e repetido por trimestre.`);
}
// ------------------------------------------------------------------ 11 ishikawa
{
  const s = nova("CONTEUDO", "Causa e efeito: a falha da CrowdStrike teve várias causas", "Causa-raiz");
  img(s, "ishikawa.png", (W - 9.6) / 2, 1.25, 9.6);
  s.addText("Ramos mais carregados: Medição/Testes e Método/Processo. Nenhuma causa isolada explicaria o efeito.", { x: MX, y: 6.22, w: W - 2 * MX, h: 0.38, fontSize: 14, bold: true, color: C.teal, margin: 0, isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com base em CrowdStrike (2024) e Weston (2024)");
  notas(s, "Explicar o 6M adaptado ao software (processo, testes, software, dados, pessoas, ambiente). Dados do relatório oficial de 06/08/2024: o template definia 21 campos e a integração enviava 20; o validador tinha erro de lógica; o interpretador não checava limites do array; o conteúdo ia para todos os clientes de uma vez. Microsoft estimou ~8,5 milhões de dispositivos (menos de 1% do Windows, mas em empresas críticas).");
}
// ------------------------------------------------------------------ 12 cinco porquês
{
  const s = nova("CONTEUDO", "5 porquês: a causa-raiz foi de processo, não de código");
  const passos = [
    ["Por que travou?", "Leitura fora do array no kernel"],
    ["Por que fora do array?", "21 campos definidos, 20 enviados, sem checagem de limites"],
    ["Por que foi aprovado?", "Validador com erro de lógica; teste sem caso de fronteira"],
    ["Por que atingiu todos?", "Entrega a toda a base de uma vez, sem canário"],
    ["Por que sem canário?", "Conteúdo tratado como configuração, não como código"],
  ];
  const w = 2.3, g = 0.15, y = 1.6, h = 3.1;
  passos.forEach(([p, r], i) => {
    const x = MX + i * (w + g), ult = i === passos.length - 1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: ult ? C.amber : C.tint }, line: { color: ult ? C.amber : C.tint } });
    s.addText(String(i + 1), { x: x + 0.2, y: y + 0.15, w: 0.6, h: 0.6, fontSize: 28, bold: true, color: ult ? C.white : C.amber, margin: 0, isTextBox: true });
    s.addText(p, { x: x + 0.2, y: y + 0.8, w: w - 0.4, h: 0.8, fontSize: 16, bold: true, color: ult ? C.white : C.teal, margin: 0, valign: "top", isTextBox: true });
    s.addText(r, { x: x + 0.2, y: y + 1.6, w: w - 0.4, h: 1.35, fontSize: 14, color: ult ? C.white : C.ink, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText("Ações da empresa: checagem de limites, novos testes no validador, implantação em anéis com canário e controle do cliente sobre as atualizações.", { x: MX, y: 5.05, w: W - 2 * MX, h: 0.9, fontSize: 15, color: C.ink, margin: 0, isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com base em CrowdStrike (2024)");
  notas(s, "Os 5 porquês aprofundam o ramo mais carregado do Ishikawa. A lição para times ágeis: arquivo de configuração que muda comportamento é código e precisa de teste de fronteira, validação no ambiente real e entrega progressiva. Ponto positivo da empresa: reverteu em ~78 minutos e publicou uma análise pública e detalhada (cultura sem culpados).");
}
// ------------------------------------------------------------------ 13 caso 1
{
  const s = nova("CONTEUDO", "Caso 1 · LocalSend: entram mais bugs do que saem", "Estudos de caso");
  const anos = ["2023", "2024", "2025", "2026"];
  const fech = { 2023: 93, 2024: 59, 2025: 34, 2026: 150 };
  s.addChart(pres.charts.BAR, [
    { name: "abertos no ano", labels: anos, values: anos.map((a) => S.bugs_por_ano[a]) },
    { name: "fechados no ano", labels: anos, values: anos.map((a) => fech[a]) },
  ], {
    x: MX, y: 1.35, w: 6.6, h: 5.1, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60, chartColors: [C.amber, C.teal],
    showValue: true, dataLabelPosition: "outEnd", showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: C.muted,
    showTitle: true, title: "Issues de bug por ano (2026 até 15/11)", ...eixo,
  });
  const x = 7.6, w = W - x - MX;
  s.addText("Diagnóstico com as ferramentas", { x, y: 1.4, w, h: 0.5, fontSize: 18, bold: true, color: C.teal, margin: 0, isTextBox: true });
  bullets(s, [
    "Backlog cresce todo ano: +64, +44, +94, +84",
    `PRs mesclados caíram de ${S.prs_por_ano["2024"]} (2024) para ${S.prs_por_ano["2025"]} (2025)`,
    "Integrar é rápido (histograma); o tamanho não importa (dispersão)",
    "Faltam dados para priorizar (folha) e o foco é Android + Linux (Pareto)",
  ], x, 2.0, w, 2.6, 14);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.65, w, h: 1.8, rectRadius: 0.08, fill: { color: C.amberTint }, line: { color: C.amberTint } });
  s.addText([{ text: "Ação  ", options: { bold: true, color: C.amber } }, { text: "issue form com plataforma obrigatória, rodízio semanal de triagem e good first issue nos bugs simples. Indicador: saldo mensal ≤ 0." }],
    { x: x + 0.25, y: 4.75, w: w - 0.5, h: 1.6, fontSize: 14, color: C.ink, margin: 0, valign: "middle", isTextBox: true });
  rodapeFonte(s, "elaborado pela equipe com dados de localsend/localsend (GitHub), 15/11/2026");
  notas(s, `Leitura integrada das ferramentas sobre o mesmo dado: fluxograma (gargalo antes do PR), histograma (merge rápido), dispersão (tamanho não explica a espera), folha (60% sem plataforma) e Pareto (Android + Linux). Hoje há ${EB.abertos} bugs abertos. O que funcionou: CI e revisão. O que falhou: capacidade de correção abaixo da demanda e triagem sem dados. Melhoria: ações do PDCA (slide de plano).`);
}
// ------------------------------------------------------------------ 14 caso 2
{
  const s = nova("CONTEUDO", "Caso 2 · CrowdStrike (2024): configuração também é código");
  const marcos = [["04h09 UTC", "Channel File 291 publicado para toda a base"], ["05h27 UTC", "Arquivo revertido: ~78 min de exposição"], ["Dias seguintes", "Recuperação manual, máquina a máquina, em modo seguro"]];
  const w = 3.85, g = 0.3, y = 1.5;
  marcos.forEach(([t, d], i) => {
    const x = MX + i * (w + g);
    s.addShape(pres.shapes.OVAL, { x, y: y + 0.05, w: 0.3, h: 0.3, fill: { color: i ? C.teal : C.amber }, line: { color: i ? C.teal : C.amber } });
    if (i < marcos.length - 1) s.addShape(pres.shapes.LINE, { x: x + 0.4, y: y + 0.2, w: w + g - 0.5, h: 0, line: { color: C.soft, width: 2 } });
    s.addText(t, { x, y: y + 0.45, w, h: 0.5, fontSize: 20, bold: true, color: C.teal, margin: 0, isTextBox: true });
    s.addText(d, { x, y: y + 0.95, w: w - 0.2, h: 0.8, fontSize: 14, color: C.ink, margin: 0, valign: "top", isTextBox: true });
  });
  stat(s, MX, 3.55, 3.85, "8,5 mi", "de PCs Windows afetados (estimativa da Microsoft)", C.amber, "Weston, 2024");
  stat(s, MX + 4.15, 3.55, 3.85, "21 × 20", "campos definidos × campos enviados ao interpretador", C.teal, "CrowdStrike, 2024");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX + 8.3, y: 3.55, w: W - 2 * MX - 8.3, h: 2.85, rectRadius: 0.08, fill: { color: C.tint }, line: { color: C.tint } });
  s.addText("Lições", { x: MX + 8.55, y: 3.7, w: 3.3, h: 0.45, fontSize: 18, bold: true, color: C.teal, margin: 0, isTextBox: true });
  bullets(s, ["Testes de fronteira", "Validar no sensor real", "Entrega progressiva com canário", "Cliente controla o ritmo"], MX + 8.55, 4.25, 3.3, 2.0, 14);
  notas(s, "Contexto: o sensor roda no kernel e recebe dois tipos de atualização: o sensor (código, com processo rigoroso) e o conteúdo de resposta rápida (configuração, entregue várias vezes ao dia). Ferramentas: Ishikawa + 5 porquês; um fluxograma do processo de liberação mostraria a falta do passo 'implantar em anel pequeno e observar'; um checklist de liberação com 'carregado no sensor real?' teria barrado o arquivo. O que funcionou: reversão rápida e transparência. O que falhou: tratar configuração como de menor risco.");
}
// ------------------------------------------------------------------ 15 caso 3
{
  const s = nova("CONTEUDO", "Caso 3 · Knight Capital (2012): o servidor esquecido");
  const w = 2.85, g = 0.25;
  stat(s, MX, 1.4, w, "45 min", "do pregão de 01/08/2012 até conter o erro", C.teal, undefined, 40);
  stat(s, MX + (w + g), 1.4, w, "4 mi", "de ordens enviadas ao mercado", C.teal, undefined, 40);
  stat(s, MX + 2 * (w + g), 1.4, w, "212", "ordens de clientes que deveriam ser executadas", C.teal, undefined, 40);
  stat(s, MX + 3 * (w + g), 1.4, w, "US$ 460 mi", "de prejuízo; multa de US$ 12 mi da SEC", C.amber, "SEC, 2013", 40);
  card(s, MX, 3.95, 5.95, 2.5, "O que aconteceu", "Deploy manual em 8 servidores: 1 ficou com o código antigo. Uma flag reaproveitada reativou o \"Power Peg\", código morto havia anos. Alertas automáticos por e-mail foram ignorados.", { bodySize: 14 });
  card(s, MX + 6.25, 3.95, W - 2 * MX - 6.25, 2.5, "O que teria evitado", "Folha de verificação de implantação (1 linha por servidor, versão conferida), deploy automatizado, remoção de código morto e plano de resposta a incidentes.", { bodySize: 14, headColor: C.amber });
  notas(s, "Fonte: ordem da SEC de 16/10/2013 (Release 34-70694). No Ishikawa: Método (deploy manual, sem segunda pessoa conferindo), Material (código morto e flag reaproveitada), Medição (nenhuma verificação automática de versão nos 8 servidores) e Pessoas (alertas ignorados). A empresa foi adquirida meses depois. A falha não foi de programação, mas da ausência de processo de qualidade em volta do código.");
}
// ------------------------------------------------------------------ 16 PDCA
{
  const s = nova("CONTEUDO", "Plano de melhoria contínua (PDCA)", "Conclusão");
  const H = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.teal } } });
  const rows = [
    [H("Problema (evidência)"), H("Ação (Do)"), H("Indicador e meta (Check)"), H("Padronizar (Act)")],
    ["Backlog cresce todo ano", "Rodízio de triagem; good first issue", "Saldo mensal ≤ 0 em 6 meses", "Triagem no CONTRIBUTING"],
    ["60% dos bugs sem plataforma", "Issue form com campos obrigatórios", "≥ 95% classificados", "Formulário = folha oficial"],
    ["Android + Linux = 48%", "Testes automatizados de rede e permissões", "−30% bugs em 2 trimestres", "Pareto a cada trimestre"],
    ["15% dos PRs > 72 h", "PR parado há 14 dias é revisado ou fechado", "P85 do lead time ≤ 48 h", "SLE publicado"],
    ["Configuração sem teste (CrowdStrike)", "Configuração como código + canário", "100% das liberações em anéis", "Item da DoD"],
    ["Deploy manual (Knight)", "Pipeline automatizado + checklist de versão", "0 servidores divergentes", "Pipeline como única via"],
  ].map((r, i) => i === 0 ? r : r.map((c) => ({ text: c, options: i % 2 === 0 ? { fill: { color: C.tint } } : {} })));
  s.addTable(rows, { x: MX, y: 1.4, w: W - 2 * MX, colW: [3.0, 3.3, 3.0, W - 2 * MX - 9.3], fontSize: 14, color: C.ink, border: { type: "solid", pt: 0.5, color: "D9E2E5" }, rowH: 0.62, margin: 0.08, valign: "middle" });
  s.addText("Check: acompanhar os indicadores com gráfico de controle, a sétima ferramenta.", { x: MX, y: 6.15, w: W - 2 * MX, h: 0.45, fontSize: 14, italic: true, color: C.muted, margin: 0, isTextBox: true });
  notas(s, "Cada linha liga um problema encontrado por uma ferramenta a uma ação, um indicador com meta e uma forma de padronizar (o Act do PDCA). A melhoria contínua depende de indicadores acompanhados no tempo (Fernandes; Abreu, 2014). Pergunta provável: 'como saber se a ação funcionou?' Resposta: repetir a mesma ferramenta (Pareto trimestral, histograma do lead time) e acompanhar com gráfico de controle.");
}
// ------------------------------------------------------------------ 17 conclusão
{
  const s = nova("ESCURO", "O que levamos deste trabalho");
  const msgs = [
    ["Dados derrubam crenças", "PR grande não era o gargalo; a triagem era."],
    ["Ferramentas rendem em conjunto", "Fluxograma diz onde medir; Pareto, o que atacar; Ishikawa, por quê."],
    ["Ágil precisa de medição", "TDD, CI e DoD só melhoram o que é acompanhado com indicadores."],
  ];
  msgs.forEach(([t, d], i) => {
    const y = 3.0 + i * 1.25;
    s.addShape(pres.shapes.OVAL, { x: MX, y: y + 0.05, w: 0.55, h: 0.55, fill: { color: C.amber }, line: { color: C.amber } });
    s.addText(String(i + 1), { x: MX, y: y + 0.05, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(t, { x: MX + 0.8, y, w: 11, h: 0.5, fontSize: 22, bold: true, color: C.white, margin: 0, isTextBox: true });
    s.addText(d, { x: MX + 0.8, y: y + 0.5, w: 11, h: 0.5, fontSize: 16, color: C.soft, margin: 0, isTextBox: true });
  });
  notas(s, "Fechamento: retomar a pergunta do início (onde a qualidade se perde?). No LocalSend, na triagem e na capacidade de correção; na CrowdStrike e na Knight, no processo de implantação. Em todos os casos as ferramentas clássicas foram suficientes para enxergar o problema.");
}
// ------------------------------------------------------------------ 18 referências
{
  const s = nova("CONTEUDO", "Referências principais");
  const refs = [
    "BARTIÉ, A. Garantia da qualidade de software. Elsevier, 2002.",
    "TELES, V. M. Extreme programming. Novatec, 2004.",
    "PFLEEGER, S. L. Engenharia de software: teoria e prática. 2. ed. Pearson, 2003.",
    "GALLOTTI, G. M. A. (org.). Qualidade de software. Pearson, 2015.",
    "FÉLIX, R. (org.). Teste de software. Pearson, 2016.",
    "FERNANDES, A. A.; ABREU, V. F. Implantando a governança de TI. Brasport, 2014.",
    "ISHIKAWA, K. Guide to quality control. APO, 1986.",
    "SCHWABER, K.; SUTHERLAND, J. The Scrum Guide, 2020.",
    "VACANTI, D. Actionable agile metrics for predictability, 2015.",
    "NAGAPPAN, N. et al. TDD in four industrial teams. EMSE, 2008.",
    "SADOWSKI, C. et al. Modern code review at Google. ICSE-SEIP, 2018.",
    "NAGAPPAN, N.; BALL, T. Code churn and defect density. ICSE, 2005.",
    "DORA. Accelerate State of DevOps Report, 2024.",
    "BALLMER, S. Memo to Microsoft customers, out. 2002.",
    "CROWDSTRIKE. Channel File 291: root cause analysis, 2024.",
    "WESTON, D. Helping our customers through the CrowdStrike outage, 2024.",
    "SEC. In the matter of Knight Capital Americas LLC, 2013.",
    "LOCALSEND. github.com/localsend/localsend, acesso em 15/11/2026.",
  ];
  const meio = Math.ceil(refs.length / 2);
  [refs.slice(0, meio), refs.slice(meio)].forEach((col, k) => {
    s.addText(col.map((t, i) => ({ text: t, options: { breakLine: i < col.length - 1 } })), { x: MX + k * 6.2, y: 1.4, w: 5.9, h: 5.4, fontSize: 14, color: C.ink, paraSpaceAfter: 6, margin: 0, valign: "top", isTextBox: true });
  });
  notas(s, "Lista completa, em ABNT, no relatório em PDF. A bibliografia básica e complementar do plano de ensino está na coluna da esquerda; à direita, as fontes atualizadas usadas nos exemplos reais.");
}
// ------------------------------------------------------------------ 19 perguntas
{
  const s = nova("ESCURO", "Perguntas?");
  s.addText(INTEGRANTES.join("  ·  "), { x: MX, y: 3.1, w: W - 2 * MX, h: 0.5, fontSize: 16, color: C.white, margin: 0, isTextBox: true });
  s.addText("Dados e scripts reproduzíveis na pasta _apoio · relatório completo em PDF", { x: MX, y: 3.7, w: W - 2 * MX, h: 0.45, fontSize: 14, color: C.soft, margin: 0, isTextBox: true });
  notas(s, "Perguntas prováveis e respostas curtas:\n1) Por que Spearman e não Pearson? Porque os dados são muito assimétricos; Spearman usa a ordem e não é dominado por poucos valores extremos.\n2) O Pareto não deu 80/20 exato, está errado? Não: 80/20 é uma regra empírica; aqui 40% das categorias somam ~80%, o que já permite priorizar.\n3) Os dados são confiáveis? São públicos e brutos do GitHub; limitações: só PRs mesclados, rótulos incompletos e 2026 ainda não terminou.\n4) Por que média não serve no histograma? A cauda longa puxa a média para 114 h, enquanto o PR típico leva 7 h.\n5) Qual ferramenta resolveria o caso Knight? Uma folha de verificação de implantação, além de automação do deploy.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("gerado:", OUT);
})();
