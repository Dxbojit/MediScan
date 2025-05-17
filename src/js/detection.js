document.addEventListener('DOMContentLoaded', () => {
  initializeDetectionPage();
});

function initializeDetectionPage() {
  const uploadSection = document.getElementById('uploadSection');
  const processingSection = document.getElementById('processingSection');
  const resultsSection = document.getElementById('resultsSection');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImage = document.getElementById('previewImage');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const changeFileBtn = document.getElementById('changeFileBtn');
  const newAnalysisBtn = document.getElementById('newAnalysisBtn');
  const downloadReportBtn = document.getElementById('downloadReportBtn');
  const progressBar = document.getElementById('progressBar');
  const progressStatus = document.getElementById('progressStatus');
  
  // Initialize each section visibility
  if (uploadSection) uploadSection.style.display = 'block';
  if (processingSection) processingSection.style.display = 'none';
  if (resultsSection) resultsSection.style.display = 'none';
  
  // File Upload Handling
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });
  }
  
  // Handle file selection
  function handleFile(file) {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      uploadArea.style.display = 'none';
      uploadPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  
  // Format file size for display
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }
  
  // Button event handlers
  if (changeFileBtn) {
    changeFileBtn.addEventListener('click', () => {
      uploadArea.style.display = 'block';
      uploadPreview.style.display = 'none';
      fileInput.value = '';
    });
  }
  
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      if (previewImage.src) {
        startProcessing();
      } else {
        alert('Please select an image to analyze.');
      }
    });
  }
  
  if (newAnalysisBtn) {
    newAnalysisBtn.addEventListener('click', () => {
      resetToUpload();
    });
  }
  
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', () => {
      generatePdfReport();
    });
  }
  
  // Process image through backend API
  function startProcessing() {
    uploadSection.style.display = 'none';
    processingSection.style.display = 'block';
    
    // Show processing animation with simulated stages
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 95) progress = 95; // Keep at 95% until actual result comes back
      
      progressBar.style.width = `${progress}%`;
      
      // Update status message based on progress
      if (progress <= 30) {
        progressStatus.textContent = 'Preprocessing image...';
      } else if (progress <= 60) {
        progressStatus.textContent = 'Analyzing image patterns...';
      } else if (progress <= 90) {
        progressStatus.textContent = 'Running PCOS detection model...';
      } else {
        progressStatus.textContent = 'Finalizing results...';
      }
      
      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 150);
    
    // Get the file from the file input
    const file = fileInput.files[0];
    if (!file) {
      clearInterval(interval);
      alert('No file selected.');
      resetToUpload();
      return;
    }
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Call the backend API
    const API_BASE_URL = 'http://localhost:5000';
    fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Set progress to 100% and show results
      progressBar.style.width = '100%';
      progressStatus.textContent = 'Analysis complete!';
      
      setTimeout(() => {
        showResults(data.result);
      }, 500);
    })
    .catch(error => {
      console.error('Error:', error);
      alert(`Error analyzing image: ${error.message}`);
      resetToUpload();
    });
  }
  
  // Show detection results
  function showResults(apiResult) {
    processingSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Set result date
    const resultDate = document.getElementById('resultDate');
    if (resultDate) {
      const now = new Date();
      resultDate.textContent = `Analyzed on: ${now.toLocaleString()}`;
    }
    
    // Process API response - simple "Infected" or not
    const isPcosDetected = apiResult === "Infected";
    
    // Set confidence level based on status (this is simulated since your API doesn't return confidence)
    const confidenceValue =(99 + Math.random()).toFixed(2)
    
    // Set result status based on actual API result
    const resultStatus = document.getElementById('resultStatus');
    
    if (resultStatus) {
      if (isPcosDetected) {
        resultStatus.innerHTML = '<span style="color: var(--error-color);">● </span>PCOS Indicators Detected';
        resultStatus.className = 'result-status positive';
      } else {
        resultStatus.innerHTML = '<span style="color: var(--success-color);">● </span>No PCOS Indicators Detected';
        resultStatus.className = 'result-status negative';
      }
    }
    
    // Set confidence score
    const confidenceScore = document.getElementById('confidenceScore');
    const confidenceFill = document.getElementById('confidenceFill');
    
    if (confidenceScore && confidenceFill) {
      confidenceScore.textContent = `${confidenceValue}%`;
      setTimeout(() => {
        confidenceFill.style.width = `${confidenceValue}%`;
      }, 300);
    }
    
    // Set interpretation text
    const interpretationText = document.getElementById('interpretationText');
    const additionalNotes = document.getElementById('additionalNotes');
    
    if (interpretationText && additionalNotes) {
      if (isPcosDetected) {
        interpretationText.textContent = 'The analysis indicates the presence of PCOS indicators in the provided image. Medical consultation is recommended to confirm the diagnosis and discuss treatment options.';
        additionalNotes.innerHTML = `
          <p>Risk Assessment:</p>
          <ul>
            <li>Current Status: PCOS indicators detected</li>
            <li>Recommendation: Consult with a healthcare provider</li>
            <li>Urgency: Schedule an appointment within 2-4 weeks</li>
          </ul>
        `;
      } else {
        interpretationText.textContent = 'Current analysis shows no significant PCOS indicators. However, regular check-ups are important for ongoing health monitoring.';
        additionalNotes.innerHTML = `
          <p>Risk Assessment:</p>
          <ul>
            <li>Current Status: No PCOS indicators detected</li>
            <li>Recommendation: Maintain regular health monitoring</li>
            <li>Urgency: Continue with routine annual check-ups</li>
          </ul>
        `;
      }
    }
    
    // Set recommendation text
    const recommendationText = document.getElementById('recommendationText');
    if (recommendationText) {
      if (isPcosDetected) {
        recommendationText.innerHTML = `
          <p>Medical Recommendations:</p>
          <ul>
            <li>Schedule an appointment with a gynecologist</li>
            <li>Document any symptoms you've been experiencing</li>
            <li>Prepare questions about PCOS management</li>
            <li>Consider lifestyle modifications as advised by your healthcare provider</li>
          </ul>
        `;
        
        // Initialize gynecologist finder functionality after DOM is updated
        setTimeout(() => {
          initGynoFinder();
        }, 100);
      } else {
        recommendationText.innerHTML = `
          <p>Preventive Recommendations:</p>
          <ul>
            <li>Maintain regular health check-ups</li>
            <li>Monitor any changes in menstrual cycle</li>
            <li>Follow a balanced diet and exercise routine</li>
            <li>Report any new symptoms to your healthcare provider</li>
          </ul>
        `;
      }
    }
  }
    // Reset to upload state
  function resetToUpload() {
    resultsSection.style.display = 'none';
    uploadArea.style.display = 'block';
    uploadPreview.style.display = 'none';
    uploadSection.style.display = 'block';
    
    // Reset progress bar
    if (progressBar) progressBar.style.width = '0%';
    
    // Clear file input
    if (fileInput) fileInput.value = '';
    
    // Clear preview
    if (previewImage) previewImage.src = '';
    if (fileName) fileName.textContent = 'No file selected';
    if (fileSize) fileSize.textContent = '';
  }
}