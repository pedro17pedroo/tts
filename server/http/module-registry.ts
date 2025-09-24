import { type Express } from "express";
import { authModule } from "../modules/auth/router";
import { tenantsModule } from "../modules/tenants/router";

export interface Module {
  name: string;
  router: any;
  basePath: string;
}

const modules: Module[] = [
  {
    name: "auth",
    router: authModule,
    basePath: "/api/auth",
  },
  {
    name: "tenants",
    router: tenantsModule,
    basePath: "/api",
  },
];

export function registerModules(app: Express): void {
  modules.forEach((module) => {
    app.use(module.basePath, module.router);
    console.log(`Registered module: ${module.name} at ${module.basePath}`);
  });
}