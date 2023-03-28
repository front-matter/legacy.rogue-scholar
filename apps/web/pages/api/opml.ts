import { readFileSync } from 'fs'
import * as jsonify from 'jsonify-that-feed'
import path from 'path'

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readFileSync(
      path.resolve(process.cwd(), 'public/rogue-scholar.opml'),
      { encoding: 'utf8', flag: 'r' }
    )
    const json = [].concat(jsonify.opmlToJson(data).body.outline)
    res.status(200).json(json)
  }
}
