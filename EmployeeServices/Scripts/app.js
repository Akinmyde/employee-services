/// <reference path="jquery-1.10.2.js" />

function Register() {
    $(document).ready(function () {

        //Close the bootstrap alert
        $('#linkClose').click(function () {
            $('#divError').hide('fade');
        });
        
        // Save the new user details
        $('#btnRegister').click(function () {
            var email = $('#txtEmail').val();
            var password = $('#txtPassword').val();
            var confirmPassword = $('#txtConfirmPassword').val();

            if (email == "" && password == "" && confirmPassword == "") {
                $('#divErrorText').text('Please fill Email, Password and ConfirmPassword Field');
                $('#divError').show('fade');
            } else if (email == "" && password == ""){
                $('#divErrorText').text('Please fill Email and Password Field');
                $('#divError').show('fade');
            } else if (email == "" && confirmPassword == "") {
                $('#divErrorText').text('Please fill Email and ConfirmPassword Field');
                $('#divError').show('fade');
            } else if (password == "" && confirmPassword == "") {
                $('#divErrorText').text('Please fill Password and ConfirmPassword Field');
                $('#divError').show('fade');
            } else if (email == "") {
                $('#divErrorText').text('Please fill Email Field');
                $('#divError').show('fade');
            }else if(password == ""){
                $('#divErrorText').text('Please fill Password Field');
                $('#divError').show('fade');
            } else if (confirmPassword == "") {
                $('#divErrorText').text('Please fill ConfirmPassword Field');
                $('#divError').show('fade');
            } else {
                $.ajax({
                    url: '/api/account/register',
                    method: 'POST',
                    data: {
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword
                    },
                    success: function () {
                        $('#successModal').modal('show');
                    },  
                    error: function (jqXHR) {
                        $('#divErrorText').text(jqXHR.responseText);
                        //$('#divErrorText').text(email + " Already taken. Please choose another email" );
                        $('#divError').show('fade');
                    }
                });
            }
        });
    });
}

function Login() {
    $(document).ready(function () {
        
       $('#linkClose').click(function () {
            $('#divError').hide('fade');
       });

      $('#btnLogin').click(function () {
            var username = $('#txtUsername').val();
            var password = $('#txtPassword').val();
            if (username == "" && password == "") {
                $('#divErrorText').text('Enter Username and Password');
                $('#divError').show('fade');
            } else if (password == "") {
                $('#divErrorText').text('Enter Password');
                $('#divError').show('fade');
            } else if (username == "") {
                $('#divErrorText').text('Enter Username');
                $('#divError').show('fade');
            } else {
                $.ajax({
                    // Post username, password & the grant type to /token
                    url: '/token',
                    method: 'POST',
                    contentType: 'application/json',
                    data: {
                        username: username,
                        password: password,
                        grant_type: 'password'
                    },
                    // When the request completes successfully, save the
                    // access token in the browser session storage and
                    // redirect the user to Data.html page. We do not have
                    // this page yet. So please add it to the
                    // EmployeeService project before running it
                    success: function (response) {
                        localStorage.setItem("accessToken", response.access_token);
                        localStorage.setItem("userName", response.userName);
                        window.location.href = "Data.html";


                    },
                    // Display errors if any in the Bootstrap alert <div>

                    error: function (jqXHR) {
                        // $('#divErrorText').text(jqXHR.responseText);
                        $('#divErrorText').text('Invalid Username or Password');
                        $('#divError').show('fade');
                    }
                });
            }
         });
    });
}

function Data() {
    $(document).ready(function () {
        $('#spanUsername').text('Hello ' + localStorage.getItem('userName'));
        if (localStorage.getItem('userName') == null) {
            $('#dataBody').hide();
            window.location.href = "Login.html";
        }

        $('#btnLogoff').click(function () {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userName');
            window.location.href = "Login.html";
        });

        $('#linkClose').click(function () {
            $('#divError').hide('fade');
        });

        $('#errorModal').on('hidden.bs.modal', function () {
            window.location.href = "Login.html";
        });

        $('#btnLoadEmployees').click(function () {
            $.ajax({
                url: '/api/employees',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '
                        + localStorage.getItem("accessToken")
                },
                success: function (data) {
                    $('#divData').removeClass('hidden');
                    $('#tblBody').empty();
                    $.each(data, function (index, value) {
                        var row = $('<tr><td>' + value.ID + '</td><td>'
                            + value.FirstName + '</td><td>'
                            + value.LastName + '</td><td>'
                            + value.Gender + '</td><td>'
                            + value.Salary + '</td></tr>');
                        $('#tblData').append(row);
                    });
                },
                error: function (jQXHR) {
                    // If status code is 401, access token expired, so
                    // redirect the user to the login page
                    if (jQXHR.status == "401") {
                        $('#errorModal').modal('show');
                    }
                    else {
                        $('#divErrorText').text(jqXHR.responseText);
                        $('#divError').show('fade');
                    }
                }
            });
        });
    });
}

function GoogleLogin(){
    $(document).ready(function () {
        getAccessToken();
         $('#btnGoogleLogin').click(function () {
           //console.log("Social Login");
             window.location.href = "/api/Account/ExternalLogin?provider=Google&response_type=token&client_id=self&redirect_uri=https%3A%2F%2Flocalhost%3A44300%2FLogin.html&state=6jPhlxUeYw1h0BizUibKiaNw-vN4eYcD_nwSdUFohqA1";
       });
    });
}

function FacebookLogin() {
    $(document).ready(function () {
        getAccessToken();
       $('#btnFacebookLogin').click(function () {
            window.location.href = "/api/Account/ExternalLogin?provider=Facebook&response_type=token&client_id=self&redirect_uri=https%3A%2F%2Flocalhost%3A44300%2FLogin.html&state=6jPhlxUeYw1h0BizUibKiaNw-vN4eYcD_nwSdUFohqA1";
        });
    });
}

function getAccessToken(){
    if (location.hash) {
        if (location.hash.split('access_token=')) {
            var accessToken = location.hash.split('access_token=')[1].split('&')[0];
            if (accessToken) {
                isUserRegistered(accessToken);
            }
        }
    }
}

function isUserRegistered(accessToken) {
    $.ajax({
        url: "/api/Account/UserInfo",
        method: "GET",
        headers: {
            'content-type': 'application/JSON',
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            if (response.HasRegistered) {
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('userName', response.Email);
                window.location.href = "Data.html";
            }
            else {
                signupExternalUser(accessToken, response.LoginProvider);
            }
        }
    });
}
function signupExternalUser(accessToken, provider) {
    $.ajax({
        url: "/api/Account/RegisterExternal",
        method: "POST",
        headers: {
            'content-type': 'application/JSON',
            'Authorization': 'Bearer ' + accessToken
        },
        success: function () {
            window.location.href = "/api/Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=self&redirect_uri=https%3A%2F%2Flocalhost%3A44300%2FLogin.html&state=6jPhlxUeYw1h0BizUibKiaNw-vN4eYcD_nwSdUFohqA1";
        }
    })
}