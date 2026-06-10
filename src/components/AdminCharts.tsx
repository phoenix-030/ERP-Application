import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, {
    Defs,
    Line,
    Path,
    Rect,
    Stop,
    LinearGradient as SvgGrad,
} from "react-native-svg";

const { width } = Dimensions.get("window");

export type DepartmentChartData = {
  name: string;
  value: number;
};

export type RevenueChartData = number[];

type AdminChartsProps = {
  deptData: DepartmentChartData[];
  revenueData: RevenueChartData;
  axisTextStyle?: object;
  chartCardStyle?: object;
};

export function AdminBarChart({
  deptData,
}: Pick<AdminChartsProps, "deptData">) {
  const chartW = width - 100;
  const chartH = 160;
  const maxVal = Math.max(...deptData.map((item) => item.value), 1);
  const barWidth = (chartW / deptData.length) * 0.55;
  const gap = (chartW / deptData.length) * 0.45;
  const yLabels = [0, maxVal / 4, maxVal / 2, (3 * maxVal) / 4, maxVal];

  return (
    <View style={{ flexDirection: "row", paddingTop: 16 }}>
      <View
        style={{
          height: chartH,
          justifyContent: "space-between",
          alignItems: "flex-end",
          width: 35,
          marginRight: 8,
        }}
      >
        {[...yLabels].reverse().map((v, i) => (
          <Text key={i} style={styles.axisText}>
            {Math.round(v)}
          </Text>
        ))}
      </View>
      <View>
        <Svg width={chartW} height={chartH}>
          {yLabels.map((v, i) => {
            const y = chartH - (v / maxVal) * chartH;
            return (
              <Line
                key={i}
                x1="0"
                y1={y}
                x2={chartW}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
          {deptData.map((item, i) => {
            const barH = (item.value / maxVal) * chartH;
            const x = i * (barWidth + gap) + gap / 2;
            const y = chartH - barH;
            return (
              <Rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill="#6366f1"
                rx={4}
              />
            );
          })}
        </Svg>
        <View style={{ flexDirection: "row", width: chartW, marginTop: 6 }}>
          {deptData.map((item, i) => (
            <View
              key={i}
              style={{ width: barWidth + gap, alignItems: "center" }}
            >
              <Text style={styles.axisText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function AdminLineChart({
  revenueData,
}: Pick<AdminChartsProps, "revenueData">) {
  const chartW = width - 100;
  const chartH = 120;
  const minVal = Math.min(...revenueData, 0);
  const maxVal = Math.max(...revenueData, 1);
  const yLabels = [maxVal, (maxVal + minVal) / 2, minVal];

  const points = revenueData.map((v, i) => ({
    x: (i / (revenueData.length - 1)) * chartW,
    y: chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");
  const areaPath = `M 0,${chartH} L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L ${chartW},${chartH} Z`;

  return (
    <View style={{ flexDirection: "row", paddingTop: 16 }}>
      <View
        style={{
          height: chartH,
          justifyContent: "space-between",
          alignItems: "flex-end",
          width: 35,
          marginRight: 8,
        }}
      >
        {yLabels.map((v, i) => (
          <Text key={i} style={styles.axisText}>
            {Math.round(v)}
          </Text>
        ))}
      </View>
      <Svg width={chartW} height={chartH}>
        <Defs>
          <SvgGrad id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#10b981" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#10b981" stopOpacity="0" />
          </SvgGrad>
        </Defs>
        {yLabels.map((v, i) => {
          const y = chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH;
          return (
            <Line
              key={i}
              x1="0"
              y1={y}
              x2={chartW}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
        <Path d={areaPath} fill="url(#revGradient)" />
        <Path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />
        {points.map((p, i) => (
          <Rect
            key={i}
            x={p.x - 5}
            y={p.y - 5}
            width={10}
            height={10}
            rx={5}
            fill="#10b981"
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  axisText: { fontSize: 10, color: "#64748b" },
});
