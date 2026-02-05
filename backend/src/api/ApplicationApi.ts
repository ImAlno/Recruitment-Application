import { NextFunction, Request, Response } from "express";
import RequestHandler from "./RequestHandler";
import { body, matchedData, validationResult } from "express-validator";
import Controller from "../controller/Controller";

class ApplicationApi extends RequestHandler {
  protected controller: Controller;

  constructor() {
    super();
    this.controller = new Controller();
  }

  static get API_PATH(): string {
    return "/applications";
  }

  get path(): string {
    return ApplicationApi.API_PATH;
  }

  async registerHandler(): Promise<void> {
    await this.retrieveController();

    this.router.post(
      "/",
      [
        body("competences")
          .isArray({ min: 1 })
          .withMessage("At least one competence is required"),

        body("competences.*.competence_id")
          .isInt()
          .withMessage("Competence ID must be an integer"),

        body("competences.*.years_of_experience")
          .isInt({ min: 0, max: 50 })
          .withMessage("Years of experience must be between 0 and 50"),

        body("availability")
          .isArray({ min: 1 })
          .withMessage("At least one availability period is required"),

        body("availability.*.from_date").isISO8601(),
        body("availability.*.to_date").isISO8601(),
      ],
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          console.log(errors)
          if (!errors.isEmpty()) {
            return this.sendHttpResponse(res, 400, { errors: errors.array() });
          }
          const data = matchedData(req)
          console.log(data)
         // const applicantId = (req as any).user.userId; // from auth middleware
         const applicantId = 2
          const applicationId =
            await this.controller.createApplication(applicantId, req.body);
         
          this.sendHttpResponse(res, 201, {
            message: "Application submitted successfully",
          });
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export default ApplicationApi;