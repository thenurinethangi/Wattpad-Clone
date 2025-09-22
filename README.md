Wattpad Clone – Full-Stack Web Application

A full-featured Wattpad clone built with Java Spring Boot, MySQL, and a responsive HTML/CSS/JS/Bootstrap frontend.
The application replicates most of Wattpad’s core functionality and introduces advanced features such as an admin dashboard, story drafts, premium coins, and Wattpad Originals verification.

1. Project Purpose
->The purpose of this project is to:
->Recreate the Wattpad experience for readers and writers.
->Showcase full-stack development with authentication, content management, and payment-like flows.
->Demonstrate backend design using Spring Boot and MySQL.
->Deliver an engaging user experience with responsive UI.

2. Core Features

User Features
->Register, login, and logout with JWT authentication.
->Profile management with published stories and personal details.
->Create stories, save drafts, and publish.
->Apply for Wattpad Originals status (requires admin approval).
->Purchase premium and coins to unlock locked stories.

Story Features
->Multi-chapter story creation with paragraph handling.
->Draft management before publishing.
->Genres and tags for organization.
->Locked stories available for coin or premium unlock.
->Search and filter by title, author, or tags.

Reading & Interaction
->Paginated reading experience.
->Like and comment system.
->Add stories to personal library.
->Track reads, likes, and comments.

Admin Dashboard
->Manage admins, users, and stories.
->Approve Wattpad Originals applications.
->Publish announcements.
->Manage genres.
->View transaction history for coins and premium.
->Track and resolve user or story reports.

UI/UX
->Responsive design for desktop and mobile.
->Clean, intuitive interface inspired by Wattpad.

3. Tech Stack

Frontend:
->HTML5, CSS3, JavaScript, Bootstrap
>Thymeleaf (styled email)

Backend:
->Java, Spring Boot
->Spring Security with JWT authentication and authorization
->RESTful APIs

Database & ORM:
->MySQL
->JPA/Hibernate

Other Tools:
->Maven for build automation
->Git/GitHub for version control
->Postman for API testing

4. Installation & Setup
->Clone the Repository
git clone https://github.com/thenurinethangi/Wattpad-Clone
cd wattpad-clone

->Configure Database
Create a MySQL database (e.g., wattpad).
Update application.properties:
spring.datasource.url=jdbc:mysql://localhost:3306/wattpad
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

->Run the Backend
./mvnw spring-boot:run

->Run the Frontend
Open the frontend files in a local server or use a simple HTTP server such as live-server.

5. Screenshots

### Landing Page
![Login Page](screenshots/Screenshot (837).png)

### Landing Page
![Login Page](screenshots/Screenshot (837).png)


6. Demo Video

7. Future Enhancements
->Scheduled publishing for stories.
->Dark mode.
->AI-powered story recommendations.