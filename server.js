const inquirer = require("inquirer");
const mysql = require("mysql2")
require("console.table");


const db = mysql.createConnection({
    user: "root",
    database: "employees_db"
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
                "Finished"
            ]
    })
    .then((answers) => {
        switch(answers.initialPrompt) {
            case "View all departments":
                // need to create this function
                viewDepartments();
                break;
            case "View all roles":
                // need to create this function
                viewRoles();
                break;
            case "View all employees":
                // need to create this function
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
    db.query('SELECT * FROM department', function (err, results) {
        if (err) return console.error(err); 
        console.table(results);
        init();
    });
};


init()