import json, os, urllib.request, urllib.error

TOKEN = os.environ["CLOUDFLARE_API_TOKEN"]
DOMAIN = "oldironofficial.com"
BASE = "https://api.cloudflare.com/client/v4"

RECORDS = [
    {
        "type": "TXT",
        "name": f"resend._domainkey.{DOMAIN}",
        "content": '"p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZ21hyEPT2bn8LXHQJgzatTvI2pQnlLCQ71q1NYuew8xAoD0J5GGpSTwLBwWPcFVSpEQhwemC23g8rgUTVv2RbxfrFokqH6/BoAiDy2UtBhMizEWPi2j/OCz1t4IYLJqLZox2Nce91/Wic9fFAqy1Ellt3UCMw6EckI6QW0yDd8wIDAQAB"',
    },
    {
        "type": "MX",
        "name": f"send.{DOMAIN}",
        "content": "feedback-smtp.eu-west-1.amazonses.com",
        "priority": 10,
    },
    {
        "type": "TXT",
        "name": f"send.{DOMAIN}",
        "content": '"v=spf1 include:amazonses.com ~all"',
    },
]


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
        try:
            raw = json.loads(raw)
        except Exception:
            pass
        return e.code, raw
    except Exception as e:
        return 0, str(e)


st, d = call("GET", f"/zones?name={DOMAIN}")
zone = (d.get("result") or [{}])[0].get("id") if isinstance(d, dict) else None
print("ZONE:", zone)
if not zone:
    print("zone yok:", str(d)[:200])
    raise SystemExit(0)

st, existing = call("GET", f"/zones/{zone}/dns_records?per_page=100")
if st != 200 or not (isinstance(existing, dict) and existing.get("success")):
    print("DNS OKUNAMADI -> HTTP", st, str(existing)[:300])
    print(">> Token'da Zone:DNS:Edit yetkisi yok olabilir; Resend kayitlarini elle eklemek gerekebilir.")
    raise SystemExit(0)

existing_records = existing.get("result") or []

for rec in RECORDS:
    already = any(
        r.get("type") == rec["type"] and r.get("name") == rec["name"]
        for r in existing_records
    )
    if already:
        print(f"  {rec['type']} {rec['name']} zaten var, atlaniyor")
        continue
    body = {
        "type": rec["type"],
        "name": rec["name"],
        "content": rec["content"],
        "ttl": 1,
        "proxied": False,
    }
    if "priority" in rec:
        body["priority"] = rec["priority"]
    st, d = call("POST", f"/zones/{zone}/dns_records", body)
    ok = isinstance(d, dict) and d.get("success")
    print(f"  {rec['type']} {rec['name']} -> HTTP {st} ok={ok}")
    if not ok:
        print("    detay:", str(d)[:350])
