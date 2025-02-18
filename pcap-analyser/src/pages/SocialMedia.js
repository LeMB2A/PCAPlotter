import React from 'react';
import { useEffect } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar} from 'react-chartjs-2';
import { useState } from 'react';
import "./SocialMedia.css"

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


const SocialMedia = ({ appName, data }) => {
  const [selectedPcap, setSelectedPcap] = useState(null);

  // Automatically select the first PCAP when the app changes
  useEffect(() => {
    if (data.length > 0) {
      setSelectedPcap(data[0]); // Set first PCAP as default
    }
  }, [appName, data]); // Runs when appName or data.pcaps changes


  // Handle dropdown selection
  const handlePcapChange = (event) => {
    const selectedFile = data.find((pcap) => pcap.pcap_file === event.target.value);
    setSelectedPcap(selectedFile);
  };

  // Dropdown options for PCAP files
  const pcapOptions = data.map((pcap) => (
    <option key={pcap.pcap_file} value={pcap.pcap_file}>
      {pcap.pcap_file.split('/')[2]}
    </option>
  ));

  // Generate chart data
  const generateChartData = (label, values, color) => ({
    labels: values.map((_, index) => index + 1),
    datasets: [
      {
        label,
        data: values,
        backgroundColor: color,
        borderColor: color,
        fill: false,
      },
    ],
  });

  // Generate chart data for multiple datasets (e.g bitrates)
  const generateMultiChartData = (labels, datasets) => ({
    labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.color,
      borderColor: dataset.color,
      fill: false,
    })),
  });

  // Prepare averaged data for graphs
  const pcapLabels = data.map((pcap, index) => `PCAP ${index + 1}`);
  const pcapSizes = data.map((pcap) => pcap.total_size_mb);
  const avgPacketSizes = data.map((pcap) => pcap.avg_packet_size);
  const avgInterarrivalTimes = data.map((pcap) => pcap.avg_interarrival_time);
  const uplinkBitrates = data.map((pcap) => pcap.uplink_bitrate);
  const downlinkBitrates = data.map((pcap) => pcap.downlink_bitrate);

  return (
    <div className='social-media'>
      {/* Averages Section */}
      <div className='chart-row'>
        <h2>Data of {appName[0].toUpperCase() + appName.slice(1)}'s PCAPs</h2>

        <div className='chart-container'>
          <h4>File Size per PCAP</h4>
          <Bar
            data={generateChartData(
              "PCAP File Sizes (Mb)",
              pcapSizes,
              "rgba(75, 192, 192, 1)"
            )}
            options={{
              plugins: {
                datalabels: {
                  display: false, // Hide values
                },
              },
            }}
          />
        </div>

        <div className='chart-container'>
          <h4>Average Packet Size per PCAP</h4>
          <Bar
            data={generateChartData(
              "Average Packet Sizes (Bytes)",
              avgPacketSizes,
              "rgba(75, 192, 192, 1)"
            )}
            options={{
              plugins: {
                datalabels: {
                  display: false, // Hide values
                },
              },
            }}
          />
        </div>

        <div className='chart-container'>
          <h4>Bitrates per PCAP</h4>
          <Line
            data={generateMultiChartData(pcapLabels, [
              {
                label: "Uplink Bitrate (Mbps)",
                data: uplinkBitrates,
                color: "rgba(54, 162, 235, 1)",
              },
              {
                label: "Downlink Bitrate (Mbps)",
                data: downlinkBitrates,
                color: "rgba(255, 206, 86, 1)",
              },
            ])}
            options={{
              plugins: {
                datalabels: {
                  display: false, // Hide values
                },
              },
            }}
          />
        </div>
        
        <div className='chart-container'>
          <h4>Average Interarrival Times per PCAP</h4>
          <Line
            data={generateChartData(
              "Average Interarrival Time (ms)",
              avgInterarrivalTimes,
              "rgba(75, 192, 192, 1)"
            )}
            options={{
              plugins: {
                datalabels: {
                  display: false, // Hide values
                },
              },
            }}
          />
        </div>
      </div>

      {/* Dropdown and PCAP-specific graphs */}
      <div className='chart-selector'>
        <h3>Select a PCAP File</h3>
        <select id="pcap-select" onChange={handlePcapChange}>
          <option value="">-- Select --</option>
          {pcapOptions}
        </select>
      </div>

      {selectedPcap && (
        <div className='chart-row'>
          <h2>Data of PCAP n°: {selectedPcap.pcap_file.split('/')[2]}</h2>
          
          <div className='chart-container'>
            <h4>Packet Sizes</h4>
            <Bar
              data={generateChartData(
                "Packet Sizes (Bytes)",
                selectedPcap.packet_sizes,
                "rgba(75, 192, 192, 1)"
              )}
              options={{
                plugins: {
                  datalabels: {
                    display: false, // Hide values
                  },
                },
              }}
            />
          </div>

          <div className='chart-container'>
            <h4>Interarrival Times</h4>
            <Bar
              data={generateChartData(
                "Interarrival Times (ms)",
                selectedPcap.interarrival_times,
                "rgba(255, 99, 132, 1)"
              )}
              options={{
                plugins: {
                  datalabels: {
                    display: false, // Hide values
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {!selectedPcap && <p>Please select a PCAP file to view detailed graphs.</p>}
    </div>
  );
};

export default SocialMedia;