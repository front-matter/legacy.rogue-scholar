import path from 'path'
import { readFileSync } from 'fs'
import * as jsonify from 'jsonify-that-feed'
import { Lexend_Peta } from '@next/font/google'

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readFileSync(
      path.resolve(process.cwd(), 'public/rogue-scholar.opml'),
      { encoding: 'utf8', flag: 'r' }
    )
    const json = jsonify.opmlToJson(data)
    res.status(200).json(json)
  }
}
