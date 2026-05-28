import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Card, Chips, Divider, Gauge, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ─────────────────────────────────────────────
//  Types & Mock data
// ─────────────────────────────────────────────
type TaskStatus = 'Open' | 'In Progress' | 'Delayed' | 'Completed' | 'Escalated';
type TaskType = 'Production' | 'QC' | 'Maintenance' | 'Packing' | 'Dispatch' | 'Stock Verification';
type Shift = 'Shift A' | 'Shift B' | 'Shift C';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

type WorkTask = {
  id: string;
  title: string;
  type: TaskType;
  shift: Shift;
  department: string;
  team: string;
  supervisor: string;
  workerCount: number;
  priority: Priority;
  status: TaskStatus;
  startTime: string;
  dueTime: string;
  completedPct: number;
  note?: string;
};

const tasks: WorkTask[] = [
  {
    id: 'TSK-101', title: 'Produce Batch B22 — Flanges 480 pcs', type: 'Production',
    shift: 'Shift A', department: 'Manufacturing', team: 'Line 2 Team',
    supervisor: 'Rohan Desai', workerCount: 8, priority: 'High',
    status: 'In Progress', startTime: '08:00', dueTime: '14:00', completedPct: 62,
  },
  {
    id: 'TSK-102', title: 'QC Inspection — Batch B21 (Bolts)', type: 'QC',
    shift: 'Shift A', department: 'Quality Control', team: 'QC Team A',
    supervisor: 'Kavitha Nair', workerCount: 3, priority: 'High',
    status: 'In Progress', startTime: '09:00', dueTime: '12:00', completedPct: 80,
  },
  {
    id: 'TSK-103', title: 'CNC Machine #3 Maintenance', type: 'Maintenance',
    shift: 'Shift A', department: 'Maintenance', team: 'Mech Team',
    supervisor: 'Prakash Jadhav', workerCount: 2, priority: 'Critical',
    status: 'Delayed', startTime: '07:00', dueTime: '10:00', completedPct: 30,
    note: 'Spare part (bearing) awaited from store',
  },
  {
    id: 'TSK-104', title: 'Pack Order ORD-1024 (Tata Forge)', type: 'Packing',
    shift: 'Shift A', department: 'Dispatch', team: 'Packing Unit 1',
    supervisor: 'Sunil Patil', workerCount: 4, priority: 'Critical',
    status: 'In Progress', startTime: '10:00', dueTime: '13:00', completedPct: 65,
  },
  {
    id: 'TSK-105', title: 'Dispatch Document Prep — DIS-002', type: 'Dispatch',
    shift: 'Shift A', department: 'Dispatch', team: 'Dispatch Desk',
    supervisor: 'Sunil Patil', workerCount: 1, priority: 'High',
    status: 'Open', startTime: '11:00', dueTime: '12:30', completedPct: 0,
  },
  {
    id: 'TSK-106', title: 'Stock Verification — Steel Coil 4mm', type: 'Stock Verification',
    shift: 'Shift A', department: 'Warehouse', team: 'Stores Team',
    supervisor: 'Anil Kumar', workerCount: 2, priority: 'Medium',
    status: 'Open', startTime: '11:30', dueTime: '13:00', completedPct: 0,
  },
  {
    id: 'TSK-201', title: 'Produce Batch B23 — Washers 2000 pcs', type: 'Production',
    shift: 'Shift B', department: 'Manufacturing', team: 'Line 1 Team',
    supervisor: 'Vijay More', workerCount: 6, priority: 'Medium',
    status: 'Open', startTime: '16:00', dueTime: '22:00', completedPct: 0,
  },
  {
    id: 'TSK-202', title: 'QC Batch B22 Final Inspection', type: 'QC',
    shift: 'Shift B', department: 'Quality Control', team: 'QC Team B',
    supervisor: 'Meena Joshi', workerCount: 2, priority: 'High',
    status: 'Open', startTime: '15:00', dueTime: '16:30', completedPct: 0,
  },
  {
    id: 'TSK-301', title: 'Night Shift Production Run — Shafts', type: 'Production',
    shift: 'Shift C', department: 'Manufacturing', team: 'Line 3 Team',
    supervisor: 'Santosh Patil', workerCount: 7, priority: 'Medium',
    status: 'Open', startTime: '00:00', dueTime: '06:00', completedPct: 0,
  },
  {
    id: 'TSK-110', title: 'Pack Orders ORD-1031 (Bosch)', type: 'Packing',
    shift: 'Shift A', department: 'Dispatch', team: 'Packing Unit 2',
    supervisor: 'Sunil Patil', workerCount: 3, priority: 'High',
    status: 'Completed', startTime: '08:00', dueTime: '11:00', completedPct: 100,
  },
];

