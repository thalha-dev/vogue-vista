const supertest = require("supertest");
const app = require("../../app.js");

const UserModel = require("../../models/User.js");

describe("User Controllers", () => {
  describe("singup route", () => {
    describe("Action: create a new user", () => {
      it("Scenario: should return 201 status code and _id, username, email, password properties should be present in the body", async () => {
        const response = await supertest(app)
          .post("/api/users/signup")
          .set("content-type", "application/json")
          .send({
            username: "user1",
            email: "user1@gmail.com",
            role: 8822,
            password: "asAS12!@",
          });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("password");
      });

      it("Scenario: due to missing username it should return 400 status code and error message", async () => {
        const response = await supertest(app)
          .post("/api/users/signup")
          .set("content-type", "application/json")
          .send({
            email: "user1@gmail.com",
            role: 8822,
            password: "asAS12!@",
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Required fields are missing");
      });

      it("Scenario: due to missing email it should return 400 status code and error message", async () => {
        const response = await supertest(app)
          .post("/api/users/signup")
          .set("content-type", "application/json")
          .send({
            username: "user1",
            role: 8822,
            password: "asAS12!@",
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Required fields are missing");
      });

      it("Scenario: should return 409 status code and error message due to providing existing email", async () => {
        await UserModel.create({
          username: "user1",
          email: "user1@gmail.com",
          role: 8822,
          password: "asAS12!@",
        });

        const response = await supertest(app)
          .post("/api/users/signup")
          .set("content-type", "application/json")
          .send({
            username: "user2",
            email: "user1@gmail.com",
            role: 8822,
            password: "asAS1234!@",
          });

        expect(response.status).toBe(409);
        expect(response.body.error).toBe(
          "Email already exist. Please choose another one or login instead",
        );
      });

      it("Scenario: due to missing password it should return 400 status code and error message", async () => {
        const response = await supertest(app)
          .post("/api/users/signup")
          .set("content-type", "application/json")
          .send({
            username: "user1",
            email: "user1@gmail.com",
            role: 8822,
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Required fields are missing");
      });
    });
  });
});
