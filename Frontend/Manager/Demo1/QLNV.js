
var listAccount = []
var listDepartment = []
var listPosition = []
var currentPage = 1;
var size = 5;
var sortField = "id";
var isAsc = true;
var totalPages;
var admin = true;

$('#Cretate_Date_ID').attr('disabled', 'disabled')
$('#ID_ID').attr('disabled', 'disabled')

$(function () {
    // Hàm thực thi khi load đầy đủ các thành phần html

    showAvatar();
    getListEmployees();
    getListDepartment();
    getListPosition();
    $("#form1").hide();
    $('#reset_btn').click(function () {
        // Xử lý sự kiện cho nút reset, Sử dụng JQuery để lấy các giá trị các trường theo ID, sau đó Set về rỗng
        $('#ID_ID').val("")
        $('#Email_ID').val("")
        $('#Username_ID').val("")
        $('#Fullname_ID').val("")
        $('#Department_ID').val("")
        $('#Position_ID').val("")
        $('#Cretate_Date_ID').val("")
    })
    //   $('#Main_Form_ID').submit(function () {

    $('#Main_Form_ID').submit(function () {
        // Lấy các giá trị người dùng nhập vào
        var v_ID_ID = $('#ID_ID').val()
        var v_Email_ID = $('#Email_ID').val()
        var v_Username_ID = $('#Username_ID').val()
        var v_Fullname_ID = $('#Fullname_ID').val()
        var v_Department_ID = $('#Department_ID').val()
        var v_Position_ID = $('#Position_ID').val()
        // var v_Cretate_Date_ID = $('#Cretate_Date_ID').val()
        // Validate cho các giá trị nhập vào gôm: Email, Username, Fullnaem. Department, Possition
        if (!v_Email_ID || v_Email_ID.length < 6 || v_Email_ID.length > 50) {

            alert("Email name must be from 6 to 50 characters!");
            return false;
        }
        if (!v_Username_ID || v_Username_ID.length < 6 || v_Username_ID.length > 50) {

            alert("Username name must be from 6 to 50 characters!");
            return false;
        }
        if (!v_Fullname_ID || v_Fullname_ID.length < 6 || v_Fullname_ID.length > 50) {

            alert("Fullname name must be from 6 to 50 characters!");
            return false;
        }
        if (!v_Department_ID || v_Department_ID == '--Select a Department--') {

            alert("Pls choose Department!");
            return false;
        }
        if (!v_Position_ID || v_Position_ID == '--Select a Position--') {

            alert("Pls choose Possition!");
            return false;
        }

        // Lấy ra ID của Department khi người dùng lựa chọn phòng ban
        for (let index = 0; index < listDepartment.length; index++) {
            if (listDepartment[index].name == v_Department_ID) {
                var depID = listDepartment[index].id
            }
        }
        // Lấy ra ID của Possition khi người dùng lựa chọn Possition
        for (let index = 0; index < listPosition.length; index++) {
            if (listPosition[index].name == v_Position_ID) {
                var posID = listPosition[index].id
            }
        }
        // Check Email đã có trên hệ thống hay chưa?

        if (!isAdmin()) {
            alert("ADMIN mới sử dụng được chức năng này");
            return false;

        }

        $.ajax({
            url: "http://localhost:8080/api/v1/accounts/EmailExists/" + v_Email_ID,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json', // datatype return
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
            },
            success: function (data, textStatus, xhr) {
                if (data) {
                    alert("Email đã tồn tại trên hệ thống")
                    return false;
                } else {
                    // Check Username đã có trên hệ thống hay chưa?
                    $.ajax({
                        url: "http://localhost:8080/api/v1/accounts/UsernameExists/" + v_Username_ID,
                        type: 'GET',
                        contentType: "application/json",
                        dataType: 'json', // datatype return
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
                        },
                        success: function (data, textStatus, xhr) {
                            if (data) {
                                alert("Username đã tồn tại trên hệ thống")
                                return false;
                            } else {
                                // Add account tới MOCK API
                                var account = {
                                    'email': v_Email_ID,
                                    'username': v_Username_ID,
                                    'fullname': v_Fullname_ID,
                                    'departmentId': depID,
                                    'positionId': posID,

                                }

                                $.ajax({
                                    url: 'http://localhost:8080/api/v1/accounts/',
                                    type: 'POST',
                                    data: JSON.stringify(account), // body
                                    contentType: "application/json", // type of body (json, xml, text)
                                    // dataType: 'json', // datatype return
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
                                    },
                                    success: function (data, textStatus, xhr) {

                                        currentPage = totalPages;
                                        getListEmployees();
                                    },
                                    error(jqXHR, textStatus, errorThrown) {
                                        alert("Error when loading data");
                                        console.log(jqXHR);
                                        console.log(textStatus);
                                        console.log(errorThrown);
                                    }
                                });



                            }

                        },
                        error(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    });
                }






            },
            error(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });

        // Tạo 1 đối tượng account để lưu giữ thông tin nhận được, ở đây khi tạo đối tượng không cần lấy ID do khi tạo dữ liệu trên server ID sẽ được tự động Gen


        // $.post("http://localhost:8080/api/v1/accounts/", account,
        //     function(data, status) {
        //         // error
        //         if (status == "error") {
        //             alert("Error when loading data");
        //             return;
        //         }
        //         // success
        //         // Sau khi thêm mới 1 account thì thực hiện Set lại curentPage để chuyển tới trang cuối cùng hiển thị thông tin của bản ghi mới thêm
        //         currentPage = totalPages;
        //         // Hàm này để hiển thị thông tin account ở table   
        //         getListEmployees();
        //     });




        return false;
        // Sử dụng return false để không redirect tới 1 trang khác.
    })

})

