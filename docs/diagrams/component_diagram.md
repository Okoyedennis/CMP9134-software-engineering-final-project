flowchart LR
User[User / Operator]

    subgraph Frontend[Frontend - React + TypeScript]
        Pages[Pages<br/>Sign In, Sign Up, Dashboard, Logs, Users, Sensors]
        Components[UI Components<br/>Navbar, Tables, MapGrid, Buttons]
        Hooks[Hooks<br/>useTelemetry]
        ApiService[Axios API Service]
        AuthUtils[Auth Utils<br/>Token + User Storage]
    end

    subgraph Backend[Backend - Node.js + Express]
        ExpressApp[Express App]
        AuthModule[Auth Module]
        UserModule[User Module]
        RobotModule[Robot Module]
        AuditModule[Audit Log Module]
        Middleware[Auth + Role Middleware]
    end

    subgraph Database[Database]
        MongoDB[(MongoDB Atlas<br/>Users + Audit Logs)]
    end

    subgraph Robot[Virtual Robot Simulator - Docker]
        RobotREST[Robot REST API<br/>Status, Move, Reset, Map, Sensor]
        RobotWS[WebSocket Telemetry<br/>/ws/telemetry]
    end

    User --> Pages
    Pages --> Components
    Pages --> ApiService
    Pages --> Hooks
    ApiService --> AuthUtils

    ApiService -->|HTTP Requests| ExpressApp
    Hooks -->|WebSocket| RobotWS

    ExpressApp --> AuthModule
    ExpressApp --> UserModule
    ExpressApp --> RobotModule
    ExpressApp --> AuditModule
    ExpressApp --> Middleware

    AuthModule --> MongoDB
    UserModule --> MongoDB
    AuditModule --> MongoDB

    RobotModule -->|HTTP Requests| RobotREST
    RobotModule --> AuditModule
