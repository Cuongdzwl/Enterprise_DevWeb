import FileService from '../../services/files.service';
import { Request, Response } from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import { ISuperController } from 'server/api/interfaces/ISuperController.interface';
import filesService from '../../services/files.service';

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
  async download(req: Request, res: Response): Promise<void>{
    const id = Number.parseInt(req.params.id);
    const file = await FileService.byId(id);
    FileService.downloadBlobToFile(file).then((zipContent) => {
        if (zipContent) {
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="download.zip"');
            res.send(zipContent);
        } else {
            res.status(404).send('File not found or failed to create zip');
        }
    }).catch(error => {
        console.error(error);
        res.status(500).send('Server error');
    });
  }

  async create(req: Request, res: Response): Promise<void> { 
    try {

      const file = req.file;
      console.log(req.file)
      const { ContributionID } = req.body; 
      const contributionIDNumber = parseInt(ContributionID, 10);
      if (!file || !ContributionID) {
        res.status(400).send("Missing file or ContributionID");
        return;
      }
      const savedFile = await filesService.createfile(file, contributionIDNumber);

      res.status(201).json(savedFile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file.');
    }
  }
}
export default new FilesController();
