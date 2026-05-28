import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Card, Chips, Progress, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { machines, maintenanceLog } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const UPCOMING = [
  { id: 'U1', machine: 'CNC Lathe #3', type: 'Corrective',   due: 'Today',     priority: 'High',   tech: 'R. Patil' },
  { id: 'U2', machine: 'Furnace #2',   type: 'Preventive',   due: 'Tomorrow',  priority: 'Medium', tech: 'A. Khan'  },
  { id: 'U3', machine: 'Lathe #2',     type: 'Sensor Fix',   due: 'Today',     priority: 'High',   tech: 'S. Kale'  },
  { id: 'U4', machine: 'VMC #1',       type: 'Preventive',   due: '25 Apr',    priority: 'Low',    tech: 'R. Patil' },
  { id: 'U5', machine: 'CNC Lathe #5', type: 'Calibration',  due: '28 Apr',    priority: 'Low',    tech: 'M. Singh' },
];

const AI_SUGGESTIONS = [
  { id: 'ai1', tag: 'ANOMALY',   text: 'CNC-03 vibration pattern indicates bearing wear. Schedule replacement in 72h.' },
  { id: 'ai2', tag: 'OPTIMIZE',  text: 'Furnace #2 scheduled maintenance can be combined with CNC-03 for cost savings.' },
  { id: 'ai3', tag: 'RISK',      text: 'Lathe #2 sensor fault if unresolved will impact Line D output by ~30%.' },
];

const CATS = ['All', 'Upcoming', 'In Progress', 'Completed'];

export const MaintenanceScreen: React.FC = () => {
  const { push } = useNav();
  const [filter, setFilter] = useState('All');

  const pending = UPCOMING.filter(u => u.priority === 'High').length;
  const totalMachines = machines.length;
  const running = machines.filter(m => m.status === 'Running').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Maintenance" subtitle="Scheduled & corrective maintenance" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>

        {/* Summary */}
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <SummaryItem n={String(pending)}        l="Due Today"    tone={colors.danger} />
            <Divider />
            <SummaryItem n="2"                      l="In Progress"  tone={colors.warning} />
            <Divider />
            <SummaryItem n={`${running}/${totalMachines}`} l="Running" tone={colors.success} />
            <Divider />
            <SummaryItem n="3"                      l="Completed"    tone={colors.accent} />
          </View>
        </Card>

        {/* AI suggestions */}
        <SectionTitle title="AI maintenance insights" subtitle="Predictive alerts from sensor data" />
        {AI_SUGGESTIONS.map((ai) => (
          <Card key={ai.id} style={[styles.aiCard, { marginBottom: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <View style={styles.aiTagWrap}>
                <Text style={styles.aiTag}>{ai.tag}</Text>
              </View>
              <Text style={{ fontSize: 14, marginLeft: 6 }}>✨</Text>
            </View>
            <Text style={typography.body}>{ai.text}</Text>
          </Card>
        ))}

        {/* Machine health overview */}
        <SectionTitle title="Machine health status" action="Machines" onAction={() => push('Machines')} />
        {machines.map((m) => (
          <Card key={m.id} style={{ marginBottom: 10 }} onPress={() => push('Machines')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={[styles.statusDot, {
                backgroundColor:
                  m.tone === 'danger'  ? colors.danger  :
                  m.tone === 'warning' ? colors.warning :
                  m.tone === 'success' ? colors.success :
                  colors.textSubtle,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>{m.name}</Text>
                <Text style={typography.small}>{m.line} · {m.status}</Text>
              </View>
              <Badge
                text={m.status}
                tone={m.tone === 'danger' ? 'danger' : m.tone === 'warning' ? 'warning' : m.tone === 'success' ? 'success' : 'steel'}
              />
            </View>
            <Row label="Utilization" value={`${m.util}%`} />
            <View style={{ marginTop: 8 }}>
              <Progress value={m.util} color={
                m.tone === 'danger'  ? colors.danger  :
                m.tone === 'warning' ? colors.warning :
                colors.success
              } height={6} />
            </View>
            <Row label="Next service" value={m.due} />
          </Card>
        ))}

        {/* Upcoming maintenance */}
        <SectionTitle title="Upcoming maintenance tasks" subtitle={`${UPCOMING.length} tasks scheduled`} />
        <View style={{ marginBottom: spacing.md }}>
          <Chips options={CATS} value={filter} onChange={setFilter} />
        </View>
        {UPCOMING.map((u) => (
          <Card key={u.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>{u.machine}</Text>
                <Text style={typography.small}>{u.type} · Tech: {u.tech}</Text>
              </View>
              <Badge
                text={u.priority}
                tone={u.priority === 'High' ? 'danger' : u.priority === 'Medium' ? 'warning' : 'steel'}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[typography.small, { color: u.due === 'Today' ? colors.danger : colors.textMuted }]}>
                Due: {u.due}
              </Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {/* Maintenance log */}
        <SectionTitle title="Recent maintenance log" />
        {maintenanceLog.map((log) => (
          <Card key={log.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={typography.h3}>{log.id} · {log.machine}</Text>
              <Badge text={log.type} tone="steel" />
            </View>
            <Row label="Technician" value={log.tech} />
            <Row label="Date"       value={log.date} />
            <Row label="Duration"   value={`${log.hours}h`} />
            <Row label="Cost"       value={`₹${log.cost.toLocaleString('en-IN')}`} />
          </Card>
        ))}

      </ScrollView>
    </View>
  );
};

const SummaryItem: React.FC<{ n: string; l: string; tone: string }> = ({ n, l, tone }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: '900', color: tone }}>{n}</Text>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700', marginTop: 2, textAlign: 'center' }}>{l}</Text>
  </View>
);
const Divider: React.FC = () => (
  <View style={{ width: 1, height: 30, backgroundColor: colors.divider, alignSelf: 'center' }} />
);

const styles = StyleSheet.create({
  aiCard: { borderLeftWidth: 3, borderLeftColor: colors.accent },
  aiTagWrap: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  aiTag: { fontSize: 9, fontWeight: '800', color: colors.accent, letterSpacing: 0.8 },
  statusDot: {
    width: 10, height: 10, borderRadius: 5, marginRight: 10,
  },
  actionBtn: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  actionBtnText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
