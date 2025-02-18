import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/Sidebar';
import SocialMedia from './pages/SocialMedia';
import Home from './pages/Home';
import Loader from './components/Loader';


const App = () => {
  const [appsData, setAppsData] = useState(null);

  // Fetch all app data from the backend
  useEffect(() => {
    fetch("http://localhost:8000/data")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Success");
          setAppsData(data.data);
          console.log("Data well set");

        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Extracting averages unconditionally
  const averagesData = useMemo(() => {
    if (!appsData) return null; // Avoid errors when appsData is null
    return Object.fromEntries(
      Object.entries(appsData).map(([app, data]) => [app, data.average])
    );
  }, [appsData]);

 if (!appsData) { 
    return(
          <Loader/> // Loading screen until the data is fetched
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar apps={Object.keys(appsData)} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home appData={averagesData} />} />
            {Object.keys(appsData).map((appName) => (
              <Route
                key={appName}
                path={`/${appName}`}
                element={<SocialMedia appName={appName} data={appsData[appName].pcaps} />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;