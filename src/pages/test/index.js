// Function to start test and show section choices
function startTest(mode) {
  // Store selected mode in localStorage
  localStorage.setItem('testMode', mode);
  
  // Get section choice element
  const sectionChoice = document.getElementById('sectionChoice');
  
  if (sectionChoice) {
    // Hide any existing warning
    const warningMessage = document.getElementById('warningMessage');
    if (warningMessage) {
      warningMessage.style.display = 'none';
    }
    
    // Show section choices with smooth animation
    sectionChoice.classList.add('show');
    
    // Scroll to section choices after animation
    setTimeout(() => {
      sectionChoice.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }, 300);
  }
  
  return false;
}

// Function to close warning message
function closeWarning() {
  const warningMessage = document.getElementById('warningMessage');
  if (warningMessage) {
    warningMessage.style.display = 'none';
  }
}

// Function to check mode before starting test section
function checkModeBeforeStart(section) {
  const selectedMode = localStorage.getItem('testMode');
  
  if (!selectedMode) {
    // Show warning message
    const warningMessage = document.getElementById('warningMessage');
    if (warningMessage) {
      warningMessage.style.display = 'block';
      
      // Scroll to warning message
      setTimeout(() => {
        warningMessage.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }, 100);
    }
    
    return false;
  }
  
  // If mode is selected, proceed to the test
  localStorage.setItem('testSection', section);
  
  // Redirect to appropriate test page
  const testPages = {
    'listening': 'soal-listening.html',
    'structure': 'soal-structure.html', 
    'reading': 'soal-reading.html',
    'full': 'soal-full.html'
  };
  
  if (testPages[section]) {
    window.location.href = testPages[section];
  }
  
  return true;
}

