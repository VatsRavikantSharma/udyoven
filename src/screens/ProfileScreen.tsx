import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { company } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// --- Data --------------------------------------------------------------------

const FACTORY_UNITS = [
  { id: 'P1', name: 'Plant 1 — Pune',         type: 'CNC & Fabrication', staff: 48, capacity: '82%', status: 'Active' },
  { id: 'P2', name: 'Plant 2 — Coimbatore',   type: 'Casting & Forging',  staff: 31, capacity: '74%', status: 'Active' },
  { id: 'P3', name: 'Plant 3 — Surat',        type: 'Sheet Metal & Dies', staff: 26, capacity: '61%', status: 'Active' },
];

const USER_ROLES = [
  { role: 'Super Admin', count: 2, perms: 'Full access', color: '#7C3AED' },
  { role: 'Plant Manager', count: 3, perms: 'Plant + reports', color: '#1E3A8A' },
  { role: 'Production Supervisor', count: 6, perms: 'Production + QC', color: '#0D9488' },
  { role: 'Procurement Officer', count: 4, perms: 'Inventory + vendors', color: '#F97316' },
  { role: 'Accounts Manager', count: 3, perms: 'Invoices + payments', color: '#16A34A' },
  { role: 'QC Inspector', count: 8, perms: 'QC + reports', color: '#DC2626' },
  { role: 'Viewer', count: 12, perms: 'Read-only', color: '#64748B' },
];

const DEVICES = [
  { id: 'd1', name: 'CNC Sensors (Plant 1)', type: 'IoT — OPC-UA', status: 'Connected', count: 12 },
  { id: 'd2', name: 'Floor Cameras',         type: 'CCTV — RTSP',  status: 'Connected', count: 8  },
  { id: 'd3', name: 'MES Integration',       type: 'REST API',     status: 'Syncing',   count: 1  },
  { id: 'd4', name: 'ERP (SAP B1)',          type: 'ODBC Bridge',  status: 'Paused',    count: 1  },
];

const REPORT_PREFS = [
  { id: 'r1', label: 'Daily email digest',    desc: 'Sent at 08:00 every morning' },
  { id: 'r2', label: 'Weekly PDF to managers', desc: 'Sent every Monday 07:00'    },
  { id: 'r3', label: 'Monthly board summary',  desc: 'Sent on 1st of each month'  },
];

const APPROVAL_FLOWS = [
  { id: 'af1', label: 'Purchase Order > RS50,000', approvers: 'Plant Mgr + CFO' },
  { id: 'af2', label: 'New Vendor Onboarding',     approvers: 'Procurement + MD'  },
  { id: 'af3', label: 'Production Plan Change',    approvers: 'Plant Mgr'          },
  { id: 'af4', label: 'Quotation > RS2L',          approvers: 'Sales Head + MD'   },
];

// --- Sub-components ----------------------------------------------------------

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title, subtitle, children,
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionCardHeader}>
      <View>
        <Text style={typography.h3}>{title}</Text>
        {subtitle ? <Text style={typography.small}>{subtitle}</Text> : null}
      </View>
    </View>
    {children}
  </View>
);

const ToggleRow: React.FC<{ label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }> = ({
  label, sub, value, onChange,
}) => (
  <View style={styles.toggleRow}>
    <View style={{ flex: 1 }}>
      <Text style={typography.body}>{label}</Text>
      {sub ? <Text style={typography.small}>{sub}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.border, true: colors.accent + '88' }}
      thumbColor={value ? colors.accent : colors.steelLight}
    />
  </View>
);

