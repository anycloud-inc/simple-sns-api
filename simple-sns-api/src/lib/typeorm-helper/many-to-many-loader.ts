import { getRepository } from 'typeorm'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { RelationWithQuery } from './index'

export async function loadRelationsManyToMany(
  meta: RelationMetadata,
  relation: string | RelationWithQuery,
  entities: any[]
) {
  const joinTableName = meta.inverseSidePropertyPath
  if (!joinTableName) return

  const name = typeof relation === 'string' ? relation : relation.name

  const qb =
    typeof relation === 'string' || relation.qb == null
      ? getRepository(meta.type).createQueryBuilder(name)
      : relation.qb

  const entityIds = entities.map(x => x.id)

  const items: any[] = await qb
    .leftJoinAndSelect(`${qb.alias}.${joinTableName}`, joinTableName)
    .where(`${joinTableName}.id IN (:...ids)`, {
      ids: entityIds,
    })
    .getMany()

  return {
    name,
    items: _groupBy(items, entityIds, joinTableName),
    defaultValue: [],
  }
}

function _groupBy(
  array: Array<{ [k: string]: any }>,
  entityIds: Array<number>,
  tableName: string
) {
  return array.reduce((acc, item) => {
    const keyValues: Array<number> = item[tableName]
      .filter((x: any) => entityIds.includes(x.id))
      .map((x: any) => x.id)
    keyValues.forEach(keyValue => {
      if (acc[keyValue] == null) {
        acc[keyValue] = [item]
      } else {
        acc[keyValue].push(item)
      }
    })
    return acc
  }, {})
}
