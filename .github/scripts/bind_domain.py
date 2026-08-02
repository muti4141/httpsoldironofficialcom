import json, os, time, urllib.request, urllib.error

TOKEN   = os.environ["CF_TOKEN"]
ACCT    = os.environ["CF_ACCOUNT"]
SERVICE = "tanstack-start-app"
HOSTS   = ["oldironofficial.com", "www.oldironofficial.com"]
BASE    = "https://api.cloudflare.com/client/v4"

def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method)
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try: raw = json.loads(raw)
        except Exception: pass
        return e.code, raw
    except Exception as e:
        return 0, str(e)

st, d = call("GET", "/zones?name=oldironofficial.com")
zone = (d.get("result") or [{}])[0].get("id") if isinstance(d, dict) else None
print("ZONE:", zone)
if not zone:
    print("zone yok:", str(d)[:200]); raise SystemExit(0)

print("=== A KAYITLARINI SIL ===")
st, d = call("GET", f"/zones/{zone}/dns_records?per_page=100")
if st != 200 or not (isinstance(d, dict) and d.get("success")):
    print("  DNS OKUNAMADI -> HTTP", st, str(d)[:300])
    print("  >> Token'da Zone:DNS:Edit yetkisi yok.")
else:
    for rec in (d.get("result") or []):
        nm, ty = rec.get("name"), rec.get("type")
        print(f"  kayit: {nm} {ty} {rec.get('content')} proxied={rec.get('proxied')}")
        if nm in HOSTS and ty in ("A", "AAAA", "CNAME"):
            s2, r2 = call("DELETE", f"/zones/{zone}/dns_records/{rec.get('id')}")
            print(f"    -> SILINIYOR: HTTP {s2} {str(r2)[:200]}")

time.sleep(3)

print("=== CUSTOM DOMAIN BAGLA ===")
for h in HOSTS:
    body = {"environment": "production", "hostname": h, "service": SERVICE, "zone_id": zone}
    st, d = call("PUT", f"/accounts/{ACCT}/workers/domains", body)
    ok = isinstance(d, dict) and d.get("success")
    print(f"  {h}: HTTP {st} ok={ok}")
    if not ok:
        print("    detay:", str(d)[:350])
