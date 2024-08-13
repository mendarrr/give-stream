# GIVE STREAM APP

![CareConnect Logo](path/to/careconnect-logo.png)

## Table of Contents
1. [Introduction](#introduction)
2. [Problem Statement](#problem-statement)
3. [Key Features](#key-features)
4. [Launching](#launching)
   - [Endpoints](#endpoints)
5. [Prerequisites](#prerequisites)
6. [Installations](#installations)
   - [Backend](#backend)
   - [Frontend](#frontend)
7. [Running CareConnect Locally](#running-careconnect-locally)
8. [Usage](#usage)
   - [Patient Workflow](#patient-workflow)
   - [Admin Workflow](#admin-workflow)
9. [Development Notes](#development-notes)
10. [Security Considerations](#security-considerations)
11. [MVPs](#mvps)
   - [MVP 1: Service Management](#mvp-1-service-management)
   - [MVP 2: Patient Management](#mvp-2-patient-management)
   - [MVP 3: Appointment Management](#mvp-3-appointment-management)
   - [MVP 4: Patient Login](#mvp-4-patient-login)
12. [Stretch MVPs](#stretch-mvps)
   - [MVP 5: Staff Management](#mvp-5-staff-management)
   - [MVP 6: Billing Services](#mvp-6-billing-services)
13. [Technologies Used](#technologies-used)
   - [Backend](#backend-1)
   - [Frontend](#frontend-1)
   - [Development Tools](#development-tools)
14. [License](#license)
15. [Contributors](#contributors)



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



