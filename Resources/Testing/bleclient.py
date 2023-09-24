import asyncio
from bleak import BleakClient

address = "28:CD:C1:07:1D:9A"

async def main(address):
	async with BleakClient(address) as client:
		# Read a characteristic, etc.
		print(f"Connected: {client.is_connected}")

		paired = await client.pair(protection_level=2)
		print(f"Paired: {paired}")

	# Device will disconnect when block exits.
# Using asyncio.run() is important to ensure that device disconnects on
# KeyboardInterrupt or other unhandled exception.
asyncio.run(main(address))
