import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

export default function AttendanceScreen() {
  const subjects = [
    { name: 'Data Structures', present: 42, total: 48, percentage: 87.5, colors: ['#3b82f6', '#2563eb'] },
    { name: 'Web Development', present: 38, total: 42, percentage: 90.5, colors: ['#22c55e', '#16a34a'] },
    { name: 'Database Systems', present: 35, total: 45, percentage: 77.8, colors: ['#f97316', '#ea580c'] },
    { name: 'Computer Networks', present: 40, total: 44, percentage: 90.9, colors: ['#a855f7', '#9333ea'] },
    { name: 'Operating Systems', present: 32, total: 46, percentage: 69.6, colors: ['#ef4444', '#dc2626'] },
    { name: 'Software Engineering', present: 41, total: 45, percentage: 91.1, colors: ['#6366f1', '#4f46e5'] },
  ];

  const overallPercentage =
    subjects.reduce((acc, sub) => acc + sub.percentage, 0) / subjects.length;

  const CircularProgress = ({ percentage, size = 80, isOverall = false }: { percentage: number; size?: number, isOverall?: boolean }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    let strokeColor = '#22c55e'; // green-500
    if (percentage < 75 && percentage >= 65) strokeColor = '#f97316'; // orange-500
    if (percentage < 65) strokeColor = '#ef4444'; // red-500

    if (isOverall) {
      strokeColor = '#22c55e'; // Overall progress bar is green in design
    }

    return (
      <View style={{ width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isOverall ? 'rgba(255,255,255,0.2)' : '#e5e7eb'}
            strokeWidth="8"
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Calendar color="#111827" size={28} />
            <Text style={styles.title}>Attendance</Text>
          </View>
          <Text style={styles.subtitle}>Track your class attendance</Text>
        </View>

        <LinearGradient
          colors={['#2563eb', '#9333ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overallCard}
        >
          <View style={styles.overallContent}>
            <View>
              <Text style={styles.overallLabel}>Overall Attendance</Text>
              <Text style={styles.overallValue}>{overallPercentage.toFixed(1)}%</Text>
              <View style={styles.statusRow}>
                {overallPercentage >= 75 ? (
                  <>
                    <TrendingUp color="#ffffff" size={16} />
                    <Text style={styles.statusText}>Good Standing</Text>
                  </>
                ) : (
                  <>
                    <TrendingDown color="#ffffff" size={16} />
                    <Text style={styles.statusText}>Needs Improvement</Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.overallProgressContainer}>
              <CircularProgress percentage={overallPercentage} size={90} isOverall={true} />
              <View style={styles.overallProgressTextContainer}>
                <Text style={styles.overallProgressText}>{overallPercentage.toFixed(0)}%</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.subjectsList}>
          {subjects.map((subject, idx) => (
            <View key={idx} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectClasses}>
                    {subject.present} / {subject.total} classes
                  </Text>
                </View>
                <View style={styles.subjectProgressContainer}>
                  <CircularProgress percentage={subject.percentage} size={50} />
                  <View style={styles.subjectProgressTextContainer}>
                    <Text style={styles.subjectProgressText}>{subject.percentage.toFixed(0)}%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.progressBarBackground}>
                <LinearGradient
                  colors={subject.colors as [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${subject.percentage}%` }]}
                />
              </View>

              <View style={styles.subjectFooter}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                  <Text style={styles.legendText}>Present: {subject.present}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.legendText}>Absent: {subject.total - subject.present}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  overallCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  overallContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  overallValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  overallProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallProgressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallProgressText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    transform: [{ rotate: '90deg' }] // counter the parent -90deg rotation to keep text upright
  },
  subjectsList: {
    gap: 16,
  },
  subjectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subjectClasses: {
    fontSize: 14,
    color: '#6b7280',
  },
  subjectProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectProgressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    transform: [{ rotate: '90deg' }] // counter the parent -90deg rotation to keep text upright
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  subjectFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#4b5563',
  },
});
