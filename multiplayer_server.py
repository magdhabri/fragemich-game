import json
import secrets
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

rooms = {}
rooms_lock = threading.Lock()
ROOM_TTL_SECONDS = 60 * 60 * 12


def now_ts():
    return int(time.time())


def random_room_code():
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "".join(secrets.choice(alphabet) for _ in range(6))


def cleanup_rooms():
    cutoff = now_ts() - ROOM_TTL_SECONDS
    with rooms_lock:
        expired = [code for code, room in rooms.items() if room["updatedAt"] < cutoff]
        for code in expired:
            rooms.pop(code, None)


def public_state(room, player_id):
    me = room["players"].get(player_id)
    other = None
    for pid, data in room["players"].items():
        if pid != player_id:
            other = data
            break

    winner = room["winner"]
    reveal = winner is not None
    rematch_secrets = room.get("rematchSecrets", {})

    return {
        "roomCode": room["code"],
        "status": room["status"],
        "turn": room["turn"],
        "winner": winner,
        "range": room["range"],
        "me": {
            "id": me["id"] if me else None,
            "name": me["name"] if me else None,
            "secret": me["secret"] if me else None,
            "guesses": me["guesses"] if me else [],
        },
        "other": {
            "id": other["id"] if other else None,
            "name": other["name"] if other else None,
            "secret": other["secret"] if reveal and other else None,
            "guesses": other["guesses"] if other else [],
        },
        "rematch": {
            "readyCount": len(rematch_secrets),
            "totalPlayers": len(room["players"]),
            "meReady": player_id in rematch_secrets,
        },
        "updatedAt": room["updatedAt"],
    }


