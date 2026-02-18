import { Request, Response, NextFunction } from "express";
import RequestHandler from "./RequestHandler";
import { param, validationResult } from "express-validator";
import { Authorization } from "./Authorization";

class AdminApplicationApi extends RequestHandler {
  constructor() {
    super();
  }

  get path(): string {
    return AdminApplicationApi.API_PATH;
  }

  static get API_PATH(): string {
    return "/admin/applications";
  }

  async registerHandler(): Promise<void> {
    try {
      await this.retrieveController();

      this.router.get(
        "/",
        Authorization.requireAuth(this.controller!),
        Authorization.requireRole("recruiter"),
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const applications = await this.controller?.getAllApplications();

            if (applications?.length === 0) {
              this.sendHttpResponse(res, 404, "No applicaitons found");
            }
            this.sendHttpResponse(res, 200, applications);
          } catch (error) {
            next(error);
          }
        },
      );

      // getApplicationById

      this.router.get(
        "/:id",
        Authorization.requireAuth(this.controller!),
        Authorization.requireRole("recruiter"),
        [
          param("id")
            .isNumeric()
            .withMessage("Field: id (numeric) required")
        ],
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                this.sendHttpResponse(res, 400, errors.array());
                return;
            }
            const { id } = req.params;
            const application = await this.controller?.getApplicationById(Number(id));
            this.sendHttpResponse(res, 200, application);
          } catch (error) {
            next(error);
          }
        },
      );
    } catch (error) {
      this.logger.logError(error);
    }
  }
}

export default AdminApplicationApi;
