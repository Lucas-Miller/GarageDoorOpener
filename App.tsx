import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Idle');
  const [connected, setConnected] = useState(false);

  const onConnect = () => {
    setStatus('Connecting…');
    // mock delay, no BLE yet
    setTimeout(() => {
      setConnected(true);
      setStatus('Connected');
    }, 400);
  };

  const onDisconnect = () => {
    setStatus('Disconnecting…');
    setTimeout(() => {
      setConnected(false);
      setStatus('Disconnected');
    }, 200);
  };

  const onToggle = () => {
    // mock send action
    setStatus('Sending…');
    setTimeout(() => setStatus('Sent'), 150);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Garage Door</Text>
        <Text style={styles.status}>{status}</Text>
        <View style={styles.row}>
          {connected ? (
            <Button title="Disconnect" onPress={onDisconnect} />
          ) : (
            <Button title="Connect" onPress={onConnect} />
          )}
        </View>
        <View style={styles.row}>
          <Button title="Open / Close" onPress={onToggle} disabled={!connected} />
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
