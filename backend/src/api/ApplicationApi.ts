import { NextFunction, Request, Response } from "express";
import RequestHandler from "./RequestHandler";
import { body, validationResult } from "express-validator";
import { Authorization } from "./Authorization";
import { Validator } from "../util/Validator";

class ApplicationApi extends RequestHandler {
  /**
  * Constructs a new instance.
  */
  constructor() {
    super();
  }

  // TODO: JSdoc comment
  get path(): string {
    return ApplicationApi.API_PATH;
  }

  // TODO: JSdoc comment
  static get API_PATH(): string {
    return "/application";
  }

  async registerHandler(): Promise<void> {
    try {
      await this.retrieveController();

      this.router.post(
        "/submit",
        Authorization.requireAuth(this.controller!),
        Authorization.requireRole("applicant"),
        [
          body("competences")
            .isArray({ min: 1 })
            .withMessage("At least one competence is required"),

          body("competences.*.competence_id")
            .custom((value) => Validator.isInt(value, 1))
            .withMessage("Competence ID must be a positive integer"),

          body("competences.*.years_of_experience")
            .custom((value) => Validator.isYearsOfExperience(value))
            .withMessage("Years of experience must be a valid number of years"),

          body("availability")
            .isArray({ min: 1 })
            .bail()
            .custom((value) => {
              for (const period of value) {
                if (!Validator.isValidAvailability(period)) {
                  return false;
                }
              }
              return true;
            })
            .withMessage("At least one availability period is required with valid format"),

          body("userId")
            .custom((value) => Validator.isInt(value, 1))
            .withMessage("userId must be a positive integer"),
        ],
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendHttpResponse(res, 400, errors.array());
              return;
            }

            const loggedInUserId = (req as any).user.id;
            const submissionData = {
              ...req.body,
              userId: loggedInUserId
            };

            const applicationId = await this.controller?.createApplication(submissionData); // might use applicationId in the future
            this.sendHttpResponse(res, 201, "Application submitted successfully");
          } catch (error) {
            next(error);
          }
        }
      );
    } catch (error) {
      this.logger.logError(error);
    }
  }
}

export default ApplicationApi;