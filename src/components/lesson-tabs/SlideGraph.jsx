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
      </div>

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
