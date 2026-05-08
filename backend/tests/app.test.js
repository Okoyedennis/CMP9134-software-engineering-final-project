import { jest } from "@jest/globals";
import request from "supertest";

// Mock ALL external modules BEFORE importing app
jest.unstable_mockModule("mongoose", () => ({
  default: {
    connect: jest.fn().mockResolvedValue({}),
    connection: { on: jest.fn(), once: jest.fn() },
    model: jest.fn(),
    Schema: jest.fn(),
  },
  connect: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn().mockResolvedValue("hashedpassword123"),
    compare: jest.fn().mockResolvedValue(true),
    genSalt: jest.fn().mockResolvedValue("salt"),
  },
  hash: jest.fn().mockResolvedValue("hashedpassword123"),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/MissionLog.js", () => ({
  default: {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
    countDocuments: jest.fn().mockResolvedValue(0),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("../utils/logMissionEvent.js", () => ({
  logMissionEvent: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule("../routes/RobotFacade.js", () => ({
  default: {
    getStatus: jest.fn().mockResolvedValue({ success: true, data: {} }),
    moveRobot: jest.fn().mockResolvedValue({ success: true }),
    resetRobot: jest.fn().mockResolvedValue({ success: true }),
    mapRobot: jest.fn().mockResolvedValue({ success: true, data: {} }),
    sensorRobot: jest.fn().mockResolvedValue({ success: true, data: {} }),
  },
}));

jest.unstable_mockModule("../middleware/authMiddleware.js", () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { userId: "123", email: "test@test.com" };
    next();
  }),
}));

const app = (await import("../app.js")).default;
const User = (await import("../models/User.js")).default;

describe("Authentication Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/signup", () => {
    test("creates a new user successfully", async () => {
      const newUser = {
        forename: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: "123456789",
        forename: "John Doe",
        email: "john@example.com",
        role: "VIEWER",
      });

      const response = await request(app).post("/auth/signup").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Account created successfully");
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    test("returns 400 if missing required fields", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({ email: "john@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Forename, email, and password are required",
      );
    });

    test("returns 409 if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "john@example.com" });

      const response = await request(app).post("/auth/signup").send({
        forename: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /auth/signin", () => {
    test("signs in user successfully", async () => {
      const credentials = {
        email: "john@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "123456789",
        forename: "John Doe",
        email: "john@example.com",
        role: "VIEWER",
        password: "hashedpassword",
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/auth/signin")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Signed in successfully");
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    test("returns 400 if missing email or password", async () => {
      const response = await request(app)
        .post("/auth/signin")
        .send({ email: "john@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email and password are required");
    });

    test("returns 401 for invalid credentials (user not found)", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/auth/signin").send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });

  describe("POST /auth/signout", () => {
    test("signs out user successfully", async () => {
      const response = await request(app).post("/auth/signout");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Signed out successfully");
    });
  });

  describe("GET /", () => {
    test("returns hello world message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Hello world",
      });
    });
  });
});
