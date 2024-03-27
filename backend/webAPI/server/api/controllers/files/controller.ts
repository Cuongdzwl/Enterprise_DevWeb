import FileService from '../../services/files.service';
import { Request, Response } from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import { ISuperController } from 'server/api/interfaces/ISuperController.interface';

export class FilesController implements ISuperController {
  update(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    FileService.update(id, req.body).then((r) =>
      res.status(201).location(`/api/v1/files/${r.id}`).json(r)
    );
  }
  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    FileService.delete(id).then((r) => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }
  async all(_: Request, res: Response): Promise<void> {
    const result = await FileService.all();
    res.json(result);
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    FileService.byId(id).then((r) => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  async create(req: Request, res: Response): Promise<void> { 
    try {
      console.log(req.body);
      FileService.create(req.body).then((r) =>
        res.status(201).location(`/api/v1/users/${r.id}`).json(r));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading the file.');
    }
  }
}
export default new FilesController();
