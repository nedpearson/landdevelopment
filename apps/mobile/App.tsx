import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const [landmanMode, setLandmanMode] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Pearson Developments</Text>
            <Text style={styles.headerSubtitle}>Field Operations & Offline Mobile App</Text>
          </View>

          <TouchableOpacity
            style={[styles.modeToggle, landmanMode ? styles.modeToggleLandman : styles.modeToggleInvestor]}
            onPress={() => setLandmanMode(!landmanMode)}
          >
            <Text style={styles.modeToggleText}>{landmanMode ? '🤠 Landman' : '📈 Investor'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {landmanMode ? (
          /* LANDMAN FIELD MODE */
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🤠 Active Landman Field Package</Text>
              <Text style={styles.cardText}>Tract: #T-104 (Client Ref: #PNR-T104)</Text>
              <Text style={styles.cardText}>Reeves County, TX | Permian Basin</Text>
              <Text style={styles.cardText}>160.00 Gross AC | 40.00 NMA Share</Text>
              <View style={styles.badgeWarning}>
                <Text style={styles.badgeTextWarning}>MINERAL TITLE IN PROGRESS</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏛️ Courthouse & Field Tools</Text>
              <TouchableOpacity style={styles.buttonAmber}>
                <Text style={styles.buttonText}>Scan & Crop Instrument Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
                <Text style={styles.buttonTextSecondary}>Log Book / Page Search Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
                <Text style={styles.buttonTextSecondary}>Log Mileage & Time Entry</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔄 Offline Package Sync</Text>
              <Text style={styles.cardText}>Status: 0 pending field instruments to upload</Text>
              <Text style={styles.cardText}>Target Client: Pioneer Natural Resources</Text>
            </View>
          </View>
        ) : (
          /* LAND INVESTOR MODE */
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📍 Active Parcel Inspection</Text>
              <Text style={styles.cardText}>APN: 123-456-789 | 5.2 Acres</Text>
              <Text style={styles.cardText}>Costilla County, CO</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>QUALIFIED - 84 Deal Score</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📷 Fieldwork Actions</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Capture Field Photo & GPS Note</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
                <Text style={styles.buttonTextSecondary}>Verify Physical Road Access</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  modeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeToggleLandman: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderColor: '#d97706',
  },
  modeToggleInvestor: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  modeToggleText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeWarning: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeTextWarning: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonAmber: {
    backgroundColor: '#d97706',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonSecondary: {
    backgroundColor: '#334155',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  buttonTextSecondary: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
