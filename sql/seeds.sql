USE employees_db;

INSERT INTO department (name)
VALUES ("Sales"), 
       ("Engineering"), 
       ("Finance"), 
       ("Legal"); 
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Team Lead", 100000, 1),
       ("Sales Associate", 50000, 1),
       ("Accountant Lead", 120000, 3),
       ("Accountant", 70000, 3),
       ("Chief Legal Officer", 250000, 4),
       ("Lawyer", 100000, 4),
       ("Engineer Manager", 180000, 2),
       ("Web Developer", 100000, 2);
       

       



/* INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nate", "Traugh", ) */