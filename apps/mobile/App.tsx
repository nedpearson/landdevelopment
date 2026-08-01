import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Land Intelligence OS</Text>
        <Text style={styles.headerSubtitle}>Field Operations & Offline Inspections</Text>
      </View>

      <ScrollView style={styles.content}>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔄 Offline Synchronization</Text>
          <Text style={styles.cardText}>Status: 0 pending field edits to upload</Text>
          <Text style={styles.cardText}>Last Synced: Just now</Text>
        </View>
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
  headerTitle: {
    color: '#10b981',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
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
  button: {
    backgroundColor: '#10b981',
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
