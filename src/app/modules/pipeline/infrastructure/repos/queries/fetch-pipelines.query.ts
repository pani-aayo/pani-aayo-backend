import { Prisma } from '../../../../../../generated/prisma/client';
import { FindManyParams } from '../../../../../../shared/interfaces';
import { PrismaService } from '../../../../../../shared/prisma/prisma.service';

export interface PipelineOperatorSummary {
  code: string;
  name: string;
  email: string;
  assignedAt: Date;
}

export interface FetchedPipeline {
  id: number;
  code: string;
  name: string;
  areaServed: string;
  flowRate: number | null;
  description: string | null;
  status: string;
  lastOpen: Date | null;
  totalSubs: number | null;
  routineSummary: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
  operatorsCount?: number;
  operators?: PipelineOperatorSummary[];
}

export type FetchPipelinesParams = FindManyParams & { includeOperators?: boolean };

export async function fetchPipelinesQuery(
  prisma: PrismaService,
  { skip, take, search, includeOperators }: FetchPipelinesParams,
): Promise<{ items: FetchedPipeline[]; total: number }> {
  const searchClause = search ? Prisma.sql`AND (p.name ILIKE ${`%${search}%`} OR p.area_served ILIKE ${`%${search}%`})` : Prisma.empty;

  const operatorsSelect = includeOperators
    ? Prisma.sql`, COALESCE(oc.total, 0)::int AS "operatorsCount", COALESCE(ops.operators, '[]'::json) AS operators`
    : Prisma.empty;

  const operatorsJoins = includeOperators
    ? Prisma.sql`
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS total
        FROM pipeline_operators po
        WHERE po.pipeline_code = p.code
      ) oc ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(op) AS operators
        FROM (
          SELECT u.code, u.name, u.email, po.created_at AS "assignedAt"
          FROM pipeline_operators po
          JOIN users u ON u.code = po.operator_code
          WHERE po.pipeline_code = p.code
          ORDER BY po.created_at DESC
          LIMIT 3
        ) op
      ) ops ON true
    `
    : Prisma.empty;

  const [items, totalResult] = await Promise.all([
    prisma.$queryRaw<FetchedPipeline[]>`
      SELECT
        p.id,
        p.code,
        p.name,
        p.area_served AS "areaServed",
        p.flow_rate AS "flowRate",
        p.description,
        p.status,
        p.last_open AS "lastOpen",
        p.total_subs AS "totalSubs",
        p.routine_summary AS "routineSummary",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.deleted_at AS "deletedAt",
        p.created_by AS "createdBy",
        p.updated_by AS "updatedBy",
        p.deleted_by AS "deletedBy"
        ${operatorsSelect}
      FROM pipelines p
      ${operatorsJoins}
      WHERE p.deleted_at IS NULL
      ${searchClause}
      ORDER BY p.created_at DESC
      LIMIT ${take} OFFSET ${skip}
    `,
    prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM pipelines p
      WHERE p.deleted_at IS NULL
      ${searchClause}
    `,
  ]);

  return { items, total: totalResult[0]?.count ?? 0 };
}
