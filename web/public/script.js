function toggleMenu() {
  const header = document.querySelector('.header');
  const toggleBtn = header.querySelector('.toggle');
  // Expand or collapse
  header.classList.toggle('expanded');
  toggleBtn.classList.toggle('rotated');
}

function showSection(sectionId) {
  const allSections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.header');
  const toggleBtn = header.querySelector('.toggle');
  const landingIframe = document.querySelector('.landing-iframe');

  // Hide ALL sections first
  allSections.forEach(sec => sec.classList.add('hidden'));

  // Then show only the relevant sections
  if (sectionId === 'pricing') {
    document.getElementById('pricing-header').classList.remove('hidden');
    document.getElementById('pricing').classList.remove('hidden');
  } else if (sectionId === 'about') {
    document.getElementById('about').classList.remove('hidden');
    document.getElementById('about-mission').classList.remove('hidden');
    document.getElementById('about-innovation').classList.remove('hidden');
  } else if (sectionId === 'create') {
    document.getElementById('create').classList.remove('hidden');
    document.getElementById('create-dashboard').classList.remove('hidden');
    document.getElementById('create-steps1').classList.remove('hidden');
    document.getElementById('create-steps2').classList.remove('hidden');
    document.getElementById('create-ml-processing').classList.remove('hidden');
    document.getElementById('create-steps3').classList.remove('hidden');
  } else if (sectionId === 'landing') {  // Make this explicit
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('landing-carousel').classList.remove('hidden');
    document.getElementById('landing-additional').classList.remove('hidden');
    document.getElementById('landing-stats').classList.remove('hidden');
    document.getElementById('landing-stats2').classList.remove('hidden');
    document.getElementById('landing-more').classList.remove('hidden');
    document.getElementById('landing-more2').classList.remove('hidden');
  }

  // If the landing page is not active, remove the iframe src (to unload it)
  if (sectionId !== 'landing') {
    landingIframe.src = "";
  } else {
    landingIframe.src = "https://hansenhomeai.github.io/WebbyDeerKnoll/";
  }

  // Scroll to the top of the page when switching sections
  window.scrollTo(0, 0);

  // If the header is expanded, close it
  if (header.classList.contains('expanded')) {
    header.classList.remove('expanded');
    toggleBtn.classList.remove('rotated');
  }
}

function sendFeedback(e) {
  e.preventDefault();
  const feedbackInput = document.querySelector('input[name="feedback"]');
  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    alert('Please enter your feedback before sending.');
    return;
  }

  const button = document.querySelector('.feedback-button');
  const originalText = button.textContent;
  button.textContent = ''; // Clear text

  // Create a check icon
  const checkSpan = document.createElement('span');
  checkSpan.textContent = '✓';
  checkSpan.style.fontSize = '1.2rem';
  checkSpan.style.display = 'inline-block';
  checkSpan.style.textAlign = 'center';
  button.appendChild(checkSpan);

  // Open user's email client
  window.location.href = `mailto:gabriel@spcprt.com?subject=Feedback&body=${encodeURIComponent(feedback)}`;

  // Clear input
  feedbackInput.value = '';

  // After 2 seconds, revert the button
  setTimeout(() => {
    button.removeChild(checkSpan);
    button.textContent = originalText;
  }, 2000);
}

function updateIframeOverlay() {
  const textBox = document.querySelector('.landing-content');
  const overlay = document.getElementById('iframe-overlay');

  if (textBox && overlay) {
    const textBoxHeight = textBox.offsetHeight;
    const textBoxTop = textBox.offsetTop;
    overlay.style.height = `calc(100vh - ${textBoxTop + textBoxHeight}px)`;
    overlay.style.top = `${textBoxTop + textBoxHeight}px`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let hoverElements = document.querySelectorAll(".logo, .toggle, .nav-links a, .nav-links-desktop a, .cta-button, .cta-button2, .cta-button2-fixed");

  hoverElements.forEach(element => {
    element.addEventListener("touchstart", function () {
      element.classList.add("disable-hover");
      setTimeout(() => {
        element.classList.remove("disable-hover");
      }, 500); // Adjust timeout as needed
    });
  });
});

// Update overlay on load and resize
window.addEventListener('load', updateIframeOverlay);
window.addEventListener('resize', updateIframeOverlay);

document.addEventListener('DOMContentLoaded', () => {
  showSection('landing');
  
  // Initialize waitlist mode
  initializeWaitlistMode();

  // Initialize privacy policy modal
  initializePrivacyPolicyModal();

  // Close the header if clicked outside while expanded
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.header');
    const toggleBtn = header.querySelector('.toggle');
    if (header.classList.contains('expanded') && !header.contains(e.target)) {
      header.classList.remove('expanded');
      toggleBtn.classList.remove('rotated');
    }
  });

  // Initialize popup functionality
  const popup = document.getElementById('addPathPopup');
  const uploadArea = document.getElementById('csvUploadArea');
  const fileInput = document.getElementById('csvFileInput');
  
  if (popup) {
    popup.classList.add('hidden');
  }

  if (uploadArea && fileInput) {
    // Click to upload
    uploadArea.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      if (e.dataTransfer.files.length) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      e.stopPropagation();
      if (e.target.files.length) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  // Initialize new project popup functionality
  const newProjectButton = document.querySelector('.new-project-card');
  const newProjectPopup = document.getElementById('newProjectPopup');
  
  if (newProjectButton && newProjectPopup) {
    // Add click handler for New Project button
    newProjectButton.addEventListener('click', function() {
      openNewProjectPopup();
    });

    // Prevent click-through to background - popup can only be closed via X button
    newProjectPopup.addEventListener('click', function(e) {
      // Stop propagation to prevent any background interactions
      e.stopPropagation();
    });
  }

  // Escape key disabled - popup can only be closed via X button
  // document.addEventListener('keydown', function(e) {
  //   if (e.key === 'Escape') {
  //     closeNewProjectPopup();
  //   }
  // });
});

// FILE: dronePathGenerator.js
(function() {
  let hoverTimer = null;

  // 1) Setup the text-field hover logic (0.45s delay).
  document.querySelectorAll('#dfpg-container .input-wrapper').forEach((wrapper) => {
    const inputElem = wrapper.querySelector('input');
    const overlay = wrapper.querySelector('.hover-overlay');
    const labelText = wrapper.getAttribute('data-label') || '';
    overlay.innerHTML = labelText;

    inputElem.addEventListener('mouseenter', () => {
      if (inputElem.value.trim() !== '') {
        hoverTimer = setTimeout(() => {
          wrapper.classList.add('hover-active');
        }, 450);
      }
    });
    inputElem.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      wrapper.classList.remove('hover-active');
    });
    // If user clicks/focuses, hide the overlay:
    inputElem.addEventListener('focus', () => {
      clearTimeout(hoverTimer);
      wrapper.classList.remove('hover-active');
    });
  });

  // ===== JS FOR TOOLTIP POSITIONING =====
  document.addEventListener('click', function(e) {
    const isIcon = e.target.matches('.info-pill-icon[data-tooltip-target]');  // Only match icons with tooltip targets
    const isTooltip = e.target.closest('.info-tooltip');
    const openTooltips = document.querySelectorAll('#dfpg-container .info-tooltip.active');

    // Close all tooltips if clicking outside
    if (!isIcon && !isTooltip) {
      openTooltips.forEach(tip => {
        if (tip && tip.classList) {
          tip.classList.remove('active');
          tip.style.display = 'none';
        }
      });
    }

    // Handle tooltip click
    if (isIcon) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up
      const icon = e.target;
      const tooltipId = icon.getAttribute('data-tooltip-target');
      const tooltip = document.getElementById(tooltipId);

      if (tooltip && tooltip.classList) { // Only proceed if tooltip exists and has classList
        if (tooltip.classList.contains('active')) {
          tooltip.classList.remove('active');
          tooltip.style.display = 'none';
        } else {
          openTooltips.forEach(tip => {
            if (tip && tip.classList) {
              tip.classList.remove('active');
              tip.style.display = 'none';
            }
          });
          tooltip.classList.add('active');
          tooltip.style.display = 'block';

          // Positioning logic
          const container = document.querySelector('#dfpg-container .dfpg-container-inner');
          if (container) {
            const containerRect = container.getBoundingClientRect();
            const iconRect = icon.getBoundingClientRect();
            const top = (iconRect.bottom - containerRect.top) + 10;
            tooltip.style.top = top + 'px';

            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';

            // Adjust arrow positioning
            const tooltipRect = tooltip.getBoundingClientRect();
            const iconCenterX = iconRect.left + (iconRect.width / 2);
            const arrowX = iconCenterX - tooltipRect.left;
            tooltip.style.setProperty('--arrowOffset', arrowX + 'px');
          }
        }
      }
    }
  });
})();

// CHUNK #3: dronePhotoUploader.js
(function() {
  const propertyTitle   = document.getElementById('propertyTitle');
  const addressOfProp   = document.getElementById('addressOfProperty');
  const listingDesc     = document.getElementById('listingDescription');
  const uploadArea      = document.getElementById('uploadArea');
  const uploadPrompt    = document.getElementById('uploadPrompt');
  const fileInput       = document.getElementById('fileInput');
  const selectedFileDisplay = document.getElementById('selectedFileDisplay');
  const selectedFileName = document.getElementById('selectedFileName');
  const removeFileBtn   = document.getElementById('removeFileBtn');
  
  const emailField      = document.getElementById('emailField');
  const optionalNotes   = document.getElementById('optionalNotes');
  const uploadBtn       = document.getElementById('uploadBtn');
  const progressBar     = document.getElementById('progressBar');
  const progressBarFill = document.getElementById('progressBarFill');

  let selectedFile = null;
  const MAX_FILE_SIZE = 7 * 1024 * 1024 * 1024; // 7GB
  const CHUNK_SIZE    = 24 * 1024 * 1024;       // 24MB

  // Required text fields
  const requiredFields = [propertyTitle, addressOfProp, listingDesc, emailField];
  requiredFields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.classList.remove('missing-field');
      }
    });
  });

  // Close icon => remove selected file
  removeFileBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = "";
    selectedFileDisplay.style.display = "none";
    uploadPrompt.style.display = "block";
    uploadArea.classList.remove('missing-field');
  });

  // Drag & drop
  uploadArea.addEventListener('click', () => fileInput.click());
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  });

  function validateAndSetFile(file) {
    if (
      file.type !== "application/x-zip-compressed" && 
      !file.name.toLowerCase().endsWith(".zip")
    ) {
      alert("Please upload a .zip file only.");
      fileInput.value = "";
      selectedFile = null;
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5GB. Please upload a smaller .zip file.");
      fileInput.value = "";
      selectedFile = null;
      return;
    }
    selectedFile = file;

    // Hide the prompt
    uploadPrompt.style.display = "none";
    // Show file name + close icon
    selectedFileDisplay.style.display = "block";
    selectedFileName.textContent = file.name;
    // Remove highlight
    uploadArea.classList.remove('missing-field');
  }

  /************************************************
   * Endpoints for multipart in your backend
   ************************************************/
  const START_MULTIPART_ENDPOINT   = "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/start-multipart-upload";
  const GET_PRESIGNED_PART_ENDPOINT= "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/get-presigned-url";
  const COMPLETE_MULTIPART_ENDPOINT= "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/complete-multipart-upload";
  const SAVE_SUBMISSION_ENDPOINT   = "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/save-submission";

  async function saveSubmissionMetadata(objectKey) {
    const payload = {
      email: emailField.value.trim(),
      propertyTitle: propertyTitle.value.trim(),
      listingDescription: listingDesc.value.trim(),
      addressOfProperty: addressOfProp.value.trim(),
      optionalNotes: optionalNotes.value.trim(),
      objectKey: objectKey
    };

    const res = await fetch(SAVE_SUBMISSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to save submission metadata");
    }
    return await res.json();
  }

  async function startMultipartUpload(fileName, fileType) {
    const payload = {
      propertyTitle: propertyTitle.value.trim(),
      addressOfProperty: addressOfProp.value.trim(),
      listingDescription: listingDesc.value.trim(),
      email: emailField.value.trim(),
      optionalNotes: optionalNotes.value.trim(),
      fileName: fileName,
      fileType: fileType
    };

    const res = await fetch(START_MULTIPART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to start multipart upload");
    }
    return await res.json();
  }

  async function getPresignedUrlForPart(uploadId, bucketName, objectKey, partNumber) {
    const payload = { uploadId, bucketName, objectKey, partNumber };
    const res = await fetch(GET_PRESIGNED_PART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to get presigned URL for part " + partNumber);
    }
    return await res.json();
  }

  async function completeMultipartUpload(uploadId, bucketName, objectKey, parts) {
    const payload = { uploadId, bucketName, objectKey, parts };
    const res = await fetch(COMPLETE_MULTIPART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Failed to complete multipart upload");
    }
    return await res.json();
  }

  async function uploadFileInChunks(file) {
    const { uploadId, bucketName, objectKey } = await startMultipartUpload(file.name, file.type);
    console.log("Multipart upload started:", { uploadId, bucketName, objectKey });

    const totalSize   = file.size;
    let uploadedBytes = 0;
    let partNumber    = 1;
    const partsETags  = [];

    let offset = 0;
    while (offset < totalSize) {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      const chunkSize = chunk.size;

      const { url } = await getPresignedUrlForPart(uploadId, bucketName, objectKey, partNumber);
      const eTag = await uploadPart(url, chunk, partNumber);

      partsETags.push({ ETag: eTag, PartNumber: partNumber });

      uploadedBytes += chunkSize;
      const percent = (uploadedBytes / totalSize) * 100;
      progressBarFill.style.width = percent + "%";
      console.log(`Uploaded part #${partNumber}: ${percent.toFixed(2)}% done`);

      offset += CHUNK_SIZE;
      partNumber++;
    }

    await completeMultipartUpload(uploadId, bucketName, objectKey, partsETags);
    console.log("Multipart upload completed!");
    return { objectKey };
  }

  function uploadPart(url, chunk, partNumber) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.addEventListener("error", () => {
        reject(new Error("Network error uploading part #" + partNumber));
      });
      xhr.onload = () => {
        if (xhr.status === 200) {
          const eTag = xhr.getResponseHeader("ETag");
          if (!eTag) {
            return reject(new Error("No ETag found in upload response for part #" + partNumber));
          }
          resolve(eTag);
        } else {
          reject(new Error("Failed to upload part #" + partNumber + "; status: " + xhr.status));
        }
      };

      xhr.send(chunk);
    });
  }

  // Handle upload
  uploadBtn.addEventListener('click', async () => {
    let missing = false;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('missing-field');
        missing = true;
      }
    });
    if (!selectedFile) {
      uploadArea.classList.add('missing-field');
      missing = true;
    }
    if (missing) {
      return;
    }

    const originalBtnHTML = uploadBtn.innerHTML;
    uploadBtn.innerHTML = '<div class="spinner"></div>';
    uploadBtn.disabled = true;

    try {
      progressBar.style.display = 'block';
      progressBarFill.style.width = '0%';

      // Upload main ZIP file
      const result = await uploadFileInChunks(selectedFile);

      // Save to DynamoDB
      await saveSubmissionMetadata(result.objectKey);
      console.log("Submission metadata saved!");

      const message = "Upload completed! Processing will begin shortly.";
      
      uploadBtn.innerHTML = 'Upload Complete!';
      alert(message);
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Error uploading file: " + err.message);
    } finally {
      setTimeout(() => {
        uploadBtn.innerHTML = originalBtnHTML;
        uploadBtn.disabled = false;
        progressBar.style.display = 'none';
        progressBarFill.style.width = '0%';
      }, 1500);
    }
  });
})();

