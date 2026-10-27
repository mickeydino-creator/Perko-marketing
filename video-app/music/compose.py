"""Original score for the Perko app promo (a new piece, written for this edit). Synthesised from scratch with numpy/scipy (no samples, no loops).

120 BPM, 4/4, beat = 0.5 s, bar = 2.0 s (the Motion DNA clock, slowed by SLOW = 1.25). G major, light and clean.

  bar 1        intro: soft pad, a bell 'ping' for the falling spark, a filtered swell for the line, a whoosh into the flash
  bar 2        light groove: shaker, rim on 2 and 4, plucked chords, soft sub; riser, then a short dip before the drop
  4.0 s        drop (the title's period becomes the ink mask)
  bars 3-9     full groove: kick, snap, soft hats, round bass, e-piano stabs, a sparse mallet motif every two bars
  18.0 s       the groove stops for the end card; a bell for the wordmark, final chord, natural tail

Run:  python3 music/compose.py  ->  public/music.wav (48 kHz, stereo, 16-bit)
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave

SR = 48000
SLOW = 1.25  # must match SLOW in src/tokens.ts
BPM = 150 / SLOW
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 17.6 * SLOW  # 22.0 s
DROP = 3.2 * SLOW  # 4.0 s, the title exit
STOP = 14.4 * SLOW  # 18.0 s, the end card
N = int(DUR * SR)
rng = np.random.default_rng(11)  # seeded: every render is identical

L = np.zeros(N)
R = np.zeros(N)


def t_of(n):
    return np.arange(n) / SR


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def add(sig, at, gain=1.0, pan=0.0):
    """Place a mono signal at time `at` (s) with equal-power panning."""
    i = int(round(at * SR))
    if i >= N:
        return
    sig = sig[: N - i]
    a = (pan + 1) * np.pi / 4
    L[i: i + len(sig)] += sig * gain * np.cos(a)
    R[i: i + len(sig)] += sig * gain * np.sin(a)


def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    t = t_of(n)
    e = np.minimum(t / max(a, 1e-4), 1.0)
    if hold is None:
        e *= np.exp(-np.maximum(t - a, 0) / d) * (1 - s) + s
    else:
        e *= np.where(t < hold, 1.0, np.exp(-(t - hold) / r))
    return e


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------- instruments ----------

def kick(gain=1.0):
    n = int(0.45 * SR)
    t = t_of(n)
    f = 46 + 95 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.16)
    click = lp(rng.standard_normal(n) * np.exp(-t / 0.004), 3000) * 0.25
    return hp(np.tanh((body + click) * 1.4), 35) * 0.6 * gain


def snap():
    n = int(0.3 * SR)
    t = t_of(n)
    noise = bp(rng.standard_normal(n), 900, 6500) * (np.exp(-t / 0.05) + 0.4 * np.exp(-np.maximum(t - 0.012, 0) / 0.04) * (t > 0.012))
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.03) * 0.5
    return (noise * 0.55 + body) * 0.55


def rim():
    n = int(0.12 * SR)
    t = t_of(n)
    tone = np.sin(2 * np.pi * 820 * t) * np.exp(-t / 0.018) + 0.5 * np.sin(2 * np.pi * 1630 * t) * np.exp(-t / 0.01)
    return bp(tone + rng.standard_normal(n) * 0.2 * np.exp(-t / 0.006), 500, 5000) * 0.35


def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    t = t_of(n)
    x = hp(rng.standard_normal(n), 6000, 3)
    x = lp(x, 10500, 2)  # keep it soft: no fizz above ~10 kHz
    return x * np.exp(-t / (0.07 if open_ else 0.014)) * 0.3


def shaker():
    n = int(0.09 * SR)
    t = t_of(n)
    x = bp(rng.standard_normal(n), 4500, 9500)
    e = np.minimum(t / 0.012, 1) * np.exp(-np.maximum(t - 0.012, 0) / 0.03)
    return x * e * 0.16


def bass(m, length, gain=1.0):
    n = int(length * SR)
    t = t_of(n)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.32 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sin(2 * np.pi * 3 * f * t)
    x = lp(np.tanh(x * 1.3), 900)
    e = np.minimum(t / 0.006, 1) * np.where(t < length - 0.04, 1.0, np.maximum(0, (length - t) / 0.04))
    e *= 0.75 + 0.25 * np.exp(-t / 0.12)
    return hp(x * e, 45) * 0.24 * gain


def epiano(notes, length, gain=1.0):
    """FM electric piano: soft bell attack, warm body."""
    n = int((length + 0.6) * SR)
    t = t_of(n)
    out = np.zeros(n)
    for m in notes:
        f = midi(m)
        idx = 1.6 * np.exp(-t / 0.18) + 0.25
        mod = np.sin(2 * np.pi * f * t) * idx
        car = np.sin(2 * np.pi * f * t + mod)
        tine = np.sin(2 * np.pi * f * 4.0 * t) * np.exp(-t / 0.05) * 0.12
        out += (car + tine) * np.exp(-t / 0.9)
    e = np.where(t < length, 1.0, np.exp(-(t - length) / 0.12))
    return lp(out * e, 6000) / len(notes) * 0.5 * gain


def pluck(notes, gain=1.0):
    n = int(0.7 * SR)
    t = t_of(n)
    out = np.zeros(n)
    for m in notes:
        f = midi(m)
        saw = 2 * ((f * t) % 1) - 1
        out += saw
    cut = 600 + 3800 * np.exp(-t / 0.06)
    # time-varying lowpass by short blocks
    y = np.zeros(n)
    blk = 480
    zi = None
    for k in range(0, n, blk):
        sos = butter(2, cut[k], 'low', fs=SR, output='sos')
        seg = out[k:k + blk]
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        from scipy.signal import sosfilt as _s
        y[k:k + blk], zi = _s(sos, seg, zi=zi)
    return y * np.exp(-t / 0.22) / len(notes) * 0.28 * gain


def mallet(m, gain=1.0):
    n = int(0.9 * SR)
    t = t_of(n)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35) + 0.35 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t / 0.05)
    return x * np.minimum(t / 0.002, 1) * 0.3 * gain


def bell(m, gain=1.0, decay=1.6):
    n = int(3.5 * SR)
    t = t_of(n)
    f = midi(m)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.2 * np.exp(-t / 0.4)
    x = np.sin(2 * np.pi * f * t + mod) * np.exp(-t / decay)
    return lp(x, 7000) * np.minimum(t / 0.002, 1) * 0.28 * gain


def pad(notes, length, gain=1.0, cutoff=1800):
    n = int((length + 1.2) * SR)
    t = t_of(n)
    out = np.zeros(n)
    for m in notes:
        for det in (-0.07, 0.0, 0.08):
            f = midi(m) * 2 ** (det / 12)
            out += 2 * ((f * t + rng.random()) % 1) - 1
    out = lp(out, cutoff, 2)
    e = np.minimum(t / 0.6, 1) * np.where(t < length, 1.0, np.exp(-(t - length) / 0.5))
    return out * e / (len(notes) * 3) * 0.32 * gain


def noise_swell(length, f0, f1, gain=1.0):
    n = int(length * SR)
    t = t_of(n)
    x = rng.standard_normal(n)
    y = np.zeros(n)
    blk = 480
    zi = np.zeros((1, 2))
    for k in range(0, n, blk):
        fc = f0 * (f1 / f0) ** (k / n)
        sos = butter(1, [fc * 0.7, min(fc * 1.4, 15000)], 'band', fs=SR, output='sos')
        y[k:k + blk], zi = sosfilt(sos, x[k:k + blk], zi=zi)
    return y * (t / length) ** 2 * 0.35 * gain


# ---------- harmony (G major, one chord per bar after the intro) ----------
# Gmaj7, Em7, Cmaj9, D6 -- warm voicings in the middle register
CHORDS = [
    ([55, 59, 62, 66], 43),  # Gmaj7 / G
    ([55, 59, 62, 64], 40),  # Em7 / E
    ([52, 55, 59, 62], 36),  # Cmaj9 / C
    ([54, 57, 59, 62], 38),  # D6 / D
]


def bar_t(b):
    return b * BAR


# ---------- arrangement ----------

# bar 1: intro
add(pad([55, 62, 66, 69], BAR, gain=0.8, cutoff=900), 0.0)
add(bell(86, 0.55, 0.8), 0.25 * SLOW, pan=-0.1)             # the spark lands as a dot
add(noise_swell(0.6 * SLOW, 400, 3000, 0.5), 0.73 * SLOW)   # the line stretches out
add(noise_swell(0.28 * SLOW, 1500, 9000, 0.8), 1.32 * SLOW, pan=0.1)  # the band blooms into the flash

# bar 2: light groove under the title
for b in (1,):
    chord, root = CHORDS[b - 1]
    t0 = bar_t(b)
    add(pad(chord, BAR, gain=0.55, cutoff=1400), t0)
    for i in range(16):
        add(shaker(), t0 + i * BEAT / 4 + (0.012 if i % 2 else 0), gain=0.8 if i % 4 == 2 else 0.5, pan=0.35)
    for k in (1, 3):
        add(rim(), t0 + k * BEAT, pan=-0.2)
    for k in (0.5, 1.5, 2.5, 3.5):
        add(pluck([m + 12 for m in chord[:3]]), t0 + k * BEAT, gain=0.9, pan=0.2 if k % 2 else -0.2)
    add(bass(root, BEAT * 0.8, 0.6), t0)
    add(bass(root, BEAT * 0.6, 0.5), t0 + BEAT * 2.5)
# the dip: everything placed so far is pulled down for the last ~150 ms before the drop
_t = np.arange(N) / SR
_dip = np.clip(1 - (_t - (DROP - 0.2)) / 0.06, 0, 1) * (_t < DROP) + (_t >= DROP)
L *= _dip
R *= _dip
add(noise_swell(0.5 * SLOW, 300, 7000, 0.9), DROP - 0.66 * SLOW)   # riser into the drop, ends just before the dip

# bars 3-9: the groove (DROP - STOP), under the product scenes
motif = [(0.0, 74), (0.5, 79), (1.0, 78), (2.0, 76), (2.5, 74), (3.0, 71)]
for b in range(2, 9):
    chord, root = CHORDS[(b - 2) % 4]
    t0 = bar_t(b)
    # drums
    for k, g in ((0, 1.0), (1.75, 0.55), (2, 0.9)):
        add(kick(g), t0 + k * BEAT)
    for k in (1, 3):
        add(snap(), t0 + k * BEAT, gain=0.75, pan=0.05)
    for i in range(8):
        swing = 0.03 if i % 2 else 0.0
        add(hat(open_=(i == 7)), t0 + i * BEAT / 2 + swing, gain=0.65 if i % 2 else 0.4, pan=-0.3)
    for i in range(16):
        if i % 4 == 2:
            add(shaker(), t0 + i * BEAT / 4 + 0.01, gain=0.45, pan=0.4)
    # bass: root, octave answer, approach note
    add(bass(root, BEAT * 0.9), t0)
    add(bass(root, BEAT * 0.4, 0.8), t0 + BEAT * 1.0)
    add(bass(root + 12, BEAT * 0.35, 0.6), t0 + BEAT * 1.5)
    add(bass(root, BEAT * 0.9, 0.9), t0 + BEAT * 2.0)
    add(bass(root + 7, BEAT * 0.45, 0.7), t0 + BEAT * 3.5)
    # e-piano stabs on the off-beats
    for k in (0.5, 1.5, 2.75, 3.5):
        add(epiano(chord, BEAT * 0.35, 0.9), t0 + k * BEAT, pan=0.15)
    add(pad(chord, BAR, gain=0.35, cutoff=1600), t0)
    # small fills into bars 6 and 10 (scene accents)
    if b in (4, 7):
        for k in (3.25, 3.5, 3.75):
            add(snap(), t0 + k * BEAT, gain=0.35 + 0.1 * (k - 3.25) * 4, pan=0.1)
    # sparse mallet motif every other bar
    if (b - 2) % 2 == 0:
        for k, m in motif:
            add(mallet(m, 0.8), t0 + k * BEAT, pan=-0.25)

# accent on the drop
add(bell(79, 0.5, 1.0), DROP, pan=0.1)

# end card: the groove stops; the dot writes the wordmark shortly after
add(kick(0.8), STOP)
add(pad([55, 59, 62, 66, 69], 3.2 * SLOW, gain=0.8, cutoff=1500), STOP)
add(epiano([55, 59, 62, 66, 69], 2.6 * SLOW, 0.9), STOP)
add(bass(43, 0.9, 0.6), STOP)
add(bell(86, 0.6, 1.8), STOP + 0.4 * SLOW, pan=-0.1)
add(bell(93, 0.3, 1.4), STOP + 0.62 * SLOW, pan=0.15)

# ---------- master ----------
mix = np.stack([L, R])

# small room reverb (exponential noise IR), mixed low
ir_n = int(1.4 * SR)
ir_t = t_of(ir_n)
ir = rng.standard_normal((2, ir_n)) * np.exp(-ir_t / 0.35)
ir = np.stack([lp(ir[0], 5000), lp(ir[1], 5000)])
ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
wet = np.stack([fftconvolve(hp(mix[c], 250), ir[c])[:N] for c in range(2)])
mix = mix + wet * 0.16

mix = np.stack([lp(hp(mix[c], 30), 14000) for c in range(2)])  # no sub rumble, no piercing top

# gentle glue compression (RMS follower) and a soft limiter
rms = np.sqrt(lp(np.mean(mix ** 2, axis=0), 8, 1) + 1e-9)
thr = 0.12
gain = np.where(rms > thr, (thr / rms) ** 0.35, 1.0)
mix *= gain
mix = np.tanh(mix * 1.15) / 1.15
mix *= 10 ** (-3 / 20) / np.max(np.abs(mix))  # peak at -3 dBFS

# fades
fade_in = int(0.02 * SR)
mix[:, :fade_in] *= np.linspace(0, 1, fade_in)
fade_out = int(1.2 * SR)
mix[:, -fade_out:] *= np.linspace(1, 0, fade_out) ** 2

out = (mix.T * 32767).astype(np.int16)
with wave.open('public/music.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())

print('wrote public/music.wav', DUR, 's; rms dBFS', round(20 * np.log10(np.sqrt(np.mean(mix ** 2))), 1))
