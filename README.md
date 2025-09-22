# **Wattpad Clone – Full-Stack Web Application**

A full-featured Wattpad clone built with **Java Spring Boot**, **MySQL**, and a responsive **HTML/CSS/JS/Bootstrap** frontend.  
The application replicates most of Wattpad’s core functionality and introduces advanced features such as an **admin dashboard**, **story drafts**, **premium coins**, and **Wattpad Originals verification**.

---

## 1. Project Purpose
The purpose of this project is to:
- Recreate the Wattpad experience for readers and writers.
- Showcase full-stack development with authentication, content management, and payment-like flows.
- Demonstrate backend design using Spring Boot and MySQL.
- Deliver an engaging user experience with responsive UI.

---

## 2. Core Features

### **User Features**
- Register, login, and logout with JWT authentication.
- Profile management with published stories and personal details.
- Create stories, save drafts, and publish.
- Apply for Wattpad Originals status (requires admin approval).
- Purchase premium and coins to unlock locked stories.

### **Story Features**
- Multi-chapter story creation with paragraph handling.
- Draft management before publishing.
- Genres and tags for organization.
- Locked stories available for coin or premium unlock.
- Search and filter by title, author, or tags.

### **Reading & Interaction**
- Paginated reading experience.
- Like and comment system.
- Add stories to personal library.
- Track reads, likes, and comments.

### **Admin Dashboard**
- Manage admins, users, and stories.
- Approve Wattpad Originals applications.
- Publish announcements.
- Manage genres.
- View transaction history for coins and premium.
- Track and resolve user or story reports.

### **UI/UX**
- Responsive design for desktop and mobile.
- Clean, intuitive interface inspired by Wattpad.

---

## 3. Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript, Bootstrap
- Thymeleaf (styled email)

**Backend**
- Java, Spring Boot
- Spring Security with JWT authentication and authorization
- RESTful APIs

**Database & ORM**
- MySQL
- JPA/Hibernate

**Other Tools**
- Maven for build automation
- Git/GitHub for version control
- Postman for API testing

---

## 4. Installation & Setup

**Clone the Repository**
git clone https://github.com/thenurinethangi/Wattpad-Clone
cd wattpad-clone

**Configure Database**
Create a MySQL database (e.g., wattpad).
Update application.properties:
spring.datasource.url=jdbc:mysql://localhost:3306/wattpad
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

**Run the Backend**
./mvnw spring-boot:run

**Run the Frontend**
Open the frontend files in a local server or use a simple HTTP server such as live-server.


## 5. Screenshots

### Landing Page
![Login Page](screenshots/landing.png)

### Signup Page
![Signup Page](screenshots/signup.png)

### Signup with email Page
![Signup with email Page](screenshots/signup-with-email.png)

### Login Page
![Login Page](screenshots/login.png)

### Home Page
![Home Page](screenshots/home1.png)
![Home Page](screenshots/home2.png)
![Home Page](screenshots/home3.png)

### Search Page
![Search Page](screenshots/search-page.png)

### Genre Search Result Page
![Genre Search Result Page](screenshots/genre-search-result-page.png)

### Story Overview Page
![Story Overview Page](screenshots/story-overview.png)

### Other Users Page
![Other Users Page](screenshots/other-user-page-1.png)
![Other Users Page](screenshots/other-user-page-2.png)
![Other Users Page](screenshots/other-user-page-3.png)

### My Profile
![My Profile Page](screenshots/my-profile.png)

### My Profile Edit Page
![My Profile Edit Page](screenshots/my-profile-edit.png)

### My Following Page
![My Following Page](screenshots/my-following-page.png)

### My Stories Page
![My Stories Page](screenshots/my-stories-1.png)
![My Stories Page](screenshots/my-stories-2.png)

### Reading Lists Page
![Reading Lists Page](screenshots/rdl-1.png)
![Reading Lists Page](screenshots/rdl-2.png)
![Reading Lists Page](screenshots/rdl-3.png)
![Reading Lists Page](screenshots/rdl-4.png)

### Library Page
![Library Page](screenshots/library.png)

### Search Story by tag Page
![Search Story by tag Page](screenshots/tag-page.png)

### Search Story and profile by keyword/searched word Page
![Search Story and profile by keyword/searched word Page](screenshots/search-by-key-1.png)
![Search Story and profile by keyword/searched word Page](screenshots/search-by-key-2.png)

### Story Create Page
![Story Create Page](screenshots/story-create-page.png)

### Chapter View Page
![Chapter View Page](screenshots/chapter-view-1.png)
![Chapter View Page](screenshots/chapter-view-2.png)
![Chapter View Page](screenshots/chapter-view-3.png)
![Chapter View Page](screenshots/chapter-view-4.png)
![Chapter View Page](screenshots/chapter-view-5.png)

### Chapter Create And Edit Page
![Chapter Create And Edit Page](screenshots/chap-edit.png)

### Coins Purchase Page
![Coins Purchase Page](screenshots/coin-page-1.png)
![Coins Purchase Page](screenshots/coin-page-2.png)

### Premium Purchase Page
![Premium Purchase Page](screenshots/premium-1.png)

### Admin Part
![Admin Part](screenshots/admin-1.png)
![Admin Part](screenshots/admin-2.png)
![Admin Part](screenshots/admin-3.png)
![Admin Part](screenshots/admin-4.png)
![Admin Part](screenshots/admin-5.png)
![Admin Part](screenshots/admin-6.png)
![Admin Part](screenshots/admin-7.png)
![Admin Part](screenshots/admin-8.png)
![Admin Part](screenshots/admin-9.png)


## 6. Demo Video

[Watch the demo](https://youtu.be/VYO7JrUXZAk)


## 7. Future Enhancements
- Scheduled publishing for stories.
- Dark mode.
- AI-powered story recommendations.