"use client";

import React, { useState } from "react";
import { Mafs, Coordinates, Plot, Point, Polygon, Line, Circle } from "mafs";

const PRESET_LEGENDS = {
  "hole-limit": [
    { color: "#0085dd", label: "f(x) = (x² - 1)/(x - 1)" },
    { color: "#db073d", label: "រន្ធ (1, 2)" },
  ],
  "one-sided-jump": [
    { color: "#db073d", label: "y = -1 (x < 0)" },
    { color: "#0097a8", label: "y = 1 (x > 0)" },
  ],
  "squeeze-theorem": [
    { color: "#db073d", label: "f(x) = x²·sin(8/x)" },
    { color: "#009b5e", label: "g(x) = x²" },
    { color: "#0097a8", label: "h(x) = -x²" },
  ],
  "trig-limit": [
    { color: "#db073d", label: "f(x) = sin(x)/x" },
    { color: "#009b5e", label: "លីមីត (0, 1)" },
  ],
  "vertical-line-pass": [
    { color: "#0085dd", label: "y = x² - 1" },
    { color: "#009b5e", label: "បន្ទាត់ឈរ x = c" },
  ],
  "vertical-line-fail": [
    { color: "#0085dd", label: "x² + y² = 4 (រង្វង់)" },
    { color: "#db073d", label: "x = 1 (កាត់ ២ ចំណុច)" },
  ],
  "piecewise-function": [
    { color: "#0085dd", label: "x² (x < 1)" },
    { color: "#db073d", label: "3 - x (x ≥ 1)" },
  ],
  "linear-slope": [
    { color: "#0085dd", label: "y = mx + 1" },
  ],
  "trig-sine-cosine": [
    { color: "#db073d", label: "y = sin(x)" },
    { color: "#0085dd", label: "y = cos(x)" },
  ],
  "exp-log-inverse": [
    { color: "#db073d", label: "y = eˣ" },
    { color: "#009b5e", label: "y = ln(x)" },
    { color: "#64748b", label: "y = x" },
  ],
  "graph-shift-scale": [
    { color: "#0085dd", label: "y = x² (ដើម)" },
    { color: "#db073d", label: "y = (x - h)² + k" },
  ],
  "inverse-reflection": [
    { color: "#db073d", label: "f(x) = x² (x ≥ 0)" },
    { color: "#009b5e", label: "f⁻¹(x) = √x" },
    { color: "#64748b", label: "y = x" },
  ],
  "graph-scaling": [
    { color: "#0085dd", label: "y = sin(x)" },
    { color: "#db073d", label: "y = c·sin(x)" },
    { color: "#009b5e", label: "y = sin(cx)" },
  ],
  "graph-reflection": [
    { color: "#0085dd", label: "f(x) = √x (ដើម)" },
    { color: "#db073d", label: "y = -f(x) = -√x (ឆ្លុះ Ox)" },
    { color: "#009b5e", label: "y = f(-x) = √(-x) (ឆ្លុះ Oy)" },
  ],
  "graph-abs-transform": [
    { color: "#0085dd", label: "f(x) = x² - 2x (ដើម)" },
    { color: "#db073d", label: "y = |f(x)| (បត់ក្រោម Ox ឡើងលើ)" },
    { color: "#009b5e", label: "y = f(|x|) (ឆ្លុះស្តាំ Oy ទៅឆ្វេង)" },
  ],
  "example-parabola-steps": [
    { color: "#0085dd", label: "ជំហានមុន (យោង)" },
    { color: "#db073d", label: "ក្រាបជំហានបច្ចុប្បន្ន" },
  ],
  "secant-to-tangent": [
    { color: "#0085dd", label: "f(x) = x²" },
    { color: "#009b5e", label: "បន្ទាត់កាត់ PQ (Secant)" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះត្រង់ x = 1 (Tangent)" },
  ],
  "non-diff-corner": [
    { color: "#db073d", label: "f(x) = |x| (ចំណុចមុំ) / ∛x (ប៉ះឈរ)" },
  ],
  "secant-rate": [
    { color: "#0085dd", label: "f(x) = x²" },
    { color: "#009b5e", label: "បន្ទាត់កាត់ PQ (Secant)" },
    { color: "#b95a00", label: "Δx = h និង Δy" },
  ],
  "tangent-normal": [
    { color: "#0085dd", label: "f(x) = x² - 3x + 1" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះ (T): y = x - 3" },
    { color: "#009b5e", label: "បន្ទាត់កែង (N): y = -x + 1" },
  ],
  "chain-rule-flow": [
    { color: "#0085dd", label: "អនុគមន៍ខាងក្នុង u = f(x)" },
    { color: "#009b5e", label: "អនុគមន៍ខាងក្រៅ y = g(u)" },
    { color: "#db073d", label: "ដេរីវេបណ្តាក់ g'(f(x)) · f'(x)" },
  ],
  "circle-tangent": [
    { color: "#0085dd", label: "រង្វង់ x² + y² = 25" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះ 3x + 4y = 25 ត្រង់ M(3, 4)" },
    { color: "#009b5e", label: "កាំ OM (កែងនឹងបន្ទាត់ប៉ះ)" },
  ],
  "folium-descartes": [
    { color: "#0085dd", label: "Folium: x³ + y³ = 6xy" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះ y = -x + 6 ត្រង់ A(3, 3)" },
    { color: "#64748b", label: "អាស៊ីមតូត x + y = -2" },
  ],
  "sliding-ladder": [
    { color: "#db073d", label: "ជណ្តើរប្រវែងថេរ L = 5 m (x² + y² = 25)" },
    { color: "#0085dd", label: "ជើងជណ្តើររំកិលចេញ dx/dt > 0" },
    { color: "#009b5e", label: "ក្បាលជណ្តើររអិលចុះ dy/dt < 0" },
  ],
  "linear-approx": [
    { color: "#0085dd", label: "f(x) = √x" },
    { color: "#db073d", label: "ប៉ាន់ស្មានលីនេអ៊ែរ L(x) = 2 + ¼(x - 4)" },
    { color: "#009b5e", label: "ប្រៀបធៀប Δy (ខ្សែកោង) និង dy (បន្ទាត់ប៉ះ)" },
  ],
  "expanding-sphere": [
    { color: "#0085dd", label: "ស្វ៊ែរ V = (4/3)πr³" },
    { color: "#db073d", label: "កាំ r(t) កើនឡើង (dr/dt > 0)" },
  ],
  "conical-tank": [
    { color: "#334155", label: "កោណធំ R = 4 m, H = 12 m" },
    { color: "#0085dd", label: "មាឌទឹក r(t), h(t)" },
    { color: "#db073d", label: "ត្រីកោណដូចគ្នា r/h = R/H = 1/3" },
  ],
  "extrema-local-global": [
    { color: "#0085dd", label: "f(x) = 0.5(x³ - 3x) + 1" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះត្រង់ x₀ (រំកិល slider)" },
    { color: "#009b5e", label: "ចំណុចគ្រឹះ f'(c) = 0 (x = -1, x = 1)" },
  ],
  "fermat-counterexample": [
    { color: "#0085dd", label: "ខ្សែកោង f(x)" },
    { color: "#db073d", label: "ចំណុចសិក្សា x = 0" },
  ],
  "closed-interval-method": [
    { color: "#0085dd", label: "f(x) = 2x³ - 9x² + 12x - 1 លើ [0, 3]" },
    { color: "#db073d", label: "ចំណុចកំពុងពិនិត្យ" },
    { color: "#009b5e", label: "បរមាដាច់ខាត៖ Min = -1 (x=0), Max = 8 (x=3)" },
  ],
  "rolle-theorem": [
    { color: "#0085dd", label: "f(x) = -0.5(x - 1)(x - 5) លើ [1, 5]" },
    { color: "#009b5e", label: "បន្ទាត់ដេក f'(c) = 0 ត្រង់ c = 3" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះត្រង់ x₀ (រំកិល slider)" },
  ],
  "mvt-theorem": [
    { color: "#0085dd", label: "f(x) = 2√x លើ [0, 4]" },
    { color: "#009b5e", label: "បន្ទាត់កាត់ AB (m = 1)" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះត្រង់ x₀ (ស្រប AB ត្រង់ c = 1)" },
  ],
  "monotonicity-concavity": [
    { color: "#0085dd", label: "ផតចុះក្រោម f''(x) < 0 (x < 1)" },
    { color: "#009b5e", label: "ផតឡើងលើ f''(x) > 0 (x > 1)" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះត្រង់ x₀ & ចំណុចរបត់ I(1, 0)" },
  ],
  "curve-sketch-rational": [
    { color: "#64748b", label: "អាស៊ីមតូតឈរ x = 1 & ទ្រេត y = x - 1" },
    { color: "#009b5e", label: "បរមា៖ Max(0, -2) & Min(2, 2)" },
    { color: "#0085dd", label: "ខ្សែកោង f(x) = (x² - 2x + 2)/(x - 1)" },
  ],
  "lhopital-ratio": [
    { color: "#db073d", label: "f(x) = sin(2x) ≈ 2x" },
    { color: "#0085dd", label: "g(x) = ln(1 + x) ≈ x" },
    { color: "#009b5e", label: "ផលធៀប f(x)/g(x) → f'(0)/g'(0) = 2" },
  ],
  "optimization-box": [
    { color: "#0085dd", label: "របង 3 ជ្រុង៖ 2x + y = 40 m" },
    { color: "#009b5e", label: "ផ្ទៃអតិបរមា 200 m² ត្រង់ x = 10 m, y = 20 m" },
  ],
  "antiderivative-family": [
    { color: "#0085dd", label: "គ្រួសារព្រីមីទីវ F(x) = ⅓x³ - x + C" },
    { color: "#db073d", label: "បន្ទាត់ប៉ះស្របគ្នា (មេគុណ f(1.5) = 1.25 ដូចគ្នា)" },
  ],
  "riemann-partition": [
    { color: "#0085dd", label: "ខ្សែកោងទូទៅ y = f(x) លើ [a, b]" },
    { color: "#db073d", label: "ចន្លោះរងទី k៖ [xₖ₋₁, xₖ] ទទឹង Δx និងកម្ពស់ f(xₖ*)" },
  ],
  "riemann-sum": [
    { color: "#0085dd", label: "f(x) = x² លើ [0, 2]" },
    { color: "#009b5e", label: "ចតុកោណកែង Riemann (ផ្ទៃពិត 8/3 ≈ 2.667)" },
  ],
  "signed-area": [
    { color: "#0085dd", label: "f(x) = sin(x) លើ [0, 2π]" },
    { color: "#009b5e", label: "ផ្ទៃវិជ្ជមាន A₊ (លើ Ox)" },
    { color: "#db073d", label: "ផ្ទៃអវិជ្ជមាន A₋ (ក្រោម Ox)" },
  ],
  "ftc-accumulation": [
    { color: "#0085dd", label: "ផ្ទៃសន្សំ g(x) = ∫₀ˣ f(t)dt" },
    { color: "#db073d", label: "បន្ទះកើន Δg ≈ f(x)·h ⇒ g'(x) = f(x)" },
  ],
  "u-substitution-map": [
    { color: "#db073d", label: "ប្លង់ដើម x៖ ∫₀ᵇ 2x√(x² + 1) dx" },
    { color: "#009b5e", label: "ប្លង់ថ្មី u = x² + 1៖ ∫₁^{b²+1} √u du (ផ្ទៃស្មើគ្នា!)" },
  ],
  "area-between-x": [
    { color: "#0085dd", label: "ខ្សែកោងលើ y = 2 - x²" },
    { color: "#009b5e", label: "ខ្សែកោងក្រោម y = x" },
    { color: "#db073d", label: "បន្ទះឈរ h = y_លើ - y_ក្រោម (dx)" },
  ],
  "area-between-y": [
    { color: "#009b5e", label: "ខ្សែកោងស្តាំ x = y + 1" },
    { color: "#0085dd", label: "ខ្សែកោងឆ្វេង x = y² - 1" },
    { color: "#db073d", label: "បន្ទះដេក w = x_ស្តាំ - x_ឆ្វេង (dy)" },
  ],
  "volume-disk-washer": [
    { color: "#0085dd", label: "កាំក្រៅ R(x) = √x" },
    { color: "#009b5e", label: "កាំក្នុង r(x) = x² (របៀបចិញ្ចៀន)" },
    { color: "#db073d", label: "មុខកាត់ A(x) = π(R² − r²)" },
  ],
  "volume-shell-method": [
    { color: "#0085dd", label: "ខ្សែកោង y = 2x² − x³ លើ [0, 2]" },
    { color: "#db073d", label: "សំបកស៊ីឡាំង 3D៖ កាំ r = x₀, កម្ពស់ h = f(x₀)" },
    { color: "#009b5e", label: "បន្ទះលា៖ dV = 2πr·h·dx" },
  ],
  "arc-length-polygonal": [
    { color: "#0085dd", label: "ខ្សែកោង y = (2/3)x^(3/2) លើ [0, 3]" },
    { color: "#db073d", label: "ខ្សែកាច់ប្រហែល n កំណាត់ (Lₙ → 14/3)" },
    { color: "#009b5e", label: "ត្រីកោណពីតាគ័រ Δs = √(Δx² + Δy²)" },
  ],
  "surface-area-frustum": [
    { color: "#0085dd", label: "ផ្ទៃបរិវត្ត y = 2√x លើ [0, 3] ជុំវិញ Ox" },
    { color: "#db073d", label: "កំណាត់កោណស្តើង (Frustum) ជ្រុងទ្រេត ds" },
  ],
  "ibp-area-rectangle": [
    { color: "#0085dd", label: "ផ្ទៃខៀវ៖ ∫ u dv (ឆ្ពោះទៅអ័ក្ស Ov)" },
    { color: "#db073d", label: "ផ្ទៃក្រហម៖ ∫ v du (ឆ្ពោះទៅអ័ក្ស Ou)" },
    { color: "#009b5e", label: "ផលបូក = [u·v]ₐᵇ = u(b)v(b) − u(a)v(a)" },
  ],
};

export default function SlideGraph({ visualGraph, height = 270 }) {
  const [epsilon, setEpsilon] = useState(visualGraph?.epsilon ?? 0.6);
  const [delta, setDelta] = useState(visualGraph?.delta ?? 0.35);
  const [lineX, setLineX] = useState(visualGraph?.lineX ?? 1);
  const [slope, setSlope] = useState(visualGraph?.slope ?? 1.5);
  const [shiftH, setShiftH] = useState(visualGraph?.shiftH ?? 1.5);
  const [shiftK, setShiftK] = useState(visualGraph?.shiftK ?? 1);
  const [scaleC, setScaleC] = useState(visualGraph?.scaleC ?? 2);
  const [absMode, setAbsMode] = useState(visualGraph?.absMode ?? "outer");
  const [parabolaStep, setParabolaStep] = useState(visualGraph?.step ?? 4);
  const [secantH, setSecantH] = useState(visualGraph?.h ?? 1.2);
  const [nonDiffMode, setNonDiffMode] = useState(visualGraph?.mode ?? "corner");
  const [extremaX, setExtremaX] = useState(visualGraph?.x0 ?? -1);
  const [fermatMode, setFermatMode] = useState(visualGraph?.mode ?? "cubic");
  const [intervalIdx, setIntervalIdx] = useState(visualGraph?.candidateIdx ?? 3);
  const [rolleX, setRolleX] = useState(visualGraph?.rolleX ?? 3);
  const [mvtX, setMvtX] = useState(visualGraph?.mvtX ?? 1);
  const [curveX, setCurveX] = useState(visualGraph?.curveX ?? 1);
  const [sketchStep, setSketchStep] = useState(visualGraph?.sketchStep ?? 3);
  const [lhopX, setLhopX] = useState(visualGraph?.lhopX ?? 0.4);
  const [optX, setOptX] = useState(visualGraph?.optX ?? 10);
  const [antiC, setAntiC] = useState(visualGraph?.antiC ?? 0);
  const [partSampleFrac, setPartSampleFrac] = useState(visualGraph?.sampleFrac ?? 0.35);
  const [riemannN, setRiemannN] = useState(visualGraph?.n ?? 6);
  const [riemannMode, setRiemannMode] = useState(visualGraph?.mode ?? "right");
  const [signedB, setSignedB] = useState(visualGraph?.b ?? Math.PI * 1.5);
  const [ftcX, setFtcX] = useState(visualGraph?.x ?? 2.0);
  const [subB, setSubB] = useState(visualGraph?.b ?? 1.5);
  const [areaStripX, setAreaStripX] = useState(visualGraph?.stripX ?? -0.5);
  const [areaStripY, setAreaStripY] = useState(visualGraph?.stripY ?? 0.5);
  const [washerX, setWasherX] = useState(visualGraph?.x0 ?? 0.55);
  const [washerMode, setWasherMode] = useState(visualGraph?.mode ?? "washer");
  const [shellX, setShellX] = useState(visualGraph?.x0 ?? 1.25);
  const [arcN, setArcN] = useState(visualGraph?.n ?? 3);
  const [frustumX, setFrustumX] = useState(visualGraph?.x0 ?? 1.3);
  const [ibpB, setIbpB] = useState(visualGraph?.b ?? 1.7);

  if (!visualGraph) return null;

  const { preset, captionKh } = visualGraph;
  const legendItems = PRESET_LEGENDS[preset] || [];

  return (
    <div className="rounded-2xl border border-[#fdbcbc] bg-[#fffafa]/80 p-3 shadow-2xs space-y-2.5">
      {legendItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          {legendItems.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd3d2] bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#160002]"
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-mono">{item.label}</span>
            </span>
          ))}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-[#ffd3d2] bg-white/55 dark:bg-white/[0.03]">
        {preset === "hole-limit" && (
          <Mafs height={height} viewBox={{ x: [-2, 4], y: [-1, 5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => (Math.abs(x - 1) < 0.06 ? NaN : x + 1)} color="#0085dd" weight={3} />
            <Line.Segment point1={[1, 0]} point2={[1, 2]} style="dashed" color="#db073d" opacity={0.6} />
            <Line.Segment point1={[0, 2]} point2={[1, 2]} style="dashed" color="#009b5e" opacity={0.6} />
            {/* Open circle (hole) at (1, 2) */}
            <Circle center={[1, 2]} radius={0.14} color="#db073d" fillOpacity={0} strokeStyle="solid" weight={3} />
            <Point x={1} y={0} color="#db073d" />
            <Point x={0} y={2} color="#009b5e" />
          </Mafs>
        )}

        {preset === "one-sided-jump" && (
          <Mafs height={height} viewBox={{ x: [-4, 4], y: [-2.5, 2.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => (x < -0.05 ? -1 : NaN)} color="#db073d" weight={3} />
            <Plot.OfX y={(x) => (x > 0.05 ? 1 : NaN)} color="#0097a8" weight={3} />
            <Circle center={[0, -1]} radius={0.13} color="#db073d" fillOpacity={0} weight={3} />
            <Circle center={[0, 1]} radius={0.13} color="#0097a8" fillOpacity={0} weight={3} />
          </Mafs>
        )}

        {preset === "squeeze-theorem" && (
          <Mafs height={height} viewBox={{ x: [-1.8, 1.8], y: [-1.5, 1.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x} color="#009b5e" weight={2} style="dashed" />
            <Plot.OfX y={(x) => -x * x} color="#0097a8" weight={2} style="dashed" />
            <Plot.OfX
              y={(x) => (Math.abs(x) < 0.005 ? 0 : x * x * Math.sin(8 / x))}
              color="#db073d"
              weight={2.5}
            />
            <Point x={0} y={0} color="#009b5e" />
          </Mafs>
        )}

        {preset === "trig-limit" && (
          <Mafs height={height} viewBox={{ x: [-6, 6], y: [-0.6, 1.6] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX
              y={(x) => (Math.abs(x) < 0.05 ? NaN : Math.sin(x) / x)}
              color="#0085dd"
              weight={3}
            />
            <Circle center={[0, 1]} radius={0.16} color="#db073d" fillOpacity={0} weight={3} />
          </Mafs>
        )}

        {preset === "asymptotes" && (
          <Mafs height={height} viewBox={{ x: [-5, 7], y: [-4, 8] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {/* Horizontal Asymptote y = 2 */}
            <Line.Segment point1={[-10, 2]} point2={[10, 2]} style="dashed" color="#0097a8" weight={2} />
            {/* Vertical Asymptote x = 1 */}
            <Line.Segment point1={[1, -10]} point2={[1, 12]} style="dashed" color="#db073d" weight={2} />
            {/* Left branch x < 1 */}
            <Plot.OfX
              y={(x) => (x < 0.92 ? (2 * x + 1) / (x - 1) : NaN)}
              color="#0085dd"
              weight={3}
            />
            {/* Right branch x > 1 */}
            <Plot.OfX
              y={(x) => (x > 1.08 ? (2 * x + 1) / (x - 1) : NaN)}
              color="#0085dd"
              weight={3}
            />
          </Mafs>
        )}

        {preset === "epsilon-n" && (() => {
          const L = 2;
          const eps = Math.max(0.3, Math.min(1.2, epsilon));
          const N = 3 / eps;
          return (
            <Mafs height={height} viewBox={{ x: [-0.5, 11.5], y: [-0.5, 5.5] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              {/* Green horizontal epsilon-band around L = 2 */}
              <Polygon
                points={[[-1, L - eps], [13, L - eps], [13, L + eps], [-1, L + eps]]}
                color="#009b5e"
                fillOpacity={0.14}
                strokeOpacity={0}
              />
              {/* Teal region x > N */}
              <Polygon
                points={[[N, L - eps], [13, L - eps], [13, L + eps], [N, L + eps]]}
                color="#0097a8"
                fillOpacity={0.18}
                strokeOpacity={0}
              />
              {/* Limit line y = 2 */}
              <Line.Segment point1={[-1, L]} point2={[13, L]} style="dashed" color="#009b5e" weight={2} />
              <Line.Segment point1={[-1, L + eps]} point2={[13, L + eps]} style="dashed" color="#009b5e" opacity={0.5} />
              <Line.Segment point1={[-1, L - eps]} point2={[13, L - eps]} style="dashed" color="#009b5e" opacity={0.5} />
              {/* Threshold line x = N */}
              <Line.Segment point1={[N, -0.5]} point2={[N, 5.5]} style="dashed" color="#db073d" weight={2.5} />
              {/* Curve f(x) = 2 + 3/x */}
              <Plot.OfX
                y={(x) => (x > 0.4 ? 2 + 3 / x : NaN)}
                color="#0085dd"
                weight={3}
              />
              <Point x={N} y={L + eps} color="#db073d" />
              <Point x={N} y={0} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "discontinuity-types" && (
          <Mafs height={height} viewBox={{ x: [-1.5, 4], y: [-0.5, 4.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => (Math.abs(x - 1) < 0.06 ? NaN : x + 1)} color="#0085dd" weight={3} />
            <Line.Segment point1={[1, 0]} point2={[1, 3.5]} style="dashed" color="#db073d" opacity={0.45} />
            {/* Hole at (1, 2) where limit = 2 */}
            <Circle center={[1, 2]} radius={0.14} color="#0097a8" fillOpacity={0} weight={3} />
            {/* Actual defined value f(1) = 3.5 */}
            <Point x={1} y={3.5} color="#db073d" />
          </Mafs>
        )}

        {preset === "ivt-theorem" && (
          <Mafs height={height} viewBox={{ x: [-1, 2.2], y: [-2, 2.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x * x - 3 * x + 1} color="#0085dd" weight={3} />
            {/* f(0) = 1 > 0 */}
            <Point x={0} y={1} color="#0097a8" />
            {/* f(1) = -1 < 0 */}
            <Point x={1} y={-1} color="#db073d" />
            {/* Root c ≈ 0.3473 where f(c) = 0 */}
            <Point x={0.3473} y={0} color="#009b5e" />
          </Mafs>
        )}

        {preset === "epsilon-delta" && (
          <Mafs height={height} viewBox={{ x: [-1, 4], y: [-0.5, 4] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {(() => {
              const x0 = 1.5;
              const L = 0.5 * x0 * x0 + 0.5;
              return (
                <>
                  <Polygon
                    points={[
                      [-10, L - epsilon],
                      [10, L - epsilon],
                      [10, L + epsilon],
                      [-10, L + epsilon],
                    ]}
                    color="#009b5e"
                    fillOpacity={0.15}
                    strokeOpacity={0.5}
                    strokeStyle="dashed"
                  />
                  <Polygon
                    points={[
                      [x0 - delta, -10],
                      [x0 + delta, -10],
                      [x0 + delta, 10],
                      [x0 - delta, 10],
                    ]}
                    color="#0097a8"
                    fillOpacity={0.15}
                    strokeOpacity={0.5}
                    strokeStyle="dashed"
                  />
                  <Plot.OfX y={(x) => 0.5 * x * x + 0.5} color="#0085dd" weight={3} />
                  <Line.Segment point1={[x0, 0]} point2={[x0, L]} style="dashed" color="#47010d" opacity={0.5} />
                  <Line.Segment point1={[0, L]} point2={[x0, L]} style="dashed" color="#47010d" opacity={0.5} />
                  <Point x={x0} y={L} color="#db073d" />
                </>
              );
            })()}
          </Mafs>
        )}

        {preset === "function-mapping" && (
          <div className="p-3 sm:p-4 bg-white">
            <svg
              viewBox="0 0 460 220"
              className="w-full h-auto max-h-[250px] mx-auto"
              role="img"
              aria-label="គំនូសតាងព្រួញបង្ហាញការផ្គូផ្គងពីដែនកំណត់ D ទៅសំណុំរូបភាព"
            >
              <defs>
                <marker
                  id="fn-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#db073d" />
                </marker>
              </defs>

              {/* Domain Oval (D) */}
              <ellipse
                cx="105"
                cy="118"
                rx="68"
                ry="84"
                fill="#fff5f5"
                stroke="#db073d"
                strokeWidth="2.2"
              />
              <text
                x="105"
                y="22"
                textAnchor="middle"
                className="fill-[#9c0329] text-[13px] font-bold"
              >
                ដែនកំណត់ (Domain D)
              </text>

              {/* Codomain Oval (E) */}
              <ellipse
                cx="355"
                cy="118"
                rx="72"
                ry="84"
                fill="#f0f9ff"
                stroke="#0085dd"
                strokeWidth="2.2"
              />
              <text
                x="355"
                y="22"
                textAnchor="middle"
                className="fill-[#005c9e] text-[13px] font-bold"
              >
                សំណុំគោលដៅ (Codomain E)
              </text>

              {/* Range inner highlight */}
              <ellipse
                cx="355"
                cy="102"
                rx="50"
                ry="56"
                fill="#e7f7f0"
                stroke="#009b5e"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x="355"
                y="148"
                textAnchor="middle"
                className="fill-[#006e42] text-[10px] font-bold"
              >
                សំណុំរូបភាព (Range)
              </text>

              {/* Function label f */}
              <text
                x="230"
                y="46"
                textAnchor="middle"
                className="fill-[#db073d] text-[15px] font-bold italic"
              >
                f : D → E
              </text>

              {/* Arrows x -> f(x) */}
              <path
                d="M 122 68 Q 230 56 334 68"
                fill="none"
                stroke="#db073d"
                strokeWidth="2"
                markerEnd="url(#fn-arrow)"
              />
              <path
                d="M 122 102 Q 230 92 334 98"
                fill="none"
                stroke="#db073d"
                strokeWidth="2"
                markerEnd="url(#fn-arrow)"
              />
              <path
                d="M 122 136 Q 230 122 334 104"
                fill="none"
                stroke="#db073d"
                strokeWidth="2"
                markerEnd="url(#fn-arrow)"
              />
              <path
                d="M 122 170 Q 230 154 334 128"
                fill="none"
                stroke="#db073d"
                strokeWidth="2"
                markerEnd="url(#fn-arrow)"
              />

              {/* Domain Elements */}
              {[
                { label: "1", y: 68 },
                { label: "2", y: 102 },
                { label: "3", y: 136 },
                { label: "4", y: 170 },
              ].map((item) => (
                <g key={item.label}>
                  <circle cx="114" cy={item.y} r="4.5" fill="#db073d" />
                  <text
                    x="92"
                    y={item.y + 4}
                    textAnchor="end"
                    className="fill-[#160002] text-[13px] font-bold"
                  >
                    {item.label}
                  </text>
                </g>
              ))}

              {/* Codomain / Range Elements */}
              {[
                { label: "a = f(1)", y: 68, inRange: true },
                { label: "b = f(2) = f(3)", y: 100, inRange: true },
                { label: "c = f(4)", y: 128, inRange: true },
                { label: "d (គ្មានព្រួញចូល)", y: 180, inRange: false },
              ].map((item) => (
                <g key={item.label}>
                  <circle
                    cx="342"
                    cy={item.y}
                    r="4.5"
                    fill={item.inRange ? "#009b5e" : "#94a3b8"}
                  />
                  <text
                    x="352"
                    y={item.y + 4}
                    textAnchor="start"
                    className={`text-[11px] font-bold ${
                      item.inRange ? "fill-[#005936]" : "fill-[#64748b]"
                    }`}
                  >
                    {item.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}

        {preset === "vertical-line-pass" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 3.5], y: [-2, 4.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x - 1} color="#0085dd" weight={3} />
            <Line.Segment point1={[lineX, -3]} point2={[lineX, 5]} style="dashed" color="#009b5e" weight={2.5} />
            <Point x={lineX} y={lineX * lineX - 1} color="#009b5e" />
          </Mafs>
        )}

        {preset === "vertical-line-fail" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 3.5], y: [-3, 3] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Circle center={[0, 0]} radius={2} color="#0085dd" fillOpacity={0} weight={3} />
            <Line.Segment point1={[1, -3]} point2={[1, 3]} style="dashed" color="#db073d" weight={2.5} />
            <Point x={1} y={Math.sqrt(3)} color="#db073d" />
            <Point x={1} y={-Math.sqrt(3)} color="#db073d" />
          </Mafs>
        )}

        {preset === "piecewise-function" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 4.5], y: [-1.5, 5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {/* f(x) = x^2 for x < 1 */}
            <Plot.OfX y={(x) => (x < 0.96 ? x * x : NaN)} color="#0085dd" weight={3} />
            <Circle center={[1, 1]} radius={0.13} color="#0085dd" fillOpacity={0} weight={3} />
            {/* f(1) = 3 */}
            <Point x={1} y={3} color="#db073d" />
            {/* f(x) = x + 1 for x > 1 */}
            <Plot.OfX y={(x) => (x > 1.04 ? x + 1 : NaN)} color="#009b5e" weight={3} />
            <Circle center={[1, 2]} radius={0.13} color="#009b5e" fillOpacity={0} weight={3} />
          </Mafs>
        )}

        {preset === "linear-slope" && (
          <Mafs height={height} viewBox={{ x: [-4, 4], y: [-3, 5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => slope * x + 1} color="#0085dd" weight={3} />
            <Point x={0} y={1} color="#db073d" />
            <Line.Segment point1={[0, 1]} point2={[1, 1]} style="dashed" color="#009b5e" weight={2} />
            <Line.Segment point1={[1, 1]} point2={[1, slope + 1]} style="dashed" color="#009b5e" weight={2} />
            <Point x={1} y={slope + 1} color="#009b5e" />
          </Mafs>
        )}

        {preset === "trig-sine-cosine" && (
          <Mafs height={height} viewBox={{ x: [-6.5, 6.5], y: [-1.8, 1.8] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => Math.sin(x)} color="#db073d" weight={3} />
            <Plot.OfX y={(x) => Math.cos(x)} color="#0085dd" weight={2.5} style="dashed" />
            <Point x={0} y={0} color="#db073d" />
            <Point x={0} y={1} color="#0085dd" />
          </Mafs>
        )}

        {preset === "exp-log-inverse" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 5.5], y: [-3, 5.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x} color="#64748b" weight={1.5} style="dashed" />
            <Plot.OfX y={(x) => Math.exp(x)} color="#db073d" weight={3} />
            <Plot.OfX y={(x) => (x > 0.02 ? Math.log(x) : NaN)} color="#009b5e" weight={3} />
            <Point x={0} y={1} color="#db073d" />
            <Point x={1} y={0} color="#009b5e" />
          </Mafs>
        )}

        {preset === "graph-shift-scale" && (
          <Mafs height={height} viewBox={{ x: [-4.5, 4.5], y: [-3, 6] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x} color="#0085dd" weight={2} style="dashed" />
            <Plot.OfX y={(x) => (x - shiftH) * (x - shiftH) + shiftK} color="#db073d" weight={3} />
            <Point x={0} y={0} color="#0085dd" />
            <Point x={shiftH} y={shiftK} color="#db073d" />
          </Mafs>
        )}

        {preset === "inverse-reflection" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 5], y: [-3.5, 5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x} color="#64748b" weight={1.5} style="dashed" />
            <Plot.OfX y={(x) => (x >= 0 ? x * x : NaN)} color="#db073d" weight={3} />
            <Plot.OfX y={(x) => (x >= 0 ? Math.sqrt(x) : NaN)} color="#009b5e" weight={3} />
            <Point x={2} y={4} color="#db073d" />
            <Point x={4} y={2} color="#009b5e" />
            <Line.Segment point1={[2, 4]} point2={[4, 2]} style="dashed" color="#0097a8" weight={1.5} />
          </Mafs>
        )}

        {preset === "graph-scaling" && (
          <Mafs height={height} viewBox={{ x: [-6.3, 6.3], y: [-3.2, 3.2] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => Math.sin(x)} color="#0085dd" weight={2} style="dashed" />
            <Plot.OfX y={(x) => scaleC * Math.sin(x)} color="#db073d" weight={3} />
            <Plot.OfX y={(x) => Math.sin(scaleC * x)} color="#009b5e" weight={2.5} />
          </Mafs>
        )}

        {preset === "graph-reflection" && (
          <Mafs height={height} viewBox={{ x: [-4.5, 4.5], y: [-3, 3] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => (x >= 0 ? Math.sqrt(x) : NaN)} color="#0085dd" weight={2.5} style="dashed" />
            <Plot.OfX y={(x) => (x >= 0 ? -Math.sqrt(x) : NaN)} color="#db073d" weight={3} />
            <Plot.OfX y={(x) => (x <= 0 ? Math.sqrt(-x) : NaN)} color="#009b5e" weight={3} />
            <Point x={1} y={1} color="#0085dd" />
            <Point x={1} y={-1} color="#db073d" />
            <Point x={-1} y={1} color="#009b5e" />
          </Mafs>
        )}

        {preset === "graph-abs-transform" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 3.5], y: [-2, 4] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x - 2 * x} color="#0085dd" weight={2} style="dashed" />
            {absMode === "outer" ? (
              <Plot.OfX y={(x) => Math.abs(x * x - 2 * x)} color="#db073d" weight={3} />
            ) : (
              <Plot.OfX y={(x) => Math.abs(x) * Math.abs(x) - 2 * Math.abs(x)} color="#009b5e" weight={3} />
            )}
          </Mafs>
        )}

        {preset === "example-parabola-steps" && (
          <Mafs height={height} viewBox={{ x: [-3.5, 4.5], y: [-5, 5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {parabolaStep === 1 && (
              <>
                <Plot.OfX y={(x) => x * x} color="#db073d" weight={3} />
                <Point x={0} y={0} color="#db073d" />
              </>
            )}
            {parabolaStep === 2 && (
              <>
                <Plot.OfX y={(x) => x * x} color="#0085dd" weight={2} style="dashed" />
                <Plot.OfX y={(x) => (x - 1) * (x - 1)} color="#db073d" weight={3} />
                <Point x={0} y={0} color="#0085dd" />
                <Point x={1} y={0} color="#db073d" />
              </>
            )}
            {parabolaStep === 3 && (
              <>
                <Plot.OfX y={(x) => (x - 1) * (x - 1)} color="#0085dd" weight={2} style="dashed" />
                <Plot.OfX y={(x) => -2 * (x - 1) * (x - 1)} color="#db073d" weight={3} />
                <Point x={1} y={0} color="#db073d" />
              </>
            )}
            {parabolaStep === 4 && (
              <>
                <Plot.OfX y={(x) => -2 * (x - 1) * (x - 1)} color="#0085dd" weight={2} style="dashed" />
                <Plot.OfX y={(x) => -2 * (x - 1) * (x - 1) + 3} color="#db073d" weight={3} />
                <Point x={1} y={0} color="#0085dd" />
                <Point x={1} y={3} color="#db073d" />
              </>
            )}
          </Mafs>
        )}

        {preset === "secant-to-tangent" && (() => {
          const x0 = 1;
          const y0 = 1;
          const x1 = x0 + secantH;
          const y1 = x1 * x1;
          const secSlope = (y1 - y0) / secantH;
          return (
            <Mafs height={height} viewBox={{ x: [-1.5, 4], y: [-1, 6.5] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Plot.OfX y={(x) => x * x} color="#0085dd" weight={3} />
              {/* True Tangent at x = 1: y = 2x - 1 */}
              <Plot.OfX y={(x) => 2 * x - 1} color="#db073d" weight={2.5} />
              {/* Secant line through (1,1) and (1+h, (1+h)^2) */}
              <Plot.OfX y={(x) => y0 + secSlope * (x - x0)} color="#009b5e" weight={2} style="dashed" />
              <Point x={x0} y={y0} color="#db073d" />
              <Point x={x1} y={y1} color="#009b5e" />
            </Mafs>
          );
        })()}

        {preset === "non-diff-corner" && (
          <Mafs height={height} viewBox={{ x: [-3, 3], y: [-2.2, 3] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {nonDiffMode === "corner" ? (
              <>
                <Plot.OfX y={(x) => Math.abs(x)} color="#db073d" weight={3} />
                <Point x={0} y={0} color="#db073d" />
              </>
            ) : (
              <>
                <Plot.OfX y={(x) => Math.cbrt(x)} color="#db073d" weight={3} />
                <Line.Segment point1={[0, -2]} point2={[0, 2]} style="dashed" color="#0097a8" weight={2} />
                <Point x={0} y={0} color="#db073d" />
              </>
            )}
          </Mafs>
        )}

        {preset === "secant-rate" && (
          <Mafs height={height} viewBox={{ x: [-1, 3.5], y: [-0.8, 5.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x} color="#0085dd" weight={3} />
            {/* Secant line through P(1,1) and Q(2,4): y = 3x - 2 */}
            <Plot.OfX y={(x) => 3 * x - 2} color="#009b5e" weight={2.5} />
            {/* Δx and Δy triangle */}
            <Line.Segment point1={[1, 1]} point2={[2, 1]} style="dashed" color="#b95a00" weight={2} />
            <Line.Segment point1={[2, 1]} point2={[2, 4]} style="dashed" color="#b95a00" weight={2} />
            <Point x={1} y={1} color="#db073d" />
            <Point x={2} y={4} color="#009b5e" />
          </Mafs>
        )}

        {preset === "tangent-normal" && (
          <Mafs height={height} viewBox={{ x: [-1.5, 5], y: [-3.5, 3.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => x * x - 3 * x + 1} color="#0085dd" weight={3} />
            <Plot.OfX y={(x) => x - 3} color="#db073d" weight={2.5} />
            <Plot.OfX y={(x) => -x + 1} color="#009b5e" weight={2.5} style="dashed" />
            <Point x={2} y={-1} color="#db073d" />
          </Mafs>
        )}

        {preset === "chain-rule-flow" && (
          <div className="w-full overflow-x-auto bg-white px-3 py-5">
            <svg
              viewBox="0 0 640 190"
              className="mx-auto h-auto w-full max-w-[600px]"
              role="img"
              aria-label="ដ្យាក្រាមអនុគមន៍បណ្តាក់ g(f(x))"
            >
              <defs>
                <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#0085dd" />
                </marker>
                <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#009b5e" />
                </marker>
                <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#db073d" />
                </marker>
              </defs>

              {/* Node 1: x */}
              <rect x="24" y="34" width="120" height="64" rx="14" fill="#fffafa" stroke="#fdbcbc" strokeWidth="2" />
              <text x="84" y="62" textAnchor="middle" fontSize="20" fontWeight="700" fill="#160002">x</text>
              <text x="84" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="#7e021f">អថេរដើម</text>

              {/* Arrow 1: f (inner) */}
              <line x1="148" y1="66" x2="246" y2="66" stroke="#0085dd" strokeWidth="2.5" markerEnd="url(#arrowBlue)" />
              <text x="197" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0085dd">f (ខាងក្នុង)</text>
              <text x="197" y="86" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0085dd">× f'(x)</text>

              {/* Node 2: u = f(x) */}
              <rect x="254" y="34" width="132" height="64" rx="14" fill="#eff6ff" stroke="#0085dd" strokeWidth="2" />
              <text x="320" y="62" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0f172a">u = f(x)</text>
              <text x="320" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0085dd">អថេរកណ្តាល</text>

              {/* Arrow 2: g (outer) */}
              <line x1="390" y1="66" x2="486" y2="66" stroke="#009b5e" strokeWidth="2.5" markerEnd="url(#arrowGreen)" />
              <text x="438" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#009b5e">g (ខាងក្រៅ)</text>
              <text x="438" y="86" textAnchor="middle" fontSize="12" fontWeight="700" fill="#009b5e">× g'(u)</text>

              {/* Node 3: y = g(u) */}
              <rect x="494" y="34" width="126" height="64" rx="14" fill="#ecfdf5" stroke="#009b5e" strokeWidth="2" />
              <text x="557" y="62" textAnchor="middle" fontSize="17" fontWeight="700" fill="#064e3b">y = g(u)</text>
              <text x="557" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="#009b5e">លទ្ធផល</text>

              {/* Bottom curved arc: composite derivative */}
              <path
                d="M 84 106 Q 320 176 550 108"
                fill="none"
                stroke="#db073d"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                markerEnd="url(#arrowRed)"
              />
              <rect x="200" y="138" width="240" height="32" rx="10" fill="#ffe9e8" stroke="#fdbcbc" strokeWidth="1.5" />
              <text x="320" y="159" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9c0329">
                (g ∘ f)'(x) = g'(f(x)) · f'(x)
              </text>
            </svg>
          </div>
        )}

        {preset === "circle-tangent" && (
          <Mafs height={height} viewBox={{ x: [-7, 9], y: [-6.5, 7.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Circle center={[0, 0]} radius={5} color="#0085dd" fillOpacity={0.05} />
            {/* Radius OM from (0,0) to M(3,4) */}
            <Line.Segment point1={[0, 0]} point2={[3, 4]} style="dashed" color="#009b5e" weight={2.5} />
            {/* Tangent line 3x + 4y = 25 => y = -3/4 x + 25/4 */}
            <Plot.OfX y={(x) => (-3 / 4) * x + 25 / 4} color="#db073d" weight={2.5} />
            <Point x={0} y={0} color="#64748b" />
            <Point x={3} y={4} color="#db073d" />
          </Mafs>
        )}

        {preset === "folium-descartes" && (
          <Mafs height={height} viewBox={{ x: [-4.5, 6.5], y: [-4.5, 6.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {/* Asymptote x + y = -2 */}
            <Plot.OfX y={(x) => -x - 2} color="#64748b" weight={1.5} style="dashed" />
            {/* Folium of Descartes: x = 6t/(1+t³), y = 6t²/(1+t³) */}
            <Plot.Parametric
              t={[-0.74, 14]}
              xy={(t) => {
                const d = 1 + t * t * t;
                return [(6 * t) / d, (6 * t * t) / d];
              }}
              color="#0085dd"
              weight={3}
            />
            <Plot.Parametric
              t={[-14, -1.32]}
              xy={(t) => {
                const d = 1 + t * t * t;
                return [(6 * t) / d, (6 * t * t) / d];
              }}
              color="#0085dd"
              weight={3}
            />
            {/* Tangent line at A(3, 3): y = -x + 6 */}
            <Plot.OfX y={(x) => -x + 6} color="#db073d" weight={2.5} />
            <Point x={3} y={3} color="#db073d" />
          </Mafs>
        )}

        {preset === "sliding-ladder" && (
          <div className="w-full overflow-x-auto bg-white px-3 py-4">
            <svg
              viewBox="0 0 460 220"
              className="mx-auto h-auto w-full max-w-[440px]"
              role="img"
              aria-label="ដ្យាក្រាមជណ្តើររអិល x² + y² = L²"
            >
              <defs>
                <marker id="arrowBlueL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#0085dd" />
                </marker>
                <marker id="arrowGreenL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#009b5e" />
                </marker>
              </defs>

              {/* Wall & Floor */}
              <line x1="90" y1="20" x2="90" y2="180" stroke="#334155" strokeWidth="4" />
              <line x1="90" y1="180" x2="410" y2="180" stroke="#334155" strokeWidth="4" />
              {/* Right angle mark */}
              <rect x="90" y="164" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="1.5" />

              {/* Ladder */}
              <line x1="90" y1="45" x2="290" y2="180" stroke="#db073d" strokeWidth="5" strokeLinecap="round" />
              <circle cx="90" cy="45" r="5" fill="#009b5e" />
              <circle cx="290" cy="180" r="5" fill="#0085dd" />

              {/* Labels */}
              <text x="205" y="102" fontSize="14" fontWeight="700" fill="#db073d">L = 5 m</text>
              <text x="54" y="116" fontSize="14" fontWeight="700" fill="#009b5e">y(t)</text>
              <text x="180" y="202" fontSize="14" fontWeight="700" fill="#0085dd">x(t)</text>

              {/* dy/dt arrow (down) */}
              <line x1="72" y1="48" x2="72" y2="90" stroke="#009b5e" strokeWidth="2.5" markerEnd="url(#arrowGreenL)" />
              <text x="12" y="72" fontSize="12" fontWeight="700" fill="#009b5e">dy/dt &lt; 0</text>

              {/* dx/dt arrow (right) */}
              <line x1="302" y1="168" x2="368" y2="168" stroke="#0085dd" strokeWidth="2.5" markerEnd="url(#arrowBlueL)" />
              <text x="315" y="156" fontSize="12" fontWeight="700" fill="#0085dd">dx/dt &gt; 0</text>

              {/* Equation badge */}
              <rect x="275" y="26" width="165" height="46" rx="10" fill="#ffe9e8" stroke="#fdbcbc" strokeWidth="1.5" />
              <text x="357" y="46" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9c0329">x² + y² = 25</text>
              <text x="357" y="63" textAnchor="middle" fontSize="11" fontWeight="700" fill="#47010d">x·(dx/dt) + y·(dy/dt) = 0</text>
            </svg>
          </div>
        )}

        {preset === "linear-approx" && (
          <Mafs height={height} viewBox={{ x: [0, 8.5], y: [0, 3.6] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            <Plot.OfX y={(x) => (x >= 0 ? Math.sqrt(x) : NaN)} color="#0085dd" weight={3} />
            <Plot.OfX y={(x) => 2 + 0.25 * (x - 4)} color="#db073d" weight={2.5} />
            {/* dx and dy/Δy comparison at x = 7 */}
            <Line.Segment point1={[4, 2]} point2={[7, 2]} style="dashed" color="#64748b" weight={1.8} />
            <Line.Segment point1={[7, 2]} point2={[7, 2.75]} style="dashed" color="#009b5e" weight={2.2} />
            <Point x={4} y={2} color="#db073d" />
            <Point x={7} y={Math.sqrt(7)} color="#0085dd" />
            <Point x={7} y={2.75} color="#009b5e" />
          </Mafs>
        )}

        {preset === "expanding-sphere" && (
          <div className="w-full overflow-x-auto bg-white px-3 py-4">
            <svg
              viewBox="0 0 460 210"
              className="mx-auto h-auto w-full max-w-[440px]"
              role="img"
              aria-label="ដ្យាក្រាមបាល់ប៉ោងរាងស្វ៊ែរពង្រីក"
            >
              <defs>
                <radialGradient id="sphereGrad" cx="38%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#eff6ff" />
                  <stop offset="70%" stopColor="#bfdbfe" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#0085dd" stopOpacity="0.28" />
                </radialGradient>
                <marker id="arrowRedSp" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#db073d" />
                </marker>
              </defs>

              {/* Outer expanding sphere */}
              <circle cx="155" cy="105" r="76" fill="url(#sphereGrad)" stroke="#0085dd" strokeWidth="2.5" />
              {/* Equatorial ellipse for 3D depth */}
              <ellipse cx="155" cy="105" rx="76" ry="22" fill="none" stroke="#0085dd" strokeWidth="1.5" strokeDasharray="5 4" />
              {/* Inner previous radius dashed circle */}
              <circle cx="155" cy="105" r="48" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Center & Radius arrow */}
              <circle cx="155" cy="105" r="3.5" fill="#160002" />
              <line x1="155" y1="105" x2="226" y2="85" stroke="#db073d" strokeWidth="2.5" markerEnd="url(#arrowRedSp)" />
              <text x="194" y="84" fontSize="13" fontWeight="700" fill="#db073d">r(t)</text>

              {/* Expansion outward arrows */}
              <line x1="155" y1="24" x2="155" y2="8" stroke="#db073d" strokeWidth="2" markerEnd="url(#arrowRedSp)" />
              <line x1="236" y1="105" x2="254" y2="105" stroke="#db073d" strokeWidth="2" markerEnd="url(#arrowRedSp)" />
              <line x1="74" y1="105" x2="56" y2="105" stroke="#db073d" strokeWidth="2" markerEnd="url(#arrowRedSp)" />

              {/* Info card */}
              <rect x="275" y="42" width="168" height="122" rx="12" fill="#fffafa" stroke="#fdbcbc" strokeWidth="1.5" />
              <text x="359" y="68" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9c0329">V = (4/3)πr³</text>
              <text x="359" y="92" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0085dd">dV/dt = 100 cm³/s</text>
              <line x1="292" y1="106" x2="426" y2="106" stroke="#ffd3d2" strokeWidth="1" />
              <text x="359" y="128" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#160002">ត្រង់ r = 5 cm៖</text>
              <text x="359" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#db073d">dr/dt = 1/π cm/s</text>
            </svg>
          </div>
        )}

        {preset === "conical-tank" && (
          <div className="w-full overflow-x-auto bg-white px-3 py-4">
            <svg
              viewBox="0 0 460 225"
              className="mx-auto h-auto w-full max-w-[440px]"
              role="img"
              aria-label="ដ្យាក្រាមអាងទឹករាងកោណ និងត្រីកោណដូចគ្នា"
            >
              <defs>
                <marker id="arrowBlueC" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#0085dd" />
                </marker>
              </defs>

              {/* Water fill (lower half of inverted cone) */}
              <polygon points="108,118 202,118 155,198" fill="#bfdbfe" fillOpacity="0.65" />
              <ellipse cx="155" cy="118" rx="47" ry="11" fill="#93c5fd" fillOpacity="0.7" stroke="#0085dd" strokeWidth="1.8" />

              {/* Outer inverted cone */}
              <ellipse cx="155" cy="36" rx="86" ry="16" fill="#f8fafc" fillOpacity="0.55" stroke="#334155" strokeWidth="2.2" />
              <line x1="69" y1="36" x2="155" y2="198" stroke="#334155" strokeWidth="2.2" />
              <line x1="241" y1="36" x2="155" y2="198" stroke="#334155" strokeWidth="2.2" />

              {/* Center axis & similar right triangles highlight */}
              <line x1="155" y1="36" x2="155" y2="198" stroke="#db073d" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="155" y1="36" x2="241" y2="36" stroke="#db073d" strokeWidth="2.2" />
              <line x1="155" y1="118" x2="202" y2="118" stroke="#db073d" strokeWidth="2.2" />

              {/* Dimension labels */}
              <text x="196" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill="#db073d">R = 4 m</text>
              <text x="178" y="112" textAnchor="middle" fontSize="12" fontWeight="700" fill="#db073d">r(t)</text>
              <text x="136" y="162" textAnchor="end" fontSize="12" fontWeight="700" fill="#0085dd">h(t)</text>
              <text x="52" y="122" textAnchor="end" fontSize="12" fontWeight="700" fill="#334155">H = 12 m</text>
              {/* Total height bracket */}
              <line x1="58" y1="36" x2="58" y2="198" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Rising water arrow */}
              <line x1="120" y1="145" x2="120" y2="124" stroke="#0085dd" strokeWidth="2.2" markerEnd="url(#arrowBlueC)" />

              {/* Similar triangles info box */}
              <rect x="268" y="42" width="176" height="132" rx="12" fill="#fffafa" stroke="#fdbcbc" strokeWidth="1.5" />
              <text x="356" y="66" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#9c0329">ត្រីកោណដូចគ្នា</text>
              <text x="356" y="88" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#db073d">r / h = 4 / 12 = 1/3</text>
              <text x="356" y="108" textAnchor="middle" fontSize="12" fontWeight="700" fill="#160002">⇒ r = h / 3</text>
              <line x1="286" y1="120" x2="426" y2="120" stroke="#ffd3d2" strokeWidth="1" />
              <text x="356" y="140" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0085dd">V = (π/27) h³</text>
              <text x="356" y="160" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#009b5e">dh/dt = 1/(2π) m/min</text>
            </svg>
          </div>
        )}

        {preset === "extrema-local-global" && (() => {
          const f = (x) => 0.5 * (x * x * x - 3 * x) + 1;
          const df = (x) => 1.5 * (x * x - 1);
          const y0 = f(extremaX);
          const m = df(extremaX);
          const isFlat = Math.abs(m) < 0.08;
          return (
            <Mafs height={height} viewBox={{ x: [-2.6, 2.8], y: [-1.8, 4.2] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Plot.OfX y={(x) => (x >= -2.1 && x <= 2.3 ? f(x) : NaN)} color="#0085dd" weight={3} />
              {/* Tangent line at extremaX */}
              <Plot.OfX
                y={(x) => y0 + m * (x - extremaX)}
                color={isFlat ? "#009b5e" : "#db073d"}
                weight={2.5}
                style={isFlat ? "solid" : "dashed"}
              />
              {/* Critical points (-1, 2) and (1, 0) */}
              <Point x={-1} y={2} color="#009b5e" />
              <Point x={1} y={0} color="#009b5e" />
              {/* Moving point */}
              <Point x={extremaX} y={y0} color={isFlat ? "#009b5e" : "#db073d"} />
            </Mafs>
          );
        })()}

        {preset === "fermat-counterexample" && (
          <Mafs height={height} viewBox={{ x: [-2.5, 2.5], y: [-2.5, 2.5] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {fermatMode === "cubic" ? (
              <>
                <Plot.OfX y={(x) => x * x * x} color="#0085dd" weight={3} />
                <Line.Segment point1={[-1.4, 0]} point2={[1.4, 0]} color="#009b5e" weight={2.5} style="dashed" />
                <Point x={0} y={0} color="#db073d" />
              </>
            ) : (
              <>
                <Plot.OfX y={(x) => Math.abs(x)} color="#0085dd" weight={3} />
                <Point x={0} y={0} color="#db073d" />
              </>
            )}
          </Mafs>
        )}

        {preset === "closed-interval-method" && (() => {
          const f = (x) => 2 * x * x * x - 9 * x * x + 12 * x - 1;
          const candidates = [
            { x: 0, y: -1 },
            { x: 1, y: 4 },
            { x: 2, y: 3 },
            { x: 3, y: 8 },
          ];
          const active = candidates[intervalIdx] || candidates[3];
          return (
            <Mafs height={height} viewBox={{ x: [-0.7, 3.7], y: [-2.4, 9.4] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              {/* Interval boundaries x = 0 and x = 3 */}
              <Line.Segment point1={[0, -2.4]} point2={[0, 9.4]} color="#64748b" style="dashed" weight={1.5} />
              <Line.Segment point1={[3, -2.4]} point2={[3, 9.4]} color="#64748b" style="dashed" weight={1.5} />
              <Plot.OfX y={(x) => (x >= 0 && x <= 3 ? f(x) : NaN)} color="#0085dd" weight={3} />
              {/* Horizontal level line for selected candidate */}
              <Line.Segment point1={[0, active.y]} point2={[active.x, active.y]} color="#db073d" style="dashed" weight={2} />
              {candidates.map((pt, i) => (
                <Point
                  key={i}
                  x={pt.x}
                  y={pt.y}
                  color={i === intervalIdx ? "#db073d" : i === 0 || i === 3 ? "#009b5e" : "#b95a00"}
                />
              ))}
            </Mafs>
          );
        })()}

        {preset === "rolle-theorem" && (() => {
          const f = (x) => -0.5 * (x - 1) * (x - 5);
          const df = (x) => 3 - x;
          const y0 = f(rolleX);
          const m = df(rolleX);
          const isFlat = Math.abs(m) < 0.08;
          return (
            <Mafs height={height} viewBox={{ x: [0, 6], y: [-0.8, 3.2] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Plot.OfX y={(x) => (x >= 1 && x <= 5 ? f(x) : NaN)} color="#0085dd" weight={3} />
              {/* Horizontal chord f(1) = f(5) = 0 */}
              <Line.Segment point1={[1, 0]} point2={[5, 0]} color="#64748b" style="dashed" weight={2} />
              {/* Tangent line at rolleX */}
              <Plot.OfX
                y={(x) => y0 + m * (x - rolleX)}
                color={isFlat ? "#009b5e" : "#db073d"}
                weight={2.5}
              />
              <Point x={1} y={0} color="#64748b" />
              <Point x={5} y={0} color="#64748b" />
              <Point x={3} y={2} color="#009b5e" />
              <Point x={rolleX} y={y0} color={isFlat ? "#009b5e" : "#db073d"} />
            </Mafs>
          );
        })()}

        {preset === "mvt-theorem" && (() => {
          const f = (x) => 2 * Math.sqrt(x);
          const df = (x) => 1 / Math.sqrt(x);
          const y0 = f(mvtX);
          const m = df(mvtX);
          const isParallel = Math.abs(m - 1) < 0.06;
          return (
            <Mafs height={height} viewBox={{ x: [-0.5, 4.6], y: [-0.5, 4.8] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Plot.OfX y={(x) => (x >= 0 && x <= 4 ? f(x) : NaN)} color="#0085dd" weight={3} />
              {/* Secant line AB from (0, 0) to (4, 4): y = x */}
              <Line.Segment point1={[0, 0]} point2={[4, 4]} color="#009b5e" weight={2.5} style="dashed" />
              {/* Moving tangent at mvtX */}
              <Plot.OfX
                y={(x) => y0 + m * (x - mvtX)}
                color={isParallel ? "#009b5e" : "#db073d"}
                weight={2.5}
              />
              <Point x={0} y={0} color="#009b5e" />
              <Point x={4} y={4} color="#009b5e" />
              <Point x={1} y={2} color="#009b5e" />
              <Point x={mvtX} y={y0} color={isParallel ? "#009b5e" : "#db073d"} />
            </Mafs>
          );
        })()}

        {preset === "monotonicity-concavity" && (() => {
          const f = (x) => x * x * x - 3 * x * x + 2;
          const df = (x) => 3 * x * x - 6 * x;
          const y0 = f(curveX);
          const m = df(curveX);
          return (
            <Mafs height={height} viewBox={{ x: [-1.4, 3.4], y: [-3.2, 3.6] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              {/* Concave down branch (x <= 1) */}
              <Plot.OfX y={(x) => (x <= 1 ? f(x) : NaN)} color="#0085dd" weight={3} />
              {/* Concave up branch (x >= 1) */}
              <Plot.OfX y={(x) => (x >= 1 ? f(x) : NaN)} color="#009b5e" weight={3} />
              {/* Moving tangent at curveX */}
              <Plot.OfX y={(x) => y0 + m * (x - curveX)} color="#db073d" weight={2.2} style="dashed" />
              {/* Local Max (0,2), Inflection (1,0), Local Min (2,-2) */}
              <Point x={0} y={2} color="#0085dd" />
              <Point x={1} y={0} color="#db073d" />
              <Point x={2} y={-2} color="#009b5e" />
              <Point x={curveX} y={y0} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "curve-sketch-rational" && (
          <Mafs height={height} viewBox={{ x: [-4, 6], y: [-6, 6] }} zoom={false} pan={false}>
            <Coordinates.Cartesian subdivisions={1} />
            {/* Step 1+: Vertical asymptote x = 1 and Oblique asymptote y = x - 1 */}
            <Line.Segment point1={[1, -7]} point2={[1, 7]} color="#64748b" style="dashed" weight={2} />
            <Plot.OfX y={(x) => x - 1} color="#64748b" style="dashed" weight={2} />
            {/* Step 2+: Extrema points & horizontal tangents */}
            {sketchStep >= 2 && (
              <>
                <Line.Segment point1={[-0.9, -2]} point2={[0.8, -2]} color="#009b5e" weight={2} />
                <Line.Segment point1={[1.2, 2]} point2={[2.9, 2]} color="#009b5e" weight={2} />
                <Point x={0} y={-2} color="#009b5e" />
                <Point x={2} y={2} color="#009b5e" />
                <Point x={1} y={0} color="#db073d" />
              </>
            )}
            {/* Step 3: Full curve branches */}
            {sketchStep >= 3 && (
              <>
                <Plot.OfX y={(x) => (x < 0.92 ? x - 1 + 1 / (x - 1) : NaN)} color="#0085dd" weight={3} />
                <Plot.OfX y={(x) => (x > 1.08 ? x - 1 + 1 / (x - 1) : NaN)} color="#0085dd" weight={3} />
              </>
            )}
          </Mafs>
        )}

        {preset === "lhopital-ratio" && (() => {
          const fx = Math.sin(2 * lhopX);
          const gx = Math.log(1 + lhopX);
          return (
            <Mafs height={height} viewBox={{ x: [-0.4, 1.3], y: [-0.3, 1.5] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              {/* f(x) = sin(2x) and its tangent y = 2x */}
              <Plot.OfX y={(x) => Math.sin(2 * x)} color="#db073d" weight={3} />
              <Plot.OfX y={(x) => 2 * x} color="#db073d" weight={1.5} style="dashed" />
              {/* g(x) = ln(1 + x) and its tangent y = x */}
              <Plot.OfX y={(x) => (x > -0.95 ? Math.log(1 + x) : NaN)} color="#0085dd" weight={3} />
              <Plot.OfX y={(x) => x} color="#0085dd" weight={1.5} style="dashed" />
              {/* Vertical comparison line at lhopX */}
              <Line.Segment point1={[lhopX, 0]} point2={[lhopX, Math.max(fx, gx)]} color="#009b5e" style="dashed" weight={2} />
              <Point x={lhopX} y={fx} color="#db073d" />
              <Point x={lhopX} y={gx} color="#0085dd" />
              <Point x={0} y={0} color="#009b5e" />
            </Mafs>
          );
        })()}

        {preset === "optimization-box" && (() => {
          const yLen = 40 - 2 * optX;
          const area = optX * yLen;
          const isMax = Math.abs(optX - 10) < 0.2;
          const rectW = Math.max(24, yLen * 6.5);
          const rectH = Math.max(18, optX * 6.5);
          const rectX = 230 - rectW / 2;
          return (
            <div className="w-full overflow-x-auto bg-white px-3 py-4">
              <svg
                viewBox="0 0 460 215"
                className="mx-auto h-auto w-full max-w-[440px]"
                role="img"
                aria-label="ដ្យាក្រាមអន្តរកម្មបរមាកម្មផ្ទៃដីចតុកោណកែងជាប់ទន្លេ"
              >
                {/* River along top */}
                <rect x="20" y="12" width="420" height="32" rx="8" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="230" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369a1">
                  មាត់ទន្លេ (មិនបាច់ធ្វើរបង)
                </text>

                {/* Dynamic Rectangular Garden */}
                <rect
                  x={rectX}
                  y="44"
                  width={rectW}
                  height={rectH}
                  fill={isMax ? "#dcfce7" : "#ffe9e8"}
                  stroke={isMax ? "#009b5e" : "#db073d"}
                  strokeWidth="3"
                />

                {/* Area Label inside */}
                <text
                  x="230"
                  y={44 + rectH / 2 + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={isMax ? "#065f46" : "#9c0329"}
                >
                  A = {area.toFixed(0)} m²
                </text>

                {/* Dimension Labels */}
                <text x={rectX - 8} y={44 + rectH / 2 + 4} textAnchor="end" fontSize="12" fontWeight="700" fill="#160002">
                  x = {optX} m
                </text>
                <text x={rectX + rectW + 8} y={44 + rectH / 2 + 4} textAnchor="start" fontSize="12" fontWeight="700" fill="#160002">
                  x = {optX} m
                </text>
                <text x="230" y={44 + rectH + 18} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0085dd">
                  y = 40 - 2x = {yLen} m
                </text>
              </svg>
            </div>
          );
        })()}

        {preset === "antiderivative-family" && (() => {
          const base = (x) => (x * x * x) / 3 - x;
          const xRef = 1.5;
          const slopeRef = xRef * xRef - 1; // 1.25
          const yRef = base(xRef) + antiC;
          return (
            <Mafs height={height} viewBox={{ x: [-2.6, 2.8], y: [-3.2, 3.6] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              {/* Faint reference family members C = -1.5, 0, 1.5 */}
              <Plot.OfX y={(x) => base(x) - 1.5} color="#94a3b8" weight={1.4} style="dashed" />
              <Plot.OfX y={(x) => base(x)} color="#94a3b8" weight={1.4} style="dashed" />
              <Plot.OfX y={(x) => base(x) + 1.5} color="#94a3b8" weight={1.4} style="dashed" />
              {/* Active antiderivative F(x) + C */}
              <Plot.OfX y={(x) => base(x) + antiC} color="#0085dd" weight={3} />
              {/* Parallel tangent at x = 1.5 */}
              <Plot.OfX
                y={(x) => (Math.abs(x - xRef) <= 1.1 ? yRef + slopeRef * (x - xRef) : NaN)}
                color="#db073d"
                weight={2.5}
              />
              <Point x={0} y={antiC} color="#009b5e" />
              <Point x={xRef} y={yRef} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "riemann-partition" && (() => {
          const xAxisY = 230;
          const yAxisX = 62;
          const xStart = 92;
          const xEnd = 480;
          const span = xEnd - xStart; // 388px

          const fVal = (xPx) => {
            const t = (xPx - xStart) / span;
            return 1.62 + 0.56 * Math.sin(2.15 * Math.PI * t - 0.1) + 0.52 * t;
          };
          const toPy = (val) => xAxisY - val * 68;

          // Build smooth SVG path for y = f(x) over [74, 514]
          const curvePoints = [];
          for (let x = 74; x <= 514; x += 4) {
            curvePoints.push(`${x === 74 ? "M" : "L"} ${x.toFixed(1)} ${toPy(fVal(x)).toFixed(1)}`);
          }
          const curvePath = curvePoints.join(" ");

          // Soft under-curve area path on [a, b] = [92, 480]
          const areaPts = [`M ${xStart} ${xAxisY}`];
          for (let x = xStart; x <= xEnd; x += 4) {
            areaPts.push(`L ${x.toFixed(1)} ${toPy(fVal(x)).toFixed(1)}`);
          }
          areaPts.push(`L ${xEnd} ${xAxisY} Z`);
          const areaPath = areaPts.join(" ");

          // 4 shown uniform subintervals of width 72px with two ellipsis gaps of 50px
          const slots = [
            { id: "r1", xL: 92, xR: 164, highlight: false },
            { id: "r2", xL: 164, xR: 236, highlight: false },
            { id: "rk", xL: 286, xR: 358, highlight: true },
            { id: "rn", xL: 408, xR: 480, highlight: false },
          ];

          const kSlot = slots[2];
          const xStar = kSlot.xL + partSampleFrac * (kSlot.xR - kSlot.xL);
          const yStar = toPy(fVal(xStar));
          const kMidX = (kSlot.xL + kSlot.xR) / 2;

          const ticks = [
            { x: 92, label: "a = x₀", bold: true },
            { x: 164, label: "x₁", bold: false },
            { x: 236, label: "x₂", bold: false },
            { x: 286, label: "xₖ₋₁", bold: true, accent: true },
            { x: 358, label: "xₖ", bold: true, accent: true },
            { x: 408, label: "xₙ₋₁", bold: false },
            { x: 480, label: "xₙ = b", bold: true },
          ];

          return (
            <div className="flex items-center justify-center bg-white p-2 sm:p-3">
              <svg
                viewBox="0 0 600 300"
                className="w-full max-w-[600px] h-auto"
                role="img"
                aria-label="ក្រាបទូទៅពន្យល់ការបែងចែកចន្លោះ [a, b] និងផលបូក Riemann"
              >
                <defs>
                  <marker
                    id="rp-axis-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
                  </marker>
                  <marker
                    id="rp-red-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#db073d" />
                  </marker>
                </defs>

                {/* Subtle shaded true area under y = f(x) on [a, b] */}
                <path d={areaPath} fill="#0085dd" fillOpacity="0.06" />

                {/* Boundary vertical guide lines at x = a and x = b */}
                <line
                  x1={xStart}
                  y1={toPy(fVal(xStart))}
                  x2={xStart}
                  y2={xAxisY}
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <line
                  x1={xEnd}
                  y1={toPy(fVal(xEnd))}
                  x2={xEnd}
                  y2={xAxisY}
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                {/* Riemann Rectangles */}
                {slots.map((s) => {
                  const sx = s.xL + partSampleFrac * (s.xR - s.xL);
                  const sy = toPy(fVal(sx));
                  const rectH = xAxisY - sy;
                  return (
                    <g key={s.id}>
                      <rect
                        x={s.xL}
                        y={sy}
                        width={s.xR - s.xL}
                        height={rectH}
                        fill={s.highlight ? "#db073d" : "#0085dd"}
                        fillOpacity={s.highlight ? "0.2" : "0.14"}
                        stroke={s.highlight ? "#db073d" : "#0085dd"}
                        strokeWidth={s.highlight ? "2.2" : "1.4"}
                      />
                      {!s.highlight && (
                        <>
                          <line
                            x1={sx}
                            y1={sy}
                            x2={sx}
                            y2={xAxisY}
                            stroke="#0085dd"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                            opacity="0.55"
                          />
                          <circle cx={sx} cy={sy} r="3" fill="#0085dd" />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Ellipsis dots inside omitted subinterval gaps */}
                <text
                  x="261"
                  y="182"
                  textAnchor="middle"
                  className="fill-[#64748b] text-[18px] font-bold"
                >
                  ⋯
                </text>
                <text
                  x="383"
                  y="182"
                  textAnchor="middle"
                  className="fill-[#64748b] text-[18px] font-bold"
                >
                  ⋯
                </text>

                {/* Coordinate Axes */}
                <line
                  x1="42"
                  y1={xAxisY}
                  x2="566"
                  y2={xAxisY}
                  stroke="#334155"
                  strokeWidth="1.8"
                  markerEnd="url(#rp-axis-arrow)"
                />
                <line
                  x1={yAxisX}
                  y1="248"
                  x2={yAxisX}
                  y2="20"
                  stroke="#334155"
                  strokeWidth="1.8"
                  markerEnd="url(#rp-axis-arrow)"
                />
                <text x="576" y={xAxisY + 4} className="fill-[#1e293b] text-[13px] font-bold italic">
                  x
                </text>
                <text x={yAxisX - 14} y="24" className="fill-[#1e293b] text-[13px] font-bold italic">
                  y
                </text>
                <text x={yAxisX - 11} y={xAxisY + 15} className="fill-[#64748b] text-[11px] font-bold">
                  O
                </text>

                {/* General Smooth Curve y = f(x) */}
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#0085dd"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <text
                  x="518"
                  y={toPy(fVal(510)) + 4}
                  className="fill-[#0085dd] text-[13.5px] font-extrabold italic"
                >
                  y = f(x)
                </text>

                {/* Highlighted k-th Sample Point Projections */}
                <line
                  x1={yAxisX}
                  y1={yStar}
                  x2={xStar}
                  y2={yStar}
                  stroke="#db073d"
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                />
                <line
                  x1={xStar}
                  y1={yStar}
                  x2={xStar}
                  y2={xAxisY}
                  stroke="#db073d"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                />
                {/* Tick & label f(xₖ*) on y-axis */}
                <line
                  x1={yAxisX - 4}
                  y1={yStar}
                  x2={yAxisX + 4}
                  y2={yStar}
                  stroke="#db073d"
                  strokeWidth="2"
                />
                <text
                  x={yAxisX - 8}
                  y={yStar + 4}
                  textAnchor="end"
                  className="fill-[#db073d] text-[11.5px] font-extrabold"
                >
                  f(xₖ*)
                </text>

                {/* Sample point dots on curve and x-axis */}
                <circle cx={xStar} cy={yStar} r="4.5" fill="#db073d" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx={xStar} cy={xAxisY} r="3.8" fill="#db073d" />

                {/* Clean pill label xₖ* above x-axis inside k-th rectangle */}
                <g transform={`translate(${xStar}, ${xAxisY - 17})`}>
                  <rect
                    x="-15"
                    y="-10"
                    width="30"
                    height="16"
                    rx="5"
                    fill="#ffffff"
                    fillOpacity="0.92"
                    stroke="#db073d"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    className="fill-[#db073d] text-[11px] font-extrabold"
                  >
                    xₖ*
                  </text>
                </g>

                {/* Callout Badge for k-th Rectangle Area Aₖ = f(xₖ*)·Δx */}
                <line
                  x1={kMidX}
                  y1="56"
                  x2={kMidX}
                  y2={yStar - 3}
                  stroke="#db073d"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <rect
                  x={kMidX - 66}
                  y="32"
                  width="132"
                  height="24"
                  rx="7"
                  fill="#fff0f3"
                  stroke="#db073d"
                  strokeWidth="1.3"
                />
                <text
                  x={kMidX}
                  y="48"
                  textAnchor="middle"
                  className="fill-[#9c0329] text-[11.5px] font-extrabold"
                >
                  Aₖ = f(xₖ*) · Δx
                </text>

                {/* Partition Ticks & Labels on x-axis */}
                {ticks.map((tk) => (
                  <g key={tk.label}>
                    <line
                      x1={tk.x}
                      y1={xAxisY - 4}
                      x2={tk.x}
                      y2={xAxisY + 4}
                      stroke={tk.accent ? "#db073d" : "#334155"}
                      strokeWidth={tk.accent ? "2" : "1.5"}
                    />
                    <text
                      x={tk.x}
                      y={xAxisY + 19}
                      textAnchor="middle"
                      className={`text-[11px] ${
                        tk.accent
                          ? "fill-[#db073d] font-extrabold"
                          : tk.bold
                          ? "fill-[#160002] font-extrabold"
                          : "fill-[#475569] font-bold"
                      }`}
                    >
                      {tk.label}
                    </text>
                  </g>
                ))}
                {/* Ellipsis on x-axis labels */}
                <text x="261" y={xAxisY + 19} textAnchor="middle" className="fill-[#64748b] text-[13px] font-bold">
                  ⋯
                </text>
                <text x="383" y={xAxisY + 19} textAnchor="middle" className="fill-[#64748b] text-[13px] font-bold">
                  ⋯
                </text>

                {/* Width Dimension Bracket for Δx = (b - a)/n under [xₖ₋₁, xₖ] */}
                <line
                  x1={kSlot.xL}
                  y1={xAxisY + 26}
                  x2={kSlot.xL}
                  y2={xAxisY + 42}
                  stroke="#db073d"
                  strokeWidth="1.2"
                />
                <line
                  x1={kSlot.xR}
                  y1={xAxisY + 26}
                  x2={kSlot.xR}
                  y2={xAxisY + 42}
                  stroke="#db073d"
                  strokeWidth="1.2"
                />
                <line
                  x1={kSlot.xL + 3}
                  y1={xAxisY + 35}
                  x2={kSlot.xR - 3}
                  y2={xAxisY + 35}
                  stroke="#db073d"
                  strokeWidth="1.5"
                  markerStart="url(#rp-red-arrow)"
                  markerEnd="url(#rp-red-arrow)"
                />
                <text
                  x={kMidX}
                  y={xAxisY + 56}
                  textAnchor="middle"
                  className="fill-[#db073d] text-[11.5px] font-extrabold"
                >
                  Δx = (b − a) / n
                </text>
              </svg>
            </div>
          );
        })()}

        {preset === "riemann-sum" && (() => {
          const a = 0;
          const b = 2;
          const dx = (b - a) / riemannN;
          const rects = [];
          for (let k = 0; k < riemannN; k++) {
            const xL = a + k * dx;
            const xR = xL + dx;
            const sampleX =
              riemannMode === "left"
                ? xL
                : riemannMode === "mid"
                ? (xL + xR) / 2
                : xR;
            const h = sampleX * sampleX;
            rects.push({ xL, xR, h });
          }
          return (
            <Mafs height={height} viewBox={{ x: [-0.3, 2.4], y: [-0.4, 4.5] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              {rects.map((r, i) => (
                <Polygon
                  key={i}
                  points={[
                    [r.xL, 0],
                    [r.xR, 0],
                    [r.xR, r.h],
                    [r.xL, r.h],
                  ]}
                  color="#009b5e"
                  fillOpacity={0.22}
                  weight={1.5}
                />
              ))}
              <Plot.OfX y={(x) => (x >= 0 && x <= 2.2 ? x * x : NaN)} color="#0085dd" weight={3} />
            </Mafs>
          );
        })()}

        {preset === "signed-area" && (() => {
          const bClamped = Math.max(0.15, Math.min(2 * Math.PI, signedB));
          const posEnd = Math.min(bClamped, Math.PI);
          const posPts = [[0, 0]];
          const steps = 36;
          for (let i = 0; i <= steps; i++) {
            const x = (posEnd * i) / steps;
            posPts.push([x, Math.sin(x)]);
          }
          posPts.push([posEnd, 0]);

          const negPts = [];
          if (bClamped > Math.PI + 0.01) {
            negPts.push([Math.PI, 0]);
            for (let i = 0; i <= steps; i++) {
              const x = Math.PI + ((bClamped - Math.PI) * i) / steps;
              negPts.push([x, Math.sin(x)]);
            }
            negPts.push([bClamped, 0]);
          }

          return (
            <Mafs height={height} viewBox={{ x: [-0.4, 6.7], y: [-1.45, 1.45] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Polygon points={posPts} color="#009b5e" fillOpacity={0.26} strokeOpacity={0} />
              {negPts.length > 0 && (
                <Polygon points={negPts} color="#db073d" fillOpacity={0.26} strokeOpacity={0} />
              )}
              <Line.Segment
                point1={[bClamped, -1.35]}
                point2={[bClamped, 1.35]}
                style="dashed"
                color="#334155"
                weight={1.8}
              />
              <Plot.OfX
                y={(x) => (x >= 0 && x <= 2 * Math.PI ? Math.sin(x) : NaN)}
                color="#0085dd"
                weight={3}
              />
              <Point x={bClamped} y={Math.sin(bClamped)} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "ftc-accumulation" && (() => {
          const xVal = Math.max(0.25, Math.min(3.7, ftcX));
          const h = 0.22;
          const fn = (t) => 1.5 - 0.25 * (t - 2) * (t - 2);
          const accPts = [[0, 0]];
          const steps = 32;
          for (let i = 0; i <= steps; i++) {
            const t = (xVal * i) / steps;
            accPts.push([t, fn(t)]);
          }
          accPts.push([xVal, 0]);

          const stripPts = [[xVal, 0]];
          for (let i = 0; i <= 8; i++) {
            const t = xVal + (h * i) / 8;
            stripPts.push([t, fn(t)]);
          }
          stripPts.push([xVal + h, 0]);

          return (
            <Mafs height={height} viewBox={{ x: [-0.35, 4.35], y: [-0.3, 2.05] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Polygon points={accPts} color="#0085dd" fillOpacity={0.2} strokeOpacity={0} />
              <Polygon points={stripPts} color="#db073d" fillOpacity={0.34} weight={1.5} />
              <Line.Segment point1={[xVal, 0]} point2={[xVal, fn(xVal)]} color="#db073d" weight={2.8} />
              <Plot.OfX
                y={(t) => (t >= 0 && t <= 4 ? fn(t) : NaN)}
                color="#0085dd"
                weight={3}
              />
              <Point x={xVal} y={fn(xVal)} color="#db073d" />
              <Point x={xVal} y={0} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "u-substitution-map" && (() => {
          const bVal = Math.max(0.5, Math.min(2.0, subB));
          const uTop = bVal * bVal + 1;
          const area = (2 / 3) * (Math.pow(uTop, 1.5) - 1);

          // Left panel (x-plane): x in [0, 2.15] -> px in [38, 222], y in [0, 9.6] -> py in [205, 50]
          const lx = (x) => 38 + (x / 2.15) * 184;
          const ly = (y) => 205 - (y / 9.6) * 155;
          const fx = (x) => 2 * x * Math.sqrt(x * x + 1);

          const leftCurvePts = [];
          for (let i = 0; i <= 40; i++) {
            const x = (2.05 * i) / 40;
            leftCurvePts.push(`${i === 0 ? "M" : "L"} ${lx(x).toFixed(1)} ${ly(fx(x)).toFixed(1)}`);
          }
          const leftAreaPts = [`M ${lx(0).toFixed(1)} ${ly(0).toFixed(1)}`];
          for (let i = 0; i <= 32; i++) {
            const x = (bVal * i) / 32;
            leftAreaPts.push(`L ${lx(x).toFixed(1)} ${ly(fx(x)).toFixed(1)}`);
          }
          leftAreaPts.push(`L ${lx(bVal).toFixed(1)} ${ly(0).toFixed(1)} Z`);

          // Right panel (u-plane): u in [0, 5.4] -> px in [382, 566], y in [0, 2.7] -> py in [205, 50]
          const rx = (u) => 382 + (u / 5.4) * 184;
          const ry = (y) => 205 - (y / 2.7) * 155;
          const hu = (u) => Math.sqrt(u);

          const rightCurvePts = [];
          for (let i = 0; i <= 40; i++) {
            const u = (5.25 * i) / 40;
            rightCurvePts.push(`${i === 0 ? "M" : "L"} ${rx(u).toFixed(1)} ${ry(hu(u)).toFixed(1)}`);
          }
          const rightAreaPts = [`M ${rx(1).toFixed(1)} ${ry(0).toFixed(1)}`];
          for (let i = 0; i <= 32; i++) {
            const u = 1 + ((uTop - 1) * i) / 32;
            rightAreaPts.push(`L ${rx(u).toFixed(1)} ${ry(hu(u)).toFixed(1)}`);
          }
          rightAreaPts.push(`L ${rx(uTop).toFixed(1)} ${ry(0).toFixed(1)} Z`);

          return (
            <div className="flex items-center justify-center bg-white p-2 sm:p-3">
              <svg
                viewBox="0 0 600 265"
                className="w-full max-w-[600px] h-auto"
                role="img"
                aria-label="ដ្យាក្រាមវិធីប្តូរអថេរ u = x² + 1 រក្សាក្រឡាផ្ទៃដូចគ្នា"
              >
                <defs>
                  <marker
                    id="usub-axis-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
                  </marker>
                  <marker
                    id="usub-map-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0085dd" />
                  </marker>
                </defs>

                {/* Left Panel Title */}
                <text x="130" y="24" textAnchor="middle" className="fill-[#9c0329] text-[12px] font-extrabold">
                  ប្លង់ដើម x៖ y = 2x√(x² + 1)
                </text>

                {/* Left Panel Shaded Area & Curve */}
                <path d={leftAreaPts.join(" ")} fill="#db073d" fillOpacity="0.24" />
                <line
                  x1={lx(bVal)}
                  y1={ly(fx(bVal))}
                  x2={lx(bVal)}
                  y2={ly(0)}
                  stroke="#db073d"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                />
                <path d={leftCurvePts.join(" ")} fill="none" stroke="#db073d" strokeWidth="2.6" />

                {/* Left Panel Axes */}
                <line x1="28" y1="205" x2="228" y2="205" stroke="#334155" strokeWidth="1.6" markerEnd="url(#usub-axis-arr)" />
                <line x1="38" y1="216" x2="38" y2="42" stroke="#334155" strokeWidth="1.6" markerEnd="url(#usub-axis-arr)" />
                <text x="233" y="209" className="fill-[#1e293b] text-[12px] font-bold italic">x</text>
                <text x="27" y="45" className="fill-[#1e293b] text-[12px] font-bold italic">y</text>

                {/* Left Panel Ticks */}
                <text x={lx(0)} y="220" textAnchor="middle" className="fill-[#475569] text-[11px] font-bold">0</text>
                <circle cx={lx(bVal)} cy={ly(0)} r="3.5" fill="#db073d" />
                <text x={lx(bVal)} y="220" textAnchor="middle" className="fill-[#db073d] text-[11px] font-extrabold">
                  b = {bVal.toFixed(1)}
                </text>

                {/* Center Transformation Arrow */}
                <rect x="242" y="72" width="120" height="44" rx="10" fill="#eef7ff" stroke="#0085dd" strokeWidth="1.4" />
                <text x="302" y="90" textAnchor="middle" className="fill-[#005c9e] text-[12px] font-extrabold">
                  u = x² + 1
                </text>
                <text x="302" y="107" textAnchor="middle" className="fill-[#0085dd] text-[11px] font-bold">
                  du = 2x dx
                </text>
                <line
                  x1="248"
                  y1="132"
                  x2="352"
                  y2="132"
                  stroke="#0085dd"
                  strokeWidth="2.5"
                  markerEnd="url(#usub-map-arr)"
                />
                <text x="302" y="152" textAnchor="middle" className="fill-[#334155] text-[10.5px] font-bold">
                  ប្តូរគោល៖
                </text>
                <text x="302" y="168" textAnchor="middle" className="fill-[#005c9e] text-[11px] font-extrabold">
                  [0, {bVal.toFixed(1)}] ↦ [1, {uTop.toFixed(2)}]
                </text>

                {/* Right Panel Title */}
                <text x="474" y="24" textAnchor="middle" className="fill-[#006e42] text-[12px] font-extrabold">
                  ប្លង់ថ្មី u៖ y = √u (ងាយគណនា!)
                </text>

                {/* Right Panel Shaded Area & Curve */}
                <path d={rightAreaPts.join(" ")} fill="#009b5e" fillOpacity="0.24" />
                <line
                  x1={rx(1)}
                  y1={ry(hu(1))}
                  x2={rx(1)}
                  y2={ry(0)}
                  stroke="#009b5e"
                  strokeWidth="1.6"
                  strokeDasharray="3 3"
                />
                <line
                  x1={rx(uTop)}
                  y1={ry(hu(uTop))}
                  x2={rx(uTop)}
                  y2={ry(0)}
                  stroke="#009b5e"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                />
                <path d={rightCurvePts.join(" ")} fill="none" stroke="#009b5e" strokeWidth="2.6" />

                {/* Right Panel Axes */}
                <line x1="372" y1="205" x2="572" y2="205" stroke="#334155" strokeWidth="1.6" markerEnd="url(#usub-axis-arr)" />
                <line x1="382" y1="216" x2="382" y2="42" stroke="#334155" strokeWidth="1.6" markerEnd="url(#usub-axis-arr)" />
                <text x="578" y="209" className="fill-[#1e293b] text-[12px] font-bold italic">u</text>
                <text x="371" y="45" className="fill-[#1e293b] text-[12px] font-bold italic">y</text>

                {/* Right Panel Ticks */}
                <circle cx={rx(1)} cy={ry(0)} r="3.2" fill="#009b5e" />
                <text x={rx(1)} y="220" textAnchor="middle" className="fill-[#006e42] text-[11px] font-extrabold">
                  1
                </text>
                <circle cx={rx(uTop)} cy={ry(0)} r="3.5" fill="#009b5e" />
                <text x={rx(uTop)} y="220" textAnchor="middle" className="fill-[#006e42] text-[11px] font-extrabold">
                  {uTop.toFixed(2)}
                </text>

                {/* Bottom Area Equality Pills */}
                <rect x="64" y="234" width="132" height="24" rx="7" fill="#fff0f3" stroke="#db073d" strokeWidth="1.2" />
                <text x="130" y="250" textAnchor="middle" className="fill-[#9c0329] text-[11.5px] font-extrabold">
                  Aₓ = {area.toFixed(3)}
                </text>

                <text x="302" y="251" textAnchor="middle" className="fill-[#0085dd] text-[16px] font-extrabold">
                  = (ផ្ទៃស្មើគ្នា!) =
                </text>

                <rect x="408" y="234" width="132" height="24" rx="7" fill="#e7f7f0" stroke="#009b5e" strokeWidth="1.2" />
                <text x="474" y="250" textAnchor="middle" className="fill-[#006e42] text-[11.5px] font-extrabold">
                  Aᵤ = {area.toFixed(3)}
                </text>
              </svg>
            </div>
          );
        })()}

        {preset === "area-between-x" && (() => {
          const x0 = Math.max(-1.85, Math.min(0.85, areaStripX));
          const yTop = 2 - x0 * x0;
          const yBot = x0;
          const hw = 0.08;
          const regionPts = [];
          const steps = 40;
          for (let i = 0; i <= steps; i++) {
            const x = -2 + (3 * i) / steps;
            regionPts.push([x, 2 - x * x]);
          }
          for (let i = steps; i >= 0; i--) {
            const x = -2 + (3 * i) / steps;
            regionPts.push([x, x]);
          }
          return (
            <Mafs height={height} viewBox={{ x: [-2.8, 2.2], y: [-2.6, 2.8] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Polygon points={regionPts} color="#0085dd" fillOpacity={0.14} strokeOpacity={0} />
              <Polygon
                points={[
                  [x0 - hw, yBot],
                  [x0 + hw, yBot],
                  [x0 + hw, yTop],
                  [x0 - hw, yTop],
                ]}
                color="#db073d"
                fillOpacity={0.38}
                weight={2}
              />
              <Plot.OfX y={(x) => 2 - x * x} color="#0085dd" weight={3} />
              <Plot.OfX y={(x) => x} color="#009b5e" weight={2.6} />
              <Point x={-2} y={-2} color="#160002" />
              <Point x={1} y={1} color="#160002" />
              <Point x={x0} y={yTop} color="#db073d" />
              <Point x={x0} y={yBot} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "area-between-y" && (() => {
          const y0 = Math.max(-0.85, Math.min(1.85, areaStripY));
          const xLeft = y0 * y0 - 1;
          const xRight = y0 + 1;
          const hw = 0.08;
          const regionPts = [];
          const steps = 40;
          for (let i = 0; i <= steps; i++) {
            const y = -1 + (3 * i) / steps;
            regionPts.push([y + 1, y]);
          }
          for (let i = steps; i >= 0; i--) {
            const y = -1 + (3 * i) / steps;
            regionPts.push([y * y - 1, y]);
          }
          return (
            <Mafs height={height} viewBox={{ x: [-1.8, 4.2], y: [-1.8, 2.7] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Polygon points={regionPts} color="#009b5e" fillOpacity={0.14} strokeOpacity={0} />
              <Polygon
                points={[
                  [xLeft, y0 - hw],
                  [xRight, y0 - hw],
                  [xRight, y0 + hw],
                  [xLeft, y0 + hw],
                ]}
                color="#db073d"
                fillOpacity={0.38}
                weight={2}
              />
              <Plot.Parametric xy={(t) => [t * t - 1, t]} t={[-2.1, 2.5]} color="#0085dd" weight={3} />
              <Plot.Parametric xy={(t) => [t + 1, t]} t={[-2.1, 2.6]} color="#009b5e" weight={2.6} />
              <Point x={0} y={-1} color="#160002" />
              <Point x={3} y={2} color="#160002" />
              <Point x={xLeft} y={y0} color="#db073d" />
              <Point x={xRight} y={y0} color="#db073d" />
            </Mafs>
          );
        })()}

        {preset === "volume-disk-washer" && (() => {
          const x0 = Math.max(0.12, Math.min(0.92, washerX));
          const R = Math.sqrt(x0);
          const r = washerMode === "washer" ? x0 * x0 : 0;
          const axisY = 148;
          const px = (x) => 66 + x * 250;
          const py = (y) => axisY - y * 88;

          // Build outer silhouette y = ±sqrt(x) on [0, 1]
          const outerTop = [];
          const outerBot = [];
          for (let i = 0; i <= 36; i++) {
            const x = i / 36;
            outerTop.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(Math.sqrt(x)).toFixed(1)}`);
            outerBot.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(-Math.sqrt(x)).toFixed(1)}`);
          }
          const outerFillPts = [
            ...Array.from({ length: 37 }, (_, i) => {
              const x = i / 36;
              return `${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(Math.sqrt(x)).toFixed(1)}`;
            }),
            ...Array.from({ length: 37 }, (_, i) => {
              const x = (36 - i) / 36;
              return `L ${px(x).toFixed(1)} ${py(-Math.sqrt(x)).toFixed(1)}`;
            }),
            "Z",
          ].join(" ");

          // Inner hollow silhouette y = ±x^2
          const innerTop = [];
          const innerBot = [];
          const innerFillPts = [];
          if (washerMode === "washer") {
            for (let i = 0; i <= 32; i++) {
              const x = i / 32;
              innerTop.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(x * x).toFixed(1)}`);
              innerBot.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(-x * x).toFixed(1)}`);
              innerFillPts.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(x * x).toFixed(1)}`);
            }
            for (let i = 32; i >= 0; i--) {
              const x = i / 32;
              innerFillPts.push(`L ${px(x).toFixed(1)} ${py(-x * x).toFixed(1)}`);
            }
            innerFillPts.push("Z");
          }

          const sliceCx = px(x0);
          const sliceRyOut = 88 * R;
          const sliceRxOut = Math.max(8, 18 * R);
          const sliceRyIn = 88 * r;
          const sliceRxIn = Math.max(3, 18 * r);

          const csCx = 486;
          const csCy = 148;
          const csROut = 74 * R;
          const csRIn = 74 * r;

          return (
            <div className="flex items-center justify-center bg-white p-2 sm:p-3">
              <svg
                viewBox="0 0 600 280"
                className="w-full max-w-[600px] h-auto"
                role="img"
                aria-label="ដ្យាក្រាម 3D មាឌសូលីតបរិវត្តដោយវិធីបន្ទះថាស និងវិធីចិញ្ចៀន"
              >
                <defs>
                  <marker
                    id="vw-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
                  </marker>
                </defs>

                {/* Panel Headers */}
                <text x="195" y="24" textAnchor="middle" className="fill-[#160002] text-[12px] font-extrabold">
                  សូលីតបរិវត្តជុំវិញអ័ក្ស Ox ({washerMode === "washer" ? "វិធីចិញ្ចៀន Washer" : "វិធីថាស Disk"})
                </text>
                <text x="486" y="24" textAnchor="middle" className="fill-[#9c0329] text-[12px] font-extrabold">
                  មុខកាត់ត្រង់ x₀ = {x0.toFixed(2)}
                </text>

                {/* Subtle divider */}
                <line x1="378" y1="36" x2="378" y2="262" stroke="#f1d4d8" strokeWidth="1.2" strokeDasharray="4 4" />

                {/* 3D Solid Silhouette Fill */}
                <path d={outerFillPts} fill="#0085dd" fillOpacity="0.11" />
                {washerMode === "washer" && (
                  <path d={innerFillPts.join(" ")} fill="#ffffff" fillOpacity="0.72" />
                )}

                {/* Back rim at x = 1 */}
                <ellipse
                  cx={px(1)}
                  cy={axisY}
                  rx="18"
                  ry="88"
                  fill="none"
                  stroke="#0085dd"
                  strokeWidth="1.3"
                  strokeDasharray="4 3"
                  opacity="0.65"
                />

                {/* Revolution Axis Ox */}
                <line x1="36" y1={axisY} x2="356" y2={axisY} stroke="#334155" strokeWidth="1.6" markerEnd="url(#vw-arr)" />
                <line x1="66" y1="252" x2="66" y2="38" stroke="#334155" strokeWidth="1.4" markerEnd="url(#vw-arr)" />
                <text x="362" y={axisY + 4} className="fill-[#1e293b] text-[12px] font-bold italic">x</text>
                <text x="55" y="42" className="fill-[#1e293b] text-[12px] font-bold italic">y</text>

                {/* Upper & Reflected Curves */}
                <path d={outerTop.join(" ")} fill="none" stroke="#0085dd" strokeWidth="2.6" />
                <path d={outerBot.join(" ")} fill="none" stroke="#0085dd" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.6" />
                {washerMode === "washer" && (
                  <>
                    <path d={innerTop.join(" ")} fill="none" stroke="#009b5e" strokeWidth="2.4" />
                    <path d={innerBot.join(" ")} fill="none" stroke="#009b5e" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.55" />
                  </>
                )}

                {/* Movable 3D Washer / Disk Slice at x0 */}
                <ellipse
                  cx={sliceCx}
                  cy={axisY}
                  rx={sliceRxOut}
                  ry={sliceRyOut}
                  fill="#db073d"
                  fillOpacity="0.28"
                  stroke="#db073d"
                  strokeWidth="2.2"
                />
                {washerMode === "washer" && r > 0.02 && (
                  <ellipse
                    cx={sliceCx}
                    cy={axisY}
                    rx={sliceRxIn}
                    ry={sliceRyIn}
                    fill="#ffffff"
                    fillOpacity="0.94"
                    stroke="#009b5e"
                    strokeWidth="1.8"
                  />
                )}
                {/* Radius indicator inside 3D slice */}
                <line
                  x1={sliceCx}
                  y1={axisY}
                  x2={sliceCx}
                  y2={axisY - sliceRyOut}
                  stroke="#db073d"
                  strokeWidth="2"
                />
                <circle cx={sliceCx} cy={axisY} r="3.2" fill="#160002" />
                <circle cx={sliceCx} cy={axisY - sliceRyOut} r="3.5" fill="#0085dd" />
                {washerMode === "washer" && (
                  <circle cx={sliceCx} cy={axisY - sliceRyIn} r="3.2" fill="#009b5e" />
                )}

                {/* x0 & x=1 ticks */}
                <text x={sliceCx} y={axisY + sliceRyOut + 16} textAnchor="middle" className="fill-[#db073d] text-[11px] font-extrabold">
                  x₀ = {x0.toFixed(2)}
                </text>
                <text x={px(1) + 8} y={axisY + 15} className="fill-[#475569] text-[11px] font-bold">
                  1
                </text>

                {/* Right Panel: Front-Facing Cross-Section Circle / Washer */}
                <circle
                  cx={csCx}
                  cy={csCy}
                  r={csROut}
                  fill="#db073d"
                  fillOpacity="0.24"
                  stroke="#0085dd"
                  strokeWidth="2.4"
                />
                {washerMode === "washer" && r > 0.02 && (
                  <circle
                    cx={csCx}
                    cy={csCy}
                    r={csRIn}
                    fill="#ffffff"
                    stroke="#009b5e"
                    strokeWidth="2.2"
                  />
                )}
                {/* Outer radius line */}
                <line
                  x1={csCx}
                  y1={csCy}
                  x2={csCx + csROut * 0.85}
                  y2={csCy - csROut * 0.52}
                  stroke="#0085dd"
                  strokeWidth="2"
                />
                <text
                  x={csCx + csROut * 0.45 + 6}
                  y={csCy - csROut * 0.28 - 6}
                  className="fill-[#005c9e] text-[11px] font-extrabold"
                >
                  R = {R.toFixed(2)}
                </text>
                {/* Inner radius line */}
                {washerMode === "washer" && r > 0.14 && (
                  <>
                    <line
                      x1={csCx}
                      y1={csCy}
                      x2={csCx - csRIn}
                      y2={csCy}
                      stroke="#009b5e"
                      strokeWidth="2"
                    />
                    <text
                      x={csCx - csRIn * 0.5}
                      y={csCy + 14}
                      textAnchor="middle"
                      className="fill-[#006e42] text-[10.5px] font-extrabold"
                    >
                      r = {r.toFixed(2)}
                    </text>
                  </>
                )}
                <circle cx={csCx} cy={csCy} r="3" fill="#160002" />

                {/* Cross-Section Area Pill */}
                <rect x="404" y="238" width="166" height="26" rx="8" fill="#fff0f3" stroke="#db073d" strokeWidth="1.2" />
                <text x="487" y="255" textAnchor="middle" className="fill-[#9c0329] text-[11.5px] font-extrabold">
                  {washerMode === "washer"
                    ? `A = π(R² − r²) = ${(Math.PI * (R * R - r * r)).toFixed(2)}`
                    : `A = πR² = ${(Math.PI * R * R).toFixed(2)}`}
                </text>
              </svg>
            </div>
          );
        })()}

        {preset === "volume-shell-method" && (() => {
          const x0 = Math.max(0.25, Math.min(1.85, shellX));
          const f = (x) => 2 * x * x - x * x * x;
          const hVal = f(x0);
          const axisX = 165;
          const baseY = 222;
          const scaleX = 62;
          const scaleY = 112;

          // Right & Left mirrored profile curves y = 2x^2 - x^3 on [0, 2]
          const rightProfile = [];
          const leftProfile = [];
          for (let i = 0; i <= 36; i++) {
            const x = (2 * i) / 36;
            const py = baseY - f(x) * scaleY;
            rightProfile.push(`${i === 0 ? "M" : "L"} ${(axisX + x * scaleX).toFixed(1)} ${py.toFixed(1)}`);
            leftProfile.push(`${i === 0 ? "M" : "L"} ${(axisX - x * scaleX).toFixed(1)} ${py.toFixed(1)}`);
          }

          const radPx = x0 * scaleX;
          const hPx = hVal * scaleY;
          const topY = baseY - hPx;
          const ellRy = Math.max(5, radPx * 0.22);

          // Unrolled slab dimensions on right panel
          const slabW = 48 + (x0 / 1.85) * 144;
          const slabH = Math.max(16, hPx);
          const slabX = 468 - slabW / 2;
          const slabY = 210 - slabH;

          return (
            <div className="flex items-center justify-center bg-white p-2 sm:p-3">
              <svg
                viewBox="0 0 600 280"
                className="w-full max-w-[600px] h-auto"
                role="img"
                aria-label="ដ្យាក្រាម 3D វិធីសំបកស៊ីឡាំង (Cylindrical Shells) និងការលាជាបន្ទះចតុកោណកែង"
              >
                <defs>
                  <marker
                    id="sh-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
                  </marker>
                  <marker
                    id="sh-green-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#009b5e" />
                  </marker>
                </defs>

                {/* Panel Headers */}
                <text x="165" y="24" textAnchor="middle" className="fill-[#160002] text-[12px] font-extrabold">
                  សំបកស៊ីឡាំងជុំវិញអ័ក្ស Oy (y = 2x² − x³)
                </text>
                <text x="468" y="24" textAnchor="middle" className="fill-[#006e42] text-[12px] font-extrabold">
                  លាសំបកជាបន្ទះ (ប្រវែង 2πr, កម្ពស់ h)
                </text>

                {/* Axes on Left Panel */}
                <line x1="28" y1={baseY} x2="306" y2={baseY} stroke="#334155" strokeWidth="1.5" markerEnd="url(#sh-arr)" />
                <line x1={axisX} y1="252" x2={axisX} y2="38" stroke="#334155" strokeWidth="1.6" markerEnd="url(#sh-arr)" />
                <text x="311" y={baseY + 4} className="fill-[#1e293b] text-[12px] font-bold italic">x</text>
                <text x={axisX - 13} y="42" className="fill-[#1e293b] text-[12px] font-bold italic">y</text>

                {/* Solid Profile Curves */}
                <path d={rightProfile.join(" ")} fill="none" stroke="#0085dd" strokeWidth="2.5" />
                <path d={leftProfile.join(" ")} fill="none" stroke="#0085dd" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.55" />

                {/* 3D Cylindrical Shell Body */}
                <rect
                  x={axisX - radPx}
                  y={topY}
                  width={radPx * 2}
                  height={hPx}
                  fill="#db073d"
                  fillOpacity="0.18"
                />
                <line x1={axisX - radPx} y1={topY} x2={axisX - radPx} y2={baseY} stroke="#db073d" strokeWidth="2.2" />
                <line x1={axisX + radPx} y1={topY} x2={axisX + radPx} y2={baseY} stroke="#db073d" strokeWidth="2.2" />
                {/* Bottom & Top Ellipses */}
                <ellipse
                  cx={axisX}
                  cy={baseY}
                  rx={radPx}
                  ry={ellRy}
                  fill="none"
                  stroke="#db073d"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                />
                <ellipse
                  cx={axisX}
                  cy={topY}
                  rx={radPx}
                  ry={ellRy}
                  fill="#db073d"
                  fillOpacity="0.12"
                  stroke="#db073d"
                  strokeWidth="2"
                />

                {/* Radius & Height Callouts on Cylinder */}
                <line x1={axisX} y1={topY} x2={axisX + radPx} y2={topY} stroke="#160002" strokeWidth="1.8" />
                <circle cx={axisX + radPx} cy={topY} r="3.4" fill="#db073d" />
                <text
                  x={axisX + radPx * 0.5}
                  y={topY - 7}
                  textAnchor="middle"
                  className="fill-[#160002] text-[10.5px] font-extrabold"
                >
                  r = {x0.toFixed(2)}
                </text>
                <text
                  x={axisX + radPx + 8}
                  y={topY + hPx * 0.5 + 4}
                  className="fill-[#db073d] text-[10.5px] font-extrabold"
                >
                  h
                </text>

                {/* Unroll Arrow in Middle */}
                <line x1="312" y1="145" x2="352" y2="145" stroke="#009b5e" strokeWidth="2.4" markerEnd="url(#sh-green-arr)" />
                <text x="332" y="136" textAnchor="middle" className="fill-[#006e42] text-[10.5px] font-extrabold">
                  លា →
                </text>

                {/* Right Panel: Unrolled Rectangular Slab (2πr × h × dx) */}
                <polygon
                  points={`${slabX},${slabY} ${slabX + 8},${slabY - 6} ${slabX + slabW + 8},${slabY - 6} ${slabX + slabW},${slabY}`}
                  fill="#009b5e"
                  fillOpacity="0.18"
                  stroke="#009b5e"
                  strokeWidth="1.3"
                />
                <polygon
                  points={`${slabX + slabW},${slabY} ${slabX + slabW + 8},${slabY - 6} ${slabX + slabW + 8},${slabY + slabH - 6} ${slabX + slabW},${slabY + slabH}`}
                  fill="#009b5e"
                  fillOpacity="0.34"
                  stroke="#009b5e"
                  strokeWidth="1.3"
                />
                <rect
                  x={slabX}
                  y={slabY}
                  width={slabW}
                  height={slabH}
                  fill="#009b5e"
                  fillOpacity="0.24"
                  stroke="#009b5e"
                  strokeWidth="2"
                />
                <text
                  x={slabX + slabW / 2}
                  y={slabY + slabH / 2 + 4}
                  textAnchor="middle"
                  className="fill-[#005936] text-[11px] font-extrabold"
                >
                  h = {hVal.toFixed(2)}
                </text>
                <text
                  x={slabX + slabW + 14}
                  y={slabY - 3}
                  className="fill-[#006e42] text-[10px] font-extrabold"
                >
                  dx
                </text>
                {/* Width label 2πr */}
                <text
                  x={468}
                  y={228}
                  textAnchor="middle"
                  className="fill-[#006e42] text-[11.5px] font-extrabold"
                >
                  ប្រវែងជុំវិញ = 2πr ≈ {(2 * Math.PI * x0).toFixed(2)}
                </text>

                {/* Bottom Formula Pill */}
                <rect x="366" y="242" width="206" height="26" rx="8" fill="#e7f7f0" stroke="#009b5e" strokeWidth="1.2" />
                <text x="469" y="259" textAnchor="middle" className="fill-[#005936] text-[11px] font-extrabold">
                  dV = 2π·x₀·f(x₀)·dx ≈ {(2 * Math.PI * x0 * hVal).toFixed(2)}·dx
                </text>
              </svg>
            </div>
          );
        })()}

        {preset === "arc-length-polygonal" && (() => {
          const nSeg = Math.max(1, Math.min(12, arcN));
          const fn = (x) => (2 / 3) * Math.pow(x, 1.5);
          const dx = 3 / nSeg;
          const pts = [];
          for (let k = 0; k <= nSeg; k++) {
            const x = k * dx;
            pts.push([x, fn(x)]);
          }
          const hiIdx = Math.min(nSeg - 1, Math.floor(nSeg / 2));
          const pA = pts[hiIdx];
          const pB = pts[hiIdx + 1];
          return (
            <Mafs height={height} viewBox={{ x: [-0.35, 3.4], y: [-0.35, 3.95] }} zoom={false} pan={false}>
              <Coordinates.Cartesian subdivisions={1} />
              <Plot.OfX y={(x) => (x >= 0 && x <= 3 ? fn(x) : NaN)} color="#0085dd" weight={3} />
              {/* Highlight right triangle (Δx, Δy) for one segment */}
              <Line.Segment point1={pA} point2={[pB[0], pA[1]]} style="dashed" color="#009b5e" weight={2.2} />
              <Line.Segment point1={[pB[0], pA[1]]} point2={pB} style="dashed" color="#009b5e" weight={2.2} />
              {/* Polygonal chain segments */}
              {pts.slice(0, -1).map((p, k) => (
                <Line.Segment
                  key={k}
                  point1={p}
                  point2={pts[k + 1]}
                  color="#db073d"
                  weight={2.4}
                />
              ))}
              {pts.map((p, k) => (
                <Point key={k} x={p[0]} y={p[1]} color="#db073d" />
              ))}
            </Mafs>
          );
        })()}

        {preset === "surface-area-frustum" && (() => {
          const x0 = Math.max(0.25, Math.min(2.45, frustumX));
          const dx = 0.38;
          const x1 = x0 + dx;
          const fn = (x) => 2 * Math.sqrt(x);
          const r0 = fn(x0);
          const r1 = fn(x1);
          const rMid = (r0 + r1) / 2;
          const ds = Math.sqrt(dx * dx + (r1 - r0) * (r1 - r0));

          const axisY = 142;
          const px = (x) => 56 + (x / 3.1) * 290;
          const py = (y) => axisY - (y / 3.6) * 96;

          const topCurve = [];
          const botCurve = [];
          const fillPts = [];
          for (let i = 0; i <= 36; i++) {
            const x = (3 * i) / 36;
            topCurve.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(fn(x)).toFixed(1)}`);
            botCurve.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(-fn(x)).toFixed(1)}`);
            fillPts.push(`${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(fn(x)).toFixed(1)}`);
          }
          for (let i = 36; i >= 0; i--) {
            const x = (3 * i) / 36;
            fillPts.push(`L ${px(x).toFixed(1)} ${py(-fn(x)).toFixed(1)}`);
          }
          fillPts.push("Z");

          const p0x = px(x0);
          const p1x = px(x1);
          const ry0 = (r0 / 3.6) * 96;
          const ry1 = (r1 / 3.6) * 96;
          const rx0 = Math.max(6, ry0 * 0.22);
          const rx1 = Math.max(7, ry1 * 0.22);

          return (
            <div className="flex items-center justify-center bg-white p-2 sm:p-3">
              <svg
                viewBox="0 0 600 270"
                className="w-full max-w-[600px] h-auto"
                role="img"
                aria-label="ដ្យាក្រាម 3D ក្រឡាផ្ទៃបរិវត្តដោយកំណាត់កោណស្តើង (Frustum Band)"
              >
                <defs>
                  <marker
                    id="sf-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
                  </marker>
                </defs>

                {/* Headers */}
                <text x="195" y="22" textAnchor="middle" className="fill-[#160002] text-[12px] font-extrabold">
                  ផ្ទៃបរិវត្ត y = 2√x លើ [0, 3] ជុំវិញអ័ក្ស Ox
                </text>
                <text x="488" y="22" textAnchor="middle" className="fill-[#9c0329] text-[12px] font-extrabold">
                  ពង្រីកកំណាត់កោណ (Frustum)
                </text>
                <line x1="382" y1="34" x2="382" y2="256" stroke="#f1d4d8" strokeWidth="1.2" strokeDasharray="4 4" />

                {/* Paraboloid Surface Fill */}
                <path d={fillPts.join(" ")} fill="#0085dd" fillOpacity="0.10" />
                <ellipse
                  cx={px(3)}
                  cy={axisY}
                  rx="20"
                  ry={(fn(3) / 3.6) * 96}
                  fill="none"
                  stroke="#0085dd"
                  strokeWidth="1.3"
                  strokeDasharray="4 3"
                  opacity="0.65"
                />

                {/* Axes */}
                <line x1="32" y1={axisY} x2="364" y2={axisY} stroke="#334155" strokeWidth="1.5" markerEnd="url(#sf-arr)" />
                <line x1="56" y1="246" x2="56" y2="36" stroke="#334155" strokeWidth="1.4" markerEnd="url(#sf-arr)" />
                <text x="370" y={axisY + 4} className="fill-[#1e293b] text-[12px] font-bold italic">x</text>
                <text x="45" y="40" className="fill-[#1e293b] text-[12px] font-bold italic">y</text>

                {/* Outer curves */}
                <path d={topCurve.join(" ")} fill="none" stroke="#0085dd" strokeWidth="2.5" />
                <path d={botCurve.join(" ")} fill="none" stroke="#0085dd" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.6" />

                {/* 3D Slanted Frustum Band between x0 and x1 */}
                <polygon
                  points={`${p0x},${axisY - ry0} ${p1x},${axisY - ry1} ${p1x},${axisY + ry1} ${p0x},${axisY + ry0}`}
                  fill="#db073d"
                  fillOpacity="0.28"
                />
                <line x1={p0x} y1={axisY - ry0} x2={p1x} y2={axisY - ry1} stroke="#db073d" strokeWidth="2.8" />
                <line x1={p0x} y1={axisY + ry0} x2={p1x} y2={axisY + ry1} stroke="#db073d" strokeWidth="2.4" />
                <ellipse cx={p0x} cy={axisY} rx={rx0} ry={ry0} fill="#db073d" fillOpacity="0.14" stroke="#db073d" strokeWidth="1.8" />
                <ellipse cx={p1x} cy={axisY} rx={rx1} ry={ry1} fill="none" stroke="#db073d" strokeWidth="2" />
                <text x={(p0x + p1x) / 2} y={axisY - ry1 - 10} textAnchor="middle" className="fill-[#db073d] text-[11px] font-extrabold">
                  ds
                </text>
                <text x={p0x} y={axisY + ry0 + 16} textAnchor="middle" className="fill-[#db073d] text-[10.5px] font-extrabold">
                  x₀ = {x0.toFixed(2)}
                </text>

                {/* Right Panel: Zoomed Slanted Frustum Diagram */}
                <polygon
                  points="446,96 530,72 530,192 446,168"
                  fill="#db073d"
                  fillOpacity="0.20"
                  stroke="#db073d"
                  strokeWidth="2.2"
                />
                <ellipse cx="446" cy="132" rx="14" ry="36" fill="#fff0f3" stroke="#db073d" strokeWidth="1.8" />
                <ellipse cx="530" cy="132" rx="18" ry="60" fill="none" stroke="#db073d" strokeWidth="2" />
                {/* Slanted ds highlight */}
                <line x1="446" y1="96" x2="530" y2="72" stroke="#009b5e" strokeWidth="3.2" />
                <text x="486" y="74" textAnchor="middle" className="fill-[#006e42] text-[11.5px] font-extrabold">
                  ជ្រុងទ្រេត ds ≈ {ds.toFixed(2)}
                </text>
                {/* Radius r */}
                <line x1="530" y1="132" x2="530" y2="72" stroke="#0085dd" strokeWidth="2" />
                <circle cx="530" cy="132" r="3" fill="#160002" />
                <text x="556" y="106" textAnchor="middle" className="fill-[#005c9e] text-[11px] font-extrabold">
                  r ≈ {rMid.toFixed(2)}
                </text>
                <text x="488" y="214" textAnchor="middle" className="fill-[#475569] text-[10.5px] font-bold">
                  (ប្រើជ្រុងទ្រេត ds មិនមែន dx ទេ!)
                </text>

                {/* Formula Pill */}
                <rect x="398" y="228" width="182" height="28" rx="8" fill="#fff0f3" stroke="#db073d" strokeWidth="1.2" />
                <text x="489" y="246" textAnchor="middle" className="fill-[#9c0329] text-[11.5px] font-extrabold">
                  dS = 2πr · ds = 2πy√(1+(y')²)dx
                </text>
              </svg>
            </div>
          );
        })()}

        {preset === "ibp-area-rectangle" && (() => {
          const a = 0.5;
          const b = Math.max(1.0, Math.min(2.0, ibpB));
          const vf = (u) => 0.5 * u * u + 0.45;
          const va = vf(a);
          const vb = vf(b);

          const intVdu = (b * b * b - a * a * a) / 6 + 0.45 * (b - a);
          const intUdv = (b * b * b - a * a * a) / 3;
          const rectDiff = b * vb - a * va;

          // Coordinate mapping inside left diagram x in [62, 340], y in [224, 38]
          const originX = 66;
          const originY = 224;
          const px = (u) => originX + (u / 2.2) * 264;
          const py = (v) => originY - (v / 2.7) * 182;

          // Curve points from u = a to u = b
          const curveSeg = [];
          const redPts = [`M ${px(a).toFixed(1)} ${originY}`];
          const bluePts = [`M ${originX} ${py(va).toFixed(1)}`];
          for (let i = 0; i <= 30; i++) {
            const u = a + ((b - a) * i) / 30;
            const v = vf(u);
            curveSeg.push(`${i === 0 ? "M" : "L"} ${px(u).toFixed(1)} ${py(v).toFixed(1)}`);
            redPts.push(`L ${px(u).toFixed(1)} ${py(v).toFixed(1)}`);
            bluePts.push(`L ${px(u).toFixed(1)} ${py(v).toFixed(1)}`);
          }
          redPts.push(`L ${px(b).toFixed(1)} ${originY} Z`);
          bluePts.push(`L ${originX} ${py(vb).toFixed(1)} Z`);

          return (
            <div className="flex items-center justify-center bg-white p-2 sm:p-3">
              <svg
                viewBox="0 0 600 268"
                className="w-full max-w-[600px] h-auto"
                role="img"
                aria-label="សម្រាយបញ្ជាក់ធរណីមាត្រនៃរូបមន្តអាំងតេក្រាលដោយផ្នែក ∫u dv + ∫v du = [uv]"
              >
                <defs>
                  <marker
                    id="ibp-arr"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
                  </marker>
                </defs>

                {/* Subtle divider */}
                <line x1="364" y1="24" x2="364" y2="250" stroke="#f1d4d8" strokeWidth="1.2" strokeDasharray="4 4" />

                {/* Inner Corner Rectangle u(a)v(a) */}
                <rect
                  x={originX}
                  y={py(va)}
                  width={px(a) - originX}
                  height={originY - py(va)}
                  fill="#94a3b8"
                  fillOpacity="0.16"
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <text
                  x={(originX + px(a)) / 2}
                  y={(originY + py(va)) / 2 + 4}
                  textAnchor="middle"
                  className="fill-[#64748b] text-[10px] font-bold"
                >
                  u(a)v(a)
                </text>

                {/* Blue Region: ∫ u dv */}
                <path d={bluePts.join(" ")} fill="#0085dd" fillOpacity="0.24" stroke="#0085dd" strokeWidth="1.4" />
                {/* Red Region: ∫ v du */}
                <path d={redPts.join(" ")} fill="#db073d" fillOpacity="0.22" stroke="#db073d" strokeWidth="1.4" />

                {/* Outer Rectangle Border [0, u(b)] x [0, v(b)] */}
                <rect
                  x={originX}
                  y={py(vb)}
                  width={px(b) - originX}
                  height={originY - py(vb)}
                  fill="none"
                  stroke="#009b5e"
                  strokeWidth="1.6"
                  strokeDasharray="5 3"
                />

                {/* Smooth Curve */}
                <path d={curveSeg.join(" ")} fill="none" stroke="#160002" strokeWidth="2.8" />
                <circle cx={px(a)} cy={py(va)} r="4" fill="#160002" />
                <circle cx={px(b)} cy={py(vb)} r="4.5" fill="#009b5e" />

                {/* Axes */}
                <line x1="48" y1={originY} x2="348" y2={originY} stroke="#334155" strokeWidth="1.6" markerEnd="url(#ibp-arr)" />
                <line x1={originX} y1="240" x2={originX} y2="24" stroke="#334155" strokeWidth="1.6" markerEnd="url(#ibp-arr)" />
                <text x="353" y={originY + 4} className="fill-[#1e293b] text-[12px] font-extrabold italic">u</text>
                <text x={originX - 13} y="28" className="fill-[#1e293b] text-[12px] font-extrabold italic">v</text>

                {/* Region labels inside blue & red areas */}
                <text
                  x={originX + (px(b) - originX) * 0.34}
                  y={py(vb) + (py(va) - py(vb)) * 0.42}
                  textAnchor="middle"
                  className="fill-[#005c9e] text-[12px] font-extrabold"
                >
                  ∫ u dv
                </text>
                <text
                  x={px(a) + (px(b) - px(a)) * 0.56}
                  y={originY - (originY - py(va)) * 0.55}
                  textAnchor="middle"
                  className="fill-[#9c0329] text-[12px] font-extrabold"
                >
                  ∫ v du
                </text>

                {/* Axis Ticks */}
                <text x={px(a)} y={originY + 16} textAnchor="middle" className="fill-[#475569] text-[10.5px] font-bold">u(a)</text>
                <text x={px(b)} y={originY + 16} textAnchor="middle" className="fill-[#006e42] text-[11px] font-extrabold">u(b)</text>
                <text x={originX - 7} y={py(va) + 4} textAnchor="end" className="fill-[#475569] text-[10.5px] font-bold">v(a)</text>
                <text x={originX - 7} y={py(vb) + 4} textAnchor="end" className="fill-[#006e42] text-[11px] font-extrabold">v(b)</text>

                {/* Right Panel: Live Geometric Proof Ledger */}
                <text x="482" y="38" textAnchor="middle" className="fill-[#160002] text-[12.5px] font-extrabold">
                  សម្រាយបញ្ជាក់ធរណីមាត្រ
                </text>

                <rect x="384" y="54" width="196" height="40" rx="10" fill="#e8f4fd" stroke="#0085dd" strokeWidth="1.2" />
                <text x="482" y="71" textAnchor="middle" className="fill-[#005c9e] text-[11px] font-bold">
                  ផ្ទៃខៀវ (∫ u dv)
                </text>
                <text x="482" y="87" textAnchor="middle" className="fill-[#005c9e] text-[12.5px] font-extrabold">
                  = {intUdv.toFixed(3)}
                </text>

                <text x="482" y="109" textAnchor="middle" className="fill-[#64748b] text-[14px] font-extrabold">+</text>

                <rect x="384" y="117" width="196" height="40" rx="10" fill="#fff0f3" stroke="#db073d" strokeWidth="1.2" />
                <text x="482" y="134" textAnchor="middle" className="fill-[#9c0329] text-[11px] font-bold">
                  ផ្ទៃក្រហម (∫ v du)
                </text>
                <text x="482" y="150" textAnchor="middle" className="fill-[#9c0329] text-[12.5px] font-extrabold">
                  = {intVdu.toFixed(3)}
                </text>

                <text x="482" y="172" textAnchor="middle" className="fill-[#009b5e] text-[14px] font-extrabold">=</text>

                <rect x="384" y="180" width="196" height="58" rx="10" fill="#e7f7f0" stroke="#009b5e" strokeWidth="1.4" />
                <text x="482" y="199" textAnchor="middle" className="fill-[#005936] text-[11px] font-bold">
                  ផលដកចតុកោណ [u·v]ₐᵇ
                </text>
                <text x="482" y="216" textAnchor="middle" className="fill-[#005936] text-[12.5px] font-extrabold">
                  {rectDiff.toFixed(3)} = {(intUdv + intVdu).toFixed(3)}
                </text>
                <text x="482" y="232" textAnchor="middle" className="fill-[#006e42] text-[10px] font-bold">
                  ⇒ ∫ u dv = [u·v]ₐᵇ − ∫ v du
                </text>
              </svg>
            </div>
          );
        })()}
      </div>

      {/* Interactive controls for Antiderivative Family */}
      {preset === "antiderivative-family" && (
        <div className="space-y-1.5 px-1 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
            <span className="text-[#0085dd]">
              រំកិលចំនួនថេរ C៖ ក្រាបរំកិលឡើង/ចុះ តែមេគុណប្រាប់ទិស F'(1.5) = 1.25 នៅដដែល!
            </span>
            <span className="font-mono text-[#160002]">
              C = {antiC.toFixed(1)} | F(0) = {antiC.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.1}
            value={antiC}
            onChange={(e) => setAntiC(parseFloat(e.target.value))}
            className="w-full accent-[#0085dd] cursor-pointer"
          />
        </div>
      )}

      {/* Interactive controls for General Riemann Partition Diagram */}
      {preset === "riemann-partition" && (() => {
        const modeDesc =
          partSampleFrac <= 0.02
            ? "ផលបូកឆ្វេង (Lₙ)៖ ជ្រើស xₖ* = xₖ₋₁ (ចុងឆ្វេង)"
            : partSampleFrac >= 0.98
            ? "ផលបូកស្តាំ (Rₙ)៖ ជ្រើស xₖ* = xₖ (ចុងស្តាំ)"
            : Math.abs(partSampleFrac - 0.5) <= 0.03
            ? "ផលបូកចំណុចកណ្តាល (Mₙ)៖ ជ្រើស xₖ* = (xₖ₋₁ + xₖ) / 2"
            : "ចំណុចគំរូទូទៅ៖ ជ្រើស xₖ* តាមចិត្តក្នុងចន្លោះរង [xₖ₋₁, xₖ]";

        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">{modeDesc}</span>
              <span className="font-mono text-[#160002]">
                Sₙ = ∑ f(xₖ*) · Δx
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={partSampleFrac}
              onChange={(e) => setPartSampleFrac(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
              {[
                { val: 0.35, label: "ទូទៅ (xₖ*)" },
                { val: 0, label: "ឆ្វេង (xₖ₋₁)" },
                { val: 0.5, label: "កណ្តាល (x̄ₖ)" },
                { val: 1, label: "ស្តាំ (xₖ)" },
              ].map((btn) => {
                const isActive =
                  btn.val === 0.35
                    ? partSampleFrac > 0.02 &&
                      partSampleFrac < 0.98 &&
                      Math.abs(partSampleFrac - 0.5) > 0.03
                    : Math.abs(partSampleFrac - btn.val) <= 0.03;
                return (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => setPartSampleFrac(btn.val)}
                    className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                      isActive
                        ? "border-[#db073d] bg-[#db073d] text-white"
                        : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Interactive controls for Riemann Sum */}
      {preset === "riemann-sum" && (() => {
        const dx = 2 / riemannN;
        let sum = 0;
        for (let k = 0; k < riemannN; k++) {
          const xL = k * dx;
          const sx =
            riemannMode === "left"
              ? xL
              : riemannMode === "mid"
              ? xL + dx / 2
              : xL + dx;
          sum += sx * sx * dx;
        }
        const label = riemannMode === "left" ? "Lₙ" : riemannMode === "mid" ? "Mₙ" : "Rₙ";
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#009b5e]">
                n = {riemannN} ចតុកោណកែង (Δx = {dx.toFixed(3)})
              </span>
              <span className="font-mono text-[#160002]">
                {label} = {sum.toFixed(4)} | ផ្ទៃពិត 8/3 ≈ 2.6667
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={24}
              step={1}
              value={riemannN}
              onChange={(e) => setRiemannN(parseInt(e.target.value, 10))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {[
                { id: "left", text: "ផលបូកឆ្វេង (Lₙ)" },
                { id: "mid", text: "ចំណុចកណ្តាល (Mₙ)" },
                { id: "right", text: "ផលបូកស្តាំ (Rₙ)" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setRiemannMode(m.id)}
                  className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                    riemannMode === m.id
                      ? "border-[#009b5e] bg-[#009b5e] text-white"
                      : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                  }`}
                >
                  {m.text}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Interactive controls for Signed Area (Definite Integral) */}
      {preset === "signed-area" && (() => {
        const bClamped = Math.max(0.15, Math.min(2 * Math.PI, signedB));
        const aPos = 1 - Math.cos(Math.min(bClamped, Math.PI));
        const aNeg = bClamped > Math.PI ? 1 + Math.cos(bClamped) : 0;
        const net = aPos - aNeg;
        const total = aPos + aNeg;
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#0085dd]">
                b = {bClamped.toFixed(2)} | A₊ = {aPos.toFixed(2)} | A₋ = {aNeg.toFixed(2)}
              </span>
              <span className="font-mono text-[#160002]">
                ∫₀ᵇ sin(x)dx = {net.toFixed(2)} | ផ្ទៃសរុប = {total.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0.2}
              max={6.283}
              step={0.05}
              value={bClamped}
              onChange={(e) => setSignedB(parseFloat(e.target.value))}
              className="w-full accent-[#0085dd] cursor-pointer"
            />
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              {[
                { val: Math.PI / 2, label: "b = π/2" },
                { val: Math.PI, label: "b = π" },
                { val: (3 * Math.PI) / 2, label: "b = 3π/2" },
                { val: 2 * Math.PI, label: "b = 2π (សុទ្ធ = 0)" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => setSignedB(btn.val)}
                  className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                    Math.abs(bClamped - btn.val) < 0.08
                      ? "border-[#0085dd] bg-[#0085dd] text-white"
                      : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Interactive controls for FTC Part 1 Accumulation */}
      {preset === "ftc-accumulation" && (() => {
        const xVal = Math.max(0.25, Math.min(3.7, ftcX));
        const fx = 1.5 - 0.25 * (xVal - 2) * (xVal - 2);
        const gx = 1.5 * xVal - (Math.pow(xVal - 2, 3) + 8) / 12;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">
                រំកិលគោលលើ x៖ អត្រាកើននៃផ្ទៃ g'(x) ស្មើនឹងកម្ពស់ខ្សែកោង f(x) ជានិច្ច!
              </span>
              <span className="font-mono text-[#160002]">
                x = {xVal.toFixed(2)} | g(x) = {gx.toFixed(2)} | g'(x) = f(x) = {fx.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0.3}
              max={3.7}
              step={0.05}
              value={xVal}
              onChange={(e) => setFtcX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for u-Substitution Transformation Map */}
      {preset === "u-substitution-map" && (() => {
        const bVal = Math.max(0.5, Math.min(2.0, subB));
        const uTop = bVal * bVal + 1;
        const area = (2 / 3) * (Math.pow(uTop, 1.5) - 1);
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#0085dd]">
                រំកិលគោលលើ b៖ គោលថ្មី u = b² + 1 = {uTop.toFixed(2)} (មិនបាច់ប្តូរត្រឡប់ទៅ x វិញ!)
              </span>
              <span className="font-mono text-[#160002]">
                Aₓ = Aᵤ = {area.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={bVal}
              onChange={(e) => setSubB(parseFloat(e.target.value))}
              className="w-full accent-[#0085dd] cursor-pointer"
            />
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {[
                { val: 1.0, label: "b = 1 ⇒ u ∈ [1, 2]" },
                { val: Math.sqrt(3), label: "b = √3 ⇒ u ∈ [1, 4]" },
                { val: 2.0, label: "b = 2 ⇒ u ∈ [1, 5]" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => setSubB(btn.val)}
                  className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                    Math.abs(bVal - btn.val) < 0.05
                      ? "border-[#0085dd] bg-[#0085dd] text-white"
                      : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Interactive controls for Area Between Curves (dx vertical strip) */}
      {preset === "area-between-x" && (() => {
        const x0 = Math.max(-1.85, Math.min(0.85, areaStripX));
        const yTop = 2 - x0 * x0;
        const yBot = x0;
        const h = yTop - yBot;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">
                បន្ទះឈរត្រង់ x₀ = {x0.toFixed(2)}៖ កម្ពស់ h = y_លើ − y_ក្រោម = {h.toFixed(2)} &gt; 0
              </span>
              <span className="font-mono text-[#160002]">
                y_លើ = {yTop.toFixed(2)} | y_ក្រោម = {yBot.toFixed(2)} | ផ្ទៃ A = 9/2 = 4.5
              </span>
            </div>
            <input
              type="range"
              min={-1.85}
              max={0.85}
              step={0.05}
              value={x0}
              onChange={(e) => setAreaStripX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Area Between Curves (dy horizontal strip) */}
      {preset === "area-between-y" && (() => {
        const y0 = Math.max(-0.85, Math.min(1.85, areaStripY));
        const xLeft = y0 * y0 - 1;
        const xRight = y0 + 1;
        const w = xRight - xLeft;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">
                បន្ទះដេកត្រង់ y₀ = {y0.toFixed(2)}៖ ប្រវែង w = x_ស្តាំ − x_ឆ្វេង = {w.toFixed(2)} &gt; 0
              </span>
              <span className="font-mono text-[#160002]">
                x_ស្តាំ = {xRight.toFixed(2)} | x_ឆ្វេង = {xLeft.toFixed(2)} | ផ្ទៃ A = 9/2 = 4.5
              </span>
            </div>
            <input
              type="range"
              min={-0.85}
              max={1.85}
              step={0.05}
              value={y0}
              onChange={(e) => setAreaStripY(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Volume Disk / Washer Method */}
      {preset === "volume-disk-washer" && (() => {
        const x0 = Math.max(0.12, Math.min(0.92, washerX));
        const R = Math.sqrt(x0);
        const r = washerMode === "washer" ? x0 * x0 : 0;
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">
                រំកិលមុខកាត់ x₀ = {x0.toFixed(2)}៖ R = {R.toFixed(2)} {washerMode === "washer" ? `| r = ${r.toFixed(2)}` : "(គ្មានរន្ធ r = 0)"}
              </span>
              <span className="font-mono text-[#160002]">
                មាឌពិត V = {washerMode === "washer" ? "3π/10 ≈ 0.942" : "π/2 ≈ 1.571"}
              </span>
            </div>
            <input
              type="range"
              min={0.12}
              max={0.92}
              step={0.04}
              value={x0}
              onChange={(e) => setWasherX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setWasherMode("disk")}
                className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                  washerMode === "disk"
                    ? "border-[#0085dd] bg-[#0085dd] text-white"
                    : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                }`}
              >
                វិធីថាស (Disk: y = √x)
              </button>
              <button
                type="button"
                onClick={() => setWasherMode("washer")}
                className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                  washerMode === "washer"
                    ? "border-[#db073d] bg-[#db073d] text-white"
                    : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                }`}
              >
                វិធីចិញ្ចៀន (Washer: √x & x²)
              </button>
            </div>
          </div>
        );
      })()}

      {/* Interactive controls for Volume Cylindrical Shells */}
      {preset === "volume-shell-method" && (() => {
        const x0 = Math.max(0.25, Math.min(1.85, shellX));
        const hVal = 2 * x0 * x0 - x0 * x0 * x0;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#009b5e]">
                រំកិលកាំសំបក r = x₀ = {x0.toFixed(2)}៖ កម្ពស់ h = {hVal.toFixed(2)} | ជុំវិញ 2πr = {(2 * Math.PI * x0).toFixed(2)}
              </span>
              <span className="font-mono text-[#160002]">
                V = 2π∫₀² x(2x²−x³)dx = 16π/5
              </span>
            </div>
            <input
              type="range"
              min={0.25}
              max={1.85}
              step={0.05}
              value={x0}
              onChange={(e) => setShellX(parseFloat(e.target.value))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Arc Length Polygonal Approximation */}
      {preset === "arc-length-polygonal" && (() => {
        const nSeg = Math.max(1, Math.min(12, arcN));
        const fn = (x) => (2 / 3) * Math.pow(x, 1.5);
        const dx = 3 / nSeg;
        let polyLen = 0;
        for (let k = 0; k < nSeg; k++) {
          const dy = fn((k + 1) * dx) - fn(k * dx);
          polyLen += Math.sqrt(dx * dx + dy * dy);
        }
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">
                បង្កើនចំនួនកំណាត់ n = {nSeg}៖ ខ្សែកាច់ខិតទៅជិតប្រវែងពិត L = 14/3 ≈ 4.6667
              </span>
              <span className="font-mono text-[#160002]">
                Lₙ = {polyLen.toFixed(4)} | ពិត = 4.6667
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={nSeg}
              onChange={(e) => setArcN(parseInt(e.target.value, 10))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Surface Area Frustum Band */}
      {preset === "surface-area-frustum" && (() => {
        const x0 = Math.max(0.25, Math.min(2.45, frustumX));
        const r = 2 * Math.sqrt(x0);
        const dyDx = 1 / Math.sqrt(x0);
        const factor = Math.sqrt(1 + dyDx * dyDx);
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#db073d]">
                រំកិលកំណាត់កោណ x₀ = {x0.toFixed(2)}៖ កាំ r = {r.toFixed(2)} | √(1+(y')²) = {factor.toFixed(2)}
              </span>
              <span className="font-mono text-[#160002]">
                S = 2π∫₀³ 2√(x+1)dx = 56π/3
              </span>
            </div>
            <input
              type="range"
              min={0.25}
              max={2.45}
              step={0.05}
              value={x0}
              onChange={(e) => setFrustumX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Integration by Parts Geometric Proof */}
      {preset === "ibp-area-rectangle" && (() => {
        const b = Math.max(1.0, Math.min(2.0, ibpB));
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#0085dd]">
                រំកិលចំណុចចុងលើ b = {b.toFixed(2)}៖ សង្កេតថា (ផ្ទៃខៀវ + ផ្ទៃក្រហម) ស្មើ [u·v]ₐᵇ ជានិច្ច!
              </span>
              <span className="font-mono text-[#160002]">
                u(b) = {b.toFixed(2)} | v(b) = {(0.5 * b * b + 0.45).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.0}
              step={0.05}
              value={b}
              onChange={(e) => setIbpB(parseFloat(e.target.value))}
              className="w-full accent-[#0085dd] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive slider for L'Hôpital's Rule */}
      {preset === "lhopital-ratio" && (() => {
        const fx = Math.sin(2 * lhopX);
        const gx = Math.log(1 + lhopX);
        const ratio = fx / gx;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#009b5e]">
                រំកិល x → 0 ដើម្បីមើល f(x)/g(x) ខិតទៅរក f'(0)/g'(0) = 2
              </span>
              <span className="font-mono text-[#160002]">
                x = {lhopX.toFixed(2)} | sin(2x)/ln(1+x) = {ratio.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min={0.02}
              max={1.0}
              step={0.02}
              value={lhopX}
              onChange={(e) => setLhopX(parseFloat(e.target.value))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive slider for Optimization Fence */}
      {preset === "optimization-box" && (() => {
        const yLen = 40 - 2 * optX;
        const area = optX * yLen;
        const isMax = optX === 10;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className={isMax ? "text-[#009b5e]" : "text-[#db073d]"}>
                {isMax
                  ? "អតិបរមាដាច់ខាត! A'(10) = 0 ⇒ A_max = 200 m²"
                  : "រំកិលទទឹង x ដើម្បីស្វែងរកផ្ទៃដីធំបំផុត (របងសរុប 40 m)"}
              </span>
              <span className="font-mono text-[#160002]">
                x = {optX} m | y = {yLen} m | A = {area} m²
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={18}
              step={1}
              value={optX}
              onChange={(e) => setOptX(parseInt(e.target.value, 10))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Monotonicity & Concavity */}
      {preset === "monotonicity-concavity" && (() => {
        const m1 = 3 * curveX * curveX - 6 * curveX;
        const m2 = 6 * curveX - 6;
        const monoLabel =
          Math.abs(m1) < 0.08 ? "f' = 0 (បរមា)" : m1 > 0 ? "f' > 0 (កើន)" : "f' < 0 (ចុះ)";
        const concLabel =
          Math.abs(m2) < 0.08
            ? "f'' = 0 (ចំណុចរបត់!)"
            : m2 > 0
            ? "f'' > 0 (ផតឡើងលើ ∪)"
            : "f'' < 0 (ផតចុះក្រោម ∩)";
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className="text-[#9c0329]">
                x₀ = {curveX.toFixed(2)} • {monoLabel} • {concLabel}
              </span>
              <span className="font-mono text-[#160002]">
                f' = {m1.toFixed(2)} | f'' = {m2.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-0.9}
              max={2.9}
              step={0.05}
              value={curveX}
              onChange={(e) => setCurveX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: "Max (0, 2)", val: 0 },
                { label: "ចំណុចរបត់ I(1, 0)", val: 1 },
                { label: "Min (2, -2)", val: 2 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setCurveX(btn.val)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                    Math.abs(curveX - btn.val) < 0.03
                      ? "border-[#db073d] bg-[#db073d] text-white"
                      : "border-[#ffd3d2] bg-white text-[#47010d] hover:bg-[#ffe9e8]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Interactive step toggle for Rational Curve Sketching */}
      {preset === "curve-sketch-rational" && (
        <div className="grid grid-cols-3 gap-1.5 px-1 text-[11px]">
          {[
            { step: 1, label: "១. អាស៊ីមតូត" },
            { step: 2, label: "២. ចំណុចបរមា" },
            { step: 3, label: "៣. ខ្សែកោងពេញ" },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setSketchStep(item.step)}
              className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                sketchStep === item.step
                  ? "border-[#db073d] bg-[#db073d] text-white"
                  : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Interactive controls for Rolle's Theorem */}
      {preset === "rolle-theorem" && (() => {
        const m = 3 - rolleX;
        const isFlat = Math.abs(m) < 0.08;
        return (
          <div className="space-y-1.5 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className={isFlat ? "text-[#009b5e]" : "text-[#db073d]"}>
                {isFlat
                  ? "បន្ទាត់ប៉ះដេក! f'(3) = 0 (ទ្រឹស្តីបទ Rolle)"
                  : "រំកិល x₀ ក្នុង (1, 5) ដើម្បីរកចំណុច c ដែល f'(c) = 0"}
              </span>
              <span className="font-mono text-[#160002]">
                x₀ = {rolleX.toFixed(2)} | f'(x₀) = {m.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={1.1}
              max={4.9}
              step={0.05}
              value={rolleX}
              onChange={(e) => setRolleX(parseFloat(e.target.value))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Mean Value Theorem */}
      {preset === "mvt-theorem" && (() => {
        const m = 1 / Math.sqrt(mvtX);
        const isParallel = Math.abs(m - 1) < 0.06;
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className={isParallel ? "text-[#009b5e]" : "text-[#db073d]"}>
                {isParallel
                  ? "បន្ទាត់ប៉ះស្របនឹងបន្ទាត់កាត់ AB! f'(1) = 1 = m_AB"
                  : "រំកិល x₀ ដើម្បីរកចំណុច c ដែល f'(c) = m_AB = 1"}
              </span>
              <span className="font-mono text-[#160002]">
                x₀ = {mvtX.toFixed(2)} | f'(x₀) = {m.toFixed(2)} | m_AB = 1.00
              </span>
            </div>
            <input
              type="range"
              min={0.25}
              max={3.8}
              step={0.05}
              value={mvtX}
              onChange={(e) => setMvtX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
        );
      })()}

      {/* Interactive controls for Extrema Local vs Global */}
      {preset === "extrema-local-global" && (() => {
        const y0 = 0.5 * (extremaX * extremaX * extremaX - 3 * extremaX) + 1;
        const m = 1.5 * (extremaX * extremaX - 1);
        const isFlat = Math.abs(m) < 0.08;
        return (
          <div className="space-y-2 px-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <span className={isFlat ? "text-[#009b5e]" : "text-[#db073d]"}>
                {isFlat
                  ? "បន្ទាត់ប៉ះដេក! f'(x₀) ≈ 0 (ទ្រឹស្តីបទ Fermat)"
                  : "រំកិល x₀ ដើម្បីមើលមេគុណប្រាប់ទិសបន្ទាត់ប៉ះ f'(x₀)"}
              </span>
              <span className="font-mono text-[#160002]">
                x₀ = {extremaX.toFixed(2)} | f(x₀) = {y0.toFixed(2)} | f'(x₀) = {m.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-2.0}
              max={2.2}
              step={0.05}
              value={extremaX}
              onChange={(e) => setExtremaX(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: "ចុងឆ្វេង x = -2.0", val: -2.0 },
                { label: "អតិបរមាធៀប x = -1", val: -1.0 },
                { label: "អប្បបរមាធៀប x = 1", val: 1.0 },
                { label: "ចុងស្តាំ x = 2.2", val: 2.2 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setExtremaX(btn.val)}
                  className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition ${
                    Math.abs(extremaX - btn.val) < 0.03
                      ? "border-[#db073d] bg-[#db073d] text-white"
                      : "border-[#ffd3d2] bg-white text-[#47010d] hover:bg-[#ffe9e8]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Interactive toggle for Fermat Counterexamples */}
      {preset === "fermat-counterexample" && (
        <div className="flex items-center gap-2 px-1 text-xs">
          <button
            type="button"
            onClick={() => setFermatMode("cubic")}
            className={`flex-1 rounded-lg border px-2.5 py-1.5 font-bold transition ${
              fermatMode === "cubic"
                ? "border-[#db073d] bg-[#db073d] text-white"
                : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
            }`}
          >
            f(x) = x³ : f'(0) = 0 តែគ្មានបរមា
          </button>
          <button
            type="button"
            onClick={() => setFermatMode("corner")}
            className={`flex-1 rounded-lg border px-2.5 py-1.5 font-bold transition ${
              fermatMode === "corner"
                ? "border-[#0097a8] bg-[#0097a8] text-white"
                : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
            }`}
          >
            f(x) = |x| : មានអប្បបរមា តែគ្មាន f'(0)
          </button>
        </div>
      )}

      {/* Interactive candidate selector for Closed Interval Method */}
      {preset === "closed-interval-method" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 px-1 text-[11px]">
          {[
            { idx: 0, label: "x = 0 → -1 (Min ដាច់ខាត)" },
            { idx: 1, label: "x = 1 → 4 (Max ធៀប)" },
            { idx: 2, label: "x = 2 → 3 (Min ធៀប)" },
            { idx: 3, label: "x = 3 → 8 (Max ដាច់ខាត)" },
          ].map((item) => (
            <button
              key={item.idx}
              type="button"
              onClick={() => setIntervalIdx(item.idx)}
              className={`rounded-lg border px-2 py-1.5 font-bold transition ${
                intervalIdx === item.idx
                  ? "border-[#db073d] bg-[#db073d] text-white"
                  : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Interactive slider for Secant -> Tangent */}
      {preset === "secant-to-tangent" && (
        <div className="space-y-1.5 px-1 text-xs">
          <div className="flex justify-between font-bold text-[#009b5e]">
            <span>រំកិល h → 0 ដើម្បីមើលបន្ទាត់កាត់រំកិលទៅបន្ទាត់ប៉ះ</span>
            <span className="font-mono">
              h = {secantH.toFixed(2)} | m = {(2 + secantH).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.05}
            max={1.8}
            step={0.05}
            value={secantH}
            onChange={(e) => setSecantH(parseFloat(e.target.value))}
            className="w-full accent-[#009b5e] cursor-pointer"
          />
        </div>
      )}

      {/* Toggle for Non-differentiable Cases */}
      {preset === "non-diff-corner" && (
        <div className="flex items-center gap-2 px-1 text-xs">
          <button
            type="button"
            onClick={() => setNonDiffMode("corner")}
            className={`flex-1 rounded-lg border px-2.5 py-1.5 font-bold transition ${
              nonDiffMode === "corner"
                ? "border-[#db073d] bg-[#db073d] text-white"
                : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
            }`}
          >
            ចំណុចមុំ f(x) = |x|
          </button>
          <button
            type="button"
            onClick={() => setNonDiffMode("vertical")}
            className={`flex-1 rounded-lg border px-2.5 py-1.5 font-bold transition ${
              nonDiffMode === "vertical"
                ? "border-[#0097a8] bg-[#0097a8] text-white"
                : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
            }`}
          >
            បន្ទាត់ប៉ះឈរ ∛x
          </button>
        </div>
      )}

      {/* Step selector for Example Parabola Construction */}
      {preset === "example-parabola-steps" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 px-1 text-[11px]">
          {[
            { step: 1, label: "១. y = x²" },
            { step: 2, label: "២. (x - 1)²" },
            { step: 3, label: "៣. -2(x - 1)²" },
            { step: 4, label: "៤. -2(x - 1)² + 3" },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setParabolaStep(item.step)}
              className={`rounded-lg border px-2 py-1.5 font-mono font-bold transition ${
                parabolaStep === item.step
                  ? "border-[#db073d] bg-[#db073d] text-white shadow-2xs"
                  : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Toggle for Absolute Value Transformation */}
      {preset === "graph-abs-transform" && (
        <div className="flex items-center gap-2 px-1 text-xs">
          <button
            type="button"
            onClick={() => setAbsMode("outer")}
            className={`flex-1 rounded-lg border px-2.5 py-1.5 font-bold transition ${
              absMode === "outer"
                ? "border-[#db073d] bg-[#db073d] text-white"
                : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
            }`}
          >
            y = |f(x)|
          </button>
          <button
            type="button"
            onClick={() => setAbsMode("inner")}
            className={`flex-1 rounded-lg border px-2.5 py-1.5 font-bold transition ${
              absMode === "inner"
                ? "border-[#009b5e] bg-[#009b5e] text-white"
                : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
            }`}
          >
            y = f(|x|)
          </button>
        </div>
      )}

      {/* Mini interactive slider for Graph Scaling */}
      {preset === "graph-scaling" && (
        <div className="space-y-1.5 px-1 text-xs">
          <div className="flex justify-between font-bold text-[#7e021f]">
            <span>កែតម្រូវមេគុណ c</span>
            <span className="font-mono">c = {scaleC.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.25}
            value={scaleC}
            onChange={(e) => setScaleC(parseFloat(e.target.value))}
            className="w-full accent-[#db073d] cursor-pointer"
          />
          <div className="flex flex-wrap gap-3 text-[11px] font-bold">
            <span className="text-[#0085dd]">--- sin(x) ដើម</span>
            <span className="text-[#db073d]">— c·sin(x) (ពង្រីក/បង្រួមឈរ)</span>
            <span className="text-[#009b5e]">— sin(c·x) (បង្រួម/ពង្រួមដេក)</span>
          </div>
        </div>
      )}

      {/* Mini interactive sliders for Graph Shifting */}
      {preset === "graph-shift-scale" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1 text-xs">
          <div>
            <div className="flex justify-between font-bold text-[#db073d]">
              <span>រំកិលដេក h (ឆ្វេង/ស្តាំ)</span>
              <span className="font-mono">h = {shiftH.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-2.5}
              max={2.5}
              step={0.5}
              value={shiftH}
              onChange={(e) => setShiftH(parseFloat(e.target.value))}
              className="w-full accent-[#db073d] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between font-bold text-[#009b5e]">
              <span>រំកិលឈរ k (ឡើង/ចុះ)</span>
              <span className="font-mono">k = {shiftK.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-2}
              max={3}
              step={0.5}
              value={shiftK}
              onChange={(e) => setShiftK(parseFloat(e.target.value))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Mini interactive slider for Linear Slope */}
      {preset === "linear-slope" && (
        <div className="flex items-center gap-3 px-1 text-xs">
          <div className="flex-1">
            <div className="flex justify-between font-bold text-[#0085dd]">
              <span>កែតម្រូវមេគុណប្រាប់ទិស m (b = 1)</span>
              <span className="font-mono">m = {slope.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-2.5}
              max={2.5}
              step={0.5}
              value={slope}
              onChange={(e) => setSlope(parseFloat(e.target.value))}
              className="w-full accent-[#0085dd] cursor-pointer"
            />
          </div>
          <div className="rounded-lg bg-[#e8f4fd] border border-[#b6dcf8] px-3 py-1.5 font-bold text-[#005c9e]">
            {slope > 0 ? "អនុគមន៍កើន" : slope < 0 ? "អនុគមន៍ចុះ" : "បន្ទាត់ដេក (ថេរ)"}
          </div>
        </div>
      )}

      {/* Mini interactive slider for Vertical Line Test */}
      {preset === "vertical-line-pass" && (
        <div className="flex items-center gap-3 px-1 text-xs">
          <div className="flex-1">
            <div className="flex justify-between font-bold text-[#009b5e]">
              <span>រំកិលបន្ទាត់ឈរ x = c</span>
              <span className="font-mono">x = {lineX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={-2.2}
              max={2.2}
              step={0.1}
              value={lineX}
              onChange={(e) => setLineX(parseFloat(e.target.value))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
          <div className="rounded-lg bg-[#e7f7f0] border border-[#b3e6d1] px-3 py-1.5 font-bold text-[#006e42]">
            កាត់តែ 1 ចំណុច (f({lineX.toFixed(1)}) = {(lineX * lineX - 1).toFixed(2)})
          </div>
        </div>
      )}

      {/* Mini interactive sliders on the epsilon-delta slide */}
      {preset === "epsilon-delta" && (
        <div className="grid grid-cols-2 gap-3 px-1 text-xs">
          <div>
            <div className="flex justify-between font-bold text-[#009b5e]">
              <span>ε (Y-band)</span>
              <span className="font-mono">{epsilon.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.15}
              max={1.2}
              step={0.05}
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-[#009b5e] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between font-bold text-[#0097a8]">
              <span>δ (X-band)</span>
              <span className="font-mono">{delta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={delta}
              onChange={(e) => setDelta(parseFloat(e.target.value))}
              className="w-full accent-[#0097a8] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Mini interactive slider on the epsilon-N slide */}
      {preset === "epsilon-n" && (() => {
        const eps = Math.max(0.3, Math.min(1.2, epsilon));
        const N = 3 / eps;
        return (
          <div className="grid grid-cols-2 gap-3 items-center px-1 text-xs">
            <div>
              <div className="flex justify-between font-bold text-[#009b5e]">
                <span>ε (គម្លាតលម្អៀងលើ Y)</span>
                <span className="font-mono">{eps.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={1.2}
                step={0.05}
                value={eps}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full accent-[#009b5e] cursor-pointer"
              />
            </div>
            <div className="rounded-lg bg-[#ffe9e8] border border-[#fdbcbc] px-3 py-1.5 text-center font-bold text-[#9c0329]">
              តម្លៃគោល N = 3 / ε = <span className="font-mono">{N.toFixed(2)}</span>
            </div>
          </div>
        );
      })()}

      {captionKh && (
        <p className="text-xs font-bold text-[#7e021f] text-center leading-relaxed px-1">
          {captionKh}
        </p>
      )}
    </div>
  );
}
