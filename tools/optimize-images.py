"""Build smaller WebP copies used by the site.

Card images are capped at 720px (listing thumbnails).
Hero images are capped at 1600px (full-width photos).
A copy is skipped when it is not smaller than the original.
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images"
OUT = SOURCE / "opt"
EXTS = {".avif", ".gif", ".jpeg", ".jfif", ".jpg", ".png", ".webp"}
PRESETS = (("card", 720, 68), ("hero", 1600, 74))


def prepare(im, max_edge):
    im = ImageOps.exif_transpose(im)
    im.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    if im.mode == "P":
        im = im.convert("RGBA" if "transparency" in im.info else "RGB")
    elif im.mode == "LA":
        im = im.convert("RGBA")
    elif im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    return im


def write_webp(src, dest, max_edge, quality):
    with Image.open(src) as raw:
        im = prepare(raw, max_edge)
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, "WEBP", quality=quality, method=6)
    original = src.stat().st_size
    saved = dest.stat().st_size
    if saved >= original * 0.92:
        dest.unlink(missing_ok=True)
        return 0
    return saved


def main():
    files = [p for p in SOURCE.iterdir() if p.is_file() and p.suffix.lower() in EXTS]
    card_bytes = hero_bytes = kept = 0
    for src in files:
        for preset, edge, quality in PRESETS:
            dest = OUT / preset / f"{src.name}.webp"
            try:
                size = write_webp(src, dest, edge, quality)
            except Exception as err:
                print(f"skip {src.name}: {err}")
                continue
            if size:
                kept += 1
                if preset == "card":
                    card_bytes += size
                else:
                    hero_bytes += size
    logo = ROOT / "logo1.png"
    logo_out = OUT / "ui" / "logo1.webp"
    logo_note = "logo unchanged"
    if logo.is_file():
        try:
            with Image.open(logo) as raw:
                im = prepare(raw, 640)
                logo_out.parent.mkdir(parents=True, exist_ok=True)
                im.save(logo_out, "WEBP", quality=80, method=6)
            logo_note = (
                f"logo {logo.stat().st_size // 1024}KB -> "
                f"{logo_out.stat().st_size // 1024}KB {im.size[0]}x{im.size[1]}"
            )
        except Exception as err:
            logo_note = f"logo failed: {err}"
    originals = sum(p.stat().st_size for p in files)
    print(
        f"sources {len(files)} files {originals // 1024}KB | "
        f"kept {kept} webp | card {card_bytes // 1024}KB | hero {hero_bytes // 1024}KB | {logo_note}"
    )


if __name__ == "__main__":
    main()
