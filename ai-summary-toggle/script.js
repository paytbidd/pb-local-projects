// DOM Elements
const toggleBtns = document.querySelectorAll('.toggle-btn');
const iterations = document.querySelectorAll('.iteration');
const expandControl = document.getElementById('expand-control');
const expandToggleBtn = document.getElementById('expand-toggle-btn');
const expandToggleText = document.getElementById('expand-toggle-text');
const summaryExpandable = document.getElementById('summary-expandable-2');
const expandBtn = document.querySelector('.expand-btn');

// State
let currentIteration = 1;
let isSummaryExpanded = false;

// Toggle between iterations
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const iteration = parseInt(btn.dataset.iteration);
    
    if (iteration === currentIteration) return;
    
    currentIteration = iteration;
    
    // Update button states
    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update iteration visibility
    iterations.forEach(iter => {
      iter.classList.remove('active');
      if (parseInt(iter.dataset.iteration) === iteration) {
        iter.classList.add('active');
      }
    });
    
    // Show/hide expand control based on iteration
    if (iteration === 2) {
      expandControl.classList.add('visible');
    } else {
      expandControl.classList.remove('visible');
    }
  });
});

// Expand/Collapse Summary in Iteration 2
function toggleSummary() {
  isSummaryExpanded = !isSummaryExpanded;
  
  if (isSummaryExpanded) {
    summaryExpandable.classList.add('expanded');
    expandToggleBtn.classList.add('expanded');
    expandToggleText.textContent = 'Collapse Summary';
    expandBtn.classList.add('expanded');
  } else {
    summaryExpandable.classList.remove('expanded');
    expandToggleBtn.classList.remove('expanded');
    expandToggleText.textContent = 'Expand Summary';
    expandBtn.classList.remove('expanded');
  }
}

// Event listeners for expand buttons
expandToggleBtn.addEventListener('click', toggleSummary);

expandBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleSummary();
});

// Make the AI chat attachment clickable for expansion in iteration 2
const aiAttachment2 = document.getElementById('ai-attachment-2');
aiAttachment2.addEventListener('click', (e) => {
  // Don't toggle if clicking the chevron button directly (it has its own handler)
  if (!e.target.closest('.expand-btn')) {
    toggleSummary();
  }
});

// Add hover effect cursor for iteration 2 AI attachment
aiAttachment2.style.cursor = 'pointer';
