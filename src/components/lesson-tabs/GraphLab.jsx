"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Mafs, Coordinates, Plot, Point, Polygon, Line } from "mafs";
import { RotateCcw, Sliders, Info, AlertCircle } from "lucide-react";
import MathText from "@/components/common/MathText";

/**
 * Safely compiles a math expression string (e.g. "a * x^2 + b" or "sin(a * x) + b")
 * into a function (x, params) => number.
 */
function compileExpression(expr) {
  if (!expr || typeof expr !== "string") return null;

  const normalized = expr
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(
      /\b(sin|cos|tan|abs|sqrt|exp|log|pow|floor|ceil|round|min|max)\b/g,
      "Math.$1"
    );

  if (/[;{}\[\]=`"'\\]/.test(expr)) {
    return null;
  }

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      "x",
      "params",
      `
      const { a = 1, b = 0, c = 0, x0 = 0, epsilon = 0.5, delta = 0.5 } = params;
      with (params) {
        return (${normalized});
      }
      `
    );
    const testVal = fn(1, {});
    if (typeof testVal !== "number") return null;
    return fn;
  } catch {
    return null;
  }
}

export default function GraphLab({ graphConfig }) {
  const sliders = graphConfig?.sliders || [];

  const getInitialParams = useMemo(() => {
    const obj = {};
    sliders.forEach((s) => {
      obj[s.variable] = s.default ?? 0;
    });
    return obj;
  }, [sliders]);

  const [params, setParams] = useState(getInitialParams);
  const [equation, setEquation] = useState(
    graphConfig?.defaultEquation || "x^2"
  );

  useEffect(() => {
    setParams(getInitialParams);
    setEquation(graphConfig?.defaultEquation || "x^2");
  }, [graphConfig, getInitialParams]);

  const compiledFn = useMemo(() => compileExpression(equation), [equation]);

  const hasEpsilonDelta =
    typeof params.epsilon === "number" && typeof params.delta === "number";
  const x0 = typeof params.x0 === "number" ? params.x0 : 1;

  const limitL = useMemo(() => {
    if (!compiledFn) return NaN;
    try {
      const val = compiledFn(x0, params);
      return Number.isFinite(val) ? val : NaN;
    } catch {
      return NaN;
    }
  }, [compiledFn, x0, params]);

  const epsilonDeltaValid = useMemo(() => {
    if (!hasEpsilonDelta || !compiledFn || !Number.isFinite(limitL)) return null;
    const samples = 40;
    const d = params.delta;
    const eps = params.epsilon;
    for (let i = 1; i < samples; i++) {
      const x = x0 - d + (2 * d * i) / samples;
      try {
        const y = compiledFn(x, params);
        if (!Number.isFinite(y) || Math.abs(y - limitL) >= eps) {
          return false;
        }
      } catch {
        return false;
      }
    }
    return true;
  }, [hasEpsilonDelta, compiledFn, limitL, x0, params]);

  const handleSliderChange = (variable, value) => {
    setParams((prev) => ({ ...prev, [variable]: parseFloat(value) }));
  };

  const handleReset = () => {
    setParams(getInitialParams);
    setEquation(graphConfig?.defaultEquation || "x^2");
  };

  if (!graphConfig) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានក្រាបអន្តរកម្មសម្រាប់មេរៀននេះទេ។
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left/Top: Interactive Mafs Graph */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="rounded-2xl border border-[#ffd3d2] bg-white p-3 sm:p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#db073d]" />
              <span className="text-sm font-bold text-[#160002]">
                ក្រាបអនុគមន៍{" "}
                <code className="font-mono text-[#0085dd]">
                  f(x) = {equation}
                </code>
              </span>
            </div>

            {hasEpsilonDelta && Number.isFinite(limitL) && (
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  epsilonDeltaValid
                    ? "bg-[#009b5e] text-white"
                    : "bg-[#db073d] text-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-white" />
                {epsilonDeltaValid
                  ? "លក្ខខណ្ឌ |f(x) - L| < ε ត្រូវបានផ្ទៀងផ្ទាត់!"
                  : "δ ធំពេក៖ ក្រាបចេញក្រៅដែន ε"}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-[#ffd3d2] bg-white">
            <Mafs
              height={430}
              viewBox={{ x: [-5, 5], y: [-4, 6] }}
              zoom={true}
              pan={true}
            >
              <Coordinates.Cartesian subdivisions={2} />

              {/* Epsilon horizontal band (Split-Complementary Green #009b5e) */}
              {hasEpsilonDelta && Number.isFinite(limitL) && (
                <Polygon
                  points={[
                    [-20, limitL - params.epsilon],
                    [20, limitL - params.epsilon],
                    [20, limitL + params.epsilon],
                    [-20, limitL + params.epsilon],
                  ]}
                  color="#009b5e"
                  fillOpacity={0.14}
                  strokeOpacity={0.5}
                  strokeStyle="dashed"
                />
              )}

              {/* Delta vertical band (Complementary Teal #0097a8) */}
              {hasEpsilonDelta && Number.isFinite(limitL) && (
                <Polygon
                  points={[
                    [x0 - params.delta, -20],
                    [x0 + params.delta, -20],
                    [x0 + params.delta, 20],
                    [x0 - params.delta, 20],
                  ]}
                  color="#0097a8"
                  fillOpacity={0.14}
                  strokeOpacity={0.5}
                  strokeStyle="dashed"
                />
              )}

              {/* Function Plot (Split-Complementary Blue #0085dd) */}
              {compiledFn && (
                <Plot.OfX
                  y={(x) => {
                    try {
                      const val = compiledFn(x, params);
                      return Number.isFinite(val) ? val : NaN;
                    } catch {
                      return NaN;
                    }
                  }}
                  color="#0085dd"
                  weight={3}
                />
              )}

              {/* Target Point (x0, L) and guide lines */}
              {hasEpsilonDelta && Number.isFinite(limitL) && (
                <>
                  <Line.Segment
                    point1={[x0, 0]}
                    point2={[x0, limitL]}
                    style="dashed"
                    color="#47010d"
                    opacity={0.55}
                  />
                  <Line.Segment
                    point1={[0, limitL]}
                    point2={[x0, limitL]}
                    style="dashed"
                    color="#47010d"
                    opacity={0.55}
                  />
                  <Point
                    x={x0}
                    y={limitL}
                    color={epsilonDeltaValid ? "#009b5e" : "#db073d"}
                  />
                </>
              )}
            </Mafs>
          </div>

          <p className="mt-2.5 text-xs font-medium text-[#47010d] px-1">
            ព័ត៌មានជំនួយ៖ អ្នកអាចអូសក្រាបដើម្បីផ្លាស់ទី ឬប្រើកង់ម៉ៅ (Scroll) ដើម្បីពង្រីក/បង្រួម។
          </p>
        </div>

        {/* Instructions Banner */}
        {graphConfig.instructionsKh && (
          <div className="rounded-xl border border-[#0097a8]/35 bg-[#0097a8]/10 p-4 flex items-start gap-3 text-[#160002]">
            <Info className="h-5 w-5 text-[#0097a8] shrink-0 mt-0.5" />
            <div className="text-sm md:text-base font-medium khmer-prose">
              <MathText text={graphConfig.instructionsKh} />
            </div>
          </div>
        )}
      </div>

      {/* Right/Bottom: Equation & Parameter Controls */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-[#160002]">
              <Sliders className="h-4 w-4 text-[#db073d]" />
              ការកំណត់ប៉ារ៉ាម៉ែត្រ
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#fdbcbc] bg-[#ffe9e8] px-2.5 py-1 text-xs font-bold text-[#7e021f] hover:bg-[#ffd3d2] transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              កំណត់ឡើងវិញ
            </button>
          </div>

          {/* Equation Input */}
          <div>
            <label className="block text-xs font-bold text-[#47010d] mb-1.5">
              សមីការអនុគមន៍ f(x)
            </label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="w-full rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-3 py-2 font-mono text-sm font-semibold text-[#160002] focus:border-[#db073d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#db073d]/20"
              placeholder="ឧ. a * x^2 + b"
            />
            {!compiledFn && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#db073d]">
                <AlertCircle className="h-3.5 w-3.5" />
                សមីការមិនត្រឹមត្រូវ (ឧ. ប្រើ a * x^2 + b ឬ sin(x))
              </p>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2 border-t border-[#ffe9e8]">
            {sliders.map((slider) => {
              const currentVal = params[slider.variable] ?? slider.default ?? 0;
              return (
                <div key={slider.variable} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-[#160002]">
                      {slider.label || slider.variable}
                    </span>
                    <span className="rounded-md bg-[#ffe9e8] border border-[#fdbcbc] px-2 py-0.5 font-mono text-xs font-bold text-[#7e021f]">
                      {slider.variable} ={" "}
                      {Number(currentVal).toFixed(2).replace(/\.00$/, "")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={currentVal}
                    onChange={(e) =>
                      handleSliderChange(slider.variable, e.target.value)
                    }
                    className="w-full accent-[#db073d] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono font-semibold text-[#620116]">
                    <span>{slider.min}</span>
                    <span>{slider.max}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Readout for Epsilon-Delta */}
          {hasEpsilonDelta && Number.isFinite(limitL) && (
            <div className="rounded-xl bg-[#ffe9e8]/70 border border-[#fdbcbc] p-3.5 text-xs space-y-1.5">
              <div className="font-bold text-[#7e021f]">
                តម្លៃគណនាបច្ចុប្បន្ន៖
              </div>
              <div className="flex justify-between font-mono font-semibold text-[#160002]">
                <span>x₀ = {x0.toFixed(2)}</span>
                <span>L = f(x₀) = {limitL.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-mono font-semibold text-[#009b5e]">
                <span>(L - ε, L + ε)</span>
                <span>
                  ({(limitL - params.epsilon).toFixed(2)},{" "}
                  {(limitL + params.epsilon).toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between font-mono font-semibold text-[#0097a8]">
                <span>(x₀ - δ, x₀ + δ)</span>
                <span>
                  ({(x0 - params.delta).toFixed(2)},{" "}
                  {(x0 + params.delta).toFixed(2)})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
