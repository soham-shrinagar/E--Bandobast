# E-Bandobast  
**Police Deployment Tracking & Management System**

E-Bandobast is a centralized, real-time police deployment and monitoring platform built to manage large-scale public events such as festivals, rallies, sports events, and elections. It replaces manual coordination with live location tracking, geo-fenced monitoring, automated notifications, and structured deployment workflows.

This project was developed as part of the **Goa Police Hackathon** by **Team Semantica (IIT Goa)**.

---

## Problem Statement

Managing police deployment during large public gatherings is operationally challenging due to:
- Manual and fragmented coordination
- No real-time visibility of deployed personnel
- Communication delays
- Weak accountability and duty verification

These issues often result in inefficient manpower utilization, delayed responses, and lack of situational awareness. A centralized, location-aware system is required to ensure efficient deployment and monitoring.

---

## Solution Overview

E-Bandobast provides an end-to-end digital solution with two tightly integrated applications:

### 1. Officer Web Application
A centralized dashboard for officers to plan, deploy, and monitor personnel.

**Key Features**
- Upload personnel data using CSV/Excel templates
- Map-based deployment using polygonal or circular geo-fences
- Assign personnel to specific deployment zones
- Real-time tracking of personnel location and duty status
- Deviation alerts when personnel move outside assigned geo-fences
- Direct communication via in-app notifications and SMS
- Pan-Goa deployment view for large-scale coordination

---

### 2. Personnel Mobile Application
A mobile app for on-ground personnel to receive duties and report compliance.

**Key Features**
- Duty notifications with navigation support
- OTP-based check-in and check-out
- Live location tracking during duty
- Geo-fence breach alerts (inner and outer radius)
- Direct communication with supervising officers

---

## System Architecture

The system follows a modular, service-oriented architecture.

### Client Layer
- **Officer Dashboard**: React + Vite (Web)
- **Personnel App**: React Native (Expo)

### Backend Layer
- **Auth Service**: JWT-based authentication with Google OAuth and role-based access
- **API Gateway**: Express + TypeScript (routing, validation, CORS)
- **Personnel Service**: CSV/Excel parsing, CRUD operations, bulk imports
- **Location Service**: Real-time GPS tracking, geo-fencing, deviation detection
- **Notification Service**: Push notifications, in-app messages, SMS alerts

### Data & External Services
- **Database**: PostgreSQL with Prisma ORM
- **Maps & Navigation**: Google Maps API
- **Authentication**: Google OAuth
- **Hosting**: Vercel (frontend) and Railway (backend)

---

## Core Workflow

1. Officer uploads personnel data (CSV/Excel)
2. Deployment zones are created using map-based geo-fences
3. Personnel are assigned to specific zones
4. Duty notifications are sent automatically
5. Personnel check in using OTP and start duty
6. Live location is tracked within assigned geo-fence
7. Deviations trigger alerts to both personnel and officers
8. Duty is closed via OTP-based check-out
9. Supervisor dashboard reflects real-time status and history

---

## Key Features Summary

- Real-time personnel tracking
- Geo-fenced deployment monitoring
- OTP-based duty verification
- CSV/Excel-based bulk deployment
- Pan-region deployment visualization
- Direct officer-to-personnel communication
- Role-based secure authentication
- Scalable backend services

---

## Limitations

- Continuous polling of location data can cause performance bottlenecks at scale
- Location data is currently transmitted without encryption
- Geo-fencing logic runs on the client side, affecting older devices
- Cloud database dependency increases latency
- No event-driven or cached update mechanism

---

## Scope for Improvement

- Replace polling with WebSockets for real-time updates
- Encrypt data in transit for enhanced security
- Move geo-fencing calculations to the server side
- Introduce caching and event-driven updates
- Support dynamic shift scheduling and multi-geo-fence assignments
- Enable union and intersection-based deployment logic

---

## Results & Conclusion

E-Bandobast delivers a complete, scalable, and practical deployment management system. Officers gain real-time situational awareness and control, while personnel benefit from clear duty instructions, navigation support, and automated accountability.

The system significantly reduces manual coordination, improves response times, and enhances operational transparency—making it suitable for law enforcement agencies and large-scale event management.

---

## Team

**Team Semantica**  
- Soham Shrinagar  
- Chirag M. Nayak  

**Institute**: Indian Institute of Technology, Goa  

---


