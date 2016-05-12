var express = require("express");
var app = express();
var port = process.env.port || 1337;
var connection = "Server = vmsesqldev1041; Database = EmployeeManagement; Integrated Security = True";
var edge = require('edge');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const crypto = require('crypto');
const secret = 'abcdefg';
qs = require('querystring');


app.use(function (req, res, next) {
    
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE,PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Origin, X-Requested-With, Accept');
    next();
})

//app.use(bodyParser.urlencoded({ extended: false }));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false})); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

app.use(cookieParser());
app.use(session({ secret: '1234567890QWERTY' }));
//-----------To get user login info----------------//
var getLoginData = edge.func('sql', {
    connectionString: connection,
    source: "exec login_data"
}); 

var getUserLoginData = edge.func('sql', {
    connectionString: connection,
    source: "exec get_userLoginData",
    parameter: "@emp_id"
});

var updateUserLoginData = edge.func('sql', {
    connectionString: connection,
    source: "exec update_userLoginData",
    parameter: "@emp_id",
    parameter: "@password"
});


var getTree = edge.func('sql', {
    connectionString: connection,
    source: 'exec getTreeData'
});

var getEmployeeData = edge.func('sql', {
    connectionString: connection,
    source: "exec get_employee_info", 
    parameter: "@emp_id"

});

var getEmployeeQualification = edge.func('sql', {
    connectionString: connection,
    source: "exec getQualification",  
    parameter: "@emp_id"

});

var getCompanyInfo = edge.func('sql', {
    connectionString: connection,
    source: "exec getCompanyInfo",  
    parameter: "@emp_id"
});

var getCertificationInfo = edge.func('sql', {
    connectionString: connection,
    source: "exec getCertificationInfo",
    parameter: "@emp_id"
})


//------------Function to get List of Certifications-----------------//
var getCertificationlist = edge.func('sql', {
    connectionString: connection,
    source: 'exec getCertificationList'
});
//-----------Function to get list of Qualification------------------//
var getQualificationList = edge.func('sql', {
    connectionString: connection,
    source: 'exec getQualifictaionList'
});

var getSalaryList = edge.func('sql',{
    connectionString:connection,
    source: 'exec getEmployeeRoles'
})

var getGenderCodeList = edge.func('sql',{
    connectionString:connection,
    source: 'exec getGenderCodes'
})


var addCertificationInfo = edge.func('sql', {
    connectionString: connection,
    source: "exec addCertificationInfo",
    parameter: "@emp_id",
    parameter : "@certification_code",
    parameter: "@year"
});

var addQualificationInfo = edge.func('sql', {
    connectionString: connection,
    source: "exec addQualification",
    parameter: "@emp_id",
    parameter : "@qualification_code",
    parameter: "@percentage"
});

var addSalary = edge.func('sql', {
    connectionString: connection,
    source: "exec addSalary",
    parameter: "@emp_id",
    parameter : "@salary",
    parameter: "@leaves",
    parameter: "@bonus",
    parameter : "@post",
    parameter: "@year"
});
var editSalary = edge.func('sql', {
    connectionString: connection,
    source: "exec updateCompanyInfo",
    parameter: "@sr_no",
    parameter : "@salary",
    parameter: "@leaves",
    parameter: "@bonus",
    parameter : "@post",
    parameter: "@year"
});

var removeCertification = edge.func('sql', {
    connectionString: connection,
    source: "exec deleteCertification",
    parameter: "@id"
})

var removeQualification = edge.func('sql', {
    connectionString: connection,
    source: "exec deleteQualification",
    parameter: "@id"
})
var removeSalary = edge.func('sql', {
    connectionString: connection,
    source: "exec deleteSalary",
    parameter: "@id"
})
var updatePersonalinfo = edge.func('sql', {
    connectionString: connection,
    source: 'exec updatePersonalInfo',
    parameter: "@emp_id",
    parameter: "@fname",
    parameter: "@lname",
    parameter: "@mobile_no",
    parameter: "@email_id",
    parameter: "@dob",
    parameter: "@address",
    parameter: "@city",
    parameter: "@state",
    parameter: "@pincode",
    parameter: "@country",
    parameter: "@doj",
    parameter: "@pf_no"
})

var addTeam = edge.func('sql', {
    connectionString: connection,
    source: 'exec addTeam',
    parameter: "@team_name",
    parameter: "@team_desc"
})


var editTeam = edge.func('sql', {
    connectionString: connection,
    source: 'exec updateTeamInfo',
    parameter: "@team_name",
    parameter: "@team_description",
    parameter: "@team_id"
})


