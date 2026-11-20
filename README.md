# PLANT MATTER — 모바일 사이트 (m.plantmatter.kr)

PC 사이트(plantmatter.kr)와 짝을 이루는 모바일 전용 사이트입니다.
배포 방법, DNS 설정, 페이지 연결 방법은 PC 폴더의 `README.md`에 함께 정리되어 있습니다.

- GitHub 저장소: `plantmatter/plantmatter-mobile` → Settings → Pages → Custom domain: `m.plantmatter.kr`
- DNS: `CNAME  m  →  plantmatter.github.io`
- 일본어 주소(`/ja/…`) 페이지는 `python3 tools/make_ja_pages.py` 로 만듭니다 — 페이지(HTML)를 고친 뒤 꼭 다시 실행 (자세한 내용은 PC 저장소 README '일본어 주소')
