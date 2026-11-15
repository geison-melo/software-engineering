// Gera a apresentação do seminário (Trabalho N3 - Qualidade de Software).
// Uso: python gerar_fundos.py && TEMA=slides python analisar_dados.py && node gerar_slides.js
// Nomes da equipe: edite INTEGRANTES abaixo.
//
// Estilo "folha de inspeção de engenharia": papel quadriculado técnico, carimbo de folha no rodapé
// (como em desenho técnico), fichas de formulário com cantos retos, etiquetas monoespaçadas,
// marca-texto amarelo nos números-chave e um único vermelho de carimbo como destaque.
// Fontes do Windows: Bahnschrift (títulos e números), Segoe UI (texto) e Consolas (etiquetas).
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./apply_theme.js");

const INTEGRANTES = ["Gabriel Massaia de Oliveira", "Geison Carlos Melo", "Leonardo Mateus Anders", "Thiago Luis Lombardi Maes"];
const TURMA = "5º semestre (2026/2)";

const S = JSON.parse(fs.readFileSync(path.join(__dirname, "dados", "stats.json"), "utf8"));
const FIG = (f) => path.join(__dirname, "figuras_slides", f);
const OUT = path.join(__dirname, "..", "Apresentação N3 - Ferramentas da Qualidade.pptx");
const br = (v, c = 1) => v.toFixed(c).replace(".", ",");
const TOTAL = 19;

const C = { ink: "1B1F23", mid: "5C6670", red: "D9411E", yel: "FFD23F", hair: "B9C1C8", white: "FFFFFF", fog: "C4CBD1", dim: "8A949D", ghost: "2A3036", redTint: "FBE4DC" };
const F = { head: "Bahnschrift SemiBold", body: "Segoe UI", mono: "Consolas" };
const THEME = {
  name: "Folha de inspeção", headFontFace: F.head, bodyFontFace: F.body,
  colors: { dk1: C.ink, lt1: C.white, dk2: C.ink, lt2: "EEF1F4", accent1: C.ink, accent2: C.red, accent3: C.yel, accent4: C.mid, accent5: C.hair, accent6: "8A949D", hlink: C.red, folHlink: C.mid },
};
const W = 13.333, MX = 0.6;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: F.head, bodyFontFace: F.body };
pres.title = "Ferramentas da qualidade na engenharia de software";
pres.subject = "Qualidade de Software - Trabalho N3";

// ------------------------------------------------------------------ layouts
const CB = { x: 8.23, y: 6.93, w: 4.5, h: 0.36 };   // carimbo (legenda de folha)
pres.defineSlideMaster({
  title: "FOLHA",
  background: { path: FIG("fundo_claro.png") },
  objects: [
    { text: { text: "CATÓLICA SC · ENGENHARIA DE SOFTWARE", options: { x: MX, y: 6.95, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10, color: C.mid, margin: 0, valign: "middle" } } },
    { rect: { x: CB.x, y: CB.y, w: CB.w, h: CB.h, fill: { color: C.white }, line: { color: C.ink, width: 0.75 } } },
    { line: { x: CB.x + 2.55, y: CB.y, w: 0, h: CB.h, line: { color: C.ink, width: 0.75 } } },
    { line: { x: CB.x + 3.65, y: CB.y, w: 0, h: CB.h, line: { color: C.ink, width: 0.75 } } },
    { text: { text: "QUALIDADE DE SOFTWARE · N3", options: { x: CB.x + 0.08, y: CB.y, w: 2.45, h: CB.h, fontFace: F.mono, fontSize: 10, color: C.ink, margin: 0, valign: "middle" } } },
    { text: { text: "FOLHA", options: { x: CB.x + 2.62, y: CB.y, w: 0.5, h: CB.h, fontFace: F.mono, fontSize: 10, color: C.mid, margin: 0, valign: "middle" } } },
    { text: { text: `/${TOTAL}`, options: { x: CB.x + 3.38, y: CB.y, w: 0.27, h: CB.h, fontFace: F.mono, fontSize: 10, color: C.ink, margin: 0, valign: "middle" } } },
    { text: { text: "2026/2", options: { x: CB.x + 3.65, y: CB.y, w: 0.85, h: CB.h, fontFace: F.mono, fontSize: 10, color: C.ink, margin: 0, valign: "middle", align: "center" } } },
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.62, w: W - 2 * MX, h: 0.8, fontFace: F.head, fontSize: 30, color: C.ink, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: CB.x + 2.98, y: CB.y, w: 0.4, h: CB.h, fontFace: F.mono, fontSize: 10, color: C.ink, align: "right", valign: "middle", margin: 0 },
});
pres.defineSlideMaster({
  title: "ESCURO",
  background: { path: FIG("fundo_escuro.png") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 1.15, w: 8.6, h: 1.7, fontFace: F.head, fontSize: 42, color: C.white, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
});

// ------------------------------------------------------------------ peças do estilo
let secao = "";
function nova(layout, titulo, sec) {
  if (sec && sec !== secao) { pres.addSection({ title: sec }); secao = sec; }
  const s = pres.addSlide({ masterName: layout, sectionTitle: secao });
  if (titulo) s.addText(titulo, { placeholder: "title" });
  return s;
}
const notas = (s, t) => s.addNotes(t);
const txt = (s, t, o) => s.addText(t, { margin: 0, isTextBox: true, color: C.ink, fontFace: F.body, ...o });

// etiqueta de seção: "§ 05  HISTOGRAMA"
function tag(s, num, nome, escuro = false) {
  txt(s, [{ text: `§ ${num}`, options: { color: C.red, bold: true } }, { text: `   ${nome}`, options: { color: escuro ? C.dim : C.mid } }],
    { x: MX, y: 0.28, w: 9, h: 0.3, fontFace: F.mono, fontSize: 12, charSpacing: 1 });
}
// ficha de formulário: rótulo monoespaçado, filete, título e corpo
function ficha(s, x, y, w, h, rotulo, titulo, corpo, o = {}) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: o.fill || C.white }, line: { color: o.borda || C.ink, width: o.bordaW || 0.75 } });
  txt(s, rotulo, { x: x + 0.15, y: y + 0.08, w: w - 0.3, h: 0.3, fontFace: F.mono, fontSize: 10, color: o.rotCor || C.mid, valign: "middle" });
  s.addShape(pres.shapes.LINE, { x, y: y + 0.44, w, h: 0, line: { color: C.hair, width: 0.5 } });
  let yc = y + 0.58;
  if (titulo) { txt(s, titulo, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: 0.5, fontFace: F.head, fontSize: o.tamTit || 20, valign: "middle" }); yc = y + 1.12; }
  if (corpo) {
    const corpoTxt = Array.isArray(corpo) ? corpo.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < corpo.length - 1 } })) : corpo;
    txt(s, corpoTxt, { x: x + 0.2, y: yc, w: w - 0.4, h: y + h - yc - 0.12, fontSize: o.tam || 14, valign: "top", paraSpaceAfter: 5 });
  }
}
// número-chave com marca-texto amarelo atrás
function numero(s, x, y, w, grande, rotulo, fonte, o = {}) {
  const tam = o.tam || 48, k = tam / 48;
  const larg = Math.min(w, grande.length * 0.36 * k + 0.12);
  s.addShape(pres.shapes.RECTANGLE, { x: x - 0.06, y: y + 0.98 - 0.38 * k, w: larg, h: 0.3 * k, fill: { color: o.marca || C.yel }, line: { color: o.marca || C.yel } });
  txt(s, grande, { x, y, w, h: 1.0, fontFace: F.head, fontSize: tam, color: o.cor || C.ink, valign: "bottom" });
  txt(s, rotulo, { x, y: y + 1.08, w, h: o.hRot || 0.75, fontSize: 14, valign: "top" });
  if (fonte) txt(s, fonte, { x, y: y + 1.08 + (o.hRot || 0.75), w, h: 0.28, fontFace: F.mono, fontSize: 10, color: C.mid });
}
// figura colada na folha, com moldura e legenda "FIG. nn"
const DIM = { "fluxograma.png": [11, 7.2], "histograma.png": [9, 4.6], "dispersao.png": [9, 4.8], "pareto.png": [9, 4.8], "ishikawa.png": [12, 6.2] };
function figura(s, arq, x, y, w, legenda) {
  const h = w * DIM[arq][1] / DIM[arq][0];
  s.addShape(pres.shapes.RECTANGLE, { x: x - 0.08, y: y - 0.08, w: w + 0.16, h: h + 0.16, fill: { color: C.white }, line: { color: C.hair, width: 0.75 } });
  s.addImage({ path: FIG(arq), x, y, w, h, altText: legenda });
  txt(s, legenda, { x: x - 0.08, y: y + h + 0.14, w: w + 0.16, h: 0.28, fontFace: F.mono, fontSize: 10, color: C.mid });
  return h;
}
function moldura(s, x, y, w, h, legenda) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.white }, line: { color: C.hair, width: 0.75 } });
  txt(s, legenda, { x, y: y + h + 0.06, w, h: 0.28, fontFace: F.mono, fontSize: 10, color: C.mid });
}
// carimbo inclinado
function carimbo(s, x, y, w, h, texto, rot = -5) {
  s.addText(texto, { shape: pres.shapes.RECTANGLE, x, y, w, h, rotate: rot, line: { color: C.red, width: 2 }, fontFace: F.mono, bold: true, fontSize: 13, color: C.red, align: "center", valign: "middle", margin: 0.04 });
}
const eixo = {
  catAxisLabelColor: C.mid, valAxisLabelColor: C.mid, catAxisLabelFontSize: 11, valAxisLabelFontSize: 11,
  catAxisLabelFontFace: F.mono, valAxisLabelFontFace: F.mono, valGridLine: { color: "E3E8EC", size: 0.75 }, catGridLine: { style: "none" },
  dataLabelFontFace: F.head, dataLabelFontSize: 11, dataLabelColor: C.ink, titleFontFace: F.body, titleColor: C.ink, titleFontSize: 13,
  catAxisLineColor: C.ink, valAxisLineShow: false,
};
const cabT = (t, al) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.ink }, fontFace: F.mono, align: al || "left" } });

