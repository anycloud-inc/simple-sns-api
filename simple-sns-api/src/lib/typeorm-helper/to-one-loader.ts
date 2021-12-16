import { getRepository } from 'typeorm'
import { leftJoinRelations, RelationWithQuery } from './index'

export async function loadRelationsToOne(
  entity: string | Function,
  targetEntityName: string,
  relation: string | RelationWithQuery,
  entities: any[]
) {
  const entityName = typeof entity === 'string' ? entity : entity.name
  const refKey = _getRefKey(entityName, targetEntityName, relation)
  if (refKey) return _getItems(refKey, entityName, entities, relation)

  const reverseRefKey = _getRefKey(targetEntityName, entityName, relation, {
    reverse: true,
  })
  if (reverseRefKey)
    return _getItems(reverseRefKey, entityName, entities, relation, {
      reverse: true,
    })
}

async function _getItems(
  refKey: string,
  entityName: string,
  entities: any[],
  relation: string | RelationWithQuery,
  { reverse = false } = {}
) {
  const relationName = typeof relation === 'string' ? relation : relation.name
  let qb =
    typeof relation === 'string' || relation.qb == null
      ? getRepository(entityName).createQueryBuilder(relationName)
      : relation.qb

  if (typeof relation !== 'string' && relation.joins != null) {
    qb = leftJoinRelations(qb, relation.joins!)
  }

  const itemKey = reverse ? 'id' : refKey
  const entityKey = reverse ? refKey : 'id'

  const items: any[] = await qb
    .andWhere(`${qb.alias}.${itemKey} IN (:...ids)`, {
      ids: entities.map(x => x[entityKey]),
    })
    .getMany()
  const itemsWithKey = reverse
    ? entities.reduce((prev, curr) => {
        const item = items.find(item => item.id === curr[refKey])
        prev[curr.id] = item
        return prev
      }, {})
    : items.reduce((prev, curr) => {
        prev[curr[refKey]] = curr
        return prev
      }, {})

  return {
    name: relationName,
    items: itemsWithKey,
    defaultValue: null,
  }
}

// リレーション先のentityへの外部キー名を取得
function _getRefKey(
  entityName: string,
  targetEntityName: string,
  relation: string | RelationWithQuery,
  { reverse = false } = {}
): string | undefined {
  const relationName = typeof relation === 'string' ? relation : relation.name
  return getRepository(entityName).metadata.relations.find(r => {
    const propertyPath = reverse ? r.propertyPath : r.inverseSidePropertyPath
    return (
      propertyPath === relationName &&
      (r.type as Function).name === targetEntityName
    )
  })?.foreignKeys[0]?.columnNames[0]
}