var deleteTeam = edge.func('sql', {
    connectionString: connection,
    source: 'exec deleteTeam',
    parameter: "@team_id",
})

var getDepartment = edge.func('sql', {
    connectionString: connection,
    source: "exec getDepartmentDatav2",
    parameter: "@team_id"
});

var getAllTeams = edge.func('sql', {
    connectionString: connection,
    source: "exec get_allTeams",
});

var deleteFromTeam = edge.func('sql', {
    connectionString: connection,
    source: "exec deleteEmpFromTeam",
    parameter: "@teamid",
    parameter: "@empid"
});
var deleteFromAllTeam = edge.func('sql', {
    connectionString: connection,
    source: "exec deleteEmployeeFromAllTeam",
    parameter: "@emp_id"
});



 


//------------------------Get Request--------------------------//

app.get("/employee/company", function(req, res){
    getAllTeams(null, function (error, result){
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
    
        res.send(result);
    })
})


//-----------------------Delete Request------------------------//


app.del("/employee/employeedelete/", function (req, res) {

    var emp_id = req.query['emp_id'];
    
    deleteFromAllTeam({ emp_id: emp_id }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
        
        res.send(result);
    })
})



//------------------------Post Request-------------------------//

app.post("/employee/employeedelete/:emp_id", function(req, res){

var team_id = req.body.team_id;
var emp_id = req.param('emp_id');

    deleteFromTeam({ teamid: team_id, empid: emp_id }, function (error,result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
        
        res.send(result);
    })
})


app.post("/employee/insertQualification", function (req, res) {
    var emp_id = req.body.emp_id;
    var percentage = req.body.percentage;
    var qualification_code = req.body.qualification_code

    addQualificationInfo({ emp_id: emp_id, percentage: percentage,qualification_code: qualification_code }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
    });
    res.send("data");

})
//-------------End Of Function-------------------------------------//

app.put('/employee/updatePersonalInfo/:emp_id', function (req, res){
    
    var mobile_no = parseInt(req.body.mobile_no);
    updatePersonalinfo({
            emp_id:req.param("emp_id"),
            fname : req.body.fname,
            lname:req.body.lname,
            mobile_no: mobile_no,
            email_id:req.body.email_id,
            dob:req.body.dob,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            pincode:0456,
            country:req.body.country,
            doj:req.body.doj,
            pf_no:req.body.pf_no
        },function (error, result) {
            if (error) { console.log(error); return; }
            if (result) {
                console.log();
            }
            else
                console.log("No results");
        });
    res.send("data");

})
//---------------------To insert Certifications-------------------//
app.post("/employee/insertCertification", function (req, res) {
    var emp_id = req.body.emp_id;
    var certification_code = req.body.certification_code;
    var year = req.body.year;
    addCertificationInfo({ emp_id: emp_id, year: year, certification_code: certification_code }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
    });
    res.send("data");
});
//------------------End of function-----------------------------// 
app.post("/employee/salary", function (req, res) {
    var emp_id = req.body.emp_id;
    var bonus = req.body.bonus;
    var post = req.body.code;
    var salary = req.body.salary;
    var leaves = req.body.leaves;
    var year = req.body.year;
    addSalary({ emp_id: emp_id, year: year,bonus: bonus,post:post,salary:salary,leaves:leaves}, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) console.log();
        else console.log("No results");
    });
});

app.put("/employee/salary/:sr_no", function (req, res) {
    var sr_no = req.param("sr_no");
    var bonus = req.body.bonus;
    var post = req.body.code;
    var salary = req.body.salary;
    var leaves = req.body.leaves;
    var year = req.body.year;
    editSalary({ sr_no: sr_no, year: year, bonus: bonus, post: post, salary: salary, leaves: leaves }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) console.log();
        else console.log("No results");
    });
});












//--------------------------Team Functions--------------------//
app.post("/employee/team", function(req, res){

var team_name = req.body.team_name;
var team_desc = req.body.team_desc;
    console.log("description: " + team_desc)
addTeam({ team_name: team_name, team_desc: team_desc }, function (error, result) {
    if (error) { console.log(error); return; }
    if (result) {
        console.log();
    }
    else
        console.log("No results");
});
res.send("data");

})

app.put("/employee/team/:team_id", function (req, res) {
    
    var team_name = req.body.team_name;
    var team_desc = req.body.team_desc;
    var team_id = req.param("team_id")

    editTeam({ team_id: team_id, team_name: team_name, team_description: team_desc }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
    });
    res.send("data");

})

