# ToolHub - AI Tools Discovery Platform

ToolHub is a full-stack web application designed for discovering, filtering, and reviewing AI tools. It features a dual-view interface for regular users to explore tools and an Admin Panel for managing tool listings and review approvals.

## Key Features

- **Dynamic Tool Grid:** View all available AI tools with real-time data.
- **Instant Filtering:** Filter tools by Category and Pricing Type (Free, Freemium, Paid) without page refreshes.
- **Review System:** Users can submit reviews (1-5 stars) which remain 'PENDING' until approved.
- **Admin Dashboard:**
    - Add new AI tools to the database.
    - Approve pending reviews.
---

## Tech Stack

### Frontend
- **HTML5/CSS3:** Custom styles with CSS Variables
- **JavaScript (ES6+):** Vanilla JS for DOM manipulation and application logic.
- **Axios:** For handling asynchronous API requests.

### Backend
- **Java 17+:** Core language.
- **Spring Boot 3.x:** Application framework.
- **Spring Data JPA:** For database interaction.
- **Lombok:** To reduce boilerplate code in Entity classes.
- **MySQL:** Database storage.

---

## Project Structure



```text
     /
    ├── index.html       # Main UI structure
    ├── style.css        # Custom UI styling
    └── script.js        # Frontend logic & API calls
