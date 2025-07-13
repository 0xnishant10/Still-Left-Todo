const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({fullName, password})
    });

    const msg = document.getElementById("message");

    if(res.ok){
      const data = await res.json();
      console.log("Received token:", data.token);
      localStorage.setItem("token", data.token); // 🧠 Save the token
      msg.textContent = "✅ Login successful!";
      window.location.href = "todo.html";
      msg.classList.add("text-green-500");
    }else{
        msg.textContent = "❌ Invalid credentials.";
        msg.classList.add("text-red-500");
    }
})