app.del("/employee/team/:team_id", function (req, res) {
    var team_id = req.param("team_id")
    deleteTeam({ team_id: team_id}, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log();
        }
        else
            console.log("No results");
    });
    res.send("data");

})
//-------------End Of TEam Functions-----------------------------//

app.get("/employee/getcertificationUpdate/:id", function (req, res) {
    getCertificationInfo({ emp_id: req.param('id') }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            res.send(result);
        }
        else
            console.log("No results");
    });
})

app.get("/employee/getqualificationUpdate/:id", function (req, res) {
    
    getEmployeeQualification({ emp_id: req.param('id') }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {

            res.send(result);
        }
        else
            console.log("No results");
    });
})




app.post('/login', function (req, res) {
    
    var userData = [];
    console.log("in treeData")
    var user = req.body.username;
    var password = req.body.password;
    console.log("User: " + user);
    getLoginData(null, function (error, result) {
        if (error)
            console.log(error);
        if (result) {
            var isValid = authenticate(user, password, result);
            if (isValid != false) {
                console.log("Match");
                req.session.user = isValid.emp_id;
                if (isValid.user_type == "a")
                    req.session.user_type = "admin";
                else if (isValid.user_type == "u")
                    req.session.user_type = "user";
              //  req.session.user_type = isValid.user_type;
                userData.push({
                    'isValid' : true,
                    'user_id' : req.session.user ,
                    'permission' : req.session.user_type
                })
                res.send(userData);
            }
            else
                res.send("Invalid username or password");
        }
        else
            console.log("No result");
    });
})

app.put('/login/:emp_id', function (req, res) {
    
    var userData = [];

    var oldpass = req.body.oldPassword;
    var newpass = req.body.newPassword;
    var emp_id = req.param("emp_id");
   
    getUserLoginData({emp_id:emp_id}, function (error, result) {
        if (error)
            console.log(error);
        if (result) {
            var encryptedoldPassword = crypto.createHash('md5').update(oldpass).digest("hex");
            var encryptednewPassword = crypto.createHash('md5').update(newpass).digest("hex");

            if (encryptedoldPassword == result[0].password) {
                updatePassword(emp_id, encryptednewPassword)
                res.send(true);
            }
            else
                res.send(false);
            
   
        }
        else
            console.log("No result");
    });
})

function updatePassword(emp_id, newPassword)
{
    //----update code;
    updateUserLoginData({ emp_id: emp_id, password: newPassword }, function (error, result) {
        if (error) console.log(error);
        else if (result) console.log(result);
    });
}

//--------------To authenticate user------------//
function authenticate(username, password, userData) {

    var encryptedPassword = crypto.createHash('md5').update(password).digest("hex");
    console.log("encrypt: " + encryptedPassword);
    for (i = 0; i < userData.length; i++) {
        if (encryptedPassword == userData[i].password && username == userData[i].username)
            return (userData[i])
    }
    return (false);
}
//--------------End of function----------------//


app.get('/employee/treedata', function (req, res) {
    var response;                                 
//-------To get tree data-------------//   
    getTree(null, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            var department = [];
            var employee = [];
            var company = [];
            var result1 = {};
            var group_id = result[0].team_id;
            for (i = 0; i < result.length; i++) {
                var dpt_id = result[i].team_id;
                var dpt_name = result[i].team_name;
                if (group_id == result[i].team_id) {
                    employee = [];
                    while (i < result.length && group_id == result[i].team_id) {
                        if (result[i].emp_id != null) {
                            employee.push({
                                'id': result[i].emp_id,
                                'name' : result[i].fname + " " + result[i].lname,
                                'level' : 'emp'
                            })
                        }
                       i++;
                    }
                }
                department.push({
                   'id': dpt_id,
                    'name': dpt_name,
                    'children' : employee,
                    'level': 'dpt'
                })
                if (i < result.length)
                {
                    group_id = result[i].team_id;
                    i--;
                }
            }
            company.push({
                'id' : 1,
                'level' : 'root',
                'name': 'IIT',
                'children': department
            })
            res.send(company);
        }

        else
            console.log("No results");
       // res.send(JSON.stringify(company));
    });

//-------------End of function------------------------//
});

