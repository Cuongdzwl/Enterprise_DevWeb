import { Request, Response } from 'express';
import EventService from '../../services/event.service';

export class EventController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, closureDate, finalDate, facultyId } = req.body;
      const event = await EventService.createEvent(name, description, closureDate, finalDate, facultyId);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }

  async all(req: Request, res: Response): Promise<void> {
    try {
      const events = await EventService.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({ error: 'Failed to get events' });
    }
  }

  async byId(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const event = await EventService.getEventById(eventId);
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      console.error('Error getting event by ID:', error);
      res.status(500).json({ error: 'Failed to get event' });
    }
  }
}

export default new EventController();
