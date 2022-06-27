const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const db = mysql.createConnection({
    user: "root",
    database: "employees_db"
})

db.connect(function (err) {
    if (err) return console.error(err);
    init()
})

function init() {
    inquirer.prompt(
        {
            type: "list",
            name: "initialPrompt",
            message: "What would you like to do?",
            choices: [
                "View all departments", 
                "View all roles", 
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update role",
                "Exit"
            ]
    })
    .then((answers) => {
        switch(answers.initialPrompt) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;  
             case "Add an employee":
                 addEmployee();
                break;
            case "Update role":
                    // need to create this function
                updateRole();
                break;
            default:
                process.exit();
        }
    })
}


const viewDepartments = () => {
    // adding console log and space here between the question and tables
    console.log("\nViewing all departments\n")
    db.query('SELECT * FROM department', function (err, results) {
        if (err) return console.error(err); 
        console.table(results);
        return init();
    });
};

const viewRoles = () => {
    // adding console log and space here between the question and tables
    console.log("\nViewing all roles\n")
    db.query(`SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    LEFT JOIN department ON role.department_id = department.id;`, function (err, results) {
        if (err) return console.error(err); 
        console.table(results);
        return init();
    });
};
const viewAllEmployees = () => {
    // adding console log and space here between the question and tables
    console.log("\nViewing all employees\n")
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
    CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON department.id = role.department_id
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`, function (err, results) {
        if (err) return console.error(err); 
        console.table(results);
        return init();
    });
};
const addDepartment = () => {
    // running prompt asking which department they would like to add
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartment",
            message: "What department would you like to add?",
    }])
    // running our then promise, taking their response and INSERTING it  INTO the department table
    .then((response) => {
        db.query(`INSERT INTO department SET ?`, {name: response.addDepartment}, function (err, results) {
            if (err) return console.error(err); 
            return init();
        });
    })
};
const addRole = () => {
    db.query(`SELECT department.id, department.name, role.salary 
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON department.id = role.department_id
    GROUP BY department.id, department.name;`, function (err, results) {
        if (err) return console.error(err);
        const newDepartment = results.map(({id, name}) => ({
            value: id, 
            name: `${id} ${name}`
        })) 
        console.table(results);
        // need to run new function with prompts for the user to insert their options
        return newRole(newDepartment);
    })
};
const newRole = (department) => {
    inquirer.prompt ([{
        type: "input",
        message: "New Role: ",
        name: "title"
    },
    {
        type: "input",
        message: "New Salary: ",
        name: "salary"
    },
    {
        type: "list",
        message: "New Department: ",
        name: "department",
        // giving the user the choices of department that we passed into addRole function
        choices: department
    },
    ])
    .then((response) => {
        db.query(`INSERT INTO role SET ?`, {
            title: response.title,
            salary: response.salary,
            department_id: response.department
        }, (err, results) =>{
            if (err) return console.error(err);
            return init();
        })
    })

}
const addEmployee = () => {
    console.log("\nAvailable roles for new employee\n")
    db.query(`SELECT role.id, role.title, role.salary
    FROM role;`, function (err, results) {
        if (err) return console.error(err)
        const role = results.map(({ id, title, salary}) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }))
        console.table(results)
        // inquirer won't work here need to run in new function
        addEmployeeInfo(role)
    })
}
const addEmployeeInfo = (role) => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Employees first name: "
        },
        {
            type: "input",
            name: "lastName",
            message: "Employees last name: "
        },
        {
            type: "list",
            name: "employeeRole",
            message: "Employees role: ",
            choices: role
        }
    ])
    .then((response) =>{
        db.query(`INSERT INTO employee SET ?`, {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: response.employeeRole 
        }, (err, results) => {
            if (err) return console.error(err)
            return init()
        })
    })
}

getEmployeeRole = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, 
    CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON department.id = role.department_id
    JOIN employee manager ON manager.id = employee.manager_id;`, (err, results) => {
        if (err) console.error(err)
        const employee = res.map(({ id, first_name, last_name}) => ({
            value: id,
            first_name: `${first_name}`,
            last_name: `${last_name}`
        }))
        console.table(results)
        updateRole(employee);
    })
}
const updateRole = (employee) => {
    db.query(`SELECT role.id, role.title, role.salary
    FROM role;`, (err, results) => {
        if (err) console.error(err)
        const roleChoice = results.map(({ id, title, salary}) => ({
            value: id, 
            title: `${title}`,
            salary: `${salary}`
        }));
        console.table(results)
        // need to create another function taht takes in employee and rolechoices with inquirer prompt
        getNewRole(employee, roleChoice);
    })
}
const getNewRole = (employee, roleChoice) => {
    inquirer.prompt ([
        {
            type: "list",
            name: "employee",
            message: `Which employee would you like to update?`,
            choices: employee
        },
        {
            type: "list",
            name: "role",
            message: "Which role would you like to give to this employee?",
            choices: roleChoice
        },
    ])
    .then((response) => {
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [response.role, response.employee], (err, results) => {
            if (err) console.error(err)
            return init()
        })
    })
}