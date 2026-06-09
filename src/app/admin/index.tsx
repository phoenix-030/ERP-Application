import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, DollarSign, TrendingUp, Bell, FileText, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Line, Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '2450', change: '+12%', colors: ['#2563eb', '#3b82f6'] as [string, string], icon: Users },
    { label: 'Total Staff', value: '156', change: '+5%', colors: ['#7c3aed', '#a855f7'] as [string, string], icon: Users },
    { label: 'Revenue', value: '₹45L', change: '+18%', colors: ['#16a34a', '#22c55e'] as [string, string], icon: DollarSign },
    { label: 'Avg Attendance', value: '87%', change: '+3%', colors: ['#ea580c', '#f97316'] as [string, string], icon: TrendingUp },
  ];

  const deptData = [
    { name: 'CSE', value: 850 },
    { name: 'ECE', value: 640 },
    { name: 'MECH', value: 470 },
    { name: 'CIVIL', value: 290 },
    { name: 'EEE', value: 200 },
  ];

  const revenueData = [25, 30, 38, 32, 45];

  const notices = [
    { title: 'Semester Exam Schedule Released', date: 'May 15, 2026' },
    { title: 'Holiday Notice - May 20', date: 'May 10, 2026' },
    { title: 'Faculty Meeting Scheduled', date: 'May 8, 2026' },
  ];

  // Bar Chart Component
  const BarChart = () => {
    const chartW = width - 100;
    const chartH = 160;
    const maxVal = 1000;
    const barWidth = (chartW / deptData.length) * 0.55;
    const gap = (chartW / deptData.length) * 0.45;
    const yLabels = [0, 250, 500, 750, 1000];

    return (
      <View style={{ flexDirection: 'row', paddingTop: 16 }}>
        {/* Y-axis */}
        <View style={{ height: chartH, justifyContent: 'space-between', alignItems: 'flex-end', width: 35, marginRight: 8 }}>
          {[...yLabels].reverse().map((v, i) => (
            <Text key={i} style={styles.axisText}>{v}</Text>
          ))}
        </View>
        <View>
          <Svg width={chartW} height={chartH}>
            {yLabels.map((v, i) => {
              const y = chartH - (v / maxVal) * chartH;
              return <Line key={i} x1="0" y1={y} x2={chartW} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />;
            })}
            {deptData.map((item, i) => {
              const barH = (item.value / maxVal) * chartH;
              const x = i * (barWidth + gap) + gap / 2;
              const y = chartH - barH;
              return (
                <Rect key={i} x={x} y={y} width={barWidth} height={barH} fill="#6366f1" rx={4} />
              );
            })}
          </Svg>
          {/* X-axis Labels */}
          <View style={{ flexDirection: 'row', width: chartW, marginTop: 6 }}>
            {deptData.map((item, i) => (
              <View key={i} style={{ width: barWidth + gap, alignItems: 'center' }}>
                <Text style={styles.axisText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Revenue Line Chart Component
  const LineChart = () => {
    const chartW = width - 100;
    const chartH = 120;
    const minVal = 20;
    const maxVal = 60;
    const yLabels = [60, 45, 30];

    const points = revenueData.map((v, i) => ({
      x: (i / (revenueData.length - 1)) * chartW,
      y: chartH - ((v - minVal) / (maxVal - minVal)) * chartH,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPath = `M 0,${chartH} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${chartW},${chartH} Z`;

    return (
      <View style={{ flexDirection: 'row', paddingTop: 16 }}>
        <View style={{ height: chartH, justifyContent: 'space-between', alignItems: 'flex-end', width: 35, marginRight: 8 }}>
          {yLabels.map((v, i) => (
            <Text key={i} style={styles.axisText}>{v}</Text>
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
            const y = chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
            return <Line key={i} x1="0" y1={y} x2={chartW} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />;
          })}
          <Path d={areaPath} fill="url(#revGradient)" />
          <Path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />
          {points.map((p, i) => (
            <Rect key={i} x={p.x - 5} y={p.y - 5} width={10} height={10} rx={5} fill="#10b981" />
          ))}
        </Svg>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Admin Dashboard</Text>
          <Text style={styles.headerTitle}>EduConnect College</Text>
          <Text style={styles.headerSubtitle}>Management Overview</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <LinearGradient key={i} colors={item.colors} style={styles.statCard}>
                <Icon color="#ffffff" size={24} style={{ marginBottom: 12 }} />
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>{item.change}</Text>
                </View>
              </LinearGradient>
            );
          })}
        </View>

        {/* Students by Department */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Students by Department</Text>
          <BarChart />
        </View>

        {/* Revenue Trend */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Revenue Trend (Lakhs)</Text>
          <LineChart />
        </View>

        {/* Recent Notices */}
        <View style={styles.sectionCard}>
          <View style={styles.noticeHeader}>
            <Bell color="#ea580c" size={20} />
            <Text style={styles.sectionTitle}> Recent Notices</Text>
          </View>
          {notices.map((n, i) => (
            <View key={i} style={styles.noticeItem}>
              <FileText color="#6366f1" size={18} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.noticeTitle}>{n.title}</Text>
                <Text style={styles.noticeDate}>{n.date}</Text>
              </View>
            </View>
          ))}
          <LinearGradient colors={['#6366f1', '#a855f7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.manageNoticesBtn}>
            <Text style={styles.manageNoticesText}>Manage Notices</Text>
          </LinearGradient>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Users color="#6366f1" size={28} style={{ marginBottom: 8 }} />
            <Text style={styles.quickActionText}>Manage Students</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Settings color="#a855f7" size={28} style={{ marginBottom: 8 }} />
            <Text style={styles.quickActionText}>Manage Staff</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#6b7280' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24 },
  statCard: {
    width: '47%', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 10 },
  statBadge: { backgroundColor: 'rgba(0,0,0,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  chartCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 },
  axisText: { fontSize: 10, color: '#64748b' },
  sectionCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  noticeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  noticeItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc',
    borderRadius: 10, padding: 14, marginBottom: 10,
  },
  noticeTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 2 },
  noticeDate: { fontSize: 12, color: '#64748b' },
  manageNoticesBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  manageNoticesText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  quickActions: { flexDirection: 'row', gap: 14, marginBottom: 0 },
  quickActionCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  quickActionText: { fontSize: 14, fontWeight: '600', color: '#111827' },
});
