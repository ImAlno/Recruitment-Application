# Recruitment Application - KTH IV1201

This project is part of the course **Design of Global Applications (IV1201)** at Kungliga Tekniska Högskolan (KTH).

## Project Overview

The system is a robust, scalable web-based recruitment tool designed for an amusement park to manage seasonal staff applications. It distinguishes between two primary user roles: **Applicants** and **Recruiters**.

## Key Features

### For Applicants
- **Account Registration**: Quick setup with personal details.
- **Job Application**: Create a profile including:
  - **Competence Profile**: Areas of expertise and years of experience.
  - **Availability**: Specific periods available for work.
- **Multi-language Support**: Designed for global future-proofing.

### For Recruiters
- **Application Management**: Review, filter, and sort submitted applications.
- **Decision Making**: Mark applications as *Accepted*, *Rejected*, or *Unhandled*.
- **Mobile-Friendly**: Prototype designed with a mobile-first approach.

## Use Case Summary

1. **Create Account**: Register first/last name, email, person number, and credentials.
2. **Login**: Authenticate as either an applicant or a recruiter.
3. **Apply for a Position**: Submit competence profiles and availability periods.
4. **List Applications**: Recruiter view of all existing applications and their status.
5. **Manage Application**: Detailed view of a single application with status update capabilities (includes concurrency handling).