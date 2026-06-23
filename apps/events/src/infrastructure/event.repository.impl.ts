import { MongooseBaseRepository } from "@app/repository/base/mongoose-base.repository";
import { EVENT_MODEL_NAME, EventSchemaClass } from "@app/repository/entities/mongoose/event.schema";
import { Injectable } from "@nestjs/common";
import { EventMonitor } from "../domain/event.entity";
import { EventListFilters, IEventRepository } from "../domain/event.repository";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { EventMapper } from "./event.mapper";
import {
    buildPaginationMeta,
    EventQueryFilters,
    normalizeLimit,
    normalizePage,
    PaginatedResult,
} from "@app/repository";
import { UpdateEventDto } from "../presentation/dto/update-event.dto";
import { EventSeverity } from "../domain/value-objects/event-severity.vo";

@Injectable()
export class EventRepositoryImpl
    extends MongooseBaseRepository<EventSchemaClass, EventMonitor>
    implements IEventRepository
{
    constructor(
        @InjectModel(EVENT_MODEL_NAME)
        private readonly incidentModel: Model<EventSchemaClass>,
    ) {
        super(incidentModel);
    }

    protected toDomain(doc: Record<string, any>): EventMonitor {
        return EventMapper.toDomain(doc);
    }

    protected toPersistence(domain: Partial<EventMonitor>): Record<string, unknown> {
        return EventMapper.toPersistence(domain);
    }

    save(event: EventMonitor): Promise<EventMonitor> {
        return this.create(event);
    }

    async findByStatus(status: string): Promise<EventMonitor[]> {
        return this.findAll({ status });
    }

    remove(id: string): Promise<boolean> {
        return this.delete(id);
    }

    async updateEvent(id: string, dto: UpdateEventDto): Promise<EventMonitor | null> {
        const partial: Partial<EventMonitor> = {};
        if (dto.originApplication !== undefined) partial.originApplication = dto.originApplication;
        if (dto.eventType !== undefined) partial.eventType = dto.eventType;
        if (dto.severity !== undefined) partial.severity = EventSeverity.of(dto.severity);
        if (dto.description !== undefined) partial.description = dto.description;
        if (dto.ocurredDate !== undefined) partial.occurredAt = dto.ocurredDate;

        const update = {
            ...EventMapper.toPersistence(partial),
            updateAt: new Date().toISOString(),
        };

        const updated = await this.incidentModel
            .findByIdAndUpdate(id, update, { new: true })
            .lean()
            .exec();

        return updated ? EventMapper.toDomain(updated) : null;
    }

    search(filters: EventQueryFilters): Promise<EventMonitor[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Backend pagination over the events collection: applies optional filters,
     * sorts by most recent, and returns the page plus total-count metadata.
     * Runs the page query and the count concurrently to keep latency low.
     */
    async findPaginated(filters: EventListFilters): Promise<PaginatedResult<EventMonitor>> {
        const page = normalizePage(filters.page);
        const limit = normalizeLimit(filters.limit);
        const skip = (page - 1) * limit;

        const query: FilterQuery<EventSchemaClass> = {};
        if (filters.originApplication) query.originApplication = filters.originApplication;
        if (filters.eventType) query.eventType = filters.eventType;
        if (filters.severity) query.severity = filters.severity;
        if (filters.from || filters.to) {
            query.occurredDateAt = {};
            if (filters.from) query.occurredDateAt.$gte = filters.from;
            if (filters.to) query.occurredDateAt.$lte = filters.to;
        }

        const [docs, total] = await Promise.all([
            this.incidentModel
                .find(query)
                .sort({ occurredDateAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.incidentModel.countDocuments(query).exec(),
        ]);

        return {
            data: docs.map((doc) => EventMapper.toDomain(doc)),
            meta: buildPaginationMeta(total, page, limit),
        };
    }
}
