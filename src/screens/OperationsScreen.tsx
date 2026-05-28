import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Card, SectionTitle } from '../components/UI';
import { approvals, productionSummary, purchaseRequests, teamTasks } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TILES = [
  { id: 'pp',  label: 'Production Planning', sub: '24 jobs scheduled',  icon: '🗓️', screen: 'ProductionPlan' },
  { id: 'inv', label: 'Inventory Movement',  sub: '12 today',           icon: '📦', screen: 'Inventory' },
  { id: 'pr',  label: 'Purchase Requests',   sub: '3 pending approval', icon: '🛒', screen: 'Procurement' },
  { id: 'dq',  label: 'Dispatch Queue',      sub: '6 due today',        icon: '🚚', screen: 'Dispatch' },
  { id: 'tt',  label: 'Team Tasks',          sub: '5 open · 1 critical',icon: '✅', screen: 'Tasks' },
  { id: 'ap',  label: 'Approval Center',     sub: '4 awaiting you',     icon: '🛡️', screen: 'Approvals' },
];

export const OperationsScreen: React.FC = () => {
  const { push } = useNav();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <Text style={typography.display}>Operations</Text>
      <Text style={[typography.bodyMuted, { marginBottom: spacing.lg }]}>
        Plan, execute and govern the factory floor.
      </Text>

      {/* Summary band */}
      <Card style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Mini n={`${productionSummary.runningJobs}`}  l="Running Jobs" />
          <Div />
          <Mini n={`${productionSummary.delayedJobs}`}  l="Delayed" tone="danger" />
          <Div />
          <Mini n={`${productionSummary.utilization}%`} l="Utilization" />
          <Div />
          <Mini n={`${productionSummary.rejection}%`}   l="Reject %" />
        </View>
      </Card>

      <SectionTitle title="Modules" subtitle="Operational areas you can access" />
      <View style={styles.grid}>
        {TILES.map((t) => (
          <TouchableOpacity
            key={t.id}
            activeOpacity={0.85}
            style={styles.tile}
            onPress={() => push(t.screen as any)}
          >
            <View style={styles.tileIcon}><Text style={{ fontSize: 22 }}>{t.icon}</Text></View>
            <Text style={styles.tileTitle}>{t.label}</Text>
            <Text style={styles.tileSub}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="Pending approvals" action="Open all" onAction={() => push('Approvals')} />
      {approvals.slice(0, 3).map((a) => (
        <Card key={a.id} style={{ marginBottom: 10 }} onPress={() => push('Approvals')}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>{a.type} · {a.ref}</Text>
              <Text style={typography.small}>By {a.raisedBy} · For {a.level}</Text>
            </View>
            <Badge text={a.value} tone="primary" />
          </View>
        </Card>
      ))}

      <SectionTitle title="My team's tasks" action="View all" onAction={() => push('Tasks')} />
      {teamTasks.slice(0, 4).map((t) => (
        <Card key={t.id} style={{ marginBottom: 10 }} onPress={() => push('Tasks')}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3} numberOfLines={1}>{t.title}</Text>
              <Text style={typography.small}>{t.assignee} · Due {t.due}</Text>
            </View>
            <Badge
              text={t.priority}
              tone={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'steel'}
            />
          </View>
        </Card>
      ))}

      <SectionTitle title="Latest purchase requests" action="View all" onAction={() => push('Procurement')} />
      {purchaseRequests.map((p) => (
        <Card key={p.id} style={{ marginBottom: 10 }} onPress={() => push('Procurement')}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>{p.id} · {p.item}</Text>
              <Text style={typography.small}>{p.qty} · By {p.requester} · Need {p.required}</Text>
            </View>
            <Badge text={p.urgency} tone={p.urgency === 'High' ? 'danger' : p.urgency === 'Medium' ? 'warning' : 'steel'} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

const Mini: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: '900', color: tone === 'danger' ? colors.danger : colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700', marginTop: 2 }}>{l}</Text>
  </View>
);
const Div: React.FC = () => <View style={{ width: 1, height: 28, backgroundColor: colors.divider, alignSelf: 'center' }} />;

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  tileIcon: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  tileTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  tileSub: { fontSize: 11, color: colors.textMuted, marginTop: 2, fontWeight: '600' },
});
