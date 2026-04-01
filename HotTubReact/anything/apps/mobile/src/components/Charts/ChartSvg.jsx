import React from "react";
import { useWindowDimensions } from "react-native";
import Svg, {
  Path,
  Circle,
  G,
  Line,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { format, parseISO, isValid } from "date-fns";

const GRAPH_HEIGHT = 250;
const PADDING = 20;
const CHART_MARGIN = { top: 10, right: 35, bottom: 40, left: 40 };

export function ChartSvg({
  dataPoints,
  chemicalMax,
  chemicalMin,
  chemicalRange,
  userMax,
  chartFilters,
  isBromine,
  colors,
}) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - PADDING * 2;
  const chartWidth = containerWidth - CHART_MARGIN.left - CHART_MARGIN.right;
  const chartHeight = GRAPH_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

  const showChemicals = chartFilters.showChlorine || chartFilters.showPH;
  const showUsers = chartFilters.showUsers;

  const getX = (index) =>
    (index / Math.max(dataPoints.length - 1, 1)) * chartWidth;
  const getChemicalY = (val) =>
    chartHeight - ((val - chemicalMin) / chemicalRange) * chartHeight;
  const getUserY = (val) => chartHeight - (val / userMax) * chartHeight;

  const barWidth = (chartWidth / Math.max(dataPoints.length, 1)) * 0.6;

  // Helper function to safely format dates
  const safeFormatDate = (dateString, formatStr = "dd/MM") => {
    if (!dateString) return "??/??";
    try {
      const parsed = parseISO(dateString);
      if (!isValid(parsed)) return "??/??";
      return format(parsed, formatStr);
    } catch (e) {
      console.error("Chart date formatting error:", e, "for date:", dateString);
      return "??/??";
    }
  };

  return (
    <Svg width={containerWidth} height={GRAPH_HEIGHT}>
      <G translate={`${CHART_MARGIN.left},${CHART_MARGIN.top}`}>
        {/* Ideal Range Bands */}
        {chartFilters.showChlorine && (
          <Rect
            x="0"
            y={getChemicalY(isBromine ? 5.0 : 3.0)}
            width={chartWidth}
            height={Math.abs(
              getChemicalY(isBromine ? 3.0 : 1.0) -
                getChemicalY(isBromine ? 5.0 : 3.0),
            )}
            fill={colors.primary + "10"}
          />
        )}
        {chartFilters.showPH && (
          <Rect
            x="0"
            y={getChemicalY(7.8)}
            width={chartWidth}
            height={Math.abs(getChemicalY(7.2) - getChemicalY(7.8))}
            fill={colors.success + "10"}
          />
        )}

        {/* Grid Lines & Left Y-Axis (Chemicals) */}
        {showChemicals &&
          [0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <G key={`chem-grid-${i}`}>
              <Line
                x1="0"
                y1={chartHeight * p}
                x2={chartWidth}
                y2={chartHeight * p}
                stroke={colors.border}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <SvgText
                x="-10"
                y={chartHeight * p + 4}
                fontSize="10"
                fill={colors.textTertiary}
                textAnchor="end"
                fontWeight="600"
              >
                {(chemicalMax - p * chemicalRange).toFixed(1)}
              </SvgText>
            </G>
          ))}

        {/* Right Y-Axis (Users) */}
        {showUsers &&
          [0, 0.5, 1].map((p, i) => (
            <SvgText
              key={`user-axis-${i}`}
              x={chartWidth + 8}
              y={chartHeight * p + 4}
              fontSize="10"
              fill={colors.warning}
              textAnchor="start"
              fontWeight="600"
            >
              {Math.round(userMax - p * userMax)}
            </SvgText>
          ))}

        {/* X-Axis Dates */}
        {dataPoints.map((d, i) => {
          if (
            i === 0 ||
            i === dataPoints.length - 1 ||
            (dataPoints.length > 5 && i === Math.floor(dataPoints.length / 2))
          ) {
            return (
              <SvgText
                key={`date-${i}`}
                x={getX(i)}
                y={chartHeight + 20}
                fontSize="10"
                fill={colors.textTertiary}
                textAnchor="middle"
              >
                {safeFormatDate(d.date)}
              </SvgText>
            );
          }
          return null;
        })}

        {/* User Count Bars */}
        {showUsers &&
          dataPoints.map((d, i) => {
            if (d.users > 0) {
              const centerX = getX(i);
              const x = centerX - barWidth / 2;
              const y = getUserY(d.users);
              const height = chartHeight - y;

              return (
                <Rect
                  key={`bar-${i}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  fill={colors.warning + "60"}
                  rx="2"
                />
              );
            }
            return null;
          })}

        {/* Chlorine Line */}
        {chartFilters.showChlorine &&
          (() => {
            let pathData = "";
            let firstPoint = true;
            dataPoints.forEach((d, i) => {
              if (d.chlorine !== null) {
                const x = getX(i);
                const y = getChemicalY(Number(d.chlorine));
                pathData += `${firstPoint ? "M" : "L"} ${x} ${y} `;
                firstPoint = false;
              }
            });

            if (pathData) {
              return (
                <G key="chlorine-line">
                  <Path
                    d={pathData}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {dataPoints.map((d, i) => {
                    if (d.chlorine !== null) {
                      const val = Number(d.chlorine);
                      const isOutOfRange = isBromine
                        ? val < 3.0 || val > 5.0
                        : val < 1.0 || val > 3.0;

                      return (
                        <Circle
                          key={`cl-point-${i}`}
                          cx={getX(i)}
                          cy={getChemicalY(val)}
                          r={isOutOfRange ? "5" : "4"}
                          fill={
                            isOutOfRange ? colors.notification : colors.surface
                          }
                          stroke={
                            isOutOfRange ? colors.notification : colors.primary
                          }
                          strokeWidth="2"
                        />
                      );
                    }
                    return null;
                  })}
                </G>
              );
            }
            return null;
          })()}

        {/* pH Line */}
        {chartFilters.showPH &&
          (() => {
            let pathData = "";
            let firstPoint = true;
            dataPoints.forEach((d, i) => {
              if (d.ph !== null) {
                const x = getX(i);
                const y = getChemicalY(Number(d.ph));
                pathData += `${firstPoint ? "M" : "L"} ${x} ${y} `;
                firstPoint = false;
              }
            });

            if (pathData) {
              return (
                <G key="ph-line">
                  <Path
                    d={pathData}
                    fill="none"
                    stroke={colors.success}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {dataPoints.map((d, i) => {
                    if (d.ph !== null) {
                      const val = Number(d.ph);
                      const isOutOfRange = val < 7.2 || val > 7.8;

                      return (
                        <Circle
                          key={`ph-point-${i}`}
                          cx={getX(i)}
                          cy={getChemicalY(val)}
                          r={isOutOfRange ? "5" : "4"}
                          fill={
                            isOutOfRange ? colors.notification : colors.surface
                          }
                          stroke={
                            isOutOfRange ? colors.notification : colors.success
                          }
                          strokeWidth="2"
                        />
                      );
                    }
                    return null;
                  })}
                </G>
              );
            }
            return null;
          })()}
      </G>
    </Svg>
  );
}
