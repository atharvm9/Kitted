type SellerId = "DK" | "MO" | "AR" | "NW" | "LC" | "AZ" | "SF" | "AD" | "RS";
type Offer = [SellerId, number, number, string];

export interface CatalogEntry {
  family: string;
  brand: string;
  thumb: string;
  official: boolean;
  mpn: string;
  mcu: string;
  specs: string;
  tags: string[];
  offers: Offer[];
}

export const CATALOG: CatalogEntry[] = [

  // ── DEV BOARDS ───────────────────────────────────────────────────────────
  { family: "Arduino Uno R3", brand: "Arduino", thumb: "Uno R3", official: true,
    mpn: "A000066", mcu: "ATmega328P",
    specs: "16 MHz · 32 KB Flash · 14 digital I/O · USB-B",
    tags: ["microcontroller", "arduino", "uno", "atmega328p", "dev board"],
    offers: [["DK", 27.60, 4120, "Ships today"], ["MO", 27.60, 2890, "Ships today"], ["AR", 26.40, 760, "1–2 days"], ["AD", 27.50, 318, "In stock"]] },

  { family: "Arduino Uno R3", brand: "Elegoo", thumb: "Uno R3", official: false,
    mpn: "EL-CB-001", mcu: "ATmega328P",
    specs: "16 MHz · CH340 USB · Uno-compatible clone",
    tags: ["microcontroller", "arduino", "uno", "atmega328p", "dev board", "clone"],
    offers: [["AZ", 16.99, 999, "Prime · 1 day"], ["RS", 17.50, 240, "1–3 days"]] },

  { family: "Arduino Nano", brand: "Arduino", thumb: "Nano", official: true,
    mpn: "A000005", mcu: "ATmega328P",
    specs: "16 MHz · 32 KB Flash · breadboard-friendly · Mini-USB",
    tags: ["microcontroller", "arduino", "nano", "atmega328p", "dev board"],
    offers: [["AR", 23.80, 410, "1–2 days"], ["DK", 24.90, 3300, "Ships today"], ["MO", 24.90, 2100, "Ships today"]] },

  { family: "Arduino Nano", brand: "Elegoo", thumb: "Nano", official: false,
    mpn: "EL-CB-003", mcu: "ATmega328P",
    specs: "16 MHz · CH340G · Nano-compatible clone",
    tags: ["microcontroller", "arduino", "nano", "atmega328p", "dev board", "clone"],
    offers: [["LC", 2.90, 14000, "Ships in 3 days"], ["AZ", 5.99, 999, "Prime · 1 day"]] },

  { family: "Arduino Mega 2560", brand: "Arduino", thumb: "Mega", official: true,
    mpn: "A000067", mcu: "ATmega2560",
    specs: "16 MHz · 256 KB Flash · 54 digital I/O · 4× UART",
    tags: ["microcontroller", "arduino", "mega", "atmega2560", "dev board"],
    offers: [["DK", 48.90, 2100, "Ships today"], ["MO", 48.90, 1800, "Ships today"], ["AD", 49.95, 180, "In stock"]] },

  { family: "Arduino Mega 2560", brand: "Elegoo", thumb: "Mega", official: false,
    mpn: "EL-CB-002", mcu: "ATmega2560",
    specs: "16 MHz · CH340G · Mega-compatible clone",
    tags: ["microcontroller", "arduino", "mega", "atmega2560", "dev board", "clone"],
    offers: [["LC", 8.90, 7800, "Ships in 3 days"], ["AZ", 16.99, 780, "Prime · 1 day"]] },

  { family: "ESP32 dev board", brand: "Espressif", thumb: "ESP32", official: true,
    mpn: "ESP32-DEVKITC-32E", mcu: "ESP32-WROOM-32E",
    specs: "240 MHz dual-core · Wi-Fi + BT · 38-pin · 4 MB Flash",
    tags: ["microcontroller", "esp32", "wifi", "bluetooth", "dev board", "iot"],
    offers: [["AR", 10.20, 1340, "1–2 days"], ["MO", 10.50, 5210, "Ships today"], ["DK", 10.95, 6700, "Ships today"]] },

  { family: "ESP32 dev board", brand: "DOIT", thumb: "ESP32", official: false,
    mpn: "DEVKIT-V1", mcu: "ESP32-WROOM-32",
    specs: "240 MHz · Wi-Fi + BT · 30-pin compact · CP2102",
    tags: ["microcontroller", "esp32", "wifi", "bluetooth", "dev board", "clone"],
    offers: [["LC", 3.90, 9100, "Ships in 3 days"], ["AZ", 7.99, 740, "Prime · 1 day"]] },

  { family: "ESP8266 dev board", brand: "LOLIN", thumb: "NodeMCU", official: false,
    mpn: "NODEMCU-V3-CH340", mcu: "ESP8266EX",
    specs: "80/160 MHz · Wi-Fi · 4 MB Flash · CH340G · NodeMCU pinout",
    tags: ["microcontroller", "esp8266", "wifi", "dev board", "nodemcu", "iot"],
    offers: [["LC", 2.40, 22000, "Ships in 3 days"], ["AZ", 6.99, 999, "Prime · 1 day"]] },

  { family: "ESP8266 dev board", brand: "AI-Thinker", thumb: "ESP-01", official: false,
    mpn: "ESP-01S", mcu: "ESP8266EX",
    specs: "80 MHz · Wi-Fi · 1 MB Flash · 8-pin minimal module",
    tags: ["microcontroller", "esp8266", "wifi", "module", "esp-01"],
    offers: [["LC", 1.20, 45000, "Ships in 3 days"], ["AZ", 4.99, 600, "Prime · 1 day"]] },

  { family: "Raspberry Pi Pico", brand: "Raspberry Pi", thumb: "Pico", official: true,
    mpn: "SC0915", mcu: "RP2040",
    specs: "133 MHz dual-core M0+ · 264 KB SRAM · 2 MB Flash · 26 GPIO",
    tags: ["microcontroller", "raspberry pi pico", "rp2040", "dev board", "arm"],
    offers: [["NW", 3.80, 9900, "Ships today"], ["DK", 4.00, 21000, "Ships today"], ["MO", 4.00, 15800, "Ships today"], ["AD", 5.00, 540, "In stock"]] },

  { family: "Raspberry Pi Pico", brand: "Raspberry Pi", thumb: "Pico W", official: true,
    mpn: "SC0918", mcu: "RP2040",
    specs: "133 MHz · 2 MB Flash · 2.4 GHz Wi-Fi (CYW43439)",
    tags: ["microcontroller", "raspberry pi pico", "rp2040", "wifi", "dev board"],
    offers: [["DK", 6.00, 14200, "Ships today"], ["MO", 6.00, 8800, "Ships today"], ["AD", 6.00, 410, "In stock"]] },

  { family: "STM32 dev board", brand: "WeAct", thumb: "BlackPill", official: false,
    mpn: "STM32F411CEU6-BLACKPILL", mcu: "STM32F411CE",
    specs: "100 MHz M4 · 512 KB Flash · USB-C · SWD debug header",
    tags: ["microcontroller", "stm32", "arm", "blackpill", "dev board", "cortex-m4"],
    offers: [["LC", 4.80, 6200, "Ships in 3 days"], ["AZ", 6.50, 380, "Prime · 1 day"]] },

  { family: "STM32 dev board", brand: "Generic", thumb: "Blue Pill", official: false,
    mpn: "STM32F103C8T6-BLUEPILL", mcu: "STM32F103C8",
    specs: "72 MHz M3 · 64 KB Flash · 37 GPIO · classic Blue Pill",
    tags: ["microcontroller", "stm32", "arm", "blue pill", "dev board", "cortex-m3"],
    offers: [["LC", 2.10, 18000, "Ships in 3 days"], ["AZ", 4.99, 999, "Prime · 1 day"]] },

  { family: "Teensy 4.0", brand: "PJRC", thumb: "Teensy 4.0", official: true,
    mpn: "TEENSY40", mcu: "i.MX RT1062",
    specs: "600 MHz Cortex-M7 · 1 MB RAM · 2 MB Flash · USB device/host",
    tags: ["microcontroller", "teensy", "arm", "dev board", "high performance"],
    offers: [["AD", 19.95, 260, "In stock"], ["SF", 23.80, 540, "1–2 days"], ["DK", 23.80, 1900, "Ships today"]] },

  // ── BARE MCUs ─────────────────────────────────────────────────────────────
  { family: "ATmega328P", brand: "Microchip", thumb: "ATmega328P-PU", official: true,
    mpn: "ATMEGA328P-PU", mcu: "ATmega328P",
    specs: "16 MHz · 32 KB Flash · 2 KB SRAM · 28-DIP · 5V",
    tags: ["microcontroller", "atmega328p", "avr", "dip", "8-bit"],
    offers: [["DK", 2.97, 38000, "Ships today"], ["MO", 2.97, 24000, "Ships today"], ["LC", 2.20, 51000, "Ships in 3 days"]] },

  { family: "ATtiny85", brand: "Microchip", thumb: "ATtiny85", official: true,
    mpn: "ATTINY85-20PU", mcu: "ATtiny85",
    specs: "20 MHz · 8 KB Flash · 512B SRAM · 8-DIP · 5.5V max",
    tags: ["microcontroller", "attiny85", "avr", "dip", "8-bit", "tiny"],
    offers: [["DK", 1.47, 52000, "Ships today"], ["MO", 1.47, 41000, "Ships today"], ["LC", 1.05, 88000, "Ships in 3 days"]] },

  { family: "STM32F103C8T6", brand: "ST", thumb: "STM32F103", official: true,
    mpn: "STM32F103C8T6", mcu: "STM32F103C8",
    specs: "72 MHz Cortex-M3 · 64 KB Flash · 20 KB SRAM · LQFP-48",
    tags: ["microcontroller", "stm32", "arm", "cortex-m3", "smd"],
    offers: [["DK", 5.60, 8200, "Ships today"], ["MO", 5.60, 6100, "Ships today"], ["LC", 2.80, 31000, "Ships in 3 days"]] },

  { family: "RP2040", brand: "Raspberry Pi", thumb: "RP2040", official: true,
    mpn: "SC0914", mcu: "RP2040",
    specs: "133 MHz dual M0+ · 264 KB SRAM · QFN-56 · bare die for custom boards",
    tags: ["microcontroller", "rp2040", "arm", "qfn", "smd"],
    offers: [["DK", 1.00, 84000, "Ships today"], ["MO", 1.00, 61000, "Ships today"], ["LC", 0.85, 120000, "Ships in 3 days"]] },

  { family: "ESP32-WROOM-32E", brand: "Espressif", thumb: "ESP32 module", official: true,
    mpn: "ESP32-WROOM-32E(4MB)", mcu: "ESP32",
    specs: "240 MHz dual-core · 4 MB Flash · Wi-Fi + BT 4.2 · SMD module",
    tags: ["microcontroller", "esp32", "wifi", "bluetooth", "module", "smd"],
    offers: [["DK", 2.95, 41000, "Ships today"], ["MO", 2.95, 29000, "Ships today"], ["LC", 2.10, 78000, "Ships in 3 days"]] },

  // ── VOLTAGE REGULATORS ───────────────────────────────────────────────────
  { family: "LM7805", brand: "ST", thumb: "LM7805", official: true,
    mpn: "L7805CV", mcu: "",
    specs: "+5V · 1.5A · TO-220 · linear regulator · 35V max input",
    tags: ["voltage regulator", "linear", "5v", "ldo", "to-220", "power"],
    offers: [["DK", 0.68, 72000, "Ships today"], ["MO", 0.68, 54000, "Ships today"], ["LC", 0.12, 320000, "Ships in 3 days"]] },

  { family: "LM7812", brand: "ST", thumb: "LM7812", official: true,
    mpn: "L7812CV", mcu: "",
    specs: "+12V · 1.5A · TO-220 · linear regulator",
    tags: ["voltage regulator", "linear", "12v", "to-220", "power"],
    offers: [["DK", 0.72, 41000, "Ships today"], ["MO", 0.72, 32000, "Ships today"], ["LC", 0.14, 180000, "Ships in 3 days"]] },

  { family: "LM7833", brand: "ST", thumb: "LM7833", official: true,
    mpn: "L7833CV", mcu: "",
    specs: "+3.3V · 1.5A · TO-220 · linear regulator",
    tags: ["voltage regulator", "linear", "3.3v", "to-220", "power"],
    offers: [["DK", 0.75, 28000, "Ships today"], ["MO", 0.75, 19000, "Ships today"], ["LC", 0.15, 95000, "Ships in 3 days"]] },

  { family: "LM317", brand: "ST", thumb: "LM317", official: true,
    mpn: "LM317T", mcu: "",
    specs: "1.25–37V adjustable · 1.5A · TO-220 · classic adjustable LDO",
    tags: ["voltage regulator", "linear", "adjustable", "ldo", "to-220", "power"],
    offers: [["DK", 0.58, 89000, "Ships today"], ["MO", 0.58, 67000, "Ships today"], ["LC", 0.10, 450000, "Ships in 3 days"]] },

  { family: "AMS1117-3.3", brand: "AMS", thumb: "AMS1117", official: true,
    mpn: "AMS1117-3.3", mcu: "",
    specs: "3.3V output · 1A · SOT-223 · low dropout 1.3V",
    tags: ["voltage regulator", "ldo", "3.3v", "sot-223", "smd", "power"],
    offers: [["DK", 0.45, 61000, "Ships today"], ["MO", 0.45, 48000, "Ships today"], ["LC", 0.04, 980000, "Ships in 3 days"]] },

  { family: "AMS1117-5.0", brand: "AMS", thumb: "AMS1117", official: true,
    mpn: "AMS1117-5.0", mcu: "",
    specs: "5V output · 1A · SOT-223 · low dropout",
    tags: ["voltage regulator", "ldo", "5v", "sot-223", "smd", "power"],
    offers: [["DK", 0.45, 44000, "Ships today"], ["MO", 0.45, 36000, "Ships today"], ["LC", 0.04, 720000, "Ships in 3 days"]] },

  { family: "MCP1700-3.3V", brand: "Microchip", thumb: "MCP1700", official: true,
    mpn: "MCP1700-3302E/TO", mcu: "",
    specs: "3.3V · 250mA · TO-92 · ultra-low quiescent 1.6µA · 6V max",
    tags: ["voltage regulator", "ldo", "3.3v", "to-92", "low quiescent", "power", "battery"],
    offers: [["DK", 0.34, 81000, "Ships today"], ["MO", 0.34, 59000, "Ships today"], ["LC", 0.22, 210000, "Ships in 3 days"]] },

  { family: "LM2596S-5.0", brand: "TI", thumb: "LM2596", official: true,
    mpn: "LM2596S-5.0/NOPB", mcu: "",
    specs: "5V output · 3A · D2PAK · 150 kHz switching buck converter",
    tags: ["voltage regulator", "switching", "buck", "5v", "3a", "smd", "power supply"],
    offers: [["DK", 2.43, 18000, "Ships today"], ["MO", 2.43, 14000, "Ships today"], ["LC", 0.42, 88000, "Ships in 3 days"]] },

  { family: "LM2596S-ADJ", brand: "TI", thumb: "LM2596", official: true,
    mpn: "LM2596S-ADJ/NOPB", mcu: "",
    specs: "1.23–37V adjustable · 3A · D2PAK · 150 kHz buck converter",
    tags: ["voltage regulator", "switching", "buck", "adjustable", "smd", "power supply"],
    offers: [["DK", 2.43, 22000, "Ships today"], ["MO", 2.43, 17000, "Ships today"], ["LC", 0.45, 74000, "Ships in 3 days"]] },

  { family: "MT3608", brand: "Aerosemi", thumb: "MT3608", official: false,
    mpn: "MT3608", mcu: "",
    specs: "2–24V input · up to 28V output · 2A · SOT-23-6 · boost converter",
    tags: ["voltage regulator", "switching", "boost", "sot-23", "smd", "power supply"],
    offers: [["LC", 0.06, 540000, "Ships in 3 days"], ["AZ", 5.99, 999, "Prime · 1 day"]] },

  { family: "XL4016", brand: "XLSEMI", thumb: "XL4016", official: false,
    mpn: "XL4016E1", mcu: "",
    specs: "8–40V input · 1.25–36V adjustable · 8A · TO-263 · buck converter",
    tags: ["voltage regulator", "switching", "buck", "high current", "8a", "power supply"],
    offers: [["LC", 0.45, 290000, "Ships in 3 days"]] },

  // ── PASSIVES: RESISTORS ──────────────────────────────────────────────────
  { family: "10kΩ 0402 1%", brand: "Yageo", thumb: "10kΩ", official: true,
    mpn: "RC0402FR-0710KL", mcu: "",
    specs: "10 kΩ · ±1% · 62.5 mW · 0402 SMD · 200V",
    tags: ["resistor", "10k", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.002, 999999, "Ships in 3 days"]] },

  { family: "1kΩ 0402 1%", brand: "Yageo", thumb: "1kΩ", official: true,
    mpn: "RC0402FR-071KL", mcu: "",
    specs: "1 kΩ · ±1% · 62.5 mW · 0402 SMD",
    tags: ["resistor", "1k", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.002, 999999, "Ships in 3 days"]] },

  { family: "100Ω 0402 1%", brand: "Yageo", thumb: "100Ω", official: true,
    mpn: "RC0402FR-07100RL", mcu: "",
    specs: "100 Ω · ±1% · 62.5 mW · 0402 SMD",
    tags: ["resistor", "100r", "100 ohm", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.002, 999999, "Ships in 3 days"]] },

  { family: "4.7kΩ 0402 1%", brand: "Yageo", thumb: "4.7kΩ", official: true,
    mpn: "RC0402FR-074K7L", mcu: "",
    specs: "4.7 kΩ · ±1% · 62.5 mW · 0402 SMD",
    tags: ["resistor", "4k7", "4.7k", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.002, 999999, "Ships in 3 days"]] },

  { family: "100kΩ 0402 1%", brand: "Yageo", thumb: "100kΩ", official: true,
    mpn: "RC0402FR-07100KL", mcu: "",
    specs: "100 kΩ · ±1% · 62.5 mW · 0402 SMD",
    tags: ["resistor", "100k", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.002, 999999, "Ships in 3 days"]] },

  { family: "10kΩ TH 5%", brand: "Yageo", thumb: "10kΩ TH", official: true,
    mpn: "CFR-25JB-52-10K", mcu: "",
    specs: "10 kΩ · ±5% · 250 mW · 1/4W · axial through-hole",
    tags: ["resistor", "10k", "through hole", "axial", "passive", "thru-hole"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "1kΩ TH 5%", brand: "Yageo", thumb: "1kΩ TH", official: true,
    mpn: "CFR-25JB-52-1K0", mcu: "",
    specs: "1 kΩ · ±5% · 250 mW · 1/4W · axial through-hole",
    tags: ["resistor", "1k", "through hole", "axial", "passive", "thru-hole"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "470Ω TH 5%", brand: "Yageo", thumb: "470Ω TH", official: true,
    mpn: "CFR-25JB-52-470R", mcu: "",
    specs: "470 Ω · ±5% · 250 mW · 1/4W · axial through-hole",
    tags: ["resistor", "470r", "470 ohm", "through hole", "axial", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  // ── PASSIVES: CAPACITORS ─────────────────────────────────────────────────
  { family: "100nF 0402 ceramic", brand: "Samsung", thumb: "100nF", official: true,
    mpn: "CL05B104KO5NNNC", mcu: "",
    specs: "100 nF · X5R · ±10% · 10V · 0402 · bypass / decoupling",
    tags: ["capacitor", "ceramic", "100nf", "0.1uf", "decoupling", "bypass", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.002, 999999, "Ships in 3 days"]] },

  { family: "1µF 0402 ceramic", brand: "Murata", thumb: "1µF", official: true,
    mpn: "GRM155R61A105KE15D", mcu: "",
    specs: "1 µF · X5R · ±10% · 10V · 0402 SMD",
    tags: ["capacitor", "ceramic", "1uf", "smd", "0402", "passive"],
    offers: [["DK", 0.10, 999999, "Ships today"], ["MO", 0.10, 999999, "Ships today"], ["LC", 0.003, 999999, "Ships in 3 days"]] },

  { family: "10µF 0805 ceramic", brand: "Murata", thumb: "10µF", official: true,
    mpn: "GRM21BR61A106KE18L", mcu: "",
    specs: "10 µF · X5R · ±10% · 10V · 0805 SMD",
    tags: ["capacitor", "ceramic", "10uf", "smd", "0805", "passive"],
    offers: [["DK", 0.11, 850000, "Ships today"], ["MO", 0.11, 630000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "100nF TH ceramic", brand: "Vishay", thumb: "100nF TH", official: true,
    mpn: "K104K15X7RF53L2", mcu: "",
    specs: "100 nF · ±10% · 50V · 5mm pitch · through-hole · bypass",
    tags: ["capacitor", "ceramic", "100nf", "0.1uf", "through hole", "decoupling", "bypass", "passive"],
    offers: [["DK", 0.14, 580000, "Ships today"], ["MO", 0.14, 410000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "10µF 25V electrolytic", brand: "Panasonic", thumb: "10µF elec", official: true,
    mpn: "EEU-FC1E100", mcu: "",
    specs: "10 µF · 25V · ±20% · 5×11 mm · radial electrolytic",
    tags: ["capacitor", "electrolytic", "10uf", "25v", "through hole", "passive", "radial"],
    offers: [["DK", 0.22, 280000, "Ships today"], ["MO", 0.22, 190000, "Ships today"], ["LC", 0.02, 999999, "Ships in 3 days"]] },

  { family: "100µF 25V electrolytic", brand: "Panasonic", thumb: "100µF elec", official: true,
    mpn: "EEU-FC1E101", mcu: "",
    specs: "100 µF · 25V · ±20% · 6.3×11 mm · radial electrolytic",
    tags: ["capacitor", "electrolytic", "100uf", "25v", "through hole", "passive", "radial"],
    offers: [["DK", 0.25, 210000, "Ships today"], ["MO", 0.25, 160000, "Ships today"], ["LC", 0.03, 999999, "Ships in 3 days"]] },

  { family: "1000µF 16V electrolytic", brand: "Nichicon", thumb: "1000µF elec", official: true,
    mpn: "UVR1C102MPD", mcu: "",
    specs: "1000 µF · 16V · ±20% · 10×16 mm · radial electrolytic · bulk filter",
    tags: ["capacitor", "electrolytic", "1000uf", "1mf", "16v", "through hole", "passive", "bulk"],
    offers: [["DK", 0.38, 88000, "Ships today"], ["MO", 0.38, 62000, "Ships today"], ["LC", 0.05, 310000, "Ships in 3 days"]] },

  // ── PASSIVES: INDUCTORS ──────────────────────────────────────────────────
  { family: "10µH shielded inductor", brand: "Bourns", thumb: "10µH", official: true,
    mpn: "SRR1260-100Y", mcu: "",
    specs: "10 µH · ±30% · 2.5A · 0.08Ω DCR · SMD shielded",
    tags: ["inductor", "10uh", "shielded", "smd", "power", "passive"],
    offers: [["DK", 0.89, 42000, "Ships today"], ["MO", 0.89, 31000, "Ships today"], ["LC", 0.15, 180000, "Ships in 3 days"]] },

  { family: "4.7µH inductor", brand: "Bourns", thumb: "4.7µH", official: true,
    mpn: "SRR1260-4R7Y", mcu: "",
    specs: "4.7 µH · ±30% · 3.4A · SMD shielded",
    tags: ["inductor", "4.7uh", "shielded", "smd", "power", "passive"],
    offers: [["DK", 0.89, 38000, "Ships today"], ["MO", 0.89, 27000, "Ships today"], ["LC", 0.14, 150000, "Ships in 3 days"]] },

  { family: "100µH through-hole inductor", brand: "Bourns", thumb: "100µH TH", official: true,
    mpn: "RLB9012-101KL", mcu: "",
    specs: "100 µH · ±10% · 0.77A · axial through-hole",
    tags: ["inductor", "100uh", "through hole", "axial", "passive"],
    offers: [["DK", 0.42, 28000, "Ships today"], ["MO", 0.42, 19000, "Ships today"], ["LC", 0.06, 82000, "Ships in 3 days"]] },

  // ── TRANSISTORS & MOSFETs ────────────────────────────────────────────────
  { family: "2N2222A NPN", brand: "ON Semi", thumb: "2N2222A", official: true,
    mpn: "2N2222ATA", mcu: "",
    specs: "NPN · 600mA · 40V · 625mW · TO-92 · general purpose",
    tags: ["transistor", "npn", "bjt", "2n2222", "to-92", "through hole", "switching"],
    offers: [["DK", 0.21, 120000, "Ships today"], ["MO", 0.21, 89000, "Ships today"], ["LC", 0.02, 780000, "Ships in 3 days"]] },

  { family: "BC547 NPN", brand: "ON Semi", thumb: "BC547", official: true,
    mpn: "BC547BTA", mcu: "",
    specs: "NPN · 100mA · 45V · 500mW · TO-92 · low noise amplifier",
    tags: ["transistor", "npn", "bjt", "bc547", "to-92", "through hole", "audio", "amplifier"],
    offers: [["DK", 0.18, 98000, "Ships today"], ["MO", 0.18, 74000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "2N3904 NPN", brand: "ON Semi", thumb: "2N3904", official: true,
    mpn: "2N3904TA", mcu: "",
    specs: "NPN · 200mA · 40V · 625mW · TO-92 · general purpose",
    tags: ["transistor", "npn", "bjt", "2n3904", "to-92", "through hole"],
    offers: [["DK", 0.15, 140000, "Ships today"], ["MO", 0.15, 110000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "TIP120 NPN Darlington", brand: "ST", thumb: "TIP120", official: true,
    mpn: "TIP120-AP", mcu: "",
    specs: "NPN Darlington · 5A · 60V · 65W · TO-220 · motor drive",
    tags: ["transistor", "npn", "darlington", "tip120", "to-220", "motor driver", "high current"],
    offers: [["DK", 0.62, 54000, "Ships today"], ["MO", 0.62, 41000, "Ships today"], ["LC", 0.08, 240000, "Ships in 3 days"]] },

  { family: "IRF540N N-Channel MOSFET", brand: "Infineon", thumb: "IRF540N", official: true,
    mpn: "IRF540NPBF", mcu: "",
    specs: "N-Ch · 33A · 100V · Rds=44mΩ · TO-220 · logic level drive",
    tags: ["mosfet", "n-channel", "irf540", "to-220", "switching", "power", "high current"],
    offers: [["DK", 1.62, 41000, "Ships today"], ["MO", 1.62, 32000, "Ships today"], ["LC", 0.28, 120000, "Ships in 3 days"]] },

  { family: "IRLZ44N N-Channel MOSFET", brand: "Infineon", thumb: "IRLZ44N", official: true,
    mpn: "IRLZ44NPBF", mcu: "",
    specs: "N-Ch logic-level · 47A · 55V · Rds=22mΩ · TO-220 · 3.3V/5V gate drive",
    tags: ["mosfet", "n-channel", "logic level", "irlz44n", "to-220", "switching", "power"],
    offers: [["DK", 1.64, 38000, "Ships today"], ["MO", 1.64, 29000, "Ships today"], ["LC", 0.30, 98000, "Ships in 3 days"]] },

  { family: "2N7000 N-Channel MOSFET", brand: "ON Semi", thumb: "2N7000", official: true,
    mpn: "2N7000", mcu: "",
    specs: "N-Ch · 200mA · 60V · TO-92 · logic-level gate · low-side switch",
    tags: ["mosfet", "n-channel", "2n7000", "to-92", "logic level", "small signal"],
    offers: [["DK", 0.38, 88000, "Ships today"], ["MO", 0.38, 62000, "Ships today"], ["LC", 0.03, 580000, "Ships in 3 days"]] },

  // ── DIODES ───────────────────────────────────────────────────────────────
  { family: "1N4007 rectifier diode", brand: "ON Semi", thumb: "1N4007", official: true,
    mpn: "1N4007RL", mcu: "",
    specs: "1A · 1000V · DO-41 · rectifier · reverse polarity protection",
    tags: ["diode", "rectifier", "1n4007", "do-41", "through hole", "protection"],
    offers: [["DK", 0.10, 280000, "Ships today"], ["MO", 0.10, 210000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "1N4148 signal diode", brand: "Diodes Inc", thumb: "1N4148", official: true,
    mpn: "1N4148W-7-F", mcu: "",
    specs: "200mA · 100V · SOD-123 · fast switching signal diode",
    tags: ["diode", "signal", "1n4148", "sod-123", "smd", "fast switching"],
    offers: [["DK", 0.10, 450000, "Ships today"], ["MO", 0.10, 340000, "Ships today"], ["LC", 0.005, 999999, "Ships in 3 days"]] },

  { family: "SS14 Schottky diode", brand: "Vishay", thumb: "SS14", official: true,
    mpn: "SS14-E3/61T", mcu: "",
    specs: "1A · 40V · SMA · Schottky · 0.4V forward voltage · flyback",
    tags: ["diode", "schottky", "ss14", "sma", "smd", "flyback", "low forward voltage"],
    offers: [["DK", 0.18, 280000, "Ships today"], ["MO", 0.18, 200000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "LED 5mm red", brand: "Kingbright", thumb: "LED red", official: true,
    mpn: "L-7113ID", mcu: "",
    specs: "5mm · red 660nm · 20mA · 2.0V Vf · 35° viewing angle",
    tags: ["led", "red", "5mm", "through hole", "indicator"],
    offers: [["DK", 0.14, 210000, "Ships today"], ["MO", 0.14, 160000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "LED 5mm green", brand: "Kingbright", thumb: "LED green", official: true,
    mpn: "L-7113GD", mcu: "",
    specs: "5mm · green 565nm · 20mA · 2.2V Vf · diffused",
    tags: ["led", "green", "5mm", "through hole", "indicator"],
    offers: [["DK", 0.14, 195000, "Ships today"], ["MO", 0.14, 148000, "Ships today"], ["LC", 0.01, 999999, "Ships in 3 days"]] },

  { family: "LED 5mm blue", brand: "Kingbright", thumb: "LED blue", official: true,
    mpn: "L-7113QBC-D", mcu: "",
    specs: "5mm · blue 470nm · 20mA · 3.5V Vf · diffused",
    tags: ["led", "blue", "5mm", "through hole", "indicator"],
    offers: [["DK", 0.25, 142000, "Ships today"], ["MO", 0.25, 108000, "Ships today"], ["LC", 0.02, 890000, "Ships in 3 days"]] },

  // ── LOGIC ICs ────────────────────────────────────────────────────────────
  { family: "74HC595 shift register", brand: "TI", thumb: "74HC595", official: true,
    mpn: "SN74HC595N", mcu: "",
    specs: "8-bit serial-in parallel-out · 3-state · SOIC-16 / DIP-16",
    tags: ["logic ic", "shift register", "74hc595", "dip", "serial", "spi", "io expander"],
    offers: [["DK", 0.54, 82000, "Ships today"], ["MO", 0.54, 61000, "Ships today"], ["LC", 0.07, 420000, "Ships in 3 days"]] },

  { family: "74HC165 shift register", brand: "TI", thumb: "74HC165", official: true,
    mpn: "SN74HC165N", mcu: "",
    specs: "8-bit parallel-in serial-out · DIP-16 · SPI input expander",
    tags: ["logic ic", "shift register", "74hc165", "dip", "spi", "io expander", "input"],
    offers: [["DK", 0.54, 62000, "Ships today"], ["MO", 0.54, 47000, "Ships today"], ["LC", 0.08, 310000, "Ships in 3 days"]] },

  { family: "74HC4051 mux/demux", brand: "NXP", thumb: "74HC4051", official: true,
    mpn: "74HC4051D,653", mcu: "",
    specs: "8-channel analog mux/demux · 3-bit select · SOIC-16",
    tags: ["logic ic", "mux", "multiplexer", "74hc4051", "smd", "analog switch"],
    offers: [["DK", 0.61, 48000, "Ships today"], ["MO", 0.61, 36000, "Ships today"], ["LC", 0.10, 220000, "Ships in 3 days"]] },

  { family: "NE555 timer", brand: "TI", thumb: "NE555", official: true,
    mpn: "NE555P", mcu: "",
    specs: "Timer · monostable & astable · 4.5–16V · DIP-8 · classic 555",
    tags: ["timer", "555", "ne555", "dip", "oscillator", "pwm", "through hole"],
    offers: [["DK", 0.36, 120000, "Ships today"], ["MO", 0.36, 91000, "Ships today"], ["LC", 0.03, 780000, "Ships in 3 days"]] },

  { family: "CD4017 decade counter", brand: "TI", thumb: "CD4017", official: true,
    mpn: "CD4017BE", mcu: "",
    specs: "Johnson decade counter · 10 decoded outputs · DIP-16 · 3–18V",
    tags: ["logic ic", "counter", "cd4017", "dip", "cmos", "sequencer"],
    offers: [["DK", 0.54, 72000, "Ships today"], ["MO", 0.54, 54000, "Ships today"], ["LC", 0.05, 350000, "Ships in 3 days"]] },

  // ── OP-AMPS ──────────────────────────────────────────────────────────────
  { family: "LM358 op-amp", brand: "TI", thumb: "LM358", official: true,
    mpn: "LM358P", mcu: "",
    specs: "Dual op-amp · 1 MHz GBW · single/dual supply · DIP-8",
    tags: ["op-amp", "lm358", "dip", "dual", "comparator", "amplifier"],
    offers: [["DK", 0.38, 180000, "Ships today"], ["MO", 0.38, 140000, "Ships today"], ["LC", 0.02, 999999, "Ships in 3 days"]] },

  { family: "LM393 comparator", brand: "TI", thumb: "LM393", official: true,
    mpn: "LM393P", mcu: "",
    specs: "Dual voltage comparator · open-collector · DIP-8 · 2–36V",
    tags: ["comparator", "lm393", "dip", "dual", "voltage comparator"],
    offers: [["DK", 0.38, 160000, "Ships today"], ["MO", 0.38, 120000, "Ships today"], ["LC", 0.02, 880000, "Ships in 3 days"]] },

  { family: "TL072 op-amp", brand: "TI", thumb: "TL072", official: true,
    mpn: "TL072CP", mcu: "",
    specs: "Dual JFET-input op-amp · 3 MHz GBW · low noise · DIP-8 · audio",
    tags: ["op-amp", "tl072", "dip", "dual", "jfet", "audio", "low noise"],
    offers: [["DK", 0.60, 94000, "Ships today"], ["MO", 0.60, 71000, "Ships today"], ["LC", 0.05, 410000, "Ships in 3 days"]] },

  { family: "LM324 op-amp", brand: "TI", thumb: "LM324", official: true,
    mpn: "LM324N", mcu: "",
    specs: "Quad op-amp · 1.2 MHz · single-supply 3–32V · DIP-14",
    tags: ["op-amp", "lm324", "dip", "quad", "single supply", "amplifier"],
    offers: [["DK", 0.54, 140000, "Ships today"], ["MO", 0.54, 105000, "Ships today"], ["LC", 0.04, 680000, "Ships in 3 days"]] },

  { family: "MCP6002 op-amp", brand: "Microchip", thumb: "MCP6002", official: true,
    mpn: "MCP6002-I/P", mcu: "",
    specs: "Dual rail-to-rail I/O · 1 MHz · 1.8–6V · DIP-8 · IoT/battery",
    tags: ["op-amp", "mcp6002", "dip", "rail-to-rail", "low voltage", "battery"],
    offers: [["DK", 0.52, 78000, "Ships today"], ["MO", 0.52, 59000, "Ships today"], ["LC", 0.08, 290000, "Ships in 3 days"]] },

  // ── CONNECTORS ───────────────────────────────────────────────────────────
  { family: "JST XH 2-pin connector", brand: "JST", thumb: "JST XH 2P", official: true,
    mpn: "B2B-XH-A(LF)(SN)", mcu: "",
    specs: "2-pos · 2.5mm pitch · through-hole · right-angle · battery connectors",
    tags: ["connector", "jst", "xh", "2.5mm", "2-pin", "through hole", "battery"],
    offers: [["DK", 0.17, 280000, "Ships today"], ["MO", 0.17, 210000, "Ships today"], ["LC", 0.03, 780000, "Ships in 3 days"]] },

  { family: "JST XH 3-pin connector", brand: "JST", thumb: "JST XH 3P", official: true,
    mpn: "B3B-XH-A(LF)(SN)", mcu: "",
    specs: "3-pos · 2.5mm pitch · through-hole · right-angle",
    tags: ["connector", "jst", "xh", "2.5mm", "3-pin", "through hole"],
    offers: [["DK", 0.22, 210000, "Ships today"], ["MO", 0.22, 160000, "Ships today"], ["LC", 0.04, 590000, "Ships in 3 days"]] },

  { family: "JST XH 4-pin connector", brand: "JST", thumb: "JST XH 4P", official: true,
    mpn: "B4B-XH-A(LF)(SN)", mcu: "",
    specs: "4-pos · 2.5mm pitch · through-hole · right-angle",
    tags: ["connector", "jst", "xh", "2.5mm", "4-pin", "through hole"],
    offers: [["DK", 0.26, 190000, "Ships today"], ["MO", 0.26, 142000, "Ships today"], ["LC", 0.05, 510000, "Ships in 3 days"]] },

  { family: "JST PH 2-pin connector", brand: "JST", thumb: "JST PH 2P", official: true,
    mpn: "B2B-PH-K-S(LF)(SN)", mcu: "",
    specs: "2-pos · 2.0mm pitch · through-hole · LiPo battery standard",
    tags: ["connector", "jst", "ph", "2mm", "2-pin", "lipo", "battery", "through hole"],
    offers: [["DK", 0.16, 320000, "Ships today"], ["MO", 0.16, 240000, "Ships today"], ["LC", 0.03, 890000, "Ships in 3 days"]] },

  { family: "USB Type-C SMD receptacle", brand: "GCT", thumb: "USB-C", official: true,
    mpn: "USB4125-GF-A", mcu: "",
    specs: "USB 2.0 Type-C · SMD · mid-mount 0.8mm · 5A rated",
    tags: ["connector", "usb", "usb-c", "type-c", "smd", "receptacle"],
    offers: [["DK", 0.54, 68000, "Ships today"], ["MO", 0.54, 51000, "Ships today"], ["LC", 0.09, 310000, "Ships in 3 days"]] },

  { family: "Micro USB type B SMD", brand: "Amphenol", thumb: "Micro USB", official: true,
    mpn: "10118194-0001LF", mcu: "",
    specs: "Micro USB type B · SMD · 5-pin · 1.8A · standard charging",
    tags: ["connector", "usb", "micro-usb", "smd", "receptacle", "charging"],
    offers: [["DK", 0.42, 91000, "Ships today"], ["MO", 0.42, 68000, "Ships today"], ["LC", 0.04, 650000, "Ships in 3 days"]] },

  { family: "DC barrel jack 5.5/2.1mm", brand: "CUI Devices", thumb: "DC Jack", official: true,
    mpn: "PJ-002A", mcu: "",
    specs: "5.5mm OD / 2.1mm ID · through-hole · 2.5A · panel mount",
    tags: ["connector", "dc jack", "barrel jack", "5.5mm", "2.1mm", "power", "through hole"],
    offers: [["DK", 0.79, 48000, "Ships today"], ["MO", 0.79, 36000, "Ships today"], ["LC", 0.10, 210000, "Ships in 3 days"]] },

  { family: "2.54mm male header 1×40", brand: "Sullins", thumb: "1×40 header", official: true,
    mpn: "PZC40SAAN", mcu: "",
    specs: "1×40 · 2.54mm · breakaway male · straight · gold flash",
    tags: ["connector", "header", "2.54mm", "pin header", "male", "through hole", "breakaway"],
    offers: [["DK", 0.52, 320000, "Ships today"], ["MO", 0.52, 240000, "Ships today"], ["LC", 0.05, 999999, "Ships in 3 days"]] },

  { family: "2.54mm female header 1×40", brand: "Sullins", thumb: "1×40 socket", official: true,
    mpn: "PPPC401LFBN-RC", mcu: "",
    specs: "1×40 · 2.54mm · breakaway female socket strip",
    tags: ["connector", "header", "socket", "2.54mm", "female", "through hole"],
    offers: [["DK", 0.72, 210000, "Ships today"], ["MO", 0.72, 160000, "Ships today"], ["LC", 0.08, 780000, "Ships in 3 days"]] },

  // ── CRYSTALS ─────────────────────────────────────────────────────────────
  { family: "16 MHz crystal", brand: "ABRACON", thumb: "16 MHz XTAL", official: true,
    mpn: "ABLS-16.000MHZ-B4-T", mcu: "",
    specs: "16.000 MHz · ±20ppm · 18pF · HC-49/US · through-hole",
    tags: ["crystal", "oscillator", "16mhz", "through hole", "clock", "arduino"],
    offers: [["DK", 0.36, 62000, "Ships today"], ["MO", 0.36, 47000, "Ships today"], ["LC", 0.06, 380000, "Ships in 3 days"]] },

  { family: "8 MHz crystal", brand: "ABRACON", thumb: "8 MHz XTAL", official: true,
    mpn: "ABLS-8.000MHZ-B4-T", mcu: "",
    specs: "8.000 MHz · ±20ppm · 18pF · HC-49/US · through-hole",
    tags: ["crystal", "oscillator", "8mhz", "through hole", "clock"],
    offers: [["DK", 0.36, 52000, "Ships today"], ["MO", 0.36, 39000, "Ships today"], ["LC", 0.06, 310000, "Ships in 3 days"]] },

  { family: "32.768 kHz crystal", brand: "ABRACON", thumb: "32kHz XTAL", official: true,
    mpn: "ABS07-32.768KHZ-T", mcu: "",
    specs: "32.768 kHz · ±20ppm · 7pF · SMD · RTC / low-power clock",
    tags: ["crystal", "oscillator", "32khz", "rtc", "smd", "clock", "real time clock"],
    offers: [["DK", 0.42, 78000, "Ships today"], ["MO", 0.42, 58000, "Ships today"], ["LC", 0.05, 450000, "Ships in 3 days"]] },

  // ── SENSORS ──────────────────────────────────────────────────────────────
  { family: "DHT11 temperature/humidity", brand: "AOSONG", thumb: "DHT11", official: true,
    mpn: "DHT11", mcu: "",
    specs: "Temperature 0–50°C ±2°C · Humidity 20–80% ±5% · single-wire · 4-pin",
    tags: ["sensor", "temperature", "humidity", "dht11", "through hole", "environmental"],
    offers: [["DK", 5.40, 28000, "Ships today"], ["MO", 5.40, 20000, "Ships today"], ["LC", 0.69, 92000, "Ships in 3 days"]] },

  { family: "DHT22 temperature/humidity", brand: "AOSONG", thumb: "DHT22", official: true,
    mpn: "AM2302", mcu: "",
    specs: "Temperature −40–80°C ±0.5°C · Humidity 0–100% ±2–5% · single-wire",
    tags: ["sensor", "temperature", "humidity", "dht22", "am2302", "through hole", "environmental"],
    offers: [["DK", 9.60, 18000, "Ships today"], ["MO", 9.60, 14000, "Ships today"], ["LC", 2.20, 54000, "Ships in 3 days"]] },

  { family: "DS18B20 temperature sensor", brand: "Maxim", thumb: "DS18B20", official: true,
    mpn: "DS18B20+", mcu: "",
    specs: "−55–125°C · ±0.5°C · 1-Wire · 9–12 bit · TO-92 · waterproof-ready",
    tags: ["sensor", "temperature", "ds18b20", "1-wire", "to-92", "through hole", "waterproof"],
    offers: [["DK", 2.14, 42000, "Ships today"], ["MO", 2.14, 32000, "Ships today"], ["LC", 0.62, 180000, "Ships in 3 days"]] },

  { family: "HC-SR04 ultrasonic sensor", brand: "Elecrow", thumb: "HC-SR04", official: false,
    mpn: "HC-SR04", mcu: "",
    specs: "2–400 cm · ±3mm · 5V · 15mA · trig+echo · through-hole module",
    tags: ["sensor", "ultrasonic", "distance", "hc-sr04", "module", "proximity"],
    offers: [["LC", 0.69, 88000, "Ships in 3 days"], ["AZ", 5.99, 999, "Prime · 1 day"]] },

  { family: "MPU-6050 IMU", brand: "TDK InvenSense", thumb: "MPU-6050", official: true,
    mpn: "MPU-6050", mcu: "",
    specs: "3-axis accel + 3-axis gyro · I2C/SPI · QFN-24 · 3.3–5V · 6-DOF",
    tags: ["sensor", "imu", "accelerometer", "gyroscope", "mpu6050", "i2c", "smd"],
    offers: [["DK", 8.40, 16000, "Ships today"], ["MO", 8.40, 12000, "Ships today"], ["LC", 0.88, 62000, "Ships in 3 days"]] },

  { family: "BMP280 pressure/temperature", brand: "Bosch", thumb: "BMP280", official: true,
    mpn: "BMP280", mcu: "",
    specs: "300–1100 hPa · ±1 hPa · −40–85°C · I2C/SPI · LGA-8 SMD",
    tags: ["sensor", "pressure", "barometric", "temperature", "bmp280", "i2c", "smd", "altitude"],
    offers: [["DK", 3.40, 28000, "Ships today"], ["MO", 3.40, 21000, "Ships today"], ["LC", 0.48, 140000, "Ships in 3 days"]] },

  { family: "ACS712-5A current sensor", brand: "Allegro", thumb: "ACS712", official: true,
    mpn: "ACS712ELCTR-05B-T", mcu: "",
    specs: "±5A · 185mV/A · SOIC-8 · isolated Hall-effect · DC/AC current",
    tags: ["sensor", "current sensor", "acs712", "hall effect", "smd", "soic"],
    offers: [["DK", 2.82, 28000, "Ships today"], ["MO", 2.82, 21000, "Ships today"], ["LC", 0.58, 91000, "Ships in 3 days"]] },

  { family: "LM35 temperature sensor", brand: "TI", thumb: "LM35", official: true,
    mpn: "LM35DZ/NOPB", mcu: "",
    specs: "0–100°C · 10mV/°C · TO-92 · no calibration needed · linear output",
    tags: ["sensor", "temperature", "lm35", "analog", "to-92", "through hole"],
    offers: [["DK", 1.68, 48000, "Ships today"], ["MO", 1.68, 36000, "Ships today"], ["LC", 0.22, 210000, "Ships in 3 days"]] },

  // ── MOTOR DRIVERS & MOTORS ───────────────────────────────────────────────
  { family: "A4988 stepper driver", brand: "Allegro", thumb: "A4988", official: true,
    mpn: "A4988SETTR-T", mcu: "",
    specs: "Bipolar stepper · up to 35V · 2A/phase · 1/16 microstepping · SPI",
    tags: ["motor driver", "stepper", "a4988", "cnc", "smd", "bipolar"],
    offers: [["DK", 3.98, 18000, "Ships today"], ["MO", 3.98, 14000, "Ships today"], ["LC", 0.48, 78000, "Ships in 3 days"]] },

  { family: "DRV8825 stepper driver", brand: "TI", thumb: "DRV8825", official: true,
    mpn: "DRV8825PWPR", mcu: "",
    specs: "Bipolar stepper · 45V · 2.5A/phase · 1/32 microstepping · thermal shutdown",
    tags: ["motor driver", "stepper", "drv8825", "cnc", "smd", "bipolar", "3d printer"],
    offers: [["DK", 3.93, 14000, "Ships today"], ["MO", 3.93, 11000, "Ships today"], ["LC", 0.55, 62000, "Ships in 3 days"]] },

  { family: "L298N dual H-bridge", brand: "ST", thumb: "L298N", official: true,
    mpn: "L298N", mcu: "",
    specs: "Dual H-bridge · 46V · 2A per channel · DIP-15 / Multiwatt · DC & stepper",
    tags: ["motor driver", "h-bridge", "l298n", "dc motor", "stepper", "through hole", "robot"],
    offers: [["DK", 2.91, 24000, "Ships today"], ["MO", 2.91, 18000, "Ships today"], ["LC", 0.34, 120000, "Ships in 3 days"]] },

  { family: "L293D quad H-bridge", brand: "TI", thumb: "L293D", official: true,
    mpn: "L293DNE", mcu: "",
    specs: "Quad H-bridge · 36V · 600mA per channel · DIP-16 · with flyback diodes",
    tags: ["motor driver", "h-bridge", "l293d", "dc motor", "stepper", "dip", "robot"],
    offers: [["DK", 2.54, 32000, "Ships today"], ["MO", 2.54, 24000, "Ships today"], ["LC", 0.28, 140000, "Ships in 3 days"]] },

  { family: "SG90 micro servo", brand: "Tower Pro", thumb: "SG90", official: true,
    mpn: "SG90", mcu: "",
    specs: "180° · 1.8 kg·cm · 4.8V · 22g · PWM 50Hz · 9×12×20 mm",
    tags: ["servo", "motor", "sg90", "micro servo", "pwm", "robot", "rc"],
    offers: [["LC", 1.40, 82000, "Ships in 3 days"], ["AZ", 4.99, 999, "Prime · 1 day"]] },

  { family: "MG996R high-torque servo", brand: "Tower Pro", thumb: "MG996R", official: true,
    mpn: "MG996R", mcu: "",
    specs: "180° · 11 kg·cm · 4.8–7.2V · 55g · metal gear · PWM",
    tags: ["servo", "motor", "mg996r", "high torque", "metal gear", "pwm", "robot"],
    offers: [["LC", 2.80, 54000, "Ships in 3 days"], ["AZ", 9.99, 780, "Prime · 1 day"]] },

  { family: "NEMA17 stepper motor", brand: "Generic", thumb: "NEMA17", official: false,
    mpn: "17HS4401", mcu: "",
    specs: "4-wire · 1.7A · 40 N·cm · 1.8°/step · 42×42×40 mm · 3D printer",
    tags: ["motor", "stepper", "nema17", "bipolar", "4-wire", "cnc", "3d printer"],
    offers: [["LC", 5.80, 32000, "Ships in 3 days"], ["AZ", 12.99, 560, "Prime · 1 day"]] },

  // ── DISPLAYS ─────────────────────────────────────────────────────────────
  { family: "SSD1306 0.96\" OLED I2C", brand: "Generic", thumb: "OLED 0.96\"", official: false,
    mpn: "SSD1306-I2C-096", mcu: "SSD1306",
    specs: "128×64 · I2C · 3.3/5V · white/blue · 0.96 inch · OLED module",
    tags: ["display", "oled", "ssd1306", "i2c", "128x64", "module"],
    offers: [["LC", 1.80, 42000, "Ships in 3 days"], ["AZ", 5.99, 999, "Prime · 1 day"], ["AD", 4.95, 380, "In stock"]] },

  { family: "SSD1306 1.3\" OLED I2C", brand: "Generic", thumb: "OLED 1.3\"", official: false,
    mpn: "SH1106-I2C-130", mcu: "SH1106",
    specs: "128×64 · I2C · 3.3/5V · white · 1.3 inch · OLED module",
    tags: ["display", "oled", "sh1106", "i2c", "128x64", "module", "1.3 inch"],
    offers: [["LC", 2.40, 28000, "Ships in 3 days"], ["AZ", 7.99, 680, "Prime · 1 day"]] },

  { family: "16×2 LCD I2C module", brand: "Generic", thumb: "LCD 16×2", official: false,
    mpn: "LCD1602-I2C-BACKPACK", mcu: "HD44780",
    specs: "16 chars × 2 lines · I2C backpack · PCF8574 · 5V · HD44780 controller",
    tags: ["display", "lcd", "16x2", "i2c", "hd44780", "character display", "module"],
    offers: [["LC", 1.20, 62000, "Ships in 3 days"], ["AZ", 6.99, 840, "Prime · 1 day"], ["AD", 9.95, 210, "In stock"]] },

  { family: "ST7735 1.8\" TFT SPI", brand: "Adafruit", thumb: "TFT 1.8\"", official: true,
    mpn: "AD-358", mcu: "ST7735",
    specs: "128×160 · SPI · 3.3V · 1.8 inch · 262K colors · microSD slot",
    tags: ["display", "tft", "spi", "st7735", "color", "1.8 inch", "module"],
    offers: [["AD", 14.95, 340, "In stock"], ["SF", 15.95, 220, "1–2 days"]] },

  // ── EEPROM / MEMORY ──────────────────────────────────────────────────────
  { family: "24LC256 EEPROM", brand: "Microchip", thumb: "24LC256", official: true,
    mpn: "24LC256-I/P", mcu: "",
    specs: "256 Kbit (32 KB) · I2C · 2.5–5.5V · 1M write cycles · DIP-8",
    tags: ["memory", "eeprom", "i2c", "24lc256", "storage", "dip", "non-volatile"],
    offers: [["DK", 1.22, 48000, "Ships today"], ["MO", 1.22, 36000, "Ships today"], ["LC", 0.28, 180000, "Ships in 3 days"]] },

  { family: "AT24C32 EEPROM", brand: "Microchip", thumb: "AT24C32", official: true,
    mpn: "AT24C32E-SSHM-B", mcu: "",
    specs: "32 Kbit (4 KB) · I2C · 2.5–5.5V · SOIC-8 · RTC module companion",
    tags: ["memory", "eeprom", "i2c", "at24c32", "smd", "soic", "rtc"],
    offers: [["DK", 0.42, 72000, "Ships today"], ["MO", 0.42, 54000, "Ships today"], ["LC", 0.05, 420000, "Ships in 3 days"]] },

  // ── REAL TIME CLOCKS ─────────────────────────────────────────────────────
  { family: "DS3231 RTC", brand: "Maxim", thumb: "DS3231", official: true,
    mpn: "DS3231SN#", mcu: "",
    specs: "I2C · ±2ppm accuracy · temperature-compensated · SOIC-16 · 2.3–5.5V",
    tags: ["rtc", "real time clock", "ds3231", "i2c", "smd", "accurate"],
    offers: [["DK", 8.88, 18000, "Ships today"], ["MO", 8.88, 14000, "Ships today"], ["LC", 0.68, 72000, "Ships in 3 days"]] },

  { family: "PCF8523 RTC", brand: "NXP", thumb: "PCF8523", official: true,
    mpn: "PCF8523T/1,112", mcu: "",
    specs: "I2C · 1.8–5.5V · SOIC-8 · 32.768kHz xtal · Adafruit feather",
    tags: ["rtc", "real time clock", "pcf8523", "i2c", "smd", "low power"],
    offers: [["DK", 0.72, 42000, "Ships today"], ["MO", 0.72, 31000, "Ships today"], ["LC", 0.20, 180000, "Ships in 3 days"]] },

  // ── WIRELESS MODULES ─────────────────────────────────────────────────────
  { family: "HC-05 Bluetooth module", brand: "Wavesen", thumb: "HC-05", official: false,
    mpn: "HC-05", mcu: "",
    specs: "Bluetooth 2.0 · UART · 3.3V logic · +4 dBm · master/slave · AT commands",
    tags: ["bluetooth", "wireless", "hc-05", "uart", "module", "serial"],
    offers: [["LC", 3.40, 28000, "Ships in 3 days"], ["AZ", 8.99, 640, "Prime · 1 day"]] },

  { family: "HC-06 Bluetooth module", brand: "Wavesen", thumb: "HC-06", official: false,
    mpn: "HC-06", mcu: "",
    specs: "Bluetooth 2.0 · UART · slave only · 3.3V · simpler setup than HC-05",
    tags: ["bluetooth", "wireless", "hc-06", "uart", "module", "serial"],
    offers: [["LC", 2.80, 36000, "Ships in 3 days"], ["AZ", 6.99, 820, "Prime · 1 day"]] },

  { family: "nRF24L01+ transceiver", brand: "Nordic Semi", thumb: "nRF24L01+", official: true,
    mpn: "NRF24L01+", mcu: "",
    specs: "2.4 GHz · SPI · 250kbps–2Mbps · −6 to +4 dBm · 1.9–3.6V",
    tags: ["wireless", "rf", "2.4ghz", "nrf24l01", "spi", "module", "transceiver"],
    offers: [["LC", 0.48, 82000, "Ships in 3 days"], ["AZ", 3.99, 999, "Prime · 1 day"]] },

];
