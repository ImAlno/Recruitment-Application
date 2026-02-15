import { Request, Response, NextFunction } from "express";
import RequestHandler from "./RequestHandler";

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
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const applications = await this.controller?.getAllApplications();

            if (!applications) {
              this.sendHttpResponse(res, 400, "No applicaitons found");
            }
            this.sendHttpResponse(res, 200, applications);
          } catch (error) {
            console.error("Error fetching applications", error);
            this.sendHttpResponse(res, 500, "Internal Server Error");
          }
        },
      );

      // getApplicationById

      this.router.get(
        "/:id",
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const { id } = req.params;

            if (!id) {
              this.sendHttpResponse(res, 400, "Invalid application ID");
            }
            const applicationId = Number(id);
            const application =
              await this.controller?.getApplicationById(applicationId);

            if (!application) {
              this.sendHttpResponse(res, 404, "Application not found");
            }
            this.sendHttpResponse(res, 200, application);
          } catch (error) {
            console.error("Error fetching application: ", error);
            this.sendHttpResponse(res, 500, "Internal Server Error");
          }
        },
      );
    } catch (error) {
      console.error("Controller initialization failed", error);
    }
  }
}

export default AdminApplicationApi;
