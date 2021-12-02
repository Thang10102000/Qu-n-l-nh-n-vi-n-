var listAccount = [];

$(function () {
    $("#Main_From_id2").submit(function () {
        var n_Email_id = $("#Email_id").val();
        var n_Username_id = $("#Username_id").val();
        var n_Password_id = $("#Password_id").val();
        var n_Re_Password = $("#Re_Password_id").val();
        var n_Fullname_id = $("#Fullname_id").val();
        var depid = "1";
        var posid = "1";

        if (
            !n_Fullname_id ||
            n_Fullname_id.length < 6 ||
            n_Fullname_id.length > 50
        ) {
            // show thông báo
            alert("Fullname name must be from 6 to 50 characters!");
            return false;
        }
        if (!n_Email_id || n_Email_id.length < 6 || n_Email_id.length > 50) {
            // show thông báo
            alert("Email name must be from 6 to 50 characters!");
            return false;
        }

        if (
            !n_Username_id ||
            n_Username_id.length < 6 ||
            n_Username_id.length > 50
        ) {
            // show thông báo
            alert("Username name must be from 6 to 50 characters!");
            return false;
        }

        if (n_Password_id != n_Re_Password) {
            alert("Mật khẩu không trùng khớp");
            return false;
        }

        $.ajax({
            url: "http://localhost:8080/api/v1/accounts/EmailExists/" + n_Email_id,
            type: "GET",
            contentType: "application/json",
            dataType: "json", // datatype return
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Basic " + btoa("Username1:123456")
                );
            },
            success: function (data, textStatus, xhr) {
                if (data) {
                    alert("Email đã tồn tại trên hệ thống");
                    return false;
                } else {
                    // Check Username đã có trên hệ thống hay chưa?
                    $.ajax({
                        url:
                            "http://localhost:8080/api/v1/accounts/UsernameExists/" +
                            n_Username_id,
                        type: "GET",
                        contentType: "application/json",
                        dataType: "json", // datatype return
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader(
                                "Authorization",
                                "Basic " + btoa("Username1:123456")
                            );
                        },
                        success: function (data, textStatus, xhr) {
                            if (data) {
                                alert("Username đã tồn tại trên hệ thống");
                                return false;
                            } else {
                                // tạo ra 1 account chứa dữ liệu
                                var account = {
                                    email: n_Email_id,
                                    username: n_Username_id,
                                    fullname: n_Fullname_id,
                                    departmentId: depid,
                                    positionId: posid,
                                    password: n_Password_id,
                                };

                                $.ajax({
                                    url: "http://localhost:8080/api/v1/accountsRegister/",
                                    type: "POST",
                                    data: JSON.stringify(account),
                                    contentType: "application/json; charset=UTF-8",
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader(
                                            "Authorization",
                                            "Basic " + btoa("Username1:123456")
                                        );
                                    },
                                    success: function (data, textStatus, xhr) {
                                        console.log(data);
                                        alert("Mời bạn xác thực Email để đang kí tài khoản");
                                        window.location.replace("login2.html");
                                    },
                                    error(jqXHR, textStatus, errorThrown) {
                                        alert("error loading data");
                                        console.log(jqXHR);
                                        console.log(textStatus);
                                        console.log(errorThrown);
                                    },
                                });
                            }
                        },
                        error(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown);
                        },
                    });
                }
            },
            error(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });

        return false;
    });
});

function gotoLoginForm() {
    window.location.replace("login2.html");
}