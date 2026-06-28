# Exam Strategy & Structure

> **2 hours · 5 questions · answer ALL · 100 marks (20 each) · non-programmable calculator. A formula / key-results sheet is provided.**

## Mark map (from the mock exam)

| Q | Topic | Marks |
|---|-------|------:|
| **1** | Signal / system **properties** — periodicity, causality, linearity, time-invariance | 20 |
| **2** | **Z-transform** + ROC + pole–zero (10) · **DTFT** of a sequence (10) | 20 |
| **3** | **CTFT** (5) · **graphical convolution** (15) | 20 |
| **4** | **Butterworth LPF design** via the bilinear transform | 20 |
| **5** | **DIT-FFT flow graph** (15) · **IDFT by matrix method** (5) | 20 |

Transforms (Z, DTFT, CTFT, DFT/FFT) dominate — roughly **60 marks**.

## Drill these 5 first (≈70 marks, all method-based — guaranteed points)

1. **Graphical convolution** of two finite sequences → flip · shift · multiply · sum table. Output length $L_x + L_h - 1$.
2. **DIT-FFT** ($N = 8$ or $16$) → draw the butterfly flow graph, label twiddle factors, count non-trivial multiplications.
3. **Butterworth digital LPF** → pre-warp $\Omega = \tfrac{2}{T}\tan(\omega/2)$ → order $N$ → $\Omega_c$ → $H_a(s)$ → $H(z)$ via $s = \tfrac{2}{T}\tfrac{z-1}{z+1}$.
4. **Z-transform with ROC** → right-sided vs left-sided, pole–zero plot.
5. **IDFT by matrix method** → write the $N\times N$ matrix, multiply, divide by $N$.

**Q1 (properties) is free marks** — nail the test conditions and bank them fast.

## 24-hour plan

1. **Hours 0–3 (highest ROI):** graphical convolution + DIT-FFT butterfly until automatic — 30 guaranteed marks.
2. **Hours 3–7:** Butterworth design end-to-end, twice. Hardest 20-mark block.
3. **Hours 7–11:** Z-transform/ROC + DTFT + CTFT problems from the mock & tutorials. Memorise the pair tables.
4. **Hours 11–13:** DFT/IDFT matrix method + Q1 property tests.
5. **Then:** redo the **full mock exam, timed (2 h)**, mark against the solutions, and sleep $\ge 6$ h.

> The **Mock Exam + its solutions** are the single best resource — the real paper mirrors its structure.
