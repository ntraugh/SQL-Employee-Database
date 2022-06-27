USE employees_db;

SELECT role.id, role.title, role.salary, department.name AS department
FROM role
LEFT JOIN department ON role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
CONCAT(manager.first_name, " ", manager.last_name) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee manager ON manager.id = employee.manager_id;

SELECT department.id, department.name, role.salary 
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON department.id = role.department_id
GROUP BY department.id, department.name;

SELECT role.id, role.title, role.salary
FROM role;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON department.id = role.department_id;


UPDATE employee SET role_id = ? WHERE id = ?;