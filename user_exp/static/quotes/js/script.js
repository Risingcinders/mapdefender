// $(document).ready(function () {
//     console.log("testing");
//     console.log($)
//     const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
//     console.log(csrftoken);   
//     function csrfSafeMethod(method) {
//         // these HTTP methods do not require CSRF protection
//         return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
//     }
//     $.ajaxSetup({
//         beforeSend: function(xhr, settings) {
//             if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
//                 xhr.setRequestHeader("X-CSRFToken", csrftoken);
//             }
//         }
//     });
//     $("#first_name").keyup(function (a) {
//         a.preventDefault();
//         var data = $("#register").serialize(); // capture all the data in the form in the variable data
//         // data.csrfmiddlewaretoken = csrftoken;
//         console.log(data);
//         $.post("/first_name", data, function (res) {
//             console.log("response returned.");
//         });
//         $.ajax({
//             method: "POST", // we are using a post request here, but this could also be done with a get
//             url: "/first_name",
//             data: data,
//         }).done(function (res) {
//             $("#first_name_val").html(res); // manipulate the dom when the response comes back
//         });
//     });
// });
