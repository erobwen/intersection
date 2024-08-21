# About

List intersection full stack app, built using React, Node.js and docker.


# Run the application

Prerequisites: Make sure docker is running on the system and that node/npm is installed.

* Run in root: npm start  (install runs inside dockerfiles)

* front end at: http://localhost/ 
* api at: http://localhost:3001/api
* api definition at: http://localhost:3001/api-docs

Note: docker containers will contained built versions of the services. 


# Develop

Note: On windows where watch wont work inside a folder mounted into a docker environment, it is best to just run all services separatley each in a different terminal window to get proper watch. 

* in node directory: npm install; npm start   
* in react directory: npm install; npm start   

* front end at: http://localhost:5173/
* api end at: http://localhost:3000/api
* api definition at: http://localhost:3000/api-docs


# Screenshot

![Alt text](/screenshot.png?raw=true "Screenshot")