// Define the functions in the global scope first
function showAddPathPopup(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  console.log('showAddPathPopup called');
  const popup = document.getElementById('addPathPopup');
  console.log('popup element:', popup);
  if (popup) {
    popup.classList.remove('hidden');
    // Add event listener for clicking outside the popup
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
    console.log('popup shown and click handler added');
  } else {
    console.error('Popup element not found');
  }
}

function hideAddPathPopup(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const popup = document.getElementById('addPathPopup');
  if (popup) {
    popup.classList.add('hidden');
    const parsingResults = document.getElementById('parsingResults');
    const csvFileInput = document.getElementById('csvFileInput');
    if (parsingResults) parsingResults.classList.add('hidden');
    if (csvFileInput) csvFileInput.value = '';
    // Remove the outside click listener
    document.removeEventListener('click', handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const popup = document.getElementById('addPathPopup');
  const popupContent = document.querySelector('.popup-content');
  const closeIcon = document.querySelector('.close-icon');
  
  // Check if click is outside the popup content and not on the close icon
  if (popup && popupContent && !popupContent.contains(event.target) && event.target !== closeIcon) {
    hideAddPathPopup(event);
  }
}

// NEW PROJECT POPUP FUNCTIONS
function openNewProjectPopup() {
  const popup = document.getElementById('newProjectPopup');
  if (popup) {
    popup.classList.remove('hidden');
    document.body.classList.add('popup-open');
    
    // Ensure at least one section is active
    const activeSection = popup.querySelector('.accordion-section.active');
    if (!activeSection) {
      // If no section is active, activate the first one
      const firstSection = popup.querySelector('.accordion-section');
      if (firstSection) {
        firstSection.classList.add('active');
      }
    }
    
    // Focus on the title input
    const titleInput = document.getElementById('projectTitle');
    if (titleInput) {
      setTimeout(() => {
        titleInput.focus();
        titleInput.select();
      }, 100);
    }
    
    // Initialize upload button functionality
    setTimeout(() => {
      initializeUploadButton();
    }, 100);
  }
}

function closeNewProjectPopup() {
  const popup = document.getElementById('newProjectPopup');
  if (popup) {
    popup.classList.add('hidden');
    document.body.classList.remove('popup-open');
  }
}

// ACCORDION FUNCTIONALITY
function toggleAccordionSection(sectionId) {
  const allSections = document.querySelectorAll('.accordion-section');
  const targetSection = document.querySelector(`[data-section="${sectionId}"]`);
  
  if (!targetSection) return;
  
  // If the target section is already active, don't do anything
  // (prevents closing the only open section)
  if (targetSection.classList.contains('active')) {
    return;
  }
  
  // Close all sections first
  allSections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Open the target section
  targetSection.classList.add('active');
}

// UPLOAD BUTTON PROGRESS FUNCTIONALITY
function initializeUploadButton() {
  const uploadButton = document.querySelector('.upload-btn-with-icon');
  const cancelButton = document.querySelector('.cancel-btn-with-icon');
  const progressContainer = document.querySelector('.upload-progress-container');
  const progressBar = document.querySelector('.upload-progress-bar');
  const progressText = document.querySelector('.upload-progress-text');
  const categoryOutline = document.querySelector('.category-outline.upload-button-only');
  
  if (!uploadButton || !cancelButton || !progressContainer || !progressBar || !progressText || !categoryOutline) {
    return;
  }
  
  // Initialize upload zone file selection
  initializeUploadZone();
  
  // Hook into our integrated upload system
  uploadButton.addEventListener('click', async () => {
    if (projectPopupPhotoUpload) {
      await projectPopupPhotoUpload.handleUpload();
    } else {
      console.error('ProjectPopupPhotoUpload not initialized');
      alert('Upload system not ready. Please try again.');
    }
  });
  
  cancelButton.addEventListener('click', () => {
    // Cancel upload and return to original state
    cancelUpload(progressContainer, progressBar, progressText, categoryOutline, uploadButton, cancelButton);
  });
}

// Initialize upload zone with file selection
function initializeUploadZone() {
  const uploadZone = document.querySelector('#newProjectPopup .upload-zone');
  if (!uploadZone) return;
  
  // Add click handler to upload zone
  uploadZone.addEventListener('click', () => {
    // Create a temporary file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUploadZoneFile(e.target.files[0]);
      }
      document.body.removeChild(fileInput);
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
  });
  
  // Add drag and drop functionality
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.8)';
  });
  
  uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.3)';
  });
  
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadZoneFile(e.dataTransfer.files[0]);
    }
  });
}

// Handle file selection in upload zone
function handleUploadZoneFile(file) {
  const uploadZone = document.querySelector('#newProjectPopup .upload-zone');
  if (!uploadZone) return;
  
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.zip')) {
    alert('Please upload a .zip file only');
    return;
  }
  
  // Validate file size (5GB limit)
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
  if (file.size > maxSize) {
    alert('File size exceeds 5GB limit');
    return;
  }
  
  // Store the file in the upload zone
  if (projectPopupPhotoUpload) {
    projectPopupPhotoUpload.setSelectedFile(file);
  }
  
  // Update upload zone display
  const uploadIcon = uploadZone.querySelector('.upload-icon');
  const uploadText = uploadZone.querySelector('p');
  
  if (uploadIcon) {
    uploadIcon.style.display = 'none';
  }
  
  if (uploadText) {
    uploadText.innerHTML = `<strong>Selected:</strong> ${file.name}<br><span style="color: rgba(255, 255, 255, 0.6);">Click to select a different file</span>`;
  }
}

function startUploadProgress(progressContainer, progressBar, progressText, categoryOutline, uploadButton, cancelButton) {
  // Show container outline
  categoryOutline.classList.remove('no-outline');
  
  // Show progress container and text
  progressContainer.classList.add('active');
  progressText.classList.add('active');
  
  // Reset progress bar and text
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  
  // Slide upload button to cancel position and hide immediately
  uploadButton.classList.add('uploading');
  uploadButton.style.opacity = '0';
  
  // Slide cancel button to active position
  setTimeout(() => {
    cancelButton.classList.add('active');
  }, 100);
}

function updateUploadProgress(progressBar, percentage) {
  progressBar.style.width = `${percentage}%`;
}

function completeUpload(progressContainer, progressBar, progressText, categoryOutline, uploadButton, cancelButton) {
  // Complete the progress bar
  progressBar.style.width = '100%';
  if (progressText) {
    progressText.textContent = '100%';
  }
  
  // After a delay, hide progress and restore original state
  setTimeout(() => {
    progressContainer.classList.remove('active');
    progressText.classList.remove('active');
    categoryOutline.classList.add('no-outline');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    
    // Show upload button first, then slide transition back
    uploadButton.style.opacity = '1';
    uploadButton.classList.remove('uploading');
    
    // Slide cancel button back to center
    setTimeout(() => {
      cancelButton.classList.remove('active');
    }, 100);
  }, 1000);
}

function cancelUpload(progressContainer, progressBar, progressText, categoryOutline, uploadButton, cancelButton) {
  // Hide progress
  progressContainer.classList.remove('active');
  progressText.classList.remove('active');
  categoryOutline.classList.add('no-outline');
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
  
  // Show upload button first, then slide transition back
  uploadButton.style.opacity = '1';
  uploadButton.classList.remove('uploading');
  
  // Slide cancel button back to center
  setTimeout(() => {
    cancelButton.classList.remove('active');
  }, 100);
}

