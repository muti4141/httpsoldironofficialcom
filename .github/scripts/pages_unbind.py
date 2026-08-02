import json, os, urllib.request, urllib.error

TOKEN = os.environ["CF_TOKEN"]
ACCT  = os.environ["CF_ACCOUNT"]
TARGETS = {"oldironofficial.com", "www.oldironofficial.com"}
BASE = "https://api.cloudflare.com/client/v4"

def call(method, path, ):
    req = urllib.request.Request(BASE + path, method=method)
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try: body = json.loads(body)
        except Exception: pass
        return e.code, body
    except Exception as e:
        return 0, str(e)

st, data = call("GET", f"/accounts/{ACCT}/pages/projects")
if st != 200 or not isinstance(data, dict) or not data.get("success"):
    print("Pages projeleri listelenemedi:", st, str(data)[:300])
    raise SystemExit(0)

projects = data.get("result") or []
print(f"Hesapta {len(projects)} Pages projesi var")

found_any = False
for p in projects:
    name = p.get("name")
    doms = p.get("domains") or []
    print(f"  proje: {name} | domainler: {doms}")
    hit = TARGETS.intersection(set(doms))
    if not hit:
        continue
    found_any = True
    for d in hit:
        s2, r2 = call("DELETE", f"/accounts/{ACCT}/pages/projects/{name}/domains/{d}")
        print(f"    -> {d} projeden siliniyor ({name}): HTTP {s2} {str(r2)[:160]}")

if not found_any:
    print("Hicbir Pages projesinde bu domainler bagli degil.")
