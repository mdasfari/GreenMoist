# GreenMoist
IoT AUTO Irrigation System

Traditionally, Irrigation taken by farmer manually and it is a timely operation and labor intensive. Besides that, a lot of soil moist metering, watering, weather checking, and other tasks are involved which can be strategically automated for such a valuable task and yet a lengthy one. Water is a very expensive resource and conserving it is a big benefit which should be taken into consideration. This solution is to overcome some of these obstacles and automate the irrigation task effortlessly. 

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Database](#installation)
- [Installation](#installation)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Getting Started

You need to install all [prerequisites](#prerequisites) to running the system.

***Warning*** it is important to create database objects before run the system.

follow the [installation](#installation)

Please report any issue in the issues

### Prerequisites

* [MariaDB](https://mariadb.org/)
* [Node.Js](https://nodejs.org/)
* [Micropython for Raspberry Pico](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html)
* [Thonny](https://thonny.org/)

#### Optional - for editing
* [Microsoft Visual Code](https://code.visualstudio.com/?wt.mc_id=DX_841432)

### Database

**Users Table**
```
CREATE TABLE `users` (`UserID` INT(11) NOT NULL AUTO_INCREMENT
                        , `Username` VARCHAR(50) NOT NULL
                        , `Color` VARCHAR(50) NULL DEFAULT null
                        , PRIMARY KEY (`UserID`) USING BTREE);
```

**Tasks Table**
```
CREATE TABLE `tasks` (
	TaskID int not null auto_increment,
	Name varchar(100) not null, 
	primary key(TaskID) using btree);
```

**Task processes Table**
```
CREATE TABLE `taskprocesses` (
	`ProcessID` INT(11) NOT NULL AUTO_INCREMENT,
	`TaskID` INT(11) NOT NULL,
	`ProcessSerial` INT(11) NOT NULL,
	`ProcessType` TINYINT(4) NOT NULL DEFAULT '0',
	`Name` VARCHAR(50) NOT NULL,
	`Pin` INT(11) NULL DEFAULT NULL,
	`PinType` TINYINT(4) NULL DEFAULT NULL,
	`SerialOutRawData` BIT(1) NOT NULL,
	`BroadcastValue` BIT(1) NOT NULL,
	`ThresholdLow` INT(11) NULL DEFAULT NULL,
	`ThresholdHigh` INT(11) NULL DEFAULT NULL,
	`ChangeRange` INT(11) NULL DEFAULT NULL,
	`TrueProcessType` TINYINT(4) NULL DEFAULT NULL,
	`TrueProcessID` INT(11) NULL DEFAULT NULL,
	`FalseProcessType` TINYINT(4) NULL DEFAULT NULL,
	`TrueDebugMessage` VARCHAR(50) NULL DEFAULT NULL,
	`FalseProcessID` INT(11) NULL DEFAULT NULL,
	`FalseDebugMessage` VARCHAR(50) NULL DEFAULT NULL,
	`ActionType` BIT(1) NOT NULL,
	PRIMARY KEY (`ProcessID`) USING BTREE,
	INDEX `FK_PROCESS_TASK` (`TaskID`) USING BTREE,
	INDEX `FK_PROCESS_FALSE_PROCESS` (`FalseProcessID`) USING BTREE,
	INDEX `FK_PROCESS_TRUE_PROCESS` (`TrueProcessID`) USING BTREE,
	CONSTRAINT `FK_PROCESS_FALSE_PROCESS` FOREIGN KEY (`FalseProcessID`) REFERENCES `taskprocesses` (`ProcessID`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_PROCESS_TASK` FOREIGN KEY (`TaskID`) REFERENCES `tasks` (`TaskID`) ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT `FK_PROCESS_TRUE_PROCESS` FOREIGN KEY (`TrueProcessID`) REFERENCES `taskprocesses` (`ProcessID`) ON UPDATE NO ACTION ON DELETE NO ACTION);
```

**Devices Table**
```
CREATE TABLE `devices` (
	`DeviceID` INT(11) NOT NULL AUTO_INCREMENT,
	`Name` VARCHAR(50) NOT NULL,
	`RemoteAddress` VARCHAR(15) NULL DEFAULT NULL,
	`RemotePort` INT(11) NULL DEFAULT NULL,
	`SerialNumber` VARCHAR(50) NULL DEFAULT NULL,
	`Version` FLOAT NOT NULL,
	PRIMARY KEY (`DeviceID`) USING BTREE);
```

**Device records Table**
```
CREATE TABLE `devicerecords` (
		`RecordID` INT(11) NOT NULL AUTO_INCREMENT,
		`DeviceID` INT(11) NOT NULL,
		`RecordDate` DATETIME NOT NULL DEFAULT curdate(),
		`ProcessID` INT(11) NOT NULL,
		`ProcessType` INT(11) NOT NULL,
		`Pin` INT(11) NOT NULL,
		`PinType` INT(11) NOT NULL,
		`DebugMessage` INT(11) NULL DEFAULT NULL,
		`Value` INT(11) NOT NULL,
		`ThresholdLow` INT(11) NULL DEFAULT NULL,
		`ThresholdHigh` INT(11) NULL DEFAULT NULL,
		PRIMARY KEY (`RecordID`) USING BTREE,
		INDEX `FK_DEVICE_RECORDS_DEVIDE_ID` (`DeviceID`) USING BTREE,
		INDEX `FK_DEVICES_RECORDS_PROCESS_ID` (`ProcessID`) USING BTREE,
		CONSTRAINT `FK_DEVICES_RECORDS_PROCESS_ID` FOREIGN KEY (`ProcessID`) REFERENCES `taskprocesses` (`ProcessID`) ON UPDATE NO ACTION ON DELETE NO ACTION,
		CONSTRAINT `FK_DEVICE_RECORDS_DEVIDE_ID` FOREIGN KEY (`DeviceID`) REFERENCES `devices` (`DeviceID`) ON UPDATE NO ACTION ON DELETE CASCADE);
```

### Installation

**Server Node**

go to root folder of your choice,

```
git clone https://github.com/mdasfari/GreenMoist.git
cd GreenMoist
npm install
npm start
```

---

**Active Node**

copy main.py from ActiveNode folder to Pico W
and create and copy *app.cfg* to Pico too as the following:

```
{"Host": {"Hostname": "serveraddress", "Port": *port*}
  , "Network": [{"ssid": "*your ssid*", "pwd": "*your password*"}]
  , "OSUpdate": **true**
  , "Version": 1.0
  , "Device": {"DeviceID": **DeviceID from database**, "Name": "**anything at the moment**"}}
```

When the Pico run it will send a request to the server to download all files.

Once finished, and after creating Task from the ServerNode, go to Devices and select the device then select the desired task and send the update. Pico will update and restart and will follow your Task.

### Author

* **Mohammad ASFARi, MBA**

### Acknowledgments

* Thanks to University of London for the valuable materials especially [CM-3040 - Physical Computing](https://github.com/world-class/REPL/tree/master/modules/level-6/cm-3040-physical-computing-iot)

