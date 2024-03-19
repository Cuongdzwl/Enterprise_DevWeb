// import { Request, Response } from 'express';
// import EventService from '../../services/events.service';
// import { ISuperController } from 'server/api/interfaces/ISuperController.interface';

// export class EventsController implements ISuperController {
//   async create(req: Request, res: Response): Promise<void> {
//     try {
//       const { name, description, closureDate, finalDate, facultyId } = req.body;
//       const event = await EventService.create(name, description, closureDate, finalDate, facultyId);
//       res.status(201).json(event);
//     } catch (error) {
//       console.error('Error creating event:', error);
//       res.status(500).json({ error: 'Failed to create event' });
//     }
//   }

//   async all(_: Request, res: Response): Promise<void> {
//     try {
//       const events = await EventService.all();
//       res.json(events);
//     } catch (error) {
//       console.error('Error getting events:', error);
//       res.status(500).json({ error: 'Failed to get events' });
//     }
//   }

//   async byId(req: Request, res: Response): Promise<void> {
//     try {
//       const eventId = Number(req.params.id);
//       const event = await EventService.byId(eventId);
//       if (event) {
//         res.json(event);
//       } else {
//         res.status(404).json({ error: 'Event not found' });
//       }
//     } catch (error) {
//       console.error('Error getting event by ID:', error);
//       res.status(500).json({ error: 'Failed to get event' });
//     }
//   }
//   async update(req:Request, res:Response) {
//     try {
//       const { name, description, closureDate, finalDate, facultyId } = req.body;
//       const eventId = Number(req.params.id);
//       const event = await EventService.update(eventId, name, description, closureDate, finalDate, facultyId);
//       res.json(event);
//     } catch (error) {
//       console.error('Error updating event:', error);
//       res.status(500).json({ error: 'Failed to update event' });
//     }
//   }

//   async delete(req:Request, res:Response) {
//     try {
//       const eventId = Number(req.params.id);
//       await EventService.delete(eventId);
//       res.status(204).send();
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       res.status(500).json({ error: 'Failed to delete event' });
//     }
//   }
// }

// export default new EventsController();