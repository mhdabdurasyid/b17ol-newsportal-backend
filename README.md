<h1 align="center">Balbalan Backend Using ExpressJs & Sequelize</h1>

An app to read news or article. Registered user can create, edit or delete their news or article. Built with NodeJs using the ExpressJs Framework and Sequelize ORM.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js).
Sequelize is a promised-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. [More about Sequelize](https://sequelize.org/)

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.17.1-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v12.18.3-green.svg?style=rounded-square)](https://nodejs.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6.3.5-blue.svg?style=rounded-square)](https://www.npmjs.com/package/sequelize)
[![MySQL2](https://img.shields.io/badge/MySQL2-v2.2.5-blue.svg?style=rounded-square)](https://www.npmjs.com/package/mysql2)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (XAMPP)
5. Code Editor (Visual Studio Code)

## How to run the app ?
1. Open app's directory in CMD
2. Type `npm install`
3. Turn on Web Server and MySQL (XAMPP, etc.)
4. Create a database with the name newsportal_development to **phpmyadmin**
5. Configure DB in `config/config.json` (optional for password)
6. Run Sequelize migrations with `npx sequelize-cli db:migrate`
7. Open Postman desktop application that has installed before
8. Choose HTTP Method and enter request URL
9. You can see all the end point [here](https://documenter.getpostman.com/view/12649347/TVsrE8q6)