class Handler(SimpleHTTPRequestHandler):
    def end_json(self, status, payload):
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

    def parse_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        body = self.rfile.read(length)
        try:
            return json.loads(body.decode("utf-8"))
        except Exception:
            return None

    def do_GET(self):
        cleanup_rooms()
        if self.path.startswith("/api/state"):
            parsed = urlparse(self.path)
            q = parse_qs(parsed.query)
            room_code = (q.get("room") or [""])[0].upper()
            player_id = (q.get("player") or [""])[0]

            if not room_code or not player_id:
                self.end_json(400, {"error": "room und player sind erforderlich"})
                return

            with rooms_lock:
                room = rooms.get(room_code)
                if not room:
                    self.end_json(404, {"error": "Raum nicht gefunden"})
                    return
                if player_id not in room["players"]:
                    self.end_json(403, {"error": "Spieler nicht im Raum"})
                    return
                room["updatedAt"] = now_ts()
                self.end_json(200, public_state(room, player_id))
            return

        return super().do_GET()

    def do_POST(self):
        cleanup_rooms()
        if self.path == "/api/create-room":
            data = self.parse_json()
            if data is None:
                self.end_json(400, {"error": "Ungültige JSON-Daten"})
                return

            name = str(data.get("name", "")).strip()
            try:
                secret = int(data.get("secret"))
                min_range = int(data.get("min"))
                max_range = int(data.get("max"))
            except Exception:
                self.end_json(400, {"error": "Zahlen sind ungültig"})
                return

            if not name:
                self.end_json(400, {"error": "Name fehlt"})
                return
            if min_range >= max_range or secret < min_range or secret > max_range:
                self.end_json(400, {"error": "Bereich oder Geheimzahl ungültig"})
                return

            with rooms_lock:
                code = random_room_code()
                while code in rooms:
                    code = random_room_code()

                player_id = "P1-" + secrets.token_hex(8)
                rooms[code] = {
                    "code": code,
                    "status": "waiting",
                    "range": {"min": min_range, "max": max_range},
                    "players": {
                        player_id: {
                            "id": player_id,
                            "name": name,
                            "secret": secret,
                            "guesses": [],
                        }
                    },
                    "turn": player_id,
                    "winner": None,
                    "rematchSecrets": {},
                    "createdAt": now_ts(),
                    "updatedAt": now_ts(),
                }

            self.end_json(200, {"roomCode": code, "playerId": player_id})
            return

        if self.path == "/api/join-room":
            data = self.parse_json()
            if data is None:
                self.end_json(400, {"error": "Ungültige JSON-Daten"})
                return

            room_code = str(data.get("roomCode", "")).upper().strip()
            name = str(data.get("name", "")).strip()
            try:
                secret = int(data.get("secret"))
            except Exception:
                self.end_json(400, {"error": "Geheimzahl ungültig"})
                return

            if not room_code or not name:
                self.end_json(400, {"error": "Raumcode und Name sind erforderlich"})
                return

            with rooms_lock:
                room = rooms.get(room_code)
                if not room:
                    self.end_json(404, {"error": "Raum nicht gefunden"})
                    return
                if room["status"] != "waiting":
                    self.end_json(400, {"error": "Raum ist bereits gestartet"})
                    return
                if len(room["players"]) >= 2:
                    self.end_json(400, {"error": "Raum ist voll"})
                    return

                min_range = room["range"]["min"]
                max_range = room["range"]["max"]
                if secret < min_range or secret > max_range:
                    self.end_json(400, {"error": f"Geheimzahl muss zwischen {min_range} und {max_range} sein"})
                    return

                player_id = "P2-" + secrets.token_hex(8)
                room["players"][player_id] = {
                    "id": player_id,
                    "name": name,
                    "secret": secret,
                    "guesses": [],
                }
                room["status"] = "active"
                room["rematchSecrets"] = {}
                room["updatedAt"] = now_ts()

            self.end_json(200, {"roomCode": room_code, "playerId": player_id})
            return

        if self.path == "/api/guess":
            data = self.parse_json()
            if data is None:
                self.end_json(400, {"error": "Ungültige JSON-Daten"})
                return

            room_code = str(data.get("roomCode", "")).upper().strip()
            player_id = str(data.get("playerId", "")).strip()
            try:
                guess = int(data.get("guess"))
            except Exception:
                self.end_json(400, {"error": "Ratezahl ungültig"})
                return

            with rooms_lock:
                room = rooms.get(room_code)
                if not room:
                    self.end_json(404, {"error": "Raum nicht gefunden"})
                    return
                if room["status"] != "active":
                    self.end_json(400, {"error": "Spiel ist nicht aktiv"})
                    return
                if room["winner"] is not None:
                    self.end_json(400, {"error": "Spiel ist schon beendet"})
                    return
                if player_id not in room["players"]:
                    self.end_json(403, {"error": "Spieler nicht im Raum"})
                    return
                if room["turn"] != player_id:
                    self.end_json(400, {"error": "Du bist nicht dran"})
                    return

                min_range = room["range"]["min"]
                max_range = room["range"]["max"]
                if guess < min_range or guess > max_range:
                    self.end_json(400, {"error": f"Bitte zwischen {min_range} und {max_range} raten"})
                    return

                opponent_id = next(pid for pid in room["players"] if pid != player_id)
                opponent_secret = room["players"][opponent_id]["secret"]

                if guess == opponent_secret:
                    hint = "RICHTIG!"
                    room["winner"] = player_id
                    room["status"] = "finished"
                    room["rematchSecrets"] = {}
                elif guess < opponent_secret:
                    hint = "Größer!"
                    room["turn"] = opponent_id
                else:
                    hint = "Kleiner!"
                    room["turn"] = opponent_id

                room["players"][player_id]["guesses"].append({"guess": guess, "hint": hint})
                room["updatedAt"] = now_ts()

            self.end_json(200, {"hint": hint})
            return

        if self.path == "/api/rematch":
            data = self.parse_json()
            if data is None:
                self.end_json(400, {"error": "Ungültige JSON-Daten"})
                return

            room_code = str(data.get("roomCode", "")).upper().strip()
            player_id = str(data.get("playerId", "")).strip()
            try:
                new_secret = int(data.get("secret"))
            except Exception:
                self.end_json(400, {"error": "Neue Geheimzahl ist ungültig"})
                return

            with rooms_lock:
                room = rooms.get(room_code)
                if not room:
                    self.end_json(404, {"error": "Raum nicht gefunden"})
                    return
                if player_id not in room["players"]:
                    self.end_json(403, {"error": "Spieler nicht im Raum"})
                    return
                if room["status"] != "finished" or room["winner"] is None:
                    self.end_json(400, {"error": "Rematch erst nach Spielende möglich"})
                    return

                min_range = room["range"]["min"]
                max_range = room["range"]["max"]
                if new_secret < min_range or new_secret > max_range:
                    self.end_json(400, {"error": f"Neue Geheimzahl muss zwischen {min_range} und {max_range} sein"})
                    return

                rematch_secrets = room.setdefault("rematchSecrets", {})
                rematch_secrets[player_id] = new_secret

                started = False
                if len(rematch_secrets) == len(room["players"]):
                    for pid in room["players"]:
                        room["players"][pid]["secret"] = rematch_secrets[pid]
                        room["players"][pid]["guesses"] = []

                    first_player = next((pid for pid in room["players"] if pid.startswith("P1-")), None)
                    room["turn"] = first_player or next(iter(room["players"]))
                    room["winner"] = None
                    room["status"] = "active"
                    room["rematchSecrets"] = {}
                    started = True

                room["updatedAt"] = now_ts()
                self.end_json(200, {
                    "started": started,
                    "readyCount": len(room.get("rematchSecrets", {})),
                    "totalPlayers": len(room["players"]),
                })
            return

        self.end_json(404, {"error": "API-Endpunkt nicht gefunden"})


def run_server(port=8080):
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"MAGDNUMBER Multiplayer läuft auf http://0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    run_server(8080)
