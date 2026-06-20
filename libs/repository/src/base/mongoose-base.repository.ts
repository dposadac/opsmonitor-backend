import { ClientSession, FilterQuery, Model } from 'mongoose';
import { IBaseRepository } from './base-repository.interface';

/**
 * Abstract base repository for Mongoose-backed aggregates.
 * Maps documents (`TDocument`) to domain aggregates (`TDomain`) via the
 * abstract `toDomain` / `toPersistence` hooks.
 */
export abstract class MongooseBaseRepository<TDocument, TDomain = TDocument>
  implements IBaseRepository<TDomain>
{
  protected constructor(protected readonly model: Model<TDocument>) {}

  protected abstract toDomain(doc: Record<string, any>): TDomain;
  protected abstract toPersistence(domain: Partial<TDomain>): Record<string, unknown>;

  async create(domain: Partial<TDomain>, session?: ClientSession): Promise<TDomain> {
    const [created] = await this.model.create([this.toPersistence(domain)], {
      session,
    });
    return this.toDomain(created.toObject());
  }

  async findById(id: string): Promise<TDomain | null> {
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<TDomain[]> {
    const docs = await this.model
      .find(filter as FilterQuery<TDocument>)
      .lean()
      .exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async update(id: string, partial: Partial<TDomain>): Promise<TDomain | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, this.toPersistence(partial), { new: true })
      .lean()
      .exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
