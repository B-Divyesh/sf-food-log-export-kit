# Demo sandbox

- URL: `https://food-log-export-kit.sociobot.in/demo` (local: `http://127.0.0.1:4173/demo`)
- Direct entry: `/demo` or `/?demo=1`
- Sample: 12 entries across four days, including 11 meals and one body-weight entry. It includes realistic calories and macro values.
- Result: the review table is already populated. Both CSV and JSON export buttons work.
- Reset: use **Reset demo** in the persistent amber banner.
- Exit: use **Start for real**. This opens an empty workspace.
- Storage: demo records live in JavaScript memory only. The demo does not read or write the real workspace or license storage.
- Network: the demo conversion and export flow makes same-origin requests only. The service worker caches the sample and application shell for offline reload.
