/*


  if($("#email-error").length==0){
            $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
        }

    if($("#email-error-dne").length==0){
                $("#main").append(`<p id="email-error-dne" class="error">Invalid email or password.</p>`);
            }
*/

$("#footer").load("templates/footer.html")

$("#signup-btn").on("click", function (e) {
  e.preventDefault();
  const data = JSON.stringify({
    username: `${$("#username").val()}`,
    email: `${$("#email").val()}`,
    password: `${$("#password").val()}`
  });
  console.log(data);
  fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/writeUserData",{
    method:"POST",
    body: data,
    headers: {
      "Content-type": "application/json;charset=UTF-8"
    }
  })
  .then(res => res.text())
  .then(true_response => {
    if(true_response=="EAE"&&$("#email-exist-error").length==0){
      $("#main").append(`<p id="email-exist-error" class="error">This email is already in use. <a href="signin.html">Sign in</a>?</p>`);
    } else if(true_response=="IE"&&$("#email-error").length==0){
      $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
    } else if(true_response=="IU"&&$("#username-error").length==0){
      $("#main").append(`<p id="username-error" class="error">Please enter a valid username.</p>`);
    }
  })
})

$("#signin-btn").on("click", function (e) {
  e.preventDefault();
  const data = JSON.stringify({
    email: `${$("#email").val()}`,
    password: `${$("#password").val()}`
  });
  console.log(data);
  fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/validateUserData",{
    method:"POST",
    body: data,
    headers: {
      "Content-type": "application/json;charset=UTF-8"
    }
  })
  .then(res => res.text())
  .then(true_response => {
    if(true_response=="IEOP"&&$("#email-error-dne").length==0){
      $("#main").append(`<p id="email-error-dne" class="error">Invalid email or password.</p>`);
    }
  })
})