async function simulateUpload(progressBar, progressText) {
  // Simulate upload progress (replace with actual upload logic)
  for (let i = 0; i <= 100; i += 10) {
    updateUploadProgress(progressBar, i);
    if (progressText) {
      progressText.textContent = i + '%';
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

function handleFileUpload(file) {
  console.log('handleFileUpload called with file:', file);
  
  // Add null check for file
  if (!file) {
    console.error('No file provided to handleFileUpload');
    return;
  }

  // Check file extension
  if (!file.name.toLowerCase().endsWith('.csv')) {
    console.error('Invalid file type:', file.name);
    alert('Please upload a CSV file');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    console.log('FileReader onload triggered');
    try {
      const csvData = e.target.result;
      console.log('CSV data first 100 chars:', csvData.substring(0, 100));
      analyzeFlightPath(csvData);
    } catch (error) {
      console.error('Error processing CSV data:', error);
      alert('Error processing CSV file: ' + error.message);
    }
  };
  
  reader.onerror = function(e) {
    console.error('FileReader error:', e.target.error);
    alert('Error reading file: ' + e.target.error);
  };
  
  console.log('Starting to read file as text');
  try {
    reader.readAsText(file);
  } catch (error) {
    console.error('Error starting file read:', error);
    alert('Error starting file read: ' + error.message);
  }
}

function analyzeFlightPath(csvData) {
  console.log('analyzeFlightPath called');
  
  if (!csvData) {
    console.error('No CSV data provided to analyzeFlightPath');
    return;
  }
  
  const lines = csvData.split('\n');
  console.log('Number of CSV lines:', lines.length);
  
  if (lines.length < 2) {
    console.error('Invalid CSV file format - not enough lines');
    alert('Invalid CSV file format');
    return;
  }
  
  // Parse CSV headers
  const headers = lines[0].split(',').map(h => h.trim());
  console.log('CSV headers:', headers);
  
  const waypoints = [];
  let validWaypoints = 0;
  
  // Parse waypoints
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) {
      console.warn(`Skipping line ${i + 1}: incorrect number of values`);
      continue;
    }
    
    const waypoint = {};
    headers.forEach((header, index) => {
      waypoint[header] = values[index];
    });
    waypoints.push(waypoint);
    validWaypoints++;
  }
  
  console.log('Valid waypoints parsed:', validWaypoints);
  
  if (waypoints.length === 0) {
    console.error('No valid waypoints found in CSV');
    alert('No waypoints found in CSV file');
    return;
  }

  try {
    console.log('Detecting parameters from waypoints');
    const params = {
      mode: detectMode(waypoints),
      radiusIncrement: detectRadiusIncrement(waypoints),
      aglIncrement: detectAGLIncrement(waypoints),
      centerCoordinates: detectCenterCoordinates(waypoints)
    };
    
    console.log('Detected parameters:', params);
    displayDetectedParams(params);
  } catch (error) {
    console.error('Error detecting parameters:', error);
    alert('Error analyzing flight path: ' + error.message);
  }
}

function detectMode(waypoints) {
  // Check for patterns that indicate ranch mode
  const hasConsistentPOI = waypoints.every(wp => 
    wp.poi_longitude === waypoints[0].poi_longitude
  );
  
  const hasVaryingGimbal = waypoints.some(wp => 
    parseFloat(wp.gimbalpitchangle) !== parseFloat(waypoints[0].gimbalpitchangle)
  );
  
  if (hasConsistentPOI && hasVaryingGimbal) {
    return 'ranch';
  }
  
  // Check for standard vs advanced
  const hasPOIRows = waypoints.some(wp => wp.poi_altitude !== '0');
  return hasPOIRows ? 'advanced' : 'standard';
}

function detectRadiusIncrement(waypoints) {
  // Calculate distances from center to each waypoint
  const center = detectCenterCoordinates(waypoints);
  if (!center) return null;

  const radii = waypoints.map(wp => {
    const dx = parseFloat(wp.longitude) - parseFloat(center.longitude);
    const dy = parseFloat(wp.latitude) - parseFloat(center.latitude);
    return Math.sqrt(dx * dx + dy * dy);
  }).sort((a, b) => a - b);

  if (radii.length < 2) return null;
  
  const increments = [];
  for (let i = 1; i < radii.length; i++) {
    increments.push(radii[i] - radii[i-1]);
  }
  
  // Return the most common increment
  const incrementCounts = {};
  increments.forEach(inc => {
    incrementCounts[inc] = (incrementCounts[inc] || 0) + 1;
  });
  
  return Object.entries(incrementCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function detectCenterCoordinates(waypoints) {
  // Find the point that appears most frequently as POI
  const poiCounts = {};
  waypoints.forEach(wp => {
    if (wp.poi_latitude && wp.poi_longitude) {
      const key = `${wp.poi_latitude},${wp.poi_longitude}`;
      poiCounts[key] = (poiCounts[key] || 0) + 1;
    }
  });
  
  if (Object.keys(poiCounts).length === 0) {
    // If no POI coordinates, use the average of all waypoints
    const sum = waypoints.reduce((acc, wp) => ({
      latitude: acc.latitude + parseFloat(wp.latitude),
      longitude: acc.longitude + parseFloat(wp.longitude)
    }), { latitude: 0, longitude: 0 });
    
    return {
      latitude: sum.latitude / waypoints.length,
      longitude: sum.longitude / waypoints.length
    };
  }
  
  // Return the most frequent POI coordinates
  const mostFrequent = Object.entries(poiCounts)
    .sort((a, b) => b[1] - a[1])[0][0]
    .split(',');
    
  return {
    latitude: parseFloat(mostFrequent[0]),
    longitude: parseFloat(mostFrequent[1])
  };
}

function detectAGLIncrement(waypoints) {
  // Find unique altitudes and sort them
  const altitudes = Array.from(new Set(waypoints.map(wp => parseFloat(wp.altitude))))
    .sort((a, b) => a - b);
  
  if (altitudes.length < 2) return null;
  
  const increments = [];
  for (let i = 1; i < altitudes.length; i++) {
    increments.push(altitudes[i] - altitudes[i-1]);
  }
  
  // Return the most common increment
  const incrementCounts = {};
  increments.forEach(inc => {
    incrementCounts[inc] = (incrementCounts[inc] || 0) + 1;
  });
  
  return Object.entries(incrementCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function displayDetectedParams(params) {
  console.log('Displaying detected parameters');
  const parsingResults = document.getElementById('parsingResults');
  const detectedParams = document.getElementById('detectedParams');
  
  if (!parsingResults || !detectedParams) {
    console.error('Could not find parsingResults or detectedParams elements');
    return;
  }
  
  // Clear previous results
  detectedParams.innerHTML = '';
  
  // Display each detected parameter
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null) {
      const paramDiv = document.createElement('div');
      paramDiv.innerHTML = `<strong>${key}:</strong> <span>${value}</span>`;
      detectedParams.appendChild(paramDiv);
    }
  });
  
  parsingResults.classList.remove('hidden');
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing popup functionality');
  
  // Initialize popup (optional - only if popup exists)
  const popup = document.getElementById('addPathPopup');
  
  if (popup) {
    popup.classList.add('hidden');
    
    // Initialize upload area (only if it exists)
    const uploadArea = document.getElementById('csvUploadArea');
    const fileInput = document.getElementById('csvFileInput');
    
    if (uploadArea && fileInput) {
      console.log('Setting up file upload handlers');
      // Click to upload
      uploadArea.addEventListener('click', (e) => {
        console.log('Upload area clicked');
        e.stopPropagation();
        fileInput.click();
      });
      
      // Drag and drop
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      });
      
      uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      });
      
      uploadArea.addEventListener('drop', (e) => {
        console.log('File dropped');
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        if (e.dataTransfer.files.length) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });
      
      // File input change
      fileInput.addEventListener('change', (e) => {
        console.log('File input changed');
        e.stopPropagation();
        if (e.target.files.length) {
          handleFileUpload(e.target.files[0]);
        }
      });
    }
  }
});

// Make functions globally available
window.showAddPathPopup = showAddPathPopup;
window.hideAddPathPopup = hideAddPathPopup;
window.handleFileUpload = handleFileUpload;
window.analyzeFlightPath = analyzeFlightPath;
window.detectMode = detectMode;
window.detectRadiusIncrement = detectRadiusIncrement;
window.detectAGLIncrement = detectAGLIncrement;
window.detectCenterCoordinates = detectCenterCoordinates;
window.displayDetectedParams = displayDetectedParams;

// API Endpoints
const API_ENDPOINTS = {
    DRONE_PATH: "https://7bidiow2t9.execute-api.us-west-2.amazonaws.com/prod/DronePathREST",
    START_UPLOAD: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/start-multipart-upload",
    GET_PRESIGNED_URL: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/get-presigned-url",
    COMPLETE_UPLOAD: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/complete-multipart-upload",
    SAVE_SUBMISSION: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/save-submission",
    WAITLIST: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/waitlist"
};

// Enhanced Drone Path Generator API Configuration
const ENHANCED_API_BASE = "https://7bidiow2t9.execute-api.us-west-2.amazonaws.com/prod";

// Enhanced Drone Path Generator Class
class EnhancedDronePathGenerator {
    constructor() {
        this.currentOptimizedParams = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const optimizeButton = document.getElementById('optimizeButton');
        const downloadMasterCSV = document.getElementById('downloadMasterCSV');
        
        if (optimizeButton) {
            optimizeButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission
                this.handleOptimize();
            });
        }
        
        if (downloadMasterCSV) {
            downloadMasterCSV.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission
                this.handleDownloadMasterCSV();
            });
        }
        
        // Add event listeners for input changes to enable optimization
        const inputs = ['missionTitle', 'centerCoordinates', 'batteryMinutes', 'numBatteries'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.validateForm());
            }
        });
    }

    validateForm() {
        const centerCoords = document.getElementById('centerCoordinates')?.value?.trim();
        const batteryMinutes = document.getElementById('batteryMinutes')?.value;
        const numBatteries = document.getElementById('numBatteries')?.value;

        // Center coordinates are always required
        if (!centerCoords) {
            const optimizeButton = document.getElementById('optimizeButton');
            if (optimizeButton) {
                optimizeButton.disabled = true;
            }
            return false;
        }

        // Validate battery minutes if provided (allow empty for default)
        if (batteryMinutes && (batteryMinutes < 10 || batteryMinutes > 60)) {
            const optimizeButton = document.getElementById('optimizeButton');
            if (optimizeButton) {
                optimizeButton.disabled = true;
            }
            return false;
        }

        // Validate number of batteries if provided (allow empty for default)
        if (numBatteries && (numBatteries < 1 || numBatteries > 12)) {
            const optimizeButton = document.getElementById('optimizeButton');
            if (optimizeButton) {
                optimizeButton.disabled = true;
            }
            return false;
        }

        // Form is valid
        const optimizeButton = document.getElementById('optimizeButton');
        if (optimizeButton) {
            optimizeButton.disabled = false;
        }
        return true;
    }

    async handleOptimize() {
        if (!this.validateForm()) {
            this.showError('Please fill in all required fields with valid values.');
            return;
        }

        const centerCoords = document.getElementById('centerCoordinates').value.trim();
        // Use default values if fields are empty
        const batteryMinutes = parseInt(document.getElementById('batteryMinutes').value) || 20;
        const numBatteries = parseInt(document.getElementById('numBatteries').value) || 3;

        this.setOptimizeLoading(true);
        this.hideError();
        this.hideOptimizationResults();

        try {
            // Step 1: Optimize the spiral pattern
            console.log('Starting optimization for:', { batteryMinutes, batteries: numBatteries, center: centerCoords });
            
            const optimizationResponse = await fetch(`${ENHANCED_API_BASE}/api/optimize-spiral`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    batteryMinutes: batteryMinutes,
                    batteries: numBatteries,
                    center: centerCoords
                })
            });

            if (!optimizationResponse.ok) {
                const errorData = await optimizationResponse.json().catch(() => ({}));
                throw new Error(errorData.error || `Optimization failed: ${optimizationResponse.status}`);
            }

            const optimizationData = await optimizationResponse.json();
            console.log('Optimization response:', optimizationData);

            // Step 2: Get elevation data
            const elevationResponse = await fetch(`${ENHANCED_API_BASE}/api/elevation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    center: centerCoords
                })
            });

            let elevationFeet = null;
            if (elevationResponse.ok) {
                const elevationData = await elevationResponse.json();
                elevationFeet = elevationData.elevation_feet;
            }

            // Store the optimized parameters for CSV downloads (use defaults for empty fields)
            this.currentOptimizedParams = {
                ...optimizationData.optimized_params,
                center: centerCoords,
                minHeight: document.getElementById('minHeightFeet')?.value || 100,
                maxHeight: document.getElementById('maxHeightFeet')?.value || 400
            };

            // Display results
            this.displayOptimizationResults(optimizationData, elevationFeet);
            this.enableDownloads();

        } catch (error) {
            console.error('Optimization error:', error);
            this.showError(error.message || 'Failed to optimize flight plan. Please try again.');
        } finally {
            this.setOptimizeLoading(false);
        }
    }

    displayOptimizationResults(data, elevationFeet) {
        const params = data.optimized_params;
        const info = data.optimization_info || {};
        
        // Update result values
        document.getElementById('patternType').textContent = 'Exponential Spiral';
        document.getElementById('numBounces').textContent = params.N || '-';
        document.getElementById('flightRadius').textContent = params.rHold ? `${Math.round(params.rHold)} ft` : '-';
        document.getElementById('estimatedTime').textContent = params.estimated_time_minutes ? 
            `${params.estimated_time_minutes} min` : '-';
        
        // Set battery utilization color based on value
        const utilizationSpan = document.getElementById('batteryUtilization');
        if (params.battery_utilization) {
            utilizationSpan.textContent = `${params.battery_utilization}%`;
            // Color coding for utilization
            utilizationSpan.className = 'result-value';
            if (params.battery_utilization > 90) {
                utilizationSpan.classList.add('warning');
            } else if (params.battery_utilization < 70) {
                utilizationSpan.classList.add('error');
            } else {
                utilizationSpan.classList.add('success');
            }
        } else {
            utilizationSpan.textContent = '-';
            utilizationSpan.className = 'result-value';
        }

        // Display elevation if available
        if (elevationFeet !== null) {
            document.getElementById('groundElevation').textContent = `${Math.round(elevationFeet)} ft MSL`;
        } else {
            document.getElementById('groundElevation').textContent = 'N/A';
        }

        // Show the results section
        document.getElementById('optimizationResults').style.display = 'block';

        // Log optimization details
        this.logOptimizationDetails(data);
    }

    logOptimizationDetails(data) {
        const logContent = document.getElementById('logContent');
        const missionLogs = document.getElementById('missionLogs');
        
        if (logContent && missionLogs) {
            const params = data.optimized_params;
            const info = data.optimization_info || {};
            
            let logHtml = '';
            logHtml += `<p><strong>Optimization Algorithm:</strong> Intelligent Balanced Scaling with Binary Search</p>`;
            logHtml += `<p><strong>Pattern Type:</strong> Exponential Spiral with Neural Network Optimization</p>`;
            logHtml += `<p><strong>Start Radius:</strong> ${params.r0 || 150} ft</p>`;
            logHtml += `<p><strong>Slices:</strong> ${params.slices} (one per battery)</p>`;
            
            if (info.bounce_scaling_reason) {
                logHtml += `<p><strong>Bounce Count Logic:</strong> ${info.bounce_scaling_reason}</p>`;
            }
            
            if (info.radius_optimization_iterations) {
                logHtml += `<p><strong>Binary Search Iterations:</strong> ${info.radius_optimization_iterations}</p>`;
            }
            
            logHtml += `<p><strong>Safety Margin:</strong> 95% battery utilization maximum</p>`;
            logHtml += `<p><strong>Altitude Logic:</strong> Outbound: 0.37ft/ft climb, Inbound: 0.1ft/ft descent</p>`;
            
            logContent.innerHTML = logHtml;
            missionLogs.style.display = 'block';
        }
    }

    enableDownloads() {
        const downloadMasterCSV = document.getElementById('downloadMasterCSV');
        const batteryDownloads = document.getElementById('batteryDownloads');
        const batteryButtons = document.getElementById('batteryButtons');
        
        if (downloadMasterCSV) {
            downloadMasterCSV.disabled = false;
            downloadMasterCSV.style.display = 'block';
        }
        
        if (batteryDownloads && batteryButtons && this.currentOptimizedParams) {
            // Clear existing battery buttons
            batteryButtons.innerHTML = '';
            
            // Create individual battery download buttons
            for (let i = 0; i < this.currentOptimizedParams.slices; i++) {
                const batteryBtn = document.createElement('button');
                batteryBtn.type = 'button';
                batteryBtn.className = 'battery-btn';
                batteryBtn.innerHTML = `🔋 Battery ${i + 1}`;
                batteryBtn.onclick = (e) => {
                    e.preventDefault(); // Prevent form submission
                    this.handleDownloadBatteryCSV(i);
                };
                batteryButtons.appendChild(batteryBtn);
            }
            
            batteryDownloads.style.display = 'block';
        }
    }

    async handleDownloadMasterCSV() {
        if (!this.currentOptimizedParams) {
            this.showError('Please optimize the flight plan first.');
            return;
        }

        try {
            await this.downloadCSV('master', null);
        } catch (error) {
            console.error('Master CSV download error:', error);
            this.showError('Failed to download master CSV. Please try again.');
        }
    }

    async handleDownloadBatteryCSV(batteryIndex) {
        if (!this.currentOptimizedParams) {
            this.showError('Please optimize the flight plan first.');
            return;
        }

        try {
            await this.downloadCSV('battery', batteryIndex);
        } catch (error) {
            console.error(`Battery ${batteryIndex + 1} CSV download error:`, error);
            this.showError(`Failed to download battery ${batteryIndex + 1} CSV. Please try again.`);
        }
    }

    async downloadCSV(type, batteryIndex = null) {
        const requestBody = {
            slices: this.currentOptimizedParams.slices,
            N: this.currentOptimizedParams.N,
            r0: this.currentOptimizedParams.r0,
            rHold: this.currentOptimizedParams.rHold,
            center: this.currentOptimizedParams.center,
            minHeight: parseFloat(this.currentOptimizedParams.minHeight),
            maxHeight: this.currentOptimizedParams.maxHeight ? 
                      parseFloat(this.currentOptimizedParams.maxHeight) : null
        };

        let endpoint = `${ENHANCED_API_BASE}/api/csv`;
        let filename = 'flight-plan';

        if (type === 'battery' && batteryIndex !== null) {
            endpoint = `${ENHANCED_API_BASE}/api/csv/battery/${batteryIndex + 1}`;
            filename = `battery-${batteryIndex + 1}`;
        }

        // Add project title to filename if available
        const projectTitle = document.getElementById('projectTitle')?.value?.trim();
        if (projectTitle && projectTitle !== 'Untitled') {
            const safeTitle = projectTitle.replace(/[^a-zA-Z0-9-_]/g, '_').substring(0, 50);
            filename = type === 'battery' ? `${safeTitle}-${batteryIndex + 1}` : `${safeTitle}`;
        } else {
            // Use "Untitled" for default case
            filename = type === 'battery' ? `Untitled-${batteryIndex + 1}` : 'Untitled';
        }

        console.log(`Downloading ${type} CSV:`, { endpoint, requestBody });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `CSV download failed: ${response.status}`);
        }

        // Handle CSV response (should be text/csv)
        const csvText = await response.text();
        
        // Create download
        const blob = new Blob([csvText], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Log successful download
        this.logDownload(type, batteryIndex, filename);
    }

    logDownload(type, batteryIndex, filename) {
        const logContent = document.getElementById('logContent');
        if (logContent) {
            const downloadMsg = type === 'battery' ? 
                `Battery ${batteryIndex + 1} CSV downloaded: ${filename}.csv` :
                `Master CSV downloaded: ${filename}.csv`;
            
            const existingContent = logContent.innerHTML;
            logContent.innerHTML = existingContent + `<p><strong>Download:</strong> ${downloadMsg}</p>`;
        }
    }

    setOptimizeLoading(loading) {
        const optimizeButton = document.getElementById('optimizeButton');
        const optimizeButtonText = document.getElementById('optimizeButtonText');
        const optimizeSpinner = document.getElementById('optimizeSpinner');

        if (optimizeButton && optimizeButtonText && optimizeSpinner) {
            optimizeButton.disabled = loading;
            optimizeButtonText.textContent = loading ? 'Optimizing...' : 'Optimize Flight Plan';
            optimizeSpinner.style.display = loading ? 'block' : 'none';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('optimizationError');
        const errorText = document.getElementById('optimizationErrorText');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('optimizationError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    hideOptimizationResults() {
        const resultsDiv = document.getElementById('optimizationResults');
        const downloadMasterCSV = document.getElementById('downloadMasterCSV');
        const batteryDownloads = document.getElementById('batteryDownloads');
        const missionLogs = document.getElementById('missionLogs');
        
        if (resultsDiv) resultsDiv.style.display = 'none';
        if (downloadMasterCSV) {
            downloadMasterCSV.style.display = 'none';
            downloadMasterCSV.disabled = true;
        }
        if (batteryDownloads) batteryDownloads.style.display = 'none';
        if (missionLogs) missionLogs.style.display = 'none';
    }
}

// Initialize the enhanced drone path generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedDronePathGenerator();
});

// Keep essential file upload and ML processing functionality
async function saveSubmissionMetadata(objectKey) {
    const email = document.getElementById('email').value;
    const propertyTitle = document.getElementById('propertyTitle').value;
    const listingDescription = document.getElementById('listingDescription').value;
    const addressOfProperty = document.getElementById('addressOfProperty').value;
    const optionalNotes = document.getElementById('optionalNotes').value;

    const response = await fetch(API_ENDPOINTS.SAVE_SUBMISSION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            propertyTitle,
            listingDescription,
            addressOfProperty,
            optionalNotes,
            objectKey
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to save submission metadata: ${response.status}`);
    }

    return response.json();
}

