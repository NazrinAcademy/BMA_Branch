
# import wmi
# import pythoncom


# def get_hardware_details():
#     pythoncom.CoInitialize()  # Initialize COM for WMI
#     c = wmi.WMI()

#     # Get Motherboard Serial Number
#     motherboard = c.Win32_BaseBoard()[0].SerialNumber.strip()

#     # Get Hard Disk Serial Number
#     hard_disk = c.Win32_DiskDrive()[0].SerialNumber.strip()

#     # Get CPU ID
#     cpu = c.Win32_Processor()[0].ProcessorId.strip()

#     # Get MAC Address
#     # mac_address = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) for elements in range(0,2*6,2)][::-1])

#     # # Get Hostname
#     # hostname = socket.gethostname()

#     pythoncom.CoUninitialize()  # Cleanup COM

#     return {
#         "motherboard_id": motherboard,
#         "hard_disk": hard_disk,
#         "cpu": cpu,
#         # "mac_address": mac_address,
#         # "hostname": hostname
#     }

# # **Call the function and print the result**
# if __name__ == "__main__":
#     hardware_info = get_hardware_details()
#     print(hardware_info)

# # # ----------------------------
# # # import requests

# # # VERIFIED_PROJECT_API = "https://b0ca-122-174-230-58.ngrok-free.app/api/verify_hardware/"

# # # def send_hardware_info(username, key):
# # #     hardware_details = get_hardware_details()

# # #     data = {
# # #         "username": username,
# # #         "key": key,
# # #         "hardware_details": hardware_details
# # #     }
     
# # #     response = requests.post(VERIFIED_PROJECT_API, json=data)
    
# # #     return response.json()
# # # ----------

# # import requests

# # url = "https://df6f-122-173-109-38.ngrok-free.app/api/verify_hardware/"

# # headers = {'Content-Type': 'application/json'}
# # def send_hardware_info(username, key ,hardware_details):
# #     hardware_details = get_hardware_details()
    
# #     data = {
# #         "username": username,
# #         "key": key,
# #         "hardware_details": hardware_details
# #     }
    
# #     print("Sending Data to Verified Project:", data)  # Debugging
    
# #     response = requests.post(url, json=data ,headers=headers)
# #     print(f"🔹 Response from Verified Project: {response.status_code}, {response.json()}")  # Debugging
    
# #     return response.json()

# # import platform
# # import subprocess

# # def get_system_info():
# #     cpu_id = platform.processor()

# #     # Get Hard Disk ID
# #     hard_disk_id = "Unknown"
# #     try:
# #         result = subprocess.run(["wmic", "diskdrive", "get", "SerialNumber"], capture_output=True, text=True)
# #         lines = result.stdout.strip().split("\n")
# #         print("Raw Hard Disk Output:", lines)  # Debugging
# #         if len(lines) > 1:
# #             hard_disk_id = lines[1].strip()
# #     except Exception as e:
# #         hard_disk_id = f"Error: {e}"

# #     # Get Motherboard ID
# #     motherboard_id = "Unknown"
# #     try:
# #         result = subprocess.run(["wmic", "baseboard", "get", "SerialNumber"], capture_output=True, text=True)
# #         lines = result.stdout.strip().split("\n")
# #         print("Raw Motherboard Output:", lines)  # Debugging
# #         if len(lines) > 1:
# #             motherboard_id = lines[1].strip()
# #     except Exception as e:
# #         motherboard_id = f"Error: {e}"

# #     return {
# #         "CPU_ID": cpu_id,
# #         "Motherboard_ID": motherboard_id,
# #         "Hard_Disk_ID": hard_disk_id
# #     }

# # # Run and test
# # if __name__ == "__main__":
# #     info = get_system_info()
# #     print(info)


