# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# GIVE STREAM PROJECT

 ![Give-Stream Logo](image-1.png)

## Table of Contents

* Introduction  

* Problem Statement  

* Key Features  

* Launching  

  - Endpoints   

* Prerequisites  

* Installations  

  - Backend  

  - Frontend  

* Running GIVE STREAM Locally  

* Usage  

* Development Notes  

* Security Considerations  

* MVPs  

  - MVP 1: User Authentication  

  - MVP 2: Charity Management  

  - MVP 3: Donation Functionality  

  - MVP 4: Beneficiary Stories  

* Technologies Used  

* License  

* Contributors


## Introduction

GIVE STREAM is a platform dedicated to improving menstrual hygiene management in sub-Saharan countries by encouraging repeat donations to support charities providing sanitary towels, clean water, and sanitation facilities. Our mission is to empower young girls by ensuring they do not miss school due to lack of menstrual hygiene products. Our project basically accepts donations in monetary form, through well laid down donation strategies.

## Problem Statement

In many sub-Saharan countries, school-going girls from poor families miss significant amounts of school due to lack of sanitary towels. A 2016 study revealed that girls can lose up to 20% of school days annually because they cannot access the necessary menstrual hygiene products. This project aims to alleviate this issue by creating a platform that facilitates regular donations to charities focused on this cause.

## Key Features


### User Roles:

Donor: Can browse and donate to approved charities, set up repeat donations, and view beneficiary stories.
Charity: Can apply to be listed on the platform, manage their profile, and post stories about beneficiaries.
Administrator: Can manage charity applications, approve or reject charities, and oversee platform operations.

#### Charity Management

Display and manage a list of approved charities.
Enable charities to apply for inclusion on the platform.
Allow administrators to approve, reject, or remove charities.

### Donation Functionality
Enable donors to make one-time or repeat donations.
Provide simple payment integration (e.g., Stripe, PayPal).
Allow donors to choose anonymity.

### Beneficiary Stories

Charities can post stories about beneficiaries to showcase the impact of donations.

  ### Launching

### Endpoints

#### User Authentication and Authorization Endpoints
POST /api/auth/register: Register a new user (donor, charity, or admin).  
POST /api/auth/login: Log in a user and generate a JWT token.  
POST /api/auth/logout: Log out the user by invalidating the current JWT token.

#### Charity Management Endpoints
POST /api/charities: Create a new charity.  
GET /api/charities: Retrieve all approved charities.  
PATCH /api/charities/{id}: Update charity details.  
DELETE /api/charities/{id}: Delete a charity.

#### Donation Endpoints
POST /api/donations: Create a new donation.  
GET /api/donations: Retrieve all donations made by a user.  

#### Beneficiary Stories Endpoints
POST /api/stories: Create a new beneficiary story.  
GET /api/stories: Retrieve all beneficiary stories.

### Prerequisites
- Python 3.8 or higher
- Node.js and npm
- An active database connection

### Installations

#### Backend
Navigate to the backend directory:
cd server
Install required packages:
pip install flask sqlalchemy,flask-jwt-extended

  Set up the database: 
 - flask db init
 - flask db migrate
 - flask db upgrade
 - python seed.py

#### Frontend
Navigate to the frontend directory:
cd client
Install dependencies:
npm install

### Running GIVE STREAM Locally

#### Backend
 Activate the virtual environment:
 source venv/bin/activate
 Run the Flask server:
 flask run

#### Frontend
Start the React development server:
 npm start
 Open http://localhost:3000 in your browser to view the app.

### Usage:

 #### Donor Workflow
 Register or log in.
 Browse available charities.
 Make a one-time or repeat donation.
 View beneficiary stories.

#### Charity Workflow
Apply for platform inclusion.
Manage charity details and post beneficiary stories.

#### Admin Workflow
Manage charity applications and oversee platform activities.

### Development Notes
Backend: Flask for API development, SQLAlchemy for database management.  
Frontend: React.js with Redux for state management.  
Testing: Jest for frontend, Pytest for backend.  
Security Considerations  
Use JWT for secure authentication.  
Validate and sanitize input to prevent security vulnerabilities.  

### MVPs

#### MVP 1: User Authentication
Implement user registration, login, and logout functionalities.
Secure the platform using JWT.

#### MVP 2: Charity Management
Enable charities to apply for listing and manage their profiles.
Provide admin tools to manage charity applications.

#### MVP 3: Donation Functionality
Allow donors to make donations and set up repeat donations.
Integrate payment gateways for smooth transactions.

#### MVP 4: Beneficiary Stories
Allow charities to post stories about beneficiaries to keep donors engaged.

### Stretch MVPs
Add more detailed analytics for charities and administrators.
Implement SMS or email notifications for donors.

### Technologies Used

#### Backend
Language: Python  

Framework: Flask  

Database: SQLAlchemy  

Authentication: JWT

#### Frontend
Language: JavaScript  

Framework: React.js  

Development Tools
Figma  

Version Control: Git and GitHub  

Package Management: npm  

License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributors
Maurine Omondi  

Samuel Kamau  

Kevin Wafula  

Mark Kimathi  

Abby Ombuna