async function startMultipartUpload(fileName, fileType) {
    const response = await fetch(API_ENDPOINTS.START_UPLOAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType })
    });

    if (!response.ok) {
        throw new Error(`Failed to start multipart upload: ${response.status}`);
    }

    return response.json();
}

async function getPresignedUrlForPart(uploadId, bucketName, objectKey, partNumber) {
    const response = await fetch(API_ENDPOINTS.GET_PRESIGNED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, bucketName, objectKey, partNumber })
    });

    if (!response.ok) {
        throw new Error(`Failed to get presigned URL: ${response.status}`);
    }

    return response.json();
}

async function completeMultipartUpload(uploadId, bucketName, objectKey, parts) {
    const response = await fetch(API_ENDPOINTS.COMPLETE_UPLOAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, bucketName, objectKey, parts })
    });

    if (!response.ok) {
        throw new Error(`Failed to complete multipart upload: ${response.status}`);
    }

    return response.json();
}

async function uploadFileInChunks(file) {
    const chunkSize = 50 * 1024 * 1024; // 50MB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize);

    try {
        // Start multipart upload
        const { uploadId, bucketName, objectKey } = await startMultipartUpload(file.name, file.type);
        
        const uploadPromises = [];
        const parts = [];

        // Upload chunks
        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            const partNumber = i + 1;

            const uploadPromise = uploadPart(uploadId, bucketName, objectKey, chunk, partNumber);
            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete
        const partResults = await Promise.all(uploadPromises);
        
        partResults.forEach((result, index) => {
            parts.push({
                PartNumber: index + 1,
                ETag: result.etag
            });
        });

        // Complete multipart upload
        const result = await completeMultipartUpload(uploadId, bucketName, objectKey, parts);
        
        // Save submission metadata
        await saveSubmissionMetadata(result.objectKey);
        
        return result;
        
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

async function uploadPart(uploadId, bucketName, objectKey, chunk, partNumber) {
    try {
        // Get presigned URL for this part
        const { presignedUrl } = await getPresignedUrlForPart(uploadId, bucketName, objectKey, partNumber);
        
        // Upload the chunk
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: chunk,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        if (!response.ok) {
            throw new Error(`Part ${partNumber} upload failed: ${response.status}`);
        }

        return {
            partNumber,
            etag: response.headers.get('ETag')
        };
    } catch (error) {
        console.error(`Error uploading part ${partNumber}:`, error);
        throw error;
    }
}

// ML PROCESSING FUNCTIONALITY
(function() {
  // Configuration - Update this with your actual API Gateway URL after deployment
  const ML_API_BASE_URL = 'https://3xzfdyvwpd.execute-api.us-west-2.amazonaws.com/prod';
  
  const s3UrlInput = document.getElementById('s3UrlInput');
  const mlEmailField = document.getElementById('mlEmailField');
  const pipelineStepSelect = document.getElementById('pipelineStepSelect');
  const startProcessingBtn = document.getElementById('startProcessingBtn');
  const processingBtnText = document.getElementById('processingBtnText');
  const processingSpinner = document.getElementById('processingSpinner');
  const processingStatus = document.getElementById('processingStatus');
  const processingError = document.getElementById('processingError');
  const jobIdSpan = document.getElementById('jobId');
  const jobStatusSpan = document.getElementById('jobStatus');
  const errorMessageP = document.getElementById('errorMessage');
  const gpsCsvWrapper = document.getElementById('gpsCsvWrapper');
  const gpsCsvData = document.getElementById('gpsCsvData');

  // S3 URL validation regex - accepts both s3:// and https:// formats
  const S3_URL_REGEX = /^(?:s3:\/\/[a-z0-9.-]+\/(.+)|https:\/\/(?:([a-z0-9.-]+)\.s3\.amazonaws\.com\/(.+)|s3\.amazonaws\.com\/([a-z0-9.-]+)\/(.+)))$/;

  // Email validation regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (startProcessingBtn) {
    startProcessingBtn.addEventListener('click', handleStartProcessing);
  }

  if (s3UrlInput) {
    s3UrlInput.addEventListener('input', validateForm);
  }

  if (mlEmailField) {
    mlEmailField.addEventListener('input', validateForm);
  }

  if (pipelineStepSelect) {
    pipelineStepSelect.addEventListener('change', () => {
      updatePlaceholderText();
      toggleGpsCsvVisibility();
    });
    updatePlaceholderText(); // Initialize
    toggleGpsCsvVisibility(); // Initialize
  }

  function toggleGpsCsvVisibility() {
    if (!gpsCsvWrapper || !pipelineStepSelect) return;
    
    // Only show GPS CSV textarea for SfM step
    if (pipelineStepSelect.value === 'sfm') {
      gpsCsvWrapper.style.display = 'block';
    } else {
      gpsCsvWrapper.style.display = 'none';
    }
  }

  function updatePlaceholderText() {
    if (!s3UrlInput || !pipelineStepSelect) return;
    
    const step = pipelineStepSelect.value;
    const placeholders = {
      'sfm': 'S3 URL (images zip file for Structure from Motion processing)',
      '3dgs': 'S3 URL (sparse reconstruction output for 3D Gaussian Splatting)',
      'compression': 'S3 URL (3D Gaussian model for compression)'
    };
    
    const stepClasses = {
      'sfm': 'step-sfm',
      '3dgs': 'step-3dgs', 
      'compression': 'step-compression'
    };
    
    s3UrlInput.placeholder = placeholders[step] || placeholders['sfm'];
    
    // Update visual styling
    s3UrlInput.className = s3UrlInput.className.replace(/step-\w+/g, '');
    s3UrlInput.classList.add(stepClasses[step] || stepClasses['sfm']);
  }

  function validateForm() {
    const s3Url = s3UrlInput?.value?.trim() || '';
    const email = mlEmailField?.value?.trim() || '';
    
    const isValidS3Url = S3_URL_REGEX.test(s3Url);
    const isValidEmail = EMAIL_REGEX.test(email);
    
    if (startProcessingBtn) {
      startProcessingBtn.disabled = !(isValidS3Url && isValidEmail);
    }

    // Visual feedback for S3 URL
    if (s3UrlInput) {
      if (s3Url && !isValidS3Url) {
        s3UrlInput.style.borderColor = '#dc3545';
      } else {
        s3UrlInput.style.borderColor = '';
      }
    }

    // Visual feedback for email
    if (mlEmailField) {
      if (email && !isValidEmail) {
        mlEmailField.style.borderColor = '#dc3545';
      } else {
        mlEmailField.style.borderColor = '';
      }
    }
  }

  async function handleStartProcessing() {
    const s3Url = s3UrlInput?.value?.trim();
    const email = mlEmailField?.value?.trim();
    const pipelineStep = pipelineStepSelect?.value || 'sfm';
    const csvData = gpsCsvData?.value?.trim();

    if (!s3Url || !email) {
      showError('Please fill in all required fields.');
      return;
    }

    if (!S3_URL_REGEX.test(s3Url)) {
      showError('Please enter a valid S3 URL (e.g., s3://bucket-name/file.zip or https://bucket-name.s3.amazonaws.com/file.zip)');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    // Show loading state
    setLoadingState(true);
    hideStatus();
    hideError();

    try {
      const requestBody = {
        s3Url: s3Url,
        email: email,
        pipelineStep: pipelineStep
      };

      // Add CSV data only if it's the SfM step and data is provided
      if (pipelineStep === 'sfm' && csvData) {
        requestBody.csvData = csvData;
        console.log('🛰️ Including GPS CSV data for enhanced SfM processing');
      }

      const response = await fetch(`${ML_API_BASE_URL}/start-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Show success status
      showSuccess(data.jobId, data.executionArn);

    } catch (error) {
      console.error('Error starting ML processing:', error);
      showError(error.message || 'Failed to start processing. Please try again.');
    } finally {
      setLoadingState(false);
    }
  }

  function setLoadingState(loading) {
    if (!startProcessingBtn || !processingBtnText || !processingSpinner) return;

    startProcessingBtn.disabled = loading;
    
    if (loading) {
      processingBtnText.textContent = 'Starting...';
      processingSpinner.style.display = 'inline-block';
    } else {
      processingBtnText.textContent = 'Start Processing';
      processingSpinner.style.display = 'none';
    }
  }

  // Enhanced progress tracking
  let currentTracker = null;

  function showProgressTracker(jobId, executionArn) {
    console.log('🎯 showProgressTracker called with jobId:', jobId, 'executionArn:', executionArn);
    
    // Use the existing processing status container instead of creating a new one
    const statusContainer = document.getElementById('processingStatus');
    if (!statusContainer) {
      console.error('❌ Processing status container not found!');
      return;
    }
    
    // Create the progress tracker HTML
    const trackerHTML = createProgressTrackerHTML(jobId, executionArn);
    console.log('🎨 Generated tracker HTML length:', trackerHTML.length);
    
    // Replace the content of the status container with our progress tracker
    statusContainer.innerHTML = trackerHTML;
    statusContainer.style.display = 'block';
    console.log('✅ Progress tracker displayed in status container');
    
    // Add stop button next to the start button
    addStopButtonToForm(jobId, executionArn);
    
    // Initialize the progress tracker
    initializeProgressTracker(jobId, executionArn);
    console.log('🚀 Progress tracker initialized');
  }

  function addStopButtonToForm(jobId, executionArn) {
    // Find the start button
    const startButton = document.querySelector('#ml-container .dpu-btn');
    if (!startButton) {
      console.error('❌ Start button not found');
      return;
    }
    
    // Check if stop button already exists
    if (document.getElementById('stopProcessingButton')) {
      return; // Already added
    }
    
    // Create stop button
    const stopButton = document.createElement('button');
    stopButton.id = 'stopProcessingButton';
    stopButton.className = 'stop-button';
    stopButton.innerHTML = `
      <span class="stop-icon">⏹</span>
      Stop Processing
    `;
    stopButton.onclick = () => stopProcessing(jobId, executionArn);
    
    // Insert stop button after start button
    startButton.parentNode.insertBefore(stopButton, startButton.nextSibling);
    console.log('✅ Stop button added to form');
  }



  function createProgressTrackerHTML(jobId, executionArn) {
    return `
      <div class="apple-progress-tracker" id="appleProgressTracker">
        <!-- Progress Bar Container -->
        <div class="progress-container">
          <div class="pill-progress-bar">
            <div class="pill-progress-fill" id="pillProgressFill"></div>
          </div>
          <div class="status-text" id="statusText">Setting up your processing pipeline</div>
        </div>
      </div>
    `;
  }

  function initializeProgressTracker(jobId, executionArn) {
    const startTime = Date.now();
    let currentStage = 'starting';
    let status = 'RUNNING';

    // Simple timer (no display needed for minimal design)
    const timeInterval = setInterval(() => {
      // Just keeping track of time, no UI update needed
    }, 1000);

    // Simulate realistic progress
    const progressSteps = [
      { delay: 2000, stage: 'sfm', progress: 25, details: 'Processing images...' },
      { delay: 120000, stage: 'sfm', progress: 25, details: 'Feature extraction: 45% complete' },
      { delay: 240000, stage: 'sfm', progress: 25, details: 'Feature matching: 78% complete' },
      { delay: 360000, stage: '3dgs', progress: 70, details: 'Starting progressive training...' },
      { delay: 420000, stage: '3dgs', progress: 70, details: 'Phase 1: Coarse structure (25% resolution)' },
      { delay: 540000, stage: '3dgs', progress: 70, details: 'Phase 2: Intermediate detail (50% resolution)' },
      { delay: 660000, stage: '3dgs', progress: 70, details: 'Phase 3: Fine detail (75% resolution)' },
      { delay: 720000, stage: '3dgs', progress: 70, details: 'Phase 4: Full resolution training' },
      { delay: 780000, stage: 'compression', progress: 90, details: 'Optimizing for web delivery...' },
      { delay: 840000, stage: 'completed', progress: 100, details: 'Processing complete!' }
    ];

    progressSteps.forEach(step => {
      setTimeout(() => {
        updateProgressDisplay(step.stage, step.progress, step.details);
        if (step.stage === 'completed') {
          clearInterval(timeInterval);
          showCompletionMessage(jobId);
        }
      }, step.delay);
    });

    // Store references for cleanup
    currentTracker = {
      timeInterval,
      jobId,
      executionArn
    };
  }

  function updateProgressDisplay(stage, progress, details) {
    const stageMessages = {
      starting: 'Setting up your processing pipeline',
      sfm: 'Extracting features from uploaded images',
      '3dgs': 'Training advanced neural 3D representation',
      compression: 'Optimizing model for web delivery',
      completed: 'Your 3D model is ready!'
    };

    // Update progress bar
    const progressFill = document.getElementById('pillProgressFill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    // Update status text
    const statusText = document.getElementById('statusText');
    if (statusText) {
      const message = details || stageMessages[stage] || stageMessages.starting;
      statusText.textContent = message;
    }

    // Show completion state if done
    if (stage === 'completed') {
      const statusText = document.getElementById('statusText');
      if (statusText) {
        statusText.textContent = 'Your 3D model is ready!';
      }
      
      // Hide stop button when complete
      const stopButton = document.getElementById('stopProcessingButton');
      if (stopButton) {
        stopButton.style.display = 'none';
      }
    }
  }

  function showCompletionMessage(jobId) {
    const statusMessages = document.getElementById('statusMessages');
    if (statusMessages) {
      statusMessages.innerHTML = `
        <div class="success-container">
          <div class="success-message">
            <span class="success-icon">🎉</span>
            <div>
              <strong>Processing Complete!</strong>
              <p>Your 3D Gaussian Splat model has been optimized and is ready for download. Check your email for the download link.</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Stop processing function
  function stopProcessing(jobId, executionArn) {
    console.log('🛑 Stopping processing for job:', jobId);
    
    // Show confirmation
    if (!confirm('Are you sure you want to stop processing? This cannot be undone.')) {
      return;
    }
    
    // Update UI immediately
    const statusText = document.getElementById('statusText');
    const stopButton = document.getElementById('stopButton');
    const progressFill = document.getElementById('pillProgressFill');
    
    if (statusText) statusText.textContent = 'Stopping processing...';
    if (stopButton) stopButton.disabled = true;
    
    // Call API to stop the job (this would need to be implemented)
    fetch(`${ML_API_BASE_URL}/stop-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, executionArn })
    })
    .then(response => response.json())
    .then(data => {
      if (statusText) statusText.textContent = 'Processing stopped';
      if (progressFill) progressFill.style.background = '#ef4444';
      setTimeout(() => {
        // Hide the progress tracker after a delay
        const tracker = document.getElementById('appleProgressTracker');
        if (tracker) tracker.style.display = 'none';
      }, 2000);
    })
    .catch(error => {
      console.error('Error stopping job:', error);
      if (statusText) statusText.textContent = 'Failed to stop processing';
      if (stopButton) stopButton.disabled = false;
    });
  }

  // Make it globally available
  window.stopProcessing = stopProcessing;

  function showSuccess(jobId, executionArn) {
    console.log('✅ Job started successfully, showing progress tracker...');
    
    // Show the beautiful progress tracker instead of the basic status
    showProgressTracker(jobId, executionArn);

    // Store the execution ARN for future status checking
    console.log('Execution ARN:', executionArn);
    console.log('🎉 Progress tracker initialized for job:', jobId);
  }

  function showError(message) {
    if (!processingError || !errorMessageP) return;

    errorMessageP.textContent = message;
    processingError.style.display = 'block';
  }

  function hideError() {
    if (processingError) {
      processingError.style.display = 'none';
    }
  }

  function hideStatus() {
    if (processingStatus) {
      processingStatus.style.display = 'none';
    }
  }

  // Initialize form validation
  validateForm();
})();

// Mapbox Integration for New Project Modal
let map = null;
let currentMarker = null;
let selectedCoordinates = null;

// Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhY2Vwb3J0IiwiYSI6ImNtY3F6MW5jYjBsY2wyanEwbHVnd3BrN2sifQ.z2mk_LJg-ey2xqxZW1vW6Q';

// Global function to hide instructions
function hideInstructions() {
  const instructions = document.getElementById('map-instructions');
  const mapContainer = document.querySelector('.map-container');
  
  if (instructions && !instructions.classList.contains('hidden')) {
    instructions.classList.add('hidden');
    mapContainer.classList.add('instructions-hidden');
    
    // Delay removing the instructions to allow for fade out animation
    setTimeout(() => {
      instructions.style.display = 'none';
      mapContainer.classList.remove('has-instructions', 'instructions-hidden');
    }, 300);
  }
}

function initializeMap() {
  // Only initialize if the map container exists and map hasn't been created yet
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer || map) return;

  try {
    map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/satellite-v9', // Satellite imagery
      center: [-98.5795, 39.8283], // Center of USA as default
      zoom: 4,
      attributionControl: false // Remove attribution for cleaner look
    });

    // Hide instructions on any map interaction

    // Show instructions initially and add click handler
    document.addEventListener('DOMContentLoaded', () => {
      const mapContainer = document.querySelector('.map-container');
      const instructions = document.getElementById('map-instructions');
      const instructionContent = document.querySelector('.instruction-content');
      
      mapContainer.classList.add('has-instructions');
      
      // Add click handler to instructions
      if (instructionContent) {
        instructionContent.addEventListener('click', (e) => {
          e.stopPropagation();
          hideInstructions();
        });
      }
    });

    // Add interaction event listeners to hide instructions
    map.on('mousedown', hideInstructions);
    map.on('touchstart', hideInstructions);
    map.on('drag', hideInstructions);
    map.on('zoom', hideInstructions);

    // Add click event listener
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // DIAGNOSTIC: Log click details
      const mapContainer = document.getElementById('map-container');
      const isFullscreen = mapContainer.classList.contains('fullscreen');
      const containerRect = mapContainer.getBoundingClientRect();
      
      console.log('🎯 CLICK DIAGNOSTIC:', {
        coordinates: { lat, lng },
        isFullscreen,
        containerRect: {
          x: containerRect.x,
          y: containerRect.y,
          width: containerRect.width,
          height: containerRect.height,
          top: containerRect.top,
          left: containerRect.left
        },
        clickPoint: e.point,
        originalEventDetails: e.originalEvent ? {
          clientX: e.originalEvent.clientX,
          clientY: e.originalEvent.clientY,
          pageX: e.originalEvent.pageX,
          pageY: e.originalEvent.pageY
        } : null
      });
      
      // CRITICAL FIX: In fullscreen mode, manually correct the click coordinates
      // The issue is that Mapbox's coordinate calculation is offset when container moves to document.body
      let correctedLng = lng;
      let correctedLat = lat;
      
      if (isFullscreen && e.originalEvent) {
        // Get the actual click position relative to the map canvas
        const canvas = map.getCanvas();
        const canvasRect = canvas.getBoundingClientRect();
        const originalEvent = e.originalEvent;
        
        // Calculate the click position relative to the canvas
        const canvasX = originalEvent.clientX - canvasRect.left;
        const canvasY = originalEvent.clientY - canvasRect.top;
        
        // Convert canvas coordinates to map coordinates
        const correctedLngLat = map.unproject([canvasX, canvasY]);
        
        correctedLng = correctedLngLat.lng;
        correctedLat = correctedLngLat.lat;
        
        console.log('🔧 FULLSCREEN COORDINATE CORRECTION:', {
          original: { lng, lat },
          corrected: { lng: correctedLng, lat: correctedLat },
          canvasRect: { 
            left: canvasRect.left, 
            top: canvasRect.top,
            width: canvasRect.width,
            height: canvasRect.height
          },
          clickPosition: {
            clientX: originalEvent.clientX,
            clientY: originalEvent.clientY,
            canvasX: canvasX,
            canvasY: canvasY
          }
        });
      }
      
      // Store the selected coordinates (use corrected coordinates in fullscreen)
      selectedCoordinates = { lng: correctedLng, lat: correctedLat };
      
      // Update address field with coordinates (only if field is empty)
      updateAddressFieldWithCoordinates(correctedLat, correctedLng);
      
      // Remove existing marker if any
      if (currentMarker) {
        currentMarker.remove();
      }
      
      // Create custom teardrop pin element
      const pinElement = document.createElement('div');
      pinElement.className = 'custom-teardrop-pin';
      pinElement.innerHTML = `
        <svg width="32" height="50" viewBox="0 0 32 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1896 0.32019C7.73592 0.32019 0.882812 7.17329 0.882812 15.627C0.882812 17.3862 1.17959 19.0761 1.72582 20.6494L1.7359 20.6784C1.98336 21.3865 2.2814 22.0709 2.62567 22.7272L13.3424 47.4046L13.3581 47.3897C13.8126 48.5109 14.9121 49.3016 16.1964 49.3016C17.5387 49.3016 18.6792 48.4377 19.0923 47.2355L29.8623 22.516C30.9077 20.4454 31.4965 18.105 31.4965 15.627C31.4965 7.17329 24.6434 0.32019 16.1896 0.32019ZM16.18 9.066C12.557 9.066 9.61992 12.003 9.61992 15.6261C9.61992 19.2491 12.557 22.1861 16.18 22.1861C19.803 22.1861 22.7401 19.2491 22.7401 15.6261C22.7401 12.003 19.803 9.066 16.18 9.066Z" fill="white"/>
        </svg>
      `;
      
      // Add new marker with custom element, anchored at bottom center
      currentMarker = new mapboxgl.Marker({
        element: pinElement,
        anchor: 'bottom'
      })
      .setLngLat([correctedLng, correctedLat])
      .addTo(map);
      
      // DIAGNOSTIC: Check marker positioning
      setTimeout(() => {
        const markerElement = currentMarker.getElement();
        const markerRect = markerElement.getBoundingClientRect();
        console.log('📍 MARKER POSITIONING:', {
          coordinates: { lat: correctedLat, lng: correctedLng },
          isFullscreen,
          markerRect: {
            x: markerRect.x,
            y: markerRect.y,
            top: markerRect.top,
            left: markerRect.left,
            width: markerRect.width,
            height: markerRect.height
          },
          markerStyle: {
            transform: markerElement.style.transform,
            position: markerElement.style.position
          }
        });
      }, 100);
      
      console.log('Selected coordinates:', { lat: correctedLat, lng: correctedLng });
    });

    // Initialize expand button functionality
    initializeExpandButton();

    // Initialize address search functionality
    initializeAddressSearch();

    console.log('✅ Mapbox map initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Mapbox map:', error);
  }
}

// Function to get selected coordinates (for use in drone path generation)
function getSelectedCoordinates() {
  return selectedCoordinates;
}

// Function to update address field with coordinates
function updateAddressFieldWithCoordinates(lat, lng) {
  const addressInput = document.getElementById('address-search');
  if (!addressInput) return;
  
  // Always update the field with coordinates, replacing any existing text
  const formattedLat = lat.toFixed(6);
  const formattedLng = lng.toFixed(6);
  
  // Update the input field with coordinates
  addressInput.value = `${formattedLat}, ${formattedLng}`;
  
  console.log('Updated address field with coordinates:', { lat: formattedLat, lng: formattedLng });
}

// Function to clear address field and restore placeholder
function clearAddressField() {
  const addressInput = document.getElementById('address-search');
  if (addressInput) {
    addressInput.value = '';
    // Trigger input event to ensure any listeners are notified
    addressInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// Initialize expand/fullscreen button functionality
function initializeExpandButton() {
  const expandButton = document.getElementById('expand-button');
  const mapContainer = document.getElementById('map-container');
  
  if (!expandButton || !mapContainer) return;

  expandButton.addEventListener('click', () => {
    const isFullscreen = mapContainer.classList.contains('fullscreen');
    
    if (isFullscreen) {
      // Exit fullscreen
      mapContainer.classList.remove('fullscreen');
      expandButton.classList.remove('expanded');
      
      // Move back to original parent
      const mapSection = document.querySelector('.popup-map-section');
      if (mapSection) {
        mapSection.appendChild(mapContainer);
      }

      // Reinitialize scroll zoom to fix cursor alignment when exiting fullscreen
      if (map && map.scrollZoom) {
        map.scrollZoom.disable();
        map.scrollZoom.enable();
      }
    } else {
      // Enter fullscreen
      mapContainer.classList.add('fullscreen');
      expandButton.classList.add('expanded');
      
      // Move to body for true fullscreen
      document.body.appendChild(mapContainer);

      // Reinitialize scroll zoom to fix cursor alignment in fullscreen
      if (map && map.scrollZoom) {
        map.scrollZoom.disable();
        map.scrollZoom.enable();
      }
    }
    
    // CRITICAL FIX: Force complete Mapbox reinitialization after DOM move
    setTimeout(() => {
      if (map) {
        console.log('🔄 CRITICAL FIX: Forcing Mapbox coordinate system recalculation after DOM move');
        
        // Step 1: Get current state
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();
        const currentBearing = map.getBearing();
        const currentPitch = map.getPitch();
        
        // Step 2: NUCLEAR OPTION - Force Mapbox to completely recalculate its coordinate system
        // The issue is that when we move the container to document.body, Mapbox's internal
        // coordinate calculations are still based on the old container position
        
        // Force complete internal recalculation
        map.resize();
        
        // Get the canvas and force it to recalculate its position
        const canvas = map.getCanvas();
        const container = map.getContainer();
        
        // CRITICAL: Force the canvas to recalculate its offset relative to the document
        // This is the key fix - Mapbox needs to know the container moved to document.body
        const containerRect = container.getBoundingClientRect();
        console.log('📐 Container position after DOM move:', {
          top: containerRect.top,
          left: containerRect.left,
          width: containerRect.width,
          height: containerRect.height,
          isFullscreen: !isFullscreen // Will be opposite after toggle
        });
        
        // Multiple resize calls to force internal recalculation
        map.resize();
        map.fire('resize');
        
        // Force canvas to recalculate its position by triggering a complete re-render
        setTimeout(() => {
          map.resize();
          
          // Force re-render with position change
          map.jumpTo({
            center: [currentCenter.lng + 0.0000001, currentCenter.lat + 0.0000001],
            zoom: currentZoom,
            bearing: currentBearing,
            pitch: currentPitch
          });
          
          // Return to exact position
          setTimeout(() => {
            map.jumpTo({
              center: currentCenter,
              zoom: currentZoom,
              bearing: currentBearing,
              pitch: currentPitch
            });
            
            // Final resize to lock in the coordinate system
            map.resize();
            
            console.log('✅ Coordinate system reset complete');
          }, 100);
        }, 100);
      }
    }, 300);
  });

  // ESC key to exit fullscreen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapContainer.classList.contains('fullscreen')) {
      expandButton.click();
    }
  });
}

// Initialize address search functionality
function initializeAddressSearch() {
  const addressInput = document.getElementById('address-search');
  if (!addressInput) return;

  addressInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const address = addressInput.value.trim();
      if (address) {
        await searchAddress(address);
      }
    }
  });
}

// Search for address using Mapbox Geocoding API
async function searchAddress(address) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      
      // Fly to the location
      map.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 2000
      });
      
      // Set the marker and coordinates
      selectedCoordinates = { lng, lat };
      
      // Update address field with the searched address (not coordinates)
      const addressInput = document.getElementById('address-search');
      if (addressInput) {
        addressInput.value = address;
      }
      
      // Remove existing marker if any
      if (currentMarker) {
        currentMarker.remove();
      }
      
      // Create custom teardrop pin element
      const pinElement = document.createElement('div');
      pinElement.className = 'custom-teardrop-pin';
      pinElement.innerHTML = `
        <svg width="32" height="50" viewBox="0 0 32 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1896 0.32019C7.73592 0.32019 0.882812 7.17329 0.882812 15.627C0.882812 17.3862 1.17959 19.0761 1.72582 20.6494L1.7359 20.6784C1.98336 21.3865 2.2814 22.0709 2.62567 22.7272L13.3424 47.4046L13.3581 47.3897C13.8126 48.5109 14.9121 49.3016 16.1964 49.3016C17.5387 49.3016 18.6792 48.4377 19.0923 47.2355L29.8623 22.516C30.9077 20.4454 31.4965 18.105 31.4965 15.627C31.4965 7.17329 24.6434 0.32019 16.1896 0.32019ZM16.18 9.066C12.557 9.066 9.61992 12.003 9.61992 15.6261C9.61992 19.2491 12.557 22.1861 16.18 22.1861C19.803 22.1861 22.7401 19.2491 22.7401 15.6261C22.7401 12.003 19.803 9.066 16.18 9.066Z" fill="white"/>
        </svg>
      `;
      
      // Add new marker with custom element, anchored at bottom center
      currentMarker = new mapboxgl.Marker({
        element: pinElement,
        anchor: 'bottom'
      })
      .setLngLat([lng, lat])
      .addTo(map);
      
      console.log('Address found:', { address, lat, lng });
    } else {
      console.log('Address not found');
      // Could show a subtle error message here
    }
  } catch (error) {
    console.error('Error searching address:', error);
  }
}



// Initialize map when new project popup opens
const originalOpenNewProjectPopup = window.openNewProjectPopup;
window.openNewProjectPopup = function() {
  originalOpenNewProjectPopup();
  
  // Initialize map after popup is shown
  setTimeout(() => {
    initializeMap();
  }, 100);
  
  // Initialize flight path integration
  setTimeout(() => {
    projectPopupFlightPath = new ProjectPopupFlightPath();
    projectPopupPhotoUpload = new ProjectPopupPhotoUpload();
  }, 150);
  
  // Initialize flight path button monitoring
  initializeFlightPathButtons();
  
  // Initialize explanatory text functionality
  initializeExplanatoryText();
};

// Clean up map when popup closes
const originalCloseNewProjectPopup = window.closeNewProjectPopup;
window.closeNewProjectPopup = function() {
  if (map) {
    // If map is in fullscreen, exit first
    const mapContainer = document.getElementById('map-container');
    if (mapContainer && mapContainer.classList.contains('fullscreen')) {
      mapContainer.classList.remove('fullscreen');
      const mapSection = document.querySelector('.popup-map-section');
      if (mapSection) {
        mapSection.appendChild(mapContainer);
      }
    }
    
    map.remove();
    map = null;
    currentMarker = null;
    selectedCoordinates = null;
  }
  
  // Clear the address field when closing the popup
  clearAddressField();
  
  // Ensure body class is removed
  document.body.classList.remove('popup-open');
  
  originalCloseNewProjectPopup();
};

// Make functions globally available
window.getSelectedCoordinates = getSelectedCoordinates;
window.updateAddressFieldWithCoordinates = updateAddressFieldWithCoordinates;
window.clearAddressField = clearAddressField;

// Flight Path Download Buttons Functionality
function initializeFlightPathButtons() {
  // Find the battery quantity input
  const batteryQuantityInput = document.querySelector('.popup-input-wrapper input[placeholder="Quantity"]');
  const flightPathGrid = document.getElementById('flight-path-buttons');
  
  if (!batteryQuantityInput || !flightPathGrid) return;
  
  // Monitor changes to battery quantity
  batteryQuantityInput.addEventListener('input', function() {
    const batteryCount = parseInt(this.value) || 0;
    updateFlightPathButtons(batteryCount, flightPathGrid);
  });
  
  // Initial update
  const initialCount = parseInt(batteryQuantityInput.value) || 0;
  updateFlightPathButtons(initialCount, flightPathGrid);
}

// Explanatory Text Functionality
function initializeExplanatoryText() {
  const inputs = document.querySelectorAll('.popup-input-wrapper input[data-suffix]');
  console.log('Found inputs with suffixes:', inputs.length);
  
  inputs.forEach(input => {
    console.log('Setting up suffix for:', input.placeholder, 'with suffix:', input.getAttribute('data-suffix'));
    
    input.addEventListener('input', function() {
      updateExplanatoryText(this);
    });
    
    // Initial update
    updateExplanatoryText(input);
  });
}

function updateExplanatoryText(input) {
  let value = input.value.trim();
  const suffix = input.getAttribute('data-suffix');
  const plural = input.getAttribute('data-plural');
  const wrapper = input.closest('.popup-input-wrapper');
  
  // Remove any existing suffix from the value
  const suffixRegex = new RegExp(`${suffix}$|${plural}$`);
  value = value.replace(suffixRegex, '').trim();
  
  if (value) {
    // Determine which suffix to use
    let displaySuffix = suffix;
    if (plural && value !== '1') {
      displaySuffix = plural;
    }
    
    // Don't modify the input value while user is typing
    if (!input.matches(':focus')) {
      input.value = value + displaySuffix;
    }
    
    // Store the raw value as a data attribute
    input.setAttribute('data-raw-value', value);
  } else {
    input.value = '';
    input.removeAttribute('data-raw-value');
  }
}

// Add event listeners for focus and blur
function initializeExplanatoryText() {
  const inputs = document.querySelectorAll('.popup-input-wrapper input[data-suffix]');
  
  inputs.forEach(input => {
    // Handle input changes
    input.addEventListener('input', function() {
      // When user is typing, only show their input
      const rawValue = this.value.trim();
      this.setAttribute('data-raw-value', rawValue);
    });
    
    // When input loses focus, show value with suffix
    input.addEventListener('blur', function() {
      updateExplanatoryText(this);
    });
    
    // When input gains focus, show only the raw value
    input.addEventListener('focus', function() {
      const rawValue = this.getAttribute('data-raw-value') || this.value.trim();
      const suffix = this.getAttribute('data-suffix');
      const plural = this.getAttribute('data-plural');
      const suffixRegex = new RegExp(`${suffix}$|${plural}$`);
      this.value = rawValue.replace(suffixRegex, '').trim();
    });
    
    // Initial update
    updateExplanatoryText(input);
  });
}

function updateFlightPathButtons(batteryCount, container) {
  // Clear existing buttons
  container.innerHTML = '';
  
  if (batteryCount <= 0) {
    // Show placeholder message when no batteries
    container.innerHTML = '<div class="flight-path-placeholder">Enter battery quantity to generate flight paths</div>';
    return;
  }
  
  // Generate buttons for each battery with staggered animation
  for (let i = 1; i <= batteryCount; i++) {
    const button = document.createElement('button');
    button.className = 'flight-path-download-btn';
    button.innerHTML = `
      <span class="download-icon"></span>
      Battery ${i}
    `;
    
    // Add staggered delay for luxurious sequential appearance
    button.style.animationDelay = `${(i - 1) * 0.15}s`;
    
    // Add click handler for download
    button.addEventListener('click', function() {
      downloadBatteryFlightPath(i);
    });
    
    container.appendChild(button);
  }
}

function downloadBatteryFlightPath(batteryNumber) {
  // Hook into the ProjectPopupFlightPath integration
  if (projectPopupFlightPath) {
    projectPopupFlightPath.handleBatteryClick(batteryNumber);
  } else {
    console.error('ProjectPopupFlightPath not initialized');
    alert('Flight path system not ready. Please try again.');
  }
}

// Auto-resize textarea
const projectTitle = document.getElementById('projectTitle');
if (projectTitle) {
  const resizeTextarea = () => {
    projectTitle.style.height = 'auto';
    projectTitle.style.height = projectTitle.scrollHeight + 'px';
  };
  
  projectTitle.addEventListener('input', resizeTextarea);
  // Initial resize
  resizeTextarea();
}

document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.querySelector('.map-container');
  const instructions = document.getElementById('map-instructions');
  const instructionContent = document.querySelector('.instruction-content');
  const addressInput = document.getElementById('address-search');

  mapContainer.classList.add('has-instructions');

  // Add click handler to instructions
  if (instructionContent) {
    instructionContent.addEventListener('click', (e) => {
      e.stopPropagation();
      hideInstructions();
    });
  }

  // Add focus/click/touch handler to address search input
  if (addressInput) {
    addressInput.addEventListener('focus', () => {
      hideInstructions();
    });
    addressInput.addEventListener('mousedown', () => {
      hideInstructions();
    });
    addressInput.addEventListener('touchstart', () => {
      hideInstructions();
    });
  }
});

// Auto-resize Listing Description textarea
const listingDescription = document.getElementById('listingDescription');
if (listingDescription) {
  listingDescription.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
  // Trigger resize on page load if there's pre-filled content
  setTimeout(() => {
    listingDescription.style.height = 'auto';
    listingDescription.style.height = (listingDescription.scrollHeight) + 'px';
  }, 0);
}

// PROJECT POPUP FLIGHT PATH INTEGRATION
class ProjectPopupFlightPath {
  constructor() {
    this.optimizedParams = null;
    this.isOptimizing = false;
    this.API_BASE = "https://7bidiow2t9.execute-api.us-west-2.amazonaws.com/prod";
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Setup listeners immediately since we're called after popup is opened
    this.setupInputListeners();
  }

  setupInputListeners() {
    // Battery inputs
    const batteryDuration = document.querySelector('.popup-input-wrapper input[placeholder="Duration"]');
    const batteryQuantity = document.querySelector('.popup-input-wrapper input[placeholder="Quantity"]');
    
    // Altitude inputs
    const minAltitude = document.querySelector('.popup-input-wrapper input[placeholder="Minimum"]');
    const maxAltitude = document.querySelector('.popup-input-wrapper input[placeholder="Maximum"]');

    // Set up input event listeners to clear optimization when params change
    [batteryDuration, batteryQuantity, minAltitude, maxAltitude].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.clearOptimizedResults();
        });
      }
    });
  }

  clearOptimizedResults() {
    this.optimizedParams = null;
  }

  canOptimize() {
    const coordinates = this.getSelectedCoordinates();
    const batteryDuration = this.getBatteryDuration();
    const batteryQuantity = this.getBatteryQuantity();

    return coordinates && batteryDuration && batteryQuantity;
  }

  getSelectedCoordinates() {
    // Get coordinates from the map
    if (window.getSelectedCoordinates) {
      return window.getSelectedCoordinates();
    }
    return null;
  }

  getBatteryDuration() {
    const input = document.querySelector('.popup-input-wrapper input[placeholder="Duration"]');
    return input ? parseInt(input.value) || null : null;
  }

  getBatteryQuantity() {
    const input = document.querySelector('.popup-input-wrapper input[placeholder="Quantity"]');
    return input ? parseInt(input.value) || null : null;
  }

  getMinAltitude() {
    const input = document.querySelector('.popup-input-wrapper input[placeholder="Minimum"]');
    return input ? parseFloat(input.value) || 120 : 120; // Default to 120ft
  }

  getMaxAltitude() {
    const input = document.querySelector('.popup-input-wrapper input[placeholder="Maximum"]');
    return input ? parseFloat(input.value) || null : null;
  }

  // Battery button click handler - this will be called by existing battery buttons
  async handleBatteryClick(batteryNumber) {
    console.log(`🔋 Battery ${batteryNumber} clicked`);
    
    // Check if we can optimize
    if (!this.canOptimize()) {
      this.showOptimizationError('Please select coordinates and enter battery parameters first');
      return;
    }
    
    // Start loading state
    this.setLoadingState(batteryNumber, true);
    
    try {
      // If not already optimized, optimize first
      if (!this.optimizedParams) {
        console.log('⚡ Optimizing flight path first...');
        const success = await this.optimizeFlightPath();
        if (!success) {
          return; // Error already shown
        }
      }
      
      // Download the specific battery CSV
      await this.downloadBatteryCSV(batteryNumber - 1); // Convert to 0-based index
    } finally {
      // Always restore loading state
      this.setLoadingState(batteryNumber, false);
    }
  }

  // Set loading state for button and headline
  setLoadingState(batteryNumber, isLoading) {
    // Find the specific battery button
    const buttons = document.querySelectorAll('.flight-path-download-btn');
    const targetButton = Array.from(buttons).find(btn => 
      btn.textContent.includes(`Battery ${batteryNumber}`)
    );
    
    // Find the correct headline - specifically the Flight Paths section
    const flightPathContainer = document.getElementById('flight-path-buttons');
    const headline = flightPathContainer ? flightPathContainer.closest('.popup-section').querySelector('h4') : null;
    
    if (isLoading) {
      // Set button loading state
      if (targetButton) {
        targetButton.classList.add('loading');
        const icon = targetButton.querySelector('.download-icon');
        if (icon) {
          icon.classList.add('loading');
        }
      }
      
      // Update headline with progressive text changes
      if (headline) {
        headline.textContent = 'This may take a moment...';
        
        // Change to "Processing" after 3 seconds
        setTimeout(() => {
          if (headline && headline.textContent === 'This may take a moment...') {
            headline.textContent = 'Processing';
          }
        }, 3000);
      }
    } else {
      // Restore button normal state
      if (targetButton) {
        targetButton.classList.remove('loading');
        const icon = targetButton.querySelector('.download-icon');
        if (icon) {
          icon.classList.remove('loading');
        }
      }
      
      // Restore headline
      if (headline) {
        headline.textContent = 'Flight Paths';
      }
    }
  }

  async optimizeFlightPath() {
    if (this.isOptimizing) return false;

    this.isOptimizing = true;

    try {
      const coordinates = this.getSelectedCoordinates();
      const batteryDuration = this.getBatteryDuration();
      const batteryQuantity = this.getBatteryQuantity();

      if (!coordinates || !batteryDuration || !batteryQuantity) {
        throw new Error('Missing required parameters');
      }

      console.log('⚡ Optimizing flight path...', { 
        batteryDuration, 
        batteryQuantity, 
        coordinates 
      });

      // Step 1: Optimize the spiral pattern
      const optimizationResponse = await fetch(`${this.API_BASE}/api/optimize-spiral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batteryMinutes: batteryDuration,
          batteries: batteryQuantity,
          center: `${coordinates.lat}, ${coordinates.lng}`
        })
      });

      if (!optimizationResponse.ok) {
        throw new Error('Flight path optimization failed');
      }

      const optimizationData = await optimizationResponse.json();
      
      // Step 2: Get elevation data
      const elevationResponse = await fetch(`${this.API_BASE}/api/elevation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center: `${coordinates.lat}, ${coordinates.lng}`
        })
      });

      let elevationFeet = null;
      if (elevationResponse.ok) {
        const elevationData = await elevationResponse.json();
        elevationFeet = elevationData.elevation_feet;
      }

      // Store the optimized parameters
      this.optimizedParams = {
        ...optimizationData.optimized_params,
        center: `${coordinates.lat}, ${coordinates.lng}`,
        minHeight: this.getMinAltitude(),
        maxHeight: this.getMaxAltitude(),
        elevationFeet: elevationFeet
      };

      console.log('✅ Flight path optimized successfully:', this.optimizedParams);

      // Show success message
      this.showOptimizationSuccess();

      return true;

    } catch (error) {
      console.error('❌ Flight path optimization failed:', error);
      this.showOptimizationError(error.message);
      return false;
    } finally {
      this.isOptimizing = false;
    }
  }



  async downloadBatteryCSV(batteryIndex) {
    if (!this.optimizedParams) return;

    try {
      const response = await fetch(`${this.API_BASE}/api/csv/battery/${batteryIndex + 1}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.optimizedParams)
      });

      if (!response.ok) {
        throw new Error(`Failed to generate battery ${batteryIndex + 1} CSV`);
      }

      const csvText = await response.text();
      
      // Get project title for filename
      const projectTitle = document.getElementById('projectTitle')?.value?.trim();
      let filename;
      if (projectTitle && projectTitle !== 'Untitled') {
        const safeTitle = projectTitle.replace(/[^a-zA-Z0-9-_]/g, '_').substring(0, 50);
        filename = `${safeTitle}-${batteryIndex + 1}.csv`;
      } else {
        filename = `Untitled-${batteryIndex + 1}.csv`;
      }
      
      this.downloadCSVFile(csvText, filename);

    } catch (error) {
      console.error(`❌ Battery ${batteryIndex + 1} CSV download failed:`, error);
      this.showDownloadError(`Failed to download battery ${batteryIndex + 1} CSV`);
    }
  }

  downloadCSVFile(csvText, filename) {
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  showOptimizationSuccess() {
    console.log('✅ Flight path optimized successfully!');
    // You could add a toast notification here if desired
  }

  showOptimizationError(message) {
    console.error('❌ Optimization error:', message);
    alert(`Flight path optimization failed: ${message}`);
  }

  showDownloadError(message) {
    console.error('❌ Download error:', message);
    alert(`Download failed: ${message}`);
  }
}

// Photo Upload Integration Class
class ProjectPopupPhotoUpload {
  constructor() {
    this.API_ENDPOINTS = {
      START_UPLOAD: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/start-multipart-upload",
      GET_PRESIGNED_URL: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/get-presigned-url",
      COMPLETE_UPLOAD: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/complete-multipart-upload",
      SAVE_SUBMISSION: "https://o7d0i4to5a.execute-api.us-west-2.amazonaws.com/prod/save-submission",
      START_ML_PROCESSING: "https://3xzfdyvwpd.execute-api.us-west-2.amazonaws.com/prod/start-job"
    };
    
    this.CHUNK_SIZE = 24 * 1024 * 1024; // 24MB chunks
    this.MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB max
    
    this.uploadData = null;
    this.isProcessing = false;
    
    console.log('📸 ProjectPopupPhotoUpload initialized');
  }

  // Main upload handler - called by existing upload button
  async handleUpload() {
    if (this.isProcessing) {
      console.log('⏳ Upload already in progress');
      return;
    }

    console.log('🚀 Starting integrated upload flow');
    
    // Validate form and file
    const validation = this.validateForm();
    if (!validation.isValid) {
      this.showUploadError(validation.error);
      return;
    }

    // Start the integrated flow
    this.isProcessing = true;
    this.setUploadLoadingState(true, 'Uploading...');

    try {
      // Step 1: Upload photos to S3
      console.log('📤 Step 1: Uploading photos to S3');
      const uploadResult = await this.uploadPhotosToS3(validation.file, validation.formData);
      
      // Step 2: Start ML processing automatically
      console.log('🤖 Step 2: Starting ML processing');
      this.setUploadLoadingState(true, 'Starting ML Processing...');
      
      const mlResult = await this.startMLProcessing(uploadResult.s3Url, validation.formData.email);
      
      // Step 3: Show success
      this.showUploadSuccess(mlResult.jobId, mlResult.executionArn);
      
    } catch (error) {
      console.error('❌ Integrated upload failed:', error);
      this.showUploadError(error.message);
    } finally {
      this.isProcessing = false;
      this.setUploadLoadingState(false);
    }
  }

  // Validate form fields and file
  validateForm() {
    const propertyTitle = document.querySelector('#newProjectPopup input[placeholder="Property Title"]');
    const email = document.querySelector('#newProjectPopup input[placeholder="Email Address"]');
    const listingDescription = document.querySelector('#newProjectPopup textarea[placeholder="Listing Description"]');
    const uploadZone = document.querySelector('#newProjectPopup .upload-zone');
    
    // Check required fields
    if (!propertyTitle?.value?.trim()) {
      return { isValid: false, error: 'Property title is required' };
    }
    
    if (!email?.value?.trim()) {
      return { isValid: false, error: 'Email address is required' };
    }
    
    if (!this.isValidEmail(email.value.trim())) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    // Check file selection - we need to find the selected file
    const selectedFile = this.getSelectedFile();
    if (!selectedFile) {
      return { isValid: false, error: 'Please select a .zip file to upload' };
    }
    
    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      return { isValid: false, error: 'Please upload a .zip file only' };
    }
    
    // Validate file size
    if (selectedFile.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size exceeds 5GB limit' };
    }
    
    // Gather form data
    const formData = {
      propertyTitle: propertyTitle.value.trim(),
      email: email.value.trim(),
      listingDescription: listingDescription?.value?.trim() || ''
    };
    
    return { isValid: true, file: selectedFile, formData };
  }

  // Get the selected file from the upload zone
  getSelectedFile() {
    // Check if there's a file stored in the upload zone
    // We'll need to integrate with the upload zone's file selection mechanism
    const uploadZone = document.querySelector('#newProjectPopup .upload-zone');
    if (uploadZone && uploadZone.selectedFile) {
      return uploadZone.selectedFile;
    }
    return null;
  }

  // Store selected file in upload zone
  setSelectedFile(file) {
    const uploadZone = document.querySelector('#newProjectPopup .upload-zone');
    if (uploadZone) {
      uploadZone.selectedFile = file;
    }
  }

  // Upload photos to S3 using multipart upload
  async uploadPhotosToS3(file, formData) {
    try {
      // Start multipart upload
      const uploadInit = await this.startMultipartUpload(file.name, file.type, formData);
      
      // Upload file in chunks
      const uploadResult = await this.uploadFileInChunks(file, uploadInit);
      
      // Save submission metadata
      await this.saveSubmissionMetadata(uploadResult.objectKey, formData);
      
      // Extract S3 URL from upload result
      const s3Url = `s3://${uploadInit.bucketName}/${uploadResult.objectKey}`;
      
      return { s3Url, objectKey: uploadResult.objectKey };
      
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Start ML processing with uploaded S3 URL
  async startMLProcessing(s3Url, email) {
    try {
      const response = await fetch(this.API_ENDPOINTS.START_ML_PROCESSING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          s3Url: s3Url,
          email: email,
          pipelineStep: 'sfm' // Full pipeline by default
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      throw new Error(`ML processing failed: ${error.message}`);
    }
  }

  // Helper methods for upload process
  async startMultipartUpload(fileName, fileType, formData) {
    const response = await fetch(this.API_ENDPOINTS.START_UPLOAD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        fileType,
        ...formData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to start upload: ${response.status}`);
    }

    return await response.json();
  }

  async uploadFileInChunks(file, uploadInit) {
    const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);
    const parts = [];
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.CHUNK_SIZE;
      const end = Math.min(start + this.CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const partNumber = i + 1;
      
      // Get presigned URL for this chunk
      const urlResponse = await fetch(this.API_ENDPOINTS.GET_PRESIGNED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: uploadInit.uploadId,
          bucketName: uploadInit.bucketName,
          objectKey: uploadInit.objectKey,
          partNumber
        })
      });
      
      if (!urlResponse.ok) {
        throw new Error(`Failed to get upload URL for part ${partNumber}`);
      }
      
      const { url } = await urlResponse.json();
      
      // Upload chunk
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: chunk
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload part ${partNumber}`);
      }
      
      const etag = uploadResponse.headers.get('ETag');
      parts.push({ ETag: etag, PartNumber: partNumber });
      
      // Update progress
      const progress = (partNumber / totalChunks) * 100;
      this.updateUploadProgress(progress);
    }
    
    // Complete multipart upload
    const completeResponse = await fetch(this.API_ENDPOINTS.COMPLETE_UPLOAD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadId: uploadInit.uploadId,
        bucketName: uploadInit.bucketName,
        objectKey: uploadInit.objectKey,
        parts
      })
    });
    
    if (!completeResponse.ok) {
      throw new Error('Failed to complete upload');
    }
    
    return { objectKey: uploadInit.objectKey };
  }

  async saveSubmissionMetadata(objectKey, formData) {
    const response = await fetch(this.API_ENDPOINTS.SAVE_SUBMISSION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objectKey,
        ...formData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save submission metadata');
    }

    return await response.json();
  }

  // UI state management
  setUploadLoadingState(isLoading, text = 'Upload') {
    const uploadButton = document.querySelector('#newProjectPopup .upload-btn-with-icon');
    const uploadSection = document.querySelector('#newProjectPopup .accordion-section[data-section="upload"]');
    const headline = uploadSection?.querySelector('h3');
    
    if (isLoading) {
      if (uploadButton) {
        uploadButton.classList.add('loading');
        uploadButton.innerHTML = `<span class="upload-btn-icon"></span>${text}`;
      }
      
      if (headline) {
        headline.textContent = text;
      }
      
      // Start the visual progress if uploading
      if (text === 'Uploading...') {
        this.startUploadProgress();
      }
    } else {
      if (uploadButton) {
        uploadButton.classList.remove('loading');
        uploadButton.innerHTML = `<span class="upload-btn-icon"></span>Upload`;
      }
      
      if (headline) {
        headline.textContent = 'Property Upload';
      }
      
      // Complete the visual progress
      this.completeUploadProgress();
    }
  }

  // Start the upload progress animation
  startUploadProgress() {
    const progressContainer = document.querySelector('#newProjectPopup .upload-progress-container');
    const progressBar = document.querySelector('#newProjectPopup .upload-progress-bar');
    const progressText = document.querySelector('#newProjectPopup .upload-progress-text');
    const categoryOutline = document.querySelector('#newProjectPopup .category-outline.upload-button-only');
    const uploadButton = document.querySelector('#newProjectPopup .upload-btn-with-icon');
    const cancelButton = document.querySelector('#newProjectPopup .cancel-btn-with-icon');
    
    if (progressContainer && progressBar && progressText && categoryOutline && uploadButton && cancelButton) {
      startUploadProgress(progressContainer, progressBar, progressText, categoryOutline, uploadButton, cancelButton);
    }
  }

  // Complete the upload progress animation
  completeUploadProgress() {
    const progressContainer = document.querySelector('#newProjectPopup .upload-progress-container');
    const progressBar = document.querySelector('#newProjectPopup .upload-progress-bar');
    const progressText = document.querySelector('#newProjectPopup .upload-progress-text');
    const categoryOutline = document.querySelector('#newProjectPopup .category-outline.upload-button-only');
    const uploadButton = document.querySelector('#newProjectPopup .upload-btn-with-icon');
    const cancelButton = document.querySelector('#newProjectPopup .cancel-btn-with-icon');
    
    if (progressContainer && progressBar && progressText && categoryOutline && uploadButton && cancelButton) {
      completeUpload(progressContainer, progressBar, progressText, categoryOutline, uploadButton, cancelButton);
    }
  }

  updateUploadProgress(percentage) {
    const progressBar = document.querySelector('#newProjectPopup .upload-progress-bar');
    const progressText = document.querySelector('#newProjectPopup .upload-progress-text');
    
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(percentage)}%`;
      
      // Show progress elements
      const progressContainer = document.querySelector('#newProjectPopup .upload-progress-container');
      if (progressContainer) {
        progressContainer.classList.add('active');
      }
      
      progressText.classList.add('active');
    }
  }

  showUploadSuccess(jobId, executionArn) {
    const headline = document.querySelector('#newProjectPopup .accordion-section[data-section="upload"] h3');
    if (headline) {
      headline.textContent = 'Processing Started!';
    }
    
    // Show success message
    console.log(`✅ Upload and ML processing started successfully!`);
    console.log(`Job ID: ${jobId}`);
    console.log(`Execution ARN: ${executionArn}`);
    
    // You could add a success notification here
    alert(`Upload successful! ML processing started.\nJob ID: ${jobId}\nYou'll receive an email when processing is complete.`);
  }

  showUploadError(message) {
    console.error('❌ Upload error:', message);
    alert(`Upload failed: ${message}`);
  }

  // Helper method
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Initialize the popup photo upload integration
let projectPopupPhotoUpload = null;

