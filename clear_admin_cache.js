// CLEAR ADMIN SESSION CACHE
// Run this in your browser console on the admin page

// Clear the session storage cache
sessionStorage.removeItem('ee_admin_check');

// Force a page refresh
window.location.reload();

// OR if you want to be more thorough:
// localStorage.clear();
// sessionStorage.clear();
// window.location.reload();
