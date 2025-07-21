const token = localStorage.getItem("token");

if (!token) {
  // No token? Redirect to login.
  window.location.href = "login.html";
}

// Fetch user info from protected route
fetch("/protected", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => {
    if (!res.ok) {
      throw new Error("Unauthorized");
    }
    return res.text(); // or use res.json() if server sends JSON
  })
  .then((data) => {
    // If your backend sends: `Hello, <name>. You are authenticated!`
    const nameMatch = data.match(/Hello,\s(.+)\./);
    const userName = nameMatch ? nameMatch[1] : "User";

    document.getElementById("user-name").textContent = userName;
  })
  .catch((err) => {
    console.error(err);
    window.location.href = "login.html";
  });

document.getElementById("logout-btn").addEventListener("click", function () {
  // Remove the token from localStorage
  localStorage.removeItem("token");

  // Redirect to login page
  window.location.href = "login.html";
});