const L = S.lead, D = S.dispersao, PA = S.pareto, EB = S.estado_bugs;

// ------------------------------------------------------------------ 1 capa
{
  const s = nova("ESCURO", "Ferramentas da qualidade na engenharia de software", "Abertura");
  txt(s, "N3", { x: 8.3, y: 1.6, w: 4.9, h: 3.6, fontFace: F.head, fontSize: 250, color: C.ghost, align: "right", valign: "middle" });
  txt(s, `QUALIDADE DE SOFTWARE · TRABALHO N3 · FOLHA 01/${TOTAL}`, { x: MX, y: 0.55, w: 9, h: 0.3, fontFace: F.mono, fontSize: 12, color: C.dim, charSpacing: 1 });
  txt(s, "Da teoria aos dados reais: LocalSend, CrowdStrike e Knight Capital", { x: MX, y: 3.0, w: 8.6, h: 0.5, fontSize: 20, color: C.fog });
  txt(s, "EQUIPE", { x: MX, y: 4.2, w: 3, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.red, charSpacing: 2 });
  txt(s, INTEGRANTES.map((n, i) => ({ text: n, options: { breakLine: i < INTEGRANTES.length - 1 } })), { x: MX, y: 4.55, w: 7, h: 1.6, fontSize: 17, color: C.white, paraSpaceAfter: 3, valign: "top" });
  txt(s, `ENG. DE SOFTWARE · PROF. MARTIM DIETTERLE · TURMA ${TURMA.toUpperCase()} · 18/11/2026 · JARAGUÁ DO SUL – SC`, { x: MX, y: 6.75, w: W - 2 * MX, h: 0.3, fontFace: F.mono, fontSize: 11, color: C.dim });
  notas(s, "Abertura (quem apresenta: 1º integrante). Apresentar a equipe e a proposta: aplicar as ferramentas da qualidade a dados reais, e não só a exemplos inventados. O fio condutor é o LocalSend, o mesmo app avaliado no Trabalho N2, agora visto pelo lado do processo. O visual imita uma folha de inspeção de engenharia: cada slide é uma 'folha' numerada, como num relatório de qualidade.");
}
// ------------------------------------------------------------------ 2 fontes
{
  const s = nova("FOLHA", "Três fontes reais e uma pergunta: onde a qualidade se perde?");
  tag(s, "01", "INTRODUÇÃO");
  const y = 1.7, h = 2.85, w = 3.85, g = 0.3;
  ficha(s, MX, y, w, h, "FONTE 01 · DADOS PÚBLICOS", "LocalSend", `${S.n_prs} pull requests mesclados e ${S.n_bugs} issues de bug (2023–2026), coletados do GitHub em 15/11/2026. Base do fluxograma, histograma, dispersão, folha de verificação e Pareto.`);
  ficha(s, MX + w + g, y, w, h, "FONTE 02 · INCIDENTE 2024", "CrowdStrike", "A atualização Channel File 291 derrubou cerca de 8,5 milhões de PCs Windows. Base do diagrama de causa e efeito e dos 5 porquês.");
  ficha(s, MX + 2 * (w + g), y, w, h, "FONTE 03 · INCIDENTE 2012", "Knight Capital", "Implantação manual esquecida em 1 de 8 servidores: mais de US$ 460 milhões perdidos em 45 minutos.");
  txt(s, "ROTEIRO", { x: MX, y: 4.95, w: 3, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.red, charSpacing: 2 });
  const passos = ["§02  Qualidade no ágil", "§03–09  As ferramentas", "§10  Estudos de caso", "§11  Plano PDCA"];
  const pw = 2.75, pg = 0.4;
  passos.forEach((p, i) => {
    const x = MX + i * (pw + pg);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 5.35, w: pw, h: 0.6, fill: { color: C.white }, line: { color: C.ink, width: 0.75 } });
    txt(s, p, { x: x + 0.15, y: 5.35, w: pw - 0.3, h: 0.6, fontFace: F.mono, fontSize: 13, valign: "middle" });
    if (i < passos.length - 1) txt(s, "→", { x: x + pw, y: 5.35, w: pg, h: 0.6, fontSize: 18, color: C.red, align: "center", valign: "middle" });
  });
  notas(s, "Explicar por que o LocalSend: projeto real, código aberto, histórico público completo, e a equipe já o conhece do N2. Os dados foram extraídos pela API do GitHub; os scripts estão na pasta _apoio e reproduzem todos os números. CrowdStrike e Knight são casos de falha muito documentados (relatório oficial da empresa e ordem da SEC). As seções do deck (§) seguem a numeração do relatório em PDF.");
}
// ------------------------------------------------------------------ 3 ágil
{
  const s = nova("FOLHA", "No ágil, a qualidade é construída dentro do processo", "Qualidade no ágil");
  tag(s, "02", "QUALIDADE EM METODOLOGIAS ÁGEIS");
  const y = 1.7, h = 3.55, w = 3.85, g = 0.3;
  ficha(s, MX, y, w, h, "MÉTODO 01", "Scrum", ["Definition of Done: critério único de pronto", "Revisão da sprint inspeciona o produto", "Retrospectiva inspeciona o processo"], { tam: 16 });
  ficha(s, MX + w + g, y, w, h, "MÉTODO 02", "Kanban", ["Fluxo visível e WIP limitado", "Políticas explícitas por coluna (ex.: só sai de Revisão com aprovação)", "Tempo de ciclo medido e analisado"], { tam: 16 });
  ficha(s, MX + 2 * (w + g), y, w, h, "MÉTODO 03", "XP", ["TDD e testes automatizados", "Integração contínua", "Programação em par e refatoração", "Releases pequenas"], { tam: 16 });
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 5.6, w: W - 2 * MX, h: 0.75, fill: { color: C.yel }, line: { color: C.yel } });
  txt(s, [{ text: "Em comum: feedback rápido. ", options: { bold: true } }, { text: "O defeito é achado no mesmo ciclo em que nasce, quando ainda é barato corrigir (Teles, 2004)." }],
    { x: MX + 0.25, y: 5.6, w: W - 2 * MX - 0.5, h: 0.75, fontSize: 16, valign: "middle" });
  notas(s, "Scrum: a DoD é o contrato de qualidade do time; item fora da DoD não é apresentado como pronto (Scrum Guide 2020). Kanban: limitar o WIP reduz troca de contexto e expõe gargalos; as métricas de fluxo usam histograma e dispersão (Vacanti, 2015). XP: é o método com mais práticas técnicas de qualidade (Beck; Andres, 2004; Teles, 2004). Pergunta provável: 'qual método garante mais qualidade?' Resposta: nenhum sozinho; o que garante é a prática técnica + a medição.");
}
// ------------------------------------------------------------------ 4 evidências
{
  const s = nova("FOLHA", "As práticas funcionam, e há números para provar");
  tag(s, "02", "QUALIDADE EM METODOLOGIAS ÁGEIS");
  const w = 2.85, g = 0.25, y = 1.65;
  numero(s, MX, y, w, "40–90%", "menos defeitos antes da entrega em times com TDD", "Microsoft e IBM · Nagappan, 2008");
  numero(s, MX + (w + g), y, w, "< 4 h", "mediana do tempo de revisão de código", "Google · Sadowski, 2018");
  numero(s, MX + 2 * (w + g), y, w, "~5%", "de falha de mudanças no grupo de elite, com lead time < 1 dia", "DORA, 2024");
  numero(s, MX + 3 * (w + g), y, w, `${br(L.ate_24h_pct, 0)}%`, "dos PRs do LocalSend mesclados em até 24 h (CI + revisão)", "GitHub, 15/11/2026", { cor: C.red });
  ficha(s, MX, 4.45, W - 2 * MX, 1.85, "NOTA DO INSPETOR · ANÁLISE CRÍTICA", null,
    "O TDD custou de 15% a 35% mais tempo inicial, e os estudos são de caso, não experimentos controlados. No LocalSend, integrar é rápido, mas isso não garante que os bugs sejam corrigidos rápido: o backlog cresce todo ano (caso 1).",
    { rotCor: C.red, tam: 16 });
  notas(s, "Microsoft/IBM: quatro produtos, times com e sem TDD sob o mesmo gerente; densidade de defeitos pré-release 40% a 90% menor. Google: mudanças pequenas (mediana ~24 linhas) e revisão leve. DORA 2024: elite implanta sob demanda, lead time < 1 dia, ~5% de falha de mudanças e recuperação < 1 h. LocalSend: mediana de 24 linhas por PR, igual ao Google, e 72% mesclados em 24 h.");
}
// ------------------------------------------------------------------ 5 ferramentas
{
  const s = nova("FOLHA", "Sete ferramentas, cada uma responde a uma pergunta", "Ferramentas da qualidade");
  tag(s, "03", "FERRAMENTAS DA QUALIDADE");
  const itens = [
    ["Fluxograma", "ENTENDER O PROCESSO", "Como o trabalho realmente flui?"],
    ["Folha de verificação", "COLETA DE DADOS", "Quantas vezes e onde ocorre?"],
    ["Histograma", "VARIAÇÃO", "Como os valores se distribuem?"],
    ["Dispersão", "RELAÇÃO", "Duas variáveis andam juntas?"],
    ["Pareto", "PRIORIZAÇÃO", "Quais poucas causas pesam mais?"],
    ["Causa e efeito", "CAUSA-RAIZ", "Por que o problema acontece?"],
    ["Gráfico de controle", "MONITORAMENTO", "O processo está estável?"],
    ["Complementares", "CAUSA E PLANO", "5 porquês, 5W2H, GUT, PDCA"],
  ];
  const cw = (W - 2 * MX) / 4, ch = 2.1, y0 = 1.65;
  itens.forEach(([n, cat, q], i) => {
    const x = MX + (i % 4) * cw, y = y0 + Math.floor(i / 4) * ch, aplicada = i < 6;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: C.white }, line: { color: C.ink, width: 0.75 } });
    txt(s, cat, { x: x + 0.18, y: y + 0.14, w: cw - 0.75, h: 0.28, fontFace: F.mono, fontSize: 10, color: aplicada ? C.red : C.mid });
    txt(s, String(i + 1).padStart(2, "0"), { x: x + cw - 0.6, y: y + 0.14, w: 0.42, h: 0.28, fontFace: F.mono, fontSize: 10, color: C.mid, align: "right" });
    txt(s, n, { x: x + 0.18, y: y + 0.52, w: cw - 0.36, h: 0.5, fontFace: F.head, fontSize: 20, color: aplicada ? C.ink : C.mid });
    txt(s, q, { x: x + 0.18, y: y + 1.1, w: cw - 0.36, h: 0.85, fontSize: 15, color: aplicada ? C.ink : C.mid, valign: "top" });
  });
  txt(s, [{ text: "01–06 aplicadas com dados reais neste trabalho.  ", options: { fontFace: F.mono, fontSize: 11, color: C.red } },
    { text: "Ishikawa: até 95% dos problemas de qualidade se resolvem com as ferramentas básicas (Ishikawa, 1985). Limite: dependem de dados bem coletados.", options: { italic: true, color: C.mid } }],
    { x: MX, y: 6.05, w: W - 2 * MX, h: 0.6, fontSize: 13, valign: "top" });
  notas(s, "Origem: Kaoru Ishikawa reuniu as sete ferramentas básicas para que qualquer pessoa da empresa resolvesse a maior parte dos problemas de qualidade (Ishikawa, 1986). A classificação é por finalidade dentro do ciclo PDCA. As seis primeiras são as pedidas no trabalho e foram construídas com dados reais; o gráfico de controle fica como trabalho futuro para acompanhar o plano de ação.");
}
// ------------------------------------------------------------------ 6 fluxograma
{
  const s = nova("FOLHA", "Fluxograma: o gargalo está antes do pull request");
  tag(s, "04", "FLUXOGRAMA");
  figura(s, "fluxograma.png", MX + 0.08, 1.7, 7.15, "FIG. 01 · CICLO DE VIDA DE UM BUG · GITHUB LOCALSEND, 15/11/2026");
  const x = 8.35, w = W - x - MX;
  numero(s, x, 1.55, w, `${br(100 * EB.abertos / S.n_bugs, 0)}%`, `das ${S.n_bugs} issues de bug ainda estão dentro do fluxo (${EB.abertos} abertas)`, null, { cor: C.red });
  ficha(s, x, 3.55, w, 2.95, "LEITURA DO FLUXO", null, [
    `Corrigir leva ${br(S.bug_fechamento_mediana_dias)} dias (mediana); mesclar o PR leva ${br(L.mediana_h)} h`,
    "Retrabalho em 3 laços: falta de informação, CI reprovada e revisão",
    "Indústria: o ciclo de vida do Bugzilla (Mozilla) explicita quem age em cada estado",
  ]);
  notas(s, "Como foi construído: a partir dos rótulos públicos (needs-more-info, duplicate, wontfix, bug, plataforma) e dos motivos de fechamento do GitHub. Interpretação: CI e revisão são portões fortes; a triagem é manual e acumula fila. Crítica: o processo não está documentado; os estados ficam implícitos nos rótulos. Melhoria: publicar o fluxo no CONTRIBUTING e tornar cada decisão um rótulo obrigatório. Justificativa: sem o fluxograma não saberíamos onde medir.");
}
// ------------------------------------------------------------------ 7 histograma
{
  const s = nova("FOLHA", "Histograma: a média esconde a cauda longa");
  tag(s, "05", "HISTOGRAMA");
  const cls = Object.keys(S.hist_classes), vals = Object.values(S.hist_classes);
  const rot = cls.map((c) => c === ">=72h" ? "≥72" : c.replace("h", ""));
  moldura(s, MX, 1.62, 7.75, 4.85, "FIG. 02 · LEAD TIME DOS PRS EM CLASSES DE 6 H · GITHUB LOCALSEND, 15/11/2026");
  s.addChart(pres.charts.BAR, [
    { name: "até 72 h", labels: rot, values: vals.map((v, i) => i < vals.length - 1 ? v : 0) },
    { name: "72 h ou mais", labels: rot, values: vals.map((v, i) => i === vals.length - 1 ? v : 0) },
  ], {
    x: MX + 0.1, y: 1.7, w: 7.55, h: 4.7, barDir: "col", barGrouping: "stacked", barGapWidthPct: 12,
    chartColors: [C.ink, C.red], showLegend: false, showValue: false,
    showTitle: true, title: `PRs mesclados por lead time (n = ${S.n_prs})`,
    showCatAxisTitle: true, catAxisTitle: "horas da abertura ao merge", catAxisTitleFontSize: 11, catAxisTitleColor: C.mid, catAxisTitleFontFace: F.mono,
    showValAxisTitle: true, valAxisTitle: "PRs", valAxisTitleFontSize: 11, valAxisTitleColor: C.mid, valAxisTitleFontFace: F.mono, ...eixo,
  });
  const x = 8.75, w = W - x - MX;
  numero(s, x, 1.55, w, `${br(L.mediana_h)} h`, "mediana: o PR típico", null, { hRot: 0.4 });
  numero(s, x, 3.0, w, `${br(L.media_h)} h`, "média: inflada pelos 15% que passam de 3 dias", null, { cor: C.red, marca: C.redTint, hRot: 0.7 });
  ficha(s, x, 4.85, w, 1.65, "PREVISÃO ESTILO KANBAN", null, `85% dos PRs entram em até ${br(L.p85_h, 0)} h. Limite: só PRs mesclados entram (viés de sobrevivência).`, { tam: 13 });
  notas(s, `Distribuição assimétrica à direita: ${S.hist_classes["0-6h"]} PRs nas primeiras 6 h e ${S.hist_classes[">=72h"]} acima de 72 h. Média (${br(L.media_h)} h) quase 16 vezes a mediana (${br(L.mediana_h)} h): não serve como meta. Percentis: P25 ${br(L.p25_h)} h, P75 ${br(L.p75_h)} h, P85 ${br(L.p85_h)} h. Uso na indústria: times Kanban publicam 'X% dos itens em até N dias' a partir do percentil do histograma (Vacanti, 2015); o DORA trata lead time como métrica central. Justificativa: a pergunta era sobre variação, não sobre um número médio.`);
}
// ------------------------------------------------------------------ 8 dispersão
{
  const s = nova("FOLHA", "Dispersão: PR maior não demora mais para entrar");
  tag(s, "06", "DIAGRAMA DE DISPERSÃO");
  figura(s, "dispersao.png", MX + 0.08, 1.7, 7.6, "FIG. 03 · TAMANHO DO PR × LEAD TIME (LOG-LOG) · GITHUB LOCALSEND, 15/11/2026");
  const x = 8.75, w = W - x - MX;
  numero(s, x, 1.55, w, `ρ = ${br(D.spearman, 2)}`, "Spearman entre tamanho e lead time: correlação praticamente nula", null, { cor: C.red, tam: 44, hRot: 0.7 });
  const pf = D.por_faixa;
  const lin = [["< 10 linhas", "0-10"], ["10–99", "10-100"], ["100–999", "100-1000"], ["≥ 1.000", "1000-inf"]].map(([r, k], i) =>
    [r, { text: String(pf[k].n), options: { align: "center" } }, { text: `${br(pf[k].mediana_h)} h`, options: { align: "center", bold: i === 3 } }]);
  s.addTable([[cabT("TAMANHO"), cabT("PRs", "center"), cabT("MEDIANA", "center")], ...lin],
    { x, y: 3.45, w, colW: [1.55, 0.85, w - 2.4], fontSize: 13, color: C.ink, fontFace: F.body, fill: { color: C.white }, border: { type: "solid", pt: 0.75, color: C.ink }, rowH: 0.36, margin: 0.05 });
  txt(s, "Microsoft: churn × defeitos separou binários propensos a falha com 89% de acerto (Nagappan; Ball, 2005).", { x, y: 5.4, w, h: 1.1, fontSize: 13, italic: true, color: C.mid, valign: "top" });
  notas(s, `Hipótese testada: PRs maiores demoram mais. Resultado: Spearman ${br(D.spearman, 2)}, reta quase horizontal em escala log-log. O Pearson bruto (${br(D.pearson_bruto, 2)}) parece indicar relação fraca, mas é inflado por poucos PRs gigantes: exemplo de por que usar Spearman em dados assimétricos. Só os PRs de 1.000+ linhas (16 casos) demoram claramente mais. Conclusão: dividir PRs não aceleraria o merge; o tempo depende de quem revisa e quando. Correlação não é causa. Melhoria: testar outras variáveis (revisores, comentários, horário).`);
}
// ------------------------------------------------------------------ 9 folha de verificação
{
  const s = nova("FOLHA", "Folha de verificação: os dados mostram tendência e lacuna");
  tag(s, "07", "FOLHA DE VERIFICAÇÃO");
  const anos = ["2023", "2024", "2025", "2026"];
  const linhas = Object.entries(S.folha).slice(0, 7).map(([n, v]) =>
    [n, ...anos.map((a) => ({ text: String(v[a]), options: { align: "center" } })), { text: String(anos.reduce((t, a) => t + v[a], 0)), options: { align: "center", bold: true } }]);
  s.addTable([[cabT("PLATAFORMA"), ...anos.map((a) => cabT(a, "center")), cabT("TOTAL", "center")], ...linhas],
    { x: MX, y: 1.7, w: 6.7, colW: [1.9, 0.96, 0.96, 0.96, 0.96, 0.96], fontSize: 14, color: C.ink, fontFace: F.body, fill: { color: C.white }, border: { type: "solid", pt: 0.75, color: C.ink }, rowH: 0.42, margin: 0.06 });
  txt(s, "FOLHA DE CONTAGEM · BUGS POR PLATAFORMA E ANO · GITHUB LOCALSEND (2026 ATÉ 15/11)", { x: MX, y: 5.12, w: 6.7, h: 0.28, fontFace: F.mono, fontSize: 10, color: C.mid });
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 5.55, w: 6.7, h: 0.95, fill: { color: C.yel }, line: { color: C.yel } });
  txt(s, `Linux cresce (13 → 19) e Windows cai (19 → 5). Só ${PA.bugs_com_componente} de ${S.n_bugs} bugs (${br(100 * PA.bugs_com_componente / S.n_bugs, 0)}%) têm plataforma registrada.`,
    { x: MX + 0.2, y: 5.55, w: 6.3, h: 0.95, fontSize: 15, bold: true, valign: "middle" });
  const x = 7.65, w = W - x - MX;
  ficha(s, x, 1.7, w, 4.8, "CHECKLIST · REVISÃO DE PR (DoD)", "Antes do merge", null);
  const ck = ["Issue vinculada e com plataforma", "CI verde nas plataformas afetadas", "Teste que falha sem a correção", "Testado na plataforma do bug", "Escopo único, sem misturar mudanças", "Sem segredos ou dados pessoais", "Aprovado por um mantenedor"];
  ck.forEach((t, i) => {
    const yy = 2.95 + i * 0.44;
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.22, y: yy + 0.07, w: 0.22, h: 0.22, fill: { color: C.white }, line: { color: C.ink, width: 1 } });
    txt(s, t, { x: x + 0.6, y: yy, w: w - 0.8, h: 0.36, fontSize: 14, valign: "middle" });
  });
  txt(s, "Inspiração: inspeções de Fagan (IBM) e guia de revisão do Google", { x: x + 0.22, y: 6.08, w: w - 0.4, h: 0.32, fontSize: 11, italic: true, color: C.mid });
  notas(s, "Dois formatos de folha: a de contagem (tabela, dados reais) e o checklist (proposta de DoD para o LocalSend). A contagem por ano mostra tendências que o total esconde e revela um problema de coleta: 60% das issues de bug não têm rótulo de plataforma. Melhoria: tornar a plataforma obrigatória no formulário de issue do GitHub; o formulário vira a própria folha. Exemplo real: inspeções formais de Fagan na IBM (1976) usam checklists por tipo de artefato.");
}
// ------------------------------------------------------------------ 10 pareto
{
  const s = nova("FOLHA", "Pareto: quatro plataformas concentram ~80% dos bugs");
  tag(s, "08", "GRÁFICO DE PARETO");
  const lab = PA.itens.map((i) => i[0]);
  moldura(s, MX, 1.62, 7.75, 4.85, `FIG. 04 · BUGS POR PLATAFORMA (${PA.total_rotulos} RÓTULOS) · GITHUB LOCALSEND, 15/11/2026`);
  s.addChart([
    { type: pres.charts.BAR, data: [{ name: "bugs", labels: lab, values: PA.itens.map((i) => i[1]) }], options: { chartColors: [C.ink], barGapWidthPct: 25 } },
    { type: pres.charts.LINE, data: [{ name: "% acumulado", labels: lab, values: PA.acumulado }], options: { chartColors: [C.red], lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 7, secondaryValAxis: true, secondaryCatAxis: true } },
  ], {
    x: MX + 0.1, y: 1.7, w: 7.55, h: 4.7, showLegend: true, legendPos: "b", legendFontSize: 11, legendFontFace: F.mono, legendColor: C.mid,
    showTitle: true, title: "Issues de bug por plataforma/componente",
    valAxes: [
      { showValAxisTitle: true, valAxisTitle: "bugs", valAxisTitleFontSize: 11, valAxisTitleColor: C.mid, valAxisTitleFontFace: F.mono, valAxisMinVal: 0 },
      { showValAxisTitle: true, valAxisTitle: "% acumulado", valAxisTitleFontSize: 11, valAxisTitleColor: C.mid, valAxisTitleFontFace: F.mono, valAxisMinVal: 0, valAxisMaxVal: 100, valGridLine: { style: "none" } },
    ],
    catAxes: [{ catAxisTitle: "" }, { catAxisHidden: true }],
    ...eixo,
  });
  const x = 8.75, w = W - x - MX;
  numero(s, x, 1.55, w, `${br(PA.acumulado[3], 0)}%`, "em 4 de 10 categorias: Android, Linux, Windows e macOS", null, { hRot: 0.7 });
  numero(s, x, 3.3, w, `${br(PA.acumulado[1], 0)}%`, "só em Android + Linux", null, { cor: C.red, marca: C.redTint, hRot: 0.4 });
  carimbo(s, x + 0.1, 4.95, 3.1, 0.5, "PRIORIDADE: ANDROID + LINUX");
  txt(s, "Microsoft, 2002: 20% dos bugs causavam 80% dos erros (Ballmer, 2002). Limite: conta rótulos, não impacto.", { x, y: 5.65, w, h: 0.9, fontSize: 12, italic: true, color: C.mid, valign: "top" });
  notas(s, `Acumulado: ${PA.acumulado.slice(0, 5).map((v) => br(v)).join("%, ")}%. Não é um 80/20 perfeito (40% das categorias somam ~80%), o que é esperado em app multiplataforma. Decisão: atacar Android e Linux primeiro e investigar a alta de Linux (distribuições e pacotes variados). Exemplo real: Windows Error Reporting da Microsoft, 2002 (20% dos bugs → 80% dos erros; 1% → metade). Melhoria: Pareto ponderado por impacto (usuários afetados, reações, severidade) e repetido por trimestre.`);
}
// ------------------------------------------------------------------ 11 ishikawa
{
  const s = nova("FOLHA", "Causa e efeito: a falha da CrowdStrike teve várias causas", "Causa-raiz");
  tag(s, "09", "DIAGRAMA DE CAUSA E EFEITO");
  figura(s, "ishikawa.png", MX + 0.08, 1.7, 8.75, "FIG. 05 · ISHIKAWA 6M · CROWDSTRIKE (2024) E WESTON (2024)");
  const x = 9.75, w = W - x - MX;
  ficha(s, x, 1.62, w, 4.85, "LEITURA DO DIAGRAMA", "6 ramos, 12 causas", [
    "Ramos mais carregados: Medição/Testes e Método/Processo",
    "21 campos definidos, 20 enviados",
    "Nenhuma causa isolada explicaria o efeito",
  ], { tam: 14, tamTit: 18 });
  notas(s, "Explicar o 6M adaptado ao software (processo, testes, software, dados, pessoas, ambiente). Dados do relatório oficial de 06/08/2024: o template definia 21 campos e a integração enviava 20; o validador tinha erro de lógica; o interpretador não checava limites do array; o conteúdo ia para todos os clientes de uma vez. Microsoft estimou ~8,5 milhões de dispositivos (menos de 1% do Windows, mas em empresas críticas).");
}
// ------------------------------------------------------------------ 12 cinco porquês
{
  const s = nova("FOLHA", "5 porquês: a causa-raiz foi de processo, não de código");
  tag(s, "09", "DIAGRAMA DE CAUSA E EFEITO");
  const passos = [
    ["Por que travou?", "Leitura fora do array no kernel"],
    ["Por que fora do array?", "21 campos definidos, 20 enviados, sem checagem de limites"],
    ["Por que foi aprovado?", "Validador com erro de lógica; teste sem caso de fronteira"],
    ["Por que atingiu todos?", "Entrega a toda a base de uma vez, sem canário"],
    ["Por que sem canário?", "Conteúdo tratado como configuração, não como código"],
  ];
  const w = 2.2, g = 0.28, y = 1.75, h = 3.05;
  passos.forEach(([p, r], i) => {
    const x = MX + i * (w + g), ult = i === passos.length - 1;
    ficha(s, x, y, w, h, `PORQUÊ ${i + 1}`, null, null, { borda: ult ? C.red : C.ink, bordaW: ult ? 2 : 0.75, rotCor: ult ? C.red : C.mid, fill: ult ? C.redTint : C.white });
    txt(s, p, { x: x + 0.18, y: y + 0.6, w: w - 0.36, h: 0.85, fontFace: F.head, fontSize: 17, valign: "top" });
    txt(s, r, { x: x + 0.18, y: y + 1.5, w: w - 0.36, h: 1.45, fontSize: 14, valign: "top" });
    if (i < passos.length - 1) txt(s, "→", { x: x + w, y: y + 1.2, w: g, h: 0.5, fontSize: 18, color: C.red, align: "center", valign: "middle" });
  });
  carimbo(s, MX + 4 * (w + g) + 0.15, 1.35, 1.9, 0.48, "CAUSA-RAIZ", -6);
  ficha(s, MX, 5.15, W - 2 * MX, 1.35, "AÇÕES ANUNCIADAS PELA EMPRESA", null, "Checagem de limites no interpretador, novos testes no validador, implantação em anéis com canário e controle do cliente sobre o ritmo das atualizações (CrowdStrike, 2024).", { tam: 15 });
  notas(s, "Os 5 porquês aprofundam o ramo mais carregado do Ishikawa. A lição para times ágeis: arquivo de configuração que muda comportamento é código e precisa de teste de fronteira, validação no ambiente real e entrega progressiva. Ponto positivo da empresa: reverteu em ~78 minutos e publicou uma análise pública e detalhada (cultura sem culpados).");
}
// ------------------------------------------------------------------ 13 caso 1
{
  const s = nova("FOLHA", "Caso 1 · LocalSend: entram mais bugs do que saem", "Estudos de caso");
  tag(s, "10", "ESTUDOS DE CASO · 1 DE 3");
  const anos = ["2023", "2024", "2025", "2026"];
  const fech = { 2023: 93, 2024: 59, 2025: 34, 2026: 150 };
  moldura(s, MX, 1.62, 6.6, 4.85, "FIG. 06 · ISSUES DE BUG ABERTAS × FECHADAS POR ANO (2026 ATÉ 15/11)");
  s.addChart(pres.charts.BAR, [
    { name: "abertos no ano", labels: anos, values: anos.map((a) => S.bugs_por_ano[a]) },
    { name: "fechados no ano", labels: anos, values: anos.map((a) => fech[a]) },
  ], {
    x: MX + 0.1, y: 1.7, w: 6.4, h: 4.7, barDir: "col", barGrouping: "clustered", barGapWidthPct: 55, chartColors: [C.red, C.ink],
    showValue: true, dataLabelPosition: "outEnd", showLegend: true, legendPos: "b", legendFontSize: 11, legendFontFace: F.mono, legendColor: C.mid,
    showTitle: true, title: "Entrada e saída de bugs", ...eixo,
  });
  const x = 7.55, w = W - x - MX;
  ficha(s, x, 1.62, w, 3.0, "DIAGNÓSTICO COM AS FERRAMENTAS", null, [
    "Backlog cresce todo ano: +64, +44, +94, +84",
    `PRs mesclados caíram de ${S.prs_por_ano["2024"]} (2024) para ${S.prs_por_ano["2025"]} (2025)`,
    "Integrar é rápido (histograma); o tamanho não importa (dispersão)",
    "Faltam dados (folha); foco em Android + Linux (Pareto)",
  ], { tam: 14 });
  ficha(s, x, 4.85, w, 1.62, "AÇÃO PROPOSTA", null, "Issue form com plataforma obrigatória, rodízio semanal de triagem e good first issue. Indicador: saldo mensal ≤ 0.", { rotCor: C.red, fill: "FFF6CC", tam: 14 });
  notas(s, `Leitura integrada das ferramentas sobre o mesmo dado: fluxograma (gargalo antes do PR), histograma (merge rápido), dispersão (tamanho não explica a espera), folha (60% sem plataforma) e Pareto (Android + Linux). Hoje há ${EB.abertos} bugs abertos. O que funcionou: CI e revisão. O que falhou: capacidade de correção abaixo da demanda e triagem sem dados. Melhoria: ações do PDCA (folha do plano).`);
}
// ------------------------------------------------------------------ 14 caso 2
{
  const s = nova("FOLHA", "Caso 2 · CrowdStrike (2024): configuração também é código");
  tag(s, "10", "ESTUDOS DE CASO · 2 DE 3");
  const marcos = [["04h09 UTC", "Channel File 291 publicado para toda a base"], ["05h27 UTC", "Arquivo revertido: ~78 min de exposição"], ["Dias seguintes", "Recuperação manual, máquina a máquina, em modo seguro"]];
  s.addShape(pres.shapes.LINE, { x: MX, y: 1.95, w: W - 2 * MX, h: 0, line: { color: C.ink, width: 1.5 } });
  const w = 3.85, g = 0.3;
  marcos.forEach(([t, d], i) => {
    const x = MX + i * (w + g);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.83, w: 0.24, h: 0.24, fill: { color: i ? C.ink : C.red }, line: { color: i ? C.ink : C.red } });
    txt(s, t, { x, y: 2.2, w, h: 0.45, fontFace: F.head, fontSize: 20 });
    txt(s, d, { x, y: 2.65, w: w - 0.2, h: 0.6, fontSize: 14, valign: "top" });
  });
  numero(s, MX, 3.55, 3.85, "8,5 mi", "de PCs Windows afetados (estimativa da Microsoft)", "Weston, 2024", { cor: C.red });
  numero(s, MX + 4.15, 3.55, 3.85, "21 × 20", "campos definidos × campos enviados ao interpretador", "CrowdStrike, 2024");
  ficha(s, MX + 8.3, 3.55, W - 2 * MX - 8.3, 2.95, "LIÇÕES", null, ["Testes de fronteira", "Validar no sensor real", "Entrega progressiva com canário", "Cliente controla o ritmo"], { tam: 15 });
  notas(s, "Contexto: o sensor roda no kernel e recebe dois tipos de atualização: o sensor (código, com processo rigoroso) e o conteúdo de resposta rápida (configuração, entregue várias vezes ao dia). Ferramentas: Ishikawa + 5 porquês; um fluxograma do processo de liberação mostraria a falta do passo 'implantar em anel pequeno e observar'; um checklist de liberação com 'carregado no sensor real?' teria barrado o arquivo. Validar toda entrada é princípio de desenvolvimento seguro (Albuquerque; Ribeiro, 2002). O que funcionou: reversão rápida e transparência. O que falhou: tratar configuração como de menor risco.");
}
// ------------------------------------------------------------------ 15 caso 3
{
  const s = nova("FOLHA", "Caso 3 · Knight Capital (2012): o servidor esquecido");
  tag(s, "10", "ESTUDOS DE CASO · 3 DE 3");
  const w = 2.85, g = 0.25;
  numero(s, MX, 1.55, w, "45 min", "do pregão de 01/08/2012 até conter o erro", null, { tam: 40 });
  numero(s, MX + (w + g), 1.55, w, "4 mi", "de ordens enviadas ao mercado", null, { tam: 40 });
  numero(s, MX + 2 * (w + g), 1.55, w, "212", "ordens de clientes que deveriam ser executadas", null, { tam: 40 });
  numero(s, MX + 3 * (w + g), 1.55, w, "US$ 460 mi", "de prejuízo; multa de US$ 12 mi da SEC", "SEC, 2013", { tam: 40, cor: C.red });
  ficha(s, MX, 4.0, 5.95, 2.5, "O QUE ACONTECEU", null, "Deploy manual em 8 servidores: 1 ficou com o código antigo. Uma flag reaproveitada reativou o \"Power Peg\", código morto havia anos. Alertas automáticos por e-mail foram ignorados.", { tam: 15 });
  ficha(s, MX + 6.25, 4.0, W - 2 * MX - 6.25, 2.5, "O QUE TERIA EVITADO", null, "Folha de verificação de implantação (1 linha por servidor, versão conferida), deploy automatizado, remoção de código morto e plano de resposta a incidentes.", { tam: 15, rotCor: C.red });
  carimbo(s, 3.9, 3.72, 2.4, 0.45, "SERVIDOR 8: REPROVADO", -4);
  notas(s, "Fonte: ordem da SEC de 16/10/2013 (Release 34-70694). No Ishikawa: Método (deploy manual, sem segunda pessoa conferindo), Material (código morto e flag reaproveitada), Medição (nenhuma verificação automática de versão nos 8 servidores) e Pessoas (alertas ignorados). A empresa foi adquirida meses depois. A falha não foi de programação, mas da ausência de processo de qualidade em volta do código.");
}
// ------------------------------------------------------------------ 16 PDCA
{
  const s = nova("FOLHA", "Plano de melhoria contínua (PDCA)", "Conclusão");
  tag(s, "11", "AÇÕES DE MELHORIA CONTÍNUA");
  const rows = [
    ["Backlog cresce todo ano", "Rodízio de triagem; good first issue", "Saldo mensal ≤ 0 em 6 meses", "Triagem no CONTRIBUTING"],
    ["60% dos bugs sem plataforma", "Issue form com campos obrigatórios", "≥ 95% classificados", "Formulário = folha oficial"],
    ["Android + Linux = 48%", "Testes automatizados de rede e permissões", "−30% bugs em 2 trimestres", "Pareto a cada trimestre"],
    ["15% dos PRs > 72 h", "PR parado há 14 dias é revisado ou fechado", "P85 do lead time ≤ 48 h", "SLE publicado"],
    ["Configuração sem teste (CrowdStrike)", "Configuração como código + canário", "100% das liberações em anéis", "Item da DoD"],
    ["Deploy manual (Knight)", "Pipeline automatizado + checklist de versão", "0 servidores divergentes", "Pipeline como única via"],
  ];
  s.addTable([[cabT("PROBLEMA (EVIDÊNCIA)"), cabT("DO · AÇÃO"), cabT("CHECK · INDICADOR E META"), cabT("ACT · PADRONIZAR")], ...rows],
    { x: MX, y: 1.7, w: W - 2 * MX, colW: [3.0, 3.35, 3.0, W - 2 * MX - 9.35], fontSize: 14, color: C.ink, fontFace: F.body, fill: { color: C.white }, border: { type: "solid", pt: 0.75, color: C.ink }, rowH: 0.62, margin: 0.08, valign: "middle" });
  txt(s, "CHECK CONTÍNUO: acompanhar os indicadores com gráfico de controle, a sétima ferramenta.", { x: MX, y: 6.2, w: W - 2 * MX, h: 0.35, fontFace: F.mono, fontSize: 12, color: C.red });
  notas(s, "Cada linha liga um problema encontrado por uma ferramenta a uma ação, um indicador com meta e uma forma de padronizar (o Act do PDCA). A melhoria contínua depende de indicadores acompanhados no tempo (Fernandes; Abreu, 2014). Pergunta provável: 'como saber se a ação funcionou?' Resposta: repetir a mesma ferramenta (Pareto trimestral, histograma do lead time) e acompanhar com gráfico de controle.");
}
// ------------------------------------------------------------------ 17 conclusão
{
  const s = nova("ESCURO", "O que levamos deste trabalho");
  txt(s, `§ 11   CONCLUSÃO · FOLHA 17/${TOTAL}`, { x: MX, y: 0.55, w: 9, h: 0.3, fontFace: F.mono, fontSize: 12, color: C.dim, charSpacing: 1 });
  const msgs = [
    ["Dados derrubam crenças", "PR grande não era o gargalo; a triagem era."],
    ["Ferramentas rendem em conjunto", "Fluxograma diz onde medir; Pareto, o que atacar; Ishikawa, por quê."],
    ["Ágil precisa de medição", "TDD, CI e DoD só melhoram o que é acompanhado com indicadores."],
  ];
  msgs.forEach(([t, d], i) => {
    const y = 2.75 + i * 1.3;
    s.addShape(pres.shapes.LINE, { x: MX, y, w: W - 2 * MX, h: 0, line: { color: "3A4148", width: 0.75 } });
    txt(s, String(i + 1).padStart(2, "0"), { x: MX, y: y + 0.18, w: 0.8, h: 0.5, fontFace: F.mono, fontSize: 20, bold: true, color: C.red });
    txt(s, t, { x: MX + 1.0, y: y + 0.15, w: 11, h: 0.5, fontFace: F.head, fontSize: 24, color: C.white });
    txt(s, d, { x: MX + 1.0, y: y + 0.65, w: 11, h: 0.45, fontSize: 16, color: C.fog });
  });
  notas(s, "Fechamento: retomar a pergunta do início (onde a qualidade se perde?). No LocalSend, na triagem e na capacidade de correção; na CrowdStrike e na Knight, no processo de implantação. Em todos os casos as ferramentas clássicas foram suficientes para enxergar o problema.");
}
// ------------------------------------------------------------------ 18 referências
{
  const s = nova("FOLHA", "Referências principais");
  tag(s, "—", "REFERÊNCIAS · LISTA COMPLETA EM ABNT NO RELATÓRIO");
  const plano = [
    "BARTIÉ, A. Garantia da qualidade de software. Elsevier, 2002.",
    "TELES, V. M. Extreme programming. Novatec, 2004.",
    "PFLEEGER, S. L. Engenharia de software. 2. ed. Pearson, 2003.",
    "GALLOTTI, G. M. A. (org.). Qualidade de software. Pearson, 2015.",
    "FÉLIX, R. (org.). Teste de software. Pearson, 2016.",
    "FERNANDES, A. A.; ABREU, V. F. Implantando a governança de TI. Brasport, 2014.",
    "GUERRA, A. C.; COLOMBO, R. M. T. Qualidade de produto de software, 2010.",
    "ALBUQUERQUE, R.; RIBEIRO, B. Segurança no desenvolvimento de software. Campus, 2002.",
  ];
  const outras = [
    "ISHIKAWA, K. What is total quality control? 1985; Guide to quality control, 1986.",
    "SCHWABER, K.; SUTHERLAND, J. The Scrum Guide, 2020.",
    "VACANTI, D. Actionable agile metrics for predictability, 2015.",
    "NAGAPPAN, N. et al. TDD in four industrial teams. EMSE, 2008.",
    "SADOWSKI, C. et al. Modern code review at Google. ICSE-SEIP, 2018.",
    "NAGAPPAN, N.; BALL, T. Code churn and defect density. ICSE, 2005.",
    "DORA. Accelerate State of DevOps Report, 2024.",
    "BALLMER, S. Memo to Microsoft customers, 2002.",
    "CROWDSTRIKE. Channel File 291: root cause analysis, 2024.",
    "WESTON, D. Helping our customers through the CrowdStrike outage, 2024.",
    "SEC. In the matter of Knight Capital Americas LLC, 2013.",
    "LOCALSEND. github.com/localsend/localsend, acesso em 15/11/2026.",
  ];
  [[plano, "BIBLIOGRAFIA DO PLANO DE ENSINO"], [outras, "FONTES DOS EXEMPLOS REAIS"]].forEach(([lista, rot], k) => {
    const x = MX + k * 6.2;
    txt(s, rot, { x, y: 1.65, w: 5.9, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.red });
    txt(s, lista.map((t, i) => ({ text: t, options: { breakLine: i < lista.length - 1 } })), { x, y: 2.05, w: 5.9, h: 4.6, fontSize: 13, paraSpaceAfter: 5, valign: "top" });
  });
  notas(s, "Lista completa, em ABNT, no relatório em PDF. À esquerda, a bibliografia básica e complementar do plano de ensino; à direita, as fontes atualizadas usadas nos exemplos reais.");
}
// ------------------------------------------------------------------ 19 perguntas
{
  const s = nova("ESCURO", "Perguntas?");
  txt(s, "?", { x: 8.3, y: 1.0, w: 4.9, h: 5.0, fontFace: F.head, fontSize: 300, color: C.ghost, align: "right", valign: "middle" });
  txt(s, `FOLHA ${TOTAL}/${TOTAL} · FIM DA INSPEÇÃO`, { x: MX, y: 0.55, w: 9, h: 0.3, fontFace: F.mono, fontSize: 12, color: C.dim, charSpacing: 1 });
  txt(s, "EQUIPE", { x: MX, y: 3.3, w: 3, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.red, charSpacing: 2 });
  txt(s, INTEGRANTES.map((n, i) => ({ text: n, options: { breakLine: i < INTEGRANTES.length - 1 } })), { x: MX, y: 3.65, w: 7, h: 1.6, fontSize: 17, color: C.white, paraSpaceAfter: 3, valign: "top" });
  notas(s, "Perguntas prováveis e respostas curtas:\n1) Por que Spearman e não Pearson? Porque os dados são muito assimétricos; Spearman usa a ordem e não é dominado por poucos valores extremos.\n2) O Pareto não deu 80/20 exato, está errado? Não: 80/20 é uma regra empírica; aqui 40% das categorias somam ~80%, o que já permite priorizar.\n3) Os dados são confiáveis? São públicos e brutos do GitHub; limitações: só PRs mesclados, rótulos incompletos e 2026 ainda não terminou.\n4) Por que média não serve no histograma? A cauda longa puxa a média para 114 h, enquanto o PR típico leva 7 h.\n5) Qual ferramenta resolveria o caso Knight? Uma folha de verificação de implantação, além de automação do deploy.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("gerado:", OUT);
})();
