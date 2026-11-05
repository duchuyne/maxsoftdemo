import json
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
MODEL = "qwen2.5:3b"
KNOWLEDGE = (ROOT / "maxgirl_knowledge.txt").read_text(encoding="utf-8")

SYSTEM_PROMPT = f"""Bạn là Max Girl, trợ lý ảo tư vấn lịch sự bằng tiếng Việt cho MaxSoft.
Chỉ trả lời dựa trên kiến thức bên dưới. Nếu không đủ thông tin, nói rõ chưa có dữ liệu
và hướng khách gọi Hotline 0123456789 hoặc Zalo 0363253368. Không tự bịa giá, chính sách,
tính năng hay cam kết. Trả lời ngắn gọn, dễ hiểu, tối đa 120 từ.

KIẾN THỨC MAXSOFT:
{KNOWLEDGE}
"""


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            question = str(payload.get("message", "")).strip()
            if not question:
                raise ValueError("message is required")
            request = urllib.request.Request(
                OLLAMA_URL,
                data=json.dumps({
                    "model": MODEL,
                    "stream": False,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": question},
                    ],
                    "options": {"temperature": 0.2},
                }).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(request, timeout=90) as response:
                result = json.loads(response.read().decode("utf-8"))
            answer = result.get("message", {}).get("content", "").strip()
            if not answer:
                raise RuntimeError("Ollama returned an empty answer")
            self._json_response(200, {"answer": answer, "source": "ollama"})
        except Exception as error:
            self._json_response(502, {"error": str(error)})

    def _json_response(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("Max Girl server: http://127.0.0.1:8787")
    print("Requires Ollama model:", MODEL)
    ThreadingHTTPServer(("127.0.0.1", 8787), Handler).serve_forever()
