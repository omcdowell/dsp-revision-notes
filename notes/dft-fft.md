# DFT, IDFT & FFT

## DFT / IDFT

$$X(k) = \sum_{n=0}^{N-1} x(n)\,W_N^{nk}, \qquad x(n) = \frac{1}{N}\sum_{k=0}^{N-1} X(k)\,W_N^{-nk},$$

with the **twiddle factor** $W_N = e^{-j2\pi/N}$ (an $N$-th root of unity).

- 4-point powers: $W_4^0 = 1,\ W_4^1 = -j,\ W_4^2 = -1,\ W_4^3 = j$.
- 8-point: $W_8^1 = 0.707 - j0.707,\ W_8^2 = -j,\ W_8^3 = -0.707 - j0.707$.
- The DFT = $N$ equally-spaced samples of the DTFT on the unit circle = Z-transform at $z = e^{j2\pi k/N}$.
- 2-sample $\{A, B\} \to \{A+B,\ A-B\}$.

## Matrix method

$$\mathbf{X} = \mathbf{W}_N\,\mathbf{x},$$

where $\mathbf{X}, \mathbf{x}$ are $N\times 1$ and $\mathbf{W}_N$ is $N\times N$ with entry $W_N^{nk}$ (row $= k$, col $= n$).

4-point matrix:
$$\mathbf{W}_4 = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -j & -1 & j \\ 1 & -1 & 1 & -1 \\ 1 & j & -1 & -j \end{bmatrix}.$$

**Steps:** (1) write $\mathbf{W}_N$, (2) reduce each power mod $N$, (3) substitute values, (4) multiply matrix $\times$ column vector.

**IDFT via DFT trick:** $x(n) = \dfrac{1}{N}\big[\,\mathrm{DFT}\{X^{*}(k)\}\,\big]^{*}$ — conjugate $X$, take the DFT, conjugate the result, divide by $N$.

## Properties

- **Linearity:** $a x + b y \leftrightarrow a X + b Y$.
- **Periodicity:** $X(k+N) = X(k)$; $W_N^{k+N} = W_N^{k}$.
- **Symmetry:** $W_N^{k+N/2} = -W_N^{k}$; real $x \Rightarrow$ conjugate-symmetric $X$.
- **Circular convolution:** $x(n) \circledast z(n) \leftrightarrow X(k)Z(k)$ — **zero-pad to equal length $N$ first**.
- **Parseval:** $\dfrac{1}{N}\sum|x(n)|^2 = \sum|X(k)|^2$.

## FFT

Divide-and-conquer DFT; needs $N = 2^m$ (radix-2).

- **Cost:** DFT $= N^2$ mults, $N(N-1)$ adds. **FFT $= \tfrac{N}{2}\log_2 N$ mults, $N\log_2 N$ adds** (e.g. 64-pt: $4096 \to 192$).
- $\log_2 N$ stages, $N/2$ butterflies per stage; a butterfly is a 2-point DFT $a \pm W\!\cdot\! b$.
- **DIT** (decimation-in-time): input **bit-reversed**, output normal. **DIF**: input normal, output bit-reversed.
