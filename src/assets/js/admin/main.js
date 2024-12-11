import CookieManager from "https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js";
window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }

  const logoutBtn = document.getElementById("navbar__logout__btn");
  logoutBtn.onclick = () => {
    const cookieManager = new CookieManager();
    cookieManager.remove("access_token");
    cookieManager.remove("refesh_token");
    cookieManager.remove("vaitro_id");
    window.location = "/";
  };
});
