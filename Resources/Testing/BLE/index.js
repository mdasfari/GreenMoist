const noble = require('@abandonware/noble');

console.log("Hello World!!! - application start here");

noble.on('stateChange', async (state)=> {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    await noble.startScanningAsync(); //[pizzaServiceUuid], false);
  }
  else {
    noble.stopScanning();
  }
})

noble.on('discover', async (peripheral)=> {
	if(peripheral.address == '28:cd:c1:07:1d:9a' && peripheral.connectable){
		console.log(`${peripheral.address} (${peripheral.advertisement.localName})`);
		console.log(peripheral);

		console.log("Stop Scanning");
		await noble.stopScanningAsync();

		console.log("Connect to peripheral");
		await peripheral.connectAsync();

		console.log("Write Message");
		await peripheral.discoverServicesAsync((error, services) => {
			// callback - handle error and services

		});


		//await noble. peripheral.disconnectAsync();
		//await noble.startScanningAsync();
	}
})

noble.on('servicesDiscover', async (services)=>{


})


