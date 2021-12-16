import { getRepository } from 'typeorm'
import { leftJoinRelations, RelationWithQuery } from './index'
import { groupBy } from '../array-utils'

export async function loadRelationsOneToMany(
  entity: string | Function,
  targetEntityName: string,
  relation: string | RelationWithQuery,
  entities: any[]
) {
  const name = typeof relation === 'string' ? relation : relation.name
  const refKey =
    typeof relation === 'string'
      ? _getRefKey(entity, targetEntityName, name)
      : relation.refKey || _getRefKey(entity, targetEntityName, name)
  if (!refKey) return

  let qb =
    typeof relation === 'string' || relation.qb == null
      ? getRepository(entity).createQueryBuilder(name)
      : relation.qb

  if (typeof relation !== 'string' && relation.joins != null) {
    qb = leftJoinRelations(qb, relation.joins!)
  }

  const items: any[] = await qb
    .andWhere(`${qb.alias}.${refKey} IN (:...ids)`, {
      ids: entities.map(x => x.id),
    })
    .getMany()

  return { name, items: groupBy(items, refKey), defaultValue: [] }
}

// リレーション先のentityへの外部キー名を取得
function _getRefKey(
  entity: string | Function,
  targetEntityName: string,
  relation: string
): string | undefined {
  return getRepository(entity).metadata.relations.find(
    r =>
      r.inverseSidePropertyPath === relation &&
      (r.type as Function).name === targetEntityName
  )?.foreignKeys[0]?.columnNames[0]
}
