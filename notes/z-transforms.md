# Z-Transforms

## Definition

$$X(z) = \sum_{n=-\infty}^{\infty} x(n)\,z^{-n}, \qquad z = re^{j\omega}.$$

Converges only inside the **ROC**. (Unilateral version sums from $n=0$.) At $r=1$ ($z = e^{j\omega}$) the Z-transform equals the DTFT — which therefore exists **only if the unit circle lies in the ROC**.

Rational form $X(z) = \dfrac{N(z)}{D(z)}$: **zeros** = roots of $N(z)$, **poles** = roots of $D(z)$.

## ROC rules (must-know)

- ROC is an annulus $R^-_x < |z| < R^+_x$ and contains **no poles**.
- **Right-sided / causal:** $|z| > a$ (exterior of the outermost pole).
- **Left-sided / anti-causal:** $|z| < \beta$ (interior of the innermost pole).
- **Two-sided:** a ring between poles.
- **Finite-length:** whole plane except possibly $z=0$ and/or $z=\infty$.

## Stability & causality

- **Stable** $\iff$ ROC includes the **unit circle** $|z| = 1$.
- **Causal** $\iff$ ROC is the **exterior** of the outermost pole (includes $z=\infty$).
- **Causal *and* stable** $\iff$ all poles lie **inside** the unit circle.

```widget
pole-zero
```

## Properties

| Property | Result |
|---|---|
| Linearity | $ax_1 + bx_2 \to aX_1 + bX_2$ |
| Time shift | $x(n-k) \to z^{-k}X(z)$ |
| Scaling | $a^{n}x(n) \to X(z/a)$ |
| Convolution | $x_1 * x_2 \to X_1 X_2$ |
| Time reversal | $x(-n) \to X(1/z)$ |

## Standard pairs

| $x(n)$ | $X(z)$ | ROC |
|---|---|---|
| $\delta(n)$ | $1$ | all $z$ |
| $u(n)$ | $\dfrac{z}{z-1}$ | $\lvert z\rvert > 1$ |
| $a^{n}u(n)$ | $\dfrac{z}{z-a}$ | $\lvert z\rvert > \lvert a\rvert$ |
| $-a^{n}u(-n-1)$ | $\dfrac{z}{z-a}$ | $\lvert z\rvert < \lvert a\rvert$ |
| $n\,a^{n}u(n)$ | $\dfrac{az^{-1}}{(1-az^{-1})^2}$ | $\lvert z\rvert > \lvert a\rvert$ |
| $\cos(\omega_0 n)u(n)$ | $\dfrac{1 - z^{-1}\cos\omega_0}{1 - 2z^{-1}\cos\omega_0 + z^{-2}}$ | $\lvert z\rvert > 1$ |

> $a^{n}u(n)$ and $-a^{n}u(-n-1)$ have the **same** $X(z)$ — only the ROC distinguishes them.

## Inverse Z-transform

1. **Partial fractions** — split $X(z)$, match each term to a pair, using the ROC to choose causal vs anti-causal. *Tip: expand $X(z)/z$, then multiply back by $z$ to get clean $\frac{z}{z-a}$ terms.*
2. **Power series / long division** — expand in $z^{-1}$; the coefficients are $x(n)$.
