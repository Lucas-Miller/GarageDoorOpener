import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const DEVICE_NAME = 'GarageDoorSim';

export default function App() {
  const manager = useMemo(() => new BleManager(), []);
  const [status, setStatus] = useState('Idle');
  const [connected, setConnected] = useState(false);
  const deviceRef = useRef<Device | null>(null);

  useEffect(() => {
    return () => {
      deviceRef.current?.cancelConnection().catch(() => {});
      manager.destroy();
    };
  }, [manager]);

  const ensurePermissions = async () => {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version >= 31) {
      const res = await PermissionsAndroid.requestMultiple([
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.ACCESS_FINE_LOCATION',
      ] as any);
      return Object.values(res).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return res === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const connect = async () => {
    setStatus('Requesting permissions…');
    const ok = await ensurePermissions();
    if (!ok) { setStatus('Permissions denied'); return; }

    setStatus('Turning on Bluetooth…');
    const stateSub = manager.onStateChange(async (state) => {
      if (state === 'PoweredOn') {
        stateSub.remove();
        setStatus('Scanning…');
        try {
          const device = await scanForName(DEVICE_NAME, 10000);
          if (!device) { setStatus('Device not found'); return; }

          setStatus('Connecting…');
          const d = await device.connect();
          deviceRef.current = d;

          setStatus('Discovering services…');
          await d.discoverAllServicesAndCharacteristics();

          setConnected(true);
          setStatus('Connected');
        } catch (e: any) {
          setStatus(`Error: ${String(e?.message || e)}`);
        }
      }
    }, true);
  };

  const disconnect = async () => {
    setStatus('Disconnecting…');
    try { await deviceRef.current?.cancelConnection(); } catch {}
    deviceRef.current = null;
    setConnected(false);
    setStatus('Disconnected');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Garage Door</Text>
        <Text style={styles.status}>{status}</Text>
        <View style={styles.row}>
          <Button title={connected ? 'Disconnect' : 'Connect'} onPress={connected ? disconnect : connect} />
        </View>
        <View style={styles.row}>
          <Button title="Open / Close" onPress={() => {}} disabled={!connected} />
        </View>
      </View>
    </SafeAreaView>
  );

  function scanForName(name: string, timeoutMs: number): Promise<Device | null> {
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timer = setTimeout(() => {
        manager.stopDeviceScan();
        if (!resolved) { resolved = true; resolve(null); }
      }, timeoutMs);

      manager.startDeviceScan(null, { allowDuplicates: false }, (error, dev) => {
        if (error) {
          clearTimeout(timer);
          manager.stopDeviceScan();
          if (!resolved) { resolved = true; reject(error); }
          return;
        }
        if (dev?.name === name) {
          clearTimeout(timer);
          manager.stopDeviceScan();
          if (!resolved) { resolved = true; resolve(dev); }
        }
      });
    });
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  status: { color: '#aaa', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  row: { marginVertical: 8 },
});