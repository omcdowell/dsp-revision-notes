# Filter Design (FIR / IIR)

## FIR filters

- Finite impulse response, non-recursive, **no feedback** (only zeros). Output depends on present + past **inputs** only.
- **Always stable**, can be **exactly linear phase**, no limit cycles. Cost: high order needed (more taps/memory).
- Transfer function: $H(z) = \displaystyle\sum_{n=0}^{N-1} h(n)\,z^{-n}$.
- **Linear phase** $\iff$ symmetric impulse response $h(n) = h(N-1-n)$, giving $\theta(\omega) = -\alpha\omega$ with constant delay $\alpha = \tfrac{N-1}{2}$.
- **Design (windowing):** pick ideal $H_d(\omega)$ → inverse-DTFT to $h_d(n)$ (infinite) → truncate with a window to finite $h(n)$.

## Windows

$$h(n) = h_d(n)\,w(n).$$

- **Rectangular:** $w(n) = 1$ — large ripple (Gibbs).
- **Hamming:** $w(n) = 0.54 - 0.46\cos\!\big(\tfrac{2\pi n}{N-1}\big)$.
- **Hanning:** $0.5 - 0.5\cos(\cdot)$;  **Blackman:** adds a $0.08\cos\!\big(\tfrac{4\pi n}{N-1}\big)$ term.
- Ideal LPF coefficients: $h_d(n) = \dfrac{\sin\big(\omega_c(n-\alpha)\big)}{\pi(n-\alpha)}$, with $h_d(\alpha) = \omega_c/\pi$.

```widget
filter-response
```

## IIR — Butterworth (maximally flat)

$$|H(\Omega)|^2 = \frac{1}{1 + (\Omega/\Omega_c)^{2N}}.$$

Monotonic, no ripple, slower roll-off than Chebyshev.

- **Order:** $N \ge \dfrac{1}{2}\,\dfrac{\log\!\big[(1/A_2^2 - 1)/(1/A_1^2 - 1)\big]}{\log(\Omega_2/\Omega_1)}$  (round up).
- **Cutoff:** $\Omega_c = \dfrac{\Omega_1}{(1/A_1^2 - 1)^{1/2N}}$.
- Poles lie **equally spaced on a circle of radius $\Omega_c$** in the left-half $s$-plane.

### Digital design via bilinear transform
1. Pre-warp the band edges: $\Omega = \dfrac{2}{T}\tan\!\big(\tfrac{\omega}{2}\big)$.
2. Find order $N$ and $\Omega_c$ from the prewarped specs.
3. Build the analogue $H_a(s)$ from the Butterworth poles.
4. Map to digital: $s = \dfrac{2}{T}\,\dfrac{z-1}{z+1}$ to get $H(z)$.

## Chebyshev (Type I) — vs Butterworth

$$|H(\Omega)|^2 = \frac{1}{1 + \varepsilon^2 C_N^2(\Omega/\Omega_c)}, \qquad \varepsilon = \big(1/A_1^2 - 1\big)^{1/2}.$$

- **Equiripple passband**, monotonic stopband; **sharper roll-off / narrower transition** for the same order $N$.
- Cost: passband ripple + more nonlinear phase.
- **Order:** $N \ge \dfrac{\cosh^{-1}\!\big[(1/\varepsilon)(1/A_2^2 - 1)^{1/2}\big]}{\cosh^{-1}(\Omega_2/\Omega_1)}$.
