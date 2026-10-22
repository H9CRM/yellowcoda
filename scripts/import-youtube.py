"""Normalize public YouTube channel metadata and save thumbnail assets.

Run yt-dlp --flat-playlist --dump-single-json against @Ycstraps/videos and
@Ycstraps/shorts first; the raw files live in research/.
"""

import json
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "images" / "youtube"
DEST.mkdir(parents=True, exist_ok=True)
videos = []

for filename, kind in (("youtube-channel.json", "video"), ("youtube-shorts.json", "short")):
    data = json.loads((ROOT / "research" / filename).read_text(encoding="utf-8-sig"))
    for item in data.get("entries", []):
        video_id = item.get("id")
        if not video_id or any(v["id"] == video_id for v in videos):
            continue
        path = DEST / f"{video_id}.jpg"
        thumbnail_candidates = [thumb["url"] for thumb in item.get("thumbnails", []) if thumb.get("url")]
        thumbnail_candidates.append(f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg")
        if not path.exists():
            for url in thumbnail_candidates:
                try:
                    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
                    with urlopen(req, timeout=20) as response:
                        body = response.read()
                    if len(body) < 1500:
                        continue
                    path.write_bytes(body)
                    break
                except Exception:
                    continue
        videos.append({
            "id": video_id,
            "title": item.get("title") or "Yellow Cada video",
            "kind": kind,
            "source": item.get("url") or f"https://www.youtube.com/watch?v={video_id}",
            "thumbnail": f"/images/youtube/{video_id}.jpg" if path.exists() else thumbnail_candidates[-1],
            "channel": "yellow Cada",
        })

(ROOT / "research" / "youtube-videos.json").write_text(json.dumps(videos, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Imported {len(videos)} public YouTube video references; {sum((DEST / (v['id'] + '.jpg')).exists() for v in videos)} thumbnails saved.")
