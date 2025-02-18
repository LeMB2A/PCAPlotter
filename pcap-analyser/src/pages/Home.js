import React, { useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut} from "react-chartjs-2";
import "./SocialMedia.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; 

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

const Home = ({appData}) => {

  // Extract app names and metric values
  const appNames = Object.keys(appData);
  const packetSizes = appNames.map((app) => appData[app].packet_size_avg);
  const uplinkBitrates = appNames.map((app) => appData[app].uplink_bitrate);
  const downlinkBitrates = appNames.map((app) => appData[app].downlink_bitrate);
  const interarrivalTimes = appNames.map((app) => appData[app].interarrival_time_avg);
  const avgPcapSizes = appNames.map((app) => appData[app].average_pcap_size_mb);

  return (
    <div className='social-media'>
      <div className="chart-row">
        <h2>Application-Level Comparison</h2>

        {/* Pie Chart - Average PCAP Sizes with Labels */}
        <div className="chart-container">
          <h3>Average PCAP Sizes</h3>
          <div className="doughnut-chart">
            <Doughnut
              data={{
                labels: appNames,
                datasets: [
                  {
                    data: avgPcapSizes,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.6)",
                      "rgba(54, 162, 235, 0.6)",
                      "rgba(255, 206, 86, 0.6)",
                      "rgba(75, 192, 192, 0.6)",
                      "rgba(153, 102, 255, 0.6)",
                      "rgba(255, 159, 64, 0.6)",
                      "rgba(199, 199, 199, 0.6)",
                      "rgba(83, 102, 255, 0.6)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                      "rgba(199, 199, 199, 1)",
                      "rgba(83, 102, 255, 1)",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "left",
                  },
                  datalabels: {
                    color: "#000", // Label text color
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    formatter: (value) => `${value.toFixed(1)}\nMB`, // Format numbers
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Bar Chart - Average Packet Sizes */}
        <div className="chart-container">
          <h3>Average Packet Sizes</h3>
          <Bar
            data={{
              labels: appNames,
              datasets: [
                {
                  label: "Average Packet Size (bytes)",
                  data: packetSizes,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              plugins: {
                datalabels: {
                  display: false, // Hide values
                },
              },
            }}
          />
        </div>

        {/* Grouped Bar Chart - Uplink & Downlink Bitrates */}
        <div className="chart-container">
          <h3>Uplink & Downlink Bitrates</h3>
          <Bar
            data={{
              labels: appNames,
              datasets: [
                {
                  label: "Uplink Bitrate (Mbps)",
                  data: uplinkBitrates,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Downlink Bitrate (Mbps)",
                  data: downlinkBitrates,
                  backgroundColor: "rgba(255, 206, 86, 0.6)",
                  borderColor: "rgba(255, 206, 86, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              plugins: {
                datalabels: {
                  display: false, // Hide values
                },
              },
            }}
          />
        </div>

        {/* Line Chart - Interarrival Times */}
        <div className="chart-container">
          <h3>Average Interarrival Times</h3>
          <Line
            data={{
              labels: appNames,
              datasets: [
                {
                  label: "Average Interarrival Time (ms)",
                  data: interarrivalTimes,
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
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
    </div>
  );
};

export default Home;
