# 🚀 Boot-FebAssign: Full-Stack Application

A full-stack project with **React (Frontend)** and **Django (Backend)** running seamlessly with **Docker**. This setup allows you to start everything with a single command.

---

## **📌 Features**
✅ Full-Stack Integration (Django & React)  
✅ Dockerized Setup - One Command to Start  
✅ Seamless API Communication  


---

## **🛠️ Tech Stack**
| **Technology**  | **Description**  |
|---------------|----------------|
| 🐍 **Django**  | Backend Framework  |
| ⚛ **React**  | Frontend Framework  |
| 🐳 **Docker**  | Containerization  |
| 🐘 **PostgreSQL** | Database  |
| 📡 **Django REST Framework** | API Development  |

---

## **🚀 Quick Start**

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/Nitin7151/boot-febAssign.git
cd boot-febAssign
```

### **2️⃣ Run Everything with Docker**
```bash
docker-compose up --build
```
🚀 This will start the Django backend and React frontend together.

### **3️⃣ Open the Application**
- Frontend (React) → **http://localhost:3000**
- Backend (Django API) → **http://localhost:8000/api/**

---

## **📂 Project Structure**
```
boot-febAssign/
│── Boot41ui/           # React Frontend
│── server/             # Django Backend
│── docker-compose.yml  # Docker Compose File
│── .gitignore          # Git Ignore File
│── README.md           # Project Documentation
```

---


## **🐳 Docker Compose Configuration**
`docker-compose.yml`
```yaml
version: "3.8"
services:
  backend:
    build: ./server
    ports:
      - "8000:8000"
    env_file:
      - ./server/.env
    depends_on:
      - db

  frontend:
    build: ./Boot41ui
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgres
    environment:
      POSTGRES_DB: your_db
      POSTGRES_USER: your_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
```

---

## **📜 API Endpoints**
| **Method** | **Endpoint** | **Description** |
|-----------|-------------|----------------|
| `GET`     | `/api/users/` | Fetch Users |
| `POST`    | `/api/login/` | User Login |
| `GET`     | `/api/data/`  | Fetch Data |

---

## **🎯 Contributing**
Feel free to contribute! Open issues, submit pull requests, and help make this project better. 🎉  

---

### **💡 Need Help?**
If you face any issues, feel free to raise an issue in the repository or contact me! 🚀