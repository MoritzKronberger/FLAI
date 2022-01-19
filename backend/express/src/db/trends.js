import { query } from '../db.js'

const getTrends = async (endDay, days, userId) => {
  console.log(endDay)
  const result = await query(
    `SELECT "day", COALESCE("time_learnt", '00:00:00') As "time_learnt"
     FROM   "get_time_learnt_by_day"
     WHERE  "day" <= $1::DATE
            AND "day" > ($1::DATE - ($2::INTEGER || ' days')::INTERVAL)
            AND "user_id" = $3::UUID`,
    [endDay, days, userId]
  )
  return result
}

export { getTrends }
export default { getTrends }
