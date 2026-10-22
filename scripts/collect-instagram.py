"""Build a compact research manifest from yt-dlp's public reel metadata."""
import json
from pathlib import Path
from shutil import move

root = Path(__file__).resolve().parents[1]
video_dir = root / 'public' / 'videos'
research_dir = root / 'research' / 'instagram-info'
research_dir.mkdir(parents=True, exist_ok=True)
records = []

for source in sorted(video_dir.glob('*.info.json')):
    data = json.loads(source.read_text(encoding='utf-8'))
    reel_id = data.get('id') or source.name.removesuffix('.info.json')
    records.append({
        'id': reel_id,
        'source': data.get('webpage_url') or f'https://www.instagram.com/reel/{reel_id}/',
        'posted': data.get('upload_date'),
        'caption': data.get('description') or '',
        'title': data.get('title') or '',
        'duration_seconds': data.get('duration'),
        'width': data.get('width'),
        'height': data.get('height'),
        'video': f'/videos/{reel_id}.mp4',
        'poster': f'/videos/{reel_id}.jpg',
        'downloaded': (video_dir / f'{reel_id}.mp4').exists(),
    })
    move(str(source), str(research_dir / source.name))

records.sort(key=lambda r: r['posted'] or '', reverse=True)
(root / 'research' / 'instagram-reels.json').write_text(json.dumps(records, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Collected {len(records)} reel records; {sum(r["downloaded"] for r in records)} videos found.')
