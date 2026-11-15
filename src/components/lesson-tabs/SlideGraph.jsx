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
      </div>

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
