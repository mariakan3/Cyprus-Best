"""Local static server: clean URLs + preserved query strings."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import urllib.parse
import sys

ROOT = Path(__file__).resolve().parent
PORT = 5500


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _map_clean_url(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        parts = [p for p in path.split("/") if p]

        # /details/amara -> details.html (id stays in the browser path/hash/query)
        if len(parts) >= 2 and parts[0] == "details":
            self.path = "/details.html"
            return

        if path == "/":
            self.path = "/index.html"
            if parsed.query:
                self.path += "?" + parsed.query
            return

        # /thingstodo -> thingstodo.html (keep ?query)
        name = Path(path).name
        if "." not in name:
            candidate = ROOT / f"{name}.html"
            if candidate.is_file():
                self.path = f"/{candidate.name}"
                if parsed.query:
                    self.path += "?" + parsed.query

    def do_GET(self):
        self._map_clean_url()
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_HEAD(self):
        self._map_clean_url()
        return SimpleHTTPRequestHandler.do_HEAD(self)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Serving http://localhost:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