const AdminActionBtn: React.FC<{ icon: string; label: string; onPress: () => void }> = ({
  icon, label, onPress,
}) => (
  <TouchableOpacity style={styles.adminBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.adminBtnIcon}>{icon}</Text>
    <Text style={styles.adminBtnText}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Screen -------------------------------------------------------------

export const ProfileScreen: React.FC<{ tabMode?: boolean }> = ({ tabMode = false }) => {
  const { push, role, reset } = useNav();

  // Notification prefs
  const [notifPush, setNotifPush]       = useState(true);
  const [notifEmail, setNotifEmail]     = useState(true);
  const [notifSMS, setNotifSMS]         = useState(false);
  const [notifCritical, setNotifCritical] = useState(true);
  const [notifDaily, setNotifDaily]     = useState(true);

  // Report prefs toggles
  const [reportToggles, setReportToggles] = useState<Record<string, boolean>>({
    r1: true, r2: true, r3: false,
  });

  // Theme
  const [darkMode, setDarkMode]   = useState(false);
  const [compactMode, setCompact] = useState(false);

  // Security
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionLock, setSessionLock] = useState(true);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={typography.display}>Profile & Settings</Text>

      {/* ── User Card ─────────────────────────────────────────── */}
      <Card style={styles.userCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.avatar}><Text style={styles.avatarText}>RV</Text></View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={typography.h2}>Ravi Verma</Text>
            <Text style={typography.bodyMuted}>{role} · {company.name}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
              <Badge text="VERIFIED" tone="accent" dot />
              <Badge text="MFA ON" tone="success" />
              <Badge text="ADMIN" tone="primary" />
            </View>
          </View>
        </View>
        <Divider />
        <Row label="Employee ID" value="UDV-00214" />
        <Row label="Plant"       value={company.unit} />
        <Row label="Department"  value="Operations" />
        <Row label="Last login"  value="Today, 07:48" />
      </Card>

      {/* ── Company Profile ───────────────────────────────────── */}
      <SectionCard title="Company Profile" subtitle="Business details and branding">
        <View style={styles.companyLogo}>
          <Text style={styles.companyLogoText}>U</Text>
        </View>
        <Text style={[typography.h2, { marginBottom: 2 }]}>Udyoven Industries Pvt. Ltd.</Text>
        <Text style={typography.bodyMuted}>Precision Engineering &amp; Metal Fabrication</Text>
        <Divider />
        <Row label="GST Number"      value="27AABCU9603R1ZR" />
        <Row label="PAN"             value="AABCU9603R" />
        <Row label="Industry"        value="Manufacturing (MSME)" />
        <Row label="Founded"         value="2009 · Mumbai, India" />
        <Row label="Total Employees" value="105" />
        <Row label="Annual Turnover" value="RS12.4 Cr" />
        <View style={{ height: spacing.sm }} />
        <TouchableOpacity style={styles.editBtn} onPress={() => push('CompanyProfile' as any)}>
          <Text style={styles.editBtnText}>Edit Company Profile</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* ── Factory Units ─────────────────────────────────────── */}
      <SectionCard title="Factory Units" subtitle="3 active plants">
        {FACTORY_UNITS.map((u, i) => (
          <View
            key={u.id}
            style={[styles.unitRow, i !== FACTORY_UNITS.length - 1 && styles.unitDivider]}
          >
            <View style={[styles.unitBadge, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.unitBadgeText, { color: colors.primary }]}>{u.id}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={typography.h3}>{u.name}</Text>
              <Text style={typography.small}>{u.type} · {u.staff} staff</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.small, { color: colors.success, fontWeight: '800' }]}>
                {u.capacity}
              </Text>
              <Text style={[typography.small, { color: colors.textSubtle }]}>{u.status}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: spacing.sm }} />
        <AdminActionBtn icon="+" label="Add Factory Unit" onPress={() => {}} />
      </SectionCard>

      {/* ── User Roles ────────────────────────────────────────── */}
      <SectionCard title="User Roles & Permissions" subtitle="7 roles · 38 users total">
        {USER_ROLES.map((r, i) => (
          <View
            key={r.role}
            style={[styles.roleRow, i !== USER_ROLES.length - 1 && styles.unitDivider]}
          >
            <View style={[styles.roleColor, { backgroundColor: r.color }]} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={typography.h3}>{r.role}</Text>
              <Text style={typography.small}>{r.perms}</Text>
            </View>
            <View style={[styles.roleCount, { backgroundColor: r.color + '18' }]}>
              <Text style={[styles.roleCountText, { color: r.color }]}>{r.count}</Text>
            </View>
          </View>
        ))}
        <Divider />
        <View style={styles.adminBtnsRow}>
          <AdminActionBtn icon="+" label="Add User" onPress={() => push('UserRoles' as any)} />
          <AdminActionBtn icon="=" label="Manage Roles" onPress={() => push('UserRoles' as any)} />
          <AdminActionBtn icon="%" label="Permissions" onPress={() => push('UserRoles' as any)} />
        </View>
      </SectionCard>

      {/* ── Notification Preferences ──────────────────────────── */}
      <SectionCard title="Notification Preferences" subtitle="Configure how alerts reach you">
        <ToggleRow label="Push Notifications" sub="In-app &amp; mobile push alerts" value={notifPush} onChange={setNotifPush} />
        <ToggleRow label="Email Alerts"       sub="Digest and critical emails"       value={notifEmail} onChange={setNotifEmail} />
        <ToggleRow label="SMS Alerts"         sub="Critical-only SMS to +91-98XXXXXXXX" value={notifSMS} onChange={setNotifSMS} />
        <Divider />
        <ToggleRow label="Critical Alerts Only" sub="Suppress non-urgent notifications after hours" value={notifCritical} onChange={setNotifCritical} />
        <ToggleRow label="Daily Summary"        sub="Receive 08:00 daily operations digest"         value={notifDaily}    onChange={setNotifDaily} />
      </SectionCard>

      {/* ── Devices & Sensors ─────────────────────────────────── */}
      <SectionCard title="Devices & Integrations" subtitle="Connected IoT, cameras and ERPs">
        {DEVICES.map((d, i) => (
          <View
            key={d.id}
            style={[styles.deviceRow, i !== DEVICES.length - 1 && styles.unitDivider]}
          >
            <View style={[styles.deviceIcon, { backgroundColor: colors.accent + '18' }]}>
              <Text style={{ fontSize: 16 }}>S</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={typography.h3}>{d.name}</Text>
              <Text style={typography.small}>{d.type} · {d.count} node{d.count > 1 ? 's' : ''}</Text>
            </View>
            <View style={[
              styles.statusPill,
              { backgroundColor:
                  d.status === 'Connected' ? colors.successBg :
                  d.status === 'Syncing'   ? colors.warningBg :
                  colors.dangerBg },
            ]}>
              <Text style={[styles.statusPillText, {
                color:
                  d.status === 'Connected' ? colors.success :
                  d.status === 'Syncing'   ? colors.warning :
                  colors.danger,
              }]}>{d.status}</Text>
            </View>
          </View>
        ))}
        <Divider />
        <AdminActionBtn icon="+" label="Add Device / Integration" onPress={() => push('Devices' as any)} />
      </SectionCard>

      {/* ── Report Preferences ────────────────────────────────── */}
      <SectionCard title="Report Preferences" subtitle="Scheduled report delivery">
        {REPORT_PREFS.map((r) => (
          <ToggleRow
            key={r.id}
            label={r.label}
            sub={r.desc}
            value={reportToggles[r.id] ?? false}
            onChange={(v) => setReportToggles((prev) => ({ ...prev, [r.id]: v }))}
          />
        ))}
        <Divider />
        <Row label="Default Format" value="PDF + Excel" />
        <Row label="Report Language" value="English" />
      </SectionCard>

      {/* ── Theme & UI ────────────────────────────────────────── */}
      <SectionCard title="Theme & UI Preferences">
        <ToggleRow label="Dark Mode"    sub="Switch to dark industrial theme"  value={darkMode}    onChange={setDarkMode} />
        <ToggleRow label="Compact Mode" sub="Denser layouts for smaller screens" value={compactMode} onChange={setCompact} />
        <Divider />
        <Row label="Language"       value="English (en-IN)" />
        <Row label="Currency"       value="INR (RS)" />
        <Row label="Date Format"    value="DD MMM YYYY" />
        <Row label="Number Format"  value="1,00,000 (Indian)" />
      </SectionCard>

      {/* ── Security ──────────────────────────────────────────── */}
      <SectionCard title="Security" subtitle="Account protection settings">
        <ToggleRow label="Two-Factor Authentication (MFA)" sub="OTP via authenticator app"     value={mfaEnabled}  onChange={setMfaEnabled} />
        <ToggleRow label="Auto Lock on Inactivity"         sub="Locks after 5 min inactivity"  value={sessionLock} onChange={setSessionLock} />
        <Divider />
        <Row label="Last Password Change" value="14 Jan 2026" />
        <Row label="Session Timeout"      value="5 minutes" />
        <View style={{ height: spacing.sm }} />
        <TouchableOpacity style={styles.editBtn} onPress={() => {}}>
          <Text style={styles.editBtnText}>Change Password</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* ── Admin Controls ────────────────────────────────────── */}
      {role === 'Admin' || role === 'Plant Manager' ? (
        <SectionCard title="Admin Controls" subtitle="Org-level configuration">
          <Text style={[typography.small, { marginBottom: spacing.sm }]}>Approval Workflows</Text>
          {APPROVAL_FLOWS.map((af, i) => (
            <View
              key={af.id}
              style={[styles.afRow, i !== APPROVAL_FLOWS.length - 1 && styles.unitDivider]}
            >
              <View style={{ flex: 1 }}>
                <Text style={typography.body}>{af.label}</Text>
                <Text style={typography.small}>Approvers: {af.approvers}</Text>
              </View>
              <TouchableOpacity style={styles.editPill}>
                <Text style={styles.editPillText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Divider />
          <View style={styles.adminBtnsRow}>
            <AdminActionBtn icon="D" label="Add Dept." onPress={() => {}} />
            <AdminActionBtn icon="W" label="Add Warehouse" onPress={() => {}} />
            <AdminActionBtn icon="F" label="Config Flows" onPress={() => {}} />
          </View>
        </SectionCard>
      ) : null}

      {/* ── Subscription ──────────────────────────────────────── */}
      <Card style={styles.subCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={typography.h3}>Enterprise Plan</Text>
            <Text style={typography.small}>38 seats active · renews 12 Jan 2027</Text>
          </View>
          <Badge text="ACTIVE" tone="success" dot />
        </View>
        <Divider />
        <Row label="Plan"        value="Enterprise" />
        <Row label="Seats"       value="38 / 50 used" />
        <Row label="Next Billing" value="12 Jan 2027 · RS48,000/yr" />
        <View style={{ height: spacing.sm }} />
        <Button label="Manage Subscription" variant="secondary" />
      </Card>

      {/* ── Logout ────────────────────────────────────────────── */}
      <Button label="Log Out" variant="danger" onPress={() => reset('Login')} />
      <Text style={styles.versionText}>FactoryOps ERP · v1.0.0 · build 2426 · UDV-00214</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userCard: { marginTop: spacing.md, marginBottom: spacing.lg },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', ...shadow.card,
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  sectionCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border,
    ...shadow.card,
  },
  sectionCardHeader: { marginBottom: spacing.md },
  companyLogo: {
    width: 56, height: 56, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  companyLogoText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  editBtn: {
    backgroundColor: colors.primary + '12', borderRadius: 10,
    paddingVertical: 10, alignItems: 'center',
    borderWidth: 1, borderColor: colors.primary + '30',
  },
  editBtnText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  unitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  unitDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  unitBadge: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  unitBadgeText: { fontWeight: '900', fontSize: 12 },
  roleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  roleColor: { width: 4, height: 36, borderRadius: 2 },
  roleCount: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  roleCountText: { fontWeight: '900', fontSize: 13 },
  adminBtnsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  adminBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surfaceAlt, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  adminBtnIcon: { fontSize: 16, fontWeight: '700', color: colors.primary },
  adminBtnText: { fontSize: 12, fontWeight: '700', color: colors.text },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  deviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  deviceIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusPillText: { fontSize: 10, fontWeight: '800' },
  afRow: { paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center' },
  editPill: {
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: colors.primaryLight + '15',
    borderRadius: 20, marginLeft: 8,
  },
  editPillText: { fontSize: 11, fontWeight: '800', color: colors.primaryLight },
  subCard: { marginBottom: spacing.lg },
  versionText: {
    textAlign: 'center', fontSize: 11, color: colors.textSubtle,
    marginTop: spacing.lg, fontWeight: '600', marginBottom: spacing.xl,
  },
});