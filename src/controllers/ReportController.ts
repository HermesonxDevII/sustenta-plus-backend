import { Request, Response } from 'express';
import { Report } from '../models/Report';
import { ReportPhoto } from '../models/ReportPhoto';
import sequelize from '../config/database';
import { Status, User } from '../models';

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
          },
          {
            model: User,
            as: 'user',
            attributes: ['name', 'CPF', 'email', 'phone']
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

  async store(req: Request, res: Response): Promise<Response> {
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

  async update(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const {
          title,
          description,
          street,
          number,
          neighborhood,
          postal_code,
      } = req.body;

      const report = await Report.findByPk(id);

      if (!report) {
        return res
          .status(404)
          .json({
            error: 'Reporte não encontrado.'
          });
      }

      const updateData: { [key: string]: any } = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (street !== undefined) updateData.street = street;
      if (number !== undefined) updateData.number = number;
      if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
      if (postal_code !== undefined) updateData.postal_code = postal_code;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: 'Nenhum dado válido fornecido para atualização.'
        });
      }

      await report.update(updateData, { transaction });

      await transaction.commit();

      return res.status(200).json({
          message: 'Reporte atualizado com sucesso!'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao atualizar o reporte:', error);
      return res
        .status(500)
        .json({
            error: 'Falha ao atualizar o reporte.'
        });
    }
  }

  async accept(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const APPROVED_STATUS_ID = 2;

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Reporte não encontrado.'
        });
      }

      if (report.status_id === APPROVED_STATUS_ID) {
        return res.status(200).json({
          message: 'Esse reporte já foi aceito.'
        });
      }

      await report.update({
        status_id: APPROVED_STATUS_ID
      }, { transaction });

      await transaction.commit();

      return res.status(200).json({
        message: 'Reporte aceito com sucesso!'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao aceitar o reporte:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao aceitar o reporte.'
        });
    }
  }

  async refuse(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const APPROVED_STATUS_ID = 4;

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Reporte não encontrado.'
        });
      }

      if (report.status_id === APPROVED_STATUS_ID) {
        return res.status(200).json({
          message: 'Esse reporte já foi recusado.'
        });
      }

      await report.update({
        status_id: APPROVED_STATUS_ID
      }, { transaction });

      await transaction.commit();

      return res.status(200).json({
        message: 'Reporte recusado com sucesso!'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao recusar o reporte:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao recusar o reporte.'
        });
    }
  }

  async destroy(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Reporte não encontrado.'
        });
      }

      await report.destroy({ transaction });

      await transaction.commit();

      return res.status(200).json({
        message: 'Reporte deletado com sucesso!'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao deletar o reporte:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao deletar o reporte.'
        });
    }
  }
}

export default new ReportController();
