# GIVE STREAM

![GIVE STREAM Logo](path/to/logo.png)

## Table of Contents
- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Launching](#launching)
  - [Endpoints](#endpoints)
    - [User Authentication and Authorization Endpoints](#user-authentication-and-authorization-endpoints)
    - [Charity Management Endpoints](#charity-management-endpoints)
    - [Donation Management Endpoints](#donation-management-endpoints)
- [Prerequisites](#prerequisites)
- [Installations](#installations)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running GIVE STREAM Locally](#running-give-stream-locally)
- [Usage](#usage)
- [Development Notes](#development-notes)
- [Security Considerations](#security-considerations)
- [MVPs](#mvps)
  - [MVP 1: Charity Management](#mvp-1-charity-management)
  - [MVP 2: Donation Management](#mvp-2-donation-management)
  - [MVP 3: Beneficiary Story Management](#mvp-3-beneficiary-story-management)
- [Stretch MVPs](#stretch-mvps)
  - [MVP 4: Admin Dashboard Enhancements](#mvp-4-admin-dashboard-enhancements)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contributors](#contributors)
- [Features](#features)
- [User Roles](#user-roles)


## Introduction

GIVE STREAM is a platform dedicated to encouraging repeat donations to charities that focus on providing essential services such as sanitary towels, clean water, and sanitation facilities to school-going girls in Sub-Saharan countries. Our goal is to streamline the donation process, provide transparency, and create an engaging platform for donors and charities alike.

## Problem Statement

In many Sub-Saharan countries, access to essential sanitary products and clean water is limited, leading to health issues and missed educational opportunities for young girls. Charities working in these regions often struggle with managing donations and maintaining donor engagement. The GIVE STREAM app aims to address these challenges by providing a user-friendly platform for making and managing donations, and tracking the impact of contributions.

## Key Features

- **User Roles**
  - **Donor:**
    - View and donate to charities.
    - Track donation history.
    - Receive updates on funded projects.
  - **Admin:**
    - Manage charity listings and details.
    - Monitor and analyze donation statistics.
    - Manage beneficiary stories and updates.

- **Charity Management:**
  - Add, view, and update charity profiles.
  - List and manage donation campaigns.

- **Donation Management:**
  - Make one-time or recurring donations.
  - View donation history and impact reports.

- **Beneficiary Story Management:**
  - Post and manage stories of beneficiaries receiving aid.
  - Provide updates on ongoing projects.


## Launching

### Endpoints

#### User Authentication and Authorization Endpoints

- **POST `/api/register`**
  - **Description:** Registers a new donor or admin.
  - **Request Body:** `{ username, email, password }`
  - **Response:** `{ success: true, message: "User registered successfully" }`

- **POST `/api/login`**
  - **Description:** Logs in a user and generates a JWT token.
  - **Request Body:** `{ username, password }`
  - **Response:** `{ success: true, token: "jwt_token" }`

- **POST `/api/logout`**
  - **Description:** Logs out a user by invalidating the JWT token.
  - **Authorization:** Bearer token in headers.
  - **Response:** `{ success: true, message: "Logged out successfully" }`

#### Charity Management Endpoints

- **POST `/api/charities`**
  - **Description:** Creates a new charity.
  - **Authorization:** Bearer token in headers.
  - **Request Body:** `{ name, description, contact_info }`
  - **Response:** `{ success: true, message: "Charity created successfully" }`

- **GET `/api/charities`**
  - **Description:** Retrieves all charities.
  - **Authorization:** Bearer token in headers.
  - **Response:** `{ success: true, charities: [ ... ] }`

- **DELETE `/api/charities/:charity_id`**
  - **Description:** Deletes a charity.
  - **Authorization:** Bearer token in headers.
  - **Response:** `{ success: true, message: "Charity deleted successfully" }`

#### Donation Management Endpoints

- **POST `/api/donations`**
  - **Description:** Creates a new donation.
  - **Authorization:** Bearer token in headers.
  - **Request Body:** `{ donor_id, charity_id, amount, donation_type }`
  - **Response:** `{ success: true, message: "Donation created successfully" }`

- **GET `/api/donations`**
  - **Description:** Retrieves all donations.
  - **Authorization:** Bearer token in headers.
  - **Response:** `{ success: true, donations: [ ... ] }`


## Prerequisites

- **React**
- **Python 3.8.13**
- **Flask with SQLAlchemy**
- **An active database and client-side connection**

## Installations

### Backend

1. Ensure Python 3.8.13 is installed.
2. Install required packages:
   ```sh
   pip install flask-sqlalchemy sqlalchemy_serializer flask_bcrypt flask_jwt_extended faker

