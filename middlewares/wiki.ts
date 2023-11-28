import * as Wiki from "../models/wikiModel.js";
import { getWikiContent } from "../controllers/wikiController.js";
import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from 'mysql2/promise';

interface CreateHistoryMidRequest extends Request {
  body: {
    is_q_based?: number;
    is_rollback?: number;
    index_title?: string;
    qid?: number;
    types_and_conditions?: any;
  };
  user: Array<{ id: number;
    login_id: string;
    name: string;
    stu_id: string;
    email: string;
    password: string;
    nickname: string;
    rep_badge?: number | null;
    created_at: string;
    point: number;
    is_admin: boolean;
    restrict_period?: string | null;
    restrict_count: number;
    uuid: string;
    is_deleted: boolean;  }>; 
  doc_id: number; 
  text_pointer: string;
  summary: string; 
  count: number; 
  diff: number; 
  version: number;
  is_rollback: number;
  is_q_based: number; 
  message: string;
};

// 위키 히스토리 생성 미들웨어
export const createHistoryMid = async (req:Request, res: Response, next: NextFunction) => {
  // 프론트에서 질문 기반 수정이면 꼭 req.body.is_q_based = 1와 req.body.qid 넣어주기
  try {
    const is_q_based =
      req.body.is_q_based !== undefined
        ? req.body.is_q_based
        : 0;
    const is_rollback = (req as CreateHistoryMidRequest).is_rollback !== undefined ? (req as CreateHistoryMidRequest).is_rollback : 0;
    const index_title = req.body.index_title !== undefined ? req.body.index_title : "전체";

    const new_wiki_history = new Wiki.Wiki_history({
      user_id: (req as CreateHistoryMidRequest).user[0].id,
      doc_id: (req as CreateHistoryMidRequest).doc_id,
      text_pointer: (req as CreateHistoryMidRequest).text_pointer,
      summary: (req as CreateHistoryMidRequest).summary,
      count: (req as CreateHistoryMidRequest).count,
      diff: (req as CreateHistoryMidRequest).diff,
      version: (req as CreateHistoryMidRequest).version,
      is_q_based: is_q_based,
      is_rollback: is_rollback,
      index_title: index_title,
    });

    const wiki_history_id = await Wiki.Wiki_history.create(new_wiki_history);
    (req as CreateHistoryMidRequest).is_q_based = is_q_based;

    // res message 정의 (롤백 제외)
    (req as CreateHistoryMidRequest).message = "위키 히스토리를 생성하였습니다.";

    /* 알림 변수 정의*/
    if (!req.body.types_and_conditions) {
      // type_id: 6(글 생성)의 경우 newWikiPostMid에서 이미 변수가 정의됨
      req.body.types_and_conditions = [];
    }

    // 질문 기반 수정 -> type_id: 2, 3
    if (is_q_based == 1) {
      // 답변 생성
      if (req.body.qid !== undefined) {
        Wiki.Wiki_history.createAnswer(wiki_history_id, req.body.qid);
        req.body.types_and_conditions.push([2, req.body.qid]);
        req.body.types_and_conditions.push([3, req.body.qid]);
      }
    }

    // 100자 이상 수정 -> type_id: 5
    if ((req as CreateHistoryMidRequest).diff >= 100) {
      req.body.types_and_conditions.push([5, -1]);
    }

    // 비정상/반복적 수정 -> type_id: 8 (비정상 여부 확인은 newNotice에서 함)
    req.body.types_and_conditions.push([8, -1]);

    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 히스토리 생성 중 오류" });
  }
};

// 위키 작성 기여도 지급 미들웨어
export const wikiPointMid = async (req:Request, res: Response, next: NextFunction) => {
  try {
    Wiki.Wiki_point.givePoint((req as CreateHistoryMidRequest).user[0].id, (req as CreateHistoryMidRequest).diff, (req as CreateHistoryMidRequest).is_q_based);
    // 알림
    next();
    //res.status(200).json({ message: "위키 작성 기여도 지급 성공" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 작성 기여도 지급 중 오류" });
  }
};

// 위키 최신 내용 db 업데이트 미들웨어
export const wikiChangeRecentContentMid = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id) as RowDataPacket[];
    const title = req.params.title.replace(/\/+/g, "_");
    const version = rows[0].version;
    let text = "";

    text = await getWikiContent(res, title, version);

    await Wiki.Wiki_docs.updateRecentContent(doc_id, text);
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "최신 내용 업데이트 중 오류" });
  }
};
