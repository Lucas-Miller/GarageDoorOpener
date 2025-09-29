# GarageDoorOpener
Control your garage door via Bluetooth using an Arduino Nano ESP32!

This project lets you control your garage door from your phone over bluetooth low energy. It uses an Arduino Nano ESP32 and a relay that gets wired in parallel to an existing wall mountained garage door button.

# What You'll Need
- ESP32 (I used an Arduino ESP32 Nano)
- 3.3V Relay (I used one of these off amazon: https://www.amazon.com/dp/B0BG2F7349?ref=ppx_yo2ov_dt_b_fed_asin_title )
- Wires (I used some solid core wire for use with my screw terminal shield: https://www.amazon.com/dp/B07TX6BX47?ref=ppx_yo2ov_dt_b_fed_asin_title )
- A simple two terminal wall mounted garage door button that we can connect our relay to

- (Optional) Screw Terminal Shield for ESP32 Nano ( https://www.amazon.com/dp/B0C9TMRL13?ref=ppx_yo2ov_dt_b_fed_asin_title )
- (Optional) Some kind of project box to hold everything ( https://www.amazon.com/dp/B089KCZ2V6?ref=ppx_yo2ov_dt_b_fed_asin_title )

Root of the project is a Typescript React Native app that lets us send commands to the ESP32 Controller

The ESP32 Controller code is located in the GarageDoorController directory

# Wiring Diagram


<img width="1893" height="1840" alt="ArduinoGarageDoor" src="https://github.com/user-attachments/assets/fa1335f7-eb13-4f96-ba13-ff42886be5f2" />
