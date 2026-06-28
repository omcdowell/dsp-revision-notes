# Fourier Series & Transforms (CTFS · CTFT · DTFT)

> **Workhorse:** $\sin\theta = \dfrac{e^{j\theta} - e^{-j\theta}}{2j}, \qquad \cos\theta = \dfrac{e^{j\theta} + e^{-j\theta}}{2}.$

## CTFS — Continuous-Time Fourier Series (periodic, period $T$)

Fundamental frequency $\omega_0 = 2\pi/T$; $k$-th harmonic at $k\omega_0$.

$$\text{Synthesis: } x(t) = \sum_{k=-\infty}^{\infty} X_k\, e^{jk\omega_0 t}, \qquad \text{Analysis: } X_k = \frac{1}{T}\int_{T} x(t)\, e^{-jk\omega_0 t}\,dt.$$

- Method: expand $x(t)$ into complex exponentials with Euler, then read off $X_k$.
- Through an LTI system: $Y_k = X_k\,H(jk\omega_0)$.

```widget
fourier-series
```

## CTFT — Continuous-Time Fourier Transform (aperiodic)

$$X(j\omega) = \int_{-\infty}^{\infty} x(t)\,e^{-j\omega t}\,dt, \qquad x(t) = \frac{1}{2\pi}\int_{-\infty}^{\infty} X(j\omega)\,e^{j\omega t}\,d\omega.$$

**Key pairs**

| $x(t)$ | $X(j\omega)$ |
|---|---|
| $\delta(t)$ | $1$ |
| $e^{-at}u(t)$ | $\dfrac{1}{a + j\omega}$ |
| $e^{-a|t|}$ | $\dfrac{2a}{a^2 + \omega^2}$ |
| rect of width $a$ | $a\,\operatorname{sinc}\!\big(\tfrac{\omega a}{2}\big) = \dfrac{2\sin(\omega a/2)}{\omega}$ |

**Properties:** linearity; time-shift $x(t-t_0)\leftrightarrow e^{-j\omega t_0}X(j\omega)$; frequency-shift (1st shift theorem) $e^{j\omega_0 t}x(t)\leftrightarrow X(j(\omega-\omega_0))$; convolution $x*h\leftrightarrow X\cdot H$; Parseval $\int|x(t)|^2dt = \tfrac{1}{2\pi}\int|X(j\omega)|^2 d\omega$.

## DTFT — Discrete-Time Fourier Transform (periodic in $\omega$, period $2\pi$)

$$X(e^{j\omega}) = \sum_{n=-\infty}^{\infty} x(n)\,e^{-j\omega n}, \qquad x(n) = \frac{1}{2\pi}\int_{-\pi}^{\pi} X(e^{j\omega})\,e^{j\omega n}\,d\omega.$$

**Key pairs:** $\delta[n]\leftrightarrow 1$; $\delta[n-m]\leftrightarrow e^{-j\omega m}$; $a^{n}u[n]\leftrightarrow \dfrac{1}{1 - a e^{-j\omega}}$ for $|a|<1$.

- For finite sequences, just sum the terms (use $\sum r^n = \frac{1-r^N}{1-r}$).
- **Properties:** mirror the CTFT — linearity, time-shift $x(n-m)\leftrightarrow e^{-j\omega m}X$, frequency-shift, convolution $\leftrightarrow$ product, Parseval $\sum|x(n)|^2 = \tfrac{1}{2\pi}\int_{-\pi}^{\pi}|X(e^{j\omega})|^2 d\omega$.

> The solved exercises lean on the **frequency-shift (1st shift) theorem**, the pair $e^{-at}u(t)\leftrightarrow \frac{1}{a+j\omega}$, and rect $\to$ sinc.
