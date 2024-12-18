import React from 'react';
import ReactToPdf from 'react-to-pdf';
import { useState } from 'react';
import jsPDF from 'jspdf';

const Invoice = () => {
  const [isReady, setIsReady] = useState(false);

  const handleGeneratePDF = () => {
    print()
  };

  return (
    <div>
      <h1>My React Page</h1>
      <div id="content-to-pdf"> {/* This is the section you want to capture */}
        <p>This content will be converted into a PDF.</p>
        <p>Click the button below to download the PDF.</p>
      </div>
      <button onClick={handleGeneratePDF}>Download as PDF</button>
    </div>
  );
};

export default Invoice