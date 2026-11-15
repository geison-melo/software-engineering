"""Coleta dados públicos do repositório localsend/localsend via GitHub GraphQL (gh CLI).

Gera:
  dados/prs_merged.csv  - PRs mesclados: número, criação, merge, linhas e arquivos alterados
  dados/bugs.csv        - issues com o rótulo "bug": número, criação, fechamento, estado e rótulos
Uso: python coletar_dados.py   (requer gh autenticado)
"""
import csv
import json
import subprocess
import time
from pathlib import Path

REPO_OWNER, REPO_NAME = "localsend", "localsend"
OUT = Path(__file__).parent / "dados"
OUT.mkdir(exist_ok=True)


def gql(query: str, **vars_):
    args = ["gh", "api", "graphql", "-f", f"query={query}"]
    for k, v in vars_.items():
        if v is not None:
            args += ["-F" if isinstance(v, int) else "-f", f"{k}={v}"]
    for tentativa in range(5):  # a API do GitHub devolve 502 de vez em quando
        r = subprocess.run(args, capture_output=True, text=True, encoding="utf-8")
        if r.returncode == 0:
            return json.loads(r.stdout)["data"]
        print("falha, tentando de novo:", r.stderr.strip()[:200])
        time.sleep(3 * (tentativa + 1))
    raise RuntimeError(r.stderr)


Q_PRS = """
query($cursor: String) {
  repository(owner: "%s", name: "%s") {
    pullRequests(states: MERGED, first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: ASC}) {
      pageInfo { hasNextPage endCursor }
      nodes { number createdAt mergedAt additions deletions changedFiles }
    }
  }
}""" % (REPO_OWNER, REPO_NAME)

Q_BUGS = """
query($cursor: String) {
  repository(owner: "%s", name: "%s") {
    issues(labels: ["bug"], first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: ASC}) {
      pageInfo { hasNextPage endCursor }
      nodes { number createdAt closedAt state stateReason labels(first: 20) { nodes { name } } }
    }
  }
}""" % (REPO_OWNER, REPO_NAME)


def paginate(query, key):
    cursor, rows = None, []
    while True:
        data = gql(query, cursor=cursor)["repository"][key]
        rows += data["nodes"]
        if not data["pageInfo"]["hasNextPage"]:
            return rows
        cursor = data["pageInfo"]["endCursor"]


prs = paginate(Q_PRS, "pullRequests")
with open(OUT / "prs_merged.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["number", "createdAt", "mergedAt", "additions", "deletions", "changedFiles"])
    for p in prs:
        w.writerow([p["number"], p["createdAt"], p["mergedAt"], p["additions"], p["deletions"], p["changedFiles"]])

bugs = paginate(Q_BUGS, "issues")
with open(OUT / "bugs.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["number", "createdAt", "closedAt", "state", "stateReason", "labels"])
    for b in bugs:
        labels = ";".join(n["name"] for n in b["labels"]["nodes"])
        w.writerow([b["number"], b["createdAt"], b["closedAt"], b["state"], b["stateReason"], labels])

print(f"PRs mesclados: {len(prs)} | issues bug: {len(bugs)}")
