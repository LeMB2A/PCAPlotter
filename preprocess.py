from concurrent.futures import ProcessPoolExecutor
import json
import os
from pyshark import FileCapture
import datetime

# Output file
JSON_FILE = "./pcap-analyser/src/preprocessed_dataset.json"

# Number of CPU cores
nbr_workers = os.cpu_count()

def process_packet(packet):
    """Process an individual packet to extract relevant data."""
    try:
        size = int(getattr(packet, "length", 0))
        if size == 0:
            return None

        timestamp = float(packet.sniff_timestamp) # In seconds (s)
        uplink_bits = 0
        downlink_bits = 0
        protocol = None

        # Determining uplink/downlink and protocol
        """Client IP is 10.1.111.2 and Server IP is 10.1.111.1 as most communications follows the direction Server --> Client (Wireshark > Statistics > Conversations)"""
        if hasattr(packet, "ip"):
            if getattr(packet.ip, "src", "") == "10.1.111.2": 
                uplink_bits = size * 8
            elif getattr(packet.ip, "dst", "") == "10.1.111.2":
                downlink_bits = size * 8

            # Check for TCP or UDP
            if hasattr(packet, "tcp"):
                protocol = "TCP"
            elif hasattr(packet, "udp"):
                protocol = "UDP"

        return {
            "size": size,
            "timestamp": timestamp,
            "uplink_bits": uplink_bits,
            "downlink_bits": downlink_bits,
            "protocol": protocol,
        }
    except Exception as e:
        print(f"Error processing packet: {e}")
        return None

def process_pcap(file_path):
    """Processing a single PCAP file without thread-level parallelization."""
    try:
        cap = FileCapture(file_path)
        print(f"Processing PCAP file: {file_path}")
        results = []

        # Processing packets sequentially
        for packet in cap:
            packet_data = process_packet(packet)
            if packet_data:
                results.append(packet_data)

        cap.close() # Closing the PCAP to free memory

        # Aggregating packet-level data
        packet_sizes = [r["size"] for r in results]
        interarrival_times = [
            results[i]["timestamp"] - results[i - 1]["timestamp"]
            for i in range(1, len(results))
        ]
        avg_interarrival_time = sum(interarrival_times) / len(interarrival_times) if interarrival_times else 0
        uplink_bits = sum(r["uplink_bits"] for r in results)
        downlink_bits = sum(r["downlink_bits"] for r in results)
        total_size_bytes = sum(packet_sizes)
        total_size_mb = total_size_bytes / (1024 * 1024)  # Bytes to MB
        avg_packet_size = total_size_bytes / len(packet_sizes) if packet_sizes else 0

        # Determining the dominant protocol (TCP or UDP)
        protocol_counts = {"TCP": 0, "UDP": 0}
        for r in results:
            if r["protocol"] in protocol_counts:
                protocol_counts[r["protocol"]] += 1
        dominant_protocol = max(protocol_counts, key=protocol_counts.get)

        # Calculating total duration
        if results:
            start_time = results[0]["timestamp"]
            end_time = results[-1]["timestamp"]
            duration = end_time - start_time
        else:
            duration = 1

        return {
            "packet_sizes": packet_sizes,
            "interarrival_times": [t * 1000 for t in interarrival_times],  # s to ms
            "uplink_bitrate": (uplink_bits / duration) / 1_000_000 if duration > 0 else 0,
            "downlink_bitrate": (downlink_bits / duration) / 1_000_000 if duration > 0 else 0,
            "total_size_mb": total_size_mb,
            "avg_packet_size": avg_packet_size,
            "avg_interarrival_time": avg_interarrival_time * 1000,  # s to ms
            "dominant_protocol": dominant_protocol,
        }
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def process_app(app_path):
    """Processing all PCAP files within an app using process-level parallelization."""
    pcap_files = [
        os.path.join(app_path, f)
        for f in os.listdir(app_path)
        if f.endswith(".pcap")
    ]

    pcaps = []
    with ProcessPoolExecutor(max_workers=nbr_workers) as executor:
        results = list(filter(None, executor.map(process_pcap, pcap_files)))

    total_sizes = []  # Total sizes of PCAPs in MB
    dominant_protocols = []  # Dominant protocols for each PCAP
    for i, pcap_data in enumerate(results):
        total_sizes.append(pcap_data["total_size_mb"])
        dominant_protocols.append(pcap_data["dominant_protocol"])
        pcaps.append({
            "pcap_file": pcap_files[i],
            **pcap_data,
        })

    # Aggregating app-level metrics
    if pcaps:
        # Determining the overall dominant protocol for the app
        protocol_counts = {"TCP": 0, "UDP": 0}
        for protocol in dominant_protocols:
            protocol_counts[protocol] += 1
        overall_dominant_protocol = max(protocol_counts, key=protocol_counts.get)

        average = {
            "packet_size_avg": sum(p["avg_packet_size"] for p in pcaps) / len(pcaps),
            "uplink_bitrate": sum(p["uplink_bitrate"] for p in pcaps) / len(pcaps),
            "downlink_bitrate": sum(p["downlink_bitrate"] for p in pcaps) / len(pcaps),
            "interarrival_time_avg": sum(p["avg_interarrival_time"] for p in pcaps) / len(pcaps),
            "average_pcap_size_mb": sum(total_sizes) / len(total_sizes),
            "dominant_protocol": overall_dominant_protocol,
        }
        return {
            "average": average,
            "pcaps": pcaps,
        }

    return None

def preprocess_dataset(dataset_dir):
    """Preprocess the entire dataset and save the result to a JSON file."""
    apps_data = {}

    for app_name in os.listdir(dataset_dir):
        app_path = os.path.join(dataset_dir, app_name)
        if not os.path.isdir(app_path):
            continue

        app_data = process_app(app_path)
        if app_data:
            apps_data[app_name] = app_data
            print(f"Finished processing app: {app_name}!")

    # Saving to JSON
    with open(JSON_FILE, "w") as f:
        json.dump(apps_data, f, indent=4)

    print(f"Dataset processed and saved to {JSON_FILE}")

if __name__ == "__main__":
    start = datetime.datetime.now()
    preprocess_dataset("dataset-pcap")
    print(f"The program took: {datetime.datetime.now() - start} to finish")