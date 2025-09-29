import React from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Garage Door</Text>
        <Text style={styles.status}>Idle</Text>
        <View style={styles.row}>
          <Button title="Connect" onPress={() => {}} />
        </View>
        <View style={styles.row}>
          <Button title="Open / Close" onPress={() => {}} disabled />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  status: { color: '#aaa', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  row: { marginVertical: 8 },
});