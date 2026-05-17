flowchart TD
A([Start]) --> B[User opens GCS app]
B --> C{Is user authenticated?}

    C -- No --> D[Show Sign In / Sign Up page]
    D --> E[User submits credentials]
    E --> F{Credentials valid?}

    F -- No --> G[Show authentication error]
    G --> D

    F -- Yes --> H[Save JWT and user data]
    H --> I[Redirect to Dashboard]

    C -- Yes --> I[Load Dashboard]

    I --> J[Fetch robot status]
    J --> K[Fetch map data]
    K --> L[Connect to WebSocket telemetry]
    L --> M[Display dashboard data]

    M --> N{User action}

    N -- View map/status --> O[Update dashboard display]
    O --> M

    N -- View sensors/LiDAR --> P[Fetch sensor data]
    P --> Q[Show sensor cards and LiDAR summary]
    Q --> M

    N -- Move robot --> R{Is user Commander?}
    R -- No --> S[Block command and show permission error]
    S --> M

    R -- Yes --> T[Enter target X and Y coordinates]
    T --> U[Send move command to backend]
    U --> V[Backend forwards command to Robot API]
    V --> W{Command successful?}

    W -- No --> X[Show error message]
    X --> Y[Create failed audit log]
    Y --> M

    W -- Yes --> Z[Robot moves]
    Z --> AA[Telemetry updates dashboard]
    AA --> AB[Create successful audit log]
    AB --> M

    N -- Reset robot --> AC{Is user Commander?}
    AC -- No --> AD[Block reset and show permission error]
    AD --> M

    AC -- Yes --> AE[Send reset command]
    AE --> AF[Backend forwards reset to Robot API]
    AF --> AG[Create audit log]
    AG --> AH[Refresh robot status and map]
    AH --> M

    N -- View audit logs --> AI[Fetch paginated logs]
    AI --> AJ[Display logs table]
    AJ --> M

    N -- Manage users --> AK{Has role permission?}
    AK -- No --> AL[Show access denied]
    AL --> M

    AK -- Yes --> AM[Fetch users]
    AM --> AN[Update user role]
    AN --> AO[Create role update audit log]
    AO --> M

    N -- Sign out --> AP[Clear JWT and user data]
    AP --> AQ[Redirect to Sign In]
    AQ --> D
