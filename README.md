# SmartPark 🚗

### Smart Parking Management Platform

SmartPark is a web-based smart parking management platform designed to simplify parking discovery, reservations, and facility management. It provides users with an interactive parking experience, digital parking passes, booking management, and personalized dashboards, alongside an administrative portal for monitoring parking operations.

Built with **React, TypeScript, Vite, and Firebase**, SmartPark combines a responsive interface with cloud-based authentication and reservation management.

> **Project status:** Review-ready MVP
> **Project type:** Team project
> **Repository:** [LEGEND2835/SMARTPARK](https://github.com/LEGEND2835/SMARTPARK)

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [Application Modules](#-application-modules)
* [System Architecture](#-system-architecture)
* [Supported Languages](#-supported-languages)
* [Security](#-security)
* [Getting Started](#-getting-started)
* [Environment Configuration](#-environment-configuration)
* [Available Scripts](#-available-scripts)
* [Project Structure](#-project-structure)
* [Current Scope and Limitations](#-current-scope-and-limitations)
* [Future Scope](#-future-scope)
* [Team and Contributions](#-team-and-contributions)

---

## 🌐 Overview

Finding and managing parking spaces can be inconvenient for drivers and operational teams. SmartPark aims to provide a centralized interface for discovering parking facilities, viewing bay availability, making reservations, and managing digital parking permits.

The platform includes separate experiences for users and administrators. Users can browse parking facilities, book spaces, view their reservations, and manage their profiles. Administrators can access facility inventory, reservation records, occupancy information, and operational dashboards.

SmartPark currently operates as a **review-ready MVP**, with Firebase-backed authentication and booking workflows, alongside selected simulated integrations for hardware and payment operations.

---

## ✨ Key Features

### 🅿️ Parking Discovery

* Browse parking facilities through a centralized interface.
* Search facilities by name, address, and city.
* Filter facilities by availability, EV charging, covered parking, and 24/7 access.
* Sort results by distance, price, and availability.
* View facility details and interactive parking bay layouts.

### 📅 Booking and Reservation Management

* Create parking reservations through the application.
* Select parking bays, vehicle details, and reservation duration.
* View pricing breakdowns before completing a reservation.
* Access upcoming, active, completed, and cancelled bookings.
* Cancel eligible reservations through the user interface.
* Prevent conflicting reservations for the same parking bay and date.

### 🎫 Digital Parking Pass

* View a digital parking permit after booking.
* Display reservation details, driver information, vehicle registration, and access window.
* Show a simulated QR code and gate-camera status.
* Print the digital parking pass.

### 📊 User Dashboard

* Personalized dashboard with booking summaries.
* Active parking permit overview.
* Metrics for active passes, total bookings, hours parked, and total spent.
* Quick navigation to common actions.
* Recent reservation activity.

### 👤 Account and Profile Management

* Register, log in, and log out using Firebase Authentication.
* Maintain a persistent authenticated session.
* Edit profile information.
* Manage vehicle tags and notification preferences.
* Switch between light and dark themes.

### 🛠️ Administrator Portal

* Administrative dashboard with operational metrics.
* Facility inventory management interface.
* Add-facility form with input validation.
* Reservation search and status filtering.
* Administrative reservation status management.
* Route protection for administrator-only pages.

### 🌍 Multilingual Interface

* Centralized, type-safe internationalization architecture.
* Language selection without page reloads.
* Persistent language preferences.
* Localized interface metadata.

English, Hindi, and Kannada are implemented in the existing translation system. Tamil, Telugu, Malayalam, and Bengali have been added to the language structure, with translation work still in progress.

---

## 💻 Technology Stack

| Technology      | Purpose                                          |
| --------------- | ------------------------------------------------ |
| React 19        | Component-based user interface                   |
| TypeScript 6    | Type safety and application logic                |
| Vite 8          | Development server and production build          |
| React Router 7  | Client-side routing                              |
| Firebase 12     | Authentication and backend integration           |
| Cloud Firestore | User profiles and booking data                   |
| CSS             | Responsive styling, themes, and interface design |
| Oxlint          | Code linting                                     |
| Git and GitHub  | Version control and collaboration                |

---

## 🧩 Application Modules

| Module               | Route                 | Description                                       |
| -------------------- | --------------------- | ------------------------------------------------- |
| Parking Discovery    | `/parking`            | Search, filter, sort, and browse facilities       |
| Parking Details      | `/parking/:id`        | Facility details and interactive bay floorplan    |
| Digital Parking Pass | `/booking/:id`        | Reservation permit and access information         |
| User Dashboard       | `/dashboard`          | Personalized booking overview and metrics         |
| My Bookings          | `/bookings`           | Reservation history and cancellation controls     |
| User Profile         | `/profile`            | Account details, vehicles, preferences, and theme |
| Admin Dashboard      | `/admin`              | Operational metrics and telemetry interface       |
| Facility Inventory   | `/admin/parking`      | Facility inventory and add-facility form          |
| Reservation Audit    | `/admin/reservations` | Reservation search and administrative controls    |

---

## 🏗️ System Architecture

SmartPark follows a frontend-focused architecture integrated with Firebase services.

* **Frontend:** React and TypeScript provide the application interface, navigation, and user interactions.
* **Authentication:** Firebase Authentication manages user registration, login, logout, and session persistence.
* **Database:** Cloud Firestore stores user profiles and reservation records.
* **Security:** Firestore Security Rules enforce access controls for user profiles and bookings.
* **Internationalization:** A centralized TypeScript translation system manages supported languages and language preferences.
* **Fallback:** A client-side booking cache supports fallback behavior when normal backend operations are unavailable.

The parking facility catalogue and certain operational hardware interactions are currently handled through local structured data or frontend simulation.

---

## 🌍 Supported Languages

| Language  | Status                                               |
| --------- | ---------------------------------------------------- |
| English   | Implemented                                          |
| Hindi     | Implemented                                          |
| Kannada   | Implemented                                          |
| Tamil     | Added to language structure; translation in progress |
| Telugu    | Added to language structure; translation in progress |
| Malayalam | Added to language structure; translation in progress |
| Bengali   | Added to language structure; translation in progress |

The internationalization system is maintained under `src/i18n/`. Language preferences are stored locally using the `smartpark_language` key.

---

## 🔐 Security

SmartPark uses Firebase Authentication and Firestore Security Rules to protect user and reservation data.

The current security model includes:

* Authenticated users can access their own user profiles.
* New user profiles are created with the standard `user` role.
* Users cannot promote their own accounts to administrator.
* Booking access is restricted to the booking owner and authorized administrators.
* Critical booking fields are protected against unauthorized modification.
* Client-side deletion of user and booking records is denied by the rules.
* Unmatched Firestore paths are denied by default.

Firebase configuration is supplied through environment variables and should not be committed to the repository.

**Important:** Administrator account provisioning is a trusted administrative process. Do not weaken Firestore rules or expose privileged credentials in the frontend.

---

## 🚀 Getting Started

### Prerequisites

Install the following before setting up SmartPark:

* [Node.js](https://nodejs.org/) with npm
* [Git](https://git-scm.com/)
* A Firebase project with Authentication and Cloud Firestore configured
* A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the repository

```bash
git clone https://github.com/LEGEND2835/SMARTPARK.git
```

### 2. Navigate to the project directory

```bash
cd SMARTPARK
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env.local` file in the project root and add the Firebase configuration variables described in the next section.

Use your own Firebase project credentials. Do not commit `.env.local`.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

The application should now be available in your browser.

---

## ⚙️ Environment Configuration

SmartPark uses the following environment variables:

| Variable                            | Description                    |
| ----------------------------------- | ------------------------------ |
| `VITE_FIREBASE_API_KEY`             | Firebase web API key           |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Authentication domain |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project identifier    |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket        |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID   |
| `VITE_FIREBASE_APP_ID`              | Firebase web application ID    |

Example `.env.local` structure:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the example values with the configuration from your Firebase project.

The repository includes `.env.example` as a configuration template. Keep actual credentials and private environment files out of version control.

---

## 📜 Available Scripts

| Command               | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | Start the Vite development server                           |
| `npm run build`       | Run TypeScript project builds and create a production build |
| `npm run lint`        | Run Oxlint                                                  |
| `npm run preview`     | Preview the production build locally                        |
| `npx tsc -b --noEmit` | Run TypeScript validation without emitting build output     |

Run the production build before preparing a release:

```bash
npm run build
```

---

## 📁 Project Structure

```text
SMARTPARK/
├── public/                 # Public static assets
├── src/
│   ├── i18n/               # Internationalization and translations
│   ├── pages/              # Application pages
│   ├── ...                 # Components, services, and application logic
│
├── .env.example            # Firebase environment template
├── .gitignore              # Git ignore rules
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── index.html              # Application HTML entry point
├── package.json            # Dependencies and npm scripts
├── package-lock.json       # Dependency lockfile
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

---

## ⚠️ Current Scope and Limitations

SmartPark is a review-ready MVP. The following functionality is intentionally simulated or uses local reference data:

* **Parking facility catalogue:** Facility and bay layout data are currently provided through structured local data rather than a remote Firestore facilities collection.
* **IoT and ALPR:** Gate camera, barrier, and telemetry interactions are simulated in the frontend; no physical hardware integration is claimed.
* **Payments and refunds:** Payment and cancellation refund states are simulated. No external payment gateway is connected.
* **Administrator provisioning:** New accounts are assigned the standard user role. Administrator privileges require trusted provisioning.

These limitations define the current MVP scope and provide areas for future development.

---

## 🔭 Future Scope

Potential areas for further development include:

* Integration with live parking sensors and IoT devices.
* Real-time facility and bay availability from connected infrastructure.
* Automated number-plate recognition using compatible hardware.
* Integration with a secure payment gateway.
* Automated payment reconciliation and refund processing.
* Expanded localization with completed translations for all added languages.
* Enhanced operational analytics and reporting.
* Deployment to a production environment with appropriate monitoring and operational controls.

These are possible future enhancements and are not represented as completed features.

---

## 👥 Team and Contributions

SmartPark is a collaborative team project.

**Santanu Barua — Team Lead**

* Project coordination and development planning.
* Frontend development and user interface implementation.
* Continued feature development, integration, testing, and documentation.

**Initial contributor**

* Initial implementation and development during the project's first phase.
* Continued collaboration and contribution through the shared repository.

Additional team members and specific contributions can be documented as the project progresses.

The repository is maintained under [LEGEND2835](https://github.com/LEGEND2835), with the original project history preserved.

---

## 📌 Project Status

SmartPark has reached a review-ready MVP checkpoint, with core authentication, booking, discovery, dashboard, administrative, and security workflows documented as verified in the project's development checkpoint.

Development is ongoing. Features identified as simulated, locally sourced, or in progress should be treated according to the current implementation status.

---

**SmartPark — Simplifying the parking experience.**
