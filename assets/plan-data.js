// AUTO-GENERATED for the Tonight's Cram Plan timer. Edit cards in scratchpad/cards/*.json and re-run assemble.mjs.
export const PLAN = [
  {
    "id": "q1-properties",
    "tag": "MOCK",
    "topic": "Q1 · System Properties",
    "min": 25,
    "note": "signals-systems-convolution.md",
    "intro": "Classify each system across 5 properties. Write a table, then state each test in one sentence from memory.",
    "tasks": [
      {
        "do": "Classify all 5 systems across every property",
        "detail": "For each system, decide **yes/no** for: Linear (L), Time-Invariant (TI), Causal (C), BIBO Stable (S), Memoryless (M). Give a one-line reason for every **no**.\n\n1. $y[n] = x[n] + x[n-1]$\n2. $y[n] = n\\,x[n]$\n3. $y[n] = x[-n]$\n4. $y(t) = x^2(t)$\n5. $y[n] = \\sum_{k=-\\infty}^{n} x[k]$",
        "check": "| System | L | TI | C | S | M |\n|---|---|---|---|---|---|\n| $y[n]=x[n]+x[n-1]$ | **Y** | **Y** | **Y** | **Y** | **N** — uses $x[n-1]$ |\n| $y[n]=n\\,x[n]$ | **Y** | **N** — $n$ scales by position, not shift-equiv | **Y** | **N** — $n$ unbounded so $ny[n]\\to\\infty$ | **Y** |\n| $y[n]=x[-n]$ | **Y** | **N** — reversal moves shift opposite direction | **N** — for $n<0$, $x[-n]$ is a future sample | **Y** | **N** |\n| $y(t)=x^2(t)$ | **N** — $(x_1+x_2)^2 \\neq x_1^2+x_2^2$ | **Y** | **Y** | **Y** — $|x|\\leq M \\Rightarrow |x^2|\\leq M^2$ | **Y** |\n| $y[n]=\\sum_{k=-\\infty}^{n}x[k]$ | **Y** | **Y** | **Y** | **N** — $h[n]=u[n]$, $\\sum|h[n]|=\\infty$ | **N** |"
      },
      {
        "do": "State the formal test for each property in one sentence",
        "detail": "Cover all five: Linearity, Time-Invariance, Causality, BIBO Stability, Memoryless. No notes.",
        "check": "**Linearity:** $H\\{a_1 x_1 + a_2 x_2\\} = a_1 H\\{x_1\\} + a_2 H\\{x_2\\}$ for all scalars $a_1, a_2$ and signals $x_1, x_2$.\n\n**Time-Invariance:** If input $x[n]$ produces output $y[n]$, then input $x[n-n_0]$ must produce output $y[n-n_0]$ for every integer $n_0$.\n\n**Causality:** $y[n]$ depends only on $x[k]$ for $k \\leq n$ — no future inputs used.\n\n**BIBO Stability (LTI shortcut):** $\\sum_{n=-\\infty}^{\\infty}|h[n]| < \\infty$; equivalently every bounded input produces a bounded output.\n\n**Memoryless:** $y[n]$ is completely determined by $x[n]$ at that instant alone — no stored past or anticipated future."
      }
    ],
    "formulas": [
      "Linearity: $H\\{a_1 x_1 + a_2 x_2\\} = a_1 y_1 + a_2 y_2$",
      "Time-invariance: $x[n-n_0] \\Rightarrow y[n-n_0]$",
      "BIBO (LTI): $\\sum_n |h[n]| < \\infty$",
      "Memoryless: $y[n]$ depends only on $x[n]$"
    ],
    "done_when": "You can reproduce the 5×5 property table from memory and recite every test definition without hesitation."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Stand up. Water. Roll your shoulders."
    ]
  },
  {
    "id": "fourier-series",
    "tag": "EXTRA",
    "topic": "Fourier Series",
    "min": 20,
    "note": "fourier.md",
    "intro": "CTFS: any periodic signal decomposes into complex exponentials. Analysis gives $X_k$; synthesis reconstructs $x(t)$.",
    "tasks": [
      {
        "do": "Compute exponential CTFS coefficients for a square wave",
        "detail": "A periodic square wave has amplitude $A$, period $T_0$, and 50% duty cycle (on for $|t| < T_0/4$, off otherwise — centred on $t = 0$). Use the analysis equation $X_k = \\frac{1}{T_0}\\int_{T_0} x(t)\\,e^{-jk\\omega_0 t}\\,dt$ to find $X_k$ for all $k$. Simplify to sinc form.",
        "check": "$X_k = \\frac{A}{T_0}\\int_{-T_0/4}^{T_0/4} e^{-jk\\omega_0 t}\\,dt = \\frac{A}{2}\\,\\operatorname{sinc}\\!\\left(\\frac{k}{2}\\right)$ (normalised sinc: $\\operatorname{sinc}(x)=\\frac{\\sin(\\pi x)}{\\pi x}$). DC: $X_0 = \\frac{A}{2}$. Even harmonics ($k = \\pm 2, \\pm 4, \\ldots$): $X_k = 0$ (sinc nulls). Odd: $X_1 = \\frac{A}{\\pi}$, $X_3 = -\\frac{A}{3\\pi}$, $X_5 = \\frac{A}{5\\pi}$."
      },
      {
        "do": "Write the trigonometric Fourier series; identify DC and harmonic amplitudes",
        "detail": "Convert the exponential series from task (a) to trigonometric (cosine) form. State the DC value and the amplitudes of the 1st, 3rd, and 5th harmonics. Explain why all even harmonics are absent.",
        "check": "$x(t)$ is real and even so $X_{-k} = X_k$ (all real), giving $x(t) = X_0 + \\sum_{k=1}^{\\infty} 2X_k \\cos(k\\omega_0 t)$. Substituting: $x(t) = \\frac{A}{2} + \\frac{2A}{\\pi}\\!\\left[\\cos(\\omega_0 t) - \\frac{1}{3}\\cos(3\\omega_0 t) + \\frac{1}{5}\\cos(5\\omega_0 t) - \\cdots\\right]$. DC $= A/2$; 1st harmonic amplitude $= 2A/\\pi \\approx 0.637A$; even harmonics vanish because $\\operatorname{sinc}(k/2) = 0$ when $k$ is a non-zero even integer."
      },
      {
        "do": "Sketch the line spectrum; state the CTFS → CTFT limit as $T_0 \\to \\infty$",
        "detail": "Describe the two-sided magnitude spectrum $|X_k|$ vs frequency $\\omega = k\\omega_0$ for the square wave above. Then explain what happens to the CTFS spectrum as $T_0 \\to \\infty$ and how this connects to the CTFT of a single rectangular pulse.",
        "check": "The spectrum consists of discrete lines at $\\omega = k\\omega_0$ ($k \\in \\mathbb{Z}$) with heights $|X_k| = \\frac{A}{2}\\left|\\operatorname{sinc}\\!\\left(\\frac{k}{2}\\right)\\right|$; the envelope is a sinc shape with nulls at even $k$. As $T_0 \\to \\infty$: line spacing $\\omega_0 = 2\\pi/T_0 \\to 0$, so discrete lines become infinitely dense and merge into a continuous spectrum. In the limit $T_0 X_k \\to X(j\\omega)$, the CTFT of one isolated rect pulse of width $T_0/2$ and amplitude $A$: $X(j\\omega) = A \\cdot \\frac{T_0}{2} \\operatorname{sinc}\\!\\left(\\frac{\\omega T_0}{4\\pi}\\right)$ — a continuous sinc envelope. This is the formal bridge between CTFS and CTFT."
      }
    ],
    "formulas": [
      "Analysis: $X_k = \\frac{1}{T_0}\\int_{T_0} x(t)\\,e^{-jk\\omega_0 t}\\,dt$",
      "Synthesis: $x(t) = \\sum_{k=-\\infty}^{\\infty} X_k\\,e^{jk\\omega_0 t}$",
      "Fundamental frequency: $\\omega_0 = \\frac{2\\pi}{T_0}$",
      "Trig form (real even signal): $x(t) = X_0 + \\sum_{k=1}^{\\infty} 2X_k \\cos(k\\omega_0 t)$",
      "LTI filtering: $Y_k = X_k H(jk\\omega_0)$",
      "50% duty square wave: $X_k = \\frac{A}{2}\\operatorname{sinc}\\!\\left(\\frac{k}{2}\\right)$, $\\quad X_0 = \\frac{A}{2}$"
    ],
    "done_when": "You can evaluate the analysis integral for a square wave, arrive at the sinc envelope formula, write out the trigonometric series with correct odd-harmonic amplitudes, explain why even harmonics vanish, and articulate how the CTFS discrete line spectrum becomes the continuous CTFT spectrum as T_0 → ∞."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Look out a window. Move for the full 5."
    ]
  },
  {
    "id": "q2-ztransform",
    "tag": "MOCK",
    "topic": "Q2 · Z-transform + ROC + DTFT",
    "min": 25,
    "note": "z-transforms.md",
    "intro": "Full Q2 drill: forward transforms, ROC rules, partial-fraction inverse, and DTFT validity.",
    "tasks": [
      {
        "do": "(a) Forward Z-transforms + ROC for three sequences",
        "detail": "Find $X(z)$ and its ROC for each sequence, then state the combined ROC and whether the DTFT exists.\n\n**i.** $x_1[n] = (0.5)^n u[n]$ (right-sided / causal)\n\n**ii.** $x_2[n] = -(0.8)^n u[-n-1]$ (left-sided / anti-causal)\n\n**iii.** $x[n] = x_1[n] + x_2[n]$ (two-sided sum). State the ROC and whether the DTFT of $x[n]$ exists.",
        "check": "**i.** Standard pair $a^n u[n] \\leftrightarrow \\dfrac{z}{z-a}$ with $a=0.5$:\n$$X_1(z) = \\dfrac{z}{z-0.5} = \\dfrac{1}{1-0.5z^{-1}}, \\quad |z| > 0.5$$\n\n**ii.** Standard pair $-a^n u[-n-1] \\leftrightarrow \\dfrac{z}{z-a}$ with $a=0.8$:\n$$X_2(z) = \\dfrac{z}{z-0.8} = \\dfrac{1}{1-0.8z^{-1}}, \\quad |z| < 0.8$$\n\n**iii.** By linearity:\n$$X(z) = \\dfrac{z}{z-0.5} + \\dfrac{z}{z-0.8}, \\quad \\text{ROC: } 0.5 < |z| < 0.8$$\n\nThe unit circle $|z|=1$ lies **outside** the ring $0.5 < |z| < 0.8$ (since $1 > 0.8$), so the DTFT of $x[n]$ **does not exist**."
      },
      {
        "do": "(b) Inverse Z-transform by partial fractions (causal)",
        "detail": "Given $$X(z) = \\dfrac{1}{(1-0.5z^{-1})(1-0.25z^{-1})}, \\quad |z| > 0.5$$\n\nFind $x[n]$ using partial fractions.",
        "check": "Write $X(z) = \\dfrac{A}{1-0.5z^{-1}} + \\dfrac{B}{1-0.25z^{-1}}$.\n\n**Find $A$:** multiply through by $(1-0.5z^{-1})$ and set $z=0.5$ (i.e. $z^{-1}=2$):\n$$A = \\left.\\dfrac{1}{1-0.25z^{-1}}\\right|_{z^{-1}=2} = \\dfrac{1}{1-0.5} = 2$$\n\n**Find $B$:** set $z=0.25$ (i.e. $z^{-1}=4$):\n$$B = \\left.\\dfrac{1}{1-0.5z^{-1}}\\right|_{z^{-1}=4} = \\dfrac{1}{1-2} = -1$$\n\nSo $X(z) = \\dfrac{2}{1-0.5z^{-1}} - \\dfrac{1}{1-0.25z^{-1}}$.\n\nROC $|z|>0.5$ ⇒ causal, use $a^n u[n]$ pair:\n$$x[n] = [2(0.5)^n - (0.25)^n]\\,u[n]$$"
      },
      {
        "do": "(c) Obtain the DTFT from X(z) and state validity condition",
        "detail": "Using $X(z)$ from part (b), write $X(e^{j\\omega})$ and justify why the DTFT exists in this case.",
        "check": "Set $z = e^{j\\omega}$ in the causal $X(z)$:\n$$X(e^{j\\omega}) = \\dfrac{1}{(1-0.5e^{-j\\omega})(1-0.25e^{-j\\omega})}$$\n\n**Validity:** The ROC is $|z|>0.5$, which **includes the unit circle** $|z|=1$. Equivalently, both poles ($z=0.5$ and $z=0.25$) lie strictly inside the unit circle ⇒ the system is causal and stable, and the DTFT exists."
      }
    ],
    "formulas": [
      "Right-sided: $a^n u[n] \\leftrightarrow \\dfrac{z}{z-a},\\; |z|>|a|$",
      "Left-sided: $-a^n u[-n-1] \\leftrightarrow \\dfrac{z}{z-a},\\; |z|<|a|$",
      "Linearity: $ax_1[n]+bx_2[n] \\leftrightarrow aX_1(z)+bX_2(z)$, ROC at least the intersection",
      "DTFT exists iff unit circle $|z|=1$ is in the ROC",
      "Causal + stable iff all poles inside $|z|=1$"
    ],
    "done_when": "All three parts answered without looking at notes; numerical answers match the check field exactly."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Don't sit. Shake it out."
    ]
  },
  {
    "id": "dft-props",
    "tag": "EXTRA",
    "topic": "DFT properties + circular convolution",
    "min": 20,
    "note": "dft-fft.md",
    "intro": "DFT properties, circular convolution via cyclic-matrix, and when circular equals linear. Skipped in mock — cover for completeness.",
    "tasks": [
      {
        "do": "(a) Compute the 4-point DFT of $x[n]=\\{1,2,3,4\\}$ using the matrix method.",
        "detail": "Form $\\mathbf{W}_4$ with entry $W_4^{nk}$ (row $k$, col $n$). Powers: $W_4^0=1,\\ W_4^1=-j,\\ W_4^2=-1,\\ W_4^3=j$. Multiply $\\mathbf{W}_4\\,[1,2,3,4]^T$ row by row.",
        "check": "$X(0)=1+2+3+4=10$; $X(1)=1+2(-j)+3(-1)+4(j)=-2+2j$; $X(2)=1+2(-1)+3(1)+4(-1)=-2$; $X(3)=1+2(j)+3(-1)+4(-j)=-2-2j$. So $X=\\{10,\\,-2+2j,\\,-2,\\,-2-2j\\}$."
      },
      {
        "do": "(b) Find the 4-point circular convolution $y=\\{1,2,1,0\\}\\circledast\\{1,1,0,0\\}$.",
        "detail": "Direct method: $y[m]=\\sum_{n=0}^{3}x[n]\\,h[(m-n)\\bmod 4]$. Compute $y[0],y[1],y[2],y[3]$ by cycling $h$ left for each $m$.",
        "check": "$y[0]=1\\cdot1+2\\cdot0+1\\cdot0+0\\cdot1=1$; $y[1]=1\\cdot1+2\\cdot1+1\\cdot0+0\\cdot0=3$; $y[2]=1\\cdot0+2\\cdot1+1\\cdot1+0\\cdot0=3$; $y[3]=1\\cdot0+2\\cdot0+1\\cdot1+0\\cdot1=1$. Answer: $y=\\{1,3,3,1\\}$."
      },
      {
        "do": "(c) Contrast circular vs linear convolution and state the zero-padding length that makes them equal.",
        "detail": "Linear conv of length-$N_1$ and length-$N_2$ sequences produces $N_1+N_2-1$ samples. N-point circular conv aliases tail samples back onto the start if $N<N_1+N_2-1$.",
        "check": "Zero-pad both sequences to $N\\ge N_1+N_2-1$ before taking the N-point circular conv. For $N_1=N_2=4$: need $N\\ge7$. The example above coincidentally gives the same result at $N=4$ because the linear result $\\{1,3,3,1,0,0,0\\}$ has zeros at indices 4-6 (h has trailing zeros), so no aliasing occurs."
      }
    ],
    "formulas": [
      "DFT: $X(k)=\\sum_{n=0}^{N-1}x(n)W_N^{nk}$, $W_N=e^{-j2\\pi/N}$",
      "4-pt twiddles: $W_4^0=1,\\ W_4^1=-j,\\ W_4^2=-1,\\ W_4^3=j$",
      "Circ-conv: $x\\circledast h\\leftrightarrow X(k)H(k)$; zero-pad to $N\\ge N_1+N_2-1$"
    ],
    "done_when": "X={10,-2+2j,-2,-2-2j} for (a); y={1,3,3,1} for (b); zero-padding rule N>=N1+N2-1 stated for (c)."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Quick snack. Hydrate."
    ]
  },
  {
    "id": "q3-convolution",
    "tag": "MOCK",
    "topic": "Q3 · CTFT + Graphical Convolution",
    "min": 25,
    "note": "signals-systems-convolution.md",
    "intro": "Region-by-region graphical convolution, a short discrete convolution, then recall the five standard CTFT pairs.",
    "tasks": [
      {
        "do": "Graphical convolution of $x(t)=u(t)-u(t-2)$ with $h(t)=e^{-t}u(t)$",
        "detail": "Compute $y(t) = x(t) * h(t)$ using the flip-shift-multiply-integrate method.\n\n**Setup:** $x(\\tau) = 1$ for $0 \\leq \\tau \\leq 2$, zero elsewhere. After flipping and shifting, $h(t-\\tau) = e^{-(t-\\tau)}$ for $\\tau \\leq t$, zero for $\\tau > t$.\n\nIdentify the three non-overlapping $t$-regions, write the integral limits for each, and evaluate to get a piecewise closed-form answer.",
        "check": "**Region 1 — $t < 0$:** The support $[0,2]$ of $x$ and the support $(-\\infty, t]$ of the flipped $h$ do not overlap. $y(t) = 0$.\n\n**Region 2 — $0 \\leq t < 2$:** Overlap is $[0,\\,t]$.\n$$y(t) = \\int_0^t e^{-(t-\\tau)}\\,d\\tau = e^{-t}\\left[e^{\\tau}\\right]_0^t = e^{-t}(e^t - 1) = 1 - e^{-t}$$\n\n**Region 3 — $t \\geq 2$:** Overlap is $[0,\\,2]$.\n$$y(t) = \\int_0^2 e^{-(t-\\tau)}\\,d\\tau = e^{-t}\\left[e^{\\tau}\\right]_0^2 = (e^2-1)e^{-t}$$\n\n$$y(t) = \\begin{cases} 0 & t < 0 \\\\\\\\ 1 - e^{-t} & 0 \\leq t < 2 \\\\\\\\ (e^2-1)\\,e^{-t} & t \\geq 2 \\end{cases}$$"
      },
      {
        "do": "Discrete linear convolution: $x[n]=\\{1,2,3\\}$, $h[n]=\\{1,1\\}$ (both start at $n=0$)",
        "detail": "State the output length first, then compute each sample $y[0], y[1], y[2], y[3]$ by the slide-and-sum method (or tabular): $y[n] = \\sum_k x[k]\\,h[n-k]$.",
        "check": "Output length $= L_x + L_h - 1 = 3 + 2 - 1 = 4$ samples.\n\n$$y[0] = x[0]\\,h[0] = 1 \\cdot 1 = 1$$\n$$y[1] = x[0]\\,h[1] + x[1]\\,h[0] = 1 \\cdot 1 + 2 \\cdot 1 = 3$$\n$$y[2] = x[1]\\,h[1] + x[2]\\,h[0] = 2 \\cdot 1 + 3 \\cdot 1 = 5$$\n$$y[3] = x[2]\\,h[1] = 3 \\cdot 1 = 3$$\n\n$$y[n] = \\{1,\\;3,\\;5,\\;3\\} \\text{ starting at } n=0$$"
      },
      {
        "do": "Recall the 5 standard CTFT pairs without notes",
        "detail": "Write $X(j\\omega)$ for each signal: (1) $\\delta(t)$, (2) $e^{-at}u(t)$ with $a>0$, (3) $\\cos(\\omega_0 t)$, (4) rectangular pulse $\\text{rect}(t/\\tau)$ of width $\\tau$, (5) unit step $u(t)$.",
        "check": "$$\\delta(t) \\longleftrightarrow 1$$\n$$e^{-at}u(t) \\longleftrightarrow \\frac{1}{a + j\\omega}, \\quad a > 0$$\n$$\\cos(\\omega_0 t) \\longleftrightarrow \\pi\\left[\\delta(\\omega - \\omega_0) + \\delta(\\omega + \\omega_0)\\right]$$\n$$\\text{rect}\\!\\left(\\frac{t}{\\tau}\\right) \\longleftrightarrow \\frac{\\tau\\,\\sin(\\omega\\tau/2)}{\\omega\\tau/2} = \\tau\\,\\text{sinc}\\!\\left(\\frac{\\omega\\tau}{2\\pi}\\right)$$\n$$u(t) \\longleftrightarrow \\pi\\,\\delta(\\omega) + \\frac{1}{j\\omega}$$"
      }
    ],
    "formulas": [
      "CT convolution: $y(t) = \\int_{-\\infty}^{\\infty} x(\\tau)\\,h(t-\\tau)\\,d\\tau$",
      "DT convolution: $y[n] = \\sum_k x[k]\\,h[n-k]$",
      "Output length: $L_y = L_x + L_h - 1$",
      "$e^{-at}u(t) \\leftrightarrow \\frac{1}{a+j\\omega}$",
      "$\\text{rect}(t/\\tau) \\leftrightarrow \\frac{\\tau\\sin(\\omega\\tau/2)}{\\omega\\tau/2}$"
    ],
    "done_when": "You can write the full piecewise answer for $x(t)*h(t)$, the 4-sample discrete result $\\{1,3,5,3\\}$, and all 5 CTFT pairs from memory without checking notes."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Eyes off screen. Breathe."
    ]
  },
  {
    "id": "fir-hamming",
    "tag": "EXTRA",
    "topic": "FIR design + Hamming window",
    "min": 20,
    "note": "filter-design.md",
    "intro": "Design a length-7 FIR LPF with cutoff $\\omega_c=\\pi/2$ using the windowing method with a Hamming window.",
    "tasks": [
      {
        "do": "(a) Compute ideal h_d[n] for n = -3 .. 3",
        "detail": "For $N=7$, $\\omega_c=\\pi/2$. Use $h_d[n]=\\frac{\\sin(\\omega_c n)}{\\pi n}$ for $n\\ne0$ and $h_d[0]=\\frac{\\omega_c}{\\pi}$. Give the 7 values as exact fractions and decimals.",
        "check": "$h_d[0]=\\frac{1}{2}=0.5000$. $h_d[\\pm1]=\\frac{\\sin(\\pi/2)}{\\pi}=\\frac{1}{\\pi}\\approx0.3183$. $h_d[\\pm2]=\\frac{\\sin(\\pi)}{2\\pi}=0$. $h_d[\\pm3]=\\frac{\\sin(3\\pi/2)}{3\\pi}=\\frac{-1}{3\\pi}\\approx-0.1061$. Note symmetry: $h_d[-n]=h_d[n]$ (ideal LPF is even)."
      },
      {
        "do": "(b) Apply Hamming window and tabulate h[n]",
        "detail": "For $N=7$, the Hamming window in causal form is $w[m]=0.54-0.46\\cos\\!\\left(\\frac{2\\pi m}{6}\\right)$, $m=0,\\ldots,6$. Map to centred index via $m=n+3$. Compute $h[n]=h_d[n]\\cdot w[n+3]$ for $n=-3..3$.",
        "check": "Window values (centred): $w[-3]=0.08,\\;w[-2]=0.31,\\;w[-1]=0.77,\\;w[0]=1.00,\\;w[1]=0.77,\\;w[2]=0.31,\\;w[3]=0.08$. Windowed filter: $h[\\pm3]=(-0.1061)(0.08)\\approx-0.0085$; $h[\\pm2]=0$; $h[\\pm1]=(0.3183)(0.77)\\approx0.2451$; $h[0]=(0.5)(1.00)=0.5000$. Sequence is symmetric, confirming linear phase."
      },
      {
        "do": "(c) Gibbs phenomenon and window comparison",
        "detail": "Explain what Gibbs phenomenon is, why the rectangular window causes it, and how Hamming vs Hanning vs rectangular windows trade off sidelobe attenuation against transition-band width.",
        "check": "Truncating $h_d[n]$ to finite length is equivalent to multiplying by a rectangular window in time, which convolves the ideal spectrum with a Dirichlet kernel in frequency. This produces oscillatory overshoot (Gibbs): ~9% regardless of $N$. Hamming ($0.54-0.46\\cos$) and Hanning ($0.5-0.5\\cos$) taper smoothly to near-zero at the ends, reducing sidelobe energy. Rectangular: ~13 dB sidelobe attenuation, 0.9$(2\\pi/N)$ transition width. Hanning: ~31 dB, wider transition. Hamming: ~41 dB, similar width to Hanning but higher at-band ripple. Blackman: ~57 dB, widest transition. More attenuation always costs a wider transition band."
      }
    ],
    "formulas": [
      "Ideal LPF: $h_d[n]=\\frac{\\sin(\\omega_c n)}{\\pi n}$, $h_d[0]=\\frac{\\omega_c}{\\pi}$",
      "Hamming: $w[n]=0.54-0.46\\cos\\!\\frac{2\\pi n}{N-1}$, $n=0,\\ldots,N-1$",
      "Windowing: $h[n]=h_d[n]\\,w[n]$",
      "Linear phase iff $h[n]=h[N-1-n]$ (symmetric)"
    ],
    "done_when": "You can reproduce all 7 $h_d$ values, all 7 window values, all 7 $h[n]$ values, and explain Gibbs phenomenon plus the three-way window tradeoff without looking at notes."
  },
  {
    "type": "break",
    "min": 15,
    "topic": "Long break — eat / rest",
    "tasks": [
      "Real food. Lie down if you need it.",
      "Do NOT start scrolling — come back to this tab in 15."
    ]
  },
  {
    "id": "q4-butterworth",
    "tag": "MOCK",
    "topic": "Q4 · Butterworth LPF via bilinear",
    "min": 25,
    "note": "filter-design.md",
    "intro": "Full bilinear-transform Butterworth LPF design: $\\omega_p=0.2\\pi$, $\\omega_s=0.5\\pi$, $A_p=1$ dB, $A_s=15$ dB, $T=1$.",
    "tasks": [
      {
        "do": "(a) Prewarp the digital band edges to analogue frequencies",
        "detail": "Apply $\\Omega=\\frac{2}{T}\\tan\\!\\left(\\frac{\\omega}{2}\\right)$ with $T=1$ to both $\\omega_p=0.2\\pi$ and $\\omega_s=0.5\\pi$.",
        "check": "$\\Omega_p=2\\tan(0.1\\pi)=2\\tan(18^\\circ)\\approx2\\times0.3249=0.6498$. $\\Omega_s=2\\tan(0.25\\pi)=2\\tan(45^\\circ)=2\\times1.000=2.000$. Selectivity ratio: $\\Omega_s/\\Omega_p=2.000/0.6498\\approx3.077$."
      },
      {
        "do": "(b) Find filter order N and analogue cutoff $\\Omega_c$",
        "detail": "Convert dB specs: $1/A_1^2-1=10^{A_p/10}-1$ and $1/A_2^2-1=10^{A_s/10}-1$. Plug into the Butterworth order formula. Round up to integer. Then find $\\Omega_c$ from the passband constraint.",
        "check": "$1/A_1^2-1=10^{0.1}-1=0.2589$. $1/A_2^2-1=10^{1.5}-1=30.623$. $N\\ge\\frac{1}{2}\\frac{\\log(30.623/0.2589)}{\\log(3.077)}=\\frac{1}{2}\\frac{\\log(118.3)}{\\log(3.077)}=\\frac{1}{2}\\frac{2.073}{0.488}=2.12\\Rightarrow N=3$. $\\Omega_c=\\frac{\\Omega_p}{(1/A_1^2-1)^{1/(2N)}}=\\frac{0.6498}{(0.2589)^{1/6}}=\\frac{0.6498}{0.7983}\\approx0.814$."
      },
      {
        "do": "(c) Construct the analogue prototype $H_a(s)$",
        "detail": "For $N=3$ Butterworth, write the normalised poles, scale to $\\Omega_c=0.814$, and express $H_a(s)$ in factored form (one real pole, one conjugate pair).",
        "check": "Normalised $N=3$ Butterworth poles: $s_1=-1$, $s_{2,3}=-\\tfrac{1}{2}\\pm j\\frac{\\sqrt{3}}{2}$. Scaled by $\\Omega_c=0.814$: $s_1=-0.814$, $s_{2,3}=-0.407\\pm j0.705$. $H_a(s)=\\frac{\\Omega_c^3}{(s+0.814)(s^2+0.814s+0.662)}=\\frac{0.539}{(s+0.814)(s^2+0.814s+0.662)}$. Denominator second-order coefficient: $0.814^2=0.662$."
      },
      {
        "do": "(d) Apply the bilinear transform to obtain $H(z)$",
        "detail": "Substitute $s=\\frac{2}{T}\\frac{z-1}{z+1}=2\\frac{z-1}{z+1}$ into each factor of $H_a(s)$, collect terms, and express $H(z)$ as a ratio of polynomials in $z$ (or $z^{-1}$). Verify DC gain $H(z)|_{z=1}=1$.",
        "check": "First-order factor: $s+0.814\\to\\frac{2(z-1)+0.814(z+1)}{z+1}=\\frac{2.814z-1.186}{z+1}$. Second-order factor: $s^2+0.814s+0.662\\to\\frac{4(z-1)^2+1.628(z^2-1)+0.662(z+1)^2}{(z+1)^2}=\\frac{6.290z^2-6.676z+3.034}{(z+1)^2}$. So $H(z)=\\frac{0.539(z+1)^3}{(2.814z-1.186)(6.290z^2-6.676z+3.034)}$. DC check: $z=1\\Rightarrow$ numerator $0.539\\times8=4.31$; denominator $(1.628)(3.648)=5.94$; ratio $\\approx0.726$. To guarantee $H(1)=1$, normalise the overall gain."
      }
    ],
    "formulas": [
      "Prewarp: $\\Omega=\\frac{2}{T}\\tan\\!\\frac{\\omega}{2}$",
      "Order: $N\\ge\\frac{1}{2}\\frac{\\log[(1/A_2^2-1)/(1/A_1^2-1)]}{\\log(\\Omega_s/\\Omega_p)}$",
      "Cutoff: $\\Omega_c=\\frac{\\Omega_p}{(1/A_1^2-1)^{1/(2N)}}$",
      "Butter mag: $|H(\\Omega)|^2=\\frac{1}{1+(\\Omega/\\Omega_c)^{2N}}$",
      "Bilinear: $s=\\frac{2}{T}\\frac{z-1}{z+1}$"
    ],
    "done_when": "You execute all four steps—prewarp, order+cutoff, $H_a(s)$ factored, bilinear substitution started—with only the formula sheet and calculator, no notes, and get $N=3$, $\\Omega_c\\approx0.814$."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Stretch. Shake it out."
    ]
  },
  {
    "id": "chebyshev",
    "tag": "EXTRA",
    "topic": "Chebyshev filters",
    "min": 20,
    "note": "filter-design.md",
    "intro": "Chebyshev Type I: compute the ripple parameter $\\varepsilon$, find order $N$, and contrast with Butterworth.",
    "tasks": [
      {
        "do": "(a) Compute ripple parameter $\\varepsilon$ for $A_p = 1$ dB",
        "detail": "Use $\\varepsilon=\\sqrt{10^{0.1A_p}-1}$ with $A_p=1\\,\\text{dB}$. Give the exact expression and a decimal value.",
        "check": "$\\varepsilon=\\sqrt{10^{0.1}-1}=\\sqrt{1.2589-1}=\\sqrt{0.2589}\\approx0.5088$. Interpretation: at the passband edge the magnitude squared equals $1/(1+\\varepsilon^2 C_N^2(1))=1/(1+\\varepsilon^2)=1/1.2589$, which is exactly $-1$ dB."
      },
      {
        "do": "(b) Find Chebyshev order $N$ for $A_p=1$ dB, $A_s=15$ dB, same prewarped ratio $\\Omega_s/\\Omega_p=3.077$",
        "detail": "Use $N\\ge\\frac{\\cosh^{-1}\\![(1/\\varepsilon)(1/A_2^2-1)^{1/2}]}{\\cosh^{-1}(\\Omega_s/\\Omega_p)}$ with $\\cosh^{-1}x=\\ln(x+\\sqrt{x^2-1})$. Compare result to Butterworth $N=3$.",
        "check": "$(1/A_2^2-1)^{1/2}=\\sqrt{10^{1.5}-1}=\\sqrt{30.623}\\approx5.534$. Numerator arg: $(1/0.5088)\\times5.534\\approx10.88$. $\\cosh^{-1}(10.88)=\\ln(10.88+\\sqrt{10.88^2-1})=\\ln(10.88+10.83)=\\ln(21.71)\\approx3.077$. Denominator: $\\cosh^{-1}(3.077)=\\ln(3.077+\\sqrt{3.077^2-1})=\\ln(3.077+2.910)=\\ln(5.987)\\approx1.789$. $N\\ge3.077/1.789=1.72\\Rightarrow N=2$. Chebyshev achieves the same specs with $N=2$ vs Butterworth $N=3$: sharper roll-off at lower order."
      },
      {
        "do": "(c) Compare Chebyshev Type I vs Butterworth",
        "detail": "For the same filter order $N$, summarise differences in magnitude shape, pole locations, phase, and when to prefer each type.",
        "check": "Butterworth: maximally flat (monotonic) in both passband and stopband; poles equally spaced on a circle of radius $\\Omega_c$ in the left-half $s$-plane; gentler roll-off; more linear phase. Chebyshev I: equiripple passband (ripple bounded by $\\varepsilon$, oscillates exactly $N$ times); monotonic stopband; sharper roll-off (or lower $N$) for same spec; poles lie on an ellipse in the $s$-plane; more nonlinear phase (worse group delay). Prefer Butterworth when flat passband or phase linearity matters. Prefer Chebyshev when minimising filter order or transition bandwidth is the priority."
      }
    ],
    "formulas": [
      "Ripple param: $\\varepsilon=\\sqrt{10^{0.1A_p}-1}$",
      "Cheby order: $N\\ge\\frac{\\cosh^{-1}[(1/\\varepsilon)(1/A_2^2-1)^{1/2}]}{\\cosh^{-1}(\\Omega_s/\\Omega_p)}$",
      "Cheby mag: $|H(\\Omega)|^2=\\frac{1}{1+\\varepsilon^2 C_N^2(\\Omega/\\Omega_c)}$",
      "$\\cosh^{-1}x=\\ln(x+\\sqrt{x^2-1})$"
    ],
    "done_when": "You can compute $\\varepsilon$, evaluate the cosh-inverse order formula numerically, and state at least 3 concrete differences between Chebyshev and Butterworth from memory."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Water. Look far away."
    ]
  },
  {
    "id": "q5-fft",
    "tag": "MOCK",
    "topic": "Q5 · DIT-FFT + IDFT matrix",
    "min": 25,
    "note": "dft-fft.md",
    "intro": "Full Q5 workout: bit-reversal order, 3-stage butterfly flow graph for 8-pt DIT, then matrix IDFT on a known spectrum.",
    "tasks": [
      {
        "do": "(a) List the bit-reversed input order for an 8-point DIT-FFT and give twiddle factors $W_8^k$ for $k=0,1,2,3$.",
        "detail": "Bit-reverse each index 0–7 using its 3-bit binary representation (e.g. $6=110_2\\to011_2=3$). Twiddle: $W_8^k=e^{-j2\\pi k/8}$.",
        "check": "Bit-reversed index sequence: $[0,4,2,6,1,5,3,7]$, so input is $[x_0,x_4,x_2,x_6,x_1,x_5,x_3,x_7]$. Twiddles: $W_8^0=1$; $W_8^1\\approx0.707-j0.707$; $W_8^2=-j$; $W_8^3\\approx-0.707-j0.707$."
      },
      {
        "do": "(b) Describe the 3 butterfly stages of the 8-point DIT-FFT flow graph.",
        "detail": "Each butterfly: $A'=A+W_N^k B$, $B'=A-W_N^k B$. There are $\\log_2 8=3$ stages with $N/2=4$ butterflies each. The twiddle exponent stride doubles each stage.",
        "check": "Stage 1 — 4 butterflies, all $W_8^0=1$ (4 independent 2-pt DFTs on adjacent pairs). Stage 2 — 4 butterflies in 2 groups, twiddling by $W_8^0$ and $W_8^2$. Stage 3 — 4 butterflies in 1 group, twiddling by $W_8^0,W_8^1,W_8^2,W_8^3$. Output emerges in natural order 0..7."
      },
      {
        "do": "(c) Recover $x[n]$ from $X=\\{6,\\,-2+2j,\\,-2,\\,-2-2j\\}$ via $x=\\frac{1}{4}\\mathbf{W}_4^*\\mathbf{X}$.",
        "detail": "$\\mathbf{W}_4^*$ has entry $W_4^{-nk}$, flipping sign on exponent: row 0 is $[1,1,1,1]$, row 1 is $[1,j,-1,-j]$, row 2 is $[1,-1,1,-1]$, row 3 is $[1,-j,-1,j]$. Multiply each row by $\\mathbf{X}$ then divide by 4.",
        "check": "$x[0]=\\frac{1}{4}(6+(-2+2j)+(-2)+(-2-2j))=\\frac{1}{4}(0)=0$; $x[1]=\\frac{1}{4}(6+j(-2+2j)+2+(-j)(-2-2j))=\\frac{1}{4}(4)=1$; $x[2]=\\frac{1}{4}(6-(-2+2j)+(-2)-(-2-2j))=\\frac{1}{4}(8)=2$; $x[3]=\\frac{1}{4}(6+(-j)(-2+2j)+2+j(-2-2j))=\\frac{1}{4}(12)=3$. Answer: $x=\\{0,1,2,3\\}$."
      }
    ],
    "formulas": [
      "DIT butterfly: $A'=A+W_N^k B,\\quad B'=A-W_N^k B$",
      "IDFT (matrix): $x=\\frac{1}{N}\\mathbf{W}_N^*\\mathbf{X}$, entry $(n,k)=W_N^{-nk}$",
      "8-pt twiddles: $W_8^1=0.707-j0.707,\\ W_8^2=-j,\\ W_8^3=-0.707-j0.707$"
    ],
    "done_when": "Correct bit-reversed order [0,4,2,6,1,5,3,7]; 3-stage butterfly description with twiddle factors; x={0,1,2,3} recovered from IDFT."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Stand, breathe, reset."
    ]
  },
  {
    "id": "dip",
    "tag": "EXTRA",
    "topic": "Digital Image Processing",
    "min": 20,
    "note": "digital-image-processing.md",
    "intro": "DIP absent from the mock — biggest blind spot. Master: YIQ matrix, storage arithmetic, 3×3 averaging filter, and contrast stretching.",
    "tasks": [
      {
        "do": "Convert RGB → YIQ using the formula-sheet matrix",
        "detail": "Pixel: $R=0.5,\\ G=0.2,\\ B=0.1$ (normalised 0–1). Use the NTSC matrix to compute $Y$, $I$, $Q$.\n\n$$\\begin{bmatrix}Y\\\\I\\\\Q\\end{bmatrix}=\\begin{bmatrix}0.299&0.587&0.114\\\\0.596&-0.274&-0.322\\\\0.211&-0.523&0.312\\end{bmatrix}\\begin{bmatrix}R\\\\G\\\\B\\end{bmatrix}$$",
        "check": "$Y=0.299(0.5)+0.587(0.2)+0.114(0.1)=0.1495+0.1174+0.0114=\\mathbf{0.278}$\n$I=0.596(0.5)-0.274(0.2)-0.322(0.1)=0.2980-0.0548-0.0322=\\mathbf{0.211}$\n$Q=0.211(0.5)-0.523(0.2)+0.312(0.1)=0.1055-0.1046+0.0312=\\mathbf{0.032}$\n\n$Y$ is luminance; $I,Q$ carry chrominance (hue & saturation)."
      },
      {
        "do": "Storage arithmetic — sampling & quantisation",
        "detail": "A **grayscale** $512\\times512$ image uses 256 gray levels. (a) Bits per pixel? (b) Total uncompressed bytes? (c) Same resolution as 24-bit RGB — how many bytes?",
        "check": "(a) $L=256=2^8$ → **8 bits/pixel**.\n(b) $512\\times512\\times8\\text{ bits}=2{,}097{,}152\\text{ bits}=\\mathbf{262{,}144}\\text{ bytes (256 KB)}$.\n(c) RGB: $512\\times512\\times3=\\mathbf{786{,}432}\\text{ bytes (768 KB)}$."
      },
      {
        "do": "Apply a 3×3 box (averaging) filter",
        "detail": "Find the output at the **centre pixel** after applying a $3\\times3$ mean filter to this neighbourhood:\n\n$$\\begin{bmatrix}60&90&120\\\\30&180&150\\\\90&120&60\\end{bmatrix}$$",
        "check": "Sum $=60+90+120+30+180+150+90+120+60=900$.\nOutput $=900\\div9=\\mathbf{100}$.\n\nThe high centre (180) is pulled down to 100 — averaging smooths noise but blurs edges."
      },
      {
        "do": "Linear contrast stretch",
        "detail": "An image has intensities in $[50,200]$ but the display range is $[0,255]$. Apply the linear stretch to a pixel at intensity **120**.\n\n$$f_{\\text{out}}=\\frac{f_{\\text{in}}-f_{\\min}}{f_{\\max}-f_{\\min}}\\times255$$",
        "check": "$f_{\\text{out}}=\\dfrac{120-50}{200-50}\\times255=\\dfrac{70}{150}\\times255\\approx\\mathbf{119}$.\n\nEdge check: $50\\to0$, $200\\to255$. The narrow histogram is stretched across $[0,255]$, boosting perceived contrast."
      },
      {
        "do": "2-D DWT subbands & RGB colour model recall",
        "detail": "(a) Name the **4 subbands** produced by one level of 2-D DWT and state what each captures. (b) Which RGB combinations give **Cyan**, **Yellow**, and **Magenta**? (c) In YIQ, why is $Y$ kept separate from $I$ and $Q$?",
        "check": "(a) **LL** — low-frequency approximation (shape/DC); **LH** — horizontal edges; **HL** — vertical edges; **HH** — diagonal texture/detail.\n(b) Cyan $=G+B$; Yellow $=R+G$; Magenta $=R+B$.\n(c) $Y=0.299R+0.587G+0.114B$ is perceptual luminance. Separating it gives NTSC backward-compatibility: B&W TVs use only $Y$; colour TVs decode $I,Q$ chrominance."
      }
    ],
    "formulas": [
      "YIQ matrix: $$\\begin{bmatrix}Y\\\\I\\\\Q\\end{bmatrix}=\\begin{bmatrix}0.299&0.587&0.114\\\\0.596&-0.274&-0.322\\\\0.211&-0.523&0.312\\end{bmatrix}\\begin{bmatrix}R\\\\G\\\\B\\end{bmatrix}$$",
      "Luminance: $Y=0.299R+0.587G+0.114B$",
      "Gray levels: $L=2^k$ where $k$ = bits/pixel",
      "Storage: $\\text{bits}=M\\times N\\times k$",
      "Box filter output: $\\hat{f}=\\tfrac{1}{9}\\sum_{(i,j)\\in W}f(i,j)$",
      "Contrast stretch: $f_{\\text{out}}=\\dfrac{f_{\\text{in}}-f_{\\min}}{f_{\\max}-f_{\\min}}\\times(L-1)$"
    ],
    "done_when": "All 5 checks verified without notes: YIQ — Y≈0.278, I≈0.211, Q≈0.032; grayscale storage = 262144 bytes; box-filter output = 100; contrast-stretch output ≈ 119; all 4 DWT subbands named and all 3 RGB secondaries correct."
  },
  {
    "type": "break",
    "min": 10,
    "topic": "Break before the speed round",
    "tasks": [
      "10 min. Next three are timed, no-notes redos."
    ]
  },
  {
    "id": "speed-zt",
    "tag": "DRILL",
    "topic": "SPEED · Z-transform redo",
    "min": 20,
    "note": "z-transforms.md",
    "intro": "Q2-style timed drill — complete all three parts in ≤18 min with NO notes. Different numbers from card 1.",
    "tasks": [
      {
        "do": "Full Q2-style problem from scratch in ≤18 min (no notes)",
        "detail": "**Part A — Forward transforms + ROC.**\n\nFind $Y(z)$ and its ROC for each sequence, then give the two-sided ROC and state whether the DTFT exists.\n\n- $y_1[n] = (0.4)^n u[n]$ (right-sided)\n- $y_2[n] = -(1.5)^n u[-n-1]$ (left-sided)\n- $y[n] = y_1[n] + y_2[n]$ (two-sided)\n\n---\n\n**Part B — Inverse Z-transform by partial fractions.**\n\nGiven $$H(z) = \\dfrac{1}{(1-0.6z^{-1})(1-0.3z^{-1})}, \\quad |z| > 0.6 \\text{ (causal)}$$\n\nFind $h[n]$.\n\n---\n\n**Part C — DTFT.**\n\nWrite $H(e^{j\\omega})$ and justify why the DTFT exists.",
        "check": "**Part A:**\n\n$Y_1(z) = \\dfrac{z}{z-0.4}$, ROC: $|z| > 0.4$\n\n$Y_2(z) = \\dfrac{z}{z-1.5}$, ROC: $|z| < 1.5$\n\n$$Y(z) = \\dfrac{z}{z-0.4} + \\dfrac{z}{z-1.5}, \\quad \\text{ROC: } 0.4 < |z| < 1.5$$\n\nUnit circle $|z|=1$ lies inside the ring $0.4 < |z| < 1.5$ ✓ → DTFT **exists** for $y[n]$.\n\n---\n\n**Part B:**\n\nWrite $H(z) = \\dfrac{A}{1-0.6z^{-1}} + \\dfrac{B}{1-0.3z^{-1}}$.\n\n**Find $A$:** set $z=0.6$ ($z^{-1}=1/0.6$):\n$$A = \\left.\\dfrac{1}{1-0.3z^{-1}}\\right|_{z^{-1}=1/0.6} = \\dfrac{1}{1-0.3/0.6} = \\dfrac{1}{1-0.5} = 2$$\n\n**Find $B$:** set $z=0.3$ ($z^{-1}=1/0.3$):\n$$B = \\left.\\dfrac{1}{1-0.6z^{-1}}\\right|_{z^{-1}=1/0.3} = \\dfrac{1}{1-0.6/0.3} = \\dfrac{1}{1-2} = -1$$\n\n$$H(z) = \\dfrac{2}{1-0.6z^{-1}} - \\dfrac{1}{1-0.3z^{-1}}$$\n\nROC $|z|>0.6$ ⇒ causal, use $a^n u[n]$ pair:\n$$h[n] = [2(0.6)^n - (0.3)^n]\\,u[n]$$\n\n---\n\n**Part C:**\n\n$$H(e^{j\\omega}) = \\dfrac{1}{(1-0.6e^{-j\\omega})(1-0.3e^{-j\\omega})}$$\n\nValid: ROC $|z|>0.6$ includes unit circle $|z|=1$. Both poles ($z=0.6$, $z=0.3$) are strictly inside the unit circle ⇒ causal and stable ⇒ DTFT exists."
      }
    ],
    "formulas": [
      "Right-sided: $a^n u[n] \\leftrightarrow \\dfrac{z}{z-a},\\; |z|>|a|$",
      "Left-sided: $-a^n u[-n-1] \\leftrightarrow \\dfrac{z}{z-a},\\; |z|<|a|$",
      "Two-sided ROC: intersection of individual ROCs",
      "DTFT = $X(z)$ at $z=e^{j\\omega}$, valid iff unit circle is in ROC"
    ],
    "done_when": "All three parts completed from memory in ≤18 min; numerical answers match the check field exactly."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Move."
    ]
  },
  {
    "id": "speed-butter",
    "tag": "DRILL",
    "topic": "SPEED · Butterworth redo",
    "min": 20,
    "note": "filter-design.md",
    "intro": "Timed no-notes drill: Butterworth via bilinear. $\\omega_p=0.3\\pi$, $\\omega_s=0.6\\pi$, $A_p=3$ dB, $A_s=20$ dB, $T=1$.",
    "tasks": [
      {
        "do": "Full design: prewarp → order $N$ → cutoff $\\Omega_c$ → $H_a(s)$ → bilinear substitution",
        "detail": "Given $\\omega_p=0.3\\pi$, $\\omega_s=0.6\\pi$, $A_p=3\\,\\text{dB}$, $A_s=20\\,\\text{dB}$, $T=1$. Work all four steps without notes. Time yourself: target under 20 minutes.",
        "check": "(a) Prewarp: $\\Omega_p=2\\tan(0.15\\pi)=2\\tan(27^\\circ)\\approx2\\times0.5095=1.019$; $\\Omega_s=2\\tan(0.3\\pi)=2\\tan(54^\\circ)\\approx2\\times1.3764=2.753$; ratio $\\Omega_s/\\Omega_p\\approx2.702$. (b) $1/A_1^2-1=10^{0.3}-1=1.000$; $1/A_2^2-1=10^{2.0}-1=99.0$; $N\\ge\\frac{1}{2}\\frac{\\log(99.0/1.000)}{\\log(2.702)}=\\frac{1}{2}\\frac{1.9956}{0.4317}=2.31\\Rightarrow N=3$. Key shortcut: $A_p=3\\,\\text{dB}\\Rightarrow1/A_1^2-1=1\\Rightarrow\\Omega_c=\\Omega_p/(1)^{1/6}=\\Omega_p=1.019$. (c) $H_a(s)=\\frac{(1.019)^3}{(s+1.019)(s^2+1.019s+1.038)}=\\frac{1.058}{(s+1.019)(s^2+1.019s+1.038)}$. Poles: $s_1=-1.019$, $s_{2,3}=-0.510\\pm j0.883$. (d) Bilinear first-order factor: $s+1.019\\to\\frac{2(z-1)+1.019(z+1)}{z+1}=\\frac{3.019z-0.981}{z+1}$. Second-order factor: $s^2+1.019s+1.038\\to\\frac{4(z^2-2z+1)+2.038(z^2-1)+1.038(z^2+2z+1)}{(z+1)^2}=\\frac{7.076z^2-5.924z+3.000}{(z+1)^2}$. Final: $H(z)=\\frac{1.058(z+1)^3}{(3.019z-0.981)(7.076z^2-5.924z+3.000)}$."
      }
    ],
    "formulas": [
      "Prewarp: $\\Omega=\\frac{2}{T}\\tan\\!\\frac{\\omega}{2}$",
      "Order: $N\\ge\\frac{1}{2}\\frac{\\log[(1/A_2^2-1)/(1/A_1^2-1)]}{\\log(\\Omega_s/\\Omega_p)}$",
      "Cutoff: $\\Omega_c=\\frac{\\Omega_p}{(1/A_1^2-1)^{1/(2N)}}$",
      "Bilinear: $s=\\frac{2}{T}\\frac{z-1}{z+1}$",
      "Shortcut: $A_p=3\\,\\text{dB}\\Rightarrow(1/A_1^2-1)=1\\Rightarrow\\Omega_c=\\Omega_p$"
    ],
    "done_when": "You get $N=3$, $\\Omega_c=1.019$, the correct factored $H_a(s)$, and the bilinear substitution set up with numeric coefficients, all within 20 minutes from a cold start."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Water. Breathe."
    ]
  },
  {
    "id": "speed-fft",
    "tag": "DRILL",
    "topic": "SPEED · FFT + IDFT redo",
    "min": 20,
    "note": "dft-fft.md",
    "intro": "Timed no-notes drill: 4-point DIT-FFT of a simple sequence then full IDFT matrix check. Target 15 min.",
    "tasks": [
      {
        "do": "TIMED 15 min: compute the 4-point DIT-FFT of $x[n]=\\{1,0,1,0\\}$, then verify via IDFT.",
        "detail": "Step 1 — bit-reverse (2-bit indices): input order $[x_0,x_2,x_1,x_3]=[1,1,0,0]$. Step 2 — Stage 1 (butterflies with $W_4^0=1$): pair $(1,1)\\to(2,0)$; pair $(0,0)\\to(0,0)$; result $[2,0,0,0]$. Step 3 — Stage 2 (combine, twiddling $W_4^0=1$ and $W_4^1=-j$): $X[0]=2+1\\cdot0=2$; $X[1]=0+(-j)\\cdot0=0$; $X[2]=2-1\\cdot0=2$; $X[3]=0-(-j)\\cdot0=0$. Step 4 — IDFT: $x[n]=\\frac{1}{4}\\sum_k X(k)\\,W_4^{-nk}$ (use $W_4^{-1}=j$, $W_4^{-2}=-1$).",
        "check": "DFT result: $X=\\{2,0,2,0\\}$. IDFT: $x[0]=\\frac{1}{4}(2+0+2+0)=1$; $x[1]=\\frac{1}{4}(2\\cdot1+0\\cdot j+2\\cdot(-1)+0\\cdot(-j))=\\frac{1}{4}(0)=0$; $x[2]=\\frac{1}{4}(2\\cdot1+0\\cdot(-1)+2\\cdot1+0\\cdot(-1))=\\frac{1}{4}(4)=1$; $x[3]=\\frac{1}{4}(2\\cdot1+0\\cdot(-j)+2\\cdot(-1)+0\\cdot j)=\\frac{1}{4}(0)=0$. Recovered $\\{1,0,1,0\\}$."
      }
    ],
    "formulas": [
      "DIT bit-reversal (N=4, 2-bit): $0\\to0,\\ 1\\to2,\\ 2\\to1,\\ 3\\to3$",
      "4-pt twiddles: $W_4^0=1,\\ W_4^1=-j,\\ W_4^2=-1,\\ W_4^3=j$",
      "IDFT: $x[n]=\\frac{1}{N}\\sum_{k=0}^{N-1}X(k)\\,W_N^{-nk}$, where $W_N^{-k}=(W_N^k)^*$"
    ],
    "done_when": "DFT gives X={2,0,2,0} and IDFT recovers x={1,0,1,0} within time limit."
  },
  {
    "type": "break",
    "min": 5,
    "topic": "Break",
    "tasks": [
      "Last stretch coming."
    ]
  },
  {
    "id": "flex",
    "tag": "DRILL",
    "topic": "FLEX · Your weakest area",
    "min": 25,
    "note": null,
    "intro": "Honest pick — close your biggest gap, then stop.",
    "tasks": [
      {
        "do": "Redo your weakest block",
        "detail": "Look at the full plan above: which block did you least finish? Redo its hardest task from scratch with **no notes**.",
        "check": "You can now do it unaided."
      },
      {
        "do": "Or attempt a full mock question under time",
        "detail": "Pick **Q2** or **Q4** and do it in **24 minutes** (the real per-question budget), no notes, showing every step.",
        "check": "Compare against the worked answers in that block's card."
      },
      {
        "do": "Then pack and sleep",
        "detail": "Lay out pen, ID, calculator, water. Sleep — tired-but-rested beats wired-and-fried.",
        "check": "Lights out. 🌙"
      }
    ],
    "formulas": [],
    "done_when": "You've closed your biggest gap and you're packed for the morning."
  }
];
