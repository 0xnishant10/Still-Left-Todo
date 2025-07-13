const form = document.getElementById("loginForm");

let userData = {};

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from refreshing the page


  if(!document.getElementById("password")){

      userData.fullName = document.getElementById("fullName").value;
      userData.dob = document.getElementById("dob").value;
      
      form.innerHTML = `
      <h3 class="text-white pb-1.5 text-left mx-4">Enter a Password</h3>
      <input id="password" name="password" class="hover:bg-slate-300 hover:text-black mx-4 mb-6 text-slate-400 border border-slate-600 p-2 rounded-md" type="password" placeholder="Enter a password" />
      
      <button class="bg-gradient-to-r cursor-pointer from-indigo-800 to-purple-300 text-white mx-4 rounded-lg p-1.5 mb-6" type="submit">
      Login
      </button>
      `;
    }else{
        userData.password = document.getElementById("password").value;

        fetch("/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
        .then(res => res.text())
        .then(data => {
            console.log(data);
            document.getElementById("verify-text").innerHTML = "";
            form.innerHTML = `<p class="text-green-500 text-center pb-4">✅ User saved successfully!</p>`;
            console.log("Redirecting");
            window.location.href = "todo.html";
        })
        .catch(err => {
            console.log(err);
            document.getElementById("verify-text").innerHTML = "";
            form.innerHTML = `<p class="text-red-500 text-center pb-4" >❌ Error saving user</p>`;
        })
    }
});

