import json, os, urllib.request, urllib.error

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

print("### 1) PAGES PROJELERI ###")
st, d = call("GET", f"/accounts/{ACCT}/pages/projects")
if st == 200 and isinstance(d, dict) and d.get("success"):
    for p in (d.get("result") or []):
        print("   proje:", p.get("name"), "| domainler:", p.get("domains"))
        for dom in (p.get("domains") or []):
            if dom in HOSTS:
                s2, r2 = call("DELETE", f"/accounts/{ACCT}/pages/projects/{p['name']}/domains/{dom}")
                print(f"     -> {dom} sokuluyor: HTTP {s2} {str(r2)[:200]}")
else:
    print("   listelenemedi:", st, str(d)[:250])

print("### 2) ZONE ID ###")
st, d = call("GET", "/zones?name=oldironofficial.com")
zone = (d.get("result") or [{}])[0].get("id") if isinstance(d, dict) else None
print("   zone:", zone)
if not zone:
    raise SystemExit(0)

print("### 3) MEVCUT WORKER CUSTOM DOMAIN'LERI ###")
st, d = call("GET", f"/accounts/{ACCT}/workers/domains?zone_id={zone}")
print("   HTTP", st)
if st == 200 and isinstance(d, dict):
    for it in (d.get("result") or []):
        print("   var:", it.get("hostname"), "->", it.get("service"), "id:", it.get("id"))
        if it.get("hostname") in HOSTS and it.get("service") != SERVICE:
            s2, r2 = call("DELETE", f"/accounts/{ACCT}/workers/domains/{it.get('id')}")
            print(f"     -> yanlis servis, siliniyor: HTTP {s2}")
else:
    print("   ", str(d)[:250])

print("### 4) CUSTOM DOMAIN BAGLA ###")
for h in HOSTS:
    body = {
        "environment": "production",
        "hostname": h,
        "service": SERVICE,
        "zone_id": zone,
        "override_existing_origin": True,
        "override_existing_dns_record": True,
    }
    st, d = call("PUT", f"/accounts/{ACCT}/workers/domains", body)
    ok = isinstance(d, dict) and d.get("success")
    print(f"   {h}: HTTP {st} ok={ok}")
    if not ok:
        print("     detay:", str(d)[:400])
