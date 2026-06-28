# Signals, Systems & Convolution

## Signal classification

- **Continuous-time** $x(t)$ vs **discrete-time** $x(n)$.
- **Even:** $x(-t) = x(t)$.  **Odd:** $x(-t) = -x(t)$. Any signal decomposes:
$$x_e(t) = \tfrac{1}{2}\big[x(t) + x(-t)\big], \qquad x_o(t) = \tfrac{1}{2}\big[x(t) - x(-t)\big].$$
- **Periodic:** $x(t) = x(t+T)$ with $T = 2\pi/\omega$; discrete $x(n) = x(n+N)$ with $N = 2\pi/\omega$ (must be an **integer**). A sum of periodics is periodic only if the ratio of periods is **rational** ($T = \mathrm{LCM}$).
- **Energy:** $E = \displaystyle\int_{-\infty}^{\infty}|x(t)|^2\,dt$ or $\sum_{n}|x(n)|^2$.  **Power:** $P = \displaystyle\lim_{T\to\infty}\frac{1}{T}\int_{0}^{T}|x(t)|^2\,dt$.
  - **Energy signal:** $0 < E < \infty$, $P = 0$. **Power signal:** $0 < P < \infty$, $E = \infty$.

## Basic signals

- Impulse $\delta(t)$; unit step $u(t) = 1\,(t\ge 0),\ 0\,(t<0)$; ramp $r(t) = t\,u(t)$; exponential $e^{st}$.
- **Euler:** $e^{j\theta} = \cos\theta + j\sin\theta$.

## Signal operations
- **Shift** $x(t - t_0)$; **scale** $x(at)$ ($a>1$ compresses); **fold** $x(-t)$.

## System properties

| Property | Test |
|---|---|
| **Linear** | superposition: $H\{a_1x_1 + a_2x_2\} = a_1y_1 + a_2y_2$ |
| **Time-invariant** | input shift $\Rightarrow$ output shift only |
| **Causal** | output depends on present/past inputs only |
| **BIBO stable** | bounded in $\Rightarrow$ bounded out; for LTI: $\sum_n |h(n)| < \infty$ |
| **Memoryless** | output depends on present input only |

## Convolution

The output of an LTI system is the input convolved with the impulse response.

$$y(t) = \int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau, \qquad y(n) = \sum_{k=-\infty}^{\infty} x(k)\,h(n-k).$$

**Steps (discrete):** fold $h(k)\to h(-k)$, shift by $n$, multiply pointwise, sum; repeat for each $n$.

- **Output length:** $L_x + L_h - 1$.
- **Properties:** commutative $x*h = h*x$; associative; distributive $x*(h_1+h_2)$; identity $x*\delta = x$.
- Useful GP sum: $\displaystyle\sum_{n=0}^{N-1} a^n = \frac{1 - a^N}{1 - a}$.
