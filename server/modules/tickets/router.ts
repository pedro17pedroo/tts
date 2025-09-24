import { Router } from "express";
import { TicketsController } from "./controller";
import { isAuthenticated } from "../../auth";

const router = Router();
const ticketsController = new TicketsController();

// Get tickets with filters
router.get('/', isAuthenticated, (req: any, res) =>
  ticketsController.getTickets(req, res)
);

// Create ticket
router.post('/', isAuthenticated, (req: any, res) =>
  ticketsController.createTicket(req, res)
);

// Get single ticket with details
router.get('/:id', isAuthenticated, (req: any, res) =>
  ticketsController.getTicketById(req, res)
);

// Update ticket
router.patch('/:id', isAuthenticated, (req: any, res) =>
  ticketsController.updateTicket(req, res)
);

// Add comment to ticket
router.post('/:id/comments', isAuthenticated, (req: any, res) =>
  ticketsController.createTicketComment(req, res)
);

export { router as ticketsModule };