function getAccountByID() {
    getListEmployees();
}

// Viết hàm showAccount()
function showAccount() {
    // Xóa hết kết quả đang hiển thị ở bảng kết quả
    $('#Result_TB').empty()
    // Lặp trong listAccount để in thông tin từng phần tử

    for (var index = 0; index < listAccount.length; index++) {
        $('#Result_TB').append(`
              <tr>
              <th>${listAccount[index].AccountID}</th>
              <th>${listAccount[index].Email}</th>
              <th>${listAccount[index].Username}</th>
              <th>${listAccount[index].FullName}</th>
              <th>${listAccount[index].Department}</th>
              <th>${listAccount[index].Position}</th>   
              <th>${listAccount[index].CreateDate}</th>
              <th><button class="btn btn-warning" onclick="editAccount(${index})">Edit</button></th>
              <th><button class="btn btn-warning" onclick="deleteAccount(${index})">Delete</button></th>
              </tr>
              `)
    }
}
// Viết hàm xóa account
function deleteAccount(Index) {

    if (!isAdmin()) {
        alert("ADMIN mới sử dụng được chức năng này");
        return false;

    }
    var v_del_ID = listAccount[Index].AccountID;
    var confirm_del = confirm('Bạn có chắc chắn muốn xóa Account này không')
    if (confirm_del) {
        // $.ajax({
        //     url: 'http://localhost:8080/api/v1/accounts/' + v_del_ID,
        //     type: 'DELETE',
        //     success: function(result) {
        //         // error
        //         if (result == undefined || result == null) {
        //             alert("Error when loading data");
        //             return;
        //         }

        //         // success
        //         resetPaging();
        //         getListEmployees();
        //     }
        // });

        $.ajax({
            url: 'http://localhost:8080/api/v1/accounts/' + v_del_ID,
            type: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
            },
            success: function (result) {
                // error
                if (result == undefined || result == null) {
                    alert("Error when loading data");
                    return;
                }
                // success
                resetPaging();
                getListEmployees();
            }
        });
    } else {
        return
    }
}
// Viết hàm để Edit các account
function editAccount(Index) {
    if (!isAdmin()) {
        alert("ADMIN mới sử dụng được chức năng này");
        return false;

    }
    // Lấy giá trị các trường ID, Fullname, Department, Possition Fill vào Form
    $('#ID_ID').val(listAccount[Index].AccountID)
    $('#Fullname_ID').val(listAccount[Index].FullName)
    $('#Department_ID').val(listAccount[Index].Department)
    $('#Position_ID').val(listAccount[Index].Position)
    // Disable các trường Email, Username, CreateDate khi nhấn vào nút Edit do không cho cập nhật các trường này
    $('#Email_ID').attr('disabled', 'disabled')
    $('#Username_ID').attr('disabled', 'disabled')
    $('#Cretate_Date_ID').attr('disabled', 'disabled')


    //  Xử lý sự kiện khi click vào nút Update 
    $('#update_btn').click(function () {
        var v_ID_ID = $('#ID_ID').val()
        var v_Fullname_ID = $('#Fullname_ID').val()
        var v_Fullname_ID = $('#Fullname_ID').val()
        var v_Department_ID = $('#Department_ID').val()
        var v_Position_ID = $('#Position_ID').val()
        // Lấy ra ID của Department khi người dùng lựa chọn phòng ban
        for (let index = 0; index < listDepartment.length; index++) {
            if (listDepartment[index].name == v_Department_ID) {
                var depID = listDepartment[index].id
            }
        }
        // Lấy ra ID của Possition khi người dùng lựa chọn Possition
        for (let index = 0; index < listPosition.length; index++) {
            if (listPosition[index].name == v_Position_ID) {
                var posID = listPosition[index].id
            }
        }
        // Ở đây chỉ cho người dùng update các trường, fullname, Department, Possition, các trường Username, Email trên thực tế sẽ để cố định.
        var account = {
            'fullname': v_Fullname_ID,
            'departmentId': depID,
            'positionId': posID,
        }
        // $.ajax({
        //     url: 'http://localhost:8080/api/v1/accounts/' + v_ID_ID,
        //     type: 'PUT',
        //     data: account,
        //     success: function(result) {
        //         // error
        //         if (result == undefined || result == null) {
        //             alert("Error when loading data");
        //             return;
        //         }
        //         getListEmployees();
        //     }
        // });

        // account["fullname"] = v_Fullname_ID;
        // account["departmentId"] = depID;
        // account["positionId"] = posID;

        // var myJSON = JSON.stringify(account);
        $.ajax({
            url: 'http://localhost:8080/api/v1/accounts/' + v_ID_ID,
            type: 'PUT',
            data: JSON.stringify(account), // body
            contentType: "application/json", // type of body (json, xml, text)
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
            },
            // dataType: 'json', // datatype return
            success: function (data, textStatus, xhr) {
                getListEmployees();
            },
            error(jqXHR, textStatus, errorThrown) {
                alert("Error when loading data");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    })
}

function getListDepartment() {
    // $.get("http://localhost:8080/api/v1/departments/", function (data, status) {
    //     // console.log("data nhan đưuọc ", data)
    //     //console.log("status:",status)

    //     listDepartment = [];
    //     // error
    //     if (status == "error") {
    //         // TODO
    //         alert("Error when loading data");
    //         return;
    //     }
    //     // success thì sẽ đổ dữ liệu vào ListDepartment và lấy dữ liệu trong List này fill vào phần thẻ Selecr để chọn Department, chú ý phần này phải để trong nội dung xử lý của Ajax
    //     data.forEach(function (item) {
    //         var department = {
    //             'id': item.id,
    //             'name': item.name,
    //         }
    //         listDepartment.push(department)
    //     });

    //     // show data
    //     for (let index = 0; index < listDepartment.length; index++) {
    //         $('#Department_ID').append(`
    //     <option>${listDepartment[index].name}</option>
    //       `)

    //     }
    // });
    $.ajax({
        url: "http://localhost:8080/api/v1/departments/",
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // Đoạn lệnh này copy từ phần gọi Ajax theo cách không xác thực commemt bên trên xuống.
            data.forEach(function (item) {
                var department = {
                    'id': item.id,
                    'name': item.name,
                }
                listDepartment.push(department)
            });
            for (let index = 0; index < listDepartment.length; index++) {
                $('#Department_ID').append(`
            <option>${listDepartment[index].name}</option>
              `)

            }
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getListPosition() {

    // call API from server
    // $.get("http://localhost:8080/api/v1/positions/", function (data, status) {
    //     // reset list employees
    //     listPossition = [];
    //     // error
    //     if (status == "error") {
    //         // TODO
    //         alert("Error when loading data");
    //         return;
    //     }
    //     // success thì sẽ đổ dữ liệu vào listPossition và lấy dữ liệu trong List này fill vào phần thẻ Selecr để chọn Possition, chú ý phần này phải để trong nội dung xử lý của Ajax
    //     data.forEach(function (item) {
    //         var possition = {
    //             'id': item.id,
    //             'name': item.name,
    //         }
    //         listPossition.push(possition)
    //     });
    //     for (let index = 0; index < listPossition.length; index++) {
    //         $('#Position_ID').append(`
    // <option>${listPossition[index].name}</option>
    //   `)

    //     }
    // });
    $.ajax({
        url: "http://localhost:8080/api/v1/positions/",
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // Đoạn lệnh này copy từ phần gọi Ajax theo cách không xac thực commemt bên trên xuống.
            data.forEach(function (item) {
                var position = {
                    'id': item.id,
                    'name': item.name,
                }
                listPosition.push(position)
            });
            for (let index = 0; index < listPosition.length; index++) {
                $('#Position_ID').append(`
            <option>${listPosition[index].name}</option>
              `)

            }
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });


}
// hàm lấy dữ lieuej account
function getListEmployees() {
    // call API from server
    // $.ajax({
    //     url: url,
    //     type: "GET",
    //     contentType: "application/json; charset=UTF-8",
    //     dataType: "json",
    //     success: function (data, status) {
    //         listAccount = [];

    //         if (status == "error") {
    //             // TODO
    //             alert("Error when loading data");
    //             return;
    //         }
    //         // success
    //         parseData(data);
    //         showAccount();
    //         totalPages = data.totalPages;     
    // Sau khi hiển thị dữ liệu sẽ Show thêm các nút để thực hiện phân trang, tính các nút này dựa trên API totalPages được trả ra
    //         pagingTable(totalPages);

    //     }
    // });
    var url = "http://localhost:8080/api/v1/accounts/";
    url += "?page=" + currentPage + "&size=" + size;
    url += "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");
    var search = $('#Search_ID').val();
    if (search) {
        url += "&search=" + search;
    }
    $('#cancel').click(function () {
        // Xử lý sự kiện cho nút reset, Sử dụng JQuery để lấy các giá trị các trường theo ID, sau đó Set về rỗng
        $('#Search_ID').val("")

    })
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // reset list employees
            listAccount = [];
            parseData(data);
            showAccount();
            totalPages = data.totalPages;
            // Sau khi hiển thị dữ liệu sẽ Show thêm các nút để thực hiện phân trang, tính các nút này dựa trên API totalPages được trả ra
            pagingTable(totalPages);
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}

// lưu dữ liệu account 
function parseData(data) {
    // employees = data;
    data.content.forEach(function (item) {
        var account = {
            AccountID: item.id,
            Email: item.email,
            Username: item.username,
            FullName: item.fullname,
            Department: item.department,
            Position: item.position,
            CreateDate: item.createDate,
        }
        listAccount.push(account)
    });
}
function pagingTable(pageAmount) {
    var pagingStr = "";
    // Hàm Gen nút Previous
    if (pageAmount > 1 && currentPage > 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="prevPaging()">Previous</a>' +
            '</li>';
    }
    // Hàm Gen nút số trang 1,2,3 ...
    for (i = 0; i < pageAmount; i++) {
        pagingStr +=
            '<li class="page-item ' + (currentPage == i + 1 ? "active" : "") + '">' +
            '<a class="page-link" onClick="changePage(' + (i + 1) + ')">' + (i + 1) + '</a>' +
            '</li>';
    }
    // Hàm Gen nút Next
    if (pageAmount > 1 && currentPage < pageAmount) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="nextPaging()">Next</a>' +
            '</li>';
    }
    $('#pagination').empty();
    $('#pagination').append(pagingStr);

}
// Hàm thực hiện khi nhấn vào các nút phân trang 1, 2, 3
function changePage(page) {
    if (page == currentPage) {
        return;
    }
    currentPage = page;
    getListEmployees();
}
// Hàm xử lý khi nhấn nút Previous
function prevPaging() {
    changePage(currentPage - 1);
}
// Hàm xử lý khi nhấn nút next
function nextPaging() {
    changePage(currentPage + 1);
}
function resetPaging() {
    currentPage = 1;
    size = 5;
}
function changeSort(field) {
    if (field == sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    getListEmployees();
}

function loginSuccess() {
    var username = $("#Email_Login_id").val();
    var password = $("#Password_Login_id").val();
    // Call API
    $.ajax({
        url: "http://localhost:8080/api/v1/login",
        type: "GET",
        contentType: "application/json",
        dataType: "json", // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Basic " + btoa(username + ":" + password)
            );
        },
        success: function (data, textStatus, xhr) {
            // if (data.status == "NOT_ACTIVE") {
            //     alert("Bạn hãy Active tài khoản trước khi đăng nhập hệ thống.");
            //     return false;
            // }

            if (data.status === "ACTIVE") {
                changrRole(true);
                alert("Bạn đăng nhập với tư cách là ADMIN hệ thống." + admin);
                //localStorage.setItem("isAdmin", true)

                // console.log("admin", admin);
                // console.log(admin);
                // return false;

            }

            else if (data.status === "NOT_ACTIVE") {
                // admin = false;
                alert("Bạn đăng nhập với tư cách là USER hệ thống.");
                //localStorage.setItem("isAdmin", false)
                changrRole(false);
                // console.log("admin", admin);

            }
            localStorage.setItem("ID", data.id);
            localStorage.setItem("FULL_NAME", data.fullName);
            localStorage.setItem("USERNAME", username);
            localStorage.setItem("PASSWORD", password);
            window.location.replace("Manager.html");
            // save data to storage

        },
        error(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                alert("Kiểm tra lại thông tin!!");
            } else {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        },
    });
}

function changrRole(role) {
    localStorage.setItem("isAdmin", role)
}

function isAdmin() {
    if (!localStorage.getItem("isAdmin")) {
        return false;
    }

    return (localStorage.getItem("isAdmin") == "true")
}

function CancelLogin() {

    var confirm_del = confirm('Bạn có muốn Đăng xuất không')
    if (confirm_del) {
        localStorage.removeItem("ID");
        localStorage.removeItem("USERNAME");
        localStorage.removeItem("FULL_NAME");
        localStorage.removeItem("PASSWORD");
        localStorage.removeItem("isAdmin");

        window.location.replace("login.html");
    }

}

function CancelEmployee() {
    var url = "http://localhost:8080/api/v1/accounts/";
    url += "?page=" + currentPage + "&size=" + size;
    url += "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // reset list employees
            listAccount = [];
            parseData(data);
            showAccount();
            totalPages = data.totalPages;
            // Sau khi hiển thị dữ liệu sẽ Show thêm các nút để thực hiện phân trang, tính các nút này dựa trên API totalPages được trả ra
            pagingTable(totalPages);
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function showAvatar() {
    // Get ImgName
    var url = "http://localhost:8080/api/v1/files/image/";
    url += localStorage.getItem("ID"); // Gửi kèm id của User đăng nhập cho Backend
    $.ajax({
        url: url,
        type: 'GET',
        // Kiểu dữ liệu trả về là String nên khi chuyển sang bên Frontend sẽ gọi là text.html
        contentType: "text/html", // Đổi kiểu dữ liệu text cho phù hợp với kiểu trả về là tên ảnh trong Backend
        dataType: 'html', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // Đoạn lệnh này copy từ phần gọi Ajax theo cách không xác thực commemt bên trên xuống.
            // Show Avatar, thêm thể img vào thẻ div tương ứng trong html
            $('.imgAvatar').append(`
            <img src="Upload_IMG/${data}" alt="No Image" style="vertical-align: middle; width: 200px; height: 200px; border-radius: 50%;">`)
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}



$('#btn_changeAvatar').click(function () {
    // Test sự kiện onclick
    console.log('btn_changeAvatar clicked!')
    // Tạo đối tượng Form Data để lưu thông tin gửi đi 
    var myform = $('#form_avatar');
    var fomrData = new FormData(myform[0]);
    // Set file input vào Form data trước khi gửi đi
    fomrData.append('image', $('#files')[0].files[0]);
    // Set id của User đăng nhập vào Form data trước khi gửi đi
    var id = localStorage.getItem("ID")
    fomrData.append('id', id);

    // fomrData.append('id', '4');

    $.ajax({
        url: 'http://localhost:8080/api/v1/files/image',
        type: 'POST',
        data: fomrData, // body
        processData: false,
        contentType: false, // Không để kiểu Content do đang gửi dữ liệu Formdata
        // dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            showAvatar() // Sau khi thay đổi avatar thành công gọi lại hàm này để show lại ảnh.
        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Error when loading data");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
})


function ResentEmailActive() {
    $("#form1").toggle();
}

function gotoRegisterForm() {
    window.location.replace("./Demo2/register2.html");
}