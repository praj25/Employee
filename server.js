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

var getTree = edge.func('sql', {
    connectionString: connection,
    source: 'exec get_treeData'
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

var getDepartment = edge.func('sql', {
    connectionString: connection,
    source: "exec getDepartmentData",
    parameter: "@dpt_id"
});
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

app.post('/employe/updatePersonalInfo', function (req, res){
    
    console.log("in update function");
    console.log(req.body);
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
//------------------------ Static ----------------------------------//
app.get('/login', function (req, res) {
//----------To create session--------------------//
    var user = "IIT admin"
    var password = "admin"
    console.log("in treeData")
    getLoginData(null, function (error, result) {
        if (error)
            console.log(error);
        if (result) {
            var isValid = authenticate(user, password, result);
            if (isValid != false) {
                req.session.user = isValid.username;
                req.session.user_type = isValid.user_type;
                res.send(req.session.user);
            }
            else
                res.send("Invalid username or password");
        }
        else
            console.log("No result");
    });
})
//--------------To authenticate user------------//
function authenticate(username, password, userData) {
    const encryptedPassword = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
    for (i = 0; i < userData.length; i++) {
        if (encryptedPassword == userData[i].password)
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
            var group_id = result[0].dpt_id;
            for (i = 0; i < result.length; i++) {
                var dpt_id = result[i].dpt_id;
                var dpt_name = result[i].dpt_name;
                if (group_id == result[i].dpt_id) {
                    employee = [];
                    while (i < result.length && group_id == result[i].dpt_id) {
                        employee.push({
                            'id': result[i].emp_id,
                            'name' : result[i].fname + " " + result[i].lname,
                            'level' : 'emp'
                        })
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
                    group_id = result[i].dpt_id;
                    i--;
                }
            }
            company.push({
                'id' : 1,
                'level' : 'root',
                'name': 'IIT',
                'children': department
            })
        }

        else
            console.log("No results");
        res.send(JSON.stringify(company));
    });

//-------------End of function------------------------//
});


app.get('/employee/tree_grid_data', function (req, res) { 
//------------ ----------------- ------------//

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
app.get('/employee/departmentdata/:dpt_id', function (req, res) {
//----------To get Department Data--------------------//
getDepartment({ dpt_id: req.param('dpt_id') }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            try {
                var department = [];
                var employee = [];
                for (i = 0; i < result.length; i++) {
                    employee.push({
                        'fname': result[i].fname,
                        'lname' : result[i].lname,
                        'email_id': result[i].email_id
                    })
              }
                department.push({
                    'department': result[0].dpt_name,
                    'description': result[0].dpt_desc,
                    'count' : result.length,
                    'employee': employee
                })
             }
            catch (err) {
                console.log("result not found")
                return;
            }
        }
        else {
            console.log("No results");
        }
        res.send(JSON.stringify(department))
    });
//-----------End of function---------------------------//   
});

app.get('/employee/employeedata/:id', function (req, res) {
     
    var personal = [];
    var qualification = [];
    var company = [];
    var employee = [];
    var certification = [];
    var empFlag = false, qualFlag = false, comFlag = false, certFlag=false;

//--------------TO get Employee Data---------------------------//
getEmployeeData({ emp_id: req.param('id') }, function (error, result) {
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
getEmployeeQualification({ emp_id: req.param('id') }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            qualification = result;
        }
        else
            console.log("No results");
        qualFlag = true;
        sendData();
    });

//-------------To get Employee Company Details--------------//
getCompanyInfo({ emp_id: req.param('id') }, function (error, result) {
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
getCertificationInfo({ emp_id: req.param('id') }, function (error, result) {
        if (error) { console.log(error); return; }
        if (result) {
            certification = result;
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