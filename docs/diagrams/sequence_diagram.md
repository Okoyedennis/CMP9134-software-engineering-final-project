sequenceDiagram
actor User
participant Frontend as React Frontend
participant Auth as Auth Utils
participant Backend as Express Backend
participant Middleware as Auth Middleware
participant Robot as Robot API
participant DB as MongoDB Audit Log
participant WS as WebSocket Telemetry

    User->>Frontend: Enter X and Y coordinates
    User->>Frontend: Click Move Robot

    Frontend->>Auth: Get JWT token
    Auth-->>Frontend: Return token

    Frontend->>Backend: POST /api/robot/move with token and coordinates
    Backend->>Middleware: Verify JWT and user role

    alt User is not Commander
        Middleware-->>Backend: Reject request
        Backend-->>Frontend: 403 Forbidden
        Frontend-->>User: Show permission error
    else User is Commander
        Middleware-->>Backend: Allow request
        Backend->>Robot: GET /api/status
        Robot-->>Backend: Return status before move

        Backend->>Robot: POST /api/move
        Robot-->>Backend: Return move result

        Backend->>Robot: GET /api/status
        Robot-->>Backend: Return status after move

        Backend->>DB: Save audit log
        DB-->>Backend: Log saved

        Backend-->>Frontend: Move successful
        Robot-->>WS: Send updated telemetry
        WS-->>Frontend: Push live robot update
        Frontend-->>User: Update dashboard position/status
    end
