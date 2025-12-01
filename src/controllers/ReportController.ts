import { Request, Response } from 'express';
import { Report } from '../models/Report';
import { ReportPhoto } from '../models/ReportPhoto';
import sequelize from '../config/database';
import { Status } from '../models';

const DEFAULT_LIMIT = 10;

class ReportController {

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { id, ability } = req.user;

      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || String(DEFAULT_LIMIT));

      const offset = (page - 1) * limit;

      let result;

      const options = {
        limit: limit,
        offset: offset,
        include: [
          {
            model: ReportPhoto,
            as: 'photos',
            attributes: ['path']
          },
          {
            model: Status,
            as: 'status',
            attributes: ['name']
          }
      ],
        order: [['createdAt', 'DESC']] as [string, string][]
      };

      if (ability === 'user') {
        const userOptions = {
          ...options,
          where: { user_id: id }
        };
        result = await Report.findAndCountAll(userOptions);
      } else {
        result = await Report.findAndCountAll(options);
      }

      const totalPages = Math.ceil(result.count / limit);
      
      return res
        .status(200)
        .json({
          reports: result.rows,
          // Informações adicionais para o frontend
          totalItems: result.count,
          totalPages: totalPages,
          currentPage: page,
          itemsPerPage: limit,
        });

    } catch (error) {
      console.error('Erro ao listar os reportes:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao buscar a lista de reportes.'
        });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id: user_id } = req.user;
      const {
        title,
        description,
        street,
        number,
        neighborhood,
        postal_code
      } = req.body;

      const uploadedFiles = req.files as Express.Multer.File[];

      const newReport = await Report.create({
        user_id,
        title,
        description,
        street,
        number,
        neighborhood,
        postal_code,
        status_id: 1,
      }, { transaction });

      if (uploadedFiles && uploadedFiles.length > 0) {
        console.log(1)
        const photosData = uploadedFiles.map(file => ({
          report_id: newReport.id,
          path: file.filename,
        }));

        await ReportPhoto.bulkCreate(photosData, { transaction });
      }

      await transaction.commit();

      return res.status(201).json({
        message: 'Reporte criado com sucesso!'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao criar o reporte:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao criar o reporte.'
        });
    }
  }
}

export default new ReportController();