// Initialize the popup flight path integration
let projectPopupFlightPath = null;

// Privacy Policy Modal functionality
function initializePrivacyPolicyModal() {
  // Add click event listener to privacy policy link
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('privacy-policy-link')) {
      e.preventDefault();
      openPrivacyPolicy();
    }
  });

  // Close modal when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.id === 'privacy-policy-modal') {
      closePrivacyPolicy();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePrivacyPolicy();
    }
  });
}

function openPrivacyPolicy() {
  const modal = document.getElementById('privacy-policy-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closePrivacyPolicy() {
  const modal = document.getElementById('privacy-policy-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Waitlist functionality
function initializeWaitlistMode() {
  if (typeof WAITLIST_MODE !== 'undefined' && WAITLIST_MODE) {
    // Show waitlist content, hide ALL development content
    const waitlistContent = document.getElementById('waitlist-content');
    const developmentContent = document.getElementById('development-content');
    const createDashboard = document.getElementById('create-dashboard');
    const createSteps1 = document.getElementById('create-steps1');
    const createSteps2 = document.getElementById('create-steps2');
    const createSteps3 = document.getElementById('create-steps3');
    const createMlProcessing = document.getElementById('create-ml-processing');
    const newProjectPopup = document.getElementById('newProjectPopup');
    const addPathPopup = document.getElementById('addPathPopup');
    const feedbackSection = document.querySelector('.feedback-section');
    
    if (waitlistContent) {
      waitlistContent.style.display = 'flex';
    }
    if (developmentContent) {
      developmentContent.style.display = 'none';
    }
    if (createDashboard) {
      createDashboard.style.display = 'none';
    }
    if (createSteps1) {
      createSteps1.style.display = 'none';
    }
    if (createSteps2) {
      createSteps2.style.display = 'none';
    }
    if (createSteps3) {
      createSteps3.style.display = 'none';
    }
    if (createMlProcessing) {
      createMlProcessing.style.display = 'none';
    }
    if (newProjectPopup) {
      newProjectPopup.style.display = 'none';
    }
    if (addPathPopup) {
      addPathPopup.style.display = 'none';
    }
    if (feedbackSection) {
      feedbackSection.style.display = 'none';
    }
  } else {
    // Show development content, hide waitlist content
    const waitlistContent = document.getElementById('waitlist-content');
    const developmentContent = document.getElementById('development-content');
    const createDashboard = document.getElementById('create-dashboard');
    const createSteps1 = document.getElementById('create-steps1');
    const createSteps2 = document.getElementById('create-steps2');
    const createSteps3 = document.getElementById('create-steps3');
    const createMlProcessing = document.getElementById('create-ml-processing');
    const newProjectPopup = document.getElementById('newProjectPopup');
    const addPathPopup = document.getElementById('addPathPopup');
    const feedbackSection = document.querySelector('.feedback-section');
    
    if (waitlistContent) {
      waitlistContent.style.display = 'none';
    }
    if (developmentContent) {
      developmentContent.style.display = 'block';
    }
    if (createDashboard) {
      createDashboard.style.display = 'block';
    }
    if (createSteps1) {
      createSteps1.style.display = 'block';
    }
    if (createSteps2) {
      createSteps2.style.display = 'block';
    }
    if (createSteps3) {
      createSteps3.style.display = 'block';
    }
    if (createMlProcessing) {
      createMlProcessing.style.display = 'block';
    }
    if (newProjectPopup) {
      newProjectPopup.style.display = 'block';
    }
    if (addPathPopup) {
      addPathPopup.style.display = 'block';
    }
    if (feedbackSection) {
      feedbackSection.style.display = 'flex';
    }
  }
}

function submitWaitlist(event) {
  event.preventDefault();
  
  const name = document.getElementById('waitlist-name').value;
  const email = document.getElementById('waitlist-email').value;
  const submitBtn = document.querySelector('.waitlist-submit-btn');
  const btnText = document.getElementById('waitlist-btn-text');
  const spinner = document.getElementById('waitlist-spinner');
  const form = document.querySelector('.waitlist-form');
  const success = document.getElementById('waitlist-success');
  
  // Show loading state
  btnText.textContent = 'Joining...';
  spinner.style.display = 'block';
  submitBtn.disabled = true;
  
  // Prepare the data for the API
  const waitlistData = {
    name: name,
    email: email
  };
  
  // Send to the API
  fetch(API_ENDPOINTS.WAITLIST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(waitlistData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      // Show error message
      alert(data.error);
      // Reset button state
      btnText.textContent = 'Join Waitlist';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    } else {
      // Show success state
      form.style.display = 'none';
      success.style.display = 'block';
      
      // Reset form
      document.getElementById('waitlist-name').value = '';
      document.getElementById('waitlist-email').value = '';
      
      // Reset button state
      btnText.textContent = 'Join Waitlist';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  })
  .catch(error => {
    console.error('Error submitting to waitlist:', error);
    alert('Failed to join waitlist. Please try again.');
    
    // Reset button state
    btnText.textContent = 'Join Waitlist';
    spinner.style.display = 'none';
    submitBtn.disabled = false;
  });
}

// Function to send email notification when someone joins the waitlist
function sendWaitlistNotification(name, email) {
  const subject = 'New Waitlist Signup - Spaceport AI';
  const body = `Someone just joined the Spaceport AI waitlist!

Name: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}

This person will be notified when Spaceport AI launches.`;

  // Open email client with pre-filled message
  window.open(`mailto:gabriel@spcprt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// Optional: Function to send waitlist data to your backend
function sendWaitlistToBackend(name, email) {
  // Replace with your actual backend endpoint
  fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      source: 'website'
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Waitlist submission successful:', data);
  })
  .catch(error => {
    console.error('Error submitting to waitlist:', error);
  });
}