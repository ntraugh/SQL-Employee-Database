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
                // need to create this function
                addDepartment();
                break;
            case "Add a role":
                // need to create this function
                addRole();
                break;  
             case "Add an employee":
                 // need to create this function
                 addEmployee();
                break;
            case "Update role":
                    // need to create this function
                updateRole();
                break;
            default:
                 // need to create this function
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


