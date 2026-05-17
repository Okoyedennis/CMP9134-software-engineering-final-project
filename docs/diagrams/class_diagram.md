classDiagram
class User {
+String \_id
+String forename
+String email
+String role
+String password
+Date createdAt
+Date updatedAt
}

    class MissionLog {
        +ObjectId userId
        +String userEmail
        +String userForename
        +String role
        +String commandType
        +Object commandPayload
        +Object statusBefore
        +Object statusAfter
        +Boolean success
        +String errorMessage
        +String source
        +Date createdAt
        +Date updatedAt
    }

    class AuthRoutes {
        +signup(req, res)
        +signin(req, res)
        +signout(req, res)
    }

    class AuthMiddleware {
        +verifyToken(req, res, next)
    }

    class RobotAPI {
        -String apiEndpoint
        -String token
        +handleResponse(response, endpointName)
        +getStatus()
        +moveRobot(x, y)
        +resetRobot()
        +mapRobot()
        +sensorRobot()
    }

    class RobotFacade {
        +moveRobot(x, y)
        +getStatus()
        +resetRobot()
        +mapRobot()
        +sensorRobot()
    }

    class MissionLogger {
        +logMissionEvent(data)
    }

    class ExpressApp {
        +GET /
        +POST /auth/signup
        +POST /auth/signin
        +POST /auth/signout
        +POST /move
        +POST /reset
        +GET /status
        +GET /map
        +GET /sensor
        +GET /logs
        +GET /users
        +PATCH /users/:id/role
    }

    class FrontendApp {
        +Dashboard
        +SignIn
        +SignUp
        +Logs
        +Users
        +LidarSummary
    }

    class Dashboard {
        +displayRobotStatus()
        +displayRobotMap()
        +sendMoveCommand()
        +resetRobot()
    }

    class LidarSummary {
        +displaySensorData()
        +displayLidarSummary()
    }

    class AxiosServices {
        +authApi
        +robotApi
        +axiosConfig
    }

    class TelemetryHook {
        +useTelemetry()
        +connectWebSocket()
        +updateTelemetry()
    }

    FrontendApp --> Dashboard
    FrontendApp --> LidarSummary
    FrontendApp --> AxiosServices
    FrontendApp --> TelemetryHook

    AxiosServices --> ExpressApp : HTTP requests
    TelemetryHook --> RobotAPI : WebSocket telemetry

    ExpressApp --> AuthRoutes
    ExpressApp --> AuthMiddleware
    ExpressApp --> RobotFacade
    ExpressApp --> MissionLogger

    AuthRoutes --> User : creates/authenticates
    AuthMiddleware --> User : validates JWT user
    RobotFacade --> RobotAPI : wraps API calls
    MissionLogger --> MissionLog : creates audit log

    MissionLog --> User : references userId
