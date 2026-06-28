# Digital Image Processing

## Fundamentals

- An image is a 2-D function $f(x,y)$: $x,y$ are spatial coordinates, $f$ is intensity / gray level. A **digital** image has $x, y, f$ all finite and discrete.
- **Pixel** (pel) = smallest element; has a location and a value. Stored as a **matrix**.
- **Sampling** = spatial resolution (pixels per area; too few → blocky). **Quantisation** = intensity precision; 8-bit → $0$ (black) to $255$ (white).
- Grayscale = 2-D matrix; RGB = 3-D matrix $M\times N\times 3$; binary = $0/1$.

## Point & basic operations

- **Brightness:** add a constant (clips at 255 to avoid `uint8` overflow); divide → darker, histogram compresses left.
- **Grayscale conversion (luminance):** $Y = 0.2989R + 0.5870G + 0.1140B$ (or simple average $(R+G+B)/3$). Convert to `double` first.
- **Histogram:** counts of pixels per intensity. Left = dark, right = bright; narrow = low contrast, spread = high contrast. **Equalisation** spreads it out.
- **Thresholding / segmentation:** $f(x,y) \ge T \Rightarrow 1$ (object), else $0$ → a binary mask isolating features.

## Spatial filtering

- Neighbourhood averaging via **convolution** (e.g. Gaussian blur with parameter $\sigma$); larger $\sigma$ = more smoothing. Process colour channels separately, then recombine.

## Transforms & colour

- **2-D DWT** (multiresolution): low-pass (approximation / shape) + high-pass (edges / texture), downsampled into 4 subbands: **LL, LH, HL, HH**.
- **RGB** primaries → secondaries: $R+G =$ Yellow, $G+B =$ Cyan, $R+B =$ Magenta, all $=$ White.
- **HSV** (Hue, Saturation, Value) separates colour from brightness. **YIQ** (NTSC): $Y = 0.299R + 0.587G + 0.114B$ (luminance), $I, Q$ = chrominance.

## DIP pipeline (high level)

acquisition → enhancement (subjective) → restoration (objective, $g = h * f + \eta$) → colour → wavelets → compression (lossless / lossy) → morphology (erosion / dilation / opening) → segmentation → representation → recognition.

Levels: **low** (image → image), **mid** (image → attributes), **high** (analysis).
