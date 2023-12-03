import { OkPacket, RowDataPacket } from "mysql2/promise";
import pool from "../config/db";

interface DebateType {
  doc_id: number;
  user_id: number;
  subject: string;
}

export interface DebateHistoryType {
  debate_id: number;
  user_id: number;
  content: string;
}

export class Debate implements DebateType {
  doc_id: number;
  user_id: number;
  subject: string;
  
  constructor({doc_id, user_id, subject}: DebateType) {
    this.doc_id = doc_id;
    this.user_id = user_id;
    this.subject = subject;
  }
  
  // id를 입력하면 해당 id의 debate 반환하는 함수
  static async getDebate(id: number) {
    const row = await pool.query(
      `SELECT * FROM debates WHERE id = ?`,
      [id]
    );
    return row[0];
  }
  
  static async getIdByTitle(title: string) {
    const [result] = await pool.query(
      `SELECT id FROM wiki_docs WHERE title = ?`,
      [title]
    ) as RowDataPacket[];
    return result.id;
  }
  
  // 새로운 debate를 생성하는 함수
  static createDebate = async (newDebate: DebateType) => {
    const [result] = await pool.query("INSERT INTO debates SET ?", newDebate) as OkPacket[];
    const id = result.insertId;
    return Debate.getDebate(id);
  };
  
  // debate 목록을 검색하는 함수 (한 문서 내부)
  static searchDebateWithDoc = async (title: string, query: string) => {
    const doc_id = await Debate.getIdByTitle(title);
    const result = await pool.query(
      `SELECT * FROM debates
      WHERE doc_id = ? AND subject LIKE ?
      ORDER BY created_at DESC`,
      [doc_id, `%${query}%`]
    );
    return result[0];
  };

  // debate 목록을 검색하는 함수 (전체)
  static searchDebate = async (query: string) => {
    const result = await pool.query(
      `SELECT debates.*, wiki_docs.title 
      FROM debates
      INNER JOIN wiki_docs
      ON debates.doc_id = wiki_docs.id
      WHERE debates.subject LIKE ?
      ORDER BY debates.created_at DESC`,
      [`%${query}%`]
    );
    return result[0];
  };

  // debate를 종료시키는 함수
  static endDebate = async (id: number) => {
    const flag = await pool.query(
      `SELECT done_or_not FROM debates WHERE id = ?`,
      [id]
    ) as RowDataPacket;
    if (flag[0][0].done_or_not) {
      return 0;
    } else {
      const date = new Date();
      date.setHours(date.getHours()+9);
      const result = await pool.query(
        `UPDATE debates SET done_or_not = 1, done_at = ? WHERE id = ?`,
        [date.toISOString().slice(0, 19).replace('T', ' '), id]
      );
      return result;
    }
  };
    
  // debate 목록을 조회하는 함수 (최근 생성순)
  static getAllDebateBycreate = async (title: string) => {
    const doc_id = await Debate.getIdByTitle(title);
    const result = await pool.query(
      `SELECT * FROM debates WHERE doc_id = ? ORDER BY created_at DESC`,
      [doc_id]
    );
    return result[0];
  };

  // debate 목록을 조회하는 함수 (전체 최근 수정순)
  static getAllDebateByEdit = async () => {
    const result = await pool.query(
      `SELECT debates.*, wiki_docs.title 
      FROM debates INNER JOIN wiki_docs
      ON debates.doc_id = wiki_docs.id
      ORDER BY debates.recent_edited_at DESC`
    );
    return result[0];
  };
  
}

export class DebateHistory implements DebateHistoryType {
  debate_id: number;
  user_id: number;
  content: string;
  
  constructor({debate_id, user_id, content}: DebateHistoryType) {
    this.debate_id = debate_id;
    this.user_id = user_id;
    this.content = content;
  }
  
  // id를 입력하면 해당 id의 debate_history 반환하는 함수
  static async getHistory(id: number) {
    const [rows] = await pool.query(
      `SELECT * FROM debate_history WHERE id = ?`,
      [id]
    ) as RowDataPacket[];
    return rows[0] as DebateHistoryType;
  }
  
  // 새로운 history를 생성하는 함수
  static createHistory = async (newHistory: DebateHistoryType) => {
    const [result] = await pool.query("INSERT INTO debate_history SET ?", newHistory) as OkPacket[];
    const date = new Date();
    date.setHours(date.getHours()+9);
    await pool.query(
      `UPDATE debates SET recent_edited_at = ? WHERE id = ?`,
      [date.toISOString().slice(0, 19).replace('T', ' '), newHistory.debate_id]
    );
    const id = result.insertId;
    return DebateHistory.getHistory(id);
  };
  
    
  // 특정 debate의 debate_history를 조회하는 함수
  static getAllHistory = async (debate_id: number) => {
    const result = await pool.query(
      `SELECT debate_history.*, users.nickname, badges.image AS badge_image
      FROM debate_history 
      INNER JOIN users ON debate_history.user_id = users.id
      INNER JOIN badges ON users.rep_badge = badges.id
      WHERE debate_id = ? 
      ORDER BY created_at`,
      [debate_id]
    );
    return result[0];
  }; 
}








