import { NextFunction, Request, Response } from "express";
import RequestHandler from "./RequestHandler";
import { body, matchedData, validationResult } from "express-validator";

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
            [
              body("competences")
                .isArray({ min: 1 })
                .withMessage("At least one competence is required"),

              body("competences.*.competence_id")
                .isInt()
                .withMessage("Competence ID must be an integer"),

              body("competences.*.years_of_experience")
                .isNumeric()
                .withMessage("Years of experience must be numeric"),

              body("availability")
                .isArray({ min: 1 })
                .withMessage("At least one availability period is required"),

              body("availability.*.from_date")
                .isISO8601()
                .withMessage("Date must have ISO8601 format"),

              body("availability.*.to_date")
                .isISO8601()
                .withMessage("Date must have ISO8601 format"),

              body("userId")
                .exists({ checkFalsy: true })
                .isInt({ min: 1 })
                .toInt()
                .withMessage("userId must be a positive integer"),
            ],
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        this.sendHttpResponse(res, 400, errors.array());
                    }

                    const applicationId = await this.controller?.createApplication(req.body); // might use applicationId in the future
                    this.sendHttpResponse(res, 201, "Application submitted successfully");
                } catch (error) {
                    next(error); 
                }
            }
        );
      } catch (error) {
          console.error("Something went wrong in application api", error) // TODO: Change when logger is implemented
      }
    }
}

export default ApplicationApi;