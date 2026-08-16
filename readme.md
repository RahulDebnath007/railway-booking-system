# 🚆 RailBook — Railway Booking System

A full-stack railway booking web application built with **React, Node.js, Express.js, MongoDB, and Vercel**.

RailBook allows users to create accounts, search trains, select seats, enter passenger details, make payments, and manage their bookings.

It also provides an **Admin Dashboard** for managing railway stations, trains, and seat inventory.

---

## 🌐 Live Demo

### Frontend

https://railway-booking-system-flame.vercel.app/

### Backend API

https://railway-booking-api.vercel.app/

### Backend Health Check

https://railway-booking-api.vercel.app/

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Application Flow](#-application-flow)
- [Authentication Flow](#-authentication-flow)
- [Admin Features](#-admin-features)
- [Seat Inventory System](#-seat-inventory-system)
- [API Architecture](#-api-architecture)
- [Database](#-database)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [GitHub Setup](#-github-setup)
- [Backend Deployment on Vercel](#-backend-deployment-on-vercel)
- [Frontend Deployment on Vercel](#-frontend-deployment-on-vercel)
- [CORS Configuration](#-cors-configuration)
- [Production Architecture](#-production-architecture)
- [Testing Checklist](#-testing-checklist)
- [Common Deployment Problems](#-common-deployment-problems)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

# 🚀 Project Overview

**RailBook** is a railway reservation and booking management system designed to simulate the workflow of a modern online railway booking platform.

The application provides two major interfaces:

### 👤 User Interface

Users can:

- Create an account
- Login securely
- Search trains
- Select journey dates
- Select train classes
- View seat availability
- Select available seats
- Enter passenger details
- Make payments
- View bookings
- Cancel bookings
- Switch between light and dark mode
- Use the application on desktop and mobile devices

### 👨‍💼 Admin Interface

Administrators can:

- Access the Admin Dashboard
- Add railway stations
- View existing stations
- Add and manage trains
- Configure train classes
- Initialize seat inventory
- Manage journey-specific seat availability

---

# ✨ Features

## 👤 User Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Logout functionality
- Role-based authentication
- Protected user routes

### Train Search

Users can search trains using:

- Source station
- Destination station
- Journey date
- Train class

### Seat Selection

The system provides:

- Available seats
- Booked seats
- Seat selection
- Class-specific seat inventory
- Journey-date-specific inventory

### Passenger Management

Users can enter passenger information before confirming a booking.

### Payment

The application includes a payment workflow connected to the booking process.

### Booking Management

Users can:

- View their bookings
- View booking details
- Cancel bookings

### UI Features

- Responsive design
- Dark mode
- Mobile-friendly layout
- Navigation dropdowns
- Accessible station selection
- Clean booking interface

---

# 👨‍💼 Admin Features

The Admin Dashboard provides three major management modules.

## 🚉 Station Management

Administrators can:

- Add stations
- Define station codes
- Define city
- Define state
- View registered stations

Example:

```text
Station Name: Howrah Junction
Station Code: HWH
City: Kolkata
State: West Bengal