//-------------End of function-------------//
//---------------------- New delete functions---------------------------//
app.del('/employee/deleteCertification/', function (req, res) {
    removeCertification({ id: req.query['id'] }, function (error, result) { 
        if(result) {
            console.log(result);
        }
        if (error) {
            console.log(error);
        }
    })
});
app.del('/employee/deleteQualification/', function (req, res) {
    removeQualification({ id: req.query['id'] }, function (error, result) {
        if (result) {
            console.log(result);
        }
        if (error) {
            console.log(error)
        }
    })
});
app.del('/employee/deleteSalary/', function (req, res) {
    removeSalary({ id: req.query['id'] }, function (error, result) {
        if (result) {
            console.log(result);
        }
        if (error) {
            console.log(error)
        }
    })
});

//--------------------------------------------------------------------//
app.get('/employee/departmentdata/:team_id', function (req, res) {
    //----------To get Department Data--------------------//
    var employee = [];
    var department = [];
    getDepartment({ team_id: req.param('team_id') }, function (error, result) {
        if (error) console.log(error);
        else if (result.length>0) {
            var deptName = result[0].team_name;
            var description = result[0].team_description;
            for (i = 0; i < result.length; i++) {
                if (result[i].email_id != null) {
                    employee.push({
                        'fname' : result[i].fname,
                        'lname' : result[i].lname,
                        'email_id' : result[i].email_id
                    })
                }
            }
            department.push({
                'deptName': deptName,
                'description': description,
                'count': employee.length,
                'employee' : employee
            })

            res.send(department)
        }
        else
            res.send(department)
        });

//-----------End of function---------------------------//   
});

app.get('/employee/employeedata/:id', function (req, res) {
     
    var personal = [];
    var qualification = [];
    var company = [];
    var employee = [];
    var certification = [];
    var empFlag = false, qualFlag = false, comFlag = false, certFlag = false;
    emp_id = parseInt(req.param('id'));

//--------------TO get Employee Data---------------------------//
getEmployeeData({ emp_id: emp_id }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
          /* date = result[0].dob.split(" ")
           result[0].dob = date[0];
            date = result[0].doj.split(" ")
            result[0].doj = date[0];*/
            personal = result;
        }
        else
            console.log("No results");
        empFlag = true;
        sendData();
    });

//------------- To get Employee Qualification----------------//
getEmployeeQualification({ emp_id: emp_id }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            for (i = 0; i < result.length; i++) {
                qualification.push({
                    "degree" : result[i].name,
                    "percentage" : result[i].percentage,
                    'sr_no': result[i].sr_no
                })
            }
           // qualification = result;
        }
        else
            console.log("No results");
        qualFlag = true;
        sendData();
    });

//-------------To get Employee Company Details--------------//
getCompanyInfo({ emp_id: emp_id }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            company = result;
        }
        else
            console.log("No results");
        comFlag = true;
        sendData();
    });
//-------------To get Employee Certification Details--------------//
getCertificationInfo({ emp_id: emp_id }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            for (i = 0; i < result.length; i++) {
                certification.push({
                    'certification': result[i].certification_name,
                    'year': result[i].year,
                    'sr_no': result[i].sr_no
                })
            }
           // certification = result;
        }
        else
            console.log("No results");
        certFlag = true;
        sendData();
    });

function sendData()
{
        if (empFlag && qualFlag && comFlag && certFlag) {
            employee.push({
                'personal' : personal,
                'qualification': qualification,
                'company' : company,
                'certification' : certification
            })
            console.log(employee);
            res.send(employee);
        }
}
});
//--------------------To Get List Of Data--------------------------//
app.get('/employee/getCertification', function (req, res) {
    
//---------To get List of certifications------------------//
    getCertificationlist(null, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log(result);
        }
        else
            console.log("No results");
        res.send(JSON.stringify(result));
    });
});
//----------End of function-----------------------------//  


app.get('/employee/getQualification', function (req, res) {
    
   //---------To get List of qualifications------------------//
    getQualificationList(null, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            console.log(result);
        }
        else
            console.log("No results");
        res.send(JSON.stringify(result));
    });
});
//----------End of function-----------------------------//  

app.get('/employee/getSalary',function(req,res) {

    getSalaryList(null,function(error,result){
        if(error)
            console.log(error);
        if(result)
            console.log(result);
        res.send(JSON.stringify(result));
    })

})

app.get('/employee/getGenderCodeList',function(req,res){
    getGenderCodeList(null,function(error,result){
        if(result){
            res.send(result);
        }
    });
})

app.get('/', function (req, res) {
    
    res.end("Welcome");
});

app.listen(port, function () {
    console.log("Server listening at port " + port)
});