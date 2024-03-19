import FileService from '../../services/files.service';
import { Request, Response } from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
export class FilesController {
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
  byContributionId(req: Request, res: Response): void {

  }

  create(req: Request, res: Response): void {

    
    FileService.create(req.body).then((r) =>
      res.status(201).location(`/api/v1/examples/${r.id}`).json(r)
    );
  }
  update(req: Request, res: Response): void {}
  delete(){}

}
export default new FilesController();
