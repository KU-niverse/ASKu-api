import { Request, Response, NextFunction } from 'express';
import { Debate, DebateHistory, DebateHistoryType } from "../models/debateModel";

interface User {
  id: number;
}

interface DebateRequest extends Request {
  user: User[];
}

interface DebateHistoryRequest extends Request {
  user: User[];
  debate_message: DebateHistoryType;
}

// 토론 생성하기
export const debatePostMid = async (req: DebateRequest, res: Response) => {
  try {
    if (!req.body.subject) {
      res.status(400).send({success: false, message: "토론 제목을 입력하세요."});
    } else {
      const doc_id = await Debate.getIdByTitle(decodeURIComponent(req.params.title));
      const newDebate = new Debate({
        doc_id: doc_id,
        user_id: req.user[0].id,
        subject: req.body.subject,
      });
      const result = await Debate.createDebate(newDebate);
      res.status(200).send({success: true, message: "토론을 생성하였습니다.", data: result});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방에서 메시지 입력
export const historyPostMid = async (req: DebateHistoryRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.body.content) {
      res.status(400).send({success: false, message: "메시지 내용을 입력하세요."});
    } else {
      const newHistory = new DebateHistory({
        debate_id: Number(req.params.debate),
        user_id: Number(req.user[0].id),
        content: decodeURIComponent(req.body.content),
      });
      req.debate_message = await DebateHistory.createHistory(newHistory);
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방 목록 조회 (문서별 최신순)
export const debateGetMid = async (req: Request, res: Response) => {
  try {
    const debates = await Debate.getAllDebateBycreate(decodeURIComponent(req.params.title));
    res.status(200).send({success: true, message: "토론방 목록을 조회하였습니다.", data: debates});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방 목록 조회 (전체 최신순)
export const debateGetAllMid = async (req: Request, res: Response) => {
  try {
    const debates = await Debate.getAllDebateByEdit();
    res.status(200).send({success: true, message: "전체 최신 수정순 토론방 목록을 조회하였습니다.", data: debates});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};


// 토론방 메시지 조회
export const historyGetMid = async (req: Request, res: Response) => {
  try {
    const histories = await DebateHistory.getAllHistory(Number(req.params.debate));
    res.status(200).send({success: true, message: "토론 메시지를 조회하였습니다.", data: histories});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방 검색 (특정 문서 안)
export const debateSearchGetMid = async (req: Request, res: Response) => {
  try {
    const regex = /[\{\}\[\]?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // eslint-disable-line
    const query = req.params.query.trim().replace(regex, '');
    if (!query) {
      res.status(400).send({success: false, message: "잘못된 검색어입니다."});
    } else {
      const debates = await Debate.searchDebateWithDoc(decodeURIComponent(req.params.title), decodeURIComponent(query));
      res.status(200).send({success: true, message: "토론방 검색에 성공하였습니다.", data: debates});
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방 검색 (전체)
export const debateSearchAllGetMid = async (req: Request, res: Response) => {
  try {
    const regex = /[\{\}\[\]?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // eslint-disable-line
    const query = req.params.query.trim().replace(regex, '');
    if (!query) {
      res.status(400).send({success: false, message: "잘못된 검색어입니다."});
    } else {
      const debates = await Debate.searchDebate(decodeURIComponent(query));
      res.status(200).send({success: true, message: "토론방 검색에 성공하였습니다.", data: debates});
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};


// 토론방 종결
export const debateEndPostMid = async (req: Request, res: Response) => {
  try {
    const result = await Debate.endDebate(Number(req.params.debate));
    if (!result) {
      res.status(400).send({success: false, message: "이미 종료된 토론방입니다."});
    } else {
      res.status(200).send({success: true, message: "토론방을 종료하였습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};
