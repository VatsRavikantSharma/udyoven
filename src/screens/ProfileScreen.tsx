import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Button, Card, Divider, Row, SectionTitle } from "../components/UI";
import { company } from "../data/mockData";
import { useNav } from "../navigation/NavContext";
import { colors, radius, shadow, spacing, typography } from "../theme";

export const ProfileScreen: React.FC = () => {
  const { push, role, reset } = useNav();
  const [notifs, setNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.userName}>Lakshit Khandelwal</Text>
        <Text style={styles.userEmail}>lakshit@example.com</Text>
        <Badge text={role} tone="primary" style={{ marginTop: 10 }} />
      </View>

      <View style={styles.container}>
        {/* Business Info */}
        <SectionTitle title="Business Information" />
        <Card>
          <Row label="Company" value="Lakshit Enterprises" bold />
          <Row label="GSTIN" value="27AAACL1234F1Z1" />
          <Row label="Location" value="Mumbai, Maharashtra" />
          <Row label="Verified" value="? Yes" />
          <Divider />
          <Button label="Edit Business Profile" variant="secondary" small />
        </Card>

        {/* Account Settings */}
        <SectionTitle title="Account Settings" />
        <Card>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingSub}>For new quotes and messages</Text>
            </View>
            <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Email Updates</Text>
              <Text style={styles.settingSub}>Weekly marketplace trends</Text>
            </View>
            <Switch value={emailNotifs} onValueChange={setEmailNotifs} trackColor={{ true: colors.primary }} />
          </View>
        </Card>

        {/* Support & Links */}
        <SectionTitle title="Support & Legal" />
        <View style={styles.linkList}>
          {["Help Center", "Privacy Policy", "Terms of Service", "Contact Support"].map((item) => (
            <TouchableOpacity key={item} style={styles.linkItem}>
              <Text style={styles.linkText}>{item}</Text>
              <Text style={styles.chevron}>></Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button 
          label="Logout" 
          variant="danger" 
          style={{ marginTop: 40 }} 
          onPress={() => reset("Login")} 
        />
        
        <Text style={styles.version}>v1.0.4 (Build 124) · Udyoven Trade</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: "center", paddingVertical: 40, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: colors.border },
  avatarLarge: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 16, ...shadow.soft },
  avatarText: { fontSize: 36, fontWeight: "800", color: "#fff" },
  userName: { fontSize: 20, fontWeight: "800", color: colors.text },
  userEmail: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  container: { padding: spacing.lg },
  settingRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  settingLabel: { fontSize: 15, fontWeight: "600", color: colors.text },
  settingSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  linkList: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", ...shadow.soft },
  linkItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  linkText: { fontSize: 15, color: colors.text, fontWeight: "500" },
  chevron: { color: colors.border, fontSize: 18, fontWeight: "bold" },
  version: { textAlign: "center", marginTop: 40, color: colors.textSubtle, fontSize: 12 },
});
