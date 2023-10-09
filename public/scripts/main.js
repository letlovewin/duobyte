/*
if($("#email-error").length==0){
        $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
      }

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
  .then(true_response => console.log(true_response))
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
  .then(true_response => console.log(true_response))
})