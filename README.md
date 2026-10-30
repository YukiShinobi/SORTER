# SORTER — Interactive Sorting Algorithm Visualizer

An interactive, dependency-free sorting visualizer built with HTML, CSS and JavaScript.

## Features
- Bubble, Selection, Insertion, Merge, and Quick Sort
- Random, nearly sorted, reversed, and duplicate-heavy datasets
- Array sizes from 8 to 100
- Animation speed control, pause/resume, stop, and regenerate
- Live comparisons, writes, and elapsed time
- Accessible buttons, keyboard focus states, and responsive design
- No installation, account, build step, or external services needed

## Run

Open `index.html` in your browser, or serve locally:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Algorithms

| Algorithm | Average | Worst | Extra space |
|---|---|---|---|
| Bubble | O(n²) | O(n²) | O(1) |
| Selection | O(n²) | O(n²) | O(1) |
| Insertion | O(n²) | O(n²) | O(1) |
| Merge | O(n log n) | O(n log n) | O(n) |
| Quick | O(n log n) | O(n²) | O(log n) stack average |

The displayed write count tracks writes back to the main visualized array. Animation operations are not intended as a precise benchmarking tool.

## Tests

A dependency-free test suite runs under Node.js:

```bash
node --test tests/sort.test.mjs
```

## License

MIT
