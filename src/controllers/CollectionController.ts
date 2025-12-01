import { Request, Response } from 'express';
import { Collection } from '../models/Collection';
import { CollectionPhoto } from '../models/CollectionPhoto';
import { Status, UserCollection } from '../models';
import { User } from '../models/User';
import sequelize from '../config/database';
import { Op } from 'sequelize';

const DEFAULT_LIMIT = 10;

class CollectionController {

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
            model: CollectionPhoto,
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
            as: 'usersInteracting',
            attributes: ['name', 'CPF', 'email', 'phone'],
            through: { attributes: [] }
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
      result = await Collection.findAndCountAll(userOptions);
    } else {
      result = await Collection.findAndCountAll(options);
    }

    const totalPages = Math.ceil(result.count / limit);

    return res
      .status(200)
      .json({
        collections: result.rows,
        totalItems: result.count,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      });

    } catch (error) {
      console.error('Erro ao listar as solicitações de coleta:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao buscar a lista de solicitações de coleta.'
        });
    }
  }

  async myCollections(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.user;

      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || String(DEFAULT_LIMIT));
      const offset = (page - 1) * limit;

      const acceptedCollections = await UserCollection.findAll({
        attributes: ['collection_id'],
        where: {
          user_id: id
        },
        raw: true
      });

      const collectionIds = acceptedCollections.map(item => item.collection_id);

      if (collectionIds.length === 0) {
        return res.status(200).json({
          collections: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          itemsPerPage: limit,
        });
      }

      const options = {
        limit: limit,
        offset: offset,
        where: {
          id: { [Op.in]: collectionIds }
        },
        include: [
          {
            model: CollectionPhoto,
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

      const collections = await Collection.findAndCountAll(options);

      const totalPages = Math.ceil(collections.count / limit);

      return res
        .status(200)
        .json({
          collections: collections.rows,
          totalItems: collections.count,
          totalPages: totalPages,
          currentPage: page,
          itemsPerPage: limit,
        });
    } catch (error) {
      console.error('Erro ao listar as coleções aceitas:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao buscar a lista de coleções aceitas.'
        });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id: user_id } = req.user;
      const {
          street,
          number,
          neighborhood,
          postal_code
      } = req.body;

      const uploadedFiles = req.files as Express.Multer.File[];

      const newCollection = await Collection.create({
          user_id,
          street,
          number,
          neighborhood,
          postal_code,
          status_id: 1,
      }, { transaction });

      if (uploadedFiles && uploadedFiles.length > 0) {
        const photosData = uploadedFiles.map(file => ({
          collection_id: newCollection.id,
          path: file.filename,
        }));

        await CollectionPhoto.bulkCreate(photosData, { transaction });
      }

      await transaction.commit();

      return res.status(201).json({
        message: 'Solicitação de coleta criada com sucesso!',
        collectionId: newCollection.id
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao criar a solicitação de coleta:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao criar a solicitação de coleta.'
        });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const {
          street,
          number,
          neighborhood,
          postal_code,
      } = req.body;

      const collection = await Collection.findByPk(id);

      if (!collection) {
        return res.status(404).json({
          error: 'Solicitação de coleta não encontrada.'
        });
      }

      const updateData: { [key: string]: any } = {};
      if (street !== undefined) updateData.street = street;
      if (number !== undefined) updateData.number = number;
      if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
      if (postal_code !== undefined) updateData.postal_code = postal_code;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: 'Nenhum dado válido fornecido para atualização.'
        });
      }

      await collection.update(updateData, { transaction });

      await transaction.commit();

      return res.status(200).json({
        message: 'Solicitação de coleta atualizada com sucesso!',
        collection: collection
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao atualizar a solicitação de coleta:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao atualizar a solicitação de coleta.'
        });
    }
  }

  async accept(req: Request, res: Response): Promise<Response> {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { id: collector_user_id } = req.user;

      const APPROVED_STATUS_ID = 2;

      const collection = await Collection.findByPk(id, { transaction });

      if (!collection) {
        return res.status(404).json({
          error: 'Agendamento não encontrado.'
        });
      }

      if (collection.status_id === APPROVED_STATUS_ID) {
        return res.status(200).json({
          message: 'Esse agendamento já foi aceito.'
        });
      }

      await collection.update({
        status_id: APPROVED_STATUS_ID
      }, { transaction });

      await UserCollection.create({
        user_id: collector_user_id,
        collection_id: collection?.dataValues.id,
        status_id: APPROVED_STATUS_ID,
      }, { transaction });

      await transaction.commit();

      return res.status(200).json({
        message: 'Agendamento de coleta aceito com sucesso!'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao aceitar o agendamento:', error);
      return res
        .status(500)
        .json({
          error: 'Falha ao aceitar o agendamento de pedido.'
        });
    }
  }
}

export default new CollectionController();
