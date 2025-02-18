import React from 'react'
import "./Loader.css"

export default function Loader() {
  return (
    <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Data, might take few minutes...</p>
    </div>
  )
}