const DEPT_FILTERS = ['All', 'Manufacturing', 'Quality Control', 'Maintenance', 'Dispatch', 'Warehouse'];
const SHIFTS: Shift[] = ['Shift A', 'Shift B', 'Shift C'];
const TASK_TYPES: TaskType[] = ['Production', 'QC', 'Maintenance', 'Packing', 'Dispatch', 'Stock Verification'];

const statusTone: Record<TaskStatus, string> = {
  'Open': 'info', 'In Progress': 'primary', 'Delayed': 'danger', 'Completed': 'success', 'Escalated': 'orange',
};
const priorityTone: Record<Priority, string> = {
  Critical: 'danger', High: 'orange', Medium: 'warning', Low: 'steel',
};
const typeIcon: Record<TaskType, string> = {
  Production: '⚙️', QC: '🔬', Maintenance: '🔧', Packing: '📦', Dispatch: '🚛', 'Stock Verification': '🗂',
};

// ─────────────────────────────────────────────
//  Task Card
// ─────────────────────────────────────────────
const TaskCard: React.FC<{ task: WorkTask }> = ({ task }) => {
  const [showNote, setShowNote] = useState(false);
  const isDelayed = task.status === 'Delayed';
  return (
    <Card style={[styles.taskCard, isDelayed && { borderWidth: 1, borderColor: colors.danger }]}>
      {isDelayed && (
        <View style={styles.delayBanner}>
          <Text style={styles.delayBannerText}>⚠ DELAYED — Needs Attention</Text>
        </View>
      )}
      <View style={styles.taskHeader}>
        <Text style={styles.typeIcon}>{typeIcon[task.type]}</Text>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <View style={styles.idRow}>
            <Text style={styles.taskId}>{task.id}</Text>
            <Badge text={task.priority} tone={priorityTone[task.priority]} dot />
          </View>
          <Text style={[typography.body, { fontWeight: '700', marginTop: 2 }]}>{task.title}</Text>
        </View>
        <Badge text={task.status} tone={statusTone[task.status]} />
      </View>

      <Divider style={{ marginVertical: spacing.sm }} />

      <View style={styles.taskMeta}>
        <View style={styles.metaItem}>
          <Text style={typography.micro}>SHIFT</Text>
          <Text style={styles.metaVal}>{task.shift}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={typography.micro}>TEAM</Text>
          <Text style={styles.metaVal}>{task.team}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={typography.micro}>SUPERVISOR</Text>
          <Text style={styles.metaVal}>{task.supervisor}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={typography.micro}>WORKERS</Text>
          <Text style={styles.metaVal}>{task.workerCount} assigned</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={typography.micro}>WINDOW</Text>
          <Text style={styles.metaVal}>{task.startTime} – {task.dueTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={typography.micro}>DEPT</Text>
          <Text style={styles.metaVal}>{task.department}</Text>
        </View>
      </View>

      {/* Progress */}
      {task.status !== 'Open' && (
        <View style={{ marginTop: spacing.sm }}>
          <View style={styles.progressLabel}>
            <Text style={typography.micro}>PROGRESS</Text>
            <Text style={[typography.micro, { color: task.completedPct === 100 ? colors.success : colors.textMuted }]}>
              {task.completedPct}%
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${task.completedPct}%`,
                  backgroundColor:
                    task.completedPct === 100 ? colors.success :
                    isDelayed ? colors.danger : colors.primary,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Note */}
      {task.note && (
        <TouchableOpacity onPress={() => setShowNote((v) => !v)} style={styles.noteToggle}>
          <Text style={[typography.small, { color: colors.warning }]}>
            📝 {showNote ? 'Hide note' : 'Show note'}
          </Text>
        </TouchableOpacity>
      )}
      {task.note && showNote && (
        <View style={styles.noteBlock}>
          <Text style={[typography.bodyMuted, { fontStyle: 'italic' }]}>{task.note}</Text>
        </View>
      )}

      {/* Quick actions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
        <View style={styles.actionsRow}>
          {task.status !== 'Completed' && (
            <Button label="✓ Complete" variant="primary" small style={styles.actionBtn} />
          )}
          <Button label="↪ Reassign" variant="secondary" small style={styles.actionBtn} />
          <Button label="🔺 Escalate" variant="danger" small style={styles.actionBtn} />
          <Button label="📝 Add Note" variant="ghost" small style={styles.actionBtn} />
        </View>
      </ScrollView>
    </Card>
  );
};

// ─────────────────────────────────────────────
//  Supervisor Card
// ─────────────────────────────────────────────
const SupervisorCard: React.FC<{
  name: string; role: string; dept: string; tasks: number; completed: number;
}> = ({ name, role, dept, tasks, completed }) => (
  <Card style={styles.supCard}>
    <View style={styles.supAvatar}>
      <Text style={styles.supInitials}>{name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
    </View>
    <Text style={[typography.body, { fontWeight: '700', textAlign: 'center', marginTop: spacing.sm }]}>
      {name}
    </Text>
    <Text style={[typography.micro, { textAlign: 'center', marginTop: 2 }]}>{role}</Text>
    <Text style={[typography.micro, { textAlign: 'center', color: colors.primary }]}>{dept}</Text>
    <View style={styles.supStats}>
      <View style={styles.supStat}>
        <Text style={[styles.supStatVal, { color: colors.primary }]}>{tasks}</Text>
        <Text style={typography.micro}>Tasks</Text>
      </View>
      <View style={styles.supStat}>
        <Text style={[styles.supStatVal, { color: colors.success }]}>{completed}</Text>
        <Text style={typography.micro}>Done</Text>
      </View>
    </View>
  </Card>
);

// ─────────────────────────────────────────────
//  Worker Count Summary
// ─────────────────────────────────────────────
const WorkerSummary: React.FC<{ shift: Shift; allTasks: WorkTask[] }> = ({ shift, allTasks }) => {
  const shiftTasks = allTasks.filter((t) => t.shift === shift);
  const totalWorkers = shiftTasks.reduce((s, t) => s + t.workerCount, 0);
  const deptBreakdown: Record<string, number> = {};
  shiftTasks.forEach((t) => {
    deptBreakdown[t.department] = (deptBreakdown[t.department] || 0) + t.workerCount;
  });
  return (
    <Card style={styles.workerCard}>
      <View style={styles.workerHeader}>
        <Text style={typography.h3}>{shift} · Workforce</Text>
        <Badge text={`${totalWorkers} workers`} tone="primary" />
      </View>
      <View style={styles.workerGrid}>
        {Object.entries(deptBreakdown).map(([dept, count]) => (
          <View key={dept} style={styles.workerItem}>
            <Text style={styles.workerCount}>{count}</Text>
            <Text style={[typography.micro, { textAlign: 'center' }]}>{dept}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

// ─────────────────────────────────────────────
//  Advanced Blocks
// ─────────────────────────────────────────────
const AdvancedBlocks: React.FC<{ allTasks: WorkTask[] }> = ({ allTasks }) => {
  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === 'Completed').length;
  const delayed = allTasks.filter((t) => t.status === 'Delayed').length;
  const inProgress = allTasks.filter((t) => t.status === 'In Progress').length;
  const productivity = Math.round((completed / total) * 100);

  return (
    <View>
      <SectionTitle title="Workforce Intelligence" />

      {/* Productivity score */}
      <Card style={styles.advCard}>
        <View style={styles.productivityRow}>
          <View style={{ flex: 1 }}>
            <Text style={typography.h3}>Task Productivity Score</Text>
            <Text style={[typography.bodyMuted, { marginTop: 4 }]}>
              {completed} of {total} tasks completed today
            </Text>
          </View>
          <View style={styles.productivityBadge}>
            <Text style={styles.productivityVal}>{productivity}%</Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <Gauge value={productivity} label="Completion Rate" color={colors.accent} />
        </View>
        <View style={styles.taskStatusRow}>
          {[
            { label: 'Open', count: allTasks.filter((t) => t.status === 'Open').length, color: colors.info },
            { label: 'In Progress', count: inProgress, color: colors.primary },
            { label: 'Delayed', count: delayed, color: colors.danger },
            { label: 'Done', count: completed, color: colors.success },
          ].map((s) => (
            <View key={s.label} style={[styles.taskStatusItem, { borderTopColor: s.color }]}>
              <Text style={[styles.taskStatusCount, { color: s.color }]}>{s.count}</Text>
              <Text style={typography.micro}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Shift performance comparison */}
      <Card style={styles.advCard}>
        <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Shift Performance</Text>
        {([
          { shift: 'Shift A (08–16)', tasks: 8, done: 2, delayed: 1 },
          { shift: 'Shift B (16–00)', tasks: 2, done: 0, delayed: 0 },
          { shift: 'Shift C (00–08)', tasks: 1, done: 0, delayed: 0 },
        ] as const).map((s) => (
          <View key={s.shift} style={styles.shiftRow}>
            <Text style={[typography.body, { width: 110 }]}>{s.shift}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(s.done / Math.max(s.tasks, 1)) * 100}%`, backgroundColor: colors.accent },
                  ]}
                />
              </View>
            </View>
            <Text style={[typography.small, { width: 60, textAlign: 'right' }]}>
              {s.done}/{s.tasks}
            </Text>
            {s.delayed > 0 && (
              <Badge text={`${s.delayed}▲`} tone="danger" style={{ marginLeft: 4 }} />
            )}
          </View>
        ))}
      </Card>

      {/* Manpower shortage alert */}
      {delayed > 0 && (
        <Card style={[styles.advCard, { backgroundColor: colors.dangerBg }]}>
          <View style={styles.alertHeader}>
            <Text style={[typography.h3, { color: colors.danger }]}>🚨 Manpower Shortage Alert</Text>
            <Badge text={`${delayed} Delayed`} tone="danger" />
          </View>
          {allTasks.filter((t) => t.status === 'Delayed').map((t) => (
            <View key={t.id} style={styles.alertItem}>
              <Text style={[typography.body, { color: colors.danger }]}>{t.id} — {t.title}</Text>
              <Text style={typography.bodyMuted}>
                {t.team} · {t.workerCount} workers · {t.supervisor}
                {t.note ? `\n⚠ ${t.note}` : ''}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* Workload balancing suggestion */}
      <Card style={[styles.advCard, { borderLeftWidth: 3, borderLeftColor: colors.primary }]}>
        <View style={styles.balanceHeader}>
          <Text style={typography.h3}>💡 Workload Balancing Suggestion</Text>
          <Badge text="AI" tone="primary" />
        </View>
        <Text style={[typography.bodyMuted, { marginTop: spacing.sm }]}>
          Maintenance team has only 2 workers on TSK-103 while Packing Unit 2 has 3 idle workers
          post TSK-110 completion. <Text style={{ color: colors.primary, fontWeight: '700' }}>
          Reassign 1 worker from Packing Unit 2 to TSK-103
          </Text> to resolve the CNC delay.
        </Text>
        <View style={styles.balanceActions}>
          <Button label="Apply Suggestion" variant="primary" small />
          <Button label="Dismiss" variant="ghost" small />
        </View>
      </Card>
    </View>
  );
};

// ─────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────
export const TeamTasksScreen: React.FC = () => {
  const { pop } = useNav();
  const [activeShift, setActiveShift] = useState<Shift>('Shift A');
  const [activeDept, setActiveDept] = useState('All');
  const [activeType, setActiveType] = useState<string>('All');

  const shiftTasks = tasks.filter((t) => t.shift === activeShift);
  const deptFiltered = activeDept === 'All' ? shiftTasks : shiftTasks.filter((t) => t.department === activeDept);
  const typeFiltered = activeType === 'All' ? deptFiltered : deptFiltered.filter((t) => t.type === activeType);

  const supervisors = Array.from(
    new Map(
      shiftTasks.map((t) => [t.supervisor, { name: t.supervisor, role: 'Supervisor', dept: t.department,
        tasks: shiftTasks.filter((x) => x.supervisor === t.supervisor).length,
        completed: shiftTasks.filter((x) => x.supervisor === t.supervisor && x.status === 'Completed').length,
      }])
    ).values()
  );

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Team Tasks"
        subtitle="Workforce Operations"
        showBack
        rightIcon="+"
      />

      {/* Quick action bar */}
      <View style={styles.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { icon: '👤', label: 'Assign Task' },
            { icon: '↪', label: 'Reassign' },
            { icon: '🔺', label: 'Escalate' },
            { icon: '✅', label: 'Mark Complete' },
            { icon: '📝', label: 'Add Note' },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.qAction} activeOpacity={0.8}>
              <Text style={styles.qIcon}>{a.icon}</Text>
              <Text style={styles.qLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Shift selector */}
        <View style={styles.shiftSelector}>
          {SHIFTS.map((s) => {
            const active = s === activeShift;
            const count = tasks.filter((t) => t.shift === s).length;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setActiveShift(s)}
                style={[styles.shiftBtn, active && styles.shiftBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.shiftText, active && styles.shiftTextActive]}>{s}</Text>
                <View style={[styles.shiftCount, active && styles.shiftCountActive]}>
                  <Text style={[styles.shiftCountText, active && { color: colors.primary }]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Worker summary */}
        <WorkerSummary shift={activeShift} allTasks={tasks} />

        {/* Supervisors */}
        <SectionTitle title="Supervisors" subtitle={`${activeShift} leadership`} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.supRow}>
            {supervisors.map((s) => (
              <SupervisorCard key={s.name} {...s} />
            ))}
          </View>
        </ScrollView>

        {/* Department filter */}
        <SectionTitle title="Tasks" subtitle={`${typeFiltered.length} tasks in ${activeShift}`} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
          <View style={styles.chipContainer}>
            {DEPT_FILTERS.map((d) => {
              const active = d === activeDept;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setActiveDept(d)}
                  style={[styles.chipBtn, active && styles.chipBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Task type filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
          <View style={styles.chipContainer}>
            {['All', ...TASK_TYPES].map((type) => {
              const active = type === activeType;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setActiveType(type)}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  activeOpacity={0.8}
                >
                  {type !== 'All' && (
                    <Text style={styles.typeChipIcon}>{typeIcon[type as TaskType]}</Text>
                  )}
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Task cards */}
        {typeFiltered.length === 0 ? (
          <Card style={styles.empty}>
            <Text style={[typography.bodyMuted, { textAlign: 'center' }]}>
              No tasks matching current filters.
            </Text>
          </Card>
        ) : (
          typeFiltered.map((task) => <TaskCard key={task.id} task={task} />)
        )}

        <AdvancedBlocks allTasks={tasks} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  quickBar: {
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  qAction: { alignItems: 'center', marginRight: spacing.lg, minWidth: 60 },
  qIcon: { fontSize: 20 },
  qLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 3 },
  shiftSelector: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm },
  shiftBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.sm, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    gap: 6,
  },
  shiftBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  shiftText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  shiftTextActive: { color: '#fff' },
  shiftCount: {
    backgroundColor: colors.border, borderRadius: radius.pill,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  shiftCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  shiftCountText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  workerCard: { marginTop: spacing.md },
  workerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  workerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  workerItem: {
    alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.sm,
    padding: spacing.sm, minWidth: 80,
  },
  workerCount: { fontSize: 20, fontWeight: '900', color: colors.primary },
  supRow: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  supCard: {
    width: 130, alignItems: 'center', padding: spacing.md,
  },
  supAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  supInitials: { color: '#fff', fontSize: 16, fontWeight: '900' },
  supStats: { flexDirection: 'row', marginTop: spacing.sm, gap: spacing.md },
  supStat: { alignItems: 'center' },
  supStatVal: { fontSize: 18, fontWeight: '900' },
  chipContainer: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  chipBtn: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.pill, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  chipBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.pill, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  typeChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typeChipIcon: { fontSize: 12 },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  taskCard: { marginTop: spacing.md },
  delayBanner: {
    backgroundColor: colors.dangerBg, marginHorizontal: -spacing.lg, marginTop: -spacing.lg,
    marginBottom: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs,
    borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
  },
  delayBannerText: { fontSize: 11, fontWeight: '700', color: colors.danger },
  taskHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  typeIcon: { fontSize: 22, marginTop: 2 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  taskId: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  taskMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  metaItem: { width: '50%', marginBottom: spacing.sm },
  metaVal: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressBg: { height: 6, borderRadius: 4, backgroundColor: colors.divider, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  noteToggle: { marginTop: spacing.sm, paddingVertical: spacing.xs },
  noteBlock: {
    backgroundColor: colors.warningBg, borderRadius: radius.sm,
    padding: spacing.sm, marginTop: spacing.xs,
  },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { marginRight: 4 },
  empty: { marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.xxl },
  advCard: { marginTop: spacing.md },
  productivityRow: { flexDirection: 'row', alignItems: 'center' },
  productivityBadge: {
    width: 60, height: 60, borderRadius: radius.lg,
    backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center',
  },
  productivityVal: { fontSize: 18, fontWeight: '900', color: colors.accent },
  taskStatusRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm },
  taskStatusItem: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.sm,
    padding: spacing.sm, borderTopWidth: 3, alignItems: 'center',
  },
  taskStatusCount: { fontSize: 20, fontWeight: '900' },
  shiftRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  alertHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm,
  },
  alertItem: {
    paddingVertical: spacing.sm, borderBottomWidth: 1,
    borderBottomColor: 'rgba(220,38,38,0.2)',
  },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
