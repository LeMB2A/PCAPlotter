# PCAPlotter

**PCAPlotter** is a comprehensive tool designed for analyzing and visualizing packet capture (PCAP) data. It offers both statistical analysis and interactive plotting capabilities to help users gain insights into network traffic patterns.

## Features

- **Data Preprocessing**: Convert raw PCAP data into a structured JSON format and compute essential features.
- **Statistical Analysis**: Utilize Jupyter Notebook for in-depth analysis of multiple application features.
- **Interactive Visualization**: Engage with dynamic plots through a ReactJS frontend and a Python backend.

## Getting Started

Follow these steps to set up and use PCAPlotter:

### 1. Clone the Repository

```bash
git clone https://github.com/LeMB2A/PCAPlotter.git
cd PCAPlotter
```

### 2. Install Dependencies

Ensure you have Python installed. Install the required Python packages using:

```bash
pip install -r requirements.txt
```

### 3. Data Preprocessing

Before analysis, preprocess your dataset:

```bash
python preprocess.py
```

This script processes raw PCAP files, converts them into a JSON format, and calculates essential features. However, consider increasing/decreasing the `max_workers` based on your CPU physical and logical cores availability, as the preprocessing can take few hours.

### 4. Statistical Analysis

For a comprehensive statistical analysis:

- Open `pcapplotter.ipynb` using Jupyter Notebook:

  ```bash
  jupyter notebook pcapplotter.ipynb
  ```

- Execute the cells to analyze various features across applications.

### 5. Interactive Visualization

For an interactive plotting experience:

1. **Start the Backend Server**:

   ```bash
   uvicorn analyser:app --reload
   ```

2. **Launch the Frontend Application**:

   - Navigate to the `pcap-analyser` directory:

     ```bash
     cd pcap-analyser
     ```

   - Install frontend dependencies:

     ```bash
     npm install
     ```

   - Start the ReactJS application:

     ```bash
     npm start
     ```

The frontend will connect to the backend server, providing an interactive interface for data visualization. Please consider the loading time of data from the backend to the frontend, which may take few minutes.

## Requirements

Ensure the following are installed:

- **Python**: Version 3.x
- **Node.js and npm**: For the ReactJS frontend

All necessary Python packages are listed in `requirements.txt`. Install them using:

```bash
pip install -r requirements.txt
```
