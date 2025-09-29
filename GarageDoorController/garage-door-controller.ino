/*
    # Lucas Miller 2025
    # Use an Arduino ESP32 Nano with Bluetooth low energy to remotely
    # trigger a relay. In my case, to control a garage door!
*/

#include <ArduinoBLE.h>

// ===== Pins (Arduino ESP32 Nano) =====
const int RELAY_PIN = 13;   // Relay IN (active LOW)

// ===== Timing =====

// Controls how long the relay will be activated for
const unsigned long PULSE_MS = 300;

// ===== Garage Door State =====
bool doorOpen = false;

// ===== Setting up BLE Service =====
BLEService doorService("5b6d6b9f-1c2a-4a37-8d0e-6f7f1f2a3b4c");
BLECharacteristic commandChar(
  "a1a2a3a4-b1b2-b3b4-b5b6-b7b8b9b0c0d0",
  BLEWrite | BLEWriteWithoutResponse, 20
);
BLECharacteristic stateChar(
  "c0d0b9b8-b7b6-b5b4-b3b2-b1a4a3a2a1a0",
  BLERead | BLENotify, 8
);

// Tracking the state of the garage door (open or closed), this isn't very reliable
// for a number of reasons.
// TODO: Incorporate a Reed Magnetic Sensor to better determine door state
void sendState() {
  if (doorOpen) stateChar.writeValue((const uint8_t*)"OPEN", 4);
  else          stateChar.writeValue((const uint8_t*)"CLOSED", 6);
}

// Trigger the relay to activate the garage door opener
// HIGH is idle state (relay off), LOW activates the relay 
void triggerDoor() {
  digitalWrite(RELAY_PIN, LOW);
  delay(PULSE_MS);
  digitalWrite(RELAY_PIN, HIGH);
  doorOpen = !doorOpen;
  sendState();
}

// Set up necessary pins, BLE Service, Serial Monitor, etc. 
void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  Serial.begin(115200);

  BLE.begin();
  BLE.setDeviceName("GarageDoorSim");
  BLE.setLocalName("GarageDoorSim");
  BLE.setAdvertisedService(doorService);
  doorService.addCharacteristic(commandChar);
  doorService.addCharacteristic(stateChar);
  BLE.addService(doorService);
  commandChar.writeValue((const uint8_t*)"", 0);
  sendState();
  BLE.advertise();
}


void loop() {
  BLE.poll();

  // Control door via writing a character "o" over BLE
  if (commandChar.written()) {
    
    int len = commandChar.valueLength();
    const uint8_t* data = commandChar.value();
    
    if (len > 0) {
      uint8_t b = data[0];
      if (b == 'o' || b == 'O') triggerDoor();
    }

  }

  // Control door via writing a character "o" in the serial monitor 
  if (Serial.available()) {

    char c = (char)Serial.read();
    if (c == 'o' || c == 'O') triggerDoor();
  
  }
}