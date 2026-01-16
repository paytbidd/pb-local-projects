// DOM Elements
const toggleBtns = document.querySelectorAll('.toggle-btn');
const iterations = document.querySelectorAll('.iteration');

// State
let currentIteration = 1;

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
  });
});
