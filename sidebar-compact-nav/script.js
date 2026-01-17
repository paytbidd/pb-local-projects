// State
let isCollapsed = false;
let hasSelectedItem = false;
let selectedItemId = null;
let currentNav = 'feed';
const COLLAPSE_THRESHOLD = 80;

// Elements
const scrollContainer = document.getElementById('sidebar-scroll');
const mainNavWrapper = document.getElementById('main-nav-wrapper');
const navExpanded = document.getElementById('nav-expanded');
const navCollapsed = document.getElementById('nav-collapsed');
const jumpToWrapper = document.getElementById('jump-to-wrapper');

const dropdownTrigger = document.getElementById('nav-dropdown-trigger');
const dropdownMenu = document.getElementById('nav-dropdown-menu');
const jumpToTrigger = document.getElementById('jump-to-trigger');
const jumpToMenu = document.getElementById('jump-to-menu');

const statusText = document.getElementById('status-text');

// Nav icons map for updating trigger
const navIcons = {
  ai: `<img src="../shared-assets/icon-sparkle-filled.png" alt="" class="nav-icon-img">`,
  feed: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 6H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.5 10H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.5 14H10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  groups: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="14" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="14" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>`,
  dms: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 9.5C17 13.09 13.866 16 10 16C8.834 16 7.732 15.752 6.75 15.307L3 16.5L4.378 13.244C3.512 12.178 3 10.893 3 9.5C3 5.91 6.134 3 10 3C13.866 3 17 5.91 17 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  activity: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C10 2 10 2 10 2C6.5 2 4 5 4 8V12L2.5 14.5H17.5L16 12V8C16 5 13.5 2 10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 15C8 16.1046 8.89543 17 10 17C11.1046 17 12 16.1046 12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  apps: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 10V18" stroke="currentColor" stroke-width="1.5"/><path d="M10 10L17 6" stroke="currentColor" stroke-width="1.5"/><path d="M10 10L3 6" stroke="currentColor" stroke-width="1.5"/></svg>`
};

const navLabels = {
  ai: 'AI',
  feed: 'Feed',
  groups: 'Groups',
  dms: 'DMs',
  activity: 'Activity',
  apps: 'Apps'
};

// Update nav state display
function updateNavDisplay() {
  const scrollTop = scrollContainer.scrollTop;
  const shouldCollapse = scrollTop > COLLAPSE_THRESHOLD;
  
  if (shouldCollapse !== isCollapsed) {
    isCollapsed = shouldCollapse;
  }
  
  // Determine which nav state to show
  if (!isCollapsed) {
    // At top - show expanded nav
    navExpanded.classList.remove('hidden');
    navCollapsed.classList.add('hidden');
    jumpToWrapper.classList.add('hidden');
    closeAllMenus();
  } else if (hasSelectedItem) {
    // Scrolled + item selected - show "Jump to..."
    navExpanded.classList.add('hidden');
    navCollapsed.classList.add('hidden');
    jumpToWrapper.classList.remove('hidden');
  } else {
    // Scrolled + no item selected - show collapsed nav
    navExpanded.classList.add('hidden');
    navCollapsed.classList.remove('hidden');
    jumpToWrapper.classList.add('hidden');
  }
  
  updateStatus();
}

// Update status bar
function updateStatus() {
  if (!isCollapsed) {
    statusText.textContent = hasSelectedItem 
      ? `Viewing item • Scroll down to see "Jump to..."` 
      : 'Scroll down to see nav collapse';
  } else if (hasSelectedItem) {
    statusText.textContent = 'Use "Jump to..." to navigate away';
  } else {
    statusText.textContent = `On ${navLabels[currentNav]} • Click dropdown to switch`;
  }
}

// Close all dropdown menus
function closeAllMenus() {
  dropdownMenu.classList.add('hidden');
  dropdownTrigger.classList.remove('open');
  jumpToMenu.classList.add('hidden');
  jumpToTrigger.classList.remove('open');
}

// Update nav selection
function selectNav(navKey) {
  currentNav = navKey;
  
  // Update expanded nav - clear all active states when an item is selected
  document.querySelectorAll('#nav-expanded .nav-item').forEach(item => {
    item.classList.toggle('active', !hasSelectedItem && item.dataset.nav === navKey);
  });
  
  // Update dropdown items
  document.querySelectorAll('#nav-dropdown-menu .nav-dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === navKey);
  });
  
  // Update jump-to items
  document.querySelectorAll('#jump-to-menu .jump-to-item').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === navKey);
  });
  
  // Update collapsed trigger
  dropdownTrigger.querySelector('.nav-icon, .nav-icon-img').outerHTML = navIcons[navKey];
  dropdownTrigger.querySelector('.current-nav-label').textContent = navLabels[navKey];
  
  // Deselect any selected item when switching nav
  if (hasSelectedItem) {
    deselectItem();
  }
  
  closeAllMenus();
  updateStatus();
}

// Select an item (thread, group, DM, etc)
function selectItem(itemId) {
  // Deselect previous
  document.querySelectorAll('.list-item.selected').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Select new
  const item = document.querySelector(`[data-id="${itemId}"]`);
  if (item) {
    item.classList.add('selected');
    hasSelectedItem = true;
    selectedItemId = itemId;
    
    // Clear nav active states - only one selection at a time
    document.querySelectorAll('#nav-expanded .nav-item').forEach(navItem => {
      navItem.classList.remove('active');
    });
    
    updateNavDisplay();
  }
}

// Deselect item
function deselectItem() {
  document.querySelectorAll('.list-item.selected').forEach(item => {
    item.classList.remove('selected');
  });
  hasSelectedItem = false;
  selectedItemId = null;
  
  // Restore nav active state
  document.querySelectorAll('#nav-expanded .nav-item').forEach(navItem => {
    navItem.classList.toggle('active', navItem.dataset.nav === currentNav);
  });
  
  updateNavDisplay();
}

// Event Listeners

// Scroll handler
scrollContainer.addEventListener('scroll', updateNavDisplay);

// Collapsed dropdown trigger
dropdownTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = !dropdownMenu.classList.contains('hidden');
  closeAllMenus();
  if (!isOpen) {
    dropdownMenu.classList.remove('hidden');
    dropdownTrigger.classList.add('open');
  }
});

// Jump to trigger
jumpToTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = !jumpToMenu.classList.contains('hidden');
  closeAllMenus();
  if (!isOpen) {
    jumpToMenu.classList.remove('hidden');
    jumpToTrigger.classList.add('open');
  }
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target) &&
      !jumpToTrigger.contains(e.target) && !jumpToMenu.contains(e.target)) {
    closeAllMenus();
  }
});

// Nav item clicks (expanded)
document.querySelectorAll('#nav-expanded .nav-item').forEach(item => {
  item.addEventListener('click', () => selectNav(item.dataset.nav));
});

// Dropdown item clicks
document.querySelectorAll('#nav-dropdown-menu .nav-dropdown-item').forEach(item => {
  item.addEventListener('click', () => selectNav(item.dataset.nav));
});

// Jump to item clicks
document.querySelectorAll('#jump-to-menu .jump-to-item').forEach(item => {
  item.addEventListener('click', () => {
    selectNav(item.dataset.nav);
    // Also deselect the item since we're jumping away
    deselectItem();
  });
});

// Selectable list items
document.querySelectorAll('.list-item.selectable').forEach(item => {
  item.addEventListener('click', () => {
    const itemId = item.dataset.id;
    if (selectedItemId === itemId) {
      // Clicking same item deselects
      deselectItem();
    } else {
      selectItem(itemId);
    }
  });
});

// Initialize
updateNavDisplay();
