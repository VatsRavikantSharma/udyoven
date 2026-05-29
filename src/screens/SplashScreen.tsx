import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View, Dimensions } from "react-native";
import { colors, radius, spacing, shadow } from "../theme";
import { useNav } from "../navigation/NavContext";

const { width: SW } = Dimensions.get("window");

export const SplashScreen: React.FC = () => {
  const { replace } = useNav();
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 1000, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
    
    const t = setTimeout(() => replace("Login"), 2500);
    return () => clearTimeout(t);
  }, [fade, lift, replace]);

  return (
    <View style={styles.root}>
      {/* Background patterns */}
      <View style={styles.bgCircle} />
      <View style={[styles.bgCircle, { bottom: -100, right: -100, width: 300, height: 300, backgroundColor: "rgba(255,255,255,0.05)" }]} />

      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: lift }] }]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>U</Text>
        </View>
        <Text style={styles.brand}>Udyoven Trade</Text>
        <Text style={styles.tagline}>B2B Marketplace for Factories & Vendors</Text>
        
        <View style={styles.loadingLine}>
          <Animated.View style={styles.loadingFill} />
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Professional B2B Network</Text>
        <View style={styles.secureRow}>
          <Text style={styles.secureText}>?? Secure Enterprise Connection</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  bgCircle: { position: "absolute", top: -50, left: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(255,255,255,0.08)" },
  content: { alignItems: "center" },
  logoBox: { width: 80, height: 80, borderRadius: 24, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 20, ...shadow.raised },
  logoText: { fontSize: 44, fontWeight: "900", color: colors.primary },
  brand: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  tagline: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 8, fontWeight: "600" },
  loadingLine: { width: 140, height: 4, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 2, marginTop: 40, overflow: "hidden" },
  loadingFill: { width: 60, height: "100%", backgroundColor: colors.accent, borderRadius: 2 },
  footer: { position: "absolute", bottom: 50, alignItems: "center" },
  footerText: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  secureRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  secureText: { fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
});
