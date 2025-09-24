import { type Express } from "express";
import { authModule } from "../modules/auth/router";
import { tenantsModule } from "../modules/tenants/router";
import { customersModule } from "../modules/customers/router";
import { ticketsModule } from "../modules/tickets/router";
import { hourBankModule } from "../modules/hour-bank/router";
import { knowledgeBaseModule } from "../modules/knowledge-base/router";
import { departmentsModule, categoriesModule } from "../modules/departments/router";
import { dashboardModule } from "../modules/dashboard/router";

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
  {
    name: "customers",
    router: customersModule,
    basePath: "/api/customers",
  },
  {
    name: "tickets",
    router: ticketsModule,
    basePath: "/api/tickets",
  },
  {
    name: "hour-banks",
    router: hourBankModule,
    basePath: "/api/hour-banks",
  },
  {
    name: "articles",
    router: knowledgeBaseModule,
    basePath: "/api/articles",
  },
  {
    name: "departments",
    router: departmentsModule,
    basePath: "/api/departments",
  },
  {
    name: "categories",
    router: categoriesModule,
    basePath: "/api/categories",
  },
  {
    name: "dashboard",
    router: dashboardModule,
    basePath: "/api/dashboard",
  },
];

export function registerModules(app: Express): void {
  modules.forEach((module) => {
    app.use(module.basePath, module.router);
    console.log(`Registered module: ${module.name} at ${module.basePath}`);
  });
}