"""Re-place the voiceover lines on the slowed beat grid. The voice itself is not stretched, only moved.

Reads assets/audio/vo-placed-150bpm.wav (the six lines placed for the original 150 BPM cut) and writes
public/vo.wav with each line moved from t to t * SLOW. Each line is cut at the quietest point in the 300 ms
before its start, so no breath or consonant is clipped.
"""
import numpy as np
import wave

SLOW = 1.25  # must match SLOW in src/tokens.ts
STARTS = [1.60, 3.60, 6.40, 9.60, 12.80, 16.37]
DUR = 20.4 * SLOW

with wave.open('assets/audio/vo-placed-150bpm.wav') as w:
    sr, ch = w.getframerate(), w.getnchannels()
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch).astype(np.float64)

env = np.convolve(np.abs(x).mean(axis=1), np.ones(int(0.01 * sr)) / int(0.01 * sr), 'same')
cuts = []
for t in STARTS:
    a, b = int((t - 0.3) * sr), int(t * sr)
    cuts.append(a + int(np.argmin(env[a:b])))
cuts.append(len(x))

out = np.zeros((int(DUR * sr), ch))
for k, t in enumerate(STARTS):
    seg = x[cuts[k]:cuts[k + 1]]
    at = cuts[k] + int(round(t * (SLOW - 1) * sr))
    seg = seg[: max(0, len(out) - at)]
    out[at:at + len(seg)] += seg
    print(f'line {k + 1}: {t:.2f} s -> {t * SLOW:.2f} s')

with wave.open('public/vo.wav', 'wb') as w:
    w.setnchannels(ch)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes())
